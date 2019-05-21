<template>
    <page class="p-operate-dialog">
        <page-dialog title="操作日志" v-model="dialog" size="large" :close-on-click-modal="false">
            <el-table
                    :data="logsData"
                    class="scroll-bar"
                    highlight-current-row>
                <el-table-column label="操作" prop="handle_name"></el-table-column>
                <el-table-column label="信息" prop="remark"></el-table-column>
                <el-table-column label="操作人" prop="creator" width="120"></el-table-column>
                <el-table-column label="操作时间" prop="create_time" width="200"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="dialog = false">关闭</el-button>
            </span>
        </page-dialog>
    </page>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {
                dialog: this.value,
            }
        },
        watch: {
            dialog(val) {
                this.$emit('input', val)
            },
            value(val) {
                this.dialog = val;
            }
        },
        props: {
            value: {},
            logsData: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
        }
    }
</script>
