<template>
    <div class="p-commodity-table">
        <el-table :data="tableData"
                  v-resize="{height:41}"
                  v-loading="loading"
                  element-loading-text="玩命加载中"
                  class="table-module"
                  show-summary
                  highlightCurrentRow
                  @sort-change="sort_change">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                <span>{{firstLoading?'请查询数据！':'暂无数据'}}</span>
            </div>
            <el-table-column
                label="国家"
                prop="country_name"
            >
            </el-table-column>
            <el-table-column
                    label="订单量"
                    prop="now_order_total"
            >
            </el-table-column>
            <el-table-column
                    label="订单总额( CNY )"
                    prop="now_pay_total">
            </el-table-column>
            <el-table-column
                    label="客单价( CNY )"
                    prop="until_price">
            </el-table-column>
            <el-table-column
                label="上期订单量"
                prop="pre_order_total">
            </el-table-column>
            <el-table-column
                    label="上期订单额( CNY )"
                    prop="pre_pay_total">
            </el-table-column>
            <el-table-column
                    label="订单量环比"
                    prop="order_proportion">
            </el-table-column>
            <el-table-column
                    label="订单额环比"
                    prop="pay_proportion">
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    export default {
        data(){
            return {

            }
        },
        mounted(){
        },
        filters:{
            toFixed2(val){
                return Number(val).toFixed(2);
            },
            toFixed0(val){
                return Number(val).toFixed(0);
            },
            filterImage(val){
                return val.replace("_60x60","_200x200");
            },
        },
        methods: {
            sort_change(val){
                this.$emit('sort-change',val);
            },
        },
        props: {
            panData:{
            	type:Boolean
            },
            tableData:{
            	type:Array
            },
            loading:{
            	type:Boolean
            },
            is_stay:{
            	type:Boolean
            },
            firstLoading:{
                type:Boolean
            }
        },
        components: {
            uiTip:require('@/components/ui-tip.vue').default
        },
    }
</script>
<style lang="stylus">
    .p-commodity-table{
        .el-table__empty-text {
            /*left: 18% !important;*/
            position: fixed;
            top :50%;
            left :50%;
        }
        .el-table__body-wrapper {
            overflow: auto;
        }
        @media screen and (max-width: 1366px) {
            .table-module .el-table__empty-text{
                left: 20% !important;
            }
        }
    }
</style>
