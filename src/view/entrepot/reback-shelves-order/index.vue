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
        <search-module @search="init"
                       @change-status="change_status"
                       :search-data="searchData"
                       :clears="clears"
                       :area-list="areaList"
                       ref="search_module">
        </search-module>
        <div class="mt-sm ml-sm mb-sm">
            <request-button :disabled="canVoid"
                            req-key="void_order"
                       @click="void_order">作废
            </request-button>
            <request-button class="ml-sm"
                       :disabled="canPut"
                            req-key="return_shelves_putaway"
                       @click="putaway">完成上架
            </request-button>
            <request-button class="ml-sm"
                            :disabled="forceDis"
                            req-key="return_shelves_putaway"
                            @click="forceDone">强制完成
            </request-button>
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
    import {
        api_patch_shelves,
        api_patch_reback_shelves,
        api_delete_shelves,
        api_get_return_reback_shelves_order,
        api_delete_reback_shelves,
        api_patch_reback_shelves_force} from '@/api/return-shelves';
    import {api_get_warehouse_default} from "@/api/default-warehouse-show";
    import {api_get_area, api_get_type} from '@/api/putaway-order';
    export default {
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'刘志勇',
                createTime:'2018-02-27',
                updateTime:'2018-02-27'
            },
        },
        refresh(){
          this.init()
        },
        data(){
            return {
                firstLoading: true,
                loading: true,
                tableData: [],
                total: 0,
                warehouse_id:'',
                searchData:{
                    id:'',
                    status:'',
                    warehouse_cargo_code:'',
                    sku:'',
                    warehouse_area_type:'',
                    creator_id:'',
                    create_time_from:'',
                    create_time_to:'',
                    page:1,
                    pageSize:20
                },
                clears:{
                    page:1,
                    pageSize:20
                },
                warehouses: [],
                areaList:[],
                select:[],
            }
        },
        mounted(){
            this.init_warehouse();
            this.init_area();
        },
        methods: {
            init(){
                this.loading = true;
                let data = this.init_params();
                this.$http(api_get_return_reback_shelves_order, data).then(res=>{
                    this.tableData = res.data;
                    this.total = res.count;
                    this.loading = false;
                    this.firstLoading = false
                }).catch(code=>{
                    this.loading = false;
                    this.$message({type:"error",message:code.message || code});
                })
            },
            init_params(){
                Object.keys(this.searchData).forEach(key => {
                    if(typeof this.searchData[key] === 'string') {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
                let data = clone(this.searchData);
                if(this.searchData.create_time_from){
                    data.create_time_from=datef('YYYY-MM-dd', this.searchData.create_time_from/1000);
                }else {
                    data.create_time_from='';
                }
                if(this.searchData.create_time_to){
                    data.create_time_to=datef('YYYY-MM-dd', this.searchData.create_time_to/1000);
                }else {
                    data.create_time_to='';
                }
                this.$set(data, 'warehouse_id', this.warehouse_id);
                return data
            },
            init_warehouse(){
                let params = {
                    sign: 'global'
                };
                this.$http(api_get_warehouse_default, params).then(res => {
                    this.warehouses = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                    this.warehouse_id = this.warehouses[0].value;
                }).catch(code => {
                    this.$message({type:"error",message:code.message || code});
                })
            },
            init_area(){
                this.$http(api_get_type).then(res=>{
                    this.areaList.push({label:'全部',value:''}, ...res);
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            init_data(searchData){
                this.searchData = window.clone(searchData);
                if (searchData.create_time_from) {
                    this.searchData.create_time_from = datef("YYYY-MM-dd",this.searchData.create_time_from/1000);
                }else {
                    this.searchData.create_time_from="";
                }
                if (searchData.create_time_to) {
                    this.searchData.create_time_to = datef("YYYY-MM-dd",this.searchData.create_time_to/1000);
                }else {
                    this.searchData.create_time_to="";
                }
                this.$nextTick(()=>{
                    this.init()
                });
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
            //分页器
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
            forceDone(){//强制完成
                let ids = this.select.map(row=>{
                    return row.id;
                });
                this.$confirm(`您将完成上架这${this.select.length}个上架单,确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_patch_reback_shelves_force, {ids:ids}).then(res=>{
                        this.select = [];
                        this.init();
                        this.$message({type:"success",message:res.message||res});
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey(`return_shelves_putaway`, false);
                    },200);
                });
            },
            putaway(){
                let ids = this.select.map(row=>{
                    return row.id;
                });
                this.$confirm(`您将完成上架这${this.select.length}个上架单,确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_patch_reback_shelves, {ids:ids}).then(res=>{
                        this.select = [];
                        this.init();
                        this.$message({type:"success",message:res.message||res});
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey(`return_shelves_putaway`, false);
                    },200);
                });
            },
            void_order(){
                let ids = this.select.map(row=>{
                    return row.id;
                });
                this.$confirm(`您将作废这${this.select.length}个上架单,确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_reback_shelves, {ids:ids}).then(res=>{
                        this.select = [];
                        this.init();
                        this.$message({type:"success",message:res.message || res});
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey(`void_order`, false);
                        },200);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey(`void_order`, false);
                    },200);
                });
            },
            selectCheck(data){
                this.select = clone(data);
            }
        },
        computed: {
            canVoid(){
                return this.select.length <= 0 || this.searchData.status !== 1;
            },
            canPut(){
                return this.select.length <= 0 || this.searchData.status == 5 || this.searchData.status == 0;
            },
            forceDis(){
                return this.select.length <= 0 || this.searchData.status !== 3;
            },
        },
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
            requestButton:require('@/global-components/request-button.vue').default,
            labelItem:require('@/components/label-item.vue').default,
        },
    }
</script>
