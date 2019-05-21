<template>
    <div>
        <el-table
            :data="tableData.list"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            highlight-current-row
            class="scroll-bar"
            v-resize="{height: 41}"
            @select="selectCheck($event)"
        >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column prop="id" label="NO"></el-table-column>
            <el-table-column prop="carrierCompany" label="物流商"></el-table-column>
            <el-table-column prop="shortname" label="邮寄方式"></el-table-column>
            <el-table-column prop="collector_name" label="揽收商"></el-table-column>
            <el-table-column prop="parcelsNum" label="发货包裹数量"></el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :total="total"
            :current-page="tableData.page"
            :page-size="tableData.pageSize"
            :page-sizes="[20,50,100,200,500]"
            class="page-fixed"
            layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                emptyText: '暂无数据'
            }
        },
        props: {
            tableData: {
                require: true,
                type: Object
            },
            loading: {
                type: Boolean,
                require: true,
            },
            total: {}
        },
        methods: {
            handleSizeChange(val) {
                this.$emit('size-change', val)
            },
            handleCurrentChange(val) {
                this.$emit('current-change', val)
            },
            selectCheck(val) {
                this.$emit('select-check', val)
            }
        }
    }

</script>
