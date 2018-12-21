<template>
    <el-row class="p-order-form">
        <page-dialog :title="`查看订单：${this.checkList.order_number} 信息`" v-model="orderDialog" :size="dialogSize" :close-on-click-modal="false">
            <!--    cardControl     -->
            <tabs>
                <tab-head
                        :navs="[{label:'订单基本信息',action:''},{label:'产品信息',action:'product'},{label:'收货人信息',action:'buyinfo'},{label:'支付方式',action:'saller'}]">
                    <el-row>
                        <el-col :span="12"><span class="label">订单号</span>: <span class="detail">{{checkList.order_number}}</span></el-col>
                        <el-col :span="12"><span class="label">下单时间</span>: <span class="detail">{{checkList.created_time|timeFilter}}</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12"><span class="label">订单来源</span>: <span class="detail">{{checkList.account_name}}</span></el-col>
                        <el-col :span="12"><span class="label">订单状态</span>: <span class="detail">{{checkList.order_status}}</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12"><span class="label">平台买家Id</span>: <span class="detail">{{checkList.email}}</span></el-col>
                        <el-col :span="12"><span class="label">更新时间</span>: <span class="detail">{{checkList.last_update_time | timeFilter}}</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12"><span class="label">付款状态</span>: <span class="detail">{{checkList.payment_amount_status}}</span></el-col>
                        <el-col :span="12"><span class="label">仓库发货时间</span>: <span class="detail">{{checkList.shipping_time | timeFilter}}</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12"><span class="label">仓库发货状态</span>: <span class="detail">{{checkList.shipping_status}}</span></el-col>
                        <el-col :span="12"><span class="label">放款状态</span>: <span class="detail">{{checkList.transfer_amount_status}}</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12"><span class="label">放款时间</span>: <span class="detail">{{checkList.transfer_time | timeFilter}}</span></el-col>
                        <el-col :span="12"><span class="label">退款状态</span>: <span class="detail">{{checkList.refund_amount_status}}</span></el-col>
                    </el-row>
                </tab-head>
                <tab-item id="product" label="产品信息">
                    <el-table height="200" class="scroll-bar" :data="checkList.sku_list" border style="width:100%">
                        <el-table-column label="ItemId" align="center" show-overflow-tooltip width="180" inline-template>
                            <a class="link" :href="`https://${checkList.sales_channel}/gp/product/${row.item_id}`" target="_blank">{{row.item_id}}</a>
                        </el-table-column>
                        <el-table-column   prop="online_sku"  label="平台SKU/SKU" align="center" width="140"></el-table-column>
                        <el-table-column  inline-template label="商品名称" align="center">
                            <div>
                                <ui-tip :content="row.item_title" :width="98"></ui-tip>
                            </div>
                        </el-table-column>
                        <el-table-column  prop="qty"  label="数量" align="center" width="80"></el-table-column>
                        <el-table-column  inline-template label="出售价" align="center" width="80">
                            <div>{{checkList.currency}}&nbsp;{{row.item_price | filterPrice}}</div>
                        </el-table-column>
                    </el-table>
                </tab-item>
            <!--  收货人信息  -->
            <tab-item id="buyinfo" label="收货人信息">
                    <div>
                        <span class="label">收货人</span>:<span class="detail">{{checkList.user_name}}</span>
                    </div>
                    <div>
                        <span class="label">电子邮箱</span>:<span class="detail">{{checkList.email}}</span>
                    </div>
                    <div>
                        <span class="label">联系电话</span>:<span class="detail">{{checkList.phone}}</span>
                    </div>
                    <div>
                        <span class="label">手机号</span>:<span class="detail">{{checkList.phone}}</span>
                    </div>
                    <div>
                        <span class="label">收货人地区</span>:<span class="detail">{{checkList.address1}}{{checkList.street_address_2}}</span>
                    </div>
                    <div>
                        <span class="label">邮编</span>:<span class="detail">{{checkList.zip_code}}</span>
                    </div>
                    <div>
                        <span class="label">运输方式</span>:<span class="detail">{{checkList.ship_service_level }}</span>
                    </div>
                    <div>
                        <span class="label">运输类型</span>:<span class="detail">{{checkList.shipment_serviceLevel_category }}</span>
                    </div>
                </tab-item>
            <!--  支付方式 -->
                <tab-item id="saller" label="支付方式">
                    <div>
                        <span class="label">货币类型</span>:<span class="detail">{{checkList.currency}}</span>
                    </div>
                    <div>
                        <span class="label">支付金额</span>:<span class="detail">{{checkList.actual_total | filterPrice}}</span>
                    </div>
                    <div>
                        <span class="label">支付运费</span>:<span class="detail">{{checkList.actual_shipping | filterPrice}}</span>
                    </div>
                    <div>
                        <span class="label">优惠价格</span>:<span class="detail">{{checkList.promotion_discount | filterPrice}}</span>
                    </div>
                    <div>
                        <span class="label">支付方式</span>:<span class="detail">{{checkList.payment_method}}</span>
                    </div>
                    <div>
                        <span class="label">付款日期</span>:<span class="detail">{{ checkList.payment_time|timeFilter}}</span>
                    </div>
                    <div>
                        <span class="label">交易流水号</span>:<span class="detail">{{checkList.order_number}}</span>
                    </div>
                    <div>
                        <span class="label">交货期限</span>:<span class="detail">{{checkList.latest_ship_time | timeFilter}}</span>
                    </div>
                    </tab-item >

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
        width:120px;
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
    import pageDialog from  '../../../../components/page-dialog.vue'
    export default{
        data(){
            return {
                orderDialog:false,
                isHidden:false,
                isShow:true,
                dialogSize:"full",
                buyinfoShow:true,
                productShow:true,
                sallerShow:true
            }
        },
        methods:{
            cancal(){
                this.orderDialog=false;
            },
            show(isShow){
                this.productShow = isShow;
                this.buyinfoShow = isShow;
                this.sallerShow=isShow
                this.isShow = isShow;
            },
            hidden(){
                this.isHidden=!this.isHidden;
            },
            change_product(){
                this.productShow = true;
                this.buyinfoShow=false;
                this.sallerShow=false;
            },
            change_buyinfo(){
                this.buyinfoShow=true
                this.productShow=false
                this.sallerShow=false
            },
            change_saller(){
                this.buyinfoShow=false
                this.productShow=false
                this.sallerShow=true
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
        filters:{
            filterPrice(val){
                return val?parseFloat(val).toFixed(2):"0.00";
            },
            timeFilter(val){
                return val?datef("YYYY-MM-dd HH:mm:ss",val):'-- --';
            }
        },
        props:{
            value:{},
            checkList:{
                required:true,
                type:Object
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
