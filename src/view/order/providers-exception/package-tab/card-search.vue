<template>
    <div class="c-card-search p-package-tab-search">
        <search-card :params="form" :clears="clears" @search="search">
            <div class="mb-mini">
                <label-buttons
                        class="inline p-package-tab-buttons"
                        label="异常原因："
                        @select="change_channel"
                        :buttons="buttons">
                </label-buttons>
                <label-item class="ml-xs">
                    <el-select v-model="form.sn_type"
                               class="s-width-default"
                               v-sf.sn_type
                               filterable clearable>
                        <el-option
                                v-for="res in sn_typeList"
                                :label="res.label"
                                :value="res.value"
                                :key="res.value"
                        ></el-option>
                    </el-select>
                </label-item>
                <label-item label="">
                    <order-input class="width-super mr-sm"
                                 v-model="form.sn_text"
                                 @keydown="key_down"
                                 placeholder="可批量搜索，Shift+回车换行..."
                                 v-sf.sn_text></order-input>
                </label-item>
                <label-item label="平台：">
                    <el-select v-model="form.channel_id"
                               class="inline width-sm"
                               v-sf.channel_id
                               filterable clearable>
                        <el-option
                                v-for="res in channelList"
                                :label="res.label"
                                :value="res.value"
                                :key="res.value"
                        ></el-option>
                    </el-select>
                </label-item>
                <label-item label="站点：" class="ml-sm">
                    <el-select v-model="form.site_code"
                               v-sf.site_code
                               class="s-width-default"
                               :placeholder="comHolderSite"
                               :disabled="siteList.length<=1"
                               filterable clearable>
                        <el-option
                                v-for="res in siteList"
                                :label="res.label"
                                :value="res.value"
                                :key="res.value"
                        ></el-option>
                    </el-select>
                </label-item>
                <label-item label="账号简称：" class="ml-sm">
                    <el-select v-model="form.channel_account_id"
                               class="s-width-default"
                               v-sf.channel_account_id
                               :disabled="accountList.length<=1"
                               :placeholder="comHolderAccount"
                               filterable clearable>
                        <el-option
                                v-for="res in accountList"
                                :label="res.label"
                                :value="res.value"
                                :key="res.value"
                        ></el-option>
                    </el-select>
                </label-item>
            </div>

            <label-item label="发货仓库：">
                <el-select v-model="form.warehouse_id"
                           class="s-width-small"
                           v-sf.warehouse_id
                           filterable clearable>
                    <el-option
                            v-for="res in warehouseList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item class="ml-sm" label="集包异常时间"></label-item>
            <el-date-picker class="date inline"
                            v-model="form.time_st"
                            :picker-options="picker_b"
                            v-sf.time_st
                            placeholder="开始时间"></el-date-picker>&nbsp;--&nbsp;
            <el-date-picker
                    class="date inline mr-sm"
                    placeholder="开始时间"
                    v-sf.time_nd
                    :picker-options="picker_e"
                    v-model="form.time_nd"></el-date-picker>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .c-card-search {
        .el-card {
            overflow: inherit;
            .p-package-tab-buttons {
                position: relative;
                top: 2px;
            }
        }
    }
</style>
<script>
    import {api_get_channel, api_account_list, api_get_warehouse, api_get_shipping} from '../../../../api/common.js';
    import {chinese} from "../../../../define/validator_reg";

    export default {
        page() {

        },
        refresh() {
            console.log("ddddd");
        },
        data() {
            return {
                channelList: [],
                accountList: [],
                siteList: [],
                warehouseList: [],
                sn_typeList: [
                    {label: "平台订单号", value: "order_no"},
                    {label: "包裹号", value: "package_number"},
                    {label: "面单号", value: "shipping_number"},
                ],
                picker_b: {
                    disabledDate: (time) => {
                        if (this.form.time_nd) {
                            return time.getTime() > this.form.time_nd;
                        } else {
                            return false;
                        }
                    }
                },
                picker_e: {
                    disabledDate: (time) => {
                        if (this.form.time_st) {
                            return time.getTime() < this.form.time_st;
                        } else {
                            return false;
                        }
                    }
                },
            }
        },
        created() {
            this.get_channel();
            this.get_warehouse();
        },
        methods: {
            key_down() {
                this.search();
            },
            search() {
                this.$emit("search");
            },
            change_channel(index, item) {
                this.form.exception_type = item.value;
                this.$emit('search');
            },
            get_warehouse() {
                this.$http(api_get_warehouse).then(res => {
                    this.warehouseList = [{label: "全部", value: ""}, ...res];
                }).catch(code => {
                    console.log(code);
                })
            },
            get_channel() {
                this.$http(api_get_channel).then(res => {
                    this.channelList = [{label: "全部", value: ""}, ...res];
                }).catch(code => {
                    console.log(code);
                })
            },
            get_site(val) {
                if (!val) return this.siteList = [{label: "", value: ""}];
                this.$http(api_account_list, {channel_id: val}).then(res => {
                    let site = res.site;
                    if (site.length <= 0) {
                        let account = res.account;
                        this.siteList = [{label: "", value: ""}];
                        if (account) {
                            this.accountList = [{label: "全部", value: ""}, ...account];
                        } else {
                            this.accountList = [{label: "", value: ""}];
                        }
                    } else {
                        this.siteList = [{label: "全部", value: ""}, ...site];
                    }
                }).catch(code => {
                    console.log(code);
                })
            },
            get_account(val) {
                if (!val) return this.accountList = [{label: "", value: ""}];
                this.$http(api_account_list, {channel_id: val}).then(res => {
                    let account = res.account;
                    if (account.length <= 0) {
                        this.accountList = [{label: "", value: ""}];
                    } else {
                        this.accountList = [{label: "全部", value: ""}, ...account];
                    }
                }).catch(code => {
                    console.log(code);
                })
            },
            // get_account(channel_id, site_code) {
            //     if (!channel_id || !site_code) return this.accountList = [{label: "", value: ""}];
            //     this.$http(api_account_list, {channel_id: channel_id, site_code: site_code}).then(res => {
            //         let account = res.account;
            //         if (account.length > 0) return this.accountList = [{label: "全部", value: ""}, ...account];
            //         this.accountList = [{label: "", value: ""}];
            //     }).catch(code => {
            //         console.log(code);
            //     })
            // },
        },
        watch: {
            'form.channel_id'(val) {
                this.form.site_code = "";
                this.form.channel_account_id = "";
                this.accountList = [{label: "", value: ""}];
                this.get_site(val);
                this.get_account(val)
            },
            // 'form.site_code'(val) {
            //     this.form.channel_account_id = "";
            //     this.get_account(this.form.channel_id, val);
            // }
        },
        computed: {
            comHolderSite() {
                if (!this.form.channel_id) {
                    return "请先选择平台";
                } else if (!!this.form.channel_id && this.siteList.length <= 1) {
                    return "该平台下暂无站点";
                } else {
                    return "请选择站点";
                }
            },
            comHolderAccount() {
                if (!this.form.channel_id) {
                    return "请先选择平台";
                } else if (!!this.form.channel_id && this.accountList.length <= 1) {
                    return "该平台下暂无账号";
                } else {
                    return "请选择账号";
                }
            },
            // comHolderAccount() {
            //     if (!this.form.site_code) {
            //         return "请先选择站点";
            //     } else if (!!this.form.site_code && this.accountList.length <= 1) {
            //         return "该站点下暂无账号";
            //     } else {
            //         return "请选择账号";
            //     }
            // },
        },
        props: {
            form: {
                required: true,
                type:
                Object
            }
            ,
            clears: {
                required: true,
                type:
                Object
            }
            ,
            buttons: {
                required: true,
                type:
                Array
            }
        }
        ,
        components: {
            searchCard: require('@/components/search-card.vue').default,
            labelItem:
            require('@/components/label-item.vue').default,
            orderInput:
            require("@/components/order-input.vue").default,
            labelButtons:
            require('@/components/label-buttons').default,
        }
    }
</script>
