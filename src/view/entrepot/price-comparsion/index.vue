<template>
    <page class='p-maintain-information'>
        <search-card class="mb-xs" @search="search" :params="searchData" :clears="clears">
            <label-item label="运输方式：" class="ml-sm">
                <el-cascader
                        clearable
                        filterable
                        change-on-select
                        class="inline s-width-large"
                        v-model="searchData.shipping_id"
                        expand-trigger="hover"
                        :options="shippingList"
                ></el-cascader>
            </label-item>
            <label-item label="修改时间：" class="ml-sm">
                <timespan :starttime.sync="searchData.data_from" :endtime.sync="searchData.date_to"/>
            </label-item>
        </search-card>
        <!-- 表格 -->
        <table-module 
            class="mt-sm"
            :search-data="searchData" 
            :table-data="tableData" 
            :total="total" 
            :loading="loading" ref="table"
            @size-change="handle_size_change" 
            @current-change="handle_current_change" 
            @selection-change="handle_select"
            @download="download"
            >
        </table-module>

    </page>
</template>
<script>


    import {api_get_shipping_price} from '@/api/shipping-price'
    import {api_get_shipping } from '@/api/common.js';
    import timespan from '@/components/timespan'
    export default {
        permission: {
            url_confirm_export: '12312'
        },
        data() {
            return {
                searchData: {
                    shipping_id: [],
                    data_from: new Date(),
                    date_to: new Date(),
                    page: 1,
                    pageSize: 20
                },
                clears: {
                    shipping_id: [],
                    data_from: new Date(),
                    date_to: new Date(),
                    page: 1,
                    pageSize: 20
                },
                tableData: [
                    {
                        id: 1,order_id: 123, order_number: 123, warehouse_id: 12312,
                        shipping_id: 3243,
                        estimated_weight: '1qe',
                        estimated_fee: 'wqeq',
                        package_weight: 'qwe',
                        shipping_fee: 'qwe',
                        providers_weight: 'asdsa',
                    },
                    {
                        id: 2,order_id: 123, order_number: 123, warehouse_id: 12312,
                        shipping_id: 3243,
                        estimated_weight: '1qe',
                        estimated_fee: 'wqeq',
                        package_weight: 'qwe',
                        shipping_fee: 'qwe',
                        providers_weight: 'asdsa',
                    },
                    {
                        id: 3,order_id: 123, order_number: 123, warehouse_id: 12312,
                        shipping_id: 3243,
                        estimated_weight: '1qe',
                        estimated_fee: 'wqeq',
                        package_weight: 'qwe',
                        shipping_fee: 'qwe',
                        providers_weight: 'asdsa',
                    },
                ],
                partAllOptions: [
                    { label: "全部导出", value: 1 },
                    { label: "部分导出", value: 0 }
                ],
                shippingList: [],
                total: 0,
                selectOptions: [],
                loading: false,
                exportType: 1,
            }
        },
        mounted() {
            this.get_shipping()
        },
        methods: {
            search() {
                this.searchData.page = 1
                this.init()
            },
            init() {
                let params = this.get_params()  
                this.loading = true
                this.$http(api_get_shipping_price, params).then(res => {
                    this.loading = false
                    this.tableData = res.data
                    this.total = res.count
                })
            },
            download(index, row) { 
            },
            handle_size_change(val) {
                this.searchData.pageSize = val
                this.init()
            },
            handle_current_change(val) {
                this.searchData.page = val
                this.init()
            },
            handle_select(val) {
                this.selectOptions = val
            },
            get_shipping(warehouse_id) {
                this.$http(api_get_shipping, {warehouse_id: ''}).then(res => {
                    this.shippingList = [];
                    if (res.length <= 0) return;
                    this.generate_shipping_list(res);
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            generate_shipping_list(res) {
                let shippingList = {}, i = 0;
                res.forEach(row => {
                    if (shippingList.hasOwnProperty(row.carrier_id)) {
                        this.shippingList[shippingList[row.carrier_id]].children.push({
                            value: row.shipping_method_id,
                            label: row.shortname,
                        })
                    } else {
                        shippingList[row.carrier_id] = i++;
                        let shipping = {
                            label: row.carrier_name,
                            value: row.carrier_id,
                        };
                        this.$set(shipping, 'children', [
                            {
                                value: row.shipping_method_id,
                                label: row.shortname,
                            }
                        ]);
                        this.shippingList.push(shipping);
                    }
                });
            },
            get_params() {
                let params = clone(this.searchData)
                Object.keys(params).forEach(key => {
                    if (typeof params[key] === 'string') {
                        params[key] = params[key].trim();
                    }
                });
                if (params.data_from) params.data_from = datef('YYYY-MM-dd', this.searchData.data_from.getTime() / 1000);
                else params.data_from = ''
                if (params.date_to)  params.date_to = datef('YYYY-MM-dd', this.searchData.date_to.getTime() / 1000)
                else params.date_to = ''
                if (!params.shipping_id.length) params.shipping_id = ''
                return params
            }
        },
        computed: {},
        components: {
            labelItem: require('@/components/label-item').default,
            // selectRemote: require('@/components/select-remote.vue').default,
            // labelButtons: require('@/components/label-all-buttons.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            // orderInput: require('@/components/order-input').default,
            selectDropdown: require('@/components/select-dropdown').default,
            tableModule: require('./table-module.vue').default,
            // excelImport: require('./excel-import.vue').default,
            // exportField: require("@/components/export-field").default,
            exportTip: require('@/components/export-queue-tip').default,
            timespan
        }
    }
</script>
<style lang='stylus' scoped>
    .p-maintain-information {
        .el-card {
            overflow: visible;
        }
    }
</style>