<template>
    <div class="c-hold-search-list">
        <search-card @search="search" :params="searchData" :clears="clears">
            <div>
                <label-buttons label="拦截状态：" @select="change_status" :buttons="saleStatus"></label-buttons>
            </div>
            <el-select v-model="searchData.snType" v-sf.snType class="inline" style="width:120px">
                <el-option v-for="item in goods" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <order-input v-model="searchData.snText"
                         v-if="searchData.snType==='number'"
                         class="inline width-super mr-sm"
                         @keydown="search"
                         v-sf.snText
                         placeholder="可批量搜索，Shift+回车换行..."></order-input>
            <el-input placeholder="请输入搜索内容..." @keydown.native.enter="search" v-else v-sf.snText v-model="searchData.snText" class="inline mr-sm" style="width: 200px;"></el-input>
            <label-item label="平台：">
                <el-select v-model="searchData.channel_id" v-sf.channel_id clearable placeholder="全部"  class="inline mr-sm" @change="change_channelid(searchData.channel_id)" style="width:120px" >
                    <el-option v-for="item in platformList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="账号简称：">
                <param-account v-sf.account_id
                    ref="paramAccount"
                    class="mr-sm"
                    v-model="searchData.account_id"
                    :disabled="searchData.channel_id===''"
                    :refresh="true"
                    :param="accountParam"
                    :fixResult="account_fix_result"
                    placeholder="请选择/输入..."
                    type="memberShipAccount"
                    url="get|orders/account">
                </param-account>
            </label-item>
            <div class="mt-mini"></div>
            <label-item label="发货仓库：">
                <el-select v-model="searchData.warehouse_id" v-sf.warehouse_id clearable placeholder="全部" class="inline mr-sm" style="width:120px">
                    <el-option v-for="item in warehouseList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="运输方式：">
                <el-cascader
                    v-model="searchData.shipping"
                    v-sf.shipping
                    change-on-select
                    expand-trigger="hover"
                    :placeholder="shippingPlaceholder"
                    clearable
                    :options="shippingList"
                    filterable
                    :disabled="shippingList.length<=0"
                    class="inline mr-sm s-width-large"
                ></el-cascader>
            </label-item>
            <div class="br-show"></div>
            <label>创建时间：</label>
            <el-date-picker class="inline date" v-model="searchData.date_b" v-sf.date_b type="date"
                            :picker-options="pickerstart" placeholder="开始时间"></el-date-picker>--
            <el-date-picker class="inline date mr-sm" v-model="searchData.date_e" v-sf.date_e type="date"
                            :picker-options="pickerend" placeholder="结束时间"></el-date-picker>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .c-hold-search-list{
        .el-card{
            overflow visible;
        }
    }
</style>
<script>
    import {api_get_warehouse} from '../../../api/freight-trial';
    import {api_get_post,api_get_account,api_get_order_hold_status} from '../../../api/handwork';
    import {api_get_shipping} from '../../../api/common'
//    import {mapGetters} from 'vuex';
	export default{
		data(){
			return {
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_e){
                            return  time.getTime() > this.searchData.date_e;
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_b){
                            return  time.getTime() < this.searchData.date_b;
                        }else {
                            return false
                        }
                    }
                },
                saleStatus: [
                    // {name: "等待拦截", status: 0},
                    // {name: "拦截失败", status: 1},
                    // {name: "拦截成功", status: 2},
                    // {name: "取消拦截", status: 3},
                ],
                goods:[
                    {label:"包裹号",value:"number"},
                    {label:"订单号",value:"order_num"},
                    {label:"SKU",value:"sku"},
                    {label:"跟踪单号",value:"tracking"},
                ],
                platformList:[
                    {label:"ebay平台",value:1},
                    {label:"亚马逊平台",value:2},
                    {label:"wish平台",value:3},
                    {label:"速卖通平台",value:4},
                ],
                accountList:[],
                warehouseList:[],
                // postList:[],
                shippingList:[],
                accountParam:{
                    channel_id:'',
                },
                clears:{
                    shipping:[],
                    snType:"number",
                    snText:"",
                    channel_id:"",
                    account_id:"",
                    warehouse_id:"",
                    shipping_id: '',
                    date_b:"",
                    date_e:"",
                }
            }
		},
        mounted(){
            this.api_get_warehouse();
            this.get_sale_status();
        },
        methods:{
            account_fix_result(res){
                return res.account
            },
            api_get_warehouse(){
                this.warehouseList = [];
                    this.$http(api_get_warehouse).then(res=>{
                        this.warehouseList = res.map(row=>{
                            return {
                                label:row.name,
                                value:row.id,
                            }
                        })
                    }).catch(code=>{
                        console.log(code);
                    })
            },
            //            获取运输方式
            shipping_remote(){
                if(this.searchData.warehouse_id=="") return this.shippingList = [];
                this.$http(api_get_shipping,{warehouse_id:this.searchData.warehouse_id}).then(res=>{
                    if(res.length<=0){
                        this.shippingList = [];
                        return
                    }
                    let list = res.map(row=>{
                        return row.carrier_name
                    });
                    function unique(arr){
                        let res = [];
                        let json = {};
                        for(let i = 0; i < arr.length; i++){
                            if(!json[arr[i]]){
                                res.push(arr[i]);
                                json[arr[i]] = 1;
                            }
                        }
                        return res;
                    }
                    list = unique(list);
                    function children(row) {
                        let child = [];
                        res.forEach(item=>{
                            if(row===item.carrier_name){
                                child.push({
                                    label:item.shortname,
                                    value:item.shipping_method_id
                                })
                            }
                        });
                        return child
                    }
                    this.shippingList = list.map((row,index)=>{
                        return {
                            label:row,
                            value:index,
                            children:children(row)
                        }
                    });
                    // this.shippingList = [{label:"全部",value:""},...nowList]
                }).catch(code=>{
                    console.log(code);
                });
            },
            change_channelid(id){
                this.searchData.account_id="";
                this.accountParam.channel_id=id;
                this.$refs.paramAccount.init();
            },
            search(){
                this.searchData.shipping.length>1&&(this.searchData.shipping_id = this.searchData.shipping[1]);
                this.$emit('search_list');
            },
            change_status(select){
                this.$emit('search_list',this.saleStatus[select].value)
            },
            get_sale_status(){
                this.$http(api_get_order_hold_status).then(res=>{
                    this.saleStatus = res;
                }).catch(code=>{
                    console.error(code);
                });
            }
        },
        computed:{
//            ...mapGetters({getParamAccount:'api/getParamAccount'}),
            shippingPlaceholder(){
                if(this.searchData.warehouse_id<=0) {
                    return "请先选择发货仓库";
                }else if(this.searchData.warehouse_id>0&&this.shippingList.length<=1){
                    return "该发货仓下暂无运输方式";
                }else{
                    return "请选择/输入运输方式";
                }
            }
        },
        watch: {
            'searchData.warehouse_id'(val){
                this.shippingList = [];
                this.searchData.shipping = [];
                this.searchData.shipping_id = '';
                this.shipping_remote();
            },
            'searchData.snType'(val,old){
                if(val==='number'||old==='number'){
                    this.searchData.snText = '';
                }
            }
        },
        props:{
            searchData:{
            	required:true,
                type:Object,
            }
        },
        components: {
            labelButtons:require('@/components/label-buttons.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            searchCard:require('@/components/search-card.vue').default,
            paramAccount:require("@/api-components/param-account.vue").default,
            orderInput:require('@/components/order-input').default,
        }
	}
</script>
