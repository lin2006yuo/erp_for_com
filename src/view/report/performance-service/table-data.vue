<template>
    <div class="c-table-data">
        <el-table
                class="scroll-bar"
                :data="tableData.list"
                v-resize="{height:41}"
                v-loading="loading"
                element-loading-text="玩命加载中..."
                :default-sort = "{prop: 'uploaded_deadline', order: 'descending'}"
                highlight-current-row>
            <el-table-column
                    prop="customer"
                    label="客服姓名">
            </el-table-column>
            <el-table-column
                    prop="dateline"
                    label="回复时间">
            </el-table-column>
            <el-table-column
                    prop="message_quantity"
                    label="站内信处理数">
            </el-table-column>
            <el-table-column
                    prop="buyer_qauntity"
                    label="回复买家数">
            </el-table-column>
            <el-table-column
                    prop="dispute_quantity"
                    label="纠纷处理数">
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                    class="page-fixed"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page=tableData.page
                    :page-sizes="[20,50,100,200,500]"
                    :page-size=tableData.pageSize
                    layout="total, sizes, prev, pager, next, jumper"
                    :total=total>
            </el-pagination>
        </div>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {}
        },
        methods:{
            handleCurrentChange(val){
                this.$emit('current-change',val);
            },
            handleSizeChange(val){
                this.$emit('size-change',val);
            },
        },
        props:{
            tableData:{
                required:true,
                type:Object,
            },
            loading:{
                required:true,
                type:Boolean
            },
            total:{
                required: true,
                type: Number,
                default(){
                    return 0
                }
            },
        },
        components: {}
    }
</script>