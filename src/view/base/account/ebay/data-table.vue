<template>
    <el-row class="p-ebay-table">
        <div>
            <el-table
                    v-resize="{height:41}"
                    :data="tableData"
                    @sort-change="sort_change"
                    v-loading="loading"
                    element-loading-text="玩命加载中..."
                    highlight-current-row
                    @selection-change="selectionChange">
                <el-table-column
                        type="selection"
                        width="40">
                </el-table-column>
                <div slot="empty" class="no-data-reminder">
                    <i></i>
                    {{emptyText}}
                </div>
                <el-table-column property="id"
                                 label="ID"
                                 width="45"
                                 row-key="id">
                </el-table-column>
                <el-table-column inline-template
                                 label="简称"
                                 sortable
                                 width="80">
                    <ui-tip :content="row.code" :width="98" v-copy></ui-tip>
                </el-table-column>
                <el-table-column inline-template sortable
                                 label="eBay账户">
                    <ui-tip :content="row.account_name" :width="88" v-copy></ui-tip>
                </el-table-column>
                <el-table-column inline-template
                                 label="站点" sortable
                                 width="110" >
                    <ui-tip :content="get_site(row.site_id)"></ui-tip>
                </el-table-column>
                <el-table-column label="信用评价"
                                 align="center"
                                 inline-template show-overflow-tooltip v-if="clientWidth">
                    <div class="t-left">
                        <div class="inline bold-font mr-mini">{{row.feedback_score}}</div>
                        <div class="inline red mr-mini">
                            {{row.positive_feedback_percent}}&nbsp;%</div>
                        <score-color-star
                                class="inline"
                                :whichColor="row.feedback_rating_star">
                        </score-color-star>
                    </div>
                </el-table-column>
                <el-table-column prop="ort_invalid_time"
                                 label="oAuth密钥有效期" sortable
                                 align="center"
                                 width="150">
                </el-table-column>
                <el-table-column prop="token_invalid_time"
                                 label="密钥有效期" sortable
                                 align="center"
                                 width="100">
                </el-table-column>
                <el-table-column label="数据同步" width="175"
                                 align="center"
                                 inline-template show-overflow-tooltip>
                    <div>
                        <span class="succeed-download-order"
                              v-if="row.is_invalid&&row.download_order>0"
                              :title="row.download_order_str"></span>
                        <span class="default-download-order"
                              v-else :title="row.download_order_str"></span>
                        <span class="succeed-download-message"
                              v-if="row.is_invalid&&row.download_message>0"
                              :title="row.download_message_str"></span>
                        <span class="default-download-message"
                              v-else :title="row.download_message_str"></span>

                        <span class="succeed-download-listing"
                              v-if="row.is_invalid&&row.download_listing>0"
                              :title="row.download_listing_str"></span>
                        <span class="default-download-listing"
                              v-else :title="row.download_listing_str"></span>

                        <span class="succeed-sync-payment"
                              v-if="row.is_invalid&&row.sync_payment>0"
                              :title="row.sync_payment_str"></span>
                        <span class="default-sync-payment"
                              v-else :title="row.sync_payment_str"></span>
                        <span class="succeed-sync-delivery"
                              v-if="row.is_invalid&&row.sync_delivery>0"
                              :title="row.sync_delivery_str"></span>
                        <span class="default-sync-delivery"
                              v-else :title="row.sync_delivery_str"></span>

                        <span class="succeed-sync-feedback"
                              v-if="row.is_invalid&&row.sync_feedback>0"
                              :title="row.sync_feedback_str"></span>
                        <span class="default-sync-feedback"
                              v-else :title="row.sync_feedback_str"></span>

                        <span class="succeed-sync-health"
                              :title="row.health_monitor_str"
                              v-if="row.is_invalid && row.health_monitor>0"></span>
                        <span class="default-sync-health"
                              :title="row.health_monitor_str"
                              v-else></span>
                    </div>
                </el-table-column>
                <el-table-column label="eBay状态"
                                 align="center"
                                 inline-template width="90" show-overflow-tooltip>
                    <div :class="row.account_status=='1'?'star-green':'star-red'">
                        {{row.account_status | filterStatus}}
                    </div>
                </el-table-column>

                <el-table-column inline-template label="系统状态" align="center" width="80">
                    <div>
                        <el-switch :key="row.id"
                                   v-model="row.is_invalid"
                                   :on-text="status[0]"
                                   :off-text="status[1]"
                                   @change="chang_status(row)">
                        </el-switch>
                    </div>
                </el-table-column>

                <el-table-column label="有效邮箱" align="center" width="100" inline-template>
                    <div>
                        <bind-email :bindData="bindData"
                                    :change_bind="add_bind_data"
                                    :account_name="row.account_name"
                                    :del_data="del_bind_data"></bind-email>
                    </div>
                </el-table-column>
                <el-table-column label="操作" inline-template align="center" width="380">
                    <div>
                        <permission
                                tag="span"
                                :route="apis.url_account_ebay_look"
                                class="operate"
                                @click="look_over(row)">{{operate[0]}}
                        </permission>
                        <permission
                                tag="span"
                                :route="apis.url_account_ebay_look">|
                        </permission>
                        <permission
                                tag="span"
                                :route="apis.url_account_ebay_edit"
                                class="operate"
                                @click="compile(row)">{{operate[1]}}
                        </permission>
                        <permission
                                tag="span"
                                :route="apis.url_account_ebay_edit">|
                        </permission>
                        <permission
                                tag="span"
                                :route="apis.url_account_ebay_authorize"
                                class="operate"
                                @click="author(row)">{{row.token_valid_status | filtertoken}}
                        </permission>
                        <permission
                                tag="span"
                                :route="apis.url_account_ebay_authorize">|
                        </permission>
                        <permission
                                tag="span"
                                :route="apis.url_account_ebay_oauth"
                                class="operate"
                                @click="oAuth(row)">{{row.oauth_token_status | filteroAuth}}
                        </permission>
                        <permission
                                tag="span"
                                :route="apis.url_account_ebay_oauth">|
                        </permission>
                        <permission
                                tag="span"
                                :route="apis.url_account_ebay_edit_paypal"
                                class="operate"
                                @click="bind_paypals(row)">{{operate[3]}}
                        </permission>
                        <permission
                                tag="span"
                                :route="apis.url_account_ebay_edit_paypal">|
                        </permission>
                        <permission
                                tag="span"
                                :route="apis.url_add_member"
                                class="operate"
                                @click="add_member(row)">添加成员
                        </permission>
                        <permission
                                tag="span"
                                :route="apis.url_getevent_ebay_account">|
                        </permission>
                        <permission
                                tag="span"
                                :route="apis.url_getevent_ebay_account"
                                class="operate"
                                @click="show_event(row)">通知
                        </permission>
                    </div>
                </el-table-column>
            </el-table>
        </div>
        <authorize :authorizeData="authorizeData" v-model="authorVisible"></authorize>
        <oauthize :title="title" :oauthData="oauthData" v-model="oAuthVisible"></oauthize>
        <person-information v-model="personVisible" :person-data2="personData"></person-information>
        <bind-pay v-model="payVisible" :paypaltwo="paypaltwo" @paypalupdata="refresh"></bind-pay>
        <edit v-model="editVisible" :editDatatwo="editData" @refresh="refresh" @edit-update="edit_update"></edit>
        <user-manage :account="account" v-model="showManage"></user-manage>
        <add-member @save="save_member" @cur-delete="cur_delete" v-model="memberDialog" :loading="memberLoading"
                    :data="dataMember" :account-name="accountName"></add-member>
        <get-event v-model="eventDialog"
                   ref="event"
                   :event-data="eventData"
                   :account-name="accountName"
                   @update-event="update_event"
                   :account-id="accountId"></get-event>
    </el-row>
</template>
<style lang="stylus">
    .p-ebay-table {
        .el-table__body-wrapper {
            overflow-x: hidden;
        }
        .star-red {
            color: red;
        }
        .star-green {
            color: #339907
        }
        .star-yellow {
            color: yellow;
        }
    }
</style>
<script>
    import  bindEmail from  './bind-email.vue'   //引入组件
    import  authorize from './authorize.vue'
    import  personInformation from  './person-information.vue'
    import  bindPay from './bind-paypal.vue'
    import  getEvent from './get-event.vue'
    import edit from './edit.vue'
    import {
        account_ebay_look,
        account_ebay_authorize,
        account_ebay_edit,
        api_account_ebay_edit_paypal,
        account_ebay_status,
        url_getevent_ebay_account,
        api_getevent_ebay_account
    } from '../../../../api/account-ebay';
    import {
        url_account_ebay_look,
        url_account_ebay_edit,
        url_account_ebay_authorize,
        url_account_ebay_edit_paypal,
        url_account_ebay_oauth
    } from '../../../../api/account-ebay';
    import {api_add_member} from '../../../../api/aliexpress';
    import {url_add_member} from '../../../../api/aliexpress';
    export default{
        permission: {
            url_account_ebay_look,
            url_account_ebay_edit,
            url_account_ebay_authorize,
            url_account_ebay_edit_paypal,
            url_add_member,
            url_getevent_ebay_account,
            url_account_ebay_oauth
        },
        data(){
            return {
                showManage: false,
                account: {},
                payVisible: false,
                personVisible: false,
                authorVisible: false,
                editVisible: false,
                status: ["启用", "停用"],
                curStatus: false,
                personId: 0,
                operate: ["查看", "编辑", "授权", "绑定paypal"],
                authorizeData: {},
                memberDialog: false,
                dataMember: [],
                accountName: "",
                bindData: [{
                    name: "",
                    email: "",
                    indexemail: "",
                    status: "未验证",
                    username: "",
                    psd: "",
                    emailserver: "",
                    serverport: "",

                }],
                personData: {},
                editData: {},
                paypaltwo: {currency: []},
                memberLoading: false,
                eventDialog: false,
                eventData:[],
                accountId:0,
                oAuthVisible:false,
                oauthData:{},
                title:'',
            }
        },
        computed: {
          clientWidth(){
            if(document.body.clientWidth>1366){
              return true;
            }else{
              return false;
            }
          },
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            },
        },
        methods: {
            selectionChange(select){
                this.$emit('selection-change',select)
            },
            sort_change(val){
                this.$emit('sort-change',val);
            },
        	show_event(row){
        		this.eventDialog = true;
        		this.accountName = row.account_name;
        		this.accountId = row.id;
        		this.get_event(row.id,0);
            },
            update_event(account_id,sync){
            this.get_event(account_id,sync);
            },
            get_event(account_id,sync){
            	let data = {
                    account_id:account_id,
                    sync:sync,
                };
            	this.$refs.event.loading = true;
            	this.$refs.event.eventDisabled = true;
            	this.$http(api_getevent_ebay_account,data).then(res=>{
                    this.eventData = res.data;
                    this.$refs.event.loading = false;
                    this.$refs.event.eventDisabled = false;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('getEvent', false);
                    }, 300)
                });
            },
            get_site(val){
                return !!val?val.join(','):val;
            },
            manage(row){
                this.account = {
                    account_id: row.account_id,
                    channel_id: 4
                };
                this.showManage = true;
            },
            //查看
            look_over(row){
                this.personVisible = true;
                this.personData = {};
                this.$http(account_ebay_look, row.id).then(data => {
                    this.personData = data;
                }).catch(code => {
                    console.log(`code :${code}`);
                });
            },
//            编辑
            compile(row){
                this.editVisible = true;
                this.editData = {};
                this.$http(account_ebay_edit, row.id).then(data => {
                    this.editData = data;
                }).catch(code => {
                    console.log(`code :${code}`);
                })
            },
//           开启授权
            author(row){
                this.$http(account_ebay_authorize, {id: row.id}).then(res => {
                    this.authorVisible = true;
                    this.$set(this, "authorizeData", {
                        id: row.id,
                        account_name: row.account_name,
                        url: res.message.url,
                        sessId: res.message.sessId
                    })
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
//           oAuth授权
            oAuth(row){
                this.title = `给账户：${row.account_name} 授权`;
                this.oAuthVisible = true;
                this.oauthData = {
                    id: row.id,
                    oauth_code:'',
                }
            },
//            绑定paypal
            bind_paypals(row){
                this.$http(api_account_ebay_edit_paypal, {id: row.id}).then(res => {
                    if (res.currency === "" || res.currency.length === 0) {
                        res.currency = []
                    } else {
                        let data = [];
                        for (let i  in res.currency) {
                            data.push({code: i, count: res.currency[i]})
                        }
                        res.currency = data;
                    }
//                    res.max_paypal_id = res.max_paypal_id?parseInt(res.max_paypal_id):'';
//                    res.min_paypal_id = res.min_paypal_id?parseInt(res.min_paypal_id):'';

                    this.payVisible = true;
                    this.paypaltwo = res;
                }).catch(code => {
                    console.log(code)
                })
            },
//          添加成员
            add_member(row){
                this.memberDialog = true;
                this.accountName = row.account_name;
                this.api_add_member({channel_id: 1, account_id: row.id});
            },
            save_member(){
                this.$emit("refresh")
            },
            cur_delete(){
                this.$emit("refresh")
            },
//            添加成员
            api_add_member(val){
                this.memberLoading = true;
                this.$http(api_add_member, val).then(res => {
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
                            id: 0,
                            channel_id: 1,
                            customer_id: "",
                            account_id: val.account_id,
                            info: [
                                {seller_id: "", warehouse_type: 0}
                            ]
                        }
                        this.dataMember.push(cur);
                    }
                }).catch(code => {
                    setTimeOut(() => {
                        this.memberLoading = true;
                    }, 100)
                    console.log(code);
                })
            },
            //修改状态  启用  禁用
            chang_status(row){
                let statusTitle = row.is_invalid ? '启用' : '停用';
                this.$confirm('您将修改' + row.account_name + '系统状态，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false,
                }).then(() => {
                    let status = row.is_invalid ? 1 : 0;
                    let params = {
                        id: row.id,
                        status: status
                    };
                    this.$http(account_ebay_status, params).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                        this.$emit('edit_ymx')
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code,
                        });
                        this.$emit('edit_ymx')
                    })
                }).catch((code) => {
                    this.$message({
                        type: 'info',
                        message: '已取消' + statusTitle
                    });
                    row.is_invalid = !row.is_invalid
                });
            },
            //绑定邮箱数据
            add_bind_data(val){
                this.bindData = val;
            },
            //删除邮箱数据
            del_bind_data(val){
                this.bindData = val;
            },
            refresh(){
                this.$emit("refresh")
            },
            edit_update(id,data){
                this.$emit("edit-update",id,data);
            },
        },
        filters: {
            filterStatus(value){
                if (value == "1") {
                    return "有效"
                } else {
                    return "无效"
                }
            },
            filtertoken(value){
                if (value === 1) {
                    return "已授权"
                }
                else {
                    return "未授权"
                }
            },
            filteroAuth(value){
                if (value === 1) {
                    return "oAuth已授权"
                }
                else {
                    return "oAuth未授权"
                }
            }
        },
        props: {
            tableData: {
                required: true,
                type: Array
            },
            loading: {
                required: true,
                type: Boolean
            },
            firstLoading: {
                type: Boolean,
                required: true
            }
        },
        components: {
            bindEmail,
            authorize,
            personInformation,
            bindPay,
            edit,
            getEvent,
            oauthize: require('./oauthize.vue').default,
            userManage: require('../user-manage.vue').default,
            addMember: require('../smt/add-member.vue').default,
            scoreColorStar: require('../score-color-star.vue').default,
            uiTip:require('../../../../components/ui-tip.vue').default
        }
    }
</script>
