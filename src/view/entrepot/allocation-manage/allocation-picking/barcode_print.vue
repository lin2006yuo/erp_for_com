<template>
    <page-dialog v-model="visible" size="large" @open="open" @close="close" :title="trendAction.title">
        <el-row class="fl-clear mt-xs mb-xs">
            <permission tag="ElButton"
                        @click="batch_print"
                        type="primary"
                        size="mini"
                        :disabled="selectData.length === 0"
                        :route="apis.url_allocation_barcode_print">
                批量打印
            </permission>
        </el-row>
        <el-table class="mb-sm scroll-bar"
                  border :data="tableData"
                  highlight-current-row
                  v-resize="{height:180}"
                  @selection-change="batch_select"
                  v-loading="loading"
                  element-loading-text="玩命加载中...">
            <!--<div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>-->
            <el-table-column type="selection" width="35"></el-table-column>

            <el-table-column label="图片" min-width="55" inline-template>
                <div>
                    <el-popover
                            placement="right"
                            trigger="hover">
                        <img :src="row.thumb | filterImage" width="200px" height="200px">
                        <div slot="reference">
                            <img :src="row.thumb" v-if="row.thumb"
                                 height="60px" width="60px"
                                 style="border:none;vertical-align: middle">
                        </div>
                    </el-popover>
                </div>
            </el-table-column>
            <el-table-column label="SKU" min-width="130" inline-template>
                <span>{{row.sku}}</span>
            </el-table-column>
            <el-table-column label="FNSKU" min-width="50" inline-template>
                <div>{{row.fn_sku}}</div>
            </el-table-column>
            <el-table-column label="数量" min-width="50" inline-template>
                <div>{{row.quantity}}</div>
            </el-table-column>
            <el-table-column label="品名" min-width="50" inline-template>
                <div>{{row.sku_name}}</div>
            </el-table-column>
            <el-table-column label="操作" min-width="50" inline-template>
                <permission tag="ElButton"
                            @click="batch_print(row)"
                            type="primary"
                            size="mini"
                            :route="apis.url_allocation_barcode_print">
                    打印
                </permission>
            </el-table-column>
        </el-table>
        <el-pagination
                class="t-right"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <batch-preview v-model="printVisible"
                 :batch-data="batchData"
                 :column-height="100"
                 ref="preview">
        </batch-preview>
        <div slot="footer">
            <el-button size="mini" @click.native="visible = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {
        api_allocation_picking_barcode,
        url_allocation_picking_barcode,
    } from "@/api/allocation-picking";
    import {
        api_allocation_barcode_print,
        url_allocation_barcode_print,
    } from "@/api/transfer-plan";

    export default {
        permission: {
            url_allocation_barcode_print,
        },
        data() {
            return {
                visible: this.value,
                tableData: [],
                selectData: [],
                searchData: {
                    page: 1,
                    pageSize: 20,
                },
                total: 0,
                loading: false,
                batchData: [],
                printVisible: false,
            }
        },
        filters: {
            filterImage(val) {
                return val.replace("_60x60", "_200x200");
            },
        },
        methods: {
            open() {
                this.init();
            },
            init() {
                this.loading = true;
                this.$http(api_allocation_picking_barcode, this.trendAction.id, this.searchData).then(res => {
                    this.tableData = res.data;
                    this.total = res.count;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    this.loading = false;
                })
            },
            sure() {

            },
            close() {
                this.tableData = [];
                this.selectData = [];
            },
            batch_print(row) {
                let data = {
                    warehouse_id: this.trendAction.warehouse_id,
                    allocation_id: this.trendAction.allocation_id,
                };
                if (row.sku) {
                    data.sku_ids = [row.sku_id];
                    this.print_barcode(data, true);
                } else {
                    data.sku_ids = this.selectData.map(row => row.sku_id);
                    this.print_barcode(data, false);
                }
            },
            print_barcode(data, single) {
                this.$http(api_allocation_barcode_print, data).then(res => {
                    this.batchData = res;
                    this.batchData.print_data.forEach((row,index) => {
                        let num = single ? 1 : this.tableData.find(num => num.sku_id === row.sku_id).quantity;
                        this.$set(row, 'print_num', num);
                        let identification = index === this.batchData.print_data.length -1 ? this.batchData.identification : 'identification';
                        this.$set(row, 'identification', identification);
                    });
                    this.printVisible = true;
                    this.$refs.preview.get_template(8);
                    if (this.batchData.default_temp_id) {
                        this.$nextTick(() => {
                            this.$refs.preview.change_print();
                        });
                    }
                })
            },
            batch_select(val) {
                this.selectData = val;
            },
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init();
            }
        },
        computed: {
            printNum() {
                return this.selectData.map(row => {
                    return {
                        id: row.sku_id,
                        quantity: Number(row.quantity),
                    }
                });
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
            trendAction: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
            batchPreview: require('./batch-preview.vue').default,
        }
    }
</script>