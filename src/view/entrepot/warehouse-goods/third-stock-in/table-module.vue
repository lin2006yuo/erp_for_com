<template>
    <page class="c-third-stock-in-table">
        <el-row class="mb-xs">
            <permission tag="ElButton" type="primary" size="mini" :route="apis.url_channel_log_read"
                        @click.native="batch_audit">批量审核
            </permission>
            <permission tag="ElButton" type="primary" size="mini" :route="apis.url_channel_log_batch_audit"
                        @click.native="batch_coordination_audit">批量协调审核
            </permission>
        </el-row>
        <el-table :data="tableData"
                  class="mt-xs scroll-bar"
                  v-resize="{height: 41}"
                  @selection-change="select"
                  element-loading-text="玩命加载中"
                  highlight-current-row
                  v-loading="loading">
            <el-table-column type="selection"
                             :selectable="selectable"
                             width="35"></el-table-column>
            <el-table-column label="借调单号" inline-template>
                <div> {{row.code}}</div>
            </el-table-column>
            <el-table-column label="SKU/SKU别名" inline-template>
                <div>
                    <div>{{row.sku}}</div>
                    <div v-for="item in row.sku_alias">{{item || `--`}}</div>
                </div>
            </el-table-column>
            <el-table-column min-width="180" label="产品名称" inline-template>
                <div>{{row.goods_name}}</div>
            </el-table-column>
            <el-table-column label="仓库" inline-template>
                <div>{{row.warehouse_name}}</div>
            </el-table-column>
            <el-table-column width="80" label="调入平台" inline-template>
                <div>{{row.to_channel_name}}</div>
            </el-table-column>
            <el-table-column width="80" label="调出平台" inline-template>
                <div>{{row.from_channel_name}}</div>
            </el-table-column>
            <el-table-column label="申请数量" inline-template>
                <div>{{row.quantity }}</div>
            </el-table-column>
            <el-table-column label="审批数量" inline-template>
                <div>{{row.actual_quantity || '--'}}</div>
            </el-table-column>
            <el-table-column width="80" label="创建人" inline-template>
                <div>{{row.creator}}</div>
            </el-table-column>
            <el-table-column width="80" label="审核人" inline-template>
                <div>{{row.auditor || '--'}}</div>
            </el-table-column>
            <el-table-column width="80" label="协调人" inline-template>
                <div>{{row.coordinator || '--'}}</div>
            </el-table-column>
            <el-table-column min-width="100" label="提交日期" inline-template>
                <div>{{row.create_time | filterTime}}</div>
            </el-table-column>
            <el-table-column width="80" label="状态" inline-template>
                <div>{{row.status_text}}</div>
            </el-table-column>
            <el-table-column label="操作" inline-template>
                <trends-select @trigger="action(row, $event)"
                               :selects="m_option(row)"
                               type="primary">
                </trends-select>
            </el-table-column>
        </el-table>

        <el-pagination
                class="t-right mt-sm"
                @size-change="$listeners['handle-size-change']"
                @current-change="$listeners['handle-current-change']"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <look-edit v-model="lookVisible"
                   :look-data="lookData"
                   @search="$listeners['search']"
                   :title="title"
                   :is-look="isLook"
                   :is-coordinate="isCoordinate"
                   :is-audit="isAudit"></look-edit>
        <batch-audit v-model="batchAuditVisible"
                     @search="$listeners['search']"
                     :audit-info="auditInfo"
                     :audit-data="auditData"></batch-audit>
    </page>
</template>

<style lang="stylus">

</style>

<script>
    import {
        api_channel_log_read,
        url_channel_log_read,
        url_channel_log_audit,
        url_coordinate_audit,
        url_channel_log_batch_audit,
    } from "@/api/warehouse-goods-channel";

    export default {
        permission: {
            url_channel_log_read,
            url_channel_log_audit,
            url_coordinate_audit,
            url_channel_log_batch_audit,
        },
        data() {
            return {
                lookVisible: false,
                isLook: false,
                isAudit: false,
                isCoordinate: false,
                lookData: {},
                title: '',
                selectData: [],
                auditData: [],
                operateButtons: [// 操作下拉框
                    {
                        label: '查看', apis: url_channel_log_read,
                        action: (row) => {
                            this.lookData = {};
                            this.$http(api_channel_log_read, row.id).then(res => {
                                this.lookData = res;
                                this.isLook = true;
                                this.isAudit = false;
                                this.isCoordinate = false;
                                this.lookVisible = true;
                                this.title = `查看库存借调单号：${row.code}`
                            }).catch(code => {
                                this.$message({type: 'error', message: code.message || code});
                            });
                        }
                    },
                    {
                        label: '审核', apis: url_channel_log_audit,
                        action: (row) => {
                            this.lookData = {};
                            this.$http(api_channel_log_read, row.id).then(res => {
                                this.lookData = res;
                                this.isLook = false;
                                this.isCoordinate = false;
                                this.isAudit = true;
                                this.lookVisible = true;
                                this.title = `审核库存借调单号：${row.code}`
                            }).catch(code => {
                                this.$message({type: 'error', message: code.message || code});
                            });
                        }
                    },
                    {
                        label: '协调',
                        apis: url_coordinate_audit,
                        action: (row) => {
                            this.lookData = {};
                            this.$http(api_channel_log_read, row.id).then(res => {
                                this.lookData = res;
                                this.isLook = false;
                                this.isAudit = false;
                                this.isCoordinate = true;
                                this.lookVisible = true;
                                this.title = `协调审核库存借调单号：${row.code}`
                            }).catch(code => {
                                this.$message({type: 'error', message: code.message || code});
                            });
                        }
                    },
                ],
                auditInfo: {
                    channel_name: '',
                },
                batchAuditVisible: false,
            }
        },
        filters: {
            filterTime(val) {
                return val ? datef("YYYY-MM-dd HH:mm:ss", val) : "-- --";
            },
        },
        methods: {
            action(row, act) {
                console.log(act);
                act.action.call(this, row);
            },
            selectable(row) {
                return row.status === 0 || row.status === 2;
            },
            select(selection) {
                this.selectData = clone(selection);
            },
            m_option(row) {
                return row.operateButtons.filter(res => {
                    return this.$hasPermission(res.apis);
                });
            },
            batch_audit() {
                let from_channel_id, audit_id;
                this.auditData = clone(this.selectData).filter(row => row.status === 0);
                if (this.auditData.length === 0) {
                    this.$message({type: 'error', message: '请选择要批量审核的待审核借调单'});
                    return;
                }
                let flag = this.auditData.some((row, index) => {
                    this.$set(row, 'actual_quantity', row.quantity);
                    if (index === 0) {
                        from_channel_id = row.from_channel_id;
                        audit_id = row.audit_id;
                        return false;
                    } else {
                        if (row.from_channel_id !== from_channel_id || row.audit_id !== audit_id) {
                            this.$message({type: 'error', message: '只有调出平台和审批人都一致的借调单能批量审批'});
                            return true;
                        }
                        return false;
                    }
                });
                if (flag) {
                    return;
                }
                this.auditInfo = {
                    title: '批量审批',
                    channel_name: this.selectData[0].from_channel_name,
                    channel_id: this.selectData[0].from_channel_id,
                    type: 'audit',
                };
                this.batchAuditVisible = true;
            },
            batch_coordination_audit() {
                this.auditData = clone(this.selectData).filter(row => row.status === 2);
                if (this.auditData.length === 0) {
                    this.$message({type: 'error', message: '请选择要批量协调审核的待协调审核借调单'});
                    return;
                }
                this.auditInfo = {
                    title: '批量协调审批',
                    type: 'coordinate',
                };
                this.batchAuditVisible = true;
            }
        },
        watch: {
            tableData(val) {
                this.selectData = [];
                val.forEach(row => {
                    switch (row.status) {
                        case 0:
                            this.$set(row, 'operateButtons', this.operateButtons.slice(0, 2));
                            return;
                        case 1:
                        case 4:
                        case 3:
                            this.$set(row, 'operateButtons', this.operateButtons.slice(0, 1));
                            return;
                        case 2:
                            this.$set(row, 'operateButtons', this.operateButtons.slice(0, 1).concat([{
                                label: '协调',
                                apis: url_coordinate_audit,
                                action: (row) => {
                                    this.lookData = {};
                                    this.$http(api_channel_log_read, row.id).then(res => {
                                        this.lookData = res;
                                        this.isLook = false;
                                        this.isAudit = false;
                                        this.isCoordinate = true;
                                        this.lookVisible = true;
                                        this.title = `协调审核库存借调单号：${row.code}`
                                    }).catch(code => {
                                        this.$message({type: 'error', message: code.message || code});
                                    });
                                }
                            }]));
                            return;
                    }
                });
            }
        },
        props: {
            tableData: {},
            loading: {},
            searchData: {},
            total: {},
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default,
            trendsSelect: require('@/components/trends-select.vue').default,
            lookEdit: require('./look-edit.vue').default,
            batchAudit: require('./batch-audit.vue').default,
        }
    }
</script>
