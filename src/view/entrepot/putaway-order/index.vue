<template>
    <page>
        <div>
            <label-item label="请选择仓库：" class="mb-sm mt-sm">
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
                       :area-list="areaList"
                       :search-data="searchData"
                       :clears="clears"
                       ref="search_module">
        </search-module>
        <table-module :search-data="searchData"
                      :table-data="tableData"
                      :loading="loading"
                      :total="total"
                      :first-loading="firstLoading"
                      @look="look"
                      @handle-size-change="handle_size_change"
                      @handle-current-change="handle_current_change"
                      class="mt-sm"
                      ref="table_module">
        </table-module>
        <look v-model="visible" :action="action" :look-data="lookData"></look>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_look_putaway, api_get_putaway, api_get_type} from '@/api/putaway-order';
    import {api_get_warehouse_default} from "@/api/default-warehouse-show";
    export default {
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'刘志勇',
                createTime:'2017-11-23',
                updateTime:'2017-11-23'
            },
        },
        refresh(){
            this.init()
        },
        data(){
            return {
                warehouse_id: '',
                searchData:{
                    id:'',
                    status:'',
                    batch_id:'',
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
                tableData:[],
                visible:false,
                action:{},
                lookData:{},
                loading: false,
                firstLoading: true,
                total: 0,
                areaList:[],
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
                this.$http(api_get_putaway, data).then(res=>{
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
                    this.warehouses = [...res.map(item => {
                        return {label: item.name, value: item.id};
                    })];
                    this.warehouse_id = this.warehouses[0].value
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
            change_status(select, item){
                this.searchData.status = item.value;
                if(!this.firstLoading){
                    this.init();
                }
            },
            change_depot(){
                this.init();
            },
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
            async look(row){
                try {
                    this.action.title = `查看上架单${row.id}`;
                    this.lookData = await this.$http(api_look_putaway, row.id);
                } catch(code){
                    this.$message({type:"error",message:code.message || code});
                } finally {
                    this.visible = true;
                }

            }
        },
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
            look:require('./look.vue').default,
            labelItem:require('@/components/label-item.vue').default
        },
    }
</script>
