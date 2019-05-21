<template>
    <page-dialog class="c-local-cargo-log" size="large" v-model="visible" @open="open" @close="close" :title="title">
        <el-table :data="curData"
                  class="scroll-bar mt-xs"
                  v-resize="{height: 150}"
                  highlight-current-row border>
            <el-table-column label="SKU" inline-template>
                <div>{{row.sku}}</div>
            </el-table-column>
            <el-table-column label="货位号" inline-template>
                <div>{{row.warehouse_cargo_code}}</div>
            </el-table-column>
            <el-table-column label="操作" inline-template>
                <div>{{row.handle_name}}</div>
            </el-table-column>
            <el-table-column label="操作时间" min-width="110" inline-template>
                <div>{{row.create_time}}</div>
            </el-table-column>
            <el-table-column label="操作人" inline-template>
                <div>{{row.creator}}</div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="t-right pagination mt-sm"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="logList.length">
        </el-pagination>
        <div slot="footer">
            <el-button size="mini" @click.native="visible = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .c-local-cargo-log {
        /*.dialog__body {
            position: relative;
        }
        .pagination {
            position: absolute;
            width: 100%;
        }*/
    }
</style>

<script>
    export default {
        data() {
            return {
                visible: this.value,
                curData: [],
                page: 1,
                pageSize: 20,
            }
        },
        methods: {
            open() {
                this.$nextTick(() => {
                    this.paging_handle();
                });
            },
            sure() {

            },
            close() {
                this.curData = [];
                this.page = 1;
                this.pageSize = 20;
            },
            handle_size_change(val) {
                this.pageSize = val;
                let maxPage = Math.ceil(this.packages.length / this.pageSize) - 1;
                this.page = this.page > maxPage ? maxPage : this.page;
                this.paging_handle();
            },
            handle_current_change(val) {
                this.page = val;
                this.paging_handle();
            },
            paging_handle() {
                this.curData = this.pagingData[this.page - 1];
            },
        },
        computed: {
            pagingData() { // 分页
                let pagingData = [];
                if (this.logList.length === 0) {
                    return pagingData;
                }
                let length = Math.ceil(this.logList.length / this.pageSize);
                for (let i = 0; i < length; i++) {
                    let start = i * this.pageSize;
                    pagingData.push(this.logList.slice(start, start + this.pageSize));
                }
                return pagingData;
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
            title: {},
            logList: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
        }
    }
</script>