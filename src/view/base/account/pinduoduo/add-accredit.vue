<template>
    <page-dialog :title="title" v-model="show" size="small" @click="cloce" :close-on-cilck-modal="false">
        <el-form :model=" reqData"
                 label-width="190px"
                 ref=" reqData"
                 :rules="rules">
            <el-form-item label="账号ID：" prop="client_id">
                <el-col :span="14">
                    <el-input v-model=" reqData.client_id"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="账号秘钥：" prop="client_secret">
                <el-col :span="14">
                    <el-input v-model="reqData.client_secret"></el-input>
                </el-col>
            </el-form-item>
            <div>
                <el-form-item label="获取授权码：" >
                    <el-col :span="14">
                        <el-input v-model=" reqData.authorcode"></el-input>
                    </el-col>
                    <el-button size="mini" @click.native="get_author_code" class="inline" type="primary" style="margin-left: 10px" v-if="btnshow">获取授权码</el-button>
                </el-form-item>
            </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="addGain" @click.native="keep">获取token</request-button>
            <el-button size="mini" @click.native="cloce">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_account_token,api_pdd_authorcode} from '@/api/pdd';
    export default{
        data(){
            return{
                show:this.value,
                btnshow:true,
                // authorcode:'',
                listId:'',
                authcode:'',
                rules:{
                    client_id:[
                        {required: true, message: '账号ID为必填项', trigger: 'change'}
                    ],
                    client_secret:[
                        {required: true, message: '商品授权账号秘钥为必填项', trigger: 'change' }
                    ],
                },
                reqData:{
                    client_id:'',
                    client_secret:'',
                    authorcode:''
                }
            }
        },
        methods:{
            open(){

            },
            cloce(){
                this.show=false;
                this.reqData.client_id='';
                this.reqData.client_secret='';
                this.reqData.authorcode=''
            },
            get_author_code(){
                this.$http(api_pdd_authorcode,{client_id:JSON.stringify(this.clientid)}).then(res=>{
                    if(!!res){
                        this.btnshow=true
                    }else {
                        this.btnshow=false
                    }
                    this.authorcode=res.url
                    window.open(`${res.url}`)
                })
            },
            keep(){
                let params={
                    id:this.row_id,
                    client_id:this.reqData.client_id,
                    client_secret:this.reqData.client_secret,
                    authorization_code:this.reqData.authorcode,
                }
                this.$http(api_account_token,params).then(res=>{
                    this.$message({type:'success', message:res.message
                    });
                    this.show = false;
                }).catch(code=>{
                    this.$message({type: 'error', message: code.message||code,
                    });
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('addGain',false);
                    }, 300)
                })
            },
        },
        computed:{
            row_id(){
                return this.row.id
            }
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            },
        },
        props:{
            row:{},
            clientid:{},
            value:{
                required:true,
                type:Boolean
            },
            title:{
                type:String
            }
        },
        components:{
            pageDialog:require('../../../../components/page-dialog.vue').default,
        }
    }
</script>
