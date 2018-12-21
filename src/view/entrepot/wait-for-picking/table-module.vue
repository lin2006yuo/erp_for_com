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
            <!-- 按钮 -->
            <div slot="button-list">
                <permission tag="request-button"
                            type=""
                            @click="free_packages"
                            req-key="api_free_packages_2"
                            class="ml-sm"
                            :route="apis.url_free_packages">释放包裹
                </permission>
                <permission tag="request-button"
                            type=""
                            @click="batch_produce"
                            req-key="api_batch_produce"
                            class="ml-sm"
                            :disabled="this.selectList.length <= 0"
                            :route="apis.url_batch_produce">批量生成拣货单
                </permission>
                <permission tag="request-button"
                            type=""
                            @click="batch_fast_produce"
                            req-key="api_make_quick"
                            class="ml-sm"
                            :disabled="this.selectList.length <= 0"
                            :route="apis.url_make_quick">批量生成快速发货区拣货单
                </permission>
            </div>
            <!-- 表格 -->
            <el-table
                    slot="goods-tabel"
                    ref="tableData"
                    class="box goods-tabel"
                    :data="tableData"
                    highlight-current-row
                    v-loading="loading"
                    :default-sort="{prop: 'uploaded_deadline', order: 'descending'}"
                    element-loading-text="玩命加载中..."
                    @selection-change="select_change"
                    v-resize="{height:40}">
                <el-table-column type="selection" width="35" align="center"></el-table-column>
                <el-table-column
                        inline-template
                        label="包裹号">
                    <div>
                        <ui-tip :is-operate="true" :content="row.number" :width="98"
                                @cur-click="parcel_information(row.number)"></ui-tip>
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
                        inline-template>
                    <div>
                        <ui-tip :content="row.process_code" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="运输方式"
                        inline-template>
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
                        label="最迟发货时间"
                        inline-template
                        prop="uploaded_deadline"
                        sortable>
                    <div>
                        <ui-tip :content="row.uploaded_deadline | filterTime" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="配货时间"
                        inline-template
                        prop="distribution_time"
                        sortable>
                    <div>
                        <ui-tip :content="row.distribution_time | filterTime" :width="98"></ui-tip>
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
                v-model="informationVisble"
                @close-parcel="close_parcel"
                @view-order="view_order"
                :order="order"
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
    import {api_wait_picking, api_wait_picking_shipping} from '../../../api/pickings'
    import {api_get_package, url_package} from '../../../api/shipment'
    import {
        url_free_packages,
        api_free_packages,
        url_batch_produce,
        api_make_quick,
        url_make_quick,
        api_batch_produce,
    } from '../../../api/packages';

    export default {
        permission: {
            url_package, url_free_packages, url_batch_produce, url_make_quick
        },
        data() {
            return {
                selectList: [],
                leftSpan: 4,
                transportData: [],
                tableData: [],
                loading: false,
                total: 0,
                informationVisble: false,
                order: {},
                mdfid: '',
                mdfValue: false,
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
            batch_fast_produce() {
                let params = {
                    ids: this.selectList.map(item => item.id),
                    warehouse_id: this.searchData.warehouse_id,
                };
                this.$http(api_make_quick, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    this.$reqKey('api_make_quick', false);
                })
            },
            batch_produce() {
                let data = {
                    warehouse_id: this.searchData.warehouse_id,
                    ids: this.selectList.map(item => item.id),
                };
                return this.$http(api_batch_produce, data).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.init();
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey(`api_batch_produce`, false);
                    }, 200);
                });
            },
            select_change(val) {
                this.selectList = val;
            },
            free_packages() {
                let id = this.selectList.map(row => row.id);
                let ids = id.toString();
                if (this.selectList.length <= 0) {
                    this.$message({type: "warning", message: "请先选择需要批量操作的面单！"});
                    this.$reqKey(`api_free_packages_2`, false);
                    return Promise.resolve();
                }
                return this.$http(api_free_packages, {
                    warehouse_id: this.selectList[0].warehouse_id,
                    ids: ids
                }).then(res => {
                    id.forEach(item => {
                        let index = this.tableData.findIndex(it => it.id === item);
                        if (index > -1) this.tableData.splice(index, 1);
                    });
                    this.$message({type: "success", message: res.message || res});
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey(`api_free_packages_2`, false);
                    }, 200);
                });

            },
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
                this.$http(api_wait_picking, this.searchData).then(res => {
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
                    this.transportShow = false;
                    this.transportLoading = true;
                    this.$http(api_wait_picking_shipping, this.searchData).then(res => {
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
            left_show_change(val) {
                if (!val && this.transportShow) {
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
                    if (!isObjectValueEqual(newVal, value)) {
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
            parcelInformation: require('../placeorder/parcel-information.vue').default,
            formMdf: require("../../order/local/form-mdf.vue").default,
            requestButton: require('@/global-components/request-button.vue').default,
            mailingMethod: require('@/components/mailing-method.vue').default,
        }
    }
</script>
