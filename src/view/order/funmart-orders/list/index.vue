<template>
    <page class="p-index">
        <search-list
                     @select="changeSelect"
                     @search_list="search_list"
                     :select-list="accountList"
                     :clears="clears"
                     :search-data="searchData">
        </search-list>
        <data-table :data-table="dataTable"
                    :loading="loading"
                    :account-list="accountList"
                    :export_data="export_data"
                    :first-loading="firstLoading"
                    @sort-click="sort_click"
                    ref="cancelSelect">
        </data-table>
        <!--分页-->
        <div class="block">
            <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[20,50,100,200,500]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
    </page>
</template>
<style lang="stylus">
</style>
<script>
    import searchList from'./searchList.vue';
    import dataTable from'./data-table.vue';
    import {
        api_order_daraz_list,
        api_order_daraz_status,
        api_order_daraz_getAccount,
    } from'../../.././../api/order_daraz';
    import {
        api_order_funmart_list,
        api_get_accounts_list,
    } from'../../.././../api/order_funmart';
    export default{
        page:{
            devinfo:{
                frontEnd:'覃宏峰',
                backEnd:'蓝术术',
                createTime:'2018-5-24',
                updateTime:'2018-5-24'
            }
        },
        permission:{
        },
        refresh(){
            this.init();
        },
        data(){
            return{
                changeCancel: '',
                export_visible: false,
                firstLoading:true,
                is_batch:"",
                dataTable:[],
                total:0,
                page:1,
                pageSize:50,
                searchData:{
                    snType:'order_id',
                    snText:'',//筛选条件
                    account_id:'',//账号简称
                    date_b:(Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now(),
                    sort_field:'',//排序
                    sort_type:'',//排序方式  desc升序  asc降序
                },
            // (Date.now()-(14*24*60*60*1000)),Date.now(),
                clears:{
                    snType:'order_id',
                    date_b:(Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now(),
                    account_id:'',
                },
                loading:false,
                siteSelects:[],
                accountList:[],
                account_id:''
            }
        },
        mounted(){
            this.init();
            this.getAccount();
        },
        methods:{
            getAccount() {//获取账号简称
                this.$http(api_get_accounts_list,{channel_id:22}).then(res => {
                    this.accountList = res.data.map(row => {
                        return {
                            label: row.code,
                            value: row.id,
                        }
                    });
                    this.accountList.unshift({value:'',label:'全部'})
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'})
                });
            },
            get_params() {
                let data = window.clone(this.searchData);
                this.$set(data, 'page', this.page);
                this.$set(data, 'pageSize', this.pageSize);
                let curString = data.snText.trim();
                if (curString.length > 0) {
                    let cur = data.snType === 'itemid' ? curString.split('\n').map(row => row.trim()).filter(row => row !== '') : curString.replace(/\s/g, '\n').split('\n').map(row => row.trim()).filter(row => row !== '');
                    data.snText = JSON.stringify(cur);
                }else{
                    data.snText = '';
                }
                if (!!data.date_b) {
                    data.date_b = datef('YYYY-MM-dd', data.date_b/1000);
                } else {
                    data.date_b = ''
                }
                if (!!data.date_e) {
                    data.date_e =  datef('YYYY-MM-dd', data.date_e/1000);
                } else {
                    data.date_e = ''
                }
                if(data.account_id.length ===0){
                    data.account_id = '';
                }
                return data;
            },
            init(){
                this.loading=true;
                this.dataTable=[];
                this.$http(api_order_funmart_list,this.get_params()).then(res => {
                    this.dataTable=res.data;
                    this.dataTable.forEach((data,i)=>{
                        this.$set(this.dataTable[i], 'show',false);
                        this.$set(this.dataTable[i], 'isCheck',false);
                    });
                    this.total=Number(res.count);
                    this.loading=false;
                    this.firstLoading=false
                }).catch(code => {
                    this.$message({
                        showClose: true,
                        message: code.message || code,
                        type: 'error'
                    });
                    this.loading=false;
                })
            },
            //            表格升降序
            sort_click(val){
                switch (val.label){
                    case "支付总额":
                        this.searchData.sort_field="price";
                        break;
                    case "付款时间":
                        this.searchData.sort_field="t_paytime";
                        break;
                    case "平台发货状态":
                        this.searchData.sort_field="promised_shipping_time";
                        break;
                    case "最迟发货时间":
                        this.searchData.sort_field="last_time";
                        break;
                }
                this.searchData.sort_type = val.order.toUpperCase();
                this.init();
            },
            changeSelect(item){
                this.searchData.status = item.value;
                this.init();
            },
            handleSizeChange(val) {//---------------分页每页显示条数
                this.pageSize=val;
                this.init();
            },
            handleCurrentChange(val) {//------------分页当前页
                this.page=val;
                this.init();
            },
            search_list(){
                this.init();
            },
        },
        computed:{
            selectedList() {
                return this.dataTable.filter(row => {
                    return row.isCheck === true;
                })
            },
            export_data(){
                return this.get_params();
            },
        },
        components:{
            searchList,
            dataTable,
        }
    }
</script>
