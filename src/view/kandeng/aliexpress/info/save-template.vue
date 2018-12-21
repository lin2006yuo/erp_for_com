<template>
    <page-dialog title="另存为区域模板" v-model="dialog" @open="open" size="small" :close-on-click-modal="false">
        <el-form label-width="150px" ref="form" :model="formData" :rules="rules">
                <el-form-item label="名称：" prop="template_name" :required="true">
                    <el-input v-model="formData.template_name" class="s-width-large"></el-input>
                </el-form-item>
                <el-form-item prop="region_group_id" label="分组：">
                    <el-select v-model="formData.region_group_id" filterable clearable class="inline s-width-large">
                        <el-option v-for="item in groups"
                                   :key="item.region_group_id"
                                   :label="item.name"
                                   :value="item.region_group_id"
                        ></el-option>
                    </el-select>
                    <span class="btn-img el-icon-plus" style="cursor: pointer;" @click="add_group"></span>
                    <span class="btn-img el-icon-edit ml-xs" style="cursor: pointer;" @click="edit_group"></span>
                    <span class="btn-img el-icon-close ml-xs" style="cursor: pointer;" @click="delete_group"></span>
                </el-form-item>
                <el-form-item label="类型：">
                    <el-select v-model="formData.type" class="inline s-width-large">
                        <el-option v-for="item in types"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button type="primary"
                       size="mini"
                       @click.native="submit"
                       class="inline">确定</el-button>
            <el-button size="mini"
                       @click.native="dialog = false"
                       class="inline">取消</el-button>
        </div>
        <add-edit-group v-model="addEditDialog" @add-change="add_change" :title="dialogTitle" :formData="groupForm"></add-edit-group>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {
        api_get_publish_express_region_group,
        api_publish_express_delete_region_group,
        api_publish_express_add_region_template
    } from '@/api/publish-smt'
    export default {
        data() {
            return {
                dialog:this.value,
                types:[
                    {
                        value: 'percentage',
                        label: '调价比例'
                    },
                    {
                        value: 'relative',
                        label: '调价金额'
                    },
                ],
                addEditDialog:false,
                rules:{
                    template_name:[
                        {required:true,message:"区域模板名称为必填项，请补充完整",trigger:"blur change"}
                    ],
                    region_group_id: [
                        {type:'number', required: true, message: '区域模板分组为必填项，请补充完整', trigger: 'change' }
                    ]
                },
                groupForm:{
                    name:'',
                    region_group_id:''
                },
                dialogTitle:''
            }
        },
        methods:{
            open(){

            },
            add_group(){
                this.dialogTitle = '添加模板分组';
                this.groupForm.name = '';
                this.groupForm.region_group_id = '';
                this.addEditDialog = true;
            },
            add_change(groups_name){
                this.$emit('update-groups',groups_name);
            },
            edit_group(){
                if(!this.formData.region_group_id){
                    this.$message({type:'warning',message:'请选择需要编辑的分组！'});
                    return
                }
                this.dialogTitle = '编辑模板分组';
                this.groupForm = this.groups.find(row=>row.region_group_id===this.formData.region_group_id);
                this.addEditDialog = true;
            },
            delete_group(){
                if(!this.formData.region_group_id){
                    this.$message({type:'warning',message:'请选择需要删除的分组！'});
                    return
                }
                this.$confirm(`将要删除所选分组以及该分组下的所有区域模板，确定进行此操作?`,'提示',{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:"warning"
                }).then(()=>{
                    this.$http(api_publish_express_delete_region_group,{region_group_id:this.formData.region_group_id}).then(res=>{
                        let index = this.groups.findIndex(row=>row.region_group_id===this.formData.region_group_id);
                        if(index>=0){
                            this.groups.splice(index,1);
                        }
                        this.formData.region_group_id = '';
                        this.$message({type:'success',message:res.message||res});
                    }).catch(code=>{
                        this.$message({type:'error',message:code.message||code});
                    })
                }).catch(()=>{
                    this.$message({
                        type:"info",
                        message:"已取消"
                    })
                });
            },
            submit(){
                this.$refs.form.validate((bool)=>{
                    if(bool){
                        let data = {
                            parent_id:this.formData.region_group_id,
                            name:this.formData.template_name,
                            type:this.formData.type,
                            aeopNationalQuoteConfiguration:this.aeopNationalQuoteConfiguration
                        };
                        this.$http(api_publish_express_add_region_template,data).then(res=>{
                            this.$message({type:'success',message:res.message||res});
                            this.$emit('save-change',data);
                            this.dialog = false;
                        }).catch(code=>{
                            this.$message({type:'error',message:code.message||code});
                        })
                    }
                })
            },
        },
        watch:{
            dialog(val){
                this.$reqKey('url_batch_remark',false);
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },
        },
        props:{
            value:{},
            aeopNationalQuoteConfiguration:{},
            formData:{},
            groups:{}
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            addEditGroup:require('./add-edit-group').default,
        }
    }
</script>
