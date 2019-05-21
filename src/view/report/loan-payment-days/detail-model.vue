<template>
    <page-dialog :title="title" v-model="show" size="large" @open="open" @close="cloce" :close-on-cilck-modal="false">
       <el-table :data="table.list" v-loading='table.loading' element-loading-text="玩命加载中...">
           <el-table-column label="订单号" prop="order_id"></el-table-column>
           <el-table-column label="平台/站点" prop="site"></el-table-column>
           <el-table-column label="账号简称" prop="account_code"></el-table-column>
           <el-table-column label="订单金额" prop="order_amount"></el-table-column>
           <el-table-column label="付款时间" inline-template>
               <span>{{row.payment_time |fdatetime}}</span>
           </el-table-column>
           <el-table-column label="放款金额" prop="loan_amount"></el-table-column>
           <el-table-column label="放款比例(订单额)" prop="real_loan_proportion"></el-table-column>
           <el-table-column label="转账金额" prop="transfer_amount"></el-table-column>
           <el-table-column label="转账比例" prop="transfer_proportion"></el-table-column>           <el-table-column label="放款时间" inline-template>
               <span>{{row.loan_time|fdatetime}}</span>
           </el-table-column>
           <el-table-column label="账期(天)" prop="loan_period_day"></el-table-column>
           <el-table-column label="账期(周)" prop="loan_period"></el-table-column>
       </el-table>
          <div slot="footer">
              <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page=table.page
                      :page-sizes="[20,50,100,200,500]"
                      :page-size=table.pageSize
                      layout="total, sizes, prev, pager, next, jumper"
                      :total='table.total'>
              </el-pagination>
          </div>
    </page-dialog>
</template>

<style scoped>

</style>

<script>
    export default {
        data() {
            return {
                show: this.value,
            }
        },
        methods: {
            open() {

            },
            cloce(){

            },
            handleCurrentChange(val){
                this.$emit('current-change',val);
            },
            handleSizeChange(val){
                this.$emit('size-change',val);
            },
        },
        filters:{
            fdatetime(val) {
                return datef("YYYY-MM-dd ", val)
            }
        },
        watch:{
            value(val){
                this.show = val
            },
            show(val){
                this.$emit('input',val)
            }
        },
        props:{
            value:{},
            title:{},
            table:{}
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>

