<template>
    <div class="search-content">
        <search-card @search="search" :params="searchData" :clears="clears">
            <div>
                <el-select class="inline s-width-default mb-mini"
                           v-model="searchData.search_type"
                           v-sf.search_type>
                    <el-option v-for="(item, index) in snType"
                               :value="item.value"
                               :label="item.label"
                               :key="index"></el-option>
                </el-select>
                <order-input
                    v-if="searchData.search_type!==4"
                    v-model="searchData.search_content"
                    class="inline width-super mb-mini"
                    v-sf.search_content
                    :placeholder="getplac"
                    @keydown="search"></order-input>
                <el-input
                    v-else
                    class="inline width-super mb-mini"
                    v-sf.search_content
                    v-model="searchData.search_content"
                    :placeholder="getplac"
                    @keydown.enter.native="search"
                >
                </el-input>
                <label class="ml-sm mb-mini">{{$t('ymx-list.site')}}：</label>
                <el-select class="inline s-width-default mb-mini"
                           @change="change_site"
                           v-model="searchData.site"
                           filterable v-sf.site>
                    <el-option v-for="(item, index) in siteList"
                               :value="item.value"
                               :label="item.label"
                               :key="index"></el-option>
                </el-select>
                <!--<super-select-->
                    <!--class="inline s-width-default mb-mini"-->
                    <!--@change="change_site"-->
                    <!--v-model="searchData.site"-->
                    <!--v-sf.site-->
                    <!--:options="siteList"-->
                    <!--:placeholder="'全部'"-->
                    <!--:storageKey="'has_published_site'"-->
                <!--&gt;</super-select>-->
                <label class="ml-sm mb-mini">{{$t('ymx-list.pa')}}：</label>
                <!--<el-select class="inline s-width-default mb-mini"-->
                           <!--v-model="searchData.account_id"-->
                           <!--:placeholder="$t('ymx-list.selectSite')" v-sf.account_id-->
                           <!--:disabled="isHasSite" filterable>-->
                    <!--<el-option v-for="(item, index) in account"-->
                               <!--:value="item.account_id"-->
                               <!--:label="item.code"-->
                               <!--:key="item.account_id"></el-option>-->
                <!--</el-select>-->
                <super-select
                    class="inline s-width-default mb-mini"
                    :disabled="isHasSite"
                    v-model="searchData.account_id"
                    v-sf.account_id
                    :options="account"
                    :placeholder="'全部'"
                    :storageKey="`${searchData.site}has_published_account_id`"
                ></super-select>
                <label class="ml-sm mb-mini">{{$t('ymx-list.saleType')}}：</label>
                <el-select class="inline s-width-default mb-mini"
                           v-model="searchData.seller_type"
                           v-sf.seller_type>
                    <el-option v-for="(item, index) in salesType"
                               :value="item.value"
                               :label="item.label"
                               :key="index"></el-option>
                </el-select>
                <label class="ml-sm mb-mini">{{$t('ymx-list.listStatus')}}：</label>
                <el-select class="inline s-width-default mb-mini"
                           v-model="searchData.seller_status"
                           v-sf.seller_status>
                    <el-option v-for="(item, index) in ListingState"
                               :value="item.value"
                               :label="item.label"
                               :key="index"></el-option>
                </el-select>
                <label class="ml-sm mb-mini">{{$t('ymx-list.shipType')}}：</label>
                <el-select class="inline s-width-default mb-mini"
                           v-model="searchData.fulfillment_type"
                           v-sf.fulfillment_type>
                    <el-option v-for="(item, index) in deliveryType"
                               :value="item.value"
                               :label="item.label"
                               :key="index"></el-option>
                </el-select>
                <label class="ml-sm mb-mini">{{$t('ymx-list.localStatus')}}：</label>
                <el-select class="inline s-width-default mb-mini"
                           v-model="searchData.status"
                           v-sf.status>
                    <el-option v-for="(item, index) in nativeState"
                               :value="item.value"
                               :label="item.label"
                               :key="index"></el-option>
                </el-select>
                <label class="ml-sm mb-mini">{{$t('ymx-list.upTool')}}：</label>
                <el-select class="inline s-width-default mb-mini"
                           style="width:105px;"
                           v-model="searchData.is_erp"
                           v-sf.is_erp>
                    <el-option v-for="(item, index) in tools"
                               :value="item.value"
                               :label="item.label"
                               :key="index"></el-option>
                </el-select>
            </div>
            <label class="ml-sm">{{$t('ymx-list.whether')}}：</label>
            <el-select class="inline s-width-default mr-sm" v-model="searchData.is_up_lower" v-sf.is_up_lower>
                <el-option v-for="(item, index) in upLowerOptions" :value="item.value" :label="item.label"
                           :key="index"></el-option>
            </el-select>
            <el-select class="inline s-width-default" v-model="searchData.time_type" v-sf.time_type>
                <el-option v-for="(item, index) in timeType" :value="item.value" :label="item.label"
                           :key="index"></el-option>
            </el-select>
            <el-date-picker class="inline date" v-model="searchData.start_time" v-sf.start_time type="date"
                            :picker-options="pickerstart" :placeholder="$t('ymx-list.sDate')"></el-date-picker>
            --
            <el-date-picker class="inline date" v-model="searchData.end_time" v-sf.end_time type="date"
                            :picker-options="pickerend" :placeholder="$t('ymx-list.eDate')"></el-date-picker>
            <label class="ml-sm">{{$t('ymx-list.productLabel')}}：</label>
            <el-select
                class="inline s-width-default"
                clearable
                v-sf.tag_id
                v-model="searchData.tag_id">
                <el-option  v-for="(item,index) in productLabelArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <!--是否虚拟仓发货-->
            <label class="ml-sm">{{$t('ymx-list.virtualWarehouseDelivery')}}：</label>
            <el-select v-model="searchData.is_virtual_send"  class="inline s-width-default">
                <el-option
                    v-for="item in virtualArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <!--侵权平台-->
            <label class="ml-sm">{{$t('ymx-list.tortPlatform')}}：</label>
            <!--<el-select v-model="searchData.tort_platform" filterable clearable class="inline s-width-default" >-->
                <!--<el-option-->
                    <!--v-for="item in tortPlatform"-->
                    <!--:key="item.value"-->
                    <!--:label="item.label"-->
                    <!--:value="item.value"-->
                    <!--&gt;-->
                <!--</el-option>-->
            <!--</el-select>-->
            <super-select
                class="inline s-width-default"
                :clearable="true"
                v-model="searchData.tort_platform"
                v-sf.tort_platform
                :placeholder="$t('ymx-list.pleaseChoose')"
                :options="tortPlatform"
                :storageKey="'has_published_tort_platform'"
            ></super-select>
            <!--价格变动-->
            <label class="ml-sm">{{$t('ymx-list.priceMove')}}：</label>
            <el-select v-model="searchData.adjusted_price"
                       class="inline s-width-mini"
                       :placeholder="$t('ymx-list.ps')"
                       default-first-option filterable clearable>
                <el-option
                    v-for="res in adjustedPrice"
                    :label="res.label"
                    :value="res.value"
                    :key="res.value"
                ></el-option>
            </el-select>
            <el-input v-model="searchData.adjusted_range"
                      v-if="searchData.adjusted_price===1||searchData.adjusted_price===2"
                      class="inline width-xs"></el-input>
        </search-card>

        <el-pagination
            class="page-fixed"
            @size-change="handle_size_change"
            @current-change="handle_current_change"
            :current-page=searchData.page
            :page-sizes="[20, 50,100, 200, 500]"
            :page-size=searchData.pageSize
            layout="total, sizes, prev, pager, next, jumper"
            :total=total>
        </el-pagination>
    </div>
</template>

<style lang="stylus" scoped>
    .width-100 {
        width: 110px;
    }
    .search-content{
        z-index :999;
        .el-card{
            overflow: inherit;
        }

    }
</style>
<script>
    import {
        api_get_channel,
    } from '../../../../api/order-local';
    import {api_has_publish_list, api_account_site,api_get_amazon_account,api_publish_amazon_tags} from '../../../../api/amazon-publish-list';
    import {api_amazon_account_sales} from '../../../../api/amazon-publish';
    export default{
        data(){
            return {
                virtualArr:[
                    {label:this.$t('ymx-list.all'),value:""},
                    {label:this.$t('ymx-list.Yes'),value:1},
                    {label:this.$t('ymx-list.No'),value:0}
                ],
                tortPlatform:[],
                adjustedPrice:[
                    {label:this.$t('ymx-list.all'),value:0},
                    {label:this.$t('ymx-list.priceIn'),value:1},
                    {label:this.$t('ymx-list.priceDe'),value:2},
                    {label:this.$t('ymx-list.n'),value:3},
                ],
                snType: [
                    {
                        label: this.$t('ymx-list.localsku'),
                        value: 1
                    },
                    {
                        label: this.$t('ymx-list.localspu'),
                        value: 2
                    },
                    {
                        label: this.$t('ymx-list.platsku'),
                        value: 3
                    },
                    {
                        label: this.$t('ymx-list.upTitle'),
                        value: 4
                    },
                    {
                        label: 'ASIN',
                        value: 5
                    },
                    {
                        label: 'UPC',
                        value: 6
                    }
                ],
                timeType: [
                    {
                        label: this.$t('ymx-list.cTime'),
                        value: 1,
                    },
                    {
                        label: this.$t('ymx-list.update'),
                        value: 2
                    }
                ],
                pickerstart: {
                    disabledDate: (time) => {
                        if (this.searchData.end_time) {
                            return time.getTime() > this.searchData.end_time;
                        } else {
                            return false;
                        }
                    }
                },
                pickerend: {
                    disabledDate: (time) => {
                        if (this.searchData.start_time) {
                            return time.getTime() < this.searchData.start_time;
                        } else {
                            return false;
                        }
                    }
                },
                clears: {
                    page: 1,
                    pageSize: 50,
                    search_type: 2,
                    time_type: 1,
                    seller_status: 1,
                    tag_id:""
                },
                account: [],
                salesType: [
                    {
                        label: this.$t('ymx-list.all'),
                        value: ''
                    },
                    {
                        label: this.$t('ymx-list.hijack'),
                        value: 2

                    },
                    {
                        label: this.$t('ymx-list.selfSupport'),
                        value: 1
                    }
                ],
                ListingState: [
                    {
                        label: this.$t('ymx-list.all'),
                        value: ''
                    },
                    {
                        label: this.$t('ymx-list.active'),
                        value: 1

                    },
                    {
                        label: this.$t('ymx-list.inAct'),
                        value: 2
                    }
                ],
                deliveryType: [
                    {
                        label: this.$t('ymx-list.all'),
                        value: ''
                    },
                    {
                        label: 'FBA',
                        value: 2

                    },
                    {
                        label: this.$t('ymx-list.selfShip'),
                        value: 1
                    }
                ],
                nativeState: [
                    {
                        label: this.$t('ymx-list.all'),
                        value: ''
                    },
                    {
                        label: this.$t('ymx-list.active'),
                        value: 1

                    },
                    {
                        label: this.$t('ymx-list.Inactive'),
                        value: 2
                    },
                    {
                        label: this.$t('ymx-list.soldOut'),
                        value: 3
                    },
                    {
                        label: this.$t('ymx-list.outStock'),
                        value: 4
                    }
                ],
                test: [
                    {
                        label: 1,
                        value: 1
                    }
                ],
                tools:[
                    {label:this.$t('ymx-list.all'),value:'0'},
                    {label:this.$t('ymx-list.erp'),value:'1'},
                ],
                upLowerOptions: [
                    {label: this.$t('ymx-list.all'),value: 0},
                    {label:this.$t('ymx-list.yes'),value: 1},
                    {label: this.$t('ymx-list.no'),value: 2}
                ],
                productLabelArr:[],
            }
        },
        mounted(){
          this.get_tags();
          this.get_channel();
        },
        methods: {
            init(){
            },
            search(){
                this.$emit('search');
            },
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.search();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.search();
            },
            get_account(){
                this.$http(api_get_amazon_account,{site: this.searchData.site}).then(res => {
                     this.account =  res.map(item=>{
                        return{label:item.code,value:item.account_id};
                    })
                    // this.account = [{code: this.$t('ymx-list.all'), account_id: ''},...res];
                    // this.searchData.account_id = this.account[0].account_id

                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                    // this.account.splice(0, this.account.length);
                })
            },
            change_site(val){
                this.searchData.account_id = ''
                if (!!val) {
                    this.get_account();
                } else {
                    this.account = [];
                    this.searchData.account_id = ''
                }
            },
            get_tags(){
                this.$http(api_publish_amazon_tags).then(res=>{
                    this.productLabelArr=[{label:this.$t('ymx-list.all'),value:''},...res];
                })
            },
            /*获取平台*/
            get_channel(){
                this.$http(api_get_channel,{})
                    .then(res=>{
                        this.tortPlatform=[{label:this.$t('ymx-list.all'),value:0},...res]
                    })
                    .catch(err=>{
                        console.log(err);
                    })
            },
        },
        computed: {
            isHasSite(){
                return !this.searchData.site;
            },
            getplac(){
               return this.searchData.search_type==4 ? this.$t('ymx-list.Fuzzy')+"...":this.$t('ymx-list.searchTip');
            }
        },
        watch: {},
        props: {
            total: {
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
            searchData:{

            }
        },
        components: {
            searchCard: require('@/components/search-card.vue').default,
            orderInput:require("@/components/order-input.vue").default,
        }
    }
</script>

