<template>
    <div class="c-table-data">
        <el-table
                class="scroll-bar"
                :data="tableData.list"
                v-resize="{height:41}"
                v-loading="loading"
                element-loading-text="玩命加载中..."
                @sort-change="sort_change"
                :default-sort = "{prop: 'uploaded_deadline', order: 'descending'}"
                highlight-current-row>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{ emptyText }}
            </div>
            <el-table-column
                    prop="spu"
                    label="SPU">
            </el-table-column>
            <el-table-column label="开发员" prop="developer">

            </el-table-column>
            <el-table-column
                    prop="name"
                    label="产品名称">
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="产品状态">
            </el-table-column>
            <el-table-column
                    sortable
                    :label="`${platform}已刊登总数`"
                    inline-template>
                <ui-tip :content="row.publish_count" :width="98"></ui-tip>
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
            sort_change({column,pro,order}){
                let type = null;
                if(order==='ascending'){
                    type = 'asc'
                }else if(order==='descending'){
                    type='desc'
                }
                this.$emit('sort-change',type)
            },
            handleCurrentChange(val){
                this.$emit('current-change',val);
            },
            handleSizeChange(val){
                this.$emit('size-change',val);
            },
        },
        computed: {
            emptyText() {
                return this.firstLoading ? '请查询数据' : '暂无数据'
            }
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
            platform:{},
            total:{
                required: true,
                type: Number,
                default(){
                    return 0
                }
            },
            firstLoading:{
                type: Boolean,
                require:true
            }
        },
        components: {
            uiTip:require('../../../components/ui-tip.vue').default,

        }
    }
</script>