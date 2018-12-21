<template>
    <page class="p-index-member" ref="page">
        <search :searchData="searchData" @search="search" @clear="clear"></search>
        <el-row class="ml-sm mb-sm mt-sm">
            <permission class="ml-sm"
                        tag="request-button"
                        req-key="api_url_stock_lack_export"
                        :route="apis.url_stock_lack_export"
                        :mintime="200"
                        @click="batch_export">批量导出
            </permission>
        </el-row>
        <table-module
                :table-data="tableData"
                :search-data="searchData"
                :first-time="firstTime"
                @sort_change="sort_change"
                :loading="loading"></table-module>
        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <export-dialog v-model="export_visible"></export-dialog>
    </page>
</template>
<style lang="stylus">
    .p-index-member {
        .active {
            background-color: rgba(173, 227, 255, 0.5);
        }
    }
</style>
<script>
    import {api_get_stock_lack, url_stock_lack_export, api_stock_lack_export} from "@/api/stockout-list"

    export default {
        permission: {
            url_stock_lack_export
        },
        page: {
            devinfo: {
                frontEnd: '覃宏峰',
                backEnd: '李佰敏',
                createTime: '2018-6-15',
                updateTime: '2018-6-15'
            }
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                searchData: {
                    warehouse_id: '',
                    developer_id: '',
                    purchaser_id: '',
                    snType: "sku",
                    snText: "",
                    goodsStatus: 0,
                    page: 1,
                    pageSize: 50,
                },
                total: 0,
                loading: false,
                tableData: [],
                checkAll: false,
                export_visible: false,
                sort_field: '',
                sort_type: '',
                firstTime: true
            }
        },
        mounted() {
            // this.init();
        },
        methods: {
            init_params() {
                let data = window.clone(this.searchData);
                this.sort_field && (data.sort_field = this.sort_field);
                this.sort_type && (data.sort_type = this.sort_type);
                let cur = data.snText.trim().split('\n').filter(row => !!row);
                if (!!cur && cur.length > 1) {
                    data.snText = JSON.stringify(cur.map(row => {
                        return row.trim();
                    }));
                } else if (!!cur && cur.length === 1) {
                    data.snText = data.snText.trim();
                }
                return data
            },
            init() {
                let data = this.init_params();
                this.loading = true;
                this.$http(api_get_stock_lack, data).then(res => {
                    this.loading = false;
                    this.firstTime = false;
                    this.total = res.count;
                    this.tableData = res.data;
                }).catch(code => {
                    console.log(code)
                })
            },
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init()
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init()
            },
            search() {
                this.init()
            },
            clear() {
                this.searchData = {
                    warehouse_id: '',
                    developer_id: '',
                    purchaser_id: '',
                    snType: "sku",
                    snText: "",
                    goodsStatus: '',
                    page: 1,
                    pageSize: 50,
                    export_visible,
                };
                this.init()
            },
            batch_export() {
                let data = this.init_params();
                this.$http(api_stock_lack_export, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.export_visible = true;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('api_url_stock_lack_export', false);
                    }, 200);
                });
            },
            sort_change(column) {
                console.log('sort', column);
                if (column.column instanceof Object) {
                    let sort_label = column.column.label;
                    switch (sort_label) {
                        case "缺货数量":
                            this.sort_field = "lack_qty";
                            break;
                        case "最早缺货时间":
                            this.sort_field = "create_time";
                            break;
                    }
                    this.sort_type = column.order === "descending" ? "desc" : "asc";
                    this.init();
                }
            }
        },
        components: {
            search: require("./search.vue").default,
            requestButton: require('@/global-components/request-button').default,
            tableModule: require('./table-module').default,
            exportDialog: require('../../report/export-dialog').default,
        }
    }
</script>

