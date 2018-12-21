<template>
    <el-row class="wish-order-form">
        <page-dialog :title="`查看订单：${this.checkList.order_id} 信息`" v-model="orderDialog" :size="dialogSize" :close-on-click-modal="false">
            <!--    cardControl     -->
            <tabs>
                <tab-head :navs="[{label:'订单基本信息',action:''},{label:'产品信息',action:'product'},{label:'收货人信息',action:'buyinfo'}]">
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">订单号</span>: <span class="detail">{{checkList.order_id}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">订单生成时间</span>: <span class="detail">{{checkList.create_time|dateFilter}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">账号简称</span>: <span class="detail">{{checkList.shop_code}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">订单状态</span>: <span class="detail">{{checkList.status}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">交易ID</span>: <span class="detail">{{checkList.transaction_id}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">付款时间</span>: <span class="detail">{{checkList.create_time|dateFilter}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">出售价</span>: <span class="detail">{{checkList.shipping_cost}}</span>
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
                                <span class="label">支付总额</span>: <span class="detail">{{checkList.shipping_cost}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">币种</span>: <span class="detail">{{checkList.money_nuit}}</span>
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
                                <span class="label">运输方式</span>: <span class="detail">{{checkList.shipping_type}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">发货时间</span>: <span class="detail">{{checkList.shipping_time|dateFilter}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">最近更新时间</span>: <span class="detail">{{checkList.update_time|dateFilter}}</span>
                            </div>
                        </el-col>
                    </el-row>
                </tab-head>
            <!--  产品信息  -->
                <tab-item id="product" label="产品信息">
                    <el-table :data="checkList.sku_list" border>
                        <el-table-column label="ItemId" align="center" show-overflow-tooltip  inline-template width="330">
                            <div>
                                <ui-tip :content="row.product_id" :is-link="true" @cur-click="cur_click(row)"></ui-tip>
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
                                {{row.name}}
                            </div>
                        </el-table-column>
                        <el-table-column prop="qty_ordered" label="数量" align="center"  width="60"s show-overflow-tooltip></el-table-column>
                        <el-table-column label="出售价" align="center" inline-template  width="100" show-overflow-tooltip>
                            <div>
                                {{row.price}}（{{checkList.money_nuit}}）
                            </div>
                        </el-table-column>
                    </el-table>
                </tab-item>
            <!--  收货人信息  -->
                <tab-item id="buyinfo" label="收货人信息">
                    <div class="row-content">
                        <span class="label">买家ID</span>:<span class="detail">{{checkList.customer_id}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">收货人</span>:<span class="detail">{{checkList.address_firstname}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">电话</span>:<span class="detail">{{checkList.address_phone}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">国家</span>:<span class="detail">{{checkList.address_country}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">州</span>:<span class="detail">{{checkList.address_city}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">城市</span>:<span class="detail">{{checkList.address_state}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">街道地址1</span>:<span class="detail">{{checkList.address_address}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">街道地址2</span>:<span class="detail">{{checkList.address_address2}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">邮编</span>:<span class="detail">{{checkList.address_pincode}}</span>
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
            dateFilter(val){//-----------日期过滤
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
