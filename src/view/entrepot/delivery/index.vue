<template>
    <page class="p-index">
        <label-item label="请选择仓库：" class="mb-xs mt-sm">
            <el-select v-model="warehouse_id" @change="change_depot" class="inline width-sm">
                <el-option
                        :key="item.value"
                        v-for="item in warehouses"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <page-header
                ref="search"
                :channels="channel"
                @change-channel="change_channel"
                @change-account="change_account"
                :acount-data="acountData"
                :package-types="packageTypes"
                :stock="stock"
                @clear="clear"
                @change-stock="change_stock"
                @change-package="change_package"
                :dataChecked="dataChecked"
                @init-status-btn="init_status_btn"
                @search-list="search"
        ></page-header>

        <wait-picking :tableData="tableData"
                      :tablepargm="tablepargm"
                      :tableDepot="tableDepot"
                      :warehouses="warehouses"
                      @left-span="leftSpan = $event"
                      @reload="request_list"
                      @size-change="size_change"
                      @back-rule-before="back_rule_before"
                      @current-change="current_change"
                      @distribution="distribution"
                      @change-todepot="change_todepot"
                      @left-show-change="left_show_change"
                      :selectChange="selectChange"
                      :transport-loading="transportLoading"
                      @cancel="cancel"
                      @depot-change="depot_change"
                      :loading="loading"
                      :dataLength="transportData.label"
                      :transport-data="transportData.children"
                      @node-click="click_tree"
                      @title-click="clearTransport"
        >
        </wait-picking>
    </page>
</template>
<style lang="stylus">
    .p-index {
        .pick {
            font-size: 1.25rem;
            line-height: 30px;
            text-align: center;

        }
    }
</style>
<script>
    import pageHeader from './header.vue'
    import transport from './transport.vue'
    import labelItem from '@/components/label-item.vue'
    import {api_get_packType} from '@/api/entrepot-picking'
    import {
        entrepot_picking,
        entrepot_getcount,
        api_get_delivery,
        entrepot_select,
        entrepot_depot,
        api_get_shipping_methods,
        api_get_channels,
        api_get_accounts,
        api_get_status_count,
        api_back_rule
    } from '@/api/entrepot-picking'

    export default {
        page: {},
        refresh() {
            this.$refs.search.search_list();
            this.init_package_type();
            this.request_channels();
            this.request_account();
            this.request_status_count();
        },
        data() {
            return {
                loading: false,
                warehouse_id: 2,
                shipping_id: 0,
                carrierr_id: 0,
                channel_id: 0,
                stock_id: "0",
                treeopen: false,
                account: 0,
                leftSpan: 4,
                tablepargm: {
                    page: 1,
                    pageSize: 50,
                    count: 0,
                    allSelect: false,
                    disable: false,
                },
                tableData: [],
                dataChecked: {
                    acountSelect: "",
                    checked: false,
                    starDay: "",
                    endDay: "",
                    condition: "condition"
                },
                warehouses: [],
                tableDepot: [],
                channel: [],
                stock: [],
                acountData: [],
                packageType: [],
                transportData: {label: '', children: []},
                selectChange: [],
                snType: '',
                snText: '',
                seller_id: '',
                packageTypes: [],
                isCleared: false,
                transportLoading: false,
                transportShow: true,
            }
        },
        mounted() { //初始化
            this.init();
        },
        methods: {
            //初始化仓库
            init() {
                this.$http(entrepot_picking).then(res => {
                    this.warehouses = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                    this.transportShow = true;
                    this.reflash_first();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                })
            },
            clear() {
                this.isCleared = true;
            },
            reflash_first() {
                this.$nextTick(() => {
                    this.change_depot()
                });

            },
            //选择平台时  获取数据
            change_channel(channel) {
                this.dataChecked.acountSelect = "";
                this.channel_id = channel.value;
                this.transportShow = true;
                this.request_account();
                this.request_status_count();
                this.init_package_type();
                this.request_list();
            },
            change_stock(select) { //点击库存状态
                this.stock_id = this.stock[select].value;
                this.transportShow = true;
                this.init_package_type();
                this.request_list();
            },
            //获取包裹类型和count
            init_package_type() {
                if (!!this.warehouse_id && this.channel.length > 0 && this.stock.length > 0) {
                    let data = {
                        channel_id: this.channel_id,
                        warehouse_id: this.warehouse_id,
                        account: this.account,
                        stock_id: this.stock_id
                    };
                    this.$http(api_get_packType, data).then(res => {
                        this.packageTypes = res;
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    })
                }
            },
            change_package(select) {  //改变包裹类型
                this.packageType = select;
                this.transportShow = true;
                this.request_list();
            },
            change_account(account) {
                this.account = account;
                this.request_status_count();
                this.transportShow = true;
                this.init_package_type();
                this.request_list();
            },
            search({accounts, date, cond, seller_id}) {
                this.snType = cond.key;
                this.snText = cond.val;
                this.account = accounts;
                this.seller_id = seller_id;
                this.search_list();
            },
            request_shipping_method() {
                if (!!this.warehouse_id && this.channel.length > 0 && this.stock.length > 0 && this.packageTypes.length > 0) {
                    let params = {
                        warehouse_id: this.warehouse_id,
                        channel_id: this.channel_id,
                        stock_id: this.stock_id,
                    };
                    if (this.packageType) {
                        params.package_types = this.packageType;
                    }
                    if (this.account) {
                        params.channel_account_id = this.account;
                    }
                    this.transportLoading = true;
                    this.$http(api_get_shipping_methods, params).then(res => {
                        let treeobj = {};
                        this.transportData.label = this.warehousename + "(" + res.tatol + ")";
                        if (res.list) {
                            this.transportData.children = Object.values(res.list).map(function (item) {
                                return {
                                    id: item.id || 0,
                                    label: item.name === "" ? "" : item.name + "(" + item.count + ")",
                                    type: 'carrierr',
                                    children: item.shippings.map(row => {
                                        return {
                                            id: row.id,
                                            type: 'shipping',
                                            label: `${row.name}(${row.count})`
                                        }
                                    })
                                }
                            })
                        }
                        this.transportShow = false;
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

            request_channels() {
                let params = {
                    warehouse_id: this.warehouse_id,
                };
                this.$http(api_get_channels, params).then(res => {
                    this.channel = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                })
            },
            request_status_count() {
                if (!!this.warehouse_id && this.channel.length > 0) {
                    let params = {
                        warehouse_id: this.warehouse_id,
                        channel_account_id: this.account,
                        channel_id: this.channel_id,
                    };
                    this.$http(api_get_status_count, params).then(res => {
                        this.stock = res;
                    }).catch(code => {

                    });
                }
            },
            request_account() {
                if (this.channel_id <= 0) {
                    return;
                }
                let params = {
                    warehouse_id: this.warehouse_id,
                    channel_id: this.channel_id,
                };
                this.$http(api_get_accounts, params).then(res => {
                    this.acountData = res;
                    this.acountData.forEach((row, index) => {
                        if (index < 10) {
                            this.$set(row, 'showSearch', true);
                        } else {
                            this.$set(row, 'showSearch', false);
                        }
                        this.$set(row, 'showDialog', true);
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            search_list() {
                this.transportShow = true;
                this.request_list();
            },
            //改变仓库 调取接口
            change_depot() {
                this.transportShow = true;
                this.request_channels();
                this.init_package_type();
                this.request_status_count();
                this.$refs.search.search_list();
            },
            request_list() {
                //warehouse_id  channel.length>0 stock.length>0  packageTypes.length>0
                if (!!this.warehouse_id && this.channel.length > 0 && this.stock.length > 0 && this.packageTypes.length > 0) {
                    this.loading = true;
                    this.$http(api_get_delivery, this.condition).then(res => {
                        this.loading = false;
                        this.tableData = res.data.map(item => {
                            let findChange = this.selectChange.find((change) => {
                                return change.id === item.id;
                            });
                            if (findChange) {
                                item.showRed = true;
                                item.ware_house_name2 = findChange.label;
                                item.shipping_name2 = "待执行订单自动规则";
                            }
                            return item;
                        });
                        this.tablepargm.count = res.count;

                    }).catch(code => {
                        this.loading = false;
                        this.$message({type: "error", message: code.message || code});
                    })
                }
            },
            size_change(val) {  //修改页数 进行数据请求
                this.tablepargm.pageSize = val;
                this.request_list()
            },
            current_change(val) {  //跳转页
                this.tablepargm.page = val;
                this.request_list();
            },
            clearTransport() {
                this.carrierr_id = 0;
                this.shipping_id = 0;
                this.request_list();
            },
            //点击树形
            click_tree(node) {
                this.carrierr_id = 0;
                this.shipping_id = 0;
                if (!node.length) {
                    switch (node.type) {
                        case 'carrierr':
                            this.carrierr_id = node.id;
                            break;
                        case 'shipping':
                            this.shipping_id = [node.id];
                            break;
                        default:
                            break;
                    }
                } else {
                    this.shipping_id = node;
                }
                this.request_list();
            },
            //分配
            distribution(val) {
                if (val === "") {
                    this.$message({type: 'error', message: '请选择数据！'});
                } else if (val === "all") {
                    let starDay = "", endDay = "";
                    if (this.dataChecked.starDay) {
                        starDay = datef('YYYY-MM-dd', this.dataChecked.starDay / 1000);
                    }
                    if (this.dataChecked.endDay) {
                        endDay = datef('YYYY-MM-dd', this.dataChecked.endDay / 1000);
                    }
                    let params = {
                        select: true,
                        warehouse_id: this.warehouse_id,
                        shipping_id: this.shipping_id,
                        carrierr_id: this.carrierr_id,
                        channel_account_id: this.account,
                        channel_id: this.channel_id,
                        stime: starDay,
                        etime: endDay,
                        package_types: this.packageType,
                        stock_id: this.stock_id,
                        snText: this.snText,
                        snType: this.snType,
                    };
                    this.$http(entrepot_select, params).then(res => {
                        this.$nextTick(() => {
                            this.search_list()
                        });
                        this.$message({
                            type: 'success',
                            message: res.message,
                            duration: 4000
                        });
                    }).catch(code => {
                        this.$message({type: "error", message: `${code.message}` || code});
                    })
                } else {
                    this.$http(entrepot_select, {ids: val, warehouse_id: this.warehouse_id}).then(res => {
                        this.$nextTick(() => {
                            this.search_list(this.shipping_id, true)
                        });
                        this.$message({
                            type: 'success',
                            message: res.message,
                            duration: 4000
                        });
                    }).catch(code => {
                        this.$message({type: "error", message: `${code.message}` || code});
                    })
                }

            },
            back_rule_before(select) {
                if (select === "") {
                    this.$message({type: 'error', message: '请选择数据！'});
                } else if (select === "all") {
                    let starDay = "", endDay = "";
                    if (this.dataChecked.starDay) {
                        starDay = datef('YYYY-MM-dd', this.dataChecked.starDay / 1000);
                    }
                    if (this.dataChecked.endDay) {
                        endDay = datef('YYYY-MM-dd', this.dataChecked.endDay / 1000);
                    }
                    let params = {
                        select: true,
                        warehouse_id: this.warehouse_id,
                        shipping_id: this.shipping_id,
                        carrierr_id: this.carrierr_id,
                        channel_account_id: this.account,
                        channel_id: this.channel_id,
                        stime: starDay,
                        etime: endDay,
                        package_types: this.packageType,
                        stock_id: this.stock_id,
                        snText: this.snText,
                        snType: this.snType,
                    };
                    this.$http(api_back_rule, params).then(res => {
                        this.$nextTick(() => {
                            this.search_list()
                        });
                        this.$message({
                            type: 'success',
                            message: '退回成功',
                            duration: 4000
                        });
                    }).catch(code => {
                        this.$message({type: "error", message: `${code.message}` || code});
                    })
                } else {
                    this.$http(api_back_rule, {ids: select}).then(res => {
                        this.$nextTick(() => {
                            this.search_list()
                        });
                        this.$message({
                            type: 'success',
                            message: '退回成功',
                            duration: 4000
                        });
                    }).catch(code => {
                        this.$message({type: "error", message: `${code.message}` || code});
                    })
                }
            },
            //lsit更改仓库
            change_todepot(changes) {
                this.$nextTick(() => {
                    this.tableData = this.tableData.map(table => {
                        let find = null;
                        if (find = changes.find((val) => val.id === table.id)) {
                            table.showRed = true;
                            table.ware_house_name2 = find.label;
                            table.shipping_name2 = "待执行订单自动规则";
                        } else {
                            delete table['showRed']
                            delete table['ware_house_name2']
                            delete table['shipping_name2']
                        }
                        return table
                    })
                });
                this.selectChange = changes;
            },
            // list 取消
            cancel() {
                this.selectChange = [];
                this.search_list()
            },
            //list更改仓库接口
            depot_change() {
                let changes = this.selectChange.map(item => {
                    return {
                        id: item.id,
                        warehouse_id: item.value
                    };
                });
                this.$http(entrepot_depot, {changes}).then(res => {
                    this.search_list();
                    this.$message({
                        type: 'success',
                        message: '更改仓库成功',
                        duration: 4000
                    });
                    this.selectChange = [];
                }).catch(code => {
                    this.$message({type: "error", message: `${code.message}` || code});
                })
            },
            init_status_btn() {
                let packageTypesBtn = this.packageTypes;
                let cur = this.channel;
                let cur2 = this.stock;
                let cur3 = this.acountData;
                this.packageTypes = [];
                this.channel = [];
                this.stock = [];
                this.acountData = [];
                this.$nextTick(() => {
                    this.packageTypes = packageTypesBtn;
                    this.channel = cur;
                    this.stock = cur2;
                    this.acountData = cur3;
                });
            },
            left_show_change(val) {
                if(!val && this.transportShow) {
                    this.request_shipping_method();
                }
            },
        },
        computed: {
            rightSpan() {
                return 24 - this.leftSpan;
            },
            warehousename() {
                let warehouse_id = this.warehouses.find(row => row.value === this.warehouse_id)
                if (warehouse_id) {
                    return warehouse_id.label;
                } else {
                    return '';
                }
            },
            condition() {
                let starDay = "", endDay = "";
                if (this.dataChecked.starDay) {
                    starDay = datef('YYYY-MM-dd', this.dataChecked.starDay / 1000);
                }
                if (this.dataChecked.endDay) {
                    endDay = datef('YYYY-MM-dd', this.dataChecked.endDay / 1000);
                }
                if (this.isCleared) {
                    this.tablepargm.page = 1;
                    this.tablepargm.pageSize = 50;
                    this.isCleared = false;
                }
                return {
                    warehouse_id: this.warehouse_id,
                    shipping_id: this.shipping_id,
                    carrierr_id: this.carrierr_id,
                    page: this.tablepargm.page,
                    pageSize: this.tablepargm.pageSize,
                    channel_account_id: this.account,
                    channel_id: this.channel_id,
                    stime: starDay,
                    etime: endDay,
                    package_types: this.packageType,
                    stock_id: this.stock_id,
                    snText: this.snText,
                    snType: this.snType,
                    seller_id: this.seller_id
                };
            }
        },
        components: {
            pageHeader,
            labelItem,
            transport,
            waitPicking: require('./wait-picking.vue').default,
        }
    }
</script>
