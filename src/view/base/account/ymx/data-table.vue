<template>
    <el-row class="p-ymx-table">
        <div>
            <el-table v-resize="{height:41}" :data="ymxList"
                      @sort-change="sort_change"
                      highlight-current-row v-loading="loading"
                      element-loading-text="玩命加载中..."
                      @selection-change="selectionChange">
                <div slot="empty" class="no-data-reminder">
                    <i></i>
                    {{emptyText}}
                </div>
                <el-table-column
                        type="selection"
                        width="40">
                </el-table-column>
                <el-table-column inline-template label="简称" sortable>
                    <ui-tip :content="row.code" :width="98" v-copy></ui-tip>
                </el-table-column>
                <el-table-column inline-template label="亚马逊账户" sortable>
                    <ui-tip :content="row.account_name" :width="98" v-copy></ui-tip>
                </el-table-column>
                <el-table-column inline-template label="站点" align="center" sortable>
                    <div>{{row.site}}</div>
                </el-table-column>
                <el-table-column label="数据同步" align="center" inline-template>
                    <div v-if="row.status=='1'">
                        <span>
                            <span class="succeed"
                                  v-if="parseInt(row.download_order)>0"
                                  :title="`远程订单${row.download_order}分钟抓取一次`"></span>
                            <span v-else class="default" title="同步远程订单已关闭"></span>
                        </span>
                        <span>
                            <span class="succeed_sync"
                                  v-if="parseInt(row.sync_delivery)>0"
                                  :title="`发货状态${row.sync_delivery}分钟同步一次`"></span>
                            <span v-else class="default_sync" title="同步发货状态未开启"></span>
                        </span>
                        <span>
                            <span class="succeed-download-listing"
                                  v-if="parseInt(row.download_listing)>0"
                                  :title="`远程刊登数据${row.download_listing}分钟抓取一次`"></span>
                            <span  class="default-download-listing" v-else title="同步远程刊登数未开启"></span>
                        </span>
                        <span>
                            <span class="succeed-sync-feedback"
                                  v-if="parseInt(row.sync_feedback)>0"
                                  :title="`同步中差评${row.sync_feedback}分钟同步一次`"></span>
                            <span class="default-sync-feedback" v-else title="同步中差评功能未开启"></span>
                        </span>
                        <span>
                            <span class="succeed-sync-health"
                                  v-if="row.download_health>0"
                                  :title="`健康数据${row.download_health/60}小时同步一次`"></span>
                            <span class="default-sync-health"
                                  title="同步健康数据功能未开启"
                                  v-else></span>
                        </span>
                    </div>
                    <div v-else>
                        <span class="default" title="同步远程订单未开启"></span>
                        <span class="default_sync" title="同步发货状态未开启"></span>
                        <span class="default-download-listing" title="同步远程刊登数据未开启"></span>
                        <span class="default-sync-feedback" title="同步中差评功能未开启"></span>
                        <span class="default-sync-health" title="同步健康数据功能未开启"></span>
                    </div>
                </el-table-column>
                <el-table-column  label="亚马逊状态" align="center"  inline-template  >
                    <div :class="parseInt(row.is_invalid)===0?'sucStatus':'loseStatus'">
                        {{row.is_invalid|filterStatus}}</div>
                </el-table-column>

                <el-table-column inline-template  label="系统状态" align="center">
                    <div>
                        <el-switch :key="row.code"
                                   v-model="row.status"
                                   :on-text="status[0]"
                                   on-color="#20a0ff"
                                   :off-text="status[1]"
                                   off-color="#C0CCDA"
                                   @change="changStatus(row)">
                        </el-switch>
                    </div>
                </el-table-column>

                <el-table-column label="有效邮箱" align="center"  inline-template>
                    <div>
                        <!--TODO 绑定邮箱没有做权限 暂无接口-->
                        <bind-email  :bindData="bindData"
                                     :change_bind="add_bind_data"
                                     :account_name="row.account_name"
                                     :del_data="del_bind_data"></bind-email>
                    </div>
                </el-table-column>
                <el-table-column label="操作" inline-template align="center" width="220">
                    <div>
                        <permission
                                tag="span"
                                :route="apis.url_ymx_check"
                                class="operate"
                                @click="lookOver(row)">查看</permission>
                        <permission tag="span"
                                    :route="apis.url_ymx_check">&nbsp;|&nbsp;</permission>
                        <permission
                                tag="span"
                                :route="apis.url_ymx_edit"
                                class="operate"
                                @click="compile(row)">编辑</permission>
                        <permission
                                tag="span"
                                :route="apis.url_ymx_edit">&nbsp;|&nbsp;</permission>
                        <permission
                                tag="span"
                                :route="apis.url_add_member"
                                class="operate"
                                @click="add_member(row)">添加成员</permission>
                        <permission
                                tag="span"
                                :route="apis.url_ymx_edit">&nbsp;|&nbsp;</permission>
                        <permission
                                tag="span"
                                :route="apis.url_get_notice_info"
                                class="operate"
                                @click="notice_info(row)">通知</permission>
                    </div>
                </el-table-column>
            </el-table>
        </div>
        <edit :editData="editData"
              :title='titleName'
              :add-edit-site-list="addEditSiteList"
              :action="action"
              v-model="editVisible"
              @edit_ymx='edit_ymx'>
        </edit>
        <authorize :authorizeData="authorizeData"
                   v-model="authorVisible">
        </authorize>
        <add-member v-model="memberDialog"
                    :loading="memberLoading"
                    :data="dataMember"
                    :account-name="accountName">
        </add-member>
    </el-row>
</template>
<style lang="stylus">
    .p-ymx-table{
        .el-table__body-wrapper{
            overflow-x: hidden;
        }
        .el-table .cell{
            line-height: normal;
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
            background: url('../../../../assets/icon_all.png') no-repeat 0 -1325px;
        }
        .default_sync{
            padding: 4px 12px;
            background: url('../../../../assets/icon_all.png') no-repeat 0 -1351px;
        }
    }
</style>
<script>
    import  bindEmail from  '../ebay/bind-email.vue'
    import  authorize from './authorize.vue'
    import edit from './edit.vue'
    import {ymx_check,ymx_edit,ymx_status} from '../../../../api/ymx';
    import {url_ymx_check,url_ymx_edit,url_get_notice_info} from '../../../../api/ymx';
    import {api_add_member,url_add_member} from '../../../../api/aliexpress';
    export default{
        permission:{
            url_ymx_check,
            url_ymx_edit,
            url_add_member,
            url_get_notice_info
        },
        data(){
            return{
                showManage:false,
                account:{},
                titleName:'',
                authorVisible:false,
                editVisible:false,
                status:["启用","停用"],
                authorizeData:{
                    id:"",
                    psd:"",
                    author:""
                },
                editData:{},
                bindData:[{
                    name:"",
                    email:"",
                    indexemail:"",
                    status:"未验证",
                    username:"",
                    psd:"",
                    emailserver:"",
                    serverport:"",
                    encode:'选项1'
                }],
                memberDialog:false,
                accountName:"",
                dataMember:[],
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
                this.$emit('sort-change',val);
            },
            notice_info(row){//----------通知
                this.$emit('notice-info', row)
            },
            lookOver(row){//-----------------------查看
                this.editVisible = true;
                this.action.name = 'view';
                this.action.label = '查看';
                this.titleName = `${this.action.label}账户：${row.account_name} 信息`;
                this.$http(ymx_check,row.id).then(res=>{
                    this.editData = res[0];
                }).catch(code=>{
                    this.$message({
                        type: 'error',
                        message: code.message||res,
                    });
                })
            },
            compile(row){//-------------------------------编辑
                this.editVisible = true;
                this.action.name = 'edit';
                this.action.label = '编辑';
                this.titleName = `${this.action.label}账户：${row.account_name} 信息`;
                this.$http(ymx_edit,row.id).then(res=>{
                        this.editData = res[0];
                }).catch(code=>{
                    this.$message({
                        type: 'error',
                    message: code.message||code,
                });
                })
            },
            edit_ymx(id,params){//----------------编辑
                this.ymxList.forEach(res=>{
                    if(res.id === id){
                        res.code = params.code;
                        res.site = params.site;
                        res.download_order = params.download_order;
                        res.sync_delivery = params.sync_delivery;
                        res.download_listing = params.download_listing;
                        res.sync_feedback = params.sync_feedback;
                        res.developer_access_key_id = params.developer_access_key_id;
                        res.developer_secret_key = params.developer_secret_key;
                        res.auth_token = params.auth_token;
                    }
                });
                this.$emit('save-member')
            },
//           开启授权
            author(id){
                this.authorVisible = true;

            },
//            更新
            UpdateInform(id){

            },
            changStatus(row){//-----------------------修改启用或禁用事件
                let statusTitle = row.status ? '停用' : '启用';
                this.$confirm('您将'+statusTitle+row.account_name+'，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false,
                }).then(() => {
                    let status = row.status ? 1 : 0;
                    let params = {
                        id:row.id,
                        status:status
                    };
                    this.$http(ymx_status,params).then(res=>{
                        this.$message({
                            type: 'success',
                            message: res.message||res
                        });
                        this.$emit('edit_ymx')
                    }).catch(code=>{
                        this.$message({
                            type: 'error',
                            message: code.message||code,
                        });
                        this.$emit('edit_ymx')
                    })
                }).catch((code) => {
                    this.$message({
                        type: 'info',
                        message: '已取消'+statusTitle
                    });
                    row.status = !row.status
                });
            },
            add_bind_data(val){
                this.bindData = val;
            },
            del_bind_data(val){
                this.bindData = val;
            },
//            添加成员事件
            add_member(row){
                this.memberDialog = true;
                this.accountName = row.account_name;
                this.api_add_member({channel_id:2,account_id:row.id});
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
                            channel_id:2,
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
        },
        filters:{
            filterStatus(value){
                return parseInt(value)?'失效':'有效';
            },
            filterSite(val){
                switch (val){
                    case 'CA':
                        return '加拿大';
                    break;
                    case 'US':
                        return '美国';
                    break;
                    case 'DE':
                        return '德国';
                        break;
                    case 'ES':
                        return '西班牙';
                        break;
                    case 'FR':
                        return '法国';
                        break;
                    case 'IT':
                        return '意大利';
                        break;
                    case 'JP':
                        return '日本';
                        break;
                    case 'UK':
                        return '英国';
                        break;
                }
            }
        },
        props:{
            ymxList:{
                required:true,
                type:Array
            },
            loading:{
                required:true,
                type:Boolean
            },
            addEditSiteList:{
                required:true,
                type:Array
            },
            firstLoading: {
                required: true,
                type: Boolean
            }
        },
        components:{
            bindEmail,
            authorize,
            edit,
            userManage:require('../user-manage.vue').default,
            addMember:require('../smt/add-member.vue').default,
            uiTip:require('../../../../components/ui-tip.vue').default
        }
    }
</script>
