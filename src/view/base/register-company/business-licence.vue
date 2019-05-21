<template>
    <el-form :model="form"
             ref="business"
             label-width="300px">
        <el-form-item label="营业执照："
                      prop="charter_url"
                      :rules="[{required:true,message:'请添加营业执照'}]"
                      :show-message="!form.charter_url.length">
            <multi-upload :images="form.charter_url"
                          :label="`上传图片/pdf`"
                          :accept="`image/jpeg,image/jpg,image/png,application/pdf`"
                          :edit="!flag||(flag===2&&form.status<5)"
                          @download="$emit('download',$event)"
                          :limit="5"
            ></multi-upload>
        </el-form-item>
        <el-form-item label="" v-if="flag!==1">
            <el-button type="primary" size="mini"
                       :disabled="form.status>=5"
                       @click.native="submit">推送到公司资料库
            </el-button>
            <el-button size="mini" @click.native="$emit('cancel')">取 消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import {api_get_business_licence_info} from '@/api/register-company';
    export default {
        name: "business-licence",
        data() {
            return {
                businessLicence:[]
            }
        },
        mounted() {
            if(this.flag)this.init_business();
        },
        methods: {
            init_business(){
                this.$http(api_get_business_licence_info,this.form.id).then(res=>{
                    if(res.charter_url&&JSON.parse(res.charter_url).length){
                        this.$set(this.form,'charter_url',JSON.parse(res.charter_url).map(charter=>{
                            return {path:res.url_prefix+'/'+charter.filePath,is_add:false,file_name:charter.fileName,file_content:charter.filePath};
                        }));
                    }
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            submit(){
                this.$refs.business.validate(valid=>{
                    if(valid){
                        let data={
                            charter_url:this.form.charter_url.map(image=>{
                                return {path:image.file_content||'',name:image.file_name,is_add:image.is_add};
                            }),
                        };
                        this.$emit('upload-business-licence',data);
                    }else{
                        console.error('验证不通过');
                    }
                })
            }
        },
        props: {
            form:Object,
            flag:Number
        },
        components: {
            multiUpload:require('@/view/base/company-information/multi-upload').default,
        },
    }
</script>

