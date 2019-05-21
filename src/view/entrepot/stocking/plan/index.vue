<template>
    <page class="p-index">
        <card-search @search="search" @clear="clear" ref="search"></card-search>
        <el-row>
            <!--<permission type="primary"-->
                        <!--tag="ElButton"-->
                        <!--:route="apis.url_stocking_sku_list"-->
                        <!--:disabled="selectIds.length===0||selectIds.length!==audited.length"-->
                        <!--class="mt-xs mb-xs ml-sm"-->
                        <!--@click="make_plan"-->
                        <!--size="mini">生成采购计划-->
            <!--</permission>-->
            <permission tag="trendsSelect"
                        class="inline ml-sm"
                        type="primary"
                        :route="apis.url_stock_export"
                        :selects="partAllOptions"
                        @trigger="export_sku"></permission>
            <permission type="primary"
                        tag="ElButton"
                        :route="apis.url_stock_batch_commit"
                        :disabled="selectIds.length===0 || selectIds.length !== unsubmitted.length"
                        class="mt-xs mb-xs ml-sm"
                        @click="upload_plan"
                        size="mini">提交审核
            </permission>
        </el-row>
        <el-row>
            <el-table
                    v-loading="isLoading"
                    element-loading-text="玩命加载中......"
                    class="scroll-bar"
                    highlight-current-row
                    v-resize="{height:41}"
                    :data="tableData"
                    @selection-change="select_items">
                <el-table-column
                        align="center"
                        type="selection"
                        min-width="30">
                </el-table-column>
                <el-table-column
                        inline-template
                        min-width="100"
                        label="申请单号">
                    <div>
                        <ui-tip :content="row.code" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        min-width="100"
                        label="申请单名称">
                    <div>
                        <ui-tip :content="row.remark || '点击添加名称'" :is-operate="true" @cur-click="add_remark(row)"
                                :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        min-width="100"
                        inline-template
                        label="品类数/商品数">
                    <div>{{row.sku_count}}/{{row.in_quantity}}</div>
                </el-table-column>
                <el-table-column
                        inline-template
                        min-width="60"
                        label="备货仓库">
                    <div>{{row.warehouse}}</div>
                </el-table-column>
                <el-table-column
                        min-width="60"
                        inline-template
                        label="中转仓库">
                    <div>{{row.transit_warehouse}}</div>
                </el-table-column>
                <!-- TODO:后端返回中转仓库应为数组 -->
                <el-table-column
                        inline-template
                        min-width="80"
                        label="状态">
                    <div>{{row.status_txt}}</div>
                </el-table-column>
                <el-table-column
                        inline-template
                        min-width="80"
                        label="开发处理状态">
                    <div>{{row.develop_status | developFilter}}</div>
                </el-table-column>
                <el-table-column
                        inline-template
                        min-width="80"
                        label="采购处理状态">
                    <div>{{row.purchase_status | purchaseFilter}}</div>
                </el-table-column>
                <el-table-column
                        inline-template
                        min-width="130"
                        label="申请时间">
                    <div>{{row.create_time | timeFilter}}</div>
                </el-table-column>
                <el-table-column
                        inline-template
                        min-width="80"
                        label="待审批人">
                    <div>{{row.auditor_name}}</div>
                </el-table-column>
                <el-table-column
                        inline-template
                        min-width="130"
                        label="一级/二级/三级审核人">
                    <div>
                        <div>{{row.auditor}}</div>
                        <div>{{row.auditor_2 || "--"}}</div>
                        <div>{{row.auditor_3 || "--"}}</div>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        min-width="130"
                        label="一级/二级/三级审核时间">
                    <div>
                        <div>{{row.audit_time | timeFilter}}</div>
                        <div>{{row.audit_time_2 | timeFilter}}</div>
                        <div>{{row.audit_time_3 | timeFilter}}</div>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="操作">
                    <div>
                        <permission tag="span" :route="apis.url_stocking_look" class="operate" @click="get_look(row)">
                            查看
                        </permission>
                        <template v-if="searchData.status !== ''">
                            <permission tag="span" :route="apis.url_stocking_look" v-if="row.status===1">|</permission>
                            <permission tag="span" class="operate" :route="apis.url_stocking_look" v-if="row.status === 1"
                                        @click="edit_plan(row)">编辑
                            </permission>
                            <permission tag="span" :route="apis.url_stocking_look" v-if="row.status===2">|</permission>
                            <permission tag="span" class="operate" :route="apis.url_stocking_look" v-if="row.status===2"
                                        @click="get_check(row)">审核
                            </permission>
                        </template>
                        <template v-if="row.status === 1 || row.status === 2">
                            <permission tag="span" :route="apis.url_stock_cancel">|</permission>
                            <permission tag="span" size="mini" class="operate" :route="apis.url_stock_cancel"
                                        @click="invalid_plan(row)">作废
                            </permission>
                        </template>
                        <template v-if="row.status === 4 || row.status === 5">
                            <permission tag="span" :route="apis.url_stock_release_inventory">|</permission>
                            <permission tag="span" class="operate" :route="apis.url_stock_release_inventory"
                                        @click="open_release(row)">释放库存
                            </permission>
                        </template>
                        <permission tag="span" :route="apis.url_audit_log">|</permission>
                        <permission tag="span" size="mini" class="operate" :route="apis.url_audit_log"
                                    @click="look_log(row)">日志
                        </permission>
                    </div>
                </el-table-column>
            </el-table>
        </el-row>
        <el-pagination
                class="page-fixed"
                @size-change="change_size"
                @current-change="change_page"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count">
        </el-pagination>
        <look-check v-model="dialogShow" :title="title"
                    @update="update"
                    :data-loading="dataLoading"
                    :detail-data="detailData"
                    :release-show="releaseShow"
                    :check-show="checkShow" @close="close" :edit-show="editShow"></look-check>
        <form-add v-model="showAdd"
                  @add-update="add_update"
                  :plan-data="planData"
                  :stock-description="stockDescription"
                  :select-mark="selectMark">
        </form-add>
        <add-remark v-model="remarkVisible" :remark-data="remarkData"></add-remark>
        <audit-log v-model="logVisible" :action="action" @close="clear_action"></audit-log>
        <export-field :param="export_model_type" v-model="exportVisable" :fields="fields" :templates="templates"
                      @getTemplate="get_templates" title="请选择自定义导出字段" :creat-excel="creat_excel"></export-field>
        <export-dialog v-model="export_visible"></export-dialog>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {
        api_stocking, api_stocking_look, api_stock_cancel, api_stocking_sku_list, api_stock_batck_commit,
        url_stocking_look, url_stocking_sku_list, url_stock_batch_commit, url_audit_log, url_stock_cancel,
        api_stock_export_title,url_stock_export_title,api_stock_export,url_stock_export,url_stock_release_inventory
    } from '@/api/stocking';
    import {mapGetters} from 'vuex';
    import {api_goods_export_template} from "@/api/product-library";
    import {downloadFile} from '@/lib/http';

    export default {
        permission: {
            url_stock_cancel,
            url_stocking_look,
            url_stocking_sku_list,
            url_stock_batch_commit,
            url_audit_log,
            url_stock_export,
            url_stock_release_inventory
        },
        page: {},
        refresh() {
            this.init();
        },
        mounted(){
            this.get_fields();
            this.get_templates();
        },
        data() {
            return {
                timeout: 8000,
                searchData: {
                    code_type: 1,
                    code: '',
                    warehouse_id: '',
                    status: '',
                    development_status: '',
                    purchase_status: '',
                    name_type: 1,
                    name: '',
                    channel_id: '',
                    auditor_id: '',
                    auditor_name: '',
                    time_type: 1,
                    time_st: (Date.now()-(20*24*60*60*1000)),
                    time_nd: Date.now(),
                    transit_warehouse_id: '',
                    page: 1,
                    pageSize: 50,
                },
                isCleared: false,
                count: 0,
                tableData: [],
                isLoading: false,
                dialogShow: false,
                checkShow: false,
                editShow: false,
                releaseShow: false,
                remarkVisible: false,
                logVisible: false,
                showAdd: false,
                selectIds: [],
                selectData: [],
                audited: [],
                unsubmitted: [],
                detailData: [],
                planData: {
                    list: [],
                },
                title: '',
                selectMark: '',
                stockDescription: {},
                remarkData: '',
                action: {
                    id: '',
                    code: '',
                },
                partAllOptions: [
                    {name: "部分导出", value: 0},
                    {name: "全部导出", value: 1}
                ],
                export_type: '',
                export_model_type: {
                    type: 66
                },
                export_visible: false,
                exportVisable: false,
                templates: [],
                fields: [],
                dataLoading: false
            }
        },
        created() {
            // this.init();
        },
        methods: {
            clear() {
                this.isCleared = true;
            },
            close() {
                this.checkShow = false;
                this.editShow = false;

            },
            init() {
                let data = this.init_params();
                this.isLoading = true;
                this.$http(api_stocking, data).then(res => {
                    this.tableData = res.list;
                    this.count = res.count;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                }).finally(() => {
                    this.isLoading = false;
                });
            },
            init_params(){
                this.searchData.code = this.searchData.code.trim();
                if (this.searchData.time_st) {
                    let date_b_s = new Date(this.searchData.time_st)
                    this.searchData.time_st = datef("YYYY-MM-dd", date_b_s / 1000);
                } else {
                    this.searchData.time_st = '';
                }
                if (this.searchData.time_nd) {
                    let date_e_s = new Date(this.searchData.time_nd);
                    this.searchData.time_nd = datef("YYYY-MM-dd", date_e_s / 1000);
                } else {
                    this.searchData.time_nd = '';
                }
                if (this.isCleared) {
                    this.searchData.page = 1;
                    this.searchData.pageSize = 50;
                    this.isCleared = false;
                }
                let data = clone(this.searchData);
                let cur = data.name.split('\n').filter(row => !!row);
                data.name = cur.map(row => {
                    return row.trim();
                });
                return data
            },
            search(param) {
                Object.assign(this.searchData, param);
                this.init();
            },
            //释放库存
            open_release(row){
                this.dialogShow = true;
                this.dataLoading = true;
                this.$http(api_stocking_look, row.id).then(res => {
                    this.detailData = res;
                    this.detailData.sku_list.forEach(row => {
                        this.$set(row, 'show', false)
                    });
                    this.detailData.id = row.id;
                    this.dataLoading = false,
                    this.editShow = false;
                    this.releaseShow = true;
                    this.checkShow = false;
                    this.title = `释放库存：${row.code}`
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                })
            },
            get_fields() {
                this.$http(api_stock_export_title).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            get_templates() {
                this.$http(api_goods_export_template, {type: 66}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    })
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            export_sku(val) {
                if (val.value === 0 && this.selectIds.length <= 0) return this.$message({
                    type: "warning",
                    message: "请先选择需要导出的数据"
                });
                this.export_type = val.value;
                this.exportVisable = true;
            },
            creat_excel(param) {
                let fields = param.field.join(',');
                let data = '';
                switch (this.export_type) {
                    case 0://部分
                        data = {
                            ids: this.selectIds.map(row => {
                                if (typeof row === 'object') {
                                    return row.id
                                } else {
                                    return row
                                }
                            }),
                            export_type: this.export_type
                        };
                        Object.assign(data,this.init_params());
                        return this.order_export(data, {
                            'X-Result-Fields': fields,
                            contentType: 'application/x-www-form-urlencoded'
                        });
                        break;
                    case 1://全部
                        data = this.init_params();
                        this.$set(data, 'export_type', this.export_type);
                        return this.order_export(data, {
                            'X-Result-Fields': fields,
                            contentType: 'application/x-www-form-urlencoded'
                        });
                        break;
                }
            },
            order_export(params, head) {
                return this.$http(api_stock_export, params, head).then(res => {
                    if (res.join_queue === 1) {
                        this.export_visible = true;
                        this.$message({type: "success", message: res.message || res});
                    } else {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let params = {
                            file_code: res.file_code,
                            page: this.searchData.page,
                            pageSize: this.searchData.pageSize,
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
            change_size(size) {
                this.searchData.pageSize = size;
                this.init();
            },
            change_page(page) {
                this.searchData.page = page;
                this.init();
            },
            select_items(data) {
                this.selectIds = data.map(res => res.id);
                this.selectData = data;
                this.audited = data.filter(res => res.status === 3);
                this.unsubmitted = data.filter(res => res.status === 1);

            },
            get_look(row) {
                this.dialogShow = true;
                this.dataLoading = true;
                this.$http(api_stocking_look, row.id).then(res => {
                    this.detailData = res;
                    this.detailData.sku_list.forEach(row => {
                        this.$set(row, 'show', false)
                    });
                    this.dataLoading = false;
                    this.checkShow = false;
                    this.releaseShow = false;
                    this.editShow = false;
                    this.title = `查看备货申请单：${row.code} 信息`;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                })
            },
            edit_plan(row) {
                this.dialogShow = true;
                this.dataLoading = true;
                this.$http(api_stocking_look, row.id).then(res => {
                    this.detailData = res;
                    this.detailData.sku_list.forEach(row => {
                        this.$set(row, 'show', false)
                    });
                    this.detailData.id = row.id;
                    this.dataLoading = false;
                    this.editShow = true;
                    this.releaseShow = false;
                    this.checkShow = false;
                    this.title = `编辑备货申请单：${row.code}`
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                })
            },
            //作废
            invalid_plan(row){
                this.$confirm('您将备货单号' + row.code + '作废，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_stock_cancel, row.id).then(res => {
                        this.$message({type: 'success', message: res.message});
                        this.init()
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message||code})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            get_check(row) {
                this.dialogShow = true;
                this.dataLoading = true;
                this.$http(api_stocking_look, row.id).then(res => {
                    this.detailData = res;
                    this.detailData.id = row.id;
                    this.checkShow = true;
                    this.releaseShow = false;
                    this.editShow = false;
                    this.title = `审核备货申请单：${row.code}`
                    this.dataLoading = false
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                })
            },
            update() {
                this.$nextTick(() => {
                    this.init();
                });
            },
            // make_plan() {
            //     // 只有同一中转仓才能批量操作
            //     let transitWarehouse = this.selectData[0].transit_warehouse;
            //     if (!this.selectData.every(row => row.transit_warehouse === transitWarehouse)) {
            //         this.$message({
            //             type: 'error',
            //             message: '中转仓不一致,只能对同一中转仓的备货计划批量处理！'
            //         });
            //         return;
            //     }
            //
            //     let data = {
            //         id: this.selectIds
            //     };
            //     this.planData = {
            //         list: [],
            //     };
            //     this.$confirm(`您将生成采购计划,确认此操作吗?`, "提示", {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     }).then(() => {
            //         this.$http(api_stocking_sku_list, data).then(res => {
            //             this.planData = res;
            //             this.planData.ids = this.selectIds;
            //             this.selectData.forEach(row => {
            //                 this.stockDescription[row.id] = {
            //                     code: row.code,
            //                     creator: row.creator,
            //                 }
            //             });
            //             this.showAdd = true;
            //             this.selectMark = 'stocking';
            //         }).catch(code => {
            //             this.$message({
            //                 type: 'error',
            //                 message: code.message || code
            //             });
            //         });
            //     }).catch(() => {
            //         this.$message({
            //             type: "info",
            //             message: "已取消操作"
            //         });
            //     });
            //
            // },
            upload_plan() {
                let data = {
                    id: this.selectIds
                };
                this.$confirm(`您将批量提交审核备货计划,确认此操作吗?`, "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_stock_batck_commit, data).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res,
                        });
                        this.init();
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    });
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消操作"
                    });
                });
            },
            add_update() {
                this.selectIds.forEach(res => {
                    this.tableData.forEach((row, index) => {
                        if (row.id === res) {
                            this.tableData.splice(index, 1);
                        }
                    });
                })
            },
            add_remark(row) {
                this.remarkVisible = true;
                this.remarkData = row;
            },
            look_log(row) {
                console.log(`xxxxxx:look log`, row);
                this.logVisible = true;
                this.action.id = row.id;
                this.action.code = row.code;
            },
            clear_action() {
                this.action = {
                    id: '',
                    code: '',
                };
            }
        },
        filters: {
            timeFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
            developFilter(val){
                const developStatusTxt = new Map()
                    .set(0, '')
                    .set(1, '待开发审核')
                    .set(2, '开发部分处理')
                    .set(3, '开发全部处理');
                return developStatusTxt.get(val)
            },
            purchaseFilter(val){
                const purchaseStatusTxt = new Map()
                    .set(0, '')
                    .set(1, '待采购审核')
                    .set(2, '采购部分处理')
                    .set(3, '采购全部处理');
                return purchaseStatusTxt.get(val)
            }
        },
        computed: {
            ...mapGetters({currentUser: 'user/info'})
        },
        components: {
            cardSearch: require('./card-search.vue').default,
            lookCheck: require('./look-check.vue').default,
            addRemark: require('./add-remark.vue').default,
            auditLog: require('./audit-log.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            formAdd: require('@/view/procurement/plan/form-add.vue').default,
            trendsSelect: require('@/components/trends-select.vue').default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('../../../report/export-dialog').default,
            requestButton:require('@/global-components/request-button').default
        }
    }
</script>
