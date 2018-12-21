<template>
    <page class="p-index">
        <label-item label="请选择本地仓：" class="mb-xs mt-xs">
            <el-select v-model="warehouse_id" class="inline width-xs" filterable clearable @change="select_warehouse">
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
                <label-item label="" class="inline ml-sm">
                    <el-select v-sf.snType v-model="paramsData.snType" class="inline width-xs">
                        <el-option
                                :key="item.value"
                                v-for="item in typeList"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input v-if="paramsData.snType === 'goods_name'" v-sf.snText v-model="paramsData.snText"
                              @keyup.enter.native="search"
                              class="inline ml-mini enter-result">
                    </el-input>
                    <order-input v-else v-sf.snText
                                 v-model="paramsData.snText"
                                 class="inline width-super ml-mini"
                                 @keydown="search"
                                 placeholder="可批量搜索，Shift+回车换行...">
                    </order-input>
                </label-item>

                <label-item class="ml-sm" label="供应商：">
                    <supplier class="inline s-width-default"
                              v-sf.supplier_id
                              :placeHolder="true"
                              v-model="paramsData.supplier_id"></supplier>
                </label-item>

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
                <label-item label="库存数量：" class="inline">
                    <el-input v-sf.start_quantity type="number" @keyup.enter.native="search"
                              v-model="paramsData.start_quantity" class="width-xs inline enter-result"></el-input>
                    <span>~</span>
                    <el-input v-sf.end_quantity type="number" @keyup.enter.native="search" v-model="paramsData.end_quantity"
                              class="width-xs inline enter-result"></el-input>
                </label-item>
                <label-item label="库龄（天）：" class="inline ml-sm">
                    <el-input v-sf.start_age type="number" @keyup.enter.native="search" v-model="paramsData.start_age"
                              class="width-xs inline enter-result"></el-input>
                    <span>~</span>
                    <el-input v-sf.end_age type="number" @keyup.enter.native="search" v-model="paramsData.end_age"
                              class="width-xs inline mr-sm enter-result"></el-input>
                </label-item>
            </div>
            <label-item label="销售时间：">
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
                <!--<permission tag="ElButton"
                            type="primary"
                            size="mini"
                            :route="apis.url_local_stocking_create"
                            class="ml-sm"
                            @click.native="apply_stock">提交备货申请
                </permission>-->
                <permission tag="ElButton" :route="apis.url_warehouse_goods_init" class="ml-sm" size="mini"
                            type="default" @click.native="import_init">导入期初库存
                </permission>
                <permission tag="ElButton" :route="apis.url_warehouse_goods_purchase_in" class="ml-sm" size="mini"
                            type="default" @click.native="import_purchase">导入采购库存
                </permission>
                <permission tag="ElButton" :route="apis.url_export" :disabled="this.tables.lists.length===0" size="mini"
                            type="default" @click.native="export_data">导出
                </permission>
                <permission tag="requestButton"
                            req-key="api_local_synchronous"
                            :route="apis.url_local_synchronous" size="mini"
                            type="default" @click="local_synchronous">同步销量
                </permission>
            </div>
            <div slot="other">
                <div class="mr-sm inline mt-md fr">
                    <label class="color-lump warehouse-reminder"></label><span>：当前库存超出预警数</span>
                </div>
            </div>
            <!-- 商品列表树 -->
            <goods-tree slot="goods-tree"
                        @hidden-left="hidden_left"
                        @change-category="categories_click">
            </goods-tree>
            <!-- 数据表格 -->
            <data-table
                    slot="goods-tabel"
                    :tables="tables"
                    :warehouse_id="warehouse_id"
                    @sort-click="sort_click"
                    @size-change="change_size"
                    @page-change="change_page"
                    @check-box-change="check_box_change"
                    @action="action"
                    @shif-operate="shif_operate"
                    :isLoad="isLoading"></data-table>
        </goods-classify>
        <show-dialog ref="number" v-model="dialogShow" :title="title" :params-data="paramsNewData"
                     :params-old-data="paramsOldData" :from-cargo-id="fromCargoId" @save-alert="save_alert"
                     @get-shift="get_shift" :alert-quantity="alertQuantity" :value-show="valueShow"></show-dialog>
        <detail-dialog v-model="detailShow" :row="rowDetail"></detail-dialog>
        <operate-dialog v-model="operateShow" :logs-data="logsData"></operate-dialog>
        <import-excel v-model="importShow" :import-type="importType" :warehouse-id="warehouse_id"
                      @files-data="files_data"></import-excel>
        <export-dialog v-model="visible"></export-dialog>
        <export-title
                v-model="exportVisible"
                title="选择需要导出的产品项目"
                :export-title="exportTitle"
                @export-title="export_title"></export-title>
        <cargo-log v-model="cargoLogVisible" :log-list="cargoLogList" :title="title"></cargo-log>
    </page>
</template>
<style lang="stylus">
    .warehouse-reminder {
        vertical-align: middle;
        background: red;
    }

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
</style>
<script>

    import {api_warehous_local, api_get_sku_status} from '@/api/entrepot-picking';
    import {
        api_overseas_stock, api_change_alert, api_get_logs, api_get_allot,
        url_change_alert, url_get_logs, url_get_allot
    } from '@/api/overseas-stock';
    import {
        api_local, api_local_detail, api_local_shif, api_warehouse_goods_purchase_in,
        url_warehouse_goods_init, url_local_shif, url_warehouse_goods_purchase_in,
        api_cagro_log, url_cagro_log
    } from '@/api/local';
    import {api_local_synchronous, url_local_synchronous} from "@/api/commodity-sales";
    import {api_get_categories} from '@/api/categories';
    import {api_get_details, url_get_details, api_export, url_export,api_get_export_title} from '@/api/entrepot-overseas';
    import {downloadFile} from '@/lib/http';
    // import {url_local_stocking_create} from "@/api/local-stocking";

    export default {
        page: {
            devinfo: {
                frontEnd: '黎宏珍',
                backEnd: '赖永凤',
                createTime: '2017-12-16',
                updateTime: '2017-12-18'
            },
        },
        permission: {
            url_change_alert,
            url_local_shif,
            url_get_logs,
            url_get_allot,
            url_get_details,
            url_warehouse_goods_init,
            url_export,
            url_warehouse_goods_purchase_in,
            url_local_synchronous,
            url_cagro_log,
            // url_local_stocking_create,
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                leftControllerTitle: "显示产品分类检索",
                visible: false,
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
                },
                paramsData: {
                    status: '',
                    start_quantity: '',
                    end_quantity: '',
                    developer_id: '',
                    begin_delivery_time: '',
                    end_delivery_time: '',
                    snText: '',
                    snType: 'sku',
                    start_age: '',
                    end_age: '',
                    supplier_id: '',
                    sku_status: '',
                },
                clears: {
                    snType: 'sku'
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
                    {label: "SPU", value: "spu"},
                    {label: '商品名称', value: 'goods_name'},
                ],
                warehouses: [],
                showHiddenClassify: true,
                isLoading: false,
                importShow: false,
                categoriesTempl: [],
                tables: {
                    page: 1,
                    pageSize: 50,
                    count: 0,
                    lists: []
                },
                operateButtons: [
//                        {label:'商品移库',value:1,apis:url_local_shif},
                    {label: '出入库日志', value: 3, apis: url_get_details},
                    {label: '修改预警', value: 2, apis: url_change_alert},
                    {label: '操作日志', value: 4, apis: url_get_logs},
                    {label: '货位记录', value: 5, apis: url_get_logs},
                ],
                dialogShow: false,
                detailShow: false,
                operateShow: false,
                valueShow: 1,
                title: '',
                warehouse_id: '',
                selectCategories: 0,
                selectedIds: [],
                skuIds: [],
                ids: [],
                alertQuantity: '',
                fromCargoId: '',
                rowDetail: {},
                logsData: [],
                paramsNewData: {},
                paramsOldData: {},
                importType: 0,
                isCleared: false,
                exportVisible: false,
                exportTitle: [],
                exportDialogVisible: false,
                applyVisible: false,
                cargoLogVisible: false,
                cargoLogList: [],
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
            apply_stock() {
                this.applyVisible = true;
            },
            get_sku_status() {//产品筛选状态
                this.$http(api_get_sku_status).then(res => {
                    this.sku_status = res;
                })
            },
            import_init() {
                this.importType = 1;
                this.importShow = true;
            },
            import_purchase() {
                this.importType = 2;
                this.importShow = true;
            },
            files_data(data) {
                this.init();
            },
            warehouses_init() {
                this.$http(api_warehous_local).then(res => {
                    this.warehouses = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                    if (this.warehouses.length > 0) {
                        this.warehouse_id = this.warehouses[0].value;
                        this.init();
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
            export_data() {
                return this.$http(api_get_export_title,{warehouse_id:this.warehouse_id}).then(res => {
                    this.exportTitle = res;
                    this.exportVisible = true;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            local_synchronous() {
                this.$http(api_local_synchronous).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('api_local_synchronous', false);
                    }, 200);
                });
            },
            export_title(val) {
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
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
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
                this.$http(api_local, data).then(res => {
                    this.tables.lists = res.data;
                    this.tables.count = res.count;
                    this.tables.lists.forEach(row => {
                        this.$set(row, 'operateButtons', window.clone(this.operateButtons));
                        this.$set(row, 'isCheck', false);
                        this.$set(row, 'show', false);
                    });
                    this.isLoading = false;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                }).finally(() => {
                    this.searchData.sort_field = '';
                    this.searchData.sort_type = '';
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
                    data.snText = data.snText.split('\n').filter(row => !!row).map(row => row.trim());
                } else {
                    typeof data.snText === 'string' && (data.snText = data.snText.trim());
                    data = window.clone(this.searchData);
                }
                data.begin_delivery_time && (data.begin_delivery_time = datef('YYYY-MM-dd', data.begin_delivery_time.getTime()/1000));
                data.end_delivery_time && (data.end_delivery_time = datef('YYYY-MM-dd', data.end_delivery_time.getTime()/1000));
                return data;
            },
            select_warehouse(val) {
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
            check_box_change(items) {
                this.selectedIds = items.map(res => {
                    return res.id;
                });
                this.skuIds = items.map(res => {
                    return res.sku_id;
                });
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
                this.dialogShow = true;
            },
            save_alert(number) {
                typeof number === 'string' && (number = number.trim());
                if (this.ids.length === 1) {
                    let data = {
                        ids: this.ids,
                        value: number,
                    };
                    this.change_alert(data);
                } else if (this.selectedIds) {
                    let data = {
                        ids: this.selectedIds,
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
                        this.$reqKey(`change_alert`, false);
                    }, 200);
                });
            },
            get_shift(data) {
                let params = {
                    sku_id: this.ids,
                    from_cargo_id: data.from_cargo_id,
                    to_cargo_id: data.to_cargo_id,
                    quantity: data.quantity,
                    warehouse_id: this.warehouse_id,
                };
                this.$http(api_local_shif, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.dialogShow = false;
                    this.init();
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey(`shiftAdd`, false);
                    }, 200);
                });
            },
            get_logs(data) {
                let params = {
                    list_type: 2,
                    sku_id: data.sku_id,
                    warehouse_id: this.warehouse_id,
                };
                this.$http(api_get_logs, params).then(res => {
                    this.logsData = res.data;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            shif_operate(data, id) {
                this.paramsOldData = {
                    warehouse_id: this.warehouse_id,
                    sku_id: data.sku_id,
                };
                this.paramsNewData = {
                    warehouse_id: this.warehouse_id,
                };
                this.ids = data.sku_id;
                this.title = `${data.sku}商品移库`;
                this.valueShow = 2;
                this.fromCargoId = id;
                this.dialogShow = true;
            },
            action(data, options) {
                switch (options.value) {
                    case 1:
                        this.title = `${data.sku}商品移库`;
                        this.valueShow = 2;
                        this.fromCargoId = '';
                        this.paramsOldData = {
                            warehouse_id: this.warehouse_id,
                            sku_id: data.sku_id,
                        };
                        this.ids = data.sku_id;
                        this.paramsNewData = {
                            warehouse_id: this.warehouse_id,
                        };
                        this.dialogShow = true;
                        break;
                    case 2:
                        this.valueShow = 1;
                        this.title = `修改SKU：${data.sku}预警数量`;
                        this.ids = [];
                        this.ids.push(data.id);
                        this.alertQuantity = data.alert_quantity;
                        this.dialogShow = true;
                        break;
                    case 3:
                        this.rowDetail = data;
                        this.detailShow = true;
                        break;
                    case 4:
                        this.title = '操作日志';
                        this.operateShow = true;
                        let param = {
                            sku_id: data.sku_id,
                            warehouse_id: this.warehouse_id,
                        };
                        this.get_logs(param);
                        break;
                    case 5:
                        this.title = `${this.warehouse_name} ${data.sku} 货位记录`;
                        let params = {
                            warehouse_id: this.warehouse_id,
                            sku_id: data.sku_id,
                        };
                        this.$http(api_cagro_log, params).then(res => {
                            this.cargoLogList = res.data;
                            this.cargoLogVisible = true;
                        }).catch(code => {
                            this.$message({type: 'error', message: code.message || code});
                        });
                        break;

                }
            },
            sort_click(key, order) {
                this.searchData.sort_field = key;
                this.searchData.sort_type = order;
                this.init();
            },
            development_fix_result(res) {
                return res.map(row => {
                    return {
                        value: row.id,
                        label: row.realname
                    }
                })
            },
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
            isFBA() {
                return this.warehouse_id === 187;
            },
            warehouse_name() {
                if(this.warehouses) {
                    return this.warehouses.find(row => row.value === this.warehouse_id).label;
                }
                return '';
            }
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            tree: require('@/components/tree.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
            dataTable: require('./data-table.vue').default,
            showDialog: require('./dialog.vue').default,
            detailDialog: require('./detail-dialog.vue').default,
            operateDialog: require('./operate-dialog.vue').default,
            importExcel: require('./import-excel.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            trendsSelect: require('@/components/trends-select.vue').default,
            orderInput: require("@/components/order-input.vue").default,
            exportDialog: require('../export-dialog.vue').default,
            goodsClassify: require('@/components/goods-classify.vue').default,
            goodsTree: require('@/components/goods-tree.vue').default,
            supplier: require('@/api-components/supplier.vue').default,
            paramAccount: require('@/api-components/param-account').default,
            exportTitle: require('../../stock-out/export-title.vue').default,
            cargoLog: require('./cargo-log.vue').default,
            // applyStock: require('@/view/entrepot/stocking/activity/apply-stock.vue').default,
        }
    }
</script>
