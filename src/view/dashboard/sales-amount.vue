<template>
    <page-dialog
        v-model="show"
        width="800px"
        :title="title">
        <el-table
            :data="tableData"
            style="width:100%">
            <el-table-column
                prop="code"
                label="账号简称">
            </el-table-column>
            <el-table-column
                prop="order_quantity"
                label="销售量">
            </el-table-column>
            <el-table-column
                label="销售额（$）">
                <template slot-scope="scope">
                    {{scope.row.amount|toParseInt}}
                </template>
            </el-table-column>
        </el-table>
        <div slot="footer" >
            <el-button type="primary" @click="show = false" >关闭</el-button>
        </div>
    </page-dialog>
</template>

<script>
    export default {
        name: "sales-amount",
        data(){
            return {
                show:this.value
            }
        },
        methods:{},
        props:{
            value:{
                required:true,
                type:Boolean
            },
            title:{
                required:true,
                type:String
            },
            tableData:{
                required:true,
                type:Array
            },
        },
        watch:{
            value(val,oldVal){
                this.show = val
            },
            show(val,oldVal){
                this.$emit("input",val);
            }
        },
        filters:{
            toParseInt(num){
                return parseInt(+num)
            }
        }

    }
</script>

<style lang="stylus" scoped>

</style>
