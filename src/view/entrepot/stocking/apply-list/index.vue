<template>
    <page class="p-index">
        <card-search @search="search" @clear="clear" ref="search"></card-search>
        <el-row>
            <permission tag="request-button"
                        :route="apis.url_stocking_batch_sure"
                        :disabled="selectIds.length===0 || this.selectData.filter(row => row.status===1).length === 0"
                        class="mt-xs mb-xs ml-sm"
                        req-key="apply_list_batch_sure"
                        @click="batch_sure">确认备货
            </permission>
            <permission tag="request-button"
                        :route="apis.url_stocking_batch_delete"
                        :disabled="selectIds.length===0 || this.selectData.filter(row => row.status===1).length === 0"
                        class="mt-xs mb-xs ml-sm"
                        req-key="apply_list_batch_delete"
                        @click="batch_delete">移除
            </permission>
        </el-row>
        <el-row>
            <el-table
                    v-loading="loading"
                    element-loading-text="玩命加载中......"
                    class="scroll-bar"
                    highlight-current-row
                    v-resize="{height:41}"
                    :data="tableData"
                    @selection-change="select_items">
                <el-table-column
                        align="center"
                        type="selection"
                        width="35">
                </el-table-column>
                <el-table-column
                        inline-template
                        min-width="80"
                        label="申请单号">
                    <div>
                        <ui-tip :content="row.code" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        align="center"
                        inline-template
                        min-width="70"
                        label="图片">
                    <el-popover
                            placement="right"
                            trigger="hover">
                        <img v-lazy="sku_image(row.thumb)" width="200px" height="200px">
                        <div slot="reference">
                            <img v-lazy="row.thumb" v-if="row.thumb" height="60px" width="60px"
                                 style="border:none">
                        </div>
                    </el-popover>
                </el-table-column>
                <el-table-column
                        inline-template
                        min-width="80"
                        label="SKU">
                    <div>
                        <ui-tip :content="row.sku" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        min-width="120"
                        label="商品名称（规格）">
                    <span>{{row.goods_name}}</span>
                </el-table-column>
                <el-table-column
                        inline-template
                        min-width="60"
                        label="申请数量">
                    <div v-if="searchData.status===1">
                        <integer-input :min="1" v-model="row.quantity"></integer-input>
                    </div>
                    <div v-else>{{row.quantity}}</div>
                </el-table-column>
                <el-table-column
                        v-show="searchData.status === 2"
                        inline-template
                        min-width="60"
                        label="备货数量">
                    <div>{{row.in_quantity}}</div>
                </el-table-column>
                <el-table-column inline-template
                                 label="已锁定数"
                                 min-width="50">
                    <div>
                        <ui-tip :content="row.status_txt === '待确认' ? row.allocated_qty_sum : row.allocated_qty"
                                :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column inline-template
                                 label="备货仓库存"
                                 v-if="searchData.status === 1"
                                 min-width="50">
                    <div>
                        <ui-tip :content="row.stocks_quantity" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column inline-template
                                 v-if="searchData.status === 1"
                                 label="日均销量"
                                 min-width="50">
                    <div>
                        <ui-tip :content="row.sku_daily_sales" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column inline-template
                                 label="采购在途"
                                 min-width="50">
                    <div>
                        <ui-tip :content="row.status_txt === '待确认' ? row.purchase_intransit_qty : row.purchase_intransit_qty_return"
                                :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column inline-template
                                 label="调拨在途"
                                 min-width="50">
                    <div>
                        <ui-tip :content="row.transfer_intransit_quantity" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        min-width="60"
                        label="平台">
                    <div>{{row.channel}}</div>
                </el-table-column>
                <el-table-column
                        inline-template
                        min-width="80"
                        label="备货仓库">
                    <div>{{row.warehouse}}</div>
                </el-table-column>
                <el-table-column
                        min-width="80"
                        inline-template
                        label="中转仓库">
                    <div>{{row.transit_warehouse}}</div>
                </el-table-column>
                <el-table-column
                        inline-template
                        min-width="50"
                        label="状态">
                    <div>{{row.status_txt}}</div>
                </el-table-column>
                <el-table-column
                        inline-template
                        min-width="60"
                        label="创建人">
                    <div>{{row.creator}}</div>
                </el-table-column>
                <el-table-column
                        inline-template
                        min-width="140"
                        label="创建时间">
                    <div>
                        <ui-tip :content="row.create_time | timeFilter" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="操作" min-width="100">
                    <div>
                        <span class="disabled" v-if="row.status_txt !== '待确认'">确认备货</span>
                        <permission tag="span" :route="apis.url_stocking_batch_sure" class="operate"
                                    @click="make_sure(row)" v-else>确认备货
                        </permission>
                        <permission tag="span" :route="apis.url_stocking_batch_delete">|</permission>
                        <span class="disabled" v-if="row.status_txt !== '待确认'">移除</span>
                        <permission tag="span" :route="apis.url_stocking_batch_delete" class="operate"
                                    @click="make_delete(row)" v-else>移除
                        </permission>
                    </div>
                </el-table-column>
            </el-table>
        </el-row>
        <el-pagination
                class="page-fixed"
                @size-change="change_size"
                @current-change="change_page"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count">
        </el-pagination>
        <stock-confirm v-model="confirmVisible" :ready-inventory-list="readyInventoryList"
                       @make-sure="stock_sure"></stock-confirm>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {
        api_apply_list, api_stocking_batch_sure, api_stocking_batch_delete, api_related_plan,
        url_stocking_batch_sure, url_stocking_batch_delete
    } from '@/api/stocking';

    export default {
        permission: {
            url_stocking_batch_sure,
            url_stocking_batch_delete
        },
        page: {},
        refresh() {
            this.init();
        },
        data() {
            return {
                searchData: {
                    code: '',
                    warehouse_id: '',
                    status: 1,
                    name_type: 1,
                    name: '',
                    channel_id: '',
                    creator_id: '',
                    time_st: '',
                    time_nd: '',
                    page: 1,
                    pageSize: 50,
                },
                count: 0,
                tableData: [],
                isLoading: false,
                isCleared: false,
                confirmVisible: false,
                selectIds: [],
                selectData: [],
                readyInventoryList: [],
                sureData: [],
                loading: false,
            }
        },
        created() {
            // this.init();
        },
        methods: {
            clear() {
                this.isCleared = true;
            },
            init() {
                this.searchData.code = this.searchData.code.trim();
                if (this.searchData.time_st) {
                    let date_b_s = datef('YYYY-MM-dd', this.searchData.time_st / 1000);
                    this.searchData.time_st = date_b_s;
                } else {
                    this.searchData.time_st = '';
                }
                if (this.searchData.time_nd) {
                    let date_e_s = datef('YYYY-MM-dd', this.searchData.time_nd / 1000);
                    this.searchData.time_nd = date_e_s;
                } else {
                    this.searchData.time_nd = '';
                }
                if (this.isCleared) {
                    this.searchData.page = 1;
                    this.searchData.pageSize = 50;
                    this.isCleared = false;
                }
                let data = clone(this.searchData);
                let cur = data.name.split('\n').filter(row => !!row);
                if (data.name.length > 0) {
                    data.name = cur.map(row => {
                        return row.trim();
                    });
                } else {
                    data.name = '';
                }
                this.loading = true;
                this.$http(api_apply_list, data).then(res => {
                    this.tableData = res.list;
                    this.count = res.count;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    this.loading = false;
                });
            },
            search(param) {
                Object.assign(this.searchData, param);
                this.init();
            },
            change_size(size) {
                this.searchData.pageSize = size;
                this.init();
            },
            change_page(page) {
                this.searchData.page = page;
                this.init();
            },
            sku_image(images) {
                if (!!images) {
                    return images.replace('_60x60.', '_200x200.')
                }
                return ""
            },
            select_items(data) {
                this.selectIds = data.map(res => {
                    return res.id;
                });
                this.selectData = data;
            },
            batch_sure() {
                this.sureData = [];
                let id = [];
                let warehouse_id = 0;
                let transit_warehouse_id = 0;
                let canRelated = true;
                let batchData = this.selectData.filter(row => row.status === 1);
                if (batchData.length === 0) {
                    this.$message({type: 'error', message: '请选择待确认的备货申请单'});
                    this.$reqKey('apply_list_batch_sure', false);
                    return;
                }
                batchData.forEach((item, index) => {
                    if (index === 0) {
                        warehouse_id = item.warehouse_id;
                        transit_warehouse_id = item.transit_warehouse_id;
                    } else {
                        if (item.warehouse_id !== warehouse_id || item.transit_warehouse_id !== transit_warehouse_id) {
                            this.$message({
                                type: 'error',
                                message: '只有备货仓库和中转仓库都相同才能确认备货！'
                            });
                            canRelated = false;
                            this.$reqKey('apply_list_batch_sure', false);
                            return;
                        }
                    }
                    if (item.quantity.toString().trim() === '' || item.quantity.toString().trim() === '0') {
                        this.$message({type: 'error', message: `备货数量不能为空或0！`});
                        canRelated = false;
                        this.$reqKey('apply_list_batch_sure', false);
                        return;
                    }

                    this.sureData.push({
                        id: item.id,
                        quantity: item.quantity,
                    });
                    id.push(item.id);
                });
                if (canRelated) {
                    let data = {
                        id: id
                    };
                    this.related_plan(data);
                } else {
                    this.sureData = [];
                }
            },
            make_sure(row) {
                this.sureData = [];
                this.sureData.push({
                    id: row.id,
                    quantity: row.quantity,
                });
                let data = {id: [row.id]};
                this.related_plan(data);
            },
            related_plan(data) {//批量确认备货
                this.$http(api_related_plan, data).then(res => {
                    if (res.length === 0) {
                        this.stock_sure(0);
                    } else {
                        this.confirmVisible = true;
                        this.readyInventoryList = res;
                    }
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code,
                    });
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('apply_list_batch_sure', false);
                    }, 200)
                });
            },
            stock_sure(id) {
                let params = {
                    data: this.sureData,
                    ready_inventory_id: id,
                }
                let message = this.sureData.length === 1 ? '您将确认备货该备货申请单,确认此操作吗?' : '您将批量确认备货,确认此操作吗?';
                this.$confirm(message, "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_stocking_batch_sure, params).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        this.confirmVisible = false;
                        if (this.sureData.length === 1) {
                            this.sureData.forEach(row => {
                                let index = this.tableData.findIndex(item => {
                                    return item.id === row.id;
                                });
                                this.tableData.splice(index, 1);
                                this.count = this.count - 1;
                            });
                        } else {
                            this.sureData.forEach(row => {
                                let index = this.tableData.findIndex(item => {
                                    return item.id === row;
                                });
                                this.tableData.splice(index, 1);
                                this.count = this.count - 1;
                            });
                        }
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    });
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消操作"
                    });
                });
            },
            make_delete(row) {
                let id = [];
                id.push(row.id);
                let data = {
                    id: id
                };
                this.$confirm(`您将移除该备货申请单,确认此操作吗?`, "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_stocking_batch_delete, data).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        data.id.forEach(row => {
                            let index = this.tableData.findIndex(item => {
                                return item.id === row;
                            });
                            this.tableData.splice(index, 1);
                            this.count = this.count - 1;
                        });
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    });
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消操作"
                    });
                });
            },
            batch_delete() {
                let data = {
                    id: this.selectData.filter(row => row.status === 1).map(row => row.id)
                };
                if (data.id.length === 0) {
                    this.$message({type: 'error', message: '请选择待确认的备货申请单'});
                    this.$reqKey(`apply_list_batch_delete`, false);
                    return;
                }
                this.$confirm(`您将批量移除备货申请单,确认此操作吗?`, "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_stocking_batch_delete, data).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        data.id.forEach(row => {
                            let index = this.tableData.findIndex(item => {
                                return item.id === row;
                            });
                            this.tableData.splice(index, 1);
                            this.count = this.count - 1;
                        });
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey(`apply_list_batch_delete`, false);
                        }, 200);
                    });
                }).catch(() => {
                    this.$reqKey(`apply_list_batch_delete`, false);
                    this.$message({
                        type: "info",
                        message: "已取消操作"
                    });
                });
            }
        },
        filters: {
            timeFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
        },
        components: {
            cardSearch: require('./card-search.vue').default,
            stockConfirm: require('./stock-confirm.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
        }
    }
</script>
