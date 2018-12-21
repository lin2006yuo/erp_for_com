<template>
    <div class="c-get-author-code">
        <page-dialog v-model="dialog" size="small" :title="title" :close-on-click-modal="false">
            <el-form :model="form" ref="form" :rules="rules" label-width="120px">
                <el-form-item label="账户ID：" prop="client_id">
                    <el-row>
                        <el-col :span="20">
                            <el-input v-model="form.client_id"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="账户密钥：" prop="client_secret">
                    <el-row>
                        <el-col :span="20">
                            <el-input v-model="form.client_secret"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="授权码：" prop="code">
                    <el-row :gutter="8">
                        <el-col :span="14">
                            <el-input v-model="form.code"></el-input>
                        </el-col>
                        <el-col :span="8">
                            <request-button
                                    req-key='getAuthorCode'
                                    v-if="form.client_id&&form.client_secret"
                                    @click="get_author_code"
                                    size="mini">获取授权码</request-button>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <request-button
                        req-key='getTokenKey'
                        @click="get_token"
                        class="inline">获取token</request-button>
                <el-button size="mini"
                           @click.native="dialog = false"
                           class="inline" >取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_author_code,api_get_token} from '../../../../api/1688-accounts';
    export default {
        data() {
            let validator = (value,rules,callback)=>{
                if(value===''){
                    callback(new Error('账户ID为必填项'))
                }else{
                    callback()
                }
            };
            return {
                dialog:this.value,
                rules:{
                    client_id:[
                        {required:true,validator:validator,trigger:'change'},
                    ],
                    client_secret:[
                        {required:true,message:"账户密钥为必填项",trigger:'change'}
                    ],
                    code:[
                        {required:true,message:"授权码为必填项",trigger:'change'}
                    ],
                }
            }
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },
        },
        methods:{
            get_author_code(){
                let params = {
                    client_id:this.form.client_id,
                    client_secret:this.form.client_secret,
                };
                this.$http(api_get_author_code,params).then(res=>{
                    window.open(res.url);
                }).catch(code=>{
                    console.log(code,'code');
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('getAuthorCode', false);
                    }, 300)
                })
            },
            get_token(){
                this.$refs.form.validate(b=>{
                    if(b){
                        Object.keys(this.form).forEach(key=>{
                            if(typeof this.form[key] === 'string'){
                                this.form[key] = this.form[key].trim();
                            }
                        });
                        let params = clone(this.form);
                        this.$http(api_get_token,params).then(res=>{
                            this.dialog = false;
                            this.$message({type:"success",message:res.message||res});
                        }).catch(code=>{
                            this.$message({type:"error",message:code.message||code});
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('getTokenKey', false);
                            }, 300)
                        })
                    }else{
                        setTimeout(() => {
                            this.$reqKey('getTokenKey', false);
                        }, 300)
                    }
                });

            },
        },
        props:{
            value:{},
            form:{
                required:true,
                type:Object
            },
            title:{
                type:String,
            }
        },
        components: {
            pageDialog:require('../../../../components/page-dialog.vue').default,
        }
    }
</script>