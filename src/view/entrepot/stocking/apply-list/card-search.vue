<template>
    <div class="c-card-search">
        <search-card @search="search" @init-params="init_btn" :params="paramsData" :clears="clears">
            <div>
                <label-buttons class="inline btn-ml mar_left" label="状态：" title="请选择状态" :buttons="statusList"
                               @select="select_status"></label-buttons>
            </div>
            <label-item label="申请单号：" class="inline">
                <el-input v-sf.code v-model="paramsData.code" @keyup.enter.native="search" placeholder="请输入申请单号..."
                          class="inline"></el-input>
            </label-item>
            <label-item label="SKU：" class="inline ml-sm">
                <order-input v-sf.name
                             v-model="paramsData.name"
                             class="inline width-super"
                             @keydown="search"
                             placeholder="可批量搜索，Shift+回车换行...">
                </order-input>
            </label-item>
            <label-item label="平台：" class="inline ml-sm">
                <el-select class="inline width-xs" v-sf.channel_id v-model="paramsData.channel_id" placeholder="请选择">
                    <el-option
                            v-for="item in channelList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="备货仓库：" class="inline ml-sm">
                <el-select class="inline width-xs" v-sf.warehouse_id v-model="paramsData.warehouse_id"
                           placeholder="请选择">
                    <el-option
                            v-for="item in warehouses"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="中转仓库：" class="inline ml-sm">
                <el-select class="inline width-sm" v-sf.transit_warehouse_id v-model="paramsData.transit_warehouse_id"
                           placeholder="请选择">
                    <el-option
                            v-for="item in transitWarehouse"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="创建人：" class="inline ml-sm">
                <scroll-select v-model="accounts" class="inline ml-xs s-width-default"
                               v-sf.creator_id
                               textAlign="left"
                               ref="creater"
                               :remote="urlcreater"
                               :has-all="true"
                               :fix-params="fix_params_account"
                               :fixResult="fix_result_account">
                </scroll-select>
            </label-item>
            <label-item label="创建时间：" class="inline ml-sm">
                <el-date-picker v-model="paramsData.time_st"
                                type="date"
                                placeholder="开始时间"
                                v-sf.time_st
                                :picker-options="pickerstart"
                                class="inline date"></el-date-picker>
                <span>&nbsp;--&nbsp;</span>
                <el-date-picker v-model="paramsData.time_nd"
                                type="date"
                                placeholder="结束时间"
                                v-sf.time_nd
                                :picker-options="pickerend"
                                class="inline date mr-sm"></el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .c-card-search {
        .el-card {
            overflow: inherit;
        }
    }
</style>
<script>
    import {
        entrepot_picking,
        api_warehous_lists,
        api_warehous_overseas,
        api_warehous_transit
    } from '@/api/entrepot-picking';
    import {api_get_channel} from '@/api/request-note';
    import {api_in_warehouse_get} from "@/api/transfer-plan";

    export default {
        data() {
            return {
                paramsData: {
                    code: '',
                    warehouse_id: '',
                    status: '',
                    name_type: 1,
                    name: '',
                    channel_id: '',
                    creator_id: '',
                    creator_name: '',
                    time_st: '',
                    time_nd: '',
                    transit_warehouse_id: ''
                },
                clears: {
                    name_type: 1,
                },
                warehouses: [],
                transitWarehouse: [],
                statusList: [
                    {name: "全部", status: ''},
                    {name: "待确认", status: 1},
                    {name: "已确认", status: 2},
                ],
                typeList: [
                    {label: 'SKU', value: 1},
                    {label: '商品名称', value: 2},
                ],
                channelList: [],
                pickerstart: {
                    disabledDate: (time) => {
                        if (this.paramsData.time_nd) {
                            return time.getTime() > this.paramsData.time_nd;
                        } else {
                            return false
                        }
                    }
                },
                pickerend: {
                    disabledDate: (time) => {
                        if (this.paramsData.time_st) {
                            return time.getTime() < this.paramsData.time_st;
                        } else {
                            return false
                        }

                    }
                },
                urlcreater: 'get|user',
            }
        },
        created() {
            this.warehouses_init();
            this.transit_warehouse_init();
            this.get_channel();
        },
        methods: {
            init_btn() {
                let statusBtn = this.statusList;
                this.statusList = [];
                this.status = 1;
                this.$emit('clear');
                this.$nextTick(() => {
                    this.statusList = statusBtn;
                });
            },
            //账号参数
            fix_params_account({page, pageSize, keyword}) {
                return {
                    page: page,
                    pageSize: pageSize,
                    snText: keyword || "",
                    snType: "realname"
                };
            },
            //账号结果
            fix_result_account(res) {
                return {
                    options: res.data.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    }),
                    page: res.page,
                    count: res.count,
                }
            },
            get_channel() {
                this.$http(api_get_channel, {}).then(res => {
                    this.channelList = [{label: "全部", value: ""}, ...res];
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            select_status(val) {
                this.paramsData.status = this.statusList[val].status;
                this.search();
            },
            search() {
                this.$emit('search', this.paramsData);
            },
            warehouses_init() {
                this.$http(api_in_warehouse_get).then(res => {
                    this.warehouses = [{label: "全部", value: ""}, ...res];
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            transit_warehouse_init() {
                this.$http(api_warehous_transit).then(res => {
                    this.transitWarehouse = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                    this.transitWarehouse = [{label: "全部", value: ""}, ...this.transitWarehouse];
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
        },
        computed: {
            accounts: {
                get() {
                    return {
                        label: this.paramsData.creator_name,
                        value: this.paramsData.creator_id
                    }
                },
                set(val) {
                    this.paramsData.creator_name = val.label;
                    this.paramsData.creator_id = val.value;
                }
            },
            changeLabel() {
                let find = this.typeList.find(res => {
                    return res.value === this.paramsData.name_type;
                });
                if (!!find) {
                    return find.label;
                }
            }
        },
        props: {},
        components: {
            labelItem: require('@/components/label-item.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            labelButtons: require('@/components/label-buttons.vue').default,
            scrollSelect: require('@/components/scroll-select.vue').default,
            orderInput: require("@/components/order-input.vue").default,
        }
    }
</script>

