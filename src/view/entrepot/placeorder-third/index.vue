<template>
    <page class="p-index">
        <!--<warehouse ref="warehouse" v-model="warehouse_id"
                   @change="change_warehouse"
                   class="inline mb-xs mt-sm"
                   :has-all="false"></warehouse>-->
        <label-item label="请选择第三方仓库：" class="mb-xs mt-sm">
            <el-select v-model="warehouse_id"
                       filterable clearable
                       class="inline width-super"
                       @change="change_warehouse">
                <el-option
                        :key="item.value"
                        v-for="item in warehouseList"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <el-card>
            <search-card :params="form" @search="search" :clears="clears" @init-params="init_status_btn">

                <label-item label="配货批次：" class="mb-mini">
                    <el-checkbox v-model="form.batch" label="全部" class="inline"></el-checkbox>
                </label-item>
                <el-row>
                    <div>
                        <label-buttons label="平台："
                                       :buttons="buttonsChannel"
                                       :is-disabled="is_disabled"
                                       :selected="channelSelected"
                                       labelWidth="72"
                                       @select="select_channel">
                        </label-buttons>
                    </div>
                    <div class="mb-mini" v-if="accountLabel && channelAccounts.length > 0">
                        <select-more-button
                                :label="accountLabel"
                                label-width="120"
                                :button-list="channelAccounts"
                                :clearSelect="clearSelect"
                                @query="select_account">
                        </select-more-button>
                    </div>
                </el-row>
                <div>
                    <label-buttons label="包裹状态："
                                   class="inline"
                                   :is-disabled="is_disabled"
                                   :buttons="buttonsPackages"
                                   @select="select_packagestatus"
                                   labelWidth="72">
                    </label-buttons>
                    <label-buttons label="上传状态："
                                   class="inline"
                                   :buttons="buttonsUpload"
                                   @select="select_uploadstatus"
                                   labelWidth="72">
                    </label-buttons>
                    <span class="inline">包裹排序：</span>
                    <el-select v-model="form.sortType" class="inline">
                        <el-option v-for="item in sortStatus" :key="item.value" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                    <el-checkbox v-model="form.stick" label="多商品置顶" class="inline ml-sm"></el-checkbox>
                </div>
                <el-select class="inline"
                           v-model="form.snType"
                           style="width:110px">
                    <el-option v-for="item in connds"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <order-input v-model="form.batchText"
                             class="inline width-super"
                             placeholder="可批量搜索，Shift+回车换行..."
                             @keydown="key_down">
                </order-input>
                <label-item label="是否有跟踪号：" class="inline ml-sm mr-sm">
                    <el-select class="width-mini" v-model="form.is_has_tracking">
                        <el-option v-for="item in trackingList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">

                        </el-option>
                    </el-select>
                </label-item>
                <!--<el-button size="mini" v-model="form.btnFiltrate" type="primary" class="inline ml-sm"
                           @click.native="search">搜索
                </el-button>-->
            </search-card>
        </el-card>
        <data-table ref="dataTable"
                    :dataTable="dataTable"
                    @chang-page="chang_page"
                    @selected="selected"
                    @reback="reback"
                    @push-guanyi="pushGuanyi"
                    @yuntu="yuntu"
                    :upload-status="uploadStatus"
                    :package-status="packageStatus"
                    @export="place_order_export"
                    @chang-size="chang_size"
                    @node-click="node_click"
                    @check-all="check_all"
                    @batch-upload="batch_upload"
                    @lazada-upload="lazada_upload"
                    @shipment-change="shipment_change"
                    @shipping="shipping"
                    @left-show-change="left_show_change"
                    @third-out="third_out"
                    @get-tracking="get_tracking"
                    @title-click="clear_transport"
                    :loading="isLoading"
                    :is-third-warehouse="isThirdWarehouse"
                    :is-api-warehouse="isApiWarehouse"
                    :is-lazada="isLazada"
                    :load-shipping="loadShipping"
                    element-loading-text="玩命加载中..."
        ></data-table>
    </page>
</template>
<style lang="stylus">
    .p-index {
        position: relative;
        height: 100%;
        .el-card {
            overflow: visible;
        }
    }
</style>
<script>
    import labelButtons from '@/components/label-buttons.vue';
    import selectRemote from '@/components/select-remote.vue';
    import labelItem from '@/components/label-item.vue';
    import dataTable from './data-table.vue';
    import {api_get_tracking} from '@/api/packages';
    import {
        api_push_guanyi, api_uploadYt, api_reback, api_get_shipping_method,
        api_third_placeorder, batchUpload, api_warehouse_channel, api_placeorder_package_statuses,
        api_accounts, api_shipment,
        api_confirm_upload,
        api_placeorder_channels,
        api_place_order_export,
        api_place_lazada_upload
    } from '@/api/shipment';
    import {api_warehous_third} from "@/api/entrepot-picking";
    import {api_third_stock_out} from '@/api/stock-out';
    import {downloadFile} from "@/lib/http";

    export default {
        page: {},
        data() {
            return {
                connds: [
                    {label: '包裹号', value: "number"},
                    {label: '物流商单号', value: 'process_code'},
                    {label: '跟踪号', value: 'shipping_number'},
                    {label: '订单号', value: 'order_number'},
                    {label: '平台订单号', value: 'channel_order_number'},
                ],
                warehouse_id: 2,
                form: {
                    snType: 'number',
                    batchText: '',
                    batch: false,
                    channel_id: 0,
                    account_id: 0,
                    moreAccount: false,
                    status: "1_0",
                    is_has_tracking: '',
                    sortType: "create_time|desc",
                    stick: false,
                    btnFiltrate: ""
                },
                clears: {
                    snType: 'number',
                    batch: false,
                    channel_id: 0,
                    account_id: 0,
                    status: "1_0",
                    sortType: "create_time|desc",
                    stick: false,
                },
                moreAccount: false,
                buttonsChannel: [],
                buttonsUpload: [],
                buttonsPackages: [],
                sortStatus: [
                    {label: "包裹创建日期（新-旧）", value: "create_time|desc"},
                    {label: "包裹创建日期（旧-新）", value: "create_time|asc"},
                    {label: "订单付款日期（新-旧）", value: "pay_time|desc"},
                    {label: "订单付款日期（旧-新）", value: "pay_time|asc"},
                    {label: "最迟发货时间（新-旧）", value: "uploaded_deadline|desc"},
                    {label: "最迟发货时间（旧-新）", value: "uploaded_deadline|asc"},
                    {label: "包裹号升序", value: "number|asc"},
                    {label: "包裹号降序", value: "number|desc"},
                ],
                dataTable: {
                    total: 0,
                    page: 1,
                    pageSize: 50,
                    lists: [],
                    tree: [],
                    defaultProps: {
                        label: 'label',
                        children: 'children'
                    }
                },
                carrier_id: 0,
                shipping_id: 0,
                uploadStatus: 0,
                packageStatus: 0,
                checkAll: false,
                params: {},
                selectedItems: [],
                shipment: false,
                isLoading: false,
                loadShipping: false,
                channelAccounts: [],
                selectAccounts: [],
                clearSelect: false,
                channelSelected: -1,
                warehouseList: [],
                trackingList: [
                    {value: '', label: '全部'},
                    {value: 1, label: '有'},
                    {value: 0, label: '没有'},
                ],
                isThirdWarehouse: false,
                isApiWarehouse: false,
                transportShow: true,
            }
        },
        mounted() {
            this.channels();
            this.init();
            this.init_warehouse();
            this.transportShow = true;
        },
        refresh() {
            this.request_accounts();
            this.channels();
            this.upload_statuses();
            this.package_statuses();
            this.init();
            this.transportShow = true;
        },
        methods: {
            init_status_btn() {
                this.dataTable.page = 1;
                this.dataTable.pageSize = 50;
                let buttonsChannel = this.buttonsChannel;
                let channelAccounts = this.channelAccounts;
                let buttonsPackages = this.buttonsPackages;
                let buttonsUpload = this.buttonsUpload;
                this.buttonsChannel = [];
                this.channelAccounts = [];
                this.buttonsPackages = [];
                this.buttonsUpload = [];
                this.$nextTick(() => {
                    this.buttonsChannel = buttonsChannel;
                    this.channelAccounts = channelAccounts;
                    this.buttonsPackages = buttonsPackages;
                    this.buttonsUpload = buttonsUpload;
                })
            },
            init_warehouse() {
                this.$http(api_warehous_third).then(res => {
                    this.warehouseList = res.map((item) => {
                        return {
                            label: item.name,
                            value: item.id,
                            type: item.type,
                            is_third: item.is_third,
                        };
                    });
                    if (this.warehouseList.length > 0) {
                        this.warehouse_id = this.warehouseList[0].value;
                    } else {
                        this.warehouse_id = '';
                    }
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            change_warehouse(val) {
                this.channels();
                this.upload_statuses();
                this.package_statuses();
                this.init();
                this.transportShow = true;
            },
            select_account(select) {
                this.selectAccounts = select;
                this.package_statuses();
                this.upload_statuses();
                this.init();
            },
            channels() {//平台
                this.$http(api_placeorder_channels, {warehouse_id: this.warehouse_id}).then(res => {
                    this.buttonsChannel = res;
                    this.buttonsChannel.forEach(row => {
                        this.$set(row, 'isDisabled', false);
                    });
                });
            },
            package_statuses() {
                let data = {
                    is_third: true,
                    warehouse_id: this.warehouse_id,
                    channel_id: this.form.channel_id,
                    channel_account_ids: this.selectAccounts.map(a => a.value).join(','),
                };
                this.$http(api_placeorder_package_statuses, 'package', data).then(res => {
                    this.buttonsPackages = res;
                    this.buttonsPackages.forEach(row => {
                        if (this.form.channel_id !== 4) {
                            if (row.value === 17) {
                                this.$set(row, 'isDisabled', true);
                            } else {
                                this.$set(row, 'isDisabled', false);
                            }
                        } else {
                            if (row.value === 16) {
                                this.$set(row, 'isDisabled', true);
                            } else {
                                this.$set(row, 'isDisabled', false);
                            }
                        }

                    });
                })
            },
            upload_statuses() {
                if (!!this.warehouse_id && this.buttonsChannel.length > 0 && this.buttonsPackages.length > 0) {
                    let data = {
                        warehouse_id: this.warehouse_id,
                        channel_id: this.form.channel_id,
                        channel_account_ids: this.selectAccounts.map(a => a.value).join(','),
                        package_status: this.form.status.split('_')[0]
                    };
                    this.$http(api_placeorder_package_statuses, 'upload', data).then(res => {
                        this.buttonsUpload = res;
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    });
                }
            },
            init() {//获取数据
                if (!!this.warehouse_id && this.buttonsChannel.length > 0 && this.buttonsPackages.length > 0 && this.buttonsUpload.length > 0) {
                    this.selectedItems = [];
                    if (!this.warehouse_id) return false;
                    let cur = this.form.batchText.split('\n').filter(row => !!row);
                    let snText = '';
                    if (cur && cur.length > 1) {
                        snText = cur.map(row => {
                            return row.trim();
                        });
                    } else if (cur && cur.length === 1) {
                        snText = this.form.batchText.trim();
                    }
                    this.isLoading = true;
                    let snTypeOrder = this.form.sortType.split('|');
                    this.parmas = { //神一样的逻辑，还要重新写参数，form是用来干嘛的
                        snText: snText,
                        snType: this.form.snType,
                        page: this.dataTable.page,
                        pageSize: this.dataTable.pageSize,
                        warehouse_id: this.warehouse_id,
                        channel_id: this.form.channel_id,
                        is_has_tracking: this.form.is_has_tracking,
                        channel_account_ids: this.selectAccounts.map(a => a.value).join(','),
                        stick: this.form.stick,
                        shipping_id: this.shipping_id,
                        carrier_id: this.carrier_id,
                        status: this.form.status,
                        sortType: snTypeOrder[0],
                        sortText: snTypeOrder[1],
                    };
                    this.$http(api_third_placeorder, this.parmas).then(res => {
                        this.isLoading = false;
                        this.parmas.shipping_id = 0;
                        this.params.carrier_id = 0;
                        this.dataTable.total = res.count;
                        this.dataTable.lists = res.data.packages;
                        if (this.checkAll) {
                            this.$nextTick(() => {
                                this.dataTable.lists.map(row => {
                                    this.$refs.dataTable.set_status(row, true);
                                })
                            })
                        }
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    }).finally(() => {
                        this.isLoading = false;
                    })
                }
            },
            get_shipping_method() {
                let snTypeOrder = this.form.sortType.split('|');
                let params = {
                    snText: '',
                    snType: this.form.snType,
                    warehouse_id: this.warehouse_id,
                    channel_id: this.form.channel_id,
                    is_has_tracking: this.form.is_has_tracking,
                    stick: this.form.stick,
                    status: this.form.status,
                    sortType: snTypeOrder[0],
                    sortText: snTypeOrder[1],
                    channel_account_ids: this.selectAccounts.map(a => a.value).join(','),
                    page: this.dataTable.page,
                    pageSize: this.dataTable.pageSize,
                };
                if (this.form.batchText) {
                    this.form.batchText.replace(new RegExp(' ', 'gm'), '\n');
                    let list = this.form.batchText.split('\n').filter(row => !!row).map(row => row.trim());
                    let snText = list.length > 1 ? list : this.form.batchText.trim();
                    this.$set(params, 'snText', snText);
                }
                this.loadShipping = true;
                this.$http(api_get_shipping_method, params).then(res => {
                    function label(obj) {
                        return `${obj.name}(${obj.count})`;
                    }

                    function do_node(obj, type) {
                        return {
                            id: obj.id || 0,
                            count: obj.count,
                            type: type,
                            label: label(obj),
                            children: do_children(obj.shippings || [], 2),
                        };
                    }

                    function do_children(objs, type) {
                        return objs.map(obj => {
                            return do_node(obj, type);
                        })
                    }

                    this.dataTable.tree = [...do_children(res.list, 1)];
                    this.transportShow = false;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message});
                }).finally(() => {
                    this.loadShipping = false;
                })
            },
            chang_page(page) {
                this.dataTable.page = page;
                this.init();
            },
            chang_size(size) {
                this.dataTable.pageSize = size;
                this.init();
            },
            request_accounts() {//账号
                if (!this.accountLabel) {
                    return;
                }
                let params = {
                    channel_id: this.form.channel_id,
                    warehouse_id: this.warehouse_id
                };
                this.$http(api_accounts, params).then(res => {
                    this.channelAccounts = res;
                    this.channelAccounts.forEach((row, index) => {
                        if (index < 10) {
                            this.$set(row, 'showSearch', true);
                        } else {
                            this.$set(row, 'showSearch', false);
                        }
                        this.$set(row, 'showDialog', true);
                    });
                })
            },
            select_channel(index, item) {
                this.shipping_id = 0;
                this.form.channel_id = item.value;
                this.selectAccounts.length = 0;
                this.clearSelect = !this.clearSelect;
                this.init();
                this.transportShow = true;
                this.request_accounts();
                this.package_statuses();
                this.upload_statuses();
            },
            select_packagestatus(index) {
                const status = this.buttonsPackages[index].value;
                this.form.status = this.form.status.replace(/^(\d+)/, status);
                this.packageStatus = index;
                this.init();
                this.transportShow = true;
                this.upload_statuses();
            },
            select_uploadstatus(index) {
                this.carrier_id = 0;
                this.shipping_id = 0;
                const upload = this.buttonsUpload[index].value;
                this.form.status = this.form.status.replace(/(\d+)$/, upload);
                this.uploadStatus = index;
                this.init();
                this.transportShow = true;
            },
            key_down() {
                this.search();
            },
            search() {
                this.init();
                this.transportShow = true;
            },
            node_click(node) {
                this.carrier_id = 0;
                this.shipping_id = 0;
                if (!node.length) {
                    if (1 === node.type) {
                        this.carrier_id = node.id;
                    } else {
                        this.shipping_id = [node.id];
                    }
                } else {
                    this.shipping_id = node;
                }
                this.init();
            },
            check_all(status) {
                this.checkAll = status;
            },
            place_order_export(shipment) {
                let condition = {
                    warehouse_id: this.warehouse_id
                };
                if (shipment) {
                    condition.delivery = 1;
                }
                if (this.warehouse_id <= 0) {
                    this.$message({
                        type: "error",
                        message: `请选择仓库`
                    });
                    this.$reqKey('placeOrderExport', false);
                } else {
                    if (this.shipment) {
                        condition.delivery = '';
                    }
                    if (this.checkAll) {
                        condition.select = true;
                        condition = Object.assign(condition, this.parmas);
                    } else {
                        if (this.selectedItems.length <= 0) {
                            this.$message({
                                type: "error",
                                message: `请选择要导出的数据`
                            });
                            this.$reqKey('placeOrderExport', false);
                            return;
                        }
                        condition.ids = this.selectedItems.map(row => row.id).join(',');
                    }
                    this.$http(api_place_order_export, condition).then(res => {
                        this.$message({
                            type: "success",
                            message: res.message || res
                        });
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let params = {
                            file_code: res.file_code
                        };
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        })
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('placeOrderExport', false);
                        }, 200)
                    });
                }
            },
            batch_upload(shipment) {
                let condition = {
                    warehouse_id: this.warehouse_id
                };
                if (shipment) {
                    condition.delivery = 1;
                }
                if (this.warehouse_id <= 0) {
                    this.$message({
                        type: "error",
                        message: `请选择仓库`
                    });
                    this.$reqKey('batchUpload', false);
                } else {
                    if (this.shipment) {
                        condition.delivery = '';
                    }
                    if (this.checkAll) {
                        condition.select = true;
                        condition = Object.assign(condition, this.parmas);
                    } else {
                        if (this.selectedItems.length <= 0) {
                            this.$message({
                                type: "error",
                                message: `请选择要上传的数据`
                            });
                            this.$reqKey('batchUpload', false);
                            return;
                        }
                        condition.ids = this.selectedItems.map(row => row.id).join(',');
                    }
                    let api = this.isApiWarehouse ? api_confirm_upload : batchUpload;
                    this.$http(api, condition).then(res => {
                        this.$message({
                            type: "success",
                            message: res.message || res
                        });
                        this.carrier_id = 0;
                        this.init();
                        this.transportShow = true;
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        })
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('batchUpload', false);
                        }, 200)
                    });
                }

            },
            lazada_upload() {
                if (this.selectedItems.length <= 0) {
                    this.$message({
                        type: "error",
                        message: `请选择要上传的数据`
                    });
                    this.$reqKey('lazada_upload', false);
                    return;
                }
                let data = {
                    ids: this.selectedItems.map(row => row.id).join(','),
                };
                this.$http(api_place_lazada_upload, data).then(res => {
                    this.$message({
                        type: "success",
                        message: res.message || res
                    });
                    this.carrier_id = 0;
                    this.init();
                    this.transportShow = true
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('lazada_upload', false);
                    }, 200)
                });
            },
            shipping() {
                if (this.selectedItems.length <= 0) {
                    return this.$message({
                        type: "error",
                        message: `请选择要上传的数据`
                    });
                }
                const ids = this.selectedItems.map(row => row.id).join(',');
                this.$http(api_shipment, {ids}).then(res => {
                    this.$message({
                        type: "success",
                        message: res.message || res
                    });
                    this.init();
                    this.transportShow = true;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                });
            },
            selected(selected) {
                this.selectedItems = selected;
            },
            warehouse_remote() {
                return this.$http(api_warehouse_channel).then(res => {
                    this.$set(this.form, "warehouse_id", res[1].id);
                    return Promise.resolve(res.map(({id, name}) => {
                        return {label: name, value: id}
                    }));
                }).catch(code => {
                    console.log(code);
                })
            },
            shipment_change(status) {
                this.shipment = status;
            },
            reback() {
                let params = {};
                if (this.checkAll) {
                    params.select = true;
                    params.warehouse_id = this.warehouse_id || 0;
                    params.channel_id = this.form.channel_id || 0;
                    params.shipping_id = this.form.shipping_id || 0;
                    params.status = this.form.status;
                    params.carrier_id = this.carrier_id || 0;
                } else {
                    params.warehouse_id = this.warehouse_id || 0;
                    params.ids = this.selectedItems.map(row => row.id).join(',');
                }
                if (!params.ids && !params.select) {
                    return this.$message({message: "请选择需要释放的包裹", type: 'error'});
                }
                this.$http(api_reback, params).then(res => {
                    this.$message(res.message);
                    this.init();
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                })
            },
            yuntu() {
                let params = {};
                if (this.checkAll) {
                    params.select = true;
                    params.warehouse_id = this.warehouse_id || 0;
                    params.channel_id = this.form.channel_id || 0;
                    params.shipping_id = this.form.shipping_id || 0;
                    params.status = this.form.status;
                    params.carrier_id = this.carrier_id || 0;
                } else {
                    params.warehouse_id = this.warehouse_id || 0;
                    params.packageIds = this.selectedItems.map(row => row.id).join(',')
                }

                this.$http(api_uploadYt, params).then(res => {
                    this.$message(res.message);
                    this.init();
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('yuntu', false)
                    }, 200);
                });
            },
            third_out(bool) {
                let packageIds = this.selectedItems.map(row => row.id);
                let params = {
                    package_ids: packageIds,
                };
                if (bool) {
                    params.is_force = 1;
                }
                this.$http(api_third_stock_out, params).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                }).finally(() => {
                    let key = bool ? 'setOutStatus' : 'getOutStatus';
                    setTimeout(() => {
                        this.$reqKey(key, false)
                    }, 200);
                });
            },
            get_tracking() {
                let packageNumber = this.selectedItems.map(row => row.number);
                let params = {
                    number: packageNumber,
                };
                this.$http(api_get_tracking, params).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('getTracking', false)
                    }, 200);
                });
            },
            pushGuanyi() {
                let params = {};
                if (this.checkAll) {
                    params.select = true;
                    params.warehouse_id = this.warehouse_id || 0;
                    params.channel_id = this.form.channel_id || 0;
                    params.shipping_id = this.form.shipping_id || 0;
                    params.status = this.form.status;
                    params.carrier_id = this.carrier_id || 0;
                } else {
                    params.warehouse_id = this.warehouse_id || 0;
                    params.ids = this.selectedItems.map(row => row.id).join(',')
                }
                this.$http(api_push_guanyi, params).then(res => {
                    this.$message(res.message);
                    this.init();
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                })
            },
            is_disabled(item) {
                return item.isDisabled;
            },
            clear_transport() {
                this.carrier_id = 0;
                this.shipping_id = 0;
                this.init();
                this.transportShow = true;
            },
            left_show_change(val) {
                if(!val && this.transportShow) {
                    this.get_shipping_method();
                }
            }
        }
        ,
        computed: {
            isShow() {
                return this.form.channel_id > 0;
            },
            accountLabel() {
                if (this.form.channel_id > 0) {
                    let find = this.buttonsChannel.find(row => {
                        return this.form.channel_id === row.value;
                    });
                    if (find) {
                        return `${find.label.replace("平台", "账号")}：`;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }

            },
            changeLabel() {
                let find = this.connds.find(res => {
                    return res.value === this.form.snType;
                });
                if (!!find) {
                    return find.label;
                }
            },
            isLazada() {
                return this.warehouse_id === 2 || this.warehouse_id === 6;
            }
        },
        watch: {
            checkAll(val) {
                this.dataTable.lists.map(row => {
                    this.$refs.dataTable.set_status(row, val);
                })
            },
            'form.stick'() {
                this.init(false);
            },
            'warehouse_id'() {
                if (this.warehouseList.length > 0) {
                    let warehouse = this.warehouseList.find(row => row.value === this.warehouse_id);
                    this.isThirdWarehouse = warehouse.is_third === 1;
                    this.isApiWarehouse = warehouse.type === 12;
                }
            },
            carrier_id(val) {
                if (!val) {
                    this.init();
                }
            },
        },
        components: {
            labelButtons, labelItem,
            warehouse: require('@/api-components/warehouse.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            dataTable,
            selectRemote,
            selectMoreButton: require('@/view/entrepot/delivery/select-more-button').default,
            orderInput: require("@/components/order-input.vue").default
        }
    }
</script>
