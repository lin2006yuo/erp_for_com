<template>
    <el-row class="p-lazada-order-table mt-xs">
        <!--数据table-->
        <ui-table v-loading="loading"
                  element-loading-text="玩命加载中..."
                  :has-data="dataTable.length>0"
                  :first-loading="firstLoading"
                  @sort-click="sort_click"
                  :body-height="38"
                  :heads="[
                        {label:'订单号',width:10},
                        {label:'账号简称',width:6},
                        {label:'站点',width:4},
                        {label:'买家ID',width:8},
                        {label:'目的地',width:5},
                        {label:'运费',width:5},
                        {label:'出售价',width:6},
                        {label:'支付总额',width:6,isSort:true},
                        {label:'平台发货状态',width:7,isSort:true},
                        {label:'付款时间',width:8},
                        {label:'订单状态',width:6},
                        {label:'追踪单号',width:8},
                        {label:'下单时间',width:8,isSort:true},
                        {label:'最迟发货时间',width:7,isSort:true},
                        {label:'操作',width:5}
                       ]">
            <tbody>
            <template v-for="(data, index) in dataTable">
                <tr class="line" :class="[data.show ? 'active' : '',data.clickData?'active-color':'']"
                    @click="addClass(data)">
                    <!--订单号-->
                    <td class="t-left" nowrap="nowrap">
                        <plus-minus @show-detail="show_detail(data)" :show="data.show" :title="tipTitle"></plus-minus>
                        <ui-tip :content="data.order_id" :width="72"></ui-tip>
                    </td>
                    <!--账号简称-->
                    <td>
                        <ui-tip :content="data.code" :width="88"></ui-tip>
                    </td>
                    <!--站点-->
                    <td>
                        <ui-tip :content="data.site" :width="88"></ui-tip>
                    </td>
                    <!--买家ID-->
                    <td>
                        <ui-tip :content="data.buyer_login_id" :width="72"></ui-tip>
                    </td>
                    <!--目的地-->
                    <td>
                        <ui-tip :content="data.country_cn_name" :width="88"></ui-tip>
                    </td>
                    <!--运费-->
                    <td>
                        <ui-tip :content="data.shipping_fee" :width="88"></ui-tip>
                    </td>
                    <!--出售价-->
                    <td>
                        <ui-tip :content="data.item_price" :width="88"></ui-tip>
                    </td>
                    <!--支付总额-->
                    <td>
                        <ui-tip :content="data.price" :width="88"></ui-tip>
                    </td>
                    <!--平台发货状态-->
                    <td>
                        <ui-tip v-if="data.promised_shipping_time>0" :content="data.promised_shipping_time|dateFilter"
                                :width="78"></ui-tip>
                        <span v-else-if="data.promised_shipping_time===0">未发货</span>
                    </td>
                    <!--付款时间-->
                    <td>
                        <ui-tip :content="data.created_at|dateFilter" :width="88"></ui-tip>
                    </td>

                    <!--订单状态-->
                    <td>
                        <ui-tip :content="data.statuses" :width="88"></ui-tip>
                    </td>
                    <!--追踪单号-->
                    <td>
                        <ui-tip :content="data.tracking_code" :width="88"></ui-tip>
                    </td>
                    <!--下单时间-->
                    <td>
                        <ui-tip :content="data.created_at|dateFilter" :width="88"></ui-tip>
                    </td>
                    <!--最迟发货时间-->
                    <td>
                        <time-out :time="data.last_time" :cur-status="data.late_time"></time-out>
                    </td>
                    <!--操作-->
                    <td>
                        <permission
                            tag="span"
                            :route="apis.url_api_order_lazada_check"
                            class="operate"
                            v-permission.look="'orderWish'"
                            @click="lookOver(data)">查看
                        </permission>
                    </td>
                </tr>
                <template v-if="data.show">
                    <tr style="font-weight:bold">
                        <td :rowspan="data.detail.length+1"></td>
                        <td colspan="2">平台SKU</td>
                        <td colspan="7">商品名称</td>
                        <td colspan="2">ItemId</td>
                        <td>数量</td>
                        <td>出售价</td>
                        <td :rowspan="data.detail.length+1"></td>
                    </tr>
                    <template v-for="(row,i) in data.detail">
                        <tr :key="`${i}${row.order_item_id}`">
                            <td colspan="2">
                                <ui-tip :content="row.sku" :width="88"></ui-tip>
                            </td>
                            <td colspan="7">
                                <ui-tip :content="row.product_name" :width="88"></ui-tip>
                            </td>
                            <td colspan="2">
                                <ui-tip :content="row.order_item_id" :is-link="true"
                                        @cur-click="cur_click(data)"></ui-tip>
                            </td>
                            <td>{{row.qty}}</td>
                            <td>{{row.item_price}}</td>
                        </tr>
                    </template>
                </template>
            </template>
            </tbody>
        </ui-table>
        <!--查看弹框-->
        <order-form v-model="orders" :checkList='checkList'></order-form>
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
    import {
        api_order_lazada_check,
        api_lazada_orders_export,
        url_lazada_orders_export
    } from '../../../../api/order_lazada';
    import {url_api_order_lazada_check} from '../../../../api/order_lazada';
    import uiTable from "../../../../components/ui-table.vue"

    export default {
        permission: {
            url_api_order_lazada_check,
            url_lazada_orders_export
        },
        data() {
            return {
                orders: false,
                checkAll: false,
                visible: false,
                checkList: {},
                tipTitle: "点击可查看 平台SKU，商品名称，ItemId，数量，出售价 等信息"
            }
        },
        filters: {
            dateFilter(val) {//-----------日期过滤
                return datef('YYYY-MM-dd HH:mm:ss', val);
            },
            filterPayTime(val) {
                return val > 0 ? datef('YYYY-MM-dd HH:mm:ss', val) : "未付款";
            },
            filterShipped(val) {
                return val > 0 ? datef('YYYY-MM-dd HH:mm:ss', val) : "未发货";
            }
        },
        methods: {
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
                this.$http(api_order_lazada_check, row.id).then(res => {
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
            export_data: {},
            firstLoading: {
                required: true,
                type: Boolean
            }
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
