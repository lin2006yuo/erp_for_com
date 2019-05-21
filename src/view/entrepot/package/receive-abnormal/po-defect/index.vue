<template>
    <page class="p-picking-sku">
        <search-module :search-data="searchData"
                       :warehouse-list="warehouseList"
                       @warehouse-change="warehouse_change"
                       @search="init"></search-module>
        <el-row class="mt-sm mb-sm">
            <permission tag="trendsSelect"
                        class="inline ml-sm"
                        type="primary"
                        :route="apis.url_post_purchase_order_export_no_order"
                        :selects="partAllOptions"
                        @trigger="export_excel"></permission>
            <permission tag="request-button"
                        req-key="api_process_status"
                        class="inline ml-sm"
                        @click="make_handle"
                        :disabled="handleSelect.length === 0"
                        type="primary"
                        size="mini"
                        :route="apis.url_process_status">
                标记为已处理
            </permission>
        </el-row>
        <table-module :table-data="tableData"
                      class="mt-sm"
                      :search-data="searchData"
                      :loading="loading"
                      :total="total"
                      @update-table="update_table"
                      @batch-select="batch_select">
        </table-module>
        <el-pagination
            class="t-right"
            @size-change="handle_size_change"
            @current-change="handle_current_change"
            :current-page="page"
            :page-sizes="[20, 50, 100, 200]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <export-field :param="export_model_type"
                      v-model="exportVisable"
                      :fields="fields" :templates="templates"
                      @getTemplate="get_templates"
                      title="请选择自定义导出字段"
                      :fixparam="fixparam"
                      :creat-excel="creat_excel"></export-field>
        <export-dialog v-model="export_visible"></export-dialog>
    </page>
</template>

<style lang="stylus">
    .p-picking-sku {
        .el-card {
            overflow: visible;
            .width-super.el-input {
                width: 200px
            }
        }
    }
</style>

<script>
    import {
        url_process_status,
        api_receive_abnormal,
        api_process_status,
        api_get_purchase_order_export_fields_no_order,
        url_post_purchase_order_export_no_order,
        api_post_purchase_order_export_no_order
    } from "@/api/ready-receive";
    import {
        api_goods_export_template,
    } from "@/api/product-library";
    import {downloadFile} from '@/lib/http';

    export default {
        page: {
            devinfo: {
                frontEnd: '张志勇',
                backEnd: '黄伟杰',
                createTime: '2018-11-20',
                updateTime: '2018-11-22'
            }
        },
        permission: {
            url_process_status,
            url_post_purchase_order_export_no_order
        },
        refresh() {
            this.search();
        },
        data() {
            return {
                warehouse_id: 2,
                loading: false,
                searchData: {
                    process_status: '',
                    bill_type: 1,
                    bill_number: '',
                    person_type: 2,
                    person_id: '',
                    person_name: '',
                    time_type: 1,
                    date_b: '',
                    date_e: '',
                    is_use:''
                },
                total: 0,
                tableData: [],
                sort_field: '',
                sort_type: '',
                partAllOptions: [
                    {name: "部分导出", value: 2},
                    {name: "全部导出", value: 1}
                ],
                exportVisable: false,
                export_model_type: {
                    type: 30
                },
                fields: [],
                templates: [],
                export_visible: false,
                export_type: '',
                selectedData: [],
                page: 1,
                pageSize: 50,
            }
        },
        mounted(){
            this.get_fields();
            this.get_templates();
        },
        methods: {
            warehouse_change(warehouse_id) {
                this.warehouse_id = warehouse_id;
                this.init();
            },
            init() {
                let data = this.get_params();
                this.loading = true;
                this.$http(api_receive_abnormal, data).then(res => {
                    this.tableData = res.list.map(row => {
                        this.$set(row, 'purchase_order_ids', row.purchase_order_ids.split(',').map(row => {
                            return !!row ? `PO${row}` : row;
                        }).join());
                        return row;
                    });
                    this.total = res.count;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code,
                    })
                }).finally(() => {
                    this.loading = false;
                })
            },
            get_params: function () {
                Object.keys(this.searchData).forEach(key => {
                    if (typeof this.searchData[key] === 'string') {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });

                let searchData = clone(this.searchData);
                if (this.searchData.date_b) {
                    searchData.date_b = datef('YYYY-MM-dd', this.searchData.date_b.getTime() / 1000);
                } else {
                    searchData.date_b = '';
                }
                if (this.searchData.date_e) {
                    searchData.date_e = datef('YYYY-MM-dd', this.searchData.date_e.getTime() / 1000);
                } else {
                    searchData.date_e = '';
                }
                if (searchData.bill_number !== '') {
                    searchData.bill_number = searchData.bill_number.split('\n').filter(row => !!row).map(row => row.trim());
                }
                searchData.warehouse_id = this.warehouse_id;
                searchData.page = this.page;
                searchData.pageSize = this.pageSize;
                this.sort_field && (searchData.sort_field = this.sort_field);
                this.sort_type && (searchData.sort_type = this.sort_type);

                return searchData;
            },
            handle_size_change(val) {
                this.pageSize = val;
                this.init();
            },
            handle_current_change(val) {
                this.page = val;
                this.init();
            },
            update_table(abnormal_id,data){
                if(!!abnormal_id && !!data){
                    let find = this.tableData.find(row=>row.id === abnormal_id);
                    if(find){
                        data.purchase_order_ids = typeof data.purchase_order_ids==='string' && data.purchase_order_ids.split(',').map(row => {
                            return !!row ? `PO${row}` : row;
                        }).join();
                        Object.assign(find,data);
                    }
                }else{
                    this.init();
                }
            },
            batch_select(val) {
                this.selectedData = val;
            },
            make_handle() {
                let ids = this.handleSelect.map(row => row.id);
                this.$http(api_process_status, {ids}).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.init();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('api_process_status', false);
                    }, 200);
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
                return this.$http(api_post_purchase_order_export_no_order, params).then(res => {
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
                            suffix: '.csv',
                        });
                        this.$message({type: "success", message: '导出成功' || res});
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
                return Promise.resolve();
            },
            get_fields() {
                this.$http(api_get_purchase_order_export_fields_no_order).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            get_templates() {
                this.$http(api_goods_export_template, {type: 30}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    });
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            export_excel(val) {
                if (val.value === 2 && this.selectedData.length === 0){
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
                switch (this.export_type) {
                    case 2://部分
                        data = {
                            ids: JSON.stringify(this.selectedData.map(row => {
                                if (typeof row === 'object') {
                                    return row.id
                                } else {
                                    return row
                                }
                            })),
                            export_type: this.export_type,
                            fields: param
                        };
                        Object.assign(data, this.get_params());
                        return this.order_export(data);
                        break;
                    case 1://全部
                        data = this.get_params();
                        this.$set(data, 'export_type', this.export_type);
                        this.$set(data, 'fields', param);
                        return this.order_export(data);
                        break;
                }
            },
            //账号参数
            fix_params_account({page, pageSize, keyword}) {
                return {
                    page: page,
                    pageSize: pageSize,
                    snText: keyword || "",
                    snType: "realname"
                };
            },//账号结果
            fix_result_account(res) {
                return {
                    options: res.data.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    }),
                    page: res.page,
                    count: res.count,
                }
            },
        },
        computed: {
            handleSelect() {
                return this.selectedData.filter(row => {
                    if (row.processing_status === 0) {
                        if (row.is_use < 2) {
                            return true;
                        } else {
                            return row.processing_method !== '';
                        }
                    } else {
                        return false;
                    }
                })
            }
        },
        props: {
            warehouseList: {
                required: true,
                type: Array
            }
        },
        components: {
            searchModule: require('./search-module.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            labelButtons: require('@/components/label-buttons.vue').default,
            scrollSelect: require('@/components/scroll-select.vue').default,
            orderInput: require('@/components/order-input.vue').default,
            tableModule: require('./table-module.vue').default,
            purchaser: require('@/api-components/purchaser.vue').default,
            trendsSelect: require('@/components/trends-select').default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('../../../../report/export-dialog').default,
        }
    }
</script>
