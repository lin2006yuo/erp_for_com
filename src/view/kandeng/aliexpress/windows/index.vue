<template>
    <page class="aliexpress-windows-list">
        <search-card @search="init" @enter="init" :params="searchData" :clears="clears" class="mb-sm">
            <el-form :inline="true" v-model="searchData" class="mr-sm">
                <el-form-item>
                    <label>账号简称：</label>
                    <el-select v-sf.account_id v-model="searchData.account_id" filterable clearable class="width-md inline" placeholder="全部">
                        <el-option v-for="item in account_list" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <label class="ml-sm">还剩可用橱窗数：</label>
                        <el-select v-sf.left_count v-model="searchData.left_count" clearable class="width-xs inline" placeholder="全部">
                        <el-option label="大于0" value="1"></el-option>
                        <el-option label="等于0" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </search-card>
        <el-table
            :data="tableData"
            class="scroll-bar"
            v-resize={height:38}
            v-loading="loading"
            element-loading-text="玩命加载中">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column inline-template label="账号简称">
                <div>
                    <ui-tip :content="row.account.code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column inline-template label="销售员">
                <div>
                    <ui-tip :content="row.account | get_realname" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column inline-template label="正在使用橱窗数">
                <div>
                    <ui-tip :content="row.used_count" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column inline-template label="还剩余可用橱窗数">
                <div>
                    <ui-tip :content="row.left_count" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column inline-template label="操作">
                <span class="operate" @click="view_product(row.id)">查看橱窗产品</span>
            </el-table-column>
        </el-table>
        <view-product
                :product="product"
                v-model="viewVisible">
        </view-product>
        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200, 500]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count">
        </el-pagination>
    </page>
</template>
<style lang="stylus">
    .aliexpress-windows-list{
        .el-form{
            display: inline-block;
        }
        .el-form-item{
            margin:-3px 0;
        }
    }
</style>
<script>
    import {api_windows_list, api_aliexpress_sale_list, api_windows_detail} from "../../../../api/aliexpress-windows";
    import viewProduct from "./view-product.vue";
    export default {
    	page:{},
        refresh(){
            this.searchData = {
                account_id:'',
                left_count:'',
                page:1,
                pageSize:50,
            };
            this.init();
        },
        data(){
            return {
                firstLoading: true,
                loading:false,
                account_list:[],
                searchData:{
                    account_id:'',
                    left_count:'',
                    page:1,
                    pageSize:50,
                },
                tableData:[],
                count:0,
                viewVisible:false,
                //橱窗详情
                product:{
                    account:{
                        code:''
                    },
                    used_count:'',
                    left_count:'',
                    list:[]
                },
                clears:{
                    account_id:'',
                    left_count:'',
                    page:1,
                    pageSize:50,
                }
            }
        },
        mounted(){
    	    this.init_accountList();
            this.init();
        },
        filters:{
            get_realname(val){
                //TODO：因为这个地方可能会出现channer为空的现象所以需要进行保护但是报错将不会再显示
                try{
                    return val.channer.user.realname;
                } catch(error){
                    return '';
                }
            }
        },
        methods: {
            init(){
                this.loading = true;
                this.$http(api_windows_list, this.searchData).then(res=>{
                    this.tableData = res.data.map(row=>{
                        let left_count = row.window_count - row.used_count;
                        this.$set(row, 'left_count', left_count);
                        return row;
                    });
                    this.count = res.count;
                    this.loading = false;
                    this.firstLoading = false
                })
            },
            init_accountList(){
                this.$http(api_aliexpress_sale_list).then(res=>{
                    this.account_list = res.account;
                }).catch(code=> {
                    this.$message({type:"error",message:code.message || code});
                });
            },
            //分页器
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
            //点击查看橱窗产品
            view_product(id){
                this.$http(api_windows_detail, id).then(res=>{
                    this.product = res;
                    this.viewVisible = true;
                }).catch(code=> {
                    this.$message({type:"error",message:code.message || code});
                });
            }
        },
        computed: {
    	    emptyText(){
    	        return this.firstLoading?'等待请求数据中...':'暂无数据'
            }
        },
        watch: {},
        props: {},
        components: {
            viewProduct,
            searchCard:require('../../../../components/search-card.vue').default,
            uiTip:require('../../../../components/ui-tip').default
        },
    }
</script>
