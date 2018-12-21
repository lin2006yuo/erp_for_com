<template>
    <div class="p-parcel-returned-manage">
        <div class="inline mb-xs ml-sm">
            <permission tag="trendsSelect"
                        type="primary"
                        :route="apis.url_package_return_export"
                        :selects="partAllOptions"
                        @trigger="export_excel"></permission>
        </div>
        <request-button :request="batch_storage" :disabled="isStockPending"
                        v-if="this.searchData.status==0 && this.searchData.status !==''">标记待入库
        </request-button>
        <el-button size="mini" @click="batch_send" :disabled="isStockPending"
                   v-if="this.searchData.status==0 && this.searchData.status !==''">标记待重发
        </el-button>
        <request-button :request="bulk_storage" :disabled="isStockPending" v-if="this.searchData.status==3">批量入库
        </request-button>
        <span class="fr mr-sm" slot="other">
            <span style="vertical-align: middle">打印机：</span>
            <select-printer v-model="printer" class="inline width-lg"></select-printer>
        </span>
        <div class="box">
            <el-table
                    ref="tableData"
                    :data="tableData"
                    highlight-current-row
                    v-loading="loading"
                    @select="selectCheck($event)"
                    @select-all="selectCheck"
                    element-loading-text="玩命加载中..."
                    v-resize="{height:41}">
                <el-table-column
                        type="selection"
                        width="40">
                </el-table-column>
                <el-table-column
                        label="退回单号"
                        inline-template>
                    <div>
                        <ui-tip :content="row.package_return_number" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="面单号"
                        inline-template>
                    <div>
                        <ui-tip :content="row.shipping_number" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="包裹号"
                        inline-template>
                    <div>
                        <ui-tip :is-operate="true" :content="row.package_number" :width="98"
                                @cur-click="parcel_information(row.package_number)"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="平台/站点">
                    <div>
                        <ui-tip :content="`${row.channel_name}/${row.site_code}`" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="退货类型"
                        inline-template>
                    <div>
                        <ui-tip :content="row.return_type" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="状态"
                        inline-template>
                    <div>
                        <ui-tip :content="row.status_name" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="新物流方式"
                        inline-template>
                    <div>
                        <ui-tip :content="row.new_shipping_id" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="新面单号"
                        inline-template>
                    <div>
                        <ui-tip :content="row.new_shipping_number" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="创建人"
                        inline-template
                        min-width="80">
                    <div>
                        <ui-tip :content="row.creator_id" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="创建时间"
                        inline-template
                        min-width="90">
                    <div>
                        <ui-tip :content="row.create_time | filterTime" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="更新人"
                        inline-template
                        min-width="80">
                    <div>
                        <ui-tip :content="row.updater_id" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="更新时间"
                        inline-template
                        min-width="100">
                    <div>
                        <ui-tip :content="row.update_time | filterTime" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        min-width="140"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   class="operat-color"
                                   size="mini"
                                   @click="look_package(scope.row)">查看
                        </el-button>
                        <span>  |  </span>
                        <el-button type="text"
                                   :class="{'operat-color': scope.row.status === 1 || scope.row.status === 2}"
                                   :disabled="!(scope.row.status === 1 || scope.row.status === 2)"
                                   size="mini"
                                   @click="print_package(scope.row)">打印
                        </el-button>
                        <span v-if="scope.row.status === 0">  |  </span>
                        <el-button type="text"
                                   :class="{'operat-color': scope.row.status === 0}"
                                   :disabled="scope.row.status !== 0"
                                   v-if="scope.row.status === 0"
                                   size="mini"
                                   @click="deal_package(scope.row)">处理
                        </el-button>
                        <span v-if="scope.row.status === 1">  |  </span>
                        <el-button type="text"
                                   v-if="scope.row.status === 1"
                                   :class="{'operat-color': scope.row.status === 1}"
                                   :disabled="scope.row.status !== 1"
                                   size="mini"
                                   @click="resend_package(scope.row)">重发
                        </el-button>
                        <span v-if="scope.row.status === 3">  |  </span>
                        <el-button type="text"
                                   :class="{'operat-color': scope.row.status === 3}"
                                   :disabled="scope.row.status !== 3"
                                   v-if="scope.row.status === 3"
                                   size="mini"
                                   @click="put_storage(scope.row)">入库
                        </el-button>
                    </template>
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
        </div>
        <operating v-model="visible"
                   @parcel-information="parcel_information"
                   @show-order="show_order"
                   @mark-warehouse="storage_package"
                   @mark-reissued="mark_reissued"
                   ref="add_edit"
                   :operating-data="operatingData"
                   :action="action">
        </operating>
        <form-mdf ref="formMdf"
                  :mdfid="mdfid"
                  v-model="mdfValue"
                  @close-dialog="close_dialog"
                  @click-number="click_number"
                  :is-edit="{edit:false}"
                  :title="mdfTitle">
        </form-mdf>
        <parcel-information
                @close-parcel="close_parcel"
                v-model="informationVisble"
                @view-order="view_order"
                :order="order">
        </parcel-information>
        <shipping-type
                @visible="shipping_visible"
                v-model="shippingVisible"
                :shipping-action="shippingAction"
                :check-data="checkData"
                :warehouse="searchData.warehouse_id">
        </shipping-type>
        <!--批量入库-->
        <batchto-warehouse
                @dialog="batchto_dialog"
                v-model="batchtoWarehouse"
                :check-data="checkData"
                :warehouse="searchData.warehouse_id">
        </batchto-warehouse>
        <export-dialog v-model="visibletes"></export-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_package, url_package} from '@/api/shipment';
    import {url_info} from '@/api/order-local'
    import {
        api_get_return,
        api_post_waitreissued,
        api_post_alreadyreissued,
        api_post_alreadystorage,
        api_get_storageinfo,
        api_post_waitstorage,
        api_post_package,
        api_get_detail,
        api_batch_storage,
        api_get_returnpackage,
        api_package_return_export,
        url_package_return_export
    } from '@/api/package-return'
    import {mapGetters, mapActions} from 'vuex';
    import {downloadFile} from "@/lib/http";

    export default {
        permission: {
            url_package, url_info,
            url_package_return_export
        },
        data() {
            return {
                loading: false,
                tableData: [],
                total: 0,
                visibletes: false,
                visible: {},
                action: {},
                operatingData: {},
                mdfid: 0,
                mdfValue: false,
                mdfTitle: '',
                informationVisble: false,
                order: {},
                shippingVisible: false,
                shippingAction: {},
                checkData: [],
                printer: '',
                token: '',
                isShow: false,
                batchtoWarehouse: false,
                country_code: '',
                package_number: '',
                partAllOptions: [
                    {
                        name: "部分导出", value: 2, action: function () {
                            if (this.checkData.length <= 0) return this.$message({
                                type: "warning",
                                message: "请先选择需要导出的数据"
                            });
                            let params = this.deal_time(this.searchData);
                            Object.assign(params, {
                                ids: this.checkData,
                                export_type: 0,
                            });
                            this.batch_export(params);
                        }
                    },
                    {
                        name: "全部导出", value: 1, action: function () {
                            let parmas = this.deal_time(this.searchData);
                            this.$set(parmas, "ids", '');
                            this.$set(parmas, "export_type", 1);
                            // let params = {
                            // ids:'',
                            // export_type:1,
                            // };
                            this.batch_export(parmas);
                        }
                    },
                ],
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
//        	批量导出、全部导出
            batch_export(parmas) {
                return this.$http(api_package_return_export, parmas).then(res => {
                    if (parmas.export_type === 0) {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let param = {
                            file_code: res.file_code,
                        };
                        downloadFile({
                            url: url,
                            get: param,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                    } else {
                        this.visibletes = true;
                    }
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            export_excel(val) {
                val.action.call(this, val);
            },
            shipping_visible(val) {
                this.visible = val;
            },
            batchto_dialog(val) {
                this.dialog = val;
            },
            view_order(val) {
                this.mdfValue = true;
                this.mdfid = val.mdfid;
                this.mdfTitle = val.mdfTitle;
                this.informationVisble = false;
                this.isShow = true;
                this.$refs.formMdf.require_server(this.mdfid)
            },
            click_number(val) {
                this.order = val.orderData;
                this.informationVisble = true;
            },
            close_dialog(val) {
                if (this.isShow) this.informationVisble = true;
            },
            close_parcel() {
                this.isShow = false;
            },
            init() {
                this.loading = true;
                let data = this.deal_time(this.searchData);

                this.$http(api_get_return, data).then(res => {
                    this.tableData = res.data;
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
                if (searchData.date_b) {
                    data.date_b = datef('YYYY-MM-dd', searchData.date_b / 1000);
                } else {
                    data.date_b = '';
                }
                if (searchData.date_e) {
                    data.date_e = datef('YYYY-MM-dd', searchData.date_e / 1000);
                } else {
                    data.date_e = '';
                }
                if (data.channel_id === 0) {
                    data.channel_id = '';
                }
                return data;
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
            look_package(row) {
                this.action = {
                    title: `查看包裹退回号 ${row.order_number}`,
                    order_number: row.order_number,
                    value: 'look',
                    id: row.id
                };
                this.$http(api_get_detail, row.id).then(res => {
                    this.operatingData = res;
                    this.visible = true;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            deal_package(row) {
                this.action = {
                    title: `处理包裹退回号 ${row.package_return_number}`,
                    order_number: row.order_number,
                    value: 'deal',
                    id: row.id
                };
                this.$http(api_get_detail, row.id).then(res => {
                    this.operatingData = res;
                    this.visible = true;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            resend_package(row) {
                this.$confirm(`您将重发包裹${row.package_number},确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_post_alreadyreissued, row.id).then(res => {
                        if (this.searchData.status !== '') {
                            this.$emit('delete-table', row.id);
                        }
                        this.print_package(row);
                        this.$message({type: "success", message: res.message || res});
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            mark_reissued(row, val2) {
                this.shippingAction = {
                    id: row.id,
                    value: 'send',
                    shipping_id: val2.shipping_id,
                    country_code: val2.country_code,
                    number: val2.package_number,
                };
                this.shippingVisible = true;
            },
            storage_package(row, package_number) {
                this.$confirm(`您将包裹${package_number}标记待入库,确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_post_waitstorage, row.id).then(res => {
                        let index = this.tableData.findIndex(item => {
                            return row.id === item.id;
                        });
                        if (index !== -1) {
                            this.tableData.splice(index, 1);
                        }
                        this.$message({type: "success", message: res.message || res});
                        this.visible = false;
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            put_storage(row) {
                this.$emit('mark-warehouse', row);
            },
            parcel_information(order) {
                if (this.$hasPermission(this.apis.url_package)) {
                    this.$http(api_get_package, order).then(res => {
                        this.order.id = order;
                        this.informationVisble = true;
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                        this.informationVisble = false;
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: '没有查看包裹详情详情的权限'
                    });
                }
            },
            show_order(row) {
                if (this.$hasPermission(this.apis.url_info)) {
                    this.$refs.formMdf.require_server(row.order_id);
                    this.mdfTitle = `查看订单号: ${row.order_number} 信息`;
                    this.mdfid = row.order_id;
                    this.mdfValue = true;
                } else {
                    this.$message({
                        type: 'error',
                        message: '没有查看订单号详情的权限'
                    });
                }
            },
            selectCheck(select) {
                this.checkData = select.map(row => {
                    return row.id;
                });
            },
            batch_storage() {
                return this.$confirm(`批量标记已选包裹待入库,确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.$http(api_batch_storage, {ids: this.checkData}).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        return Promise.resolve();
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            // 批量入库
            bulk_storage() {
                this.batchtoWarehouse = true;
            },
            batch_send() {
                this.shippingVisible = true;
                this.shippingAction = {
                    value: 'batch_send'
                }
            },
            ...mapActions({
                set_printerList: 'api/set_printerList'
            }),
            print_package(row) {
                let type = 'pdf';
                let content = '';
                let coordinate = '##';
                let numberList = [];
                let watermark = '##';
                this.$http(api_get_returnpackage, row.id).then(res => {
                    content = row.file;
                    numberList = res.identification;
                    let data = {
                        Type: type,
                        Token: this.token,
                        watermark: watermark,
                        coordinate: coordinate,
                        Width: 100,
                        Height: 100,
                        url: config.apiHost + res.callback,
                        PrintName: this.printer,
                        NumberList: numberList,
                        content: content,
                    };
                    this.$printer(this.printer, data);
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            }
        },
        computed: {
            isStockPending() {
                return this.checkData.length === 0 || this.searchData.status !== 0 && this.searchData.status !== 3
            }
        },
        watch: {
            'searchData.status': function (val) {
                if (val !== 0) {
                    this.checkData = [];
                    this.checkData.length = 0;
                }
            }
        },
        props: {
            searchData: {},
        },
        components: {
            trendsSelect: require('@/components/trends-select').default,
            uiTip: require('@/components/ui-tip.vue').default,
            operating: require('./operating.vue').default,
            parcelInformation: require('../placeorder/parcel-information').default,
            formMdf: require("../../order/local/form-mdf.vue").default,
            shippingType: require('./shipping-type').default,
            selectPrinter: require('@/components/select-printer.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
            batchtoWarehouse: require('./batchto-warehouse.vue').default,
            exportDialog: require('@/view/report/export-dialog').default,//report/export-dialog
        },
    }
</script>
