<template>
    <el-row class="p-shopee-order-table">
        <!--数据table-->
        <ui-table v-loading="loading"
                  element-loading-text="玩命加载中..."
                  :has-data="dataTable.length>0"
                  :first-loading = firstLoading
                  @sort-click="sort_click"
                  :body-height="38"
                  :heads="[
                        {label:'订单号',width:10},
                        {label:'账号简称',width:6},
                        {label:'收件人',width:8},
                        {label:'站点',width:4},
                        {label:'运费',width:5},
                        {label:'出售价',width:5},
                        {label:'支付总额',width:5,isSort:true},
                        {label:'付款方式',width:5},
                        {label:'平台发货状态',width:8},
                        {label:'订单状态',width:6},
                        {label:'追踪单号',width:8},
                        {label:'下单时间',width:8,isSort:true},
                        {label:'最迟发货时间',width:8,isSort:true},
                        {label:'操作',width:5}
                       ]">
            <tbody>
            <template v-for="(data, index) in dataTable">
                <tr class="line" :class="[data.show ? 'active' : '',data.clickData?'active-color':'']"
                    @click="addClass(data)">
                    <!--订单号-->
                    <td class="t-left" nowrap="nowrap">
                        <plus-minus @show-detail="show_detail(data)" :show="data.show" :title="tipTitle"></plus-minus>
                        <ui-tip :content="data.order_sn" :width="78"></ui-tip>
                    </td>
                    <!--账号简称-->
                    <td>
                        <ui-tip :content="data.code" :width="78"></ui-tip>
                    </td>
                    <!--收件人-->
                    <td>
                        <ui-tip :content="data.name" :width="78"></ui-tip>
                    </td>
                    <!--站点-->
                    <td>
                        <ui-tip :content="data.site" :width="88"></ui-tip>
                    </td>
                    <!--运费-->
                    <td>
                        <ui-tip :content="data.actual_shipping_cost" :width="88"></ui-tip>
                    </td>
                    <!--出售价-->
                    <td>
                        <ui-tip :content="data.total_price" :width="88"></ui-tip>
                    </td>
                    <!--支付总额-->
                    <td>
                        <ui-tip :content="data.total_amount" :width="88"></ui-tip>
                    </td>
                    <!--付款方式-->
                    <td>
                        <ui-tip :content="data.payment_method_txt" :width="78"></ui-tip>
                    </td>
                    <!--平台发货状态-->
                    <td>
                        <ui-tip v-if="data.shipping_time>0" :content="data.shipping_time|dateFilter"
                                :width="88"></ui-tip>
                        <div v-else-if="data.shipping_time===0"><span>未发货</span></div>
                    </td>
                    <!--订单状态-->
                    <td>
                        <ui-tip :content="data.order_status_txt" :width="78"></ui-tip>
                    </td>
                    <!--追踪单号-->
                    <td>
                        <ui-tip :content="data.tracking_no" :width="88"></ui-tip>
                    </td>
                    <!--下单时间-->
                    <td>
                        <ui-tip :content="data.create_time|dateFilter" :width="88"></ui-tip>
                    </td>
                    <!--最迟发货时间-->
                    <td>
                        <time-out :time="data.last_time" :cur-status="data.shipped_on"></time-out>
                    </td>
                    <!--操作-->
                    <td>
                        <permission
                            tag="span"
                            :route="apis.url_api_order_shopee_check"
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
                        <td colspan="6">商品名称</td>
                        <td colspan="2">ItemId</td>
                        <td>数量</td>
                        <td>出售价</td>
                        <td :rowspan="data.detail.length+1"></td>
                    </tr>
                    <template v-for="(row,i) in data.detail">
                        <tr :key="`${i}${row.item_id}${row.item_sku}${row.id}`">
                            <td colspan="2">
                                <ui-tip :content="row.item_sku" :width="88"></ui-tip>
                            </td>
                            <td colspan="6">
                                <ui-tip :content="row.item_name" :width="88"></ui-tip>
                            </td>
                            <td colspan="2">
                                <ui-tip :content="row.item_id" :is-link="true" @cur-click="cur_click(row)"></ui-tip>
                            </td>
                            <td>{{row.quantity}}</td>
                            <td>{{row.original_price}}</td>
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
        api_order_shopee_check,
        api_shopee_orders_export,
        url_shopee_orders_export
    } from '../../../../api/order_shopee';
    import {url_api_order_shopee_check} from '../../../../api/order_shopee';
    import uiTable from "../../../../components/ui-table.vue"

    export default {
        permission: {
            url_api_order_shopee_check,
            url_shopee_orders_export
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
            batch_export(data) {
                return this.$http(api_shopee_orders_export, data).then(res => {
                    this.visible = true;
                    this.$message({type: "success", message: res.message || res});
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            //            升降排序
            sort_click(val) {
                this.$emit("sort-click", val);
            },
            cur_click(val) {
                window.open(`${val.url}`);
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
                this.$http(api_order_shopee_check, row.id).then(res => {
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
