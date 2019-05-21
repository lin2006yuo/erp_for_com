<template>
    <search-card @search="search" :clears="clears" :params="form">
        <label-item label="账号简称：" class="ml-sm">
            <super-select
                storage-key="aliexpressFinance"
                :options="account"
                v-model="form.account_id"
                class="inline s-width-default"
              >
            </super-select>
        </label-item>

        <label-item class="ml-sm" label="销售员：">
            <super-select
                storage-key="aliexpressSellerList"
                :options="seller_list"
                v-model="form.seller_id"
                class="inline s-width-default"
              >
            </super-select>
        </label-item>


        <label-item label="" class="ml-sm">
            <el-select class="inline s-width-default mr-xs"
                       v-model="form.date_type"
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
                v-model="form.date_s"
                :picker-options="pickerstart"
                placeholder="开始时间">
            </el-date-picker>
            <span>&nbsp;--&nbsp;</span>
            <el-date-picker
                class="inline date mr-sm"
                type="date"
                :picker-options="pickerstart"
                v-model="form.date_e"
                placeholder="结束时间">
            </el-date-picker>
        </label-item>
    </search-card>
</template>
<style scoped>

</style>
<script>
    import {api_has_publish_list, api_account_site, api_get_amazon_account} from '@/api/amazon-publish-list';
    import {api_seller_list} from '../../../../api/store-captial-accounting'
    import {api_account_list} from '../../../../api/ebay-order';

    export default {
        data() {
            return {
                account: [],
                showAccount: "",
                placeText: '',
                siteList: [],
                seller_list: [],
                pickerstart: {
                    disabledDate: (time) => {
                        return time.getTime() > Date.now();
                    }
                },
                dateList: [
                    {label: '发货日期', value: 2},
                ]
            }
        },
        mounted() {
            this.getSeller();
            this.get_account();
        },
        methods: {
            search() {
                this.$emit('search')
            },
            /** 获取销售员list */
            getSeller() {
                this.$http(api_seller_list, {channel_id: 4}).then(res => {
                    this.seller_list = res.map(item => {
                        return {label:item.username, value: item.seller_id};
                    });
                }).catch(err => {
                    this.$message({
                        message: err.message || err
                    });
                });
            },
            /** 得到账号简称 */
            get_account() {
                this.$http(api_account_list, {channel_id: 4}).then(res => {
                    this.account = [{label: '全部', value: ''}, ...res.account];
                }).catch(code => {
                    console.log(code);
                })
            },
            change_site(val) {
                if (!!val) {
                    this.get_account();
                } else {
                    this.account = [{label: '全部', value: ''}];
                    this.form.account_ids = '';
                }
            }
        },
        props: {
            form: {},
            clears: {}
        },
        components: {
            searchCard: require('@/components/search-card').default,
            labelItem: require('@/components/label-item.vue').default,
            paramAccount: require('@/api-components/param-account').default,
        }
    }
</script>
