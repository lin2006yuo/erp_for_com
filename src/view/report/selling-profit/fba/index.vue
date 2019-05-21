<template>
    <page>
        <search-module @init-data="init_data" ref="search_module"></search-module>
        <request-button :request="exports"
                   :disabled="hasData"
                   class="mt-xs mb-xs ml-sm">批量导出</request-button>
        <table-module :search-data="searchData"
                      ref="table_module"
                      @can-export="canExport"
                      @exports-result="exports_result"
                      :table-columns="tableColumns"
                      :api="apiTable"
        >
        </table-module>
        <export-dialog v-model="visible"></export-dialog>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_account_list, api_fba_list} from '@/api/selling-profit'
    import mixin from '../mixin'
    export default {
        mixins: [mixin],
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'赖永凤',
                createTime:'2017-9-2',
                updateTime:'2017-10-16'
            }
        },
        data(){
            return {
                apiTable: api_fba_list
            }
        },
        computed: {
            tableColumns() {
                return [
                    {label: '账号简称', value: 'account_code', hide: this.is_salesman},
                    {label: '销售员', value: 'sale_user'},
                    {label: '销售组长', value: 'sale_group_leader'},
                    {label: '销售主管', value: 'sale_director'},
                    // {label: '订单数', value: 'order_num'},
                    {label: '售价CNY', value: 'sale_amount', handle: this.toFixed2},
                    {label: '平台费用CNY', value: 'channel_cost', width: '100', handle: this.toFixed2},
                    {label: '收款费用CNY', value: 'p_fee', width: '100', handle: this.toFixed2},
                    {label: 'FBA运费', value: 'fba_shipping_fee', handle: this.toFixed2},
                    // {label: '头程报关费', value: 'first_fee', handle: this.toFixed2},
                    {label: '商品成本', value: 'goods_cost', handle: this.toFixed2},
                    {label: '毛利', value: 'gross_profit', handle: this.toFixed2},
                    {label: '退款', value: 'refund_amount', handle: this.toFixed2},
                    {label: '调整费用', value: 'adjust_fee', handle: this.toFixed2},
                    {label: '店铺费用', value: 'shop_fee', handle: this.toFixed2},
                    {label: '广告费用', value: 'ads_fee', handle: this.toFixed2},
                    {label: '实际利润', value: 'profit', handle: this.toFixed2},
                    {label: '利润率', value: 'profit_rate'},
                ]
            },
        },
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('../table-module.vue').default,
            exportDialog:require('../../export-dialog.vue').default,
            requestButton:require('../../../../global-components/request-button.vue').default,
        },
    }
</script>
