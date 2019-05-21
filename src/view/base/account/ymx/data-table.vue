<template>
    <el-row class="p-ymx-table">
        <div>
            <el-table v-resize="{height:41}" :data="seatchData.ymxList"
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
                <el-table-column width="120" inline-template label="简称" sortable>
                    <ui-tip :content="row.code" :width="98" v-copy></ui-tip>
                </el-table-column>
                <el-table-column inline-template label="亚马逊账户" sortable>
                    <ui-tip :content="row.account_name" :width="98" v-copy></ui-tip>
                </el-table-column>
                <el-table-column width="90" inline-template label="站点" align="center" sortable>
                    <div>{{row.site}}</div>
                </el-table-column>
                <!--<el-table-column width="90" inline-template label="销售员">-->
                    <!--<ui-tip :content="row.seller_name" :width="98" v-copy></ui-tip>-->
                <!--</el-table-column>-->
                <!--<el-table-column width="90" inline-template label="客服">-->
                    <!--<ui-tip :content="row.customer_name" :width="98" v-copy></ui-tip>-->
                <!--</el-table-column>-->
                <el-table-column label="销售员" inline-template>
                    <div class="accout-display">
                       <span v-for="(item,sellerIndex) in row.seller" :class="parseInt(item.on_job)!==1?'loseStatus':''" :key="item.customer_id">
                           {{item.seller_name}}{{sellerIndex<(row.seller.length-1)?',':''}}
                       </span>
                    </div>
                </el-table-column>
                <el-table-column label="客服" inline-template>
                    <div class="accout-display">
                       <span v-for="(item,customerIndex) in  row.customer" :class="parseInt(item.on_job)!==1?'loseStatus':''" :key="item.customer_id">
                           {{item.customer_name}}{{customerIndex<(row.customer.length-1)?',':''}}
                       </span>
                    </div>
                </el-table-column>
                <el-table-column inline-template label="注册日期">
                    <ui-tip :content="row.register_time | filterRegisterTime" :width="98" v-copy></ui-tip>
                </el-table-column>
                <el-table-column inline-template label="交接日期">
                    <ui-tip :content="row.fulfill_time | filterTime" :width="98" v-copy></ui-tip>
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
                <el-table-column width="90" label="亚马逊状态" align="center"  inline-template  >
                    <div :class="parseInt(row.is_invalid)===0?'loseStatus':'sucStatus'">
                        {{row.is_invalid|filterStatus}}</div>
                </el-table-column>
                <el-table-column width="100" label="系统状态" inline-template>
                    <span>{{row.status | filterStatu}}</span>
                </el-table-column>
                <el-table-column width="100" inline-template label="账号状态">
                    <ui-tip :content="row.site_status_str" :width="98" v-copy></ui-tip>
                </el-table-column>
                <el-table-column width="100" label="有效邮箱" align="center"  inline-template>
                    <div>
                        <!--TODO 绑定邮箱没有做权限 暂无接口-->
                        <bind-email  :bindData="bindData"
                                     :change_bind="add_bind_data"
                                     :account_name="row.account_name"
                                     :del_data="del_bind_data"></bind-email>
                    </div>
                </el-table-column>
                <el-table-column label="操作" width="120" inline-template>
                    <trends-select class="inline"
                                   :selects="selects(row)"
                                   @trigger="trigger(row,$event)"
                                   type="primary">
                    </trends-select>
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
        <authorize :editData="editData"
                   v-model="authorVisible"
                   :add-edit-site-list="addEditSiteList"
                   :action="action"
                   :row-id="rowId"
                   @status-change="change_authorize_status"
                   :account-name="accountName">
        </authorize>
        <add-member v-model="memberDialog"
                    :loading="memberLoading"
                    :data="dataMember"
                    :account-name="accountName"
                    @save="$emit('save-member')">
        </add-member>
        <look-log v-model="logVisible" :log-data="logData" :title="titleName"></look-log>
    </el-row>
</template>
<style lang="stylus">
    .p-ymx-table{
        .accout-display{
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
        }
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
    import {ymx_check,ymx_edit,api_amazon_log,
        url_ymx_check,url_ymx_edit,url_get_notice_info,url_amazon_log} from '@/api/ymx';
    import {api_add_member,url_add_member} from '@/api/aliexpress';
    export default{
        permission: {
            url_ymx_check,
            url_ymx_edit,
            url_add_member,
            url_get_notice_info,
            url_amazon_log,
        },
        data(){
            return{
                showManage:false,
                account:{},
                titleName:'',
                currentRow:'',
                rowId:'',
                authorVisible:false,
                editVisible:false,
                permitStatus:"未授权",
                authorizeData:{
                    id:"",
                    psd:"",
                    author:"",
                    authorizeType:0
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
                },
                logVisible:false,
                logData:[],
            }
        },
        computed:{
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            }
        },
        methods:{
            selects(row){
                let is_authorization = row.is_authorization ? '已授权' : '未授权';
                let buttons = [
                    {label:'查看', value:0, apis:'url_ymx_check'},
                    {label:'编辑', value:1, apis:'url_ymx_edit'},
                    {label:is_authorization, value:2, apis:'url_ymx_edit'},
                    {label:'账号负责人', value:3, apis:'url_add_member'},
                    {label:'通知', value:4, apis:'url_get_notice_info'},
                    {label:'日志', value:5, apis:'url_amazon_log'}
                ]
                return buttons.filter(item => {
                    return this.$hasPermission(item.apis);
                });
            },
            trigger(row,val){
                switch (val.value){
                    case 0:
                        this.look_over(row);
                        break;
                    case 1:
                        this.compile(row);
                        break;
                    case 2:
                        this.author(row);
                        break;
                    case 3:
                        this.add_member(row);
                        break;
                    case 4:
                        this.$emit('notice-info', row); // 通知
                        break;
                    case 5:
                        this.look_log(row);
                        break;
                }
            },
            selectionChange(select){
                this.$emit('selection-change',select)
            },
            sort_change(val){
                this.$emit('sort-change',val);
            },
            look_over(row){//-----------------------查看
                this.action.name = 'view';
                this.action.label = '查看';
                this.titleName = `${this.action.label}账户：${row.account_name} 信息`;
                this.$http(ymx_check,row.id).then(res=>{
                    if (res[0].assessment_of_usage === undefined) {
                        this.editData = {assessment_of_usage: 0,...res[0]};
                    } else {
                        this.editData = {...res[0], assessment_of_usage: res[0].assessment_of_usage - 0};
                    }
                    this.editVisible = true;
                }).catch(code=>{
                    this.$message({type: 'error', message: code.message||res,});
                })
            },
            compile(row){//-------------------------------编辑
                this.action.name = 'edit';
                this.action.label = '编辑';
                this.$http(ymx_edit,row.id).then(res=>{
                    this.titleName = `${this.action.label}账户：${row.account_name} 信息`;
                     if (res[0].assessment_of_usage === undefined) {
                       this.editData = {assessment_of_usage: 0,...res[0]};
                    } else {
                        this.editData = {...res[0], assessment_of_usage: res[0].assessment_of_usage - 0};
                    }
                    this.editVisible = true;
                }).catch(code=>{
                    this.$message({type: 'error', message: code.message||code,});
                })
            },
            edit_ymx(id,params){//----------------编辑
                this.seatchData.ymxList.forEach(res=>{
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
            author(row){
                this.rowId=row.id;
                this.currentRow=row;    //缓存当前数据
                this.action.name ='edit'
                this.$http(ymx_edit,row.id).then(res=>{
                    if (res[0].assessment_of_usage === undefined) {
                        this.editData = {assessment_of_usage: 0,...res[0]};
                    }
                    else {
                        this.editData = {...res[0], assessment_of_usage: res[0].assessment_of_usage - 0};
                    }
                    this.authorVisible = true;
                    this.accountName=row.account_name;
                }).catch(code=>{
                    this.$message({type: 'error', message: code.message||code,});
                })
            },
            add_bind_data(val){
                this.bindData = val;
            },
            del_bind_data(val){
                this.bindData = val;
            },
            //更新授权状态
            change_authorize_status(val){
                this.currentRow.is_authorization=val;
            },
//            添加成员事件
            add_member(row){
                this.accountName = row.account_name;
                this.api_add_member({channel_id:2,account_id:row.id});
            },
//            添加成员
            api_add_member(val){
                this.memberLoading = true;
                this.$http(api_add_member,val).then(res=>{
                    this.memberDialog = true;
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
        //    日志
            look_log(row){
                this.$http(api_amazon_log,row.id).then(res=>{
                    this.titleName = `账号简称：${row.code} 的操作日志`;
                    this.logData = res;
                    this.logVisible = true;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
            },
        },
        filters:{
            filterStatus(value){
                return parseInt(value)? '有效':'失效';
            },
            permitStatus(value){
                return value===0?'未授权':'已授权';
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
            },
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val)
            },
            filterRegisterTime(val){
                return datef('YYYY-MM-dd',val);
            },
            filterStatu(val){
                return val=== 1 ? '已启用':'已停用'
            }
        },
        props:{
            seatchData:{},
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
            uiTip:require('@/components/ui-tip.vue').default,
            lookLog:require('../look-log.vue').default,
            trendsSelect: require('@/components/trends-select.vue').default,
        }
    }
</script>
