<template>
    <div class="p-search">
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears">
            <el-row>
                <el-select v-sf.searchChooese v-model="searchData.searchChooese" class="inline mb-mini s-width-small">
                    <el-option v-for="item in goods"
                               :key="item.value"
                               :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-input v-model="searchData.snText" placeholder="模糊搜索..."
                          @keyup.enter.native="search"
                          v-if="searchData.searchChooese==='title'"
                          class="inline width-super mb-mini mr-sm"></el-input>
                <order-input v-model="searchData.snText"
                             @keydown="search"
                             class="inline width-super mb-mini mr-sm"
                             v-else v-sf.snText
                             placeholder="可批量搜索，Shift+回车换行..."></order-input>
                <label-item label="账号简称：">
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
                    <param-account v-if="searchData.searchType==='select'"
                                   v-sf.account_id  v-model="searchData.account_id"
                                   url="get|Publish/Ebay/getAccounts"
                                   class="inline mb-mini mr-sm" type="ebay"></param-account>
                    <order-input v-model="searchData.account_code" v-sf.account_code
                                 v-else @keydown="search"
                                 class="inline s-width-large mr-sm" placeholder="可批量搜索，Shift+回车换行..."></order-input>
                </label-item>
                <label-item label="站点：">
                    <el-select v-sf.site v-model="searchData.site" class="inline mb-mini mr-sm s-width-default">
                        <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                    </el-select>
                </label-item>
                <label-item label="出售方式：">
                    <el-select v-sf.listing_type v-model="searchData.listing_type" class="inline mb-mini mr-sm s-width-small">
                        <el-option v-for="item in saleWay"
                                   :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </label-item>
                <label-item label="刊登分类：">
                    <el-input placeholder="请输入搜索内容..." v-sf.category v-model="searchData.category_id"
                              :disabled="disabled" class="inline mb-mini mr-mini width-lg"></el-input>
                    <a class="inline mb-mini mr-sm blue-color" @click="choose_product">(选择产品分类)</a>
                </label-item>
                <label-item label="范本分类：">
                    <el-select v-sf.model_cate v-model="searchData.model_cate"
                               filterable clearable class="inline mb-mini mr-sm s-width-default">
                        <el-option v-for="item in cateList" :key="item.value" :label="item.label" :value="item.label"></el-option>
                    </el-select>
                </label-item>
                <label-item label="范本共享：">
                    <el-select v-sf.model_cate v-model="searchData.share"
                               filterable clearable class="inline mb-mini mr-sm s-width-default">
                        <el-option v-for="item in shareList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </label-item>
            </el-row>
            <label-item label="创建人：">
                <el-input placeholder="请输入搜索内容..." v-sf.realname v-model="searchData.realname" class="inline mb-mini mr-sm width-default"></el-input>
            </label-item>
            <label-item label="SKU属性：">
                <el-select v-sf.model_cate v-model="searchData.variation"
                           filterable clearable class="inline mb-mini mr-sm s-width-default">
                    <el-option v-for="item in propertyList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="是否已刊登：">
                <el-select v-sf.model_cate v-model="searchData.published"
                           filterable clearable class="inline mb-mini mr-sm s-width-default">
                    <el-option v-for="item in publishList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </label-item>
            <el-select v-sf.name v-model="searchData.name" class="inline s-width-small">
                <el-option v-for="item in choosesTimes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-date-picker class="inline" v-sf.start_date v-model="searchData.start_date" type="datetime"
                            placeholder="开始时间"></el-date-picker>
            --
            <el-date-picker class="inline mr-sm" v-sf.end_date v-model="searchData.end_date" type="datetime"
                            placeholder="结束时间"></el-date-picker>
        </search-card>
        <category-dialog v-model="categoryDialog" :site="searchData.site" @submit="submit"></category-dialog>
    </div>
</template>
<style lang="stylus" scoped>

    .p-search{
        .el-card{
            overflow: inherit;
        }
    }
</style>
<script>
    import {
    	api_get_account,
        api_get_ebay_site,
        api_listing_management,
        api_common_modeList,
        api_get_draft_list,
        api_get_cateList
    } from '../../../../../api/ebay-kandeng-public-module';
    export default{
        data(){
            return {
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.end_date){
                            return  time.getTime() >= this.searchData.end_date;
                        }else {
                            return false;
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.start_date){
                            return  time.getTime() <= this.searchData.start_date;
                        }else {
                            return false;
                        }
                    }
                },
                goods: [
                    {
                        value: 'ids',
                        label: '范本ID'
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
                    {
                        value: 'draft_name',
                        label: '范本名称'
                    },
                ],
                noChoiceSite:true,
                categoryDialog:false,
                typeList:[
                    {label:'选择',value:'select'},
                    {label:'文本',value:'text'},
                ],
                saleWay: [
                    {label:"全部",value:""},
                    {label: "一口价", value: "1"},
                    {label: "拍卖", value: "2"}
                ], //销售方式
                addTimes: [], //上架时间
                pickerStart:{},
                pickerEnd:{},
                promotionList:[],
                choiceList:[],
                choosesTimes: [
                    {label: "创建时间", value: "create"},
                    {label: "更新时间", value: "update"},
                ],
                cateList:[],
                shareList:[
                    {label:'全部',value:''},
                    {label:'未共享',value:1},
                    {label:'已共享',value:2},
                    {label:'他人共享',value:4},
                ],
                propertyList:[
                    {label:'全部',value:''},
                    {label:'单属性',value:0},
                    {label:'多属性',value:1},
                ],
                publishList:[
                    {label:'全部',value:''},
                    {label:'已刊登',value:0},
                    {label:'未刊登',value:1},
                ],
                noSaleWay:true,
                ruleTime:"",
                ruleTimes:[],
                disabled:true,
            }
        },
        created(){
            this.init();
        },
        mounted(){
        	this.getCate()
        },
        methods:{
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
                    ebay_account:"",
                    model_name:"",
                    site:"",
                    type:2,
                    status:"",
//                    page:this.page,
//                    size:this.pageSize
                };
                this.$http(api_get_cateList,data).then(res=>{
                    this.cateList = res.data.map((item)=>{
                        return {
                            label:item.model_name,
                            value:item.id,
                        }
                    });
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
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
            init_all_select(){
                let data = ["promotion","choice"];
                data.forEach((row)=>{
                    let cur= [];
                    this.$http(api_common_modeList,{model_type:row}).then(res=>{
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
        },
        computed:{
        },
        watch:{
            'searchData.site'(val) {
                if(!val&&val!==0){
                    this.noChoiceSite = true;
                    return
                }
                this.noChoiceSite = false;
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
            paramAccount:require("../../../../../api-components/param-account.vue").default,
            categoryDialog:require("../../category-dialog.vue").default,
            uiLimitNumber:require('../../../../../components/ui-limit-number.vue').default,
            orderInput:require("../../../../../components/order-input.vue").default,
        }
    }
</script>
