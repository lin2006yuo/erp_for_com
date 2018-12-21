<template>
    <page class="p-index">
        <label-item label="请选择第三方仓库：" class="mb-xs mt-sm">
            <el-select v-model="warehouse_id"
                       filterable clearable
                       class="inline width-super"
                       @change="select_warehouse">
                <el-option
                        :key="item.value"
                        v-for="item in warehouses"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <search-card @search="search" @init-params="clear" :params="paramsData" :clears="clears"
                     style="overflow: initial;">
            <div class="mb-mini el-row">
                <label-item label="库存状态：" class="inline">
                    <el-select v-sf.status v-model="paramsData.status" class="inline width-xs">
                        <el-option
                                :key="item.value"
                                v-for="item in repertoryLists"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="产品状态：" class="inline ml-sm">
                    <el-select v-sf.status v-model="paramsData.sku_status" class="inline width-xs">
                        <el-option
                                :key="item.value"
                                v-for="item in sku_status"
                                :label="item.lable"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="分配状态：" class="inline ml-sm">
                    <el-select v-sf.can_allot v-model="paramsData.can_allot" class="inline width-xs">
                        <el-option
                                :key="item.value"
                                v-for="item in allotLists"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="关联映射：" class="inline ml-sm">
                    <el-select v-sf.can_allot v-model="paramsData.is_relate" class="inline width-xs">
                        <el-option
                                :key="item.value"
                                v-for="item in relateList"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="" class="inline ml-sm">
                    <el-select v-sf.snType v-model="paramsData.snType" class="inline width-xs">
                        <el-option
                                :key="item.value"
                                v-for="item in typeList"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <order-input v-if="paramsData.snType !== 'goods_name'" v-sf.snText
                                 v-model="paramsData.snText"
                                 class="inline width-super ml-mini"
                                 @keydown="search"
                                 placeholder="可批量搜索，Shift+回车换行...">
                    </order-input>
                    <el-input v-else v-sf.snText v-model="paramsData.snText" @keyup.enter.native="search"
                              class="inline ml-mini enter-result"></el-input>
                    <label-item class="ml-sm" label="开发员：">
                        <param-account
                                class="s-width-default"
                                v-model="paramsData.developer_id"
                                v-sf.developer_id
                                :fixResult="development_fix_result"
                                type="memberShipSales"
                                placeholder="请选择/输入..."
                                url="get|user/development/staffs">
                        </param-account>
                    </label-item>
                </label-item>
                <label-item label="库存数量：" class="inline">
                    <el-input v-sf.start_quantity type="number" @keyup.enter.native="search"
                              v-model="paramsData.start_quantity" class="width-xs inline enter-result"></el-input>
                    <span>~</span>
                    <el-input v-sf.end_quantity type="number" @keyup.enter.native="search" v-model="paramsData.end_quantity"
                              class="width-xs inline enter-result"></el-input>
                </label-item>
            </div>
            <label-item label="库龄（天）：" class="inline">
                <el-input v-sf.start_age type="number" @keyup.enter.native="search" v-model="paramsData.start_age"
                          class="width-xs inline enter-result"></el-input>
                <span>~</span>
                <el-input v-sf.end_age type="number" @keyup.enter.native="search" v-model="paramsData.end_age"
                          class="width-xs inline mr-sm enter-result"></el-input>
            </label-item>
            <label-item label="销售时间：" class="inline ml-sm">
                <el-date-picker v-model="paramsData.begin_delivery_time"
                                type="date"
                                placeholder="开始时间"
                                v-sf.begin_delivery_time
                                :picker-options="pickerStart"
                                class="inline date ml-mini"></el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker v-model="paramsData.end_delivery_time"
                                type="date"
                                placeholder="结束时间"
                                v-sf.end_delivery_time
                                :picker-options="pickerEnd"
                                class="inline date mr-sm"></el-date-picker>
            </label-item>
        </search-card>

        <goods-classify ref="classifyPart" :leftControllerTitle="leftControllerTitle">
            <!-- 按钮 -->
            <div slot="button-list">
                <permission :disabled="selectedIds.length===0" tag="ElButton" :route="apis.url_change_alert" size="mini"
                            type="default" @click.native="change_number">修改预警数
                </permission>
                <permission tag="ElButton" :route="apis.url_get_apply" class="ml-sm" size="mini" type="default"
                            @click.native="apply_stock">提交备货申请
                </permission>
                <permission tag="ElButton" :route="apis.url_export" :disabled="tables.lists.length===0" size="mini"
                            type="default" @click.native="export_data">导出
                </permission>
                <permission tag="requestButton" :route="apis.url_update_third_stock" req-key="updateThirdStock"
                            @click.native="update_third_stock" type="default"
                            size="mini">更新第三方库存
                </permission>
                <permission tag="requestButton" :route="apis.url_sync_third_stock" req-key="syncThirdStock"
                            @click.native="sync_third_stock" type="default"
                            size="mini">系统同步第三方库存
                </permission>
                <permission tag="ElButton" :route="apis.url_third_import"
                            @click.native="third_import" type="default"
                            :disabled="showImport"
                            size="mini">导入期初库存
                </permission>
                <permission tag="ElButton" :route="apis.url_no_api_in"
                            @click.native="batch_import" type="default"
                            :disabled="showImport"
                            size="mini">批量入库
                </permission>
                <permission tag="ElButton" :route="apis.url_no_api_in" :disabled="!isDividePlatform" class="ml-sm" size="mini" type="default"
                            @click.native="apply_batch_stock_in">提交借调申请
                </permission>
            </div>
            <!-- 商品列表树 -->
            <goods-tree slot="goods-tree"
                        @hidden-left="hidden_left"
                        @change-category="categories_click">
            </goods-tree>
            <!-- 数据表格 -->
            <ui-table v-loading="isLoading"
                      v-model="checkAll"
                      slot="goods-tabel"
                      element-loading-text="玩命加载中..."
                      :has-data="tables.lists.length>0"
                      :body-height="40"
                      :heads="uiHeads"
                      @check="check_all"
            >
                <tbody>
                <template v-for="(row,index) in tables.lists">
                    <tr @click="add_class(index)"
                        :class="[clickData[index]?'active-color':'']">
                        <!--isCheck-->
                        <td>
                            <el-checkbox v-model="row.isCheck" @change="check_box"></el-checkbox>
                        </td>
                        <!--图片-->
                        <td>
                            <plus-minus @show-detail="show(index, row)"
                                        class="inline"
                                        :show="row.show"
                                        v-if="isDividePlatform"
                                        :title="tipTitle">
                            </plus-minus>
                            <el-popover
                                    class="inline"
                                    placement="right"
                                    trigger="hover">
                                <img v-lazy="sku_image(row.thumb)" width="200px" height="200px">
                                <span slot="reference">
                            <img v-lazy="row.thumb" height="60px" width="60px" style="border:none">
                        </span>
                            </el-popover>
                        </td>
                        <!--第三方仓SKU/本地SKU-->
                        <td>
                            <span :title="row.spu_name">{{row.thirdparty_goods_sku}}</span>
                            <div>
                            <span v-if="!row.sku" class="relate-info" @click="relate_sku(row)">
                                <i class="el-icon-information"></i> 未关联
                            </span>
                                <span title="点击可查看商品详情" class="operate" @click="look(row)">{{row.sku}}</span>
                            </div>
                        </td>
                        <!--当前库存(系统/第三方)-->
                        <td>
                            <div :class="[Number(row.third_quantity)<Number(row.alert_quantity)?'bg-alert':'']">
                                {{row.quantity}}/{{row.third_quantity}}
                            </div>
                        </td>
                        <!--可用库存(系统/第三方)-->
                        <td>
                            <div>{{row.available_quantity}}/{{row.third_avaliable_quantity}}</div>
                        </td>
                        <!--待发数量-->
                        <td>
                            <div>{{row.waiting_shipping_quantity}}</div>
                        </td>
                        <!--预警数量-->
                        <td>
                            <div>{{row.alert_quantity}}</div>
                        </td>
                        <!--调拨在途(系统/第三方)-->
                        <td>
                            <div>{{`${row.allocating_quantity}/${row.third_intransit_quantity}`}}</div>
                        </td>
                        <!--中转仓-->
                        <td>
                            <div>{{row.transit_quantity}}</div>
                        </td>
                        <!--采购在途-->
                        <td>
                            <div>{{row.instransit_quantity}}</div>
                        </td>
                        <!--等待分配-->
                        <td>
                            <div>{{row.waiting_stocking_quntity }}</div>
                        </td>
                        <!--备货建议-->
                        <td>
                            <div>{{row.proposal_stocking_quantity}}</div>
                        </td>
                        <!--缺货数-->
                        <td>
                            <div>{{row.oos_quantity}}</div>
                        </td>
                        <!--故障品库存-->
                        <td>
                            <div>{{row.third_defects_quantity}}</div>
                        </td>
                        <!--单价-->
                        <td>
                            <div>{{row.per_cost |filterable}}</div>
                        </td>
                        <!--日均销量-->
                        <td>
                            <div class="inline">
                                <span title="点击可查看图表详情" class="operate" @click="analyze(row)">{{row.average_daily_sales}}</span>
                            </div>
                        </td>
                        <!--库龄(天)-->
                        <td>
                            <div>{{row.age}}</div>
                        </td>
                        <!--销售时间-->
                        <td>{{row.latest_delivery_time}}</td>
                        <!--操作-->
                        <td>
                            <trends-select class="inline"
                                           @trigger="action(row,$event)"
                                           :selects="m_option(row)"
                                           type="primary">
                            </trends-select>
                        </td>
                    </tr>
                    <template v-if="row.show">
                        <tr style="font-weight:bold">
                            <td colspan="3">平台</td>
                            <td>当前库存</td>
                            <td>可用库存</td>
                            <td>待发库存</td>
                            <td colspan="2">调拨在途</td>
                            <td>中转仓</td>
                            <td>采购在途</td>
                            <td colspan="5">缺货数</td>
                            <td colspan="3">日均销量</td>
                            <td>操作</td>
                        </tr>
                        <tr v-for="channel in row.channel_detail">
                            <!--平台-->
                            <td colspan="3">
                                <div>{{channel.channel_name}}</div>
                            </td>
                            <!--当前库存-->
                            <td>
                                <ui-tip :content="channel.quantity" :width="98"></ui-tip>
                            </td>
                            <!--可用库存-->
                            <td>
                                <ui-tip :content="channel.available_quantity" :width="80"></ui-tip>
                            </td>
                            <!--待发库存-->
                            <td>
                                <ui-tip :content="channel.waiting_shipping_quantity" :width="98"></ui-tip>
                            </td>
                            <!--调拨在途-->
                            <td colspan="2">
                                <ui-tip :content="channel.allocation_quantity" :width="98"></ui-tip>
                            </td>
                            <!--中转仓-->
                            <td>
                                <ui-tip :content="channel.transit_quantity" :width="98"></ui-tip>
                            </td>
                            <!--采购在途-->
                            <td>
                                <ui-tip :content="channel.instransit_quantity" :width="98"></ui-tip>
                            </td>
                            <!--缺货数-->
                            <td colspan="5">
                                <ui-tip :content="channel.oos_quantity" :width="98"></ui-tip>
                            </td>
                            <!--日均销量-->
                            <td colspan="2">
                                <ui-tip :content="channel.average_daily_sales" :width="98"></ui-tip>
                            </td>
                            <td>
                                <div>
                                    <permission tag="ElButton"
                                                size="mini"
                                                type="primary"
                                                :disabled="channel.available_quantity <= 0"
                                                @click="apply_stock_in(row, channel)"
                                                :route="apis.url_third_apply_allocate_in">
                                        申请借调库存
                                    </permission>
                                </div>
                            </td>
                        </tr>
                    </template>
                </template>
                </tbody>
            </ui-table>
        </goods-classify>
        <el-pagination
                class="page-fixed"
                @size-change="change_size"
                @current-change="change_page"
                :current-page="tables.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="tables.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tables.count">
        </el-pagination>
        <show-dialog ref="number"
                     v-model="dialogShow"
                     :title="title"
                     @save-apply="save_apply"
                     @save-alert="save_alert"
                     @save-lend="save_lend"
                     @add-data="add_data"
                     :channel-data="channelData"
                     :channel-disable="channelDisable"
                     :alert-quantity="alertQuantity"
                     :value-show="valueShow"></show-dialog>
        <allocation-dialog v-model="allocationShow" :title="title" @refresh-data="refresh_data" :allot-data="allotData"
                           @update-list="update_list"></allocation-dialog>
        <detail-dialog v-model="detailShow" :row="rowDetail"></detail-dialog>
        <operate-dialog v-model="operateShow" :logs-data="logsData" @update-data="update_data"></operate-dialog>
        <add-goods v-model="goodsDialog" ref="addGoods" @selected="goods_submit"></add-goods>
        <relate-sku v-model="relateDialog"
                    @relate="relate"
                    :warehouse="warehouse_id"
                    :relate="relateDialog"
                    :thirdSku="third_sku"
                    :is_multi_warehouse="0"></relate-sku>
        <export-dialog v-model="visible"></export-dialog>
        <analyze v-model="analyzeDialog" :form="analyzeData"></analyze>
        <import-excel v-model="importDialog"
                      :warehouse-id="warehouse_id"
                      :code="code"
                      :file_url="file_url"
                      @search="init"></import-excel>
        <look-edit v-model="lookVisible"
                   :edit-able="false"
                   :goodsId="goodsId"
                   ref="looks"
                   :child-active-name="activeName"></look-edit>
        <apply-stock-in v-model="applyStockVisible"
                        @close="get_channel_detail"
                        :stock-in-info="stockInInfo"></apply-stock-in>
        <export-title
                v-model="exportVisible"
                title="选择需要导出的产品项目"
                :export-title="exportTitle"
                @export-title="export_title"></export-title>
        <add-price v-model="addPriceVisible"
                   @search="init"
                   :price-params="priceParams" :price-data="priceData"></add-price>
        <batch-stock-in v-model="batchStockVisible" is-third="true" :warehouse_id="warehouse_id"></batch-stock-in>
    </page>
</template>
<style lang="stylus">
    @media screen and (min-width: 1366px) {
        .el-table th {
            width: 60px;
        }
    }

    .category-title {
        box-sizing: border-box;
        display: block;
        width: 100%;
        height: 30px;
        line-height: 28px;
        padding-left: 10px;
        background: #008BCE;
        border: 1px solid #008BCE;
        color: #fff;
        &:hover {
            background: rgb(51, 162, 216);
            cursor: pointer;
        }
    }

    .oversea-border {
        height: 642px;
        border: 1px solid #ddd;
    }

    .oversea-tree {
        max-height: 630px;
        overflow-y: auto;
    }

    .fixed-right {
        float: right;
    }

    .el-card__header {
        box-sizing: border-box;
        display: inline-block;
        color: #333;
        width: 100%;
        height: 32px;
        padding: 0 5px;
        line-height: 32px;
        font-size: 1.2rem;
        background: #6495ed;
        border: 1px solid #6495ed;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-bottom: 1px solid transparent;
    }

    .box {
        border: 1px solid #D3DCE6;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
        .box-title {
            border: 1px solid #D3DCE6;
            text-align: center;
            margin: 0;
            background-color: #6495ed;
            font-size: 1.2rem;
            line-height: 32px;
            height: 32px;
            color: #ffffff;
        }
    }

    .el-table__row {
        .bg-alert {
            line-height: 30px;
            background-color: red;
            color: #fff;
        }
    }

    .relate-info {
        color: #008BCE;
        cursor: pointer;
        .el-icon-information {
            width: 1em;
            height: 1em;
        }
    }

</style>
<script>
    import {api_warehous_third, api_get_sku_status} from '@/api/entrepot-picking';
    import {api_relate_sku} from '@/api/warehouse-goods-forecast.js';
    import {
        api_third_stock,
        api_change_alert,
        api_get_apply,
        api_get_lend,
        api_get_logs,
        api_get_allot,
        api_warehouse_goods_apply,
        api_sync_third_stock,
        api_update_third_stock,
        api_channel_stock_detail,
        url_third_apply_allocate_in,
        url_change_alert,
        url_get_apply,
        url_get_lend,
        url_get_logs,
        url_get_allot,
        url_sync_third_stock,
        url_update_third_stock,
        url_third_import,
        url_no_api_in
    } from '@/api/overseas-stock';
    import {api_export, url_export} from '@/api/entrepot-overseas';
    import {api_get_categories} from '@/api/categories';
    import {api_get_details, url_get_details, api_get_export_title} from '@/api/entrepot-overseas';
    import {downloadFile} from '@/lib/http';

    export default {
        page: {
            devinfo: {
                frontEnd: '黎宏珍',
                backEnd: '赖永凤',
                createTime: '2017-12-12',
                updateTime: '2017-12-13'
            },
        },
        permission: {
            url_change_alert,
            url_get_apply,
            url_get_lend,
            url_get_logs,
            url_get_allot,
            url_get_details,
            url_export,
            url_sync_third_stock,
            url_update_third_stock,
            url_third_import,
            url_no_api_in,
            url_third_apply_allocate_in,
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                leftControllerTitle: "显示产品分类检索",
                searchData: {
                    warehouse_id: '',
                    status: '',
                    start_quantity: '',
                    end_quantity: '',
                    developer_id: '',
                    snText: '',
                    snType: 'sku',
                    start_age: '',
                    end_age: '',
                    begin_delivery_time: '',
                    end_delivery_time: '',
                    page: 1,
                    pageSize: 50,
                    category_id: 0,
                    can_allot: 0,
                    is_relate: '0',
                },
                paramsData: {
                    status: '',
                    start_quantity: '',
                    end_quantity: '',
                    developer_id: '',
                    snText: '',
                    snType: 'sku',
                    start_age: '',
                    end_age: '',
                    begin_delivery_time: '',
                    end_delivery_time: '',
                    can_allot: 0,
                    is_relate: '0',
                    sku_status: '',
                },
                clears: {
                    snType: 'sku',
                    can_allot: 0,
                    is_relate: '0'
                },
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.paramsData.end_delivery_time) {
                            return time.getTime() > this.paramsData.end_delivery_time;
                        } else {
                            return false;
                        }
                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.paramsData.begin_delivery_time) {
                            return time.getTime() < this.paramsData.begin_delivery_time;
                        } else {
                            return false;
                        }
                    }
                },
                sku_status: [],
                repertoryLists: [
                    {label: '全部', value: ''},
                    {label: '正常', value: 1},
                    {label: '低库存', value: 2},
                ],
                typeList: [
                    {label: 'SKU', value: 'sku'},
                    {label: 'SKU别名', value: 'sku_alias'},
                    {label: '商品名称', value: 'goods_name'},
                    {label: 'SPU', value: 'spu'},
                ],
                allotLists: [
                    {label: '全部', value: 0},
                    {label: '可分配', value: 1},
                    {label: '不可分配', value: 2},
                ],
                relateList: [
                    {label: '全部', value: '0'},
                    {label: '已关联', value: '1'},
                    {label: '未关联', value: '2'},
                ],
                warehouses: [],
                HiddenClassify: true,
                isLoading: false,
                goodsDialog: false,
                relateDialog: false,
                importDialog: false,
                third_sku: '',
                categoriesTempl: [],
                tables: {
                    page: 1,
                    pageSize: 50,
                    count: 0,
                    lists: []
                },
                operateButtons: [
                    {label: '分配', value: 1, apis: url_get_allot},
                    {label: '提交备货', value: 3, apis: url_get_apply},
                    {label: '修改预警', value: 4, apis: url_change_alert},
                    {label: '出入库日志', value: 5, apis: url_get_details},
                    {label: '操作日志', value: 6, apis: url_get_logs},
                ],
                dialogShow: false,
                allocationShow: false,
                detailShow: false,
                operateShow: false,
                valueShow: 1,
                title: '',
                warehouse_id: '',
                selectCategories: 0,
                ids: [],
                alertQuantity: '',
                rowDetail: {},
                logsData: {
                    logs_one: [],
                    logs_two: [],
                },
                stockInInfo: {},
                allotData: {},
                channelData: [],
                channelDisable: false,
                isCleared: false,
                visible: false,
                analyzeDialog: false,
                analyzeData: {},
                lookVisible: false,
                goodsId: 0,
                activeName: '',
                code: '',
                file_url: '',
                uiHeads: [
                    {isCheck: true, width: 2},
                    {label: '图片', width: 8},
                    {label: '第三方仓SKU/本地SKU', width: 5},
                    {label: '当前库存(系统/第三方)', width: 5},
                    {label: '可用库存(系统/第三方)', width: 5},
                    {label: '待发数量', width: 5},
                    {label: '预警数量', width: 5},
                    {label: '调拨在途(系统/第三方)', width: 5},
                    {label: '中转仓', width: 5},
                    {label: '采购在途', width: 5},
                    {label: '等待分配', width: 5},
                    {label: '备货建议', width: 5},
                    {label: '缺货数', width: 5},
                    {label: '故障品库存', width: 6},
                    {label: '单价', width: 5},
                    {label: '日均销量', width: 5},
                    {label: '库龄(天)', width: 6},
                    {label: '销售时间', width:4},
                    {label: '操作', width: 8},
                ],
                checkAll: false,
                clickData: [],
                tipTitle: "点击查看平台分库存",
                applyStockVisible: false,//申请调入库存
                exportVisible: false,
                exportTitle: [],
                exportDialogVisible: false,
                batchStockVisible: false,
                addPriceVisible: false,
                priceParams: {},
                priceData: [],
            }
        },
        mounted() {
            this.warehouses_init();
            this.categories_init();
            this.get_sku_status();
            this.hidden_left();
        },
        methods: {
            hidden_left() {
                this.$refs.classifyPart.showLeft(true);
            },
            analyze(data) {
                this.analyzeData = {sku: data.sku, sku_id: data.sku_id, warehouse_id: data.warehouse_id};
                this.analyzeDialog = true;
            },
            get_sku_status() {//产品筛选状态
                this.$http(api_get_sku_status).then(res => {
                    this.sku_status = res;
                    this.paramsData.sku_status = res[0].value;
                })
            },
            add_data() {
                this.goodsDialog = true;
            },
            goods_submit(val) {
                val.forEach(data => {
                    data.forEach(row => {
                        let find = this.channelData.find(res => res.sku_id === row.sku_id);
                        if (!find) {
                            this.channelData.unshift({
                                spu_name: row.spu_name,
                                thumb: row.thumb,
                                sku: row.sku,
                                sku_id: row.sku_id,
                                quantity: '',
                            })
                        }
                    })
                });
            },
            sku_image(images) {
                if (!!images) {
                    return images.replace('_60x60.', '_200x200.')
                }
                return ""
            },
            warehouses_init() {
                this.$http(api_warehous_third).then(res => {
                    this.warehouses = res.map((item) => {
                        return {
                            label: item.name,
                            value: item.id,
                            type: item.type,
                            is_divide_platform: item.is_divide_platform
                        };
                    });
                    if (this.warehouses.length > 0) {
                        this.warehouse_id = this.warehouses[0].value;
                    } else {
                        this.warehouse_id = '';
                    }
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            categories_init() {
                this.$http(api_get_categories, {}).then(res => {
                    this.categoriesTempl = [{label: '全部分类', id: 0, children: []}];
                    for (let i in res) {
                        let treeObj = {};
                        if (res[i].hasOwnProperty("child_ids") && (res[i].child_ids.length > 0)) {
                            treeObj.label = res[i].title;
                            treeObj.id = res[i].id;
                            treeObj.children = res[i].child_ids.map(row => {
                                return {
                                    id: res[row].id,
                                    label: res[row].title
                                }
                            });
                            this.categoriesTempl.push(treeObj);
                        }
                    }

                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            clear() {
                this.isCleared = true;
            },
            init() {
                this.isLoading = true;
                let data = this.get_params();
                this.tables.lists = [];
                this.$http(api_third_stock, data).then(res => {
                    this.tables.lists = res.data;
                    this.tables.count = res.count;
                    this.tables.lists.forEach(row => {
                        let buttons = [
                            {label: '提交备货', value: 3, apis: url_get_apply},
                            {label: '修改预警', value: 4, apis: url_change_alert},
                            {label: '出入库日志', value: 5, apis: url_get_details},
                            {label: '操作日志', value: 6, apis: url_get_logs},
                        ];
                        if (row.can_allot) {
                            buttons.unshift({label: '分配', value: 1, apis: url_get_allot})
                        }
                        this.$set(row, 'operateButtons', buttons);
                        this.$set(row, 'isCheck', false);
                        if (this.isDividePlatform) {
                            this.$set(row, 'show', false);
                            this.$set(row, 'channel_detail', []);
                        }
                    });
                    this.isLoading = false;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            get_params() {
                Object.assign(this.searchData, this.paramsData);
                if (this.isCleared) {
                    this.tables.page = 1;
                    this.tables.pageSize = 50;
                    this.isCleared = false;
                }
                this.searchData.page = this.tables.page;
                this.searchData.pageSize = this.tables.pageSize;
                this.searchData.category_id = this.selectCategories;
                this.searchData.warehouse_id = this.warehouse_id;
                let data = {};
                if (this.searchData.snType !== 'goods_name') {
                    data = window.clone(this.searchData);
                    let cur = data.snText.split('\n').filter(row => !!row);
                    data.snText = cur.map(row => {
                        return row.trim();
                    });
                } else {
                    data = window.clone(this.searchData);
                }
                data.begin_delivery_time && (data.begin_delivery_time = datef('YYYY-MM-dd', data.begin_delivery_time.getTime()/1000));
                data.end_delivery_time && (data.end_delivery_time = datef('YYYY-MM-dd', data.end_delivery_time.getTime()/1000));
                return data;
            },
            select_warehouse() {
                this.init();
            },
            search() {
                this.init();
            },
            categories_click(node) {
                if (typeof node === 'number') {
                    this.selectCategories = node;
                    this.init();
                }
            },
            change_size(size) {
                this.tables.pageSize = size;
                this.init();
            },
            change_page(page) {
                this.tables.page = page;
                this.init();
            },
            change_number() {
                this.valueShow = 1;
                this.$refs.number.number = '';
                this.title = '修改预警数量';
                this.ids = [];
                this.dialogShow = true;
            },
            save_alert(number) {

                typeof number === 'string' && (number = number.trim());
                if (this.selectedIds.length > 0) {
                    let data = {
                        ids: this.selectedIds,
                        value: number,
                    };
                    this.change_alert(data);
                    return;
                }
                if (this.ids.length === 1) {
                    let data = {
                        ids: this.ids,
                        value: number,
                    };
                    this.change_alert(data);
                }
            },
            change_alert(data) {
                this.$http(api_change_alert, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    data.ids.forEach(row => {
                        this.tables.lists.forEach(item => {
                            if (item.id === row) {
                                item.alert_quantity = data.value;
                            }
                        });
                    });
                    this.dialogShow = false;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('saveAdd', false);
                    }, 200);
                });
            },
            save_lend(data) {
                let params = {
                    sku_id: this.ids,
                    from_channel_id: data.from_channel_id,
                    to_channel_id: data.to_channel_id,
                    quantity: data.quantity,
                    warehouse_id: this.warehouse_id,
                };
                this.$http(api_get_lend, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.tables.lists.forEach(item => {
                        if (item.sku_id === this.ids) {
                            if (data.from_channel_id === 1) {
                                item.ebay_quantity = Number(item.ebay_quantity) - Number(data.quantity);
                            } else if (data.from_channel_id === 2) {
                                item.amazon_quantity = Number(item.amazon_quantity) - Number(data.quantity);
                            } else if (data.from_channel_id === 3) {
                                item.wish_quantity = Number(item.wish_quantity) - Number(data.quantity);
                            } else if (data.from_channel_id === 4) {
                                item.aliExpress_quantity = Number(item.aliExpress_quantity) - Number(data.quantity);
                            }
                            if (data.to_channel_id === 1) {
                                item.ebay_quantity = Number(item.ebay_quantity) + Number(data.quantity);
                            } else if (data.to_channel_id === 2) {
                                item.amazon_quantity = Number(item.amazon_quantity) + Number(data.quantity);
                            } else if (data.to_channel_id === 3) {
                                item.wish_quantity = Number(item.wish_quantity) + Number(data.quantity);
                            } else if (data.to_channel_id === 4) {
                                item.aliExpress_quantity = Number(item.aliExpress_quantity) + Number(data.quantity);
                            }
                        }
                    });
                    this.dialogShow = false;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('get_lendAdd', false);
                    }, 200);
                });
            },
            apply_stock() {
                this.ids = '';
                this.channelData = [];
                this.channelData = this.skuIdData.map(data => {
                    return {
                        id: data.id,
                        sku_id: data.sku_id,
                        sku: data.sku,
                        thumb: data.thumb,
                        spu_name: data.spu_name,
                    }
                });
                this.dialogShow = true;
                this.valueShow = 2;
                this.title = '提交备货申请';
                this.warehouses.find(row => {
                    if (this.warehouse_id === row.value) {
                        if (row.type === '5') {
                            this.channelDisable = true;
                        } else {
                            this.channelDisable = false;
                        }
                    }
                });
            },
            export_data() {
                return this.$http(api_get_export_title,{warehouse_id:this.warehouse_id}).then(res => {
                    this.exportTitle = res;
                    this.exportVisible = true;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            export_title(val){
                this.exportVisible = false;
                // this.visible = true;
                let paramsNewData = {};
                if (this.selectedIds.length) {
                    paramsNewData = Object.assign(this.get_params(), {
                        ids: this.selectedIds,
                        export_type: 2,
                        warehouse_id: this.warehouse_id,
                        fields: val
                    });
                } else {
                    paramsNewData = this.get_params();
                    paramsNewData.ids = '';
                    paramsNewData.export_type = 1;
                    paramsNewData.fields = val
                }
                this.$http(api_export, paramsNewData).then(res => {
                    if (res.status === 1) {
                        let params = {
                            file_code: res.file_code
                        };
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls',
                        })
                    } else {
                        this.visible = true;
                        this.$message({type: 'success', message: res.message || res});
                    }
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                });
            },
            sync_third_stock() {
                let params = {
                    warehouse_id: this.warehouse_id,
                };
                if (this.selectedIds.length !== 0) {
                    params.ids = this.selectedIds;
                }
                this.$http(api_sync_third_stock, params).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    if(res.no_price.length === 0) {
                        this.init();
                    } else {
                        this.addPriceVisible = true;
                        this.priceParams = params;
                        this.priceData = res.no_price;
                    }
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('syncThirdStock', false);
                    }, 200);
                })

            },
            update_third_stock() {
                let params = {
                    warehouse_id: this.warehouse_id,
                };
                if (this.skuIdData.length !== 0) {
                    params.third_skus = this.skuIdData.map(row => row.thirdparty_goods_sku);
                }
                this.$http(api_update_third_stock, params).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.init();
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('updateThirdStock', false);
                    }, 200);
                })
            },
            save_apply(data) {
                let param = {
                    warehouse_id: this.warehouse_id,
                    details: data.details,
                    channel_id: data.channel_id,
                    transit_warehouse_id: data.transit_warehouse_id,
                };
                this.get_apply(param);
            },
            get_apply(data) {
                this.$http(api_get_apply, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.dialogShow = false;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('submitStock', false);
                    }, 200);
                });
            },
            update_data(data, list_type) {
                let param = {
                    list_type: list_type,
                    sku_id: data.sku_id,
                    warehouse_id: this.warehouse_id,
                    page: data.page,
                    pageSize: data.pageSize,
                };
                this.get_logs(param, list_type);
            },
            get_logs(data, list_type) {
                let params = {
                    list_type: list_type,
                    sku_id: data.sku_id,
                    warehouse_id: this.warehouse_id,
                    page: data.page,
                    pageSize: data.pageSize,
                };
                this.$http(api_get_logs, params).then(res => {
                    this.logsData = res;
                    this.logsData.page = Number(res.page);
                    this.logsData.pageSize = Number(res.pageSize);
                    this.logsData.sku_id = data.sku_id;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            refresh_data(id, apply_id) {
                let data = {
                    apply_id: apply_id,
                };
                this.$http(api_get_allot, id, data).then(res => {
                    this.allotData = res;
                    this.allotData.id = id;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            get_allot(id) {
                this.$http(api_get_allot, id).then(res => {
                    res.channel_data.forEach(row => {
                        this.$set(row, 'allot_quantity', 0);
                    });
                    this.allotData = res;
                    this.allotData.id = id;
                    this.allocationShow = true;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            update_list(id, details) {
                this.tables.lists.forEach(item => {
                    if (item.id === id) {
                        details.forEach(row => {
                            if (row.channel_id === 1) {
                                item.ebay_quantity = Number(item.ebay_quantity) + Number(row.allot_quantity);
                            } else if (row.channel_id === 2) {
                                item.amazon_quantity = Number(item.amazon_quantity) + Number(row.allot_quantity);
                            } else if (row.channel_id === 3) {
                                item.wish_quantity = Number(item.wish_quantity) + Number(row.allot_quantity);
                            } else if (row.channel_id === 4) {
                                item.aliExpress_quantity = Number(item.aliExpress_quantity) + Number(row.allot_quantity);
                            }
                        });
                    }
                });
            },
            action(data, options) {
                switch (options.value) {
                    case 1:
                        this.channelData = [];
                        this.title = `SKU:${data.sku}分配平台库存`;
                        this.get_allot(data.id);
                        break;
                    case 3:
                        this.valueShow = 2;
                        this.channelData = [];
                        this.clear_selection();
                        this.channelData.push(
                            {
                                id: data.id,
                                sku_id: data.sku_id,
                                sku: data.sku,
                                thumb: data.thumb,
                                spu_name: data.spu_name,
                            });
                        this.title = '提交备货申请';
                        this.dialogShow = true;
                        break;
                    case 4:
                        this.valueShow = 1;
                        this.title = `修改SKU：${data.sku}预警数量`;
                        this.ids = [];
                        this.channelData = [];
                        this.clear_selection();
                        this.ids.push(data.id);
                        this.alertQuantity = data.alert_quantity;
                        this.dialogShow = true;
                        break;
                    case 5:
                        this.rowDetail = data;
                        this.detailShow = true;
                        break;
                    case 6:
                        this.title = '操作日志';
                        this.operateShow = true;
                        let param = {
                            sku_id: data.sku_id,
                            warehouse_id: this.warehouse_id,
                            page: 1,
                            pageSize: 10,
                        };
                        this.get_logs(param, 1);
                        break;
                }
            },
            m_option(row) {
                return row.operateButtons.filter(res => {
                    return this.$hasPermission(res.apis);
                })
            },
            clear_selection() {
                this.tables.lists.forEach(row => {
                    this.$set(row, 'isCheck', false)
                });
            },
            relate(params) {
                this.$http(api_relate_sku, params).then(res => {// 关联完成后重新获取数据
                    this.$message({type: 'success', message: res});
                    this.relateDialog = false;
                    this.change_page(1);
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            relate_sku(row) {
                this.third_sku = row.thirdparty_goods_sku;
                this.relateDialog = true;
            },
            third_import() {
                this.importDialog = true;
                this.file_url = '导入期初库存模板';
                this.code = 'third_inventory_import';
            },
            batch_import() {
                this.importDialog = true;
                this.file_url = '导入批量导入库存模板';
                this.code = 'no_api_stock_in';
            },
            apply_batch_stock_in() {//提交借调申请
                this.batchStockVisible = true;
            },
            look(row) {
                this.$refs.looks.titleName = `查看SKU：${row.sku}  `;
                switch (row.channel_id) {
                    case 0:
                        this.activeName = "自定义图片";
                        break;
                    case 1:
                        this.activeName = 'ebay平台';
                        break;
                    case 2:
                        this.activeName = '亚马逊平台';
                        break;
                    case 3:
                        this.activeName = 'wish平台';
                        break;
                    case 4:
                        this.activeName = '速卖通平台';
                        break;
                }
                this.goodsId = row.goods_id;
                this.lookVisible = true;
            },
            development_fix_result(res) {
                return res.map(row => {
                    return {
                        value: row.id,
                        label: row.realname
                    }
                })
            },
            check_all(val) {
                this.tables.lists.forEach(row => {
                    row.isCheck = val;
                })
            },
            check_box() {
                let isCheckAll = !this.tables.lists.find(row => !row.isCheck);
                this.checkAll = isCheckAll;
            },
            add_class(index) {
                this.clickData = this.clickData.map(() => {
                    return false;
                });
                this.clickData[index] = true;
            },
            show(index, row) {//展示平台详细信息
                row.show = !row.show;
                this.get_channel_detail(row, row.sku_id);
            },
            get_channel_detail(row, id) {
                let params = {
                    warehouse_id: this.warehouse_id,
                    sku_id: id,
                };
                this.$http(api_channel_stock_detail, params).then(res => {
                    this.$set(row, 'channel_detail', res);
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            apply_stock_in(row, channel) {//申请调入库存
                this.stockInInfo = {
                    warehouse_id: this.warehouse_id,
                    sku: row.sku,
                    sku_id: row.sku_id,
                    channel_id: channel.channel_id,
                    channel_name: channel.channel_name,
                    parent: row,
                };
                this.applyStockVisible = true;
            }
        },
        filters: {
            filterable(val) {
                if (val) return parseFloat(val).toFixed(2);
            }
        },
        watch: {
            selectCategories(id) {
                this.init();
            },
        },
        computed: {
            classifyBoxSpan() {
                return this.showHiddenClassify ? 21 : 24;
            },
            showHIddenClassifyName() {
                return this.showHiddenClassify ? "隐藏产品分类检索" : "显示产品分类检索";
            },
            showImport() {
                if (this.warehouses.length !== 0) {
                    return Number(this.warehouses.find(row => row.value === this.warehouse_id).type) !== 12;
                }
                return true;
            },
            isDividePlatform() {
                if (this.warehouses.length !== 0) {
                    return Number(this.warehouses.find(row => row.value === this.warehouse_id).is_divide_platform) === 1;
                }
                return false;
            },
            skuIdData() {
                return this.tables.lists.filter(row => row.isCheck);
            },
            selectedIds() {
                return this.tables.lists.filter(row => row.isCheck).map(row => row.id);
            }

        },
        components: {
            addGoods: require('@/view/procurement/plan/add-goods.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            tree: require('@/components/tree.vue').default,
            showDialog: require('./dialog.vue').default,
            detailDialog: require('./detail-dialog.vue').default,
            operateDialog: require('./operate-dialog.vue').default,
            allocationDialog: require('./allocation-dialog.vue').default,
            relateSku: require('./relate-sku.vue').default,
            applyStockIn: require('./apply-stock-in.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            trendsSelect: require('@/components/trends-select.vue').default,
            orderInput: require("@/components/order-input.vue").default,
            goodsClassify: require('@/components/goods-classify.vue').default,
            goodsTree: require('@/components/goods-tree.vue').default,
            exportDialog: require('../export-dialog.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
            analyze: require('@/view/procurement/purchasing/add-analyze.vue').default,
            importExcel: require('./import-excel.vue').default,
            lookEdit: require('@/view/product/manager/look-edit.vue').default,
            paramAccount: require('@/api-components/param-account').default,
            uiTable: require('@/components/ui-table.vue').default,
            plusMinus: require('@/components/plus-minus.vue').default,
            blowupImage: require("@/components/blowup-image.vue").default,
            exportTitle: require('../../stock-out/export-title.vue').default,
            addPrice: require('./add-price.vue').default,
            batchStockIn: require('../overseas-stock/batch-stock-in.vue').default,
        }
    }
</script>