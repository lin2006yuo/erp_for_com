<template>
    <el-row class="p-order-form">
        <page-dialog title="查看订单" v-model="orderDialog" :size="dialogSize" :close-on-click-modal="false" @change="change_dialog">
            <tabs  v-if="!isLook" >
                <tab-head :navs="navs">
                    <el-row>
                        <el-col :span="12"><span class="label">订单号：</span><span>{{form.order_id}}</span></el-col>
                        <el-col :span="12"><span class="detail">订单生成时间：</span><span>{{form.gmt_create | filterSendTime}}</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12"><span class="label">订单状态：</span><span>{{form.order_status}}</span></el-col>
                        <el-col :span="12"><span class="detail">平台买家Id：</span><span>{{form.buyer_login_id}}</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12"><span class="label">发货时间：</span><span>{{form.gmt_send_goods_time | filterSendTime}}</span></el-col>
                        <el-col :span="12"><span class="detail">追踪号：</span><span>{{form.logistics_no}}</span></el-col>
                    </el-row>
                </tab-head>
    <!--  产品信息  -->
                <tab-item id="product" label="产品信息">
                        <el-table :data="form.orderProductList" border style="width:100%">
                            <el-table-column prop="product_id" label="ItemId" align="center" show-overflow-tooltip width="120"></el-table-column>
                            <el-table-column prop="sku_code" label="平台SKU" align="center" width="120" show-overflow-tooltip></el-table-column>
                            <el-table-column inline-template label="产品图片" align="center" width="120">
                                <img :src="row.product_snap_url" style="width:87px">
                            </el-table-column>
                            <el-table-column prop="product_name" label="产品名称" align="center"  show-overflow-tooltip></el-table-column>
                            <el-table-column prop="product_count" label="商品数量" align="center" width="120"></el-table-column>
                            <el-table-column prop="product_unit_price.amount" label="出售价" align="center" width="120"></el-table-column>
                        </el-table>
                </tab-item>
                <!--  收货人信息  -->
                <tab-item id="buyinfo" label="收货人信息">
                        <div><span class="label">收件人：</span><span class="detail">{{form.receipt_address.contactPerson}}</span></div>
                        <div><span class="label">买家ID：</span><span>{{form.buyer_login_id}}</span></div>
                        <div><span class="label">联系电话：</span><span class="detail">{{form.receipt_address.phoneNumber}}</span></div>
                        <div><span class="label">手机号：</span><span class="detail">{{form.receipt_address.mobileNo}}</span></div>
                        <div><span class="label">收货人地区：</span><span class="detail">{{buyerAddress}}</span></div>
                        <div><span class="label">地址1：</span><span class="detail">{{form.receipt_address.detailAddress}}</span></div>
                        <div><span class="label">地址2：</span><span class="detail">{{form.receipt_address.address2}}</span></div>
                        <div><span class="label">邮编：</span><span class="detail">{{form.receipt_address.zip}}</span></div>
                </tab-item>
    <!--  支付方式 -->
                <tab-item id="saller" label="支付方式">
                    <div>
                        <div><span class="label">货币类型：</span><span class="detail">{{form.pay_amount.currencyCode}}</span></div>
                        <div><span class="label">支付金额：</span><span class="detail">{{form.pay_amount.amount}}</span></div>
                        <div><span class="label">产品总额：</span><span class="detail">{{form.pay_amount.amount}}</span></div>
                        <div><span class="label">支付运费：</span><span class="detail">{{form.escrow_fee}}</span></div>
                        <div><span class="label">支付方式：</span><span class="detail">{{form.payment_type}}</span></div>
                        <div><span class="label">支付时间：</span><span class="detail">{{form.gmt_pay_time | filterSendTime}}</span></div>
                        <div><span class="label">交货期限：</span><span class="detail">{{form.send_good_expire | filterSendTime}}</span></div>
                        <div><span class="label">订单备注：</span><span class="detail">{{form.content[0]}}</span></div>
                    </div>
                </tab-item>
            </tabs>
           <el-row  v-else :gutter="10">
               <el-col :span="14">
                   <tabs   >
                       <tab-head :navs="[{label:'订单基本信息',action:''},{label:'产品信息',action:'product'},{label:'收货人信息',action:'buyinfo'},{label:'支付方式',action:'saller'}]">
                           <el-row>
                               <el-col :span="12"><span class="label">订单号：</span><span>{{form.order_id}}</span></el-col>
                               <el-col :span="12"><span class="detail">订单生成时间：</span><span>{{form.gmt_create | filterSendTime}}</span></el-col>
                           </el-row>
                           <el-row>
                               <el-col :span="12"><span class="label">订单状态：</span><span>{{form.order_status}}</span></el-col>
                               <el-col :span="12"><span class="detail">平台买家Id：</span><span>{{form.buyer_login_id}}</span></el-col>
                           </el-row>
                           <el-row>
                               <el-col :span="12"><span class="label">发货时间：</span><span>{{form.gmt_send_goods_time | filterSendTime}}</span></el-col>
                               <el-col :span="12"><span class="detail">追踪号：</span><span>{{form.logistics_no}}</span></el-col>
                           </el-row>
                       </tab-head>
                       <!--  产品信息  -->
                       <tab-item id="product" label="产品信息">
                           <el-table :data="form.orderProductList" border style="width:100%">
                               <el-table-column prop="product_id" label="ItemId" align="center" show-overflow-tooltip ></el-table-column>
                               <el-table-column prop="sku_code" label="平台SKU" align="center"  show-overflow-tooltip></el-table-column>
                               <el-table-column inline-template label="产品图片" align="center" width="120">
                                   <img :src="row.product_snap_url" style="width:87px">
                               </el-table-column>
                               <el-table-column prop="product_name" label="产品名称" align="center"  show-overflow-tooltip></el-table-column>
                               <el-table-column prop="product_count" label="商品数量" align="center" ></el-table-column>
                               <el-table-column prop="product_unit_price.amount" label="出售价" align="center"></el-table-column>
                           </el-table>
                       </tab-item>
                       <!--  收货人信息  -->
                       <tab-item id="buyinfo" label="收货人信息">
                           <div><span class="label">收件人：</span><span class="detail">{{form.receipt_address.contactPerson}}</span></div>
                           <div><span class="label">买家ID：</span><span>{{form.buyer_login_id}}</span></div>
                           <div><span class="label">联系电话：</span><span class="detail">{{form.receipt_address.phoneNumber}}</span></div>
                           <div><span class="label">手机号：</span><span class="detail">{{form.receipt_address.mobileNo}}</span></div>
                           <div><span class="label">收货人地区：</span><span class="detail">{{buyerAddress}}</span></div>
                           <div><span class="label">地址1：</span><span class="detail">{{form.receipt_address.detailAddress}}</span></div>
                           <div><span class="label">地址2：</span><span class="detail">{{form.receipt_address.address2}}</span></div>
                           <div><span class="label">邮编：</span><span class="detail">{{form.receipt_address.zip}}</span></div>
                       </tab-item>
                       <!--  支付方式 -->
                       <tab-item id="saller" label="支付方式">
                           <div>
                               <div><span class="label">货币类型：</span><span class="detail">{{form.pay_amount.currencyCode}}</span></div>
                               <div><span class="label">支付金额：</span><span class="detail">{{form.pay_amount.amount}}</span></div>
                               <div><span class="label">产品总额：</span><span class="detail">{{form.pay_amount.amount}}</span></div>
                               <div><span class="label">支付运费：</span><span class="detail">{{form.escrow_fee}}</span></div>
                               <div><span class="label">支付方式：</span><span class="detail">{{form.payment_type}}</span></div>
                               <div><span class="label">支付时间：</span><span class="detail">{{form.gmt_pay_time | filterSendTime}}</span></div>
                               <div><span class="label">交货期限：</span><span class="detail">{{form.send_good_expire | filterSendTime}}</span></div>
                               <div><span class="label">订单备注：</span><span class="detail">{{form.content[0]}}</span></div>
                           </div>
                       </tab-item>
                   </tabs>
               </el-col>
               <el-col :span="10">
                    <el-card>
                            <el-card>
                                <el-row>
                                        <label-item label-item label-width="100" label="纠纷id：">
                                            <span>{{rightData.issue_id}}</span>
                                        </label-item>
                                </el-row>
                                <el-row>
                                    <label-item label-item label-width="100" label="原因：">
                                        <span>{{rightData.reason_cn}}</span>
                                    </label-item>
                                </el-row>
                                <el-row>
                                    <el-col :span=12>
                                        <label-item label-item label-width="100" label="状态：">
                                            <span>{{rightData.issue_status}}</span>
                                        </label-item>
                                    </el-col>
                                    <el-col :span=12>
                                        <label-item label-item label-width="100" label="最迟响应时间：">
                                            <span>{{rightData.expire_time|filterSendTime}}</span>
                                        </label-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span=12>
                                        <label-item label-item label-width="100" label="方案创建时间：">
                                            <span>{{rightData.create_time|filterSendTime}}</span>
                                        </label-item>
                                    </el-col>
                                    <el-col :span=12>
                                        <label-item label-item label-width="100" label="方案修改时间：">
                                            <span>{{rightData.modified_time|filterSendTime}}</span>
                                        </label-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span=12>
                                        <label-item label-item label-width="100" label="退款金额本币：">
                                            <span>{{rightData.refund_money_max_local}}</span>
                                        </label-item>
                                    </el-col>
                                    <el-col :span=12>
                                        <label-item label-item label-width="100" label="退款金额美金：">
                                            <span>{{rightData.refund_money_max}}</span>
                                        </label-item>
                                    </el-col>
                                </el-row>
                            </el-card>
                        <div v-if="rightData.solution.buyer"  v-for="(item,index) in rightData.solution.buyer" :key="index">
                                <label  class="mt-xs mb-xs inline"> 买家方案
                                    <span v-if="rightData.solution.buyer.lenght>1">{{index+1}}</span></label>
                                <el-card>
                                    <el-row>
                                        <el-col :span=12>
                                            <label-item label-item label-width="100" label="是否默认方案：">
                                                <span>{{item.is_default|filMoney_back3x}}</span>
                                            </label-item>
                                        </el-col>
                                        <el-col :span=12>
                                            <label-item label-item label-width="100" label="方案提出者：">
                                                <span>{{item.issue_status}}</span>
                                            </label-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <label-item label-item label-width="100" label="方案内容：">
                                            <span>{{item.content}}</span>
                                        </label-item>
                                    </el-row>
                                    <el-row>
                                        <el-col :span=12>
                                            <label-item label-item label-width="100" label="运费承担方：">
                                                <span>{{item.logistics_fee_bear}}</span>
                                            </label-item>
                                        </el-col>
                                        <el-col :span=12>
                                            <label-item label-item label-width="100" label="方案类型：">
                                                <span>{{item.solution_type}}</span>
                                            </label-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span=12>
                                            <label-item label-item label-width="100" label="达成时间：">
                                                <span>{{item.reached_time|filterSendTime}}</span>
                                            </label-item>
                                        </el-col>
                                        <el-col :span=12>
                                            <label-item label-item label-width="100" label="状态：">
                                                <span>{{item.status}}</span>
                                            </label-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span=12>
                                            <label-item label-item label-width="100" label="方案达成类型：">
                                                <span>{{item.reached_type}}</span>
                                            </label-item>
                                        </el-col>
                                        <el-col :span=12>
                                            <label-item label-item label-width="100" label="退款运费金额：">
                                                <span>{{item.logistics_fee}}</span>
                                            </label-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span=12>
                                            <label-item label-item label-width="100" label="买家接受时间：">
                                                <span>{{item.buyer_accept_time|filterSendTime}}</span>
                                            </label-item>
                                        </el-col>
                                        <el-col :span=12>
                                            <label-item label-item label-width="100" label="卖家接受时间：">
                                                <span>{{item.seller_accept_time|filterSendTime}}</span>
                                            </label-item>
                                        </el-col>
                                    </el-row>
                                </el-card>
                            </div>
                        <div v-if="rightData.solution.platform"  v-for="(item,index) in rightData.solution.platform" :key="index">
                            <label  class="mt-xs mb-xs inline"> 平台方案
                                <span v-if="rightData.solution.buyer.lenght>1">{{index+1}}</span></label>
                            <el-card>
                                <el-row>
                                    <el-col :span=12>
                                        <label-item label-item label-width="100" label="是否默认方案：">
                                            <span>{{item.is_default|filMoney_back3x}}</span>
                                        </label-item>
                                    </el-col>
                                    <el-col :span=12>
                                        <label-item label-item label-width="100" label="方案提出者：">
                                            <span>{{item.issue_status}}</span>
                                        </label-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <label-item label-item label-width="100" label="方案内容：">
                                        <span>{{item.content}}</span>
                                    </label-item>
                                </el-row>
                                <el-row>
                                    <el-col :span=12>
                                        <label-item label-item label-width="100" label="运费承担方：">
                                            <span>{{item.logistics_fee_bear}}</span>
                                        </label-item>
                                    </el-col>
                                    <el-col :span=12>
                                        <label-item label-item label-width="100" label="方案类型：">
                                            <span>{{item.solution_type}}</span>
                                        </label-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span=12>
                                        <label-item label-item label-width="100" label="达成时间：">
                                            <span>{{item.reached_time|filterSendTime}}</span>
                                        </label-item>
                                    </el-col>
                                    <el-col :span=12>
                                        <label-item label-item label-width="100" label="状态：">
                                            <span>{{item.status}}</span>
                                        </label-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span=12>
                                        <label-item label-item label-width="100" label="方案达成类型：">
                                            <span>{{item.reached_type}}</span>
                                        </label-item>
                                    </el-col>
                                    <el-col :span=12>
                                        <label-item label-item label-width="100" label="退款运费金额：">
                                            <span>{{item.logistics_fee}}</span>
                                        </label-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span=12>
                                        <label-item label-item label-width="100" label="买家接受时间：">
                                            <span>{{item.buyer_accept_time|filterSendTime}}</span>
                                        </label-item>
                                    </el-col>
                                    <el-col :span=12>
                                        <label-item label-item label-width="100" label="卖家接受时间：">
                                            <span>{{item.seller_accept_time|filterSendTime}}</span>
                                        </label-item>
                                    </el-col>
                                </el-row>
                            </el-card>
                        </div>
                        <div v-if="rightData.solution.seller"  v-for="(item,index) in rightData.solution.seller">
                            <label  class="mt-xs mb-xs inline"> 卖家方案
                                <span v-if="rightData.solution.buyer.lenght>1">{{index+1}}</span></label>
                            <el-card>
                                <el-row>
                                    <el-col :span=12>
                                        <label-item label-item label-width="100" label="是否默认方案：">
                                            <span>{{item.is_default|filMoney_back3x}}</span>
                                        </label-item>
                                    </el-col>
                                    <el-col :span=12>
                                        <label-item label-item label-width="100" label="方案提出者：">
                                            <span>{{item.issue_status}}</span>
                                        </label-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <label-item label-item label-width="100" label="方案内容：">
                                        <span>{{item.content}}</span>
                                    </label-item>
                                </el-row>
                                <el-row>
                                    <el-col :span=12>
                                        <label-item label-item label-width="100" label="运费承担方：">
                                            <span>{{item.logistics_fee_bear}}</span>
                                        </label-item>
                                    </el-col>
                                    <el-col :span=12>
                                        <label-item label-item label-width="100" label="方案类型：">
                                            <span>{{item.solution_type}}</span>
                                        </label-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span=12>
                                        <label-item label-item label-width="100" label="达成时间：">
                                            <span>{{item.reached_time|filterSendTime}}</span>
                                        </label-item>
                                    </el-col>
                                    <el-col :span=12>
                                        <label-item label-item label-width="100" label="状态：">
                                            <span>{{item.status}}</span>
                                        </label-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span=12>
                                        <label-item label-item label-width="100" label="方案达成类型：">
                                            <span>{{item.reached_type}}</span>
                                        </label-item>
                                    </el-col>
                                    <el-col :span=12>
                                        <label-item label-item label-width="100" label="退款运费金额：">
                                            <span>{{item.logistics_fee}}</span>
                                        </label-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span=12>
                                        <label-item label-item label-width="100" label="买家接受时间：">
                                            <span>{{item.buyer_accept_time|filterSendTime}}</span>
                                        </label-item>
                                    </el-col>
                                    <el-col :span=12>
                                        <label-item label-item label-width="100" label="卖家接受时间：">
                                            <span>{{item.seller_accept_time|filterSendTime}}</span>
                                        </label-item>
                                    </el-col>
                                </el-row>
                            </el-card>
                        </div>
                    </el-card>
               </el-col>
           </el-row>

            <span slot="footer">
                <el-button type="primary" @click.native="cancal" size="mini">关闭</el-button>
            </span>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">
    table.profit{
        width:100%;
        box-sizing:border-box;
        border-collapse:collapse;
        border-left:1px solid #e0e6ed;
        border-top:1px solid #e0e6ed;
        font-size:1.2rem;
         td{
            border-right:1px solid #e0e6ed;
            border-bottom:1px solid #e0e6ed;
            height:30px;
            text-align: center;
            padding:0 10px;
        }
        .green{
            color:#599F47;
        }
        .red{
            color:#FF1F4F;
        }
    }

    .show-icon,.hidden-icon{
        display: inline-block;
        width:16px;
        height:19px;
    }
    .show-icon{
        background:url(../../../../assets/up.png) no-repeat 0 3px;
    }
    .hidden-icon{
        background: url(../../../../assets/down.png) no-repeat 0 3px;
    }
    .ml{
        margin-left:25px;
    }
    .label{
        display: inline-block;
        width:140px;
        text-align:right;
        padding:3px 5px;
    }
    .detail{
        padding:3px 5px;
        width:200px;
    }
    .point{
        cursor: pointer;
    }
    .own-control{
        margin:5px 10px;
        border:1px solid #A1B7CD;
        .own-control-header {
            box-sizing: border-box;
            padding: 3px 8px;
            height: 40px;
            line-height: 34px;
            background-color: #43A4DE;
            border-bottom: 1px solid #ddd;
            color: #fff;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        }
    }
</style>
<script>
    import pageDialog from '../../../../components/page-dialog.vue';
    import {api_get_issue} from "../../../../api/dispute"
    export default{
        data(){
            return {
                orderDialog:false,
                dialogSize:'full',
                id:0,
                rightData:{
                    solution:""
                },
                navs:[{label:'订单基本信息',action:''},{label:'产品信息',action:'product'},{label:'收货人信息',action:'buyinfo'},{label:'支付方式',action:'saller'}]
            }
        },
        computed:{
            buyerAddress(){
                return this.form.receipt_address.detailAddress+","+this.form.receipt_address.city+","+this.form.receipt_address.province+","+this.form.receipt_address.zip+","+this.form.receipt_address.country;
            }
        },
        methods:{
            cancal(){
                this.orderDialog=false;
            },
            change_dialog(val){
                console.log("navs",this.navs)
                if(val&&this.isLook){
                this.get_right();
                }
            },
            get_right(){
                    this.rightData={solution:""};
                this.$http(api_get_issue,this.id).then(res=>{
                        this.rightData=res;
                }).catch(code=>{
                    console.log(code)
                })
            }
        },
        filters:{
            filterSendTime(val){
                return datef('YYYY-MM-dd HH:mm:ss',val);
            },
            filMoney_back3x(val){
                if(val==0){
                    return "否"
                }else{
                    return "是"
                }
            },
        },
        mounted(){
            this.orderDialog=this.value;
        },
        watch:{
            orderDialog(val){
                this.$emit("input",val)
            },
            value(val){
                this.orderDialog=val
            }
        },
        props:{
            value:{},
            form:{
                required:true,
                type:Object,
            },
            isLook:{
                required:true,
                type:Boolean,
            }
        },
        components: {
            pageDialog,
            tabs:require('../../../../components/tabs.vue').default,
            tabHead:require('../../../../components/tab-head.vue').default,
            tabItem:require('../../../../components/tab-item.vue').default,
            labelItem:require("../../../../components/label-item.vue").default
        }
    }
</script>
