<template>
    <div class="c-order-goods">
        <el-button class="mb-xs" type="primary" size="mini" @click.native="add_goods">添加商品</el-button>
        <el-table
                border
                :data="dataList"
                highlight-current-row
        >
            <el-table-column label="名称" prop="spu_name"></el-table-column>
            <el-table-column label="单价" inline-template>
                <div>
                    <!--<span class="inline">{{curCurrency}}</span>   要求只用'CNY'-->
                    <span class="inline">CNY</span>
                    <ui-limit-number class="inline width-sm" v-model="row.sku_price" :limit="2"></ui-limit-number>
                </div>
            </el-table-column>
            <el-table-column label="数量" inline-template>
                <input class="inline width-sm el-input__inner t-center" v-model="row.sku_quantity" type="number" min="0"
                       onkeyup="this.value=this.value.replace(/\D/g,'')"
                       onafterpaste="this.value=this.value.replace(/\D/g,'')">
            </el-table-column>
            <el-table-column label="总成本" inline-template>
                <div>{{row.sku_quantity*row.sku_price | filterPrice}}</div>
            </el-table-column>
            <el-table-column label="操作" inline-template>
                <span class="operate" @click="cur_delete(row.sku_id)">删除</span>
            </el-table-column>
        </el-table>
        <add-goods v-model="dialog" @add-goods="add_new_goods"></add-goods>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return {
                dialog: false
            }
        },
        filters: {
            filterPrice(val){
                if (!val) return 0;
                return parseFloat(val).toFixed(2);
            }
        },
        computed: {
            amount(){
                this.dataList.forEach((data) => {
                    if (data.sku_price && data.sku_quantity) {
                        return data.sku_price * data.sku_quantity
                    } else {
                        return 0;
                    }
                })
            }
        },
        methods: {
            add_goods(){
                this.dialog = true;
            },
            add_new_goods(val){
                this.$emit("add-new-goods", val);
            },
            cur_delete(val){
                let index = this.dataList.findIndex((data) => {
                    return data.sku_id === val
                });
                this.dataList.splice(index, 1);
            },
        },
        props: {
            dataList: {
                required: true,
                type: Array
            },
            curCurrency:{
                required:true,
                default(){
                    return "CNY"
                }
            }
        },
        components: {
            addGoods: require('../../../api-components/add-goods.vue').default,
            uiLimitNumber:require('../../../components/ui-limit-number.vue').default,
        }
    }
</script>