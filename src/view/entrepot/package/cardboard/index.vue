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
            <label-buttons label="卡板状态：" :buttons="cardboardStatus" @select="change_select"></label-buttons>
            <el-select class="inline s-width-default"
                       v-sf.bill_type
                       v-model="searchData.bill_type">
                <el-option v-for="item in typeList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
            <el-input v-model="searchData.bill_number"
                         class="inline width-super"
                         v-sf.bill_number
                         @keyup.enter.native="search"></el-input>
            <label-item label="卡板号：" class="inline ml-sm">
                <el-input v-model="searchData.box_id "
                          v-sf.box_id
                          @keyup.enter.native="search"
                          placeholder="请输入卡板号" class="width-md"></el-input>
            </label-item>
            <label-item label="接收员：" class="inline ml-sm">
                <el-select v-sf.creator_id
                           v-model="searchData.creator_id"
                           filterable
                           class="s-width-default">
                    <el-option
                            v-for="item in receiving_clerk"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="拆包员：" class="inline ml-sm">
                <el-select v-model="searchData.unpacking_id"
                           v-sf.unpacking_id
                           class="s-width-small"
                           filterable clearable>
                    <el-option v-for="item in unpackNameList"
                               :key="item.key"
                               :label="item.unpacked_name"
                               :value="item.key"
                    ></el-option>
                </el-select>
            </label-item>
            <el-select v-model="searchData.begin_status"
                       class="inline ml-sm width-md"
                       v-sf.time_type>
                <el-option
                        v-for="res in timeTypeList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                ></el-option>
            </el-select>
            <el-date-picker v-model="searchData.begin_date"
                            type="date"
                            placeholder="开始时间"
                            v-sf.begin_date
                            :picker-options="pickerStart"
                            class="inline date ml-mini"></el-date-picker>
            <label>&nbsp;--&nbsp;</label>
            <el-date-picker v-model="searchData.end_date"
                            type="date"
                            placeholder="结束时间"
                            v-sf.end_date
                            :picker-options="pickerEnd"
                            class="inline date mr-sm"></el-date-picker>
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
    import {api_get_parcel_box, api_box_unpack_name_list, api_parcel_box_status} from "@/api/purchase-parcels-box";
    import {api_user_warehouse} from "@/api/search-parcel";
    import {api_warehouses} from '@/api/global';

    export default {
        page: {
            devinfo: {
                frontEnd: '张志勇',
                backEnd: '黄伟杰',
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
                    bill_type: 1,
                    bill_number: '',
                    box_id : '',
                    creator_id: '',
                    unpacking_id: '',
                    box_status: '',
                    page: 1,
                    pageSize: 20,
                    begin_date: '',
                    end_date: '',
                    begin_status: 0,
                },
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.searchData.end_date) {
                            return time.getTime() < this.searchData.end_date.getTime()
                        } else {
                            return false
                        }

                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.begin_date) {
                            return time.getTime() < this.searchData.begin_date.getTime()
                        } else {
                            return false
                        }

                    }
                },
                total: 0,
                clears: {
                    bill_type: 1,
                    page: 1,
                    pageSize: 20,
                    begin_status: 0,
                },
                warehouseList: [],
                cardboardStatus: [],
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
                timeTypeList: [
                    {label: '完成打板时间', value: 0},
                    {label: '完成拆板时间', value: 1}
                ],
                statusList: [
                    {label: '全部', value: ''},
                    {label: '未处理', value: 1},
                    {label: '已处理', value: 2},
                ],
                receiving_clerk: [],
                unpackNameList: [],
                tableData: [],
                sort_field: '',
                sort_type: '',
            }
        },
        created() {
            this.init_warehouse();
            this.init_unpack_list();
            this.init_status();
            this.init_user_warehouse();
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
            init_status() {
                this.$http(api_parcel_box_status).then(res => {
                    res.unshift({
                        label: '全部',
                        value: ''
                    });
                    this.cardboardStatus = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            init_unpack_list() {
                this.$http(api_box_unpack_name_list).then(res => {
                    res.list.unshift({
                        key: '',
                        unpacked_name: '全部'
                    });
                    this.unpackNameList = res.list;
                })
            },
            init_user_warehouse() {
                let data = {warehouse_id: this.warehouse_id};
                this.$http(api_user_warehouse, data).then(res => {
                    let receive_list = res.map(row => {
                        return {label: row.realname, value: row.id};
                    });
                    this.receiving_clerk = [{label: '全部', value: ''}, ...receive_list];
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            change_select(index, item) {
                this.searchData.box_status = item.value;
                this.search();
            },
            search() {
                let data = this.get_params();
                this.loading = true;
                this.$http(api_get_parcel_box, data).then(res => {
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

                if (this.searchData.begin_date) {
                    searchData.begin_date = datef('YYYY-MM-dd', this.searchData.begin_date.getTime() / 1000);
                } else {
                    searchData.begin_date = '';
                }
                if (this.searchData.end_date) {
                    searchData.end_date = datef('YYYY-MM-dd', this.searchData.end_date.getTime() / 1000);
                } else {
                    searchData.end_date = '';
                }
                /*this.sort_field && (searchData.sort_field = this.sort_field);
                this.sort_type && (searchData.sort_type = this.sort_type);*/

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
            labelButtons: require('@/components/label-buttons').default,
        }
    }
</script>
