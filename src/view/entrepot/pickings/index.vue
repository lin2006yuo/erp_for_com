<template>
    <page>
        <search-module @init-data="init_data"
                       v-model="warehouse_id"
                       ref="search_module">
        </search-module>
        <table-module :search-data="searchData"
                      class="mt-xs"
                      ref="table_module">
        </table-module>
    </page>
</template>
<style lang="stylus">

</style>
<script>

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
            }
        },
        mounted(){
            if(window.objlength(this.param)!==0){
                this.$refs.search_module.searchData.picking = this.param.id;
                this.$refs.search_module.init();
            }
        },
        methods: {
            init_data(searchData){
                this.searchData = Object.assign({}, searchData, {warehouse_id: this.warehouse_id});
                this.$nextTick(()=>{
                    this.$refs.table_module.init();
                });
            }
        },
        computed: {},
        watch: {
            param(val){
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
