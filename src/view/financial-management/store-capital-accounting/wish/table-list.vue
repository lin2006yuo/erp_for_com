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
            <el-table-column label="日期范围" inline-template width="170">
                <span>{{row.date_s}}--{{row.date_e}}</span>
            </el-table-column>
            <el-table-column label="账号简称" prop="account"></el-table-column>
            <el-table-column label="销售员" prop="seller"></el-table-column>
            <el-table-column label="交易款项-放款" prop="payment_for_transactions_sum"></el-table-column>
            <el-table-column label="退款金额" prop="refund_amount_sum"></el-table-column>
            <el-table-column label="释放暂扣货款" prop="withheld_transactions_released_sum"></el-table-column>
            <el-table-column label="其他款项" prop="other_payments_sum"></el-table-column>
            <el-table-column label="扣除退款" prop="refund_deduction_sum"></el-table-column>
            <el-table-column label="其他费用" prop="fees_sum"></el-table-column>
            <el-table-column label="罚款或暂扣贷款金额" prop="fines_sum"></el-table-column>
            <el-table-column label="现金返还" prop="wish_express_cash_back_sum"></el-table-column>
            <el-table-column label="转账金额" prop="gross_amount_sum"></el-table-column>
            <el-table-column label="扣除数额" prop="amount_withheld_sum"></el-table-column>
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
            }
        },
       props:{
           table:{},
           loading:{},
           firstTime:{}
       }
    }
</script>

