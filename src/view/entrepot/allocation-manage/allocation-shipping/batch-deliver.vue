<template>
    <page-dialog v-model="visible" size="large" @open="open" @close="close" title="出库交接">

        <el-row class="mt-sm mb-sm">
            <permission tag="requestButton"
                        req-key="api_allocation_shipping_batch_deliver"
                        :disabled="selectData.length === 0"
                        @click="sure"
                        :route="apis.url_allocation_shipping_batch_deliver">
                批量交货
            </permission>
            <el-button type="primary" size="mini"
                       class="ml-sm"
                       @click.native="print">打印
            </el-button>
            <label-item label="打印机：" class="fr mr-sm">
                <select-printer v-model="printer" class="inline width-lg"></select-printer>
            </label-item>
        </el-row>
        <el-table border
                  class="scroll-bar"
                  :data="tableData"
                  v-resize="{height: 150}"
                  @selection-change="select"
                  highlight-current-row>
            <el-table-column type="selection"
                             :selectable="can_select"
                             width="35"></el-table-column>
            <el-table-column label="调拨单号" inline-template>
                <div>{{row.order_code}}</div>
            </el-table-column>
            <el-table-column label="箱子号" inline-template>
                <div>{{row.box_num}}</div>
            </el-table-column>
            <el-table-column label="箱唛" inline-template>
                <div>{{row.shipping_mark}}</div>
            </el-table-column>
            <el-table-column label="箱子重量（KG）" inline-template>
                <div>{{row.box_weight}}</div>
            </el-table-column>
            <el-table-column label="箱子体积" inline-template>
                <div>{{`${row.length}*${row.width}*${row.height}`}}</div>
            </el-table-column>
            <el-table-column label="物流渠道" inline-template>
                <div>{{row.shipping_method}}</div>
            </el-table-column>
            <el-table-column label="发货方式" inline-template>
                <div>{{row.shipping_type}}</div>
            </el-table-column>
            <el-table-column label="状态" inline-template>
                <div>{{row.box_status | statusFilter}}</div>
            </el-table-column>
            <el-table-column label="操作" inline-template>
                <permission tag="ElButton" type="primary" size="mini"
                            class="mt-xs mb-xs"
                            :route="apis.url_allocation_shipping_deliver"
                            @click.native="single_deliver(row)"
                            :disabled="row.box_status === 1">
                    交货
                </permission>
            </el-table-column>
        </el-table>
        <div slot="footer">
            <!--<el-button type="primary" size="mini" @click.native="sure">确定
            </el-button>-->
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {
        api_allocation_shipping_detail,
        api_allocation_shipping_batch_deliver,
        url_allocation_shipping_batch_deliver,
        api_allocation_shipping_deliver,
        url_allocation_shipping_deliver,
    } from "@/api/allocation-shipping";
    import {print} from './print.js';

    export default {
        permission: {
            url_allocation_shipping_batch_deliver,
            url_allocation_shipping_deliver,
        },
        data() {
            return {
                visible: this.value,
                tableData: [],
                selectData: [],
                loading: false,
                printer: '',
                token: '',
                printContent: '',
                print_html: '',
            }
        },
        filters: {
            statusFilter(val) {
                switch (val) {
                    case 0:
                        return '未交接';
                    case 1:
                        return '已交接';
                    default:
                        return '--';
                }
            }
        },
        methods: {
            open() {
                this.init();
            },
            close() {
                this.tableData = [];
                this.selectData = [];
                this.loading = false;
                this.$emit('search');
            },
            init() {
                this.loading = true;
                this.$http(api_allocation_shipping_detail, this.deliverParams).then(res => {
                    this.tableData = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    this.loading = true;
                })
            },
            can_select(row, index) {
                return row.box_status === 0;
            },
            select(selection) {
                this.selectData = selection;
            },
            print() {
                print.call(this, true, true);
            },
            single_deliver(row) {
                let data = {
                    allocation_id: row.id,
                    allocation_box_ids: [row.box_id],
                };
                this.$confirm(`您将交接箱唛${row.shipping_mark}，确认此操作吗？`, '提示', {
                    type: 'warning',
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                }).then(() => {
                    this.$http(api_allocation_shipping_deliver, data).then(res => {
                        this.init();
                        // this.$set(row, 'box_status', 1);
                        this.$message({type: 'success', message: res.message || res});
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    });
                }).catch(() => {
                    this.$message({type: 'info', message: '已取消'});
                });
            },
            sure() {
                let data = this.get_params();
                this.$confirm(`您将交接选中的箱子，确认此操作吗？`, '提示', {
                    type: 'warning',
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                }).then(() => {
                    this.$http(api_allocation_shipping_batch_deliver, {data}).then(res => {
                        this.init();
                        this.$message({type: 'success', message: res.message || res});
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('api_allocation_shipping_batch_deliver', false);
                        }, 200);
                    });
                }).catch(() => {
                    this.$reqKey('api_allocation_shipping_batch_deliver', false);
                    this.$message({type: 'info', message: '已取消'});
                });
            },
            get_params() {
                let allocation_ids = {};
                let data = [], i = 0;
                this.selectData.forEach(row => {
                    if (allocation_ids.hasOwnProperty(row.id)) {
                        let box = data[allocation_ids[row.id]];
                        box.box_num.push(row.box_num);
                        box.box_ids.push(row.box_id);
                    } else {
                        data.push({
                            id: row.id,
                            box_num: [row.box_num],
                            box_ids: [row.box_id],
                        });
                    }
                });
                return data;
            }
        },
        watch: {
            value(val) {
                this.visible = val;
            },
            visible(val) {
                this.$emit('input', val);
            }
        },
        props: {
            value: {},
            // 具体信息
            deliverParams: {},
        },
        components: {
            requestButton: require('@/global-components/request-button.vue').default,
            pageDialog: require('@/components/page-dialog.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            selectPrinter: require('@/components/select-printer.vue').default
        }
    }
</script>