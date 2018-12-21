<template>
    <el-row class="p-add-unit">
        <el-button size="mini" @click.native="add_unit" type="primary">添加单位</el-button>
        <page-dialog title="添加单位" v-model="dialogVisible" :size="dialogSize" :close-on-click-modal="false" >
            <el-form label-width="120px" :model="form" ref="form">
                <el-row>
                    <el-col :span="12">
                        <el-form-item
                            label="单位名称："
                            prop="name"
                            :rules="[
                                {required:true,message:'单位名不能为空'}
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
                <request-button req-key="test" @click="confirm">确定</request-button>
                <el-button size="mini" @click.native="dialogVisible=false">取 消</el-button>
            </div>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">

</style>
<script>
import {api_add} from '../../../api/unit';
import pageDialog from '../../../components/page-dialog.vue';
    export default{
        data(){
            return {
                dialogVisible:false,
                dialogSize:"small"
            }
        },
        methods:{
            add_unit(){
                this.$emit("add-unit");
            },
            confirm(){
                this.$refs.form.validate((valid)=>{
                    if(valid){
                        this.params={
                            name:this.form.name,
                            desc:this.form.desc
                        };
                        this.$http(api_add,this.params).then(res=>{
                            this.$message({
                                type:"success",
                                message:`${res.message}`
                            });
                            this.$emit("confirm",res.id,this.params);
                            this.dialogVisible = false;
                        }).catch(code=>{
                            this.$message({
                                type:"error",
                                message:`${code.message}`
                            });
                            this.dialogVisible = true;
                        }).finally(()=>{
                            setTimeout(()=>{
                                this.$reqKey(`test`, false);
                            },300);
                        });
                    }else{
                        this.$reqKey(`test`, false);
                    }
                })
            },
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
            value:{},
        },
        components: {
            pageDialog,
        }
    }
</script>
