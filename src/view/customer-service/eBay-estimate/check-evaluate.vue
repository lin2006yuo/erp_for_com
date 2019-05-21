<template>
    <div class="p-check-evaluate">
        <page-dialog :title="title" size="large" @open="open" v-model="dialog" v-loading="replyLoading" :close-on-click-modal="false">
            <div>
              <el-row>
                <el-col :span="8"><span class="bold order-margin">订单号：<span class="operate" @click="look_order">{{checkData.order_number}}</span></span></el-col>
                <el-col :span="16" style="text-align: left"><img class="img" src="../../../assets/good.png" v-if="checkData.feedback.comment_type==1">
                  <img class="img" src="../../../assets/centre.png" v-else-if="checkData.feedback.comment_type==2">
                  <img class="img" src="../../../assets/bad.png" v-else-if="checkData.feedback.comment_type==3">
                  <img class="img" src="../../../assets/stay.png" v-else>
                  <span>{{checkData.feedback.comment_text_buyer}}</span>
                  <span class="bold str-color">{{checkData.feedback.handel_str}}</span>
                  <span style="display: block">{{checkData.feedback.comment_text_seller}}</span>
                  <span style="display: block">{{checkData.feedback.response}}</span>
                  <span style="display: block">{{checkData.feedback.followup}}</span>
                </el-col>
              </el-row>
            </div>
            <div class="box-wripper">
                <el-row>
                    <el-col :span="12">
                        <div class="baseInfo">
                            <span class="label">金额：</span>
                            <span>
                                USD {{checkData.order_amount}}（商品：{{checkData.pay_fee}}+运费：{{checkData.shipping_fee}}+保险：{{checkData.insure_fee}}+税费：{{checkData.invoice_fee}}）
                            </span>
                        </div>
                        <div class="baseInfo">
                            <span class="label">买家：</span><span>{{checkData.buyer_id}}</span>
                        </div>
                        <div class="baseInfo">
                            <span class="label">发货地址：</span>
                            <div class="detail">
                                <div>
                                     {{checkData.source_address.address}}
                                </div>
                                <div>
                                    {{checkData.source_address.address2}}
                                </div>
                            </div>
                        </div>
                        <div class="baseInfo">
                            <span class="label">发货仓库：</span><span v-for="item in checkData.package_list" :key="item">{{item.warehouse_name}}</span>
                        </div>
                        <div class="baseInfo">
                            <span class="label">邮寄方式：</span><span v-for="item in checkData.package_list" :key="item">{{item.shipping_name}}</span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div>
                            <span class="bold baseline">订单销售号：{{checkData.order_number}}</span>
                            <el-button type="primary" size="mini" class="fr" @click="refund">退款退货补发货</el-button>
                        </div>
                        <el-table :data="checkData.detail_goods" style="width: 100%;margin-top:10px" height="200">
                            <el-table-column label="销售号" width="80" inline-template>
                                <div>
                                    <ui-tips  :content="checkData.order_number"></ui-tips>
                                </div>
                            </el-table-column>
                            <el-table-column label="Item" width="140" inline-template show-overflow-tooltip>
                                <div>（{{row.item_id}}）×{{row.sku_quantity}}</div>
                            </el-table-column>
                            <el-table-column  label="商品" inline-template show-overflow-tooltip>
                                <div>
                                    <img :src="row.sku_thumb" width="30" height="30" class="baseline">
                                    <ui-tips  :content="row.sku_title+' '+row.sku+'×'+row.sku_quantity"></ui-tips>
                                   <!-- <div class="inline">{{row.sku_title}}{{row.sku}}×{{row.sku_quantity}}</div>-->
                                </div>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </div>
            <el-row v-if="checkData.feedback.messageLists&&checkData.feedback.messageLists.length>0" class="mb-xs">
                <div><span class="bold order-margin">站内信历史</span></div>
                <div class="message-box">
                    <div v-for="(de,de_i) in checkData.feedback.messageLists" :key="de_i"
                         @click="message_click(de,de_i)">
                        <el-card
                            :class="['mb-xs',de.message_type===1?'buyer-background':'',de.isCheck?'right-active':'','pointer']">
                            <div style=" padding: 5px;border-radius: 5px">
                                <el-row>
                                    <el-col :span="19">{{de.subject+'213'}}</el-col>
                                    <el-col :span="5">
                                        <div class="mr-xs" style="text-align: right;">{{de.send_time|filterDate}}</div>
                                    </el-col>
                                </el-row>
                                <el-row style="min-height: 16px">
                                    <div class="inline">
                                        <span v-if="de.message_type===1" class="buyer">买</span>
                                        <span v-if="de.message_type!==1" class="seller">卖</span>
                                        <span style="color:#3300FF">{{de.sender}}</span>
                                    </div>
                                    <span class="fr"> {{de.receive_date}}</span>
                                </el-row>
                            </div>
                            <div class="max-heigh flex">
                                <div class="flex-1">
                                    <el-input type="textarea"
                                              class="custom-textarea"
                                              :autosize="{minRows: 4, maxRows: 20}"
                                              :disabled="true"
                                              v-model="de.text"></el-input>
                                    <!--{{de.text}}-->
                                </div>
                                <el-popover placement="left" trigger="hover">
                                    <img :src="de.item_img||'/static/error-picture-128.png'" width="150px"
                                         height="150px">
                                    <span slot="reference">
                                                        <a :href="de.item_url" target="_blank">
                                                         <img :src="de.item_img||'/static/error-picture-128.png'"
                                                              height="60px" width="60px"
                                                              style="border:1px solid #ccc;border-radius: 2px">
                                                            </a>
                                                        </span>
                                </el-popover>
                            </div>
                        </el-card>
                    </div>
                </div>
            </el-row>
            <div v-if="isShow">
                <el-tabs v-model="activeTab" type="card">
                    <el-tab-pane label="给买家发送站内信" name="sendMessage"><el-input
                        type="textarea"
                        :rows="4"
                        placeholder="输入内容..."
                        v-model="textarea">
                    </el-input></el-tab-pane>
                    <el-tab-pane label="给买家回复评价" name="sendEvaluate"><el-input
                        type="textarea"
                        :rows="4"
                        :maxlength="80"
                        placeholder="请输入，内容限制80个字符"
                        v-model="evaluateTextarea">
                    </el-input></el-tab-pane>
                </el-tabs>
            </div>
            <div slot="footer">
                <el-button type="primary" size="mini" v-if="isShow && checkData.feedback.handel_status!=2" @click="handle">处理完成</el-button>
                <el-button type="primary" size="mini" v-if="isShow && checkData.feedback.comment_type ===3&&activeTab==='sendEvaluate'" :disabled="evaluateTextarea===''" @click="reply_evaluation">回复评价</el-button>
                <el-button type="primary" size="mini" v-if="isShow&&activeTab!=='sendEvaluate'" @click="submit" :disabled="textarea==''">{{activeTab==='sendMessage'?'发送站内信':'确认'}}</el-button>
                <el-button size="mini" @click.native="dialog = false;">关闭</el-button>
            </div>
            <add ref="addAfter" :order-number="orderNumber" v-model="addDialog" :is-trigger="isTrigger"></add>
            <form-mdf :mdfid="mdfid"
                      ref="formmfd"
                      v-model="orderVisable"
                      :has-after-remark="true"
                      :title="mdfTitle"
                      :isShow="isLook"
                      :is-edit="isEdit"></form-mdf>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .p-check-evaluate{
        .box-wripper{
            margin: 10px 0;
            padding:10px 10px 20px;
            border:1px solid #BDCDDC;
            background-color:#F1F6FC;
        }
        .message-box{
            max-height 250px;
            overflow-y auto;
        }
        .baseInfo{
            display: flex;
            align-items: center;
            .label{
                display: inline-block;
                width:60px;
                text-align:right;
                padding:10px 0;
            }
        }
        .bold{
            font-weight: bold;
        }
        .str-color{
            color: red;
        }
        .order-margin{
            margin-right: 10px;
        }
        .img{
            vertical-align: bottom;
        }
        .baseline{
            vertical-align: -webkit-baseline-middle;
        }
        .buyer-background {
            background: #d0e5cb;
        }
        .buyer {
            display: inline-block;
            background: #FF0000;
            color: #FFFFEF;
            line-height: 20px;
            font-weight: 600;
            font-size: 1.25rem;
            padding: 2px 5px;
            border-radius: 4px;
        }
        .seller {
            display: inline-block;
            background: #FFCC06;
            color: #1F77A2;
            line-height: 20px;
            font-weight: 600;
            font-size: 1.25rem;
            padding: 2px 5px;
            border-radius: 4px;
        }
        .red {
            color: red;
        }
        .sort {
            display: flex;
            background-color: #E3ECF7;
            span {
                flex: 1;
                text-align: center;
                border: 1px solid #E5E9F2;
                line-height: 26px;
                cursor: pointer;
                &:hover {
                    color: white;
                    background: #587DCB;
                }
            }
        }
        .collapse {
            height: 400px;
            overflow-x: hidden;
            overflow-y: auto;
            .head {
                &:hover {
                    background: #d0e5cb;
                }
            }
            .active {
                .head {
                    border-radius: 4px;
                    border: 1px solid #5E93FF !important;
                    box-shadow: 0 0 7px #5E93FF;
                    /*background: rgba(173,227,255,.5);*/
                    &:hover {
                        background: #d0e5cb;
                    }
                }
            }
            .active-sm {
                border-radius: 4px;
                border: 1px solid #5E93FF !important;
                box-shadow: 0 0 7px #5E93FF;
                /*background: rgba(173,227,255,.5);*/
                &:hover {
                    background: #d0e5cb;
                }
            }
        }
        .history {
            .el-table__body-wrapper {
                min-height: 130px;
            }
        }
        .rightCard {
            height: 400px;
            .max-heigh {
                max-height: 300px;
                width: 100%;
                overflow-y: auto;
                overflow-x: hidden;
            }
            .el-card__body {
                height: 100%;
                > div {
                    height: 100%;
                }
            }
        }

        .loadMore {
            text-align: center;
            .more {
                cursor: pointer;
                color: #69f;
                &:hover {
                    color: blue;
                }
            }
        }
        .right-active {
            border-radius: 4px;
            border: 1px solid #5E93FF !important;
            box-shadow: 0 0 7px #5E93FF;
            &:hover {
                background: #d0e5cb;
            }
        }

    }

</style>
<script>
    import {api_sendMsg,api_status,api_reply} from '../../../api/eBay-estimate'
    export default{
        data(){
            return {
                dialog:false,
                textarea:'',
                evaluateTextarea:'',
                addDialog:false,
                orderNumber:"",
                isTrigger:false,
                activeTab:'sendMessage',
                mdfid:0,
                mdfTitle:'',
                orderVisable:false,
                isLook:false,
                isEdit: {edit: false}
            }
        },
        created(){
        },
        mounted(){
        },
        methods: {
            open(){
                this.textarea = '';
                this.evaluateTextarea = '';
            },
//            退款退货补货
            refund(){
                this.addDialog = true;
                this.orderNumber = this.checkData.order_number;
                this.isTrigger = true;
                this.$nextTick(()=>{
                  this.$refs.addAfter.search();
                })
            },
//            确认
            submit(){
                let data = {
                    id:this.checkId,
                    text:this.textarea
                };
                this.$http(api_sendMsg,data).then(res=>{
                    this.$message({
                        message: res.message||res,
                        type: 'success'
                    });
                    if(!!res.data){
                        this.checkData.feedback.messageLists.push(res.data);
                    }
                }).catch(code=>{this.$message({message:code.message||code,type:'error'});})
            },
//            处理
            handle(){
                let data = {
                    id:this.checkId,
                    status:2
                };
                this.$http(api_status,data).then(res=>{
                    this.$message({
                        message: res.message||res,
                        type: 'success'
                    });
                    this.dialog = false;
                }).catch(code=>{this.$message({message:code.message||code,type:'error'});})
            },
            message_click(de, index) {
                this.checkData.feedback.messageLists.forEach(row => {
                    this.$set(row, 'isCheck', false)
                });
                de.isCheck = true
            },
            reply_evaluation(){
                let data = {
                    id:this.checkId,
                    text:this.evaluateTextarea
                };
                this.$http(api_reply,data).then(res=>{
                    this.$message({
                        message: res.message||res,
                        type: 'success'
                    });
                    this.dialog = false;
                }).catch(code=>{this.$message({message:code.message||code,type:'error'});})

            },
            look_order(){
                this.mdfid = this.checkData.order_id;
                this.$refs.formmfd.require_server(this.mdfid);
                this.mdfTitle = `查看订单号：${this.checkData.order_number} 信息`;
                this.orderVisable = true;
                this.isLook = false;
            }
        },
        filters: {
            filterDate(val){
                return val?datef('YYYY-MM-dd HH:mm:ss',val):'-- --';
            },
        },
        watch: {
            value(val){
                this.dialog = val;
            },
            dialog(val){
                this.$emit('input',val);
            }
        },
        computed: {},
        props: {
            value:{},
            checkData:{},
            isShow:{},
            checkId:{},
            title:{},
            replyLoading:{}
            },
        components: {
          pageDialog:require('../../../components/page-dialog.vue').default,
            uiTips:require('../../../components/ui-tip.vue').default,
            add:require('../after-sale/add.vue').default,
            formMdf: require('../../order/local/form-mdf.vue').default,
        }
    }
</script>
