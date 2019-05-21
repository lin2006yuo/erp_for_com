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
            :row-key="row_key"
            highlightCurrentRow
            border
        >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column label="包裹号" min-width="90" inline-template>
                <ui-tip :content="row.number" :width="90"></ui-tip>
            </el-table-column>
            <el-table-column label="订单号" min-width="100" align="left" header-align="center" inline-template>
                <ui-tip :content="row.order_number" :width="96"></ui-tip>
            </el-table-column>
            <el-table-column label="发货仓库" min-width="65" inline-template>
                <ui-tip :content="row.warehouse_id" :width="90"></ui-tip>
            </el-table-column>
            <el-table-column label="邮寄方式"  min-width="100" align="left" header-align="center" inline-template>
                <ui-tip :content="row.shipping_id" :width="96"></ui-tip>
            </el-table-column>
            <!--<el-table-column label="估算重量" inline-template>
                <span>{{row.estimated_weight | format_weight}}</span>
            </el-table-column>
            <el-table-column label="估算运费" inline-template>
                <span>{{row.estimated_fee | format_price}}</span>
            </el-table-column>-->
            <el-table-column label="称重重量" min-width="65" inline-template>
                <span>{{row.package_weight | format_weight}}</span>
            </el-table-column>
            <el-table-column label="计抛重量" min-width="65" inline-template>
                <span>{{row.bubble_weight | format_weight}}</span>
            </el-table-column>
            <el-table-column label="称重后运费" min-width="65" inline-template>
                <span>{{row.shipping_fee | format_price}}</span>
            </el-table-column>
            <!--<el-table-column label="包裹尺寸" prop="package_size" :width="160"></el-table-column>-->
            <el-table-column min-width="80" label="物流商实际称重(g)"  inline-template>
                <span>{{row.providers_actual_weight}}</span>
            </el-table-column>
            <el-table-column min-width="80" label="物流商计费重量(g)"  inline-template>
                <span>{{row.providers_weight}}</span>
            </el-table-column>
            <el-table-column label="物流商运费" min-width="65" inline-template>
                <span>{{row.providers_fee | format_price}}</span>
            </el-table-column>
            <el-table-column label="物流商单号" inline-template align="left" header-align="center" min-width="80">
                <ui-tip :content="row.process_code" :width="96"></ui-tip>
            </el-table-column>
            <el-table-column label="物流跟踪号" inline-template align="left" header-align="center" min-width="80">
                <ui-tip :content="row.shipping_number" :width="80"></ui-tip>
            </el-table-column>
            <el-table-column label="发货时间" inline-template min-width="85">
                <span>{{row.shipping_time | format_time}}</span>
            </el-table-column>
            <el-table-column label="修改时间"  inline-template min-width="85">
                <span>{{row.update_time | format_time}}</span>
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
                rowKey(row) {
                    return row.number
                }
            }
        },
        filters: {
            format_price(cellValue) {
                return '￥' + Number(cellValue).toFixed(2)
            },
            format_weight( cellValue) {
                return Number(cellValue).toFixed(0) + 'g'
            },
            format_time(cellValue) {
                return datef("YYYY-MM-dd", cellValue);
            },
        },
        methods: {
            row_key(row) {
                return row.number;
            },
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
            uiTip: require('@/components/ui-tip.vue').default,
        }
    }
</script>
<style>
    .warehouse-data .bold{
        font-weight: bold;
    }
</style>
