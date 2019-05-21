<template>
    <page-dialog :title="`给账号：${title}授权`"
                 v-model="show"
                 size="small"
                 class="c-paypal-authorization-dialog">
        <el-form :model="form" ref="form" label-width="130px">
            <el-form-item label="API用户名：" required
                          prop="api_user_name"
                          :rules="[{required:true,message:`账户名不能为空`,trigger:'blur'}]">
                <el-col :span="20">
                    <el-input v-model="form.api_user_name"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="API密码：" prop="api_secret">
                <el-col :span="20">
                    <el-input v-model="form.api_secret"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="API签名：" prop="api_signature">
                <el-col :span="20">
                    <el-input v-model="form.api_signature"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="Rest Client ID：" prop="rest_client_id">
                <el-col :span="20">
                    <el-input v-model="form.rest_client_id"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="Rest Secret：" prop="rest_secret">
                <el-col :span="20">
                    <el-input v-model="form.rest_secret"></el-input>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="submit" type="primary">确 定</el-button>
            <el-button size="mini" @click="show=false">取 消</el-button>
        </div>
    </page-dialog>
</template>

<style lang="stylus" scoped>

</style>

<script>
    import {api_paypal_account_authorization} from '@/api/paypal'
    export default {
        name: "authorization-dialog",
        data() {
            return {
                show:this.value,
            }
        },
        computed: {},
        watch: {
            show(val){
                this.$emit('input',val);
            },
            value(val){
                this.show=val;
            }
        },
        methods: {
            submit(){
                this.$refs.form.validate(valid=>{
                    if(valid){
                        this.$http(api_paypal_account_authorization,Number(this.form.id),{
                            api_user_name:this.form.api_user_name,
                            api_secret:this.form.api_secret,
                            api_signature:this.form.api_signature,
                            rest_client_id:this.form.rest_client_id,
                            rest_secret:this.form.rest_secret
                        }).then(res=>{
                            this.$message({type:'success',message:res.message||res});
                            this.show=false;
                            this.$emit('refresh');
                        }).catch( error =>{
                            error&&this.$message({type:'error', message:error.message||error});
                        });
                    }
                })
            }
        },
        props: {
            value:{},
            title:{},
            form:{}
        },
    }
</script>

