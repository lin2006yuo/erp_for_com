<template>
    <page>
        <search-module @init-data="init_data"
                       v-model="warehouse_id"
                       :shipper-list="shipperList"
                       ref="search_module">
        </search-module>
        <table-module :search-data="searchData"
                      :shipper-list="shipperList"
                      class="mt-xs"
                      ref="table_module">
        </table-module>
    </page>
</template>
<style lang="stylus">

</style>
<script>

    import {
        api_warehouse_staffs
    } from '@/api/warehouse-cargo';
    export default {
        page:{},
        refresh(){
            this.$refs.search_module.init();
        },
        data(){
            return {
                searchData:{},
                tableData:[],
                visible:false,
                warehouse_id: 2,
                shipperList: []
            }
        },
        mounted(){
            if(window.objlength(this.$page.param)!==0){
                this.$refs.search_module.searchData.picking = this.$page.param.id;
                this.$refs.search_module.init();
            }
            this.init_staffs()
        },
        methods: {
            init_staffs() {
                this.$http(api_warehouse_staffs).then(res => {
                    this.shipperList = res.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    });
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },

            init_data(searchData){
                this.searchData = Object.assign({}, searchData, {warehouse_id: this.warehouse_id});
                this.$nextTick(()=>{
                    this.$refs.table_module.init();
                });
            }
        },
        computed: {},
        watch: {
            '$page.param'(val){
                if(window.objlength(val)!==0){
                    this.$refs.search_module.searchData.picking = val.id;
                    this.$refs.search_module.init();
                }
            },
            warehouse_id(val) {
                this.$set(this.searchData, 'warehouse_id', val);
            }
        },
        props: {},
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
        },
    }
</script>
