<template>
    <page class="p-index p-index-supplier-quote" style="position: relative">
        <search-list
            :search-params="searchParams"
            :status="status"
            :supplier-list="supplierList"
            :staffs-list="staffsList"
            :brand-list="brandList"
            @change-buyer-brand="change_buyer_brand"
            @search="init"
            @change-status="change_status"
        ></search-list>
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
                <permission tag="trendsSelect"
                            class="inline ml-xs mr-xs"
                            type="primary"
                            :route="apis.url_export_supplier"
                            :selects="exportOptions"
                            @trigger="export_excel"></permission>
                <export-dialog v-model="export_visible"></export-dialog>
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
            <table-list
                slot="goods-tabel"
                :data-list="table.dataList"
                :cur-status="curStatus"
                :first-loading="firstLoading"
                :is-loading="isLoading"
                @selection="selection_change"
                @history-offer="history_offer"
            ></table-list>
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

    .p-index-supplier-quote {
        th > div.cell {
            line-height 16px;
            padding: 5px 0;
        }

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

    .text_line {
        display: -webkit-box;
        overflow: hidden;
        white-space: normal !important;
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
    import {api_pack_getSupplier} from '../../../../api/pack';
    import addOffer2 from './oferr-add.vue';
    import {downloadFile} from '../../../../lib/http';
    import {api_get_publish} from '../../../../api/procurement-plan';

    import {
        api_get_buyer, api_supplier_offer, api_change_states, api_get_supplier, api_get_brand, api_history_offer,
        api_edit_supplier, api_export_supplier,
        url_export_supplier,
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
            url_import_suppliers,
            url_export_supplier
        },
        page: {
            devinfo: {
                frontEnd: '王月如;黎宏珍',
                backEnd: '谭斌',
                createTime: '2017-1-12',
                updateTime: '2017-8-22'
            },
            beforeClose() {
                return true;
            }
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                staffsList: [],
                firstLoading: true,
                leftControllerTitle: "显示所有分类",
                showClassify: false,
                showImport: false,
                export_visible: false,
                companyN: "",
                isEdit: false,
                titleName: "",
                url: config.apiHost + 'supplier-offer/supplier',
                category_id: 0,
                supplier_id: 0,
                searchParams: {
                    supplierId: '',
                    date_b: "",
                    date_e: "",
                    searchdata: "buyer_id",
                    buyer_id: "",
                    brand_id: "",
                    snType: "sku",
                    snText: "",
                    date_s: 'create_time',
                    min_qty_b: '',
                    min_qty_e: ''
                },
                exportOptions: [
                    {
                        name: "部分导出",
                        value: 2,
                        action: function () {
                            if (this.selectId.length <= 0) return this.$message({
                                type: "warning",
                                message: "请先选择需要导出的数据"
                            });
                            let params = {
                                ids: this.selectId,
                                export_type: 2,
                            };
                            Object.assign(params, this.init_params);
                            this.order_export(params);
                        }
                    },
                    {
                        name: "全部导出",
                        value: 1,
                        action: function () {
                            let params = this.init_params();
                            this.order_export(params);
                        }
                    },
                ],
                buyerList: [],
                curStatus: -1,
                handleList: [
                    {label: "审核通过", value: 1},
                    {label: "审核不通过", value: 2},
                ],
                selectId: [],
                status: -1,
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
            }
        },
        created() {
            this.init();
            this.api_get_brand();
            this.api_get_buyer();
            this.get_packing_supplier();
            this.get_packing_staffs();
        },
        computed: {
            placeName() {
                if (this.searchParams.snType === 'name') {
                    return `商品名称`;
                } else {
                    return `货品SKU`;
                }
            }
        },
        methods: {
            get_packing_staffs() {//采购员
                this.$http(api_get_publish).then(res => {
                    this.staffsList = res.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    });
                }).catch(code => {
                    console.log(code);
                })
            },
            get_packing_supplier() {
                this.$http(api_pack_getSupplier).then(res => {
                    this.supplierList = res.map(row => {
                        return {
                            label: row.company_name,
                            value: row.id
                        }
                    });
                }).catch(code => {
                    console.log(code);
                })
            },
            filterHeader(head) {
                return (h) => {
                    return h('div', [
                        h('div', head.split('|')[0]),
                        h('div', head.split('|')[1])
                    ])
                }
            },
            filterTimeType(row) {
                return this.curStatus === 0 ? row.submit_quotation_time : row.create_time
            },
            sku_image(images) {
                if (!!images) {
                    return images.replace('_60x60.', '_200x200.')
                }
                return ""
            },
            init_status_btn() {
                let curBtn = this.statusList;
                this.statusList = [];
                this.$nextTick(() => {
                    this.statusList = curBtn;
                });
            },
            show_classify() {
                this.showClassify = !this.showClassify;
            },
            row_class_name(row) {
                if (!!row.company_name) {
                    return '';
                } else {
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
            change_status(val,form) {
                this.curStatus = form[val].value;
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
                                this.selectId.forEach(row => {
                                    let index = this.table.dataList.findIndex(res => {
                                        return res.id === row;
                                    });
                                    this.table.dataList.splice(index, 1);
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
                                this.selectId.forEach(row => {
                                    let index = this.table.dataList.findIndex(res => {
                                        return res.id === row;
                                    });
                                    this.table.dataList.splice(index, 1);
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
            init_params() {
                let data = {
                    page: this.table.page,
                    pageSize: this.table.pageSize,
                    date_s: this.searchParams.date_s
                };
                this.curStatus > -1 && (data.status = this.curStatus);
                this.searchParams.supplierId && (data.supplier_id = this.searchParams.supplierId);
                this.searchParams.supplier_id && (data.supplier_id = this.searchParams.supplier_id);
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
                    data.snText = this.searchParams.snText.trim().split('\n').map(row => row.trim()).filter(row => !!row);
                } else {
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
                    this.brandList = res.map(row => {
                        return {
                            label: row.name,
                            value: row.id
                        }
                    });
                }).catch(code => {
                    console.log(code);
                });
            },
            export_excel(val) {
                val.action.call(this, val);
                this.export_type = val.value;
            },
            order_export(params) {
                return this.$http(api_export_supplier, params).then(res => {
                    if (res.join_queue === 1) {
                        this.export_visible = true;
                        this.$message({type: "success", message: res.message || '全部导出成功'});
                    } else {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let data = {
                            file_code: res.file_code,
                            page: this.table.page,
                            pageSize: this.table.pageSize
                        };
                        downloadFile({
                            url: url,
                            get: data,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                    }
                    this.$message({type: "success", message: res.message || '导出成功'});
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
                return Promise.resolve();
            }
        },
        props: {},
        components: {
            historyOffer,
            tree,
            addOffer,
            addOffer2,
            scroll: require('@/components/scroll.vue').default,
            trendsSelect: require('@/components/trends-select.vue').default,
            uiTip: require('../../../../components/ui-tip.vue').default,
            importExcel: require('./import-excel.vue').default,
            tableList: require('./table-list.vue').default,
            searchList: require('./search-list.vue').default,
            supplier: require('../../../../api-components/supplier.vue').default,
            purchaser: require('../../../../api-components/purchaser.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            goodsClassify: require('@/components/goods-classify.vue').default,
            goodsTree: require('@/components/goods-tree.vue').default,
            orderInput: require("@/components/order-input.vue").default,
            exportDialog: require('../../../report/export-dialog').default,
        }
    }
</script>
