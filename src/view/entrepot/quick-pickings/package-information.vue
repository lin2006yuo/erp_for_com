<template>
    <div class="package-information">
        <search-card @search="search" :params="searchData" :clears="clears" class="enter-result"
                     style="overflow:inherit;">
            <label-item label="" class="ml-sm">
                <el-select v-model="searchData.snType"
                           class="width-xs"
                           v-sf.snType>
                    <el-option
                            v-for="res in snTypeList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item label="">
                <!-- <el-input class="width-super" v-model="searchData.snText" :placeholder="`请输入${changeLabel}...`" v-sf.snText></el-input> -->
                <order-input class="width-super"
                             v-model="searchData.snText"
                             @keydown="search"
                             v-sf.snText></order-input>
            </label-item>
            <!-- <label-item label="包裹号：" class="ml-sm">
                <order-input v-model="searchData.number" v-sf.number></order-input>
            </label-item> -->
            <label-item label="拣货单包裹状态：" class="ml-sm mr-sm">
                <el-select v-model="searchData.status" v-sf.status class="width-sm">
                    <el-option v-for="(item, index) in statusList"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
        </search-card>
        <el-button type="primary" size="mini" @click="batch_remove" class="mt-xs ml-sm"
                   :disabled="selected.length <= 0">批量移除
        </el-button>
        <el-table :data="packageData"
                  v-loading="loading"
                  v-resize="{height:40}"
                  @selection-change="select"
                  class="scroll-bar mt-xs"
                  element-loading-text="玩命加载中"
                  highlightCurrentRow>
            <el-table-column
                    type="selection"
                    width="35">
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="120"
                    label="包裹号">
                <div :class="[isAbnormal(row.abnormal), isDiscard(row.package_status)]">
                    <ui-tip :is-operate="true" :content="row.number" :width="98"
                            @cur-click="parcel_information(row.number)"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="120"
                    label="运单号">
                <div :class="[isAbnormal(row.abnormal), isDiscard(row.package_status)]">
                    <ui-tip :content="row.shipping_number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="120"
                    label="配货时间">
                <div :class="[isAbnormal(row.abnormal), isDiscard(row.package_status)]">
                    <ui-tip v-if="row.distribution_time" :content="row.distribution_time|fmsdatetime"
                            :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="120"
                    label="物流方式">
                <div :class="[isAbnormal(row.abnormal), isDiscard(row.package_status)]">
                    <ui-tip :content="row.shipping_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="120"
                    label="渠道/账号信息">
                <div :class="[isAbnormal(row.abnormal), isDiscard(row.package_status)]">
                    <ui-tip :content="`${row.channel}/${row.channel_account}`" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="100"
                    label="包裹订单状态">
                <div :class="[isAbnormal(row.abnormal), isDiscard(row.package_status)]">
                    <ui-tip :content="row.order_status" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="100"
                    label="拣货单号">
                <div :class="[isAbnormal(row.abnormal), isDiscard(row.package_status)]">
                    <ui-tip :content="row.picking_number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="100"
                    label="拣货单包裹状态">
                <div :class="[isAbnormal(row.abnormal), isDiscard(row.package_status)]">
                    <ui-tip :content="row.picking_status" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <!-- <el-table-column
                inline-template
                width="100"
                label="操作">
                <div>
                    <span class="operate" @click="remove(row)">移除</span>
                </div>
            </el-table-column> -->
            <el-table-column
                    label="操作"
                    inline-template
                    width="120">
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
                @close-parcel="close_parcel"
                @view-order="view_order"
                v-model="informationVisble"
                :order="order"
        ></parcel-information>
    </div>
</template>
<style lang="stylus">
    .package-information {
        .el-card {
            overflow: inherit;
        }
        .scroll-bar {
            .abnormal > .p-ui-tip > a {
                color: red;
                &.cur-operate {
                    color: red !important;
                }
            }
            .cancel_pink > .p-ui-tip > a {
                color: #a63cd4 !important;
                &.cur-operate {
                    color: #a63cd4 !important;
                }
            }
        }
    }
</style>
<script>
    import {
        api_quick_package,
        api_get_packages_status,
        api_remove_package,
        url_post_print,
        api_post_print,
        url_remove_package
    } from '@/api/pickings'
    import {api_get_package, url_package} from '@/api/shipment'
    import {api_get_pdf, url_get_pdf} from '@/api/pickings';

    export default {
        permission: {
            url_package,
            url_get_pdf
        },
        data() {
            return {
                abnormal: 'abnormal',   // 异常
                package_status: 4294967295, // 作废
                loading: false,
                statusList: [],
                searchData: {
                    status: '',
                    warehouse_id: 2,
                    page: 1,
                    pageSize: 20,
                    snText: '',
                    snType: 'number',
                },
                clears: {
                    warehouse_id: 2,
                    page: 1,
                    pageSize: 20,
                    snType: 'number',
                },
                packageData: [],
                total: 0,
                informationVisble: false,
                order: {},
                selected: [],
                mdfid: '',
                mdfValue: false,
                mdfTitle: '',
                isShow: false,
                snTypeList: [
                    {label: "SKU", value: "sku"},
                    {label: "包裹号", value: "number"},
                ],
            }
        },
        mounted() {
            this.search();
            this.init_statusList();
        },
        methods: {
            isAbnormal(abnormal) {       //添加样式
                return abnormal ? this.abnormal : '';
            },
            isDiscard(package_status) {      //添加样式
                return package_status === this.package_status ? 'cancel_pink' : '';
            },
            m_option(row) {
                let buttons = [];
                if (row.is_can_print === 0) {
                    buttons = [
                        {label: '打印面单', value: 1, apis: url_post_print, disabled: true},
                        {label: '查看面单', value: 2, apis: url_get_pdf, disabled: true},
                        {label: '移除', value: 3, apis: url_remove_package, disabled: false},
                    ];
                    return buttons.filter(item => {
                        return this.$hasPermission(item.apis);
                    })
                }
                if (row.is_can_print === 1) {
                    buttons = [
                        {label: '打印面单', value: 1, apis: url_post_print, disabled: false},
                        {label: '查看面单', value: 2, apis: url_get_pdf, disabled: false},
                        {label: '移除', value: 3, apis: url_remove_package, disabled: false}
                    ];
                    return buttons.filter(item => {
                        return this.$hasPermission(item.apis);
                    })
                }
                return buttons;
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
                        this.remove(row);
                        break;
                }
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
            search() {
                this.loading = true;
                this.searchData.warehouse_id = this.warehouseId;
                let searchData = clone(this.searchData);
                if (searchData.snText) {
                    console.error(searchData.snText)
                    searchData.snText = searchData.snText.split('\n').filter(row => !!row).map(row => row.trim());
                    console.error(searchData.snText)
                }
                this.$http(api_quick_package, searchData).then(res => {
                    this.packageData = res.data;
                    this.total = res.count;
                    this.loading = false;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            init_statusList() {
                this.$http(api_get_packages_status).then(res => {
                    this.statusList = res.map(row => {
                        return {
                            label: row.label,
                            value: row.value
                        }
                    });
                    this.statusList.unshift({label: '全部', value: ''});
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            //分页器
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.search();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.search();
            },
            select(selected) {
                this.selected = selected;
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
            remove(row) {
                this.$confirm(`您将要移除包裹${row.number}，确定移除?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let arr = [];
                    arr.push(row.package_id);
                    let data = {
                        warehouse_id: this.searchData.warehouse_id,
                        package_ids: arr
                    };
                    this.$http(api_remove_package, data).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.total--;
                        let index = this.packageData.findIndex(item => {
                            return item.id === row.id;
                        });
                        this.packageData.splice(index, 1);
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    });
                }).catch(code => {

                })
            },
            print(row) {
                let numberList = [];
                let content = '';
                let direction = 1;
                let type = [];
                let coordinate = [];
                let watermark = [];
                this.$http(api_post_print, {package_id: row.id}).then(res => {
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
                    numberList = res.identification;
                    direction = res.direction || direction;
                    let params = {
                        type: type,
                        coordinate: coordinate,
                        watermark: watermark,
                        content: content,
                        numberList: numberList,
                        url: config.apiHost + res.callback,
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
            batch_remove() {
                let arr = this.selected.map(row => {
                    console.log(row);
                    return row.package_id;
                });
                let data = {
                    warehouse_id: this.searchData.warehouse_id,
                    package_ids: arr
                };
                this.$confirm(`您将要移除这${arr.length}个包裹，确定移除?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_remove_package, data).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.search();
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    });
                }).catch(code => {

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
            }
        },
        computed: {},
        watch: {
            warehouseId() {
                this.search();
            }
        },
        props: {
            packageVisible: {},
            warehouseId: {}
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            times: require('@/components/times.vue').default,
            parcelInformation: require('../placeorder/parcel-information.vue').default,
            searchCard: require('@/components/search-card').default,
            formMdf: require("../../order/local/form-mdf.vue").default,
            orderInput: require("@/components/order-input").default,
            trendsSelect: require('@/components/trends-select').default,
        },
    }
</script>
