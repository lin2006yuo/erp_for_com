<template>
    <page style="" class="p-parcel-abnormalities">
        <div>
            <label-item label="请选择仓库：" class="mb-xs mt-sm">
                <el-select v-model="warehouse_id" @change="change_depot" class="inline width-sm">
                    <el-option v-for="(item, index) in warehouses" :key="index" :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </label-item>
        </div>
        <search-card :params="searchData" :clears="clear" @enter="table_create" @search="table_create"
                     @init-params="init_status_btn">
            <!--获取表格的处理状态-->
            <div class="mb-mini">
                <label-buttons
                        class="inline"
                        :buttons="buttons"
                        label="处理状态："
                        @select="select_status">
                </label-buttons>
                <label-buttons
                        label="异常原因："
                        @select="select_type"
                        :buttons="typeList"
                        :max="15"
                        class="ml-sm inline">
                </label-buttons>
            </div>
            <div class="mb-mini">
                <label-buttons label="处理措施："
                               v-if="searchData.status === 2"
                               :buttons="abnormalList"
                               class="inline"
                               @select="select_method">
                </label-buttons>
            </div>
            <label>面单号：</label>
            <order-input v-sf.shipping_number
                         ref="batchInput"
                         v-model="searchData.shipping_number"
                         class="inline width-super pt-sm"
                         @keydown="table_create"
                         placeholder="可批量搜索，Shift+回车换行...">
            </order-input>
            <label class="ml-sm">包裹号：</label>
            <order-input v-sf.number
                         v-model="searchData.number"
                         class="inline width-super pt-sm"
                         @keydown="table_create"
                         placeholder="可批量搜索，Shift+回车换行...">
            </order-input>
            <!--<el-input v-model="searchData.shipping_number" class="inline" @keyup.enter.native="table_create"
                      v-sf.shipping_number></el-input>-->
            <el-select v-model="searchData.identity" class="inline ml-sm width-xs"
                       v-sf.identity>
                <el-option v-for="(item, index) in selectMan"
                           :key="index"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
            <param-account
                    class="width-sm"
                    v-model="searchData.user_id"
                    :param="{data:{content:''}}"
                    :fix-url="true"
                    :fix-result="sale_fix_result"
                    type="warehouseUser"
                    placeholder="请选择/输入..."
                    url="get|user/warehouse/staffs">
            </param-account>
            <el-select v-model="searchData.time_type" class="inline" style="width: 100px;margin-left: 10px;"
                       v-sf.time_type>
                <el-option v-for="(item, index) in selectTime"
                           :key="index"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
            <el-date-picker
                    v-model="searchData.time_st"
                    align="right"
                    type="date"
                    v-sf.time_st
                    placeholder="开始时间"
                    :picker-options="inputTimeStart"
                    class="date inline">
            </el-date-picker>
            <label>--</label>
            <el-date-picker
                    v-model="searchData.time_nd"
                    align="right"
                    type="date"
                    v-sf.time_nd
                    placeholder="结束时间"
                    :picker-options="inputTimeEnd"
                    class="date inline mr-sm">
            </el-date-picker>
        </search-card>
        <div class="mt-xs ml-sm mb-xs" style="overflow: hidden">
            <div class="inline" style="flex:1">
                <request-button class="inline"
                                v-if="isBatchHandle"
                                v-for="item in batchButtons"
                                :key="item.value"
                                :disabled="canDeal"
                                :req-key="req_key(item)"
                                @click="batch_deal(item)">{{item.label}}
                </request-button>
            </div>
            <span class="fr mr-sm">
                <span>打印机：</span>
                <select-printer v-model="printer" class="inline width-lg"></select-printer>
            </span>
        </div>
        <!--表格-->
        <el-table
                v-resize="{height:40}"
                v-loading="loading"
                element-loading-text="拼命加载中"
                class="scroll-bar"
                highlight-current-row
                @selection-change="select"
                :data="tableData">
            <el-table-column
                    v-if="isBatchHandle"
                    width="30"
                    type="selection">
            </el-table-column>
            <el-table-column
                    width="180"
                    inline-template
                    label="面单号">
                <div>
                    <ui-tip :content="row.shipping_number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="包裹号"
                    width="180">
                <div>
                    <ui-tip :is-operate="true" :content="row.package_number"
                            @cur-click="parcel_information(row.package_number)" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="邮寄方式"
                    width="200">
                <div>
                    <ui-tip :content="row.shipping_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    width="100"
                    inline-template
                    label="重量(g)">
                <div>
                    <ui-tip :content="row.package_weight"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    width="100"
                    inline-template
                    label="预估重量(g)">
                <div>
                    <ui-tip :content="row.estimated_weight" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="异常原因">
                <div>
                    <ui-tip :content="row.exception_type" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    v-if="searchData.status !== 1"
                    width="100"
                    inline-template
                    label="处理措施">
                <div>
                    <ui-tip :content="row.method_txt" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="集包人">
                <div>
                    <ui-tip :content="row.creator" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="集包时间">
                <div>
                    <ui-tip :content="row.create_time | filterTime" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="处理人">
                <div>
                    <ui-tip :content="row.handler" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="处理时间">
                <div>
                    <ui-tip :content="row.handle_time | filterTime" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="操作">
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

        <set-weight :table-data="selected" v-model="weightVisible"
                    @set-weight="set_weight"
                    @parcel-information="parcel_information"></set-weight>
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
                :order="order"
                @view-order="view_order"
        ></parcel-information>
    </page>
</template>

<style lang="stylus">
    .p-parcel-abnormalities {
        .el-card {
            overflow: visible;
        }
    }

    .text {
        margin-left: 25px;
    }

    .searchCard {
        border: 1px solid #797979;
        margin-top: 10px;
        padding-left: 25px;
        padding-top: 13px;
    }

    .selectPro {
        margin-top: 27px;
        margin-bottom: 25px;
    }
</style>

<script>
    //    引入调接口地址
    import {
        entrepot_picking,
        api_package_collection,
        api_status_change,
        api_message_deal,
        api_batch_reset,
        api_batch_cancel,
        api_batch_self,
        api_set_weight,
        api_problem_type,
        api_problem_method,
    } from '../../../api/parcel-abnormalities';
    import {api_print_package} from '../../../api/package-handling'
    import {api_get_package, url_package} from '../../../api/shipment'
    import {mapGetters, mapActions} from 'vuex';

    export default {//vue实例
        page() {
        },
        refresh() {
            this.table_create();
        },
        permission: {
            url_package
        },
        data() {//实例数据，ps:返回一个对象
            return {
                mdfid: '',
                mdfValue: false,
                mdfTitle: '',
                loading: false,
                selectTime: [{value: 1, label: '集包时间'}, {value: 2, label: '处理时间'}],
                selectMan: [{value: 1, label: '集包人'}, {value: 2, label: '处理人'}],
                buttons: [],
                typeList: [{label: '全部', value: 0}],
                warehouse_id: 2,
                searchData: {
                    identity: 1,
                    shipping_number: '',
                    number: '',
                    creator: '',
                    time_st: '',
                    time_nd: '',
                    user_id: '',
                    user_name: '',
                    status: 1,
                    page: 1,
                    pageSize: 50,
                    time_type: 1,
                    exception_type: '',
                    method: '',
                },
                clear: {
                    identity: 1,
                    status: 1,
                    page: 1,
                    pageSize: 50,
                    time_type: 1,
                },
                warehouses: [],
                inputTimeStart: {
                    disabledDate: (time) => {
                        if (this.searchData.time_nd) {
                            return time.getTime() > this.searchData.time_nd;
                        } else {
                            return false
                        }
                    }
                },
                inputTimeEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.time_st) {
                            return time.getTime() < this.searchData.time_st;
                        } else {
                            return false
                        }
                    }
                },
                tableData: [],
                total: 0,
                printer: '',
                token: '',
                numberList: [],
                selected: [],
                print_height: '',
                print_width: '',
                informationVisble: false,
                order: {},
                isShow: false,
                weightVisible: false,
                abnormalList: [{label: '全部', value: ''}],
            }
        },
        filters: {//过滤器
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
        },
        methods: {//实例方法
            get_problem_method(data) {// 根据异常原因获取处理措施方法
                this.$http(api_problem_method, data).then(res => {
                    this.abnormalList = [{label: '全部', value: ''}];
                    if (res.length === 1) {
                        this.abnormalList = res;
                    } else {
                        this.abnormalList = this.abnormalList.concat(res);
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            get_abnormal_buttons() {// 获取异常原因按钮
                this.$http(api_problem_type).then(res => {
                    res.map(item => {
                        this.typeList.push(item);
                    })
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
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
            init_status_btn() {
                let cur = this.buttons;
                let cur2 = this.typeList;
                let cur3 = this.abnormalList;
                this.buttons = [];
                this.typeList = [];
                this.abnormalList = [];
                this.$nextTick(() => {
                    this.buttons = cur;
                    this.typeList = cur2;
                    this.abnormalList = cur3;
                });
            },
            select_status(val, item) {
                this.searchData.status = item.value;
                this.table_create();
            },
            page_create() {
                this.$http(entrepot_picking).then(res => {
                    this.warehouses = res.map(item => {
                        return {label: item.name, value: item.id};
                    });
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
//表格调接口
            table_create() {
                this.loading = true;
                let data = this.generate_params(this.searchData);
                this.$http(api_package_collection, data).then(res => {
                    this.tableData = res.list;
                    this.total = res.count;
                    this.loading = false;
                }).catch(code => {
                    //请求失败
                    this.$message({type: "error", message: code.message || code});
                })
            },
            generate_params(searchData) {
//                深度克隆，a与b值改变之后没有关联
                let data = window.clone(searchData);
                if (searchData.time_st) {
//                    datef日期处理函数，把后面的参数转化为前面的样式
                    data.time_st = datef('YYYY-MM-dd', searchData.time_st / 1000);
                } else {
                    data.time_st = '';
                }

                if (searchData.time_nd) {
                    data.time_nd = datef('YYYY-MM-dd', searchData.time_nd / 1000);
                } else {
                    data.time_nd = '';
                }
                Object.assign(data, {warehouse_id: this.warehouse_id});
                if (data.shipping_number) {// 批量搜索条件数组化
                    data.shipping_number = data.shipping_number.split('\n').filter(row => !!row).map(row => row.trim());
                } else {
                    data.shipping_number = '';
                }
                if (data.number) {// 批量搜索条件数组化
                    data.number = data.number.split('\n').filter(row => !!row).map(row => row.trim());
                } else {
                    data.number = '';
                }
                return data;
            },
            status_change() {
                this.$http(api_status_change).then(res => {
                    this.buttons = res;
                })
            },

            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.table_create();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.table_create();
            },
            select_type(index, item) {
                this.searchData.method = '';
                this.searchData.exception_type = item.value;
                this.get_problem_method({type: item.value});
                this.table_create();
            },
            select_method(index, item) {
                this.searchData.method = item.value;
                this.table_create();
            },
            ...mapActions({
                set_printerList: 'api/set_printerList'
            }),
            print(row) {
                let type = [];
                let content = '';
                let coordinate = [];
                let numberList = [];
                let direction = 1;
                let watermark = [];
                this.$http(api_print_package, row.package_id).then(res => {
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
                    let data = {
                        Type: type,
                        Token: this.token,
                        watermark: watermark,
                        coordinate: coordinate,
                        Width: 100,
                        Height: 100,
                        url: config.apiHost + res.callback,
                        PrintName: this.printer,
                        NumberList: numberList,
                        content: content,
                        Direction: direction === 1 ? 'vertical' : 'transverse'
                    };
                    this.$printer(this.printer, data);
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            sale_fix_result(res) {
                return res.map(row => {
                    return {
                        value: row.id,
                        label: row.realname
                    }
                })
            },
            select(selected) {
                this.selected = selected;
            },
            batch_deal(item) {
                switch (item.value) {
                    case 1:
                        this.package_delete();
                        return;
                    case 2:
                        this.weightVisible = true;
                        this.$reqKey('setEstimatedWeight', false);
                        return;
                    case 3:
                        this.package_restart();
                        return;
                    case 8:
                        this.package_self();
                        return;
                }
            },
            req_key(item) {
                switch (item.value) {
                    case 1:
                        return 'deletePackage';
                    case 2:
                        return 'setEstimatedWeight';
                    case 3:
                        return 'restartPackage';
                    case 8:
                        return 'selfPackage';
                }
            },
            package_restart() {
                this.$confirm(`所勾选包裹将被处理为：重新集包，确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let id = this.selected.map(row => {
                        return row.package_id;
                    });
                    this.$http(api_batch_reset, {ids: id}).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.handle_current_change(1);
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('restartPackage', false);
                        }, 200);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                    this.$reqKey('restartPackage', false);
                });
            },
            package_delete() {
                this.$confirm(`所勾选包裹将被处理为：重返上架，确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let id = this.selected.map(row => {
                        return row.package_id;
                    });
                    this.$http(api_batch_cancel, {ids: id}).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.handle_current_change(1);
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('deletePackage', false);
                        }, 200);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                    this.$reqKey('deletePackage', false)
                });
            },
            package_self() {
                this.$confirm(`所勾选包裹将被处理为：发货，确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let id = this.selected.map(row => {
                        return row.package_id;
                    });
                    this.$http(api_batch_self, {id: id}).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.handle_current_change(1);
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('selfPackage', false);
                        }, 200);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                    this.$reqKey('selfPackage', false);
                });
            },
            set_weight(params) {
                this.$http(api_set_weight, params).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.weightVisible = false;
                    this.handle_current_change(1);
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    console.log(1)
                    setTimeout(() => {
                        this.$reqKey('setWeight', false);
                    }, 300)
                })
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
            change_depot() {
                this.table_create();
            }
        },
        computed: {//实例计算属性
            canDeal() {
                return this.selected.length <= 0;
            },
            isBatchHandle() {
                switch (this.searchData.exception_type) {
                    case 2:
                    case 5:
                    case 7:
                    case 8:
                        return true;
                }
                return false;
            },
            batchButtons() {
                let buttons = clone(this.abnormalList);
                if (buttons.length === 1) {
                    return buttons;
                } else {
                    if(this.searchData.exception_type !== 5) {
                        return buttons.slice(1);
                    } else {
                        let index = buttons.findIndex(row => row.value === 3);
                        return buttons.slice(index, index + 1);
                    }
                }
            }
        },
        watch: {//监控数据变化

        },
        props: {//本组件属性列表

        },
        created() {
            this.page_create();
            this.table_create();
            this.status_change();
            this.get_abnormal_buttons();
            this.get_problem_method();
        },
        components: {//实例引用的外部组件
            setWeight: require('./set-weight.vue').default,
            labelButtons: require('../../../components/label-buttons.vue').default,
            uiTip: require('../../../components/ui-tip.vue').default,
            searchCard: require('../../../components/search-card.vue').default,
            selectPrinter: require('../../../components/select-printer').default,
            scrollSelect: require('../../../components/scroll-select.vue').default,
            paramAccount: require('../../../api-components/param-account').default,
            parcelInformation: require('../placeorder/parcel-information').default,
            formMdf: require("../../order/local/form-mdf.vue").default,
            labelItem: require('../../../components/label-item.vue').default,
            orderInput: require("@/components/order-input.vue").default,
        }
    }
</script>
