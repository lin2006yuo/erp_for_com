<template>
    <page>
        <search-module @init-data="init_data"
                       ref="search_module">
        </search-module>
        <div class="mt-xs ml-sm">
            <el-button type="primary"
                       size="mini"
                       :disabled="canPutaway"
                       @click="putaway">上架
            </el-button>
        </div>
        <table-module :search-data="searchData"
                      @select-check="selectCheck"
                      class="mt-xs"
                      ref="table_module">
        </table-module>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_putaway_create} from '../../../api/putaway-waiting-goods'
    export default {
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'刘志勇',
                createTime:'2017-11-30',
                updateTime:'2017-11-30'
            },
        },
        refresh(){
            this.$refs.search_module.init();
        },
        data(){
            return {
                searchData:{},
                select:[],
                disabled_tip:''
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
            putaway(){
                let ids = this.select.map(row=>{
                    return {id:row.id,quantity:row.waiting_quantity};
                });
                this.$confirm(`您将上架这${this.select.length}个商品,确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_putaway_create, {data:ids}).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.select = [];
                        this.$refs.table_module.delete_goods();
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            selectCheck(data){
                this.select = data;
            }
        },
        computed: {
            canPutaway(){
                return this.searchData.status !== 0 || this.select.length === 0
            }
        },
        watch: {},
        props: {},
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
        },
    }
</script>
