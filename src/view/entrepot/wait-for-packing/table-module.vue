<template>
    <div class="p-package-not">
        <mailing-method ref="mailing" @left-show-change="left_show_change">
            <!-- 邮寄方式列表 -->
            <transport :transport-data="transportData"
                       @node-click="click_tree"
                       :loading="transportLoading"
                       slot="mailling-tree"
                       @hidden-left="$refs.mailing.showLeft(true)">
            </transport>
            <!-- 打印机 -->
            <span class="fr mr-sm" style="line-height: 28px" slot="other">
                <span style="vertical-align: middle">打印机：</span>
                <select-printer v-model="printer" class="inline width-lg"></select-printer>
            </span>
            <!-- 表格 -->
            <div class="box" slot="goods-tabel">
                <el-table
                        ref="tableData"
                        :data="tableData"
                        highlight-current-row
                        class="scroll-bar"
                        v-loading="loading"
                        element-loading-text="玩命加载中..."
                        :default-sort="{prop: 'uploaded_deadline', order: 'descending'}"
                        v-resize="{height:40}">
                    <el-table-column
                            inline-template
                            label="包裹号">
                        <div>
                            <ui-tip :is-operate="true" :content="row.number" :width="98"
                                    @cur-click="parcel_information(row.number)"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                            label="拣货单号"
                            inline-template>
                        <div>
                            <ui-tip :content="row.picking_id" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                            label="追踪号"
                            inline-template>
                        <div>
                            <ui-tip :content="row.shipping_number" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                            label="平台"
                            width="80"
                            inline-template>
                        <div>
                            <ui-tip :content="row.channel_id" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                            label="账号"
                            width="120"
                            inline-template>
                        <div>
                            <ui-tip :content="row.channel_account_id" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                            label="物流商单号"
                            inline-template
                            width="130">
                        <div>
                            <ui-tip :content="row.process_code" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                            label="运输方式"
                            inline-template
                            width="110">
                        <div>
                            <ui-tip :content="row.shipping_id" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                            label="国家"
                            inline-template
                            width="60">
                        <div>
                            <ui-tip :content="row.country_code" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                            label="拣货单生成时间"
                            inline-template>
                        <div>
                            <ui-tip :content="row.picking_create_time | filterTime" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                            label="最迟发货时间"
                            inline-template
                            prop="uploaded_deadline"
                            sortable>
                        <div>
                            <ui-tip :content="row.uploaded_deadline | filterTime" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            inline-template
                            width="120">
                        <div>
                            <span class="operate" @click="print(row)">打印</span>
                        </div>
                    </el-table-column>
                </el-table>
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
            </div>
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
                  @close-dialog="close_dialog"
                  @click-number="click_number"
                  :mdfid="mdfid"
                  v-model="mdfValue"
                  :is-edit="false"
                  :title="mdfTitle"></form-mdf>
        <parcel-information
                v-model="informationVisble"
                @view-order="view_order"
                :order="order"
                @close-parcel="close_parcel"
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
        }
        .preview {
            color: #6699FF;
            cursor: pointer;
            user-select: none;
            -ms-user-select: none;
            -moz-user-select: none;
            -webkit-user-select: none;
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
    import {api_wait_packing, api_wait_packing_shipping, api_print_package} from '../../../api/pickings';
    import {mapGetters, mapActions} from 'vuex';
    import {api_get_package, url_package} from '../../../api/shipment';

    export default {
        permission: {
            url_package
        },
        data() {
            return {
                leftSpan: 4,
                transportData: [],
                tableData: [],
                loading: false,
                total: 0,
                token: '',
                printer: '',
                informationVisble: false,
                order: {},
                mdfValue: false,
                mdfid: '',
                mdfTitle: '',
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
            view_order(val) {
                this.mdfValue = true;
                this.mdfid = val.mdfid;
                this.mdfTitle = val.mdfTitle;
                this.informationVisble = false;
                this.isShow = true;
                this.$refs.formMdf.require_server(this.mdfid)
            },
            click_number(val) {
                this.order = val.orderData;
                this.informationVisble = true;
            },
            close_dialog(val) {
                if (this.isShow) this.informationVisble = true;
            },
            close_parcel() {
                this.isShow = false;
            },
            init() {
                this.loading = true;
                this.$http(api_wait_packing, this.searchData).then(res => {
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
                        this.informationVisble = true;
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                        this.informationVisble = false;
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
                    this.transportLoading = true;
                    this.transportLoading = true;
                    this.$http(api_wait_packing_shipping, this.searchData).then(res => {
                        /*let treeobj = {};
                        treeobj.label = this.warehouseName;*/
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
                        // this.transportData = [treeobj];
                        this.transportData = treeObj;
                    }).catch(code => {
                        this.transportShow = true;
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    }).finally(() => {
                        this.transportLoading = false;
                    });
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
                let type = [];
                let content = '';
                let direction = 1;
                let coordinate = [];
                let numberList = [];
                let watermark = [];
                this.$http(api_print_package, {package_id: row.id}).then(res => {
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
                    let data = {
                        Type: type,
                        Token: this.token,
                        Width: 100,
                        Height: 100,
                        Url: config.apiHost + res.callback,
                        PrintName: this.printer,
                        NumberList: numberList,
                        Coordinate: coordinate,
                        Watermark: watermark,
                        content: content,
                        Direction: direction === 1 ? 'vertical' : 'transverse'
                    };
                    this.$printer(this.printer, data);
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
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
        }
    }
</script>
