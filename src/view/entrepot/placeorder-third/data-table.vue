<template>
    <el-row class="shipment-data-table">
        <mailing-method ref="mailing" @left-show-change="$listeners['left-show-change']">
            <!-- 按钮 -->
            <div slot="button-list">
                <el-checkbox label="所有页全选" v-model="checkAll" style="padding-left:16px"
                             @change="check_all">
                </el-checkbox>
                <el-button @click="reback" size="mini" class="ml-sm" type="">释放包裹</el-button>
                <request-button size="mini" class="ml-xs" type="default"
                                v-if="isApiWarehouse && packageStatus ===0 && (uploadStatus === 0 || uploadStatus === 2)"
                                @click.native="place_order_export" req-key="placeOrderExport">导出
                </request-button>
            </div>
            <!-- 头部右侧-->
            <div class="shipment-header" slot="other">
                <template v-if="uploadStatus === 0">
                    <permission tag="request-button"
                                @click.native="lazada_upload"
                                req-key="lazada_upload"
                                v-if="isLazada"
                                class="inline mr-sm"
                                :route="apis.url_place_lazada_upload">lazada物流上传
                    </permission>
                    <el-checkbox label="上传后立即交运"
                                 v-model="shipment">
                    </el-checkbox>
                    <request-button size="mini" class="ml-xs" type="primary"
                                    v-if="!(isApiWarehouse && packageStatus !==0)"
                                    @click.native="batch_upload" req-key="batchUpload">
                        {{canSure? '确定上传' : '批量上传'}}
                    </request-button>
                </template>
                <permission tag="ElButton" size="mini" class="mr-lg" v-if="uploadStatus === 1"
                            @click.native="shipping" type="primary" :route="apis.url_shipment">交运
                </permission>
                <template v-if="uploadStatus === 2">
                    <permission tag="request-button"
                                @click.native="yuntu"
                                req-key="yuntu"
                                :disabled="!hasSelect"
                                class="inline ml-sm"
                                :route="apis.url_third_stock_out">预报云图
                    </permission>
                    <permission tag="request-button"
                                v-if="isThirdWarehouse"
                                @click.native="get_tracking"
                                req-key="getTracking"
                                :disabled="!hasSelect"
                                class="inline ml-sm"
                                :route="apis.url_get_tracking">批量获取跟踪号
                    </permission>
                    <permission tag="request-button"
                                v-if="isThirdWarehouse"
                                @click.native="get_out_status"
                                req-key="getOutStatus"
                                :disabled="!hasSelect"
                                class="inline ml-sm"
                                :route="apis.url_third_stock_out">获取托管仓库发货状态
                    </permission>
                    <permission tag="request-button"
                                v-if="isThirdWarehouse"
                                @click.native="set_out_status"
                                req-key="setOutStatus"
                                :disabled="!hasSelect"
                                class="inline ml-sm"
                                :route="apis.url_third_stock_out">标记托管仓库已发货
                    </permission>
                </template>
                <template v-if="uploadStatus === 3 && hasPushPermission">
                    <el-button size="mini"
                               :disabled="!hasSelect"
                               @click.native="pushGuanyi"
                               type="primary">
                        推送
                    </el-button>
                </template>
            </div>
            <!-- 邮寄方式列表 -->
            <transport :transport-data="dataTable.tree"
                       @node-click="handle_node_click"
                       slot="mailling-tree"
                       :loading="loadShipping"
                       @title-click="clear_transport"
                       @hidden-left="$refs.mailing.showLeft(true)"
                       :title-node="`运输方式${treeCount}`">
            </transport>
            <!-- 表格 -->
            <el-table slot="goods-tabel"
                      ref="table"
                      :data="dataTable.lists"
                      class="scroll-bar"
                      @select="select"
                      v-loading="loading"
                      @select-all="select_all"
                      highlight-current-row
                      border
                      v-resize="{height:40}">
                <el-table-column type="selection" :selectable="selectable" align="center" width="30"></el-table-column>
                <el-table-column
                        label="包裹号"
                        min-width="80"
                        inline-template>
                    <div>
                        <ui-tip :is-operate="true" :content="row.number" :width="98"
                                @cur-click="parcel_information(row.number)"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column prop="country_code" label="目的地" width="70" align="center">
                </el-table-column>
                <el-table-column label="估计重量g" width="80" align="center" inline-template>
                    <span>{{parseInt(row.estimated_weight)}}</span>
                </el-table-column>
                <el-table-column inline-template label="付款日期" align="center" width="95">
                    <times :time="row.pay_time"></times>
                </el-table-column>
                <el-table-column :label="tableLabel" min-width="100" inline-template>
                    <div>
                        <ui-tip v-if="uploadStatus===0" :content="row.distribution_time|timeFilter"
                                :width="98"></ui-tip>
                        <times v-if="uploadStatus===1" :time="row.update_time"></times>
                        <times v-if="uploadStatus===2" :time="row.package_confirm_status"></times>
                    </div>
                </el-table-column>
                <el-table-column label="物流商单号" prop="process_code"></el-table-column>
                <el-table-column label="包含订单" inline-template>
                    <div>{{row.contain_order | orderFilter}}</div>
                </el-table-column>
                <el-table-column v-if="uploadStatus!==0" label="跟踪号" prop="shipping_number"></el-table-column>
                <el-table-column label="最迟发货时间" min-width="80" inline-template>
                        <span>
                            {{row.uploaded_deadline | timeFilter}}
                        </span>
                </el-table-column>
                <el-table-column label="邮寄方式" min-width="130" inline-template>
                    <ui-tip :content="row.shipping_name" :width="98"></ui-tip>
                </el-table-column>
                <el-table-column label="状态" align="center" inline-template min-width="60">
                    <template v-if="row.providers_error_info">
                        <span class="error" :title="row.providers_error_info" v-copy>{{row.statusName}}</span>
                    </template>
                    <span v-else v-copy>{{row.statusName}}</span>
                </el-table-column>
            </el-table>
        </mailing-method>
        <el-pagination
                class="aliRight mt-xs"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="dataTable.page"
                :page-sizes="[20,50,100,200,500]"
                :page-size="dataTable.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="dataTable.total">
        </el-pagination>
        <form-mdf
                @close-dialog="close_dialog"
                @click-number="click_number"
                ref="formmfd"
                :mdfid="mdfid"
                v-model="mdfValue"
                :is-edit="isEdit"
                :btn-show="btnShow"
                :mdf-title="mdfTitle"
        ></form-mdf>
        <parcel-information
                v-model="informationVisble"
                :order="order"
                @close-parcel="close_parcel"
                @view-order="view_order"
        ></parcel-information>
    </el-row>
</template>
<style lang="stylus">
    .shipment-data-table {
        font-size 12px;
        .shipment-simulate {
            box-sizing: border-box;
            display: inline-block;
            color: #fff;
            width: 100%;
            padding: 0 5px;
            height: 32px;
            line-height: 32px;
            font-size: 1.2rem;
            background: #6495ED;
            border: 1px solid #6495ED;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            border-bottom: 1px solid transparent;
        }
        .tree-myself {
            height: 555px;
            overflow-y: auto;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
            .el-tree-node__label {
                font-size: 12px;
            }
        }
        .shipment > .el-card__header {
            background: #6495ED;
            padding: 3px 5px;
            .el-checkbox__label {
                color: #fff;
            }
            height: 32px;
            line-height: 26px;
        }
        .aliRight {
            text-align: right;
        }
        .shipment-header {
            float: right;
            line-height: 26px;
        }
        .shipping-data-table {
            .error-log {
                color: #f00;
            }
        }
        .error {
            padding-right: 12px;
            display: inline-block;
        }
        .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
            background: rgba(173, 227, 255, .7) !important;
        }
        .el-tree-node__content:hover {
            background: rgba(204, 227, 199, .7) !important;
        }
    }
</style>
<script>
    import {
        url_batchUpload,
        url_shipment,
        url_push_guanyi,
        url_place_lazada_upload,
        url_package,
        api_get_package
    } from '@/api/shipment'
    import formMdf from '../../order/local/form-mdf.vue';
    import {url_get_tracking} from '@/api/packages';
    import {url_third_stock_out} from '@/api/stock-out';

    export default {
        permission: {
            url_batchUpload, url_shipment, url_package, url_third_stock_out,
            url_get_tracking,
            url_place_lazada_upload
        },
        data() {
            return {
                checkAll: false,
                shipment: true,
                selected: [],
                informationVisble: false,
                order: {},
                mdfTitle: '',
                mdfValue: false,
                mdfid: '',
                isEdit: false,
                btnShow: true,
                isShow: false,
                tableLabel: '配货时间',
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
            orderFilter(val) {
                return val.map(row => row.order_number).join();
            }
        },
        methods: {
            view_order(val) {
                this.mdfid = val.mdfid;
                this.mdfValue = val.mdfValue;
                this.mdfTitle = val.mdfTitle;
                this.isEdit = val.isEdit;
                this.btnShow = val.btnShow;
                this.informationVisble = false;
                this.isShow = true;
                this.$refs.formmfd.require_server(this.mdfid)
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
            handle_size_change(size) {
                this.$emit("chang-size", size);
            },
            handle_current_change(page) {
                this.$emit("chang-page", page);
            },
            handle_node_click(node) {
                this.$emit("node-click", node);
            },
            clear_transport() {
                this.$emit('title-click')
            },
            check_all() {
                this.$emit("check-all", this.checkAll);
            },
            batch_upload() {
                this.$emit("batch-upload", this.shipment);
            },
            lazada_upload() {
                this.$emit("lazada-upload", this.shipment);
            },
            place_order_export() {
                this.$emit('export', this.shipment);
            },
            set_status(row, status) {
                this.$refs.table.toggleRowSelection(row, status);
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
            shipping() {
                this.$emit('shipping')
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
            pushGuanyi() {
                this.$emit('push-guanyi');
            },
            yuntu() {
                this.$emit('yuntu');
            },
            get_out_status() {
                this.$emit('third-out', false);
            },
            set_out_status() {
                this.$emit('third-out', true);
            },
            reback() {
                this.$emit('reback');
            },
            get_tracking() {
                this.$emit('get-tracking');
            }
        },
        computed: {
            treeCount() {
                let sum = this.dataTable.tree.sum(obj => {
                    return obj.count
                });
                return sum > 0 ? `(${sum})` : '';
            },
            hasSelect() {
                return this.selected.length > 0 || this.checkAll;
            },
            hasPushPermission() {
                return this.$hasPermission(url_push_guanyi)
            },
            canSure() {
                return this.isApiWarehouse && this.packageStatus === 0;
            }
        },
        watch: {
            uploadStatus(val) {
                switch (val) {
                    case 0:
                        this.tableLabel = '配货时间';
                        break;
                    case 1:
                        this.tableLabel = '上传时间';
                        break;
                    case 2:
                        this.tableLabel = '交运时间';
                        break;
                }
            }
        },
        props: {
            uploadStatus: {
                default() {
                    return 0;
                }
            },
            packageStatus: {
                default() {
                    return 0;
                }
            },
            dataTable: {
                required: true,
                type: Object
            },
            loading: {},
            loadShipping: {},
            isLazada: {},
            isThirdWarehouse: {},
            isApiWarehouse: {},
        },
        components: {
            formMdf: require('../../order/local/form-mdf.vue').default,
            parcelInformation: require('./parcel-information.vue').default,
            uiTip: require("@/components/ui-tip.vue").default,
            requestButton: require('@/global-components/request-button.vue').default,
            mailingMethod: require('@/components/mailing-method.vue').default,
            transport: require('@/components/transport.vue').default,
        }
    }
</script>
