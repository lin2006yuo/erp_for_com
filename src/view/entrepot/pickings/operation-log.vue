<template>
    <page-dialog :title="trendAction.title"
                 size="large"
                 v-model="visible"
                 :close-on-click-modal="false">
        <el-row class="mb-sm">
            <label-item class="ml-sm" label="日志内容：">
                <el-input class="width-super" v-model="remark" placeholder="请输入日志内容，按Enter键搜索"
                          @keyup.enter.native="init"></el-input>
            </label-item>
            <el-button class="inline" size="mini" type="primary" @click.native="init">搜索</el-button>
        </el-row>
        <el-table
                :data="tableData"
                v-resize="{height: 150}"
                v-loading="loading"
                class="scroll-bar"
                element-loading-text="玩命加载中"
                highlightCurrentRow>
            <el-table-column label="ID" width="120" prop="id">
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
                    <ui-tip :title="row.remark" :content="row.remark" :width="98"></ui-tip>
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

    import {api_picking_log} from '@/api/pickings'

    export default {
        data() {
            return {
                loading: false,
                tableData: [],
                total: 0,
                pageSize: 20,
                page: 1,
                remark: '',
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
                typeof this.remark === 'string' && (this.remark = this.remark.trim());
                let data = {
                    pageSize: this.pageSize,
                    page: this.page,
                    remark: this.remark
                };
                this.$http(api_picking_log, this.trendAction.id, data).then(res => {
                    console.log('log', res);
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
            trendAction: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            labelItem: require('@/components/label-item').default,
            uiTip: require('@/components/ui-tip.vue').default
        },
    }
</script>
