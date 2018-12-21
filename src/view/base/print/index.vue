<template>
    <page class="print-p-index">
        <search-card @search="search" @enter='search' :params="searchData" :clears="clears">
            <label class="inline">模板名称：</label>
            <el-input v.sf.temp_name v-model="searchData.temp_name" placeholder="请输入" class="mr-sm inline"></el-input>
            <label>模板类型：</label>
            <el-select v-sf.temp_type v-model="searchData.temp_type" placeholder="请选择"
                       class="mr-sm inline s-width-default">
                <el-option
                        v-for="item in templateType"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
            <!--<el-button  class="inline" size="mini" type="primary" @click.native="search">搜索</el-button>-->
            <!--<el-button  class="inline" size="mini"  @click.native="clear">清空搜索</el-button>-->
        </search-card>
        <el-row class="ml-sm mb-xs mt-xs">
            <permission
                    tag="ElButton"
                    :route="apis.url_label_save"
                    class="inline" size="mini" type="primary" @click.native="add">添加
            </permission>
            <!--&lt;!&ndash;<el-button  class="inline" size="mini" type="primary" @click.native="add">添加</el-button>&ndash;&gt;-->
            <permission
                    tag="requestButton"
                    :route="apis.url_label_del"
                    class="inline" :request="del" :disabled="selected.length <= 0">删除
            </permission>
            <!--<el-button  class="inline" size="mini" type="primary" @click.native="del">删除</el-button>-->
        </el-row>
        <el-table
                class="scroll-bar"
                v-resize="{height:10}"
                :data="tableData"
                v-loading="loading"
                element-loading-text="玩命加载中..."
                highlight-current-row
                @selection-change="handleSelectionChange"
                style="width: 100%">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                    type="selection"
                    width="35">
            </el-table-column>
            <el-table-column
                    prop="temp_name"
                    label="模板名称">
            </el-table-column>
            <el-table-column
                    prop="temp_type"
                    label="模板类型">
            </el-table-column>
            <el-table-column
                    prop="warehouse_name"
                    label="仓库">
            </el-table-column>
            <el-table-column
                    prop="size"
                    label="尺寸（mm）">
            </el-table-column>
            <el-table-column
                    prop="creater"
                    label="创建人/更新人">
            </el-table-column>
            <el-table-column
                    inline-template
                    label="是否默认模板">
                <span>{{row.is_default===0?"否":'是'}}</span>
            </el-table-column>
            <el-table-column
                    label="创建时间/更新时间">
                <template slot-scope="scope">
                    <times :time="scope.row.create_time" class="inline"></times>
                    <span>/</span>
                    <times :time="scope.row.update_time" class="inline"></times>
                </template>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="操作">
                <div>
                    <permission
                            tag="span"
                            :route="apis.url_label_edit"
                            class="operate" @click="edit(row)"
                            size="mini">编辑
                    </permission>
                    <span>|</span>
                    <permission
                            tag="span"
                            :route="apis.url_label_edit_copy"
                            class="operate" @click="copy(row)"
                            size="mini">复制
                    </permission>
                </div>
            </el-table-column>
        </el-table>
        <add-edit v-model="visible" :template-data="templateData" ref="edit" @refresh="init" :flag="flag"></add-edit>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {
        api_label_list,
        api_label_type,
        api_label_edit,
        api_label_del,
        api_label_edit_copy,
        url_label_save,
        url_label_del,
        url_label_edit_copy,
        url_label_edit
    } from "../../../api/print"

    export default {
        permission: {
            url_label_save, url_label_del, url_label_edit_copy, url_label_edit
        },
        page: {},
        refresh() {
            this.init();
            this.get_type();
        },
        data() {
            return {
                searchData: {
                    temp_name: '',
                    temp_type: '',
                    page: 1,
                    pageSize: 20
                },
                clears: {
                    temp_name: '',
                    temp_type: '',
                    page: 1,
                    pageSize: 20
                },
                templateType: [],
                tableData: [],
                selected: [],
                loading: false,
                visible: false,
                flag: 0,
                templateData: {
                    temp_name: '',
                    temp_type: '',
                    html: '',
                    temp_data: [],
                    sub_temp: [],
                    size: {
                        height: 20,
                        width: 50,
                    },
                    warehouse_id: '',
                    is_default: false,
                },
                firstLoading: true
            }
        },
        created() {

            this.init();
            this.get_type();

        },
        mounted() {
        },
        computed: {
            emptyText() {
                return this.firstLoading ? '等待查询数据中...' : '暂无数据'
            }
        },
        methods: {
            init() {
                this.loading = true;
                this.$http(api_label_list, this.searchData).then(res => {
                    this.loading = false;
                    this.tableData = res.data;
                    this.firstLoading = false;
                }).catch(code => {
                    console.log(code)
                })
            },
            get_type() {
                this.$http(api_label_type).then(res => {
                    this.templateType = [{name: '全部', id: ''}, ...res];
                }).catch(code => {
                    console.log(code);
                })
            },
            edit(row) {
                this.$http(api_label_edit, row.id).then(res => {
                    this.flag = 1;
                    this.templateData.temp_name = res.temp_name;
                    this.templateData.id = res.id;
                    this.templateData.size = res.size;
                    if (!!res.sub_temp) {
                        this.templateData.sub_temp = res.sub_temp.map(row => {
                            return row.id
                        });
                    }
                    this.templateData.temp_type = res.temp_type;
                    this.templateData.temp_data = res.temp_data;
                    this.templateData.html = res.html;
                    this.templateData.is_default = res.is_default ? true : false;
                    this.templateData.warehouse_id = res.warehouse_id || '';
                    this.visible = true;
                    this.$nextTick(() => {
                        this.$refs.edit.get_list(false)
                    })
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })
            },
            copy(row) {
                this.$http(api_label_edit_copy, row.id).then(res => {
                    this.flag = 2;
                    this.templateData.temp_name = res.temp_name;
                    this.templateData.id = 0;
                    this.templateData.size = res.size;
                    this.templateData.temp_type = res.temp_type;
                    this.templateData.temp_data = res.temp_data;
                    this.templateData.html = res.html;
                    this.templateData.is_default = res.is_default ? true : false;
                    this.templateData.warehouse_id = res.warehouse_id || '';
                    this.visible = true;
                    this.$nextTick(() => {
                        this.$refs.edit.get_list(false)
                    })
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })
            },
            search() {
                this.init();
            },
            clear() {
                this.searchData = {
                    temp_name: '',
                    temp_type: '',
                    page: 1,
                    pageSize: 20
                };
                this.init()
            },
            add() {
                this.visible = true;
                this.flag = 0;
                this.templateData = {
                    temp_name: '',
                    temp_type: '',
                    html: '',
                    temp_data: [],
                    sub_temp: [],
                    size: {
                        height: 20,
                        width: 50,
                    },
                    warehouse_id: '',
                    is_default: false,
                }
            },
            del() {
                return this.$confirm(`您将删除已选模板, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = this.selected.map(row => row.id).join(',')
                    return this.$http(api_label_del, {ids}).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.selected.forEach(row => {
                            let index = this.tableData.indexOfFun(row, function (old, row) {
                                return old.id === row.id
                            });
                            this.tableData.splice(index, 1);
                        });
                        return Promise.resolve()
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleSelectionChange(val) {
                this.selected = val;
            }
        },
        filters: {},
        watch: {},
        props: {},
        components: {
            addEdit: require('./add-edit.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            requestButton: require('@/global-components/request-button').default
        }
    }
</script>
