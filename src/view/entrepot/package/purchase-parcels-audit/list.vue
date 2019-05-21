<template>
    <div>
        <search-module @init-data="init_data"
                        ref="search_module">
        </search-module>
        <table-module
            :search-data="searchData"
            class="mt-xs"
            @search-id="search_id"
            ref="table_module">
        </table-module>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    export default {
        refresh(){
            Object.keys(this.searchData).forEach(key=>{
                this.searchData[key] = "";
            });
            this.searchData.warehouse_id = 2;
            this.searchData.page = 1;
            this.searchData.pageSize = 20;
            this.$refs.search_module.init_status_btn();
        },
        data() {
            return {
                searchData:{}
            }
        },
        mounted(){
            this.$refs.search_module.search();
        },
        methods: {
            init_data(searchData){
                this.searchData = searchData;
                this.$nextTick(()=>{
                    this.$refs.table_module.init();
                });
            },
            search_id(row){
                this.$emit('search-id',row);
            }
        },
        watch: {},
        props: {},
        components: {
            searchModule:require('./search-module').default,
            tableModule:require('./table-module').default
        }
    }
</script>
