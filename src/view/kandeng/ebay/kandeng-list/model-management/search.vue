<template>
    <div class="p-search">
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears" @init-params="initParams">
                <el-select v-sf.searchChooese v-model="searchData.searchChooese" class="inline mb-mini s-width-small">
                    <el-option v-for="item in goods"
                               :key="item.value"
                               :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-input v-model="searchData.snText" :placeholder="$t('ebay-list.Fuzzy')"
                          @keyup.enter.native="search"
                          v-if="searchData.searchChooese==='title'"
                          class="inline width-super mb-mini mr-sm"></el-input>
                <order-input v-model="searchData.snText"
                             @keydown="search"
                             class="inline width-super mb-mini mr-sm"
                             v-else v-sf.snText
                             :placeholder="$t('ebay-list.searchTip')"></order-input>
            <label class=" mb-mini">{{$t('ebay-list.account')}}：</label>
                    <el-select v-model="searchData.searchType"
                               @change="change_type"
                               class="inline s-width-mini mb-mini" v-sf.searchType
                               default-first-option filterable clearable>
                        <el-option
                            v-for="res in typeList"
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
                                 class="inline s-width-large mr-sm" :placeholder="$t('ebay-list.searchTip')"></order-input>

                <label class=" mb-mini">{{$t('ebay-list.site')}}：</label>
                <el-select v-sf.site v-model="searchData.site" class="inline mb-mini mr-sm s-width-default">
                    <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                </el-select>
                <label class=" mb-mini">{{$t('ebay-list.saleType')}}：</label>
                <el-select v-sf.listing_type v-model="searchData.listing_type" class="inline mb-mini mr-sm s-width-small">
                    <el-option v-for="item in saleWay"
                               :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <label class=" mb-mini">{{$t('ebay-list.UploadCategory')}}：</label>
                <el-input :placeholder="$t('ebay-list.searchContent')" v-sf.category v-model="searchData.category_id"
                          :disabled="disabled" class="inline mb-mini mr-mini width-lg"></el-input>
                <a class="inline mb-mini mr-sm blue-color" @click="choose_product">{{$t('ebay-list.selProcategory')}}</a>
            <!--</el-row>-->
                <el-select v-sf.pub_time v-model="searchData.pub_time" class="inline s-width-small">
                    <el-option v-for="item in choosesTime" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-date-picker class="inline date" v-sf.pub_start v-model="searchData.pub_start" type="date"
                                :picker-options="pickerstart" :placeholder="$t('ebay-list.sTime')"></el-date-picker>
                --
                <el-date-picker class="inline date mr-sm" v-sf.pub_end v-model="searchData.pub_end" type="date"
                                :picker-options="pickerend" :placeholder="$t('ebay-list.eTime')"></el-date-picker>
                <label class=" mb-mini">{{$t('ebay-list.SKUAttribute')}}</label>
                <el-select v-sf.model_cate v-model="searchData.variation"
                           filterable clearable class="inline mb-mini mr-sm s-width-default">
                    <el-option v-for="item in propertyList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            <label class=" mb-mini">{{$t('ebay-list.upTool')}}：</label>
                <el-select v-sf.application v-model="searchData.application"
                           :placeholder="$t('ebay-list.all')" clearable class="inline mr-sm s-width-middle">
                    <el-option
                        v-for="item in appliList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            <label class=" mb-mini">{{$t('ebay-list.display')}}：</label>
                <el-select v-sf.listing_duration v-model="searchData.listing_duration"
                           :disabled="noSaleWay" placeholder="全部" class="inline mb-mini mr-sm s-width-small">
                    <el-option v-for="item in addTimes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            <label class=" mb-mini">{{$t('ebay-list.regularRules')}}：</label>
                <el-select v-sf.rule_id v-model="searchData.rule_id" class="inline mb-mini mr-sm s-width-small">
                    <el-option v-for="item in ruleList" :key="item.id" :label="item.timing_rule_name" :value="item.id"></el-option>
                </el-select>
            <label class=" mb-mini">{{$t('ebay-list.founder')}}：</label>
                <el-input :label="$t('ebay-list.searchContent')" v-sf.realname v-model="searchData.realname" class="inline mb-mini mr-sm width-default"></el-input>
            <label class=" mb-mini">{{$t('ebay-list.ProductLocation')}}：</label>
                <el-input :placeholder="$t('ebay-list.enterTip')" v-sf.location v-model="searchData.location" class="inline mb-mini mr-sm"></el-input>
            <label class=" mb-mini">{{$t('ebay-list.LogisticsProperties')}}：</label>
                <el-select v-sf.transport_property v-model="searchData.transport_property"  clearable class="inline mr-sm s-width-mini">
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
            <label-item :label="$t('ebay-list.kand')" class="">
                <el-select v-model="searchData.listing_status" multiple clearable
                           size="mini"
                           :placeholder="$t('ebay-list.ps')"
                           class="multiple_width mb-mini" >
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
        </search-card>
        <category-dialog v-model="categoryDialog" :site="searchData.site" @submit="submit"></category-dialog>
    </div>
</template>
<style lang="stylus" scoped>

    .p-search{
        .multiple_width{
            width 1034px;
        }
        .el-card{
            overflow: inherit;
        }
        .blue-color{
            cursor pointer;
            color: #33B2FC;
        }
    }
</style>
<script>
    import {
        api_get_account,
        api_get_timing_rule_list,
        api_listing_management,
        api_get_combList,
    } from '../../../../../api/ebay-kandeng-public-module';
    export default{
        data(){
            return {
                accountList:[],
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.pub_end){
                            return  time.getTime() > this.searchData.pub_end;
                        }else {
                            return false;
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.pub_start){
                            return  time.getTime() < this.searchData.pub_start;
                        }else {
                            return false;
                        }
                    }
                },
                transport:[{label: this.$t('ebay-list.all'),value:''},
                    {label:this.$t('ebay-list.GeneralGoods'),value:this.$t('ebay-list.GeneralGoods')},
                    {label:this.$t('ebay-list.UnGeneralGoods'),value:this.$t('ebay-list.UnGeneralGoods')},],
                prices:[{label:this.$t('ebay-list.all'),value:''},{label:'>',value:'>'},{label:'=',value:'='},{label:'<',value:'<'}],
                ruleList:[],
                appliList:[
                    {label:this.$t('ebay-list.all'),value:""},
                    {label:this.$t('ebay-list.erp'),value:1},
                    {label:this.$t('ebay-list.UnErpUpload'),value:0},
                ],
                options:[{
                    value: 0,
                    label: this.$t('ebay-list.notPub')
                },{
                    value: 1,
                    label: this.$t('ebay-list.alreadyPublish')
                },{
                    value: 2,
                    label: this.$t('ebay-list.Uploading')
                },{
                    value: 3,
                    label: this.$t('ebay-list.uploadSuccess')
                },{
                    value: 4,
                    label: this.$t('ebay-list.uploadFailed')
                },{
                    value: 5,
                    label: this.$t('ebay-list.uploadingList')
                },{
                    value: 6,
                    label: this.$t('ebay-list.Updapting')
                },{
                    value: 7,
                    label: this.$t('ebay-list.UpdaptFailed')
                },{
                    value: 8,
                    label: this.$t('ebay-list.removeListing')
                },{
                    value: 9,
                    label: this.$t('ebay-list.ListingOff')
                },{
                    value: 10,
                    label: this.$t('ebay-list.removeFailed')
                },{
                    value: 11,
                    label: this.$t('ebay-list.over')
                },{
                    value: 12,
                    label: this.$t('ebay-list.rejoin')
                },{
                    value: 13,
                    label: this.$t('ebay-list.failRejoin')
                },],
                choosesTime: [
                    {label: this.$t('ebay-list.siteTime'), value: "site"},
                    {label: this.$t('ebay-list.localTime'), value: "local"},
                    {label: this.$t('ebay-list.cTime'), value: "create"},
                    {label: this.$t('ebay-list.update'), value: "update"},
                ],
                goods: [
                    {
                        value: 'ids',
                        label: this.$t('ebay-list.TemplateId'),
                    },
                    {
                        value: 'sku',
                        label:  this.$t('ebay-list.localsku'),
                    },
                    {
                        value: 'spu',
                        label: this.$t('ebay-list.localspu')
                    },
                    {
                        value: 'title',
                        label: this.$t('ebay-list.upTitle')
                    },
                    {
                        value: 'draft_name',
                        label: this.$t('ebay-list.TemplateName')
                    },
                ],
                noChoiceSite:true,
                categoryDialog:false,
                typeList:[
                    {label:this.$t('ebay-list.choice'),value:'select'},
                    {label:this.$t('ebay-list.Text'),value:'text'},
                ],
                saleWay: [
                    {label:this.$t('ebay-list.all'),value:""},
                    {label: this.$t('ebay-list.FixedPrice'), value: "1"},
                    {label: this.$t('ebay-list.Auction'), value: "2"}
                ], //销售方式
                addTimes: [], //上架时间
                pickerStart:{},
                pickerEnd:{},
                promotionList:[],
                choiceList:[],
                cateList:[],
                shareList:[
                    {label:this.$t('ebay-list.all'),value:''},
                    {label:this.$t('ebay-list.noShared'),value:1},
                    {label:this.$t('ebay-list.Shared'),value:2},
                    {label:this.$t('ebay-list.share'),value:4},
                ],
                propertyList:[
                    {label:this.$t('ebay-list.all'),value:''},
                    {label:this.$t('ebay-list.SingleAttribute'),value:0},
                    {label:this.$t('ebay-list.MultiAttribute'),value:1},
                ],
                publishList:[
                    {label:this.$t('ebay-list.all'),value:''},
                    {label:this.$t('ebay-list.pubed'),value:0},
                    {label:this.$t('ebay-list.unPub'),value:1},
                ],
                noSaleWay:true,
                ruleTime:"",
                ruleTimes:[],
                disabled:true,
            }
        },
        created(){
            this.init();
            this.get_model();
            this.getList();
        },
        mounted(){
        	this.getCate()
        },
        methods:{
            initParams(){
                this.$emit('secondClear')
            },
            get_model(){
                this.$http(api_get_timing_rule_list,{data:{}}).then(res=>{
                    this.ruleList = res.data.rows;
                    this.ruleList.unshift({timing_rule_name:this.$t('ebay-list.all'),id:""});
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            change_type(){
                this.searchData.account_id = '';
                this.searchData.account_code = '';
            },
            init(){
                this.loading = true;
                this.get_listing_management();
                this.init_all_select()
            },
            get_listing_management(){
                this.$http(api_listing_management).then(res => {
                    this.loading = false;
                    this.listings = res.data;
                }).catch(code => {
                    this.$message({
                        type:"error",
                        message: code.message || code
                    });
                    setTimeout(() => {
                        this.loading = false;
                    }, 200);
                })
            },
            getCate(){
                let data={
                    accountId:"",
                    moduleName:"",
                    siteId:"",
                    type:2,
                    status:"",
//                    page:this.page,
//                    size:this.pageSize
                };
                // this.$http(api_get_combList,data).then(res=>{
                //     this.cateList = res.data.map((item)=>{
                //         return {
                //             label:item.model_name,
                //             value:item.id,
                //         }
                //     });
                // }).catch(code=>{
                //     this.$message({message:code.message||code,type:'error'})
                // })
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
            init_all_select(){
                let data = ["promotion","choice"];
                data.forEach((row)=>{
                    let cur= [];
                    this.$http(api_get_combList,{type:row}).then(res=>{
                        cur = res.data.map((item)=>{
                            return {
                                label:item.model_name,
                                value:item.id,
                            }
                        });
                        switch(row){
                            case 'promotion':
                                this.promotionList = cur;
                                break;
                            case 'choice':
                                this.choiceList = cur;
                                break;
                        }
                    }).catch(code=>{
                        this.$message({
                            type:"error",
                            message: code.message || code
                        });
                    });
                })
            },
            search(){
                this.$emit("search",this.searchData);
            },
            submit(val){
            	if(val instanceof Array){
                    val.forEach(row =>{
                        this.searchData.category_id = row.category_id;
                    });
                }else{
            		let index = val.indexOf("-");
                    this.searchData.category_id = val.slice(0,index);
                }
                this.categoryDialog = false;
            },
            getList(){
                this.$http(api_get_account,{}).then(res=>{
                    this.accountList = res.data.map(row=>{
                        return {
                            label:row.code,
                            value:row.id
                        };
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
        },
        computed:{
        },
        watch:{
            'searchData.listing_type'(val){
                this.searchData.listing_duration="";
                if(!val){
                    this.noSaleWay = true;
                    return
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
            'searchData.site'(val) {
                if(!val&&val!==0){
                    this.noChoiceSite = true;
                    return
                }
                this.noChoiceSite = false;
            },
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
            paramAccount:require("../../../../../api-components/param-account.vue").default,
            categoryDialog:require("../../category-dialog.vue").default,
            uiLimitNumber:require('../../../../../components/ui-limit-number.vue').default,
            orderInput:require("../../../../../components/order-input.vue").default,
        }
    }
</script>
