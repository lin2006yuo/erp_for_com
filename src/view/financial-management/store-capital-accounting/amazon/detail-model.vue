<template>
    <page-dialog :title=title v-model="show" size="full"
                 @open="open" @close="close" :close-on-cilck-modal="false">
        <el-table :data="detail_table.list">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column label="结算周期" width="170">
                <template slot-scope="scope">
                    <span >{{scope.row.settlement_start_time |fdatetime}}-{{scope.row.settlement_end_time|fdatetime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="账号简称" prop="account_name" ></el-table-column>
            <el-table-column label="站点" prop="site"></el-table-column>
            <el-table-column label="销售员" prop="seller_name"></el-table-column>
            <el-table-column label="付款金额" prop="payment_amount"></el-table-column>
            <el-table-column label="亚马逊所收税费" prop="fee_amount"></el-table-column>
            <el-table-column label="促销返点" prop="promotion_return_amount"></el-table-column>
            <el-table-column label="退款小计" prop="refund_amount"></el-table-column>
            <el-table-column label="退款佣金" prop="refund_commission"></el-table-column>
            <el-table-column label="其他服务费用" prop="other_fee_amount"></el-table-column>
            <el-table-column label="上期预留金额" prop="previous_reserve_amount"></el-table-column>
            <el-table-column label="本期预留金额" prop="current_reserve_amount"></el-table-column>
            <el-table-column label="预留金额结算" prop="reserve_amount"></el-table-column>
            <el-table-column label="结算金额" prop="total_amount"></el-table-column>
        </el-table>
        <div slot="footer">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="detail_table.page"
                    :page-sizes="[20,50,100,200,500]"
                    :page-size="detail_table.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="detail_table.total">
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
                data:[]
            }
        },
        methods: {
            open() {

            },
            close(){

            },
            handleSizeChange(val){
                this.$emit('detailSizeChange',val)
            },
            handleCurrentChange(val){
                this.$emit('detailCurrentChange',val)
            }
        },
        filters:{
            fdatetime(val) {
                return datef("YYYY-MM-dd ", val)
            }
        },
        computed:{
            emptyText() {
                return this.firstTime?'等待请求数据中...':'暂无数据'
            },
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
            firstTime:{},
            detail_table:{}
        },
        components:{
            pageDialog:require('@/components/page-dialog').default
        }
    }
</script>

