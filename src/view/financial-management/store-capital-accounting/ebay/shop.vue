<template>
    <div>
        <card-search :form="searchData" @search="search" :clears="clears"></card-search>
        <permission
            tag="trendsSelect"
            class="inline ml-sm mr-xs mt-sm"
            type="primary"
            :route="apis.url_ebay_orders_exports"
            :selects="partAllOptions"
            @trigger="export_wish"
        ></permission>
        <table-list
            class="mt-sm"
            :dataTable="table"
            :is-loading="loading"
            :first-loading="firstTime"
            :search-data="searchData"
            @sizeChange="handleSizeChange"
            @pageChange="handleCurrentChange"
        ></table-list>
        <export-dialog v-model="export_visible"></export-dialog>
    </div>
</template>

<script>
    import {api_ebay_cash, url_ebay_orders_exports, api_ebay_export} from "../../../../api/ebay-cash"
    import {downloadFile} from '@/lib/http';

    export default {
        permission: {
            url_ebay_orders_exports
        },
        data() {
            return {
                searchData: {
                    site: "",
                    account_ids: "",
                    seller_id: "",
                    start_time: this.initTime(1),
                    end_time: this.initTime(2),
                    time_type: 1,  // 交易时间。
                },
                clears: {
                    site: "",
                    account_ids: "",
                    seller_id: "",
                    start_time: this.initTime(1),
                    end_time: this.initTime(2),
                    time_type: 1,
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
                    sum_total:{}
                },
                export_visible: false,
                loading: false,
                firstTime: true,
                ids: [],
            };
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
                this.$http(api_ebay_cash, data,header).then(res => {
                    this.table = {...res, page: res.page - 0, pageSize: res.pageSize - 0};
                    this.table.list.forEach((item, i) => {
                        this.$set(this.table.list[i], "show", false);
                        this.$set(this.table.list[i], "isCheck", false);
                        this.$set(this.table.list[i], 'payDetail', []);
                    });
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
                    this.firstTime = false
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
                // 先确定一下要导出的数据。
                this.ids = this.select_change();
                if (val.value === 0 && !!this.ids.length) {
                    let account_ids = this.ids.map(k => k.account_id).join(",");
                    // 部分导出。
                    let data = this.init_params();
                    data.account_ids = account_ids;
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
                this.$http(api_ebay_export, params).then(res => {
                    this.export_visible = true;
                });
            },
            select_change(val) {
                return this.table.list.filter(item => !!item.isCheck)
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
            // 初始化时间。
            this.initTime();
        },
        components: {
            cardSearch: require("./shop-card-search").default,
            tableList: require("./shop-table-list").default,
            exportDialog: require("../../../report/export-dialog").default,
            trendsSelect: require("@/components/trends-select.vue").default,
        }
    };
</script>
