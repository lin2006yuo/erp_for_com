<template>
    <div class="p-retype">
        <page-dialog title="显示密码"
                     v-model="visible"
                     size="small"
                     :close-on-click-modal="false">
            <div>
                <label class="ml-sm">请输入你的登录密码以获取</label>
                <el-row class="ml-sm mt-mini">
                    <el-input type="password"
                              v-model="login_password"
                              autofocus>
                    </el-input>
                </el-row>
            </div>
            <div slot="footer" class="dialog-footer mt-sm">
                <request-button req-key='retypePass' @click="sure">确认</request-button>
                <el-button @click.native="visible = false" size="mini">取消</el-button>
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
    import {http} from "../../../lib/http-plus"
    import {api_get_password} from '../../../api/account-apply'
    export default {
        data(){
            return {
                login_password: '',
                visible:false,
            }
        },
        mounted(){
        },
        methods: {
            sure(){
                if(this.login_password){
                    this.visible = false;
                    this.$set(this.retypeData, 'password', this.login_password);
                    let request = http(Url2(this.passwordUrl), this.retypeData);
                    this.$http(request).then(res=>{
                        this.$emit('get-password', res.password, this.retypeData.type);
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
            }
        },
        computed: {},
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                if(val){
                    this.login_password = '';
                }
                this.visible = val;
            },
        },
        props: {
            value:{},
            retypeData:{},
            passwordUrl:{}
        },
        components: {
            pageDialog:require("../../../components/page-dialog.vue").default,
        },
    }
</script>
