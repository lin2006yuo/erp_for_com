<template>
    <el-row class="c-data-template">
            <table class="template">
            <tr style="font-weight:bold">
                <td></td>
                <td>订单号</td>
                <td>店铺ID</td>
                <td>买家ID</td>
                <td>付款状态</td>
                <td>交易号</td>
                <td>支付总额</td>
                <td>目的地</td>
                <td>发货</td>
                <td>追踪单号</td>
                <td>发货时间</td>
                <td>下单时间</td>
                <td>操作</td>
            </tr>
            <template v-for="(data, index) in datas">
                <tr>
                    <td><input type="checkbox"></td>
                    <td><i @click="show_detail(data)">{{data.show ? '-' : '+'}}</i>{{data.id}}</td>
                    <td>{{data.orderNum}}</td>
                    <td>{{data.buyerID}}</td>
                    <td>{{data.isPay}}</td>
                    <td>{{data.tradeNum}}</td>
                    <td>{{data.payTotal}}</td>
                    <td>{{data.address}}</td>
                    <td>{{data.shipments}}</td>
                    <td>{{data.trackNum}}</td>
                    <td>{{data.shipmentT}}</td>
                    <td>{{data.orderT}}</td>
                    <td>查看</td>
                </tr>
                <template v-if="data.show">
                    <tr>
                        <td :rowspan="data.goods.length+1"></td>
                        <td :rowspan="data.goods.length+1"></td>
                        <td>平台SKU</td>
                        <td>SKU</td>
                        <td colspan="4">商品名称</td>
                        <td colspan="2">ItemId</td>
                        <td>数量</td>
                        <td>出售价</td>
                        <td :rowspan="data.goods.length+1"></td>
                    </tr>
                    <tr v-for="good in data.goods">
                        <td>{{good.psku}}</td>
                        <td>{{good.sku}}</td>
                        <td colspan="4">{{good.name}}</td>
                        <td colspan="2">{{good.itemid}}</td>
                        <td>{{good.num}}</td>
                        <td>{{good.price}}</td>
                    </tr>
                </template>
            </template>
        </table>
    </el-row>
</template>
<style lang="stylus">
</style>
<script>

    export default{
        data(){
            return{
                shows:{},
                datas:[
                    {id:1,orderNum:"SS-46807",buyerID:"thehefferz09",isPay:"已付款",tradeNum:"05767829M53978827",payTotal:"24",address:"US",shipments:"未发货",trackNum:"-",shipmentT:"-",orderT:"16-11-10 11:17",
                        goods:[
                            {psku:'YA1065M',sku:'YA1065M',name:'黑色露肩镂空圆领长袖修身T恤',itemid:252616378866,num:1,price:22},
                            {psku:'YA1065M',sku:'YA1065M',name:'黑色露肩镂空圆领长袖修身T恤',itemid:252616378866,num:1,price:22},
                            {psku:'YA1065M',sku:'YA1065M',name:'黑色露肩镂空圆领长袖修身T恤',itemid:252616378866,num:1,price:22},
                        ]},
                    {id:2,orderNum:"SS-46807",buyerID:"thehefferz09",isPay:"已付款",tradeNum:"05767829M53978827",payTotal:"24",address:"US",shipments:"未发货",trackNum:"-",shipmentT:"-",orderT:"16-11-10 11:17",
                        goods:[
                            {psku:'YA1065M',sku:'YA1065M',name:'黑色露肩镂空圆领长袖修身T恤',itemid:252616378866,num:1,price:22},
                            {psku:'YA1065M',sku:'YA1065M',name:'黑色露肩镂空圆领长袖修身T恤',itemid:252616378866,num:1,price:22},
                            {psku:'YA1065M',sku:'YA1065M',name:'黑色露肩镂空圆领长袖修身T恤',itemid:252616378866,num:1,price:22},
                        ]},
                    {id:3,orderNum:"SS-46807",buyerID:"thehefferz09",isPay:"已付款",tradeNum:"05767829M53978827",payTotal:"24",address:"US",shipments:"未发货",trackNum:"-",shipmentT:"-",orderT:"16-11-10 11:17",
                        goods:[
                            {psku:'YA1065M',sku:'YA1065M',name:'黑色露肩镂空圆领长袖修身T恤',itemid:252616378866,num:1,price:22},
                            {psku:'YA1065M',sku:'YA1065M',name:'黑色露肩镂空圆领长袖修身T恤',itemid:252616378866,num:1,price:22},
                            {psku:'YA1065M',sku:'YA1065M',name:'黑色露肩镂空圆领长袖修身T恤',itemid:252616378866,num:1,price:22},
                        ]},
                    {id:4,orderNum:"SS-46807",buyerID:"thehefferz09",isPay:"已付款",tradeNum:"05767829M53978827",payTotal:"24",address:"US",shipments:"未发货",trackNum:"-",shipmentT:"-",orderT:"16-11-10 11:17",
                        goods:[
                            {psku:'YA1065M',sku:'YA1065M',name:'黑色露肩镂空圆领长袖修身T恤',itemid:252616378866,num:1,price:22},
                            {psku:'YA1065M',sku:'YA1065M',name:'黑色露肩镂空圆领长袖修身T恤',itemid:252616378866,num:1,price:22},
                            {psku:'YA1065M',sku:'YA1065M',name:'黑色露肩镂空圆领长袖修身T恤',itemid:252616378866,num:1,price:22},
                        ]},
                    {id:5,orderNum:"SS-46807",buyerID:"thehefferz09",isPay:"已付款",tradeNum:"05767829M53978827",payTotal:"24",address:"US",shipments:"未发货",trackNum:"-",shipmentT:"-",orderT:"16-11-10 11:17",
                        goods:[
                            {psku:'YA1065M',sku:'YA1065M',name:'黑色露肩镂空圆领长袖修身T恤',itemid:252616378866,num:1,price:22},
                            {psku:'YA1065M',sku:'YA1065M',name:'黑色露肩镂空圆领长袖修身T恤',itemid:252616378866,num:1,price:22},
                            {psku:'YA1065M',sku:'YA1065M',name:'黑色露肩镂空圆领长袖修身T恤',itemid:252616378866,num:1,price:22},
                        ]},
                ]
            }
        },
        methods:{
            show_detail(data){
                data.show = data.show ? false : true;
            },
        },
        mounted(){
            this.datas.forEach((data,i)=>{
                this.$set(this.datas[i], 'show',false);
            });
        },
        computed:{
        },
        components:{

        }
    }
</script>