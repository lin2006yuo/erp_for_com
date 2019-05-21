<template>
    <div>
        <table class="right-table" cellpadding="0" cellspacing="0">
            <tr>
                <td width="150">拣货单号</td>
                <td width="300">{{lookData.number+(lookData.remark?(' '+'('+lookData.remark+')'):'')}}</td>
                <td>拣货单状态</td>
                <td>{{lookData.status_name}}</td>
            </tr>
            <tr>
                <td>调拨单号</td>
                <td>{{lookData.order_code}}</td>
                <td>调入仓库</td>
                <td>{{lookData.warehouse_name}}</td>
            </tr>
            <tr>
                <td>目的地国家</td>
                <td>{{lookData.country_code}}</td>
                <td>创建时间</td>
                <td>{{lookData.create_time}}</td>
            </tr>
            <tr>
                <td>SKU品种数</td>
                <td>{{lookData.sku_type}}</td>
                <td>商品总数量</td>
                <td>{{lookData.sku_quantity}}</td>
            </tr>
        </table>
        <table class="right-table mt-sm" cellpadding="0" cellspacing="0">
            <tr>
                <td width="150">拣货员</td>
                <td width="150">{{lookData.off_shelf}}</td>
                <td width="150">拣货开始时间</td>
                <td width="175">{{lookData.picking_start_time || '--'}}</td>
                <td>拣货完成时间</td>
                <td width="175">{{lookData.picking_end_time || '--'}}</td>
            </tr>
            <tr>
                <td>包装员</td>
                <td>{{lookData.packing}}</td>
                <td>包装开始时间</td>
                <td>{{lookData.packing_start_time || '--'}}</td>
                <td>包装完成时间</td>
                <td>{{lookData.packing_end_time || '--'}}</td>
            </tr>
            <tr>
                <td>打单员（SKU条码）</td>
                <td>{{lookData.printer}}</td>
                <td>打印时间</td>
                <td :colspan="3">{{lookData.print_time || '--'}}</td>
            </tr>
        </table>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {
            }
        },
        mounted() {
        },
        filters: {
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
        },
        methods: {
        },
        computed: {},
        watch: {
        },
        props: {
            lookData: {},
        },
        components: {},
    }
</script>
