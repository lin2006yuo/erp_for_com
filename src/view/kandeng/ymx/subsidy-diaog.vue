<template>
    <page-dialog
        v-model="subdialog"
        :title="title"
        width="1300px"
    >
        <el-table
            :data="datavalue"
            style="width: 100%">
            <el-table-column
                prop="sku"
                label="SKU">
            </el-table-column>
            <el-table-column
                prop="inventory_price"
                label="库存成本价(CNY)">
            </el-table-column>
            <el-table-column
                prop="last_purchase_price"
                label="最后一次采购价(CNY)">
            </el-table-column>
            <el-table-column
                prop="new_price"
                label="最新报价(CNY)">
            </el-table-column>
            <el-table-column
                prop="discount_price"
                label="跌价金额(CNY)">
            </el-table-column>
            <el-table-column
                prop="discount_scale"
                label="跌价比例(%)">
            </el-table-column>
            <el-table-column
                prop="discount"
                label="跌价总数/已售数">
            </el-table-column>
            <el-table-column
                prop="valid_time"
                label="有效期"
                width="200px">
            </el-table-column>
            <el-table-column
                prop="warehouse"
                label="仓库">
            </el-table-column>
            <el-table-column
                label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.status==0">{{scope.row.status_text}}</span>
                    <template v-else>
                        <el-popover
                            placement="left"
                            width="200"
                            trigger="hover"
                            :content="scope.row.remark">
                            <span style="color:#33b2fc" slot="reference">{{scope.row.status_text}}</span>
                        </el-popover>
                    </template>
                </template>
            </el-table-column>
        </el-table>

    </page-dialog>
</template>

<script>
    export default {
        data() {
            return {
                subdialog: this.value,
            }
        },
        watch: {
            value(val) {
                this.subdialog = val;
            },
            subdialog(val) {
                this.$emit('input', val)
            }
        },
        props: {
            value: {},
            datavalue: {
                type: Array,
                require: true,
            },
            title: {
                type: String,
                require: true
            }
        },
        components: {
            pageDiaog: require("../../../components/page-dialog").default,
        }
    }
</script>

<style scoped>

</style>
