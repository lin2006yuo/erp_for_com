<template>
    <div class="c-card-search">
        <search-card :params="form" :clears="clears" @search="search">
            <div class="mb-mini">
                <label-item label="">
                    <el-select v-model="form.snType"
                               class="s-width-default"
                               v-sf.snType
                               filterable clearable>
                        <el-option
                                v-for="res in snTypeList"
                                :label="res.label"
                                :value="res.value"
                                :key="res.value"
                        ></el-option>
                    </el-select>
                </label-item>
                <label-item label="">
                    <order-input class="width-super mr-sm"
                                 v-model="form.snText"
                                 @keydown="key_down"
                                 placeholder="可批量搜索，Shift+回车换行..."
                                 v-sf.snText></order-input>
                </label-item>
                <label-item label="平台：">
                    <el-select v-model="form.channel_id"
                               class="inline width-sm"
                               v-sf.channel_id
                               filterable clearable>
                        <el-option
                            v-for="res in channelList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                        ></el-option>
                    </el-select>
                </label-item>
                <label-item label="站点：" class="ml-sm">
                    <el-select v-model="form.site_code"
                               v-sf.site_code
                               class="s-width-default"
                               :placeholder="comHolderSite"
                               :disabled="siteList.length<=1"
                               filterable clearable>
                        <el-option
                            v-for="res in siteList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                        ></el-option>
                    </el-select>
                </label-item>
                <label-item label="账号简称：" class="ml-sm">
                    <el-select v-model="form.channel_account_id"
                               class="s-width-default"
                               v-sf.channel_account_id
                               :disabled="accountList.length<=1"
                               :placeholder="comHolderAccount"
                               filterable clearable>
                        <el-option
                            v-for="res in accountList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                        ></el-option>
                    </el-select>
                </label-item>
            </div>
            <label-item label="发货仓库：">
                <el-select v-model="form.warehouse_id"
                           class="s-width-small"
                           v-sf.warehouse_id
                           filterable clearable>
                    <el-option
                        v-for="res in warehouseList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                    ></el-option>
                </el-select>
            </label-item>
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
            <el-select v-model="form.snDate"
                       class="inline width-xs ml-sm"
                       v-sf.snDate>
                <el-option
                        v-for="res in snDateList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                ></el-option>
            </el-select>
            <el-date-picker class="date inline"
                            v-model="form.date_b"
                            :picker-options="picker_b"
                            v-sf.date_b
                            placeholder="开始时间"></el-date-picker>&nbsp;--&nbsp;
            <el-date-picker
                class="date inline mr-sm"
                placeholder="开始时间"
                v-sf.date_e
                :picker-options="picker_e"
                v-model="form.date_e"></el-date-picker>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .c-card-search{
        .el-card{
            overflow: inherit;
        }
    }
</style>
<script>
import {api_get_channel,api_account_list,api_get_warehouse,api_get_shipping} from '../../../api/common.js';
import {chinese} from "../../../define/validator_reg";
    export default {
        page(){

        },
        refresh(){
            console.log("ddddd");
        },
        data() {
            return {
                channelList:[],
                accountList:[],
                siteList:[],
                warehouseList:[],
                shippingList:[],
                snTypeList:[
                    {label:"包裹号",value:"number"},
                    {label:"订单号",value:"order_number"},
                    {label:"平台订单号",value:"channel_order_number"},
                    {label:"物流跟踪号",value:"tracking"},
                    {label:"物流商单号",value:"process_code"},
                ],
                snDateList:[
                    {label:"发货时间",value:"shipping_time"},
                    {label:"支付时间",value:"pay_time"},
                ],
                picker_b:{
                    disabledDate:(time)=>{
                        if(this.form.date_e){
                            return time.getTime()>this.form.date_e;
                        }else{
                            return false;
                        }
                    }
                },
                picker_e:{
                    disabledDate:(time)=>{
                        if(this.form.date_b){
                            return time.getTime()<this.form.date_b;
                        }else{
                            return false;
                        }
                    }
                },
            }
        },
        created(){
            this.get_channel();
            this.get_warehouse();
        },
        watch:{
            'form.channel_id'(val){
                this.form.site_code = "";
                this.form.channel_account_id = "";
                this.accountList = [{label:"",value:""}];
                this.get_site(val);
            },
            'form.site_code'(val){
                this.form.channel_account_id = "";
                this.get_account(this.form.channel_id,val);
            },
            'form.warehouse_id'(val){
                this.shippingList = [];
                this.form.shipping = [];
                this.shipping_remote();
            }
        },
        computed:{
            comHolderSite(){
                if(!this.form.channel_id){
                    return "请先选择平台";
                }else if(!!this.form.channel_id&&this.siteList.length<=1){
                    return "该平台下暂无站点";
                }else{
                    return "请选择站点";
                }
            },
            comHolderAccount(){
                if(!this.form.site_code){
                    return "请先选择站点";
                }else if(!!this.form.site_code&&this.accountList.length<=1){
                    return "该站点下暂无账号";
                }else{
                    return "请选择账号";
                }
            },
            shippingPlaceholder(){
                if(this.form.warehouse_id<=0) {
                    return "请先选择发货仓库";
                }else if(this.form.warehouse_id>0&&this.shippingList.length<=1){
                    return "该发货仓下暂无运输方式";
                }else{
                    return "请选择/输入运输方式";
                }
            },
            changeLabel(){
                let find = this.snTypeList.find(res=>{
                    return res.value === this.form.snType;
                });
                if(!!find){
                    return find.label;
                }
            }
        },
        methods:{
            key_down(){
                this.search();
            },
            search(){
                this.$emit("search");
            },
            get_channel(){
                this.$http(api_get_channel).then(res=>{
                    this.channelList = [{label:"全部",value:""},...res];
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_site(val){
                if(!val)return this.siteList = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:val}).then(res=>{
                    let site = res.site;
                    if(site.length<=0){
                        let account = res.account;
                        this.siteList = [{label:"",value:""}];
                        if(account){
                            this.accountList = [{label:"全部",value:""},...account];
                        }else{
                            this.accountList = [{label:"",value:""}];
                        }
                    }else{
                        this.siteList = [{label:"全部",value:""},...site];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_account(channel_id,site_code){
                if(!channel_id||!site_code)return this.accountList = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:channel_id,site_code:site_code}).then(res=>{
                    let account = res.account;
                    if(account.length>0) return this.accountList = [{label:"全部",value:""},...account];
                    this.accountList = [{label:"",value:""}];
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_warehouse(){
                this.$http(api_get_warehouse).then(res=>{
                    this.warehouseList = [{label:"全部",value:""},...res];
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_shipping(warehouse_id){
                if(!warehouse_id) return this.shippingList = [{label:"",value:""}];
                this.$http(api_get_shipping,{warehouse_id:warehouse_id}).then(res=>{
                    if(res.length<=0) return this.shippingList = [{label:"",value:""}];
                    res = res.map(row=>{
                        return{
                            label:`${row.carrier_name}>>${row.shortname}`,
                            value:row.shipping_method_id
                        }
                    });
                    this.shippingList = [{label:"全部",value:""},...res];
                }).catch(code=>{
                    console.log(code);
                })
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
        },
        props:{
            form:{
                required:true,
                type:Object
            },
            clears:{
                required:true,
                type:Object
            },
        },
        components: {
            searchCard:require('../../../components/search-card.vue').default,
            labelItem:require('../../../components/label-item.vue').default,
            orderInput:require("../../../components/order-input.vue").default,
        }
    }
</script>
