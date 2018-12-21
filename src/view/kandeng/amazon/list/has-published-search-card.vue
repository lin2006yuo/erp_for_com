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
                <order-input v-model="searchData.search_content"
                             class="inline width-super mb-mini"
                             v-sf.search_content
                             :placeholder="$t('ymx-list.searchTip')"
                             @keydown="search"></order-input>
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
                <label class="ml-sm mb-mini">{{$t('ymx-list.pa')}}：</label>
                <el-select class="inline s-width-default mb-mini"
                           v-model="searchData.account_id"
                           :placeholder="$t('ymx-list.selectSite')" v-sf.account_id
                           :disabled="isHasSite" filterable>
                    <el-option v-for="(item, index) in account"
                               :value="item.account_id"
                               :label="item.account_name"
                               :key="item.account_id"></el-option>
                </el-select>
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

    import {api_has_publish_list, api_account_site,api_get_amazon_account} from '../../../../api/amazon-publish-list';
    import {api_amazon_account_sales} from '../../../../api/amazon-publish';
    export default{
        data(){
            return {
                searchData: {
                    page: 1,
                    pageSize: 50,
                    search_type: 1,
                    search_content: '',
                    site: '',
                    account_id: '',
                    seller_type: '',
                    seller_status: 1,
                    fulfillment_type: '',
                    status: '',
                    time_type: 1,
                    start_time: '',
                    end_time: '',
                    order_by:'',
                    sort:'',
                    is_erp:'0',
                    is_up_lower: 0
                },
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
                    search_type: 1,
                    time_type: 1,
                    seller_status: 1,
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
                ]
            }
        },
        methods: {
            init(){
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
                this.$http(api_get_amazon_account,{site: this.searchData.site}).then(res => {
                    this.account = [{account_name: this.$t('ymx-list.all'), account_id: ''},...res];
                    this.searchData.account_id = this.account[0].account_id
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
                    this.account = [{account_name: '', account_id: ''}];
                    this.searchData.account_id = ''
                }
            }
        },
        computed: {
            isHasSite(){
                return !this.searchData.site;
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
            }
        },
        components: {
            searchCard: require('@/components/search-card.vue').default,
            orderInput:require("@/components/order-input.vue").default,
        }
    }
</script>

