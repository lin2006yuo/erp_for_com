<template>
    <page-dialog :title="title" v-model="show" :size="dialogSize" :close-on-click-modal="true">
        <div class="card">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="库存操作明细" name="first" class="table-card">
                    <search-card @search="search" :params="paramsData" :clears="clears">
                        <handle-detail-search v-model="paramsData"></handle-detail-search>
                    </search-card>
                    <el-table highlight-current-row
                              :data="lists"
                              border>
                        <el-table-column
                                align="center"
                                prop="warehouse_cargo_code"
                                label="货位号">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="sku"
                                label="SKU">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="change_type"
                                label="操作内容">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="before_quantity"
                                label="改变前库存">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="operation_quantity"
                                label="操作库存">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="result_quantity"
                                label="结果库存">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="change_text"
                                label="操作类型">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="source_number"
                                :label="`${odd_numbers}`">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                width="400"
                                prop="remark"
                                label="备注">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="操作时间"
                                inline-template>
                            <div>
                                <span v-if="row.create_time">{{row.create_time}}</span>
                                <span v-else>-- --</span>
                            </div>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="creator"
                                label="操作人">
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            class="page-footer t-right mt-sm"
                            @size-change="change_size"
                            @current-change="change_page"
                            :current-page="page"
                            :page-size="pageSize"
                            layout="total, prev, pager, next, jumper"
                            :total="count"
                            v-if="count>0">
                    </el-pagination>
                </el-tab-pane>
                <el-tab-pane label="货位绑定记录" name="second">
                    <el-table
                            highlight-current-row
                            :data="logLists"
                            border>
                        <el-table-column
                                align="center"
                                prop="warehouse_cargo_code"
                                label="货位号">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="sku"
                                label="SKU">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="handle_name"
                                label="操作">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="操作时间"
                                inline-template>
                            <div>
                                <span v-if="row.create_time">{{row.create_time}}</span>
                                <span v-else>-- --</span>
                            </div>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="creator"
                                label="操作人">
                        </el-table-column>
                    </el-table>
                    <el-pagination class="t-right mt-sm"
                                   @size-change="change_log_size"
                                   @current-change="change_log_page"
                                   :current-page="log_page"
                                   :page-size="log_pageSize"
                                   layout="total, prev, pager, next, jumper"
                                   :total="log_count"
                                   v-if="count>0">
                    </el-pagination>
                </el-tab-pane>
                <el-tab-pane label="货位记录" name="third">
                    <el-table
                            highlight-current-row
                            :data="logDataLists"
                            border>
                        <el-table-column
                                align="center"
                                prop="warehouse_cargo_code"
                                label="货位号">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="sku"
                                label="SKU">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="handle_name"
                                label="操作">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="操作时间"
                                inline-template>
                            <div>
                                <span v-if="row.create_time">{{row.create_time}}</span>
                                <span v-else>-- --</span>
                            </div>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="creator"
                                label="操作人">
                        </el-table-column>
                    </el-table>
                    <el-pagination class="t-right mt-sm"
                                   @size-change="change_data_log_size"
                                   @current-change="change_data_log_page"
                                   :current-page="log_data_page"
                                   :page-size="log_data_pageSize"
                                   layout="total, prev, pager, next, jumper"
                                   :total="log_data_count"
                                   v-if="count>0">
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>

        </div>
        <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="show = false">关闭</el-button>
            </span>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import pageDialog from '../../../components/page-dialog.vue';
    import {warehouse_cargo_detail, api_warehouse_cargo_goods_logs} from '../../../api/warehouse-cargo-goods';

    export default {
        data() {
            return {
                odd_numbers:'来源单号',
                dialogSize: "full",
                lists: [],
                logLists: [],
                logDataLists: [],
                page: 1,
                count: 0,
                pageSize: 20,
                log_page: 1,
                log_count: 0,
                log_pageSize: 20,
                log_data_page: 1,
                log_data_count: 0,
                log_data_pageSize: 20,
                show: this.value,
                activeName: 'first',
                clears: {
                    page: 1,
                    pageSize: 10,
                    content_type: '0',//内容类型
                },
                paramsData: {
                    page: 1,
                    pageSize: 10,
                    operation_type: '',//操作类型
                    content_type: '0',//内容类型
                    user_id: '',//操作人
                    source_number: '',//来源单号
                    date_b: '',
                    date_e: '',
                    account_creator_name: '',
                }
            }
        },
        mounted() {
        },
        methods: {
            search() {//搜索
                const data = Object.assign(this.paramsData, {
                    warehouse_cargo_id: this.row.warehouse_cargo_id,
                    sku_id: this.row.sku_id
                });
                this.$http(api_warehouse_cargo_goods_logs, data).then(res => {
                    this.lists = res.data;
                    this.count = res.count;
                })
            },
            handleClick() {

            },
            request_detail() {
                let params = {
                    page: this.page,
                    pageSize: this.pageSize,
                    warehouse_cargo_id: this.row.warehouse_cargo_id,
                    sku_id: this.row.sku_id,
                };
                this.$http(warehouse_cargo_detail, params).then(res => {
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
                this.request_detail();
            },
            change_page(page) {
                this.page = page;
                this.request_detail();
            },
            log_detail() {
                let params = {
                    page: this.page,
                    pageSize: this.pageSize,
                    warehouse_cargo_id: this.row.warehouse_cargo_id,
                    type: 3,
                    sku_id: this.row.sku_id,
                };
                this.$http(warehouse_cargo_detail, params).then(res => {
                    this.logLists = res.data;
                    this.log_count = res.count;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            change_log_size(size) {
                this.pageSize = size;
                this.log_detail();
            },
            change_log_page(page) {
                this.page = page;
                this.log_detail();
            },
            log_data_detail() {
                let params = {
                    page: this.page,
                    pageSize: this.pageSize,
                    warehouse_cargo_id: this.row.warehouse_cargo_id,
                    type: 1,
                };
                this.$http(warehouse_cargo_detail, params).then(res => {
                    this.logDataLists = res.data;
                    this.log_data_count = res.count;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            change_data_log_size(size) {
                this.log_data_pageSize = size;
                this.log_data_detail();
            },
            change_data_log_page(page) {
                this.log_data_page = page;
                this.log_data_detail();
            },

        },
        computed: {
            title() {
                return `【货位号：${this.row.code}】【SKU：${this.row.sku}】操作明细`
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
                    this.log_detail();
                    this.log_data_detail();
                    this.activeName = 'first';
                }
            },
            'paramsData.operation_type'(val){
                if(val === 6){
                    return this.odd_numbers = '采购单号';
                }else {
                    return this.odd_numbers = '来源单号';
                }
            }
        },
        props: {
            value: {},
            row: {}
        },
        components: {
            pageDialog,
            searchCard: require('@/components/search-card.vue').default,
            handleDetailSearch: require('./handle-detail-search.vue').default,
        }
    }
</script>
