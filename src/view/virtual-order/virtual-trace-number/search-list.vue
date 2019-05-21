<template>
    <div class="c-card-search-virtual-trace-number">
        <search-card @search="search" :params="form" :clears="clears" @init-params="clearsData">
            <div>
                <label-buttons label="平台："
                               :buttons="channelList"
                               class="inline"
                               @select="select_status"></label-buttons>
                <label-item class="ml-sm mb-mini" label="站点：">
                    <super-select
                        storageKey="order_site"
                        v-sf.site class="inline width-sm"
                        v-model="form.site"
                        @change="select_site" :disabled="siteDisabled"
                        :is-paging="true"
                        :options='siteOptions'
                    ></super-select>
                    <!--<el-select v-sf.site_id class="inline width-sm"-->
                               <!--filterable clearable-->
                               <!--v-model="form.site"-->
                               <!--@change="select_site" :disabled="siteDisabled">-->
                        <!--<el-option v-for="(item, index) in siteOptions"-->
                                   <!--:label="item.label"-->
                                   <!--:key="index"-->
                                   <!--:value="item.value">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                </label-item>
                <label-item class="ml-sm mb-mini" label="账号简称：">
                    <super-select
                        storageKey="order_account"
                        class="inline width-sm"
                        v-model="form.account_id"
                        v-sf.account_id
                        :disabled="accountDisabled"
                        @change="select_account"
                        :is-paging="true"
                        :options='accoutOptions'
                    ></super-select>
                    <!--<el-select class="inline width-sm" @change="select_account"        旧版-->
                               <!--v-sf.account_id v-model="form.account_id" :disabled="accountDisabled"-->
                               <!--filterable clearable>-->
                        <!--<el-option v-for="(item, index) in accoutOptions"-->
                                   <!--:label="item.label"-->
                                   <!--:key="index"-->
                                   <!--:value="item.value"></el-option>-->
                    <!--</el-select>-->
                </label-item>
            </div>
                <el-select class="inline s-width-default"
                           v-sf.search_type
                           v-model="form.search_type">
                    <el-option v-for="item in searchList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <order-input v-model="form.search_value"
                             class="inline width-super"
                             @keydown='key_down'
                             v-sf.search_value
                             placeholder="可批量搜索，Shift+回车换行..."></order-input>
                <label-item label="处理状态：" class="ml-sm inline">
                    <el-select v-sf.handle_time  v-model="form.handle_time" clearable class="s-width-small">
                        <el-option v-for="item in treatmentList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </label-item>
                <label-item label="发货状态：" class="ml-sm inline">
                    <el-select v-sf.shipping_time  v-model="form.shipping_time" clearable class="s-width-small">
                        <el-option v-for="item in deliveryList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </label-item>
        </search-card>

    </div>
</template>
<style lang="stylus">
    .c-card-search-virtual-trace-number{
        .el-card{
            overflow: inherit;
        }
    }
</style>
<script>
    import {
        api_get_channel,
        api_account_list,
        api_get_orders_shop,
    } from '../../../api/virtual-trace-number';
    export default{
        page:{
            multiple:true,
        },
        refresh(){
            this.shippingList= [];
            this.siteOptions = [{label: "暂无数据", value: ""}];
            this.accoutOptions = [{label: "", value: ""}];
        },
        data(){
            return{
                url_account_list:config.apiHost+'orders/account',
                deliveryList:[],
                siteDisabled:true,
                accountDisabled:true,
                channelList:[],
                accoutOptions:[{label:"",value:""}],
                siteOptions:[{label:"暂无数据",value:""}],
                searchList:[
                    {label:'订单号',value:'order_number'},
                    {label:'平台订单号',value:'channel_number'},
                    {label:'真实包裹号',value:'package_true'},
                    {label:'真实跟踪号',value:'shipping_number_true'},
                    {label:'虚拟跟踪号',value:'shipping_number'},
                ],
                treatmentList:[
                    {label:'全部',value:''},
                    {label:'未处理',value:0},
                    {label:'已处理',value:1},
                ],
                deliveryList:[
                    {label:'全部',value:''},
                    {label:'已发货',value:0},
                    {label:'未发货',value:1},
                ],
                timer:null,/*防抖*/
            }
        },
        mounted(){
          this.get_channel();
        },
        methods:{
            fix_params({page,pageSize,keyword,channel_id}){
                return {
                    page:page,
                    pageSize:pageSize,
                    channel_id:channel_id,
                    content:keyword,
                };
            },
            /*----------------搜索*/
            search(){
                this.$emit('search')
            },
            /*-------------清除*/
            clearsData(){
                this.$emit('clear')
            },
            /*不同平台状态搜索*/
            select_status(val){
                this.form.channel_id=val;
                if (this.timer){
                    clearTimeout(this.timer);
                }
                this.timer = setTimeout(()=>{
                    this.get_site(this.form.channel_id);
                    this.get_account(this.form.channel_id, this.form.site);
                    this.siteDisabled = false;
                    this.accountDisabled = false;
                    this.search();
                },500);
            },
            /*多个输入按下*/
            key_down(){
                this.search();
            },
            /*平台*/
            get_channel(){
                this.$http(api_get_channel,{}).then(res=>{
                  this.channelList=[{label:"全部",value:""},...res];
                }).catch(code=>{
                    console.log(code);
                });
            },
            /*站点*/
            get_site(channel_id) {
                this.siteOptions = [{label: "暂无数据", value: ""}];
                if (!channel_id) return;
                this.$http(api_account_list, {channel_id: channel_id}).then(res => {
                    res = res.site;
                    if (res.length > 0) {
                        this.siteOptions = [{label: "全部", value: ""}, ...res];
                    } else {
                        this.siteOptions = [{label: "暂无数据", value: ""}];
                    }
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                })
            },
            /*账号简称*/
            get_account(channel_id, site_code) {
                this.accoutOptions = [{label: "", value: ""}];
                if (!channel_id) return;
                this.$http(api_account_list, {channel_id: channel_id, site_code: site_code}).then(res => {
                    res = res.account;
                    if (res.length > 0) {
                        this.accoutOptions = [{label: "全部", value: ""}, ...res];
                    } else {
                        this.accoutOptions = [{label: "", value: ""}];
                    }
                }).catch(code => {
                    thisnpm .$message({
                        type: 'error',
                        message: code.message || code
                    });
                })
            },
            select_site() {
                this.get_account(this.searchData.channel_id, this.searchData.site_id);
                this.init();
                this.get_order_count();
                // this.get_shipping();
            },
            select_account() {
                this.search();
            },
        },
        watch: {

        },
        computed: {
            dateEnd() {
                return datef("YYYY-MM-dd", Date.now() / 1000);
            },
            sitePlaceholder() {
                if (this.form.channel_id <= 0) {
                    return "请先选择平台";
                } else if (this.siteOptions.length <= 1) {
                    return "该平台下暂无站点";
                } else {
                    return "请选择站点"
                }
            },
            accountPlaceholder() {
                if (this.form.channel_id <= 0) {
                    return "请先选择平台";
                } else if (this.accoutOptions.length <= 1) {
                    return "该平台下暂无账号";
                } else {
                    return "请选择账号"
                }
            }
        },
        props:{
            form:{
                required:true,
                type:Object,
            },
            clears:{},
        },
        components:{
            labelButtons:require('@/components/label-buttons').default,
            searchCard: require('@/components/search-card').default,
            labelItem:require('../../../components/label-item.vue').default,
            selectRemote:require('../../../components/select-remote.vue').default,
            paramAccount:require('../../../api-components/param-account.vue').default,
            orderInput:require("@/components/order-input.vue").default,
        }
    }
</script>
