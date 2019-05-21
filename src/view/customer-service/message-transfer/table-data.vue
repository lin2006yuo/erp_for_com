<template>
    <div class="c-table-data">
        <el-table
                class="mt-xs scroll-bar"
                border
                v-resize="{height:41}"
                :data="tableData.list"
                v-loading="loading"
                element-loading-text="玩命加载中..."
                highlight-current-row>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{ emptyText }}
            </div>
            <el-table-column label="操作人" inline-template width="160">
                <div>
                    <ui-tip :content="row.creator" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="操作时间" inline-template>
                <div>
                    <ui-tip :content="row.create_time" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="操作记录" inline-template>
                <div>
                    <ui-tip :content="row.record" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="操作备注" inline-template>
                <div>
                    <ui-tip :content="row.remark" :width="98"></ui-tip>
                </div>
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
        computed:{
            emptyText(){
                return this.firstLoading?'等待查询数据中...':'暂无数据'
            }
        },
        props:{
            tableData:{
                required:true,
                type:Object
            },
            loading:{
                required:true,
                type:Boolean
            },
            firstLoading:{
                required:true,
                type:Boolean
            },
            total:{
                required: true,
                type: Number,
                default(){
                    return 0
                }
            }
        },
        components: {
            uiTip:require('@/components/ui-tip.vue').default,
        }
    }
</script>