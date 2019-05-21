<template>
    <div class="price-down-dialog-page">
        <page-dialog :title="title+$t('ymx-list.subsidiesInformation')" v-model="show" width="1300px" :close-on-click-modal="false">
            <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                    prop="sku"
                    label="SKU"
                >
                </el-table-column>
                <el-table-column
                    prop="inventory_price"
                    label="库存成本价(CNY)"
                >
                </el-table-column>
                <el-table-column
                    width="140px"
                    prop="last_purchase_price"
                    label="最后一次采购价(CNY)">
                </el-table-column>
                <el-table-column
                    label="最新报价(CNY)">
                    <template slot-scope="scope">
                        {{scope.row.new_price}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="discount_value"
                    label="跌价金额(CNY)">
                    <template slot-scope="scope">
                        <span v-if="scope.row.discount_type===1">
                            {{scope.row.discount_value}}
                        </span>
                        <span v-else></span>
                    </template>
                </el-table-column>
                <el-table-column
                    style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"
                    label="跌价比例(%)">
                    <template slot-scope="scope">
                        <span v-if="scope.row.discount_type===2">
                            {{scope.row.discount_value}}
                        </span>
                        <span v-else></span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="跌价总数/已售数">
                    <template slot-scope="scope">
                        <span>
                            {{scope.row.discount_num}} / {{scope.row.sell_num}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    width="230px"
                    label="有效时间">
                    <template slot-scope="scope">
                        <span>
                            {{scope.row.valid_time}} -- {{scope.row.over_time}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="warehouse"
                    label="仓库">
                </el-table-column>
                <el-table-column
                    label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status" class="success" :title="scope.row.remark">{{scope.row.status_text}}</span>
                        <span v-else>{{scope.row.status_text}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </page-dialog>
    </div>
</template>

<style lang="stylus">
    .price-down-dialog-page{
        .success {
            color:dodgerblue;
            cursor:pointer
        }
    }

</style>

<script>
    export default {
        data(){
            return {
                show:this.value
            }
        },
        watch:{
            value(val){
                this.show=val;
            },
            show(val){
                this.$emit('change-show',val);
            }
        },
        props:{
            value: {
                required: true,
                type: Boolean
            },
            tableData:{
                required: true,
                type:Array
            },
            title:{

            }
        },
        components:{
            pageDialog: require('@/components/page-dialog.vue').default,
        }
    }
</script>


