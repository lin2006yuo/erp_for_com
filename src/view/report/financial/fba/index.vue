<template>
    <page class="channel-profit">
        <search-module @init-data="init_data" ref="search_module" :channel-id="2"></search-module>
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
    import {api_report_fba} from  '@/api/report-channel';
    import {api_export_report} from "@/api/report-channel";
    import mixin from '../mixin'
    export default{
        mixins: [mixin],
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'刘炼森',
                createTime:'2017-8-7',
                updateTime:'2017-8-29'
            }
        },
        data(){
            return{
                apiTableData: api_report_fba,
                header: [
                    {label:'订单号',size:301, value: 'order_number'},
                    {label:'平台订单号',size:170, value: 'channel_order_number'},
                    {label:'账号简称',size:100, value: 'account_code'},
                    {label:'站点',size:70, value: 'site_code'},
                    {label:'销售员',size:80, value: 'seller_name'},
                    {label:'销售组长',size:100, value: 'team_leader_name'},
                    {label:'销售主管',size:100, value: 'supervisor_name'},
                    // {label:'包裹数',size:100, value: 'order_package_num'},
                    {label:'付款日期',size:170, value: 'pay_time', handle: this.handle_date},
                    // {label:'发货日期',size:170, value: 'shipping_time', handle: this.handle_date},
                    // {label:'销售员',size:120, value: 'seller_name'},
                    {label:'仓库类型',size:100, value: 'warehouse_type'},
                    {label:'发货仓库',size:100, value: 'warehouse_name'},
                    {label:'邮寄方式',size:300, value: 'shipping_name'},
                    {label:'包裹号',size:300, value: 'package_number'},
                    {label:'跟踪号',size:150, value: 'shipping_number'},
                    {label:'物流商单号',size:150, value: 'process_code'},
                    {label:'总售价原币',size:100, value: 'order_amount', handle: this.handle_number},
                    {label:'渠道成交费原币',size:120, value: 'channel_cost', handle: this.handle_number},
                    {label:'币种',size:60, value: 'currency_code'},
                    {label:'汇率',size:80, value: 'rate'},
                    // {label:'订单数',size:100, value: 'order_quantity'},
                    {label:'总售价（CNY）',size:120, value: 'order_amount_CNY', handle: this.handle_number},
                    {label:'渠道成交费（CNY）',size:140, value: 'channel_cost_CNY', handle: this.handle_number},
                    {label:'收款费用（CNY）',size:120, value: 'receipt_fee', handle: this.handle_number},
                    {label:'商品成本',size:100, value: 'goods_cost', handle: this.handle_number},
                    {label:'FBA运费',size:100, value: 'fba_shipping_fee', handle: this.handle_number},
                    // {label:'包装费用',size:100, value: 'package_fee', handle: this.handle_number},
                    // {label:'头程报关费',size:110, value: 'first_fee', handle: this.handle_number},
                    {label:'利润',size:80, value: 'profit', handle: this.handle_number},
                    {label:'货品总数',size:99, value: 'sku_count'},
                ]
            }
        },
        methods: {
            export_report(){
                //处理年月日 YYYY-MM-dd
                let data=clone(this.searchData);
                if(this.searchData.time_start){
                    data.time_start=datef('YYYY-MM-dd', this.searchData.time_start/1000);
                }else {
                    data.time_start='';
                }
                if(this.searchData.time_end){
                    data.time_end=datef('YYYY-MM-dd', this.searchData.time_end/1000);
                }else {
                    data.time_end='';
                }
                data.is_fba = 1;
                return this.$http(api_export_report, data).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.export_show = true;
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
        },
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
        }
    }
</script>
