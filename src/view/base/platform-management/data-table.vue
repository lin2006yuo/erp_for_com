<template>
    <div class="c-data-table">
        <el-table
                class="scroll-bar"
                :data="tableData.list"
                v-loading="loading"
                v-resize="{height:41}"
                element-loading-text="玩命加载中..."
                highlight-current-row
        >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column label="平台ID" prop="id"></el-table-column>
            <el-table-column label="平台英文名" prop="name"></el-table-column>
            <el-table-column label="平台名称" prop="title"></el-table-column>
            <el-table-column label="系统状态" inline-template>
                <div>
                    <permission tag="ElSwitch"
                                v-model="row.status"
                                :route="apis.url_channel_states"
                                onText="启用"
                                offText="停用"
                                @change="change_status(row)"></permission>
                </div>
            </el-table-column>
            <el-table-column inline-template label="是否有站点">
                <div>
                    <ui-tip :content="row.is_site | filterSite" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column inline-template label="平台订单过期时间" prop="delivery_deadline">
                <div>
                    <ui-tip :content="row.delivery_deadline" :width="98"></ui-tip>
                    <span class="inline">天</span>
                </div>
            </el-table-column>
            <el-table-column label="添加时间" prop="create_time"></el-table-column>
            <el-table-column label="更新时间" prop="update_time"></el-table-column>
            <el-table-column label="操作" inline-template>
                <div>
                    <permission class="operate" :route='apis.url_get_channel'
                                tag="span" @click="look_over(row)">查看</permission>
                    <permission tag="span" :route='apis.url_get_channel'>|</permission>
                    <permission class="operate" :route="apis.url_put_channel"
                                tag='span' @click="edit(row)">平台信息</permission>
                    <span>|</span>
                    <span  class="operate" @click="info(row)">平台参数</span>
                </div>
            </el-table-column>
        </el-table>
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
</template>
<style lang="stylus">
</style>
<script>
    import {
        api_channel_states,
        url_channel_states,
        url_get_channel,
        url_put_channel} from '@/api/platform-management';
    export default {
        permission:{
            url_channel_states,
            url_get_channel,
            url_put_channel,
        },
        data() {
            return {}
        },
        methods:{
            change_status(row){
                this.$confirm(`您将更改 ${row.title} 账户状态，确认此操作吗？`,"提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false,
                }).then(()=>{
                    let params = {
                        id:row.id,
                        status:row.status?0:1
                    }
                    this.$http(api_channel_states,params).then(data=>{
                        this.$message({
                            type:"success",
                            message:data.message||data,
                        });
                    }).catch(code=>{
                        this.$message({
                            type:"error",
                            message:code.message||code
                        })
                    })
                }).catch(code=>{
                    this.$message({
                        type:"info",
                        message:"已取消操作"
                    });
                    row.status = !row.status;
                })
            },
            look_over(row){//---查看
                this.$emit('look-over',row);
            },
            edit(row){//---编辑
                this.$emit('edit',row);
            },
            info(row){
                this.$emit('info',row)
            },
            handleCurrentChange(val){
                this.$emit('current-change',val);
            },
            handleSizeChange(val){
                this.$emit('size-change',val);
            },
        },
        filters: {
            filterSite(value){
                return parseInt(value) ? '有' : '无';
            }
        },
        computed: {
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            },
        },
        props:{
            tableData:{
                type: Object,
                required: true
            },
            loading:{
                type: Boolean,
                required: true
            },
            firstLoading: {
                type: Boolean,
                required: true
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
