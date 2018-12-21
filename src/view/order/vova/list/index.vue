<template>
    <page class="p-index">
        <search-module
                :search-data="searchData"
                :clears="clears"
                :button-list="buttonList"
                @search="search"
                @select="change_select"></search-module>
        <data-table
                :data-table="dataTable"
                class="mt-xs"
                :loading="loading"
                :total="total"
                :search-data="searchData"
                :first-loading="firstLoading"
                @sort-click="sort_click"
                @handle-size-change="handle_size_change"
                @handle-current-change="handle_current_change"
                @look-over="look_over"></data-table>
        <view-dialog v-model="viewDialog" :check-list="checkList"></view-dialog>
    </page>
</template>
<style lang="stylus" scoped>

</style>
<script>
    import {api_order_vova_list,api_order_vova_status,api_order_vova_check} from '../../.././../api/order_vova';
    export default {
        page: {
            devinfo: {
                frontEnd: '钱宇琨',
                backEnd: '翟雪莉',
                createdTime: '2018-09-04',
                updateTime: '2018-09-04'
            }
        },
        name: "index",
        refresh(){
            this.buttonList = [];
            this.get_status();
            this.init();
        },
        data(){
            return {
                total: 0,
                dataTable:[],
                loading: false,
                firstLoading: true,
                searchData:{
                    page: 1,
                    pageSize: 20,
                    status: -1,
                    account_id: '',
                    shipping_state: '',
                    snType: 'order_id',
                    snText: '',
                    date_b:(Date.now()-(14*24*60*60*1000)),
                    date_e:Date.now(),
                    sort_type: '',
                    sort_val: ''
                },
                clears:{
                    status: -1,
                    account_id: '',
                    snType: 'order_id',
                    snText: '',
                    date_b:(Date.now()-(14*24*60*60*1000)),
                    date_e:Date.now(),
                    sort_type: '',
                    sort_val: ''
                },
                buttonList:[],
                viewDialog:false,
                checkList:{}
            }
        },
        mounted(){
            this.get_status();
        },
        methods:{
            init(){
                this.loading=true;
                this.dataTable=[];
                this.$http(api_order_vova_list,this.get_params()).then(res => {
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
                })
            },
            get_status(){//------获取订单状态
                let data = this.get_params();
                data.status = -1;
                this.$http(api_order_vova_status,data).then(res=>{
                    res.forEach(btn=>{
                        let ret = '';
                        switch(Number(btn.label)){
                            case 0:
                                ret = '未确认';
                                break;;
                            case 1:
                                ret = '已确认';
                                break;
                            case 2:
                                ret = '已取消';
                                break;
                            default:
                                ret = '全部';
                        };
                        this.$set(btn,'value',btn.code);
                        btn.label = ret
                    });
                    if(this.buttonList.length===0){
                        this.buttonList = res;
                    }else{
                        this.buttonList.forEach(button=>{
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
            handle_size_change(val){//------------------切换条数
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val){//---------------切换页数
                this.searchData.page = val;
                this.init();
            },
            change_select(item){
                this.searchData.status = item.code;
                this.init();
            },
            search(){
                this.get_status();
                this.init()
            },
            //表格升降序
            sort_click(val){
                switch (val.label){
                    case "支付总额":
                        this.searchData.sort_type="total_amount";
                        break;
                    case "付款时间":
                        this.searchData.sort_type="confirm_time";
                        break;
                    case "平台发货状态":
                        this.searchData.sort_type="shipping_state";
                        break;
                    case "下单时间":
                        this.searchData.sort_type="confirm_time";
                        break;
                }
                this.searchData.sort_val = val.order==='asc'?1:2;
                this.init();
            },
            look_over(row){//-----------查看
                this.viewDialog = true;
                this.checkList = {};
                this.$http(api_order_vova_check,row.id).then(res => {
                    this.checkList = res;
                }).catch(code => {
                    this.$message({
                        showClose: true,
                        message: code.message || code,
                        type: 'error'
                    });
                });
            }
        },
        components:{
            searchModule:require('./search-module.vue').default,
            dataTable:require('./data-table').default,
            viewDialog:require('./view-dialog.vue').default
        }
    }
</script>