<template>
    <div>
        <page-dialog title="" size="large" v-model="visible" :close-on-click-modal="false">
            <p class="tracking"><span>查看订单号:{{orderDetail.order_number}}明细</span></p>
            <el-table
                    :data="orderDetail.list"
                    border
                    width="100%"
                    class="mt-xs scroll-bar"
                    max-height="600">
                <el-table-column
                        show-overflow-tooltip
                        label="ASIN"
                        prop="item_id">
                </el-table-column>
                <el-table-column
                        width="400"
                        label="MSKU/SKU"
                        inline-template>
                    <div>
                        <ui-tip :content="`${row.online_sku}/${row.sku}`" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="产品金额">
                    <div>
                        <ui-tip :content="`${row.currency_code}${Number(row.item_price).toFixed(2)}`" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        label="产品数量"
                        prop="qty">
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="visible = false" size="mini">关 闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .tracking{
        position: absolute;
        top:0;
        z-index: 999;
    }
</style>
<script>
    export default {
        data(){
            return {
                visible:false
            }
        },
        mounted(){
        },
        methods: {},
        computed: {},
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                this.visible = val;
            },
        },
        props: {
            value:{},
            orderDetail:{}
        },
        components: {
            pageDialog:require("../../../components/page-dialog.vue").default,
            uiTip:require('../../../components/ui-tip.vue').default
        },
    }
</script>
