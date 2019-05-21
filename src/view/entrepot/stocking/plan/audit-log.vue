<template>
    <page-dialog size="large" v-model="visible" @open="open" @close="close" :title="`备货计划${action.code}操作日志`"
                 :close-on-click-modal="false">
        <el-table
                :data="tableData"
                v-resize="{height: 150}"
                v-loading="loading"
                class="scroll-bar"
                element-loading-text="玩命加载中"
                highlightCurrentRow>
            <el-table-column label="ID" width="120" prop="log_id">
            </el-table-column>
            <el-table-column
                    width="100"
                    inline-template
                    label="操作人">
                <div>
                    <ui-tip :content="row.operator" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="日志内容">
                <div>
                    <ui-tip :title="row.data" :content="row.data" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="200"
                    label="创建时间">
                <div>
                    <ui-tip :content="row.create_time | timeFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
        </el-table>
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
        <div slot="footer">
            <el-button size="mini" @click.native="visible = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_audit_log} from "@/api/stocking";

    export default {
        data() {
            return {
                visible: false,
                loading: false,
                tableData: [],
                total: 0,
                pageSize: 50,
                page: 1,
            }
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
            open() {
                this.init();
            },
            close() {
                this.$emit('close');
            },
            init() {
                let data = {
                    pageSize: this.pageSize,
                    page: this.page
                };
                this.$http(api_audit_log, this.action.id, data).then(res => {
                    console.log('log', res);
                    this.tableData = res.list;
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
        watch: {
            value(val) {
                this.visible = val;
            },
            visible(val) {
                this.$emit('input', val);
            }
        },
        props: {
            value: {},
            action: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            labelItem: require('@/components/label-item').default,
            uiTip: require('@/components/ui-tip.vue').default
        }
    }
</script>