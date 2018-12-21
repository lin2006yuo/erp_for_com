<template>
    <el-row class="c-ali-search">
        <search-card :params="form"
                     @search="search"
                     :clears="clears"
                     @init-params="init_status_btn">
            <div>
                <label-buttons label="订单状态：" :buttons="buttons" @select="change_status" :max="40"></label-buttons>
            </div>
            <div class="mb-mini">
                <el-select v-model="form.snType" class="inline s-width-small">
                    <el-option
                            v-for="item in selectList1"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                            :disabled="item.disabled"
                    ></el-option>
                </el-select>
                <order-input v-model="form.snText"
                             class="inline width-super mr-sm"
                             v-sf.snText
                             @keydown="search"
                             placeholder="可批量搜索，Shift+回车换行..."></order-input>
                <label class="inline">付款状态：</label>
                <el-select class="inline s-width-default mr-sm" v-model="form.pay_status" filterable clearable>
                    <el-option v-for="item in payList"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value"
                    ></el-option>
                </el-select>
                <label class="inline">仓库发货状态：</label>
                <el-select class="inline s-width-default mr-sm" v-model="form.shipping_status" filterable clearable>
                    <el-option v-for="item in shippingList"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value"
                    ></el-option>
                </el-select>
                <label class="inline">退款状态：</label>
                <el-select class="inline s-width-default mr-sm" v-model="form.refund_status" filterable clearable>
                    <el-option v-for="item in refundList"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value"
                    ></el-option>
                </el-select>
                <label class="inline">账号简称：</label>
                <el-select class="inline s-width-default" v-model="form.account_id" filterable clearable>
                    <el-option v-for="item in accountList"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value"
                    ></el-option>
                </el-select>
                <label class="ml-sm">是否已放款：</label>
                <el-select class="inline s-width-small"
                           v-model="form.is_transfer_money"
                           v-sf.account_id
                           filterable clearable>
                    <el-option v-for="item in makeLoansList"
                               :key="item.value"
                               :value="item.value"
                               :label="item.label"></el-option>
                </el-select>
            </div>
            <el-select v-model="form.snDate" class="inline width-xs">
                <el-option
                        v-for="item in selectList2"
                        :label="item.label"
                        :value="item.value"
                        :key="item.value"
                ></el-option>
            </el-select>
            <el-date-picker
                    @keyup.enter.native="search"
                    class="inline date"
                    type="date"
                    placeholder="开始时间"
                    v-model="form.date_b"
                    :picker-options="pickerStart"
            ></el-date-picker>
            &nbsp;--&nbsp;
            <el-date-picker
                    @keyup.enter.native="search"
                    class="inline date mr-sm"
                    type="date"
                    placeholder="结束时间"
                    v-model="form.date_e"
                    :picker-options="pickerEnd"
            ></el-date-picker>
        </search-card>
    </el-row>
</template>
<style lang="stylus">
    .c-ali-search{
        .el-card{
            overflow: inherit;
        }
    }

</style>
<script>
    import labelButtons from './label-buttons.vue';
    export default{
        data(){
            return {
                selectList2: [
                    {id: 1, label: "下单时间", value: "transaction_date"},
                    {id: 2, label: "平台标记发货时间", value: "delivery_time"},
                ],
                selectList3: [
                    {label: "订单号", value: "order_id"},
                    {label: "买家ID", value: "buyer_id"},
                    {label: "追踪号", value: "tracking_number"},
                    {label: "平台SKU", value: "sku"},
                ],
                selectList1: [
                    {id: 1, label: "订单号", value: "order_id"},
                    {id: 2, label: "买家ID", value: "buyer_id"},
                    {id: 5, label: "目的地", value: "target"},
                    {id: 6, label: "追踪号", value: "tracking_number"},
                ],
                payList:[
                    {label: "全部", value: ""},
                    {label: "已付款", value: 1},
                    {label: "未付款", value: 2},
                ],
                shippingList:[
                    {label: "全部", value: -1},
                    {label: "未发货", value: 0},
                    {label: "全部发货", value: 1},
                    {label: "部分发货", value: 2},
                ],
                refundList:[
                    {label: "全部", value: -1},
                    {label: "未退款", value: 0},
                    {label: "已退款", value: 1},
                ],
                makeLoansList:[
                    {label: "全部", value: ''},
                    {label: "是", value: 1},
                    {label: "否", value: 0}
                ],
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.form.date_e) {
                            return time.getTime() > this.form.date_e;
                        } else {
                            return false;
                        }
                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.form.date_b) {
                            return time.getTime() < this.form.date_b;
                        } else {
                            return false;
                        }
                    }
                },
            }
        },
        methods: {
            init_status_btn(){
                let cur = this.$parent.buttons;
                this.$parent.buttons = [];
                this.$nextTick(()=>{
                    this.$parent.buttons = cur;
                })
            },
            change_status(index,item){
                this.$emit("change-status",item.value);
            },
            search(){
                this.$emit("search-data");
            },
        },
        watch:{
            'form.snType':function () {
                this.form.snText = ''
            }
        },
        props: {
            form: {
                required: true,
                type: Object
            },
            buttons:{
                required: true,
                type: Array
            },
            accountList:{},
            clears:{
                required: true,
                type: Object
            },
        },
        components: {
            labelButtons,
            searchCard: require('../../../../components/search-card.vue').default,
            orderInput:require('../../../../components/order-input').default,
        }
    }
</script>
