<template>
    <page-dialog title="操作日志" v-model="show" :size="dialogSize" :close-on-click-modal="false">
        <div class="card">
            <el-table
                    highlight-current-row
                    class="scroll-bar mb-sm"
                    v-resize="{height: 150}"
                    :data="lists"
                    border>
                <el-table-column
                        align="center"
                        prop="log_data"
                        label="操作日志">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="creator"
                        width="120"
                        label="操作人">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="操作时间"
                        width="150" inline-template>
                    <div>{{row.create_time}}</div>
                </el-table-column>
            </el-table>
            <el-pagination class="t-right"
                           @size-change="change_size"
                           @current-change="change_page"
                           :current-page="page"
                           :page-size="pageSize"
                           layout="total, prev, pager, next, jumper"
                           :total="count">
            </el-pagination>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="show = false">关闭</el-button>
        </span>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_shipping_method_log} from "../../../api/setLogistics"

    export default {
        data() {
            return {
                dialogSize: "full",
                lists: [],
                page: 1,
                count: 0,
                pageSize: 20,
                show: this.value
            }
        },
        methods: {
            request_detail() {
                let params = {
                    page: this.page,
                    pageSize: this.pageSize,
                    id: this.operateId,
                };
                this.$http(api_shipping_method_log, params).then(res => {
                    this.lists = res.data;
                    this.count = res.count;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            change_size(size) {
                this.pageSize = size;
                this.request_detail(this.lookId);
            },
            change_page(page) {
                this.page = page;
                this.request_detail(this.lookId);
            }
        },
        watch: {
            show(val) {
                this.$emit("input", val)
            },
            value(val) {
                this.show = val;
                if (val) {
                    this.request_detail();
                }
            }
        },
        props: {
            value: {},
            operateId: {}

        },
        components: {
            pageDialog: require('../../../components/page-dialog.vue').default,
        }
    }
</script>
