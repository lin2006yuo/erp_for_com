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
            @row-dblclick="handle_row_click"
            highlightCurrentRow>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="日期" prop="create_time"></el-table-column>
            <el-table-column label="出入库类型" prop="type"></el-table-column>
            <el-table-column label="仓库" prop="warehouse_name"></el-table-column>
            <el-table-column label="sku" prop="sku"></el-table-column>
            <el-table-column label="产品名称" prop="spu_name"></el-table-column>
            <el-table-column label="数量" prop="quantity"></el-table-column>
            <el-table-column label="单价" inline-template>
                <span>{{row.price | format_price}}</span>
            </el-table-column>
            <el-table-column label="金额" inline-template>
                <span>{{row.amount | format_price}}</span>
            </el-table-column>
            <el-table-column label="制单人" prop="creator"></el-table-column>
            <el-table-column label="单据号" prop="stock_inout_code"></el-table-column>
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
        name: 'inventoryTable',
        data() {
            return {
                emptyText: '暂无数据'
            }
        },
        filters: {
            format_price(price) {
                return Number(price).toFixed(2)
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
