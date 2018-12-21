<template>
    <page-dialog v-model="visible" size="full" @open="open" @close="close" :title="auditInfo.title">
        <el-row class="mb-xs bold-font" v-if="auditInfo.type === 'audit'">
            <span>调出平台：</span>{{auditInfo.channel_name}}
        </el-row>
        <el-table :data="auditData"
                  ref="table"
                  class="scroll-bar"
                  max-height="500"
                  border
                  @selection-change="select"
                  element-loading-text="玩命加载中..."
                  highlight-current-row>
            <el-table-column type="selection"
                             width="35"></el-table-column>
            <el-table-column label="借调单号" inline-template>
                <div> {{row.code}}</div>
            </el-table-column>
            <el-table-column label="创建人" inline-template>
                <div>{{row.creator}}</div>
            </el-table-column>
            <el-table-column label="创建时间" width="120" inline-template>
                <div>{{row.create_time | filterTime}}</div>
            </el-table-column>
            <template v-if="auditInfo.type === 'coordinate'">
                <el-table-column label="审核人" inline-template>
                    <div>{{row.auditor}}</div>
                </el-table-column>
                <el-table-column label="审核时间" width="120" inline-template>
                    <div>{{row.update_time | filterTime}}</div>
                </el-table-column>
            </template>
            <el-table-column label="仓库" inline-template>
                <div>{{row.warehouse_name}}</div>
            </el-table-column>
            <el-table-column label="SKU/SKU别名" inline-template>
                <div>
                    <div>{{row.sku}}</div>
                    <div v-for="item in row.sku_alias">{{item || `--`}}</div>
                </div>
            </el-table-column>
            <el-table-column label="调出平台" inline-template>
                <div>{{row.from_channel_name}}</div>
            </el-table-column>
            <el-table-column label="调入平台" inline-template>
                <div>{{row.to_channel_name}}</div>
            </el-table-column>
            <el-table-column label="调出平台可用库存" inline-template>
                <div>{{row.sku_available_quantity}}</div>
            </el-table-column>
            <el-table-column label="申请借调数量" inline-template>
                <div>{{row.quantity }}</div>
            </el-table-column>
            <el-table-column label="借调原因" inline-template>
                <div>{{row.remark}}</div>
            </el-table-column>
            <el-table-column label="审核批注" v-if="auditInfo.type==='coordinate'" inline-template>
                <div>{{row.reject_reason}}</div>
            </el-table-column>
            <el-table-column label="借调数量" inline-template>
                <integer-input v-model="row.actual_quantity" :min="1"></integer-input>
            </el-table-column>
        </el-table>
        <label-item label="批注：" class="mt-sm full-width">
            <el-input type="textarea" placeholder="请输入批注" :rows="4" v-model="reason"></el-input>
        </label-item>
        <div slot="footer">
            <template v-if="auditInfo.type=== 'audit'">
                <permission tag="requestButton"
                            req-key="api_channel_log_batch_audit"
                            @click="audit"
                            :route="apis.url_channel_log_batch_audit">同意
                </permission>
                <permission tag="requestButton"
                            req-key="api_channel_log_batch_deny"
                            type="default"
                            @click="deny"
                            :route="apis.url_channel_log_batch_deny">不同意
                </permission>
                <permission tag="ElButton"
                            size="mini"
                            type="default"
                            @click="change_auditor"
                            :route="apis.url_channel_log_batch_change_auditor">修改审批人
                </permission>
            </template>
            <template v-if="auditInfo.type=== 'coordinate'">
                <permission tag="requestButton"
                            req-key="api_channel_log_batch_audit"
                            @click="audit"
                            :route="apis.url_coordinate_batch_audit">同意
                </permission>
                <permission tag="requestButton"
                            req-key="api_channel_log_batch_deny"
                            type="default"
                            @click="deny"
                            :route="apis.url_coordinate_batch_deny">不同意
                </permission>
            </template>
            <el-button size="mini" @click.native="visible = false">关闭</el-button>
        </div>
        <change-auditor v-model="auditorChangeVisible"
                        :auditor-list="auditorList"
                        @change="refresh"></change-auditor>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {
        api_auditor_by_channel,
        api_channel_log_batch_audit,
        url_channel_log_batch_audit,
        api_channel_log_batch_deny,
        url_channel_log_batch_deny,
        api_channel_log_batch_change_auditor,
        url_channel_log_batch_change_auditor,
        api_coordinate_batch_audit,
        url_coordinate_batch_audit,
        api_coordinate_batch_deny,
        url_coordinate_batch_deny,
    } from "@/api/warehouse-goods-channel";

    export default {
        permission: {
            url_channel_log_batch_audit,
            url_channel_log_batch_deny,
            url_channel_log_batch_change_auditor,
            url_coordinate_batch_audit,
            url_coordinate_batch_deny,
        },
        data() {
            return {
                visible: false,
                reason: '',
                selectData: [],
                auditorList: [],
                auditorChangeVisible: false,
            }
        },
        filters: {
            filterTime(val) {
                return val ? datef("YYYY-MM-dd HH:mm:ss", val) : "-- --";
            },
        },
        methods: {
            open() {
                this.$nextTick(() => {
                    this.auditData.forEach(row => {
                        this.$set(row, 'actual_quantity', Number(row.quantity));
                        this.$refs.table.toggleRowSelection(row, true);
                    });
                    this.selectData = this.auditData;
                });
            },
            select(selection) {
                this.selectData = selection;
            },
            audit() {
                if (!this.validate(true)) {
                    this.$reqKey('api_channel_log_batch_audit', false);
                    return;
                }
                let data = {
                    detail: this.selectData.map(row => {
                        return {
                            id: row.id,
                            actual_quantity: row.actual_quantity,
                        };
                    }),
                };
                let api;
                if (this.auditInfo.type === 'audit') {//批量审核与协调批量审核区别
                    data.reject_reason = this.reason;
                    api = api_channel_log_batch_audit;
                } else {
                    data.coordinate_remark = this.reason;
                    api = api_coordinate_batch_audit;
                }
                this.$http(api, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.visible = false;
                    this.$emit('search');
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('api_channel_log_batch_audit', false);
                    }, 200);
                });
            },
            deny() {
                if (!this.validate(false)) {
                    this.$reqKey('api_channel_log_batch_deny', false);
                    return;
                }
                let data = {
                    detail: this.selectData.map(row => {
                        return {
                            id: row.id,
                        };
                    })
                };
                let api;
                if (this.auditInfo.type === 'audit') {//批量审核与协调批量审核区别
                    data.reject_reason = this.reason;
                    api = api_channel_log_batch_deny;
                } else {
                    data.coordinate_remark = this.reason;
                    api = api_coordinate_batch_deny;
                }
                this.$http(api, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.visible = false;
                    this.$emit('search');
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('api_channel_log_batch_deny', false);
                    }, 200);
                });
            },
            change_auditor() {
                this.$http(api_auditor_by_channel, {channel_id: this.auditInfo.channel_id}).then(res => {
                    this.auditorList = res;
                    this.auditorChangeVisible = true;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            refresh(params) {//修改审批人，刷新页面
                params.detail = this.selectData.map(row => {
                    return {
                        id: row.id,
                    };
                });
                this.$http(api_channel_log_batch_change_auditor, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.auditorChangeVisible = false;
                    this.visible = false;
                    this.$emit('search');
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('changeAuditor', false);
                    });
                });
            },
            validate(flag) {
                this.reason = this.reason.trim();
                if (!flag) {
                    if (this.reason === '') {
                        this.$message({type: 'error', message: '请输入批注'});
                        return false;
                    }
                    return true;
                } else {
                    if (this.selectData.length === 0) {
                        this.$message({type: 'error', message: '请选择需要审核的借调单'});
                        return false;
                    }
                    return !this.auditData.some((row, index) => {
                        row.actual_quantity = Number(row.actual_quantity);
                        if (isNaN(row.actual_quantity) || row.actual_quantity < 1 ||
                            row.actual_quantity > Number(row.sku_available_quantity) ||
                                row.actual_quantity > Number(row.quantity)) {
                            this.$message({type: 'error', message: `第${index + 1}行数据借调数量为无效输入`});
                            return true;
                        }
                        return false;
                    })
                }
            },
            close() {
                this.reason = '';
                this.selectData = [];
                this.auditorList = [];
            }
        },
        watch: {
            value(val) {
                this.visible = val;
            },
            visible(val) {
                this.$emit('input', val);
            }
        },
        props: {
            value: {},
            auditInfo: {},
            auditData: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
            changeAuditor: require('./change-auditor.vue').default,
        }
    }
</script>