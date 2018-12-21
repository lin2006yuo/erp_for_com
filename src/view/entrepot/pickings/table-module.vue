<template>
    <div class="p-pickings">
        <mailing-method ref="mailing">
            <!-- 邮寄方式列表 -->
            <transport :transport-data="transportData"
                       @node-click="click_tree"
                       :loading="transportLoading"
                       slot="mailling-tree"
                       @hidden-left="$refs.mailing.showLeft(true)">
            </transport>
            <!-- 按钮 -->
            <p class="box-title t-left" style="padding-left:8px" slot="button-list"></p>
            <!-- 打印机 -->
            <span class="inline fr" style="line-height: 28px" slot="other">
                <span style="vertical-align: middle">打印机：</span>
                <select-printer v-model="printer" class="inline width-lg"></select-printer>
            </span>
            <!--表格-->
            <ui-table slot="goods-tabel"
                      v-loading="loading"
                      element-loading-text="玩命加载中..."
                      :has-data="tableData.length>0"
                      :body-height="40"
                      :heads="uiHeads">
                <tbody>
                <template v-for="(order,index) in tableData">
                    <tr @click="addClass(index)"
                        :key="order.number"
                        :class="[clickData[index]?'active-color':'']">
                        <!--拣货单号-->
                        <td :class="[order.is_multi === 1 ? 'paddingRight':'']">
                            <plus-minus @show-detail="show(index, order)"
                                        :show="order.show"
                                        v-if="order.is_multi === 1"
                                        :title="tipTitle">
                            </plus-minus>
                            <ui-tip :content="`${order.number}`"></ui-tip>
                            <!--<div v-if="order.special_type !== 0" class="remark" :title="order.remark">
                                <span class="remark-logo">{{order.special_type === 1? 'T' : 'U'}}</span>
                            </div>-->
                        </td>
                        <!--邮寄方式-->
                        <td>
                            <ui-tip :content="order.shipping_name" :width="80"></ui-tip>
                        </td>
                        <!--面单规格-->
                        <td>
                            <ui-tip :content="order.remark" :width="80"></ui-tip>
                        </td>
                        <!--分区-->
                        <td>
                            <ui-tip :content="order.warehouse_area_code"></ui-tip>
                        </td>
                        <!--拣货单状态-->
                        <td>
                            <ui-tip :content="order.status_name" :width="80"></ui-tip>
                        </td>
                        <!--拣货单类型-->
                        <td>
                            <ui-tip :content="order.type"></ui-tip>
                        </td>
                        <!--包裹数-->
                        <td>
                            <ui-tip :content="order.package_quantity"></ui-tip>
                        </td>
                        <!--SKU数量-->
                        <td>
                            <ui-tip :content="order.sku_type"></ui-tip>
                        </td>
                        <!--商品数量-->
                        <td>
                            <ui-tip :content="order.sku_quantity"></ui-tip>
                        </td>
                        <!--已包装数量-->
                        <td v-if="searchData.status === 8 || searchData.status === 9">
                            <ui-tip :content="order.already_packing"></ui-tip>
                        </td>
                        <!--创建人-->
                        <td>
                            <ui-tip :content="order.creator_id"></ui-tip>
                        </td>
                        <!--创建时间-->
                        <td>
                            <div>
                                {{order.create_time | filterTime}}
                            </div>
                            <ui-tip :content="order.packing_end_time | filterTime" :width="80"></ui-tip>
                            <!--<ui-tip :content="order.create_time | filterTime" :width="80"></ui-tip>-->
                        </td>
                        <!--完成时间-->
                        <!--<td>
                            <ui-tip :content="order.packing_end_time | filterTime" :width="80"></ui-tip>
                        </td>-->
                        <!--开始包装时间-->
                        <td v-if="searchData.status === 8">
                            <ui-tip :content="order.packing_start_time | filterTime"></ui-tip>
                            <div>
                                <ui-tip :content="order.last_packing_time | filterTime"></ui-tip>
                            </div>
                        </td>
                        <!--最后包装时间-->
                        <!--<td v-if="searchData.status === 8">
                        </td>-->
                        <!--拣货人-->
                        <td v-if="searchData.status === 2">
                            <ui-tip :content="order.shipper_id"></ui-tip>
                        </td>
                        <!--开始拣货时间-->
                        <td v-if="searchData.status === 2">
                            <ui-tip :content="order.picking_start_time | filterTime"></ui-tip>
                            <div>
                                <ui-tip :content="order.picking_end_time | filterTime"></ui-tip>
                            </div>
                        </td>
                        <!--结束拣货时间-->
                        <!--<td v-if="searchData.status === 2">
                            <ui-tip :content="order.picking_end_time | filterTime"></ui-tip>
                        </td>-->
                        <!--操作-->
                        <td>
                            <trends-select class="inline"
                                           @trigger="action(order,$event)"
                                           :selects="m_option(order)"
                                           type="primary">
                            </trends-select>
                        </td>
                    </tr>
                    <template v-if="order.show">
                        <tr v-for="product in order_product(order)">
                            <!--拣货单号-->
                            <td>
                                <ui-tip :content="product.number" :width="98" style="margin-left: 32px"></ui-tip>
                            </td>
                            <!--邮寄方式-->
                            <td>
                                <ui-tip :content="order.shipping_name"></ui-tip>
                            </td>
                            <!--面单规格-->
                            <td>
                                <ui-tip :content="order.remark"></ui-tip>
                            </td>
                            <!--分区-->
                            <td>
                                <ui-tip :content="product.warehouse_area_code"></ui-tip>
                            </td>
                            <!--拣货单状态-->
                            <td>
                                <ui-tip :content="product.status_name" :width="80"></ui-tip>
                            </td>
                            <!--拣货单类型-->
                            <td>
                                <ui-tip :content="product.type" :width="98"></ui-tip>
                            </td>
                            <!--包裹数-->
                            <td>
                                <ui-tip :content="product.package_quantity" :width="98"></ui-tip>
                            </td>
                            <!--SKU品种数-->
                            <td>
                                <ui-tip :content="product.sku_type" :width="98"></ui-tip>
                            </td>
                            <!--商品数量-->
                            <td>
                                <ui-tip :content="product.sku_quantity" :width="98"></ui-tip>
                            </td>
                            <!--已包装数量-->
                            <td v-if="searchData.status === 8 || searchData.status === 9">
                                <ui-tip :content="product.already_packing"></ui-tip>
                            </td>
                            <!--创建人-->
                            <td>
                                <ui-tip :content="product.creator_id" :width="98"></ui-tip>
                            </td>
                            <!--创建时间-->
                            <td>
                                <div>{{product.create_time | filterTime}}</div>
                                <ui-tip :content="order.packing_end_time | filterTime"></ui-tip>
                                <!--<ui-tip :content="product.create_time | filterTime" :width="80"></ui-tip>-->
                            </td>
                            <!--完成时间-->
                            <!--<td>
                                <ui-tip :content="order.packing_end_time | filterTime"></ui-tip>
                            </td>-->
                            <!--开始包装时间-->
                            <td v-if="searchData.status === 8">
                                <ui-tip :content="product.packing_end_time | filterTime"></ui-tip>
                                <div>
                                    <ui-tip :content="product.packing_start_time | filterTime"></ui-tip>
                                </div>
                            </td>
                            <!--最后包装时间-->
                            <!--<td v-if="searchData.status === 8">
                                <ui-tip :content="product.packing_start_time | filterTime"></ui-tip>
                            </td>-->
                            <!--拣货人-->
                            <td v-if="searchData.status === 2">
                                <ui-tip :content="order.shipper_id"></ui-tip>
                            </td>
                            <!--开始拣货时间-->
                            <td v-if="searchData.status === 2">
                                <ui-tip :content="order.picking_start_time | filterTime"></ui-tip>
                                <div>
                                    <ui-tip :content="order.picking_end_time | filterTime"></ui-tip>
                                </div>
                            </td>
                            <!--结束拣货时间-->
                            <!--<td v-if="searchData.status === 2">
                                <ui-tip :content="order.picking_end_time | filterTime"></ui-tip>
                            </td>-->
                            <!--打印-->
                            <td>
                                <trends-select class="inline"
                                               @trigger="action(product,$event)"
                                               :selects="option_child(product)"
                                               type="primary">
                                </trends-select>
                                <!--<span class="operate" v-if="product.status !== 0" @click="print_child(product)">打印子拣货单</span>-->
                            </td>
                        </tr>
                    </template>
                </template>
                </tbody>
            </ui-table>
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
        <look v-model="lookVisible"
              :trend-action="trendAction">
        </look>
        <print v-model="printVisible"
               :trend-action="trendAction">
        </print>
        <under-shelf v-model="underVisible"
                     @under-shelf-finish="init"
                     :trend-action="trendAction">
        </under-shelf>
        <hand-over v-model="handVisible"
                   :trend-action="trendAction"
                   @hand="hand">
        </hand-over>
        <invoice-preview v-model="previewVisible"
                         :api="invoiceApi"
                         :params="printParams"
                         ref="invoice_preview">
        </invoice-preview>
        <operation-log v-model="logVisible" :trend-action="trendAction"></operation-log>
    </div>
</template>
<style lang="stylus">
    .p-pickings {
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
        .paddingRight {
            padding-right: 40px;
        }
        .paddingLeft {
            padding-left: 26px;
        }
        td.paddingRight.paddingLeft {
            padding-right: 11px;
            padding-left: 0;
        }
        .remark {
            display: inline-block;
            position: relative;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background-color: #333333;
            color: #fff;
            .remark-logo {
                display: inline-block;
                font-weight: 700;
                font-style: italic;
                line-height: 15px;
                height: 15px;
                text-align: left;
                font-family: 'Arial Negreta cursiva', 'Arial Normal', 'Arial';
                width: 15px;
                padding-left: 4px;
            }
        }
    }
</style>
<script>
    import {
        api_get_shipping,
        api_get_pickings,
        api_get_subpickings,
        api_invalid_pickings,
        api_print_label,
        api_sign_packing,
        api_picking_process,
        api_print_invoice,
        api_picking_massed,
        api_wait_sorting,
        api_print_detail_label,
        url_look_pickings,
        url_detail_pickings,
        url_invalid_pickings,
        url_complete_packages,
        url_print_pickings,
        url_print_label,
        url_sign_packing,
        url_print_invoice,
        url_picking_process,
        url_picking_massed,
        url_picking_log,
        url_wait_sorting,
        url_print_detail_label
    } from '@/api/pickings'
    import {mapGetters, mapActions} from 'vuex';
    import {print} from './tag_preview';

    export default {
        permission: {
            url_look_pickings,
            url_detail_pickings,
            url_invalid_pickings,
            url_complete_packages,
            url_print_pickings,
            url_print_label,
            url_sign_packing,
            url_print_invoice,
            url_picking_process,
            url_picking_massed,
            url_picking_log,
            url_wait_sorting,
            url_print_detail_label
        },
        data() {
            return {
                loading: false,
                transportData: [],
                tableData: [],
                clickData: [],
                operateButtons: [
                    {label: '查看', value: 1, apis: url_look_pickings},
                    {label: '查看发票', value: 8, apis: url_print_invoice},
                    {label: '查看操作日志', value: 12, apis: url_picking_log}
                ],
                childButtons: [
                    {label: '查看', value: 1, apis: url_look_pickings},
                    {label: '打印子拣货单', value: 9, apis: url_look_pickings},
                    {label: '查看操作日志', value: 12, apis: url_picking_log}
                ],
                total: 0,
                tipTitle: "点击更多拣货单号",
                detailData: {},
                trendAction: {
                    title: '',
                    value: '',
                    id: '',
                    sortType:false,
                },
                leftSpan: 4,
                lookVisible: false,
                printVisible: false,
                underVisible: false,
                handVisible: false,
                logVisible: false,
                printer: '',
                token: '',
                numberList: [],
                printHtml: {},
                printContent: '',
                typeList: '',
                printApi: '',
                connector: '_||_', //连接符用来规定连接html和pdf之间的符号
                previewVisible: false,
                printParams: '',
                invoiceApi: '',
                assignable: false,//是否弹出指定拣货人弹窗
                transportLoading: false,
            }
        },
        mounted() {
            for (let i = 0; i < this.tableData.length; i++) {
                this.clickData.push(false)
            }
        },
        filters: {
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
        },
        methods: {
            option_child(row) {
                return row.childButtons.filter(res => {
                    return this.$hasPermission(res.apis);
                })
            },
            m_option(row) {
                return row.operateButtons.filter(res => {
                    return this.$hasPermission(res.apis);
                })
            },
            init() {
                if (this.searchData.warehouse_id) {
                    this.loading = true;
                    let data = this.deal_time(this.searchData);
                    this.$http(api_get_pickings, data).then(res => {
                        this.tableData = res.data;
                        this.total = res.count;
                        console.log(res.data);
                        this.tableData.forEach(row => {
                            this.$set(row, 'operateButtons', window.clone(this.operateButtons));
                            if (row.status !== 0) {
                                if (row.is_invalid === 0) {
                                    row.operateButtons.push({label: '作废', value: 4, apis: url_invalid_pickings});
                                }
                                if (row.is_off === 0 && row.is_multi !== 1) {
                                    row.operateButtons.push({label: '下架', value: 5, apis: url_complete_packages});
                                }
                                row.operateButtons.push({label: '打印拣货单', value: 2, apis: url_print_pickings});
                                row.operateButtons.push({label: '打印面单', value: 3, apis: url_print_label});
                                row.operateButtons.push({label: '打印详细面单', value: 14, apis: url_print_detail_label});

                                if (row.status === 1 && row.is_multi !== 1) {
                                    row.operateButtons.push({label: '标记为正在拣货', value: 10, apis: url_picking_process});
                                }
                                if (row.status === 2) {
                                    row.operateButtons.push({label: '转交', value: 6, apis: url_print_label});
                                }
                                if (row.status === 3 && row.is_wait_sorting === 1) {
                                    row.operateButtons.push({label: '标记为等待分拣', value: 13, apis: url_wait_sorting});
                                }
                                if (row.status === 4) {
                                    row.operateButtons.push({label: '标记为集结完成', value: 11, apis: url_picking_massed});
                                }
                                if (row.status === 8 || row.status === 7) {
                                    row.operateButtons.push({label: '标记为包装完成', value: 7, apis: url_sign_packing})
                                }
                            }
                        });
                        this.loading = false;
                    }).catch(code => {
                        this.loading = false;
                        this.$message({type: "error", message: code.message || code});
                    })
                }
            },
            //处理年月日
            deal_time(searchData) {
                //处理年月日 YYYY-MM-dd
                let data = clone(searchData);
                if (searchData.date_b) {
                    data.date_b = datef('YYYY-MM-dd', searchData.date_b / 1000);
                } else {
                    data.date_b = '';
                }
                if (searchData.date_e) {
                    data.date_e = datef('YYYY-MM-dd', searchData.date_e / 1000);
                } else {
                    data.date_e = '';
                }
                return data;
            },
            request_shipping_method() {
                if (this.searchData.warehouse_id) {
                    let params = {
                        warehouse_id: this.searchData.warehouse_id,
                        status: this.searchData.status,
                        type: this.searchData.type,
                    };
                    this.transportLoading = true;
                    this.$http(api_get_shipping, params).then(res => {
                        /*let treeobj = {};
                        let total = 0;*/
                        let treeObj;
                        if (res) {
                            treeObj = Object.values(res).map(item => {
                                // total += item.count;
                                return {
                                    id: item.id || 0,
                                    label: item.name === "" ? "" : item.name,
                                    type: 'carrierr',
                                    children: item.shipping.map(row => {
                                        return {
                                            id: row.id,
                                            type: 'shipping',
                                            label: `${row.name}`
                                        }
                                    })
                                }
                            })
                        }
                        this.transportData = treeObj;
                        /*treeobj.label = this.warehousename;
                        this.transportData = [treeobj];*/
                    }).catch(code => {
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
                this.searchData.shipping_id = [];
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
            hand(id, name) {
                let item = null;
                let index = this.tableData.findIndex(row => {
                    if (row.id === id) {
                        item = row;
                        item.shipper_id = name;
                    }
                    return row.id === id;
                });
                if (index !== -1) {
                    this.tableData.splice(index, 1, item);
                }
            },
            show(index, order) {
                order.show = !order.show;
                console.log('show', order.show);
                if (order.show && (!order.product_list || order.product_list.length <= 0)) {
                    this.$http(api_get_subpickings, order.id).then(res => {
                        this.$set(order, 'product_list', res);
                        order.product_list.forEach(row => {
                            this.$set(row, 'childButtons', window.clone(this.childButtons));
                            let buttons = [];
                            console.log('product list', row.number, row.status);
                            if (row.status === 1) {
                                buttons = [{
                                    label: '标记为正在拣货',
                                    value: 10,
                                    apis: url_picking_process
                                }]
                            }
                            if (row.status === 2) {
                                buttons = [{
                                    label: '转交',
                                    value: 6,
                                    apis: url_print_label
                                }]
                            }
                            if (row.is_off === 0) {
                                buttons.unshift({label: '下架', value: 5, apis: url_complete_packages});
                            }
                            console.log('product list', row.number, row.childButtons, buttons, row.childButtons.concat(buttons));
                            row.childButtons = row.childButtons.concat(buttons);
                        });
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    })
                }
            },
            leftSpanSet() {
                if (this.leftSpan > 0) {
                    this.leftSpan = 0;
                } else {
                    this.leftSpan = 4;
                }
            },
            order_product(order) {
                return order.product_list || [];
            },
            action(data, options) {
                this.trendAction.sortType = data.type === '单品单件';
                switch (options.value) {
                    case 1:
                        this.trendAction.title = `查看拣货单(${data.number})`;
                        this.trendAction.number = data.number;
                        this.trendAction.value = 'look';
                        this.trendAction.id = data.id;
                        this.lookVisible = true;
                        break;
                    case 2:
                        this.trendAction.title = `打印拣货单`;
                        this.trendAction.value = 'print';
                        this.trendAction.id = data.id;
                        this.trendAction.sku_type = data.sku_type;
                        this.trendAction.package_quantity = data.package_quantity;//TODO:此处传sku品种数和包裹数到打印页面，后面由后端直接传字段
                        this.printVisible = true;
                        break;
                    case 3:
                        this.prints(data.id);
                        break;
                    case 4:
                        this.$confirm(`您将作废拣货单${data.number},确认此操作吗？`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$http(api_invalid_pickings, data.id).then(res => {
                                this.$message({type: "success", message: res.message || res});
                                if (this.searchData.status !== '') {
                                    this.tableData.find((item, index) => {
                                        if (item.id === data.id) {
                                            this.tableData.splice(index, 1);
                                        }
                                        return item.id === data.id;
                                    })
                                } else {
                                    this.init();
                                }
                            }).catch(code => {
                                this.$message({type: "error", message: code.message || code});
                            })
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消'
                            });
                        });
                        break;
                    case 5:
                        this.trendAction.title = `下架拣货单(${data.number})`;
                        this.trendAction.value = 'under';
                        this.trendAction.id = data.id;
                        this.underVisible = true;
                        break;
                    case 6:
                        this.trendAction.title = `转交拣货单(${data.number})`;
                        this.trendAction.value = 'hand';
                        this.trendAction.id = data.id;
                        this.handVisible = true;
                        break;
                    case 7:
                        this.$confirm(`您将标记拣货单${data.number}为已包装,确认此操作吗？`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$http(api_sign_packing, data.id).then(res => {
                                this.$message({type: "success", message: res.message || res});
                                if (this.searchData.status !== '') {
                                    this.tableData.find((item, index) => {
                                        if (item.id === data.id) {
                                            this.tableData.splice(index, 1);
                                        }
                                        return item.id === data.id;
                                    })
                                } else {
                                    this.init();
                                }
                            }).catch(code => {
                                this.$message({type: "error", message: code.message || code});
                            })
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消'
                            });
                        });
                        break;
                    case 8:
                        this.print_invoice(data);
                        break;
                    case 9:
                        this.print_child(data);
                        break;
                    case 10:
                        this.$confirm(`您将标记拣货单${data.number}为正在拣货,确认此操作吗？`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$http(api_picking_process, data.id).then(res => {
                                this.$message({type: "success", message: res.message || res});
                                this.init();
                                this.trendAction.title = `指定拣货人(${data.number})`;
                                this.trendAction.value = 'assign';
                                this.trendAction.id = data.id;
                                this.handVisible = true;
                            }).catch(code => {
                                this.$message({type: "error", message: code.message || code});
                            })
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消'
                            });
                        });
                        break;
                    case 11:
                        this.$confirm(`您将标记拣货单${data.number}为集结完成,确认此操作吗？`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$http(api_picking_massed, data.id).then(res => {
                                this.$message({type: "success", message: res.message || res});
                                if (this.searchData.status !== '') {
                                    this.tableData.find((item, index) => {
                                        if (item.id === data.id) {
                                            this.tableData.splice(index, 1);
                                        }
                                        return item.id === data.id;
                                    })
                                } else {
                                    this.init();
                                }
                            }).catch(code => {
                                this.$message({type: "error", message: code.message || code});
                            })
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消'
                            });
                        });
                        break;
                    case 12:
                        this.trendAction.title = `拣货单(${data.number})操作日志`;
                        this.trendAction.value = 'log';
                        this.trendAction.id = data.id;
                        this.logVisible = true;
                        break;
                    case 13:
                        this.$confirm(`您将标记拣货单${data.number}为等待分拣,确认此操作吗？`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$http(api_wait_sorting, data.id).then(res => {
                                this.$message({type: "success", message: res.message || res});
                                if (this.searchData.status !== '') {
                                    this.tableData.find((item, index) => {
                                        if (item.id === data.id) {
                                            this.tableData.splice(index, 1);
                                        }
                                        return item.id === data.id;
                                    })
                                } else {
                                    this.init();
                                }
                            }).catch(code => {
                                this.$message({type: "error", message: code.message || code});
                            })
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消'
                            });
                        });
                        break;
                    case 14:
                        this.print_detail(data.id);
                        break;
                }
            },
            addClass(index) {
                this.clickData = this.clickData.map(() => {
                    return false;
                });
                this.clickData[index] = true;
            },
            ...mapActions({
                set_printerList: 'api/set_printerList'
            }),
            prints(id) {
                this.numberList = [];
                this.typeList = [];
                this.printContent = [];
                this.$http(api_print_label, id).then(res => {
                    res.file_list.forEach(row => {
                        this.typeList.push(row.type);
                        this.printContent.push(row.file);
                        this.numberList.push(row.package_id);
                    });
                    let data = {
                        Type: this.typeList.join('_a_b_c_d_'),
                        Token: this.token,
                        Width: res.width,
                        Height: res.height,
                        url: config.apiHost + res.callback,
                        PrintName: this.printer,
                        NumberList: this.numberList.join('_a_b_c_d_'),
                        content: this.printContent.join('_a_b_c_d_'),
                    };
                    this.$printerOverlap(this.printer, data);
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                })
            },
            print_detail(id) {
                this.numberList = [];
                this.typeList = [];
                this.printContent = [];
                this.$http(api_print_detail_label, id).then(res => {
                    res.file_list.forEach(row => {
                        this.typeList.push(row.type);
                        this.printContent.push(row.file);
                        this.numberList.push(row.package_id);
                    });
                    let data = {
                        Type: this.typeList.join('_a_b_c_d_'),
                        Token: this.token,
                        Width: res.width,
                        Height: res.height,
                        url: config.apiHost + res.callback,
                        PrintName: this.printer,
                        NumberList: this.numberList.join('_a_b_c_d_'),
                        content: this.printContent.join('_a_b_c_d_'),
                    };
                    this.$printerOverlap(this.printer, data);
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                })
            },
            print_child(product) {
                this.trendAction.title = `打印拣货单`;
                this.trendAction.value = 'print';
                this.trendAction.id = product.id;
                this.printVisible = true;
            },
            print_invoice(row) {
                this.previewVisible = true;
                this.printParams = row.id;
                this.invoiceApi = api_print_invoice;
                this.$nextTick(() => {
                    this.$refs.invoice_preview.print_preview(row);
                });
            },
        },
        computed: {
            warehousename() {
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
            uiHeads() {
                switch (this.searchData.status) {
                    case 2:
                        return [
                            {label: '拣货单号', width: 11},
                            {label: '邮寄方式', width: 10},
                            {label: '面单规格', width: 5},
                            {label: '分区', width: 5},
                            {label: '拣货单状态', width: 6},
                            {label: '拣货单类型', width: 5},
                            {label: '包裹数', width: 5},
                            {label: 'SKU品种数', width: 5},
                            {label: '商品数量', width: 5},
                            {label: '创建人', width: 5},
                            {label: '创建时间/完成时间', width: 10},
                            {label: '拣货人', width: 5},
                            {label: '开始拣货时间/结束拣货时间', width: 15},
                            {label: '操作', width: 8},
                        ]
                        break;
                    case 8:
                        return [
                            {label: '拣货单号', width: 11},
                            {label: '邮寄方式', width: 10},
                            {label: '面单规格', width: 5},
                            {label: '分区', width: 5},
                            {label: '拣货单状态', width: 6},
                            {label: '拣货单类型', width: 5},
                            {label: '包裹数', width: 5},
                            {label: 'SKU品种数', width: 5},
                            {label: '商品数量', width: 5},
                            {label: '已包装数量', width: 5},
                            {label: '创建人', width: 5},
                            {label: '创建时间/完成时间', width: 12},
                            {label: '开始包装时间/最后包装时间', width: 13},
                            {label: '操作', width: 8},
                        ];
                        break;
                    case 9:
                        return [
                            {label: '拣货单号', width: 11},
                            {label: '邮寄方式', width: 13},
                            {label: '面单规格', width: 5},
                            {label: '分区', width: 6},
                            {label: '拣货单状态', width: 8},
                            {label: '拣货单类型', width: 6},
                            {label: '包裹数', width: 5},
                            {label: 'SKU品种数', width: 5},
                            {label: '商品数量', width: 5},
                            {label: '已包装数量', width: 5},
                            {label: '创建人', width: 6},
                            {label: '创建时间/完成时间', width: 15},
                            {label: '操作', width: 10},
                        ]
                    default:
                        return [
                            {label: '拣货单号', width: 11},
                            {label: '邮寄方式', width: 14},
                            {label: '面单规格', width: 5},
                            {label: '分区', width: 10},
                            {label: '拣货单状态', width: 8},
                            {label: '拣货单类型', width: 6},
                            {label: '包裹数', width: 5},
                            {label: 'SKU品种数', width: 5},
                            {label: '商品数量', width: 5},
                            {label: '创建人', width: 6},
                            {label: '创建时间/完成时间', width: 15},
                            {label: '操作', width: 10},
                        ]
                        break;
                }
            }
        },
        watch: {},
        props: {
            searchData: {}
        },
        components: {
            transport: require('@/components/transport.vue').default,
            uiTable: require('@/components/ui-table.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            plusMinus: require('@/components/plus-minus.vue').default,
            trendsSelect: require('@/components/trends-select.vue').default,
            look: require('./look.vue').default,
            print: require('./print.vue').default,
            underShelf: require('./under-shelf.vue').default,
            handOver: require('./hand-over').default,
            operationLog: require('./operation-log.vue').default,
            selectPrinter: require('@/components/select-printer.vue').default,
            invoicePreview: require('../../order/parcel-list/invoice-preview').default,
            mailingMethod: require('@/components/mailing-method.vue').default,
        },
    }
</script>
