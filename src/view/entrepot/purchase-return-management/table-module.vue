<template>
    <div>
        <el-table
                class="mt-xs scroll-bar"
                v-resize="{height:41}"
                :data="tableData"
                border
                highlight-current-row
                v-loading="loading"
                element-loading-text="拼命加载中"
                @selection-change="$listeners['handle-selection-change']">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{ emptyText }}
            </div>
            <el-table-column
                    type="selection"
                    width="50">
            </el-table-column>

            <el-table-column label="退货单号" inline-template>
                <div>
                    <ui-tip :content="row.number" :width="98"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="采购单号" inline-template>
                <div>
                    <ui-tip :content="row.purchase_order_id" :width="98"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="品类数/商品数" inline-template>
                <div>
                    <span>{{row.sku_type_quantity}}/{{row.sku_quantity}}</span>
                </div>
            </el-table-column>

            <el-table-column label="生成时间" inline-template>
                <div>
                    <span>{{row.create_time | filterTime}}</span>
                </div>
            </el-table-column>

            <el-table-column label="状态" inline-template>
                <div>
                    <ui-tip :content="row.status_name" :width="98"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="处理人" inline-template>
                <div>
                    <ui-tip :content="row.operator_name" :width="98"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="处理时间" width="150" inline-template>
                <div>
                    <span>{{row.operator_time | filterTime}}</span>
                </div>
            </el-table-column>

            <el-table-column label="操作" inline-template>
                <div>
                    <el-button type="text" class="inline" @click.native="look(row)">查看</el-button>
                    <span v-if="!row.status">|</span>
                    <el-button type="text" class="inline" @click.native="stock_out(row)" v-if="!row.status">出库</el-button>
                    <span v-if="!row.status">|</span>
                    <el-button type="text" class="inline" @click.native="cancel(row)" v-if="!row.status">作废</el-button>
                    <span>|</span>
                    <el-button type="text" class="inline" @click.native="print_form(row)">打印拣货单</el-button>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="$listeners['handle-size-change']"
                @current-change="$listeners['handle-current-change']"
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
        filters: {
            filterTime(val){
                return datef("YYYY-MM-dd HH:mm:ss",val);
            }
        },
        methods:{
            look(data){
                this.$emit('get-details', data, 'look')
            },
            stock_out(data){
                this.$emit('get-details', data, 'stock_out')
            },
            cancel(data){
                this.$emit('cancel', data)
            },
            print_form(data){
                this.$emit('print-form', data, 'print_form')
            }
        },
        computed:{
            emptyText(){
                return this.firstLoading?'等待查询数据中...':'暂无数据'
            }
        },
        props: {
            tableData: {
                required: true,
                type: Array
            },
            loading: {
                required: true,
                type: Boolean
            },
            firstLoading: {
                required: true,
                type: Boolean
            },
            searchData: {
                required: true,
                type: Object
            },
            total: {
                required: true,
                type: Number
            },
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default
        }
    }
</script>