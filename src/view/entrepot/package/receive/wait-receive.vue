<template>
    <div>
        <search-module @init-data="init_data"
                       ref="search_module"></search-module>
        <table-module :search-data="searchData"
                      class="mt-sm"
                      @search-id="search_id"
                      ref="table_module">
        </table-module>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default {
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
