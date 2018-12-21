
<template>
    <page class="p-index">
        <search
            ref="search"
            :searchData="searchData"
            @select-status="select_status"
            @search="search"
            @clear="clear"
            :audit="audit"
            @audit="auditSelect">
        </search>
        <el-row class="mt-sm ml-sm">
            <el-checkbox v-model="checkedall" @change="check_all">所有页全选
            </el-checkbox>
            <permission tag="request-button"
                        :route="apis.url_post_virtual_finance_purchase_push_yks"
                        class="inline ml-xs"
                        :mintime="200"
                        :disabled="selectList.length === 0"
                        req-key="url_post_virtual_finance_purchase_push_yks"
                        @click="push_yks">推送给有棵树
            </permission>
            <permission tag="trendsSelect"
                        class="inline ml-xs"
                        type="primary"
                        :selects="partAllOptions"
                        :route="apis.url_get_virtual_export"
                        req-key="url_get_virtual_export"
                        @trigger="export_sku">
            </permission>
            <permission tag="request-button"
                        :route="apis.url_batch_review"
                        class="inline ml-xs"
                        :mintime="200"
                        :disabled="selectList.length === 0"
                        req-key="url_batch_review"
                        @click="batch_review">批量审核通过
            </permission>
            <permission tag="request-button"
                        :route="apis.url_read_invoice"
                        class="inline ml-xs"
                        :mintime="200"
                        :disabled="selectList.length === 0"
                        req-key="url_read_invoice"
                        @click="invoice_view">导出虚拟发票
            </permission>
            <permission tag="request-button"
                        :route="apis.url_read_deliver"
                        class="inline ml-xs"
                        :mintime="200"
                        :timeout="60000"
                        :disabled="selectList.length === 0"
                        req-key="url_read_deliver"
                        @click="deliver_view">导出虚拟送货单
            </permission>
            <permission tag="request-button"
                        :route="apis.url_read_stock"
                        class="inline ml-xs"
                        :mintime="200"
                        :disabled="selectList.length === 0"
                        req-key="url_read_stock"
                        @click="stock_view">导出虚拟入库单
            </permission>
            <permission tag="request-button"
                        :route="apis.url_read_receipt"
                        class="inline ml-xs"
                        :mintime="200"
                        :disabled="selectList.length === 0"
                        req-key="url_read_receipt"
                        @click="receipt_view">导出虚拟收货单
            </permission>
            <permission tag="request-button"
                        :route="apis.url_read_purchase"
                        class="inline ml-xs"
                        :mintime="200"
                        :disabled="selectList.length === 0"
                        req-key="url_read_purchase"
                        @click="order_view">导出虚拟订购单
            </permission>
            <div class="fr mt-sm red bold-font">
                <div><span>应付款：</span>CNY {{pay.apply | pay_filter}}<span class="ml-md">本次付款：</span>CNY {{pay.payment | pay_filter}}</div>
            </div>
        </el-row>
        <table-list :loading="loading"
                    :checkedall="checkedall"
                    class="mt-sm"
                    :tableData="tableData"
                    :first-loading="firstLoading"
                    @selection-change="selectionChange"
                    @search="search">
        </table-list>
        <export-field  v-model="exportVisable" :fields="fields"
                       :templates="templates"
                       :param="export_model_type"
                       title="请选择自定义导出字段"
                       :creat-excel="creat_excel"
                       @getTemplate="get_templates">
        </export-field>
        <!--导出虚拟订购单-->
        <export-order v-model="view_orders" :checkList="checkList" @export_order="export_order"></export-order>
        <!--导出收货订单-->
        <export-receipt v-model="view_receipt" :checkList="receiptList" @export_order ="export_receipt"></export-receipt>
        <!--导出入库单-->
        <export-stock v-model="view_stock" :checkList="stocktList" @export_order ="export_stock"></export-stock>
        <!--导出送货单-->
        <export-deliver v-model="view_deliver" :checkList="deliverList" @export_order ="export_deliver"></export-deliver>
        <!--导出发票-->
        <export-invoice v-model="view_invoice" :checkList="invoiceList" @export_order ="export_invoice"></export-invoice>

        <export-dialog v-model="export_visible"></export-dialog>
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
    .p-index{
        .el-dropdown .el-button-group {
            display: inline-block;
            position: relative;
            top: -1px;
        }
        .el-message-box__status{
            top:27% !important;
        }
        .btn{
            margin:5px  0;
            border :0;
        }
    }
</style>
<script>
    import {
        api_publish_edit_pay,api_virtual_status,
        url_post_virtual_finance_purchase_push_yks,
        api_post_virtual_finance_purchase_push_yks,
        api_get_virtual_export,
        url_get_virtual_export,
        api_get_virtual_export_field,
        api_total_amount,
        api_read_purchase,
        url_read_purchase,
        api_export_purchase,
        url_read_receipt,
        api_read_receipt,
        api_export_receipt,
        url_read_stock,
        api_read_stock,
        api_export_stock,
        url_read_deliver,
        api_read_deliver,
        api_export_deliver,
        url_batch_review,
        api_batch_review,
        url_read_invoice,
        api_read_invoice,
        api_export_invoice
    } from "../../../api/purchase";
    import {url_get_balance}from '../../../api/assert-sup';
    import {url_finance_list, url_publish_edit_user,} from "../../../api/Payment";
    import {api_goods_export_template} from "../../../api/product-library";
    import {downloadFile} from '../../../lib/http';

    export default{
        permission:{
            url_get_virtual_export,
            url_finance_list,
            url_publish_edit_user,
            url_get_balance,
            url_post_virtual_finance_purchase_push_yks,
            url_read_purchase,
            url_read_receipt,
            url_read_stock,
            url_read_deliver,
            url_batch_review,
            url_read_invoice,
        },
        page:{
            devinfo:{
                frontEnd:'熊辉',
                backEnd:'黄伟杰',
                createTime:'2018-9-22',
                updateTime:'2018-9-25'
            },
            beforeClose(){
                return true;
            }
        },
        refresh(){
            this.init();
        },
        data(){
            return{
                receiptCode: "",
                flag: false,
                checkList: {
                    supplier_info: {},
                    table_data:[]
                },
                receiptList: {},
                stocktList: {},
                deliverList: {},
                invoiceList: {
                    supplier_info: {},
                    consignee_info: {},
                },
                view_orders: false,
                view_receipt: false,
                view_stock: false,
                view_deliver: false,
                view_invoice: false,
                pay:{
                    apply: 0,
                    payment: 0
                },
                checkedall: false,
                templates:[],
                ids:[],
                fields:[],
                exportVisable:false,
                export_type:'',
                export_visible:false,//导出管理队列
                partAllOptions: [
                    {name: "部分导出", value: 2},
                    {name: "全部导出", value: 1}
                ],
                export_model_type:{
                    type:23
                },
                audit:[],
                firstLoading:true,
                loading:false,
                total:0,
                selectList:[],
                tableData:[],
                searchData:{
                    push_status:'',
                    page:1,
                    pageSize:50,
                    status:'',
                    order_type:"0",
                    order_number:"",
                    order_status: '',
                    date_b:"",
                    date_e:"",
                    supplier_id:"",
                    time_status:"",
                    warehouse_id:"",
                    balance_type:"",
                    payment_status:'',
                    purchase_order_id:"",
                    review_status:''
                },
            }
        },
        mounted(){
            this.get_status();
            this.init();
            this.get_fields();
        },
        filters:{
            pay_filter(val) {
                return val === 0 ? Number(val).toFixed(4) : val
            }
        },
        methods:{
            export_invoice(){//导出发票
                let data = this.init_params();
                let contract_no  = this.invoiceList.contract_no   ;
                let ids = JSON.stringify(this.selectList.map(row => row.virtual_finance_purchase_id));
                    this.$http(api_export_invoice,{ids: ids, contract_no : contract_no , ...data}).then(res => {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let params = {
                            file_code: res.file_code,
                        };
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                        this.$message({type: "success", message: '导出成功' || res});
                        this.view_invoice = false;
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    }).finally(() => {
                            this.$reqKey('export_invoice',false);
                    });
            },
            export_deliver(){//导出送货单
                let data = this.init_params();
                let deliver_code   = this.deliverList.deliver_code  ;
                let ids = JSON.stringify(this.selectList.map(row => row.virtual_finance_purchase_id));
                    this.$http(api_export_deliver,{ids: ids, deliver_code : deliver_code , ...data}).then(res => {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let params = {
                            file_code: res.file_code,
                        };
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                        this.$message({type: "success", message: '导出成功' || res});
                        this.view_deliver = false;
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    }).finally(() => {
                            this.$reqKey('export_deliver',false);
                    });
            },
            export_stock(){//导出入库单
                let data = this.init_params();
                let in_stock_code = this.stocktList.in_stock_code;
                let ids = JSON.stringify(this.selectList.map(row => row.virtual_finance_purchase_id));
                    this.$http(api_export_stock,{ids: ids, in_stock_code: in_stock_code,...data}).then(res => {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let params = {
                            file_code: res.file_code,
                        };
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                        this.$message({type: "success", message: '导出成功' || res});
                        this.view_stock = false;
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    }).finally(() => {
                            this.$reqKey('export_stock',false);
                    });
            },
            export_receipt(){//导出收货单
                let data = this.init_params();
                let receipt_code = this.receiptList.receipt_code;
                let ids = JSON.stringify(this.selectList.map(row => row.virtual_finance_purchase_id));
                    this.$http(api_export_receipt,{ids: ids, receipt_code: receipt_code,...data}).then(res => {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let params = {
                            file_code: res.file_code,
                        };
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                        this.$message({type: "success", message: '导出成功' || res});
                        this.view_receipt = false;
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    }).finally(() => {
                            this.$reqKey('export_receipt',false);
                    });
            },
            export_order(){//导出订购单
                let data = this.init_params();
                    this.$http(api_export_purchase,{ids: JSON.stringify(this.selectList.map(row => row.virtual_finance_purchase_id)),...data}).then(res => {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let params = {
                            file_code: res.file_code,
                        };
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                        this.$message({type: "success", message: '导出成功' || res});
                        this.view_orders = false;
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    }).finally(() => {
                            this.$reqKey('export_order',false);
                    });
            },
            invoice_view(){//查看发票
                let data = this.init_params();
                let selectTest = this.selectList.map(row => row.virtual_supplier_name);
                let opition = new Set(selectTest).size===1;
                if(this.checkedall && opition === true) {
                    this.$http(api_export_invoice, {select: 1, ...data}).then(res => {
                        if (res.join_queue === 1) {
                            this.export_visible = true;
                            this.$message({type: "success", message: res.message || res});
                        }
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    }).finally(() => {
                            this.$reqKey('url_read_invoice', false);
                    })
                }else {
                    if (opition === false) {
                        this.$message({type: 'error', message: '必须选择同个供应商的单据'});
                        this.$reqKey('url_read_invoice', false);
                    } else {
                        this.$http(api_read_invoice, {ids: JSON.stringify(this.selectList.map(row => row.virtual_finance_purchase_id)), ...data}).then(res => {
                            this.view_invoice = true;
                            this.invoiceList = res;
                        }).catch(code => {
                            this.view_invoice = false;
                            this.$message({type: 'error', message: code.message || code});
                        }).finally(() => {
                                this.$reqKey('url_read_invoice', false);
                        })
                    }
                }
            },
            deliver_view(){//查看送货单
                let data = this.init_params();
                let selectTest = this.selectList.map(row => row.virtual_supplier_name);
                let opition = new Set(selectTest).size===1;
                if(this.checkedall && opition === true) {
                    this.$http(api_export_deliver, {select: 1, ...data}).then(res => {
                        if (res.join_queue === 1) {
                            this.export_visible = true;
                            this.$message({type: "success", message: res.message || res});
                        }
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    }).finally(() => {
                            this.$reqKey('url_read_deliver', false);
                    })
                }else {
                    if (opition === false) {
                        this.$message({type: 'error', message: '必须选择同个供应商的单据'});
                        this.$reqKey('url_read_deliver', false);
                    } else {
                        this.$http(api_read_deliver, {ids: JSON.stringify(this.selectList.map(row => row.virtual_finance_purchase_id)), ...data}).then(res => {
                            this.view_deliver = true;
                            this.deliverList = res;
                        }).catch(code => {
                            this.view_deliver = false;
                            this.$message({type: 'error', message: code.message || code});
                        }).finally(() => {
                            this.$reqKey('url_read_deliver', false);
                        })
                    }
                }
            },
            stock_view(){//查看入库单
                let data = this.init_params();
                let selectTest = this.selectList.map(row => row.virtual_supplier_name);
                let opition = new Set(selectTest).size===1;
                if(this.checkedall && opition === true) {
                    this.$http(api_export_stock, {select: 1, ...data}).then(res => {
                        if (res.join_queue === 1) {
                            this.export_visible = true;
                            this.$message({type: "success", message: res.message || res});
                        }
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    }).finally(() => {
                            this.$reqKey('url_read_stock', false);
                    })
                }else {
                    if (opition === false) {
                        this.$message({type: 'error', message: '必须选择同个供应商的单据'});
                        this.$reqKey('url_read_stock', false);
                    } else {
                        this.$http(api_read_stock, {ids: JSON.stringify(this.selectList.map(row => row.virtual_finance_purchase_id)), ...data}).then(res => {
                            this.view_stock = true;
                            this.stocktList = res;
                        }).catch(code => {
                            this.view_stock = false;
                            this.$message({type: 'error', message: code.message || code});
                        }).finally(() => {
                            this.$reqKey('url_read_stock', false);
                        })
                    }
                }
            },
            receipt_view(){//查看收货单
                let data = this.init_params();
                let selectTest = this.selectList.map(row => row.virtual_supplier_name);
                let opition = new Set(selectTest).size===1;
                if(this.checkedall && opition === true) {
                    this.$http(api_export_receipt, {select: 1, ...data}).then(res => {
                        if (res.join_queue === 1) {
                            this.export_visible = true;
                            this.$message({type: "success", message: res.message || res});
                        }
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    }).finally(() => {
                        this.$reqKey('url_read_receipt', false);
                    })
                }else {
                    if (opition === false) {
                        this.$message({type: 'error', message: '必须选择同个供应商的单据'});
                        this.$reqKey('url_read_receipt', false);
                    } else {
                        this.$http(api_read_receipt, {ids: JSON.stringify(this.selectList.map(row => row.virtual_finance_purchase_id)), ...data}).then(res => {
                            this.view_receipt = true;
                            this.receiptList = res;
                        }).catch(code => {
                            this.view_receipt = false;
                            this.$message({type: 'error', message: code.message || code});
                        }).finally(() => {
                            this.$reqKey('url_read_receipt', false);
                        })
                    }
                }
            },
            order_view(){//查看订购单
                let data = this.init_params();
                let selectTest = this.selectList.map(row => row.virtual_supplier_name);
                let opition = new Set(selectTest).size===1;
                if(this.checkedall && opition === true) {
                    this.$http(api_export_purchase, {select: 1, ...data}).then(res => {
                        if (res.join_queue === 1) {
                            this.export_visible = true;
                            this.$message({type: "success", message: res.message || res});
                        }
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    }).finally(() => {
                        this.$reqKey('url_read_purchase', false);
                    })
                }else {
                    if (opition === false) {
                        this.$message({type: 'error', message: '必须选择同个供应商的单据'});
                        this.$reqKey('url_read_purchase', false);
                    } else {
                        this.$http(api_read_purchase, {ids: JSON.stringify(this.selectList.map(row => row.virtual_finance_purchase_id)), ...data}).then(res => {
                            this.view_orders = true;
                            this.checkList = res;
                        }).catch(code => {
                            this.view_orders = false;
                            this.$message({type: 'error', message: code.message || code});

                        }).finally(() => {
                            this.$reqKey('url_read_purchase', false);
                        })
                    }
                }
            },
            get_fields() {//获取导出字段
                this.$http(api_get_virtual_export_field).then(res => {
                    this.fields=res
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            order_export(params, head) {
                return this.$http(api_get_virtual_export, params, head).then(res => {
                    if (res.join_queue === 1) {
                        this.export_visible = true;
                        this.$message({type: "success", message: res.message || res});
                    } else {
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
                        this.$message({type: "success", message: '导出成功' || res});
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
                return Promise.resolve()
            },
            get_templates() {
                this.$http(api_goods_export_template, {type: 23}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    });
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            creat_excel(param,list) {
                let fields = param.field.join(',');
                let data = '';
                switch (this.export_type) {
                    case 2://部分
                        let reqData = [];
                        let ids = [];
                        this.selectList.forEach(row=>{
                            ids.push(`${row.virtual_order_id}`)
                        });
                        list.forEach(row=>{
                            reqData.push({field_name:row.show_field,field_key:row.field})
                        });
                        let obj={
                            export_type : this.export_type,
                            fields:reqData,
                            ids:ids,
                        };
                        Object.assign(obj,this.init_params());
                        return this.order_export(obj, {
                            'X-Result-Fields': fields,
                            contentType: 'application/x-www-form-urlencoded'
                        });
                        break;
                    case 1://全部
                        let allData = [];
                        list.forEach(row=>{
                            allData.push({field_name:row.show_field,field_key:row.field})
                        });
                        let req={
                            export_type : this.export_type,
                            fields:allData,
                        };
                        Object.assign(req,this.init_params());
                        return this.order_export(req, {
                            'X-Result-Fields': fields,
                            contentType: 'application/x-www-form-urlencoded'
                        });
                        break;
                }
            },
            export_sku(val) {
                if (val.value === 2 && this.selectList.length <= 0) {
                    this.$message({
                        type: "warning",
                        message: "请先选择需要导出的数据"
                    });
                }else {
                    this.export_type = val.value;
                    this.exportVisable = true;
                }
            },
            get_status(){
                this.$http(api_virtual_status).then(res=>{
                    this.audit = [{label:'全部',value:''},...res];
                });
            },
            init_params(){
                let paramsData = window.clone(this.searchData);
                if(this.searchData.date_b){
                    let d = new Date(this.searchData.date_b);
                    paramsData.date_b = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
                }else {
                    paramsData.date_b='';
                }
                if(this.searchData.date_e){
                    let e = new Date(this.searchData.date_e);
                    paramsData.date_e = e.getFullYear() + '-' + (e.getMonth() + 1) + '-' + e.getDate();
                }else {
                    paramsData.date_e='';
                }
                if(this.searchData.order_number.trim()){
                    paramsData.order_number = this.searchData.order_number.replace(new RegExp(' ', 'gm'), '\n').trim().split('\n').map(row => row.trim()).filter(row => row !== '');
                }else{
                    paramsData.order_number = '';
                }
                return paramsData
            },
            //页面初始化请求列表数据
            init(){
                let parm = this.init_params();
                this.tableData=[];
                this.loading=true;
                this.$http(api_publish_edit_pay,parm).then(res=>{
                    this.total=res.count;
                    this.tableData=res.data;
                    this.loading = false;
                    this.firstLoading = false
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                })
            },
            select_status(val){
                this.searchData.payment_status=val;
                this.init();
            },
            auditSelect(val){
              this.searchData.review_status = val;
              this.init();
            },
            //点击搜索按钮  搜索
            search(){
                this.init();
            },
            //清空
            clear(){
                Object.keys(this.searchData).forEach(key=>{
                    this.searchData[key] = '';
                });
                this.searchData={
                    page:1,
                    pageSize:50,
                    snType:"purchase_order_code",
                    dateType:"purchase_time",
                };
                this.init();
            },
            //更改页面条数
            handleSizeChange(val) {
                this.searchData.pageSize=val;
                this.init();
            },
            //跳转页数
            handleCurrentChange(val) {
                this.searchData.page=val;
                this.init();
            },
            //选中
            selectionChange(val){
                this.selectList = val;
                if(this.selectList.length === 0){
                    this.flag = false
                }
                if(!this.checkedall && !this.flag){
                    let data = this.init_params();
                    let arr = this.selectList.map(row => row.virtual_finance_purchase_id);
                    let arr1 = this.selectList.length === 0 ? '' : arr.map(String);
                    this.$http(api_total_amount, {ids: arr1,...data}).then(res => {
                        this.pay = res;
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    })
                }else if(this.flag){
                    this.pay.payment = 0;
                    this.pay.apply = 0;
                }
            },
            check_all(){
                let data = this.init_params();
                if(this.checkedall){
                    this.$http(api_total_amount, {select: 1,...data}).then(res => {
                        this.pay = res;
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    })
                }else{
                    this.flag = true;
                }
            },
            refresh(){
                this.init();
            },
            batch_review(){
                this.$confirm(`此操作为批量审核通过勾选的数据, 确认此操作吗 ?`, '提示',{
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    let data = this.init_params();
                    let ids = JSON.stringify(this.selectList.map(row => row.virtual_finance_purchase_id));
                    if(this.checkedall){
                        this.$http(api_batch_review, {select : 1,...data}).then(res => {
                            this.$message({type: 'success', message: res.message || res});
                            this.init();
                        }).catch(code => {
                            this.$message({type: 'error', message: code.message || code});
                        }).finally(() => {
                            setTimeout(() => {
                                this.$reqKey('url_batch_review', false);
                            }, 200);
                        })
                    }else{
                        this.$http(api_batch_review, {ids: ids,}).then(res => {
                            this.$message({type: 'success', message: res.message || res});
                            this.init();
                        }).catch(code => {
                            this.$message({type: 'error', message: code.message || code});
                        }).finally(() => {
                            setTimeout(() => {
                                this.$reqKey('url_batch_review', false);
                            }, 200);
                        })
                    }
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消",
                        duration: 800
                    })
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('url_batch_review', false);
                    }, 200);
                })
            },
            push_yks() {
                this.$confirm(`您将已勾选的虚拟采购单推送给有棵树，确定进行此操作?`, '提示', {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    let data = this.init_params();
                    if(this.checkedall){
                        this.$http(api_post_virtual_finance_purchase_push_yks, {select : 1,...data}).then(res => {
                            this.$message({type: 'success', message: res.message || res});
                            this.init();
                        }).catch(code => {
                            this.$message({type: 'error', message: code.message || code});
                        }).finally(() => {
                            setTimeout(() => {
                                this.$reqKey('url_post_virtual_finance_purchase_push_yks', false);
                            }, 200);
                        })
                    }else{
                        this.$http(api_post_virtual_finance_purchase_push_yks, {ids: JSON.stringify(this.selectList.map(row => row.virtual_finance_purchase_id))}).then(res => {
                            this.$message({type: 'success', message: res.message || res});
                            this.init();
                        }).catch(code => {
                            this.$message({type: 'error', message: code.message || code});
                        }).finally(() => {
                            setTimeout(() => {
                                this.$reqKey('url_post_virtual_finance_purchase_push_yks', false);
                            }, 200);
                        })
                    }
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消"
                    })
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('url_post_virtual_finance_purchase_push_yks', false);
                    }, 200);
                });
            }
        },
        components:{
            search:require('./search').default,
            tableList:require('./table-list').default,
            trendsSelect:require('../../../components/trends-select').default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('../../report/export-dialog').default,
            exportOrder: require('./export-order').default,
            exportReceipt: require('./export-receipt').default,
            exportStock: require('./export-stock').default,
            exportDeliver: require('./export-deliver').default,
            exportInvoice: require('./export-invoice').default,
        }
    }
</script>
