<template>
    <div class="p-shopee-reques">
        <el-card v-loading="uploading" style="border: 0;">
            <page>
                <div class="box-attr">
                    <div class="attr-now">
                        <div class="label_">纠纷ID：</div>
                        <div class="detail_">{{disputeData.id}}</div>
                    </div>
                    <div class="attr-now">
                        <div class="label_">发起时间：</div>
                        <div class="detail_">{{disputeData.create_time|fdateTime}}</div>
                    </div>
                    <div class="attr-now">
                        <div class="label_">买家纠纷类型：</div>
                        <div class="detail_">{{disputeData.type | filterType}}</div>
                    </div>
                    <div class="attr-now">
                        <div class="label_">订单号：</div>
                        <div class="detail_">{{disputeData.ordersn}}</div>
                    </div>
                    <template v-if="disputeData.type === 2">
                        <div class="attr-now">
                            <div class="label_">退货单号：</div>
                            <div class="detail_">{{disputeData.returnsn}}</div>
                        </div>
                    </template>
                    <div class="attr-now">
                        <div class="label_">纠纷状态：</div>
                        <div class="detail_">{{disputeData.status_code | filterStatus}}</div>
                    </div>
                    <template v-if="disputeData.status_code === 3">
                        <div class="attr-now" style="padding: 0 5px;">
                            <div class="label_">提醒：</div>
                            <div class="detail_">纠纷已处理完成</div>
                        </div>
                    </template>
                    <template v-if="disputeData.status_code === 2">
                        <div class="attr-now">
                            <div class="label_"></div>
                            <div class="detail_">纠纷正在处理中</div>
                        </div>
                    </template>
                    <template v-if="disputeData.status_code === 1&&!filterCountDown">
                        <div class="attr-now">
                            <div class="label_"></div>
                            <div class="detail_" style="color: red">已过最迟回应时间</div>
                        </div>
                    </template>
                    <template v-if="disputeData.status_code === 1&&disputeData.type === 2&&filterCountDown">
                        <div class="attr-now">
                            <div class="label_"></div>
                            <div class="detail_">请在<span style="color:red;">{{filterCountDown}}</span>内处理。否则，系统确认退款或纠纷的运费买家或退款会自动退还。</div>
                        </div>
                        <div class="attr-now" v-if="isEditIssue">
                            <div class="label_"></div>
                            <div class="detail_">
                                <permission tag="ElButton"
                                            :route="apis.url_add_order"
                                            class="inline"
                                            size="mini"
                                            @click.native="new_add"
                                            type="primary">退款</permission>
                                <permission tag="ElButton"
                                            :route="apis.url_post_dispute"
                                            class="ml-sm inline"
                                            size="mini"
                                            @click.native="put_forward_dispute"
                                            type="primary">向shopee提出争议</permission>
                            </div>
                        </div>
                    </template>
                    <template v-if="disputeData.status_code === 1&&disputeData.type === 1&&filterCountDown" >
                        <div class="attr-now">
                            <div class="label_"></div>
                            <div class="detail_">您可以联系买家，接受取消申请或拒绝取消申请。请在<span style="color:red;">{{filterCountDown}}</span>前回应。否则订单将自动取消。</div>
                        </div>
                        <div class="attr-now" v-if="isEditIssue">
                            <div class="label_"></div>
                            <div class="detail_">
                                <permission tag="ElButton"
                                            :route="apis.url_accept_cancel_order"
                                            class="ml-sm inline"
                                            size="mini"
                                            @click.native="accept"
                                            type="primary">接受</permission>
                                <permission tag="ElButton"
                                            :route="apis.url_reject_cancel_order"
                                            class="ml-sm inline"
                                            size="mini"
                                            @click.native="reject"
                                            type="primary">拒绝</permission>
                            </div>
                        </div>
                    </template>
                </div>
<!----------------买家理由------------------>
                <div class="mt-xs" v-if="disputeData.type === 2">
                    <div class="tabs-label ml-xs">买家理由</div>
                    <div class="box-attr" style="min-height: 80px;">
                        <el-row>
                            <el-col>
                                <div v-for="src in disputeData.images.split(',')" class="inline mt-mini ml-mini mr-mini">
                                    <el-popover
                                            placement="right"
                                            trigger="hover">
                                        <img v-lazy="sku_image(src)" width="200px" height="200px">
                                        <span slot="reference">
                                                <img v-lazy="src"
                                                     @click="search_img(src)"
                                                     height="60px"
                                                     width="60px"
                                                     style="border:none">
                                            </span>
                                    </el-popover>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row class="mt-xs" v-if="disputeData.text_reason !== ''">
                            <el-input
                                    type="textarea"
                                    :rows="3"
                                    v-model="disputeData.text_reason"
                                    :disabled="true">
                            </el-input>
                        </el-row>
                    </div>
                </div>
<!--------------卖家争议理由-------------------->
                <div class="mt-xs" v-if="disputeData.type === 2&&sellerReason !== null">
                    <div class="tabs-label ml-xs">卖家争议理由</div>
                    <div class="box-attr" style="min-height: 80px;">
                        <el-row>
                            <el-col>
                                <div v-for="src in sellerReason.images.split(',')" class="inline mt-mini ml-mini mr-mini">
                                    <el-popover
                                            placement="right"
                                            trigger="hover">
                                        <img v-lazy="sku_image(src)" width="200px" height="200px">
                                        <span slot="reference">
                                                <img v-lazy="src"
                                                     @click="search_img(src)"
                                                     height="60px"
                                                     width="60px"
                                                     style="border:none">
                                            </span>
                                    </el-popover>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row class="mt-xs">
                            <el-input
                                    type="textarea"
                                    :rows="2"
                                    v-model="sellerReason.dispute_text_reason"
                                    :disabled="true">
                            </el-input>
                        </el-row>
                    </div>
                </div>
<!--------------------纠纷历史------------------->
                <div>
                    <div class="tabs-label ml-xs">纠纷历史</div>
                </div>
                <el-table
                        class="mt-xs scroll-bar"
                        :data="disputeLog"
                        border
                        height="300"
                        highlight-current-row>
                    <el-table-column label="操作人" width="80" show-overflow-tooltip inline-template>
                        <ui-tip :content="row.operator"></ui-tip>
                    </el-table-column>
                    <el-table-column label="操作时间" inline-template show-overflow-tooltip width="145">
                        <div>{{row.create_time|fdateTime}}</div>
                    </el-table-column>
                    <el-table-column label="操作内容" inline-template>
                        <div>
                            <div>{{row.action_type}}</div>
                            <div :title="row.data" style="word-break: keep-all;">{{row.data}}</div>
                        </div>
                    </el-table-column>
                </el-table>
            </page>
        </el-card>

        <!--新建售后单弹框-->
        <add ref="addAfter"
             :is-shopee-dispute="isShopeeDispute"
             :order-number="orderNumber"
             :dispute-params="disputeParams"
             v-model="addDialog"
             @save="save_after"
             @submit="submit"
             :is-trigger="isTrigger"></add>

        <!--向shopee提出争议弹框-->
        <dispute-form v-model="showDialog"
                      @submit-dispute="submit_dispute"
                      :dis-form="disForm"></dispute-form>
    </div>
</template>

<style lang="stylus">
    .p-shopee-reques {

        table.template td, .el-table td, table.template th, .el-table th {
            padding: 0;
        }

        .el-card__body {
            padding: 0;
        }
        .tabs-label {
            font-weight: bold;
        }
        .box-attr {
            margin-bottom: 10px;
            border: 1px solid #BDCDDC;
            padding: 8px;
            box-sizing: border-box;
            .attr-now {
                display: flex;
                align-items: center;
                padding: 5px;
                .label_ {
                    display: inline-block;
                    width: 110px;
                    text-align: right;
                    font-weight: bold;
                }
                .detail_ {
                    width: 488px;
                    word-break: break-all;
                }
            }
        }
        .span_ {
            color: red;
            font-weight: bold;
        }
        .box-regues {
            margin-top: 5px;
            padding: 5px 5px 0 5px;
            border: 1px solid #BDCDDC;
            background-color: #F1F6FC;
            .radio {
                display: block;
                margin-left: 0;
                padding-bottom: 8px;
            }
            .regues-detail {
                margin: 5px 0;
                .dispute-content {
                    margin-bottom: 5px;
                    display: flex;
                    align-items: center;
                    label {
                        display: inline-block;
                        padding: 0 5px;
                    }
                    .address {
                        width: 60px;
                        text-align: right;
                    }
                    .data-picker {
                        width: 153px;
                    }
                }
            }
        }
    }
</style>

<script>
    import {url_add_order} from '../../../../api/after-sale';
    import {url_post_dispute,url_accept_cancel_order,url_reject_cancel_order,api_post_dispute,api_get_seller_reason,api_get_shopee_log,api_accept_cancel_order,api_reject_cancel_order,api_shopee_look_return,api_get_shopee_order_cancel_log} from '../../../../api/dispute';
    export default {
        name: "shopee-dispute",
        permission:{
            url_add_order,
            url_post_dispute,
            url_accept_cancel_order,
            url_reject_cancel_order
        },
        data() {
            return {
                now:new Date().getTime(),
                intervalTime:null,
                uploading: false,
                addDialog: false,
                orderNumber: "",
                isTrigger: false,
                showDialog: false,
                sellerReason:{},//卖家争议理由
                disputeLog:[],//纠纷日志
                disForm: {
                    dispute_reason: '',
                    dispute_text_reason: '',
                    email: '',
                    files: []
                },
                isShopeeDispute: true,
                disputeParams:{
                    dispute_type: '',
                    returnsn: ''
                }
            }
        },
        filters:{
            fdateTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss",val);
            },
            filterType(val) {
                return val === 1?'订单取消申请':'退款/退货申请'
            },
            filterStatus(val){
                let ret = '';
                switch (val){
                    case 1:
                        ret = '待处理';
                        break;
                    case 2:
                        ret = '处理中';
                        break;
                    case 3:
                        ret = '处理完成';
                        break;
                    default:
                        ret = 'error'
                }
                return ret
            }
        },
        mounted(){
            if(this.disputeData.due_date*1000-this.now>0) {
                this.countDownInterval();
            };
            this.get_seller_reason();
            this.get_dispute_log()
        },
        methods:{
            //新建售后单
            new_add(){
                this.disputeParams.dispute_type = this.disputeData.type;
                this.disputeParams.returnsn = this.disputeData.returnsn;
                this.addDialog = true;
                this.orderNumber = this.disputeData.ordersn;
                this.isTrigger = true;
                this.$nextTick(()=>{
                    this.$refs.addAfter.search();
                })
            },
            // 新建售后单提交审批
            submit(){
                this.$emit('add-aftermarker')
            },
            //新建售后单确定
            save_after(){
                this.$emit('add-aftermarker')
            },
            //向shopee提出争议
            put_forward_dispute(){
                this.disForm = {
                    dispute_reason: '',
                    dispute_text_reason: '',
                    email: '',
                    files: []
                };
                this.showDialog = true
            },
            //确定提交争议
            submit_dispute(){
                let params = {
                    dispute_reason: this.disForm.dispute_reason,
                    dispute_text_reason: this.disForm.dispute_text_reason,
                    email: this.disForm.email,
                    files: this.disForm.files
                };
                this.$http(api_post_dispute, this.disputeData.returnsn, params).then(res => {
                    this.$message({type: 'success', message: res.message});
                    this.showDialog = false;
                    this.get_dispute_log();
                    this.refresh_status()
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                })
            },
            //刷新订单状态
            refresh_status(){
                let api = this.disputeData.type === 1 ? api_shopee_look_cancel : api_shopee_look_return;
                let params = this.disputeData.type === 1 ? this.disputeData.ordersn : this.disputeData.returnsn;
                this.$http(api,params).then(res => {
                    this.disputeData.status_code = res.status_code;
                    this.disputeData.status_code_text = res.status_code_text
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                })
            },
            //订单取消申请--接受
            accept(){
                this.$confirm('若您同意接受买家的取消申请，此订单将被即刻取消。请勿将此订单出货。若您已出货，请拒绝订单的取消申请。确定接受？', '提示', {
                    confirmButtonText: '接受',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_accept_cancel_order,this.disputeData.ordersn).then(res => {
                        this.$message({type: 'success', message: res.message});
                        this.get_dispute_log();
                        this.refresh_status()
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code})
                    });
                }).catch(() => {
                    this.$message({type: 'info', message: '已取消'})
                })
            },
            //订单取消申请--拒绝
            reject(){
                this.$confirm('通过拒绝此取消申请，此订单将返回到其原始状态。若您未出货，请在拒绝取消申请后安排出货。确认拒绝？', '提示', {
                    confirmButtonText: '拒绝',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_reject_cancel_order,this.disputeData.ordersn).then(res => {
                        this.$message({type: 'success', message: res.message});
                        this.get_dispute_log();
                        this.refresh_status()
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code})
                    });
                }).catch(() => {
                    this.$message({type: 'info', message: '已取消'})
                })
            },
            sku_image(image){
                return image.replace('60x60','200x200');
            },
            search_img(image){
                window.open(image.replace('60x60','500x500'));
            },
            countDownInterval(){
                this.intervalTime = setInterval(()=>{
                    this.now = new Date().getTime();
                },1000);
            },
            //获取卖家争议理由
            get_seller_reason(){
                this.$http(api_get_seller_reason, this.disputeData.returnsn).then(res => {
                    this.sellerReason = res
                }).catch(code => {

                })
            },
            //获取纠纷日志
            get_dispute_log(){
                let api = this.disputeData.type === 1 ? api_get_shopee_order_cancel_log : api_get_shopee_log;
                let params = this.disputeData.type === 1 ? this.disputeData.ordersn : this.disputeData.returnsn;
                this.$http(api, params).then(res => {
                    this.disputeLog = res
                }).catch(code => {
                    this.$message({type: 'success', message: code.message||code})
                })
            }
        },
        computed:{
            filterCountDown(){
                if(this.disputeData.due_date*1000-this.now>0) {
                    let sec = this.disputeData.due_date*1000 - this.now;
                    sec = Math.max(sec, 0);
                    let d = parseInt(sec / 1000 / 60 / 60 / 24, 10);
                    let h = parseInt(sec / 1000 / 60 / 60 % 24, 10);
                    let m = parseInt(sec / 1000 / 60 % 60, 10);
                    let s = parseInt(sec / 1000 % 60, 10);
                    `${m}`.length===1&&(m='0'+m);
                    `${s}`.length===1&&(s='0'+s);
                    return `${d}天${h}时${m}分${s}秒`;
                }else{
                    return false
                }
            }
        },
        destroyed(){
            clearInterval(this.intervalTime);
        },
        props: {
            disputeData: {
                type: Object
            },
            formData: {},
            isEditIssue:{
                type:Boolean,
                required:true
            }
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default,
            imageUpload: require('../../smt/inbox/image-upload.vue').default,
            times: require('@/components/times.vue').default,
            add:require('./add.vue').default,
            disputeForm:require('./dispute-form.vue').default
        }
    }
</script>