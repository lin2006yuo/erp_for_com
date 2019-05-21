<template>
    <el-row class="wish-order-form">
        <page-dialog :title="`查看订单：${checkList.order_sn} 信息`" v-model="viewDialog" size="full" :close-on-click-modal="false">
            <!--    cardControl     -->
            <tabs>
                <tab-head :navs="[{label:'订单基本信息',action:''},{label:'产品信息',action:'product'},{label:'收货人信息',action:'buyinfo'}]">
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">订单号</span>: <span class="detail">{{checkList.order_goods_sn}}</span>
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
                                <span class="label">订单状态</span>: <span class="detail">{{checkList.order_state|statusFilter}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">交易ID</span>: <span class="detail">{{checkList.order_sn}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">付款时间</span>: <span class="detail">{{checkList.confirm_time|dateFilter}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">出售价</span>: <span class="detail">{{checkList.shop_price_amount}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">运费</span>: <span class="detail">{{checkList.shipping_fee}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">支付总额</span>: <span class="detail">{{checkList.total_amount}}</span>
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
                                <span class="label">币种</span>: <span class="detail">{{checkList.currency}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">发货时间</span>: <span class="detail">{{checkList.delivery_deadline|dateFilter}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label">取消时间</span>: <span class="detail">{{checkList.order_cancel_deadline|dateFilter}}</span>
                            </div>
                        </el-col>
                    </el-row>
                </tab-head>
                <!--  产品信息  -->
                <tab-item id="product" label="产品信息">
                     <table class="template">
                         <tr style="font-weight:bold;background-color: #d6e9c6">
                             <td colspan="2">平台SKU</td>
                             <td>图片</td>
                             <td colspan="8">商品名称</td>
                             <td>数量</td>
                             <td>单价</td>
                         </tr>
                         <tr>
                             <td colspan="2">{{checkList.sku}}</td>
                             <td>
                                 <el-popover
                                    ref="popover"
                                    placement="right"
                                    trigger="hover">
                                 <img v-lazy="sku_image(checkList.image_url)" width="200px" height="200px">
                                 </el-popover>
                                 <img v-popover:popover  class="wish-img" v-lazy="checkList.image_url" width="60px" height="60px">
                             </td>
                             <td colspan="8">{{checkList.goods_name}}</td>
                             <td>{{checkList.goods_number}}</td>
                             <td>{{checkList.shop_price_amount}}({{checkList.currency}})</td>
                         </tr>
                     </table>
                </tab-item>
                <!--  收货人信息  -->
                <tab-item id="buyinfo" label="收货人信息">
                    <div class="row-content">
                        <span class="label">收货人</span>:<span class="detail">{{checkList.consignee}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">电话</span>:<span class="detail">{{checkList.phone_number}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">国家</span>:<span class="detail">{{checkList.country}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">城市</span>:<span class="detail">{{checkList.city}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">街道地址1</span>:<span class="detail">{{checkList.address1}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">街道地址2</span>:<span class="detail">{{checkList.address2}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label">邮编</span>:<span class="detail">{{checkList.zip_code}}</span>
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
                viewDialog:this.value,
            }
        },
        methods:{
            sku_image(images){
                if(!!images){
                    return images.replace('_60x60.','_200x200.');
                }
                return ""
            },
        },
        filters:{
            dateFilter(val){//-----------日期过滤
                return datef('YYYY-MM-dd HH:mm:ss', val);
            },
            statusFilter(val){//-----------状态过滤
                let ret = '';
                switch (Number(val)) {
                    case 0:
                        ret = '未确认';
                        break;
                    case 1:
                        ret = '已确认';
                        break;
                    case 2:
                        ret = '已取消';
                        break;
                    default:
                        ret = 'error';
                }
                return ret;
            },
            taxFilter(val){
                if(val===''||val===undefined){
                    return '--'
                }
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
