<template>
    <page-dialog
        v-model="show"
        :title="title"
        width="1100px">
        <el-table
            :data="tableData"
            v-loading="loading"
            style="width:100%">
            <el-table-column prop="sku" label="sku"></el-table-column>
            <el-table-column prop="inventory_price" label="库存成本价（CNY）" width="90"></el-table-column>
            <el-table-column prop="last_purchase_price" label="最后一次采购价（CNY）" width="100"></el-table-column>
            <el-table-column prop="new_price" label="最新报价（CNY）" width="80"></el-table-column>
            <el-table-column label="跌价金额（CNY）" width="80">
                <template slot-scope="{row}">
                    {{row.discount_type===1?row.discount_value:'--'}}
                </template>
            </el-table-column>
            <el-table-column label="跌价比例（%）">
                <template slot-scope="{row}">
                    {{row.discount_type===2?row.discount_value:'--'}}
                </template>
            </el-table-column>
            <el-table-column label="跌价总数/已售数" width="120">
                <template slot-scope="{row}">
                    {{row.discount_num}} / {{row.sell_num}}
                </template>
            </el-table-column>
            <el-table-column label="有效时间" width="200">
                <template slot-scope="{row}">
                    {{row.valid_time}}--{{row.over_time}}
                </template>
            </el-table-column>
            <el-table-column label="仓库" prop="warehouse"></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="{row}">
                    <span v-if="row.status===0" class="operate">{{row.status_text}}</span>
                    <el-popover v-else width="200" trigger="hover" :content="row.remark">
                        <span slot="reference" class="operate">{{row.status_text}}</span>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>
        <div slot="footer" >
            <template v-if="footerBtnShow">
                <span>该spu存在跌价记录，是否继续？ </span>
                <el-button type="primary" @click="submit">确定</el-button>
                <el-button @click="close">取消</el-button>
            </template>
        </div>
    </page-dialog>
</template>

<script>

    import {api_goods_discount } from "@/api/publish-smt"
    export default {
        name: "fall-in-price",
        data(){
            return {
                show:this.value,
                tableData:[],
                loading:false,

            }
        },
        methods:{
            getTableData(id){
                this.$http(api_goods_discount,{goods_id:id}).then(res=>{
                    console.log('数据==================',res)
                    this.tableData = res.data;
                }).catch(error=>{
                    this.$message({type:"error",message:error.message||error})
                })
            },
        },
        watch:{
            show(val,oldVal){
                this.$emit('input',val)
            },
            value(val,oldVal){
                this.show = val;
            },
            "fallInPriceInfo.id":{
                deep:true,
                handler(val,olaVal){
                    this.getTableData(val);
                }
            }
        },
        props:{
            value:{},
            title:{},
            fallInPriceInfo:{},
            footerBtnShow:{
                default:()=>{
                    return false
                }
            }
        }
    }
</script>

<style lang="stylus" scoped>

</style>
