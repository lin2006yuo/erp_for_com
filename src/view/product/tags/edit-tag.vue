<template>
    <el-row class="p-edit-unit">
        <page-dialog :title="`修改标签：${this.form.name} 信息`"
                     v-model="dialogVisible" :size="dialogSize" :close-on-click-modal="false">
            <el-form label-width="120px" :model="form" ref="form">
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="标签名称："
                            prop="name"
                            :rules="[{required:true,message:'标签名称不能为空'}]"
                        >
                            <el-input v-model="form.name" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="标签描述：">
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 4, maxRows: 6}"
                                    placeholder="请输入描述内容"
                                    v-model="form.description">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <request-button req-key="updateTag" @click="edit_confirm(form.id)">确定</request-button>
                <el-button size="mini" @click.native="dialogVisible=false">取 消</el-button>
            </div>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus" scoped>
</style>
<script>
import pageDialog from '../../../components/page-dialog.vue';
import {api_update} from '../../../api/tags'
    export default{
        data(){
            return {
                dialogSize:"small",
                dialogVisible:false,
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
        },
        methods:{
            edit_confirm(id){
                this.$refs.form.validate((valid)=>{
                    if(valid){
                        let editParams={
                            name:this.form.name,
                            desc:this.form.description
                        };
                        this.$http(api_update,id,editParams).then(res=>{
                            this.$message({
                                type:"success",
                                message:res.message
                            });
                            this.$emit("edit-confirm",id,editParams);
                            this.dialogVisible=false;
                        }).catch(code=>{
                            this.$message({
                                type:"error",
                                message:code.message,
                            })
                            this.dialogVisible=true;
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('updateTag', false);
                            }, 300)
                        })
                    }else{
                        this.$reqKey('updateTag', false);
                    }
                })
            }
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
