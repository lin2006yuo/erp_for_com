<template>
  <page class="mymall-saleOut">
    <search ref="search"
            :param-list="paramList"
            :user-list="userList"
            @search="search"></search>
    <tabel-module
            :loading="loading"
            :firstLoading="firstLoading"
            :tableData="tableData"
            :checkAll="checkAll"
            @head-check="head_check"
            @sort-click="sort_click"
    >
    </tabel-module>
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
    import  {api_get_sellers,api_publish_sold_out} from "@/api/mymall"
    export default {
        data(){
            return{
                paramList:{
                    nType:"spu",
                    nContent:"",
                    account_id:"",
                    start_time:"",
                    end_time:"",
                    create_id:"",
                    field:'',
                    order:'',
                    review_status:"",
                    spu_status:'',
                    application:'',
                },
                userList:[],
                firstLoading:true,
                searchData:{
                    nType:"spu",
                    nContent:"",
                    account_id:"",
                    start_time:"",
                    end_time:"",
                    create_id:"",
                    field:'',
                    order:'',
                    review_status:"",
                    spu_status:'',
                    application:'',
                },
                enabled:0,
                page:1,
                pageSize:50,
                total:0,
                checkAll:false,
                tableData:[],
                loading:false,
            }
        },
        created(){
            this.get_seller();
        },
        methods:{
            init(){
                let curObj = sessionStorage.getItem("mymallSearchData");
                if(!curObj)return;
                let curData = JSON.parse(curObj);
                let data = window.clone(this.paramList);
                Object.assign(data,curData);
                data.page = this.page;
                data.pageSize = this.pageSize;
                data.enabled = this.enabled;
                if(data.end_time) {
                    data.end_time = datef("YYYY-MM-dd",data.end_time/1000)
                }else {
                    data.end_time="";
                }
                if(data.start_time) {
                    data.start_time = datef("YYYY-MM-dd",data.start_time/1000)
                }else {
                    data.start_time="";
                }
                Object.assign(data,this.order,{enabled:0,publish_status:1,nTime:'date_uploaded'});
                this.loading = true;
                this.$http(api_publish_sold_out,data).then(res=>{
                    res.data.forEach(row => {
                        row.num = "";
                        row.show = false;
                        row.isCheck = false;
                        row.heighLight = false;
                        this.$set(row,"varians",[]);
                    });
                    this.baseUrl = res.base_url;
                    this.tableData = res.data;
                    this.total = res.total;
                    this.loading = false;
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                })
            },
            search(data){
                console.log('search')
                this.firstLoading = false;
                if(data.end_time instanceof Object){
                    data.end_time= data.end_time.getTime();
                }
                if(data.start_time instanceof Object){
                    data.start_time= data.start_time.getTime();
                }
                this.searchData = data;
                let curData = JSON.stringify(data);
                sessionStorage.setItem('mymallSearchData',curData);
                this.init();
            },
            head_check(val){
                this.tableData.forEach(row=>{
                    row.isCheck=val;
                });
            },
            // 排序
            sort_click(val){
                this.paramList.field = val.order;
                this.paramList.order = val.order_type;
                let curData = JSON.stringify(this.paramList);
                sessionStorage.setItem('mymallSearchData',curData);
                this.init();
            },
            get_seller(){
                this.$http(api_get_sellers).then(res=>{
                    this.userList=res.map(row=>{
                        return {
                            label:row.realname,
                            value:row.id,
                        }
                    });
                }).catch(code => {
                    this.$message({type:"error",code:code.message||code})
                });
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
        components:{
            search: require('./salesOut-search').default,
            tabelModule: require('./salesOut-tabel-module').default,
        }
    }
</script>


