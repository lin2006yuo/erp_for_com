<template>
    <page class="p-index">
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears">
            <label class="inline">账号简称：</label>
            <super-select v-sf.ebay_account
                          class="inline s-width-default"
                          v-model="searchData.account_id"
                          placeholder="请选择eBay账号"
                          :options="c_accountList"
                          storageKey="ebayAccounts">
            </super-select>
            <label class="inline ml-lg">模板名称：</label>
            <el-input class="inline s-width-default" v-sf.model_name
                      v-model="searchData.model_name" placeholder="请输入模板名称"></el-input>
            <label class="inline ml-lg">创建人：</label>
            <el-input class="inline width-lg mr-sm" @keyup.enter.native="search"
                      v-model="searchData.creator"></el-input>
        </search-card>
        <div class="mt-xs mb-xs">
            <permission tag="ElButton"
                        :route="apis.url_save_combList"
                        type="primary"
                        size="mini"
                        class="inline ml-sm"
                        @click.native="add_style">添加自定义风格</permission>
        </div>
        <!--添加&&编辑自定义风格弹框-->
        <add-edit-page v-model="addDialog"
                       :form="addEditForm"
                       @submit="add_edit_submit"
                       :site="c_accountList"
                       :account-list="accountList"
                       :title="addEditTitle"
        ></add-edit-page>
        <el-table
            class="scroll-bar"
            :data="tableData.data"
            v-loading="loading"
            v-resize="{height:41}"
            element-loading-text="玩命加载中..."
            highlight-current-row
        >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection" width="35px"></el-table-column>
            <el-table-column label="模板名称" prop="model_name"></el-table-column>
            <el-table-column label="账号简称" prop="account_code"></el-table-column>
            <el-table-column label="创建人" prop="create_name"></el-table-column>
            <el-table-column label="创建时间" prop="create_time"></el-table-column>
            <el-table-column label="更新人" prop="update_name"></el-table-column>
            <el-table-column label="更新时间" prop="update_time"></el-table-column>
            <el-table-column label="操作" inline-template>
                <div>
                    <permission tag="span"
                                :route="apis.url_save_combList"
                                class="operate"
                                @click="edit_table(row)">编辑</permission>
                    <span v-if="showLine">|</span>
                    <permission tag="span"
                                :route="apis.url_delete_promotion"
                                class="operate"
                                @click="delete_table(row)">删除</permission>
                </div>
            </el-table-column>
        </el-table>
        <ui-pagination
            :data="tableData"
            @size-change="size_change"
            @current-change="current_change"
        ></ui-pagination>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_stylelist,api_get_account,api_edit_combList,api_delete_promotion} from '../../../../api/ebay-kandeng-public-module';
    import {url_save_combList,url_delete_promotion} from '../../../../api/ebay-kandeng-public-module';
    export default{
        permission:{
            url_save_combList,
            url_delete_promotion
        },
        page:{},
        refresh(){
            this.searchData = {
                creator:"",
                model_name:"",
                ebay_account:"",
            };
            this.init();
        },
        data(){
            return {
                firstLoading: true,
                addEditTitle:"",
                loading:false,
                addDialog:false,
                accountList:[],
                addEditForm:{
                    model_name:"",
                    ebay_account:"",
                    enabled_moble:0,
                    style_detail:"",
                    account:"",
                },
                tableData:{
                    data:[],
                    count:0,
                    page:1,
                    pageSize:50,
                },
                searchData:{
                    account_id:'',
                    model_name:"",
                    account:"",
                    creator:"",
                },
                clears:{}
            }
        },
        created(){
            this.init();
            this.get_account();
        },
        methods:{
            sale_fix_result(val){
                return  val.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
            },
            account_map(accountId,Array){
                let cur = Array.find(row=>{return row.value === accountId})
                if(!!cur){
                    return cur.label
                }else{
                    return "暂无账号数据"
                }
            },
            /*搜索*/
            search(){
                this.init();
            },
            /*添加风格*/
            add_style(){
                this.addEditForm = {
                    model_name:"",
                    ebay_account:"",
                    enabled_moble:0,
                    style_detail:""
                };
                this.addEditTitle = '新增刊登风格';
                this.addDialog = true;
            },
            /*添加&&编辑自定义风格弹框 确定*/
            add_edit_submit(){
                this.init();
            },
            size_change(val){
                this.tableData.pageSize = val;
                this.init();
            },
            current_change(val){
                this.tableData.page = val;
                this.init();
            },
            /*table中的编辑操作*/
            edit_table(row){
                this.edit_data(row);
            },
            delete_table(row){
                let params = {
                    type:"style",
                    id:row.id,
                    confirm:0,
                };
                this.$confirm(`您将删除  ${row.model_name}  风格模板, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_promotion,params).then(res=>{
                        if(!!res.comb_names){
                            let combNames=res.comb_names.join(',');
                            this.$confirm(`当前公共模块被组合模板${combNames}所引用,确定同时删除该引用吗？`, '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                params.confirm=1;
                                this.$http(api_delete_promotion,params).then(res=>{
                                    this.$message({
                                        type:"success",
                                        message:res.message||res
                                    })
                                    let index = this.tableData.data.indexOfFun(row,function (old,row) {
                                        return old.id===row.id
                                    });
                                    this.tableData.data.splice(index,1)
                                    this.$set(this.tableData,'count',this.tableData.count-1)
                                }).catch(code=>{
                                    this.$message({message:code.message,type:'error'});
                                });
                            }).catch(() => {
                                this.$message({
                                    type: 'info',
                                    message: '已取消'
                                });
                            });
                        }else {
                            this.$message({
                                type:"success",
                                message:res.message||res
                            })
                            let index = this.tableData.data.indexOfFun(row,function (old,row) {
                                return old.id===row.id
                            });
                            this.tableData.data.splice(index,1)
                            this.$set(this.tableData,'count',this.tableData.count-1)
                        }

                    }).catch(code=>{
                        this.$message({
                            type:"error",
                            message:code.message||code
                        })
                    })
                }).catch(code=>{
                    this.$message({
                        type:'info',
                        message:"已取消删除"
                    })
                })


            },
            /*编辑*/
            edit_data(row){
                let params = {
                    type:"style",
                    id:row.id
                };
                this.addEditForm = {};
                this.$http(api_edit_combList,params).then(res=>{
                    this.addEditForm = res;
                    this.addDialog = true;
//                    this.addEditForm.id = res.data.id;
//                    this.addEditForm.model_name = res.data.model_name;
//                    this.addEditForm.ebay_account = res.data.ebay_account;
//                    this.addEditForm.enabled_moble = res.data.enabled_moble;
//                    this.addEditForm.style_detail = res.data.style_detail;
                    this.addEditTitle = `编辑刊登风格模板: ${this.addEditForm.model_name} 信息`;
                }).catch(code=>{
                    console.log(code);
                })
            },
            init(){
                let params = {
                    accountId:this.searchData.account_id,
                    moduleName:this.searchData.model_name,
                    creatorName:this.searchData.creator,
                    page:this.tableData.page,
                    pageSize:this.tableData.pageSize,
                    type:'style',
                };
                this.loading = true;
                this.$http(api_get_stylelist,params).then(res=>{
                    this.tableData.data = res.data;
                    this.tableData.count = res.count;
                    this.loading = false;
                    this.firstLoading = false;
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_account(){
                this.$http(api_get_account).then(res=>{
                    this.accountList = res.data.map(row=>{
                        return {
                            label:row.code,
                            value:row.id
                        }
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
        },
        computed:{
            showLine(){
                return this.$hasPermission(url_save_combList)&&this.$hasPermission(url_delete_promotion)
            },
            c_accountList(){
                let arr = window.clone(this.accountList);
                arr.unshift({label:"通用",value:""});
                return arr;
            },
            emptyText(){
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            }
        },
        props:{},
        components: {
            uiPagination:require('../../../../components/ui-pagination.vue').default,
            searchCard:require('../../../../components/search-card.vue').default,
            addEditPage:require('./add-edit-page.vue').default,
            paramAccount:require('@/api-components/param-account.vue').default,
        }
    }
</script>
