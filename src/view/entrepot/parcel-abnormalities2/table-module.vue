<template>
    <div>
        <el-table
            :data="tableData"
            v-resize="{height:41}"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            class="scroll-bar"
            ref="tableModule"
            @selection-change="handle_selection_change"
            @row-click="handle_row_click"
            highlightCurrentRow>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column v-if="selection" type="selection"></el-table-column>
            <el-table-column
                v-for="(item, index) in tableColumns"
                :key="`${item.value}-${index}-${item.label}`"
                inline-template
                :label="item.label">
                <ui-tip :content="row[item.value]" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                        class="mb-xs mt-xs"
                        size="mini"
                        type="primary"
                        @click="handleEdit(scope.$index, scope.row)">标记为已处理</el-button>
                    <el-button
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
<script>
    export default {
        data() {
            return {
                emptyText: '暂无数据'
            }
        },
        methods: {
            handle_size_change(val) {
                this.$emit('size-change', val)
            },
            handle_current_change(val) {
                this.$emit('current-change',val)
            },
            handle_selection_change(val) {
                this.$emit('selection-change', val)
            },
            handle_row_click(row) {
                this.$refs.tableModule.toggleRowSelection(row)
            },
        },
        props: {
            searchData: {
                type: Object,
                require: true
            },
            tableColumns: {
                type: Array,
                require: true
            },
            tableData: {
                type:Array,
                require: true
            },
            loading: {
                default: false
            },
            total: {
                default: 0
            },
            selection: {
                type: Boolean,
                default: false
            }
        }
    }
</script>
