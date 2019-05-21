<template>
    <div class="c-authorization">
        <page-dialog v-model="dialog" size="small" title="授权"
                     :close-on-click-modal="false">
            <el-form :model="form" ref="form" label-width="220px" :rules="rules">
                <el-form-item label="账号ID：" prop="client_id">
                    <el-input v-model="form.client_id" class="width-super"></el-input>
                </el-form-item>
                <el-form-item label=" 账号密钥：" prop="client_secret">
                    <el-input v-model="form.client_secret" class="width-super"></el-input>
                </el-form-item>
                <el-form-item label=" MyMall账号：">
                    <el-input v-model="form.username" disabled class="width-super"></el-input>
                </el-form-item>
                <el-form-item label="  账号密码：" prop="password">
                    <el-input v-model="form.password" class="width-super"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <request-button req-key="authorization" @click="get_token">获取token</request-button>
                <el-button size='mini' @click="dialog = false">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_authorization} from '../../../../api/my-mall';
    export default {
        data() {
            return {
                dialog:this.value,
                rules:{
                    client_id:[
                        {required:true,message:'账号ID为必填项',trigger:'change'},
                    ],
                    client_secret:[
                        {required:true,message:'账号密钥为必填项',trigger:'change'},
                    ],
                    password:[
                        {required:true,message:'账号密码为必填项',trigger:'change'},
                    ],
                }
            }
        },
        methods:{
            get_token(){
                this.$refs.form.validate((b)=>{
                    Object.keys(this.form).forEach(key=>{
                        if(typeof this.form[key] === 'string'){
                            this.form[key] = this.form[key].trim();
                        }
                    });
                    if(b){
                        this.$http(api_get_authorization,this.form).then(res => {
                            this.$message({type:'success',message:res.message||res});
                            this.$emit('get-token');
                            this.dialog = false;
                        }).catch(code => {
                            this.$message({type:'error',message:code.message||code});
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('authorization', false);
                            }, 300)
                        })
                    }else{
                        this.$reqKey('authorization', false);
                    }
                });
            },
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },
        },
        props:{
            value:{},
            form:{}
        },
        components: {
            pageDialog:require('../../../../components/page-dialog.vue').default,
        }
    }
</script>