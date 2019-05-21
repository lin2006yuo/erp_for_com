<template>
    <page>
        <card-search :search-data="searchData" @search="search"></card-search>
        <div class="action mt-sm mb-sm ml-sm" >
            <el-button type="primary" size='mini' @click="addWE">添加WE设置模板</el-button>
            <el-button type="primary" @click="del" size="mini">批量删除</el-button>
        </div>
        <data-table :loading="loading" :fisrt-time="firstTime" :table-data="tableData" @selection-change="selection_change" @edit="edit" @delet="delet" @sort-change="sort_change"></data-table>
        <add-model v-model="weDialog" :search-data="addSearch" @add_model="add_model"></add-model>
        <edit-model v-model="edit_show" :search-data="dataSearch" @search="search" ></edit-model>
        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </page>
</template>

<script>
    import {api_add_template,api_get_express_list,api_wish_express_detail,api_del_batch} from '../../../../api/wish-publish';
    export default {
        data() {
            return {
                edit_show:false,
                weDialog:false,
                searchData: {
                    transport_property:'',
                    from_price:'',
                    to_price:'',
                    creator_name:'',
                    page: 1,
                    pageSize: 50,
                },
                dataSearch:{
                    name:'',
                    transport_property:'',
                    from_price:'',
                    to_price:'',
                },
                addSearch:{
                    name:'',
                    transport_property:[],
                    from_price:'',
                    to_price:'',
                },
                tableData:{
                    totalSize: 0,
                    lists: [],
                    page: 1,
                    pageSize: 50,
                    total:0,
                },
                order_type:'',
                order_sort:'',
                loading: false,
                firstTime: true,
                tableList:[],
                total: 0,
            }
        },
        mounted(){
            this.init()
        },
        methods: {
            add_model(){
                this.search();
            },
            delet(val){
                let titel = val.name;
                 this.$confirm(`你将删除:${titel},确认此操作吗？`,'提示',{
                     confirmButtonText:'确定',
                     cancelButtonText:'取消',
                     type:'warning'
                 }).then(()=>{
                     this.$http(api_del_batch,{id:val.id}).then(res=>{
                         this.search();
                         this.$message({
                             type: 'success',
                             message:res.message || res
                         });
                     }).catch(err=>{
                         console.log(err)
                     })
                 }).catch(()=>{
                     this.$message({
                         type: 'info',
                         message: '已取消删除'
                     });
                 })
            },
            edit(val){
                let id = val.id;
                this.$http(api_wish_express_detail,{id:id}).then(res=>{
                    this.dataSearch = res;
                    this.dataSearch.transport_property = this.dataSearch.transport_property.split("、");
                    this.$nextTick(()=>{
                        this.edit_show = true;
                    })
                }).catch(err=>{
                    console.log(err)
                });
            },
            search(){
                this.init()
            },
            selection_change(val){
                this.tableList=val
            },
            del(){
                if(this.tableList.length===0){
                    this.$message('请选择选项')
                }else {
                    let ids = [];
                    this.tableList = this.tableList.forEach(row=>{
                        ids.push(row.id)
                    });
                    let reqId = ids.join(',');
                    this.$http(api_del_batch,{id:reqId}).then(res=>{
                        this.$message({type:"success",message:res ||res.message,duration:1500});
                        this.init()
                    }).catch(err=>{
                        console.log(err)
                    })
                }
            },
            addWE() {
                this.weDialog=true;
            },
            sort_change(column) {
                if (column.column instanceof Object) {
                    let sort_label = column.column.label;
                    switch (sort_label) {
                        case "添加时间":
                            this.order_type = "create_at";
                            break;
                    }
                    this.order_sort = column.order === "descending" ? "desc" : "asc";
                    this.init();
                }
            },
            init_params(){
                let data = window.clone(this.searchData);
                this.order_type&&(data.order_type=this.order_type);
                this.order_sort&&(data.order_sort=this.order_sort);
                return data
            },
            init() {
                let data = this.init_params();
                this.loading = true;
                this.$http(api_get_express_list,data).then(res=>{
                    this.tableData.lists = res.data;
                    this.tableData.page=res.page;
                    this.tableData.pageSize=res.pageSize;
                    this.tableData.total=this.tableData.lists.length;
                    this.total = res.count;
                    this.loading=false;
                    this.firstTime=false;
                }).catch(err=>{
                    console.log(err)
                })
            },
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init()
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init()
            },
        },
        components:{
            addModel:require('./add-model').default,
            cardSearch:require('./card-search').default,
            dataTable:require('./table-data').default,
            editModel:require('./edit').default,
        }
    }
</script>

<style scoped>

</style>