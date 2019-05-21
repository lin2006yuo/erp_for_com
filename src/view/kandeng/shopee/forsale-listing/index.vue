<template>
    <page class="p-index">
        <card-search
            ref="search"
            :forsale-list="forsaleList"
            @search="search"></card-search>
        <data-table
            :loading="loading"
            @refresh="sort_refresh"
            :table-data="tableData"
            :first-loading="firstLoading"></data-table>
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
    import  {api_on_selling_list,} from "../../../../api/shopee-publish"
	export default{
		data(){
			return {
                forsaleList:{
                    order_by:'',
                    order:'',
                    snType:"spu",
                    nContent:"",
                    account_id:"",
                    start_time:"",
                    end_time:"",
                    create_id:"",
                    spu_status:'',
                    application:'',
                    status:1
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
            sort_refresh(val){
                this.forsaleList.order_by=val.order_type;
                this.forsaleList.order=val.order;
                this.init();
            },
            search(){
                this.init();
            },
            init(){
            	let selData = window.clone(this.forsaleList);
                selData.start_time = this.forsaleList.start_time?datef("YYYY-MM-dd",this.forsaleList.start_time/1000):'';
                selData.end_time = this.forsaleList.end_time?datef("YYYY-MM-dd",this.forsaleList.end_time/1000):'';
                selData.page = this.page;
                selData.pageSize = this.pageSize;
                this.loading = true;
             	this.$http(api_on_selling_list,selData).then(res=>{
                    res.data.forEach(row => {
                        row.num = "";
                        row.show = false;
                        row.isCheck = false;
                        row.heighLight = false;
                    });
             		this.tableData = res.data;
                    this.loading = false;
                    this.total = res.total;
                    this.firstLoading = false
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
