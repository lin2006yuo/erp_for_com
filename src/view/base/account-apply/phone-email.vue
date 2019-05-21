<template>
    <page-dialog :title="titles"
                 v-model="show"
                 width="70%"
                 @change="open_dialog">
        <el-row class="mb-xs mt-xs ml-sm">
            <label-item :label="`${labelName}：`">
                <el-input v-model.trim="searchData.param"></el-input>
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
            <el-table-column label="邮箱号"
                             prop="email"
                             v-if="label==='email'">
            </el-table-column>
            <el-table-column label="手机号"
                             prop="phone">
            </el-table-column>
            <el-table-column label="手机运营公司"
                             prop="operator_txt"
                             v-if="label==='phone'">
            </el-table-column>
            <el-table-column label="注册人"
                             prop="reg_txt">
            </el-table-column>
            <el-table-column label="注册日期"
                             prop="reg_time_txt">
            </el-table-column>
        </el-table>
        <el-pagination
            class="mt-sm phonePagination"
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
    .phonePagination {
        float: right;
        margin-bottom: 3px;
    }

</style>

<script>
    import {api_get_phone_info, api_get_email_info} from '@/api/account-apply'

    export default {
        name: "select-service",
        data() {
            return {
                show: this.value,
                searchData: {
                    param: '',
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
        computed: {
            labelName() {
                return this.label === 'phone' ? '手机号' : '邮箱';
            },
            titles() {
                if (!this.title) {
                    return `选择${this.labelName}`;
                } else {
                    return this.title;
                }
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
                        param: '',
                        page: 1,
                        pageSize: 20,
                    };
                    this.total = 0;
                    this.obj = {};
                    this.singleCheck = '';
                    this.get_table_list();
                }
            },
            get_table_list() {
                this.loading = true;
                if (this.label === 'phone') {
                    this.$set(this.searchData, 'phone', this.searchData.param);
                    this.$http(api_get_phone_info, this.searchData).then(res => {
                        this.tableData = res.list;
                        this.total = res.count;
                        this.loading = false;
                    }).catch(error => {
                        this.loading = false;
                        error && this.$message({type: 'error', message: error.message || error});
                    });
                } else {
                    this.$set(this.searchData, 'email', this.searchData.param);
                    this.$set(this.searchData, 'channel_id', this.channelId);
                    this.$http(api_get_email_info, this.searchData).then(res => {
                        res.list.forEach(row => {
                            this.$set(row, 'reg_time_txt', row.reg_time_date)
                        });
                        this.tableData = res.list;
                        this.total = res.count;
                        this.loading = false;
                    }).catch(error => {
                        error && this.$message({type: 'error', message: error.message || error});
                    });
                }
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
                if (!this.singleCheck) return this.$message({type: 'warning', message: `请先选择${this.title}`});
                this.$emit('export-data', this.obj);
            }
        },
        props: {
            value: Boolean,
            label: String,
            channelId: Number,
            title: {
                type: String,
                default: ''
            }
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
        },
    }
</script>

