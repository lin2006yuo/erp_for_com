<template>
    <page class="channel-profit">
        <search-module ref="search_module" :searchData="searchData" :clears="clears"
                       @search="search"></search-module>
        <div class="inline mt-xs mb-xs ml-sm">
            <permission tag="ElButton"
                        :route="apis.url_add_account"
                        class="mr-sm"
                        size="mini"
                        type="primary"
                        @click.native="addAccount">添加账号资料
            </permission>
            <el-button type="primary"
                       size="mini"
                       v-for="item in statusOptions"
                       @click.native="updateStatus(item.value)"
                       :key="item.value">{{item.label}}</el-button>
        </div>
        <table-module ref="table_module"
                      :loading="tableLoading"
                      :table-data="tableData"
                      :first-loading="firstLoading"
                      @member-management="member_management"
                      @size-change="size_change"
                      @page-change="page_change"
                      @edit="edit"
                      @sort-change="sort_change"
                      @selectCheck="select">
        </table-module>
        <!--成员管理-->
        <mem-management
                :is-loading="memLoading"
                :mem-form="memForm"
                :mdf-title="mdfTitle"
                v-model="memDialog"
                :id="mdfid"
                @cancel-member="cancel_member"
        ></mem-management>
        <!--添加编辑-->
        <add-edit v-model="addVisiable"
                  :action="action"
                  @submit="submit"
                  :searchData="searchData"
                  :editData="editData">
        </add-edit>
    </page>
</template>
<style lang="stylus">
    .el-input__inner{
        line-height:27px;
    }
</style>
<script>
    import {api_get_channel, api_account_list} from  '../../../api/report-channel'
    import {
        api_edit_account,
        api_updata_account_status,
        api_get_account,
        api_get_account_users,
        api_get_account_basics_changes,
        url_add_account} from '../../../api/account-apply'
    export default{
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'张文宇',
                createTime:'2017-8-26',
                updateTime:'2017-8-28'
            }
        },
        permission:{
            url_add_account
        },
        refresh(){
            this.init();
        },
        data(){
            return{
                firstLoading: true,
                memLoading:false,
                tableLoading:false,
                mdfTitle:'',
                memDialog:false,
                mdfid:0,
                sort_field:'',
                sort_type:'',
                tableData:{
                    list:[],
                    page:1,
                    pageSize:20,
                    count:0
                },
                status:'',
                statusOptions:[],
                searchData:{
                    status:'',
                    channel_id:0,
                    site_code:'',
                    snType:'name',
                    snText:'',
                    snDate:'create_time',
                    server_name:'',
                    creator:'',
                    creator_id:'',
                    date_b:'',
                    date_e:'',
                },
                clears:{
                    channel_id:0,
                    snType:'name',
                    snDate:'create_time',
                },
                checkData:[],
                editData:{
                    register_time:'',
                    channel_id:'',
                    server_type:'',
                    site_code:[],
                    account_code:'',
                    account_show_id:'',
                    use_account_name:'',
                    use_account_id:'',
                    account_name:'',
                    breed:'',
                    password:'',
                    server_id:'',
                    phone:'',
                    email:'',
                    email_password:'',
                    company:'',
                    company_registration_number:'',
                    corporation:'',
                    collection_email:'',
                    corporation_identification:'',
                    collection_account:[],
                    company_type:'',
                    vat:'',
                    creator:'',
                    creator_id:'',
                    company_time:'',
                    company_address:'',
                    account_creator_name:'',
                    account_creator:'',
                    account_create_time:'',
                    status:0,
                    initiate_time:'',
                    initiate_man:'',
                    initiate_man_name:'',
                    collection_type:'',
                    corporation_address:'',
                    address_billing:'',
                    grant_receipt:'',
                    fulfill_time:'',
                    has_initiate:true,
                    /*vat_:'',//新增vat
                    reMarks:''//新增备注*/
                },
                action:{},
                addVisiable:false,
                memForm:[],
            }
        },
        mounted(){
            this.get_operation_btn();
            this.init();
        },
        methods:{
            get_operation_btn(){
                this.$http(api_get_account_basics_changes).then(res=>{
                    this.statusOptions = res.map(row=>{
                        return {
                            label:row.remark,
                            value:row.status
                        }
                    });
                }).catch(code=>{
                    console.log(code,'code');
                })
            },
            submit(res,id){
                if(res.data&&res.data.length>0){
                    let obj = res.data[0];
                    if(!!id){
                        let find = this.tableData.list.find(row=>Number(row.id)===Number(id));
                        if(find) Object.assign(find,obj);//Object.assign(target, ...sources)
                    }else{
                        this.tableData.list.unshift(obj);
                        this.tableData.count++
                    }
                }
            },
            search(){
                this.init();
            },
            init(){
                this.tableLoading = true;
                let data=clone(this.searchData);
                this.$set(data,'page',this.tableData.page);
                this.$set(data,'pageSize',this.tableData.pageSize);
                if(this.sort_field) this.$set(data,'sort_field',this.sort_field);
                if(this.sort_type) this.$set(data,'sort_type',this.sort_type);
                //处理年月日 YYYY-MM-dd
                data.date_b=this.searchData.date_b?datef('YYYY-MM-dd', this.searchData.date_b/1000):'';
                data.date_e=this.searchData.date_e?datef('YYYY-MM-dd', this.searchData.date_e/1000):'';
                this.$http(api_get_account, data).then(res=>{
                    this.tableLoading = false;
                    this.firstLoading = false;
                    this.tableData.list = res.data;
                    this.tableData.count = res.count;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            },
            member_management(row){
                this.mdfid=row.id;
                this.mdfTitle=row.account_code;
                this.memDialog = true;
                this.mem_init(row.id);
            },
            cancel_member(){

            },
            size_change(size){
                this.tableData.pageSize = size;
                this.init();
            },
            page_change(page){
                this.tableData.page = page;
                this.init();
            },
            mem_init(id) {
                this.memLoading = true;
                let param = {
                    account_id: id,
                    content: ''
                };
                this.$http(api_get_account_users, param).then(res => {
                    this.memForm = res;
                    this.memLoading = false;
                }).catch(code => {
                    this.loading = false;
                    console.log(code);
                })
            },
            sort_change(val){
                this.sort_type = val.order==='ascending'?'asc':'desc';
                switch (val.column.label){
                    case '平台':
                        this.sort_field = 'channel_id';
                        break;
                    case '站点':
                        this.sort_field = 'site_code';
                        break;
                    case '账号全称':
                        this.sort_field = 'account_name';
                        break;
                    case '账号简称':
                        this.sort_field = 'account_code';
                        break;
                    default:
                        this.sort_field = '';
                }
                this.init();
            },
            select(checkData){
                this.checkData = checkData;
            },
            addAccount(){
                this.action = {title:'添加账号资料', value:'add'};
                Object.keys(this.editData).forEach(key=>{
                    this.editData[key] = "";
                });
                this.editData.has_initiate = true;
                this.editData.channel_id = '';
                this.editData.status = 0;
                this.editData.collection_account = [];
                this.addVisiable = true;
            },
            edit(row){
                this.action = {title:`编辑${row.channel_id}账号简称：${row.account_code} 资料信息`, value:'edit'};
                this.$http(api_edit_account, row.id).then(res=>{
                    if(!!res.company_time){
                        res.company_time = res.company_time * 1000;
                    } else {
                        res.company_time = '';
                    }
                    if(!!res.account_create_time){
                        res.account_create_time= res.account_create_time * 1000;
                    }else{
                        res.account_create_time='';
                    }
                    if(!!res.create_time){
                        res.create_time = res.create_time * 1000;
                    } else {
                        res.create_time = '';
                    }
                    if(!!res.fulfill_time){
                        res.fulfill_time= res.fulfill_time * 1000;
                    }else{
                        res.fulfill_time='';
                    }
                    if(!!res.initiate_time){
                        res.initiate_time = res.initiate_time * 1000;
                    } else {
                        res.initiate_time = '';
                    }
                    if(!!res.register_time){
                        res.register_time= res.register_time * 1000;
                    }else{
                        res.register_time='';
                    }
                    if(!!res.update_time){
                        res.update_time= res.update_time * 1000;
                    }else{
                        res.update_time='';
                    }
                    this.editData = res;
                    this.editData.type_status === 1 && (this.editData.status += 1);
                    this.addVisiable = true;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            },
            updateStatus(val){
                let params = {
                    ids:this.checkData,
                    status:val
                };
                if(this.checkData.length<=0)return this.$message({type:'warning',message:'请勾选所要操作的数据'});
                this.$confirm('您将更改账号资料状态，确认此操作吗？', '提示', {
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_updata_account_status, params).then(res=>{
                        this.$message({type:"success",message:res.message || res});
                        this.init(this.searchData);
                        this.checkData.length = 0;
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        },
        computed:{
            statusPlaceholder(){
                if(this.checkData.length<=0){
                    return "请先选择账号";
                }
            }
        },
        components:{
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
            addEdit:require('./add-edit.vue').default,
            memManagement:require('./member-management.vue').default
        }
    }
</script>
