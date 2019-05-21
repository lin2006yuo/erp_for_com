<template>
    <page class="channel-profit">
        <search-module @init-data="init_data" ref="search_module" :channel-id="4"></search-module>
        <request-button :disabled="hasData"
                   class="mt-xs mb-xs ml-sm"
                   :request="export_report">批量导出</request-button>
        <table-module ref="table_module"
                      :search-data="searchData"
                      @can-export="canExport"
                      :header="header"
                      :api="apiTableData"
        ></table-module>
        <export-dialog v-model="export_show"></export-dialog>
    </page>
</template>
<script>
    import {api_report_aliexpress} from  '@/api/report-channel'
    import mixin from '../mixin'
    export default{
        mixins: [mixin],
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'刘炼森',
                createTime:'2017-8-7',
                updateTime:'2017-8-29',
            }
        },
        data(){
            return{
                apiTableData: api_report_aliexpress,
                /**
                 * size: 表格宽度
                 * handle: 表格数据处理函数
                 * uiWidh: ui-tip组件的width
                 */
                header: [
                    {label:'订单号',size:301, value: 'order_number'},
                    {label:'平台订单号',size:150, value: 'channel_order_number'},
                    {label:'包裹数',size:70, value: 'order_package_num'},
                    {label:'账号简称',size:100, value: 'account_code'},
                    {label:'销售员',size:80, value: 'seller_name'},
                    {label:'销售组长',size:100, value: 'team_leader_name'},
                    {label:'付款日期',size:170, value: 'pay_time', handle: this.handle_date},
                    {label:'发货日期',size:170, value: 'shipping_time', handle: this.handle_date},
                    {label:'仓库类型',size:100, value: 'warehouse_type'},
                    {label:'发货仓库',size:100, value: 'warehouse_name'},
                    {label:'物流商',size:120, value: 'carrier'},
                    {label:'邮寄方式',size:300, value: 'shipping_name'},
                    {label:'包裹号',size:300, value: 'package_number'},
                    {label:'跟踪号',size:150, value: 'shipping_number'},
                    {label:'物流商单号',size:150, value: 'process_code'},
                    {label:'总售价原币',size:100, value: 'order_amount'},
                    {label:'渠道成交费原币',size:100, value: 'channel_cost'},
                    {label:'币种',size:100, value: 'currency_code'},
                    {label:'汇率',size:100, value: 'rate'},
                    // {label:'订单数',size:100, value: 'order_quantity'},
                    {label:'总售价',size:90, value: 'order_amount_CNY', handle: this.handle_number},
                    {label:'渠道成交费',size:100, value: 'channel_cost_CNY', handle: this.handle_number},
                    {label:'商品成本',size:100, value: 'goods_cost', handle: this.handle_number},
                    {label:'国内采购运费',size:110, value: 'shipping_cost', handle: this.handle_number},
                    {label:'物流费用',size:100, value: 'shipping_fee', handle: this.handle_number},
                    // {label:'包装费用',size:100, value: 'package_fee', handle: this.handle_number},
                    {label:'转运费',size:80, value: 'trans_shipping_fee', handle: this.handle_number},
                    {label:'利润',size:80, value: 'profit', handle: this.handle_number},
                    {label:'跌价金额',size:80, value: 'subsidy_count', handle: this.handle_number},
                    {label:'实际利润',size:80, value: 'actual_profit', handle: this.handle_number},
                    {label:'货品总数',size:99, value: 'sku_count', handle: this.handle_number},
                ]
            }
        }
    }
</script>
<style lang="stylus">
    .channel-profit{
        .label-width{
            width:100px;
        }
    }

    .financial .el-table__empty-text{
        left: 50% !important;
    }

    @media screen and (max-width: 1366px) {
        .table-module .el-table__empty-text{
            left: 25% !important;
        }
    }
</style>
