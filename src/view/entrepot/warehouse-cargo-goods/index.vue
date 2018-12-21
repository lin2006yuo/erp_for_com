<template>
    <page class="p-index">
        <card-search
                ref="search"
                :searchData="searchData"
                @set-warehouse-name="set_warehouse_name"
                @search="search"></card-search>
        <div class="row mt-xs ml-sm">
            <permission tag="request-button"
                        :route="apis.warehouse_cargo_goods_export"
                        :disabled="this.selectedIds.length <= 0" class="inline"
                        v-model="exportDisabled"
                        @click="export_data"
                        req-key="api_warehouse_cargo_goods_export">导出
            </permission>
            <permission tag="ElButton"
                        class="inline"
                        size="mini"
                        type="primary"
                        :disabled="searchData.warehouse_area_type !== 14"
                        :route="apis.url_cargo_goods_batch_shift"
                        @click="transfer_inventory">库存转移
            </permission>
        </div>
        <el-table
                class="mt-xs mb-sm scroll-bar"
                border :data="dataTable"
                highlight-current-row
                v-resize="{height:40}"
                @sort-change="sort_change"
                @selection-change="select_delete"
                v-loading="loading"
                element-loading-text="玩命加载中...">
            <el-table-column
                    type="selection"
                    width="30">
            </el-table-column>
            <el-table-column label="排序" type="index"></el-table-column>
            <el-table-column label="图片" min-width="70" inline-template>
                <div>
                    <el-popover
                            placement="right"
                            width="200"
                            trigger="hover">
                        <img v-lazy="sku_image(row.thumb)" width="200px" height="200px">
                        <div slot="reference">
                            <img v-lazy="row.thumb" width="60" height="60" style="vertical-align: middle;">
                        </div>
                    </el-popover>
                </div>
            </el-table-column>
            <el-table-column label="货位号"
                             min-width="70"
                             inline-template sortable>
                <div>
                    <ui-tip :content="row.code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    label="SKU/别名"
                    min-width="80"
                    inline-template>

                <div>
                    <div>{{row.sku}}</div>
                    <div>{{row.sku_alias}}</div>
                </div>
            </el-table-column>
            <el-table-column
                    min-width="70"
                    label="商品数量（当前数/冻结数）" inline-template sortable>
                <div>{{row.quantity}}/{{row.hold_quantity}}</div>
            </el-table-column>
            <el-table-column
                    min-width="120"
                    label="商品名称" inline-template>
                <div>
                    {{row.spu_name}}
                </div>
            </el-table-column>
            <el-table-column
                    min-width="60"
                    label="分区功能" inline-template width="120">
                <div>
                    <ui-tip :content="row.warehouse_area_type" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    show-tooltip-when-overflow
                    min-width="180"
                    inline-template
                    label="操作">
                <div>
                    <permission tag="span" :route="apis.url_warehouse_cargo_detail" class="operate"
                                @click="show_detail(row)">操作明细
                    </permission>

                    <permission tag="span" :route="apis.url_warehouse_goods_modify_hold">|</permission>
                    <permission tag="span" :route="apis.url_warehouse_goods_modify_hold" class="operate"
                                @click="freeze_repertory(row)">冻结库存
                    </permission>
                    <permission tag="span" :route="apis.url_local_shif">|</permission>

                    <permission tag="span" :route="apis.url_local_shif" class="operate" @click="shift_detail(row)"
                                v-if="row.can_shift">移位
                    </permission>
                    <permission tag="span" :route="apis.url_local_shif" class="disabled" v-else>移位</permission>
                    <permission tag="span" :route="apis.url_warehouse_cargo_delete">|</permission>
                    <permission tag="span" :route="apis.url_warehouse_cargo_delete" class="operate"
                                v-if="row.quantity===0" @click="goods_delete(row)">解绑
                    </permission>
                    <permission tag="span" :route="apis.url_warehouse_cargo_delete" class="disabled" v-else>解绑
                    </permission>
                    <span>|</span>
                    <span class="operate" @click="print(row)">打印</span>
                </div>
            </el-table-column>
        </el-table>
        <div style="text-align:right;">
            <el-pagination
                    class="all-right mt-xs"
                    @size-change="handle_size_change"
                    @current-change="handle_current_change"
                    :current-page=this.searchData.page
                    :page-sizes="[20, 50,100, 200]"
                    :page-size=this.searchData.pageSize
                    layout="total, sizes, prev, pager, next, jumper"
                    :total=this.count>
            </el-pagination>
        </div>
        <detail v-model="showDialog" :row="detailRow"></detail>
        <preview v-model="printVisable"
                 :print-id="printId"
                 :batch-data="batchData"
                 ref="preview">
        </preview>
        <cargo-dialog ref="number"
                      v-model="dialogShow"
                      :title="title"
                      :params-data="paramsData"
                      :param="param"
                      @get-shift="get_shift"></cargo-dialog>
        <!--冻结库存-->
        <freeze-dialog v-model="freezeShow"
                       :title="freezeTitle"
                       :params-data="paramsData"
                       :param="param"
                       @handle_freeze_dialog="handle_freeze_dialog"
        ></freeze-dialog>
        <inventory-transfer v-model="transferVisible"
                            :warehouse-name="warehouseName"
                            :warehouse_id="searchData.warehosue_id"
                            :page-size="searchData.pageSize"
                            :selected-ids="selectedIds"></inventory-transfer>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {entrepot_picking} from '@/api/entrepot-picking';
    import {
        warehouse_cargo_goods,
        warehouse_cargo_delete,
        api_get_label,
        api_warehouse_cargo_goods_export,
        url_warehouse_cargo_detail,
        url_warehouse_cargo_delete,
        warehouse_cargo_goods_export,
        url_cargo_goods_batch_shift
    } from '@/api/warehouse-cargo-goods';
    import {
        api_local_shif,
        url_local_shif,
        api_warehouse_goods_modify_hold,
        url_warehouse_goods_modify_hold
    } from '@/api/local';
    import {downloadFile} from '@/lib/http';

    export default {
        page: {},
        permission: {
            url_warehouse_cargo_detail,
            url_warehouse_cargo_delete,
            url_local_shif,
            url_warehouse_goods_modify_hold,
            warehouse_cargo_goods_export,
            url_cargo_goods_batch_shift
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                searchData: {
                    page: 1,
                    pageSize: 50,
                    warehouse_id: 2,
                    warehouse_area_type: 0,
                    code: '',
                    cargo_class_id: '',
                    sku: '',
                    goods_name: '',
                    numType: 'quantity',
                    numSymbol: '>',
                    numText: '0',
                    compare_type: 0,
                    sort_field: '',
                    sort_type: ''
                },
                count: 0,
                dataTable: [],
                loading: false,
                showDialog: false,
                detailRow: {},
                printId: [],
                batchData: {},
                dialogShow: false,
                freezeShow: false,
                printVisable: false,
                transferVisible: false,
                exportDisabled: false,
                title: '',
                freezeTitle: '',
                paramsData: {},
                param: {},
                ids: [],
                selectedIds: [],
                warehouseName: '',
            }
        },
        created() {
        },
        methods: {
            sku_image(images) {
                if (!!images) {
                    return images.replace('_60x60.', '_200x200.')
                }
                return "";
            },
            sort_change(column) {
                console.log("column", column);
                if (column.column instanceof Object) {
                    console.log("column.column.label", column.column.label);
                    console.log("column.order", column.order);
                    this.searchData.sort_field = column.column.label === "货位号" ? "cargo" : "quantity";
                    this.searchData.sort_type = column.order === "descending" ? "desc" : "asc";
                    this.init();
                }
            },
            init() {
                this.loading = true;
                let params = this.get_params();
                this.dataTable = [];
                this.$http(warehouse_cargo_goods, params).then(res => {
                    this.dataTable = clone(res.data);
                    this.loading = false;
                    this.count = res.count;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init();
            },
            search() {
                this.init();
            },
            select_delete(val) {
                this.selectedIds = val.map(res => {
                    return res.id;
                });
                console.log(this.selectedIds);
            },
            export_data() {
                let params = this.get_params();
                let paramsData = window.clone(params);
                if (this.selectedIds.length) {
                    Object.assign(paramsData, {
                        ids: this.selectedIds,
                        export_type: 2
                    });
                } else {
                    paramsData.ids = '';
                    paramsData.export_type = 1;
                }
                this.exportDisabled = true;
                return this.$http(api_warehouse_cargo_goods_export, paramsData).then(res => {
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
                        this.$message({type: 'error', message: res.message || res});
                    }
                    this.exportDisabled = false;
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                    this.exportDisabled = false;
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey(`api_warehouse_cargo_goods_export`, false);
                    }, 200);
                });
            },
            get_params() {
                let data = clone(this.searchData);
                let code = data.code.split('\n').filter(row => !!row);
                data.code = code.map(row => {
                    return row.trim();
                });
                let cur = data.sku.split('\n').filter(row => !!row);
                data.sku = cur.map(row => {
                    return row.trim();
                });
                console.log('搜索', data);
                let params = {
                    page: this.searchData.page,
                    pageSize: this.searchData.pageSize,
                    warehouse_id: this.searchData.warehouse_id,
                    warehouse_area_type: this.searchData.warehouse_area_type,
                    code: data.code,
                    cargo_class_id: this.searchData.cargo_class_id,
                    sku: data.sku,
                    goods_name: this.searchData.goods_name,
                    numSymbol: this.searchData.numSymbol,
                    numType: this.searchData.numType,
                    numText: this.searchData.numText,
                    sort_field: this.searchData.sort_field,
                    sort_type: this.searchData.sort_type,
                    compare_type: this.searchData.compare_type,
                    sku_status: this.searchData.sku_status,
                };
                return params;
            },
            show_detail(row) {
                this.detailRow = row;
                this.showDialog = true;
            },
            shift_detail(data) {
                this.paramsData = data;
                this.param = {
                    warehouse_id: this.searchData.warehouse_id,
                };
                this.ids = data.sku_id;
                this.title = `${data.sku}商品移库`;
                console.log('fromCargoId', data.warehouse_cargo_id);
                this.dialogShow = true;
            },
            freeze_repertory(row) {
                this.paramsData = row;
                this.param = {
                    warehouse_id: this.searchData.warehouse_id,
                };
                this.freezeTitle = `【货位号：${row.code}】【sku：${row.sku}】调整冻结库存`;
                this.freezeShow = true;
                console.log('冻结库存', row);
            },
            get_shift(data) {
                let params = {
                    sku_id: this.ids,
                    from_cargo_id: data.from_cargo_id,
                    to_cargo_id: data.to_cargo_id,
                    quantity: data.quantity,
                    warehouse_id: this.searchData.warehouse_id,
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
                });
            },
            handle_freeze_dialog(data) {
                this.$http(api_warehouse_goods_modify_hold, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.freezeShow = false;
                    this.init();
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            goods_delete(row) {
                this.$confirm(`您将解绑 ${row.code}与${row.sku} 的关系, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(warehouse_cargo_delete, row.id).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        let index = this.dataTable.findIndex(item => {
                            return item.id === row.id;
                        });
                        this.dataTable.splice(index, 1);
                    }).catch(code => {
                        this.$message({message: code.message || code, type: 'error'})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            print(row) {
                this.printId.length = 0;
                this.printId.push(row.sku_id);
                let data = {
                    ids: this.printId,
                    is_band_area: 1,
                    warehouse_id: this.searchData.warehouse_id
                }
                this.$http(api_get_label, data).then(res => {
                    this.batchData = res;
                    this.batchData.print_data.forEach(row => {
                        row.print_num = 1;
                    });
                    this.printVisable = true;
                    this.$refs.preview.get_template(1);
                    if (this.batchData.default_temp_id) {
                        this.$nextTick(() => {
                            this.$refs.preview.change_print();
                        })
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })
            },
            transfer_inventory() {
                if (this.selectedIds.length === 0) {
                    this.$message({
                        type: 'error',
                        message: '请选择需要转移的商品！'
                    });
                    return;
                }
                this.transferVisible = true;
            },
            set_warehouse_name(val) {
                this.warehouseName = val;
            }
        },
        components: {
            cardSearch: require('./card-search.vue').default,
            freezeDialog: require('./freeze-dialog.vue').default,
            cargoDialog: require('./cargo-dialog.vue').default,
            detail: require('./detail.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            preview: require('./preview.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
            inventoryTransfer: require('./inventory-transfer').default,
        }
    }
</script>
