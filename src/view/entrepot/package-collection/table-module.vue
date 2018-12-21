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
            <div slot="button-list">
                <el-checkbox v-model="checkedall"
                             style="padding-left:15px;display:inline-block;height:28px;line-height:28px">所有页全选
                </el-checkbox>
                <el-button size="mini" class="ml-sm" @click="export_package" type="primary"
                           :disabled="this.selecteds.length === 0">导出集包包裹
                </el-button>
                <template v-if="searchData.status === 2 || searchData.status === 7">
                    <el-button size="mini" class="ml-sm" @click="query">批量交货</el-button>
                    <el-button size="mini" class="ml-sm" @click="stock_removal">批量出库</el-button>
                </template>
                <el-button v-if="searchData.status === 6" size="mini" class="ml-sm" @click="query">批量交货</el-button>
                <permission tag="requestButton"
                            req-key="api_batch_check_package"
                            @click="batch_check"
                            :disabled="this.selecteds.length === 0"
                            :route="apis.url_batch_check_package"
                            v-if="searchData.status === 1" >
                    批量复核成功
                </permission>
            </div>
            <!-- 打印机 -->
            <span class="fr mr-sm" style="line-height: 28px" slot="other">
                <span style="vertical-align: middle">打印机：</span>
                <select-printer :value="printer" @input="$emit('update:printer',$event)"
                                class="inline width-lg"></select-printer>
            </span>
            <!-- 表格 -->
            <el-table
                    slot="goods-tabel"
                    ref="tableData"
                    :data="tableData"
                    highlight-current-row
                    style="width: 100%;"
                    v-loading="loading"
                    element-loading-text="玩命加载中..."
                    v-resize="{height:40}"
                    row-key="code"
                    @selection-change="handle_selection_change">
                <el-table-column
                        :selectable="selectable"
                        v-for="(item, index) in selectList"
                        :key="item.value"
                        type="selection"
                        align="center"
                        width="30px">
                </el-table-column>
                <el-table-column
                        inline-template
                        min-width="90"
                        label="集包单号">
                    <div>
                        <ui-tip :content="row.code" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        min-width="120"
                        label="邮寄方式"
                        inline-template>
                    <div>
                        <ui-tip :content="row.shipping_name" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="揽收商" prop="collector_name"></el-table-column>
                <el-table-column
                        label="包裹数量"
                        min-width="65"
                        inline-template>
                    <div>
                        <ui-tip :content="row.package_count" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="包裹重量(kg)"
                        inline-template
                        min-width="85">
                    <div>
                        <ui-tip :content="row.package_weight" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="集包袋重量(kg)"
                        inline-template
                        min-width="95">
                    <div>
                        <ui-tip :content="row.collect_weight" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="复核重量(kg)"
                        min-width="85"
                        inline-template>
                    <div>
                        <ui-tip :content="row.weight" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="差异重量(kg)"
                        inline-template
                        min-width="85">
                    <div>
                        <ui-tip :content="row.diff_weight" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="状态"
                        inline-template
                        min-width="50">
                    <div>
                        <ui-tip :content="row.status_txt" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="集包人"
                        inline-template
                        min-width="50">
                    <div>
                        <ui-tip :content="row.creator" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        v-for="(item, index) in peopleList"
                        :key="item.index"
                        :label="item.label"
                        min-width="80"
                        inline-template>
                    <div>
                        <ui-tip :content="row[item.value]" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column v-for="(item, index) in timeList" :label="item.label" :key="item.index"
                                 inline-template>
                    <div>
                        <ui-tip :content="row[item.value] | filterTime" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        label="操作"
                        min-width="100"
                        inline-template>
                    <div>
                        <trends-select class="inline"
                                       @trigger="action(row,$event)"
                                       :selects="m_option(row)"
                                       type="primary">
                        </trends-select>
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
        <look-edit v-model="lookVisible"
                   :trend-action="trendAction">
        </look-edit>
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
        .hide {
            display: none;
        }
        .el-table__header {
            width: 100% !important;
        }
        .el-card__body {
            padding: 0;
        }
    }
</style>
<script>
    import {mapActions, mapGetters} from 'vuex';
    import {
        api_get_collection, api_get_menu, api_batch_collection, api_batch_out_collection, api_get_packagelist,
        api_invalid_collection, url_detail_collection, url_delete_package, url_invalid_collection,
        url_batch_collection, api_export_package, url_export_package, api_batch_check_package, url_batch_check_package,
    } from '@/api/package-collection'
    import {downloadFile} from '@/lib/http';

    export default {
        page: {
            multiple: true,
        },
        permission: {
            url_detail_collection,
            url_delete_package,
            url_invalid_collection,
            url_batch_collection,
            url_batch_check_package,
        },
        data() {
            return {
                checkData: [],
                loading: false,
                transportData: [],
                tableData: [],
                checkedall: false,
                operateButtons: [
                    {label: '查看', value: 1, apis: url_detail_collection},
                ],
                total: 0,
                tipTitle: "点击更多拣货单号",
                detailData: {},
                trendAction: {
                    title: '',
                    value: '',
                    id: ''
                },
                shipping_id: '',
                lookVisible: false,
                selecteds: [],
                token: '',
                numberList: '',
                printData: {},
                transportLoading: false,
            }
        },
        filters: {
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
        },
        methods: {
            ...mapActions({
                set_printerList: 'api/set_printerList'
            }),
            selectCheck(select) {
                this.checkData = select.map(row => {
                    return row.id;
                });
            },
            export_package(id) {                   // 导出集包包裹
                let dataList = typeof id !== 'object' ? [id] : this.selecteds;
                let data = {id: dataList};
                if (this.checkedall) {
                    data = {is_export_all: true};
                }
                Object.assign(data, this.deal_time(this.searchData));
                return this.$http(api_export_package, data).then(res => {
                    let url = config.apiHost + 'downloadFile/downExportFile';
                    let data = {
                        file_code: res.file_code,
                    };
                    downloadFile({
                        url: url,
                        get: data,
                        fileName: res.file_name,
                        suffix: '.csv',
                    });
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
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
                    this.$http(api_get_collection, data).then(res => {
                        this.tableData = res.list;
                        this.total = res.count;
                        this.tableData.forEach(row => {
                            this.$set(row, 'operateButtons', window.clone(this.operateButtons));
                            if (row.status === 5) {
                                return false;
                            }
                            if (row.status !== 3) {
                                row.operateButtons.push({label: '修改', value: 2, apis: url_delete_package});
                            }
                            if (row.status !== 3 && row.status !== 5) {
                                row.operateButtons.push({label: '作废', value: 5, apis: url_invalid_collection});
                            }
                            if (row.status === 0) {
                                row.operateButtons.push({label: '继续集包', value: 3, apis: url_detail_collection});
                            }
                            if (row.status === 2) {
                                row.operateButtons.push({label: '交货', value: 4, apis: url_batch_collection});
                                row.operateButtons.push({label: '出库', value: 7, apis: api_batch_out_collection});
                            }
                            if (row.status === 1) {
                                row.operateButtons.push({label: '打印面单号', value: 6, apis: url_detail_collection});
                            }
                            if (row.status === 6) {
                                row.operateButtons.push({label: '交货', value: 4, apis: url_batch_collection});
                            }
                            row.operateButtons.push({label: '导出', value: 8, apis: url_export_package});
                        });
                        this.loading = false;
                    }).catch(code => {
                        this.loading = false;
                        this.$message({type: "error", message: code.message || code});
                    })
                }
            },
            selectable(row, index) {
                return !this.checkedall;
            },
            //处理年月日
            deal_time(searchData) {
                //处理年月日 YYYY-MM-dd
                let data = clone(searchData);
                if (searchData.time_st) {
                    data.time_st = datef('YYYY-MM-dd HH:mm:ss', searchData.time_st / 1000);
                } else {
                    data.time_st = '';
                }
                if (searchData.time_nd) {
                    data.time_nd = datef('YYYY-MM-dd HH:mm:ss', searchData.time_nd / 1000);
                } else {
                    data.time_nd = '';
                }
                if(data.code !== '') {
                    data.code = data.code.split('\n').filter(row => !!row.trim()).map(row => row.trim());
                }
                return data;
            },
            request_shipping_method() {
                if (this.searchData.warehouse_id) {
                    let params = {
                        warehouse_id: this.searchData.warehouse_id,
                        status: this.searchData.status,
                    };
                    this.transportLoading = true;
                    this.$http(api_get_menu, params).then(res => {
                        let treeObj;
                        let total = 0;
                        if (res) {
                            treeObj = Object.values(res).map(item => {
                                total += item.count;
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
            action(data, options) {
                switch (options.value) {
                    case 1:
                        this.trendAction.title = `查看集包单(${data.code})`;
                        this.trendAction.number = data.code;
                        this.trendAction.value = 'look';
                        this.trendAction.id = data.id;
                        this.lookVisible = true;
                        break;
                    case 2:
                        this.trendAction.title = `编辑集包单(${data.code})`;
                        this.trendAction.number = data.code;
                        this.trendAction.value = 'edit';
                        this.trendAction.id = data.id;
                        this.lookVisible = true;
                        break;
                    case 3:
                        if (this.getCollectionList.length > 0) {
                            this.$message({type: "error", message: '还有正在操作的集包单'});
                            return false;
                        }
                        let param = {
                            package_number: '',
                            shipping_number: '',
                            page: 1,
                            pageSize: 20
                        };
                        this.$http(api_get_packagelist, data.id, param).then(res => {
                            let packages = res.list.filter(row => row.deleted === 0);
                            let params = {
                                id: data.id,
                                code: data.code,
                                shipping_name: data.shipping_name,
                                collect_type: data.type,
                                collect_weight: data.collect_weight * 1000,
                                quantity: data.package_count,
                                package_weight: data.package_weight,
                                packages,
                                shipping_id: res.shipping_id,
                                carrier_name: res.carrier_name,
                                carrier_id: res.carrier_id
                            };
                            console.log('继续集包', params);
                            this.$open('/package-collection/set-weight', params);
                        }).catch(code => {
                            this.$message({type: "error", message: code.message || code});
                        });
                        break;
                    case 4:
                        let id = [];
                        id.push(data.id);
                        this.$confirm(`您将交接集包单${data.code},确认此操作吗？`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$http(api_batch_collection, {id: id}).then(res => {
                                this.$message({type: "success", message: res.message || res});
                                this.tableData.find((item, index) => {
                                    if (item.id === data.id) {
                                        this.tableData.splice(index, 1);
                                    }
                                    return item.id === data.id;
                                })
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
                        this.$confirm(`您将作废集包单${data.code},确认此操作吗？`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$http(api_invalid_collection, data.id).then(res => {
                                this.$message({type: "success", message: res.message || res});
                                this.tableData.find((item, index) => {
                                    if (item.id === data.id) {
                                        this.tableData.splice(index, 1);
                                    }
                                    return item.id === data.id;
                                })
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
                    case 6:
                        this.$emit('print', {
                            id: data.id,
                            code: data.code,
                            shipping_name: data.shipping_name,
                            collector_name: data.collector_name,
                            collect_label: data.type,
                            collect_weight: Number(data.collect_weight) * 1000,
                            quantity: data.package_count,
                            package_weight: Number(data.package_weight) * 1000,
                            creator: data.creator,
                            packing_time: datef('YYYY-MM-dd HH:mm:ss', data.create_time)
                        });
                        break;
                    case 7:
                        let stock_id = [];//api_batch_out_collection
                        stock_id.push(data.id);
                        this.$confirm(`您将出库集包单${data.code},确认此操作吗？`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$http(api_batch_out_collection, {id: stock_id}).then(res => {
                                this.$message({type: "success", message: res.message || res});
                                this.tableData.find((item, index) => {
                                    if (item.id === data.id) {
                                        this.tableData.splice(index, 1);
                                    }
                                    return item.id === data.id;
                                })
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
                        this.export_package(data.id);
                }
            },
            //改变选中
            handle_selection_change(selects) {
                this.selecteds = selects.map(row => {
                    return row.id;
                });
            },
            query() {
                if (this.selecteds.length === 0) {
                    this.$message({type: "error", message: '请先选中要发货的集包单'});
                    return false;
                }
                this.$confirm(`确认对选中的${this.selecteds.length}条集包单号进行确认发货操作？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_batch_collection, {id: this.selecteds}).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.selecteds.forEach(row => {
                            this.tableData.forEach((item, index) => {
                                if (item.id === row) {
                                    this.tableData.splice(index, 1);
                                }
                            })
                        })
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            batch_check() {
                if (this.selecteds.length === 0) {
                    this.$message({type: "error", message: '请先选中要发货的集包单'});
                    this.$reqKey('api_batch_check_package', false);
                    return false;
                }
                this.$confirm(`确认对选中的${this.selecteds.length}条集包单号进行批量复核成功，确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_batch_check_package, {id: this.selecteds}).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.init();
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    }).finally(()=> {
                        setTimeout(()=> {
                            this.$reqKey('api_batch_check_package', false);
                        }, 200);
                    })
                }).catch(() => {
                    this.$reqKey('api_batch_check_package', false);
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            stock_removal() {
                if (this.selecteds.length === 0) {
                    this.$message({type: "error", message: '请先选中要出库的集包单'});
                    return false;
                }
                this.$confirm(`确认对选中的${this.selecteds.length}条集包单号进行确认出库操作？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_batch_out_collection, {id: this.selecteds}).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.selecteds.forEach(row => {
                            this.tableData.forEach((item, index) => {
                                if (item.id === row) {
                                    this.tableData.splice(index, 1);
                                }
                            })
                        })
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            }
        },
        computed: {
            ...mapGetters({
                'getCollectionList': 'api/getCollectionList'
            }),
            warehousename() {
                let warehouse_id = this.$parent.$refs.search_module.warehouses.find(row => row.value === this.searchData.warehouse_id);
                if (warehouse_id) {
                    return warehouse_id.label;
                } else {
                    return '';
                }
            },
            selectList() {
                //if(this.searchData.status === 2 || this.searchData.status ===6){
                return [
                    {label: 'selection', value: 'selection'}
                ]
                //}
            },
            timeList() {
                if (this.searchData.status === 2) {
                    return [
                        {label: '复核时间', value: 'weight_time'},
                    ]
                } else if (this.searchData.status === 3) {
                    return [
                        {label: '交接时间', value: 'handover_time'},
                    ]
                } else {
                    return [
                        {label: '集包时间', value: 'create_time'}
                    ]
                }
            },
            peopleList() {
                if (this.searchData.status === 2) {
                    return [
                        {label: '复核人', value: 'weigher'}
                    ]
                } else if (this.searchData.status === 3) {
                    return [
                        {label: '复核人', value: 'weigher'},
                        {label: '交接人', value: 'handover'}
                    ]
                } else if (this.searchData.status === 5) {
                    return [
                        {label: '复核人', value: 'weigher'},
                        {label: '作废人', value: 'deleter'}
                    ]
                }
            }
        },
        watch: {
            checkedall(val) {
                if (val) {
                    this.tableData.forEach(row => {
                        this.$refs.tableData.toggleRowSelection(row, true);
                    })
                } else {
                    this.tableData.forEach(row => {
                        this.$refs.tableData.toggleRowSelection(row, false);
                    })
                }
            },
            tableData(val) {
                if (this.checkedall) {
                    this.tableData.forEach(row => {
                        this.$nextTick(() => {
                            this.$refs.tableData.toggleRowSelection(row, true);
                        })
                    })
                } else {
                    this.tableData.forEach(row => {
                        this.$refs.tableData.toggleRowSelection(row, false);
                    })
                }
            }
        },
        props: {
            searchData: {},
            printer: {}
        },
        components: {
            transport: require('@/components/transport.vue').default,
            uiTable: require('@/components/ui-table.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
            plusMinus: require('@/components/plus-minus.vue').default,
            trendsSelect: require('@/components/trends-select.vue').default,
            lookEdit: require('./look-edit.vue').default,
            selectPrinter: require('@/components/select-printer.vue').default,
            mailingMethod: require('@/components/mailing-method.vue').default,
        },
    }
</script>
