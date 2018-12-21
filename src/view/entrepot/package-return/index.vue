<template>
    <page>
        <search-module @init-data="init_data"
                       ref="search_module">
        </search-module>
        <table-module :search-data="searchData"
                      @mark-warehouse="markWarehouse"
                      class="mt-xs"
                      ref="table_module">
        </table-module>
        <add-storage-order v-model="storageVisible"
                           :search-data="searchData"
                           :storage-data="storageData"
                           :storage-action="storageAction"
                           @delete-table="delete_table"
                           @init-data="init_data">
        </add-storage-order>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_info} from '@/api/package-return'
    export default {
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'张文宇',
                createTime:'2017-12-04',
                updateTime:'2017-12-04'
            },
        },
        refresh(){
            this.$refs.search_module.init();
        },
        data(){
            return {
                searchData: {},
                storageVisible:false,
                storageData:{},
                storageAction:{},
                select:[]
            }
        },
        mounted(){

        },
        methods: {
            init_data(searchData){
                this.searchData = searchData;
                this.$nextTick(()=>{
                    this.$refs.table_module.init();
                });
            },
            markWarehouse(row){
                this.storageAction = {
                    mean:'入',
                    title:'生成入库单号',
                    id:row.id
                };
                this.$http(api_get_info, row.id).then(res=>{
                    res.detail = res.detail.map(row=>{
                        this.$set(row, 'quantity', row.sku_quantity);
                        return row;
                    });
                    this.storageData = {
                        warehouse_id:this.searchData.warehouse_id,
                        warehouse_type:15,
                        package_return_number:row.package_return_number,
                        details:res.detail,
                        remark:''
                    };
                    this.storageVisible = true;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            },
            delete_table(id){
                console.log(id);
                let index = this.$refs.table_module.tableData.findIndex(row=>{
                    return row.id === id;
                });
                if(index !== -1){
                    this.$refs.table_module.tableData.splice(index, 1);
                }
            }
        },
        computed: {},
        watch: {},
        props: {},
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
            addStorageOrder:require('./add-storage-order').default
        },
    }
</script>
