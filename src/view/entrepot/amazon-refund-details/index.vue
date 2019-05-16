<template>
        <page class='p-invendory'>
            <search-card class="mb-xs" @search="search" :params="searchData" :clears="clears">
                <el-row>
                    <label-buttons
                        class="inline btn-ml mr-sm"
                        label="" :buttons="buttons"
                        @select="btn_select"
                    ></label-buttons>
                </el-row>
                <label-item label="站点：" class="mr-xs">
                    <select-account
                        v-model="searchData.site_code"
                        type="site"
                        class="s-width-default width-xs"
                        :param="{channel_id: searchData.warehouse_id}"
                    ></select-account>
                </label-item>
                <label-item label="账号简称：" class="mr-xs">
                    <select-account
                        v-model="searchData.account_id"
                        type="account"
                        ref="selectAccount"
                        class="s-width-default width-xs"
                        :param="{channel_id: 2, site_code: searchData.site_code}"
                    ></select-account>
                </label-item>
                <label-item label="销售员：" class="mr-xs">
                    <select-account
                        class="width-sm"
                        type="seller"
                    ></select-account>
                </label-item>
                <label-item label="日期范围：">
                    <timespan 
                        :to.sync="searchData.date_to" 
                        :from.sync="searchData.date_from"></timespan>
                </label-item>
                <cascader-select 
                    v-model="searchData.category_id"
                    type="goods"
                />
            </search-card>
            <el-row class="mb-xs">
                <permission class="ml-sm delivery_comfirm_btn"
                            tag="ElButton"
                            type="primary"
                            size="mini"
                            @click="export_click"
                            :route="apis.url_export_summary"
                            >
               批量导出</permission>
            </el-row>
            <table-module
                :search-data="searchData"
                :table-data="tableData"
                :total="total"
                :loading="loading"
                :row-key="(row) => row.sku"
                :reserve-selection="false"
                ref="componentTable"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
            ></table-module>
            <export-tip v-model="visible"></export-tip>
        </page>
    </template>
    <script>
        import { api_warehous_local }  from '@/api/entrepot-picking'
        import { api_get_summary, api_get_detail, api_export_summary, api_export_detail, url_export_summary  } from '@/api/inventory-summary'
        import * as store from '@/lib/localStorage'
        import timespan from '@/components/timespan'
        import tableModule from './table-module.vue'
        import _ from 'lodash'

        const storeKey = 'AMAZON_REFUND'
        const ZIFAHUO = 1 //自发货
        const FBA = 2 //FBA
        const EXPORT_ALL =  1
        const EXPORT_BATCH = 0
        export default {
            permission: {
                url_export_summary
            },
            data() {
                return {
                    searchData: {
                        site_code: '',
                        warehouse_id: 2,
                        snType: 'name',
                        snText: '',
                        date_to: datef('YYYY-MM-dd', new Date(new Date().setDate(0)).getTime() / 1000),//上个月最后一天
                        date_from: datef('YYYY-MM-dd', new Date(new Date(new Date().setDate(0)).setDate(1)).getTime() / 1000), //上个月第一天
                        page: 1,
                        pageSize: 20
                    },
                    total: 0,
                    loading: false,
                    swith: 1,
                    visible: false,
                    clears: {
                        warehouse_id: 2,
                        snType: 'name',
                        page: 1,
                        pageSize: 20,
                        date_to: datef('YYYY-MM-dd', new Date(new Date().setDate(0)).getTime() / 1000),//上个月最后一天
                        date_from: datef('YYYY-MM-dd', new Date(new Date(new Date().setDate(0)).setDate(1)).getTime() / 1000), //上个月第一天
                    },
                    tableData: [],
                    buttons: [
                        { name: '自发货', value: 1 },
                        { name: 'FBA', value: 2 },
                    ],
                }
            },
            computed: {
                api_export() {
                    if(this.swith == ZIFAHUO) return api_export_summary
                    else return api_export_detail
                },
                api_init() {
                    if(this.swith == ZIFAHUO) return api_get_summary
                    else return api_get_detail
                }
            },
            methods: {
                search() {
                    this.searchData.page = 1
                    this.init()
                },
                init() {
                    const params = this.searchData
                    if(!params) return
                    this.loading = true
                    this.$http(this.api_init, params).then(res => {
                        this.loading = false
                        this.tableData = res.data
                        this.total = res.count
                        //缓存数据
                        store.setItem(`${storeKey}_${this.swith}`, res)
                    }).catch(error => {
                        this.loading = false
                        this.$message({type: 'error', message: error.message})
                    })
                },
                //切换表类型
                btn_select(type,btn) {
                    this.swith = btn.value
                    if(!store.getItem(`${storeKey}_${this.swith}`)) this.reset()
                    else {
                        const res = store.getItem(`${storeKey}_${this.swith}`)
                        this.tableData = res.data
                        this.total = Number(res.count)
                        this.searchData.page = Number(res.page)
                        this.searchData.pageSize = Number(res.pageSize)
                    }
                },
                reset() {
                    this.tableData = []
                    this.total = 0
                    this.searchData.page = 1,
                    this.searchData.pageSize = 20
                },
                export_click(item) {
                    // let params = { ...this.get_params(), export_type: item.value}
                    // if(params.export_type === EXPORT_ALL) params.sku_id = ""
                    // else if(params.export_type === EXPORT_BATCH) {
                    //     if(!this.selectOptions.length) return this.$message({ type: 'warning', message: '请选择需要导出的数据' })
                    //     params.sku_id = this.selectOptions.map((item) => item.sku)
                    // } else {
                    //     return new Error('未匹配到导出类型')
                    // }
                    // this.export(params)
                    console.log('导出')
                },
                export(params) {
                    this.$http(this.api_export, params).then(res => {
                        this.visible = true
                        console.log(res)
                    })
                },
                handle_size_change(val) {
                    this.searchData.pageSize = val
                    this.init()
                },
                handle_current_change(val) {
                    this.searchData.page = val
                    this.init()
                }
            },
            destroyed() {
                store.delItem(`${storeKey}_1`)
                store.delItem(`${storeKey}_2`)
            },
            components:{
                labelItem: require('@/components/label-item').default,
                selectRemote: require('@/components/select-remote.vue').default,
                labelButtons: require('@/components/label-all-buttons.vue').default,
                searchCard: require('@/components/search-card.vue').default,
                orderInput: require('@/components/order-input').default,
                selectDropdown: require('@/components/select-dropdown').default,
                exportTip: require('@/components/export-queue-tip').default,
                selectAccount: require('@/api-components/select-account').default,
                cascaderSelect: require('@/api-components/cascader-select').default,
                timespan,
                tableModule,
            },
            watch: {
                'searchData.site_code'(val) {
                    this.$nextTick(() => {        //注意：必须在nextTick中调用，防止视图未更新，调用api传入的参数仍为上次未修改的参数
                        this.$refs.selectAccount.get_list()
                    })
                },
            }
        }
    </script>
    <style lang='stylus' scoped>
        .p-invendory {
            .el-card {
                overflow: visible;
            }
        }
    </style>
    