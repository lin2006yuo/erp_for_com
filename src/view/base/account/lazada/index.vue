<template>
    <page class="p-index">
        <card-search @search="search"
                     :params-data="paramsData"
                     :clears="clears"
                     :site-list="siteList" @submit="init"></card-search>
        <el-button size="mini"
                   :disabled="selectData.length <= 0"
                   @click.native="batchSetup"
                   type="primary"
                   class="mt-xs mb-xs ml-sm">批量设置</el-button>
        <data-table
            :lazadaList="lazadaList"
            :add-edit-site-list="addEditSiteList"
            :loading="loading"
            @save-member="init"
            @look-over="look_over"
            @edit="edit_row"
            @add-member="add_member"
            @cur-delete="cur_delete"
            @sort-change="sort_change"
            @size-change="handleSizeChange"
            @selection-change="selectionChange"
            @current-change="handleCurrentChange">
        </data-table>
        <add-form v-model="addEditVisable"
                  :edit="edit"
                  :title="title"
                  :add-edit-site-list="addEditSiteList"
                  :add-edit-data="addEditData"
                  @add-lazada="add_lazada"></add-form>
        <add-code v-model="code_info"
                  :edit="edit"
                  :title="title"
                  :add-code-form="addCodeForm"></add-code>
        <edit-batch v-model="settingUp"
                    :title="title"
                    :add-edit-data="addEditData"
                    @set-clich="setClich"></edit-batch>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {
    	api_lazada_site,
        api_get_lazada_account,
        api_lazada_account,
        api_put_lazada_account,
        api_get_lazada_download,} from '@/api/lazada';
	export default{
        page:{
            devinfo:{
                frontEnd:'汤敏',
                backEnd:'蓝术术',
                createTime:'2018-5-19',
                updateTime:'2018-5-22'
            }
        },
        refresh(){
            this.init();
        },
		data(){
			return {
                title:'',
                edit:true,
                paramsData:{
                    authorization:'',
                    snType:'account_name',
                    snText:'',
                    taskName:'download_order',
                    taskCondition:'eq',
                    taskTime:'',
                    site:'',
                    site_status:'',
                    seller_id:'',
                    customer_id:'',
                    time_type:'register',
                    start_time:'',
                    end_time:''
                },
                clears:{
                    snType:'account_name',
                    taskName:'download_order',
                    taskCondition:'eq',
                    time_type:'register',
                },
                total:0,
                loading:true,
                addEditVisable:false,
                addEditSiteList:[],
                addEditData:{//添加/编辑/查看
                    code:"",
                    account_name:"",
                    site:'',
                    download_listing:0,
                    download_order:0,
                    sync_delivery:0,
                    merchant_id:'',
                    access_key_id :'',
                    secret_key:'',
                    sync_feedback:0,
                },
                addCodeForm:{
                	href:'',
                },
                lazadaList:{
                    list:[],
                    page:1,
                    pageSize:20,
                    total:0,
                },
                code_info:false,
                sort_field: "",
                sort_type:'',
                selectData:[],
                settingUp:false,
                siteList:[],
            }
		},
        mounted(){
            this.get_site();
        },
        methods:{
            selectionChange(select){
                this.selectData = select.map(row=>{
                    return row.id;
                });
            },
            batchSetup(){
                this.settingUp = true;
                this.title="批量设置";
                this.addEditData = {
                    status:'',
                    site_status:'',
                    download_listing:'',
                    download_order:'',
                    sync_delivery:'',
                }
            },
            setClich(val){
                let params = val;
                this.$set(params,"ids",this.selectData);
                this.$http(api_get_lazada_download,params).then(res=>{
                    this.settingUp = false;
                    this.init();
                    this.$message({type:'success',message: res.message});
                    this.settingUp = false;
                }).catch(code=>{
                    this.$message({type: 'error', message: code.message||code,});
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('downloadAdd',false);
                    }, 300)
                })
            },
            look_over(row){
                this.title=`查看：${row.name}账号信息`;
                this.edit=false;
                let url = api_get_lazada_account;
                this.get_form_data(url,row.id);
            },
            edit_row(row){
                this.title=`编辑：${row.name}账号信息`;
                this.edit=true;
                let url = api_get_lazada_account;
                this.get_form_data(url,row.id);
            },
            get_form_data(url,id){
                this.$http(url,id).then(res=>{
                    this.addEditVisable = true;
                    this.addEditData = res;
                }).catch(code=>{
                    console.log('code',code)
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('addFormLazada',false);
                    }, 300)
                })
            },
            add_member(row){
                this.title=`授权：${row.name}账号信息`;
                this.edit=true;
                this.code_info = true;
                this.addCodeForm = row;
                this.$set(this.addCodeForm,'authorization_code','')
            },
            get_site(){
                this.$http(api_lazada_site).then(res=>{
                    res = res.map(row=>{
                        return {
                            label:row.name,
                            value:row.county_id,
                        }
                    });
                    this.addEditSiteList = clone(res);
                    this.siteList = res;
                    this.siteList.unshift({label:'全部',value:''});
                }).catch(code=>{
                    this.$message({
                        type: 'error',
                        message: code.message||code,
                    });
                })
            },
//          list列表函数
            init(){
                this.loading = true;
                let params = window.clone(this.paramsData);
                this.$set(params,'page',this.lazadaList.page);
                this.$set(params,'pageSize',this.lazadaList.pageSize);
                this.sort_field && (this.$set(params,'sort_field', this.sort_field));
                this.sort_type && (this.$set(params,'sort_type',this.sort_type));
                params.start_time=this.paramsData.start_time?datef('YYYY-MM-dd', this.paramsData.start_time/1000):'';
                params.end_time=this.paramsData.end_time?datef('YYYY-MM-dd', this.paramsData.end_time/1000):'';
                if(params.site === ''){
                    delete params.site;
                }
                this.$http(api_lazada_account,params).then(res => {
                    this.lazadaList.list = res.data;
                    this.lazadaList.total = res.count;
                    this.loading = false
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })
            },
            add_lazada(){
                Object.keys(this.addEditData).forEach(key=>{
                    if(typeof this.addEditData[key] === 'string'){
                        this.addEditData[key] = this.addEditData[key].trim();
                    }
                })
                this.$http(api_put_lazada_account,this.addEditData.id,this.addEditData).then(res=>{
                    this.$message({type: 'success', message: res.message || res});
                    this.addEditVisable = false;
                    let find = this.lazadaList.list.find(row=> Number(row.id)===Number(res.id));
                    if(!!find) Object.assign(res.data,find);
                    this.init();
                }).catch(code=>{
                    this.$message({type:'error', message:code.message || code})
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('addFormLazada',false);
                    }, 300)
                })
            },
            sort_change(val){//------------------ 表格排序
                if (val.column instanceof Object) {
                    let sort_label = val.column.label;
                    switch (sort_label) {
                        case "简称":
                            this.sort_field = "code";
                            break;
                        case "账户名称":
                            this.sort_field = "name";
                            break;
                        case "Lazada账户":
                            this.sort_field = "lazada_name";
                            break;
                        case "站点":
                            this.sort_field = "site";
                            break;
                    }
                    this.sort_type = val.order === "descending" ? "desc" : "asc";
                    this.init();
                }
            },
            cur_delete(){
                this.init();
            },
            handleSizeChange(val) {//------------分页
                this.lazadaList.page = 1;
                this.lazadaList.pageSize = val;
                this.init();
            },
            handleCurrentChange(val) {//------------分页
                this.lazadaList.page = val;
                this.init();
            },
            search(){
                this.init();
            },
        },
		components: {
            cardSearch:require('./card-search.vue').default,
            addCode:require('./add-code.vue').default,
            dataTable:require('./data-table.vue').default,
            addForm:require('./add-form.vue').default,
            editBatch:require('./edit-batch.vue').default,
            searchCard:require('@/components/search-card.vue').default
        }
	}
</script>
