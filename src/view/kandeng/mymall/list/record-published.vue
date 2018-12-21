<template>
    <page class="p-kandeng">
        <!-- 搜索 -->
        <search ref="search"
                :param-list="paramList"
                :user-list="userList"
                @search="search"></search>
        <!-- 操作按钮 -->
        <div class="mt-xs mb-xs ml-sm">
            <permission tag="ElButton"
                        type="primary"
                        :disabled="is_publish"
                        @click.native="publish"
                        :route="apis.url_mymall_listing_publish">提交刊登</permission>
            <permission tag="ElButton"
                        type="primary"
                        :disabled="is_Del"
                        @click.native="bantch_del"
                        :route="apis.url_mymall_listing_delrecord">批量删除</permission>
        </div>
        <!-- 商品列表-->
        <data-table
                :loading="loading"
                :tableData="tableData"
                :first-loading="firstLoading"
                @operateDel="operate_del"
        ></data-table>
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
<script>
    import  {api_record_publish_list,api_get_sellers,api_record_del,api_record_publish} from '@/api/mymall'
    export default {
        permission: {
            url_mymall_listing_publish: '',
            url_mymall_listing_delrecord: '',
        },
        data(){
            return {
                page:1,
                pageSize:50,
                total:0,
                baseUrl:'',
                loading:false,
                firstLoading: true,
                paramList:{
                    account_id:"",
                    shop_id:"",
                    create_id:"",
                    publish_status:"",
                    start_time:"",
                    end_time:"",
                    nType:"spu",
                    nContent:"",
                },
                accountList:[],
                userList:[],
                tableData:[],
            }
        },
        created(){
            this.get_seller();
        },
        methods:{
            //提交刊登
            publish(){
                let data = this.tableData.filter(row=>row.publish_status<1&&row.isCheck);
                let obj = {
                    id:data.map(row=>row.id).join(","),
                };
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
            search(data){
                this.paramList = data;
                this.init();
            },
            handleSizeChange(size){
                this.pageSize=size;
                this.init();
            },
            handleCurrentChange(page){
                this.page=page;
                this.init();
            },
            init(){
                let data = window.clone(this.paramList);
                data.page = this.page;
                data.pageSize = this.pageSize;
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
                this.loading = true;
                data.application=1;
                data.nTime='create_time'
                this.$http(api_record_publish_list,data).then(res=>{
                    res.data.forEach(row => {
                        row.num = "";
                        row.show = false;
                        row.isCheck = false;
                        row.heighLight = false;
                    });
                    this.tableData = res.data;
                    this.total = res.total;
                    this.baseUrl = res.base_url;
                    this.loading = false;
                    this.firstLoading = false;
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                })
            },
            bantch_del(){
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
            operate_del(datas,obj){
                this.$http(api_record_del,obj).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message||res
                    });
                    if(datas instanceof Array){
                        datas.forEach(row=>{
                            let index=this.tableData.indexOfFun(old => {
                                return old.id===row.id;
                            });
                            this.tableData.splice(index,1);
                            this.total-=1;
                        })
                    } else if(datas instanceof Object){
                        let i = this.tableData.indexOfFun(old => {
                            return old.id===datas.id;
                        });
                        this.tableData.splice(i,1);
                        this.total-=1;
                    }
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                });
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
        components:{
            search:require('./record-search.vue').default,
            dataTable: require('./recordPublished-data-table.vue').default,
        }
    }
</script>


