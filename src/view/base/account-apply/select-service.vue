<template>
    <page-dialog :title="title"
                 v-model="show"
                 width="70%"
                 @change="open_dialog">
        <el-row class="mb-xs mt-xs ml-sm">
            <label-item label="服务器名：">
                <el-input v-model.trim="searchData.name"></el-input>
            </label-item>
            <el-button size="mini" type="primary"
                       @click.native="get_table_list">搜索
            </el-button>
        </el-row>
        <el-table :data="tableData"
                  v-loading="loading"
                  highlight-current-row
                  max-height="550"
                  element-loading-text="玩命加载中"
                  empty-text="暂无数据"
                  @row-click="row_click">
            <el-table-column label="单选"
                             width="70">
                <template slot-scope="scope">
                    <el-radio class="radio" v-model="singleCheck"
                              :label="scope.row.id"
                              @change.native="change(scope.row)">&nbsp
                    </el-radio>
                </template>
            </el-table-column>
            <el-table-column label="服务器名" prop="name">
            </el-table-column>
            <el-table-column label="IP地址" prop="ip">
            </el-table-column>
            <!--<el-table-column label="MAC地址" prop="mac">-->
            <!--</el-table-column>-->
            <el-table-column label="类型" prop="type">
            </el-table-column>
            <el-table-column label="同平台引用数" prop="use_channel">
            </el-table-column>
            <el-table-column label="最后一次使用时间">
                <template slot-scope="scope">
                    {{scope.row.last_use_time|fmsdatetime}}
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="mt-sm servicePagination"
            @size-change="size_change"
            @current-change="page_change"
            :current-page="searchData.page"
            :page-sizes="[20, 50, 100, 200,500]"
            :page-size="searchData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <el-row slot="footer" class="dialog-footer">
            <el-button size="mini"
                       type="primary"
                       @click.native="submit">确 定
            </el-button>
            <el-button size="mini" @click.native="show=false">关 闭
            </el-button>
        </el-row>
    </page-dialog>
</template>

<style lang="stylus" scoped>
    .servicePagination {
        float: right;
        margin-bottom: 3px;
    }
</style>

<script>
    import {api_get_servers} from '@/api/account-apply';

    export default {
        name: "select-service",
        data() {
            return {
                show: this.value,
                searchData: {
                    name: '',
                    page: 1,
                    pageSize: 20,
                },
                total: 0,
                tableData: [],
                loading: false,
                singleCheck: '',
                obj: {}
            }
        },
        watch: {
            show(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.show = val;
            }
        },
        methods: {
            open_dialog(is_open) {
                if (is_open) {
                    this.searchData = {
                        name: '',
                        page: 1,
                        pageSize: 20,
                        status: 0,
                        channel_id: this.channelId
                    };
                    this.total = 0;
                    this.obj = {};
                    this.singleCheck = '';
                    this.get_table_list();
                }
            },
            get_table_list() {
                this.loading = true;
                this.$http(api_get_servers, this.searchData).then(res => {
                    this.tableData = res.data;
                    this.total = res.count;
                    this.loading = false;
                }).catch(error => {
                    this.loading = false;
                    error && this.$message({type: 'error', message: error.message || error});
                });
            },
            change(row) {
                this.singleCheck = row.id;
                this.obj = row;
            },
            row_click(row) {
                this.change(row);
            },
            size_change(size) {
                this.$set(this.searchData, 'pageSize', size);
                this.get_table_list();
            },
            page_change(page) {
                this.$set(this.searchData, 'page', page);
                this.get_table_list();
            },
            submit() {
                console.log(this.singleCheck, this.obj);
                if (!this.singleCheck) return this.$message({type: 'warning', message: '请先选择服务器'});
                this.$emit('export-service', this.obj);
            }
        },
        props: {
            value: Boolean,
            title: {
                type: String,
                default: '选择服务器'
            },
            channelId: Number
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
        },
    }
</script>

