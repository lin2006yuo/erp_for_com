<template>
    <div>
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
            </div>>
            <el-table-column type="selection"
                             width="40">
            </el-table-column>
            <el-table-column label="日期范围">
                <el-table-column  label="汇 总" width="160">
                    <template slot-scope="scope">
                        <span>{{scope.row.date_s}}--{{scope.row.date_e}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="账号简称">
                <el-table-column  label="">
                    <template slot-scope="scope">
                        {{scope.row.account}}
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="销售员">
                <el-table-column  label="" width="80">
                    <template slot-scope="scope">
                        {{scope.row.seller}}
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="订单金额" >
                <el-table-column :render-header="render_header_order">
                    <template slot-scope="scope">
                        {{scope.row.order_amount}}
                    </template>
                </el-table-column>
            </el-table-column>

            <el-table-column label="交易款项-放款">
                <el-table-column :render-header="render_header_payment">
                    <template slot-scope="scope">
                        {{scope.row.payment_for_transactions_sum}}
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="退款金额">
                <el-table-column :render-header="render_header_refund_amount">
                    <template slot-scope="scope">
                        {{scope.row.refund_amount_sum}}
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="退款比例" >
                <el-table-column :render-header="render_header_refund_amount_rate">
                    <template slot-scope="scope">
                        {{scope.row.refund_amount_aum_propertion}}
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="释放暂扣货款">
                <el-table-column :render-header="render_header_withheld">
                    <template slot-scope="scope">
                        {{scope.row.withheld_transactions_released_sum}}
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="其他款项" >
                <el-table-column :render-header="render_header_other_payments">
                    <template slot-scope="scope">
                        {{scope.row.other_payments_sum}}
                    </template>
                </el-table-column>
            </el-table-column>
            <!--<el-table-column label="扣除退款" prop="refund_deduction_sum"></el-table-column>-->
            <el-table-column label="其他费用">
                <el-table-column :render-header="render_header_fees_sum">
                    <template slot-scope="scope">
                        {{scope.row.fees_sum}}
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="罚款或暂扣贷款金额" >
                <el-table-column :render-header="render_header_fines_sum"
                                 width="130">
                    <template slot-scope="scope">
                        {{scope.row.fines_sum}}
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="现金返还" >
                <el-table-column :render-header="render_header_cash_back">
                    <template slot-scope="scope">
                        {{scope.row.wish_express_cash_back_sum}}
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="转账金额" >
                <el-table-column :render-header="render_header_gross_amount">
                    <template slot-scope="scope">
                        {{scope.row.gross_amount_sum}}
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="转账比例">
                <el-table-column :render-header="render_header_gross_rate">
                    <template slot-scope="scope">
                        {{scope.row.gross_amount_sum_propertion}}
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="扣除数额">
                <el-table-column :render-header="render_header_amount_withheld">
                    <template slot-scope="scope">
                        {{scope.row.amount_withheld_sum}}
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="table.page"
                :page-sizes="[20,50,100,200,500]"
                :page-size="table.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="table.total">
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
        methods: {
            render_header_order(){
                return this.gather.order_amount;
            },
            render_header_payment(){
                return this.gather.payment_for_transactions_sum;
            },
            render_header_refund_amount(){
                return this.gather.refund_amount_sum;
            },
            render_header_refund_amount_rate(){
                return this.gather.refund_amount_aum_propertion;
            },
            render_header_withheld(){
                return this.gather.withheld_transactions_released_sum;
            },
            render_header_other_payments(){
                return this.gather.other_payments_sum;
            },
            render_header_fees_sum(){
                return this.gather.fees_sum;
            },
            render_header_fines_sum(){
                return this.gather.fines_sum;
            },
            render_header_cash_back(){
                return this.gather.wish_express_cash_back_sum;
            },
            render_header_gross_amount(){
                return this.gather.gross_amount_sum;
            },
            render_header_gross_rate(){
                return this.gather.gross_amount_sum_propertion;
            },
            render_header_amount_withheld(){
                return this.gather.amount_withheld_sum;
            },
            selectionChange(val) {
                this.$emit('select-change',val)
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
        },
        props:{
            table:{},
            loading:{},
            firstTime:{},
            gather:{}
        }
    }
</script>

