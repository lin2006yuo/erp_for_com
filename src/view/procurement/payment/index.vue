<template>
    <page class="payment">
        <search-card @search="search" :params="searchData" :clears="clears">
            <label-buttons
                label="付款状态："
                :buttons="payStatuses"
                @select="select_status"
                title="请选择付款状态">
            </label-buttons>
            <el-row class="mb-xs">
                <label-item label="供应商：" title="请选择供应商">
                    <supplier
                        v-sf.supplier_id
                        :placeHolder="true"
                        v-model="searchData.supplier_id"
                        class="inline">
                    </supplier>
                </label-item>
                <label class="inline ml-sm" title="请选择结算方式">结算方式：</label>
                    <el-select class="self-width inline"  v-sf.balance_type
                               v-model="searchData.balance_type" multiple filterable
                               :class="[searchData.balance_type.length > 0 ? input_nomargin : '']"
                               style="width: 14%;" placeholder="请选择">
                        <el-option
                            :key="item.label"
                            v-for="item in balanceList"
                            :label="item.name"
                            :value="item.label">
                        </el-option>
                    </el-select>
                <label-item label="采购类型：" class="ml-xs" title="请选择采购类型">
                    <el-select
                        v-sf.purchase_type
                        v-model="searchData.purchase_type"
                        class="inline s-width-small">
                        <el-option v-for="purchaseType in purchaseTypes"
                                   :key="purchaseType.value"
                                   :label="purchaseType.label"
                                   :value="purchaseType.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="采购员：" class="ml-xs" title="请选择采购员">
                    <purchaser
                        class="inline s-width-default"
                        v-sf.purchase_user_id
                        v-model="searchData.purchase_user_id">
                    </purchaser>
                </label-item>
            </el-row>
            <label-item title="请选择采购单号">
                <el-select v-sf.snType
                           v-model="searchData.snType"
                           class="inline s-width-default">
                    <el-option
                        :key="item.value"
                        v-for="item in snType"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <orderInput class="inline width-super ml-sm" @keydown='key_down'  v-sf.snText
                            placeholder="可批量搜索，Shift+回车换行..."
                            v-model="searchData.snText">
                </orderInput>
            </label-item>
            <label-item  class="ml-xs">
                <el-select
                    v-sf.dateType
                    v-model="searchData.dateType"
                    class="inline s-width-small">
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
                    v-sf.date_b
                    v-model="searchData.date_b"
                    type="date"
                    placeholder="开始时间"
                    style="width:120px"
                    :picker-options="pickerstart" class="inline date">
                </el-date-picker>
                <span>&nbsp;--&nbsp;</span>
                <el-date-picker
                    v-sf.date_e
                    v-model="searchData.date_e"
                    type="date"
                    placeholder="结束时间"
                    style="width:120px"
                    :picker-options="pickerend" class="inline date mr-sm">
                </el-date-picker>
            </label-item>
        </search-card>
        <data-table :tableData="tableData"
                    :search-data="searchData"
                    :payment-status="payment_status"
                    :loading="loading"
                    :first-loading="firstLoading"
                    @reflash="search"
                    @search="search">
        </data-table>
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
    .payment{
        .el-card{
            overflow: visible;
        }
        .self-width .el-select__tags{
            height: 30px!important;
            width: 208px
            overflow-y: auto;
            >span{
                white-space: inherit;
            }
        }
    }
    .input-nomargin {
        .el-select__input {
            width: 1px !important;
            margin-left: 0 !important;
        }
    }

</style>
<script>
    import {
        publish_edit_user,api_finance_list,
        url_finance_list,
        url_publish_edit_user,
        api_finance_status,
    } from "../../../api/Payment";
    import {api_get_balance,url_get_balance}from '../../../api/assert-sup';
    export default{
        permission:{
            url_finance_list,
            url_publish_edit_user,
            url_get_balance
        },
        page:{
            devinfo:{
                frontEnd:'徐梦娇;黎宏珍',
                backEnd:'谭斌',
                createTime:'2017-3-29',
                updateTime:'2017-9-26'
            },
            beforeClose(){
                return true;
            }
        },
        refresh(){
            this.init();
        },
        data(){
            return{
                input_nomargin: "input-nomargin",
                firstLoading: true,
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
                url_supplier:config.apiHost+'supplier-offer/supplier',
                payStatuses:[],
                balanceList:[],
                purchaseTypes:[
                    {label:'全部',value:""},
                    {label:'样品',value:0},
                    {label:'采购',value:1},
                    {label:'补货',value:2},
                ],
                dateTypes:[
                    {label: '申请日期', value: "create_time"},
                    {label:'付款日期',value:"payment_time"},
                    {label:'采购日期',value:"purchase_time"}
                ],
                snType:[
                    {label:'付款申请单号', value: "id"},
                    {label:'采购单号', value: "purchase_order_id"},
                    {label:'外部流水号', value: "external_number"}
                ],
                total:0,
                tableData:[],
                suppliers:[],
                payment_status:'',
                searchData:{
                    page:1,
                    pageSize:50,
                    snText:"",
                    snType:"id",
                    purchase_type:"",
                    balance_type:[],
                    dateType:"payment_time",
                    date_b:"",
                    date_e:"",
                    purchase_user_id:"",
                    supplier_id:"",
                },
                clears:{
                    page:1,
                    pageSize:50,
                    dateType:"payment_time",
                    balance_type:[],
                },
                loading:true,
                loginInfo:{},
            };

        },
        mounted(){
            this.init();
            this.get_status();
            this.get_balance();
        },
        methods:{
            get_status(){
                this.$http(api_finance_status).then(res => {
                    this.payStatuses = [{label: '全部', value:''}, ...res];
                });
            },
            key_down(){
                this.search()
            },
            init_status_btn(){
                let curBtn = this.payStatuses;
                this.payStatuses = [];
                this.$nextTick(()=>{
                    this.payStatuses = curBtn;
                });
            },
            //初始化数据
            init(){
                let data = window.clone(this.searchData);
                if(data.snText.trim()){
                    data.snText = data.snText.replace(new RegExp(' ', 'gm'), '\n').trim().split('\n').map(row => row.trim()).filter(row => row !== '');
                }else{
                    data.snText = '';
                }
                if (this.searchData.date_b) {
                    let d = new Date(this.searchData.date_b);
                    data.date_b = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
                }else{
                    data.date_b = ''
                }
                if (this.searchData.date_e) {
                    let e = new Date(this.searchData.date_e);
                    data.date_e = e.getFullYear() + '-' + (e.getMonth() + 1) + '-' + e.getDate()
                }else{
                    data.date_e = ''
                }
                if(this.searchData.balance_type.length >0){
                    data.balance_type = data.balance_type.join(',');
                }else{
                    data.balance_type = '';
                }
                data.payment_status = this.payment_status;
                this.tableData = [];
                this.loading = true;
                this.$http(api_finance_list,data).then(res => {
                    // res.data.forEach(data => {
                    //     data.apply_amount = data.apply_amount.substring(0,data.apply_amount.indexOf(".")+3);//--保留两位小数
                    // });
                    this.tableData = res.data;
                    this.loading = false;
                    this.firstLoading = false;
                    this.total = res.count;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                })
            },
            //更改页条数
            size_change(val){
                this.searchData.pageSize = val;
                this.init()
            },
            //更改页数
            current_change(val){
                this.searchData.page = val;
                this.init()
            },
            //更改状态
            select_status(val){
                this.payment_status = this.payStatuses[val].value;
                this.init();
            },
            get_balance(){
                this.$http(api_get_balance).then(res=>{
                    this.balanceList =res;
                }).catch(code=>{
                    console.log(code);
                })
            },
            //搜索
            search(){
                this.init()
            },
            clear(){
                this.searchData.supplier_id = '';
                this.searchData.purchase_user_id = '';
                this.searchData.date_b = '';
                this.searchData.date_e = '';
                this.searchData.purchase_type = '';
                this.searchData.snText = '';
                this.init()
            },
            //供应商初始化
            fix_params({page,pageSize,keyword}){
                return {
                    page:page,
                    pageSize:pageSize,
                    content:keyword
                };
            },
        },
        components:{
            labelButtons:require('../../../components/label-buttons.vue').default,
            labelItem:require('../../../components/label-item.vue').default,
            dataTable:require('./data-table.vue').default,
            supplier:require('../../../api-components/supplier.vue').default,
            purchaser:require('../../../api-components/purchaser.vue').default,
            searchCard:require('../../../components/search-card.vue').default,
            orderInput:require("@/components/order-input.vue").default,
            scroll:require('../../../components/scroll.vue').default,
        }
    }
</script>
