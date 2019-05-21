<template>
    <div class="c-long-not-opened-table">
        <el-table class="scroll-bar"
                  border :data="tableData"
                  highlight-current-row
                  :row-class-name="row_class_name"
                  v-resize="{height:41}"
                  @selection-change="batch_select"
                  v-loading="loading"
                  element-loading-text="玩命加载中...">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection" width="30"></el-table-column>
            <el-table-column label="处理状态" min-width="40" inline-template>
                <div class="p-table-list-td-text" :title="row.processing_status_text">{{row.processing_status_text}}
                </div>
            </el-table-column>
            <el-table-column label="运输方式" min-width="50" inline-template>
                <div class="p-table-list-td-text" :title="row.shipping_methods">{{row.shipping_methods}}</div>
            </el-table-column>
            <el-table-column label="运单号" min-width="60" inline-template>
                <div class="p-table-list-td-text" :title="row.tracking_number">{{row.tracking_number}}</div>
            </el-table-column>
            <el-table-column label="采购单号" min-width="60" inline-template>
                <div class="p-table-list-td-text" :title="row.purchase_order_ids|filterPurchaseOrder">
                    {{row.purchase_order_ids|filterPurchaseOrder}}
                </div>
            </el-table-column>
            <el-table-column label="采购员" min-width="60" inline-template>
                <div class="p-table-list-td-text" :title="row.purchaser_user_name_list|filterPurchaseUsers">
                    {{row.purchaser_user_name_list|filterPurchaseUsers}}
                </div>
            </el-table-column>
            <el-table-column label="预接收时间" min-width="60" inline-template>
                <div class="p-table-list-td-text" :title="row.ready_receive_time|timeFilter">
                    {{row.ready_receive_time|timeFilter}}
                </div>
            </el-table-column>
            <el-table-column label="接收时间" min-width="60" inline-template>
                <div class="p-table-list-td-text" :title="row.create_time|timeFilter">{{row.create_time|timeFilter}}
                </div>
            </el-table-column>
            <el-table-column label="包裹状态" min-width="50" inline-template>
                <div class="p-table-list-td-text" :title="row.is_use_text">{{row.is_use_text}}</div>
            </el-table-column>
            <el-table-column label="异常类型" min-width="80" inline-template>
                <div class="p-table-list-td-text" :title="row.abnormal_type_text">{{row.abnormal_type_text}}</div>
            </el-table-column>
            <el-table-column label="创建人" min-width="50" inline-template>
                <div class="p-table-list-td-text" :title="row.create_abnormal_user">{{row.create_abnormal_user}}</div>
            </el-table-column>
            <el-table-column label="创建时间" min-width="60" inline-template>
                <div class="p-table-list-td-text" :title="row.process_begin_time|timeFilter">
                    {{row.process_begin_time|timeFilter}}
                </div>
            </el-table-column>
            <el-table-column label="仓库处理人" min-width="40" inline-template>
                <div class="p-table-list-td-text" :title="row.process_warehouse_user">{{row.process_warehouse_user}}
                </div>
            </el-table-column>
            <el-table-column label="采购确认人" min-width="40" inline-template>
                <div class="p-table-list-td-text" :title="row.confirmed_purchase_user">{{row.confirmed_purchase_user}}
                </div>
            </el-table-column>
            <el-table-column label="组长审批" min-width="40" inline-template>
                <div class="p-table-list-td-text" :title="row.audit_leader">{{row.audit_leader}}</div>
            </el-table-column>
            <el-table-column label="经理审批" min-width="40" inline-template>
                <div class="p-table-list-td-text" :title="row.audit_manager">{{row.audit_manager}}</div>
            </el-table-column>
            <!--<el-table-column label="处理时间" width="84" inline-template>-->
            <!--<div class="p-table-list-td-text" :title="row.follow_up_time|timeFilter">{{row.follow_up_time|timeFilter}}</div>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="确认时间" width="84" inline-template>-->
            <!--<div class="p-table-list-td-text" :title="row.process_end_time|timeFilter">{{row.process_end_time|timeFilter}}</div>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="组长审批时间" width="88" inline-template>-->
            <!--<div class="p-table-list-td-text" :title="row.audit_leader_time|timeFilter">{{row.audit_leader_time|timeFilter}}</div>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="经理审批时间" width="88" inline-template>-->
            <!--<div class="p-table-list-td-text" :title="row.audit_manager_time|timeFilter">{{row.audit_manager_time|timeFilter}}</div>-->
            <!--</el-table-column>-->
            <el-table-column label="操作" width="120" inline-template>
                <div>
                    <trends-select
                        class="inline ml-sm btn-trends-select-relative"
                        :selects="filterOptions(row,row.abnormal_type)"
                        type="primary"
                        @trigger="handles(row,$event)"></trends-select>
                </div>
            </el-table-column>
        </el-table>
        <look-rests-info v-model="lookRestsDialog" :look-rests-data='lookRestsData'></look-rests-info>
        <look-edit-package v-model="lookPackageDialog"
                           :dialog-title="dialogTitle"
                           :is-edit="isEdit"
                           :is-examine-approve="isExamineApprove"
                           :look-package-orders-data="lookPackageOrdersData"
                           @update-table="updateTable"
                           :look-package-data="lookPackageData"></look-edit-package>
    </div>
</template>

<style lang="stylus">
    .c-long-not-opened-table {
        .p-table-list-td-text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
</style>

<script>
    import {
        api_get_purchase_order_abnormal_abnormal_id,
        url_get_purchase_order_abnormal_abnormal_id,
        api_get_purchase_order_abnormal_id_lost,
        url_get_purchase_order_abnormal_id_lost,
        api_put_purchase_order_abnormal_id_end_difference_parcel,
        url_put_purchase_order_abnormal_id_end_difference_parcel,
        url_put_purchase_order_abnormal_id_review_leader,
        url_put_purchase_order_abnormal_id_review_manager
    } from '@/api/long-not-opened'

    const handleOptions = [  //全部
        {label: '查看', value: 0, api: ''},
        {label: '完结', value: 1, api: url_put_purchase_order_abnormal_id_end_difference_parcel},
        {label: '确认数量', value: 2, api: url_get_purchase_order_abnormal_id_lost},
        {label: '审批', value: 3, api: ''}
    ];
    export default {
        data() {
            return {
                selectedData: [],
                lookRestsDialog: false,
                lookPackageDialog: false,
                isEdit: false,
                lookRestsData: {},
                lookPackageOrdersData: [],
                lookPackageData: {},
                dialogTitle: '',
                isExamineApprove: false
            }
        },
        filters: {
            timeFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
            filterPurchaseOrder(val) {
                return val && typeof val === 'string' ? `PO${val}` : val
            },
            filterPurchaseUsers(val) {
                return Array.isArray(val) ? val.toString() : val
            }
        },
        methods: {
            row_class_name(row) {
                return row.row_color === 'red' ? 'red' : 'black'
            },
            filterOptions(tableRow, abnormal_type) {
                let find = handleOptions.find(row => row.value === 0);
                if (find) {
                    find.api = abnormal_type === 2 ? url_get_purchase_order_abnormal_id_lost : url_get_purchase_order_abnormal_abnormal_id;
                }
                return handleOptions.filter(handleRow => {
                    switch (handleRow.value) {
                        case 0:
                            return tableRow.buttons.is_display_view_bt === 1 && this.$hasPermission(handleRow.api);
                        case 1:
                            return tableRow.buttons.is_display_finish_bt === 1 && this.$hasPermission(handleRow.api);
                        case 2:
                            return tableRow.buttons.is_display_confirm_bt === 1 && this.$hasPermission(handleRow.api);
                        case 3:
                            this.userJob === 2 ? handleRow.api = url_put_purchase_order_abnormal_id_review_leader : handleRow.api = url_put_purchase_order_abnormal_id_review_manager;
                            return tableRow.buttons.is_display_audit_bt === 1 && this.$hasPermission(handleRow.api);
                        default:
                            return this.$hasPermission(handleRow.api);
                    }
                })
            },
            batch_select(val) {
                this.selectedData = val;
            },
            handles(row, handle) {
                switch (handle.value) {
                    case 0:
                        this.isExamineApprove = false;
                        this.isEdit = false;
                        this.init_edit_look(row, handle.value, '查看丢失数量');  //查看
                        break;
                    case 1:
                        this.isExamineApprove = false;
                        this.finish(row);    //完结
                        break;
                    case 2:
                        this.isExamineApprove = false;
                        this.init_edit_look(row, handle.value, '确认丢失数量');  //确认数量
                        break;
                    case 3:
                        this.isExamineApprove = true;
                        this.init_edit_look(row, handle.value, '审批');  //审批
                        break;
                }
            },
            init_edit_look(row, type, title) {
                this.isEdit = type === 2;
                let api = row.abnormal_type === 2 ? api_get_purchase_order_abnormal_id_lost : api_get_purchase_order_abnormal_abnormal_id;
                let abnormal_id = row.abnormal_id;
                this.$http(api, abnormal_id).then(res => {
                    if (row.abnormal_type === 2) {
                        this.dialogTitle = title;
                        this.lookPackageOrdersData = res.data;
                        this.$set(this.lookPackageData, 'remark', res.remark || '');
                        type === 3 && (this.$set(this.lookPackageData, 'user_job', res.user_job));
                        this.$set(this.lookPackageData, 'purchase_parcels_id', res.purchase_parcels_id);
                        this.$set(this.lookPackageData, 'abnormal_id', abnormal_id);
                        this.lookPackageDialog = true;
                    } else {
                        this.lookRestsData = res.data;
                        this.lookRestsDialog = true;
                    }
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                });
            },
            finish(row) {
                this.$http(api_put_purchase_order_abnormal_id_end_difference_parcel, row.abnormal_id, {method: 1}).then(res => {
                    row.row_color = res.row_color;
                    row.processing_status_text = res.processing_status_text;
                    this.$message({type: 'success', message: res.message || res});
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            updateTable(data, abnormal_id) {
                let find = this.tableData.find(row => row.abnormal_id === abnormal_id);
                if (find) {
                    Object.assign(find, data);
                }
            }
        },
        computed: {
            emptyText() {
                return this.firstLoading ? '请查询数据' : '暂无数据'
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
            firstLoading: {
                required: true,
                type: Boolean
            },
            userJob: {
                required: true,
                type: Number
            }
        },
        components: {
            lookRestsInfo: require('./look-rests-info').default,
            lookEditPackage: require('./look-edit-package').default,
            uiTip: require('@/components/ui-tip').default,
            trendsSelect: require('@/components/trends-select').default
        }
    }
</script>
