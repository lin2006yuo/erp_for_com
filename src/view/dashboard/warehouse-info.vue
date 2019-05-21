<template>
    <ui-card class="form-item">
        <span slot="header" class="title">仓储工作</span>
        <el-row>
            <el-col :span="12">等待采购入库：
                <page-link link="fff">
                    {{waitStockInCount}}
                </page-link>
            </el-col>
            <el-col :span="12">等待接收退货：
                <page-link link="fff">
                    {{waitRecvSaleReturn}}
                </page-link>
            </el-col>
        </el-row>
    </ui-card>
</template>
<style lang="stylus" scoped>

</style>
<script>

    import {api_warehouse_info} from '../../api/dashborad';
    export default{
        data(){
            return{
                waitStockInCount:0,
                waitRecvSaleReturn:0
            }
        },
        mounted(){
            this.request();
        },
        methods:{
            request(){
                this.$http(api_warehouse_info).then(res=>{
                    this.waitStockInCount = res.waitStockInCount;
                    this.waitRecvSaleReturn = res.waitRecvSaleReturn;
                }).catch(code=>{

                })
            }
        },
        components:{
            uiCard:require('../../components/ui-card.vue').default
        }
    }
</script>