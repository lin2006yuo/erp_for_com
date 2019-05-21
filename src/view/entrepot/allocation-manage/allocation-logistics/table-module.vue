<template>
    <page class="c-allocation-plan">
        <el-row class="mt-sm">
            <permission tag="ElButton" type="primary" size="mini"
                        :route="apis.url_allocation_logistics_import"
                        @click="import_file">
                导入单号
            </permission>
        </el-row>
        <el-table
                :data="tableData"
                v-resize="{height:41}"
                v-loading="loading"
                class="scroll-bar mt-sm"
                element-loading-text="玩命加载中"
                highlightCurrentRow>
            <el-table-column
                    inline-template
                    min-width="120"
                    label="调拨单号">
                <div>
                    <ui-tip :content="row.order_code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="100"
                    label="出库仓库">
                <div>
                    <ui-tip :content="row.out_warehouse" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="120"
                    label="入库仓库">
                <div>
                    <ui-tip :content="row.in_warehouse" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="110"
                    label="状态">
                <div style="position: relative">
                    <ui-tip :content="row.status_txt" :width="98"></ui-tip>
                    <el-tooltip :content="row.reason" placement="right" effect="light" v-if="row.status === 2">
                        <span class="error-icon"></span>
                    </el-tooltip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="物流渠道">
                <div>
                    <ui-tip :content="row.shipping_method" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    min-width="120"
                    inline-template
                    label="物流发货方式">
                <div>
                    {{row.shipping_type}}
                </div>
            </el-table-column>
            <el-table-column
                    min-width="120"
                    inline-template
                    label="运单号">
                <div>
                    <ui-tip :content="row.tracking_number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    min-width="100"
                    inline-template
                    label="参考号">
                <div>
                    <ui-tip :content="row.reference_number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <!--<el-table-column
                    inline-template
                    label="创建人">
                <div>
                    <ui-tip :content="row.create" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="审核人">
                <div>
                    <ui-tip :content="row.auditor" :width="98"></ui-tip>
                </div>
            </el-table-column>-->
            <el-table-column
                    label="操作"
                    width="150"
                    inline-template>
                <div>
                    <trends-select class="inline"
                                   @trigger="action(row,$event)"
                                   :selects="m_option(row)"
                                   type="primary">
                    </trends-select>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="$listeners['handle-size-change']"
                @current-change="$listeners['handle-current-change']"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <look-edit :edit-data="editData"
                   v-model="lookVisible"
                   @search="$listeners['search']"
                   :action="trendAction"></look-edit>
        <box-file v-model="boxVisible" :trend-action="trendAction"></box-file>
        <import-excel v-model="importVisible" :params="importParams" :import-data="importData" @import-finish="$listeners['search']"></import-excel>
    </page>
</template>

<style lang="stylus">

</style>

<script>
    import {
        api_allocation_detail,
        url_allocation_detail,
        url_allocation_logistics_upload,
        api_allocation_logistics_import,
        url_allocation_logistics_import,
    } from "@/api/allocation-logistics";

    import {url_get_allocation_attachment} from "@/api/transfer-plan";

    export default {
        permission: {
            url_get_allocation_attachment,
            url_allocation_detail,
            url_allocation_logistics_upload,
            url_allocation_logistics_import,
        },
        data() {
            return {
                trendAction: {},
                tableData: [],
                editData: {
                    box_list: [],
                },
                lookVisible: false,
                boxVisible: false,
                operateButtons: [
                    {
                        label: '查看',
                        apis: url_allocation_detail,
                        action: (data) => {
                            this.trendAction.id = data.id;
                            this.trendAction = {
                                title: `查看调拨计划(${data.order_code})`,
                                number: data.order_code,
                                value: 'look',
                                type: 'logistics',
                                id: data.id
                            };
                            this.editData = {
                                box_list: [],
                            };
                            this.$http(api_allocation_detail, {allocation_id: data.id}).then(res => {
                                this.editData = res;
                                this.lookVisible = true;
                            });
                        }
                    },
                    {
                        label: '箱唛附件',
                        apis: url_get_allocation_attachment,
                        action: (data) => {
                            this.trendAction = {
                                id: data.id,
                                title: `调拨单（${data.order_code}）箱唛附件`,
                                number: data.order_code,
                                value: 'box_file',
                                isPacking: this.is_packing(data),
                            };
                            this.boxVisible = true;
                        }
                    },
                ],
                importVisible: false,
                importParams: {
                    extension: 'xlsx',
                },
                importData: {
                    title: '运费和运单号Excel导入',
                    file_name: '下载运费和运单号导入模板',
                    code: 'allocation_import_tracking',
                    api: api_allocation_logistics_import,
                }
            }
        },
        methods: {
            m_option(row) {
                return row.operateButtons.filter(res => {
                    return this.$hasPermission(res.apis);
                })
            },
            action(data, options) {
                options.action.call(this, data);
                return;
            },

            /**
             * 初始化列表数据，添加每条数据的操作项
             * 需要再index.vue(父组件)中调用执行
             * @param {Array} val
             */
            init_table(val) {
                val.forEach(row => {
                    this.$set(row, 'operateButtons', [].concat(this.operateButtons));
                    switch (row.status) {
                        case 9:
                            row.operateButtons.push({
                                label: '上传物流信息',
                                apis: url_allocation_logistics_upload,
                                action(data) {
                                    this.trendAction = {
                                        title: `调拨计划(${data.order_code})上传物流信息`,
                                        number: data.order_code,
                                        value: 'upload',
                                        type: 'logistics',
                                        id: data.id
                                    };
                                    this.editData = {
                                        box_list: [],
                                    };
                                    this.$http(api_allocation_detail, {allocation_id: data.id}).then(res => {
                                        this.editData = res;
                                        this.lookVisible = true;
                                    });
                                }
                            });
                            break;
                        case 3:
                        case 10:
                            row.operateButtons.push({
                                label: '修改运单号',
                                apis: url_allocation_logistics_upload,
                                action(data) {
                                    this.trendAction = {
                                        title: `调拨计划(${data.order_code})修改运单号`,
                                        number: data.order_code,
                                        value: 'edit',
                                        type: 'logistics',
                                        id: data.id
                                    };
                                    this.editData = {
                                        box_list: [],
                                    };
                                    this.$http(api_allocation_detail, {allocation_id: data.id}).then(res => {
                                        this.editData = res;
                                        this.lookVisible = true;
                                    });
                                }
                            });
                            break;
                    }
                });
                this.tableData = val;
            },
            is_packing(data) {
                return [9,10].includes(data.status);
            },
            //导入运费和运单号
            import_file() {
                this.importVisible = true;
            },
        },
        watch: {},
        props: {
            searchData: {},
            loading: {},
            total: {},
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default,
            trendsSelect: require('@/components/trends-select.vue').default,
            importExcel: require('@/components/import-excel.vue').default,
            lookEdit: require('../look-edit.vue').default,
            boxFile: require('../box-file.vue').default,
        }
    }
</script>
