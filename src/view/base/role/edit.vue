<template>
    <el-row class="p-edit">
        <page-dialog :title="title" :size="editSize" v-model="editDialog" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="120px">
                <el-form-item label="角色名：" :rules="[{required:true,message:'角色名不能为空',trigger:'blur'}]" prop="name">
                    <el-row>
                        <el-col :span="12">
                            <el-input v-model="editForm.name" type="name"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="角色描述：">
                    <el-row>
                        <el-col :span="18">
                            <el-input v-model="editForm.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入描写内容"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="是否启用：">
                    <el-row>
                        <el-col :span="24">
                            <el-radio-group v-model="editForm.status">
                                <el-radio :label="1" size="small">启用</el-radio>
                                <el-radio :label="0" size="small">禁用</el-radio>
                            </el-radio-group>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <request-button req-key='editRole' @click="save(editForm.id)">保存</request-button>
                <el-button size="mini" @click.native="cancel">取消</el-button>
            </div>
        </page-dialog>
    </el-row>
</template>
<style>

</style>
<script>
    import pageDialog from '../../../components/page-dialog.vue';
    import {api_role_edit_update} from '../../../api/role';
    export default{
        data(){
            return{
                editDialog:false,
                editSize:"small"
            }
        },
        mounted(){
            this.editDialog = this.value;
        },
        watch:{
            editDialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.editDialog = val;
            }
        },
        methods:{
            save(id){
                if(!this.editForm.name) return this.$reqKey('editRole',false);
                let params = {
                    name:this.editForm.name,
                    remark:this.editForm.remark,
                    status:this.editForm.status,
                };
                this.$http(api_role_edit_update,id,params).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message||res,
                    });
                    this.$emit("save-edit",id,{id:id,name:this.editForm.name,remark:this.editForm.remark,status:this.editForm.status,});
                    this.editDialog = false;
                }).catch(code=>{
                    this.$message({
                        type:"error",
                        message:code.message||code,
                    })
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('editRole', false);
                    }, 300)
                });
            },
            cancel(){
                this.editDialog = false;
            }
        },
        props:{
            value:{},
            editForm:{
                required:true,
                type:Object
            },
            title:{
                required:true,
                type:String
            }
        },
        components:{
            pageDialog
        }
    }

</script>
