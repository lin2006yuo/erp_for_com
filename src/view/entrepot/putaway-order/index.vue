<template>
    <page>
        <search-module @init-data="init_data"
                       ref="search_module">
        </search-module>
        <table-module :search-data="searchData"
                      @look="look"
                      class="mt-sm"
                      ref="table_module">
        </table-module>
        <look v-model="visible" :action="action" :look-data="lookData"></look>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_look_putaway} from '@/api/putaway-order'
    export default {
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'刘志勇',
                createTime:'2017-11-23',
                updateTime:'2017-11-23'
            },
        },
        refresh(){
            this.$refs.search_module.init();
        },
        data(){
            return {
                searchData:{},
                tableData:[],
                visible:false,
                action:{},
                lookData:{}
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
            async look(row){
                try {
                    this.action.title = `查看上架单${row.id}`;
                    this.lookData = await this.$http(api_look_putaway, row.id);
                } catch(code){
                    this.$message({type:"error",message:code.message || code});
                } finally {
                    this.visible = true;
                }

            }
        },
        computed: {},
        watch: {},
        props: {},
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
            look:require('./look.vue').default
        },
    }
</script>
