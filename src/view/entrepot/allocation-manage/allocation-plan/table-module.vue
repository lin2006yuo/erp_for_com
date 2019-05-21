<template>
    <page class="c-allocation-plan">
        <el-row class="mt-xs mb-xs">
            <permission tag="ElButton" :route="apis.url_post_allocation" type="primary" @click="add" size="mini">添加调拨单
            </permission>
        </el-row>
        <el-table
                :data="tableData"
                v-resize="{height:41}"
                v-loading="loading"
                class="scroll-bar mt-sm"
                element-loading-text="玩命加载中"
                highlightCurrentRow>
            <el-table-column
                    inline-template
                    min-width="100"
                    label="调拨单号">
                <div>
                    <ui-tip :content="row.order_code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="100"
                    label="出库仓库">
                <div>
                    <ui-tip :content="row.out_warehouse" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="110"
                    label="入库仓库">
                <div>
                    <ui-tip :content="row.in_warehouse" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="100"
                    label="状态">
                <div style="position: relative">
                    <ui-tip :content="row.status_txt" :width="98"></ui-tip>
                    <el-tooltip :content="row.reason" placement="right" effect="light" v-if="row.status === 2">
                        <span class="error-icon"></span>
                    </el-tooltip>
                </div>
            </el-table-column>
            <el-table-column
                    min-width="100"
                    inline-template
                    label="物流渠道">
                <div>
                    <ui-tip :content="row.shipping_method" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    min-width="100"
                    inline-template
                    label="物流发货方式">
                <div>
                    <ui-tip :content="row.shipping_type" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    min-width="110"
                    inline-template
                    label="运单号">
                <div>
                    <ui-tip :content="row.tracking_number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    min-width="80"
                    inline-template
                    label="创建人">
                <div>
                    <ui-tip :content="row.create" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="箱唛状态">
                <el-row>
                    <el-col :span="6">
                        <i v-if="row.has_goods_barcode"
                           @click="box_upload(row)"
                           class="el-icon-document operate" title="商品条码附件"></i>
                        <span class="operate" @click="box_upload(row)" v-else title="未上传商品条码附件">--</span>
                    </el-col>
                    <el-col :span="6">
                        <i v-if="row.has_packing_list"
                           @click="box_upload(row)"
                           class="el-icon-document operate" title="箱唛清单"></i>
                        <span v-else
                              class="operate"
                              @click="box_upload(row)"
                              title="未上传箱唛清单">--</span>
                    </el-col>
                    <el-col :span="6">
                        <i v-if="row.has_shipping_mark"
                           @click="box_upload(row)"
                           class="el-icon-document operate" title="箱唛标签文件"></i>
                        <span v-else
                              class="operate"
                              @click="box_upload(row)"
                              title="未上传箱唛标签">--</span>
                    </el-col>
                    <el-col :span="6">
                        <i v-if="row.has_other"
                           @click="box_upload(row)"
                           class="el-icon-document operate" title="其他附件"></i>
                        <span v-else
                              class="operate"
                              @click="box_upload(row)"
                              title="未上传其他附件">--</span>
                    </el-col>
                </el-row>
            </el-table-column>
            <el-table-column
                    min-width="80"
                    inline-template
                    label="审核人">
                <div>
                    <ui-tip :content="row.auditor" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    width="150"
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

        <add-allocation :edit-data="editData"
                        v-model="addVisible"
                        @search="$listeners['search']"
                        :action="trendAction">
        </add-allocation>
        <add-storage-order v-model="storageVisible"
                           @search="$listeners['search']"
                           :storage-data="editData"
                           :storage-action="trendAction">
        </add-storage-order>
        <look-allocation :edit-data="editData"
                         v-model="lookVisible"
                         @search="$listeners['search']"
                         :action="trendAction"></look-allocation>
        <allocation-cancel v-model="cancelVisible"
                           @search="$listeners['search']"
                           :trend-action="trendAction"></allocation-cancel>
        <allocation-log v-model="logVisible" :trend-action="trendAction"></allocation-log>
        <allocation-print v-model="printVisible" :print-data="printData" :print-action="trendAction"></allocation-print>
        <box-file v-model="boxVisible" :trend-action="trendAction"></box-file>
    </page>
</template>

<style lang="stylus">

</style>

<script>
    import {
        api_look_allocation,
        url_put_allocation_return,
        url_post_allocation,
        url_get_allocation,
        url_put_waybill,
        url_put_audit,
        url_post_deliver,
        url_post_entry,
        url_put_allocation,
        url_allocation_log,
        url_get_allocation_attachment,
        url_allocation_cancel,
        url_allocation_force_cancel,
        url_allocation_box_list,
    } from '@/api/transfer-plan'

    export default {
        permission: {
            url_get_allocation,
            url_put_waybill,
            url_put_audit,
            url_post_deliver,
            url_post_entry,
            url_put_allocation,
            url_allocation_log,
            url_post_allocation,
            url_get_allocation_attachment,
            url_allocation_cancel,
            url_allocation_force_cancel,
            url_allocation_box_list,
            url_put_allocation_return
        },
        data() {
            return {
                trendAction: {},
                tableData: [],
                editData: {
                    sku_list: [],
                },
                addVisible: false,
                lookVisible: false,
                logVisible: false,
                storageVisible: false,
                boxVisible: false,
                cancelVisible: false,
                printVisible: false,
                printData: {},
                operateButtons: [
                    {
                        label: '查看',
                        apis: url_get_allocation,
                        action: (data) => {
                            this.trendAction.id = data.id;
                            this.trendAction = {
                                title: `查看调拨计划(${data.order_code})`,
                                number: data.order_code,
                                value: 'look',
                                id: data.id
                            };
                            this.editData = {
                                sku_list: [],
                            };
                            this.$http(api_look_allocation, data.id).then(res => {
                                this.editData = res;
                                this.lookVisible = true;
                            });
                        }
                    },
                    {
                        label: '打印',
                        apis: url_get_allocation,
                        action(data) {
                            this.trendAction = {
                                number: data.order_code,
                            };
                            this.editData = {
                                sku_list: [],
                            };
                            this.$http(api_look_allocation, data.id).then(res => {
                                this.$set(res, 'warehouse_id', res.in_warehouse_id);
                                res.sku_list = res.sku_list.map((row, index) => {
                                    this.$set(row, 'num', index + 1);
                                    return row;
                                });
                                this.printData = res;
                                this.printVisible = true;
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
                    },
                    {
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
                    }
                ],
            }
        },
        methods: {
            is_packing(data) {
                return true;
                // return [9,10].includes(data.status);
            },
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
                    /*if(row.status === 0 || row.status === 2) {
                        row.operateButtons.splice(4,1);
                    }*/
                    if(!row.can_force_cancel) {
                        row.operateButtons.splice(3,1);
                    }
                    if (row.status === 0) {
                        let buttons = [{
                            label: '修改',
                            apis: url_put_allocation,
                            action(data) {
                                this.trendAction = {
                                    title: `修改调拨计划(${data.order_code})`,
                                    number: data.order_code,
                                    value: 'edit',
                                    id: data.id
                                };
                                this.editData = {
                                    sku_list: [],
                                };
                                this.$http(api_look_allocation, data.id).then(res => {
                                    this.editData = res;
                                    this.editData.sku_list.forEach(sku => {
                                        sku.stocking_info.forEach(stock => {
                                                sku.available_quantity = Number(sku.available_quantity);
                                                sku.available_quantity += Number(stock.usable_allocated_qty);
                                            }
                                        );
                                    });
                                    this.addVisible = true;
                                });
                            }
                        }, {
                            label: '审核',
                            apis: url_put_audit,
                            action(data) {
                                this.trendAction = {
                                    title: `审核调拨计划(${data.order_code})`,
                                    number: data.order_code,
                                    value: 'audit',
                                    id: data.id
                                };
                                this.editData = {
                                    sku_list: [],
                                };
                                this.$http(api_look_allocation, data.id).then(res => {
                                    this.editData = res;
                                    this.addVisible = true;
                                });
                            }
                        }, {
                            label: '作废',
                            apis: url_allocation_cancel,
                            action(data) {
                                this.trendAction = {
                                    id: data.id,
                                    number: data.order_code,
                                    type: 'cancel',
                                    title: `您将作废调拨单号${data.order_code},确认此操作吗？`
                                };
                                this.cancelVisible = true;
                            },
                        }];
                        this.$set(row, 'operateButtons', row.operateButtons.concat(buttons));
                    }
                    if ((row.status === 3 || row.status === 9) && row.is_fba) {
                        row.operateButtons.push({
                            label: 'ReferenceID',
                            apis: url_put_allocation,
                            action(data) {
                                this.trendAction = {
                                    title: `修改调拨计划(${data.order_code})`,
                                    number: data.order_code,
                                    value: 'reference',
                                    id: data.id
                                };
                                this.editData = {
                                    sku_list: [],
                                };
                                this.$http(api_look_allocation, data.id).then(res => {
                                    this.editData = res;
                                    this.lookVisible = true;
                                });
                            }
                        });
                    }
                    if (row.status === 3 || row.status === 4) {
                        row.operateButtons.push({
                            label: '入库',
                            apis: url_post_entry,
                            action(data) {
                                this.trendAction = {
                                    title: `调拨入库`,
                                    number: data.order_code,
                                    value: 'createNumber',
                                    mean: '入库',
                                    id: data.id
                                };
                                this.editData = {
                                    sku_list: [],
                                };
                                this.$http(api_look_allocation, data.id).then(res => {
                                    this.$set(res, 'warehouse_id', res.in_warehouse_id);
                                    res.sku_list = res.sku_list.map(row => {
                                        row.number = window.clone(row.send_qty);
                                        return row;
                                    });
                                    this.editData = res;
                                    this.$set(this.editData, 'warehouse_type', 1);
                                    this.storageVisible = true;
                                });
                            }
                        });
                        row.operateButtons.push({
                            label: '退回',
                            apis: url_put_allocation_return,
                            action(data) {
                                this.trendAction = {
                                    title: `退回调拨单${data.order_code}`,
                                    number: data.order_code,
                                    value: 'createNumber',
                                    mean: '退回',
                                    id: data.id
                                };
                                this.editData = {
                                    sku_list: [],
                                };
                                this.$http(api_look_allocation, data.id).then(res => {
                                    this.$set(res, 'warehouse_id', res.out_warehouse_id);
                                    res.sku_list = res.sku_list.map(row => {
                                        row.number = window.clone(row.wait_in_qty);
                                        return row;
                                    });
                                    this.editData = res;
                                    this.$set(this.editData, 'warehouse_type', 1);
                                    this.storageVisible = true;
                                });
                            }
                        })
                    }
                    if (row.status === 1 && row.can_out === true) {
                        row.operateButtons.push({
                            label: '出库',
                            apis: url_post_deliver,
                            action(data) {
                                this.trendAction = {
                                    title: `调拨出库`,
                                    number: data.order_code,
                                    value: 'createNumber',
                                    mean: '出库',
                                    id: data.id
                                };
                                this.editData = {
                                    sku_list: [],
                                };
                                this.$http(api_look_allocation, data.id).then(res => {
                                    this.$set(res, 'warehouse_id', res.out_warehouse_id);
                                    res.sku_list = res.sku_list.map(row => {
                                        this.$set(row, 'number', row.quantity);

                                        return row;
                                    });
                                    this.editData = res;
                                    this.$set(this.editData, 'warehouse_type', 2);
                                    this.storageVisible = true;
                                });
                            }
                        });
                    }
                    if(row.can_edit_tracking) {
                        row.operateButtons.push({
                            label: '修改运单号',
                            apis: url_put_allocation,
                            action(data) {
                                this.trendAction = {
                                    title: `调拨单(${data.order_code})修改运单号`,
                                    number: data.order_code,
                                    value: 'edit_tracking',
                                    id: data.id
                                };
                                this.editData = {
                                    sku_list: [],
                                };
                                this.$http(api_look_allocation, data.id).then(res => {
                                    this.editData = res;
                                    this.lookVisible = true;
                                });
                            }
                        });
                    }
                    // if(row.status === 12){
                    //     let buttons = [{
                    //         label: '重新预报',
                    //         apis: url_amazon_reforecast,
                    //         action: (data) => {
                    //             this.$confirm(`您将调拨单号${data.order_code}重新预报亚马逊后台，重新预报大概需要30分钟后才能知道结果，确认此操作吗？`, "提示", {
                    //                 cancelButtonText: '取消',
                    //                 confirmButtonText: '确定',
                    //                 type: 'warning'
                    //             }).then(() => {
                    //                 this.$http(api_amazon_reforecast, data.id).then(res => {
                    //                     this.$message({type: 'success', message: res.message})
                    //                 }).catch(err => {
                    //                     this.$message({type: 'error', message: err.message || err})
                    //                 });
                    //             }).catch(() => {
                    //                 this.$message({type: "info", message: `已取消操作`})
                    //             });
                    //         }
                    //     },
                    //     {
                    //         label: '作废',
                    //         apis: url_allocation_cancel,
                    //         action(data) {
                    //             this.trendAction = {
                    //                 id: data.id,
                    //                 number: data.order_code,
                    //                 type: 'cancel',
                    //                 title: `您将作废调拨单号${data.order_code},确认此操作吗？`
                    //             };
                    //             this.cancelVisible = true;
                    //         },
                    //     }
                    //     ];
                    //     this.$set(row, 'operateButtons', row.operateButtons.concat(buttons));
                    // }
                });
                this.tableData = val;
            },
            /**
             *  打开箱唛清单
             */
            box_upload(row) {
                this.trendAction = {
                    title: `调拨计划(${row.order_code})箱唛附件`,
                    number: row.order_code,
                    value: 'box_file',
                    id: row.id,
                    isPacking: this.is_packing(row),
                };
                this.boxVisible = true;
            },
            /**
             * 添加调拨单
             */
            add() {
                this.trendAction = {title: '添加调拨单', value: 'add'};
                this.editData = {
                    tax: '',
                    out_warehouse_id: '',
                    in_warehouse_id: '',
                    out_warehouse: '',
                    in_warehouse: '',
                    status_txt: '',
                    sku_list: [],
                    shipping_fee: '',
                    currency_code: 'CNY',
                    tracking_number: '',
                    shipping_type: 0,
                    remark: '',
                };
                this.addVisible = true;
            },
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
            addAllocation: require('./add-allocation.vue').default,
            lookAllocation: require('./look-allocation.vue').default,
            allocationLog: require('../allocation-log.vue').default,
            addStorageOrder: require('./add-storage-order').default,
            allocationPrint: require('./allocation-print.vue').default,
            allocationCancel: require('../allocation-cancel.vue').default,
            boxFile: require('../box-file.vue').default,
        }
    }
</script>
