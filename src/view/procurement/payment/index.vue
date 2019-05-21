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
                <label class="inline" title="请选择供应商"> 供应商：</label>
                <super-select class="inline s-width-large"
                              v-sf.supplier_id
                              v-model="searchData.supplier_id"
                              storageKey="virtual_supplier_packing"
                              :options="supplierList">
                </super-select>
                <label class="inline ml-sm" title="请选择结算方式">结算方式：</label>
                    <el-select class="self-width inline s-width-large"  v-sf.balance_type
                               v-model="searchData.balance_type" multiple filterable
                               placeholder="请选择">
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
                        class="inline s-width-default">
                        <el-option v-for="purchaseType in purchaseTypes"
                                   :key="purchaseType.value"
                                   :label="purchaseType.label"
                                   :value="purchaseType.value">
                        </el-option>
                    </el-select>
                </label-item>
                <el-select v-sf.staff_type
                           v-model="staff_type"
                           @change="typeChange"
                           class="s-width-default inline ml-sm">
                    <el-option v-for="item in buyerBrand"
                               :key="item.value"
                               :value="item.value"
                               :label="item.label"></el-option>
                </el-select>
                <super-select v-show="staff_type ==='purchaser'"
                              class="inline s-width-default"
                              v-sf.purchase_user_id
                              v-model="searchData.purchase_user_id"
                              storageKey="virtual_staffs"
                              :options="staffsList">
                </super-select>
                <super-select v-model="searchData.supply_chain_specialist"
                              v-show="staff_type === 'supply_chain_specialist'"
                              v-sf.supply_chain_specialist
                              class="inline s-width-default"
                              storageKey="virtual_specialist"
                              :options="chainSpecialist">
                </super-select>
                <super-select  v-model="searchData.payment_user_id"
                               v-show="staff_type === 'payment_user_id'"
                               v-sf.payment_user_id
                              class="inline s-width-default"
                              storageKey="virtual_pay_person"
                              :options="financeIdList">
                </super-select>
                <label class="ml-xs" title="请选择交易类型">交易类型：</label>
                <el-select v-model="searchData.transaction_type" class="inline s-width-small mr-sm" v-sf.transaction_type>
                    <el-option v-for="item in transactionList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <label class="" title="请选择是否上传商业发票">是否上传商业发票：</label>
                <el-select v-model="searchData.is_upload_invoice" class="inline s-width-small mr-sm" v-sf.is_upload_invoice>
                    <el-option v-for="item in invoiceList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <label title="请选择是否上传付款回单">是否上传付款回单：</label>
                <el-select v-model="searchData.is_upload_payment" class="inline s-width-small mr-sm" v-sf.is_upload_payment>
                    <el-option v-for="item in paymentList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </el-row>
            <label title="请选择1688账号">1688账号：</label>
            <super-select v-model="searchData.account_id"
                          v-sf.account_id
                          class="inline s-width-default mr-sm"
                          storageKey="virtual_1688_account"
                          :options="accountList">
            </super-select>
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
                    class="inline s-width-default">
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
                    @sort-change="sort_change"
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
        api_supplier_transaction_info,
        api_get_supply_chain_department_id,
        api_supply_chain_specialist,
        api_get_purchase_finance_id,
        api_finance_ali_account,
    } from "../../../api/payment";
    import {api_get_publish} from '../../../api/procurement-plan';
    import {api_get_balance,url_get_balance}from '../../../api/assert-sup';
    import {api_pack_getSupplier} from '../../../api/pack';
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
                staffsList: [],
                supplierList: [],
                chainSpecialist:[],
                chainDepartmentId:[],
                firstLoading: true,
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_e){
                            return  time.getTime() > this.searchData.date_e
                        }else {
                            return time.getTime()>Date.now();
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_b){
                            return time.getTime() < this.searchData.date_b || time.getTime() > Date.now();
                        }
                    }
                },
                url_supplier:config.apiHost+'supplier-offer/supplier',
                payStatuses:[],
                balanceList:[],
                invoice_images: [],
                payment_images: [],
                sort_field: '',
                sort_type: '',
                buyerBrand: [
                    {label: '采购员', value: 'purchaser'},
                    {label: '供应链专员', value: 'supply_chain_specialist'},
                    {label: '付款人', value: 'payment_user_id'}
                ],
                invoiceList: [//是否上传商业发票
                    {label: '全部', value: ''},
                    {label: '是', value: '1'},
                    {label: '否', value: '0'}
                ],
                paymentList: [//是否上传付款回单
                {label: '全部', value: ''},
                {label: '是', value: '1'},
                {label: '否', value: '0'}
            ],
                purchaseTypes:[
                    {label:'全部',value:""},
                    {label:'正常采购',value:1},
                    {label:'供应商多送',value:2},
                    {label:'样品',value:3},
                    {label:'备货计划',value:4}
                ],
                dateTypes:[
                    {label: '申请日期', value: "create_time"},
                    {label:'付款日期',value:"payment_time"},
                    {label:'采购日期',value:"purchase_time"},
                    {label:'最迟付款时间',value:"payment_last_time"}

                ],
                snType:[
                    {label:'付款申请单号', value: "id"},
                    {label:'采购单号', value: "purchase_order_id"},
                    {label:'外部流水号', value: "external_number"}
                ],
                transactionList:[],
                financeIdList: [],
                accountList: [],
                total:0,
                tableData:[],
                suppliers:[],
                payment_status:'',
                staff_type: 'purchaser',
                searchData:{
                    purchase_user_id:"",    //采购员
                    supply_chain_specialist: '', //供应链专员
                    payment_user_id: '', //付款人
                    is_upload_payment: '',
                    is_upload_invoice: '',
                    transaction_type: '', //交易类型
                    account_id: '', //1688账号
                    sort_field: '',
                    sort_type: '',
                    snText:"",
                    snType:"id",
                    purchase_type:"",
                    balance_type:[],
                    dateType:"payment_time",
                    date_b:"",
                    date_e:"",
                    supplier_id:"",
                    page:1,
                    pageSize:50,
                },
                clears:{
                    page:1,
                    pageSize:50,
                    dateType:"payment_time",
                    balance_type:[],
                    snType: 'id',
                    supply_chain_specialist: '',
                    purchase_user_id: '',
                    staff_type: 'purchaser',
                },
                loading:true,
                loginInfo:{},

            };
        },
        mounted(){
            this.init();
            this.get_status();
            this.get_balance();
            this.get_transaction_type();
            this.get_supply_chain_specialist_id();
            this.finance_id();
            this.account_1688();
            this.get_packing_supplier();
            this.get_packing_staffs();
        },
        methods:{
            get_packing_staffs() {//采购员
                this.$http(api_get_publish).then(res=>{
                    this.staffsList = res.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    });
                }).catch(code => {
                    console.log(code);
                })
            },
            get_packing_supplier() {
                this.$http(api_pack_getSupplier).then(res=>{
                    this.supplierList = res.map(row => {
                        return {
                            label: row.company_name,
                            value: row.id
                        }
                    });
                }).catch(code => {
                    console.log(code);
                })
            },
            account_1688() {//获取1688账号
                this.$http(api_finance_ali_account).then(res => {
                    this.accountList = res;
                }).catch(code => {
                    console.log(code);
                })
            },
            finance_id() { //获取付款人
                this.$http(api_get_purchase_finance_id).then(res => {
                    this.financeIdList = res.map(row => ({
                        label: row.realname,
                        value: row.id
                    }))
                })
            },
            typeChange(val) {
                if(val === 'purchaser') {
                  this.searchData.supply_chain_specialist = '';
                }else {
                    this.searchData.purchase_user_id = '';
                }
            },
            get_transaction_type(){
                this.$http(api_supplier_transaction_info).then(res => {
                    this.transactionList = [{label: '全部', value: ''}, ...res.map(row => ({
                        label: row.name,
                        value: row.label
                    }))];
                });
            },
            /*供应链专员*/
            get_supply_chain_specialist_id(){
                this.$http(api_get_supply_chain_department_id).then(res => {
                    this.chainSpecialist = res.map(row=>{return {value:row.id,label:row.realname}});
                }).catch(code => {
                    console.log(code);
                })
            },
            sort_change(val){
                if(!val.column||!val.column.label)return;
                switch(val.column.label){
                    case '申请付款总额':
                        this.sort_field = 'apply_amount';
                        break;
                    case '申请时间':
                        this.sort_field = 'create_time';
                        break;
                    case '付款时间':
                        this.sort_field = 'payment_time';
                        break;
                    case '最迟付款日期':
                        this.sort_field = 'payment_last_time';
                        break;
                    case '已付款金额':
                        this.sort_field = 'payment_amount';
                        break;
                    case '距离最迟付款时间':
                        this.sort_field = 'payment_last_time';
                        break;
                    default:
                        this.sort_field = '';
                }
                this.sort_type = val.order === 'descending' ? 'desc' : 'asc';
                this.init();
            },
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
                this.sort_field &&this.$set(data,'sort_field',this.sort_field );
                this.sort_type&&this.$set(data,'sort_type',this.sort_type);
                this.$http(api_finance_list,data).then(res => {
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
