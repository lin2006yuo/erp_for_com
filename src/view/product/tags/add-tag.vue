<template>
    <el-row class="p-add-tag">
        <el-button size="mini"  v-permission.add="'productTag'" @click.native="add_tag" type="primary">添加标签</el-button>
        <page-dialog title="添加标签" v-model="dialogVisible" :size="dialogSize" :close-on-click-modal="false">
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
                                    v-model="form.desc">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <request-button req-key="addTag" @click="confirm">确定</request-button>
                <el-button size="mini" @click.native="dialogVisible=false">取 消</el-button>
            </div>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus" scoped>

</style>
<script>
import {api_add} from '../../../api/tags';
import pageDialog from '../../../components/page-dialog.vue';
    export default{
        data(){
            return {
                dialogVisible:false,
                dialogSize:"small"
            }
        },
        methods:{
            add_tag(){

                this.$emit("add-tag");
            },
            confirm(){
                this.$refs.form.validate((valid)=>{
                    if(valid){
                        let params={
                            name:this.form.name,
                            desc:this.form.desc
                        };
                        this.$http(api_add,params).then(res=>{
                            this.$message({
                                type:"success",
                                message:`${res.message}`
                            });
                            this.$emit("confirm",res.id,params);
                            this.dialogVisible = false;
                        }).catch(code=>{
                            this.$message({
                                type:"error",
                                message:`${code.message}`
                            });
                            this.dialogVisible = true;
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('addTag', false);
                            }, 300)
                        })
                    }else{
                        this.$reqKey('addTag', false);
                    }
                })
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
            }
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
