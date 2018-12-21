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
                min-width="95"
                inline-template>
                <div class="p-table-list-td-text" :title="row.virtual_order_id">{{row.virtual_order_id}}</div>
            </el-table-column>
            <el-table-column
                label="真实采购单号"
                min-width="95"
                inline-template>
                <div class="p-table-list-td-text" :title="row.real_order_id">
                    <permission tag="span"  :route="apis.url_publish_look_detail" @click="look_(row)"
                                style="color: #69f;cursor: pointer;" title="点击可查看采购详情">{{row.real_order_id}}
                    </permission>
                </div>
            </el-table-column>
            <el-table-column
                label="采购仓库"
                inline-template min-width="55">
                <div class="p-table-list-td-text" :title="row.virtual_warehouse_name">{{row.virtual_warehouse_name}}</div>
            </el-table-column>
            <el-table-column
                label="供应商"
                inline-template
                min-width="90">
                <div class="p-table-list-td-text" :title="row.virtual_supplier_name">{{row.virtual_supplier_name}}</div>
            </el-table-column>
            <el-table-column
                label="运费"
                inline-template min-width="80">
                <div>
                    <div class="p-table-list-td-text" :title="row.tracking_cost">{{row.tracking_cost}}</div>
                </div>
            </el-table-column>
            <el-table-column
                label="货款"
                inline-template min-width="80">
                <div class="p-table-list-td-text" :title="row.amount">{{row.amount}}</div>
            </el-table-column>
            <el-table-column
                label="应付款"
                inline-template>
                <div class="p-table-list-td-text" :title="row.payment_amount">{{row.payment_amount}}</div>
            </el-table-column>
            <el-table-column
                label="已付款"
                inline-template>
                <div class="p-table-list-td-text" :title="row.actual_payment">{{row.actual_payment}}</div>
            </el-table-column>
            <el-table-column
                label="结算方式"
                inline-template
                min-width="70">
                <div class="p-table-list-td-text" :title="row.balance_type">{{row.balance_type}}</div>
            </el-table-column>
            <el-table-column
                inline-template
                label="采购日期">
                <times :time="row.purchase_time"></times>
            </el-table-column>
            <el-table-column
                inline-template
                min-width="55"
                label="付款状态">
                <div class="p-table-list-td-text" :title="row.payment_status">{{row.payment_status}}</div>
            </el-table-column>
            <el-table-column
                inline-template
                min-width="55"
                label="采购状态">
                <div class="p-table-list-td-text" :style="statusColor(row.status)" :title="row.purchase_order_status">{{row.purchase_order_status}}</div>
            </el-table-column>
            <el-table-column
                inline-template
                min-width="55"
                label="运单号">
                <div>
                    <div v-if="!row.tracking_number">-- --</div>
                    <div v-else class="p-table-list-td-text"
                         :title="row.tracking_number">{{row.tracking_number}}
                    </div>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="到达时间"
                show-overflow-tooltip min-width="70">
                <times :time="row.arrived_time"></times>
            </el-table-column>
            <el-table-column
                inline-template
                min-width="70"
                label="推送状态">
                <div style="position: relative">
                    <span class="p-table-list-td-text">{{row.push_status | filterStatusTip}}</span>
                    <el-tooltip :content="row.push_error_msg" placement="right" effect="light" v-if="row.push_status ===-1">
                        <span class="error-icon ml-xs"></span>
                    </el-tooltip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                label="推送时间"
                show-overflow-tooltip min-width="70">
                <times :time="row.push_time"></times>
            </el-table-column>
            <el-table-column
                min-width="90"
                inline-template
                label="操作">
                <trends-select :key="row.id"
                               :selects="get_operate(row)"
                               @trigger="action($event,row)"></trends-select>
            </el-table-column>
        </el-table>
        <look-list
            v-model="lookVisable"
            :lookData="lookData"
            :listId="listId"
            :tableData="tableData">
        </look-list>
        <look-real-list v-model="lookRealVisable" :lookData="lookRealData" :edit="false" :listId="listIdReal"
                   @save-logistics="save_logistics">
        </look-real-list>
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
        url_publish_look_detail,
    } from "../../../api/purchase";
    import {api_get_virtual_purchase_order_id,url_get_virtual_purchase_order_id} from "@/api/virtual-purchase-order";
    const actions = {
        look: {
            name: "查看",
            api: url_get_virtual_purchase_order_id,
            action(id) {
                this.init_list(id);
            }
        }
    }
    export default {
        permission: {
            url_get_virtual_purchase_order_id,
            url_publish_look_detail
        },
        page: {
            devinfo: {
                frontEnd: '覃宏峰',
                backEnd: '黄伟杰',
                createTime: '2018-9-20',
                updateTime: '2018-9-25'
            }
        },
        data() {
            return {
                listId: '',
                lookData: {},
                arrivalData: {},
                lookVisable: false,
                lookRealVisable:false,
                lookRealData:{},
                listIdReal:''
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
            },
            lookVisable(val) {
                if (!val) {
                    this.editAble = false;
                }
            }
        },
        methods: {
            selectable(row, index) {
                return !this.checkedall;
            },
            statusColor(status){
                if(status===11||status===15){
                    return 'color: red;'
                }else{
                    return 'color:green';
                }
            },
            operateSelects(row) {
                let action = [];
                action.push(actions.look);
                return action;
            },
            get_operate(row) {
                let act = this.operateSelects(row);
                return act.filter(row => {
                    return this.$hasPermission(row.api)
                })
            },
            action(act, row) {
                this.listId = row.virtual_order_id.replace(/PO/g,'');
                act.action.call(this, this.listId);
            },
            selectionChange(value) {
                this.$emit("selection-change", value)
            },
            init_list(id) {
                this.lookData = {};
                this.$set(this.lookData, "shipping_cost", 0);
                this.$http(api_get_virtual_purchase_order_id, id).then(res => {
                    this.lookData = res;
                    this.lookVisable = true;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            //点击采购单号 查看
            look_(row) {
                this.lookRealData = {};
                this.listIdReal = row.real_order_id.replace(/PO/g,'');
                this.$set(this.lookRealData, "shipping_cost", 0);
                this.$http(api_look_detail, this.listIdReal).then(res => {
                    res.expect_arrive_date = datef('YYYY-MM-dd HH:mm:ss', res.expect_arrive_date);
                    this.lookRealData = res;
                    this.lookRealVisable = true;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            save_logistics(id) {
                this.$http(api_look_detail, id).then(res => {
                    res.expect_arrive_date = datef('YYYY-MM-dd HH:mm:ss', res.expect_arrive_date);
                    this.lookRealData = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
        },
        filters:{
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
        },
        computed: {
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
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
            lookList:require('./look-list').default,
            uiTip: require('@/components/ui-tip.vue').default,
            trendsSelect:require('@/components/trends-select').default,
            lookRealList:require('../../procurement/purchase/look-list').default,
        }
    }
</script>
