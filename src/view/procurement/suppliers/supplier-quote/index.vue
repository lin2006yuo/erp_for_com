<template>
    <page class="p-index p-index-supplier-quote" style="position: relative">
        <search-card @search="search" :params="searchParams" :clears="clears">
            <div>
                <label-buttons class="ml-sm" label="审核状态：" @select="change_status" :buttons="statusList"
                                v-model="status" title="请选择审核状态"></label-buttons>
            </div>
                <label class="ml-sm" title="请输入供应商">供应商：</label>
                <supplier class="inline s-width-large" v-sf.supplierId :placeHolder="true"
                          v-model="searchParams.supplierId"></supplier>
                <el-select v-sf.searchdata v-model="searchParams.searchdata"  class="inline s-width-small ml-sm" @change="change_buyer_brand">
                    <el-option :key="item.value" v-for="item in buyerBrand" :value="item.value"
                                :label="item.label"></el-option>
                </el-select>
                <purchaser v-show="searchParams.searchdata==='buyer_id'" class="inline s-width-default" v-sf.buyer_id v-model="searchParams.buyer_id"></purchaser>
                <el-select v-show="searchParams.searchdata==='brand_id'" v-sf.brand_id v-model="searchParams.brand_id"
                           class="inline s-width-default"
                            filterable clearable>
                    <el-option v-for="item in brandList" :key="item.id" :value="item.id"
                                :label="item.name"></el-option>
                </el-select>
                <el-select v-sf.snType v-model="searchParams.snType" class="ml-sm s-width-small inline">
                    <el-option v-for="item in searchList" :key="item.value" :value="item.value"
                                :label="item.label"></el-option>
                </el-select>
                <orderInput class="inline width-super" @keydown='key_down'  v-sf.snText
                            placeholder="可批量搜索，Shift+回车换行..."
                            v-model="searchParams.snText"></orderInput>
                <el-select class="ml-sm s-width-small inline" v-model="searchParams.date_s" v-sf.date_s>
                    <el-option v-for="item in filTime" :key="item.value"
                    :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
            <!--<label class="ml-sm" >创建时间：</label>-->
                <el-date-picker
                        class="inline date"
                        v-model="searchParams.date_b"
                        v-sf.date_b
                        type="date"
                        placeholder="开始时间"
                        :picker-options="pickerStart"
                >
                </el-date-picker>&nbsp;--&nbsp;
                <el-date-picker
                        class="inline date mr-sm"
                        v-sf.date_e
                        v-model="searchParams.date_e"
                        type="date"
                        placeholder="结束时间"
                        :picker-options="pickerEnd"
                >
                </el-date-picker>
            <label class="inline ml-sm" title="请输入起订量区间">最小起订量：</label>
            <ui-limit-number
                v-sf.min_qty_b
                v-model="searchParams.min_qty_b"
                placeholder="起订最小值"
                @keyup.enter.native="search"
                :limit="0"
                :min="1"
                class="inline enter-result s-width-mini"></ui-limit-number>&nbsp;--
            <ui-limit-number
                v-sf.min_qty_e
                v-model="searchParams.min_qty_e"
                placeholder="起订最大值"
                @keyup.enter.native="search"
                :limit="0"
                :min="searchParams.min_qty_b||1"
                class="inline enter-result s-width-mini"></ui-limit-number>
        </search-card>
        <goods-classify ref="classifyPart" :leftControllerTitle="leftControllerTitle">
            <!-- 按钮 -->
            <div slot="button-list">
                <permission
                    tag="ElButton"
                    :route="apis.url_import_suppliers"
                    class="inline"
                    type="primary"
                    size="mini"
                    @click.native="showImport=true">导入报价
                </permission>
                <permission
                    tag="ElButton"
                    :route="apis.url_add_supplier_offer"
                    class="inline ml-sm"
                    type="primary"
                    size="mini"
                    @click.native="add2">添加报价
                </permission>
                <trends-select
                    class="inline ml-xs"
                    v-if="this.curStatus===0"
                    style="top: 1px;left: 1px;"
                    :selects="handleList"
                    type="primary"
                    @trigger="select_handle"></trends-select>
                <request-button
                    :request="export_csv"
                    class="inline ml-xs"
                    req-key="export_csv"
                    :mintime="200"
                    :disabled="selectId.length <= 0">导出
                </request-button>
            </div>
            <div class="fr" slot="other" style="margin:18px 5px 0 0;">
                <label class="color-lump issue"></label><span>：错误供应商</span>
            </div>
            <!-- 商品列表树 -->
            <goods-tree slot="goods-tree"
                @hidden-left="$refs.classifyPart.showLeft(true)"
                @change-category="node_click">
            </goods-tree>
            <!-- 表格 -->
            <el-table class="mt-xs scroll-bar aleady-table"
                        slot="goods-tabel"
                    border
                    v-resize="{height:50}"
                    :data="table.dataList"
                    v-loading="isLoading"
                    :row-class-name="row_class_name"
                    element-loading-text="玩命加载中..."
                    highlight-current-row
                    @selection-change="selection_change">
                <div slot="empty" class="no-data-reminder">
                    <i></i>
                    {{emptyText}}
                </div>
                <el-table-column type="selection" align="center" width="30"></el-table-column>
                <el-table-column label="图片" inline-template width="70">
                    <el-popover
                            placement="right"
                            trigger="hover">
                        <img v-lazy="sku_image(row.thumb)" width="200px" height="200px">
                        <span slot="reference" v-if="row.thumb">
                                <img v-lazy="row.thumb"
                                    style="vertical-align:middle;height:60px;width:60px;border:none">
                            </span>
                    </el-popover>
                </el-table-column>
                <el-table-column label="SKU/别名" width="80" inline-template>
                    <div>
                        <div>{{row.sku}}</div>
                        <ui-tip :content="row.sku_alias|filterAlias" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="名称" inline-template>
                    <div v-if="row.company_name">
                        <div :title="row.name">{{row.name}}</div>
                    </div>
                    <div v-else>
                        <div style="color:red !important;" class="text_line">{{row.name}}</div>
                    </div>
                </el-table-column>
                <el-table-column label="供应商" min-width="68" inline-template row-key="company_name">
                    <div v-if="row.company_name">
                        <ui-tip :content="row.company_name" :width="98"></ui-tip>
                    </div>
                    <div v-else class="red">错误供应商</div>
                </el-table-column>
                <el-table-column label="最小起订量" inline-template min-width="60">
                    <div>{{row.min_qty}}</div>
                </el-table-column>
                <el-table-column label="最新报价" inline-template min-width="60">
                    <div><span>{{row.currency_code}}</span> <span>{{row.price|filterPrice}}</span></div>
                </el-table-column>
                <el-table-column label="区间报价" align="center" inline-template width="160">
                    <div v-for="item in row.section" :key="item.min_quantity">
                        <span>{{item.min_quantity}}</span>~<span>{{item.max_quantity?item.max_quantity:'无穷大'}}</span>&nbsp;/&nbsp;<span>{{row.currency_code}}</span>&nbsp;<span>{{item.price | filterPrice}}</span>
                    </div>
                </el-table-column>
                <el-table-column align="center" label="3月内最低报价" inline-template min-width="70">
                    <div><span v-if="!!row.lowest&&!isNaN(Number(row.lowest))">{{row.currency_code}}</span> <span>{{row.lowest|filterPrice}}</span></div>
                </el-table-column>
                <el-table-column label="180天内是否有采购" inline-template min-width="84">
                    <div>{{row.is_purchase | filterPur}}</div>
                </el-table-column>
                <el-table-column label="最新报价人员" prop="creator_name" min-width="70">
                </el-table-column>
                <el-table-column label="最新报价时间" inline-template min-width="70">
                    <div>
                        <times :time="filterTimeType(row)" v-if="filterTimeType(row)"></times>
                        <div v-else>-- --</div>
                    </div>
                </el-table-column>
                <el-table-column label="采购链接" min-width="70" inline-template>
                    <div v-if="row.company_name">
                        <a :href="`${row.link}`" target="_blank">
                            <div class="text_line"  style="color: #69f;">{{row.link}}</div>
                        </a>
                    </div>
                    <div v-else>
                        <a :href="`${row.link}`" target="_blank">
                            <div class="text_line"  style="color: red;">{{row.link}}</div>
                        </a>
                    </div>
                </el-table-column>
                <el-table-column label="审核状态" align="center" inline-template min-width="55">
                    <div>{{row.status | filterStatus}}</div>
                </el-table-column>
                <el-table-column label="审核不通过原因" align="center" inline-template min-width="55"
                                v-if="this.curStatus===2">
                    <div>
                        <ui-tip :content="row.remark" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column inline-template label="操作" min-width="55">
                    <div>
                        <permission tag="span" :route="apis.url_history_offer" class="operate"
                                    @click="history_offer(row)">历史报价
                        </permission>
                    </div>
                </el-table-column>
            </el-table>
        </goods-classify>
        <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="current_change"
                :current-page="table.page"
                :page-sizes="[20,50,100,200,500]"
                :page-size="table.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="table.totalSize">
        </el-pagination>
        <el-row :gutter="8">
            <el-col :span="this.showClassify?21:24">
                <div class="mt-mini">

                </div>


                <history-offer :id="id" :sku_id="sku_id" :supplier_id="supplier_id" :sku="sku" v-model="historyDialog"
                               @size-change="size_change" @current-change="current_change"></history-offer>
                <add-offer :edit="isEdit" :company-n="companyN" :title="titleName" v-model="addDialog"
                           @save-offer="save_offer" @update-offer="update_offer" :goods-form="goodsForm"></add-offer>
                <add-offer2 :edit="isEdit" :company-n="companyN" :title="titleName" v-model="addDialog2"
                            @save-offer="save_offer" @update-offer="update_offer" :goods-form="goodsForm"></add-offer2>
                <import-excel v-model="showImport" @files-success="init"></import-excel>
            </el-col>
        </el-row>
    </page>
</template>
<style lang="stylus">
    .p-index {
        > .el-row {
            > .el-col {
                .custom-card {
                    &.el-card {
                        overflow: inherit;
                    }
                }
            }
        }
    }
    .p-index-supplier-quote{
        .el-card {
            overflow: visible !important;
            .el-card__body {
                overflow: visible !important;
            }
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

    .aleady-table {
        box-sizing: content-box;
        padding-bottom: 10px;
        .el-table__body-wrapper {
        }
    }
    .text_line{
        display: -webkit-box;
        overflow: hidden;
        white-space: normal!important;
        text-overflow: ellipsis;
        word-wrap: break-word;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }
</style>
<script>

    import historyOffer from './history-offer.vue';
    import tree from './tree.vue';
    import addOffer from './offer-edit.vue';
    import addOffer2 from './oferr-add.vue';
    import {downloadFile} from '../../../../lib/http';
    import {
        api_get_buyer, api_supplier_offer, api_change_states, api_get_supplier, api_get_brand, api_history_offer,
        api_edit_supplier,api_export_supplier,
        url_get_categories,
        url_history_offer,
        url_add_supplier_offer,
        url_import_suppliers
    } from '../../../../api/supplier-quote';

    export default {
        permission: {
            url_get_categories,
            url_history_offer,
            url_add_supplier_offer,
            url_import_suppliers
        },
        page: {
            devinfo:{
                frontEnd:'王月如;黎宏珍',
                backEnd:'谭斌',
                createTime:'2017-1-12',
                updateTime:'2017-8-22'
            },
            beforeClose(){
                return true;
            }
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                firstLoading: true,
                leftControllerTitle: "显示所有分类",
                showClassify: false,
                showImport: false,
                companyN: "",
                isEdit: false,
                titleName: "",
                url: config.apiHost + 'supplier-offer/supplier',
                category_id: 0,
                supplier_id: 0,
                searchParams:{
                    supplierId:'',
                    date_b: "",
                    date_e: "",
                    searchdata: "buyer_id",
                    buyer_id: "",
                    brand_id: "",
                    snType: "sku",
                    snText: "",
                    date_s:'create_time',
                    min_qty_b:'',
                    min_qty_e:''
                },
                clears:{
                    searchdata: "buyer_id",
                    snType: "sku",
                    date_s:'create_time',
                },
                filTime:[
                    {label:'创建时间',value:'create_time'},
                    {label:'审核时间',value:'audit_time'}
                ],
                buyerList: [],
                statusList: [
                    {name: "全部", value: -1},
                    {name: "未审核", value: 0},
                    {name: "审核通过", value: 1},
                    {name: "审核未通过", value: 2}
                ],
                buyerBrand: [
                    {label: "采购员", value: "buyer_id"},
                    {label: "品牌", value: "brand_id"},
                ],
                curStatus: -1,
                handleList: [
                    {label: "审核通过", value: 1},
                    {label: "审核不通过", value: 2},
                ],
                selectId: [],
                status: -1,
                searchList: [
                    {label: "商品名称", value: "name"},
                    {label: "货品SKU", value: "sku"},
                ],
                table: {
                    dataList: [],
                    page: 1,
                    pageSize: 50,
                    totalSize: 0
                },
                supplierList: [],
                brandList: [],
                content: "",
                isLoading: true,
                id: 1,
                sku_id: 1,
                sku: '',
                historyDialog: false,
                addDialog: false,
                addDialog2: false,
                goodsForm: {
                    id: 0,
                    supplier_id: 0,
                    goods: []
                },
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.searchParams.date_e) {
                            return time.getTime() > this.searchParams.date_e;
                        } else {
                            return time.getTime()>Date.now();
                        }
                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.searchParams.date_b) {
                            return time.getTime() < this.searchParams.date_b ||time.getTime()>Date.now();
                        }
                    }
                },
            }
        },
        filters: {
            filterAlias(val){
                return Array.isArray(val)?val.join(','):val
            },
            filterStatus(val) {
                switch (val) {
                    case 0:
                        return "未审核";
                        break;
                    case 1:
                        return "审核通过";
                        break;
                    case 2:
                        return "审核未通过";
                        break;
                }
            },
            filterTime(val) {
                if (val) return datef("YYYY-MM-dd HH:mm:ss", val);
            },
            filterPrice(val) {
                return !!val&&!isNaN(Number(val)) ? Number(val).toFixed(3) : val;
            },
            filterPur(val) {
                return val ? "是" : "否"
            }
        },
        created() {
            this.init();
            this.api_get_brand();
            this.api_get_buyer();
        },
        computed: {
            placeName(){
            	if(this.searchParams.snType === 'name'){
            		return `商品名称`;
                }else{
                    return `货品SKU`;
                }
            },
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            }
        },
        methods: {
            filterTimeType(row){
                return this.curStatus===0?row.submit_quotation_time:row.create_time
            },
            key_down(){
                this.search()
            },
            sku_image(images){
                if(!!images){
                    return images.replace('_60x60.','_200x200.')
                }
                return ""
            },
            init_status_btn(){
                let curBtn = this.statusList;
                this.statusList = [];
                this.$nextTick(()=>{
                    this.statusList = curBtn;
                });
            },
            show_classify() {
                this.showClassify = !this.showClassify;
            },
            row_class_name(row){
            	if(!!row.company_name){
            		return '';
                }else{
            		return 'red';
                }
            },
            clear() {
                this.supplierId = 0;
                this.brand_id = "";
                this.buyer_id = "";
                this.snText = "";
                this.date_b = "";
                this.date_e = "";
                this.snType = "sku";
                this.init();
            },
//                所有分类
            all() {
                this.category_id = 0;
                this.init();
            },
//                过滤供应商
            fix_params({page, pageSize, keyword}) {
                return {
                    page: page,
                    pageSize: pageSize,
                    content: keyword,
                };
            },
//              点击tree
            node_click(id) {
                if (id) {
                    this.category_id = id;
                    this.init();
                }
            },

//                更改状态
            change_status(index) {
                this.curStatus = this.statusList[index].value;
                this.init();
            },
//               列表多选
            selection_change(val) {
                this.selectId = val.map(row => {
                    return row.id;
                })
            },

            select_handle(val) {
                if (this.selectId.length <= 0) {
                    this.$message({type: "warning", message: `请选择审批项后，再进行相应操作`});
                } else {
                    if (val.value == 2) {
                        this.$prompt('请输入审核不通过原因', '审核不通过', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                        }).then(({value}) => {
                            let params = {
                                id: this.selectId,
                                status: val.value,
                                remark: value,
                            };
                            this.$http(api_change_states, params).then(res => {
                                this.$message({type: "success", message: res.message || res});
                                this.selectId.forEach(row=>{
                                    let index = this.table.dataList.findIndex(res=>{
                                        return res.id === row;
                                    });
                                    this.table.dataList.splice(index,1);
                                });
                            }).catch(code => {
                                this.$message({type: "error", message: code.message || code});
                            })
                        }).catch(() => {
                            this.$message({type: "info", message: `已取消操作!`});
                        });
                    } else {
                        this.$confirm(`您将更改所选供应商状态，确认此操作吗？`, "提示", {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            let params = {
                                id: this.selectId,
                                status: val.value,
                            };
                            this.$http(api_change_states, params).then(res => {
                                this.$message({type: "success", message: res.message || res});
                                this.selectId.forEach(row=>{
                                    let index = this.table.dataList.findIndex(res=>{
                                        return res.id === row;
                                    });
                                    this.table.dataList.splice(index,1);
                                });
                            }).catch(code => {
                                this.$message({type: "error", message: code.message || code});
                            })
                        }).catch(() => {
                            this.$message({type: "info", message: `已取消操作!`});
                        });
                    }


                }
            },

//                添加报价
            add() {
                this.isEdit = false;
                this.titleName = "添加新报价";
                this.addDialog = true;
                this.goodsForm = {
                    id: 0,
                    supplier_id: 0,
                    goods: []
                };
            },

            add2() {//add_new
                this.isEdit = false;
                this.titleName = "添加新报价";
                this.addDialog2 = true;
                this.goodsForm = {
                    id: 0,
                    supplier_id: 0,

                    goods: []
                };
            },

//                保存新增报价
            save_offer() {
                this.init();
            },
//                更新报价
            update_offer(id) {
                this.init();
            },
//                切换采购员/品牌
            change_buyer_brand() {
                this.searchParams.buyer_id = "";
                this.searchParams.brand_id = "";
            },
//                搜索
            search() {
                this.init();
            },
//                分页
            size_change(size) {
                this.table.pageSize = size;
                this.init();
            },
            current_change(page) {
                this.table.page = page;
                this.init();
            },

//              编辑
            edit(row) {
                console.log(row);
                this.isEdit = true;
                this.titleName = `编辑 ${row.company_name}供应商 报价`;
                this.companyN = row.company_name;
                this.addDialog = true;
                this.goodsForm.goods = [];
                this.goodsForm.id = row.id;
                this.$http(api_edit_supplier, row.id).then(res => {
                    this.goodsForm.supplier_id = res.supplier_id;
                    if (res.goods instanceof Array) {
                        res.goods.map(row => {
                            if (row.cycle.length <= 0) {
                                row.cycle = [{warehouse_id: 0, delivery_days: ""}]
                            }
                        })
                        this.goodsForm.goods = res.goods;
                    } else {
                        if (res.goods.cycle.length <= 0) {
                            res.goods.cycle = [{warehouse_id: 0, delivery_days: ""}]
                        }
                        this.goodsForm.goods.push(res.goods);
                    }
                }).catch(code => {
                    console.log(code);
                })
            },

//                历史报价
            history_offer(row) {
                this.historyDialog = true;
                this.id = row.id;
                this.sku_id = row.sku_id;
                this.sku = row.sku;
                this.supplier_id = row.supplier_id;

            },
            init_params(){
                let data = {
                    page: this.table.page,
                    pageSize: this.table.pageSize,
                    date_s:this.searchParams.date_s
                };
                this.curStatus > -1 && (data.status = this.curStatus);
                this.searchParams.supplierId && (data.supplier_id = this.searchParams.supplierId);
                this.searchParams.brand_id && (data.brand_id = this.searchParams.brand_id);
                this.searchParams.buyer_id && (data.buyer_id = this.searchParams.buyer_id);
                this.searchParams.min_qty_b && (data.min_qty_b = this.searchParams.min_qty_b);
                this.searchParams.min_qty_e && (data.min_qty_e = this.searchParams.min_qty_e);
                if (this.searchParams.date_b) {
                    let b = new Date(this.searchParams.date_b);
                    data.date_b = datef("YYYY-MM-dd", b / 1000);
                }
                if (this.searchParams.date_e) {
                    let e = new Date(this.searchParams.date_e);
                    data.date_e = datef("YYYY-MM-dd", e / 1000);
                }
                this.category_id && (data.category_id = this.category_id);
                if (this.searchParams.snType && this.searchParams.snText) {
                    data.snType = this.searchParams.snType;
                    data.snText = this.searchParams.snText.trim().split('\n').map(row=>row.trim()).filter(row=>!!row);
                }else {
                    data.snType = this.searchParams.snType;
                    data.snText = '';
                }
                return data
            },
            /*列表初始*/
            init() {
                this.isLoading = true;
                let data = this.init_params();
                this.table.dataList = [];
                this.$http(api_supplier_offer, data).then(res => {
                    this.table.dataList = res.data;
                    this.table.totalSize = res.count;
                    this.isLoading = false;
                    this.firstLoading = false
                }).catch(code => {
                    this.isLoading = false;
                    console.log(code);
                })
            },
            /*获取采购员*/
            api_get_buyer() {
                this.$http(api_get_buyer, {}).then(res => {
                    this.buyerList = res.map(row => {
                        let data = {
                            label: row.realname,
                            value: row.id
                        }
                        return data
                    });
                }).catch(code => {
                    console.log(code);
                });
            },
            /*获取品牌*/
            api_get_brand() {
                this.$http(api_get_brand).then(res => {
                    this.brandList = res;
                }).catch(code => {
                    console.log(code);
                });
            },
            export_csv(){
                let data = {
                    ids:this.selectId
                };
                return this.$http(api_export_supplier,data).then(res=>{
                    let url = config.apiHost+'downloadFile/downExportFile';
                    let data = {
                        file_code:res.file_code,
                    };
                    downloadFile({
                        url:url,
                        get:data,
                        fileName:res.file_name,
                        suffix:'.csv',
                    });
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({type:'error',message:code.message || code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('export_csv',false);
                    },200);
                });
            }
        },
        props: {},
        components: {
            labelButtons: require('@/components/label-buttons.vue').default,
            historyOffer,
            tree,
            addOffer,
            addOffer2,
            scroll: require('@/components/scroll.vue').default,
            trendsSelect: require('@/components/trends-select.vue').default,
            uiTip: require('../../../../components/ui-tip.vue').default,
            importExcel: require('./import-excel.vue').default,
            supplier:require('../../../../api-components/supplier.vue').default,
            purchaser:require('../../../../api-components/purchaser.vue').default,
            searchCard:require('@/components/search-card.vue').default,
            goodsClassify: require('@/components/goods-classify.vue').default,
            goodsTree: require('@/components/goods-tree.vue').default,
            orderInput:require("@/components/order-input.vue").default,
            uiLimitNumber:require('@/components/ui-limit-number').default,
        }
    }
</script>
