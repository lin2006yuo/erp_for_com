<template>
    <div class="relative">
        <el-row>
            <ui-table v-loading="isLoad"
                      element-loading-text="玩命加载中..."
                      :has-data="tables.lists.length>0"
                      class="local"
                      @sort-click="sort_click"
                      v-model="checkAll"
                      @check="change_all"
                      :body-height="65"
                      :heads="[
                    {isCheck:true,width: 2},
                    {label:'图片',width:10},
                    {label:'SKU/别名',width:10},
                    {label:'订单数',width:4},
                    {label:'库存数',width:4},
                    {label:'可用数',width:5,isSort:true},
                    {label:'待发数',width:4},
                    {label:'预警数',width:4},
                    {label:'调拨在途',width:6},
                    {label:'中转仓',width:4},
                    {label:'采购在途',width:5,isSort:true},
                    {label:'等待采购',width:6},
                    {label:'缺货数',width:4},
                    {label:'次品数',width:4},
                    {label:'单价',width:4},
                    {label:'日均销量',width:5,isSort:true},
                    {label:'库龄（天）',width:5},
                    {label: '销售时间', width:4},
                    {label:'操作',width: 10}
                ]"
            >
                <tbody>
                <template v-for="(row,index) in tables.lists">
                    <tr :key="row.id">
                        <td>
                            <el-checkbox v-model="row.isCheck" @change="change(row)"></el-checkbox>
                        </td>
                        <!-- 图片 -->
                        <td>
                            <plus-minus class="fl" @show-detail="show(index, row)" :show="row.show"
                                        :title="tipTitle"></plus-minus>
                            <el-popover
                                    placement="right"
                                    trigger="hover">
                                <img v-lazy="sku_image(row.thumb)" width="200px" height="200px">
                                <div slot="reference">
                                    <img v-lazy="row.thumb" height="60px" width="60px"
                                         style="border:none">
                                </div>
                            </el-popover>
                        </td>
                        <!-- SKU/别名 -->
                        <td>
                            <el-popover
                                    placement="right"
                                    v-if="row.spu_name"
                                    trigger="hover">
                                <span>{{row.spu_name}}</span>
                                <div slot="reference">
                                    <div>
                                        <span title="点击可查看商品详情" class="operate" @click="look(row)">{{row.sku}}</span>
                                    </div>
                                    <div>{{row.sku_alias}}</div>
                                </div>
                            </el-popover>
                            <div v-else>
                                <div>{{row.sku}}</div>
                                <div>{{row.sku_alias}}</div>
                            </div>
                        </td>
                        <!-- 订单数 -->
                        <td>{{row.product_order_quantity}}</td>
                        <!-- 库存数 -->
                        <td :class="[Number(row.quantity)<Number(row.alert_quantity)?'bg-alert':'']">
                            {{row.quantity}}
                        </td>
                        <!-- 可用数 -->
                        <td>
                            <ui-tip :content="row.available_quantity"></ui-tip>
                        </td>
                        <!-- 待发数 -->
                        <td>
                            <div>
                                <!--<ui-tip v-if="!isFBA || row.waiting_shipping_quantity === 0" :content="row.waiting_shipping_quantity"></ui-tip>
                                <span v-else class="operate" @click="available_detail(row)">
                                    {{row.waiting_shipping_quantity}}
                                </span>-->
                                {{row.waiting_shipping_quantity}}
                            </div>
                        </td>
                        <!-- 预警数 -->
                        <td>
                            <span>{{row.alert_quantity}}</span>
                        </td>
                        <!-- 调拨在途 -->
                        <td>
                            <ui-tip :content="row.allocating_quantity"></ui-tip>
                        </td>
                        <!-- 中转仓 -->
                        <td>
                            <ui-tip :content="row.transit_quantity"></ui-tip>
                        </td>
                        <!-- 采购在途 -->
                        <td>
                            <ui-tip :content="row.instransit_quantity"></ui-tip>
                        </td>
                        <!-- 等待采购 -->
                        <td>
                            <ui-tip :content="row.waiting_purchase_quantity"></ui-tip>
                        </td>
                        <!-- 缺货数 -->
                        <td>
                            <ui-tip :content="row.oos_quantity"></ui-tip>
                        </td>
                        <!-- 次品数 -->
                        <td>
                            <ui-tip :content="row.defects_quantity"></ui-tip>
                        </td>
                        <!-- 单价 -->
                        <td>
                            <div>{{row.per_cost |filterable}}</div>
                        </td>
                        <!-- 日均销量 -->
                        <td>
                            <div class="inline">
                                <span title="点击可查看图表详情" class="operate" @click="analyze(row)">{{row.average_daily_sales}}</span>
                                <!--<div class="daily_sale" v-else title="无销售量">{{row.average_daily_sales}}</div>-->
                            </div>
                        </td>
                        <!-- 库龄（天） -->
                        <td>{{row.age}}</td>
                        <!--销售时间-->
                        <td>{{row.latest_delivery_time}}</td>
                        <td>
                            <trends-select class="inline" @trigger="action(row,$event)"
                                           :selects="m_option(row)"
                                           type="primary"></trends-select>
                        </td>
                    </tr>
                    <template v-if="!!row.show">
                        <tr>
                            <th></th>
                            <th colspan="3">分区</th>
                            <th colspan="3">分区功能</th>
                            <th colspan="3">货位</th>
                            <th colspan="2">当前数量</th>
                            <th colspan="2">冻结数量</th>
                            <th colspan="4">操作</th>
                        </tr>
                        <tr v-for="item in row.data_list">
                            <td></td>
                            <td colspan="3">{{item.warehouse_area}}</td>
                            <td colspan="3">{{item.warehouse_area_type}}</td>
                            <td colspan="3">{{item.warehouse_cargo_code}}</td>
                            <td colspan="2">{{item.quantity}}</td>
                            <td colspan="3">{{item.hold_quantity}}</td>
                            <td colspan="4">
                                <el-button style="width: 95px;" size="mini"
                                           type="primary" @click="shif_operate(row,item.warehouse_cargo_id)"
                                           v-if="item.can_shift">商品移库
                                </el-button>
                                <el-button
                                        :disabled="true"
                                        style="width: 95px;cursor: not-allowed !important;"
                                        size="mini" type="primary" v-else>商品移库
                                </el-button>
                            </td>
                        </tr>
                    </template>
                </template>
                </tbody>
            </ui-table>
            <el-pagination
                    class="page-fixed"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="tables.page"
                    :page-sizes="[20, 50, 100, 200,500]"
                    :page-size="tables.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tables.count">
            </el-pagination>
        </el-row>
        <analyze v-model="analyzeDialog" :form="analyzeData"></analyze>
        <look-edit v-model="lookVisible"
                   :edit-able="false"
                   :goodsId="goodsId"
                   ref="looks"
                   :child-active-name="activeName"
                   @change-data="change_data"></look-edit>
        <available-detail v-model="availableVisible" :available-info="availableInfo"></available-detail>
    </div>
</template>
<style lang="stylus">
    .local {
        .bg-alert {
            line-height: 30px;
            color: red;
            font-weight: bold;
        }
        .ui-table-body {
            .template.secTable {
                table-layout: fixed;
                td {
                    .local-hidden-id {
                        vertical-align: middle;
                        margin: 0 0;
                        display: inline-block;
                        width: 130px;
                        text-overflow: ellipsis;
                        word-break: keep-all;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                    .local-hidden {
                        vertical-align: middle;
                        margin: 0 0;
                        display: inline-block;
                        width: 110px;
                        padding: 0 5px;
                        text-overflow: ellipsis;
                        word-break: keep-all;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                    .local-hidden-xs {
                        vertical-align: middle;
                        margin: 0 0;
                        display: inline-block;
                        width: 73px;
                        padding: 0 5px;
                        text-overflow: ellipsis;
                        word-break: keep-all;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }
            }
        }
    }

</style>
<script>
    import {api_local_detail, api_shipping_detail} from '@/api/local';

    export default {
        data() {
            return {
                checkAll: false,
                clickData: [],
                tipTitle: "点击可查看 分区，分区功能，货位，当前数量，冻结数量等信息",
                analyzeDialog: false,
                analyzeData: {},
                lookVisible: false,
                goodsId: 0,
                activeName: '',
                availableVisible: false,
                availableInfo: {},
            }
        },
        mounted() {
            for (let i = 0; i < this.tables.lists.length; i++) {
                this.clickData.push(false)
            }
        },
        filters: {
            filterable(val) {
                if (val) return parseFloat(val).toFixed(2);
            }
        },
        methods: {
            analyze(data) {
                this.analyzeData = {sku: data.sku, sku_id: data.sku_id, warehouse_id: data.warehouse_id};
                this.analyzeDialog = true;
            },
            sku_image(images) {
                if (!!images) {
                    return images.replace('_60x60.', '_200x200.')
                }
                return ""
            },
//            操作的值
            m_option(row) {
                return row.operateButtons.filter(res => {
                    return this.$hasPermission(res.apis);
                });
            },
            change_all(val) {
                let data = [];
                this.tables.lists.forEach(row => {
                    row.isCheck = val;
                    data.push(row);
                });
                this.$emit("check-box-change", data);
            },
            shif_operate(data, id) {
                this.$emit("shif-operate", data, id);
            },
            handleSizeChange(size) {
                this.checkAll = false;
                this.$emit("size-change", size);
            },
            handleCurrentChange(page) {
                this.checkAll = false;
                this.$emit("page-change", page);
            },
            action(data, options) {
                this.$emit('action', data, options);
            },
            change() {
                if (this.tables.lists.length > 0) {
                    let notCheckAll = !this.tables.lists.find(row => !row.isCheck);
                    this.checkAll = notCheckAll;
                }
                this.$emit("check-box-change", this.activeData);
            },
            change_data() {//此处能否更新数据？

            },
            show(index, row) {
                row.show = !row.show;
                if (row.show) {
                    this.$http(api_local_detail, row.id).then(res => {
                        this.$set(row, 'data_list', res);
                    })
                }
            },
            order_product(order) {
                return order.product_list || [];
            },
            addClass(index) {
                this.clickData = this.clickData.map(() => {
                    return false
                });
                this.clickData[index] = true
            },
            sort_click(val) {// 单列排序
                let key = '';
                switch (val.label) {
                    case '可用数':
                        key = 'available_quantity';
                        break;
                    case '采购在途':
                        key = 'instransit_quantity';
                        break;
                    case '日均销量':
                        key = 'average_daily_sales';
                        break;
                }
                this.$emit('sort-click', key, val.order)
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
            available_detail(row) {
                let data = {
                    sku_id: row.sku_id,
                    warehouse_id: this.warehouse_id,
                };
                this.$http(api_shipping_detail, data).then(res => {
                    this.availableInfo.table = res;
                    this.availableInfo.title = `SKU${row.sku}待发数明细`;
                    this.availableVisible = true;
                })
            }
        },
        computed: {
            activeData() {
                let curList = [];
                if (this.tables.lists && this.tables.lists.length > 0) {
                    curList = this.tables.lists.filter(row => row.isCheck === true);
                }
                return curList;
            },
            isFBA() {
                return this.warehouse_id === 187;
            }
        },
        props: {
            tables: {
                required: true,
                type: Object
            },
            isLoad: {
                required: true,
                type: Boolean
            },
            warehouse_id: {}
        },
        components: {
            selectButtons: require('@/components/select-buttons.vue').default,
            analyze: require('@/view/procurement/purchasing/add-analyze.vue').default,
            uiTable: require("@/components/ui-table.vue").default,
            trendsSelect: require('@/components/trends-select.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            plusMinus: require('@/components/plus-minus.vue').default,
            lookEdit: require('@/view/product/manager/look-edit.vue').default,
            availableDetail: require('./available-detail.vue').default,
        }
    }
</script>
