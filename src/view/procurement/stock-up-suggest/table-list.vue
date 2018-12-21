<template>
    <el-row class="p-purchasing">
        <div class="ml-sm mt-sm mb-sm">
            <permission tag="trendsSelect"
                        class="inline ml-xs mr-xs"
                        v-if="searchData.status===2||searchData.status===3||searchData.status===4"
                        type="primary"

                        :route="apis.url_purchaseing_export"
                        :selects="partAllOptions"
                        @trigger="export_excel"></permission>
            <permission
                tag="ElButton"
                :route="apis.url_purchasing_add"
                type="primary"
                v-if="searchData.status===0"
                :disabled="isDisabled"
                size="mini"
                @click="addGoods">批量审批通过</permission>
            <permission
                tag="request-button"
                :route="apis.url_reset_proposal_status"
                req-key="url_reset_proposal_status"
                v-if="searchData.status===0"
                :disabled="isDisabled"
                @click="recovery_plan_status">批量驳回
            </permission>
            <permission
                tag="request-button"
                :route="apis.url_purchasing_cal"
                req-key="url_purchasing_cal"
                :disabled="isDisabled"
                @click="creat_cal"
                class="inline create-purchasing-cal"
                v-if="searchData.status===1">生成计划
            </permission>
            <permission
                tag="request-button"
                :route="apis.url_purchasing_cal"
                req-key="url_purchasing_cal"
                :disabled="isDisabled"
                @click="creat_cal"
                class="inline create-purchasing-cal"
                v-if="searchData.status===1">驳回计划</permission>
            <permission
                tag="request-button"
                :route="apis.url_purchasing_cal"
                req-key="url_purchasing_cal"
                :disabled="isDisabled"
                @click="creat_cal"
                class="inline create-purchasing-cal"
                v-if="searchData.status===2">再次处理</permission>
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
            <template v-if="data.dataList.length>0" v-for="(data, index) in dataTable">
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
                        <td v-if="item.attribute.length>0">
                            <el-popover placement="right"
                                        trigger="hover">
                                <table class="template ui-table-head">
                                    <tr>
                                        <th v-for="(row,index) in item.attribute" :key="row.name">
                                            <span>{{row.name}}</span>
                                        </th>
                                    </tr>
                                    <tr>
                                        <td v-for="(row,index) in item.attribute" :key="row.name">
                                            <span>{{row.value}}</span>
                                        </td>
                                    </tr>
                                </table>
                                <span slot="reference">
                                    <span class="p-purchasing-td-text" :title="item.sku">{{item.sku}}</span>
                                </span>
                            </el-popover>
                            <div class="p-purchasing-td-text" :title="item.sku_alias|filterAlias">
                                {{item.sku_alias|filterAlias}}
                            </div>
                        </td>
                        <td v-else>
                            <div class="p-purchasing-td-text" :title="item.sku">{{item.sku}}</div>
                            <div class="p-purchasing-td-text" :title="item.sku_alias|filterAlias">
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
                                :class="isRed(item.sku_status_label)?'color-red p-purchasing-td-text':'p-purchasing-td-text'"
                                :title="item.sku_status_label">{{item.sku_status_label}}
                            </div>
                        </td>
                        <template v-if="changeStatus===0">
                            <!--日均销量-->
                            <td>
                                <div class="p-purchasing-td-text" :title="item.warehouse">{{item.warehouse}}</div>
                            </td>
                            <!--在途库存-->
                            <td>{{item.delivery_time}}</td>
                            <!--备货仓库-->
                            <td>{{item.available_qty}}</td>
                            <!--备货仓库可用库存-->
                            <td>{{item.ready_quantity}}</td>
                            <!--中转仓-->
                            <td>{{item.intransit_stock_qty}}</td>
                            <!--中转仓可用库存-->
                            <td>
                                <div class="inline">
                                    <span v-if="item.daily_sale" title="点击可查看图表详情" class="operate" @click="analyze(item)">{{item.daily_sale|dailyFilter}}</span>
                                    <div class="daily_sale" v-else title="无销售量">{{item.daily_sale}}</div>
                                </div>
                            </td>
                            <!--总申请备货数量-->
                            <td>{{item.unpicking_goods_qty}}</td>
                            <!--本地仓可用库存-->
                            <td>{{item.due_quantity}}</td>
                            <!--采购价格-->
                            <td>
                                <div v-if="searchData.created_plan_status===0">
                                    <span v-if="item.currency_code">{{item.currency_code}}&nbsp;</span>
                                    <ui-limit-number v-model="item.purchase_price"
                                                     style="width:80px"
                                                     @change="update_price(item)"
                                                     :disabled="item.isDiable"
                                                     :limit="3"
                                                     class="inline"
                                                     :min="0">
                                    </ui-limit-number>
                                </div>
                                <div v-else>
                                    <span v-if="item.currency_code">{{item.currency_code}}&nbsp;</span>
                                    <span>{{item.purchase_price}}</span></div>
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
                                          v-else>{{item.purchaser|supplierFilter}}</span>
                                </div>
                                <div v-else>{{item.purchaser|supplierFilter}}</div>
                            </td>
                            <!--操作-->
                            <td>
                                <div v-if="searchData.created_plan_status===0">
                                    <purchaser ref="purchaser" v-if="item.select" class="inline" v-model="item.purchaser_id"
                                               style="width: 100px"></purchaser>
                                    <span class="operate" @click="add_buyer(item)"
                                          v-else>{{item.purchaser|supplierFilter}}</span>
                                </div>
                                <div v-else>{{item.purchaser|supplierFilter}}</div>
                            </td>
                        </template>
                        <template v-if="changeStatus===1">
                            <!--日均销量-->
                            <td>
                                <div class="p-purchasing-td-text" :title="item.warehouse">{{item.warehouse}}</div>
                            </td>
                            <!--在途库存-->
                            <td>{{item.delivery_time}}</td>
                            <!--最小起订量-->
                            <td>{{item.available_qty}}</td>
                            <!--中转仓-->
                            <td>{{item.intransit_stock_qty}}</td>
                            <!--总审核备货数量-->
                            <td>{{item.ready_quantity}}</td>
                            <!--中转仓可用库存-->
                            <td>
                                <div class="inline">
                                    <span v-if="item.daily_sale" title="点击可查看图表详情" class="operate" @click="analyze(item)">{{item.daily_sale|dailyFilter}}</span>
                                    <div class="daily_sale" v-else title="无销售量">{{item.daily_sale}}</div>
                                </div>
                            </td>
                            <!--中转仓锁定库存-->
                            <td>{{item.unpicking_goods_qty}}</td>
                            <!--本地仓可用库存-->
                            <td>{{item.due_quantity}}</td>
                            <!--调拨数量-->
                            <td>{{item.due_quantity}}</td>
                            <!--采购数量-->
                            <td>{{item.due_quantity}}</td>
                            <!--供应商-->
                            <td>
                                <div style="cursor: pointer;" v-if="searchData.created_plan_status===0">
                                    <span class="operate p-sku_name-cell" @click="add_supplier(item)">{{item.supplier|supplierFilter}}</span>
                                </div>
                                <div v-else class="p-purchasing-td-text" :title="item.supplier|supplierFilter">
                                    {{item.supplier|supplierFilter}}
                                </div>
                            </td>
                            <!--采购价格-->
                            <td>
                                <div v-if="searchData.created_plan_status===0">
                                    <span v-if="item.currency_code">{{item.currency_code}}&nbsp;</span>
                                    <ui-limit-number v-model="item.purchase_price"
                                                     style="width:80px"
                                                     @change="update_price(item)"
                                                     :disabled="item.isDiable"
                                                     :limit="3"
                                                     class="inline"
                                                     :min="0">
                                    </ui-limit-number>
                                </div>
                                <div v-else>
                                    <span v-if="item.currency_code">{{item.currency_code}}&nbsp;</span>
                                    <span>{{item.purchase_price}}</span></div>
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
                        </template>
                        <template v-if="changeStatus===2">
                            <!--最小起订量-->
                            <td>{{item.available_qty}}</td>
                            <!--中转仓-->
                            <td>{{item.intransit_stock_qty}}</td>
                            <!--总审核备货数量-->
                            <td>{{item.ready_quantity}}</td>
                            <!--中转仓锁定库存-->
                            <td>{{item.unpicking_goods_qty}}</td>
                            <!--本地仓调拨数量-->
                            <td>{{item.due_quantity}}</td>
                            <!--计划采购数量-->
                            <td>{{item.due_quantity}}</td>
                            <!--供应商-->
                            <td>
                                <div style="cursor: pointer;" v-if="searchData.created_plan_status===0">
                                    <span class="operate p-sku_name-cell" @click="add_supplier(item)">{{item.supplier|supplierFilter}}</span>
                                </div>
                                <div v-else class="p-purchasing-td-text" :title="item.supplier|supplierFilter">
                                    {{item.supplier|supplierFilter}}
                                </div>
                            </td>
                            <!--采购价格-->
                            <td>
                                <div v-if="searchData.created_plan_status===0">
                                    <span v-if="item.currency_code">{{item.currency_code}}&nbsp;</span>
                                    <ui-limit-number v-model="item.purchase_price"
                                                     style="width:80px"
                                                     @change="update_price(item)"
                                                     :disabled="item.isDiable"
                                                     :limit="3"
                                                     class="inline"
                                                     :min="0">
                                    </ui-limit-number>
                                </div>
                                <div v-else>
                                    <span v-if="item.currency_code">{{item.currency_code}}&nbsp;</span>
                                    <span>{{item.purchase_price}}</span></div>
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
                            <!--操作-->
                            <td>
                                <span class="operate">操作</span>
                            </td>
                        </template>
                        <template v-if="changeStatus===3">
                            <!--备货仓库-->
                            <td>{{item.available_qty}}</td>
                            <!--中转仓-->
                            <td>{{item.intransit_stock_qty}}</td>
                            <!--总申请备货数量-->
                            <td>{{item.intransit_stock_qty}}</td>
                            <!--采购价格-->
                            <td>
                                <div v-if="searchData.created_plan_status===0">
                                    <span v-if="item.currency_code">{{item.currency_code}}&nbsp;</span>
                                    <ui-limit-number v-model="item.purchase_price"
                                                     style="width:80px"
                                                     @change="update_price(item)"
                                                     :disabled="item.isDiable"
                                                     :limit="3"
                                                     class="inline"
                                                     :min="0">
                                    </ui-limit-number>
                                </div>
                                <div v-else>
                                    <span v-if="item.currency_code">{{item.currency_code}}&nbsp;</span>
                                    <span>{{item.purchase_price}}</span></div>
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
                                          v-else>{{item.purchaser|supplierFilter}}</span>
                                </div>
                                <div v-else>{{item.purchaser|supplierFilter}}</div>
                            </td>
                            <!--驳回理由-->
                            <td>
                                <span>驳回理由</span>
                            </td>
                        </template>
                        <template v-if="changeStatus===4">
                            <!--最小起订量-->
                            <td>{{item.available_qty}}</td>
                            <!--备货仓库-->
                            <td>{{item.available_qty}}</td>
                            <!--中转仓-->
                            <td>{{item.intransit_stock_qty}}</td>
                            <!--总审核备货数量-->
                            <td>{{item.intransit_stock_qty}}</td>
                            <!--采购价格-->
                            <td>
                                <div v-if="searchData.created_plan_status===0">
                                    <span v-if="item.currency_code">{{item.currency_code}}&nbsp;</span>
                                    <ui-limit-number v-model="item.purchase_price"
                                                     style="width:80px"
                                                     @change="update_price(item)"
                                                     :disabled="item.isDiable"
                                                     :limit="3"
                                                     class="inline"
                                                     :min="0">
                                    </ui-limit-number>
                                </div>
                                <div v-else>
                                    <span v-if="item.currency_code">{{item.currency_code}}&nbsp;</span>
                                    <span>{{item.purchase_price}}</span></div>
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
                                          v-else>{{item.purchaser|supplierFilter}}</span>
                                </div>
                                <div v-else>{{item.purchaser|supplierFilter}}</div>
                            </td>
                            <!--驳回理由-->
                            <td>
                                <span>驳回理由</span>
                            </td>
                        </template>
                    </tr>
                </template>
            </template>
            </tbody>
        </ui-table>
        <add-goods v-model="goodsDialog" ref="addGoods" @selected="goods_submit"></add-goods>
        <add-supplier v-model="showDialog" :supplier-data="supplierData"
                      @update_supplier="update_supplier"></add-supplier>
        <add-analyze v-model="analyzeDialog" :form="analyzeData"></add-analyze>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
    </el-row>
</template>
<style lang="stylus">
    .create-purchasing-cal {
        position: relative;
        top: -2px;
    }

    .p-index {
        .p-purchasing {
            .el-dropdown .el-button-group {
                display: inline-block;
                position: relative;
                top: -1px;
            }
            .p-purchasing-td-text {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
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
        .newly-increased {
            position: absolute;
            top: 0;
            left: -5px;
            width: 32px;
            height: 32px;
            background: url(../../../assets/new.svg) no-repeat center center;
            background-size: contain;
        }
    }
</style>
<script>
    import {mapGetters, mapActions} from 'vuex';
    import {downloadFile} from '../../../lib/http';
    import {
        getUser,
        purchasing_add,
        purchasing_plan,
        reset_proposal_status,
        api_purchasing_currency,
        api_updata_proposal_arg,
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
        url_purchase_proposal_delete
    } from '../../../api/purchasing'

    export default {
        permission: {
            url_purchasing_add,
            url_purchasing_plan,
            url_reset_proposal_status,
            url_purchasing_cal,
            url_updata_proposal_arg,
            url_purchaseing_export,
            url_purchase_proposal_delete
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
                goodsDialog: false,
                show: true,
                checkAll: false,
                showDialog: false,
                analyzeDialog: false,
                analyzeData: {},
                buyer: [],
                supplierId: 0,
                purchaserId: 0,
                supplierData: [],
                classData: {},
                fileCode: "",
                partAllOptions: [
                    {
                        name: "部分导出", value: 2, action: function () {
                            if (this.selects.length <= 0) return this.$message({
                                type: "warning",
                                message: "请先选择需要导出的数据"
                            });
                            let params = {
                                ids: JSON.stringify(this.selects.map(row => {
                                    if (typeof row === 'object') {
                                        return row.id
                                    } else {
                                        return row
                                    }
                                })),
                                export_type: 2,
                            };
                            Object.assign(params, this.init_params());
                            this.order_export(params);
                        }
                    },
                    {
                        name: "全部导出", value: 1, action: function () {
                            let params = this.init_params();
                            this.$set(params, 'export_type', 1);
                            this.order_export(params);
                        }
                    },
                ],
                imgPath: '',
                imgDialog: false
            }
        },
        mounted() {
            this.$http(getUser).then(res => {
                this.buyer = res;
            }).catch(code => {
                this.$message({type: 'error', message: code.message || code});
            })
        },
        methods: {
            isRed(val) {
                return val === '卖完下架' || val === '停售'
            },
            del_purchase_plan() {
                this.$confirm(`您将删除已勾选的采购计划，确定进行此操作?`, '提示', {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$http(api_purchase_proposal_delete, {ids: JSON.stringify(this.selects)}).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        this.selects.forEach(row => {
                            this.dataTable.forEach(item => {
                                let findIndex = item.dataList.findIndex(data => data.id === row);
                                if (findIndex >= 0) {
                                    item.dataList.splice(findIndex, 1);
                                }
                            });
                        });
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('del_purchase_plan', false)
                        }, 200);
                    })
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消"
                    })
                });
            },
            order_export(params) {
                return this.$http(api_purchaseing_export, params).then(res => {
                    if (res.status === 1) {
                        let params = {
                            page: this.searchData.page,
                            pageSize: this.searchData.pageSize,
                            file_code: res.file_code
                        };
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                        this.$message({type: 'success', message: res.message || res});
                    } else {
                        this.$message({type: 'error', message: res.message || res});
                    }
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            export_excel(val) {
                val.action.call(this, val);
            },
            init_params() {
                let data = window.clone(this.searchData);
                data.purchaser_id = data.purchaser_id.join(',');
                data.sku_status = data.sku_status.join(',');
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
            //数据分析（更改的需求）
            analyze(data) {
                this.analyzeData = {sku: data.sku, sku_id: data.sku_id, warehouse_id: data.warehouse_id};
                this.analyzeDialog = true;
            },
            //判断是否是 数组
            polyType(data) {
                if (data instanceof Array) {
                    return true
                } else {
                    return false
                }
            },
            creat_cal() {
                this.$emit("creat-cal");
            },
            sort_click(val) {
                this.$emit("sort-click", val);
            },
            //------------全选反选
            changeAll(val) {
                this.dataTable.forEach(data => {
                    data.isChecks = val;
                    data.dataList.forEach(item => {
                        item.isCheck = val
                    })
                });
            },
            changeOne() {
                this.dataTable.forEach(data => {
                    if (data.dataList.every(item => item.isCheck === true)) {
                        data.isChecks = true;
                    } else {
                        data.isChecks = false;
                    }
                });
                this.dataTable.filter(row=>row.isChecks).length === this.dataTable.length ? this.checkAll = true : this.checkAll = false;
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
                this.dataTable.filter(row=>row.isChecks).length === this.dataTable.length ? this.checkAll = true : this.checkAll = false;
            },
            addClass(data) {
                this.classData = data;
            },
            addGoods() {
                this.$refs.addGoods.snText = "";
                this.$refs.addGoods.goods = {
                    dataList: [],
                    page: 1,
                    pageSize: 20,
                    totalSize: 0,
                };
                this.$nextTick(() => {
                    this.$refs.addGoods.all();
                    this.$refs.addGoods.get_categories();
                });
                this.goodsDialog = true;
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
            create_procurement() {/*-------------生成采购计划*/
                let listId = [];
                let flag = true;
                let datas = [];
                this.dataTable.forEach(data => {
                    data.dataList.forEach(item => {
                        if (item.isCheck && !item.isDiable) {
                            listId.push(item.id);
                            let dataTable = {
                                id: item.id,
                                purchase_qty: item.purchase_qty,
                                purchase_price: item.purchase_price,
                                purchaser_id: item.purchaser_id,
                                supplier_id: item.supplier_id,
                                min_qty: item.min_qty
                            };
                            datas.push(dataTable);
                            if (item.warehouse && item.supplier && item.purchaser_id && item.purchase_qty) {
                                flag = true;
                            } else {
                                flag = false;
                            }
                        }
                    })
                });
                let find = this.dataTable.find(row => !!row.dataList.find(item => item.isCheck && !item.isDiable && Number(item.purchase_qty) < Number(item.min_qty)));
                if (!!find) {
                    this.$reqKey('url_purchasing_plan', false);
                    return this.$message({
                        showClose: true,
                        type: 'warning',
                        message: `${find.supplier}供应商中的采购数量小于最小起订量！`
                    });
                }
                if (listId.length <= 0) {
                    this.$reqKey('url_purchasing_plan', false);
                    return this.$message({
                        showClose: true,
                        type: 'warning',
                        message: '请选择要生成采购计划的数据！'
                    });
                } else {
                    this.$http(api_updata_before_create_plan, {data_json: datas}).then(res => {
                        if (res.status === 1) {
                            this.show = true;
                        } else if (res.status === 0) {
                            this.$message({type: 'error', message: res.message || res});
                        }
                        if (!flag) {
                            this.$message({
                                showClose: true,
                                type: 'warning',
                                message: '采购计划必须有 仓库 供应商 采购员 采购数量！'
                            });
                        } else {
                            let paramsId = {
                                id: listId.join()
                            };
                            this.$confirm(`您将生成采购计划，确认此操作吗?`, '提示', {
                                confirmButtonText: "确定",
                                cancelButtonText: "取消",
                                type: "warning"
                            }).then(() => {
                                this.$http(purchasing_plan, paramsId).then(res => {
                                    if (res.message.id) {
                                        let messageName = [];
                                        res.message.id.forEach(item => {
                                            this.dataTable.forEach(data => {
                                                data.dataList.forEach(it => {
                                                    if (it.id === item) {
                                                        it.isDiable = true;
                                                        messageName.push(it.sku_name)
                                                    }
                                                })
                                            })
                                        });
                                        this.$message({type: "error", message: `产品名称为${messageName.join(',')}已提交`});
                                    } else {
                                        this.$message({
                                            type: 'success',
                                            message: res.message
                                        });
                                    }
                                    listId.forEach(row => {
                                        this.dataTable.forEach(param => {
                                            let index = param.dataList.findIndex(item => {
                                                return item.id === row
                                            });
                                            if (index !== -1) {
                                                param.dataList.splice(index, 1);
                                                if (param.dataList.length === 0) {
                                                    let i = this.dataTable.findIndex(row => {
                                                        return row.supplier === param.supplier;
                                                    });
                                                    this.dataTable.splice(i, 1);
                                                }
                                            }
                                        })
                                    });
                                    this.isCheck = false;
                                }).catch(code => {
                                    let newDatas = [];
                                    const h = this.$createElement;
                                    //通过循环data数组，调用h方法，将每项值传给h,h('标签名',样式,具体内容)
                                    for (let i in code.message) {
                                        //将data数据push进newDatas数组中
                                        newDatas.push(h('p', null, code.message[i]));
                                    }
                                    ;
                                    this.$msgbox({
                                        title: '提示',
                                        type: 'error',
                                        message: h('div', null, newDatas) || code
                                    });
                                }).finally(() => {
                                    setTimeout(() => {
                                        this.$reqKey('url_purchasing_plan', false);
                                    }, 200);
                                });
                            }).catch(code => {
                                this.$message({
                                    type: 'info',
                                    message: `已取消操作!`
                                })
                            }).finally(() => {
                                setTimeout(() => {
                                    this.$reqKey('url_purchasing_plan', false);
                                }, 200);
                            });
                        }
                    }).catch(code => {
                        let newDatas = [];
                        const h = this.$createElement;
                        //通过循环data数组，调用h方法，将每项值传给h,h('标签名',样式,具体内容)
                        for (let i in code.message) {
                            //将data数据push进newDatas数组中
                            newDatas.push(h('p', null, code.message[i]));
                        }
                        ;
                        this.$msgbox({title: '提示', type: 'error', message: h('div', null, newDatas) || code});
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('url_purchasing_plan', false);
                        }, 200);
                    });
                }
            },
            //重启生成状态
            recovery_plan_status() {
                let listId = [];
                this.dataTable.forEach(data => {
                    data.dataList.forEach(item => {
                        if (item.isCheck && !item.isDiable) {
                            listId.push(item.id);
                        }
                    })
                })
                if (listId.length <= 0) {
                    this.$reqKey('url_reset_proposal_status', false);
                    this.$message({type: 'warning', message: `请选择要重置生成状态的数据!`});
                } else {
                    let paramsId = {
                        id: listId.join()
                    };
                    this.$confirm(`您将重置生成状态,确认此操作吗?`, '提示', {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then(() => {
                        this.$http(reset_proposal_status, paramsId).then(res => {
                            if (res.status === 1) {
                                this.$message({type: 'success', message: `操作成功!`});
                                listId.forEach(row => {
                                    this.dataTable.forEach(param => {
                                        let index = param.dataList.findIndex(item => {
                                            return item.id === row
                                        });
                                        if (index !== -1) {
                                            param.dataList.splice(index, 1);
                                            if (param.dataList.length === 0) {
                                                let i = this.dataTable.findIndex(row => {
                                                    return row.supplier === param.supplier;
                                                });
                                                this.dataTable.splice(i, 1);
                                            }
                                        }
                                    })
                                });
                            } else if (res.status === 0) {
                                this.$message({type: 'error', message: res.message || res});
                            }
                        }).catch(code => {
                            this.$message({
                                type: 'error',
                                message: code.message || code
                            })
                        }).finally(() => {
                            setTimeout(() => {
                                this.$reqKey('url_reset_proposal_status', false);
                            }, 200);
                        });
                        this.isCheck = false;
                    }).catch(code => {
                        this.$message({type: 'info', message: `已取消操作!`});
                    }).finally(() => {
                        this.$reqKey('url_reset_proposal_status', false);
                    });
                }
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
            update_min_qty(item) {
                this.dataTable.forEach(res => {
                    let find = res.dataList.find(row => {
                        return row.old_purchase_qty !== Number(row.purchase_qty);
                    });
                    let find2 = res.dataList.find(row => {
                        return row.old_purchase_price !== row.purchase_price;
                    });
                    let find3 = res.dataList.find(row => {
                        return row.old_min_qty !== Number(row.min_qty);
                    });
                    res.dataList.forEach(data => {
                        if (data.id === item.id) {
                            this.$set(item, 'show', 1);
                            if (data.old_min_qty === Number(item.min_qty)) {
                                this.$delete(item, 'show');
                            }
                            if (item.show === 1 || !!find || !!find2 || !!find3) {
                                this.show = false;
                                item.isChange = true;
                            } else {
                                this.show = true;
                                item.isChange = false;
                            }
                        }
                    });
                });
            },
            update_num(item) {
                this.dataTable.forEach(res => {
                    let find = res.dataList.find(row => {
                        return row.old_purchase_qty !== Number(row.purchase_qty);
                    });
                    let find2 = res.dataList.find(row => {
                        return row.old_purchase_price !== row.purchase_price;
                    });
                    let find3 = res.dataList.find(row => {
                        return row.old_min_qty !== Number(row.min_qty);
                    });
                    res.dataList.forEach(data => {
                        if (data.id === item.id) {
                            this.$set(item, 'show', 1);
                            if (data.old_purchase_qty === Number(item.purchase_qty)) {
                                this.$delete(item, 'show');
                            }
                            if (item.show === 1 || !!find || !!find2 || !!find3) {
                                this.show = false;
                                item.isChange = true;
                            } else {
                                this.show = true;
                                item.isChange = false;
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
                            data.purchase_price = checkSupplier[0].price;
                            data.isChange = true;
                        }
                    });
                });
            },
            update_price(item) {
                this.dataTable.forEach(res => {
                    let find = res.dataList.find(row => {
                        return row.old_purchase_price !== row.purchase_price;
                    });
                    let find2 = res.dataList.find(row => {
                        return row.old_purchase_qty !== Number(row.purchase_qty);
                    });
                    let find3 = res.dataList.find(row => {
                        return row.old_min_qty !== Number(row.min_qty);
                    });
                    res.dataList.forEach(data => {
                        if (data.id === item.id) {
                            this.$set(item, 'show', 1);
                            if (data.old_purchase_price === item.purchase_price) {
                                this.$delete(item, 'show');
                            }
                            if (item.show === 1 || !!find || !!find2 || !!find3) {
                                this.show = false;
                                item.isChange = true;
                            } else {
                                this.show = true;
                                item.isChange = false;
                            }
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
                    return 0;
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
            'dataTable'(val) {
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
        },
        computed: {
            ...mapGetters({purchasers: 'api/purchasers'}),
            filterHeads() {
                switch (this.changeStatus) {
                    case 0:
                        return[
                            {isCheck: true, width: 2},
                            {label: '图片', size: 70},
                            {label: '产品SKU/别名', width: 8},
                            {label: '产品名称', width: 11},
                            {label: 'SKU状态', width: 4},
                            {label: '日均销量', width: 4},
                            {label: '在途库存', width: 4},
                            {label: '备货仓库', width: 4},
                            {label: '备货仓库可用库存', width: 4},
                            {label: '中转仓', width: 5},
                            {label: '中转仓可用库存', width: 5},
                            {label: '总申请备货数量', width: 5},
                            {label: '本地仓可用库存', width: 5},
                            {label: '采购价格', width: 5},
                            {label: '采购员', width: 5},
                            {label: '开发员', width: 5},
                            {label: '操作', width: 6}
                        ];
                    case 1:
                        return [
                            {isCheck: true, width: 2},
                            {label: '图片', size: 70},
                            {label: '产品SKU/别名', width: 8},
                            {label: '产品名称', width: 11},
                            {label: 'SKU状态', width: 4},
                            {label: '日均销量', width: 4},
                            {label: '在途库存', width: 4},
                            {label: '最小起订量', width: 4},
                            {label: '中转仓', width: 4},
                            {label: '总审核备货数量', width: 5},
                            {label: '中转仓可用库存', width: 5},
                            {label: '中转仓锁定库存', width: 5},
                            {label: '本地仓可用库存', width: 5},
                            {label: '调拨数量', width: 5},
                            {label: '采购数量', width: 5},
                            {label: '供应商', width: 5},
                            {label: '采购价格', width: 5},
                            {label: '采购员', width: 6}
                        ];
                    case 2:
                        return [
                            {isCheck: true, width: 2},
                            {label: '图片', size: 70},
                            {label: '产品SKU/别名', width: 8},
                            {label: '产品名称', width: 11},
                            {label: 'SKU状态', width: 4},
                            {label: '最小起订量', width: 4},
                            {label: '中转仓', width: 4},
                            {label: '总审核备货数量', width: 4},
                            {label: '中转仓锁定库存', width: 4},
                            {label: '本地仓调拨数量', width: 5},
                            {label: '计划采购数量', width: 5},
                            {label: '采购价格', width: 5},
                            {label: '采购员', width: 5},
                            {label: '开发员', width: 5},
                            {label: '操作', width: 6}
                        ];
                    case 3:
                        return [
                            {isCheck: true, width: 2},
                            {label: '图片', size: 70},
                            {label: '产品SKU/别名', width: 8},
                            {label: '产品名称', width: 11},
                            {label: 'SKU状态', width: 4},
                            {label: '备货仓库', width: 4},
                            {label: '中转仓', width: 5},
                            {label: '总申请备货数量', width: 5},
                            {label: '采购价格', width: 5},
                            {label: '采购员', width: 5},
                            {label: '开发员', width: 5},
                            {label: '驳回理由', width: 6}
                        ];
                    case 4:
                        return [
                            {isCheck: true, width: 2},
                            {label: '图片', size: 70},
                            {label: '产品SKU/别名', width: 8},
                            {label: '产品名称', width: 11},
                            {label: 'SKU状态', width: 4},
                            {label: '最小起订量', width: 4},
                            {label: '备货仓库', width: 4},
                            {label: '中转仓', width: 4},
                            {label: '总审核备货数量', width: 4},
                            {label: '采购价格', width: 5},
                            {label: '采购员', width: 5},
                            {label: '开发员', width: 5},
                            {label: '驳回理由', width: 5}
                        ];
                    default:
                        return [];
                }
            },
            supplierColspan(){

                switch (this.changeStatus) {
                    case 0:
                        return 17;
                    case 1:
                        return 17;
                    case 2:
                        return 15;
                    case 3:
                        return 12;
                    case 4:
                        return 13;
                    default:
                        return 17;
                }
            },
            isDisabled() {
                let find = this.dataTable.find(data =>!!data.dataList.find(item =>item.isCheck && !item.isDiable));
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
                this.dataTable.forEach(data => {
                    data.dataList.forEach(item => {
                        if (item.isCheck && !item.isDiable) {
                            ids.push(item.id);
                        }
                    });
                });
                return ids
            }
        },
        props: {
            dataTable: {},
            changeStatus:{
                required:true,
                type:Number
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
            addSupplier:require('../plan/add-supplier').default,
            addGoods:require('../plan/add-goods').default,
            uiTable:require('@/components/ui-table').default,
            addAnalyze:require('./add-analyze').default,
            uiTips: require('@/components/ui-tip').default,
            purchaser: require('@/api-components/purchaser').default,
            download: require('@/components/download').default,
            trendsSelect: require('@/components/trends-select').default,
            uiLimitNumber: require('@/components/ui-limit-number').default,
            blowupImage: require("@/components/blowup-image").default,
        }
    }
</script>
