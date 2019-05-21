<template>
    <page-dialog :title="titles"
                 v-model="show"
                 width="70%"
                 @change="open_dialog">
        <el-form>
            <el-row class="mb-xs mt-xs ml-sm">
                <label-item label="公司类型：">
                    <el-select v-model="companySearchData.type" class="width-lg" @change="companyTypeChange">
                        <el-option v-for="item in companyType"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="公司名称：" class="c_companyName">
                    <super-select v-model="companySearchData.id"
                                  :options="companyName"
                                  :storage-key="`companyNameTestCompany`"
                                  class="width-super">
                    </super-select>
                </label-item>
                <el-button size="mini" type="primary"
                           @click.native="getCompanyList">搜索
                </el-button>
            </el-row>
        </el-form>
        <!--表格-->
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
            <el-table-column label="公司名称"
                             prop="company"
            >
            </el-table-column>
            <el-table-column label="公司类型"
                             prop="company_type">
            </el-table-column>
            <el-table-column label="资料来源"
                             prop="sourceText"
            >
            </el-table-column>
            <el-table-column label="公司法人/姓名"
                             prop="corporation">
            </el-table-column>
            <el-table-column label="注册账号数"
                             prop="account_count">
            </el-table-column>
        </el-table>
        <!--翻页-->
        <el-pagination
            class="mt-sm companyPagination"
            @size-change="size_change"
            @current-change="page_change"
            :current-page="companySearchData.page"
            :page-sizes="[20, 50, 100, 200,500]"
            :page-size="companySearchData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <el-row slot="footer" class="dialog-footer">
            <el-button size="mini"
                       type="primary"
                       @click.native="submit">确 定
            </el-button>
            <el-button size="mini" @click.native="close()">关 闭
            </el-button>
        </el-row>
    </page-dialog>
</template>

<style lang="stylus">
    .c_companyName {
        margin-left: 10px;
    }

    .companyPagination {
        float: right;
        margin-bottom: 3px;
    }
</style>

<script>
    import {api_get_company_name, api_get_company_info_list} from '@/api/company-info';

    export default {
        name: "select-service",
        data() {
            return {
                show: this.value,
                titles: '请选择公司名称',
                companyType: [
                    {label: '企业', value: 0},
                    {label: '个人', value: 1}
                ],
                searchCompanyType: {type: 0},
                companyName: [],
                companySearchData: {
                    channel_id: '',
                    type: 0,
                    id: "",
                    page: 1,
                    pageSize: 20,
                },
                total: 0,
                tableData: [],
                loading: false,
                singleCheck: '',
                obj: {},
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
                    this.restData();
                    this.companySearchData.channel_id = this.channelId;
                    this.total = 0;
                    this.obj = {};
                    this.singleCheck = '';
                    this.get_company(this.searchCompanyType);
                    this.getCompanyList();
                }
            },
            get_company(companyType) {
                this.$http(api_get_company_name, companyType).then(res => {
                    this.companyName = res.data.map(row => {
                        return {label: row.company, value: row.id}
                    });
                }).catch(error => {
                    error && this.$message({type: 'error', message: error.message || error});
                });
            },
            //获取table列表
            getCompanyList() {
                this.loading = true;
                this.$http(api_get_company_info_list, this.companySearchData).then(res => {
                    this.loading = false;
                    this.tableData = res.data;
                    this.total = res.count;
                }).catch(error => {
                    error && this.$message({type: 'error', message: error.message || error});
                }).finally(() => {
                    this.loading = false;
                })
            },
            companyTypeChange() {
                this.searchCompanyType.type = this.companySearchData.type;
                this.get_company(this.searchCompanyType)
            },
            change(row) {
                this.singleCheck = row.id;
                this.obj = row;
            },
            row_click(row) {
                this.change(row);
            },
            //没有显示条数变化
            size_change(size) {
                this.$set(this.companySearchData, 'pageSize', size);
                this.getCompanyList();
            },
            //页码变化
            page_change(page) {
                this.$set(this.companySearchData, 'page', page);
                this.getCompanyList();
            },
            submit() {
                if (!this.singleCheck) return this.$message({type: 'warning', message: `请先选择${this.title}`});
                this.$emit('export-company', this.obj);
                this.restData();
            },
            close() {
                this.show = false;
                this.restData();
            },
            restData() {
                this.companySearchData = {
                    channel_id: '',
                    type: 0,
                    id:'',
                    page: 1,
                    pageSize: 20
                }
            }
        },
        props: {
            value: Boolean,
            label: String,
            channelId: Number,
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
        },
    }
</script>
