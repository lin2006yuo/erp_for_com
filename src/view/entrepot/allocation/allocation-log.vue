<template>
    <page-dialog size="large" v-model="visible" @open="open" @close="close" :title="trendAction.title">
        <el-table
                :data="logData"
                v-resize="{height: 150}"
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
                    inline-template
                    label="操作内容">
                <div>
                    <ui-tip :title="row.content" :content="row.content" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="200"
                    label="操作时间">
                <div>
                    <ui-tip :content="row.create_time" :width="98"></ui-tip>
                </div>
            </el-table-column>
        </el-table>
        <div slot="footer">
            <el-button size="mini" @click.native="visible = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_allocation_log} from "@/api/transfer-plan";

    export default {
        data() {
            return {
                visible: false,
                loading: false,
                logData: [],
            }
        },
        methods: {
            open() {
                this.init();
            },
            init() {
                this.loading = true;
                this.$http(api_allocation_log, this.trendAction.id).then(res => {
                    this.logData = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => {
                    this.loading = false;
                })
            },
            sure() {

            },
            close() {
                this.loading = false;
                this.logData = [];
            }
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
            trendAction: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
        }
    }
</script>