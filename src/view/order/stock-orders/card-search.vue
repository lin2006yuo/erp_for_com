<template>
    <div class="c-card-search">
        <search-card @search="search" :params="form" :clears="clears">
            <el-row class="mb-mini">
                <label-item label="平台：">
                    <select-remote class="s-width-default"
                                   v-sf.channel_id
                                   v-model="form.channel_id"
                                   :remote="channel_remote">
                    </select-remote>
                </label-item>
                <label-item label="站点：" class="ml-xs">
                    <el-select :disabled="siteOptions.length<=1"
                               class="s-width-default"
                               filterable clearable
                               :placeholder="sitePlaceholder"
                               v-sf.site
                               v-model="form.site">
                        <el-option v-for="item in siteOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="账号简称：" class="ml-sm">
                    <el-select :disabled="accoutOptions.length<=1"
                               class="s-width-default"
                               filterable clearable
                               :placeholder="accountPlaceholder"
                               v-sf.account_id
                               v-model="form.account_id">
                        <el-option v-for="item in accoutOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="发货仓库：" class="ml-sm mr-sm">
                    <el-select class="s-width-small"
                               v-sf.warehouse_id
                               v-model="form.warehouse_id"
                               filterable clearable>
                        <el-option v-for="item in warehouseList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </label-item>
                <div class="br-show" style="height: 3px;display: none"></div>
                <label-item label="运输方式：">
                    <el-cascader
                    clearable
                    filterable
                    change-on-select
                    :disabled="shippingList.length<=1"
                    :placeholder="shippingPlaceholder"
                    class="inline s-width-large"
                    v-model="form.shipping"
                    expand-trigger="hover"
                    :options="shippingList"
                    ></el-cascader>
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
                         v-sf.connd_value
                         @keydown="search"
                         placeholder="可批量搜索，Shift+回车换行..."></order-input>
            <label class="ml-sm">所属类型：</label>
            <el-select v-model="form.belong_type"
                       class="inline s-width-default"
                       v-sf.belong_type
                       filterable clearable>
                <el-option
                    v-for="res in belongType"
                    :label="res.label"
                    :value="res.value"
                    :key="res.value"
                ></el-option>
            </el-select>
            <label class="inline ml-sm">销售员：</label>
            <param-account
                    class="inline s-width-small"
                    ref="paramSale"
                    placeholder="可输入搜索"
                    v-model="form.seller_id"
                    v-sf.seller_id
                    :param="{type:'sales',data:{content:''}}"
                    :fixUrl="true"
                    :fixResult="sale_fix_result"
                    type="memberShipSales"
                    url="get|user/:type/staffs">
            </param-account>
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
        </search-card>
    </div>
</template>
<style lang="stylus" scoped>
    .c-card-search{
        .el-card{
            overflow: inherit;
        }
    }
</style>
<script>
    import { api_status_list,api_account_list,api_get_channel} from '../../../api/order-local';
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
                // optionsList:[],
                sellerList:[],
                accoutOptions:[{label:"",value:""}],
                siteOptions:[{label:"",value:""}],
                warehouseList:[],
                shippingList:[],
                transportations:[],
                // deliveryList:[],
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
                belongType:[
                    {label:'全部',value:''},
                    {label:'独立单',value:0},
                    {label:'合并订单',value:1},
                    {label:'多包裹订单',value:2},
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

                times:[
                    {label:'下单时间',value:'transaction_date'},
                    {label:'发货时间',value:'shipping_time'},
                    {label:'创建时间',value:'create_time '},
                ],
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
        created(){
            this.warehouse_remote();
            // this.get_status();
        },
        watch:{
            "form.channel_id"(val){
                this.form.site ='';
                this.form.account_id = "";
                this.siteOptions = [{label:"",value:""}];
                this.accoutOptions = [{label:"",value:""}];
                this.get_site(val);
                this.get_account(val)
            },
           // "form.site"(val){
           //      this.form.account_id = "";
           //      this.get_account(this.form.channel_id,val);
           //  },
            'form.warehouse_id'(val){
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
            accountPlaceholder(){
                if(this.form.channel_id<=0){
                    return "请先选择平台";
                }else if(this.accoutOptions.length<=1){
                    return "该平台下暂无账号";
                }else{
                    return "请选择账号"
                }
            },
            // accountPlaceholder(){
            //     if((this.form.site<=0&&this.accoutOptions.length>1) || this.form.site>0){
            //         return "请选择账号";
            //     }else if(this.form.site<=0){
            //         return "请先选择站点";
            //     }else if(this.accoutOptions.length<=1){
            //         return "该站点下暂无账号";
            //     }
            // },
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
            	let find = this.connds.find(res=>{
            		return res.value === this.form.snType;
                });
            	if(!!find){
            		return find.label;
                }
            }
        },
        methods:{
            sale_fix_result(res){
                return  res.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
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
            channel_remote(callback){
                return this.$http(api_get_channel,{}).then(res=>{
                    callback(res);
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
            get_account(channel_id){
                if(!channel_id)return this.accoutOptions = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    if(res.account.length<=0){
                        this.accoutOptions = [{label:"",value:""}]
                    }else{
                        res = res.account;
                        this.accoutOptions = [{label:"全部",value:""},...res];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            // get_account(channel_id,site_code){
            //     if(!channel_id||!site_code)return this.accoutOptions = [{label:"",value:""}];
            //     this.$http(api_account_list,{channel_id:channel_id,site_code:site_code}).then(res=>{
            //         if(res.account.length>0){
            //             res = res.account;
            //             this.accoutOptions = [{label:"全部",value:""},...res];
            //         }else{
            //             this.accoutOptions = [{label:"",value:""}];
            //         }
            //     }).catch(code=>{
            //         console.log(code);
            //     })
            // },
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
            orderInput:require("../../../components/order-input.vue").default,
        }
    }
</script>
