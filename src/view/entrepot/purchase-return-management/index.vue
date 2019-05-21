<template>
    <page>
        <div>
            <label-item label="请选择仓库：" class="mb-xs mt-sm">
                <super-select v-model="warehouse_id"
                              @change="change_warehouse"
                              class="inline s-width-default"
                              :options="warehouses"
                              storageKey="localTransitWarehouse"></super-select>
                <!--<el-select v-model="warehouse_id"-->
                           <!--@change="change_warehouse"-->
                           <!--class="inline s-width-default">-->
                    <!--<el-option-->
                            <!--:key="item.value"-->
                            <!--v-for="item in warehouses"-->
                            <!--:label="item.label"-->
                            <!--:value="item.value"></el-option>-->
                <!--</el-select>-->
            </label-item>
        </div>
        <search-module :search-data="searchData"
                       :clears="clears"
                       :status-btn="statusBtn"
                       @search="search"
                       @select-status="select_status"></search-module>
        <table-module :loading="loading"
                      :first-loading="firstLoading"
                      :total="total"
                      :search-data="searchData"
                      :table-data="tableData"
                      @get-details="get_details"
                      @print-form="print_form"
                      @cancel="cancel"
                      @handle-size-change="handle_size_change"
                      @handle-current-change="handle_current_change"
                      @handle-selection-change="handle_selection_change"></table-module>
        <look-stock-out v-model="showDialog"
                        :form-data="formData"
                        :action="action"
                        @stock-out="stock_out"></look-stock-out>
        <print-data v-model="printVisible" :trend-action="formData"></print-data>
    </page>
</template>

<style lang="stylus" scoped>

</style>

<script>
    import {
        api_get_purchase_return_list,
        api_get_look_details,
        api_get_purchase_return_status,
        api_post_stock_out,
        api_delete_order
    } from '@/api/purchase-return-management';
    import {api_get_warehouse_default} from "@/api/default-warehouse-show";
    export default {
        page: {
            devinfo: {
                frontEnd: '钱宇琨',
                backEnd: '蓝术术',
                createdTime: '2019-03-14',
                updateTime: '2019-03-14'
            }
        },
        data(){
            return{
                warehouse_id: '',
                status: '',//状态
                searchData: {
                    snType: 'purchase',//搜索类型
                    snText: '',//搜索内容
                    time_type: 1,//时间类型
                    create_time_from: '',
                    create_time_to: '',
                    page: 1,
                    pageSize: 50,
                },
                clears: {
                    snType: 'purchase',//搜索类型
                    time_type: 1,//时间类型
                    page: 1,
                    pageSize: 50,
                },
                statusBtn: [],
                warehouses: [],//仓库列表
                checkData: [],//表格选中列表
                loading: false,
                firstLoading: true,
                tableData: [],
                total: 0,
                showDialog: false,
                formData: {},
                action: {
                    title: '',
                    operation: ''
                },
                printVisible: false
            }
        },
        mounted(){
            this.get_warehouse();
            this.get_status()
        },
        methods:{
            init(){
                this.loading = true;
                let data = this.get_init_params();
                this.$http(api_get_purchase_return_list, data).then(res => {
                    this.loading = false;
                    this.firstLoading = false;
                    this.tableData = res.data;
                    this.total = res.count;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            get_status(){
                this.$http(api_get_purchase_return_status).then(res => {
                    this.statusBtn = [{label: '全部', value: ''},...res]
                }).catch(err => {
                    this.$message({type: 'error', message: err.message||err})
                })
            },
            //初始化搜索条件
            get_init_params(){
                let params = clone(this.searchData);
                if(this.searchData.create_time_from){
                    params.create_time_from = datef('YYYY-MM-dd', this.searchData.create_time_from/1000);
                }else {
                    params.create_time_from = '';
                }
                if(this.searchData.create_time_to){
                    params.create_time_to = datef('YYYY-MM-dd', this.searchData.create_time_to/1000);
                }else {
                    params.create_time_to = '';
                }
                if(this.searchData.snText) {
                    params.snText = this.searchData.snText.split('\n').filter(row => !!row).map(row => row.trim());
                }
                this.$set(params, 'status', this.status);
                this.$set(params, 'warehouse_id', this.warehouse_id);
                return params;
            },
            search(){
                this.init();
            },
            change_warehouse(){
                this.init();
            },
            //查看 / 出库 详情
            get_details(row, type){
                this.$http(api_get_look_details, row.id).then(res => {
                    this.formData = res;
                    this.action = {
                        title: type === 'look' ? '查看退货单号信息' : '采购退货出库',
                        operation: type
                    };
                    this.showDialog = true
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            cancel(row){
                this.$confirm(`您将作废退货单号（${row.number}），确定进行此操作?`,'提示',{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:"warning"
                }).then(()=>{
                    this.$http(api_delete_order,row.id).then(res=>{
                        this.$message({
                            type:"success",
                            message:res.message||res
                        });
                       this.init()
                    }).catch(code=>{
                        this.$message({
                            type:"error",
                            message:code.message||code
                        })
                    })
                }).catch(()=>{
                    this.$message({
                        type:"info",
                        message:"已取消"
                    })
                })
            },
            print_form(row){
                this.$http(api_get_look_details, row.id).then(res => {
                    this.formData = res;
                    this.printVisible = true
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            //出库
            stock_out(data, id){
                this.$http(api_post_stock_out, id, data).then(res => {
                    this.$message({type: 'success', message: res.message});
                    this.showDialog = false;
                    this.init()
                }).catch(err => {
                    this.$message({type: 'error', message: err.message||err})
                })
            },
            //获取本地仓库列表
            get_warehouse() {
                let params = {
                    sign: 'local_transit'
                };
                this.$http(api_get_warehouse_default, params).then(res => {
                    this.warehouses = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                    this.warehouse_id = this.warehouses[0].value
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            select_status(index, item){
                this.status = item.value;
                if(!this.firstLoading){
                    this.init();
                }
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

            }
        },
        components: {
            searchModule: require('./search-module.vue').default,
            tableModule: require('./table-module.vue').default,
            lookStockOut: require('./look-stock-out.vue').default,
            labelItem: require('@/components/label-item').default,
            printData: require('./print-data.vue').default
        }
    }
</script>