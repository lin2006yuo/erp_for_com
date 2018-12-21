<template>
    <page class="plan-index-purchase-plan">
        <search-card @search="search_list" :params="searchParams" :clears="clears">
            <div class="el-row">
                    <label-buttons label="仓库类型："
                                   :buttons="warehouses"
                                   class="inline"
                                   @select="change_depot"
                                   title="请选择仓库类型">
                    </label-buttons>
                    <label-buttons label="状态："
                                   class="inline ml-sm"
                                   :buttons="statuses"
                                   @select="change_status"
                                   title="请选择状态">
                    </label-buttons>
            </div>
            <div class="el-row mb-mini">
                <el-select v-sf.snType v-model="searchParams.snType"
                           class="inline s-width-small" @change="change_label">
                    <el-option
                        :key="item.value"
                        v-for="item in selectList1"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <order-input v-if="notIsSPU" v-model="searchParams.snText"
                             class="inline s-width-large"
                             v-sf.snText
                             @keydown="search_list"
                             placeholder="可批量搜索，Shift+回车换行..."></order-input>
                <el-input v-else v-model="searchParams.snText"
                          v-sf.snText
                          :placeholder="`请输入${changeLabel}...`"
                          class="inline s-width-large"></el-input>
                <label class="ml-sm" title="请选择供应商 "> 供应商：</label>
                <supplier class="inline s-width-large"
                          v-model="searchParams.supplier_id"
                          :placeHolder="true"
                          v-sf.supplier_id></supplier>
                <el-select v-model="searchParams.shType"
                           class="inline s-width-small ml-sm"
                           v-sf.shType
                           @change="change_select">
                    <el-option :key="item.value"
                               v-for="item in selectList2"
                               :label="item.label"
                               :value="item.value"
                    ></el-option>
                </el-select>
                <!--审核人的搜索-->
                <span v-if="searchParams.shType === 'approve_user_id'">
                   <purchaser class="inline s-width-small"
                              v-sf.approve_user_id
                              v-model="searchParams.approve_user_id">
                   </purchaser>
                </span>
                <!--创建人的搜索-->
                <span v-else="searchParams.shType === 'create_user_id'">
                    <purchaser class="inline" v-sf.create_user_id v-model="searchParams.create_user_id"></purchaser>
                </span>
                <label class="inline ml-sm" title="请选择采购员">采购员：</label>
                <purchaser class="inline s-width-small" v-sf.purchase_user_id
                           v-model="searchParams.purchase_user_id"></purchaser>
                <div class="br-show" style="display: none;height: 3px;"></div>
                <label class="ml-sm" title="请选择采购仓库"> 采购仓库：</label>
                <el-select v-model="searchParams.warehouse_id"
                           v-sf.warehouse_id
                           placeholder="请选择"
                           filterable
                           class="inline s-width-small">
                    <el-option :key="item.id"
                               v-for="item in depots"
                               :label="item.name"
                               :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <el-select v-model="searchParams.dateType"
                       v-sf.warehouse_id
                       placeholder="请选择"
                       filterable
                       class="inline s-width-small">
                <el-option :key="item.value"
                           v-for="item in timeTypeList"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
            <el-date-picker type="date"
                            placeholder="开始时间"
                            v-sf.date_b
                            v-model="searchParams.date_b"
                            :picker-options="pickerstart"
                            class="inline date">
            </el-date-picker>&nbsp;--&nbsp;
            <el-date-picker type="date"
                            placeholder="结束时间"
                            v-sf.date_e
                            v-model="searchParams.date_e"
                            :picker-options="pickerend"
                            class="inline date mr-sm">
            </el-date-picker>
        </search-card>
        <el-row class="mt-sm mb-sm">
            <el-button type="primary"
                       class="ml-sm"
                       @click.native="showSelect=true;"
                       size="mini">新建采购计划
            </el-button>
            <request-button class="ml-sm"
                            v-if="status === 0||status===2"
                            req-key="batch_edit_purchase_plan"
                            :mintime="200"
                            :disabled="selects.length===0"
                            @click.native="batch_edit">批量编辑
            </request-button>
            <request-button class="ml-sm"
                            v-if="status === 1"
                            :disabled="selects.length===0"
                            req-key="approval_purchase_plan"
                            :mintime="200"
                            :request="approval">批量审批
            </request-button>
            <permission class="ml-sm"
                        tag="ElButton"
                        type="primary"
                        size="mini"
                        :route="apis.url_post_purchase_plan_cancel"
                        v-if="status === 0"
                        :disabled="selects.length===0"
                        @click="batch_abolish">批量取消
            </permission>
            <permission class="ml-xs"
                        tag="request-button"
                        v-if="status === 3"
                        :disabled="selects.length===0"
                        req-key="api_purchase_plan_batch_delete"
                        :route="apis.url_purchase_plan_batch_delete"
                        :mintime="200"
                        @click="batch_delete">批量删除
            </permission>
            <permission tag="trendsSelect"
                        class="inline ml-xs"
                        type="primary"
                        :route="apis.url_purchase_plan_export"
                        :selects="partAllOptions"
                        @trigger="export_excel"></permission>
            <div class="fr">
                <label class="color-lump issue"></label><span>：错误采购计划</span>
            </div>
        </el-row>
        <el-table class="mb-sm scroll-bar"
                  border :data="lists"
                  highlight-current-row
                  v-resize="{height:41}"
                  :row-class-name="row_class_name"
                  @selection-change="selection_change"
                  v-loading="loading"
                  element-loading-text="玩命加载中...">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection" width="30" align="center">
            </el-table-column>
            <el-table-column label="编号" min-width="60" inline-template>
                <div class="p-table-list-td-text" :title="row.purchase_plan_code">{{row.purchase_plan_code}}</div>
            </el-table-column>
            <el-table-column label="采购仓库" min-width="55" inline-template>
                <div class="p-table-list-td-text" :title="row.warehouse_name">{{row.warehouse_name}}</div>
            </el-table-column>
            <el-table-column label="供应商" min-width="90" inline-template>
                <div v-if="row.supplier_list" class="p-table-list-td-text" :title="row.supplier_list">{{row.supplier_list}}</div>
                <div v-else>
                    <div class="p-table-list-td-text red" title="错误供应商">错误供应商</div>
                </div>
            </el-table-column>
            <el-table-column label="结算方式" min-width="60" inline-template>
                <div class="p-table-list-td-text" :title="row.balance_text">{{row.balance_text}}</div>
            </el-table-column>
            <el-table-column label="产品种类数" min-width="65" inline-template>
                <div class="p-table-list-td-text" :title="row.kind">{{row.kind}}</div>
            </el-table-column>
            <el-table-column label="运费" inline-template>
                <div class="p-table-list-td-text" :title="row.ship_fee?row.ship_fee:'--'|filterAmount">{{row.ship_fee?row.currency_code:''}} {{row.ship_fee?row.ship_fee:'--'|filterAmount}}</div>
            </el-table-column>
            <el-table-column label="总金额" inline-template>
                <div class="p-table-list-td-text" :title="row.amount|filterAmount">{{row.currency_code}} {{row.amount|filterAmount}}</div>
            </el-table-column>
            <el-table-column label="创建人" min-width="50" inline-template>
                <div class="p-table-list-td-text" :title="row.creater">{{row.creater}}</div>
            </el-table-column>
            <el-table-column label="相关采购员" min-width="65" inline-template>
                <div class="p-table-list-td-text" :title="row.purchaser_list">{{row.purchaser_list}}</div>
            </el-table-column>
            <el-table-column label="提交日期" inline-template>
                <div class="p-table-list-td-text" :title="row.commit_date|filterDate">{{row.commit_date|filterDate}}</div>
            </el-table-column>
            <el-table-column :render-header="filterHeader('一级/二级|审核人')" min-width="50" inline-template>
                <div>
                    <div class="p-table-list-td-text" :title="row.approver_name?row.approver_name:'--'">{{row.approver_name?row.approver_name:'--'}}</div>
                    <div class="p-table-list-td-text" :title="row.second_approver_name?row.second_approver_name:'--'">{{row.second_approver_name?row.second_approver_name:'--'}}</div>
                </div>
            </el-table-column>
            <el-table-column :render-header="filterHeader('一级/二级|审核时间')" min-width="50" inline-template>
                <div>
                    <div class="p-table-list-td-text" :title="row.approve_time|filterDate">{{row.approve_time|filterDate}}</div>
                    <div class="p-table-list-td-text" :title="row.second_approve_time|filterDate">{{row.second_approve_time|filterDate}}</div>
                </div>
            </el-table-column>
            <el-table-column label="状态" min-width="55" inline-template>
                <div class="p-table-list-td-text" :title="row.status|filterStatus">{{row.status|filterStatus}}</div>
            </el-table-column>
            <el-table-column label="备注" inline-template>
                <div class="p-table-list-td-text" :title="row.description">{{row.description}}</div>
            </el-table-column>
            <el-table-column label="操作" inline-template min-width="100">
                <el-dropdown menu-align="start" split-button
                             v-if="getOperates(row.status).length>0"
                             type="primary" size="mini" style="width: 120px;"
                             @click="operate_click(row)">
                    {{operate_title(row)}}
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                            :key="index"
                            :disabled="row.supplier_list===''"
                            v-for="(operate, index) in getOperates(row.status)"
                            @click.native="operate_switch(row,index)"
                        >{{operate.name}}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <span v-else>-- --</span>
            </el-table-column>
        </el-table>
        <form-look v-model="showLook"
                   :lookData="lookData"
                   :id="id"
                   :edit="edit"
                   @edit-update="edit_update"
                   :dispose="dispose"
                   :cancel-purchase="cancelPurchase"
                   :select-mark="selectMark">
        </form-look>
        <print v-model="showPrint"
               :lookData="lookData"></print>
        <form-edit-new v-model="showEdit"
                       :look-data="lookData"
                       :look-list="lookList"
                       :id="id"
                       :edit="edit"
                       @edit-update="edit_update"
                       :dispose="dispose"
                       :cancel-purchase="cancelPurchase"
                       :select-mark="selectMark">
        </form-edit-new>
        <form-approval v-model="approvalShow"
                       :lookList="lookList"
                       :id="id"
                       @edit-update="edit_update"
                       :select-mark="selectMark">
        </form-approval>
        <form-select v-model="showSelect"
                     @submit="submit">
        </form-select>
        <form-add v-model="showAdd"
                  @add-update="add_update"
                  :plan-data="planData"
                  :select-mark="selectMark">
        </form-add>
        <export-field :param="export_model_type"
                      v-model="exportVisable"
                      :fields="fields" :templates="templates"
                      @getTemplate="get_templates"
                      title="请选择自定义导出字段"
                      :fixparam="fixparam"
                      :creat-excel="creat_excel"></export-field>
        <export-dialog v-model="export_visible"></export-dialog>
        <batch-remark v-model="remarkDialog"
                      :title="remarkTitle"
                      :api="batch_api"
                      :action="batch_action"
                      @submit="submit_remark">
        </batch-remark>
        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[20, 50, 100, 200,500]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count">
        </el-pagination>
    </page>
</template>
<style lang="stylus">
    .plan-index-purchase-plan {
        overflow-y: hidden;
        .el-dropdown .el-button-group {
            display: inline-block;
            position: relative;
            top: -1px;
        }
        > .el-card {
            overflow: visible !important;
        }
        .el-table__body-wrapper {
            overflow-x: hidden;
        }
        .btn {
            margin: 5px 0;
            border: 0;
        }
        th>div.cell{
            line-height 16px;
            padding:5px 0;
        }
        td>div.cell{
            line-height 16px;
            padding:5px 0;
            .el-button--mini {
                padding: 6px 8px;
                font-size: 12px;
                border-radius: 3px;
            }
        }
        .p-table-list-td-text{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

</style>
<script>
    import {make_auth} from '../../../auth';
    import {api_login_info} from '../../../api/user';
    import {
        api_warehouse_type,
        api_get,
        api_plan_look,
        api_plan_edit,
        api_post_purchase_plan_cancel,
        api_get_publish,
        api_import_sku,
        add_look_sku,
        api_purchase_plan_detail,
        url_plan_look,
        url_plan_edit,
        url_post_purchase_plan_cancel,
        url_purchase_plan_detail,
        url_purchase_plan_export,
        api_purchase_plan_export,
        api_purchase_plan_export_fields,
        url_purchase_plan_batch_delete,
        api_purchase_plan_batch_delete
    } from '../../../api/procurement-plan';
    import {api_user_list} from '../../../api/user-management';
    import {publish_edit_depot, publish_edit_supplier} from "../../../api/purchase";
    import {downloadFile} from '../../../lib/http';
    import {api_goods_export_template} from "../../../api/product-library";

    const status_nosubmit = 0;
    const status_wait = 1;
    const status_nopass = 2;
    const status_cancel = 3;
    const status_waitOrder = 4;
    const status_disabled = 5;
    export default {
        permission: {
            url_purchase_plan_export,
            url_post_purchase_plan_cancel,
            url_purchase_plan_batch_delete,
        },
        page: {
            devinfo: {
                frontEnd: '吴楚光;徐梦娇;张兵根;黎宏珍',
                backEnd: '杨伟权;谭斌',
                createTime: '2017-1-14',
                updateTime: '2017-8-22'
            },
            beforeClose() {
                return true;
            }
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                firstLoading:true,
                pickerstart: {
                    disabledDate: (time) => {
                        if (this.searchParams.date_e) {
                            return time.getTime() > this.searchParams.date_e.getTime()
                        } else {
                            return false
                        }
                    }
                },
                pickerend: {
                    disabledDate: (time) => {
                        if (this.searchParams.date_b) {
                            return time.getTime() < this.searchParams.date_b.getTime()
                        } else {
                            return false
                        }
                    }
                },
                edit: false,
                dispose: false,
                loading: true,
                id: 0,
                showLook: false,
                showPrint: false,
                showEdit: false,
                showAdd: false,
                showSelect: false,
                approvalShow: false,
                cancelPurchase: false,
                selectMark: '',
                status: -1,
                count: 0,
                depots: [],
                lookList: [],
                purchaseList: [],
                selectList1: [
                    {label: "编号", value: "purchase_plan_number"},
                    {label: "SKU", value: "SKU"},
                    {label: "SPU", value: "spu"},
                    {label: "备货计划单号", value: "ready_plan_order"},
                ],
                changeLabel: "SKU",
                selectList2: [
                    {label: "创建人", value: "create_user_id"},
                    {label: "审核人", value: "approve_user_id"},
                ],
                timeTypeList:[
                    {label: "提交时间", value: "commit_date"},
                    {label: "审核时间", value: "approve_time"},
                ],
                suppliers: [],
                searchParams: {
                    snType: "SKU",
                    shType: "approve_user_id",
                    snText: "",
                    dateType:'commit_date',
                    date_b: "",
                    date_e: "",
                    warehouse_id: "",
                    supplier_id: "",
                    purchase_user_id: "",
                    create_user_id: "",
                    approve_user_id: "",
                },
                clears: {
                    snType: "SKU",
                    shType: "approve_user_id",
                    snText: "",
                    dateType:'commit_date',
                    date_b: "",
                    date_e: "",
                    warehouse_id: "",
                    supplier_id: "",
                    purchase_user_id: "",
                    create_user_id: "",
                    approve_user_id: "",
                },
                statuses: [//0 未提交，1 已提交，等待审批，2 审核未通过， 返回修改，3取消采购计划，4 已下单
                    {name: '全部', value: -1},
                    {name: '未提交', value: 0},
                    {name: '等待审批', value: 1},
                    {name: '审核未通过', value: 2},
                    {name: '取消采购', value: 3},
                    {name: '已生成采购单', value: 4},
                    {name: '禁用', value: 5},
                ],
                warehouse_type: 0,
                warehouses: [],
                page: 1,
                pageSize: 50,
                lists: [],
                selects: [],
                lookData: {ship_fee: 0},
                operates: [
                    {
                        name: '编辑',
                        api: url_plan_edit,
                        status: [status_nopass, status_nosubmit],
                        event(row) {
                            this.edit = true;
                            this.dispose = true;
                            this.cancelPurchase = false;
                            this.batch_edit(row.id, row)
                        }
                    },
                    {
                        name: '处理',
                        status: [status_wait],
                        api: url_plan_edit,
                        event(row) {
                            this.edit = false;
                            this.dispose = true;
                            this.edit_init(row.id, row)
                        }
                    },
                    {
                        name: '查看',
                        api: url_plan_look,
                        status: [status_cancel, status_nopass, status_nosubmit, status_wait, status_waitOrder,status_disabled],
                        event(row) {
                            this.edit = false;
                            this.dispose = false;
                            this.cancelPurchase = false;
                            this.look_init(row.id, row);
                        }
                    },
                    {
                        name: '打印',
                        api: url_plan_look,
                        status: [status_cancel, status_nopass, status_nosubmit, status_wait, status_waitOrder],
                        event(row) {
                            this.edit = false;
                            this.dispose = false;
                            this.cancelPurchase = false;
                            this.look_print(row.id, row);
                        }
                    },
                    {
                        name: '取消采购',
                        status: [status_nosubmit, status_nopass],
                        api: url_post_purchase_plan_cancel,
                        event(row) {
                            this.cancelPurchase = true;
                            this.edit = false;
                            this.dispose = false;
                            this.look_init(row.id, row);
                        }
                    }
                ],
                planData: [],
                partAllOptions: [
                    {name: "部分导出", value: 2},
                    {name: "全部导出", value: 1}
                ],
                exportVisable: false,
                export_model_type: {
                    type: 5
                },
                fields: [],
                templates: [],
                export_visible: false,
                export_type: '',
                remarkDialog: false,
                remarkTitle: '',
                batch_api: '',
                batch_action: ''
            }
        },
        created(){
            this.init_warehouses();
        },
        mounted() {
            this.depot_init();
            this.get_purchase();
            this.init();
            this.get_fields();
            this.get_templates();
        },
        methods: {
            filterHeader(head){
                return (h)=>{
                    return h('div',[
                        h('div',head.split('|')[0]),
                        h('div',head.split('|')[1])
                    ])
                }
            },
            fixparam(list) {
                return list.map(row => {
                    return {
                        field_name: row.show_field,
                        field_key: row.field
                    }
                });
            },
            order_export(params) {
                return this.$http(api_purchase_plan_export, params).then(res => {
                    if (res.join_queue === 1) {
                        this.export_visible = true;
                        this.$message({type: "success", message: res.message || res});
                    } else {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let params = {
                            file_code: res.file_code,
                            page: this.page,
                            pageSize: this.pageSize,
                        };
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                        this.$message({type: "success", message: '导出成功' || res});
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
                return Promise.resolve();
            },
            get_fields() {
                this.$http(api_purchase_plan_export_fields).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            get_templates() {
                this.$http(api_goods_export_template, {type: 5}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    })
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            export_excel(val) {
                if (val.value === 2 && this.selects.length <= 0) return this.$message({
                    type: "warning",
                    message: "请先选择需要导出的数据"
                });
                this.export_type = val.value;
                this.exportVisable = true;
            },
            creat_excel(param) {
                let data = '';
                switch (this.export_type) {
                    case 2://部分
                        data = {
                            ids: JSON.stringify(this.selects.map(row => {
                                if (typeof row === 'object') {
                                    return row.id
                                } else {
                                    return row
                                }
                            })),
                            export_type: this.export_type,
                            fields: param
                        };
                        Object.assign(data,this.init_params());
                        return this.order_export(data);
                        break;
                    case 1://全部
                        data = this.init_params();
                        this.$set(data, 'export_type', this.export_type);
                        this.$set(data, 'fields', param);
                        return this.order_export(data);
                        break;
                }
            },
            init_params() {
                let params = {
                    page: this.page,
                    pageSize: this.pageSize,
                    shType: this.searchParams.shType,
                    snType: this.searchParams.snType,
                    snText: this.searchParams.snText,
                    supplier_id: this.searchParams.supplier_id,
                    warehouse_id: this.searchParams.warehouse_id,
                    dateType: this.searchParams.dateType,
                    purchase_user_id: this.searchParams.purchase_user_id,
                    create_user_id: this.searchParams.create_user_id,
                    approve_user_id: this.searchParams.approve_user_id,
                };
                if (this.warehouse_type) {
                    params.warehouse_type = this.warehouse_type;
                }
                if (this.status > -1) {
                    params.status = this.status;
                }
                if (this.searchParams.date_b) {
                    params.date_b = datef('YYYY-MM-dd', this.searchParams.date_b / 1000);
                } else {
                    params.date_b = '';
                }
                if (this.searchParams.date_e) {
                    params.date_e = datef('YYYY-MM-dd', this.searchParams.date_e / 1000);
                } else {
                    params.date_e = "";
                }
                if (this.notIsSPU) {
                    if (params.snText) {
                        params.snText = params.snText.replace(new RegExp(' ', 'gm'), '\n').trim().split('\n').map(row => row.trim()).filter(row => row !== '');
                    }
                }
                return params
            },
            init_status_btn() {
                let curBtn = this.warehouses;
                let statusesBtn = this.statuses;
                this.warehouses = [];
                this.statuses = [];
                this.$nextTick(() => {
                    this.warehouses = curBtn;
                    this.statuses = statusesBtn;
                });
            },
            selection_change(val) {
                if (this.status === 1) {
                    this.selects = val.map(row => {
                        return row.id;
                    });
                } else {
                    this.selects = val.map(row => {
                        return {
                            id: row.id,
                            warehouse_name: row.warehouse_name,
                            purchase_plan_type: row.purchase_plan_type,
                            purchase_plan_code: row.purchase_plan_code
                        }
                    });
                }
            },
            batch_edit(data, row) {
                let params = {};
                if (data && row) {
                    this.id = [data];
                    params.id = this.id.join(',');
                } else {
                    this.edit = true;
                    this.dispose = true;
                    let purchase_plan_type = this.selects.find(res => {
                        return res.purchase_plan_type === 'purchase_order_overcharged';
                    });
                    if (!!purchase_plan_type) {
                        this.$reqKey('batch_edit_purchase_plan', false);
                        this.$message({
                            type: 'warning',
                            message: `编号:${purchase_plan_type.purchase_plan_code}是供应商多送的采购计划不能批量编辑!`
                        });
                        return;
                    }
                    let warehouse = this.selects.map(row => {
                        return row.warehouse_name;
                    });
                    warehouse = [...new Set(warehouse)];
                    if (warehouse.length > 1) {
                        this.$reqKey('batch_edit_purchase_plan', false);
                        this.$message({type: 'warning', message: `批量编辑只能编辑同一仓库的采购计划!`});
                        return;
                    }
                    if (this.selects.length > 50) {
                        this.$reqKey('batch_edit_purchase_plan', false);
                        this.$message({type: 'warning', message: `勾选的采购计划不能超过50条，请减少勾选条目!`});
                        return;
                    }
                    this.id = this.selects.map(row => {
                        return row.id;
                    });
                    params.id = this.id.join(',');
                }
                return this.$http(api_purchase_plan_detail, params).then(res => {
                    this.lookList = res;
                    this.showEdit = true;
                    return Promise.resolve()
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('batch_edit_purchase_plan', false);
                    }, 200);
                });
            },
            approval() {
                this.id = this.selects;
                let data = {
                    id: this.selects.join(',')
                };
                return this.$http(api_purchase_plan_detail, data).then(res => {
                    this.lookList = res;
                    this.approvalShow = true;
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('approval_purchase_plan', false);
                    }, 200);
                });
            },
            row_class_name(row) {
                if (!!row.supplier_list) {
                    return '';
                } else {
                    return 'red';
                }
            },
            change_label(val) {
                if (val === "SKU") {
                    this.changeLabel = `SKU`;
                } else if (val === "spu") {
                    this.changeLabel = `SPU`;
                } else {
                    this.changeLabel = `编号`;
                }
            },
            //---新增供应商选择确认
            submit(val) {
                this.showAdd = true;
                this.showSelect = false;
                this.selectMark = val;
                this.planData = [];
            },
            search_list() {
                this.init()
            },
            change_select() {
                this.create_user_id = "";
                this.approve_user_id = "";
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.init()
            },
            handleCurrentChange(val) {
                this.page = val;
                this.init();
            },
            init_warehouses() {
                this.$http(api_warehouse_type).then(res => {
                    this.warehouses = res.map(row => {
                        return {
                            name: row.name,
                            value: row.code
                        };
                    });
                    this.warehouses.unshift({name: "全部", value: ""})
                })
            },
            //获取所有仓库
            depot_init() {
                this.$http(publish_edit_depot).then(res => {
                    this.$set(this, "depots", res);
                    this.depots.unshift({name: "全部", id: ""})
                }).catch(code => {
                    console.log(code)
                })
            },
            fix_params({page, pageSize, keyword}) {
                return {
                    page: page,
                    pageSize: pageSize,
                    content: keyword
                };
            },
            //  采购员
            get_purchase() {
                this.$http(api_get_publish).then(res => {
                    this.purchaseList = res.map(row => {
                        return {
                            label: row.realname,
                            value: row.id,
                        }
                    });
                    this.purchaseList = [{label: "全部", value: ""}, ...this.purchaseList];
                }).catch(code => {
                    console.log(code);
                })
            },
            init() {
                let params = this.init_params();
                this.loading = true;
                this.lists = [];
                this.$http(api_get, params).then(res => {
                    this.count = res.count;
                    this.loading = false;
                    this.firstLoading = false;
                    this.lists = res.data;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                })
            },
            change_depot(index, item) {
                this.warehouse_type = item.value;
            },
            change_status(index, item) {
                this.status = item.value;
            },
            update() {
                this.init();
                this.showSelect = false;
            },
            add_update(data, isApproval) {
                data.forEach((row, index, data) => {
                    if (index < 1 || data[index - 1] !== data[index]) {
                        let param = {
                            purchase_plan_id: parseInt(row),
                            page: 1,
                            pageSize: 200
                        };
                        let goodsList = [];
                        let total = '';
                        let balance_type_text = '';
                        let supplier = [];
                        let purchaser = [];
                        if ((this.status === -1 || this.status === 0) || (isApproval && this.status === 1)) {
                            this.$http(add_look_sku, param).then(res => {
                                goodsList = res.data;
                                total = res.count;
                                res.data.forEach(item => {
                                    if (supplier.indexOf(item.supplier) === -1) {
                                        supplier.push(item.supplier);
                                    }
                                    if (purchaser.indexOf(item.purchaser) === -1) {
                                        purchaser.push(item.purchaser);
                                    }
                                    balance_type_text = item.balance_type_text;
                                });
                                this.$http(api_plan_look, row).then(res => {
                                    this.$set(res, 'warehouse_name', res.warehouse);
                                    this.$set(res, 'kind', total);
                                    this.$set(res, 'balance_text', balance_type_text);
                                    typeof res.amount === 'number' && res.amount.toString();
                                    this.$set(res, 'amount', Number(res.amount).toFixed(3));
                                    this.$set(res, 'supplier_list', supplier.join(','));
                                    this.$set(res, 'purchaser_list', purchaser.join(','));
                                    this.lists.unshift(res);
                                    this.count += 1;
                                }).catch(code => {
                                    this.$message({message: code.message || code, type: 'error'});
                                })
                            }).catch(code => {
                                this.$message({message: code.message || code, type: 'error'})
                            });
                        }
                    }
                });
            },
            edit_update(data, ids, status) {
                let param = {
                    purchase_plan_id: data,
                    page: 1,
                    pageSize: 200
                };
                let goodsList = [];
                let total = '';
                let supplier = [];
                let purchaser = [];
                if (this.status === -1 || this.status === status) {
                    if (status.status !== 3 || status.status !== 4){
                        this.$http(add_look_sku, param).then(res => {
                            goodsList = res.data;
                            total = res.count;
                            res.data.forEach(item => {
                                if (supplier.indexOf(item.supplier) === -1) {
                                    supplier.push(item.supplier);
                                }
                                if (purchaser.indexOf(item.purchaser) === -1) {
                                    purchaser.push(item.purchaser);
                                }
                            });
                            this.$http(api_plan_look, data).then(res => {
                                let find = this.lists.find(row =>row.id===data);
                                if(find){
                                    Object.assign(find,res);
                                }
                            }).catch(code => {
                                this.$message({message: code.message || code, type: 'error'});
                            })
                        }).catch(code => {
                            this.$message({message: code.message || code, type: 'error'})
                        });
                        if (!!ids&&ids.length > 0) {
                            this.add_update(ids, status);
                        }
                    }
                } else {
                    if (!!data&&data.length > 0) {
                        data.forEach(id => {
                            let index = this.lists.findIndex(row => {
                                return row.id === id;
                            });
                            this.lists.splice(index, 1);
                            this.count -= 1;
                        })
                    } else {
                        let index = this.lists.findIndex(row => {
                            return row.id === data;
                        });
                        this.lists.splice(index, 1);
                        this.count -= 1;
                    }
                }
            },
            look_init(data, row) {
                this.selectMark = row.purchase_plan_type === 'ready_purchasing'?'stocking':row.purchase_plan_type;
                this.loading = true;
                this.lookData = {ship_fee: 0};
                this.$http(api_plan_look, data).then(res => {
                    this.lookData = res;
                    this.loading = false;
                    this.showLook = true;
                    //判断是正常采购还是供应商多送

                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                })
            },
            look_print(data, row) {
                this.selectMark = row.purchase_plan_type === 'ready_purchasing'?'stocking':row.purchase_plan_type;
                this.loading = true;
                this.lookData = {ship_fee: 0};
                this.$http(api_plan_look, data).then(res => {
                    this.lookData = res;
                    this.loading = false;
                    this.showPrint = true;
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                })
            },
            edit_init(data, row) {
                this.loading = true;
                this.lookData = {ship_fee: 0};
                this.$http(api_plan_edit, data).then(res => {
                    this.lookData = res;
                    this.loading = false;
                    this.showLook = true;
                    //判断是正常采购还是供应商多送
                    this.selectMark = row.purchase_plan_type === 'ready_purchasing'?'stocking':row.purchase_plan_type;
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                })
            },
            operate_title(row) {
                if (row.behavior === undefined) {
                    this.$set(row, 'behavior', 0);
                }
                return this.getOperates(row.status)[row.behavior].name;
            },
            operate_click(row) {
                this.id = row.id;
                this.getOperates(row.status)[row.behavior].event.call(this, row);
            },
            operate_switch(row, index) {
                row.behavior = index;
                this.operate_click(row)
            },
            //--------------
            operate_title_dispose(row) {
                if (row.behavior === undefined) {
                    this.$set(row, 'behavior', 0);
                }
                return this.getOperates(row.status)[row.behavior].name;
            },
            operate_click_dispose(row) {
                this.id = row.id;
                this.operates[row.behavior].event.call(this, row);
            },
            operate_switch_dispose(row, index) {
                row.behavior = index;
                this.operate_click_dispose(row);

            },
            getOperates(status) {
                return this.permissionOperates.filter(row => {
                    return row.status.includes(status)
                });
            },
            batch_delete() {
                this.$confirm(`您将删除已勾选的采购单，确定进行此操作?`,'提示',{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:"warning"
                }).then(()=> {
                    let data = {
                        ids: JSON.stringify(this.selects.map(row => row.id))
                    };
                    this.$http(api_purchase_plan_batch_delete, data).then(res => {
                        this.selects.forEach(row => {
                            let findIndex = this.lists.findIndex(item => item.id === row.id);
                            findIndex !== -1 && this.lists.splice(findIndex, 1);
                        });
                        this.count -= this.selects.length;
                        this.$message({type: 'success', message: res.message || res});
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('api_purchase_plan_batch_delete', false);
                        }, 200);
                    });
                }).catch(()=>{
                    this.$message({
                        type:"info",
                        message:"已取消"
                    })
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('api_purchase_plan_batch_delete', false);
                    }, 200);
                });
            },
            batch_abolish() {
                if (this.selects.length === 0) {
                    return this.$message({type: "warning", message: "请先勾选需要批量取消的采购单！"});
                }
                this.remarkTitle = '您将批量取消已勾选的采购单';
                this.batch_action = 'reason';
                this.remarkDialog = true;
            },
            submit_remark(mark) {
                if (!mark) {
                    this.$message({type: 'error', message: `请填写取消采购的原因`});
                    return;
                }
                let params = JSON.stringify(this.selects.map(row => {
                    return {
                        id: row.id,
                        remark: mark,
                        status: 3
                    }
                }));
                return this.$http(api_post_purchase_plan_cancel, {plans: params}).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.remarkDialog = false;
                    this.selects.forEach(row => {
                        let find = this.lists.find(item => item.id === row.id);
                        if (!!find) {
                            find.status = 3;
                        }
                    });
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
        },
        computed: {
            permissionOperates() {
                return this.operates.filter(row => {
                    return this.$hasPermission(row.api)
                })
            },
            notIsSPU() {
                return this.searchParams.snType.toUpperCase() !== 'SPU'
            },
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            }
        },
        watch: {
            warehouse_type() {
                this.init();
            },
            status() {
                this.init();
            },
        },
        filters: {
            filterAmount(val){
                return !!val&&!isNaN(Number(val))?Number(val).toFixed(3):val;
            },
            filterStatus(val) {
                switch (val) {
                    case 0:
                        return '未提交';
                        break
                    case 1:
                        return '等待审批';
                        break
                    case 2:
                        return '审批未通过';
                        break
                    case 3:
                        return '取消采购';
                        break
                    case 4:
                        return '已生成采购单';
                        break
                    case 5:
                        return '禁用';
                        break
                    default:
                        return '未定义';
                }
            },
            filterDate(val){
                return typeof val==="number"?datef('YYYY-MM-dd HH:mm:ss',val):(val||'-- --');
            },
        },
        components: {
            labelButtons: require('../../../components/label-buttons.vue').default,
            formLook: require('./form-look.vue').default,
            print: require('./print.vue').default,
            formEditNew: require('./form-edit-new.vue').default,
            formApproval: require('./form-approval.vue').default,
            formAdd: require('./form-add.vue').default,
            formSelect: require('./form-select.vue').default,
            supplier: require('../../../api-components/supplier.vue').default,
            purchaser: require('../../../api-components/purchaser.vue').default,
            uiTip: require('../../../components/ui-tip.vue').default,
            searchCard: require('../../../components/search-card.vue').default,
            orderInput: require('../../../components/order-input').default,
            trendsSelect: require('../../../components/trends-select').default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('../../report/export-dialog').default,
            batchRemark: require('../../../view/order/local/batch-remark').default,
        }
    }

</script>
