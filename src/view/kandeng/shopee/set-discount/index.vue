<template>
    <page class="p-index">
        <!-- 搜索数据 -->
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears" style="overflow:initial;" :is-search="isSearch">
            <label-item label="账号简称：" class="mr-sm"  >
                <param-account v-sf.account_id v-model="searchData.account_id"
                               type="shopeeAccount"
                               url="get|publish/shopee/accounts"
                               :param="{type:'sales',data:{content:''}}"
                               clearabled
                               :refresh="true"
                               :fixResult="fixAccount"
                               placeholder="全部"
                               class="mr-sm s-width-default">
                </param-account>
            </label-item>
            <label class="inline">折扣名称：</label>
            <el-input placeholder="请输入搜索内容..." v-sf.discount_name v-model="searchData.discount_name" class="inline mr-sm" style="width:160px"></el-input>
        </search-card>
        <div class="inline mt-xs mb-xs ml-sm">
            <el-button type="primary"
                       size="mini"
                       @click.native="add_discount">添加折扣活动
            </el-button>
        </div>
        <!-- 表格  -->
        <data-table
            ref="table"
            :loading="loading"
            :first-loading="firstLoading"
            :search="search"
            :table-data="tableData"
            :total="total"
            @tab-remove="tabRemove"></data-table>
        <discount-add v-model="discountAdd" :add-edit-form="addEditForm"></discount-add>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_shopee_discount,api_discount_edit} from '../../../../api/shopee-publish';
	export default{
		data(){
			return {
			    firstLoading: true,
                loading:false,
                searchData:{
                    account_id:"",
                    discount_name:'',
                },
                clears:{
                    account_id:"",
                    discount_name:'',
                },
                tableData:{
                    list:[],
                    page:1,
                    pageSize:20,
                },
                total:0,
                discountAdd:false,
                addEditForm:{
                    account_id:"",
                    discount_name:'',
                    start_time:'',
                    end_time:'',
                    discountData:[],
                },
            }
		},
        refresh(){
            this.init();
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
        mounted(){
            this.init();
        },
        methods:{
            search(){
            	this.init();
            },
            init(){
            	let params = {
                    account_id:this.searchData.account_id,
                    discount_name:this.searchData.discount_name,
                }
                this.loading = true;
            	this.$http(api_shopee_discount,params).then(res=>{
                    this.loading = false;
            		this.tableData.list = res.data;
            		this.total = res.total;
            		this.firstLoading = false
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            //获取账号列表
            fixAccount(res){
                let list = res.map(row=>{
                    return {
                        label:row.code,
                        value:row.account_id,
                    }
                });
                return list
            },
            add_discount(){
                this.discountAdd = true;
                this.addEditForm = {
                    account_id:"",
                    discount_name:'',
                    start_time:'',
                    end_time:'',
                    discountData:[],
                }
            },
            tabRemove(val){
            	let parmas = {
                    discount_id:val.discount_id
                }
            	this.$http(api_discount_edit,parmas).then(res=>{
                    this.addEditForm = {
                        account_id:val.account_id,
                        discount_name:val.discount_name,
                        start_time:Number(val.start_time)*1000,
                        end_time:Number(val.end_time)*1000,
                        discountData:res
                    };
                    this.discountAdd = true;
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
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
        },
		components: {
            paramAccount:require("@/api-components/param-account.vue").default,
            searchCard:require('../../../../components/search-card.vue').default,
            labelItem:require('../../../../components/label-item.vue').default,
            dataTable:require('./data-table.vue').default,
            discountAdd :require('./discount-add .vue').default,
        }
	}
</script>
