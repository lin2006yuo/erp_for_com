<template>
    <page class="p-allocation-plan">
        <search-card :params="searchData"
                     @search="init"
                     :clears="clears"
                     @init-params="init_status_btn">
            <div>
                <label-buttons
                        label="状态："
                        class="inline"
                        :max="15"
                        @select="change_status"
                        :buttons="statusList">
                </label-buttons>
            </div>
            <div class="mb-mini">
                <label-item label="出库仓库：">
                    <el-select v-model="searchData.out_warehouse_id"
                               filterable
                               clearable
                               class="width-sm inline"
                               v-sf.out_warehouse_id
                               @change="selected_out_warehouse">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item in select_out_warehouse"
                                   :value="item.value"
                                   :key="item.value"
                                   :label="item.label"
                                   :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="入库仓库：" class="ml-sm">
                    <el-select v-model="searchData.in_warehouse_id"
                               filterable
                               clearable
                               class="width-sm inline"
                               v-sf.in_warehouse_id
                               @change="selected_in_warehouse">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item in select_in_warehouse"
                                   :value="item.value"
                                   :key="item.value"
                                   :label="item.label"
                                   :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="物流发货方式：" class="inline ml-sm">
                    <el-select v-model="searchData.shipping_type"
                               v-sf.shipping_type
                               class="width-sm">
                        <el-option v-for="item in shippingTypeList"
                                   :value="item.value"
                                   :label="item.label"
                                   :key="item.value"></el-option>
                    </el-select>
                </label-item>
            </div>
            <label-item>
                <el-select v-model="searchData.number_type"
                           v-sf.number_type
                           class="inline width-xs mr-xs">
                    <el-option v-for="(item, index) in numberList"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <order-input v-model="searchData.number"
                             class="s-width-large"
                             @keydown="init"
                             v-sf.number>
                </order-input>
            </label-item>
            <label-item label="包装完成时间：" class="ml-sm mr-sm">
                <!--<el-select v-model="searchData.time_type" class="width-xs mr-xs" v-sf.time_type>
                    <el-option v-for="(item,index) in timeList"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>-->
                <el-date-picker
                        v-model="searchData.time_st"
                        type="date"
                        placeholder="选择日期"
                        class="inline date"
                        v-sf.time_st
                        :picker-options="inputTimeStart">
                </el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                        v-model="searchData.time_nd"
                        type="date"
                        placeholder="选择日期"
                        class="inline date"
                        v-sf.time_nd
                        :picker-options="inputTimeEnd">
                </el-date-picker>
            </label-item>
        </search-card>
        <table-module :search-data="searchData"
                      ref="table_module"
                      :total="total"
                      @search="init"
                      :loading="loading"
                      @handle-size-change="handle_size_change"
                      @handle-current-change="handle_current_change"></table-module>
    </page>
</template>
<style lang="stylus">
    .p-allocation-plan {
        >.el-card {
            overflow: visible;
        }
    }
</style>
<script>
    import {mapActions, mapGetters} from 'vuex';
    import {
        api_allocation_shipping,
        url_allocation_shipping_deliver,
        api_allocation_force_deliver,
        url_allocation_force_deliver
    } from "@/api/allocation-shipping";
    import {
        api_allocation_cancel,
        url_allocation_cancel,
        url_allocation_box_list
    } from "@/api/transfer-plan";
    import {
        api_warehouse_get,
        api_get_status,
    } from '@/api/transfer-plan';

    export default {
        page: {
            devinfo: {
                frontEnd: '张志勇',
                backEnd: '赖永凤',
                createTime: '2018-12-11',
                updateTime: '2017-12-'
            },
        },
        permission: {
            url_allocation_shipping_deliver,
            url_allocation_force_deliver,
            url_allocation_cancel,
            url_allocation_box_list
        },
        refresh() {
            this.$refs.search_module.init();
        },
        data() {
            return {
                searchData: {
                    status: -2,
                    out_warehouse_id: '',
                    in_warehouse_id: '',
                    number_type: 1,
                    number: '',
                    shipping_type: -1,
                    time_st: '',
                    time_nd: '',
                    page: 1,
                    pageSize: 20
                },
                clears: {
                    status: -2,
                    number_type: 1,
                    shipping_type: -1,
                    time_type: 1,
                    page: 1,
                    pageSize: 20
                },
                warehouse: [],
                statusList: [],
                select_out_warehouse: [],//出货仓库
                select_in_warehouse: [],//入货仓库
                numberList: [
                    {label: '调拨单号', value: 1},
                    {label: '运单号', value: 2},
                    {label: 'SKU', value: 3},
                    {label: 'SPU', value: 4},
                ],
                /*peopleList: [
                    {label: '创建人', value: 1},
                    {label: '更新人', value: 2}
                ],
                timeList: [
                    {label: '创建时间', value: 1},
                    {label: '更新时间', value: 2}
                ],*/
                shippingTypeList: [
                    {label: '全部', value: -1},
                    {label: '空运', value: 1},
                    {label: '海运', value: 2},
                    {label: '其他', value: 3},
                    {label: '快递', value: 4},
                    {label: '专线', value: 5},
                ],
                inputTimeStart: {
                    disabledDate: (time) => {
                        if (this.searchData.time_nd) {
                            return time.getTime() > this.searchData.time_nd;
                        } else {
                            return false
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.time_st) {
                            return time.getTime() < this.searchData.time_st;
                        } else {
                            return false
                        }
                    }
                },//结束时间
                new_item: {},
                loading: false,
                total: 0,
            }
        },
        mounted() {
            this.init_warehouse();
            this.init_statusList();
        },
        methods: {
            init_status_btn() {
                let cur2 = this.statusList;
                this.statusList = [];
                this.$nextTick(() => {
                    this.statusList = cur2;
                });
            },
            init_warehouse() {
                let params = {
                    need_fba: true,
                };
                this.$http(api_warehouse_get, params).then(res => {
                    this.warehouse = res;
                    this.select_out_warehouse = clone(this.warehouse);
                    this.select_in_warehouse = clone(this.warehouse);
                }).catch(code => {
                    this.$message({
                        showClose: true,
                        type: "warning",
                        message: code.message || code
                    });
                })
            },
            init_statusList() {
                this.$http(api_get_status, {list_type: 3}).then(res => {
                    this.statusList = [{label: '全部', value: -2}, ...res];
                }).catch(code => {
                    this.$message({
                        showClose: true,
                        type: "warning",
                        message: code.message || code
                    });
                })
            },
            /*//账号参数
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
            },*/
            //点击选择出货仓库
            selected_out_warehouse() {
                this.select_in_warehouse = clone(this.warehouse);
                this.select_in_warehouse.forEach(row => {
                    if (row.value === this.searchData.out_warehouse_id) {
                        row.disabled = true;
                    }
                    return row;
                })
            },
            //点击选择入货仓库
            selected_in_warehouse() {
                this.select_out_warehouse = clone(this.warehouse);
                this.select_out_warehouse.forEach(row => {
                    if (row.value === this.searchData.in_warehouse_id) {
                        row.disabled = true;
                    }
                    return row;
                })
            },
            change_status(select, item) {
                this.searchData.status = item.value;
                this.init();
            },
            init() {
                let data = this.get_params();
                this.loading = true;
                this.$http(api_allocation_shipping, data).then(res => {
                    //初始化列表数据
                    this.$refs.table_module && this.$refs.table_module.init_table(res.list);
                    this.total = res.count;
                }).catch(code => {
                    this.clean_table();
                    this.$message({type: 'error', message: code.message || code});
                }).finally(()=> {
                    this.loading = false;
                });
            },
            clean_table() {
                this.$refs.table_module && this.$refs.table_module.init_table([]);
                this.total = 0;
            },
            get_params() {
                Object.keys(this.searchData).forEach(key => {
                    if (typeof this.searchData[key] === 'string') {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
                let searchData = clone(this.searchData);
                if(searchData.number !== '') {
                    searchData.number = searchData.number.split('\n').filter(row => !!row).map(row => row.trim());
                }
                if (searchData.time_st) {
                    searchData.time_st = datef('YYYY-MM-dd', searchData.time_st / 1000);
                } else {
                    searchData.time_st = '';
                }
                if (searchData.time_nd) {
                    searchData.time_nd = datef('YYYY-MM-dd', searchData.time_nd / 1000);
                } else {
                    searchData.time_nd = '';
                }
                return searchData;
            },
            //分页器
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init();
            },
        },
        computed: {
            ...mapGetters({
                'user': 'user/info'
            }),
            /*staffs: {
                get() {
                    return {
                        value: this.searchData.user_id,
                        label: this.searchData.user_name,
                    };
                },
                set(val) {
                    this.searchData.user_id = val.value;
                    this.searchData.user_name = val.label;
                }
            },*/
        },
        watch: {},
        props: {},
        components: {
            searchCard: require('@/components/search-card.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            labelButtons: require('@/components/label-buttons.vue').default,
            // scrollSelect: require('@/components/scroll-select.vue').default,
            // paramAccount: require('@/api-components/param-account').default,
            orderInput: require('@/components/order-input.vue').default,
            tableModule: require('./table-module.vue').default,
        },
    }
</script>
