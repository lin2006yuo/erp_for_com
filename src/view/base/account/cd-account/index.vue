<template>
    <page class="p-index">
        <search-data :searchData="searchData"
                     :clears="clears"
                     @search="search"
                     @change-select="change_select"
                     @key-word="key_word"></search-data>
            <!--<el-button type="primary" size="mini" class="inline" @click.native="add">添加</el-button>-->
        <el-button size="mini"
                   :disabled="selectData.length <= 0"
                   @click.native="batchSetup"
                   type="primary"
                   class="mt-xs mb-xs">批量设置</el-button>
        <table-data :table-data="tableData"
                    :loading="loading"
                    :first-loading="firstLoading"
                    @size-change="size_change"
                    @current-change="current_change"
                    @examine-look="examine_look"
                    @edit-compile="edit_compile"
                    @log-form="log_form"
                    @edit-authorization="edit_authorization"
                    @sort-change="sort_change"
                    @selection-change="selectionChange" @search="search"></table-data>
        <log-record
            v-model="logDialog"
            :log-data="logForm"
            :title="title"
        ></log-record>
        <add-edit v-model="addEditDialog" :title="title"
                  @update="update"
                  :cur-page="curPage"
                  :form="form"></add-edit>
        <add-accredit
                v-model="authorizaTion"
                :title="title"
                :commodity-impower="commodityImpower"></add-accredit>
        <edit-batch v-model="settingUp"
                    :batch-title="batchTitle"
                    :batch-data="batchData"
                    @set-clich="setClich"></edit-batch>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_cd_account,api_look_account,api_add_edit_account,api_add_update_account,api_token_account,api_cd_post_batch_set,api_cd_account_log} from '@/api/cd-account';
    export default {
        data() {
            return {
                firstLoading: true,
                title:'',
                loading:false,
                addEditDialog:false,
                authorizaTion:false,
                curPage:'add',
                searchData:{
                    status:'',
                    site_status:'',         //账号状态
                    time_type:'register',   //时间类型
                    start_time:'', //开始时间
                    end_time:'',	//截止时间
                    seller_id:'', //销售员id
                    customer_id:'',//客服id
                    snType:'account_name',
                    snText:'',
                    taskName:'download_order',
                    taskCondition:'eq',
                    taskTime:'',
                    is_authorization:'',
                },
                clears:{
                    site_status:'',         //账号状态
                    time_type:'register',   //时间类型
                    start_time:'', //开始时间
                    end_time:'',	//截止时间
                    seller_id:'', //销售员id
                    customer_id:'',//客服id
                    snType:'account_name',
                    taskName:'download_order',
                    taskCondition:'eq',
                },
                tableData:{
                    lists:[],
                    page:1,
                    pageSize:50,
                    total:0
                },
                form:{
                    code:'',
                    account_name:'',
                    download_order:0,
                    download_listing:0,
                    sync_delivery:0,
                },
                commodityImpower:{
                    id:'',
                    client_id:'',
                    client_secret:'',
                },
                sort_type:'',
                sort_val:'',
                logForm:[],
                logDialog:false,
                settingUp: false,//批量设置弹框开关
                batchTitle: '',//批量设置弹框标题
                batchData:{},//批量设置弹框数据
                selectData:[],//被选中列表
            }
        },
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
                this.batchTitle = "批量设置";
                this.batchData = {
                    is_invalid:'',
                    site_status:'',
                    is_stop:false,
                    is_start:false,
                    download_order:'',
                    sync_delivery:'',
                    download_listing:'',
                }
            },
            setClich(val){
                    let params = {};
                    if(val.is_stop === true){
                        this.$set(params,'is_invalid',0)
                    }else if(val.is_start === true){
                        this.$set(params,'is_invalid',1)
                    }
                    for(let key in val){
                        if(key !== 'is_stop'&&key !== 'is_start'&&val[key] !== ''){
                            this.$set(params,key,val[key])
                        }
                    }
                    this.$set(params,'ids',this.selectData.join(','));
                    this.$http(api_cd_post_batch_set,params).then(res=>{
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
            change_select(){
                this.init();
            },
            search(){
                this.init();
            },
            key_word(){//----------------出入框
                this.searchData.snText = this.searchData.snText.replace(/\s*/g,'');
                this.init();
            },
            init(){
                this.sort_type && (this.$set(params,'sort_type', this.sort_type));
                this.sort_val && (this.$set(params,'sort_val',this.sort_val));
                this.loading = true;
                this.$http(api_cd_account,this.get_params()).then(res => {
                    res.data.forEach(res=>{
                        res.status = res.status === 1;
                    });
                    this.tableData.lists = res.data;
                    this.tableData.total = res.count;
                }).catch(code => {
                    console.log(code);
                }).finally(()=>{
                    this.loading = false;
                    this.firstLoading = false
                })
            },
            get_params(){
                this.$set(this.searchData,'page',this.tableData.page);
                this.$set(this.searchData,'pageSize',this.tableData.pageSize);
                this.searchData.start_time? this.searchData.start_time = datef('YYYY-MM-dd',  this.searchData.start_time / 1000):'';
                this.searchData.end_time? this.searchData.end_time = datef('YYYY-MM-dd',  this.searchData.end_time / 1000):'';
                return this.searchData;
            },
            update(){
                Object.keys(this.form).forEach(key=>{
                    if(typeof this.form[key] === 'string'){
                        this.form[key] = this.form[key].trim();
                    }
                });
                let params = clone(this.form);
                if(params.hasOwnProperty('id')){//更新
                    this.$http(api_add_edit_account,params).then(res => {
                        let find = this.tableData.lists.find(row=>Number(row.id)===Number(res.data.id));
                        if(!!find) Object.assign(find,res.data);
                        this.addEditDialog = false;
                        this.init();
                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code});
                    })
                }else {
                    this.$http(api_add_update_account,params).then(res => {
                        res.data.status = res.data.status === 1;
                        this.tableData.lists.unshift(res.data);
                        this.tableData.total ++;
                        this.$message({type:'success',message: res.message});
                        this.addEditDialog = false;
                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code});
                    })
                }

            },
            examine_look(res){
                this.title=`查看：${res.account_name}账号信息`;
                this.curPage = 'lookOver';
                this.addEditDialog = true;
                let url = api_look_account;
                this.get_form_data(url,res.id);
            },
            edit_compile(res){
                this.title=`编辑：${res.account_name}账号信息`;
                this.curPage = 'add';
                this.addEditDialog = true;
                let url = api_look_account;
                this.get_form_data(url,res.id);
            },
            get_form_data(url,id){
                this.$http(url,id).then(res=>{
                    this.form = res;
                }).catch(code=>{
                    console.log('code',code)
                });
            },
            edit_authorization(res){
                this.title=`给账户：${res.account_name}授权`;
                this.authorizaTion = true;
                this.$http(api_token_account,res.id).then(res=>{
                    Object.assign(this.commodityImpower,res);
                })
            },
            log_form(row){   //-日志
                this.$http(api_cd_account_log,row.id).then(res => {
                    this.title=`账号简称:${row.account_name}的操作日志`;
                    this.logDialog=true;
                    this.logForm=res
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message||code,
                    });
                });
            },
            add(){
                this.title = '添加CD账号';
                this.curPage = 'add';
                this.addEditDialog = true;
                this.form = {
                    code:'',
                    account_name:'',
                    download_order:0,
                    download_listing:0,
                    sync_delivery:0,
                }
            },
            sort_change(val){//------------------ 表格排序
                if (val.column instanceof Object) {
                    let sort_label = val.column.label;
                    switch (sort_label) {
                        case "简称":
                            this.sort_type = "code";
                            break;
                        case "账户名称":
                            this.sort_type = "account_name";
                            break;
                    }
                    this.sort_val = val.order === "descending" ? "2" : "1";
                    this.init();
                }
            },
            size_change(size){
                this.tableData.pageSize = size;
            },
            current_change(page){
                this.tableData.page = page;
            },
        },
        components: {
            searchData:require('./search-data.vue').default,
            tableData:require('./table-data').default,
            addEdit:require('./add-edit.vue').default,
            addAccredit:require('./add-accredit.vue').default,
            editBatch:require('./edit-batch').default,
            logRecord:require('../look-log.vue').default,
        }
    }
</script>
