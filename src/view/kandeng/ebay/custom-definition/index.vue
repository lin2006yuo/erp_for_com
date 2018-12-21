<template>
    <page class="p-index">
        <!--提示-->
        <div class="mb-sm mt-sm tips-box">您可以给每个 Listing或范本 设置自定义分类，通过搜索分类找到相关的Listing或范本。</div>
        <!--操作按钮-->
        <div class="mb-sm ml-sm">
            <permission
                    tag="ElButton"
                    :route="apis.url_save_cateList"
                    class="inline"
                    size="mini"
                    @click.native="add_new_cate"
                    type="primary">添加新分类</permission>
        </div>
        <!--引入  添加自定义分类页面-->
        <add-category v-model="addDialog"
                      @submit="add_submit"
                      :title="title"
                      :form="addForm"></add-category>
        <!--列表数据-->
        <el-table
            v-resize="{height:41}"
            class="scroll-bar"
            :data="dataTable"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            highlight-current-row
        >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection" width="35px"></el-table-column>
            <el-table-column label="类型" inline-template>
                <div>{{row.type | filterType}}</div>
            </el-table-column>
            <el-table-column label="分类名称" prop="model_name"></el-table-column>
            <el-table-column label="创建人" inline-template>
                <div>{{row.realname}}</div>
            </el-table-column>
            <el-table-column label="操作" inline-template>
                <div>
                    <permission
                        tag="span"
                            class="operate"
                            @click="edit(row)"
                            :route="apis.url_save_cateList">编辑</permission>
                    <span v-if="showLine">|</span>
                    <permission tag="span"
                                :route="apis.url_delete_cateList"
                                class="operate"
                                @click="cur_delete(row)">删除</permission>
                </div>
            </el-table-column>
        </el-table>
        <!--分页-->
        <ui-pagination
                :data="form"
                @size-change="size_change"
                @current-change="current_change">
        </ui-pagination>
    </page>
</template>
<style lang="stylus">
    .tips-box{
        font-size:1.3rem;
        padding:8px;
        border:1px solid #D7D7D7;
        border-radius:5px;
        background-color: #FFF6C3;
    }
</style>
<script>
    import {api_get_cateList,api_edit_cateList,api_delete_cateList} from '../../../../api/ebay-kandeng-public-module';
    import {url_save_cateList,url_delete_cateList} from '../../../../api/ebay-kandeng-public-module';
    export default{
        permission:{
            url_save_cateList,
            url_delete_cateList,
        },
        page:{

        },
        data(){
            return {
                firstLoading: true,
                loading:false,
                addDialog:false,
                dataTable:[],
                addForm:{
                    model_type:"cate",
                    model_name:"",
                    type:1,
                },
                form:{
                    page:1,
                    pageSize:50,
                    count:0
                },
                title:"",
            }
        },
        computed:{
            showLine(){
                return this.$hasPermission(url_save_cateList)&&this.$hasPermission(url_delete_cateList);
            },
            emptyText(){
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            }
        },
        created(){
            this.init();
        },
        filters:{
            filterType(val){
                if(val){
                    if(val===1){
                        return 'listing分类'
                    }else{
                        return '范本分类'
                    }
                }
            }
        },
        methods:{
            /*添加自定义分类*/
            add_new_cate(){
                this.addDialog = true;
                this.title = "添加新分类";
                this.addForm = {
                    model_type:"cate",
                    model_name:"",
                    type:1,
                }
            },
            /*列表编辑*/
            edit(row){
                this.addDialog = true;
                this.get_edit(row);
            },
            cur_delete(row){

                this.$confirm(`您将删除${row.model_name}分类,确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        model_type:row.model_type,
                        id:row.id,
                    };
                    this.$http(api_delete_cateList,params).then(res=>{
                        this.$message({
                            message:res.message||res,
                            type:"success"
                        });
                        let index = this.dataTable.indexOfFun(row,function (old,row) {
                            return old.id===row.id
                        });
                        this.dataTable.splice(index,1);
                        this.form.count -= 1;
                    }).catch(code=>{
                        this.$message({
                            message:code.message||code,
                            type:"error"
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            /*引入页面  添加&&更新*/
            add_submit(val,data){
                data.id = parseInt(data.id);
                val.id = data.id;
                let curObj = this.dataTable.find(row=> {
                    return row.id === val.id;
                });
                if(!!curObj){
                	delete data.realname;
                    Object.assign(curObj,data)
                }else{
                    this.dataTable.unshift(data);
                    this.form.count++;
                }
            },
            /*获取公用列表*/
            init(){
                let params = {
                    model_type:"cate",
                    page:this.form.page,
                    size:this.form.pageSize,
                };
                this.loading = true;
                this.$http(api_get_cateList,params).then(res=>{
                    this.dataTable = res.data;
                    this.form.count = res.count;
                    this.loading = false;
                    this.firstLoading = false;
                }).catch(code=>{
                    this.loading = false;
                    this.firstLoading = false;
                    console.log(code);
                })
            },
            size_change(val){
                this.form.pageSize = val;
                this.init();
            },
            current_change(val){
                this.form.page = val;
                this.init();
            },
            /*编辑API*/
            get_edit(row){
                let params = {
                    model_type:row.model_type,
                    id:row.id
                };
                this.$http(api_edit_cateList,params).then(res=>{
                    this.addForm = res.data;
                    this.title=`编辑自定义分类: ${this.addForm.model_name} 信息`
                }).catch(code=>{
                    console.log(code);
                })
            }
        },
        components: {
            uiPagination:require('../../../../components/ui-pagination.vue').default,
            addCategory:require('./add-category.vue').default,
        }
    }
</script>
