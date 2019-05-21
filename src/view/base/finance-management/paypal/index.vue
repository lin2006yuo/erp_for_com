<template>
    <page class="p-index">
        <card-search :search-data="searchData"
                     :clears="clears"
                     :creator-data="creatorData"
                     :user-status="userStatus"
                     @change-select="changeSelect"
                     :withdrawals-lists="withdrawalsLists"
                     @search="search"></card-search>
        <el-row class="p-event-button ml-sm mt-xs mb-xs">
            <permission
                    tag="ElButton"
                    :route="apis.url_add"
                    v-for="item in operateButtons"
                    :key="item.id"
                    size="mini"
                    type="primary"
                    @click.naive="activeClick(item.action)">{{item.label}}</permission>
            <permission tag="ElButton"
                        size="mini"
                        type="primary"
                        @click.native="batchSetup"
                        :disabled="selected.length <= 0"
                        :route="apis.url_post_batch_set">批量设置</permission>
        </el-row>
        <form-add :add-form="addForm"
                  v-model="showAddForm"
                  :creator-data="creatorData"
                  :withdrawals-list="withdrawalsList"
                  @add-result="add_result"></form-add>
        <!--编辑-->
        <form-mdf v-model="showMdfForm" :title="title"
                  :look-data="lookData"
                  :withdrawals-list="withdrawalsList"
                  :creator-data="creatorData"
                  @mdf-result="mdf_result"></form-mdf>
        <!--查看-->
        <form-look v-model="lookForm" :title="title"
                   :look-data="lookData"
                   :withdrawals-list="withdrawalsList"></form-look>
        <data-table :tables="tables"
                    @look-edit="look_edit"
                    @change-size="change_size"
                    @change-page="change_page"
                    @change-status="change_status"
                    @sort-change="sort_change"
                    @selects="selects"
                    v-loading="isLoading"
                    :first-loading="firstLoading"
                    element-loading-text="玩命加载中..."
                    @authorize="authorize"></data-table>
        <!--批量开启-->
        <edit-batch v-model="settingUp"
                    :batch-title="batchTitle"
                    :batch-data="batchData"
                    @set-clich="setClich"></edit-batch>
        <authorization-dialog v-model="authorizationShow"
                              :title="title"
                              :form="authorForm"
                              @refresh="init('')">
        </authorization-dialog>
    </page>
</template>
<style lang="stylus">
</style>
<script>
    import formAdd from './form-add.vue';
    import formMdf from './form-mdf.vue';
    import dataTable from './data-table.vue';
    import {api_get,api_edit, api_change_status,api_paypal_batch_set,api_withdrawals_type,api_user_staffs} from '@/api/paypal';
    import {url_add,url_post_batch_set,} from '@/api/paypal';
    import authorizationDialog from './authorization-dialog';
    export default{
        permission:{url_add, url_post_batch_set},
        refresh(){
            this.init(this.isInvalid);
        },
        data(){
            return{
                firstLoading:true,
                order_type:'',
                sort:'',
                isInvalid:'',
                showAddForm:false,
                showMdfForm:false,
                lookForm:false,
                mdfID:0,
                isLoading:true,
                addForm:{
                    account_name:'',
                    email_password: '',
                    api_user_name:'',
                    api_secret:'',
                    api_signature:'',
                    rest_client_id:'',
                    rest_secret:'',
                    download_paypal:0,
                    download_dispute:0,
                    download_email:0,
                },
                lookData:{},
                searchData:{
                    operator_id:'',
                    snType:"ip_name",
                    snText:"",
                    type:'',
                    withdrawals_type:'',
                    status:'',
                    is_invalid:'',
                },
                clears:{
                    operator_id:'',
                    snType:"ip_name",
                    snText:"",
                    type:'',
                    withdrawals_type:''
                },
                selected:[],
                operateButtons:[{id:1,label:'添加',action:function(){
                    this.showAddForm = true;}}],
                tables:{
                    lists:[],
                    total:0,
                    page:1,
                    pageSize:50
                },
                userStatus:[
                    {name:"全部",status:''},
                    {name:"启用",status:1},
                    {name:"停用", status:0}
                ],
                settingUp: false,//批量设置弹框开关
                batchTitle: '',//批量设置弹框标题
                batchData:{},//批量设置弹框数据,
                authorizationShow:false,
                title:'',
                authorForm:{},
                creatorData:[],
                withdrawalsList:[],
                withdrawalsLists:[]
            }
        },
        created(){
            this.init(this.isInvalid);
        },
        mounted(){
            this.$http(api_user_staffs).then(res=>{
                this.creatorData=res.map(row=>{
                    return {label:row.realname,value:row.id};
                });
            }).catch(error=>{
                error&&this.$message({type:'error',message:error.message||error})
            });
            this.$http(api_withdrawals_type).then(res=>{
                let ctn = res.data.map(row=>{
                    return {label:row.name,value:row.id};
                });
                this.withdrawalsList = ctn;
                this.withdrawalsLists = [{label:"全部",value:"",disabled:true},...ctn];
            }).catch(error=>{
                error&&this.$message({type:'error',message:error.message||error})
            });
        },
        methods:{
            authorize(row){
                this.authorForm={};
                this.$http(api_edit,row.id).then(res=>{
                    this.title=row.account_name;
                    this.authorForm=res;
                    this.authorizationShow=true;
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            batchSetup(){
                this.settingUp = true;
                this.batchTitle = "批量设置";
                this.batchData = {
                    is_stop:false,
                    is_start:false,
                    download_paypal:0,
                    download_dispute:0,
                    download_email:0,
                }
            },
            setClich(val){
                if(val.is_stop === false&&val.is_start === false&&val.download_paypal === ''&&val.download_dispute === ''){
                    this.$message({type: 'warning',message: '请至少修改一项数据'});
                    this.$reqKey('downloadAdd',false);
                }else{
                    this.settingUp = false;
                    let params = {};
                    if(val.is_stop === true){
                        this.$set(params,'is_invalid',0)
                    }else if(val.is_start === true){
                        this.$set(params,'is_invalid',1)
                    }
                    for(let key in val){
                        if(key !== 'is_stop'&&key !== 'is_start'&&val[key] !== ''){
                            this.$set(params,key,val[key])
                        }
                    }
                    this.$set(params,'ids',this.selected.join(','));
                    this.$http(api_paypal_batch_set,params).then(res=>{
                        this.init(this.isInvalid);
                        this.$message({type:'success',message: res.message});
                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code});
                    }).finally(()=>{
                        setTimeout(() => {
                            this.$reqKey('downloadAdd',false);
                        }, 300)
                    })
                }
            },
            sort_change(val){
                if(!val.column||!val.column.label)return;
                switch (val.column.label){
                    case 'PayPal账户':
                        this.order_type='account_name';
                        break;
                    case '服务器名':
                        this.order_type='ip_name';
                        break;
                    default:
                        this.order_type='';
                }
                this.sort = val.order==='descending'?'desc':'asc';
                this.init(this.isInvalid);
            },
            changeSelect(select){
                this.isInvalid = this.userStatus[select].status;
                this.init(this.userStatus[select].status);
            },
            search(){
                this.init(this.isInvalid);
            },
            clear_search(){
                this.searchData.snType = "account_name";
                this.searchData.snText = "";
                this.init(this.isInvalid);
            },
            init(status){
                let data = window.clone(this.searchData);
                data.is_invalid = status;
                this.order_type&&this.$set(data,'order_type',this.order_type);
                this.$set(data,'page',this.tables.page);
                this.$set(data,'pageSize',this.tables.pageSize);
                this.sort&&this.$set(data,'sort',this.sort);
                this.isLoading = true;
                this.tables.lists = [];
                this.$http(api_get,data).then(succ=>{
                    this.tables.lists = succ.data;
                    this.tables.total = succ.count;
                    this.isLoading = false;
                    this.firstLoading = false
                }).catch(fail=>{
                    console.log(fail);
                    this.isLoading = false;
                });
            },
            activeClick(action){
                action.call(this);
                this.addForm = {
                    ip_address:'',
                    server_id:'',
                    account_name:'',
                    email_password:'',
                    type:'',
                    withdrawals_accounts:[{
                        id:'',
                        account:''
                    }],
                    withdrawals_type:'',
                    belong:'',
                    phone:'',
                    credit_card:'',
                    client:'',
                    operator_id:'',
                    download_paypal: 0,
                    download_dispute: 0,
                    download_email:0,
                }
            },
            add_result(){
                this.init(this.isInvalid)
            },
            mdf_result(){
                this.init(this.isInvalid)
            },
            look_edit(row,string){
                this.$http(api_edit,row.id).then(res=>{
                    this.title = `${string}：${row.account_name} 信息`;
                    this.lookData = {
                        id:row.id,
                        ip_address:row.ip_address,
                        account_name:res.account_name,
                        email_password:res.email_password,
                        type:res.type,
                        withdrawals_accounts:res.withdrawals_accounts,
                        withdrawals_type:res.withdrawals_type,
                        belong:res.belong,
                        phone:res.phone,
                        credit_card:res.credit_card,
                        client:res.client,
                        operator:row.operator,
                        operator_id:Number(res.operator_id),
                        download_paypal: res.download_paypal,
                        download_dispute: res.download_dispute,
                        download_email: res.download_email,
                        server_id:res.server_id
                    };
                    if(!this.lookData.withdrawals_accounts||( !!this.lookData.withdrawals_accounts && !this.lookData.withdrawals_accounts.length)){
                        this.lookData.withdrawals_accounts = [{id:'', account:''}];
                    }
                    if(string==='查看'){
                        this.lookForm = true;
                    }else {
                        this.showMdfForm = true;
                    }
                }).catch(error=>{
                    error&&this.$message({type:'error',message:error.message||error})
                });
            },
            selects(selects){
                this.selected = selects.map(row=>{
                    return row.id
                });
            },
            change_page(page){
                this.tables.page = page;
                this.init(this.isInvalid);
            },
            change_size(size){
                this.tables.pageSize = size;
                let pages = Math.ceil(this.tables.total/size);
                if(pages >= this.tables.page){
                    this.init(this.isInvalid);
                }else{
                    this.change_page(pages)
                }
            },
            change_status(row){
                this.$confirm(`此操作将更改  ${row.account_name}  账号状态, 确定进行此操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false,
                }).then(() => {
                    this.$http(api_change_status, row.id, row.is_invalid ? 0 : 1).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.$nextTick(()=>{
                            row.is_invalid = !row.is_invalid;
                        })
                        if(!!this.isInvalid){
                            let index = this.tables.lists.indexOfFun(function (old) {
                                return old.id === row.id
                            });
                            this.tables.lists.splice(index, 1);
                            this.$set(this.tables,"total",this.tables.total--);
                        }
                    }).catch(fail=>{
                        this.$message({type:"error", message:fail.message||fail})
                        let data = this.tables.lists.find(data=>{
                            return data.id == id;
                        });
                        this.tables.lists.$remove(data);
                    })
                }).catch(()=>{
                    row.is_invalid = !row.is_invalid;
                    this.$nextTick(()=>{
                        row.is_invalid = !row.is_invalid;
                    })
                    this.$message({type:"info", message:"已取消操作"})
                })
            }
        },
        components:{
            dataTable,formAdd,formMdf,authorizationDialog,
            searchCard:require('@/components/search-card.vue').default,
            editBatch:require('./edit-batch').default,
            cardSearch: require("./card-search.vue").default,
            formLook: require("./form-look.vue").default
        }
    }
</script>
