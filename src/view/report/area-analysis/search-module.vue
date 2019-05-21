<template>
    <div class="c-search-time">
        <search-card @search="search" :params="searchData" :clears="clears">
            <div>
                <label-item label="平台：">
                    <!--<el-select-->
                        <!--class="width-sm"-->
                        <!--v-sf.channel_id-->
                        <!--@change="select_change(arguments,'channel_name')"-->
                        <!--filterable clearable-->
                        <!--v-model="searchData.channel_id">-->
                        <!--<el-option v-for="item in channelOptions"-->
                                   <!--:label="item.label"-->
                                   <!--:value="item.value"-->
                                   <!--:key="item.value">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                    <select-account
                        class="width-sm"
                        v-model="searchData.channel_id"
                        @change="select_change(arguments,'channel_name')"
                        type="platform"
                    ></select-account>
                </label-item>
                <label-item label="站点：" class="ml-xs">
                    <!--<el-select :disabled="siteOptions.length<=1"-->
                               <!--class="width-sm"-->
                               <!--v-sf.site_code-->
                               <!--filterable clearable-->
                               <!--:placeholder="sitePlaceholder"-->
                               <!--v-model="searchData.site_code">-->
                        <!--<el-option v-for="item in siteOptions"-->
                                   <!--:label="item.label"-->
                                   <!--:value="item.value"-->
                                   <!--:key="item.value">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                    <select-account
                        class="width-sm"
                        v-model="searchData.site_code"
                        type="site"
                        ref="selectSite"
                        :param="{channel_id: searchData.channel_id}"
                    ></select-account>
                </label-item>
                <label-item label="账号简称：" class="ml-sm">
                    <!--<el-select :disabled="accoutOptions.length<=1"-->
                               <!--class="width-sm"-->
                               <!--v-sf.account_id-->
                               <!--filterable clearable-->
                               <!--@change="select_change(arguments,'account_name')"-->
                               <!--:placeholder="accountPlaceholder"-->
                               <!--v-model="searchData.account_id">-->
                        <!--<el-option v-for="item in accoutOptions"-->
                                   <!--:label="item.label"-->
                                   <!--:value="item.value"-->
                                   <!--:key="item.value">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                    <select-account
                        class="width-sm"
                        v-model="searchData.account_id"
                        type="account"
                        ref="selectAccount"
                        :param="{channel_id: searchData.channel_id, site_code: searchData.site_code}"
                        @change="select_change(arguments,'account_name')"
                    ></select-account>
                </label-item>
                <label-item label="销售员：" class="ml-sm">
                    <!--<param-account-->
                            <!--class="width-sm"-->
                            <!--ref="paramDevelopment"-->
                            <!--v-model="searchData.seller_id"-->
                            <!--:fixUrl="true"-->
                            <!--:fixResult="development_fix_result"-->
                            <!--placeholder="请选择/输入..."-->
                            <!--type="memberShipDeveloper"-->
                            <!--url="get|user/sales/staffs"-->
                            <!--v-sf.developer_id>-->
                    <!--</param-account>-->
                    <select-account
                        class="width-sm"
                        v-model="searchData.seller_id"
                        type="seller"
                    ></select-account>
                </label-item>
            </div>
                <label-item label="国家：" class="ml-sm mt-xs">
                    <el-select v-model="searchData.country_code"
                            placeholder="请选择国家"
                            style="width: 200px;"
                            multiple filterable clearable>
                        <el-option
                                v-for="res in countryList"
                                :label="res.label"
                                :value="res.value"
                                :key="res.value"
                        ></el-option>
                    </el-select>
                </label-item>
                <label-item class="ml-xs">
                    <el-select v-model="searchData.snDate"
                               class="width-xs mr-sm"
                               v-sf.snDate>
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
                            class="inline date"
                            v-sf.date_e
                            :picker-options="inputTimeEnd">
                    </el-date-picker>
                </label-item> 
                <label-item class="ml-sm">
                    <el-select v-model="searchData.total_type"
                               class="width-xs mr-xs"
                               v-sf.snDate>
                        <el-option v-for="type in totalTypeList"
                                   :key="type.value"
                                   :label="type.label"
                                   :value="type.value">
                        </el-option>
                    </el-select>
                    <el-input type="number" v-model="searchData.total_b" class="width-mini" :min="0" /><label>&nbsp;--&nbsp;</label>
                    <el-input type="number" v-model="searchData.total_e" class="width-mini" :min="0"/>
                </label-item> 
        </search-card>
    </div>
</template>
<script>
    import {api_get_channel, api_account_list} from  '@/api/report-channel'
    import {api_get_currency} from '@/api/commodity-sales'
    import {api_get_categories} from '@/api/stock-control'
    import { api_get_country } from '@/api/after-sale'
    export default {
        data(){
            return {
                siteOptions:[{label:"",value:""}],
                accoutOptions:[{label:"",value:""}],
                channelOptions: [{label:"",value:""}],
                time_type_list:[
                    {label:'发货时间',value:'shipping_time'},
                    {label:'支付时间',value:'pay_time'},
                    {label:'下单时间',value:'order_time'},
                ],
                totalTypeList: [
                    {label:'订单量',value:'now_order_total'},
                    {label:'订单总额',value:'now_pay_total'},
                    {label:'客单价',value:'until_price'}
                ],
                countryList: [],
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
            }
        },
        mounted(){
            this.get_channel()
            this.get_site(this.searchData.channel_id);
            this.get_country()
        },
        methods: {
            development_fix_result(res){
                return  res.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
            },
            select_change(arg, name) {
                this.searchData[name] = arg[0].label || ''
            },
            get_channel() {
                this.$http(api_get_channel,{}).then(res=>{
                    this.channelOptions = [{label:'全部', value: ''}, ...res]
                }).catch(code=>{
                    console.log(code);
                });
            },
            get_site(channel_id){
                if(!channel_id)return this.siteOptions = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    if(res.site.length<=0){
                        if(res.account.length>0){
                            res = res.account;
                            this.accoutOptions = [{label:"全部",value:""},...res];
                        }else{
                            this.accoutOptions = [{label:"",value:""}];
                        }
                        this.siteOptions = [{label:"",value:""}]
                    }else{
                        res = res.site;
                        this.siteOptions = [{label:"全部",value:""},...res];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_account(channel_id,site_code){
                if(!channel_id||!site_code)return this.accoutOptions = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:channel_id,site_code:site_code}).then(res=>{
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
            get_country() {
                this.$http(api_get_country).then(res => {
                    this.countryList = res.map(r => ({
                        value: r.country_code,
                        label: r.country_cn_name
                    }))
                })
            },
            search(){
                this.$emit('search');
            },
        },
        computed: {
            accountPlaceholder(){
                if((this.searchData.site_code<=0&&this.accoutOptions.length>1) || this.searchData.site_code>0){
                    return "请选择账号";
                }else if(this.searchData.site_code<=0){
                    return "请先选择站点";
                }else if(this.accoutOptions.length<=1){
                    return "该站点下暂无账号";
                }
            },
            sitePlaceholder(){
                if(this.searchData.channel_id<=0){
                    return "请先选择平台";
                }else if(this.siteOptions.length<=1){
                    return "该平台下暂无站点";
                }else{
                    return "请选择站点"
                }
            },
        },
        watch: {
            'searchData.channel_id'(val){
                this.searchData.site_code ='';
                this.searchData.account_id = "";
                this.siteOptions = [{label:"",value:""}];
                this.accoutOptions = [{label:"",value:""}];
                // this.get_site(val);
                this.$nextTick(() => {
                    this.$refs.selectSite.get_list()
                    this.$refs.selectAccount.get_list()
                })
            },
            'searchData.site_code'(val){
                this.searchData.account_id = "";
                // this.get_account(this.searchData.channel_id,val);
                this.$nextTick(() => {
                    this.$refs.selectAccount.get_list()
                })
            },
        },
        props: {
            searchData:{
            	type:Object
            },
            clears:{
            	type:Object
            },
            warehouseList:{
            	type:Array
            }
        },
        components: {
            labelItem:require('../../../components/label-item.vue').default,
            selectRemote:require('../../../components/select-remote.vue').default,
            paramAccount:require('../../../api-components/param-account.vue').default,
            searchCard:require('../../../components/search-card.vue').default,
            selectAccount: require('@/api-components/select-account').default
        },
    }
</script>
<style lang="stylus" scoped>
    .c-search-time{
        >>> .el-input_inner{
            height: 30px!important
        }
        >>> .el-select__tags{
            height: 30px!important;
            width: 500px
            overflow-y: auto;
            >span{
                white-space: inherit;
            }
        }
        >>> .el-card {
            overflow visible
        }
    }
</style>
