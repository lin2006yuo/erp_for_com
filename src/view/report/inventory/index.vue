<template>
    <page class='p-invendory'>
        <search-card class="mb-xs" @search="search" :params="searchData" :clears="clears">
            <el-row>
                <label-buttons
                    class="inline btn-ml mr-sm"
                    label="" :buttons="buttons"
                    @select="btn_select"
                    title="请选择状态"
                ></label-buttons>
            </el-row>
            <label-item label="仓库：">
                <select-account
                    v-model="searchData.warehouse_id"
                    type="warehouse_all"
                ></select-account>
            </label-item>
            <label-item label="">
                <el-select
                    v-model="searchData.snType"
                    class="inline ml-sm s-width-small"
                    @change="sntypeChange"
                >
                    <el-option
                        :key="item.value"
                        v-for="item in selectList"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <el-input
                    class="ml-xs"
                    v-if="searchData.snType === 'name'"
                    v-model="searchData.snText"
                    placeholder="请输入产品名称"
                ></el-input>
                <sntext-input
                    v-else
                    class="ml-xs"
                    v-model="searchData.snText"
                    @keydown="init"
                ></sntext-input>
            </label-item>
            <label-item label="商品分类：" class="inline ml-sm">
                <cascader-select
                    v-model="searchData.category_id"
                    type="goods"
                />
            </label-item>
            <label-item label="日期范围：" class="ml-sm">
                <timespan :from.sync="searchData.date_from" :to.sync="searchData.date_to"></timespan>
            </label-item>
        </search-card>
        <el-row class="mb-xs">
            <permission class="ml-sm delivery_comfirm_btn"
                        tag="selectDropdown"
                        type="primary"
                        size="mini"
                        keys="value"
                        :route="apis.url_export_summary"
                        :handles="partAllOptions"
                        :action="export_click"
                        :change="handle_select_change">
            </permission>
        </el-row>
        <component
            :is="table"
            :search-data="searchData"
            :table-data="tableData"
            :total="total"
            :loading="loading"
            :row-key="(row) => row.sku"
            :reserve-selection="true"
            ref="componentTable"
            @size-change="handle_size_change"
            @current-change="handle_current_change"
            @selection-change="handle_select"
        ></component>
        <export-tip v-model="visible"></export-tip>
    </page>
</template>
<script>
    import {api_get_categories} from '@/api/stock-control'
    import { api_get_summary, api_get_detail, api_export_summary, api_export_detail, url_export_summary, api_all_warehousre  } from '@/api/inventory-summary'
    import * as store from '@/lib/localStorage'

    import tableModule from './table-module.vue'
    import tableModuleMul from './table-module-mul.vue'
    import _ from 'lodash'

    const DETAIL_TABLE = 2 //明细表
    const SUMMARY_TABLE = 1 //汇总表
    const EXPORT_ALL =  1
    const EXPORT_BATCH = 0
    export default {
        permission: {
            url_export_summary
        },
        data() {
            return {
                searchData: {
                    warehouse_id: 2,
                    snType: 'name',
                    snText: '',
                    category_id: '',
                    date_to: datef('YYYY-MM-dd', new Date(new Date().setDate(0)).getTime() / 1000),//上个月最后一天
                    date_from: datef('YYYY-MM-dd', new Date(new Date(new Date().setDate(0)).setDate(1)).getTime() / 1000), //上个月第一天
                    page: 1,
                    pageSize: 20
                },
                total: 0,
                loading: false,
                swith: 1,
                visible: false,
                selectOptions: [],
                goodsType: [],
                clears: {
                    warehouse_id: 2,
                    snType: 'name',
                    category_id: [],
                    page: 1,
                    pageSize: 20,
                    date_to: new Date(new Date().setDate(0)),
                    date_from: new Date(new Date(new Date().setDate(0)).setDate(1)),
                },
                tableData: [],
                buttons: [
                    { name: '汇总表', value: 1 },
                    { name: '明细表', value: 2 },
                ],
                selectList: [
                    { value: 'name', label: '产品名称' },
                    { value: 'sku', label: 'SKU' },
                ],
                partAllOptions: [
                    {label: "部分导出", value: 0},
                    {label: "全部导出", value: 1}
                ],
                scrap: false,
            }
        },
        computed: {
            table() {
                if(this.swith == SUMMARY_TABLE) return tableModuleMul
                else return tableModule
            },
            api_export() {
                if(this.swith == SUMMARY_TABLE) return api_export_summary
                else return api_export_detail
            },
            api_init() {
                if(this.swith == SUMMARY_TABLE) return api_get_summary
                else return api_get_detail
            }
        },
        methods: {
            search() {
                this.searchData.page = 1
                this.init()
            },
            init() {
                console.log('init')
                const params = this.get_params()
                if(!params) return
                if(params.snText && params.snText.length > 300) return this.$message({ type: 'warning', message: '批量搜索只支持300条数据！' })
                this.loading = true
                this.$http(this.api_init, params).then(res => {
                    if(this.scrap) {
                        this.scrap = false
                        return
                    } else {
                        this.scrap = false
                        this.loading = false
                        this.tableData = res.data
                        this.total = res.count
                        //缓存数据
                        store.setItem(`InventoryTabelData_${this.swith}`, {res, ...this.searchData})
                        //重置滚动高度
                        if(this.$refs.componentTable) this.$refs.componentTable.$el.querySelector('.el-table__body-wrapper').scrollTop = 0
                    }
                }).catch(error => {
                    this.loading = false
                    this.$message({type: 'error', message: error.message})
                })
            },
            //切换表类型
            btn_select(type,btn) {

                //如果切换表格时，仍在loading，说明强制切换，上次请求数据不渲染
                if(this.loading) {
                    this.loading = false
                    this.scrap = true
                }

                if(this.tableData.length) {
                    //记录滚动高度
                    this.recordTop()
                }
                this.swith = btn.value
                if(!store.getItem(`InventoryTabelData_${this.swith}`)) {
                    this.reset()
                } else {
                    const res = store.getItem(`InventoryTabelData_${this.swith}`)
                    //重置searchData
                    this.setSearchData(res)

                    setTimeout(() => {
                        this.$refs.componentTable.$el.querySelector('.el-table__body-wrapper').scrollTop = res.scTop || 0
                    }, 50)
                }
            },
            reset() {
                this.tableData = []
                this.total = 0
                this.searchData.page = 1,
                this.searchData.pageSize = 20
            },
            setSearchData(searchData) {
                this.tableData = searchData.res.data
                this.total = Number(searchData.res.count)
                for(let key in searchData) {
                    if(this.searchData.hasOwnProperty(key)) {
                        this.searchData[key] = searchData[key]
                    }
                }
            },
            export_click(item) {
                let params = { ...this.get_params(), export_type: item.value}
                if(params.export_type === EXPORT_ALL) params.sku_id = ""
                else if(params.export_type === EXPORT_BATCH) {
                    if(!this.selectOptions.length) return this.$message({ type: 'warning', message: '请选择需要导出的数据' })
                    if(this.swith === DETAIL_TABLE) {
                        params.ids = this.selectOptions.map((item) => item.id)
                    } else {
                        params.sku_id = this.selectOptions.map((item) => item.sku)
                    }
                } else {
                    return new Error('未匹配到导出类型')
                }
                this.export(params)
            },
            export(params) {
                this.$http(this.api_export, params).then(res => {
                    this.visible = true
                    console.log(res)
                })
            },
            recordTop() {
                const preScrollTop = this.$refs.componentTable.$el.querySelector('.el-table__body-wrapper').scrollTop
                let tableInfo = store.getItem(`InventoryTabelData_${this.swith}`)
                tableInfo['scTop'] = preScrollTop
                store.setItem(`InventoryTabelData_${this.swith}`, tableInfo)
            },
            handle_size_change(val) {
                this.searchData.pageSize = val
                this.init()
            },
            handle_current_change(val) {
                this.searchData.page = val
                this.init()
            },
            handle_select(selecteds) {
                this.selectOptions = selecteds
            },
            handle_select_change(val) {
                //切换成导出全部时清空复选框
                if(val.value === EXPORT_ALL) {
                    this.$refs.componentTable.$children[0].clearSelection()
                }
            },
            get_params() {
                let params = _.clone(this.searchData)
                //解决之前的数据结构设计问题
                if(params.snText && typeof params.snText === 'string') {
                    params.snText = [params.snText]
                }
                return params
            },
            sntypeChange() {
                this.searchData.snText = ''
            }
        },
        destroyed() {
            store.delItem('InventoryTabelData_1')
            store.delItem('InventoryTabelData_2')
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
            sntextInput: require('@/components/sntext-input').default,
            timespan: require('@/components/timespan').default,
            cascaderSelect: require('@/api-components/cascader-select').default,
            tableModule,
            tableModuleMul
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
