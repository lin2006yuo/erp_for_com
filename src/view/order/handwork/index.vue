<template>
    <page class="p-index-manual">
        <card-search
            :form="form"
            :clears="clears"
            @change-date="change_date"
            @select-button="select_button"
            @search="search"
            @clear-search="clear_search"
            @select-payment="select_payment"
        ></card-search>
        <div class="mt-sm mb-sm">
            <permission tag="trendsSelect"
                        class="inline ml-sm p-btn-select"
                        type="primary"
                        :route="apis.url_manual_orders_export"
                        :selects="partAllOptions"
                        @trigger="export_sku"></permission>
            <permission tag="request-button"
                        class="inline"
                        :mintime="200"
                        req-key="url_cancel_logistics"
                        :route="apis.url_cancel_logistics"
                        @click="cancel_logistics">取消物流
            </permission>
            <permission tag="request-button"
                        class="inline p-btn-request"
                        :route="apis.url_again_running_rule"
                        :disabled="orderIdList.length<=0"
                        req-key="url_again_running_rule"
                        @click="cancel_running_rule">重新跑规则
            </permission>
            <permission tag="request-button"
                        :route="apis.url_update_shipping"
                        class="inline"
                        :mintime="200"
                        req-key="api_warehouse_remote"
                        @click="shipping_show">更改运输方式
            </permission>
            <div class="inline reset-position">
                <request-button
                    class="inline ml-sm"
                    :req-key="`label${index}`"
                    v-for="(item,index) in buttons"
                    :key="item.label"
                    :disabled="disabled(item)"
                    @click.native="cur_click(item,index)"
                >{{item.label}}
                </request-button>
            </div>
            <permission tag="ElButton"
                        class="inline mr-mini"
                        size="mini"
                        type="primary"
                        :route="apis.url_batch_invalid"
                        @click="batch_reissue">批量补发手工单
            </permission>
            <permission tag="request-button"
                        class="inline mr-mini"
                        :route="apis.url_batch_invalid"
                        :mintime="200"
                        req-key="url_batch_remark"
                        @click="batch_invalid">批量作废订单
            </permission>
            <permission tag="ElButton"
                        :route="apis.url_orders_batch_change_warehouse"
                        class="inline"
                        size="mini"
                        type="primary"
                        @click="batch_change_warehouse">批量修改仓库
            </permission>
        </div>
        <data-table
            class="mt-sm"
            :cur-width="curWidth"
            :table-data="tableData"
            @select-change="select_change"
            @current-change="current_change"
            @size-change="size_change"
            :is-load="isLoading"
            :isFirst="isFirst"
            @cur-operate-g="cur_operate_g"
            @cancel-invalid="cancel_invalid"
        ></data-table>
        <el-dialog title="更改运输方式" :visible.sync="resultShow" :close-on-click-modal="false">
            <label-item label="发货仓库：" class="ml-sm mr-sm">
                <el-select style="width:170px"
                           v-model="warehouse_id"
                           @change="change_warehouse"
                           filterable clearable>
                    <el-option v-for="item in warehouseList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </label-item>
            <div class="br-show" style="height: 3px;display: none"></div>
            <label-item label="运输方式：">
                <el-select class="width-super"
                           v-model="shipping_id"
                           :placeholder="shippingPlaceholder"
                           :disabled="shippingList.length<=1"
                           filterable clearable>
                    <el-option v-for="item in shippingList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <span slot="footer" class="dialog-footer">
                    <el-button size="mini" type="primary" @click="update_shipping">确认</el-button>
                    <el-button size="mini" @click="resultShow = false">关闭</el-button>
                </span>
        </el-dialog>
        <add-order v-model="addDialog" @save="save_new"></add-order>
        <mport-order v-model="mportVisiable" @save="save_mport"></mport-order>
        <export-field :param="export_model_type" v-model="exportVisable" :fields="fields" :templates="templates"
                      @getTemplate="get_templates" title="请选择自定义导出字段" :creat-excel="creat_excel"></export-field>
        <export-dialog v-model="export_visible"></export-dialog>
        <batch-remark v-model="remarkDialog"
                      :title="title"
                      :api="batch_api"
                      :action="batch_action"
                      @submit="submit_remark">
        </batch-remark>
        <batch-change-warehouse
            v-model="changeWarehouseDialog"
            :title="title"
            @submit="submit_change_warehouse">
        </batch-change-warehouse>
        <batch-reissue v-model="reissueDialog" :title="title" ></batch-reissue>
    </page>
</template>
<style lang="stylus">
    .p-index-manual {
        .el-dropdown .el-button-group {
            display: inline-block;
            position: relative;
            top: 1px;
        }
        .p-btn-request {
            margin-left: 8px;
            margin-right: 2px;
        }
        .p-btn-select{
            margin-right:7px;
        }
    }

    .reset-position {
        margin-left: -2px;
        margin-right: 7px;
        .el-button + .el-button {
            margin-left: 10px;
        }
    }

    .width-default {
        width: 250px;
    }

    .width-large {
        width: 450px;
    }

    .date.el-date-editor {
        width: 120px;
        height: 26px;
        font-size: 1.2rem;
        .el-date-editor__trigger.el-icon {
            top: -7px;
        }
    }

    .date > .el-date-editor__editor {
        height: 26px;
    }
</style>
<script>
    import {
        api_get_list,
        api_post_pending,
        url_manual_orders_export,
        api_manual_orders_export
    } from '../../../api/handwork';
    import {
        url_info,
        url_update,
        url_cancel_invalid,
        api_again_running_rule,
        url_again_running_rule,
        api_orders_export_title,
        api_batch_invalid,
        url_batch_invalid,
        url_cancel_logistics,
        api_cancel_logistics,
        api_update_shipping,
        url_update_shipping,
        url_orders_batch_change_warehouse,
        api_orders_batch_change_warehouse
    } from '../../../api/order-local';
    import {api_get_warehouse, api_get_shipping} from '../../../api/common';
    import {api_goods_export_template} from "../../../api/product-library";
    import {downloadFile} from '../../../lib/http';

    export default {
        permission: {
            url_info,
            url_update,
            url_cancel_invalid,
            url_again_running_rule,
            url_manual_orders_export,
            url_batch_invalid,
            url_cancel_logistics,
            url_update_shipping,
            url_orders_batch_change_warehouse
        },
        page: {},
        refresh() {
            this.init();
        },
        data() {
            return {
                isFirst:true,
                buttons: [
                    {label: "添加手工订单", value: "add_hand_order"},
                    {label: "重新核查", value: "anew_examine"},
                    {label: "导入手工订单", value: "mport_manual_order"},
                ],
                tableData: {
                    dataList: [],
                    page: 1,
                    pageSize: 50,
                    total: 0,
                },
                addDialog: false,
                mportVisiable: false,
                addForm: {},
                form: {
                    shipping: [],
                    seller_date: "",
                    seller_id:'',
                    snType: "order_num",
                    snText: "",
                    channel_id: 0,
                    account_id: "",
                    payment: "",
                    warehouse_id: "",
                    shipping_id: "",
                    snDate: "transaction_date",
                    date_b: (Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now(),
                    delivery_type:'',
                    belong_type:''
                },
                clears: {
                    snType: "order_num",
                    seller_id:'',
                    snDate: "transaction_date",
                    date_b: (Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now(),
                    channel_id: 0,
                },
                isLoading: false,
                orderIdList: [],
                handleList: [
                    {label: "处理", value: 2, apis: url_update, disabled: false},
                    {label: "查看", value: 1, apis: url_info, disabled: false},
                ],
                partAllOptions: [
                    {name: "部分导出", value: 0},
                    {name: "全部导出", value: 1}
                ],
                fields: [],
                templates: [],
                export_type: '',
                export_model_type: {
                    type: 14
                },
                export_visible: false,
                exportVisable: false,
                title:'',
                batch_api:'',
                batch_action:'',
                remarkDialog:false,
                resultShow:false,
                warehouse_id:'',
                shipping_id:'',
                warehouseList:[],
                shippingList:[],
                changeWarehouseDialog:false,
                reissueDialog:false
            }
        },
        created() {
            if (window.screen.width === 1920) {
                this.curWidth = 200;
            } else if (window.screen.width === 1366) {
                this.curWidth = 0;
            }
            this.get_fields();
            this.get_templates();
        },
        mounted(){
            this.init();
        },
        methods: {
            batch_change_warehouse(){
                if (this.orderIdList.length <= 0) {
                    return this.$message({type: "warning", message: "请先勾选需要批量备注的订单"});
                }
                this.title = '批量修改仓库';
                this.changeWarehouseDialog = true;
            },
            submit_change_warehouse(warehouse){
                this.$http(api_orders_batch_change_warehouse,{order_ids:this.orderIdList, warehouse_id:warehouse.value}).then(res=>{
                    this.init();
                    this.$message({type:'success',message:res.message||res});
                    this.changeWarehouseDialog = false;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_orders_batch_change_warehouse',false);
                    },200);
                })
            },
            shipping_show() {
                if (this.orderIdList.length <= 0) {
                    this.$reqKey('api_warehouse_remote', false);
                    return this.$message({type: "warning", message: "请先勾选需要更改运输方式的订单!"});
                }
                this.resultShow = true;
                this.warehouse_id = this.form.warehouse_id;
                this.shipping_id = '';
                this.warehouse_remote();
                this.shipping_remote();
            },
            change_warehouse() {
                this.shipping_remote();
                this.shipping_id = '';
            },
            warehouse_remote() {
                this.$http(api_get_warehouse).then(res => {
                    this.warehouseList = res;
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('api_warehouse_remote', false)
                    }, 200);
                });
            },
            shipping_remote() {
                if (this.warehouse_id === "") {
                    this.$reqKey('api_warehouse_remote', false);
                    return this.shippingList = [{label: "", value: ""}];
                }
                this.$http(api_get_shipping, {warehouse_id: this.warehouse_id}).then(res => {
                    if (res.length <= 0) return this.shippingList = [{label: "", value: ""}];
                    this.shippingList = res.map(row => {
                        return {
                            label: `${row.carrier_name}>>${row.shortname}`,
                            value: row.shipping_method_id
                        }
                    });
                }).catch(code => {
                    console.log(code);
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('api_warehouse_remote', false)
                    }, 200)
                });
            },
            update_shipping() {
                if (this.orderIdList.length <= 0) return this.$message({type: "warning", message: "请先选择要操作的数据！"});
                let params = {
                    order_ids: this.orderIdList,
                    shipping_id: this.shipping_id,
                    warehouse_id: this.warehouse_id
                };
                this.$http(api_update_shipping, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.resultShow = false;
                    this.init();
                    this.orderIdList = [];
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                })
            },
            cancel_logistics() {
                if (this.orderIdList.length <= 0) {
                    this.$reqKey('url_cancel_logistics', false);
                    return this.$message({type: "warning", message: "请先选择要操作的数据！"})
                }
                let params = {
                    order_ids: this.orderIdList
                };
                this.$http(api_cancel_logistics, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.init();
                    this.orderIdList = [];
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('url_cancel_logistics', false)
                    }, 200);
                });
            },
            get_fields() {
                this.$http(api_orders_export_title).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            get_templates() {
                this.$http(api_goods_export_template, {type: 14}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    })
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            export_sku(val) {
                if (val.value === 0 && this.orderIdList.length <= 0) return this.$message({
                    type: "warning",
                    message: "请先选择需要导出的数据"
                });
                this.export_type = val.value;
                this.exportVisable = true;
            },
            creat_excel(param) {
                let fields = param.field.join(',');
                let data = '';
                switch (this.export_type) {
                    case 0://部分
                        data = {
                            ids: this.orderIdList.map(row => {
                                if (typeof row === 'object') {
                                    return row.id
                                } else {
                                    return row
                                }
                            }),
                            export_type: this.export_type,
                        };
                        Object.assign(data,this.init_params());
                        return this.order_export(data, {
                            'X-Result-Fields': fields,
                            contentType: 'application/x-www-form-urlencoded'
                        });
                        break;
                    case 1://全部
                        data = this.init_params();
                        this.$set(data, 'export_type', this.export_type);
                        return this.order_export(data, {
                            'X-Result-Fields': fields,
                            contentType: 'application/x-www-form-urlencoded'
                        });
                        break;
                }
            },
            order_export(params, head) {
                return this.$http(api_manual_orders_export, params, head).then(res => {
                    if (res.join_queue === 1) {
                        this.$message({type: "success", message: res.message || res});
                        this.export_visible = true;
                    } else {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let params = {
                            file_code: res.file_code,
                            page: this.tableData.page,
                            pageSize: this.tableData.pageSize,
                        };
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                        this.$message({type: "success", message: '导出成功' || res});
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
                return Promise.resolve()
            },
            cancel_running_rule() {
                if (this.orderIdList.length <= 0) {
                    this.$reqKey('url_again_running_rule', false);
                    return this.$message({type: "warning", message: "请先选择要操作的数据！"});
                }
                let params = {
                    order_ids: this.orderIdList
                };
                this.$http(api_again_running_rule, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.init();
                    this.orderIdList = [];
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('url_again_running_rule', false);
                    }, 200);
                });
            },
            cancel_invalid() {
                this.init();
            },
            init_params() {
                let params = {
                    page: this.tableData.page,
                    pageSize: this.tableData.pageSize,
                    channel_id: this.form.channel_id,
                    payment: this.form.payment,
                    account_id: this.form.account_id
                }
                this.form.seller_date && (params.seller_date = this.form.seller_date);
                this.form.seller_id && (params.seller_id = this.form.seller_id);
                this.form.account_id && (params.account_id = this.form.account_id);
                this.form.shipping.length === 1 && (params.carrier_id = this.form.shipping[0]);
                this.form.shipping.length === 2 && (params.shipping_id = this.form.shipping[1]);
                this.form.warehouse_id && (params.warehouse_id = this.form.warehouse_id);
                this.form.snType && (params.snType = this.form.snType);
                this.form.delivery_type!==''&&(params.delivery_type = this.form.delivery_type);
                this.form.belong_type!==''&&(params.belong_type = this.form.belong_type);
                let curString = this.form.snText.replace(new RegExp(' ', 'gm'), '\n');
                let cur = curString.split('\n').filter(row => !!row);
                params.snText = cur && cur.length > 1 ? cur.map(row => row.trim()) : this.form.snText;
                this.form.snDate && (params.snDate = this.form.snDate);
                if (!!this.form.date_b) {
                    let b = new Date(this.form.date_b);
                    params.date_b = datef("YYYY-MM-dd", b / 1000);
                } else {
                    params.date_b = "";
                }
                if (!!this.form.date_e) {
                    let e = new Date(this.form.date_e);
                    params.date_e = datef("YYYY-MM-dd", e / 1000);
                } else {
                    params.date_e = "";
                }
                return params
            },
            init() {
                this.isLoading = true;
                let params = this.init_params();
                this.tableData.dataList = [];
                this.$http(api_get_list, params).then(res => {
                    this.isFirst = false;
                    this.isLoading = false;
                    this.tableData.dataList = res.data;
                    this.tableData.dataList.forEach(row => {
                        this.$set(row, 'handleList', window.clone(this.handleList));
                        if (row.status === 4294967295) {
                            row.handleList[1].disabled = true;
                            let cur = {label: '取消作废', value: 3, apis: url_cancel_invalid, disabled: false};
                            row.handleList.push(cur);
                        }
                    });
                    this.tableData.total = res.count;
                }).catch(code => {
                    this.isLoading = false;
                    console.log(code);
                })
            },
            /*选择销售日期*/
            change_date(val) {
                this.init();
            },
            /*选择销售渠道*/
            select_button(val) {
                this.form.channel_id = val;
                this.init();
            },
            /*选择付款状态*/
            select_payment(val) {
                this.form.payment = val;
                this.init();
            },
            /*添加手工订单/重新核查/刷新/导入手工订单*/
            cur_click(item, index) {
                switch (item.value) {
                    case "add_hand_order":
                        this.addDialog = true;
                        this.$reqKey(`label${index}`, false);
                        break;
                    case "anew_examine":
                        if (this.orderIdList.length <= 0) {
                            this.$reqKey(`label${index}`, false);
                            return this.$message({type: 'warning', message: "请选择需要核查的订单"});
                        }
                        this.$http(api_post_pending, {order_id: this.orderIdList}).then(res => {
                            this.$message(res.message);
                            this.init();
                        }).catch(code => {
                            this.$message({type: 'error', message: code.message || code});
                        }).finally(() => {
                            setTimeout(() => {
                                this.$reqKey(`label${index}`, false);
                            }, 200);
                        });
                        break;
                    case "mport_manual_order":
                        this.mportVisiable = true;
                        this.$reqKey(`label${index}`, false);
                        break;
                }
            },
            /*列表多选事件*/
            select_change(val) {
                this.orderIdList = [];
                val.forEach((row) => {
                    this.orderIdList.push(row.id);
                })
            },
            /*翻页*/
            current_change(page) {
                this.tableData.page = page;
                this.init();
            },
            size_change(pageSize) {
                this.tableData.pageSize = pageSize;
                this.init();
            },
            /*孙页面   操作*/
            cur_operate_g() {
                this.init()
            },
            /*搜索*/
            search() {
                this.init();
            },
            /*清空搜索*/
            clear_search() {
                this.form = {
                    shipping: [],
                    seller_date: "",
                    snType: "order_num",
                    snText: "",
                    channel_id: "",
                    payment: "",
                    account_id: "",
                    warehouse_id: "",
                    shipping_id: "",
                    snDate: "transaction_date",
                    date_b: (Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now(),
                }
                this.init();
            },
            save_new() {
                this.init();
            },
            save_mport() {
                this.init();
            },
            disabled(val) {
                if (val.value === 'anew_examine') {
                    if (this.orderIdList.length > 0) {
                        return false;
                    }
                    return true;
                }
            },
            batch_reissue(){
                this.title = '批量补发手工单';
                this.reissueDialog = true;
            },
            batch_invalid(){
                if(this.orderIdList.length<=0){
                    this.$reqKey('url_batch_remark',false);
                    return this.$message({type:"warning",message:"请先勾选需要批量备注的订单"});
                }
                this.title = '批量作废订单';
                this.batch_api = api_batch_invalid;
                this.batch_action = 'reason';
                this.remarkDialog = true;
            },
            submit_remark(val, api, action) {
                let data = {
                    order_ids: this.orderIdList.map(row => {
                        if (typeof row === 'object') {
                            return row.id
                        } else {
                            return row
                        }
                    })
                };
                data[action] = val;
                this.$http(api, data).then(res => {
                    if (res.data && res.data.length > 0) {
                        res.data.forEach(row => {
                            this.$message({type: "warning", message: row || res});
                        });
                    } else {
                        this.$message({type: "success", message: res.message || res});
                        this.orderIdList.forEach(row => {
                            let find = this.tableData.dataList.find(item=>row===item.id);
                            if(!!find){
                                find.status = 4294967295;
                            }
                        });
                    }
                    this.remarkDialog = false;
                    if (api === 'api_batch_invalid') {
                        const h = this.$createElement;
                        this.$msgbox({
                            title: '作废结果',
                            message: h('p', null, res.data.map(row => {
                                return h('p', null, row);
                            })),
                            showConfirmButton: false,
                            showCancelButton: true,
                            cancelButtonText: '取消',
                        }).then(action => {

                        });
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('url_batch_remark', false);
                    }, 200);
                })
            },
        },
        computed:{
            shippingPlaceholder() {
                if (this.warehouse_id <= 0) {
                    return "请先选择发货仓库";
                } else if (this.warehouse_id > 0 && this.shippingList.length <= 1) {
                    return "该发货仓库下暂无运输方式";
                } else {
                    return "请选择运输方式";
                }
            },
        },
        components: {
            cardSearch: require("./card-search.vue").default,
            dataTable: require('./data-table.vue').default,
            addOrder: require('./add-order.vue').default,
            mportOrder: require('./mport-order.vue').default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('../../report/export-dialog').default,
            trendsSelect: require('../../../components/trends-select.vue').default,
            batchRemark: require('../local/batch-remark').default,
            labelItem: require('../../../components/label-item.vue').default,
            batchChangeWarehouse:require('../local/batch-change-warehouse').default,
            batchReissue:require('./batch-reissue').default
        }
    }
</script>
