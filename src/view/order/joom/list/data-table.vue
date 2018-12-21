<template>
    <el-row class="p-joom-order-table">
        <!--数据table-->
        <ui-table v-loading="loading"
                  element-loading-text="玩命加载中..."
                  :has-data="dataTable.length>0"
                  :first-loading="firstLoading"
                  @sort-click="sort_click"
                  :body-height="38"
                  :heads="[
                        {label:'订单号',width:8},
                        {label:'店铺简称',width:7},
                        {label:'买家ID',width:10},
                        {label:'目的地',width:4},
                        {label:'运费',width:4},
                        {label:'出售价',width:5},
                        {label:'支付总额',width:5,isSort:true},
                        {label:'付款时间',width:8,isSort:true},
                        {label:'平台发货状态',width:8,isSort:true},
                        {label:'订单状态',width:7},
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
                    <td class="t-left">
                        <plus-minus @show-detail="show_detail(data)" :show="data.show" :title="tipTitle"></plus-minus>
                        <ui-tips :content="data.order_id" :width="88" v-copy></ui-tips>
                    </td>
                    <!--店铺简称-->
                    <td>
                        <ui-tips :content="data.account_code" :width="88" v-copy></ui-tips>
                    </td>
                    <!--买家ID-->
                    <td>
                        <ui-tips :content="data.name" :width="68"></ui-tips>
                    </td>
                    <!--目的地-->
                    <td>
                        <!--<times v-if="data.order_time" :time="data.order_time" :width="88"></times>-->
                        <!--<label v-else>未付款</label>-->
                        <ui-tips :content="data.country" :width="88"></ui-tips>
                    </td>
                    <!--运费-->
                    <td>
                        <ui-tips :content="data.shipping" :width="88"></ui-tips>
                    </td>
                    <!--出售价-->
                    <td>
                        <ui-tips :content="data.order_total" :width="88"></ui-tips>
                    </td>
                    <!--支付总额-->
                    <td>
                        <ui-tips :content="data.cost" :width="88"></ui-tips>
                    </td>
                    <!--付款时间-->
                    <td>
                        <times :time="data.order_time"></times>
                    </td>
                    <!--平台发货状态-->
                    <td>
                        <ui-tips v-if="data.shipping_time>0" :content="data.shipping_time|dateFilter"
                                :width="88"></ui-tips>
                        <div v-else-if="data.shipping_time===0"><span>未发货</span></div>
                    </td>
                    <!--订单状态-->
                    <td>
                        <ui-tips :content="data.status" :width="88"></ui-tips>
                    </td>
                    <!--追踪单号-->
                    <td>
                        <ui-tips :content="data.tracking_number"></ui-tips>
                    </td>
                    <!--下单时间-->
                    <td>
                        <times :time="data.order_time"></times>
                    </td>
                    <!--最迟发货时间-->
                    <td>
                        <time-out :time="data.latest_shipped_time" :cur-status="data.shipped_on"></time-out>
                    </td>
                    <!--操作-->
                    <td>
                        <permission
                            tag="span"
                            :route="apis.url_api_order_joom_check"
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
                        <td colspan="5">商品名称</td>
                        <td colspan="3">ItemId</td>
                        <td>数量</td>
                        <td>出售价</td>
                        <td :rowspan="2"></td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <ui-tips :content="data.sku" :width="88"></ui-tips>
                        </td>
                        <td colspan="5">
                            <ui-tips :content="data.product_name" :width="88"></ui-tips>
                        </td>
                        <td colspan="3">
                            <ui-tips :content="data.product_id" :is-link="true" @cur-click="cur_click(data)" :width="78"></ui-tips>
                        </td>
                        <td>{{data.quantity}}</td>
                        <td>{{data.currency_code}}&nbsp;{{data.price}}</td>
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
    import {api_order_joom_check, api_joom_orders_export, url_joom_orders_export} from '../../../../api/order_joom';
    import {url_api_order_joom_check} from '../../../../api/order_joom';
    import uiTable from "../../../../components/ui-table.vue"

    export default {
        permission: {
            url_api_order_joom_check,
            url_joom_orders_export
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
                return this.$http(api_joom_orders_export, data).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.visible = true;
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
                this.$http(api_order_joom_check, row.id).then(res => {
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
            firstLoading:{
                required: true,
                type: Boolean
            }
        },
        components: {
            orderForm,
            uiTable,
            uiTips: require('../../../../components/ui-tips.vue').default,
            plusMinus: require('../../../../components/plus-minus.vue').default,
            timeOut: require('../../local/time-out.vue').default,
        }
    }
</script>
