<template>
    <page>
        <search-card @search="search" :params="search_data" :clears="clears">
            <manage-search v-model="search_data"></manage-search>
        </search-card>
        <manage-table :tableData="tableData.data" :search_data="search_data" @sort-click="sort_click"></manage-table>
        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="Number(tableData.page)"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="Number(tableData.pageSize)"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.count">
        </el-pagination>
    </page>
</template>
<style lang="stylus" scoped>

</style>
<script>

    import  {api_aliexpress_account_health} from '@/api/monitor-manage'
    export default {
        name: "",
        data() {
            return {
                total:1,
                search_data:{
                    page:1,
                    pageSize:20,
                    account_id:'',//aliexpress帐号ID
                    health_status:'',//状态
                    site_code:'',
                    time_start:'',//开始时间
                    time_end:'',//结束时间
                    sort_type: '',
                    sort_field: ''
                },
                clears:{
                    page:1,
                    pageSize:20,
                    account_id:'',//aliexpress帐号ID
                    health_status:'',//状态
                    site_code:'',
                    time_start:'',//开始时间
                    time_end:'',//结束时间
                    sort_type: '',
                    sort_field: ''
                },
                tableData:[],
            }
        },
        computed: {},
        filters: {},
        mounted() {
            this.init();
        },
        methods: {
            init(){
                this.$http(api_aliexpress_account_health,this.search_data).then(res=>{
                    this.tableData = res;
                })
            },
            search(){//搜索
                this.init();
            },
            handle_size_change(val){//切换条数
                this.search_data.pageSize = val;
                this.init();
            },
            handle_current_change(val){//切换页数
                this.search_data.page = val;
                this.init();
            },
            sort_click(val){
                this.search_data.sort_field = val.prop;
                this.search_data.sort_type = val.order==='ascending'?'asc':'desc'
                this.init();
            },
        },
        watch: {},
        props: {},
        components: {
            searchCard:require('@/components/search-card.vue').default,
            manageSearch:require('./manage-search.vue').default,
            manageTable:require('./manage-table.vue').default,
        }
    }
</script>
