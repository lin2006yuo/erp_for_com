<template>
    <div class="c-data-table">
        <el-table
                :data="tableData.list"
                v-resize="{height:41}"
                v-loading="loading"
                element-loading-text="玩命加载中..."
                class="scroll-bar"
                highlightCurrentRow>
            <el-table-column
                    label="账号用户名"
                    inline-template>
                <ui-tip :content="row.username" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column
                    label="联系邮箱"
                    inline-template>
                <ui-tip :content="row.email" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column
                    label="国家"
                    inline-template>
                <ui-tip :content="row.country" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column
                    label="城市"
                    inline-template>
                <ui-tip :content="row.city" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column
                    label="平台"
                    inline-template>
                <ui-tip :content="row.platform" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="状态" inline-template>
                <div>
                    <el-switch v-model="row.status"
                               :on-text="status[0]"
                               on-color="#20a0ff"
                               :off-text="status[1]"
                               off-color="#C0CCDA"
                               @change="changStatus(row)">
                    </el-switch>
                </div>
            </el-table-column>
            <el-table-column
                    label="申请时间"
                    inline-template>
                <ui-tip :content="row.create_time | timeFilter" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column
                    label="操作"
                    inline-template>
                <div>
                    <permission
                            tag="span"
                            :route="apis.url_user_info"
                            class="operate"
                            @click="edit(row)"
                            size="mini">编辑
                    </permission>
                    |
                    <permission
                            tag="span"
                            :route="apis.url_user_save"
                            class="operate"
                            @click="changePwd(row.id)">重置密码
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
                    :total=total>
            </el-pagination>
        </div>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {url_user_info,url_user_save,api_user_statu} from '@/api/api-user-management';
    export default {
        permission: {
            url_user_info,
            url_user_save
        },
        data() {
            return {
                status: ["启用", "停用"],
            }
        },
        methods:{
            edit(row){
                this.$emit('add-edit',row);
            },
            changePwd(row){
                this.$emit('change-pwd',row);
            },
            handleCurrentChange(val){
                this.$emit('current-change',val);
            },
            handleSizeChange(val){
                this.$emit('size-change',val);
            },
            changStatus(row) {//-----------------------修改启用或禁用事件
                let statusTitle = row.status ? '停用' : '启用';
                this.$confirm('您将' + statusTitle + '，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false,
                }).then(() => {
                    let status = row.status ? 1 : 0;
                    let params = {
                        id: row.id,
                        status: status
                    };
                    this.$http(api_user_statu, params).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code,
                        });
                    })
                }).catch((code) => {
                    this.$message({
                        type: 'info',
                        message: '已取消' + statusTitle
                    });
                    row.status = !row.status
                });
            },
        },
        filters:{
            timeFilter(val){
                if(val){
                    return datef('YYYY-MM-dd', val);
                }else{
                    return "--"
                }
            },
        },
        props:{
            tableData:{
                required:true,
                type:Object,
            },
            loading:{
                required:true,
                type:Boolean
            },
            total:{
                required: true,
                type: Number,
                default(){
                    return 0
                }
            }
        },
        components: {
            uiTip:require('@/components/ui-tip.vue').default,
        }
    }
</script>