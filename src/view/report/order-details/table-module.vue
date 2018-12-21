<template>
    <div class="p-commodity-table">
        <el-table :data="tableData"
                  v-resize="{height:41}"
                  class="table-module"
                  v-loading="loading"
                  element-loading-text="玩命加载中"
                  show-summary
                  highlightCurrentRow>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                <span>{{firstLoading?'请查询数据！':'暂无数据'}}</span>
            </div>
            <el-table-column
                    inline-template
                    width="100"
                    label="发货时间">
                <div>
                    <ui-tip :content="row.shipping_time | timeFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="70"
                    label="是否补发">
                <div>
                    <ui-tip :content="row.is_reissue" :width="98"></ui-tip>
                </div>
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
                    width="80"
                    label="发货数量">
                <div>
                    <ui-tip :content="row.sku_quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="商品重量">
                <div>
                    <ui-tip :content="row.weight" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="60"
                    label="平台">
                <div>
                    <ui-tip :content="row.channel_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="70"
                    label="平台账号">
                <div>
                    <ui-tip :content="row.channel_account_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="站点">
                <div>
                    <ui-tip :content="row.site_code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="发货仓库">
                <div>
                    <ui-tip :content="row.warehouse_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="140"
                    label="包裹号">
                <div>
                    <ui-tip :content="row.number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="140"
                    label="邮寄方式">
                <div>
                    <ui-tip :content="row.shipping_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="包裹总重量">
                <div>
                    <ui-tip :content="row.package_weight | toFixed0" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="包裹总运费">
                <div>
                    <ui-tip :content="row.shipping_fee | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="跟踪号">
                <div>
                    <ui-tip :content="row.shipping_number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="订单号">
                <div>
                    <ui-tip :content="row.order_number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="Item ID">
                <div>
                    <ui-tip :content="row.channel_item_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="买家ID">
                <div>
                    <ui-tip :content="row.buyer_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="买家姓名">
                <div>
                    <ui-tip :content="row.buyer" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="国家">
                <div>
                    <ui-tip :content="row.country_code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="收货地址">
                <div>
                    <ui-tip :content="row.address" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="城市">
                <div>
                    <ui-tip :content="row.city" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="省/州">
                <div>
                    <ui-tip :content="row.province" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="邮编">
                <div>
                    <ui-tip :content="row.zipcode" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="电话">
                <div>
                    <ui-tip :content="row.tel" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="完整地址">
                <div>
                    <ui-tip :content="row.full_address" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="付款日期">
                <div>
                    <ui-tip :content="row.pay_time | timeFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="产品开发员">
                <div>
                    <ui-tip :content="row.developer_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="采购员">
                <div>
                    <ui-tip :content="row.purchaser_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="币种">
                <div>
                    <ui-tip :content="row.currency_code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="订单总售价原币">
                <div>
                    <ui-tip :content="row.goods_amount | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="110"
                    label="订单总售价CNY">
                <div>
                    <ui-tip :content="row.goods_amount_CNY | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="售价原币">
                <div>
                    <ui-tip :content="row.channel_sku_price | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="售价CNY">
                <div>
                    <ui-tip :content="row.channel_sku_price_CNY | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="商品成本">
                <div>
                    <ui-tip :content="row.cost | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="渠道成交费原币">
                <div>
                    <ui-tip :content="row.channel_cost | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="120"
                    label="渠道成交费费CNY">
                <div>
                    <ui-tip :content="row.channel_cost_CNY | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="PayPal费用">
                <div>
                    <ui-tip :content="row.paypal_fee | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="头程运输方式">
                <div>
                    <ui-tip :content="row.first_shipping_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="头程运输费">
                <div>
                    <ui-tip :content="row.first_fee | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="头程报关费">
                <div>
                    <ui-tip :content="row.tariff | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="包装费用">
                <div>
                    <ui-tip :content="row.package_fee | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="物流费用">
                <div>
                    <ui-tip :content="row.channel_shipping_free | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="利润">
                <div>
                    <ui-tip :content="row.profit | toFixed2" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="100"
                    label="利润率">
                <div>
                    <ui-tip :content="row.profit_margin" :width="98"></ui-tip>
                </div>
            </el-table-column>
        </el-table>
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
<style lang="stylus">
    .p-commodity-table {
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
            .table-module .el-table__empty-text {
                left: 13% !important;
            }
        }
    }
</style>
<script>
    import {api_get_order_details, api_export_order_details} from '../../../api/order-details'

    export default {
        data() {
            return {
                tableData: [],
                loading: false,
                total: 0,
                firstLoading:true,
            }
        },
        mounted() {
        },
        filters: {
            timeFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
            toFixed2(val) {
                return Number(val).toFixed(2);
            },
            toFixed0(val) {
                return Number(val).toFixed(0);
            }
        },
        methods: {
            init() {
                this.loading = true;
                this.searchData.order_number = this.searchData.order_number.trim();
                let data = this.deal_time(this.searchData);
                this.searchData.shipping_id.length === 1 && (data.carrier_id = this.searchData.shipping_id[0]);
                this.searchData.shipping_id.length === 2 && (data.shipping_id = this.searchData.shipping_id[1]);
                if(data.shipping_id.length === 0){
                    delete data.shipping_id;
                }
                this.$http(api_get_order_details, data).then(res => {
                    this.loading = false;
                    this.tableData = res.data.map(row => {
                        this.$set(row, 'full_address', `${row.address} ${row.city} ${row.province} ${row.zipcode} ${row.country_code}`);
                        return row;
                    });
                    this.total = res.count;
                    let flag = this.tableData.length <= 0;
                    if(!!flag){this.firstLoading = false};
                    this.$emit('can-export', flag);
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            //处理年月日
            deal_time(searchData) {
                //处理年月日 YYYY-MM-dd
                let data = clone(searchData);
                if (searchData.date_b) {
                    data.date_b = datef('YYYY-MM-dd', searchData.date_b / 1000);
                } else {
                    data.date_b = '';
                }
                if (searchData.date_e) {
                    data.date_e = datef('YYYY-MM-dd', searchData.date_e / 1000);
                } else {
                    data.date_e = '';
                }
                if(data.warehouse_id.length <= 1 ) {
                    data.warehouse_id = data.warehouse_id.join();
                }
                return data;
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
            exports() {
                let data = this.deal_time(this.searchData);
                this.searchData.shipping_id.length === 1 && (data.carrier_id = this.searchData.shipping_id[0]);
                this.searchData.shipping_id.length === 2 && (data.shipping_id = this.searchData.shipping_id[1]);
                if(data.shipping_id.length === 0){
                    delete data.shipping_id;
                }
                delete data.page;
                delete data.pageSize;
                return this.$http(api_export_order_details, data).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.$emit('exports-result', true);
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            }
        },
        computed: {},
        watch: {},
        props: {
            searchData: {}
        },
        components: {
            uiTip: require('../../../components/ui-tip.vue').default
        },
    }
</script>
