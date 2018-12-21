<template>
    <div class="p-package-management">
        <div>
            <label-item label="请选择仓库：" class="mb-xs mt-sm">
                <el-select v-model="warehouse_id" @change="change_depot" class="inline width-sm">
                    <el-option
                            :key="item.value"
                            v-for="item in warehouses"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
        </div>
        <search-card :params="searchData" @search="search" :clears="clears"
                     @init-params="init_status_btn">
            <div>
                <label-buttons
                        label="状态："
                        class="inline"
                        @select="change_status"
                        :buttons="statusList">
                </label-buttons>
            </div>
            <label-item label="集包单号：">
                <order-input v-model="searchData.code"
                             class="width-super"
                             @keydown="search"
                             v-sf.code></order-input>
                <!--<el-input v-model="searchData.code" class="enter-result" v-sf.code></el-input>-->
            </label-item>
            <label-item label="包裹号：" class="ml-sm">
                <el-input v-model="searchData.package_number"
                          @keyup.enter="search"
                          class="enter-result" v-sf.package_number></el-input>
            </label-item>
            <label-item class="ml-sm">
                <el-select v-model="searchData.identity" class="width-xs" v-sf.identity>
                    <el-option v-for="(item,index) in peopleList"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <param-account
                        v-model="searchData.user_id"
                        class="ml-xs width-md"
                        :param="{data:{content:''}}"
                        :fixUrl="true"
                        :fixResult="sale_fix_result"
                        type="warehouseUser"
                        placeholder="请选择/输入..."
                        url="get|user/warehouse/staffs">
                </param-account>
            </label-item>
            <label-item class="ml-sm mr-sm">
                <el-select v-model="searchData.time_type" class="width-xs mr-xs" v-sf.time_type>
                    <el-option v-for="(item,index) in timeList"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <el-date-picker
                        v-model="searchData.time_st"
                        type="datetime"
                        placeholder="选择日期"
                        class="inline date"
                        v-sf.time_st
                        :picker-options="inputTimeStart">
                </el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                        v-model="searchData.time_nd"
                        type="datetime"
                        placeholder="选择日期"
                        class="inline date"
                        v-sf.time_nd
                        :picker-options="inputTimeEnd">
                </el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .p-package-management {
        .ml-zd {
            margin-left: 24px;
        }
        .el-card {
            overflow: visible;
        }
    }
</style>
<script>
    import {entrepot_picking, api_get_status} from '../../../api/package-collection'

    export default {
        data() {
            return {
                warehouses: [],
                warehouse_id: 2,
                searchData: {
                    status: 0,
                    code: '',
                    package_number: '',
                    carrier_id: 0,
                    shipping_id: 0,
                    identity: 1,
                    user_id: '',
                    time_type: 1,
                    time_st: '',
                    time_nd: '',
                    page: 1,
                    pageSize: 20
                },
                clears: {
                    status: 0,
                    identity: 1,
                    time_type: 1,
                    page: 1,
                    pageSize: 20,
                    carrier_id: 0,
                    shipping_id: 0,
                },
                statusList: [],
                peopleList: [
                    {label: '集包人', value: 1},
                    {label: '复核人', value: 2},
                    {label: '发货人', value: 3},
                    {label: '作废人', value: 4}
                ],
                timeList: [
                    {label: '集包时间', value: 1},
                    {label: '复核时间', value: 2},
                    {label: '发货时间', value: 3},
                    {label: '更新时间', value: 4}
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
            }
        },
        mounted() {
            this.init_warehouse();
            this.init_status();
        },
        methods: {
            init_status_btn() {
                let cur = this.statusList;
                this.statusList = [];
                this.$nextTick(() => {
                    this.statusList = cur;
                })
            },
            init() {
                Object.keys(this.searchData).forEach(key => {
                    if (typeof this.searchData[key] === 'string') {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
                let searchData = window.clone(this.searchData);
                Object.assign(searchData, {warehouse_id: this.warehouse_id});
                this.$emit('init-data', searchData);
            },
            init_warehouse() {
                this.$http(entrepot_picking).then(res => {
                    this.warehouses = res.map(item => {
                        return {label: item.name, value: item.id};
                    });
                    this.$nextTick(() => {
                        this.$parent.$refs.table_module.request_shipping_method();
                    });
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            async init_status() {
                try {
                    this.statusList = await this.$http(api_get_status)
                } catch (code) {
                    this.$message({type: "error", message: code.message || code});
                }
            },
            change_depot() {
                this.init();
                this.$nextTick(() => {
                    this.$parent.$refs.table_module.request_shipping_method();
                });
            },
            change_status(select, item) {
                this.searchData.status = item.value;
                this.init();
                this.$nextTick(() => {
                    this.$parent.$refs.table_module.request_shipping_method();
                });
            },
            search() {
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
        computed: {},
        watch: {},
        props: {},
        components: {
            labelItem: require('@/components/label-item.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            labelButtons: require('@/components/label-buttons.vue').default,
            paramAccount: require('@/api-components/param-account').default,
            orderInput: require('@/components/order-input.vue').default,
        },
    }
</script>
