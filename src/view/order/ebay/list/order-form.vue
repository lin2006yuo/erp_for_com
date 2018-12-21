<template>
    <el-row class="p-order-form">
        <page-dialog :title="`查看订单：${this.form.order_id} 信息`" v-model="orderDialog" :size="dialogSize" :close-on-click-modal="false">
            <tabs>
                <tab-head :navs="[{label:'订单基本信息',action:''},{label:'产品信息',action:'product'},{label:'收货人信息',action:'buyinfo'},{label:'支付方式',action:'saller'}]">
                    <el-row>
                        <el-col :span="12"><span class="label">订单号</span>:<span class="detail">{{form.order_id}}</span></el-col>
                        <el-col :span="12"><span class="label">订单来源</span>:<span class="detail">{{form.seller_user_id}}</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12"><span class="label">站点</span>:<span class="detail">{{form.site}}</span></el-col>
                        <el-col :span="12"><span class="label">平台买家Id</span>:<span class="detail">{{form.buyer_user_id}}</span></el-col>
                    </el-row>
                </tab-head>
    <!--  产品信息  -->
                <tab-item id="product" label="产品信息">
                    <el-table :data="form.sku_list" border style="width:100%">
                        <el-table-column label="ItemId" align="center" show-overflow-tooltip width="120" inline-template>
                                <a class="link" :href="`http://www.ebay.com/itm/${row.item_id}`" target="_blank">{{row.item_id}}</a>
                        </el-table-column>
                        <el-table-column inline-template label="平台SKU" align="center" show-overflow-tooltip width="150">
                            <div>
                                <span v-if="row.variation_sku">{{row.variation_sku}}</span>
                                <span v-else>{{row.sku}}</span>
                            </div>
                        </el-table-column>
                        <el-table-column inline-template label="产品图片" align="center" width="120">
                            <el-popover
                                    placement="right"
                                    trigger="hover">
                                <img v-lazy="sku_image(row.picture)"  width="200px" height="200px">
                                <span slot="reference">
                                    <img v-lazy="row.picture"  v-if="row.picture" height="60px" width="60px" style="border:none">
                                </span>
                            </el-popover>
                        </el-table-column>
                        <el-table-column label="商品名称" align="center" inline-template>
                            <div>
                                <ui-tip :content="row.title" :width="98"></ui-tip>
                            </div>
                        </el-table-column>
                        <el-table-column inline-template label="数量" align="center" width="120">
                            <span>{{row.quantity_purchased}}</span>
                        </el-table-column>
                        <el-table-column inline-template label="出售价" align="center" width="140">
                            <div>{{form.currency_id}}&nbsp;{{row.transaction_price | filterPrice}}</div>
                        </el-table-column>
                    </el-table>
                </tab-item>
    <!--  收货人信息  -->
                <tab-item id="buyinfo" label="收货人信息">
                    <div><span class="label">收货人：</span><span class="detail">{{form.shipping_address_name}}</span></div>
                    <div><span class="label">电子邮箱：</span><span class="detail">{{form.buyer_email}}</span></div>
                    <div><span class="label">联系电话：</span><span class="detail">{{form.shipping_address_phone}}</span></div>
                    <!--手机号无字段-->
                    <!--<div><span class="label">手机号：</span><span class="detail">{{form.shipping_address_phone}}</span></div>-->
                    <div><span class="label">收货人地区：</span><span class="detail">{{buyerAddress}}</span></div>
                    <div><span class="label">邮编：</span><span class="detail">{{form.shipping_address_postal_code}}</span></div>
                    <!--门牌号  无字段-->
                    <!--<div><span class="label">门牌号：</span><span class="detail"></span></div>-->
                    <div><span class="label">运输方式：</span><span class="detail">{{form.shipping_service_selected}}</span></div>
                    <div><span class="label">收货人详细地址1：</span><span class="detail">{{form.shipping_address_street1}}</span></div>
                    <div><span class="label">收货人详细地址2：</span><span class="detail">{{form.shipping_address_street2}}</span></div>
                </tab-item>
    <!--  支付方式 -->
                <tab-item id="saller" label="支付方式">
                        <div><span class="label">货币类型</span>:<span class="detail">{{form.currency_id}}</span></div>
                        <div><span class="label">支付金额</span>:<span class="detail">{{form.amount_paid | filterPrice}}</span></div>
                        <div><span class="label">产品总额</span>:<span class="detail">{{form.sku_list[0].transaction_price | filterPrice}}</span></div>
                        <div><span class="label">支付运费</span>:<span class="detail">{{form.shipping_service_cost | filterPrice}}</span></div>
                        <!--优惠价格 无字段-->
                        <!--<div><span class="label">优惠价格</span>:<span class="detail"></span></div>-->
                        <div><span class="label">支付方式</span>:<span class="detail">{{form.payment_method}}</span></div>
                        <div><span class="label">支付成功</span>:<span class="detail">{{form.payment_status}}</span></div>
                        <div><span class="label">付款日期</span>:<span class="detail">{{form.paid_time}}</span></div>
                        <div><span class="label">付款账号</span>:<span class="detail">{{form.payer}}</span></div>
                        <div><span class="label">收款账号</span>:<span class="detail">{{form.payee}}</span></div>
                        <div><span class="label">交易流水号</span>:<span class="detail">{{form.payment_transaction_id}}</span></div>
                        <div><span class="label">订单备注</span>:<span class="detail">{{form.remark}}</span></div>
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
                if(this.form) return this.form.shipping_address_city_name+","+this.form.shipping_address_state_or_province+","+this.form.shipping_address_postal_code+","+this.form.shipping_address_country
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
                return datef('YYYY-MM-dd',val);
            },
            filterPrice(val){
                return val?parseFloat(val).toFixed(2):'0.00';
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
            }
        },
        components: {
            pageDialog,
            tabs:require('../../../../components/tabs.vue').default,
            tabHead:require('../../../../components/tab-head.vue').default,
            tabItem:require('../../../../components/tab-item.vue').default,
            uiTip:require('../../../../components/ui-tip.vue').default,
        }
    }
</script>
