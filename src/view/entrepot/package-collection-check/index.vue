<template>
    <page>
        <search-module @init-data="init_data"
                       ref="search_module">
        </search-module>
        <table-module :search-data="searchData"
                      class="mt-xs"
                      @update-focus="update_focus"
                      @warning="warning"
                      ref="table_module">
        </table-module>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    export default {
        activated(){//当切换到当前页面时触发这个回调。
            this.$refs.search_module.$refs.code.$refs.input.select();
        },
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'詹熏欣',
                createTime:'2017-11-27',
                updateTime:'2017-11-30'
            },
        },
        data(){
            return {
                searchData:{},
                tableData:[],
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
            warning(code){
                this.$refs.search_module.$refs.code.$refs.input.select();
                this.$refs.search_module.searchData.warningText = code;
            },
            update_focus(){
                this.$refs.search_module.$refs.code.$refs.input.select();
            }
        },
        computed: {},
        watch: {},
        props: {},
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default
        },
    }
</script>
