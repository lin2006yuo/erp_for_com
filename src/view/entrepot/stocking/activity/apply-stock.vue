<template>
    <page-dialog v-model="visible"
                 class="c-apply-stock"
                 size="large" @open="open" @close="close" title="提交备货申请">
        <el-row>
            <label-item label="备货仓：" class="inline">
                <el-select v-model="stockData.warehouse_id" class="width-xs">
                    <el-option v-for="item in warehouseList"
                               :value="item.value"
                               :label="item.label"
                               :key="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="备货平台：" class="inline ml-sm">
                <el-select v-model="stockData.channel_id" class="s-width-default">
                    <el-option v-for="item in channelList"
                               :value="item.value"
                               :label="item.label"
                               :key="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="活动时间：" class="inline ml-sm">
                <el-date-picker v-model="stockData.start_time"
                                type="date"
                                placeholder="开始时间"
                                :picker-options="pickerStart"
                                class="inline date ml-mini"></el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker v-model="stockData.end_time"
                                type="date"
                                placeholder="结束时间"
                                :picker-options="pickerEnd"
                                class="inline date mr-sm"></el-date-picker>
            </label-item>
        </el-row>
        <el-row class="mt-xs mb-xs">
            <el-button type="primary" size="mini" class="inline" @click.native="add_goods">添加</el-button>
            <el-button type="primary" size="mini" class="inline ml-sm" :disabled="selectData.length === 0"
                       @click.native="delete_goods">删除
            </el-button>
            <el-button type="primary" size="mini" class="inline ml-sm"
                       @click.native="import_goods">商品导入
            </el-button>
        </el-row>
        <el-table :data="tableData"
                  class="scroll-bar"
                  border
                  highlight-current-row
                  @selection-change="select"
                  v-resize="{height: 150}">
            <el-table-column
                    align="center"
                    type="selection"
                    min-width="30">
            </el-table-column>
            <el-table-column label="图片" inline-template width="80">
                <el-popover
                        placement="right"
                        width="200"
                        trigger="hover">
                    <img v-lazy="sku_image(row.thumb)" width="200" height="200"/>
                    <div slot="reference">
                        <img v-lazy="row.thumb" width="60" height="60"/>
                    </div>
                </el-popover>
            </el-table-column>
            <el-table-column label="SKU/SKU别名" inline-template width="120">
                <div>
                    <div>
                        {{row.sku}}
                    </div>
                    <div v-for="item in row.sku_alias">{{item || `--`}}</div>
                </div>
            </el-table-column>
            <el-table-column label="商品名称" inline-template>
                <div>{{row.spu_name}}</div>
            </el-table-column>
            <el-table-column label="备货数量" inline-template width="120">
                <div>
                    <ui-limit-number class="width-xs inline"
                                     :min="1"
                                     v-model.number="row.submit_quantity"></ui-limit-number>
                </div>
            </el-table-column>
            <el-table-column label="备货类型" inline-template width="120">
                <div>
                    <el-radio-group v-model="row.type">
                        <el-radio class="ml-15 mb-xs" :label="1">到货锁定</el-radio>
                        <el-radio :label="2">边卖边采</el-radio>
                    </el-radio-group>
                </div>
            </el-table-column>
        </el-table>
        <div slot="footer">
            <permission tag="requestButton"
                        req-key="activity_apply_stock"
                        :route="apis.url_local_stocking_create"
                        @click="sure"
                        type="primary"
                        size="mini">提交
            </permission>
            <el-button size="mini" @click.native="visible = false">关闭</el-button>
        </div>
        <add-goods v-model="addGoodsVisible" @selected="goods_submit"></add-goods>
        <import-excel v-model="importVisible" :params="importParams" :import-data="importData" @import-finish="import_finish"></import-excel>
    </page-dialog>
</template>
<style lang="stylus">
  .c-apply-stock {
      .ml-15 {
          margin-left: 15px;
      }
  }
</style>
<script>
    import {
        api_local_stocking_create,
        api_local_stocking_import_goods,
        url_local_stocking_create
    } from "@/api/local-stocking";
    import {api_warehouse_info} from "@/api/fba-stock";
    import {api_get_channel} from "@/api/request-note";

    export default {
        permission: {
            url_local_stocking_create,
        },
        data() {
            return {
                visible: false,
                stockData: {
                    warehouse_id: this.warehouse_id || 2,
                    channel_id: '',
                    start_time: '',
                    end_time: '',
                },
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.stockData.end_time) {
                            return time.getTime() > this.stockData.end_time && time.getTime() < Date.now();
                        } else {
                            return time.getTime() < Date.now();
                        }
                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.stockData.start_time) {
                            return time.getTime() < this.stockData.start_time;
                        } else {
                            return time.getTime() < Date.now();
                        }
                    }
                },
                warehouseList: [],
                channelList: [],
                tableData: [],
                selectData: [],
                addGoodsVisible: false,
                importVisible: false,
                importParams: {
                    warehouse_id: this.warehouse_id,
                    extension: 'xlsx',
                },
                importData: {
                    title: '商品Excel导入',
                    file_name: '下载商品导入模板',
                    code: 'import_stock_goods',
                    api: api_local_stocking_import_goods,
                }
            }
        },
        mounted() {
            this.init_warehouses();
            this.get_channel();
        },
        methods: {
            open() {
                this.stockData.warehouse_id = this.warehouse_id || this.stockData.warehouse_id;
                if(this.selectSku && this.selectSku.length !== 0) {
                    this.tableData = this.selectSku.map(row => {
                        return {
                            spu_name: row.spu_name,
                            thumb: row.thumb,
                            sku: row.sku,
                            sku_alias: row.sku_alias,
                            sku_id: row.sku_id,
                            submit_quantity: 1,
                            type: '',

                        }
                    });
                }
            },
            init_warehouses() {
                this.$http(api_warehouse_info, {type: 1}).then(res => {
                    this.warehouseList = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            get_channel() {
                this.$http(api_get_channel, {}).then(res => {
                    this.channelList = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            sure() {
                if (!this.validate()) {
                    this.$reqKey('activity_apply_stock', false);
                    return;
                }
                let data = this.get_params();

                this.$http(api_local_stocking_create, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.visible = false;
                    this.$emit('search');
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('activity_apply_stock', false);
                    }, 200);
                })

            },
            get_params() {
                let data = clone(this.stockData);
                data.start_time && (data.start_time = datef('YYYY-MM-dd', data.start_time / 1000));
                data.end_time && (data.end_time = datef('YYYY-MM-dd', data.end_time / 1000));
                data.details = this.tableData.map(row => {
                    return {
                        type: row.type,
                        sku_id: row.sku_id,
                        submit_quantity: Number(row.submit_quantity),
                    }
                });
                return data;
            },
            validate() {
                if (this.stockData.warehouse_id === '') {
                    this.$message({type: 'error', message: '请选择备货仓库'});
                    return false;
                }
                if (this.stockData.channel_id === '') {
                    this.$message({type: 'error', message: '请选择备货平台'});
                    return false;
                }
                if (this.stockData.start_time === '') {
                    this.$message({type: 'error', message: '请选择活动开始时间'});
                    return false;
                }
                if (this.stockData.end_time === '') {
                    this.$message({type: 'error', message: '请选择活动结束时间'});
                    return false;
                }
                let errorType = '';
                if (this.tableData.some(row => {
                    row.submit_quantity = Number(row.submit_quantity);
                    if (isNaN(row.submit_quantity) || Number(row.submit_quantity) < 1) {
                        errorType = 'quantity';
                        return true;
                    }
                    if (row.type === '') {
                        errorType = 'type';
                        return true;
                    }
                    return false;
                })) {
                    errorType === 'quantity' ?
                        this.$message({type: 'error', message: '申请数量必须为数字且大于0！'}) :
                        this.$message({type: 'error', message: '类型为必填项！'});
                    return false;
                }
                return true;
            },
            select(selection) {
                this.selectData = selection;
            },
            add_goods() {
                this.addGoodsVisible = true;
            },
            sku_image(images) {
                if (!!images) {
                    return images.replace('_60x60.', '_200x200.')
                }
                return ""
            },
            goods_submit(val) {
                val.forEach(data => {
                    data.forEach(row => {
                        let find = this.tableData.find(res => res.sku_id === row.sku_id);
                        if (!find) {
                            this.tableData.unshift({
                                spu_name: row.spu_name,
                                thumb: row.thumb,
                                sku: row.sku,
                                sku_alias: row.sku_alias,
                                sku_id: row.sku_id,
                                submit_quantity: 1,
                                type: '',
                            })
                        } else {
                            this.$set(find, 'submit_quantity', Number(find.submit_quantity) + 1);
                        }
                    })
                });
            },
            delete_goods() {
                this.selectData.forEach(row => {
                    let index = this.tableData.findIndex(item => item.sku === row.sku);
                    this.tableData.splice(index, 1);
                });
            },
            // 导入商品
            import_goods() {
                this.importParams.warehouse_id = this.stockData.warehouse_id;
                this.importVisible = true;
            },
            // 导入商品成功
            import_finish({data}) {
                let warning = [];
                data.forEach(row => {
                    let sku = this.tableData.find(sku => sku.sku_id === row.sku_id);
                    if(!sku) {
                        this.tableData.unshift(row);
                    } else {
                        if(sku.type !== '' && sku.type !== row.type) {
                            warning.push(row.sku);
                            return;
                        }
                        this.$set(sku, 'type', row.type);
                        this.$set(sku, 'submit_quantity', Number(sku.submit_quantity) + Number(row.submit_quantity));
                    }
                });
                if(warning.length > 0) {
                    this.$message({type: 'warning', message: `SKU：${warning.join()}导入类型与已选择类型不符，请检查！`});
                }
            },
            close() {
                Object.keys(this.stockData).forEach(key => {
                    if (this.stockData.hasOwnProperty(key)) {
                        this.stockData[key] = key === 'warehouse_id' ? 2 : '';
                    }
                });
                this.tableData = [];
                this.selectData = [];
            }
        },
        watch: {
            value(val) {
                this.visible = val;
            },
            visible(val) {
                this.$emit('input', val);
            }
        },
        props: {
            value: {},
            warehouse_id: {},
            selectSku: {},
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            pageDialog: require('@/components/page-dialog.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
            addGoods: require('@/view/procurement/plan/add-goods.vue').default,
            uiLimitNumber: require('@/components/ui-limit-number.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
            importExcel: require('@/components/import-excel.vue').default,
        }
    }
</script>