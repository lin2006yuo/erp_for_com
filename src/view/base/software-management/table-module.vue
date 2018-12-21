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

            <el-table-column label="NO." inline-template>
                <div>
                    <ui-tip :content="row.id" :width="98"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="客户端版本" inline-template>
                <div>
                    <ui-tip :content="row.version" :width="98"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="软件类型" inline-template>
                <div>
                    <span>{{row.software_type | typeFilter}}</span>
                </div>
            </el-table-column>

            <el-table-column label="更新地址" inline-template>
                <div>
                    <ui-tip :content="row.upgrade_address" :width="98"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="备注" inline-template>
                <div>
                    <ui-tip :content="row.remark" :width="98"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="md5" inline-template>
                <div>
                    <ui-tip :content="row.md5" :width="98"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column inline-template label="状态" >
                <div>
                    <el-switch :key="row.id"
                               v-model="row.status"
                               on-text="启用"
                               on-color="#20a0ff"
                               off-text="停用"
                               off-color="#C0CCDA"
                               @change="changStatus(row)">
                    </el-switch>
                </div>
            </el-table-column>

            <el-table-column label="添加时间" width="150" inline-template >
                <div>
                    <times :time="row.create_time"></times>
                </div>
            </el-table-column>
            <el-table-column label="操作" inline-template>
                <div>
                    <el-button type="text" @click.native="delete_item(row)">删除</el-button>
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
            changStatus(row){//-----------------------修改启用或禁用事件
                let statusTitle = row.status ? '停用' : '启用';
                this.$confirm('您将'+statusTitle+'，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false,
                }).then(() => {
                    let status = row.status ? 0 : 1;
                    let params = {
                        status:status
                    };
                    this.$http(api_post_modify_status,row.id,params).then(res=>{
                        this.$message({
                            type: 'success',
                            message: res.message||res
                        });
                    }).catch(code=>{
                        this.$message({
                            type: 'error',
                            message: code.message||code,
                        });
                        row.status = !row.status
                    })
                }).catch((code) => {
                    this.$message({
                        type: 'info',
                        message: '已取消'+statusTitle
                    });
                    row.status = !row.status
                });
            },
            delete_item(row){
                this.$emit('delete-item',row)
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
        filters:{
            typeFilter(val){
                let ret = '';
                switch(Number(val)){
                    case 0:
                        ret = '账号app';
                        break;
                    case 1:
                        ret = '打印软件';
                        break;
                    case 2:
                        ret = '服务软件';
                        break;
                }
                return ret
            }
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