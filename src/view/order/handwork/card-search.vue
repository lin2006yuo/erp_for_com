<template>
    <el-row class="card-search-handwork">
        <search-card @search="search"
                     @enter="search"
                     :params="form"
                     :clears="clears"
                     :debug="true">
            <div class="mb-mini">
                <label-item label="销售日期："></label-item>
                <label-select class="inline s-width-small"
                              v-sf.seller_date
                              v-model="form.seller_date"
                              :lists="dateRangeList"
                              @change="change_date"></label-select>
                <label-item label="发货状态：" class="ml-sm">
                    <el-select v-sf.delivery_type  v-model="form.delivery_type" clearable class="s-width-small">
                        <el-option v-for="item in deliveryList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </label-item>
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
                    class="inline s-width-middle"
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
            </div>
            <div class="mb-mini">
                <label-buttons class="inline"
                               label="销售渠道："
                               v-sf.channel_id
                               :buttons="buttonList"
                               @select="select_button"></label-buttons>
                <label-buttons class="inline ml-lg"
                               label="付款状态："
                               :buttons="paymentList"
                               @select="select_payment"></label-buttons>
            </div>
            <label-select class="width-sm inline"
                          v-sf.snType
                          v-model="form.snType"
                          :lists="typeList"></label-select>
            <order-input v-model="form.snText"
                         class="inline width-super"
                         v-sf.snText
                         @keydown="search"
                         placeholder="可批量搜索，Shift+回车换行..."></order-input>
            <label class="inline ml-sm">账号简称：</label>
            <el-select class="inline"
                       :placeholder="accountPlaceholder"
                       v-model="form.account_id"
                       v-sf.account_id
                       :disabled="showAccount"
                       filterable clearable>
                <el-option
                        :key="item.value"
                        v-for="item in accountList"
                        :label="item.label"
                        :value="item.value"
                ></el-option>
            </el-select>
            <label class="inline ml-sm">仓库：</label>
            <el-select  class="inline width-sm"
                        placeholder="请选择仓库"
                        v-model="form.warehouse_id"
                        v-sf.warehouse_id
                        clearable filterable>
                <el-option
                        :key="item.value"
                        v-for="item in warehouseList"
                        :label="item.label"
                        :value="item.value"
                ></el-option>
            </el-select>
            <label-item label="运输方式：">
                <el-cascader
                    clearable
                    filterable
                    change-on-select
                    :disabled="shippingList.length<=0"
                    :placeholder="shippingPlaceholder"
                    class="inline s-width-large"
                    v-model="form.shipping"
                    v-sf.shipping
                    expand-trigger="hover"
                    :options="shippingList"
                ></el-cascader>
            </label-item>
            <div style="display: none;height: 3px" class="br-show"></div>
            <label-select class="inline width-xs"
                          v-sf.snDate
                          v-model="form.snDate"
                          :lists="dateList"></label-select>
            <el-date-picker
                    class="inline date"
                    v-sf.date_b
                    v-model="form.date_b"
                    type="date"
                    placeholder="开始日期"
                    :picker-options="pickerStart"
            ></el-date-picker>
            &nbsp;--&nbsp;
            <el-date-picker
                    class="inline date mr-sm"
                    v-sf.date_e
                    v-model="form.date_e"
                    type="date"
                    placeholder="结束日期"
                    :picker-options="pickerEnd"
            ></el-date-picker>
        </search-card>
    </el-row>
</template>
<style lang="stylus">
    .card-search-handwork {
        .el-card {
            overflow: inherit;
        }
    }
</style>
<script>
    import {
        api_get_warehouse,
        api_get_account,
        api_get_channel,
        api_get_date
    } from '../../../api/handwork';
    import {
        api_delivery_type
    } from '../../../api/order-local';
    import {api_get_shipping} from '../../../api/common'
    export default{
        data(){
            return {
                showAccount: false,
                dateRangeList: [],
                buttonList: [],
                deliveryList:[],
                curStatus: "",
                typeList: [
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
                accountList: [{label: "", value: ""}],
                warehouseList: [],
                // postList: [],
                shippingList: [],
                dateList: [
                    {label: "下单时间", value: "transaction_date"},
                    {label: "付款时间", value: "pay_time"},
                    {label: "发货时间", value: "shipping_time"},
                ],
                paymentList: [
                    {label: "全部", value: ""},
                    {label: "未付款", value: 0},
                    {label: "已付款", value: 1},
                ],
                belongType:[
                    {label:'全部',value:''},
                    {label:'独立单',value:0},
                    {label:'合并订单',value:1},
                    {label:'多包裹订单',value:2},
                ],
                pickerStart:{
                    disabledDate:(time)=>{
                        if(this.form.date_e){
                            return  time.getTime()> this.form.date_e;
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
            this.api_get_warehouse();
            this.api_get_channel();
            this.api_get_date();
            this.get_delivery_type();
        },
        computed: {
            accountPlaceholder(){
                if (!this.curStatus) {
                    return '请先选择销售渠道'
                } else if (this.curStatus && this.accountList.length <= 1) {
                    return '该销售渠道下暂无账号';
                } else {
                    return "请选择账号简称"
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
            	let find = this.typeList.find(res=>{
            		return res.value === this.form.snType;
                });
            	if(!!find){
            		return find.label;
                }
            }
        },
        watch: {
            'form.warehouse_id'(val){
                this.shippingList = [];
                this.form.shipping = [];
                this.shipping_remote();
            },
            'form.snType':function () {
                this.form.snText = '';
            }
        },
        methods: {
            sale_fix_result(res){
                return  res.map(row=>({
                    value:row.id,
                    label:row.realname
                }))
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
            change_date(val){
                this.$emit("change-date", val);
            },
            select_button(val, item){
                this.curStatus = item.value;
                this.$emit("select-button", item.value);
                this.form.account_id = '';
                if (!item.value) {
                    this.showAccount = true;
                    this.accountList = [{label: "", value: ""}]
                } else {
                    this.api_get_account(item.value);
                }
            },
            select_payment(index){
                this.$emit("select-payment", this.paymentList[index].value);
            },
//            搜索
            search(){
                this.$emit("search");
            },
//            清除搜索
            clear_search(){
                this.shippingList = [];
                this.$emit("clear-search");
            },
//            获取仓库
            api_get_warehouse(){
                this.warehouseList = [],
                this.$http(api_get_warehouse).then(res=>{
                    this.warehouseList = [{label:'全部',value:''} ,...res];
                }).catch(code=>{
                    console.log(code);
                })
            },
//            获取运输方式
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
//            获取账号
            api_get_account(val){
                this.$http(api_get_account, {channel_id: val}).then(res=>{
                    if (res.account.length > 0) {
                        this.showAccount = false;
                        res = res.account;
                        this.accountList = [{label: "全部", value: ""},...res];
                    } else {
                        this.showAccount = true;
                        this.accountList = [{label: "", value: ""}];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
//            获取渠道
            api_get_channel(){
                this.$http(api_get_channel).then(res=>{
                    this.buttonList = [{label: "全部", value: 0},...res]
                }).
                catch(code=>{
                    console.log(code);
                })
            },
//            获取销售日期
            api_get_date(){
                this.$http(api_get_date).then(res=>{
                    return this.dateRangeList = (res.map(row=>{
                        return {label: row.remark, value: row.code}
                    }))
                }).catch(code=>{
                    console.log(code);
                })
            }
        },
        props: {
            form: {
                required: true,
                type: Object
            },
            clears:{
                required: true,
                type: Object
            }
        },
        components: {
            labelSelect: require('../../../components/label-select.vue').default,
            labelButtons: require('../../../components/label-buttons.vue').default,
            searchCard:require('../../../components/search-card.vue').default,
            orderInput:require('../../../components/order-input.vue').default,
            labelItem:require('../../../components/label-item').default,
            paramAccount:require('@/api-components/param-account.vue').default,
        }
    }
</script>
