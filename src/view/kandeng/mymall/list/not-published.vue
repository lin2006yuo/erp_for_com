<template>
    <page class="p-kandeng">
        <!-- 搜索数据 -->
        <search-card @search="search" @enter="search" @init-params="init_params" :params="searchData" :clears="clears" style="overflow:initial;" :is-search="isSearch">
            <label-item label="账号简称：" class="mr-sm">
                <super-select
                    v-sf.accountVal
                    class="inline s-width-middle"
                    v-sf.account_id
                    v-model="searchData.account_id"
                    :options="mymall_account"
                    storageKey="myMall_account"
                ></super-select>
            </label-item>
            <!-- spu -->
            <el-select v-sf.nType
                       v-model="searchData.snType"
                       class="inline s-width-default" >
                <el-option v-for="item in goods" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-input placeholder="请输入搜索内容..." v-sf.nContent v-model="searchData.snText" class="inline mr-sm" style="width:160px"></el-input>
            <!-- 产品分类 -->
            <label-item label="产品分类：" class="mr-sm">
                <el-cascader
                    :options="categoryTree"
                    v-model="searchData.category_id"
                    change-on-select
                    :clearable="true"
                ></el-cascader>
            </label-item>
        </search-card>
        <!-- 表格  -->
        <data-table
                ref="table"
                :loading="loading"
                :firstLoading="firstLoading"
                :search="search"
                :products="products"
                :params="searchData"
        >
        </data-table>
        <!-- 分页 -->
        <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page=page.page
                :page-sizes="[20, 50, 100, 200]"
                :page-size=page.pageSize
                layout="total, sizes, prev, pager, next, jumper"
                :total=total>
        </el-pagination>
    </page>
</template>
<style lang="stylus">
    .p-kandeng{
    }
</style>
<script>
    import {http} from '@/lib/http-plus.js'
    import {api_wait_publish_list, api_mymall_category_tree,api_get_myMall } from '../../../../api/mymall';
    export default {
        data(){
            return {
                searchData:{
                    account_id:"",
                    snType:"spu",
                    snText:'',
                    category_id:[],
                },
                clears:{
                    account_id:"",
                    snType:"spu",
                    snText:'',
                    category_id:'',
                },
                accountList:[{account_name: '全部', code: ''}],
                goods:[
                    {label:"本地SPU",value:"spu"},
                    {label:"本地SKU",value:"sku"},
                    {label:"商品刊登标题",value:"title"},
                    {label:"商品别名",value:"alias_name"},
                ],
                page:{
                    page:1,
                    pageSize:50,
                },
                total:0,
                loading:false,
                products:[],
                firstLoading:true,
                parentClick:false,
                categoryTree: [],
                mymall_account:[],
            }
        },
        computed:{
            isSearch(){
                if(this.searchData.account_id){
                    return false;
                }else{
                    return true;
                }
            },
        },
        methods: {
            getList(){
                this.$http(api_get_myMall).then(res=>{
                    this.mymall_account=res.data.map(row=>{
                        return{
                            value:row.id,
                            label:row.code
                        }
                    })
                }).catch(e=>{
                    console.log(e);
                })
            },
            init_params(){
                this.searchData.category_id=[];
            },
            get_category_tree(){
                this.$http(api_mymall_category_tree).then(res => {
                    this.categoryTree = this.data_format(res.data);
                });
            },
            data_format(val){
                if (val.length === 0) {
                    return null
                }
                return val.map(item => {
                    return {
                        label: item.title,
                        value: item.id,
                        children: this.data_format(item.childs)
                    }
                });
            },
            search() {
                this.init();
            },
            init(){
                this.loading=true;
                let data = window.clone(this.searchData);
                data.category_id=data.category_id[data.category_id.length-1]==undefined?'':data.category_id[data.category_id.length-1]
                data.snText= data.snText.trim();
                data.page=this.page.page;
                data.pageSize=this.page.pageSize;
                this.$http(api_wait_publish_list,data).then(res=>{
                    this.products=res.data;
                    this.total=res.count;
                    this.loading=false;
                    this.firstLoading = false;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                    this.loading=false;
                })
            },
            handleSizeChange(size){
                this.page.pageSize = size;
                this.init();
            },
            handleCurrentChange(page){
                this.page.page = page;
                this.init();
            },
            //获取账号列表
            fixAccount(res){
                return res.data.map(row=>{
                    return {
                        label:row.code,
                        value:row.id,
                    }
                })
            },
        },
        created(){
            this.getList();
            this.get_category_tree();       // 获取产品分类
            // this.search();
        },
        components: {
            paramAccount:require("@/api-components/param-account.vue").default,
            searchCard:require('../../../../components/search-card.vue').default,
            dataTable: require('./notPublished-data-table.vue').default,
            labelItem:require('../../../../components/label-item.vue').default,
            uiGroups: require("../../../../components/ui-groups.vue").default,
        }
    }
</script>

