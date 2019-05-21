<template>
    <page>
        <search :search-data="searchData"
                :channel-list="channelList"
                :creator-data="creatorData"
                @search="init">
        </search>
        <el-row class="mb-xs mt-xs">
            <el-button type="primary"
                       @click.native="add_account"
                       size="mini">添加账号资料
            </el-button>
            <el-select v-model="status"
                       class="width-sm inline ml-sm"
                       :placeholder="statusPlaceholder"
                       :disabled="!selectedData.length"
                       @change="update_status">
                <el-option v-for="type in statusOptions"
                           :key="type.value"
                           :label="type.label"
                           :value="type.value"
                           :disabled="option_disabled(type)">
                </el-option>
            </el-select>
            <el-select v-model="batchStatus"
                       class="width-sm inline ml-sm"
                       :disabled="!storeDetailStatus.length"
                       @change="change_batch_status">
                <el-option v-for="status in batchStatusArr"
                           :key="status.value"
                           :label="status.label"
                           :value="status.value"
                :disabled="batch_disabled(status)">
                </el-option>
            </el-select>
            <el-button type="primary"
                       size="mini"
                       class="inline ml-sm"
                       @click.native="batch_add">批量添加成员
            </el-button>
        </el-row>
        <table-list :tableData="tableData"
                    :loading="loading"
                    @check="check"
                    @check-detail="check_detail"
                    @sort="sort"
                    @edit="edits"
                    @member="member_management"
                    @size-change="change_size"
                    @page-change="change_page"
                     ref="clearArr">
        </table-list>
        <add-edit-dialog v-model="addEditShow"
                         :channel-list="channelList"
                         :creator-data="creatorData"
                         :title="addEditTitle"
                         :form="form"
                         :flag="flag"
                         @refresh="init">
        </add-edit-dialog>
        <member-management
                :is-loading="memLoading"
                :mem-form="memForm"
                :mdf-title="mdfTitle"
                v-model="memDialog"
                :id="mdfid"
                :channelId="searchData.channel_id"
        ></member-management>
    </page>
</template>

<script>
    import datef from "datef";
    import {api_get_account,api_edit_account,api_updata_account_status,
        api_get_base_account_site_status,api_update_account_status,api_get_account_users} from '@/api/account-information';
    import addEditDialog from './add-edit-dialog';
    import {api_get_channel,api_get_user} from  '@/api/report-channel';
    import memberManagement from '@/view/base/account-information/member-management';
    export default {
        name: "index",
        data() {
            return {
                searchData:{
                    status:'',
                    channel_id:'',
                    site_code:'',
                    snType:'name',
                    snText:'',
                    server_name:'',
                    company_id:'',
                    s_type:1,
                    s_value:'',
                    creator:'',
                    creator_id:'',
                    snDate:'create_time',
                    date_b:'',
                    date_e:'',
                    site_status:''
                },
                channelList:[],
                creatorData:[],
                status:'',
                statusOptions:[
                    {label:'已交接', value:3},
                    {label:'已收回', value:4},
                    {label:'已作废', value:5},
                ],
                batchStatus:'',
                batchStatusArr:[],
                tableData:{
                    list:[],
                    pageSize:50,
                    count:0
                },
                loading:false,
                sorts:{
                    sort_field:'',
                    sort_type:'',//asc,desc
                },
                addEditShow:false,
                addEditTitle:'',
                flag:0,
                form:{
                    channel_id:'',
                    site_code:[],
                    shop_name:'',
                    account_name:'',
                    password:'',
                    account_name_minor:'',
                    password_minor:'',
                    account_code:'',
                    company:'',
                    company_id:'',
                    is_set_company:0,
                    type:'',
                    company_registration_number:'',
                    corporation:'',
                    corporation_identification:'',
                    company_time:'',
                    company_address:'',
                    server_name:'',
                    server_id:'',
                    is_set_server:0,
                    service_type:'',
                    phone:'',
                    phone_id:'',
                    is_set_phone:0,
                    email:'',
                    email_id:'',
                    credit_card:'',
                    credit_card_id:'',
                    collection_msg:[
                        {
                            collection_account:'',
                            collection_type:'',
                            collection_email:'',
                            collection_user:'',
                        }
                    ],
                    account_creator:'',
                    account_creator_id:'',
                    account_create_time:'',
                    status:0,
                    remark:'',
                    current_status:''
                },
                selectedData:[],
                memLoading:false,
                memForm:[],
                mdfTitle:'',
                memDialog:false,
                mdfid:0,
                storeDetailStatus:[],
                selectTempArry:[],
            }
        },
        computed:{
            statusPlaceholder(){
                if(!this.selectedData.length){
                    return '请先选择账号';
                }
            }
        },
        mounted() {
            this.storeDetailStatus=[];
            this.get_channel();
            this.get_creator();
            this.init();
            this.get_account_status();
        },
        methods: {
            get_channel(){
                this.$http(api_get_channel).then(res=>{
                    this.channelList=res;
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            get_creator(){
                this.$http(api_get_user,{snType:"realname",page:1,pageSize:10000,on_job:1}).then(res=>{
                    this.creatorData=res.data.map(creator=>{
                        return {label:creator.realname,value:creator.id}
                    });
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            get_account_status(){
                this.$http(api_get_base_account_site_status).then(res=>{
                    this.batchStatusArr=res.map(row=>{
                        return {label:row.remark,value:row.status};
                    });
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            init(){
                this.loading=true;
                let data=clone(this.searchData);
                data.date_b=this.searchData.date_b?datef('YYYY-MM-dd',this.searchData.date_b):'';
                data.date_e=this.searchData.date_e?datef('YYYY-MM-dd',this.searchData.date_e):'';
                this.$set(data,'page',this.tableData.page);
                this.$set(data,'pageSize',this.tableData.pageSize);
                this.$set(data,'sort_type',this.sorts.sort_type);
                if(this.sorts.sort_field)this.$set(data,'sort_field',this.sorts.sort_field);
                this.$http(api_get_account,data).then(res=>{
                    this.loading=false;
                    res.data.forEach(row=>{
                        this.$set(row,'is_check',false);
                        this.$set(row,'show',false);
                        this.$set(row,'details',[]);
                        this.$set(row,'account_create_time',row.account_create_time?row.account_create_time*1000:'');
                    });
                    this.tableData.list=res.data;
                    this.tableData.pageSize=Number(res.pageSize);
                    this.tableData.page=Number(res.page);
                    this.tableData.count=Number(res.count);
                }).catch( error =>{
                    this.loading=false;
                    error&&this.$message({type:'error', message:error.message||error});
                });
                this.$refs.clearArr.intArr();


            },
            add_account(){
                Reflect.ownKeys(this.form).forEach(key=>{
                    this.form[key]='';
                });
                this.form.site_code=[];
                this.form.is_set_company=0;
                this.form.is_set_server=0;
                this.form.is_set_phone=0;
                this.form.collection_msg=[
                    {
                        collection_account:'',
                        collection_type:'',
                        collection_email:'',
                        collection_user:'',
                    }
                ];
                this.form.status=0;
                this.form.current_status='新增';
                this.addEditTitle='添加账号';
                this.flag=0;
                this.addEditShow=true;
            },
            check(arr){
                this.selectedData=arr;
            },
            check_detail(arr){
                this.storeDetailStatus=[];
                this.storeDetailStatus=arr;
            },
            sort(val){
                this.$set(this.sorts,'sort_type',val.order);
                switch (val.label){
                    case '平台':
                        return this.$set(this.sorts,'sort_field','channel_id');
                    case '账号全称':
                        return this.$set(this.sorts,'sort_field','account_name');
                    default:
                        return this.$set(this.sorts,'sort_field','');
                }
                this.init();
            },
            edits(row){
                this.$http(api_edit_account,row.id).then(res=>{
                    res.account_creator=res.account_creator?res.account_creator:'';
                    res.account_create_time=res.account_create_time*1000;
                    this.form=res;
                    this.$set(this.form,'is_set_company',0);
                    this.$set(this.form,'is_set_server',0);
                    this.$set(this.form,'is_set_phone',0);
                    this.$set(this.form,'service_type',row.server_type_txt);
                    this.$set(this.form,'current_status',row.status_name);
                    this.$set(this.form,'channel_name',row.channel_id);
                    this.$set(this.form,'change_company',false);
                    this.$set(this.form,'change_server',false);
                    this.$set(this.form,'change_phone',false);
                    this.flag=1;
                    this.addEditTitle=`编辑${row.channel_id}账号简称：${row.account_code} 资料信息`;
                    this.addEditShow=true;
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            member_management(row){
                this.mdfid=row.id;
                this.mdfTitle= `账号简称: ${row.account_code}的成员管理`;
                this.memDialog = true;
                this.mem_init(row.id);
            },
            mem_init(id) {
                this.memLoading = true;
                this.memForm = [];
                this.$http(api_get_account_users,{
                    account_id: id,
                    content: ''
                }).then(res => {
                    this.memForm = res;
                    this.memLoading = false;
                }).catch(code => {
                    this.loading = false;
                    console.log(code);
                })
            },
            change_size(size){
                this.$set(this.tableData,'pageSize',size);
                this.init();
            },
            change_page(page){
                this.$set(this.tableData,'page',page);
                this.init();
            },
            update_status(currentStatus){
                if(!currentStatus)return;
                this.$confirm('您将更改账号资料状态，确认此操作吗？', '提示', {
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_updata_account_status, {
                        ids:this.selectedData.map(row=>row.id),
                        status:currentStatus
                    }).then(res=>{
                        this.$message({type:"success",message:res.message || res});
                        this.status='';
                        this.selectedData=[];
                        this.init();
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    });
                }).catch(() => {
                    this.status='';
                    this.$message({type: 'info',message: '已取消操作'});
                });
            },
            option_disabled(item){
                if(this.selectedData.length){
                    let checkedData=this.selectedData.map(row=>row.status_name);
                    if(checkedData.includes('已交接')){
                        if(item.value===3||item.value===5)return true;
                    }else if(checkedData.includes('已回收')){
                        if(item.value===4)return true;
                    }else if(checkedData.includes('已作废')){
                        return true;
                    }else if(checkedData.includes('新增')){
                        if(item.value>=4)return true;
                    }
                }
            },
            change_batch_status(batchStatus){
                if(!batchStatus)return;
                // if(batchStatus===1){
                //     let filter=this.storeDetailStatus.filter(row=>row.site_status==='运营中');
                //     if(filter.length){
                //         this.$message({type:'warning',message:'您选择的数据中包含运营中账号状态，请取消该条数据再点击'});
                //         this.batchStatus='';
                //         return;
                //     }
                // }
                this.$confirm('您将更改账号资料状态，确认此操作吗？', '提示', {
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_update_account_status,{
                        ids:this.storeDetailStatus.map(row=>row.id),
                        status:batchStatus
                    }).then(res=>{
                       // this.$message({type:"success",message:res.message || res});
                        if(res.data.ok==0){
                            this.$message({type:"error",message:res.data.message[0] || res});
                        }else{
                            this.$message({type:"success",message:res.message || res});
                        }

                        this.batchStatus='';
                        this.storeDetailStatus=[];
                        this.init();
                    }).catch( error =>{
                        error&&this.$message({type:'error', message:error.message||error});
                    });
                }).catch(() => {
                    this.batchStatus='';
                    this.$message({type: 'info',message: '已取消操作'});
                });
            },

            batch_disabled(status){
                if(this.storeDetailStatus.length){
                    let detail=this.storeDetailStatus.map(row=>row.site_status);
                    switch (status.value){
                        case 1:
                            if(detail.includes('申诉中')||detail.includes('回收中')||detail.includes('冻结中')){
                                return false;
                            }else {
                                return true;
                            }
                        case 3:
                            if(detail.includes('运营中')||detail.includes('回收中')||detail.includes('申诉中')){
                                return false;
                            }else{
                                return true;
                            }
                        case 4:
                            if(detail.includes('运营中')||detail.includes('回收中')||detail.includes('冻结中')){
                                return false;
                            }else{
                                return true;
                            }
                    }
                }
            },
            batch_add(){
                let channel=[
                    {label:'eBay',value:1},
                    {label:'亚马逊',value:2},
                    {label:'Wish',value:3},
                    {label:'速卖通',value:4},
                ];
                let find=channel.find(row=>row.value===this.searchData.channel_id);
                if(!this.searchData.channel_id)return this.$message({type:'warning',message:'请选择平台'});
                if(!find){
                    return this.$message({type:'warning',message:'目前仅支持eBay，亚马逊，Wish，速卖通四个平台批量添加成员'});
                }
                this.memDialog = true;
                this.mdfid = 0;
                this.memForm = [];
                this.mdfTitle = `给：${find.label} 平台所有账号添加成员`;
            },
        },
        components: {
            search:require('./search').default,
            tableList:require('./table-list').default,
            addEditDialog,memberManagement
        },
    }
</script>

