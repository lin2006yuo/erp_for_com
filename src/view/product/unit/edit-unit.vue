<template>
    <el-row class="p-edit-unit">
        <page-dialog :title="`修改单位：${this.form.name} 信息`"
                     v-model="dialogVisible" :size="dialogSize" :close-on-click-modal="false">
            <el-form label-width="80px" :model="form" ref="form">
                <el-row>
                    <el-col :span="12">
                        <el-form-item
                            label="单位名称："
                            prop="name"
                            :rules="[
                                {required:true,message:'用户名不能为空',trigger:'blur'}
                            ]"
                        >
                            <el-input type="name" v-model="form.name" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="单位描述：">
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 4, maxRows: 6}"
                                    placeholder="请输入描述内容"
                                    v-model="form.desc">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <request-button req-key="editUnit" @click="edit_confirm(form.id)">确定</request-button>
                <el-button size="mini" @click.native="dialogVisible=false">取 消</el-button>
            </div>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">
</style>
<script>
import pageDialog from '../../../components/page-dialog.vue';
import {api_update} from '../../../api/unit';
    export default{
        data(){
            return {
                dialogSize:"small",
                dialogVisible:false,
                isSave:true,
            }
        },
        mounted(){
            this.dialogVisible=this.value;
        },
        watch:{
            dialogVisible(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialogVisible=val;
            },
            isSave(val){
                if(this.form.name !==val.name||this.form.desc !==val.desc){
                    return false;
                }else{
                    return true;
                }
            }
        },
        methods:{
            edit_confirm(id){
                this.$refs.form.validate((valid)=>{
                    if(valid){
                        let editParams={
                            name:this.form.name,
                            desc:this.form.desc
                        }
                        this.$http(api_update,id,editParams).then(res=>{
                            this.$message({
                                type:"success",
                                message:res.message
                            });
                            this.$emit("edit-confirm",id,editParams);
                            this.dialogVisible = false;
                        }).catch(code=>{
                            this.$message({
                                type:"error",
                                message:code.message||code,
                            })
                            this.dialogVisible = true;
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('editUnit', false);
                            }, 300)
                        })
                    }else{
                        this.$reqKey('editUnit',false);
                        return;
                    }
                })
          },
        },
        computed:{

        },
        props:{
            form:{
                required:true,
                type:Object
            },
            value:{}
        },
        components: {
            pageDialog
        }
    }
</script>
