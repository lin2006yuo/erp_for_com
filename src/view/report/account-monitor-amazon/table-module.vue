<template>
    <div class="table-module">
        <el-table
            :data="tableData"
            v-resize="{height: 41}"
            element-loading-text="玩命加载中"
            border
            highlightCurrentRow
        >
            <div slot="empty" class="no-data-reminder">
                <i></i>暂无数据
            </div>
            <el-table-column
                prop="channel"
                label="平台"
            ></el-table-column>
            <el-table-column
                prop="website"
                label="站点"
            ></el-table-column>
            <el-table-column
                prop="account"
                label="账号简称"
            ></el-table-column>
            <el-table-column
                prop="seller"
                label="销售员"
            ></el-table-column>
            <el-table-column
                prop="department"
                label="部门"
            ></el-table-column>
            <el-table-column
                prop="listing_goal"
                label="listing目标数量"
            ></el-table-column>
            <el-table-column
                prop="active_date"
                label="激活日期"
            ></el-table-column>
            <el-table-column
                prop="exp_num"
                label="预估数量"
            ></el-table-column>
            <el-table-column
                prop="act_num"
                label="实际数量"
            ></el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                class="page-fixed"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200, 500]"
                :page-size="searchData.pageSize"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            ></el-pagination>
        </div>
    </div>
</template>
<script>
    export default {
        methods: {
            handleSizeChange(val) {
                this.searchData.pageSize = val
                this.$emit('size-change')
            },
            handleCurrentChange(val) {
                this.searchData.page = val
                this.$emit('current-change')
            }
        },
        props: {
            tableData: {
                type: Array,
                required: true,
                default: () => []
            },
            searchData: {
                type: Object,
                require: true,
                default: () => {}
            },
            total:{}
        }
    }
</script>
