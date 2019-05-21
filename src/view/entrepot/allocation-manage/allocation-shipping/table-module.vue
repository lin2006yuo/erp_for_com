<template>
    <page class="c-allocation-plan">
        <el-row class="mt-sm">
            <permission tag="ElButton"
                        type="primary"
                        size="mini"
                        :disabled="deliverData.length === 0"
                        @click="batch_deliver"
                        :route="apis.url_allocation_shipping_detail">
                批量交货
            </permission>
        </el-row>
        <el-table
                :data="tableData"
                v-resize="{height:41}"
                v-loading="loading"
                class="scroll-bar mt-sm"
                @selection-change="select_change"
                element-loading-text="玩命加载中"
                highlightCurrentRow>
            <el-table-column type="selection"
                             width="35"></el-table-column>
            <el-table-column
                    inline-template
                    label="调拨单号">
                <div>
                    <ui-tip :content="row.order_code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="出库仓库">
                <div>
                    <ui-tip :content="row.out_warehouse" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="入库仓库">
                <div>
                    <ui-tip :content="row.in_warehouse" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="110"
                    label="状态">
                <div style="position: relative">
                    <ui-tip :content="row.status_txt" :width="98"></ui-tip>
                    <el-tooltip :content="row.reason" placement="right" effect="light" v-if="row.status === 2">
                        <span class="error-icon"></span>
                    </el-tooltip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="物流渠道">
                <div>
                    <ui-tip :content="row.shipping_method" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="物流发货方式">
                <div>
                    {{row.shipping_type}}
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="运单号">
                <div>
                    <ui-tip :content="row.tracking_number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <!--<el-table-column
                    inline-template
                    label="创建人">
                <div>
                    <ui-tip :content="row.create" :width="98"></ui-tip>
                </div>
            </el-table-column>-->
            <el-table-column
                    label="操作"
                    inline-template>
                <div>
                    <trends-select class="inline"
                                   @trigger="action(row,$event)"
                                   :selects="m_option(row)"
                                   type="primary">
                    </trends-select>
                </div>
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
        <look-edit :edit-data="editData"
                   v-model="lookVisible"
                   @search="$listeners['search']"
                   :action="trendAction"></look-edit>
        <box-file v-model="boxVisible"
                  :trend-action="trendAction"></box-file>
        <allocation-cancel v-model="cancelVisible"
                           @search="$listeners['search']"
                           :trend-action="trendAction"></allocation-cancel>
        <allocation-log v-model="logVisible" :trend-action="trendAction"></allocation-log>
        <deliver v-model="deliverVisible" :action="trendAction" :edit-data="editData"></deliver>
        <batch-deliver v-model="batchDeliverVisible"
                       @search="$listeners['search']"
                       :deliver-params="deliverParams"></batch-deliver>
    </page>
</template>

<style lang="stylus">

</style>

<script>
    import {
        api_allocation_detail,
        url_allocation_detail,
    } from "@/api/allocation-logistics";

    import {
        url_allocation_shipping_deliver,
        api_allocation_force_deliver,
        url_allocation_force_deliver,
        url_allocation_shipping_detail,
    } from "@/api/allocation-shipping";
    import {
        api_allocation_cancel,
        url_allocation_cancel,
        url_get_allocation_attachment,
        url_allocation_log,
        url_allocation_force_cancel,
    } from "@/api/transfer-plan";

    export default {
        permission: {
            url_get_allocation_attachment,
            url_allocation_detail,
            url_allocation_shipping_deliver,
            url_allocation_force_deliver,
            url_allocation_cancel,
            url_allocation_log,
            url_allocation_force_cancel,
            url_allocation_shipping_detail,
        },
        data() {
            return {
                trendAction: {},
                tableData: [],
                selectData: [],
                editData: {
                    box_list: [],
                },
                logVisible: false,
                lookVisible: false,
                cancelVisible: false,
                deliverVisible: false,
                boxVisible: false,
                operateButtons: [
                    {
                        label: '查看',
                        apis: url_allocation_detail,
                        action: (data) => {
                            this.trendAction = {
                                title: `查看调拨计划(${data.order_code})`,
                                number: data.order_code,
                                value: 'look',
                                type: 'shipping',
                                id: data.id
                            };
                            this.editData = {
                                box_list: [],
                            };
                            this.$http(api_allocation_detail, {allocation_id: data.id}).then(res => {
                                this.editData = res;
                                this.lookVisible = true;
                            });
                        }
                    },
                    {
                        label: '日志',
                        apis: url_allocation_log,
                        action(data) {
                            this.trendAction = {
                                title: `查看调拨计划(${data.order_code})日志`,
                                id: data.id,
                                number: data.order_code,
                            };
                            this.logVisible = true;
                        }
                    },
                ],
                deliverParams: {},
                batchDeliverVisible: false,
            }
        },
        methods: {
            m_option(row) {
                return row.operateButtons.filter(res => {
                    return this.$hasPermission(res.apis);
                })
            },
            action(data, options) {
                options.action.call(this, data);
                return;
            },

            /**
             * 初始化列表数据，添加每条数据的操作项
             * 需要再index.vue(父组件)中调用执行
             * @param {Array} val
             */
            init_table(val) {
                val.forEach(row => {
                    this.$set(row, 'operateButtons', [].concat(this.operateButtons));
                    let buttons = [
                        {
                            label: '强制作废',
                            apis: url_allocation_force_cancel,
                            action(data) {
                                this.trendAction = {
                                    id: data.id,
                                    number: data.order_code,
                                    value: 'force_cancel',
                                    title: `您将强制作废调拨单号${data.order_code},确认此操作吗？`
                                };
                                this.cancelVisible = true;
                            },
                        }, {
                            label: '箱唛附件',
                            apis: url_get_allocation_attachment,
                            action: (data) => {
                                this.trendAction = {
                                    id: data.id,
                                    title: `调拨单（${data.order_code}）箱唛附件`,
                                    number: data.order_code,
                                    value: 'box_file',
                                    isPacking: this.is_packing(data),
                                };
                                this.boxVisible = true;
                            }
                        }, {
                            label: '出库交接',
                            apis: url_allocation_shipping_deliver,
                            action(data) {
                                this.trendAction = {
                                    title: `调拨计划(${data.order_code})出库交接`,
                                    number: data.order_code,
                                    value: 'deliver',
                                    id: data.id
                                };
                                this.editData = {
                                    box_list: [],
                                };
                                this.$http(api_allocation_detail, {allocation_id: data.id}).then(res => {
                                    this.editData = res;
                                    this.deliverVisible = true;
                                });
                            }
                        }, {
                            label: '强制交货完成',
                            apis: url_allocation_force_deliver,
                            action(data) {
                                this.$confirm(`您将强制完成交货${data.order_code}，未交货的箱子将生成重返上架单，确认此操作吗？`, '提示', {
                                    type: 'warning',
                                    confirmButtonText: '确认',
                                    cancelButtonText: '取消',
                                }).then(() => {
                                    this.$http(api_allocation_force_deliver, {allocation_id: data.id}).then(res => {
                                        this.$message({type: 'success', message: res.message || res});
                                        this.$emit('search');
                                    }).catch(code => {
                                        this.$message({type: 'error', message: code.message || code});
                                    });
                                }).catch(() => {
                                    this.$message({type: 'info', message: '已取消'});
                                });
                            }
                        }];
                    switch (true) {
                        case row.status === 10:
                            this.$set(row, 'operateButtons', row.operateButtons.concat(buttons.slice(0, 3)));
                            break;
                        case row.status === 3:
                            this.$set(row, 'operateButtons', row.operateButtons.concat(buttons.slice(1, 2)));
                            break;
                        case row.status === 11:
                            this.$set(row, 'operateButtons', row.operateButtons.concat(buttons.slice(1)));
                            break;
                    }
                });
                this.tableData = val;
            },
            select_change(selection) {
                this.selectData = selection;
            },
            is_packing(data) {
                return [9, 10].includes(data.status);
            },
            //获取批量交货数据
            batch_deliver() {
                let data = {
                    ids: this.deliverData.map(row => row.id)
                };
                this.deliverParams = data;
                this.batchDeliverVisible = true;
            },
        },
        computed: {
            deliverData() {
                return this.selectData.filter(row => [10, 11].includes(row.status));
            }
        },
        watch: {},
        props: {
            searchData: {},
            loading: {},
            total: {},
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default,
            trendsSelect: require('@/components/trends-select.vue').default,
            boxFile: require('../box-file.vue').default,
            allocationLog: require('../allocation-log.vue').default,
            allocationCancel: require('../allocation-cancel.vue').default,
            lookEdit: require('../look-edit.vue').default,
            deliver: require('./deliver.vue').default,
            batchDeliver: require('./batch-deliver.vue').default,
        }
    }
</script>
