<template>
    <page class="p-index">
        <label-buttons
                label="状态："
                :buttons="userStatus"
                :totalData="totalData"
                @btn-select="btnSelect"
                @seach="seach"
                @clear_search="clear_search"
        ></label-buttons>
        <!--<permission-->
                <!--tag="ElButton"-->
                <!--:route="apis.url_account_ebay_addform"-->
                <!--class="mt-xs mb-xs ml-sm"-->
                <!--type="primary"-->
                <!--@click="add_form"-->
                <!--size="mini">添加</permission>-->
        <permission
                tag="request-button"
                :route="apis.url_down_ebay_account"
                class="mt-xs mb-xs"
                req-key="exportAccount"
                @click="export_account">账号导出</permission>
        <el-button size="mini"
                   :disabled="selectData.length <= 0"
                   @click.native="batchSetup"
                   type="primary"
                   class="ml-sm mt-xs mb-xs">批量设置</el-button>
        <add-form v-model="addVisable" @add-update="add_update"></add-form>
        <data-table
                :tableData="tableData"
                @sort-change="sort_change"
                @refresh="refresh"
                @log-form="log_form"
                @edit-update="edit_update"
                :loading="loading"
                :first-loading="firstLoading"
                @selection-change="selectionChange">
        </data-table>
        <div class="block">
            <el-pagination
                    class="page-fixed"
                    @size-change="handle_size_change"
                    @current-change="handle_current_change"
                    :current-page="totalData.page"
                    :page-sizes="[20, 50, 100, 200,500]"
                    :page-size="totalData.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
        <log-record
            v-model="logDialog"
            :log-data="logForm"
            :title="title"
        ></log-record>
        <edit-batch v-model="settingUp"
                    :title="title"
                    :add-data="addData"
                    @set-clich="setClich"></edit-batch>
    </page>
</template>
<style lang="stylus">
    .mt{margin: 10px 0 10px 20px}
    .star-red{
        color: red;
    }
    .star-green{
        color: green;
    }
</style>
<script>
    import addForm from './add-form.vue';     //  引入添加数据表单组件
    import labelButtons from './label-buttons.vue';   //引入功能按键组件
    import dataTable from './data-table.vue';   //引入总表单组件
    import {account_ebay,api_ebay_account_log} from '../../../../api/account-ebay';   //引入数据接口组件
    import {downloadFile} from '../../../../lib/http';
    import {url_account_ebay_addform,url_down_ebay_account,api_down_ebay_account,api_set_ebay_account} from '../../../../api/account-ebay';
    export default{
        permission:{
            url_account_ebay_addform,
            url_down_ebay_account
        },
        page:{
            multiple:true,
        },
        refresh(){
            this.init();
        },
        data(){
            return{
                firstLoading:true,
                tableData:[],
                fSelect:0,
                addVisable:false,
                total:0,
                loading:true,
                order_by:'',
                sort:'',
                totalData: {
                    page: 1,
                    pageSize: 50,
                    snType: "account_name",
                    site_status: '',         //账号状态
                    time_type: 'register',   //时间类型
                    start_time: '', //开始时间
                    end_time: '',	//截止时间
                    seller_id: '', //销售员id
                    customer_id: '',//客服id
                    snText: "",
                    site_id: "",
                    token_valid_status: -1,
                    server_name: '',
                    is_invalid: -1,
                    taskName: "download_order",
                    taskCondition: "eq",
                    taskTime: '',
                },
                userStatus:[
                    {name:"全部",status:-1},
                    {name:"已启用",status:1},
                    {name:"已停用", status:0},
                ],
                selectData:[],
                logForm:[],
                logDialog:false,
                addData:{},
                title:'',
                settingUp:false
            }
        },
        //初始化
        mounted(){
            this.init();
        },
        methods:{
            selectionChange(val){
                this.selectData = val.map(row=>{
                    return row.id
                });
            },
            batchSetup(){
                this.settingUp = true;
                this.title = "批量设置";
                this.addData = {
                    status:'',
                    site_status:'',
                    download_order:'',
                    download_message:'',
                    download_listing:'',
                    sync_payment:'',
                    sync_delivery:'',
                    sync_feedback:'',
                    health_monitor:'',
                }
            },
            setClich(val){
                let parmes = val;
                this.$set(parmes,'ids',this.selectData.join(','));
                this.$http(api_set_ebay_account,parmes).then(res=>{
                    this.settingUp = false;
                    this.init();
                    this.$message({type:'success',message: res.message});
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('downloadAdd',false);
                    }, 300)
                })
            },
            sort_change(val){
                if(!val||!val.column)return;
                switch(val.column.label){
                    case "简称":
                        this.order_by = 'code';
                        break;
                    case "eBay账户":
                        this.order_by = 'account_name';
                        break;
                    case "站点":
                        this.order_by = 'site_id';
                        break;
                    case "密钥有效期":
                        this.order_by = 'token_invalid_time';
                        break;
                    default:
                        this.order_by = '';
                }
                this.sort = val.order==='descending'?'desc':'asc';
                this.init();
            },
            export_account(){
                let params = clone(this.totalData);
                delete params.page;
                delete params.pageSize;
                this.$http(api_down_ebay_account,params).then(res=>{
                    let url = config.apiHost+'downloadFile/downExportFile';
                    let params = {
                        file_code:res.file_code,
                        page:this.totalData.page,
                        pageSize:this.totalData.pageSize,
                    };
                    downloadFile({
                        url:url,
                        get:params,
                        fileName:res.file_name,
                        suffix:'.xls',
                    });
                }).catch(code=>{
                    console.log(code);
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('exportAccount', false);
                    }, 300)
                })
            },
            init_status_btn(){
                let curBtn = this.userStatus;
                this.userStatus = [];
                this.$nextTick(()=>{
                    this.userStatus = curBtn;
                })
            },
            //打开添加表单
            add_form(){
                this.addVisable=true;
            },
            //修改数据数量
            handle_size_change(val) {
                this.totalData.pageSize=val;
                this.init();
            },
            //跳转页
            handle_current_change(val) {
                this.totalData.page=val;
                this.init();
            },
            //修改启用 禁用条件
            btnSelect(index){
               this.totalData.is_invalid=this.userStatus[index].status
               this.init()
            },
            log_form(row){   //-日志
                this.$http(api_ebay_account_log,row.id).then(res => {
                    this.title=`账号简称:${row.code}的操作日志`;
                    this.logDialog=true;
                    this.logForm=res
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message||code,
                    });
                });
            },
            //搜索
            seach(){
                this.init()
            },
            clear_search(){
              this.totalData.snText= "";
              this.totalData.snType= 'account_name';
              this.totalData.server_name = '';
              this.init();
            },
            //修改授权状态
            change_author(val){
            this.totalData.token_valid_status=val;
                this.init()
            },
            //查看站点
            change_site(val){
                this.totalData.site_id=val;
                this.init()
            },
            //初始调用数据
            init(){
                this.tableData=[];
                this.loading=true;
                let params = clone(this.totalData);
                params.snText = params.snText.trim();
                this.order_by&&this.$set(params,'order_by',this.order_by);
                this.sort&&this.$set(params,'sort',this.sort);
                params.start_time?params.start_time = datef('YYYY-MM-dd', params.start_time / 1000):'';
                params.end_time?params.end_time = datef('YYYY-MM-dd', params.end_time / 1000):'';
                this.$http(account_ebay,params).then(result=>{
                    this.total=result.count;
                    this.tableData=result.data.map(item=>{
                            if(!item.site_id instanceof Array){
                                item.site_id=[item.site_id];
                            }
                            item.is_invalid=item.is_invalid?true:false;
                        return  item
                    });
                    this.loading=false;
                    this.firstLoading=false
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
            },

            //编辑完 更新数据
            updata(){
                this.init();
            },
            paypalupdata(){
                this.init();
            },
            refresh(){
              this.init();
            },
            add_update(id,val){
            	this.$set(val,'id',id);
            	this.tableData.unshift(val);
            	this.total++;
            },
            edit_update(id,data){
            	this.tableData.forEach(res=>{
            		if(parseInt(res.id)===parseInt(id)){
                        Object.assign(res,data);
                    }
                });
            },
        },
        components:{
            labelButtons,
            addForm,
            dataTable,
            requestButton:require('../../../../global-components/request-button').default,
            editBatch:require('./edit-batch').default,
            logRecord:require('../look-log.vue').default,
        }
    }
</script>
