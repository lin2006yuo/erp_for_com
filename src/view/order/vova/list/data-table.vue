<template>
    <el-row>
        <!--数据table-->
        <ui-table v-loading="loading"
                  element-loading-text="玩命加载中..."
                  :has-data="dataTable.length>0"
                  :first-loading="firstLoading"
                  @sort-click="sort_click"
                  :body-height="38"
                  :heads="[
                        {label:'订单号',width:12},
                        {label:'账号简称',width:6},
                        {label:'买家姓名',width:10},
                        {label:'目的地',width:7},
                        {label:'运费',width:5},
                        {label:'出售价',width:5},
                        {label:'支付总额',width:5,isSort:true},
                        {label:'付款时间',width:10,isSort:true},
                        {label:'平台发货状态',width:8,isSort:true},
                        {label:'订单状态',width:6},
                        {label:'追踪单号',width:12},
                        {label:'下单时间',width:10,isSort:true},
                        {label:'操作',width:4}
                       ]">
            <tbody>
            <template v-for="(data, index) in dataTable">
                <tr class="line" :class="[data.show ? 'active' : '',data.clickData?'active-color':'']"
                    @click="add_class(data)">
                    <!--订单号-->
                    <td class="t-left" nowrap="nowrap">
                        <plus-minus @show-detail="show_detail(data)" :show="data.show" :title="tipTitle"></plus-minus>
                        <ui-tip :content="data.order_goods_sn" :width="68"></ui-tip>
                    </td>
                    <!--账号简称-->
                    <td>
                        <ui-tip :content="data.account_code" :width="88"></ui-tip>
                    </td>
                    <!--买家ID-->
                    <td>
                        <ui-tip :content="data.buyid" :width="72"></ui-tip>
                    </td>
                    <!--目的地-->
                    <td>
                        <ui-tip :content="data.country" :width="88"></ui-tip>
                    </td>
                    <!--运费-->
                    <td>
                        <ui-tip :content="data.shipping_fee" :width="88"></ui-tip>
                    </td>
                    <!--出售价-->
                    <td>
                        <ui-tip :content="data.shop_price_amount" :width="88"></ui-tip>
                    </td>
                    <!--支付总额-->
                    <td>
                        <ui-tip :content="data.total_amount" :width="88"></ui-tip>
                    </td>
                    <!--付款时间-->
                    <td>
                        <ui-tip :content="data.confirm_time|dateFilter" :width="78"></ui-tip>
                    </td>
                    <!--平台发货状态-->
                    <td>
                        <ui-tip :content="data.shipping_state | filterState2" :width="88"></ui-tip>
                    </td>
                    <!--订单状态-->
                    <td>
                        <ui-tip :content="data.order_state| filterState1" :width="88"></ui-tip>
                    </td>
                    <!--追踪单号-->
                    <td>
                        <ui-tip :content="data.tracking_number" :width="88"></ui-tip>
                    </td>
                    <!--下单时间-->
                    <td>
                        <ui-tip :content="data.confirm_time|dateFilter" :width="88"></ui-tip>
                    </td>
                    <!--操作-->
                    <td>
                        <el-button type="text" @click.native="look_over(data)">查看</el-button>
                    </td>
                </tr>
                <template v-if="data.show">
                    <tr style="font-weight:bold;background-color: #d6e9c6">
                        <td colspan="2">平台SKU</td>
                        <td colspan="8">商品名称</td>
                        <td>数量</td>
                        <td>单价</td>
                    </tr>
                    <tr>
                        <td colspan="2">{{data.sku}}</td>
                        <td colspan="8">{{data.goods_name}}</td>
                        <td>{{data.goods_number}}</td>
                        <td>{{data.shop_price}}</td>
                    </tr>
                </template>
            </template>
            </tbody>
        </ui-table>
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
    </el-row>
</template>
<style lang="stylus">
    .wish {
        .ui-table-body {
            .template.secTable {
                table-layout: fixed;
                .a_hover {
                    &:hover {
                        font-size: 1.2rem !important;
                        text-decoration: underline;
                    }
                }
            }
        }
    }

</style>
<script>
    import uiTable from "../../../../components/ui-table.vue"
    export default {
        data() {
            return {
                checkAll: false,
                visible: false,
                tipTitle: "点击可查看 平台SKU，商品名称，ItemId，数量，出售价 等信息"
            }
        },
        filters: {
            filterState1(val){
                let ret = '';
                switch(Number(val)){
                    case 0:
                        ret = '未确认';
                        break;
                    case 1:
                        ret = '已确认';
                        break;
                    case 2:
                        ret = '已取消';
                        break;
                    default:
                        ret = 'error'
                }
                return ret;
            },
            filterState2(val){
                let ret = '';
                switch(val){
                    case '0':
                        ret = '未发货';
                        break;
                    case '1':
                        ret = '已发货';
                        break;
                    case '2':
                        ret = '已收货';
                        break;
                    default:
                        ret = 'error'
                }
                return ret;
            },
            dateFilter(val) {//-----------日期过滤
                return datef('YYYY-MM-dd HH:mm:ss', val);
            },
            filterPayTime(val) {
                return val > 0 ? datef('YYYY-MM-dd HH:mm:ss', val) : "未付款";
            },
            filterShipped(val) {
                return val > 0 ? datef('YYYY-MM-dd HH:mm:ss', val) : "未发货";
            }
        },
        methods: {
            //            升降排序
            sort_click(val) {
                this.$emit("sort-click", val);
            },
            add_class(data) {
                this.dataTable.forEach(item => {
                    this.$set(item, 'clickData', false);
                });
                data.clickData = true;
            },
            show_detail(data) {
                data.show = !data.show;
            },
            handle_size_change(val){//切换条数
                this.$emit('handle-size-change',val)
            },
            handle_current_change(val){//切换页数
                this.$emit('handle-current-change',val)
            },
            look_over(row){
                this.$emit('look-over',row);
            },
        },
        props: {
            dataTable: {
                type: Array
            },
            loading: {
                required: true,
                type: Boolean
            },
            firstLoading: {
                required: true,
                type: Boolean
            },
            searchData: {
                type: Object
            },
            total: {
                type: Number
            },

        },
        components: {
            uiTable,
            uiTip: require('../../../../components/ui-tip.vue').default,
            plusMinus: require('../../../../components/plus-minus.vue').default,
            timeOut: require('../../local/time-out.vue').default,
        }
    }
</script>
