<template>
    <div class="p-search">
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears">
            <el-select v-sf.searchChooese v-model="searchData.searchChooese" clearable class="inline s-width-small">
                <el-option v-for="item in goods" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-input placeholder="请输入搜索内容..." v-sf.snText v-model="searchData.snText" class="inline mr-sm width-lg"></el-input>
            <label-item label="账号简称：">
                <param-account v-sf.account_id v-model="searchData.account_id" url="get|Publish/Ebay/getAccounts"
                               class="inline mb-mini mr-sm s-width-middle" type="ebay"></param-account>
            </label-item>
            <label-item label="站点：">
                <el-select v-sf.site v-model="searchData.site" class="inline mr-sm s-width-default">
                    <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                </el-select>
            </label-item>
            <label-item label="出售方式：">
                <el-select v-sf.listing_type v-model="searchData.listing_type" class="inline mr-sm s-width-small">
                    <el-option v-for="item in saleWay" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="创建时间：">
                <el-date-picker class="inline date s-width-small" v-sf.start_date
                                v-model="searchData.start_date" type="date"
                                :picker-options="pickerstart" placeholder="开始时间"></el-date-picker>
                <span class="ml-sm mr-sm">--</span>
                <el-date-picker class="inline date s-width-small mr-sm" v-sf.end_date
                                v-model="searchData.end_date" type="date"
                                :picker-options="pickerend" placeholder="结束时间"></el-date-picker>
            </label-item>
            <!--<label-item label="上架时间：">-->
                <!--<el-select v-sf.listing_duration v-model="searchData.listing_duration" placeholder="全部"-->
                           <!--:disabled="noSaleWay" class="inline mr-sm s-width-small">-->
                    <!--<el-option v-for="item in addTimes" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
                <!--</el-select>-->
            <!--</label-item>-->
        </search-card>
    </div>
</template>
<style lang="stylus" scoped>

</style>
<script>
    import {api_get_account,api_get_ebay_site,api_listing_management,api_common_modeList} from '../../../../../api/ebay-kandeng-public-module';
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
                        value: 'spu',
                        label: '本地SPU'
                    },
                    {
                        value: 'sku',
                        label: '本地SKU'
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
                // addTimes: [], //上架时间
                promotionList:[],
                choiceList:[],
                // noSaleWay:true,

            }
        },
        created(){
            this.init();
        },
        methods:{
            init(){
                this.loading = true;
                this.init_all_select();
            },
            init_all_select(){
                let arr = ["promotion","choice"];
                arr.forEach((row)=>{
                    let cur= [];
                    this.$http(api_common_modeList,{model_type:row}).then(res=>{
                        cur = res.data.map((item)=>{
                            return {
                                label:item.model_name,
                                value:item.id,
                            };
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
                        console.log(code);
                    });
                });
            },
            search(){
                this.$emit("search",this.searchData);
            },
        },
        watch: {
            // 'searchData.listing_type'(val){
            //     this.searchData.listing_duration = "";
            //     if (!val) {
            //         this.noSaleWay = true;
            //         return
            //     }
            //     this.noSaleWay = false;
            //     if(val===2){
            //         this.addTimes=[
            //             {label:"全部",value:""},
            //             {label:"GTC",value:1},
            //             {label:"3天",value:3},
            //             {label:"5天",value:4},
            //             {label:"7天",value:5},
            //             {label:"10天",value:6},
            //             {label:"30天",value:7},
            //
            //         ]
            //     }else{
            //         this.addTimes=[
            //             {label:"全部",value:""},
            //             {label:"1天",value:2},
            //             {label:"3天",value:3},
            //             {label:"5天",value:4},
            //             {label:"7天",value:5},
            //             {label:"10天",value:6},
            //         ]
            //     }
            // },
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
            },
        },
        components:{
            labelItem:require("../../../../../components/label-item.vue").default,
            searchCard:require('../../../../../components/search-card.vue').default,
            paramAccount:require("../../../../../api-components/param-account.vue").default
        }
    }
</script>
