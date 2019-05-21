<template>
    <div>
        <search-card :params="searchData" @search="search">
            <el-row>
                <label-item label="平台：" class="ml-sm">
                    <el-select
                        class="s-width-default"
                        clearable
                        filterable
                        v-model="searchData.channel_id"
                    >
                        <el-option v-for="v in channelList"
                                    :key="v.value"
                                   :label="v.label"
                                   :value="v.value"
                        >

                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="仓库：" class="ml-sm">
                    <el-select
                        v-model="searchData.warehouse_id"
                        clearabel
                        filterable
                        class="s-width-default"
                    >
                        <el-option v-for="v in warehouseList"
                                :key="v.value"
                                   :label="v.label"
                                   :value="v.value"
                        >
                        </el-option>
                    </el-select>

                </label-item>
                <label-item label="物流商：" class="ml-sm">
                    <el-select
                        v-model="searchData.carrier_id"
                        clearable
                        filterable
                        class="s-width-default"
                    >
                        <el-option
                            v-for="v in carrierList"
                            :key="v.value"
                            :label="v.label"
                            :value="v.value"
                        >
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="发货时期：" class="ml-sm">
                    <el-radio-group
                        v-model="searchData.dateRange"
                        class="mr-sm"
                    >
                        <el-radio-button
                            v-for="(v,i) in dayList"
                            :key="i"
                            :label="v.label"
                            @click.native="changeRange(v)"
                        >
                        </el-radio-button>
                    </el-radio-group>
                </label-item>
                <el-date-picker
                    v-model="searchData.date_b"
                    type="datetime"
                    placeholder="开始时间"
                    class="inline"
                    :picker-options="pickerStart"
                >
                </el-date-picker><label>--</label>
                <el-date-picker
                    v-model="searchData.date_e"
                    type="datetime"
                    placeholder="结束时间"
                    class="inline"
                    :picker-options="pickerEnd"
                ></el-date-picker>
            </el-row>
            <label-item label="邮寄方式：" class="ml-sm mr-sm mt-xs">
                <el-select
                    v-model="searchData.shipping_ids"
                    placeholder="请选择邮寄方式"
                    style="width: 550px"
                    multiple filterable clearable
                >
                    <el-option
                        v-for="v in shippingList"
                        :label="v.label"
                        :value="v.value"
                        :key="v.value"
                    >
                    </el-option>
                </el-select>
            </label-item>
        </search-card>
    </div>
</template>

<script>
    import {api_get_channel, api_get_warehouse, api_get_carrier} from '../../../api/delivery-list'
    import {api_get_shipping} from '@/api/common.js';
    import {date} from "../../product/manager/actions";
    export default {
        data() {
            return {
                channelList: [],
                warehouseList: [],
                carrierList: [],
                shippingList: [],
                dayList: [
                    {label: '今天', value: 1},
                    {label: '昨天', value: 2},
                ],
                pickerStart: {
                    disabledDate: time => {
                        if(this.searchData.date_e) {
                            return time.getTime() > this.searchData.date_e
                        } else {
                            return false
                        }
                    }
                },
                pickerEnd: {
                    disabledDate: time => {
                        if(this.searchData.date_b) {
                            return time.getTime() < this.searchData.date_b
                        } else {
                            return false
                        }
                    }
                }
            }
        },
        props: {
            searchData: {
                required: true,
                type: Object
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            init() {
                this.getChannelList()
                this.getWarehoustList()
                this.getCarrierList()
                this.getShippingList()
            },
            getChannelList() {
                this.$http(api_get_channel, {}).then(res => {
                    this.channelList = [{label: '全部', value: 0},...res]
                }).catch(err => {
                    console.error(err)
                })
            },
            getWarehoustList() {
                this.$http(api_get_warehouse).then(res => {
                    this.warehouseList = [{label: '全部', value: 0}, ...res]
                }).catch(err => {
                    console.error(err)
                })
            },
            getCarrierList() {
                this.$http(api_get_carrier).then(res => {
                    const retData = res.map(c => {
                        return {
                            value: c.id,
                            label: c.fullname
                        }
                    })
                    this.carrierList = [{label: '全部', value: 0}, ... retData]
                }).catch(err => {
                    console.error(err)
                })
            },
            getShippingList() {
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
            changeRange(item) {
                switch (item.value) {
                    case 1:
                        this.searchData.date_b = new Date().setHours(0,0,0,0)
                        this.searchData.date_e = Date.now()
                        break;
                    case 2:
                        this.searchData.date_b = new Date(Date.now() - 3600 * 24 * 1000).setHours(0,0,0,0)
                        this.searchData.date_e = this.searchData.date_b + (3600 * 24 * 1000 - 1)
                        break;
                }
            },
            search() {
                this.$emit('search')
            }
        },
        components:　{
            searchCard: require('@/components/search-card.vue').default,
            labelItem: require('@/components/label-item.vue').default
        },
    }
</script>
