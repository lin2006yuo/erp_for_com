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
            <el-table-column label="分区code" inline-template>
                <div>
                    <ui-tip :content="row.code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="分区名称" inline-template>
                <div>
                    <ui-tip :content="row.name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="仓库" inline-template>
                <div>
                    <ui-tip :content="row.warehouse" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="分区功能" inline-template>
                <div>
                    <ui-tip :content="row.warehouse_area_type" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="分区所在楼层" inline-template>
                <div>
                    <ui-tip :content="row.floor_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="货架数(停用/总数)" inline-template min-width="120">
                <div>
                    <span class="operate" @click="open_warehouse_shelf(row,false)">{{row.shelf_disable_count}}</span>&nbsp;/&nbsp;
                    <span class="operate" @click="open_warehouse_shelf(row,true)">{{row.shelf_count}}</span>
                </div>
            </el-table-column>
            <el-table-column label="管理员" inline-template>
                <div>
                    <ui-tip :content="row.operator" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="绑定分类" inline-template>
                <div>
                    <el-popover placement="right"
                                trigger="hover">
                        <table class="template ui-table-head">
                            <tr>
                                <td>
                                    <div v-for="(item,index) in row.category_lists" :key="index">
                                        <span class="titles">{{item.category_name}}</span>
                                    </div>
                                </td>
                            </tr>
                        </table>
                        <span slot="reference">
                                <span class="p-cell">{{row.category_list}}</span>
                            </span>
                    </el-popover>
                </div>
            </el-table-column>
            <el-table-column label="更新时间" inline-template min-width="120">
                <div>{{row.update_time}}</div>
            </el-table-column>
            <el-table-column label="状态" inline-template>
                <div>
                    <permission
                            tag="ElSwitch"
                            :route="apis.url_status_warehouse_area"
                            :key="row.id"
                            :value="!!row.status"
                            on-text="启用"
                            off-text="停用"
                            @change="change_status(row)"></permission>
                </div>
            </el-table-column>
            <el-table-column label="操作" inline-template min-width="120">
                <div>
                    <permission tag="span"
                                :route="apis.url_look_warehouse_area"
                                class="operate"
                                @click="look(row)">查看
                    </permission>
                    <permission tag="span"
                                :route="apis.url_look_warehouse_area">|
                    </permission>
                    <permission tag="span"
                                :route="apis.url_edit_warehouse_area"
                                class="operate"
                                @click="edit_data(row)">编辑
                    </permission>
                    <permission tag="span"
                                :route="apis.url_edit_warehouse_area">|
                    </permission>
                    <permission tag="span"
                                :route="apis.url_delete_warehouse_area"
                                class="operate"
                                :class="{disabled: row.shelf_count > 0}"
                                :title="row.shelf_count > 0?`货架总数大于0,不可删除!` : ``"
                                @click="delete_data(row)">删除
                    </permission>

                </div>
            </el-table-column>
        </el-table>
    </div>
</template>
<style lang="stylus">
    .c-data-table {
        .p-cell {
            display: -webkit-box;
            overflow: hidden;
            white-space: normal !important;
            text-overflow: ellipsis;
            word-wrap: break-word;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }
    }

    .titles {
        display: block;
        text-align: left;
    }
</style>
<script>
    import {
        api_look_warehouse_area, url_look_warehouse_area,
        api_edit_warehouse_area, url_edit_warehouse_area,
        api_delete_warehouse_area, url_delete_warehouse_area,
        api_status_warehouse_area, url_status_warehouse_area,
        api_edit_look_warehouse_area
    } from '../../../api/warehouse-area';

    export default {
        permission: {
            url_look_warehouse_area,
            url_edit_warehouse_area,
            url_delete_warehouse_area,
            url_status_warehouse_area
        },
        data() {
            return {}
        },
        methods: {
            change_status(row) {
                this.$confirm(`您将更改 ${row.code} 状态，确定进行此操作？`, "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let status = row.status ? 0 : 1;
                    console.log("status", status);
                    this.$http(api_status_warehouse_area, row.id, {status: status}).then(res => {
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
                        })
                    })
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消操作"
                    })
                })
            },
            look(row) {
                this.$http(api_look_warehouse_area, row.id).then(res => {
                    this.$emit('look-data', res);
                });
            },
            edit_data(row) {
                this.$http(api_look_warehouse_area, row.id).then(res => {
                    if (res.operator_ids) {
                        let ids = [];
                        res.operator_ids.forEach(item => {
                            ids.push(parseInt(item));
                        });
                        res.operator_ids = ids;
                    }
                    this.$emit('edit-data', res, row.id);
                });
            },
            delete_data(row) {
                this.$confirm(`您将删除 ${row.name}, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_warehouse_area, row.id).then(res => {
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
            open_warehouse_shelf(row, status) {
                let param = {
                    warehouse_id: row.warehouse_id,
                    warehouse_area_id: row.id,
                    status: status ? '' : 0,
                };
                this.$open('/warehouse-shelf', param);

            },
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
            status: {},
            loading: {}
        },
        components: {
            uiTip: require('../../../components/ui-tip.vue').default,
        }
    }
</script>

