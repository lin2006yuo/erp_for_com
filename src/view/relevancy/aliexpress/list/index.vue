<template>
    <page>
        <search-card @search="search" :params="searchData" :clears="clears">
            <permission tag="label" :route="apis.url_get_account">账号简称：</permission>
            <permission v-sf.account_id  class="inline s-width-default" tag="ElSelect" :route="apis.url_get_account" v-model="searchData.account_id" filterable>
                <el-option
                    v-for="item in account"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </permission>
            <permission tag="label" :route="apis.url_aliexpress_classify" class="inline ml-sm">准入行业类目：</permission>
            <permission v-sf.category_id class="inline" tag="ElSelect" :route="apis.url_aliexpress_classify" v-model="searchData.category_id">
                <el-option
                    v-for="item in cateList"
                    :key="item.category_id"
                    :label="item.category_name_zh"
                    :value="item.category_id">
                </el-option>
            </permission>
            <permission tag="label" :route="apis.url_get_categories" class="inline ml-sm">关联本地分类：</permission>
            <permission v-sf.local_category_id class="inline mr-sm" tag="ElSelect" :route="apis.url_get_categories" v-model="searchData.local_category_id" filterable>
                <el-option
                    v-for="item in locals_list"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                </el-option>
            </permission>
            <!--<permission tag="ElButton" :route="apis.url_aliexpre_list" size="mini" type="primary" @click.native="search">搜索</permission>-->
            <!--<permission tag="ElButton" :route="apis.url_aliexpre_list" size="mini" @click.native="clearSearch">清空搜索</permission>-->
        </search-card>
        <div>
            <div class="mt-sm ml-sm mb-sm">
                <!--<el-button size="mini" type="primary" @click="add_form">新增关联分类</el-button>-->
                <!--<el-button size="mini" type="primary" @click="select_del">删除</el-button>-->
                <permission tag="ElButton" :route="apis.url_add_aliexpre_list" size="mini" type="primary" @click="add_form">新增关联分类</permission>
                <permission tag="request-button" :route="apis.url_del_aliexpre_list" :mintime="200" req-key="url_del_aliexpre_list" @click="select_del" :disabled="isDel">删除</permission>
            </div>
            <!--添加-->
            <relate-table  v-model="addVisable" @add_list="init" :tree="local_list"></relate-table>
            <!--修改-->
            <edit-table v-model="editVisable"  @edit_list="init" :editList="editList" :tableRow="tableRow" :tree="local_list"></edit-table>
            <el-table
                v-resize="{height:38}"
                v-loading="loading"
                element-loading-text="拼命加载中"
                ref="multipleTable"
                :data="aliList"
                border
                tooltip-effect="dark"
                @select="list_select"
                @select-all="select_all"
                class="scroll-bar"
                highlight-current-row
                style="width: 100%">
                <div slot="empty" class="no-data-reminder">
                    <i></i>
                    {{emptyText}}
                </div>
                <el-table-column
                    type="selection"
                    width="35">
                </el-table-column>
                <el-table-column
                    inline-template
                    label="账号简称">
                    <!--<span></span>-->
                    <span>{{row | accountCode}}</span>
                </el-table-column>
                <el-table-column
                    inline-template
                    label="准入行业类目">
          <span>
            {{row.alicategory.category_name_zh}}
          </span>
                </el-table-column>
                <el-table-column
                    inline-template
                    label="关联本地分类">
          <span>
            {{row | localcategoryLoca_name}}
          </span>

                </el-table-column>
                <el-table-column
                    inline-template
                    label="时间">
                    <span>{{row | formatAddtime}}</span>
                    <!--<times :time="row.addtime"></times>-->
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <permission tag="ElButton" :route="apis.url_edit_aliexpre_list" size="mini" type="text" @click="edit_list(scope.row)">编辑</permission>
                        <permission tag="span" :route="apis.url_del_aliexpre_list">|</permission>
                        <permission tag="ElButton" :route="apis.url_del_aliexpre_list" size="mini" type="text" @click="del_row(scope.row.id,scope.row)">删除</permission>
                    </template>
                </el-table-column>
            </el-table>
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
        </div>
    </page>
</template>

<style lang="stylus">

</style>
<script>
    import {
        api_aliexpre_list,
        api_add_aliexpre_list,
        api_del_aliexpre_list,
        api_edit_aliexpre_list,
        url_aliexpre_list,
        url_add_aliexpre_list,
        url_del_aliexpre_list,
        url_edit_aliexpre_list
    } from '../../../../api/aliexpress-relevancy'
    import {api_aliexpress_classify,api_aliexpress_sale_list,url_aliexpress_sale_list,url_aliexpress_classify} from '../../../../api/publish-smt'
    import {api_get_categories,url_get_categories} from '../../../../api/categories';
    import {api_get_account, url_get_account} from '../../../../api/handwork'

    export default{
        permission:{
            url_aliexpress_sale_list,
            url_aliexpre_list,
            url_aliexpress_classify,
            url_get_categories,
            url_add_aliexpre_list,
            url_del_aliexpre_list,
            url_edit_aliexpre_list,
            url_get_account
        },
        page:{},
        refresh(){
            this.searchData = {
                page: 1,
                pageSize: 50,
                account_id: "",
                category_id: "",
                local_category_id: ""
            };
            this.init();
        },
        data(){
            return {
                firstLoading: true,
                addVisable: false,
                editVisable: false,
                aliList: [],//数据列表
                accountList: [],//账号简称
                cateList: [],//准入行业分类名称
                local_list: [],//关联本地分类
                locals_list:[],
                editList:{},//编辑返回的数据
                del_select:'',
                del_arr:[],
                tableRow:{},
                searchData: {
                    page: 1,
                    pageSize: 50,
                    account_id: "",
                    category_id: "",
                    local_category_id: ""
                },
                clears:{
                    page: 1,
                    pageSize: 50,
                    account_id: "",
                    category_id: "",
                    local_category_id: ""
                },
                account:[],
                total:0,
                addDate: {
                    account: [],
                    category_id: '',
                    local_category: []
                },
                loading:true,
                isDel:true
            }
        },
        created(){
            this.init();
        },
        filters:{
            accountCode(row){
                let account = row.account || {};
                return account.code || "暂无";
            },
            localcategoryLoca_name(row){
                let localcategory = row.localcategory || {};
                return localcategory.local_name || "暂无";
            },
            formatAddtime(row){
                return row.addtime?datef('YYYY-MM-dd HH:mm:ss', row.addtime):'暂无';
            }

        },
        mounted(){
            //this.getAccount();
            this.getAccount();
            this.getCateList();
            this.getLocalList()
        },
        updated(){

        },
        destroy(){

        },
        methods: {

//            change_accountId(id){
//                if(!this.searchData.account_id){
//                    return
//                }
//                this.searchData.account_id=id;
//            },
//            change_local_category_id(id){
//                if(!this.searchData.local_category_id){
//                    return
//                }
//                this.searchData.local_category_id=id;
//
//            },
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init()
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
            edit_list(row){//编辑
                this.editList = [];
                this.tableRow = row;
                this.$http(api_edit_aliexpre_list, {id:row.id}).then(res => {
                    this.editList = res.data;
                    this.editVisable = true;
                }).catch(code => {
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            list_select(selection,row){
                if(selection.length===0){
                    this.isDel = true;
                }else {
                    this.isDel = false;
                }
                let arr= [];
                selection.forEach((val)=>{
                    arr.push(val.id);
                });
                this.del_select = arr.join(';');
                this.del_arr = arr;
            },
            select_all(selection){
                if(selection.length===0){
                    this.isDel = true;
                }else {
                    this.isDel = false;
                }
                let arr= [];
                selection.forEach((val)=>{
                    arr.push(val.id);
                });
                this.del_select = arr.join(';');
                this.del_arr = arr;
            },
            select_del(){
                this.$confirm('此操作将删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.del_list(this.del_select,this.del_arr);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_del_aliexpre_list',false);
                    });
                });

            },
            del_row(id,arr){
                this.$confirm('此操作将删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.del_list(id,arr);

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            del_list(id,datas){//删除
                this.$http(api_del_aliexpre_list, {ids:id}).then(res => {
                    this.$message({
                        showClose: true,
                        type:"success",
                        message: res.message || res
                    });
                    if(datas instanceof Array){
                        datas.forEach(row=>{
                            let index=this.aliList.indexOfFun(row,function (old,row) {
                                return old.id===row
                            });
                            this.aliList.splice(index,1)
                            this.total-=1;
                        })
                    } else if(datas instanceof Object){
                        let i = this.aliList.indexOfFun(datas,function (old,datas) {
                            return old.id===datas.id
                        });
                        this.aliList.splice(i,1)
                        this.total-=1;
                    }
                    this.del_select = "";
                    this.del_arr = [];
                }).catch(code => {
                    this.$message({type:"error",message:code.message || code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_del_aliexpre_list',false);
                    });
                });
            },
            add_list(){//增加
            },
            add_form(){//增加弹框打开

                this.addVisable = true;
                this.addData = {}
            },
            init(){
                this.loading=true;
                this.aliList = [];
                this.$http(api_aliexpre_list, this.searchData).then(res => {
                    this.loading=false;
                    this.firstLoading = false;
                    this.aliList = res.data;
                    this.total=res.count;
                }).catch(code => {
                    this.$message({type:"error",message:code.message || code});
                })
            },
            getAccount(){//获取速卖通账号简称
                this.$http(api_get_account,{channel_id:4}).then(res => {
                    //console.log(res.account);
                    this.account = res.account;
                }).catch(code => {
                    this.$message({
                        showClose: true,
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            getLocalList(){//关联本地分类
                this.$http(api_get_categories).then(res=>{
                    let array= Object.keys(res).map(key =>res[key]);
                    let parents = array.filter(arr => arr.pid === 0);
                    parents.forEach(parent=>{
                        parent.label = !!parent.name?parent.name:parent.title;
                        parent.children = parent.child_ids.map(child=>{
                            let c = res[child];
                            c.label = !!c.name?c.name:c.title;
                            return c;
                        });
                        delete parent.child_ids;
                    });
                    this.local_list = parents;
                    //console.log(parents);
                    let arr=[];
                    parents.forEach(res=>{
                        arr.push({id:res.id,label:res.label});
                        res.children.forEach(row=>{
                            arr.push({id:row.id,label:row.label})
                        })
                    });
                    this.locals_list = arr;
                }).catch(code=>{
                    this.$message({
                        showClose: true,
                        type:"error",
                        message:code.message || code
                    })
                });
            },
            getCateList(){//准入行业分类
                this.cateList = [];
                this.$http(api_aliexpress_classify).then(res=>{
                    this.cateList = res;
                }).catch(code=>{
                    this.$message({
                        showClose: true,
                        type:"error",
                        message:code.message || code
                    })
                });
            },
            search(){
                this.init();
            },
            clearSearch(){

                this.init();
            },
            account_result(res){
                return  res.account.map(row=>{
                    return {
                        label:row.label,
                        value:row.value
                    }
                })
            }
        },
        computed: {
            emptyText(){
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            }
        },
        components: {
            relateTable: require('./relate-add.vue').default,
            editTable: require('./relate-edit.vue').default,
            paramAccount: require('../../../../api-components/param-account.vue').default,
            searchCard:require('../../../../components/search-card.vue').default,
        }
    }
</script>

