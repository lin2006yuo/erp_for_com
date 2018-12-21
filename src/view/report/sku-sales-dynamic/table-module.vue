<template>
    <page class="c-sku-sales-table">
        <el-row class="mb-xs">
            <permission tag="trendsSelect"
                        class="inline ml-sm mr-xs"
                        type="primary"
                        :route="apis.url_sku_sales_dynamic_export"
                        :selects="partAllOptions"
                        @trigger="export_action"></permission>
        </el-row>
        <el-table :data="tableData"
                  class="mt-xs scroll-bar"
                  border
                  v-resize="{height: 41}"
                  @selection-change="select"
                  element-loading-text="玩命加载中"
                  highlight-current-row
                  v-loading="loading">
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column label="SKU/SKU别名" inline-template>
                <div>
                    <div>{{row.sku}}</div>
                    <div v-for="item in row.sku_alias">{{item || `--`}}</div>
                </div>
            </el-table-column>
            <el-table-column label="产品名称" inline-template>
                <div>{{row.spu_name}}</div>
            </el-table-column>
            <el-table-column label="采购员" inline-template>
                <div>{{row.purchaser_name}}</div>
            </el-table-column>
            <el-table-column label="开发员" inline-template>
                <div>{{row.developer_name}}</div>
            </el-table-column>
            <el-table-column label="商品分类" inline-template>
                <div>{{row.category_name}}</div>
            </el-table-column>
            <el-table-column label="供应商" inline-template>
                <div>{{row.supplier_name}}</div>
            </el-table-column>
            <el-table-column label="成本价" inline-template>
                <div>{{row.cost_price}}</div>
            </el-table-column>
            <el-table-column label="最近7日销量" inline-template>
                <div>{{row.d7}}</div>
            </el-table-column>
            <el-table-column label="上一7日销量" inline-template>
                <div>{{row.d7A}}</div>
            </el-table-column>
            <el-table-column label="增长率" inline-template>
                <div>{{`${row.growth_rate}%`}}</div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="t-right mt-sm"
                @size-change="$listeners['handle-size-change']"
                @current-change="$listeners['handle-current-change']"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </page>
</template>

<style lang="stylus">

</style>

<script>
    import {url_sku_sales_dynamic_export} from "@/api/report-channel";

    export default {
        permission: {
            url_sku_sales_dynamic_export
        },
        data() {
            return {
                selectData: [],
                partAllOptions: [
                    {
                        name: "全部导出", value: 1, action: function () {
                            this.export_type = 1; // 全部导出
                            this.export();
                        }
                    },
                    {
                        name: "部分导出", value: 0, action: function () {
                            if (this.selectData.length <= 0) return this.$message({type: "warning", message: "请先选择需要导出的数据"});
                            this.export_type = 0;
                            this.export();
                        }
                    },
                ],
            }
        },
        methods: {
            select(selection) {
                this.selectData = clone(selection);
            },
            export_action(val) {
                val.action.call(this);
            },
            export() {
                let params = {
                    export_type: this.export_type,
                };
                !this.export_type && (params.sku_ids = this.selectData.map(row => row.sku_id));
                this.$emit('export', params);
            }
        },
        watch: {
            tableData(val) {
                this.selectData = [];
            }
        },
        props: {
            tableData: {},
            loading: {},
            total: {},
            searchData: {},
        },
        components: {
            trendsSelect: require('@/components/trends-select').default,
        }
    }
</script>
