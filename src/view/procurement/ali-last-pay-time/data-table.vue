<template>
    <div class="ali-last-pay-time-table mb-sm mt-sm">
        <!--导出按钮-->
        <permission tag="trendsSelect"
                    class="inline ml-xs"
                    type="primary"
                    :route="apis.url_ali_pay_time_export"
                    :selects="partAllOptions"
                    @trigger="export_excel">
        </permission>
        <!--导出队列-->
        <export-dialog v-model="export_visible"></export-dialog>
        <export-field :param="export_model_type"
                      v-model="exportVisable"
                      :fields="fields" :templates="templates"
                      @getTemplate="get_templates"
                      title="请选择自定义导出字段"
                      :fixparam="fixparam"
                      :creat-excel="creat_excel">
        </export-field>
        <el-table
            :data="tableData"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            highlight-current-row border
            v-resize="{height:41}"
            style="width: 100%; margin-top:10px"
            @selection-change="select_change"
            @sort-change="sort_change">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                type="selection"
                width="35">
            </el-table-column>
            <el-table-column label="1688账号" min-width="70" inline-template>
                <div class="ellipsis" :title="row.account_name">{{row.account_name | supplyFilter}}</div>
            </el-table-column>
            <el-table-column label="阿里订单号" min-width="50" inline-template>
                <div>{{row.ali_order_id | supplyFilter}}</div>
            </el-table-column>
            <el-table-column label="收货人姓名" min-width="50" inline-template class="ellipsis">
                <div :title="row.receiver" class="ellipsis">{{row.receiver | supplyFilter}}</div>
            </el-table-column>
            <el-table-column label="买家会员名" min-width="50" inline-template class="ellipsis">
                <div :title="row.buyer_name" class="ellipsis">{{row.buyer_name | supplyFilter}}</div>
            </el-table-column>
            <el-table-column label="卖家会员名" min-width="65" inline-template class="ellipsis">
                <div class="ellipsis" :title="row.seller_name">{{row.seller_name | supplyFilter}}</div>
            </el-table-column>
            <el-table-column label="卖家公司名" min-width="65" inline-template class="ellipsis">
                <div class="ellipsis" :title="row.seller_company">{{row.seller_company | supplyFilter}}</div>
            </el-table-column>
            <el-table-column label="实付款(元)" min-width="60" inline-template sortable>
                <div class="ellipsis" :title="row.payable_amount|filterAmount">{{row.payable_amount | filterAmount}}</div>
            </el-table-column>
            <el-table-column label="订单状态" min-width="55" inline-template>
                <div class="ellipsis" :title="row.ali_order_status">{{row.ali_order_status | supplyFilter}}</div>
            </el-table-column>
            <el-table-column label="最迟付款时间" inline-template min-width="50" sortable>
                <div class="ellipsis" :title="row.payment_last_time">{{row.payment_last_time}}</div>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {downloadFile} from '../../../lib/http';
    import {
        api_ali_pay_time_export,
        url_ali_pay_time_export,
        api_ali_pay_export_fields,
        api_goods_export_template
    } from "../../../api/ali-last-pay-time"

    export default {
        permission: {
            url_ali_pay_time_export,
        },
        data() {
            return {
                partAllOptions: [
                    {name: "部分导出", value: 2},
                    {name: "全部导出", value: 1}
                ],
                export_visible: false, //导出管理队列
                export_model_type: {
                    type: 68
                },
                exportVisable: false,
                fields: [],
                templates: [],
                selects: []
            }
        },
        filters: {
            supplyFilter(val) {
                return val ? val : '- -'
            },
            filterAmount(val) {
                if (Number(val) >= 0) {
                    return Number(val).toFixed(2);
                }else{
                    return '- -'
                }
            },
            timeFilter(val) {
                if (val > 0) {
                    return datef('YYYY-MM-dd HH', val);
                } else {
                    return '- -'
                }
            },
        },
        computed: {
            emptyText() {
                return this.firstLoading ? '等待请求数据中...' : '暂无数据'
            },
        },
        watch: {
        },
        mounted() {
            this.get_templates();
            this.get_fields();
        },
        methods: {
            select_change(val) {  //check 选择
                this.selects = val;
            },
            sort_change(val) {
                this.$emit('sort-change', val)
            },
            get_fields() {//获取导出字段
                this.$http(api_ali_pay_export_fields).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            export_excel(val) {
                if (val.value === 2 && this.selects.length <= 0) return this.$message({
                    type: "warning",
                    message: "请先选择需要导出的数据"
                });
                this.export_type = val.value;
                this.exportVisable = true;
            },
            get_templates() {//保存导出模板
                this.$http(api_goods_export_template, {type: 68}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    });
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            fixparam(list) {
                return list.map(row => {
                    return {
                        field_name: row.show_field,
                        field_key: row.field
                    }
                });
            },
            creat_excel(param) {
                let data = '';
                switch (this.export_type) {
                    case 2://部分
                        data = {
                            ids: this.selects.map(row => row.id),
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
            order_export(params) {//部分 全部导出
                return this.$http(api_ali_pay_time_export, params).then(res => {
                    if (res.join_queue === 1) {
                        this.export_visible = true;
                        this.$message({type: "success", message: res.message || res});
                    } else {
                        let params = {
                            page: this.searchData.page,
                            pageSize: this.searchData.pageSize,
                            file_code: res.file_code
                        };
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xlsx',
                        });
                        this.$message({type: 'success', message: res.message || res});
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
                return Promise.resolve();
            },
            init_params() {
                let params = window.clone(this.searchData);
                if (this.searchData.date_b) {
                    params.date_b = datef("YYYY-MM-dd", this.searchData.date_b / 1000)
                } else {
                    params.date_b = "";
                }
                if (this.searchData.date_e) {
                    params.date_e = datef("YYYY-MM-dd", this.searchData.date_e / 1000)
                } else {
                    params.date_e = "";
                }
                if (params.snText.trim()) {
                    params.snText = this.searchData.snText.replace(new RegExp(' ', 'gm'), '\n').trim().split('\n').map(row => row.trim()).filter(row => row !== '');
                } else {
                    params.snText = '';
                }
                return params
            },
        },
        props: {
            tableData: {required: true, type: Array},
            loading: {required: true, type: Boolean},
            searchData: {},
            firstLoading: {required: true, type: Boolean}
        },
        components: {
            trendsSelect: require('../../../components/trends-select').default,
            uiTip: require('@/components/ui-tip.vue').default,
            exportDialog: require('../../report/export-dialog').default,
            exportField: require("@/components/export-field").default,
        },
    }
</script>

<style lang="stylus">
    .ali-last-pay-time-table {
        .el-dropdown .el-button-group .el-button--warning {
            color: #fff;
            background-color: #2ea0e3;
            border-color: #2ea0e3;
        }
    }
</style>
