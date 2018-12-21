<template>
    <page-dialog title="添加出库记录" v-model="show" size="large"
                 @open="open" @close="close"
                 :close-on-click-modal="false">
        <div>
            <label-item label="仓库：" class="ml-sm mr-sm">
                <el-select v-model="addData.warehouse_id" class="width-sm" @change="select_warehouse">
                    <el-option v-for="(item, index) in warehouses"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="来源单号：" class="ml-sm mr-sm">
                <el-input :placeholder="`请输出来源单号...`" v-model="addData.purchase_order_id" class="inline"></el-input>
            </label-item>
            <label-item label="出库类型：" class="ml-sm mr-sm">
                <el-select class="inline width-sm" v-model="addData.type">
                    <el-option v-for="item in inputList" :key="item.value"
                               :value="item.value" :label="item.label"></el-option>
                </el-select>
            </label-item>
            <div class="inline ml-sm" style="margin-left: 34px">备注：</div>
            <el-input
                    class="inline"
                    style="width: 200px"
                    :rows="1"
                    type="textarea"
                    placeholder="请输入内容"
                    v-model="addData.textarea">
            </el-input>
            <el-row class="el-form-item is-required">
                <div class="mb-sm mt-sm">
                    <div class="fl">
                        <label-item
                                class="inline ml-sm"
                                label="快速添加：">
                            <el-input
                                    v-model="enterVal"
                                    :disabled="this.addData.warehouse_id === ''"
                                    @keyup.enter.native="id_enter">
                            </el-input>
                        </label-item>
                        <el-button
                                type="primary"
                                @click="addProduct"
                                :disabled="addData.warehouse_id === '' || addData.type === '' "
                                size="mini">添加产品
                        </el-button>
                        <el-button
                                type="primary"
                                @click="deleteProduct"
                                size="mini">删除产品
                        </el-button>
                        <permission tag="ElButton" type="primary"
                                    :route="apis.url_stock_out_import"
                                    :disabled="addData.warehouse_id === ''"
                                    @click.native="goods_import"
                                    size="mini">导入商品
                        </permission>
                    </div>
                </div>
            </el-row>
            <el-table
                    border
                    :data="editData"
                    v-for="item in list"
                    :key="item"
                    highlight-current-row
                    max-height="400"
                    class="mb-sm scroll-bar"
                    @select="selected"
                    @select-all="selectedAll">
                <el-table-column
                        type="selection"
                        width="35">
                </el-table-column>
                <el-table-column
                        label="SKU"
                        inline-template>
                    <ui-tip :content="row.sku"></ui-tip>
                </el-table-column>
                <el-table-column
                        width="510"
                        inline-template
                        label="商品名称">
                    <span>{{row.in_spu_name}}</span>
                </el-table-column>
                <el-table-column width="80" label="可用库存" inline-template>
                    <div>{{row.available_quantity}}</div>
                </el-table-column>
                <el-table-column
                        width="100"
                        inline-template
                        label="出库数量">
                    <integer-input v-model="row.quantity"
                                   @blur="blur_width(row.quantity)"
                                   :min="1">
                    </integer-input>
                </el-table-column>
                <el-table-column
                        width="100"
                        inline-template
                        label="单价">
                    <ui-tip :content="row.in_cost_price" :width="98"></ui-tip>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="备注">
                    <el-input v-model="row.remark"></el-input>
                </el-table-column>
            </el-table>
        </div>
        <div slot="footer" class="ml-sm mr-sm">
            <request-button req-key="keepAdd" @click.native="keep">确 定</request-button>
            <el-button size="mini" @click.native="show=false">关 闭</el-button>
        </div>
        <add-goods v-model="goodsDialog" @add-goods="goods_submit" :warehouse_id="addData.warehouse_id"
                   :is_multi_warehouse="is_multi_warehouse"></add-goods>
        <goods-import v-model="importVisible"
                      :warehouse_id="addData.warehouse_id"
                      @files-data="import_data"
                      :import-info="importInfo"></goods-import>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_post_stock, stock_types, url_stock_out_import} from '@/api/stock-out';
    import {api_get_goods} from '@/api/stock-in';
    import {api_stock_in_out_warehouse} from '@/api/entrepot-picking';

    export default {
        permission: {
            url_stock_out_import,
        },
        data() {
            return {
                list: [1],
                addData: {
                    warehouse_id: '',
                    purchase_order_id: '',
                    type: 24,
                    textarea: '',
                    remark: '',
                },
                inputList: [{label: '其他出库', value: 24}],
                warehouses: [],
                show: this.value,
                textarea: "",
                goodsDialog: false,
                importVisible: false,
                importInfo: {
                    code: 'stock_out_import_goods',
                    file_url: '出库导入商品模板',
                },
                editData: [],
                remark: '',
                selectAdd: [],
                is_multi_warehouse: 0,
                sku_id: '',
                isdisabled: false,
                enterVal: '',
            }
        },
        mounted() {
//            this.get_types();  todo 出库类型暂未使用
        },
        methods: {
            id_enter() {// ----------------快速添加
                if (this.enterVal === '') return;
                let warehouse_id = this.addData.warehouse_id;
                typeof this.enterVal === 'string' && (this.enterVal = this.enterVal.trim());
                let sku = this.enterVal;
                this.$http(api_get_goods, {sku: sku, warehouse_id: warehouse_id}).then(res => {
                    let list = this.editData.find(item => item.sku_id === res.sku_id);
                    if (!!list) {
                        list.quantity++;
                        this.enterVal = '';
                    } else {
                        this.$set(res, 'quantity', 1);
                        this.$set(res, 'in_spu_name', res.spu_name);
                        this.editData.push(res);
                        this.enterVal = '';
                    }
                    this.$message({type: 'success', message: `添加成功`})
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            open() {
                this.warehouses_init();
            },
            close() {
                this.addData = {
                    warehouse_id: '',
                    purchase_order_id: '',
                    type: 24,
                    textarea: '',
                    remark: '',
                };
                this.enterVal = '',
                    this.editData.length = 0;
            },
            select_warehouse(val) {
                this.addData.warehouse_id = val;
            },
            increased() {
                let obj = {
                    sku: '',
                    in_spu_name: '',
                    quantity: 0,
                    in_cost_price: 0,
                    remark: '',
                };
                this.editData.push(obj);
            },
            warehouses_init() {
                let data = {
                    type: [1,2,3,6,7,8,9,10,12],
                };
                this.$http(api_stock_in_out_warehouse, data).then(res => {
                    this.warehouses = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            get_types() {
                this.$http(stock_types).then(res => {
                    this.inputList = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },

            keep() {//----------------确定
                let list = this.editData.filter(row => !!row.sku_id).map(row => {
                    typeof row.remark === 'string' && (row.remark = row.remark.trim());
                    return {
                        sku: row.sku,
                        sku_id: row.sku_id,
                        quantity: row.quantity,
                        price: row.in_cost_price,
                        remark: row.remark || '',
                    }
                });
                Object.keys(this.addData).forEach(key => {
                    if (typeof this.addData[key] === 'string') {
                        this.addData[key] = this.addData[key].trim();
                    }
                });
                let promes = {
                    warehouse_id: this.addData.warehouse_id,
                    type: this.addData.type,
                    original_code: this.addData.purchase_order_id,
                    remark: this.addData.textarea,
                    details: list
                };
                this.$http(api_post_stock, promes).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.$emit('add');
                    this.show = false;
                }).catch(code => {
                    this.$message({
                        type: "warning",
                        message: code.message || code
                    });
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey(`keepAdd`, false);
                    }, 200);
                });
            },
            blur_width(val) {//----------------失去焦点时
                if (val === '') return this.$message({type: "warning", message: '数量不能为空'});
                if (val <= 0) return this.$message({type: "warning", message: '数量不能小于或等于0'});
            },
            selected(selection) {//----------------单选
                this.selectAdd = selection;
            },
            selectedAll(selection) {//----------------多选
                this.selectAdd = selection;
            },
            addProduct() {//----------------添加产品
                this.goodsDialog = true;
            },
            goods_submit(val, val2) {//----------------子组件添加商品传过来的
                val.forEach(row => {
                    let flag = this.editData.find(item => item.sku_id === row.sku_id);
                    if (!!flag) {
                        flag++
                    } else {
                        this.$set(row, 'quantity', 1);
                        this.editData.push(row);
                    }
                    this.$message({type: 'success', message: `添加成功`})
                });
            },
            import_data(data) {
                data.forEach(row => {
                    let flag = this.editData.find(item => item.sku_id === row.sku_id);
                    if (!!flag) {
                        console.log(flag);
                        this.$set(flag, 'quantity', row.quantity);
                    } else {
                        this.editData.push(row);
                    }
                    this.$message({type: 'success', message: `添加成功`})
                });
            },
            deleteProduct() {//----------------删除产品
                this.selectAdd.forEach(item => {
                    this.editData.forEach((row, index) => {
                        if (item.sku_id === row.sku_id) {
                            this.editData.splice(index, 1);
                        }
                    })
                })
            },
            goods_import() {
                this.importVisible = true;
            }
        },
        watch: {
            show(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.show = val;
            },
        },

        props: {
            value: {
                required: true,
                type: Boolean
            }
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default,
            goodsImport: require('../stock-in/goods-import.vue').default,
            addGoods: require('../stock-in/add-goods.vue').default,
            pageDialog: require('@/components/page-dialog.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
            labelItem: require('@/components/label-item.vue').default,
        }
    }
</script>
