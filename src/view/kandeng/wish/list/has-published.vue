<template>
    <el-row class="wish-has-published">
        <search-list :search-data="searchData" :clears="clears" @search="search"></search-list>
        <div class="mt-sm ml-sm mb-sm">
            <request-button class="inline mr-sm"
                            v-for="(item,index) in btnslist"
                            :req-key="`clicked_wish${index}`"
                            :mintime="200"
                            :key="index"
                            @click.native='clicked(item.status,index)'>{{item.name}}
            </request-button>
            <permission tag="trendsSelect"
                        class="inline wish-export-select"
                        type="primary"
                        :route="apis.url_publish_export_all"
                        :selects="partAllOptions"
                        @trigger="export_excel"></permission>
            <el-button class="inline el-button-open-close"
                       size="mini"
                       @click.native="open_close"
                       type="primary">{{this.curBtnName}}
            </el-button>
            <permission tag="request-button"
                        class="inline el-button-sku-off-shelf"
                        :mintime="200"
                        req-key="url_batch_disable_variant"
                        @click.native="sku_off_shelf"
                        :route="apis.url_batch_disable_variant">批量下架SKU
            </permission>
            <el-button type="primary" size="mini" class="inline"
                       @click.native="change_price">已更改价格</el-button>
            <permission tag="ElSelect" v-model="option" placeholder="请选择更多操作" clearable class="inline"
                        :route="apis.url_wish_batch_edit">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"
                           @click.native="process(item)"></el-option>
            </permission>
        </div>
        <!--table数据-->
        <ui-table :has-data="publishList.length>0" :first-loading="firstLoading"
                  v-model="checkAll"
                  :body-height="38"
                  @check="check_all"
                  @sort-click="sort_click" ref="table"
                  :heads="[
                        {isCheck:true,width:2},
                        {label:'产品图片',width:8},
                        {label:'平台产品ID',width:12},
                        {label:'平台SPU/本地SPU',width:13},
                        {label:'刊登标题',width:21},
                        {label:'账号简称',width:4},
                        {label:'是否WE',width:4},
                        {label:'审核状态',width:4},
                        {label:'可售量',width:5,isSort:true,order_by:'inventory'},
                        {label:'已收藏',width:5,isSort:true,order_by:'number_saves'},
                        {label:'已售量',width:5,isSort:true,order_by:'number_sold'},
                        {label:'修改状态',width:5},
                        {label:'更新时间',width:6,isSort:true,order_by:'last_updated'},
                        {label:'上传时间',width:6,isSort:true,order_by:'date_uploaded'},
                        {label:'操作',size:150},
                       ]"
                  v-loading="loading"
                  element-loading-text="玩命加载中...">
            <tbody>
            <template v-for="(data, index) in publishList">
                <tr :class="[data.show ? 'active' : '',data.heighLight?'active-color':'',data.lock_update===1?'redborder':'']"
                    @click="addClass(index)" :key="data.id">
                    <td>
                        <el-checkbox v-model="data.isCheck" @change="check_row"></el-checkbox>
                    </td>
                    <td class='relative'>
                        <el-popover placement="right" trigger="hover">
                            <img v-lazy="main_img(data.main_image,'medium')"
                                 @click="search_img(data.main_image)"
                                 width="200px" height="200px">
                            <span slot="reference">
                                  <img v-if="data.is_promoted===1" class='absolute_jewel'
                                       src="../../../../assets/jewel.png">
                                  <img v-lazy="main_img(data.main_image,'small')"
                                       @click="search_img(data.main_image)"
                                       height="60px" width="60px" style="border:none">
                            </span>
                        </el-popover>
                    </td>
                    <td>
                        <i @click="show_detail(data)" :class="[data.show? 'minus':'plus','fl']" title="点击展开菜单"></i>
                        <ui-tip :content="data.product_id" :width="75"></ui-tip>
                    </td>
                    <td style="position: relative">
                        <span @click="bind_spu(data)" v-if="data.goods_id===0">
                             <i class="el-icon-information" style="color:#6699FF" title="点击关联"></i>
                            <ui-tip :content="data.parent_sku||'未关联'" :is-link="true"
                                    style="padding-left: 12px"></ui-tip>
                        </span>
                        <div v-else>
                            <div>{{data.parent_sku}}</div>
                            <div>{{data.local_spu}}</div>
                        </div>
                    </td>
                    <td>
                        <ui-tip :content="data.name" :width="95"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="data.account.code"></ui-tip>
                    </td>
                    <td v-copy>{{data.wish_express_countries|expressFilter}}</td>
                    <td v-copy>{{data.review_status}}</td>
                    <td>{{data.inventory}}</td>
                    <td>{{data.number_saves}}</td>
                    <td>{{data.number_sold}}</td>
                    <td>{{data.lock_update|updateFilter}}</td>
                    <td>
                        <times :time="data.last_updated"></times>
                    </td>
                    <td>
                        <times :time="data.date_uploaded"></times>
                    </td>
                    <td>
                        <trends-select class="inline" @trigger="check(data,$event)" :selects="optionList"
                                       type="primary"></trends-select>
                    </td>
                </tr>
                <template v-if="data.show">
                    <tr style="font-weight:bold" class="variant">
                        <td :rowspan="`${data.skus.length+1}`"></td>
                        <td>
                            <!--<el-checkbox v-model=""></el-checkbox>-->
                        </td>
                        <td>SKU图片</td>
                        <td v-copy>平台SKU</td>
                        <td v-copy>本地SKU</td>
                        <td>颜色</td>
                        <td>尺寸</td>
                        <td>成本价</td>
                        <td>销售价</td>
                        <td>运费</td>
                        <td>可售量</td>
                        <td>发货期</td>
                        <td>平台状态</td>
                        <td>本地状态</td>
                        <td>操作</td>
                        <td :rowspan="`${data.skus.length+1}`"></td>
                    </tr>
                    <tr v-for="(item,i) in data.skus" :key="`${item.sku}${data.id}`" class="variant">
                        <td>
                            <el-checkbox v-model="item.checkSku"></el-checkbox>
                        </td>
                        <td>
                            <el-popover placement="right" trigger="hover">
                                <img v-lazy="main_img(item.main_image,'medium')"
                                     @click="search_img(item.main_image)"
                                     width="200px" height="200px">
                                <span slot="reference">
                                  <img v-lazy="main_img(item.main_image,'small')"
                                       @click="search_img(item.main_image)"
                                       height="60px" width="60px" style="border:none">
                                </span>
                            </el-popover>
                        </td>
                        <td>
                            <ui-tip :content="item.sku"></ui-tip>
                        </td>
                        <td>
                            <ui-tip v-if="item.combine_sku" :content="item.combine_sku"></ui-tip>
                            <span v-else style="color: red">未关联</span>
                        </td>
                        <td>{{item.color}}</td>
                        <td>{{item.size}}</td>
                        <td>
                            <div>{{item.pre_cost}}</div>
                            <div class="costclass" v-if="Number(item.current_cost)>Number(item.pre_cost)">
                                <span>涨价：{{(Number(item.current_cost)-Number(item.pre_cost)).toFixed(2)}}</span>
                            </div>
                            <div class="priceclass" v-if="Number(item.current_cost)<Number(item.pre_cost)">
                                <span>降价：{{(Number(item.pre_cost)-Number(item.current_cost)).toFixed(2)}}</span>
                            </div>
                        </td>
                        <td>$ {{item.price}}</td>
                        <td>$ {{item.shipping}}</td>
                        <td>{{item.inventory}}</td>
                        <td>{{item.shipping_time}}</td>
                        <td>{{item.enabled}}</td>
                        <td>
                            <span>{{item.sell_status}}</span>
                        </td>
                        <td>
                            <span v-for="(act,act_i) in enableList">
                                <span @click="enable_click(act,item,data)"
                                      :class="[act.name===item.enabled||data.is_promoted===1?'opeate-disable':'','operate']">{{act.name}}</span>
                                <span v-if="(enable.length-1)!==act_i">|</span>
                            </span>
                        </td>
                    </tr>
                </template>
            </template>
            </tbody>
        </ui-table>
        <batch-publish v-model="batchVisable"></batch-publish>
        <express v-model="expressVisable" ref="express"></express>
        <add-goods v-model="addlistVisable" @selected="selected"></add-goods>
        <bind-spu v-model="bindVisable" :channel-sku="channelSku" :local-sku="localSku" type="wish"
                  @refresh="update"></bind-spu>
        <action-log v-model="logVisable" :product-id="productId" type="wish"></action-log>
        <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <modify-title v-model="titleVisable" :selected-ids="selectedIds" :type="type" :ebay-status="published"
                      @change-data="change_title"></modify-title>
        <modify-sale-price v-model="salePriceVisable" :selected-ids="selectedIds"
                           @change-data="change_sale_price"></modify-sale-price>
        <modify-carriage v-model="carriageVisable" :selected-ids="selectedIds"
                         @change-data="change_carriage"></modify-carriage>
        <tag-price v-model="tagPriceVisable" :selected-ids="selectedIds" @change-data="change_tag_price"></tag-price>
        <modify-quantity v-model="quantityVisable" :selected-ids="selectedIds"
                         @change-data="change_sale_price"></modify-quantity>
        <modify-delivery v-model="deliveryVisable"
                         :selected-ids="selectedIds"
                         @change-data="change_sale_price"></modify-delivery>
        <batch-we v-model="bacthWe" :product-id="productId" @req-err="req_error"></batch-we>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
        <export-field :param="export_model_type"
                      v-model="exportVisable"
                      :fields="fields" :templates="templates"
                      @getTemplate="get_templates"
                      title="请选择自定义导出字段"
                      :fixparam="fixparam"
                      :creat-excel="creat_excel"></export-field>
        <export-dialog v-model="export_visible"></export-dialog>
    </el-row>
</template>
<style lang="stylus">
    .wish-has-published {
    .el-button + .el-button {
        margin-left: 0px;
    }
    .el-button-open-close {
        margin-left: -4px !important;
    }
    .el-button-sku-off-shelf {
        margin: 0 7px !important;
    }
    .absolute_jewel {
        position: absolute;
        top: 0;
        left: 7px;
    }
    .minus, .plus {
        margin-right: 0;
    }
    .redborder {
        background-color: rgba(250, 172, 171, 0.5) !important;
    }
    .opeate-disable {
        background-color: #cccccc;
        color: #fff;
        cursor: not-allowed;
    }
    .wish-export-select {
        margin-left -4px;
        margin-right 11px;
        top 1px;
    }
    .costclass{
        background: red;
        color:#fff;
        border-radius:2px;
    }
    .priceclass{
        background: #00CC66;
        color:#fff;
        border-radius:2px;
    }
    }
</style>
<script>
    import {
        api_wish_channel,
        api_publish_wish_export,
        api__wish_all_list,
        api_wish_enable_batch,
        api_wish_disable_batch,
        api_wish_rsynclisting,
        api_wish_editrsynclisting,
        api_wish_disable_sku,
        api_wish_enable_sku,
        api_get_wish_expressData,
        api_publish_export_fields,
        api_get_wish_users,
        api_batch_close_we,
        api_batch_disable_variant,
        url_publish_export_all,
        api_publish_export,
        api_publish_export_all,
        api_get_change_cost_price,
        api_adjust_cost_batch,
        api_wish_rsyncNowListing
    } from "../../../../api/kandeng"
    import {
        url_wish_product_save,
        url_wish_enable_batch,
        url_wish_disable,
        url_wish_rsynclisting,
        url_wish_editrsynclisting,
        url_wish_batch_edit,
        url_wish_disable_sku,
        url_get_wish_expressData,
        url_batch_close_we,
        url_batch_disable_variant,
        url_wish_enable_sku, url_publish_wish_export
    } from "../../../../api/kandeng";
    import {api_add_goods} from "../../../../api/supplier-quote"
    import {operateList} from './action';//------操作按钮引入
    import {downloadFile} from '../../../../lib/http';
    import {get_path} from '../../ebay/kandeng-list/add-edit-listing/get-path';
    import {api_goods_export_template} from '../../../../api/product-library';

    export default {
        permission: {
            url_wish_product_save,
            url_wish_enable_batch,
            url_wish_disable,
            url_wish_rsynclisting,
            url_wish_editrsynclisting,
            url_wish_batch_edit,
            url_wish_disable_sku,
            url_wish_enable_sku,
            url_publish_wish_export,
            url_get_wish_expressData,
            url_batch_close_we,
            url_batch_disable_variant,
            url_publish_export_all,
        },
        data() {
            return {
                cloneSearchData: {},
                baseUrl: "",
                productId: "",
                firstLoading: true,
                pickerstart: {
                    disabledDate: (time) => {
                        if (this.searchData.end_time) {
                            return time.getTime() > this.searchData.end_time.getTime()
                        } else {
                            return false
                        }
                    }
                },
                pickerend: {
                    disabledDate: (time) => {
                        if (this.searchData.start_time) {
                            return time.getTime() < this.searchData.start_time.getTime()
                        } else {
                            return false
                        }
                    }
                },
                logVisable: false,
                addlistVisable: false,
                total: 0,
                loading: false,
                option: "",
                expressVisable: false,
                mdfVisable: false,
                publishList: [],
                checkAll: false,
                batchVisable: false,
                bacthWe: false,
                flag: 0,
                channelSku: [],
                localSku: {
                    data: []
                },
                productId: '',
                bindVisable: false,
                fixedSearch: {
                    status: 1,//已刊登值为1
                    accountType: "short",
                    order: "",
                    order_by: "",
                },
                searchData: {
                    ntime: "date_uploaded",
                    number_sold: "",
                    application: '',
                    is_promoted: '',
                    nType: "product_id",
                    nContent: "",
                    accountVal: "",
                    review_status: "",
                    enabled: "",
                    wish_express: "",
                    start_time: "",
                    end_time: "",
                    sell_status: '',
                    searchPrice: "total",
                    minPrice: "",
                    maxPrice: "",
                    uid: "",
                    adjusted_price:'',
                    adjust_range:'',
                },
                page: 1,
                pageSize: 50,
                clears: {
                    ntime: "date_uploaded",
                    nType: "product_id",
                    searchPrice: "total",
                },
                idList: [],
                rows: {},
                btnList: [//----------------------------------------------操作按钮
                    {name: '从产品库批量刊登', clickName: '', status: 2, api: url_wish_product_save},
                    {name: '批量设置WE', clickName: '', status: 3, api: url_get_wish_expressData},
                    {name: '批量关闭WE', clickName: '', status: 10, api: url_batch_close_we},
                    {name: '批量上架', clickName: 'putaway', status: 4, api: url_wish_enable_batch},
                    {name: '批量下架', clickName: '', status: 5, api: url_wish_disable},
                    {name: '同步Listing', clickName: '', status: 7, api: url_wish_rsynclisting},
                    {name: '导出为小平台格式', clickName: '', status: 9, api: url_publish_wish_export},
                ],
                enable: [
                    {
                        name: '上架', api: url_wish_enable_sku, action(item, opeate) {
                            this.$confirm(`您将${opeate.name} ${item.sku}`, '提示', {
                                confirmButtonText: "确定",
                                cancelButtonText: "取消",
                                type: "warning"
                            }).then(() => {
                                this.$http(api_wish_enable_sku, {sku: item.variant_id}).then(res => {
                                    this.$message({type: "success", message: res.message || res});
                                    item.enabled = '上架';
                                }).catch(code => {
                                    this.$message({type: "error", message: code.message || code})
                                })
                            }).catch(() => {
                                this.$message({
                                    type: "info",
                                    message: "已取消"
                                })
                            })
                        }
                    },
                    {
                        name: '下架', api: url_wish_disable_sku, action(item, opeate) {
                            this.$confirm(`您将${opeate.name} ${item.sku}`, '提示', {
                                confirmButtonText: "确定",
                                cancelButtonText: "取消",
                                type: "warning"
                            }).then(() => {
                                this.$http(api_wish_disable_sku, {sku: item.variant_id}).then(res => {
                                    this.$message({type: "success", message: res.message || res});
                                    item.enabled = '下架';
                                }).catch(code => {
                                    this.$message({type: "error", message: code.message || code})
                                })
                            }).catch(() => {
                                this.$message({
                                    type: "info",
                                    message: "已取消"
                                })
                            })
                        }
                    },
                ],
                selectedIds: [],
                titleVisable: false,
                salePriceVisable: false,
                carriageVisable: false,
                tagPriceVisable: false,
                quantityVisable: false,
                deliveryVisable: false,
                type: "",
                published: "already",
                imgDialog: false,
                imgPath: "",
                isOpen: false,
                partAllOptions: [
                    {name: "部分导出", value: 0},
                    {name: "全部导出", value: 1}
                ],
                exportVisable: false,
                export_model_type: {
                    type: 7
                },
                fields: [],
                templates: [],
                export_visible: false,
                export_type: '',
                remarkDialog: false,
                remarkTitle: '',
                batch_api: '',
                batch_action: '',
                export_channel_id: 3
            }
        },
        mounted() {
            this.init();
            this.get_fields();
            this.get_templates();
        },
        computed: {
            filterSelectsLists() {
                return this.publishList.filter(row => row.isCheck);
            },
            curBtnName() {
                let find = this.publishList.find(row => !row.show);
                return !!find ? '一键展开' : '一键收起';
            },
            btnslist() {
                return this.btnList.filter(row => {
                    return this.$hasPermission(row.api)
                })
            },
            optionList() {
                return operateList.filter(row => {
                    return this.$hasPermission(row.api) && row.stauts.includes(1)
                })
            },
            enableList() {
                return this.enable.filter(row => {
                    return this.$hasPermission(row.api)
                })
            },
        },
        methods: {
            req_error(val){
                this.searchData.nContent = val.join(',');
                let data = window.clone(this.searchData);
                this.$http(api__wish_all_list, data).then(res => {
                    this.baseUrl = res.base_url;
                    res.data && res.data.forEach(row => {
                        row.show = false;
                        row.isCheck = false;
                        row.heighLight = false;
                        row.num = "";
                        row.skus && row.skus.forEach(res => {
                            this.$set(res, 'checkSku');
                        });
                    });
                    this.publishList = res.data;
                    this.total = res.count;
                    this.loading = false;
                    this.searchData.nContent = ''
                }).catch(code => {
                    console.log(code);
                });
            },
            get_path,
            main_img(image, size) {
                if (image.includes('http')) {
                    if (image.includes('original')) {
                        return image.replace('original', size);
                    }
                    if (image.includes('small')) {
                        return image.replace('small', size);
                    }
                    if (image.includes('medium')) {
                        return image.replace('medium', size);
                    }
                    if (image.includes('large')) {
                        return image.replace('large', size);
                    }
                }
                switch (size) {
                    case 'small':
                        return this.get_path(image, '_60x60.', this.baseUrl);
                        break;
                    case 'medium':
                        return this.get_path(image, '_200x200.', this.baseUrl);
                        break;
                    case 'large':
                        return this.get_path(image, '_500x500.', this.baseUrl);
                        break;
                    default:
                        break;

                }
            },
            search_img(image) {
                this.imgPath = this.main_img(image, 'large');
                this.imgDialog = true;
            },
            change_listing_status(val, attr) {
                val.forEach(out => {
                    let find = this.publishList.find(row => {
                        return row[attr] === out[attr];
                    });
                    if (!!find) {
                        find.lock_update = 1;
                    }
                });
            },
            change_title(val) {
                this.change_listing_status(val, "product_id");
            },
            change_sale_price(val) {
                this.change_listing_status(val, "product_id");
            },
            change_carriage(val) {
                this.change_listing_status(val, "product_id");
            },
            change_tag_price(val) {
                this.change_listing_status(val, "product_id");
            },
            update() {
                let find = this.publishList.find(row => {
                    return row.product_id === this.channelSku[0].parant_id
                });
                find && (find.goods_id = this.channelSku[0].local[0].good_id);
                find && find.skus.forEach(row => {
                    let sku = this.channelSku.find(item => {
                        return item.id === row.vid
                    });
                    sku && this.$set(row, 'skumap', {sku_id: sku.local[0].sku_id, sku_code: sku.local[0].local_sku})
                })
            },
            bind_spu(data) {
                if (data.skus.length) {
                    this.addlistVisable = true;
                    this.channelSku = window.clone(data.skus).map(row => {
                        return {
                            parant_id: data.product_id,
                            id: row.vid,
                            sku: row.sku,
                            size: row.size,
                            color: row.color,
                            key: [{name: '颜色', field: 'color'}, {name: '尺寸', field: 'size'}],
                            local: [
                                {local_sku_id: "", good_id: '', sku_id: '', quantity: 1, local_sku: ''}
                            ]
                        }
                    });
                } else {
                    //todo 无sku时
                }
            },
            selected(val) {
                let spu = val.map(row => row.spu).join(',');
                this.$http(api_add_goods, {page: 1, pageSize: 100, snType: 'spu', snText: spu}).then(res => {
                    this.localSku = res;
                    this.bindVisable = true;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })
            },
            enable_click(act, item, data) {
                if (item.enabled === act.name || data.is_promoted === 1) {
                    return
                }
                act.action.call(this, item, act)
            },
            sort_click(val) {
                this.fixedSearch.order = val.order;
                this.fixedSearch.order_by = val.order_by;
                let curData = JSON.stringify(this.searchData);
                sessionStorage.setItem('searchData', curData);
                let curFixdData = JSON.stringify(this.fixedSearch);
                sessionStorage.setItem('searchFixdData', curFixdData);
                this.init();
            },
            open_close() {
                if (!this.isOpen) {
                    this.publishList.forEach(row => {
                        row.show = true;
                    });
                    this.isOpen = true;
                } else {
                    this.publishList.forEach(row => {
                        row.show = false;
                    });
                    this.isOpen = false;
                }
                this.check_sku(this.cloneSearchData);
            },
            sku_off_shelf() {
                let variants = [];
                this.publishList.forEach(row => {
                    if (row.skus) {
                        let v = row.skus.filter(res => res.checkSku).map(res => res.variant_id);
                        variants = [...variants, ...v];
                    }
                });
                if (variants.length <= 0) {
                    this.$reqKey('url_batch_disable_variant', false);
                    return this.$message({type: 'warning', message: '请先核对需要下架的SKU'});
                }
                let isWarning = false;
                this.publishList.forEach(row => {
                    if (row.skus) {
                        let find = row.skus.find(it => !!it.checkSku);
                        if (find && !!row.is_promoted) isWarning = true;
                    }
                });
                if (isWarning) {
                    this.$confirm('Warning: At least one of these products is promoted.\n' +
                        '\n' +
                        'If all variations of a promoted product are disabled and the product had sales in the last 9 days, you are at risk of being fined $50 USD for each promoted product disabled', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.disable_variant(variants);
                    }).catch(code => {
                        this.$message({
                            type: 'info',
                            message: `已取消删除!`
                        })
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('url_batch_disable_variant', false);
                        }, 200);
                    });
                } else {
                    this.$confirm('您将对已选Listing执行批量下架, 确认此操作吗', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.disable_variant(variants);
                    }).catch(code => {
                        this.$message({
                            type: 'info',
                            message: `已取消删除!`
                        })
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('url_batch_disable_variant', false);
                        }, 200);
                    });
                }

            },
            disable_variant(variants) {//批量下架SKU
                this.$http(api_batch_disable_variant, {variants: variants}).then(res => {
                    this.$message({type: "success", message: res.message || res});
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('url_batch_disable_variant', false);
                    }, 200);
                })
            },
            check_sku(data) {
                if (!!data.nType && data.nContent) {
                    if (data.nType === 'sku') {
                        this.publishList.forEach(row => {
                            if (row && row.skus) {
                                let list = row.skus.filter(res => !!res.sku.includes(data.nContent));
                                list.forEach(res => res.checkSku = true);
                            }
                        })
                    } else {
                        this.publishList.forEach(row => {
                            if (row && row.skus) {
                                row.skus.forEach(res => res.checkSku = true);
                            }
                        })
                    }
                }
            },
            //初始化
            init_params() {
                this.searchData = JSON.parse(sessionStorage.getItem("searchData"))||this.searchData;
                this.fixedSearch = JSON.parse(sessionStorage.getItem("searchFixdData")) || this.fixedSearch;
                let data = window.clone(this.searchData);
                Object.assign(data, this.fixedSearch);
                if (data.nType !== 'name' && data.nContent.trim().length > 0) {
                    data.nContent = data.nContent.trim().replace(/\s/g, '\n').split('\n').filter(row => row !== '').join(',');
                } else {
                    data.nContent = data.nContent.trim();
                }
                data.page = this.page;
                data.pageSize = this.pageSize;
                this.cloneSearchData = clone(data);
                return data
            },
            init() {
                let data = this.init_params();
                this.loading = true;
                return this.$http(api__wish_all_list, data).then(res => {
                    this.baseUrl = res.base_url;
                    res.data && res.data.forEach(row => {
                        row.show = false;
                        row.isCheck = false;
                        row.heighLight = false;
                        row.num = "";
                        row.skus && row.skus.forEach(res => {
                            this.$set(res, 'checkSku');
                        });
                    });

                    this.publishList = res.data;
                    this.total = res.count;
                    this.loading = false;
                    return Promise.resolve();
                }).catch(code => {
                    console.log(code);
                });
            },
            //批量上架
            batch_enable(index) {
                let arr = this.filterSelectsLists.map(row => row.product_id);
                if (arr.length === 0) {
                    this.$reqKey(`clicked_wish${index}`, false);
                    this.$message({
                        message: '请选择上架的商品',
                        type: 'warning'
                    });
                    return;
                }
                let ids = arr.join(",");
                this.$confirm(`您将对已选Listing执行批量上架, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_wish_enable_batch, {product_id: ids}).then(res => {
                        this.$message({
                            type: "success",
                            message: res.message || res
                        });
                        this.operate_offline(arr, "上架");
                    }).catch(code => {
                        this.$message({message: code.message || code, type: 'error'});
                    }).finally(() => {
                        this.$reqKey(`clicked_wish${index}`, false);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消上架'
                    });
                }).finally(() => {
//                    setTimeout(() => {
//                        this.$reqKey('clicked_wish', false);
//                    }, 200);
                    this.$reqKey(`clicked_wish${index}`, false);
                });
            },
            //批量下架
            batch_disable(index) {
                let find = this.publishList.find(res => res.isCheck && !!res.is_promoted);
                if (!!find) {
                    this.$reqKey(`clicked_wish${index}`, false);
                    return this.$message({type: "warning", message: `SPU:${find.parent_sku}为促销产品，不允许下架！`});
                }
                let arr = this.filterSelectsLists.map(row => row.product_id);
                if (arr.length === 0) {
                    this.$reqKey(`clicked_wish${index}`, false);
                    this.$message({
                        message: '请选择下架的商品',
                        type: 'warning'
                    });
                    return;
                }
                let ids = arr.join(",");
                this.$confirm(`您将对已选Listing执行批量下架, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_wish_disable_batch, {product_id: ids}).then(res => {
                        this.$message({
                            type: "success",
                            message: res.message || res
                        });
                        this.operate_offline(arr, "下架");
                    }).catch(code => {
                        this.$message({message: code.message || code, type: 'error'});
                    }).finally(() => {
                        this.$reqKey(`clicked_wish${index}`, false);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消下架'
                    });
                }).finally(() => {
                    this.$reqKey(`clicked_wish${index}`, false);
                });
            },
            operate_offline(arr, status) {
                arr.forEach(out_row => {
                    this.publishList.forEach(row => {
                        if (out_row === row.product_id) {
                            row.skus.forEach(inner => {
                                this.$set(inner, 'enabled', status);
                            });
                            this.$set(row, 'lock_update', 1);
                        }
                    });
                });
            },
            rsyncNowListing(){
                let arr = this.filterSelectsLists.map(row => row.product_id);
                let ids = arr.join(',');
                this.$http(api_wish_rsyncNowListing,{queue:ids}).then(res=>{
                    this.$message({
                        type: "success",
                        message: res.message || res
                    });
                    this.init();
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                })
            },
            rsynclisting(index) {
                let arr = this.filterSelectsLists.map(row => row.product_id);
                if (arr.length === 0) {
                    this.$reqKey(`clicked_wish${index}`, false);
                    this.$message({
                        message: '请选择同步的商品',
                        type: 'warning'
                    });
                    return;
                }
                let ids = arr.join(",");
                this.$confirm(`您将对已选Listing执行同步, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_wish_rsynclisting, {queue: ids}).then(res => {
                        this.$message({
                            type: "success",
                            message: res.message || res
                        });
                        this.init();
                    }).catch(code => {
                        this.$message({message: code.message || code, type: 'error'});
                    }).finally(() => {
                        this.$reqKey(`clicked_wish${index}`, false);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消同步'
                    });
                }).finally(() => {
                    this.$reqKey(`clicked_wish${index}`, false);
                });
            },
            change_price(){
                let selects_lists = this.filterSelectsLists;
                if (selects_lists.length === 0) {
                    return this.$message({type: 'warning', message: '请勾选需要更改的数据'});
                };
                let data = [];
                selects_lists.forEach(row=>{
                    let skusData = row.skus.map(res=>{
                        return {
                            pre_cost:res.pre_cost,
                            current_cost:res.current_cost,
                            vid:res.vid,
                        }
                    })
                    data.push(...skusData);
                });
                this.$confirm(`将去除勾选的价格变动提醒, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.$http(api_adjust_cost_batch,{data: data}).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    })
                }).catch(() => {
                    this.$message({type: 'info', message: '已取消'});
                });
            },
            //查看下拉
            show_detail(data) {
                data.show = !data.show;
                if (data.show) {//单个核查
                    if (!!this.cloneSearchData.nType && this.cloneSearchData.nContent) {
                        if (this.cloneSearchData.nType === 'sku') {
                            if (data.skus) {
                                let list = data.skus.filter(res => res.sku.includes(this.cloneSearchData.nContent));
                                list.forEach(res => res.checkSku = true);
                            }
                        } else {
                            if (data.skus) {
                                data.skus.forEach(res => res.checkSku = true);
                            }
                        }
                    }
                }
            },
            check_row() {
                this.checkAll = !this.publishList.find(row => !row.isCheck);
            },
            // 点击全部
            check_all(val) {
                this.publishList.forEach(row => {
                    row.isCheck = val;
                });
            },
            // 点击行 高亮
            addClass(index) {
                this.publishList.forEach(row => {
                    row.heighLight = false;
                });
                this.publishList[index].heighLight = true;
            },
            change_updata(index) {
                let arr = [];
                this.publishList.forEach(row => {
                    if (row.isCheck && row.lock_update === 1) {
                        arr.push(row.product_id);
                    }
                });
                if (arr.length === 0) {
                    this.$reqKey(`clicked_wish${index}`, false);
                    this.$message({
                        message: '请选择已修改的商品',
                        type: 'warning'
                    });
                    return;
                }
                this.$confirm(`您将对已选Listing执行更新, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_wish_editrsynclisting, {product_id: arr.join(",")}).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                        this.init();
                    }).catch(code => {
                        this.$message({message: code.message || code, type: 'error'});
                    }).finally(() => {
                        this.$reqKey(`clicked_wish${index}`, false);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消更新'
                    });
                }).finally(() => {
                    this.$reqKey(`clicked_wish${index}`, false);
                });
            },
            clicked(status,index) {//------------------------------------操作不同按钮执行的事件
                switch (status) {
                    case 2:
                        this.$reqKey(`clicked_wish${index}`, false);
                        this.batchVisable = true;
                        break;
                    case 3:
                        this.productId = this.filterSelectsLists.map(row => row.product_id);
                        this.$reqKey(`clicked_wish${index}`, false);
                        if (this.productId.length <= 0) return this.$message({
                            type: "warning",
                            message: "请选择需要批量操作的产品"
                        });
                        this.bacthWe = true;
                        break;
                    case  4:
                        this.batch_enable(index);
                        break;
                    case  5:
                        this.batch_disable(index);
                        break;
                    case  7:
                        this.rsynclisting(index);
                        break;
                    case  8:
                        this.change_updata(index);
                        break;
                    case 9:
                        this.export_data(index);
                        break;
                    case 10:
                        this.batch_close_we(index);
                        break;
                }
            },
            export_data(index) {
                let selects_lists = this.filterSelectsLists;
                if (selects_lists.length === 0) {
                    this.$reqKey(`clicked_wish${index}`, false);
                    this.$message({type: 'warning', message: '请勾选需要导出的数据'});
                    return
                }
                let data = {
                    ids: selects_lists.map(row => row.id)
                };
                this.$http(api_publish_wish_export, data).then(res => {
                    let url = config.apiHost + 'downloadFile/downExportFile';
                    let data = {
                        file_code: res.file_code,
                    };
                    downloadFile({
                        url: url,
                        get: data,
                        fileName: res.file_name,
                        suffix: '.xls',
                    });
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    this.$reqKey(`clicked_wish${index}`, false);
                });
            },
            batch_close_we(index) {
                let checkList = this.filterSelectsLists;
                if (checkList.length <= 0) {
                    this.$reqKey(`clicked_wish${index}`, false);
                    return this.$message({type: 'warning', message: '请选择需要批量操作的数据'});
                }
                let find = checkList.find(row => row.is_promoted);
                if (find) {
                    this.$confirm('Warning: At least one of these products is promoted.\n' +
                        '\n' +
                        'If all variations of a promoted product are disabled and the product had sales in the last 9 days, you are at risk of being fined $50 USD for each promoted product disabled', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.api_close_we(checkList);
                    }).catch(code => {
                        this.$message({
                            type: 'info',
                            message: `已取消删除!`
                        })
                    }).finally(() => {
                        this.$reqKey(`clicked_wish${index}`, false);
                    });
                } else {
                    this.$confirm('您将对已选Listing执行批量关闭 Wish Express, 确认此操作吗', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.api_close_we(checkList);
                    }).catch(code => {
                        this.$message({
                            type: 'info',
                            message: `已取消删除!`
                        })
                    }).finally(() => {
                        this.$reqKey(`clicked_wish${index}`, false);
                    });
                }
            },
            api_close_we(checkList) {
                let productIds = checkList.map(row => row.product_id).join(';');
                this.$http(api_batch_close_we, {product_ids: productIds}).then(res => {
                    this.$message({type: "success", message: res.message || res});
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('clicked_wish', false);
                    }, 200);
                })
            },
            process(option) {//--------------操作更多按钮的事件处理
                if (option.status === 0) {
                    return;
                }
                let arr = this.filterSelectsLists;
                if (arr.length === 0&&option.status!=='7') {
                    this.$message({message: "请选择要批量修改的数据", type: 'warning'});
                    return;
                }else if(arr.length===0&&option.status==='7'){
                    this.$message({message: "请选择要批量同步的数据", type: 'warning'});
                    return;
                } else if(arr.length!==0&&option.status==='7'){
                    this.rsyncNowListing()
                }
                let table = [];
                arr.forEach(rows => {
                    rows.skus.forEach(inner => {
                        if (!inner.product_id) {
                            this.$set(inner, "product_id", rows.product_id);
                        }
                        this.$set(inner, "is_promoted", rows.is_promoted);
                    });
                    table = table.concat(rows.skus);
                });
                this.selectedIds = window.clone(table);
                switch (option.status) {
                    case 1:  //批量修改刊登标题
                        this.titleVisable = true;
                        this.type = "name";
                        let table = [];
                        arr.forEach(rows => {
                            table.push({product_id: rows.product_id, name: rows.name})
                        });
                        this.selectedIds = window.clone(table);
                        break;
                    case 2:  //批量修改销售价
                        this.salePriceVisable = true;
                        break;
                    case 3:  //批量修改运费
                        this.carriageVisable = true;
                        break;
                    case 4://批量修改吊牌价
                        this.tagPriceVisable = true;
                        break;
                    case 5://批量修改可售数量
                        this.quantityVisable = true;
                        break;
                    case 6:     //批量修改发货期
                        this.deliveryVisable = true;
                        break;
                    default:
                        break
                }
            },
            check(row, num) {//---------------------查看按钮
                let operate = operateList.find(function (operate) {
                    return operate.value === num.value
                });
                operate.action.call(this, row, 1);
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.init();
            },
            handleCurrentChange(val) {
                this.page = val;
                this.init();
            },
            search(data) {
                this.isOpen = false;
                this.firstLoading = false;
                this.searchData = data;
                let curData = JSON.stringify(data);
                sessionStorage.setItem('searchData', curData);
                let curFixdData = JSON.stringify(this.fixedSearch);
                sessionStorage.setItem('searchFixdData', curFixdData);
                this.init();
            },
            fixparam(list) {
                return list.map(row => {
                    return {
                        title: row.show_field,
                        key: row.field
                    }
                });
            },
            export_sku(url, params) {
                return this.$http(url, params).then(res => {
                    if (this.export_type === 1) {
                        this.export_visible = true;
                        this.$message({type: "success", message: res.message || res});
                    } else {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let params = {
                            file_code: res.file_code,
                            page: this.page,
                            pageSize: this.pageSize,
                        };
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                        this.$message({type: "success", message: '导出成功' || res});
                    }
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            get_fields() {
                this.$http(api_publish_export_fields, {channel_id: this.export_channel_id}).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            get_templates() {
                this.$http(api_goods_export_template, {type: 7}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    });
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            export_excel(val) {
                if (val.value === 0 && this.filterSelectsLists.length === 0) {
                    return this.$message({
                        type: "warning",
                        message: "请先选择需要导出的数据"
                    });
                }
                this.export_type = val.value;
                this.exportVisable = true;
            },
            creat_excel(param) {
                let data = '';
                let url = '';
                switch (this.export_type) {
                    case 0://部分
                        url = api_publish_export;
                        data = {
                            ids: this.filterSelectsLists.map(row => {
                                return row.id
                            }).join(','),
                            channel_id: this.export_channel_id,
                            fields: JSON.stringify(param)
                        };
                        return this.export_sku(url, data);
                        break;
                    case 1://全部
                        url = api_publish_export_all;
                        data = this.init_params();
                        data.channel_id = this.export_channel_id;
                        data.fields = JSON.stringify(param);
                        return this.export_sku(url, data);
                        break;
                }
            },
        },
        filters: {
            updateFilter(val) {
                if (val === 1) {
                    return "待同步";
                } else {
                    return "--";
                }
            },
            expressFilter(val) {
                if (val === "") {
                    return "否";
                } else {
                    return "是";
                }
            },
            selects() {
                return this.publishList.filter(row => row.isCheck).map(row => row.id)
            },
        },
        props: {
            options: {
                required: true,
                type: Array
            },
        },
        components: {
            express: require("./express.vue").default,
            uiTable: require("../../../../components/ui-table.vue").default,
            uiTip: require("../../../../components/ui-tip.vue").default,
            searchList: require("./search-list.vue").default,
            batchPublish: require("./batch-publish.vue").default,
            batchWe: require('./has-published/batch-we.vue').default,
            batchEdit: require("./batch-edit.vue").default,
            trendsSelect: require('../../../../components/trends-select.vue').default,
            paramAccount: require("../../../../api-components/param-account.vue").default,
            addGoods: require('../info/add-goods.vue').default,
            bindSpu: require('../../bind-spu.vue').default,
            actionLog: require("./action-log.vue").default,
            modifyTitle: require('../../list-operate/modify-title.vue').default,
            modifySalePrice: require('./has-published/modify-saleprice.vue').default,
            salesPrice: require('./has-published/sales-price.vue').default,
            modifyCarriage: require('./has-published/modify-carriage.vue').default,
            tagPrice: require('./has-published/tag-price.vue').default,
            modifyQuantity: require('./has-published/modify-quantity.vue').default,
            modifyDelivery: require('./has-published/modify-delivery.vue').default,
            blowupImage: require("../../../../components/blowup-image.vue").default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('../../../report/export-dialog').default,
        }
    }
</script>
