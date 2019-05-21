<template>
    <page class='p-index-monitor-wish'>
        <manage-search :search-data="searchData" @search="init"></manage-search>
        <manage-table :table-data="tableData" :loading="loading"  :unit="unit" :search-data="searchData" @sort-click="sort_click"></manage-table>
        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </page>
</template>
<style lang="stylus" scoped>
</style>
<script>
    import  {api_wish_account} from '@/api/monitor-wish'
    export default {
        data() {
            return {
                total:1,
                searchData:{
                    page:1,
                    pageSize:50,
                    health_status:'',
                    account_id:'',
                    time_start:'',
                    time_end:'',
                    sort_field: '',
                    sort_type: ''
                },
                loading:false,
                tableData:[],
                unit:{},
            }
        },
        refresh(){
            this.init();
        },
        created() {
            this.init();
        },
        mounted() {
        },
        computed: {},
        methods: {
            init(){
                this.loading=true;
                let data=window.clone(this.searchData);
                if(this.searchData.time_end){
                    data.time_end = fdatetime(this.searchData.time_end, "YYYY-MM-dd");
                }
                if(this.searchData.time_start){
                    data.time_start = fdatetime(this.searchData.time_start, "YYYY-MM-dd");
                }
                this.$http(api_wish_account,data).then(res=>{
                    this.loading=false;
                    this.total=res.count;
                    this.tableData=res.data;
                    this.unit=res.unit;
                }).catch(code => {
                    this.loading=false
                    this.$message({type:"error",code:code.message||code})
                });
            },
            handle_size_change(val){//切换条数
                this.searchData.pageSize=val;
                this.init()
            },
            handle_current_change(val){//切换页数
                this.searchData.page=val;
                this.init()
            },
            sort_click(val){
                this.searchData.sort_field = val.prop;
                this.searchData.sort_type = val.order==='ascending'?'asc':'desc'
                this.init();
            },
        },
        watch: {},
        filters: {},
        props: {},
        components: {
            manageSearch:require('./manage-search.vue').default,
            manageTable:require('./manage-table.vue').default,
        }
    }
</script>

