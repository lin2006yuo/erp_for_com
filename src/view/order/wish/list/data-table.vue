<template>
    <el-row class="p-wish-order-table">
        <div>
            <!--<el-button class="inline ml-sm" size="mini" type="primary" @click.native="showImport=true">导入</el-button>-->
            <permission tag="trendsSelect"
                        class="inline ml-sm mr-sm mt-sm mb-sm"
                        type="primary"
                        :route="apis.url_wish_orders_export"
                        :selects="partAllOptions"
                        @trigger="export_excel">
            </permission>
            <request-button class="inline" :mintime="200" req-key="wish_orders_online" @click="orders_online">同步订单状态</request-button>
            <el-button type="primary" size="mini" class="inline"
                       @click.native="verification">手动核查订单
            </el-button>
            <el-button
                type="primary"
                size="mini"
                class="inline ml-sm"
                @click.native="catch_order">快速抓取订单
            </el-button>
            <el-button class="inline ml-sm" size="mini" type="primary" @click.native="showExport=true">导入结算总额数据</el-button>
        </div>
        <!--数据table-->
        <ui-table v-loading="loading" :first-loading="firstLoading" element-loading-text="玩命加载中..." :has-data="dataTable.length>0" v-model="checkAll"
                  class="wish" @sort-click="sort_click" @check="changeAll" :body-height="38"
                  :heads="[
                        {isCheck:true,size:22,},
                        {label:'订单号',width:8},
                        {label:'账号简称',width:3},
                        {label:'买家姓名',width:6},
                        {label:'付款状态',width:5,isSort:true},
                        {label:'付款时间',width:4},
                        {label:'支付总额',width:5,isSort:true},
                        {label:'目的地',width:3},
                        {label:'平台发货状态',width:6,isSort:true},
                        {label:'追踪单号',width:5},
                        {label:'订单状态',width:4},
                        {label:'下单时间',width:5,isSort:true},
                        {label:'最迟发货时间',width:6,isSort:true},
                        {label:'最迟上网时间',width:6,isSort:true},
                        {label:'放款金额',width:4},
                        {label:'放款时间',width:5},
                        {label:'退款金额',width:4},
                        {label:'操作',width:3}
                       ]">
            <tbody>
            <template v-for="(data, index) in dataTable">
                <tr class="line" :class="[data.show ? 'active' : '',data.clickData?'active-color':'']"
                    @click="addClass(data)">
                    <td><el-checkbox v-model="data.isCheck" @change="changeOne"></el-checkbox></td>
                    <td nowrap="nowrap" class="t-left">
                        <plus-minus @show-detail="show_detail(data)" :show="data.show" :title="tipTitle"></plus-minus>
                        <ui-tip :content="data.order_id" :width="78"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="data.merchant_id" :width="78"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="data.name" :width="78"></ui-tip>
                    </td>
                    <!--付款状态-->
                    <td>
                        <ui-tip :content="data.pay_status"></ui-tip>
                    </td>
                    <!--付款时间-->
                    <td>
                        <times :time="data.pay_time"></times>
                    </td>
                    <td>
                        <ui-tip :content="data.currency_code+' '+data.total_cost" :width="88"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="data.country_cn_name" :width="88"></ui-tip>
                    </td>
                    <td>
                        <times v-if="data.shipped_on" :time="data.shipped_on"></times>
                        <label v-else>未发货</label>
                    </td>
                    <td>
                        <ui-tip :content="data.tracking" :width="88"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="data.order_state" :width="88"></ui-tip>
                    </td>
                    <td>
                        <times :time="data.transaction_date"></times>
                    </td>
                    <td>
                        <time-out :time="data.uploaded_deadline" :cur-status="data.shipped_on"></time-out>
                    </td>
                    <td>
                        <span v-if="data.online===0">未上网</span>
                        <span v-if="data.online===1">已上网</span>
                        <time-out v-if="data.online>1" :time="data.online" :cur-status="0"></time-out>
                    </td>
                    <!--放款金额-->
                    <td>
                        <ui-tip v-if="data.transfer_amount>0" :content="data.transfer_amount" :width="88"></ui-tip>
                        <div v-else>--</div>
                    </td>
                    <!--放款时间-->
                    <td>
                        <times :time="data.transfer_time"></times>
                    </td>
                    <!--退款金额-->
                    <td>
                        <ui-tip v-if="data.refund_amount>0" :content="data.refund_amount" :width="88"></ui-tip>
                        <div v-else>--</div>
                    </td>
                    <td>
                        <permission
                            tag="span"
                            :route="apis.url_orderWish_check"
                            class="operate"
                            v-permission.look="'orderWish'"
                            @click="lookOver(data)">查看
                        </permission>
                    </td>
                </tr>
                <template v-if="data.show">
                    <tr style="font-weight:bold">
                        <td rowspan="2"></td>
                        <td>平台SKU</td>
                        <td colspan="8">商品名称</td>
                        <td colspan="4">ItemId</td>
                        <td>数量</td>
                        <td>出售价</td>
                        <td :rowspan="2"></td>
                    </tr>
                    <tr>
                        <td>
                            <ui-tip :content="data.sku" :width="88"></ui-tip>
                        </td>
                        <td colspan="8">
                            <ui-tip :content="data.product" :width="88"></ui-tip>
                        </td>
                        <td colspan="4">
                            <ui-tip :content="data.product_id" :is-link="true" @cur-click="cur_click(data)"></ui-tip>
                        </td>
                        <td>{{data.quantity}}</td>
                        <td>{{data.currency_code}}&nbsp;{{data.price}}</td>
                    </tr>
                </template>
            </template>
            </tbody>
        </ui-table>
        <!--快速抓取订单-->
        <look-list v-model="lookDialog"
                   @add_ymx = "add_ymx"
                   :addData = "addData"
                   :add-edit-site-list="addEditSiteList">
        </look-list>
        <!--查看弹框-->
        <order-form v-model="orders" :checkList='checkList'></order-form>
        <export-dialog v-model="visible"></export-dialog>
        <verification-order v-model="verificationDialog" cur-platform="Wish"></verification-order>
        <!--放款数据导入-->
        <import-txt v-model="showExport"
                    @files-update="files_update"
                    :export-api="export_transfer_template"
                    :import-api="import_transfer"
                    :select-list="selectedList">
        </import-txt>
        <import-excel v-model="showImport" @files-update="files_update" :export-api="export_transfer_template" :import-api="import_transfer" :select-list="selectedList">
        </import-excel>
    </el-row>
</template>
<style lang="stylus">
    .p-wish-order-table {
        .el-dropdown .el-button-group {
            display: inline-block;
            position: relative;
            top: 1px;
            left:-2px;
            margin-right -2px;
        }
    }
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
    import {
        orderWish_check,
        api_wish_orders_export,
        url_wish_orders_export,
        api_wish_orders_online,
        api_get_ebay_orders_export_transfer_template,
        api_post_ebay_orders_import_transfer,
        api_catch_wish_order,
    } from '../../../../api/order_wish';
    import {url_orderWish_check,orderWish_getAccount} from '../../../../api/order_wish';
    import uiTable from "../../../../components/ui-table.vue"

    export default {
        permission: {
            url_orderWish_check,
            url_wish_orders_export
        },
        data() {
            return {
                lookDialog: false,
                addEditSiteList:[],
                addData :{
                account_id:'',
                begin_time :'',
                end_time:'',
                },
                export_transfer_template:api_get_ebay_orders_export_transfer_template,
                import_transfer:api_post_ebay_orders_import_transfer,
                verificationDialog:false,
                orders: false,
                checkAll: false,
                visible: false,
                checkList: {},
                tipTitle: "点击可查看 平台SKU，商品名称，ItemId，数量，出售价 等信息",
                partAllOptions: [
                    {
                        name: "部分导出", value: 2, action: function () {
                            if (this.selectedList.length <= 0) return this.$message({
                                type: "warning",
                                message: "请先选择需要导出的数据"
                            });
                            let params = {
                                ids: this.selectedList.map(row => {
                                    if (typeof row === 'object') {
                                        return row.id
                                    } else {
                                        return row
                                    }
                                }),
                                export_type: 0
                            };
                            Object.assign(params,this.export_data);
                            this.batch_export(params);
                        }
                    },
                    {
                        name: "全部导出", value: 1, action: function () {
                            let params = this.export_data;
                            this.$set(params, 'export_type', 1);
                            this.batch_export(params);
                        }
                    },
                ],
                showImport:false,
                showExport:false
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
        mounted() {
            this.getAccount();
        },
        methods: {
            getAccount() {
                this.$http(orderWish_getAccount, {channel_id: 3}).then(res => {
                    this.addEditSiteList = res.account;
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'})
                })
            },
            add_ymx(){//------------------抓取订单保存
                let data = window.clone(this.addData);
                if(!!this.addData.begin_time){
                    let d = new Date(this.addData.begin_time);
                    data.begin_time=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
                }else{
                    data.begin_time=''
                }
                if(!!this.addData.end_time){
                    let e = new Date(this.addData.end_time);
                    data.end_time=e.getFullYear() + '-' + (e.getMonth() + 1) + '-' + e.getDate()
                }else{
                    data.end_time=''
                }
                this.$http(api_catch_wish_order,data).then(res=>{
                    this.lookDialog = false;
                    this.$message({
                        type: 'success',
                        message: res.message
                    });
                }).catch(code=>{
                    this.$message({
                        message: code.message || code,
                        type: 'error'
                    });
                }).finally(() =>{
                    setTimeout(() =>{
                        this.$reqKey('lookFormWish', false);
                    }, 300)
                })
            },
            catch_order(){//------------打开抓取订单
                this.lookDialog = true;
                this.addData = {
                    account_id:'',
                    begin_time :'',
                    end_time:'',
                }
            },
            files_update(){
                this.$emit('files-update')
            },
            verification(){
                this.verificationDialog = true
            },
            batch_export(data) {
                return this.$http(api_wish_orders_export, data).then(res => {

                    this.$message({type: "success", message: res.message || res});
                    this.visible = true;
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            export_excel(val) {
                val.action.call(this, val);
            },
            //            升降排序
            sort_click(val) {
                this.$emit("sort-click", val);
            },
            cur_click(val) {
                window.open(`${val.product_link}`);
            },
            addClass(data) {
                this.dataTable.forEach(item => {
                    this.$set(item, 'clickData', false);
                });
                data.clickData = true;
            },
            changeAll(val) {//------------全选反选
                this.dataTable.forEach(data => {
                    data.isCheck = val
                })
            },
            changeOne() {
                if (this.dataTable.length > 0) {
                    this.checkAll = !this.dataTable.find(data => !data.isCheck);
                }
            },
            show_detail(data) {
                data.show = !data.show;
            },
            lookOver(row) {//----------------------查看
                this.orders = true;
                let params = {
                    transaction_date: row.transaction_date
                };
                this.checkList = {};
                this.$http(orderWish_check, row.order_id, params).then(res => {
                    this.checkList = res;
                    this.checkList.payList = [{
                        "product_id": this.checkList.product_id,
                        "sku": this.checkList.sku,
                        "product": this.checkList.product,
                        "quantity": this.checkList.quantity,
                        "product_image_url": this.checkList.product_image_url,
                        "price": this.checkList.price,
                        "currency_code": this.checkList.currency_code,
                        "product_link": this.checkList.product_link
                    }];
                }).catch(code => {
                    this.$message({
                        showClose: true,
                        message: code.message || code,
                        type: 'error'
                    });

                });
            },
            orders_online() {
                if (this.selectedList.length === 0) {
                    this.$reqKey('wish_orders_online', false);
                    return this.$message({type: "warning", message: "请先选择需要同步的数据"});
                }
                let ids = {
                    order_ids: this.selectedList.map(row => {
                        if (typeof row === 'object') {
                            return row.id
                        } else {
                            return row
                        }
                    })
                };
                this.$http(api_wish_orders_online, ids).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('wish_orders_online', false);
                    }, 200);
                });
            }
        },
        computed: {
            selectedList() {
                return this.dataTable.filter(row => {
                    return row.isCheck === true
                })
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
            firstLoading: {
                required: true,
                type: Boolean
            },
            export_data: {}
        },
        components: {
            orderForm,
            uiTable,
            uiTip: require('../../../../components/ui-tip.vue').default,
            plusMinus: require('../../../../components/plus-minus.vue').default,
            timeOut: require('../../local/time-out.vue').default,
            trendsSelect: require('../../../../components/trends-select').default,
            exportDialog: require('../../../../view/report/export-dialog').default,//report/export-dialog
            requestButton: require('@/global-components/request-button').default,
            verificationOrder:require('../../verification-order.vue').default,
            importTxt: require('./import-txt').default,
            importExcel: require('../../ebay/list/import-excel').default,
            lookList: require('./look-list').default,
        }
    }
</script>
