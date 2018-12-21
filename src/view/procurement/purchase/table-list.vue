<template>
    <el-row class="p-table-list">
        <look-logistics v-model="showLogistics"
                        :title="title"
                        :loading-logistics="loadingLogistics"
                        :logistics-data="logisticsData">
        </look-logistics>
        <look-list v-model="lookVisable"
                   :lookData="lookData"
                   :edit="edit"
                   :listId="listId"
                   :editAble="editAble"
                   :is-invalid-apply="isInvalidApply"
                   :is-invalid-audit="isInvalidAudit"
                   @save-logistics="save_logistics"
                   @cancel-look="cancel_look"
                   @invalid-audit="invalid_audit"
                   @invalid-apply="invalid_apply"></look-list>
        <print v-model="printVisable" :lookData="lookData" :listId="listId"></print>
        <arrival v-model="arrivalVisable" :arrival-data="arrivalData"></arrival>
        <record v-model="recordVisable" :record-data="recordData" @update-confirm="update_confirm"></record>
        <confirm-arrival v-model="confirmVisable" :arrival-list="arrivalList" :id="confirm_arrival_id" @confirm="confirm_arrival"></confirm-arrival>
        <el-table
            ref="purchaseTable"
            :data="tableData"
            border
            v-resize="{height:41}"
            style="width: 100%"
            highlight-current-row
            v-loading="loading"
            element-loading-text="玩命加载中..."
            @selection-change="handleSelectionChange">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                type="selection"
                width="30">
            </el-table-column>
            <el-table-column
                label="采购单号"
                min-width="100"
                inline-template>
                <div>
                    <span>{{row.order_code}}</span>
                    <div v-for="(item,key) in row.packInfo" :key="key" class="inline" style="cursor: pointer;">
                        <span v-if="item.status===1">
                            <img  @click="look_logistics(row,item,key)" src="../../../assets/receive_before.png" title="未接收(点击查看物流)">
                        </span>
                        <span v-else-if="item.status===2">
                            <img  @click="look_logistics(row,item,key)" src="../../../assets/receive_have.png" title="已接收未拆包(点击查看物流)">
                        </span>
                        <span v-else>
                            <img  @click="look_logistics(row,item,key)" src="../../../assets/receive_unpack.png" title="已拆包未入库(点击查看物流)">
                        </span>
                    </div>
                </div>
            </el-table-column>
            <el-table-column
                label="采购计划"
                inline-template min-width="65">
                <div class="p-table-list-td-text" :title="row.purchase_plan_number">{{row.purchase_plan_number}}</div>
            </el-table-column>
            <el-table-column
                label="采购仓库"
                inline-template min-width="55">
                <div class="p-table-list-td-text" :title="row.warehouse">{{row.warehouse}}</div>
            </el-table-column>
            <el-table-column
                label="供应商"
                inline-template
                min-width="90">
                <div class="p-table-list-td-text" :title="row.supplier">{{row.supplier}}</div>
            </el-table-column>
            <el-table-column
                label="运费"
                inline-template min-width="90">
                <div>
                    <div class="p-table-list-td-text" :title="row.shipping_cost | filterNumber">{{row.currency_code}} {{row.shipping_cost | filterNumber}}</div>
                </div>
            </el-table-column>
            <el-table-column
                label="货款"
                inline-template min-width="90">
                <div class="p-table-list-td-text" :title="row.amount | filterNumber">{{row.currency_code}} {{row.amount | filterNumber}}</div>
            </el-table-column>
            <el-table-column
                label="已申请付款"
                inline-template
                v-if="clientWidth" min-width="90">
                <div class="p-table-list-td-text" :title="row.process_amount | filterNumber">{{row.currency_code}} {{row.process_amount | filterNumber}}</div>
            </el-table-column>
            <el-table-column
                label="应付款"
                inline-template
                v-if="clientWidth">
                <div class="p-table-list-td-text" :title="row.payable_amount | filterNumber">{{row.currency_code}} {{row.payable_amount | filterNumber}}</div>
            </el-table-column>
            <el-table-column
                label="已付款"
                inline-template
                v-if="clientWidth">
                <div class="p-table-list-td-text" :title="row.actual_payment | filterNumber">{{row.currency_code}} {{row.actual_payment | filterNumber}}</div>
            </el-table-column>
            <el-table-column
                label="结算方式"
                inline-template
                v-if="clientWidth" min-width="60">
                <!--<ui-tip :content="row.balance_text" :width="98"></ui-tip>-->
                <div class="p-table-list-td-text" :title="row.balance_text">{{row.balance_text}}</div>
            </el-table-column>
            <el-table-column
                label="采购人员"
                min-width="60"
                inline-template>
                <div class="p-table-list-td-text" :title="row.purchaser">{{row.purchaser}}</div>
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
                <div class="p-table-list-td-text" :title="row.purchase_order_payment_status_text">{{row.purchase_order_payment_status_text}}</div>
            </el-table-column>
            <el-table-column
                inline-template
                min-width="55"
                label="采购状态">
                <div class="p-table-list-td-text" :style="statusColor(row.status)" :title="row.purchase_order_status_text">{{row.purchase_order_status_text}}</div>
            </el-table-column>
            <el-table-column
                inline-template
                min-width="55"
                label="运单号">
                <div>
                    <div v-if="row.tracking_number.length===0">-- --</div>
                    <div v-else v-for="(item,i) in row.tracking_number" class="p-table-list-td-text" :key="`${i}${item}`"
                         :title="item">{{item}}
                    </div>
                </div>
            </el-table-column>
            <el-table-column
                v-if="searchData.status===0||searchData.status===10"
                inline-template
                label="预计到达日期"
                min-width="70">
                <times :time="row.expect_arrive_date"></times>
            </el-table-column>
            <el-table-column
                v-if="searchData.status===11||searchData.status===15||searchData.status===20||searchData.status===21"
                inline-template
                label="实际到货日期"
                min-width="70">
                <times class="p-table-list-td-text" :time="row.in_time" :has-h-m-s="true"></times>
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
    }
</style>
<script>
    import trendsSelect from "../../../components/trends-select.vue"
    import lookList from "./look-list.vue"
    import print from "./print.vue"
    import arrival from "./arrival.vue"
    import record from "./record.vue"
    import {
        api_get_records,
        api_look_detail,
        api_edit_detail,
        api_cancel,
        api_purchase_arrival,
        api_publish_look_sku,
        url_publish_look_sku,
        api_publish_add_pur,
        api_get_purchase_record,
        api_log_detail,
        api_record_look_sku,
        url_publish_look_detail,
        url_cancel,
        url_purchase_arrival,
        get_purchase_record,
        url_publish_edit_detail,
        api_logistics_detail,
        api_invalid, url_invalid,
        api_purchase_order_id_invalidApply,
        url_purchase_order_id_invalidApply,
        api_purchase_order_sure_arrival,
        url_purchase_order_sure_arrival
    } from "../../../api/purchase";

    const actions = {
        look: {
            name: "查看",
            api: url_publish_look_detail,
            cond(row) {

            },
            action(row) {
                this.edit = false;
                this.init_list(row.id);
                this.editAble = false;
            }
        },
        wait_arrival: {
            name: '等待到货',
            api: url_cancel,
            action(row) {
                this.$confirm('此操作将更改订单状态, 确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.cancel_({id: row.id, status: 10})
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            }
        },
        arrival: {
            name: '到货',
            api: url_purchase_arrival,
            action(row) {
                this.arrivalVisable = true;
                this.purchase_arrival(row)
            }
        },
        arrival_record: {
            name: '到货记录',
            api: get_purchase_record,
            action(row) {
                let act = "view";
                this.recordVisable = true;
                this.purchase_recordData(row, act);
            }
        },
        print: {
            name: "打印",
            api: url_publish_edit_detail,
            action(row) {
                this.printVisable = true;
                this.print_init_list(row.id)
            }
        },
        nullify: {
            name: "作废",
            api: url_cancel,
            action(row) {
                this.edit = false;
                this.init_list(row.id);
                this.editAble = true;
            }
        },
        invalid_apply: {
            name: "申请作废",
            api: url_purchase_order_id_invalidApply,
            action(row) {
                this.edit = false;
                this.init_list(row.id);
                this.isInvalidApply = true;
            }
        },
        invalid_audit: {
            name: "作废审核",
            api: url_invalid,
            action(row) {
                this.edit = false;
                this.init_list(row.id);
                this.isInvalidAudit = true;
            }
        },
        pass: {
            name: "审核通过",
            action(row) {

            }
        },
        no_pass: {
            name: "审核不通",
            action(row) {

            }
        },
        no_wait_surplus: {
            name: "不等待剩余",
            api: get_purchase_record,
            action(row) {
                this.recordVisable = true;
                this.purchase_recordData(row);
            }
        },
        deal: {
            name: "处理",
            api: get_purchase_record,
            action(row) {
                this.recordVisable = true;
                this.purchase_recordData(row);
            }
        },
        confirm_arrival: {
            name: "确认到货",
            api: url_purchase_order_sure_arrival,
            action(row) {
                this.confirmVisable = true;
                this.get_arrival_record(row);
            }
        }
    };
    export default {
        permission: {
            url_publish_look_detail,
            url_cancel,
            url_purchase_arrival,
            get_purchase_record,
            url_publish_edit_detail,
            url_invalid,
            url_purchase_order_id_invalidApply,
            url_purchase_order_sure_arrival
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
                listId: 0,
                printVisable: false,
                arrivalVisable: false,
                recordVisable: false,
                confirmVisable:false,
                editAble: false,
                isInvalidApply: false,
                isInvalidAudit: false,
                lookData: {},
                arrivalData: {},
                recordData: {
                    purchase_order_code: '',
                    supplier_name: '',
                    status: '',
                    partial_arrival_status: '',
                    buttons: {},
                    act: '',
                    actionLog: [],
                    skus: [],
                    freight:'',
                    currency_code:''
                },
                edit: false,
                lookVisable: false,
                loading: true,
                logisticsData: [],
                showLogistics: false,
                loadingLogistics: true,
                title:'',
                arrivalList:[],
                confirm_arrival_id:''
            }
        },
        methods: {
            get_arrival_record(row){
                this.arrivalList = [];
                this.$http(api_publish_look_sku,{purchase_order_id:row.id,page:1,pageSize:500}).then(res=>{
                    this.arrivalList = res.data;
                    this.arrivalList.forEach(row=>{
                        this.$set(row,'arrival_num',`${row.qty-row.in_qty}`);
                    });
                    this.confirm_arrival_id = row.id;
                }).catch(code=>{
                    this.$message({type:'warning',message:code.message||code});
                })
            },
            confirm_arrival(id){
                if(this.arrivalList.every(row=>row.arrival_num==="0")){
                    this.$reqKey('url_purchase_order_sure_arrival',false);
                    this.$message({type:'warning',message:'本次到货数量不能全部为零！'});
                    return
                }
                let data = {
                    id,
                    sku:JSON.stringify(this.arrivalList.map(row=>{
                        return {
                            sku_id:row.sku_id,
                            qty:row.arrival_num
                        }
                    }))
                };
                this.$http(api_purchase_order_sure_arrival,data).then(res=>{
                    this.$message({type:'success',message:res.message||res});
                    this.confirmVisable = false;
                    this.tableData.forEach(row=>{
                        if(row.id===id&&res.data){
                            Object.keys(row).forEach(key=>{
                                row[key] = res.data[key];
                            });
                        }
                    });
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_purchase_order_sure_arrival',false);
                    },200);
                });
            },
            statusColor(status){
                if(status===11||status===15){
                    return 'color: red;'
                }else{
                    return 'color:green';
                }
            },
            save_logistics() {
                this.init_list(this.listId);
            },
            operateSelects(row) {
                let action = [];
                if (row.buttons.is_display_view_bt === 1) {
                    action.push(actions.look);
                }
                if (row.buttons.is_display_print_bt === 1) {
                    action.push(actions.print);
                }
                if (row.buttons.is_display_invalid_bt === 1) {
                    action.push(actions.nullify);
                }
                if (row.buttons.is_display_invalid_apply_bt === 1) {
                    action.push(actions.invalid_apply);
                }
                if (row.buttons.is_display_invalid_audit_bt === 1) {
                    action.push(actions.invalid_audit);
                }
                if (row.buttons.is_display_waiting_goods_bt === 1) {
                    action.push(actions.wait_arrival);
                }
                if (row.buttons.is_display_arrival_record_goods_bt === 1) {
                    action.push(actions.arrival_record);
                }
                if (row.buttons.is_display_handle_bt === 1) {
                    action.push(actions.deal);
                }
                if (row.buttons.is_display_waiting_remainder_bt === 1) {
                    action.push(actions.no_wait_surplus);
                }
                if (row.buttons.is_display_sure_arrival_bt === 1){
                    action.push(actions.confirm_arrival);
                }
                return action;
            },
            get_operate(row) {
                let act = this.operateSelects(row);
                return act.filter(row => {
                    return this.$hasPermission(row.api)
                })
            },
            handleSelectionChange(value) {
                this.$emit("data-change", value)
            },
            //作废
            cancel_look(obj) {
                this.cancel_(obj);
            },
            invalid_audit(id, data) {
                this.$http(api_invalid, id, data).then(res => {
                    if(data.status==='pass'){
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                        this.tableData.forEach(row => {
                            if (id === row.id) {
                                row.purchase_order_status_text = '作废';
                                row.buttons.is_display_print_bt = 0;
                                row.buttons.is_display_invalid_bt = 0;
                                row.buttons.is_display_waiting_goods_bt = 0;
                                row.buttons.is_display_arrival_record_goods_bt = 0;
                                row.buttons.is_display_handle_bt = 0;
                                row.buttons.is_display_waiting_remainder_bt = 0;
                                row.buttons.is_display_invalid_audit_bt = 0;
                                row.buttons.is_display_invalid_apply_bt = 0;
                            }
                        });
                    }else{
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                        this.tableData.forEach(row => {
                            if (id === row.id) {
                                row.purchase_order_status_text = res.purchase_order_status_text;
                                row.status = res.status;
                            }
                        });
                    }
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            //申请作废
            invalid_apply(id, data) {
                this.$http(api_purchase_order_id_invalidApply, id, data).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.tableData.forEach(row => {
                        if (id === row.id) {
                            row.purchase_order_status_text = '作废待审';
                            row.buttons.is_display_invalid_audit_bt = 1;
                            row.buttons.is_display_invalid_apply_bt = 0;
                        }
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            //点击查看 编辑等
            action(act, row) {
                this.listId = row.id;
                act.action.call(this, row);
            },
            //请求查看数据
            init_list(id) {
                this.lookData = {};
                this.$set(this.lookData, "shipping_cost", 0);
                this.$http(api_look_detail, id).then(res => {
                    res.expect_arrive_date = datef('YYYY-MM-dd', res.expect_arrive_date);
                    this.lookData = res;
                    this.lookData.purchase_order_code = 'PO' + res.id;
                    this.lookVisable = true;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            //请求编辑数据
            edit_init_list(id) {
                this.loading = true;
                this.lookData = {};
                this.$http(api_edit_detail, id).then(res => {
                    res.expect_arrive_date = datef('YYYY-MM-dd', res.expect_arrive_date)
                    this.lookData = res;
                    this.loading = false;
                    this.lookVisable = true;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            print_init_list(id) {
                this.lookData = {};
                this.$http(api_edit_detail, id).then(res => {
                    res.expect_arrive_date = datef('YYYY-MM-dd', res.expect_arrive_date)
                    this.lookData = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            //作废
            cancel_(data) {
                this.$http(api_cancel, data).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.tableData.forEach(row => {
                        if (data.id === row.id) {
                            if (data.status === -1) {
                                row.purchase_order_status_text = '作废';
                                row.buttons.is_display_print_bt = 0;
                                row.buttons.is_display_invalid_bt = 0;
                                row.buttons.is_display_waiting_goods_bt = 0;
                                row.buttons.is_display_arrival_record_goods_bt = 0;
                                row.buttons.is_display_handle_bt = 0;
                                row.buttons.is_display_waiting_remainder_bt = 0;
                            } else if (data.status === 10) {
                                row.purchase_order_status_text = '等待到货';
                            }
                        }
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            //到货
            purchase_arrival(data) {
                this.$http(api_purchase_arrival, {order_id: data.id}).then(res => {
                    this.arrivalData = res;
                    this.arrivalData.detail.forEach(data => {
                        this.$set(data, 'purchase_qty', 0);
                        this.$set(data, 'remainder', '');
                        this.$set(data, 'checked', false);
                    })
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            //到货记录&不等待剩余
            purchase_recordData(data, act) {
                this.$http(api_get_purchase_record, data.id).then(res => {
                    Object.assign(this.recordData,res);
                    this.recordData.order_code = `PO${res.id}`;
                    this.recordData.act = act;
                    if (act === "view") {
                        this.$http(api_record_look_sku, {id: data.id}).then(res => {
                            this.recordData.skus = res.list;
                        }).catch(code => {
                            this.$message({message: code.message || code, type: 'error'});
                        })
                    } else {
                        this.$http(api_get_records, {id: data.id}).then(res => {
                            this.recordData.skus = res;
                        }).catch(code => {
                            this.$message({message: code.message || code, type: 'error'});
                        })
                    }
                    this.$http(api_log_detail, {purchase_order_id: data.id, log_type: 4}).then(res => {
                        this.recordData.actionLog = res.data;
                    }).catch(code => {
                        this.$message({message: code.message || code, type: 'error'});
                    })

                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                })
            },
            update_confirm(param) {
                this.tableData.forEach(row => {
                    if (row.purchase_order_code === `OP${param.purchase_order_id}`) {
                        if (param.action === 'pass') {
                            if (this.selecStatus === '') {
                            } else {
                                let index = this.tableData.findIndex(item => {
                                    return item.purchase_order_code === `OP${param.purchase_order_id}`
                                });
                                this.tableData.splice(index, 1);
                            }
                        } else if (param.action === 'apply') {
                            row.buttons.is_display_waiting_remainder_bt = 0;
                            row.partial_arrival_status = 1;
                        } else if (param.action === 'refuse') {
                            row.buttons.is_display_handle_bt = 1;
                            row.partial_arrival_status = 3;
                        }
                    }
                });

            },
            get_height() {
                let pageEle = document.getElementById('n-content');
                let rect = pageEle.getBoundingClientRect();
                let heig = rect.height - 71 - 46 - 31 - 5;
                this.hei = heig
            },
            look_logistics(row,data,key) {
                if(!data.external_number){
                    window.open(`http://cha.chawuliu.cn/?stype=kd&q=${key}`);
                }else {
                    this.$http(api_logistics_detail, data.external_number).then(res => {
                        this.logisticsData = res.data;
                        this.logisticsData.forEach((obj) => {
                            obj.external_number = data.external_number;
                            obj.logisticsSteps.reverse();
                        });
                        this.loadingLogistics = false;
                        this.title = `查看采购单号：${row.order_code}的物流跟踪信息`;
                        this.showLogistics = true;
                    }).catch(code => {
                        this.$message({message: code.message || code, type: 'error'});
                    });
                }
            }
        },
        filters: {
            filterNumber(val) {
                if (Number(val) > 0) {
                    return Number(val).toFixed(3);
                } else {
                    return '-- --';
                }
            },
            filterTrackingNumber(val) {
                return val === '' ? '-- --' : val;
            },
            filterCode(val) {

            }
        },
        computed: {
            clientWidth() {
                if (document.body.clientWidth > 1366) {
                    return true;
                } else {
                    return false;
                }
            },
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            }
        },
        watch: {
            value(val) {
                this.loading = val;
            },
            loading(val) {
                this.$emit('input', val);
            },
            lookVisable(val) {
                if (!val) {
                    this.editAble = false;
                    this.isInvalidApply = false;
                    this.isInvalidAudit = false;
                }
            }
        },
        props: {
            value: {},
            selecStatus: {},
            tableData: {
                required: true,
                type: Array
            },
            firstLoading: {
                required: true,
                type: Boolean
            },
            searchData:{
                required: true,
                type:Object
            }
        },
        components: {
            lookLogistics: require('./look-logistics').default,
            trendsSelect,
            lookList,
            print,
            arrival,
            record,
            uiTip: require('../../../components/ui-tip.vue').default,
            confirmArrival:require('./confirm-arrival').default,
        }
    }
</script>
