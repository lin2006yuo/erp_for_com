<template>
    <page-dialog :size="changeSize" :title="`给用户：${changeInfo.userName} 修改密码`"
                 v-model="changeDialog" :close-on-click-modal="false" >
        <div>
            <div class="info">
                <span class="blod"><i></i>提示信息：</span><span>您将对 <i class="active">{{changeInfo.userName}}用户</i> 的密码进行修改，请谨慎对待！</span>
            </div>
            <el-form v-model="form" label-width="100px">
                <el-form-item>
                    <el-checkbox label="初始化为系统默认密码：111111" v-model="form.initialize"></el-checkbox>
                </el-form-item>
                <el-form-item label="原始密码：">
                    <el-input v-model="form.old_password"></el-input>
                </el-form-item>
                <el-form-item label="新密码：" >
                    <el-input v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码：">
                    <el-input  v-model="form.confirm_password"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <request-button req-key="changePwd" @click="submit">提交</request-button>
            <el-button size="mini" @click.native="cancel">取 消</el-button>
        </span>
    </page-dialog>
</template>
<style lang="stylus">
    .info{
        width:100%;
        height:40px;
        margin:0 auto;
        line-height:40px;
        border-radius:3px;
        -moz-border-radius:3px;
        -webkit-border-radius:3px;
        background:-moz-linear-gradient(top,#b8c4cb,#f6f6f8);
        background:-webkit-gradient(linear, 0% 0%, 0% 100%,from(#b8c4cb), to(#f6f6f8));
    }
    i.active{
        color:#e4393c;
        font-style:normal;
        font-weight: 400;
        font-size:1.25rem;
    }
    .info span.blod i{
        width:32px;
        height:32px;
        display:inline-block;
        vertical-align: middle;
        background:url(../../../assets/Info.png)no-repeat 0 0;
}
</style>
<script>
    import pageDialog from '../../../components/page-dialog.vue';
    import {api_change_pwd} from '../../../api/user-management';
    export default{
        data(){
            return {
                form:{
                    initialize:false,
                    old_password:"",
                    password:"",
                    confirm_password:"",
                },
                changeDialog:false,
                changeSize:"small"
            }
        },
        mounted(){
            this.changeDialog = this.value;
        },
        watch:{
            changeDialog(val){
                this.$emit('input', val);
            },
            value(val){
                this.changeDialog = val;
            }
        },
        methods:{
            submit(){
                let param= {
                    old_password:this.form.old_password,
                    password:this.form.password,
                    confirm_password:this.form.confirm_password
                };
                this.$http(api_change_pwd,param).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message||res
                    });
                    this.changeDialog = false;
                    this.form={
                        old_password:"",
                        password:"",
                        confirm_password:""
                    }
                }).catch(code=>{
                    this.$message({
                        type:"error",
                        message:code.message||code
                    });
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('changePwd', false);
                    }, 300)
                })
            },
            cancel(){
                this.changeDialog = false;
            }
        },
        props:{
            value:{
                required:true
            },
            changeInfo:{
                required:true,
                type:Object
            }
        },
        components: {
            pageDialog
        }
    }
</script>

