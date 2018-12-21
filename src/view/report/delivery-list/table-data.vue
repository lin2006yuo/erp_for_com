<template>
    <div class="c-table-data">
        <el-table
                class="scroll-bar"
                :data="tableData.list"
                v-resize="{height:41}"
                v-loading="loading"
                element-loading-text="玩命加载中..."
                :default-sort = "{prop: 'uploaded_deadline', order: 'descending'}"
                @select="selectCheck($event)"
                @select-all="selectCheck"
                highlight-current-row>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{ emptyText }}
            </div>
            <el-table-column
                    type="selection"
                    width="40">
            </el-table-column>
            <el-table-column
                    prop="id"
                    label="NO.">
            </el-table-column>
            <el-table-column
                    prop="carrierCompany"
                    label="物流商">
            </el-table-column>
            <el-table-column
                    prop="shortname"
                    label="邮寄方式">
            </el-table-column>
            <el-table-column
                prop="collector_name"
                label="揽收商">
            </el-table-column>
            <el-table-column
                    prop="parcelsNum"
                    label="发货包裹数量">
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
            selectCheck(val){
                this.$emit('select-check',val);
            },
        },
        watch: {
            'searchData.status':function (val) {
                if(val!==0){
                    this.checkData = [];
                    this.checkData.length = 0;
                }
            }
        },
        computed: {
            emptyText() {
                return this.firstLoading ? '正在请求数据...' : '暂无数据'
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
            total:{},
            firstLoading:{
                type: Boolean,
                require:true
            }
        },
        components: {}
    }
</script>
