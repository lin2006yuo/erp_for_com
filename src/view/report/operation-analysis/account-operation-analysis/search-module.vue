<template>
    <div class="p-search-module">
        <search-card :params="searchData" :clears="clears" @search="$listeners['search']">
            <el-row class="mb-xs">
                <label-item label="平台：">
                    <el-select  v-model="searchData.channel_id" class="inline width-sm" clearable filterable>
                        <el-option
                        :key="item.value"
                        v-for="item in channelList"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <!--<select-account-->
                            <!--class="width-sm"-->
                            <!--v-model="searchData.channel_id"-->
                            <!--type="platform"-->
                            <!--v-sf.channel_id-->
                            <!--:all="true"-->
                    <!--&gt;</select-account>-->
                </label-item>
                <label-item label="站点：" class="ml-sm">
                    <select-account
                            class="width-sm"
                            v-model="searchData.site"
                            type="site"
                            v-sf.site
                            ref="selectSite"
                            :param="{channel_id: searchData.channel_id}"
                    ></select-account>
                </label-item>
                <label-item label="账号简称：" class="ml-sm">
                    <select-account
                            class="width-sm"
                            ref="selectAccount"
                            v-sf.account_id
                            v-model="searchData.account_id"
                            type="account"
                            :param="{channel_id: searchData.channel_id, site_code: searchData.site}"
                    ></select-account>
                </label-item>
                <label-item label="" class="ml-sm">
                    <el-select class="inline width-sm" v-model="searchData.seller_field" v-sf.seller_field>
                        <el-option
                                v-for="item in personType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <select-account
                            class="width-sm ml-xs"
                            v-model="searchData.seller_id"
                            type="seller"
                    ></select-account>
                </label-item>
            </el-row>
            <label-item label="">
                <el-select class="inline width-md" v-model="searchData.search_type" v-sf.search_type>
                    <el-option
                            v-for="item in quantityType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <integer-zero-input class="width-xs inline ml-xs enter-result"
                                    :min="0"
                                    @blur="blur_change('min', searchData.min_value)"
                                    v-sf.min_value
                                    v-model="searchData.min_value">
                </integer-zero-input>
                <span>~</span>
                <integer-zero-input class="width-xs inline enter-result"
                                    :min="0"
                                    @blur="blur_change('max', searchData.max_value)"
                                    v-sf.max_value
                                    v-model="searchData.max_value">
                </integer-zero-input>
            </label-item>
            <label-item label="" class="ml-sm">
                <el-select class="inline width-sm" v-model="searchData.time_field" v-sf.time_field>
                    <el-option
                            v-for="item in timeType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-date-picker
                        v-model="searchData.date_from"
                        type="date"
                        placeholder="选择日期"
                        class="inline date ml-xs"
                        v-sf.date_from
                        :picker-options="pickerStart"></el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                        v-model="searchData.date_to"
                        type="date"
                        placeholder="选择日期"
                        class="inline date"
                        v-sf.date_to
                        :picker-options="pickerEnd"></el-date-picker>
            </label-item>
            <el-radio-group v-model="dateRange" size="small" class="ml-sm mr-sm">
                <el-radio-button v-for="(item, index) in dayList"
                                 :key="index"
                                 :label="item.label"
                                 @click.native="change_range(item)">
                </el-radio-button>
            </el-radio-group>
        </search-card>
    </div>
</template>

<style lang="stylus">
    .p-search-module{
        .el-card{
            overflow: inherit;
        }
        .el-radio-button__inner:hover{
            background-color:rgba(230, 230, 230, 1) !important;
        }
        .el-radio-button__orig-radio:checked + .el-radio-button__inner{
            border-color: #C0CCDA !important;
        }
        .el-radio-button__inner{
            padding: 6px 12px;
        }
    }
</style>

<script>
    export default {
        data () {
            return {
                personType: [
                    {label: '销售员', value: 'seller'},
                    {label: '销售组长', value: 'team_leader'},
                    {label: '销售主管', value: 'supervisor'}
                ],
                quantityType: [
                    {label: '刊登数量', value: 'publish_quantity'},
                    {label: '昨日在线listing数量', value: 'online_listing_quantity'},
                    {label: '销售额（USD）', value: 'sale_amount'},
                    {label: '订单数', value: 'order_quantity'},
                    {label: 'ODR', value: 'odr'},
                    {label: '在线asin数量', value: 'online_asin_quantity'},
                    {label: '平均动销率', value: 'average_retail_rate'}
                ],
                timeType: [
                    {label: '注册时间', value: 'account_create_time'},
                    {label: '交接时间', value: 'fulfill_time'},
                    {label: '统计时间', value: 'dateline'}
                ],
                dayList:[
                    {label:'昨天', value: 1},
                    {label:'7天内', value: 2},
                    {label:'15天内', value: 3},
                    {label:'30天内', value: 4}
                ],
                pickerStart: {
                    disabledDate:(time)=>{
                        if(this.searchData.date_to){
                            return time.getTime() > this.searchData.date_to || time.getTime() >= Date.now() - 24*60*60*1000;
                        }else {
                            return time.getTime() > Date.now() - 24*60*60*1000;
                        }
                    }
                },
                pickerEnd: {
                    disabledDate:(time)=>{
                        if(this.searchData.date_from){
                            return time.getTime() < this.searchData.date_from || time.getTime() > Date.now() - 24*60*60*1000;
                        }else {
                            return time.getTime() > Date.now() - 24*60*60*1000;
                        }
                    }
                },
                dateRange: '',
            }
        },
        methods: {
            blur_change(name, val){
                if(name === 'min'){
                    if(this.searchData.max_value && val >= this.searchData.max_value){
                       this.searchData.min_value = ''
                    }
                }else{
                    if(this.searchData.min_value && val <= this.searchData.min_value){
                        this.searchData.max_value = ''
                    }
                }
            },
            change_range(item){
                switch (item.value){
                    case 1:
                        this.searchData.date_from = (Date.now()-(24*60*60*1000));
                        this.searchData.date_to = (Date.now()-(24*60*60*1000));
                        break;
                    case 2:
                        this.searchData.date_from = (Date.now()-(7*24*60*60*1000));
                        this.searchData.date_to = Date.now() - 24*60*60*1000;
                        break;
                    case 3:
                        this.searchData.date_from = Date.now()-(15*24*60*60*1000);
                        this.searchData.date_to = Date.now() - 24*60*60*1000;
                        break;
                    case 4:
                        this.searchData.date_from = Date.now()-(30*24*60*60*1000);
                        this.searchData.date_to = Date.now() - 24*60*60*1000;
                        break;
                }
            }
        },
        watch: {
            'searchData.channel_id'() {
                this.searchData.site = '';
                this.searchData.account_id = "";
                this.siteOptions = [{label: "", value: ""}];
                this.accoutOptions = [{label: "", value: ""}];
                this.$nextTick(() => {
                    this.$refs.selectSite.get_list()
                    this.$refs.selectAccount.get_list()
                })
            },
            'searchData.site'() {
                this.searchData.account_id = "";
                this.$nextTick(() => {
                    this.$refs.selectAccount.get_list()
                })
            }
        },
        props: {
            searchData: {
                require: true,
                type: Object
            },
            clears: {
                require: true,
                type: Object
            },
            channelList: {
                require: true,
                type: Array
            }
        },
        components: {
            searchCard: require("@/components/search-card.vue").default,
            labelButtons: require('@/components/label-buttons.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            orderInput: require("@/components/order-input.vue").default,
            selectAccount: require('@/api-components/select-account').default,
            integerZeroInput:require('@/components/integer-zero-input').default
        }
    }
</script>