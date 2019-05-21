<template>
    <page-dialog v-model="dialog"  size="large" :close-on-click-modal="false" :title="title" >
        <el-table
                :data="spuForm.list"
                border
                style="width: 100%">
            <el-table-column
                    prop="spu"
                    label="SPU"
                    width="100">
            </el-table-column>
            <el-table-column prop="goodsName" label="产品名称" >

            </el-table-column>
            <el-table-column
                    prop="times"
                    label="次数"
                    >
            </el-table-column>
            <el-table-column
                    prop="quantity"
                    label="sku累加">
            </el-table-column>
        </el-table>
        <div slot="footer">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="spuForm.page"
                    :page-sizes="[10, 50, 100]"
                    :page-size="spuForm.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="spuForm.total">
            </el-pagination>
        </div>
    </page-dialog>
</template>

<script>
    export default {
        data() {
            return {
                dialog: this.value
            }
        },
        components:{ pageDialog:require('@/components/page-dialog.vue').default,},
        props:{
            value:{},
            title:{},
            spuForm:{},
            info:{},
        },
        methods: {
            handleSizeChange(val) {//------------分页
                this.info.pageSize=val
                this.$emit('get-spu')
            },
            handleCurrentChange(val) {//------------分页
                this.info.page=val;
               this.$emit('get-spu')
            },
        },
        watch:{
            dialog(val){
                this.$emit('input',val)
            },
            value(val){
                this.dialog=val;
                if(val){
                    console.log(this.spuForm,'spuForm');
                }
            }
        }
    }
</script>

<style scoped>

</style>