<template>
    <page class="channel-profit">
        <search-module @init-data="init_data" ref="search_module" :channel-id="2"></search-module>
        <request-button :disabled="hasData"
                   class="mt-xs mb-xs ml-sm"
                   :request="export_report">批量导出</request-button>
        <table-module ref="table_module"
                      :search-data="searchData"
                      @can-export="canExport"
                      :api-table-data='apiTableData'
                      :header="header"
                      ></table-module>
        <export-dialog v-model="export_show"></export-dialog>
    </page>
</template>
<style lang="stylus">
    .channel-profit{
        .label-width{
            width:100px;
        }
    }

    .financial .el-table__empty-text{
        left: 30% !important;
    }

    @media screen and (max-width: 1366px) {
        .table-module .el-table__empty-text{
            left: 25% !important;
        }
    }
</style>
<script>
    import {api_get_channel, api_account_list, api_get_warehouse, api_report_Amazon, api_export_report} from  '@/api/report-channel'
    export default{
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'刘炼森',
                createTime:'2017-8-7',
                updateTime:'2017-9-6'
            },
        },
        refresh(){
            this.$refs.search_module.init();
        },
        data(){
            return{
                tableData:[],
                searchData:{},
                export_show:false,
                hasData:true,
                apiTableData: api_report_Amazon,
                header: [
                    //注意：更改此处size的时候需要更改indent-table标签的width宽度
                    {label:'订单号',size:300, value: 'order_number'},
                    {label:'平台订单号',size:170, value: 'channel_order_number'},
                    {label:'账号简称',size:100, value: 'account_code'},
                    {label:'站点',size:70, value: 'site_code'},
                    {label:'销售员',size:80, value: 'seller_name'},
                    {label:'销售组长',size:100, value: 'team_leader_name'},
                    {label:'销售主管',size:100, value: 'supervisor_name'},
                    {label:'包裹数',size:70, value: 'order_package_num'},
                    {label:'付款日期',size:170, value: 'pay_time', handle: this.handle_date},
                    {label:'发货日期',size:170, value: 'shipping_time', handle: this.handle_date},
                    {label:'仓库类型',size:100, value: 'warehouse_type'},
                    {label:'发货仓库',size:120, value: 'warehouse_name'},
                    {label:'物流商',size:120, value: 'warehouse_name'},
                    {label:'邮寄方式',size:300, value: 'shipping_name'},
                    {label:'包裹号',size:300, value: 'package_number'},
                    {label:'跟踪号',size:150, value: 'shipping_number'},
                    {label:'物流商单号',size:150, value: 'process_code'},
                    {label:'总售价原币',size:100, value: 'order_amount', handle: this.handle_number},
                    {label:'渠道成交费原币',size:120, value: 'channel_cost', handle: this.handle_number},
                    {label:'币种',size:60, value: 'currency_code'},
                    {label:'汇率',size:80, value: 'rate'},
                    {label:'总售价（CNY）',size:120, value: 'order_amount_CNY', handle: this.handle_number},
                    {label:'渠道成交费（CNY）',size:140, value: 'channel_cost_CNY', handle: this.handle_number},
                    {label:'收款费用（CNY）',size:120, value: 'p_card_cost', handle: this.handle_number},
                    {label:'商品成本',size:100, value: 'goods_cost', handle: this.handle_number},
                    {label:'物流费用',size:100, value: 'shipping_fee', handle: this.handle_number},
                    {label:'包装费用',size:100, value: 'package_fee', handle: this.handle_number},
                    {label:'头程报关费',size:110, value: 'first_fee', handle: this.handle_number},
                    {label:'利润',size:80, value: 'profit', handle: this.handle_number},
                    {label:'转运费',size:80, value: 'profit', handle: this.handle_number},
                    {label:'货品总数',size:99, value: 'sku_count'}
                ]
            }
        },
        mounted(){},
        filters:{},
        methods:{
            init_data(searchData){
                this.searchData = searchData;
                this.$nextTick(()=>{
                    this.$refs.table_module.init();
                });
            },
            //批量导出
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
                return this.$http(api_export_report, data).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.export_show = true;
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            canExport(flag){
                this.hasData = flag;
            },
            handle_date(val) {
                if(val){
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
            handle_number(val) {
                return Number(val).toFixed(4);
            }
        },
        computed:{},
        watch:{},
        components:{
            searchModule:require('../search-module.vue').default,
            tableModule:require('../table-module.vue').default,
            exportDialog:require('../../export-dialog.vue').default,
            requestButton:require('../../../../global-components/request-button.vue').default,
        }
    }
</script>
