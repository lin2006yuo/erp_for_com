<template>
    <el-table :data="table"
              element-loading-text="玩命加载中..."
              style="width: 100%"
              class="wish-table"
              :row-style="rowStyleFn"
              v-resize="{height: 50}"
              border
              >
        <div slot="empty" class="no-data-reminder">
            <i></i>
            {{emptyText}}
        </div>
        <!--<el-table-column label="放款账期(周)" inline-template>-->
            <!--<span :class="{'bold':row.loan_period==='汇总'}">{{row.loan_period}}</span>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="订单量"  inline-template>-->
            <!--<span :class="{'operate':row.loan_period!=='汇总'}" @click="detail(row)">{{row.order_quantity}}</span>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="订单金额" prop="order_amount"></el-table-column>-->
        <!--<el-table-column label="放款 | 退款金额" prop="loan_amount"></el-table-column>-->
        <!--<el-table-column label="放款 | 退款比例" prop="real_loan_proportion"></el-table-column>-->
        <!--<el-table-column label="代扣费用" prop="****" v-if="sumaitong"></el-table-column>-->
        <!--<el-table-column label="其他相关费用" prop="****"></el-table-column>-->
        <!--<el-table-column label="转账金额" prop="transfer_amount"></el-table-column>-->
        <!--<el-table-column label="转账比例" prop="transfer_proportion"></el-table-column>-->
        <!--<el-table-column label="账期占比(订单量)" prop="order_proportion"></el-table-column>-->
        <!--<el-table-column label="账期占比(订单额)" prop="loan_proportion"></el-table-column>-->

        <!--new-->
        <el-table-column
            v-for="(item, index) in tableColumns"
            :key="`${item.value}-${index}`"
            :label="item.label"
            inline-template
            :width="item.width"
        >
            <!--？无法通过item.click === 'click'判断是否可点击-->
            <span v-if="item.value === 'order_quantity' && tableColumns[1].click === 'click'" :class="{'operate':row.loan_period!=='汇总'}" @click="detail(row)">{{row[item.value]}}</span>
            <span v-else>{{row[item.value]}}</span>
        </el-table-column>
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
                console.log('点击')
                this.$emit('detail',row)
            },
            rowStyleFn(row, rowIndex) {
                if(row.loan_period === '汇总' || row.loan_period === '代扣订单汇总' || row.loan_period === '非代扣订单汇总') return 'font-weight:800';
                return ''
            }
        },
        props:{
            table:{},
            loading:{},
            firstTime:{},
            tableColumns:{}
        }
    }
</script>

<style scoped>
.bold{
    font-weight: 900;
}
.wish-table .el-table__row:nth-last-child(1) {
        font-weight: bold;
    }
</style>
