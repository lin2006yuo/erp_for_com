<template>
    <page>
        <page-dialog :title="title" v-model="historyDialogShow" size="full" :close-on-click-modal="false" @close="close">
            <h4>
                <span>ebay账号:{{ historyData.account_name }}</span>
                <span class="ml-sm">账号简称:{{ historyData.code }}</span>
            </h4>
            <el-table class="scroll-bar"
                      :data="historyTableData">
                <el-table-column
                        label="数据抓取日期">
                    <template slot-scope="scope">
                        <span>{{ scope.row.create_time*1000 | fdatetime }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        width="100"
                        prop="region"
                        label="站点">
                </el-table-column>
                <el-table-column
                        label="当前级别">
                    <template slot-scope="scope">
                        <span>{{scope.row.current_seller_level}}</span>
                        <img src="../../../../assets/date.svg" :title="`${scope.row.c_evaluated_date}`" alt="" style="vertical-align: middle;float: right">
                    </template>
                </el-table-column>
                <el-table-column
                        label="当前不良交易率">
                    <template slot-scope="socpe">
                        <span>{{ socpe.row.c_transaction_defect_rate }}%</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="当前运输超期率">
                    <template slot-scope="socpe">
                        <span>{{ socpe.row.c_late_shipment_rate }}%</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="当前纠纷未解决关闭率">
                    <template slot-scope="socpe">
                        <span>{{ socpe.row.c_case_closed_noresolve }}%</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="按今日统计级别">
                    <template slot-scope="scope">
                        <span>{{scope.row.today_level}}%</span>
                        <img src="../../../../assets/date.svg" :title="scope.row.next_evaluated_date" alt="" style="vertical-align: middle;float: right">
                    </template>
                </el-table-column>
                <el-table-column
                        label="按今日统计不良率">
                    <template slot-scope="socpe">
                        <span>{{ socpe.row.t_transaction_defect_rate }}%</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="按今日统计运输超期率">
                    <template slot-scope="socpe">
                        <span>{{ socpe.row.t_late_shipment_rate }}%</span>
                    </template>
                </el-table-column>
                <el-table-column
                        width="180"
                        label="按今日统计纠纷未解决关闭率">
                    <template slot-scope="socpe">
                        <span>{{ socpe.row.t_case_closed_noresolve }}%</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="退货率">
                    <template slot-scope="socpe">
                        <span>{{ socpe.row.return_rate }}%</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handle_history_size_change"
                    @current-change="handle_history_current_change"
                    :current-page="historyData.page"
                    :page-sizes="[20, 50, 100, 200]"
                    :page-size="historyData.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="historyTotal">
            </el-pagination>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="historyDialogShow = false">关闭</el-button>
            </div>
        </page-dialog>
    </page>
</template>

<style lang="stylus" scoped>
    .el-pagination{
        float: right
    }
</style>

<script>
    export default {
        name: "history-data-dialog",
        data(){
            return {
                title: '历史数据',
                historyDialogShow: this.value
            }
        },
        methods: {
            close(){},
            handle_history_size_change(val){//切换条数
                this.$emit('handle-history-size-change',val)
            },
            handle_history_current_change(val){//切换页数
                this.$emit('handle-history-current-change',val)
            },
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
                type: Array
            },
            historyTotal: '',
            historyData: {
                type: Object
            }
        },
        components: {
            pageDialog: require('@/components/page-dialog').default
        }
    }
</script>