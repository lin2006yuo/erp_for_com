<template>
    <page-dialog title="货位库存转移申请"
                 size="full"
                 class="p-inventory-transfer"
                 @open="open"
                 @close="close"
                 v-model="visible"
                 :close-on-click-modal="false">
        <label-item label="仓库：" class="mb-xs mt-sm">
            <span>{{warehouseName}}</span>
        </label-item>
        <el-table
                class="mt-xs mb-sm scroll-bar"
                border :data="dataTable"
                highlight-current-row
                v-resize="{height:150}"
                @selection-change="select_delete"
                v-loading="loading"
                element-loading-text="玩命加载中...">
            <el-table-column
                    type="selection"
                    :selectable="selectable"
                    width="30">
            </el-table-column>
            <el-table-column label="排序" type="index"></el-table-column>
            <el-table-column label="图片" min-width="70" inline-template>
                <div>
                    <el-popover
                            placement="right"
                            width="200"
                            trigger="hover">
                        <img v-lazy="sku_image(row.thumb)" width="200px" height="200px">
                        <div slot="reference">
                            <img v-lazy="row.thumb" width="60" height="60" style="vertical-align: middle;">
                        </div>
                    </el-popover>
                </div>
            </el-table-column>
            <el-table-column label="货位号"
                             min-width="70"
                             inline-template>
                <div>
                    <ui-tip :content="row.code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    label="SKU/别名"
                    min-width="80"
                    inline-template>

                <div>
                    <div>{{row.sku}}</div>
                    <div>{{row.sku_alias}}</div>
                </div>
            </el-table-column>
            <el-table-column
                    min-width="70"
                    label="商品数量（当前数/冻结数）" inline-template>
                <div>{{row.quantity}}/{{row.hold_quantity}}</div>
            </el-table-column>
            <el-table-column
                    min-width="120"
                    label="商品名称" inline-template>
                <div>
                    {{row.spu_name}}
                </div>
            </el-table-column>
            <el-table-column
                    min-width="60"
                    label="分区功能" inline-template width="120">
                <div>
                    <ui-tip :content="row.warehouse_area_type" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    min-width="60"
                    label="可移动数量" inline-template width="120">
                <integer-input v-model="row.can_shift_quantity" @change="validate_shift_quantity(row)"
                               :min="1"
                               class="width-sm"></integer-input>
            </el-table-column>
        </el-table>
        <div slot="footer">
            <request-button req-key="transferInventory" @click="upload">提交</request-button>
            <el-button size="mini" @click.native="visible = false">关闭</el-button>
        </div>
    </page-dialog>
</template>

<style lang="stylus">
    .arrival-warning-color {
        color: #FF4949;
    }

    .goods-size {
        .el-col.el-col-8 {
            padding: 2px;
            input {
                padding: 0 3px;
            }
        }
    }

    .forecast-img-show {
        i {
            cursor: pointer;
        }
    }
</style>

<script>
    import {
        warehouse_cargo_goods, api_cargo_goods_batch_shift,
    } from '@/api/warehouse-cargo-goods';

    export default {
        data() {
            return {
                visible: false,
                dataTable: [],
                loading: false,
                selectedData: [],
            }
        },
        methods: {
            open() {
                this.init();
            },
            close() {
                this.dataTable = [];
                this.selectedData = [];
            },
            init() {
                this.loading = true;
                let params = {
                    ids: this.selectedIds,
                    page: 1,
                    pageSize: this.pageSize,
                };
                this.$http(warehouse_cargo_goods, params).then(res => {
                    this.dataTable = res.data;
                    this.loading = false;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            select_delete(val) {
                if (val.length !== 0) {
                    this.selectedData = val.filter(row => row.can_shift_quantity !== 0).map(row => {
                        typeof row.can_shift_quantity === 'string' && (row.can_shift_quantity.trim());
                        return {
                            sku_id: row.sku_id,
                            quantity: row.can_shift_quantity,
                            warehouse_cargo_id: row.warehouse_cargo_id,
                        };
                    });
                }
            },
            sku_image(images) {
                if (!!images) {
                    return images.replace('_60x60.', '_200x200.')
                }
                return "";
            },
            upload() {
                if (this.selectedData.length === 0) {
                    this.$message({
                        type: 'error',
                        message: '请选择需要转移的商品！'
                    });
                    this.$reqKey('transferInventory', false);
                    return;
                }
                let data = {
                    warehouse_id: this.warehouse_id,
                    shift_info: this.selectedData,
                };
                this.$http(api_cargo_goods_batch_shift, data).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.visible = false;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code,
                    })
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('transferInventory', false);
                    }, 200);
                })
            },
            select_warehouse() {
                this.init();
            },
            selectable(row) {
                console.log(row);
                return row.can_shift_quantity !== 0;
            },
            validate_shift_quantity(row) {
                row.can_shift_quantity = Number(row.can_shift_quantity);
                switch (true) {
                    case isNaN(row.can_shift_quantity):
                        return this.$message({
                            type: 'error',
                            message: `请输入正确的数字！`
                        });
                    case row.can_shift_quantity > row.quantity - row.hold_quantity:

                        row.can_shift_quantity = row.quantity - row.hold_quantity;
                        return this.$message({
                            type: 'error',
                            message: `转移货品数量不能超过库存数减冻结数！`
                        });
                    case row.can_shift_quantity < 0:
                        row.can_shift_quantity = 0;
                        return this.$message({
                            type: 'error',
                            message: `转移货品数量不能为负数！`
                        });
                }
            }
        },
        watch: {
            visible(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.visible = val;
            },
        },
        computed: {},
        props: {
            value: {},
            warehouseName: {},
            searchData: {},
            selectedIds: {},
            warehouse_id: {},
            pageSize: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
        }
    }
</script>
