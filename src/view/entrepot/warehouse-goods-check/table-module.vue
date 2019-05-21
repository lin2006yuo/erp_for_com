<template>
    <div class="p-turnover-box">
        <el-table
                :data="tableData"
                v-resize="{height:41}"
                v-loading="loading"
                class="scroll-bar"
                element-loading-text="玩命加载中"
                @selection-change="$listeners['handle-selection-change']"
                highlightCurrentRow>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{ emptyText }}
            </div>
            <el-table-column
                    type="selection"
                    width="50">
            </el-table-column>
            <el-table-column
                    inline-template
                    label="盘点单号">
                <div>
                    <ui-tip :content="row.id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="仓库">
                <div>
                    <ui-tip :content="row.warehouse_code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    width="80"
                    label="盘点人">
                <div>
                    <ui-tip :content="row.checker_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                min-width="60"
                label="盘点状态">
                <div>
                    <ui-tip :content="row.status_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="60"
                    label="创建人">
                <div>
                    <ui-tip :content="row.creator_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                min-width="130"
                    inline-template
                    label="创建时间">
                <div>
                    <ui-tip :content="row.create_time | timeFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="待审核人">
                <div>
                    <ui-tip :content="row.valid_auditor" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="审核人">
                <div>
                    <div v-for="item in row.auditor">{{item}}</div>
                </div>
            </el-table-column>
            <el-table-column
                    min-width="130"
                    inline-template
                    label="审核时间">
                <div>
                    <div v-for="item in row.auditor_time">{{item | timeFilter}}</div>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                min-width="60"
                label="完成人">
                <div>
                    <ui-tip :content="row.update_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                min-width="130"
                label="完成时间">
                <div>
                    <ui-tip :content="row.check_end_time | timeFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                min-width="200"
                    label="操作">
                <template slot-scope="scope">
                    <permission tag="ElButton"
                                 :route="apis.url_get_detail"
                                 type="text"
                                 class="operat-color"
                                 size="mini"
                                 @click="look(scope.row)">查看
                    </permission>
                    <span> | </span>
                    <el-button type="text"
                                class="operat-color"
                                size="mini"
                                @click="print_list(scope.row)">打印
                    </el-button>
                    <span> | </span>
                    <permission tag="ElButton"
                                :route="apis.url_get_detail"
                                type="text"
                                :class="{'operat-color':scope.row.status !== 3 && scope.row.status !== 4}"
                                size="mini"
                                :disabled="scope.row.status === 3 || scope.row.status === 4"
                                @click="edit(scope.row)">编辑
                    </permission>
                    <span> | </span>
                    <permission tag="ElButton"
                                :route="apis.url_finish_detail"
                                type="text"
                                :class="{'operat-color':scope.row.can_auditor}"
                                :disabled="!scope.row.can_auditor"
                                size="mini"
                                @click="finish(scope.row)">审核
                    </permission>
                    <span> | </span>
                    <permission tag="ElButton"
                                :route="apis.url_cancels_check"
                                type="text"
                                :class="{'operat-color':!(scope.row.status === 3 || scope.row.status === 4)}"
                                :disabled="scope.row.status === 3 || scope.row.status === 4"
                                size="mini"
                                @click="invalid(scope.row)">作废
                    </permission>
                    <span> | </span>
                    <permission tag="ElButton"
                                :route="apis.url_delete_check"
                                type="text"
                                :class="{'operat-color':scope.row.status === 0}"
                                :disabled="scope.row.status !== 0"
                                size="mini"
                                @click="delete_check(scope.row)">删除
                    </permission>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="$listeners['handle-size-change']"
                @current-change="$listeners['handle-current-change']"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </div>
</template>
<style lang="stylus">
    .p-turnover-box{
        .operat-color{
            color: #69f;
        }
    }

</style>
<script>
    import {api_warehouse_goods_check, api_finish_detail, api_cancels_check, api_delete_check,
        url_get_detail, url_finish_detail, url_cancels_check, url_delete_check
    } from '@/api/warehouse-goods-check'
    export default {
        permission: {
            url_get_detail,
            url_finish_detail,
            url_cancels_check,
            url_delete_check
        },
        filters:{
            timeFilter(val){
                if(val){
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
        },
        methods: {
            look(row){
                this.$emit('look',row);
            },
            edit(row){
                this.$emit('edit', row);
            },
            finish(row){
                this.$emit('finish',row);
            },
            invalid(row){
                this.$confirm(`您将作废盘点单${row.id},确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_cancels_check, row.id).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.$emit('init')
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            delete_check(row){
                this.$confirm(`您将删除盘点单${row.id},确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_check, row.id).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.$emit('init')
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            print_list(row){
                this.$emit('print',row);
            }
        },
        computed: {
            emptyText(){
                return this.firstLoading ? '等待查询数据中...' : '暂无数据'
            }
        },
        props: {
            searchData:{},
            tableData: {},
            loading: {},
            total: {},
            firstLoading: {}
        },
        components: {
            uiTip:require('@/components/ui-tip.vue').default,
        },
    }
</script>
