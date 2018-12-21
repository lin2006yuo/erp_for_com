<template>
    <el-row class="wish-searchList">
        <search-card @search="search_list" :params="searchData" :clears="clears">
            <el-row>
                <label-buttons label="订单状态："
                               v-sf.status
                               :buttons="buttonsData"
                               @select="changeSelect"></label-buttons>
            </el-row>
            <div class="mb-mini">
                <el-select v-model="searchData.snType"
                           v-sf.snType
                           class="inline s-width-small">
                    <el-option
                        :key="item.value"
                        v-for="item in selectList1"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <order-input v-model="searchData.snText"
                             class="inline width-super mr-sm"
                             v-sf.snText
                             @keydown="search_list"
                             placeholder="可批量搜索，Shift+回车换行..."></order-input>
                <label>账号简称：</label>
                <el-select v-model="searchData.merchant_id"
                           v-sf.merchant_id
                           class="inline mr-sm s-width-small"
                           filterable>
                    <el-option
                        :key="item.value"
                        v-for="item in selectList"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <label>发货状态：</label>
                <el-select v-model="searchData.shipped_on"
                           v-sf.shipped_on
                           clearable
                           class="inline mr-sm s-width-small"
                           filterable>
                    <el-option
                        :key="item.value"
                        v-for="item in shippedLists"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <label>上网状态：</label>
                <el-select v-model="searchData.online"
                           v-sf.online
                           clearable
                           class="inline mr-sm s-width-small"
                           filterable>
                    <el-option
                        :key="item.value"
                        v-for="item in onlineLists"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <label>是否已放款：</label>
                <el-select class="inline s-width-small mr-sm"
                           v-model="searchData.is_transfer_money"
                           v-sf.account_id
                           filterable clearable>
                    <el-option v-for="item in makeLoansList"
                               :key="item.value"
                               :value="item.value"
                               :label="item.label"></el-option>
                </el-select>
                <label>付款状态：</label>
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
            </div>
            <el-select v-model="searchData.snDate"
                       v-sf.snDate
                       class="inline s-width-small" >
                <el-option
                    :key="item.value"
                    v-for="item in selectList2"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <el-date-picker
                @keyup.enter.native="search_list"
                type="date"
                placeholder="开始时间"
                v-model="searchData.date_b"
                v-sf.date_b
                class="inline"
                :picker-options="pickerOptions"
                style="width:140px"></el-date-picker>&nbsp;--
            <el-date-picker type="date"
                            @keyup.enter.native="search_list"
                            placeholder="结束时间"
                            v-model="searchData.date_e"
                            v-sf.date_e
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
    import {orderWish_getAccount} from '../../../../api/order_wish'

    export default {
        data() {
            return {
                isBatch: false,
                selectList1: [
                    {id: 1, label: "订单号", value: "order_id"},
                    {id: 4, label: "交易号", value: "transaction_id"},
                    {id: 5, label: "目的地", value: "target"},
                    {id: 6, label: "追踪号", value: "tracking"},
                    {id: 7, label: "ProductId", value: "product_id"},
                    {id: 8, label: "平台sku", value: "sku"}
                ],
                selectList3: [
                    {id: 1, label: "订单号", value: "order_id"},
                    {id: 6, label: "追踪号", value: "tracking"},
                    {id: 8, label: "平台sku", value: "sku"}
                ],
                selectList2: [
                    {id: 1, label: "下单时间", value: "transaction_date"},
                ],
                shippedLists: [
                    {label: "全部", value: ""},
                    {label: "未发货", value: "0"},
                    {label: "已发货", value: "1"}
                ],
                onlineLists: [
                    {label: "全部", value: ""},
                    {label: "未上网", value: "0"},
                    {label: "已上网", value: "1"}
                ],
                makeLoansList:[
                    {label: "全部", value: ''},
                    {label: "是", value: 1},
                    {label: "否", value: 0}
                ],
                payList:[
                    {label: "全部", value: ''},
                    {label: "未付款", value: 'unpaid'},
                    {label: "已付款", value: 'paid'}
                ],
                shippingList:[
                    {label: "全部", value: ''},
                    {label: "未发货", value: 'not_shipped'},
                    {label: "部分发货", value: 'partial_shipped'},
                    {label: "已发货", value: 'shipped'}
                ],
                refundList:[
                    {label: "全部", value: ''},
                    {label: "未退款", value: 'not_refund'},
                    {label: "已退款", value: 'refunded'}
                ],
                selectList: [],
                pickerOptions: {
                    disabledDate: (time) => {
                        if (this.searchData.date_e) {
                            return time.getTime() > this.searchData.date_e;
                        } else {
                            return false
                        }
                    }
                },
                pickerOptions1: {
                    disabledDate: (time) => {
                        if (this.searchData.date_b) {
                            return time.getTime() < this.searchData.date_b;
                        } else {
                            return false;
                        }
                    }
                }
            }
        },
        mounted() {
            this.getAccount();

        },
        methods: {
            open_search() {
                this.isBatch = !this.isBatch;
                this.$emit("open-search", this.isBatch)
            },
            batch_search() {
                this.$emit('batch-search')
            },
            getAccount() {
                this.$http(orderWish_getAccount, {channel_id: 3}).then(res => {
                    this.selectList = res.account;
                    this.selectList.unshift({label: '全部', value: ''})
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'})
                })
            },

            changeSelect(select,item) {
                this.$emit('select', item)
            },
            search_list() {
                this.$emit('search_list')
            },
            snText() {
                this.searchData.snText = this.searchData.snText.replace(/\s*/g, '')
            }
        },
        computed: {
            buttonsData() {
                return this.buttons.map(data => {
                    data.name = data.status;
                    return data
                })
            },
            changeLabel() {
                let find = this.selectList1.find(res => {
                    return res.value === this.searchData.snType;
                });
                if (!!find) {
                    return find.label;
                }
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
