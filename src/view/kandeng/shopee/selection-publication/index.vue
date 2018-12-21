<template>
    <page class="p-index">
        <!-- 搜索数据 -->
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears" style="overflow:initial;" :is-search="isSearch">
            <label-item label="账号简称：" class="mr-sm">
                <param-account v-sf.accountVal v-model="searchData.account_id"
                               type="shopeeAccount"
                               url="get|publish/shopee/accounts"
                               clearabled
                               :refresh="true"
                               :fixResult="fixAccount"
                               placeholder="全部"
                               class="mr-sm s-width-default">
                </param-account>
            </label-item>
            <!-- spu -->
            <el-select v-sf.nType
                       v-model="searchData.snType"
                       class="inline s-width-default" >
                <el-option v-for="item in goods"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <order-input v-if="isMultiRow" v-model="searchData.snText"
                         class="inline mr-sm s-width-large"
                         v-sf.snText
                         @keydown="search"
                         placeholder="可批量搜索，Shift+回车换行..."></order-input>
            <el-input placeholder="请输入搜索内容..."
                      class="inline mr-sm" v-else
                      v-sf.nContent v-model="searchData.snText"
                      style="width:160px"></el-input>
            <!-- 产品分类 -->
            <label-item label="产品分类：" class="mr-sm">
                <ui-groups class="inline mr-sm  " v-model="searchData.category_id" v-sf.category_id
                           :parent-click="parentClick"
                           :option="categoryTree"></ui-groups>
            </label-item>
            <!--发货仓库-->
            <label-item label="发货仓库：">
                <el-select v-model="searchData.warehouse_id"
                           class="s-width-large"
                           v-sf.warehouse_id
                           default-first-option
                           filterable clearable>
                    <el-option
                        v-for="res in warehouseList"
                        :label="res.name"
                        :value="res.id"
                        :key="res.id"
                    ></el-option>
                </el-select>
            </label-item>
        </search-card>
        <!-- 表格  -->
        <data-table
            ref="table"
            :loading="loading"
            :first-loading="firstLoading"
            :search="search"
            :shopee-list="shopeeList"
            :warehouse-list="warehouseList"
            :search-data="searchData"></data-table>
        <!-- 翻页 -->
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

</style>
<script>
    import {api_wait_shopee_list,api_mymall_category_tree,api_local_warehouse} from '@/api/shopee-publish';
	export default{
		data(){
			return {
				loading:false,
                searchData:{
                    account_id:"",
                    snType:"spu",
                    snText:'',
                    category_id:'',
                    warehouse_id:''
                },
                clears:{
                    snType:"spu",
                },
                goods:[
                    {label:"本地SPU",value:"spu"},
                    {label:"本地SKU",value:"sku"},
                    {label:"刊登标题",value:"name"},
                    {label:"商品别名",value:"alias"},
                ],
                parentClick:false,
                firstLoading:true,
                categoryTree: [],
                shopeeList:[],
                page:{
                    page:1,
                    pageSize:50,
                },
                total:0,
                warehouseList:[],
            }
		},
        refresh(){
            this.init();
        },
        mounted(){
            this.get_category_tree();       // 获取产品分类
            this.warehouse_init();
        },
        methods:{
            search() {
                this.init();
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
            init(){
                this.loading=true;
                let data = window.clone(this.searchData);
                if(this.isMultiRow&&data.snText!==''){
                    data.snText = data.snText.replace(new RegExp(' ','gm'),'\n').split('\n').filter(row=>!!row).map(row=>row.trim()).join(',');
                }else{
                    data.snText= data.snText.trim();
                }
                data.page=this.page.page;
                data.pageSize=this.page.pageSize;
                this.$http(api_wait_shopee_list,data).then(res=>{
                	this.shopeeList = res.data;
                    this.total=res.count;
                    this.firstLoading = false;
                	this.loading = false;
                }).catch((code)=>{
                    this.$message({type:'error',message:code.message||code})
                })
            },
            //获取账号列表
            fixAccount(res){
                return res.map(row=>{
                    return {
                        label:row.code,
                        value:row.account_id,
                    }
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
            select_account(val){
                if(val === ''){
                    this.searchData.shop_id = '';
                    this.shopList = [];

                }else {
                    this.searchData.shop_id = '';
                    this.get_joom_store();
                }
            },
            get_joom_store(){
                this.$http('', {joom_account_id:this.searchData.account_id}).then(res => {
                    this.shopList = [{label: '全部', value: ''}, ...res.data];
                })
            },
            warehouse_init() {
                this.$http(api_local_warehouse).then(res => {
                    this.warehouseList = [{name:'全部',id:''},...res.data];
                }).catch(code=>{
                    console.log(code)
                })
            },
        },
        computed:{
            isSearch(){
                if(this.searchData.account_id){
                    return false;
                }else{
                    return true;
                }
            },
            isMultiRow(){
                if(this.searchData.snType==='spu'||this.searchData.snType==='sku'){
                    return true
                }else{
                    return false
                }
            },
        },
		components: {
            paramAccount:require("@/api-components/param-account.vue").default,
            dataTable:require('./data-table.vue').default,
            searchCard:require('../../../../components/search-card.vue').default,
            labelItem:require('../../../../components/label-item.vue').default,
            uiGroups: require("../../../../components/ui-groups.vue").default,
            orderInput:require("@/components/order-input.vue").default,
        }
	}
</script>
