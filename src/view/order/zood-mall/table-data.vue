<template>
    <el-row class="p-jumia-order-table">
        <!--数据table-->
        <ui-table v-loading="loading"
                  element-loading-text="玩命加载中..."
                  :has-data="form.length>0"
                  :first-loading="firstLoading"
                  @sort-click="sort_click"
                  :body-height="38"
                  :heads="[
                        {label:'订单号',width:10},
                        {label:'账号简称',width:5},
                        {label:'买家姓名',width:8},
                        {label:'目的地',width:4},
                        {label:'运费',width:4},
                        {label:'出售价',width:4},
                        {label:'支付总额',width:5,isSort:true},
                        {label:'付款时间',width:8,isSort:true},
                        {label:'平台发货状态',width:8,isSort:true},
                        {label:'订单状态',width:6},
                        {label:'追踪单号',width:10},
                        {label:'下单时间',width:8,isSort:true},
                        {label:'最迟发货时间',width:6,isSort:true},
                        {label:'操作',width:3}
                       ]">
            <tbody>
            <template v-for="(data, index) in form">
                <tr class="line" :class="[data.show ? 'active' : '',data.clickData?'active-color':'']"
                    @click="add_class(data)">
                    <!--订单号-->
                    <td class="t-left" nowrap="nowrap">
                        <plus-minus @show-detail="show_detail(data)" :show="data.show" :title="tipTitle"></plus-minus>
                        <ui-tip :content="data.order_id" :width="68"></ui-tip>
                    </td>
                    <!--账号简称-->
                    <td>
                        <ui-tip :content="data.account_code" :width="88"></ui-tip>
                    </td>
                    <!--买家姓名-->
                    <td>
                        <ui-tip :content="data.receiver" :width="72"></ui-tip>
                    </td>
                    <!--目的地-->
                    <td>
                        <ui-tip :content="data.country_code" :width="88"></ui-tip>
                    </td>
                    <!--运费-->
                    <td>
                        <ui-tip :content="data.shipping_amount" :width="88"></ui-tip>
                    </td>
                    <!--出售价-->
                    <td>
                        <ui-tip :content="data.order_amount" :width="88"></ui-tip>
                    </td>
                    <!--支付总额-->
                    <td>
                        <ui-tip :content="data.order_amount" :width="88"></ui-tip>
                    </td>
                    <!--付款时间-->
                    <td>
                        <ui-tip :content="data.time_paid|dateFilter" :width="78"></ui-tip>
                    </td>
                    <!--平台发货状态-->
                    <td>
                        <ui-tip v-if="data.time_all_shipped>0" :content="data.time_all_shipped|dateFilter"
                                :width="88"></ui-tip>
                        <div v-else-if="data.time_all_shipped===0"><span>未发货</span></div>
                    </td>
                    <!--订单状态-->
                    <td>
                        <ui-tip :content="data.status|statusFilter" :width="88"></ui-tip>
                    </td>
                    <!--追踪单号-->
                    <td>
                        <ui-tip :content="data.tracking_number" :width="88"></ui-tip>
                    </td>
                    <!--下单时间-->
                    <td>
                        <ui-tip :content="data.time_created|dateFilter" :width="88"></ui-tip>
                    </td>
                    <!--最迟发货时间-->
                    <td>
                        <time-out :time="data.latest_shipped_time" :cur-status="data.shipped_on"></time-out>
                    </td>
                    <!--操作-->
                    <td>
                        <el-button type="text" @click.native="look_over(data)">查看</el-button>
                    </td>
                </tr>
                <template v-if="data.show">
                    <tr style="font-weight:bold">
                        <td colspan="2">平台SKU</td>
                        <td colspan="8">商品名称</td>
                        <td>数量</td>
                        <td>出售价</td>
                    </tr>
                    <template v-for="(row,i) in data.sku_list">
                        <tr :key="`${i}${row.sku}`">
                            <td colspan="2">
                                <ui-tip :content="row.sku" :width="88"></ui-tip>
                            </td>
                            <td colspan="8">
                                <ui-tip :content="row.product_name" :width="78"></ui-tip>
                            </td>
                            <td>{{row.quantity}}</td>
                            <td>{{row.price}}</td>
                        </tr>
                    </template>
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
    import uiTable from "../../../components/ui-table.vue"
    export default {
        data() {
            return {
                orders: false,
                checkAll: false,
                visible: false,
                checkList: {},
                tipTitle: "点击可查看 平台SKU，商品名称，ItemId，数量，出售价 等信息"
            }
        },
        filters: {
            dateFilter(val) {//-----------日期过滤
                return datef('YYYY-MM-dd HH:mm:ss', val);
            },
            statusFilter(val){
                let ret = '';
                switch (Number(val)){
                    case 1:
                        ret = '未付款';
                        break;
                    case 2:
                        ret = '已支付';
                        break;
                    case 3:
                        ret = '已发货';
                        break;
                    case 5:
                        ret = '已完成';
                        break;
                    case 9:
                        ret = '已取消';
                        break;
                    default:
                        ret = 'error'
                }
                return ret
            }
        },
        methods: {
            //            升降排序
            sort_click(val) {
                this.$emit("sort-click", val);
            },
            add_class(data) {
                this.form.forEach(item => {
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
            look_over(row) {//----------------------查看
                this.$emit('look-over',row)
            }
        },
        props: {
            form: {
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
            uiTip: require('../../../components/ui-tip.vue').default,
            plusMinus: require('../../../components/plus-minus.vue').default,
            timeOut: require('../local/time-out.vue').default,
        }
    }
</script>
