<template>
    <div class="p-transfer-plan">
        <permission tag="ElButton" type="primary"
                    :route="apis.url_post_allocation"
                    size="mini"
                    @click="add"
                    class="ml-sm mt-xs">添加调拨单
        </permission>
        <el-table
                :data="tableData"
                v-resize="{height:41}"
                v-loading="loading"
                class="scroll-bar mt-sm"
                element-loading-text="玩命加载中"
                highlightCurrentRow>
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
                    width="80"
                    label="运费">
                <div>
                    <ui-tip :content="row.shipping_fee" :width="98"></ui-tip>
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
            <el-table-column
                    inline-template
                    label="创建人">
                <div>
                    <ui-tip :content="row.create" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="审核人">
                <div>
                    <ui-tip :content="row.auditor" :width="98"></ui-tip>
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
            <!--<el-table-column
                    inline-template
                    label="更新人">
                <div>
                    <ui-tip :content="row.update" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="更新时间">
                <div>
                    <ui-tip :content="row.update_time | timeFilter" :width="98"></ui-tip>
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
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <operate :edit-data="editData"
                 v-model="visible"
                 :currency-list="currencyList"
                 @edit="$listeners['edit']"
                 @operate-achieve="$listeners['operate-achieve']"
                 @new-data="$listeners['new-data']"
                 :action="trendAction">
        </operate>
        <add-storage-order v-model="storageVisible"
                           @storage="$listeners['storage']"
                           :storage-data="editData"
                           :storage-action="trendAction">
        </add-storage-order>
        <box-file v-model="boxVisible" :trend-action="trendAction"></box-file>
        <allocation-log v-model="logVisible" :trend-action="trendAction"></allocation-log>
        <print v-model="printVisible" :print-data="printData" :print-action="trendAction"></print>
    </div>
</template>
<style lang="stylus">
    .p-transfer-plan {
        .operat-color {
            color: #69f;
        }
        .error-icon {
            display: inline-block;
            vertical-align: middle;
            width: 16px;
            height: 16px;
            background: url('../../../assets/error-icon2.png') no-repeat center center;
            background-size: cover;
            &:hover {
                box-shadow: 0 0 10px rgba(105, 105, 105, 1);
                border-radius: 50%;
                transform: scale(1.1);
                -ms-transform: scale(1.1); /* IE 9 */
                -moz-transform: scale(1.1); /* Firefox */
                -webkit-transform: scale(1.1); /* Safari 和 Chrome */
                -o-transform: scale(1.1);
            }
        }
    }

</style>
<script>
    import {
        api_get_currency,
        api_get_allocation,
        api_look_allocation,
        url_post_allocation,
        url_get_allocation,
        url_put_waybill,
        url_put_audit,
        url_post_deliver,
        url_post_entry,
        url_put_allocation,
        url_allocation_log,
        url_get_allocation_attachment,
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
        },
        data() {
            return {
                loading: false,
                tableData: [],
                total: 0,
                visible: false,
                trendAction: {},
                lookVisible: false,
                logVisible: false,
                operateButtons: [
                    {
                        label: '查看',
                        value: 1,
                        apis: url_get_allocation,
                        action: (data) => {
                            this.trendAction.id = data.id;
                            this.trendAction = {
                                title: `查看调拨计划(${data.order_code})`,
                                number: data.order_code,
                                value: 'look',
                                id: data.id
                            };
                            this.editData = [];
                            this.$http(api_look_allocation, data.id).then(res => {
                                this.editData = res;
                                this.visible = true;
                            });
                        }
                    },
                    {
                        label: '打印', value: 7, apis: url_get_allocation,
                        action(data) {
                            this.trendAction = {
                                number: data.order_code,
                            };
                            this.editData = []
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
                ],
                currencyList: [],
                editData: {
                    sku_list: [],
                },
                boxVisible: false,
                storageVisible: false,
                printVisible: false,
                printData: {},
            }
        },
        mounted() {
            this.init_currencyList();
        },
        filters: {
            timeFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            }
        },
        methods: {
            m_option(row) {
                return row.operateButtons.filter(res => {
                    return this.$hasPermission(res.apis);
                })
            },
            init_currencyList() {
                this.$http(api_get_currency).then(res => {
                    this.currencyList = res.map(row => {
                        return {label: row.name, value: row.code}
                    });
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            box_upload(row) {
                this.trendAction = {
                    title: `调拨计划(${row.order_code})箱唛附件`,
                    number: row.order_code,
                    status: row.status,
                    value: 'box_file',
                    id: row.id,
                };
                this.boxVisible = true;
            },
            init() {
                this.loading = true;
                let data = this.deal_time(this.searchData);
                this.$http(api_get_allocation, data).then(res => {
                    this.tableData = res.list;
                    this.tableData.forEach(row => {
                        this.$set(row, 'operateButtons', [].concat(this.operateButtons));
                        if (row.status === 2 || row.status === 0) {
                            row.operateButtons.push({
                                label: '修改',
                                value: 2,
                                apis: url_put_allocation,
                                action(data) {
                                    this.trendAction = {
                                        title: `修改调拨计划(${data.order_code})`,
                                        number: data.order_code,
                                        value: 'edit',
                                        id: data.id
                                    };
                                    this.editData = [];
                                    this.$http(api_look_allocation, data.id).then(res => {
                                        this.editData = res;
                                        this.visible = true;
                                    });
                                }
                            });
                        } else {
                            row.operateButtons.push({
                                label: '箱唛附件',
                                apis: url_get_allocation_attachment,
                                action(data) {
                                    this.trendAction = {
                                        title: `调拨计划(${data.order_code})箱唛附件`,
                                        number: data.order_code,
                                        status: data.status,
                                        value: 'box_file',
                                        id: data.id,
                                    };
                                    this.boxVisible = true;
                                }
                            })
                        }
                        if (row.status === 0) {
                            row.operateButtons.push({
                                label: '审核',
                                value: 4,
                                apis: url_put_audit,
                                action(data) {
                                    this.trendAction = {
                                        title: `审核调拨计划(${data.order_code})`,
                                        number: data.order_code,
                                        value: 'checkPackage',
                                        id: data.id
                                    };
                                    this.editData = [];
                                    this.$http(api_look_allocation, data.id).then(res => {
                                        this.editData = res;
                                        this.visible = true;
                                    });
                                }
                            });
                        }
                        if (row.status === 1) {
                            row.operateButtons.push({
                                label: '出库',
                                value: 5,
                                apis: url_post_deliver,
                                action(data) {
                                    this.trendAction = {
                                        title: `调拨出库`,
                                        number: data.order_code,
                                        value: 'createNumber',
                                        mean: '出',
                                        id: data.id
                                    };
                                    this.editData = [];
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
                        if (row.status === 3 || row.status === 4) {
                            row.operateButtons.push({
                                label: '入库',
                                value: 6,
                                apis: url_post_entry,
                                action(data) {
                                    this.trendAction = {
                                        title: `调拨入库`,
                                        number: data.order_code,
                                        value: 'createNumber',
                                        mean: '入',
                                        id: data.id
                                    };
                                    this.editData = [];
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
                                label: '修改运单',
                                value: 3,
                                apis: url_put_waybill,
                                action(data) {
                                    this.trendAction = {
                                        title: `修改调拨计划(${data.order_code})运单`,
                                        number: data.order_code,
                                        value: 'editPackage',
                                        id: data.id
                                    };
                                    this.editData = [];
                                    this.$http(api_look_allocation, data.id).then(res => {
                                        if (res.currency_code === '') {
                                            res.currency_code = 'CNY';
                                        }
                                        this.editData = res;
                                        this.visible = true;
                                    });
                                }
                            });
                        }
                    });
                    this.total = res.count;
                    this.loading = false;
                }).catch(code => {
                    this.loading = false;
                    this.$message({type: "error", message: code.message || code});
                })
            },
            //处理年月日
            deal_time(searchData) {
                //处理年月日 YYYY-MM-dd
                let data = clone(searchData);
                if (searchData.time_st) {
                    data.time_st = datef('YYYY-MM-dd', searchData.time_st / 1000);
                } else {
                    data.time_st = '';
                }
                if (searchData.time_nd) {
                    data.time_nd = datef('YYYY-MM-dd', searchData.time_nd / 1000);
                } else {
                    data.time_nd = '';
                }
                return data;
            },
            add() {
                this.trendAction = {title: '添加调拨单', value: 'add'};
                this.editData = {
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
                this.visible = true;
            },
            action(data, options) {
                options.action.call(this, data);
                return;
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
        },
        computed: {},
        watch: {
            newItem(val) {
                let flag = this.tableData.findIndex(row => {
                    return row.id === val.id;
                });
                if (flag === -1) {
                    this.tableData.unshift(val);
                } else {
                    this.tableData.splice(flag, 1, val);
                }
            }
        },
        props: {
            searchData: {},
            newItem: {}
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default,
            trendsSelect: require('@/components/trends-select.vue').default,
            boxFile: require('./box-file.vue').default,
            allocationLog: require('./allocation-log.vue').default,
            operate: require('./operate.vue').default,
            addStorageOrder: require('./add-storage-order').default,
            print: require('./print.vue').default,
        },
    }
</script>
