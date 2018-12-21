<template>
    <page class="p-index">
        <search-list :buttons="buttons"
                     @select="changeSelect"
                     @batch-search="batch_search"
                     @search_list="search_list"
                     @open-search="open_search"
                     :clears="clears"
                     :search-data="searchData">
        </search-list>
        <data-table :data-table="dataTable"
                    :loading="loading"
                    @files-update="init"
                    :export_data="export_data"
                    :first-loading="firstLoading"
                    @sort-click="sort_click">
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
        orderWish_list,orderWish_status
    } from'../../.././../api/order_wish';
    export default{
        page:{

        },
        refresh(){
            this.get_status();
        },
        data(){
            return{
                firstLoading: true,
                is_batch:"",
                buttons:[],
                dataTable:[],
                total:0,
                page:1,
                pageSize:50,
                searchData:{
                    snType:'order_id',
                    snText:'',
                    merchant_id:'',
                    shipped_on:'',
                    online:'',
                    snDate:'transaction_date',
                    date_b:(Date.now()-(14*24*60*60*1000)),
                    date_e:Date.now(),
                    status:-1,
                    sort_field:'',
                    sort_type:'',
                    is_transfer_money:'',
                    shipping_status:'',
                    refund_status:'',
                    pay_status:'',
                },
                clears:{
                    snType:'order_id',
                    snDate:'transaction_date',
                    date_b:(Date.now()-(14*24*60*60*1000)),
                    date_e:Date.now(),
                    shipped_on:'',
                    online:'',
                    status:-1,
                },
                loading:false,
            }
        },
        mounted(){
            this.get_status();
        },
        methods:{
            get_status(){
                let data = this.get_params();
                data.order_status = -1;
                this.$http(orderWish_status,this.get_params()).then(res=>{
                    res.forEach(btn=>{
                        this.$set(btn,'value',btn.code);
                    });
                    if(this.buttons.length===0){
                        this.buttons = res;
                    }else{
                        this.buttons.forEach(button=>{
                            let find = res.find(row=>{
                                return button.code===row.code
                            });
                            if(find){
                                button.count = find.count;
                            }
                        });
                    }

                }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
            },
            get_params(){
                 let data=window.clone(this.searchData);
                 this.$set(data,'page',this.page);
                 this.$set(data,'pageSize',this.pageSize);
                 let curString = data.snText.replace(new RegExp(' ','gm'),'\n');
                 let cur = data.snText.split('\n').filter(row=>!!row);
                 data.snText = cur&&cur.length>1?cur.map(row=>{return row.trim()}):data.snText;
                if(!!this.searchData.date_b){
                    let d = new Date(this.searchData.date_b);
                    data.date_b=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
                }else{
                    data.date_b=''
                }
                if(!!this.searchData.date_e){
                    let e = new Date(this.searchData.date_e);
                    data.date_e=e.getFullYear() + '-' + (e.getMonth() + 1) + '-' + e.getDate()
                }else{
                    data.date_e=''
                }
                return data;
            },
            batch_search(data,arr){
              this.init();
            },
            open_search(val){
                if(val){
                    this.is_batch = 1
                }else{
                    this.is_batch = "";
                    this.searchData.snText2="";
                    this.init();
                }
            },
            init(){
                this.loading=true;
                this.dataTable=[];
                this.$http(orderWish_list,this.get_params()).then(res => {
                    this.dataTable=res.data;
                    this.dataTable.forEach((data,i)=>{
                        this.$set(this.dataTable[i], 'show',false);
                    });
                    this.dataTable.forEach((data,i)=>{
                        this.$set(this.dataTable[i], 'isCheck',false);
                    });
                    this.total=res.count;
                    this.loading=false;
                    this.firstLoading = false
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
                        this.searchData.sort_field="total_cost";
                        break;
                    case "发货状态":
                        this.searchData.sort_field="shipped_on";
                        break;
                    case "付款状态":
                        this.searchData.sort_field="pay_time";
                        break;
                    case "下单时间":
                        this.searchData.sort_field="transaction_date";
                        break;
                    case '最迟上网时间':
                        this.searchData.sort_field='online';
                        break;
                }
                this.searchData.sort_type = val.order;
                this.init();
            },
            changeSelect(item){
                this.searchData.status = item.code;
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
            search_list(){//----------搜索
               this.get_status();
               this.init();
            },
        },
        computed:{
            export_data(){
                return this.get_params();
            }
        },
        components:{
            searchList,
            dataTable,
        }
    }
</script>
