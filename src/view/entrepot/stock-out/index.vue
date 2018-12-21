<template>
    <page class="p-index">
        <card-search
                class="mb-xs"
                ref="search"
                @clear="clear"
                @search="search"
        ></card-search>
        <el-button tag="ElButton"
                   type="primary"
                   size="mini"
                   style="margin-left: 10px"
                   class="inline date mb-xs"
                   @click="astock_out_add"
        >新建出库单
        </el-button>
        <permission tag="trendsSelect"
                    class="inline ml-sm mb-xs"
                    type="primary"
                    :route="apis.url_stock_out_export"
                    :selects="partAllOptions"
                    @trigger="export_excel"></permission>
        <data-table
                :data-table="dataTable"
                :is-loading="loading"
                @look-over="look_over"
                @cur-delete="cur_delete"
                @look-audit="look_over"
                @do-stock-out="do_stock_out"
                @mdf="mdf"
                @size-change="size_change"
                @current-change="current_change"
        ></data-table>
        <look-over v-model="lookDialog" @update="init" :edit="edit" ref="lookover"></look-over>
        <stock-out-add v-model="stock_outAdd" @add="init"></stock-out-add>
        <export-title
                v-model="exportVisible"
                title="选择需要导出的产品项目"
                :export-title="exportTitle"
                @export-title="export_title"
        ></export-title>
        <export-dialog v-model="exportDialogVisible"></export-dialog>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {
        stock_out,
        api_del,
        do_stock_out,
        api_stock_out_export,
        api_stock_out_export_title,
        url_stock_out_export
    } from '@/api/stock-out';
    import {downloadFile} from '@/lib/http';

    export default {
        page: {},
        permission: {
            url_stock_out_export
        },
        refresh() {
            this.$refs.search.search();
            this.init();
        },
        data() {
            return {
                dataTable: {
                    list: [
                        {
                            isCheck: false,
                            show: false,
                            input_number: "111111",
                            input_type: "采购入库",
                            warehouse: "东莞仓",
                            source_number: "05767829M53978827",
                            creater: "XXX",
                            status: "待审",
                            auditor: "xxx",
                            create_time: "2016-11-10 11:17",
                            update_time: "2016-11-10 11:17",
                            orderProductList: []
                        }
                    ],
                    page: 1,
                    pageSize: 20,
                    total: 0
                },
                selectList: [],
                lookDialog: false,
                title: "",
                loading: false,
                conds: {},
                edit: false,
                stock_outAdd: false,
                isCleared: false,
                export_type: 1,
                partAllOptions: [
                    {
                        name: "全部导出", value: 1, action: function () {
                            this.export_type = 1; // 全部导出
                            this.get_export_title();
                        }
                    },
                    {
                        name: "部分导出", value: 0, action: function () {
                            if (this.selectedIds.length <= 0) return this.$message({
                                type: "warning",
                                message: "请先选择需要导出的数据"
                            });
                            this.export_type = 0;
                            this.get_export_title();
                        }
                    },
                ],
                exportVisible: false,
                exportTitle: [],
                exportDialogVisible: false,
            }
        },
        created() {
            this.init();
        },
        methods: {
            export_excel(val) {
                val.action.call(this);
            },
//        	新建入库
            astock_out_add() {
                this.stock_outAdd = true;
            },
            clear() {
                this.isCleared = true;
            },
            init() {
                this.loading = true;
                let data = this.get_params(this.conds);
                this.$http(stock_out, data).then(res => {
                    this.dataTable.list = res.data.map(row => {
                        row.isCheck = false;
                        row.show = false;
                        return row;
                    });
                    this.dataTable.total = res.count;
                    this.loading = false;
                }).catch(code => {
                    this.loading = false;
                    this.$message({type: "error", message: code.message || code});
                })
            },
            get_params(conds) {
                if (this.isCleared) {
                    this.dataTable.page = 1;
                    this.dataTable.pageSize = 50;
                    this.isCleared = false;
                }
                let params = {
                    page: this.dataTable.page,
                    pageSize: this.dataTable.pageSize
                };
                params = Object.assign(params, conds);
                let data = {};
                typeof params.snText === 'string' && (params.snText = params.snText.trim());
                if (params.snType === 'sku') {
                    data = window.clone(params);
                    let cur = data.snText.split('\n').filter(row => !!row);
                    data.snText = cur.map(row => {
                        return row.trim();
                    });
                } else {
                    data = window.clone(params);
                }
                return data;
            },
            search(conds) {
                this.conds = conds;
                this.init();
            },
//            操作
            look_over(val, bool) {
                this.edit = bool;
                this.lookDialog = true;
                this.$nextTick(() => {
                    this.$refs.lookover.request_look(val.id);
                })
            },
//            出库
            do_stock_out(data) {
                this.$confirm(`您将操作${data.code}出库, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(do_stock_out, {id: data.id}).then(res => {
                        this.$message(res.message);
                        this.init();
                    }).catch(code => {
                        this.$message({message: code.message || code, type: 'error'});
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            cur_delete(data) {
                this.$prompt(`您将删除${data.code},确认此操作吗？`, '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showInput: false
                }).then(({value}) => {
                    this.$http(api_del, data.id).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.init();
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        })
                    })
                }).catch(() => {
                    this.status = !this.status;
                    this.$message({
                        type: "info",
                        message: `已取消`
                    });
                });
            },
            mdf() {
                console.log("mdf");
            },
//            翻页
            size_change(val) {
                this.dataTable.pageSize = val;
                this.init(this.conds);
            },
            current_change(val) {
                this.dataTable.page = val;
                this.init(this.conds);
            },
            export_title(val) {
                this.exportVisible = false;
                let data = {
                    export_type: this.export_type,
                    fields: val
                };
                if (this.export_type) {
                    Object.assign(data, this.get_params(this.conds));
                } else {
                    Object.assign(data, this.get_params(this.conds), {ids: this.selectedIds});
                }
                this.$http(api_stock_out_export, data, {
                    'X-Result-Fields': val.map(item => item.key).join(','),
                    contentType: 'application/x-www-form-urlencoded'
                }).then(res => {
                    if (res.join_queue === 1) {
                        this.$message({type: "success", message: res.message || res});
                        this.exportDialogVisible = true;
                    } else {

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
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            get_export_title() {
                this.$http(api_stock_out_export_title).then(res => {
                    this.exportTitle = res;
                    this.exportVisible = true;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code,
                    })
                })
            },
        },
        computed: {
            selectedIds() {
                let cur = [];
                if (this.dataTable.list && this.dataTable.list.length > 0) {
                    cur = this.dataTable.list.filter(row => row.isCheck).map(row => {
                        return row.id
                    });
                }
                return cur;
            }
        },
        components: {
            trendsSelect: require('@/components/trends-select').default,
            cardSearch: require("./card-search.vue").default,
            dataTable: require('./data-table.vue').default,
            lookOver: require('./look-over.vue').default,
            stockOutAdd: require('./stock-outadd.vue').default,
            exportTitle: require('./export-title.vue').default,
            exportDialog: require('./export-dialog.vue').default,
        }
    }
</script>
