<template>
    <el-row class="p-wish-table">
        <div>
            <el-table
                    v-resize="{height:41}"
                    :data="joomList"
                    v-loading="loading"
                    highlight-current-row
                    @sort-change="sort_change"
                    element-loading-text="玩命加载中..."
                    @selection-change="selectionChange">
                <el-table-column
                        type="selection"
                        width="40">
                </el-table-column>
                <div slot="empty" class="no-data-reminder">
                    <i></i>
                    {{emptyText}}
                </div>
                <el-table-column label="平台店铺" inline-template sortable>
                    <div>
                        <ui-tip :content="row.shop_name" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="店铺简称" inline-template sortable>
                    <div>
                        <ui-tip :content="row.code" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="平台账号" inline-template sortable>
                    <div>
                        <ui-tip :content="row.account_name" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="账号简称" inline-template sortable>
                    <div>
                        <ui-tip :content="row.account_code" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="密钥有效期" align="center" inline-template sortable>
                    <span>{{filterTime(row.expiry_time)}}</span>
                </el-table-column>
                <el-table-column label="数据同步" align="center" inline-template>
                    <div >
                        <span class="succeed"
                              v-if="row.is_invalid && row.download_order>0"
                              :title="`远程订单${row.download_order}分钟抓取一次`"></span>
                        <span class="default" v-else title="抓取Joom订单功能已关闭"></span>

                        <span class="succeed-sync-delivery"
                              v-if="row.is_invalid && row.sync_delivery>0"
                              :title="`同步发货${row.sync_delivery}分钟同步一次`"></span>
                        <span class="default-sync-delivery"
                              v-else
                              title='同步发货状态未开启'></span>

                        <span class="succeed-download-listing"
                              v-if="row.is_invalid && row.download_listing>0"
                              :title="`远程刊登数据${row.download_listing}分钟抓取一次`"></span>
                        <span class="default-download-listing"
                              v-else
                              title='抓取远程刊登数据未开启'></span>
                    </div>
                </el-table-column>
                <el-table-column  label="joom状态" align="center"  inline-template>
                    <div :class="row.joom_enabled===1?'sucStatus':'loseStatus'">
                        {{row.joom_enabled|filterStatus}}</div>
                </el-table-column>
                <el-table-column inline-template  label="系统状态" align="center">
                    <permission tag="ElSwitch"
                                :route="apis.url_joom_shop_status"
                                :key="`${row.id}a`"
                                v-model="row.is_invalid"
                                :on-text="status[0]"
                                :off-text="status[1]"
                                @change="chang_status(row)"></permission>
                </el-table-column>
                <el-table-column inline-template
                                 label="操作"
                                 inline-template
                                 align="center"
                                 width="220">
                    <div>
                        <permission
                                tag="span"
                                :route="apis.url_joom_shop_look"
                                class="operate"
                                @click="lookOver(row)">查看</permission>
                        <permission
                                tag="span"
                                :route="apis.url_joom_shop_look">&nbsp;|&nbsp;</permission>
                        <permission
                                tag="span"
                                :route="apis.url_joom_shop_edit"
                                class="operate"
                                @click="compile(row)">编辑</permission>
                        <permission
                                tag="span"
                                :route="apis.url_joom_shop_edit">&nbsp;|&nbsp;</permission>
                        <permission
                                tag="span"
                                :route="apis.url_joom_shop_authorization"
                                class="operate" @click="author(row)">
                            {{row.is_authorization |filterAuthor}}</permission>
                    </div>
                </el-table-column>
            </el-table>
        </div>
        <!--  授权 -->
        <authorize :authorizeData="authorizeData"
                   v-model="authorVisible"
                   channel="joom"
                   @gain_token="gain_token"></authorize>
        <edit v-model="editVisible"
              :editData="editData"
              :title="titleName"
              :action="action"
              @add-update-wish='add_update_wish'
              @update-wish='update_wish'></edit>
        <add-member @save="save_member"
                    @cur-delete="cur_delete"
                    v-model="memberDialog"
                    :loading="memberLoading"
                    :data="dataMember"
                    :account-name="accountName"></add-member>
    </el-row>
</template>
<style lang="stylus">
    .p-wish-table{
        .el-table__body-wrapper{
            overflow-x: hidden;
        }
        .sucStatus{
            color:#339907
        }
        .loseStatus{
            color:#ff0000;
        }
        .succeed{
            padding: 4px 12px;
            background: url('../../../../assets/icon_all.png') no-repeat 0 -3468px;
        }
        .default{
            padding: 4px 12px;
            background: url('../../../../assets/icon_all.png') no-repeat 0 -3490px;
        }
        .succeed_sync{
            padding: 4px 12px;
            background: url('../../../../assets/icon_all.png') no-repeat 0 -1324px;
        }
        .default_sync{
            padding: 4px 12px;
            background: url('../../../../assets/icon_all.png') no-repeat 0 -1350px;
        }
    }
</style>
<script>
    import  authorize from '../wish/authorize.vue'
    import  edit from './edit.vue'

    import {api_add_member,url_add_member} from '../../../../api/aliexpress';
    import {
    	api_joom_shop_status,
        api_joom_shop_look,
        api_joom_shop_edit,
        api_joom_shop_authorization,
        api_joom_shop_author_code,
        url_joom_shop_status,
        url_joom_shop_look,
        url_joom_shop_edit,
        url_joom_shop_authorization
    } from '../../../../api/joom';
    export default{
        permission:{
            url_add_member,
            url_joom_shop_status,
            url_joom_shop_look,
            url_joom_shop_edit,
            url_joom_shop_authorization
        },
        data(){
            return{
                showUserManage:false,
                titleName:'',
                authorVisible:false,
                editVisible:false,
                status:["启用","停用"],
                curStatus:false,
                memberData:[],
                authorizeData:{
                    id:"",
                    merchant_id:'',
                    client_secret:'',
                    redirect_url:'',//新增回调地址
                    code:'',
                    href:''
                },
                editData:{},
                account:{},
                memberDialog:false,
                dataMember:[],
                accountName:"",
                memberLoading:false,
                action:{
                    name:'',
                    label:''
                }
            }
        },
        computed:{
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            },
        },
        methods:{
            selectionChange(select){
                this.$emit('selection-change',select)
            },
            sort_change(val){
                this.$emit('sort-change',val)
            },
            gain_token(){
                this.$emit('gain_token')
            },
            lookOver(row){//---------------查看
                this.editVisible = true;
                this.action.name = 'view';
                this.action.label = '查看';
                this.titleName = `${this.action.label}账户：${row.account_name} 信息`;
                this.$http(api_joom_shop_look,row.id).then(res => {
                    this.editData = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message||code,
                    });
                });
            },
            compile(row){//----------------------编辑
                this.editVisible = true;
                this.action.name = 'edit';
                this.action.label = '编辑';
                this.titleName = `${this.action.label}账户：${row.account_name} 信息`;
                this.$http(api_joom_shop_edit,row.id).then(res => {
                    this.editData = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message||code,
                    });
                });
            },
            author(row){//---------------------------开启授权
                this.authorVisible = true;
                if (row.is_authorization === 1) {//------------已授权
                    this.authorizeData.code = '';
                    let params = {
                        id:row.id
                    };
                    this.$http(api_joom_shop_authorization,params).then(res => {
                        this.authorizeData.id = res.client_id;
                        this.authorizeData.client_secret = res.client_secret;
                        this.authorizeData.redirect_url = res.redirect_url;//新增回调地址
                        this.authorizeData.merchant_id = row.id;//新增row id
                        let dataParam = {
                            client_id:res.client_id
                        };
                        this.$http(api_joom_shop_author_code,dataParam).then(res => {
                            this.authorizeData.href = res.url;
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
            //            添加成员事件
            add_member(row){
                this.memberDialog = true;
                this.accountName = row.account_name;
                this.api_add_member({channel_id:3,account_id:row.id});
            },
            save_member(){
                this.$emit("save-member");
            },
            cur_delete(){
                this.$emit("cur-delete");
            },
            add_update_wish(val){
                this.$emit('add-update-wish',val);
            },
            update_wish(id,val){
                this.$emit('update-wish',id,val)
            },
            chang_status(row){//----------------------------更改启用
                this.$confirm('您将修改'+row.account_name+'的状态，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false,
                }).then(() => {
                    let params = {
                        id:row.id,
                        is_invalid:row.is_invalid ?  1 : 0,
                    };
                    this.$http(api_joom_shop_status,params).then(res=>{
                        this.$message({
                            type: 'success',
                            message: res.message||res
                        });
                    }).catch(code=>{
                        this.$message({
                            type: 'error',
                            message: code.message||code,

                        });
                        this.$emit('update_joom')
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消修改'
                    });
                    row.is_invalid=!row.is_invalid
                });
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
            filterTime(val){
                return datef('YYYY-MM-dd HH:mm:ss',val);
            },
        },
        filters:{
            filterStatus(value){
                if (value === 0) {
                    return "失效"
                } else if (value === 1) {
                    return "有效"
                }
            },
            filterAuthor(val){
                if (val === 0) {
                    return "授权"
                } else if (val === 1) {
                    return "已授权"
                }
            },
            filterPercent(value){
                return value+"%"
            },
        },
        props:{
            joomList:{
                required:true,
                type:Array
            },
            loading:{
                required:true,
                type:Boolean
            },
            firstLoading: {
                type: Boolean,
                required: true
            }
        },
        components:{
            authorize,
            edit,
            userManage:require('../user-manage.vue').default,
            addMember:require('../smt/add-member.vue').default,
            uiTip:require('../../../../components/ui-tip.vue').default,
        }
    }
</script>
