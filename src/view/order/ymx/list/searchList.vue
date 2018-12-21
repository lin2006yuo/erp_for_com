<template>
    <el-row class="p-searchList">
        <search-card :params="searchData" @search="search_list" :clears="clears">
            <el-row>
                <el-col :span="24">
                    <label-buttons label="订单状态：" :buttons="buttons" @select="change_button"
                                   class="inline"></label-buttons>
                </el-col>
            </el-row>
            <el-row class="mb-mini">
                <el-col :span="24">
                    <label-item label="站点：">
                        <el-select class="inline width-sm" v-model="searchData.site" filterable clearable>
                            <el-option
                                    :key="item.value"
                                    v-for="item in site"
                                    :label="item.site"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </label-item>
                    <label-item label="账号简称：" class="ml-sm">
                        <el-select class="inline width-sm" :placeholder="accountHolder" v-model="searchData.account_id"
                                   :disabled="accountList.length<=1" filterable clearable>
                            <el-option v-for="item in accountList" :key="item.value" :value="item.value"
                                       :label="item.label"></el-option>
                        </el-select>
                    </label-item>
                    <label-item label="订单类型：" class="ml-sm">
                        <el-select v-model="searchData.order_type" placeholder="请选择" class="inline  s-width-default">
                            <el-option
                                    :key="item.value"
                                    v-for="item in typess"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </label-item>
                    <label class="ml-sm">是否已放款：</label>
                    <el-select class="inline s-width-small"
                               v-model="searchData.is_transfer_money"
                               v-sf.account_id
                               filterable clearable>
                        <el-option v-for="item in makeLoansList"
                                   :key="item.value"
                                   :value="item.value"
                                   :label="item.label"></el-option>
                    </el-select>
                    <label class="ml-sm">付款状态：</label>
                    <el-select class="inline s-width-small mr-sm"
                               v-model="searchData.pay_status"
                               v-sf.pay_status
                               filterable clearable>
                        <el-option v-for="item in payList"
                                   :key="item.value"
                                   :value="item.value"
                                   :label="item.label"></el-option>
                    </el-select>
                    <label>仓库发货状态：</label>
                    <el-select class="inline s-width-small mr-sm"
                               v-model="searchData.shipping_status"
                               v-sf.shipping_status
                               filterable clearable>
                        <el-option v-for="item in shippingList"
                                   :key="item.value"
                                   :value="item.value"
                                   :label="item.label"></el-option>
                    </el-select>
                    <label>退款状态：</label>
                    <el-select class="inline s-width-small mr-sm"
                               v-model="searchData.refund_status"
                               v-sf.refund_status
                               filterable clearable>
                        <el-option v-for="item in refundList"
                                   :key="item.value"
                                   :value="item.value"
                                   :label="item.label"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-select v-model="searchData.snType" class="inline s-width-small">
                <el-option
                        :key="item.value"
                        v-for="item in selectList1"
                        :label="item.label"
                        :value="item.value"
                ></el-option>
            </el-select>
            <order-input v-model="searchData.snText"
                         class="inline width-super"
                         v-sf.snText
                         @keydown="search_list"
                         placeholder="可批量搜索，Shift+回车换行..."></order-input>
            <el-select v-model="searchData.snDate" class="inline ml-sm width-lg">
                <el-option
                        :key="item.value"
                        v-for="item in selectList2"
                        :label="item.label"
                        :value="item.value"
                ></el-option>
            </el-select>
            <el-date-picker type="date" placeholder="开始时间"
                            @keyup.enter.native="search_list"
                            v-model="searchData.date_b"
                            :picker-options="pickerstart"
                            class="inline date"></el-date-picker>
            &nbsp;--&nbsp;
            <el-date-picker type="date" placeholder="结束时间"
                            @keyup.enter.native="search_list"
                            v-model="searchData.date_e"
                            :picker-options="pickerend"
                            class="inline date mr-sm"></el-date-picker>
        </search-card>
    </el-row>
</template>
<style lang="stylus">
    .p-searchList {
        .input-width {
            width: 100px;
        }
        .el-card {
            overflow: inherit;
        }
    }

</style>
<script>
    import {
        api_account_list,
        api_order_amanzon_status,
        api_order_amanzon_site,
        api_order_amanzon_account
    } from "../../../../api/order_amazon"
    import labelButtons from '../../aliexpress/list/label-buttons.vue';
    export default{
        data(){
            return {
                isBatch: false,
                batchText: '',
                snType2: 'order_number',
                pickerstart: {
                    disabledDate: (time) => {
                        if (this.searchData.date_e) {
                            return time.getTime() > this.searchData.date_e
                        } else {
                            return false
                        }
                    }
                },
                pickerend: {
                    disabledDate: (time) => {
                        if (this.searchData.date_b) {
                            return time.getTime() < this.searchData.date_b
                        } else {
                            return false
                        }

                    }
                },
                accountHolder: "",
                urlaccount: config.apiHost + 'amazon-account',
                buttons: [],
                accounts: [],
                shipment: [
                    {label: "全部", value: ""},
                    {label: "未发货", value: 0},
                    {label: "已发货", value: 1},
                ],
                typess: [
                    {label: "全部", value: ""},
                    {label: "非FBA订单", value: "MFN"},
                    {label: "FBA订单", value: "AFN"},
                ],
                site: [],
                selectList1: [
                    {label: "订单号", value: "order_id"},
                    {label: "目的地", value: "country"},
                    {label: "平台SKU", value: "sku"},
                    {label: "ASIN", value: "item_id"},
                    {label: "客户ID", value: "email"},
                ],
                selectList3: [
                    {label: "订单号", value: "order_number"},
                    {label: "平台SKU", value: "sku"},
                    {label: "买家ID", value: "email"},
                ],
                selectList2: [
                    {id: 1, label: "下单时间", value: "created_time"},
                    {id: 2, label: "平台标记发货时间", value: "shipped_time"}
                ],
                makeLoansList:[
                    {label: "全部", value: ''},
                    {label: "是", value: 1},
                    {label: "否", value: 0}
                ],
                accountList: [{label: "", value: ""}],
                payList:[
                    {label: "全部", value: ''},
                    {label: "未付款", value: 0},
                    {label: "已付款", value: 1}
                ],
                shippingList:[
                    {label: "全部", value: ''},
                    {label: "未发货", value: 0},
                    {label: "全部发货", value: 1},
                    {label: "部分发货", value: 2}
                ],
                refundList:[
                    {label: "全部", value: ''},
                    {label: "未退款", value: 0},
                    {label: "已退款", value: 1}
                ],
            }
        },
        mounted(){
            this.get_amanzon_status(true);
            this.$http(api_order_amanzon_account).then(res => {
                this.accounts = [{id: "", code: "全部"}, ...res.data];
            }).catch(code => {
                console.log(code)
            });
            this.$http(api_order_amanzon_site).then(res => {
                res = res.map(row => {
                    row.value = row.site;
                    return row
                })
                this.site = [{site: "全部", value: ""}, ...res];
            }).catch(code => {
                console.log(code)
            });
            this.get_account(this.searchData.site);
        },
        watch: {
            "searchData.site"(val){
                this.searchData.account_id = "";
                this.get_account(val);
            },
        },
        methods: {
            init_status_btn(){
                let cur = this.buttons;
                this.buttons = [];
                this.$nextTick(() => {
                    this.buttons = cur;
                });
            },
            open_search(){
                this.isBatch = !this.isBatch;
                if (this.isBatch) {
                    this.searchData.is_batch = 1
                } else {
                    this.searchData.is_batch = '';
                    this.search_list();
                }
            },
            batch_search(){
                this.$emit('batch-search', this.snType2, this.batchText.split('\n'))
            },
            // 获取订单状态
            get_amanzon_status(val){
                let params = {
                    snDate: this.searchData.snDate,
                    snType: this.searchData.snType,
                    snText: "",
                    account_id: this.searchData.account_id,
                    site: this.searchData.site,
                    order_type: this.searchData.order_type,
                };
                let curString = this.searchData.snText.replace(new RegExp(' ','gm'),'\n');
                let cur = curString.split('\n').filter(row=>!!row);
                params.snText = cur&&cur.length>1?cur.map(row=>row.trim()):this.searchData.snText;
                if (this.searchData.date_b) {
                    let date_b_s = datef('YYYY-MM-dd', this.searchData.date_b / 1000);
                    params.date_b = date_b_s;
                }
                if (this.searchData.date_e) {
                    let date_e_s = datef('YYYY-MM-dd', this.searchData.date_e / 1000);
                    params.date_e = date_e_s;
                }

                this.$http(api_order_amanzon_status, params).then(res => {
                    let sum = 0;
                    res = res.map(row => {
                        sum += row.count;
                        return {
                            name: row.status,
                            count: row.count,
                            value: row.status
                        }
                    });
                    if (!val) {
                        this.buttons.forEach(row => {
                            let find = res.find(item => {
                                return item.name === row.name
                            });
                            if (!!find) {
                                row.count = find.count
                            } else {
                                row.count = sum;
                            }
                        })
                    } else {
                        this.buttons = [{name: "全部", count: sum, value: ""}, ...res];
                    }
                }).catch(code => {
                    console.log(code)
                });
            },
            //过滤 账户
            fix_params_account({page, pageSize, keyword}){
                return {
                    page: page,
                    pageSize: pageSize,
                    snText: keyword,
                    snType: "account_name",
                }
            },
            fix_result_account(res){
                return {
                    options: res.data.map(row => {
                        return {
                            label: row.account_name,
                            value: row.id
                        }
                    }),
                    page: res.page,
                    count: res.count,
                }
            },
            change_button(val,item){
                this.searchData.order_status = item.value;
                this.$emit('search-list')
            },
            search_list(){
                this.get_amanzon_status();
                this.$emit('search-list')
            },
//            search_clear(){
//                this.$emit('search-clear')
//            },
            change_ship(i){
//                this.$emit("change-ship",i)
            },
            change_site(i){
//                this.$emit("change-site",i)
            },
//            获取账号/简称
            get_account(val){
                this.$http(api_account_list, {channel_id: 2, site_code: val}).then(res => {
                    if (res.account.length > 0) {
                        res = res.account;
                        this.accountHolder = "请选择账号";
                        this.accountList = [{label: "全部", value: ""}, ...res];
                    } else {
                        this.accountHolder = "该站点下暂无账号简称"
                        this.accountList = [{label: "", value: ""}];
                    }
                }).catch(code => {
                    console.log(code);
                })
            },
        },
        computed: {
            changeLabel(){
                let find = this.selectList1.find(res => {
                    return res.value === this.searchData.snType;
                });
                if (!!find) {
                    return find.label;
                }
            }
        },
        props: {
            searchData: {
                required: true,
                type: Object
            },
            clears:{
                required: true,
                type: Object
            },
        },
        components: {
            labelButtons,
            labelItem: require('../../../../components/label-item.vue').default,
            searchCard: require('../../../../components/search-card.vue').default,
            orderInput:require('../../../../components/order-input.vue').default,
        }
    }
</script>
