<template>
    <page>
        <search-module @init-data="init_data" ref="search_module"></search-module>
        <request-button :disabled="hasData"
                   :request="exports"
                   class="mt-xs mb-xs ml-sm">批量导出</request-button>
        <table-module :search-data="searchData"
                      ref="table_module"
                      @can-export="canExport"
                      @exports-result="exports_result">
        </table-module>
        <export-dialog v-model="visible"></export-dialog>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_account_list} from '../../../../api/selling-profit'
    export default {
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'赖永凤',
                createTime:'2017-9-2',
                updateTime:'2017-10-16'
            }
        },
        refresh(){
            this.$refs.search_module.init();
        },
        data(){
            return {
                searchData:{},
                visible:false,
                hasData:true
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
            },
            canExport(flag){
                this.hasData = flag;
            }
        },
        computed: {},
        watch: {},
        props: {},
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
            exportDialog:require('../../export-dialog.vue').default,
            requestButton:require('../../../../global-components/request-button.vue').default,
        },
    }
</script>
