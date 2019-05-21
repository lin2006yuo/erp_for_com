<template>
    <el-row class="wish-order-form">
        <page-dialog :title="`查看订单：${this.checkList.order_id} 信息`" v-model="orderDialog" :size="dialogSize" :close-on-click-modal="false">
            <!--    cardControl     -->
            <tabs>
                <tab-head :navs="[{label:'订单基本信息',action:''},{label:'产品信息',action:'product'},{label:'收货人信息',action:'buyinfo'},{label:'支付方式',action:'service'}]">
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">订单号</span>: <span class="detail">{{checkList.order_id}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">订单生成时间</span>: <span class="detail">{{checkList.create_time|dataFilter}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">账号简称</span>: <span class="detail">{{checkList.code}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">订单状态</span>: <span class="detail">{{checkList.order_status}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">追踪号</span>: <span class="detail">{{checkList.tracking_number}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">运输方式</span>: <span class="detail">{{checkList.transportation}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">发货时间</span>: <span class="detail">- -</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">是否取消</span>: <span class="detail">{{checkList.is_cancel}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">最近更新时间</span>: <span class="detail">{{checkList.updated_at|dataFilter}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">取消原因</span>: <span class="detail">{{checkList.reson}}</span>
                            </div>
                        </el-col>
                    </el-row>
                </tab-head>
                <!--  产品信息  -->
                <tab-item id="product" label="产品信息">
                    <el-table :data="checkList.sku_list" border>
                        <el-table-column label="ItemId" align="center" show-overflow-tooltip  inline-template width="330">
                            <div>
                                <ui-tip :content="row.order_item_id" :is-link="true" @cur-click="cur_click(row)"></ui-tip>
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
                                {{row.product_title}}
                            </div>
                        </el-table-column>
                        <el-table-column prop="quantity" label="数量" align="center"  width="60" show-overflow-tooltip></el-table-column>
                        <el-table-column label="出售价" align="center" inline-template  width="100" show-overflow-tooltip>
                            <div>
                                {{row.product_variant_price}}（{{row.currency}}）
                            </div>
                        </el-table-column>
                    </el-table>
                </tab-item>
                <!--  收货人信息  -->
                <tab-item id="buyinfo" label="收货人信息">
                    <div class="row-content">
                        <span class="label">买家ID</span>:<span class="detail">{{checkList.address_shipping.buyer_id}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">收货人</span>:<span class="detail">{{checkList.address_shipping.buyer_name}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">电话</span>:<span class="detail">{{checkList.address_shipping.tel}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">国家</span>:<span class="detail">{{checkList.address_shipping.country}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">州</span>:<span class="detail">{{checkList.address_shipping.state}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">城市</span>:<span class="detail">{{checkList.address_shipping.city}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">公司</span>:<span class="detail">{{checkList.address_shipping.company}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">地址1</span>:<span class="detail">{{checkList.address_shipping.address1}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">地址2</span>:<span class="detail">{{checkList.address_shipping.address2}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">邮编</span>:<span class="detail">{{checkList.address_shipping.postcode}}</span>
                    </div>
                </tab-item>
                <!--  支付方式 -->
                <tab-item id="service" label="支付方式">
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">支付总额</span>: <span class="detail">{{checkList.payment.total_price}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">支付方式</span>: <span class="detail">{{checkList.payment.payment_method}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">产品总额</span>: <span class="detail">{{checkList.payment.goods_total}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">支付状态</span>: <span class="detail">{{checkList.payment.payment_status}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">支付运费</span>: <span class="detail">{{checkList.payment.shipping_fee}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">币种</span>: <span class="detail">{{checkList.payment.currency}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">付款日期</span>: <span class="detail">{{checkList.payment.created_at|dataFilter}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">退款时间</span>: <span class="detail">{{checkList.payment.refund_time}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">付款状态</span>: <span class="detail">{{checkList.payment.payment_status}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">退款原因</span>: <span class="detail">{{checkList.payment.refund_reson}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <div class="row-content">
                        <span class="label">订单备注</span>:<span class="detail">- -</span>
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
            cur_click(val){
                window.open(`${val.buy_url}`);
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
            uiTip:require('@/components/ui-tip').default,
        }
    }
</script>
