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
        <search-card @search="search" @enter="search" :params="paramsData" :clears="clears"
                     @init-params="init_status_btn">
            <div>
                <label-buttons class="inline btn-ml mar_left" label="状态：" title="请选择状态" :buttons="statusList"
                               @select="select_status"></label-buttons>
            </div>
            <label-item label="货位号：" class="inline">
                <el-input v-sf.code v-model="paramsData.code" placeholder="请输入货位号..."
                          class="inline mr-sm enter-result"></el-input>
            </label-item>
            <label-item label="分区功能：" class="inline">
                <el-select v-sf.warehouse_area_type v-model="paramsData.warehouse_area_type" filterable
                           class="inline s-width-default">
                    <el-option
                            :key="item.value"
                            v-for="item in appTypeList"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="货位类型：" class="inline ml-sm">
                <el-select v-sf.cargo_class_id v-model="paramsData.cargo_class_id" filterable
                           class="inline s-width-small">
                    <el-option
                            :key="item.value"
                            v-for="item in cargoClassLists"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="SKU品种数：" class="inline ml-sm">
                <integer-zero-input v-sf.sku_num :min="0" v-model="paramsData.sku_num"
                                    class="width-mini inline mr-sm enter-result"></integer-zero-input>
            </label-item>
            <label-item label="占用情况：" class="inline mr-sm">
                <el-select v-sf.occupy v-model="paramsData.occupy" class="inline s-width-small">
                    <el-option
                            :key="item.value"
                            v-for="item in occupyLists"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {entrepot_picking, api_warehous_lists} from '../../../api/entrepot-picking';
    import {
        warehouse_area_lists,
        warehouse_area_class_lists,
        api_warehouse_area_app_types
    } from '../../../api/warehouse-cargo';

    export default {
        data() {
            return {
                paramsData: {
                    warehouse_id: 2,
                    warehouse_area_type: 0,
                    code: '',
                    cargo_class_id: '',
                    occupy: '',
                    status: '',
                    sku_num: ''
                },
                clears: {
                    warehouse_area_type: 0,
                    warehouse_id: 2,
                },
                occupyLists: [
                    {label: '全部', value: ''},
                    {label: '全部占用', value: 1},
                    {label: '部分占用', value: 2},
                    {label: '未占用', value: 0},
                ],
                statusList: [
                    {name: "全部", status: ''},
                    {name: "启用", status: 1},
                    {name: "停用", status: 0},
                ],
                warehouses: [],
                appTypeList: [],
                cargoClassLists: [],
                isCleared: false
            }
        },
        created() {
            this.warehouses_init();
            this.warehouse_area_app_types();
            this.cargo_class_list(this.searchData.warehouse_id);
        },
        methods: {
            init_status_btn() {
                let curBtn = this.statusList;
                this.statusList = [];
                this.isCleared = true;
                this.$nextTick(() => {
                    this.statusList = curBtn;
                });
            },
            select_warehouse(val) {
                this.paramsData.warehouse_area_id = '';
                this.paramsData.warehouse_id = val;
                this.cargo_class_list(this.searchData.warehouse_id);
                this.search();
            },
            select_status(val) {
                this.paramsData.status = this.statusList[val].status;
                this.search();
            },
            search() {
                typeof this.paramsData.code === "string" && (this.paramsData.code = this.paramsData.code.trim());
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
            cargo_class_list(id) {
                let data = {
                    warehouse_id: id
                };
                this.$http(warehouse_area_class_lists, data).then(res => {
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
            }
        },
        props: {
            searchData: {},
        },
        components: {
            labelItem: require('../../../components/label-item.vue').default,
            searchCard: require('../../../components/search-card.vue').default,
            labelButtons: require('../../../components/label-buttons.vue').default,
            integerZeroInput: require('../../../components/integer-zero-input.vue').default,
        }
    }
</script>

