<template>
    <div class="c-left-package">
        <label for="" class="mr-md">订单号：{{orderData.order_number}}</label>
        <label for="">包裹号：{{orderData.number}}</label>
        <div class="order" v-for="item in orderData.detail">
            <p class="order-detail">
                {{`${orderData.order_number} [${item.sku}] x ${item.sku_quantity}` }}
            </p>
            <div class="info-package">
                <div class="info-box-package">
                    <table style="padding: 5px">
                        <tr>
                            <td width="10%">
                                <img src="../../../../assets/relevance.png" title="自动关联">
                            </td>
                            <td width="10%">
                                <img :src="item.sku_thumb" width="100%">
                            </td>
                            <td style="padding: 0 5px">
                                <p>{{item.spu_name}}</p>
                                <p>{{item.sku}}</p>
                            </td>
                            <td width="30%">
                                <p style="text-align: right">{{item.sku_quantity}}</p>
                                <p>单品成本：{{item.cost_price}}</p>
                                <p>单品重量：{{item.weight}}</p>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="stylus">
    .c-left-package{
        border: 1px solid #A2B8CE;
        background: #D6E9F2;
        padding:0 10px 10px;
        margin-right: 5px;
        label{
            line-height 26px;
            height: 26px;
        }
        .order{
            border: 1px solid #A2B8CE;
            background:#fff;
            margin: 0 0 10px 0;
            .order-detail{
                background:#E0F7E6;
                padding: 0 10px;
                margin: 0;
                height: 30px;
                line-height:30px;
            }
        }
    }
</style>
<script>

    export default{
        data(){
            return {
            }
        },
        methods:{

        },
        computed:{
        },
        watch:{

        },
        props:{
            orderData:{
                required:true,
                type:Object
            }
        },
        components: {}
    }
</script>
