<template>
    <div class="c-data-table">
        <el-table class="scroll-bar"
                  v-resize="{height: 0}"
                  border
                  :data="dataTable"
                  :default-sort="{prop:'cny_amount'}"
                  v-loading="loading"
                  element-loading-text="玩命加载中..."
        >
            <el-table-column inline-template label="运输商代码/名称">
                <div>{{row.carrier_code}}/{{row.carrier_name}}</div>
            </el-table-column>
            <el-table-column label="运输方式" prop="shipping_method_name"></el-table-column>
            <el-table-column label="运费" inline-template width="60">
                <div>{{row.before_amount | filterPrice}}</div>
            </el-table-column>
            <el-table-column label="挂号费" inline-template width="60">
                <div>{{row.registered_fee | filterPrice}}</div>
            </el-table-column>
            <el-table-column label="处理费" inline-template width="60">
                <div>{{row.oli_additional_fee | filterPrice}}</div>
            </el-table-column>
            <el-table-column label="折扣" inline-template>
                <div>{{row.shipping_fee_discount}}</div>
            </el-table-column>
            <el-table-column label="当前币种折后总价" inline-template>
                <div class="red bold-font">
                    <span>{{row.currency_code}}</span>
                    <span class="font-18">{{row.amount | filterPrice}}</span>
                </div>
            </el-table-column>
            <el-table-column label="人民币折后总价" inline-template sortable>
                <div class="red bold-font">
                    <span>RMB</span>
                    <span class="font-18">{{row.cny_amount | filterPrice}}</span>
                </div>
            </el-table-column>
            <el-table-column label="天数" inline-template>
                <div>{{row.earliest_days}}~{{row.latest_days}}</div>
            </el-table-column>
        </el-table>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {}
        },
        filters: {
            filterPrice(val) {
                return val !== '' ? parseFloat(val).toFixed(2) : 0;
            }
        },
        props: {
            dataTable: {
                required: true,
                type: Array,
            },
            loading: {
                required: true,
                type: Boolean,
            }
        }
    }
</script>