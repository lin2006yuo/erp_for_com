<template>
    <page class="p-assert-sup">
        <!--<el-row>-->
        <search-list :form="searchData"
                     :categorys-lists="categorysLists"
                     :balance-list="balanceList"
                     :purchase-staffs-list="purchase_staffs_list_search"
                     :purchase-development-list="purchase_development_list_search"
                     :chain-specialist-search="chainSpecialistSearch"
                     :area-lists="areaLists"
                     @select-status="select_status"
                     @search="init"
                     :payment-list="paymentList"
                     :transaction-list="transactionList"
                     :level-list="levelList"
        ></search-list>
        <permission tag="ElButton"
                    :route="apis.url_add_supplier"
                    class="inline mt-sm ml-sm mb-sm"
                    type="primary" size="mini"
                    @click.native="add" title="新增供应商">添加</permission>
        <permission tag="trendsSelect"
                    class="inline ml-xs mr-mini"
                    type="primary"
                    :route="apis.url_export_supplier"
                    :selects="partAllOptions"
                    @trigger="export_sku"></permission>
        <trends-select class="inline ml-sm mr-sm btn-margin-top"
                       v-if="curStatus===0"
                       :selects="handleList"
                       type="primary"
                       @trigger="select_handle"></trends-select>
        <permission tag="trendsSelect"
                    class="inline ml-xs mr-xs"
                    type="primary"
                    v-if="curStatus===''||curStatus===1"
                    :route="apis.url_supplier_export_fuiou"
                    :selects="exportFuiou"
                    @trigger="export_handle"></permission>
        <permission tag="ElButton"
                    :route="apis.url_supplier_change_purchaser"
                    class="inline mt-sm ml-mini mb-sm"
                    type="primary" size="mini"
                    v-if="curStatus===''||curStatus===1"
                    @click.native="modify_purchaser">修改采购员</permission>
        <permission tag="ElButton"
                    :route="apis.url_supplier_disable"
                    class="inline mt-sm ml-mini mb-sm"
                    :disabled="!selectId.length>0"
                    type="primary" size="mini"
                    v-if="curStatus===1"
                    @click.native="block_up">停用</permission>
        <permission tag="ElButton"
                    :route="apis.url_supplier_change_balance_type"
                    class="inline mt-sm ml-mini mb-sm"
                    type="primary" size="mini"
                    :disabled="!selectId.length>0"
                    v-if="curStatus===1"
                    @click.native="modify_balance">批量修改结算方式</permission>
        <permission tag="ElButton"
                    :route="apis.url_supplier_change_specialist"
                    class="inline mt-sm ml-mini mb-sm"
                    type="primary" size="mini"
                    :disabled="selectId.length === 0"
                    v-if="curStatus===1"
                    @click.native="optimize_specialist">修改优化专员</permission>
        <permission tag="ElButton"
                    :route="apis.url_change_ali_account"
                    class="inline mt-sm ml-mini mb-sm"
                    type="primary" size="mini"
                    :disabled="selectId.length === 0"
                    v-if="curStatus===1"
                    @click.native="modification_ali">修改阿里账号</permission>
        <table-list :form="table.dataList"
                    :search-data="searchData"
                    :is-loading="isLoading"
                    :first-loading="firstLoading"
                    :province-list="provinceList"
                    :city-list="cityList"
                    :area="area"
                    @selection_change="selection_change"
                    @search="init"
                    @handles="handles"
        ></table-list>
        <edit-lookover
            v-model="dialog"
            :isLook="isLook"
            :remove-file="removeFile"
            :remove-information="removeInformation"
            :remove-business-image="removeBusinessImage"
            :remove-supplier-plan="removeSupplierPlan"
            :look-edit-form="lookEditForm"
            @change-dialog="addDiscussRecordDialog"
            @add-edit="add_edit"
            :title="editLookTitle"
            :chain-specia-list="chainSpecialist"
            :status="operationStatus"
            @select-province="select_province_"
            @select-city="select_city_"
            @audit-update="search"
            :list="categorysList"
        ></edit-lookover>
        <cheked-suppliers
            v-model="checkedDialog"
            :isLook="isLook"
            :chain-specia-list="chainSpecialist"
            :remove-file="removeFile"
            :remove-information="removeInformation"
            :look-edit-form="lookEditForm"
            @change-dialog="addDiscussRecordDialog"
            @add-edit="add_edit"
            :title="editLookTitle"
            :status="operationStatus"
            @select-province="select_province_"
            @select-city="select_city_"
        ></cheked-suppliers>
        <export-dialog v-model="export_visible"></export-dialog>
        <export-field  v-model="exportVisible"
                       :creat-excel="creat_excel"
                       :fields="fields"
                       title="请选择自定义导出字段"
                       :fixparam="fixparam"
                       :templates="templates"
                       @getTemplate="get_templates"
                       :param="export_model_type"
        ></export-field>
        <el-pagination
            class="page-fixed"
            @size-change="size_change"
            @current-change="current_change"
            :current-page="table.page"
            :page-sizes="[20,50,100,200,500]"
            :page-size="table.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="table.totalSize">
        </el-pagination>
        <modify-dialog v-model="modifyDialog" :form="modifyForm" @submit="modify_submit"></modify-dialog>
        <modify-balance-dialog v-model="modifyBalanceDialog" :form="modifyBalanceForm" @submit="modify_balance_submit" :balance-list="modifyBalanceList"></modify-balance-dialog>
        <purchase-record v-model="showRecord" :recordData="recordData"></purchase-record>
        <operation-log v-model="logDialog"  :operation-log="operation_log_data" :title="logDialogTitle"></operation-log>
        <discuss-record v-model="discussRecordDialog"  :record-data="discuss_record"   @change-dialog="addDiscussRecordDialog"></discuss-record>
        <approval-dailog v-model="isShowDialog" @updata-search="updata_search" @updata-data="updata_data" :title="dailogTitle" :playcehoder="placeHolder" :execute="execute" :approval-id="approvalId"></approval-dailog>
        <!--修改优化专员-->
        <optimize-dialog v-model="optimizeShow" :add-data="supplyChainSpecialist" :optimize-list="chainSpecialist" @specialist-submit="specialistSubmit"></optimize-dialog>
        <!--修改阿里账号-->
        <ali-account-dialog v-model="aliAccountDialog" :add-data="aliAccountForm"  @ali-account-submit="aliAccountSubmit"></ali-account-dialog>
    </page>
</template>
<style lang="stylus">
    .p-assert-sup{
        .self-width .el-select__tags{
            height: 30px!important;
            width: 208px
            overflow-y: auto;
            >span{
                white-space: inherit;
            }
        }
        th>div.cell{
            line-height 16px;
            padding:5px 0;
        }
        .el-card {
            overflow: visible;
        }
        .btn-margin-top {
            margin-top: 1px;
            margin-left: 5px;
            margin-right: 6px;
        }
        .s-width-snType{
            width :120px
        }
        .p-table-list-td-text{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
</style>
<script>
    import {downloadFile} from '@/lib/http';
    import {
        api_supplier,
        api_supplier_fields,
        api_supplier_export_fuiou,
        api_add_supplier,
        api_delete_supplier,
        api_look_supplier,
        api_get_balance,
        api_supplier_Level,
        api_supplier_transaction,
        api_edit_supplier,
        api_supplier_payment,
        api_update_supplier,
        api_supplier_area,
        api_supplier_change_purchaser,
        api_get_buyer,
        api_development,
        api_change_states,
        api_get_supplier_id_log,
        api_get_categories,
        api_goods_export_template,
        api_get_supplier_get_supplier_purchase,
        api_get_supply_chain_department_id,
        api_export_supplier,
        api_supplier_change_balance_type,
        api_supplier_is_disable,
        api_supplier_change_specialist,
        api_change_ali_account,
        url_change_ali_account,
        url_supplier_change_specialist,
        url_supplier_disable,
        url_supplier_discuss_record,
        url_get_supplier_id_log,
        url_get_supplier_get_supplier_purchase,
        url_supplier_change_purchaser,
        url_add_supplier,
        url_look_supplier,
        url_edit_supplier,
        url_delete_supplier,
        url_export_supplier,
        url_supplier_export_fuiou,
        url_auto_payment_request,
        url_supplier_change_balance_type,
    } from '../../../../api/assert-sup';
    import {api_get_purchaser_staffs,api_get_development_staffs} from "../../../../api/purchase"
    export default {
        permission: {
            url_supplier_discuss_record,
            url_add_supplier,
            url_look_supplier,
            url_edit_supplier,
            url_delete_supplier,
            url_export_supplier,
            url_supplier_export_fuiou,
            url_supplier_change_purchaser,
            url_get_supplier_get_supplier_purchase,
            url_get_supplier_id_log,
            url_auto_payment_request,
            url_supplier_change_balance_type,
            url_supplier_disable,
            url_change_ali_account,
            url_supplier_change_specialist
        },
        page: {
            devinfo: {
                frontEnd: '王月如;黎宏珍',
                backEnd: '谭斌',
                createTime: '2017-1-9',
                updateTime: '2017-9-26'
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
                visible:false,
                firstLoading: true,
                isLoading: true,
                dialog: false,
                curStatus: '',
                execute:'',
                placeHolder:'',
                export_type:'',
                dailogTitle:'',
                operationStatus:'',
                chainSpecialist:[],
                chainSpecialistSearch:[],
                purchase_development_list: [],
                purchase_development_list_search: [],
                purchase_staffs_list: [],
                purchase_staffs_list_search:[],
                modifyBalanceList:[],
                selectId: [],
                selectList:[],
                selectData:[],
                templates:[],
                fields:[],
                // 结算列表
                balanceList: [],
                // 等级列表
                levelList:[],
                // 交易列表
                transactionList:[],
                // 支付列表
                paymentList:[],
                // 城市列表
                areaRes:{},
                areaList:[],
                // 分类列表
                categorysRes:{},
                categorysList:[],
                provinceList:[],
                cityList: [],
                area:[],
                // 采购员
                buyerList:[],
                //开发员
                developer:[],
                // 操作日志
                operation_log_data:[],
                // 洽谈列表
                discuss_record:{},
                // 搜索参数
                searchData:{
                    page:1,//页数
                    pageSize:20,//页数大小
                    status:'',//状态
                    balance_type:[],//结算方式
                    snType:'company_name',//供应商名称
                    snText:'',//供应商名称对应文本
                    level:'',//等级
                    categorys:[],//分类
                    categorys_type:[],
                    place_type:[],//所在省province/市city/区area
                    place_id:'',//所在省/市/区的ID
                    transaction_type:'', //交易类型
                    num_cooperation_b:'',//最小合作次数
                    num_cooperation_e:'',//最大合作次数
                    max_trade_time:'',//最后合作时间
                    pay_type:'',//支付方式
                    staff_type:'purchaser',//采购员purchaser、开发员developer
                    staff:[],//采购员、开发员的ID
                    search_time_type:'create_time',//时间刷选：创建时间create_time，更新时间update_time，最后交易时间last_trading_time
                    date_b:'',//开始时间例：2018-12-22
                    date_e:'',//结束时间例：2018-12-22'
                    sort_field:'',//排序
                    sort_order:'',
                },
                table: {
                    page: 1,
                    pageSize: 20,
                    totalSize: 0,
                    dataList: []
                },
                lookEditForm: {},
                isLook: true,
                isShowDialog:false,
                optimizeShow: false,
                logDialog:false,
                checkedDialog:false,
                approvalId:'',
                discussRecordDialog:false,
                editLookTitle: "",
                logDialogTitle:"",
                export_model_type:{
                    type:12
                },
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.date_e) {
                            return time.getTime() > this.date_e;
                        } else {
                            return time.getTime()>Date.now();
                        }
                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.date_b) {
                            return time.getTime() < this.date_b ||time.getTime()>Date.now();
                        }
                    }
                },
                partAllOptions: [
                    {
                        name: "部分导出", value: 2
                    },
                    {
                        name: "全部导出", value: 1
                    }
                ],
                exportFuiou:[
                    {
                        name: "部分导出至富友",
                        value: 2,
                        action: function () {
                            if (this.selectId.length <= 0) return this.$message({
                                type: "warning",
                                message: "请先选择需要导出的数据"
                            });
                            let params = {
                                supplier_ids: this.selectId,
                                export_type: 2,
                            };
                            Object.assign(params, this.init_params);
                            this.fuiou_export(params);
                        }
                    },
                    {
                        name: "全部导出至富友",
                        value: 1,
                        action: function () {
                            let params = {
                                export_type: 1,
                                ...this.init_params
                            };
                            this.fuiou_export(params);
                        }
                    },
                ],
                export_visible: false,
                exportVisible:false,
                removeFile:[],
                removeInformation:[],
                removeSupplierPlan:[],
                removeBusinessImage:[],
                modifyBalanceDialog:false,
                aliAccountDialog:false,
                modifyDialog:false,
                aliAccountForm:{
                    supplier_ids:'',
                    ali_account:''
                },
                modifyBalanceForm:{
                    supplier_ids:'',
                    balance_type:"",
                },
                supplyChainSpecialist: {
                    supply_chain_specialist_id: '',
                    supplier_ids: '',
                },
                modifyForm:{
                    old_purchaser_id:'',
                    purchaser_id:'',
                    is_sync:false,
                    type:0
                },
                recordData:{},
                showRecord:false,
            }
        },
        created(){
            this.get_supply_chain_specialist_id();
        },
        mounted(){
            this.get_area();
            this.get_balance();
            this.get_payment();
            this.get_level();
            this.get_transaction();
            this.get_buyer();
            this.get_developer();
            this.get_categorys();
            this.get_fields();
            this.get_purchase_staffs();
            this.get_development_staffs();
        },
        watch: {
            curStatus(val) {
                switch (val) {
                    case 0:
                        this.handleList = [
                            {label: "批量审核通过", value: 1},
                            {label: "批量审核不通过", value: 3},
                        ];
                        break;
                    case 1:
                        break;
                    case 2:
                        this.handleList = [
                            {label: "停用", value: 2},
                        ];
                        break;
                }
            }
        },
        computed: {
            categorysLists(){    //为搜索列表分类增加一个空值选项
                let data=this.categorysList;
                data.unshift({label:'空',value:0});
                return  data
            },
            areaLists(){    //为搜索列表城市增加一个空值选项
                let data=this.areaList;
                data.unshift({label:'空',value:0});
                return  data
            }
        },
        methods: {
            get_purchase_staffs() {//获取采购员
                this.$http(api_get_purchaser_staffs).then(res => {
                    this.purchase_staffs_list = res.map(item => {
                        return {
                            label: item.realname,
                            value: item.id
                        }
                    });
                    this.purchase_staffs_list_search = [{label:'空', value:0},...this.purchase_staffs_list]
                }).catch(code => {
                    console.log(code);
                })
            },
            get_development_staffs() {//获取开发员
                this.$http(api_get_development_staffs).then(res => {
                    this.purchase_development_list = res.map(item => {
                        return {
                            label: item.realname,
                            value: item.id
                        }
                    });
                    this.purchase_development_list_search = [{label:'空', value:0},...this.purchase_development_list]
                }).catch(code => {
                    console.log(code);
                })
            },
            /*请求更新*/
            updata_search(val){
                this.dialog=!val;
                this.search()
            },
            /*不请求更新*/
            updata_data(val){
                val.forEach((item)=>{
                    let index=this.table.dataList.findIndex(row=>row.id===item.id);
                    this.table.dataList.splice(index,1);
                })
            },
            key_down() {
                this.search()
            },
            show_purchase_record(row, val) {
                this.$http(api_get_supplier_get_supplier_purchase, {supplier_id: row.id}).then(res => {
                    if (val === 3) {
                        this.recordData = res;
                        this.recordData.supplier_id = row.id;
                        this.showRecord = true;
                    } else {
                        this.discuss_record = res;
                        this.discuss_record.update_data = '';
                        this.discuss_record.supplier_id = row.id;
                        this.discussRecordDialog = true;
                    }

                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            fuiou_export(params) {
                return this.$http(api_supplier_export_fuiou, params).then(res => {
                    if (res.join_queue === 1) {
                        this.export_visible = true;
                    } else {
                        let params = {
                            page: this.table.page,
                            pageSize: this.table.pageSize,
                            file_code: res.file_code

                        };
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls',
                        })
                    }
                    this.$message({type: "success", message: res.message || res});
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
                return Promise.resolve();
            },
            get_fields() {
                this.$http(api_supplier_fields).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            get_templates() {
                this.$http(api_goods_export_template, {type: 2}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    });
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            fixparam(list) {
                return list.map(row => {
                    return {
                        field_name: row.show_field,
                        field_key: row.field
                    }
                });
            },
            creat_excel(param) {
                let data = '';
                switch (this.export_type) {
                    case 2://部分
                        data = {
                            supplier_ids: JSON.stringify(this.selectId.map(row => {
                                if (typeof row === 'object') {
                                    return row.id
                                } else {
                                    return row
                                }
                            })),
                            export_type: this.export_type,
                            fields: param
                        };
                        // Object.assign(data, this.init_params());
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
            order_export(params) {
                return this.$http(api_export_supplier, params).then(res => {
                    if (res.join_queue === 1) {
                        this.export_visible = true;
                        this.$message({type: "success", message: res.message || res});
                    } else {
                        let data = {
                            page: this.table.page,
                            pageSize: this.table.pageSize,
                            file_code: res.file_code,
                            supplier_ids:params
                        };
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        downloadFile({
                            url: url,
                            get: data,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                    }
                    this.$message({type: "success", message: res.message || res});
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
                return Promise.resolve();
            },
            export_handle(val) {
                val.action.call(this, val);
            },
            export_sku(val) {
                if (val.value === 2 && this.selectId.length <= 0) return this.$message({
                    type: "warning",
                    message: "请先选择需要导出的数据"
                });
                this.export_type = val.value;
                this.exportVisible = true
            },
            modify_purchaser() {
                this.modifyForm.type = this.selectId.length === 0 ? 2 : 1;
                this.modifyForm.old_purchaser_id = '';
                this.modifyForm.purchaser_id = '';
                this.modifyForm.is_sync = false;
                this.modifyDialog = true;
            },
            modify_submit() {
                let data = window.clone(this.modifyForm);
                if (data.type === 1) {
                    data.supplier_ids = this.selectId;
                    delete data.old_purchaser_id;
                }
                this.$http(api_supplier_change_purchaser, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.modifyDialog = false;
                    this.init();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            modify_balance() {
                this.modifyBalanceForm.supplier_ids=this.selectId;
                this.modifyBalanceDialog = true;
            },
            modification_ali(){
                if(!this.selectData.every(row=>row.balance_type===11||row.balance_type>13)){return this.$message({type: 'warning', message: '不可修改非阿里类型的结算方式的供应商的阿里账号'}) }
                this.aliAccountForm.supplier_ids=this.selectData.map(row=>row.id);
                this.aliAccountForm.ali_account='';
                this.aliAccountDialog=true;
            },
            optimize_specialist() {//修改优化专员
                this.optimizeShow = true;
            },
            specialistSubmit() {//修改优化专员确定
                let ids = this.selectId;
                let data = {
                    supply_chain_specialist_id: this.supplyChainSpecialist.supply_chain_specialist_id,
                    supplier_ids: ids
                };
                this.$http(api_supplier_change_specialist, data).then(res => {
                    this.optimizeShow = false;
                    this.$message({type: 'success', message: res.message || res});
                    this.search();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                    this.optimizeShow = false;
                }).finally(() => {
                    this.$reqKey('optimizeSpecialist', false);
                });
            },
            /*修改阿里账号*/
            aliAccountSubmit(){
                let data=window.clone(this.aliAccountForm);
                this.$http(api_change_ali_account, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.$reqKey('aliAccount_assert_up', false);
                    this.aliAccountDialog=false;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                    this.$reqKey('aliAccount_assert_up', false);
                    this.aliAccountDialog=false;
                })
            },
            modify_balance_submit(val){
                this.$http(api_supplier_change_balance_type, this.modifyBalanceForm).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message||res
                    });
                    this.table.dataList.forEach(data=>{
                        res.data.forEach(row=>{
                            if(data.id===row.id){
                                this.$set(data,"balance_type",Number(row.balance_type));
                                this.$set(data,"auto_payment_request",row.auto_payment_request);
                                this.$set(data,"balance_type_text",val);
                            }
                        })
                    });
                    setTimeout(()=>{
                        this.$reqKey('update_balance_type', false);
                    },200);
                    this.modifyBalanceDialog = false;
                }).catch(fail=>{
                    this.$message({
                        type:"error",
                        message:fail.message||fail
                    })
                })
            },
            init() {
                let params=this.init_params();
                this.isLoading=true;
                this.firstLoading=true;
                this.$http(api_supplier, params).then(res => {
                    this.table.totalSize = res.count;
                    this.table.dataList = res.data;
                    this.isLoading = false;
                    this.firstLoading = false;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                });
            },
            init_params() {
                let paramsData = {
                    page:this.table.page,
                    pageSize:this.table.pageSize,
                    status:this.searchData.status,
                };
                paramsData.pay_type = this.searchData.pay_type;
                paramsData.transaction_type = this.searchData.transaction_type;
                this.searchData.num_cooperation_b&&(paramsData.num_cooperation_b = this.searchData.num_cooperation_b);
                this.searchData.num_cooperation_e&&(paramsData.num_cooperation_e = this.searchData.num_cooperation_e);
                this.searchData.search_time_type&&(paramsData.search_time_type = this.searchData.search_time_type);
                this.searchData.sort_field&&(paramsData.sort_field = this.searchData.sort_field);
                this.searchData.sort_order&&(paramsData.sort_order = this.searchData.sort_order);
                this.searchData.balance_type.length&& (paramsData.balance_type = this.searchData.balance_type.join(','));
                this.searchData.level.length&& (paramsData.level = this.searchData.level.join(','));
                if (this.searchData.date_b) {
                    let b = new Date(this.searchData.date_b);
                    paramsData.date_b = datef("YYYY-MM-dd", b / 1000);
                }
                if (this.searchData.date_e) {
                    let e = new Date(this.searchData.date_e);
                    paramsData.date_e = datef("YYYY-MM-dd", e / 1000);
                }
                if (this.searchData.staff_type&&this.searchData.staff.length) {
                    paramsData.staff_type = this.searchData.staff_type;
                    paramsData.staff= this.searchData.staff.join(',')
                }
                if (this.searchData.snType && this.searchData.snText) {
                    paramsData.snType = this.searchData.snType;
                    paramsData.snText = this.searchData.snText.trim().split('\n').map(row => row.trim()).filter(row => !!row);
                }
                if (this.searchData.categorys.length===1){
                    if (this.searchData.categorys[0]===0){    //传空值时
                        paramsData.categorys_type = 0;
                        paramsData.categorys = 0;
                    } else{
                        paramsData.categorys_type=1;
                        this.categorysList.forEach(row=>{
                            if (row.value===this.searchData.categorys[0]){
                                paramsData.categorys=row.child_ids.join(",");
                            }
                        });
                    }
                }else{
                    if (this.searchData.categorys.length===2){
                        paramsData.categorys=this.searchData.categorys[this.searchData.categorys.length-1];
                        paramsData.categorys_type=2
                    }
                }
                if (this.searchData.place_type.length>0){
                    switch (this.searchData.place_type.length) {
                        case 1:
                            if (this.searchData.place_type[0]===0){   //传空值时
                                paramsData.place_id=0;
                                paramsData.place_type=0
                            }else {
                                paramsData.place_type='province';
                                paramsData.place_id=this.searchData.place_type[this.searchData.place_type.length-1];
                            }
                            break;
                        case 2:
                            paramsData.place_type='city';
                            paramsData.place_id=this.searchData.place_type[this.searchData.place_type.length-1];
                            break;
                        case 3:
                            paramsData.place_type='area';
                            paramsData.place_id=this.searchData.place_type[this.searchData.place_type.length-1];
                            break;
                        default:
                    }
                }
                return paramsData
            },
//            ---------------------------------   table多选
            selection_change(val) {
                this.selectId = val.map(row => {
                    return row.id;
                });
                this.selectData=val;
                this.selectList = val.map(row => {
                    return row.id;
                });
            },
            /*结算方式*/
            get_balance() {
                this.$http(api_get_balance).then(res => {
                    this.balanceList = [{name: "全部", label: ""},{name:'空',label:0}, ...res];
                    this.modifyBalanceList=[{name: "请选择结算方式", label: ""},...res]
                }).catch(code => {
                    console.log(code);
                })
            },
            /*支付方式*/
            get_payment() {
                this.$http(api_supplier_payment).then(res => {
                    this.paymentList = [{name: "全部", label: ""},{name:'空',label:0}, ...res];
                }).catch(code => {
                    console.log(code);
                })
            },
            /*获取分类*/
            get_categorys() {
                this.$http(api_get_categories).then(res => {
                    this.categorysRes = res;
                    let list = [];
                    Object.keys(res).forEach(key => {
                        if (res[key] && res[key].child_ids && res[key].child_ids.length > 0) {
                            let children = [];
                            res[key].child_ids.forEach(child_key => {
                                children.push(res[child_key]);
                            });
                            this.$set(res[key], 'children', children);
                            list.push(res[key]);
                        }
                    });
                    this.categorysList = list.map(row => {
                        return {
                            label: row.name,
                            value: row.id,
                            pid:row.pid,
                            child_ids:row.child_ids,
                            disabled: row.children.length === 0,
                            children: row.children.map(child => {
                                return {
                                    label: child.name,
                                    pid:row.pid,
                                    value: child.id,
                                    disabled: false
                                }
                            })
                        }
                    });
                }).catch(code => {
                    console.log(code);
                });
            },
            categorys_change() {

            },
            /*供应商等级*/
            get_level() {
                this.$http(api_supplier_Level).then(res => {
                    this.levelList = res;
                }).catch(code => {
                    console.log(code);
                })
            },
            /*供应链专员*/
            get_supply_chain_specialist_id(){
                this.$http(api_get_supply_chain_department_id).then(res => {
                    this.chainSpecialist = res.map(row=>{return {value:row.id,label:row.realname}});
                    this.chainSpecialistSearch = [{label:'空', value:0},...this.chainSpecialist]
                }).catch(code => {
                    console.log(code);
                })
            },
            /*交易类型*/
            get_transaction() {
                this.$http(api_supplier_transaction).then(res => {
                    this.transactionList = [{name: "全部", label: ""},{name:'空',label:0}, ...res];
                }).catch(code => {
                    console.log(code);
                })
            },
            /*城市列表*/
            get_area() {
                this.$http(api_supplier_area).then(res => {
                    this.areaRes = res;
                    let list = [];
                    let keyList = [];
                    for (let i in this.areaRes) {
                        let person = this.areaRes[i];
                        if (person.level === 1) {
                            list.push({value: person.id, label: person.name, pid: person.pid, children: []});
                            this.provinceList.push({value: person.id, label: person.name, pid: person.pid});
                        }
                        for (let j in person._child) {
                            let person1 = person._child[j];
                            list[i - 1].children.push({
                                value: person1.id,
                                label: person1.name,
                                pid: person1.pid,
                                children: []
                            });
                            this.cityList.push({value: person1.id, label: person1.name, pid: person1.pid});
                            for (let k in person1._child) {
                                let person2 = person1._child[k];
                                keyList.push(person2)
                            }
                        }
                    }
                    for (let a of list) {
                        let d = a.children;
                        for (let b of d) {
                            keyList.forEach(row => {
                                if (b.value === row.pid) {
                                    b.children.push({value: row.id, label: row.name, pid: row.pid});
                                    this.area.push({value: row.id, label: row.name, pid: row.pid})
                                }
                            })
                        }
                    }
                    this.areaList = list
                }).catch(code => {
                    console.log(code);
                })
            },
            /*获取采购员*/
            get_buyer() {
                this.$http(api_get_buyer, {}).then(res => {
                    this.buyerList = [{name: "全部", label: ""}, ...res];
                }).catch(code => {
                    console.log(code);
                });
            },
            //获取开发人员
            get_developer() {
                this.$http(api_development, {}).then(res => {
                    let data = [...res];
                    let list = [];
                    data.forEach(row => {
                        list.push({name: row.realname, label: row.id})
                    });
                    this.developer = list
                }).catch(code => {
                    console.log(code);
                });
            },
            select_handle(val) {
                if (val.value === 1) {
                    if (this.selectId.length === 0) {
                        this.$message({type: "warning", message: `请选择审批项后，再进行相应操作`});
                    } else {
                        this.$confirm(`此操作为批量审核通过勾选的数据，确认此操作吗？`, "提示", {
                            cancelButtonText: '取消',
                            confirmButtonText: '确定',
                            type: 'warning'
                        }).then(() => {
                            let params = {
                                id: this.selectId,
                            };
                            params.status = val.value;
                            this.api_change_states(params);
                        }).catch(() => {
                            this.$message({type: "info", message: `已取消操作`})
                        });
                    }
                } else {//审核不通过进行的操作
                    if (this.selectId.length === 0) {
                        this.$message({type: "warning", message: `请选择审批项后，再进行相应操作`});
                    } else {
                        this.dailogTitle = "批量审批不通过";
                        this.isShowDialog = true;
                        this.approvalId = this.selectId; //多个审批
                        this.placeHolder = "请填写批量审批不通过原因";
                        this.execute = 2;
                    }
                }

            },
            /*停用操作*/
            block_up(val){
                if (this.selectId.length <= 0) return this.$message({
                    type: "warning",
                    message: "请先选择需要导出的数据"
                });
                let data={
                    supplier_ids:this.selectId
                };
                this.$http(api_supplier_is_disable, data).then(res => {
                    if(res.is_run){
                        this.approvalId = this.selectId;
                        this.isShowDialog = true;
                        this.dailogTitle = "停用供应商";
                        this.placeHolder = "请填停用原因";
                        this.execute = 1;
                    }else{
                        return this.$message({type: "warning",message: "供应商:"+res.no_disable_supplier.join(",")+'不是卖完下架或停售状态,无法进行停用操作'})
                    }
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                })
            },
            delete_supplier(id) {
                this.$http(api_delete_supplier, id).then(res => {
                    this.$message({
                        type: "success",
                        message: res.message || res
                    });
                    let index = this.table.dataList.indexOfFun(id, function (old, id) {
                        return old.id === id;
                    });
                    this.table.dataList.splice(index, 1);
                    this.$set(this.table, 'totalSize', this.table.totalSize - 1)
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                })
            },
            //           ---------------------------------  查看供应商
            look_supplier(id) {
                this.$http(api_look_supplier, id).then(res => {
                    this.checkedDialog = true;
                    this.$set(res, 'payment_effective_time', res.payment_effective_time * 1000);
                    this.lookEditForm = res;
                    this.$nextTick(() => {
                        this.lookEditForm.city_id = res.city_id;
                        this.lookEditForm.area_id = res.area_id;
                    })
                }).catch(code => {
                    console.log(code);
                });
            },
//           ---------------------------------  编辑Api
            edit_supplier(id) {
                this.$http(api_edit_supplier, id).then(res => {
                    this.dialog = true;
                    res.file.forEach(row => {
                        row.file === undefined && (row.file = {});
                    });
                    if (res.payment_information) {
                        res.payment_information.forEach(row => {
                            if (row.file === undefined) {
                                row.file = {};
                            }
                        });
                    }
                    if (res.supplier_plant) {
                        res.supplier_plant.forEach(row => {
                            if (row.file === undefined) {
                                row.file = {};
                            }
                        });
                    }
                    if (res.business_image) {
                        res.business_image.forEach(row => {
                            if (row.file === undefined) {
                                row.file = {};
                            }
                        });
                    }

                    res.payment_effective_time = res.payment_effective_time ? res.payment_effective_time * 1000 : '';
                    this.lookEditForm = res;
                    if (this.operationStatus===1){
                        this.lookEditForm.operation_type="edit"
                    }
                    let Object = {city_id: res.city_id, area_id: res.area_id};
                    this.$nextTick(() => {
                        this.lookEditForm.city_id = Object.city_id;
                        this.$nextTick(() => {
                            this.lookEditForm.area_id = Object.area_id;
                        })
                    })
                }).catch(code => {
                    console.log(code);
                });
            },
//            ---------------------------------  审核供应商Api
            audit_supplier(id) {
                this.$http(api_look_supplier, id).then(res => {
                    this.dialog = true;
                    this.$set(res, 'payment_effective_time', res.payment_effective_time * 1000);
                    this.lookEditForm = res;
                    this.$nextTick(() => {
                        this.lookEditForm.city_id = res.city_id;
                        this.lookEditForm.area_id = res.area_id;
                    })
                }).catch(code => {
                    console.log(code);
                });
            },
            api_change_states(data) {
                this.$http(api_change_states, data).then(res => {
                    this.$message({
                        type: "success",
                        message: res.message || res
                    });
//                              ------------成功就更新数据
                    this.search();
                }).catch(code => {
                    console.log(code);
                });
            },
            // 操作记录
            api_get_supplier_id_log(data) {
                this.$http(api_get_supplier_id_log, data).then(res => {
                    this.operation_log_data = res;
                    this.logDialog = true;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                })
            },
            // 单个审批
            addDiscussRecordDialog(val) {
                if (val.status === 2) { //单个审批不通过原因
                    this.dailogTitle = "审批不通过";
                    this.isShowDialog = true;
                    this.approvalId = [val.id];
                    this.placeHolder = "请填写审批不通过原因";
                    this.execute = 2;
                }
            },
//            ---------------------------------   分页
            size_change(size) {
                let updateData = window.clone(this.searchData);
                updateData.pageSize=size;
                this.table.pageSize = size;
                updateData.page=this.table.page;
                this.init(updateData);
            },
            current_change(page) {
                let updateData = window.clone(this.searchData);
                this.table.page = page;
                updateData.page=page;
                updateData.pageSize=this.table.pageSize;
                this.init(updateData);
            },
//            ---------------------------------   搜索不同的状态
            select_status(val, item) {
                let updateData = window.clone(this.searchData);
                this.curStatus = item.status;
                this.init(updateData);
            },
//            ---------------------------------   搜索
            search() {
                this.searchData.pageSize=this.table.pageSize;
                this.searchData.page=this.table.page;
                let updateData = window.clone(this.searchData);
                this.init(updateData);
            },
//            ---------------------------------   清空搜索
            clear_search() {
                this.snType = "company_name";
                this.snText = "";
                this.balance_type = '';
                this.init();
            },
//            ---------------------------------   添加
            add() {
                this.removeFile = [];
                this.removeInformation = [];
                this.removeSupplierPlan=[];
                this.removeBusinessImage=[];
                this.lookEditForm = {
                    id: '',
                    company_name: '',
                    code: '',
                    level: '',
                    type: 0,
                    invoice: '',
                    legal: '',
                    business_license: '',
                    file: [],
                    online_shop_name: '',
                    link: '',
                    purchaser_id: '',
                    categorys: [],
                    new_reason: '',
                    transaction_type: '',
                    pay_type: '',
                    public_bank_address:'',
                    public_swift_address:'',
                    public_cnaps:'',
                    private_bank_address:'',
                    private_swift_address:'',
                    private_cnaps:'',
                    default_payment_method:1,
                    auto_payment_request:2,
                    supply_chain_specialist_id:0,
                    delivery_day:'',
                    return_goods:'',
                    return_goods_data:"",
                    label_deck:"",
                    case_packing:"",
                    supply_chain_finance:"",
                    public_accounts: '',
                    public_accounts_name: '',
                    public_accounts_bank: '',
                    public_bank_city: '',
                    no_pass_reason:"",
                    public_bank_retained_contact_way: '',
                    private_accounts: '',
                    private_accounts_name: '',
                    private_accounts_bank: '',
                    opening_bank_city: '',
                    opening_id_card: '',
                    bank_retained_contact_way: '',
                    payment_information: [],
                    business_image:[],
                    supplier_plant:[],
                    balance_type: '',
                    payment_effective_time: '',
                    payment_communicator: '',
                    payment_communicator_name: '',
                    contacts: "",
                    contacts_job: "",
                    mobile: "",
                    qq: '',
                    contacts2: "",
                    contacts2_job: "",
                    mobile2: "",
                    qq2: "",
                    province_id: "",
                    city_id: "",
                    area_id: '',
                    address: '',
                    remark: '',
                    ali_account: '',
                    tax_rate: ''
                };
                this.editLookTitle = '新增供应商';
                this.operationStatus = -1;
                this.isLook = false;
                this.dialog = true;
            },
            select_province_() {
                this.lookEditForm.city_id = "";
                this.lookEditForm.area_id = "";
            },
            select_city_() {
                this.lookEditForm.area_id = "";
            },
            handles(row, handle) {
                switch (handle.value) {
                    case 0:
                        this.operationStatus = 0;
                        this.look_over(row);
                        //查看
                        break;
                    case 1:
                        this.operationStatus = 1;
                        this.edit(row);
                        //编辑
                        break;
                    case 2:
                        this.operationStatus = 2;
                        this.cur_delete(row);
                        //删除
                        break;
                    case 3:
                        this.operationStatus = 3;
                        this.show_purchase_record(row,3);
                        //采购记录
                        break;
                    case 4:
                        this.operationStatus = 4;
                        this.enabled(row);
                        //重启
                        break;
                    case 5:
                        this.operationStatus = 5;
                        this.show_purchase_record(row,5);
                        //洽谈记录
                        break;
                    case 6:
                        this.operationStatus = 6;
                        this.log(row);
                        //操作记录
                        break;
                    case 7:
                        this.operationStatus = 7;
                        this.audit(row);
                        //审核
                        break;
                    case 8:
                        this.operationStatus = 8;
                        //申请变更
                        break;
                    case 9:
                        this.operationStatus = 9;
                        this.revisitingit(row); //重新提交
                        break;
                }
            },
//            ---------------------------------   查看
            look_over(row) {
                this.isLook = true;
                this.editLookTitle = `查看供应商：${row.company_name} 信息`;
                this.look_supplier(row.id);
            },
//            ---------------------------------   编辑
            edit(row) {
                this.isLook = true;
                this.editLookTitle = `编辑供应商：${row.company_name} 信息`;
                this.removeFile = [];
                this.removeInformation = [];
                this.removeSupplierPlan=[];
                this.removeBusinessImage=[];
                this.edit_supplier(row.id)
            },
//            ---------------------------------   重提
            revisitingit(row) {
                this.isLook = false;
                this.editLookTitle = `重新提交供应商`;
                this.removeFile = [];
                this.removeInformation = [];
                this.removeSupplierPlan=[];
                this.removeBusinessImage=[];
                this.edit_supplier(row.id)
            },
//            ---------------------------------   重启
            enabled(row) {
                this.isLook = false;
                this.editLookTitle = `重新启用供应商`;
                this.removeFile = [];
                this.removeInformation = [];
                this.removeSupplierPlan=[];
                this.removeBusinessImage=[];
                this.edit_supplier(row.id)
            },
//            ---------------------------------   审核
            audit(row) {
                this.isLook = true;
                this.removeFile = [];
                this.removeInformation = [];
                this.removeSupplierPlan=[];
                this.removeBusinessImage=[];
                this.editLookTitle = `审核供应商：${row.company_name} 信息`;
                this.audit_supplier(row.id)
            },
//            ---------------------------------   操作日志
            log(row) {
                this.isLook = false;
                this.logDialogTitle = '操作日志';
                this.api_get_supplier_id_log(row.id)
            },
            add_edit(id,categorys, data) {
                let updateData = window.clone(this.lookEditForm);
                delete updateData.payment_communicator_name;
                updateData.update_time = datef('YYYY-MM-dd HH:mm:ss', new Date() / 1000);
                updateData.payment_effective_time = !!updateData.payment_effective_time ? datef('YYYY-MM-dd', updateData.payment_effective_time / 1000) : 0;//谈帐日期如果不存在传0值
                updateData.categorys = categorys;
                updateData.file = updateData.file.map(row => {
                    return {
                        name: row.file.name,
                        size: row.file.size,
                        is_delete: row.path === '' && !!row.id,
                        id: row.id || '',
                        image: row.file.image
                    }
                });
                if (updateData.pay_type !== 2) {
                    delete updateData.public_accounts;
                    delete updateData.public_accounts_name;
                    delete updateData.public_accounts_bank;
                    delete updateData.public_bank_city;
                    delete updateData.public_bank_retained_contact_way;
                    delete updateData.private_accounts;
                    delete updateData.private_accounts_name;
                    delete updateData.private_accounts_bank;
                    delete updateData.opening_bank_city;
                    delete updateData.opening_id_card;
                    delete updateData.bank_retained_contact_way;
                    delete updateData.payment_information;
                }
                if (!!updateData.payment_information) {
                    updateData.payment_information = updateData.payment_information.map(row => {
                        return {
                            name: row.file.name,
                            size: row.file.size,
                            is_delete: row.path === '' && !!row.id,
                            id: row.id || '',
                            image: row.file.image
                        }
                    });
                    let removeInformation = this.removeInformation.filter(row => !!row.id);
                    if (removeInformation.length > 0) {
                        updateData.file.push(...removeInformation.map(row => ({id: row.id, is_delete: true})));
                    }
                }
                if (!!updateData.supplier_plant){
                    // ----------------------------------------------供应商厂房
                    updateData.supplier_plant = updateData.supplier_plant.map(row => {
                        return {
                            name: row.file.name,
                            size: row.file.size,
                            is_delete: row.path === '' && !!row.id,
                            id: row.id || '',
                            image: row.file.image
                        }
                    });
                    let removeSupplierPlan = this.removeSupplierPlan.filter(row => !!row.id);
                    if (removeSupplierPlan.length > 0) {
                        updateData.file.push(...removeSupplierPlan.map(row => ({id: row.id, is_delete: true})));
                    }
                }
                if (!!updateData.business_image){
                    // ----------------------------------------------营业图片
                    updateData.business_image = updateData.business_image.map(row => {
                        return {
                            name: row.file.name,
                            size: row.file.size,
                            is_delete: row.path === '' && !!row.id,
                            id: row.id || '',
                            image: row.file.image
                        }
                    });
                    let removeBusinessImage = this.removeBusinessImage.filter(row => !!row.id);
                    if (removeBusinessImage.length > 0) {
                        updateData.file.push(...removeBusinessImage.map(row => ({id: row.id, is_delete: true})));
                    }
                }
                let removeFile = this.removeFile.filter(row => !!row.id);
                if (removeFile.length > 0) {
                    updateData.file.push(...removeFile.map(row => ({id: row.id, is_delete: true})));
                }
                if (!!id) {
                    if (!!data) {
                        updateData.operation_type=data;
                        this.edit_update(id, updateData);
                    } else {
                        this.edit_update(id, updateData);
                    }
                } else {
                    this.add_update(updateData);
                }
            },
            add_update(data) {
                this.$http(api_add_supplier, data).then(res => {
                    this.$message({
                        type: "success",
                        message: res.message
                    });
                    let param = res.data;
                    this.$set(param, 'mobile', data.mobile);
                    this.$set(param, 'source', '采购');
                    this.$set(param, 'status', 0);
                    this.table.dataList.unshift(param);
                    this.table.totalSize += 1;
                    this.dialog = false;
                    this.search();
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('update_look_edit_form', false);
                    }, 300);
                });
            },
            edit_update(id, data) {
                this.$http(api_update_supplier, id, data).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.dialog = false;
                    let find = this.table.dataList.find(res => res.id === id);
                    if (!!find) {
                        Object.assign(find, data);
                    }
                    //---------------------重新搜索刷新
                    this.search()
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('update_look_edit_form', false);
                    }, 200);
                });
            },
//          ---------------------------------   删除
            cur_delete(row) {
                this.$confirm(`您将删除 ${row.company_name} 供货商，确认此操作吗？`, "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delete_supplier(row.id);
                }).catch(() => {
                    this.$message({type: "info", message: `已取消删除`});
                });
            }
        },
        components: {
            tableList:require('./table-list').default,
            trendsSelect: require('@/components/trends-select').default,
            editLookover:require('./edit-lookover').default,
            exportDialog: require('../../../report/export-dialog').default,
            modifyDialog:require('./modify-dialog').default,
            modifyBalanceDialog:require('./modify-balance-dialog').default,
            orderInput:require("@/components/order-input.vue").default,
            approvalDailog:require('./approval-dailog').default,
            purchaseRecord:require('./purchase-record').default,
            operationLog:require('./operation-log').default,
            aliAccountDialog:require('./ali-account-dialog').default,
            discussRecord:require('./discuss-record').default,
            chekedSuppliers:require('./checked-suppliers').default,
            searchList:require('./search-list.vue').default,
            paramAccount: require('@/api-components/param-account.vue').default,
            exportField: require("@/components/export-field").default,
            optimizeDialog: require('./optimize-dialog').default,
        }
    }
</script>
