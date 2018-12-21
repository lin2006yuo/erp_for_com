<template>
    <div class="search-content">
        <search-card :params="searchData" :clears="clears" @search="search">
            <el-select class="inline s-width-default" v-model="searchData.search_type" v-sf.search_type :placeholder="$t('ymx-heel-sale-list.clues4')">
                <el-option v-for="(item, index) in snType" :value="item.value" :label="item.label"
                           :key="index"></el-option>
            </el-select>
            <order-input v-model="searchData.search_content"
                         class="inline width-super mr-sm"
                         v-sf.search_content
                         :placeholder="$t('ymx-heel-sale-list.clues2')"
                         @keydown="search"></order-input>
            <label-item :label="$t('ymx-heel-sale-list.site')+'：'">
                <el-select v-model="searchData.site"
                           class="inline s-width-middle mr-sm"
                           v-sf.site
                           @change="change_site"
                           default-first-option
                           filterable clearable>
                    <el-option
                            v-for="res in siteList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item :label="$t('ymx-heel-sale-list.accountName')+'：'">
                <el-select class="inline s-width-default mr-sm" v-model="searchData.account_id" :placeholder="$t('ymx-heel-sale-list.clues3')" v-sf.account_id
                           :disabled="isHasSite" filterable>
                    <el-option v-for="(item, index) in account"
                               :value="item.account_id"
                               :label="item.account_name"
                               :key="item.account_id"></el-option>
                </el-select>
            </label-item>
            <label-item :label="$t('ymx-heel-sale-list.uploadStatus')+'：'">
                <el-select v-model="searchData.status"
                           class="inline s-width-default mr-sm"
                           v-sf.status
                           :placeholder="$t('ymx-heel-sale-list.clues4')"
                           default-first-option
                           filterable clearable>
                    <el-option
                            v-for="res in statusList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item :label="$t('ymx-heel-sale-list.creationTime')+'：'">
                <el-date-picker
                        v-model="searchData.star_time"
                        type="date"
                        :placeholder="$t('ymx-heel-sale-list.startDate')"
                        class="inline date"
                        v-sf.star_time
                        @change="data_picker_b"
                        :picker-options="inputTimeStart">
                </el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                        v-model="searchData.end_time"
                        type="date"
                        :placeholder="$t('ymx-heel-sale-list.endDate')"
                        class="inline date mr-sm"
                        v-sf.end_time
                        @change="data_picker_e"
                        :picker-options="inputTimeEnd">
                </el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .search-content{
        z-index :999;
        .el-card{
            overflow: inherit;
        }

    }
</style>
<script>
    import {api_get_amazon_account} from '../../../../api/amazon-publish-list';
    export default {
        data() {
            return {
                //类型
                snType:[
                    {label:this.$t('ymx-heel-sale-list.asin'),value:1},
                    {label:this.$t('ymx-heel-sale-list.platformSku'),value:4}
                ],
                //状态 :0:;1:;2:
                statusList:[
                    {label:this.$t('ymx-heel-sale-list.noGrab'),value:0},
                    {label:this.$t('ymx-heel-sale-list.grabbed'),value:1},
                    {label:this.$t('ymx-heel-sale-list.defeats'),value:2},
                    {label:this.$t('ymx-heel-sale-list.uploading'),value:3},
                    {label:this.$t('ymx-heel-sale-list.cancelled'),value:4}
                ],
                account:[],
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
            get_account(){
                this.$http(api_get_amazon_account,{site: this.searchData.site}).then(res => {
                    this.account = [{account_name: this.$t('ymx-heel-sale-list.all'), account_id: ''},...res];
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
            },
        },
        props:{
            searchData:{
                required:true,
                type:Object
            },
            clears:{
                required:true,
                type:Object
            },
            siteList:{
                required: true,
                type: Array,
            }
        },
        components: {
            searchCard:require('@/components/search-card.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            paramAccount:require('@/api-components/param-account.vue').default,
            orderInput:require("@/components/order-input.vue").default,
        }
    }
</script>