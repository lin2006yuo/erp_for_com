<template>
    <page-dialog :title="action.title"
                 size="small"
                 v-model="visible"
                 :close-on-click-modal="false">
        <el-table
                :data="tableData"
                height="500"
                v-loading="loading"
                class="scroll-bar"
                element-loading-text="玩命加载中"
                highlightCurrentRow>
            <el-table-column
                    width="100"
                    inline-template
                    label="操作人">
                <div>
                    <ui-tip :content="row.creator" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    width="260"
                    inline-template
                    label="操作内容">
                <div>
                    <ui-tip :content="row.content" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="操作时间">
                <div>
                    <ui-tip :content="row.create_time | timeFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
        </el-table>
        <div slot="footer">
            <el-button size="mini" @click="visible = false">关闭</el-button>
        </div>
        <el-pagination
                class="fr mt-sm"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_logs_turnover} from '@/api/turnover-box'

    export default {
        data() {
            return {
                loading: false,
                tableData: [],
                total: 0,
                pageSize: 20,
                page: 1,
                visible: false
            }
        },
        mounted() {
        },
        filters: {
            timeFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
        },
        methods: {
            init() {
                let data = {
                    pageSize: this.pageSize,
                    page: this.page,
                };
                this.$http(api_logs_turnover, this.action.id, data).then(res => {
                    console.log(res);
                    this.tableData = res.data;
                    this.total = res.count;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            handle_size_change(val) {
                this.pageSize = val;
                this.init();
            },
            handle_current_change(val) {
                this.page = val;
                this.init();
            },
        },
        computed: {},
        watch: {
            visible(val) {
                if (val) {
                    this.init();
                }
                this.$emit('input', val);
            },
            value(val) {
                this.visible = val;
            },
        },
        props: {
            value: {},
            action: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            uiTip: require('@/components/ui-tip.vue').default
        },
    }
</script>
