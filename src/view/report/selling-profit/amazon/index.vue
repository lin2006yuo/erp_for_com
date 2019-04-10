<template>
    <page>
        <search-module @init-data="init_data" ref="search_module"></search-module>
        <request-button :disabled="hasData"
                   :request="exports"
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
    import {api_account_list, api_amazon_list} from '@/api/selling-profit'
    export default {
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'赖永凤',
                createTime:'2017-9-2',
                updateTime:'2017-10-16'
            }
        },
        refresh(){
            this.$refs.search_module.init();
        },
        data(){
            return {
                searchData:{},
                visible:false,
                hasData:true,
                apiTable: api_amazon_list
            }
        },
        mounted(){},
        methods: {
            init_data(searchData){
                this.searchData = searchData;
                this.$nextTick(()=>{
                    this.$refs.table_module.init();
                });
            },
            exports(){
                this.$refs.table_module.exports();
            },
            exports_result(flag){
                this.visible = flag;
            },
            canExport(flag){
                this.hasData = flag;
            },
            handle_number(val) {
                return Number(val).toFixed(1);
            }
        },
        computed: {
            tableColumns() {
                return [
                    {label: '账号简称', value: 'account_code', hide: this.is_salesman},
                    {label: '销售员', value: 'sale_user'},
                    {label: '销售组长', value: 'sale_group_leader'},
                    {label: '销售主管', value: 'sale_director'},
                    {label: '订单数', value: 'order_num'},
                    {label: '售价CNY', value: 'sale_amount', handle: this.handle_number},
                    {label: '测评费用', value: 'appraisal_fee', hide: this.is_overwarehouse},
                    {label: '实际售价', value: 'actual_fee', hide: this.is_overwarehouse},
                    {label: '平台费用CNY', value: 'channel_cost', width: '100'},
                    {label: 'P卡费用', value: 'p_fee'},
                    {label: '物流费用', value: 'shipping_fee'},
                    {label: '包装费用', value: 'package_fee'},
                    {label: '头程报关费', value: 'first_fee'},
                    {label: '商品成本', value: 'goods_cost'},
                    {label: '毛利', value: 'gross_profit'},
                    {label: '退款', value: 'refund_amount'},
                    {label: '店铺费用', value: 'shop_fee', hide: this.is_overwarehouse},
                    {label: '实际利润', value: 'profit'},
                    {label: '利润率', value: 'profit_rate'},
                ]
            },
            is_salesman(){
                return this.searchData.report_type === 'seller';
            },
            is_overwarehouse(){
                return this.searchData.report_type === 'overseas';
            },
        },
        watch: {},
        props: {},
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('../table-module.vue').default,
            exportDialog:require('../../export-dialog.vue').default,
            requestButton:require('../../../../global-components/request-button.vue').default,
        },
    }
</script>
