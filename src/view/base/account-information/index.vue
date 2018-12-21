<template>
    <page class="channel-profit">
        <search-module ref="search_module"
                       :searchData="searchData"
                       :clears="clears" :channel-list="channelList"
                       @search="search"></search-module>
        <div class="inline mt-xs mb-xs ml-sm">
            <el-button type="primary"
                       size="mini"
                       class="mr-sm"
                       @click="addAccount">添加账号资料</el-button>
            <el-select v-model="status"
                       class="width-sm inline"
                       @change="updateStatus"
                       :disabled="checkData.length <= 0"
                       :placeholder="statusPlaceholder">
                <el-option v-for="type in statusOptions"
                           :key="type.value"
                           :label="type.label"
                           :value="type.value">
                </el-option>
            </el-select>
            <el-button type="primary"
                       size="mini"
                       @click.native="batch_add_number"
                       class="inline ml-sm">批量添加成员</el-button>
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
                :channelId="searchData.channel_id"
                @cancel-member="cancel_member"
        ></mem-management>
        <!--添加编辑-->
        <add-edit v-model="addVisiable"
                  :action="action"
                  @submit="submit"
                  @choose-server="choose_server"
                  :server-ip="serverIp"
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
    import {api_edit_account, api_updata_account_status,api_get_account,api_get_account_users} from '../../../api/account-information'
    export default{
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'张文宇',
                createTime:'2017-8-26',
                updateTime:'2017-8-28'
            }
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
                statusOptions:[
                    {label:'已交接', value:3},
                    {label:'已收回', value:4},
                    {label:'已作废', value:5},
                ],
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
                    channel_id:'',
                    site_code:[],
                    account_code:'',
                    account_name:'',
                    password:'',
                    server_id:'',
                    phone:'',
                    email:'',
                    email_password:'',
                    company:'',
                    company_registration_number:'',
                    corporation:'',
                    corporation_identification:'',
                    collection_account:[],
                    vat:'',
                    creator:'',
                    creator_id:'',
                    company_time:'',
                    company_address:'',
                    account_creator_name:'',
                    account_creator:'',
                    account_create_time:'',
                    status:0,
                    email_server_id:'',
                    email_allowed_receive:1,
                    email_allowed_send:1
                },
                action:{},
                addVisiable:false,
                memForm:[],
                channelList:[],
                serverIp: ''
            }
        },
        mounted(){
            this.init();
            this.get_channel();
        },
        methods:{
            get_channel(){
                this.$http(api_get_channel).then(res => {
                    let obj = {label:'全部',value:0};
                    res.unshift(obj);
                    this.channelList = res;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code})
                })
            },
            batch_add_number(){
                let channelIdList = [1,2,3,4];
                if(!this.searchData.channel_id)return this.$message({type:'warning',message:'请选择平台'});
                if(!channelIdList.includes(this.searchData.channel_id))return this.$message({type:'warning',message:'目前仅支持eBay，亚马逊，Wish，速卖通四个平台批量添加成员'});
                this.memDialog = true;
                this.mdfid = 0;
                this.memForm = [];
                this.mdfTitle = `给：${this.channelName} 平台所有账号添加成员`;
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
                this.mdfTitle= `账号简称: ${row.account_code}的成员管理`;
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
                this.memForm = [];
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
                this.editData.channel_id = '';
                this.editData.status = 0;
                this.editData.site_code = [];
                this.editData.collection_account = [];
                this.editData.email_allowed_receive = 1;
                this.editData.email_allowed_send = 1;
                this.addVisiable = true;
                this.serverIp = ''
            },
            edit(row){
                this.serverIp = row.server_ip;
                this.action = {title:`编辑${row.channel_id}账号简称：${row.account_code} 资料信息`, value:'edit'};
                this.$http(api_edit_account, row.id).then(res=>{
                    if(res.company_time){
                        res.company_time = res.company_time * 1000;
                    } else {
                        res.company_time = '';
                    }
                    if(res.account_create_time){
                        res.account_create_time= res.account_create_time * 1000;
                    }
                    this.editData = res;
                    this.addVisiable = true;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            },
            choose_server(ip){
              this.serverIp = ip;
            },
            updateStatus(){
                let params = {
                    ids:this.checkData,
                    status:this.status
                };
                this.$confirm('您将更改账号资料状态，确认此操作吗？', '提示', {
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_updata_account_status, params).then(res=>{
                        this.$message({type:"success",message:res.message || res});
                        this.init(this.searchData);
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
            },
            channelName(){
                if(this.searchData.channel_id){
                    let find = this.channelList.find(row=>row.value===this.searchData.channel_id);
                    if(find)return find.label;
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
