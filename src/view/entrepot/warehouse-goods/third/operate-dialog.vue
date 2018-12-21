<template>
    <page class="p-operate-dialog">
        <page-dialog title="操作日志" v-model="dialog" size="large" :close-on-click-modal="false">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="平台分类库存日志" name="first">
                    <el-table v-resize="{height: 150}"
                              class="scroll-bar mb-sm"
                              :data="logsData.data"
                              highlight-current-row>
                        <el-table-column label="操作" prop="handle_name"></el-table-column>
                        <el-table-column label="信息" prop="remark"></el-table-column>
                        <el-table-column label="操作人" prop="creator" width="120"></el-table-column>
                        <el-table-column label="操作时间" prop="create_time" width="200"></el-table-column>
                    </el-table>
                    <el-pagination class="t-right"
                                   @size-change="change_size"
                                   @current-change="change_page"
                                   :current-page="logsData.page"
                                   :page-sizes="[10,20, 50, 100, 200]"
                                   :page-size="logsData.pageSize"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :total="logsData.count">
                    </el-pagination>
                </el-tab-pane>
                <el-tab-pane label="修改预警日志" name="second">
                    <el-table v-resize="{height: 150}"
                              class="scroll-bar mb-sm"
                              :data="logsData.data"
                              highlight-current-row>
                        <el-table-column label="操作" prop="handle_name"></el-table-column>
                        <el-table-column label="信息" prop="remark"></el-table-column>
                        <el-table-column label="操作人" prop="creator" width="120"></el-table-column>
                        <el-table-column label="操作时间" prop="create_time" width="200"></el-table-column>
                    </el-table>
                    <el-pagination class="t-right"
                                   @size-change="change_size"
                                   @current-change="change_page"
                                   :current-page="logsData.page"
                                   :page-sizes="[10,20, 50, 100, 200]"
                                   :page-size="logsData.pageSize"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :total="logsData.count">
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
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
                activeName: 'first'
            }
        },
        methods: {
            handleClick(tab) {
                console.log(tab);
                if (tab.name === 'second') {
                    this.$emit('update-data', this.logsData, 2);
                } else {
                    this.$emit('update-data', this.logsData, 1);
                }
            },
            change_size(val) {
                this.logsData.pageSize = val;
                if (this.activeName === 'second') {
                    this.$emit('update-data', this.logsData, 2);
                } else {
                    this.$emit('update-data', this.logsData, 1);
                }
            },
            change_page(val) {
                this.logsData.page = val;
                if (this.activeName === 'second') {
                    this.$emit('update-data', this.logsData, 2);
                } else {
                    this.$emit('update-data', this.logsData, 1);
                }
            },
        },
        watch: {
            dialog(val) {
                this.$emit('input', val)
            },
            value(val) {
                this.dialog = val;
                this.activeName = 'first';
            }
        },
        props: {
            value: {},
            logsData: {}
        },
        components: {
            pageDialog: require('../../../../components/page-dialog.vue').default,
        }
    }
</script>
