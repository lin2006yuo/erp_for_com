<template>
    <el-row class="p-table-list">
        <el-table
            class="delivery-table"
            ref="tableData"
            :data="tableData"
            border
            v-resize="{height:41}"
            style="width: 100%"
            highlight-current-row
            v-loading="loading"
            element-loading-text="玩命加载中..."
            @selection-change="selectionChange">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                :selectable="selectable"
                type="selection"
                width="30">
            </el-table-column>
            <el-table-column
                label="虚拟采购单号"
                min-width="80"
                inline-template>
                <div>
                    <span>{{row.virtual_order_id}}</span>
                </div>
            </el-table-column>
            <el-table-column label="真实采购单号" min-width="80" inline-template>
                <div style="cursor: pointer;">
                    <permission tag="span" :route="apis.url_publish_look_detail" @click="look_(row)"
                                style="color: #69f;" title="点击可查看采购详情">{{row.purchase_order_code}}
                    </permission>
                </div>
            </el-table-column>
            <el-table-column
                label="供应商"
                inline-template
                min-width="90">
                <div class="p-table-list-td-text" :title="row.virtual_supplier_name">{{row.virtual_supplier_name}}</div>
            </el-table-column>
            <el-table-column
                label="结算方式"
                inline-template
                min-width="80">
                <div class="p-table-list-td-text" :title="row.balance_type">{{row.balance_type}}</div>
            </el-table-column>
            <el-table-column
                inline-template
                min-width="60"
                label="采购单状态">
                <div class="p-table-list-td-text" :style="statusColor(row.status)" :title="row.purchase_order_status">{{row.purchase_order_status}}</div>
            </el-table-column>
            <el-table-column
                label="应付款"
                inline-template
                min-width="85">
                <div class="p-table-list-td-text" :title="row.payable | filterNumber">{{row.currency_code}} {{row.payable | filterNumber}}</div>
            </el-table-column>
            <el-table-column
                label="本次付款"
                inline-template
                min-width="85">
                <div class="p-table-list-td-text" :title="row.payment_amount | filterNumber">{{row.currency_code}} {{row.payment_amount | filterNumber}}</div>
            </el-table-column>
            <el-table-column
                inline-template
                min-width="55"
                label="审核状态">
                <div class="p-table-list-td-text" :title="row.review_status_text">{{row.review_status_text}}</div>
            </el-table-column>
            <el-table-column
                inline-template
                min-width="55"
                label="付款状态">
                <div class="p-table-list-td-text" :title="row.payment_status">{{row.payment_status}}</div>
            </el-table-column>
            <el-table-column label="申请时间" inline-template min-width="100" >
                <ui-tip :content="`${dataFilter(row.create_time)}`" :width="88"></ui-tip>
            </el-table-column>
            <el-table-column
                inline-template
                min-width="60"
                label="推送状态">
                <div style="position: relative">
                    <span class="p-table-list-td-text">{{row.push_status | filterStatusTip}}</span>
                    <el-tooltip :content="row.push_error_msg" placement="right" effect="light" v-if="row.push_status ===-1">
                        <span class="error-icon ml-xs"></span>
                    </el-tooltip>
                </div>
            </el-table-column>
            <el-table-column label="推送时间" inline-template min-width="100" >
                <ui-tip :content="`${dataFilter(row.push_time)}`" :width="88"></ui-tip>
            </el-table-column>
            <el-table-column label="付款时间" inline-template min-width="100" >
                <ui-tip :content="`${dataFilter(row.payment_time)}`" :width="88"></ui-tip>
            </el-table-column>
            <el-table-column label="操作" inline-template>
                <trends-select @trigger="action(row, $event)"
                               :selects="m_option(row)"
                               type="primary">
                </trends-select>
            </el-table-column>
        </el-table>
        <look-list v-model="lookVisable" :lookData="lookData" :edit="false" :listId="listId"
                   @save-logistics="save_logistics">
        </look-list>
        <look-edit v-model="lookView"
                   :look-data="lookData"
                   :title="title"
                   :is-look="isLook"
                   :is-audit="isAudit"
                   :row-id="id"
                   :tableData="tableData"
                   @search="$listeners['search']">
        </look-edit>
    </el-row>
</template>
<style lang="stylus">
    .p-table-list {
        overflow-y: hidden;
        .el-table__body-wrapper {
            overflow-x: hidden;
        }

        .el-button--warning {
            background: #008BCE;
            border-color: #008BCE;
        }

        .el-button.el-button--mini.el-button--warning.el-dropdown__caret-button {
            height: 23px;
        }

        .el-button.el-button--warning.el-button--mini {
            height: 23px;
        }

        .trend {
            height: 23px;
            margin: 0
        }

        .align {
            text-align: left;
        }

        .trends-select {
            height: 26px;
        }
        .p-table-list-td-text{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .delivery-table {
            .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
                background-color: #008BCE;
            }
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
    }
</style>
<script>
    import {
        api_look_detail,
        api_log_read,
        url_log_read,
        api_log_audit,
        url_log_audit,
        url_publish_look_detail,
    } from "../../../api/purchase";
    import lookList from "../../procurement/purchase/look-list.vue"
    export default {
        permission: {
            url_publish_look_detail,
            url_log_read,
            url_log_audit,
        },
        page: {
            devinfo: {
                frontEnd: '张兵根;张明亮;黎宏珍',
                backEnd: '杨伟权;谭斌',
                createTime: '2017-1-10',
                updateTime: '2017-8-22'
            }
        },
        data() {
            return {
                id:'',
                operateButtons: [// 操作下拉框
                    {
                        label: '查看', apis: url_log_read,
                        action: (row) => {
                            this.lookData = {};
                            this.$http(api_log_read, row.virtual_finance_purchase_id).then(res => {
                                this.lookData = res;
                                this.isLook = true;
                                this.isAudit = false;
                                this.lookView = true;
                                this.title = `查看虚拟付款申请`;
                                this.id = row.virtual_finance_purchase_id;
                            }).catch(code => {
                                this.$message({type: 'error', message: code.message || code});
                            });
                        }
                    },
                    {
                        label: '审核', apis: url_log_audit,
                        action: (row) => {
                            this.lookData = {};
                            this.$http(api_log_audit, row.virtual_finance_purchase_id).then(res => {
                                this.lookData = res;
                                this.isLook = false;
                                this.isAudit = true;
                                this.lookView = true;
                                this.title = `审核虚拟付款申请`;
                                this.id = row.virtual_finance_purchase_id;
                            }).catch(code => {
                                this.$message({type: 'error', message: code.message || code});
                            });
                        }
                    },
                ],
                isAudit: false,
                lookView:false,
                isLook: false,
                listId: 0,
                lookData: {},
                editAble: false,
                arrivalData: {},
                recordData: {
                    purchase_order_code: '',
                    supplier_name: '',
                    status: '',
                    partial_arrival_status: '',
                    buttons: {},
                    act: '',
                    actionLog: [],
                    freight:'',
                    currency_code:''
                },
                edit: false,
                lookVisable: false,
                logisticsData: [],
                showLogistics: false,
                loadingLogistics: true,
                title:'',
                arrivalList:[],
            }
        },
        methods: {
            //全选时
            selectable(row, index) {
                return !this.checkedall;
            },
            action(row, act) {
                act.action.call(this, row);
            },
            m_option(row) {
                return row.operateButtons.filter(res => {
                    return this.$hasPermission(res.apis);
                })
            },
            //点击真实采购单号 查看详情
            look_(row) {
                this.lookVisable = true;
                this.lookData = {};
                this.$set(this, "listId", row.purchase_order_id);
                this.$set(this.lookData, "shipping_cost", 0);
                this.$http(api_look_detail, row.purchase_order_id).then(res => {
                    res.expect_arrive_date = datef('YYYY-MM-dd HH:mm:ss', res.expect_arrive_date)
                    this.lookData = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            dataFilter(val){
                return datef('YYYY-MM-dd HH:mm:ss',val);
            },
            statusColor(status){
                if(status===11||status===15){
                    return 'color: red;'
                }else{
                    return 'color:green';
                }
            },
            save_logistics(id) {
                this.$http(api_look_detail, id).then(res => {
                    res.expect_arrive_date = datef('YYYY-MM-dd HH:mm:ss', res.expect_arrive_date)
                    this.lookData = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            selectionChange(value) {
                this.$emit("selection-change", value)
            },
        },
        filters: {
            filterStatusTip(val){
                switch(val){
                    case -1:
                        return "推送失败";
                        break;
                    case 1:
                        return "推送成功";
                        break;
                    case 0:
                        return "未推送";
                        break;
                    default:
                        return "推送成功"
                }
            },
            filterNumber(val) {
                if (Number(val) > 0) {
                    return Number(val).toFixed(4);
                } else {
                    return '-- --';
                }
            },
        },
        computed: {
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            }
        },
        watch: {
            checkedall(val) {
                if (val) {
                    this.tableData.forEach(row => {
                        this.$refs.tableData.toggleRowSelection(row, true);
                    })
                } else {
                    this.tableData.forEach(row => {
                        this.$refs.tableData.toggleRowSelection(row, false);
                    })
                }
            },
            tableData(val) {
                if (this.checkedall) {
                    this.tableData.forEach(row => {
                        this.$nextTick(() => {
                            this.$refs.tableData.toggleRowSelection(row, true);
                        })
                    })
                } else {
                    this.tableData.forEach(row => {
                        this.$refs.tableData.toggleRowSelection(row, false);
                    })
                }
                val.forEach(row => {
                    if (row.button.is_review_bt === 1) {
                        this.$set(row, 'operateButtons', this.operateButtons);
                    } else {
                        this.$set(row, 'operateButtons', this.operateButtons.slice(0, 1));
                    }
                });
            },
            lookVisable(val) {
                if (!val) {
                    this.editAble = false;
                }
            }
        },
        props: {
            checkedall:{
                required: true,
                type: Boolean
            },
            loading: {
                required:true,
                type:Boolean
            },
            tableData: {
                required: true,
                type: Array
            },
            firstLoading: {
                required: true,
                type: Boolean
            }
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default,
            trendsSelect: require('@/components/trends-select.vue').default,
            lookEdit: require('./look-edit.vue').default,
            lookList,
        }
    }
</script>
