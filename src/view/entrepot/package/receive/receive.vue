<template>
    <div v-loading="loading" element-loading-text="玩命加载中">
        <el-card class="receive-label">
            <el-form>
                <el-form-item>
                    <label class="bold-font width-xs inline t-right">
                        装板卡板号：
                    </label>
                    <el-input class="inline"
                              v-model="box_id"
                              :disabled="true"
                              placeholder="请创建一个卡板号">
                    </el-input>
                    <permission tag="requestButton"
                                :route="apis.url_new_parcel_box"
                                req-key="createCardboard"
                                type="primary"
                                :disabled="box_id !== ''"
                                size="mini"
                                class="ml-sm inline"
                                @click="create_box"
                    >创建卡板号
                    </permission>
                    <permission tag="requestButton"
                                :route="apis.url_end_parcel_box"
                                req-key="finishCardboard"
                                type="primary"
                                :disabled="box_id === ''"
                                size="mini"
                                class="ml-sm inline"
                                @click="finish_box"
                    >结束打板并打印
                    </permission>
                    <span class="ml-sm red">注意：装板前创建卡板号；换卡板时结束并打印</span>
                </el-form-item>
                <el-form-item class="inline">
                    <span class="width-xs inline t-right">
                        <label class="bold-font">
                            运单号：
                        </label>
                    </span>
                    <el-input class="inline"
                              v-model="searchData.waybill"
                              ref="waybill"
                              :class="{redBorder: warningVisible}"
                              placeholder="请输入运单号"
                              @blur="waybill_lose"
                              autofocus
                              @keyup.enter.native="waybill_enter($event)">
                    </el-input>
                    <permission tag="ElButton"
                                :route="apis.url_parcel_getOrder"
                                type="primary"
                                :disabled="waybillValid"
                                placeholder="请输入运单号"
                                width="50px"
                                size="mini"
                                class="ml-sm inline"
                                v-show="radio.searchPurchase < 1"
                                @click="waybill_search"
                    >查询
                    </permission>
                    <span v-if="warningVisible" class="redColor ml-sm">{{warning_title}}</span>
                    <span class="receive-blue ml-sm" v-show="radio.searchPurchase < 1">按下F2切换搜索方式</span>
                </el-form-item>
                <el-form-item v-if="purchaseEnter" class="inline">
                    <label class="width-xs inline t-right bold-font">运输方式：</label>
                    <allow-create-select class="width-input inline"
                                         v-model="logistics_company_name"></allow-create-select>
                    <span class="receive-blue ml-sm">若接收包裹的运单号与采购单运单号不符或不存在时，可以修改采购单运单号</span>
                </el-form-item>
                <el-form-item>
                    <div class="width-xs inline t-right">
                        <el-checkbox class="radio"
                                     v-model="radio.searchPurchase">
                        </el-checkbox>
                        <label class="bold-font">
                            采购单ID：</label>
                    </div>
                    <el-input
                            class="inline"
                            v-model="searchData.purchase"
                            ref="purchase"
                            :readonly="radio.searchPurchase < 1"
                            :class="{ 'bg-gray': radio.searchPurchase < 1 }"
                            @change="change_purchase"
                            @focus="purchaseFocus"
                            @blur="purchase_valid"
                            @keyup.enter.native="purchase_enter($event)"
                    ></el-input>
                    <permission tag="ElButton"
                                :route="apis.url_parcel_getTrackOrder"
                                type="primary"
                                :disabled="purchaseValid"
                                size="mini"
                                class="ml-sm"
                                v-show="radio.searchPurchase > 0"
                                @click.native="purchase_search"
                    >查询
                    </permission>
                    <span v-if="!!warningPurchase" class="redColor ml-sm">{{warningPurchase}}</span>
                    <span class="receive-blue ml-sm" v-show="radio.searchPurchase > 0">按下F2切换搜索方式</span>
                </el-form-item>
                <el-form-item class="inline">
                    <label class="width-xs inline t-right bold-font">包裹重量：</label>
                    <scan-input v-model="searchData.weight"
                                :min="0"
                                :class="{redBorder: warningWeight}"
                                ref="weight"
                                :readonly="hasWeight"
                                @blur="weight_lose"
                                @enter="weight_enter"
                                class="inline">
                    </scan-input>
                    g
                    <span v-if="warningWeight" class="redColor ml-sm">{{warning_weight}}</span>
                </el-form-item>
                <el-form-item class="inline">
                    <label class="width-xs inline t-right bold-font">供应商：</label>
                    <el-input class="inline bg-gray"
                              v-model="form.supplier_name"
                              :readonly="true">
                    </el-input>
                </el-form-item>
                <el-form-item class="inline">
                    <label class="width-xs inline t-right bold-font">采购员：</label>
                    <el-input class="inline bg-gray"
                              v-model="form.purchase_user_name_list"
                              :readonly="true">
                    </el-input>
                </el-form-item>
                <el-form-item class="inline">
                    <label class="width-xs inline t-right bold-font">仓库：</label>
                    <el-input class="inline bg-gray warehouse-custom"
                              v-model="form.warehouse_name"
                              :readonly="true"></el-input>
                </el-form-item>
                <el-form-item class="inline">
                    <label class="width-xs inline t-right bold-font">收货台：</label>
                    <el-input class="inline bg-gray"
                              v-model="form.receiving_platform"
                              :readonly="true"></el-input>
                    <span v-if="is_urgent !== ''"
                          class="receiveNormal"
                          :class="{receiveUrgency:is_urgent}">
                            <b>{{is_urgent | statusFilters}}</b>
                        </span>
                </el-form-item>
                <el-form-item label="">
                    <label class="width-xs inline t-right bold-font"></label>
                    <permission tag="ElButton"
                                :route="apis.url_parcel_create"
                                type="primary"
                                :disabled="formValid || abnormalMark"
                                @click.native="form_submit"
                                :plain="true"
                                size="mini"
                    >保存
                    </permission>
                    <el-button size="mini" :disabled="abnormalMark" @click.native="clear">清空搜索</el-button>
                    <permission tag="ElButton"
                                type="primary"
                                :route="apis.url_receive_abnormal_mark"
                                :disabled="!abnormalMark"
                                @click.native="mark_abnormal"
                                size="mini">标为异常
                    </permission>
                </el-form-item>
            </el-form>
        </el-card>
        <p class="mt-ms mb-xs">
            <span class="font mr-sm">包裹接收记录</span>
            <span class="fr" style="color: #e4393c;;">注意：已拆分的包裹不可编辑</span>
        </p>
        <el-card>
            <el-table
                    :data="curTableDate"
                    border
                    class="scroll-bar"
                    v-resize="{height: 41}"
                    :default-sort="{prop: 'index', order: 'descending'}">
                <el-table-column
                        prop="index"
                        label="排序"
                        width="50">
                </el-table-column>
                <el-table-column
                        label="运单号"
                        prop="tracking_number"
                        min-width="100">
                </el-table-column>
                <el-table-column
                        prop="purchase_order_ids"
                        label="采购单ID"
                        min-width="100">
                </el-table-column>

                <el-table-column
                        prop="supplier_name"
                        min-width="150"
                        label="供应商">
                </el-table-column>
                <el-table-column
                        prop="purchaser_user_name_list"
                        label="采购员">
                </el-table-column>
                <el-table-column
                        min-width="100"
                        prop="receiving_platform"
                        label="收货台">
                </el-table-column>
                <el-table-column
                        prop="warehouse_name"
                        label="仓库">
                </el-table-column>
                <el-table-column
                        min-width="80"
                        prop="creator_user_name"
                        label="接收员">
                </el-table-column>
                <el-table-column
                        min-width="100"
                        prop="create_time_str"
                        label="接收时间">
                </el-table-column>
                <el-table-column
                        min-width="60"
                        prop="purchase_parcel_weight"
                        label="重量（g）">
                </el-table-column>
                <el-table-column
                        min-width="80"
                        label="是否紧急">
                    <template slot-scope="scope">
                    <span class="receiveNormal"
                          :class="{receiveUrgency:scope.row.is_urgent}">
                        <b>{{scope.row.is_urgent | statusFilters}}</b></span>
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="80"
                        label="是否拆分">
                    <template slot-scope="scope">
                        <span :class="{redColor:scope.row.is_use}">{{scope.row.is_use | isSplit}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        min-width="80"
                        label="操作">
                    <template slot-scope="scope">
                        <permission tag="ElButton"
                                    :route="apis.url_parcel_update"
                                    type="text"
                                    @click="receive_update(scope.row)">修改
                        </permission>
                        <permission tag="span"
                                    :route="apis.url_parcel_delete">|
                        </permission>
                        <permission tag="ElButton"
                                    :route="apis.url_parcel_delete"
                                    type="text"
                                    @click="receive_delete(scope.row)">删除
                        </permission>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="fr t-right"
                           @size-change="handle_size_change"
                           @current-change="handle_current_change"
                           :current-page="page"
                           :page-size="pageSize"
                           layout="total,prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </el-card>
        <search-dialog v-model="dialogTableVisible"
                       @select-tracking="select_tracking"
                       :purchase-note="purchaseNote">
        </search-dialog>
        <updata-dialog v-model="updateVisible"
                       :update-form="updateForm"
                       @table-data="update_table">
        </updata-dialog>
        <urgent-package v-model="urgentVisible"
                        :urgent-text="urgentText" :box_id="box_id"
                        @close="urgent_close"
                        @join="join_box"></urgent-package>
        <preview v-model="printVisible"
                 :batch-data="batchData"
                 :column-height="700"
                 ref="preview">
        </preview>
        <abnormal-mark v-model="abnormalVisible"
                       @abnormal-mark="abnormal_mark"
                       :abnormal-data="abnormalData"></abnormal-mark>
    </div>
</template>

<style lang="stylus">
    .receive-label label {
        font-weight: 900;
        font-size: 16px;
    }

    .width-input {
        width: 153px;
    }

    .bg-gray
        .el-input__inner
            background-color #f0f0f0

    .warehouse-custom {
        .el-input__inner {
            font-size: 18px;
            font-weight: 600;
            width: 153px;
            color: red;
        }
    }

    .font {
        font-weight: 900;
        font-size: 14px;
    }

    .redColor {
        color: #e4393c;
    }

    .redBorder input:focus {
        border-color: #e4393c;
    }

    .redBorder input {
        border-color: #e4393c;
    }

    .receive-label .el-form-item {
        height: 26px;
    }

    .receiveNormal {
        color: green;
    }

    .receiveUrgency {
        color: #e4393c;
    }

    .receive-blue {
        color: #1D8CE0;
    }
</style>

<script>
    import {
        api_parcel_getOrder,
        api_parcel_create,
        api_parcel_getTrackOrder,
        api_parcel_delete,
        api_parcel_update,
        api_parcel_detail,
        url_parcel_getOrder,
        url_parcel_getTrackOrder,
        url_parcel_create,
        url_parcel_update,
        url_parcel_delete,
    } from "@/api/receive-parcel.js";

    import {
        api_new_parcel_box,
        api_end_parcel_box,
        api_parcel_box_batch_print,
        url_new_parcel_box,
        url_end_parcel_box
    } from "@/api/purchase-parcels-box";

    import {url_receive_abnormal_mark} from "@/api/ready-receive";

    export default {
        refresh() {
        },
        permission: {
            url_parcel_getOrder,
            url_parcel_getTrackOrder,
            url_parcel_create,
            url_parcel_update,
            url_parcel_delete,
            url_new_parcel_box,
            url_end_parcel_box,
            url_receive_abnormal_mark
        },
        data() {
            return {
                page: 1,
                pageSize: 50,
                radio: {
                    searchPurchase: false,
                },
                autoImport: false,
                logistics_company_name_list: [],
                logistics_intercept_list: {},
                logistics_company_name: '',
                box_id: '',
                searchData: {
                    waybill: '',
                    old_waybill: '',
                    receivedType: 1,
                    purchase: '',
                    weight: ''
                },
                form: {},//搜索出来的数据
                is_urgent: '',
                tableData: [],
                curTableDate: [],
                dialogTableVisible: false,
                updateVisible: false,
                printVisible: false,
                urgentVisible: false,
                urgentText: '',//紧急处理措施
                batchData: [],//卡板标签打印数据
                purchaseNote: [],//弹框的运单号
                updateForm: {},
                trackRedact: true,//运单号是否可以编辑
                weightRedact: true,//重量是否可以编辑
                warningVisible: false,
                warningWeight: false,
                warning_title: '请输入正确的运单号！',
                warning_weight: '重量非法！',
                loading: false,
                warningPurchase: '',
                purchaseEnter: false,
                join: true,
                abnormalMark: false, //标记异常
                abnormalVisible: false,
                abnormalData: {},
                hasWeight: false, //所搜运单号是否已称重
                purchase_parcels_weights: {},// 采购单各运单号称重信息
            }
        },
        created() {
            let component = this;
            document.onkeydown = function (event) {
                let e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode === 113) { // 按 F2
                    component.onkey_f2();
                }
            }
        },
        mounted() {
        },
        filters: {
            isSplit(row) {
                if (row === 1) {
                    return '已拆';
                } else {
                    return '未拆'
                }
            },
            statusFilters(val) {
                if (val === 1) {
                    return '紧急';
                } else {
                    return '正常';
                }
            }
        },
        methods: {
            onkey_f2() {
                this.radio.searchPurchase = !this.radio.searchPurchase;
                if (this.radio.searchPurchase) {
                    this.searchData.waybill = '';
                    this.$refs.purchase.$refs.input.select();
                } else {
                    this.searchData.purchase = '';
                    this.$refs.waybill.$refs.input.select();
                }
            },
            //清空搜索
            clean_search(data) {
                Object.keys(data).forEach(key => {
                    data[key] = "";
                });
                this.hasWeight = false;
                this.abnormalMark = false;
            },
            waybill_enter(ev) {
                if (!this.radio.searchPurchase) {
                    if (ev.keyCode === 13) {
                        this.waybill_search();
                    }
                } else {
                    if (this.searchData.weight === '') {
                        this.$refs.weight.focus();
                    } else if (this.searchData.purchase === '') {
                        this.$refs.purchase.$refs.input.focus();
                    } else {
                        this.form_submit();
                    }
                }
            },
            purchase_enter(ev) {
                if (ev.keyCode === 13) {
                    this.purchase_search();
                }
            },
            purchaseFocus() {
                console.log("purchaseFocuspurchaseFocuspurchaseFocus:",)
            },
            weight_enter() {
                console.log('weight enter');
                let reg = /^\d+(\.\d{0,3})?$/;
                if (!reg.test(this.searchData.weight) || this.searchData.weight > 99999999 || this.searchData.weight <= 0) {
                    this.warningWeight = true;
                    this.$refs.weight.$refs.input.select();
                    return false;
                } else {
                    this.warningWeight = false;
                }

                if (!this.radio.searchPurchase) {
                    if (this.searchData.waybill === '') {
                        this.$refs.waybill.$refs.input.focus();
                    } else {
                        this.form_submit();
                    }
                } else {
                    if (this.searchData.purchase === '') {
                        this.$refs.purchase.$refs.input.focus();
                    } /*else if (this.searchData.waybill === '') {
                        this.$refs.waybill.$refs.input.focus();
                    } */ else {
                        this.form_submit();
                    }
                }
            },
            waybill_lose() {
                /*let reg = /^[0-9]*$/;
                if (!reg.test(this.searchData.waybill)) {
                    this.warningVisible = true;
                    return false;
                } else {
                    this.warningVisible = false;
                }*/
            },
            purchase_valid() {
                let reg = /^0/;
                if (this.searchData.purchase !== '' && reg.test(this.searchData.purchase)) {
                    this.$message({type: 'error', message: '采购单ID错误，请重输'});
                    this.searchData.purchase = '';
                    this.$refs.purchase.inputSelect();
                    return false;
                }
                return true;
            },
            weight_lose() {
                let reg = /^\d+(\.\d{0,3})?$/;
                this.clear_empty(this.searchData);
                if (this.searchData.weight !== '') {
                    if (!reg.test(this.searchData.weight) || this.searchData.weight > 99999999 || this.searchData.weight <= 0) {
                        this.warningWeight = true;
                        return false;
                    } else {
                        this.warningWeight = false;
                    }
                }
            },
            change_purchase() {
                this.warningPurchase = '';
            },
            //运单号搜索
            waybill_search() {
                this.abnormalMark = false;
                this.trim_search();
                this.clean_search(this.form);
                this.is_urgent = '';
                this.searchData.purchase = '';
                this.clear_empty(this.searchData);
                let params = {
                    receivedType: this.searchData.receivedType,
                    tracking_number: this.searchData.waybill
                };
                this.$http(api_parcel_getOrder, params).then(res => {
                    this.purchaseEnter = false;
                    this.warningVisible = false;
                    if (res.status === 1) {
                        //紧急拦截
                        if(res.list.logistics_intercept_list) {
                            let urgentText = res.list.logistics_intercept_list[this.searchData.waybill];
                            if (urgentText !== 0) {
                                this.urgent_show(urgentText)
                            }
                        }
                        this.is_urgent = res.is_urgent;
                        this.form = res.list;
                        this.form.purchase_user_name_list = this.form.purchase_user_name_list.toString();
                        this.form.purchase_user_id_list = this.form.purchase_user_id_list.toString();
                        this.searchData.purchase = res.list.purchase_order_ids;
                        let errorMessage = '';
                        for (let key in res.order_status) {
                            switch (res.order_status[key]) {
                                case 20:
                                    errorMessage = `采购单：${key}为部分到货不等待剩余不能接收`;
                                    this.$message({type: "error", message: errorMessage});
                                    return false;
                                case 0:
                                    errorMessage = `采购单：${key}为等待下单不能接收`;
                                    this.$message({type: "error", message: errorMessage});
                                    return false;
                                case 21:
                                    errorMessage = `采购单：${key}为全部到货不能接收`;
                                    this.$message({type: "error", message: errorMessage});
                                    return false;
                                case -1:
                                    errorMessage = `采购单：${key}为已作废不能接收`;
                                    this.$message({type: "error", message: errorMessage});
                                    return false;
                            }
                        }
                        if (this.searchData.weight === '') {
                            this.$refs.weight.focus();
                        } else {
                            this.form_submit();
                        }
                        if (Number(res.list.purchase_parcels_weight)) {
                            this.searchData.weight = res.list.purchase_parcels_weight;
                            this.hasWeight = true;
                        }
                    } else {
                        this.warningVisible = true;
                        this.$message({
                            showClose: true,
                            type: "warning",
                            message: res.message || res
                        });
                        this.abnormalMark = true;
                        this.$refs.waybill.$refs.input.select();
                        this.searchData.weight = res.purchase_parcels_weight || '';
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            //采购单号搜索
            purchase_search() {
                if (!this.purchase_valid()) {
                    return;
                }
                ;
                this.trim_search();
                this.clean_search(this.form);
                this.is_urgent = '';
                this.clear_empty(this.searchData);
                let params = {
                    receivedType: this.searchData.receivedType,
                    entered_tracking_number: this.searchData.waybill,
                    purchase_order_ids: this.searchData.purchase
                };
                this.$http(api_parcel_getTrackOrder, params).then(res => {

                    if (res.status === 1) {
                        this.purchaseEnter = true;
                        this.warningVisible = false;
                        this.logistics_intercept_list = res.list.logistics_intercept_list;
                        this.purchase_parcels_weights = res.list.purchase_parcels_weights;
                        this.is_urgent = res.is_urgent;
                        let errorMessage = '';
                        this.logistics_company_name_list = res.list.logistics_company_name_list;
                        for (let key in res.list.order_status) {
                            switch (res.list.order_status[key]) {
                                case 20:
                                    errorMessage = `采购单：${key}为部分到货不等待剩余不能接收`;
                                    this.$message({type: "error", message: errorMessage});
                                    return false;
                                case 0:
                                    errorMessage = `采购单：${key}为等待下单不能接收`;
                                    this.$message({type: "error", message: errorMessage});
                                    return false;
                                case 21:
                                    errorMessage = `采购单：${key}为全部到货不能接收`;
                                    this.$message({type: "error", message: errorMessage});
                                    return false;
                                case -1:
                                    errorMessage = `采购单：${key}为已作废不能接收`;
                                    this.$message({type: "error", message: errorMessage});
                                    return false;
                            }
                        }
                        // 根据是否包含多个包裹选择处理方式
                        if (res.list.tracking_number_list.length > 1) {
                            this.dialogTableVisible = true;
                            this.purchaseNote = res.list.tracking_number_list;
                            this.purchaseNote.unshift('新增运单号');
                        } else {
                            this.searchData.weight = res.weight === 0 ? '' : res.weight;
                            this.searchData.waybill = res.list.tracking_number_list.toString();
                            this.searchData.old_waybill = this.searchData.waybill;
                            this.logistics_company_name = this.logistics_company_name_list[this.searchData.old_waybill];
                            let flag = false;
                            let errorMessage = '';
                            if (this.searchData.weight === '') {
                                this.$refs.weight.focus();
                            } else if (this.searchData.waybill === '') {
                                this.$refs.waybill.$refs.input.focus();
                            } else {
                                this.form_submit();
                            }
                        }
                        this.form = res.list;
                        this.form.purchase_user_name_list = this.form.purchase_user_name_list.toString();
                        this.form.purchase_user_id_list = this.form.purchase_user_id_list.toString();
                    } else {
                        if (!!res.list) {
                            this.form = res.list;
                            this.form.purchase_user_name_list = this.form.purchase_user_name_list.toString();
                            this.form.purchase_user_id_list = this.form.purchase_user_id_list.toString();
                        }
                        this.$refs.purchase.$refs.input.select();
                        this.searchData.weight = '';
                        this.warningPurchase = res.message;
                    }
                }).catch(code => {
                    this.$message({type: "error", message: `${code.message}` || code});
                });
            },
            //保存
            form_submit() {
                this.trim_search();
                if (this.formValid) {
                    return;
                }
                let reg = /^\d+(\.\d{0,3})?$/;
                this.clear_empty(this.searchData);
                if (!reg.test(this.searchData.weight) || this.searchData.weight > 99999999 || this.searchData.weight <= 0) {
                    this.warningWeight = true;
                    this.$refs.weight.select();
                    this.hasWeight = false;
                    return false;
                } else {
                    this.warningWeight = false;
                }
                let oneData = {
                    tracking_number: this.searchData.waybill,
                    purchase_order_ids: this.searchData.purchase,
                    purchase_parcel_weight: this.searchData.weight,
                    supplier_id: this.form.supplier_id,
                    purchaser_user_ids: this.form.purchase_user_id_list,
                    receiving_platform: this.form.receiving_platform,
                    warehouse_id: this.form.warehouse_id,
                };

                // 紧急包裹是否加入卡板
                if (this.box_id === '' || (this.urgentText !== 0 && !this.join)) {
                } else {
                    oneData.box_id = this.box_id;
                }
                if (this.radio.searchPurchase && this.searchData.old_waybill !== this.searchData.waybill) {
                    this.$confirm(`您将在采购单${this.searchData.purchase}中，新增运单号${this.searchData.waybill}，是否确认?`, '提示', {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then(() => {
                        Object.assign(oneData, {old_tracking_number: this.searchData.old_waybill});
                        if (!this.logistics_company_name && this.searchData.waybill) {
                            this.$message({type: 'error', message: '必须选择一种运输方式'});
                            return;
                        }
                        Object.assign(oneData, {logistics_company_name: this.logistics_company_name});
                        this.save(oneData);
                    }).catch(() => {
                        return false;
                    });
                    console.log('change waybill');
                } else {
                    if (this.purchaseEnter && this.logistics_company_name) {
                        Object.assign(oneData, {logistics_company_name: this.logistics_company_name});
                    }
                    this.save(oneData);
                }

            },
            save(oneData) {
                this.loading = true;
                this.$http(api_parcel_create, oneData).then(res => {
                    this.purchaseEnter = false;
                    if (res.status === 1) {
                        this.loading = false;
                        this.hasWeight = false;
                        this.$refs.waybill.$refs.input.focus();
                        let i = 1;
                        console.log("res.list:", res.list)
                        res.list.purchase_order_ids = res.list.purchase_order_ids.toString();
                        res.list.purchaser_user_name_list = res.list.purchaser_user_name_list.toString();
                        if (res.action === 'Create') {
                            this.tableData.push(res.list);
                        } else {
                            /*let index = null;
                            for (let i = 0; i < this.tableData.length; i++) {
                                if (this.tableData[i].tracking_number === res.list.tracking_number) {
                                    index = i;
                                    break;
                                }
                            }*/
                            let index = this.tableData.findIndex(row => row.tracking_number === res.list.tracking_number);
                            if(index !== -1) {
                                this.tableData.splice(index, 1, res.list);
                            } else {
                                this.tableData.push(res.list);
                            }
                        }
                        this.clean_search(this.form);
                        let type = this.searchData.receivedType;
                        this.clean_search(this.searchData);
                        this.searchData.receivedType = type;
                        this.is_urgent = '';
                        this.$message({
                            showClose: true,
                            type: 'success',
                            message: '保存成功！'
                        });
                        this.tableData.map(res => {
                            res.index = i;
                            i++;
                            return res;
                        });
                    } else {
                        this.loading = false;
                        this.$message({
                            showClose: true,
                            type: 'error',
                            message: res.message || res,
                        });
                    }
                }).catch(code => {
                    this.loading = false;
                    this.$message({type: 'error', message: code.message || code,});
                })
            },
            //选择订单
            select_tracking(tracking) {
                if (tracking === '新增运单号') {
                    this.searchData.waybill = '';
                    this.$refs.waybill.inputSelect();
                } else {
                    this.searchData.waybill = tracking;
                    this.searchData.old_waybill = tracking;
                    let urgentText = this.logistics_intercept_list[this.searchData.waybill];
                    if (urgentText !== 0) {
                        this.urgent_show(urgentText);
                    }
                    if (Number(this.purchase_parcels_weights[this.searchData.waybill])) {
                        this.searchData.weight = this.purchase_parcels_weights[this.searchData.waybill]
                        this.hasWeight = true;
                    }
                }
                this.logistics_company_name = this.logistics_company_name_list[tracking];
            },
            //删除
            receive_delete(data) {
                this.$confirm('您将删除运单号' + data.tracking_number + ',确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_parcel_delete, {purchase_parcel_code: data.purchase_parcel_code}).then(res => {
                        if (res.status === 1) {
                            this.$message({
                                showClose: true,
                                type: 'success',
                                message: '删除成功！'
                            });
                            this.tableData.splice(data.index - 1, 1);
                            //重新排序
                            let i = 1;
                            this.tableData.forEach(res => {
                                res.index = i;
                                i++;
                            });
                        } else {
                            this.$message({
                                showClose: true,
                                type: 'error',
                                message: res.message || res,
                            })
                        }
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            //修改
            receive_update(data) {
                this.$http(api_parcel_detail, {purchase_parcel_code: data.purchase_parcel_code}).then(res => {
                    res.list.purchaser_user_name_list = res.list.purchaser_user_name_list.toString();
                    this.updateForm = res.list;
                    this.updateVisible = true;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            //更新table的数据
            update_table(data) {
                let index = null;
                for (let i = 0; i < this.tableData.length; i++) {
                    if (this.tableData[i].purchase_parcel_code === data.purchase_parcel_code) {
                        this.tableData[i].purchase_parcel_weight = data.purchase_parcel_weight;
                        this.tableData[i].tracking_number = data.tracking_number;
                        break;
                    }
                }
                //重新排序
                let i = 1;
                this.tableData.forEach(res => {
                    res.index = i;
                    i++;
                });
            },
            //清空搜索数据
            clear() {
                this.is_urgent = '';
                this.clean_search(this.form);
                let type = this.searchData.receivedType;
                this.clean_search(this.searchData);
                this.searchData.receivedType = type;
                this.hasWeight = false;
            },
            //去掉空的字符串
            clear_empty(obj) {
                for (let key in obj) {
                    if (typeof obj[key] === 'string') {
                        obj[key] = obj[key].replace(/(^\s*)|(\s*$)/g, "");
                    }
                }
            },
            handle_size_change(val) {
                this.pageSize = val;
                let maxPage = Math.ceil(this.packages.length / this.pageSize) - 1;
                this.page = this.page > maxPage ? maxPage : this.page;
                this.paging_handle();
            },
            handle_current_change(val) {
                this.page = val;
                this.paging_handle();
            },
            paging_handle() {
                let length = this.pagingData.length;
                let page = length - this.page;
                this.curTableDate = this.pagingData[page];
            },
            trim_search() {
                Object.keys(this.searchData).forEach(key => {
                    if (typeof this.searchData[key] === 'string') {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
            },
            create_box() {
                this.$http(api_new_parcel_box).then(res => {
                    this.box_id = res.box_id;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code,
                    });
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('createCardboard', false);
                    }, 200);
                })
            },
            finish_box() {
                this.$http(api_end_parcel_box, this.box_id).then(res => {
                    this.$message(res.message || res);
                    let id = this.box_id;
                    this.print(id);
                    this.box_id = '';
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code,
                    });
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey(`finishCardboard`, false);
                    }, 200);
                })
            },
            print(id) {
                this.$http(api_parcel_box_batch_print, {box_ids: id}).then(res => {
                    this.batchData = res;
                    this.batchData.print_data.forEach(row => {
                        this.$set(row, 'print_num', 1);
                    });
                    this.printVisible = true;
                    this.$refs.preview.get_template(7);
                    if (this.batchData.default_temp_id) {
                        this.$nextTick(() => {
                            this.$refs.preview.change_print();
                        })
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            urgent_show(text) {
                this.urgentVisible = true;
                this.urgentText = text;
            },
            join_box(flag) {
                this.join = flag;
            },
            urgent_close() {
                this.urgentText = '';
            },
            waybillSelect() {
                this.$refs.waybill.inputSelect();
            },
            abnormal_mark() {//异常标记成功
                this.abnormalMark = false;
                this.abnormalData = {};
            },
            mark_abnormal() {//标记收包异常
                this.abnormalVisible = true;
                this.abnormalData = {
                    title: `包裹${this.searchData.waybill}异常确认`,
                    tracking_number: this.searchData.waybill,
                }
            }
        },
        computed: {
            waybillValid() {
                if (this.searchData.waybill) {

                } else {
                    return true;
                }
            },
            purchaseValid() {
                return this.searchData.purchase === '';
            },
            formValid() {
                if (!this.searchData.purchase) {
                    return true;
                }
                if (!this.searchData.weight) {
                    return true;
                }
                if (!this.form.supplier_name) {
                    return true;
                }
                if (!this.form.purchase_user_name_list) {
                    return true;
                }
                if (!this.form.warehouse_name) {
                    return true;
                }
                if (!this.form.receiving_platform) {
                    return true;
                }
                if (this.warningWeight && !this.searchData.weight) {
                    return true;
                }
                if (this.warningVisible) {
                    return true;
                }
                return false;
            },
            pagingData() { // 分页
                let pagingData = [];
                if (this.tableData.length === 0) {
                    pagingData.push([]);
                    return pagingData;
                }
                let length = Math.ceil(this.tableData.length / this.pageSize);
                for (let i = 0; i < length; i++) {
                    let start = i * this.pageSize;
                    pagingData.push(this.tableData.slice(start, start + this.pageSize));
                }
                return pagingData;
            },
            total() {
                return this.tableData.length;
            },
        },
        watch: {
            pagingData(val) {
                this.paging_handle();
            },
            'radio.searchPurchase'(val) {
                this.purchaseEnter = false;
                this.clean_search(this.form);
                if (val) {
                    this.searchData.waybill = '';
                    this.$refs.purchase.inputSelect();
                } else {
                    this.searchData.purchase = '';
                    this.$refs.waybill.inputSelect();
                }
                this.searchData.receivedType = this.radio.searchPurchase ? 2 : 1;
            }
        },
        props: {},
        components: {
            requestButton: require('@/global-components/request-button.vue').default,
            searchDialog: require('./search-dialog.vue').default,
            urgentPackage: require('./urgent-package.vue').default,
            updataDialog: require('./updata-dialog.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            allowCreateSelect: require('@/components/allow-create-select.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            scanInput: require('@/components/scan-input').default,
            virtual: require("@/components/virtual-list").default,
            preview: require('../cardboard/preview.vue').default,
            abnormalMark: require('./abnormal-mark.vue').default,
        },
    }
</script>
