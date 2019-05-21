<template>
    <div class="shopee-orders-data-list relative">
        <el-table
            class="scroll-bar"
            ref="multipleTable"
            highlight-current-row
            :data="tableData"
            v-resize="{height:38}"
            style="width:100%"
            @selection-change="select_change"
            v-loading="isLoad"
            :isFirst="isFirst"
            element-loading-text="玩命加载中...">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection" width="30"></el-table-column>
            <el-table-column label="订单号" inline-template :width="comStyle">
                <div class="align-left">
                    <ui-tip :content="row.order_number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="站点" min-width="50" inline-template show-overflow-tooltip>
                <div>{{row.site}}</div>
            </el-table-column>
            <el-table-column min-width="45" label="账号简称" inline-template>
                <div>
                    <ui-tip :content="row.account" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="买家ID" min-width="60" inline-template>
                <div>
                    <ui-tip :content="row.buyer" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column min-width="40" label="销售员" inline-template>
                <div>
                    <ui-tip :content="row.seller" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="支付总额" min-width="50" inline-template>
                <div class="p-table-list-td-text" :title="row.pay_fee | filterPrice">{{row.currency_code}} {{row.pay_fee | filterPrice}}</div>
            </el-table-column>
            <el-table-column label="下单时间" min-width="50" inline-template>
                <div>
                    <ui-tip :content="row.order_time | filterDate" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column min-width="40" label="支付时间" inline-template>
                <div>
                    <ui-tip :content="row.pay_time | filterDate" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="运输方式" inline-template>
                <div>
                    <ui-tip :content="row.transport_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column min-width="40" label="目的地" inline-template>
                <div>
                    <ui-tip :content="row.country_cn_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="跟踪单号" min-width="80" inline-template>
                <div>
                    <ui-tip :content="row.track_number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column inline-template label="操作">
                <div>
                    <permission @click="lookOver(row)"
                                tag="span"
                                :route="apis.url_shopee_thailand_look"
                                class="operate">查看
                    </permission>
                </div>
            </el-table-column>
        </el-table>
        <!--查看弹框-->
        <look-detail v-model="lookShow" :lookList="lookList" :lookProduct="lookProduct" :payment="payment" :profit="profit" :title="title"></look-detail>
    </div>
</template>
<style lang="stylus">
    .shopee-orders-data-list {
        table.template td, .el-table td, table.template th, .el-table th {
            padding: 0;
            height: 26px;
            text-align: center;
            box-sizing: border-box;
            border-right: 1px solid #e0e6ed;
            border-bottom: 1px solid #e0e6ed;
        }
        .p-table-list-td-text {
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
</style>
<script>
    import {api_shopee_thailand_look,url_shopee_thailand_look} from'../../.././../api/shopee-thailand-order';

    export default{
        permission: {
            url_shopee_thailand_look,
        },
        data(){
            return {
                title: '',
                profit: {
                    expend:{},
                    income:{},
                },
                payment:{},
                lookList: {},
                lookProduct: [],
                lookShow: false,
                dataTable:[],
            }
        },
        filters:{
            filterPrice(val){
                return val? parseFloat(val).toFixed(2): '-- --'
            },
            filterDate(val){
                return val> 0 ? datef('YYYY-MM-dd', val) : '-- --';
            }
        },
        computed:{
            comStyle(){
                return this.curWidth?`${this.curWidth}px`:"90px";
            },
            emptyText(){
                return this.isFirst?'等待请求数据中...':'暂无数据'
            }
        },
        mounted(){},
        methods:{
            toggleSelection() {//导出后取消勾选
                this.$refs.multipleTable.clearSelection();
            },
            lookOver(row){
                this.lookShow = true;
                this.title = `查看订单： ${row.order_number} 信息`;
                let ids = row.order_number;
                this.$http(api_shopee_thailand_look, {id: ids}).then(res => {
                    this.lookList = res.receiver;
                    this.lookProduct = res.product;
                    this.payment = res.payment;
                    this.profit = res.profit;
                    this.$set(res.profit, 'order_number', row.order_number);
                    this.$set(res.profit, 'date_now', Date.now());
                })
            },
            select_change(val){
                this.$emit("select-change",val)
            },
        },
        props:{
            tableData:{
                required:true,
                type:Array,
            },
            isLoad:{
                required:true,
                type:Boolean,
            },
            curWidth:{
                type:Number
            },
            isFirst:{
                required: true,
                type: Boolean
            }
        },
        components: {
            uiTip:require('../../../../components/ui-tip.vue').default,
            parcelInformation:require('../../../entrepot/placeorder/parcel-information.vue').default,
            lookDetail: require('./look-detail').default,
        }
    }
</script>
