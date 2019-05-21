<template>
    <div class="title-table-dialog">
        <page-dialog v-model="show" size="small" :title="title" class="table-container" :close-on-click-modal="isClose">
            <el-table
                    ref="titleTable"
                    :data="exportTitle"
                    element-loading-text="玩命加载中..."
                    @selection-change="title_data_change">
                <el-table-column
                        type="selection"
                        width="35">
                </el-table-column>
                <el-table-column
                        label="全选"
                        prop="title"
                        width="120">
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" class="mr-sm" type="primary" @click.native="confirm">确认</el-button>
                <el-button size="mini" class="mr-sm" @click.native="show=false">关闭</el-button>
            </div>
        </page-dialog>
        <div style="position:fixed;left:0;top:0;right:0;bottom:0;background:#000;opacity:.4;z-index:999"
             v-if="false"></div>
    </div>
</template>
<style lang="stylus">
    .title-table-dialog {
        .el-table__body {
            width: 100% !important;
            tbody {
                width: 100% !important;
                display: table-caption;
            }
        }
        .el-table__row {
            width: 33.3% !important;
            float: left;
        }
        & td, & th {
            border: 0 !important;
        }
        & th, & thead tr {
            background-color: transparent;
            text-align: left;
        }
    }
</style>

<script>
    export default {
        data() {
            return {
                show: this.value,
                selectedTitle: []
            }
        },
        methods: {
            confirm() {
                this.$emit('export-title', this.selectedTitle);
            },
            title_data_change(val) {
                this.selectedTitle = val;
            },
        },
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                this.$emit('input', val);
            }
        },
        props: {
            title: {
                required: true,
                type: String
            },
            isClose: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            exportTitle: {
                type: Array
            },
            value: {
                type: Boolean
            }
        },
        components: {
            pageDialog: require("@/components/page-dialog.vue").default,
        }
    }
</script>

