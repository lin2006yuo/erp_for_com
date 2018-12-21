<template>
    <page-dialog :title="`${warehouseName} ${goodsName} 库存日志`" v-model="show" :size="dialogSize"
                 :close-on-click-modal="false">
        <div class="card">
            <el-table v-resize="{height: 150}"
                      class="scroll-bar mb-sm"
                      highlight-current-row
                      :data="lists"
                      border>
                <el-table-column
                        align="center"
                        prop="warehouseName"
                        label="仓库">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="操作类型" inline-template>
                    <span>{{row.type}}</span>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="stock_quantity"
                        label="期初库存">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="quantity"
                        label="本次数量">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="成本" inline-template>
                    <span>{{row.price | decima}}</span>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="库存平均成本" inline-template>
                    <span>{{row.per_cost | decima}}</span>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="操作时间"
                        width="120px" inline-template>
                    <div>{{row.create_time | timeFilter}}</div>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="creator"
                        label="操作人员">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="stock_inout_code"
                        label="来源单号">
                </el-table-column>
            </el-table>
            <el-pagination class="t-right"
                           @size-change="change_size"
                           @current-change="change_page"
                           :current-page="page"
                           :page-size="pageSize"
                           layout="total, prev, pager, next, jumper"
                           :total="count">
            </el-pagination>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="show = false">关闭</el-button>
        </span>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import pageDialog from '../../../../components/page-dialog.vue';
    import {api_get_details} from '../../../../api/entrepot-overseas';

    export default {
        data() {
            return {
                dialogSize: "full",
                lists: [],
                page: 1,
                count: 0,
                pageSize: 20,
                show: this.value
            }
        },
        mounted() {
        },
        filters: {
            type(val) {
                switch (val) {
                    case 11:
                        return "采购入库";
                    case 12:
                        return "调拨入库";
                    case 21:
                        return "订单出库";
                    case 22:
                        return "调拨出库";
                }
            },
            timeFilter(val) {
                return datef('YYYY-MM-dd HH:mm:ss', val);
            }
        },
        methods: {
            request_detail() {
                let params = {
                    page: this.page,
                    pageSize: this.pageSize,
                    warehouse_id: this.row.warehouse_id,
                };
                this.$http(api_get_details, this.row.id, params).then(res => {
                    this.lists = res.data;
                    this.count = res.count;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            change_size(size) {
                this.pageSize = size;
                this.request_detail(this.lookId);
            },
            change_page(page) {
                this.page = page;
                this.request_detail(this.lookId);
            }
        },
        computed: {
            warehouseName() {
                return this.row.warehouse_name || '';
            },
            goodsName() {
                return this.row.sku || "";
            }
        },
        watch: {
            show(val) {
                this.$emit("input", val)
            },
            value(val) {
                this.show = val;
                if (val) {
                    this.request_detail();
                }
            }
        },
        props: {
            value: {},
            row: {}

        },
        components: {
            pageDialog,
        }
    }
</script>
