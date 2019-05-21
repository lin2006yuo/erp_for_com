<template>
    <div>
        <el-table :data="tableData"
                  class="selling-profit-table"
                  highlight-current-row
                  v-loading="loading"
                  element-loading-text="玩命加载中"
                  v-resize="{height:41}">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{ emptyText }}
            </div>
            <el-table-column
                    v-for="(item,index) in tableColumns"
                    :key="`row_${index}`"
                    :label="item.label"
                    inline-template
                    v-if="!item.hide"
                    :width="item.width"
            >
                <div class="selling-profit-table-ellipsis">

                    <ui-tip :content="handle_data(row, item)" :width="item.uiWidth || 98"></ui-tip>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </div>
</template>
<style lang="stylus">
    .selling-profit-table {
        .selling-profit-table-ellipsis {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            width: 90%;
        }
    }
</style>
<script>
    import {api_export_performance} from '@/api/selling-profit';

    export default {
        page: {},
        data() {
            return {
                tableData: [],
                loading: false,
                firstLoading: true,
                total: 0,
            }
        },
        methods: {
            init() {
                this.loading = true;
                let data = this.deal_time(this.searchData);
                this.$http(this.api, data).then(res => {
                    this.loading = false;
                    this.firstLoading = false;
                    this.tableData = res.data;
                    this.total = res.count;
                    let flag = this.tableData.length <= 0;
                    this.$emit('can-export', flag);
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                    this.loading = false;
                    this.firstLoading = false;
                });
            },
            //处理年月日
            deal_time(searchData) {
                //处理年月日 YYYY-MM-dd
                let data = clone(searchData);
                if (searchData.date_b) {
                    data.date_b = datef('YYYY-MM-dd', searchData.date_b / 1000);
                } else {
                    data.date_b = '';
                }
                if (searchData.date_e) {
                    data.date_e = datef('YYYY-MM-dd', searchData.date_e / 1000);
                } else {
                    data.date_e = '';
                }
                return data;
            },
            exports() {
                let data = this.deal_time(this.searchData);
                return this.$http(api_export_performance, data).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.$emit('exports-result', true);
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            //分页器
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init();
            },
            handle_data(row, item) {
                return item.handle ? item.handle(row[item.value]) : row[item.value]
            }
        },
        computed: {
            emptyText() {
                return this.firstLoading ? '等待查询数据中...' : '暂无数据'
            }
        },
        watch: {},
        props: {
            searchData: {},
            tableColumns: {
                type: Array
            },
            api: {
                require: true
            }
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default,
        },
    }
</script>
