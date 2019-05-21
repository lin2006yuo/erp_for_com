<template>
    <page >
        <search-module :status-options="searchStatus"
                       :creator-data="creatorData"
                       :search-data="searchData"
                       @search="init"
        ></search-module>
        <el-row class="mb-xs mt-xs ml-sm">
            <el-button type="primary"
                       size="mini"
                       @click="add_account">添加账号注册流程
            </el-button>
        </el-row>
        <table-module :loading="loading"
                      :table-data="tableData"
                      @sort="sort"
                      @look-edit="look_edit"
                      @change-size="change_size"
                      @change-page="change_page">
        </table-module>
        <add-edit-dialog v-model="addEditShow"
                         :title="addEditTitle"
                         :creator-data="creatorData"
                         :form-data="formData"
                         :flag="flag"
                         @refresh="init">
        </add-edit-dialog>
    </page>
</template>

<script>
    import {api_get_account_register_list,api_get_account_register_status,
        api_get_base_info,api_get_register_info,api_get_audit_info,api_get_result_info} from '@/api/account-apply';
    import {api_get_user} from  '@/api/report-channel'
    export default{
        page:{
            devinfo:{}
        },
        refresh(){
            this.init();
        },
        data(){
            return{
                searchStatus:[],
                creatorData:[],
                searchData:{
                    status:'',
                    channel_id:'',
                    site_code:'',
                    snType:'name',
                    snText:'',
                    creator:'',
                    register_id:'',
                    create_time_st:'',
                    create_time_nd:'',
                    sort_field:'',
                    sort_type:''
                },
                loading:false,
                tableData:{
                    list:[],
                    page:1,
                    pageSize:50,
                    count:0
                },
                addEditShow:false,
                addEditTitle:'',
                flag:0,
                formData:{
                    id:0,
                    status:0,
                    status_txt:'新增',
                    create_time:'',
                    register_txt:'',
                    register_id:'',
                    channel_id:'',
                    company_type:'',
                    company_id:'',
                    charter_url:'',
                    register_number:'',
                    company_address:'',
                    corporation:'',
                    corporation_id:'',
                    corporation_id_front:'',
                    corporation_id_contrary:'',
                    corporation_address:'',
                    server_id:'',
                    service_ip:'',
                    register_ip:'',
                    phone_id:'',
                    phone:'',
                    is_fixed_site:0,
                    accounts:[
                        {
                            id:'',
                            account_name:'',
                            password:'',
                            password_type:false,
                            shop_name:'',
                            account_code:'',
                            site_code:'',
                            email_txt:'',
                            email_id:'',
                            credit_card_id:'',
                            credit_card_txt:'',
                            collection_data:[
                                {
                                    collection_account:'',
                                    collection_type:'',
                                    collection_email:'',
                                    collection_name:''
                                }
                            ]
                        }
                    ],
                    audit_data:'',
                    is_kyc:'',
                    main_shop:'',
                    shop_category:'',
                    remark:'',
                    fulfill_time:'',
                    reg_result:''
                },
            }
        },
        mounted(){
            this.get_status();
            this.get_user();
            this.init();
        },
        methods:{
            get_status(){
                this.$http(api_get_account_register_status).then(res=>{
                    this.searchStatus=res;
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            get_user(){
                this.$http(api_get_user,{snType:"realname",page:1,pageSize:10000,on_job:1}).then(res=>{
                    this.creatorData=res.data.map(row=>{
                        return {label:row.realname,value:row.id}
                    })
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            add_account(){
                Object.getOwnPropertyNames(this.formData).forEach(key=>{
                    this.formData[key]='';
                });
                this.formData.accounts=[
                    {
                        id:'',
                        account_name:'',
                        password:'',
                        password_type:true,
                        is_eye:true,
                        shop_name:'',
                        account_code:'',
                        site_code:'',
                        email_txt:'',
                        email_id:'',
                        credit_card_id:'',
                        credit_card_txt:'',
                        collection_data:[
                            {
                                collection_account:'',
                                collection_type:'',
                                collection_email:'',
                                collection_name:''
                            }
                        ]
                    }
                ];
                this.formData.id=0;
                this.formData.status=1;
                this.formData.status_txt='新增';
                this.formData.create_time=Date.now();
                this.formData.is_fixed_site=0;
                this.flag=0;
                this.addEditTitle='添加账号资料';
                this.addEditShow=true;
            },
            init(){
                this.loading = true;
                let data=this.searchData;
                this.$set(data,'page',this.tableData.page);
                this.$set(data,'pageSize',this.tableData.pageSize);
                if(typeof this.searchData.create_time_nd==='object'){
                    data.create_time_nd=datef('YYYY-MM-dd',this.searchData.create_time_nd/1000);
                }
                if(typeof this.searchData.create_time_st==='object'){
                    data.create_time_st=datef('YYYY-MM-dd',this.searchData.create_time_st/1000);
                }
                this.$http(api_get_account_register_list,data).then(res=>{
                    this.loading = false;
                    this.tableData.list = res.data;
                    this.tableData.page=Number(res.page);
                    this.tableData.pageSize=Number(res.pageSize);
                    this.tableData.count = res.count;
                }).catch(code=>{
                    this.loading = false;
                    this.$message({type:"error",message:code.message || code});
                });
            },
            sort(sort){
                let type=sort.order.includes('asc')?'asc':'desc';
                this.$set(this.searchData,'sort_field',sort.prop);
                this.$set(this.searchData,'sort_type',type);
                this.init();
            },
            look_edit(row,number){
                const base=this.$http(api_get_base_info,row.id).then(res=>{
                    return Promise.resolve(res);
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
                const register=this.$http(api_get_register_info,row.id).then(res=>{
                    return Promise.resolve(res);
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
                const audit=this.$http(api_get_audit_info,row.id).then(res=>{
                    return Promise.resolve(res);
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
                const result=this.$http(api_get_result_info,row.id).then(res=>{
                    return Promise.resolve(res);
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
                return Promise.all([base,register,audit,result]).then(([base,register,audit,result])=>{
                    this.flag=number;
                    this.$set(this.formData,'id',row.id);
                    let status;
                    if(row.status<=2){
                        status=row.status+1;
                    }else if(row.status_txt==='注册结果'||row.status_txt==='未触发KYC注册结果'){
                        status=4;
                    }else if(row.status_txt==='已推送/注册完成'||row.status_txt==='已作废'){
                        status=5;
                    }
                    this.$set(this.formData,'status',status);
                    this.$set(this.formData,'status_txt',row.status_txt);
                    this.$set(this.formData,'create_time',row.create_time*1000);
                    this.$set(this.formData,'register_txt',base.register_txt);
                    this.$set(this.formData,'register_id',base.register_id===0?'':base.register_id);
                    this.$set(this.formData,'channel_id',base.channel_id);
                    this.$set(this.formData,'channel_txt',row.channel_txt);
                    this.$set(this.formData,'company_type',base.company_type);
                    this.$set(this.formData,'company_id',base.company_id);
                    this.$set(this.formData,'company_name',row.company_name);
                    this.$set(this.formData,'charter_url',base.charter_url.includes('/upload')?base.charter_url:'');
                    this.$set(this.formData,'register_number',base.company_registration_number);
                    this.$set(this.formData,'company_address',base.company_address_zip);
                    this.$set(this.formData,'corporation',base.corporation);
                    this.$set(this.formData,'corporation_id',base.corporation_identification);
                    this.$set(this.formData,'corporation_id_front',base.corporation_id_front.includes('/upload')?base.corporation_id_front:'');
                    this.$set(this.formData,'corporation_id_contrary',base.corporation_id_contrary.includes('/upload')?base.corporation_id_contrary:'');
                    this.$set(this.formData,'corporation_address',base.corporation_address_zip);
                    this.$set(this.formData,'service_ip',base.server_txt);
                    this.$set(this.formData,'server_id',base.server_id);
                    this.$set(this.formData,'register_ip',base.register_ip);
                    this.$set(this.formData,'phone',base.phone);
                    this.$set(this.formData,'phone_id',base.phone_id);
                    let registerInfo=[];
                    if(!register.accounts.length){
                        registerInfo=[
                            {
                                id:'',
                                account_name:'',
                                password:'',
                                password_type:true,
                                is_eye:true,
                                shop_name:'',
                                account_code:'',
                                site_code:row.channel_txt==='ebay'?'':[],
                                email_txt:'',
                                email_id:'',
                                credit_card_id:'',
                                credit_card_txt:'',
                                collection_data:[
                                    {
                                        collection_account:'',
                                        collection_type:'',
                                        collection_email:'',
                                        collection_name:''
                                    }
                                ]
                            }
                        ]
                    }else{
                        register.accounts.forEach(account=>{
                            this.$set(account,'id',account.id);
                            this.$set(account,'is_eye',false);
                            this.$set(account,'password_type',true);
                            this.$set(account,'is_eye',false);
                            this.$set(account,'password',account.password||'');
                            // this.$set(account,'site_code',row.channel_txt==='ebay'?account.site_code:account.site_code.split(','));
                            if(!account.collection_data.length){
                                account.collection_data=[
                                    {
                                        collection_account:'',
                                        collection_type:'',
                                        collection_email:'',
                                        collection_name:''
                                    }
                                ]
                            }
                        });
                        registerInfo=register.accounts;
                    }
                    this.$set(this.formData,'accounts',registerInfo);
                    this.$set(this.formData,'audit_data',audit.audit_data);
                    this.$set(this.formData,'is_kyc',audit.is_kyc);
                    this.$set(this.formData,'main_shop',audit.main_shop);
                    this.$set(this.formData,'shop_category',audit.shop_category);
                    this.$set(this.formData,'remark',audit.remark);
                    this.$set(this.formData,'audit_data',result.audit_data);
                    this.$set(this.formData,'fulfill_time',result.fulfill_time?result.fulfill_time*1000:'');
                    this.$set(this.formData,'reg_result',result.reg_result===0?'':result.reg_result);
                    this.addEditTitle=`${number===1?'查看':'编辑'}账号注册流程`;
                    this.addEditShow=true;
                });
            },
            change_size(size){
                this.$set(this.tableData,'pageSize',size);
                this.init();
            },
            change_page(page){
                this.$set(this.tableData,'page',page);
                this.init();
            },
        },
        components:{
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
            addEditDialog:require('./add-edit-dialog').default
        }
    }
</script>
