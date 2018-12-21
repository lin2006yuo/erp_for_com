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
                <el-select filterable clearable
                           class="width-xs"
                           placeholder="加载中..."
                           v-sf.account_id
                           v-model="searchData.account_id">
                    <el-option v-for="item in accoutOptions"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="销售员：" class="mr-sm">
                <param-account
                        class="width-sm"
                        ref="paramSale"
                        v-model="searchData.saler_id"
                        v-sf.saler_id
                        :param="{type:'sales',data:{content:''}}"
                        :fixUrl="true"
                        :fixResult="sale_fix_result"
                        type="memberShipSales"
                        placeholder="请选择/输入..."
                        url="get|user/sales/staffs">
                </param-account>
            </label-item>
            <label-item>
                <el-select v-model="searchData.search_time"
                           class="width-xs mr-sm"
                           v-sf.search_time>
                    <el-option v-for="type in time_type_list"
                               :key="type.value"
                               :label="type.label"
                               :value="type.value">
                    </el-option>
                </el-select>
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
        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
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
                    {label:'海外仓利润汇总', value:'overseas'},
                    {label:'本地仓利润汇总', value:'local'},
                ],
                accoutOptions:[],
                searchData:{
                    channel_id:4,
                    report_type:'',
                    account_id:'',
                    saler_id:'',
                    search_time:'shipping_time',
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
                    {label:'发货日期',value:'shipping_time'},
                    {label:'付款日期',value:'paid_time'}
                ],
                clears:{
                    report_type:'',
                    account_id:'',
                    saler_id:'',
                    search_time:'shipping_time',
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
                this.get_account();
                this.$refs.paramSale.init();
                this.search();
            },
            get_account(){
                this.$http(api_account_list,{channel_id:this.searchData.channel_id,site_code:''}).then(res=>{
                    if(res.account.length>0){
                        res = res.account;
                        this.accoutOptions = [{label:"全部",value:""},...res];
                    }else{
                        this.accoutOptions = [{label:"",value:""}];
                    }
                }).catch(code=>{
                    console.log(code);
                })
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
                this.searchData.channel_id = 4;
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
            //分页器
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
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
        },
    }
</script>
