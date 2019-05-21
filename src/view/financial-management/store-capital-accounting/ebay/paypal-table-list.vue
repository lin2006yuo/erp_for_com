<template>
    <div>
        <div class="paypal-shop-scroll">
            <el-table :data="table.list"
                      v-loading="loading"
                      v-resize="{height:41}"
                      element-loading-text="玩命加载中..."
                      @selection-change="selectionChange"
                      @select-all="select_all"
                      highlight-current-row>
                <div slot="empty" class="no-data-reminder">
                    <i></i>
                    {{emptyText}}
                </div>
                <el-table-column
                    type="selection"
                    width="40">
                </el-table-column>

                <el-table-column label="PalPal账户" width="130">
                    <el-table-column label="汇总" inline-template>
                        <span class="ellipsis" :title="row.account_name">{{row.account_name}}</span>
                    </el-table-column>
                </el-table-column>

                <el-table-column label="销售额" width="130">
                    <el-table-column inline-template :render-header="total1">
                        <span :title="inputValue(row.shop_total_cny)">{{row.shop_total_cny | positive }} ¥ {{row.shop_total_cny | filterCny}}</span>
                    </el-table-column>
                </el-table-column>

                <el-table-column label="PalPal佣金" width="130">
                    <el-table-column inline-template :render-header="total2">
                        <span :title="inputValue(row.paypal_commission_cny)">{{row.paypal_commission_cny | positive}} ¥ {{row.paypal_commission_cny | filterCny}}</span>
                    </el-table-column>
                </el-table-column>

                <el-table-column label="退款合计" width="130">
                    <el-table-column inline-template :render-header="total3">
                        <span :title="inputValue(row.refund_total_cny)">{{row.refund_total_cny | positive}} ¥ {{row.refund_total_cny | filterCny}}</span>
                    </el-table-column>
                </el-table-column>

                <el-table-column label="退款佣金" width="130">
                    <el-table-column inline-template :render-header="total4">
                        <span :title="inputValue(row.refund_commission_cny)">{{row.refund_commission_cny | positive}} ¥ {{row.refund_commission_cny | filterCny}}</span>
                    </el-table-column>
                </el-table-column>

                <el-table-column label="支付eBay账单" width="130">
                    <el-table-column inline-template :render-header="total5">
                        <span :title="inputValue(row.ebay_pay_order_cny)">{{row.ebay_pay_order_cny | positive}} ¥ {{row.ebay_pay_order_cny | filterCny}}</span>
                    </el-table-column>
                </el-table-column>

                <el-table-column :label="labels" width="130">
                    <el-table-column inline-template :render-header="total6">
                        <span :title="inputValue(row.paypal_foreign_payment_cny)">{{row.paypal_foreign_payment_cny | positive}} ¥ {{row.paypal_foreign_payment_cny | filterCny}}</span>
                    </el-table-column>
                </el-table-column>

                <el-table-column label="冻结金额结算" width="130">
                    <el-table-column inline-template :render-header="total7">
                        <span :title="inputValue(row.frozen_amount_cny)">{{row.frozen_amount_cny | positive}} ¥ {{row.frozen_amount_cny | filterCny}}</span>
                    </el-table-column>
                </el-table-column>

                <el-table-column label="抵消项结算" width="130">
                    <el-table-column inline-template :render-header="total8">
                        <span :title="inputValue(row.offset_settlement_cny)">{{row.offset_settlement_cny | positive}} ¥ {{row.offset_settlement_cny | filterCny}}</span>
                    </el-table-column>
                </el-table-column>

                <el-table-column label="其他正项总额" width="130">
                    <el-table-column inline-template :render-header="total9">
                        <span :title="inputValue(row.other_items_cny)">{{row.other_items_cny | positive}} ¥ {{row.other_items_cny | filterCny}}</span>
                    </el-table-column>
                </el-table-column>


                <el-table-column label="其他费用总额" width="130">
                    <el-table-column inline-template :render-header="total10">
                        <span :title="inputValue(row.other_fee_cny)">{{row.other_fee_cny | positive}} ¥ {{row.other_fee_cny | filterCny}}</span>
                    </el-table-column>
                </el-table-column>


                <el-table-column label="退款返还佣金" width="130">
                    <el-table-column inline-template :render-header="total11">
                        <span :title="inputValue(row.refund_commission_fee_cny)">{{row.refund_commission_fee_cny | positive}} ¥ {{row.refund_commission_fee_cny | filterCny}}</span>
                    </el-table-column>
                </el-table-column>

                <el-table-column label="PayPal手续费" width="130">
                    <el-table-column inline-template :render-header="total12">
                        <span :title="inputValue(row.paypal_fee_cny)">{{row.paypal_fee_cny | positive}} ¥ {{row.paypal_fee_cny | filterCny}}</span>
                    </el-table-column>
                </el-table-column>

                <!--<el-table-column label="其他正项费用" width="130">-->
                    <!--<el-table-column inline-template :render-header="total13">-->
                        <!--<span :title="inputValue(row.surplus_plus_fee_cny)">{{row.surplus_plus_fee_cny | positive}} ¥ {{row.surplus_plus_fee_cny | filterCny}}</span>-->
                    <!--</el-table-column>-->
                <!--</el-table-column>-->

                <!--<el-table-column label="其他负项费用" width="130">-->
                    <!--<el-table-column inline-template :render-header="total14">-->
                        <!--<span :title="inputValue(row.surplus_minus_fee_cny)">{{row.surplus_minus_fee_cny | positive}} ¥ {{row.surplus_minus_fee_cny | filterCny}}</span>-->
                    <!--</el-table-column>-->
                <!--</el-table-column>-->

                <el-table-column label="提现合计" width="130">
                    <el-table-column inline-template :render-header="total15">
                        <span :title="inputValue(row.withdrawal_cny)">{{row.withdrawal_cny | positive}} ¥ {{row.withdrawal_cny | filterCny}}</span>
                    </el-table-column>
                </el-table-column>

                <el-table-column label="汇率差异" width="130">
                    <el-table-column inline-template :render-header="total16">
                        <span :title="inputValue(row.rate_dif_cny)">{{row.rate_dif_cny | positive}} ¥ {{row.rate_dif_cny | filterCny}}</span>
                    </el-table-column>
                </el-table-column>
            </el-table>
        </div>

        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="table.page"
            :page-sizes="[20,50,100,200,500]"
            :page-size="table.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="table.count">
        </el-pagination>
    </div>
</template>


<script>
    import {inputValue} from "./util";

    export default {
        data() {
            return {
                labels: 'PayPal\n对外付款'
            }
        },
        computed: {
            emptyText() {
                return this.firstTime ? '等待查询数据中...' : '暂无数据'
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
            filterCnyF(val) {
                if (val) {
                    if (!~val.indexOf('-')) {
                        // 不包含的话。
                        return val;
                    } else {
                        return val.substr(1);
                    }
                }
            },
            positiveF(val) {
                if (val) {
                    if (!~val.indexOf('-')) {
                        return '';
                    } else {
                        return '-'
                    }
                }
            },
            selectionChange(val) {
                this.$emit('select-change', val)
            },
            select_all(val) {
                this.$emit('select-all', val)
            },
            handleSizeChange(val) {
                this.$emit('sizeChange', val)
            },
            handleCurrentChange(val) {
                this.$emit('pageChange', val)
            },
            renderTitle(h, cny) {
                let str = this.inputValue(cny);
                return h("span", {
                    attrs: {
                        title: str
                    },
                }, str);
            },
            total1(h) {
                let cny = this.table.sum_total.shop_total_cny + "";
                return this.renderTitle(h, cny);
            },
            total2(h) {
                let cny = this.table.sum_total.paypal_commission_cny + "";
                return this.renderTitle(h, cny);
            },
            total3(h) {
                let cny = this.table.sum_total.refund_total_cny + "";
                return this.renderTitle(h, cny);
            },
            total4(h) {
                let cny = this.table.sum_total.refund_commission_cny + "";
                return this.renderTitle(h, cny);
            },
            total5(h) {
                let cny = this.table.sum_total.ebay_pay_order_cny + "";
                return this.renderTitle(h, cny);
            },
            total6(h) {
                let cny = this.table.sum_total.paypal_foreign_payment_cny + "";
                return this.renderTitle(h, cny);
            },
            total7(h) {
                let cny = this.table.sum_total.frozen_amount_cny + "";
                return this.renderTitle(h, cny);
            },
            total8(h) {
                let cny = this.table.sum_total.offset_settlement_cny + "";
                return this.renderTitle(h, cny);
            },
            total9(h) {
                let cny = this.table.sum_total.other_items_cny + "";
                return this.positiveF(cny) + ` ¥ ` + this.filterCnyF(cny);
            },
            total10(h) {
                let cny = this.table.sum_total.other_fee_cny + "";
                return this.renderTitle(h, cny);
            },
            total11(h) {
                let cny = this.table.sum_total.refund_commission_fee_cny + "";
                return this.renderTitle(h, cny);
            },
            total12(h) {
                let cny = this.table.sum_total.paypal_fee_cny + "";
                return this.renderTitle(h, cny);
            },
            total13(h) {
                let cny = this.table.sum_total.surplus_plus_fee_cny + "";
                return this.renderTitle(h, cny);
            },
            total14(h) {
                let cny = this.table.sum_total.surplus_minus_fee_cny + "";
                return this.renderTitle(h, cny);
            },
            total15(h) {
                let cny = this.table.sum_total.withdrawal_cny + "";
                return this.renderTitle(h, cny);
            },
            total16(h) {
                let cny = this.table.sum_total.rate_dif_cny + "";
                return this.renderTitle(h, cny);
            }
        },
        props: {
            table: {},
            loading: {},
            firstTime: {}
        }
    }
</script>
<style lang="stylus">
    .width-shop-ebay-total {
        width 75px;
        display inline-block;
    }

    .paypal-shop-scroll {
        overflow-x auto;
        width 100%;
        .el-table {
            width 2500px;
            max-width 2500px !important;
        }
    }
</style>

