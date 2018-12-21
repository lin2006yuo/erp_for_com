<template>
    <div>
        <el-table
                ref="multipleTable"
                element-loading-text="玩命加载中......"
                class="scroll-bar"
                v-loading="isLoading"
                highlight-current-row
                v-resize="{height:65}"
                :data="tables"
                @selection-change="select_items">
            <el-table-column
                    align="center"
                    type="selection"
                    width="30">
            </el-table-column>
            <el-table-column
                    align="center"
                    inline-template
                    width="65"
                    label="图片">
                <el-popover
                        placement="right"
                        trigger="hover">
                    <img v-lazy="sku_image(row.thumb)"
                         width="200px"
                         height="200px">
                    <span slot="reference">
                        <img v-lazy="row.thumb" height="60px" width="60px" style="border:none">
                    </span>
                </el-popover>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="60"
                    label="SKU/SKU别名">
                <el-popover
                        placement="right"
                        v-if="row.spu_name"
                        trigger="hover">
                    <span>{{row.spu_name}}</span>
                    <div slot="reference">
                        <div>
                            <span title="点击可查看商品详情" class="operate" @click="look(row)">{{row.sku}}</span>
                        </div>
                        <div>{{row.sku_alias || ''}}</div>
                    </div>
                </el-popover>
                <div v-else>
                    <div>
                        <span title="点击可查看商品详情" class="operate" @click="look(row)">{{row.sku}}</span>
                    </div>
                    <div>{{row.sku_alias || ''}}</div>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="55"
                    label="平台SKU">
                <div>{{row.thirdparty_goods_sku}}</div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="80"
                    :render-header="ASIN_FNSKU"
            >
                <div>
                    <div>{{row.asign_sku}}</div>
                    <div>{{row.fn_sku}}</div>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="50"
                    label="(当前/平台)库存">
                <div>{{`${row.quantity}/${row.channel_quantity}`}}</div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="40"
                    label="不可售/可售">
                <div>{{`${row.third_defects_quantity}/${row.third_avaliable_quantity}`}}</div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="40"
                    label="待发数">
                <div>{{row.waiting_shipping_quantity}}</div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="45"
                    label="调拨在途">
                <div>{{row.allocating_quantity}}</div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="40"
                    label="中转仓">
                <div>{{row.transit_quantity}}</div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="40"
                    label="采购在途">
                <div>{{row.instransit_quantity}}</div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="40"
                    label="等待采购">
                <div>{{row.waiting_purchase_quantity}}</div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="40"
                    label="备货建议">
                <div>{{row.proposal_stocking_quantity}}</div>
            </el-table-column>
            <!--<el-table-column
                    inline-template
                    min-width="40"
                    label="缺货数">
                <div>{{row.transit_quantity}}</div>
            </el-table-column>-->
            <el-table-column
                    inline-template
                    min-width="40"
                    label="单价(￥)">
                <div>{{row.per_cost}}</div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="40"
                    label="日均销量">
                <div class="inline">
                    <span title="点击可查看图表详情" class="operate" @click="analyze(row)">{{row.average_daily_sales}}</span>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="40"
                    label="预警数">
                <div>{{row.alert_quantity}}</div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="40"
                    label="故障品">
                <div>{{row.defects_quantity}}</div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="40"
                    label="库龄(天)">
                <div>{{row.age}}</div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="40"
                    label="销售时间">
                <div>{{row.latest_delivery_time}}</div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="操作" min-width="110">
                <div>
                    <trends-select class="inline"
                                   @trigger="action(row,$event)"
                                   :selects="m_option(row)"
                                   type="primary">
                    </trends-select>
                </div>
            </el-table-column>
        </el-table>
        <show-dialog ref="number"
                     :isFba="isFba"
                     v-model="dialogShow"
                     :title="title"
                     @save-apply="save_apply"
                     @save-alert="save_alert"
                     @save-lend="save_lend"
                     @add-data="add_data"
                     :channel-data="channelData"
                     :alert-quantity="alertQuantity"
                     :value-show="valueShow"></show-dialog>
        <allocation-dialog v-model="allocationShow" :title="title" @refresh-data="refresh_data" :allot-data="allotData"
                           @update-list="update_list"></allocation-dialog>
        <detail-dialog v-model="detailShow" :row="rowDetail"></detail-dialog>
        <operate-dialog v-model="operateShow" :logs-data="logsData" @update-data="update_data"></operate-dialog>
        <add-goods v-model="goodsDialog" ref="addGoods" @selected="goods_submit"></add-goods>
        <analyze v-model="analyzeDialog" :form="analyzeData"></analyze>
        <look-edit v-model="lookVisible"
                   :edit-able="false"
                   :goodsId="goodsId"
                   ref="looks"
                   :child-active-name="activeName"
                   @change-data="change_data"></look-edit>
    </div>
</template>
<style lang="stylus" scoped>

</style>
<script>

    import {
        api_overseas_stock,
        api_change_alert,
        api_get_apply,
        api_get_lend,
        api_get_logs,
        api_get_allot,
        api_warehouse_goods_apply,
        url_change_alert,
        url_get_apply,
        url_get_lend,
        url_get_logs,
        url_get_allot
    } from '@/api/overseas-stock';

    export default {
        data() {
            return {
                selectedIds: [],
                isLoading: this.value,
                dialogShow: false,
                allocationShow: false,
                detailShow: false,
                operateShow: false,
                goodsDialog: false,
                valueShow: 2,
                title: '',
                selectCategories: 0,
                selectedIds: [],
                skuIdData: [],
                ids: [],
                alertQuantity: '',
                rowDetail: {},
                logsData: {},
                allotData: {},
                channelData: [],
                isFba: true,
                analyzeDialog: false,
                analyzeData: {},
                lookVisible: false,
                goodsId: 0,
                activeName: '',
            }
        },
        mounted() {
        },
        methods: {
            analyze(data) {
                this.analyzeData = {sku: data.sku, sku_id: data.sku_id, warehouse_id: data.warehouse_id};
                this.analyzeDialog = true;
            },
            select_items(items) {
                console.log('select change', items);
                this.selectedIds = items.map(res => {
                    return res.id;
                });
                this.skuIdData = items;
            },
            change_number() {
                this.valueShow = 1;
                this.$refs.number.number = '';
                this.title = '修改预警数量';
                this.ids = [];
                this.dialogShow = true;
            },
            apply_stock() {
                this.ids = '';
                this.channelData = [];
                this.channelData = this.skuIdData.map(data => {
                    return {
                        id: data.id,
                        sku_id: data.sku_id,
                        sku: data.sku,
                        thumb: data.thumb,
                        spu_name: data.spu_name,
                    }
                });
                this.dialogShow = true;
                this.valueShow = 2;
                this.title = '提交备货申请';
            },
            action(data, options) {
                switch (options.value) {
                    case 1:
                        this.channelData = [];
                        this.title = `${data.sku}分配库存`;
                        this.get_allot(data.id);
                        break;
                    case 2:
                        this.valueShow = 3;
                        this.channelData = [];
                        this.title = `${data.sku}借调库存`;
                        this.ids = '';
                        this.ids = data.sku_id;
                        this.alertQuantity = '';
                        this.dialogShow = true;
                        break;
                    case 3:
                        this.valueShow = 2;
                        this.channelData = [];
                        this.$refs.multipleTable.clearSelection();
                        this.channelData.push(
                            {
                                id: data.id,
                                sku_id: data.sku_id,
                                sku: data.sku,
                                thumb: data.thumb,
                                spu_name: data.spu_name,
                            });
                        this.title = '提交备货申请';
                        this.dialogShow = true;
                        break;
                    case 4:
                        this.valueShow = 1;
                        this.title = `修改SKU：${data.sku}预警数量`;
                        this.ids = [];
                        this.channelData = [];
                        this.$refs.multipleTable.clearSelection();
                        this.ids.push(data.id);
                        this.alertQuantity = data.alert_quantity;
                        this.dialogShow = true;
                        break;
                    case 5:
                        this.rowDetail = data;
                        this.detailShow = true;
                        break;
                    case 6:
                        this.title = '操作日志';
                        this.operateShow = true;
                        let param = {
                            sku_id: data.sku_id,
                            warehouse_id: this.warehouse_id,
                            page: 1,
                            pageSize: 10,
                        };
                        this.get_logs(param, 1);
                        break;
                }
            },
            m_option(row) {
                return row.operateButtons.filter(res => {
                    return this.$hasPermission(res.apis);
                })
            },
            sku_image(val) {
                return val.replace("_60x60", "_200x200");
            },
            ASIN_FNSKU(h) {
                return h('div', [h('div', 'ASIN'), h('div', 'FNSKU')]);
            },
            save_apply(data) {
                let param = {
                    warehouse_id: this.warehouse_id,
                    details: data.details,
                    channel_id: data.channel_id,
                    transit_warehouse_id: data.transit_warehouse_id,
                };
                this.get_apply(param);
            },
            get_apply(data) {
                this.$http(api_get_apply, data).then(res => {
                    this.dialogShow = false;
                    this.$message({type: 'success', message: res.message || res});
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                }).finally(() => {
                    this.$reqKey('applyAdd', false);
                }, 200);
            },
            save_alert(number) {
                if (this.selectedIds.length > 0) {
                    let data = {
                        ids: this.selectedIds,
                        value: number,
                    };
                    this.change_alert(data);
                    return;
                }
                if (this.ids.length === 1) {
                    let data = {
                        ids: this.ids,
                        value: number,
                    };
                    this.change_alert(data);
                }
            },
            change_alert(data) {
                this.$http(api_change_alert, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    data.ids.forEach(row => {
                        this.tables.forEach(item => {
                            if (item.id === row) {
                                item.alert_quantity = data.value;
                            }
                        });
                    });
                    this.dialogShow = false;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                }).finally(() => {
                    this.$reqKey('alertAdd', false);
                }, 200);
            },
            save_lend(data) {
                let params = {
                    sku_id: this.ids,
                    from_channel_id: data.from_channel_id,
                    to_channel_id: data.to_channel_id,
                    quantity: data.quantity,
                    warehouse_id: this.warehouse_id,
                };
                this.$http(api_get_lend, params).then(res => {
                    this.dialogShow = false;
                    this.$message({type: 'success', message: res.message || res});
                    this.tables.forEach(item => {
                        if (item.sku_id === this.ids) {
                            if (data.from_channel_id === 1) {
                                item.ebay_quantity = Number(item.ebay_quantity) - Number(data.quantity);
                            } else if (data.from_channel_id === 2) {
                                item.amazon_quantity = Number(item.amazon_quantity) - Number(data.quantity);
                            } else if (data.from_channel_id === 3) {
                                item.wish_quantity = Number(item.wish_quantity) - Number(data.quantity);
                            } else if (data.from_channel_id === 4) {
                                item.aliExpress_quantity = Number(item.aliExpress_quantity) - Number(data.quantity);
                            }
                            if (data.to_channel_id === 1) {
                                item.ebay_quantity = Number(item.ebay_quantity) + Number(data.quantity);
                            } else if (data.to_channel_id === 2) {
                                item.amazon_quantity = Number(item.amazon_quantity) + Number(data.quantity);
                            } else if (data.to_channel_id === 3) {
                                item.wish_quantity = Number(item.wish_quantity) + Number(data.quantity);
                            } else if (data.to_channel_id === 4) {
                                item.aliExpress_quantity = Number(item.aliExpress_quantity) + Number(data.quantity);
                            }
                        }
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                }).finally(() => {
                    this.$reqKey('lendAdd', false);
                }, 200);
            },
            add_data() {
                this.goodsDialog = true;
            },
            refresh_data(id, apply_id) {
                let data = {
                    apply_id: apply_id,
                };
                this.$http(api_get_allot, id, data).then(res => {
                    this.allotData = res;
                    this.$set(this.allotData, 'id', id);
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            update_list(id, details) {
                this.tables.forEach(item => {
                    if (item.id === id) {
                        details.forEach(row => {
                            if (row.channel_id === 1) {
                                item.ebay_quantity = Number(item.ebay_quantity) + Number(row.allot_quantity);
                            } else if (row.channel_id === 2) {
                                item.amazon_quantity = Number(item.amazon_quantity) + Number(row.allot_quantity);
                            } else if (row.channel_id === 3) {
                                item.wish_quantity = Number(item.wish_quantity) + Number(row.allot_quantity);
                            } else if (row.channel_id === 4) {
                                item.aliExpress_quantity = Number(item.aliExpress_quantity) + Number(row.allot_quantity);
                            }
                        });
                    }
                });
            },
            update_data(data, list_type) {
                let param = {
                    list_type: list_type,
                    sku_id: data.sku_id,
                    warehouse_id: this.warehouse_id,
                    page: data.page,
                    pageSize: data.pageSize,
                };
                console.log(data);
                console.log(list_type);
                this.get_logs(param, list_type);
            },
            get_logs(data, list_type) {
                let params = {
                    list_type: list_type,
                    sku_id: data.sku_id,
                    warehouse_id: this.warehouse_id,
                    page: data.page,
                    pageSize: data.pageSize,
                };
                this.$http(api_get_logs, params).then(res => {
                    this.logsData = res;
                    this.logsData.page = Number(res.page);
                    this.logsData.pageSize = Number(res.pageSize);
                    this.logsData.sku_id = data.sku_id;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            goods_submit(val) {
                console.log('添加数据', val);
                val.forEach(data => {
                    data.forEach(row => {
                        let find = this.channelData.find(res => res.sku_id === row.sku_id);
                        if (!find) {
                            this.channelData.unshift({
                                spu_name: row.spu_name,
                                thumb: row.thumb,
                                sku: row.sku,
                                sku_id: row.sku_id,
                                quantity: '',
                            })
                        }
                    })
                });
            },
            look(row) {
                this.$refs.looks.titleName = `查看SKU：${row.sku}  `;
                switch (row.channel_id) {
                    case 0:
                        this.activeName = "自定义图片";
                        break;
                    case 1:
                        this.activeName = 'ebay平台';
                        break;
                    case 2:
                        this.activeName = '亚马逊平台';
                        break;
                    case 3:
                        this.activeName = 'wish平台';
                        break;
                    case 4:
                        this.activeName = '速卖通平台';
                        break;
                }
                this.goodsId = row.goods_id;
                this.lookVisible = true;
            },
            change_data() {//此处能否更新数据？

            },
        },
        watch: {
            isLoading(val) {
                this.$emit('input', val)
            },
            value(val) {
                this.isLoading = val
            },
            disabled(val) {
                this.$emit('disabled', val);
            }
        },
        computed: {
            disabled() {
                return this.selectedIds.length === 0;
            }
        },
        props: {
            tables: {
                type: Array,
            },
            value: false,
            warehouse_id: {}
        },
        components: {
            trendsSelect: require('@/components/trends-select.vue').default,
            analyze: require('@/view/procurement/purchasing/add-analyze.vue').default,
            showDialog: require('../overseas-stock/dialog.vue').default,
            allocationDialog: require('../overseas-stock/allocation-dialog.vue').default,
            detailDialog: require('../overseas-stock/detail-dialog.vue').default,
            operateDialog: require('../overseas-stock/operate-dialog.vue').default,
            addGoods: require('@/view/procurement/plan/add-goods.vue').default,
            lookEdit: require('@/view/product/manager/look-edit.vue').default,
        }
    }
</script>
