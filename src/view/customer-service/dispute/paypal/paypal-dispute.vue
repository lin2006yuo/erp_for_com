<template>
    <div class="p-paypal-reques">
        <el-card v-loading="uploading" style="border: 0;">
            <page>
                <div class="box-attr">
                    <div class="attr-now">
                        <div class="label_">纠纷ID：</div>
                        <div class="detail_">{{disputeData.dispute_id}}</div>
                    </div>
                    <div class="attr-now">
                        <div class="label_">发起时间：</div>
                        <div class="detail_">{{disputeData.dispute_create_time|fdateTime}}</div>
                    </div>
                    <div class="attr-now">
                        <div class="label_">买家纠纷提起原因：</div>
                        <div class="detail_">{{disputeData.reason_text}}</div>
                    </div>
                    <div class="attr-now">
                        <div class="label_">纠纷状态：</div>
                        <div class="detail_">{{disputeData.status_text}}</div>
                    </div>
                    <!--来自买家的讯息-->
                    <template v-if="disputeData.status === 'CHARGEBACK'">
                        <div class="attr-now" style="padding: 0 5px;">
                            <div class="label_"></div>
                            <div class="detail_">买家已针对此次交易提出纠纷申诉。我们建议你与对方共同解决问题。</div>
                        </div>
                    </template>
                    <!--paypal审核中-->
                    <template v-if="disputeData.status_code === 2">
                        <div class="attr-now">
                            <div class="label_"></div>
                            <div class="detail_">
                                <div>未收到物品</div>
                                <div>未授权</div>
                                <div>未经权限存取</div>
                                <div>已取消订单但是仍被收取费用</div>
                            </div>
                        </div>
                    </template>
                    <!--需要回复-->
                    <template v-if="disputeData.status_code === 1&&!filterCountDown">
                        <div class="attr-now">
                            <div class="label_"></div>
                            <div class="detail_" style="color: red">
                                <div>为帮助我们尽快解决您的纠纷，我们需要您于<span style="color:red;">{{filterCountDown}}</span>或之前回复。</div>
                                <div>与说明不符</div>
                                <div>物品未收到</div>
                                <div>未授权</div>
                                <div>重复付款</div>
                            </div>
                        </div>
                    </template>
                </div>

                <!--买家提供的资料-->
                <div class="mt-xs">
                    <div class="tabs-label ml-xs">买家提供的资料</div>
                    <div class="box-attr" style="min-height: 80px;">

                    </div>
                </div>

                <!--您的回复-->
                <div class="mt-xs">
                    <div class="tabs-label ml-xs">您的回复</div>
                    <div class="box-attr" style="min-height: 80px;">

                    </div>
                </div>

                <!--您与买家的对话-->
                <div class="mt-xs" v-if="disputeData.message.length>0">
                    <div class="tabs-label ml-xs">您与买家的对话</div>
                    <div class="box-attr">
                        <div class="attr-now" v-for="(item,index) in disputeData.message" :key="index">
                            <div class="label_">{{item.posted_by | posterFilter}}：</div>
                            <div class="detail_">
                                <div>{{item.content}}</div>
                                <div>{{item.time_posted}}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!--操作日志-->
                <div class="mt-xs">
                    <div class="tabs-label ml-xs">操作日志</div>
                    <div class="box-attr" style="min-height: 80px;">

                    </div>
                </div>

                <!--回复-->
                <div class="mt-xs">
                    <div class="tabs-label ml-xs">回复</div>
                    <div class="box-regues">
                        <el-radio-group v-model="radioValue" @change="change_radio">
                            <el-radio class="radio" v-for="(row, index) in radioGroup" :label="row.value" :key="index">{{row.label}}</el-radio>
                        </el-radio-group>
                    </div>
                    <!--发放全额退款，买家可以保留物品/我会退款给买家，并结束此纠纷-->
                    <div class="regues-detail" v-if="radioValue === 'refundAll1'||radioValue === 'refundEnd'">
                        <div class="ml-sm">
                            <h2>退款给买家</h2>
                            <div class="mb-sm">注意：我们会从您的Paypal余额中扣除争议金额，并结束此事件</div>
                            <div class="mb-sm" v-if="radioValue === 'refundAll1'">提示：物品将由买方保留</div>
                            <div class="mb-sm">
                                <span class="mr-lg">您需要退还的金额</span>
                                <span style="font-weight: bold">{{disputeData.currency}}{{disputeData.dispute_amount}}</span>
                            </div>
                            <div class="mb-sm">
                                <span class="mr-lg">Paypal需要退还的费用</span>
                                <span style="font-weight: bold">{{disputeData.currency}}</span>
                            </div>
                            <div class="mb-sm">
                                <span class="mr-lg">退款总额</span>
                                <span style="font-weight: bold">{{disputeData.currency}}</span>
                            </div>
                            <el-button type="primary">发放退款</el-button>
                        </div>
                    </div>
                    <!--发放全额退款，买家必须退还物品-->
                    <div class="regues-detail" v-if="radioValue === 'refundAll2'">
                        <div class="ml-sm">
                            <h2>退款给买家</h2>
                            <div class="mb-sm">注意：争议金额将从您的Paypal余额中退还</div>
                            <div class="mb-sm">提示：物品退回后，我们会立即处理退款</div>
                            <div class="mb-sm">
                                <div class="mb-xs">请选择您的退货地址</div>
                                <el-select v-model="returnAddress"
                                           class="s-width-large"
                                           @change="select_address">
                                    <el-option v-for="item in addressGroup"
                                               :key="item.value"
                                               :value="item.value"
                                               :label="item.label"></el-option>
                                </el-select>
                                <el-button type="text">添加地址</el-button>
                            </div>
                            <div class="mb-sm">
                                <span class="mr-lg">您需要退还的金额</span>
                                <span style="font-weight: bold">{{disputeData.currency}}{{disputeData.dispute_amount}}</span>
                            </div>
                            <div class="mb-sm">
                                <span class="mr-lg">Paypal需要退还的费用</span>
                                <span style="font-weight: bold">{{disputeData.currency}}</span>
                            </div>
                            <div class="mb-sm">
                                <span class="mr-lg">退款总额</span>
                                <span style="font-weight: bold">{{disputeData.currency}}</span>
                            </div>
                            <el-button type="primary">发放退款</el-button>
                        </div>
                    </div>
                    <!--发放部分退款-->
                    <div class="regues-detail" v-if="radioValue === 'refundPart'">
                        <div class="ml-sm">
                            <h2>输入部分退款金额</h2>
                            <div class="mb-sm">
                                <label>退款金额：</label>
                                <el-input type="number"
                                          v-model="refund_part_amount"
                                          class="inline"
                                          min="0"></el-input>
                                <span>{{disputeData.currency}}</span>
                            </div>
                            <div class="mb-sm">退款详情：您输入的退款金额将于买家要求的金额进行对照。
                                如果金额一致，补偿申请将自动结束。
                                如果您提供的部分退款低于买家的要求，买家可以
                                选择接受或拒绝您的提议。</div>
                            <div class="mb-sm">
                                <label>备注：</label>
                                <el-input type="textarea" :rows="5" v-model="remark"></el-input>
                            </div>
                            <el-button type="primary">发放退款</el-button>
                        </div>
                    </div>
                    <!--我已发放退款-->
                    <div class="regues-detail" v-if="radioValue === 'refunded'">
                        <div class="ml-sm">
                            <div class="mt-xs">
                                <label style="font-weight: bold">请选择您的退款方式：</label>
                                <el-select v-model="refundWay"
                                           class="s-width-large inline"
                                           @change="select_refund_way">
                                    <el-option v-for="item in refundWayGroup"
                                               :key="item.value"
                                               :value="item.value"
                                               :label="item.label"></el-option>
                                </el-select>
                            </div>
                            <div v-if="refundWay === 2">
                                <h2>提交证明文件</h2>
                                <div>您应提交收据，或者其他显示出退还给买家金额的资料</div>
                                <el-button type="primary">提交</el-button>
                            </div>
                        </div>
                    </div>
                    <!--我不同意补偿申请，我想提交其他信息-->
                    <div class="regues-detail" v-if="radioValue === 'disagree'">
                        <div class="ml-sm">
                            <h2>提供更多资料</h2>
                            <div class="mb-sm">如果您对买家的索偿完全或部分不同意，您可以提供更多资料，分别处理各个问题。</div>
                            <div class="mb-sm">

                            </div>
                            <div class="mb-sm">
                                <div class="mb-xs">请选择您的退货地址</div>
                                <el-select v-model="returnAddress"
                                           class="s-width-large"
                                           @change="select_address">
                                    <el-option v-for="item in addressGroup"
                                               :key="item.value"
                                               :value="item.value"
                                               :label="item.label"></el-option>
                                </el-select>
                                <el-button type="text">添加地址</el-button>
                            </div>
                            <el-button type="primary">提交</el-button>
                        </div>
                    </div>
                    <!--向买家发送信息-->
                    <div class="regues-detail" v-if="radioValue === 'sendMsg'">
                        <div class="ml-sm">
                            <h2>Amy,你好：</h2>
                            <div class="mb-sm">
                                <el-input type="textarea" v-model="message" :rows="5" :placeholder="向买家发送友好讯息"></el-input>
                            </div>
                            <el-button type="primary" class="inline">寄出</el-button>
                            <el-bubtton class="inline">取消</el-bubtton>
                        </div>
                    </div>
                    <!--退款并关闭-->
                    <div class="regues-detail" v-if="radioValue === 'refundClose'">
                        <div class="ml-sm">
                            <h2>接受买家的调解方案</h2>
                            <div class="mb-sm">amy amsalom已要求退还{{disputeData.currency}}</div>
                            <div class="mb-sm">你将会退还{{disputeData.currency}}。买家无需退货物品，当你向买家退款后，此纠纷将会结束。</div>
                            <el-bubtton type="primary" class="inline">退款并关闭</el-bubtton>
                        </div>
                    </div>
                </div>
            </page>
        </el-card>
    </div>
</template>

<style lang="stylus">
    .p-paypal-reques {

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
                disputeLog: [],//纠纷日志，
                radioValue: '',
                radioGroup: [],
                //需要回复物品与说明不符
                group1: [
                    {label: '我将发放全额退款，买家可以保留物品', value: 'refundAll1'},
                    {label: '我将发放全额退款，买家必须退还物品', value: 'refundAll2'},
                    {label: '我将发放部分退款', value: 'refundPart'},
                    {label: '我已经发放了退款', value: 'refunded'},
                    {label: '我不同意补偿申请，我想提交其他信息', value: 'disagree'}
                ],
                //需要回复未收到物品
                group2: [
                    {label: '我会退款给买家，并结束此纠纷', value: 'refundEnd'},
                    {label: '我已运送商品或提供服务', value: 'delivery'},
                    {label: '我已退款', value: 'refunded'}
                ],
                //等待买家回复物品与说明不符
                group3: [
                    {label: '提交证明文件', value: 'submitFile'}
                ],
                //来自买家讯息未收到物品
                group4: [
                    {label: '向买家发送讯息', value: 'sendMsg'},
                    {label: '提供全额退款', value: 'refundAll'}
                ],
                //来自买家讯息物品与说明不符
                group5: [
                    {label: '向买家发送讯息', value: 'sendMsg'},
                    {label: '退款并且关闭', value: 'refundClose'},
                    {label: '传送调解方案', value: 'sendPlan'}
                ],
                returnAddress: '',//退货地址
                addressGroup: [],//退货地址下拉框数据,
                refund_part_amount: '',//部分退款金额
                remark: '',//备注
                refundWay: '',//退款方式
                refundWayGroup: [//退款方式下拉框数据
                    {label: '我已通过Paypal退款', value: 1},
                    {label: '我已退款，但并非通过Paypal', value: 2},
                ],
                message: ''//向买家发送友好讯息
            }
        },
        filters:{
            fdateTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss",val);
            },
            posterFilter(val) {
                let ret = '';
                switch (val) {
                    case 'BUYER':
                        ret = '买家';
                        break;
                    case 'SELLER':
                        ret = '卖家';
                        break;
                    case 'PAYPAL':
                        ret = 'Paypal';
                        break;
                }
                return ret
            }
        },
        mounted(){
            if(this.disputeData.due_date*1000-this.now>0) {
                this.countDownInterval();
            }
            this.radioGroup = this.group1
        },
        methods:{
            change_radio(val){
                console.log(val)
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
            //切换收获地址
            select_address(){

            },
            //切换退款方式
            select_refund_way(){

            }
        },
        computed:{
            filterCountDown(){
                if(this.disputeData.seller_response_due_date*1000-this.now>0) {
                    let sec = this.disputeData.seller_response_due_date*1000 - this.now;
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
        }
    }
</script>