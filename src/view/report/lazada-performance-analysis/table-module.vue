<template>
    <div class="p-table-module">
        <ui-table v-loading="loading"
                  element-loading-text="玩命加载中..."
                  :has-data="tableData.data.length>0"
                  :first-loading="firstLoading"
                  v-model="checkAll"
                  :body-height="38"
                  :heads="heads">
            <tbody>
            <template v-for="(data, index) in tableData.data">
                <tr class="line" :class="[data.show ? 'active' : '',data.clickData?'active-color':'']"
                    @click="add_class(data)">

                    <td class="t-left" nowrap="nowrap" v-if="isAccount">
                        <plus-minus @show-detail="show_detail(data)" :show="data.show" title="点击可查看更多" v-if="data.account_name !== '汇总'"></plus-minus>
                        <ui-tip :content="data.account_name" :width="68"></ui-tip>
                    </td>

                    <td>
                        <ui-tip :content="data.account_seller" :width="88" v-if="isAccount"></ui-tip>
                        <ui-tip :content="data.site_name" :width="88" v-else></ui-tip>
                    </td>

                    <td>
                        <ui-tip :content="data.account_leader" :width="72" v-if="isAccount"></ui-tip>
                        <ui-tip :content="data.site_code" :width="88" v-else></ui-tip>
                    </td>

                    <td>
                        <ui-tip :content="data.order_quantity" :width="88"></ui-tip>
                    </td>

                    <td>
                        <ui-tip :content="data.delivery_order_quantity" :width="88"></ui-tip>
                    </td>

                    <td>
                        <ui-tip :content="data.delivery_sku_quantity" :width="88"></ui-tip>
                    </td>

                    <td>
                        <ui-tip :content="data.delivery_sale_amount" :width="88"></ui-tip>
                    </td>

                    <td>
                        <ui-tip :content="data.customer_price" :width="88"></ui-tip>
                    </td>

                    <td>
                        <ui-tip :content="data.profit" :width="88"></ui-tip>
                    </td>

                    <td>
                        <ui-tip :content="data.profit_rate" :width="88"></ui-tip>
                    </td>
                </tr>
                <template v-if="data.show">
                    <tr v-for="(item, index) in data.detial" :key="index">
                        <td>{{item.account_id}}</td>
                        <td>{{item.seller}}</td>
                        <td>{{item.sale_group_leader}}</td>
                        <td>{{item.order_quantity}}</td>
                        <td>{{item.delivery_order_quantity}}</td>
                        <td>{{item.delivery_sku_quantity}}</td>
                        <td>{{item.delivery_sale_amount}}</td>
                        <td>{{item.customer_price}}</td>
                        <td>{{item.profit}}</td>
                        <td>{{item.profit_rate}}</td>
                    </tr>
                </template>
            </template>
            <tr>
                <td :colspan="isAccount ? 3 : 2">汇总</td>
                <td>{{tableData.order_total}}</td>
                <td>{{tableData.delivery_total}}</td>
                <td>{{tableData.sku_total}}</td>
                <td>{{tableData.sale_total}}</td>
                <td>{{tableData.customer_total}}</td>
                <td>{{tableData.profit_total}}</td>
                <td>{{tableData.rate_total}}</td>
            </tr>
            </tbody>
        </ui-table>
        <el-pagination
                class="page-fixed"
                @size-change="$listeners['handle-size-change']"
                @current-change="$listeners['handle-current-change']"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </div>
</template>

<style lang="stylus" scoped>
    p-table-module{

    }
</style>

<script>
    export default {
        data(){
            return {
                checkAll: false
            }
        },
        filters: {
            filterTime(val){
                return datef("YYYY-MM-dd HH:mm:ss",val);
            }
        },
        methods:{
            add_class(data) {
                this.tableData.data.forEach(item => {
                    this.$set(item, 'clickData', false);
                });
                data.clickData = true;
            },
            show_detail(data) {
                data.show = !data.show;
            },
        },
        computed:{
            emptyText(){
                return this.firstLoading?'等待查询数据中...':'暂无数据'
            },
            isAccount(){
                return this.reportType === 1 ? true : false
            },
            heads(){
                if(this.reportType === 1){
                    return [
                        {label:'账号',width:12},
                        {label:'销售',width:9},
                        {label:'组长',width:9},
                        {label:'订单数',width:9},
                        {label:'发货订单数',width:12},
                        {label:'发货数',width:9},
                        {label:'销售额(CNY)',width:9},
                        {label:'客单价',width:9},
                        {label:'利润',width:9},
                        {label:'利润率',width:10}
                    ]
                }else{
                    return [
                        {label:'站点',width:10},
                        {label:'站点简称',width:10},
                        {label:'订单数',width:10},
                        {label:'发货订单数',width:13},
                        {label:'发货数',width:10},
                        {label:'销售额(CNY)',width:10},
                        {label:'客单价',width:10},
                        {label:'利润',width:10},
                        {label:'利润率',width:12}
                    ]
                }
            }
        },
        props: {
            tableData: {
                required: true,
                type: Object
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
                required: true,
                type: Object
            },
            total: {
                required: true,
                type: Number
            },
            reportType: {
                required: true,
                type: Number
            }
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default,
            plusMinus: require('@/components/plus-minus.vue').default,
            uiTable: require('@/components/ui-table').default
        }
    }
</script>