<template>
    <page class="index-pending-orders-audit">
        <div class="left-box">
            <search-card class="card" @search="search"
                         :params="form" :clears="clears">
                <label-button label="问题类型："
                              ref="questbuttons"
                              :buttons="buttons"
                              :def="def_button"
                              @select="change_button"
                              :max="40"></label-button>
                <!--无法分配库存-->
                <label-button label="异常原因："
                              v-if="form.status==='0_8'"
                              :buttons="unusualList"
                              @select="change_unusual"></label-button>
                <!--需人工审核-->
                <div v-if="form.status==='0_256'" class="mb-mini">
                    <label class="line">筛选手工订单：</label>
                    <el-select
                        class="inline width-lg"
                        v-sf.fil_handle
                        clearable
                        v-model="form.fil_handle">
                        <el-option
                            :key="item.value"
                            v-for="item in filList"
                            :value="item.value"
                            :label="item.label"
                        ></el-option>
                    </el-select>
                    <!--需人工审核原因-->
                    <label-item class="line ml-sm" label="需人工审核原因：">
                        <el-select class="inline s-width-mini"
                                   @change="change_type"
                                   v-model="form.reason"
                                   v-sf.reviewType clearable>
                            <el-option
                                v-for="item in searchTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select class="inline width-lg"
                                   clearable v-sf.reviewType
                                   v-model="form.reviewType"
                                   v-if="form.reason === 0">
                            <el-option
                                :key="item.code"
                                v-for="item in causeList"
                                :value="item.code"
                                :label="item.remark"
                            ></el-option>
                        </el-select>
                        <el-input @keyup.native.enter="search"
                                  v-model="form.reason_for_audit"
                                  v-else @keydown="search"
                                  placeholder="可模糊搜索"></el-input>

                    </label-item>
                </div>
                <div class="mb-mini">
                    <el-select class="inline s-width-default"
                               v-sf.snType
                               v-model="form.snType">
                        <el-option v-for="item in searchWayOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                    <order-input v-model="form.snText"
                                 class="inline width-super"
                                 v-sf.snText
                                 @keydown="keydown"
                                 placeholder="可批量搜索，Shift+回车换行..."></order-input>
                    <label-item class="ml-sm" label="平台：">
                        <super-select
                            storageKey="order_channel"
                            class="inline s-width-default"
                            v-sf.channel_id
                            v-model="form.channel_id"
                            @change="change_channel"
                            :is-paging="true"
                            :options='channelList'
                        ></super-select>
                        <!--<el-select class="inline s-width-default"-->
                                   <!--v-sf.channel_id-->
                                   <!--v-model="form.channel_id"-->
                                   <!--@change="change_channel"-->
                                   <!--filterable clearable>-->
                            <!--<el-option-->
                                <!--:key="item.value"-->
                                <!--v-for="item in channelList"-->
                                <!--:value="item.value"-->
                                <!--:label="item.label"-->
                            <!--&gt;</el-option>-->
                        <!--</el-select>-->
                    </label-item>
                    <label class="inline ml-sm">站点：</label>
                    <super-select
                        storageKey="order_site"
                        class="inline s-width-default"
                        v-model="form.site"
                        v-sf.site
                        @change="change_site"
                        :disabled="siteList.length<=1"
                        :placeholder="sitePlaceholder"
                        :is-paging="true"
                        :options='siteList'
                    ></super-select>
                    <!--<el-select class="inline s-width-default"-->
                               <!--v-model="form.site"-->
                               <!--v-sf.site-->
                               <!--@change="change_site"-->
                               <!--:disabled="siteList.length<=1"-->
                               <!--:placeholder="sitePlaceholder"-->
                               <!--filterable clearable>-->
                        <!--<el-option-->
                            <!--:key="item.value"-->
                            <!--v-for="item in siteList"-->
                            <!--:value="item.value"-->
                            <!--:label="item.label"-->
                        <!--&gt;</el-option>-->
                    <!--</el-select>-->
                </div>
                <div  v-if="form.status==='0_256'" class="mb-mini inline">
                    <label class="inline">审核规则：</label>
                    <el-select class="inline width-lg"
                               v-sf.rule_id
                               v-model="form.rule_id"
                               @change="change_rule"
                               :placeholder="rulePlaceholder"
                               :disabled="checkList.length<=1"
                               filterable clearable>
                        <el-option
                            v-for="item in checkList"
                            :value="item.id"
                            :label="item.title"
                            :key="item.id"
                        ></el-option>
                    </el-select>
                </div>
                 <el-select v-model="form.snUser"
                           @change="changeSnUser"
                           class="inline s-width-small"
                           v-sf.snUser>
                    <el-option
                        v-for="res in selectSnUser"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                    ></el-option>
                </el-select>
                <super-select
                    storageKey="order_staffs"
                    v-if="form.snUser==='seller_id'"
                    class="inline s-width-default"
                    v-model="form.snName"
                    v-sf.snName
                    :placeholder="'可输入搜索'"
                    :is-paging="true"
                    :adjustStructure="sale_fix_result"
                    :remoteRequestHttp="remoteRequestHttp"
                ></super-select>
                <!--<param-account-->
                        <!--v-if="form.snUser==='seller_id'"-->
                        <!--class="inline s-width-default"-->
                        <!--ref="paramSale"-->
                        <!--placeholder="可输入搜索"-->
                        <!--v-model="form.snName"-->
                        <!--v-sf.snName-->
                        <!--:param="{type:'sales',data:{content:''}}"-->
                        <!--:fixUrl="true"-->
                        <!--:fixResult="sale_fix_result"-->
                        <!--type="memberShipSales"-->
                        <!--url="get|user/:type/staffs">-->
                <!--</param-account>-->
                <el-select v-sf.snName
                           v-if="form.snUser==='customer_id'"
                           class='inline s-width-default'
                           v-model="form.snName"
                           :placeholder="customerPlaceholder"
                            remote
                           filterable
                           clearable>
                    <el-option v-for="item in serviceList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
                <label-item label="账号简称：" class="ml-sm">
                    <el-select v-model="form.account_type" v-sf.account_type
                               @change="change_search_type"
                               class="inline s-width-mini"
                               :disabled="accountList.length<=1"
                               default-first-option>
                        <el-option
                            v-for="res in searchTypeLists"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                        ></el-option>
                    </el-select>
                    <!--<el-select   v-model="form.account_id" v-sf.account_id-->
                    <!--v-if="form.account_type === 1"-->
                    <!--:disabled="accountList.length<=1"-->
                    <!--:placeholder="accountPlaceholder"-->
                    <!--class="s-width-large ml-mini" clearable filterable>-->
                    <!--<el-option-->
                    <!--v-for="res in accountList"-->
                    <!--:label="res.label"-->
                    <!--:value="res.value"-->
                    <!--:key="res.value"-->
                    <!--&gt;</el-option>-->
                    <!--</el-select>-->
                    <super-select   v-model="form.account_id" v-sf.account_id
                                    v-if="form.account_type === 1"
                                    :disabled="accountList.length<=1"
                                    class="s-width-large ml-mini"
                                    :placeholder="accountPlaceholder"
                                    :options="accountList"
                                    storageKey="memberShipAccountSelect">
                    </super-select>
                    <order-input v-model="form.account_code"
                                 v-if="form.account_type === 2&&form.channel_id !== ''"
                                 @keydown="search"
                                 class="inline s-width-large ml-mini"
                                 placeholder="空格分隔可批量搜索"></order-input>
                    <el-input disabled class="inline s-width-large ml-mini" v-if="form.account_type === 2&&form.channel_id === ''" placeholder="请先选择平台"></el-input>
                </label-item>
                <!--<label class="inline ml-sm">账号简称：</label>-->
                <!--<el-select  class="inline input-no-margin self-width"-->
                <!--v-model="form.account_id"-->
                <!--multiple-->
                <!--v-sf.account_id-->
                <!--@remove-tag="remove_tag"-->
                <!--@change="change_account"-->
                <!--:disabled="accountList.length<=1"-->
                <!--:placeholder="accountPlaceholder"-->
                <!--filterable clearable>-->
                <!--<el-option-->
                <!--:key="item.value"-->
                <!--v-for="item in accountList"-->
                <!--:disabled="item.disabled"-->
                <!--:value="item.value"-->
                <!--:label="item.label"-->
                <!--&gt;</el-option>-->
                <!--</el-select>-->
            </search-card>
            <div class="card left-main">
                <div class="mt-sm mb-sm">
                    <permission
                        class="ml-sm"
                        tag="request-button"
                        :route="apis.url_pending"
                        :mintime="30000"
                        v-if="form.status ==='0_1'||form.status ==='0_0'||form.status ==='0_2'||form.status ==='0_4'||form.status ==='0_8'||form.status ==='0_16'||form.status ==='0_512'"
                        req-key="apis_url_pending"
                        @click="recheck"
                    >重新核查
                    </permission>
                    <!--需人工审核-->
                    <trends-select v-if="form.status === '0_256'"
                                   class="inline ml-sm btn-trends-select-relative"
                                   :selects="filterMarkList"
                                   type="primary"
                                   @trigger="mark_handle"></trends-select>
                    <!--过期-->
                    <permission
                        class="ml-sm inline"
                        tag="request-button"
                        :route="apis.url_preferred"
                        req-key="apis_url_preferred"
                        v-if="form.status === '0_128'"
                        @click="marker_priority"
                    >标记为优先
                    </permission>
                    <!--留言待处理   同时有重新核查/标记为已读-->
                    <permission
                        class="ml-sm inline"
                        v-if="form.status ==='0_1'"
                        req-key="apis_url_get_already"
                        tag="request-button"
                        :route="apis.url_get_already"
                        @click="marker_read">标记为已读
                    </permission>
                    <permission tag="trendsSelect"
                                class="inline ml-sm btn-trends-select-relative"
                                type="primary"
                                :route="apis.url_orders_audit_export"
                                :selects="partAllOptions"
                                @trigger="export_sku">
                    </permission>
                    <!--修改部分-->
                    <trends-select class="inline ml-sm btn-trends-select-relative"
                                   :selects="filterHandles"
                                   type="primary"
                                   @trigger="mark_handle">
                    </trends-select>

                    <permission tag="ElButton"
                                class="inline ml-sm btn-trends-select-relative"
                                :route="apis.url_orders_batch_send_messag"
                                size="mini"
                                type="primary"
                                @click="batch_contact_the_buyer">批量联系买家
                    </permission>
                    <div class="fr mt-sm">
                        <label class="color-lump issue"></label> :
                        <span>已处理</span>
                    </div>
                </div>
                <el-table
                    ref="dataTable"
                    v-resize="{height:38}"
                    class="scroll-bar"
                    :data="tables.lists"
                    highlight-current-row
                    :row-class-name="rowClass"
                    @selection-change="select_items"
                    @row-click="row_click"
                    v-loading="isLoading"
                    element-loading-text="玩命加载中..."
                    @sort-change="sort_change"
                >
                    <el-table-column
                        align="center"
                        type="selection"
                        width="30px">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        inline-template
                        label="订单号"
                        row-key="order_number"
                        show-overflow-tooltip
                    >
                        <div>
                            <ui-tip :content="row.order_number" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                        inline-template
                        align="center"
                        label="买家ID"
                        show-overflow-tooltip
                    >
                        <div>
                            <ui-tip :content="row.buyer" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                        sortable
                        align="center"
                        width="85px"
                        label="目的地"
                        inline-template
                        show-overflow-tooltip
                    >
                        <div>
                            <ui-tip :content="row.country_cn_name" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                        sortable
                        width="90px"
                        align="center"
                        inline-template
                        label="支付总额"
                        show-overflow-tooltip>
                        <div>{{row.currency_code}} {{row.pay_fee|filterPrice}}</div>
                    </el-table-column>
                    <el-table-column
                        width="84px"
                        sortable
                        align="center"
                        label="付款时间" inline-template>
                        <div>
                            <times v-if="row.pay_time" :time="row.pay_time"></times>
                            <span v-else>未付款</span>
                        </div>
                    </el-table-column>
                    <el-table-column
                        width="145px"
                        inline-template
                        align="center"
                        sortable
                        label="最迟发货时间">
                        <div>
                            <time-out :time="row.uploaded_deadline"
                                      :cur-status="row.shipping_status"></time-out>
                        </div>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-box">
                <el-pagination
                    class="fixed-right"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="tables.page"
                    :page-sizes="[20, 50, 100, 200,500]"
                    :page-size="tables.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tables.count">
                </el-pagination>
            </div>
        </div>
        <div class="right-box mr-sm mt-xs">
            <form-mdf
                ref="formMdf"
                :select-row="selectRow"
                v-loading="detailLoading"
                :forms="forms"
                @cur-operate="cur_operate"
                @change-status="change_status_"
                @get-already="mdf_get_already"
                @init-require="init_require"
                @click-number="click_number"
                @product-edit="product_edit"
                @buyinfo-edit="buyinfo_edit"
                @logistics-edit="logistics_edit"
            ></form-mdf>
        </div>
        <parcel-information
            v-model="informationVisble"
            :order="orderData"
            @view-order="view_order"
        ></parcel-information>
        <export-field :param="export_model_type" v-model="exportVisable" :fields="fields" :templates="templates"
                      @getTemplate="get_templates" title="请选择自定义导出字段" :creat-excel="creat_excel"></export-field>
        <export-dialog v-model="export_visible"></export-dialog>
        <batch-remark v-model="remarkDialog" :title="remarkTitle" @submit="submit_remark" :action="batch_action" :show-required="true"></batch-remark>
        <batch-change-warehouse v-model="changeWarehouseDialog" :title="title" @submit="submit_change_warehouse"></batch-change-warehouse>
        <update-shipping
            v-model="resultShow"
            :form="shippingData"
            :ids="ids"
            @update-submit="update_shipping"
            :warehouse-list="warehouseList"></update-shipping>
        <contact-buyer v-model="contactTheBuyerDialog" :channel_id="channelID" :mdfid="orderID" :excute="'batch_contact'"></contact-buyer>
    </page>
</template>
<style lang="stylus">
    .index-pending-orders-audit {
        .el-card {
            overflow: visible;
        }
        .self-width .el-select__tags{
            height: 30px!important;
            width: 208px
            overflow-y: auto;
            >span{
                white-space: inherit;
            }
        }
        .el-select__tags::-webkit-scrollbar    //滚动条整体部分样式

        {
            width: 2px;
            height:auto

        }
        .input-no-margin {
            .el-select__input {
                width: 196px !important;
                margin-left: 4px !important;
            }
        }
        .p-search {
            position: relative;
            height: 100%;
            .el-card {
                overflow: visible;
            }
        }
        .btn-trends-select-relative {
            top: -2px;
            left: -1px;
        }
        /*修改部分*/
        .btn-trends-select-active {
            top: -2px;
            left: -20px;
        }
        .el-dropdown .el-button-group {
            display: block;
            position: relative;
            top: 1px;
        }
        .el-table tr.current-row {
            background-color: rgba(173, 227, 255, .7);
        }
        .left-main {
            position: relative;
        }
        .left-main-empty {
            text-align: center;
            position: absolute;
            top: 25%;
            left: 50%;
            margin-left: -42px;
        }
        .mes-box {
            position: relative;
            margin: 5px 10px 5px;
            padding: 5px 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            > .close {
                position: absolute;
                top: -2px;
                right: 2px;
                width: 12px;
                height: 12px;
                display: inline-block;
                background: url(../../../../static/close.png) no-repeat;
                &:hover {
                    background: url(../../../../static/close-hover.png) no-repeat;
                }
            }
            > .text-icon {
                position: absolute;
                top: -2px;
                left: 2px;
                width: 12px;
                height: 12px;
                display: inline-block;
                background: url(../../../assets/text.png) no-repeat;
            }
        }
        .invalid-color {
            background-color: #DF5255;
        }
        .red-color {
            background-color: #FBD2C9;
        }
        .green-color {
            background-color: #E0F7E6;
        }
        .blue-color {
            background-color: #C6DDF4;
        }
        .close-button {
            float: right;
            line-height: 24px;
        }
        .remark-sale-look {
            overflow-y: hidden;
            width: 190px;
            height: 140px;
            position: absolute;
            top: 67px;
            right: 9px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background: #fff;
            padding: 0 5px;
            z-index: 999;
            .remark-sale-header {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 25px;
                padding-left: 10px;
                padding-top: 5px;
                background-color: #fff;
            }

            .remark-sale-body {
                overflow-y: auto;
                position: absolute;
                top: 30px;
                left: 0;
                right: 0;
                bottom: 30px;
                padding: 0 5px;
            }
            .remark-sale-footer {
                position: absolute;
                height: 25px;
                left: 0;
                right: 0;
                bottom: 0;
                padding-bottom: 5px;
                padding-right: 5px;
                background-color: #fff;
            }
        }
        .detail-header {
            background-color: #6495ED;
            color: #fff;
            line-height: 24px;
            font-size: 18px;
            padding-left: 20px;
            padding-right: 20px;
        }
        .left-box {
            position: absolute;
            top: 0;
            left: 0;
            width: 50%;
            bottom: 0;
            overflow-y: hidden;
        }
        .pagination-box {
            width: 100%;
            background: #fff;
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 1000;
            .fixed-right {
                float: right;
            }
        }
        .right-box {
            position: absolute;
            top: 0;
            left: 50%;
            right: 0;
            bottom: 0;
            overflow-x: auto;
        }
        .fixed-left {
            width: 100%;
            padding-bottom: 3px;
            position: fixed;
            bottom: 30px;
            left: 199px;
            background: #fff;
            z-index: 999;
        }
        .card-x {
            margin: 5px 10px;
        }
        .simulate {
            box-sizing: border-box;
            display: inline-block;
            color: #fff;
            width: 100%;
            height: 41px;
            padding: 0 5px;
            line-height: 41px;
            font-size: 1.25rem;
            background: #008BCE;
            border: 1px solid #008BCE;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            border-bottom: 1px solid transparent;
        }
        .marker {
            font-size: 1.3rem;
            font-weight: bold
        }
        .error-border {
            padding-top: 10px;
            border-top: 1px dotted #c0ccda;
        }
        .small-button {
            font-size: 1.1rem;
            border-radius: 2px;
            padding: 2px 4px;
        }
        .submit {
            color: #fff;
            background: #008BCE;
            border: 1px solid #008BCE;
            &:hover {
                background: #008BCE;
            }
        }
        .cancel {
            background: #fff;
            border: 1px solid #ddd;
            &:hover {
                color: #008BCE;
                border-color: #008BCE
            }
        }
        .label {
            display: inline-block;
            width: 140px;
            text-align: right;
            padding: 3px 5px;
        }
        .detail {
            padding: 3px 5px;
            width: 200px;
        }
        .point {
            cursor: pointer;
        }
        .width-default {
            width: 250px;
        }
        .width-large {
            width: 450px;
        }
        .el-card {
            .el-card__body {
                button.custom-btn {
                    margin-left: 5px !important;
                }
            }
        }
        .is-handel{
            background-color #FFFFDF;
        }
        .color-lump {
            display: inline-block;
            width: 13px;
            height: 13px;
            border: 1px solid #ddd;
        }
        .issue {
            vertical-align: bottom;
            background: #FFFFDF !important;
        }
    }
</style>
<script>
    import {downloadFile} from '../../../lib/http';
    import {http} from '../../../lib/http-plus';
    import {
        api_get,
        api_platform2accout,
        api_pending,
        api_preferred,
        api_audited,
        api_get_status,
        api_get_channel_categories,
        api_account_list,
        api_get_accounts_list,
        api_get_sites,
        api_get_rules,
        api_orders_audit_export,
        api_get_orders_audit_manual_review_status,
        api_orders_audit_mark_link_status,
        url_audited,
        url_preferred,
        url_pending,
        url_orders_audit_export,
        url_orders_audit_mark_link_status
    } from '../../../api/order-pending';
    import {
        api_get_speed,
        api_status_operation,
        api_get_already,
        api_change_status,
        api_batch_invalid,
        url_batch_invalid,
        api_update,
        api_delete_note,
        api_get_sku_siblings,
        api_orders_batch_change_warehouse,
        api_update_shipping,
        url_get_already, url_update, url_change_status,
        url_orders_batch_change_warehouse,
        url_update_shipping,
        api_orders_export_title,
        api_info
    } from '../../../api/order-local';
    import {api_get_member} from '../../../api/performance-service'
    import {api_goods_export_template} from "../../../api/product-library";
    import {api_get_warehouse, api_get_shipping} from '../../../api/common';
    import {url_orders_batch_send_messag} from '@/api/smt-mail'

    const markOptions = [
        {label:'标记为已审核',value:0,api:url_audited,action(){this.mark_check()}},
        {label:'标记为联系退款',value:2,api:url_orders_audit_mark_link_status,action(row){this.mark_contact_refund_buyer(row)}},
        {label:'标记为联系买家',value:1,api:url_orders_audit_mark_link_status,action(row){this.mark_contact_refund_buyer(row)}}
    ];
    const batchHandles = [
        {name: "批量作废订单", value: 0,api:url_batch_invalid,action(){this.batch_invalid()}},
        {name: "批量修改仓库", value: 1,api:url_orders_batch_change_warehouse,action(){this.batch_modification()}},
        {name: "更改运输方式", value: 2,api:url_update_shipping,action(){this.shipping_show()}},
    ];
    export default {
        permission: {
            url_audited,
            url_preferred,
            url_pending,
            url_get_already,
            url_update,
            url_change_status,
            url_orders_audit_export,
            url_orders_audit_mark_link_status,
            url_batch_invalid,
            url_orders_batch_change_warehouse,
            url_update_shipping,
            url_orders_batch_send_messag
        },
        page: {},
        refresh() {
            this.init();
        },
        data() {
            return {
                form: {
                    snUser:'seller_id',
                    snName:'',
                    status: "",
                    rule_id: "",
                    fil_handle: "",
                    reviewType:'',
                    channel_id: 0,
                    site: "",
                    account_type: 1,
                    account_id: '',
                    account_code: '',
                    abnormal: "",
                    batchText: "",
                    snType: 'order_number',
                    snText:'',
                    reason_for_audit:'',
                    reason:0,
                },
                clears: {
                    snUser:'seller_id',
                    snName:'',
                    status: "",
                    rule_id: "",
                    fil_handle: "",
                    reviewType:'',
                    channel_id: 0,
                    site: "",
                    account_type: 1,
                    account_id: '',
                    account_code: '',
                    abnormal: "",
                    batchText: "",
                    snType: 'order_number',
                    snText:'',
                    reason_for_audit:'',
                    reason: 0,
                },
                serviceList:[],
                ids: [],
                exportRequest: {},
                isBatch: false,
                contactTheBuyerDialog:false,
                channelID:'',
                orderID:[],
                is_batch: '',
                notes: "",
                /*作废/需人工审核状态下出现的备注框 判断*/
                isAdd: false,
                check: false,
                isLoading: false,
                mdf: 0,
                channelList: [],
                siteList: [{label: "", value: ""}],
                accountList: [{label: "", value: ""}],
                buttons: [],
                shippingList: [],
                searchTypeList:[
                    {label:'选择',value: 0},
                    {label:'文本',value: 1},
                ],
                searchTypeLists:[
                    {label:'选择',value: 1},
                    {label:'文本',value: 2},
                ],
                selectSnUser:[
                    {label:'销售员',value:'seller_id'},
                    {label:'客服',value:'customer_id'}
                ],
                searchWayOptions: [
                    {label: '订单号', value: 'order_number'},
                    {label: '买家ID', value: 'buyer_id'},
                    {label: '买家名', value: 'buyer'},
                    {label: '付款交易号', value: 'transaction_id'},
                    {label: '邮箱', value: 'email'},
                    {label: '系统SKU', value: 'order_sku'},
                    {label: '平台sku', value: 'channel_sku'},
                    {label: '跟踪号', value: 'tracking'},
                    {label: '目的地', value: 'target'},
                    {label: '平台订单号', value: 'channel_order_number'},
                ],
                partAllOptions: [
                    {name: "部分导出", value: 0},
                    {name: "全部导出", value: 1},
                ],
                searchWayOptions2: [
                    {label: "订单号", value: "order_num"},
                    {label: "买家ID", value: "buyer_id"},
                    {label: "追踪号", value: "tracking"},
                    {label: "平台SKU", value: "channel_sku"},
                ],
                unusualList: [
                    {label: "全部", value: ""},
                    {label: "无法分配仓库", value: 0},
                    {label: "仓库退回", value: 1},
                ],
                abnormal: "",
                check_id: "",
                checkList: [],
                filList: [
                    {label: "全部", value: ""},
                    {label: "手工订单", value: 1},
                    {label: "其他", value: 0},
                ],
                tables: {
                    lists: [],
                    page: 1,
                    pageSize: 50,
                    count: 0,
                },
                forms: {},
                selectedItems: [],
                selectRow: 0,
                aftermarket: {},
                showRemark: false,
                steps: [],
                active: 0,
                handleTitle: "请选择",
                processStatus: [],
                note: "",
                showAfter: false,
                sort_field: "",
                sort_type: "",
                nextHandleValue: "",
                formData: [],
                order_id: '',
                isRed: false,
                fields: [],
                templates: [],
                export_type: '',
                export_model_type: {
                    type: 4
                },
                export_visible: false,
                exportVisable:false,
                informationVisble:false,
                orderData:{},
                detailLoading:false,
                remarkDialog:false,
                changeWarehouseDialog:false,
                resultShow:false,
                remarkTitle:'',
                title:'',
                batch_action:'',
                shippingData: {
                    warehouse_id: '',
                    shipping_id: ''
                },
                warehouseList:[],
                accoutSiteList:{},
            }
        },
        filters: {
            filterPrice(val) {
                return parseFloat(val).toFixed(2);
            },

        },
        mounted() {
            this.get_cause_list();
            this.status_remote();
            this.get_channel();
//            需人工审核 固定数字 3；
            this.api_get_rule();
            this.date = new Date();
            this.$nextTick(() => {
                this.init();
            });
            this.exportRequest = {
                url: `${config.apiHost}orders-audit/export`,
                get: {ids: this.ids},
                name: "过期商品"
            };
            this.get_fields();
            this.get_templates();
        },
        watch: {
            'form.channel_id'(val) {
                this.form.site = '';
                this.form.account_id = '';
                this.form.snName = "";
                this.form.rule_id = "";
                this.accountList = [{label: "", value: ""}];
                this.siteList = [{label: "", value: ""}];
                this.checkList = [{title: "", id: ""}];
                this.serviceList=[];
                this.channel_service();
                this.get_account(val, this.form.site);
                this.api_get_rule();
            },
            'form.site'(val) {
                this.form.account_id = '';
                this.accountList=[{label:"",value:""}];
                this.get_account(this.form.channel_id, val);
            },
            selectRow(val) {
                if (val) {
                    this.require_server(val);
                }
            },
            forms(val) {
                if (val[this.selectRow]) {
                    this.check = val[this.selectRow].is_already ? true : false;
                }
            },
            productList(val) {
                if (val.length > 0) {
                    if (val.find(row => {
                        return row.detail_goods.length > 0
                    })) {
                        this.showAfter = true;
                    } else {
                        this.showAfter = false;
                    }
                }
            },
            param(val) {
                let index = this.def_button(this.buttons);
                this.$refs.questbuttons.buttonClick(index, this.buttons[index]);
            },
        },
        computed: {
            filterMarkList(){
                return markOptions.filter(row=>{
                    return this.$hasPermission(row.api)
                })
            },
            filterHandles(){
                return batchHandles.filter(row=>{
                    return this.$hasPermission(row.api)
                })
            },
            choiceChannel(){
                return !(this.form.channel_id<=0)
            },
            customerPlaceholder(){
                if(this.form.channel_id<=0){
                    return "请先选择平台";
                }else if(this.serviceList.length<=0){
                    return "该平台下暂无站点";
                }else{
                    return "可输入搜索"
                }
            },
            sitePlaceholder() {
                if (this.form.channel_id <= 0) {
                    return "请先选择平台";
                } else if (this.siteList.length <= 1) {
                    return "该平台下暂无站点";
                } else {
                    return "请选择站点"
                }
            },
            rulePlaceholder(){
                if (this.form.channel_id <= 0) {
                    return "请先选择平台";
                } else if (this.checkList.length <= 1) {
                    return "该平台下暂无站点";
                } else {
                    return "请选择审核规则"
                }
            },
            accountPlaceholder() {
                if ((this.form.site <= 1 && this.accountList.length > 1) || this.form.site > 1) {
                    return "请选择账号简称";
                } else if (this.form.site <= 1) {
                    return "请先选择站点";
                } else if (this.accountList.length <= 1) {
                    return "该站点下暂无账号简称";
                }
            },
            /*作废*/
            invalid: {
                get() {
                    let curObj = {};
                    if (this.selectRow > 0) {
                        if (this.forms[this.selectRow > 0]) {
                            this.$set(curObj, 'status', this.forms[this.selectRow > 0].status);
                            this.$set(curObj, 'reason_for_invalid', this.forms[this.selectRow > 0].reason_for_invalid);
                            this.$set(curObj, 'time_for_invalid', this.forms[this.selectRow > 0].time_for_invalid);
                        }
                    }
                    return curObj;
                }
            },
            seller() {
                let defName = "";
                if (this.selectRow > 0) {
                    if (this.forms[this.selectRow]) {
                        let cur = this.forms[this.selectRow];
                        return cur.seller;
                    } else {
                        return defName;
                    }
                } else {
                    return defName;
                }
            },
            order_number() {
                let def = "";
                if (this.selectRow > 0) {
                    if (this.forms[this.selectRow]) {
                        let cur = this.forms[this.selectRow];
                        return cur.order_number;
                    } else {
                        return def;
                    }
                } else {
                    return def;
                }
            },
            salesRemark() {
                let def = "";
                if (this.selectRow > 0) {
                    if (this.forms[this.selectRow]) {
                        def = this.forms[this.selectRow].sales_remark;
                    }
                }
                return def;
            },
            channel_name() {
                let def = "";
                if (this.selectRow > 0) {
                    if (this.forms[this.selectRow]) {
                        let cur = this.forms[this.selectRow];
                        return cur.channel_name;
                    } else {
                        return def;
                    }
                } else {
                    return def;
                }
            },
            detailTable() {
                if (this.selectRow > 0) {
                    return !!this.forms[this.selectRow];
                } else {
                    return false;
                }
            },
            logs: {
                get() {
                    let def = [];
                    if (this.selectRow > 0) {
                        if (this.forms[this.selectRow]) {
                            return this.forms[this.selectRow].log;
                        } else {
                            return def
                        }
                    } else {
                        return def
                    }
                }
            },
            base() {
                const def = {
                    channel_id: 0,
                    channel_account_id: 0,
                };
                if (this.selectRow > 0) {
                    if (this.forms[this.selectRow]) {
                        const info = this.forms[this.selectRow];
                        return {
                            channel_id: info.channel_id,
                            channel_account_id: info.channel_account_id,
                        }
                    } else {
                        return def;
                    }
                } else {
                    return def
                }
            },
            buyinfo: {
                get() {
                    let def = {
                        consignee: "",
                        address: "",
                        tel: "",
                        mobile: "",
                        email: "",
                        zipcode: "",
                        province: "",
                        city: "",
                        country_code: "",
                        buyer: "",
                        source_address: {},
                        channel_name: "",
                    };
                    if (this.selectRow > 0) {
                        if (this.forms[this.selectRow]) {
                            this.$set(this.forms[this.selectRow].order_address, "channel_name", this.forms[this.selectRow].channel_name);
                            return this.forms[this.selectRow].order_address
                        } else {
                            return def;
                        }
                    } else {
                        return def
                    }
                }
            },
            customer: {
                get() {
                    let def = {};
                    if (this.selectRow > 0) {
                        if (this.forms[this.selectRow]) {
                            /*获得 售后页面的地址*/
                            def.customer = this.forms[this.selectRow].customer;
                            if (def.customer.address instanceof Array) {
                                def.customer.address = {
                                    recipient: "",
                                    address: "",
                                    city: "",
                                    province: "",
                                    zip_code: "",
                                    country_code: "",
                                    tel: "",
                                }
                            }
                            def.order_number = this.forms[this.selectRow].order_number;
                            def.id = this.forms[this.selectRow].id;
                            return def;
                        } else {
                            return def;
                        }
                    } else {
                        return def;
                    }
                },
                set(val) {
                    console.log(val);
                }
            },
            edit() {
                let cur = true;
                if (this.selectRow > 0) {
                    if (this.forms[this.selectRow]) {
                        if (this.forms[this.selectRow].customer) {
                            let d = this.forms[this.selectRow].customer;
                            if (d.after.length > 0) {
                                return false
                            } else {
                                return cur
                            }
                        } else {
                            return cur
                        }
                    } else {
                        return cur
                    }
                } else {
                    return cur
                }
            },
            comNotes() {
                let def = [];
                if (this.selectRow > 0) {
                    if (this.forms[this.selectRow]) {
                        let cur = this.forms[this.selectRow];
                        return cur.note;
                    } else {
                        return def
                    }
                } else {
                    return def
                }
            },
            message() {
                let def = "";
                if (this.selectRow > 0) {
                    if (this.forms[this.selectRow]) {
                        let cur = this.forms[this.selectRow];
                        return cur.message.replace(/(\r|\n)+/gm,`<br>`);
                    } else {
                        return def
                    }
                } else {
                    return def
                }
            },
            errorList: {
                get() {
                    let def = [];
                    if (this.selectRow > 0) {
                        if (this.forms[this.selectRow]) {
                            return this.forms[this.selectRow].error;
                        } else {
                            return def
                        }
                    } else {
                        return def
                    }
                }
            },
            productList: {
                get() {
                    let def = [];
                    if (this.selectRow > 0) {
                        if (this.forms[this.selectRow]) {
                            return this.forms[this.selectRow].product_list;
                        } else {
                            return def
                        }
                    } else {
                        return def
                    }
                }
            },
            logistics: {
                get() {
                    let def = [];
                    if (this.selectRow > 0) {
                        if (this.forms[this.selectRow]) {
                            def = this.forms[this.selectRow].package_list;
                            def.forEach((data) => {
                                data.prior = !!data.prior;
                                this.$set(data, 'buyer_selected_logistics', this.forms[this.selectRow].buyer_selected_logistics);
                                this.$set(data, 'country_code', this.forms[this.selectRow].order_address.country_code);//获取运输方式需要
                            })
                            return def
                        } else {
                            return def;
                        }
                    } else {
                        return def
                    }
                },
                set(value) {
                    console.log(value)
                }
            },
            payment: {
                get() {
                    let def = [];
                    if (this.selectRow > 0) {
                        if (this.forms[this.selectRow]) {
                            return this.forms[this.selectRow].payment;
                        } else {
                            return def;
                        }
                    } else {
                        return def;
                    }
                }
            },
            profit() {
                let def = {};
                if (this.selectRow > 0) {
                    if (this.forms[this.selectRow]) {
                        let cur = this.forms[this.selectRow];
                        return {
                            income: cur.profit.income,
                            expend: cur.profit.expend,
                            rate: cur.rate,
                            rate_remark: cur.rate_remark
                        };
                    } else {
                        return def;
                    }
                } else {
                    return def;
                }
            },
        },
        methods: {
            change_type(val){
                if(val === 0){
                    this.form.reviewType = ''
                }else  {
                    this.form.reason_for_audit = ''
                }
            },
            change_search_type(){
                this.form.account_id = '';
                this.form.account_code = '';
            },
            search() {
                this.$emit("search",this.form);
                // this.$emit("search");
                this.init();
            },
            batch_invalid() {
                if (this.ids.length === 0) {
                    this.$reqKey('url_batch_remark', false);
                    return this.$message({type: "warning", message: "请先勾选需要批量备注的订单"});
                }
                this.remarkTitle = '批量作废订单';
                this.batch_action = 'reason';
                this.remarkDialog = true;
            },
            batch_modification(){
                if (this.ids.length <= 0) {
                    return this.$message({type: "warning", message: "请先勾选需要批量备注的订单"});
                }
                this.title = '批量修改仓库';
                this.changeWarehouseDialog = true;
            },
            changeSnUser() {
                this.form.snName='';
            },
            /*客服*/
            channel_service(){
                this.$http(api_get_member,{channel_id:this.form.channel_id}).then(res=>{
                    if (!!res.length){
                        this.serviceList = res.map(row=>{
                            return{
                                value:row.customer_id,
                                label:row.realname
                            }
                        });
                    }
                }).catch(code => {
                    console.log(code)
                })
            },
            remove_tag(item) {
                let index = this.form.account_id.findIndex(row => row === item.value);
                if (index >= 0) {
                    this.form.account_id.splice(index, 1);
                }
            },
            shipping_show() {
                if (this.ids.length <= 0) {
                    this.$reqKey('api_warehouse_remote', false);
                    return this.$message({type: "warning", message: "请先勾选需要更改运输方式的订单"});
                }
                this.resultShow = true;
                this.shippingData.warehouse_id = '';
                this.shippingData.shipping_id = '';
                this.warehouse_remote();
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
            },
            get_cause_list(){
                this.$http(api_get_orders_audit_manual_review_status).then(res=>{
                    this.causeList = res;
                }).catch(code=>{
                    console.log(code);
                })
            },
            click_number(val){
                this.orderData = val.orderData;
                this.informationVisble = val.informationVisble;
            },
            view_order(val){
                this.informationVisble = false;
            },
            remoteRequestHttp(){
                return http("get|user/sales/staffs",{content:''})
            },
            sale_fix_result(res){
                let data=res.map(row => {
                    return {
                        label: row.realname,
                        value: row.id,
                    }
                });
                return {
                    count:data.length,
                    data:data
                }
            },
            get_fields() {
                this.$http(api_orders_export_title).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            get_templates() {
                this.$http(api_goods_export_template, {type: 4}).then(res => {
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
            split_search(data){
                let curString = data.replace(new RegExp(' ','gm'),'\n');
                let cur = curString.split('\n').filter(row=>!!row);
                return cur
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
                            status:this.form.status,
                        };
                        Object.assign(data,this.init_params());
                        return this.order_export(data, {
                            'X-Result-Fields': fields,
                            contentType: 'application/x-www-form-urlencoded'
                        });
                        break;
                    case 1://全部
                        data = this.init_params();
                        data.export_type = this.export_type;
                        data.status = this.form.status;
                        data.error_type = 1;
                        return this.order_export(data, {
                            'X-Result-Fields': fields,
                            contentType: 'application/x-www-form-urlencoded'
                        });
                        break;
                }
            },
            init_params() {
                let params = {
                    page: this.tables.page,
                    pageSize: this.tables.pageSize,
                    status: this.form.status,
                    snUser:this.form.snUser,
                };
                if (this.form.status === '0_256') {
                    params.rule_id = this.form.rule_id;
                    params.type = this.form.fil_handle;
                    params.reviewType = this.form.reviewType;
                    params.reason_for_audit = this.form.reason_for_audit;
                    params.reason = this.form.reason;
                }
                if (this.form.status === '0_8') {
                    params.abnormal = this.form.abnormal;
                }
                if (this.form.account_code) {
                    let splitCode = this.split_search(this.form.account_code);
                    params.account_id = splitCode && splitCode.length ? splitCode.map(row => row.trim()) : '';
                }
                this.form.account_type && (params.account_type = this.form.account_type);
                this.form.account_id && (params.account_id = this.form.account_id);
                this.form.snName && (params.snName = this.form.snName);
                this.sort_field && (params.sort_field = this.sort_field);
                this.sort_type && (params.sort_type = this.sort_type);
                this.form.site && (params.site_code = this.form.site);
                this.form.channel_id && (params.channel_id = this.form.channel_id);
                let cur = this.form.snText.split('\n').map(row=>row.trim()).filter(row => !!row);
                if (cur && cur.length > 1) {
                    params.snText = cur.map(row => {
                        return row.trim();
                    });
                } else if (cur && cur.length === 1) {
                    params.snText = cur[0];
                }
                if (this.form.snType && this.form.snText) {
                    params.snType = this.form.snType;
                }
                return params
            },
            order_export(params,head) {
                return this.$http(api_orders_audit_export, params, head).then(res => {
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
                })
                return Promise.resolve()
            },
            open_search() {
                this.isBatch = !this.isBatch;
                if (this.isBatch) {
                    this.is_batch = 1
                } else {
                    this.is_batch = '';
                    this.batchText = "";
                    this.search();
                }
            },
            batch_search() {
                this.init();
            },
            def_button(btns) {
                if (this.param.status) {
                    return btns.indexOfFun(btn => {
                        return btn.value === this.param.status
                    });
                }
                return 0;
            },
//            问题类型   切换按钮
            change_button(index) {
                this.form.status = this.buttons[index].value;
                this.form.rule_id = "";
                this.form.fil_handle = "";
                this.init();
            },
//            异常原因
            change_unusual(index) {
                this.form.abnormal = this.unusualList[index].value;
                this.init();
            },
            already(val) {
                this.get_already()
            },
            actionSearch(val) {
                this.form.snType = val.value;
                this.init();
            },
            keydown() {
                this.init();
            },
            filterTime(val) {
                if (val) return datef("YYYY-MM-dd HH:mm:ss", val);
            },
            /*审核规则*/
            api_get_rule() {
                if (!this.form.channel_id) return this.checkList = [{title: "", id: ""}];
                this.$http(api_get_rules, {source:"order",type: 3, status: 0, channel_id: this.form.channel_id}).then(res => {
                    let cur = res.data;
                    if (cur.length> 0) {
                        this.checkList = [{title: "全部", id: ""}, ...cur];
                    }else{
                        this.checkList = [{title: "全部", id: ""}];
                    }
                }).catch(code => {
                    console.log(code);
                })
            },
            /*平台*/
            get_channel() {
                this.$http(api_get_channel_categories).then(res => {
                    this.channelList = [{label: "全部", value: 0}, ...res];
                }).catch(code => {
                    console.log(code);
                })
            },
            /*获取账号*/
            get_account(channel_id, site_code) {
                if (!channel_id) return this.siteList = [{label: "", value: ""}];this.accountList = [{label: "", value: ""}];
                let data = {
                    channel_id:channel_id
                };
                if (channel_id&&!site_code) {
                    if (this.accoutSiteList[channel_id]) {
                        this.siteList=this.accoutSiteList[channel_id].site;
                        this.accountList=this.accoutSiteList[channel_id].account;
                        return
                    }
                }
                if(!!site_code){
                    data.site_code = site_code;
                    if (this.accoutSiteList[channel_id][site_code]) {
                        this.siteList=this.accoutSiteList[channel_id][site_code].site;
                        this.accountList=this.accoutSiteList[channel_id][site_code].account;
                        return
                    }
                }
                this.$http(api_account_list, data).then(res => {
                    let list={
                        site:[],
                        account:[],
                    };
                    if (res.site.length> 0) {
                        list.site = [{label: "全部", value: ""}, ...res.site];
                    }else{
                        list.site = [{label: "", value: ""}];
                    }
                    if(res.account.length > 0){
                        list.account = [{label: "全部", value: "",disabled:true}, ...res.account];
                    }else{
                        list.account = [{label: "", value: ""}];
                    }
                    if (data.channel_id) {
                        if (data.site_code) {
                            this.accoutSiteList[channel_id][site_code]=list
                        }else{
                            this.accoutSiteList[channel_id]=list;
                        }
                    }
                    this.siteList=list.site;
                    this.accountList=list.account;
                }).catch(code => {
                    console.log(code);
                })
            },
            change_channel(val) {
            },
            change_site(val) {
            },
            change_rule(val){},
            change_account(val) {
            },
            resetChange() {
                this.init();
            },
            clearParams() {
                this.init();
            },
//            -----------------------------------  初始订单列表
            init() {
                let data = this.init_params();
                this.isLoading = true;
                this.$http(api_get, data).then(res => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 100);
                    this.tables.lists = res.data;
                    this.tables.lists.forEach(row=>{
                        this.$set(row,'is_handle',false);
                    });
                    //初始selectRow
                    this.selectRow = res.data.length > 0 ? res.data[0].id : 0;
                    //  获取第一条数据的运输方式
                    setTimeout(() => {
                        this.logistics.forEach(row => {
                            this.init_shipping(row);
                        })
                    }, 300);
                    this.tables.count = res.count;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 200);
                });
            },
            handleSizeChange(size) {
                this.tables.pageSize = size;
                this.init();
            },
            handleCurrentChange(page) {
                this.tables.page = page;
                this.init();
            },
//            -----------------------------------  点击左边出现右边详情
            row_click(row) {
                this.selectRow = row.id;
                /*仓库物流界面  运输方式*/
                setTimeout(() => {
                    this.logistics.forEach(row => {
                        this.init_shipping(row);
                    });
                }, 300);
            },

            rowClass(row) {
                return `${row.id === this.selectRow&&!row.is_handle? 'current-row' : ''} ${row.is_handle ? 'is-handel' : ''}`;
            },
//            -----------------------------------   仓储物流界面  改变发货仓库事件&& 取消事件
            change_warehouse(item) {
                this.init_shipping(item);
            },
            logistics_cancel(item) {
                this.init_shipping(item);
            },
//            -----------------------------------  获取运输方式
            init_shipping(item) {
                if (item.warehouse_id !== 0) {
                    let params = {
                        warehouse_id: item.warehouse_id,
                        country_code: item.country_code,
                        package_id: item.id,
                    };
                    this.$http(api_get_shipping, params).then(res => {
                        this.shippingList = res;
                    }).catch(code => {
                        console.log(code);
                    })
                }
            },
//            -----------------------------------  添加排序
            sort_change(column) {
                if (column.column instanceof Object) {
                    let sort_label = column.column.label;
                    switch (sort_label) {
                        case "目的地":
                            this.sort_field = "country_code";
                            break;
                        case "支付总额":
                            this.sort_field = "pay_fee";
                            break;
                        case "付款时间":
                            this.sort_field = "pay_time";
                            break;
                        case "最迟发货时间":
                            this.sort_field = "uploaded_deadline";
                            break;
                    }
                    this.sort_type = column.order === "descending" ? "desc" : "asc";
                    this.init();
                }
            },
//            -----------------------------------  核查按钮
            recheck() {
                if (this.selectedItems.length <= 0) {
                    this.$reqKey('apis_url_pending', false);
                    this.$message({
                        type: 'warning',
                        message: '请选择需要核审的订单'
                    });
                    return;
                }
                let order_ids = this.selectedItems.map(row => row.id);
                this.$http(api_pending, {order_id: order_ids}).then(res => {
                    this.init();
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    })
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'})
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('apis_url_pending', false);
                    }, 500);
                });
            },
            mark_handle(row){
                row.action.call(this,row);
            },
            // 批量联系买家
            batch_contact_the_buyer(){
                if (this.selectedItems.length <= 0) {
                    this.$message({
                        type: 'warning',
                        message: '请先勾选需要批量操作的数据！'
                    });
                    return;
                }

                let data=[];
                this.selectedItems.forEach(row=>{
                    if (row.channel_id===1||row.channel_id===2||row.channel_id===4) {
                        data.push(row)
                    }
                });
                if(data.length===0||data.length!== this.selectedItems.length){
                    this.$message({
                        type: 'warning',
                        message: '所选平台订单暂不支持！'
                    });
                    return;
                }else{
                    if (data.every(row=>row.channel_id===1)||data.every(row=>row.channel_id===2)||data.every(row=>row.channel_id===4)) {
                        this.channelID=data[0].channel_id;
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
//            标记为已审核
            mark_check() {
                if (this.selectedItems.length <= 0) {
                    this.$message({
                        type: 'warning',
                        message: '请选择需要标记的订单！'
                    });
                    return;
                }
                let order_ids = this.selectedItems.map(row => row.id);
                this.$http(api_audited, {order_id: order_ids}).then(res => {
                    this.init();
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    })
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'})
                })
            },
            mark_contact_refund_buyer(row){
                if (this.selectedItems.length <= 0) {
                    this.$message({
                        type: 'warning',
                        message: '请选择需要标记的订单！'
                    });
                    return;
                }
                if(row.value===1){
                    this.remarkDialog = true;
                    this.batch_action = 'remark';
                    this.remarkTitle = '备注信息:'
                }else {
                    this.mark_submit({
                        order_ids: this.selectedItems.map(row => row.id),
                        link_buyer: row.value
                    });
                }
            },
            mark_submit(data){
                this.$http(api_orders_audit_mark_link_status, data).then(res => {
                    this.init();
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    if(data.link_buyer===1){
                        this.remarkDialog = false;
                    }
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'})
                })
            },
            submit_remark(remark,api,action){
                switch (action) {
                    case 'remark':
                        this.mark_submit({
                            order_ids: this.selectedItems.map(row => row.id),
                            link_buyer: 1,
                            remark
                        });
                        break;
                    case 'reason':
                        this.submit_invalid(remark,action);
                }
            },
            update_shipping(){
                this.ids = [];
                this.init();
            },
            submit_invalid(remark,action){
                let data = {
                    order_ids: this.ids
                };
                data[action] = remark;
                this.$http(api_batch_invalid, data).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.remarkDialog = false;
                    this.init();
                    if(res.data&&res.data.length>0) {
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
//            标记为优先
            marker_priority() {
                if (this.selectedItems.length <= 0) {
                    this.$reqKey('apis_url_preferred', false);
                    this.$message({
                        type: 'warning',
                        message: '请选择需要标记的订单！'
                    });
                    return;
                }
                let order_ids = this.selectedItems.map(row => row.id);
                this.$http(api_preferred, {order_id: order_ids}).then(res => {
                    this.init();
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    })
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'})
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('apis_url_preferred', false);
                    }, 200);
                });
            },
//            标记为已读
            marker_read() {
                if (this.selectedItems.length <= 0) {
                    this.$reqKey('apis_url_get_already', false);
                    this.$message({
                        type: 'warning',
                        message: '请选择所要标记的订单'
                    });
                    return;
                }
                let order_ids = this.selectedItems.map(row => row.id);
                this.$http(api_get_already, {order_id: order_ids}).then(res => {
                    this.init();
                    this.$message(res.message);
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'})
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('apis_url_get_already', false);
                    }, 200);
                });
            },
            download_file() {
                if (this.ids.length <= 0) return this.$message({type: "warning", message: "请选择需要导出的数据"});
                this.exportRequest.get.ids = this.ids;
            },
//            导出到Excel
            create_click(res) {
                this.$set(this.forms[this.selectRow].customer, 'is_generate', 1);
                this.$set(this.forms[this.mdfid].customer, 'open_link', res.open_link);
                this.$set(this.forms[this.mdfid].customer, 'filePath', res.filePath);
            },
            add_aftermarker() {
                this.require_server(this.selectRow);
            },
//            -----------------------------------  过滤时间
            ftime(time) {
                return datef('YYYY-MM-dd HH:mm:ss', time);
            },
            show_remark() {
                this.showRemark = !this.showRemark;
                this.isAdd = false;
            },
            cancel() {
                this.showRemark = false;
            },
            submit() {
                if (!this.notes) return this.$message({message: "请填写备注内容后，再点击提交", type: 'warning'});
                this.$http(api_update, this.selectRow, {note: this.notes}).then(res => {
                    this.$message(res.message);
                    /*添加备注后，需要映射操作时间和操作人，所以要请求一次接口*/
                    this.require_server(this.selectRow);
                    this.notes = "";
                    this.showRemark = false;
                }).catch(code => {
                    this.$message({message: code.message, type: 'error'})
                });
            },
//            删除备注
            delete_note(item) {
                this.$confirm('您将删除此备注信息, 确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_note, this.selectRow, item.id).then(res => {
                        this.$message({message: res.message || res, type: 'success'});
                        this.require_server(this.selectRow);
                    }).catch(code => {
                        this.$message({message: code.message || code, type: 'error'});
                    })
                }).catch(code => {

                    this.$message({
                        type: 'info',
                        message: "已取消删除"
                    })

                })
            },
            /*作废 / 需人工审核的状态下出现的备注框   保存按钮*/
            save_reason(val) {
                if (!val) return this.$message({message: "请添加原因后，再点击提交!", type: 'warning'});
                this.save_reason_(false, val);
            },
            save_reason_(isTrue, val) {
                let params = {};
                params.reason = val;
                if (isTrue) {
                    params.confirm = true;
                }
                this.$http(api_change_status, this.selectRow, this.nextHandleValue, params).then(res => {
                    this.$message(res.message);
                    /*关闭整个弹框*/
                    this.show = false;
                    this.$emit("cur-operate");
                }).catch(code => {
                    if (code.hasOwnProperty("code") && code.code === "confirm") {
                        this.$confirm(`${code.message}`, '提示', {
                            confirmButtonText: '继续',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.save_reason_(true, val);
                        })
                    } else {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        })
                    }
                });
                this.require_server(this.selectRow);
                this.isAdd = false;
            },
            cancel_reason(val) {
                this.isAdd = false;
            },
            select_handle(val) {
                this.selectHandle = val;
            },
//            -----------------------------------  状态列表
            status_operation(val) {
                let cur = {};
                if (!!val) {
                    cur.code = val.status;
                    cur.type = val.type;
                }
                this.$http(api_status_operation, cur).then(res => {
                    this.processStatus = res.map(row => {
                        return {
                            label: row.remark,
                            value: row.code,
                            action: function (val) {
                                this.nextHandleValue = parseInt(val.value);
                                if (this.nextHandleValue === 65792 || this.nextHandleValue === 4294967295) {
                                    this.isAdd = true;
                                    this.showRemark = false;
                                } else {
                                    this.change_status(this.selectRow, this.nextHandleValue);
                                }
                            }
                        }
                    });
                }).catch(code => {
                    console.log(code);
                })
            },
            mdf_get_already(is_handle){
                let find = this.tables.lists.find(row=>row.id===this.selectRow);
                find&&(this.$set(find,'is_handle',is_handle?true:false));
                this.require_server(this.selectRow);
            },
            init_require(is_handle) {
                let find = this.tables.lists.find(row=>row.id===this.selectRow);
                find&&(this.$set(find,'is_handle',is_handle?true:false));
                this.require_server(this.selectRow);
            },
            product_edit(is_handle) {
                let find = this.tables.lists.find(row=>row.id===this.selectRow);
                find&&(this.$set(find,'is_handle',is_handle?true:false));
                this.require_server(this.selectRow);
            },
            buyinfo_edit(is_handle) {
                let find = this.tables.lists.find(row=>row.id===this.selectRow);
                find&&(this.$set(find,'is_handle',is_handle?true:false));
                this.require_server(this.selectRow);
            },
            logistics_edit(is_handle) {
                let find = this.tables.lists.find(row=>row.id===this.selectRow);
                find&&(this.$set(find,'is_handle',is_handle?true:false));
                this.require_server(this.selectRow);
            },
            cur_operate(is_handle) {
                let find = this.tables.lists.find(row=>row.id===this.selectRow);
                find&&(this.$set(find,'is_handle',is_handle?true:false));
                this.require_server(this.selectRow);
            },
            change_status_(is_handle) {
                let find = this.tables.lists.find(row=>row.id===this.selectRow);
                find&&(this.$set(find,'is_handle',is_handle?true:false));
                this.require_server(this.selectRow);
            },
            require_server(val) {
                this.detailLoading = true;
                this.$delete(this.forms, val);
                this.$http(api_info, val).then(res => {
                    res.product_list.forEach(row => {
                        row.detail_goods.forEach(item => {
                            this.get_sku_siblings(item);
                        })
                    });
                    this.$refs.formMdf.status_operation(res);
                    this.$refs.formMdf.formData = res.customer.source;
                    this.$nextTick(() => {
                        this.$set(this.forms, val, res);
                    })
                    this.detailLoading = false;
                }).catch(code => {
                    console.log(code)
                });
                this.$refs.formMdf.get_speed(val);
            },
            get_sku_siblings(row) {
                this.$http(api_get_sku_siblings, row.sku_id).then(res => {
                    res = res.map(item => {
                        return {
                            value: item.id,
                            label: item.attr ? `${item.sku}-[${item.attr}]` : item.sku,
                            attr: item.attr,
                            sku: item.sku
                        }
                    });
                    this.$set(row, 'siblingsList', res);
                })
            },
            review() {
                this.require_server(this.mdfid);
            },
            select_items(items) {
                this.selectedItems = items;
                this.ids = items.map(row => row.id);
            },
            platform2accout_remote() {
                return this.$http(api_platform2accout).then(res => {
                    let ret = res.map(re => {
                        let options = re.account.map(({id, account_name}) => {
                            return {label: account_name, value: id}
                        });
                        return {label: re.channel, options: options}
                    });
                    return Promise.resolve(ret);
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code
                    })
                })
            },
            status_remote() {
                this.$http(api_get_status).then(res => {
                    res = res.map(row => {
                        return {
                            label: row.remark,
                            value: row.code
                        }
                    });
                    this.buttons = [{label: "全部", value: ""}, ...res];
                }).catch(code => {
                    console.log(code);
                })
            },
            change_status(val, val2, data) {
                this.$http(api_change_status, val, val2, data).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.init();
                }).catch(code => {
                    this.$message({message: code.message, type: 'error'})
                })
            },
            get_already() {
                let cur = [];
                cur.push(this.selectRow);
                this.$http(api_get_already, {order_id: cur}).then(res => {
                    this.$message({
                        type: "success",
                        message: res.message
                    })
                }).catch()
            },
            get_speed(id) {
                this.$http(api_get_speed, id).then(res => {
                    this.steps = res;
                    let active = 0;
                    res.forEach(row => {
                        if (row.time) {
                            active = active + 1;
                        }
                    });
                    this.active = active;
                    this.$nextTick(() => {
                        let step = this.$refs.step;
                        if (step) {
                            step.$forceUpdate();
                        }
                    })
                }).catch(code => {
                    console.log(code);
                })
            },
            error_state(...state) {
                return !!this.errorList.find(row => state.includes(row.code));
            }
        },
        props:{
        },

        components: {
            trendsSelect: require('@/components/trends-select.vue').default,
            labelSelect: require('@/components/label-select.vue').default,
            labelButton: require('@/components/label-buttons.vue').default,
            littleRemark: require('@/components/little-remark.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            formMdf: require('./form-mdf.vue').default,
            timeOut: require('../local/time-out.vue').default,
            download: require('@/components/download.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            orderInput: require('@/components/order-input.vue').default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('../../report/export-dialog').default,
            paramAccount:require('@/api-components/param-account.vue').default,
            parcelInformation:require('../../entrepot/placeorder/parcel-information.vue').default,
            batchRemark:require('../local/batch-remark').default,
            contactBuyer: require('./contact-buyer').default,
            batchChangeWarehouse:require('../local/batch-change-warehouse').default,
            updateShipping:require('./update-shipping').default,
        }
    }
</script>
