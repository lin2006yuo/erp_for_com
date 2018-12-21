<template>
    <page class="p-index">
        <search-Data :search-data="searchData"
                     :clears="clears"
                     @change-select="change_select"
                     @selected="selected"
                     @search="search"></search-Data>
        <permission
                tag="ElButton"
                :route="apis.url_wish_add"
                class="mt-xs mb-xs ml-sm"
                type="primary"
                size="mini"
                @click="add_form">添加</permission>
        <el-button size="mini"
                   :disabled="selectData.length <= 0"
                   @click.native="batchSetup"
                   type="primary"
                   class="ml-sm">批量设置</el-button>
            <data-table
                    ref="data_table"
                    :wishData="wishData"
                    :loading="loading"
                    :first-loading="firstLoading"
                    @look-over="look_over"
                    @edit="edit"
                    @author="author"
                    @add-member="add_member"
                    @sort-change="sort_change"
                    @size-change="size_change"
                    @current-change="current_change"
                    @selection-change="selectionChange">
            </data-table>
            <edit v-model="addEditDialog"
                  :add-edit-data="addEditData"
                  :edit-able="editAble"
                  :title="titleName"
                  :cur-page="curPage"
                  @add-update='add_update'></edit>
            <authorize :authorizeData="authorizeData"
                       v-model="authorVisible"
                       @gain_token="gain_token"></authorize>
            <add-member @save="save_member"
                        @cur-delete="cur_delete"
                        v-model="memberDialog"
                        :loading="memberLoading"
                        :data="dataMember"
                        :account-name="accountName"></add-member>
        <edit-batch v-model="settingUp"
                    :batch-title="batchTitle"
                    :batch-data="batchData"
                    @set-clich="setClich"></edit-batch>
    </page>
</template>
<style lang="stylus">
.mt{margin: 10px 0 10px 20px}
.star-red{
    color: red;
}
.star-green{
    color: green;
}
</style>
<script>
    import labelButtons from '../../../../components/label-buttons.vue';
    import dataTable from './data-table.vue'
    import {api_add_member} from '../../../../api/aliexpress';
    import {wish_list,wish_add,wish_look,wish_invalid,wish_check,wish_client,wish_edit,api_refresh_token,api_wish_post_batch_set} from '../../../../api/wish';
    import {url_wish_add} from '../../../../api/wish';
    export default{
        permission:{
            url_wish_add
        },
    	page:{
            devinfo: {
                frontEnd: '徐梦姣 王月如',
                backEnd: '张文宇',
                createTime: '2017-11-27',
                updateTime: '2018-5-25'
            },
        },
        refresh(){
            this.init();
        },
        created(){
            this.init();//-------list列表
        },
        data(){
            return{
                firstLoading: true,
                memberDialog:false,
                memberLoading:false,
                dataMember:[],
                accountName:"",
                loading:true,
                sort_field:'',
                sort_type:'',
                addEditDialog:false,
                authorVisible:false,
                titleName:"",
                editAble:true,
                curPage:'add',
                selectData:[],//被选中列表
                settingUp:false,//批量设置弹框开关
                batchTitle: '',//批量设置弹框标题
                batchData:{},//批量设置弹框数据
                authorizeData:{},
                addEditData:{},
                wishData:{
                    list:[],
                    page:1,
                    pageSize:50,
                    total:0,
                },
                searchData:{
                    authorization:-1,
                    snType:'account_name',
                    snText:'',
                    taskName:'download_order',
                    taskCondition:'eq',
                    taskTime:'',
                },
                clears:{
                    authorization:-1,
                    snType:'account_name',
                    taskName:'download_order',
                    taskCondition:'eq',
                },
            }
        },
        methods:{
            selectionChange(val){
                this.selectData = val.map(row=>{
                    return row.id
                });
            },
            batchSetup(){
                this.settingUp = true;
                this.batchTitle = "批量设置";
                this.batchData = {
                    is_stop:false,
                    is_start:false,
                    download_order:'',
                    sync_delivery:'',
                    download_listing:'',
                    download_health:''
                }
            },
            setClich(val){
                if(val.is_stop === false&&val.is_start === false&&val.download_order === ''&&val.sync_delivery===''&&val.download_listing === ''&&val.download_health === ''){
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
                    this.$set(params,'ids',this.selectData.join(','));
                    this.$http(api_wish_post_batch_set,params).then(res=>{
                        this.init();
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
            look_over(row){
                this.edit_params(false,`查看账号:${row.account_name}`,true,'lookOver');
                this.$http(wish_check,row.id).then(res => {
                    this.addEditData = res
                }).catch(code => {
                    console.log(code);
                })
            },
            edit(row){
                this.edit_params(true,`编辑账号:${row.account_name}`,true,'edit');
                this.$http(wish_check,row.id).then(res => {
                    this.addEditData = res;
                }).catch(code => {
                    console.log(code);
                })
            },
            author(row){
                this.authorVisible = true;
                if (row.is_authorization === 1) {//------------已授权
                    this.authorizeData.code = '';
                    let params = {
                        id:row.id
                    };
                    this.$http(wish_look,params).then(res => {
                        this.$set(this.authorizeData,'id',res[0].client_id);
                        this.$set(this.authorizeData,'client_secret',res[0].client_secret);
                        this.$set(this.authorizeData,'redirect_url',res[0].redirect_url); //新增回调地址
                        this.$set(this.authorizeData,'merchant_id',row.id); //新增row id
                        let dataParam = {
                            client_id:res[0].client_id
                        };
                        this.$http(wish_client,dataParam).then(res => {
                            this.$set(this.authorizeData,'href',res.url);
                        }).catch(code => {
                            this.$message({
                                type: 'error',
                                message: code.message||code,
                            });
                        });
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message||code,
                        });
                    });
                }
                if (row.is_authorization === 0) {//------------------未授权
                    this.authorizeData = {
                        id:"",
                        client_secret:'',
                        redirect_url:'',
                        code:'',
                        href:'',
                        merchant_id:row.id
                    };
                }
            },
            add_member(row){
                this.memberDialog = true;
                this.accountName = row.account_name;
                this.api_add_member({channel_id:3,account_id:row.id});
            },
            //            添加成员
            api_add_member(val){
                this.memberLoading = true;
                this.$http(api_add_member,val).then(res=>{
                    this.memberLoading = false;
                    if (res.length > 0) {
                        this.dataMember = res;
                        this.dataMember.forEach(row=>{
                            row.customer_id = row.customer_id===0?"":row.customer_id;
                            row.info.forEach(res=>{
                                res.seller_id = res.seller_id===0?"":res.seller_id;
                            })
                        });
                    } else {
                        this.dataMember = [];
                        let cur = {
                            id:0,
                            channel_id:3,
                            customer_id:"",
                            account_id:val.account_id,
                            info:[
                                {seller_id:"",warehouse_type:0}
                            ]
                        };
                        this.dataMember.push(cur);
                    }
                }).catch(code=>{
                    setTimeOut(()=>{
                        this.memberLoading = true;
                    },100);
                    console.log(code);
                })
            },
            sort_change(val){
                this.sort_type = val.order==='descending'?'desc':'asc';
                if(!val.column)return;
                switch(val.column.label){
                    case '简称':
                        this.sort_field = 'code';
                        break;
                    case 'wish账户':
                        this.sort_field = 'account_name';
                        break;
                    case '密钥有效期':
                        this.sort_field = 'expiry_time';
                        break;
                    default:
                        this.sort_field = '';
                }
                this.init();
            },
            init_status_btn(){
                let curBtn = this.userStatus;
                this.userStatus = [];
                this.$nextTick(()=>{
                    this.userStatus = curBtn;
                })
            },
            init(){//-------------list列表函数
                this.wishData.list = [];
                this.loading = true;
                let data = clone(this.searchData);
                this.$set(data,'page',this.wishData.page);
                this.$set(data,'pageSize',this.wishData.pageSize);
                data.snText = trim(data.snText);
                if(this.sort_type)this.$set(data,'sort_type',this.sort_type);
                if(this.sort_field)this.$set(data,'sort_field',this.sort_field);
                Object.keys(data).forEach(key=>{
                    if(typeof data[key] === 'string'){
                        data[key] = data[key].trim();
                    }
                });
                this.$http(wish_list,data).then(res => {
                    this.wishData.list = res.data;
                    this.wishData.total = res.count;
                    this.loading = false;
                    this.firstLoading = false
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message||code,
                    });
                })
            },
            selected(){
                this.init();
            },
            search(){
                this.init();
            },
            edit_params(editAble,title,Dialog,curPage){
                this.editAble = editAble;
                this.titleName = title;
                this.addEditDialog = Dialog;
                this.curPage = curPage;
            },
            add_form(){
                this.edit_params(true,'添加账号',true,'add');
                this.addEditData = {
                    shop_name:"",
                    account_name: "",
                    code: "",
                    download_order: "",
                    email: "",
                    email_password: "",
                    merchant_id: "",
                    password: "",
                    phone: "",
                    server_id: "",
                    server_ip: "",
                    sync_delivery: "",
                    download_listing:"",
                    download_health:"",
                }
            },
            size_change(val) {//---------------分页每页显示条数
                this.wishData.page = 1;
                this.wishData.pageSize = val;
                this.init();
            },
            current_change(val) {//------------分页当前页
                this.wishData.page = val;
                this.init();
            },
            change_select(){//----------------更改启用/禁用/全部按钮时的事件
                this.init();
            },
            add_update(val,id){
                if(!val||val.length<=0)return;
                if(!!id){
                    let find = this.wishData.list.find(row=>Number(row.id)===Number(id));
                    console.log(find,'find');
                    if(find)Object.assign(find,val[0]);
                }else{
                    this.wishData.list.unshift(val[0]);
                    this.wishData.total++;
                };
                this.init()
            },
            save_member(){
                this.init();
            },
            cur_delete(){
                this.init();
            },
            gain_token(){
                this.init();//-------list列表
            },
//            snText(){
//                this.searchData.snText = this.searchData.snText.replace(/\s*/g,'')
//            }
        },
        components:{
            labelButtons,
            dataTable,
            searchData:require('./search-data.vue').default,
            edit:require('./edit.vue').default,
            authorize:require('./authorize.vue').default,
            addMember:require('../smt/add-member.vue').default,
            editBatch:require('./edit-batch').default
        }
    }
</script>
