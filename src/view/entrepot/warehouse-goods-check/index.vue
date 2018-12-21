<template>
    <page>
        <search-module @init-data="init_data"
                       ref="search_module">
        </search-module>
        <el-button type="primary"
                   size="mini"
                   @click="add"
                   style="margin-top: 5px"
                   class="ml-sm">添加盘点单
        </el-button>
        <table-module :search-data="searchData"
                      @look="look"
                      @edit="edit"
                      @finish="finish"
                      @print="print"
                      :new-item="newItem"
                      style="margin-top: 5px"
                      ref="table_module">
        </table-module>
        <add-list v-model="visible"
                  :action="action"
                  :add-list="addList"
                  @new-data="newData"
                  @add-allocation="addAllocation"
                  ref="add_list"
                  :warehouse="warehouse">
        </add-list>
        <add-allocation v-model="addVisible"
                        :add-action="addAction"
                        :edit-list="editList"
                        ref="add_allocation"
                        @add-goods="addGoods"
                        @add-allocation="addAllocation"
                        @delete-table="delete_table"
                        :warehouse="warehouse"
                        :table-data="tableData">
        </add-allocation>
        <edit-check-orders v-model="editVisible"
                           ref="check_orders"
                           :add-action="addAction"
                           @add-goods="addGoods"
                           @edit-goods="editGoods"
                           :warehouse="warehouse">
        </edit-check-orders>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_warehouse_get, api_get_detail} from '@/api/warehouse-goods-check'
    export default {
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'刘志勇',
                createTime:'2017-12-04',
                updateTime:'2017-12-13'
            },
        },
        refresh(){
            this.$refs.search_module.init();
        },
        data(){
            return {
                searchData:{},
                tableData:[],
                visible:false,
                action:{},
                addVisible:false,
                addAction:{},
                warehouse:[],
                addList:[],
                editList:[],
                newItem:{},
                editVisible:false
            }
        },
        mounted(){
            this.init_warehouse();
        },
        methods: {
            init_data(searchData){
                this.searchData = searchData;
                this.$nextTick(()=>{
                    this.$refs.table_module.init();
                });
            },
            init_warehouse(){
                this.$http(api_warehouse_get).then(res=>{
                    this.warehouse = res;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            add(){
                this.action = {title:'添加盘点单', value:'add'};
                this.$refs.add_list.addData.warehouse_id = this.searchData.warehouse_id;
                this.visible = true;
            },
            look(row){
                this.addAction = {title:`查看盘点单${row.id}`, value:'look'};
                this.$refs.add_allocation.searchData.warehouse_id = this.searchData.warehouse_id;
                this.$http(api_get_detail, row.id).then(res=>{
                    this.tableData = res;
                    this.addVisible = true;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            },
            edit(row){
                this.addAction = {title:`编辑盘点单${row.id}`, value:'edit'};
                this.$refs.add_allocation.searchData.warehouse_id = this.searchData.warehouse_id;
                this.$http(api_get_detail, row.id).then(res=>{
                    this.tableData = res;
                    this.tableData.details = this.tableData.details.map(row=>{
                        if(!row.remark){
                            row.remark = '';
                        }
                        return row;
                    });
                    this.addVisible = true;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            },
            finish(row){
                this.addAction = {title:`完成盘点单${row.id}`, value:'finish'};
                this.$refs.add_allocation.searchData.warehouse_id = this.searchData.warehouse_id;
                this.$http(api_get_detail, row.id).then(res=>{
                    this.tableData = res;
                    this.addVisible = true;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            },
            addAllocation(val){
                this.addAction = {title:'添加货位', value:val};
                this.$refs.check_orders.searchData.warehouse_id = this.searchData.warehouse_id;
                this.editVisible = true;
            },
            addGoods(data){
                this.addList = data;
            },
            editGoods(data){
                this.editList = data;
            },
            newData(data){
                this.newItem = data;
            },
            delete_table(id){
                if(this.searchData.status !== ''){
                    let index = this.$refs.table_module.tableData.findIndex(row=>{
                        return row.id === id;
                    });
                    if(index !== -1){
                        this.$refs.table_module.tableData.splice(index, 1);
                    }
                } else {
                    this.$refs.table_module.init();
                }
            },
            print(row){
                this.addAction = {title:`打印盘点单${row.id}`, value:'print'};
                this.$refs.add_allocation.searchData.warehouse_id = this.searchData.warehouse_id;
                this.$http(api_get_detail, row.id).then(res=>{
                    this.tableData = res;
                    this.addVisible = true;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            }
        },
        computed: {},
        watch: {},
        props: {},
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
            addList:require('./add-list.vue').default,
            addAllocation:require('./add-allocation.vue').default,
            editCheckOrders:require('./edit-check-orders.vue').default
        },
    }
</script>
