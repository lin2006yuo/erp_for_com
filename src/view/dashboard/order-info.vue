<template>
    <ui-card class="form-item">
        <span slot="header" class="title">订单管理</span>
        <el-row>
            <el-col :span="12">有留言未处理：
                <page-link link="/orders-audit" :param="{status:'0_1'}">{{messageCount}}</page-link></el-col>
            <el-col :span="12">需人工审核订单：
                <page-link link="/orders-audit" :param="{status:'0_256'}">{{youReviewThe}}</page-link></el-col>
        </el-row>
        <el-row>
            <el-col :span="12">收货地址错误：<page-link link="/orders-audit" :param="{status:'0_2'}">{{addrWrongCount}}</page-link></el-col>
            <el-col :span="12">详单商品错误：
                <page-link link="/orders-audit" :param="{status:'0_4'}">{{commodityIsUnknownCount}}</page-link>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">无法分配仓库：<page-link link="/orders-audit" :param="{status:'0_8'}">{{cannotAllocateWarehouse}}</page-link></el-col>
            <el-col :span="12">邮寄方式错误：<page-link link="/orders-audit" :param="{status:'0_16'}">{{maillError}}</page-link></el-col>
        </el-row>
        <el-row>
            <el-col :span="12">缺货订单：<page-link link="/orders-audit" :param="{status:'0_64'}">{{stockOut}}</page-link></el-col>
            <el-col :span="12">过期订单：<page-link link="/orders-audit" :param="{status:'0_128'}">{{overdue}}</page-link>
            </el-col>
        </el-row>
    </ui-card>
</template>
<style lang="stylus" scoped>

</style>
<script>

    import {api_order_info} from '../../api/dashborad';
    export default{
        data(){
            return{
                messageCount:0,
                addrWrongCount:0,
                commodityIsUnknownCount:0,
                cannotAllocateWarehouse:0,
                youReviewThe:0,
                maillError:0,
                stockOut:0,
                overdue:0,
            }
        },
        events:{
            ggg(gg){
                console.log(this.maillError);
                console.log(gg);
            }
        },
        mounted(){
            this.$http(api_order_info).then(res=>{
                this.messageCount = res.message_count;
                this.addrWrongCount = res.addr_wrong_count;
                this.commodityIsUnknownCount = res.commodity_is_unknown_count;
                this.cannotAllocateWarehouse = res.cannot_allocate_warehouse;
                this.youReviewThe = res.you_review_the;
                this.maillError = res.maill_error;
                this.stockOut = res.stock_out;
                this.overdue = res.overdue;
            })
        },
        methods:{

        },
        components:{
            uiCard:require('../../components/ui-card.vue').default
        }
    }
</script>