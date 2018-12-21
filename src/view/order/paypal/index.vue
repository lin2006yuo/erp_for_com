<template>
    <page class="p-index">
        <search-list :buttons-data="buttonsData"
                     :search-data="searchData"
                     @search-list="search_list"
                     @change-select="change_select"
                     @clear="clear"
                     ref="search_list"></search-list>
        <el-row class="mt-sm">
            <permission tag="request-button"
                        class="ml-sm"
                        :route="apis.url_post_paypal_orders_sync"
                        :mintime="200"
                        req-key="url_post_paypal_orders_sync"
                        @click="sync_paypal_order">同步Paypal订单信息
            </permission>
        </el-row>
        <data-table
            class="mt-sm"
            :data-table="dataTable"
            :loading="loading"
            @selection-change="selectionChange"
            @sort="sort"
            :isFirst="isFirst"></data-table>
        <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page=searchData.page
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size=searchData.pageSize
                layout="total, sizes, prev, pager, next, jumper"
                :total=total>
        </el-pagination>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import searchList from'./searchList.vue';
    import dataTable from'./data-table.vue';
    import {orderPaypal_list,api_post_paypal_orders_sync,url_post_paypal_orders_sync} from '../../../api/order-paypal'

    export default{
    	page:{},
        refresh(){
            this.search_list();
        },
        permission:{
            url_post_paypal_orders_sync
        },
        data(){
            return {
                isFirst: true,
                buttonsData:[
                    {name:"全部",status:''},
                    {name:"成功",status:'Completed'},
                    {name:"失败", status:'unCompleted'}
                ],
                searchData:{
                    page:1,
                    pageSize:50,
                    payment_status:'',
                    snType:'txn_id',
                    snText:'',
                    sel_type:'txn_type',
                    sel_text:'',
                    snDate:'payment_date',
                    date_b:'',
                    date_e:'',
                    sort_field:"",
                    sort_by:""
                },
                dataTable:[],
                total:0,
                loading:true,
                selectList:[]
            }
        },
        created(){
            this.search_list();
        },
        methods: {
            selectionChange(val){
                this.selectList = val;
            },
            sync_paypal_order(){
                if(this.selectList.length===0){
                    this.$message({type:'warning',message:'请选择需要操作的数据！'});
                    this.$reqKey('url_post_paypal_orders_sync',false);
                    return
                }
                this.$http(api_post_paypal_orders_sync,{txn_ids:JSON.stringify(this.selectList.map(row=>row.id))}).then(res=>{
                    this.$message({type:'success',message:res.message||res});
                    this.search_list();
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_post_paypal_orders_sync',false);
                    },200);
                })
            },
            change_select(){
                this.search_list();
            },
            sort(col){
                if(col.column instanceof Object){
                    switch(col.column.label){
                        case "收款时间":
                            this.searchData.sort_field ="payment_date";
                            break;
                        case "收件人国家":
                            this.searchData.sort_field ="address_country";
                            break;
                        case "金额":
                            this.searchData.sort_field="amt";
                            break;
                    }
                    if(col.order==="descending"){
                        this.searchData.sort_by=0;
                    }else {
                        this.searchData.sort_by=1;
                    }
                }
                this.search_list();
            },
            handleSizeChange(pageSize){
                this.searchData.pageSize=pageSize;
                this.search_list()
            },
            handleCurrentChange(page){
                this.searchData.page=page;
                this.search_list()
            },
            search_list(){
                let data=window.clone(this.searchData);
                if(this.searchData.date_b){
                    var timestamp1 = Date.parse(new Date(datef("YYYY-MM-dd HH:mm:ss",this.searchData.date_b/1000)));
                    data.date_b = timestamp1 / 1000;
                }else{
                    data.date_b=''
                }
                if(this.searchData.date_e){
                    var timestamp2 = Date.parse(new Date(datef("YYYY-MM-dd HH:mm:ss",this.searchData.date_e/1000)));
                    data.date_e = timestamp2 / 1000;
                }else{
                    data.date_e=''
                }
                this.loading=true;
                this.$http(orderPaypal_list,data).then(res=>{
                    this.isFirst = false;
                    this.dataTable=res.data;
                    this.total=res.count;
                    this.loading=false
                }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
            },
            clear(){
                this.searchData.snType = 'txn_id';
                this.searchData.snText = '';
                this.searchData.snDate = 'payment_date';
                this.searchData.date_b = '';
                this.searchData.date_e = '';
                this.searchData.sel_type = 'txn_type';
                this.searchData.sel_text = '';
                this.search_list();
            }
        },
        components: {
            searchList,
            dataTable
        }
    }
</script>
