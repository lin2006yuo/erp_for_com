<template>
    <div class="c-order-details-search">
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears">
            <div class="mb-mini">
                <label-item label="平台：">
                    <select-remote class="width-sm"
                                   v-sf.channel_id
                                   v-model="searchData.channel_id"
                                   :remote="channel_remote">
                    </select-remote>
                </label-item>
                <label-item label="站点：" class="ml-xs">
                    <el-select :disabled="siteOptions.length<=1"
                               class="width-sm"
                               v-sf.site_code
                               filterable clearable
                               :placeholder="sitePlaceholder"
                               v-model="searchData.site_code">
                        <el-option v-for="item in siteOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="账号简称：" class="ml-sm">
                    <el-select :disabled="accoutOptions.length<=1"
                               class="width-sm"
                               filterable clearable
                               v-sf.account_id
                               :placeholder="accountPlaceholder"
                               v-model="searchData.account_id">
                        <el-option v-for="item in accoutOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="发货仓库：" class="ml-sm">
                    <el-select class="width-super"
                               v-sf.warehouse_id
                               multiple
                               v-model="searchData.warehouse_id"
                               filterable clearable>
                        <el-option v-for="item in warehouseList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </label-item>
                <label-item label="运输方式：" class="ml-sm">
                    <el-cascader
                            clearable
                            filterable
                            change-on-select
                            :disabled="shippingList.length<=0"
                            :placeholder="shippingPlaceholder"
                            class="inline s-width-large"
                            v-model="searchData.shipping_id"
                            expand-trigger="hover"
                            :options="shippingList"
                    ></el-cascader>
                </label-item>
                <el-select v-model="searchData.snDate"
                           class="width-xs inline ml-sm"
                           v-sf.snDate>
                    <el-option v-for="type in time_type_list"
                               :key="type.value"
                               :label="type.label"
                               :value="type.value">
                    </el-option>
                </el-select>
                <el-date-picker
                        v-model="searchData.date_b"
                        type="date"
                        placeholder="开始日期"
                        class="inline date s-width-default ml-sm"
                        v-sf.date_b
                        :picker-options="inputTimeStart">
                </el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                        v-model="searchData.date_e"
                        type="date"
                        placeholder="结束日期"
                        class="inline date s-width-default"
                        v-sf.date_e
                        :picker-options="inputTimeEnd">
                </el-date-picker>
            </div>
            <label-item label="开发员：">
                <param-account
                        class="width-sm"
                        ref="paramDevelopment"
                        v-model="searchData.developer_id"
                        v-sf.developer_id
                        :fixResult="development_fix_result"
                        type="memberShipSales"
                        placeholder="请选择/输入..."
                        url="get|user/development/staffs">
                </param-account>
            </label-item>
            <label-item label="采购员：" class="ml-sm">
                <purchaser v-sf.purchaser_id class="inline width-sm"
                           v-model="searchData.purchaser_id">
                </purchaser>
            </label-item>
            <label-item label="订单号：" class="ml-sm">
                <el-input type="text"
                          v-model="searchData.order_number"
                          class="mr-sm"
                          v-sf.order_number>
                </el-input>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .c-order-details-search {
        .el-select__tags {
            overflow-y: auto;
            &>span {
                white-space: inherit;
            }
        }
    }
</style>
<script>
    import {api_get_channel, api_account_list, api_get_warehouse, api_get_shipping} from '../../../api/report-channel'

    export default {
        refresh() {
            this.shippingList = [];
        },
        data() {
            return {
                siteOptions: [{label: "", value: ""}],
                accoutOptions: [{label: "", value: ""}],
                warehouseList: [],
                time_type_list: [
                    {label: '发货日期', value: 'shipping_time'},
                    {label: '付款日期', value: 'pay_time'}
                ],
                development_list: [],
                searchData: {
                    channel_id: 0,
                    site_code: '',
                    account_id: "",
                    warehouse_id: [],
                    snDate: 'shipping_time',
                    date_b: new Date(Date.now()).setDate(1),
                    date_e: Date.now(),
                    developer_id: '',
                    purchaser_id: '',
                    order_number: '',
                    page: 1,
                    pageSize: 20,
                    shipping_id: [],
                },
                clears: {
                    warehouse_id: [],
                    channel_id: 0,
                    snDate: 'shipping_time',
                    page: 1,
                    pageSize: 20,
                    shipping_id: [],
                },
                inputTimeStart: {
                    disabledDate: (time) => {//开始时间
                        if (this.searchData.date_e) {
                            return time.getTime() > this.searchData.date_e;
                        } else {
                            return false
                        }
                    }
                },
                inputTimeEnd: {//结束时间
                    disabledDate: (time) => {
                        if (this.searchData.date_b) {
                            return time.getTime() < this.searchData.date_b || time.getTime() > Number(this.searchData.date_b) + 30 * 24 * 60 * 60 * 1000;
                        } else {
                            return false
                        }
                    }
                },
                goodsDialog: false,
                shippingList: [],
            }
        },
        mounted() {
            this.warehouse_remote();
            this.get_site(this.searchData.channel_id);
            // this.init();
        },
        methods: {
            init() {
                this.$emit('init-data', this.searchData);
            },
            development_fix_result(res) {
                return res.map(row => {
                    return {
                        value: row.id,
                        label: row.realname
                    }
                })
            },

            channel_remote(callback) {
                return this.$http(api_get_channel, {}).then(res => {
                    callback(res);
                }).catch(code => {
                    this.$message({message: code.message, type: 'error'});
                });
            },
            site_remote() {
                return this.$http(api_get_channel_categories, {}).then(res => {
                    return Promise.resolve(res.map(cate => {
                        return {label: cate.name, value: cate.id};
                    }));
                }).catch(code => {
                    console.log(code);
                });
            },
            warehouse_remote() {
                this.$http(api_get_warehouse).then(res => {
                    res.forEach(row => {
                        this.warehouseList.push({label: row.name, value: row.id});
                    });
                    this.warehouseList.unshift({label: '全部', value: ''})
                });
            },
            get_site(channel_id) {
                if (!channel_id) return this.siteOptions = [{label: "", value: ""}];
                this.$http(api_account_list, {channel_id: channel_id}).then(res => {
                    if (res.site.length <= 0) {
                        if (res.account.length > 0) {
                            res = res.account;
                            this.accoutOptions = [{label: "全部", value: ""}, ...res];
                        } else {
                            this.accoutOptions = [{label: "", value: ""}];
                        }
                        this.siteOptions = [{label: "", value: ""}]
                    } else {
                        res = res.site;
                        this.siteOptions = [{label: "全部", value: ""}, ...res];
                    }
                }).catch(code => {
                    console.log(code);
                })
            },
            get_account(channel_id, site_code) {
                if (!channel_id || !site_code) return this.accoutOptions = [{label: "", value: ""}];
                this.$http(api_account_list, {channel_id: channel_id, site_code: site_code}).then(res => {
                    if (res.account.length > 0) {
                        res = res.account;
                        this.accoutOptions = [{label: "全部", value: ""}, ...res];
                    } else {
                        this.accoutOptions = [{label: "", value: ""}];
                    }
                }).catch(code => {
                    console.log(code);
                })
            },
            search() {
                if (!!this.searchData.date_b) {
                    this.init();
                } else {
                    return this.$message({message: "请选择日期开始时间", type: 'warning'});
                }
            },
            select_goods() {
                this.goodsDialog = true;
            },
            shipping_remote() {
                if (this.searchData.warehouse_id === []) return this.shippingList = [];
                this.$http(api_get_shipping, {warehouse_id: this.searchData.warehouse_id.join(',')}).then(res => {
                    if (res.length <= 0) {
                        return this.shippingList = [];
                    }
                    let list = res.map(row => {
                        return row.carrier_id
                    });
                    list = this.carrier_unique(list).map(carrier_id => {
                        let label = res.find(row => row.carrier_id === carrier_id);
                        return {
                            label: label.carrier_name,
                            value: carrier_id
                        }
                    });
                    this.shippingList = list.map(row => {
                        row.children = this.get_children(row, res);
                        return row
                    });
                }).catch(code => {
                    console.log(code);
                });
            },
            carrier_unique(arr) {
                let res = [];
                let json = {};
                for (let i = 0; i < arr.length; i++) {
                    if (!json[arr[i]]) {
                        res.push(arr[i]);
                        json[arr[i]] = 1;
                    }
                }
                return res;
            },
            get_children(row, res) {
                let child = [];
                res.forEach(item => {
                    if (row.value === item.carrier_id) {
                        child.push({
                            label: item.shortname,
                            value: item.shipping_method_id
                        })
                    }
                });
                return child
            },
        },
        computed: {
            accountPlaceholder() {
                if ((this.searchData.site_code <= 0 && this.accoutOptions.length > 1) || this.searchData.site_code > 0) {
                    return "请选择账号";
                } else if (this.searchData.site_code <= 0) {
                    return "请先选择站点";
                } else if (this.accoutOptions.length <= 1) {
                    return "该站点下暂无账号";
                }
            },
            sitePlaceholder() {
                if (this.searchData.channel_id <= 0) {
                    return "请先选择平台";
                } else if (this.siteOptions.length <= 1) {
                    return "该平台下暂无站点";
                } else {
                    return "请选择站点"
                }
            },
            shippingPlaceholder() {
                if (this.searchData.warehouse_id === '') {
                    return "请先选择发货仓库";
                } else if (this.searchData.warehouse_id > 0 && this.shippingList.length <= 0) {
                    return "该发货仓下暂无运输方式";
                } else {
                    return '请选择/输入运输方式';
                }
            },
        },
        watch: {
            'searchData.channel_id'(val) {
                this.searchData.site_code = '';
                this.searchData.account_id = "";
                this.siteOptions = [{label: "", value: ""}];
                this.accoutOptions = [{label: "", value: ""}];
                this.get_site(val);
            },
            'searchData.site_code'(val) {
                this.searchData.account_id = "";
                this.get_account(this.searchData.channel_id, val);
            },
            'searchData.warehouse_id'(val) {
                this.shippingList = [];
                this.searchData.shipping_id = [];
                this.shipping_remote();
            }
        },
        props: {},
        components: {
            labelItem: require('../../../components/label-item.vue').default,
            selectRemote: require('../../../components/select-remote.vue').default,
            addGoods: require('../../../api-components/add-goods.vue').default,
            paramAccount: require('../../../api-components/param-account.vue').default,
            searchCard: require('../../../components/search-card.vue').default,
            purchaser: require('../../../api-components/purchaser.vue').default
        },
    }
</script>
