<template>
    <page-dialog class="c-third-stock-in-look" v-model="visible" @open="open" @close="close" size="large"
                 :title="title">
        <div>
            <el-row>
                <el-col :span="12">
                    <div class="row-content">
                        <span class="label">虚拟采购单号</span>: <span class="detail">{{lookData.virtual_order_id}}</span>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="row-content">
                        <span class="label">真实采购单号</span>: <span class="detail">{{lookData.real_order_id}}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <div class="row-content">
                        <span class="label">供应商</span>: <span class="detail">{{lookData.virtual_supplier_name}}</span>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="row-content">
                        <span class="label">结算方式</span>: <span class="detail">{{lookData.virtual_balance_type}}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <div class="row-content">
                        <span class="label">采购单状态</span>: <span class="detail">{{lookData.virtual_order_status}}</span>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="row-content">
                        <span class="label">申请时间</span>: <span class="detail">{{lookData.create_time | filterTime}}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <div class="row-content">
                        <span class="label">应付款</span>: <span class="detail">{{lookData.currency_code}} {{lookData.payable | filterNumber}}</span>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="row-content">
                        <span class="label">本次付款</span>: <span class="detail">{{lookData.currency_code}} {{lookData.actual_amount | filterNumber}}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <div class="row-content">
                        <span class="label">审核状态</span>: <span class="detail">{{lookData.review_status}}</span>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="row-content">
                        <span class="label">付款状态</span>: <span class="detail">{{lookData.payment_status}}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" v-if = "isLook">
                    <div class="row-content">
                        <span class="label">审核时间</span>: <span class="detail">{{lookData.review_at | filterTime}}</span>
                    </div>
                </el-col>
                <el-col :span="12" v-if = "isLook">
                    <div class="row-content">
                        <span class="label">推送时间</span>: <span class="detail">{{lookData.pust_time | filterTime}}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" v-if = "isLook">
                    <div class="row-content">
                        <span class="label">付款时间</span>: <span class="detail">{{lookData.finance_payment_time | filterTime}}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" v-if = "isLook">
                    <div class="row-content">
                        <span class="label">批注</span>: <span class="detail">{{lookData.remark}}</span>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div v-if="isAudit">
            <div class="mt-sm">
                <span class="fl inline">*批注：</span>
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
                            @click.native="audit()"
                            :route="apis.url_log_verify">审核通过
                </permission>
                <permission tag="requestButton"
                            req-key="denyApply"
                            type="default"
                            @click="deny"
                            :route="apis.url_log_verify">审核不通过
                </permission>
                <el-button size="mini" @click.native="visible = false">关闭</el-button>
            </div>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .c-third-stock-in-look {
        .audit-reason {
            display: inline-block;
            vertical-align: top;
        }
        .row-content{
            display: flex;
            align-items: center;
            .label{
                display: inline-block;
                width:120px;
                text-align:right;
                padding:6px 5px;
                font-weight: bold;
            }
            .detail{
                width: 80%;
                padding:3px 5px;
            }
        }
    }
</style>
<script>
    import {
        api_log_verify,
        url_log_verify,
    } from "../../../api/purchase";

    export default {
        permission: {
            url_log_verify,
        },
        data() {
            return {
                visible: false,
                reason: '',
                auditorList: [],
            }
        },
        filters: {
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
            filterNumber(val){
                if(Number(val) > 0){
                    return Number(val).toFixed(4);
                }else{
                    return '-- --';
                }
            }
        },
        methods: {
            open() {

            },
            audit() {//审核通过
                let params = {
                    review_status: 1,
                    remark: this.reason
                };
                this.$http(api_log_verify,this.rowId,params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.refresh();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('auditApply', false);
                    }, 200);
                });
            },
            deny() {//审核不通过

                this.reason = this.reason.trim();
                if (this.reason === '') {
                    this.$message({type: 'error', message: '请填写批注'});
                    this.$reqKey('denyApply', false);
                    return;
                }
                let params = {
                    review_status: -1,
                    remark: this.reason
                };
                this.$http(api_log_verify,this.rowId, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.refresh();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    this.$reqKey('denyApply', false);
                }, 200);
            },
            refresh() {//刷新页面
                this.visible = false;
                this.$emit('search');
            },
            close() {// 关闭页面，清除缓存
                this.reason = '';
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
            lookData: {},
            title: {},
            tableData: {
                required: true,
                type: Array
            },
            rowId:[Number,String],
        },
        components: {
            requestButton: require('@/global-components/request-button.vue').default,
            pageDialog: require('@/components/page-dialog.vue').default,
            labelItem: require('@/components/label-item.vue').default,
        }
    }
</script>
