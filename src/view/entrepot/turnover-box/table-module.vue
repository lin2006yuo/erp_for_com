<template>
    <div class="p-turnover-box">
        <el-table
                :data="tableData"
                v-resize="{height:41}"
                v-loading="loading"
                class="scroll-bar"
                @selection-change="handle_selection_change"
                element-loading-text="玩命加载中"
                highlightCurrentRow>
            <el-table-column type="selection"></el-table-column>
            <el-table-column
                    inline-template
                    label="周转箱号">
                <div>
                    <ui-tip :content="`${row.code}(${row.color})`" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="箱号类型">
                <div>
                    <ui-tip :content="row.type" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="仓库">
                <div>
                    <ui-tip :content="row.warehouse" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="状态">
                <div>
                    <ui-tip :content="row.work_status" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="拣货/上架单号">
                <div>
                    <ui-tip :is-operate="true"
                            :content="row | isPicking"
                            @cur-click="picking_putaway_order_id(row)"
                            :width="98">
                    </ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="集结区号">
                <div>
                    <ui-tip :is-operate="true"
                            :content="row.mass_sequence_number"
                            @cur-click="look_mass(row)"
                            :width="98">
                    </ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="更新人">
                <div>
                    <ui-tip :content="row.updater" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="更新时间">
                <div>
                    <ui-tip :content="row.update_time | timeFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text"
                               :class="{'operat-color':scope.row.can_invalid !== 0}"
                               size="mini"
                               :title="scope.row.can_invalid === 0 ? '周转箱还未空置':''"
                               :disabled="scope.row.can_invalid === 0"
                               @click="delete_data(scope.row)">作废
                    </el-button>
                    <span> | </span>
                    <el-button type="text"
                               class="operat-color"
                               size="mini"
                               @click="log_data(scope.row)">操作日志
                    </el-button>
                    <span> | </span>
                    <el-button type="text"
                               class="operat-color"
                               size="mini"
                               @click="print(scope.row)">打印
                    </el-button>
                </template>
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
        <operation-log v-model="visible" :action="action"></operation-log>
        <look v-model="lookVisible"
              :trend-action="trendAction">
        </look>
        <preview v-model="printVisable"
                 :batch-data="batchData"
                 :column-height="columnHeight"
                 ref="preview">
        </preview>
    </div>
</template>
<style lang="stylus">
    .p-turnover-box {
        .operat-color {
            color: #69f;
        }
    }

</style>
<script>
    import {api_get_turnover, api_invalid_turnover, api_print_turnover} from '@/api/turnover-box'

    export default {
        data() {
            return {
                loading: false,
                tableData: [],
                total: 0,
                action: {},
                visible: false,
                selectIds: [],
                trendAction: {},
                lookVisible: false,
                printVisable: false,
                batchData: [],
                columnHeight: 300
            }
        },
        mounted() {
        },
        filters: {
            timeFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
            isPicking(row) {
                return row.picking_num ? row.picking_num : row.putaway_order_id;
            },
            isPickingText(row) {
                return row.picking_num ? 'picking_num' : 'putaway_order_id';
            }
        },
        methods: {
            init() {
                this.loading = true;
                this.$http(api_get_turnover, this.searchData).then(res => {
                    this.tableData = res.data;
                    this.total = res.count;
                    this.loading = false;
                }).catch(code => {
                    this.loading = false;
                    this.$message({type: "error", message: code.message || code});
                })
            },
            handle_selection_change(val) {
                this.selectIds = val.map(res => {
                    return res.id;
                });
                this.$emit('select-id', this.selectIds);
            },
            delete_data(row) {
                if (row.can_invalid === 0) {
                    this.$message({type: "error", message: '该周转箱不是空置状态！'});
                    return false;
                }
                this.$confirm(`您将删除周转箱${row.id},确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_invalid_turnover, row.id).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.tableData.find((item, index) => {
                            if (item.id === row.id) {
                                this.tableData.splice(index, 1);
                            }
                            return item.id === row.id;
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
            log_data(row) {
                this.action.title = '操作日志';
                this.action.id = row.id;
                this.visible = true;
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
            picking_putaway_order_id(row) {
                let number = row.picking_num ? row.picking_num : row.putaway_order_id;
//                let type = row.picking_num ? 'picking_num' : 'putaway_order_id';
//                let param = {};
//                param.id = id;
//                if(type === 'picking_num'){
//                    this.$open('/pickings', param);
//                } else if(type === 'putaway_order_id'){
//
//                }
                this.trendAction.title = `查看拣货单(${number})`;
                this.trendAction.number = number;
                this.trendAction.value = 'look';
                this.trendAction.id = row.picking_id;
                this.lookVisible = true;
            },
            look_mass(row) {
                let param = {};
                param.id = row.mass_sequence_number;
                this.$open('/mass-zone', param);
            },
            print(row) {
                let ids = [];
                ids.push(row.id);
                this.$http(api_print_turnover, {ids: ids}).then(res => {
                        this.print_turnover(res);
                    }
                ).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })

            },
            print_turnover(res) {
                this.batchData = res;
                this.batchData.print_data.forEach(row => {
                    this.$set(row, 'print_num', 2);
                });
                this.printVisable = true;
                this.$refs.preview.get_template(5);
                if (this.batchData.default_temp_id) {
                    this.$nextTick(() => {
                        this.$refs.preview.change_print();
                    });
                }
            }
        },
        computed: {},
        watch: {
            newItem(val) {
                val.forEach(row => {
                    this.total++;
                    this.pageSize++;
                    this.tableData.push(row);
                })
            }
        },
        props: {
            searchData: {},
            newItem: {}
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default,
            operationLog: require('./operation-log.vue').default,
            look: require('../pickings/look.vue').default,
            preview: require('./batch-preview.vue').default
        },
    }
</script>
