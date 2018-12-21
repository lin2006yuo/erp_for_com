<template>
    <div>
        <el-table
                :data="tableData"
                ref="multipleTable"
                v-resize="{height:41}"
                border
                style="width: 100%"
                v-loading="loading"
                highlight-current-row
                element-loading-text="玩命加载中..."
                @sort-change="sort_click"
                @selection-change="handle_selection_change"
                class="scroll-bar">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                    type="selection"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="code"
                    width="110"
                    label="账号简称">
            </el-table-column>
            <el-table-column
                    width="90"
                    label="站点"
                    inline-template>
                <ui-tip :content="row.region" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column
                    width="140"
                    label="当前级别">
                <template slot-scope="scope">
                    <span>{{scope.row.current_seller_level}}</span>
                    <img src="../../../../assets/date.svg" :title="`${scope.row.c_evaluated_date}`" alt="" style="vertical-align: middle;float: right">
                </template>
            </el-table-column>
            <el-table-column
                    width="120"
                    label="当前不良交易率">
                <template slot-scope="scope">
                    <span :class="{'red':+scope.row.c_transaction_defect_rate>+scope.row.set_c_transaction_defect_rate}">{{ scope.row.c_transaction_defect_rate }}%</span>
                </template>
            </el-table-column>

            <el-table-column
                    width="120"
                    label="当前运输超期率">
                <template slot-scope="scope">
                    <span :class="{'red':+scope.row.c_late_shipment_rate>+scope.row.set_c_late_shipment_rate}">{{ scope.row.c_late_shipment_rate }}%</span>
                </template>
            </el-table-column>

            <el-table-column
                    label="当前纠纷未解决关闭率">
                <template slot-scope="scope">
                    <span :class="{'red':+scope.row.c_case_closed_noresolve>+scope.row.set_c_case_closed_noresolve}">{{ scope.row.c_case_closed_noresolve }}%</span>
                </template>
            </el-table-column>

            <el-table-column
                    width="140"
                    label="按今日统计级别">
                <template slot-scope="scope">
                    <span>{{scope.row.today_level}}</span>
                    <img src="../../../../assets/date.svg" :title="scope.row.next_evaluated_date" alt="" style="vertical-align: middle;float: right">
                </template>
            </el-table-column>

            <el-table-column
                    label="按今日统计不良交易率">
                <template slot-scope="scope">
                    <span :class="{'red':+scope.row.t_transaction_defect_rate>+scope.row.set_t_transaction_defect_rate}">{{ scope.row.t_transaction_defect_rate }}%</span>
                </template>
            </el-table-column>

            <el-table-column
                    prop="t_late_shipment_rate"
                    label="按今日统计运输超期率">
                <template slot-scope="scope">
                    <span :class="{'red':+scope.row.t_late_shipment_rate>+scope.row.set_t_late_shipment_rate}">{{ scope.row.t_late_shipment_rate }}%</span>
                </template>
            </el-table-column>

            <el-table-column
                    label="按今日统计纠纷未解决关闭率">
                <template slot-scope="scope">
                    <span :class="{'red':+scope.row.t_case_closed_noresolve>+scope.row.set_t_case_closed_noresolve}">{{ scope.row.t_case_closed_noresolve }}%</span>
                </template>
            </el-table-column>

            <el-table-column
                    width="120"
                    label="退货率">
                <template slot-scope="scope">
                    <span :class="{'red':+scope.row.return_rate>+scope.row.set_return_rate}">{{ scope.row.return_rate }}%</span>
                </template>
            </el-table-column>
            <el-table-column
                    width="140"
                    prop="create_time"
                    sortable="custom"
                    label="抓取时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.create_time*1000 | fdatetime }}</span>
                </template>
            </el-table-column>

            <el-table-column
                    width="140"
                    label="操作">
                <template slot-scope="scope">
                    <div class="mt-xs mb-xs">
                        <el-button type="text" size="mini" @click.native="view(scope.row)">查看与编辑</el-button>
                        <span> | </span>
                        <el-button type="text" size="mini" @click.native="view_historical_data(scope.row)">历史数据</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </div>
</template>
<style lang="stylus" scoped>

</style>
<script>
    export default {
        name: "manageTable",
        methods: {
            handle_selection_change(val) {
                this.$emit('handle-selection-change',val)
            },
            view(row){ // -------------------查看与编辑
                this.$emit('view',row)
            },
            view_historical_data(row){//----------------查看历史数据
                this.$emit('view-historical-data',row)
            },
            handle_size_change(val){//切换条数
                this.$emit('handle-size-change',val)
            },
            handle_current_change(val){//切换页数
                this.$emit('handle-current-change',val)
            },
            sort_click(val) {//排序
                this.$emit("sort-click", val);
            },
        },
        computed: {
            emptyText() {
                return this.firstLoading ? '请查询数据' : '暂无数据'
            }
        },
        props: {
            tableData:{
                type:Array,
            },
            searchData: {
                type: Object
            },
            total: '',
            loading:{
                type:Boolean,
            },
            firstLoading: {
                type: Boolean,
                default: true
            }
        },
        components:{
            uiTip: require("../../../../components/ui-tip.vue").default
        }
    }
</script>
