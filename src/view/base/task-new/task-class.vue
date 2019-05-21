<template>
    <page-dialog v-model="show"
                 size="large"
                 title="任务工作器类名">
        <el-table :data="tasks"
                  v-loading="loading"
                  element-loading-text="玩命加载中..."
                  empty-text="暂无任务工作器类名记录">
            <el-table-column label="任务工作器类名"
                             prop="task_class"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="任务名称"
                             prop="name">
            </el-table-column>
            <el-table-column label="任务描述"
                             prop="desc">
            </el-table-column>
            <el-table-column label="任务作者"
                             prop="creator"
                             width="100">
            </el-table-column>
            <el-table-column label="操作"
                             inline-template
                             width="100">
                <div >
                    <span class="operate" @click="install(row)">安装</span>
                </div>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini"
                       @click.native="close">关 闭
            </el-button>
        </div>
    </page-dialog>
</template>

<style lang="stylus" scoped>

</style>

<script>
    import {api_install_task_class} from '@/api/task';
    export default {
        name: "task-class",
        data() {
            return {
                show:this.value,
            }
        },
        watch: {
            show(val){
                this.$emit('input',val);
            },
            value(val){
                this.show=val;
            },
        },
        methods: {
            install(row){
                this.$http(api_install_task_class,row.task_class).then(res=>{
                    let index = this.tasks.findIndex(find=>find.task_class===row.task_class);
                    this.tasks.splice(index,1);
                    this.$message({type:'success', message:res.message||res});
                }).catch( error =>{
                   error&&this.$message({type:'error', message:error.message||error});
                });
            },
            close(){
                this.show=false;
                this.$emit('refresh');
            }
        },
        props: {
            value:{},
            loading:{
                type:Boolean,
            },
            tasks:{
                type:Array,
                default(){
                    return [];
                }
            }
        },
    }
</script>

