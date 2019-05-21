<template>
    <page class="delivery-index">
        <search-module
            :search-params="searchParams"
            :warehouse-list="warehouseList"
            :supplier-list="supplierList"
            @search="search"></search-module>
        <goods-classify ref="classifyPart" :leftControllerTitle="leftControllerTitle">
            <!-- 按钮 -->
            <div slot="button-list">
                <permission
                    tag="request-button"
                    :route="apis.url_save"
                    v-if="buttonShow"
                    req-key="apis_url_save"
                    :mintime="200"
                    style="position:absolute;right: 10px;"
                    class="inline mr-sm"
                    @click.native="save_date">保存交期
                </permission>
                <permission
                    tag="trendsSelect"
                    class="inline mr-sm"
                    style="top: 1px;"
                    type="primary"
                    :route="apis.url_safe_export"
                    :selects="partAllOptions"
                    @trigger="export_excel"></permission>
                <permission
                    style="margin-left: -3px;margin-right: 2px;"
                    class="inline"
                    tag="ElButton"
                    :route="apis.url_import_delivery"
                    type="primary"
                    size="mini"
                    @click.native="showImport=true">导入
                </permission>
                <permission
                    tag="ElButton"
                    :route="apis.url_change_delivery"
                    class="inline"
                    type="primary"
                    size="mini"
                    @click="modify_date">批量设置
                </permission>
            </div>
            <!-- 商品列表树 -->
            <goods-tree slot="goods-tree"
                        @hidden-left="$refs.classifyPart.showLeft(true)"
                        @change-category="node_click">
            </goods-tree>
            <!-- 数据表格 -->
            <table-module :table-data="lists"
                          :first-loading="firstLoading"
                          slot="goods-tabel"
                          @selection-change="selectionChange"
                          :is-loading="isLoading"></table-module>
        </goods-classify>
        <export-field :param="export_model_type"
                      v-model="exportVisable"
                      :fields="fields" :templates="templates"
                      @getTemplate="get_templates"
                      title="请选择自定义导出字段"
                      :fixparam="fixparam"
                      :creat-excel="creat_excel"></export-field>
        <export-dialog v-model="export_visible"></export-dialog>
        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[20,50,100,200,500]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count">
        </el-pagination>
        <import-excel v-model="showImport" @files-success="init"></import-excel>
        <batch-setting v-model="settingDialog" title="批量设置" @batch-setting="batch_setting"></batch-setting>
    </page>
</template>
<style lang="stylus">
    .delivery-index {
        overflow-y: visible;

        .el-card {
            overflow: visible !important;
        }

        .category_title {
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

        .delivery-border {
            overflow-y: auto;
            border: 1px solid #ddd;
        }
    }
</style>
<script>
    import {
        api_get, api_categories, api_warehouse, api_change_delivery, api_save, api_import_delivery,
        url_import_delivery,
        url_warehouse,
        url_get,
        url_change_delivery,
        url_save,
        url_safe_export,
        api_safe_export,
        api_safe_export_fields
    } from '../../../api/procurement-delivery';
    import {api_goods_export_template} from "../../../api/product-library";
    import {api_pack_getSupplier} from '../../../api/pack';
    import {
        url_get_supplier
    } from '../../../api/supplier-quote';
    import {downloadFile} from '../../../lib/http';

    export default {
        permission: {
            url_warehouse,
            url_get_supplier,
            url_get,
            url_save,
            url_change_delivery,
            url_import_delivery,
            url_safe_export
        },
        page: {
            devinfo: {
                frontEnd: '吴楚光;王月如;黎宏珍',
                backEnd: '谭斌',
                createTime: '2017-1-13',
                updateTime: '2017-9-26'
            },
            beforeClose() {
                if (!this.buttonShow) {
                    return true
                } else {
                    return this.$confirm(`您的修改未保存,确定离开此页面吗?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        return true
                    }).catch(code => {
                        return false
                    })
                }
            }
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                warehouseList: [],
                settingDialog: false,
                firstLoading: true,
                leftControllerTitle: "显示产品分类检索",
                isLoading: false,
                showImport: false,
                showHiddenClassify: true,
                treeData: [],
                categories: {},
                searchParams: {
                    warehouse_id: '',
                    supplier_id: '',
                    orderKey: 'sku',
                    orderValue: '',
                    dds_b: '',
                    dds_e: '',
                    sds_b: '',
                    sds_e: '',
                    wif_b: '',
                    wif_e: '',
                    sd_b: '',
                    sd_e: ''
                },
                page: 1,
                pageSize: 20,
                count: 0,
                cate_id: 0,
                lists: [],
                oldLists: [],
                selected: [],
                partAllOptions: [
                    {name: "部分导出", value: 2},
                    {name: "全部导出", value: 1}
                ],
                exportVisable: false,
                export_model_type: {
                    type: 17
                },
                fields: [],
                templates: [],
                export_visible: false,
                export_type: '',
                supplierList: [],
            }
        },
        mounted() {
            this.$http(api_categories).then(res => {
                this.categories = res;
                for (var i in res) {
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
                        this.treeData.push(treeObj);
                    }
                }
            });
            this.init();
            this.get_fields();
            this.get_templates();
            this.get_packing_supplier();
            this.init_warehouse();
        },
        methods: {
            init_warehouse() {
                this.$http(api_warehouse).then(res => {
                    this.warehouseList = res.map(row => {
                        return {
                            label: row.name,
                            value: row.id
                        }
                    });
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            get_packing_supplier() {//获取供应商
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
            fixparam(list) {
                return list.map(row => {
                    return {
                        field_name: row.show_field,
                        field_key: row.field
                    }
                });
            },
            order_export(params) {
                return this.$http(api_safe_export, params).then(res => {
                    if (res.join_queue === 1) {
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
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
                return Promise.resolve()
            },
            get_fields() {
                this.$http(api_safe_export_fields).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            get_templates() {
                this.$http(api_goods_export_template, {type: 17}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    })
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            export_excel(val) {
                if (val.value === 2 && this.selected.length <= 0) return this.$message({
                    type: "warning",
                    message: "请先选择需要导出的数据"
                });
                this.export_type = val.value;
                this.exportVisable = true;
            },
            creat_excel(param) {
                let data = '';
                switch (this.export_type) {
                    case 2://部分
                        data = {
                            ids: JSON.stringify(this.selected.map(row => {
                                if (typeof row === 'object') {
                                    return row.id
                                } else {
                                    return row
                                }
                            })),
                            export_type: this.export_type,
                            fields: param
                        };
                        Object.assign(data, this.init_params());
                        return this.order_export(data);
                        break;
                    case 1://全部
                        data = this.init_params();
                        this.$set(data, 'export_type', this.export_type);
                        this.$set(data, 'fields', param);
                        return this.order_export(data);
                        break;
                }
            },
            remote(callback) {
                this.$http(api_warehouse).then(res => {
                    callback([...res.map(row => {
                        return {label: row.name, value: row.id}
                    })]);
                });
            },
            //                过滤供应商
            fix_params({page, pageSize, keyword}) {
                return {
                    page: page,
                    pageSize: pageSize,
                    content: keyword,
                };
            },
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
                this.init();
            },
            handleCurrentChange(page) {
                this.page = page;
                this.init();
            },
            node_click(cate) {
                this.cate_id = cate;
                this.init();
            },
            selectionChange(val){
                this.selected = val;
            },
            all() {
                this.cate_id = 0;
                this.init();
            },
            init_params() {
                let data = {page: this.page, pageSize: this.pageSize};
                if (this.searchParams.orderValue.trim() !== '') {
                    data.snType = this.searchParams.orderKey;
                    if (this.isBatch) {
                        data.snText = JSON.stringify(this.searchParams.orderValue.split('\n').map(row => row.trim()).filter(row => row !== ''));
                    } else {
                        data.snText = this.searchParams.orderValue.trim();
                    }
                }
                if (this.searchParams.warehouse_id > 0) {
                    data.warehouse_id = this.searchParams.warehouse_id;
                }
                if (this.cate_id > 0) {
                    data.category_id = this.cate_id;
                }
                this.searchParams.supplier_id && (data.supplier_id = this.searchParams.supplier_id);
                if (this.searchParams.dds_b || this.searchParams.dds_e) {
                    data.dds_b = Number(this.searchParams.dds_b);
                    data.dds_e = this.searchParams.dds_e || '';
                }
                if (this.searchParams.sds_b || this.searchParams.sds_e) {
                    data.sds_b = Number(this.searchParams.sds_b);
                    data.sds_e = this.searchParams.sds_e || '';
                }
                if (this.searchParams.wif_b || this.searchParams.wif_e) {
                    data.wif_b = Number(this.searchParams.wif_b);
                    data.wif_e = this.searchParams.wif_e || '';
                }
                if (this.searchParams.sd_b || this.searchParams.sd_e) {
                    data.sd_b = Number(this.searchParams.sd_b);
                    data.sd_e = this.searchParams.sd_e || '';
                }
                return data
            },
            init() {
                let data = this.init_params();
                this.isLoading = true;
                this.$http(api_get, data).then(res => {
                    this.lists = res.data.map(row => {
                        row.old_delivery_days = row.delivery_days;
                        return row;
                    });
                    this.count = parseInt(res.count);
                    this.isLoading = false;
                    this.firstLoading = false
                }).catch(code => {
                    this.isLoading = false;
                    console.log(code);
                });
            },
            input(row, val) {
                val && (row.delivery_days = parseInt(val));
            },
            search() {
                this.init();
            },
            modify_date() {
                if (this.selected.length > 0) {
                    this.settingDialog = true;
                } else {
                    this.$reqKey('url_change_delivery', false);
                    this.$message({
                        type: 'warning',
                        message: '请先选择需要批量设置的数据！'
                    });
                }
            },
            batch_setting(delivery_days) {
                let data = {
                    id: this.selected.map(row => row.id),
                    delivery_days
                };
                this.$http(api_change_delivery, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.settingDialog = false;
                    data.id.forEach(id => {
                        let find = this.lists.find(row => row.id === id);
                        if (find) {
                            find.old_delivery_days = data.delivery_days;
                            find.delivery_days = data.delivery_days;
                        }
                    });
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });

            },
            operate_save(change) {
                let timestamp = Date.parse(new Date());
                timestamp = timestamp / 1000;
                change.forEach(out => {
                    let find = this.lists.find(row => {
                        return row.id === out.id;
                    });
                    if (!!find) {
                        find.update_time = timestamp;
                        find.old_delivery_days = out.delivery_days;
                        Object.assign(find, out)
                    }
                })
            },
            save_date() {
                let change = [];
                this.lists.forEach(row => {
                    if (Number(row.old_delivery_days) !== Number(row.delivery_days) || Number(row.old_stocking_days) !== Number(row.stocking_days)) {
                        change.push({id: row.id, delivery_days: row.delivery_days, stocking_days: row.stocking_days});
                    }
                });
                if (change.length <= 0) {
                    this.$reqKey('apis_url_save', false);
                    this.$message({type: "warning", message: `当前数据无更改`});
                    return;
                }
                this.$http(api_save, change).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message
                    });
                    this.operate_save(change);
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message.replace('delivery_days', '安全交期') || code
                    });
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('apis_url_save', false);
                    }, 200);
                });
            }
        },
        computed: {
            isBatch() {
                return this.searchParams.orderKey === 'sku' || this.searchParams.orderKey === 'spu'
            },
            buttonShow() {
                if (this.lists.length > 0) {
                    let cur = this.lists.find((row) => Number(row.old_delivery_days) !== Number(row.delivery_days));
                    if (cur) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    return false;
                }
            },
            classifyBoxSpan() {
                return this.showHiddenClassify ? 21 : 24;
            },
            showHIddenClassifyName() {
                return this.showHiddenClassify ? `隐藏产品分类检索` : `显示产品分类检索`;
            }
        },
        components: {
            searchModule: require('./search-module').default,
            tableModule: require('./table-module').default,
            tree: require('../../../components/tree.vue').default,
            labelItem: require('../../../components/label-item.vue').default,
            selectRemote: require('../../../components/select-remote.vue').default,
            treeCategories: require('../../../components/tree-categories'),
            supplier: require('../../../api-components/supplier.vue').default,
            uiTip: require('../../../components/ui-tip.vue').default,
            searchCard: require('../../../components/search-card.vue').default,
            importExcel: require('./import-excel.vue').default,
            goodsClassify: require('../../../components/goods-classify.vue').default,
            goodsTree: require('../../../components/goods-tree.vue').default,
            trendsSelect: require('../../../components/trends-select').default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('../../report/export-dialog').default,
            batchSetting: require('./batch-setting').default
        }
    }
</script>
