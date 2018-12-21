<template>
    <page class="p-index">
        <search-list :buttons="buttons"
                     @select="changeSelect"
                     @search_list="search_list"
                     :clears="clears"
                     :search-data="searchData"
                     class="mb-sm">
        </search-list>
        <data-table :data-table="dataTable"
                    :loading="loading"
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
    import searchList from './searchList.vue';
    import dataTable from './data-table.vue';
    import {api_order_pdd_list,api_order_pdd_status} from'../../.././../api/order-pdd';
    export default{
        page:{
            devinfo:{
                frontEnd:'熊辉',
                backEnd:'翟雪莉',
                createTime:'2018-9-20',
                updateTime:'2018-9-20'
            }
        },
        refresh(){
            this.buttons = [];
            this.get_status();
            this.init();
        },
        data(){
            return{
                firstLoading:true,
                is_batch:"",
                buttons:[],
                dataTable:[],
                total:0,
                page:1,
                pageSize:50,
                searchData:{
                    snType:'order_id',
                    snText:'',
                    account_id:'',
                    date_b:(Date.now()-(14*24*60*60*1000)),
                    date_e:Date.now(),
                    status:-1,
                    sort_val:'',
                    sort_type:'',
                },
                clears:{
                    snType:'order_id',
                    date_b:(Date.now()-(14*24*60*60*1000)),
                    date_e:Date.now(),
                },
                loading:false
            }
        },
        mounted(){
            this.get_status();
        },
        methods:{
            get_status(){
                let data = this.get_params();
                data.status = -1;
                this.$http(api_order_pdd_status,data).then(res=>{
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
            get_params() {
                let data = window.clone(this.searchData);
                this.$set(data, 'page', this.page);
                this.$set(data, 'pageSize', this.pageSize);
                let curString = data.snText.trim();
                if (curString.length > 0) {
                    let cur = data.snType==='name'? curString.split('\n').map(row=>row.trim()).filter(row => row !== ''):curString.replace(/\s/g,'\n').split('\n').map(row=>row.trim()).filter(row => row !== '');
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
                    data.date_e = datef('YYYY-MM-dd', data.date_e/1000);
                } else {
                    data.date_e = ''
                }
                return data;
            },
            init(){
                this.loading=true;
                this.dataTable=[];
                this.$http(api_order_pdd_list,this.get_params()).then(res => {
                    this.dataTable=res.data;
                    this.dataTable.forEach((data,i)=>{
                        this.$set(this.dataTable[i], 'show',false);
                        this.$set(this.dataTable[i], 'isCheck',false);
                    });
                    this.total=res.count;
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
                        this.searchData.sort_type="pay_amount";
                        break;
                    case "付款日期":
                        this.searchData.sort_type="confirm_time";
                        break;
                    case "平台发货状态":
                        this.searchData.sort_type="push_status";
                        break;
                    case "下单时间":
                        this.searchData.sort_type="created_time";
                        break;
                    case "最迟发货时间":
                        this.searchData.sort_type="last_ship_time";
                        break;
                }
                this.searchData.sort_val = val.order==='asc'?1:2;
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
            search_list(){
                this.get_status();
                this.init();
            },
        },
        computed:{},
        components:{
            searchList,
            dataTable,
        }
    }
</script>
