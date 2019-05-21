<template>
    <div class="c-allocation-picking-table mt-sm">
        <el-table :data="tableData"
                  border
                  v-loading="loading"
                  class="scroll-bar"
                  element-loading-text="玩命加载中"
                  v-resize="{height: 40}"
                  highlight-current-row>
            <el-table-column label="拣货单号" min-width="80" inline-template>
                <div>
                    {{row.number}}
                </div>
            </el-table-column>
            <el-table-column label="调拨单号" min-width="80" inline-template>
                <div>
                    {{row.order_code}}
                </div>
            </el-table-column>
            <el-table-column label="调入仓库" min-width="80" inline-template>
                <div>
                    {{row.warehouse_name}}
                </div>
            </el-table-column>
            <el-table-column label="目的地国家" min-width="80" inline-template>
                <div>
                    {{row.country_code}}
                </div>
            </el-table-column>
            <el-table-column label="物流发货方式" min-width="80" inline-template>
                <div>
                    {{row.shipping_type}}
                </div>
            </el-table-column>
            <el-table-column label="调拨单创建人" min-width="80" inline-template>
                <div>
                    {{row.create}}
                </div>
            </el-table-column>
            <el-table-column label="状态" min-width="40" inline-template>
                <div>
                    {{row.status_name}}
                </div>
            </el-table-column>
            <el-table-column label="SKU品种数" min-width="60" inline-template>
                <div>
                    {{row.sku_type}}
                </div>
            </el-table-column>
            <el-table-column label="商品数量" min-width="60" inline-template>
                <div>
                    {{row.sku_quantity}}
                </div>
            </el-table-column>
            <el-table-column label="拣货人" min-width="50" inline-template>
                <div>
                    {{row.off_shelf}}
                </div>
            </el-table-column>
            <el-table-column label="拣货单创建时间/完成时间" min-width="110" inline-template>
                <div>
                    <div>{{row.picking_start_time || '--'}}</div>
                    <div>{{row.picking_end_time || '--'}}</div>
                </div>
            </el-table-column>
            <el-table-column label="包装人" min-width="50" inline-template>
                <div>
                    {{row.packing}}
                </div>
            </el-table-column>
            <el-table-column label="包装开始时间/完成时间" min-width="110" inline-template>
                <div>
                    <div>{{row.packing_start_time || '--'}}</div>
                    <div>{{row.packing_end_time || '--'}}</div>
                </div>
            </el-table-column>
            <el-table-column label="操作" inline-template>
                <trends-select class="inline"
                               @trigger="action(row,$event)"
                               :selects="m_option(row)"
                               type="primary">
                </trends-select>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="$listeners['handle-size-change']"
                @current-change="$listeners['handle-current-change']"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <look-picking v-model="lookVisible" :action="trendAction"></look-picking>
        <operation-log v-model="logVisible" :trend-action="trendAction"></operation-log>
        <box-file v-model="boxVisible" :trend-action="trendAction"></box-file>
        <print v-model="printVisible"
               :trend-action="trendAction"></print>
        <barcode-print v-model="printBarcodeVisible"
                       @search="$listeners['search']"
                       :trend-action="trendAction"></barcode-print>
        <under-shelf v-model="completeVisible"
                     @search="$listeners['search']"
                     :trend-action="trendAction"></under-shelf>
        <picking-cancel v-model="cancelVisible"
                        @search="$listeners['search']"
                        :trend-action="trendAction"></picking-cancel>
    </div>
</template>

<style lang="stylus">

</style>

<script>
    import {
        api_look_allocation_picking,
        url_look_allocation_picking,
        api_allocation_picking_print,
        url_allocation_picking_print,
        api_allocation_picking_barcode,
        api_allocation_picking_log,
        url_allocation_picking_log,
        api_allocation_picking_mark,
        url_allocation_picking_mark,
        api_allocation_picking_complete,
        url_allocation_picking_complete,
        api_allocation_picking_invalid,
        url_allocation_picking_invalid,
    } from "@/api/allocation-picking";

    import {url_get_allocation_attachment} from "@/api/transfer-plan";

    export default {
        permission: {
            url_look_allocation_picking,
            url_allocation_picking_print,
            api_allocation_picking_barcode,
            url_allocation_picking_log,
            url_allocation_picking_mark,
            url_allocation_picking_complete,
            url_allocation_picking_invalid,
            url_get_allocation_attachment,
        },
        data() {
            return {
                tableData: [],
                trendAction: {},
                lookVisible: false,
                logVisible: false,
                printVisible: false,
                printBarcodeVisible: false,
                boxVisible: false,
                completeVisible: false,
                cancelVisible: false,
                operateButtons: [{
                    label: '查看',
                    apis: url_look_allocation_picking,
                    action: (data) => {
                        this.trendAction = {
                            id: data.id,
                            title: `查看拣货单(${data.number})`,
                            value: 'look',
                        };
                        this.lookVisible = true;
                    }
                }, {
                    label: '操作日志',
                    apis: url_allocation_picking_log,
                    action: (data) => {
                        this.trendAction = {
                            id: data.id,
                            title: `拣货单(${data.number})操作日志`,
                            value: 'log'
                        };
                        this.logVisible = true;
                    }
                }, {
                    label: '箱唛附件',
                    apis: url_get_allocation_attachment,
                    action: (data) => {
                        this.trendAction = {
                            id: data.allocation_id,
                            title: `调拨单（${data.order_code}）箱唛附件`,
                            number: data.number,
                            value: 'box_file',
                            isPacking: this.is_packing(data),
                        };
                        this.boxVisible = true;
                    }
                },]
            }
        },
        filters: {
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
        },
        methods: {
            m_option(row) {
                return row.operateButtons.filter(res => {
                    return this.$hasPermission(res.apis);
                });
            },
            action(data, options) {
                options.action.call(this, data);
                return;
            },
            init_table(val) {
                val.forEach(row => {
                    this.$set(row, 'operateButtons', [].concat(this.operateButtons));
                    if (row.status !== 0 && row.invalid_status === 0) {
                        row.operateButtons.push({
                            label: '作废',
                            apis: url_allocation_picking_invalid,
                            action(data) {
                                this.trendAction = {
                                    id: data.id,
                                    title: `您将作废拣货单(${data.number})`,
                                    number: data.number,
                                    value: 'cancel',
                                };
                                this.cancelVisible = true;
                            }
                        });
                    }
                    if ([1, 2, 3].includes(row.status)) {
                        row.operateButtons.push({
                            label: '打印拣货单',
                            apis: url_allocation_picking_print,
                            action(data) {
                                this.trendAction = {
                                    id: data.id,
                                    title: `打印拣货单(${data.number})`,
                                    number: data.number,
                                    value: 'print',
                                };
                                this.printVisible = true;
                            }
                        });
                        if(row.is_fba === 1) {
                            row.operateButtons.push({
                                label: '打印商品条码',
                                apis: api_allocation_picking_barcode,
                                action(data) {
                                    this.trendAction = {
                                        id: data.id,
                                        title: `打印拣货单(${data.number})商品条码`,
                                        number: data.number,
                                        value: 'print_barcode',
                                        allocation_id: data.allocation_id,
                                        warehouse_id: data.in_warehouse_id,
                                    };
                                    this.printBarcodeVisible = true;
                                }
                            });
                        }
                    }
                    if (row.status === 1) {
                        row.operateButtons.push({
                            label: '标记为正在拣货',
                            apis: url_allocation_picking_mark,
                            action(data) {
                                this.$confirm(`您将标记拣货单${data.number}为正在拣货，确认此操作吗？`, '提示', {
                                    type: 'warning',
                                    confirmButtonText: '确认',
                                    cancelButtonText: '取消'
                                }).then(() => {
                                    this.$http(api_allocation_picking_mark, data.id).then(res => {
                                        this.$message({type: 'success', message: res.message || res});
                                        this.$emit('search');
                                    }).catch(code => {
                                        this.$message({type: 'error', message: code.message || code});
                                    });
                                }).catch(() => {
                                    this.$message({
                                        type: "info",
                                        message: "已取消"
                                    });
                                });
                            }
                        });
                    }
                    if (row.status === 2) {
                        row.operateButtons.push({
                            label: '下架',
                            apis: url_allocation_picking_complete,
                            action(data) {
                                this.trendAction = {
                                    id: data.id,
                                    title: `下架拣货单(${data.number})`,
                                    number: data.number,
                                    value: 'complete',
                                };
                                this.completeVisible = true;
                            }
                        });
                    }
                });
                this.tableData = val;
            },
            is_packing(data) {
                return [5].includes(data.status);
            }
        },
        props: {
            loading: {},
            total: {},
            searchData: {}
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default,
            trendsSelect: require('@/components/trends-select.vue').default,
            lookPicking: require('./look-picking.vue').default,
            operationLog: require('./operation-log.vue').default,
            boxFile: require('../box-file.vue').default,
            print: require('./print.vue').default,
            barcodePrint: require('./barcode_print.vue').default,
            underShelf: require('./under-shelf.vue').default,
            pickingCancel: require('./picking-cancel.vue').default,
        }
    }
</script>
