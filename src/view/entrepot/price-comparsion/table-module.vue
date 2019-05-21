<template>
    <div class="warehouse-data">
        <el-table
            :data="tableData"
            v-resize="{height:41}"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            class="scroll-bar"
            ref="tableModule"
            @selection-change="handle_selection_change"
            @row-click="handle_row_click"
            highlightCurrentRow
            border
        >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column label="运输方式" prop="shipping_name"></el-table-column>
            <el-table-column label="生成时间" prop="create_time"></el-table-column>
            <el-table-column label="生成人" prop="creator" ></el-table-column>
            <el-table-column label="操作" :width="180">
                <template slot-scope="scope">
                    <a 
                        :href="`${host}${scope.row.file_path}`"
                        class="report-download"
                        download 
                        @click="is_download(scope.row, $event)"
                    >下载报表</a>
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
                emptyText: '暂无数据',
                host: ''
            }
        },
        mounted() {
            this.host = config.apiHost;
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
            format_time(row, column, cellValue) {
                return datef("YYYY-MM-dd", cellValue);
            },
            format_order(row, column, cellValue) {
                return cellValue && cellValue[0].order_number
            },
            format_price(row, column, cellValue) {
                return '￥' + Number(cellValue).toFixed(2)
            },
            format_weight(row, column, cellValue) {
                return Number(cellValue).toFixed(0) + 'g'
            },
            deleteRow(index,row) {
                this.$emit('download', index, row)
            },
            is_download() {}
        },
        props: {
            searchData: {
                type: Object,
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
            }
        }
    }
</script>
<style lang="stylus">
    .warehouse-data{
        a.report-download {
            color: #69f;
            cursor: pointer;
        }
        .exportColor{
            color: #C0CCDA;
        }
    }
</style>
