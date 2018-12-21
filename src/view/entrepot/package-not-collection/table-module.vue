<template>
    <div class="p-package-not">
        <mailing-method ref="mailing" @left-show-change="left_show_change">
            <!-- 邮寄方式列表 -->
            <transport :transport-data="transportData"
                       @node-click="click_tree"
                       slot="mailling-tree"
                       :loading="transportLoading"
                       @hidden-left="$refs.mailing.showLeft(true)">
            </transport>
            <div class="ml-sm" slot="button-list">
                <request-button @click="release_parcel" req-key="api_package_not_collection_back"
                                :disabled="checkData.length<=0">退回到待生成拣货单
                </request-button>
                <request-button @click="send_goods" req-key="api_send_goods" :disabled="checkData.length<=0">执行发货
                </request-button>
                <request-button @click="add_abnormal" req-key="api_add_problem" :disabled="checkData.length<=0">加入异常
                </request-button>
                <request-button @click="size_over_abnormal" req-key="api_add_size_problem"
                                :disabled="checkData.length<=0">
                    超尺寸异常
                </request-button>
            </div>
            <!-- 打印机 -->
            <span class="fr mr-sm" slot="other">
                <span>打印机：</span>
                <select-printer v-model="printer" class="inline width-lg"></select-printer>
            </span>
            <!-- 表格 -->
            <el-table
                    slot="goods-tabel"
                    ref="tableData"
                    class="box goods-tabel"
                    :data="tableData"
                    @select="select_check($event)"
                    @select-all="select_check"
                    highlight-current-row
                    v-loading="loading"
                    element-loading-text="玩命加载中..."
                    v-resize="{height:40}">
                <el-table-column
                        type="selection"
                        width="35">
                </el-table-column>
                <el-table-column
                        inline-template
                        label="包裹号">
                    <div :class="add_exception(row.in_exception)">
                        <ui-tip :is-operate="true" :content="row.number" :width="98"
                                @cur-click="parcel_information(row.number)"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="追踪号"
                        inline-template>
                    <div :class="add_exception(row.in_exception)">
                        <ui-tip :content="row.shipping_number" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="平台"
                        width="80"
                        inline-template>
                    <div :class="add_exception(row.in_exception)">
                        <ui-tip :content="row.channel_id" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="账号"
                        min-width="60"
                        inline-template>
                    <div :class="add_exception(row.in_exception)">
                        <ui-tip :content="row.channel_account_id" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="物流商单号"
                        inline-template
                        min-width="100">
                    <div :class="add_exception(row.in_exception)">
                        <ui-tip :content="row.process_code" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="运输方式"
                        inline-template>
                    <div :class="add_exception(row.in_exception)">
                        <ui-tip :content="row.shipping_id" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="国家"
                        inline-template
                        min-width="50">
                    <div :class="add_exception(row.in_exception)">
                        <ui-tip :content="row.country_code" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="打印时间"
                        inline-template
                        min-width="120">
                    <div :class="add_exception(row.in_exception)">
                        <ui-tip :content="print_time_format(row.print_time)" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="包裹包装时间"
                        min-width="120"
                        inline-template>
                    <div :class="add_exception(row.in_exception)">
                        <ui-tip :content="row.packing_time | filterTime" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="操作"
                        inline-template
                        min-width="50">
                    <div>
                        <span class="operate" @click="print(row)">打印</span>
                    </div>
                </el-table-column>
            </el-table>
        </mailing-method>
        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <form-mdf ref="formMdf"
                  :mdfid="mdfid"
                  v-model="mdfValue"
                  :is-edit="false"
                  @close-dialog="close_dialog"
                  @click-number="click_number"
                  :title="mdfTitle"></form-mdf>

        <parcel-information
                v-model="informationVisible"
                @close-parcel="close_parcel"
                :order="order"
                @view-order="view_order"
        ></parcel-information>
    </div>
</template>
<style lang="stylus">
    .p-package-not {
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
            .el-table__body-wrapper {
                overflow-x: hidden;
            }
            .exception .p-ui-tip {
                & a, & span {
                    color: red !important;
                }
            }
        }
        .el-card__header {
            box-sizing: border-box;
            display: inline-block;
            color: #fff;
            width: 100%;
            height: 32px;
            padding: 0 5px;
            line-height: 32px;
            font-size: 1.2rem;
            background: #6495ED;
            border: 1px solid #ddd;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            border-bottom: 1px solid transparent;
        }
    }
</style>
<script>
    import {
        api_get_shipping,
        api_get_collection,
        api_print_package,
        api_package_not_collection_back,
        api_send_goods,
        api_add_problem,
        api_add_size_problem
    } from '../../../api/package-not-collection'
    import {mapGetters, mapActions} from 'vuex';
    import {api_get_package, url_package} from '../../../api/shipment'

    export default {
        permission: {
            url_package
        },
        data() {
            return {
                checkData: [],
                mdfid: '',
                mdfValue: false,
                mdfTitle: '',
                leftSpan: 4,
                transportData: [],
                tableData: [],
                loading: false,
                total: 0,
                token: '',
                printer: '',
                print_height: '',
                print_width: '',
                informationVisible: false,
                order: {},
                isShow: false,
                transportLoading: false,
                transportShow: false,
            }
        },
        filters: {
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
        },
        methods: {
            add_abnormal() {
                return this.$confirm(`确定加入异常吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.$http(api_add_problem, {id: this.checkData}).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.init();
                        return Promise.resolve();
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey(`api_add_problem`, false);
                        }, 200);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                    this.$reqKey(`api_add_problem`, false);
                })
            },
            size_over_abnormal() {
                return this.$confirm(`确定标记为超尺寸异常吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.$http(api_add_size_problem, {id: this.checkData}).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.init();
                        return Promise.resolve();
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey(`api_add_size_problem`, false);
                        }, 200);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                    this.$reqKey(`api_add_size_problem`, false);
                })
            },
            send_goods() {
                return this.$confirm(`确定执行发货吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.$http(api_send_goods, {id: this.checkData}).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.init();
                        return Promise.resolve();
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey(`api_send_goods`, false);
                        }, 200);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                    this.$reqKey(`api_send_goods`, false);
                })
            },
            print_time_format(print_time) {
                switch (print_time) {
                    case 0:
                        return '-';
                        break;
                    case 1:
                        return '默认面单';
                        break;
                    default:
                        return datef("YYYY-MM-dd HH:mm:ss", print_time);
                        ;
                        break;
                }
            },
            select_all(selected) {
                this.selected = selected;
                this.$emit('selected', selected);
            },
            select(selected) {
                this.selected = selected;
                this.$emit('selected', selected);
            },
            selectable() {
                return !this.checkAll;
            },
            view_order(val) {
                this.mdfValue = true;
                this.mdfid = val.mdfid;
                this.mdfTitle = val.mdfTitle;
                this.informationVisible = false;
                this.isShow = true;
                this.$refs.formMdf.require_server(this.mdfid)
            },
            click_number(val) {
                this.order = val.orderData;
                this.informationVisible = true;
            },
            close_dialog(val) {
                if (this.isShow) this.informationVisible = true;
            },
            close_parcel() {
                this.isShow = false;
            },
            init() {
                this.loading = true;
                this.$http(api_get_collection, this.searchData).then(res => {
                    this.loading = false;
                    this.tableData = res.data;
                    this.total = res.count;
                    this.request_shipping_method();
                }).catch(code => {
                    this.loading = false;
                    this.$message({type: "error", message: code.message || code});
                });
            },
            parcel_information(order) {
                if (this.$hasPermission(this.apis.url_package)) {
                    this.$http(api_get_package, order).then(res => {
                        this.order.id = order;
                        this.informationVisible = true;
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                        this.informationVisible = false;
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: '没有查看包裹详情详情的权限'
                    });
                }
            },
            request_shipping_method() {
                if(!this.transportShow || this.$refs.mailing.show) {
                    return;
                }
                if (this.searchData.warehouse_id) {
                    this.transportShow = false;
                    this.transportLoading = true;
                    this.$http(api_get_shipping, this.searchData).then(res => {
                        let treeObj;
                        if (res) {
                            treeObj = Object.values(res).map(item => {
                                return {
                                    id: item.id || 0,
                                    label: item.name === "" ? "" : item.name + "(" + item.count + ")",
                                    type: 'carrierr',
                                    children: item.shipping.map(row => {
                                        return {
                                            id: row.id,
                                            type: 'shipping',
                                            label: `${row.name}(${row.count})`
                                        }
                                    })
                                }
                            })
                        }
                        this.transportData = treeObj;
                    }).catch(code => {
                        this.transportShow = true;
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    }).finally(() => {
                        this.transportLoading = false;
                    })
                }
            },
            //点击树形
            click_tree(node) {
                this.searchData.carrier_id = 0;
                this.searchData.shipping_id = 0;
                if (!node.length) {
                    switch (node.type) {
                        case 'carrierr':
                            this.searchData.carrier_id = node.id;
                            break;
                        case 'shipping':
                            this.searchData.shipping_id = [node.id];
                            break;
                        default:
                            break;
                    }
                } else {
                    this.searchData.shipping_id = node;
                }
                this.init();
            },
            //分页器
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init();
            },
            ...mapActions({
                set_printerList: 'api/set_printerList'
            }),
            print(row) {
                let numberList = [];
                let content = '';
                let type = [];
                let direction = 1;
                let coordinate = [];
                let watermark = [];
                this.$http(api_print_package, row.id, {type: 7}).then(res => {
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
                    direction = res.direction || direction
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
                        printer: this.printer,
                        Direction: direction === 1 ? 'vertical' : 'transverse'
                    };
                    this.$printer(this.printer, params);
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            select_check(select) {
                this.checkData = select.map(row => {
                    return row.id;
                });
            },
            release_parcel() {
                return this.$confirm(`释放已勾选的包裹,确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.$http(api_package_not_collection_back, {package_id: this.checkData}).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.init();
                        return Promise.resolve();
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey(`api_package_not_collection_back`, false);
                        }, 200);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                    this.$reqKey(`api_package_not_collection_back`, false);
                })

            },
            add_exception(val) {
                return val === 1 ? 'exception' : '';
            },
            left_show_change(val) {
                if(!val && this.transportShow) {
                    this.request_shipping_method();
                }
            },
        },
        computed: {
            warehouseName() {
                let warehouse_id = this.$parent.$refs.search_module.warehouses.find(row => row.value === this.searchData.warehouse_id);
                if (warehouse_id) {
                    return warehouse_id.label;
                } else {
                    return '';
                }
            },
            rightSpan() {
                return 24 - this.leftSpan;
            },
        },
        watch: {
            searchData: {
                deep: true,
                handler(newVal, value) {
                    if(!isObjectValueEqual(newVal, value)) {
                        this.transportShow = true;
                    }
                }
            }
        },
        props: {
            searchData: {}
        },
        components: {
            transport: require('@/components/transport.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            selectPrinter: require('@/components/select-printer.vue').default,
            parcelInformation: require('../placeorder/parcel-information.vue').default,
            formMdf: require("../../order/local/form-mdf.vue").default,
            mailingMethod: require('@/components/mailing-method.vue').default,
            requestButton: require('@/global-components/request-button').default
        }
    }
</script>
