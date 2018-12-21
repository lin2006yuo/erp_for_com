<template>
    <el-row>
        <table class="form-item-profit" v-if="form.income || form.expend">
            <tr>
                <th rowspan="2" class="width-xs">订单</th>
                <th colspan="3">买家实付</th>
                <th colspan="8">成本/支出</th>
                <th rowspan="2">利润</th>
            </tr>
            <tr>
                <th>货品金额</th>
                <th>实付运费</th>
                <th>调整金额</th>
                <th>P卡费用</th>
                <th>渠道收费</th>
                <th>货品成本
                    <i class="icon-refresh mr-sm" title="重新获取货品成本" @click="update_cost"></i></th>
                <th>paypal费用</th>
                <th>头程运费</th>
                <th>头程报关费</th>
                <th>包装成本</th>
                <th>{{curTitle}}</th>
            </tr>
            <tbody>
                <template>
                    <tr>
                        <!--订单-->
                        <td rowspan="2" v-copy>{{order}}</td>
                        <!--货品金额-->
                        <td class="income">{{income.pay_symbol}}{{income.goods_amount}}</td>
                        <!--实付运费-->
                        <td class="income">{{income.pay_symbol}}{{income.shipping_fee}}</td>
                        <!--调整金额-->
                        <td class="income">{{income.pay_symbol}}{{income.adjust_amount}}</td>
                        <!--P卡费用-->
                        <td class="expend">{{expend.shipping_symbol}}{{expend.p_card}}</td>
                        <!--渠道收费-->
                        <td class="expend">{{expend.shipping_symbol}}{{expend.channel_cost}}</td>
                        <!--货品成本-->
                        <td class="expend">{{expend.shipping_symbol}}{{expend.cost}}</td>
                        <!--paypal费用-->
                        <td class="expend">{{expend.shipping_symbol}}{{expend.paypal_fee}}</td>
                        <!--头程运费-->
                        <td class="expend">{{expend.shipping_symbol}}{{expend.first_fee}}</td>
                        <!--头程报关费-->
                        <td class="expend">{{expend.shipping_symbol}}{{expend.tariff}}</td>
                        <!--包装成本-->
                        <td class="expend">{{expend.shipping_symbol}}{{expend.package_fee}}</td>
                        <!--运费-->
                        <td class="expend">{{expend.shipping_symbol}}{{expend.shipping_fee}}</td>
                        <!--利润-->
                        <td rowspan="2" :class="profit>=0?'income':'expend'">
                            <div>{{income.pay_symbol}}{{foreignCurrency}}({{expend.shipping_symbol}}{{profit}})</div>
                            <div>{{profitRate}}</div>
                        </td>
                    </tr>

                    <tr>
                        <!--买家实付-->
                        <td colspan="3" class="income">{{income.pay_symbol}}{{incomePayFee}}({{expend.shipping_symbol}}{{pay_fee}})</td>
                        <!--成本/支出-->
                        <td colspan="7" class="expend">{{expend.shipping_symbol}}{{pay}}</td>
                    </tr>
                    <!--售后单存在才出现-->
                    <tr v-if="form.sales&&form.sales.length>0">
                        <td class="bold-font">售后单</td>
                        <td class="bold-font" colspan="3">退货</td>
                        <td class="bold-font" colspan="3">退款</td>
                        <td class="bold-font" colspan="3">补发</td>
                        <td class="expend" rowspan="4" :class="totalFee>=0?'income':'expend'">
                            <div>{{expend.shipping_symbol}}{{totalFee}}</div>
                            <div>{{totalFeeRate}}</div>
                        </td>
                    </tr>
                    <template v-if="form.sales&&form.sales.length>0" v-for="row in form.sales">
                        <tr>
                            <td class="bold-font" v-copy>{{row.after_sale_id}}</td>
                            <td class="income" colspan="3">{{expend.shipping_symbol}}{{row.back_amount}}</td>
                            <td class="expend" colspan="3">{{expend.shipping_symbol}}{{row.retired_amount}}</td>
                            <td class="expend" colspan="4">{{expend.shipping_symbol}}{{row.delivery_amount}}</td>
                        </tr>
                    </template>
                    <tr v-if="form.sales&&form.sales.length>0">
                        <td class="bold-font">小计</td>
                        <td class="income" colspan="3">{{expend.shipping_symbol}}{{totalIncome}}</td>
                        <td class="expend" colspan="8">{{expend.shipping_symbol}}{{totalExpend}}</td>
                    </tr>
                    <tr>
                        <td colspan="13" class="td-left">
                            <div>
                                <span class="bold-font">汇率值：</span><span>{{form.rate}}({{curTime}}  {{form.rate_remark}})</span>
                                <span class="bold-font">利润计算公式：</span>（收入-成本/支出）+退货-退款-补发
                            </div>
                            <div>包装成本使用商品对应的包装成本累加，一包多件的这种情况可能会产生误差</div>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
        <div v-else>暂无利润信息....</div>
    </el-row>
</template>
<style lang="stylus">
    .form-item-profit{
        width:100%;
        box-sizing:border-box;
        border-collapse:collapse;
        border-left:1px solid #e0e6ed;
        border-top:1px solid #e0e6ed;
        font-size:1.2rem;
        td,th{
            border-right:1px solid #e0e6ed;
            border-bottom:1px solid #e0e6ed;
            height:26px;
            text-align: center;
            padding:0 10px;
        }
        td.td-left,th.td-left{
            text-align: left;
        }
        .income{
            color:#238F28;
        }
        .expend{
            color:#e4393c;
        }
    }
</style>
<script>
    import {api_update_cost} from '../../../api/order-local';
    export default{
        data(){
            return{

            }
        },
        mounted(){
            console.log(this.order);
        },
        methods:{
            update_cost(){
                this.$http(api_update_cost,this.form.id).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.form.expend.cost = res.cost;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                })
            },
        },
        computed:{
            curTitle(){
                return this.form.shipping_time?'运费':'估计运费';
            },
            totalIncome(){
                let cur = this.pay_fee;
                if(this.form.sales&&this.form.sales.length>0){
                    this.form.sales.forEach(row=>{
                        if(!!row.back_amount){
                            cur += row.back_amount;
                        }
                    });
                }
                return !!cur?parseFloat(cur):0
            },
            totalExpend(){
                let cur = !!this.pay?parseFloat(this.pay):0;
                if(this.form.sales&&this.form.sales.length>0){
                    this.form.sales.forEach(row=>{
                        if(!!row.delivery_amount){
                            cur +=row.delivery_amount;
                        }
                        if(!!row.retired_amount){
                            cur += row.retired_amount;
                        }
                    });
                }
                return !!cur?parseFloat(cur).toFixed(4):0;
            },
            totalFee(){
                console.log(this.totalExpend,'this.totalExpend');
                console.log(this.totalIncome,'this.totalIncome');
                return (this.totalIncome-this.totalExpend).toFixed(4);
            },
            totalFeeRate(){
                console.log(this.totalFee,'this.totalFee');
                console.log(this.totalIncome,'this.totalIncome');
                let cur = (this.totalFee/this.totalIncome)*100;
                return `${cur.toFixed(4)}%`;
            },

            curTime(){
                let cur = new Date().getTime()/1000;
                return datef("YYYY-MM-dd",cur);
            },
            income(){
                let cur = {};
                if(this.form.income){
                    cur= this.form.income;
                    return cur;
                }else{
                    return cur;
                }
            },
            expend(){
                let cur = {};
                if(this.form.expend){
                    cur = this.form.expend;
                    return cur;
                }else{
                    return cur;
                }
            },
            incomePayFee(){
                if(this.form){
                    return (parseFloat(this.income.goods_amount)+parseFloat(this.income.shipping_fee)+parseFloat(this.income.adjust_amount)).toFixed(4);
                }else{
                    return '';
                }
            },
            pay(){
                if(this.form){
                    let c = this.expend;
                    return (parseFloat(c.shipping_fee)+parseFloat(c.package_fee)+parseFloat(c.tariff)+parseFloat(c.first_fee)+parseFloat(c.channel_cost)+parseFloat(c.cost)+parseFloat(c.p_card)+parseFloat(c.paypal_fee)).toFixed(4);
                }else{
                    return '';
                }
            },
            profit(){
                return parseFloat(this.pay_fee-this.pay).toFixed(4);
            },
            pay_fee(){
                return parseFloat(this.incomePayFee*this.form.rate).toFixed(4);
            },
            profitRate(){
                if(parseFloat(this.pay_fee)!==0){
                    if(this.pay>0){
                        return `${((this.profit/this.pay_fee)*100).toFixed(4)}%`;
                    }else{
                        return 0;
                    }
                }else{
                    return '';
                }
            },
            foreignCurrency(){
                if(this.profit) return (this.profit/this.form.rate).toFixed(4);
            },
        },

        props:{
            form:{
                required:true,
                type:Object
            },
            order:{
                required:true
            }
        },
        components:{

        }
    }
</script>
