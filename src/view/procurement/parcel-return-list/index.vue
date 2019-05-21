<template>
    <page class="p-picking-sku">
        <search-module
            @search="search"
            @select-audit="select_audit"
            :warehouse-list="warehouseList"
            :clears="clears"
            :search-data="searchData"></search-module>
        <table-module
            :table-data="tableData"
            class="mt-sm"
            :search-data="searchData"
            :loading="loading"
            :first-loading="firstLoading"
            @search="search">
        </table-module>
        <el-pagination
            class="t-right"
            @size-change="handle_size_change"
            @current-change="handle_current_change"
            :current-page="tableData.page"
            :page-sizes="[20, 50, 100, 200]"
            :page-size="tableData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.count">
        </el-pagination>
    </page>
</template>
<style lang="stylus">
    .p-picking-sku {
        .el-card {
            overflow: visible;
            .width-super.el-input {
                width: 200px
            }
        }
    }
</style>
<script>
    import {api_warehouses} from '@/api/global';
    import {api_get_purchase_order_return_of_goods_purchase} from "@/api/package-return-list";

    export default {
        permisson: {},
        page: {
            devinfo: {
                frontEnd: '张志勇',
                backEnd: '黄伟杰',
                createTime: '2018-11-20',
                updateTime: '2018-11-22'
            }
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                firstLoading: true,
                loading: false,
                table: [],
                tableData: {
                    page: 1,
                    pageSize: 20,
                    lists: [],
                    count: 0,
                },
                searchData: {
                    warehouse_id: '',
                    source: '',
                    abnormal_type: '',
                    audit_status: '',
                    person_type: 3,
                    time_type: 0,
                    date_b: '',
                    date_e: '',
                    bill_type: 0,
                    bill_number: '',
                    person_id: '',
                    person_name: '',
                },
                clears: {
                    warehouse_id: '',
                    source: '',
                    abnormal_type: '',
                    audit_status: '',
                    person_type: 3,
                    time_type: 0,
                    date_b: '',
                    date_e: '',
                    bill_type: 0,
                    bill_number: '',
                    person_id: '',
                    person_name: '',
                },
                warehouseList: []
            }
        },
        mounted() {
            this.init_warehouse();
            this.init();
        },
        methods: {
            //分页器
            handle_size_change(val) {
                this.tableData.pageSize = val;
                this.init();
            },
            handle_current_change(val) {
                this.tableData.page = val;
                this.init();
            },
            init_warehouse() {
                this.$http(api_warehouses).then(res => {
                    this.warehouseList = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code,
                    })
                })
            },
            search() {
                this.init();
            },
            select_audit(val) {
                this.$set(this.searchData, 'audit_status', val);
                this.init();
            },
            init() {
                this.loading = true;
                let data = this.init_params();
                this.$set(data, 'page', this.tableData.page);
                this.$set(data, 'pageSize', this.tableData.pageSize);
                this.$http(api_get_purchase_order_return_of_goods_purchase, data).then(res => {
                    this.tableData.lists = res.data;
                    this.tableData.count = res.count;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    this.loading = false;
                })
            },
            init_params() {
                let searchData = clone(this.searchData);
                this.$set(searchData, 'page', this.tableData.page);
                this.$set(searchData, 'pageSize', this.tableData.pageSize);
                if (this.searchData.date_b) {
                    searchData.date_b = datef('YYYY-MM-dd', this.searchData.date_b.getTime() / 1000);
                } else {
                    searchData.date_b = '';
                }
                if (this.searchData.date_e) {
                    searchData.date_e = datef('YYYY-MM-dd', this.searchData.date_e.getTime() / 1000);
                } else {
                    searchData.date_e = '';
                }
                if (searchData.bill_number !== '') {
                    searchData.bill_number = searchData.bill_number.split('\n').filter(row => !!row).map(row => row.trim());
                }
                delete searchData.person_name;
                return searchData;
            },
        },
        components: {
            searchModule: require('./search-module').default,
            tableModule: require('./table-module.vue').default,
            purchaser: require('@/api-components/purchaser.vue').default,
        }
    }
</script>
