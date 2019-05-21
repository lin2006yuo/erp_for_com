<template xmlns="" xmlns="" xmlns="">
    <div>
        <search @search="search" @status-select="status_select"></search>

        <el-button  class="ml-sm mb-xs"
                    size="mini"
                    @click.native="add"
                    type="primary">
            添加
        </el-button>

        <data-table :table-data="tableData"
                    @operation="operation">
        </data-table>

        <operation-dialog   v-model="dialogVisible"
                            :title="dialogTitle"
                            :form-data="dialogData"
                            :table-data="tableData"
                            :type="operationType"
                            :tag-id="tagID"
                            @update-addition="update_addition"
                            @update-edition="update_edition">
        </operation-dialog>

        <el-pagination  class="page-fixed"
                        @size-change="handle_size_change"
                        @current-change="handle_current_change"
                        :current-page="listInfo.page"
                        :page-sizes="[20, 50, 100, 200]"
                        :page-size="listInfo.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="listInfo.total">
        </el-pagination>
    </div>
</template>

<script>
    import {
        api_get_tags,
        api_search_tag,
        api_get_tag_info,
        api_delete_tag

    } from '@/api/tag-management'
    export default {
        beforeMount(){
            this.get_tag_list();
        },
        data(){
            return{
                listInfo:{
                    page:1,
                    pageSize:20,
                    status:1,
                    order:1,
                    total:50
                },
                tableData:[],
                dialogVisible:false,
                dialogTitle:'',
                operationType:'',
                dialogData:{},
                tagID:''
            }
        },
        methods:{
            get_tag_list(){
                let data=clone(this.listInfo);
                Reflect.deleteProperty(data,'total');
                this.$http(api_get_tags,data)
                    .then(res=>{
                        console.log("获取标签列表：",res);
                        this.listInfo.total=res.count;
                        this.tableData=res.data;
                    })
            },
            handle_size_change(val){
                this.listInfo.pageSize=val;
                this.get_tag_list();
            },
            handle_current_change(val){
                this.listInfo.page=val;
                this.get_tag_list();
            },
            search(searchData){
                if(!searchData.name){this.status_select();}
                else{
                    this.$http(api_search_tag,searchData)
                        .then(res=>{
                            console.log("搜索结果:",res);
                            this.tableData=res.data;
                        })
                }
            },
            status_select(status){
                //1:启用,0:未启用,不传参数默认全部
                if(status || status===0){
                    this.$http(api_search_tag,{status:status,order:1})
                        .then(res=>{
                            this.tableData=res.data;
                        })
                        .catch(err=>{
                            console.log(err.message)
                        })
                }
                else{
                    this.$http(api_search_tag,{order:1})
                        .then(res=>{
                            this.tableData=res.data;
                        })
                        .catch(err=>{
                            console.log(err.message)
                        })
                }

            },
            operation(para){
                console.log("operation");
                switch(para.type){
                    case'view':
                        this.view(para.data);
                        break;
                    case'edit':
                        this.edit(para.data);
                        break;
                    case'remove':
                        this.remove(para.data);
                        break;
                }
            },
            add(){
                this.dialogData={};
                this.operationType='add'
                this.dialogTitle="添加标签";
                this.dialogVisible=true;
            },
            view(row){
                this.get_tag_info(row)
                    .then(res=>{
                        res.type=res.type+'';
                        res.status=res.status+'';
                        this.dialogData=res;
                        this.operationType='view';
                        this.dialogTitle=`查看标签：${row.name} 信息`;
                        this.dialogVisible=true;
                    })
            },
            edit(row){
                this.tagID=row.id;
                this.get_tag_info(row)
                    .then(res=>{
                        res.type=res.type+'';
                        res.status=res.status+'';
                        this.dialogData=res;
                        this.operationType='edit';
                        this.dialogTitle=`编辑标签：${row.name} 信息`;
                        this.dialogVisible=true;
                    })

            },
            remove(row){
                this.get_tag_info(row)
                    .then(info=>{
                        if(info.isBind){
                            this.$message({type:'warning',message:`${row.name}标签已被绑定，需要解除绑定后才能删除`});
                        }
                        else{
                            this.$confirm(`您将删除${row.name}标签，确认此操作吗？`, '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning',
                                closeOnClickModal:false,
                            }).then(()=>{
                                this.$http(api_delete_tag,row.id)
                                    .then(res=>{
                                        this.$message({type:'success',message:res.message});
                                        this.update_delete(row);
                                    })
                                    .catch(err=>{
                                        this.$message({type:'error',message:err.message});
                                    })
                            }).catch(()=>{
                                this.$message({type:'info',message:"已取消操作"});
                            })
                        }
                    })
            },
            get_tag_info(row){
                return new Promise((resolve, reject)=>{
                    this.$http(api_get_tag_info,row.id)
                        .then(res=>{
                            resolve(res)
                        })
                        .catch(err=>{
                            reject(err)
                        })
                })
            },
            //添加标签后更新标签列表
            update_addition(data){
                console.log("更新添加");
                this.tableData.unshift(data);
            },
            //编辑标签后更新标签列表
            update_edition(data){
                console.log("更新编辑");
                let index=this.tableData.findIndex(item=>{
                    return item.id===data.id;
                })
                if(index>=0){this.tableData[index]=data};
            },
            //删除标签后更新标签列表
            update_delete(data){
                console.log("更新删除");
                let index=this.tableData.findIndex(item=>{
                    return item.id===data.id;
                });
                if(index>=0){this.tableData.splice(index,1);}
            }
        },
        components:{
            search:require('./search').default,
            dataTable:require('./data-table').default,
            operationDialog:require('./operation-dialog').default
        }
    }
</script>

<style scoped>

</style>
