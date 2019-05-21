<template>
    <search-card @search="search" :clears="clears" :params="form">
        <label-item label="站点：" class="ml-sm">
            <super-select   v-model="form.site"
                            :options="siteList"
                            @change="change_site"
                            storageKey="wishSettingSiteOptions"
                            class="inline s-width-default"
                            v-sf.site>
            </super-select>
        </label-item>
        <label-item label="账号简称：" class="ml-sm">
            <super-select   v-model="form.account_ids"
                            :options="account"
                            storageKey="ebaySettingAccountOptions"
                            :placeholder="placeText"
                            class="s-width-default"
                            :disabled="form.site===''"
                            v-sf.account_ids>
            </super-select>
        </label-item>
        <label-item class="ml-sm" label="销售员：">
            <super-select   v-model="form.seller_id"
                            :options="seller_list"
                            storageKey="ebaySettingSellerOptions"
                            :placeholder="`请选择/输入...`"
                            v-sf.account_ids>
            </super-select>
        </label-item>

        <label-item label="" class="ml-sm">
            <el-select class="inline s-width-default mr-xs"
                       v-model="form.time_type"
                       clearable
                       placeholder="请选择日期"
                       filterable v-sf.site>
                <el-option v-for="(item, index) in dateList"
                           :value="item.value"
                           :label="item.label"
                           :key="item.label"></el-option>
            </el-select>
            <el-date-picker
                    class="inline date"
                    type="date"
                    v-model="form.start_time"
                    :picker-options="pickerstart"
                    placeholder="开始时间">
            </el-date-picker><span>&nbsp;--&nbsp;</span>
            <el-date-picker
                class="inline date mr-sm"
                type="date"
                :picker-options="pickerstart"
                v-model="form.end_time"                
                placeholder="结束时间">
            </el-date-picker>
        </label-item>
    </search-card>
</template>
<style scoped>

</style>
<script>
    import {api_has_publish_list, api_account_site,api_get_amazon_account} from '@/api/amazon-publish-list';
    import {api_seller_list} from '@/api/store-captial-accounting'
    import { get_ebaysite, api_account_list} from '@/api/ebay-order';
    export default {
        data() {
            return {
                account: [],
                showAccount: "",
                placeText: '',
                siteList:[],
                seller_list:[],
                pickerstart: {
                    disabledDate: (time) => {
                        return time.getTime() > Date.now();
                    }
                },
                dateList:[
                    {label:'订单付款日期', value:3},
                    {label:'订单发货日期', value:1},
                    {label:'paypal交易日期', value:2},
                ]
            }
        },
        mounted(){
            this.get_site();
            this.$http(api_seller_list, {channel_id:1}).then(res=>{
                this.seller_list = res.map(item=>{
                    return {label:item.username,value:item.seller_id};
                });
                this.get_account();
            }).catch(err=>{
                console.log(err)
            })
        },
        methods: {
            search() {
                this.$emit('search')
            },
            // 得到站点
            get_site() {
                this.$http(get_ebaysite).then(res => {                   
                    let list = res.map(item => {
                        return {label: item.code, value: item.code};
                    });
                    list.unshift({label:'全部', value: ''});
                    this.siteList = list;
                }).catch(code => {
                    console.log(code);
                });
            },
            //得到账号简称
            get_account() {
                this.$http(api_account_list,{channel_id: 1, site: this.form.site}).then(res => {
                    if (res.account.length > 0) {
                        this.account = [{label: '全部', value: ''}, ...res.account];
                        this.placeText = "请选择账号简称";   
                        // this.showAccount = false;                     
                    } else {
                        // this.showAccount = true;
                       this.placeText = '该平台下暂无站点';
                       this.account = [{label: '全部', value: ''}]; 
                    }
                }).catch(code => {
                   console.log(code);
                })
            },
            change_site(val){
                if (!!val) {
                    this.get_account();
                } else {
                    this.account = [{label: '全部', value: ''}]; 
                    this.form.account_ids = '';
                }
            }
        },
        props:{
            form:{},
            clears:{}
        },
        components:{
            searchCard:require('@/components/search-card').default,
            labelItem:require('@/components/label-item.vue').default,
            paramAccount: require('@/api-components/param-account').default,
        }
    }
</script>
