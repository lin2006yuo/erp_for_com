<template>
    <page-dialog :title="title" @open="open"
                 @close="close" size="large"
                 v-model="dialogVisible"
                 :close-on-click-modal="false">
        <div>
            <el-form :model="lookData"
                     label-width="160px"
                     :rules="rules"
                     ref="lookData">
                <el-form-item label="服务器IP地址：" required>
                    <el-input class="inline" v-model="lookData.ip_address" disabled></el-input>
                    <el-button type="primary" size="mini" class="ml-sm" @click.native="dialogShow = true">选择服务器</el-button>
                </el-form-item>
                <el-form-item label="PayPal账户名：" prop="account_name">
                    <el-col :span="20">
                        <el-input class="inline" v-model="lookData.account_name" placeholder="请输入" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="密码：" prop="email_password">
                    <el-col :span="20">
                        <el-input v-model="lookData.email_password"
                                  ref="email"
                                  type="password"
                                  class="inline"
                                  :disabled="isShowPassword"></el-input>
                        <el-button type="primary"
                                   size="mini"
                                   class="ml-sm"
                                   :disabled="!isShowPassword"
                                   @click="viewPassword('email')">显示密码</el-button>
                    </el-col>
                </el-form-item>
                <el-form-item label="PayPal类型：" prop="type">
                    <el-col :span="20">
                        <el-select class="inline" v-model="lookData.type" filterable>
                            <el-option
                                    v-for="res in paypalList"
                                    :label="res.label"
                                    :value="res.value"
                                    :key="res.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-row v-for="(row,i) in lookData.withdrawals_accounts" :key="i">
                    <el-form-item :label="`提款类型${i ? i :''}：`"
                                  :prop="'withdrawals_accounts.'+ i +'.id'"
                                  :rules="[{required:true,message:'请选择提款类型',trigger:'change',type:'number'}]">
                        <el-col :span="20">
                            <super-select
                                    class="inline"
                                    v-model="row.id"
                                    :storage-key="`withdraCreator`"
                                    :options="withdrawalsList">
                            </super-select>
                            <el-button v-if="!i" type="primary" size="mini" class="ml-sm" @click.native="list_click(lookData)">新增</el-button>
                            <span v-if="i" style="font-size: 20px;" class="ml-sm"
                                  @click="del_accounts(lookData,i)">
                                <i class="el-icon-delete"></i>
                            </span>
                        </el-col>
                    </el-form-item>
                    <el-form-item :label="`提款账号${i ? i :''}：`"
                                  :prop="'withdrawals_accounts.'+ i +'.account'"
                                  :rules="[{required:true,message:'请填写提款账号',trigger:'blur'}]">
                        <el-col :span="20">
                            <el-input class="inline" v-model="row.account" placeholder="请输入"></el-input>
                        </el-col>
                    </el-form-item>
                </el-row>
                <el-form-item label="账户持有人：" prop="belong">
                    <el-col :span="20">
                        <el-input class="inline" v-model="lookData.belong" placeholder="请输入"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="电话号码：" prop="phone">
                    <el-col :span="20">
                        <el-input class="inline" v-model="lookData.phone" placeholder="请输入"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="绑定信用卡：" prop="credit_card">
                    <el-col :span="20">
                        <el-input class="inline" v-model="lookData.credit_card" placeholder="请输入"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="对应客户经理：">
                    <el-col :span="20">
                        <el-input class="inline" v-model="lookData.client" placeholder="例如：Jeffrey/+86-21-28913600 分机：5011"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="操作人：" prop="operator_id">
                    <el-col :span="20">
                        <super-select
                                class="inline"
                                v-model="lookData.operator_id"
                                :storage-key="`channelCreator`"
                                :options="creatorData">
                        </super-select>
                    </el-col>
                </el-form-item>

                <el-form-item label="抓取PayPal订单功能：">
                    <el-col :span="20">
                        <el-select class="inline" v-model="lookData.download_paypal" filterable>
                            <el-option
                                    v-for="res in downloadList"
                                    :label="res.label"
                                    :value="res.value"
                                    :key="res.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="抓取PayPal纠纷功能：">
                    <el-col :span="20">
                        <el-select class="inline" v-model="lookData.download_dispute" filterable>
                            <el-option
                                    v-for="res in downloadList"
                                    :label="res.label"
                                    :value="res.value"
                                    :key="res.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="抓取PayPal邮件功能：">
                    <el-col :span="20">
                        <el-select class="inline" v-model="lookData.download_email" filterable>
                            <el-option
                                    v-for="res in downloadList"
                                    :label="res.label"
                                    :value="res.value"
                                    :key="res.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <request-button req-key='formMdfSubmit' @click="submit">确 定</request-button>
            <el-button size="mini" @click.native="cancel">取 消</el-button>
        </span>
        <choose-server v-model="dialogShow" @choose-server="choose_server"></choose-server>
        <retype-password v-model="retype_visible"
                         :retype-data="retypeData"
                         :password-url="passwordUrl"
                         @get-password="get_password"></retype-password>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_upd} from '@/api/paypal';
    import {chinese,allPhone} from '@/define/validator_reg'
    export default{
        data(){
            let isChinese = (rule,value,callback)=>{
                return chinese.test(value)? callback(new Error("输入内容不能存在中文字符")):callback();
            };
            let checkTel = (rule, value, callback) => {
                if (value) {
                    let str = value.replace(/\s/g, '');
                    if (!allPhone.test(str)) {
                        return callback(new Error('请输入正确的电话号码'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            return{
                dialogShow: false,
                isShowPassword:true,
                dialogVisible:this.value,
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
                paypalList:[
                    {label: "小额", value: 1},
                    {label: "大额", value: 2}
                ],
                rules:{
                    account_name:[
                        {required:true,message:"请填写PayPal账户名",trigger:"blur"},
                        {validator:isChinese,trigger:"blur"}
                    ],
                    email_password: [
                        { required: true, message: '请填写账号密码', trigger: 'blur'}
                    ],
                    type:[
                        { required: true, message: '请选择PayPal类型', trigger: 'change', type:'number'}
                    ],
                    id:[
                        { required: true, message: '请填写提款类型', trigger: 'change', type:'number'}
                    ],
                    account:[
                        { required: true, message: '请填写提款账号', trigger: 'blur'},
                        {validator:isChinese,trigger:"blur"}
                    ],
                    belong:[
                        { required: true, message: '请填写账户持有人', trigger: 'blur'}
                    ],
                    phone:[
                        { required: true, message: '请填写电话号码', trigger: 'blur'},
                        {validator: checkTel, trigger: 'blur'},
                    ],
                    credit_card:[
                        { required: true, message: '请填写绑定的信用卡', trigger: 'blur'},
                        {validator:isChinese,trigger:"blur"}
                    ],
                    operator_id:[
                        { required: true, message: '请选择操作人', trigger: 'change', type:'number'}
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
                this.isShowPassword = true
            },
            close(){
                Object.keys(this.lookData).forEach(key=>{
                    this.lookData[key] = "";
                });
            },
            //选择服务器
            choose_server(obj){
                this.lookData.ip_address = obj.ip;
                this.lookData.server_id=obj.id;
            },
            //增加
            list_click(row){
                let obj = {
                    id:'',
                    account:''
                };
                row.withdrawals_accounts.push(obj);
            },
            //删除
            del_accounts(row,index){
                row.withdrawals_accounts.splice(index,1);
            },
            submit(){
                this.$refs.lookData.validate((bool)=>{
                    if(bool){
                        this.lookData.withdrawals_type = this.lookData.withdrawals_accounts.map(row=>row.id).toString();
                        api_upd(this.lookData.id, this.lookData).then(succ=>{
                            this.$message({type:'success', message:succ.message||succ});
                            this.$emit('mdf-result');
                            this.dialogVisible = false;
                        }).catch(fail=>{
                            this.$message({type:'error', message:fail.message||fail});
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
                    id: this.lookData.id,
                };
                this.retype_visible = true;
            },
            get_password(password){
                this.$refs['email'].$refs.input.type = 'text';
                this.isShowPassword = false;
                this.lookData.email_password = password;
            },
        },
        props:{
            value:{},
            title:{},
            lookData:{},
            creatorData:{},
            withdrawalsList:{}
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
            requestButton:require('@/global-components/request-button').default,
            retypePassword:require('./retype-password.vue').default,
            chooseServer:require('./choose-server').default,
        }
    }
</script>
