<template>
    <page class="p-index">
        <!-- 搜索 -->
        <card-search ref="search"
                     :search-data="searchData"
                     :clears="clears"
                     :user-list="userList"
                     @search="search"></card-search>
        <div class="inline date mb-xs mt-xs">
            <el-button tag="ElButton"
                       type="primary"
                       size="mini"
                       style="margin-left: 10px"
                       :disabled="is_publish"
                       @click="submit_published"
            >提交刊登</el-button>
            <el-button tag="ElButton"
                       type="primary"
                       size="mini"
                       :disabled="is_Del"
                       @click="delete_batches "
            >批量删除</el-button>
        </div>
        <!-- 商品列表-->
        <data-table
            :loading="loading"
            :table-data="tableData"
            :first-loading="firstLoading"
            @operateDel="operate_del"></data-table>
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
    import {api_publish_record_list,api_get_shopee_sellers,api_delete_shopee,api_record_publish} from '../../../../api/shopee-publish';
	export default{
        permission: {
            url_mymall_listing_publish: '',
            url_mymall_listing_delrecord: '',
        },
		data(){
			return {
                searchData:{
                    account_id:"",
                    create_id:"",
                    publish_status:"",
                    start_time:"",
                    end_time:"",
                    snType:"spu",
                    nContent:"",
                    application:1
                },
                clears:{
                    snType:"spu",
                },
                userList:[],
                loading:false,
                firstLoading: true,
                tableData:[],
                total:0,
                page:1,
                pageSize:50,
            }
		},
        created(){
            this.get_seller();
        },
        refresh(){
            this.init();
        },
        methods:{
            search(){
                this.init();
            },
            init(){
            	let shopeeData = window.clone(this.searchData);
                shopeeData.page = this.page;
                shopeeData.pageSize = this.pageSize;
                this.loading = true;
            	this.$http(api_publish_record_list,shopeeData).then(res=>{
                    res.data.forEach(row => {
                        row.num = "";
                        row.show = false;
                        row.isCheck = false;
                        row.heighLight = false;
                        row.base_url = res.base_url;
                        // row.images = JSON.parse(row.images);
                    });
            		this.tableData = res.data;
                    this.loading = false;
                    this.firstLoading = false;
                    this.total = res.total;
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                })
            },
            get_seller(){
                this.$http(api_get_shopee_sellers).then(res=>{
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
            submit_published(){//----------提交刊登
                let data = this.tableData.filter(row=>row.publish_status<1&&row.isCheck)
                let obj = {
                	id:data.map(row=>row.id).join(','),
                }
                this.$confirm(`您将要对已选Listing进行刊登, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_record_publish,obj).then(res=>{
                        this.$message({
                            type:"success",
                            message:res.message||res
                        });
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });

            },
            delete_batches(){//----------批量删除
                let data = this.tableData.filter(row=>row.publish_status===-1&&row.isCheck);
                let obj = {
                    ids:data.map(row=>row.id).join(","),
                };
                this.$confirm(`您将要对已选Listing记录执行批量删除, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.operate_del(data,obj);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            operate_del(data,obj){
                this.$http(api_delete_shopee,obj).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message||res
                    });
                    if(data instanceof Array){
                        data.forEach(row=>{
                            let index=this.tableData.findIndex(res => {
                                return res.id===row.id;
                            });
                            this.tableData.splice(index,1);
                            this.total-=1;
                        })
                    }else if(data instanceof Object){
                        let deList = this.tableData.findIndex(row=>{
                            return row.id === data.id
                        });
                        this.tableData.splice(deList,1);
                        this.total -= 1;
                    }
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
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
        computed:{
            is_publish(){
                return !this.tableData.find(row=>row.isCheck&&row.publish_status<1)
            },
            is_Del(){
                return !this.tableData.find(row=>row.isCheck&&row.publish_status===-1)
            }
        },
		components: {
            cardSearch:require('./card-search.vue').default,
            dataTable:require('./data-table.vue').default
        }
	}
</script>
