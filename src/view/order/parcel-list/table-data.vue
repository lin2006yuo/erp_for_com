<template>
    <div class="c-table-data">
        <div class="relative">
            <permission tag="request-button"
                        @click.native="get_packages"
                        req-key="api_get_packages_2"
                        class="inline ml-sm"
                        :route="apis.url_get_packages">批量获取面单
            </permission>
            <permission tag="request-button"
                        @click.native="get_tracking"
                        req-key="api_get_tracking_3"
                        :disabled="canTracking"
                        class="inline ml-sm"
                        :route="apis.url_get_tracking">批量获取跟踪号
            </permission>
            <permission tag="request-button"
                        @click.native="free_packages"
                        req-key="api_free_packages"
                        class="inline ml-sm"
                        :route="apis.url_free_packages">释放包裹
            </permission>
            <permission tag="request-button"
                        @click.native="apply_cancel"
                        req-key="api_apply_cancel"
                        class="inline ml-sm"
                        :route="apis.url_apply_cancel">申请取消拣货单
            </permission>
            <permission tag="ElButton"
                        @click.native="intercept_parcel"
                        type="primary"
                        size="mini"
                        class="inline ml-sm"
                        :route="apis.url_apply_cancel">批量拦截包裹
            </permission>
            <permission tag="request-button"
                        @click.native="logistic_cancel"
                        req-key="api_cancel_logistics"
                        class="inline ml-sm"
                        :route="apis.url_cancel_logistics">取消物流
            </permission>
            <permission tag="request-button"
                        @click.native="zoodmall_export"
                        req-key="api_zoodmall_export"
                        class="inline ml-sm"
                        :route="apis.url_zoodmall_export">zoodmall导出
            </permission>
            <permission tag="trendsSelect"
                        class="inline ml-sm mr-xs"
                        type="primary"
                        :route="apis.url_export_title"
                        :selects="partAllOptions"
                        @trigger="export_excel"></permission>
            <color-tip></color-tip>
            <div class="inline fr">
                <span style="font-size: 1.2rem;">打印机：</span>
                <select-printer v-model="printer" class="inline width-lg" style="margin:3px;"></select-printer>
                <!--<el-checkbox v-model="test_watermark">打印测试</el-checkbox>-->
            </div>
        </div>
        <el-table
                class="scroll-bar"
                :row-class-name="table_row_className"
                :data="tableData.list"
                v-resize="{height:40}"
                v-loading="loading"
                element-loading-text="玩命加载中..."
                @selection-change="select_change"
                :default-sort="{prop: 'uploaded_deadline', order: 'descending'}"
                highlight-current-row
        >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection" width="35" align="center"></el-table-column>
            <el-table-column label="包裹号" inline-template>
                <div>
                    <ui-tip :is-operate="true" :content="row.number" @cur-click="click_number(row.number)"
                            :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="订单号" inline-template width="200">
                <template v-for="item in row.order">
                    <ui-tip :is-operate="true" :content="item.order_number" @cur-click="get_order_detail(item)"
                            :width="98"></ui-tip>
                </template>
            </el-table-column>
            <el-table-column label="发货仓库" inline-template width="80">
                <div>{{row.warehouse_id}}</div>
            </el-table-column>
            <el-table-column label="运输方式" inline-template>
                <div>
                    <ui-tip :content="row.shipping_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="物流商单号" inline-template>
                <div>{{row.process_code}}</div>
            </el-table-column>
            <el-table-column label="物流跟踪号" inline-template>
                <div>{{row.shipping_number}}</div>
            </el-table-column>
            <el-table-column label="目的地" inline-template width="80">
                <div>{{row.country_code}}</div>
            </el-table-column>
            <el-table-column label="最迟发货时间" inline-template width="120" prop="uploaded_deadline" sortable>
                <time-out :time="row.uploaded_deadline" :cur-status="row.shipping_time"></time-out>
            </el-table-column>
            <el-table-column label="发货时间" inline-template>
                <div>{{row.shipping_time | fdatetime}}</div>
            </el-table-column>
            <el-table-column label="物流下单时间" inline-template>
                <div>{{row.package_upload_status | fdatetime}}</div>
            </el-table-column>
            <el-table-column label="同步时间" inline-template>
                <div>{{row.synchronize | fdatetime}}</div>
            </el-table-column>
            <el-table-column label="操作" inline-template>
                <div>
                    <trends-select class="inline mt-mini"
                                   type="primary"
                                   :selects="m_option(row)"
                                   @trigger="action(row,$event)">
                    </trends-select>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="current_change"
                :current-page="tableData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="tableData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.total">
        </el-pagination>

        <form-mdf ref="formMdf"
                  :mdfid="mdfid"
                  v-model="mdfValue"
                  :is-edit="is_edit"
                  :is-package="is_package"
                  @close-dialog="close_dialog"
                  @click-number="click_number_mdf"
                  :title="mdfTitle"></form-mdf>
        <parcel-information
                v-model="informationVisble"
                @view-order="view_order"
                :order="order"
                @close-parcel="close_parcel"
        ></parcel-information>
        <invoice-preview v-model="previewVisible"
                         :api="invoiceApi"
                         :params="printParams"
                         ref="invoice_preview">
        </invoice-preview>
        <title-table v-model="title_table_visible"
                     title="选择需要打印的产品项目"
                     @check-title="check_title"
                     @clear-check-title="clear_check_title"
                     :title_data="title_data"
                     @export-title="export_title">
        </title-table>
        <intercept-parcel v-model="interceptVisible"
                          :select-list="selectList"></intercept-parcel>
        <test-print-coordinate v-model="testPrintVisible"
                               @test-print="test_print_sure"
                               :shipping_id="shipping_id"
                               :print-params="testPrintParams"></test-print-coordinate>
    </div>
</template>
<style lang="stylus">
    .c-table-data {
        .operate {
            color: #6699FF;
        }
        .cancellation {
            > td > .cell {
                .p-ui-tip > .cur-operate {
                    color: #FF0B1E !important;
                }
                .p-ui-tip > a {
                    color: #FF0B1E !important;
                }
            }
            > td > .cell > div > .p-ui-tip > .cur-operate {
                color: #FF0B1E !important;
            }
            color: #FF0B1E;
        }
        .color-tips-parcel {
            position: absolute;
            right: 210px;
            top: 6px;
        }
        .trouble {
            > td > .cell {
                .p-ui-tip > .cur-operate {
                    color: #A63CD4 !important;
                }
                .p-ui-tip > a {
                    color: #A63CD4 !important;
                }
            }
            > td > .cell > div > .p-ui-tip > .cur-operate {
                color: #A63CD4 !important;
            }
            color: #A63CD4;
        }
    }
</style>
<script>
    import {downloadFile} from '@/lib/http';
    import {url_package} from "@/api/shipment"
    import {url_info} from '@/api/order-local'
    import {mapGetters, mapActions} from 'vuex';
    import {api_get_pdf, url_get_pdf} from '@/api/pickings';
    import {
        api_get_packages,
        url_get_packages,
        api_get_tracking,
        url_get_tracking,
        api_free_packages,
        url_free_packages,
        api_post_print,
        url_post_print,
        api_print_invoice,
        url_print_invoice,
        url_export_title,
        api_export_title,
        url_get_title,
        api_get_title,
        url_apply_cancel,
        api_apply_cancel,
        url_cancel_logistics,
        api_cancel_logistics,
        url_package_intercept,
        api_zoodmall_export,
        url_zoodmall_export,
        api_test_print,
        url_test_print,
        api_test_custom_print,
        url_test_custom_print,
    } from '@/api/packages';

    export default {
        permission: {
            url_package,
            url_info,
            url_get_packages,
            url_free_packages,
            url_get_tracking,
            url_post_print,
            url_get_pdf,
            url_print_invoice,
            url_export_title,
            url_apply_cancel,
            url_cancel_logistics,
            url_package_intercept,
            url_zoodmall_export,
            url_test_print,
            url_test_custom_print,
        },
        data() {
            return {
                mdfid: 0,
                mdfValue: false,
                mdfTitle: "",
                informationVisble: false,
                order: {},
                is_edit: {
                    edit: false
                },
                //是否是从包裹列表进入
                is_package: false,
                token: '',
                printer: '',
                numberList: [],
                print_width: 100,
                print_height: 100,
                isShow: false,
                selectList: [],
                canTracking: false,
                previewVisible: false,
                printParams: {
                    package_ids: []
                },
                invoiceApi: '',
                title_table_visible: false,
                title_data: [],
                title_checked_list: [],
                interceptVisible: false,
                partAllOptions: [
                    {
                        name: "全部导出", value: 1, action: function (val) {
                            this.export_type = 1; // 全部导出
                            this.get_title();
                        }
                    },
                    {
                        name: "部分导出", value: 0, action: function (val) {
                            if (this.selectList <= 0) return this.$message({type: "warning", message: "请先选择需要导出的数据"});
                            this.export_type = 0;
                            this.get_title();
                        }
                    },
                ],
                export_type: '',      // 部分导出
                testPrintVisible: false,
                testPrintParams: {}, //测试打印数据
                shipping_id: '',
            }
        },
        filters: {
            fdatetime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val)
            }
        },
        methods: {
            export_excel(val) {
                val.action.call(this, this.selectL);
            },
            get_title() {
                return this.$http(api_get_title).then(res => {
                    this.title_data = res;
                    this.title_table_visible = true;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            export_title() {
                this.title_table_visible = false;
                let data = {
                    export_type: this.export_type,
                };
                if (this.export_type) {
                    Object.assign(data, this.$parent.get_params());
                } else {
                    Object.assign(data, this.$parent.get_params(), {ids: this.selectList.map(item => item.id)});
                }
                this.$http(api_export_title, data, {
                    'X-Result-Fields': this.title_checked_list.map(item => item.title).join(','),
                    contentType: 'application/x-www-form-urlencoded'
                }).then(res => {
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
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            table_row_className(row, index) {
                if (row.status === 4294967295) {
                    return 'trouble'
                } else if (row.abnormal === 1) {
                    return 'cancellation'
                } else {
                    return ''
                }
            },
            m_option(row) {
                let buttons = [];
                if (Number(row.is_can_print) === 0) {
                    buttons = [{label: '打印面单', value: 1, apis: url_post_print, disabled: true},  // type=1为 包裹列表
                        {label: '打印面单测试', value: 4, apis: url_test_print, disabled: true},
                        {label: '测试打印自制面单', value: 5, apis: url_test_custom_print, disabled: false},
                        {label: '查看面单', value: 2, apis: url_get_pdf, disabled: true}];
                    if (Number(row.invoice_can_print) === 0) {
                        buttons.push({label: '查看发票', value: 3, apis: url_print_invoice, disabled: true});
                    } else {
                        buttons.push({label: '查看发票', value: 3, apis: url_print_invoice, disabled: false});
                    }
                } else {
                    buttons = [{label: '打印面单', value: 1, apis: url_post_print, disabled: false},  // type=1为 包裹列表
                        {label: '打印面单测试', value: 4, apis: url_test_print, disabled: false},
                        {label: '测试打印自制面单', value: 5, apis: url_test_custom_print, disabled: false},
                        {label: '查看面单', value: 2, apis: url_get_pdf, disabled: false}];
                    if (Number(row.invoice_can_print) === 0) {
                        buttons.push({label: '查看发票', value: 3, apis: url_print_invoice, disabled: true});
                    } else {
                        buttons.push({label: '查看发票', value: 3, apis: url_print_invoice, disabled: false});
                    }
                }
                return buttons.filter(item => {
                    return this.$hasPermission(item.apis);
                });
            },
            action(row, options) {
                switch (options.value) {
                    case 1:
                        this.print(row);
                        break;
                    case 2:
                        this.print_preview(row);
                        break;
                    case 3:
                        this.print_invoice(row);
                        break;
                    case 4:
                        this.test_print(row);
                        break;
                    case 5:
                        this.test_custom_print(row);
                        break;
                }
            },
            get_packages() {
                if (this.selectList.length <= 0) {
                    this.$message({type: "warning", message: "请先选择需要批量操作的面单！"});
                    this.$reqKey(`api_get_packages_2`, false);
                    return Promise.resolve();
                }
                let numberList = this.selectList.map(row => row.number);
                return this.$http(api_get_packages, {number: numberList}).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey(`api_get_packages_2`, false);
                    }, 200);
                });
            },
            get_tracking() {
                if (this.selectList.length <= 0) {
                    this.$message({type: "warning", message: "请先选择需要批量操作的面单！"});
                    this.$reqKey(`api_get_tracking_3`, false);
                    return Promise.resolve();
                }
                let numberList = this.selectList.map(row => row.number);
                this.canTracking = true;
                return this.$http(api_get_tracking, {number: numberList}).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.canTracking = false;
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                    this.canTracking = false;
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey(`api_get_tracking_3`, false);
                    }, 200);
                });
            },
            free_packages() {
                if (this.selectList.length <= 0) {
                    this.$message({type: "warning", message: "请先选择需要批量操作的面单！"});
                    this.$reqKey(`api_free_packages`, false);
                    return Promise.resolve();
                }
                let ids = this.selectList.map(row => row.id);
                ids = ids.toString();
                this.$confirm(`此操作将释放所选中的包裹，确认此操作吗？`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    return this.$http(api_free_packages, {ids: ids}).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.$emit('search');
                        return Promise.resolve();
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey(`api_free_packages`, false);
                        }, 200);
                    });
                }).catch(() => {
                    this.$reqKey('api_free_packages', false);
                    this.$message({type: 'info', message: '已取消'});
                    return Promise.resolve();
                });
            },
            apply_cancel() {
                if (this.selectList.length <= 0) {
                    this.$message({type: "warning", message: "请先选择需要批量操作的面单！"});
                    this.$reqKey(`api_apply_cancel`, false);
                    return Promise.resolve();
                }
                let package_ids = this.selectList.map(res => res.id);

                this.$confirm('此操作将为所选中的包裹申请取消拣货单，确认此操作吗？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    return this.$http(api_apply_cancel, {package_ids: package_ids}).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        return Promise.resolve();
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey(`api_apply_cancel`, false);
                        }, 200);
                    });
                }).catch(() => {
                    this.$reqKey(`api_apply_cancel`, false);
                    this.$message({type: 'info', message: '已取消'});
                    return Promise.resolve();
                });
            },
            intercept_parcel() {
                if (this.selectList.length <= 0) {
                    this.$message({type: "warning", message: "请先选择需要批量操作的面单！"});
                    return;
                }
                this.$confirm('此操作将为所选中的包裹进行拦截，确认此操作吗？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.interceptVisible = true;
                }).catch(() => {
                    this.$message({type: 'info', message: '已取消'});
                });
            },
            logistic_cancel() {
                if (this.selectList.length <= 0) {
                    this.$message({type: "warning", message: "请先选择需要批量操作的面单！"});
                    this.$reqKey(`api_apply_cancel`, false);
                    return;
                }
                let package_ids = this.selectList.map(res => res.id);

                this.$confirm('此操作将为所选中的包裹取消物流，确认此操作吗？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    return this.$http(api_cancel_logistics, {package_ids: package_ids}).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.$emit('search');
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey(`api_cancel_logistics`, false);
                        }, 200);
                    });
                }).catch(() => {
                    this.$reqKey(`api_cancel_logistics`, false);
                    this.$message({type: 'info', message: '已取消'});
                });
            },
            zoodmall_export() {
                if (this.selectList.length <= 0) {
                    this.$message({type: "warning", message: "请先选择需要批量操作的面单！"});
                    this.$reqKey(`api_zoodmall_export`, false);
                    return;
                }
                let package_ids = this.selectList.map(res => res.id);
                this.$http(api_zoodmall_export, {ids: package_ids}).then(res => {
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
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey(`api_zoodmall_export`, false);
                    }, 200);
                })
            },
            select_change(val) {
                this.selectList = val;
            },
            view_order(val) {
                this.mdfValue = true;
                this.mdfid = val.mdfid;
                this.mdfTitle = val.mdfTitle;
                this.informationVisble = false;
                this.isShow = true;
                this.$refs.formMdf.require_server(this.mdfid)
            },
            click_number_mdf(val) {
                this.order = val.orderData;
                this.informationVisble = val.informationVisble;
            },
            close_dialog(val) {
                if (this.isShow) this.informationVisble = true;
            },
            close_parcel() {
                this.isShow = false;
            },
            size_change(val) {
                this.$emit("size-change", val);
            },
            current_change(val) {
                this.$emit("current-change", val);
            },
            click_number(val) {
                if (this.$hasPermission(this.apis.url_package)) {
                    this.order.id = val;
                    this.informationVisble = true;
                } else {
                    this.$message({
                        type: 'error',
                        message: '没有查看包裹详情详情的权限'
                    });
                }
            },
            get_order_detail(row) {
                if (this.$hasPermission(this.apis.url_info)) {
                    this.$refs.formMdf.require_server(row.id);
                    this.mdfTitle = `查看订单号: ${row.order_number} 信息`;
                    this.mdfid = row.id;
                    this.mdfValue = true;
                    this.is_package = false;
                } else {
                    this.$message({
                        type: 'error',
                        message: '没有查看订单号详情的权限'
                    });
                }
            },
            ...mapActions({
                set_printerList: 'api/set_printerList'
            }),
            print(row) {
                let numberList = [];
                let content = '';
                let direction = 1;
                let type = [];
                let coordinate = [];
                let watermark = [];
                let data = {
                    type: 1,
                };
                this.$http(api_post_print, row.id, data).then(res => {
                    res.file_list.forEach(row => {
                        content = row.file;
                        type = row.type;
                        coordinate = row.coordinate;
                        if (row.label_num === '') {
                            watermark = '##';
                        } else {
                            watermark = row.label_num;
                        }
                    });
                    direction = res.direction || direction;
                    numberList = res.identification;
                    let params = {
                        type: type,
                        coordinate: coordinate,
                        watermark: watermark,
                        content: content,
                        numberList: numberList,
                        url: config.apiHost + res.callback,
                        Width: 100,
                        Height: 100,
                        PrintName: this.printer,
                        Direction: direction === 1 ? 'vertical' : 'transverse'
                    };
                    params.Width = res.width;
                    params.Height = res.height;
                    this.$printer(this.printer, params);
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            //自画面单打印测试
            test_custom_print(row) {
                let numberList = [];
                let content = '';
                let direction = 1;
                let type = [];
                let coordinate = [];
                let watermark = [];
                let data = {
                    type: 1,
                };
                this.$http(api_test_custom_print, row.id, data).then(res => {
                    res.file_list.forEach(row => {
                        content = row.file;
                        type = row.type;
                        coordinate = row.coordinate;
                        if (row.label_num === '') {
                            watermark = '##';
                        } else {
                            watermark = row.label_num;
                        }
                    });
                    direction = res.direction || direction;
                    numberList = res.identification;
                    let params = {
                        type: type,
                        coordinate: coordinate,
                        watermark: watermark,
                        content: content,
                        numberList: numberList,
                        url: config.apiHost + res.callback,
                        Width: 100,
                        Height: 100,
                        PrintName: this.printer,
                        Direction: direction === 1 ? 'vertical' : 'transverse'
                    };
                    params.Width = res.width;
                    params.Height = res.height;
                    this.$printer(this.printer, params);
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            test_print(row) {//打印测试
                let numberList = [];
                let content = '';
                let img = '';
                let direction = 1;
                let type = [];
                let coordinate = [];
                let watermark = [];
                let fontSize = 14;
                let data = {
                    type: 1,
                };
                this.$http(api_test_print, row.id, data).then(res => {
                    res.file_list.forEach(result => {
                        content = result.file;
                        type = result.type;
                        result.png && (img = result.png);
                        coordinate = result.coordinate;
                        fontSize = result.label_font_size || 14;
                        if (result.label_num === '') {
                            watermark = '##';
                        } else {
                            watermark = result.label_num;
                        }
                    });
                    direction = res.direction || direction;
                    numberList = res.identification;
                    let params = {
                        type: type,
                        coordinate: coordinate,
                        watermark: watermark,
                        content: content,
                        numberList: numberList,
                        url: config.apiHost + res.callback,
                        Width: 100,
                        Height: 100,
                        fontSize: fontSize,
                        PrintName: this.printer,
                        Direction: direction === 1 ? 'vertical' : 'transverse'
                    };
                    if(params.type === 'url') {
                        params.img = img;
                    }
                    params.Width = res.width;
                    params.Height = res.height;
                    this.testPrintParams = params;
                    this.shipping_id = row.shipping_id;
                    this.testPrintVisible = true;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            test_print_sure(data) {
                let params = clone(Object.assign(this.testPrintParams, data));
                if(this.testPrintParams.type === 'url') {
                    let {img, ...data} = params;
                    params = data;
                }
                this.$printer(this.printer, params);
            },
            print_invoice(row) {
                this.previewVisible = true;
                this.printParams.package_ids.push(row.id);
                this.invoiceApi = api_print_invoice;
                this.$nextTick(() => {
                    this.$refs.invoice_preview.print_preview(row);
                });
            },
            print_preview(row) {
                this.$http(api_get_pdf, row.id).then(res => {
                    if (res.type === 'pdf') {
                        window.open(res.url);
                    } else {
                        let routeData = this.$router.resolve({path: '/pdf-preview', query: {package_id: row.id}});
                        window.open(routeData.href, '_blank');
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            check_title(val) {
                this.title_checked_list = val;
            },
            clear_check_title() {
                this.title_checked_list = [];
            }
        },
        props: {
            tableData: {
                required: true,
                type: Object
            },
            loading: {},
            emptyText: {
                type: String,
                default: '暂无数据'
            }
        },
        components: {
            formMdf: require("../local/form-mdf.vue").default,
            parcelInformation: require('@/view/entrepot/placeorder/parcel-information.vue').default,
            timeOut: require('../local/time-out.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            selectPrinter: require('@/components/select-printer.vue').default,
            trendsSelect: require('@/components/trends-select').default,
            invoicePreview: require('./invoice-preview').default,
            requestButton: require('@/global-components/request-button.vue').default,
            colorTip: require('./color-tip.vue').default,
            titleTable: require('./title-table.vue').default,
            interceptParcel: require('./intercept-parcel.vue').default,
            testPrintCoordinate: require('./test-print-coordinate.vue').default,
        }
    }
</script>
