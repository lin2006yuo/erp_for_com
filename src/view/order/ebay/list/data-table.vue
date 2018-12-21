<template>
    <el-row class="p-ebay-order-table mt-xs">
        <ui-table v-loading="isLoading" :first-loading="firstLoading" element-loading-text="玩命加载中..." :has-data="dataTable.lists.length>0"
                  class="ebay" v-model="checkAll" @check="checkAllBox" @sort-click="sort_click" :body-height="38"
                  :heads="[
                    {isCheck:true,size:22},
                    {label:'订单号',width:10},
                    {label:'站点',width:3},
                    {label:'账号简称',width:3},
                    {label:'订单编号',width:4},
                    {label:'买家ID',width:5},
                    {label:'交易号',width:5},
                    {label:'支付总额',width:5,isSort:true},
                    {label:'目的地',width:4},
                    {label:'平台发货状态',width:6,isSort:true},
                    {label:'追踪单号',width:5},
                    {label:'订单状态',width:5},
                    {label:'下单时间',width:5,isSort:true},
                    {label:'最迟发货时间',width:6,isSort:true},
                    {label:'放款金额',width:5},
                    {label:'放款时间',width:5},
                    {label:'操作',width:5}
                ]"
        >
            <tbody>
            <template v-for="(data, index) in dataTable.lists">
                <tr :class="[clickData[index]?'active-color':'']" @click="addClass(index)" :key="data.order_id">
                    <td>
                        <el-checkbox v-model="data.isCheck" @change="checkBox"></el-checkbox>
                    </td>
                    <!--订单号-->
                    <td class="t-left">
                        <plus-minus @show-detail="show_detail(data)" :show="data.show" :title="tipTitle"></plus-minus>
                        <ui-tip :content="data.order_id" :width="78"></ui-tip>
                    </td>
                    <!--站点-->
                    <td>
                        <ui-tip :content="data.site" :width="68"></ui-tip>
                    </td>
                    <!--账号/简称-->
                    <td>
                        <ui-tip :content="data.account" :width="78"></ui-tip>
                    </td>
                    <!--订单编号-->
                    <td>
                        <ui-tip :content="data.record_number" :width="78"></ui-tip>
                    </td>
                    <!--买家ID-->
                    <td>
                        <ui-tip :content="data.buyer_user_id" :width="78"></ui-tip>
                    </td>
                    <!--交易号-->
                    <td>
                        <ui-tip :content="data.transaction_id" :width="78"></ui-tip>
                    </td>
                    <!--支付总额-->
                    <td>
                        <ui-tip :content="`${data.currency_id}:${filter_price(data.amount_paid)}`" :width="78"></ui-tip>
                    </td>
                    <!--目的地-->
                    <td>{{data.country_cn_name}}</td>
                    <!--发货状态-->
                    <td>
                        <times v-if="parseInt(data.shipped_time)" :time="data.shipped_time"></times>
                        <label v-else>未发货</label>
                    </td>
                    <!--追踪单号-->
                    <td>
                        <ui-tip :content="data.tracking_number" :width="88"></ui-tip>
                    </td>
                    <!--订单状态-->
                    <td>
                        <ui-tip :content="data.order_status" :width="88"></ui-tip>
                    </td>
                    <!--下单时间-->
                    <td>
                        <times v-if="data.created_time" :time="data.created_time"></times>
                        <label v-else>-- --</label>
                    </td>
                    <!--最迟发货时间-->
                    <td>
                        <time-out :time="data.latest_ship_time" :cur-status="data.shipped_time"></time-out>
                    </td>
                    <!--放款金额-->
                    <td>
                        <ui-tip v-if="data.transfer_time>0" :content="data.transfer_money" :width="78"></ui-tip>
                        <div v-else>-</div>
                    </td>
                    <!--放款时间-->
                    <td>
                        <times :time="data.transfer_time"></times>
                    </td>
                    <td>
                        <permission tag="span" class="operate" :route="apis.url_info" @click="lookOver(data.id)">查看
                        </permission>
                    </td>
                </tr>
                <template v-if="data.show">
                    <tr class="bold-font">
                        <td :rowspan="data.sku_list.length+1"></td>
                        <td colspan="3">ItemId</td>
                        <td colspan="2">平台SKU</td>
                        <td colspan="8">商品名称</td>
                        <td>数量</td>
                        <td>出售价</td>
                        <td :rowspan="data.sku_list.length+1"></td>
                    </tr>
                    <tr v-for="good in data.sku_list">
                        <!--ItemId-->
                        <td colspan="3">
                            <ui-tip :content="good.item_id" :is-link="true" @cur-click="cur_click(good)"
                                    :width="88"></ui-tip>
                        </td>
                        <!--平台SKU-->
                        <td colspan="2">
                            <ui-tip v-if="good.variation_sku" :content="good.variation_sku" :width="88"></ui-tip>
                            <ui-tip v-else :content="good.sku" :width="88"></ui-tip>
                        </td>
                        <!--商品名称-->
                        <td colspan="8">
                            <ui-tip :content="good.title" :width="88"></ui-tip>
                        </td>
                        <!--数量-->
                        <td>{{good.quantity_purchased}}</td>
                        <!--出售价-->
                        <td>
                            <span v-if="good.transaction_price">{{data.currency_id}} {{good.transaction_price | filterPrice}}</span>
                        </td>
                    </tr>
                </template>
            </template>
            </tbody>
            <!--</table>-->
        </ui-table>
        <!--分页-->
        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="dataTable.page"
            :page-sizes="[20, 50, 100, 200,500]"
            :page-size="dataTable.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="dataTable.totalSize">
        </el-pagination>
        <!--订单弹框-->
        <order-form v-model="orders" :form="form"></order-form>
    </el-row>
</template>
<style lang="stylus">
    .ebay {
        a:hover {
            font-size: 12px;
        }
        .ui-table-body {
            .template.secTable {
                table-layout: fixed;
                td {
                    .ebay-hidden-id {
                        vertical-align: middle;
                        margin: 0 0;
                        display: inline-block;
                        width: 170px;
                        padding: 0 5px;
                        text-overflow: ellipsis;
                        word-break: keep-all;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                    .ebay-hidden {
                        vertical-align: middle;
                        margin: 0 0;
                        display: inline-block;
                        width: 95%;
                        padding: 0 5px;
                        text-overflow: ellipsis;
                        word-break: keep-all;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }
            }
        }
    }
</style>
<script>
    import orderForm from './order-form.vue';
    import {api_info, to_lead} from '../../../../api/ebay-order';
    import {url_info} from '../../../../api/ebay-order';

    export default {
        permission: {
            url_info,
        },
        data() {
            return {
                value1: "",
                shows: {},
                orders: false,
                form: {
                    sku_list: [
                        {item_id: 0, title: "", quantity_purchased: "", transaction_price: ""}
                    ],
                },
                chooseId: 0,
                isChoose: false,
                checkAll: false,
                clickData: [],
                tipTitle: "点击可查看 ItemId，平台SKU，商品名称，数量，出售价 等信息"
            }
        },
        filters: {
            filterSendTime(val) {
                if (val) return datef('YYYY-MM-dd HH:mm:ss', val);
            },
            filterStatus(val) {
                return val ? datef('YYYY-MM-dd HH:mm:ss', val) : "未发货"
            },
            filterPayment(val) {
                return val ? datef('YYYY-MM-dd HH:mm:ss', val) : "未付款"
            },
            filterPrice(val) {
                if (val) return parseFloat(val).toFixed(2);
            }
        },
        mounted() {
            for (let i = 0; i < this.dataTable.lists.length; i++) {
                this.clickData.push(false)
            }
        },
        computed: {
            selected() {
                return this.dataTable.lists.filter(data => data.selected).map(data => data.id);
            }
        },
        methods: {
            filter_price(price){
                if (price) return parseFloat(price).toFixed(2)
            },
            cur_click(val) {
                window.open(`http://www.ebay.com/itm/${val.item_id}`);
            },
            //订单页面 子列表
            fix_list() {
                this.$nextTick(() => {
                    if (this.dataTable.lists.length > 0) {
                        this.dataTable.lists.forEach((data, i) => {
                            this.$set(this.dataTable.lists[i], 'show', true);
                            this.$set(this.dataTable.lists[i], 'selected', false);
                        });
                    }
                })
            },
            show_detail(data) {
                data.show = data.show ? false : true;
            },
            //升降序
            sort_click(val) {
                this.$emit("sort-click", val);
            },
            //checkbox
            checkAllBox(val) {
                this.dataTable.lists.forEach(row => {
                    row.isCheck = val;
                });
            },
            checkBox() {
                this.checkAll = this.dataTable.lists.every(row => row.isCheck === true);
            },
            //分页改变
            handleSizeChange(size) {
                this.$emit('size-change', size);
            },
            handleCurrentChange(page) {
                this.$emit("page-change", page);
            },
            //查看订单详情
            lookOver(id) {
                this.$http(api_info, id).then(data => {
                    data.forEach(row => {
                        this.form = row
                    });
                });
                this.orders = true;
            },
            // 添加class
            addClass(index) {
                this.clickData = this.clickData.map(() => {
                    return false
                });
                this.clickData[index] = true
            }
        },
        watch: {
            'dataTable.lists'(val) {
                if (val.length > 0) {
                    this.checkAll = this.dataTable.lists.every(row => row.isCheck === true);
                } else {
                    this.checkAll = false;
                }
            }
        },
        props: {
            dataTable: {
                required: true,
                type: Object
            },
            isLoading: {
                required: true,
                type: Boolean
            },
            firstLoading: {
                required: true,
                type: Boolean
            }
        },
        components: {
            orderForm,
            uiTable: require("../../../../components/ui-table.vue").default,
            uiTip: require('../../../../components/ui-tip.vue').default,
            plusMinus: require('../../../../components/plus-minus.vue').default,
            timeOut: require('../../local/time-out.vue').default,
        }
    }
</script>
