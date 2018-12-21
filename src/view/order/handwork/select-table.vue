<template>
    <div class="c-index">
        <el-table
            :data="data"
            height="600"
            :row-style="row_style"
            border
            style="width: 100%;margin-top: 10px"
            @select="select"
            @select-all="select_change">
            <el-table-column type="selection" width="35">

            </el-table-column>
            <el-table-column
                inline-template
                label="需要人工审核">
                <div>
                    {{row.is_audit|auditFilter}}
                </div>
            </el-table-column>
            <el-table-column
                prop="channel_order_number"
                label="平台订单号"
                width="150">
            </el-table-column>
            <el-table-column
                prop="currency_code"
                label="币种">
            </el-table-column>
            <el-table-column
                inline-template
                label="是否支付">
                <div>
                    {{row.is_pay|auditFilter}}
                </div>
            </el-table-column>
            <el-table-column
                prop="pay_time"
                label="支付时间">
            </el-table-column>
            <el-table-column
                prop="pay_fee"
                label="支付金额">
            </el-table-column>
            <el-table-column
                prop="sku"
                label="本地SUK">
            </el-table-column>
            <el-table-column
                prop="sku_quantity"
                label="SUK数量">
            </el-table-column>
            <el-table-column
                prop="sku_price"
                label="单价(CNY)"
                width="160">
            </el-table-column>
            <el-table-column
                prop="shipping_id"
                label="发货运输方式"
                width="200">
            </el-table-column>
            <el-table-column
                prop="buyer_id"
                label="买家ID"
                width="160">
            </el-table-column>
            <el-table-column
                prop="country_code"
                label="收货国家英文名">
            </el-table-column>
            <el-table-column
                prop="note"
                label="订单备注"
                width="120">
            </el-table-column>
        </el-table>
    </div>
</template>
<style lang="stylus" scoped>

</style>
<script>

    export default {
        data() {
            return {}
        },
        methods: {
            row_style(row){
                return {
                    color:row.isRed?'red':''
                }
            },
            select(val){
                this.$emit('select',val);
            },
            select_change(val){
                this.$emit('select',val);
            },
        },
        watch: {

        },
        filters:{
            auditFilter(item){
                return item?"是":'否'
            }
        },
        props:{
            data:{
                required: true,
                type: Array,
            }
        },
        components: {
        }
    }
</script>
