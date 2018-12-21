<template>
    <el-row class="p-task-table">
        <el-table  height="690" :data="dataList" border highlight-current-row v-loading="loading" element-loading-text="玩命加载中...">
        <el-table-column property="name" label="任务名称" align="center"  show-overflow-tooltip></el-table-column>
        <el-table-column property="controller" label="执行控制器" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column inline-template label="执行时间" align="center" show-overflow-tooltip>
            <div>{{row.exec_time|timeFilter}}</div>
        </el-table-column>
        <el-table-column  label="执行周期" align="center"  inline-template>
            <div>{{row.cron_time}}</div>
        </el-table-column>
        <el-table-column  property="max_exec_num" label="最大执行次数" align="center"></el-table-column>
        <!--<el-table-column label="参数" align="center" width="250" inline-template>
            <div>
                <el-tooltip placement="top">
                    <div slot="content" style="width:800px;word-wrap:break-word;word-break:break-all;">{{row.args}}</div>
                    <div class="cell_hide">{{row.args}}</div>
                </el-tooltip>
            </div>
        </el-table-column>-->
        <el-table-column label="参数" align="center" width="250" inline-template show-overflow-tooltip>
            <div>{{row.args}}</div>
        </el-table-column>
        <el-table-column  property="create_name" label="创建人" align="center"></el-table-column>
        <el-table-column  inline-template label="创建时间" align="center" show-overflow-tooltip>
            <div>{{row.create_time|timeFilter}}</div>
        </el-table-column>
        <el-table-column  property="update_name" label="修改人" align="center"></el-table-column>
        <el-table-column  inline-template label="修改时间" align="center" show-overflow-tooltip>
            <div>{{row.update_time|timeFilter}}</div>
        </el-table-column>
        <el-table-column  inline-template label="状态" align="center">
            <div>{{row.status|statusFilter}}</div>
        </el-table-column>

        <el-table-column inline-template label="操作" inline-template align="center">
            <div v-if="row.status!=1">
                <span class="operate" @click="edit_task(row)">编辑</span>
                |
                <span class="operate" v-if="row.status==3" @click="recover(row)">恢复</span>
                <span class="operate" v-else @click="del(row)">删除</span>
            </div>
        </el-table-column>
    </el-table>
    </el-row>
</template>
<style lang="stylus">
    .p-task-table{
        .el-table__body-wrapper{
            overflow-x: hidden;
        }
        .cell_hide{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            width: 250px;
        }
    }
</style>
<script>
    import {task_del,task_recover} from '../../../api/taskManage'

    export default{
        data(){
            return {}
        },
        methods:{
            edit_task(row){
                this.$emit('edit_task',row)
            },
            del(row){
                this.$confirm('您将删除'+row.name+'，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(task_del, row.id).then(res=> {
                        this.$message({type: "success", message: res.message || res})
                        this.$emit('del')
                    }).catch(code=> {
                        this.$message({message:code.message||code,type:'error'});
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消操作'
                    });
                });
            },
            recover(row){
                this.$confirm('您将恢复'+row.name+'，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let recoverData={
                        id:row.id
                    };
                    this.$http(task_recover, recoverData).then(res=> {
                        this.$message({type: "success", message: res.message || res})
                        this.$emit('del')
                    }).catch(code=> {
                        this.$message({message:code.message||code,type:'error'});
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消操作'
                    });
                });
            }
        },
        filters:{
            timeFilter(val){
                return datef('YYYY-MM-dd HH:mm:ss', val);
            },
            statusFilter(val){
               switch (val){
                   case 0:
                       return '未执行';
                   break;
                   case 1:
                       return '正在执行';
                   break;
                   case 2:
                       return '执行失败';
                   break;
                   case 3:
                       return '已删除';
                   break;

               }
            }
        },
        props:{
            dataList:{
                required:true,
                type:Array
            },
            loading:{
                required:true,
                type:Boolean
            }
        },
        components: {}
    }
</script>