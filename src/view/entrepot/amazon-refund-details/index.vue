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
                        v-model="searchData.site"
                        type="site"
                        class="width-sm"
                        :param="{channel_id: searchData.warehouse_id}"
                    ></select-account>
                </label-item>
                <label-item label="账号简称：" class="mr-xs">
                    <select-account
                        v-model="searchData.account_id"
                        type="account"
                        ref="selectAccount"
                        class="width-sm"
                        :param="{channel_id: 2, site_code: searchData.site}"
                    ></select-account>
                </label-item>
                <label-item label="销售员：" class="mr-xs">
                    <select-account
                        class="width-sm"
                        type="seller"
                        v-model="searchData.seller_id"
                    ></select-account>
                </label-item>
                <label-item label="退款时间：">
                    <timespan 
                        :to.sync="searchData.date_e"
                        :from.sync="searchData.date_b"></timespan>
                </label-item>
            </search-card>
            <el-row class="mb-xs">
                <permission class="ml-sm delivery_comfirm_btn"
                            tag="ElButton"
                            type="primary"
                            size="mini"
                            @click="export_repo"
                            :disabled="!tableData.length"
                            :route="apis.url_amazon_refund_export"
                            >
               批量导出</permission>
            </el-row>
            <table-module
                v-if="hackShow"
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
        import { api_amazon_refund, api_amazon_refund_fba, api_amazon_refund_export, url_amazon_refund_export }  from '@/api/amazon-refund'
        import * as store from '@/lib/localStorage'
        import timespan from '@/components/timespan'
        import tableModule from './table-module.vue'

        const storeKey = 'AMAZON_REFUND'
        const ZIFAHUO = 1 //自发货
        const FBA = 2 //FBA
        export default {
            permission: {
                url_amazon_refund_export
            },
            data() {
                return {
                    searchData: {
                        warehouse_id: 2,
                        site: '',
                        account_id: '',
                        seller_id: '',
                        date_e: datef('YYYY-MM-dd', new Date(new Date().setDate(0)).getTime() / 1000),//上个月最后一天
                        date_b: datef('YYYY-MM-dd', new Date(new Date(new Date().setDate(0)).setDate(1)).getTime() / 1000), //上个月第一天
                        page: 1,
                        pageSize: 20
                    },
                    total: 0,
                    loading: false,
                    switch: 1,
                    //用于强制销毁重置组件，为了解决从localstorage读取缓存page或pageSize并赋值后触发current-change事件，current-change事件又会触发init方法，重新请求接口的问题，重新请求接口是不希望看到的
                    //如果有更好的方法可以修改
                    hackShow: true,
                    visible: false,
                    clears: {
                        warehouse_id: 2,
                        site: '',
                        account_id: '',
                        seller_id: '',
                        date_e: datef('YYYY-MM-dd', new Date(new Date().setDate(0)).getTime() / 1000),//上个月最后一天
                        date_b: datef('YYYY-MM-dd', new Date(new Date(new Date().setDate(0)).setDate(1)).getTime() / 1000), //上个月第一天
                    },
                    tableData: [],
                    buttons: [
                        { name: '自发货', value: 1 },
                        { name: 'FBA', value: 2 },
                    ],
                    scrap: false
                }
            },
            computed: {
                api_export() {
                    if(this.switch == ZIFAHUO) return api_amazon_refund
                    else return api_amazon_refund_fba
                },
                api_init() {
                    if(this.switch == ZIFAHUO) return api_amazon_refund
                    else return api_amazon_refund_fba
                }
            },
            methods: {
                search() {
                    this.searchData.page = 1
                    this.init()
                },
                init() {
                    if(this.searchData.date_b === '' || this.searchData.date_e === '') return this.$message({type: 'warning', message: '必须设置起止时间'})
                    this.loading = true
                    this.$http(this.api_init, this.searchData).then(res => {
                        if(this.scrap) {
                            this.scrap = false
                        } else {
                            this.loading = false
                            this.tableData = res.data
                            this.total = res.count
                            //缓存数据
                            store.setItem(`${storeKey}_${this.switch}`, {res, ...this.searchData})
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
                    //记录滚动高度
                    if(store.getItem(`${storeKey}_${this.switch}`)) {
                        this.recordTop()
                    }

                    this.switch = btn.value
                    if(!store.getItem(`${storeKey}_${this.switch}`)) {
                        this.reset()
                    }
                    else {
                        this.hackShow = false
                        const res = store.getItem(`${storeKey}_${this.switch}`)
                        //重置searchData
                        this.setSearchData(res)

                        this.$nextTick(() => {
                            this.hackShow = true
                        })
                        setTimeout(() => {
                            this.$refs.componentTable.$el.querySelector('.el-table__body-wrapper').scrollTop = res.scTop || 0
                        }, 0)
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
                recordTop() {
                    const preScrollTop = this.$refs.componentTable.$el.querySelector('.el-table__body-wrapper').scrollTop
                    let tableInfo = store.getItem(`${storeKey}_${this.switch}`)
                    tableInfo['scTop'] = preScrollTop
                    store.setItem(`${storeKey}_${this.switch}`, tableInfo)
                },


                export_repo() {
                    //设置导出表类型
                    this.searchData.shipping_type = this.switch
                    this.$http(api_amazon_refund_export, this.searchData).then(res => {
                        this.visible = true
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
                timespan,
                tableModule,
            },
            watch: {
                'searchData.site'(val) {
                    this.$nextTick(() => {
                        this.$refs.selectAccount.get_list()
                        this.searchData.account_id = ''
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
