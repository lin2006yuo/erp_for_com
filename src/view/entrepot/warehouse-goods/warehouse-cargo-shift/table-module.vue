<template>
    <div>
        <el-table
                class="mt-xs scroll-bar"
                v-resize="{height:41}"
                :data="tableData"
                border
                highlight-current-row
                v-loading="loading"
                element-loading-text="拼命加载中"
                @selection-change="$listeners['handle-selection-change']">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{ emptyText }}
            </div>
            <el-table-column
                    type="selection"
                    width="50">
            </el-table-column>

            <el-table-column label="移库单号" inline-template>
                <div>
                    <ui-tip :content="row.code" :width="98"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="数量(总数)" inline-template>
                <div>
                    <ui-tip :content="row.quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="状态" inline-template>
                <div>
                    <ui-tip :content="row.status|statusFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="创建人" inline-template>
                <div>
                    <ui-tip :content="row.creator" :width="98"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="创建时间" inline-template>
                <div>
                    <span>{{row.create_time | filterTime}}</span>
                </div>
            </el-table-column>

            <el-table-column label="操作人" inline-template>
                <div>
                    <ui-tip :content="row.shift_id" :width="98"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="开始时间" width="150" inline-template >
                <div>
                    <span>{{row.start_time | filterTime}}</span>
                </div>
            </el-table-column>

            <el-table-column label="结束时间" width="150" inline-template >
                <div>
                    <span>{{row.end_time | filterTime}}</span>
                </div>
            </el-table-column>

            <el-table-column label="操作" inline-template>
                <div>
                    <el-button type="text" @click.native="look_audit(row,'look')">查看</el-button>
                    <span v-if="row.status === 0">|</span>
                    <el-button type="text" @click.native="look_audit(row,'audit')" v-if="row.status === 0">审核</el-button>
                </div>
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

<style lang="stylus" scoped>

</style>

<script>
    export default {
        filters: {
            filterTime(val){
                return datef("YYYY-MM-dd HH:mm:ss",val);
            },
            statusFilter(val){
                const statusName = new Map()
                    .set(-1,'作废')
                    .set(0,'待审核')
                    .set(1,'待处理')
                    .set(2,'移位中')
                    .set(3,'已完成');
                return statusName.get(val)
            }
        },
        methods:{
            look_audit(row, type){
                this.$emit('look-audit', row, type)
            }
        },
        computed:{
            emptyText(){
                return this.firstLoading?'等待查询数据中...':'暂无数据'
            }
        },
        props: {
            tableData: {
                required: true,
                type: Array
            },
            loading: {
                required: true,
                type: Boolean
            },
            firstLoading: {
                required: true,
                type: Boolean
            },
            searchData: {
                required: true,
                type: Object
            },
            total: {
                required: true,
                type: Number
            },
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default
        }
    }
</script>