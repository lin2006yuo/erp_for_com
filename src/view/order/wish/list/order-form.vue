<template>
    <el-row class="wish-order-form">
        <page-dialog :title="`查看订单：${this.checkList.order_id} 信息`" v-model="orderDialog" :size="dialogSize" :close-on-click-modal="false">
            <!--    cardControl     -->
            <tabs>
                <tab-head :navs="[{label:'订单基本信息',action:''},{label:'产品信息',action:'product'},{label:'收货人信息',action:'buyinfo'},{label:'售后',action:'service'}]">
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">订单号</span>: <span class="detail">{{checkList.order_id }}&nbsp&nbsp&nbsp&nbsp<span class="is-wish-express" v-if="checkList.is_wish_express">&nbspWish Express&nbsp</span></span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">订单生成时间</span>: <span class="detail">{{checkList.transaction_date|dataFilter}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">店铺ID</span>: <span class="detail">{{checkList.merchant_id}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">订单状态</span>: <span class="detail">{{checkList.order_state}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">交易号</span>: <span class="detail">{{checkList.transaction_id}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">追踪号</span>: <span class="detail">{{checkList.tracking}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">跟踪确认</span>: <span class="detail">{{checkList.tracking_confirmed}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">提供者</span>: <span class="detail">{{checkList.provider}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">确认时间</span>: <span class="detail">{{checkList.tracking_confirmed_date|dataFilter}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">确认交付</span>: <span class="detail">{{checkList.confirmed_delivery}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">产品总额</span>: <span class="detail">{{checkList.total_cost}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">运费</span>: <span class="detail">{{checkList.shipping}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">最近更新时间</span>: <span class="detail">{{checkList.last_updated|dataFilter}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">交货期限</span>: <span class="detail">{{checkList.wish_express_delivery_deadline}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">付款状态</span>: <span class="detail">{{checkList.pay_status}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">仓库发货时间</span>: <span class="detail">{{checkList.shipping_time | dataFilter}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">仓库发货状态</span>: <span class="detail">{{checkList.shipping_status}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">放款状态</span>: <span class="detail">{{checkList.settlement_status}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">放款时间</span>: <span class="detail">{{checkList.transfer_time  | dataFilter}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">退款状态</span>: <span class="detail">{{checkList.refund_status}}</span>
                            </div>
                        </el-col>
                    </el-row>
                </tab-head>
            <!--  产品信息  -->
                <tab-item id="product" label="产品信息">
                    <el-table :data="checkList.payList" border>
                        <el-table-column label="ItemId" align="center" show-overflow-tooltip  inline-template width="200">
                            <div>
                                <a class="link" :href="row.product_link" target="_blank">{{row.product_id}}</a>
                            </div>
                        </el-table-column>
                        <el-table-column prop="sku" label="平台SKU"  align="center" width="180" show-overflow-tooltip></el-table-column>
                        <el-table-column label="产品图片"  align="center" width="100" inline-template>
                            <div>
                                <el-popover
                                        ref="popover"
                                        placement="right"
                                        trigger="hover">
                                    <img v-lazy="sku_image(row.product_image_url)" width="200px" height="200px">
                                </el-popover>
                                <img v-popover:popover  class="wish-img" v-lazy="row.product_image_url" width="60px" height="60px">
                            </div>
                        </el-table-column>
                        <el-table-column inline-template label="产品名称" align="center">
                            <div>
                                {{row.product}}
                            </div>
                        </el-table-column>
                        <el-table-column inline-template label="规格属性" width="90" align="center">
                            <div>
                                {{checkList.attribute}}
                            </div>
                        </el-table-column>
                        <el-table-column prop="quantity" label="数量" align="center"  width="60" show-overflow-tooltip></el-table-column>
                        <el-table-column label="出售价" align="center" inline-template  width="100" show-overflow-tooltip>
                            <div>
                                {{row.price}}（{{row.currency_code}}）
                            </div>
                        </el-table-column>
                    </el-table>
                </tab-item>
            <!--  收货人信息  -->
                <tab-item id="buyinfo" label="收货人信息">
                    <div class="row-content">
                        <span class="label">收货人</span>:<span class="detail">{{checkList.name}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">联系电话</span>:<span class="detail">{{checkList.phone_number}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">收货人地区</span>:<span class="detail">{{checkList.country}}{{checkList.state}}{{checkList.city}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">地址1</span>:<span class="detail">{{checkList.street_address_1}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">地址2</span>:<span class="detail">{{checkList.street_address_2}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">邮编</span>:<span class="detail">{{checkList.zipcode}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">运输地址</span>:<span class="detail">{{checkList.shipping_address}}（{{checkList.city}}）</span>
                    </div>
                </tab-item>
            <!--  售后 -->
                <tab-item id="service" label="售后">
                    <div class="row-content">
                        <span class="label">退款责任</span>:<span class="detail">{{checkList.refund_responsibility}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">退款责任金额</span>:<span class="detail">{{checkList.refund_responsibility_amount}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">退款时间</span>:<span class="detail">{{checkList.refund_date|dataFilter}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">退款原因</span>:<span class="detail">{{checkList.refund_reason}}</span>
                    </div>
                </tab-item>
            </tabs>

            <span slot="footer">
                <el-button type="default" size="mini" @click.native="cancal">关闭</el-button>
            </span>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">
    .wish-order-form{
        .el-table__body-wrapper{
            overflow-x: hidden;
        }
        .row-content{
            display: flex;
            align-items: center;
            .label{
                display: inline-block;
                width:120px;
                text-align:right;
                padding:3px 5px;
                font-weight: bold;
            }
            .detail{
                width: 80%;
                padding:3px 5px;
                .is-wish-express{
                    background-color #f60;
                    color #fff;
                }
            }
        }
        .a_hover{
            &:hover{
                font-size: 1.2rem !important;
                text-decoration: underline;
            }
        }
        .wish-img{
            vertical-align: middle;
            padding: 5px 0;
            cursor: -webkit-zoom-in;
        }
    }

</style>
<script>
    import pageDialog from '../../../../components/page-dialog.vue';
    import  tabs from '../../../../components/tabs.vue';
    import  tabItem from '../../../../components/tab-item.vue'
    import tabHead from '../../../../components/tab-head.vue'
    export default{
        data(){
            return {
                orderDialog:false,
                isHidden:false,
                isShow:true,
                dialogSize:'full',
                productShow:true,
                buyinfoShow:true,
                sallerShow:true,
                profit:true,
                sale:true
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
        mounted(){
            this.orderDialog=this.value;
        },
        filters:{
            dataFilter(val){//-----------日期过滤
                return datef('YYYY-MM-dd HH:mm:ss', val);
            }
        },
        computed:{
            sum:function () {
                return this.checkList.price*this.checkList.quantity
            }
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
            checkList:{
                required:true,
                type:Object
            }
        },
        components: {
            pageDialog,
            tabs,
            tabItem,
            tabHead,
        }
    }
</script>
