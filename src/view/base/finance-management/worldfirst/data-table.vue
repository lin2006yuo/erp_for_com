<template>
    <div class="c-data-table">
        <el-table v-resize="{height:41}"
                  :data="tableData.data"
                  border
                  highlight-current-row
                  v-loading="loading"
                  element-loading-text="玩命加载中..."
                  class="mt-xs">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                    width="50"
                    prop="id"
                    label="NO.">
            </el-table-column>
            <el-table-column
                    inline-template
                    label="服务器名">
                <div>
                    <ui-tip :content="row.ip_name" :width="98" v-copy></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="服务器地址">
                <div>
                    <ui-tip :content="row.ip_address" :width="98" v-copy></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    prop="belong"
                    label="账号持有人">
            </el-table-column>
            <el-table-column
                    inline-template
                    label="登陆邮箱">
                <div>
                    <ui-tip :content="row.wf_account" :width="98" v-copy></ui-tip>
                </div>
            </el-table-column>
            <el-table-column inline-template
                             label="登录密码">
                <div>******</div>
            </el-table-column>
            <el-table-column inline-template
                             label="密保答案">
                <div>******</div>
            </el-table-column>
            <el-table-column inline-template label="系统状态" align="center" width="130">
                <div>
                    <el-switch :key="row.code"
                               v-model="row.status"
                               :on-text="status[0]"
                               on-color="#20a0ff"
                               :off-text="status[1]"
                               off-color="#C0CCDA"
                               @change="changStatus(row)">
                    </el-switch>
                </div>
            </el-table-column>
            <el-table-column
                    prop="operator"
                    label="操作人">
            </el-table-column>
            <el-table-column label="操作" inline-template align="center" width="150">
                <div>
                    <permission
                            tag="span"
                            :route="apis.url_get_worldfirst_edit"
                            class="operate"
                            @click="$emit('look-edit',row,'查看')">查看
                    </permission>
                    <span>&nbsp;|&nbsp;</span>
                    <permission
                            tag="span"
                            :route="apis.url_worldfirst_save"
                            class="operate"
                            @click="$emit('look-edit',row,'编辑')">编辑
                    </permission>
                </div>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                    class="page-fixed"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page=tableData.page
                    :page-sizes="[20,50,100,200,500]"
                    :page-size=tableData.pageSize
                    layout="total, sizes, prev, pager, next, jumper"
                    :total=tableData.count>
            </el-pagination>
        </div>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {url_get_worldfirst_edit,url_worldfirst_save,api_worldfirst_status} from '@/api/worldfirst';
    export default {
        permission: {
            url_get_worldfirst_edit,
            url_worldfirst_save,
        },
        data() {
            return {
                status: ["启用", "停用"],
            }
        },
        methods:{
            changStatus(row) {//-----------------------修改启用或禁用事件
                let statusTitle = row.status ? '停用' : '启用';
                this.$confirm('您将' + statusTitle + '，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false,
                }).then(() => {
                    let status = row.status ? 1 : 0;
                    this.$http(api_worldfirst_status,row.id,status).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        this.$emit('search');
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code,});
                    })
                }).catch((code) => {
                    this.$message({type: 'info', message: '已取消' + statusTitle});
                    row.status = !row.status
                });
            },
            handleCurrentChange(val){
                this.$emit('current-change',val);
            },
            handleSizeChange(val){
                this.$emit('size-change',val);
            },
        },
        filters: {
            filterStatus(value) {
                return parseInt(value) ? '有效' : '失效';
            },
            filterAuthor(val) {
                switch (val) {
                    case 0:
                        return '未授权';
                    case 1:
                        return '已授权';
                }
            }
        },
        computed: {
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            },
        },
        props:{
            tableData:{
                require:true,
                type:Object
            },
            loading:{},
        },
        components: {}
    }
</script>