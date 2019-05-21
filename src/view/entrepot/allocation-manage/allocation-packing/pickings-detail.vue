<template>
    <page-dialog  class="p-picking-details" title="拣货单详情"
                  size="full" v-model="showDialog" :close-on-click-modal="false">
        <el-table :data="tableData"
                  v-loading="loading"
                  height="500"
                  class="scroll-bar mt-sm"
                  element-loading-text="玩命加载中"
                  highlightCurrentRow>
            <el-table-column
                    type="index"
                    width="35">
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="100"
                    label="货位">
                <div>
                    <ui-tip :content="row.warehouse_cargo" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="100"
                    label="SKU">
                <div>
                    <ui-tip :content="row.sku" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="80"
                    label="总数">
                <div>
                    <ui-tip :content="row.quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="80"
                    label="下架数">
                <div>
                    <ui-tip :content="row.picking_quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <!--<el-table-column
                    inline-template
                    width="80"
                    label="未包装数">
                <div>
                    <ui-tip :content="row.waiting_quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="作废数">
                <div>
                    <ui-tip :content="row.invalid_quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>-->
            <el-table-column
                    inline-template
                    min-width="100"
                    label="周转箱信息">
                <div v-for="item in row.turnover_box">
                    <div>{{item.turnover_num}}:{{item.quantity}}</div>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="990"
                    label="商品名称（规格）">
                <div>
                    <span>{{`${row.name}(${row.attributes})`}}</span>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="fr mt-sm"
                @size-change="$listeners['handle-size-change']"
                @current-change="$listeners['handle-current-change']"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </page-dialog>
</template>
<style lang="stylus">
</style>
<script>
    export default {
        data() {
            return {
                showDialog: this.value,
            }
        },
        watch: {
            value(val){
                this.showDialog = val;
            },
            showDialog(val){
                this.$emit('input',val);
            }
        },
        props: {
            value: {},
            searchData: {},
            tableData: {},
            total: {},
            loading: {}
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            uiTip: require('@/components/ui-tip.vue').default
        },
    }
</script>
