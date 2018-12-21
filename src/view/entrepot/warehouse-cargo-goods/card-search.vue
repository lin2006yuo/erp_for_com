<template>
    <div class="c-card-search">
        <label-item label="请选择仓库：" class="mb-xs mt-sm">
            <el-select v-model="searchData.warehouse_id" class="inline width-sm" @change="select_warehouse">
                <el-option
                        :key="item.value"
                        v-for="item in warehouses"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <search-card @search="search" :params="paramsData" @init-params="clear" :clears="clears">
            <div class="mb-xs">
                <label-item label="货位号：" class="inline">
                    <order-input v-sf.code
                                 v-model="paramsData.code"
                                 class="inline width-super"
                                 @keydown="search"
                                 placeholder="可批量搜索，Shift+回车换行...">
                    </order-input>
                </label-item>
                <label-item label="SKU：" class="inline ml-sm">
                    <order-input v-sf.sku
                                 v-model="paramsData.sku"
                                 class="inline width-super"
                                 @keydown="search"
                                 placeholder="可批量搜索，Shift+回车换行...">
                    </order-input>
                </label-item>
                <label-item label="商品名称：" class="inline ml-sm">
                    <el-input v-sf.goods_name v-model="paramsData.goods_name" @keyup.enter.native="search"
                              placeholder="请输入商品名称..." class="inline"></el-input>
                </label-item>
                <label-item label="分区功能：" class="inline ml-sm">
                    <el-select v-sf.warehouse_area_type v-model="paramsData.warehouse_area_type"
                               class="inline width-sm">
                        <el-option
                                :key="item.status"
                                v-for="item in appTypeList"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="产品状态：" class="inline ml-sm">
                    <el-select v-sf.status v-model="paramsData.sku_status" class="inline width-xs">
                        <el-option
                                :key="item.value"
                                v-for="item in skuStatusList"
                                :label="item.lable"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </label-item>
            </div>
            <label-item label="货位类型：">
                <el-select v-sf.cargo_class_id v-model="paramsData.cargo_class_id" class="inline width-xs">
                    <el-option
                            :key="item.value"
                            v-for="item in cargoClassLists"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="" class="inline ml-sm">
                <el-select v-sf.numType v-model="paramsData.numType" class="inline width-xs">
                    <el-option
                            :key="item.value"
                            v-for="item in numTypeLists"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="paramsData.numSymbol"
                           class="width-mini" v-sf.numSymbol>
                    <el-option v-for="(item, index) in numSymbolList"
                               :key="index"
                               :value="item.value"
                               :label="item.label">
                    </el-option>
                </el-select>
                <integer-zero-input v-sf.numText :min="0" v-model="paramsData.numText" @keyup.enter.native="search"
                                    class="width-sm inline"></integer-zero-input>
            </label-item>

            <label-item label="库存数与冻结数查询：" class="inline ml-sm mr-sm">
                <el-select v-sf.cargo_class_id v-model="paramsData.compare_type" class="inline width-md">
                    <el-option
                            :key="item.value"
                            v-for="item in compareTypeList"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .c-card-search {
        .el-card {
            overflow: inherit;
        }
    }
</style>
<script>
    import {entrepot_picking, api_warehous_lists, api_get_sku_status} from '@/api/entrepot-picking';
    import {
        warehouse_area_lists,
        warehouse_area_class_lists,
        api_warehouse_area_app_types
    } from '@/api/warehouse-cargo';

    export default {
        data() {
            return {
                paramsData: {
                    warehouse_area_type: 0,
                    code: '',
                    cargo_class_id: '',
                    sku: '',
                    goods_name: '',
                    numType: 'quantity',
                    numSymbol: '>',
                    numText: '0',
                    compare_type: 0,
                    sku_status: '',
                },
                skuStatusList: [],
                clears: {
                    warehouse_area_type: 0,
                    numType: 'quantity',
                    numSymbol: '>',
                    numText: '0',
                    compare_type: 0,
                },
                isCleared: false,
                warehouses: [],
                cargoClassLists: [],
                appTypeList: [],
                numTypeLists: [
                    {value: 'quantity', label: '库存数'},
                    {value: 'hold_quantity', label: '冻结数'},
                ],
                numSymbolList: [
                    {value: '>', label: '>'},
                    {value: '=', label: '='},
                    {value: '<', label: '<'},
                ],
                compareTypeList: [
                    {value: 0, label: '全部'},
                    {value: 1, label: '库存数大于冻结数'},
                    {value: 2, label: '库存数等于冻结数'},
                ]
            }
        },
        created() {
            this.warehouses_init();
            this.warehouse_area_app_types();
            this.cargo_class_list();
            this.get_sku_status();
            this.search();
        },
        methods: {
            clear() {
                this.isCleared = true;
            },
            select_warehouse(val) {
                this.searchData.warehouse_id = val;
                this.warehouse_area_app_types();
                this.cargo_class_list();
                this.search();
            },
            search() {
                if (this.isCleared) {
                    this.searchData.page = 1;
                    this.searchData.pageSize = 50;
                    this.isCleared = false;
                }
                Object.assign(this.searchData, this.paramsData);
                this.$emit('search', this.searchData);
            },
            warehouses_init() {
                this.$http(api_warehous_lists).then(res => {
                    this.warehouses = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                    console.log(this.warehouses, this.searchData.warehouse_id, this.warehouses.find(row => row.value === this.searchData.warehouse_id));
                    this.$emit('set-warehouse-name', this.warehouses.find(row => row.value === this.searchData.warehouse_id).label);
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            warehouse_area_app_types() {
                this.$http(api_warehouse_area_app_types).then(res => {
                    this.appTypeList = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            cargo_class_list() {
                this.$http(warehouse_area_class_lists, {warehouse_id: this.searchData.warehouse_id}).then(res => {
                    this.cargoClassLists = res.map(item => {
                        return {
                            label: item.name,
                            value: item.id,
                        }
                    });
                    this.cargoClassLists = [{value: '', label: '全部'}, ...this.cargoClassLists];
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            get_sku_status() {
                this.$http(api_get_sku_status).then(res => {
                    this.skuStatusList = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: `产品状态 ${code.message || code}`
                    })
                });
            }
        },
        watch: {
            'searchData.warehouse_id': function (val) {
                if (this.warehouses.length > 0) {
                    this.$emit('set-warehouse-name', this.warehouses.find(row => row.value === val).label);
                }
            },
        },
        props: {
            searchData: {},
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            labelButtons: require('@/components/label-buttons.vue').default,
            integerZeroInput: require('@/components/integer-zero-input.vue').default,
            orderInput: require("@/components/order-input.vue").default,
        }
    }
</script>

