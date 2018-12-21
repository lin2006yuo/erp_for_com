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
                <el-table-column label="平台账号" inline-template sortable>
                    <ui-tip :content="row.name" v-copy :width="98"></ui-tip>
                </el-table-column>
                <el-table-column label="账号简称" inline-template sortable>
                    <ui-tip :content="row.code" v-copy :width="98"></ui-tip>
                </el-table-column>
                <el-table-column label="公司名称" inline-template sortable>
                    <ui-tip :content="row.company" v-copy :width="98"></ui-tip>
                </el-table-column>
                <el-table-column label="店铺数量" inline-template>
                    <ui-tip :content="row.total" :width="98"></ui-tip>
                </el-table-column>
                <el-table-column label="Joom状态" align="center" inline-template>
                    <div :class="parseInt(row.platform_status)===0?'loseStatus':'sucStatus'">
                        {{row.platform_status|filterStatus}}
                    </div>
                </el-table-column>
                <el-table-column label="系统状态" inline-template>
                    <permission
                        tag="ElSwitch"
                        :route="apis.url_joom_list_status"
                        :key="`${row.id}a`"
                        v-model="row.status"
                        :on-text="status[0]"
                        :off-text="status[1]"
                        @change="chang_status(row)"></permission>
                </el-table-column>
                <el-table-column label="更新时间" inline-template>
                    <span>{{filterTime(row.update_time)}}</span>
                </el-table-column>
                <el-table-column label="创建时间" inline-template>
                    <span>{{filterTime(row.create_time)}}</span>
                </el-table-column>
                <el-table-column
                    inline-template
                    label="操作"
                    align="center" width="220">
                    <div>
                        <permission
                            tag="span"
                            :route="apis.url_joom_list_look"
                            class="operate"
                            @click="check(row)">查看</permission>
                        <permission
                            tag="span"
                            :route="apis.url_joom_list_look">|</permission>
                        <permission tag="span"
                                    :route="apis.url_joom_list_edit"
                                    class="operate"
                                    @click="edit(row)">编辑</permission>
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
	url_joom_list_look,
    url_joom_list_edit,
    url_joom_list_status,
    api_joom_list_status
} from "../../../../api/joom";
    export default{
        permission:{
            url_joom_list_look,
            url_joom_list_edit,
            url_joom_list_status
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
                this.$confirm('您将修改'+row.name+'的系统状态，确认此操作吗？', '提示', {
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
                this.$http(api_joom_list_status,data).then(res=>{
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
