<template>
    <div class="p-search">
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears" @init-params="initParams">
            <el-select v-sf.searchChooese v-model="searchData.searchChooese" class="inline mb-mini s-width-small">
                <el-option v-for="item in goods" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-input v-model="searchData.snText" :placeholder="$t('ebay-list.Fuzzy')"
                      @keyup.enter.native="search"
                      v-if="searchData.searchChooese==='title'"
                      class="inline width-super mb-mini mr-sm"></el-input>
            <order-input v-model="searchData.snText"
                         class="inline width-super mb-mini mr-sm"
                         v-else v-sf.snText
                         @keydown="search"
                         :placeholder="$t('ebay-list.searchTip')"></order-input>
            <label class=" mb-mini">{{$t('ebay-list.account')}}：</label>
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
                <super-select v-if="searchData.searchType==='select'"
                              class="inline mr-sm mb-mini s-width-default"
                              v-model="searchData.account_id"
                              :options="accountList"
                              storageKey="ebayAccount">
                </super-select>
                <order-input v-model="searchData.account_code" v-sf.account_code
                             v-else @keydown="search"
                             class="inline s-width-large mr-sm"
                             :placeholder="$t('ebay-list.searchTip')"></order-input>
            <label class=" mb-mini">{{$t('ebay-list.site')}}：</label>
                <el-select v-sf.site v-model="searchData.site" clearable
                           class="inline mb-mini mr-sm s-width-small" filterable>
                    <el-option v-for="item in siteList"
                               :key="item.id"
                               :label="item.label"
                               :value="item.id"></el-option>
                </el-select>
            <label class=" mb-mini">{{$t('ebay-list.saleType')}}：</label>
                <el-select v-sf.listing_type v-model="searchData.listing_type"
                           class="inline mb-mini mr-sm s-width-mini">
                    <el-option v-for="item in saleWay"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            <label class=" mb-mini">{{$t('ebay-list.display')}}：</label>
                <el-select v-sf.listing_duration v-model="searchData.listing_duration" :placeholder="$t('ebay-list.all')"
                           :disabled="noSaleWay" class="inline mb-mini mr-sm s-width-mini">
                    <el-option v-for="item in addTimes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            <label class=" mb-mini">{{$t('ebay-list.AutomaticReplenishment')}}：</label>
                <el-select v-sf.replen v-model="searchData.replen" class="inline mb-mini mr-sm s-width-default">
                    <el-option v-for="item in autoAdds" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            <label class=" mb-mini">{{$t('ebay-list.ProductType')}}：</label>
                <el-select v-sf.goods_type v-model="searchData.goods_type" class="inline mb-mini mr-sm s-width-small">
                    <el-option v-for="item in productypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            <label class=" mb-mini">{{$t('ebay-list.SalesStatus')}}：</label>
                <el-select v-sf.work_off v-model="searchData.work_off" class="inline mb-mini mr-sm s-width-mini">
                    <el-option v-for="item in saleStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            <label class=" mb-mini">{{$t('ebay-list.localStatus')}}：</label>
                <el-select v-sf.sales_status v-model="searchData.sales_status" class="inline mb-mini mr-sm s-width-mini">
                    <el-option v-for="item in localStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            <label class=" mb-mini">{{$t('ebay-list.UploadCategory')}}：</label>
                <el-input :placeholder="$t('ebay-list.searchContent')" v-sf.category v-model="searchData.category"
                          :disabled="disabled" class="inline mb-mini s-width-middle"></el-input>
                <a class="inline mb-mini mr-sm blue-color" @click="choose_product">{{$t('ebay-list.selProcategory')}}</a>
            <label class=" mb-mini">{{$t('ebay-list.IfReload')}}：</label>
                <el-select v-sf.restart v-model="searchData.restart" class="inline mb-mini mr-sm s-width-mini">
                    <el-option v-for="item in chooses" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            <label class=" mb-mini">{{$t('ebay-list.PayPalAccount')}}：</label>
                <el-select v-sf.paypal_emailaddress v-model="searchData.paypal_emailaddress" :placeholder="$t('ebay-list.all')"
                           :disabled="noChoiceAccount" class="inline mb-mini mr-sm s-width-default">
                    <el-option v-for="item in payPals" :key="item.id" :label="item.account_name" :value="item.id"></el-option>
                </el-select>
            <label class=" mb-mini">{{$t('ebay-list.windowPicture')}}：</label>
                <el-select v-sf.picture_gallery v-model="searchData.picture_gallery" class="inline mb-mini mr-sm s-width-default">
                    <el-option v-for="item in msgImgs" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            <label class=" mb-mini">{{$t('ebay-list.ProductLocation')}}：</label>
                <el-input :placeholder="$t('ebay-list.enterTip')" v-sf.location v-model="searchData.location" class="inline mb-mini mr-sm"></el-input>
            <label class=" mb-mini">{{$t('ebay-list.stockOnline')}}：</label>
                <el-select v-sf.quantity v-model="searchData.quantity" class="inline mb-mini mr-sm s-width-mini">
                    <el-option v-for="item in chooses" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            <label class=" mb-mini">{{$t('ebay-list.BestOfferStart')}}：</label>
                <el-select v-sf.best_offer v-model="searchData.best_offer" class="inline mb-mini mr-sm s-width-mini">
                    <el-option v-for="item in chooses" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            <label class=" mb-mini">{{$t('ebay-list.cxsetting')}}：</label>
                <el-select v-sf.promotion_id v-model="searchData.promotion_id" :placeholder="$t('ebay-list.all')"
                           :disabled="noChoiceAccount" class="inline mb-mini mr-sm s-width-default">
                    <el-option v-for="item in promotionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            <label class=" mb-mini">{{$t('ebay-list.ReturnTime')}}：</label>
                <el-select v-sf.return_time v-model="searchData.return_time" :placeholder="$t('ebay-list.all')"
                           :disabled="noChoiceSite" class="inline mr-sm s-width-default">
                    <el-option v-for="item in withins" :key="item.returns_within_option" :label="item.description" :value="item.returns_within_option"></el-option>
                </el-select>
            <label-item label="是否有副标题：">
                <el-select v-sf.sub_title v-model="searchData.sub_title" class="inline mr-sm s-width-mini">
                    <el-option v-for="item in chooses" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </label-item>
            <label class=" mb-mini">{{$t('ebay-list.StockingTime')}}：</label>
                <el-select v-sf.dispatch_max_time v-model="searchData.dispatch_max_time" :placeholder="$t('ebay-list.all')"
                           :disabled="noChoiceSite" class="inline mr-sm s-width-small">
                    <el-option v-for="item in dispaths" :key="item.dispatch_time_max" :label="item.description" :value="item.dispatch_time_max"></el-option>
                </el-select>
            <label class=" mb-mini">{{$t('ebay-list.ListingCategory')}}：</label>
                <el-select v-sf.listing_cate v-model="searchData.listing_cate" class="inline mr-sm s-width-default">
                    <el-option v-for="item in listings" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            <label class=" mb-mini">{{$t('ebay-list.upTool')}}：</label>
                <el-select v-sf.application v-model="searchData.application" :placeholder="$t('ebay-list.all')" clearable class="inline mr-sm s-width-middle">
                    <el-option
                        v-for="item in appliList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            <label class=" mb-mini">{{$t('ebay-list.priceMove')}}：</label>
                <el-select v-sf.adjusted_price v-model="searchData.adjusted_price" class="inline s-width-small">
                    <el-option v-for="item in priceChange" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>

                <el-input :disabled="disabledPrice" :placeholder="$t('ebay-list.AmountRange')" v-sf.adjust_range v-model="searchData.adjust_range" class="inline mr-sm width-xs"></el-input>
            <el-select v-sf.name v-model="searchData.name" class="inline s-width-small">
                <el-option v-for="item in choosesTimes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-date-picker class="inline date" v-sf.start_date
                            v-model="searchData.start_date" type="date"
                            :picker-options="pickerstart" :placeholder="$t('ebay-list.sDate')"></el-date-picker>
            --
            <el-date-picker class="inline date mr-sm" v-sf.end_date
                            v-model="searchData.end_date" type="date"
                            :picker-options="pickerend" :placeholder="$t('ebay-list.eDate')"></el-date-picker>
            <label class=" mb-mini">{{$t('ebay-list.virtualWarehouseDelivery')}}</label>
                <el-select v-sf.application v-model="searchData.is_virtual_send" :placeholder="$t('ebay-list.all')" clearable class="inline mr-sm s-width-mini">
                    <el-option
                        v-for="item in realWares"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            <label class=" mb-mini">{{$t('ebay-list.LogisticsProperties')}}：</label>
                <el-select  v-model="searchData.transport_property"  clearable class="inline mr-sm s-width-mini">
                    <el-option
                        v-for="item in transport"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            <label class=" mb-mini">{{$t('ebay-list.price')}}：</label>
                <el-select v-model="price.name"
                           class="inline s-width-mini mb-mini"
                           default-first-option filterable clearable>
                    <el-option
                        v-for="res in prices"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                    ></el-option>
                </el-select>
                <ui-limit-number v-model="price.num"
                                 :limit="2"
                                 :nagetive="false"
                                 :disabled="price.name===''?true:false"
                                 class="inline mb-mini width-mini mr-sm"
                ></ui-limit-number>
            <label class="ml-sm">{{$t('ymx-list.tortPlatform')}}：</label>
            <super-select v-sf.tort_channel_id
                          class="inline s-width-default"
                          v-model="searchData.tort_channel_id"
                          :options="tortPlatform"
                          placeholder="请选择"
                          storageKey="tortPlatform">
            </super-select>
            <label class="ml-sm">商品类型：</label>
            <el-select v-sf.model_cate v-model="searchData.variation"
                       filterable clearable class="inline mb-mini mr-sm s-width-default">
                <el-option v-for="item in propertyList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
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
        overflow: visible ;
    }
</style>
<script>
    import {
        api_get_channel,
    } from '@/api/order-local';
    import {api_get_account,api_get_ebay_site,api_listing_management,api_get_combList,api_get_paypals,api_get_within,api_get_dispatch_time_max,api_get_combs} from '../../../../../api/ebay-kandeng-public-module';
    export default{
        data(){
            return {
                propertyList:[
                    {label:this.$t('ebay-list.all'),value:''},
                    {label:this.$t('ebay-list.SingleAttribute'),value:0},
                    {label:this.$t('ebay-list.MultiAttribute'),value:1},
                ],
                accountList:[],
                tortPlatform:[],
                realWares:[{label:this.$t('ebay-list.all'),value:''},{label:this.$t('ebay-list.yes'),value:1},{label:this.$t('ebay-list.no'),value:0}],
                transport:[{label:this.$t('ebay-list.all'),value:''},{label:this.$t('ebay-list.GeneralGoods'),value:'普货'},{label:this.$t('ebay-list.UnGeneralGoods'),value:'非普货'},],
                prices:[{label:this.$t('ebay-list.all'),value:''},{label:'>',value:'>'},{label:'=',value:'='},{label:'<',value:'<'}],
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
                        value: 'ids',
                        label: this.$t('ebay-list.TemplateId'),
                    },
                    {
                        value: 'itemID',
                        label: 'ItemID'
                    },
                    {
                        value: 'listing_sku',
                        label: this.$t('ebay-list.platsku')
                    },
                    {
                        value: 'sku',
                        label: this.$t('ebay-list.localsku')
                    },
                    {
                        value: 'spu',
                        label: this.$t('ebay-list.localspu')
                    },
                    {
                        value: 'title',
                        label: this.$t('ebay-list.upTitle')
                    },
                ],
                saleWay: [
                    {label:this.$t('ebay-list.all'),value:""},
                    {label: this.$t('ebay-list.FixedPrice'), value: 1},
                    {label:  this.$t('ebay-list.Auction'), value: 2},
                ], //销售方式
                addTimes: [], //上架时间
                autoAdds: [
                    {label:this.$t('ebay-list.all'),value:""},
                    {label:this.$t('ebay-list.dataSale'), value: 1},
                    {label: this.$t('ebay-list.close'), value: 0}
                ], //自动补货
                productypes: [
                    {label:this.$t('ebay-list.all'),value:""},
                    {label:this.$t('ebay-list.bind'), value: 1},
                    {label:this.$t('ebay-list.UnBind'), value: 0},
                ], //产品类型
                saleStatus: [
                    {label:this.$t('ebay-list.all'),value:""},
                    {label:this.$t('ebay-list.Sold'), value: 2},
                    {label:this.$t('ebay-list.UnSold'), value: 1},
                ], // 销售状态
                localStatus: [
                    {label:this.$t('ebay-list.all'),value:""},
                    {label:this.$t('ebay-list.UnSold'), value: 0},
                    {label: this.$t('ebay-list.active'), value: 1},
                    {label: this.$t('ebay-list.Unsold'), value: 2},
                    {label:this.$t('ebay-list.TrialSale'), value: 3},
                    {label: this.$t('ebay-list.outStock'), value: 4},
                ], //本地状态
                chooses: [
                    {label:this.$t('ebay-list.all'),value:""},
                    {label: this.$t('ebay-list.yes'), value: 1},
                    {label: this.$t('ebay-list.no'), value: 0},
                ], //选择是、否
                payPals: [],
                msgImgs: [
                    {label: this.$t('ebay-list.UnUsePicture'), value: ""},
                    {label: "Plus", value: "Plus"},
                    {label: "Gallery", value: "Gallery"},
                    {label: "Featured", value: "Featured"}
                ],
                withins:[], //退货时间
                dispaths:[], // 备货时间
                listings:[],
                choosesTimes: [
                    {label: this.$t('ebay-list.UploadTime'), value: "start"},
                    {label: this.$t('ebay-list.eTime'), value: "end"},
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
                    {label:this.$t('ebay-list.all'),value:""},
                    {label:this.$t('ebay-list.erp'),value:1},
                    {label:this.$t('ebay-list.UnErpUpload'),value:0},
                ],
                searchTypeList:[
                    {label:this.$t('ebay-list.choice'),value:'select'},
                    {label:this.$t('ebay-list.Text'),value:'input'},
                ],
                priceChange:[
                    {label:this.$t('ebay-list.all'),value:1},
                    {label:this.$t('ebay-list.priceIn'),value:2},
                    {label:this.$t('ebay-list.priceDe'),value:3},
                    {label:this.$t('ebay-list.n'),value:4}
                ],
                disabledPrice:true,
            }
        },
        created(){
            this.init();
            this.get_channel();
            this.getList();
        },
        methods:{
            get_channel(){
                this.$http(api_get_channel,{})
                    .then(res=>{
                        this.tortPlatform=[{label:this.$t('ymx-list.all'),value:0},...res]
                    })
                    .catch(err=>{
                        console.log(err);
                    })
            },
            getList(){
                this.$http(api_get_account,{}).then(res=>{
                    this.accountList = res.data.map(row=>{
                        return {
                            label:row.code,
                            value:row.id
                        };
                    });
                    this.params.account = this.accountList[0].value;

                }).catch(code=>{
                    console.log(code);
                })
            },

            initParams(){
                this.$emit('secondClear')
            },
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
                    this.payPals = [{account_name:this.$t('ebay-list.all'),id:""}];
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
                    this.dispaths = [{description:this.$t('ebay-list.all'),dispatch_time_max:""},...res.data];
                }).catch(code => {
                    setTimeout(() => {
                        this.loading = false;
                    }, 200);
                });
                this.$http(api_get_within,data).then(res => {
                    this.withins = [{description:this.$t('ebay-list.all'),returns_within_option:""},...res.data];
                }).catch(code => {
                    setTimeout(() => {
                        this.loading = false;
                    }, 200);
                });
            },
            get_promotion(){
                let data = {
                    "accountId":this.searchData.account_id,
                    "type":"promotion",
                    "siteId":this.searchData.site,
                };
                this.$http(api_get_combs,data).then(res=>{
                    this.promotionList = res.data.map((item)=>{
                        return {
                            label:item.model_name,
                            value:item.id,
                        }
                    });
                    this.promotionList.unshift({label:this.$t('ebay-list.all'),value:""});
                    this.promotionList.push({label:this.$t('ebay-list.NoDiscount'),value:'0'});
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            get_cate(){
                this.$http(api_get_combList,{type:"cate"}).then(res=>{
                    this.listings = res.data.map((item)=>{
                        return {
                            label:item.model_name,
                            value:item.id,
                        }
                    });
                    this.listings.unshift({label:this.$t('ebay-list.all'),value:""});
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
                        message: this.$t('ebay-list.selectTheSite')
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
                        {label:this.$t('ebay-list.all'),value:""},
                        {label:"GTC",value:1},
                        {label:`3${this.$t('ebay-list.days')}`,value:3},
                        {label:`5${this.$t('ebay-list.days')}`,value:4},
                        {label:`7${this.$t('ebay-list.days')}`,value:5},
                        {label:`10${this.$t('ebay-list.days')}`,value:6},
                        {label:`30${this.$t('ebay-list.days')}`,value:7},

                    ]
                }else{
                    this.addTimes=[
                        {label:this.$t('ebay-list.all'),value:""},
                        {label:`1${this.$t('ebay-list.days')}`,value:2},
                        {label:`3${this.$t('ebay-list.days')}`,value:3},
                        {label:`5${this.$t('ebay-list.days')}`,value:4},
                        {label:`7${this.$t('ebay-list.days')}`,value:5},
                        {label:`10${this.$t('ebay-list.days')}`,value:6},
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
            price:{},
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
            uiLimitNumber:require('../../../../../components/ui-limit-number.vue').default,
        }
    }
</script>
