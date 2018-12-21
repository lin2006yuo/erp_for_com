<template>
    <div class="c-card-search p-package-tab-search">
        <search-card :params="form" :clears="clears" @search="search">
            <label-item>
                <el-select v-model="form.snType"
                           class="s-width-default"
                           v-sf.snType
                           filterable clearable>
                    <el-option
                            v-for="res in snTypeList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item label="">
                <order-input class="width-super mr-sm"
                             v-model="form.snText"
                             @keydown="key_down"
                             placeholder="可批量搜索，Shift+回车换行..."
                             v-sf.snText></order-input>
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
                <el-select v-model="form.account_id"
                           class="s-width-default"
                           v-sf.account_id
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
            <label-item class="ml-sm mr-sm" label="发货仓库：">
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
    import {api_get_channel, api_account_list, api_get_warehouse} from '../../../../api/common.js';

    export default {
        page() {

        },
        data() {
            return {
                channelList: [],
                accountList: [],
                siteList: [],
                warehouseList: [],
                snTypeList: [
                    {label: "平台订单号", value: "channel_order_number"},
                    {label: "包裹号", value: "number"},
                    {label: "面单号", value: "tracking"},
                ],
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
            get_site_and_account(val) {
                this.$http(api_account_list, {channel_id: val}).then(res => {
                    if (res.site.length > 0) {
                        this.siteList = [{label: "全部", value: ""}, ...res.site];
                    } else {
                        this.siteList = [{label: "", value: ""}];
                    }
                    if (res.account.length > 0) {
                        this.accountList = [{label: "全部", value: ""}, ...res.account];
                    } else {
                        this.accountList = [{label: "", value: ""}];
                    }
                }).catch(code => {
                    console.log(code);
                })
            }
        },
        watch: {
            'form.channel_id'(val) {
                this.form.site_code = "";
                this.form.account_id = "";
                this.siteList = [{label: "", value: ""}];
                this.accountList = [{label: "", value: ""}];
                val&&this.get_site_and_account(val);
            }
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
        }
        ,
        components: {
            searchCard: require('@/components/search-card.vue').default,
            labelItem:
            require('@/components/label-item.vue').default,
            orderInput:
            require("@/components/order-input.vue").default,
        }
    }
</script>
