<template>
    <div>
        <indent-table v-loading="loading"
                      element-loading-text="玩命加载中..."
                      :has-data="tableData.length>0"
                      class="local financial-table"
                      :body-height="41"
                      :width="headerWidth"
                      :first-loading="firstLoading"
                      :heads="header"
        >
            <tbody>
            <template v-for="(order,index) in tableData">
                <tr :class="{'current-row': index === curRowIndex}" @click="curRowIndex = index">
                    <!--订单号-->
                    <td
                            class="align-left"
                            :width="item.size"
                            v-for="(item, index) in header" :key="`header-${index}`"
                    >
                        <div class="financial-table-td"
                             :style="`width:${item.size-11}px`">
                            <plus-minus v-if="index === 0" @show-detail="show(index, order)" :show="order.show"
                                        :title="tipTitle"></plus-minus>
                            <div class="inline financial-table-ellipsis"
                                 :class="index===0 ? 'plus-minus-width':''"
                                 :title="handle_data(order, item)">{{handle_data(order, item)}}
                            </div>
                        </div>
                    </td>
                </tr>
                <template v-if="order.show">
                    <tr>
                        <th colspan="1" :rowspan="order_product(order).length + 1"></th>
                        <th colspan="3">货品</th>
                        <th colspan="1">货品数量</th>
                        <th colspan="1">货品成本</th>
                        <th colspan="24" :rowspan="order_product(order).length + 1"></th>
                    </tr>
                    <tr v-for="product in order_product(order)">
                        <!--SKU-->
                        <td colspan="3">
                            <ui-tip :content="product.sku" :width="98"></ui-tip>
                        </td>
                        <!--SKU数量-->
                        <td colspan="1">
                            <ui-tip :content="product.sku_quantity" :width="98"></ui-tip>
                        </td>
                        <!--商品成本-->
                        <td colspan="1">
                            <ui-tip :content="product.cost" :width="98"></ui-tip>
                        </td>
                    </tr>
                </template>
            </template>
            </tbody>
        </indent-table>
        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[10, 20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </div>
</template>
<style lang="stylus">
    .local {
        &.financial-table {
            .current-row > td {
                background-color: rgba(173,227,255,.5);
            }
        }
        .financial-table-td {
            width: 100%;
            .financial-table-ellipsis {
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                width: 100%;
            }
            .plus-minus-width {
                width: calc(100% - 32px);
            }
        }
        .ui-table-body {
            .template .secTable {
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
        .financial-table {
            th, td {
                padding: 0;
            }
        }
    }
</style>
<script>
    import {api_get_orders_skus} from '@/api/report-channel'

    export default {
        data() {
            return {
                tableData: [],
                loading: false,
                total: 0,
                tipTitle: "点击可查看 货品 信息",
                firstLoading: true,
                curRowIndex: '' //当前选中的行
            }
        },
        mounted() {
        },
        filters: {
//        	时间转换
            timeFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
            toFixed4(val) {
                return Number(val).toFixed(4);
            }
        },
        methods: {
            init() {
                this.loading = true;
                //处理年月日 YYYY-MM-dd
                let data = clone(this.searchData);
                if (this.searchData.time_start) {
                    data.time_start = datef('YYYY-MM-dd', this.searchData.time_start / 1000);
                } else {
                    data.time_start = '';
                }
                if (this.searchData.time_end) {
                    data.time_end = datef('YYYY-MM-dd', this.searchData.time_end / 1000);
                } else {
                    data.time_end = '';
                }
                this.$http(this.api, data).then(res => {
                    this.loading = false;
                    this.tableData = res.data.map(row => {
                        this.$set(row, 'show', false);
                        return row;
                    });
                    this.total = res.count;
                    let flag = this.tableData.length <= 0;
                    if (!!flag) {
                        this.firstLoading = false
                    }
                    ;
                    this.$emit('can-export', flag);
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                    this.loading = false;
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
            show(index, order) {
                order.show = !order.show;
                if (order.show && (!order.product_list || order.product_list.length <= 0)) {
                    this.$http(api_get_orders_skus, {order_id: order.id}).then(res => {
                        this.$set(order, 'product_list', res);
                    })
                }
            },
            order_product(order) {
                return order.product_list || [];
            },
            handle_data(order, header) {
                const {handle} = header
                if (handle) {
                    return handle(order[header.value])
                } else {
                    return order[header.value]
                }
            }
        },
        computed: {
            headerWidth() {
                if (!this.header.length) return 0
                else return this.header.reduce((total, cur) => {
                    return total + cur.size
                }, 0)
            },
            renderHeader() {
                return this.header.map(h => {
                    this.$set(h, 'show', false)
                    return h
                })
            }
        },
        watch: {
            searchData() {
                this.init();
            }
        },
        props: {
            searchData: {},
            api: {
                type: Function
            },
            header: {
                default: () => []
            }
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default,
            plusMinus: require('@/components/plus-minus.vue').default,
            indentTable: require("./indent-table.vue").default
        },
    }
</script>
