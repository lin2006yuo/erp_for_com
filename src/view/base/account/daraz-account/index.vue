<template>
        <page class="p-index">
            <card-search
                    @search="search"
                    :status="status"
                    :search-data="searchData"
                    :clears="clears"
                    :site-listal="siteListal"
                    @change-select="change_select"></card-search>
            <permission tag="ElButton"
                        size="mini"
                        type="primary"
                        @click.native="batchSetup"
                        :disabled="selectData.length <= 0"
                        class="mt-xs mb-xs"
                        :route="apis.url_daraz_batch_set">批量设置</permission>
            <data-table
                    :table-data="tableData"
                    :loading="loading"
                    @look-over="look_over"
                    @edit="edit"
                    @look-form="look_form"
                    @search="search"
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
                        :site-list="siteList"
                        :download-list="downloadList"
                        @submit="submit"></edit-model>
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
        import {api_daraz_account,api_daraz_account_update,api_change_sites,url_daraz_batch_set,api_daraz_account_log,api_daraz_batch_set} from '@/api/daraz-account';
        export default{
            refresh(){
                this.init(this.isInvalid);
            },
            permission:{
                url_daraz_batch_set
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
                        platform_status:'',
                        snType:'code',
                        snText:'',
                        site:'',
                        authorization:'',
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
                        platform_status:'',
                        snType:'code',
                        snText:'',
                        site:'',
                        authorization:'',
                        taskName:'download_order',
                        taskCondition:'eq',
                        taskTime:'',
                    },
                    status:[
                        {label:'全部',value:''},
                        {label:'已启用',value:1},
                        {label:'已停用',value:0},
                    ],
                    isInvalid:'',
                    loading:false,
                    tableData:{
                        data:[],
                        page:1,
                        pageSize:50,
                        count:0
                    },
                    title:'',
                    logForm:[],
                    lookOver:false,
                    editData:false,
                    logDialog:false,
                    accreditTion:false,
                    listData:{},
                    siteListal:[],
                    siteList:[],
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
                    indentImpower:{
                        id:'',
                        client_id:'',
                        client_secret:'',
                    },
                    settingUp: false,//批量设置弹框开关
                    batchTitle: '',//批量设置弹框标题
                    batchData:{},//批量设置弹框数据
                    selectData:[],//被选中列表
                }
            },
            mounted(){
                this.init(this.isInvalid);
                this.change_sites();
            },
            methods:{
                search(){
                    this.init(this.isInvalid);
                },
                selectionChange(val){
                    this.selectData = val.map(row=>{
                        return row.id
                    });
                },
                change_select(select){
                    this.isInvalid = this.status[select].value;
                    this.init(this.status[select].value);
                },
                init(status){
                    let data = clone(this.searchData);
                    data.status = status;
                    data.start_time?data.start_time = datef('YYYY-MM-dd', data.start_time / 1000):'';
                    data.end_time?data.end_time = datef('YYYY-MM-dd', data.end_time / 1000):'';
                    this.$set(data,'page',this.tableData.page);
                    this.$set(data,'pageSize',this.tableData.pageSize);
                    this.loading = true;
                    this.$http(api_daraz_account,data).then(row=>{
                        row.data.forEach(row=>{
                            row.status = row.status === 1 ? true : false;
                        });
                        this.tableData.data = row.data;
                        this.tableData.count = row.count;
                        this.loading = false;
                    });
                },
                change_sites(){//---获取站点
                    this.$http(api_change_sites).then(res=>{
                        this.siteList = res.map(row=>{
                            return {
                                label:row.site,
                                value:row.site,
                            }
                        });
                        this.siteListal = clone(this.siteList);
                        this.siteListal.unshift({label:'全部',value:''});
                    }).catch(code=>{
                        this.$message({type: 'error', message: code.message||code,});
                    })
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
                    this.$set(params,'ids',this.selectData);
                    this.$http(api_daraz_batch_set,params).then(res=>{
                        this.settingUp = false;
                        this.init();
                        this.$message({type:'success',message: res.message});
                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code});
                    }).finally(()=>{
                        setTimeout(() => {
                            this.$reqKey('daraz_downloadAdd',false);
                        }, 300)
                    })
                },
                look_over(row){//---查看
                    this.title = `查看账号 ${row.code}信息`;
                    this.listData = {
                        code: row.code,
                        id: row.id,
                        site:row.site,
                        name:row.name,
                        download_order:row.download_order,
                        sync_delivery:row.sync_delivery,
                        download_listing:row.download_listing,
                    };
                    this.lookOver = true;
                },
                edit(row){//---编辑
                    this.title = `编辑账号 ${row.code}信息`;
                    this.listData = {
                        code: row.code,
                        id: row.id,
                        site:row.site,
                        name:row.name,
                        download_order:row.download_order,
                        sync_delivery:row.sync_delivery,
                        download_listing:row.download_listing,
                    };
                    this.editData = true;
                },
                log_form(row){//---日志
                    this.$http(api_daraz_account_log,row.id).then(res => {
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
                look_form(row){
                    this.addVisable = true;
                    this.title = `查看${row.code}账号`;
                    this.isLook = true;
                    this.id = row.id;
                },
                init_params(){
                    let curBtn = this.status;
                    this.status = [];
                    this.$nextTick(()=>{
                        this.status = curBtn;
                    })
                },
                submit(row){
                    this.$http(api_daraz_account_update,row.id,this.listData).then(res=>{
                        this.$message({type: 'success', message: res.message || res});
                        this.init(this.isInvalid);
                        this.editData = false;
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    }).finally(()=>{
                        setTimeout(() => {
                            this.$reqKey('listUser', false);
                        }, 300)
                    });
                },
                add_accredit(row){//---编辑
                    this.title = `给账号 ${row.name}授权`;
                    this.indentImpower = {
                        id:row.id,
                        api_user:row.api_user,
                        api_key:row.api_key,
                        seller_id:row.seller_id,
                        shop_name:row.shop_name
                    },
                    this.accreditTion = true
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
                cardSearch: require("./card-search.vue").default,
                dataTable: require("./data-table.vue").default,
                lookModel:require('./look-model.vue').default,
                editModel:require('./edit-model.vue').default,
                addAccredit:require('./add-accredit.vue').default,
                logRecord:require('../look-log.vue').default,
                editBatch:require('./edit-batch.vue').default
            }
        }
    </script>
