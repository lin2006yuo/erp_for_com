<template>
    <el-row>
        <table class="form-item-profit">
            <tr>
                <th rowspan="2" class="width-xs">订单</th>
                <th colspan="3">订单</th>
                <th colspan="8">成本/支出</th>
                <th rowspan="2">利润</th>
            </tr>
            <tr>
                <th>货品金额</th>
                <th>实付运费</th>
                <th>调整金额</th>
                <th>P卡费用</th>
                <th>渠道收费</th>
                <th>货品成本</th>
                <th>paypal费用</th>
                <th>头程运费</th>
                <th>头程报关费</th>
                <th>包装成本</th>
                <th>估计运费</th>
            </tr>
            <tbody>
                <template>
                    <tr>
                        <!--订单-->
                        <td rowspan="2" v-copy>{{form.order_number}}</td>
                        <!--货品金额-->
                        <td class="income">{{form.income.pay_symbol}} {{form.income.goods_amount}}</td>
                        <!--实付运费-->
                        <td class="income">{{form.income.pay_symbol}} {{form.income.providers_fee}}</td>
                        <!--调整金额-->
                        <td class="income">{{form.income.pay_symbol}} {{form.income.adjust_amount}}</td>
                        <!--P卡费用-->
                        <td class="expend">--</td>
                        <!--渠道收费-->
                        <td class="expend">{{form.expend.cost_symbol}} {{form.expend.channel_cost}}</td>
                        <!--货品成本-->
                        <td class="expend">{{form.expend.cost_symbol}} {{form.expend.product_cost}}</td>
                        <!--paypal费用-->
                        <td class="expend">--</td>
                        <!--头程运费-->
                        <td class="expend">{{form.expend.cost_symbol}} {{form.expend.first_fee}}</td>
                        <!--头程报关费-->
                        <td class="expend">{{form.expend.cost_symbol}} {{form.expend.tariff}}</td>
                        <!--包装成本-->
                        <td class="expend">{{form.expend.cost_symbol}} {{form.expend.package_fee}}</td>
                        <!--估计运费-->
                        <td class="expend">{{form.expend.cost_symbol}} {{form.expend.shipping_fee}}</td>
                        <!--利润-->
                        <td rowspan="2" :class="form.profit>0? 'income' : 'expend'">
                            <div>{{form.income.pay_symbol}} {{form.foreignCurrency}} ({{form.expend.cost_symbol}}{{form.profit}})</div>
                            <div>{{profitRate}}</div>
                        </td>
                    </tr>
                    <tr>
                        <!--买家实付-->
                        <td colspan="3" class="income">{{form.income.pay_symbol}} {{form.income.pay_fee}} ({{form.expend.cost_symbol}}{{order_total}})</td>
                        <!--成本/支出-->
                        <td colspan="8" class="expend">{{form.expend.cost_symbol}} {{form.expend.cost}}</td>
                    </tr>
                    <tr>
                        <td colspan="13" class="td-left">
                            <div>
                                <span class="bold-font">汇率值：</span><span>{{form.rate}}({{form.date_now | dateFilter}} {{form.rate_remark}})</span>
                                <span class="bold-font">利润计算公式：</span>（收入-成本/支出）+退货-退款-补发
                            </div>
                            <div>包装成本使用商品对应的包装成本累加，一包多件的这种情况可能会产生误差</div>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
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
    export default{
        data(){
            return{}
        },
        methods:{},
        filters:{
            dateFilter(val){
              return datef('YYYY-MM-dd', val/1000);
            }
        },
        computed:{
            order_total(){
               if(this.form){
                   return parseFloat(this.form.income.pay_fee*this.form.rate).toFixed(4);
               } else{
                   return '';
               }
            },
            profitRate(){
                if(parseFloat(this.pay_fee)!==0){
                    if(this.form.expend.cost >0){
                        return `${(this.form.profit/this.order_total).toFixed(4)}%`;
                    }else{
                        return 0;
                    }
                }else{
                    return '';
                }
            }
        },
        props:{
            form:{
                required:true,
                type:Object
            },
        },
        components:{}
    }
</script>
