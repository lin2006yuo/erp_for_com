<template>
    <div>
        <indent-table v-loading="loading"
                      element-loading-text="玩命加载中..."
                      :has-data="tableData.length>0"
                      class="local"
                      :body-height="41"
                      :width="3830"
                      :first-loading="firstLoading"
                      :heads="[
                   //注意：更改此处size的时候需要更改indent-table标签的width宽度
                    {label:'订单号',size:301},
                    {label:'平台订单号',size:170},
                    {label:'包裹数',size:70},
                    {label:'账号简称',size:100},
                    {label:'销售员',size:80},
                    {label:'销售组长',size:100},
                    {label:'国家',size:80},
                    {label:'编码',size:70},
                    {label:'付款日期',size:170},
                    {label:'发货日期',size:170},
                    {label:'仓库类型',size:100},
                    {label:'发货仓库',size:100},
                    {label:'邮寄方式',size:300},
                    {label:'包裹号',size:300},
                    {label:'跟踪号',size:150},
                    {label:'物流商单号',size:150},
                    {label:'总售价原币',size:100},
                    {label:'渠道成交费原币',size:100},
                    {label:'币种',size:100},
                    {label:'汇率',size:100},
                    {label:'总售价',size:100},
                    {label:'渠道成交费（CNY）',size:130},
                    {label:'P卡费用',size:100},
                    {label:'商品成本',size:100},
                    {label:'物流费用',size:100},
                    {label:'包装费用',size:100},
                    {label:'头程报关费',size:110},
                    {label:'利润',size:80},
                    {label:'估算邮费',size:100},
                    {label:'货品总数',size:99}
                ]"
        >
            <tbody>
            <template v-for="(order,index) in tableData">
                <tr>
                    <!--订单号-->
                    <td class="align-left" width="301">
                        <plus-minus @show-detail="show(index, order)" :show="order.show" :title="tipTitle"></plus-minus>
                        <ui-tip :content="order.order_number" :width="80"></ui-tip>
                    </td>
                    <!--平台订单号-->
                    <td width="170">
                        <ui-tip :content="order.channel_order_number" :width="79"></ui-tip>
                    </td>
                    <!--包裹数-->
                    <td width="70">
                        <ui-tip :content="order.order_package_num" :width="89"></ui-tip>
                    </td>
                    <!--账号简称-->
                    <td width="100">
                        <ui-tip :content="order.account_code" :width="89"></ui-tip>
                    </td>
                    <!--销售员-->
                    <td width="80">
                        <ui-tip :content="order.seller_name" :width="89"></ui-tip>
                    </td>
                    <!--销售组长-->
                    <td width="100">
                        <ui-tip :content="order.team_leader_name" :width="89"></ui-tip>
                    </td>
                    <!--国家-->
                    <td width="80">
                        <ui-tip :content="order.country_code" :width="89"></ui-tip>
                    </td>
                    <!--编码-->
                    <td width="70">
                        <ui-tip :content="order.zipcode" :width="89"></ui-tip>
                    </td>
                    <!--付款日期-->
                    <td width="170">
                        <ui-tip :content="order.pay_time | timeFilter" :width="89"></ui-tip>
                    </td>
                    <!--发货日期-->
                    <td width="170">
                        <ui-tip :content="order.shipping_time | timeFilter" :width="89"></ui-tip>
                    </td>
                    <!--仓库类型-->
                    <td width="100">
                        <ui-tip :content="order.warehouse_type" :width="89"></ui-tip>
                    </td>
                    <!--发货仓库-->
                    <td width="100">
                        <ui-tip :content="order.warehouse_name" :width="89"></ui-tip>
                    </td>
                    <!--邮寄方式-->
                    <td width="300">
                        <ui-tip :content="order.shipping_name" :width="89"></ui-tip>
                    </td>
                    <!--包裹号-->
                    <td width="300">
                        <ui-tip :content="order.package_number" :width="89"></ui-tip>
                    </td>
                    <!--跟踪号-->
                    <td width="150">
                        <ui-tip :content="order.shipping_number" :width="89"></ui-tip>
                    </td>
                    <!--物流商订单号-->
                    <td width="150">
                        <ui-tip :content="order.process_code" :width="89"></ui-tip>
                    </td>
                    <!--{label:'总售价原币',size:100},-->
                    <td width="100">
                        <ui-tip :content="order.order_amount" :width="89"></ui-tip>
                    </td>
                    <!--{label:'渠道成交费原币',size:100},-->
                    <td width="100">
                        <ui-tip :content="order.channel_cost" :width="89"></ui-tip>
                    </td>
                    <!--{label:'币种',size:100},-->
                    <td width="100">
                        <ui-tip :content="order.currency_code" :width="89"></ui-tip>
                    </td>
                    <!--{label:'汇率',size:100}-->
                    <td width="100">
                        <ui-tip :content="order.rate" :width="89"></ui-tip>
                    </td>
                    <!--总售价-->
                    <td width="100">
                        <ui-tip :content="order.order_amount_CNY | toFixed2" :width="89"></ui-tip>
                    </td>
                    <!--渠道成交费（CNY）-->
                    <td width="130">
                        <ui-tip :content="order.channel_cost_CNY | toFixed2" :width="89"></ui-tip>
                    </td>
                    <!--P卡费用-->
                    <td width="100">
                        <ui-tip :content="order.p_card_cost | toFixed2" :width="89"></ui-tip>
                    </td>
                    <!--商品成本-->
                    <td width="100">
                        <ui-tip :content="order.goods_cost | toFixed2" :width="89"></ui-tip>
                    </td>
                    <!--物流费用-->
                    <td width="100">
                        <ui-tip :content="order.shipping_fee | toFixed2" :width="89"></ui-tip>
                    </td>
                    <!--包装费用-->
                    <td width="100">
                        <ui-tip :content="order.package_fee | toFixed2" :width="89"></ui-tip>
                    </td>
                    <!--头程报关费-->
                    <td width="110">
                        <ui-tip :content="order.first_fee　| toFixed2" :width="89"></ui-tip>
                    </td>
                    <!--利润-->
                    <td width="80">
                        <ui-tip :content="order.profit　|　toFixed2" :width="89"></ui-tip>
                    </td>
                    <!--估算邮费-->
                    <td width="100">
                        <ui-tip :content="order.estimated_fee　|　toFixed2" :width="89"></ui-tip>
                    </td>
                    <!--货品总数-->
                    <td width="100">
                        <ui-tip :content="order.sku_count" :width="89"></ui-tip>
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
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </div>
</template>
<style lang="stylus" scoped>

</style>
<script>
    import {api_report_paytm,api_get_orders_skus} from  '../../../../api/report-channel'
    export default {
        data(){
            return {
                tableData:[],
                loading:false,
                total:0,
                tipTitle:"点击可查看 货品 信息",
                firstLoading:true,
            }
        },
        mounted(){
        },
        filters:{
            timeFilter(val){
                if(val){
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
            toFixed2(val){
                return Number(val).toFixed(4);
            }
        },
        methods: {
            init(){
                this.loading = true;
                //处理年月日 YYYY-MM-dd
                let data=clone(this.searchData);
                if(this.searchData.time_start){
                    data.time_start=datef('YYYY-MM-dd', this.searchData.time_start/1000);
                }else {
                    data.time_start='';
                }
                if(this.searchData.time_end){
                    data.time_end=datef('YYYY-MM-dd', this.searchData.time_end/1000);
                }else {
                    data.time_end='';
                }
                this.$http(api_report_paytm, data).then(res=>{
                    this.loading = false;
                    this.tableData = res.data.map(row=>{
                        this.$set(row,'show', false);
                        return row;
                    });
                    this.total = res.count;
                    let flag = this.tableData.length <= 0;
                    if(!!flag){this.firstLoading = false};
                    this.$emit('can-export', flag);
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                    this.loading = false;
                });
            },
            //分页器
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
            show(index, order){
                order.show = !order.show;
                if(order.show&&(!order.product_list ||order.product_list.length<=0)){
                    this.$http(api_get_orders_skus, {order_id:order.id}).then(res=>{
                        this.$set(order,'product_list', res);
                    })
                }
            },
            order_product(order){
                return order.product_list || [];
            },
        },
        computed: {},
        watch: {
            searchData(){
                this.init();
            }
        },
        props: {
            searchData:{}
        },
        components: {
            uiTip:require('../../../../components/ui-tip.vue').default,
            plusMinus:require('../../../../components/plus-minus.vue').default,
            indentTable:require("../indent-table.vue").default
        },
    }
</script>
