<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @close="close" :close-on-cilck-modal="false">
        <el-form :model="lookData"
                 label-width="160px"
                 ref="lookData"
                 :rules="rules">
            <el-form-item label="Payoneer邮箱：" prop="account_name">
                <el-col :span="18">
                    <el-input v-model="lookData.account_name"
                              class="inline"
                              disabled
                              placeholder="请输入"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="登录密码：" prop="email_password">
                <el-col :span="18">
                    <el-input v-model="lookData.email_password"
                              ref="email_password"
                              type="password"
                              class="inline"
                              placeholder="请输入"
                              :disabled="isShowPassword"></el-input>
                    <el-button type="primary"
                               size="mini"
                               class="inline ml-sm"
                               :disabled="!isShowPassword"
                               @click="viewPassword('email_password')">显示密码
                    </el-button>
                </el-col>
            </el-form-item>
            <el-form-item label="注册名称：" prop="registered_name">
                <el-col :span="18">
                    <el-input v-model="lookData.registered_name"
                              class="inline"
                              placeholder="请输入"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="公司名称：" prop="company_name">
                <el-col :span="18">
                    <el-input v-model="lookData.company_name"
                              class="inline"
                              placeholder="请输入"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="账户持有人：" prop="belong">
                <el-col :span="18">
                    <el-input v-model="lookData.belong"
                              class="inline"
                              placeholder="请输入"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="电话号码：" prop="phone">
                <el-col :span="18">
                    <el-input v-model="lookData.phone"
                              type="number"
                              class="inline"
                              placeholder="请输入"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="生日：">
                <el-col :span="18">
                    <el-date-picker
                            v-model="lookData.birthday"
                            class="inline"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="客户ID：" prop="client_code">
                <el-col :span="18">
                    <el-input v-model.number="lookData.client_code"
                              class="inline"
                              placeholder="请输入"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="密保答案：">
                <el-col :span="18">
                    <el-input v-model="lookData.encrypted_data"
                              :disabled="isShowAnswers"
                              ref="encrypted_data"
                              type="password"
                              class="inline"
                              :placeholder="placeholder"></el-input>
                    <el-button type="primary"
                               size="mini"
                               class="inline ml-sm"
                               :disabled="!isShowAnswers"
                               @click="viewPassword('encrypted_data')">显示密保</el-button>
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
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="keep" type="primary">确 定</el-button>
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
    import {api_payoneer_save} from '@/api/payoneer';
    export default{
        data(){
            return{
                show:this.value,
                rules:{
                    account_name:[{required: true, message: 'Payoneer邮箱为必填项', trigger: 'blur'}],
                    email_password:[{required: true, message: '登录密码为必填项', trigger: 'blur'}],
                    registered_name:[{required: true, message: '注册名称为必填项', trigger: 'blur'}],
                    company_name:[{required: true, message: '公司名称为必填项', trigger: 'blur'}],
                    belong:[{required: true, message: '账户持有人为必填项', trigger: 'blur'}],
                    phone:[{required: true, message: '电话号码为必填项', trigger: 'blur'}],
                    client_code:[{required: true, message: '客户ID为必填项', trigger: 'blur',type:"number"}],
                    operator_id:[{required: true, message: '操作人为必选项', trigger:"change",type:"number"}],
                },
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
                this.isShowPassword = true;
            },
            keep(){
                this.$refs.lookData.validate((bool)=>{
                    if(bool){
                        let data = clone(this.lookData);
                        data.birthday && (data.birthday = datef('YYYY-MM-dd', new Date(this.lookData.birthday/1000)));
                        this.$http(api_payoneer_save,data.id,data).then(succ=>{
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
            lookPassword(type){
                this.$refs[type].$refs.input.type = 'text';
            },
            backPassword(type){
                this.$refs[type].$refs.input.type = 'password';
            },
            viewPassword(type) {
                this.retypeData = {
                    id: this.lookData.id,
                    type:type
                };
                this.retype_visible = true;
            },
            get_password(password, type){
                this.$refs[type].$refs.input.type = 'text';
                if(type === 'email_password'){
                    this.isShowPassword = false;
                    this.lookData.email_password = password;
                }else{
                    this.isShowAnswers = false;
                    this.lookData.encrypted_data = password;
                }
            }
        },
        computed: {
            placeholder(){
                if(!this.lookData.encrypted_data){
                    return "暂无密保";
                }else{
                    return `请输入`;
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
            pageDialog:require('@/components/page-dialog.vue').default,
            retypePassword:require('./retype-password.vue').default
        }
    }
</script>