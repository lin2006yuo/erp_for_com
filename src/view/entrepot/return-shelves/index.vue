<template>
    <page>
        <search-module @init-data="init_data"
                       ref="search_module">
        </search-module>
        <div class="mt-xs ml-sm">
            <request-button :disabled="canVoid"
                            req-key="void_order"
                       @click="void_order">作废
            </request-button>
            <request-button class="ml-sm"
                       :disabled="canPut"
                            req-key="return_shelves_putaway"
                       @click="putaway">完成上架
            </request-button>
            <request-button class="ml-sm"
                            :disabled="forceDis"
                            req-key="return_shelves_force"
                            @click="forceDone">强制完成
            </request-button>
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
    import {api_patch_shelves, api_delete_shelves,api_return_shelves_force} from '../../../api/return-shelves'
    export default {
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'刘志勇',
                createTime:'2018-02-27',
                updateTime:'2018-02-27'
            },
        },
        refresh(){
            this.$refs.search_module.init();
        },
        data(){
            return {
                searchData:{},
                select:[],
            }
        },
        mounted(){
        },
        methods: {
            init_data(searchData){
                this.searchData = window.clone(searchData);
                if (searchData.create_time_from) {
                    this.searchData.create_time_from = datef("YYYY-MM-dd",this.searchData.create_time_from/1000);
                }else {
                    this.searchData.create_time_from="";
                }
                if (searchData.create_time_to) {
                    this.searchData.create_time_to = datef("YYYY-MM-dd",this.searchData.create_time_to/1000);
                }else {
                    this.searchData.create_time_to="";
                }
                this.$nextTick(()=>{
                    this.$refs.table_module.init();
                });
            },
            forceDone(){//强制完成 /return-shelves/force
                let ids = this.select.map(row=>{
                    return row.id;
                });
                this.$confirm(`您将完成上架这${this.select.length}个上架单,确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_return_shelves_force, {ids:ids}).then(res=>{
                        this.select = [];
                        this.$refs.search_module.init();
                        this.$message({type:"success",message:res.message||res});
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey(`return_shelves_force`, false);
                    },200);
                });
            },
            putaway(){
                let ids = this.select.map(row=>{
                    return row.id;
                });
                this.$confirm(`您将完成上架这${this.select.length}个上架单,确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_patch_shelves, {ids:ids}).then(res=>{
                        this.select = [];
                        this.$refs.search_module.init();
                        this.$message({type:"success",message:res.message||res});
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey(`return_shelves_putaway`, false);
                    },200);
                });
            },
            void_order(){
                let ids = this.select.map(row=>{
                    return row.id;
                });
                this.$confirm(`您将作废这${this.select.length}个上架单,确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_shelves, {ids:ids}).then(res=>{
                        this.select = [];
                        this.$refs.search_module.init();
                        this.$message({type:"success",message:res.message || res});
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey(`void_order`, false);
                        },200);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey(`void_order`, false);
                    },200);
                });
            },
            selectCheck(data){
                this.select = clone(data);
            }
        },
        computed: {
            canVoid(){
                return this.select.length <= 0 || this.searchData.status !== 1;
            },
            canPut(){
                return this.select.length <= 0 || this.searchData.status == 5 || this.searchData.status == 0;
            },
            forceDis(){
                return this.select.length <= 0 || this.searchData.status !== 3;
            },
        },
        watch: {},
        props: {},
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
            requestButton:require('../../../global-components/request-button.vue').default,
        },
    }
</script>
