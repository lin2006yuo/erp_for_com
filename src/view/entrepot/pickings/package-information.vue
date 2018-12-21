<template>
    <div>
        <label-item label="包裹号：" class="ml-sm">
            <el-input v-model="searchData.number" @keyup.enter.native="init"></el-input>
        </label-item>
        <label-item label="SKU：" class="ml-sm">
            <el-input v-model="searchData.sku" @keyup.enter.native="init"></el-input>
        </label-item>
        <label-item label="拣货单包裹状态：" class="ml-sm">
            <el-select v-model="searchData.status">
                <el-option v-for="(item, index) in statusList"
                           :key="index"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <el-button type="primary"
                   size="mini"
                   class="ml-sm"
                   @click="init">搜索
        </el-button>
        <div class="mt-xs">
            <el-button type="primary" size="mini" @click="batch_print" :disabled="selectData.length <= 0">批量打印
            </el-button>
            <request-button req-key='bulkPack' v-if="trendAction.sortType" @click="bulk_pack" :disabled="selectData.length <= 0">批量包装
            </request-button>
            <permission tag="ElButton" type="primary"
                        :route="apis.url_exclusion_check"
                        v-if="trendAction.sortType"
                        @click="exclude_batch"
                        size="mini" >排除法批量包装</permission>
            <span class="inline fr">
                <span class="inline" style="line-height: 26px">打印机：</span>
                <select-printer v-model="printerData" class="inline width-lg fr" style="margin:3px;"></select-printer>
            </span>
        </div>
        <el-table :data="packageData"
                  v-loading="loading"
                  height="500"
                  class="scroll-bar mt-xs"
                  @selection-change="selected"
                  element-loading-text="玩命加载中"
                  highlightCurrentRow>
            <el-table-column
                    type="selection"
                    width="40">
            </el-table-column>
            <el-table-column
                    inline-template
                    width="120"
                    label="包裹号">
                <div>
                    <ui-tip :is-operate="true" :content="row.number" :width="98"
                            @cur-click="parcel_information(row.number)"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="180"
                    label="渠道/账号信息">
                <div>
                    <ui-tip :content="`${row.channel}/${row.channel_account}`" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="包裹订单状态">
                <div>
                    <ui-tip :content="row.order_status" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="180"
                    label="包装前包裹详情">
                <div>
                    <div v-for="item in row.make_package_detail">
                        <span>SKU:{{item.sku}}</span>
                        <span class="ml-sm">数量:{{item.quantity}}</span>
                    </div>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="180"
                    label="包装后包裹详情">
                <div>
                    <div v-for="item in row.package_detail">
                        <span>SKU:{{item.sku}}</span>
                        <span class="ml-sm">数量:{{item.quantity}}</span>
                    </div>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    prop="name"
                    width="150"
                    label="发货时间">
                <div>
                    <times :time="row.shipping_time"></times>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="拣货单号">
                <div>
                    <ui-tip :content="row.picking_number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="拣货单包裹状态">
                <div>
                    <ui-tip :content="row.picking_status" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="150"
                    label="包装时间">
                <div>
                    <times :time="row.packing_time"></times>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="包装者">
                <div>
                    <ui-tip :content="row.packager_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="150"
                    label="打印时间">
                <div>
                    <times :time="row.print_time"></times>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="120"
                    label="操作">
                <div>
                    <span class="operate" @click="print(row)">打印</span>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="fr mt-sm"
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
        <batch-exclude-check v-model="excludeVisible"
                             @search="init"
                             :picking_id="trendAction.id"></batch-exclude-check>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_packages, api_get_packages_status} from '@/api/pickings'
    import {api_get_package, url_package} from '@/api/shipment'
    import {
        api_delivery_check_print,
        api_delivery_check_prints,
        api_label_check,
        url_exclusion_check,
        } from '@/api/delivery-check'
    import {mapGetters, mapActions} from 'vuex'

    export default {
        permission: {
            url_package,
            url_exclusion_check,
        },
        data() {
            return {
                loading: false,
                statusList: [],
                searchData: {
                    status: '',
                    number: '',
                    sku: '',
                    page: 1,
                    pageSize: 20
                },
                packageData: [],
                total: 0,
                informationVisble: false,
                order: {},
                token: '',
                selectData: [],
                // action:'http://localhost:10093/print',
                mdfValue: false,
                mdfid: '',
                mdfTitle: '',
                isShow: false,
                printerData: '',
                excludeVisible: false,
            }
        },
        mounted() {
            this.init_statusList();
            this.init_channel();
        },
        methods: {
            ...mapActions({
                setPrinter: 'api/set_printer'
            }),
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
                Object.keys(this.searchData).forEach(key => {
                    if (typeof this.searchData[key] === 'string') {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
                // this.trim();
                this.$http(api_get_packages, this.trendAction.id, this.searchData).then(res => {
                    this.packageData = res.data;
                    this.total = res.count;
                    this.loading = false;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            trim() {
                this.searchData.number = this.searchData.number.trim();
                this.searchData.sku = this.searchData.sku.trim();
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
                this.init();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init();
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
            selected(selection) {
                this.selectData = selection;
            },
            print(row) {
                let numberList = [];
                let type = [];
                let coordinate = [];
                let watermark = [];
                let direction = 1;
                let content = '';
                // this.action = 'http://localhost:10093/print';
                this.$http(api_delivery_check_print, row.package_id).then(res => {
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
                        Width: 100,
                        Height: 100,
                        printer: this.printerData,
                        Direction: direction === 1 ? 'vertical' : 'transverse'
                    };
                    this.$printer(this.printerData, params)
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            batch_print() {
                // this.action = 'http://localhost:10093/overlappingPrint';
                let data = this.selectData.map(row => {
                    return row.package_id;
                });
                let numberList = [];
                let textarea = [];
                let type = [];
                let direction = [];
                let coordinate = [];
                let label_num = [];
                this.$http(api_delivery_check_prints, {package_id: data}).then(res => {
                    res.file_list.forEach(row => {
                        textarea.push(row.file);
                        type.push(row.type);
                        row.coordinate ? coordinate.push(row.coordinate) : coordinate.push('##');
                        row.label_num ? label_num.push(row.label_num) : label_num.push('##');
                    });
                    numberList = res.identification;
                    numberList = numberList.replace(/\,/g, '_a_b_c_d_');
                    textarea = textarea.join('_a_b_c_d_');
                    type = type.join('_a_b_c_d_');
                    coordinate = coordinate.join('_a_b_c_d_');
                    label_num = label_num.join('_a_b_c_d_');
                    let params = {
                        type: type,
                        coordinate: coordinate,
                        watermark: label_num,
                        content: textarea,
                        numberList: numberList,
                        url: config.apiHost + res.callback,
                        Width: 100,
                        Weight: 100,
                        printer: this.printerData
                    };
                    this.$printerOverlap(this.printerData, params);
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            bulk_pack() {//批量包装
                let parmes = this.selectData.filter(row => row.packing_time);
                let package_ids = [];
                if (!!parmes) {
                    package_ids = this.selectData.map(row => {
                        return row.package_id;
                    });
                }
                this.$http(api_label_check, {package_ids}).then(res => {
                    let newDatas = [];
                    const h = this.$createElement;
                    Object.keys(res).forEach(key => {
                        newDatas.push(h('p', null, res[key].message));
                        if (res[key].data.length != 0) {
                            this.packageData.forEach(row => {
                                let find = Object.keys(res).find(row2 => {
                                    return row.package_id === row2 && res[row2].status === true
                                });
                                if (!!find) {
                                    this.$set(row, 'packager_id', res[find].data.packing_name);
                                    this.$set(row, 'packing_time', res[find].data.packing_time);
                                    this.$set(row, 'package_detail', res[find].data.detail);
                                }
                            });
                        }
                    });
                    this.$msgbox({
                        title: '打包提示',
                        type: 'warning', message: h('div', {style: {width: '300px'}}, newDatas) || res,
                        showCancelButton: false,
                        showConfirmButton: false
                    });
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('bulkPack', false);
                    }, 300)
                })
            },
            exclude_batch() {//排除法批量包装
                this.excludeVisible = true;
            }
        },
        computed: {
            ...mapGetters({
                'printer': 'api/getPrinter'
            }),
        },
        watch: {
            packageVisible(val) {
                if (val) {
                    this.init();
                }
            },
            printer(val) {
                this.printerData = val;
            }
        },
        props: {
            packageVisible: {},
            trendAction: {},
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            times: require('@/components/times.vue').default,
            parcelInformation: require('../placeorder/parcel-information.vue').default,
            selectPrinter: require('@/components/select-printer').default,
            formMdf: require("../../order/local/form-mdf.vue").default,
            batchExcludeCheck: require('./batch-exclude-check.vue').default,
        },
    }
</script>
