<template>
    <page>
        <search-module :search-data="searchData"
                       :clears="clears"
                       @change-select="change_select"
                       @search="search"></search-module>
        <div>
            <permission tag="ElButton"
                        :route="apis.url_post_export"
                        class="mt-xs mb-xs ml-sm"
                        type="primary"
                        size="mini"
                        @click.native="batch_export">批量导出</permission>
        </div>
        <table-module :loading="loading"
                      :first-loading="firstLoading"
                      :total="total"
                      :search-data="searchData"
                      :table-data="tableData"
                      :report-type="reportType"
                      @handle-selection-change="handle_selection_change"
                      @handle-size-change="handle_size_change"
                      @handle-current-change="handle_current_change"></table-module>
        <export-dialog v-model="exportVisible"></export-dialog>
    </page>
</template>

<style lang="stylus" scoped>

</style>

<script>
    import { api_get_lazada_account_analysis_list, api_get_lazada_site_analysis_list, api_post_export, url_post_export } from '@/api/performance-analysis';
    import { downloadFile } from '@/lib/http';
    export default {
        page: {
            devinfo: {
                frontEnd: '钱宇琨',
                backEnd: '翟雪莉',
                createdTime: '2019-04-28',
                updateTime: '2019-04-28'
            }
        },
        permission: {
            url_post_export
        },
        data(){
            return{
                searchData: {
                    account: '',
                    snUser: 'seller_id',
                    snName: '',
                    date_from: '',
                    date_to: '',
                    page: 1,
                    pageSize: 20,
                },
                clears: {
                    snUser: 'seller_id',
                    page: 1,
                    pageSize: 20,
                },
                loading: false,
                firstLoading: true,
                tableData: {},
                total: 0,
                selected: [],
                reportType: 1,
                exportVisible:false,
                titleArr: [
                    {
                        title: 'order_quantity',
                        account: 'account_quantity',
                        site: 'order_quantity'
                    },
                    {
                        title: 'delivery_order_quantity',
                        account: 'account_delivery_quantity',
                        site: 'delivery_order_quantity'
                    },
                    {
                        title: 'delivery_sku_quantity',
                        account: 'account_sku',
                        site: 'delivery_sku_quantity'
                    },
                    {
                        title: 'delivery_sale_amount',
                        account: 'account_amount',
                        site: 'delivery_sale_amount'
                    },
                    {
                        title: 'customer_price',
                        account: 'account_price',
                        site: 'customer_price'
                    },
                    {
                        title: 'profit',
                        account: 'account_profit',
                        site: 'profit'
                    },
                    {
                        title: 'profit_rate',
                        account: 'account_profit_rate',
                        site: 'profit_rate'
                    }
                ]
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            init(){
                this.loading = true;
                let data = this.get_init_params();
                let api = this.isAccount ? api_get_lazada_account_analysis_list : api_get_lazada_site_analysis_list;
                this.$http(api, data).then(res => {
                    res.data.forEach(row => {
                        if(this.isAccount){
                            this.$set(row, 'show', false);
                            this.titleArr.forEach(item => {
                                this.$set(row, item.title, row[item.account]);
                            })
                        }else{
                            this.titleArr.forEach(item => {
                                this.$set(row, item.title, row[item.site]);
                            })
                        }
                    });
                    this.loading = false;
                    this.firstLoading = false;
                    this.tableData = res;
                    this.total = res.count;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            //初始化搜索条件
            get_init_params(){
                let params = clone(this.searchData);
                if(this.searchData.date_from){
                    params.date_from = datef('YYYY-MM-dd', this.searchData.date_from/1000);
                }else {
                    params.date_from = '';
                }
                if(this.searchData.date_to){
                    params.date_to = datef('YYYY-MM-dd', this.searchData.date_to/1000);
                }else {
                    params.date_to = '';
                }
                if(this.searchData.account){
                    params.account = this.searchData.account.trim()
                }
                return params
            },
            search(){
                this.init();
            },
            batch_export(){
                let params = this.get_init_params();
                let type = this.reportType === 1 ? 'account' : 'site';
                this.$set(params, 'type', type);
                this.$http(api_post_export, params).then(res => {
                    if(res.join_queue === 1){
                        this.$message({type:"success",message:res.message || res});
                        this.exportVisable = true;
                    }else{
                        let url = config.apiHost+'downloadFile/downExportFile';
                        let params = {
                            file_code:res.file_code,
                            page:this.searchData.page,
                            pageSize:this.searchData.pageSize,
                        };
                        downloadFile({
                            url:url,
                            get:params,
                            fileName:res.file_name,
                            suffix:'.xls',
                        });
                    }
                }).catch(err => {
                    this.$message({type: 'error', message: err.message || err})
                })
            },
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
            handle_selection_change(val){
                this.selected = val
            },
            change_select(val, item){
                this.reportType = item.value;
                if(!this.firstLoading){
                    this.init()
                }
            }
        },
        computed: {
            isAccount(){
                return this.reportType === 1 ? true : false
            }
        },
        components: {
            searchModule: require('./search-module.vue').default,
            tableModule: require('./table-module.vue').default,
            exportDialog:require('../../report/export-dialog').default,
        }
    }
</script>