<template>
    <page class="p-index">
        <search-data
                :searchData="form"
                :clears="clears"
                @search="search"
                @change-select="change_select"
                @key-word="key_word"
        ></search-data>
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
                  :form="formData"></look>
        <add-accredit
                v-model="authorizaTion"
                :title="title"
                :commodity-impower="commodityImpower"></add-accredit>
        <check v-model="dialogShow" :title="title" :form="formData"></check>
        <!--批量编辑-->
        <edit-batch v-model="settingUp"
                    :batch-data="batchData"
                    @set-clich="setClich">
        </edit-batch>
    </page>
</template>

<script>
    import {api_yandex_account,api_look_account,api_edit_account,api_token_account,api_update_download} from '@/api/yandex'
    export default {
        data() {
            return {
                dialogShow:false,
                handel:null,
                addEditDialog:false,
                clears:{
                    snType:'account_name',
                    taskName:'download_order',
                    taskCondition:'eq',
                    time_type:'register',
                },
                curPage:'add',
                loading:false,
                firstLoading:false,
                authorizaTion:false,
                title:'',
                form: {
                    status:'',
                    snType:'account_name',
                    snText:'',
                    taskName:'download_order',
                    taskCondition:'eq',
                    taskTime:'',
                    authorization:'',
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
                commodityImpower:{
                    id:'',
                    client_id:'',
                    client_secret:'',
                },
                formData:{
                    code:'',
                    account_name:'',
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
            batchSetup(){
                this.settingUp = true;
                this.batchData = {
                    is_invalid:'',
                    site_status:'',
                    download_listing:'',
                    download_order:'',
                    sync_delivery:''
                }
            },
            setClich(val){
                let params = val;
                this.$set(params,'ids',this.selectData.join(','));
                this.$http(api_update_download,params).then(res=>{
                    this.init();

                    this.$message({type:'success',message: res.message});
                    this.settingUp = false;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                    console.log(params)
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('downloadAdd', false);
                    }, 300)
                });
            },
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
            init() {
                let params = this.init_params();
                this.sort_type && (this.$set(params,'sort_type', this.sort_type));//又则添加排序类型
                this.sort_val && (this.$set(params,'sort_val',this.sort_val));
                this.loading = true;
                params.start_time=this.form.start_time?datef('YYYY-MM-dd', this.form.start_time/1000):'';
                params.end_time=this.form.end_time?datef('YYYY-MM-dd', this.form.end_time/1000):'';
                this.$http(api_yandex_account,params).then(res=>{
                    this.dataTable.lists = res.data;
                    this.dataTable.total=res.count
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
                this.$delete(params,'is_authorization');
                this.$delete(params,'update_time');
                this.$delete(params,'create_time');
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
            /** 查看 */
            examine_look(val){
                let name = '';
                if (!!val.account_name) {
                    name = val.account_name;                
                } 
                this.title=`查看：${name}账号信息`;
                this.curPage = 'lookOver';
                this.dialogShow = true;
                this.get_form_data(api_look_account,val.id);
            },
            edit_authorization(val){
                if(val.code&&val.account_name.length===0){
                    this.title=`给简称：${val.code}授权`;
                }else {
                    this.title=`给账户：${val.account_name}授权`;
                }
                this.authorizaTion = true;
                this.$http(api_token_account,{id:val.id}).then(res=>{
                    Object.assign(this.commodityImpower,res);
                })
            },
            /** 编辑 */
            edit_compile(val,row){
                this.$set(this.formData,'shop_id',val)
                let name = '';
                if (!!row.account_name) {
                    name=row.account_name;                
                }                
                this.title=`编辑：${name}账号信息`;
                this.curPage = 'add';
                this.get_form_data(api_look_account,row.id);
                this.addEditDialog = true;
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