<template>
    <page class="p-allocation-picking">
        <label-item label="请选择仓库：" class="mb-xs mt-sm">
            <super-select v-model="warehouse_id"
                          @change="change_depot"
                          class="inline width-sm"
                          :options="warehouseList"
                          storageKey="localWarehouse"></super-select>
            <!--<el-select v-model="warehouse_id" @change="change_depot" class="inline width-sm">-->
                <!--<el-option-->
                        <!--:key="item.value"-->
                        <!--v-for="item in warehouseList"-->
                        <!--:label="item.label"-->
                        <!--:value="item.value">-->
                <!--</el-option>-->
            <!--</el-select>-->
        </label-item>
        <search-card :params="searchData" @search="init" :clears="clears" @init-params="init_status_btn">
            <div>
                <label-buttons
                        label="拣货单状态："
                        class="inline"
                        @select="change_status"
                        :max="11"
                        :buttons="statusList">
                </label-buttons>
            </div>
            <el-select v-model="searchData.snType" v-sf.snType class="inline s-width-default">
                <el-option v-for="(item, index) in typeList"
                           :value="item.value"
                           :label="item.label"
                           :key="index">
                </el-option>
            </el-select>
            <order-input v-model="searchData.snText"
                         class="s-width-large inline"
                         v-sf.snText @keydown="init">
            </order-input>
            <el-select v-model="searchData.urType" v-sf.urType class="inline ml-sm s-width-default">
                <el-option v-for="(item, index) in urTypeList"
                           :value="item.value"
                           :label="item.label"
                           :key="index">
                </el-option>
            </el-select>
            <super-select v-model="searchData.urText"
                          class="s-width-default inline"
                          :options="staffsList"
                          storageKey="warehouseStaffs"></super-select>
            <!--<param-account-->
                    <!--v-model="searchData.urText"-->
                    <!--:param="{data:{content:''}}"-->
                    <!--:fixUrl="true"-->
                    <!--:fixResult="sale_fix_result"-->
                    <!--type="warehouseUser"-->
                    <!--placeholder="请选择/输入..."-->
                    <!--class="width-sm inline ml-xs"-->
                    <!--url="get|user/warehouse/staffs">-->
            <!--</param-account>-->
            <el-select v-model="searchData.snDate" class="inline ml-sm s-width-default">
                <el-option v-for="(item, index) in timeList"
                           :key="index"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
            <el-date-picker
                    v-model="searchData.date_b"
                    type="date"
                    placeholder="选择日期"
                    class="inline date"
                    v-sf.date_b
                    :picker-options="inputTimeStart">
            </el-date-picker>
            <label>&nbsp;--&nbsp;</label>
            <el-date-picker
                    v-model="searchData.date_e"
                    type="date"
                    placeholder="选择日期"
                    class="inline date mr-sm"
                    v-sf.date_e
                    :picker-options="inputTimeEnd">
            </el-date-picker>
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
    .p-allocation-picking {
        > .el-card {
            overflow: visible;
        }
    }
</style>

<script>
    import {api_warehous_local} from "@/api/entrepot-picking";
    import {api_allocation_pickings_status, api_allocation_pickings} from "@/api/allocation-picking";
    import {api_get_staffs_list} from '@/api/warehouse-cargo';

    export default {
        page: {
            devinfo: {
                frontEnd: '张志勇',
                backEnd: '何程',
                createTime: '2018-12-04',
                updateTime: '2017-12-05'
            },
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                warehouse_id: 187,
                searchData: {
                    status: '',
                    snType: 'picking_id',
                    snDate: 'create_time',
                    urType: 'off_shelf_id',
                    urText: '',
                    date_b: '',
                    date_e: '',
                    page: 1,
                    pageSize: 20
                },
                clears: {
                    snType: 'picking_id',
                    snDate: 'create_time',
                    urType: 'off_shelf_id',
                    page: 1,
                    pageSize: 20
                },
                warehouseList: [],
                typeList: [
                    {label: '拣货单号', value: 'picking_id'},
                    {label: '调拨单号', value: 'order_code'},
                ],
                urTypeList: [
                    {label: '拣货人', value: 'off_shelf_id'},
                    {label: '包装人', value: 'packing_id'},
                ],
                statusList: [],
                timeList: [
                    {label: '拣货创建时间', value: 'create_time'},
                    {label: '拣货完成时间', value: 'picking_end_time'},
                    {label: '包装开始时间', value: 'packing_start_time'},
                    {label: '包装完成时间', value: 'packing_end_time'},
                ],
                inputTimeStart: {
                    disabledDate: (time) => {
                        if (this.searchData.date_e) {
                            return time.getTime() > this.searchData.date_e;
                        } else {
                            return false
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.date_b) {
                            return time.getTime() < this.searchData.date_b;
                        } else {
                            return false
                        }
                    }
                },//结束时间
                loading: false,
                total: 0,
                staffsList: []
            }
        },
        mounted() {
            this.init_warehouse();
            this.init_status();
            this.get_staffs()
        },
        methods: {
            get_staffs(){
                this.$http(api_get_staffs_list).then(res => {
                    this.staffsList = res.map(row => {
                        return {
                            value: row.id,
                            label: row.realname
                        }
                    })
                })
            },
            init_status_btn() {
                let cur = this.statusList;
                let cur2 = this.typeList;
                this.statusList = [];
                this.typeList = [];
                this.$nextTick(() => {
                    this.statusList = cur;
                    this.typeList = cur2;
                })
            },
            init_warehouse() {
                this.$http(api_warehous_local).then(res => {
                    this.warehouseList = res.map(row => {
                        return {
                            label: row.name,
                            value: row.id,
                        }
                    });
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            init_status() {
                this.$http(api_allocation_pickings_status).then(res => {
                    res.unshift({label: '全部', value: ''});
                    this.statusList = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            init() {
                let data = this.get_params();
                this.loading = true;
                this.$http(api_allocation_pickings, data).then(res => {
                    this.total = res.count;
                    //初始化列表数据
                    this.$refs.table_module && this.$refs.table_module.init_table(res.data);
                }).catch(code => {
                    this.clean_table();
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    this.loading = false;
                });
            },
            clean_table() {
                this.$refs.table_module && this.$refs.table_module.init_table([]);
                this.total = 0;
            },
            get_params() {
                let searchData = clone(this.searchData);
                searchData.warehouse_id = this.warehouse_id;

                Object.keys(this.searchData).forEach(key => {
                    if (typeof this.searchData[key] === 'string') {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });

                if (searchData.snText) {
                    searchData.snText = searchData.snText.split('\n').filter(row => !!row).map(row => row.trim());
                }

                if (searchData.date_b) {
                    searchData.date_b = datef('YYYY-MM-dd', searchData.date_b / 1000);
                } else {
                    searchData.date_b = '';
                }
                if (searchData.date_e) {
                    searchData.date_e = datef('YYYY-MM-dd', searchData.date_e / 1000);
                } else {
                    searchData.date_e = '';
                }
                return searchData;
            },
            change_depot() {
                this.init();
            },
            change_status(select, item) {
                this.searchData.status = item.value;
                this.init();
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
            sale_fix_result(res) {
                return res.map(row => {
                    return {
                        value: row.id,
                        label: row.realname
                    }
                })
            },
        },
        components: {
            searchCard: require('@/components/search-card.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            labelButtons: require('@/components/label-buttons.vue').default,
            paramAccount: require('@/api-components/param-account').default,
            orderInput: require('@/components/order-input.vue').default,
            tableModule: require('./table-module.vue').default
        }
    }
</script>
