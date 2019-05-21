<template>
    <page-dialog title="添加角色" :size="addSize" v-model="addDialog" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="120px">
            <el-form-item label="角色名：" :rules="[{required:true,message:'角色名不能为空',trigger:'blur'}]" prop="name">
                <el-row>
                    <el-col :span="12">
                        <el-input v-model="addForm.name" type="name"></el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="角色描述：">
                <el-row>
                    <el-col :span="18">
                        <el-input v-model="addForm.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入描写内容"></el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="是否启用：">
                <el-row>
                    <el-col :span="24">
                        <el-radio-group v-model="addForm.status">
                            <el-radio :label="1" size="small">启用</el-radio>
                            <el-radio :label="0" size="small">禁用</el-radio>
                        </el-radio-group>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <request-button req-key="addRole" @click="save">保存</request-button>
            <el-button  size="mini" @click.native="cancel">取消</el-button>
        </div>
    </page-dialog>
</template>
<style>

</style>
<script>
    import pageDialog from '../../../components/page-dialog.vue';
    import {api_role_add} from '../../../api/role';
    export default{
        data(){
            return{
                addSize:"small",
                addDialog:false,

            }
        },
        mounted(){
            this.addDialog = this.value;
        },
        watch:{
            addDialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.addDialog = val;
            },

        },
        methods:{
            save(){
                let params = {
                    name:this.addForm.name,
                    status:this.addForm.status,
                };
                this.addForm.remark &&(params.remark = this.addForm.remark);
                this.$http(api_role_add,params).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message||res
                    });
                    this.addDialog = false;
                    this.$emit("add-save",params);
                }).catch(code=>{
                    this.$message({
                        type:"error",
                        message:code.message||code
                    })
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('addRole', false);
                    }, 300)
                })
            },
            cancel(){
                this.addDialog = false;
            }
        },
        props:{
            value:{},
            addForm:{
                required:true,
                type:Object
            }
        },
        components:{
            pageDialog,
            requestButton:require('../../../global-components/request-button').default
        }
    }

</script>
