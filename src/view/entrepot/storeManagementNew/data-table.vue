<template>
    <el-row class="xmj-data-table">
        <div class="table_">
            <el-table class="scroll-bar"
                      :data="tableData.tableList"
                      @row-click="store_check"
                      v-resize="{height:41}"
                      :row-class-name="row_class"
                      v-loading="loading" element-loading-text="玩命加载中..." border>
                <el-table-column label="代码" inline-template>
                    <div>
                        <ui-tip :content="row.code" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column label="仓库名称" inline-template>
                    <div>
                        {{row.name}}
                    </div>
                </el-table-column>
                <el-table-column label="仓库类型" inline-template>
                    <div>
                        <ui-tip :content="row.type_name" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column property="country_code" label="所在国家" align="center">

                </el-table-column>
                <el-table-column inline-template label="状态" width="60" align="center">
                    <div>
                        {{row.status | statusFilter}}
                    </div>
                </el-table-column>
                <el-table-column inline-template label="添加/修改时间" align="center">
                    <div class="t-center">
                        <div>
                            {{row.create_time|timeFilter}}
                        </div>
                        <div>
                            {{row.update_time|timeFilter}}
                        </div>
                    </div>
                </el-table-column>
                <el-table-column inline-template label="操作" width="60" align="center">
                    <permission tag="span" class="operate" @click.stop="del(row)" :route="apis.url_store_del">删除
                    </permission>
                </el-table-column>
            </el-table>
            <el-pagination
                    class="page_absolute"
                    @size-change="handle_size_change"
                    @current-change="handle_current_change"
                    :current-page="params.page"
                    :page-sizes="[20, 50, 100, 200,500]"
                    :page-size=params.pageSize
                    layout="total, sizes, prev, pager, next, jumper"
                    :total=tableData.total>
            </el-pagination>
        </div>
    </el-row>
</template>
<style lang="stylus" scoped>
    .el-table tr.current-row {
        background-color: rgba(173, 227, 255, .7);
    }

    .page_absolute {
        position: relative;
        box-sizing: border-box;
        z-index: 999;
        background: #fff;
        text-align: right;
        padding-bottom: 3px;
        margin-top: 10px;
        margin-bottom: 5px;
    }
</style>
<script>
    import {store_status, store_del, url_store_del} from '../../../api/storeManagement';

    export default {
        permission: {
            url_store_del
        },
        data() {
            return {
                num: 0
            }
        },
        methods: {
            store_check(row) {//------查看
                this.$emit('store_check', row);
            },
            row_class(row) {
                return row.id === this.entrepotId ? 'current-row' : '';
            },
            del(row) {
                this.$emit('del', row)

            },
            handle_size_change(val) {
                this.$emit('size-change', val)
            },
            handle_current_change(val) {
                this.$emit('cur-change', val)
            }

        },
        computed: {},
        filters: {
            typeFilter(val) {
                switch (val) {
                    case 1:
                        return '本地仓';
                        break;
                    case 2:
                        return '海外仓';
                        break;
                    case 3:
                        return '递四方仓库';
                        break;
                    case 4:
                        return '万邑通仓库';
                        break;
                    case 5:
                        return 'FBA仓库';
                        break;
                    case 6:
                        return '中转仓';
                        break;
                }
            },
            timeFilter(val) {
                return datef('YYYY-MM-dd', val);
            },
            statusFilter(val) {
                return val === 1 ? '启用' : '停用';
            }
        },
        watch: {
            entrepotId(val) {
                if (val) {
                    this.num = val
                } else {
                    this.num = 0
                }
            }
        },
        props: {
            loading: {
                required: true,
                type: Boolean
            },
            tableData: {
                required: true,
                type: Object
            },
            params: {
                required: true,
                type: Object
            },
            entrepotId: {
                required: true,
                type: Number
            }
        },
        components: {
            uiTip: require('../../../components/ui-tip.vue').default
        }
    }
</script>
