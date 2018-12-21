<template>
    <div>
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears">
            <div class="mb-mini">
                <el-select class="inline s-width-default"
                           v-model="searchData.snType">
                    <el-option v-for="(item, index) in snType" :value="item.value" :label="item.label"
                               :key="index"></el-option>
                </el-select>
                <el-input class="inline s-width-middle" v-model="searchData.snText"></el-input>
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
                <label class="ml-sm">{{$t('ymx-list.pa')}}：</label>
                <el-select class="inline s-width-default"
                           v-model="searchData.account"
                           :disabled="isHasSite"
                           filterable placeholder="请先选择站点">
                    <el-option v-for="(item, index) in account"
                               :label="item.code"
                               :value="item.account_id"
                               :key="item.account_id"></el-option>
                </el-select>
                <label class="ml-sm">{{$t('ymx-list.seller')}}：</label>
                <param-account
                        class="width-sm"
                        ref="paramSale"
                        v-model="searchData.saler_id"
                        v-sf.saler_id
                        :param="{type:'sales',data:{content:''}}"
                        :fixResult="sale_fix_result"
                        type="memberShipSales"
                        :placeholder="$t('ymx-list.pse')"
                        url="get|user/sales/staffs">
                </param-account>
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
    .width-100{
        width:110px;
    }
</style>
<script>
    import {api_get_amazon_account} from '../../../../api/amazon-publish-list';
    export default{
        data(){
            return {
                clears: {
                    page:1,
                    pageSize:50,
                    snType: 'sku',
                    adjusted_price:0,
                },
                searchData: {
                    page:1,
                    pageSize:50,
                    snType: 'sku',
                    snText: '',
                    site: '',
                    account: '',
                    nativeState: '',
                    start: '',
                    end: '',
                    adjusted_price:0,
                    adjusted_range:'',
                    saler_id:'',
                },
                adjustedPrice:[
                    {label:this.$t('ymx-list.all'),value:0},
                    {label:this.$t('ymx-list.priceIn'),value:1},
                    {label:this.$t('ymx-list.priceDe'),value:2},
                    {label:this.$t('ymx-list.n'),value:3},
                ],
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
            }
        },
        methods: {
            sale_fix_result(val){
                return val.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
            },
            search(){
                this.$emit('search', this.searchData);
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
                this.account = [];
                this.$http(api_get_amazon_account,{site: this.searchData.site}).then(res => {
                    let obj = {code:this.$t('ymx-list.all'),account_id:''};
                    res.unshift(obj);
                    this.account = res;
                    this.searchData.account = this.account.length>0?this.account[0].account_id:'';
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                    this.account.splice(0, this.account.length);
                })
            },
            change_site(val){
                if (!!val) {
                    this.get_account();
                } else {
                    this.account.splice(0, this.account.length);
                    this.searchData.account = '';
                }
            },
        },
        computed: {
            isHasSite(){
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
            }
        },
        components: {
            searchCard: require('../../../../components/search-card.vue').default,
            paramAccount:require('@/api-components/param-account.vue').default,
        }
    }
</script>

