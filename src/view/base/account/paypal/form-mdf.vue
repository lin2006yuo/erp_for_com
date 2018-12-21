<template>
    <page-dialog :title="`修改账户：${form.account_name} 信息`"
                 @open="open"
                 v-model="dialogVisible" size="small" :close-on-click-modal="false">
        <div>
            <el-form :model="form" label-width="130px" :rules="rules" ref="form">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="账户名：" prop="account_name">
                            <el-input v-model="form.account_name" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="密码：" prop="email_password">
                            <el-input v-model="form.email_password"
                                      ref="email"
                                      type="password"
                                      class="inline"
                                      :disabled="isShowPassword"></el-input>
                            <el-button type="primary"
                                       size="mini"
                                       class="ml-sm"
                                       :disabled="!isShowPassword"
                                       @click="viewPassword('email')">显示密码</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="API用户名：" prop="api_user_name">
                            <el-input v-model="form.api_user_name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="API密码：" prop="api_secret">
                            <el-input v-model="form.api_secret"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="API签名：" prop="api_signature">
                            <el-input type="textarea" v-model="form.api_signature"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="Rest Client ID：" prop="rest_client_id">
                            <el-input v-model="form.rest_client_id"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="Rest Secret：" prop="rest_secret">
                            <el-input v-model="form.rest_secret"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="抓取PayPal订单功能：">
                            <el-select v-model="form.download_paypal" filterable>
                                <el-option
                                        v-for="res in downloadList"
                                        :label="res.label"
                                        :value="res.value"
                                        :key="res.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="抓取PayPal纠纷功能：">
                            <el-select v-model="form.download_dispute" filterable>
                                <el-option
                                        v-for="res in downloadList"
                                        :label="res.label"
                                        :value="res.value"
                                        :key="res.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="抓取PayPal邮件功能：">
                            <el-select v-model="form.download_email" filterable>
                                <el-option
                                        v-for="res in downloadList"
                                        :label="res.label"
                                        :value="res.value"
                                        :key="res.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <request-button req-key='formMdfSubmit' @click="submit">确定</request-button>
            <el-button size="mini" @click.native="cancel">取消</el-button>
        </span>
        <retype-password v-model="retype_visible"
                         :retype-data="retypeData"
                         :password-url="passwordUrl"
                         @get-password="get_password"></retype-password>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>

    import {api_add,api_edit,api_upd} from '../../../../api/paypal';
    export default{
        data(){
            return{
                isShowPassword:true,
                dialogVisible:this.value,
                form:{
                    account_name:'',
                    api_user_name:'',
                    api_secret:'',
                    api_signature:'',
                    rest_client_id:'',
                    rest_secret:'',
                    download_paypal:0,
                    download_dispute:0,
                    download_email:0
                },
                downloadList:[
                    {label: "未启用", value: 0},
                    {label: "30分钟", value: 30},
                    {label: "1小时", value: 60},
                    {label: "2小时", value: 120},
                    {label: "3小时", value: 180},
                    {label: "4小时", value: 240},
                    {label: "5小时", value: 300},
                    {label: "6小时", value: 360},
                    {label: "7小时", value: 420},
                    {label: "8小时", value: 480},
                    {label: "9小时", value: 540},
                    {label: "10小时", value: 600},
                    {label: "11小时", value: 660},
                    {label: "12小时", value: 720},
                    {label: "24小时", value: 1440}
                ],
                rules:{
                    account_name:[
                        {required:true,message:"账户名不能为空",trigger:"blur"}
                    ],
                    // email_password:[
                    //     {required:true,message:"密码不能为空",trigger:"blur"}
                    // ],
                    api_user_name:[
                        {required:true,message:" API用户名不能为空",trigger:"blur"}
                    ],
                    api_secret:[
                        {required:true,message:"API密码不能为空",trigger:"blur"}
                    ],
                    api_signature:[
                        {required:true,message:"API签名不能为空",trigger:"blur"}
                    ]
                },
                retype_visible:false,
                retypeData:{
                    id: '',
                    password:''
                },
                passwordUrl:'get|paypal-account/show',
            }
        },
        watch:{
            dialogVisible(value){
                this.$emit('input',value);
            },
            value(val){
                this.dialogVisible = val;
            }
        },
        methods:{
            open(){
                this.init();
                this.isShowPassword = true
            },
            init(){
                api_edit(this.mdfid).then(succ=>{
                    this.form = succ;
                }).catch(fail=>{
                    console.log(fail)
                })
            },
            submit(){
                this.$refs.form.validate((bool)=>{
                    Object.keys(this.form).forEach(key=>{
                        if(typeof this.form[key] === 'string'){
                            this.form[key] = this.form[key].trim();
                        }
                    });
                    if(bool){
                        api_upd(this.mdfid, this.form).then(succ=>{
                            this.$message({
                                type:'success',
                                message:succ.message||succ
                            });
                            this.$emit('mdf-result',this.mdfid,this.form);
                            this.dialogVisible = false;
                        }).catch(fail=>{
                            this.$message({
                                type:'error',
                                message:fail.message||fail
                            });
                            this.dialogVisible = true;
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('formMdfSubmit', false);
                            }, 300)
                        })
                    }else{
                        this.$reqKey('formMdfSubmit', false);
                    }
                })
            },
            cancel(){
                this.dialogVisible = false;
            },
            viewPassword(){
                this.retypeData = {
                    id: this.mdfid,
                };
                this.retype_visible = true;
            },
            get_password(password){
                this.$refs['email'].$refs.input.type = 'text';
                this.isShowPassword = false;
                this.form.email_password = password;
            },
        },
        props:{
            value:{},
            mdfid:{
                required:true,
                type:Number
            }
        },
        components:{
            pageDialog:require('../../../../components/page-dialog.vue').default,
            requestButton:require('../../../../global-components/request-button').default,
            retypePassword:require('./retype-password.vue').default,
        }
    }
</script>
