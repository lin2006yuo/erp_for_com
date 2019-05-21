<template>
    <div class="c-payment">
        <div class="payment-green">
            <div class="mb-mini display">
                <div  class="flex"><label>付款日期：</label><span v-if="!!form.pay_time">{{form.pay_time | filterTime}}</span> <span v-else>无</span></div>
                <div class="flex"><label>付款方式：</label><span v-if="form.pay_type">{{form.pay_type}}</span><span v-else>无</span> &nbsp;&nbsp;<span>金额:</span>&nbsp; <span>{{form.currency_code}} {{form.pay_amount}}</span></div>
            </div>
            <div class="mb-mini display">
                <div  class="flex"><label>付款交易号：</label><span v-if="!!form.transaction_num">{{form.transaction_num}}</span><span v-else>无</span></div>
                <div class="flex"><label>相关链接：</label><span v-if="form.relate_url">{{form.relate_url}}</span><span v-else>无</span></div>
            </div>
            <div  class="mb-mini display">
                <div  class="flex"><label>付款账号：</label><span v-if="form.receiver_account">{{form.payment_account}}</span> <span v-else>无</span></div>
                <div class="flex"><label>收款账号：</label><span v-if="form.receiver_account">{{form.receiver_account}}</span><span v-else>无</span></div>
            </div>
            <div class="mb-mini display">
                <div  class="flex"><label>支付留言：</label><span v-if="!!form.memo">{{form.memo}}</span> <span v-else>无</span></div>
            </div>
        </div>
    </div>
</template>
<style lang="stylus">
    .c-payment{
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

        }
    }
</script>
