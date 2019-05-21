<template>
    <el-row class="p-walmart-order-table">
        <div>
            <el-button
                class="inline ml-sm"
                size="mini"
                type="primary"
                @click.native="catch_order">快速抓取订单
            </el-button>
        </div>
        <!--数据table-->
        <ui-table v-loading="loading"
                  class="mt-sm"
                  element-loading-text="玩命加载中..."
                  :has-data="dataTable.length>0"
                  :first-loading="firstLoading"
                  @sort-click="sort_click"
                  :body-height="38"
                  :heads="[
                        {label:'订单号',width:10},
                        {label:'账号简称',width:5},
                        {label:'买家姓名',width:10},
                        {label:'目的地',width:4},
                        {label:'运费',width:4},
                        {label:'出售价',width:5},
                        {label:'支付总额',width:5,isSort:true},
                        {label:'付款日期',width:8,isSort:true},
                        {label:'平台发货状态',width:8,isSort:true},
                        {label:'订单状态',width:6},
                        {label:'追踪单号',width:10},
                        {label:'下单时间',width:8,isSort:true},
                        {label:'最迟发货时间',width:6,isSort:true},
                        {label:'操作',width:3}
                       ]">
            <tbody>
            <template v-for="(data, index) in dataTable">
                <tr class="line" :class="[data.show ? 'active' : '',data.clickData?'active-color':'']"
                    @click="addClass(data)">
                    <!--订单号-->
                    <td class="t-left" nowrap="nowrap">
                        <plus-minus @show-detail="show_detail(data)" :show="data.show" :title="tipTitle"></plus-minus>
                        <ui-tip :content="data.order_sn" :width="68" v-copy></ui-tip>
                    </td>
                    <!--账号简称-->
                    <td>
                        <ui-tip :content="data.account_code" :width="88" v-copy></ui-tip>
                    </td>
                    <!--买家姓名-->
                    <td>
                        <ui-tip :content="data.receiver_name" :width="72"></ui-tip>
                    </td>
                    <!--目的地-->
                    <td>
                        <ui-tip :content="data.country" :width="88"></ui-tip>
                    </td>
                    <!--运费-->
                    <td>
                        <ui-tip :content="data.postage" :width="88"></ui-tip>
                    </td>
                    <!--出售价-->
                    <td>
                        <ui-tip :content="data.goods_amount" :width="88"></ui-tip>
                    </td>
                    <!--支付总额-->
                    <td>
                        <ui-tip :content="data.pay_amount" :width="88"></ui-tip>
                    </td>
                    <!--付款日期-->
                    <td>
                        <ui-tip :content="data.confirm_time | dateFilter" :width="88"></ui-tip>
                    </td>
                    <!--平台发货状态-->
                    <td>
                        <ui-tip v-if="data.shipping_time>0" :content="data.shipping_time | dateFilter " :width="88">
                        </ui-tip>
                        <div v-else="data.shipping_time===0"><span>未发货</span></div>
                    </td>
                    <!--订单状态-->
                    <td>
                        <ui-tip :content="data.order_status | statusFilter" :width="88"></ui-tip>
                    </td>
                    <!--追踪单号-->
                    <td>
                        <ui-tip :content="data.tracking_number" :width="88"></ui-tip>
                    </td>
                    <!--下单时间-->
                    <td>
                        <ui-tip :content="data.created_time | dateFilter" :width="88"></ui-tip>
                    </td>
                    <!--最迟发货时间-->
                    <td>
                        <time-out :time="data.last_ship_time" :cur-status="data.shipping_time"></time-out>
                    </td>
                    <!--操作-->
                    <td>
                        <permission
                            tag="span"
                            :route="apis.url_api_order_pdd_check"
                            class="operate"
                            v-permission.look="'orderWish'"
                            @click="lookOver(data)">查看
                        </permission>
                    </td>
                </tr>
                <template v-if="data.show">
                    <tr style="font-weight:bold">
                        <td :rowspan="data.sku_list.length+1"></td>
                        <td colspan="2">平台SKU</td>
                        <td colspan="8">商品名称</td>
                        <td>数量</td>
                        <td>出售价</td>
                        <td :rowspan="data.sku_list.length+1"></td>
                    </tr>
                    <template v-for="(row,i) in data.sku_list">
                        <tr :key="`${i}${row.sku_id}${row.goods_count}`">
                            <td colspan="2">
                                <ui-tip :content="row.sku_id" :width="88"></ui-tip>
                            </td>
                            <td colspan="8">
                                <ui-tip :content="row.goods_name" :width="78"></ui-tip>
                            </td>
                            <td>{{row.goods_count}}</td>
                            <td>{{row.goods_price}}</td>

                        </tr>
                    </template>
                </template>
            </template>
            </tbody>
        </ui-table>
        <!--快速抓取订单-->
        <look-list v-model="lookDialog"
                   :addData="addData"
                   :add-edit-site-list="addSiteList"
                   @save_order="save_order">
        </look-list>
        <!--查看弹框-->
        <order-form v-model="orders" :checkList='checkList'></order-form>
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
    import orderForm from './order-form.vue';
    import {api_order_pdd_check,
        url_api_order_pdd_check,
        api_order_pdd_getAccount,
        api_pdd_orders_getorders} from '../../../../api/order-pdd';
    import uiTable from "../../../../components/ui-table.vue"

    export default {
        permission: {
            url_api_order_pdd_check,
        },
        data() {
            return {
                addData:{
                    account_id: '',
                    stime: '',
                    etime: '',
                },
                addSiteList:[],
                lookDialog: false,
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
            timeFilter(val) {//-----------日期过滤
                return datef('YYYY-MM-dd', val);
            },
            filterPayTime(val) {
                return val > 0 ? datef('YYYY-MM-dd HH:mm:ss', val) : "未付款";
            },
            filterShipped(val) {
                return val > 0 ? datef('YYYY-MM-dd HH:mm:ss', val) : "未发货";
            },
            statusFilter(val) {
                switch (val) {
                    case 1:
                        return '待发货';
                        break;
                    case 2:
                        return '已发货';
                        break;
                    case 3:
                        return '已签收';
                        break;
                }
            }
        },
        mounted(){
            this.getAccount();
        },
        methods: {
            save_order(){//------------------抓取订单保存
                let data = window.clone(this.addData);
                if(!!this.addData.stime){
                    let d = new Date(this.addData.stime);
                    data.stime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
                }else{
                    data.stime = ''
                }
                if(!!this.addData.etime){
                    let e = new Date(this.addData.etime);
                    data.etime = e.getFullYear() + '-' + (e.getMonth() + 1) + '-' + e.getDate()
                }else{
                    data.etime = ''
                }
                this.$http(api_pdd_orders_getorders,data).then(res => {
                    this.lookDialog = false;
                    this.$message({type: 'success', message: res.data});
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('lookFormPdd', false);
                    },300)
                })
            },
            getAccount(){
                this.$http(api_order_pdd_getAccount,{channel_id:19}).then(res=>{
                    this.addSiteList = res.account;
                }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
            },
            catch_order(){//抓取订单
                this.lookDialog = true;
                this.addData = {
                    account_id: '',
                    stime: '',
                    etime: '',
                }
            },
            //            升降排序
            sort_click(val) {
                this.$emit("sort-click", val);
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
                this.$http(api_order_pdd_check, row.id).then(res => {
                    this.checkList = res;
                    this.checkList.payList = [{
                        "product_id": this.checkList.product_id,
                        "sku": this.checkList.sku,
                        "product": this.checkList.product,
                        "quantity": this.checkList.quantity,
                        "product_image_url": this.checkList.product_image_url,
                        "price": this.checkList.price,
                        "money_nuit": this.checkList.money_nuit,
                        "buy_url": this.checkList.buy_url,
                        "product_name": this.checkList.product_name
                    }];
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
            orderForm,
            uiTable,
            uiTip: require('../../../../components/ui-tip.vue').default,
            plusMinus: require('../../../../components/plus-minus.vue').default,
            timeOut: require('../../local/time-out.vue').default,
            lookList: require('./look-list.vue').default,
        }
    }
</script>
