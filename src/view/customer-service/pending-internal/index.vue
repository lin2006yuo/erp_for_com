<template>
        <page class="p-index">
            <card-search :search-data="searchData"
                         :msg-type="msgType"
                         :account-id="accountId"
                         @search="search"
                         @select-boxs="select_boxs"
                         @select-bank="select_bank"
                         @select-type="select_type">
            </card-search>
            <table-data :table-data="tableData"
                        :total="total"
                        :loading="loading"
                        :search-data="searchData"
                        @select-total="select_total">
            </table-data>
            <add-accounts v-model="addAccounts"
                          :title="title"
                          :add-form="addForm"
                          :table-data="tableData"
                          @keep="keep">
            </add-accounts>
        </page>
    </template>
    <style lang="stylus">

    </style>
    <script>
        import {api_message_list,api_message_total,api_message_transfer} from '@/api/message-transfer'
        export default{
            page:{
                devinfo:{
                    frontEnd:'汤敏',
                    backEnd:'张冬冬',
                    createTime:'2018-8-22',
                    updateTime:'2018-8-24'
                }
            },
            data(){
                return{
                    loading:false,
                    searchData:{
                        channel_id:1,
                        customer_id:'',
                        account_id:'',
                        msg_type:'',
                        time_start:'',
                        time_end:'',
                    },
                    tableData:{
                        list:[],
                    },
                    msgType:[],
                    accountId:[],
                    total: 0,
                    addAccounts:false,
                    title:'',
                    addForm:{},
                    buttonInit:0
                }
            },
            refresh(){
                this.init();
            },
            mounted(){
                this.init();
                this.come_list();
            },
            methods:{
                select_total(row,item){
                    this.addAccounts = true;
                    this.title = `账号：${item.account_code}(${item.total})`;
                    this.addForm = {
                        account_id:item.account_id,
                        from_customer_id:row.customer_id,
                        to_customer_id:'',
                        total:item.total,
                        remark:'',
                        account_total:item.total,
                    };
                },
                keep(val){
                    let parmes = val;
                    this.$set(parmes,'channel_id',this.searchData.channel_id);
                    this.$set(parmes,'time_start',this.searchData.time_start);
                    this.$set(parmes,'time_end',this.searchData.time_end);
                    this.$set(parmes,'msg_type',this.searchData.msg_type);
                    this.$http(api_message_transfer,parmes).then(res=>{
                        this.addAccounts = false;
                        this.$message({type: "success", message: res.message || res});
                        this.init()
                    }).catch(code=>{
                        this.$message({type: "error", message: code.message || code})
                    })
                },
                search(){
                    this.init();
                    this.come_list();
                },
                select_boxs(val){//---平台
                    this.buttonInit++;
                    this.searchData.channel_id = val;
                    if(this.buttonInit>2){
                        this.come_list();
                        this.init();
                    }
                },
                select_bank(val){//---账号
                    this.buttonInit++;
                    this.searchData.account_id = val;
                    if(this.buttonInit>2){
                        this.init();
                    }
                },
                select_type(val){//---类型
                    this.buttonInit++;
                    this.searchData.msg_type = val;
                    if(this.buttonInit>2){
                        this.init();
                    }
                },
                init_params(){
                    let params = clone(this.searchData);
                    if (this.searchData.time_start) {
                        params.time_start =datef("YYYY-MM-dd",this.searchData.time_start/1000)
                    }else {
                        params.time_start="";
                    }
                    if (this.searchData.time_end) {
                        params.time_end =datef("YYYY-MM-dd",this.searchData.time_end/1000)
                    }else {
                        params.time_end="";
                    }
                    return params
                },
                init(){
                    this.loading = true;
                    let params = this.init_params();
                    this.$http(api_message_list,params).then(res=>{
                        this.loading = false;
                        this.searchData.channel_id = res.channel_id;
                        this.tableData.list = res.data;
                    });
                },
                come_list(){
                    let params = this.init_params();
                    delete params.msg_type;
                    this.accountId = [];
                    this.msgType = [];
                    this.$http(api_message_total,params).then(res=>{
                        res.data.accounts.shift();
                        this.accountId = res.data.accounts.map((row ,index)=> ({
                            label: row.label,
                            value: row.value,
                            count: row.count,
                            showSearch: index<10?true:false,
                            showDialog: true
                        }));
                        this.msgType = res.data.types;
                    });
                },
            },
            computed:{},
            components:{
                cardSearch:require('./card-search.vue').default,
                tableData:require('./table-data.vue').default,
                addAccounts:require('./add-accounts.vue').default
            }
        }
    </script>
