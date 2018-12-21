<template>
    <search-card @search="search_list" @enter="search_list" :params="paramsData" :clears="clears"
                 @init-params="init_status_btn">
        <div>
            <label-buttons
                    label="销售渠道："
                    @select="change_channel"
                    :buttons="channels">
            </label-buttons>
        </div>
        <div class="mb-mini" v-if="accountLabel && acountData.length > 0">
            <select-more-button
                    :label="accountLabel"
                    label-width="120"
                    :button-list="acountData"
                    :clear-select="clearSelect"
                    @query="change_account">
            </select-more-button>
        </div>
        <div>
            <label-buttons label="库存状态："
                           class="inline"
                           @select="change_stock"
                           :buttons="stock">
            </label-buttons>
            <label-buttons
                    class="inline"
                    label-width="120"
                    label="包裹类型："
                    @select="change_package"
                    :buttons="packageTypes">
            </label-buttons>

        </div>
        <key-value title="支持逗号(,)分割；带*是模糊搜索" :kv="moreConds" v-sf.moreCond
                   v-model="paramsData.moreCond"></key-value>
        <label-item class="inline ml-xs" label="销售员：">
            <param-account
                    class="inline width-sm"
                    ref="paramSale"
                    placeholder="可输入搜索"
                    v-model="paramsData.seller_id"
                    v-sf.seller_id
                    :param="{type:'sales',data:{content:''}}"
                    :fixUrl="true"
                    :fixResult="sale_fix_result"
                    type="memberShipSales"
                    url="get|user/:type/staffs">
            </param-account>
        </label-item>
        <box-area class="inline ml-xs">
            <label-item label="付款时间：">
                <el-date-picker class="inline date" type="date" v-sf.starDay :picker-options="pickerstart"
                                placeholder="开始时间" v-model="paramsData.starDay"></el-date-picker>
                <span>&nbsp;--&nbsp;</span>
                <el-date-picker :picker-options="pickerend" type="date" class="inline date mr-sm" placeholder="结束时间"
                                v-sf.endDay v-model="paramsData.endDay"></el-date-picker>
            </label-item>
        </box-area>
    </search-card>
</template>
<style lang="stylus">
    .p-label-btns {
        .c-label-buttons {
            label {
                line-height: 29px;
            }
        }
        .el-card__body {
            padding: 0 0 8px 0;
        }
        .depots {
            margin-top: 5px;
        }
        .depots-left {
            margin-left: 10px;
        }
    }

</style>
<script>
    import labelButtons from '../../../components/label-buttons.vue'
    import labelItems from '../../../components/label-items.vue'
    import selectQuery from '../../../components/select-query.vue'

    export default {
        data() {
            return {
                buttonVisibility: false,
                pickerstart: {
                    disabledDate: (time) => {
                        if (this.paramsData.endDay) {
                            return time.getTime() > this.paramsData.endDay.getTime();
                        } else {
                            return false
                        }
                    }
                },
                pickerend: {
                    disabledDate: (time) => {
                        if (this.paramsData.starDay) {
                            return time.getTime() < this.paramsData.starDay.getTime();
                        } else {
                            return false
                        }
                    }
                },
                channel: "",
                paramsData: {
                    moreCond: {key: 'order_number', val: ''},
                    endDay: '',
                    starDay: '',
                    seller_id: '',
                },
                clears: {
                    moreCond: {key: 'order_number', val: ''},
                },
                moreConds: [
                    {label: '买家*', value: 'buyer'},
                    {label: '订单号*', value: 'order_number'},
                    {label: 'sku*', value: 'sku'},
                    {label: '目的地*', value: 'dist_address'},
                    {label: '包裹号', value: 'package'}
                ],
                selectAccounts: [],
                showOpenList: false,
                clearSelect: false
            }
        },
        methods: {
            init_status_btn() {
                this.$emit('init-status-btn');
                this.$emit('clear');
            },
            //点击渠道时
            change_channel(select, channel) {
                this.channel = channel;
                this.$emit('change-channel', channel)
                this.clearSelect = !this.clearSelect;
            },
            //点击库存状态
            change_stock(select) {
                this.$emit('change-stock', select)
            },
            change_package(selected, item) {
                this.$emit('change-package', item.value);
            },
            change_account(accounts) {
                this.selectAccounts = accounts;
                this.$emit('change-account', accounts.map(a => a.value).join(','));
            },
            sale_fix_result(res) {
                return res.map(row => {
                    return {
                        value: row.id,
                        label: row.realname
                    }
                })
            },
            //点击搜索
            search_list() {
                this.dataChecked.starDay = this.paramsData.starDay;
                this.dataChecked.endDay = this.paramsData.endDay;
                typeof this.paramsData.moreCond.value === 'string' && (this.this.paramsData.moreCond.value = this.paramsData.moreCond.value.trim());
                this.$emit('search-list', {
                    accounts: this.selectAccounts.map(a => a.value).join(','),
                    date: this.dataChecked,
                    cond: this.paramsData.moreCond,
                    seller_id: this.paramsData.seller_id
                })
            },

            clear_form() {
                this.paramsData.moreCond = {key: 'order_number', val: ''};
                this.paramsData.moreCond.val = '';
                this.paramsData.starDay = '';
                this.paramsData.endDay = '';
                this.dataChecked.starDay = '';
                this.dataChecked.endDay = '';
                this.$emit('search-list', {accounts: '', date: this.dataChecked, cond: this.paramsData.moreCond})
            },
        },
        watch: {
            'dataChecked'(val) {
                if (val) {
                    this.paramsData.dataChecked = val;
                }
            }
        },
        computed: {
            accountLabel() {
                if (this.channel && this.channel.value) {
                    return this.channel.label + " 账号：";
                } else {
                    return false;
                }
            },
            accountnum() {
                if (this.channel && this.channel.count) {
                    return this.channel.count;
                } else {
                    return 0;
                }
            },
            check() {
                if (this.moreCond.val) {
                    return true;
                }
                if (this.dataChecked.starDay) {
                    return true;
                }
                if (this.dataChecked.endDay) {
                    return true;
                }
                return false;
            }
        },
        props: {
            channels: {
                required: true,
                type: Array
            },
            stock: {
                required: true,
                type: Array
            },
            acountData: {
                required: true,
                type: Array
            },
            dataChecked: {
                required: true,
                type: Object
            },
            packageTypes: {
                required: true,
                type: Array
            }
        },
        components: {
            labelButtons,
            labelItems,
            labelItem: require('@/components/label-item.vue').default,
            selectQuery,
            keyValue: require('@/components/key-value.vue').default,
            boxArea: require('@/components/box-area.vue').default,
            clear: require('@/components/search-clear.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            selectMoreButton: require('./select-more-button').default,
            paramAccount: require('@/api-components/param-account.vue').default,
        }
    }
</script>
