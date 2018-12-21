<template>
    <page class="p-third-stock-in">
        <search-card :params="searchData" :clears="clear" @search="search">
            <el-row class="mb-xs">
                <label-buttons class="inline" label="状态：" :buttons="statusButtons"
                               @select="status_change"></label-buttons>
                <label-item label="仓库：" class="inline ml-sm">
                    <el-select v-model="searchData.warehouse_id"
                               filterable
                               clearable
                               v-sf.warehouse_id
                               class="width-sm">
                        <el-option v-for="(item, index) in warehouseList"
                                   :key="index"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </label-item>
            </el-row>
            <label-item label="调入平台：" class="inline">
                <el-select v-model="searchData.to_channel_id"
                           @change="to_channel_change"
                           v-sf.to_channel_id
                           clearable
                           class="s-width-default">
                    <el-option v-for="item in channelToList"
                               :value="item.value"
                               :label="item.label"
                               :key="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="调出平台：" class="inline ml-sm">
                <el-select v-model="searchData.from_channel_id"
                           @change="from_channel_change"
                           v-sf.from_channel_id
                           clearable
                           class="s-width-default">
                    <el-option v-for="item in channelFromList"
                               :disabled="item.disabled"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value"></el-option>
                </el-select>
            </label-item>
            <el-select class="ml-sm inline s-width-small"
                       v-sf.snType
                       v-model="searchData.snType">
                <el-option v-for="item in typeList"
                           :value="item.value"
                           :label="item.label"
                           :key="item.value"></el-option>
            </el-select>
            <order-input v-model="searchData.snText"
                         v-sf.snText
                         @keydown="search"
                         class="inline width-super">
            </order-input>
            <label-item label="创建人：" class="inline ml-sm">
                <el-select v-model="searchData.creator_id"
                           v-sf.creator_id
                           class="s-width-default"
                           filterable clearable>
                    <el-option v-for="item in creatorList"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="审批人：" class="inline ml-sm">
                <el-select v-model="searchData.audit_id"
                           v-sf.audit_id
                           class="s-width-default" filterable clearable>
                    <el-option v-for="item in auditorList"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value"></el-option>
                </el-select>
            </label-item>
            <el-select v-model="searchData.time_type"
                       class="inline ml-sm width-md"
                       v-sf.time_type>
                <el-option
                        v-for="res in timeTypeList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                ></el-option>
            </el-select>
            <el-date-picker v-model="searchData.date_b"
                            type="date"
                            placeholder="开始时间"
                            v-sf.date_b
                            :picker-options="pickerStart"
                            class="inline date ml-mini"></el-date-picker>
            <label>&nbsp;--&nbsp;</label>
            <el-date-picker v-model="searchData.date_e"
                            type="date"
                            placeholder="结束时间"
                            v-sf.date_e
                            :picker-options="pickerEnd"
                            class="inline date mr-sm"></el-date-picker>
        </search-card>
        <table-module class="mt-xs"
                      @search="search"
                      @handle-size-change="handle_size_change"
                      @handle-current-change="handle_current_change"
                      :total="total"
                      :table-data="tableData"
                      :search-data="searchData"
                      :loading="loading"></table-module>
    </page>
</template>

<style lang="stylus">
    .p-third-stock-in {
        .el-card {
            overflow: visible;
        }
    }
</style>

<script>
    import {
        api_warehouse_goods_channel_log,
        api_channel_log_auditor,
        api_channel_log_creator,
        api_channel_log_status,
        api_channel_log_read,
        url_channel_log_audit,
        url_channel_log_read,
    } from "@/api/warehouse-goods-channel";
    import {api_stock_in_out_warehouse} from "@/api/entrepot-picking";

    export default {
        page: {
            devinfo: {
                frontEnd: '张志勇',
                backEnd: '林鹏',
                createTime: '2017-8-5',
                updateTime: '2017-8-22'
            }
        },
        data() {
            return {
                total: 0,
                searchData: {
                    warehouse_id: '',
                    status: -1,
                    from_channel_id: '',
                    to_channel_id: '',
                    snType: 'sku',
                    snText: '',
                    creator_id: '',
                    audit_id: '',
                    time_type: 1,
                    date_b: '',
                    date_e: '',
                    page: 1,
                    pageSize: 20,
                },
                clear: {
                    status: -1,
                    snType: 'sku',
                    time_type: 1,
                    page: 1,
                    pageSize: 20,
                },
                statusButtons: [],
                creatorList: [],
                auditorList: [],
                warehouseList: [],
                channelToList: [
                    {label: 'ebay', value: 1, disabled: false},
                    {label: 'Amazon', value: 2, disabled: false},
                    {label: 'wish', value: 3, disabled: false},
                    {label: '速卖通', value: 4, disabled: false},
                ],
                channelFromList: [
                    {label: 'ebay', value: 1, disabled: false},
                    {label: 'Amazon', value: 2, disabled: false},
                    {label: 'wish', value: 3, disabled: false},
                    {label: '速卖通', value: 4, disabled: false},
                ],
                typeList: [
                    {label: 'SKU', value: 'sku'},
                    // {label: 'SKU别名', value: 'sku_alias'},
                    {label: '申请单号', value: 'code'},
                ],
                timeTypeList: [
                    {label: '创建时间', value: 1},
                    {label: '审核时间', value: 2},
                ],
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.searchData.date_e) {
                            return time.getTime() > this.searchData.date_e.getTime()
                        } else {
                            return false
                        }

                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.date_b) {
                            return time.getTime() < this.searchData.date_b.getTime()
                        } else {
                            return false
                        }

                    }
                },
                tableData: [],
                loading: false,
            }
        },
        mounted() {
            this.init_warehouse();
            this.init_status();
            this.init_creator();
            this.init_auditor();
        },
        methods: {
            init_warehouse() {
                let params = {
                    type: [1, 2, 3, 6, 7, 8, 9, 10, 12]
                };
                this.$http(api_stock_in_out_warehouse, params).then(res => {
                    this.warehouseList = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            init_status() {
                this.$http(api_channel_log_status).then(res => {
                    this.statusButtons = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            init_creator() {
                this.$http(api_channel_log_creator).then(res => {
                    this.creatorList = res.creator;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            init_auditor() {
                this.$http(api_channel_log_auditor).then(res => {
                    this.auditorList = res.auditor;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            search() {
                let params = this.get_params();
                this.tableData = [];
                // this.total = 0;
                this.loading = true;
                this.$http(api_warehouse_goods_channel_log, params).then(res => {
                    this.$nextTick(()=> {
                        this.tableData = res.data;
                        this.total = res.count;
                        this.loading = false;
                    });
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                    this.loading = false;
                })/*.finally(() => {
                    this.loading = false;
                })*/
            },
            get_params() {
                Object.keys(this.searchData).forEach(key => {
                    if (typeof this.searchData[key] === "string") {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
                let params = clone(this.searchData);
                if (this.searchData.date_b) {
                    // params.date_b = datef('YYYY-MM-dd', this.searchData.date_b.getTime() / 1000);
                    params.date_b = this.searchData.date_b.getTime() / 1000;
                } else {
                    params.date_b = '';
                }
                if (this.searchData.date_e) {
                    // params.date_e = datef('YYYY-MM-dd', this.searchData.date_e.getTime() / 1000);
                    params.date_e = this.searchData.date_e.getTime() / 1000;
                } else {
                    params.date_e = '';
                }
                params.snText = params.snText.split('\n').filter(row => !!row).map(row => row.trim());
                return params;
            },
            status_change(index, item) {
                this.searchData.status = item.value;
                this.search();
            },
            to_channel_change(val) {
                this.channelFromList.forEach(row => {
                    if (row.value === val) {
                        this.$set(row, 'disabled', true);
                    } else {
                        this.$set(row, 'disabled', false);
                    }
                })
            },
            from_channel_change(val) {
                this.channelToList.forEach(row => {
                    if (row.value === val) {
                        this.$set(row, 'disabled', true);
                    } else {
                        this.$set(row, 'disabled', false);
                    }
                })
            },
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.search();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.search();
            }
        },
        computed: {
        },
        components: {
            searchCard: require('@/components/search-card.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            labelButtons: require('@/components/label-buttons.vue').default,
            orderInput: require('@/components/order-input.vue').default,
            tableModule: require('./table-module.vue').default,
        }
    }
</script>
