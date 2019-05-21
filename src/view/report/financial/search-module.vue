<template>
    <div class="c-financial-sc">
        <search-card @search="search" :params="searchData" :clears="clears">
            <div>
                <label-item label="站点：" v-show="siteOptions.length" class="mr-sm">
                    <!--<el-select-->
                        <!--class="s-width-default width-xs"-->
                        <!--filterable clearable-->
                        <!--v-sf.site_code-->
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
                <label-item label="账号简称：" class="mr-sm">
                    <!--<el-select :disabled="accoutOptions.length<=1"-->
                               <!--filterable clearable-->
                               <!--class="s-width-default"-->
                               <!--v-sf.account_id-->
                               <!--:placeholder="accountPlaceholder"-->
                               <!--v-model="searchData.account_id">-->
                        <!--<el-option v-for="item in accoutOptions"-->
                                   <!--:label="item.label"-->
                                   <!--:value="item.value"-->
                                   <!--:key="item.value">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                    <select-account
                        class="s-width-default"
                        ref="selectAccount"
                        v-model="searchData.account_id"
                        :param="{channel_id: channelId, site_code: searchData.site_code}"
                        type="account"
                    ></select-account>
                </label-item>
                <label-item label="发货仓库：" class="mr-sm">
                    <!--<el-select class="s-width-default"-->
                               <!--v-model="searchData.warehouse_id"-->
                               <!--v-sf.warehouse_id-->
                               <!--filterable clearable>-->
                        <!--<el-option v-for="item in warehouseList"-->
                                   <!--:key="item.value"-->
                                   <!--:label="item.label"-->
                                   <!--:value="item.value"></el-option>-->
                    <!--</el-select>-->
                    <select-account
                        class="s-width-default"
                        v-model="searchData.warehouse_id"
                        type="warehouse_all"
                    ></select-account>
                </label-item>
                <label-item class="mr-sm">
                    <el-select v-model="searchData.time_field"
                               class="s-width-small mr-sm"
                               v-sf.time_field>
                        <el-option v-for="type in time_type_list"
                                   :key="type.value"
                                   :label="type.label"
                                   :value="type.value">
                        </el-option>
                    </el-select>
                    <el-date-picker
                        v-sf.time_start
                        v-model="searchData.time_start"
                        type="date"
                        placeholder="选择日期"
                        class="inline date"
                        :picker-options="inputTimeStart">
                    </el-date-picker>
                    <label>&nbsp;--&nbsp;</label>
                    <el-date-picker
                        v-sf.time_end
                        v-model="searchData.time_end"
                        type="date"
                        placeholder="选择日期"
                        class="inline date"
                        :picker-options="inputTimeEnd">
                    </el-date-picker>
                </label-item>
            </div>
            <div class="mt-xs inline newrow">
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
                        v-model="searchData.seller_id"
                        type="seller"
                    ></select-account>
                </label-item>
                <label-item label="订单号：" class="mr-sm">
                    <el-input v-model="searchData.order_number" class="inline width-super" placeholder="请输入..."></el-input>
                </label-item>
            </div>
        </search-card>
    </div>
</template>
<style lang="stylus">
.c-financial-sc {
    .newrow {
        vertical-align baseline
    }
}
</style>
<script>
    import {api_get_channel, api_account_list, api_get_warehouse} from  '@/api/report-channel'
    export default {
        data(){
            return {
                siteOptions:[],
                accoutOptions:[],
                warehouseList:[],
                time_type_list:[
                    {label:'发货日期',value:'shipping_time'},
                    {label:'付款日期',value:'pay_time'}
                ],
                searchData:{
                    channel_id:this.channelId,
                    site_code:'',
                    account_id:"",
                    seller_id: '',
                    order_number: '',
                    warehouse_id:"",
                    time_field:'shipping_time',
                    time_start:new Date(Date.now()).setDate(1),
                    time_end:Date.now(),
                    page:1,
                    pageSize:10
                },
                clears:{
                    channel_id:this.channelId,
                    site_code:'',
                    account_id:"",
                    seller_id: '',
                    order_number: '',
                    warehouse_id:"",
                    time_field:'shipping_time',
                    time_start:new Date(Date.now()).setDate(1),
                    time_end:Date.now(),
                    page:1,
                    pageSize:10
                },
                inputTimeStart: {
                    disabledDate: (time)=> {
                        if(this.searchData.time_end){
                            return time.getTime() > this.searchData.time_end;
                        }else {
                            return false
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time)=> {
                        if(this.searchData.time_start){
                            return time.getTime() < this.searchData.time_start || time.getTime() > Date.now();
                        }else {
                            return false
                        }
                    }
                },//结束时间
            }
        },
        mounted(){
            this.warehouse_remote();
            this.get_site(this.searchData.channel_id);
        },
        methods: {
            init(){
                this.$emit('init-data', this.searchData);
            },
            site_remote(){
                return this.$http(api_get_channel_categories,{}).then(res=>{
                    return Promise.resolve(res.map(cate=>{
                        return {label:cate.name,value:cate.id};
                    }));
                }).catch(code=>{
                    console.log(code);
                });
            },
            warehouse_remote(){
                this.$http(api_get_warehouse).then(res=>{
                    res.forEach(row => {
                        this.warehouseList.push({label: row.name, value: row.id});
                    });
                    this.warehouseList.unshift({label: '全部', value: ''})
                });
            },
            get_site(channel_id){
                if(!channel_id)return
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    if(res.site.length<=0){
                        if(res.account.length>0){
                            res = res.account;
                            this.accoutOptions = [{label:"全部",value:""},...res];
                        }
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
            search(){
                this.init();
            },
            clearSearch(data){
                Object.keys(data).forEach(key=>{
                    data[key] = "";
                });
                this.searchData.page = 1;
                this.searchData.pageSize = 20;
                this.searchData.channel_id = 2;
                this.searchData.time_field = 'shipping_time';
                this.searchData.time_start = (new Date(Date.now()).setDate(1));
                this.searchData.time_end=Date.now();
                this.init();
            },
            sale_fix_result(res){
                return res.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
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
            }
        },
        watch: {
            'searchData.site_code'(val){
                this.searchData.account_id = "";
                // this.get_account(this.searchData.channel_id,val);
                this.$nextTick(() => {
                    this.$refs.selectAccount.get_list()
                })
            },
        },
        props: {
            channelId: {
                required: true
            }
        },
        components: {
            labelItem:require('@/components/label-item.vue').default,
            selectRemote:require('@/components/select-remote.vue').default,
            searchCard:require('@/components/search-card.vue').default,
            paramAccount:require("@/api-components/param-account.vue").default,
            selectAccount: require('@/api-components/select-account').default
        },
    }
</script>
