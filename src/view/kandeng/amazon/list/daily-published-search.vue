<template>
    <div class="daily-published-search-page">
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears" >
            <label class="ml-sm">{{$t('ymx-list.site')}}：</label>
            <el-select class="inline s-width-small mb-mini"
                       @change="change_site"
                       v-model="searchData.site"
                       filterable v-sf.site>
                <el-option v-for="(item, index) in siteList"
                           :value="item.value"
                           :label="item.label"
                           :key="index"></el-option>
            </el-select>
            <!--平台账号-->
            <label class="ml-sm">{{$t('ymx-list.pa')}}：</label>
            <super-select
                class="inline width-sm"
                v-sf.account_id
                :disabled="accounts.length<1"
                v-model="searchData.account_id"
                :placeholder="$t('ymx-list.pse')"
                :clearable="true"
                :options="accounts"
                :storageKey="'daily_published_account'"
            ></super-select>
            <label class="ml-sm">{{$t('ymx-list.localSpu')}}：</label>
            <order-input class="inline s-width-middle width-super"  v-model="searchData.spus" v-sf.snText @keydown.enter.native="search" ></order-input>
            <!--任务状态-->
            <label class="ml-sm">{{$t('ymx-list.taskStatus')}}：</label>
            <el-select class="inline s-width-default" clearable
                       v-sf.status
                            v-model="searchData.status"
                                >
                <el-option  v-for="(item,index) in taskStatusArr"  :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <!--产品标签-->
            <label class="ml-sm">{{$t('ymx-list.productLabel')}}：</label>
            <el-select
                class="inline s-width-default"
                clearable
                v-sf.tag_id
                v-model="searchData.tag_id">
                <el-option  v-for="(item,index) in productLabelArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <!--开始结束时间-->
            <label class="ml-sm">{{$t('ymx-list.taskTime')}}：</label>
            <el-date-picker class="inline date" v-model="searchData.start_time"   v-sf.start_time type="date"
                            :picker-options="pickerstart" :placeholder="$t('ymx-list.sDate')"></el-date-picker>
            --
            <el-date-picker class="inline date" v-model="searchData.end_time"  v-sf.end_time type="date"
                            :picker-options="pickerend" :placeholder="$t('ymx-list.eDate')"></el-date-picker>
            <label-item label="产品分类：" class="mr-sm" style="margin-left: 10px;">
                <el-cascader
                    clearable
                    filterable
                    change-on-select
                    style="margin-right: 0px"
                    v-sf.category_id
                    :disabled="categoryTree<=0"
                    class="inline mr-sm s-width-default"
                    v-model="searchData.category"
                    expand-trigger="hover"
                    :options="categoryTree"
                ></el-cascader>
            </label-item>
            <!--销售员-->
            <label-item :label="$t('ymx-list.seller')+'：'" class="mr-sm" v-if="show" style="margin-left: 10px;">
            <el-cascader
                v-if="show"
                class="inline"
                style="width:150px"
                change-on-select
                filterable
                expand-trigger="hover"
                clearable
                :placeholder="$t('ymx-list.ps')"
                v-model="searchData.seller_id"
                :options="sellerArray"></el-cascader>
            </label-item>
        </search-card>
    </div>
</template>

<style lang="stylus">
    .daily-published-search-page{
        .el-card {
            overflow:visible !important;
        }
    }
</style>

<script>
    import {api_get_amazon_account,api_publish_amazon_tags,url_publish_amazon_seller} from '../../../../api/amazon-publish-list';
    import {api_mymall_category_tree} from '@/api/shopee-publish';
    export default {
        data(){
            return {
                test:false,
                accounts:[],
                allAccount:[],
                taskStatusArr:[{label:this.$t('ymx-list.all'),value:9},{label:this.$t('ymx-list.haveNotStarted'),value:0},{label:this.$t('ymx-list.underway'),value:1},{label:this.$t('ymx-list.hasBeenPostponed'),value:3},{label:this.$t('ymx-list.offTheStocks'),value:2},{label:this.$t('ymx-list.canceled'),value:4}],
                productLabelArr:[],
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
                categoryTree:[],
            }
        },
        mounted(){
            this.get_account();
            this.get_tags();
            this.$http(api_mymall_category_tree).then(res => {
                this.categoryTree = this.data_format(res.data);
            });
            console.log(this.$hasPermission(url_publish_amazon_seller),'this.$hasPermission(url_publish_amazon_seller)');
        },
        methods:{
            data_format(val) {
                if (val.length === 0) {
                    return null
                }
                return val.map(item => {
                    return {
                        label: item.title,
                        value: item.id,
                        children: this.data_format(item.childs)
                    }
                });
            },
            change_site(val){
                this.searchData.account_id = '';
                if (!!val) {
                    this.get_account();
                } else {
                    this.accounts = [];
                    this.searchData.account_id = ''
                }
            },
            get_account(){
                this.$http(api_get_amazon_account,{site: this.searchData.site}).then(res => {
                    this.accounts =  res.map(item=>{
                        return{label:item.code,value:item.account_id};
                    });
                    this.allAccount = res;
                }).catch(code => {
                    this.$message({
                        type:"error",
                        message:code.message || code
                    });
                })
            },
            get_tags(){
              this.$http(api_publish_amazon_tags).then(res=>{
                  this.productLabelArr=[{label:this.$t('ymx-list.all'),value:''},{label:this.$t('ymx-list.externalRandomDistribution'),value:0},...res];
                  console.log(res);
              })
            },
            search(){
                this.searchData.spus=this.searchData.spus.replace(new RegExp('\n','gm')," ");
                this.searchData.spus=this.searchData.spus.replace(new RegExp(' ','gm'),",");
                this.searchData.spus=this.searchData.spus.replace(/,{1,}/g,",");
                this.$emit('search');
            },
        },
        computed:{
            show(){
                return this.$hasPermission(url_publish_amazon_seller);
            }
        },
        props:{
            siteList:{
                required: true,
                type: Array,
            },
            searchData: {

            },
            clears:{

            },
            sellerArray:{}
        },
        components:{
            paramAccount:require('@/api-components/param-account.vue').default,
            orderInput:require("@/components/order-input.vue").default,
            labelItem:require("@/components/label-item.vue").default,
        }
    }
</script>

