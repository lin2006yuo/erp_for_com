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
                @selection-change="handle_selection_change"
                class="scroll-bar">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{ emptyText }}
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
                    prop="site"
                    width="90"
                    label="站点">
            </el-table-column>

            <el-table-column
                    label="订单缺陷率（卖方完成）">
                <template slot-scope="scope">
                    <span :class="{'red':+scope.row.order_defect_rate_buyer>+scope.row.goal.order_rate}">{{scope.row.order_defect_rate_buyer}}</span>
                    <span>{{unit.order_defect_rate_buyer}}</span>
                </template>
            </el-table-column>

            <el-table-column
                    label="订单缺陷率（亚马逊完成）">
                <template slot-scope="scope">
                    <span>{{ scope.row.order_defect_rate_channel}}</span>
                    <span>{{unit.order_defect_rate_channel}}</span>
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
                    <span>{{unit.latest_payment}}</span>
                </template>
            </el-table-column>

            <el-table-column
                    label="余额">
                <template slot-scope="scope">
                    <span>{{scope.row.balance}}</span>
                    <span>{{unit.balance}}</span>
                </template>
            </el-table-column>

            <el-table-column
                    label="转账金额A">
                <template slot-scope="scope">
                    <span>{{ scope.row.transfer_amount_a }}</span>
                    <span>{{unit.transfer_amount_a}}</span>
                </template>
            </el-table-column>

            <el-table-column
                    width="140"
                    label="转账金额A之转账日期">
                <template slot-scope="scope">
                    <span>{{ scope.row.transfer_amount_a_time }}</span>
                </template>
            </el-table-column>

            <el-table-column
                    label="转账金额B">
                <template slot-scope="scope">
                    <span>{{ scope.row.transfer_amount_b }}</span>
                    <span>{{unit.transfer_amount_b}}</span>
                </template>
            </el-table-column>

            <el-table-column
                    width="140"
                    label="转账金额B之转账日期">
                <template slot-scope="scope">
                    <span>{{ scope.row.transfer_amount_b_time }}</span>
                </template>
            </el-table-column>

            <el-table-column
                    width="140"
                    label="抓取时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.create_time|filterTime }}</span>
                </template>
            </el-table-column>

            <el-table-column
                    width="110"
                    label="登录验证状态">
                <template slot-scope="scope">
                    <span :class="{'red':scope.row.health_status!==1}">{{ scope.row.health_status|filterStatus }}</span>
                </template>
            </el-table-column>

            <el-table-column
                    width="150"
                    label="操作">
                <template slot-scope="scope">
                    <div class="mt-xs mb-xs">
                        <el-button type="text" size="mini" @click.native="view(scope.row)">查看</el-button>
                        <span> | </span>
                        <el-button type="text" size="mini" @click.native="edit(scope.row)">编辑</el-button>
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
                :page-size="searchData.pageSize"
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
        filters: {
            filterTime(val) {
                return datef("YYYY-MM-dd ", val);
            },
            filterStatus(val){
                let ret = '';
                switch (val){
                    case  0:
                        ret = '账号资料不完整';
                        break;
                    case 1:
                        ret = '有效';
                        break;
                    case 2:
                        ret = '无效';
                        break;
                    case 3:
                        ret = '连接不上服务器';
                        break;
                }
                return ret
            }
        },
        methods: {
            handle_selection_change(val) {
                this.$emit('handle-selection-change',val)
            },
            view(row){ // -----------------查看
                this.$emit('view',row)
            },
            edit(row){//------------编辑
                this.$emit('edit',row)
            },
            view_historical_data(row){//------------查看历史数据
                this.$emit('view-historical-data',row)
            },
            handle_size_change(val){//----切换条数
                this.$emit('handle-size-change',val)
            },
            handle_current_change(val){//----切换页数
                this.$emit('handle-current-change',val)
            },
        },
        computed:{
            emptyText(){
                return this.firstLoading?'等待查询数据中...':'暂无数据'
            }
        },
        props: {
            tableData:{
                type:Array,
            },
            searchData: {
                type: Object
            },
            total: {
                type: Number
            },
            loading:{
                type:Boolean,
            },
            firstLoading: {
                type: Boolean,
                require: true
            },
            unit:{
                type:Object
            }
        }
    }
</script>
