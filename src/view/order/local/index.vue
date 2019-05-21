<template>
    <page class="p-index">
        <card-search :form="form"
                     :clears="clears"
                     @search="search"
        ></card-search>
        <div class="mb-sm mt-sm ">
            <permission tag="trendsSelect"
                        class="inline ml-sm mr-xs"
                        type="primary"
                        :route="apis.url_orders_export"
                        :selects="partAllOptions"
                        @trigger="export_sku"></permission>
            <permission tag="request-button"
                        :mintime="200"
                        req-key="url_cancel_logistics"
                        :route="apis.url_cancel_logistics"
                        @click="cancel_logistics">取消物流
            </permission>
            <permission tag="request-button"
                        :route="apis.url_again_running_rule"
                        :mintime="200"
                        req-key="url_again_running_rule"
                        @click="cancel_running_rule">重新跑规则
            </permission>
            <permission tag="request-button"
                        :route="apis.url_update_shipping"
                        :mintime="200"
                        req-key="api_warehouse_remote"
                        @click="shipping_show">更改运输方式
            </permission>
            <permission tag="request-button"
                        :route="apis.url_batch_remark"
                        :mintime="200"
                        req-key="url_batch_remark"
                        @click="batch_remark">批量新增订单备注
            </permission>
            <permission tag="request-button"
                        :route="apis.url_batch_invalid"
                        :mintime="200"
                        req-key="url_batch_remark"
                        @click="batch_invalid">批量作废订单
            </permission>
            <permission tag="ElButton"
                        :route="apis.url_post_tracking"
                        size="mini"
                        type="primary"
                        @click.native="import_excel('tracking')">导入跟踪号
            </permission>
            <permission tag="ElButton"
                        size="mini"
                        :route="apis.url_orders_day_address"
                        type="primary"
                        @click="aliExpressTimeDialog">延长速卖通发货期
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
                        req-key="url_orders_batch_review"
                        @click="batch_review">加入人工审核
            </permission>
            <permission tag="ElButton"
                        :route="apis.url_orders_batch_import"
                        size="mini"
                        type="primary"
                        @click="import_excel('orders_notes')">导入订单备注
            </permission>
            <permission tag="ElButton"
                        :route="apis.url_orders_batch_send_messag"
                        size="mini"
                        type="primary"
                        @click="batch_contact_the_buyer">批量联系买家
            </permission>
            <!--<permission tag="ElButton"-->
                        <!--:route="apis.url_orders_calculate_estimated_fee"-->
                        <!--size="mini"-->
                        <!--type="primary"-->
                        <!--@click="calculate_estimated_fee">计算计抛重量和运费-->
            <!--</permission>-->
        </div>
        <div>
            <data-table
                :is-load="isLoad"
                :is-highlight="isHighlight"
                :tables="tables"
                id="local-index-data-table"
                @size-change="size_change"
                @page-change="page_change"
                @cur-operate="cur_operate"
                @sort-click="sort_click"
                @cancel-invalid="cancel_invalid"
                @check-box-change="checx_box_change"
            ></data-table>
        </div>
        <batch-remark
            v-model="remarkDialog"
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
                <!--<super-select-->
                    <!--style="width:170px"-->
                    <!--storageKey="order_warehouse"-->
                    <!--@change="change_warehouse"-->
                    <!--v-model="warehouse_id"-->
                    <!--:is-paging="true"-->
                    <!--:options='warehouseList'-->
                <!--&gt;</super-select>-->
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
                <!--<super-select-->
                    <!--class="width-super"-->
                    <!--storageKey="order_shipping"-->
                    <!--:placeholder="shippingPlaceholder"-->
                    <!--:disabled="shippingList.length<=1"-->
                    <!--v-model="shipping_id"-->
                    <!--:is-paging="true"-->
                    <!--:options='shippingList'-->
                <!--&gt;</super-select>-->
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
        <import-excel v-model="importExcelShow"
                      :api_port="apiPort"
                      :code="code"
                      :suffix="suffix"
                      :showDownload="true"
                      :file_name="file_name"></import-excel>
        <export-field :param="export_model_type" v-model="exportVisable" :fields="fields" :templates="templates"
                      @getTemplate="get_templates" title="请选择自定义导出字段" :creat-excel="creat_excel"></export-field>
        <export-dialog v-model="export_visible"></export-dialog>
        <prolong-dialog :title="`延长收货时间`" v-model="prolongAliExpress" :is-close="true"
                        @update-time="updateTime"></prolong-dialog>
        <contact-buyer v-model="contactTheBuyerDialog" :channel_id="channelID" :mdfid="orderID" :excute="'batch_contact'"></contact-buyer>
    </page>
</template>
<style lang="stylus">
    .p-index {
        .el-dropdown .el-button-group {
            display: inline-block;
            position: relative;
            top: -1px;
        }
    }

    .el-dialog__header {
        padding-bottom: 10px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0px 0px 6px 0px rgba(0, 0, 0, 0.04);
    }
</style>
<script>
    import dataTable from './data-table.vue';
    import {url_orders_batch_send_messag} from '../../../api/smt-mail';
    import {downloadFile} from '../../../lib/http';
    import {api_get_warehouse, api_get_shipping} from '../../../api/common';
    import {
        url_info,
        url_update,
        url_cancel_invalid,
        url_orders_export,
        url_cancel_logistics,
        url_again_running_rule,
        url_batch_remark,
        url_post_tracking,
        url_update_shipping,
        url_batch_invalid,
        url_orders_day_address,
        url_orders_batch_change_warehouse,
        url_orders_batch_review,
        url_orders_batch_import,
        url_orders_calculate_estimated_fee,
        api_orders_batch_import,
        api_batch_remark,
        api_again_running_rule,
        api_update_shipping,
        api_batch_invalid,
        api_orders_export_title,
        api_orders_day_address,
        api_get, api_orders_export,
        api_cancel_logistics,
        api_post_tracking,
        api_orders_batch_change_warehouse,
        api_orders_batch_review,
        api_orders_calculate_estimated_fee
    } from '../../../api/order-local';
    import {api_goods_export_template} from "../../../api/product-library";

    export default {
        permission: {
            url_info,
            url_update,
            url_cancel_invalid,
            url_orders_export,
            url_cancel_logistics,
            url_again_running_rule,
            url_update_shipping,
            url_batch_remark,
            url_batch_invalid,
            url_post_tracking,
            url_orders_day_address,
            url_orders_batch_change_warehouse,
            url_orders_batch_review,
            url_orders_batch_send_messag,
            url_orders_batch_import,
            url_orders_calculate_estimated_fee
        },
        page: {
            multiple: true,
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                exportVisable: false,
                title: '',
                ids: [],
                orderID:[],
                checkedData:[],
                channelID:'',
                isLoad: false,
                isBatch: false,
                resultShow: false,
                remarkDialog: false,
                changeWarehouseDialog:false,
                contactTheBuyerDialog:false,
                tables: {
                    page: 1,
                    pageSize: 50,
                    totalSize: 0,
                    lists: [{
                        operateButtons: [
                            {label: '处理', value: 2, apis: url_update, disabled: false},
                            {label: '查看', value: 1, apis: url_info},
                        ]
                    }]
                },
                form: {
                    status: '',
                    shipping: [],
                    order_status: [],
                    channel_id: 0,
                    account_type: 1,
                    account_id: '',
                    account_code: '',
                    shop_id: '',
                    delivery_type: '',
                    batchText: '',
                    warehouse_id: '',
                    buyer_selected_logistics:'',
                    shipping_id: '',
                    carrier_id: '',
                    searchType:'belong_type',
                    snValue: '',
                    site: '',
                    snDate: 'transaction_date',
                    snType: 'channel_order_number',
                    snUser:'seller_id',
                    snName:'',
                    connd_value: '',
                    time: 'transaction_date',
                    sort_field: '',
                    sort_type: '',
                    date_b: (Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now(),
                    tag: ''
                },
                clears: {
                    status: '',
                    shipping_id: '',
                    buyer_selected_logistics:'',
                    carrier_id: '',
                    shipping: [],
                    account_type: 1,
                    account_id: '',
                    account_code: '',
                    searchType:'belong_type',
                    snValue: '',
                    order_status: [],
                    channel_id: 0,
                    snDate: 'transaction_date',
                    snType: 'channel_order_number',
                    time: 'transaction_date',
                    snUser:'seller_id',
                    snName:'',
                    date_b: (Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now(),
                    tag: ''
                },
                operateButtons: [
                    {label: '处理', value: 2, apis: url_update, disabled: false},
                    {label: '查看', value: 1, apis: url_info},
                ],
                partAllOptions: [
                    {name: "部分导出", value: 0},
                    {name: "全部导出", value: 1}
                ],
                shippingList: [],
                warehouseList: [],
                warehouse_id: '',
                shipping_id: '',
                importExcelShow: false,
                apiPort: '',
                code: '',
                file_name:'',
                batch_api: '',
                batch_action: {},
                fields: [],
                templates: [],
                export_type: '',
                export_model_type: {
                    type: 3
                },
                export_visible: false,
                prolongAliExpress: false,
                reason_text:'',
                isHighlight:false,
                suffix:''
            }
        },
        mounted() {
            this.init();
            this.get_fields();
            this.get_templates();
        },
        methods: {
            import_excel(type){
                switch (type){
                    case 'tracking':
                        this.apiPort = api_post_tracking;
                        this.code = type;
                        this.file_name = `下载跟踪号导入模板`;
                        this.suffix = '.xls';
                        break;
                    case 'orders_notes':
                        this.apiPort = api_orders_batch_import;
                        this.code = type;
                        this.file_name = `下载备注导入模板`;
                        this.suffix = '.xlsx';
                        break;
                }
                this.importExcelShow = true;
            },
            get_fields() {
                this.$http(api_orders_export_title).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            get_templates() {
                this.$http(api_goods_export_template, {type: 3}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    })
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
                            export_type: this.export_type
                        };
                        Object.assign(data,this.init_params());
                        return this.order_export(data, {
                            'X-Result-Fields': fields,
                            contentType: 'application/x-www-form-urlencoded',
                            timeout:INFINITE
                        });
                        break;
                    case 1://全部
                        data = this.init_params();
                        this.$set(data, 'export_type', this.export_type);
                        return this.order_export(data, {
                            'X-Result-Fields': fields,
                            contentType: 'application/x-www-form-urlencoded',
                            timeout:INFINITE
                        });
                        break;
                }
            },
            shipping_show() {
                if (this.ids.length <= 0) {
                    this.$reqKey('api_warehouse_remote', false);
                    return this.$message({type: "warning", message: "请先勾选需要更改运输方式的订单"});
                }
                this.resultShow = true;
                this.warehouse_id = this.form.warehouse_id;
                this.shipping_id = '';
                this.warehouse_remote();
                this.shipping_remote();
            },
            batch_remark() {
                if (this.ids.length <= 0) {
                    this.$reqKey('url_batch_remark', false);
                    return this.$message({type: "warning", message: "请先勾选需要批量备注的订单"});
                }
                this.remarkDialog = true;
                this.title = '批量添加备注';
                this.batch_action = 'remark';
                this.batch_api = api_batch_remark;
            },
            submit_remark(val, api, action) {
                let data = {
                    order_ids: this.ids
                };
                data[action] = val;
                this.$http(api, data).then(res => {
                    if (res.data && res.data.length > 0) {
                        res.data.forEach(row => {
                            this.$message({type: "warning", message: row || res});
                        });
                    } else {
                        this.$message({type: "success", message: res.message || res});
                        this.tables.lists.forEach(row => {
                            this.ids.forEach(item => {
                                if (row.id == item) {
                                    row.status = 4294967295;
                                }
                            });
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
            warehouse_remote() {
                this.$http(api_get_warehouse).then(res => {
                    this.warehouseList = res;
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('api_warehouse_remote', false)
                    }, 200);
                });
            },
            change_warehouse() {
                this.shipping_remote();
                this.shipping_id = '';
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
            cancel_running_rule() {
                if (this.ids.length <= 0) {
                    this.$reqKey('url_again_running_rule', false);
                    return this.$message({type: "warning", message: "请先选择要操作的数据！"});
                }
                let params = {
                    order_ids: this.ids
                };
                this.$http(api_again_running_rule, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.init();
                    this.ids = [];
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('url_again_running_rule', false);
                    }, 200)
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
                    this.resultShow = false;
                    this.$message({type: 'success', message: res.message || res});
                    this.init();
                    this.ids = [];
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                })
            },
            cancel_logistics() {
                if (this.ids.length <= 0) {
                    this.$reqKey('url_cancel_logistics', false);
                    return this.$message({type: "warning", message: "请先选择要操作的数据！"})
                }
                let params = {
                    order_ids: this.ids
                };
                this.$http(api_cancel_logistics, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.init();
                    this.ids = [];
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('url_cancel_logistics', false)
                    }, 200);
                });
            },
            order_export(params, head) {
                return this.$http(api_orders_export, params, head).then(res => {
                    if (res.join_queue === 1) {
                        this.export_visible = true;
                        this.$message({type: "success", message: res.message || res});
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
                })
                return Promise.resolve()
            },
            search() {
                this.init();
            },
            cancel_invalid() {
                this.init();
            },
            checx_box_change(val) {
                this.checkedData=val;
                this.ids = val.map(row =>row.id);
            },
            init_params() {
                let params = {
                    page: this.tables.page,
                    pageSize: this.tables.pageSize,
                    snDate: this.form.snDate,
                    snUser:this.form.snUser,
                    delivery_type: this.form.delivery_type,
                    snType: this.form.snType,
                    searchType: this.form.searchType,
                    tag: this.form.tag
                };
                this.form.snValue!=='' && (params.snValue = this.form.snValue);
                this.form.snName && (params.snName = this.form.snName);
                this.form.sort_field && (params.sort_field = this.form.sort_field);
                this.form.sort_type && (params.sort_type = this.form.sort_type);
                this.form.account_type && (params.account_type = this.form.account_type);
                this.form.account_id && (params.account_id = this.form.account_id);
                this.form.order_status.length > 0 && (params.status = this.form.order_status[this.form.order_status.length - 1]);
                if (this.form.account_code) {
                    let splitCode = this.split_search(this.form.account_code);
                    params.account_id = splitCode && splitCode.length ? splitCode.map(row => row.trim()) : '';
                }
                if(!!this.form.channel_id){
                    params.channel_id = this.form.channel_id;
                    if(this.form.channel_id===1&&this.form.buyer_selected_logistics){
                        params.buyer_selected_logistics = this.form.buyer_selected_logistics;
                    }
                }
                // if(this.form.account_id.length >0){
                //     params.account_id = this.form.account_id;
                // }else{
                //     params.account_id = '';
                // }
                this.form.shop_id && (params.shop_id = this.form.shop_id);
                this.form.warehouse_id && (params.warehouse_id = this.form.warehouse_id);
                this.form.shipping.length === 1 && (params.carrier_id = this.form.shipping[0]);
                this.form.shipping.length === 2 && (params.shipping_id = this.form.shipping[1]);
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
                let curString = '';
                if (this.form.snType === 'buyer_id' || this.form.snType === 'target') {
                    curString = this.form.batchText.replace(new RegExp('\n', 'gm'), '\n');
                } else {
                    curString = this.form.batchText.replace(new RegExp(' ', 'gm'), '\n');
                }
                let cur = curString.split('\n').filter(row => !!row);
                if (cur && cur.length > 1) {
                    params.snText = cur.map(row => {
                        return row.trim();
                    });
                } else if (cur && cur.length === 1) {
                    params.snText = this.form.batchText.trim();
                }
                return params;
            },
            init() {
                //赋值控制的loading线上会出现this.isLoad = false;无法关闭的超级在BUG，只能出此下策
                let loading = this.$loading({target:'#local-index-data-table',lock:true,text:'玩命加载中...',background:`rgba(0,0,0,0.7)`});
                let data = this.init_params();
                this.$http(api_get, data).then(res => {
                    this.isHighlight = data.delivery_type===''?true:false;
                    loading.close();
                    this.tables.totalSize = res.count;
                    this.tables.lists = res.data;
                    this.tables.lists.forEach(row => {
                        this.$set(row, 'isCheck', false);
                        this.$set(row, 'show', false);
                        this.$set(row, 'operateButtons', window.clone(this.operateButtons));
                        if (row.status === 4294967295) {
                            row.operateButtons[1].disabled = true;
                            let cur = {label: '取消作废', value: 4, apis: url_cancel_invalid, disabled: false};
                            row.operateButtons.push(cur);
                        }
                    });
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
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
            split_search(data){
                let curString = data.replace(new RegExp(' ','gm'),'\n');
                let cur = curString.split('\n').filter(row=>!!row);
                return cur
            },
            batch_invalid() {
                if (this.ids.length === 0) {
                    this.$reqKey('url_batch_remark', false);
                    return this.$message({type: "warning", message: "请先勾选需要批量备注的订单"});
                }
                this.title = '批量作废订单';
                this.batch_api = api_batch_invalid;
                this.batch_action = 'reason';
                this.remarkDialog = true;
            },
            batch_review(){
                if (this.ids.length === 0) {
                    this.$reqKey('url_orders_batch_review', false);
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
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('url_orders_batch_review', false);
                        }, 200);
                    })
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消"
                    })
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('url_orders_batch_review', false);
                    }, 200);
                });
            },
            aliExpressTimeDialog() {
                if (this.ids.length === 0) {
                    this.$message({type: 'warning', message: '未勾选订单，请勾选！'});
                    return
                }
                let notAliExpress = this.ids.every(id => {
                    let find = this.tables.lists.find(row => row.id === id);
                    if (find.channel_id !== 4) {
                        return false
                    } else {
                        return true
                    }
                });
                if (!notAliExpress) {
                    this.$message({type: 'warning', message: '存在不是速卖通平台的订单，请重新选择！'});
                    return
                }
                this.prolongAliExpress = true;
            },
            updateTime(time) {
                let data = {order_ids: this.ids};
                this.$http(api_orders_day_address, time, data).then(res => {
                    let errorData = res.data;
                    if (errorData.length > 0) {
                        let newDatas = [];
                        const h = this.$createElement;
                        //通过循环data数组，调用h方法，将每项值传给h,h('标签名',样式,具体内容)
                        for (let i in errorData) {
                            //将data数据push进newDatas数组中
                            newDatas.push(h('p', null, errorData[i]));
                        }
                        ;
                        this.$msgbox({title: '提示', type: 'error', message: h('div', null, newDatas) || code});
                    } else {
                        this.$message({type: 'success', message: res.message || res});
                    }
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            batch_change_warehouse(){
                if (this.ids.length <= 0) {
                    return this.$message({type: "warning", message: "请先勾选需要批量备注的订单"});
                }
                this.title = '批量修改仓库';
                this.changeWarehouseDialog = true;
            },
            // 批量联系买家
            batch_contact_the_buyer(){
                this.orderID=[];
                if (this.checkedData.length <= 0) {
                    this.$message({
                        type: 'warning',
                        message: '请先勾选需要批量操作的数据！'
                    });
                    return;
                }
                let data=[];
                this.checkedData.forEach(row=>{
                    if (row.channel_id===1||row.channel_id===2||row.channel_id===4) {
                        data.push(row)
                    }
                });
                if(data.length===0||data.length!== this.checkedData.length){
                    this.$message({
                        type: 'warning',
                        message: '所选平台订单暂不支持！'
                    });
                    return;
                }else{
                    if (data.every(row=>row.channel_id===1)||data.every(row=>row.channel_id===2)||data.every(row=>row.channel_id===4)) {
                        this.channelID=data[0].channel_id
                        this.orderID=data.map(item=>item.id);
                        this.contactTheBuyerDialog = true;
                    }else{
                        this.$message({
                            type: 'warning',
                            message: '请选同一个平台的订单！'
                        });
                    }
                }
            },
            //计算计抛重量和运费
            calculate_estimated_fee(){
                if (this.ids.length <= 0) {
                    return this.$message({type: "warning", message: "请先勾选需要批量操作的数据"});
                }
                let data={
                    order_ids:this.ids
                };
                this.$http(api_orders_calculate_estimated_fee, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.init();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            // batch_contact_the_buyer(){
            //     this.orderID=[];
            //     if (this.ids.length <= 0) {
            //         return this.$message({type: "warning", message: "请先勾选需要批量操作的数据"});
            //     }
            //     this.checkedData.forEach(row=>{
            //         if (row.channel_id===1){
            //             this.orderID.push(row.id)
            //         }
            //     });
            //     if (this.orderID.length<this.checkedData.length&&this.orderID.length>0||this.orderID.length===0){
            //         return this.$message({type: "warning", message: "仅限ebay平台的订单可进行此操作"});
            //     }
            //     this.contactTheBuyerDialog = true;
            // },
            submit_change_warehouse(warehouse){
                this.$http(api_orders_batch_change_warehouse,{order_ids:this.ids, warehouse_id:warehouse.value}).then(res=>{
                    this.init();
                    this.changeWarehouseDialog = false;
                    this.$message({type:'success',message:res.message||res});
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_orders_batch_change_warehouse',false);
                    },200);
                })
            }
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
            trendsSelect: require('@/components/trends-select.vue').default,
            batchRemark: require('./batch-remark.vue').default,
            contactBuyer: require('./contact-buyer').default,
            importExcel: require('../../product/excel-update/import-excel.vue').default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('../../report/export-dialog').default,
            prolongDialog: require('./prolong-dialog').default,
            batchChangeWarehouse:require('./batch-change-warehouse').default,
        }
    }
</script>
