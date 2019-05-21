<template>
    <div class="ali-last-pay-time">
        <search-card @search="search_list"
                     :params="searchData"
                     :clears="clears">
            <label title="请选择1688账号">1688账号：</label>
            <super-select v-model="searchData.ali1688_account_id"
                          v-sf.ali1688_account_id
                          class="inline s-width-default"
                          storageKey="virtual_1688_account"
                          :options="accountList">
            </super-select>
            <label-item>
                <el-select v-sf.snType
                           v-model="searchData.snType"
                           class="inline s-width-default ml-sm">
                    <el-option
                        :key="item.value"
                        v-for="item in snTypeList"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <orderInput class="inline width-super ml-sm" @keydown='key_down' v-sf.snText
                            placeholder="可批量搜索，Shift+回车换行..."
                            v-model="searchData.snText">
                </orderInput>
            </label-item>
            <label title="请选择最迟付款日期" class="ml-sm">最迟付款日期：</label>
            <label-item>
                <el-date-picker
                    v-sf.date_b
                    v-model="searchData.date_b"
                    type="date"
                    placeholder="开始时间"
                    style="width:120px"
                    :picker-options="pickerstart" class="inline date">
                </el-date-picker>
                <span>&nbsp;--&nbsp;</span>
                <el-date-picker
                    v-sf.date_e
                    v-model="searchData.date_e"
                    type="date"
                    placeholder="结束时间"
                    style="width:120px"
                    :picker-options="pickerend" class="inline date mr-sm">
                </el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>

<script>
    import {
        api_finance_ali_account
    } from "../../../api/ali-last-pay-time";

    export default {
        data() {
            return {
                accountList: [],
                snTypeList: [
                    {label: '阿里订单号', value: "ali_order_id"},
                    {label: '收货人姓名', value: "receiver"},
                    {label: '买家会员名', value: "buyer_name"},
                    {label: '卖家会员名', value: "seller_name"},
                    {label: '卖家公司名', value: "seller_company"},
                ],
                pickerstart: {
                    disabledDate: (time) => {
                        console.log('time', time.getTime());
                        if (this.searchData.date_e) {
                            return time.getTime() > this.searchData.date_e
                        }
                    }
                },
                pickerend: {
                    disabledDate: (time) => {
                        console.log('tiem', time.getTime());
                        if (this.searchData.date_b) {
                            return time.getTime() < this.searchData.date_b;
                        }
                    }
                },

            };
        },
        filters: {},
        mounted() {
            this.account_1688();
        },
        methods: {
            account_1688() {//获取1688账号
                this.$http(api_finance_ali_account).then(res => {
                    this.accountList = res;
                }).catch(code => {
                    console.log(code);
                })
            },
            search_list() {
                this.$emit("search");
            },
            key_down() {
                this.search_list()
            },
        },
        props: {
            searchData: {required: true, type: Object},
            clears: {required: true, type: Object},
        },
        components: {
            searchCard: require('../../../components/search-card.vue').default,
            labelItem: require('../../../components/label-item.vue').default,
            orderInput: require("@/components/order-input.vue").default,
        },
    }
</script>

<style lang="stylus">
    .ali-last-pay-time {
        .el-card {
            overflow: visible;
        }
        .input-nomargin {
            .el-select__input {
                width: 1px !important;
                margin-left: 0 !important;
            }
        }
        .self-width .el-select__tags {
            height: 30px !important;
            width: 208px
            overflow-y: auto;
            > span {
                white-space: inherit;
            }
        }
    }
</style>
