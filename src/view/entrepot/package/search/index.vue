<template>
    <page class="p-package-search">
        <label-item label="请选择仓库：" class="mb-xs mt-sm">
            <el-select v-model="warehouse_id"
                       multiple
                       filterable class="inline width-super" @change="select_warehouse">
                <el-option
                        :key="item.value"
                        v-for="item in warehouses"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <search-card @search="go_search" :params="searchData" :clears="clears" class="mb-xs">
            <label-buttons label="包裹来源："
                           class="inline"
                           @select="change_source"
                           :buttons="sourceList">
            </label-buttons>
            <label-item label="采购发起异常包裹：" class="ml-sm">
                <el-select v-model="searchData.processing_status" clearable class=" s-width-default">
                    <el-option v-for="(item,index) in processingStatusList"
                               :value="item.value"
                               :label="item.label"
                               :key="index"></el-option>
                </el-select>
            </label-item>
            <div>
                <label-buttons label="包裹状态："
                               class="inline"
                               @select="change_status"
                               :buttons="useList">
                </label-buttons>

                <label-buttons label="异常类型："
                               v-if="searchData.is_use === 3"
                               class="inline"
                               @select="change_abnormal_type"
                               :buttons="abnormalTypeList">
                </label-buttons>

                <label-item label="运输方式：" class="mb-xs">
                    <allow-create-select class="s-width-middle"
                                         v-model="searchData.shipping_methods">
                    </allow-create-select>
                </label-item>
            </div>

            <label-item label="预接收员：">
                <super-select v-sf.ready_receive_id
                              v-model="searchData.ready_receive_id"
                              filterable
                              :options="receiving_clerk"
                              storage-key="receiver"
                              class="keyBoarder inline"></super-select>
                <!--<el-select v-sf.ready_receive_id
                           v-model="searchData.ready_receive_id"
                           filterable
                           class="keyBoarder inline">
                    <el-option
                            v-for="item in receiving_clerk"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>-->
            </label-item>
            <label-item label="接收员：" class="ml-sm">
                <super-select v-sf.s_creator_user_id
                              v-model="searchData.s_creator_user_id"
                              filterable
                              :options="receiving_clerk"
                              storage-key="receiver"
                              class="keyBoarder inline"></super-select>
                <!--<el-select v-sf.s_creator_user_id
                           v-model="searchData.s_creator_user_id"
                           filterable
                           class="keyBoarder inline">
                    <el-option
                            v-for="item in receiving_clerk"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>-->
            </label-item>
            <el-select v-sf.s_bill_type
                       v-model="searchData.s_bill_type"
                       class="s_bill_type ml-sm inline">
                <el-option v-for="(item, index) in typeList"
                           :key="index"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
            <el-input v-model="searchData.s_bill_number"
                      v-sf.s_bill_number
                      placeholder="请输入内容" class="inline"
                      @keyup.enter.native="key_up_enter($event)"></el-input>
            <!--<label-item label="包裹状态：" class="ml-sm">
                <el-select v-sf.is_use v-model="searchData.is_use" class="width-sm inline">
                    <el-option v-for="(item, index) in useList"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>sync_purchase
                </el-select>
            </label-item>-->
            <el-select v-model="searchData.time_type"
                       class="inline s-width-default ml-sm">
                <el-option v-for="item in timeTypeList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <el-date-picker
                    v-sf.s_begin_date
                    v-model="searchData.s_begin_date"
                    type="date"
                    placeholder="选择日期"
                    class="inline date"
                    :picker-options="inputTimeStart">
            </el-date-picker>
            <label>&nbsp;--&nbsp;</label>
            <el-date-picker
                    v-sf.s_end_date
                    v-model="searchData.s_end_date"
                    type="date"
                    placeholder="选择日期"
                    class="inline selectDate"
                    :picker-options="inputTimeEnd">
            </el-date-picker>
        </search-card>
        <el-card v-loading="loading"
                 element-loading-text="玩命加载中...">
            <div class="mb-xs">
                <permission tag="trendsSelect"
                            class="inline"
                            type="primary"
                            :route="apis.url_purchase_search_export"
                            :selects="partAllOptions"
                            @trigger="export_excel">
                </permission>
                <permission tag="ElButton"
                            class="ml-sm inline"
                            type="primary"
                            size="mini"
                            :disabled="abnormalableData.length !== 1"
                            @click="mark_parcel_abnormal"
                            :route="apis.url_mark_parcel_abnormal">
                    标记异常
                </permission>
                <permission tag="ElButton"
                            class="ml-sm inline"
                            type="primary"
                            size="mini"
                            v-show="isShow"
                            :disabled="isDisabled"
                            @click="abnormal_restore"
                            :route="apis.url_abnormal_deal_unopened">
                    异常处理正常
                </permission>
                <div class="fr">
                    <label class="color-lump purchase-abnormal"></label><span>采购发起长时间未拆流程，未处理</span>
                </div>
                <!--<p style="color: #e4393c; margin-top: 0;" class="fr">注意：只有未拆分的包裹才可以编辑</p>-->
            </div>
            <el-table
                    :data="tableData"
                    v-resize={height:40}
                    class="scroll-bar"
                    @selection-change="select_change"
                    :row-class-name="get_class_name"
                    highlightCurrentRow>
                <el-table-column type="selection" width="35" align="center"></el-table-column>
                <!--<el-table-column
                        prop="indexNum"
                        label="排序"
                        width="40">
                </el-table-column>-->
                <el-table-column
                        inline-template
                        min-width="65"
                        label="运输方式">
                    <div>
                        <ui-tip :content="row.shipping_methods" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        min-width="65"
                        width="110"
                        label="运单号">
                    <div>
                        <ui-tip :content="row.tracking_number" :width="128"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        min-width="45"
                        label="包裹数">
                    <div>
                        <ui-tip :content="row.parcel_num" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        min-width="65"
                        label="采购单号">
                    <div>
                        <ui-tip :content="row.purchase_order_codes" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        width="75"
                        inline-template
                        label="重量（g）">
                    <div>
                        <ui-tip :content="row.purchase_parcel_weight" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        min-width="55"
                        label="供应商">
                    <div>
                        <ui-tip :content="row.supplier_name" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        width="70"
                        label="采购员"
                        min-width="55">
                    <div>
                        <ui-tip :content="row.purchaser_user_name_list | purchaser_name" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <!--<el-table-column
                        min-width="55"
                        inline-template
                        label="收货台">
                    <div>
                        <ui-tip :content="row.receiving_platform" :width="90"></ui-tip>
                    </div>
                </el-table-column>-->
                <el-table-column
                        inline-template
                        label="仓库"
                        min-width="55">
                    <div>
                        <ui-tip :content="row.warehouse_name" :width="90"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        width="75"
                        min-width="65"
                        inline-template
                        label="预接收员">
                    <div>
                        <ui-tip :content="row.ready_receive_user" :width="90"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        min-width="90"
                        inline-template
                        label="预接收时间">
                    <div>
                        <ui-tip :content="row.ready_receive_time" :width="90"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        min-width="55"
                        inline-template
                        label="接收员">
                    <div>
                        <ui-tip :content="row.creator_user_name" :width="90"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        min-width="90"
                        inline-template
                        label="接收时间">
                    <div>
                        <ui-tip :content="row.create_data_time" :width="90"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        min-width="65"
                        inline-template
                        label="是否紧急">
                    <span class="receiveNormal" :class="{receiveUrgency:row.is_urgent}"><b>{{row.is_urgent | statusFilters}}</b></span>
                </el-table-column>
                <el-table-column
                        min-width="65"
                        inline-template
                        label="包裹状态">
                    <span :class="{redColor:row.is_use === 1}">{{row.is_use_text}}</span>
                </el-table-column>

                <el-table-column
                        min-width="55"
                        inline-template
                        label="异常类型">
                    <ui-tip :content="row.receive_abnormal_text" :width="90"></ui-tip>
                </el-table-column>
                <el-table-column
                        min-width="55"
                        inline-template
                        label="异常原因">
                    <div>{{row.abnormal_content || row.processing_method}}</div>
                </el-table-column>
                <el-table-column
                        label="操作" min-width="90">
                    <template slot-scope="scope">
                        <permission tag="ElButton"
                                    :route="apis.url_parcel_getOrder"
                                    type="text"
                                    :disabled="scope.row.is_use !== 1"
                                    @click="view(scope.row.purchase_parcel_code)"
                                    :class="{packOperate:scope.row.is_use === 1}">明细
                        </permission>
                        <permission tag="span"
                                    :route="apis.url_parcel_update">|
                        </permission>
                        <permission tag="ElButton"
                                    :route="apis.url_parcel_update"
                                    v-if="scope.row.is_use === 2"
                                    type="text"
                                    @click="ready_edit(scope.row.tracking_number)"
                                    :class="{packOperate:scope.row.is_use === 2}">修改
                        </permission>
                        <permission tag="ElButton"
                                    v-else
                                    :route="apis.url_parcel_update"
                                    :disabled="scope.row.is_use !== 0"
                                    type="text"
                                    @click="update_item(scope.row.purchase_parcel_code)"
                                    :class="{packOperate:scope.row.is_use === 0}">修改
                        </permission>
                        <!--<permission tag="span"
                                    :route="apis.url_parcel_delete">|
                        </permission>
                        <permission tag="ElButton"
                                    :route="apis.url_parcel_delete"
                                    type="text"
                                    @click="delete_item(scope.row.purchase_parcel_code, scope.row.tracking_number)"
                                    :disabled="scope.row.is_use === 1"
                                    :class="{packOperate:scope.row.is_use !== 1}">删除
                        </permission>-->
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    class="page-fixed get-parcel-list"
                    @size-change="handle_size_change"
                    @current-change="handle_current_change"
                    :current-page="searchData.page"
                    :page-sizes="[20, 50, 100, 200,500]"
                    :page-size="searchData.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
            <search-dialog v-model="dialogTableVisible" :purchase-note="purchaseNote"></search-dialog>
            <updata-dialog v-model="updateVisible" :update-form="updateForm" @table-data="update_table"></updata-dialog>
            <export-dialog v-model="exportVisible"></export-dialog>
        </el-card>
        <ready-edit v-model="readyVisible"
                    @ready-edit="init"
                    :ready-info="readyInfo"
                    :ready-data="readyData"></ready-edit>
        <abnormal-launch v-model="abnormalMarkVisible"
                         @search="init"
                         :abnormal-info="abnormalInfo"></abnormal-launch>
    </page>
</template>
<style lang="stylus">
    .p-package-search {
        .purchase-abnormal {
            vertical-align: middle;
            background: #ff0b1e;
        }
        .selectDate {
            width: 150px !important;
        }

        .keyBoarder {
            width: 120px;
        }

        .s_bill_type input {
            width: 100px;
        }

        .borderNone {
            border: none;
        }

        .trackingInput {
            width: 80%;
            height: 100%;
            text-align: center;
            background-color: rgba(0, 0, 0, 0);
            outline: none;
        }

        .redColor {
            color: #e4393c;
        }

        .hasBorder {
            border: 1px solid #C0CCDA;
            border-radius: 4px;
        }

        .receiveNormal {
            color: green;
        }

        .receiveUrgency {
            color: #e4393c;
        }

        .packOperate {
            color: #6699FF !important;
        }

        .get-parcel-list {
            margin-left: -15px;
            padding-top: 10px;
        }

        .bg-red {
            color: #ff0b1e;
        }
        /*.bg-white {
            background-color: #e4393c;

        }*/
    }
</style>
<script>
    import {
        api_parcel_get,
        api_parcel_getOrder,
        api_parcel_searchOrder,
        api_parcel_update,
        api_parcel_delete,
        api_user_warehouse,
        api_purchase_search_export,
        api_abnormal_type,
        api_abnormal_source,
        api_abnormal_deal_unopened,
        url_abnormal_deal_unopened,
        url_parcel_searchOrder,
        url_parcel_getOrder,
        url_parcel_delete,
        url_parcel_update,
        url_purchase_search_export,
        url_mark_parcel_abnormal,
    } from "@/api/search-parcel.js"
    import {api_ready_receive_info, url_ready_receive_edit} from "@/api/ready-receive";
    import {api_get_warehouse} from "@/api/report-channel.js"
    import {downloadFile} from "@/lib/http";

    export default {
        permission: {
            url_parcel_searchOrder,
            url_parcel_getOrder,
            url_parcel_delete,
            url_parcel_update,
            url_purchase_search_export,
            url_mark_parcel_abnormal,
            url_abnormal_deal_unopened
        },
        page: {},
        refresh() {
            this.go_search();
        },
        data() {
            return {
                warehouse_id: [],
                searchData: {
                    page: 1,
                    pageSize: 20,
                    ready_receive_id: '',
                    s_creator_user_id: '',
                    processing_status: '',
                    time_type: 2,
                    s_bill_type: 2,
                    s_bill_number: '',
                    s_begin_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
                    s_end_date: new Date(),
                    is_use: '',
                    receive_abnormal: '',
                    parcel_source: '',
                    shipping_methods: '',
                },
                clears: {
                    page: 1,
                    pageSize: 20,
                    s_bill_type: 2,
                    time_type: 2,
                },
                warehouses: [],
                useList: [
                    {label: '全部', value: ''},
                    {label: '已接收', value: 2},
                    {label: '未拆', value: 0},
                    {label: '已拆', value: 1},
                    {label: '异常', value: 3},
                ],
                typeList: [
                    {label: '运单号', value: 2},
                    {label: '接收单号', value: 3},
                    {label: '采购单ID', value: 1},
                    {label: 'SKU', value: 5}
                ],
                timeTypeList: [
                    {label: '创建时间', value: 2},
                    {label: '预接收时间', value: 1},
                    {label: '接收时间', value: 0},
                ],
                sourceList: [
                    {label: '全部', value: ''},
                    {label: '包裹预接收', value: 1},
                    {label: '包裹接收', value: 0},
                ],
                processingStatusList: [
                    {label: '全部', value: -1},
                    {label: '已处理', value: 1},
                    {label: '未处理', value: 0},
                ],
                abnormalTypeList: [],
                dialogTableVisible: false,//是否显示弹出框
                updateVisible: false,
                receiving_clerk: [],
                updateForm: {},
                inputTimeStart: {
                    disabledDate: (time) => {
                        if (this.searchData.s_end_date) {
                            return time.getTime() > this.searchData.s_end_date.getTime();
                        } else {
                            return false
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.s_begin_date) {
                            return time.getTime() < this.searchData.s_begin_date.getTime();
                        } else {
                            return false
                        }
                    }
                },//结束时间
                total: 0,
                tableData: [],//获取的数据
                purchaseNote: {},//编辑返回的数据
                loading: true,
                trackRedact: true,//运单号是否可以编辑
                weightRedact: true,//重量是否可以编辑
                export_type: '',
                partAllOptions: [
                    {
                        name: "全部导出", value: 1, action: function () {
                            this.export_type = 1; // 全部导出
                            this.search_export();
                        }
                    },
                    {
                        name: "部分导出", value: 0, action: function () {
                            if (this.selectList <= 0) return this.$message({type: "warning", message: "请先选择需要导出的数据"});
                            this.export_type = 2;
                            this.search_export();
                        }
                    },
                ],
                selectList: [],
                exportVisible: false,
                readyData: {},
                readyInfo: {},
                readyVisible: false,
                firstRequest: true,
                abnormalMarkVisible: false,
                abnormalInfo: {}
            }
        },
        mounted() {
            this.get_warehouses();
            this.user_warehouse();
            this.get_abnormal_type_list();
        },
        filters: {
            purchaser_name(row) {
                return row.toString();
            },
            isSplit(row) {
                if (row === 1) {
                    return '已拆';
                } else {
                    return '未拆'
                }
            },
            statusFilters(val) {
                if (val === 1) {
                    return '紧急';
                } else {
                    return '正常';
                }
            },
            timeFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
        },
        methods: {
            abnormal_restore(){
                let ids = this.selectList.map(row => row.id);
                let data = {
                    ids: ids
                };
                this.$http(api_abnormal_deal_unopened, data).then(res => {
                    this.$message({type: 'success', message: res.message});
                    this.init()
                }).catch(err => {
                    this.$message({type: 'error', message: err.message || err})
                })
            },
            export_excel(val) {
                val.action.call(this);
            },
            get_warehouses() {
                let data = {type: [1, 6]};
                this.$http(api_get_warehouse, data).then(res => {
                    this.warehouses = res.map(warehouse => {
                        return {
                            value: warehouse.id,
                            label: warehouse.name
                        }
                    });
                    this.warehouse_id = [this.warehouses[0].value];
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                })
            },
            get_abnormal_type_list() {
                this.$http(api_abnormal_type).then(res => {
                    res.unshift({
                        label: '全部',
                        value: '',
                    });
                    this.abnormalTypeList = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            //初始化
            init() {
                if (this.firstRequest) return;
                this.loading = true;
                let data = this.get_params();
                this.$http(api_parcel_get, data).then(res => {
                    this.loading = false;
                    this.total = res.count;
                    this.tableData = res.list;
                    let i = 1;
                    this.tableData.forEach(row => {
                        let arr = [];
                        let code = '';
                        row.purchase_order_ids.split(',').forEach(item => {
                            item = item ? 'PO' + item : item;
                            arr.push(item);
                        });
                        code = arr.join(',');
                        row.purchase_order_codes = code;
                        row.indexNum = i;
                        i++;
                    });
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            get_params() {
                //处理年月日 YYYY-MM-dd
                let data = clone(this.searchData);
                data.warehouse_id = this.warehouse_id;
                if (this.searchData.s_begin_date) {
                    data.s_begin_date = datef('YYYY-MM-dd', this.searchData.s_begin_date.getTime() / 1000);
                } else {
                    data.s_begin_date = '';
                }
                if (this.searchData.s_end_date) {
                    data.s_end_date = datef('YYYY-MM-dd', this.searchData.s_end_date.getTime() / 1000);
                } else {
                    data.s_end_date = '';
                }
                typeof data.s_bill_number === 'string' && (data.s_bill_number = data.s_bill_number.trim());
                return data;
            },
            user_warehouse() {
                this.$http(api_user_warehouse).then(res => {
                    let receive_list = res.map(row => {
                        return {label: row.realname, value: row.id};
                    });
                    // this.receiving_clerk = [{label: '全部', value: ''}, ...receive_list];
                    this.receiving_clerk = receive_list;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            //点击查看
            view(data) {
                this.purchaseNote = {};
                this.$http(api_parcel_getOrder, {purchase_parcel_code: data}).then(res => {
                    if (res.status === 1) {
                        this.purchaseNote = res.list;
                        this.dialogTableVisible = true;
                    }
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                })
            },
            //点击修改
            update_item(data) {
                this.$http(api_parcel_getOrder, {purchase_parcel_code: data}).then(res => {
                    res.list.purchaser_user_name_list = res.list.purchaser_user_name_list.toString();
                    this.updateForm = res.list;
                    this.updateVisible = true;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                })
            },
            ready_edit(tracking_number) {
                let data = {
                    tracking_number: tracking_number,
                };
                this.$http(api_ready_receive_info, data).then(res => {
                    if (!isEmpty(res)) {
                        res.parcel_num = res.parcel_num.toString();
                        this.readyData = res;
                    }
                    this.readyInfo = {
                        title: `修改运单号：${data.tracking_number}信息`,
                        action: 'edit',
                    };
                    this.readyVisible = true;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            //更新table的数据
            update_table(data) {
                let index = null;
                for (let i = 0; i < this.tableData.length; i++) {
                    if (this.tableData[i].purchase_parcel_code === data.purchase_parcel_code) {
                        this.tableData[i].purchase_parcel_weight = data.purchase_parcel_weight;
                        this.tableData[i].tracking_number = data.tracking_number;
                        this.tableData[i].logistics_company_name = data.logistics_company_nam;
                        this.tableData[i].parcel_num = data.parcel_num;
                    }
                    break;
                }
                //重新排序
                let i = 1;
                this.tableData.map(res => {
                    res.indexNum = i;
                    i++;
                });
            },
            //点击删除
            delete_item(data, track) {
                this.$confirm('您将删除运单号' + track + '，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_parcel_delete, {purchase_parcel_code: data}).then(res => {
                        if (res.status === 1) {
                            this.$message({
                                showClose: true,
                                type: 'success',
                                message: '删除成功！'
                            });
                            let index = this.tableData.indexOfFun(data, function (old, data) {
                                return old.purchase_parcel_code === data
                            });
                            this.tableData.splice(index, 1);
                            let i = 1; // 排序
                            this.tableData.map(res => {
                                res.indexNum = i;
                                i++;
                            });
                            this.total--;
                        } else {
                            this.$message({
                                showClose: true,
                                type: 'error',
                                message: res.message || res,
                            })
                        }
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            select_warehouse() {
                this.firstRequest = false;
                this.handle_current_change(1);
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
            //点击搜索
            go_search() {
                this.init();
            },
            //按下回车搜索
            key_up_enter(ev) {
                if (ev.keyCode === 13) {
                    this.go_search();
                }
            },
            search_export() {
                let data = {
                    export_type: this.export_type,
                };
                if (this.export_type === 1) {
                    Object.assign(data, this.get_params());
                } else {
                    Object.assign(data, this.get_params(), {ids: this.selectList.map(item => item.id)});
                }
                this.$http(api_purchase_search_export, data).then(res => {
                    if (res.join_queue === 1) {
                        this.exportVisible = true;
                    } else {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let data = {
                            file_code: res.file_code,
                        };
                        downloadFile({
                            url: url,
                            get: data,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            // 红色标记类名添加
            get_class_name(row, index) {
                return row.color === 'red' ? `bg-${row.color}` : ''
            },
            //
            select_change(val) {
                this.selectList = val;
            },
            change_status(index, item) { // 状态改变
                this.searchData.is_use = item.value;
                if (item.value === 2 || item.value === 3) {
                    this.searchData.time_type = 1;
                } else {
                    this.searchData.time_type = 0;
                }
                this.init();
            },
            // 异常类型改变
            change_abnormal_type(index, item) {
                this.searchData.receive_abnormal = item.value;
                this.init();
            },
            change_source(index, item) { // 来源改变
                this.searchData.parcel_source = item.value;
                if (item.value === 1) {
                    this.searchData.time_type = 1;
                } else {
                    this.searchData.time_type = 0;
                }
                this.init();
            },
            change_processing_status(index, item) {
                this.searchData.processing_status = item.value;
                this.init();
            },
            // 标记包裹异常
            mark_parcel_abnormal() {
                let data = this.abnormalableData[0];
                this.abnormalInfo = {
                    ids: this.abnormalableData.map(row => row.id),
                    tracking_number: data.tracking_number,
                    purchase_order_codes: data.purchase_order_codes,
                    is_use_text: data.is_use_text,
                    abnormal_status: '',
                    content: '',
                    color: data.color,
                    purchase_id: '',
                };
                if (data.color !== 'red') this.$set(this.abnormalInfo, 'sync_purchase', '');
                this.abnormalMarkVisible = true;
            }
        },
        computed: {
            isShow(){
                return this.selectList.length > 0 ? true : false
            },
            isDisabled(){//控制异常处理未拆按钮是否可点击
                let arr = this.selectList.filter(row => row.is_use === 3);
                if(arr.length === 0){
                    return true
                }
                let brr = [... new Set(arr.map(row => row.receive_abnormal_text))];
                if(brr.length > 1){
                    return true
                }else{
                    return brr.includes('PO缺失')
                }
            },
            abnormalableData() {
                return this.selectList.filter(row => [0, 2].includes(row.is_use));
            }
        },
        watch: {},
        props: {},
        components: {
            searchDialog: require('./search-dialog.vue').default,
            updataDialog: require('../receive/updata-dialog.vue').default,
            abnormalLaunch: require('./abnormal-launch.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            labelButtons: require('@/components/label-buttons.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            readyEdit: require('../pre-receive/ready-edit.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            trendsSelect: require('@/components/trends-select').default,
            exportDialog: require('@/view/entrepot/warehouse-goods/export-dialog.vue').default,
            allowCreateSelect: require('@/components/allow-create-select.vue').default,
        },
    }
</script>
