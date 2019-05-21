<template>
    <div class="p-putaway-order">
        <el-table
                :data="tableData"
                v-resize="{height:41}"
                v-loading="loading"
                class="scroll-bar"
                element-loading-text="玩命加载中"
                highlightCurrentRow>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{ emptyText }}
            </div>
            <el-table-column
                    inline-template
                    label="上架单号">
                <div>
                    <ui-tip :content="row.id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="上架区">
                <div>
                    <ui-tip :content="`${row.warehouse_area_id}(${row.warehouse_area_type})`" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="150"
                    label="数量（上架数/总数）">
                <div>
                    <ui-tip :content="`${row.num_update}/${row.num_all}`" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="状态">
                <div>
                    <ui-tip :content="row.status" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="备注">
                <div>
                    <ui-tip :content="row.remark" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="开始时间">
                <div>
                    <ui-tip :content="row.putaway_start_time | filterTime" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="结束时间">
                <div>
                    <ui-tip :content="row.putaway_end_time | filterTime" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="创建人">
                <div>
                    <ui-tip :content="row.creator_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="创建时间">
                <div>
                    <ui-tip :content="row.create_time | filterTime" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text"
                               class="operat-color"
                               size="mini"
                               @click="look_data(scope.row)">查看
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="$listeners['handle-size-change']"
                @current-change="$listeners['handle-current-change']"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </div>
</template>
<style lang="stylus">
    .p-putaway-order{
        .operat-color{
            color: #69f;
        }
    }

</style>
<script>
    export default {
        filters:{
            filterTime(val){
                return datef("YYYY-MM-dd HH:mm:ss",val);
            },
        },
        methods: {
            look_data(row){
                this.$emit('look',row);
            }
        },
        computed:{
            emptyText(){
                return this.firstLoading ? '等待查询数据中...' : '暂无数据'
            }
        },
        props: {
            searchData: {},
            tableData: {},
            loading: {},
            total: {},
            firstLoading: {}
        },
        components: {
            uiTip:require('@/components/ui-tip.vue').default
        },
    }
</script>
