<template>
    <div class="p-retype">
        <page-dialog title="显示密码" v-model="show" size="small" @open="open" @close="close" :close-on-cilck-modal="false">
            <div>
                <label class="ml-sm">请输入你的登录密码以获取</label>
                <el-row class="ml-sm mt-mini">
                    <el-input type="password"
                              class="width-sm inline"
                              v-model="login_password"
                              autofocus>
                    </el-input>
                </el-row>
            </div>
            <div slot="footer" class="dialog-footer">
                <request-button req-key='retypePass' @click="keep">确 认</request-button>
                <el-button size="mini" @click.native="show=false">关 闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .p-retype{
        .inner{
            width: 300px !important;
        }
    }
</style>
<script>
    import {api_get_password} from '@/api/payoneer'
    export default{
        data(){
            return{
                show:this.value,
                login_password: '',
            }
        },
        methods:{
            open(){

            },
            close(){

            },
            keep(){
                if(this.login_password) {
                    this.show = false;
                    let data ={
                        id:this.retypeData.id,
                        password:this.login_password,
                        type:this.retypeData.type
                    }
                    this.$http(api_get_password,data).then(res => {
                        this.$emit('get-password',res.password,this.retypeData.type);
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    }).finally(()=>{
                        setTimeout(() => {
                            this.$reqKey('retypePass', false);
                        }, 300)
                    })
                } else {
                    this.$reqKey('retypePass', false);
                    this.$message({type:"error",message:'请输入登录密码'});
                }
            },
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            retypeData:{}
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>