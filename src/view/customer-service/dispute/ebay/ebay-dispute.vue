<template>
    <div class="p-ebay-reques">
        <el-card style="border: 0;">
            <div class="box-attr">
                <div class="attr-now">
                    <div class="label_">{{disputeData.dispute_id_type}}：</div>
                    <div class="detail_">{{disputeData.dispute_id}}</div>
                </div>
                <div class="attr-now">
                    <div class="label_">状态：</div>
                    <div class="detail_">{{disputeData.state}}</div>
                </div>
                <div class="attr-now">
                    <div class="label_">原因：</div>
                    <div class="detail_">{{disputeData.reason}}</div>
                </div>
                <div class="attr-now">
                    <div class="label_">发起时间：</div>
                    <div class="detail_">{{disputeData.dispute_time}}</div>
                </div>
            </div>
            <div>
                <span>操作日志</span>
                <el-button
                        type="primary"
                        size="mini"
                        style="margin-bottom: 5px;"
                        class="fr"
                        v-if="disputeData.dispute_type==='RETURN'||disputeData.dispute_type==='NOTRECIVE'"
                        @click="refund_btn(false)">
                    新建售后单
                </el-button>
            </div>
            <el-table
                    class="mt-xs scroll-bar"
                    :data="disputeData.response_history"
                    border
                    :height="tableHeight"
                    highlight-current-row>
                <el-table-column prop="auther" label="操作人" width="80" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作时间" inline-template show-overflow-tooltip width="130">
                    <div>{{row.creation_time|fdatetime}}</div>
                </el-table-column>
                <el-table-column label="内容" align="left" inline-template>
                    <div style="word-break: keep-all;" v-html="filterLog(row.notes)"></div>
                </el-table-column>
            </el-table>
            <template  v-if="!!disputeData.images&&disputeData.images.length>0">
            <span>买家提供的资料</span>
            <div class="box-attr">
                <el-row>
                        <div v-for="src in disputeData.images" class="inline mt-mini ml-mini mr-mini">
                            <el-popover
                                v-if="src.includes('.jpeg')||src.includes('.jpg')||src.includes('.png')||src.includes('.JPEG')||src.includes('.JPG')||src.includes('.PNG')"
                                placement="right"
                                trigger="hover">
                                <img v-lazy="sku_image(src)" width="200px" height="200px">
                                <span slot="reference">
                                                    <img v-lazy="sku_image(src)"
                                                         @click="search_img(src)"
                                                         height="60px"
                                                         width="60px"
                                                         style="border:none">
                                                </span>
                            </el-popover>
                            <a :href="src|filterSrc" v-else></a>
                        </div>
                </el-row>
            </div>
            </template>
            <div style="margin-top:10px" v-if="isLook">在 <span class="span_">{{disputeData.response_due}}</span>
                之前回应
            </div>
            <div class="box-regues" v-if="isLook">
                <el-radio-group v-model="cancel"
                                v-if="disputeData.dispute_type==='CANCEL'||disputeData.dispute_type==='NOTPAID'"
                                @change="change_cancel">
                    <el-radio class="radio" label="approve">接收</el-radio>
                    <el-radio class="radio" label="reject">拒绝</el-radio>
                </el-radio-group>
                <el-radio-group v-model="inquiry" v-if="disputeData.dispute_type==='NOTRECIVE'"
                                @change="change_inquiry">
                    <el-radio class="radio" label="message">发送留言</el-radio>
                    <el-radio class="radio" label="refund">全额退款</el-radio>
                    <el-radio class="radio" label="shipment">提供发货信息</el-radio>
                    <el-radio class="radio" label="escalate">升级</el-radio>
                </el-radio-group>
                <el-radio-group v-model="refundable" v-if="disputeData.dispute_type==='RETURN'"
                                @change="change_refundable">
                    <el-radio class="radio" label="refund">全额退款</el-radio>
                    <template v-if="disputeData.status!=='ITEM_SHIPPED'">
                        <template v-if="filterStatus">
                            <el-radio class="radio" label="part_refund">部分退款</el-radio>
                            <el-radio class="radio" label="return">退货</el-radio>
                            <el-radio class="radio" label="message">发送留言</el-radio>
                            <el-radio class="radio" label="decline">拒绝</el-radio>
                        </template>
                        <el-radio class="radio" label="escalate">升级</el-radio>
                    </template>
                </el-radio-group>
                <el-radio-group v-model="upgrade" v-if="disputeData.dispute_type==='ESCALATE'" @change="change_upgrade">
                    <el-radio class="radio" label="refund">全额退款</el-radio>
                    <el-radio class="radio" label="address">提供退货地址</el-radio>
                </el-radio-group>
                <div v-if="cancel==='reject'" class="regues-detail">
                    <div class="dispute-content">
                        <label>发货时间</label>
                        <el-date-picker type="date" placeholder="发货时间" v-model="date_e"
                                        class="inline data-picker"></el-date-picker>
                    </div>
                    <div class="dispute-content">
                        <label>跟踪号</label>
                        <el-input v-model="tracking" placeholder="跟踪号" class="inline"></el-input>
                    </div>
                </div>
                <div class="regues-detail">
                    <el-checkbox v-model="isInvalid" v-if="cancel==='approve'">作废订单</el-checkbox>
                    <div class="dispute-content" v-if="cancel==='approve'">
                        <label>全额退款，退款金额：</label>
                        <span class="span_">{{disputeData.refund_currency}} {{disputeData.total_refund}}</span>
                    </div>
                    <div v-if="inquiry==='shipment'">
                        <div class="dispute-content">
                            <label>承运人</label>
                            <el-input v-model="carrier_name" placeholder="承运人" class="inline"></el-input>
                        </div>
                        <div class="dispute-content">
                            <label>跟踪号</label>
                            <el-input v-model="tracking_num" placeholder="跟踪号" class="inline"></el-input>
                        </div>
                        <div class="dispute-content">
                            <label>发货时间</label>
                            <el-date-picker type="date" placeholder="发货时间" v-model="shipment_date"
                                            class="inline data-picker"></el-date-picker>
                        </div>
                    </div>
                    <div class="dispute-content" v-if="inquiry==='escalate'||refundable==='escalate'">
                        <label>原因</label>
                        <el-select v-model="reason" placeholder="请选择">
                            <el-option
                                    v-for="item in options"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="dispute-content" v-if="refundable==='refund'||inquiry==='refund'||upgrade==='refund'">
                        <label>退款金额：</label>
                        <span class="span_">{{disputeData.refund_currency}} {{disputeData.total_refund}}</span>
                    </div>
                    <div class="dispute-content" v-if="refundable==='part_refund'">
                        <label>退款金额：</label>
                        <span style="padding-right:5px">{{disputeData.refund_currency}}</span>
                        <el-input type="number" v-model="refund_amount" class="inline" min="0"
                                  @blur="blur_num"></el-input>
                        <span>不可高于：{{disputeData.refund_currency}} {{disputeData.total_refund}}</span>
                    </div>
                    <div class="regues-detail" v-if="refundable==='return'">
                        <div class="dispute-content">
                            <el-radio class="radio" :disabled="true">由ebay提供物流面单 <span class="span_">(暂不提供使用)</span>
                            </el-radio>
                        </div>
                        <div class="dispute-content">
                            <el-radio class="radio" v-model="logistics" label="logistics_num">由我提供物流面单</el-radio>
                        </div>
                        <div v-if="logistics==='logistics_num'">
                            <image-upload :thumbnail-mode="true" :multiple="false"
                                          :image="{width:'100px',height:'100px'}" :init="init"></image-upload>
                        </div>
                    </div>
                    <!--提供退货地址-->
                    <div v-if="upgrade==='address'">
                        <div class="dispute-content">
                            <label class="address">收货人名称</label>
                            <el-input v-model="name" placeholder="姓名" class="inline"></el-input>
                        </div>
                        <div class="dispute-content">
                            <label class="address">国家</label>
                            <el-input v-model="country" placeholder="国家" class="inline"></el-input>
                        </div>
                        <div class="dispute-content">
                            <label class="address">州省</label>
                            <el-input v-model="province" placeholder="州/省" class="inline"></el-input>
                        </div>
                        <div class="dispute-content">
                            <label class="address">城市</label>
                            <el-input v-model="city" placeholder="城市" class="inline"></el-input>
                        </div>
                        <div class="dispute-content">
                            <label class="address">详细地址</label>
                            <el-input style="width:80%" class="inline" type="textarea" v-model="street"
                                      :autosize="{ minRows: 2, maxRows: 4}"></el-input>
                        </div>
                        <div class="dispute-content">
                            <label class="address">邮编</label>
                            <el-input v-model="postal_code" placeholder="邮编" class="inline"></el-input>
                        </div>
                    </div>
                    <div
                            v-if="refundable==='return'||
                        inquiry==='message'||
                        inquiry==='shipment'||
                        inquiry==='escalate'||
                        refundable==='message'||
                        refundable==='escalate'||
                        refundable==='decline'||
                        upgrade==='address'">
                        <div class="dispute-content">
                            <label>留言</label>
                        </div>
                        <el-input
                                type="textarea"
                                :rows="4"
                                placeholder="请输入内容"
                                v-model="textarea">
                        </el-input>
                    </div>
                </div>
            </div>
        </el-card>
        <!--退款退货补发货组件-->
        <add ref="addAfter"
             :is-dispute="isDispute"
             :dispute-params="disputeParams"
             :order-number="orderNumber"
             @submit="canClose"
             @save="canClose"
             v-model="addDialog"
             :is-trigger="isTrigger"></add>
    </div>
</template>
<style lang="stylus">
    .p-ebay-reques {
    .el-card__body {
        padding: 0;
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
        width: 75px;
        text-align: right;
        font-weight: bold;
    }
    .detail_ {
        width: 220px;
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
    table.template td, .el-table td, table.template th, .el-table th {
        padding: 0;
        height: 26px;
        box-sizing: border-box;
        border-right: 1px solid #e0e6ed;
        border-bottom: 1px solid #e0e6ed;
    }
    }

</style>
<script>
    import {
        api_dispute_cancel,
        api_dispute_inquiry,
        api_dispute_return,
        api_dispute_reasons,
        api_dispute_case
    } from '../../../../api/dispute'

    export default {
        data() {
            return {
                cancel: '',//---取消交易radio
                isInvalid: false,//-------作废订单checkbox
                date_e: '',//---------发货日期
                tracking: '',//-------跟踪单号,
                inquiry: '',//--------未收到货radio
                textarea: '',//------留言多文本框
                carrier_name: '',//-----------承运人
                tracking_num: '',//------跟踪号
                shipment_date: '',//------发货日期
                reason: '',//---升级原因
                options: [],//升级原因下拉框
                refundable: '',//-----退货退款
                refund_amount: '',//----退款金额
                logistics: '',
                my_logistics: '',
                isCheck: false,
                init: [],
                upgrade: '',//升级
                name: '',//--收货人名称
                country: '',//---国家
                province: '',//---省
                city: '',//--城市
                street: '',//--详细地址
                postal_code: '',//---邮编
                addDialog: false,
                isTrigger: false,
                orderNumber: "",
                isDispute: false,
                disputeParams:{
                    type:'',
                    dispute_id:'',
                    dispute_type:'',
                    refund_amount:''
                }
            }
        },
        methods: {
            sku_image(images){
                if(!!images){
                    return `${config.apiHost}${images.replace('_60x60.','_200x200.')}`;
                }
                return ""
            },
            search_img(image){
                window.open(`${config.apiHost}${image.replace('60x60','500x500')}`);
            },
            //退款退货补发货
            refund_btn(isDispute,type) {
                if(isDispute){
                    this.disputeParams.dispute_id = this.disputeData.dispute_id;
                    this.disputeParams.dispute_type = this.disputeData.dispute_type;
                }
                this.disputeParams.type = this.get_dispute_type(type);
                this.isDispute = isDispute;
                this.addDialog = true;
                this.orderNumber = this.formData.order_number;
                this.isTrigger = true;
                this.$nextTick(() => {
                    this.$refs.addAfter.search();
                })
            },
            //-----切换radio 清空数据
            change_cancel(val) {
                this.date_e = '';
                this.tracking = '';
            },
            change_inquiry(val) {
                this.textarea = '';
                this.reason = '';
            },
            change_refundable(val) {
                this.refund_amount = '';
                this.logistics = '';
                this.my_logistics = '';
                this.isCheck = false;
                this.textarea = '';
                this.init = [];
            },
            change_upgrade() {
                this.textarea = '';
                this.name = this.disputeData.seller_address.name;
                this.country = this.disputeData.seller_address.country;
                this.province = this.disputeData.seller_address.province;
                this.city = this.disputeData.seller_address.city;
                this.street = this.disputeData.seller_address.street;
                this.postal_code = this.disputeData.seller_address.postal_code;
            },
            //---------end
            //退款金额input 失去焦点事件
            blur_num() {
                if (this.refund_amount <= 0) {
                    this.refund_amount = ''
                }
            },
            //获取升级原因数据(下拉框)
            reasons() {
                let params = {
                    dispute_type: this.disputeData.dispute_type,
                    code: 'escalate'
                };
                this.options = [];
                this.$http(api_dispute_reasons, params).then(res => {
                    this.options = res;
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'})
                })
            },

            //-------回应
            get_dispute_type(type){
                if(/*type==='return'||*/type==='part_refund'||type==='refund'){
                    return type==='return'?4:1
                }else{
                    return false
                }

            },
            submit() {
                switch (this.disputeData.dispute_type) {
                    //取消交易
                    //未付款
                    case 'CANCEL':
                    case 'NOTPAID':
                        if(this.cancel===''){
                            this.$message({type:'warning',message:'请选择回应方式！'});
                            break
                        }
                        let params = {
                            id: this.disputeData.markId,
                            operate: this.cancel
                        };
                        if (this.cancel === 'approve') {
                            this.isInvalid = true;
                            params.invalid = this.isInvalid ? 1 : 0;//---作废订单
                        } else if (this.cancel === 'reject') {
                            this.isInvalid = false;
//                            发货日期格式转换
                            if (this.date_e) {
                                params.shipment_date = datef('YYYY-MM-dd', this.date_e / 1000);
                            } else {
                                params.shipment_date = ""
                            }
                            params.tracking_num = this.tracking;//----发货单号
                        }
                        this.$http(api_dispute_cancel, params).then(res => {
                            this.$message({
                                message: res.message || res,
                                type: 'success'
                            });
                            this.$emit('can-close')
                        }).catch(code => {
                            this.$message({message: code.message || code, type: 'error'})
                        });
                        break;
                    //未收到货
                    case 'NOTRECIVE':
                        if(this.inquiry===''){
                            this.$message({type:'warning',message:'请选择回应方式！'});
                            break
                        }
                        if(this.get_dispute_type(this.inquiry)){
                            this.disputeParams.refund_amount = this.disputeData.total_refund;
                            this.refund_btn(true, this.inquiry);
                        }else {
                            let data = {
                                id: this.disputeData.markId,
                                operate: this.inquiry,
                                message: this.textarea
                            };
                            if (this.inquiry === 'shipment') {
                                if(this.carrier_name===''){
                                    this.$message({type:'warning',message:'请填写承运人！'});
                                    break
                                }
                                if(this.tracking_num===''){
                                    this.$message({type:'warning',message:'请填写跟踪单号！'});
                                    break
                                }
                                if(this.shipment_date===''){
                                    this.$message({type:'warning',message:'请选择发货时间！'});
                                    break
                                }
                                data.carrier_name = this.carrier_name;//--承运人
                                data.tracking_num = this.tracking_num;//跟踪单号
//                            发货日期格式转换
                                if (this.shipment_date) {
                                    data.shipment_date = datef('YYYY-MM-dd', this.shipment_date / 1000);
                                } else {
                                    data.shipment_date = ""
                                }
                            } else if (this.inquiry === 'escalate') {
                                data.reason = this.reason;
                            }
                            if(this.textarea===''){
                                this.$message({type:'warning',message:'请填写留言！'});
                                break
                            }
                            this.$http(api_dispute_inquiry, data).then(res => {
                                this.$message({
                                    message: res.message || res,
                                    type: 'success'
                                });
                                this.textarea = '';
                                this.$emit('can-close');
                            }).catch(code => {
                                this.$message({message: code.message || code, type: 'error'})
                            });
                        }
                        break;
                    //退货退款
                    case 'RETURN':
                        if(this.refundable===''){
                            this.$message({type:'warning',message:'请选择回应方式！'});
                            break
                        }
                        if(this.get_dispute_type(this.refundable)) {
                            if(this.refundable === 'part_refund'){
                                if(!this.refund_amount) {
                                    this.$message({type: 'warning', message: '请填写退款金额！'});
                                    break
                                }
                                if(this.refund_amount>this.disputeData.total_refund){
                                    this.$message({type: "warning", message: "可退款金额不能超过最大退款金额"});
                                    break
                                }
                                this.disputeParams.refund_amount = this.refund_amount;

                            }else{
                                this.disputeParams.refund_amount = this.disputeData.total_refund;
                            }
                            this.refund_btn(true, this.refundable);
                        }else {
                            let returnData = {
                                id: this.disputeData.markId,
                                operate: this.refundable,
                                message: this.textarea
                            };
                            if (this.refundable === 'part_refund') {
                                returnData.refund_amount = this.refund_amount
                            } else if (this.refundable === 'return') {
                                returnData.upload_file = this.init.length > 0 ? this.init[0].image : '';
                            }else if (this.refundable === 'escalate') {
                                returnData.reason = this.reason;
                            }
                            this.$http(api_dispute_return, returnData).then(res => {
                                this.$message({
                                    message: res.message || res,
                                    type: 'success'
                                });
                                this.textarea = '';
                                this.$emit('can-close');
                            }).catch(code => {
                                this.$message({message: code.message || code, type: 'error'})
                            });
                        }
                        break;
                    //升级
                    default:
                        if(this.upgrade===''){
                            this.$message({type:'warning',message:'请选择回应方式！'});
                            break
                        }
                        if(this.get_dispute_type(this.upgrade)) {
                            this.disputeParams.refund_amount = this.disputeData.total_refund;
                            this.refund_btn(true, this.upgrade);
                        }else {
                            let upgradeData = {
                                id: this.disputeData.markId,
                                operate: this.upgrade,
                                message: this.textarea
                            };
                            if (this.upgrade === 'address') {
                                upgradeData.name = this.name;
                                upgradeData.country = this.country;
                                upgradeData.province = this.province;
                                upgradeData.city = this.city;
                                upgradeData.street = this.street;
                                upgradeData.postal_code = this.postal_code;
                            }
                            this.$http(api_dispute_case, upgradeData).then(res => {
                                this.$message({
                                    message: res.message || res,
                                    type: 'success'
                                });
                                this.textarea = '';
                                this.$emit('can-close');
                            }).catch(code => {
                                this.$message({message: code.message || code, type: 'error'})
                            });
                        }
                        break;
                }
            },
            canClose(data){
                this.$emit('can-close',data);
            },
            filterLog(val) {
                return val.replace(/(\r|\n)+/gm, `<br>`);
            }
        },
        filters: {
            fdatetime(val) {
                return datef('YYYY-MM-dd HH:mm:ss', val);
            },
            filterSrc(val){
                return `${config.apiHost}${val}`
            }
        },
        watch: {
            inquiry(val) {
                if (val === 'escalate') {
                    this.reasons();
                }
            },
            refundable(val) {
                if (val === 'escalate') {
                    this.reasons();
                }
            },
            'disputeData.dispute_id'(val){
                this.isDispute = false;
                this.disputeParams = {
                    type:'',
                    dispute_id:'',
                    dispute_type:'',
                    refund_amount:''
                }
            }
        },
        computed: {
            tableHeight() {
                if (this.disputeData.state !== 'CLOSED') {
                    if (this.cancel || this.inquiry || this.refundable || this.upgrade) {
                        return 180;
                    } else {
                        return 300;
                    }
                } else {
                    return 450;
                }
            },
            isLook(){
                if(this.disputeIsLook){
                    return false
                }else {
                    return this.disputeData.state!=='CLOSED'
                }
            },
            filterStatus(){
                if(this.disputeData.status==='WAITING_FOR_RETURN_LABEL'||
                    this.disputeData.status==='WAITING_FOR_RMA'||
                    this.disputeData.status==='READY_FOR_SHIPPING'||
                    this.disputeData.status==='ITEM_DELIVERED'||
                    this.disputeData.status==='READY_FOR_SHIPPING'){
                    return false
                }
                return true
            }
        },
        props: {
            disputeData: {
                type: Object
            },
            formData: {},
            disputeIsLook:{
                default(){
                    return false
                }
            }
        },
        components: {
            uiTips: require('../../../../components/ui-tip.vue').default,
            imageUpload: require('../../smt/inbox/image-upload.vue').default,
            times: require('../../../../components/times.vue').default,
            add: require('./add.vue').default
        }
    }
</script>
