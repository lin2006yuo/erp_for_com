<template>
    <el-row class="p-joom-table">
        <div>
            <el-table
                v-resize="{height:41}"
                class="scroll-bar"
                :data="tableData" @sort-change="sort_change"
                highlight-current-row
                border v-loading="loading"
                element-loading-text="玩命加载中..."
                @selection-change="selectionChange">
                <div slot="empty" class="no-data-reminder">
                    <i></i>
                    {{emptyText}}
                </div>
                <el-table-column
                        type="selection"
                        width="40">
                </el-table-column>
                <el-table-column label="简称" inline-template>
                    <ui-tip :content="row.code" v-copy :width="98"></ui-tip>
                </el-table-column>
                <el-table-column label="账号名称" inline-template>
                    <ui-tip :content="row.account_name" v-copy :width="98"></ui-tip>
                </el-table-column>
                <el-table-column label="数据同步" width="150"
                                 align="center"
                                 inline-template show-overflow-tooltip>
                    <div v-if="row.status">
                        <span class="succeed-download-order"
                              v-if="row.download_order>0"
                              :title="row.download_order"></span>
                        <span class="default-download-order"
                              v-if="row.download_order===0"
                              :title="row.download_order"></span>

                        <span class="succeed-download-listing"
                              v-if="row.download_listing>0"
                              :title="row.download_listing"></span>
                        <span class="default-download-listing"
                              v-if="row.download_listing===0"
                              :title="row.download_listing"></span>

                        <span class="succeed-sync-delivery"
                              v-if="row.sync_delivery>0"
                              :title="row.sync_delivery"></span>
                        <span class="default-sync-delivery"
                              v-if="row.sync_delivery===0"
                              :title="row.download_listing"></span>

                    </div>
                    <div v-else>
                        <span class="default-download-order"></span>
                        <span class="default-download-listing"></span>
                        <span class="default-sync-delivery"></span>
                    </div>
                </el-table-column>
                <el-table-column label="Jumia状态" align="center" inline-template>
                    <div :class="parseInt(row.jumia_enabled)===0?'loseStatus':'sucStatus'">
                        {{row.jumia_enabled|filterStatus}}
                    </div>
                </el-table-column>
                <el-table-column label="系统状态" inline-template>
                    <permission
                        tag="ElSwitch"
                        :route="apis.url_jumia_account_states"
                        :key="`${row.id}a`"
                        v-model="row.status"
                        :on-text="status[0]"
                        :off-text="status[1]"
                        @change="chang_status(row)"></permission>
                </el-table-column>
                <el-table-column
                    inline-template
                    label="操作"
                    align="center" width="220">
                    <div>
                        <span class="operate" @click="check(row)">查看</span>
                        <span>|</span>
                        <span class="operate" @click="edit(row)">编辑</span>
                    </div>
                </el-table-column>
            </el-table>
        </div>
    </el-row>
</template>
<style lang="stylus">
    .sucStatus {
        color: #339907
    }

    .loseStatus {
        color: #ff0000;
    }
</style>
<script>
import {
    url_jumia_account_look,
    url_jumia_account_edit,
    url_jumia_account_states,
    api_jumia_account_states
} from "../../../../api/jumia-account";
    export default{
        permission:{
            url_jumia_account_look,
            url_jumia_account_edit,
            url_jumia_account_states,
        },
        data(){
            return {
                status:["启用","停用"]
            }
        },
        created(){

        },
        methods:{
            selectionChange(select){
                this.$emit('selection-change',select)
            },
            sort_change(val){
                this.$emit('sort-change',val);
            },
            //查看
            check(row){
                this.$emit('look-form',row);
            },
            //编辑
            edit(row){
                this.$emit('edit-form',row);
            },
            //修改系统状态
            chang_status(row){
                console.log(row);
                this.$confirm('您将修改'+row.account_name
                    +'的系统状态，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false,
                }).then(() => {
                    let data = {
                        id:row.id,
                        status:row.status ? 1 :0,
                    }
                    this.operate_status(data);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                    row.status = !row.status;
                });
            },
            filterTime(val){
                return datef('YYYY-MM-dd HH:mm:ss',val);
            },
            operate_status(data){
                this.$http(api_jumia_account_states,data).then(res=>{
                    this.$message({type:"success",message: res.message || res});
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                })
            }
        },
        computed:{
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            },
        },
        filters:{
            filterStatus(value) {
                return parseInt(value) ? '有效' : '失效';
            },
        },
        props:{
            tableData:{
                required:true,
                type:Array,
            },
            loading:{
            },
            firstLoading: {
                type: Boolean,
                required: true
            }
        },
        components: {
            uiTip:require('../../../../components/ui-tip.vue').default
        }
    }
</script>
