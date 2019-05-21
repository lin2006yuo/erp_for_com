<template>
    <div class="c-demand-schedules-tableModule">
        <el-table class="mb-sm scroll-bar"
                  border :data="tableData"
                  highlight-current-row
                  v-resize="{height:41}"
                  v-loading="loading"
                  element-loading-text="玩命加载中...">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column label="" width="40" inline-template>
                <div class="p-table-list-td-text" :title="row.id">{{row.id}}</div>
            </el-table-column>
            <el-table-column label="错误信息" min-width="120" inline-template>
                <div class="p-table-list-td-text" :title="row.providers_error_info">{{row.providers_error_info}}</div>
            </el-table-column>
            <el-table-column label="解决方案" min-width="200" inline-template>
                <div class="p-table-list-td-text" :title="row.providers_error_solution">{{row.providers_error_solution}}</div>
            </el-table-column>
            <el-table-column label="物流渠道" v-if="searchData.list_type===1" min-width="80" inline-template>
                <div class="p-table-list-td-text" :title="row.shipping_name">{{row.shipping_name}}</div>
            </el-table-column>
            <el-table-column label="负责人" min-width="50" inline-template>
                <div class="p-table-list-td-text" :title="row.respon_people">{{row.respon_people}}</div>
            </el-table-column>
            <el-table-column label="创建人/更新人" min-width="80" inline-template>
                <div>
                    <div class="p-table-list-td-text inline" :title="row.creator_name">{{row.creator_name?row.creator_name:'--'}}</div>
                    /<div class="p-table-list-td-text inline" :title="row.updator_name">{{row.updator_name?row.updator_name:'--'}}</div>
                </div>
            </el-table-column>
            <el-table-column label="创建时间/更新时间" min-width="150" inline-template>
                <div>
                    <div class="p-table-list-td-text inline" :title="row.create_time|filterDate">{{row.create_time|filterDate}}</div>
                    /<div class="p-table-list-td-text inline" :title="row.update_time|filterDate">{{row.update_time|filterDate}}</div>
                </div>
            </el-table-column>
            <el-table-column label="操作" min-width="50">
                <template slot-scope="scope">
                    <permission class="operate"
                                tag="span"
                                type="primary"
                                size="mini"
                                :route="apis.url_get_packages_error_edit"
                                @click="edit(scope.row)">编辑
                    </permission>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<style lang="stylus">
    .c-demand-schedules-tableModule{
        .p-table-list-td-text{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
</style>
<script>
    import {
        url_get_packages_error_edit
    } from '@/api/error-info-solution'
    export default {
        page:{
            devinfo:{
                frontEnd:'覃宏峰',
                backEnd:'蓝术术',
                createTime:'2018-10-18',
                updateTime:'2018-10-19'
            }
        },
        data() {
            return {}
        },
        permission:{
            url_get_packages_error_edit
        },
        methods:{
            edit(row){
                this.$emit('edit',row);
            }
        },
        filters:{
            filterDate(val){
                return val?datef('YYYY-MM-dd HH:mm:ss',val):'-- --';
            }
        },
        computed:{
            emptyText() {
                return this.firstLoading?'等待查询数据中...':'暂无数据'
            }
        },
        props:{
            searchData:{
                required:true,
                type:Object
            },
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
        components:{}
    }
</script>
