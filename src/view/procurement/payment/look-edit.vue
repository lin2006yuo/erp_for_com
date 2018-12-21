<template>
    <page-dialog class="purchase-look" v-model="visible" @close="close" size="large" :title="title">
        <div class="mt-lg">
            <el-row>
                <el-col :span="10" :offset="2">
                    <div class="row-content">
                        <span>申请付款总额 : </span> <span>{{checkList.currency_code}} {{checkList.apply_amount | filtersPay}}</span>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="row-content">
                        <span>付款状态 : </span> <span> {{checkList.status | filterStatus}}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10" :offset="2">
                    <div class="row-content">
                        <span>供应商 : </span> <span>{{checkList.supplier}}</span>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="row-content">
                        <span>结算方式 : </span> <span>{{checkList.balance_text}}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10" :offset="2">
                    <div class="row-content">
                        <span>申请时间 : </span> <span>{{checkList.create_time_date}}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row v-if="checkList.balance_type !== 12">
                <el-col :span="10" :offset="2">
                    <div class="row-content">
                        <span>采购审核人 : </span> <span>{{checkList.purchaser_audit_name}}</span>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="row-content">
                        <span>采购审核时间 : </span> <span>{{checkList.purchaser_audit_time | fdatetime}}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row v-if="checkList.status ===3 || checkList.status ===4 || checkList.status === -4 || (checkList.status === 5 && checkList.balance_type !== 12) || (checkList.status === 6 && checkList.balance_type !== 12) || (checkList.status === 7 && checkList.balance_type !== 12)">
                <el-col :span="10" :offset="2">
                    <div class="row-content">
                        <span>财务审核人 : </span> <span>{{checkList.finance_audit_name}}</span>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="row-content">
                        <span>财务时间 : </span> <span>{{checkList.finance_audit_time | fdatetime}}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row v-if="checkList.status === -4 || (checkList.status ===5 && checkList.balance_type !== 12) || (checkList.status === 6 && checkList.balance_type !== 12)|| (checkList.status === 7 && checkList.balance_type !== 12)">
                <el-col :span="10" :offset="2">
                    <div class="row-content">
                        <span>财务复核人 : </span> <span>{{checkList.finance_reaudit_name}}</span>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="row-content">
                        <span>财务复核时间 : </span> <span>{{checkList.finance_reaudit_time | fdatetime}}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row v-if="checkList.status === 7">
                <el-col :span="10" :offset="2">
                    <div class="row-content">
                        <span>取消付款人 : </span> <span>{{checkList.cancel_pay_name}}</span>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="row-content">
                        <span>取消付款时间 : </span> <span>{{checkList.cancel_pay_time | fdatetime}}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row v-if="checkList.status === 6">
                <el-col :span="10" :offset="2">
                    <div class="row-content">
                        <span>标记付款人 : </span> <span>{{checkList.mark_pay_name}}</span>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="row-content">
                        <span>付款时间 : </span> <span>{{checkList.mark_pay_time | fdatetime}}</span>
                    </div>
                </el-col>
            </el-row>
            <div class="card-line"></div>
            <el-table :data="checkList.detail" border>
                <el-table-column inline-template label="采购单号" align="center">
                    <div>{{row.purchase_order_code}}</div>
                </el-table-column>
                <el-table-column inline-template label="外部流水号" align="center" min-width="120">
                    <div>{{row.external_number | filterCount}}</div>
                </el-table-column>
                <el-table-column inline-template label="1688账号" align="center">
                    <div>{{row.account_1688 | filterCount}}</div>
                </el-table-column>
                <el-table-column inline-template label="采购单状态" align="center">
                    <div>{{row.purchase_order_status_text}}</div>
                </el-table-column>
                <el-table-column inline-template label="申请付款金额" align="center">
                    <div>{{row.currency_code}} {{row.apply_amount | filtersPay}}</div>
                </el-table-column>
                <el-table-column inline-template label="采购类型" align="center">
                    <div>{{row.purchase_type | typeFilter}}</div>
                </el-table-column>
                <el-table-column inline-template label="采购员" align="center">
                    <div>{{row.purchaser}}</div>
                </el-table-column>
            </el-table>
            <div class="inline mt-lg full-width breakAll" v-if="(checkList.status ===1 && !!checkList.remark)|| (checkList.status ===3 && !!checkList.remark) || (checkList.status === -4 && !!checkList.remark)"><span class="bold-font">批注 : </span> {{checkList.remark}}</div>
            <div class="inline mt-lg full-width breakAll" v-if="checkList.status ===7 && !!checkList.remark"><span class="bold-font">取消付款原因 : </span> {{checkList.remark}}</div>
            <!--常用备注   一直存在页面-->
            <el-card style="position: absolute;right:15px;bottom:55px;z-index: 99999;"
                     v-if="showRemark"
                     class="el_card_remark">
                <div class="remark-sale-look" style="position: inherit;">
                    <label class="remark-sale-header" v-if="isInvalidAudit">审核不通过的原因: </label>
                    <label class="remark-sale-header" v-if="isCancelPay">取消付款的原因: </label>
                    <el-form class="remark-sale-body">
                        <el-form-item>
                            <el-input type="textarea" :maxlength="225" placeholder="请输入原因"
                                      :autosize="{ minRows: 4, maxRows: 6}"  v-model="reason"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="remark-sale-footer">
                        <div class="fr mb-xs">
                            <request-button :request="submit_purchaser" v-if="isInvalidAudit && checkList.status === 0">提交</request-button>
                            <request-button :request="submit_audit" v-if="isInvalidAudit && checkList.status === 2">提交</request-button>
                            <request-button :request="submit_review" v-if="isInvalidAudit && checkList.status === 4">提交</request-button>
                            <request-button :request="submit_cancel" v-if="isCancelPay">提交</request-button>
                            <button class="small-button cancel" type="button" @click="showRemark=false">取消</button>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
        <div slot="footer">
            <div class="inline mb-mini" v-if="isInvalidAudit && checkList.status === 2">
                <permission tag="requestButton"
                            req-key="auditPass"
                            @click.native="audit"
                            :route="apis.url_purchase_apply_audit">审核通过
                </permission>
                <permission tag="requestButton"
                            @click.native="deny"
                            :route="apis.url_purchase_apply_audit">审核不通过
                </permission>
            </div>
            <div class="inline mb-mini" v-if="isInvalidAudit && checkList.status === 4">
                <permission tag="requestButton"
                            req-key="auditApply2"
                            @click.native="audit2"
                            :route="apis.url_purchase_apply_audit2">审核通过
                </permission>
                <permission tag="requestButton"
                            @click.native="deny"
                            :route="apis.url_purchase_apply_audit2">审核不通过
                </permission>
            </div>
            <div class="inline mb-mini" v-if="isInvalidAudit && checkList.status === 0">
                <permission tag="requestButton"
                            req-key="auditApply3"
                            @click.native="audit3"
                            :route="apis.url_purchase_audit_purchaser">审核通过
                </permission>
                <permission tag="requestButton"
                            @click.native="deny"
                            :route="apis.url_purchase_audit_purchaser">审核不通过
                </permission>
            </div>
            <div class="inline mb-mini" v-if="isDoPay">
                <permission tag="requestButton"
                            req-key="markDoPay"
                            @click.native="doPay"
                            :route="apis.url_purchase_apply_mark_payed">标记为已付款
                </permission>
            </div>
            <div class="inline mb-mini" v-if="isCancelPay">
                <el-button size="mini" type="primary" @click.native="cancel_pay">取消付款</el-button>
            </div>
            <el-button size="mini" @click.native="visible = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .purchase-look {
        .audit-reason {
            display: inline-block;
            vertical-align: top;
        }
        .row-content{
            display: flex;
            align-items: center;
            span:first-child{
                display: inline-block;
                width:120px;
                text-align:right;
                padding:6px 5px;
                font-weight: bold;
            }
            span:last-child{
                width: 80%;
            }
        }
        .card-line{
            border-top: 1px solid #dee5ee;
            height: 15px;
            margin-top: 30px;
        }
        .el_card_remark {
            .remark-sale-look {
                overflow-y: hidden;
                width: 190px;
                height: 140px;
                position: absolute;
                top: 67px;
                right: 7px;
                border-radius: 5px;
                background: #fff;
                padding: 0 5px;
                z-index: 999;
                .remark-sale-header {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 25px;
                    padding-left: 10px;
                    padding-top: 5px;
                    background-color: #fff;
                }
                .remark-sale-body {
                    overflow-y: auto;
                    position: absolute;
                    top: 30px;
                    left: 0;
                    right: 0;
                    bottom: 30px;
                    padding: 0 5px;
                }
                .remark-sale-footer {
                    position: absolute;
                    height: 25px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    padding-bottom: 5px;
                    padding-right: 5px;
                    background-color: #fff;
                }
            }
        }
    }
</style>
<script>
    import {
        url_purchase_apply_audit,
        api_purchase_apply_audit,
        url_purchase_apply_audit2,
        api_purchase_apply_audit2,
        url_purchase_apply_mark_payed,
        api_purchase_apply_mark_payed,
        url_purchase_apply_cancel,
        api_purchase_apply_cancel,
        url_purchase_audit_purchaser,
        api_purchase_audit_purchaser

    } from "../../../api/finance-purchase"

    export default {
        permission: {
            url_purchase_apply_audit,
            url_purchase_apply_audit2,
            url_purchase_apply_mark_payed,
            url_purchase_apply_cancel,
            url_purchase_audit_purchaser

        },
        data() {
            return {
                showRemark:false,
                visible: false,
                reason: '',
                auditorList: [],
            }
        },
        filters: {
            filterCount(val){
                return val ===''? '-- --' : val;
            },
            fdatetime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val)
            },
            typeFilter(val) {
                switch (val) {
                    case 0:
                        return "样品";
                        break;
                    case 1:
                        return "采购";
                        break;
                    case 2:
                        return "补货";
                        break;
                }
            },
            filtersPay(val){
                if(Number(val)>0){
                    return Number(val).toFixed(3);
                }
            },
            filterStatus(val){
                switch(val){
                    case 0:
                        return "待采购审核";
                        break;
                    case 1:
                        return "审核不通过";
                        break;
                    case 2:
                        return "待财务审核";
                        break;
                    case 3:
                        return "审核不通过";
                        break;
                    case 4:
                        return "待财务复核";
                        break;
                    case 5:
                        return "待付款";
                        break;
                    case 6:
                        return "已付款";
                        break;
                    case 7:
                        return "取消付款";
                        break;
                    case -1:
                        return "作废";
                        break;
                    case -4:
                        return "审核不通过"
                        break;
                }
            },
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
            audit_cancel(){},
            cancel_pay(){
                this.showRemark = true;
            },
            doPay(){//标记为已付款
                let params = {
                    id: this.checkList.id,
                    remark: this.reason
                };
                this.$http(api_purchase_apply_mark_payed,params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.refresh();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('markDoPay', false);
                    }, 200);
                });
            },
            submit_purchaser(){//采购审核不通过
                this.reason = this.reason.trim();
                if (this.reason === '') {
                    this.$message({type: 'error', message: '请填写原因'});
                    return;
                }
                let params = {
                    status: -1,
                    id: this.checkList.id,
                    remark: this.reason
                };
                this.$http(api_purchase_audit_purchaser, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.refresh();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            submit_audit(){//待财务审核不通过
                this.reason = this.reason.trim();
                if (this.reason === '') {
                    this.$message({type: 'error', message: '请填写原因'});
                    return;
                }
                let params = {
                    status: -1,
                    id: this.checkList.id,
                    remark: this.reason
                };
                this.$http(api_purchase_apply_audit, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.refresh();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            submit_review(){//财务复核不通过
                this.reason = this.reason.trim();
                if (this.reason === '') {
                    this.$message({type: 'error', message: '请填写原因'});
                    return;
                }
                let params = {
                    status: -1,
                    id: this.checkList.id,
                    remark: this.reason
                };
                this.$http(api_purchase_apply_audit2, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.refresh();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            deny() {
                this.showRemark = true;
            },
            audit3() {//采购审核核通过
                let params = {
                    status: 1,
                    id: this.checkList.id,
                    remark: this.reason
                };
                this.$http(api_purchase_audit_purchaser,params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.refresh();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('auditApply3', false);
                    }, 200);
                });
            },
            audit() {//待财务审核通过
                let params = {
                    status: 1,
                    id: this.checkList.id,
                    remark: this.reason
                };
                this.$http(api_purchase_apply_audit,params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.refresh();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('auditPass', false);
                    }, 200);
                });
            },
            audit2() {//财务复核通过
                let params = {
                    status: 1,
                    id: this.checkList.id,
                    remark: this.reason
                };
                this.$http(api_purchase_apply_audit2,params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.refresh();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('auditApply2', false);
                    }, 200);
                });
            },
            submit_cancel() {//取消付款
                this.reason = this.reason.trim();
                if (this.reason === '') {
                    this.$message({type: 'error', message: '请填写原因'});
                    return;
                }
                let params = {
                    id: this.checkList.id,
                    remark: this.reason
                };
                this.$http(api_purchase_apply_cancel, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.refresh();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
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
                if(!val){
                    this.showRemark = false;
                }
            }
        },
        computed:{},
        props: {
            value: {},
            isLook: {},
            isAudit: {},
            lookData: {},
            title: {},
            rowId:[Number,String],
            checkList: {required: true, type: Object,},
            isInvalidAudit: {required: true, type: Boolean},
            isCancelPay:{required: true, type: Boolean},
            isDoPay:{required: true, type: Boolean},
        },
        components: {
            requestButton: require('@/global-components/request-button.vue').default,
            pageDialog: require('@/components/page-dialog.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            card:require('../../../components/card.vue').default,
        }
    }
</script>
