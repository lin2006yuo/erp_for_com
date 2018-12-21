<template>
    <el-row class="paypal-order-form">
        <page-dialog :title="`查看订单ID：${checkList.id} 信息`" v-model="orderDialog" :size="dialogSize" :close-on-click-modal="false">
            <!--    cardControl     -->
            <tabs>
                <tab-head :navs="[{label:'订单基本信息',action:''},{label:'产品信息',action:'product'},{label:'收货人信息',action:'buyinfo'}]">
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">ID</span>: <span class="detail">{{checkList.id}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">交易号</span>: <span class="detail">{{checkList.txn_id}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">支付状态</span>: <span class="detail">{{checkList.payment_status}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">付款日期</span>: <span class="detail">{{checkList.payment_date}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">交易类型</span>: <span class="detail">{{checkList.txn_type}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">付款类型</span>: <span class="detail">{{checkList.payment_type}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">收款账号</span>: <span class="detail">{{checkList.receiver_email}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">付款账号</span>: <span class="detail">{{checkList.payer_email}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">买家关联账号</span>: <span class="detail">{{checkList.parent_txn_id}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">买家ID</span>: <span class="detail">{{checkList.auction_buyer_id}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">最终支付金额</span>: <span class="detail">{{checkList.amt}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">币种</span>: <span class="detail">{{checkList.mc_currency}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">支付运费</span>: <span class="detail">{{checkList.shipping_fee}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">paypal税</span>: <span class="detail">{{checkList.mc_fee}}</span>
                            </div>
                        </el-col>
                    </el-row>
                </tab-head>
            <!--  产品信息  -->
                <tab-item id="product" label="产品信息">
                    <el-table :data="checkList.item" border>
                        <el-table-column prop="number" label="item_number"></el-table-column>
                        <el-table-column prop="name" label="产品名称"></el-table-column>
                        <el-table-column prop="quantity" label="数量"></el-table-column>
                    </el-table>
                </tab-item>
            <!--  收货人信息  -->
                <tab-item id="buyinfo" label="收货人信息">
                    <div class="row-content">
                        <span class="label">收件人姓名</span>:<span class="detail">{{checkList.address_name}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">国家</span>:<span class="detail">{{checkList.address_country}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">国家简称</span>:<span class="detail">{{checkList.address_country_code}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">州/省</span>:<span class="detail">{{checkList.address_state}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">城市</span>:<span class="detail">{{checkList.address_city}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">地址1</span>:<span class="detail">{{checkList.address_street}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">地址2</span>:<span class="detail">{{checkList.address_street2}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">邮编</span>:<span class="detail">{{checkList.address_zip}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">电话</span>:<span class="detail">{{checkList.phone}}</span>
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
    .paypal-order-form{
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
    import pageDialog from '../../../components/page-dialog.vue';
    import  tabs from '../../../components/tabs.vue';
    import  tabItem from '../../../components/tab-item.vue'
    import tabHead from '../../../components/tab-head.vue'
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
            tabHead


        }
    }
</script>
