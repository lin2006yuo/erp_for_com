<template>
    <div class="c-batch-remark">
        <page-dialog :title="title" v-model="dialog" @open="open" size="small" :close-on-click-modal="false">
            <el-form ref="form" :model="formData" label-width="150px" :rules="rules" class="mt-sm">
                <el-form-item label="名称：" prop="name" :required="true">
                    <el-input v-model="formData.name" class="s-width-large"></el-input>
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
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_publish_express_add_region_group,api_publish_express_edit_region_group} from '@/api/publish-smt';
    export default {
        data() {
            return {
                dialog:this.value,
                rules:{
                    name:[
                        {required:true,message:"模板分组名称 为必填项，请补充完整",trigger:"blur change"}
                    ]
                },
            }
        },
        methods:{
            open(){

            },
            submit(){
                this.$refs.form.validate((bool)=>{
                    if(bool){
                        let data = {
                            name:this.formData.name
                        };
                        let api;
                        if(!!this.formData.region_group_id){
                            api = api_publish_express_edit_region_group;
                            data.region_group_id = this.formData.region_group_id
                        }else{
                            api = api_publish_express_add_region_group;
                            data.parent_id = 0
                        }
                        this.$http(api,data).then(res=>{
                            this.$message({type:'success',message:res.message||res});
                            this.$emit('add-change',this.formData.name);
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
            title:{},
            formData:{}
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default
        }
    }
</script>
