<template>
    <div class="purchase-apply-data-table">
        <div class="mb-sm mt-sm">
            <!--导出按钮-->
            <permission tag="trendsSelect"
                        class="inline ml-xs"
                        type="primary"
                        :route="apis.url_purchase_apply_export"
                        :selects="partAllOptions"
                        @trigger="export_excel">
            </permission>
            <!--还原上一步付款状态-->
            <!--6: 已付款  8:部分付款 可见-->
            <permission tag="ElButton"
                        :disabled="selects.length ===0"
                        class="inline ml-xs"
                        :route="apis.url_purchase_apply_return_mark_payed"
                        v-if="paymentStatus ===6 || paymentStatus ===8"
                        type="primary"
                        @click="restore_status"
                        size="mini">还原上一步付款状态
            </permission>
            <!--0: 待采购审核  2:待财务审核 4:待采购排款可见-->
            <el-button type="primary"
                       size="mini"
                       @click="batch_audit_pass"
                       :disabled="selects.length === 0"
                       class="inline ml-xs"
                       v-if="paymentStatus ===0 || paymentStatus ===2 || paymentStatus ===4">批量审核通过
            </el-button>
            <request-button @click="batch_no_pass"
                            class="inline ml-xs"
                            v-if="paymentStatus === 0 || paymentStatus === 2 || paymentStatus === 4"
                            :disabled="selects.length === 0">批量审核不通过
            </request-button>
            <!--付款状态等于5(待付款)按钮可见-->
            <permission tag="request-button"
                        :route="apis.url_finance_list"
                        class="inline ml-xs"
                        v-if="paymentStatus === 5 || paymentStatus === 8"
                        :mintime="200"
                        :disabled="selects.length === 0"
                        req-key="url_finance_list"
                        @click="mark_all_down">线下标记付款
            </permission>
            <permission tag="request-button"
                        :route="apis.url_finance_online_payment"
                        class="inline ml-xs"
                        v-if="paymentStatus === 5"
                        :mintime="200"
                        :timeout="60000"
                        :disabled="selects.length === 0"
                        req-key="url_finance_online_payment"
                        @click="mark_online">线上标记付款
            </permission>
            <permission tag="ElButton"
                        :route="apis.url_purchase_apply_cancel"
                        class="inline ml-xs"
                        v-if="paymentStatus === 5"
                        type="primary"
                        size="mini"
                        :mintime="200"
                        :disabled="selects.length === 0"
                        @click="all_no_pass">批量取消付款
            </permission>
            <permission tag="ElButton"
                        :route="apis.url_purchase_export_fuyou"
                        class="inline ml-xs"
                        :mintime="200"
                        type="primary"
                        size="mini"
                        :disabled="selects.length === 0"
                        @click="export_fuyou">导出至富友
            </permission>
            <permission tag="request-button"
                        class="inline ml-xs"
                        :route="apis.url_purchase_apply_balance_type"
                        :mintime="200"
                        :disabled="selects.length === 0"
                        v-if="paymentStatus === 0 || paymentStatus === 2 || paymentStatus === 4 || paymentStatus === 5"
                        @click.native="batch_pay">批量修改结算方式
            </permission>
            <permission tag="request-button"
                        class="inline ml-xs"
                        :route="apis.url_purchase_apply_upload_batch_payment_images"
                        :mintime="200"
                        v-if="paymentStatus === 5 || paymentStatus === 6 || paymentStatus === 8"
                        @click.native="batch_upload_image">上传付款回单
            </permission>
            <div class="fr mt-sm red bold-font">
                <div><span>申请付款总额：CNY {{payTotal.CNY | pay_filter}}<span class="ml-md">USD </span>{{payTotal.USD | pay_filter}}</span>
                    <span class="ml-lg">已付款金额：CNY {{paidTotal.CNY | pay_filter}}<span class="ml-md">USD </span>{{paidTotal.USD | pay_filter}}</span>
                </div>

            </div>
        </div>
        <el-table
            :data="tableData"
            v-loading="loading" element-loading-text="玩命加载中..."
            highlight-current-row border
            v-resize="{height:41}"
            style="width: 100%"
            @selection-change="select_change"
            @sort-change="sort_change">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                type="selection"
                width="35">
            </el-table-column>
            <el-table-column label="付款申请单号" min-width="50" inline-template>
                <div>{{row.id}}</div>
            </el-table-column>
            <el-table-column label="采购员" min-width="50" inline-template>
                <div :title="row.purchaser" class="p-table-list-td-text">{{row.purchaser}}</div>
            </el-table-column>
            <el-table-column label="供应链专员" min-width="50" inline-template>
                <div :title="row.supply_chain_specialist" class="p-table-list-td-text">{{row.supply_chain_specialist | supplyFilter}}
                </div>
            </el-table-column>
            <el-table-column label="供应商" min-width="90" inline-template>
                <div class="p-table-list-td-text pointer">
                    <span style="color: #69f;" title="点击可查看供应商详情" @click="look_supplier(row)">{{row.supplier}}</span>
                </div>
            </el-table-column>
            <el-table-column label="结算方式" min-width="65" inline-template>
                <div class="p-table-list-td-text" :title="row.balance_text | filterCount">{{row.balance_text |
                    filterCount}}
                </div>
            </el-table-column>
            <el-table-column label="币种" min-width="40" inline-template>
                <div class="p-table-list-td-text" :title="row.currency_code">{{row.currency_code}}</div>
            </el-table-column>
            <el-table-column label="申请付款总额" min-width="60" inline-template sortable>
                <div class="p-table-list-td-text" :title="row.apply_amount|filterAmount">{{row.apply_amount |
                    filterAmount}}
                </div>
            </el-table-column>
            <el-table-column label="已付款金额" min-width="60" inline-template sortable>
                <div class="p-table-list-td-text" :title="row.payment_amount|filterAmount">
                    {{row.payment_amount|filterAmount}}
                </div>
            </el-table-column>
            <el-table-column label="付款状态" min-width="55" inline-template>
                <div style="position: relative">
                    <span :title="row.status | filterStatus">{{row.status | filterStatus}}</span>
                </div>
            </el-table-column>
            <el-table-column label="采购类型" min-width="75" inline-template>
                <div class="p-table-list-td-text" :title="row.purchase_plan_type">{{row.purchase_plan_type}}</div>
            </el-table-column>
            <el-table-column label="申请时间" inline-template min-width="48" sortable>
                <span :title="row.create_time_date" class="p-table-list-td-text">{{row.create_time_date}}</span>
                <!--<ui-tip :content="row.create_time_date" :width="88"></ui-tip>-->
            </el-table-column>
            <el-table-column label="付款时间" inline-template min-width="80" sortable>
                <ui-tip :content="row.payment_time | timeFilter" :width="88"></ui-tip>
            </el-table-column>
            <el-table-column label="最迟付款日期" inline-template min-width="60" sortable>
                <div
                    :class="{'red-color': row.payment_last_time>0 ? new Date().toDateString() === new Date(row.payment_last_time*1000).toDateString() || row.payment_last_time < thisNow:''}">
                    {{row.payment_last_time | dataFilter}}
                </div>
            </el-table-column>
            <el-table-column label="距离最迟付款时间" inline-template min-width="75" v-if="late_time" sortable>
                <div v-if="row.status ===6">- -</div>
                <div v-else
                     :class="{'red-color': row.payment_last_time >0 ? new Date().toDateString() === new Date(row.payment_last_time*1000).toDateString() || row.payment_last_time < thisNow:''}">
                    {{ row.payment_last_time | lateFilter}}
                </div>
            </el-table-column>
            <el-table-column min-width="70" inline-template label="操作">
                <trends-select :key="row.id" :selects="get_operate(row)" @trigger="action($event,row)">
                </trends-select>
            </el-table-column>
        </el-table>
        <!--采购单号详情-->
        <look-list v-model="lookVisable" :lookData="lookData" :edit="false" :listId="listId"
                   @save-logistics="save_logistics">
        </look-list>
        <!--    checkList: 弹框数据
                isInvalidAudit: 是否是审核状态
                isCancelPay: 是否是取消付款状态
                changeStatus:此状态 可以添加图片(上传发票)
                isEdit: 此状态 可以添加图片(上传付款回单)
                isUpload: 上传发票状态
                isPayment: 上传付款单状态
                flagIs: 判断打开弹框是否有图片 如果进来有图片删除图片可保存 没有保存时提示必须上传图片-->
        <look-edit v-model="lookEditVisable"
                   @search="$listeners['reflash']"
                   :check-list="checkList"
                   :is-invalid-audit="isInvalidAudit"
                   :look-view="lookView"
                   :title="look_title"
                   :is-cancel-pay="isCancelPay"
                   :change-status="changeStatus"
                   :is-edit="isEdit"
                   :is-upload="isUpload"
                   :is-payment="isPayment"
                   :flagIs="flagIs">
        </look-edit>
        <payment-look v-model="paymentVisable"
                      v-loading="loading_payment"
                      element-loading-text="玩命加载中..."
                      @search="$listeners['reflash']"
                      :title="look_title"
                      :check-list="checkListDeal">
        </payment-look>
        <cheked-suppliers
            v-model="checkedDialog"
            :isLook="true"
            :chain-specia-list="chainSpecialist"
            :remove-file="removeFile"
            :remove-information="removeInformation"
            :look-edit-form="lookEditForm"
            :title="editLookTitle"
            :status="0"
        ></cheked-suppliers>
        <!--操作日志-->
        <operation-log v-model="log_view" :checkList="operationLog"></operation-log>
        <!--标记付款-->
        <mark-pay v-model="markPayVisable"
                  :checkList="checkListMarkPay"
                  :title="mark_title"
                  :pay_loading="loading_mark"
                  @search="search_init"
                  @close="close_pay"
                  :is_batch="is_batch"
                  :mark_detail="mark_detail"
                  :is-edit="isEdit"></mark-pay>
        <!--线上标记付款-->
        <online-mark-pay v-model="onlineMarkPayVisable"
                         :checkList="checkListOnlinePay"
                         ref="online_mark"
                         :title="mark_title_online"
                         :is_batch="online_is_batch"
                         :pay_loading="loading_mark_online"
                         @search="$listeners['reflash']"
                         @online-select-change="online_select_change"
                         :mark_detail="mark_detail_online"
                         :is-edit="isEdit"
                         @hand-mark="hand_mark"
                         @showFalse="showFalse"
                         @close-ali="showFalse"
                         :search-data="payTypeList"
                         @cancel_pay_submit="cancel_pay_submit"></online-mark-pay>
        <!--批量审核不通过-->
        <look-reason v-model="failedVisable" :addData="failed_data" :title="view_title" @add_ymx="submit_audit"
                     :reason="input_reason" :isBatchCancePay="isBatchCancePay"></look-reason>
        <!--导出富有弹框-->
        <export-fuyou v-model="fuyou_lay" @export_sure="export_sure" :fuyouRate="fuyouRate"></export-fuyou>
        <!--批量修改结算方式-->
        <batch-clearing-form v-model="batchPayDialog"
                             @submit="submit_pay"
                             :addData="batchPayType">
        </batch-clearing-form>
        <!--批量上传付款回单-->
        <batch-upload-image v-model="batchUploadImageDialog"
                            @submit="submit_upload_image"
                            :addData="batchUploadImage"
                            :is-edit="isEdit">
        </batch-upload-image>
        <!--导出队列-->
        <export-dialog v-model="export_visible"></export-dialog>
        <export-field-self :param="export_model_type"
                           v-model="exportVisable"
                           :fields="fields" :templates="templates"
                           @getTemplate="get_templates"
                           title="请选择自定义导出字段"
                           :fixparam="fixparam"
                           :creat-excel="creat_excel">
        </export-field-self>
    </div>
</template>
<style lang="stylus">
    .purchase-apply-data-table {
        .red-color {
            color: #f00;
        }
        .el-dropdown .el-button-group {
            display: inline-block;
            position: relative;
            top: -1px;
        }
        .box-label {
            box-sizing: border-box;
            width: 100%;
            color: #5e6d82;
            font-size: 1.25rem;
            padding: 0 21px 10px;
            display: inline-block;
            border-bottom: 2px solid #dee5ee;
            margin-bottom: 20px;
        }
        .el-table__body-wrapper {
            overflow-x: hidden;
            overflow-y: auto;
        }
        .error-icon {
            display: inline-block;
            vertical-align: middle;
            width: 16px;
            height: 16px;
            background: url('../../../assets/error-icon2.png') no-repeat center center;
            background-size: cover;
            &:hover {
                box-shadow: 0 0 10px rgba(105, 105, 105, 1);
                border-radius: 50%;
                transform: scale(1.1);
                -ms-transform: scale(1.1); /* IE 9*/
                -moz-transform: scale(1.1); /* Firefox */
                -webkit-transform: scale(1.1); /* Safari Chrome */
                -o-transform: scale(1.1); /* opera */
            }
        }
        .p-table-list-td-text {
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .el-table__row td {
            padding: 0 0;
        }
        .el-table__row .cell {
            padding: 0 0;
        }
        .el-table__row .cell .cut-off-td:not(:last-child) {
            border-bottom: 1px solid #e0e6ed;
        }
        .el-table__row .cell .cut-off-td {
            height: 25px;
            line-height: 25px;
        }
        .el-dropdown .el-button-group .el-button--warning {
            color: #fff;
            background-color: #2ea0e3;
            border-color: #2ea0e3;
        }
        .el-dropdown .el-button-group .el-button--primary {
            color: #fff;
            background-color: #33b2f;
            border-color: #33b2f;
        }
    }
</style>
<script>
    import {
        api_cancel_pay,
        url_purchase_apply_export,
        api_purchase_apply_export,
        url_purchase_look_apply,
        api_purchase_look_apply,
        url_purchase_edit_apply,
        api_purchase_edit_apply,
        api_calculating_money,
        api_purchase_apply_mark_payed,
        url_purchase_apply_mark_payed,
        url_purchase_audit_purchaser,
        url_purchase_apply_audit,
        url_purchase_apply_audit2,
        api_purchase_apply_audit2,
        api_purchase_apply_audit,
        api_purchase_audit_purchaser,
        api_purchase_apply_cancel,
        url_purchase_apply_cancel,
        url_purchase_export_fuyou,
        api_purchase_export_fuyou,
        api_goods_export_template,
        api_purchase_apply_export_fields,
        api_purchase_operation_log,
        url_purchase_operation_log,
        api_purchase_apply_down_invoice,
        api_purchase_apply_balance_type,
        url_purchase_apply_balance_type,
        api_purchase_apply_return_mark_payed,
        url_purchase_apply_return_mark_payed,
        api_purchase_apply_upload_payment_images,
        url_purchase_apply_upload_batch_payment_images,
        api_purchase_apply_upload_batch_payment_images,
    } from "../../../api/finance-purchase"
    import {
        api_finance_pay,
        url_finance_pay, url_finance_pay_apply,
        api_finance_pay_apply,
        api_finance_list,
        url_finance_list,
        api_finance_online_payment,
        url_finance_online_payment
    } from "../../../api/payment"
    import {api_look_detail, url_publish_look_detail} from "../../../api/purchase"
    import {api_look_supplier, url_look_supplier} from "../../../api/assert-sup"
    import lookList from "../../procurement/purchase/look-list.vue"
    import {downloadFile} from '../../../lib/http';
    import {api_get_supply_chain_department_id, api_supply_chain_specialist} from "../../../api/assert-sup"

    const actions = {
        look: {
            name: "查看",
            api: url_purchase_look_apply,
            action(row) {
                this.$http(api_purchase_look_apply, row.id).then(res => {
                    this.checkList = res;
                    this.lookEditVisable = true;
                    this.lookView = true; //查看状态
                    this.look_title = `查看付款申请单号：${row.id} 信息`;

                })
            }
        },
        log: {
            name: "操作日志",
            api: url_purchase_operation_log,
            action(row) {
                this.$http(api_purchase_operation_log, row.id).then(res => {
                    this.operationLog = res;
                    this.log_view = true;
                })
            }
        },
        audit: {
            name: "审核",
            api: url_purchase_look_apply,
            action(row) {
                this.$http(api_purchase_look_apply, row.id).then(res => {
                    this.checkList = res;
                    this.lookEditVisable = true;
                    this.isInvalidAudit = true;//审核状态
                    this.look_title = `审核付款申请单号：${row.id} 信息`;
                })
            }
        },
        export_invoice: {
            name: "导出发票",
            api: url_purchase_look_apply,
            action(row) {
                this.$confirm(`此操作为导出发票, 确认此操作吗 ?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_purchase_apply_down_invoice, row.id).then(res => {
                        let url = config.apiHost + 'downloadFile/downPdfFile';
                        let params = {
                            filePath: res.url,
                        };
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.pdf',
                        });
                        this.$message({type: 'success', message: res.message || res});
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    })
                }).catch(() => {
                    this.$message({type: 'info', message: '已取消', duration: 800})
                })
            }
        },
        upload_invoice: {
            name: "上传发票",
            api: url_purchase_look_apply,
            action(row) {
                this.$http(api_purchase_look_apply, row.id).then(res => {
                    if (res.invoice_images) {
                        res.invoice_images.forEach(row => {
                            if (row.file === undefined) {
                                row.file = {};
                            }
                        });
                    }
                    if (res.invoice_images.length === 0) {//判断打开弹框是否有图片
                        this.flagIs = false;
                    } else {
                        this.flagIs = true;
                    }
                    this.checkList = res;
                    this.lookEditVisable = true;
                    this.changeStatus = false;//编辑状态 可以添加图片
                    this.isUpload = true; //上传发票状态
                    this.look_title = `付款申请单号：${row.id} 上传发票`;
                })
            }
        },
        upload_payment: {
            name: "上传付款回单",
            api: url_purchase_look_apply,
            action(row) {
                this.$http(api_purchase_look_apply, row.id).then(res => {
                    if (res.payment_images) {
                        res.payment_images.forEach(row => {
                            if (row.file === undefined) {
                                row.file = {};
                            }
                        });
                    }
                    if (res.payment_images.length === 0) {//判断打开弹框是否有图片
                        this.flagIs = false;
                    } else {
                        this.flagIs = true;
                    }
                    this.isEdit = false;//此状态 可以添加图片
                    this.checkList = res;
                    this.isPayment = true; //上传付款单状态
                    this.lookEditVisable = true;//打开弹框
                    this.look_title = `上传付款回单`;
                })
            }
        },
        deal: {
            name: "处理",
            api: url_purchase_edit_apply,
            action(row) {
                this.$http(api_purchase_edit_apply, row.id).then(res => {
                    this.checkListDeal = res;
                    this.checkListDeal.detail.forEach(row => {
                        row.apply_amount = Number(row.apply_amount).toFixed(3);
                    });
                    this.paymentVisable = true;
                    this.loading_payment = false;
                    this.look_title = `处理付款申请单号: ${row.id} 信息`;
                })
            }
        },
        do_pay: {
            name: "标记付款",
            api: url_finance_online_payment,
            action(row) {
                if(row.detail && row.detail[0].external_number && this.paymentStatus !==8){ //没有外部流水号 并且非部分付款线上付款 否则线下付款
                    this.online_pay_diolog(row);
                }else {
                    this.offline_pay_diolog(row.id);
                }
            }
        },
        cancel_pay: {
            name: "取消付款",
            api: url_purchase_look_apply,
            action(row) {
                this.$http(api_purchase_look_apply, row.id).then(res => {
                    this.checkList = res;
                    this.lookEditVisable = true;
                    this.isCancelPay = true; //取消付款状态
                    this.look_title = `取消付款申请单号: ${row.id} 信息`;
                })
            }
        }
    };
    export default {
        permission: {
            url_finance_pay,
            url_publish_look_detail,
            url_look_supplier,
            url_finance_list,
            url_finance_online_payment,
            url_purchase_apply_export,
            url_finance_pay_apply,
            url_purchase_look_apply,
            url_purchase_edit_apply,
            url_purchase_apply_mark_payed,
            url_purchase_audit_purchaser,
            url_purchase_apply_audit,
            url_purchase_apply_audit2,
            url_purchase_apply_cancel,
            url_purchase_export_fuyou,
            url_purchase_apply_balance_type,
            url_purchase_apply_return_mark_payed,
            url_purchase_apply_upload_batch_payment_images,
        },
        data() {
            return {
                is_pay_ali: false, //判断是手动标记 还是线上付款
                payTypeList: {
                    pay_way_code: '',
                    matching_code: '',
                    trade_type_desc_code: '',
                },
                batchPayType: {
                    balance_type: '',
                },
                batchUploadImage: {
                    images: [],
                },
                batchPayDialog: false,
                batchUploadImageDialog: false,
                fuyouRate: {
                    rate: '',
                },
                mark_detail: {},
                mark_detail_online: {},
                is_batch: false,
                online_is_batch: false,
                chainDepartmentId: [],
                chainSpecialist: [],
                flagIs: true,
                isUpload: false,
                isPayment: false, //上传付款单状态
                changeStatus: true,
                isEdit: true,
                fuyou_lay: false,
                checkListMarkPay: [],
                checkListOnlinePay: [],
                operationLog: [],
                log_view: false,
                removeInformation: [],
                removeFile: [],
                failed_data: {
                    remark: '',
                    status: '',
                    id: '',
                },
                export_visible: false, //导出管理队列
                input_reason: '',
                view_title: '',
                failedVisable: false,
                loading_payment: true,
                loading_mark: false,
                loading_mark_online: false,
                look_title: "",
                mark_title: '',
                mark_title_online: '',
                isInvalidAudit: false,
                lookView: false,
                isCancelPay: false,
                isBatchCancePay: false,
                button_list: {},
                checkList: {
                    detail: [],
                    invoice_images: []
                },
                checkListDeal: {},
                lookEditVisable: false,
                paymentVisable: false,
                payTotal: {
                    CNY: 0,
                    USD: 0,
                },
                paidTotal: {
                    CNY: 0,
                    USD: 0,
                },
                selects: [],
                handleSelects: [],
                lookVisable: false,
                markPayVisable: false,
                onlineMarkPayVisable: false,
                lookData: {},
                listId: 0,
                checkedDialog: false,
                editLookTitle: '',
                lookEditForm: {},
                export_model_type: {
                    type: 12
                },
                exportVisable: false,
                fields: [],
                templates: [],
                partAllOptions: [
                    {name: "部分导出", value: 2},
                    {name: "全部导出", value: 1}
                ],
            }
        },
        methods: {
            offline_pay_betch(data) { //线下批量
                this.loading_mark = true;
                this.$http(api_finance_list, data).then(res => {
                    this.checkListMarkPay = [];
                    res.data.map(row => {
                        row.detail.map(item => {
                            this.checkListMarkPay.push(item);
                            this.$set(item, 'this_payment', Number(item.apply_amount - item.payment_amount).toFixed(3));
                        })
                    });
                    this.mark_title = "批量标记付款";
                    this.markPayVisable = true;
                    this.is_batch = false;
                    this.loading_mark = false;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                }).finally(() => {
                    this.$reqKey('url_finance_list', false);
                })
            },
            online_pay_diolog(row){ //单个标记线上
                this.$http(api_finance_online_payment, {id: row.id, pageSize: 500}).then(res => {
                    this.checkListOnlinePay = res.data;
                    res.data.map(item => {
                        this.$set(item, 'new_purchase_order_id', 'PO' + item.purchase_order_id);
                    });
                    this.mark_detail_online = res;
                    this.onlineMarkPayVisable = true;
                    this.loading_mark_online = false; //loading
                    this.mark_title_online = `标记付款申请单号: ${row.id} 信息`;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            offline_pay_diolog(row) {//单个标记线下
                this.$http(api_finance_list, {id: row, pageSize: 500}).then(res => {
                    this.checkListMarkPay = [];
                    res.data.map(row => {
                        this.mark_detail = row;
                        row.detail.map(item => {
                            this.checkListMarkPay.push(item);
                            this.$set(item, 'this_payment', Number(item.apply_amount - item.payment_amount).toFixed(3));
                        });
                        if (row.payment_images && row.payment_images.length !==0) {
                            row.payment_images.forEach(item => {
                                if (item.file === undefined) {
                                    item.file = {};
                                }
                            });
                        }
                    });
                    this.markPayVisable = true;
                    this.loading_mark = false; //loading
                    this.isEdit = false;//此状态 可以添加图片
                    this.is_batch = true;//批量标记付款时 为false不显示table上面的详情 单个标记付款显示
                    this.mark_title = `标记付款申请单号: ${row} 信息`;
                })
            },
            search_init() {
                this.$emit('search');
            },
            mark_all_down() {
                if (this.selects.length === 0) {
                    this.$reqKey('url_finance_list', false);
                    this.$message({type: 'warning', message: '请选择一条数据',});
                    return
                }
                let ids = this.selects.map(row => row.id).join(',');
                let data = {
                    id: ids,
                    pageSize: 500
                };
                this.offline_pay_betch(data);
            },
            showFalse() {
                this.onlineMarkPayVisable = false;
                this.$emit('search');
            },
            cancel_pay_submit(id, reason) {//线上标记付款的取消付款提交按钮
                this.$http(api_purchase_apply_cancel, {id: id, remark: reason}).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.onlineMarkPayVisable = false;
                    this.$emit('search');
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            batch_upload_image() {//批量上传付款回单弹框打开
                this.isEdit = false;
                this.batchUploadImageDialog = true;
            },
            batch_pay() {//批量修改结算方式弹框打开
                this.batchPayDialog = true;
            },
            submit_upload_image(type) {//批量上传付款回单确定按钮
                let dataImage = Object.keys(type).map(key => {
                    if (type[key].path) {
                        return type[key].path
                    } else {
                        return type[key].file.image;
                    }
                });
                let name = Object.keys(type).map(key => {
                    return type[key].file.name.substring(0, type[key].file.name.lastIndexOf('.'));

                });
                let obj = {};
                name.forEach((item, index) => {
                    obj[item] = dataImage[index];
                });
                let data = {
                    images: obj
                };
                if (type.length === 0) {
                    return this.$message({type: 'warning', message: '请先上传发票'});
                } else {
                    this.$http(api_purchase_apply_upload_batch_payment_images, data).then(res => {
                        this.batchUploadImageDialog = false;
                        this.$message({type: 'success', message: res.message || res});
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    }).finally(() => {
                        this.$reqKey('batch_image_load', false);
                    })
                }
            },
            submit_pay() {//批量修改结算方式确定按钮
                let ids = this.selects.map(row => row.id);
                let data = {
                    balance_type: this.batchPayType.balance_type,
                    ids: ids
                };
                this.$http(api_purchase_apply_balance_type, data).then(res => {
                    this.batchPayDialog = false;
                    this.$message({type: 'success', message: res.message || res});
                    this.$emit("reflash");
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                    this.batchPayDialog = false;
                }).finally(() => {
                    this.$reqKey('clearingForm3', false);
                });
            },
            /*供应链专员*/
            get_supply_chain_specialist_id() {
                this.$http(api_get_supply_chain_department_id).then(res => {
                    this.chainSpecialist = res.map(row => {
                        return {value: row.id, label: row.realname}
                    });
                }).catch(code => {
                    console.log(code);
                })
            },
            sort_change(val) {
                this.$emit('sort-change', val)
            },
            get_fields() {//获取导出字段
                this.$http(api_purchase_apply_export_fields).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            creat_excel(param) {
                let data = '';
                switch (this.export_type) {
                    case 2://部分
                        data = {
                            ids: JSON.stringify(this.selects.map(row => {
                                if (typeof row === 'object') {
                                    return row.id
                                } else {
                                    return row
                                }
                            })),
                            export_type: this.export_type,
                            fields: param
                        };
                        Object.assign(data, this.init_params());
                        return this.order_export(data);
                        break;
                    case 1://全部
                        data = this.init_params();
                        this.$set(data, 'export_type', this.export_type);
                        this.$set(data, 'fields', param);
                        return this.order_export(data);
                        break;
                }
            },
            fixparam(list) {
                return list.map(row => {
                    return {
                        field_name: row.show_field,
                        field_key: row.field
                    }
                });
            },
            get_templates() {//保存导出模板
                this.$http(api_goods_export_template, {type: 12}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    });
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            batch_failed_public(url, params) {//批量不通过公共
                return this.$http(url, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.failedVisable = false;
                    this.failed_data.remark = '';
                    this.$emit('search');
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    this.$reqKey('batch_failed', false);
                });
                return Promise.resolve();
            },
            submit_audit() {//提交批量审核不通过
                this.failed_data.remark = this.failed_data.remark.trim();
                if (this.failed_data.remark === '') {
                    this.$message({type: 'error', message: '请填写原因'});
                    this.$reqKey('batch_failed', false);
                    return;
                }
                let params = {
                    status: -1,
                    id: this.selects.map(row => row.id).join(','),
                    remark: this.failed_data.remark
                };
                let params2 = {
                    id: this.selects.map(row => row.id).join(','),
                    remark: this.failed_data.remark
                };
                if (this.paymentStatus === 0) {
                    this.batch_failed_public(api_purchase_audit_purchaser, params);
                } else if (this.paymentStatus === 2) {
                    this.batch_failed_public(api_purchase_apply_audit, params);
                } else if (this.paymentStatus === 4) {
                    this.batch_failed_public(api_purchase_apply_audit2, params);
                } else {
                    this.batch_failed_public(api_purchase_apply_cancel, params2);
                }
            },
            all_no_pass() {//点击批量取消付款
                this.failedVisable = true;
                this.isBatchCancePay = true;
                if (this.paymentStatus === 5) {
                    this.view_title = '批量取消付款';
                    this.input_reason = '请填写取消付款的理由';
                }
            },
            batch_no_pass() {//点击批量审核不通过
                this.failedVisable = true;
                if (this.paymentStatus === 0 || this.paymentStatus === 2 || this.paymentStatus === 4) {
                    this.view_title = '批量审核不通过';
                    this.input_reason = '请填写审核不通过的批注';
                }
            },
            get_operate(row) {
                let act = this.operateSelects(row);
                return act.filter(row => {
                    return this.$hasPermission(row.api);
                })
            },
            //点击查看 编辑等
            action(act, row) {
                this.listId = row.id;
                act.action.call(this, row);
            },
            operateSelects(row) {//操作按钮 显示
                let action = [];
                if (row.button_list.is_display_view_bt === 1) {
                    action.push(actions.look);
                }
                if (row.button_list.is_display_view_log_bt === 1) {
                    action.push(actions.log);
                }
                if (row.button_list.is_display_audit_bt === 1) {
                    action.push(actions.audit);
                }
                if (row.button_list.is_display_export_invoice_bt === 1) {//导出发票
                    action.push(actions.export_invoice);
                }
                if (row.button_list.is_display_upload_invoice_bt === 1) {//上传发票
                    action.push(actions.upload_invoice);
                }
                if (row.button_list.is_display_upload_payment_bt === 1) {//上传付款回单
                    action.push(actions.upload_payment);
                }
                if (row.button_list.is_display_deal_bt === 1) {
                    action.push(actions.deal);
                }
                if (row.button_list.is_display_do_pay_bt === 1) {
                    action.push(actions.do_pay);
                }
                if (row.button_list.is_display_cancel_pay_bt === 1) {
                    action.push(actions.cancel_pay);
                }
                return action;
            },
            order_export(params) {//部分 全部导出
                return this.$http(api_purchase_apply_export, params).then(res => {
                    if (res.join_queue === 1) {
                        this.export_visible = true;
                        this.$message({type: "success", message: res.message || res});
                    } else {
                        let params = {
                            page: this.searchData.page,
                            pageSize: this.searchData.pageSize,
                            file_code: res.file_code
                        };
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                        this.$message({type: 'success', message: res.message || res});
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
                return Promise.resolve();
            },
            export_excel(val) {
                // val.action.call(this, val);
                if (val.value === 2 && this.selects.length <= 0) return this.$message({
                    type: "warning",
                    message: "请先选择需要导出的数据"
                });
                this.export_type = val.value;
                this.exportVisable = true;
            },
            init_params() {
                let params = window.clone(this.searchData);
                if (this.searchData.date_b) {
                    params.date_b = datef("YYYY-MM-dd", this.searchData.date_b / 1000)
                } else {
                    params.date_b = "";
                }
                if (this.searchData.date_e) {
                    params.date_e = datef("YYYY-MM-dd", this.searchData.date_e / 1000)
                } else {
                    params.date_e = "";
                }
                if (params.snText.trim()) {
                    params.snText = this.searchData.snText.replace(new RegExp(' ', 'gm'), '\n').trim().split('\n').map(row => row.trim()).filter(row => row !== '');
                } else {
                    params.snText = '';
                }
                if (this.searchData.balance_type.length > 0) {
                    params.balance_type = this.searchData.balance_type.join(',');
                } else {
                    params.balance_type = '';
                }
                params.payment_status = this.paymentStatus;
                return params
            },
            select_change(val) {  //check 选择
                this.selects = val;
                let arr2 = this.selects.map(row => row.id);
                let arr3 = this.selects.length === 0 ? '' : arr2.map(String);
                this.$http(api_calculating_money, {ids: arr3}).then(res => {
                    this.payTotal = res.total_apply_amount;
                    this.paidTotal = res.total_payment_amount;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            online_select_change(val) { //手动标记check 选择
                this.handleSelects = val;
            },
            batch_audit_pass() {//批量审核通过
                switch (this.paymentStatus) {
                    case 0:
                        this.batch_audit_pass_public(api_purchase_audit_purchaser);
                        break;
                    case 2:
                        this.batch_audit_pass_public(api_purchase_apply_audit);
                        break;
                    case 4:
                        this.batch_audit_pass_public(api_purchase_apply_audit2);
                        break;
                }
            },
            batch_audit_pass_public(url) {//批量审核通过公共
                let ids = this.selects.map(row => row.id).join(',');
                let params = {
                    status: 1,
                    id: ids,
                };
                this.$confirm(`此操作为批量审核通过勾选的数据, 确认此操作吗 ?`, '提示', {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$http(url, params).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        this.$emit("reflash");
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    })
                }).catch(() => {
                    this.$message({type: "info", message: "已取消", duration: 800});
                })
            },
            restore_status() {//批量还原上一步付款状态
                let ids = this.selects.map(row => row.id).join(',');
                this.$confirm(`此操作为批量还原上一步付款状态, 确定此操作码?`, '提示', {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$http(api_purchase_apply_return_mark_payed, {id: ids}).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.$emit("reflash");
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    })
                }).catch(() => {
                    this.$message({type: "info", message: "取消", duration: 800});
                })
            },
            close_pay() {
                this.onlineMarkPayVisable = false;
            },
            hand_mark(item) { // 取消付款  线下标记付款
                let ids = this.handleSelects;
                let arr4 = ids.map(row => {
                    return row.purchase_order_id
                });
                let keyId = [...new Set(arr4)];
                let data = {
                    snText: keyId,
                    snType: 'purchase_order_id',
                    payment_status: 5
                };
                let arr1 = item.filter(row => {
                    return row.matching_code !== 1 && row.trade_type_desc_code ===0 //过滤非匹配成功的 并且账期支付为否的
                }).map(item => {
                    return item.purchase_order_id
                });
                let nopass = [...new Set(arr1)];
                if (this.online_is_batch && nopass.length === 0) {//批量并且 非匹配成功的 并且账期支付为否的 为0 直接线下支付
                    this.offline_pay_betch(data); //线下支付
                }else if(this.online_is_batch && nopass.length > 0) {
                    this.$http(api_purchase_apply_cancel, {snText: nopass, is_ali: 1, snType: 'purchase_order_id', payment_status: 5}).then(res => {//取消付款
                        this.offline_pay_betch(data); //线下支付批量
                        this.$message({type: 'success', message: res.message || res});
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    });
                }else{
                    let ids = this.checkListOnlinePay[0].purchase_payment_id;
                    this.offline_pay_diolog(ids); //线下支付单个
                }
            },
            mark_online() {//线上批量标记付款
                let ids = this.selects.map(row => row.id).join(',');
                this.$http(api_finance_online_payment, {id: ids, pageSize: 500}).then(res => {
                    this.checkListOnlinePay = res.data;
                    res.data.map(item => {
                        this.$set(item, 'new_purchase_order_id', 'PO' + item.purchase_order_id);
                    });
                    this.mark_detail_online = res;
                    this.mark_title_online = "批量标记付款";
                    this.online_is_batch = true; //线上批量标记付款时 为false不显示table上面的详情 单个标记付款显示
                    this.loading_mark_online = false;
                    this.onlineMarkPayVisable = true;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                }).finally(() => {
                    this.$reqKey('url_finance_online_payment', false);
                })
            },
            show_message(info, type) {//导出提示
                if (info.message && Array.isArray(info.message)) {
                    let newDatas = [];
                    const h = this.$createElement;
                    for (let i in info.message) {
                        newDatas.push(h('p', null, info.message[i]));
                    }
                    this.$msgbox({title: '提示', type, message: h('div', null, newDatas) || info});
                } else {
                    this.$message({type, message: info.message || info});
                }
            },
            export_sure() {//确定导出至富友
                let ids = this.selects.map(row => row.id);
                this.$http(api_purchase_export_fuyou, {
                    ids: ids,
                    export_type: 2,
                    rate: this.fuyouRate.rate
                }).then(res => {
                    if (res.join_queue === 1) {
                        this.export_visible = true;
                        this.$message({type: "success", message: res.message || res});
                    } else {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let params = {
                            file_code: res.file_code,
                        };
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                        this.show_message(res, 'success');
                        this.fuyou_lay = false;
                    }
                }).catch(code => {
                    this.show_message(code, 'error');
                })
            },
            export_fuyou() {//导出至富友弹框
                this.fuyou_lay = true;
            },
            cancel_pay(row) {//取消付款
                this.$confirm(`您将为采购单${row.purchase_order_code}取消付款, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.Nopay({id: row.id, status: 3}, row.id)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            // 取消付款 的付款接口 api_cancel_pay
            Nopay(data) {
                return this.$http(api_cancel_pay, data).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.$emit("reflash");
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            //审核通过
            mark_pay(row) {
                this.$confirm(`此操作为采购单${row.purchase_order_code}审核通过, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.pay({id: row.id, status: 1})
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消审核'
                    });
                });
            },
            //付款接口
            pay(data) {
                return this.$http(api_finance_pay, data).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.$emit("reflash");
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            //采购单详情
            save_logistics(id) {
                this.$http(api_look_detail, id).then(res => {
                    res.expect_arrive_date = datef('YYYY-MM-dd HH:mm:ss', res.expect_arrive_date);
                    this.lookData = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            /*------查看供应商*/
            look_supplier(row) {
                this.editLookTitle = `查看供应商: ${row.supplier} 信息`;
                this.$http(api_look_supplier, row.supplier_id).then(res => {
                    this.lookEditForm = res;
                    this.checkedDialog = true;
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                });
            }

        },
        mounted() {
            this.get_templates();
            this.get_fields();
        },
        filters: {
            filterCount(val) {
                return val === '' ? '- -' : val;
            },
            supplyFilter(val) {
                return val ? val : '- -'
            },
            filterStatus(val) {//付款状态
                const statusArr = new Map()
                    .set(0, "待采购审核")
                    .set(1, "采购审核不通过")
                    .set(2, "待财务审核")
                    .set(3, "财务审核不通过")
                    .set(4, "待采购排款")
                    .set(5, "待付款")
                    .set(6, "已付款")
                    .set(7, "取消付款")
                    .set(8, "部分付款")
                    .set(-1, "作废")
                    .set(-4, "采购排款不通过");
                return statusArr.get(val);
            },
            pay_filter(val) {
                return val ? Number(val).toFixed(3) : '0.000';
            },
            lateFilter(val) {
                let dateNow = Math.ceil(new Date().getTime() / 1000);//当前时间戳向上取整
                let sec = dateNow - val;
                sec = Math.abs(sec);//取绝对值
                let d = Math.floor(sec / 86400);
                let h = Math.floor((sec - (d * 86400)) / 3600);
                if ((dateNow > val) && val > 0) {
                    return `已超时${d}天${h}时`;
                } else if (val > dateNow) {
                    return new Date().toDateString() === new Date(val * 1000).toDateString() ? '0天' : `${d}天${h}时`;
                } else {
                    return '- -'
                }
            },
            paymentFilter(val) {
                switch (val) {
                    case 0:
                        return "待审核";
                        break;
                    case 1:
                        return "已审核";
                        break;
                }
            },
            dataFilter(val) {
                if (val > 0) {
                    return datef('YYYY-MM-dd', val);
                } else {
                    return '- -'
                }
            },
            timeFilter(val) {
                if (val > 0) {
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return '- -'
                }
            },
            filterAmount(val) {
                if (Number(val) >= 0) {
                    return Number(val).toFixed(3);
                }
            }
        },
        computed: {
            thisNow() {
                return Math.ceil(new Date().getTime() / 1000);
            },
            emptyText() {
                return this.firstLoading ? '等待请求数据中...' : '暂无数据'
            },
            late_time() {
                if (this.paymentStatus === 6) {
                    return false;
                } else {
                    return true;
                }
            }
        },
        watch: {
            batchUploadImageDialog(val) {
                if (!val) {
                    this.isEdit = true;
                }
            },
            lookEditVisable(val) {//关闭弹框初始化其状态
                if (!val) {
                    this.isInvalidAudit = false;
                    this.lookView = false;
                    this.isCancelPay = false;
                    this.changeStatus = true;
                    this.isEdit = true;
                    this.isUpload = false;
                    this.isPayment = false; //上传付款单状态
                }
            },
            failedVisable(val) {
                if (!val) {
                    this.isBatchCancePay = false;
                }
            },
            markPayVisable(val) {
                if (!val) {
                    this.is_batch = false;
                    this.isEdit = true;
                }
            },
            onlineMarkPayVisable(val) {
                if (!val) {
                    this.online_is_batch = false;
                }
            }
        },
        props: {
            tableData: {
                required: true,
                type: Array
            },
            paymentStatus: {},
            loading: {
                required: true,
                type: Boolean
            },
            searchData: {},
            firstLoading: {
                required: true,
                type: Boolean
            }
        },
        components: {
            lookList,
            uiTips: require("../../../components/ui-tips.vue").default,
            times: require('../../../components/times.vue').default,
            trendsSelect: require('../../../components/trends-select').default,
            uiTip: require('@/components/ui-tip.vue').default,
            lookEdit: require('./look-edit.vue').default,
            paymentLook: require('./payment-look.vue').default,
            lookReason: require('./look-reason.vue').default,
            requestButton: require('../../../global-components/request-button').default,
            exportDialog: require('../../report/export-dialog').default,
            exportFieldSelf: require("./export-field-self").default,
            operationLog: require('./operation-log.vue').default,
            markPay: require('./mark-pay.vue').default,
            onlineMarkPay: require('./online-mark-pay.vue').default,
            exportFuyou: require('./export-fuyou.vue').default,
            batchClearingForm: require('./batch-clearing-form').default,
            batchUploadImage: require('./batch-upload-image').default,
            chekedSuppliers:require('../suppliers/assert-sup/checked-suppliers.vue').default,


        }
    }
</script>
