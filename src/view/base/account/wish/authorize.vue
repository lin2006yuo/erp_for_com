<template>
    <el-row class="p-authorize_">
        <page-dialog title="授权"   size="small" v-model="authorVisible" :close-on-click-modal="false">
            <el-form :model="authorizeData">
                <el-form-item label="账户ID：" label-width="100px">
                    <el-col :span="16">
                    <el-input v-model="authorizeData.id" @blur="blur" style="width:290px"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="账户密钥：" label-width="100px">
                    <el-col :span="16">
                        <el-input v-model="authorizeData.client_secret" style="width:290px"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="回调地址：" label-width="100px">
                    <el-col :span="16">
                        <el-input v-model="authorizeData.redirect_url" style="width:290px"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item  label="授权码：" label-width="100px">
                    <el-col :span="16">
                        <el-input v-model="authorizeData.code" style="width:290px"></el-input>
                    </el-col>
                    <el-col :span="4" style="margin-left:10px">
                        <a  :href="authorizeData.href" target="_blank" class="ebay-link" v-show="isAuthor">获取授权码</a>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <request-button req-key="authorizeKey" @click="gain_token"
                                :disabled="isToken">获取token</request-button>
                <el-button type="primary"  size="mini" @click="close_author">取 消</el-button>
            </div>
        </page-dialog>

    </el-row>
</template>
<style lang="stylus">
    .p-authorize_{
        .ebay-link{
            display: block;
            background: #20a0ff;
            color: white;
            text-align: center;
            border-radius: 5px;
            width: 100%;
        }
        .ebay-link:hover{
            font-size: 1.25rem;
        }
    }
</style>
<script>
    import  pageDialog from '../../../../components/page-dialog.vue'
    import { wish_token,wish_client} from '../../../../api/wish'
    import { api_joom_shop_token,api_joom_shop_authorization,api_joom_shop_author_code} from '../../../../api/joom'
    export default{
        data(){
            return{
                authorVisible:false
            }
        },
        computed:{
            isAuthor(){//----------是否显示授权码
                if (!this.authorizeData.id) {
                    return false
                }
                if (!this.authorizeData.client_secret) {
                    return false
                }
                if (!this.authorizeData.redirect_url) {
                    return false
                }
                return true
            },
            isToken(){//----------------获取token按钮禁用
                if (!this.authorizeData.id) {
                    return true
                }
                if (!this.authorizeData.client_secret) {
                    return true
                }
                if (!this.authorizeData.code) {
                    return true
                }
                return false
            }
        },
        methods:{
            blur(val){//---------收入账号失去焦点时 触发的事件
                let params = {
                    client_id:this.authorizeData.id
                };
                if(this.channel==='wish'){
                	this.get_href(wish_client,params);
                }else{
                    this.get_href(api_joom_shop_author_code,params);
                }
            },
            get_href(url,data){ //   获取连接地址
                this.$http(url,data).then(res => {
                    this.authorizeData.href = res.url;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message||code,
                    });
                })
            },
            close_author(){//--------取消关闭弹框
                this.authorVisible = false;
            },
            gain_token(){//---------------------获取token 按钮
                let params = {
                    id:this.authorizeData.merchant_id,
                    client_id:this.authorizeData.id,
                    client_secret:this.authorizeData.client_secret,
                    redirect_url:this.authorizeData.redirect_url,
                    authorization_code:this.authorizeData.code
                };
                Object.keys(params).forEach(key=>{
                    if(typeof params[key] === 'string'){
                        params[key] = params[key].trim();
                    }
                });
                if(this.channel==='wish'){
                    this.get_token(wish_token,params);
                }else{
                    this.get_token(api_joom_shop_token,params);
                }
            },
            get_token(url,data){  // 获取token
                this.$http(url,data).then(res => {
                    this.$message({
                        type: 'success',
                        message: '获取成功'
                    });
                    this.authorVisible = false;
                    this.$emit('gain_token')
                }).catch(code =>{
                    this.$message({
                        type: 'error',
                        message: code.message||code,
                    });
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('authorizeKey', false);
                    }, 300)
                })
            },
        },
        watch:{
            authorVisible(val){
                this.$emit('input',val);
            },
            value(val){
                this.authorVisible = val;
            }
        },
        props:{
            authorizeData:{
                required:true,
                type:Object
            },
            value:{
            },
            channel:{
            	default(){
            		return 'wish'
                }
            }
        },
        components:{
            pageDialog
        }
    }
</script>
