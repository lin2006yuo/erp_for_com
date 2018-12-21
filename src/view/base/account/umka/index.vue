<template>
    <page>
        <card-search :searchData="form"
                     :clears="clears"
                     @search="search"
                     @change-select="change_select"></card-search>
        <div class="mt-xs ml-sm mb-xs">
            <el-button type="primary" size="mini" class="inline" @click.native="add">添加</el-button>
        </div>
        <table-list :table-data="dataTable"
                    :loading="loading"
                    :first-loading="firstLoading"
                    @size-change="size_change"
                    @current-change="current_change"
                    @examine-look="examine_look"
                    @edit-compile="edit_compile"
                    @edit-authorization="edit_authorization"></table-list>
        <check-info v-model="checkShow" :title="title" :form="check_info"></check-info>
        <edit-info v-model="addEditDialog" :title="title" :form="edit_info" @search="search"></edit-info>
        <add-info v-model="add_info" :title="title" @search="search"></add-info>
        <add-accredit v-model="accredit_show" :title="title" :info="accredit_info" @search="search"></add-accredit>
    </page>
</template>

<script>
    import {api_umka_account,api_umka_look} from '@/api/Umka-account'
    export default {
        data() {
            return {
                accredit_show:false,
                add_info:false,
                check_info:{},
                accredit_info:{},
                edit_info:{},
                checkShow:false,
                addEditDialog:false,
                title:'',
                loading:false,
                firstLoading:false,
                form: {
                    status:'',
                    snType:'name',
                    snText:'',
                    taskName:'download_order',
                    taskCondition:'eq',
                    taskTime:'',
                    authorization:-1,
                },
                clears:{
                    snType:'name',
                    taskName:'download_order',
                    taskCondition:'eq',
                    snText:'',
                    authorization:-1,
                },
                dataTable: {
                    totalSize: 0,
                    lists: [],
                    page: 1,
                    pageSize: 50,
                    total:0,
                },
            }
        },
        mounted(){
            this.init()
        },
        methods: {
            add(){
                this.add_info = true;
                this.title= '添加账号';
            },
            examine_look(val){
                let name='';
                val.name&&(name=val.name);
                this.title=`查看：${name}账号信息`;
                this.checkShow = true;
                this.$http(api_umka_look,val.id).then(res=>{
                    this.check_info = res
                }).catch(err=>{
                    console.log(err)
                })
            },
            edit_compile(row){
                let name='';
                console.log(row,'edit');
                this.edit_info = JSON.parse(JSON.stringify(row));
                row.name&&(name=row.name);
                this.title=`编辑：${name}账号信息`;
                this.addEditDialog = true;
            },
            edit_authorization(row){
                this.accredit_info = row;
                let name='';
                row.name&&(name=row.name);
                this.accredit_show = true;
                this.title=`给账号：${name}授权`;
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
                this.loading = true
                this.$http(api_umka_account,params).then(res=>{
                    this.dataTable.lists = res.data;
                    this.dataTable.lists.forEach(row=>{
                        row.is_invalid = row.is_invalid===0?false:true;
                    });
                    this.dataTable.total=res.count
                }).catch(code => {
                    console.log(code);
                }).finally(()=>{
                    this.loading = false;
                    this.firstLoading = false
                })
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
                return params
            },
            size_change(size){//分页
                this.dataTable.pageSize = size;
            },
            current_change(page){//分页
                this.dataTable.page = page;
            },
        },
        components:{
            cardSearch:require('./card-search').default,
            tableList:require('./table-list').default,
            checkInfo:require('./check-info').default,
            editInfo:require('./edit-info').default,
            addInfo:require('./add-info').default,
            addAccredit:require('./add-accredit').default
        }
    }
</script>

<style scoped>

</style>