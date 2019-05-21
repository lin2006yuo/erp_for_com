<template>
    <page-dialog v-model="show"
                 size="large"
                 title="未安装队列列表">
        <el-table :data="uninstallQueue"
                  height="650"
                  empty-text="暂无未安装队列">
            <el-table-column label="key"
                             prop="queue_class">
            </el-table-column>
            <el-table-column label="队列名称"
                             prop="name">
            </el-table-column>
            <el-table-column label="队列描述"
                             prop="desc">
            </el-table-column>
            <el-table-column label="队列作者"
                             prop="author"
                             width="90">
            </el-table-column>
            <el-table-column label="操作"
                             width="100">
                <template slot-scope="scope">
                    <span class="operate" @click="install(scope.row)"> 安装</span>
                </template>
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
    import {api_install_task} from '@/api/queue';
    export default {
        name: "add-queue",
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
                this.$http(api_install_task,row.queue_class).then(res=>{
                    console.log(res,12213);
                    let index=this.uninstallQueue.findIndex(queue=>queue.queue_class===row.queue_class);
                    if(index!==-1){
                        this.uninstallQueue.splice(index,1)
                    }
                    this.$message({type:'success', message:res.message||res});
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            close(){
                this.show=false;
                this.$emit('fresh');
            }
        },
        props: {
            value:{},
            uninstallQueue:{
                type:Array,
                default(){
                    return [];
                }
            }
        },
    }
</script>

