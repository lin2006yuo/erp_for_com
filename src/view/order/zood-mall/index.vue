<template>
    <page class="p-index">
        <search-data :search-data="searchData"
                     :buttons="buttons"
                     @select="change_select"
                     @search_list="search_list"
                     :clears="clears"></search-data>
        <table-data :form="form"
                    class="mt-xs"
                    :loading="loading"
                    :total="total"
                    :search-data="searchData"
                    :first-loading="firstLoading"
                    @sort-click="sort_click"
                    @handle-size-change="handle_size_change"
                    @handle-current-change="handle_current_change"
                    @look-over="look_over"></table-data>
        <view-dialog v-model="viewDialog" :check-list="checkList"></view-dialog>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_order_zoodmall_list,api_order_zoodmall_status,api_order_zoodmall_check} from "../../../api/order_zoodmall";
    export default {
        page: {
            devinfo: {
                frontEnd: '钱宇琨',
                backEnd: '李佰敏',
                createdTime: '2018-09-19',
                updateTime: '2018-09-19'
            }
        },
        refresh(){
            this.buttons = [];
            this.get_status();
            this.init();
        },
        data() {
            return {
                loading:false,
                firstLoading:true,
                total:1,
                buttons:[],
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
                form:[],
                checkList:{},
                viewDialog: false
            }
        },
        mounted(){
            this.get_status()
        },
        methods:{
            init(){
                this.loading=true;
                this.form=[];
                this.$http(api_order_zoodmall_list,this.get_params()).then(res => {
                    this.form=res.data;
                    this.form.forEach((data,i)=>{
                        this.$set(this.form[i], 'show',false);
                        this.$set(this.form[i], 'isCheck',false);
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
                })
            },
            get_status(){
                let data = this.get_params();
                data.status = -1;
                this.$http(api_order_zoodmall_status,data).then(res=>{
                    res.forEach(btn=>{
                        this.$set(btn,'value',btn.code);
                    });
                    if(this.buttons.length===0){
                        this.buttons = res;
                    }else{
                        this.buttons.forEach(button=>{
                            let find = res.find(row=>{
                                return Number(button.code)===Number(row.code)
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
            change_select(item){
                this.searchData.status = item.code;
                this.init();
            },
            sort_click(val){//-----升降序
                switch (val.label){
                    case "支付总额":
                        this.searchData.sort_type="order_amount";
                        break;
                    case "付款时间":
                        this.searchData.sort_type="time_paid";
                        break;
                    case "平台发货状态":
                        this.searchData.sort_type="time_all_shipped";
                        break;
                    case "下单时间":
                        this.searchData.sort_type="time_created";
                        break;
                    case "最迟发货时间":
                        this.searchData.sort_type="latest_shipped_time";
                        break;
                }
                this.searchData.sort_val = val.order==='asc'?1:2;
                this.init();
            },
            handle_size_change(val){
                this.pageSize=val;
                this.init();
            },
            handle_current_change(val){
                this.page=val;
                this.init();
            },
            look_over(row){//-----------查看
                this.viewDialog = true;
                this.checkList = {};
                this.$http(api_order_zoodmall_check,row.id).then(res => {
                    this.checkList = res;
                }).catch(code => {
                    this.$message({
                        showClose: true,
                        message: code.message || code,
                        type: 'error'
                    });
                });
            },
            search_list(){
                this.get_status();
                this.init();
            },
        },
        components: {
            searchData:require('./search-data.vue').default,
            tableData:require('./table-data.vue').default,
            viewDialog:require('./view-dialog.vue').default
        }
    }
</script>