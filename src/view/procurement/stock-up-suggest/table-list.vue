<template>
    <el-row class="p-purchasing">
        <div class="ml-sm mt-sm mb-sm">
            <permission tag="trendsSelect"
                        class="inline ml-xs mr-xs"
                        v-if="searchData.status===6||searchData.status===13||searchData.status===12"
                        type="primary"
                        :route="apis.url_purchaseing_export"
                        :selects="partAllOptions"
                        @trigger="export_excel"></permission>
            <permission
                tag="ElButton"
                :route="apis.url_batch_develop_review"
                req-key="url_batch_develop_review"
                type="primary"
                v-if="searchData.status===4"
                :disabled="isDisabled"
                size="mini"
                @click="batchApproval">批量审批通过
            </permission>
            <permission
                tag="request-button"
                :route="apis.url_reset_proposal_status"
                req-key="url_batch_develop_rejecet"
                v-if="searchData.status===4"
                :disabled="isDisabled"
                @click="batchRejected(1)">批量驳回
            </permission>
            <permission
                tag="request-button"
                :route="apis.url_stocking_advice_develop_processing_plan"
                req-key="url_stocking_advice_develop_processing_plan"
                :disabled="isDisabled"
                @click="processing_plan"
                class="inline create-purchasing-cal"
                v-if="searchData.status===5">处理计划
            </permission>
            <permission
                tag="request-button"
                :route="apis.url_batch_develop_rejecet"
                req-key="url_batch_develop_rejecet"
                :disabled="isDisabled"
                @click="batchRejected(2)"
                class="inline create-purchasing-cal"
                v-if="searchData.status===5">驳回计划
            </permission>
        </div>
        <ui-table :has-data="dataTable.length>0"
                  class="purchasing"
                  v-model="checkAll"
                  :first-loading="firstLoading"
                  :body-height="41"
                  @sort-click="sort_click"
                  @check="changeAll"
                  :heads="filterHeads"
                  v-loading="loading"
                  element-loading-text="玩命加载中...">
            <tbody>
            <template v-if="changeStatus===4||changeStatus===5" v-for="(data, index) in dataTable">
                <!--供应商-->
                <tr>
                    <td>
                        <el-checkbox v-model="data.isChecks" @change="change_list"></el-checkbox>
                    </td>
                    <td :colspan="supplierColspan" class="td-relative">
                        <span class="span">供应商：{{data.supplier|supplierFilter}}</span>
                        <span class="span span-absolute">备货商品种类数量：{{data.num}}</span>
                    </td>
                </tr>
                <template v-for="(item, index) in data.dataList">
                    <!--采购建议-->
                    <tr class="line" :class="item===classData?'active-color':''" @click="addClass(item)">
                        <!--check box-->
                        <td>
                            <el-checkbox v-model="item.isCheck" @change="changeOne"
                                         :disabled="item.isDiable"></el-checkbox>
                        </td>
                        <!--图片-->
                        <td>
                            <el-popover
                                placement="right"
                                width="200"
                                trigger="hover">
                                <img v-lazy="sku_image(item.thumb)" width="200px" height="200px">
                                <div slot="reference" style="position: relative;">
                                    <img v-lazy="item.thumb"
                                         @click="search_img(item.thumb)"
                                         width="60"
                                         height="60"
                                         style="vertical-align: middle;">
                                </div>
                            </el-popover>
                        </td>
                        <!--产品SKU/别名-->
                        <td>
                            <div class="p-suggest-td-text" :title="item.sku">{{item.sku}}</div>
                            <div class="p-suggest-td-text" :title="item.sku_alias|filterAlias">
                                {{item.sku_alias|filterAlias}}
                            </div>
                        </td>
                        <!--产品名称-->
                        <td class="t-left">
                            <span :title="item.sku_name">{{item.sku_name}}</span>
                        </td>
                        <!--sku状态-->
                        <td>
                            <div
                                :class="isRed(item.sku_status_label)?'color-red p-suggest-td-text':'p-suggest-td-text'"
                                :title="item.sku_status_label">{{item.sku_status_label}}
                            </div>
                        </td>
                        <template v-if="changeStatus===4">

                            <!--日均销量-->
                            <td>
                                <div class="p-suggest-td-text" :title="item.daily_sale">{{item.daily_sale}}</div>
                            </td>
                            <!--在途库存-->
                            <td>{{item.intransit_stock_qty}}</td>
                            <!--备货仓库-->
                            <td>{{item.warehouse}}</td>
                            <!--备货仓库可用库存-->
                            <td>{{item.available_qty}}</td>
                            <!--中转仓-->
                            <td>{{item.transit_warehouse}}</td>
                            <!--中转仓可用库存-->
                            <td>{{item.transit_warehouse_available_qty}}</td>
                            <!--备货数量-->
                            <td>
                                <div class="inline">
                                    <span v-if="item.sku_in_quantity" title="点击可查看图表详情" class="operate"
                                          @click="particulars(item,1)">{{item.sku_in_quantity}}</span>
                                    <div class="daily_sale" v-else title="无销售量">{{item.sku_in_quantity}}</div>
                                </div>
                            </td>
                            <!--本地仓可用库存-->
                            <td class="local-repository">
                                <div class="available-list" v-for="(row,index) in item.available_list" :key="row.id">
                                    <div class="warehouse">
                                        <span>{{row.warehouse}}&nbsp|</span>
                                    </div>
                                    <div class="quantity">
                                        <span class="color-red ml-sm">{{row.quantity}}</span>
                                    </div>
                                </div>
                            </td>
                            <!--采购价格-->
                            <td>
                                <span>{{item.buying_price_code}}&nbsp{{item.buying_price|dailyFilter}}</span>
                            </td>
                            <!--采购员-->
                            <td>
                                <div v-if="searchData.created_plan_status===0">
                                    <purchaser ref="purchaser" v-if="item.select" class="inline"
                                               v-model="item.purchaser_id"
                                               style="width: 100px"></purchaser>
                                    <span class="operate" @click="add_buyer(item)"
                                          v-else>{{item.purchaser|supplierFilter}}</span>
                                </div>
                                <div v-else>{{item.purchaser|supplierFilter}}</div>
                            </td>
                            <!--开发员-->
                            <td>
                                <div v-if="searchData.created_plan_status===0">
                                    <purchaser ref="purchaser" v-if="item.select" class="inline"
                                               v-model="item.purchaser_id"
                                               style="width: 100px"></purchaser>
                                    <span class="operate" @click="add_buyer(item)"
                                          v-else>{{item.developer|supplierFilter}}</span>
                                </div>
                                <div v-else>{{item.developer|supplierFilter}}</div>
                            </td>
                            <!--操作-->
                            <td>
                                <trends-select
                                    class="inline ml-sm btn-trends-select-relative"
                                    :selects="filterOptions(changeStatus)"
                                    type="primary"
                                    @trigger="handles(item,$event)"></trends-select>
                            </td>
                        </template>
                        <template v-if="changeStatus===5">
                            <!--日均销量-->
                            <td>
                                <div class="p-suggest-td-text" :title="item.daily_sale">{{item.daily_sale}}</div>
                            </td>
                            <!--在途库存-->
                            <td>{{item.intransit_stock_qty}}</td>
                            <!--最小起订量-->
                            <td>{{item.min_qty}}</td>
                            <!--中转仓-->
                            <td>{{item.transit_warehouse}}</td>
                            <!--审核备货数量-->
                            <td>
                                <div class="inline">
                                    <span v-if="item.sku_in_quantity" title="点击可查看图表详情" class="operate"
                                          @click="particulars(item,1,'查看审核备货总数')">{{item.sku_in_quantity}}</span>
                                    <div class="daily_sale" v-else title="无审核备货数量">{{item.sku_in_quantity}}</div>
                                </div>
                            </td>
                            <!--中转仓可用库存-->
                            <td>
                                {{item.transit_warehouse_available_qty}}
                            </td>
                            <!--中转仓锁定库存-->
                            <td>
                                <span v-if="Number(item.transit_warehouse_available_qty)<=0">{{item.transit_warehouse_available_qty<0?0:item.transit_warehouse_available_qty}}</span>
                                <ui-limit-number v-else v-model="item.transit_quantity"
                                                 style="width:80px"
                                                 @change="update_transit_quantity(item)"
                                                 :disabled="item.isDiable"
                                                 class="inline"
                                                 :max="Math.min(item.sku_in_quantity-quantity_total(item)-item.purchase_num,Number(item.sku_in_quantity),Number(item.transit_warehouse_available_qty))"
                                                 :min="0">
                                </ui-limit-number>
                            </td>
                            <!--本地仓可用库存-->
                            <td class="local-repository">
                                <div class="available-list" v-for="(row,index) in item.available_list" :key="row.id">
                                    <div class="warehouse">
                                        <span>{{row.warehouse}}&nbsp|</span>
                                    </div>
                                    <div class="quantity">
                                        <span class="color-red ml-sm">{{row.quantity}}</span>
                                    </div>
                                </div>
                            </td>
                            <!--调拨数量-->
                            <td calss="td-allot">
                                <div class="allot-list color-red" v-for="(row,index) in item.available_list"
                                     :key="row.id">
                                    <span v-if="row.quantity==0">{{row.quantity}}</span>
                                    <ui-limit-number v-else v-model="row.new_quantity"
                                                     style="width:80px"
                                                     @change="update_quantity_num(item)"
                                                     :disabled="item.isDiable"
                                                     class="inline"
                                                     :max="row.sku_in_quantity||(item.sku_in_quantity-item.transit_quantity-item.purchase_num)"
                                                     :min="0">
                                    </ui-limit-number>
                                </div>
                            </td>
                            <!--采购数量-->
                            <td>
                                <ui-limit-number v-model="item.purchase_num"
                                                 style="width:80px"
                                                 @change="update_purchase_num(item,$event)"
                                                 :disabled="item.isDiable"
                                                 class="inline"
                                                 :max="item.sku_in_quantity||(item.sku_in_quantity-item.transit_quantity-quantity_total(item))"
                                                 :min="item.min_qty">
                                </ui-limit-number>
                            </td>
                            <!--供应商-->
                            <td>
                                <div style="cursor: pointer;">
                                    <span class="operate p-sku_name-cell" @click="add_supplier(item)">{{item.supplier|supplierFilter}}</span>
                                </div>
                            </td>
                            <!--采购价格-->
                            <td>
                                <span v-if="item.currency_code">{{item.currency_code|dailyFilter}}&nbsp;</span>
                                <span v-else>{{item.buying_price_code}}&nbsp;</span>
                                <ui-limit-number v-model="item.buying_price"
                                                 style="width:60px"
                                                 @change="update_price(item)"
                                                 :disabled="item.isDiable"
                                                 :limit="3"
                                                 class="inline"
                                                 :min="0">
                                </ui-limit-number>
                            </td>
                            <!--采购员-->
                            <td>
                                <div v-if="searchData.created_plan_status===0">
                                    <purchaser ref="purchaser" v-if="item.select" class="inline"
                                               v-model="item.purchaser_id"
                                               style="width: 100px"></purchaser>
                                    <span class="operate" @click="add_buyer(item)"
                                          v-else>{{item.purchaser|supplierFilter}}</span>
                                </div>
                                <div v-else>{{item.purchaser|supplierFilter}}</div>
                            </td>
                        </template>
                    </tr>
                </template>
            </template>
            <!--后面的状态6 13 12   更换展示维度-->
            <template v-if="changeStatus===13||changeStatus===12||changeStatus===6" v-for="(item, index) in dataTable">
                <tr>
                    <!--check box-->
                    <td>
                        <el-checkbox v-model="item.isCheck" @change="changeOne"
                                     :disabled="item.isDiable"></el-checkbox>
                    </td>
                    <!--备货计划-->
                    <td>
                        <span class="operate" @click="checkTheStockPlan(item.ready_inventory_id)">PL{{item.code}}</span>
                    </td>
                    <!--图片-->
                    <td>
                        <el-popover
                            placement="right"
                            width="200"
                            trigger="hover">
                            <img v-lazy="sku_image(item.thumb)" width="200px" height="200px">
                            <div slot="reference" style="position: relative;">
                                <img v-lazy="item.thumb"
                                     @click="search_img(item.thumb)"
                                     width="60"
                                     height="60"
                                     style="vertical-align: middle;">
                            </div>
                        </el-popover>
                    </td>
                    <!--产品SKU/别名-->
                    <td>
                        <div class="p-suggest-td-text" :title="item.sku">{{item.sku}}</div>
                        <div class="p-suggest-td-text" :title="item.sku_alias|filterAlias">
                            {{item.sku_alias|filterAlias}}
                        </div>
                    </td>
                    <!--产品名称-->
                    <td class="t-left">
                        <span :title="item.sku_name">{{item.sku_name}}</span>
                    </td>
                    <!--sku状态-->
                    <td>
                        <div
                            :class="isRed(item.sku_status_label)?'color-red p-suggest-td-text':'p-suggest-td-text'"
                            :title="item.sku_status_label">{{item.sku_status_label}}
                        </div>
                    </td>
                    <!--备货仓库-->
                    <td>{{item.warehouse}}</td>
                    <!--中转仓-->
                    <td>{{item.transit_warehouse}}</td>
                    <!--申请备货数量-->
                    <td v-if="changeStatus!==13">{{item.sku_quantity}}</td>
                    <!--审核备货数量--><!--开发驳回的备货数量-->
                    <td v-if="changeStatus===12||changeStatus===6||changeStatus===13">
                        <div class="daily_sale" title="审核备货数量">{{item.sku_in_quantity}}</div>
                    </td>
                    <!--已处理数量-->
                    <td v-if="changeStatus===6">{{item.processed_num}}</td>
                    <!--驳回数量-->
                    <td v-if="changeStatus===12||changeStatus===6">{{item.reject_qty}}</td>
                    <!--供应商-->
                    <td>
                        <div style="cursor: pointer;" v-if="searchData.created_plan_status===0">
                            <span class="operate p-sku_name-cell" @click="add_supplier(item)">{{item.supplier|supplierFilter}}</span>
                        </div>
                        <div v-else class="p-suggest-td-text" :title="item.supplier|supplierFilter">
                            {{item.supplier|supplierFilter}}
                        </div>
                    </td>
                    <!--采购价格-->
                    <td v-if="changeStatus===6">
                        <div v-if="item.purchaser_price.length">
                            <div v-for="(row,index) in item.purchaser_price" :key="index">
                                <span>{{row.currency_code }}&nbsp{{row.price|dailyFilter}}</span>
                            </div>
                        </div>
                        <span v-else>CNY&nbsp0.000</span>
                    </td>
                    <!--采购员-->
                    <td>
                        <div v-if="searchData.created_plan_status===0">
                            <purchaser ref="purchaser" v-if="item.select" class="inline" v-model="item.purchaser_id"
                                       style="width: 100px"></purchaser>
                            <span class="operate" @click="add_buyer(item)"
                                  v-else>{{item.purchaser|supplierFilter}}</span>
                        </div>
                        <div v-else>{{item.purchaser|supplierFilter}}</div>
                    </td>
                    <!--开发员-->
                    <td>
                        <div v-if="searchData.created_plan_status===0">
                            <purchaser ref="purchaser" v-if="item.select" class="inline" v-model="item.purchaser_id"
                                       style="width: 100px"></purchaser>
                            <span class="operate" @click="add_buyer(item)"
                                  v-else>{{item.developer|supplierFilter}}</span>
                        </div>
                        <div v-else>{{item.developer|supplierFilter}}</div>
                    </td>
                    <!--创建人-->
                    <td>
                        <div v-if="searchData.created_plan_status===0">
                            <purchaser ref="purchaser" v-if="item.select" class="inline" v-model="item.creator"
                                       style="width: 100px"></purchaser>
                            <span class="operate" @click="add_buyer(item)"
                                  v-else>{{item.creator|supplierFilter}}</span>
                        </div>
                        <div v-else>{{item.creator|supplierFilter}}</div>
                    </td>
                    <!--批注-->
                    <td>
                        <div v-if="changeStatus!==6">
                            {{item.remark}}
                        </div>
                        <div v-else>
                            <span title="点击可查看分配详情" class="operate" @click="particulars(item,1,'查看分配详情')">分配详情</span>
                        </div>
                    </td>
                </tr>
            </template>
            </tbody>
        </ui-table>
        <export-field :param="export_model_type" v-model="exportVisable" :fields="fields" :templates="templates"
                      @getTemplate="get_templates" title="请选择自定义导出字段" :creat-excel="creat_excel"></export-field>
        <export-dialog v-model="export_visible"></export-dialog>
        <add-supplier v-model="showDialog" :supplier-data="supplierData" :advice_id="supplierId"
                      @update_supplier="update_supplier"></add-supplier>
        <look-check v-model="dialogShow" :title="title"
                    @update="update"
                    :detail-data="detailData"
                    :check-show="checkShow" @close="close" :edit-show="editShow"></look-check>
        <reason-phrase v-model="inputDialog" @update-data="update_data" :title="inputTitle"
                       :playcehoder="inputPlaceholder" :add-id="operationId" :execute="execute"></reason-phrase>
        <see-details v-model="stockingAdviceDialog" @update-remark="update_remark" :form="stockingAdviceData"
                     :title="operationTitle" :first-loading="detailsFirstLoading"
                     :loading="detailsLoading"></see-details>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
    </el-row>
</template>
<style lang="stylus" scoped>
    .create-purchasing-cal {
        position: relative;
        top: -2px;
    }

    .el-table th.gutter {
        display: table-cell !important;
    }

    .el-table colgroup.gutter {
        display: table-cell !important;
    }

    .p-index {
        .p-purchasing {
            .local-repository {
                padding: 0;
            }

            .el-dropdown .el-button-group {
                display: inline-block;
                position: relative;
                top: -1px;
            }

            .p-suggest-td-text {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

    .available-list {
        display: flex;
        flex-flow: row wrap;
        border-bottom: 1px solid;
        border-bottom-color: #e0e6ed;
        flex: 1;

        &:last-child {
            border-buttom: none;
        }

        .warehouse {
            width: 70%;
            text-align: right;
        }

        .quantity {
            width: 30%;
            text-align: left;
        }
    }

    .td-allot {
        padding: none;

    }

    .allot-list {
        border-bottom: 1px solid;
        border-bottom-color: #e0e6ed;
    }

    .purchasing {
        .color-red {
            color: red !important;
        }

        .template.secTable {
            .span {
                color: red;
            }

            .td-relative {
                text-align: left;
                position: relative;

                .span-absolute {
                    position: absolute;
                    top: 5px;
                    right: 40%;
                }
            }

            .png:hover {
                cursor: pointer;
            }

            .p-sku_name-cell {
                display: -webkit-box;
                overflow: hidden;
                white-space: normal !important;
                text-overflow: ellipsis;
                word-wrap: break-word;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
            }

            .error-color {
                border: 1px solid red;
            }

            .detail {
                float: left;
                border: 1px solid #000;

                p {
                    float: left;
                    border: 1px solid red;
                }
            }
        }
    }
</style>
<script>
    import {mapGetters, mapActions} from 'vuex';
    import {api_goods_export_template} from "@/api/product-library";
    import {downloadFile} from '../../../lib/http';
    import {
        getUser,
        purchasing_add,
        purchasing_plan,
        reset_proposal_status,
        api_purchasing_currency,
        api_updata_proposal_arg,
        api_warehous_transit,
        api_updata_before_create_plan,
        api_supplier_delivery,
        api_purchaseing_export,
        url_purchasing_add,
        url_purchasing_plan,
        url_reset_proposal_status,
        url_purchasing_cal,
        url_updata_proposal_arg,
        url_purchaseing_export,
        api_purchase_proposal_delete,
        url_purchase_proposal_delete,
        api_stocking_advice,
        url_stocking_advice,
        url_develop_review,
        url_batch_develop_rejecet,
        url_stocking_advice_develop_processing_plan,
        url_distribution_details,
        api_batch_develop_review,
        url_batch_develop_review,
        api_stocking_advice_export,
        api_stocking_advice_develop_processing_plan,
        api_stocking_check_purchase_price,
        api_export_title,
        api_distribution_details
    } from '../../../api/purchasing'
    import {api_stocking_look} from '@/api/stocking';

    const handleOptions = [  //全部
        {label: '查看', value: 0, api: url_stocking_advice},
        {label: '审核', value: 1, api: url_develop_review},
        {label: '驳回', value: 2, api: url_batch_develop_rejecet}
    ];
    export default {
        permission: {
            url_purchasing_add,
            url_purchasing_plan,
            url_reset_proposal_status,
            url_purchasing_cal,
            url_updata_proposal_arg,
            url_purchaseing_export,
            url_purchase_proposal_delete,
            url_stocking_advice,
            url_batch_develop_rejecet,
            url_develop_review,
            url_batch_develop_review,
            url_stocking_advice_develop_processing_plan,
            url_distribution_details
        },
        page: {
            devinfo: {
                frontEnd: '徐梦娇;黎宏珍',
                backEnd: '杨伟权;谭斌',
                createTime: '2017-1-12',
                updateTime: '2017-8-22'
            }
        },
        data() {
            return {
                detailsLoading: true,
                detailsFirstLoading: true,
                exportVisable: false,
                export_visible: false,
                inputDialog: false,
                inputTitle: '',
                fields: [],
                templates: [],
                export_model_type: {
                    type: 3
                },
                inputPlaceholder: '',
                purchaseAmount: 0,
                cannibalizeNum: 0,
                transferWarehouseLock: 0,
                title: "",
                detailData: [],
                dialogShow: false,
                checkShow: true,
                editShow: true,
                execute: 1,
                export_type: '',
                operationId: '',
                goodsDialog: false,
                show: true,
                checkAll: false,
                showDialog: false,
                stockingAdviceDialog: false,
                operationTitle: '',
                stockingAdviceData: {},
                buyer: [],
                supplierId: 0,
                purchaserId: 0,
                supplierData: [],
                classData: {},
                fileCode: "",
                partAllOptions: [{name: "部分导出", value: 0}, {name: "全部导出", value: 1}],
                imgPath: '',
                imgDialog: false
            }
        },
        created() {

        },
        mounted() {
            this.get_fields();
            this.get_templates();
            this.$http(getUser).then(res => {
                this.buyer = res;
            }).catch(code => {
                this.$message({type: 'error', message: code.message || code});
            })
        },
        methods: {
            close() {
                this.checkShow = false;
                this.editShow = false;

            },
            update() {

            },
            isRed(val) {
                return val === '卖完下架' || val === '停售' || val === "缺货"
            },
            // 查看备货计划详细信息
            checkTheStockPlan(id) {
                this.$http(api_stocking_look, id).then(res => {
                    this.detailData = res;
                    this.dialogShow = true;
                    this.checkShow = false;
                    this.editShow = false;
                    this.title = `查看备货申请单：${res.code} 信息`;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            /*操作不同的弹框*/
            handles(row, val) {
                switch (val.value) {
                    case 0:            //查看
                        this.stocking_advice(row, 1);
                        this.operationTitle = "查看备货建议";
                        this.stockingAdviceDialog = true;
                        break;
                    case 1:            //审核---多传一个参数区分!
                        this.stocking_advice(row, 1, '审核');
                        this.operationTitle = "审核备货建议";
                        this.stockingAdviceDialog = true;
                        break;
                    case 2:            //驳回
                        this.inputDialog = true;
                        this.inputTitle = "驳回计划";
                        this.operationId = [{sku_id: row.sku_id, transit_warehouse_id: row.transit_warehouse_id}];
                        this.execute = 1;
                        this.inputPlaceholder = "请填写驳回批注";
                        break;
                }
            },
            update_remark(val) {
                this.stockingAdviceData.list.forEach(row => {
                    this.$set(row, 'remark', val);
                });
            },
            filterOptions(status) {
                return handleOptions.filter(row => this.$hasPermission(row.api));
            },
            get_fields() {
                this.$http(api_export_title).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            get_templates() {
                this.$http(api_goods_export_template, {type: 3}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    });
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            creat_excel(param) {
                let fields = param.field.join(',');
                let data = '';
                switch (this.export_type) {
                    case 0://部分
                        data = {
                            ids: JSON.stringify(this.selects.map(row => {
                                if (typeof row === 'object') {
                                    return row.id
                                } else {
                                    return row
                                }
                            })),
                            export_type: this.export_type
                        };
                        Object.assign(data, this.init_params());
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
                return this.$http(api_stocking_advice_export, params, head).then(res => {
                    if (res.join_queue === 1) {
                        this.export_visible = true;
                        this.$message({type: "success", message: res.file_name});
                    } else {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let data = {
                            file_code: res.file_code,
                            page: this.searchData.page,
                            pageSize: this.searchData.pageSize
                        };
                        downloadFile({
                            url: url,
                            get: data,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                    }
                    this.$message({type: "success", message: res.file_name});
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
                return Promise.resolve();
            },
            export_excel(val) {
                if (val.value === 2 && this.selects.length <= 0) return this.$message({
                    type: "warning",
                    message: "请先选择需要导出的数据"
                });
                this.export_type = val.value;
                this.exportVisable = true;
            },
            init_params() {
                let data = window.clone(this.searchData);
                if (data.batchText) {
                    let cur = data.batchText.trim().replace(new RegExp(' ', 'gm'), '\n').trim().split('\n').map(row => row.trim()).filter(row => row !== '');
                    data.sku = cur.map(row => {
                        return row.trim();
                    });
                }
                this.$delete(data, 'batchText');
                if (this.searchData.date_b) {
                    data.date_b = datef("YYYY-MM-dd", this.searchData.date_b / 1000)
                } else {
                    data.date_b = "";
                }
                if (this.searchData.date_e) {
                    data.date_e = datef("YYYY-MM-dd", this.searchData.date_e / 1000)
                } else {
                    data.date_e = "";
                }
                return data
            },
            sku_image(images) {
                if (!!images) {
                    return images.replace('_60x60.', '_200x200.')
                }
                return ""
            },
            delivery_time(item) {
                let deliveryTime = '';
                this.$http(api_supplier_delivery, {
                    sku_id: item.sku_id,
                    supplier_id: item.supplier_id,
                    warehouse_id: item.warehouse_id
                }).then(res => {
                    deliveryTime = res;
                    return deliveryTime;
                });
            },
            //详情查看
            particulars(row, val, describe) {
                switch (val) {
                    case 1:
                        if (describe === "查看审核备货总数") {
                            this.operationTitle = describe;
                            this.stocking_advice(row, 2);
                        } else if (describe === "查看分配详情") {
                            this.distribution_details(row.id);
                            this.operationTitle = describe;
                        } else {
                            this.stocking_advice(row, 1);
                            this.operationTitle = "查看备货总量详情";
                        }
                        break;
                    case 2:
                        this.stocking_advice(row, 1);
                        this.operationTitle = "查看备货建议";
                        break;
                    case 3:
                        this.stocking_advice(row, 2);
                        this.operationTitle = "查看审核备货总数";
                        break;
                }
                this.stockingAdviceDialog = true;
            },
            stocking_advice(row, val, str) {
                let data = {
                    type: val,
                    transit_warehouse_id: row.transit_warehouse_id ? row.transit_warehouse_id : 0
                };
                this.$http(api_stocking_advice, row.sku_id, data).then(res => {
                    if (str) {    //为审核添加一个字段
                        this.stockingAdviceData = res;
                        this.stockingAdviceData.list.forEach(row => {
                            this.$set(row, 'remark', '');
                            this.$set(row, 'new_quantity', row.in_quantity);
                            this.$set(row, 'isRequired', false);   //是否验证或批注
                            this.$set(row, 'isBeyond', false);   //是否超过审批量
                            this.$set(row, 'isEmpty', false);   //是否为空
                        });
                    }
                    this.stockingAdviceData = res
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            // 分配详情
            distribution_details(id) {
                this.$http(api_distribution_details, id).then(res => {
                    this.detailsLoading = false;
                    this.detailsFirstLoading = false;
                    this.stockingAdviceData = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            // 批量处理
            processing_plan() {
                let list = [];
                let data = {
                    process_list: []
                };
                let updata_plan = window.clone(this.dataTable);
                updata_plan.forEach(data => {
                    let dataCheckList = data.dataList.filter(item => item.isCheck && !item.isDiable);
                    data.process_list = dataCheckList.map(item =>{
                        let available_list =item.available_list.map(available => {
                            return {
                                warehouse_id: parseInt(available.id),
                                quantity: available.new_quantity
                            }
                        });
                        list.push({
                            sku_id: item.sku_id,
                            warehouse_id: item.warehouse_id,
                            supplier_id: item.supplier_id,
                            transit_warehouse_id: item.transit_warehouse_id,
                            transit_quantity: item.transit_quantity,
                            available_list,
                            purchase_num: item.purchase_num,
                            purchase_price: item.buying_price,
                            currency_code: item.buying_price_code,
                        })
                    })
                });
                data.process_list = list;
                this.$http(api_stocking_check_purchase_price, data).then(res => {// 判断 有没有sku采购价格为0的数据 (0 = 没有sku采购价格为0的数据， 1 = 存在采购价格为0的数据)
                    if (res.status === 0) {
                        this.$confirm('此操作为批量处理计划，确认此操作吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$http(api_stocking_advice_develop_processing_plan, data).then(res => {
                                this.$emit('update-data');
                                res.success_num === 0 ? this.show_message(res, 'error') : this.show_message(res, 'success');
                            }).catch(code => {
                                this.$message({type: 'error', message: code.message || code});
                            }).finally(() => {
                                this.$reqKey('url_stocking_advice_develop_processing_plan', false);
                            });
                        }).catch(() => {
                            this.$message({type: 'info', message: '已取消'});
                        }).finally(() => {
                            this.$reqKey('url_stocking_advice_develop_processing_plan', false);
                        });
                    } else {
                        this.$confirm(`${res.message}`, '提示', {
                            confirmButtonText: '继续采购',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$http(api_stocking_advice_develop_processing_plan, data).then(res => {
                                this.$emit('update-data');
                                res.success_num === 0 ? this.show_message(res, 'error') : this.show_message(res, 'success');
                            }).catch(code => {
                                this.$message({type: 'error', message: code.message || code});
                            }).finally(() => {
                                this.$reqKey('url_stocking_advice_develop_processing_plan', false);
                            })
                        }).catch(() => {
                            this.$message({type: 'info', message: '已取消'});
                        }).finally(() => {
                            this.$reqKey('url_stocking_advice_develop_processing_plan', false);
                        });
                    }
                }).catch(code => {
                    this.$message({type: 'warning', message: code.message || code});
                }).finally(() => {
                    this.$reqKey('url_stocking_advice_develop_processing_plan', false);
                });
            },
            show_message(info, type) {//换行的提示
                if (info.message) {
                    let arr = info.message.split("\n");
                    let newDatas = [];
                    const h = this.$createElement;
                    for (let i in arr) {
                        newDatas.push(h('p', null, arr[i]));
                    }
                    this.$msgbox({title: '提示', type, message: h('div', null, newDatas) || info});
                } else {
                    this.$message({type, message: info.message || info});
                }
            },
            sort_click(val) {
                this.$emit("sort-click", val);
            },
            //------------全选反选
            changeAll(val) {
                if (this.changeStatus === 4 || this.changeStatus === 5) {
                    this.dataTable.forEach(data => {
                        data.isChecks = val;
                        data.dataList.forEach(item => {
                            item.isCheck = val
                        })
                    });
                } else {
                    this.dataTable.forEach(data => {
                        data.isCheck = val
                    });
                }
            },
            changeOne() {
                if (this.changeStatus === 4 || this.changeStatus === 5) {
                    this.dataTable.forEach(data => {
                        if (data.dataList.every(item => item.isCheck === true)) {
                            data.isChecks = true;
                        } else {
                            data.isChecks = false;
                        }
                    });
                    this.dataTable.filter(row => row.isChecks).length === this.dataTable.length ? this.checkAll = true : this.checkAll = false;
                } else {  //-----------------------更换维度处理表格数据
                    this.dataTable.filter(row => row.isCheck).length === this.dataTable.length ? this.checkAll = true : this.checkAll = false;
                }
            },
            change_list() {
                this.dataTable.forEach(data => {
                    if (data.isChecks) {
                        data.dataList.forEach(item => {
                            item.isCheck = true;
                        })
                    } else {
                        data.dataList.forEach((item) => {
                            item.isCheck = false;
                        })
                    }
                });
                this.dataTable.filter(row => row.isChecks).length === this.dataTable.length ? this.checkAll = true : this.checkAll = false;
            },
            addClass(data) {
                this.classData = data;
            },
            //-------批量审批操作
            batchApproval() {
                let listId = [];
                let data = {};
                this.dataTable.forEach(data => {
                    data.dataList.forEach(item => {
                        if (item.isCheck && !item.isDiable) {
                            listId.push({sku_id: item.sku_id, transit_warehouse_id: item.transit_warehouse_id});
                        }
                    })
                });
                data = {
                    review_list: listId,
                    remark: ''
                };
                this.$confirm('此操作为批量审核通过勾选的数据，审核备货数量将与备货计划的备货数量一致，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_batch_develop_review, data).then(res => {
                        this.$message({type: 'success', message: res.message});

                        // 审批通过更新数据
                        this.$emit("update-data")
                    }).catch(code => {
                        this.$reqKey('url_batch_develop_review', false);
                        this.$message({type: 'error', message: code.message || code});
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                    this.$reqKey('url_batch_develop_review', false);
                });
            },
            goods_submit(val) {
                let skuId = [];
                val.forEach(data => {
                    data.forEach(row => {
                        skuId.push(row.id)
                    })
                });
                let addData = {
                    sku_id: skuId.join(',')
                };
                this.$http(purchasing_add, addData).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.$emit('update-data');
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            // --------批量驳回操作
            batchRejected(val) {
                let listId = [];
                this.dataTable.forEach(data => {
                    data.dataList.forEach(item => {
                        if (item.isCheck && !item.isDiable) {
                            listId.push({sku_id: item.sku_id, transit_warehouse_id: item.transit_warehouse_id});
                        }
                    })
                });
                this.inputDialog = true;
                this.inputTitle = "批量驳回计划";
                this.execute = val;
                this.operationId = listId;
                this.inputPlaceholder = "请填写驳回批注";
                this.$reqKey('url_batch_develop_rejecet', false)
            },
            add_supplier(data) {
                this.showDialog = true;
                this.supplierId = data.id;
                let skuId = {
                    sku_id: data.sku_id
                };
                this.$http(api_purchasing_currency, skuId).then(res => {
                    if (res.message) {
                        this.supplierData = res.message;
                    }
                }).catch(code => {
                    this.supplierData = [];
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            add_buyer(item) {
                this.purchaserId = item.id;
                item.select = true;
                this.show = false;
                item.isChange = true;
            },
            // 取中转仓调拨总数
            quantity_total(item) {
                let val = 0;
                for (let a in item.available_list) {
                    let new_num = parseInt(item.available_list[a].new_quantity);
                    let old_num = parseInt(item.available_list[a].quantity);
                    if (new_num > old_num) {
                        new_num = old_num
                    }
                    val += new_num
                }
                return val
            },
            update_transit_quantity(item) {
                let val = 0;
                for (let a in item.available_list) {
                    let new_num = parseInt(item.available_list[a].new_quantity);
                    let old_num = parseInt(item.available_list[a].quantity);
                    if (new_num > old_num) {
                        new_num = old_num
                    }
                    val += new_num
                }
                this.dataTable.forEach(res => {
                    res.dataList.forEach(row => {
                        if (row.id === item.id) {
                            // 审核备货总数-中转仓锁定库存-调拨数量
                            let num = parseInt(row.sku_in_quantity) - parseInt(row.transit_quantity) - val;
                            if (num >= row.min_qty) {
                                this.$set(row, 'purchase_num', num)
                            } else {
                                this.$set(row, 'purchase_num', 0)
                            }
                        }
                    });
                })
            },
            update_quantity_num(item) {
                let val = 0;
                for (let a in item.available_list) {
                    let new_num = parseInt(item.available_list[a].new_quantity);
                    let old_num = parseInt(item.available_list[a].quantity);
                    if (new_num > old_num) {
                        new_num = old_num
                    }
                    val += new_num
                }
                this.dataTable.forEach(res => {
                    res.dataList.forEach(row => {
                        if (row.id === item.id) {
                            // 审核备货总数-中转仓锁定库存-调拨数量
                            let num = parseInt(row.sku_in_quantity) - parseInt(row.transit_quantity) - val;
                            if (num >= row.min_qty) {
                                this.$set(row, 'purchase_num', num)
                            } else {
                                this.$set(row, 'purchase_num', 0)
                            }
                        }
                    });
                })
            },
            update_purchase_num(item) {
                let val = 0;
                for (let a in item.available_list) {
                    let new_num = parseInt(item.available_list[a].new_quantity);
                    let old_num = parseInt(item.available_list[a].quantity);
                    if (new_num > old_num) {
                        new_num = old_num
                    }
                    val += new_num
                }
                this.dataTable.forEach(res => {
                    res.dataList.forEach(row => {
                        if (row.id === item.id) {
                            // 审核备货总数-中转仓锁定库存-调拨数量
                            let num = parseInt(row.sku_in_quantity) - parseInt(row.transit_quantity) - val;
                            if (parseInt(item.purchase_num) > 0 && parseInt(item.purchase_num) < num) {
                                // 不做任何操作
                            } else {
                                if (item.purchase_num < item.min_qty) {
                                    this.$message({type: 'warning', message: "采购量不能小于最小起订量,或为0"});
                                    this.$set(row, 'purchase_num', 0)
                                } else {
                                    if (num >= row.min_qty) {
                                        this.$set(row, 'purchase_num', num)
                                    } else {
                                        this.$set(row, 'purchase_num', 0)
                                    }
                                }
                            }
                        }
                    });
                });
            },
            update_supplier(checkSupplier) {
                this.show = false;
                this.dataTable.forEach(res => {
                    res.dataList.forEach(data => {
                        if (this.supplierId === data.id) {
                            data.supplier = checkSupplier[0].company_name;
                            data.supplier_id = checkSupplier[0].supplier_id;
                            data.buying_price = checkSupplier[0].audited_price;
                            data.min_qty = checkSupplier[0].min_qty;
                            data.isChange = true;
                        }
                    });
                });
            },
            updateFun() {
                let data = [];
                this.dataTable.forEach(res => {
                    res.dataList.forEach(item => {
                        if (item.isChange === true) {
                            let dataTable = {
                                id: item.id,
                                purchase_qty: item.purchase_qty,
                                purchase_price: item.purchase_price,
                                purchaser_id: item.purchaser_id,
                                supplier_id: item.supplier_id,
                            };
                            data.push(dataTable);
                        }
                    });
                });
                this.$http(api_updata_proposal_arg, {data_json: data}).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.show = true;
                    this.dataTable.forEach(res => {
                        res.dataList.forEach(item => {
                            if (item.isChange === true) {
                                if (item.supplier !== res.supplier) {
                                    this.$emit('update-data');
                                    return;
                                }
                                item.select = false;
                                item.purchase_price = Number(item.purchase_price).toFixed(3);
                                let name = this.purchasers.find(row => row.id === item.purchaser_id);
                                if (!!name) {
                                    item.purchaser = name.realname;
                                }
                            }
                        })
                    })
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('url_updata_proposal_arg', false);
                    }, 200);
                });
            },
            search_img(image) {
                this.imgPath = image.replace("_60x60", "_500x500");
                this.imgDialog = true;
            },
            update_data(val) {
                this.$emit('update-data');
            }
        },
        filters: {
            filterAlias(val) {
                return Array.isArray(val) ? val.join(',') : val
            },
            supplierFilter(val) {
                if (val) {
                    if (val === 0) {
                        return '';
                    } else {
                        return val;
                    }
                } else {
                    return '未指定';
                }
            },
            dailyFilter(val) {
                if (val === 0) {
                    return 0.000;
                } else {
                    return Number(val).toFixed(3);
                }
            },
            filterDate(val) {
                if (val > 0) {
                    return datef("YYYY-MM-dd HH:mm:ss", val);
                } else {
                    return val;
                }
            }
        },
        watch: {
            stockingAdviceDialog(val) {
                if (!val) {
                    this.stockingAdviceData = [];
                }
            },
            'dataTable'(val) {
                if (this.changeStatus === 4 || this.changeStatus === 5) {
                    val.forEach(res => {
                        res.dataList.map(item => {
                            item.old_purchase_price = item.purchase_price;
                            item.old_purchase_qty = item.purchase_qty;
                            item.old_min_qty = item.min_qty;
                            item.inventory_balance = item.available_stock_qty + item.intransit_stock_qty - item.unpicking_goods_qty;
                            if (item.purchase_qty === 0) {
                                item.purchase_qty = item.proposal_qty;
                            }
                            return item;
                        })
                    })
                }
            }
        },
        computed: {
            ...mapGetters({purchasers: 'api/purchasers'}),
            isShow() {
                return this.changeStatus === 4 || this.changeStatus === 5
            },
            filterHeads() {
                switch (this.changeStatus) {
                    case 4:
                        return [
                            {isCheck: true, width: 2},
                            {label: '图片', size: 70},
                            {label: '产品SKU/别名', width: 9},
                            {label: '产品名称', width: 11},
                            {label: 'SKU状态', width: 4},
                            {label: '日均销量', width: 4},
                            {label: '在途库存', width: 4},
                            {label: '备货仓库', width: 4},
                            {label: '备货仓库可用库存', width: 6},
                            {label: '中转仓', width: 5},
                            {label: '中转仓可用库存', width: 6},
                            {label: '备货数量', width: 5},
                            {label: '本地仓可用库存', width: 10},
                            {label: '采购价格', width: 5},
                            {label: '采购员', width: 5},
                            {label: '开发员', width: 5},
                            {label: '操作', width: 6}
                        ];
                    case 5:
                        return [
                            {isCheck: true, width: 2},
                            {label: '图片', size: 70},
                            {label: '产品SKU/别名', width: 8},
                            {label: '产品名称', width: 11},
                            {label: 'SKU状态', width: 4},
                            {label: '日均销量', width: 4},
                            {label: '在途库存', width: 4},
                            {label: '最小起订量', width: 5},
                            {label: '中转仓', width: 4},
                            {label: '审核备货数量', width: 5},
                            {label: '中转仓可用库存', width: 5},
                            {label: '中转仓锁定库存', width: 6},
                            {label: '本地仓可用库存', width: 10},
                            {label: '调拨数量', width: 5},
                            {label: '采购数量', width: 5},
                            {label: '供应商', width: 8},
                            {label: '采购价格', width: 7},
                            {label: '采购员', width: 6}
                        ];
                    case 6:
                        return [
                            {isCheck: true, width: 2},
                            {label: '备货计划', width: 7},
                            {label: '图片', size: 70},
                            {label: '产品SKU/别名', width: 9},
                            {label: '产品名称', width: 11},
                            {label: 'SKU状态', width: 4},
                            {label: '备货仓库', width: 4},
                            {label: '中转仓', width: 4},
                            {label: '申请备货数量', width: 4},
                            {label: '审核备货数量', width: 4},
                            {label: '已处理数量', width: 5},
                            {label: '驳回数量', width: 4},
                            {label: '供应商', width: 12},
                            {label: '采购价格', width: 5},
                            {label: '采购员', width: 5},
                            {label: '开发员', width: 5},
                            {label: '创建人', width: 5},
                            {label: '操作', width: 6}
                        ];
                    case 13:
                        return [
                            {isCheck: true, width: 2},
                            {label: '备货计划', width: 7},
                            {label: '图片', size: 70},
                            {label: '产品SKU/别名', width: 13},
                            {label: '产品名称', width: 11},
                            {label: 'SKU状态', width: 4},
                            {label: '备货仓库', width: 10},
                            {label: '中转仓', width: 5},
                            {label: '备货数量', width: 5},
                            {label: '供应商', width: 12},
                            {label: '采购员', width: 5},
                            {label: '开发员', width: 5},
                            {label: '创建人', width: 5},
                            {label: '批注', width: 16}
                        ];
                    case 12:
                        return [
                            {isCheck: true, width: 2},
                            {label: '备货计划', width: 7},
                            {label: '图片', size: 70},
                            {label: '产品SKU/别名', width: 9},
                            {label: '产品名称', width: 11},
                            {label: 'SKU状态', width: 4},
                            {label: '备货仓库', width: 4},
                            {label: '中转仓', width: 5},
                            {label: '申请备货数量', width: 5},
                            {label: '审核备货数量', width: 4},
                            {label: '驳回数量', width: 4},
                            {label: '供应商', width: 12},
                            {label: '采购员', width: 5},
                            {label: '开发员', width: 5},
                            {label: '创建人', width: 5},
                            {label: '驳回理由', width: 16}
                        ];
                    default:
                        return [];
                }
            },
            supplierColspan() {
                switch (this.changeStatus) {
                    case 4:
                        return 17;
                    case 5:
                        return 17;
                    case 6:
                        return 15;
                    case 13:
                        return 12;
                    case 12:
                        return 13;
                    default:
                        return 17;
                }
            },
            isDisabled() {
                let find = this.dataTable.find(data => !!data.dataList.find(item => item.isCheck && !item.isDiable));
                return !find;
            },
            tableLength() {
                let tempArr = [];
                this.dataTable.forEach(data => {
                    data.dataList.forEach(item => {
                        tempArr.push(item)
                    })
                });
                return tempArr;
            },
            titleName() {
                let listId = [];
                this.dataTable.forEach(data => {
                    data.dataList.forEach(item => {
                        if (item.isCheck && !item.isDiable) {
                            listId.push(item.id)
                        }
                    })
                });
                if (listId.length <= 0) {
                    return `导出所有采购建议数据`;
                } else {
                    return `导出部分采购建议数据`;
                }
            },
            selects() {
                let ids = [];
                if (this.changeStatus === 4 || this.changeStatus === 5) {
                    this.dataTable.forEach(data => {
                        data.dataList.forEach(item => {
                            if (item.isCheck && !item.isDiable) {
                                ids.push(item.id);
                            }
                        });
                    });
                    return ids
                } else {
                    this.dataTable.forEach(data => {
                        if (data.isCheck && !data.isDiable) {
                            ids.push(data.id);
                        }
                    });
                    return ids
                }
            }
        },
        props: {
            dataTable: {},
            changeStatus: {
                required: true,
                type: Number
            },
            searchData: {},
            loading: {
                required: true,
                type: Boolean
            },
            time: {},
            firstLoading: {
                required: true,
                type: Boolean
            }
        },
        components: {
            addSupplier: require('./add-supplier').default,
            uiTable: require('@/components/ui-table').default,
            seeDetails: require('./see-details').default,
            uiTips: require('@/components/ui-tip').default,
            purchaser: require('@/api-components/purchaser').default,
            download: require('@/components/download').default,
            trendsSelect: require('@/components/trends-select').default,
            uiLimitNumber: require('@/components/ui-limit-number').default,
            blowupImage: require("@/components/blowup-image").default,
            lookCheck: require('./look-check.vue').default,
            reasonPhrase: require('./reason-phrase').default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('@/view/report/export-dialog').default,
        }
    }
</script>
