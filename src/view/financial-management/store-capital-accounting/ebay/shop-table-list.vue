<template>
    <div>
        <div class="ebay-shop-scroll">
            <ui-table v-loading="isLoading" :first-loading="firstLoading" element-loading-text="玩命加载中..."
                      :has-data="dataTable.list.length>0"
                      class="ebay" v-model="checkAll" @check="checkAllBox"  :body-height="38"
                      :heads="headers"
            >
                <tbody>
                <template v-if="dataTable.sum_total.order_total_cny">
                    <tr class="tr-shop-td">
                        <td class="border-left-shop"></td>
                        <td>汇总</td>
                        <td></td>
                        <td></td>
                        <td>{{cny1}}</td>
                        <td>{{cny2}}</td>
                        <td>{{cny3}}</td>
                        <td>{{cny4}}</td>
                        <td>{{cny5}}</td>
                        <td>{{cny6}}</td>
                        <td>{{cny7}}</td>
                        <td>{{cny8}}</td>
                        <td>{{cny9}}</td>
                        <td>{{cny10}}</td>
                        <td>{{cny11}}</td>
                        <td>{{cny12}}</td>
                        <td>{{cny13}}</td>
                        <td>{{cny14}}</td>
                        <td>{{cny15}}</td>
                    </tr>
                </template>
                <template v-for="(data, index) in dataTable.list">
                    <tr :class="[trFlag === index ?'active-color':'']" @click="addClass(index)" :key="data.account_id">
                        <td class="border-left-shop">
                            <el-checkbox v-model="data.isCheck" @change="checkBox"></el-checkbox>
                        </td>
                        <!--账号简称-->
                        <td class="t-left">
                            <plus-minus @show-detail="show_detail(data)" :show="data.show" :title="titleTip"></plus-minus>
                            <span>{{data.code}}</span>
                        </td>
                        <!--站点-->
                        <td>
                            <span class="ellipsis width-shop-ebay-total" :title="data.site">{{data.site}}</span>
                        </td>
                        <!-- 销售员 -->
                        <td>
                            <span>{{data.realname}}</span>
                        </td>
                        <!-- 系统订单总额 -->
                        <td>
                            <span >{{data.order_total_cny | positive}} ¥ {{data.order_total_cny | filterCny}}</span>
                        </td>
                        <!--payPal销售额-->
                        <td>
                            <span>{{data.shop_total_cny | positive}} ¥ {{data.shop_total_cny | filterCny}}</span>
                        </td>
                        <!--payPal佣金-->
                        <td>
                            <span>{{data.paypal_commission_cny | positive}} ¥ {{data.paypal_commission_cny | filterCny}}</span>
                        </td>

                        <!--退款合计-->
                        <td>
                            <span>{{data.refund_total_cny | positive}} ¥ {{data.refund_total_cny | filterCny}}</span>
                        </td>

                        <!--退款佣金-->
                        <td>
                            <span>{{data.refund_commission_cny | positive}} ¥ {{data.refund_commission_cny | filterCny}}</span>
                        </td>

                        <!--支付ebay账单-->
                        <td>
                            <span>{{data.ebay_pay_order_cny | positive}} ¥ {{data.ebay_pay_order_cny | filterCny}}</span>
                        </td>

                        <!--PayPal对外付款-->
                        <td>
                            <span>{{data.paypal_foreign_payment_cny | positive}} ¥ {{data.paypal_foreign_payment_cny | filterCny}}</span>
                        </td>

                        <!--冻结金额结算-->
                        <td>
                            <span>{{data.frozen_amount_cny | positive}} ¥ {{data.frozen_amount_cny | filterCny}}</span>
                        </td>

                        <!--抵消项结算-->
                        <td>
                            <span>{{data.offset_settlement_cny | positive}} ¥ {{data.offset_settlement_cny | filterCny}}</span>
                        </td>
                        <!--其他正项总额-->
                        <td>
                            <span>{{data.other_items_cny | positive}} ¥ {{data.other_items_cny | filterCny}}</span>
                        </td>

                        <!--其他费用总额-->
                        <td>
                            <span>{{ data.other_fee_cny | positive}} ¥ {{data.other_fee_cny | filterCny}}</span>
                        </td>

                        <!--退款佣金返还-->
                        <td>
                            <span>{{ data.refund_commission_fee_cny | positive}} ¥ {{data.refund_commission_fee_cny | filterCny}}</span>
                        </td>

                        <!-- Paypal手续费 -->
                        <td>
                            <span>{{ data.paypal_fee_cny | positive}} ¥ {{data.paypal_fee_cny | filterCny}}</span>
                        </td>

                        <!--其它正项费用-->
                        <td>
                            <span>{{ data.surplus_plus_fee_cny | positive}} ¥ {{data.surplus_plus_fee_cny | filterCny}}</span>
                        </td>

                        <!--其它负项费用-->
                        <td>
                            <span>{{ data.surplus_minus_fee_cny | positive}} ¥ {{data.surplus_minus_fee_cny | filterCny}}</span>
                        </td>
                    </tr>
                    <template v-if="data.show">

                        <tr v-for="(good, index) in data.payDetail" :key="index">
                            <td class="border-left-shop"></td>
                            <td colspan="4">
                                <!-- 邮箱内容。 -->
                                {{good.account_name}}
                            </td>
                            <!-- 这里系统订单总额。 -->
                            <!--<td>-->
                            <!--<span>{{data.order_total_cny | positive}} ¥ {{data.order_total_cny | filterCny}}</span>-->
                            <!--</td>-->
                            <td>
                                <span>{{good.shop_total_cny | positive}} ¥ {{good.shop_total_cny | filterCny}}</span>
                            </td>
                            <!--payPal佣金-->
                            <td>
                                <span>{{good.paypal_commission_cny | positive}} ¥ {{good.paypal_commission_cny | filterCny}}</span>
                            </td>

                            <!--退款合计-->
                            <td>
                                <span>{{good.refund_total_cny | positive}} ¥ {{good.refund_total_cny | filterCny}}</span>
                            </td>

                            <!--退款佣金-->
                            <td>
                                <span>{{good.refund_commission_cny | positive}} ¥ {{good.refund_commission_cny | filterCny}}</span>
                            </td>

                            <!--支付ebay账单-->
                            <td>
                                <span>{{good.ebay_pay_order_cny | positive}} ¥ {{good.ebay_pay_order_cny | filterCny}}</span>
                            </td>

                            <!--PayPal对外付款-->
                            <td>
                                <span>{{good.paypal_foreign_payment_cny | positive}} ¥ {{good.paypal_foreign_payment_cny | filterCny}}</span>
                            </td>

                            <!--冻结金额结算-->
                            <td>
                                <span>{{good.frozen_amount_cny | positive}} ¥ {{good.frozen_amount_cny | filterCny}}</span>
                            </td>

                            <!--抵消项结算-->
                            <td>
                                <span>{{good.offset_settlement_cny | positive}} ¥ {{good.offset_settlement_cny | filterCny}}</span>
                            </td>
                            <!--其他正项总额-->
                            <td>
                                <span>{{good.other_items_cny | positive}} ¥ {{good.other_items_cny | filterCny}}</span>
                            </td>

                            <!--其他费用总额-->
                            <td>
                                <span>{{ good.other_fee_cny | positive}} ¥ {{good.other_fee_cny | filterCny}}</span>
                            </td>

                            <!--退款佣金返还-->
                            <td>
                                <span>{{ good.refund_commission_fee_cny | positive}} ¥ {{good.refund_commission_fee_cny | filterCny}}</span>
                            </td>

                            <!-- Paypal手续费 -->
                            <td>
                                <span>{{ good.paypal_fee_cny | positive}} ¥ {{good.paypal_fee_cny | filterCny}}</span>
                            </td>

                            <!--其它正项费用-->
                            <td>
                                <span>{{ good.surplus_plus_fee_cny | positive}} ¥ {{good.surplus_plus_fee_cny | filterCny}}</span>
                            </td>

                            <!--其它负项费用-->
                            <td>
                                <span>{{ good.surplus_minus_fee_cny | positive}} ¥ {{good.surplus_minus_fee_cny | filterCny}}</span>
                            </td>

                        </tr>
                    </template>
                </template>
                </tbody>
                <!--</table>-->
            </ui-table>
        </div>

        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="dataTable.page"
            :page-sizes="[20,50,100,200,500]"
            :page-size="dataTable.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="dataTable.count">
        </el-pagination>

    </div>
</template>

<style lang="stylus">
    .border-left-shop {
        border-left: 1px solid #ddd;
    }
    .tr-shop-td{
        font-weight bold;
    }
    .width-shop-ebay-total{
        width 100px;
        display inline-block;
    }
    .ebay-shop-scroll{
        overflow-x auto;
        .c-ui-table-important{
            width 2500px;
        }
    }
</style>

<script>

    import {api_paypal_detail} from "../../../../api/ebay-cash"
    import { filterCny1, positive1, inputValue } from './util'

    export default {
        data() {
            return {
                checkAll: false,
                trFlag: -1,
                titleTip: '点击可查看细节',
                headers:[
                    {isCheck:true,size:30},
                    {label:'账号简称',size:120},
                    {label:'站点',size:120},
                    {label:'销售员',size:120},
                    {label:'系统订单总额', size:120},
                    {label:'PayPal销售额',size:120},
                    {label:'PayPal佣金',size:120},
                    {label:'退款合计',size:120},
                    {label:'退款佣金',size:120},
                    {label:'支付eBay账单',size:120},
                    {label:'PayPal\n对外付款',size:120},
                    {label:'冻结金额结算',size:120},
                    {label:'抵消项结算',size:120},
                    {label:'其它正项总额',size:120},
                    {label:'其它费用总额',size:120},
                    {label:'退款佣金返还',size:120},
                    {label:'PayPal手续费',size:120},
                    {label:'其它正项费用',size:120},
                    {label:'其它负项费用',size:120},
                ]
            }
        },
        computed: {
            emptyText() {
                return this.firstTime ? '等待查询数据中...' : '暂无数据'
            },
            // 系统订单总额
            cny1() {
                let cny = this.dataTable.sum_total.order_total_cny + "";
                return this.inputValue(cny);
            },
            // paypal销售额
            cny2() {
                let cny = this.dataTable.sum_total.shop_total_cny + "";
                return this.inputValue(cny);
            },
            // paypal佣金
            cny3() {
                let cny = this.dataTable.sum_total.paypal_commission_cny + "";
                return this.inputValue(cny);
            },
            // 退款合计
            cny4() {
                let cny = this.dataTable.sum_total.refund_total_cny + "";
                return this.inputValue(cny);
            },
            // 退款佣金
            cny5() {
                let cny = this.dataTable.sum_total.refund_commission_cny + "";
                return this.inputValue(cny);
            },
            // 支付eBay账单
            cny6() {
                let cny = this.dataTable.sum_total.ebay_pay_order_cny + "";
                return this.inputValue(cny);
            },
            // PayPal对外付款
            cny7() {
                let cny = this.dataTable.sum_total.paypal_foreign_payment_cny + "";
                return this.inputValue(cny);
            },
            // 冻结金额结算
            cny8() {
                let cny = this.dataTable.sum_total.frozen_amount_cny + "";
                return this.inputValue(cny);
            },
            // 抵消项结算
            cny9() {
                let cny = this.dataTable.sum_total.offset_settlement_cny + "";
                return this.inputValue(cny);
            },
            // 其他正项总额
            cny10() {
                let cny = this.dataTable.sum_total.other_items_cny + "";
                return this.inputValue(cny);
            },
            // 其他费用总额
            cny11() {
                let cny = this.dataTable.sum_total.other_fee_cny + "";
                return this.inputValue(cny);
            },
            // 退款佣金返还
            cny12() {
                let cny = this.dataTable.sum_total.refund_commission_fee_cny + "";
                return this.inputValue(cny);
            },
            // PayPal手续费
            cny13() {
                let cny = this.dataTable.sum_total.paypal_fee_cny + "";
                return this.inputValue(cny);
            },
            // 其他正项费用
            cny14() {
                let cny = this.dataTable.sum_total.surplus_plus_fee_cny + "";
                return this.inputValue(cny);
            },
            // 其他负项费用
            cny15() {
                let cny = this.dataTable.sum_total.surplus_minus_fee_cny + "";
                return this.inputValue(cny);
            },

        },
        filters: {
            filterCny(val) {
                if (!~val.indexOf('-')) {
                    // 不包含的话。
                    return val;
                } else {
                    return val.substr(1);
                }
            },
            positive(val) {
                if (!~val.indexOf('-')) {
                    return '';
                } else {
                    return '-'
                }
            }
        },
        methods: {
            inputValue,
            checkAllBox(val) {
                this.dataTable.list.forEach(item => {
                    item.isCheck = val;
                });
            },
            // 选中一个之后--全选按扭即被选中。
            checkBox() {
                this.checkAll = this.dataTable.list.every(item => item.show === true);
            },
            // 是否显示细节。
            show_detail(data) {
                data.show = !data.show;
                if (data.payDetail && data.payDetail.length) {
                    return;
                }
                let params = {
                    paypal_detail:data.paypal_detail
                };
                this.$http(api_paypal_detail, params).then(res => {
                    data.payDetail = res;
                }).catch(err => {
                    this.$message({
                       type:'error',
                       message: err.message || err
                    });
                });
            },
            // 给选中的tr行添加背景色。
            addClass(index) {
                this.trFlag = index;
            },
            handleSizeChange(val) {
                this.$emit('sizeChange', val)
            },
            handleCurrentChange(val) {
                this.$emit('pageChange', val)
            },
        },
        props: {
            dataTable: {},
            isLoading: {
                required: true,
                type: Boolean
            },
            firstLoading: {
                required: true,
                type: Boolean
            },
            firstTime: {},
            searchData:{},
        },
        components: {
            plusMinus: require('../../../../components/plus-minus.vue').default,
        }
    }
</script>



