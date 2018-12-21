<template>
    <div class="c-card-search">
        <search-card @search="search" :params="params" @init-params="init_btn" :clears="clears">
            <div>
                <label-buttons class="inline btn-ml mar_left" label="状态：" title="请选择状态" :buttons="statusList"
                               @select="select_status"></label-buttons>
            </div>
            <div class="el-row mb-mini">
                <label-item label="" class="inline">
                    <el-select v-sf.code_type v-model="params.code_type" class="inline width-sm">
                        <el-option
                                :key="item.value"
                                v-for="item in codeList"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input v-sf.code v-model="params.code" @keyup.enter.native="search"
                              :placeholder="`请输入${codeLabel}...`" class="enter-result inline ml-mini"></el-input>
                </label-item>
                <label-item label="SKU：" class="inline ml-sm">
                    <order-input v-sf.name
                                 v-model="params.name"
                                 class="inline width-super"
                                 @keydown="search"
                                 placeholder="可批量搜索，Shift+回车换行...">
                    </order-input>
                </label-item>
                <label-item label="备货仓库：" class="inline ml-sm">
                    <el-select class="inline width-sm" v-sf.warehouse_id v-model="params.warehouse_id"
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
                    <el-select class="inline width-sm" v-sf.transit_warehouse_id v-model="params.transit_warehouse_id"
                               placeholder="请选择">
                        <el-option
                                v-for="item in transitWarehouse"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </label-item>
            </div>
            <label-item label="平台：" class="inline">
                <el-select class="inline width-xs" v-sf.channel_id v-model="params.channel_id" placeholder="请选择">
                    <el-option
                            v-for="item in channelList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="审核人：" class="inline ml-sm">
                <scroll-select v-model="accounts" class="inline ml-xs  s-width-default"
                               v-sf.auditor_id
                               textAlign="left"
                               ref="creater"
                               :remote="urlcreater"
                               :has-all="true"
                               :fix-params="fix_params_account"
                               :fixResult="fix_result_account">
                </scroll-select>
            </label-item>
            <label-item label="" class="inline ml-sm">
                <el-select v-sf.time_type v-model="params.time_type" class="inline width-sm">
                    <el-option
                            :key="item.value"
                            v-for="item in timeList"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-date-picker v-model="params.time_st"
                                type="date"
                                placeholder="开始时间"
                                v-sf.time_st
                                :picker-options="pickerstart"
                                class="inline date ml-mini"></el-date-picker>
                <span>&nbsp;--&nbsp;</span>
                <el-date-picker v-model="params.time_nd"
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
    import {api_stocking_status} from '@/api/stocking';
    import {api_get_channel} from '@/api/request-note';

    export default {
        data() {
            return {
                params: {
                    code_type: 1,
                    code: '',
                    warehouse_id: '',
                    status: '',
                    name_type: 1,
                    name: '',
                    channel_id: '',
                    auditor_id: '',
                    auditor_name: '',
                    time_type: 1,
                    time_st: '',
                    time_nd: '',
                    transit_warehouse_id: ''
                },
                clears: {
                    name_type: 1,
                    code_type: 1,
                    time_type: 1,
                },
                status: '',
                warehouses: [],
                transitWarehouse: [],
                statusList: [],
                typeList: [
                    {label: 'SKU', value: 1},
                    {label: '商品名称', value: 2},
                ],
                codeList: [
                    {label: '申请单号', value: 1},
                    {label: '采购计划编号', value: 2},
                ],
                timeList: [
                    {label: '申请时间', value: 1},
                    {label: '审核时间', value: 2},
                ],
                channelList: [],
                pickerstart: {
                    disabledDate: (time) => {
                        if (this.params.time_nd) {
                            return time.getTime() > this.params.time_nd;
                        } else {
                            return false
                        }
                    }
                },
                pickerend: {
                    disabledDate: (time) => {
                        if (this.params.time_st) {
                            return time.getTime() < this.params.time_st;
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
            this.status_init();
            this.get_channel();
        },
        methods: {
            init_btn() {
                let statusBtn = this.statusList;
                this.statusList = [];
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
                this.status = this.statusList[val].value;
                this.search();
            },
            search() {
                this.$set(this.params, 'status', this.status);
                this.$emit('search', this.params);
            },
            warehouses_init() {
                this.$http(api_warehous_overseas).then(res => {
                    this.warehouses = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                    this.warehouses = [{label: "全部", value: ""}, ...this.warehouses];
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
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
            status_init() {
                this.$http(api_stocking_status).then(res => {
                    this.statusList = res.map((item) => {
                        return {label: item.label, value: item.value};
                    });
                    this.statusList = [{label: "全部", value: ""}, ...this.statusList];
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
        },
        computed: {
            accounts: {
                get() {
                    return {
                        label: this.params.auditor_name,
                        value: this.params.auditor_id
                    }
                },
                set(val) {
                    this.params.auditor_name = val.label;
                    this.params.auditor_id = val.value;
                }
            },
            codeLabel() {
                let find = this.codeList.find(res => {
                    return res.value === this.params.code_type;
                });
                if (!!find) {
                    return find.label;
                }
            },
            changeLabel() {
                let find = this.typeList.find(res => {
                    return res.value === this.params.name_type;
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

