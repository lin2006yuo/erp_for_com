<template>
    <div class="p-search">
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears">
            <el-select v-sf.searchChooese v-model="searchData.searchChooese" class="inline mb-mini s-width-small">
                <el-option v-for="item in goods" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-input v-model="searchData.snText" placeholder="模糊搜索..."
                      @keyup.enter.native="search"
                      v-if="searchData.searchChooese==='title'"
                      class="inline width-super mb-mini mr-sm"></el-input>
            <order-input v-model="searchData.snText"
                         class="inline width-super mb-mini mr-sm"
                         v-else v-sf.snText
                         @keydown="search"
                         placeholder="可批量搜索，Shift+回车换行..."></order-input>
            <label-item label="账号简称：">
                <el-select v-model="searchData.searchType" v-sf.searchType
                           @change="change_type" class="inline s-width-mini mb-mini"
                           default-first-option filterable clearable>
                    <el-option
                        v-for="res in searchTypeList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                    ></el-option>   
                </el-select>
                <param-account v-if="searchData.searchType==='select'"
                               v-sf.account_id v-model="searchData.account_id"
                               url="get|Publish/Ebay/getAccounts"
                               class="inline mb-mini mr-sm" type="ebay"></param-account>
                <order-input v-model="searchData.account_code" v-sf.account_code
                             v-else @keydown="search"
                             class="inline s-width-large mr-sm"
                             placeholder="可批量搜索，Shift+回车换行..."></order-input>
            </label-item>
            <label-item label="站点：">
                <el-select v-sf.site v-model="searchData.site" clearable
                           class="inline mb-mini mr-sm s-width-small" filterable>
                    <el-option v-for="item in siteList"
                               :key="item.id"
                               :label="item.label"
                               :value="item.id"></el-option>
                </el-select>
            </label-item>
            <label-item label="出售方式：">
                <el-select v-sf.listing_type v-model="searchData.listing_type"
                           class="inline mb-mini mr-sm s-width-mini">
                    <el-option v-for="item in saleWay"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="上架时间：">
                <el-select v-sf.listing_duration v-model="searchData.listing_duration" placeholder="全部"
                           :disabled="noSaleWay" class="inline mb-mini mr-sm s-width-mini">
                    <el-option v-for="item in addTimes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="自动补数量：">
                <el-select v-sf.replen v-model="searchData.replen" class="inline mb-mini mr-sm s-width-default">
                    <el-option v-for="item in autoAdds" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="产品类型：">
                <el-select v-sf.goods_type v-model="searchData.goods_type" class="inline mb-mini mr-sm s-width-small">
                    <el-option v-for="item in productypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="销售状态：">
                <el-select v-sf.work_off v-model="searchData.work_off" class="inline mb-mini mr-sm s-width-mini">
                    <el-option v-for="item in saleStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </label-item><label-item label="本地状态：">
                <el-select v-sf.sales_status v-model="searchData.sales_status" class="inline mb-mini mr-sm s-width-mini">
                    <el-option v-for="item in localStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="刊登分类：">
                <el-input placeholder="请输入搜索内容..." v-sf.category v-model="searchData.category"
                          :disabled="disabled" class="inline mb-mini s-width-middle"></el-input>
                <a class="inline mb-mini mr-sm blue-color" @click="choose_product">(选择产品分类)</a>
            </label-item>
            <label-item label="是否自动重上：">
                <el-select v-sf.restart v-model="searchData.restart" class="inline mb-mini mr-sm s-width-mini">
                    <el-option v-for="item in chooses" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="收款PayPal账号：">
                <el-select v-sf.paypal_emailaddress v-model="searchData.paypal_emailaddress" placeholder="全部"
                           :disabled="noChoiceAccount" class="inline mb-mini mr-sm s-width-default">
                    <el-option v-for="item in payPals" :key="item.id" :label="item.account_name" :value="item.id"></el-option>
                </el-select>
            </label-item>
            <label-item label="橱窗图片：">
                <el-select v-sf.picture_gallery v-model="searchData.picture_gallery" class="inline mb-mini mr-sm s-width-default">
                    <el-option v-for="item in msgImgs" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="商品所在地：">
                <el-input placeholder="请输入..." v-sf.location v-model="searchData.location" class="inline mb-mini mr-sm"></el-input>
            </label-item>
            <label-item label="0库存在线：">
                <el-select v-sf.quantity v-model="searchData.quantity" class="inline mb-mini mr-sm s-width-mini">
                    <el-option v-for="item in chooses" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="Best Offer开启：">
                <el-select v-sf.best_offer v-model="searchData.best_offer" class="inline mb-mini mr-sm s-width-mini">
                    <el-option v-for="item in chooses" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="促销折扣：">
                <el-select v-sf.promotion_id v-model="searchData.promotion_id" placeholder="全部"
                           :disabled="noChoiceAccount" class="inline mb-mini mr-sm s-width-default">
                    <el-option v-for="item in promotionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="退货时间：">
                <el-select v-sf.return_time v-model="searchData.return_time" placeholder="全部"
                           :disabled="noChoiceSite" class="inline mr-sm s-width-default">
                    <el-option v-for="item in withins" :key="item.returns_within_option" :label="item.description" :value="item.returns_within_option"></el-option>
                </el-select>
            </label-item>
            <label-item label="是否有副标题：">
                <el-select v-sf.sub_title v-model="searchData.sub_title" class="inline mr-sm s-width-mini">
                    <el-option v-for="item in chooses" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="备货时间：">
                <el-select v-sf.dispatch_max_time v-model="searchData.dispatch_max_time" placeholder="全部"
                           :disabled="noChoiceSite" class="inline mr-sm s-width-small">
                    <el-option v-for="item in dispaths" :key="item.dispatch_time_max" :label="item.description" :value="item.dispatch_time_max"></el-option>
                </el-select>
            </label-item>
            <label-item label="Listing分类：">
                <el-select v-sf.listing_cate v-model="searchData.listing_cate" class="inline mr-sm s-width-default">
                    <el-option v-for="item in listings" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="刊登工具：">
                <el-select v-sf.application v-model="searchData.application" placeholder="全部" clearable class="inline mr-sm s-width-mini">
                    <el-option
                        v-for="item in appliList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="价格变动：">
                <el-select v-sf.adjusted_price v-model="searchData.adjusted_price" class="inline s-width-small">
                    <el-option v-for="item in priceChange" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>

                <el-input :disabled="disabledPrice" placeholder="金额幅度" v-sf.adjust_range v-model="searchData.adjust_range" class="inline mr-sm width-xs"></el-input>
            </label-item>
            <el-select v-sf.name v-model="searchData.name" class="inline s-width-small">
                <el-option v-for="item in choosesTimes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-date-picker class="inline date" v-sf.start_date
                            v-model="searchData.start_date" type="date"
                            :picker-options="pickerstart" placeholder="开始时间"></el-date-picker>
            --
            <el-date-picker class="inline date mr-sm" v-sf.end_date
                            v-model="searchData.end_date" type="date"
                            :picker-options="pickerend" placeholder="结束时间"></el-date-picker>
        </search-card>
        <category-dialog v-model="categoryDialog" :site="searchData.site" @submit="submit"></category-dialog>
    </div>
</template>
<style lang="stylus">
    .blue-color{
        color :#33B2FC;
        cursor: pointer;
    }
    .el-card{
        overflow: inherit;
    }
</style>
<script>
    import {api_get_account,api_get_ebay_site,api_listing_management,api_common_modeList,api_get_paypals,api_get_within,api_get_dispatch_time_max,api_get_promotion_list} from '../../../../../api/ebay-kandeng-public-module';
    export default{
        data(){
            return {
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.end_date){
                            return  time.getTime() > this.searchData.end_date;
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.start_date){
                            return  time.getTime() < this.searchData.start_date;
                        }else {
                            return false
                        }
                    }
                },
                goods: [
                    {
                        value: 'itemID',
                        label: 'ItemID'
                    },
                    {
                        value: 'listing_sku',
                        label: '平台SKU'
                    },
                    {
                        value: 'sku',
                        label: '本地SKU'
                    },
                    {
                        value: 'spu',
                        label: '本地SPU'
                    },
                    {
                        value: 'title',
                        label: '刊登标题'
                    },
                ],
                saleWay: [
                    {label:"全部",value:""},
                    {label: "一口价", value: 1},
                    {label: "拍卖", value: 2},
                ], //销售方式
                addTimes: [], //上架时间
                autoAdds: [
                    {label:"全部",value:""},
                    {label: "卖多少补多少", value: 1},
                    {label: "关闭", value: 0}
                ], //自动补货
                productypes: [
                    {label:"全部",value:""},
                    {label: "捆绑产品", value: 1},
                    {label: "非捆绑产品", value: 0},
                ], //产品类型
                saleStatus: [
                    {label:"全部",value:""},
                    {label: "已售出", value: 2},
                    {label: "未售出", value: 1},
                ], // 销售状态
                localStatus: [
                    {label:"全部",value:""},
                    {label: "未出售", value: 0},
                    {label: "在售", value: 1},
                    {label: "停售", value: 2},
                    {label: "试麦", value: 3},
                    {label: "缺货", value: 4},
                ], //本地状态
                chooses: [
                    {label:"全部",value:""},
                    {label: "是", value: 1},
                    {label: "否", value: 0},
                ], //选择是、否
                payPals: [],
                msgImgs: [
                    {label: "未使用橱窗图片", value: ""},
                    {label: "Plus", value: "Plus"},
                    {label: "Gallery", value: "Gallery"},
                    {label: "Featured", value: "Featured"}
                ],
                withins:[], //退货时间
                dispaths:[], // 备货时间
                listings:[],
                choosesTimes: [
                    {label: "刊登时间", value: "start"},
                    {label: "结束时间", value: "end"},
                ],
                pickerStart:{},
                pickerEnd:{},
                promotionList:[],
                choiceList:[],
                categoryDialog:false,
                noChoiceSite:true,
                noChoiceAccount:true,
                noSaleWay:true,
                disabled:true,
                appliList:[
                    {label:"全部",value:""},
                    {label:"erp刊登",value:1},
                    {label:"非erp刊登",value:0},
                ],
                searchTypeList:[
                    {label:'选择',value:'select'},
                    {label:'文本',value:'input'},
                ],
                priceChange:[
                    {label:'全部',value:1},
                    {label:'涨价',value:2},
                    {label:'降价',value:3},
                    {label:'无',value:4}
                ],
                disabledPrice:true,
            }
        },
        created(){
            this.init();
        },
        methods:{
            change_type(){
                this.searchData.account_code = '';
                this.searchData.account_id = '';
            },
            init(){
                this.loading = true;
                this.get_cate();
            },
            get_paypals(val){
                let data = {
                    account_id:val
                };
                this.$http(api_get_paypals,data).then(res => {
                    this.payPals = [{account_name:"全部",id:""}];
                    res.data.min_paypals.forEach(row=>{
                    	let find = this.payPals.find(it=>it.id===row.id);
                    	!find&&this.payPals.push(row);
                    });
                    res.data.max_paypals.forEach(row=>{
                        let find = this.payPals.find(it=>it.id===row.id);
                        !find&&this.payPals.push(row);
                    });
                }).catch(code => {
                    this.$message({
                        type:"error",
                        message: code.message || code,
                    });
                    setTimeout(() => {
                        this.loading = false;
                    }, 200);
                });
            },
            get_within_dispath_time(val){
                let data = {
                    Site:val
                };
                this.$http(api_get_dispatch_time_max,data).then(res => {
                    this.dispaths = [{description:"全部",dispatch_time_max:""},...res.data];
                }).catch(code => {
                    setTimeout(() => {
                        this.loading = false;
                    }, 200);
                });
                this.$http(api_get_within,data).then(res => {
                    this.withins = [{description:"全部",returns_within_option:""},...res.data];
                }).catch(code => {
                    setTimeout(() => {
                        this.loading = false;
                    }, 200);
                });
            },
            get_promotion(){
                let data = {
                    "ebay_account":this.searchData.account_id,
                    "model_name":"",
                    "site":this.searchData.site,
                    "status":""
                };
                this.$http(api_get_promotion_list,data).then(res=>{
                    this.promotionList = res.data.map((item)=>{
                        return {
                            label:item.model_name,
                            value:item.id,
                        }
                    });
                    this.promotionList.unshift({label:"全部",value:""});
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            get_cate(){
                this.$http(api_common_modeList,{model_type:"cate"}).then(res=>{
                    this.listings = res.data.map((item)=>{
                        return {
                            label:item.model_name,
                            value:item.id,
                        }
                    });
                    this.listings.unshift({label:"全部",value:""});
                }).catch(code=>{
                    this.$message({
                        type:"error",
                        message: code.message || code
                    });
                });
            },
            search(){
//                if(!!this.searchData.start_date){
//                    let param = new Date(this.searchData.start_date).getTime()/1000;
//                    this.searchData.start_date = datef('YYYY-MM-dd',param);
//                }
//                if(!!this.searchData.end_date){
//                    let param = new Date(this.searchData.end_date).getTime()/1000;
//                    this.searchData.end_date = datef('YYYY-MM-dd',param);
//                }
                this.$emit("search",this.searchData);
            },
            choose_product(){
                if(this.searchData.site||this.searchData.site===0){
                    this.categoryDialog = true;
                }else {
                    this.$message({
                        type:"warning",
                        message: "请先选择站点"
                    });
                }
            },
            submit(val){
                if(val instanceof Array){
                    val.forEach(row =>{
                        this.searchData.category = row.category_id;
                    });
                }else{
                    let index = val.indexOf("-");
                    this.searchData.category = val.slice(0,index);
                }
                this.categoryDialog = false;
            }
        },
        computed:{
        },
        watch:{
            'searchData.adjusted_price'(val){
                if(val === 1){
                    this.disabledPrice = true;
                    this.searchData.adjust_range = '';
                }else if(val === 4) {
                    this.disabledPrice = true;
                    this.searchData.adjust_range = 0;
                }else{
                    this.searchData.adjust_range = '';
                    this.disabledPrice = false;
                }
            },
            'searchData.return_time'(val){
                // console.log(val)
            },
            'searchData.listing_type'(val){
                this.searchData.listing_duration="";
                if(!val){
                    this.noSaleWay = true;
                    return;
                }
                this.noSaleWay = false;
                if(val===2){
                    this.addTimes=[
                        {label:"全部",value:""},
                        {label:"GTC",value:1},
                        {label:"3天",value:3},
                        {label:"5天",value:4},
                        {label:"7天",value:5},
                        {label:"10天",value:6},
                        {label:"30天",value:7},

                    ]
                }else{
                    this.addTimes=[
                        {label:"全部",value:""},
                        {label:"1天",value:2},
                        {label:"3天",value:3},
                        {label:"5天",value:4},
                        {label:"7天",value:5},
                        {label:"10天",value:6},
                    ]
                }
            },
            'searchData.account_id'(val){
                if(!val){
                    this.noChoiceAccount = true;
                    return
                }
                this.noChoiceAccount = false;
                this.get_paypals(val);
                this.get_promotion()
            },
            'searchData.site'(val) {
                if(!val&&val!==0){
                    this.noChoiceSite = true;
                    return
                }
                this.noChoiceSite = false;
                this.get_within_dispath_time(val);
                this.get_promotion()
            }
        },
        props:{
            searchData: {
                required:true,
                type:Object,
            },
            siteList:{
                required:true,
                type:Array,
            },
            clears:{
                required:true,
                type:Object,
            }
        },
        components:{
            labelItem:require("../../../../../components/label-item.vue").default,
            searchCard:require('../../../../../components/search-card.vue').default,
            categoryDialog:require("../../category-dialog.vue").default,
            paramAccount:require("../../../../../api-components/param-account.vue").default,
            orderInput:require("../../../../../components/order-input.vue").default,
        }
    }
</script>
