<template>
    <page-dialog size="full" v-model="show" :title="title" @open="open" class="p-form-look" @change="change_dialog"
                 :close-on-click-modal="false" width="90%" left="10%">
        <label-item label="编号：">
            <span> {{lookData.purchase_plan_code}}</span>
        </label-item>
        <label-item label="状态：" class="ml-lg">
            <span>  {{lookData.status|statusFilter}}</span>
        </label-item>
        <label-item label="采购仓库：" class="ml-lg">
            <span v-if="!edit">{{lookData.warehouse}}</span>
            <el-select v-model="lookData.warehouse_id"
                       ref="warehouse_id"
                       :disabled="selectMark === 'stocking'"
                       v-mouse-side.mousewheel="()=>{$refs.warehouse_id.visible=false}"
                       v-if="edit">
                <el-option :key="warehouse.value" v-for="warehouse in warehouses"
                           :label="warehouse.label"
                           :value="warehouse.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="供应商：" class="ml-lg" v-if="edit">
            <el-select v-model="supplier"
                       ref="supplier"
                       v-mouse-side.mousewheel="()=>{$refs.supplier.visible=false}">
                <el-option :key="supplier.value" v-for="supplier in supplierLists"
                           :label="supplier.label"
                           :value="supplier.value"></el-option>
            </el-select>
        </label-item>
        <label-item label="创建人：" class="ml-lg">
                <span>
                    {{lookData.creater}}
                </span>
        </label-item>
        <label-item label="采购计划生成时间：" class="ml-lg">
                <span>
                    {{lookData.create_time|dataFilter}}
                </span>
        </label-item>
        <div v-if="edit">
            <el-button type="primary" :disabled="selectMark === 'stocking'" size="mini" @click.native="add_goods()">
                添加商品
            </el-button>
            <el-button type="primary" :disabled="selectMark === 'stocking'" size="mini"
                       @click.native="showImport=true;">EXCEL导入
            </el-button>
            <el-button type="warning" :disabled="selectMark === 'stocking'" size="mini" @click.native="delete2">
                {{deleteLabel}}
            </el-button>
            <label-item class="fr" label="统一分配采购员：" filterable>
                <purchaser class="inline" :disabled="this.selectMark==='other'" v-model="purchaser_id"
                           @input="change_buyers"></purchaser>
            </label-item>
        </div>
        <div style="margin-top:5px" class="p-form-look-table">
            <el-table :data="filterGoodsLists"
                      @selection-change="(sels)=>{goodsListSelect=sels;}"
                      :max-height="490"
                      default-expand-all
                      v-loading="loading"
                      element-loading-text="玩命加载中..."
                      style="min-height: 225px;">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <div style="text-align: left;">&nbsp;&nbsp;批注：{{props.row.remark}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="图片" width="70" inline-template>
                    <el-popover
                        v-if="row.thumb"
                        placement="right"
                        trigger="hover">
                        <img :src="row.thumb | filterImage"
                             width="200px"
                             height="200px">
                        <div slot="reference" style="position: relative;">
                            <img :src="row.thumb"
                                 @click="search_img(row.thumb)"
                                 height="60px" width="60px"
                                 style="border:none">
                        </div>
                    </el-popover>
                    <img src="/static/error-picture-128.png"
                         v-else
                         height="60px" width="60px"
                         style="border:none">
                </el-table-column>
                <el-table-column label="产品SKU/SKU别名" min-width="60" inline-template style="position: relative;">
                    <div>
                        <el-popover
                            placement="right-start"
                            width="200"
                            trigger="hover"
                            content="首次采购SKU不按照日均销量公式计算建议采购数量，而是按照订单未配货数量获取建议采购数量">
                            <i slot="reference" class="newly-increased" v-if="row.purchase_times===0"></i>
                        </el-popover>
                        <div class="p-table-list-td-text" :title="row.sku">{{row.sku}}</div>
                        <div class="p-table-list-td-text" :title="row.sku_alias|filterAlias">{{row.sku_alias|filterAlias}}</div>
                    </div>
                </el-table-column>
                <el-table-column label="产品名称" inline-template>
                    <div>
                        {{row.sku_name}}
                    </div>
                </el-table-column>
                <el-table-column label="日销量" min-width="35" inline-template>
                    <div class="inline">
                        <span v-if="row.daily_sale" title="点击可查看图表详情" class="operate" @click="analyze(row)">{{row.daily_sale}}</span>
                        <div class="daily_sale" v-else title="无销售量">{{row.daily_sale}}</div>
                    </div>
                </el-table-column>
                <el-table-column label="安全交期" min-width="40" inline-template>
                    <div>
                        <ui-tip :content="row.delivery_time" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="在途库存" min-width="40" inline-template>
                    <div>
                        <ui-tip :content="row.intransit_stock_qty" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="可用库存" min-width="40" inline-template>
                    <div>
                        <ui-tip :content="row.available_qty" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="订单未配货" min-width="45" inline-template>
                    <div>
                        <ui-tip :content="row.unpicking_goods_qty" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="建议采购" min-width="40" inline-template>
                    <div>
                        <ui-tip :content="row.proposal_qty" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="采购数量" min-width="40" inline-template>
                    <ui-input type="number"
                              v-model="row.purchase_qty"
                              :edit="edit"
                              @input="chang_(row)"
                              @blur="blur_purchase_qty(row)"></ui-input>
                </el-table-column>
                <el-table-column :label="`采购单价${currency?`(${currency})`:''}`" min-width="60" inline-template>
                    <div>
                        <ui-input v-model="row.purchase_price"
                                  :edit="edit"
                                  v-if="edit"
                                  :disabled="selectMark==='other'"
                                  @input="chang_(row)"
                                  @blur="blur_purchase_price(row)"></ui-input>
                        <div v-else><span :style="`color: ${colorIsRed(row)}`">{{row.purchase_price}}</span></div>
                    </div>
                </el-table-column>
                <el-table-column :label="`最后一次采购单价${currency?`(${currency})`:''}`" width="100" inline-template>
                    <div>
                        <ui-tip :content="row.lastest_purchase_price|filterAmount" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="3月内最低报价" inline-template width="90">
                    <div>
                        <ui-tip :content="row.three_month_price" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column :label="`区间报价${currency?`(${currency})`:''}`" width="90" inline-template>
                          <span class="operate"
                                @click="newPrice(row)"
                                v-for="item in row.section" style="display: block">
                            <span>{{item.min_quantity}}</span>-
                            <span>{{item.max_quantity}}</span>/
                            <span>{{item.price}}</span>
                          </span>
                </el-table-column>
                <el-table-column label="结算方式" min-width="40" inline-template>
                    <div>
                        <ui-tip :content="row.balance_type_text" :width="88"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="采购员" inline-template min-width="35">
                    <div v-if="!edit || selectMark==='other'">
                        <span>{{row.purchaser}}</span>
                    </div>
                    <div v-else>
                              <span v-if="row.purchaser" class="operate">
                                 <span @click="change_purchaser(row)">{{row.purchaser}}</span>
                              </span>
                        <span v-else>
                                 <purchaser class="inline" v-model="row.purchaser_id"></purchaser>
                              </span>
                    </div>
                </el-table-column>
                <el-table-column label="操作" min-width="35" inline-template>
                        <span class="operate" v-if="row.link">
                            <a class="link" :href="`${row.link}`" target="_blank">下单</a>
                        </span>
                    <span class="operate" v-else @click="order_none">下单</span>
                </el-table-column>
            </el-table>
            <el-pagination
                style="text-align: right;"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[20,50,100,200,500]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <div>
            <el-table
                :data="filterSupplierBuyers"
                :max-height="200">
                <el-table-column label="供应商" inline-template>
                    <span v-if="row.supplier">{{ row.supplier }}</span>
                    <span v-else>无供应商</span>
                </el-table-column>
                <el-table-column label="采购员" inline-template>
                    <div v-if="!edit || selectMark==='other'">
                        <span>{{row.purchaser}}</span>
                    </div>
                    <div v-else>
                            <span v-if="row.purchaser">
                                <span>{{row.purchaser}}</span>
                            </span>
                        <span v-else-if="row.purchaser_id">
                                <purchaser class="inline" v-model="row.purchaser_id" :disabled="true"></purchaser>
                            </span>
                        <span v-else>无采购员</span>
                    </div>
                </el-table-column>
                <el-table-column label="总重量(g)" inline-template>
                    <div>{{lookData.totalWeight}}</div>
                </el-table-column>
                <el-table-column label="运费" inline-template>
                    <span v-if="!edit">{{row.expenses}}</span>
                    <ui-limit-number v-else
                                     class="inline"
                                     v-model="row.expenses"
                                     :disabled="this.selectMark==='other'"
                                     :limit="2"></ui-limit-number>
                </el-table-column>
                <el-table-column label="运单号"
                                 inline-template
                                 v-if="selectMark==='other'">
                    <span v-if="!edit">{{row.tracking_number}}</span>
                    <span v-else>
                            <el-input class="inline" v-model="row.tracking_number"></el-input>
                        </span>
                </el-table-column>
                <el-table-column label="流水号" inline-template>
                    <span v-if="!edit">{{row.external_number}}</span>
                    <span v-else><el-input class="inline" v-model="row.external_number"></el-input></span>
                </el-table-column>
                <el-table-column label="优惠金额" inline-template>
                    <span v-if="!edit">{{row.discount|filterAmount}}</span>
                    <ui-limit-number v-else
                                     class="inline"
                                     v-model="row.discount"
                                     :disabled="this.selectMark==='other'"
                                     :limit="2"></ui-limit-number>
                </el-table-column>
                <el-table-column :label="`商品金额${currency?`(${currency})`:''}`" inline-template>
                    <span>{{lookData.sku_amont | filterAmount}}</span>
                </el-table-column>
                <el-table-column :label="`总金额${currency?`(${currency})`:''}`" inline-template>
                    <span>{{lookData.amount | filterAmount}}</span>
                </el-table-column>
                <td colspan="8" slot="append" class="t-footer-description">
                    <div class="t-footer-content" v-html="filter_description"></div>
                </td>
            </el-table>
        </div>
        <!--<el-row class="mb-xs mt-xs">-->
            <!--<el-row>-->
                <!--<el-form>-->
                    <!--<el-form-item label="附件：">-->
                        <!--<image-upload v-model="files"-->
                                      <!--:is-look="true"-->
                                      <!--:show-download="true"-->
                                      <!--:download-img="downloadImg"-->
                                      <!--class="inline ml-sm"-->
                                      <!--ref="images-file"></image-upload>-->
                    <!--</el-form-item>-->
                <!--</el-form>-->
            <!--</el-row>-->
        <!--</el-row>-->
        <el-row class="mb-xs mt-xs">
            <el-button size="mini" type="primary" class="fr" @click="btnclick">{{btnName}}</el-button>
        </el-row>
        <card label="操作日志" class="mt-sm" v-show="loghidden">
            <el-table
                :data="actionLog"
                highlight-current-row
                style="width: 100%">
                <el-table-column
                    label="操作人"
                    prop="operater_user"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    label="日期"
                    inline-template
                    show-overflow-tooltip>
                    <span>{{row.operate_time|dataFilter}}</span>
                </el-table-column>
                <el-table-column
                    inline-template
                    label="操作状态"
                    show-overflow-tooltip>
                    <div>{{row.status|statusFilter}}</div>
                </el-table-column>
                <el-table-column
                    label="操作记录"
                    prop="operate_content"
                    show-overflow-tooltip>
                </el-table-column>
            </el-table>
        </card>
        <!--常用备注   一直存在页面-->
        <el-card style="position: absolute;right:15px;bottom:55px;z-index: 99999;"
                 v-if="showRemark && lookData.status===1||showRemark && lookData.status===0||showRemark && lookData.status===2"
                 class="el_card_remark">
            <div class="remark-sale-look" style="position: inherit;">
                <label class="remark-sale-header" v-if="showRemark && lookData.status===1">审核不通过的原因: </label>
                <label class="remark-sale-header" v-if="cancelPur">取消采购的原因: </label>
                <el-form class="remark-sale-body">
                    <el-form-item>
                        <el-input type="textarea" v-model="mark" :maxlength="225"
                                  :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                    </el-form-item>
                </el-form>
                <div class="remark-sale-footer">
                    <div class="fr mb-xs">
                        <button class="small-button submit" type="button" @click="audit_no"
                                v-if="showRemark && lookData.status===1">提交
                        </button>
                        <button class="small-button submit" type="button" @click="audit_cancel" v-if="cancelPur">提交
                        </button>
                        <button class="small-button cancel" type="button" @click="showRemark=false">取消</button>
                    </div>
                </div>
            </div>
        </el-card>
        <div class="clear p-look-list-count">
            <label-item label="货品种类数：">
                <span>{{count}}</span>
            </label-item>
            <label-item label="货品总数量：">
                <span>{{purchase_sum}}</span>
            </label-item>
        </div>
        <div slot="footer">
        <span v-if="lookData.status===0">
            <request-button :request="save" v-if="edit||dispose">确定</request-button>
            <request-button :request="submit" v-if="edit||dispose">提交审批</request-button>
            <el-button size="mini" type="primary" @click.native="showRemark=true" v-if="cancelPurchase">取消采购</el-button>
            <el-button size="mini" class="mr-sm" @click.native="cancel">关闭</el-button>
        </span>
            <span v-else-if="lookData.status===1">
            <request-button :disabled="passDisabled" :request="audit_pass" v-if="edit||dispose">审核通过</request-button>
            <el-button size="mini" type="primary" @click.native="show_no" v-if="edit||dispose">审核不通过</el-button>
            <el-button size="mini" class="mr-sm" @click.native="show_false">关闭</el-button>
        </span>
            <span v-else-if="lookData.status===2">
            <el-button type="primary" size="mini" class="mr-sm" @click.native="cancel_pur"
                       v-if="edit||dispose||cancelPurchase">取消采购</el-button>
            <request-button :request="save" v-if="edit||dispose">确定</request-button>
            <request-button :request="submit" v-if="edit||dispose">提交审批</request-button>
            <el-button size="mini" class="mr-sm" @click.native="cancel">关闭</el-button>
        </span>
            <span v-else-if="lookData.status===3">
            <el-button size="mini" class="mr-sm" @click.native="show=false">关闭</el-button>
        </span>
            <span v-else-if="lookData.status===4">
            <el-button size="mini" class="mr-sm" @click.native="show=false">关闭</el-button>
        </span>
        </div>
        <add-goods v-model="showGoods" ref="addGoods" @selected="selected"></add-goods>
        <add-supplier v-model="showSupplier" :supplier-data="supplierData"
                      @update_supplier="update_supplier"></add-supplier>
        <analyze v-model="analyzeDialog" :form="analyzeData"></analyze>
        <price-change v-model="priceDialog" :price-change-data="priceChangeData"></price-change>
        <add-price v-model="showPrice" :supplierData="newPriceData" @confirm="updata_price"></add-price>
        <import-excel v-model="showImport" :warehouseId="lookData.warehouse_id" @files-data="files_data"></import-excel>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
    </page-dialog>
</template>
<style lang="stylus">
    .p-form-add {
        .el-card {
            overflow: initial;
        }
        .body {
            z-index: 999;
        }
        .el-pagination {
            padding: 5px;
        }
        .el_card_remark {
            .remark-sale-look {
                overflow-y: hidden;
                width: 190px;
                height: 140px;
                position: absolute;
                top: 67px;
                right: 7px;
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
        }
    }

    .p-form-look {
        .t-footer-description {
            text-align left;
            .t-footer-content {
                margin 5px 10px;
            }
        }
        .p-look-list-count{
            font-weight: bold;
            margin-bottom: 10px;
            position absolute;
            bottom 10px;
        }
        .p-form-look-table {
            table.template td, .el-table td, table.template th, .el-table th {
                padding: 0 !important;
                height: 26px;
                text-align: center;
                box-sizing: border-box;
                border-right: 1px solid #e0e6ed;
                border-bottom: 1px solid #e0e6ed;
            }
            th>div.cell{
                line-height 16px;
                padding:0;
            }
            td>div.cell{
                line-height 16px;
                padding:0;
            }
        }
        .p-table-list-td-text{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .newly-increased{
            position: absolute;
            top: 0;
            left: 0;
            width: 32px;
            height: 32px;
            background: url(../../../assets/first-purchase.svg) no-repeat center center;
            background-size: contain;
        }
    }
</style>
<script>
    import card from "../../../components/card.vue"
    import {
        api_warehouses,
        api_add_sku,
        add_plan,
        add_look_sku,
        add_look_log,
        api_updata_plan,
        api_purchase_plan_changeStatus,
        api_post_purchase_plan_cancel,
        api_add_mark,
        api_get_price_change
    } from '../../../api/procurement-plan';
    import {publish_edit_supplier, api_getSupplier} from '../../../api/purchase';
    import {api_get_goods_supp} from "../../../api/supplier-quote";
    import analyze from '../purchasing/add-analyze.vue'

    export default {
        page: {
            devinfo: {
                frontEnd: '徐梦娇;黎宏珍',
                backEnd: '杨伟权;谭斌',
                createTime: '2017-3-30',
                updateTime: '2017-8-22'
            }
        },
        data() {
            return {
                title: "",
                mark: '',
                warehouse_id: "",
                loading: true,
                showGoods: false,
                showSupplier: false,
                showRemark: false,
                cancelPur: false,
                showImport: false,
                passDisabled: false,
                show: this.value,
                form: {
                    id: 111
                },
                purchaser_id: '',
                goodsList: [],
                goodsListSelect: [],
                warehouses: [],
                suppliers: [],
                supplier_id: '',
                page: 1,
                pageSize: 20,
                total: 0,
                supplier: -1,
                selectes: [],
                delSkuid: [],
                addSkuid: [],
                actionLog: [],
                loghidden: false,
                supplierData: [],
                supplierId: 0,
                analyzeDialog: false,
                analyzeData: {},
                priceChangeData: [],
                newPriceData: [],
                priceDialog: false,
                showPrice: false,
                imgDialog: false,
                imgPath: '',
                files:[]
            }
        },
        mounted() {
            this.init_warehouses();
            this.init_publish_edit_supplier();
        },
        methods: {
            open() {
                this.goodsListSelect = [];
                this.showRemark = false;
                this.passDisabled = false;
                if (this.cancelPurchase) {
                    this.cancelPur = true;
                } else {
                    this.cancelPur = false;
                }
                this.page = 1;
                this.pageSize = 20;
            },
            downloadImg(file){
                downloadFile({
                    url:`${config.apiHost}supplier/download-image`,
                    get: {file: file},
                    fileName: file.slice(file.lastIndexOf('/') - 1, file.lastIndexOf('.')),
                    suffix: file.slice(file.lastIndexOf('.'))
                });
            },
            colorIsRed(row){
                return !!row.lastest_purchase_price&&row.lastest_purchase_price!=='无'&&Number(row.purchase_price)!==Number(row.lastest_purchase_price)?'red':''
            },
            search_img(image) {
                this.imgPath = image.replace("_60x60", "_500x500");
                this.imgDialog = true;
            },
            order_none() {
                return this.$message({type: "error", message: `无下单链接,无法下单!`});
            },
            change_purchaser(row) {
                row.purchaser_id = "";
                row.purchaser = "";
            },
            add_goods() {
                this.showGoods = true;
                this.$refs.addGoods.snText = "";
            },
            show_false() {
                this.show = false;
                this.showRemark = false;
            },
            blur_purchase_qty(row) {
                if (row.purchase_qty < 0) {
                    row.purchase_qty = 0
                }
                row.purchase_qty = Number(row.purchase_qty).toFixed(0);
            },
            blur_purchase_price(row) {
                if (row.purchase_price < 0) {
                    row.purchase_price = 0
                }
                row.purchase_price = Number(row.purchase_price).toFixed(3);
            },
            //计算商品金额
            supplier_goods_amount(row) {
                let ret = 0;
                this.goodsList.forEach(goods => {
                    if ((goods.purchaser_id === row.purchaser_id) && (goods.supplier_id === row.supplier_id)) {
                        const price = goods.purchase_price || 0;
                        const count = goods.purchase_qty || 0;
                        ret += Number(price) * Number(count);
                    }
                });
                return ret;
            },
            //数据分析（更改的需求）
            analyze(data) {
                this.analyzeData = {sku: data.sku, sku_id: data.sku_id, warehouse_id: data.warehouse_id};
                this.analyzeDialog = true;
            },
            //判断是否是 数组
            polyType(data) {
                return data instanceof Array
            },
            /*修改供应商*/
            modifSupplie(row) {
                this.supplierId = row.id;
                this.showSupplier = true;
                let skuId = {
                    sku_id: row.sku_id
                };
                this.$http(api_getSupplier, skuId).then(res => {
                    if (res.message) {
                        this.supplierData = res.message;
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            update_supplier(checkSupplier) {
                this.goodsList.forEach(data => {
                    if (this.supplierId === data.id) {
                        data.supplier = checkSupplier[0].company_name;
                        data.supplier_id = checkSupplier[0].supplier_id;
                        data.section = checkSupplier[0].section;
                        data.balance_type_text = checkSupplier[0].balance_type_text;
                        data.purchase_price = checkSupplier[0].price;
                    }
                })
            },
            //修改最新报价
            newPrice(row) {
                let skuList = {
                    sku: '',
                    name: "",
                    cycle: [{warehouse_id: "", delivery_days: ""}],
                    section: [{min_quantity: '1', max_quantity: '', price: ""}],
                    link: "",
                    price: "",
                };
                let skuId = {
                    supplier_id: row.supplier_id,
                    sku_id: row.sku_id
                };
                this.$http(api_get_goods_supp, skuId).then(res => {
                    skuList.sku = row.sku;
                    skuList.sku_id = row.sku_id;
                    skuList.name = row.sku_name;
                    skuList.supplier = row.supplier;
                    skuList.supplier_id = row.supplier_id;
                    skuList.currency_code = 'cny';
                    res.list.forEach(row => {
                        skuList.cycle = row.cycle.length > 0 ? row.cycle : [{warehouse_id: "", delivery_days: ""}];
                        skuList.link = row.link;
                        skuList.price = row.price;
                        skuList.section = row.section.length > 0 ? row.section : [{
                            min_quantity: '1',
                            max_quantity: '',
                            price: ""
                        }];
                    });
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
                this.newPriceData = [skuList];
                this.showPrice = true;
            },
            updata_price(checkSupplier) {
                this.goodsList.forEach(data => {
                    if (this.supplierId === data.id) {
                        data.section = checkSupplier.section;
                    }
                })
            },
            /*-----------end*/
            //修改采购员
            change_buyers(pid) {
                this.goodsList.forEach((goods, index) => {
                    this.$set(goods, 'purchaser', '');
                    this.$set(goods, 'purchaser_id', pid);
                    this.goodsList.splice(index, 1, goods);
                });
            },
            /*删除*/
            delete2() {
                this.goodsListSelect.forEach(data => {
                    this.goodsList.forEach((item, index) => {
                        if (data.sku_id === item.sku_id) {
                            if (this.addSkuid.indexOf(item.sku_id) === -1) {
                                this.delSkuid.push(item.sku_id)
                            }
                            let i = this.selectes.indexOf(data.sku_id);
                            this.selectes.splice(i, 1);
                            this.goodsList.splice(index, 1);

                        }
                    })
                })
            },
            handleSizeChange(pageSize) {
                if (this.edit) {
                    this.pageSize = pageSize;

                } else {
                    this.pageSize = pageSize;
                    this.look_sku();
                }
            },
            handleCurrentChange(page) {
                if (this.edit) {
                    this.page = page;
                } else {
                    this.page = page;
                    this.look_sku();
                }
            },
            init_warehouses() {
                this.$http(api_warehouses).then(res => {
                    this.warehouses = res;
                })
            },
            init_publish_edit_supplier() {
                this.$http(publish_edit_supplier).then(res => {
                    this.suppliers = res;
                })
            },
            files_data(val) {
                val.forEach(row => {
                    if (this.selectes.indexOf(row.id) === -1) {
                        this.selectes.push(row.id);
                        row.id = row.sku_id;
                        row.purchase_price = row.supplier_price;
                        row.purchase_qty = row.purchase_qty;
                        row.link = row.link;
                        this.goodsList.push(row);
                    } else {
                        this.$message(`SKU为：${row.sku} 已存在`);
                    }
                });
            },
            fix_params({page, pageSize, keyword}) {
                return {
                    page: page,
                    pageSize: pageSize,
                    snText: keyword,
                    snType: 'company_name'
                };
            },
            btnclick() {
                this.loghidden = !this.loghidden;
            },
            audit_pass() {
                return this.$http(api_get_price_change, {purchase_plan_code: this.lookData.purchase_plan_code}).then(res => {
                    this.priceChangeData = res.list;
                    this.up_change_number = res.up_change_number;
                    if (this.up_change_number === 1) {
                        this.priceDialog = true;
                        const watch = this.$watch('priceDialog', (val) => {
                            watch();
                            if (!val) {
                                this.$confirm('此操作审核通过, 确认此操作吗?', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    this.audit_init({
                                        id: this.id,
                                        remark: this.mark,
                                        status: 4
                                    })
                                }).catch(code => {
                                    this.$message({message: code.message || code, type: 'error'})
                                })
                            }
                        })
                    } else {
                        this.$confirm('此操作审核通过, 确认此操作吗?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.passDisabled = true;
                            this.audit_init({
                                id: this.id,
                                remark: this.mark,
                                status: 4
                            });
                        }).catch(code => {
                            this.$message({message: `已取消操作!` || code, type: 'error'})
                        })
                    }
                });
                this.showRemark = false;
                return Promise.resolve();
            },
            show_no() {
                this.showRemark = true;
                this.cancelPur = false;
            },
            audit_no() {
                if (!this.mark) {
                    this.$message({type: 'warning', message: `请写出不通过的原因`});
                    return;
                }
                let obj = {
                    id: this.id,
                    remark: this.mark,
                    status: 2
                };
                this.lookData.description = this.mark;
                this.$http(api_add_mark, obj).then(res => {
                    console.log(res);
                });
                this.log_init();
                this.audit_init({
                    id: this.id,
                    remark: this.mark,
                    status: 2
                });
                this.show = false;
                this.showRemark = false;
            },
            //取消采购
            cancel_pur() {
                this.showRemark = true;
                this.cancelPur = true;
            },
            cancel() {
                this.show = false;
            },
            audit_cancel() {
                if (!this.mark) {
                    this.$message({type: 'error', message: `请填写取消采购的原因`});
                    return;
                }
                let obj = {
                    id: this.id,
                    remark: this.mark,
                    status: 3
                };
                this.lookData.description = this.mark;
                this.$http(api_add_mark, obj).then(res => {
                    console.log(res);
                });
                this.log_init();
                this.audit_cancel_init({
                    id: this.id,
                    status: 3,
                    remark: this.mark,
                });
                this.show = false;
                this.showRemark = false;
                this.cancelPur = false;
            },
            audit_cancel_init(data) {
                let params = [];
                params.push(data);
                return this.$http(api_post_purchase_plan_cancel, {plans: params}).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.show = false;
                    params.forEach(row => {
                        let ids = [];
                        this.$emit("edit-update", this.id, ids, row);
                    });
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            audit_init(data) {
                let params = [];
                params.push(data);
                return this.$http(api_purchase_plan_changeStatus, {plans: params}).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.show = false;
                    params.forEach(row => {
                        let ids = [];
                        this.$emit("edit-update", this.id, ids, row);
                    });
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            save() {
                let add = {};
                this.goodsList.forEach(row => {
                    add[row.sku_id] = {
                        purchaser_id: row.purchaser_id,
                        purchase_price: row.purchase_price,
                        purchase_qty: row.purchase_qty,
                        supplier_id: row.supplier_id,
                    };
                });
                let summary = [];
                this.filterSupplierBuyers.forEach(row => {
                    let amout = {};
                    amout.expenses = row.expenses;
                    amout.discount = row.discount;
                    amout.external_number = row.external_number;
                    amout.description = row.description;
                    amout.tracking_number = this.selectMark === 'other' ? row.tracking_number : '';
                    row.goods.forEach(goods => {
                        amout.supplier_id = goods.supplier_id;
                        amout.purchaser_id = goods.purchaser_id;
                    });
                    summary.push(amout);
                });
                let saveData = {
                    id: this.id,
                    warehouse_id: this.lookData.warehouse_id,
                    supplier_id: this.lookData.supplier_id,
                    sku_json: {add: add},
                    summary: summary,
                    status: 0,
                    purchase_plan_type: this.selectMark === 'other' ? 'purchase_order_overcharged' : 'normal_purchasing',
                    purchase_order_code: this.selectMark === 'other' ? this.snText : ''
                };
                return this.$http(api_updata_plan, this.id, saveData).then(res => {
                    if (res.status === 1) {
                        this.$message({
                            type: 'success',
                            message: `操作成功!`
                        })
                    } else {
                        this.$message({
                            type: 'success',
                            message: `操作成功!`
                        })
                    }
                    this.show = false;
                    if (this.lookData.status === 2) {
                        this.$emit("edit-update", this.id, res.id, 2);
                    } else {
                        this.$emit("edit-update", this.id, res.id, 0);
                    }
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            submit() {
                let add = {};
                this.goodsList.forEach(row => {
                    add[row.sku_id] = {
                        purchaser_id: row.purchaser_id,
                        purchase_price: row.purchase_price,
                        purchase_qty: row.purchase_qty,
                        supplier_id: row.supplier_id,
                    };
                });
                let summary = [];
                this.filterSupplierBuyers.forEach(row => {
                    let amout = {};
                    amout.expenses = row.expenses;
                    amout.discount = row.discount;
                    amout.external_number = row.external_number;
                    amout.description = row.description;
                    amout.tracking_number = this.selectMark === 'other' ? row.tracking_number : '';
                    row.goods.forEach(goods => {
                        amout.supplier_id = goods.supplier_id;
                        amout.purchaser_id = goods.purchaser_id;
                    });
                    summary.push(amout);
                });
                let saveData = {
                    id: this.id,
                    warehouse_id: this.lookData.warehouse_id,
                    supplier_id: this.lookData.supplier_id,
                    sku_json: {add: add},
                    summary: summary,
                    status: 1,
                    purchase_plan_type: this.selectMark === 'other' ? 'purchase_order_overcharged' : 'normal_purchasing',
                    purchase_order_code: this.selectMark === 'other' ? this.snText : ''
                };
                return this.$http(api_updata_plan, this.id, saveData).then(res => {
                    this.$confirm('此操作提交审批, 确认此操作吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.audit_init({
                            id: this.id,
                            remark: this.mark,
                            status: 1
                        })
                    }).catch(code => {
                        this.$message({message: `已取消操作!` || code, type: 'error'})
                    })
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            log_init() {
                this.$http(add_look_log, {purchase_plan_id: this.id}).then(res => {
                    this.actionLog = res.data;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })

            },
            chang_(row) {
                let index = this.goodsList.indexOfFun(item => {
                    return item.sku_id === row.sku_id
                });
                if (!this.goodsList[index].action) {
                    this.goodsList[index].action = "mod"
                }
            },
            //添加  获取sku信息
            add_sku(data) {
                this.$http(api_add_sku, data).then(res => {
                    res.purchaser_id = res.purchaser_id;
                    res.id = data.sku_id;
                    res.supplier_price = res.supplier_price;//---修改过
                    res.purchase_qty = 0;
                    res.is_replace = 0;
                    res.in_qty = "";
                    res.arrival_qty = 0;
                    res.action = "add";
                    if (this.selectMark === 'other') {
                        res.purchase_price = 0;
                        let skuId = {
                            sku_id: data.sku_id
                        };
                        this.$http(api_getSupplier, skuId).then(row => {
                            if (row.message) {
                                let find = row.message.find(item => {
                                    return item.supplier_id === this.supplier;
                                });
                                if (!!find) {
                                    res.supplier = find.company_name;
                                    res.supplier_id = find.supplier_id;
                                    res.section = find.section;
                                    res.balance_type_text = find.balance_type_text;
                                } else {
                                    this.$message({type: 'warning', message: `请选择当前供应商的商品!`});
                                }
                            }
                        }).catch(code => {
                            this.$message({type: "error", message: code.message || code});
                        });
                        this.goodsList.push(res);
                    } else {
                        res.purchase_price = res.supplier_price;
                        this.goodsList.push(res);
                    }
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            selected(sels) {
                sels.forEach(data => {
                    data.forEach(row => {
                        if (this.selectes.indexOf(row.id) === -1) {
                            this.addSkuid.push(row.id);
                            this.selectes.push(row.id);
                            this.add_sku({
                                sku_id: row.id,
                                warehouse_id: this.lookData.warehouse_id
                            })
                        } else {
                            this.$message(`SKU为：${row.sku} 已存在`);
                        }
                    });
                })

            },
            //查看  获取sku信息
            look_sku() {
                if (this.edit) {
                    let data = {
                        purchase_plan_id: this.id,
                        page: 1,
                        pageSize: 20
                    };
                    this.loading = true;
                    this.$http(add_look_sku, data).then(res => {
                        this.goodsList = res.data;
                        this.total = res.count;
                        res.data.forEach(item => {
                            this.selectes.push(item.sku_id);
                        });
                        this.loading = false;
                    }).catch(code => {
                        this.$message({message: code.message || code, type: 'error'})
                    })
                } else {
                    let data = {
                        purchase_plan_id: this.id,
                        page: this.page,
                        pageSize: this.pageSize
                    };
                    this.loading = true;
                    this.$http(add_look_sku, data).then(res => {
                        this.goodsList = res.data;
                        this.total = res.count;
                        res.data.forEach(item => {
                            this.selectes.push(item.sku_id);
                        });
                        this.loading = false;
                    }).catch(code => {
                        this.$message({message: code.message || code, type: 'error'})
                    })
                }
                if (this.selectMark === 'other') {
                    this.supplier = this.lookData.supplier_id;
                }
            },
            change_dialog(val) {
                if (val) {
                    this.mark = "";
                    this.selectes = [];
                    this.goodsList = [];
                    this.addSkuid = [];
                    this.delSkuid = [];
                    this.look_sku();
                    this.log_init();
                    this.loghidden = false;
                    if (this.edit && this.dispose) {
                        if (this.selectMark === 'other') {
                            this.title = `编辑编号：${this.lookData.purchase_plan_code} 信息(供应商多送)`;
                        } else if (this.selectMark === 'stocking') {
                            this.title = `编辑编号：${this.lookData.purchase_plan_code} 信息(备货采购)`;
                        } else {
                            this.title = `编辑编号：${this.lookData.purchase_plan_code} 信息(正常采购)`;
                        }
                    } else if (!this.edit && this.dispose) {
                        if (this.selectMark === 'other') {
                            this.title = `处理编号：${this.lookData.purchase_plan_code} 信息(供应商多送)`;
                        } else if (this.selectMark === 'stocking') {
                            this.title = `处理编号：${this.lookData.purchase_plan_code} 信息(备货采购)`;
                        } else {
                            this.title = `处理编号：${this.lookData.purchase_plan_code} 信息(正常采购)`;
                        }
                    } else {
                        if (this.selectMark === 'other') {
                            this.title = `查看编号：${this.lookData.purchase_plan_code} 信息(供应商多送)`;
                        } else if (this.selectMark === 'stocking') {
                            this.title = `查看编号：${this.lookData.purchase_plan_code} 信息(备货采购)`;
                        } else {
                            this.title = `查看编号：${this.lookData.purchase_plan_code} 信息(正常采购)`;
                        }
                    }
                }
            }
        },
        computed: {
            currency(){
                return this.lookData.currency_code
            },
            filter_description() {
                return `<div class="t-footer-title">备注：</div>${this.filterSupplierBuyers.map(row => row.description).join(';<br><br>').replace(/\n/g, '<br>')}`;
            },
            btnName() {
                if (this.loghidden) {
                    return "隐藏操作日记"
                } else {
                    return "显示操作日记"
                }
            },
            count() {
                return this.goodsList.length;
            },
            purchase_sum() {
                let sum = 0;
                this.goodsList.forEach(num => {
                    sum += Number(num.purchase_qty)
                });
                return sum;
            },
            filterSupplierBuyers() {
                let shipFee = Object.values(this.lookData.ship_fee_discount_json_1 || {});
                let ret = {};
                this.goodsList.forEach(goods => {
                    const key = `${goods.supplier_id}`;
                    let ship = shipFee.find(row => {
                        return row.purchaser_id === goods.purchaser_id && row.supplier_id === goods.supplier_id
                    });
                    if (!ship) {
                        ship = {
                            expenses: 0,
                            tracking_number: "",
                            external_number: "",
                            description: "",
                            discount: 0,
                        };
                    }
                    ret[key] = ret[key] || {
                        supplier: goods.supplier,
                        supplier_id: goods.supplier_id,
                        purchaser: goods.purchaser,
                        purchaser_id: goods.purchaser_id,
                        expenses: ship.expenses,
                        tracking_number: ship.tracking_number,
                        discount: ship.discount,
                        external_number: ship.external_number,
                        description: ship.description,
                        goods: []
                    };
                    ret[key].goods.push(goods);
                });
                return Object.values(ret);

            },
            filterSupplierGoodsLists() {
                switch (this.supplier) {
                    case -1:
                        return this.goodsList;
                    default:
                        return this.goodsList.filter(row => {
                            return row.supplier_id === this.supplier;
                        });
                }
            },
            filterGoodsLists() {
                if (this.edit) {
                    let ret = [];
                    let index = (this.page - 1) * this.pageSize;
                    let j = this.pageSize;
                    for (let i = index; i < this.filterSupplierGoodsLists.length && j > 0; i++) {
                        let row = this.filterSupplierGoodsLists[i];
                        ret.push(row);
                        j = j - 1;
                    }
                    return ret;
                } else {
                    return this.filterSupplierGoodsLists;
                }
            },
            deleteLabel() {
                let len = this.goodsListSelect.length;
                if (len > 0) {
                    return `删除(${len})`;
                } else {
                    return `请选择删除商品`
                }
            },
            supplierLists() {
                let ret = [{label: '全部', value: -1}, {label: '未指定供应商', value: 0}];
                this.goodsList.forEach(row => {
                    if (row.supplier_id && (ret.indexOfFun(r => r.value === row.supplier_id) <= -1)) {
                        ret.push({
                            label: row.supplier,
                            value: row.supplier_id
                        })
                    }
                });
                return ret;
            }
        },
        filters: {
            filterAlias(val){
                return Array.isArray(val)?val.join(','):val
            },
            supFilter(row) {
                if (row.supplier_id === 0) {
                    return "未指定供应商"
                } else {
                    return row.supplier || "没有名字的供应商";
                }
            },
            dataFilter(val) {
                return datef('YYYY-MM-dd HH:mm:ss', val);
            },
            statusFilter(val) {
                switch (val) {
                    case 0:
                        return "未提交";
                        break;
                    case 1:
                        return "等待审核";
                        break;
                    case 2:
                        return "审核未通过";
                        break;
                    case 3:
                        return "取消采购";
                        break;
                    case 4:
                        return "已生成采购单";
                        break;
                }
            },
            filterAmount(val) {
                return !!val&&!isNaN(Number(val))?Number(val).toFixed(3):val;
            },
            filterImage(val) {
                return val.replace("_60x60", "_200x200");
            },
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                this.$emit('input', val);
            },
        },
        props: {
            value: {},
            edit: {
                required: true,
                type: Boolean,
            },
            dispose: {
                type: Boolean,
            },
            lookData: {
                required: true,
                type: Object,
            },
            id: {},
            selectMark: {},
            cancelPurchase: {}
        },
        components: {
            card,
            analyze,
            pageDialog: require('../../../components/page-dialog.vue').default,
            labelItem: require('../../../components/label-item.vue').default,
            labelPanel: require('../../../components/label-panel.vue').default,
            addGoods: require('./add-goods.vue').default,
            scrollSelect: require('../../../components/scroll-select.vue').default,
            addSupplier: require('./add-supplier.vue').default,
            priceChange: require('./price-change.vue').default,
            addPrice: require('./add-price.vue').default,
            uiInput: require('../../../components/ui-input.vue').default,
            selectText: require('../../../components/select-text.vue').default,
            uiTips: require('../../../components/ui-tips.vue').default,
            virtualSelect: require('../../../components/virtual-select.vue').default,
            uiLimitNumber: require("../../../components/ui-limit-number.vue").default,
            purchaser: require('../../../api-components/purchaser.vue').default,
            uiTip: require('../../../components/ui-tip.vue').default,
            importExcel: require('./import-excel.vue').default,
            requestButton: require('../../../global-components/request-button.vue').default,
            blowupImage: require("@/components/blowup-image.vue").default,
            // imageUpload:require('./image-upload').default,
        }
    }
</script>
