<template>
    <page class="plan-index-purchase-plan">
        <search @search="search_list"
                :searchParams="searchParams"
                :clears="clears"
                @change_select="change_select"
                @change_status="change_status"
                @change_depot="change_depot"></search>
        <el-row class="mt-sm mb-sm">
            <el-button type="primary"
                       class="ml-sm"
                       @click.native="showSelect=true"
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
                            v-if="status === 11||status === 12"
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
                        class="inline ml-xs mb-xs"
                        type="primary"
                        :route="apis.url_purchase_plan_export"
                        :selects="partAllOptions"
                        @trigger="export_excel"></permission>
            <request-button class="ml-xs"
                            v-if="status === 0||status===2"
                            req-key="url_purchase_plan_purchaser"
                            :mintime="200"
                            :disabled="selects.length===0"
                            @click.native="amend_buyer">批量修改采购员
            </request-button>
            <request-button class="ml-sm"
                            v-if="status !== 5 && status !==3 && status !==-1"
                            :mintime="200"
                            :disabled="selects.length===0"
                            @click.native="batch_pay">批量修改结算方式
            </request-button>
            <request-button class="ml-sm"
                            v-if="status === 0||status===2"
                            :mintime="200"
                            :disabled="selects.length===0"
                            @click.native="batch_mark">批量备注
            </request-button>
            <div class="fr">
                <span class="bold-font bold-green">深圳发货仓的采购计划需发顺丰次日达</span>
                <label class="color-lump issue-green"></label><span class=" mr-sm">：亚马逊快递单</span>
                <label class="color-lump issue"></label><span>：错误采购计划</span>
            </div>
        </el-row>
        <data-table :table-data="lists"
                    :first-loading="firstLoading"
                    @selection-change="selection_change"
                    @sort-change="sort_change"
                    :is-loading="loading"
                    ref="dataTable"
                    :operations="operations"
                    @operation-click="operationClick"
        ></data-table>
        <amend-buyer v-model="editDialog"
                     :title="'批量修改采购员'"
                     @submit="submit_edit"
                     :purchase-list="purchaseList">
        </amend-buyer>
        <action-log v-model="logDialog" :action-log="actionLog" :planLog="planLog"></action-log>
        <!--批量修改结算方式-->
        <batch-clearing-form v-model="batchPayDialog"
                             @submit="submit_pay"
                             :addData="batchPayType"
                             :batchPayType="batchPayWay">
        </batch-clearing-form>
        <page-dialog title="批量备注"
                     @open="open"
                     v-model="markVisible">
            <el-form :model="ruleForm"
                     :rules="rules"
                     label-width="80px"
                     ref="mark_content"
                     class="mt-lg">
                <el-form-item label="备注内容：" prop="mark">
                    <el-input type="textarea" v-model="ruleForm.mark"
                              :autosize="{ minRows: 5, maxRows: 5}"
                              :maxlength="1000"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click="markVisible = false">取 消</el-button>
                <request-button req-key="batch_mark_content" @click="submit_mark">确 定</request-button>
            </div>
        </page-dialog>
        <form-look v-model="showLook"
                   :look-data="lookData"
                   :edit="edit"
                   :loading="loadingLook"
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
                       :id="selectIds"
                       :edit="edit"
                       @edit-update="edit_update"
                       :dispose="dispose"
                       :cancel-purchase="cancelPurchase"
                       :select-mark="selectMark">
        </form-edit-new>
        <form-approval v-model="approvalShow"
                       :lookList="lookList"
                       :id="selectIds"
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
        .bold-green {
            color: green;
            font-weight: bold;
            font-size: 16px
        }
        .issue-green {
            vertical-align: bottom;
            background: green ;
        }
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
        .green{
            color: green;
        }
        .btn {
            margin: 5px 0;
            border: 0;
        }
    }

</style>
<script>
    import {
        api_warehouse_type,
        api_get,
        api_plan_look,
        api_plan_edit,
        api_post_purchase_plan_cancel,
        api_get_publish,
        add_look_sku,
        api_purchase_plan_detail,
        url_plan_look,
        url_plan_edit,
        url_post_purchase_plan_cancel,
        url_purchase_plan_export,
        api_purchase_plan_export,
        api_purchase_plan_export_fields,
        url_purchase_plan_batch_delete,
        api_purchase_plan_batch_delete,
        api_purchase_plan_purchaser,
        url_purchase_plan_purchaser,
        api_purchase_plan_balance_type,
        url_purchase_plan_balance_type,
        api_purchase_plan_log,
        url_purchase_plan_log,
        api_purchase_plan_batch_remark,
        url_purchase_plan_batch_remark,
    } from '../../../api/procurement-plan';
    import {api_get_balance} from '@/api/assert-sup';
    import {publish_edit_depot} from "../../../api/purchase";
    import {downloadFile} from '../../../lib/http';
    import {api_goods_export_template} from "../../../api/product-library";
    import {api_pack_getSupplier} from '../../../api/pack';


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
            url_purchase_plan_purchaser,
            url_purchase_plan_balance_type,
            url_purchase_plan_batch_remark,
            url_purchase_plan_log
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
                markVisible: false,
                ruleForm: {
                    mark: ''
                },
                planLog: false,
                firstLoading:true,
                editDialog:false,
                batchPayType: {
                    balance_type: '',
                },
                batchPayDialog: false,
                logDialog: false,
                actionLog:[],
                edit: false,
                dispose: false,
                loading: true,
                loadingLook:false,
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
                lookList: [],
                purchaseList: [],
                suppliers: [],
                batchPayWay: [],
                searchParams: {
                    pre_sale: "",
                    snType: "SKU",
                    shType: "approve_user_id",
                    snText: "",
                    dateType:'commit_date',
                    date_b: "",
                    date_e: "",
                    purchase_plan_type:'',
                    warehouse_id: "",
                    supplier_id: "",
                    purchase_user_id: "",
                    create_user_id: "",
                    approve_user_id: "",
                    remark:'',
                    balance_type:'',
                    label_deck:'',
                    return_goods:'',
                },
                clears: {
                    snType: "SKU",
                    shType: "approve_user_id",
                    snText: "",
                    dateType:'commit_date',
                    purchase_plan_type:'',
                    date_b: "",
                    date_e: "",
                    label_deck:'',
                    return_goods:'',
                    warehouse_id: "",
                    supplier_id: "",
                    purchase_user_id: "",
                    create_user_id: "",
                    approve_user_id: "",
                    balance_type:'',
                    remark:''
                },
                warehouse_type: 0,
                page: 1,
                pageSize: 20,
                lists: [],
                selects: [],
                lookData: {ship_fee: 0},
                rules: {
                    mark: [
                        { required: true, message: '请填写备注内容', trigger: 'blur' }
                    ]
                },
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
                    },
                    {
                        name: '操作日志',
                        status: [status_cancel, status_nopass, status_nosubmit, status_wait, status_waitOrder,status_disabled],
                        api: url_purchase_plan_log,
                        event(row) {
                            this.edit = false;
                            this.dispose = false;
                            this.cancelPurchase = false;
                            this.look_log(row.id, row);
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
                batch_action: '',
                selectIds:[],
                sort_field: '',
                sort_type: '',
            }
        },
        created(){
            this.get_balance();
        },
        mounted() {
            this.get_purchase();
            this.init();
            this.get_fields();
            this.get_templates();
        },
        methods: {
            open() {
                this.ruleForm.mark = '';
            },
            submit_mark() {
                this.$refs.mark_content.validate((bool)=>{
                    if(bool){
                        let data = {
                            ids: this.selects.map(row => row.id),
                            remark: this.ruleForm.mark
                        };
                        this.$http(api_purchase_plan_batch_remark, data).then(res => {
                            this.markVisible = false;
                            this.$message({type: 'success', message: res.message || res});
                            this.init();
                        }).catch(code => {
                            this.$message({type: 'warning', message: code.message || code});
                        }).finally(() => {
                            this.$reqKey('batch_mark_content', false);
                        });
                    }else{
                        this.$reqKey('batch_mark_content', false);
                    }
                });
            },
            sort_change(val){//排序
                if(!val.column || !val.column.label) return;
                switch(val.column.label) {
                    case '总金额':
                        this.sort_field = "amount";
                        break;
                    case '产品种类数':
                        this.sort_field = "detail_count";
                        break;
                    default:
                        this.sort_field = '';
                }
                this.sort_type = val.order === "descending" ? 'desc' : 'asc';
                this.init();
            },
            fixparam(list) {
                return list.map(row => {
                    return {
                        field_name: row.show_field,
                        field_key: row.field
                    }
                });
            },
            operations(row){
                return this.permissionOperates.filter(operation => {
                    return operation.status.includes(row.status);
                });
            },
            operationClick(row, action){
                action.event.call(this, row);
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
                    });
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
                    snType: this.searchParams.snType,
                    shType: this.searchParams.shType,
                    snText: this.searchParams.snText,
                    remark: this.searchParams.remark,
                    purchase_plan_type:this.searchParams.purchase_plan_type,
                    supplier_id: this.searchParams.supplier_id,
                    warehouse_id: this.searchParams.warehouse_id,
                    dateType: this.searchParams.dateType,
                    purchase_user_id: this.searchParams.purchase_user_id,
                    create_user_id: this.searchParams.create_user_id,
                    approve_user_id: this.searchParams.approve_user_id,
                    label_deck:this.searchParams.label_deck,
                    return_goods:this.searchParams.return_goods,
                    balance_type:this.searchParams.balance_type,
                    pre_sale: this.searchParams.pre_sale,
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
                this.sort_field &&this.$set(params,'sort_field',this.sort_field );
                this.sort_type&&this.$set(params,'sort_type',this.sort_type);
                params.snText = (this.notIsSPU&&!!params.snText.trim())?
                    params.snText.replace(new RegExp(' ', 'gm'), '\n').trim().split('\n').map(row => row.trim()).filter(row => row !== ''):
                    params.snText.trim();
                return params
            },
            selection_change(val) {
                this.selects = val;
                this.selectIds = val.map(row=>row.id);
            },
            batch_edit(data, row) {
                let params = {};
                if (data && row) {
                    this.selectIds = [data];
                    params.id = data;
                } else {
                    this.edit = true;
                    this.dispose = true;
                    let purchase_plan_type = this.selects.find(findRow =>findRow.purchase_plan_type === 'purchase_order_overcharged');
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
                    params.id = this.selects.map(row =>row.id).join(',');
                }
                return this.$http(api_purchase_plan_detail, params).then(res => {
                    this.lookList = res;
                    this.selectMark = res.find(row=>row.hasOwnProperty('purchase_plan_type'))?res.find(row=>row.hasOwnProperty('purchase_plan_type')).purchase_plan_type:'';
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
                let data = {
                    id: this.selects.map(row=>row.id).join(',')
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
            get_balance() {
                this.$http(api_get_balance).then(res => {
                    this.batchPayWay = res.map(row => {
                        return {
                            label: row.name,
                            value: row.label
                        }
                    });
                }).catch(code => {
                    console.log(code);
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
            //批量修改采购员
            amend_buyer(){
                if(this.selects.length<=0)return this.$message({type:'warning',message:'请选择需要批量修改的数据'});
                this.editDialog=true

            },
            batch_pay(){//批量修改结算方式弹框打开
                this.batchPayDialog = true;
            },
            batch_mark(){//批量备注弹框打开
                this.markVisible = true;
            },
            //更新批量修改采购员的数据
            edit_buyer(ids,buyer){
                this.lists.forEach(row=>{
                    ids.forEach(item=>{
                        if (row.id===item){
                            this.$set(row, 'purchaser_list', buyer);
                        }
                    })
                });
                this.$refs.dataTable.$refs.multipleTable.clearSelection()
            },
            submit_edit(val,buyer){
                let data = {
                    ids:this.selects.map(row => row.id),
                    purchase_id:val[0]
                };
                this.$http(api_purchase_plan_purchaser,data).then(res=>{
                    this.editDialog = false;
                    this.$message({type:'success',message:res.message||res});
                    this.edit_buyer(res.data,buyer)
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_purchase_plan_purchaser',false)
                    },200);
                });
            },
            submit_pay(){//批量修改结算方式确定按钮
                let ids = this.selects.map(row => row.id);
                let data = {
                    balance_type: this.batchPayType.balance_type,
                    ids: ids
                };
                this.$http(api_purchase_plan_balance_type, data).then(res => {
                    this.batchPayDialog = false;
                    this.$message({type: 'success', message: res.message || res});
                    this.init();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                    this.batchPayDialog = false;
                }).finally(() => {
                    this.$reqKey('clearingForm', false);
                });
            },
            init() {
                let params = this.init_params();
                this.loading = true;
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
            look_log(data) {
                this.loading = true;
                this.$http(api_purchase_plan_log, {purchase_plan_id: data}).then(res => {
                    this.actionLog = res.data;
                    this.loading = false;
                    this.planLog = true;
                    this.logDialog = true;
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                })

            },
            look_init(data, row) {
                this.loadingLook = true;
                this.lookData = {ship_fee: 0};
                this.$http(api_plan_look, data).then(res => {
                    this.lookData = res;
                    this.lookData.id = row.id;
                    this.selectMark = res.purchase_plan_type;
                    this.loadingLook = false;
                    this.showLook = true;
                    //判断是正常采购还是供应商多送

                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                })

            },
            look_print(data, row) {
                this.loading = true;
                this.lookData = {ship_fee: 0};
                this.$http(api_plan_look, data).then(res => {
                    this.lookData = res;
                    this.lookData.id = row.id;
                    this.selectMark = row.purchase_plan_type;
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
                    this.lookData.id = row.id;
                    this.loading = false;
                    this.showLook = true;
                    //判断是正常采购还是供应商多送
                    this.selectMark = res.purchase_plan_type;
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                })
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
            amendBuyer:require('./amend-buyer').default,
            batchClearingForm:require('./batch-clearing-form').default,
            actionLog: require('./action-log.vue').default,
            search: require('./search').default,
            dataTable: require('./data-table').default,
        }
    }

</script>
