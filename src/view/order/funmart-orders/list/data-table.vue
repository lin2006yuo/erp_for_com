<template>
    <el-row class="p-lazada-order-table mt-xs">
        <!--数据table-->
        <ui-table v-loading="loading"
                  element-loading-text="玩命加载中..."
                  :has-data="dataTable.length>0"
                  :first-loading="firstLoading"
                  @sort-click="sort_click"
                  :body-height="38"
                  v-model="checkAll"
                  @check="changeAll"
                  :heads="[
                        {isCheck: true, size: 22},
                        {label:'订单号',width:20},
                        {label:'账号简称',width:10},
                        {label:'目的地',width:10},
                        {label:'出售价',width:10},
                        {label:'支付总额',width:8},
                        {label:'物流商',width:10},
                        {label:'跟踪号',width:10},
                        {label:'付款时间',width:10, isSort:true},
                        {label:'创建时间',width:10},
                       ]">
            <!--{label:'买家ID',width:8},-->
            <!--{label:'出售价',width:6},-->
            <!--{label:'订单状态',width:6},-->
            <!--{label:'平台发货状态',width:7,isSort:true},-->
            <tbody>
            <template v-for="(data, index) in dataTable">
                <tr class="line" :class="[data.show ? 'active' : '',data.clickData?'active-color':'']"
                    @click="addClass(data)">
                    <!--订单号-->
                    <td><el-checkbox v-model="data.isCheck"></el-checkbox></td>
                    <td class="t-left" nowrap="nowrap">
                        <plus-minus @show-detail="show_detail(data)" :show="data.show" :title="tipTitle"></plus-minus>
                        <ui-tip :content="data.order_id" :width="72"></ui-tip>
                    </td>
                    <!--账号简称-->
                    <td>
                        <ui-tip :content="data.account_code" :width="88"></ui-tip>
                    </td>
                    <!--买家ID-->
                    <!--<td>-->
                        <!--<ui-tip :content="data.buyer_login_id" :width="72"></ui-tip>-->
                    <!--</td>-->
                    <!--目的地-->
                    <td>
                        <ui-tip :content="data.country" :width="88"></ui-tip>
                    </td>
                    <!--出售价-->
                    <td>
                        <ui-tip :content="data.item_price| priceFilter" :width="88"></ui-tip>
                    </td>
                    <!--支付总额-->
                    <td>
                        <ui-tip :content="data.item_paid|emptyByDefault" :width="88"></ui-tip>
                    </td>
                    <!--物流商-->
                    <td>
                        <ui-tip :content="data.buyer_login_id|emptyByDefault" :width="88"></ui-tip>
                    </td>
                    <!--跟踪号-->
                    <td>
                        <ui-tip :content="data.buyer_login_id|emptyByDefault" :width="88"></ui-tip>
                    </td>
                    <!--付款时间-->
                    <td>
                        <ui-tip :content="data.t_paytime|dateFilter" :width="88"></ui-tip>
                    </td>
                    <!--平台发货状态-->
                    <!--<td>-->
                        <!--<ui-tip v-if="data.promised_shipping_times>0" :content="data.promised_shipping_times|dateFilter" :width="78"></ui-tip>-->
                        <!--<span v-else-if="data.promised_shipping_times===0">未发货</span>-->
                    <!--</td>-->
                    <!--订单状态-->
                    <!--<td>-->
                        <!--<ui-tip :content="data.statuses" :width="88"></ui-tip>-->
                    <!--</td>-->
                    <!--下单时间-->
                    <!--<td>-->
                        <!--<ui-tip :content="data.created_at|dateFilter" :width="88"></ui-tip>-->
                    <!--</td>-->
                    <!--创建时间-->
                    <td>
                        <ui-tip :content="data.create_time|dateFilter" :width="88"></ui-tip>
                    </td>
                </tr>
                <template v-if="data.show">
                    <tr style="font-weight:bold">
                        <td></td>
                        <td>平台SKU</td>
                        <td colspan="3">商品名称</td>
                        <td colspan="2">ItemId</td>
                        <td>数量</td>
                        <td colspan="2">出售价</td>
                    </tr>
                    <template>
                        <tr>
                            <td></td>
                            <td>
                                <ui-tip :content="data.shop_sku|emptyByDefault" :width="88"></ui-tip>
                            </td>
                            <td colspan="3">
                                <ui-tip :content="data.product_name|emptyByDefault" :width="88"></ui-tip>
                            </td>
                            <td  colspan="2">--</td>
                            <td>{{data.item_num|emptyByDefault}}</td>
                            <td colspan="2">CNY&nbsp{{data.item_price|emptyByDefault}}</td>
                        </tr>
                    </template>
                </template>
            </template>
            </tbody>
        </ui-table>
        <!--查看弹框-->
        <!--<order-form v-model="orders" :checkList='checkList'></order-form>-->
    </el-row>
</template>
<style lang="stylus">
    .wish {
        .ui-table-body {
            .template.secTable {
                table-layout: fixed;
                .a_hover {
                    &:hover {
                        font-size: 1.2rem !important;
                        text-decoration: underline;
                    }
                }
            }
        }
    }

</style>
<script>
    import orderForm from './order-form.vue';
    import {api_order_daraz_check,url_api_order_daraz_check} from '../../../../api/order_daraz';
    import uiTable from "../../../../components/ui-table.vue"

    export default {
        permission: {
            url_api_order_daraz_check,
        },
        data() {
            return {
                checkAll: false,
                orders: false,
                visible: false,
                checkList: {},
                tipTitle: "点击可查看 平台SKU，商品名称，ItemId，数量，出售价 等信息"
            }
        },
        filters: {
            dateFilter(val) {//-----------日期过滤
                return datef('YYYY-MM-dd HH:mm:ss', val);
            },
            priceFilter(val) {
                return val?parseFloat(val).toFixed(2):"0.00";
            },
            filterPayTime(val) {
                return val > 0 ? datef('YYYY-MM-dd HH:mm:ss', val) : "未付款";
            },
            filterShipped(val) {
                return val > 0 ? datef('YYYY-MM-dd HH:mm:ss', val) : "未发货";
            },
            filterLastTime(val) {
                let now = new Date().getTime();
                let sec = Number(val) + 48 * 60 * 60;
                if (sec - now > 0) {
                    sec = Number(val) + 48 * 60 * 60- now;
                    sec = Math.max(sec, 0);
                    let d = parseInt(sec / 1000 / 60 / 60 / 24, 10);
                    let h = parseInt(sec / 1000 / 60 / 60 % 24, 10);
                    let m = parseInt(sec / 1000 / 60 % 60, 10);
                    if (d) {
                        return '';
                    } else if (h) {
                        return `${h}小时`
                    } else {
                        return `${m}分钟`
                    }
                } else {
                    return '已超时'
                }
            },
            filterLastTimes(val) {
                return  Number(val) + 48 * 60 * 60;
            }
        },
        methods: {
            account(val){
                this.accountList.forEach(row=>{
                     if(Number(row.value)===Number(val)){
                         return row.label
                     }
                })
            },
            changeAll(val) {//----------全选反选
                this.dataTable.forEach(data => {
                    data.isCheck = val
                });
            },
            //            升降排序
            sort_click(val) {
                this.$emit("sort-click", val);
            },
            cur_click(val) {
                window.open(`${val.product_detail_url}`);
            },
            addClass(data) {
                this.dataTable.forEach(item => {
                    this.$set(item, 'clickData', false);
                });
                data.clickData = true;
            },
            show_detail(data) {
                data.show = !data.show;
            },
            lookOver(row) {//----------------------查看
                this.orders = true;
                this.checkList = {};
                this.$http(api_order_daraz_check, row.id).then(res => {
                    this.checkList = res;
                }).catch(code => {
                    this.$message({
                        showClose: true,
                        message: code.message || code,
                        type: 'error'
                    });

                });

            }
        },
        props: {
            dataTable: {
                type: Array
            },
            loading: {
                required: true,
                type: Boolean
            },
            accountList:{
                type: Array
            },
            export_data: {},
            firstLoading: {
                required: true,
                type: Boolean
            },
        },
        components: {
            orderForm,
            uiTable,
            uiTip: require('../../../../components/ui-tip.vue').default,
            plusMinus: require('../../../../components/plus-minus.vue').default,
            timeOut: require('../../local/time-out.vue').default,
        }
    }
</script>
