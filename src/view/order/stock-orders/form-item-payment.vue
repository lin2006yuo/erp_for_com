<template>
    <div class="c-payment">
        <!--<div v-if="form.goods_amount || form.shipping_fee || form.pay_fee" class="payment-yellow mb-xs">-->
            <!--<span>商品总额：{{form.currency_code}}&nbsp;{{form.goods_amount}}</span>&nbsp;+&nbsp;-->
            <!--<span> 物流费用：{{form.shipping_currency_code}}&nbsp;{{form.shipping_fee}}</span>&nbsp;+&nbsp;-->
            <!--<span>调整金额：{{form.adjust_amount}}</span>&nbsp;=&nbsp;-->
            <!--<span>付款金额：{{form.currency_code}}&nbsp;{{form.pay_fee}}</span>-->
        <!--</div>-->
        <div class="payment-green">
            <div class="mb-mini display">
                <div  class="flex"><label>付款日期：</label><span v-if="!!form.pay_time">{{form.pay_time | filterTime}}</span> <span v-else>无</span></div>
                <div class="flex"><label>付款方式：</label><span v-if="!!form.pay_name">{{form.pay_name}}</span><span v-else>无</span> &nbsp;&nbsp;<span>金额:</span>&nbsp; <span>{{form.currency_code}}{{form.pay_fee}}</span></div>
            </div>
            <div class="mb-mini display">
                <div  class="flex"><label>付款交易号：</label><span v-if="!!form.pay_code">{{form.pay_code}}</span><span v-else>无</span></div>
                <div class="flex"><label>相关链接：</label><span v-if="!!form.pay_link">{{form.pay_link}}</span><span v-else>无</span></div>
            </div>
            <div  class="mb-mini display">
                <div  class="flex"><label>付款账号：</label><span v-if="form.payment_account">{{form.payment_account}}</span> <span v-else>无</span></div>
                <div class="flex"><label>收款账号：</label><span v-if="form.collection_account">{{form.collection_account}}</span> <span v-else>无</span></div>
            </div>
            <div class="mb-mini display">
                <div  class="flex"><label>支付留言：</label><span v-if="!!form.pay_note">{{form.pay_note}}</span> <span v-else>无</span></div>
            </div>
        </div>
        <div class="refund-red mt-sm mb-sm" v-for="item in form.refund_info" v-if="form.refund_info&&form.refund_info.length>0">
            <div class="mb-mini display">
                <div class="flex"><label>付款日期：</label><span v-if="!!item.pay_time">{{item.pay_time|filterTime}}</span><span v-else>无</span></div>
                <div class="flex"><label>付款方式：</label><span v-if="!!item.pay_name">{{item.pay_name}} &nbsp;</span><span v-else>无</span> <span>金额:</span><span>{{form.currency_code}}</span> &nbsp;<span>-{{form.retired_amount}}</span></div>
            </div>
            <div class="mb-mini display">
                <div class="flex"><label>交易流水号：</label><span v-if="!!item.paypal_trx_id">{{item.paypal_trx_id}}</span><span v-else>无</span></div>
                <div class="flex"><label>相关链接：</label><span v-if="!!item.pay_link">{{item.pay_link}}</span><span v-else>无</span></div>
            </div>
            <div class="mb-mini display">
                <div class="flex"><label>付款账号：</label>
                    <span v-if="!item.collection_account">{{item.collection_account}}</span>
                    <span v-else>无</span>
                </div>
                <div class="flex"><label>收款账号：</label>
                    <span v-if="item.payment_account.length!==0">{{item.payment_account}}</span>
                    <span v-else>无</span>
                </div>
            </div>
            <div class="mb-mini">
                <span>留言:</span> <span v-if="!!item.reason">{{item.reason}}</span> <span v-else>无</span>
            </div>
        </div>
    </div>
</template>
<style lang="stylus">
    .c-payment{
        .payment-yellow{
            padding:5px 10px;
            border:1px solid #ddd;
            background-color: rgb(252,251,221);
        }
        .display {
            display:flex;
        }
        .flex{
            flex:1
        }
        .payment-green{
            padding:5px 10px;
            border:1px solid #ddd;
            background-color: #A6D27C;
        }
        .refund-red{
            padding:5px 10px;
            border:1px solid #ddd;
            background-color: #F8D2C8;
        }

    }
</style>
<script>

    export default{
        data(){
            return{

            }
        },
        filters:{
            filterTime(val){
                return val?datef("YYYY-MM-dd HH:mm:ss",val):"-- --";
            }
        },
        props:{
            form:{}
        },
        components:{

        },
    }
</script>
