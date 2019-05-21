<template>
    <page class="p-index">
        <card-search
            ref="search"
            :forsale-list="forsaleList"
            @search="search"></card-search>
        <data-table
            :loading="loading"
            :table-data="tableData"
            :first-loading="firstLoading"
            class="mt-xs"></data-table>
        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[20, 50, 100, 200,500]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import  {api_stop_setting,} from "../../../../api/shopee-publish"
    export default{
        data(){
            return {
                forsaleList:{
                    snType:"spu",
                    nContent:"",
                    account_id:"",
                    start_time:"",
                    end_time:"",
                    create_id:"",
                    spu_status:'',
                    application:'',
                    status:2
                },
                loading:false,
                firstLoading: true,
                tableData:[],
                page:1,
                pageSize:50,
                total:0,
            }
        },
        refresh(){
            this.init();
        },
        methods:{
            search(){
                this.init();
            },
            init(){
                let selData = window.clone(this.forsaleList);
                selData.page = this.page;
                selData.pageSize = this.pageSize;
                this.loading = true;
                this.$http(api_stop_setting,selData).then(res=>{
                    res.data.forEach(row => {
                        row.num = "";
                        row.show = false;
                        row.isCheck = false;
                        row.heighLight = false;
                    });
                    this.tableData = res.data;
                    this.loading = false;
                    this.firstLoading = false;
                    this.total = res.total;
                    console.log(res);
                })
            },
            handleSizeChange(size){
                this.pageSize=size;
                this.init();
            },
            handleCurrentChange(page){
                this.page=page;
                this.init();
            },

        },
        components: {
            cardSearch: require('./card-search.vue').default,
            dataTable:require('./data-table.vue').default,
        }
    }
</script>
