<template>
    <el-row class="p-order-form">
        <page-dialog :title="`查看订单：${this.form.order_id} 信息`" v-model="orderDialog" :size="dialogSize" :close-on-click-modal="false">
            <tabs>
                <tab-head :navs="[{label:'订单基本信息',action:''},{label:'产品信息',action:'product'},{label:'收货人信息',action:'buyinfo'},{label:'支付方式',action:'saller'}]">
                    <el-row>
                        <el-col :span="12"><span class="label">订单号：</span><span>{{form.order_id}}</span></el-col>
                        <el-col :span="12"><span class="label">订单生成时间：</span><span>{{form.gmt_create | filterSendTime}}</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12"><span class="label">订单状态：</span><span>{{form.order_status}}</span></el-col>
                        <el-col :span="12"><span class="label">平台买家Id：</span><span>{{form.buyer_login_id}}</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12"><span class="label">发货时间：</span><span>{{form.gmt_send_goods_time | filterSendTime}}</span></el-col>
                        <el-col :span="12"><span class="label">追踪号：</span><span>{{form.logistics_no}}</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12"><span class="label">付款状态：</span><span>{{form.pay_status}}</span></el-col>
                        <el-col :span="12"><span class="label">退款状态：</span><span>{{form.refund_status}}</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12"><span class="label">仓库发货时间：</span><span>{{form.shipping_time}}</span></el-col>
                        <el-col :span="12"><span class="label">仓库发货状态：</span><span>{{form.shipping_status}}</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12"><span class="label">放款时间：</span><span>{{form.loan_time | filterSendTime}}</span></el-col>
                        <el-col :span="12"><span class="label">放款状态：</span><span>{{form.loans_status}}</span></el-col>
                    </el-row>
                </tab-head>
    <!--  产品信息  -->
                <tab-item id="product" label="产品信息">
                        <el-table :data="form.orderProductList" border style="width:100%">
                            <el-table-column label="ItemId" align="center" show-overflow-tooltip width="120" inline-template>
                                <a class="link" :href="`https://www.aliexpress.com/item/lld/${row.product_id}.html`" target="_blank">{{row.product_id}}</a>
                            </el-table-column>
                            <el-table-column prop="sku_code" label="平台SKU" align="center" width="120" show-overflow-tooltip></el-table-column>
                            <el-table-column inline-template label="产品图片" align="center" width="120">
                                <el-popover
                                        placement="right"
                                        trigger="hover">
                                    <img v-lazy="sku_image(row.product_img_url)"  width="200px" height="200px">
                                    <span slot="reference">
                                        <img v-lazy="row.product_img_url" v-if="row.product_img_url" height="60px" width="60px" style="border:none">
                                    </span>
                                </el-popover>
                            </el-table-column>
                            <el-table-column inline-template label="产品名称" align="center">
                                <div>
                                    <ui-tip :content="row.product_name" :width="98"></ui-tip>
                                </div>
                            </el-table-column>
                            <el-table-column prop="product_count" label="商品数量" align="center" width="120"></el-table-column>
                            <el-table-column  inline-template label="出售价" align="center" width="120">
                                <div v-if="row.product_unit_price">{{row.product_unit_price.currencyCode}}  {{row.product_unit_price.amount}}</div>
                            </el-table-column>
                            <el-table-column label="买家选择的邮寄方式" inline-template>
                                <div>
                                    <ui-tip :content="row.logistics_service" :width="98"></ui-tip>
                                </div>
                            </el-table-column>
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
                        <div><span class="label">产品总额：</span><span class="detail">{{form.total_product_amount_all}}</span></div>
                        <div><span class="label">支付运费：</span><span class="detail">{{form.logistics_amount.amount}}</span></div>
                        <div><span class="label">支付方式：</span><span class="detail">{{form.payment_type}}</span></div>
                        <div><span class="label">支付时间：</span><span class="detail">{{form.gmt_pay_time | filterSendTime}}</span></div>
                        <div><span class="label">交货期限：</span><span class="detail">{{form.send_good_expire | filterSendTime}}</span></div>
                        <div><span class="label">订单备注：</span><span class="detail">{{form.content[0]}}</span></div>
                    </div>
                </tab-item>
            </tabs>
            <span slot="footer">
                <el-button type="default" @click.native="cancal" size="mini">关闭</el-button>
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
        font-weight:bold;
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
    export default{
        data(){
            return {
                orderDialog:false,
                dialogSize:'full',
            }
        },
        computed:{
            buyerAddress(){
                return this.form.receipt_address.detailAddress+","+this.form.receipt_address.city+","+this.form.receipt_address.province+","+this.form.receipt_address.zip+","+this.form.receipt_address.country;
            }
        },
        methods:{
            sku_image(images){
                if(!!images){
                    return images.replace('_60x60.','_200x200.');
                }
                return ""
            },
            cancal(){
                this.orderDialog=false;
            },
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
            }
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
        },
        components: {
            pageDialog,
            tabs:require('../../../../components/tabs.vue').default,
            tabHead:require('../../../../components/tab-head.vue').default,
            tabItem:require('../../../../components/tab-item.vue').default,
            uiTip:require('../../../../components/ui-tip.vue').default
        }
    }
</script>
