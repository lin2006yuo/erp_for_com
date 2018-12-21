<template>
    <page class="p-index">
        <label-item label="请选择仓库：" class="mt-sm mb-xs">
            <el-select v-model="searchData.warehouse_id" class="inline width-sm" @change="select_warehouse">
                <el-option
                        :key="item.value"
                        v-for="item in warehouses"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <search-card @search="search" @enter="search" @init-params="clear" :params="paramsData" :clears="clears">
            <label-item label="货架号：" class="inline">
                <el-input v-sf.code v-model="paramsData.code" placeholder="请输入货位号..."
                          class="inline enter-result"></el-input>
            </label-item>
            <label-item label="货位类型：" class="inline ml-sm">
                <el-select v-sf.cargo_class_id v-model="paramsData.cargo_class_id" class="inline width-xs">
                    <el-option
                            :key="item.value"
                            v-for="item in cargoClassLists"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="分区功能：" class="inline ml-sm">
                <el-select v-sf.warehouse_area_type v-model="paramsData.warehouse_area_type" class="inline width-sm">
                    <el-option
                            :key="item.value"
                            v-for="item in appTypeList"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="状态：" class="inline ml-sm">
                <el-select v-sf.status v-model="paramsData.status" class="width-xs mr-sm">
                    <el-option
                            :key="item.value"
                            v-for="item in statusList"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
        </search-card>
        <el-row class="mt-xs">
            <permission tag="ElButton"
                        :route="apis.url_add_warehouse_shelf"
                        type="primary"
                        class="mb-xs ml-sm"
                        @click="add"
                        size="mini">添加货架
            </permission>
        </el-row>
        <data-table
                :data-table="dataTable"
                :status="this.searchData.status"
                @delete-data="delete_data"
                @update-data="update_data"
                :loading="loading"
        ></data-table>
        <div class="t-right">
            <el-pagination
                    class="page-fixed"
                    @size-change="handle_size_change"
                    @current-change="handle_current_change"
                    :current-page=this.searchData.page
                    :page-sizes="[20, 50,100, 200]"
                    :page-size=this.searchData.pageSize
                    layout="total, sizes, prev, pager, next, jumper"
                    :total=this.count>
            </el-pagination>
        </div>
        <add-edit ref="add" v-model="dialogShow" @add-data="add_data" @edit-update="edit_update" :edit-show="editShow"
                  :title="title" :warehouse-shelf-data="warehouseShelfData"></add-edit>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {warehouse_shelf_lists, add_warehouse_shelf, url_add_warehouse_shelf} from '../../../api/warehouse-shelf';
    import {entrepot_picking, api_warehous_lists} from '../../../api/entrepot-picking';
    import {
        warehouse_area_lists,
        warehouse_area_class_lists,
        api_warehouse_area_app_types
    } from '../../../api/warehouse-cargo';

    export default {
        page: {},
        permission: {
            url_add_warehouse_shelf
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                searchData: {
                    warehouse_id: 2,
                    warehouse_area_type: 0,
                    warehouse_area_id: '',
                    code: '',
                    cargo_class_id: '',
                    status: '',
                    page: 1,
                    pageSize: 50,
                },
                loading: false,
                dialogShow: false,
                editShow: false,
                count: 0,
                title: '',
                dataTable: [],
                warehouseShelfData: {
                    warehouse_id: '',
                    cargo_class_id: '',
                    warehouse_area_id: '',
                    rely: 0,
                    is_auto: 0,
                    add_type: 1,
                    status: 1,
                    pass_num: '',
                    seat_num: '',
                    start_seat_num: '',
                    end_seat_num: '',
                    row: '',
                    column: '',
                    face_aisle: '',
                    sku_num: 1,
                },
                paramsData: {
                    code: '',
                    warehouse_area_type: 0,
                    warehouse_area_id: '',
                    cargo_class_id: '',
                    status: '',
                },
                clears: {
                    warehouse_area_type: 0,
                },
                isCleared: false,
                appTypeList: [],
                statusList: [
                    {label: '全部', value: ''},
                    {label: '启用', value: 1},
                    {label: '停用', value: 0}
                ],
                warehouses: [],
                cargoClassLists: [],
            }
        },
        mounted() {
            this.warehouses_init();
            this.warehouse_area_app_types();
            this.cargo_class_list(this.searchData.warehouse_id);
            if (window.objlength(this.param) !== 0) {
                this.searchData.warehouse_id = this.param.warehouse_id;
                this.paramsData.warehouse_area_id = this.param.warehouse_area_id;
                this.searchData.warehouse_area_id = this.param.warehouse_area_id;
                this.paramsData.status = this.param.status;
                this.searchData.status = this.param.status;
                this.searchData.code = '';
                this.searchData.cargo_class_id = '';
                this.init();
            } else {
                this.init();
            }
        },
        methods: {
            clear() {
                this.isCleared = true;
            },
            init() {
                this.loading = true;
                if (this.isCleared) {
                    this.searchData.page = 1;
                    this.searchData.pageSize = 50;
                }
                let params = {
                    warehouse_id: this.searchData.warehouse_id,
                    warehouse_area_type: this.searchData.warehouse_area_type,
                    warehouse_area_id: this.searchData.warehouse_area_id,
                    code: this.searchData.code,
                    cargo_class_id: this.searchData.cargo_class_id,
                    status: this.searchData.status,
                    page: this.searchData.page,
                    pageSize: this.searchData.pageSize,
                };
                this.$http(warehouse_shelf_lists, params).then(res => {
                    this.dataTable = res.data;
                    this.count = res.count;
                    this.loading = false;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init();
            },
            select_warehouse(val) {
                this.paramsData.cargo_class_id = '';
                this.paramsData.warehouse_area_id = '';
                this.searchData.warehouse_area_id = '';
                this.searchData.warehouse_id = val;
                this.cargo_class_list(val);
                this.search();
            },
            search() {
                typeof this.paramsData.code === 'string' && (this.paramsData.code = this.paramsData.code.trim());
                this.paramsData.warehouse_area_id = '';
                Object.assign(this.searchData, this.paramsData);
                this.init();
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
            },
            add() {
                Object.keys(this.warehouseShelfData).forEach(key => {
                    this.warehouseShelfData[key] = "";
                });
                this.warehouseShelfData.warehouse_id = this.searchData.warehouse_id;
                this.warehouseShelfData.rely = 0;
                this.warehouseShelfData.is_auto = 0;
                this.warehouseShelfData.add_type = 1;
                this.warehouseShelfData.status = 1;
                this.warehouseShelfData.sku_num = 1;
                this.dialogShow = true;
                this.editShow = false;
                this.$refs.add.addEdit = false;
                this.title = `添加货架`;
            },
            delete_data() {
                this.count -= 1;
            },
            add_data(val) {
                let data = {
                    warehouse_id: val.warehouse_id,
                    warehouse_area_id: val.warehouse_area_id,
                    cargo_class_id: val.cargo_class_id,
                    status: val.status,
                    rely: val.rely,
                    is_auto: val.is_auto,
                    add_type: val.add_type,
                    row: val.row,
                    face_aisle: val.face_aisle,
                };
                if (val.add_type === 1) {
                    this.$set(data, 'pass_num', val.pass_num);
                    this.$set(data, 'seat_num', val.seat_num);
                } else if (val.add_type === 2) {
                    this.$set(data, 'pass_num', val.pass_num);
                    this.$set(data, 'start_seat_num', val.start_seat_num);
                    this.$set(data, 'end_seat_num', val.end_seat_num);
                }
                if (val.is_auto) {
                    this.$set(data, 'column', val.column);
                    this.$set(data, 'sku_num', val.sku_num);
                }
                this.$http(add_warehouse_shelf, data).then(res => {
                    if (!!res.fail_num && res.data.length === 0) {
                        this.$message({type: 'error', message: res.message || res});
                        this.$refs.add.addEdit = false;
                    } else {
                        this.dialogShow = false;
                        this.$message({type: 'success', message: res.message || res});
                        this.$refs.add.addEdit = true;
                        res.data.forEach(row => {
                            row.status = parseInt(row.status);
                            this.dataTable.unshift(row);
                            this.count += 1;
                        });
                    }
                }).catch(code => {
                    this.$refs.add.addEdit = false;
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                }).finally(() => {
                    this.$reqKey(`add_data1`, false);
                });
            },
            update_data(data, warehouse_area) {
                Object.assign(this.warehouseShelfData, data);
                this.warehouseShelfData.warehouse_area = warehouse_area;
                this.dialogShow = true;
                this.editShow = true;
                this.$refs.add.addEdit = false;
                this.title = `编辑货架号: ${data.code} 信息`;
            },
            edit_update(data) {
                this.dialogShow = false;
                let find = this.dataTable.find(row => row.id === data.id);
                if (!!find) {
                    Object.assign(find, data);
                    find.update_time = datef("YYYY-MM-dd HH:mm:ss", Date.parse(new Date) / 1000);
                    find.cargo_class = data.cargo_class;
                }
            }
        },
        watch: {
            param(val) {
                if (!!val) {
                    if (window.objlength(val) !== 0) {
                        this.searchData.warehouse_id = this.param.warehouse_id;
                        this.paramsData.warehouse_area_id = this.param.warehouse_area_id;
                        this.searchData.warehouse_area_id = this.param.warehouse_area_id;
                        this.paramsData.status = this.param.status;
                        this.paramsData.code = '';
                        this.paramsData.cargo_class_id = '';
                        this.searchData.status = this.param.status;
                        this.searchData.code = '';
                        this.searchData.cargo_class_id = '';
                        this.init();
                    }
                }
            }
        },
        components: {
            dataTable: require('./data-table.vue').default,
            addEdit: require('./add-edit.vue').default,
            labelItem: require('../../../components/label-item.vue').default,
            searchCard: require('../../../components/search-card.vue').default,
            labelButtons: require('../../../components/label-buttons.vue').default,
        }
    }
</script>
