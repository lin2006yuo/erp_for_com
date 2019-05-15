<template>
    <div class="warehouse-data">
        <el-table
            :data="tableData"
            v-resize="{height:41}"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            ref="tableModule"
            class="scroll-bar"
            @selection-change="handle_selection_change"
            @row-click="handle_row_click"
            highlightCurrentRow>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column v-if="selection" type="selection"></el-table-column>
            <el-table-column label="平台订单号" prop="create_time"></el-table-column>
            <el-table-column label="账号简称" prop="type"></el-table-column>
            <el-table-column label="站点" prop="warehouse_name"></el-table-column>
            <el-table-column label="销售员" prop="sku"></el-table-column>
            <el-table-column label="退款日期" prop="spu_name"></el-table-column>
            <el-table-column label="退款金额原币" prop="quantity"></el-table-column>
            <el-table-column label="币种" prop="price"></el-table-column>
            <el-table-column label="汇率" prop="amount"></el-table-column>
            <el-table-column label="退款金额￥" prop="creator"></el-table-column>
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
            }
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
            },
            selection: {
                default: false
            }
        }
    }
</script>
<style lang="stylus">
    .warehouse-data{
        .el-table__empty-text {
            /*left: 18% !important;*/
            position: fixed;
            top :50%;
            left :50%;
        }
        .scroll-bar > .el-table__body-wrapper {
            overflow-x auto
        }
        .bold{
            font-weight: bold;
        }
    }
</style>
