<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @cloce="cloce" :close-on-cilck-modal="false">
        <el-form :model="addCodeForm"
                 :rules="rules"
                 label-width="190px"
                 ref="addCodeForm">
            <el-form-item label="密钥：" v-if="edit">
                <el-col :span="14">
                    <el-input v-model="addCodeForm.app_secret"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="apiKey：" prop="app_key" v-if="edit">
                <el-col :span="14">
                    <el-input v-model="addCodeForm.app_key"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="获取授权码：" v-if="edit">
                <el-col :span="14">
                    <el-input v-model="addCodeForm.authorization_code"></el-input>
                </el-col>
                <el-button v-if="addCodeForm.app_key != ''" class="ml-xs" type="primary" size="mini" @click="add_code">获取授权码</el-button>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="keep" type="primary">获取token</el-button>
            <el-button size="mini" @click.native="show=false">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import{api_lazada_account_authorcode,api_get_lazada_token}from '../../../../api/lazada';
    export default{
        data(){
            return{
                show:this.value,
                rules:{
                    app_key:[
                        {required: true, message: 'apikey为必填项', trigger: 'change'}
                    ]
                }
            }
        },
        methods:{
            open(){

            },
            cloce(){

            },
            keep(){
                let params = {
                    id:this.addCodeForm.id,
                    app_key:this.addCodeForm.app_key,
                    app_secret:this.addCodeForm.app_secret,
                    authorization_code:this.addCodeForm.authorization_code,
                };
                Object.keys(params).forEach(key=>{
                    if(typeof params[key] === 'string'){
                        params[key] = params[key].trim();
                    }
                })
                this.$http(api_get_lazada_token,params).then(res=>{
                    this.$message({type:"success",message:res});
                    this.show = false;
                }).catch(code=>{
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                })
            },
            add_code(){
                let params = {
                    app_key:this.addCodeForm.app_key
                };
                this.$http(api_lazada_account_authorcode,params).then(res=>{
                    window.open(res.url,'_blank');
                })
            },
        },
        computed:{
            isAdd(){//-----校验
                if(!this.app_key){
                    return true
                }
                return false
            }
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
            addCodeForm:{
                required:true,
                type:Object
            },
            title:{
                type:String
            },
            edit:{
                type:Boolean
            },
            value:{
                required:true,
                type:Boolean
            },
        },
        components:{
            pageDialog:require('../../../../components/page-dialog.vue').default,
        }
    }
</script>
