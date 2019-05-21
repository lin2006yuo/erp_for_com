<template>
    <page class="p-allocation-box">
        <label-item label="请选择仓库：" class="mb-xs mt-sm">
            <super-select v-model="searchData.warehouse_id" class="inline width-sm"
                          :options="warehouseList"
                          storage-key="allocationBoxWarehouse"
                          @change="select_warehouse"></super-select>
            <!--<el-select v-model="searchData.warehouse_id" class="inline width-sm"
                       @change="select_warehouse">
                <el-option
                        :key="item.value"
                        v-for="item in warehouseList"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>-->
        </label-item>
        <el-row class="mt-xs mb-xs">
            <permission tag="ElButton" type="primary" size="mini"
                        @click="add_box"
                        :route="apis.url_allocation_box_add">添加箱子
            </permission>
        </el-row>
        <el-table :data="boxList"
                  class="scroll-bar"
                  v-loading="loading"
                  v-resize="{height: 40}"
                  element-loading-text="玩命加载中"
                  highlight-current-row border>
            <!--@selection-change="handle_selection_change"-->
            <!--<el-table-column type="selection"></el-table-column>-->
            <el-table-column type="index" width="35"></el-table-column>
            <el-table-column label="箱子尺寸" inline-template>
                <div>{{`${row.length}*${row.width}*${row.height}`}}</div>
            </el-table-column>
            <el-table-column label="仓库" inline-template>
                <div>{{row.warehouse}}</div>
            </el-table-column>
            <el-table-column label="状态" inline-template>
                <div>
                    <permission
                            tag="ElSwitch"
                            :route="apis.url_allocation_box_status"
                            :key="row.id"
                            :value="row.status"
                            on-text="启用"
                            off-text="停用"
                            @change="change_status(row)"></permission>
                </div>
            </el-table-column>
            <el-table-column label="创建人" inline-template>
                <div>{{row.creator}}</div>
            </el-table-column>
            <el-table-column label="创建时间" inline-template>
                <div>{{row.create_time}}</div>
            </el-table-column>
            <el-table-column label="更新时间" inline-template>
                <div>{{row.update_time}}</div>
            </el-table-column>
            <el-table-column label="操作" inline-template>
                <div>
                    <permission tag="span" class="operate" @click="edit_box(row)"
                                :route="apis.url_allocation_box_edit">修改
                    </permission>
                    <permission tag="span" :route="apis.url_allocation_box_edit">&nbsp;|&nbsp;</permission>
                    <permission tag="span" class="operate" @click="delete_box(row)"
                                :route="apis.url_allocation_box_delete">删除
                    </permission>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="t-right"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <add-edit v-model="addVisible" :trend-action="trendAction"
                  :warehouse-list="warehouseList"
                  @search="init"
                  :edit-data="editData"></add-edit>
    </page>
</template>

<style lang="stylus">

</style>

<script>
    import {
        api_allocation_box_list, api_allocation_box_status, api_allocation_box_delete,
        url_allocation_box_add, url_allocation_box_edit, url_allocation_box_delete, url_allocation_box_status
    } from "@/api/allocation-box";
    import {api_warehous_local} from "@/api/entrepot-picking";

    export default {
        permission: {
            url_allocation_box_add,
            url_allocation_box_edit,
            url_allocation_box_delete,
            url_allocation_box_status,
        },
        page: {
            devinfo: {
                frontEnd: '张志勇',
                backEnd: '翟雪莉',
                createTime: '2018-12-07',
                updateTime: '2018-12-07',
            }
        },
        data() {
            return {
                searchData: {
                    warehouse_id: '',
                    page: 1,
                    pageSize: 20,
                },
                warehouseList: [],
                boxList: [],
                selectedBox: [],
                total: 0,
                loading: false,
                trendAction: {},
                editData: {
                    length: '',
                    width: '',
                    height: '',
                    status: 1,
                    warehouse_id: '',
                },
                addVisible: false,
            };
        },
        refresh() {
            this.init();
        },
        mounted() {
            this.init_warehouse();
        },
        filters: {
            statusFilter(val) {
                switch (val) {
                    case 0:
                        return '禁用';
                    case 1:
                        return '启用';
                }
            }
        },
        methods: {
            init_warehouse() {
                this.$http(api_warehous_local).then(res => {
                    this.warehouseList = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                    if (this.warehouseList.length > 0) {
                        this.searchData.warehouse_id = this.warehouseList[0].value;
                    } else {
                        this.searchData.warehouse_id = 2;
                    }
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            init() {
                this.loading = true;
                this.$http(api_allocation_box_list, this.searchData).then(res => {
                    this.boxList = res.data;
                    this.boxList.forEach(row => {
                        row.status = !!row.status;
                    });
                    this.total = res.count;
                }).catch(code => {
                    this.clean_table();
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    this.loading = false;
                })
            },
            clean_table() {
              this.boxList = [];
              this.total = 0;
            },
            select_warehouse() {
                this.init();
            },
            add_box() {
                this.trendAction = {
                    title: '添加箱子',
                    type: 'add',
                };
                this.editData = {
                    length: 0,
                    width: 0,
                    height: 0,
                    status: 1,
                    warehouse_id: this.searchData.warehouse_id,
                };
                this.addVisible = true;
            },
            edit_box(row) {
                this.trendAction = {
                    title: '修改箱子',
                    type: 'edit',
                    id: row.id,
                };
                this.editData = {
                    length: row.length.toString(),
                    width: row.width.toString(),
                    height: row.height.toString(),
                    status: row.status ? 1 : 0,
                    warehouse_id: row.warehouse_id,
                };
                this.addVisible = true;
            },
            delete_box(row) {
                this.$confirm(`您将删除箱子${row.id}，确定此操作吗？`, '提示', {
                    type: 'warning',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    this.$http(api_allocation_box_delete, row.id).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        this.init();
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    });
                }).catch(() => {
                    this.$message({type: 'info', message: '已取消'});
                });
            },
            change_status(row) {
                this.$confirm(`您将更改箱子${row.id}状态，确定此操作吗？`, '提示', {
                    type: 'warning',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    let data = {
                        status: row.status ? 0 : 1,
                    };
                    this.$http(api_allocation_box_status, row.id, data).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        this.init();
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    });
                }).catch(() => {
                    this.$message({type: 'info', message: '已取消'});
                });
            },
            handle_selection_change(val) {
                this.selectedBox = val;
            },
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init();
            }

        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            addEdit: require('./add-edit.vue').default,
        }
    }
</script>
