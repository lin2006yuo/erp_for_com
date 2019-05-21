<template>
    <div class="p-paypal-table-module">
        <el-table
                class="mt-xs scroll-bar"
                v-resize="{height:41}"
                :data="tableData"
                border
                highlight-current-row
                v-loading="loading"
                element-loading-text="拼命加载中"
                @selection-change="handle_selection_change">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{ emptyText }}
            </div>
            <el-table-column
                    type="selection"
                    width="50">
            </el-table-column>

            <el-table-column label="code" inline-template>
                <div>
                    <ui-tip :content="row.code"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="软件名" inline-template>
                <div>
                    <ui-tip :content="row.software_name"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="客户端版本" inline-template>
                <div>
                    <ui-tip :content="row.version"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="运行环境" inline-template>
                <div>
                    <span>{{row.run_environment}}</span>
                </div>
            </el-table-column>

            <el-table-column label="更新地址" inline-template>
                <div>
                    <ui-tip :content="row.upgrade_address"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="备注" inline-template>
                <div>
                    <ui-tip :content="row.remark"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="md5" inline-template>
                <div>
                    <ui-tip :content="row.md5"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="状态" inline-template >
                <div>
                    <ui-tip :content="row.status"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="添加人">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>{{scope.row.department_name}}</p>
                        <div slot="reference">
                            <div>{{scope.row.creator_txt}}</div>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="添加时间" width="150" inline-template >
                <div>
                    <times :time="row.create_time"></times>
                </div>
            </el-table-column>
            <el-table-column width="170" label="操作" inline-template>
                <div>
                    <span class="operate" @click="$emit('edit-item',row)">编辑</span> |
                    <span class="operate" @click="release_version(row)">发布管理</span> |
                    <span class="operate" @click="historical_record(row)">历史记录</span>
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

<style lang="stylus" scoped>

</style>

<script>
    import {
        api_post_modify_status
    } from "@/api/software-management"
    export default {
        permission: {

        },
        data () {
            return {

            }
        },
        methods:{
            // 发布管理
            release_version(row){
                this.$emit('release-version',row);
            },
            //历史记录
            historical_record(row){
                this.$emit('historical-record',row);
            },
            handle_size_change(val){//----切换条数
                this.$emit('handle-size-change',val)
            },
            handle_current_change(val){//----切换页数
                this.$emit('handle-current-change',val)
            },
            handle_selection_change(val) {
                this.$emit('handle-selection-change',val)
            },
        },
        computed:{
            emptyText(){
                return this.firstLoading?'等待查询数据中...':'暂无数据'
            }
        },
        props: {
            tableData: {
                type: Array
            },
            loading: {
                required: true,
                type: Boolean
            },
            firstLoading: {
                required: true,
                type: Boolean
            },
            searchData: {
                type: Object
            },
            total: {
                type: Number
            },
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default
        }
    }
</script>