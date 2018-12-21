<template>
    <page class="shipping-status">
        <el-form>
            <search-card @search="search"
                         :params="searchData"
                         :clears="clears">
                <div>
                    <label-buttons label="平台："
                                   :buttons="platformList"
                                   @select="select_platform"></label-buttons>
                    <label-item class="ml-xs mb-mini" label="站点："></label-item>
                    <el-select v-sf.site_id class="inline width-sm"
                               v-model="searchData.site_id"
                               @change="select_site" :disabled="siteDisabled" clearable>
                        <el-option v-for="(item, index) in siteOptions"
                                   :label="item.label"
                                   :key="index"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                    <label-item class="ml-xs mb-mini" label="账号简称："></label-item>
                    <el-select class="inline width-sm" @change="select_account"
                               v-sf.account_id v-model="searchData.account_id" :disabled="accountDisabled"
                               filterable clearable>
                        <el-option v-for="(item, index) in accoutOptions"
                                   :label="item.label"
                                   :key="index"
                                   :value="item.value"></el-option>
                    </el-select>
                </div>
                <div>

                    <label-buttons label="订单状态："
                                   :buttons="orderStatus"
                                   @select="selectOrderStatus"></label-buttons>
                    <label-buttons label="发货剩余时间："
                                   v-sf.order_status
                                   :buttons="timesList"
                                   @select="selectResidueTime"></label-buttons>
                    <label-item class="ml-xs mb-mini" label="同步状态："></label-item>
                    <el-checkbox-group class="inline"
                                       v-model="synchronize_status" @change="orderStatusChange">
                        <el-checkbox v-for="(item, index) in statusList" :label="item.label" :key="index">
                            {{item.label}}
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
                <el-select v-sf.snType v-model="searchData.snType" class="width-sm inline">
                    <el-option v-for="(item, index) in connds"
                               :label="item.label"
                               :value="item.value"
                               :key="index"></el-option>
                </el-select>
                <order-input class="inline width-super pt-sm"
                             v-sf.snText
                             v-model="searchData.snText"
                             v-if="searchData.snType==='number'||searchData.snType==='package_number'||searchData.snType==='shipping_number'||searchData.snType==='channel_order_number'"
                             @keydown="search"
                             placeholder="可批量搜索，Shift+回车换行..."></order-input>
                <el-input class="inline enter-result"
                          v-else v-sf.snText
                          v-model="searchData.snText"
                          :placeholder="`请输入${changeLabel}...`"></el-input>
                <label-item class="ml-xs mb-mini" label="目的地："></label-item>
                <el-select class="inline width-sm" v-sf.country_code
                           v-model="searchData.country_code"
                           filterable clearable>
                    <el-option v-for="(item, index) in countryList" :label="item.label" :value="item.value"
                               :key="index"></el-option>
                </el-select>
                <label-item label="上传Carrier：" class="ml-sm mb-mini">
                    <el-input class="inline enter-result" placeholder="请输入Carrier"  v-model="searchData.carrier"></el-input>
                </label-item>
                <label-item class="ml-xs" label="发货仓库："></label-item>
                <el-select class="inline" tag="ElSelect" v-sf.warehouse_id_arr
                           v-model="searchData.warehouse_id_arr"
                           multiple clearable>
                    <el-option v-for="(item, index) in warehouseList" :label="item.label" :value="item.value"
                               :key="index"></el-option>
                </el-select>
                <label-item class="ml-xs" label="付款时间："></label-item>
                <el-date-picker class="inline date" v-sf.date_b v-model="searchData.date_b" placeholder="开始时间"
                                :picker-options="inputTimeStart"></el-date-picker>
                <span>--</span>
                <el-date-picker class="inline date mr-sm" v-sf.date_e v-model="searchData.date_e" placeholder="结束时间"
                                :picker-options="inputTimeEnd"></el-date-picker>
            </search-card>
        </el-form>
        <table-list  @left-show-change="left_show_change"
                :table-list="tableList"
                    :tablePg="tablePg"
                    :loading="loading"
                    :where="where"
                    :channel="platformList"
                    ref="tableList"
                    @checked-all="checked_all"
                    @current-change="current_change"
                    @overlook="init"
                    @syn_start="init"
                    @node-click="tree_node_click"
                    @all_tree-click="all_tree"
                    @title-click="clear_transport"
                    :tree-data="treeData"
                    :shipping-loading="shippingLoading"
                    :treeCount="treeCount"
                    :isFirst="isFirst"
                    @size-change="size_change"></table-list>
    </page>
</template>

<style lang="stylus">
    .shipping-status {
        .el-form-item {
            margin-bottom: 0;
        }

        .inline {
            vertical-align: inherit;
        }
        .el-form-label-warehouse > label {
            margin-top: 5px;
        }

        .el-tree-node__label {
            font-size: 1.2rem;
        }
        .el-card {
            overflow: inherit;
            .el-card__header {
                box-sizing: border-box;
                display: inline-block;
                color: #333;
                width: 100%;
                height: 32px;
                padding: 0 5px;
                line-height: 32px;
                font-size: 1.2rem;
                background: #6495ed;
                border: 1px solid #6495ed;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
                border-bottom: 1px solid transparent;
            }
            .el-card__body{
                .el-checkbox-group{
                    .el-checkbox + .el-checkbox{
                        margin-left :5px!important;
                    }
                    label.el-checkbox{
                        .el-checkbox__label{
                            padding-left: 0!important
                        }
                    }

                }

            }
        }
        .el-select__tags {
            height: 30px !important;
            width: 208px;
            overflow-y: auto;
            overflow-x: hidden;
            > span {
                white-space: inherit;
            }
        }
        .el-tree {
            border: none;
            height: 600px;
            overflow-y: auto;
        }

        .el-select, .el-input, .c-label-buttons, .el-checkbox-group {
            display: inline-block;
        }
        .pt-sm {
            top: 8px;
        }
    }
</style>
<script>
    import {
        api_synchronize_list,
        api_shipping,
        api_surplus,
        api_order_status,
        api_get_country,
        api_synchronize_status,
        api_get_warehouse,
        url_get_warehouse,
        url_status,
        url_surplus,
        url_get_country,
        url_synchronize_list,
        url_shipping
    } from '../../../api/shipping-status'
    import {
        api_get_channel_categories,
        url_get_channel_categories,
        api_orders_channel,
        url_orders_channel
    } from '../../../api/categories';
    import {api_status_list, api_account_list, url_account_list} from '../../../api/order-local';

    export default {
        permission: {
            url_get_channel_categories,
            url_status,
            url_surplus,
            url_account_list,
            url_get_country,
            url_get_warehouse,
            url_synchronize_list,
            url_shipping,
            url_orders_channel
        },
        refresh() {
            this.get_order_count();
           // this.get_shipping();
            this.transportShow=true;
            this.init();
        },
        data() {
            return {
                isFirst: true,
                isBatch: false,
                snType: 'number',
                snText: '',
                snType2: 'number',
                snText2: '',
                connds2: [
                    {label: '订单号', value: 'number'},
                    {label: '包裹号', value: 'package_number'},
                    {label: '跟踪号', value: 'shipping_number'}
                ],
                batchText: '',
                searchData: {
                    snType: 'number',//类型
                    snText: '',//内容id
                    site_id: '',//站点
                    channel_id: '',//渠道id
                    account_id: '',//账号id
                    page: 1,//当前页
                    carrier:'',
                    pageSize: 50,//每页展示数
                    order_status: '983044',//订单状态
                    residue_time: '',//发货剩余时间
                    synchronize_status: 0,//同步状态
                    country_code: '',//国家code
                    warehouse_id_arr: [],
                    warehouse_id: '',//仓库id
                    date_b: (Date.now() - (15 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now(),
                    shipping_id: '',//运输方式id
                    carrier_id: '',//物流商id
                },
                clears: {
                    snType: 'number',//类型
                    snText: '',//内容id
                    site_id: '',//站点
                    channel_id: '',//渠道id
                    account_id: '',//账号id
                    page: 1,//当前页
                    carrier:'',
                    pageSize: 50,//每页展示数
                    order_status: this.order_status,//订单状态
                    residue_time: '',//发货剩余时间
                    synchronize_status: 0,//同步状态
                    country_code: '',//国家code
                    warehouse_id_arr: [],
                    warehouse_id: '',//仓库id
                    date_b: (Date.now() - (15 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now(),
                    shipping_id: '',//运输方式id
                    carrier_id: '',//物流商id
                },
                synchronize_status: ["未同步"],
                synchronize_status_id: [0],
                treeCount: 0,
                tableList: [],
                treeData: [],
                warehouse_id_arr: [],//仓库
                accountList: [],
                siteOptions: [],
                accoutOptions: [],
                loading: true,
                platformList: [],
                statusList: [],
                timesList: [],
                orderStatus: [],
                checkList: [],
                connds: [
                    {label: '订单号', value: 'number'},
                    {label: '平台订单号搜索', value: 'channel_order_number'},
                    {label: '包裹号', value: 'package_number'},
                    {label: '跟踪号', value: 'shipping_number'},
                    {label: 'sku', value: 'sku'},
                    {label: '产品名称', value: 'sku_name'},
                    {label: '买家邮箱', value: 'email'},
                    {label: '买家姓名', value: 'buyer'},
                    {label: '买家ebay账号', value: 'buyer_ebay'}
                ],
                countryList: [],
                warehouseList: [],
                tablePg: {
                    page: 1,
                    pageSize: 50,
                    count: 0,
                    allSelect: false,
                    disable: false,
                },
                siteDisabled: true,
                accountDisabled: true,
                where: [],
                checkedAll: false,
                isShowLeft: '隐藏邮寄方式',
                isShow: true,
                rightWidth: 20,
                order_status: '',
                inputTimeStart: {
                    disabledDate: (time) => {
                        if (this.searchData.date_e) {
                            return time.getTime() > this.searchData.date_e;
                        } else {
                            return false
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.date_b) {
                            return time.getTime() < this.searchData.date_b;
                        } else {
                            return false
                        }
                    }
                },//结束时间
                shippingLoading:false,
                transportShow:true
            }
        },
        mounted() {
           // this.get_shipping();
            this.transportShow=true;
            this.channel_remote();
            this.get_status_list();
            this.get_surplus();
            this.get_order_status();
            this.get_warehouse_remote();
            this.get_country()
            this.init();
        },
        methods: {
            open_search() {
                this.isBatch = !this.isBatch;
                if (!this.isBatch) {
                    this.clearSearch();
                    this.batchText = '';
                }
            },
            batch_search() {
                this.get_order_count();
                this.init();
            },
            init_params() {
                let data = window.clone(this.searchData);
                data.date_b = data.date_b ? datef('YYYY-MM-dd', data.date_b / 1000) : '';
                data.date_e = data.date_e ? datef('YYYY-MM-dd', data.date_e / 1000) : '';
                data.page = this.tablePg.page;
                data.pageSize = this.tablePg.pageSize;
                data.synchronize_status = this.synchronize_status_id.join('_');
                data.warehouse_id = this.searchData.warehouse_id_arr.join('_');
                delete data.warehouse_id_arr;
                let list = this.searchData.snText.replace(new RegExp(' ', 'gm'), '\n').split('\n').map(row => row.trim()).filter(row => !!row);
                if (list.length > 1) {
                    data.snText = list.map(row => row.trim());
                } else {
                    data.snText = data.snText.trim()
                }
                return data
            },
            init() {//初始化
                this.tableList = [];
                let data = this.init_params();
                this.where = data;
                this.loading = true;
                this.isFirst = true;
                this.$http(api_synchronize_list, data).then(res => {
                    this.isFirst = false;
                    this.tableList = res.data;
                    this.$nextTick(() => {
                        this.tableList.forEach(row => {
                            row.synchronize_shipping_time = row.synchronize_shipping_time === 0 ? new Date().getTime() : row.synchronize_shipping_time * 1000;
                            row.shipping_time = row.shipping_time === 0 ? new Date().getTime() : row.shipping_time * 1000;
                            if (this.checkedAll) {
                                this.$refs.tableList.set_status(row, this.checkedAll)
                            }
                            ;
                        })
                    });
                    this.tablePg.count = res.count;
                    this.loading = false;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            left_show_change(val){
                if(!val&&this.transportShow){
                    this.get_shipping();
                }
            },
            get_shipping() {//邮寄方式
                this.shippingLoading = true;
                let search = this.init_params();
                this.$http(api_shipping, search).then(res => {
                    let tree = [];
                    this.treeData = [];
                    this.treeCount = 0;
                    tree = Object.keys(res).map(key => res[key]);
                    tree.forEach(row => {
                        this.treeCount += row.count;
                        row.label = `${row.name}(${row.count})`;
                        row.children = row.shipping.map(child => {
                            return {
                                id: child.id,
                                label: `${child.name}(${child.count})`
                            }
                        });

                    });
                    this.treeData = tree;
                    this.shippingLoading = false;
                    this.transportShow=false;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            clear_transport(){
                this.searchData.carrier_id = '';
                this.searchData.shipping_id = '';
                this.init();
                this.transportShow=true;
            },
            channel_remote() {//获取平台
                this.$http(api_orders_channel).then(res => {
                    this.platformList = [{label: "全部", value: ''}, ...res];
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                })
            },
            get_site(channel_id) {
                this.siteOptions = [{label: "暂无数据", value: ""}];
                if (!channel_id) return;
                this.$http(api_account_list, {channel_id: channel_id}).then(res => {
                    res = res.site;
                    if (res.length > 0) {
                        this.siteOptions = [{label: "全部", value: ""}, ...res];
                    } else {
                        this.siteOptions = [{label: "暂无数据", value: ""}];
                    }
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                })
            },
            get_account(channel_id, site_code) {
                this.accoutOptions = [{label: "暂无数据", value: ""}];
                if (!channel_id) return;
                this.$http(api_account_list, {channel_id: channel_id, site_code: site_code}).then(res => {
                    res = res.account;
                    if (res.length > 0) {
                        this.accoutOptions = [{label: "全部", value: ""}, ...res];
                    } else {
                        this.accoutOptions = [{label: "暂无数据", value: ""}];
                    }
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                })
            },
            get_status_list() {
                this.statusList = [];
                this.$http(api_synchronize_status).then(res => {
                    this.statusList = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                })
            },
            get_surplus() {
                this.timesList = [];
                this.$http(api_surplus).then(res => {
                    this.timesList = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                })
            },
            get_order_count() {
                let data = this.init_params();
                delete data.order_status;
                this.$http(api_order_status, data).then(res => {
                    this.orderStatus.forEach(row => {
                        let item = res.find(i => {
                            return i.value === row.value;
                        });
                        row.count = item.quantity;
                    })
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                })
            },
            get_order_status() {
                let data = this.init_params();
                delete data.order_status;
                this.$http(api_order_status, data).then(res => {
                    this.orderStatus = res.map(row => {
                        return {
                            label: row.label,
                            value: row.value,
                            count: row.quantity
                        }
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                })
            },
            get_country() {
                this.countryList = [];
                this.$http(api_get_country).then(res => {
                    let arr = res.map(row => {
                        return {
                            label: row.country_en_name,
                            value: row.country_code
                        }
                    })
                    this.countryList = [{label: "全部", value: ""}, ...arr];
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            get_warehouse_remote() {
                this.warehouseList = [];
                this.$http(api_get_warehouse).then(res => {
                    this.warehouseList = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            is_show_left() {
                this.isShow = !this.isShow;
                this.isShowLeft = this.isShow ? '隐藏邮寄方式' : '显示邮寄方式';
                this.rightWidth = this.isShow ? 20 : 24;
            },
            search() {
                this.init();
                // this.get_shipping();
                this.transportShow=true;
                this.get_order_count();
            },
            clearSearch() {
                this.searchData.snType = 'number';
                this.searchData.snText = '';
                this.snText = '';
                this.searchData.site_id = '';
                this.searchData.account_id = '';
                this.searchData.synchronize_status = 0;
                this.searchData.country_code = '';
                this.searchData.warehouse_id = '';
                this.searchData.date_b = '';
                this.searchData.date_e = '';
                this.searchData.shipping_id = '';
                //this.synchronize_status_id = [];
                this.warehouse_id = [];
                this.init();
                // this.get_shipping()
                this.transportShow=true;
                this.get_order_count();
            },
            select_platform(index,item) {
                this.searchData.channel_id = item.value;
                this.get_site(this.searchData.channel_id);
                this.get_account(this.searchData.channel_id, this.searchData.site_id);
                this.siteDisabled = false;
                this.accountDisabled = false;
                this.init();
                this.get_order_count();
                // this.get_shipping();
                this.transportShow=true;
            },
            selectOrderStatus(index) {
                this.searchData.order_status = this.orderStatus[index].value;
                this.order_status = this.orderStatus[index].value;
                this.init();
                // this.get_shipping();
                this.transportShow=true;
            },
            selectResidueTime(index) {
                this.searchData.residue_time = this.timesList[index].value;
                this.init();
                this.get_order_count();
                // this.get_shipping();
            },
            select_site() {
                this.get_account(this.searchData.channel_id, this.searchData.site_id);
                this.init();
                this.get_order_count();
                // this.get_shipping();
            },
            select_account() {
                this.init();
                this.get_order_count();
                // this.get_shipping();
                this.transportShow=true;
            },
            current_change(val) {
                this.tablePg.page = val;
                this.init();
                // this.get_shipping();
                this.transportShow=true;
            },
            size_change(val) {
                this.tablePg.pageSize = val;
                this.init();
                // this.get_shipping();
            },
            checked_all(val) {
                this.checkedAll = val;
            },
            all_tree() {
                this.searchData.carrier_id = '';
                this.searchData.shipping_id = '';
                this.init();
                this.get_order_count();
            },
            tree_node_click(data) {
                this.searchData.carrier_id = '';
                this.searchData.shipping_id = '';
                if (data.children) {
                    this.searchData.carrier_id = data.id;
                } else {
                    this.searchData.shipping_id = data.id;
                }
                this.init();
                // this.get_order_count();
            },
            orderStatusChange(data) {
                if (data[data.length - 1] === "忽略") {
                    this.synchronize_status = ["忽略"]
                }
                if (data[data.length - 1] === "同步中") {
                    let find = this.synchronize_status.findIndex(res => {
                        return res === "同步成功"
                    });
                    if (find === -1) {
                        this.synchronize_status = ["同步中"];
                    } else {
                        this.synchronize_status = ["同步中", "同步成功"];
                    }
                }
                if (data[data.length - 1] === "同步成功") {
                    let find = this.synchronize_status.findIndex(res => {
                        return res === "同步中"
                    });
                    if (find === -1) {
                        this.synchronize_status = ["同步成功"];
                    } else {
                        this.synchronize_status = ["同步中", "同步成功"];
                    }
                }

                if (data[data.length-1]==="未同步"||data[data.length-1]==="同步失败"||data[data.length-1]==="跟踪号有更新"||data[data.length-1]==="已标记未同步跟踪号") {
                    this.synchronize_status.forEach((res, i) => {
                        if (res !== "未同步" && res !== "同步失败" && res !== "跟踪号有更新"&&res !== "已标记未同步跟踪号") {
                            this.synchronize_status.splice(i, 1);
                        }
                    })
                }
                let newObj = {};
                this.statusList.forEach(res => {
                    newObj[res.label] = res.value;
                });
                this.synchronize_status_id = [];
                this.synchronize_status.forEach(res => {
                    this.synchronize_status_id.push(newObj[res]);
                });
                // this.get_shipping();
                this.transportShow=true;
                this.init();
                this.get_order_count();

            }
        },
        computed: {
            changeLabel() {
                let find = this.connds.find(res => {
                    return res.value === this.searchData.snType;
                });
                if (!!find) {
                    return find.label;
                }
            }
        },
        props: {},
        components: {
            labelButtons: require('../../../components/label-buttons.vue').default,
            tableList: require('./table-list.vue').default,
            searchCard: require('../../../components/search-card.vue').default,
            orderInput: require('../../../components/order-input').default,
            labelItem: require('@/components/label-item').default,
        }
    }
</script>

