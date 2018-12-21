<template>
    <div class="c-data-table">
        <el-table
                class="mb-sm scroll-bar"
                border :data="dataTable"
                highlight-current-row
                v-resize="{height:41}"
                v-loading="loading"
                @selection-change="handleSelectionChange"
                element-loading-text="玩命加载中...">
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="排序" type="index"></el-table-column>
            <el-table-column label="货位号" inline-template>
                <div>
                    <ui-tip :content="row.code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="货位类型" inline-template>
                <div>
                    <ui-tip :content="row.cargo_class" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="分区功能" inline-template>
                <div>
                    <ui-tip :content="row.warehouse_area_type" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="SKU品种数/已占用数" inline-template min-width="120">
                <div>{{row.sku_num}}/{{row.occupy_num}}</div>
            </el-table-column>
            <el-table-column label="商品数量（当前数/冻结数）" inline-template min-width="120">
                <div>{{row.goods_quantity}}/{{row.hold_quantity}}</div>
            </el-table-column>
            <el-table-column label="状态" inline-template>
                <div>
                    <permission
                            tag="ElSwitch"
                            :route="apis.url_status_warehouse_cargo"
                            :key="row.id"
                            :value="!!row.status"
                            on-text="启用"
                            off-text="停用"
                            @change="changStatus(row)"></permission>
                </div>
            </el-table-column>
            <el-table-column label="更新时间" inline-template min-width="150">
                <div>{{row.update_time}}</div>
            </el-table-column>
            <el-table-column label="操作" inline-template>
                <div>
                    <permission tag="span"
                                :route="apis.url_edit_warehouse_cargo"
                                class="operate"
                                @click="edit_data(row)">编辑
                    </permission>
                    <permission tag="span"
                                :route="apis.url_delete_warehouse_cargo">|
                    </permission>

                    <permission tag="span"
                                :route="apis.url_delete_warehouse_cargo"
                                :class="{disabled: row.can_delete === 0}"
                                :title="row.can_delete === 0 ? '货位已占用,不可删除!' : ''"
                                class="operate"
                                @click="delete_data(row)">删除
                    </permission>
                    <permission tag="span"
                                :route="apis.url_delete_warehouse_cargo">|
                    </permission>
                    <span class="operate" @click="print(row)">打印标签</span>
                </div>
            </el-table-column>
        </el-table>
        <preview v-model="printVisible"
                 :batch-data="batchData"
                 :column-height="400"
                 ref="preview">
        </preview>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {
        api_delete_warehouse_cargo, api_status_warehouse_cargo, api_lable_data,
        url_status_warehouse_cargo, url_delete_warehouse_cargo, api_look_warehouse_cargo, api_edit_warehouse_cargo,
        url_edit_warehouse_cargo
    } from '../../../api/warehouse-cargo';

    export default {
        permission: {
            url_delete_warehouse_cargo,
            url_status_warehouse_cargo,
            url_edit_warehouse_cargo
        },
        data() {
            return {
                selectIds: [],
                printVisible: false,
                batchData: {}
            }
        },
        methods: {
            edit_data(row) {
                this.$http(api_look_warehouse_cargo, row.id).then(res => {
                    this.$set(res, 'edit', true);
                    this.$emit('edit-data', res);
                })
            },
            handleSelectionChange(val) {
                this.selectIds = val.map(res => {
                    return res.id;
                });
                this.$emit('select-id', this.selectIds);
            },
            changStatus(row) {
                this.$confirm(`您将更改 ${row.code} 状态，确定进行此操作？`, "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let status = row.status ? 0 : 1;
                    this.$http(api_status_warehouse_cargo, row.id, {status: status}).then(res => {
                        this.$message({
                            type: "success",
                            message: res.message
                        });
                        if (this.status === '') {
                            row.status = !row.status;
                            row.update_time = datef("YYYY-MM-dd HH:mm:ss", Date.parse(new Date) / 1000);
                        } else {
                            let index = this.dataTable.findIndex(item => item.id === row.id);
                            this.dataTable.splice(index, 1);
                            this.$emit('delete-data');
                        }
                    }).catch(code => {
                        this.$message({
                            type: "error",
                            message: code.message
                        });
                    });
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消操作"
                    });
                });
            },
            delete_data(row) {
                this.$confirm(`您将删除 ${row.code}, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_warehouse_cargo, row.id).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        let index = this.dataTable.findIndex(item => item.id === row.id);
                        this.dataTable.splice(index, 1);
                        this.$emit('delete-data');
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
            print(row) {
                let ids = [];
                ids.push(row.id);
                this.$http(api_lable_data, {ids: ids}).then(res => {
                    this.batchData = res;
                    this.batchData.print_data.forEach(row => {
                        this.$set(row, 'print_num', 1);
                    });
                    this.printVisible = true;
                    this.$refs.preview.get_template(4);
                    if (this.batchData.default_temp_id) {
                        this.$nextTick(() => {
                            this.$refs.preview.change_print();
                        })
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })
            }
        },
        filters: {
            statusFilter(val) {
                return val ? `启用` : `禁用`;
            }
        },
        props: {
            dataTable: {
                required: true,
                type: Array,
            },
            loading: {},
            status: {}
        },
        components: {
            uiTip: require('../../../components/ui-tip.vue').default,
            preview: require('./preview.vue').default
        }
    }
</script>

