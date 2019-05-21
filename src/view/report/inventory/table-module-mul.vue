<template>
    <div class="warehouse-data">
        <el-table
            :data="tableData"
            v-resize="{height:41}"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            class="scroll-bar"
            ref="multipleTable"
            highlightCurrentRow
            @selection-change="handle_selection_change"
            @row-dblclick="handle_row_click"
        >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="sku" prop="sku" width="120"></el-table-column>
            <el-table-column label="产品名称"  width="320" prop="spu_name"></el-table-column>
            <el-table-column label="商品分类" prop="category" width="150"></el-table-column>
            <el-table-column label="仓库" prop="warehouse_name"></el-table-column>
            <el-table-column label="期初结存">
                <el-table-column label="数量" prop="init_qty"></el-table-column>
                <el-table-column label="单价" inline-template>
                    <span>{{row.inti_price | formate_price}}</span>
                </el-table-column>
                <el-table-column label="金额"  inline-template>
                    <span>{{row.init_amount | formate_price}}</span>
                </el-table-column>
            </el-table-column>
            <el-table-column label="本期入库">
                <el-table-column label="数量" prop="in_qty"></el-table-column>
                <el-table-column label="单价" inline-template>
                    <span>{{row.in_price | formate_price}}</span>
                </el-table-column>
                <el-table-column label="金额"  inline-template>
                    <span>{{row.in_amount | formate_price}}</span>
                </el-table-column>
            </el-table-column>
            <el-table-column label="本期出库">
                <el-table-column label="数量" prop="out_qty"></el-table-column>
                <el-table-column label="单价"  inline-template>
                    <span>{{row.out_price | formate_price}}</span>
                </el-table-column>
                <el-table-column label="金额"  inline-template>
                    <span>{{row.out_amount | formate_price}}</span>
                </el-table-column>
            </el-table-column>
            <el-table-column label="期末库存">
                <el-table-column label="数量" prop="end_qty"></el-table-column>
                <el-table-column label="单价" inline-template>
                    <span>{{row.end_price | formate_price}}</span>
                </el-table-column>
                <el-table-column label="金额"  inline-template>
                    <span>{{row.end_amount | formate_price}}</span>
                </el-table-column>
            </el-table-column>
            <el-table-column label="<30" prop="less_third"></el-table-column>
            <el-table-column label="30天<>60天" prop="third_sixty" width="90"></el-table-column>
            <el-table-column label="60天<>90天" prop="sixty_ninety" width="90"></el-table-column>
            <el-table-column label="90天以上" prop="more_ninety"></el-table-column>
            <el-table-column label="盘点数量" prop="check_qty"></el-table-column>
            <el-table-column label="最近采购单价"  width="90" inline-template>
                <span>{{row['latest purchase_price'] | formate_price}}</span>
            </el-table-column>
            <el-table-column label="最新采购报价"  width="90" inline-template>
                <span>{{row.latest_supply_prcie | formate_price}}</span>
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
        name: 'inventoryTableMul',
        data() {
            return {
                emptyText: '暂无数据'
            }
        },
        filters: {
            formate_price(price) {
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
                this.$refs.multipleTable.toggleRowSelection(row)
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
        },
        components: {
            uiTip:require('@/components/ui-tip.vue').default,
        }
    }
</script>
<style lang="stylus">
    .warehouse-data {
        .el-table__empty-text {
            /*left: 18% !important;*/
            position: fixed;
            top :50%;
            left :50%;
        }
        .scroll-bar > .el-table__body-wrapper {
            overflow-x auto
        }
        .bold {
            font-weight: bold;
        }
        .el-table__body-wrapper {
            overflow: auto;
        }
    }
</style>
