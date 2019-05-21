<template>
    <div>
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears">
            <div class="mb-mini">
                <el-select class="inline s-width-default"
                           v-sf.snType
                           v-model="searchData.snType">
                    <el-option v-for="(item, index) in snType" :value="item.value" :label="item.label"
                               :key="index"></el-option>
                </el-select>
                <order-input v-if="searchData.snType!=='title'" class="inline s-width-middle" style="width: 200px!important;" v-model="searchData.snText" @keydown.enter.native="search" :placeholder="getplac"></order-input>
                <el-input
                    v-else
                    class="inline s-width-middle"
                    style="width: 200px!important;"
                    v-model="searchData.snText"
                    :placeholder="getplac"
                    @keydown.enter.native="search"
                >
                </el-input>
                <!--<el-input class="inline s-width-middle" v-model="searchData.snText" :placeholder="$t('ymx-list.searchTip')"></el-input>-->
                <label class="ml-sm">{{$t('ymx-list.site')}}：</label>
                <el-select class="inline s-width-default"
                           v-model="searchData.site"
                           @change="change_site"
                           clearable filterable>
                    <el-option v-for="(item, index) in siteList"
                               :value="item.value"
                               :label="item.label"
                               :key="index"></el-option>
                </el-select>
                <!--<super-select-->
                    <!--class="inline s-width-default"-->
                    <!--v-model="searchData.site"-->
                    <!--@change="change_site"-->
                    <!--v-sf.site-->
                    <!--:clearable="true"-->
                    <!--:options="siteList"-->
                    <!--:placeholder="'全部'"-->
                    <!--storageKey="published_queue_site"-->
                <!--&gt;</super-select>-->
                <label class="ml-sm">{{$t('ymx-list.pa')}}：</label>
                <!--<el-select class="inline s-width-default"-->
                           <!--v-model="searchData.account"-->
                           <!--:disabled="isHasSite"-->
                           <!--filterable :placeholder="$t('ymx-list.selectSite')">-->
                    <!--<el-option v-for="(item, index) in account"-->
                               <!--:label="item.code"-->
                               <!--:value="item.account_id"-->
                               <!--:key="item.account_id"></el-option>-->
                <!--</el-select>-->
                <super-select
                    class="inline s-width-default"
                    v-model="searchData.account"
                    :disabled="isHasSite"
                    v-sf.account
                    :clearable="true"
                    :placeholder="'全部'"
                    :options="account"
                    :storageKey="`${searchData.site}published_queue_account`"
                ></super-select>
                <label class="ml-sm">{{$t('ymx-list.seller')}}：</label>
                <!--<param-account-->
                        <!--class="width-sm"-->
                        <!--ref="paramSale"-->
                        <!--v-model="searchData.saler_id"-->
                        <!--v-sf.saler_id-->
                        <!--:param="{type:'sales',data:{content:''}}"-->
                        <!--:fixResult="sale_fix_result"-->
                        <!--type="memberShipSales"-->
                        <!--:placeholder="$t('ymx-list.pse')"-->
                        <!--url="get|user/sales/staffs">-->
                <!--</param-account>-->
                <super-select
                    class="width-sm inline"
                    v-model="searchData.saler_id"
                    v-sf.saler_id
                    :placeholder="$t('ymx-list.pse')"
                    :options="memberShipSales"
                    storageKey="memberShipSales"
                ></super-select>
                <label class="ml-sm">{{$t('ymx-list.upS')}}：</label>
                <el-select class="inline s-width-default" v-model="searchData.publishStatus">
                    <el-option v-for="(item, index) in update_state"
                               :value="item.value"
                               :label="item.label"
                               :key="index"></el-option>
                </el-select>
            </div>
            <label>{{$t('ymx-list.cTime')}}：</label>
            <el-date-picker class="inline date" v-model="searchData.start" type="date"
                            :picker-options="pickerstart"
                            :placeholder="$t('ymx-list.sDate')"></el-date-picker>
            --
            <el-date-picker class="inline date" v-model="searchData.end" type="date"
                            :picker-options="pickerend" 
                            :placeholder="$t('ymx-list.eDate')"></el-date-picker>
            <!--<label class="ml-sm">{{$t('ymx-list.priceMove')}}：</label>-->
            <!--<el-select v-model="searchData.adjusted_price"-->
                       <!--class="inline s-width-mini"-->
                       <!--:placeholder="$t('ymx-list.ps')"-->
                       <!--default-first-option filterable clearable>-->
                <!--<el-option-->
                        <!--v-for="res in adjustedPrice"-->
                        <!--:label="res.label"-->
                        <!--:value="res.value"-->
                        <!--:key="res.value"-->
                <!--&gt;</el-option>-->
            <!--</el-select>-->
            <!--<el-input v-model="searchData.adjusted_range"-->
                      <!--v-if="searchData.adjusted_price===1||searchData.adjusted_price===2"-->
                      <!--class="inline width-xs"></el-input>-->
        </search-card>
    </div>
</template>

<style lang="stylus" scoped>
    .width-100{
        width:110px;
    }
    .el-card{
        overflow: inherit;
    }
</style>
<script>
    import {api_get_amazon_account,api_sales_staffs,api_development_staffs} from '../../../../api/amazon-publish-list';
    export default{
        data(){
            return {
                snType: [
                    {
                        label: this.$t('ymx-list.localsku'),
                        value: 'sku'
                    },
                    {
                        label: this.$t('ymx-list.localspu'),
                        value: 'spu'
                    },
                    {
                        label: this.$t('ymx-list.platsku'),
                        value: 'platform_sku'
                    },
                    {
                        label: this.$t('ymx-list.upTitle'),
                        value: 'title'
                    },
                    {
                        label: 'UPC',
                        value: 'upc'
                    }
                ],
                update_state:[
                    {
                        label:this.$t('ymx-list.all'),
                        value:''
                    },
                    {
                        label:this.$t('ymx-list.toBeUp'),
                        value:0
                    },
                    {
                        label:this.$t('ymx-list.uploading'),
                        value:1
                    },
                    {
                        label:this.$t('ymx-list.uploaded'),
                        value:2
                    },
                    {
                        label:this.$t('ymx-list.upFailed'),
                        value:3
                    },
                    {
                        label:this.$t('ymx-list.reEdit'),
                        value:4
                    },
                    {
                        label:this.$t('ymx-list.pubDrafts'),
                        value:5
                    },


                ],
                account:[],
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.end){
                            return  time.getTime() > this.searchData.end;
                        }else {
                            return false;
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.start){
                            return  time.getTime() < this.searchData.start;
                        }else {
                            return false;
                        }
                    }
                },
                memberShipSales:[]
            }
        },
        mounted(){
            this.get_sales_staffs();
        },
        methods: {
            sale_fix_result(res){
                res = res.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                });
                return {
                    count: res.length||0,
                    data:res
                }
            },
            get_sales_staffs(){
                this.$http(api_sales_staffs)
                    .then(res=>{
                        res.forEach(item=>{
                            this.memberShipSales.push({label:item.realname,value:item.id});
                        })
                    })
                    .catch(err=>{
                        this.$message({
                            type:'error',
                            message:err.message || err
                        })
                    })
            },
            search(){
                this.$emit('search');
            },
            get_account(){
                this.account = [];
                this.$http(api_get_amazon_account,{site: this.searchData.site}).then(res => {
                    // let obj = {code:this.$t('ymx-list.all'),account_id:''};
                    // res.unshift(obj);
                    this.account = res.map(item=>{
                        return {label:item.code,value:item.account_id};
                    })
                    // this.account = res;
                    // this.searchData.account = this.account.length>0?this.account[0].account_id:'';
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                    // this.account.splice(0, this.account.length);
                })
            },
            change_site(val){
                console.log('选择的站点',val);
                if (!!val) {
                    this.get_account();
                } else {
                    // this.account.splice(0, this.account.length);
                    this.account = [];
                    this.searchData.account = '';
                }
            },
        },
        computed: {
            getplac(){
                return this.searchData.snType=='title'?   this.$t('ymx-list.Fuzzy')+'...':this.$t('ymx-list.searchTip');
            },
            isHasSite(){
                console.log(!this.searchData.site);
                return !this.searchData.site;
            }
        },
        watch: {},
        props: {
            total:{
                required: true,
                type: Number,
                default(){
                    return 0
                }
            },
            siteList:{
                required: true,
                type: Array,
            },
            searchData:{},
            clears:{}
        },
        components: {
            searchCard: require('../../../../components/search-card.vue').default,
            paramAccount:require('@/api-components/param-account.vue').default,
            orderInput:require("@/components/order-input.vue").default,

        }
    }
</script>

