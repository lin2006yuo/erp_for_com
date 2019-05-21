<template>
    <page-dialog :title="title" v-model="show" width="1200px" :close-on-click-modal="false" @open="getData">
        <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
                prop="sku"
                label="sku">
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
                prop="discount_value"
                label="跌价金额(CNY)">
            </el-table-column>
            <el-table-column
                prop="discount_proportion"
                label="跌价比例(%)">
            </el-table-column>
            <el-table-column
                prop="discount_num"
                label="跌价总数/已售数">
            </el-table-column>
            <el-table-column
                prop="valid_time"
                label="有效时间">
            </el-table-column>
            <el-table-column
                prop="warehouse"
                label="仓库">
            </el-table-column>
            <el-table-column
                label="状态">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="left">
                        <p v-if="!!scope.row.remark">{{ scope.row.remark }}</p>
                        <div slot="reference" class="status_name">
                            <span size="medium">{{ scope.row.status_text }}</span>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>
    </page-dialog>
</template>

<script>
    import {api_ebay_goods_discount} from '@/api/ebay-kandeng-public-module'
    export default {
        name: "price-down-dialog",
        data(){
            return{
                show:false,
                tableData:[],
            }
        },
        watch:{
          show(val){this.$emit('input',val)},
          value(val){this.show=val}
        },
        methods:{
            getData(){
                this.$http(api_ebay_goods_discount, {goods_id:this.priceDownData.goods_id}).then(res => {
                    this.tableData=res.data;
                    this.tableData.forEach(val=>{
                        if(val.discount_type===1){//跌价金额
                            val.discount_proportion=''
                        }else if(val.discount_type===2){//跌价比例
                            val.discount_proportion=val.discount_value;
                            val.discount_value=''
                        }
                    })
                    console.log(res,'跌价详情')
                }).catch(code => {
                    console.log(code);
                });
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean,
            },
            title:{},
            priceDownData:{}
        }
    }
</script>

<style scoped>
    .status_name{
        color: #33B2FC;
    }
</style>
