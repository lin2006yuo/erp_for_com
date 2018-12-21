<template>
    <el-row class="p-yma-order-table">
            <ui-table  v-loading="isLoading" element-loading-text="玩命加载中..." :has-data="dataTable.length>0"  v-model="checkAll" :body-height="38" class="ymx" @sort-click="sort_click" @check="check_all" ref="ymxTable"
                       :heads="[
                        {isCheck:true,size:23},
                        {label:'订单号',width:8},
                        {label:'账号简称',width:3},
                        {label:'站点',width:2},
                        {label:'买家姓名',width:5},
                        {label:'支付总额',width:4,isSort:true},
                        {label:'目的地',width:3},
                        {label:'订单类型',width:4},
                        {label:'平台发货状态',width:4},
                        {label:'订单状态',width:4},
                        {label:'下单时间',width:5,isSort:true},
                        {label:'付款时间',width:4},
                        {label:'最迟发货时间',width:5,isSort:true},
                        {label:'放款金额',width:5},
                        {label:'放款时间',width:5},
                        {label:'退款金额',width:4},
                        {label :'操作',width:4}
                       ]">
                <tbody>
                <template v-for="(data, index) in dataTable">
                    <tr :class="[data.show ? 'active' : '',data.heighLight?'active-color':'']" @click="addClass(index)"
                        :key="data.order_number">
                        <td>
                            <el-checkbox v-model="data.isCheck" @change="changeOne"></el-checkbox>
                        </td>
                        <!--订单号-->
                        <td class="t-left">
                            <plus-minus @show-detail="show_detail(data)" :show="data.show" :title="tipTitle"></plus-minus>
                            <ui-tip :content="data.order_number"></ui-tip>
                        </td>
                        <td>
                            <ui-tip :content="data.seller" :width="98"></ui-tip>
                        </td>
                        <td>
                            {{data.site}}
                        </td>
                        <td>
                            <ui-tip :content="data.user_name" :width="88"></ui-tip>
                        </td>
                        <!--支付总额-->
                        <td>{{data.currency}}&nbsp;{{data.actual_total|actFill}}</td>
                        <td>
                            <ui-tip :content="data.country_cn_name" :width="98"></ui-tip>
                        </td>
                        <td>{{data.fulfillment_channel}}</td>
                        <td>
                            <ui-tip :content="data.order_status|orderFilter" :width="98"></ui-tip>
                        </td>
                        <td>
                            <ui-tip :content="data.order_status" :width="98"></ui-tip>
                        </td>
                        <td>
                            <times :time="data.created_time"></times>
                        </td>
                        <!--付款时间-->
                        <td>
                            <times :time="data.payment_time"></times>
                        </td>
                        <td>
                            <time-out :time="data.latest_ship_time" :cur-status="data.order_status==='Shipped'?1:0"></time-out>
                        </td>
                        <!--放款金额-->
                        <td>
                            <ui-tip v-if="data.refund_amount>0" :content="data.transfer_amount" :width="78"></ui-tip>
                            <div v-else>--</div>
                        </td>
                        <!--放款时间-->
                        <td>
                            <times :time="data.transfer_time"></times>
                        </td>
                        <!--退款金额-->
                        <td>
                            <ui-tip v-if="data.refund_amount!='0.0000'" :content="data.refund_amount" :width="78"></ui-tip>
                            <div v-else>--</div>
                        </td>
                        <td>
                            <permission
                                tag="span"
                                :route="apis.url_order_amanzon_check"
                                class="operate"
                                @click="lookOver(data)">查看</permission>
                        </td>
                    </tr>
                    <template v-if="data.show">
                        <tr class="bold-font">
                            <td :rowspan="`${data.sku_list.length+1}`"></td>
                            <td>ASIN</td>
                            <td colspan="3">平台SKU</td>
                            <!--<td>SKU</td>-->
                            <td colspan="8">商品名称</td>
                            <td>数量</td>
                            <td>出售价</td>
                        </tr>
                        <tr v-for="(item,i) in data.sku_list" :key="i">
                            <td>
                                <ui-tip :content="item.item_id" :is-link="true" @cur-click="cur_click(item,data)"></ui-tip>
                            </td>
                            <td colspan="3">
                                <ui-tip :content="item.online_sku" :width="98"></ui-tip>
                            </td>
                            <td colspan="8">
                                <ui-tip :content="item.item_title" :width="98"></ui-tip>
                            </td>
                            <td>{{item.qty}}</td>
                            <td>{{data.currency}}&nbsp;{{item.item_price | filterPrice}}</td>
                        </tr>
                    </template>
                </template>
                <order-form v-model="orders" :checkList='checkList'></order-form>
                </tbody>
            </ui-table>
            <!--查看弹框-->
    </el-row>
</template>
<style lang="stylus">
    .p-yma-order-table {
        .ymx {
            a:hover {
                font-size: 12px !important;
            }
            .ui-table-body {
                .template.secTable {
                    table-layout: fixed;
                    td {
                        .ymx-hidden-id {
                            vertical-align: middle;
                            margin: 0 0;
                            display: inline-block;
                            width: 120px;
                            text-overflow: ellipsis;
                            word-break: keep-all;
                            white-space: nowrap;
                            overflow: hidden;
                        }
                        .ymx-hidden {
                            vertical-align: middle;
                            margin: 0 0;
                            display: inline-block;
                            width: 110px;
                            padding: 0 5px;
                            text-overflow: ellipsis;
                            word-break: keep-all;
                            white-space: nowrap;
                            overflow: hidden;
                        }
                        .ymx-hidden.ymx-width {
                            width: 50px;
                        }
                    }
                }
            }
        }
    }
</style>
<script>
    import  orderForm from './order-form.vue';
    import {order_amanzon_check} from '../../../../api/order_amazon';
    import {url_order_amanzon_check} from '../../../../api/order_amazon';
    import uiTable from "../../../../components/ui-table.vue";
    export default{
        permission:{
            url_order_amanzon_check
        },
        data(){
            return {
                orders: false,
                selectedList: [],
                checkAll: false,
                checkList: {},
                tipTitle:"点击可查看 ASIN，平台SKU，商品名称，数量，出售价 等信息"
            }
        },
        filters: {
            shipTimeFilter(val){
            	return datef('YYYY-MM-dd HH:mm:ss',val)
            },
            dateFilter(val){
                if (val) {
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return '未付款'
                }
            },
            statusFilter(val){
                if (val) {
                    return val;
                } else {
                    return '未付款'
                }
            },
            payFilter(val){
                if (val) {
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "未付款"
                }
            },
            actFill(val){
                return Number(val).toFixed(2)
            },
            orderFilter(val){
                if (val == "Shipped") {
                    return "已发货"
                } else {
                    return "未发货"
                }
            },
            filterPrice(val){
                return val!==""?parseFloat(val).toFixed(2):'0.00'
            },

        },
        methods: {
            cur_click(val,data){
                window.open(`https://${data.sales_channel}/gp/product/${val.item_id}`);
            },
            check_all(val){
                this.dataTable.forEach(data => {
                    data.isCheck = val;
                })
            },
            sort_click(val){
                this.$emit("sort-click",val);
            },
            changeOne(){
                this.checkAll = this.dataTable.every(row => row.isCheck === true);
            },
            addClass(index){
                this.dataTable.forEach(row => {
                    row.heighLight = false;
                });
                this.dataTable[index].heighLight = true
            },
            show_detail(data){
                data.show = !data.show;
            },
            lookOver(row){//----------------------查看
                this.orders = true;
                this.$http(order_amanzon_check, row.id).then(res => {
                    this.checkList = res;
                }).catch(code => {
                    this.$message({
                        showClose: true,
                        message: '获取数据失败，请稍后重试！',
                        type: 'error'
                    });

                });

            }
        },
        watch: {
            'dataTable'(val) {
                if (val.length > 0) {
                        this.checkAll =  this.dataTable.every(row => row.isCheck === true);
                } else {
                    this.checkAll = false;
                }
            }
        },
        props: {
            dataTable: {
                required: true,
                type: Array
            },
            isLoading: {
                required: true,
                type: Boolean
            }
        },
        components: {
            orderForm,
            uiTable,
            uiTip: require("../../../../components/ui-tip.vue").default,
            plusMinus:require('../../../../components/plus-minus.vue').default,
            timeOut:require('../../local/time-out.vue').default
        }
    }
</script>
