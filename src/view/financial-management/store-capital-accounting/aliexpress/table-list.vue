<template>
    <div>
        <el-table :data="table.data"
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

            <el-table-column label="账号简称">
                <el-table-column label="汇总" inline-template>
                    <span class="ellipsis" :title="row.account_code">{{row.account_code}}</span>
                </el-table-column>
            </el-table-column>

            <el-table-column label="销售员">
                <el-table-column inline-template>
                    <span>{{row.seller_name}}</span>
                </el-table-column>
            </el-table-column>

            <el-table-column label="系统订单金额">
                <el-table-column inline-template :render-header="total2">
                    <span>{{row.order_amount | positive}} ¥ {{row.order_amount | filterCny}}</span>
                </el-table-column>
            </el-table-column>

            <el-table-column label="扣佣后放款">
                <el-table-column inline-template :render-header="total3">
                    <span>{{row.loan_amount | positive}} ¥ {{row.loan_amount | filterCny}}</span>
                </el-table-column>
            </el-table-column>

            <el-table-column label="退款金额">
                <el-table-column inline-template :render-header="total4">
                    <span>{{row.refund_amount | positive}} ¥ {{row.refund_amount | filterCny}}</span>
                </el-table-column>
            </el-table-column>

            <el-table-column label="退款比例">
                <el-table-column inline-template :render-header="total5">
                    <span>{{row.refund_amount_propertion}}</span>
                </el-table-column>
            </el-table-column>

            <el-table-column label="代扣运费">
                <el-table-column inline-template :render-header="total6">
                    <span>{{row.withhold_amount | positive}} ¥ {{row.withhold_amount | filterCny}}</span>
                </el-table-column>
            </el-table-column>

            <el-table-column label="其他与订单相关">
                <el-table-column inline-template :render-header="total7">
                    <span>{{row.correlative_amount | positive}} ¥ {{row.correlative_amount | filterCny}}</span>
                </el-table-column>
            </el-table-column>

            <el-table-column label="店铺费用">
                <el-table-column inline-template :render-header="total8">
                    <span>{{row.shop_fee | positive}} ¥ {{row.shop_fee | filterCny}}</span>
                </el-table-column>
            </el-table-column>

            <el-table-column label="转账金额">
                <el-table-column inline-template :render-header="total9">
                    <span>{{row.gross_amount | positive}} ¥ {{row.gross_amount | filterCny}}</span>
                </el-table-column>
            </el-table-column>

            <el-table-column label="转账比例CNY">
                <el-table-column inline-template :render-header="total0">
                    <span>{{row.gross_amount_propertion}}</span>
                </el-table-column>
            </el-table-column>

            <el-table-column label="支付宝转移金额">
                <el-table-column inline-template :render-header="total1">
                    <span>{{row.other_amount | positive}} ¥ {{row.other_amount | filterCny}}</span>
                </el-table-column>
            </el-table-column>

        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="table.page - 0"
                :page-sizes="[20,50,100,200,500]"
                :page-size="table.pageSize - 0"
                layout="total, sizes, prev, pager, next, jumper"
                :total="table.count - 0">
        </el-pagination>
    </div>
</template>

<style scoped>

</style>

<script>
    export default {
        computed:{
            emptyText() {
                return this.firstTime?'等待查询数据中...':'暂无数据'
            },
        },
        filters: {
            filterCny(val) {
                if (val) {
                    if (!~val.indexOf('-')) {
                        // 不包含的话。
                        return val;
                    } else {
                        return val.substr(1);
                    }
                }
            },
            positive(val) {
                if (val) {
                    if (!~val.indexOf('-')) {
                        return '';
                    } else {
                        return '-'
                    }
                }
            }
        },
        methods: {
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
                this.$emit('selectChange',val)
            },
            select_all(val){
                this.$emit('select-all',val)
            },
            handleSizeChange(val){
                this.$emit('sizeChange',val)
            },
            handleCurrentChange(val){
                this.$emit('pageChange',val)
            },
            total2() {
                let cny = this.table.sum.order_amount + "";
                if (cny === "undefined") {
                    return '';
                } else {
                    return this.positiveF(cny) +` ¥ ` +  this.filterCnyF(cny);
                }
            },
            total3() {
                let cny = this.table.sum.loan_amount + "";
                if (cny === "undefined") {
                    return '';
                } else {
                    return this.positiveF(cny) +` ¥ ` +  this.filterCnyF(cny);
                }
            },
            total4() {
                let cny = this.table.sum.refund_amount + "";
                if (cny === "undefined") {
                    return '';
                } else {
                    return this.positiveF(cny) +` ¥ ` +  this.filterCnyF(cny);
                }

            },
            total5() {
                let cny = this.table.sum.refund_amount_propertion + "";
                if (cny === "undefined") {
                    return '';
                } else {
                    return cny;
                }
            },
            total6() {
                let cny = this.table.sum.withhold_amount + "";
                if (cny === "undefined") {
                    return '';
                } else {
                    return this.positiveF(cny) +` ¥ ` +  this.filterCnyF(cny);
                }
            },
            total7() {
                let cny = this.table.sum.correlative_amount + "";
                if (cny === "undefined") {
                    return '';
                } else {
                    return this.positiveF(cny) +` ¥ ` +  this.filterCnyF(cny);
                }
            },
            total8() {
                let cny = this.table.sum.shop_fee + "";
                if (cny === "undefined") {
                    return '';
                } else {
                    return this.positiveF(cny) +` ¥ ` +  this.filterCnyF(cny);
                }
            },
            total9() {
                let cny = this.table.sum.gross_amount + "";
                if (cny === "undefined") {
                    return '';
                } else {
                    return this.positiveF(cny) +` ¥ ` +  this.filterCnyF(cny);
                }

            },
            total0() {
                let cny = this.table.sum.gross_amount_propertion + "";
                if (cny === "undefined") {
                    return '';
                } else {
                    return cny;
                }
            },
            total1() {
                let cny = this.table.sum.other_amount + "";
                if (cny === "undefined") {
                    return '';
                } else {
                    return this.positiveF(cny) +` ¥ ` +  this.filterCnyF(cny);
                }
            },
        },
       props:{
           table:{
               require:true
           },
           loading:{},
           firstTime:{}
       }
    }
</script>

