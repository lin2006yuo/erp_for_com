<template>
    <ui-card class="c-collector-list">
        <div slot="header" class="ui-card-header">
            <span class="title">揽收商</span>
            <title-list ref="search" label="url_add_collector" @search="init" @add="add"></title-list>
        </div>
        <el-table
                :data="collectorList"
                highlight-current-row
                @row-click="check_collector"
                :current-row-key="collectorId"
                row-key="id"
                v-resize="{height:41}"
                v-loading="loading" element-loading-text="玩命加载中..." border>
            <el-table-column inline-template label="揽收商名称" align="center" min-width="120" show-overflow-tooltip>
                <ui-tip :content="row.name" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column property="code" label="揽收商代码" min-width="100" align="center"></el-table-column>
            <el-table-column inline-template label="状态" align="center" width="60">
                <div>
                    {{row.status|statusFilter}}
                </div>
            </el-table-column>
            <el-table-column inline-template label="添加/修改时间" align="center" min-width="180" show-overflow-tooltip>
                <div>
                    {{row.create_time}}/
                    {{row.update_time}}
                </div>
            </el-table-column>
        </el-table>
        <el-pagination class="t-right mt-xs"
                       @size-change="handle_size_change"
                       @current-change="handle_current_change"
                       :current-page="pagination.page"
                       :page-sizes="[20, 50, 100, 200,500]"
                       :page-size=pagination.pageSize
                       layout="total, sizes, prev, pager, next, jumper"
                       :total=total>
        </el-pagination>
    </ui-card>
</template>

<style lang="stylus">
    .c-collector-list {
        .el-table__body-wrapper {
            overflow-x: hidden;
        }
    }
</style>

<script>
    import {api_get_collector} from "@/api/collector";

    export default {
        data() {
            return {
                collectorId: '',
                collectorList: [],
                pagination: {
                    page: 1,
                    pageSize: 50,
                },
                total: 0,
                loading: false,
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init(key) {
                this.loading = true;
                let snText = key ? key : '';
                let params = Object.assign({}, this.pagination, {snText: snText})
                this.$http(api_get_collector, params).then(res => {
                    this.total = res.count;
                    this.collectorList = res.data;
                    this.loading = false;
                    if (this.total === 0) {//若无揽收商，则自动转换为添加揽收商
                        this.$emit('add');
                    } else {
                        this.check_collector(this.collectorList[0]);
                    }
                }).catch(code => {
                    this.loading = false;
                    this.$message({
                        type: 'error',
                        message: code.message || code,
                    });
                })
            },
            check_collector(row) {
                this.collectorId = row.id;
                this.$emit('get-collector-info', this.collectorId);
            },
            add() {
                this.$emit('add');
            },
            // 更新编辑后的信息，本地更新不重新获取数据
            update(info) {
                let curCollector = this.collectorList.findIndex(row => row.id === this.collectorId);
                this.$set(this.collectorList, curCollector, info);
            },
            handle_size_change(val) {
                this.pagination.pageSize = val;
                this.init();
            },
            handle_current_change(val) {
                this.pagination.page = val;
                this.init();
            }
        },
        filters: {
            statusFilter(val) {
                return val == 1 ? '启用' : '停用';
            }
        },
        watch: {
            collectorId(val) {
            }
        },
        props: {},
        components: {
            uiTip: require('@/components/ui-tip.vue').default,
            uiCard: require('@/components/ui-card.vue').default,
            titleList: require('../setLogistics/title-list.vue').default,
        }
    }
</script>
