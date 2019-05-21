<template>
    <page class="p-index">
        <card-search :form="form"
                     :clears="clears"
                     @search="search"
        ></card-search>
        <div class="mb-sm mt-sm ">
            <permission tag="trendsSelect"
                        class="inline ml-sm"
                        type="primary"
                        :route="apis.url_stock_orders_export"
                        :selects="partAllOptions"
                        @trigger="export_sku"></permission>
            <permission tag="request-button"
                        :route="apis.url_batch_remark"
                        :mintime="200"
                        req-key="stock_orders_batch_remark"
                        @click="batch_remark">批量新增订单备注
            </permission>
            <permission tag="request-button"
                        :route="apis.url_batch_invalid"
                        :mintime="200"
                        req-key="stock_orders_batch_invalid"
                        @click="batch_invalid">批量作废订单
            </permission>
            <permission tag="ElButton"
                        :route="apis.url_orders_batch_change_warehouse"
                        size="mini"
                        type="primary"
                        @click="batch_change_warehouse">批量修改仓库
            </permission>
            <permission tag="request-button"
                        :route="apis.url_orders_batch_review"
                        :mintime="200"
                        req-key="stock_orders__batch_review"
                        @click="batch_review">加入人工审核
            </permission>
            <permission tag="request-button"
                        :route="apis.url_orders_lock_inventory"
                        :mintime="200"
                        req-key="stock_orders__lock_repertory"
                        @click="lok_repertory">锁定库存
            </permission>
            <permission tag="request-button"
                        :route="apis.url_orders_release_inventory"
                        :mintime="200"
                        req-key="stock_orders__release_repertor"
                        @click="release_repertory">释放库存
            </permission>
        </div>
        <div>
            <data-table
                :is-load="isLoad"
                :tables="tables"
                @size-change="size_change"
                @page-change="page_change"
                @cur-operate="cur_operate"
                @sort-click="sort_click"
                @cancel-invalid="cancel_invalid"
                @check-box-change="checx_box_change"
            ></data-table>
        </div>
        <batch-remark  v-model="remarkDialog"
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
        <export-field :param="export_model_type" v-model="exportVisable" :fields="fields" :templates="templates"
                      @getTemplate="get_templates" title="请选择自定义导出字段" :creat-excel="creat_excel"></export-field>
        <export-dialog v-model="export_visible"></export-dialog>
    </page>
</template>
<style lang="stylus">
    .el-dialog__header {
        padding-bottom: 10px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0px 0px 6px 0px rgba(0, 0, 0, 0.04);
    }
</style>
<script>
    import dataTable from './data-table.vue';
    import {downloadFile} from '../../../lib/http';
    import {api_get_warehouse, api_get_shipping} from '../../../api/common';
    import {
        api_batch_invalid,
        api_update_shipping,
        api_get_stock_orders,
        api_stock_orders_export,
        api_post_tracking,
        api_batch_remark,
        api_stock_orders_export_title,
        api_orders_batch_change_warehouse,
        api_orders_batch_review,
        api_orders_lock_inventory,
        api_orders_release_inventory,
        url_info,
        url_orders_batch_review,
        url_orders_batch_change_warehouse,
        url_update,
        url_cancel_invalid,
        url_cancel_push,
        url_cancel_logistics,
        url_again_running_rule,
        url_batch_remark,
        url_post_tracking,
        url_update_shipping,
        url_batch_invalid,
        url_stock_orders_export,
        url_orders_release_inventory,
        url_orders_lock_inventory,
    } from '../../../api/order-local';
    import {api_goods_export_template} from "../../../api/product-library";

    export default {
        permission: {
            url_orders_batch_review,
            url_orders_batch_change_warehouse,
            url_info,
            url_update,
            url_cancel_invalid,
            url_stock_orders_export,
            url_cancel_push,
            url_cancel_logistics,
            url_again_running_rule,
            url_update_shipping,
            url_batch_remark,
            url_batch_invalid,
            url_post_tracking,
            url_orders_release_inventory,
            url_orders_lock_inventory,
        },
        page: {
            multiple: true,
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                ids: [],
                title:'',
                isLoad: false,
                isBatch: false,
                resultShow: false,
                remarkDialog: false,
                tables: {
                    page: 1,
                    pageSize: 50,
                    totalSize: 0,
                    lists: []
                },
                form: {
                    snUser:'seller_id',
                    snName:'',
                    shipping: [],
                    channel_id: 0,
                    account_id: "",
                    batchText: '',
                    warehouse_id: "",
                    shipping_id: "",
                    searchType:'belong_type',
                    snValue: '',
                    site: '',
                    snDate: 'pay_time',
                    snType: 'order_num',
                    buyer_selected_logistics:'',
                    connd_value: '',
                    time: 'transaction_date',
                    sort_field: "",
                    sort_type: "",
                    lock:'',
                    sku_status:0,
                    date_b: (Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now(),
                },
                clears: {
                    lock:'',
                    sku_status:0,
                    snUser:'seller_id',
                    snName:'',
                    shipping: [],
                    channel_id: 0,
                    snDate: 'pay_time',
                    searchType:'belong_type',
                    snValue: '',
                    buyer_selected_logistics:'',
                    snType: 'order_num',
                    time: 'transaction_date',
                    date_b: (Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now(),
                },
                exportRequest: {},
                partAllOptions: [
                    {name: "部分导出", value: 0},
                    {name: "全部导出", value: 1},
                ],
                shippingList: [],
                warehouseList: [],
                warehouse_id: '',
                shipping_id: '',
                importExcelShow: false,
                apiPort: api_post_tracking,
                code: 'tracking',
                batch_api: '',
                batch_action: {},
                fields: [],
                templates: [],
                export_type: '',
                reason_text:'',
                export_model_type: {
                    type: 13
                },
                changeWarehouseDialog:false,
                export_visible: false,
                exportVisable: false,
            }
        },
        created() {
            this.init();
            this.exportRequest = {
                url: `${config.apiHost}orders/export`,
                get: {ids: this.ids},
                name: "导出订单"
            };
            this.get_fields();
            this.get_templates();
        },
        watch: {
            remarkDialog(val) {
                if(!val) {
                    this.title = '';
                }
            }
        },
        methods: {
            get_fields() {
                this.$http(api_stock_orders_export_title).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            get_templates() {
                this.$http(api_goods_export_template, {type: 13}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    });
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            export_sku(val) {
                if (val.value === 0 && this.ids.length <= 0) return this.$message({
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
                            ids: this.ids.map(row => {
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
                return this.$http(api_stock_orders_export, params, head).then(res => {
                    if (res.join_queue === 1) {
                        this.$message({type: "success", message: res.message || res});
                        this.export_visible = true;
                    } else {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let params = {
                            file_code: res.file_code,
                            page: this.tables.page,
                            pageSize: this.tables.pageSize,
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
                });
                return Promise.resolve()
            },
            submit_remark(val, api, action) {
                let data = {
                    order_ids: this.ids
                };
                data[action] = val;
                this.$http(api, data).then(res => {
                    this.$message({type: "success", message: res.message || res});
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
                })
            },
            /*批量新增订单备注*/
            batch_remark() {
                if (this.ids.length <= 0) {
                    this.$reqKey('stock_orders_batch_remark', false);
                    return this.$message({type: "warning", message: "请先勾选需要批量备注的订单"});
                }
                this.remarkDialog = true;
                this.title = '批量添加备注';
                this.batch_action = 'remark';
                this.batch_api = api_batch_remark;
            },
            /*批量作废订单*/
            batch_invalid() {
                if (this.ids.length === 0) {
                    this.$reqKey('stock_orders_batch_invalid', false);
                    return this.$message({type: "warning", message: "请先勾选需要批量备注的订单"});
                }
                this.title = '批量作废订单';
                this.batch_api = api_batch_invalid;
                this.batch_action = 'reason';
                this.remarkDialog = true;
            },
            /*批量修改仓库*/
            batch_change_warehouse(){
                if (this.ids.length <= 0) {
                    return this.$message({type: "warning", message: "请先勾选需要批量备注的订单"});
                }
                this.title = '批量修改仓库';
                this.changeWarehouseDialog = true;
            },
            submit_change_warehouse(warehouse){
                this.$http(api_orders_batch_change_warehouse,{order_ids:this.ids, warehouse_id:warehouse.value}).then(res=>{
                    this.init();
                    this.ids=[];
                    this.changeWarehouseDialog = false;
                    this.$message({type:'success',message:res.message||res});
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_orders_batch_change_warehouse',false);
                    },200);
                })
            },
            /*锁定库存*/
            lok_repertory(){
                if (this.ids.length <= 0) {
                    this.$reqKey('stock_orders__lock_repertory', false);
                    return this.$message({type: "warning", message: "请先选择要操作的数据"});
                }this.$confirm(`此操作在整个包裹没有配齐货时，也优先锁定库存，确认此操作吗?`, "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data={
                        ids:this.ids
                    };
                    this.$http(api_orders_lock_inventory, data).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        this.init();
                        this.ids=[];
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('stock_orders__lock_repertory', false);
                        }, 200);
                    })
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消操作"
                    })
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('stock_orders__lock_repertory', false);
                    }, 200);
                });

            },
            /*释放库存*/
            release_repertory(){
                if (this.ids.length <= 0) {
                    this.$reqKey('stock_orders__release_repertor', false);
                    return this.$message({type: "warning", message: "请先选择要操作的数据"});
                }this.$confirm(`此操作将释放订单锁定的库存，确认此操作吗？`, "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data={
                        ids:this.ids
                    };
                    this.$http(api_orders_release_inventory, data).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        this.init();
                        this.ids=[];
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('stock_orders__release_repertor', false);
                        }, 200);
                    })
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消操作"
                    })
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('stock_orders__release_repertor', false);
                    }, 200);
                });
            },
            /*加入人工审核*/
            batch_review(){
                if (this.ids.length === 0) {
                    this.$reqKey('stock_orders__batch_review', false);
                    return this.$message({type: "warning", message: "请勾选需要加入人工审核的订单"});
                }this.$prompt(`是否确定将所勾选的订单设置为人工审核订单？`, "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showInput:true,
                    inputValidator:(inputValue)=>{
                        switch(inputValue) {
                            case null:
                                return false;
                                break;
                            case '':
                                return false;
                                break;
                            default:
                                this.reason_text = inputValue;
                        }
                    },
                    inputErrorMessage: '作废原因不能为空！',
                    inputPlaceholder:'请输入作废原因...'
                }).then(() => {
                    this.$http(api_orders_batch_review, {order_ids: JSON.stringify(this.ids),reason:this.reason_text}).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        this.init();
                        this.ids=[];
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('stock_orders__batch_review', false);
                        }, 200);
                    })
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消"
                    })
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('stock_orders__batch_review', false);
                    }, 200);
                });
            },
            warehouse_remote() {
                return this.$http(api_get_warehouse).then(res => {
                    this.warehouseList = res;
                });
                return Promise.resolve()
            },
            change_warehouse() {
                this.shipping_remote();
                this.shipping_id = '';
            },
            shipping_remote() {
                if (this.warehouse_id === "") return this.shippingList = [{label: "", value: ""}];
                this.$http(api_get_shipping, {warehouse_id: this.form.warehouse_id}).then(res => {
                    if (res.length <= 0) {
                        this.shippingList = [];
                        return
                    }
                    let list = res.map(row => {
                        return row.carrier_id
                    });
                    list = this.carrier_unique(list).map(carrier_id => {
                        let label = res.find(row => row.carrier_id === carrier_id);
                        return {
                            label: label.carrier_name,
                            value: carrier_id
                        }
                    });
                    this.shippingList = list.map(row => {
                        row.children = this.get_children(row, res);
                        return row
                    });
                }).catch(code => {
                    console.log(code);
                });
            },
            update_shipping() {
                if (this.ids.length <= 0) return this.$message({type: "warning", message: "请先选择要操作的数据！"});
                let params = {
                    order_ids: this.ids,
                    shipping_id: this.shipping_id,
                    warehouse_id: this.warehouse_id
                };
                this.$http(api_update_shipping, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.resultShow = false;
                    this.init();
                    this.ids = [];
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                })
            },
            search() {
                this.init();
            },
            download_file() {
                if (this.ids.length <= 0) return this.$message({type: "warning", message: "请选择需要导出的数据"});
                this.exportRequest.get.ids = this.ids;
            },
            cancel_invalid() {
                this.init();
            },
            checx_box_change(val) {
                this.ids = [];
                val.forEach(row => {
                    this.ids.push(row.id);
                });
            },
            init_params() {
                let params = {
                    page: this.tables.page,
                    pageSize: this.tables.pageSize,
                    snDate: this.form.snDate,
                    snUser:this.form.snUser,
                    snType: this.form.snType,
                    searchType: this.form.searchType
                };
                if(!!this.form.channel_id){
                    params.channel_id = this.form.channel_id;
                    if(this.form.channel_id===1&&this.form.buyer_selected_logistics){
                        params.buyer_selected_logistics = this.form.buyer_selected_logistics;
                    }
                }
                this.form.snValue!=='' && (params.snValue = this.form.snValue);
                this.form.lock!=='' && (params.lock = this.form.lock);
                this.form.sku_status && (params.sku_status = this.form.sku_status);
                this.form.snName && (params.snName = this.form.snName);
                this.form.sort_field && (params.sort_field = this.form.sort_field);
                this.form.sort_type && (params.sort_type = this.form.sort_type);
                this.form.channel_id && (params.channel_id = this.form.channel_id);
                this.form.account_id && (params.account_id = this.form.account_id);
                this.form.shipping.length === 1 && (params.carrier_id = this.form.shipping[0]);
                this.form.shipping.length === 2 && (params.shipping_id = this.form.shipping[1]);
                this.form.warehouse_id && (params.warehouse_id = this.form.warehouse_id);
                this.form.site && (params.site_code = this.form.site);
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
                let curString = this.form.batchText.replace(new RegExp(' ', 'gm'), '\n');
                let cur = curString.split('\n').filter(row => !!row);
                if (cur && cur.length > 1) {
                    params.snText = cur.map(row => {
                        return row.trim();
                    });
                } else if (cur && cur.length === 1) {
                    params.snText = this.form.batchText;
                }
                return params;
            },
            init() {
                this.isLoad = true;
                this.$http(api_get_stock_orders, this.init_params()).then(res => {
                    this.tables.totalSize = res.count;
                    let lists = res.data.map(row => {
                        row.isCheck = false;
                        row.show = false;
                        return row;
                    });
                    this.tables.lists = lists;
                    this.tables.lists.forEach(row => {
                        this.$set(row, 'operateButtons', [
                            {label: '处理', value: 2, apis: url_update, disabled: false},
                            {label: '查看', value: 1, apis: url_info},
                        ]);
                        if (row.status === 4294967295) {
                            row.operateButtons[1].disabled = true;
                            let cur = {label: '取消作废', value: 4, apis: url_cancel_invalid, disabled: false};
                            row.operateButtons.push(cur);
                        }
                    });
                    this.isLoad = false;
                }).catch(code => {
                    this.isLoad = false;
                    console.log(code.message);
                });
            },
//           -------------------------------------------------- 分页
            size_change(size) {
                this.tables.pageSize = size;
                this.init();
            },
            page_change(page) {
                this.tables.page = page;
                this.init();
            },
            cur_operate() {
                this.init();
            },
//            表格升降序
            sort_click(val) {
                switch (val.label) {
                    case "付款状态":
                        this.form.sort_field = "pay_time";
                        break;
                    case "支付总额":
                        this.form.sort_field = "pay_fee";
                        break;
                    case "目的地":
                        this.form.sort_field = "country_code";
                        break;
                    case "下单时间":
                        this.form.sort_field = "order_time";
                        break;
                    case "最迟发货时间":
                        this.form.sort_field = "uploaded_deadline";
                }
                this.form.sort_type = val.order;
                this.init();
            },
        },
        computed: {
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
            cardSearch: require('./card-search.vue').default,
            dataTable,
            labelItem: require('../../../components/label-item.vue').default,
            download: require('../../../components/download.vue').default,
            trendsSelect: require('../../../components/trends-select.vue').default,
            batchRemark: require('./batch-remark.vue').default,
            batchChangeWarehouse:require('./batch-change-warehouse').default,
            importExcel: require('../../product/excel-update/import-excel.vue').default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('../../report/export-dialog').default,
        }
    }
</script>
