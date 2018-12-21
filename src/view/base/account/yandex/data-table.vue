<template>
    <div class="c-table-data">
        <el-table
                class="scroll-bar"
                :data="tableData.lists"
                v-loading="loading"
                element-loading-text="玩命加载中..."
                @selection-change="selectionChange"
                highlight-current-row
                sort-change="sort_change">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                    type="selection"
                    width="40">
            </el-table-column>
            <el-table-column label="简称" prop="code" sortable></el-table-column>
            <el-table-column label="账户名称" prop="account_name" sortable></el-table-column>
            <el-table-column label="账号ID" prop="shop_id"></el-table-column>
            <el-table-column label="数据同步" inline-template>
                <div v-if="row.status=='1'">
                        <span>
                            <span class="succeed"
                                  v-if="parseInt(row.download_order)>0"
                                  :title="`远程订单${row.download_order}分钟抓取一次`"></span>
                            <span v-else class="default" title="同步远程订单已关闭"></span>
                        </span>
                    <span>
                            <span class="succeed_sync"
                                  v-if="parseInt(row.sync_delivery)>0"
                                  :title="`发货状态${row.sync_delivery}分钟同步一次`"></span>
                            <span v-else class="default_sync" title="同步发货状态未开启"></span>
                        </span>
                    <span>
                            <span class="succeed-download-listing"
                                  v-if="parseInt(row.download_listing)>0"
                                  :title="`远程刊登数据${row.download_listing}分钟抓取一次`"></span>
                            <span class="default-download-listing" v-else title="同步远程刊登数未开启"></span>
                        </span>
                </div>
                <div v-else>
                    <span class="default" title="同步远程订单未开启"></span>
                    <span class="default_sync" title="同步发货状态未开启"></span>
                    <span class="default-download-listing" title="同步远程刊登数据未开启"></span>
                </div>
            </el-table-column>
            <el-table-column label="yandex状态" inline-template>
                <div :class="parseInt(row.is_authorization)===0?'loseStatus':'sucStatus'">{{row.is_authorization | filterEnabled}}</div>
            </el-table-column>
            <el-table-column label="系统状态" inline-template>
                <div>
                    <el-switch v-model="row.status"
                               on-text="启用"
                               off-text="停用"
                               @change="change_status(row)">
                    </el-switch>
                </div>
            </el-table-column>
            <el-table-column label="操作" inline-template>
                <div>
                    <span class="operate" @click="examine_look(row)" >查看</span>
                    &nbsp;|&nbsp;
                    <span class="operate" @click="edit_compile(row)">编辑</span>
                    &nbsp;|&nbsp;
                    <span class="operate" @click="edit_authorization(row)">{{row.is_authorization | filterAuthor}}</span>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="current_change"
                :current-page='tableData.page'
                :page-sizes="[20,50,100,200,500]"
                :page-size='tableData.pageSize'
                layout="total, sizes, prev, pager, next, jumper"
                :total='tableData.total'>
        </el-pagination>
    </div>
</template>
<style lang="stylus">
    .sucStatus {
        color: #339907
    }

    .loseStatus {
        color: #ff0000;
    }

    .succeed {
        padding: 4px 12px;
        background: url('../../../../assets/icon_all.png') no-repeat 0 -3468px;
    }

    .default {
        padding: 4px 12px;
        background: url('../../../../assets/icon_all.png') no-repeat 0 -3490px;
    }

    .succeed_sync {
        padding: 4px 12px;
        background: url('../../../../assets/icon_all.png') no-repeat 0 -1325px;
    }

    .default_sync {
        padding: 4px 12px;
        background: url('../../../../assets/icon_all.png') no-repeat 0 -1351px;
    }
</style>
<script>
    import {api_system_states} from '@/api/yandex';
    export default {
        // permission:{
        //     url_refresh_token
        // },
        data() {
            return {
                aditHandel:this.handel,
            }
        },
        filters:{
            filterEnabled(val){
                switch(val){
                    case 0:
                        return '失效';
                    case 1:
                        return '有效';
                }
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
        methods:{
            selectionChange(select){
                this.$emit('selection-change',select)
            },
            sort_change(val) {//-----------------------表格排序
                this.$emit("sort-change", val);
            },
            change_status(row){
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
                    this.$http(api_system_states, params).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                        console.log(row.status,'success')
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code,
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消' + statusTitle
                    });
                    row.status = !row.status
                });
                console.log(row.status,'wonitatata')
            },
            update_token(row){
                this.$http(api_refresh_token,row.id).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                })
            },
            size_change(pageSize){
                this.$emit('size-change',pageSize);
            },
            current_change(page){
                this.$emit('current-change',page);
            },
            examine_look(row){
                this.$emit('examine-look',row);
            },
            edit_compile(row){
                this.aditHandel='adit'
                this.$emit('edit-compile',row.shop_id,row);
                this.$emit('input',this.aditHandel)
            },
            edit_authorization(row){
                this.$emit('edit-authorization',row);
            },
        },
        computed: {
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            },
        },
        watch:{
            value(val){
                this.aditHandel=val
            }
        },
        props:{
            value:{},
            tableData:{
                type:Object,
                required:true,
            },
            loading:{
                type:Boolean,
                required:true,
            },
            firstLoading: {
                type: Boolean,
                required: true
            },
            handel:{
                type:String
            },
        },
        components: {}
    }
</script>