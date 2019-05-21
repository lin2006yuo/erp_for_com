<template>
    <div>
        <card-search :form="searchData" @search="search" :clears="clears"></card-search>
        <permission
            tag="trendsSelect"
            class="inline ml-sm mr-xs mt-sm"
            type="primary"
            :route="apis.url_paypal_orders_exports"
            :selects="partAllOptions"
            @trigger="export_wish"
        ></permission>
        <table-list
            class="mt-sm"
            :table="table"
            :loading="loading"
            :firstTime="firstTime"
            @select-change="select_change"
            @sizeChange="handleSizeChange"
            @pageChange="handleCurrentChange"
        ></table-list>
        <export-dialog v-model="export_visible"></export-dialog>
    </div>
</template>

<script>
    import {api_paypal_cash, url_paypal_orders_exports, api_paypal_export} from "../../../../api/ebay-cash";

    export default {
        data() {
            return {
                export_visible: false,
                searchData: {
                    account_name: "",
                    start_time: this.initTime(1),
                    end_time: this.initTime(2),
                    timetype: 1,  // 交易时间。
                },
                clears: {
                    account_name: "",
                    start_time: this.initTime(1),
                    end_time: this.initTime(2),
                    timetype: 1,  // 交易时间。
                },
                partAllOptions: [
                    {name: "部分导出", value: 0},
                    {name: "全部导出", value: 1}
                ],
                table: {
                    list: [],
                    page: 1,
                    pageSize: 20,
                    count: 0,
                    sum_total:{},
                },
                loading: false,
                firstTime: true
            };
        },
        permission: {
            url_paypal_orders_exports
        },
        methods: {
            initTime(index) {
                var nowdays = new Date();
                var year = nowdays.getFullYear();
                var month = nowdays.getMonth();
                if (month == 0) {
                    month = 12;
                    year = year - 1;
                }
                if (month < 10) {
                    month = '0' + month;
                }
                var end = new Date(year, month, 0);  // 上个月最后一天。
                var start = new Date(year, month - 1, 1); // 上个月的第一天。
                if (index === 1) {
                    return start;
                } else if (index === 2) {
                    return end
                }
            },
            init() {
                let data = this.init_params();
                this.loading = true;
                let header = {
                    contentType:'application/x-www-form-urlencoded',
                    timeout: 180000
                };
                this.$http(api_paypal_cash, data,header).then(res => {
                    this.table = {...res, page: res.page - 0, pageSize: res.pageSize - 0};
                    if (res.list.length > 0) {
                        this.firstTime = true
                    } else {
                        this.firstTime = false;
                    }
                }).catch(err => {
                    this.$message({
                        message: err.message || err
                    });
                    this.firstTime = false
                }).finally(() => {
                    this.loading = false;
                });
            },
            init_params() {
                let data = clone(this.searchData);
                data.start_time = datef('YYYY-MM-dd', data.start_time / 1000);
                data.end_time = datef('YYYY-MM-dd', data.end_time / 1000);
                data.page = this.table.page,
                    data.pageSize = this.table.pageSize;
                return data;
            },
            search() {
                this.init();
            },

            export_wish(val) {
                let params = '';
                if (val.value === 0 && !!this.ids.length) {
                    let account_ids = this.ids.map(k => k.account_id).join(",");
                    // 部分导出。
                    let data = this.init_params();
                    data.account_ids = account_ids;
                    delete data.account_name;
                    data.export_all = 0;
                    params = data;
                } else if (val.value === 1) {
                    // 全部导出。
                    let data = this.init_params();
                    data.export_all = 1;
                    params = data;
                } else {
                    this.$message({type: "warning", message: "请选择需要导出的数据"});
                }
                this.$http(api_paypal_export, params).then(res => {
                    this.export_visible = true;
                });
            },
            select_change(val) {
                this.ids = val;
            },
            handleSizeChange(val) {
                this.table.pageSize = val;
                this.init();
            },
            handleCurrentChange(val) {
                this.table.page = val;
                this.init();
            }
        },

        mounted() {
            this.init();
        },
        components: {
            cardSearch: require("./paypal-card-search").default,
            tableList: require("./paypal-table-list").default,
            exportDialog: require("../../../report/export-dialog").default,
            trendsSelect: require("@/components/trends-select.vue").default,
            exportField: require("@/components/export-field").default
        }
    };
</script>
