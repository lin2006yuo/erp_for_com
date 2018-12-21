<template>
    <div>
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
        <search-card :params="searchData" @search="search" :clears="clears" @init-params="init_status_btn">
            <div>
                <label-buttons
                        label="拣货单状态："
                        class="inline"
                        @select="change_status"
                        :max="11"
                        :buttons="statusList">
                </label-buttons>
            </div>
            <div>
                <label-buttons
                        label="拣货单类型："
                        class="inline"
                        @select="change_type"
                        :buttons="typeList">
                </label-buttons>
            </div>
            <label-item label="拣货单：">
                <el-input v-model="searchData.picking"
                          v-sf.picking
                          @keyup.enter.native="init">
                </el-input>
            </label-item>
            <label-item label="包裹号：" class="ml-sm">
                <el-input v-model="searchData.number"
                          v-sf.number
                          @keyup.enter.native="init">
                </el-input>
            </label-item>
            <label-item label="SKU：" class="ml-sm">
                <el-input v-model="searchData.sku"
                          v-sf.sku
                          @keyup.enter.native="init">
                </el-input>
            </label-item>
            <label-item label="分区：" class="ml-sm">
                <ui-select v-model="searchData.warehouse_area_id" class="width-xs">
                    <el-option
                            :key="item.value"
                            v-for="item in warehouseAreaLists"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </ui-select>
            </label-item>
            <label-item label="拣货人：" class="ml-sm">
                <param-account
                        v-model="searchData.shipper_id"
                        :param="{data:{content:''}}"
                        :fixUrl="true"
                        :fixResult="sale_fix_result"
                        type="warehouseUser"
                        placeholder="请选择/输入..."
                        class="width-sm"
                        url="get|user/warehouse/staffs">
                </param-account>
            </label-item>
            <label-item class="ml-sm">
                <el-select v-model="searchData.snDate" class="width-xs">
                    <el-option v-for="(item, index) in timeList"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item class="ml-sm mr-sm">
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
                        class="inline date"
                        v-sf.date_e
                        :picker-options="inputTimeEnd">
                </el-date-picker>
            </label-item>
        </search-card>

    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {entrepot_picking, api_get_pickingstatus, api_get_pickingtype} from '@/api/pickings'
    import {
        warehouse_area_lists
    } from '@/api/warehouse-cargo';

    export default {
        data() {
            return {
                warehouses: [],
                warehouse_id: 2,
                searchData: {
                    type: 0,
                    shipping_id: '',
                    warehouse_area_id: '',
                    status: '',
                    snDate: 'create_time',
                    picking: '',
                    number: '',
                    sku: '',
                    date_b: '',
                    date_e: '',
                    shipper_id: '',
                    page: 1,
                    pageSize: 20
                },
                clears: {
                    type: 0,
                    snDate: 'create_time',
                    page: 1,
                    pageSize: 20
                },
                warehouseAreaLists: [],
                statusList: [],
                typeList: [],
                timeList: [
                    {label: '创建时间', value: 'create_time'},
                    {label: '完成时间', value: 'packing_end_time'},
                    {label: '分拣时间', value: 'picking_end_time'},
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
            }
        },
        mounted() {
            this.init_warehouse();
            this.init_pickings_status();
            this.init_warehouse_area();
            this.init();
        },
        methods: {
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
            init() {
                // this.trim();
                Object.keys(this.searchData).forEach(key => {
                    if(typeof this.searchData[key] === 'string') {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
                this.$emit('init-data', this.searchData);
            },
            trim() {//输入去空格处理
                this.searchData.picking = this.searchData.picking.trim();
                this.searchData.number = this.searchData.number.trim();
                this.searchData.sku = this.searchData.sku.trim();
            },
            init_warehouse() {
                this.$http(entrepot_picking).then(res => {
                    this.warehouses = res.map(item => {
                        return {label: item.name, value: item.id};
                    });
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            init_pickings_status() {
                this.$http(api_get_pickingstatus).then(res => {
                    this.statusList = res.map(row => {
                        return {
                            label: `${row.label}`,
                            value: row.value
                        }
                    });
                    this.statusList.unshift({label: '全部', value: ''});
                    this.init_pickings_type();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            init_warehouse_area() {
                let data = {
                    status: 1,
                    warehouse_id: this.warehouse_id,
                    list_type: 'cargo',
                };
                this.$http(warehouse_area_lists, data).then(res => {
                    this.warehouseAreaLists = res.map(row => {
                        return {
                            label: row.name,
                            value: row.id
                        }
                    });
                    this.warehouseAreaLists.unshift({label: '全部', value: ''});
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            init_pickings_type() {
                this.$http(api_get_pickingtype, {status: this.searchData.status}).then(res => {
                    this.typeList.length = 0;
                    for (let key in res) {
                        this.typeList.push(res[key]);
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            change_depot() {
                this.init_warehouse_area();
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
            change_type(select, item) {
                this.searchData.type = item.value;
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
        computed: {
            accounts: {
                get() {
                    return {
                        label: this.searchData.shipper_name,
                        value: this.searchData.shipper_id
                    }
                },
                set(val) {
                    this.searchData.shipper_name = val.label;
                    this.searchData.shipper_id = val.value;
                }
            }
        },
        watch: {
            warehouse_id(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.warehouse_id = val;
            }
        },
        props: {
            value: {}
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            labelButtons: require('@/components/label-buttons.vue').default,
            paramAccount: require('@/api-components/param-account').default
        },
    }
</script>
