<template>
    <el-row class="wish-order-form">
        <page-dialog :title="`查看订单：${checkList.order_id} 信息`" v-model="viewDialog" size="full" :close-on-click-modal="false">
            <!--    cardControl     -->
            <tabs>
                <tab-head :navs="[{label:'订单基本信息',action:''},{label:'产品信息',action:'product'},{label:'收货人信息',action:'buyinfo'},{label:'售后',action:'service'}]">
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">订单号</span>: <span class="detail">{{checkList.order_id}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">订单生成时间</span>: <span class="detail">{{checkList.time_created|dateFilter}}</span>
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
                                <span class="label">订单状态</span>: <span class="detail">{{checkList.status|statusFilter}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">交易ID</span>: <span class="detail">{{checkList.line_number}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">付款时间</span>: <span class="detail">{{checkList.time_paid|dateFilter}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">出售价</span>: <span class="detail">{{checkList.sub_total}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">运费</span>: <span class="detail">{{checkList.shipping_amount}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">支付总额</span>: <span class="detail">{{checkList.order_amount}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">追踪号</span>: <span class="detail">{{checkList.tracking_number}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">币种</span>: <span class="detail">{{checkList.currency_code}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">发货时间</span>: <span class="detail">{{checkList.time_all_shipped|dateFilter}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">最后更新时间</span>: <span class="detail">{{checkList.update_time|dateFilter}}</span>
                            </div>
                        </el-col>
                    </el-row>
                </tab-head>
                <!--  产品信息  -->
                <tab-item id="product" label="产品信息">
                    <el-table :data="checkList.sku_list" border>
                        <el-table-column label="商品ID" align="center" show-overflow-tooltip  inline-template width="200">
                            <div>
                                <a class="link" :href="row.product_link" target="_blank">{{row.product_id}}</a>
                            </div>
                        </el-table-column>
                        <el-table-column prop="sku" label="平台SKU"  align="center" width="180" show-overflow-tooltip></el-table-column>
                        <el-table-column inline-template label="商品名称" align="center">
                            <div>
                                {{row.product_name}}
                            </div>
                        </el-table-column>
                        <el-table-column prop="quantity" label="数量" align="center"  width="60" show-overflow-tooltip></el-table-column>
                        <el-table-column label="出售价" align="center" inline-template  width="100" show-overflow-tooltip>
                            <div>
                                {{row.price}}（{{checkList.currency_code}}）
                            </div>
                        </el-table-column>
                    </el-table>
                </tab-item>
                <!--  收货人信息  -->
                <tab-item id="buyinfo" label="收货人信息">

                    <div class="row-content">
                        <span class="label">买家ID</span>:<span class="detail">{{checkList.receiver}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">收货人</span>:<span class="detail">{{checkList.receiver}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">电话</span>:<span class="detail">{{checkList.mobile}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">国家</span>:<span class="detail">{{checkList.country_code}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">州</span>:<span class="detail">{{checkList.province}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">城市</span>:<span class="detail">{{checkList.city}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">街道详细地址1</span>:<span class="detail">{{checkList.street1}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">街道详细地址2</span>:<span class="detail">{{checkList.street2}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">街道详细地址3</span>:<span class="detail">{{checkList.street3}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">邮编</span>:<span class="detail">{{checkList.zipcode}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">收件人联系邮箱</span>:<span class="detail">{{checkList.email}}</span>
                    </div>
                </tab-item>
                <!--  售后 -->
                <tab-item id="service" label="售后">
                    <div class="row-content">
                        <span class="label">退款时间</span>:<span class="detail">{{checkList.time_refund|dateFilter}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">退款总金额</span>:<span class="detail">{{checkList.refund_amount}}</span>
                    </div>
                </tab-item>
            </tabs>
            <span slot="footer">
                <el-button type="default" size="mini" @click.native="viewDialog = false">关闭</el-button>
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
                viewDialog:this.value,
            }
        },
        filters:{
            dateFilter(val){//-----------日期过滤
                return datef('YYYY-MM-dd HH:mm:ss', val);
            },
            statusFilter(val){
                let ret = '';
                switch (Number(val)){
                    case 1:
                        ret = '未付款';
                        break;
                    case 2:
                        ret = '已支付';
                        break;
                    case 3:
                        ret = '已发货';
                        break;
                    case 5:
                        ret = '已完成';
                        break;
                    case 9:
                        ret = '已取消';
                        break;
                    default:
                        ret = 'error'
                }
                return ret
            }
        },
        watch:{
            value(val){
                this.viewDialog = val
            },
            viewDialog(val){
                this.$emit("input",val)
            },
        },
        props:{
            value:{
                type:Boolean,
                default(){
                    return false;
                }
            },
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
