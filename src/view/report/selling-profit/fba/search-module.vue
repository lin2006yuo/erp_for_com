<template>
    <div>
        <search-card class="selling-profit-card" @search="search" :params="searchData" :clears="clears" @init-params="init_status_btn">
            <div>
                <label-buttons @select="auto_action_select"
                               label=""
                               :buttons="autoActions"
                               class="inline">
                </label-buttons>
            </div>
            <label-item label="账号简称：" class="mr-sm">
                <!--<param-account-->
                    <!--class="mr-sm s-width-default"-->
                    <!--ref="paramAccount"-->
                    <!--v-sf.account_id-->
                    <!--v-model="searchData.account_id"-->
                    <!--:param="{channel_id: 2}"-->
                    <!--:refresh="true"-->
                    <!--:fixUrl="false"-->
                    <!--:fixResult="account_fix_result"-->
                    <!--type="memberShipAccount"-->
                    <!--url="get|orders/account">-->
                <!--</param-account>-->
                <select-account
                    class="s-width-default mr-sm"
                    v-model="searchData.account_id"
                    type="account"
                    :param="{channel_id: 2}"
                ></select-account>
            </label-item>
            <label-item label="销售员：" class="mr-sm">
                <!--<param-account-->
                        <!--class="width-sm"-->
                        <!--ref="paramSale"-->
                        <!--v-model="searchData.saler_id"-->
                        <!--v-sf.saler_id-->
                        <!--:param="{type:'sales',data:{content:''}}"-->
                        <!--:fixUrl="true"-->
                        <!--:fixResult="sale_fix_result"-->
                        <!--type="memberShipSales"-->
                        <!--placeholder="请选择/输入..."-->
                        <!--url="get|user/sales/staffs">-->
                <!--</param-account>-->
                <select-account
                    class="width-sm"
                    v-model="searchData.saler_id"
                    type="seller"
                ></select-account>
            </label-item>
            <label-item label="付款日期：">
                <!--<el-select v-model="searchData.search_time"
                           class="width-xs mr-sm"
                           v-sf.search_time>
                    <el-option v-for="type in time_type_list"
                               :key="type.value"
                               :label="type.label"
                               :value="type.value">
                    </el-option>
                </el-select>-->
                <el-date-picker
                        v-model="searchData.date_b"
                        type="date"
                        placeholder="选择日期"
                        class="inline date"
                        v-sf.date_b
                        :picker-options="inputTimeStart">
                </el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                        v-model="searchData.date_e"
                        type="date"
                        placeholder="选择日期"
                        class="inline date mr-sm"
                        v-sf.date_e
                        :picker-options="inputTimeEnd">
                </el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .selling-profit-card{
        overflow: visible;
    }
</style>
<script>
    import {api_account_list} from '../../../../api/selling-profit'
    export default {
        data(){
            return {
                autoActions:[
                    {label:'销售账号利润汇总表', value:'account'},
                    {label:'销售员利润汇总表', value:'seller'},
                    {label:'工厂灯利润汇总（无接口）', value:''},
                    {label:'非工厂灯利润汇总（无接口）', value:''},
                ],
                accoutOptions:[],
                searchData:{
                    channel_id:'',
                    report_type:'',
                    account_id:'',
                    saler_id:'',
                    date_b:new Date(Date.now()).setDate(1),
                    date_e:Date.now(),
                    page:1,
                    pageSize:20
                },
                urlsales:'get|user/sales/staffs',
                total:0,
                inputTimeStart: {
                    disabledDate: (time)=> {
                        if(this.searchData.date_e){
                            return time.getTime() > this.searchData.date_e;
                        }else {
                            return false
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time)=> {
                        if(this.searchData.date_b){
                            return time.getTime() < this.searchData.date_b;
                        }else {
                            return false
                        }
                    }
                },//结束时间
                time_type_list:[
                    // {label:'发货日期',value:'shipping_time'},
                    {label:'付款日期',value:'paid_time'}
                ],
                clears:{
                    report_type:'',
                    account_id:'',
                    saler_id:'',
                    date_b:new Date(Date.now()).setDate(1),
                    date_e:Date.now(),
                    page:1,
                    pageSize:20
                }
            }
        },
        mounted(){
            this.init();
        },
        methods: {
            init_status_btn(){
                let curBtn = this.autoActions;
                this.autoActions = [];
                this.$nextTick(()=>{
                    this.autoActions = curBtn;
                })
            },
            init(){
                this.search();
            },
            account_fix_result(res) {
                return res.account
            },
            auto_action_select(index){
                this.searchData.report_type = this.autoActions[index].value;
                this.$emit('init-data', this.searchData);
            },
            search(){
                this.$emit('init-data', this.searchData);
            },
            clearSearch(data){
                Object.keys(data).forEach(key=>{
                    data[key] = "";
                });
                this.searchData.page = 1;
                this.searchData.pageSize = 20;
                this.searchData.channel_id = '';
                this.searchData.time_field = 'shipping_time';
                this.init();
            },
            sale_fix_result(res){
                return  res.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
            },
        },
        computed: {
            sales:{
                get(){
                    return {label:this.searchData.saleman, value:this.searchData.saleman_id}
                },
                set(val){
                    this.searchData.saleman=val.label;
                    this.searchData.saleman_id=val.value;
                }
            },
        },
        watch: {},
        props: {
            channelId:{}
        },
        components: {
                labelItem:require('../../../../components/label-item.vue').default,
                paramAccount:require("../../../../api-components/param-account.vue").default,
                searchCard:require('../../../../components/search-card.vue').default,
                labelButtons:require('../../../../components/label-buttons.vue').default,
                selectAccount: require('@/api-components/select-account').default
        },
    }
</script>
