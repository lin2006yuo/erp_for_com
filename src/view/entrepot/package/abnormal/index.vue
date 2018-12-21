<template>
    <page class="p-picking-sku">
        <label-item label="仓库：">
            <el-select v-model="warehouse_id" class="width-sm" @change="warehouse_change">
                <el-option
                        v-for="warehouse in warehouseList"
                        :label="warehouse.label"
                        :value="warehouse.value"
                        :key="warehouse.value"
                ></el-option>
            </el-select>
        </label-item>
        <search-card :params="searchData" @search="search" :clears="clears" class="mt-xs">
            <el-select class="inline s-width-default"
                       v-model="searchData.s_bill_type">
                <el-option v-for="item in typeList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
            <order-input v-model="searchData.s_bill_number"
                         class="inline width-super"
                         v-sf.s_bill_number
                         @keydown="search"></order-input>
            <label-item label="拆包员：" class="inline ml-sm">
                <el-select v-model="searchData.unpacked_id" class="s-width-small" filterable clearable>
                    <el-option v-for="item in unpackNameList"
                               :key="item.key"
                               :label="item.unpacked_name"
                               :value="item.key"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item label="采购员：" class="inline ml-sm">
                <purchaser v-sf.purchase_user_id v-model="searchData.purchaser_id" class="s-width-small"></purchaser>
            </label-item>
            <label-item label="处理状态：" class="inline ml-sm">
                <el-select v-model="searchData.exception_status" class="s-width-small">
                    <el-option v-for="item in statusList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item label="拆包时间：" class="inline ml-sm">
                <el-date-picker v-model="searchData.s_begin_date"
                                type="date"
                                placeholder="开始时间"
                                v-sf.time_st
                                :picker-options="pickerStart"
                                class="inline date ml-mini"></el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker v-model="searchData.s_end_date"
                                type="date"
                                placeholder="结束时间"
                                v-sf.time_nd
                                :picker-options="pickerEnd"
                                class="inline date mr-sm"></el-date-picker>
            </label-item>
        </search-card>
        <table-module :table-data="tableData"
                      class="mt-sm"
                      :search-data="searchData"
                      :loading="loading"
                      :total="total"
                      @search="search"
                      @handle-size-change="handle_size_change"
                      @handle-current-change="handle_current_change">
        </table-module>
    </page>
</template>

<style lang="stylus">
    .p-picking-sku {
        .el-card {
            overflow: visible;
            .width-super.el-input {
                width: 200px
            }
        }
    }
</style>

<script>
    import {api_get_parcel_exception, api_unpack_name_list} from "@/api/arrival-parcel";
    import {api_warehouses} from '@/api/global';

    export default {
        page: {
            devinfo: {
                frontEnd: '张志勇',
                backEnd: '邓海波',
                createTime: '2018-8-16',
                updateTime: '2018-8-22'
            }
        },
        refresh() {
            this.search();
        },
        data() {
            return {
                warehouse_id: 2,
                loading: false,
                searchData: {
                    s_bill_type: 1,
                    s_bill_number: '',
                    purchaser_id: '',
                    unpacked_id: '',
                    exception_status: 1,
                    page: 1,
                    pageSize: 50,
                    s_begin_date: '',
                    s_end_date: '',
                },
                clears: {
                    s_bill_type: 1,
                    page: 1,
                    exception_status: 1,
                    pageSize: 50,
                },
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.searchData.s_end_date) {
                            return time.getTime() < this.searchData.s_end_date.getTime()
                        } else {
                            return false
                        }

                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.s_begin_date) {
                            return time.getTime() < this.searchData.s_begin_date.getTime()
                        } else {
                            return false
                        }

                    }
                },
                total: 0,
                warehouseList: [],
                typeList: [
                    {
                        label: '采购单ID',
                        value: 1,
                    },
                    {
                        label: '运单号',
                        value: 2,
                    },
                    {
                        label: '接收单号',
                        value: 3,
                    },
                    {
                        label: 'SKU',
                        value: 4,
                    },
                ],
                statusList: [
                    {label: '全部', value: ''},
                    {label: '待处理', value: 1},
                    {label: '继续入库', value: 2},
                    {label: '退货', value: 3},
                    {label: '其他入库', value: 4},
                ],
                unpackNameList: [],
                tableData: [],
                sort_field: '',
                sort_type: '',
            }
        },
        created() {
            this.init_warehouse();
            this.init_unpack_list();
        },
        mounted() {
            this.search();
        },
        methods: {
            init_warehouse() {
                this.$http(api_warehouses).then(res => {
                    this.warehouseList = res;
                    this.warehouse_id = this.warehouseList[0].value;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code,
                    })
                })
            },
            init_unpack_list() {
                this.$http(api_unpack_name_list).then(res => {
                    res.list.unshift({
                        key: '',
                        unpacked_name: '全部'
                    });
                    this.unpackNameList = res.list;
                })
            },
            search() {
                let data = this.get_params();
                this.loading = true;
                this.$http(api_get_parcel_exception, data).then(res => {
                    this.tableData = res.list;
                    this.total = res.count;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code,
                    })
                }).finally(() => {
                    this.loading = false;
                })
            },
            get_params: function () {
                Object.keys(this.searchData).forEach(key => {
                    if (typeof this.searchData[key] === 'string') {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });

                let searchData = clone(this.searchData);
                if (this.searchData.s_begin_date) {
                    searchData.s_begin_date = datef('YYYY-MM-dd', this.searchData.s_begin_date.getTime() / 1000);
                } else {
                    searchData.s_begin_date = '';
                }
                if (this.searchData.s_end_date) {
                    searchData.s_end_date = datef('YYYY-MM-dd', this.searchData.s_end_date.getTime() / 1000);
                } else {
                    searchData.s_end_date = '';
                }
                if (searchData.s_bill_type !== 'spu') {
                    searchData.s_bill_number = searchData.s_bill_number.split('\n').filter(row => !!row).map(row => row.trim());
                }

                this.sort_field && (searchData.sort_field = this.sort_field);
                this.sort_type && (searchData.sort_type = this.sort_type);

                return Object.assign({}, searchData, {warehouse_id: this.warehouse_id});
            },
            warehouse_change() {
                this.search();
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
        components: {
            searchCard: require('@/components/search-card.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            orderInput: require('@/components/order-input.vue').default,
            tableModule: require('./table-module.vue').default,
            purchaser: require('@/api-components/purchaser.vue').default,
        }
    }
</script>
