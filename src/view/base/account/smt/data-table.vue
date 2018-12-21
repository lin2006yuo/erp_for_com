<template>
    <el-row class="p-smt-table">
        <div>
            <el-table
                    v-resize="{height:41}"
                    class="scroll-bar"
                    :data="lists"
                    highlight-current-row
                    border
                    v-loading="isLoading"
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
                <el-table-column label="简称"
                                 inline-template>
                    <div>
                        <ui-tip :content="row.code" v-copy :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="速卖通账户"
                                 min-width="200px"
                                 inline-template>
                    <div>
                        <ui-tip :content="row.account_name" v-copy :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="密钥失效时间"
                        inline-template>
                    <div>
                        <ui-tip :content="row.expiry_time" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="数据同步">
                    <div class="sucStatus">
                        <div>
                            <span class="succeed"
                                  v-if="row.is_invalid && row.download_order>0"
                                  :title="`远程订单${row.download_order}分钟抓取一次`">
                            </span>
                            <span class="default" v-else title="抓取速卖通订单功能已关闭"></span>

                            <span class="succeed_message"
                                  v-if="row.is_invalid && row.download_message>0"
                                  :title="`远程站内信${row.download_message}分钟同步一次`">
                            </span>
                            <span class="default_message"
                                  v-else title="抓取速卖通站内信功能已关闭">
                            </span>

                            <span class="succeed_sync"
                                  v-if="row.is_invalid && row.sync_delivery>0"
                                  :title="`发货状态${row.sync_delivery}分钟同步一次`">
                            </span>
                            <span class="default_sync"
                                  v-else
                                  title="同步发货状态到速卖通功能已关闭">
                            </span>

                            <span class="succeed-download-listing"
                                  v-if="row.is_invalid&&row.download_listing>0"
                                  :title="`远程刊登数据${row.download_listing}分钟抓取一次`"></span>
                            <span v-else
                                  class="default-download-listing"
                                  title="同步远程刊登数据已关闭"></span>
                            <span class="succeed-sync-health"
                                  :title="`健康数据${row.download_health/60}小时同步一次`"
                                  v-if="row.is_invalid && row.download_health>0"></span>
                            <span class="default-sync-health"
                                  title="同步健康数据功能未开启"
                                  v-else></span>
                        </div>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="速卖通状态"
                        align="center">
                    <div class="sucStatus">{{row.aliexpress_enabled |filterAliexpress}}</div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="系统状态">
                    <permission
                            tag="ElSwitch"
                            :route="apis.url_aliexpress_states"
                            :key="row.code"
                            v-model="row.is_invalid"
                            :on-text="switchText[0]"
                            :off-text="switchText[1]"
                            @change="changStatus(row)"></permission>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="有效邮箱">
                    <span @click="validEmail(row)" class="operate">绑定邮箱</span>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="操作"
                        align="center" width="220">
                    <div>
                        <permission
                                tag="span"
                                :route="apis.url_aliexpress_lookover"
                                class="operate"
                                @click="check(row.id)">查看</permission>
                        <permission
                                tag="span"
                                :route="apis.url_aliexpress_lookover">|</permission>
                        <permission tag="span"
                                    :route="apis.url_aliexpress_edit"
                                    class="operate"
                                    @click="edit(row.id)">编辑</permission>
                        <permission
                                tag="span"
                                :route="apis.url_aliexpress_edit">|</permission>
                        <permission
                                tag="span"
                                :route="apis.url_aliexpress_accredit"
                                class="operate"
                                @click="accredit(row)">{{row.is_authorization |filterAuthor}}</permission>
                        <permission
                                tag="span"
                                :route="apis.url_aliexpress_accredit">|</permission>
                        <permission
                                tag="span"
                                :route="apis.url_add_member"
                                class="operate"
                                @click="add_member(row)">添加成员</permission>
                        <permission
                                tag="span"
                                :route="apis.url_get_topic_list">|</permission>
                        <permission tag="span" class="operate"
                                    @click="get_topic_list(row)"
                                    :route="apis.url_get_topic_list" >通知</permission>
                    </div>
                </el-table-column>
            </el-table>
        </div>
        <look-over v-model="lookDialog" :lookLabel="lookLabel" :form="lookForm"></look-over>
        <vaild-email v-model="emailDialog" :bindData="emailDate" :account_name="account_name"></vaild-email>
        <edit v-model="compileDialog" :editLabel="editLabel" :form="editForm" @edit-result="edit_result"></edit>
        <accredit v-model="accDialog" :form="accreditForm" :accessory="accessory"></accredit>
        <add-member @save="save_member" @cur-delete="cur_delete" v-model="memberDialog" :loading="memberLoading" :data="dataMember" :account-name="accountName"></add-member>
        <topic-list v-model="topicDialog" :id="topicId"></topic-list>
        <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="tableDatas.page"
                :page-sizes="[20,50,100,200,500]"
                :page-size="tableDatas.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableDatas.tatolSize">
        </el-pagination>
    </el-row>
</template>
<style lang="stylus">
    .p-smt-table{
        .sucStatus{
            color:#339907
        }
        .order,.email,.Synchronization,.parities{
            display: inline-block;
            width:16px;
            height:16px;
            line-height:24px;
        }
        .order{
            background:url(../../../../assets/order.png) no-repeat;
        }
        .email{
            background:url(../../../../assets/email.png) no-repeat;
        }
        .Synchronization{
            background:url(../../../../assets/Synchronization.png) no-repeat;
        }
        .parities{
            background:url(../../../../assets/parities.png) no-repeat;
        }
        .succeed{
            padding: 4px 12px;
            background: url('../../../../assets/icon_all.png') no-repeat 0 -3468px;
        }
        .default{
            padding: 4px 12px;
            background: url('../../../../assets/icon_all.png') no-repeat 0 -3490px;
        }
        .succeed_message{
            padding: 4px 12px;
            background: url('../../../../assets/icon_all.png') no-repeat 0 -3510px;
        }
        .default_message{
            padding: 4px 12px;
            background: url('../../../../assets/icon_all.png') no-repeat 0 -3529px;
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
import {aliexpress_edit,aliexpress_lookover,aliexpress_states,aliexpress_accredit,api_add_member,api_get_topic_list} from "../../../../api/aliexpress";
import {url_aliexpress_lookover,url_aliexpress_edit,url_aliexpress_accredit,url_add_member,url_aliexpress_states,url_get_topic_list} from "../../../../api/aliexpress";
import accredit from "./accredit";
import edit from "./edit";
import vaildEmail from "./validEmail.vue";
import lookOver from './look_over.vue';
    export default{
        permission:{
            url_aliexpress_lookover,
            url_aliexpress_edit,
            url_aliexpress_accredit,
            url_add_member,
            url_aliexpress_states,
            url_get_topic_list
        },
        data(){
            return {
                topicId:'',
                topicDialog:false,
                showManage:false,
                account:{
                    account_id:0,
                    channel_id: 4
                },
                dataMember:[],
                accountName:"",
                switchText: ["启用", "停用"],
                dataSyn:["下载订单",""],
                accDialog:false,
                memberDialog:false,
                compileDialog:false,
                lookDialog:false,
                emailDialog:false,
                curStatus1:false,
                handle:["查看","编辑","授权"],
                emailDate:[{
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
                sizeTotal:0,
                editForm:{
                    code:'',
                    account_name:'',
                    download_order:'',
                    sync_delivery:'',
                    trad_percent:'',
                    download_health:'',
                },
                lookForm:{
                    code:"",
                    account_name:'',
                    download_order:'',
                    sync_delivery:'',
                    trad_percent:'',
                    download_health:'',
                },
                tokenFrom:{
                        id:"",
                        client_id:"",
                        client_secret:"",
                        authorization_code:"",
                },
                accreditForm:{
                    id:"",
                    client_id:"",
                    client_secret:"",
                    authorization_code:""
                },
                accessory:{
                    id:0,
                    title:"",
                },
                lookLabel:"",
                editLabel:"",
                account_name:"",
                memberLoading:false,
            }
        },
        filters:{
            filterAliexpress(val){
                return val===0?"失效":"有效";
            },
            filterAuthor(val){
               if(val==0){
                   return "未授权"
               }else{
                   return "已授权"
               }
            },
        },
        computed:{
            lists(){
                return this.tableDatas.lists.filter(data=>{
                    data.is_invalid = !!data.is_invalid;
                    return true;
                });
            },
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            },
        },
        props:{
            tableDatas:{
                required:true,
                type:Object
            },
            switchType:{
                required:true,
                type:Number
            },
            isLoading:{
                required:true,
                type:Boolean
            },
            firstLoading: {
                type: Boolean,
                required: true
            }
        },
        created(){

        },
        methods:{
            selectionChange(select){
                this.$emit('selection-change',select)
            },
            get_topic_list(row){//通知
                this.topicDialog = true;
                this.topicId = row.id;
            },
//——————————————————————————————————————————————————————————分页
            handleSizeChange(size){
                this.$emit('size-change',size);
            },
            handleCurrentChange(page){
                this.$emit('current-change',page);
            },
//——————————————————————————————————————————————————————————绑定邮箱
            validEmail(row){
            	this.account_name = row.account_name;
                this.emailDialog=true;
                console.log("绑定邮箱");
            },
//——————————————————————————————————————————————————————————————查看
            check(id){
                this.$http(aliexpress_lookover,id).then(data=>{
                    data.trad_percent = data.trad_percent.toString();
                    this.lookForm=data;
                    this.lookLabel=`查看账户：${data.account_name} 信息`;
                }).catch(code=>{
                    console.log(code);
                });
                this.lookDialog=true;
            },
//————————————————————————————————————————————————————————————编辑
            edit(id){
                this.$http(aliexpress_edit,id).then(data=> {
                    data.trad_percent = data.trad_percent.toString();
                    this.editForm = data;
                    this.editID = id;
                    this.editLabel=`编辑账户：${data.account_name} 信息`
                });
                this.compileDialog = true;
            },
            edit_result(id,data){
            	this.$emit('edit-result',id,data);
            },
//————————————————————————————————————————————————————————————授权
            accredit(row){
                this.$http(aliexpress_accredit,row.id).then(data=> {
                    this.accessory.title = `给账号：${row.account_name} 授权`;
                    this.accessory.id = row.id;
                    data[0].client_id ===0&&(data[0].client_id='');
                    data[0].client_id = String(data[0].client_id);
                    this.accreditForm=data[0];
                }).catch(code=>{
                    this.accDialog = true;
                    this.$message({
                        type:"error",
                        message:code.message||code
                    });
                });
                this.accDialog = true;

            },
//            添加成员事件
            add_member(row){
                this.memberDialog = true;
                this.accountName = row.account_name;
                this.api_add_member({channel_id:4,account_id:row.id});
            },
            save_member(){
                this.$emit("save-member");
            },
            cur_delete(){
                this.$emit("cur-delete");
            },
//————————————————————————————————————————————————————————————switch状态改变
            changStatus(row){
                this.$confirm(`您将更改 ${row.account_name} 账户状态，确认此操作吗？`,"提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false,
                }).then(()=>{
                    this.$http(aliexpress_states,row.id,row.is_invalid?1:0).then(data=>{
                        this.$message({
                            type:"success",
                            message:data.message||data,
                        });
                    }).catch(code=>{
                        this.$message({
                            type:"error",
                            message:code.message||code
                        })
                    })
                }).catch(code=>{
                    this.$message({
                    type:"info",
                    message:"已取消操作"
                    });
                    row.is_invalid = !row.is_invalid;
                })
            },
//            添加成员
            api_add_member(val){
                this.memberLoading = true;
                this.$http(api_add_member,val).then(res=>{
                    this.memberLoading = false;
                    if(res.length>0){
                        this.dataMember = res;
                        this.dataMember.forEach(row=>{
                            row.customer_id = row.customer_id===0?"":row.customer_id;
                            row.info.forEach(res=>{
                                res.seller_id = res.seller_id===0?"":res.seller_id;
                            })
                        });
                    }else{
                        this.dataMember = [];
                        let cur ={
                            id:0,
                            channel_id:4,
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
        components: {
            lookOver,
            accredit,
            edit,
            vaildEmail,
            userManage:require('../user-manage.vue').default,
            addMember:require('./add-member.vue').default,
            uiTip:require('../../../../components/ui-tip.vue').default,
            topicList:require('./topic-list.vue').default,
        }
    }
</script>
