<template>
    <div class="purchase-settlement-data-table">
        <permission tag="request-button" :route="apis.url_finance_pay"
                    class="mt-sm mb-sm ml-sm" @click="pay_all" req-key="apis_url_finance_pay" :disabled="isDisable">
            批量标记付款
        </permission>
        <permission tag="trendsSelect"
                    class="inline ml-xs mr-xs"
                    type="primary"
                    :route="apis.url_finance_purchase_export"
                    :selects="partAllOptions"
                    @trigger="export_excel"></permission>
        <el-table
            :data="tableData"
            v-loading="loading" element-loading-text="玩命加载中..."
            highlight-current-row
            v-resize="{height:41}"
            style="width: 100%"
            class="scroll-bar"
            @selection-change="select_change"
        >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                :selectable="selectable"
                type="selection"
                width="30">
            </el-table-column>
            <el-table-column label="ID" prop="id" min-width="35"></el-table-column>
            <el-table-column label="采购单号" min-width="70" inline-template>
                <ui-tip :is-operate="true" :content="row.purchase_order_code" :width="98"
                        @cur-click="look_(row)"></ui-tip>
            </el-table-column>
            <el-table-column label="1688帐号" min-width="90" inline-template>
                <ui-tip :content="row.account_1688" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="外部流水号" inline-template min-width="100">
                <ui-tip :content="row.external_number" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="采购员" min-width="50" inline-template>
                <ui-tip :content="row.purchaser"></ui-tip>
            </el-table-column>
            <el-table-column label="供应商" min-width="160" inline-template>
                <permission tag="span" :route="apis.url_look_supplier" @click="look_supplier(row)"
                            class="operate line-one" title="点击可查看供应商详情">{{row.supplier}}
                </permission>
            </el-table-column>
            <el-table-column label="结算方式" min-width="70" inline-template>
                <ui-tip :content="row.balance_text" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="采购单状态" min-width="60" inline-template>
                <ui-tip :content="row.payment_status_text" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="本次付款" min-width="60" inline-template>
                <div>{{row.apply_amount|filterAmont}}</div>
            </el-table-column>
            <el-table-column label="付款状态" inline-template min-width="50">
                <div>{{row.payment_status|paymentFilter}}</div>
            </el-table-column>
            <el-table-column label="采购类型" inline-template show-overflow-tooltip min-width="50">
                <div>{{row.purchase_type|typeFilter}}</div>
            </el-table-column>
            <el-table-column label="申请时间 / 付款时间" inline-template min-width="160">
                <ui-tip :content="`${dataFilter(row.create_time)}/${dataFilter(row.finance_payment_time)}`"
                        :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="操作" inline-template min-width="150">
                <div>
                    <div v-if="row.payment_status===1">
                        <template v-if="row.real===0">
                            <permission tag="span" :route="apis.url_finance_pay" v-if="!isDisableLink(row)" class="operate" @click="mark_pay(row)">
                                标记为已付款
                            </permission>
                            <permission tag="span" :route="apis.url_finance_pay" v-else class="disabled">
                                标记为已付款
                            </permission>
                            &nbsp;|&nbsp;
                            <permission tag="span" :route="apis.url_finance_pay" class="operate"
                                        @click="cancel_pay(row)">取消付款
                            </permission>
                        </template>
                        <template v-else>
                            <permission tag="span" :route="apis.url_finance_pay" class="disabled">标记为已付款</permission>
                            &nbsp;|&nbsp;
                            <permission tag="span" :route="apis.url_finance_pay" class="disabled">取消付款</permission>
                        </template>
                    </div>
                    <div v-else-if="row.payment_status===3">
                    </div>
                    <div v-else>
                        <permission tag="span" :route="apis.url_finance_list" class="operate" @click="pay_log(row)">
                            付款记录
                        </permission>
                    </div>
                </div>
            </el-table-column>
        </el-table>
        <look-list v-model="lookVisable" :lookData="lookData" :edit="false" @save-logistics="save_logistics"
                   :listId="listId"></look-list>
        <pay-log v-model="payVisable" :payData="payData"></pay-log>
        <edit-lookover v-model="dialog" :isLook="true" :look-edit-form="lookEditForm"
                       :title="editLookTitle"></edit-lookover>
    </div>
</template>
<style lang="stylus">
    .purchase-settlement-data-table {
        .el-dropdown .el-button-group {
            display: inline-block;
            position: relative;
            top: -1px;
        }
        .line-one {
            width: 590px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
</style>
<script>
    import {
        api_finance_pay,
        api_finance_list,
        url_finance_pay,
        url_finance_list,
        url_finance_purchase_export,
        api_finance_purchase_export
    } from "../../../api/finance-purchase"
    import {api_look_detail} from "../../../api/purchase"
    import {api_look_supplier, url_look_supplier} from "../../../api/assert-sup"
    import lookList from "../../procurement/purchase/look-list.vue"
    import payLog from "./pay-log.vue"
    import {downloadFile} from '../../../lib/http';

    export default {
        permission: {
            url_finance_pay,
            url_finance_list,
            url_look_supplier,
            url_finance_purchase_export
        },
        data() {
            return {
                selects: [],
                lookVisable: false,
                lookData: {},
                listId: 0,
                payVisable: false,
                dialog: false,
                payData: [],
                editLookTitle: '',
                lookEditForm: {},
                partAllOptions: [
                    {
                        name: "部分导出", value: 2, action: function () {
                            if (this.selects.length <= 0) return this.$message({
                                type: "warning",
                                message: "请先选择需要导出的数据"
                            });
                            let params = {
                                ids: JSON.stringify(this.selects.map(row => {
                                    if (typeof row === 'object') {
                                        return row.id
                                    } else {
                                        return row
                                    }
                                })),
                                export_type: 2,
                            };
                            Object.assign(params, this.init_params());
                            this.order_export(params);
                        }
                    },
                    {
                        name: "全部导出", value: 1, action: function () {
                            let params = this.init_params();
                            this.$set(params, 'export_type', 1);
                            this.order_export(params);
                        }
                    },
                ]
            }
        },
        methods: {
            isDisableLink(row){
                return row.purchase_order_status===-1;
            },
            selectable(row){
                return row.real === 0;
            },
            order_export(params) {
                return this.$http(api_finance_purchase_export, params).then(res => {
                    if (res.status === 1) {
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
                    } else {
                        this.$message({type: 'error', message: res.message || res});
                    }
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            export_excel(val) {
                val.action.call(this, val);
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
                return params
            },
            //check 选择
            select_change(val) {
                this.selects = val;
            },
            //点击批量付款
            pay_all() {
                if (this.selects.length === 0) {
                    this.$reqKey('apis_url_finance_pay', false);
                    this.$message({
                        type: 'warning',
                        message: '请选择一条数据',
                    });
                    return
                }
                let ids = this.selects.map(item => {
                    return item.id
                });
                let name = this.selects.map(item => {
                    return item.purchase_order_id
                });
                let payId = ids;
                ids = ids.join(",");
                name = name.join(",");
                this.$confirm(`此操作批量为${name}付款, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.pay({id: ids, status: 2}, payId);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消批量付款'
                    });
                }).finally(() => {
                    this.$reqKey('apis_url_finance_pay', false);
                });
            },
            //标记付款
            mark_pay(row) {
                this.$confirm(`您将为采购单${row.purchase_order_code}付款, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.pay({id: row.id, status: 2}, row.id);
//                    this.$message({type:'success',m})
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            //取消付款
            cancel_pay(row) {
                this.$confirm(`您将为采购单${row.purchase_order_code}取消付款, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.pay({id: row.id, status: 3}, row.id)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            //付款接口
            pay(data, payId) {
                this.$http(api_finance_pay, data).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    if (payId instanceof Array) {
                        payId.forEach(res => {
                            let index = this.tableData.indexOfFun(old => old.id === res);
                            this.tableData.splice(index, 1);
                        })
                    } else {
                        let index = this.tableData.indexOfFun(old => old.id === data.id);
                        this.tableData.splice(index, 1);
                    }
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('apis_url_finance_pay', false);
                    }, 200);
                });
            },
            save_logistics(id) {
                this.$http(api_look_detail, id).then(res => {
                    res.expect_arrive_date = datef('YYYY-MM-dd', res.expect_arrive_date)
                    this.lookData = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            //点击采购单号 查看
            look_(row) {
                this.$set(this, "listId", row.purchase_order_id);
                this.$set(this.lookData, "shipping_cost", 0);
                this.$http(api_look_detail, row.purchase_order_id).then(res => {
                    res.expect_arrive_date = datef('YYYY-MM-dd', res.expect_arrive_date);
                    this.lookData = res;
                    this.lookVisable = true;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            look_supplier(row) {
                this.editLookTitle = `查看供应商: ${row.supplier} 信息`;
                this.$http(api_look_supplier, row.supplier_id).then(res => {
                    this.lookEditForm = res;
                    this.dialog = true;
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                });
            },
            //付款记录查看
            pay_log(row) {
                this.payData = [];
                this.$http(api_finance_list, {purchase_order_id: row.purchase_order_id}).then(res => {
                    this.payData = res.data;
                    this.payVisable = true;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            dataFilter(val) {
                return datef('YYYY-MM-dd HH:mm:ss', val);
            }
        },
        filters: {
            filterAmont(val) {
                if (val >= 0) {
                    return Number(val).toFixed(3);
                } else {
                    return val;
                }
            },
            paymentFilter(val) {
                switch (val) {
                    case 1:
                        return "待付款";
                        break;
                    case 2:
                        return "已付款";
                        break;
                    case 3:
                        return "取消付款";
                        break;
                }
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

        },
        watch: {},
        computed: {
            emptyText() {
                return this.isFirst ? '正在请求数据...' : '暂无数据'
            }
        },
        props: {
            tableData: {
                required: true,
                type: Array
            },
            loading: {
                required: true,
                type: Boolean
            },
            isDisable: {
                required: true,
                type: Boolean
            },
            searchData: {},
            isFirst: {
                required: true,
                type: Boolean
            }
        },
        components: {
            lookList,
            payLog,
            editLookover: require("../../procurement/suppliers/assert-sup/edit-lookover.vue").default,
            uiTip: require("../../../components/ui-tip.vue").default,
            trendsSelect: require('../../../components/trends-select').default,
        }
    }
</script>
