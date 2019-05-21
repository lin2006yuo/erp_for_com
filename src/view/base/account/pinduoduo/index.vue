<template>
    <page class="p-index">
        <search-data
            :searchData="form"
            :clears="clears"
            @search="search"
            @change-select="change_select"
            @key-word="key_word"></search-data>
        <el-row class="mt-xs mb-xs">
            <el-button size="mini"
                       :disabled="selectData.length <= 0"
                       @click.native="batchSetup"
                       type="primary"
                       class="ml-sm">批量设置</el-button>
        </el-row>
        <table-data :table-data="dataTable"
                    :loading="loading"
                    :first-loading="firstLoading"
                    @save-member="init"
                    @size-change="size_change"
                    @current-change="current_change"
                    @examine-look="examine_look"
                    @edit-compile="edit_compile"
                    @edit-authorization="edit_authorization"
                    @sort-change="sort_change"
                    v-model="handel"
                    @selection-change="selectionChange"></table-data>
        <look v-model="addEditDialog" :title="title"
                  @update="update"
                  :cur-page="curPage"
                  :hiddenId="handel"
                  :form="formData"></look>
        <add-accredit
                :clientid="client_id"
                v-model="authorizaTion"
                :title="title"
                :row="authrow"
                ></add-accredit>
        <check v-model="dialogShow" :title="title" :form="formData"></check>
        <!--批量编辑-->
        <edit-batch v-model="settingUp"
                    :batch-data="batchData"
                    @set-clich="setClich">
        </edit-batch>
    </page>
</template>

<script>
    import {api_pdd_account,api_look_account,api_edit_account,api_update_download} from '@/api/pdd'
    export default {
        data() {
            return {
                authrow:{},
                client_id:'',
                dialogShow:false,
                authorizaTion:false,
                handel:null,
                addEditDialog:false,
                clears:{
                    snType:'account_name',
                    taskName:'download_order',
                    taskCondition:'eq',
                    authorization:'-1',
                    time_type:'register',
                },
                curPage:'add',
                loading:false,
                firstLoading:false,
                title:'',
                form: {
                    status:'',
                    snType:'account_name',
                    snText:'',
                    download_order:'',
                    download_listing:'',
                    sync_delivery:0,
                    taskName:'download_order',
                    taskCondition:'eq',
                    taskTime:'',
                    authorization:'-1',
                    site_status:'',
                    seller_id:'',
                    customer_id:'',
                    time_type:'register',
                    start_time:'',
                    end_time:''
                },
                dataTable: {
                    totalSize: 0,
                    lists: [],
                    page: 1,
                    pageSize: 50,
                    total:0,
                },
                formData:{
                    code:'',
                    name:'',
                    download_order:'',
                    download_listing:'',
                    sync_delivery:'',
                    id:'',
                },
                sort_type:'',
                sort_val:'',
                selectData:[],
                batchData:{},
                settingUp:false
            }
        },
        mounted(){
            this.init()
        },
        methods: {
            key_word(){//----------------输入框文本
                this.form.snText = this.form.snText.replace(/\s*/g,'');
                this.init();
            },
            change_select(){
                this.init();
            },
            search(){
                this.init()
            },
            batchSetup(){
                this.settingUp = true;
                this.batchData = {
                    status:'',
                    site_status:'',
                    download_listing:'',
                    download_order:'',
                    sync_delivery:''
                }
            },
            setClich(val){
                let params = val;
                this.$set(params,'ids',this.selectData);
                this.$http(api_update_download,params).then(res=>{
                    this.init();
                    this.$message({type:'success',message: res.message});
                    this.settingUp = false;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                    console.log(params)
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('downloadAdd',false);
                    }, 300)
                })
            },
            init() {
                let params = this.init_params();
                this.sort_type && (this.$set(params,'sort_type', this.sort_type));//又则添加排序类型
                this.sort_val && (this.$set(params,'sort_val',this.sort_val));
                this.loading = true;
                this.$http(api_pdd_account,params).then(res=>{
                    this.dataTable.lists = res.data;
                    this.dataTable.total=res.count
                    this.dataTable.lists.forEach((row)=>{
                        let time = new Date(row.token_expire_time*1000)
                        let Time =this.toTime(time)
                        this.$set(row,'time',Time)
                    })
                }).catch(code => {
                    console.log(code);
                }).finally(()=>{
                    this.loading = false;
                    this.firstLoading = false
                })
            },
            toTime(time){
                let Y = time.getFullYear() + '-';
                let M = (time.getMonth()+1 < 10 ? '0'+(time.getMonth()+1) : time.getMonth()+1) + '-';
                let D = time.getDate() + ' ';
                return Y+M+D;
            },
            update(){
                Object.keys(this.formData).forEach(key=>{
                    if(typeof this.formData[key] === 'string'){
                        this.formData[key] = this.formData[key].trim();
                    }
                });
                let params = window.clone(this.formData);
                this.$http(api_edit_account,params).then(res => {
                    let find = this.dataTable.lists.find(row=>Number(row.id)===Number(res.data.id));
                    if(!!find) Object.assign(find,res.data);
                    this.addEditDialog = false;
                    this.init();
                    this.$message({type:'success',message:res.message});
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
            },
            init_params(){
                let params = this.form;
                params.start_time=this.form.start_time?datef('YYYY-MM-dd', this.form.start_time/1000):'';
                params.end_time=this.form.end_time?datef('YYYY-MM-dd', this.form.end_time/1000):'';
                this.$set(params,'page',this.dataTable.page);
                this.$set(params,'pageSize',this.dataTable.pageSize);
                let curString = this.form.snText.replace(new RegExp(' ','gm'),'\n');
                let cur = curString.split('\n').filter(row=>!!row);
                if(cur&&cur.length>1){
                    params.snText = cur.map(row=>{
                        return row.trim();
                    });
                }else if(cur&&cur.length===1){
                    params.snText =  cur[0];
                }
                return params
            },
            examine_look(val){
                this.dialogShow = true;
                let name=''
                val.name&&(name=val.name)
                this.title=`查看：${name}账号信息`;
                this.curPage = 'lookOver';
               let url = api_look_account;
               this.get_form_data(url,val.id);
            },
            edit_authorization(val){
                this.title=`给账户：${val.name}授权`;
                this.authorizaTion = true
                this.client_id=val.client_id
                this.authrow=val
            },
            edit_compile(val){
                let name=''
                val.name&&(name=val.name)
                this.title=`编辑：${name}账号信息`;
                this.curPage = 'add';
                this.addEditDialog = true;
               let url = api_look_account;
               this.get_form_data(url,val.id);
            },
            get_form_data(url,id){//统一处理请求
                this.$http(url,id).then(res=>{
                    this.formData = res;
                }).catch(code=>{
                    console.log('code',code)
                });
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
            selectionChange(val){
                this.selectData = val.map(row=>{
                    return row.id
                });
            },
            size_change(size){//分页
                this.dataTable.pageSize = size;
            },
            current_change(page){//分页
                this.dataTable.page = page;
            },
        },
        components:{
            searchData:require('./search-data.vue').default,
            tableData:require('./data-table').default,
            look:require('./look.vue').default,
            addAccredit:require('./add-accredit.vue').default,
            check:require('./check.vue').default,
            editBatch:require('./edit-batch').default,
        }
    }
</script>

<style scoped>

</style>