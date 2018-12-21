<template>
    <el-row class="wish-searchList">
        <search-card @search="search_list" :params="searchData" :clears="clears">
            <el-row>
                <label-buttons label="订单状态："
                               v-sf.order_status
                               :buttons="buttons"
                               @select="changeSelect"></label-buttons>
            </el-row>
            <el-select v-model="searchData.sn_type"
                       v-sf.sn_type
                       class="inline" style="width:105px">
                <el-option
                    :key="item.value"
                    v-for="item in selectList"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <order-input v-model="searchData.sn_text"
                         class="inline width-super mr-sm"
                         v-sf.sn_text
                         @keydown="search_list"
                         placeholder="可批量搜索，Shift+回车换行..."></order-input>
            <label>账号简称：</label>
            <el-select v-model="searchData.account_id"
                       v-sf.account_id
                       class="inline mr-sm s-width-default"
                       filterable>
                <el-option
                    :key="item.value"
                    v-for="item in accountsLists"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <label>站点：</label>
            <el-select v-model="searchData.site"
                       v-sf.site
                       class="inline mr-sm s-width-default"
                       filterable>
                <el-option
                    :key="item.value+item.code"
                    v-for="item in siteLists"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <label>下单时间：</label>
            <el-date-picker
                @keyup.enter.native="search_list"
                type="date"
                placeholder="开始时间"
                v-model="searchData.time_st"
                v-sf.time_st
                class="inline"
                :picker-options="pickerOptions"
                style="width:140px"></el-date-picker>&nbsp;--
            <el-date-picker type="date"
                            @keyup.enter.native="search_list"
                            placeholder="结束时间"
                            v-model="searchData.time_nd"
                            v-sf.time_nd
                            :picker-options="pickerOptions1"
                            class="inline mr-sm"
                            style="width:140px"></el-date-picker>
        </search-card>
    </el-row>
</template>
<style lang="stylus">
    .wish-searchList {
        .el-card {
            overflow: inherit;
        }
    }
</style>
<script>
    import labelButtons from '@/components/label-buttons';
    import {api_order_shopee_getAccount,api_shopee_account_site} from '../../../../api/order_shopee'

    export default {
        data() {
            return {
                isBatch: false,
                selectList: [
                    {id: 1, label: "订单号", value: "order_sn"},
                    {id: 6, label: "追踪号", value: "tracking_no"},
                    {id: 7, label: "ItemId", value: "item_id"},
                    {id: 8, label: "平台sku", value: "item_sku"}
                ],
                siteLists:[],
                accountsLists: [],
                pickerOptions: {
                    disabledDate: (time) => {
                        return time.getTime() > new Date()
                    }
                },
                pickerOptions1: {
                    disabledDate: (time) => {
                        return time.getTime() > new Date().getTime() || time.getTime() < this.searchData.time_st;
                    }
                }
            }
        },
        mounted() {
            this.getSite();
            this.getAccount();
        },
        methods: {
            getSite() {
                this.$http(api_shopee_account_site).then(res => {
                    this.siteLists = res.map(row=>{
                        return {
                            label:row.name,
                            value:row.code,
                            id:row.id
                        }
                    });

                    this.siteLists.unshift({label: '全部', value: ''})
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'})
                })
            },
            getAccount() {
                this.$http(api_order_shopee_getAccount, {channel_id: 9}).then(res => {
                    this.accountsLists = res.account;
                    this.accountsLists.unshift({label: '全部', value: ''})
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'})
                })
            },
            changeSelect(select,item) {
                this.$emit('select', item)
            },
            search_list() {
                console.log(1);
                this.$emit('search_list')
            },
        },
        watch: {
            'searchData.sn_type': function () {
                this.searchData.sn_text = '';
            }
        },
        props: {
            buttons: {
                required: true,
                type: Array
            },
            searchData: {
                required: true,
                type: Object
            },
            clears: {
                required: true,
                type: Object
            }
        },
        components: {
            labelButtons,
            searchCard: require('../../../../components/search-card.vue').default,
            orderInput: require('../../../../components/order-input.vue').default,
        }
    }
</script>
