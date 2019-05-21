<template>
    <div class="table-module">
        <el-table
            :data="tableData"
            v-resize="{height: 41}"
            v-loading="loading"
            element-loading-text="玩命加载中"
            border
            highlightCurrentRow
        >
            <div slot="empty" class="no-data-reminder">
                <i></i>暂无数据
            </div>
            <el-table-column
                prop="name"
                label="平台"
            ></el-table-column>
            <el-table-column
                prop="site"
                label="站点"
            ></el-table-column>
            <el-table-column
                prop="account_name"
                label="账号简称"
            ></el-table-column>
            <el-table-column
                prop="user_name"
                label="销售员"
            ></el-table-column>
            <el-table-column
                prop="department"
                label="部门"
            ></el-table-column>
            <el-table-column
                prop="list_num"
                label="listing目标数量"
            ></el-table-column>
            <el-table-column
                prop="create_time"
                label="激活日期"
            ></el-table-column>
            <el-table-column
                prop="estimate_num"
                label="预估数量"
            ></el-table-column>
            <el-table-column
                label="实际数量"
            >
                <template slot-scope="scope">
                    <span :class="{'red': scope.row.status == 0 ? true : false}">{{scope.row.real_quantity}}</span>
                </template>
            </el-table-column>
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
            total:{},
            loading: {}
        }
    }
</script>
<style scoped lang="stylus">

</style>
