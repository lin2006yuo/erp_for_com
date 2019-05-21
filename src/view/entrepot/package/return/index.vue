<template>
    <page class="p-package-return">
        <search-card :params="searchData" :clears="clears" @search="init" class="mt-xs" @init-params="init_btn">
            <label-item label="仓库：" class="mb-xs">
                <el-select v-model="searchData.warehouse_id"
                           filterable
                           clearable
                           v-sf.warehouse_id
                           class="width-sm">
                    <el-option
                            v-for="warehouse in warehouseList"
                            :label="warehouse.label"
                            :value="warehouse.value"
                            :key="warehouse.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item label="数据来源：" class="ml-sm mb-xs">
                <el-select v-model="searchData.source"
                           v-sf.source
                           class="width-sm">
                    <el-option
                            v-for="item in sourceList"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                    ></el-option>
                </el-select>
            </label-item>

            <label-item label="异常类型：" class="ml-sm mb-xs">
                <el-select v-model="searchData.abnormal_type"
                           v-sf.abnormal_type
                           class="width-sm">
                    <el-option
                            v-for="item in exceptionTypes"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label-buttons class="inline mb-xs ml-sm" label="审批状态："
                           @select="change_select"
                           :buttons="auditTypes"></label-buttons>
            <label-item label="寄付方式：" class="mb-xs">
                <el-select v-model="searchData.payment_type"
                           v-sf.payment_type
                           class="width-sm">
                    <el-option
                            v-for="item in paymentList"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                    ></el-option>
                </el-select>
            </label-item>
            <br />
            <!-- 采购员，处理人，审批人 -->
            <el-select class="inline s-width-small"
                       v-sf.person_type
                       v-model="searchData.person_type">
                <el-option v-for="item in users"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
            <super-select v-model="searchData.person_id"
                          :remote-request-http="remote_user"
                          :adjust-structure="adjust_user"
                          placeorder="请输入/选择..."
                          class="inline s-width-small"
                          storage-key="allStaffs"></super-select>
            <!--<scroll-select v-model="staffs" class="inline s-width-small"
                           textAlign="left"
                           ref="creater"
                           remote="get|user"
                           :fix-params="fix_params_account"
                           :fixResult="fix_result_account">
            </scroll-select>-->
            <!--采购，运单号-->
            <el-select class="inline ml-sm s-width-small"
                       v-sf.bill_type
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
                         @keydown="init"></order-input>
            <!--时间搜索-->
            <el-select class="inline ml-sm s-width-small"
                       v-sf.time_type
                       v-model="searchData.time_type">
                <el-option v-for="item in timeTypes"
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
                      class="mt-xs"
                      :search-data="searchData"
                      :loading="loading"
                      :total="total"
                      @search="init"
                      @handle-size-change="handle_size_change"
                      @handle-current-change="handle_current_change">
        </table-module>
    </page>
</template>

<style lang="stylus">
    .p-package-return {
        .el-card {
            overflow: visible;
        }
    }
</style>

<script>
    import {api_warehouses} from '@/api/global';
    import {api_return_goods_warehouse} from "@/api/parcel-return";
    import {api_get_user} from "@/api/server-management";
    import {api_abnormal_source} from "@/api/search-parcel";

    export default {
        devinfo: {
            forntEnd: '张志勇',
            backEnd: '黄伟杰',
            createTime: '2019-1-9',
            updateTime: '2019-1-9'
        },
        data() {
            return {
                searchData: {
                    warehouse_id: '',
                    source: '',// 数据来源
                    payment_type: 0, // 寄付方式
                    abnormal_type: '', // 异常类型
                    audit_status: '', // 审批状态
                    person_type: 3, // 人员类型
                    person_id: '',
                    person_name: '',
                    bill_type: 0,
                    bill_number: '',
                    time_type: 0,
                    date_b: '',
                    date_e: '',
                    page: 1,
                    pageSize: 20,
                },
                clears: {
                    payment_type: 0,
                    person_type: 3,
                    bill_type: 0,
                    time_type: 0,
                    page: 1,
                    pageSize: 20,
                },
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
                exceptionTypes: [
                    {label: '全部', value: ''},
                    {label: '退回供应商', value: 4},
                    {label: '仓库转移', value: 5},
                ],
                auditTypes: [
                    {label: '全部', value: ''},
                    {label: '仓库待确认', value: 1},
                    {label: '仓库已提交', value: 2},
                    {label: '待上传凭证', value: 9},
                    {label: '已上传凭证', value: 10},
                    {label: '作废', value: 11}
                ],
                warehouseList: [],
                sourceList: [
                ],
                users: [
                    {label: '采购员', value: 3},
                    {label: '仓库处理人', value: 5},
                    // {label: '审批人', value: 2},
                ],
                paymentList: [
                    {label: '全部', value: 0},
                    {label: '到付', value: 1},
                    {label: '寄付', value: 2},
                ],
                typeList: [
                    {label: '运单号', value: 0},
                    {label: '采购单号', value: 1},
                ],
                timeTypes: [
                    {label: '创建时间', value: 0},
                    {label: '提交时间', value: 6},
                ],
                total: 0,
                loading: false,
                tableData: [],
                // removeDuplicate: false,//去重
            }
        },
        mounted() {
            this.init_warehouse();
            this.init_abnormal_source();
        },
        methods: {
            init_btn(){
                let typeList = this.auditTypes;
                this.auditTypes = [];
                this.$nextTick(() => {
                    this.auditTypes = typeList
                })
            },
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
            init_abnormal_source() {
                this.$http(api_abnormal_source).then(res => {
                    res.unshift({
                        label: '全部',
                        value: '',
                    });
                    this.sourceList = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            change_select(index, item) {
                this.searchData.audit_status = item.value;
                this.init();
            },
            init() {
                /*if (!this.removeDuplicate) {
                    return;
                }*/
                let data = this.get_params();
                this.loading = true;
                this.$http(api_return_goods_warehouse, data).then(res => {
                    this.tableData = res.data.map(row => {
                        this.$set(row, 'weight', Number(row.weight));
                        this.$set(row, 'sent_fee', Number(row.sent_fee));
                        let arr = [];
                        row.purchase_order_ids.split(',').forEach(item => {
                            item = item ? 'PO' + item : item;
                            arr.push(item);
                        });
                        let code = arr.join(',');
                        row.purchase_order_ids = code;
                        return row;
                    });
                    this.total = res.count;
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
                return searchData;
            },
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init();
            },
            //账号参数
            fix_params_account({page, pageSize, keyword}) {
                return {
                    page: page,
                    pageSize: pageSize,
                    snText: keyword || "",
                    snType: "realname",
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
            remote_user(page, pageSize, keyword) {
                return api_get_user({
                    page: page,
                    pageSize: pageSize,
                    snText: keyword || "",
                    snType: "realname",
                });
            },
            adjust_user(res) {
                return {
                    data: res.data.map(row => {
                        return {
                            label: row.realname,
                            value: row.id,
                        }
                    }),
                    count: res.count,
                }
            }
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
        watch: {},
        components: {
            searchCard: require('@/components/search-card.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            labelButtons: require('@/components/label-buttons.vue').default,
            scrollSelect: require('@/components/scroll-select.vue').default,
            orderInput: require('@/components/order-input.vue').default,
            tableModule: require('./table-module.vue').default,
        }
    }
</script>
