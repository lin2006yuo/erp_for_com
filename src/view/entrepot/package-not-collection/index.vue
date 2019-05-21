<template>
    <page>
        <search-module @init="init_data" ref="search_module"></search-module>
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
        page(){},
        refresh(){
            this.$refs.search_module.init();
        },
        data() {
            return {
                searchData:{}
            }
        },
        methods: {
            init_data(searchData){
                this.searchData = searchData;
                this.$nextTick(()=>{
                    this.$refs.table_module.init();
                });
            }
        },
        components: {
            searchModule:require('./search-module').default,
            tableModule:require('./table-module').default
        }
    }
</script>
