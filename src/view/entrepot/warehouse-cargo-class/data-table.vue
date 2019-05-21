<template>
    <div class="c-data-table">
        <el-table
                class="mb-sm scroll-bar"
                border :data="dataTable"
                highlight-current-row
                v-resize="{height:41}"
                v-loading="loading"
                element-loading-text="玩命加载中...">
            <el-table-column label="排序" type="index"></el-table-column>
            <el-table-column label="货位类型编码" inline-template>
                <div>
                    <ui-tip :content="row.code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="类型名称" inline-template>
                <div>
                    <ui-tip :content="row.name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="仓库" inline-template>
                <div>
                    <ui-tip :content="row.warehouse" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="长*宽*高(CM)" inline-template>
                <div>{{row.length}}*{{row.width}}*{{row.height}}</div>
            </el-table-column>
            <el-table-column label="允许存放最大体积" inline-template>
                <div>
                    <ui-tip :content="row.max_volume" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="体积利用率" inline-template>
                <div>
                    <ui-tip :content="row.rate" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="描述" inline-template>
                <div>
                    <ui-tip :content="row.description" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="状态" inline-template>
                <div>
                    <permission
                            tag="ElSwitch"
                            :route="apis.url_status_warehouse_cargo_class"
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
                                :route="apis.url_look_warehouse_cargo_class"
                                class="operate"
                                @click="look(row)">查看
                    </permission>
                    <permission tag="span"
                                :route="apis.url_look_warehouse_cargo_class">|
                    </permission>
                    <permission tag="span"
                                :route="apis.url_edit_warehouse_cargo_class"
                                class="operate"
                                @click="edit_data(row)">编辑
                    </permission>
                    <permission tag="span"
                                :route="apis.url_edit_warehouse_cargo_class">|
                    </permission>
                    <permission tag="span"
                                :route="apis.url_delete_warehouse_cargo_class"
                                :class="{disabled: row.can_delete === 0}"
                                :title="row.can_delete === 0 ? '货位类型已使用,不可删除!' : ''"
                                class="operate"
                                @click="delete_data(row)">删除
                    </permission>

                </div>
            </el-table-column>
        </el-table>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {
        api_look_warehouse_cargo_class, url_look_warehouse_cargo_class,
        api_edit_warehouse_cargo_class, url_edit_warehouse_cargo_class,
        api_delete_warehouse_cargo_class, url_delete_warehouse_cargo_class,
        api_status_warehouse_cargo_class, url_status_warehouse_cargo_class
    } from '../../../api/warehouse-cargo-class';

    export default {
        permission: {
            url_look_warehouse_cargo_class,
            url_edit_warehouse_cargo_class,
            url_delete_warehouse_cargo_class,
            url_status_warehouse_cargo_class
        },
        data() {
            return {}
        },
        methods: {
            changStatus(row) {
                this.$confirm(`您将更改 ${row.code} 状态，确定进行此操作？`, "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let status = row.status ? 0 : 1;
                    let data = {
                        status: status
                    };
                    this.$http(api_status_warehouse_cargo_class, row.id, data).then(res => {
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
            look(row) {
                this.$http(api_look_warehouse_cargo_class, row.id).then(res => {
                    this.$emit('look-data', res);
                });
            },
            edit_data(row) {
                this.$http(api_look_warehouse_cargo_class, row.id).then(res => {
                    this.$emit('edit-data', res, row.id);
                });
            },
            delete_data(row) {
                this.$confirm(`您将删除 ${row.name}, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_warehouse_cargo_class, row.id).then(res => {
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
        },
        filters: {
            statusFilter(val) {
                return val ? `启用` : `禁用`;
            }
        },
        props: {
            dataTable: {},
            loading: {},
            status: {}
        },
        components: {
            uiTip: require('../../../components/ui-tip.vue').default,
        }
    }
</script>

