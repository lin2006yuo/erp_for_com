<template>
    <div class="c-card-search-order">
        <search-card @search="search" :params="form" :clears="clears">
            <el-row class="mb-mini">
                <el-cascader
                        v-model="form.order_status"
                        v-sf.status
                        expand-trigger="hover"
                        placeholder="请选择/输入订单状态"
                        :options="optionsList"
                        clearable
                        filterable
                        class="inline s-width-large"
                ></el-cascader>
                <label-item label="发货状态：" class="ml-sm">
                    <el-select v-sf.delivery_type  v-model="form.delivery_type" clearable class="s-width-small">
                        <el-option v-for="item in deliveryList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </label-item>
                <label-item label="平台：" class="ml-sm">
                    <super-select
                        storageKey="order_channel"
                        class="s-width-middle"
                        v-model="form.channel_id"
                        v-sf.channel_id
                        :is-paging="true"
                        :options='channelList'
                    ></super-select>
                    <!--<select-remote class="s-width-default"-->
                                   <!--v-sf.channel_id-->
                                   <!--v-model="form.channel_id"-->
                                   <!--:remote="channel_remote">-->
                    <!--</select-remote>-->
                </label-item>
                <label-item label="站点：" class="ml-xs">
                    <super-select
                        storageKey="order_site"
                        class="s-width-middle"
                        v-model="form.site"
                        v-sf.site
                        :disabled="siteOptions.length<=1"
                        :placeholder="sitePlaceholder"
                        :is-paging="true"
                        :options='siteOptions'
                    ></super-select>
                    <!--<el-select :disabled="siteOptions.length<=1"-->
                               <!--class="s-width-default"-->
                               <!--filterable clearable-->
                               <!--:placeholder="sitePlaceholder"-->
                               <!--v-sf.site-->
                               <!--v-model="form.site">-->
                        <!--<el-option v-for="item in siteOptions"-->
                                   <!--:label="item.label"-->
                                   <!--:value="item.value"-->
                                   <!--:key="item.value">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                </label-item>
                <label-item label="账号简称：" class="ml-sm">
                    <el-select v-model="form.account_type" v-sf.account_type
                               @change="change_search_type"
                               class="inline s-width-mini"
                               :disabled="accoutOptions.length<=1">
                        <el-option
                            v-for="res in searchTypeList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                        ></el-option>
                    </el-select>
                    <!--<el-select   v-model="form.account_id" v-sf.account_id-->
                               <!--v-if="form.account_type === 1"-->
                                <!--:disabled="accoutOptions.length<=1"-->
                               <!--:placeholder="accountPlaceholder"-->
                               <!--class="s-width-default ml-mini" clearable filterable>-->
                        <!--<el-option-->
                            <!--v-for="res in accoutOptions"-->
                            <!--:label="res.label"-->
                            <!--:value="res.value"-->
                            <!--:key="res.value"-->
                        <!--&gt;</el-option>-->
                    <!--</el-select>-->
                    <super-select   v-model="form.account_id"
                                    v-if="form.account_type === 1"
                                    :disabled="accoutOptions.length<=1"
                                    class="s-width-default ml-mini"
                                    :placeholder="accountPlaceholder"
                                    :options="accoutOptions"
                                    storageKey="memberShipAccountSelect">
                    </super-select>
                    <order-input v-model="form.account_code"
                                 v-if="form.account_type === 2&&form.channel_id !== ''"
                                 @keydown="search"
                                 class="inline s-width-default ml-mini"
                                 placeholder="空格分隔可批量搜索"></order-input>
                    <el-input disabled class="inline s-width-default ml-mini" v-if="form.account_type === 2&&form.channel_id === ''" placeholder="请先选择平台"></el-input>
                </label-item>
                <!--<label-item label="账号简称：" class="ml-sm">-->
                    <!--<el-select :disabled="accoutOptions.length<=1"-->
                               <!--filterable clearable-->
                               <!--multiple-->
                               <!--@remove-tag="remove_tag"-->
                               <!--:placeholder="accountPlaceholder"-->
                               <!--v-sf.account_id-->
                               <!--class="inline input-no-margin self-width"-->
                               <!--v-model="form.account_id">-->
                        <!--<el-option v-for="item in accoutOptions"-->
                                   <!--:label="item.label"-->
                                   <!--:disabled="item.disabled"-->
                                   <!--:value="item.value"-->
                                   <!--:key="item.value">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                <!--</label-item>-->
                <label-item label="店铺简称：" v-if="form.channel_id===7" class="ml-sm">
                    <el-select :disabled="shopOptions.length<=1"
                               filterable clearable
                               :placeholder="accountPlaceholder"
                               v-sf.shop_id
                               class="s-width-small"
                               v-model="form.shop_id">
                        <el-option v-for="item in shopOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="发货仓库：" class="ml-sm mr-sm">
                    <super-select
                        storageKey="order_warehouse"
                        class="s-width-small"
                        v-model="form.warehouse_id"
                        v-sf.warehouse_id
                        :is-paging="true"
                        :options='warehouseList'
                    ></super-select>
                    <!--<el-select v-sf.warehouse_id-->
                               <!--v-model="form.warehouse_id"-->
                               <!--class="s-width-small"-->
                               <!--filterable clearable>-->
                        <!--<el-option v-for="item in warehouseList"-->
                                   <!--:key="item.value"-->
                                   <!--:label="item.label"-->
                                   <!--:value="item.value"></el-option>-->
                    <!--</el-select>-->
                </label-item>
                <div class="br-show" style="height: 3px;display: none"></div>
                <label-item label="运输方式：">
                    <el-cascader
                        clearable
                        filterable
                        change-on-select
                        :disabled="shippingList.length<=0"
                        :placeholder="shippingPlaceholder"
                        class="inline s-width-large"
                        v-model="form.shipping"
                        expand-trigger="hover"
                        :options="shippingList"
                    ></el-cascader>
                </label-item>
                <label-item label="买家选择物流："
                            v-if="form.channel_id===1"
                            class="ml-sm mr-sm">
                    <super-select
                        storageKey="order_shipping"
                        v-sf.warehouse_id
                        v-model="form.buyer_selected_logistics"
                        class="s-width-middle"
                        :is-paging="true"
                        :options='buyerShippingList'
                    ></super-select>
                    <!--<el-select v-sf.warehouse_id-->
                               <!--v-model="form.buyer_selected_logistics"-->
                               <!--class="s-width-large"-->
                               <!--filterable clearable>-->
                        <!--<el-option v-for="(item,i) in buyerShippingList"-->
                                   <!--:key="`${item.value}${item.label}${i}`"-->
                                   <!--:label="item.label"-->
                                   <!--:value="item.value"></el-option>-->
                    <!--</el-select>-->
                </label-item>
            </el-row>
            <el-select class="inline s-width-default"
                       v-sf.snType
                       v-model="form.snType">
                <el-option v-for="item in connds"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
            <order-input v-model="form.batchText"
                         class="inline width-super"
                         @keydown='key_down'
                         v-sf.connd_value
                         placeholder="可批量搜索，Shift+回车换行..."></order-input>
            <label-item label="所属类型：" class="ml-sm">
                <el-select v-model="form.snValue"
                           class="inline s-width-default"
                           v-sf.snValue
                           clearable>
                    <el-option
                        v-for="res in belongType"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                    ></el-option>
                </el-select>
            </label-item>
            <el-select v-model="form.snUser"
                       @change="changeSnUser"
                       class="inline ml-sm s-width-small"
                       v-sf.snUser>
                <el-option
                    v-for="res in selectSnUser"
                    :label="res.label"
                    :value="res.value"
                    :key="res.value"
                ></el-option>
            </el-select>
            <super-select
                storageKey="order_staffs"
                v-if="form.snUser==='seller_id'"
                ref="paramSale"
                class="inline s-width-default"
                v-model="form.snName"
                v-sf.snName
                :placeholder="'可输入搜索'"
                :is-paging="true"
                :adjustStructure="sale_fix_result"
                :remoteRequestHttp="remoteRequestHttp"
            ></super-select>
            <!--<param-account-->
                    <!--v-if="form.snUser==='seller_id'"-->
                    <!--class="inline s-width-default"-->
                    <!--ref="paramSale"-->
                    <!--placeholder="可输入搜索"-->
                    <!--v-model="form.snName"-->
                    <!--v-sf.snName-->
                    <!--:param="{type:'sales',data:{content:''}}"-->
                    <!--:fixUrl="true"-->
                    <!--:fixResult="sale_fix_result"-->
                    <!--type="memberShipSales"-->
                    <!--url="get|user/:type/staffs">-->
            <!--</param-account>-->
            <el-select v-sf.snName
                       v-if="form.snUser==='customer_id'"
                       class='inline s-width-default'
                       v-model="form.snName"
                       :placeholder="customerPlaceholder"
                        remote
                       filterable
                       clearable>
                <el-option v-for="item in serviceList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <el-select class="inline width-xs ml-sm"
                       v-sf.snDate
                       v-model="form.snDate">
                <el-option v-for="item in times"
                           :label="item.label"
                           :key="item.value"
                           :value="item.value">
                </el-option>
            </el-select>
            <el-date-picker
                    @keyup.enter.native="search"
                    type="date"
                    v-sf.date_b
                    placeholder="开始时间"
                    v-model="form.date_b"
                    class="inline date"
                    :picker-options="pickerStart"
            ></el-date-picker>&nbsp;--&nbsp;<el-date-picker
                    @keyup.enter.native="search"
                    type="date"
                    placeholder="结束时间"
                    v-sf.date_e
                    v-model="form.date_e"
                    class="inline date mr-sm"
                    :picker-options="pickerEnd"
            ></el-date-picker>
            <label-item label="是否空卖：" class="ml-sm">
                <el-select v-sf.tag  v-model="form.tag" clearable class="s-width-small">
                    <el-option v-for="item in saleStatusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .c-card-search-order{
        .el-card{
            overflow: inherit;
        }
        .self-width .el-select__tags{
            height: 30px!important;
            width: 208px
            overflow-y: auto;
            >span{
                white-space: inherit;
            }
        }
        .input-no-margin {
            .el-select__input {
                width: 196px !important;
                margin-left: 4px !important;
            }
        }
    }
</style>
<script>
    import {
        api_status_list,
        api_get_channel,
        api_delivery_type,
        api_get_orders_shop,
        api_get_ebay_orders_shipping,
        api_account_list,
    } from '../../../api/order-local';
    import {http} from '../../../lib/http-plus';
    import {api_get_member} from '../../../api/performance-service'
    import {api_get_channel_categories} from '../../../api/categories';
    import {api_get_warehouse, api_get_shipping} from '../../../api/common';
    export default {
        page:{
            multiple:true,
        },
        refresh(){
            this.shippingList= [];
            this.siteOptions=[{label:"",value:""}];
            this.accoutOptions=[{label:"",value:""}];
        },
        data() {
            return {
                serviceList:[],
                channelList:[],
                optionsList:[],
                sellerList:[],
                accountUrl:'orders/accounts',
                accoutOptions:[{label:"",value:""}],
                shopOptions:[{label:"",value:""}],
                siteOptions:[{label:"",value:""}],
                searchTypeList:[
                    {label:'选择',value: 1},
                    {label:'文本',value: 2},
                ],
                accountParam:{
                    channel_id:'',
                },
                belongType:[
                    {label:'全部',value:''},
                    {label:'独立单',value:0},
                    {label:'合并订单',value:1},
                    {label:'多包裹订单',value:2},
                ],
                warehouseList:[],
                shippingList:[],
                transportations:[],
                deliveryList:[],
                isSnname:true,
                choseAccount:false,
                selectSnUser:[
                    {label:'销售员',value:'seller_id'},
                    {label:'客服',value:'customer_id'}
                ],
                connds:[
                    {label:'订单号',value:'order_num'},
                    {label:'买家ID',value:'buyer_id'},
                    {label:'平台订单号',value:'channel_order_number'},
                    {label:'交易号',value:'transaction_id'},
                    {label:'Item ID',value:'item_id'},
                    {label:'目的地',value:'target'},
                    {label:'SPU',value:'spu'},
                    {label:'追踪号',value:'tracking'},
                    {label:'SKU',value:"order_sku"},
                    {label:'平台SKU',value:' channel_sku'},
                    {label:'邮箱',value:"email"},
                    {label:'付款交易号',value:"pay"},
                    {label:'包裹号',value:"number"},
                    {label:'物流商服务单号',value:"process_code"},
                ],
                connds2:[
                    {label:'系统订单号',value:'order_num'},
                    {label:'平台订单号',value:'channel_order_number'},
                    {label:'系统SKU',value:"order_sku"},
                    {label:'平台SKU',value:' channel_sku'},
                    {label:'追踪号',value:'tracking'},
                    {label:'包裹号',value:"number"},
                    {label:'买家ID',value:'buyer_id'},
                    {label:'物流商服务单号',value:"process_code"},
                ],
                saleStatusList: [
                    {label:'全部',value:''},
                    {label:'是',value: 1},
                    {label:'否',value: 0},
                ],
                accoutRes:{
                    accoutOptions:{},
                    siteOptions:{},
                },
                times:[
                    {label:'下单时间',value:'transaction_date'},
                    {label:'发货时间',value:'shipping_time'},
                    {label:'创建时间',value:'create_time '},
                    {label:'支付时间',value:'pay_time '},
                ],
                buyerShippingList:[],
                pickerStart:{
                    disabledDate:(time)=>{
                        if(this.form.date_e){
                            return time.getTime()>this.form.date_e;
                        }else{
                            return false;
                        }
                    }
                },
                pickerEnd:{
                    disabledDate:(time)=>{
                        if(this.form.date_b){
                            return time.getTime()<this.form.date_b;
                        }else{
                            return false;
                        }
                    }
                }
            }
        },
        mounted(){
            this.warehouse_remote();
            this.get_delivery_type();
            this.get_status();
            this.get_ebay_shipping();
            this.channel_remote();
        },
        watch: {
            "form.searchType"(){
                this.form.snValue=''
            },
            "form.channel_id"(val) {
                this.form.site = '';
                this.form.account_id = '';
                this.form.snName = "";
                this.serviceList=[];
                this.siteOptions=[{label:"",value:""}];
                this.accoutOptions=[{label:"",value:""}];
                this.get_account_site(val);
                this.channel_service();
            },
            'form.account_id'() {
                if(!!this.form.account_id&&this.form.channel_id===7){
                    this.get_shop();
                }
            },
            'form.warehouse_id'(val) {
                this.shippingList = [];
                this.form.shipping = [];
                this.shipping_remote();
            }
        },
        computed:{
            dateEnd(){
                return datef("YYYY-MM-dd",Date.now()/1000);
            },
            sitePlaceholder(){
                if(this.form.channel_id<=0){
                    return "请先选择平台";
                }else if(this.siteOptions.length<=1){
                    return "该平台下暂无站点";
                }else{
                    return "请选择站点"
                }
            },
             customerPlaceholder(){
                if(this.form.channel_id<=0){
                    return "请先选择平台";
                }else if(this.serviceList.length<=0){
                    return "该平台下暂无客服";
                }else{
                    return "可输入搜索"
                }
            },
            choiceChannel(){
                return !(this.form.channel_id<=0)
            },
            accountPlaceholder(){
                if(this.form.channel_id<=0){
                    return "请先选择平台";
                }else if(this.accoutOptions.length<=1){
                    return "该平台下暂无账号";
                }else{
                    return "请选择账号"
                }
            },
            shippingPlaceholder(){
                if(this.form.warehouse_id==='') {
                    return "请先选择发货仓库";
                }else if(this.form.warehouse_id>0&&this.shippingList.length<=0){
                    return "该发货仓下暂无运输方式";
                }else{
                    return '请选择/输入运输方式';
                }
            },
        },
        methods:{
            get_ebay_shipping(){
                this.$http(api_get_ebay_orders_shipping).then(res=>{
                    this.buyerShippingList = res.data;
                }).catch(code=>{
                    console.log(code);
                });
            },
            account_fix_result(res){
                return res.account
            },
            change_search_type(val){
                if (val===1){
                    this.form.account_id = '';
                } else {
                    this.form.account_code = '';
                }
            },
            fixAccountParams(val){
                val.map(row=>{
                    return {
                        label:'',
                        value:''
                    }
                })
            },
            channel_service(){
                this.$http(api_get_member,{channel_id:this.form.channel_id}).then(res=>{
                    if (!!res.length){
                        this.serviceList = res.map(row=>{
                            return{
                                value:row.customer_id,
                                label:row.realname
                            }
                        });
                    }
                }).catch(code => {
                    console.log(code)
                })
            },
            key_down(){
                this.search();
            },
            changeSnUser(val) {
                this.form.snName='';
            },
            get_status(){
                this.$http(api_status_list).then(res=>{
                    this.optionsList = res.map(row=>{
                        function children(child) {
                            return child.map(ch=>{
                                return {
                                    label:ch.remark,
                                    value:ch.code
                                }
                            })
                        }
                        return {
                            label:row.name,
                            value:row.name,
                            children:children(row.child)
                        }
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
            remoteRequestHttp(){
                return http("get|user/sales/staffs",{content:''})
            },
            // sale_fix_result(res){
            //     return res.map(row=>{
            //         return {
            //             value:row.id,
            //             label:row.realname
            //         }
            //     })
            // },
            sale_fix_result(res){
                let data=res.map(row => {
                    return {
                        label: row.realname,
                        value: row.id,
                    }
                });
                return {
                    count:data.length,
                    data:data
                }
            },
            search(){
                this.$emit("search");
            },
            status_remote(callback){
                return this.$http(api_status_list).then(res=>{
                    res = res.map(cate=>{
                        function children(child) {
                            return child.map(({code,remark})=>{
                                return {
                                    label:remark,
                                    value:code
                                }
                            });
                        }
                        return {label:cate.name,options:children(cate.child)};
                    });
                    callback(res);
                }).catch(code=>{
                    console.log(code);
                })
            },
            // channel_remote(callback){
            //     return this.$http(api_get_channel,{}).then(res=>{
            //         callback(res);
            //     }).catch(code=>{
            //         console.log(code);
            //     });
            // },
            channel_remote(){
              this.$http(api_get_channel,{}).then(res=>{
                    this.channelList=[{label:'全部',value:0},...res]
                }).catch(code=>{
                    console.log(code);
                });
            },
            remove_tag(item) {
                let index = this.form.account_id.findIndex(row => row === item.value);
                if (index >= 0) {
                    this.form.account_id.splice(index, 1);
                }
            },
            //账号简称
            // get_account(channel_id, site_code,content) {
            //     if (!content) {
            //         content=''
            //     }
            //     if (!channel_id) return;
            //     this.$http(api_get_accounts_list, {page:1,pageSize:100,channel_id: channel_id, site_code: site_code,code:content}).then(res => {
            //         res = res.data.map(row=>{return {label: row.code, value: row.id}});
            //         if (res.length === 0) {
            //             this.accoutOptions = [{label: "", value: ""}];
            //         } else {
            //             this.accoutOptions = [{label: "全部", value: "",disabled:true}, ...res];
            //         }
            //     }).catch(code => {
            //         thisnpm .$message({
            //             type: 'error',
            //             message: code.message || code
            //         });
            //     })
            // },
            get_account_site(channel_id){
                if(!channel_id){
                    this.accoutOptions = [{label:"",value:""}];
                    this.siteOptions = [{label:"",value:""}];
                    return
                }
                if (this.accoutRes.accoutOptions[channel_id]) {   //另存再次切换时如果存在直接在缓存中取出
                    this.accoutOptions= this.accoutRes.accoutOptions[channel_id];
                    this.siteOptions= this.accoutRes.siteOptions[channel_id];
                    return
                }
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    if(res.site.length===0){
                        this.siteOptions = [{label:"",value:""}]
                    }else{
                        this.siteOptions = [{label:"全部",value:""},...res.site];
                        this.accoutRes.siteOptions[channel_id]=[{label:"全部",value:""},...res.site];
                    }
                    if(res.account.length===0){
                        this.accoutOptions = [{label:"",value:""}]
                    }else{
                        this.accoutOptions = [{label:"全部",value:"",disabled:true},...res.account];
                        this.accoutRes.accoutOptions[channel_id]=[{label:"全部",value:""},...res.account];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_shop(){
                this.$http(api_get_orders_shop,{channel_id:this.form.channel_id,account_id:this.form.account_id}).then(res=>{
                    if(res.length>0){
                        this.shopOptions = [{label:"全部",value:""},...res];
                    }else{
                        this.shopOptions = [{label:"",value:""}];
                    }
                }).catch(code=>{
                    console.log(code);
                })
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
                    this.warehouseList = [{label:"全部",value:""},...res];
                });
            },
            shipping_remote(){
                if(this.form.warehouse_id=="") return this.shippingList = [];
                this.$http(api_get_shipping,{warehouse_id:this.form.warehouse_id}).then(res=>{
                    if(res.length<=0){
                        this.shippingList = [];
                        return
                    }
                    let list = res.map(row=>{
                            return row.carrier_id
                    });
                    list = this.carrier_unique(list).map(carrier_id=>{
                        let label = res.find(row=>row.carrier_id===carrier_id);
                        return {
                            label:label.carrier_name,
                            value:carrier_id
                        }
                    });
                    this.shippingList = list.map(row=>{
                        row.children = this.get_children(row,res);
                        return row
                    });
                }).catch(code=>{
                    console.log(code);
                });
            },
            carrier_unique(arr){
                let res = [];
                let json = {};
                for(let i = 0; i < arr.length; i++){
                    if(!json[arr[i]]){
                        res.push(arr[i]);
                        json[arr[i]] = 1;
                    }
                }
                return res;
            },
            get_children(row,res) {
                let child = [];
                res.forEach(item=>{
                    if(row.value===item.carrier_id){
                        child.push({
                            label:item.shortname,
                            value:item.shipping_method_id
                        })
                    }
                });
                return child
            },
            get_delivery_type(){
                this.$http(api_delivery_type).then(res=>{
                    this.deliveryList = res.map(row=>{
                        return {
                            label:row.remark,
                            value:row.code
                        }
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
        },
        props:{
            form:{
                required:true,
                type:Object,
            },
            clears:{},
        },
        components: {
            searchCard:require('../../../components/search-card.vue').default,
            labelItem:require('../../../components/label-item.vue').default,
            selectRemote:require('../../../components/select-remote.vue').default,
            paramAccount:require('../../../api-components/param-account.vue').default,
            orderInput:require("@/components/order-input.vue").default,
        }
    }
</script>
