<template>
    <page class="p-activity-stocking">
        <search-card :params="searchData" :clears="clears" @search="init">
            <label-buttons label="状态：" :buttons="statusList" @select="select_status"></label-buttons>
            <label-item label="申请单号：" class="inline">
                <el-input v-model="searchData.number"
                          v-sf.number
                          class="s-width-default"
                          placeholder="请输入申请单号"
                          @keyup.enter.native="init"></el-input>
            </label-item>
            <label-item label="SKU：" class="inline ml-sm">
                <order-input v-model="searchData.sku"
                             class="width-super"
                             v-sf.sku
                             @keydown="init"></order-input>
            </label-item>
            <label-item label="备货仓库：" class="inline ml-sm">
                <super-select v-model="searchData.warehouse_id"
                              class="width-xs"
                              :options="warehouseList"
                              storageKey="activeStockWarehouse"></super-select>
                <!--<el-select v-model="searchData.warehouse_id" v-sf.warehouse_id class="width-xs">-->
                    <!--<el-option v-for="item in warehouseList"-->
                               <!--:value="item.value"-->
                               <!--:label="item.label"-->
                               <!--:key="item.value"></el-option>-->
                <!--</el-select>-->
            </label-item>
            <label-item label="平台：" class="inline ml-sm">
                <super-select v-model="searchData.channel_id"
                              class="s-width-default"
                              :options="channelList"
                              storageKey="channelList"></super-select>
                <!--<el-select v-model="searchData.channel_id"-->
                           <!--filterable-->
                           <!--v-sf.channel_id class="s-width-default">-->
                    <!--<el-option v-for="item in channelList"-->
                               <!--:value="item.value"-->
                               <!--:label="item.label"-->
                               <!--:key="item.value"></el-option>-->
                <!--</el-select>-->
            </label-item>
            <label-item label="审核人：" class="inline ml-sm">
                <scroll-select v-model="accounts" class="inline ml-xs s-width-default"
                               v-sf.auditor_id
                               textAlign="left"
                               ref="creater"
                               :remote="url_auditor"
                               :has-all="true"
                               :fix-params="fix_params_account"
                               :fixResult="fix_result_account">
                </scroll-select>
            </label-item>
            <el-select class="inline ml-sm width-xs" v-model="searchData.time_type">
                <el-option v-for="item in timeList"
                           :value="item.value"
                           :label="item.label"
                           :key="item.value"></el-option>
            </el-select>
            <el-date-picker v-model="searchData.time_st"
                            type="date"
                            placeholder="开始时间"
                            v-sf.time_st
                            :picker-options="pickerStart"
                            class="inline date ml-mini"></el-date-picker>
            <label>&nbsp;--&nbsp;</label>
            <el-date-picker v-model="searchData.time_nd"
                            type="date"
                            placeholder="结束时间"
                            v-sf.time_nd
                            :picker-options="pickerEnd"
                            class="inline date mr-sm"></el-date-picker>
        </search-card>
        <table-module :table-data="tableData"
                      :loading="loading"
                      :total="total"
                      @search="init"
                      @handle-size-change="handle_size_change"
                      @handle-current-change="handle_current_change"
                      :search-data="searchData"></table-module>
    </page>
</template>

<style lang="stylus">
    .p-activity-stocking {
        .el-card {
            overflow: visible;
            /*.width-super.el-input {
                width: 200px
            }*/
        }
    }
</style>

<script>
    import {api_local_stocking_status, api_local_stocking} from "@/api/local-stocking";
    import {api_warehouse_info} from "@/api/fba-stock";
    import {api_get_channel} from "@/api/request-note";

    export default {
        page: {
            devinfo: {
                frontEnd: '张志勇',
                backEnd: '王威,赖永凤',
                createTime: '2018-10-10',
                updateTime: '2019-1-17'
            }
        },
        data() {
            return {
                searchData: {
                    status: -1,
                    number: '',
                    sku: '',
                    warehouse_id: '',
                    channel_id: '',
                    auditor_id: '',
                    auditor_name: '',
                    time_type: 'submit',
                    time_st: '',
                    time_nd: '',
                    page: 1,
                    pageSize: 50,
                },
                clears: {
                    status: -1,
                    time_type: 'submit',
                    page: 1,
                    pageSize: 50,
                },
                statusList: [],
                warehouseList: [],
                channelList: [],
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.searchData.time_nd) {
                            return time.getTime() > this.searchData.time_nd;
                        } else {
                            return false
                        }
                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.time_st) {
                            return time.getTime() < this.searchData.time_st;
                        } else {
                            return false
                        }
                    }
                },
                timeList: [
                    {label: '申请时间', value: 'submit'},
                    {label: '审核时间', value: 'audit'},
                ],
                url_auditor: 'get|user',
                tableData: [],
                loading: false,
                total: 0,
            }
        },
        mounted() {
            this.init_status();
            this.init_warehouses();
            this.get_channel();
        },
        methods: {
            init_status() {
                this.$http(api_local_stocking_status).then(res => {
                    res.unshift({
                        value: -1,
                        label: '全部',
                    });
                    this.statusList = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            init_warehouses() {
                this.$http(api_warehouse_info, {type: 1}).then(res => {
                    this.warehouseList = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                    this.warehouseList.unshift({
                        label: '全部',
                        value: ''
                    });
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            get_channel() {
                this.$http(api_get_channel, {}).then(res => {
                    this.channelList = [{label: "全部", value: ""}, ...res];
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            init() {
                let data = this.get_params();
                this.loading = true;
                this.$http(api_local_stocking, data).then(res => {
                    this.total = res.count;
                    this.tableData = res.list;
                }).catch(code => {
                    this.tableData = [];
                    this.total = 0;
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    this.loading = false;
                });
            },
            get_params() {
                Object.keys(this.searchData).forEach(key => {
                    if (typeof this.searchData[key] === 'string') {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
                let data = clone(this.searchData);
                if (data.sku) {
                    data.sku = data.sku.split('\n').filter(row => !!row).map(row => row.trim());
                }
                data.time_st && (data.time_st = datef('YYYY-MM-dd', data.time_st / 1000));
                data.time_nd && (data.time_nd = datef('YYYY-MM-dd', data.time_nd / 1000));
                return data;
            },
            select_status(index, item) {//状态按钮选择
                this.searchData.status = item.value;
                this.init();
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
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init();
            }
        },
        computed: {
            accounts: {
                get() {
                    return {
                        value: this.searchData.auditor_id,
                        label: this.searchData.auditor_name,
                    }
                },
                set(val) {
                    this.searchData.auditor_id = val.value;
                    this.searchData.auditor_name = val.label;
                }
            },
        },
        components: {
            searchCard: require('@/components/search-card.vue').default,
            labelButtons: require('@/components/label-buttons.vue').default,
            orderInput: require('@/components/order-input.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            scrollSelect: require('@/components/scroll-select.vue').default,
            tableModule: require('./table-module.vue').default,
        }
    }
</script>
