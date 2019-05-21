<template>
    <page-dialog :title="title" v-model="show" size="small">
        <el-form :model="editData"
                 label-width="140px"
                 ref="editData"
                 class="local-order-search">
            <el-form-item label="消费者：">
                <el-col :span="22">
                    <natural-number-input v-model.number="editData.consumer"
                                          :min="1"
                                          :max="100"
                                          :is-appear="false"
                                          style="width: 125px"
                                          class="inline">
                    </natural-number-input>
                    <span class="red">(注意：请输入数字范围为 <= 100)</span>
                </el-col>
            </el-form-item>
            <el-form-item label="优先级：">
                <el-col :span="22">
                    <natural-number-input v-model.number="editData.priority"
                                          :min="1"
                                          :max="10"
                                          :is-appear="false"
                                          style="width: 125px"
                                          class="inline">
                    </natural-number-input>
                    <span class="red">(注意：请输入数字范围为1~10)</span>
                </el-col>
            </el-form-item>
            <el-form-item label="执行次数：">
                <el-col :span="22">
                    <natural-number-input v-model.number="editData.run_times"
                                          :min="1"
                                          :max="100000"
                                          :is-appear="false"
                                          style="width: 125px"
                                          class="inline">
                    </natural-number-input>
                    <span class="red">(注意：请输入数字范围为<=100000)</span>
                </el-col>
            </el-form-item>
            <el-form-item label="失败尝试次数：">
                <el-col :span="22">
                    <natural-number-input v-model.number="editData.fail_times"
                                          :min="1"
                                          :max="10"
                                          :is-appear="false"
                                          style="width: 125px"
                                          class="inline">
                    </natural-number-input>
                    <span class="red">(注意：请输入数字范围为<=10)</span>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="keep" type="primary">确 定</el-button>
            <el-button size="mini" @click.native="show=false">取 消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .red{
        colr: red
    }
</style>
<script>
    import {api_queue_edit} from '@/api/queue';
    import naturalNumberInput from '@/view/base/server-management/natural-number-input'
    export default{
        data(){
            return{
                show:this.value,
            }
        },
        methods:{
            keep(){
                if(Number(this.editData.consumer)>100){
                    return this.$message({type:'warning',message: "消费者请输入数字范围为 <= 100"});
                }else if(Number(this.editData.priority)>10){
                    return this.$message({type:'warning',message: "优先级请输入数字范围为 1~10"});
                }else if(Number(this.editData.run_times)>100000){
                    return this.$message({type:'warning',message: "执行次数请输入数字范围为 <= 100000"});
                }else if(Number(this.editData.fail_times)>10){
                    return this.$message({type:'warning',message: "失败尝试次数请输入数字范围为 <= 10"});
                };
                this.$http(api_queue_edit,this.editData).then(res=>{
                    this.$emit('queue_edit',this.editData);
                    this.$message({type:"success", message:res.message || res});
                    this.show = false;
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },
        props:{
            value:Boolean,
            title:{},
            editData:{}
        },
        components: {naturalNumberInput}

    }
</script>