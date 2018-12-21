<template>
    <div class="p-sorting-statistics">
        <search-card :params="searchData" @search="search" :clears="clears" @enter="search">
            <el-row>
                <label-item label="平台：" class="ml-sm">
                    <select-remote class="s-width-default"
                                   v-sf.channel_id
                                   v-model="searchData.channel_id"
                                   :remote="channel_remote">
                    </select-remote>
                </label-item>
                <label-item label="仓库：" class="ml-sm">
                    <el-select v-sf.warehouse_id
                               v-model="searchData.warehouse_id"
                               class="s-width-default"
                               filterable clearable>
                        <el-option v-for="item in warehouseList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </label-item>
                <label-item label="物流商：" class="ml-sm">
                    <el-select v-sf.carrier_id
                               v-model="searchData.carrier_id"
                               class="s-width-default"
                               filterable clearable>
                        <el-option v-for="item in carrierList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </label-item>
                <label-item label="发货日期：" class="ml-sm">
                    <el-radio-group v-model="searchData.dateRange" class="mr-sm">
                        <el-radio-button v-for="(item, index) in dateList"
                                         :key="index"
                                         :label="item.label"
                                         @click.native="changeRange(item)">
                        </el-radio-button>
                    </el-radio-group>
                </label-item>
                <el-date-picker
                        v-model="searchData.date_b"
                        type="datetime"
                        placeholder="开始时间"
                        class="inline"
                        v-sf.date_b
                        :picker-options="pickerstart">
                </el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                        v-model="searchData.date_e"
                        type="datetime"
                        placeholder="结束时间"
                        class="inline"
                        v-sf.date_e
                        :picker-options="pickerend">
                </el-date-picker>
            </el-row>
            <label-item label="邮寄方式：" class="ml-sm mr-sm mt-xs">
                <el-select v-model="searchData.shipping_ids"
                           placeholder="请选择邮寄方式"
                           style="width: 550px;"
                           multiple filterable clearable>
                    <el-option
                            v-for="res in shippingList"
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
    .p-sorting-statistics{
        .el-input_inner{
            height: 30px!important
        }
        .el-select__tags{
            height: 30px!important;
            width: 500px
            overflow-y: auto;
            >span{
                white-space: inherit;
            }
        }
    }
</style>
<script>
    import {api_get_channel, api_get_warehouse, api_get_carrier} from '../../../api/delivery-list'
    import {api_get_shipping} from '@/api/common.js';

    export default {
        data() {
            return {
                clears: {
                    channel_id: 0,
                    warehouse_id: '',
                    company: '',
                    dateRange: '',
                    date_b: '',
                    date_e: '',
                    shipping_ids: []
                },
                authorList: [],
                warehouseList: [],
                carrierList: [],
                dayList: [
                    {label: '今天', value: 1},
                    {label: '昨天', value: 2},
                ],
                pickerstart: {
                    disabledDate: (time) => {
                        if (this.searchData.date_e) {
                            return time.getTime() > this.searchData.date_e;
                        } else {
                            return false
                        }
                    }
                },
                pickerend: {
                    disabledDate: (time) => {
                        if (this.searchData.date_b) {
                            return time.getTime() < this.searchData.date_b;
                        } else {
                            return false
                        }
                    }
                },
                shippingList: []
            }
        },
        created() {
            this.warehouse_remote();
            this.carrier_company();
            this.get_shipping()
        },
        methods: {
            search() {
                this.$emit('search');
            },
            channel_remote(callback) {//---------平台
                return this.$http(api_get_channel, {}).then(res => {
                    callback(res);
                }).catch(code => {
                    console.log(code);
                });
            },
            warehouse_remote() {
                this.$http(api_get_warehouse).then(res => {
                    this.warehouseList = [{label: "全部", value: ""}, ...res];
                });
            },
            carrier_company() {//---------物流商
                this.$http(api_get_carrier).then(res => {
                    let data = res.map(row => {
                        return {
                            value: row.id,
                            label: row.fullname
                        }
                    })
                    this.carrierList = [{label: "全部", value: ""}, ...data];
                });
            },
            changeRange(item) {
                switch (item.value) {
                    case 1:
                        this.searchData.date_b = new Date(Date.now());
                        this.searchData.date_b.setHours(0, 0, 0, 0);
                        this.searchData.date_e = Date.now();
                        break;
                    case 2:
                        this.searchData.date_b = new Date(datef("YYYY-MM-dd", (Date.now() - (24 * 60 * 60 * 1000)) / 1000)).getTime() - 8 * 60 * 60 * 1000;
                        this.searchData.date_e = this.searchData.date_b + (24 * 60 * 60 * 1000 - 1);
                        break;
                }
            },
            get_shipping() {
                this.$http(api_get_shipping).then(res => {
                    if (res.length <= 0) return this.shippingList = [{label: "", value: ""}];
                    this.shippingList = res.map(row => {
                        return {
                            label: `${row.carrier_name}>>${row.shortname}`,
                            value: row.shipping_method_id
                        }
                    });
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
        },
        computed: {
            dateList() {
                return this.dayList;
            }
        },
        props: {
            searchData: {
                required: true,
                type: Object,
            }
        },
        components: {
            labelItem: require('../../../components/label-item.vue').default,
            searchCard: require("../../../components/search-card.vue").default,
            selectRemote: require('../../../components/select-remote.vue').default,
        }
    }
</script>