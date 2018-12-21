<template>
    <page>
        <search-module @search="init" :search-data="searchData" :warehouse-list="warehouseList" :clears="clears"></search-module>
        <request-button :disabled="hasData"
                        class="mt-xs mb-xs ml-sm"
                        :request="exports">批量导出
        </request-button>
        <table-module :table-data="tableData"
                      :first-loading="firstLoading"
                      :is_stay="is_stay"
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
<style lang="stylus">

</style>
<script>
    import {api_get_refund, api_export_refund} from '../../../api/pin-back'
    import {api_get_analysis, api_export_analysis} from '../../../api/commodity-sales'
    import {api_get_warehouse} from  '../../../api/report-channel'
    export default {
        page: {
            devinfo: {
                frontEnd: '张明亮',
                backEnd: '赖永凤',
                createTime: '2017-8-28',
                updateTime: '2017-10-24'
            }
        },
        refresh(){
            this.init();
        },
        data(){
            return {
                warehouseList:[],
                tableData: [],
                visible: false,
                loading: false,
                total: 0,
                searchData: {
                    channel_id: 0,
                    site_code: '',
                    account_id: "",
                    warehouse_id: "",
                    sku_ids: [],
                    snDate: 'shipping_time',
                    date_b: (new Date(Date.now())),
                    date_e: Date.now(),
                    category_id: [""],
                    developer_id: '',
                    currency_code: '',
                    page: 1,
                    pageSize: 20,
                    type:'',
                },
                clears: {
                    channel_id: 0,
                    site_code: '',
                    account_id: "",
                    warehouse_id: "",
                    sku_ids: [],
                    snDate: 'shipping_time',
                    date_b: (new Date(Date.now())),
                    date_e: Date.now(),
                    category_id: [],
                    developer_id: '',
                    currency_code: '',
                    page: 1,
                    pageSize: 20,
                },
                is_stay:false,
                firstLoading:true,
                sort_type:'',
                sort_val:'',
            }
        },
        mounted(){
        	// this.init();
        	this.warehouse_remote();
        },
        methods: {
            warehouse_remote(){
                let list = [1,2,3,4,5,7,8,9];
                let type = {
                    type:list
                }
                this.$http(api_get_warehouse,type).then(res=>{
                    this.warehouseList = res.map(row => {
                        return {label: row.name, value: row.id ,type: row.type};
                    });
                });

            },
            init(){
                this.loading = true;
                this.tableData = [];
                let data = this.deal_time(this.searchData);
                this.sort_type && (this.$set(data,'sort_type', this.sort_type));
                this.sort_val && (this.$set(data,'sort_val',this.sort_val));
                this.$http(api_get_analysis, data).then(res => {
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
            },
            //处理年月日
            deal_time(searchData){
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
                data.category_id = data.category_id[data.category_id.length - 1];
                data.sku_ids = this.searchData.sku_ids.join(',');
                return data;
            },
            exports(){
                let data = this.deal_time(this.searchData);
                return this.$http(api_export_analysis, data).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.visible = true;
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            //分页器
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init()
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
            sort_change(val){
                console.log(val,'val');
                if(val.column instanceof Object){
                    console.log(val.column.label,'val.column.label');
                    let sort_label = val.column.label;
                    switch (sort_label){
                        case "订单数":
                            this.sort_type = "order_num";
                            break;
                        case "销量":
                            this.sort_type = "sale_quantity";
                            break;
                        case "销售额(CNY)":
                            this.sort_type = "sales_amount";
                            break;
                    }
                    this.sort_val = val.order === "descending" ? "2" : "1";
                    this.init();
                }
            }
        },
        computed:{
            comType(){
                if(!this.searchData.warehouse_id)return '';
                let find = this.warehouseList.find(row=>row.value === this.searchData.warehouse_id);
                if(find) return find.type;
            },
            hasData(){
            	return this.tableData.length===0;
            }
        },
        watch: {
            comType(val){
                if(Number(val)===5){
                    this.is_stay = true;
                }else{
                    this.is_stay = false;
                }
            },
        	'searchData.warehouse_id'(val){
                this.init();
            }
        },
        props: {},
        components: {
            searchModule: require('./search-module.vue').default,
            tableModule: require('./table-module.vue').default,
            exportDialog: require('../export-dialog.vue').default,
            requestButton: require('../../../global-components/request-button.vue').default,
        },
    }
</script>
