<template>
    <page-dialog :title="trendAction.title"
                 size="large"
                 @open="open"
                 @close="close"
                 class="p-pickings"
                 v-model="visible"
                 :close-on-click-modal="false">
        <label-item label="货位号：">
            <el-input v-model="searchData.cargo"></el-input>
        </label-item>
        <label-item label="SKU：" class="ml-sm">
            <el-input v-model="searchData.sku"></el-input>
        </label-item>
        <el-button type="primary"
                   size="mini"
                   class="ml-sm"
                   @click="init">搜索
        </el-button>
        <div class="table_head mt-sm">
            <span class="ml-sm">当前集包信息</span>
            <request-button size="mini" req-key="under_shelf" class="ml-sm" @click="under"
                            :disabled="underData.length <= 0 && disabled">下架完成拣货
            </request-button>
        </div>
        <el-table :data="detailData"
                  v-loading="loading"
                  v-resize="{height:150}"
                  class="scroll-bar"
                  @select-all="select_all"
                  @select="select_check"
                  element-loading-text="玩命加载中"
                  highlightCurrentRow>
            <el-table-column
                    type="selection"
                    :selectable="selectable"
                    width="40">
            </el-table-column>
            <el-table-column
                    type="index"
                    width="40">
            </el-table-column>
            <el-table-column
                    inline-template
                    width="120"
                    label="货位">
                <div>
                    <ui-tip :content="row.warehouse_cargo" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="40"
                    label="数量">
                <div>
                    <ui-tip :content="row.quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="下架数量">
                <div>
                    <ui-limit-number :min="1" v-model.number="row.picking_quantity" style="width:80px"></ui-limit-number>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="120"
                    label="SKU">
                <div>
                    <ui-tip :content="row.sku" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="商品名称">
            </el-table-column>
            <el-table-column
                    inline-template
                    width="120"
                    label="规格">
                <div>
                    <ui-tip :content="row.attributes" :width="98"></ui-tip>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="fr mt-sm"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <div slot="footer">
            <el-button size="mini" @click="visible = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .p-pickings {
        .pagination {
            position: absolute;
            right: 5px;
            bottom: 5px;
        }
        .table_head {
            height: 30px;
            line-height: 30px;
            border: 1px solid #e0e6ed;
            background-color: #6295E9;
            color: white;
        }
        .c-label-item {

        }
        .c-label-item > * {
            vertical-align: baseline;
        }
    }
</style>
<script>
    import {api_allocation_picking_complete, api_allocation_picking_detail} from "@/api/allocation-picking";

    export default {
        data() {
            return {
                loading: false,
                visible: false,
                searchData: {
                    cargo: '',
                    sku_id: '',
                    page: 1,
                    pageSize: 200
                },
                detailData: [],
                total: 0,
                disabled: false
            }
        },
        mounted() {
        },
        filters: {
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
        },
        methods: {
            open() {
                this.init();
            },
            close() {
                this.searchData = {
                    cargo: '',
                    sku_id: '',
                    page: 1,
                    pageSize: 200
                };
                this.detailData = [];
                this.total = 0;
                this.disabled = false;
                this.loading = false;
            },
            init() {
                this.loading = true;
                this.disabled = false;
                Object.keys(this.searchData).forEach(key => {
                    if (typeof this.searchData[key] === 'string') {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
                this.$http(api_allocation_picking_detail, this.trendAction.id, this.searchData).then(res => {
                    this.detailData = res.data.map(res => {
                        let selectable = res.quantity !== res.picking_quantity;
                        if (selectable) {
                            res.picking_quantity = res.quantity;
                            this.disabled = true;
                        }
                        this.$set(res, 'selected', false);
                        return Object.assign(res, {selectable: selectable});
                    });
                    this.total = res.count;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => {
                    this.loading = false;
                });
            },
            trim() {
                this.searchData.cargo = this.searchData.cargo.trim();
                this.searchData.sku = this.searchData.sku.trim();
            },
            //分页器
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init();
            },
            under() {
                let sku = [];
                let errorSku = [];
                let validate = true;
                let error = false;
                this.underData.forEach(row => {
                    if (Number(row.quantity) > Number(row.picking_quantity)) {
                        sku.push(row.sku);
                        validate = false;
                    }
                    if(Number(row.quantity) < Number(row.picking_quantity)) {
                        errorSku.push(row.sku);
                        error = true;
                    }
                });
                if(error) {
                    this.$message({type: 'error', message: `SKU:${sku.join()}下架数量超过调拨数量，请调整！`});
                    return this.$reqKey('under_shelf', false);
                }
                let message = !validate ?
                    `SKU: ${sku.join()}下架数量与调拨数量不一致，是否确认下架并拣货完成？` :
                    `确定进行下架完成拣货操作？`;
                this.$confirm(message, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.under_sure();
                }).catch(() => {
                    this.$reqKey('under_shelf', false);
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            under_sure() {
                this.$http(api_allocation_picking_complete, this.trendAction.id, {data: this.underData}).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.$emit('search');
                    this.visible = false;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('under_shelf', false);
                    }, 200);
                })
            },
            select_check(selection, row) {
                row.selected = !row.selected;
            },
            select_all(selection) {
                if (selection.length === 0) {
                    this.detailData.map(row => {
                        row.selected = false;
                    })
                } else {
                    selection.map(row => {
                        row.selected = true;
                    });
                }
            },
            //分页器
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init();
            },
            selectable(row) {
                return row.selectable;
            }
        },
        computed: {
            underData() {
                let underData = [];
                this.detailData.map(row => {
                    if (row.selected) {
                        underData.push({
                            sku_id: row.sku_id,
                            sku: row.sku,
                            warehouse_cargo_id: row.warehouse_cargo_id,
                            picking_quantity: row.picking_quantity,
                            quantity: row.quantity,
                        });
                    }
                });
                return underData;
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
        props: {
            value: {},
            trendAction: {},
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            uiLimitNumber: require('@/components/ui-limit-number.vue').default,
            pageDialog: require('@/components/page-dialog.vue').default
        },
    }
</script>
