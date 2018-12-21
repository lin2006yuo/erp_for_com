<template>
    <div class="c-demand-schedules-tableModule">
        <el-table class="mb-sm scroll-bar"
                  border :data="tableData"
                  highlight-current-row
                  v-resize="{height:41}"
                  @selection-change="selection_change"
                  v-loading="loading"
                  element-loading-text="玩命加载中...">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection" width="30" align="center">
            </el-table-column>
            <el-table-column :render-header="filterHeader('编号+|版本号')" min-width="40" inline-template>
                <div>
                    <div class="p-table-list-td-text" :title="row.id">{{row.id}}</div>
                    <div class="p-table-list-td-text" :title="row.version">{{row.version}}</div>
                </div>
            </el-table-column>
            <el-table-column label="需求状态" min-width="45" inline-template>
                <div class="p-table-list-td-text" :title="row.status|filterStatus">{{row.status|filterStatus}}</div>
            </el-table-column>
            <el-table-column :render-header="filterHeader('优先级+|需求分类')" min-width="45" inline-template>
                <div>
                    <div class="p-table-list-td-text" :title="row.priority|filterPriority">{{row.priority|filterPriority}}</div>
                    <div class="p-table-list-td-text" :title="row.type|filterType">{{row.type|filterType}}</div>
                </div>
            </el-table-column>
            <el-table-column label="功能模块" min-width="45" inline-template>
                <div class="p-table-list-td-text" :title="row.module">{{row.module}}</div>
            </el-table-column>
            <el-table-column label="需求概述" inline-template>
                <div class="p-table-list-td-text" :title="row.summary">{{row.summary}}</div>
            </el-table-column>
            <el-table-column :render-header="filterHeader('提出人+|提出时间')" min-width="55" inline-template>
                <div>
                    <div class="p-table-list-td-text" :title="row.raiser">{{row.raiser}}</div>
                    <div class="p-table-list-td-text" :title="row.raise_time|filterDate">{{row.raise_time|filterDate}}</div>
                </div>
            </el-table-column>
            <el-table-column :render-header="filterHeader('需求|负责人')" min-width="40" inline-template>
                <div class="p-table-list-td-text" :title="row.leading">{{row.leading}}</div>
            </el-table-column>
            <el-table-column :render-header="filterHeader('需求计划|完成时间')" min-width="55" inline-template>
                <div class="p-table-list-td-text" :title="row.plan_complete_time|filterDate">{{row.plan_complete_time|filterDate}}</div>
            </el-table-column>
            <el-table-column :render-header="filterHeader('需求完成|百分比')" min-width="45" inline-template>
                <div>
                    <div class="p-table-list-td-text" :title="row.plan_percent|filterPercent">{{row.plan_percent|filterPercent}}</div>
                    <el-popover placement="left"
                                title="暂停原因："
                                width="200"
                                v-if="row.leading_status===0"
                                trigger="hover">
                        <div>{{row.leading_stop_remark}}</div>
                        <span slot="reference">
                                <el-button size="mini" type="warning">暂停</el-button>
                            </span>
                    </el-popover>
                </div>
            </el-table-column>
            <el-table-column :render-header="filterHeader('需求实际|完成时间')" min-width="55" inline-template>
                <div class="p-table-list-td-text" :title="row.real_complete_time|filterDate">{{row.real_complete_time|filterDate}}</div>
            </el-table-column>
            <el-table-column :render-header="filterHeader('开发|负责人')" min-width="40" inline-template>
                <div>
                    <div class="p-table-list-td-text" :title="row.developer">{{row.developer}}</div>
                    <div class="p-table-list-td-text" :title="row.fronter">{{row.fronter}}</div>
                </div>
            </el-table-column>
            <el-table-column :render-header="filterHeader('开发计划|完成时间')" min-width="55" inline-template>
                <div class="p-table-list-td-text" :title="row.plan_developer_time|filterDate">{{row.plan_developer_time|filterDate}}</div>
            </el-table-column>
            <el-table-column :render-header="filterHeader('开发完成|百分比')" min-width="45" inline-template>
                <div>
                    <div class="p-table-list-td-text" :title="row.developer_percent|filterPercent">{{row.developer_percent|filterPercent}}</div>
                    <el-popover placement="left"
                                title="暂停原因："
                                width="200"
                                v-if="row.developer_status===0"
                                trigger="hover">
                        <div>{{row.developer_stop_remark}}</div>
                        <span slot="reference">
                                <el-button size="mini" type="warning">暂停</el-button>
                            </span>
                    </el-popover>
                </div>
            </el-table-column>
            <el-table-column :render-header="filterHeader('开发实际|完成时间')" min-width="55" inline-template>
                <div class="p-table-list-td-text" :title="row.real_developer_time|filterDate">{{row.real_developer_time|filterDate}}</div>
            </el-table-column>
            <el-table-column :render-header="filterHeader('测试|负责人')" min-width="40" inline-template>
                <div class="p-table-list-td-text" :title="row.tester">{{row.tester}}</div>
            </el-table-column>
            <el-table-column :render-header="filterHeader('测试计划|完成时间')" min-width="55" inline-template>
                <div class="p-table-list-td-text" :title="row.plan_test_time|filterDate">{{row.plan_test_time|filterDate}}</div>
            </el-table-column>
            <el-table-column :render-header="filterHeader('测试完成|百分比')" min-width="45" inline-template>
                <div>
                    <div class="p-table-list-td-text" :title="row.test_percent|filterPercent">{{row.test_percent|filterPercent}}</div>
                    <el-popover placement="left"
                                title="暂停原因："
                                width="200"
                                v-if="row.test_status===0"
                                trigger="hover">
                        <div>{{row.test_stop_remark}}</div>
                        <span slot="reference">
                                <el-button size="mini" type="warning">暂停</el-button>
                            </span>
                    </el-popover>
                </div>
            </el-table-column>
            <el-table-column :render-header="filterHeader('测试实际|完成时间')" min-width="55" inline-template>
                <div class="p-table-list-td-text" :title="row.real_test_time|filterDate">{{row.real_test_time|filterDate}}</div>
            </el-table-column>
            <el-table-column label="上线时间" min-width="55" inline-template>
                <div class="p-table-list-td-text" :title="row.listing_time|filterDate">{{row.listing_time|filterDate}}</div>
            </el-table-column>
            <el-table-column label="操作" min-width="50">
                <template slot-scope="scope">
                    <div v-if="scope.row.can_delete===1">
                        <permission class="operate"
                                    tag="span"
                                    type="primary"
                                    size="mini"
                                    :route="apis.url_add_progress"
                                    @click="edit(scope.row)">编辑
                        </permission><span> | </span>
                        <permission class="operate"
                                    tag="span"
                                    type="primary"
                                    size="mini"
                                    :route="apis.url_add_progress"
                                    @click="del_row(scope.row)">删除
                        </permission>
                    </div>
                    <div v-else>
                        <span class="disabled">编辑</span> | <span class="disabled">删除</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<style lang="stylus">
    .c-demand-schedules-tableModule{
        th>div.cell{
            line-height 16px;
            padding:5px 0;
        }
        td>div.cell{
            line-height 16px;
            padding:5px 0;
            .el-button--mini {
                padding: 2px 8px;
                font-size: 12px;
                border-radius: 3px;
            }
        }
        .p-table-list-td-text{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
</style>
<script>
    import {
        url_add_progress
    } from '../../../api/demand-schedules'
    export default {
        data() {
            return {}
        },
        permission:{
            url_add_progress
        },
        methods:{
            selection_change(selects){
                this.$emit('selection-change',selects);
            },
            filterHeader(head){
                return (h)=>{
                    return h('div',[
                        h('div',head.split('|')[0]),
                        h('div',head.split('|')[1])
                    ])
                }
            },
            edit(row){
                this.$emit('edit',row);
            },
            del_row(row){
                this.$emit('del-row',row);
            }
        },
        filters:{
            filterDate(val){
                return val?datef('YYYY-MM-dd',val):'-- --';
            },
            filterPriority(val){
                switch (val){
                    case 0:
                        return '低';
                        break
                    case 1:
                        return '中';
                        break
                    case 2:
                        return '高';
                        break
                }
            },
            filterType(val){
                switch (val){
                    case 0:
                        return '新增功能';
                        break
                    case 1:
                        return '功能优化';
                        break
                    case 2:
                        return 'BUG处理';
                        break
                }
            },
            filterStatus(val){
                switch (val){
                    case 0:
                        return '未开始';
                        break
                    case 1:
                        return '已计划';
                        break
                    case 2:
                        return '需要设计';
                        break
                    case 3:
                        return '待研发';
                        break
                    case 4:
                        return '研发中';
                        break
                    case 5:
                        return '研发完毕';
                        break
                    case 6:
                        return '测试中';
                        break
                    case 7:
                        return '测试完毕';
                        break
                    case 8:
                        return '已发布';
                        break
                    case 9:
                        return '已作废';
                        break
                }
            },
            filterPercent(val){
                return val+'%';
            }
        },
        computed:{
            emptyText() {
                return this.firstLoading?'等待查询数据中...':'暂无数据'
            }
        },
        props:{
            tableData:{
                required:true,
                type: Array,
            },
            loading:{
                required:true,
                type: Boolean,
            },
            firstLoading:{
                required:true,
                type:Boolean
            }
        },
    }
</script>
