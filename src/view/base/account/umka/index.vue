<template>
    <page>
        <card-search :searchData="form"
                     :clears="clears"
                     @search="search"
                     @change-select="change_select"></card-search>
        <el-row class="mt-xs mb-xs">
            <el-button size="mini"
                       :disabled="selectData.length <= 0"
                       @click.native="batchSetup"
                       type="primary"
                       class="ml-sm">批量设置</el-button>
        </el-row>
        <table-list :table-data="dataTable"
                    :loading="loading"
                    :first-loading="firstLoading"
                    @save-member="init"
                    @selection-change="selectionChange"
                    @size-change="size_change"
                    @current-change="current_change"
                    @examine-look="examine_look"
                    @edit-compile="edit_compile"
                    @edit-authorization="edit_authorization"></table-list>
        <check-info v-model="checkShow" :title="title" :form="check_info"></check-info>
        <edit-info v-model="addEditDialog" :title="title" :form="edit_info" @search="search"></edit-info>
        <add-accredit v-model="accredit_show" :title="title" :info="accredit_info" @search="search"></add-accredit>
        <!--批量编辑-->
        <edit-batch v-model="settingUp"
                    :batch-data="batchData"
                    @set-clich="setClich">
        </edit-batch>
    </page>
</template>

<script>
    import {api_umka_account,api_umka_look,api_update_download} from '@/api/Umka-account'
    export default {
        data() {
            return {
                accredit_show:false,
                check_info:{},
                accredit_info:{},
                edit_info:{},
                checkShow:false,
                addEditDialog:false,
                title:'',
                loading:false,
                firstLoading:false,
                form: {
                    site_status:'',
                    seller_id:'',
                    customer_id:'',
                    time_type:'register',
                    start_time:'',
                    end_time:'',
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
                    authorization:-1,
                    time_type:'register',
                },
                dataTable: {
                    totalSize: 0,
                    lists: [],
                    page: 1,
                    pageSize: 50,
                    total:0,
                },
                selectData:[],
                batchData:{},
                settingUp:false
            }
        },
        mounted(){
            this.init()
        },
        methods: {
            selectionChange(val){
                this.selectData = val.map(row=>{
                    return row.id
                });
            },
            batchSetup(){
                this.settingUp = true;
                this.batchData = {
                    is_invalid:'',
                    site_status:'',
                    sync_listing:'',
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
                this.sort_type && (this.$set(params,'sort_type', this.sort_type));//正则添加排序类型
                this.sort_val && (this.$set(params,'sort_val',this.sort_val));
                this.loading = true
                this.$http(api_umka_account,params).then(res=>{
                    this.dataTable.lists = res.data;
                    this.dataTable.total=res.count
                }).catch(code => {
                    console.log(code);
                }).finally(()=>{
                    this.loading = false;
                    this.firstLoading = false
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
            addAccredit:require('./add-accredit').default,
            editBatch:require('./edit-batch').default,
        }
    }
</script>

<style scoped>

</style>