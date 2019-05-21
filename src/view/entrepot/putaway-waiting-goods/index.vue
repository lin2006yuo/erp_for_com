<template>
    <page>
        <div>
            <label-item label="请选择仓库：" class="mb-xs mt-sm">
                <super-select v-model="warehouse_id"
                              @change="change_depot"
                              class="inline s-width-default"
                              :options="warehouses"
                              storageKey="globalWarehouse"></super-select>
                <!--<el-select v-model="warehouse_id"-->
                           <!--@change="change_depot"-->
                           <!--class="inline s-width-default">-->
                    <!--<el-option-->
                            <!--:key="item.value"-->
                            <!--v-for="item in warehouses"-->
                            <!--:label="item.label"-->
                            <!--:value="item.value">-->
                    <!--</el-option>-->
                <!--</el-select>-->
            </label-item>
        </div>
        <search-module :search-data="searchData"
                       :clears="clears"
                       @search="init"
                       @change-status="change_status"
                       ref="search_module">
        </search-module>
        <div class="mt-xs ml-sm">
            <el-button type="primary"
                       size="mini"
                       :disabled="canPutaway"
                       @click="putaway">上架
            </el-button>
        </div>
        <table-module :search-data="searchData"
                      :table-data="tableData"
                      :loading="loading"
                      :total="total"
                      :first-loading="firstLoading"
                      @select-check="selectCheck"
                      @handle-size-change="handle_size_change"
                      @handle-current-change="handle_current_change"
                      class="mt-xs"
                      ref="table_module">
        </table-module>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_putaway_create, api_get_goods} from '@/api/putaway-waiting-goods';
    import {api_get_warehouse_default} from "@/api/default-warehouse-show";
    export default {
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'刘志勇',
                createTime:'2017-11-30',
                updateTime:'2017-11-30'
            },
        },
        refresh(){
            this.init();
        },
        data(){
            return {
                warehouse_id: '',
                searchData:{
                    batch_id:'',
                    purchase_order_code:'',
                    user_id:'',
                    status:0,
                    snType:'sku',
                    snText: '',
                    warehouse_area_type:11,
                    warehouse_cargo_code:'',
                    operator_type:1,
                    operator_id:'',
                    operator_time:1,
                    operator_time_from:'',
                    operator_time_to:'',
                    page:1,
                    pageSize:20
                },
                clears:{
                    status:0,
                    snType:'sku',
                    warehouse_area_type:11,
                    operator_type:1,
                    operator_time:1,
                    page:1,
                    pageSize:20
                },
                warehouses: [],
                tableData: [],
                loading: false,
                firstLoading: true,
                total: 0,
                select:[],
                disabled_tip:''
            }
        },
        mounted(){
            this.init_warehouse();
        },
        methods: {
            init(){
                this.tableData = [];
                this.loading = true;
                let data = this.init_params();
                this.$http(api_get_goods, data).then(res=>{
                    if(this.searchData.status === 0){
                        this.tableData = res.data.map(row=>{
                            row.quantity = row.waiting_quantity;
                            return row;
                        });
                    } else {
                        this.tableData = res.data;
                    }
                    this.total = res.count;
                    this.loading = false;
                    this.firstLoading = false
                }).catch(code=>{
                    this.loading = false;
                    this.$message({type:"error",message:code.message || code});
                })
            },
            init_params(){
                Object.keys(this.searchData).forEach(key=>{
                    if(typeof this.searchData[key] === 'string'){
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
                let data = clone(this.searchData);
                if (this.searchData.snText) {// 批量搜索条件数组化
                    let cur = this.searchData.snText.split('\n').filter(row => !!row);
                    data.snText = cur.map(row => {
                        return row.trim();
                    });
                } else {
                    data.snText = [];
                }
                if(this.searchData.operator_time_from){
                    data.operator_time_from=datef('YYYY-MM-dd', this.searchData.operator_time_from/1000);
                }else {
                    data.operator_time_from='';
                }
                if(this.searchData.operator_time_to){
                    data.operator_time_to=datef('YYYY-MM-dd', this.searchData.operator_time_to/1000);
                }else {
                    data.operator_time_to='';
                }
                this.$set(data, 'warehouse_id', this.warehouse_id);
                return data
            },
            init_warehouse(){
                let params = {
                    sign: 'global'
                };
                this.$http(api_get_warehouse_default, params).then(res => {
                    this.warehouses = [...res.map(item => {
                        return {label: item.name, value: item.id};
                    })];
                    this.warehouse_id = this.warehouses[0].value
                }).catch(code => {
                    this.$message({type:"error",message:code.message || code});
                })
            },
            change_depot(){
                this.init();
            },
            change_status(select, item){
                this.searchData.status = item.value;
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
            putaway(){
                let ids = this.select.map(row=>{
                    return {id:row.id,quantity:row.waiting_quantity};
                });
                this.$confirm(`您将上架这${this.select.length}个商品,确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_putaway_create, {data:ids}).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.select = [];
                        this.$refs.table_module.delete_goods();
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            selectCheck(data){
                this.select = data;
            }
        },
        computed: {
            canPutaway(){
                return this.searchData.status !== 0 || this.select.length === 0
            }
        },
        components: {
            labelItem:require('@/components/label-item.vue').default,
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
        },
    }
</script>
