<template>
    <page-dialog v-model="visible" size="large" @open="open" @close="close" title="提交借调申请">
        <label-item>
            <label slot="label"><span class="red">*</span>调入平台：</label>
            <el-select v-model="to_channel_id" class="s-width-default">
                <el-option v-for="item in channelList"
                           :value="item.value"
                           :label="item.label"
                           :key="item.value"></el-option>
            </el-select>
        </label-item>
        <el-row class="mt-xs mb-xs">
            <el-button type="primary" size="mini" :disabled="to_channel_id === ''" @click.native="add">添加</el-button>
            <el-button type="primary" size="mini" :disabled="selectData.length === 0" @click.native="delete_goods">删除</el-button>
        </el-row>
        <el-table :data="tableData"
                  max-height="500"
                  class="scroll-bar"
                  border
                  @selection-change="select"
                  highlight-current-row>
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
            <el-table-column label="SKU/SKU别名" inline-template width="100">
                <div>
                    <div>
                        {{row.sku}}
                    </div>
                    <div v-for="item in row.sku_alias">{{item || `--`}}</div>
                </div>
            </el-table-column>
            <el-table-column label="可用库存" inline-template>
                <div>{{row.available_quantity}}</div>
            </el-table-column>
            <el-table-column label="调出平台" inline-template>
                <div>{{row.from_channel_name}}</div>
            </el-table-column>
            <el-table-column label="借调数量" inline-template>
                <div>
                    <integer-input class="width-sm inline"
                                   :min="1"
                                   v-model="row.quantity"></integer-input>
                </div>
            </el-table-column>
            <el-table-column label="审批人" inline-template>
                <div>
                    <el-select v-model="row.audit_id" class="s-width-default">
                        <el-option v-for="item in auditorList[row.from_channel_id]"
                                   :value="item.value"
                                   :label="item.label"
                                   :key="item.value"></el-option>
                    </el-select>
                </div>
            </el-table-column>
        </el-table>
        <label-item class="mt-sm full-width">
            <label slot="label"><span class="red">*</span>借调原因：</label>
            <el-input type="textarea" class="full-width" v-model="reason" placeholder="请填写借调原因" :rows="4"></el-input>
        </label-item>
        <div slot="footer">
            <permission tag="requestButton"
                        req-key="api_batch_allocate"
                        @click.native="sure"
                        :route="apis.url_batch_allocate">
                提交
            </permission>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
        <add-goods v-model="addGoodsVisible"
                   @add-goods="add_goods"
                   :is-third="isThird"
                   :warehouse_id="warehouse_id"
                   :channel_id="to_channel_id"></add-goods>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_channel} from "@/api/request-note";
    import {api_channel_log_all_auditor} from "@/api/warehouse-goods-channel";
    import {api_batch_allocate, url_batch_allocate} from "@/api/overseas-stock";

    export default {
        permission: {
            url_batch_allocate,
        },
        data() {
            return {
                visible: false,
                to_channel_id: '',
                reason: '',
                channelList: [],
                tableData: [],
                selectData: [],
                auditorList: {},
                addGoodsVisible: false,
            }
        },
        mounted() {
            this.get_channel();
            this.get_all_auditor();
        },
        methods: {
            open() {
            },
            get_channel() {
                this.$http(api_get_channel, {}).then(res => {
                    this.channelList = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            get_all_auditor() {
                this.$http(api_channel_log_all_auditor).then(res => {
                    this.auditorList = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            select(selection) {
                this.selectData = selection;
            },
            add() {
                this.addGoodsVisible = true;
            },
            delete_goods() {
                this.selectData.forEach(row => {
                    let find = this.tableData.findIndex(stock => row.sku_id === stock.sku_id && row.from_channel_id === stock.from_channel_id);
                    if(find !== -1) {
                        this.tableData.splice(find, 1);
                    }
                });
            },
            add_goods(goods) {
                goods.forEach(row => {
                    let find = this.tableData.find(stock => stock.sku_id === row.sku_id && stock.from_channel_id === row.from_channel_id);
                    if(!find) {
                        this.tableData.unshift(row);
                    }
                });
            },
            sure() {
                if(!this.validate()) {
                    this.$reqKey('api_batch_allocate', false);
                    return;
                }
                let data = this.get_params();
                this.$http(api_batch_allocate, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.visible = false;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(()=> {
                    setTimeout(()=> {
                        this.$reqKey('api_batch_allocate', false);
                    }, 200);
                });
            },
            get_params() {
                this.reason = this.reason.trim();
                let data = {
                    to_channel_id: this.to_channel_id,
                    remark: this.reason,
                    warehouse_id: this.warehouse_id,
                    detail: this.tableData.map(row => {
                        return {
                            sku_id: row.sku_id,
                            sku: row.sku,
                            from_channel_id: row.from_channel_id,
                            quantity: row.quantity,
                            audit_id: row.audit_id,
                            available_quantity: row.available_quantity,
                        }
                    }),
                };
                return data;
            },
            validate() {
                this.reason = this.reason.trim();
                if (this.to_channel_id === '') {
                    this.$message({type: 'error', message: '请选择调入平台'});
                    return false;
                }
                if (this.reason === '') {
                    this.$message({type: 'error', message: '请填写借调原因'});
                    return false;
                }
                if(this.tableData.length === 0) {
                    this.$message({type: 'error', message: '请添加需要借调的商品'});
                    return false;
                }

                return !this.tableData.some((row,index) => {
                    row.quantity = Number(row.quantity);
                    if(isNaN(row.quantity) || row.quantity < 1 || row.quantity > Number(row.available_quantity) || row.audit_id === '') {
                        if(row.audit_id === '') {
                            this.$message({type: 'error', message:`第${index+1}行没有选择审核人`});
                        } else {
                            this.$message({type: 'error', message: `第${index+1}行调拨数量为无效数据`});
                        }
                        return true;
                    } else {
                        return false;
                    }
                });
            },
            sku_image(images) {
                if (!!images) {
                    return images.replace('_60x60.', '_200x200.');
                }
                return ""
            },
            close() {
                this.to_channel_id = '';
                this.reason = '';
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
            isThird: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
            addGoods: require('./add-goods.vue').default,
        }
    }
</script>