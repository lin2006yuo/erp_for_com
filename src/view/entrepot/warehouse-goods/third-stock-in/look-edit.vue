<template>
    <page-dialog class="c-third-stock-in-look" v-model="visible" @open="open" @close="close" size="large"
                 :title="title">
        <div v-if="isLook">
            <table class="template mt-md">
                <tr>
                    <td width="12.5%" class="bold-font">调入平台</td>
                    <td width="12.5%">{{lookData.to_channel_name}}</td>
                    <td width="12.5%" class="bold-font">调出平台</td>
                    <td width="12.5%">{{lookData.from_channel_name}}</td>
                    <td width="12.5%" class="bold-font">申请借调数量</td>
                    <td width="12.5%">{{lookData.quantity}}</td>
                    <td width="12.5%" class="bold-font">审批借调数量</td>
                    <td width="12.5%">{{lookData.actual_quantity}}</td>
                </tr>
                <tr>
                    <td class="bold-font">创建人</td>
                    <td>{{lookData.creator_name}}</td>
                    <td class="bold-font">审批人</td>
                    <td>{{lookData.auditor_name}}</td>
                    <td class="bold-font">协调人</td>
                    <td>{{lookData.coordinator_name}}</td>
                    <td class="bold-font">仓库</td>
                    <td>{{lookData.warehouse_name}}</td>
                </tr>
                <tr>
                    <td class="bold-font">创建时间</td>
                    <td>{{lookData.create_time | filterTime}}</td>
                    <td class="bold-font">审批时间</td>
                    <td>{{lookData.update_time | filterTime}}</td>
                    <td class="bold-font">协调时间</td>
                    <td>{{lookData.coordinate_time | filterTime}}</td>
                    <td class="bold-font">状态</td>
                    <td>{{lookData.status_text}}</td>
                </tr>
                <tr>
                    <td class="bold-font">借调原因</td>
                    <td :colspan="7">{{lookData.remark}}</td>
                </tr>
                <tr>
                    <td class="bold-font">审核批注</td>
                    <td :colspan="7">{{lookData.reject_reason}}</td>
                </tr>
                <tr>
                    <td class="bold-font">协调批注</td>
                    <td :colspan="7">{{lookData.coordinate_remark}}</td>
                </tr>
            </table>
        </div>
        <div v-else>
            <el-row>
                <el-col :span="6">
                    <label-item label="创建人：">
                        <span>{{lookData.creator_name}}</span>
                    </label-item>
                </el-col>
                <el-col :span="9">
                    <label-item label="创建时间：">
                        <span>{{lookData.create_time | filterTime}}</span>
                    </label-item>
                </el-col>
                <el-col :span="9">
                    <label-item label="仓库：">
                        <span>{{lookData.warehouse_name}}</span>
                    </label-item>
                </el-col>
            </el-row>
            <table class="template mt-sm">
                <tr>
                    <th width="10%">SKU</th>
                    <th width="40%">产品名称</th>
                    <th width="10%">调入平台</th>
                    <th width="10%">调出平台</th>
                    <th width="10%">调出平台可用库存</th>
                    <th width="10%">申请借调数量</th>
                    <th width="10%"><span class="red">*</span>借调数量</th>
                </tr>
                <tr>
                    <td>
                        <div>{{lookData.sku}}</div>
                        <div v-for="item in lookData.sku_alias">{{item || `--`}}</div>
                    </td>
                    <td>{{lookData.goods_name}}</td>
                    <td>{{lookData.to_channel_name}}</td>
                    <td>{{lookData.from_channel_name}}</td>
                    <td>{{lookData.sku_available_quantity}}</td>
                    <td>{{lookData.quantity}}</td>
                    <td>
                        <integer-input v-model="lookData.actual_quantity" :min="0"></integer-input>
                    </td>
                </tr>
                <tr>
                    <td><span class="bold-font">借调原因</span></td>
                    <td :colspan="6">{{lookData.remark}}</td>
                </tr>
                <tr v-if="isCoordinate">
                    <td class="bold-font">
                        审核批注
                    </td>
                    <td>{{lookData.reject_reason}}</td>
                    <td class="bold-font">审核人</td>
                    <td>{{lookData.auditor_name}}</td>
                    <td class="bold-font">审核时间</td>
                    <td :colspan="2">{{lookData.update_time | filterTime}}</td>
                </tr>
            </table>
            <div class="mt-sm">
                <span class="fl inline">批注：</span>
                <el-input class="audit-reason" type="textarea" v-model="reason" placeholder="请输入内容"></el-input>
            </div>

        </div>
        <div slot="footer">
            <div v-if="isLook">
                <el-button size="mini" @click.native="visible = false">关闭</el-button>
            </div>
            <div v-if="isAudit">
                <permission tag="requestButton"
                            req-key="auditApply"
                            @click="audit"
                            :route="apis.url_channel_log_audit">同意
                </permission>
                <permission tag="requestButton"
                            req-key="denyApply"
                            type="default"
                            @click="deny"
                            :route="apis.url_channel_log_deny">不同意
                </permission>
                <permission tag="ElButton"
                            @click="change_auditor"
                            :route="apis.url_auditor_by_channel">修改审批人
                </permission>
                <el-button size="mini" @click.native="visible = false">关闭</el-button>
            </div>
            <div v-if="isCoordinate">
                <permission tag="requestButton"
                            req-key="auditApply"
                            @click="audit"
                            :route="apis.url_coordinate_audit">同意
                </permission>
                <permission tag="requestButton"
                            req-key="denyApply"
                            type="default"
                            @click="deny"
                            :route="apis.url_coordinate_deny">不同意
                </permission>
                <el-button size="mini" @click.native="visible = false">关闭</el-button>
            </div>
        </div>
        <change-auditor v-model="auditorChangeVisible"
                        :auditor-list="auditorList"
                        @change="refresh"></change-auditor>
    </page-dialog>
</template>
<style lang="stylus">
    .c-third-stock-in-look {
        .audit-reason {
            display: inline-block;
            vertical-align: top;
        }
    }
</style>
<script>
    import {
        api_channel_log_audit,
        api_channel_log_deny,
        api_auditor_by_channel,
        api_channel_log_change_auditor,
        api_coordinate_audit,
        api_coordinate_deny,
        url_channel_log_audit,
        url_channel_log_deny,
        url_auditor_by_channel,
        url_coordinate_audit,
        url_coordinate_deny,
    } from "@/api/warehouse-goods-channel";

    export default {
        permission: {
            url_channel_log_audit,
            url_channel_log_deny,
            url_auditor_by_channel,
            url_coordinate_audit,
            url_coordinate_deny,
        },
        data() {
            return {
                visible: false,
                reason: '',
                auditorList: [],
                auditorChangeVisible: false,
            }
        },
        filters: {
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
        },
        methods: {
            open() {
            },
            audit() {//同意
                this.reason = this.reason.trim();
                let quantity = Number(this.lookData.actual_quantity);
                if (quantity === 0 || quantity > Number(this.lookData.quantity) || quantity > Number(this.lookData.sku_available_quantity)) {
                    this.$message({type: 'error', message: '请输入有效的借调数量'});
                    this.$reqKey('auditApply', false);
                    return;
                }
                let params = {
                    id: this.lookData.id,
                    actual_quantity: quantity,
                };
                let api;
                if (this.isCoordinate) {
                    api = api_coordinate_audit;
                    params.coordinate_remark = this.reason;
                } else {
                    api = api_channel_log_audit;
                    params.reject_reason = this.reason;
                }
                this.$http(api, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.visible = false;
                    this.$emit('search');
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('auditApply', false);
                    }, 200);
                });
            },
            deny() {//不同意
                this.reason = this.reason.trim();
                if (this.reason === '') {
                    this.$message({type: 'error', message: '请填写批注'});
                    this.$reqKey('denyApply', false);
                    return;
                }
                let params = {
                    id: this.lookData.id,
                };
                let api;
                if (this.isCoordinate) {
                    api = api_coordinate_deny;
                    params.coordinate_remark = this.reason;
                } else {
                    api = api_channel_log_deny;
                    params.reject_reason = this.reason;
                }
                this.$http(api, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.visible = false;
                    this.$emit('search');
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    this.$reqKey('denyApply', false);
                }, 200);
            },
            change_auditor() {
                this.$http(api_auditor_by_channel, {channel_id: this.lookData.from_channel_id}).then(res => {
                    this.auditorList = res;
                    this.auditorChangeVisible = true;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            refresh(params) {//修改审批人，刷新页面
                params.id = this.lookData.id;
                this.$http(api_channel_log_change_auditor, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.auditorChangeVisible = false;
                    this.visible = false;
                    this.$emit('search');
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('changeAuditor', false);
                    })
                });
            },
            close() {// 关闭页面，清除缓存
                this.reason = '';
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
            isLook: {},
            isAudit: {},
            isCoordinate: {},
            lookData: {},
            title: {},
        },
        components: {
            requestButton: require('@/global-components/request-button.vue').default,
            pageDialog: require('@/components/page-dialog.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
            changeAuditor: require('./change-auditor.vue').default,
        }
    }
</script>