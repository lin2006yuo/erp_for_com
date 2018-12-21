<template>
    <page class="p-index">
        <card-search
                ref="search"
                :searchData="searchData"
                @search="search"></card-search>
        <el-row class="mt-xs">
            <permission tag="ElButton"
                        :route="apis.url_add_warehouse_cargo"
                        type="primary"
                        class="mb-xs ml-sm"
                        @click="add"
                        size="mini">添加货位
            </permission>
            <el-button
                    type="primary"
                    class="mb-xs ml-sm"
                    @click="importShow=true"
                    size="mini">导入货位
            </el-button>
            <permission tag="requestButton"
                        :route="apis.url_warehouse_cargo_export"
                        class="mb-xs ml-sm"
                        v-model="exportDisabled"
                        :request="export_data"
                        :disabled="this.dataTable.length===0">导出
            </permission>
            <el-button type="primary" size="mini" class="ml-sm" @click="bindGoods">绑定货位</el-button>
            <permission tag="ElButton"
                        :route="apis.url_more_status_warehouse_cargo"
                        type="primary"
                        class="mb-xs ml-sm"
                        v-if="this.searchData.status!==''"
                        @click="select_status"
                        :disabled="this.selectId.length===0"
                        size="mini">{{statusName}}
            </permission>
            <permission tag="requestButton"
                        :route="apis.url_more_delete_warehouse_cargo"
                        class="mb-xs ml-sm"
                        :request="select_delete"
                        :disabled="this.selectId.length===0">批量删除
            </permission>
            <request-button req-key="batch_print" @click="batch_print"
                            :disabled="this.selectId.length === 0">打印标签
            </request-button>
        </el-row>
        <data-table
                :data-table="dataTable"
                @edit-data="edit_data"
                @delete-data="delete_data"
                @select-id="select_id"
                ref="data_table"
                :loading="loading"
                :status="this.searchData.status"
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
        <add-form ref="add_form" v-model="addShow"
                  :warehouse-cargo-data="warehouseCargoData"
                  @update-edit="update_edit"
                  @add-data="add_data"></add-form>
        <import-excel v-model="importShow" @files-data="files_data"></import-excel>
        <bind-goods v-model="bindVisible" :select-ids="selectId" :warehouse="searchData.warehouse_id"></bind-goods>
        <export-dialog v-model="visible"></export-dialog>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {
        add_warehouse_cargo,
        warehouse_cargo,
        api_more_status_warehouse_cargo,
        api_more_delete_warehouse_cargo,
        api_lable_data,
        url_more_status_warehouse_cargo,
        url_add_warehouse_cargo,
        url_more_delete_warehouse_cargo,
        api_warehouse_cargo_export,
        url_warehouse_cargo_export
    } from '../../../api/warehouse-cargo';
    import {downloadFile} from '../../../lib/http';

    export default {
        page: {},
        permission: {
            url_add_warehouse_cargo,
            url_more_status_warehouse_cargo,
            url_more_delete_warehouse_cargo,
            url_warehouse_cargo_export
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                searchData: {
                    warehouse_id: 2,
                    warehouse_area_type: 0,
                    code: '',
                    cargo_class_id: '',
                    occupy: '',
                    status: '',
                    sku_num: '',
                    page: 1,
                    pageSize: 50,
                },
                count: 0,
                dataTable: [],
                warehouseCargoData: {
                    cargo_class_id: 2,
                    warehouse_id: '',
                    warehouse_area_type: 0,
                    warehouse_shelf_id: '',
                    add_type: '',
                    cargo_num: '',
                    row_start: '',
                    sku_num: 1,
                    row_end: '',
                    column_start: '',
                    column_end: '',
                },
                loading: false,
                addShow: false,
                importShow: false,
                selectId: [],
                bindVisible: false,
                exportDisabled: false,
                visible: false,
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.loading = true;
                let params = {
                    warehouse_id: this.searchData.warehouse_id,
                    code: this.searchData.code,
                    cargo_class_id: this.searchData.cargo_class_id,
                    occupy: this.searchData.occupy,
                    sku_num: this.searchData.sku_num,
                    page: this.searchData.page,
                    pageSize: this.searchData.pageSize,
                    status: this.searchData.status,
                    warehouse_area_type: this.searchData.warehouse_area_type,
                };
                this.$http(warehouse_cargo, params).then(res => {
                    this.dataTable = res.data;
                    this.count = res.count;
                    this.loading = false;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init();
            },
            search() {
                this.init();
            },
            add() {
                this.warehouseCargoData = {
                    cargo_class_id: '',
                    warehouse_id: this.searchData.warehouse_id,
                    warehouse_area_id: '',
                    warehouse_shelf_id: '',
                    add_type: '',
                    cargo_num: '',
                    row_start: '',
                    row_end: '',
                    sku_num: 1,
                    column_start: '',
                    column_end: '',
                };
                this.addShow = true;
            },
            add_data(val) {
                let data = {
                    cargo_class_id: val.cargo_class_id,
                    warehouse_id: val.warehouse_id,
                    warehouse_area_id: val.warehouse_area_id,
                    warehouse_shelf_id: val.warehouse_shelf_id,
                    add_type: val.add_type,
                    sku_num: val.sku_num,
                };
                if (val.add_type === 1) {
                    this.$set(data, 'cargo_num', val.cargo_num);
                } else if (val.add_type === 2) {
                    this.$set(data, 'row_start', val.row_start);
                    this.$set(data, 'row_end', val.row_end);
                    this.$set(data, 'column_start', val.column_start);
                    this.$set(data, 'column_end', val.column_end);
                }
                return this.$http(add_warehouse_cargo, data).then(res => {
                    if (!!res.fail_num && res.data.length === 0) {
                        this.$message({type: 'error', message: res.message || res});
                        this.$refs.add_form.addShow = false;
                    } else {
                        this.$refs.add_form.addShow = true;
                        res.data.forEach(row => {
                            row.update_time = datef("YYYY-MM-dd HH:mm:ss", Date.parse(new Date) / 1000);
                            this.dataTable.unshift(row);
                            this.count += 1;
                        });
                        this.$message({type: 'success', message: res.message || res});
                        this.addShow = false;
                    }
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                    this.$refs.add_form.addShow = false;
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('apiAddForm', false);
                    }, 200);
                });
            },
            update_edit(data) {
                this.addShow = false;
                this.$refs.add_form.addShow = true;
                this.dataTable.forEach(row => {
                    if (data.id === row.id) {
                        row.update_time = datef("YYYY-MM-dd HH:mm:ss", Date.parse(new Date) / 1000);
                        row.sku_num = data.sku_num;
                        row.cargo_class = data.cargo_class;
                        if (row.occupy_num === '-' && row.sku_num) {
                            row.occupy_num = 0;
                        }
                    }
                });
            },
            edit_data(res) {
                this.warehouseCargoData = res;
                this.addShow = true;
            },
            delete_data() {
                this.count -= 1;
            },
            select_id(data) {
                this.selectId = data;
                console.log('this.selectId', this.selectId);
            },
            select_status() {
                let data = {
                    ids: this.selectId,
                    status: this.searchData.status ? 0 : 1
                };
                this.$http(api_more_status_warehouse_cargo, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.selectId.forEach(row => {
                        let index = this.dataTable.findIndex(item => item.id === row);
                        this.dataTable.splice(index, 1);
                        this.count -= 1;
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            select_delete() {
                let data = {
                    ids: this.selectId,
                };
                return this.$confirm(`您将批量删除货位, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.$http(api_more_delete_warehouse_cargo, data).then(res => {
                        if (res.fail_num !== 0) {
                            this.$message({type: "success", message: res.message || res});
                        }
                        if (res.ids.length > 0) {
                            res.ids.forEach(row => {
                                let index = this.selectId.findIndex(item => item === row);
                                this.selectId.splice(index, 1);
                            })
                        }
                        this.selectId.forEach(row => {
                            let index = this.dataTable.findIndex(item => item.id === row);
                            this.dataTable.splice(index, 1);
                            this.count -= 1;
                        });
                        return Promise.resolve();
                    }).catch(code => {
                        this.$message({message: code.message || code, type: 'error'})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            export_data() {
                let paramsData = {};
                if (this.selectId.length) {
                    paramsData = {
                        ids: this.selectId,
                        export_type: 2
                    }
                } else {
                    paramsData = window.clone(this.searchData);
                    paramsData.ids = '';
                    paramsData.export_type = 1;
                }
                ;
                this.exportDisabled = true;
                return this.$http(api_warehouse_cargo_export, paramsData).then(res => {
                    if (res.jion_queue === 1) {
                        this.$message({type: 'success', message: res.message || res});
                        this.visible = true;
                    } else if (res.status === 1) {
                        let params = {
                            file_code: res.file_code
                        };
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls',
                        })
                    } else {
                        this.$message({type: 'error', message: res.message || res});
                    }
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                }).finally(() => {
                    this.exportDisabled = false;
                });
            },
            files_data(data) {
                data.forEach(res => {
                    this.dataTable.unshift(res);
                    this.count += 1;
                });
            },
            batch_print() {
                let ids = this.selectId;
                this.$http(api_lable_data, {ids: ids}).then(res => {
                    this.$refs.data_table.batchData = res;
                    this.$refs.data_table.batchData.print_data.forEach(row => {
                        this.$set(row, 'print_num', 1);
                    });
                    this.$refs.data_table.printVisible = true;
                    this.$refs.data_table.$refs.preview.get_template(4);
                    if (this.$refs.data_table.batchData.default_temp_id) {
                        this.$nextTick(() => {
                            this.$refs.data_table.$refs.preview.change_print();
                        })
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey(`batch_print`, false);
                    }, 200);
                })
            },
            bindGoods() {
                this.bindVisible = true;
            }
        },
        computed: {
            statusName() {
                return this.searchData.status ? `批量停用` : `批量启用`;
            }
        },
        components: {
            cardSearch: require('./card-search.vue').default,
            dataTable: require('./data-table.vue').default,
            addForm: require('./add-form.vue').default,
            importExcel: require('./import-excel.vue').default,
            bindGoods: require('./bind-goods').default,
            requestButton: require('../../../global-components/request-button.vue').default,
            exportDialog: require('../../report/export-dialog').default,
        }
    }
</script>
