<template>
    <page>
        <page-dialog :title='`查看账户：${historyTableData.account_name}的历史数据`' v-model="historyDialogShow" size="full" :close-on-click-modal="false" @close="close">
            <el-table class="scroll-bar"
                      :data="historyTableData.data">
                <el-table-column
                        label="数据抓取日期">
                    <template slot-scope="scope">
                        <span>{{ scope.row.create_time }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="订单缺陷率（卖方完成）">
                    <template slot-scope="scope">
                        <span>{{scope.row.order_defect_rate_buyer}}</span>
                        <span>{{historyTableData.unit.order_defect_rate_buyer}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="订单缺陷率（亚马逊完成）">
                    <template slot-scope="scope">
                        <span>{{ scope.row.order_defect_rate_channel}}</span>
                        <span>{{historyTableData.unit.order_defect_rate_channel}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="提示信息">
                    <template slot-scope="scope">
                        <span :title="`${scope.row.hint_msg}`">{{ scope.row.hint_msg===''?'无':'有' }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="最近付款金额">
                    <template slot-scope="scope">
                        <span>{{ scope.row.latest_payment }}</span>
                        <span>{{historyTableData.unit.latest_payment}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="余额">
                    <template slot-scope="scope">
                        <span>{{scope.row.balance}}</span>
                        <span>{{historyTableData.unit.balance}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="转账金额A">
                    <template slot-scope="scope">
                        <span>{{ scope.row.transfer_amount_a }}</span>
                        <span>{{historyTableData.unit.transfer_amout_a}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="转账金额A之转账日期">
                    <template slot-scope="scope">
                        <span>{{ scope.row.transfer_amount_a_time }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="转账金额B">
                    <template slot-scope="scope">
                        <span>{{ scope.row.transfer_amount_b}}</span>
                        <span>{{historyTableData.unit.transfer_amout_b}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="转账金额B之转账日期">
                    <template slot-scope="scope">
                        <span>{{ scope.row.transfer_amount_b_time }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="historyDialogShow = false">关闭</el-button>
            </div>
        </page-dialog>
    </page>
</template>
<style lang="stylus" scoped>

</style>
<script>
    export default {
        name: "history-data-dialog",
        data(){
            return {
                historyDialogShow: this.value
            }
        },
        methods: {
            close(){},
            // handle_history_size_change(val){//切换条数
            //     this.$emit('handle_history_size_change',val)
            // },
            // handle_history_current_change(val){//切换页数
            //     this.$emit('handle_history_current_change',val)
            // },
        },
        watch: {
            value(val){
                this.historyDialogShow = val;
            },
            historyDialogShow(val){
                this.$emit('input',val);
            }
        },
        props: {
            value:{
                type:Boolean,
                default(){
                    return false;
                }
            },
            historyTableData: {
                type: Object
            },
        },
        components: {
            pageDialog: require('@/components/page-dialog').default
        }
    }
</script>