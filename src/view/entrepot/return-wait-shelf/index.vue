<template>
    <page>
        <div class="mb-xs">
            <label-item label="请选择仓库：" class="mt-sm">
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
                       :search-data="searchData"
                       :clears="clears"
                       :area-list="areaList"
                       ref="search_module">
        </search-module>
        <div class="mt-xs ml-sm">
            <request-button :disabled="!selectData.length"
                            req-key="apiAddEdit5"
                            @click="putaway">上架
            </request-button>
            <el-button type="primary"
                       size="mini"
                       :disabled="!selectData.length"
                       @click="print">打印
            </el-button>
        </div>
        <table-module :search-data="searchData"
                      :table-data="tableData"
                      :loading="loading"
                      :total="total"
                      :first-loading="firstLoading"
                      @handle-size-change="handle_size_change"
                      @handle-current-change="handle_current_change"
                      @select-check="selectCheck"
                      class="mt-xs"
                      ref="table_module">
        </table-module>
        <preview v-model="previewVisible" :select-data="selectData" :preview-action="previewAction"></preview>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_reback_shelves, api_change_into_grounding} from '@/api/reback-shelves';
    import {api_get_area} from '@/api/return-shelves';
    import {api_get_warehouse_default} from "@/api/default-warehouse-show";
    export default {
        page:{
            devinfo:{
                frontEnd:'黎宏珍',
                backEnd:'刘志勇',
                createTime:'2017-12-21',
                updateTime:'2017-12-21'
            },
        },
        refresh(){
            this.init()
        },
        data(){
            return {
                firstLoading: true,
                loading: false,
                tableData: [],
                total: 0,
                warehouse_id:'',
                searchData:{
                    sku:'',
                    warehouse_cargo:'',
                    warehouse_area_id:'',
                    date_start:(Date.now() - (15 * 24 * 60 * 60 * 1000)),
                    date_end:Date.now(),
                    page:1,
                    pageSize:20
                },
                clears:{
                    page:1,
                    pageSize:20
                },
                warehouses: [],
                areaList: [],
                select:[],
                previewVisible:false,
                previewAction:{},
                selectData:[]
            }
        },
        mounted(){
            this.init_warehouse();
            this.init_areaList();
        },
        methods: {
            init(){
                this.tableData = [];
                this.loading = true;
                let data = this.init_params();
                this.$http(api_reback_shelves, data).then(res => {
                    res.data.forEach(row => {
                        this.$set(row, 'checked', false);
                        this.$set(row, 'show', false);
                        this.$set(row, 'quantity', Number(row.quantity));
                    });
                    this.tableData = res.data;
                    this.total = res.count;
                    this.firstLoading = false;
                    this.loading = false;
                }).catch(code => {
                    this.loading = false;
                    this.$message({type: "error", message: code.message || code});
                })
            },
            init_params(){
                Object.keys(this.searchData).forEach(key => {
                    if(typeof this.searchData[key] === 'string') {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
                let data = clone(this.searchData);
                if(this.searchData.date_start){
                    data.date_start = datef('YYYY-MM-dd', this.searchData.date_start/1000);
                }else {
                    data.date_start='';
                }
                if(this.searchData.date_end){
                    data.date_end = datef('YYYY-MM-dd', this.searchData.date_end/1000);
                }else {
                    data.date_end='';
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
                    this.warehouse_id = this.warehouses[0].value
                }).catch(code => {
                    this.$message({type:"error",message:code.message || code});
                })
            },
            init_areaList(){
                this.$http(api_get_area, {warehouse_id:this.warehouse_id}).then(res => {
                    this.areaList.push({label:'全部', value:''}, ...res);
                }).catch(code => {
                    this.$message({type:"error",message:code.message || code});
                })
            },
            change_depot(){
                this.init();
            },
            //分页器
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init();
            },
            putaway(){
                let find = this.selectData.find(row=>!row.quantity);
                if(find){
                    this.$message({type:'warning',message:'您选择的上架商品中包含数量为0的情况，上架的数量不能为0，请重新选择！'});
                    setTimeout(()=>{
                        this.$reqKey(`apiAddEdit5`, false);
                    },200);
                    return;
                }else{
                    let select =this.selectData.map(row=>{
                        return {
                            id:row.cargo_goods_id,
                            quantity:row.quantity
                        }
                    });
                    this.$confirm(`您将上架这${select.length}个商品,确认此操作吗？`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$http(api_change_into_grounding, {data:select}).then(res=>{
                            this.$message({type:"success",message:res.message||res});
                            // this.select = [];
                            this.$refs.table_module.delete_goods(res.data);
                        }).catch(code=>{
                            this.$message({type:"error",message:code.message || code});
                        })
                    }).catch(() => {
                        this.$message({type: 'info',message: '已取消'});
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey(`apiAddEdit5`, false);
                        },200);
                    });
                }
            },
            selectCheck(select){
                this.selectData = select;
            },
            print(){
                this.previewVisible = true;
                this.previewAction = {
                    title:'打印'
                }
            }
        },
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
            preview:require('./preview.vue').default,
            requestButton:require('@/global-components/request-button.vue').default,
            labelItem:require('@/components/label-item.vue').default
        },
    }
</script>
