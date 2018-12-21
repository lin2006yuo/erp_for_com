<template>
    <page class="s-p-purchase-settlement">
        <search-card @search="search" :params="formData" :clears="clears">
            <label-buttons label="付款状态：" :buttons="payStatuses" @select="select_status"></label-buttons>
            <label-item label="供应商：">
                <supplier class="inline" v-sf.supplier_id :placeHolder="true"
                          v-model="formData.supplier_id"></supplier>
            </label-item>
            <label-item label="采购类型：" class="ml-sm">
                <el-select class="s-width-small" v-sf.purchase_type v-model="formData.purchase_type">
                    <el-option v-for="purchaseType in purchaseTypes"
                               :label="purchaseType.label"
                               :value="purchaseType.value"
                               :key="purchaseType.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="外部流水号：" class="ml-sm">
                <el-input v-sf.purchase_order :placeholder="`请输入外部流水号...`" v-model="formData.external_number" class="inline"></el-input>
            </label-item>
            <label-item label="采购员：" class="ml-sm">
                <purchaser v-sf.purchase_user_id v-model="formData.purchase_user_id" class="s-width-small"></purchaser>
            </label-item>
            <label-item label="采购单号：" class="ml-sm mr-sm">
                <!--<el-input v-sf.purchase_order_id :placeholder="`请输入采购单号...`" v-model="formData.purchase_order_id" class="inline"></el-input>-->

                <order-input v-model="formData.purchase_order_id"
                             class="inline width-super"
                             @keydown="search"
                             v-sf.purchase_order_id
                             placeholder="可批量搜索，Shift+回车换行..."></order-input>
            </label-item>
            <div class="br-show" style="display: none;height: 3px;"></div>
            <label-item>
                <el-select v-sf.dateType v-model="formData.dateType"
                           placeholder="请选择" class="inline s-width-default">
                    <el-option
                        :key="item.value"
                        v-for="item in dateTypes"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <span>：</span>
            </label-item>
            <label-item>
                <el-date-picker
                    style="width:120px"
                    v-sf.date_b
                    v-model="formData.date_b"
                    type="date"
                    placeholder="开始时间"
                    :picker-options="pickerstart"
                    class="date inline"
                >
                </el-date-picker>
                <span>&nbsp;--&nbsp;</span>
                <el-date-picker
                    style="width:120px"
                    v-sf.date_e
                    v-model="formData.date_e"
                    type="date"
                    class="date inline mr-sm"
                    placeholder="结束时间"
                    :picker-options="pickerend"
                >
                </el-date-picker>
            </label-item>
        </search-card>
        <data-table :tableData="tableData"
                    :loading="loading"
                    :search-data="searchData"
                    :isDisable='isDisable'
                    :isFirst="isFirst"
                    @reflash="search"></data-table>
        <el-pagination
            class="page-fixed"
            @size-change="size_change"
            @current-change="current_change"
            :current-page="searchData.page"
            :page-sizes="[20, 50, 100, 200,500]"
            :page-size="searchData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </page>
</template>
<style lang="stylus">
    .s-p-purchase-settlement {
        .el-card {
            overflow: visible;
        }
    }
</style>
<script>
    import  {publish_edit_user,publish_edit_supplier,api_finance_list} from "../../../api/finance-purchase"
    export default{
        page:{},
        refresh(){
            this.init();
        },
        data(){
            return{
                payStatuses:[
                    {label:'待付款',value:1},
                    {label:'已付款',value:2},
                    {label:'取消付款',value:3},
                ],
                purchaseTypes:[
                    {label:'全部',value:""},
                    {label:'样品',value:0},
                    {label:'采购',value:1},
                    {label:'补货',value:2},
                ],
                dateTypes:[
                    {label:'申请时间',value:"purchase_time"},
                    {label:'付款日期',value:"payment_time"}
                ],
                total:0,
                tableData:[],
                suppliers:[],
                searchData:{
                    page:1,
                    pageSize:50,
                    payment_status:1,
                    purchase_order_id:"",
                    purchase_type:"",
                    dateType:"payment_time",
                    date_b:"",
                    date_e:"",
                    purchase_user_id:"",
                    supplier_id:"",
                    external_number:"",
                },
                formData:{
                    purchase_order_id:"",
                    purchase_type:"",
                    dateType:"payment_time",
                    date_b:"",
                    date_e:"",
                    purchase_user_id:"",
                    supplier_id:"",
                    external_number:"",
                },
                clears:{
                    dateType:"payment_time",
                },
                loading:true,
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_e){
                            return  time.getTime() > this.searchData.date_e
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_b){
                            return time.getTime() < this.searchData.date_b
                        }else {
                            return false
                        }
                    }
                },
                isFirst: true
            };
        },
        computed:{
            // 未付款的 才能点击批量付款
            isDisable(){
                if(this.searchData.payment_status===1){
                    return false
                }else {
                    return  true
                }
            }
        },
        methods:{
            init_status_btn(){
                let curBtn = this.payStatuses;
                this.payStatuses = [];
                this.$nextTick(()=>{
                    this.payStatuses = curBtn;
                });
            },
            //初始化数据
            init(){
                this.tableData=[];
                this.loading=true;
                let data=window.clone(this.searchData);
                if(!!data.external_number.trim()){
                    data.external_number = data.external_number.trim();
                }
                if(this.searchData.date_b){
                    data.date_b= datef( "YYYY-MM-dd",this.searchData.date_b/1000)
                }else {
                    data.date_b="";
                }
                if(this.searchData.date_e){
                    data.date_e= datef( "YYYY-MM-dd",this.searchData.date_e/1000)
                }else {
                    data.date_e="";
                }
                if(this.searchData.purchase_order_id&&this.searchData.purchase_order_id.trim()){
                    data.purchase_order_id = JSON.stringify(data.purchase_order_id.trim().split('\n').map(row=>row.trim()).filter(row=>!!row));
                }else{
                    data.purchase_order_id = '';
                }
                this.$http(api_finance_list,data).then(res=>{
                    this.isFirst = false;
                    this.tableData=res.data;
                    this.loading=false;
                    this.total=res.count;
                }).catch(code=>{
                    console.log(code)
                })
            },
            //更改页条数
            size_change(val){
                this.searchData.pageSize=val;
                this.init()
            },
            //更改页数
            current_change(val){
                this.searchData.page=val;
                this.init()
            },
            //更改状态
            select_status(val){
                this.searchData.payment_status=this.payStatuses[val].value;
                this.init();
            },
            //搜索
            search(){
            	Object.assign(this.searchData,this.formData);
                this.init()
            },
            //清空搜索
            clear_search(){
                this.searchData.supplier_id="";
                this.searchData.purchase_type="";
                this.searchData.purchase_user_id="";
                this.searchData.purchase_order_id="";
                this.searchData.date_b="";
                this.searchData.date_e="";
                this.init();
            },
        },
        components:{
            labelButtons:require('@/components/label-buttons.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            dataTable:require('./data-table.vue').default,
            supplier:require('../../../api-components/supplier.vue').default,
            purchaser:require("../../../api-components/purchaser.vue").default,
            searchCard:require('@/components/search-card.vue').default,
            orderInput:require('@/components/order-input').default,
        }
    }
</script>
