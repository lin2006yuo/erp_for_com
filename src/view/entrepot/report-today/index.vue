<template>
    <page class="p-report-today">
        <el-row>
            <div class="title">
                <b class="ml-sm">今日数据统计（更新时间：<span class="blue-text">{{update_time}}</span>）</b>
            </div>
            <el-col :span="14">
                <warehouseInfo :table-title="warehouseTitle"
                               :table-columns="warehouseColumn"
                               :warehouseColumnB="warehouseColumnB"
                               :warehouseColumnE="warehouseColumnE"
                               :table-data-one="warehouseDataOne"
                               :table-data-two="warehouseDataTwo"
                               @look-detail="look_detail"
                               class="mb-lg">
                </warehouseInfo>
                <productivityInfo :table-title="productivityTitle"
                                  :table-columns="productivityColumn"
                                  :table-data="productivityData"
                                  @look-detail="look_detail">
                </productivityInfo>
            </el-col>
            <el-col :span="10" class="pl-sm">
                <operation-details :title="operationTitle"
                                   :table-columns="detailsColumn"
                                   :table-data="detailsData"
                                   :loading="detailLoading"
                                   @handle-size-change="handle_size_change"
                                   @handle-current-change="handle_current_change"
                                   @sort="sort">
                </operation-details>
            </el-col>
        </el-row>
    </page>
</template>
<style lang="stylus">
    .p-report-today {
        .title {
            height: 35px;
            line-height: 35px;
        }
        .table-title {
            border: 1px solid #e0e6ed;
            border-bottom: none;
            height: 45px;
            line-height: 45px;
            overflow: hidden;
        }
        .title-text {
            vertical-align: middle;
            font-size: 16px;
            font-weight: 700;
        }
        .title-img {
            vertical-align: middle
        }
        .blue-text {
            color: #008BCE;
        }
        .pl-sm {
            padding-left: 10px;
        }
    }
</style>
<script>
    import {api_report_today_one, api_report_today_two, api_report_today_capacity} from '@/api/report-today'
    import {http} from '@/lib/http-plus'

    export default {
        page: {
            devinfo: {
                frontEnd: '张明亮',
                backEnd: '赖永凤',
                createTime: '2018-3-20',
                updateTime: '2018-3-20'
            }
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                warehouseTitle: '仓库统计',
                productivityTitle: '产能统计',
                warehouseColumn: [
                    {label: '仓库', value: 'warehouse_name'},
                    {label: '还未打包数', value: 'unPacked'},
                    {label: '缺货数', value: 'stock'},
                    {label: '未配货数', value: 'unDistribution'},
                    {label: '物流上传异常', value: 'abnormal'},
                    {label: '未生成拣货单数', value: 'unMakePicking'},
                    {label: '打印拣货单数', value: 'printPicking'},
                    {label: '未执行发货数', value: 'unShipping'}
                ],
                warehouseColumnB: [
                    {label: '仓库', value: 'warehouse_name'},
                    {label: '缺货包裹', value: 'stock'},
                    {label: '未配货包裹', value: 'unDistribution'},
                    {label: '物流上传异常', value: 'abnormal'},
                    {label: '未生成拣货单', value: 'unMakePicking'},
                    {label: '待拣货拣货单', value: ['unPickPicking','allPickPicking']},
                    {label: '已分拣数', value: 'sorting_quantity', operate: true, use: 'sorting'},
                    {label: '未包装数', value: 'unPacked'},
                    {label: '已包装数', value: 'packing_quantity', operate: true, use: 'packing'},
                    {label: '未集包数', value: 'not_collection'}
                ],
                warehouseColumnE: [
                    {label: '仓库', value: 'warehouse_name'},
                    {label: '已集包数', value: 'collection_quantity', operate: true, use: 'collection'},
                    {label: '已出库数', value: 'out_package_quantity', operate: true, use: 'out-transfer', mete: 'out'},
                    {
                        label: '已交接数',
                        value: 'transfer_package_quantity',
                        operate: true,
                        use: 'out-transfer',
                        mete: 'transfer'
                    },
                    {label: '未执行发货数', value: 'unShipping'},
                    {label: '未处理异常数', value: 'not_handle_exception'},
                    {
                        label: '采购待上架',
                        value: 'purchase_waiting_putaway',
                        operate: true,
                        use: 'putaway-waiting-goods',
                        flag: 'putaway'
                    },
                    {
                        label: '重返待上架',
                        value: 'waiting_return_putaway',
                        operate: true,
                        use: 'return-shelves/get-detail',
                        flag: 'putaway'
                    },
                    {
                        label: '退回待上架',
                        value: 'reback_waiting_putaway',
                        operate: true,
                        use: 'reback-shelves',
                        flag: 'putaway'
                    },
                    {label: '未拆包裹', value: 'not_pack_package'}
                ],
                productivityColumn: [
                    {label: '仓库', value: 'warehouse_name', operate: false},
                    {label: '上架SKU总数', value: 'shelf_quantity', operate: true, use: 'shelf'},
                    {label: '下架SKU总数', value: 'picking_quantity', operate: true, use: 'picking'},
                    {label: '贴标SKU总数', value: 'label_quantity', operate: true, use: 'label'},
                    {label: '入库统计', value: 'unpack_quantity', operate: true, use: 'unpack'},
                ],
                use: 'shelf',
                mete: '',
                putaway: '',
                operate: '',
                warehouseData: [],
                warehouseDataOne: [],
                warehouseDataTwo: [],
                productivityData: [],
                update_time: '',
                operationTitle: {
                    warehouseName: '中山仓',
                    use: '上架商品次数'
                },
                searchData: {
                    page: 1,
                    pageSize: 50,
                    group_type: 1,
                    date_from: Date.now(),
                    date_to: Date.now(),
                    warehouse_id: 2,
                    sort_field: '',
                    sort_type: ''
                },
                detailsData: [],
                detailLoading: false,
                apiReport: 'get|warehouse/report/shelf'
            }
        },
        mounted() {
            this.init_report_one();
            this.init_report_two();
            this.init_report_capacity();
        },
        methods: {
            init_report_one() {
                this.$http(api_report_today_one).then(res => {
                    this.warehouseDataOne = res;
                    this.init_detail();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            init_report_two() {
                this.$http(api_report_today_two).then(res => {
                    this.update_time = datef('YYYY-MM-dd HH:mm:ss', Date.now() / 1000);
                    this.warehouseDataTwo = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            init_report_capacity() {
                this.$http(api_report_today_capacity).then(res => {
                    this.productivityData = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            async init_detail() {
                try {
                    this.detailLoading = false;
                    let data = this.deal_time(this.searchData);
                    if (this.mete !== '') Object.assign(data, {page_type: this.mete});
                    if (this.operate === true) Object.assign(data, {today: 1});
                    if (this.putaway !== '') {
                        delete data.date_from;
                        delete data.date_to;
                    }
                    const request = http(Url2(this.apiReport), data);
                    this.detailLoading = true;
                    this.detailsData = await this.$http(request);
                } catch (code) {
                    this.$message({type: "error", message: code.message || code});
                } finally {
                    this.detailLoading = false;
                }
            },
            sort(field, type) {
                this.searchData.sort_field = field;
                this.searchData.sort_type = type === 'ascending' ? 'asc' : 'desc';
                this.init_detail();
            },
            look_detail(row, item) {
                this.searchData.sort_field = '';
                this.searchData.sort_type = '';
                this.mete = item['mete'] ? item['mete'] : '';
                this.putaway = item['flag'] ? item['flag'] : '';
                this.operate = item['operate'] ? item['operate'] : '';
                this.operationTitle.warehouseName = row.warehouse_name;
                this.operationTitle.use = item.label;
                this.searchData.warehouse_id = row.warehouse_id;
                if (item['flag'] && item['flag'] === 'putaway') {
                    this.apiReport = `get|${item.use}`
                }
                else {
                    this.apiReport = `get|warehouse/report/${item.use}`;
                }
                this.use = item.use;
                this.init_detail();
            },
            //处理年月日
            deal_time(searchData) {
                //处理年月日 YYYY-MM-dd
                let data = clone(searchData);
                if (searchData.date_from) {
                    data.date_from = datef('YYYY-MM-dd', searchData.date_from / 1000);
                } else {
                    data.date_from = '';
                }
                if (searchData.date_to) {
                    data.date_to = datef('YYYY-MM-dd', searchData.date_to / 1000);
                } else {
                    data.date_to = '';
                }
                return data;
            },
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init_detail();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init_detail();
            },
        },
        computed: {
            detailsColumn() {
                switch (this.use) {
                    case 'shelf':
                        return [
                            {label: '操作人员', value: 'operator'},
                            {label: '上架次数', value: 'times'},
                            {label: 'SKU品种数', value: 'type_quantity'},
                            {label: 'SKU总数量', value: 'quantity'}
                        ];
                    case 'label':
                        return [
                            {label: '操作人员', value: 'operator'},
                            {label: '贴标数', value: 'quantity'},
                        ];
                    case 'picking':
                        return [
                            {label: '操作人员', value: 'operator'},
                            {label: '下架次数', value: 'times'},
                            {label: 'SKU品种数', value: 'type_quantity'},
                            {label: 'SKU总数量', value: 'quantity'}
                        ];
                    case 'collection':
                        return [
                            {label: '操作人员', value: 'operator'},
                            {label: '集包次数', value: 'times'},
                            {label: '集包数', value: 'quantity'},
                            {label: '集包数区间1', value: 'value_1'},
                            {label: '集包数区间2', value: 'value_2'},
                            {label: '集包数区间3', value: 'value_3'},
                            {label: '集包数区间4', value: 'value_4'},

                        ];
                    case 'sorting':
                        return [
                            {label: '操作人员', value: 'operator'},
                            {label: '分拣次数', value: 'times'},
                            {label: '包裹数', value: 'quantity'},
                        ];
                    case 'packing':
                        return [
                            {label: '操作人', value: 'operator'},
                            {label: '打包包裹', value: 'packing_quantity'},
                            {label: '单品打包', value: 'single_packing_quantity'},
                            {label: '单品单件', value: 'single_single_packing_quantity'},
                            {label: '单品多件', value: 'single_more_packing_quantity'},
                            {label: '多品打包', value: 'more_packing_quantity'},
                            {label: '日期', value: 'dateline'},
                        ];
                    case "unpack":
                        return [
                            {label: '操作人员', value: 'operator'},
                            {label: '拆包次数', value: 'times'},
                            {label: 'SKU品种数', value: 'type_quantity'},
                            {label: 'SKU总数量', value: 'quantity'}
                        ];
                    case "out-transfer":
                        if (this.mete === 'out') {
                            return [
                                {label: '操作人员', value: 'operator'},
                                {label: '已出库数', value: 'out_package_quantity'},
                            ]
                        } else if (this.mete === 'transfer') {
                            return [
                                {label: '操作人员', value: 'operator'},
                                {label: '已交接数', value: 'transfer_package_quantity'},
                            ]
                        }
                    case "putaway-waiting-goods":
                        return [
                            {label: 'SKU', value: 'sku'},
                            {label: '待上架数', value: 'waiting_quantity'},
                        ]
                    case "return-shelves/get-detail":
                        return [
                            {label: 'SKU', value: 'sku'},
                            {label: '待上架数', value: 'quantity_left'},
                        ]
                    case "reback-shelves":
                        return [
                            {label: 'SKU', value: 'sku'},
                            {label: '待上架数', value: 'quantity'},
                        ]
                }
            }
        },
        components: {
            statistics: require('./statistics').default,
            warehouseInfo: require('./warehouse-info').default,
            productivityInfo: require('./productivity-info').default,
            operationDetails: require('./operation-details').default
        }
    }
</script>
