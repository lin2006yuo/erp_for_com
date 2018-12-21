<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @cloce="cloce" :close-on-cilck-modal="false">
        <el-form :model="formData"
                 label-width="190px"
                 ref="commodityImpower"
                 >
            <el-form-item label="账号ID：" >
                <el-col :span="14">
                    <el-input v-model="formData.id"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="账号名称：">
                <el-col :span="14">
                    <el-input v-model="formData.name"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="密码：">
                <el-col :span="14">
                    <el-input v-model="formData.password"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="client_id：">
                <el-col :span="14">
                    <el-input v-model="formData.client_id"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="账号秘钥：" >
                <el-col :span="14">
                    <el-input v-model="formData.client_secret"></el-input>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="umka" @click.native="keep">获取token</request-button>
            <el-button size="mini" @click.native="cloce">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_umka_token} from '@/api/Umka-account';
    export default{
        data(){
            return{
                form:{
                    id:'',
                    name:'',
                    password:'',
                    client_id:'',
                    client_secret:''
                },
                show:this.value,
            }
        },
        computed:{
            formData(){
                if(!!this.info.access_token){
                    this.form.id = this.info.id;
                    this.form.name = this.info.name;
                    this.form.password = this.info.password;
                    this.form.client_id = this.info.client_id;
                    this.form.client_secret = this.info.client_secret;
                    return this.form
                }else {
                    return this.form
                }
            }
        },
        methods:{
            open(){

            },
            cloce(){
                this.show=false;
                if(!!this.info.access_token){
                    return
                }else {
                    this.form.id = '';
                    this.form.name = '';
                    this.form.password = '';
                    this.form.client_secret = '';
                    this.form.client_id = ''
                }
            },
            keep(){
                // Object.keys(this.commodityImpower).forEach(key=>{
                //     if(typeof this.commodityImpower[key] === 'string'){
                //         this.commodityImpower[key] = this.commodityImpower[key].trim();
                //     }
                // });
                // let code = {codes:this.updateCode}
                // let params = Object.assign(this.commodityImpower,code)
                let params = this.form;
                this.$http(api_umka_token,params).then(res=>{
                    this.$message({type:'success', message:res.message
                    });
                    this.show = false;
                    this.$emit('search')
                }).catch(code=>{
                    this.$message({type: 'error', message: code.message||code,
                    });
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('umka',false);
                    }, 300)
                })
            },
        },
        watch:{
            show(val){
                this.$emit('input', val);
                if(!val&&!this.info.access_token){
                    this.form.id = '';
                    this.form.name = '';
                    this.form.password = '';
                    this.form.client_secret = '';
                    this.form.client_id = ''
                }
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
            title:{
                type:String
            },
            info:{}
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>
