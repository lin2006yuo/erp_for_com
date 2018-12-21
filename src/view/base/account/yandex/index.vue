<template>
    <page class="p-index">
        <search-data
                :searchData="form"
                :clears="clears"
                @search="search"
                @change-select="change_select"
                @key-word="key_word"
        ></search-data>
        <div class="mt-xs ml-sm mb-xs">
            <el-button type="primary" size="mini" class="inline" @click.native="add">添加</el-button>
        </div>
        <table-data :table-data="dataTable"
                    :loading="loading"
                    :first-loading="firstLoading"
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
    </page>
</template>

<script>
    import {api_yandex_account,api_look_account,api_edit_account,api_add_account,api_token_account} from '@/api/yandex'
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
                    snText:''
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
            init() {
                let params = this.init_params();
                this.sort_type && (this.$set(params,'sort_type', this.sort_type));//又则添加排序类型
                this.sort_val && (this.$set(params,'sort_val',this.sort_val));
                this.loading = true;
                this.$http(api_yandex_account,params).then(res=>{
                    this.dataTable.lists = res.data;
                    this.dataTable.lists.forEach(row=>{
                        row.status = row.status===0?false:true;
                    });
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
                if(this.handel.includes('add')){
                    this.$set(params,'shop_id',params.id);
                    params.id=0;
                    this.$http(api_add_account,params).then(res => {
                        res.data.status = res.data.status === 1;
                        this.dataTable.lists.unshift(res.data);
                        this.$set(this.dataTable.lists[0],'is_authorization',0);
                        this.dataTable.total ++;
                        this.$message({type:'success',message: res.message});
                        this.addEditDialog = false;
                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code});
                    })
                }else {
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
                }
            },
            add(){
                this.title = '添加yandex账号';
                this.curPage = 'add';
                this.addEditDialog = true;
                this.formData = {
                    code:'',
                    account_name:'',
                    download_order:0,
                    download_listing:0,
                    sync_delivery:0,
                }
                this.handel='add'
            },
            init_params(){
                let params = {
                    page: this.dataTable.page,
                    pageSize: this.dataTable.pageSize,
                    snType: this.form.snType,
                    snText: '',
                    status: this.form.status,
                    taskName:this.form.taskName,
                    taskCondition:this.form.taskCondition,
                    taskTime:this.form.taskTime,
                    authorization:this.form.authorization
                };
                let curString = this.form.snText.replace(new RegExp(' ','gm'),'\n');
                let cur = curString.split('\n').filter(row=>!!row);
                if(cur&&cur.length>1){
                    params.snText = cur.map(row=>{
                        return row.trim();
                    });
                }else if(cur&&cur.length===1){
                    params.snText =  cur[0];
                }

                // this.sort_field && (params.sort_field = this.sort_field);
                // this.sort_by !== '' && (params.sort_by = this.sort_by);
                // this.cardForm.payment_status > -1 && (params.payment_status = this.cardForm.payment_status);
                // this.cardForm.shipped_time > -1 && (params.shipped_time = this.cardForm.shipped_time);
                return params
            },
            examine_look(val){
                let name='';
                val.name&&(name=val.name);
                this.title=`查看：${name}账号信息`;
                this.curPage = 'lookOver';
                this.dialogShow = true;
                let url = api_look_account;
                this.get_form_data(url,val.id);
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
            edit_compile(val,row){
                this.$set(this.formData,'shop_id',val)
                let name=''
                val.name&&(name=val.name)
                this.title=`编辑：${name}账号信息`;
                this.curPage = 'add';
                this.addEditDialog = true;
                let url = api_look_account;
                this.get_form_data(url,row.id);
            },
            get_form_data(url,id){//统一处理请求
                this.$http(url,id).then(res=>{
                    this.formData = res;
                    // this.$set(this.formatDate,'account_name',res.name)
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
                this.form = val.map(row=>{
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
            check:require('./check.vue').default
        }
    }
</script>

<style scoped>

</style>