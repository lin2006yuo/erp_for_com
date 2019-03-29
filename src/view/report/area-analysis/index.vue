<template>
    <page>
        <search-module @search="search" :search-data="searchData" :warehouse-list="warehouseList" :clears="clears"></search-module>
        <request-button :disabled="hasData"
                        class="mt-xs mb-xs ml-sm"
                        :request="exports">批量导出
        </request-button>
        <table-module :table-data="tableData"
                      :first-loading="firstLoading"
                      :loading="loading"
                      @sort-change="sort_change">
        </table-module>
        <el-pagination
            class="page-fixed"
            @size-change="handle_size_change"
            @current-change="handle_current_change"
            :current-page="searchData.page"
            :page-sizes="[20, 50, 100, 200]"
            :page-size="searchData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <export-dialog v-model="visible"></export-dialog>
    </page>
</template>
<script>
    import {api_get_warehouse} from  '@/api/report-channel'
    import {api_area_analysis, api_export_analysis} from '@/api/area-sales-analysis'
    export default {
        data(){
            return {
                warehouseList:[],
                tableData: [],
                visible: false,
                loading: false,
                total: 0,
                searchData: {
                    channel_id: '',
                    site_code: '',
                    account_id: "",
                    snDate: 'shipping_time',
                    date_b: new Date(Date.now() - (14 * 24 * 3600 * 1000)),
                    date_e: new Date(),
                    country_code: [],
                    total_type: 'now_order_total',
                    currency_code: '',
                    total_b: '',
                    total_e: '',
                    page: 1,
                    pageSize: 20,
                },
                clears: {
                    channel_id: 0,
                    site_code: '',
                    account_id: "",
                    snDate: 'shipping_time',
                    date_b: new Date(Date.now() - (14 * 24 * 3600 * 1000)),
                    date_e: Date.now(),
                    country_code: [],
                    total_type: 'now_order_total',
                    total_b: '',
                    total_e: '',
                    page: 1,
                    pageSize: 20,
                },
                firstLoading:true,
                sort_type:'',
                sort_val:'',
            }
        },
        methods: {
            search() {
                this.searchData.page = 1
                this.init()
            },
            init(){
                let data = this.get_params(this.searchData);
                
                this.valide_date(data).then(() => {
                    console.log(1)
                    this.loading = true;
                    this.$http(api_area_analysis, data).then(res => {
                        this.tableData = res.data;
                        this.total = res.count;
                        this.loading = false;
                        if(this.tableData.length === 0){
                            this.firstLoading = false;
                        }
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                        this.loading = false;
                    })
                }).catch(error => {
                    console.log(1)
                    this.$message({type: 'warning', message: error})
                })
            
            },
            exports(){
                let data = this.get_params(this.searchData);
                return this.$http(api_export_analysis, data).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.visible = true;
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init()
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
            sort_change(val){
            },
            get_params(searchData){
                //处理年月日 YYYY-MM-dd
                let data = clone(searchData);
                if (searchData.date_b) {
                    data.date_b = datef('YYYY-MM-dd', searchData.date_b / 1000);
                } else {
                    data.date_b = '';
                }
                if (searchData.date_e) {
                    data.date_e = datef('YYYY-MM-dd', searchData.date_e / 1000);
                } else {
                    data.date_e = '';
                }
                if(data.country_code === []) data.country_code = ''
                return data;
            },
            valide_date(data) {
                return new Promise((resolve, reject) => {
                    const reg = /^([1-9]|\s*)\d*$/
                    if(!reg.test(data.total_b) && !reg.test(data.total_e)) {
                        return reject('请输入正整数')
                    }
                    if(data.total_b > data.total_e) {
                        return reject('最大值不能小于最小值')
                    }
                    resolve()
                })
            }
        },
        computed:{
            hasData(){
            	return this.tableData.length===0;
            }
        },
        props: {},
        components: {
            searchModule: require('./search-module.vue').default,
            tableModule: require('./table-module.vue').default,
            exportDialog: require('../export-dialog.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
        },
    }
</script>
