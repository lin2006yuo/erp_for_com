<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @close="close" :close-on-cilck-modal="false">
        <el-form :model="lookData"
                 label-width="160px"
                 ref="lookData"
                 :rules="rules">
            <el-form-item label="服务器IP地址：">
                <el-input class="inline" v-model="lookData.ip_address" disabled></el-input>
                <el-button type="primary" size="mini" class="ml-sm" @click.native="dialogShow = true">选择服务器</el-button>
            </el-form-item>
            <el-form-item label="登录邮箱：" prop="wf_account">
                <el-col :span="18">
                    <el-input v-model="lookData.wf_account"
                              class="inline"
                              disabled
                              placeholder="请输入邮箱账号"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="登录密码：" prop="wf_password">
                <el-col :span="18">
                    <el-input v-model="lookData.wf_password"
                              ref="wf_password"
                              type="password"
                              class="inline"
                              placeholder="请输入"
                              :disabled="isShowPassword"></el-input>
                    <el-button type="primary"
                               size="mini"
                               class="inline ml-sm"
                               :disabled="!isShowPassword"
                               @click="viewPassword('wf_password')">显示密码
                    </el-button>
                </el-col>
            </el-form-item>
            <el-form-item label="密保答案：">
                <el-col :span="18">
                    <el-input v-model="lookData.encrypted_answers"
                              :disabled="isShowAnswers"
                              ref="encrypted_answers"
                              type="password"
                              class="inline"
                              placeholder="请输入"></el-input>
                    <el-button type="primary"
                               size="mini"
                               class="inline ml-sm"
                               :disabled="!isShowAnswers"
                               @click="viewPassword('encrypted_answers')">显示密保</el-button>
                </el-col>
            </el-form-item>
            <el-form-item label="持有人姓名：" prop="belong">
                <el-col :span="18">
                    <el-input v-model="lookData.belong"
                              class="inline"
                              placeholder="请输入"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="操作人：" prop="operator_id">
                <el-col :span="18">
                    <super-select
                            class="inline"
                            v-model="lookData.operator_id"
                            :storage-key="`operatoridCreator`"
                            :options="creatorData">
                    </super-select>
                </el-col>
            </el-form-item>
            <choose-server v-model="dialogShow" @choose-server="choose_server"></choose-server>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="submitWF" @click.native="keep" type="primary">确定</request-button>
            <el-button size="mini" @click.native="show=false">取 消</el-button>
        </div>
        <retype-password v-model="retype_visible"
                         :retype-data="retypeData"
                         @get-password="get_password">
        </retype-password>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_worldfirst_save} from '@/api/worldfirst'
    export default{
        data(){
            return{
                show:this.value,
                rules:{
                    wf_account:[{required: true, message: '登录邮箱为必填项', trigger: 'blur'}],
                    wf_password:[{required: true, message: '登录密码为必填项', trigger: 'blur'}],
                    belong:[{required: true, message: '持有人姓名为必填项', trigger: 'blur'}],
                    operator_id:[{required: true, message: '操作人为必选项', trigger:"change",type:"number"}],
                },
                dialogShow: false,
                retype_visible: false,
                retypeData:{
                    type:'',
                    id:'',
                    password:''
                },
                isShowPassword:true,
                isShowAnswers:true
            }
        },
        methods:{
            open(){
                this.isShowPassword=true;
                this.isShowAnswers = true;
            },
            close(){
                Object.keys(this.lookData).forEach(key=>{
                    this.lookData[key] = "";
                });
            },
            keep(){
                this.$refs.lookData.validate((bool)=>{
                    if(bool){
                        this.$http(api_worldfirst_save,this.lookData.id,this.lookData).then(succ=>{
                            this.$message({type:'success', message:succ.message||succ});
                            this.$emit('submit');
                            this.show = false;
                        }).catch(fail=>{
                            this.$message({type:'error', message:fail.message||fail});
                            this.show = true;
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('submitWF', false);
                            }, 300)
                        })
                    }else{
                        this.$reqKey('submitWF', false);
                    }
                })
            },
            //选择服务器
            choose_server(obj){
                this.lookData.ip_address = obj.ip;
                this.lookData.ip_name=obj.name;
                this.lookData.server_id=obj.id;
            },
            viewPassword(type) {//---显示密码
                this.retypeData = {
                    id: this.lookData.id,
                    type:type
                };
                this.retype_visible = true;
            },
            get_password(password, type){
                this.$refs[type].$refs.input.type = 'text';
                if(type === 'wf_password'){
                    this.isShowPassword = false;
                    this.lookData.wf_password = password;
                }else{
                    this.isShowAnswers = false;
                    this.lookData.encrypted_answers = password;
                }
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
            value:{
                required:true,
                type:Boolean
            },
            lookData:{},
            title:{},
            creatorData:{}
        },
        components:{
            chooseServer:require('../paypal/choose-server').default,
            pageDialog:require('@/components/page-dialog.vue').default,
            retypePassword:require('./retype-password.vue').default,
        }
    }
</script>