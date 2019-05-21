<template>
    <page class="p-index">
        <search
            ref="search"
            :searchData="searchData"
            @search="search"
        ></search>
        <el-row class="mb-sm mt-sm ml-sm">
            <permission tag="trendsSelect"
                        class="inline ml-xs mr-xs"
                        type="primary"
                        :route="apis.url_purchase_export"
                        :selects="partAllOptions"
                        @trigger="export_sku"></permission>
            <permission tag="request-button"
                        :route="apis.url_gain_pay"
                        req-key="url_gain_pay"
                        :mintime="200"
                        v-if="searchData.payment_apply_status!==2"
                        :disabled="select"
                        @click="all_pay">批量申请付款</permission>
            <permission tag="request-button"
                        :route="apis.url_batch_status"
                        :mintime="200" req-key="url_batch_status"
                        :disabled="select"
                        :request="batch_status"
                        v-if="searchData.status===0">批量改为等待到货</permission>
            <permission tag="request-button"
                        :route="apis.url_get_tracking_numbers"
                        :disabled="select || searchData.status !== 10"
                        :mintime="200"
                        req-key="url_get_tracking_numbers"
                        :request="get_tracking_numbers">批量抓取网络下单运单号</permission>
            <permission tag="ElButton"
                        :route="apis.url_import_order"
                        size="mini"
                        type="primary" @click.native="importExcelShow=true">导入采购单</permission>
            <permission tag="request-button"
                        :route="apis.url_change_states_balance_type"
                        :mintime="200"
                        :disabled="selectval.length<=0"
                        @click.native="batch_pay">批量修改结算方式
            </permission>
            <permission tag="request-button"
                        :route="apis.url_purchase_order_batchInvalid"
                        req-key="url_import_order"
                        :mintime="200"
                        v-if="searchData.status===0 || searchData.status===10 || searchData.payment_status===7"
                        :disabled="selectval.length<=0"
                        :request="invalid_back">作废并退回采购计划</permission>
            <trends-select class="inline ml-xs"
                           :selects="handleList"
                           type="primary"
                           v-if="searchData.status===15"
                           @trigger="select_handle"></trends-select>
            <div class="inline fr">
                <span class="mr-sm">
                  <img src="../../../assets/receive_before.png">：待接收
                </span>
                <span class="mr-sm">
                  <img src="../../../assets/receive_have.png">：已接收
                </span>
                <span class="mr-sm">
                  <img src="../../../assets/receive_unsual.jpg">：已拆包
                </span>
                <span>
                  <img src="../../../assets/receive_unpack.png">：收包异常
                </span>
            </div>
        </el-row>
        <table-list v-model="loading"
                    :tableData="tableData"
                    :search-data="searchData"
                    :first-loading="firstLoading"
                    @search="search"
                    @sort-change="sort_change"
                    @data-change="data_change"></table-list>
        <div v-if="showLeftData" class="ml-sm purchase-proposal-total-sku">
            <span class="mr-sm">{{`总品类数：${leftData.sku_type_count}`}}</span>
            <span class="mr-sm">{{`总运费：${leftData.currency_code} ${leftData.total_shipping_cost}`}}</span>
            <span class="mr-sm">{{`总贷款：${leftData.currency_code} ${leftData.total_amount}`}}</span>
        </div>
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
        <add-list v-model="addVisable" @update="update"></add-list>
        <payment-list v-model="showPayment" :pay-data="payData" @refresh="refresh"></payment-list>
        <import-excel v-model="importExcelShow"
                      :api_port="apiPort"
                      :file_name="`下载采购单导入模板`">
        </import-excel>
        <export-field :param="export_model_type" v-model="exportVisable" :fields="fields" :templates="templates" :fixparam="fixparam"  @getTemplate="get_templates"  title="请选择自定义导出字段" :creat-excel="creat_excel"></export-field>
        <export-dialog v-model="visible"></export-dialog>
        <!--批量修改结算方式-->
        <batch-clearing-form v-model="batchPayDialog"
                             @submit="submit_pay"
                             :addData="batchPayType">
        </batch-clearing-form>
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
        .purchase-proposal-total-sku{
            color: #475669
            box-sizing: border-box;
            width: -moz-calc(100% - 182px);
            width: -webkit-calc(100% - 182px);
            position: fixed;
            background: #fff;
            text-align: right;
            padding-bottom: 3px;
            padding-right:20px;
            z-index: 1000;
            bottom: 5px;
            width: auto;
        }
    }
</style>
<script>
    import search from './search.vue'
    import tableList from  "./table-list.vue"
    import  addList from  "./add-list.vue"
    import  paymentList from  "./payment-list.vue"
    import {downloadFile} from '../../../lib/http';
    import  {
        api_publish_edit_carrier,api_pay,
        api_gain_pay,
        api_get_tracking_numbers,
        api_batch_status,
        api_change_states,
        api_import_order,
        url_gain_pay,
        url_batch_status,
        url_import_order,
        url_get_tracking_numbers,
        api_purchase_order_batchInvalid,
        url_purchase_order_batchInvalid,
        api_purchase_order_export_fields,
        url_purchase_export,
        api_purchase_export,
        api_purchase_order_calculating_money,
        api_change_states_balance_type,
        url_change_states_balance_type
    } from "../../../api/purchase"
    import {api_goods_export_template} from  "../../../api/product-library";
    export default{
        permission:{
            url_gain_pay,
            url_purchase_export,
            url_batch_status,
            url_import_order,
            url_change_states_balance_type,
            url_get_tracking_numbers,
            url_purchase_order_batchInvalid
        },
        page:{
            devinfo:{
                frontEnd:'张兵根;黎宏珍',
                backEnd:'杨伟权;谭斌',
                createTime:'2017-1-10',
                updateTime:'2017-8-22'
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
                batchPayType: {
                    balance_type: '',
                },
                batchPayDialog: false,
                firstLoading:true,
                exportVisable:false,
                showPayment:false,
                visible:false,
                payData:{
                    dataList:[],
                    total:0
                },
                loading:true,
                leftDataLoading:true,
                count:0,
                selectval:[],
                addVisable:false,
                tableData:[],
                page:1,
                pageSize:20,
                sort_field: '',
                sort_type: '',
                searchData:{
                    unfinished_day_min: '',
                    unfinished_day_max: '',
                    status:'',
                    snType:"purchase_order_code",
                    snText:"",
                    date_b:"",
                    date_e:"",
                    purchase_user_id:[],
                    payment_status:"",
                    payment_apply_status:"",
                    supplier_id:"",
                    dateType:"purchase_time",
                    unfinished:"order_unfinished",
                    partial_arrival_status:'',
                    warehouse_id:"",
                    purchase_execept_type:"",
                    balance_type:"",
                    has_logistics:"",
                    is_received:"",
                    supply_chain_specialist:[],/*供应链专员*/
                    purchaseType:"purchase_execept_type",
                    purchase_plan_type: '',
                    label_deck:'',
                    return_goods:'',

                },
                select:true,
                fileCode:"",
                handleList: [
                    {label: "审核通过", value: 1},
                    {label: "审核不通过", value: 0},
                ],
                importExcelShow:false,
                apiPort:api_import_order,
                invalid_back_text:'',
                partAllOptions:[
                    {name:"部分导出",value:2},
                    {name:"全部导出",value:1},
                ],
                fields:[],
                templates:[],
                export_type:'',
                export_model_type:{
                    type:2
                },
                leftData:{},
                showLeftData:false
            }
        },
        mounted(){
            this.init();
            this.get_fields();
            this.get_templates();
        },
        methods:{
            sort_change(val) {//排序
                if(!val.column||!val.column.label) return;
                console.log('val', val);
                switch(val.column.label) {
                    case '实际付款':
                        this.sort_field = 'actual_payed_amount';
                        break;
                    case '采购日期':
                        this.sort_field = 'create_time';
                }
                this.sort_type = val.order === 'descending' ? 'desc' : 'asc';
                this.init();
            },
            batch_pay(){//批量修改结算方式弹框打开
                this.batchPayDialog = true;
            },
            submit_pay(){//批量修改结算方式确定按钮
                let ids = this.selectval.map(row => row.id);
                let data = {
                    balance_type: this.batchPayType.balance_type,
                    ids: ids
                };
                this.$http(api_change_states_balance_type, data).then(res => {
                    this.batchPayDialog = false;
                    this.$message({type: 'success', message: res.message || res});
                    this.init();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                    this.batchPayDialog = false;
                }).finally(() => {
                    this.$reqKey('clearingForm2', false);
                });
            },
            fixparam(list){
                return list.map(row=>{
                    return {
                        field_name:row.show_field,
                        field_key:row.field

                    }
                });
            },
            get_fields(){
                this.$http(api_purchase_order_export_fields).then(res=>{
                    this.fields=res;
                }).catch(code => {
                    this.$message({type:"error",message:code.message||code})
                });
            },
            get_templates(){
                this.$http(api_goods_export_template,{type:2}).then(res=>{
                    res.forEach(row=>{
                        row.value=row.name;
                    });
                    this.templates=res;
                }).catch(code => {
                    this.$message({type:"error",message:code.message||code})
                });
            },
            //批量获取运单号
            get_tracking_numbers(){
                if(this.selectval.length===0){
                    this.$reqKey('url_get_tracking_numbers',false);
                    return this.$message({
                        type:'warning',
                        message:"请选择采购单"
                    });
                }else{
                    let ids=[];
                    this.selectval.forEach(row=>{
                        ids.push(row.id)
                    });
                    let purchase_order_ids={
                        purchase_order_ids:ids.join(",")
                    };
                    return this.$http(api_get_tracking_numbers,purchase_order_ids).then(res =>{
                        if(res.status === 200){
                            let data = Object.values(res.data);
                            data.forEach(parm =>{
                                if(parm.status === 200){
                                    this.$message({type:'success',message:`获取运单号成功!`});
                                }else{
                                    this.$message({type:'warning',message:parm.message});
                                }
                            })
                        }else{
                            this.$message({type:'warning',message:res.message});
                        }
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({
                            type:'error',
                            message:code.message || code
                        })
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey('url_get_tracking_numbers',false);
                        },200);
                    });
                }
            },
            export_sku(val){
                if(val.value===2&&this.selectval.length<=0)return this.$message({type:"warning",message:"请先选择需要导出的数据"});
                this.export_type = val.value;
                this.exportVisable=true;
            },
            creat_excel(param){
                let data = '';
                switch (this.export_type){
                    case 2://部分
                        data = {
                            ids:this.selectval.map(row=>{
                                if(typeof row === 'object'){
                                    return row.id
                                }else{
                                    return row
                                }
                            }),
                            export_type:this.export_type,
                            fields:param
                        };
                        Object.assign(data,this.init_params());
                        return this.order_export(data);
                        break;
                    case 1://全部
                        data = this.init_params();
                        this.$set(data,'export_type',this.export_type);
                        this.$set(data,'fields',param);
                        return this.order_export(data);
                        break;
                }
            },
            order_export(params){
                return this.$http(api_purchase_export,params).then(res=>{
                    if (res.join_queue === 1) {
                        this.visible = true;
                        this.$message({type: "success", message: res.message || res});
                    } else {
                        let params = {
                            page:this.page,
                            pageSize:this.pageSize,
                            file_code:res.file_code
                        };
                        let url= config.apiHost+'downloadFile/downExportFile';
                        downloadFile({
                            url:url,
                            get:params,
                            fileName:res.file_name,
                            suffix:'.xls',
                        });
                        this.$message({type:'success',message:res.message || res});
                    }
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
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
                if(this.searchData.status!==15){
                    paramsData.partial_arrival_status = '';
                }
                if(this.searchData.warehouse_id.length >0){//采购仓库
                    paramsData.warehouse_id = paramsData.warehouse_id.join(',');
                }else{
                    paramsData.warehouse_id = '';
                }
                if(this.searchData.purchase_execept_type.length >0){//采购异常
                    paramsData.purchase_execept_type = paramsData.purchase_execept_type.join(',');
                }else{
                    paramsData.purchase_execept_type = '';
                }
                if(this.searchData.balance_type.length >0){ //结算方式
                    paramsData.balance_type = paramsData.balance_type.join(',');
                }else{
                    paramsData.balance_type = '';
                }
                if(this.searchData.label_deck.length >0){ //贴标/套袋
                    paramsData.label_deck = paramsData.label_deck.join(',');
                }else{
                    paramsData.label_deck = '';
                }
                if(this.searchData.purchase_user_id.length >0){ //采购员
                    paramsData.purchase_user_id = paramsData.purchase_user_id.join(',');
                }else{
                    paramsData.purchase_user_id = '';
                }
                if(this.searchData.supply_chain_specialist.length >0){ //供应链专员
                    paramsData.supply_chain_specialist = paramsData.supply_chain_specialist.join(',');
                }else{
                    paramsData.supply_chain_specialist = '';
                }
                this.sort_field && this.$set(paramsData, 'sort_field', this.sort_field);
                this.sort_type && this.$set(paramsData, 'sort_type', this.sort_type);
                paramsData.snText = (this.searchData.snType.toUpperCase() !== 'SPU'&&!!this.searchData.snText.trim())?
                    paramsData.snText.replace(new RegExp(' ', 'gm'), '\n').trim().split('\n').map(row => row.trim()).filter(row => row !== ''):
                    paramsData.snText.trim();
                paramsData.page = this.page;
                paramsData.pageSize = this.pageSize;
                return paramsData
            },
            get_left_data(){
                let data = this.init_params();
                this.$http(api_purchase_order_calculating_money,data).then(res=>{
                    this.showLeftData = true;
                    this.leftData = res;
                });
            },
            //页面初始化请求列表数据
            init(){
                this.showLeftData = false;
                let params = this.init_params();
                this.tableData=[];
                this.loading=true;
                this.select=true;
                if(this.hasLeftData) {
                    this.get_left_data();
                }
                this.$http(api_publish_edit_carrier,params).then(res=>{
                    this.count=res.count;
//                    TODO 后端无法简化采购单号(purchase_order_code)为 PO+id,故前端新增order_code表示
                    this.tableData=res.data.map(row=>{
                        row.order_code = 'PO' + row.id;
                        if(row.packInfo){
                            let img = [];
                            for (let value of Object.values(row.packInfo)){
                                img.push(value);
                            }
                            this.$set(row,'img',img);
                        }
                        return row;
                    });
                    this.loading=false;
                    this.firstLoading=false
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                })
            },
            //点击搜索按钮  搜索
            search(){
                this.page = 1;
                this.init();
            },
            //更改采购员
            change_buyer(val){
                this.searchData.purchase_user_id=val;
                this.init();
            },
            //更改供应商
            change_supplier(val){
                this.searchData.supplier_id=val;
                this.init();
            },
            //更改仓库
            change_depot(val){
                this.searchData.warehouse_id=val;
                this.init();
            },
            //更改页面条数
            handleSizeChange(val) {
                this.pageSize=val;
                this.init();
            },
            //跳转页数
            handleCurrentChange(val) {
                this.page=val;
                this.init();
            },
            //添加页面
            add(){
                this.addVisable=true;
            },
            //添加成功 更新
            update(){
                this.searchData.purchase_user_id = "";
                this.init()
            },
            //选中
            data_change(val){
                this.selectval=val;
                if(val.length>0){
                    if(this.searchData.status === -1){
                        this.select = true;
                    }else{
                        this.select = false;
                    }
                }else if(val.length===0){
                    this.select = true;
                }
                // console.log(this.selectval,'this.selectval')
            },
            //批量付款
            all_pay(){
                if(this.selectval.length===0){
                    this.$reqKey('url_gain_pay',false);
                    this.$message({
                        type:'warning',
                        message:`请选择付款单`
                    });
                    return false;
                }
                let dataList = this.selectval.filter(row=>{
                    if(row.purchase_order_status_text==='等待下单'){
                        this.$message({
                            type:'warning',
                            message:`等待下单的采购单不能申请付款!`
                        });
                        return false;
                    }
                    if(row.purchase_order_status_text==='作废'){
                        this.$message({
                            type:'warning',
                            message:`已作废的采购单不能申请付款!`
                        });
                        return false;
                    }
                    if(parseInt(row.payable_amount)===0){
                        this.$message({
                            type:'warning',
                            message:`应付款为0的采购订单不需要申请付款!`
                        });
                        return false
                    }
                    return true
                });
                if(dataList.length>0){
                    let data={
                        id:dataList.map(row=>row.id).join(",")
                    };
                    this.$http(api_gain_pay,data).then(res=>{
                        if(!!res.message){
                            this.$message({type:'error',message:res.message});
                        }
                        res.data.forEach(data => {
                            data.apply_amount = Number(data.apply_amount).toFixed(3);
                            data.payable_amount = Number(data.payable_amount).toFixed(3);
                            data.shipping_cost = Number(data.shipping_cost).toFixed(3);
                            data.sum = parseFloat(data.rest_amount);
                            this.$set(data, 'apply_amount', Number(data.sum).toFixed(3));
                            this.$set(data, 'show', false);
                        });
                        this.payData.dataList=res.data;
                        this.payData.total=res.count;
                        this.showPayment=true;
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey('url_gain_pay',false);
                        },200);
                    });
                }else{
                    this.$reqKey('url_gain_pay',false);
                }
            },
            batch_status(){
                let ids=[];
                this.selectval.forEach(row=>{
                    ids.push(row.id)
                });
                let data={
                    ids:ids,
                    status:10
                };
                return this.$http(api_batch_status,data).then(res=>{
                    this.$message({type:'success',message:res.message || res});
                    this.selectval.forEach(row=>{
                        let index = this.tableData.findIndex(data=>{
                            return data.id === row.id;
                        });
                        this.tableData.splice(index,1);
                    });
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    });
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_batch_status',false);
                    },200);
                });
            },
            refresh(){
                this.init();
            },
            select_handle(val) {
                if (this.selectval.length <= 0) {
                    this.$message({type: "warning", message: `请选择审批项后，再进行相应操作`});
                } else {
                    let ids = [];
                    this.selectval.forEach(row=>{
                        ids.push(row.id)
                    });
                    if (val.value === 0) {
                        this.$prompt('原因备注', '审核不通过', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                        }).then(({value}) => {
                            let params = {
                                ids: ids,
                                status: val.value,
                                note: value,
                            };
                            this.$http(api_change_states, params).then(res => {
                                this.$message({type: "success", message: res.message || res});
                                this.selectval.forEach(row=>{
                                    let index = this.tableData.findIndex(data=>{
                                        return data.id === row.id;
                                    });
                                    this.tableData.splice(index,1);
                                });
                            }).catch(code => {
                                this.$message({type: "error", message: code.message || code});
                            })
                        }).catch(() => {
                            this.$message({type: "info", message: `已取消操作!`});
                        });
                    } else {
                        const h = this.$createElement;
                        this.$msgbox({
                            title: '提示',
                            message: h('p', null, [
                                h('div', null, '您将更改所选采购单状态，确认此操作吗？'),
                                this.selectval.map(row=>{
                                    return h('div', {style:'margin-top:5px;margin-left:-10px;width:400px;'}, [
                                        h('div',{class:'inline'},`采购单：${row.order_code}`),
                                        h('div',{class:'inline ml-sm'},`原运费：${row.shipping_cost} ${row.currency_code}`),
                                        h('div',{class:'inline ml-sm'},[
                                            h('span',null,`实际运费：`),
                                            h('span',{style:`color:red;`},`${row.actual_shipping_cost}`),
                                            h('span',null,` ${row.currency_code}`)
                                        ])
                                    ])
                                })
                            ]),
                            showCancelButton: true,
                            closeOnClickModal:true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            beforeClose: (action, instance, done) => {
                                if (action === 'confirm') {
                                    instance.confirmButtonLoading = true;
                                    instance.confirmButtonText = '执行中...';
                                    this.approve(ids,val,instance,done);
                                } else {
                                    instance.confirmButtonLoading = false;
                                    instance.confirmButtonText = '确定';
                                    done();
                                }
                            }
                        }).then(action => {
                            if (action === 'cancel') {
                                this.$message({
                                    type: 'info',
                                    message: `已取消操作!`
                                });
                            }
                        });
                    }
                }
            },
            approve(ids,val,instance,done){
                let params = {
                    ids: ids,
                    status: val.value,
                };
                this.$http(api_change_states, params).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.selectval.forEach(row=>{
                        let index = this.tableData.findIndex(data=>{
                            return data.id === row.id;
                        });
                        this.tableData.splice(index,1);
                    });
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(()=>{
                    instance.confirmButtonLoading = false;
                    done();
                });
            },
            invalid_back(){
                return this.$prompt(`您将更改所选采购单状态，确认此操作吗？`, "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showInput:true,
                    inputValidator:(inputValue)=>{
                        switch(inputValue) {
                            case null:
                                return false;
                                break;
                            case '':
                                return false;
                                break;
                            default:
                                this.invalid_back_text = inputValue;
                        }
                    },
                    inputErrorMessage: '作废原因不能为空！',
                    inputPlaceholder:'请输入作废原因...'
                }).then(() => {
                    let data = {
                        ids:JSON.stringify(this.selectval.map(row=>row.id)),
                        remark:this.invalid_back_text
                    };
                    return this.$http(api_purchase_order_batchInvalid,data).then((res)=>{
                        this.tableData.forEach((row,index)=>{
                            this.selectval.forEach(item=>{
                                if(row.id === item.id){
                                    this.tableData.splice(index,1);
                                }
                            });
                        });
                        this.$message({type:'success',message:res.message||res});
                        return Promise.resolve();
                    }).catch((code)=>{
                        this.$message({type:'error', message:code.message||code});
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey('url_import_order',false);
                        },200);
                    });
                }).catch(() => {
                    this.invalid_back_text = '';
                    this.$message({type: "info", message: `已取消操作!`});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_import_order',false);
                    },200);
                });
            },
        },
        computed:{
            hasLeftData(){
                return !!this.searchData.snText||!!this.searchData.purchase_user_id||!!this.searchData.supplier_id||!!this.searchData.warehouse_id||!!this.searchData.purchase_execept_type||!!this.searchData.has_logistics||!!this.searchData.is_received||!!this.searchData.balance_type||!!this.searchData.date_b||!!this.searchData.date_e
            }
        },
        components:{
            search,
            tableList,
            addList,
            paymentList,
            exportDialog:require('../../report/export-dialog').default,
            trendsSelect: require('../../../components/trends-select.vue').default,
            importExcel:require('../../product/excel-update/import-excel.vue').default,
            exportField:require("@/components/export-field").default,
            batchClearingForm:require('./batch-clearing-form').default,
        }
    }
</script>
