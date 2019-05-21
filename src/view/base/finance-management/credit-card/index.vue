<template>
        <page class="p-index">
            <card-search :search-data="searchData" :clears="clears"
                         @search="init"
                         :status="status"
                         :card-listalan="cardListalan"
                         @init-params="init_params"></card-search>
            <div class="ml-sm mt-xs mb-xs">
                <el-button type="primary" size="mini" @click="click_credit">添加</el-button>
                <el-button size="mini" type="primary" @click.native="showImport=true">导入</el-button>
            </div>
            <data-table :table-data="tableData"
                        :loading="loading"
                        @look-over="look_over"
                        @edit-credit="edit_credit"
                        @submit="init"
                        @sort-change="sort_change"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"></data-table>
            <add-credit v-model="creditAdd"
                        :title="title"
                        :bank-list="bankList"
                        :credit-data="creditData"
                        :card-listal="cardListal"
                        @submit="init"></add-credit>
            <look-card v-model="lookCard" :title="title"
                       :look-data="lookData"></look-card>
            <edit-card v-model="editCredit" :title="title"
                       :look-data="lookData"
                       :bank-list="bankList"
                       :card-listal="cardListal"
                       @submit="init"></edit-card>
            <import-excel
                    v-model="showImport"
                    @files-update="init"
                    :export-api="export_transfer_template"
                    :import-api="import_transfer"></import-excel>
        </page>
    </template>
    <style lang="stylus">

    </style>
    <script>
        import {api_credit_card,api_bank_account,api_card_edit,api_card_category,api_post_credit_card_batch_import,api_get_import_template} from '@/api/credit-card';
        export default{
            data(){
                return{
                    export_transfer_template:api_get_import_template,
                    import_transfer:api_post_credit_card_batch_import,
                    loading:false,
                    cardListal:[],
                    cardListalan:[],
                    status:[
                        {label:'全部',value:''},
                        {label:'正常',value:1},
                        {label:'异常',value:2},
                        {label:'注销',value:3},
                    ],
                    searchData:{
                        card_status:1,
                        snType:'card_number',
                        snText:'',
                        card_category:'',
                        account_count_start:'',
                        account_count_end:'',
                        taskCondition:'eq',
                        taskTime:''
                    },
                    clears:{
                        card_status:'',
                        snType:'card_number',
                        snText:'',
                        card_category:'',
                        account_count_start:'',
                        account_count_end:'',
                        taskCondition:'eq',
                        taskTime:''
                    },
                    tableData:{
                        data:[],
                        page:1,
                        pageSize:50,
                        count:0
                    },
                    creditAdd:false,
                    title:'',
                    creditData:{},
                    bankList:[],
                    lookCard:false,
                    lookData:{},
                    editCredit:false,
                    rowId:'',
                    order_by:'',
                    sort:'',
                    showImport:false,
                }
            },
            mounted(){
                this.init();
                this.bank_account();
                this.card_category();
            },
            methods:{
                init_params(){
                    let curBtn = this.status;
                    this.status = [];
                    this.$nextTick(()=>{
                        this.status = curBtn;
                    })
                },
                sort_change(val){
                    if(!val.column||!val.column.label)return;
                    switch(val.column.label){
                        case '被绑定账号数' :
                            this.order_by = 'account_count';
                            break;
                        case '添加时间':
                            this.order_by = 'create_time';
                            break;
                        default:
                            this.order_by = '';
                    }
                    this.sort = val.order==='ascending'?'asc':'desc';
                    this.init();
                },
                init(){
                    this.loading = true;
                    let data = clone(this.searchData);
                    this.$set(data,'page',this.tableData.page);
                    this.$set(data,'pageSize',this.tableData.pageSize);
                    this.order_by&&this.$set(data,'order_by',this.order_by);
                    this.sort&&this.$set(data,'sort',this.sort);
                    this.$http(api_credit_card,data).then(res=>{
                        this.tableData.data = res.data;
                        this.tableData.count = res.count;
                        this.loading = false;
                    });
                },
                click_credit(){//---添加
                    this.creditAdd = true;
                    this.title = `添加`;
                    this.creditData = {
                        card_number:'',
                        card_category:'',
                        card_master:'',
                        card_status:'',
                        validity_date:'',
                        security_code:'',
                        bank_id:'',
                        synchronize_status:0,
                    };

                },
                card_category(){//---获取信用卡类别
                    this.$http(api_card_category).then(res=>{
                        this.cardListal = res.map(row=>{
                            return {
                                label:row.credit_category,
                                value:row.credit_category
                            }
                        });
                        this.cardListalan = clone(this.cardListal);
                        this.cardListalan.unshift({label:'全部',value:''});
                    });
                },
                bank_account(){//---获取银行信息
                    this.$http(api_bank_account).then(res=>{
                        this.bankList = res.map(row=>{
                            return {
                                label: row.bank_name,
                                value: row.id,
                            }
                        });
                    });
                },
                look_over(row){//---查看
                    this.rowId = row.id;
                    this.title = `查看信用卡：${row.card_number} 信息`;
                    this.card_edit();
                },
                edit_credit(row){//---编辑
                    this.rowId = row.id;
                    this.title = `编辑信用卡：${row.card_number} 信息`;
                    this.card_edit();
                },
                card_edit(){
                    this.$http(api_card_edit,this.rowId).then(res=>{
                        this.lookData = {
                            bank:res.bank,
                            creator:res.creator,
                            create_time:res.create_time,
                            card_category:res.card_category,
                            card_number:String(res.card_number),
                            card_master:res.card_master,
                            bank_id:res.bank_id,
                            validity_date:res.validity_date,
                            security_code:res.security_code,
                            synchronize_status:res.synchronize_status,
                            card_status:res.card_status,
                            id:this.rowId
                        };
                        if(this.title.includes('查看')){
                            this.lookCard = true;
                        }else {
                            this.editCredit = true;
                        }
                    });
                },
                handleSizeChange(val) {//------------分页
                    this.tableData.page = 1;
                    this.tableData.pageSize = val;
                    this.init();
                },
                handleCurrentChange(val) {//------------分页
                    this.tableData.page = val;
                    this.init();
                },
            },
            components:{
                cardSearch: require("./card-search.vue").default,
                dataTable: require("./data-table.vue").default,
                addCredit: require("./add-credit.vue").default,
                lookCard: require("./look-card.vue").default,
                editCard: require("./edit-card.vue").default,
                importExcel: require('./import-excel.vue').default,
            }
        }
    </script>