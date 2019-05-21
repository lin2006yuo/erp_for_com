<template>
    <page>
        <search-module @init-data="init_data"
                       ref="search_module">
        </search-module>
        <table-module :search-data="searchData"
                      class="mt-xs"
                      :printer.sync="printer"
                      @print="print"
                      ref="table_module">
        </table-module>
        <print-dialog v-model="printShow" :printer="printer" :print-data="printData"></print-dialog>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    export default {
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'詹熏欣',
                createTime:'2017-11-27',
                updateTime:'2017-11-30'
            },
        },
        refresh(){
            this.$refs.search_module.init();
        },
        data(){
            return {
                searchData: {},
                printShow:false,
                printData:{},
                printer:''
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
            print(printData){
                this.printData = printData;
                this.printShow = true;
            }
        },
        computed: {},
        watch: {},
        props: {},
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
            printDialog:require('../weighing-packages/collection-print-dialog').default
        },
    }
</script>
