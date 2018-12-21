<template>
    <page>
        <el-col :span="12">
            <left-div @init-data="init_data"
                       ref="left">
            </left-div>
        </el-col>
        <el-col :span="12">
            <table-module :search-data="searchData"
                          @warning-tip="warningTip"
                          @search="search"
                          @search-error="searchError"
                          class="ml-sm"
                          ref="table_module">
            </table-module>
        </el-col>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_save_shelves} from '../../../api/return-shelves'
    export default {
        activated(){//当切换到当前页面时触发这个回调。
            this.$refs.left.$refs.search_module.select();
        },
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'刘志勇',
                createTime:'2018-02-26',
                updateTime:'2018-02-26'
            },
        },
        refresh(){
//            this.$refs.search_module.init();  此操作报错
        },
        data(){
            return {
                searchData:{},
            }
        },
        mounted(){
        },
        methods: {
            init_data(searchData){
                this.searchData = window.clone(searchData);
                this.$nextTick(()=>{
                    this.$refs.table_module.init();
                })
            },
            warningTip(text, type){
                this.$refs.left.warning.type = type;
                if(type === 1){
                    this.$refs.left.warning.message = `请放到 <span class="prompt">${text}</span> 号周转篮`
                } else {
                    this.$refs.left.warning.message = text;
                }
                let data = {message: `扫描：${this.searchData.search_sku}，${text}号周转篮`};
                this.$refs.left.$refs.right_div.tableData.unshift(data);
            },
            search(searchData){
                this.$refs.left.search(searchData);
            },
            searchError(){
                this.$refs.left.searchError();
            },
        },
        computed: {},
        watch: {},
        props: {},
        components: {
            leftDiv:require('./left-div.vue').default,
            tableModule:require('./table-module.vue').default,
        },
    }
</script>
