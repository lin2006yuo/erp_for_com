<template>
    <search-card @search="search" :clears="clears" :params="form">
        <label-item label="站点：" class="ml-sm">
            <el-select class="inline s-width-default"
                       @change="change_site"
                       v-model="form.site"
                       filterable v-sf.site>
                <el-option v-for="(item, index) in siteList"
                           :value="item.label"
                           :label="item.label"
                           :key="index"></el-option>
            </el-select>
        </label-item>
        <label-item label="账号简称：" class="ml-sm">
            <el-select class="inline s-width-default" v-model="form.account_id" placeholder="请先选择站点" v-sf.account_id
                       :disabled="!account.length"
                       filterable>
                <el-option v-for="(item, index) in account"
                           :value="item.account_id"
                           :label="item.account_name"
                           :key="item.account_id"></el-option>
            </el-select>
        </label-item>
        <label-item class="ml-sm" label="销售员：">
            <el-select v-model="form.seller_id" placeholder="请选择/输入..." filterable >
                <el-option v-for="item in seller_list" :value="item.seller_id" :key="item.seller_id" :label="item.username"></el-option>
            </el-select>
        </label-item>
        <label-item label="选择日期范围：" class="ml-sm">
            <el-date-picker
                    class="inline date"
                    v-model="form.start_time"
                    :picker-options="pickerstart"
                    placeholder="开始时间">
            </el-date-picker><span>&nbsp;--&nbsp;</span><el-date-picker
                class="inline date mr-sm"
                v-model="form.end_time"
                :picker-options="pickerend"
                placeholder="结束时间">
        </el-date-picker>
        </label-item>
    </search-card>
</template>
<style scoped>

</style>
<script>
    import {api_has_publish_list, api_account_site,api_get_amazon_account} from '@/api/amazon-publish-list';
    import {api_get_amazon_site,api_seller_list} from '@/api/store-captial-accounting'
    export default {
        data() {
            return {
                account: [],
                siteList:[],
                seller_list:[],
                pickerstart: {
                    disabledDate: (time) => {
                        if (this.form.end_time) {
                            return time.getTime() > this.form.end_time;
                        } else {
                            return false;
                        }
                    }
                },

                pickerend: {
                    disabledDate: (time) => {
                        if (this.form.start_time&&time.getTime() < this.form.start_time) {
                            return time.getTime() < this.form.start_time;
                        } else {
                            return time.getTime() > Date.now();
                        }
                    }
                },
            }
        },
        mounted(){
            this.get_site();
            this.$http(api_seller_list,{channel_id:2}).then(res=>{
                this.seller_list = res;
            }).catch(err=>{
                console.log(err)
            })
        },
        methods: {
            search() {
                this.$emit('search')
            },
            get_site(){
                this.$http(api_get_amazon_site).then(res => {
                    this.siteList = [{label: '全部', value: ''},...res.site];
                }).catch(code => {
                    console.log(code);
                })
            },

            get_account(){
                this.$http(api_get_amazon_account,{site: this.form.site}).then(res => {
                    this.account = [{account_name: '全部', account_id: ''},...res];
                    this.form.account_id = this.account[0].account_id
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
                    this.form.account_id = ''
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
