<template>
    <div class="p-commodity-table">
        <el-table :data="tableData"
                  v-resize="{height:41}"
                  v-loading="loading"
                  element-loading-text="玩命加载中"
                  class="table-module"
                  show-summary
                  highlightCurrentRow
                  @sort-change="sort_change">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                <span>{{firstLoading?'请查询数据！':'暂无数据'}}</span>
            </div>
            <el-table-column
                v-if='is_stay'
                inline-template
                width="100"
                key="thirdparty_goods_sku"
                label="MSKU">
                <div>
                    <ui-tip :content="row.thirdparty_goods_sku" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    width="80"
                    label="产品图片">
                <template slot-scope="scope">
                    <el-popover
                            placement="right"
                            trigger="hover">
                        <img :src="scope.row.sku_thumb | filterImage" width="200px" height="200px">
                        <span slot="reference">
                                    <img :src="scope.row.sku_thumb" v-if="scope.row.sku_thumb" height="60px" width="60px" style="border:none;vertical-align: middle">
                                </span>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="SKU">
                <div>
                    <ui-tip :content="row.sku" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="SKU别名">
                <div>
                    <ui-tip :content="row.sku_alias" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                width="100"
                v-if='is_stay'
                key="site_code"
                inline-template
                label="站点">
                <div>
                    <ui-tip :content="row.site_code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="70"
                    label="开发人员">
                <div>
                    <ui-tip :content="row.developer_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="产品名称">
                <div>
                    <ui-tip :content="row.goods_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="重量（g）">
                <div>
                    <ui-tip :content="row.weight" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="品类">
                <div>
                    <ui-tip :content="row.category" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="上架时间">
                <div>
                    <ui-tip :content="row.publish_time" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="订单数"
                    sortable>
                <div>
                    <ui-tip :content="row.order_num" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="60"
                    label="销量"
                    sortable>
                <div>
                    <ui-tip :content="row.sale_quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="上期销量">
                <div>
                    <ui-tip :content="row.last_sale_quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="销量环比">
                <div>
                    <ui-tip :content="row.sale_ring_ratio" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="140"
                    label="销量占比">
                <div>
                    <ui-tip :content="row.sale_ratio" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="130"
                    label="销售额(CNY)"
                    sortable>
                <div>
                    <ui-tip :content="row.sales_amount" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="120"
                    label="上期销售额(CNY)">
                <div>
                    <ui-tip :content="row.last_sales_amount" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="销售额环比">
                <div>
                    <ui-tip :content="row.amount_ring_ratio" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="销售额占比">
                <div>
                    <ui-tip :content="row.amount_ratio" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="平均成本(CNY)">
                <div>
                    <ui-tip :content="row.average_cost" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="130"
                    label="最新采购单价(CNY)">
                <div>
                    <ui-tip :content="row.last_purchase_price" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="平均运费(CNY)">
                <div>
                    <ui-tip :content="row.average_shipping_fee" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="128"
                    label="平均综合成本(CNY)">
                <div>
                    <ui-tip :content="row.average_mult_cost" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="利润(CNY)">
                <div>
                    <ui-tip :content="row.profit" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="平均利润(CNY)">
                <div>
                    <ui-tip :content="row.average_profit" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="利润环比">
                <div>
                    <ui-tip :content="row.profit_ring_ratio" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="利润占比">
                <div>
                    <ui-tip :content="row.profit_ratio" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="利润率">
                <div>
                    <ui-tip :content="row.profit_rate" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="可用库存">
                <div>
                    <ui-tip :content="row.available_quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="待发仓库">
                <div>
                    <ui-tip :content="row.waiting_shipping_quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="在途仓库">
                <div>
                    <ui-tip :content="row.instransit_quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="故障品保存">
                <div>
                    <ui-tip :content="row.defects_quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label=" 库存金额(CNY)">
                <div>
                    <ui-tip :content="row.stock_amt" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="周转天数">
                <div>
                    <ui-tip :content="row.turn_days" :width="98"></ui-tip>
                </div>
            </el-table-column>
        </el-table>
    </div>
</template>
<style lang="stylus">
    .p-commodity-table{
        .el-table__empty-text {
            /*left: 18% !important;*/
            position: fixed;
            top :50%;
            left :50%;
        }
        .el-table__body-wrapper {
            overflow: auto;
        }
        @media screen and (max-width: 1366px) {
            .table-module .el-table__empty-text{
                left: 20% !important;
            }
        }
    }
</style>
<script>
    export default {
        data(){
            return {

            }
        },
        mounted(){
        },
        filters:{
            toFixed2(val){
                return Number(val).toFixed(2);
            },
            toFixed0(val){
                return Number(val).toFixed(0);
            },
            filterImage(val){
                return val.replace("_60x60","_200x200");
            },
        },
        methods: {
            sort_change(val){
                this.$emit('sort-change',val);
            },
        },
        props: {
            panData:{
            	type:Boolean
            },
            tableData:{
            	type:Array
            },
            loading:{
            	type:Boolean
            },
            is_stay:{
            	type:Boolean
            },
            firstLoading:{
                type:Boolean
            }
        },
        components: {
            uiTip:require('../../../components/ui-tip.vue').default
        },
    }
</script>
