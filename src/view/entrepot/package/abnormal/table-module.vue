<template>
    <div class="c-picking-sku-table">
        <div class="mt-xs mb-xs">
            <permission tag="ElButton" @click.native="make_handle"
                        :disabled="selectedData.length === 0"
                        type="primary"
                        size="mini"
                        :route="apis.url_edit_parcel_exception">
                处理异常
            </permission>
            <permission tag="ElButton" @click.native="make_handle_end"
                        :disabled="selectedData.length === 0"
                        type="primary"
                        size="mini"
                        :route="apis.url_parcel_batch_end">
                标记为已处理
            </permission>
            <permission tag="trendsSelect"
                        class="inline ml-sm"
                        type="primary"
                        :route="apis.url_post_export"
                        :selects="partAllOptions"
                        @trigger="export_data"></permission>
        </div>
        <el-table class="mb-sm scroll-bar"
                  border :data="tableData"
                  highlight-current-row
                  v-resize="{height:41}"
                  @selection-change="batch_select"
                  v-loading="loading"
                  element-loading-text="玩命加载中...">
            <!--<div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>-->
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column label="运输方式" min-width="55" inline-template>
                <div>
                    {{row.shipping_methods}}
                </div>
            </el-table-column>
            <el-table-column label="运单号" min-width="55" inline-template>
                <div>
                    {{row.tracking_number}}
                </div>
            </el-table-column>
            <el-table-column label="采购单号" min-width="70" inline-template>
                <div>
                    <span v-for="(item,index) in row.purchase_order_ids"
                          class="operate"
                          @click="init_list(item)"
                          :key="item">{{`PO${item}${index === row.purchase_order_ids.length -1 ? '' : ','}`}}</span>
                </div>
            </el-table-column>
            <el-table-column label="重量（g）" min-width="50" inline-template>
                <div>{{row.purchase_parcel_weight}}</div>
            </el-table-column>
            <el-table-column label="供应商" min-width="70" inline-template>
                <div>{{row.supplier_name}}</div>
            </el-table-column>
            <el-table-column label="采购员" min-width="50" inline-template>
                <div>{{row.purchase_user_name_list}}</div>
            </el-table-column>
            <el-table-column label="拆包员" min-width="50" inline-template>
                <div>{{row.unpacked_name}}</div>
            </el-table-column>
            <el-table-column label="拆包时间" min-width="90" inline-template>
                <div>{{row.unpacked_time}}</div>
            </el-table-column>
            <el-table-column label="处理状态" min-width="60" inline-template>
                <div>{{row.exception_status | filterStatus}}</div>
            </el-table-column>
            <el-table-column label="异常描述" min-width="100" inline-template>
                <div>{{row.abnormal_content}}</div>
            </el-table-column>
            <el-table-column label="处理人" min-width="60" inline-template>
                <div>{{row.parcel_exception_user}}</div>
            </el-table-column>
            <el-table-column label="处理时间" min-width="90" inline-template>
                <div>{{row.parcel_exception_date}}</div>
            </el-table-column>
            <el-table-column label="处理备注" min-width="90" inline-template>
                <div>{{row.processing_method || '--'}}</div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="t-right"
                @size-change="$listeners['handle-size-change']"
                @current-change="$listeners['handle-current-change']"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <mark-handle v-model="markHandleVisible"
                     @search="$listeners['search']"
                     :selected-data="selectedData"></mark-handle>
        <batch-handle v-model="batchHandleVisible"
                      @search="$listeners['search']"
                      :selected-data="selectedData"></batch-handle>
        <look-list v-model="lookVisible"
                   :look-data="lookData"
                   :edit="false"
                   :list-id="listId"
                   :edit-able="false"
                   :is-invalid-apply="false"
                   :is-invalid-audit="false"></look-list>
        <export-field  :param="export_model_type"
                       v-model="exportVisible"
                       :fields="fields"
                       :templates="templates"
                       @getTemplate="get_templates"
                       :fixparam="fixparam"
                       title="请选择自定义导出字段"
                       :creat-excel="creat_excel"></export-field>
        <export-dialog v-model="export_visible"></export-dialog>
    </div>
</template>

<style lang="stylus">
</style>

<script>
    import {url_edit_parcel_exception, url_parcel_batch_end, api_get_export_title, api_post_export, api_goods_export_template, url_post_export} from "@/api/arrival-parcel";
    import {api_look_detail} from "@/api/purchase";
    import {downloadFile} from '@/lib/http';
    export default {
        permission: {
            url_edit_parcel_exception,
            url_parcel_batch_end,
            url_post_export
        },
        data() {
            return {
                selectedData: [],
                markHandleVisible: false,
                batchHandleVisible: false,
                lookVisible: false, //采购单查看
                lookData: {},
                listId: '', // 当前采购单id
                partAllOptions: [
                    {name: "部分导出", value: 2},
                    {name: "全部导出", value: 1}
                ],
                fields: [],
                templates: [],
                export_type: '',
                export_model_type: {
                    type: 37
                },
                export_visible: false,
                exportVisible: false,
                exportSelect: []
            }
        },
        mounted(){
            this.get_templates();
            this.get_fields();
        },
        filters: {
            filterStatus(val) {
                switch (val) {
                    case 1:
                        return '待处理';
                    case 2:
                        return '继续入库';
                    case 3:
                        return '退货';
                    case 4:
                        return '其他入库(继续拆包)';
                    case 5:
                        return '已处理';
                    case 6:
                        return '其他入库(已入库)';
                }
            }
        },
        methods: {
            fixparam(list) {
                return list.map(row => {
                    return {
                        field_name: row.show_field,
                        field_key: row.field
                    }
                });
            },
            get_fields() {
                this.$http(api_get_export_title).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            get_templates() {
                this.$http(api_goods_export_template, {type: 37}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    });
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            export_data(val) {
                if (val.value === 2 && this.exportSelect.length <= 0) return this.$message({
                    type: "warning",
                    message: "请先选择需要导出的数据"
                });
                this.export_type = val.value;
                this.exportVisible = true;
            },
            creat_excel(param) {
                let data = '';
                switch (this.export_type) {
                    case 2://部分
                        data = {
                            ids: this.exportSelect.map(row => {
                                return row.id
                            }),
                            export_type: this.export_type,
                            fields: param,
                            warehouse_id: this.warehouseId
                        };
                        Object.assign(data,this.$parent.get_params());
                        return this.order_export(data);
                        break;
                    case 1://全部
                        data = {
                            fields: param,
                            warehouse_id: this.warehouseId
                        };
                        Object.assign(data,this.$parent.get_params());
                        this.$set(data, 'export_type', this.export_type);
                        return this.order_export(data);
                        break;
                }
            },
            order_export(params) {
                return this.$http(api_post_export, params).then(res => {
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
                            suffix: '.csv',
                        });
                        this.$message({type: "success", message: '导出成功' || res});
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
                return Promise.resolve()
            },
            search_img(image) {
                this.imgPath = image.replace("_60x60", "_500x500");
                this.imgDialog = true;
            },
            batch_select(val) {
                this.selectedData = val.filter(row => row.exception_status === 1);
                this.exportSelect = val
            },
            make_handle() {
                this.markHandleVisible = true;
            },
            make_handle_end() {
                this.batchHandleVisible = true;
            },
            init_list(id) {
                this.lookData = {};
                this.listId = id;
                this.$set(this.lookData, "shipping_cost", 0);
                this.$http(api_look_detail, id).then(res => {
                    res.expect_arrive_date = datef('YYYY-MM-dd', res.expect_arrive_date);
                    this.lookData = res;
                    this.lookData.purchase_order_code = 'PO' + res.id;
                    this.lookVisible = true;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
        },
        computed: {},
        props: {
            tableData: {},
            loading: {},
            searchData: {},
            total: {},
            warehouseId: {}
        },
        components: {
            uiTip: require('@/components/ui-tip').default,
            markHandle: require('./mark-handle.vue').default,
            batchHandle: require('./batch-handle.vue').default,
            lookList: require('@/view/procurement/purchase/look-list.vue').default,
            trendsSelect:require('@/components/trends-select').default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('../../../report/export-dialog').default
        }
    }
</script>
