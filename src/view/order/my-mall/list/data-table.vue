<template>
    <el-row class="p-mymall-order-table">
        <!--数据table-->
        <ui-table v-loading="loading" :first-loading="firstLoading" element-loading-text="玩命加载中..." :has-data="dataTable.length>0"
                  @sort-click="sort_click" :body-height="38"
                  :heads="[
                        {label:'订单号',width:14},
                        {label:'账号简称',width:5},
                        {label:'Purchase ID',width:8},
                        {label:'目的地',width:4},
                        {label:'运费',width:4},
                        {label:'出售价',width:4},
                        {label:'支付总额',width:5,isSort:true},
                        {label:'付款时间',width:8,isSort:true},
                        {label:'平台发货状态',width:8,isSort:true},
                        {label:'订单状态',width:4},
                        {label:'追踪单号',width:8},
                        {label:'下单时间',width:8,isSort:true},
                        {label:'最迟发货时间',width:6,isSort:true},
                        {label:'操作',width:3}
                       ]">
            <tbody>
            <template v-for="(data, index) in dataTable">
                <tr class="line" :class="[data.show ? 'active' : '',data.clickData?'active-color':'']"
                    @click="addClass(data)">
                    <!--订单号-->
                    <td class="t-left" nowrap="nowrap">
                        <plus-minus @show-detail="show_detail(data)" :show="data.show" :title="tipTitle"></plus-minus>
                        <ui-tip :content="data.order_id" :width="68" v-copy></ui-tip>
                    </td>
                    <!--账号简称-->
                    <td>
                        <ui-tip :content="data.account_code" :width="88" v-copy></ui-tip>
                    </td>
                    <!--Purchase ID-->
                    <td>
                        <ui-tip :content="data.buyer_id" :width="72"></ui-tip>
                    </td>
                    <!--目的地-->
                    <td>
                        <ui-tip :content="data.country" :width="72"></ui-tip>
                    </td>
                    <!--运费-->
                    <td>
                        <ui-tip :content="data.shipping" :width="88"></ui-tip>
                    </td>
                    <!--出售价-->
                    <td>
                        <ui-tip :content="data.order_total" :width="88"></ui-tip>
                    </td>
                    <!--支付总额-->
                    <td>
                        <ui-tip :content="data.cost" :width="88"></ui-tip>
                    </td>
                    <!--付款时间-->
                    <td>
                        <ui-tip :content="data.order_time|dateFilter" :width="88"></ui-tip>
                    </td>
                    <!--平台发货状态-->
                    <td>
                        <ui-tip v-if="data.shipping_time>0" :content="data.shipping_time|dateFilter"
                                :width="88"></ui-tip>
                        <div v-else-if="data.shipping_time===0"><span>未发货</span></div>
                    </td>
                    <!--订单状态-->
                    <td>
                        <ui-tip :content="data.status" :width="88"></ui-tip>
                    </td>
                    <!--追踪单号-->
                    <td>
                        <ui-tip :content="data.tracking_number" :width="88"></ui-tip>
                    </td>
                    <!--下单时间-->
                    <td>
                        <ui-tip :content="data.order_time|dateFilter" :width="88"></ui-tip>
                    </td>
                    <!--最迟发货时间-->
                    <td>
                        <time-out :time="data.last_time" :cur-status="data.latest_shipped_time"></time-out>
                    </td>
                    <!--操作-->
                    <td>
                        <permission
                            tag="span"
                            :route="apis.url_api_order_pandao_check"
                            class="operate"
                            v-permission.look="'orderWish'"
                            @click="lookOver(data)">查看
                        </permission>
                    </td>
                </tr>
                <template v-if="data.show">
                    <tr style="font-weight:bold">
                        <td :rowspan="2"></td>
                        <td colspan="2">平台SKU</td>
                        <td colspan="6">商品名称</td>
                        <td colspan="2">ItemId</td>
                        <td>数量</td>
                        <td>出售价</td>
                        <td :rowspan="2"></td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <ui-tip :content="data.sku" :width="88"></ui-tip>
                        </td>
                        <td colspan="6">
                            <ui-tip :content="data.product_name" :width="88"></ui-tip>
                        </td>
                        <td colspan="2">
                            <ui-tip :content="data.product_id" :is-link="true" @cur-click="cur_click(data)"></ui-tip>
                        </td>
                        <td>{{data.quantity}}</td>
                        <td>{{data.price}}</td>
                    </tr>
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
        api_order_pandao_check,
        api_pandao_orders_export,
        url_pandao_orders_export
    } from '../../../../api/order_pandao';
    import {url_api_order_pandao_check} from '../../../../api/order_pandao';
    import uiTable from "../../../../components/ui-table.vue"

    export default {
        permission: {
            url_api_order_pandao_check,
            url_pandao_orders_export
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
                window.open(`${val.buy_url}`);
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
                this.$http(api_order_pandao_check, row.id).then(res => {
                    this.checkList = res;
                    this.checkList.payList = [{
                        "product_id": this.checkList.product_id,
                        "sku": this.checkList.sku,
                        "product": this.checkList.product,
                        "quantity": this.checkList.quantity,
                        "product_image_url": this.checkList.product_image_url,
                        "price": this.checkList.price,
                        "money_nuit": this.checkList.money_nuit,
                        "buy_url": this.checkList.buy_url,
                        "product_name": this.checkList.product_name
                    }];
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
