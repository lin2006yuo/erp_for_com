<template>
    <page class="p-intercept">
        <search-list ref="search" :search-data="searchData" @search_list="search_list"
                     @clear_list="clear_list"></search-list>
        <div class="mt-sm mb-sm ml-sm">
            <permission tag="trendsSelect"
                        class="inline mr-sm"
                        type="primary"
                        v-if="isShowButton"
                        :route="apis.url_order_hold_status"
                        :selects="partAllOptions"
                        @trigger="operate_status($event)"></permission>
            <permission tag="trendsSelect"
                        class="inline"
                        type="primary"
                        :route="apis.url_orders_hold_export"
                        :selects="exportOptions"
                        @trigger="export_excel">
            </permission>
        </div>
        <el-table :data="tableData"
                  v-loading="loading"
                  v-resize="{height:38}" :isFirst="isFirst"
                  @selection-change="handleSelectionChange">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection" width="30px"></el-table-column>
            <el-table-column label="包裹号" inline-template>
                <div>
                    <ui-tip :is-operate="true" :content="row.number" :width="98"
                            @cur-click="parcel_information(row.number)"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="订单号" inline-template>
                <div>
                    <ui-tip :is-operate="true" :content="row.order_number[0].order_number" :width="98"
                            @cur-click="show_order(row)"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="平台/站点" inline-template>
                <div>{{row.channel_name}}/{{row.site_code}}</div>
            </el-table-column>
            <el-table-column prop="account_name" label="账号简称" min-width="50">
            </el-table-column>
            <el-table-column prop="seller" label="销售员" min-width="50">
            </el-table-column>
            <el-table-column prop="warehouse_name" min-width="50" label="发货仓库">
            </el-table-column>
            <el-table-column prop="shipping_name" label="运输方式">
            </el-table-column>
            <el-table-column prop="shipping_number" label="跟踪单号">
            </el-table-column>
            <el-table-column prop="status" label="拦截状态" min-width="60">
            </el-table-column>
            <el-table-column prop="reason.remark" label="拦截原因">
            </el-table-column>
            <el-table-column prop="comment" label="拦截失败原因">
            </el-table-column>
            <el-table-column prop="creator" label="创建人" min-width="50">
            </el-table-column>
            <el-table-column label="创建时间" inline-template width="140">
                <span>{{row.created_time | filterTime}}</span>
            </el-table-column>
            <el-table-column label="操作" inline-template>
                <trends-select class="inline" @trigger="operate(row,$event)" v-if="buttonStatus!==3"
                               :selects="operatesList" type="primary" width="100px"></trends-select>
                <trends-select class="inline" @trigger="operate(row,$event)" v-else :selects="_operatesList"
                               type="primary" width="100px"></trends-select>
            </el-table-column>
        </el-table>
        <look-detail v-model="lookVisble" :id="lookId" :order-number="orderNumber" @information="click_information"
                     @order-number="click_order"></look-detail>
        <form-mdf ref="formMdf"
                  :mdfid="mdfid"
                  v-model="mdfValue"
                  :is-edit="isEdit"
                  @close-dialog="close_dialog"
                  @click-number="click_number"
                  :title="mdfTitle"></form-mdf>
        <parcel-information
                @close-parcel="close_parcel"
                v-model="informationVisble"
                @view-order="view_order"
                :order="order"
        ></parcel-information>

        <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {
        url_order_hold_status,
        url_orders_hold_export,
        api_order_hold,
        api_order_hold_batch,
        api_orders_hold_export
    } from "../../../api/order-intercept";
    import {downloadFile} from '../../../lib/http';
    import {operateList} from './action';//------操作按钮引入
    import {url_package} from "../../../api/shipment"
    import {url_info} from '../../../api/order-local'

    export default {
        page: {
            devinfo: {
                frontEnd: '何伊莎',
                backEnd: '张文宇',
                createTime: '2017-9-29',
                updateTime: '2017-9-29'
            },
            beforeClose() {
                return true;
            }
        },
        refresh() {
            this.init();
        },
        permission: {
            url_order_hold_status, url_package, url_info, url_orders_hold_export
        },
        data() {
            return {
                loading:false,
                exportRequest: {},
                ids: [],
                export_type: 0,
                exportData: {},
                searchData: {
                    shipping:[],
                    status: 0,
                    snType: "number",
                    snText: "",
                    channel_id: "",
                    account_id: "",
                    warehouse_id: "",
                    shipping_id: "",
                    date_b: "",
                    date_e: "",
                    page: 1,
                    pageSize: 20,
                },
                tableData: [
                    {number: 1},
                    {number: 3},
                    {number: 5},
                ],
                option: "",
                total: 0,
                operateList: operateList,
                multipleSelection: [],
                mdfTitle: "",
                mdfid: 0,
                mdfValue: false,
                informationVisble: false,
                lookVisble: false,
                order: {},
                buttonStatus: 0,
                lookId: 0,
                orderNumber: [],
                isEdit: {edit: false},
                isShow: false,
                isFirst: true,
                exportOptions: [
                    {
                        name: "部分导出", value: 0, action: function () {
                            if (this.ids.length <= 0) return this.$message({type: "warning", message: "请先选择需要导出的数据"});
                            this.exportData = this.init_params();
                            this.$set(this.exportData, 'ids', this.ids);
                            this.$set(this.exportData, 'export_type', 0);
                            this.order_export(this.exportData);
                        }
                    },
                    {
                        name: "全部导出", value: 1, action: function () {
                            if (this.tableData.length <= 0) return this.$message({
                                type: "warning",
                                message: "暂时没有可以导出的数据"
                            });
                            this.ids = [];
                            this.ids = this.tableData.map(row => row.id);
                            this.exportData = this.init_params();
                            this.$set(this.exportData, 'ids', this.ids);
                            this.$set(this.exportData, 'export_type', 1);
                            this.order_export(this.exportData);
                        }
                    },
                ]
            }
        },
        mounted() {
            this.init();
            this.exportRequest = {
                url: `${config.apiHost}orders/export`,
                get: {ids: this.ids},
                name: "导出订单"
            };
        },
        methods: {
            order_export(params) {
                this.$http(api_orders_hold_export, params).then(res => {
                    let url = config.apiHost + 'downloadFile/downExportFile';
                    let params = {
                        file_code: res.file_code,
                        page: this.searchData.page,
                        pageSize: this.searchData.pageSize,
                    };
                    downloadFile({
                        url: url,
                        get: params,
                        fileName: res.file_name,
                        suffix: '.xls',
                    });
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            export_excel(val) {
                val.action.call(this, val);
            },
            download_file() {
                if (this.ids.length <= 0) return this.$message({type: "warning", message: "请选择需要导出的数据"});
                this.exportRequest.get.ids = this.ids;
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
            init_params(){
                let data = window.clone(this.searchData);
                if (this.searchData.date_b) {
                    data.date_b = datef("YYYY-MM-dd", this.searchData.date_b / 1000)
                } else {
                    data.date_b = "";
                }
                if (this.searchData.date_e) {
                    data.date_e = datef("YYYY-MM-dd", this.searchData.date_e / 1000)
                } else {
                    data.date_e = "";
                }
                if(this.searchData.snType==='number'){
                    let cur = this.searchData.snText.trim().split('\n').map(row=>row.trim()).filter(row=>row!=='');
                    if(cur.length>0){
                        data.snText = cur;
                    }else {
                        data.snText = '';
                    }
                }else{
                    data.snText = data.snText.trim();
                }
                delete data.shipping;
                return data
            },
            init() {
                this.isFirst = true;
                this.ids = [];
                this.tableData = [];
                this.loading = true;
                let data = this.init_params();
                this.$http(api_order_hold, data).then(res => {
                    this.tableData = res.data;
                    this.total = res.count;
                    this.loading = false;
                    this.isFirst = false;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                });
            },
            search_list(status) {
                if (status !== undefined) {
                    console.log(this.searchData.status);
                    this.searchData.status = status;
                    this.buttonStatus = status;
                }
                this.init();
            },
            clear_list() {
                this.searchData = {
                    shipping:[],
                    status: this.buttonStatus,
                    snType: "number",
                    snText: "",
                    channel_id: "",
                    account_id: "",
                    warehouse_id: "",
                    shipping_id: "",
                    date_b: "",
                    date_e: "",
                    page: 1,
                    pageSize: 20,
                };
            },
            operate_status(options) {
                if (this.multipleSelection.length === 0) {
                    this.$message({type: "warning", message: "请选择要操作的包裹"});
                    return;
                }
                switch (options.value) {
                    case 1:
                        this.$prompt('您确定已勾选的包裹拦截失败了吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            inputPattern: /.{1,}/,
                            inputPlaceholder: '拦截失败原因（必填）',
                            inputErrorMessage: '拦截失败原因不能为空'
                        }).then(({value}) => {
                            let data = {
                                ids: this.multipleSelection.map(x => {
                                    return x.id
                                }),
                                status: options.value,
                                comment: value,
                            };
                            this.hold_batch(data);
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消操作'
                            });
                        });
                        break;
                    case 2:
                        this.$confirm(`您确定已成功拦截所勾选的包裹吗？`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            let data = {
                                ids: this.multipleSelection.map(x => {
                                    return x.id
                                }),
                                status: options.value,
                            };
                            this.hold_batch(data);
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消操作'
                            });
                        });
                        break;
                    case 4:
                        this.$confirm(`您确定正在处理所勾选的包裹吗？`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            let data = {
                                ids: this.multipleSelection.map(x => {
                                    return x.id
                                }),
                                status: options.value,
                            };
                            this.hold_batch(data);
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消操作'
                            });
                        });
                        break;
                }
            },
            hold_batch(data) {
                this.$http(api_order_hold_batch, data).then(res => {
                    this.$message({
                        type: "success",
                        message: res.message || res
                    });
                    if (this.buttonStatus !== data.status) {
                        data.ids.forEach(row => {
                            let i = this.tableData.indexOfFun(function (old) {
                                return old.id === row;
                            });
                            this.tableData.splice(i, 1);
                            this.total -= 1;
                        });
                    }
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.ids = [];
                this.ids = val.map(row => row.id);
            },
            handleSizeChange(size) {
                this.searchData.pageSize = size;
                this.init();
            },
            handleCurrentChange(page) {
                this.searchData.page = page;
                this.init();
            },
            operate(data, options) {
                options.action.call(this, data);
            },
            show_order(row) {
                if (this.$hasPermission(this.apis.url_info)) {
//                    console.log("1025043735527080000")
                    let order_id = 0;
                    let order_number = "";
                    if (row.order_number instanceof Array) {
                        row.order_number.forEach(inner => {
                            order_id = inner.order_id;
                            order_number = inner.order_number;
                        })
                    } else {
                        order_id = row.order_id;
                        order_number = row.order_number;
                    }
                    this.$refs.formMdf.require_server(order_id);
                    this.mdfTitle = `查看订单号: ${order_number} 信息`;
                    this.mdfid = order_id;
                    this.mdfValue = true;
                } else {
                    this.$message({
                        type: 'error',
                        message: '没有查看订单号详情的权限'
                    });
                }
            },
            parcel_information(order) {
                if (this.$hasPermission(this.apis.url_package)) {
                    this.order.id = order;
                    this.informationVisble = true;
                } else {
                    this.$message({
                        type: 'error',
                        message: '没有查看包裹详情详情的权限'
                    });
                }

            },
            click_information(order) {
                this.parcel_information(order);
            },
            click_order(row) {
                this.show_order(row);
            },
        },
        computed: {
            operatesList() {
                return operateList.filter(row => {
                    return this.$hasPermission(row.api)
                })
            },
            _operatesList() {
                return operateList.filter(row => {
                    if (row.value !== '3') {
                        return this.$hasPermission(row.api)
                    }
                })
            },
            isShowButton() {
                return this.buttonStatus === 0 || this.buttonStatus === 4;
            },
            partAllOptions() {
                switch (this.buttonStatus) {
                    case 0:
                        return [{name: "拦截失败", value: 1}, {name: "拦截成功", value: 2}, {name: "拦截处理中", value: 4}];
                        break;
                    case 4:
                        this.isShow = true;
                        return [{name: "拦截失败", value: 1}, {name: "拦截成功", value: 2}]
                }
            },
            emptyText(){
                return this.isFirst?'等待请求数据中...':'暂无数据'
            }
        },
        filters: {
            filterTime(val) {
                return val ? datef('YYYY-MM-dd HH:mm:ss', val) : "-- --";
            },
        },
        components: {
            uiTip: require('../../../components/ui-tip.vue').default,
            trendsSelect: require('../../../components/trends-select.vue').default,
            searchList: require('./search-list.vue').default,
            parcelInformation: require('../../entrepot/placeorder/parcel-information.vue').default,
            formMdf: require("../local/form-mdf.vue").default,
            lookDetail: require('./look-detail.vue').default
        }
    }
</script>
