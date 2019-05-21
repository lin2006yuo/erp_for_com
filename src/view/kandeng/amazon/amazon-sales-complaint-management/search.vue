<template>
    <div class="c-search-list-self" >
        <search-card :params="searchData" @search="search" :clears="clears">
            <label-item label="" class="mr-sm mb-mini">
                <el-select class="inline mr-xs" v-model="searchData.search_type" style="width:122px;">
                    <el-option v-for="(item, index) in searchType" :value="item.value" :label="item.label"
                               :key="index"></el-option>
                </el-select>
                <order-input v-model="searchData.search_content"
                             class="inline width-super "
                             v-sf.search_content
                             :placeholder="$t('common.snText')"
                             @keydown="search"></order-input>
            </label-item>
            <label-item label="" class="mr-sm mb-mini">
                <el-select class="inline" style="width:130px;"
                           v-model="searchData.account_person_type">
                    <el-option v-for="(item, index) in snType" :value="item.value" :label="item.label"
                               :key="index"></el-option>
                </el-select>
                <el-input v-if="searchData.account_person_type===1" class="inline s-width-middle ml-sm" v-model="searchData.account_person_content" :placeholder="$t('common.please_enter_abbreviation')" @keydown.enter.native="search"  ></el-input>
                <el-input v-else-if="searchData.account_person_type===2" class="inline s-width-middle ml-sm" v-model="searchData.account_person_content" :placeholder="$t('common.please_change_salesperson')" @keydown.enter.native="search" ></el-input>
            </label-item>
            <label-item :label="$t('ymx-follow.brand')" class="mr-sm mb-mini">
                <el-input class="inline s-width-middle ml-sm" v-model="searchData.brand" :placeholder="$t('common.please_enter_brand')" @keydown.enter.native="search" ></el-input>
            </label-item>
            <label-item :label="$t('ymx-follow.seller_Id')" class="mr-sm mb-mini">
                <el-input class="inline s-width-middle ml-sm" v-model="searchData.seller_id" :placeholder="$t('common.please_enter_seller_Id')" @keydown.enter.native="search"></el-input>
            </label-item>
            <label-item :label="$t('ymx-follow.processing_status1')" class="mr-sm mb-mini">
                <el-select class="inline" v-model="searchData.status" style="width:122px;"v-sf.seller_status>
                    <el-option v-for="(item, index) in statusOptions" :value="item.value" :label="item.label"
                               :key="index"></el-option>
                </el-select>
            </label-item>
            <label-item :label="$t('ymx-follow.sold_out')" class="mr-sm mb-mini">
                <el-select class="inline" v-model="searchData.is_heel_sale" style="width:122px;"v-sf.seller_status>
                    <el-option v-for="(item, index) in soldOutOptions" :value="item.value" :label="item.label"
                               :key="index"></el-option>
                </el-select>
            </label-item>
            <label-item class="mr-sm mb-mini">
                <el-select class="inline s-width-default" v-model="searchData.time_type" v-sf.seller_status style="margin-right:10px;">
                    <el-option v-for="(item, index) in saleOptions" :value="item.value" :label="item.label" :key="index"></el-option>
                </el-select>
                <el-date-picker
                        class="date"
                        clearable
                        v-model="searchData.star_time"
                        type="date"
                        :placeholder="$t('ymx-follow.start_date')"
                        @change="data_picker_b"
                        :picker-options="inputTimeStart">
                </el-date-picker>
                <span>&nbsp;--&nbsp;</span>
                <el-date-picker
                        class="date"
                        clearable
                        v-model="searchData.end_time"
                        type="date"
                        :placeholder="$t('ymx-follow.end_date')"
                        @change="data_picker_e"
                        :picker-options="inputTimeEnd">
                </el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .c-search-list-self{
        z-index :999;
        .el-card{
            overflow: inherit;
        }
    }
</style>
<script>
    export default {
        data(){
            return {
                searchType: [
                    {
                        label: 'ASIN',
                        value: 1
                    },
                    {
                        label: this.$t('ymx-follow.platform_sku'),
                        value: 2
                    }
                ],
                snType: [
                    {
                        label: this.$t('ymx-follow.acount_name'),
                        value: 1
                    },
                    {
                        label: this.$t('ymx-detail.seller'),
                        value: 2
                    }
                ],
                statusOptions: [
                    {
                        label: this.$t('ymx-list.all'),
                        value: 0
                    },
                    {
                        label: this.$t('ymx-follow.processed'),
                        value: 1
                    },
                    {
                        label: this.$t('ymx-follow.unprocessed'),
                        value: 2
                    }
                ],
                soldOutOptions:[
                    {
                        label: this.$t('ymx-list.all'),
                        value: 0
                    },
                    {
                        label: this.$t('ymx-follow.no_sale'),
                        value: 1
                    },
                    {
                        label: this.$t('ymx-follow.has_removed'),
                        value: 2
                    }
                ],
                saleOptions: [
                    {
                        label: this.$t('ymx-follow.to_sell_time'),
                        value: 1
                    },
                    {
                        label: this.$t('ymx-follow.processing_time'),
                        value: 2
                    },
                ],
                inputTimeStart: {//开始时间
                    disabledDate: (time)=> {
                        if(this.searchData.end_time){
                            return time.getTime() > new Date(this.searchData.end_time).getTime();
                        }else{
                            return time.getTime()>Date.now();
                        }
                    }
                },
                inputTimeEnd: {//结束时间
                    disabledDate: (time)=> {
                        if (this.searchData.star_time) {
                            return time.getTime() < new Date(this.searchData.star_time).getTime()-24*60*60*1000|| time.getTime() > Date.now();
                        } else {
                            return time.getTime() > Date.now();
                        }
                    }
                },
            }
        },
        methods:{
            search(){
                this.$emit('search');
            },
            data_picker_b(val){
                this.searchData.star_time = val
            },
            data_picker_e(val){
                this.searchData.end_time = val
            },
            test(){
                console.log(1);
            }
        },
        props:{
            searchData:{},
            clears: {},
        },
        components: {
            labelItem:require('@/components/label-item.vue').default,
            searchCard:require('@/components/search-card.vue').default,
            orderInput:require("@/components/order-input.vue").default,
        }
    }
</script>
