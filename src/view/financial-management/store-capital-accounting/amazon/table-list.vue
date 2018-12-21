<template>
    <div>
        <el-table class="scroll-bar"
                  :data="table.list"
                  v-loading="loading"
                  v-resize="{height:41}"
                  element-loading-text="玩命加载中..."
                  @selection-change="selectionChange"
                  highlight-current-row
        >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>>
            <el-table-column
                    type="selection"
                    width="40">
            </el-table-column>
            <el-table-column label="日期范围" width="170" >
                <template slot-scope="scope">
                    <span class="operate" @click="detail(scope.row)">{{scope.row.settlement_start_time |fdatetime}}-{{scope.row.settlement_end_time|fdatetime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="账号简称" prop="account_name"></el-table-column>
            <el-table-column label="站点" prop="site"></el-table-column>
            <el-table-column label="销售员" prop="username"></el-table-column>s
            <el-table-column label="付款金额总计" prop="payment_amount" ></el-table-column>
            <el-table-column label="亚马逊所收税费"  prop="fee_amount" width="160"></el-table-column>
            <el-table-column label="促销返点总计" prop="promotion_return_amount" ></el-table-column>
            <el-table-column label="退款小计" prop="refund_amount" ></el-table-column>
            <el-table-column label="退款佣金" prop="refund_commission" ></el-table-column>
            <el-table-column label="其他服务费用总计" prop="other_fee_amount"></el-table-column>
            <el-table-column label="首期预留金额" prop="previous_reserve_amount" ></el-table-column>
            <el-table-column label="末期预留金额" prop="current_reserve_amount" ></el-table-column>
            <el-table-column label="预留金额结算" prop="reserve_amount" ></el-table-column>
            <el-table-column label="结算总额" prop="total_amount" ></el-table-column>
        </el-table>
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
        filters:{
            fdatetime(val) {
                return datef("YYYY-MM-dd ", val)
            }
        },
        methods: {
            selectionChange(val) {
                this.$emit('selection-change',val)
            },
            detail(val){
                this.$emit('detail',val)
            }
        },
        props:{
            loading:{},
            firstTime:{},
            table:{}
        }
    }
</script>

