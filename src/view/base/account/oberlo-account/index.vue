<template>
    <page class="p-index">
        <card-search :search-data="searchData" :clears="clears"
                     :status="status" @search="search"
                     @change-select="change_select"></card-search>
        <permission tag="ElButton"
                    size="mini"
                    type="primary"
                    @click.native="batchSetup"
                    :disabled="selectData.length <= 0"
                    class="mt-xs mb-xs"
                    :route="apis.url_oberlo_batch_set">批量设置</permission>
        <data-table :table-data="tableData"
                    :loading="loading"
                    @search="search"
                    @look-over="look_over"
                    @log-form="log_form"
                    @add-accredit="add_accredit"
                    @size-change="handleSizeChange"
                    @selection-change="selectionChange"
                    @current-change="handleCurrentChange"></data-table>
        <log-record
            v-model="logDialog"
            :log-data="logForm"
            :title="title"
        ></log-record>
        <look-model v-model="lookOver"
                    :title="title"
                    :list-data="listData"
                    :download-list="downloadList"></look-model>
        <edit-model v-model="editData"
                    :title="title"
                    :list-data="listData"
                    :download-list="downloadList"
                    @search="search"></edit-model>
        <add-accredit
                v-model="accreditTion"
                :title="title"
                :indent-impower="indentImpower"
                @submit="search"></add-accredit>
        <!--批量设置-->
        <edit-batch v-model="settingUp"
                    :batch-title="batchTitle"
                    :batch-data="batchData"
                    @set-clich="setClich"></edit-batch>
    </page>
</template>
<style lang="stylus">

</style>
<script>
import {api_oberlo_account,api_oberlo_account_log,api_oberlo_batch_set,url_oberlo_batch_set} from '@/api/oberlo-account';
    export default{
        refresh(){
            this.init(this.isInvalid);
        },
        permission:{
            url_oberlo_batch_set
        },
        data(){
            return{
                searchData:{
                    status:1,
                    site_status:'',         //账号状态
                    time_type:'register',   //时间类型
                    start_time:'', //开始时间
                    end_time:'',	//截止时间
                    seller_id:'', //销售员id
                    customer_id:'',//客服id
                    authorization:'',
                    snType:'code',
                    snText:'',
                    is_authorization:'',
                    taskName:'download_order',
                    taskCondition:'eq',
                    taskTime:'',
                },
                clears:{
                    status:'',
                    site_status:'',         //账号状态
                    time_type:'register',   //时间类型
                    start_time:'', //开始时间
                    end_time:'',	//截止时间
                    seller_id:'', //销售员id
                    customer_id:'',//客服id
                    authorization:'',
                    snType:'code',
                    snText:'',
                    is_authorization:'',
                    taskName:'download_order',
                    taskCondition:'eq',
                    taskTime:'',
                },
                tableData:{
                    data:[],
                    page:1,
                    pageSize:50,
                    count:0,
                },
                loading:false,
                status:[
                    {label:'全部',value:''},
                    {label:'已启用',value:1},
                    {label:'已停用',value:0},
                ],
                isInvalid:'',
                downloadList:[
                    {label:"未启用",value:0},
                    {label: "30分钟", value: 30},
                    {label: "1小时", value: 60},
                    {label: "2小时", value: 120},
                    {label: "3小时", value: 180},
                    {label: "4小时", value: 240},
                    {label: "5小时", value: 300},
                    {label: "6小时", value: 360},
                    {label: "7小时", value: 420},
                    {label: "8小时", value: 480},
                    {label: "9小时", value: 540},
                    {label: "10小时", value: 600},
                    {label: "11小时", value: 660},
                    {label: "12小时", value: 720},
                    {label: "24小时", value: 1440}
                ],
                title:'',
                listData:{},
                indentImpower:{},
                logForm:[],
                logDialog:false,
                settingUp: false,//批量设置弹框开关
                batchTitle: '',//批量设置弹框标题
                batchData:{},//批量设置弹框数据
                selectData:[],//被选中列表
                lookOver:false,
                editData:false,
                accreditTion:false,
            }
        },
        mounted(){
            this.init(this.isInvalid);
        },
        methods:{
            search(){
                this.init(this.isInvalid);
            },
            change_select(select){
                this.isInvalid = this.status[select].value;
                this.init(this.status[select].value);
            },
            selectionChange(val){
                this.selectData = val.map(row=>{
                    return row.id
                });
            },
            init(status){
                let data = clone(this.searchData);
                data.status = status;
                data.start_time?data.start_time = datef('YYYY-MM-dd', data.start_time / 1000):'';
                data.end_time?data.end_time = datef('YYYY-MM-dd', data.end_time / 1000):'';
                this.$set(data,'page',this.tableData.page);
                this.$set(data,'pageSize',this.tableData.pageSize);
                this.loading = true;
                this.$http(api_oberlo_account,data).then(res=>{
                    res.data.forEach(row=>{
                        row.status = row.status === 1 ? true : false;
                    });
                    this.tableData.data = res.data;
                    this.tableData.count = res.count;
                    this.loading = false;
                });
            },
            batchSetup(){
                this.settingUp = true;
                this.batchTitle = "批量设置";
                this.batchData = {
                    status:'',
                    site_status:'',
                    download_order:'',
                    sync_delivery:'',
                    download_listing:''
                }
            },
            setClich(val){
                let params = val;
                this.$set(params,'ids',this.selectData.join(','));
                this.$http(api_oberlo_batch_set,params).then(res=>{
                    this.settingUp = false;
                    this.init();
                    this.$message({type:'success',message: res.message});
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('oberlo_downloadAdd',false);
                    }, 300)
                })
            },
            look_over(row,tit){//---查看,编辑获取数据
                this.listData = {
                    code: row.code,
                    id: row.id,
                    name:row.name,
                    download_order:row.download_order,
                    sync_delivery:row.sync_delivery,
                    download_listing:row.download_listing,
                };
                if(tit==='查看'){
                    this.title = `查看账号 ${row.name}信息`;
                    this.lookOver = true;
                }else {
                    this.title = `编辑账号 ${row.name}信息`;
                    this.editData = true;
                }
            },
            add_accredit(row){//--授权
                this.title = `给账号 ${row.name}授权`;
                this.indentImpower = {
                    id:row.id,
                    token_key:row.token_key
                };
                this.accreditTion = true
            },
            log_form(row){   //-日志
                this.$http(api_oberlo_account_log,row.id).then(res => {
                    this.title=`账号简称:${row.name}的操作日志`;
                    this.logDialog=true;
                    this.logForm=res
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message||code,
                    });
                });
            },
            handleSizeChange(val) {//------------分页
                this.tableData.page = 1;
                this.tableData.pageSize = val;
                this.init(this.isInvalid);
            },
            handleCurrentChange(val) {//------------分页
                this.tableData.page = val;
                this.init(this.isInvalid);
            },
        },
        components:{
            logRecord:require('../look-log.vue').default,
            cardSearch:require('./card-search').default,
            dataTable:require('./data-table.vue').default,
            lookModel:require('./look-model.vue').default,
            editModel:require('./edit-model.vue').default,
            editBatch:require('./edit-batch.vue').default,
            addAccredit:require('./add-accredit.vue').default,
        }
    }
</script>
