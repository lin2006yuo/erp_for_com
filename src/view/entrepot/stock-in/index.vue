<template>
    <page class="p-index">
        <card-search class="mb-xs"
                     :params="searchData"
                     :clears="clears"
                     @clear="clear"
                     ref="search"
                     @search="search">
        </card-search>
        <el-button tag="ElButton"
                   type="primary"
                   size="mini"
                   style="margin-left: 10px"
                   class="inline date mb-xs"
                   @click="astock_inAdd"
        >新建入库单
        </el-button>
        <permission tag="trendsSelect"
                    class="inline ml-sm mb-xs"
                    type="primary"
                    :route="apis.url_stock_in_export"
                    :selects="partAllOptions"
                    @trigger="export_excel"></permission>
        <data-table
                :is-loading="isLoading"
                :data-table="dataTable"
                @look-over="look_over"
                @stock-in="stock_in"
                @cur-delete="cur_delete"
                @mdf="mdf"
                @size-change="size_change"
                @current-change="current_change"
                @audit="look_over"
        ></data-table>
        <look-over v-model="lookDialog" @update="init" :edit="edit" ref="lookover"></look-over>
        <stock-inadd v-model="stock_inAdd" @add="init"></stock-inadd>
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
        stock_in,
        stock_lookup,
        api_del,
        api_do_stock_in,
        api_stock_in_export,
        api_stock_in_export_title,
        url_stock_in_export
    } from '@/api/stock-in';
    import {downloadFile} from '@/lib/http';

    export default {
        page: {},
        permission: {
            url_stock_in_export
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                edit: false,
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
                lookDialog: false,
                isLoading: false,
                stock_inAdd: false,
                conds: {},
                searchData: {
                    warehouse_id: 2,
                    type: 0,
                    status: -1,
                    snType: "code",
                    snText: "",
                    date_b: "",
                    date_e: "",
                },
                clears: {
                    warehouse_id: 2,
                    type: 0,
                    status: -1,
                    snType: "code",
                },
                isCleared: false, export_type: 1,
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
            clear() {
                this.isCleared = true;
            },
            get_params() {
                let searchData = clone(this.searchData);
                typeof searchData.snText === 'string' && (searchData.snText = searchData.snText.trim());
                if (searchData.date_b instanceof Date) {
                    searchData.date_b = searchData.date_b.getStartDaySTime();
                }
                if (searchData.date_e instanceof Date) {
                    searchData.date_e = searchData.date_e.getEndDaySTime();
                }
                if (searchData.snType === 'sku') {
                    searchData.snText = searchData.snText.split('\n').filter(row => !!row).map(row => row.trim());
                }
                if (this.isCleared) {
                    this.dataTable.page = 1;
                    this.dataTable.pageSize = 50;
                    this.isCleared = false;
                }
                this.$set(searchData, 'page', this.dataTable.page);
                this.$set(searchData, 'pageSize', this.dataTable.pageSize);
                return searchData;
            },
//        	新建入库
            astock_inAdd() {
                this.stock_inAdd = true;
            },
            init() {
                this.isLoading = true;
                this.$http(stock_in, this.get_params()).then(res => {
                    this.isLoading = false;
                    this.dataTable.list = res.data;
                    this.dataTable.list.forEach((list, i) => {
                        this.$set(this.dataTable.list[i], "isCheck", false);
                        this.$set(this.dataTable.list[i], "show", false);
                    });
                    this.dataTable.total = res.count;
                }).catch(code => {
                    this.isLoading = false;
                    this.$message({type: "error", message: code.message || code});
                })
            },
//            搜索/清空搜索
            search() {
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
            stock_in(val) {
                this.$confirm(`您将操作${val.code}入库, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_do_stock_in, val.id).then(res => {
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
                this.$http(api_stock_in_export, data, {
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
                this.$http(api_stock_in_export_title).then(res => {
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
            stockInadd: require('./stock-inadd.vue').default,
            exportTitle: require('../stock-out/export-title.vue').default,
            exportDialog: require('../stock-out/export-dialog.vue').default,
        }
    }
</script>
