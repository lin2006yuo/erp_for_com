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
            <label-buttons label="处理状态："
                           :buttons="statusList"
                           @select="select_status"></label-buttons>
            <!--发起，接收，处理人-->
            <el-select class="inline s-width-default"
                       v-model="searchData.person_type">
                <el-option v-for="item in personTypeList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
            <scroll-select v-model="staffs" style="width:158px" class="inline"
                           textAlign="left"
                           ref="creater"
                           remote="get|user"
                           :fix-params="fix_params_account"
                           :fixResult="fix_result_account">
            </scroll-select>
            <!--采购，运单号-->
            <el-select class="inline ml-sm s-width-default"
                       v-model="searchData.bill_type">
                <el-option v-for="item in typeList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
            <order-input v-model="searchData.bill_number"
                         class="inline width-super"
                         v-sf.s_bill_number
                         @keydown="search"></order-input>
            <!--时间搜索-->
            <el-select class="inline ml-sm s-width-default"
                       v-model="searchData.time_type">
                <el-option v-for="item in timeTypeList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
            <el-date-picker v-model="searchData.date_b"
                            type="date"
                            placeholder="开始时间"
                            v-sf.date_b
                            :picker-options="pickerStart"
                            class="inline date"></el-date-picker>
            <label>&nbsp;--&nbsp;</label>
            <el-date-picker v-model="searchData.date_e"
                            type="date"
                            placeholder="结束时间"
                            v-sf.date_e
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
    import {api_warehouses} from '@/api/global';
    import {api_receive_abnormal} from "@/api/ready-receive";

    export default {
        page: {
            devinfo: {
                frontEnd: '张志勇',
                backEnd: '黄伟杰',
                createTime: '2018-11-20',
                updateTime: '2018-11-22'
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
                    processing_status: '',
                    bill_type: 1,
                    bill_number: '',
                    person_type: 0,
                    person_id: '',
                    person_name: '',
                    time_type: 1,
                    page: 1,
                    pageSize: 50,
                    date_b: '',
                    date_e: '',
                },
                clears: {
                    bill_type: 1,
                    person_type: 0,
                    time_type: 1,
                    page: 1,
                    pageSize: 50,
                },
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.searchData.date_e) {
                            return time.getTime() < this.searchData.date_e.getTime()
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
                total: 0,
                warehouseList: [],
                typeList: [
                    {
                        label: '采购单ID',
                        value: 1,
                    },
                    {
                        label: '运单号',
                        value: 0,
                    },
                ],
                statusList: [
                    {label: '全部', value: ''},
                    {label: '未处理', value: 0},
                    {label: '已处理', value: 1},
                ],
                personTypeList: [
                    {label: '发起人', value: 0},
                    {label: '受理人', value: 1},
                    {label: '跟进人', value: 2},
                ],
                timeTypeList: [
                    // {label: '流程发起时间', value: 0},
                    {label: '接收时间', value: 1},
                    {label: '预接收时间', value: 2},
                    {label: '跟进时间', value: 3},
                ],
                tableData: [],
                sort_field: '',
                sort_type: '',
            }
        },
        created() {
            this.init_warehouse();
        },
        mounted() {
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
            select_status(index, data) {
                this.searchData.processing_status = data.value;
                this.search();
            },
            search() {
                let data = this.get_params();
                this.loading = true;
                this.$http(api_receive_abnormal, data).then(res => {
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
                if (this.searchData.date_b) {
                    searchData.date_b = datef('YYYY-MM-dd', this.searchData.date_b.getTime() / 1000);
                } else {
                    searchData.date_b = '';
                }
                if (this.searchData.date_e) {
                    searchData.date_e = datef('YYYY-MM-dd', this.searchData.date_e.getTime() / 1000);
                } else {
                    searchData.date_e = '';
                }
                if (searchData.bill_number !== '') {
                    searchData.bill_number = searchData.bill_number.split('\n').filter(row => !!row).map(row => row.trim());
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
            },
            //账号参数
            fix_params_account({page, pageSize, keyword}) {
                return {
                    page: page,
                    pageSize: pageSize,
                    snText: keyword || "",
                    snType: "realname"
                };
            },//账号结果
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
        },
        computed: {
            staffs: {
                get() {
                    return {
                        value: this.searchData.person_id,
                        label: this.searchData.person_name,
                    };
                },
                set(val) {
                    this.searchData.person_id = val.value;
                    this.searchData.person_name = val.label;
                }
            },
        },
        components: {
            searchCard: require('@/components/search-card.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            labelButtons: require('@/components/label-buttons.vue').default,
            scrollSelect: require('@/components/scroll-select.vue').default,
            orderInput: require('@/components/order-input.vue').default,
            tableModule: require('./table-module.vue').default,
            purchaser: require('@/api-components/purchaser.vue').default,
        }
    }
</script>
