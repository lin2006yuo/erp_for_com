<template>
    <el-row class="p-paytm-order-table">
        <!--数据table-->
          <el-table
            class="scroll-bar"
            :data="dataTable"
            border
            ref="dataTable"
            :highlight-current-row="true"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            style="width: 100%"
            v-resize="{height:41}"
            @selection-change="selection_change"
        >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
              <el-table-column type="selection"></el-table-column>
              <el-table-column label="订单号" inline-template min-width="50">
                  <div class="p-table-list-td-text" :title="row.order_number|emptyByDefault">{{row.order_number|emptyByDefault}}</div>
              </el-table-column>
              <el-table-column label="账号简称" inline-template min-width="50">
                  <div class="p-table-list-td-text" :title="row.code|emptyByDefault">{{row.code|emptyByDefault}}</div>
              </el-table-column>
              <el-table-column label="买家ID" inline-template min-width="50">
                  <div class="p-table-list-td-text" :title="row.buyer|emptyByDefault">{{row.buyer|emptyByDefault}}</div>
              </el-table-column>
              <el-table-column label="销售员" inline-template min-width="50">
                  <div class="p-table-list-td-text" :title="row.seller|emptyByDefault">{{row.seller|emptyByDefault}}</div>
              </el-table-column>
              <el-table-column label="订单状态" inline-template min-width="50">
                  <div class="p-table-list-td-text" :title="row.order_status|emptyByDefault">{{row.order_status|emptyByDefault}}</div>
              </el-table-column>
              <el-table-column label="支付方式" inline-template min-width="50">
                  <div class="p-table-list-td-text" :title="row.payment_method|emptyByDefault">{{row.payment_method|emptyByDefault}}</div>
              </el-table-column>
              <el-table-column label="支付总额" inline-template min-width="50">
                  <div class="p-table-list-td-text" :title="row.pay_fee|emptyByDefault">{{row.pay_fee|emptyByDefault}}</div>
              </el-table-column>
              <el-table-column label="下单时间" inline-template min-width="50">
                  <div class="p-table-list-td-text" :title="row.order_time|dateFilter">{{row.order_time|dateFilter}}</div>
              </el-table-column>
              <el-table-column label="支付时间" inline-template min-width="50">
                  <div class="p-table-list-td-text" :title="row.pay_time|dateFilter">{{row.pay_time|dateFilter}}</div>
              </el-table-column>
              <el-table-column label="运输方式" inline-template min-width="50">
                  <div class="p-table-list-td-text" :title="row.transport_id|emptyByDefault">{{row.transport_id|emptyByDefault}}</div>
              </el-table-column>
              <el-table-column label="目的地" inline-template min-width="50">
                  <div class="p-table-list-td-text" :title="row.country_cn_name|emptyByDefault">{{row.country_cn_name|emptyByDefault}}</div>
              </el-table-column>
              <el-table-column label="跟踪单号" inline-template min-width="50">
                  <div class="p-table-list-td-text" :title="row.track_number|emptyByDefault">{{row.track_number|emptyByDefault}}</div>
              </el-table-column>
              <el-table-column label="操作" inline-template min-width="50">
                  <permission
                  tag="span"
                  :route="apis.url_get_fbp_orders_read"
                  class="operate"
                  v-permission.look="'orderWish'"
                  @click="lookOver(row)">查看
                  </permission>
              </el-table-column>
        </el-table>
        <!--查看弹框-->
        <look-detail v-model="orders" :lookList="lookList" :lookProduct="lookProduct" :payment="payment" :profit="profit" :title="title"></look-detail>
    </el-row>
</template>
<style lang="stylus">
    .p-paytm-order-table{
        .p-table-list-td-text{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
</style>
<script>
    import {get_fbp_orders_read,url_get_fbp_orders_read,url_fbp_export} from '../../../../api/order_paytm';
    import uiTable from "../../../../components/ui-table.vue"

    export default {
        permission: {
            url_fbp_export,
            url_get_fbp_orders_read
        },
        data() {
            return {
                profit: {
                    expend:{},
                    income:{},
                },
                payment:{},
                lookList: {},
                lookProduct: [],
                title:'',
                orders: false,
                checkAll: false,
                visible: false,
                tipTitle: "点击可查看 平台SKU，商品名称，ItemId，数量，出售价 等信息"
            }
        },
        filters: {
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
        computed:{
            emptyText() {
                return this.firstLoading ? '等待请求数据中...' : '暂无数据'
            }
        },
        methods: {
//            ---------------------------------   table多选
            selection_change(val) {
               this.$emit("slect-change",val)
            },
            cur_click(val) {
                window.open(`${val.buy_url}`);
            },
            addClass(data) {
                this.dataTable.forEach(item => {
                    this.$set(item, 'clickData', false);
                });
                data.clickData = true;
            },
            show_detail(data) {
                data.show = !data.show;
            },
            lookOver(row) {//----------------------查看
                this.orders = true;
                this.checkList = {};
                this.title = `查看订单： ${row.order_number} 信息`;
                this.$http(get_fbp_orders_read,{id:row.id}).then(res => {
                    this.lookList = res.receiver;
                    this.lookProduct = res.product;
                    this.payment = res.payment;
                    this.profit = res.profit;
                    this.$set(res.profit, 'order_number', row.order_number);
                    this.$set(res.profit, 'date_now', Date.now());
                }).catch(code => {
                    this.$message({
                        showClose: true,
                        message: code.message || code,
                        type: 'error'
                    });

                });

            }
        },
        props: {
            dataTable: {
                type: Array
            },
            loading: {
                required: true,
                type: Boolean
            },
            export_data: {},
            firstLoading: {
                required: true,
                type: Boolean
            }
        },
        components: {
            uiTable,
            lookDetail: require('./look-detail').default,
            uiTip: require('../../../../components/ui-tip.vue').default,
            plusMinus: require('../../../../components/plus-minus.vue').default,
            timeOut: require('../../local/time-out.vue').default,
        }
    }
</script>
