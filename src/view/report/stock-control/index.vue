<template>
    <page>
        <search-module @init-data="init_data" ref="search_module"></search-module>
        <request-button class="mt-xs mb-xs ml-sm"
                   :request="exports">批量导出</request-button>
        <table-module :search-data="searchData"
                      ref="table_module"
                      @exports-result="exports_result">
        </table-module>
        <export-dialog v-model="visible"></export-dialog>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    export default {
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'赖永凤',
                createTime:'2017-9-2',
                updateTime:'2017-10-25'
            }
        },
        refresh(){
            this.$refs.search_module.init();
        },
        data(){
            return {
                tableData:[],
                searchData:{},
                visible:false
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
            exports(){
                this.$refs.table_module.exports();
            },
            exports_result(flag){
                this.visible = flag;
            }
        },
        computed: {},
        watch: {},
        props: {},
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
            exportDialog:require('../export-dialog.vue').default,
            requestButton:require('../../../global-components/request-button.vue').default,
        },
    }
</script>
