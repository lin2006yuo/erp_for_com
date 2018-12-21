<template>
    <el-table :data="table"
              element-loading-text="玩命加载中..."
              style="width: 100%"
              >
        <div slot="empty" class="no-data-reminder">
            <i></i>
            {{emptyText}}
        </div>
        <el-table-column label="放款账期(周)" inline-template>
            <span :class="{'bold':row.loan_period==='汇总'}">{{row.loan_period}}</span>
        </el-table-column>
        <el-table-column label="订单量"  inline-template>
            <span :class="{'operate':row.loan_period!=='汇总'}" @click="detail(row)">{{row.order_quantity}}</span>
        </el-table-column>
        <el-table-column label="订单金额" prop="order_amount"></el-table-column>
        <el-table-column label="放款金额" prop="loan_amount"></el-table-column>
        <el-table-column label="放款比例(订单额)" prop="real_loan_proportion"></el-table-column>
        <el-table-column label="账期占比(订单量)" prop="order_proportion"></el-table-column>
        <el-table-column label="账期占比(订单额)" prop="loan_proportion"></el-table-column>
    </el-table>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        computed: {
            emptyText() {
                return this.firstTime ? '请查询数据' : '暂无数据'
            }
        },
        methods: {
            detail(row) {
                this.$emit('detail',row)
            }
        },
        props:{
            table:{},
            loading:{},
            firstTime:{},
        }
    }
</script>

<style scoped>
.bold{
    font-weight: 900;
}
</style>