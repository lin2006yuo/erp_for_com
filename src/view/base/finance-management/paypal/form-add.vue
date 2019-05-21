<template>
    <page-dialog title="添加paypal账号" v-model="dialogVisible" size="large" :close-on-click-modal="false">
        <div>
            <el-form :model="addForm" :rules="rules" ref="addForm" label-width="160px">
                <el-form-item label="服务器IP地址：" required>
                    <el-input class="inline" v-model="addForm.ip_address" disabled></el-input>
                    <el-button type="primary" size="mini" class="ml-sm" @click.native="dialogShow = true">选择服务器</el-button>
                </el-form-item>
                <el-form-item label="PayPal账户名：" prop="account_name">
                    <el-col :span="20">
                        <el-input class="inline" v-model="addForm.account_name" placeholder="请输入"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="密码：" prop="email_password">
                    <el-col :span="20">
                        <el-input ref="pwd" type="password" class="inline" v-model="addForm.email_password" placeholder="请输入"></el-input>
                        <img src="../../../../assets/eye.svg"
                             alt=""
                             @mouseup="backPassword('pwd')"
                             @mousedown="lookPassword('pwd')"
                             style="vertical-align: middle;width: 20px;height: 20px;">
                    </el-col>
                </el-form-item>
                <el-form-item label="PayPal类型：" prop="type">
                    <el-col :span="20">
                        <el-select class="inline" v-model="addForm.type" filterable>
                            <el-option
                                    v-for="res in paypalList"
                                    :label="res.label"
                                    :value="res.value"
                                    :key="res.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-row v-for="(row,i) in addForm.withdrawals_accounts" :key="i">
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
                            <el-button v-if="!i" type="primary" size="mini" class="ml-sm" @click.native="list_click(addForm)">新增</el-button>
                            <span v-if="i" style="font-size: 20px;" class="ml-sm"
                                  @click="del_accounts(addForm,i)">
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
                        <el-input class="inline" v-model="addForm.belong" placeholder="请输入"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="电话号码：" prop="phone">
                    <el-col :span="20">
                        <el-input class="inline" v-model="addForm.phone" placeholder="请输入"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="绑定信用卡：" prop="credit_card">
                    <el-col :span="20">
                        <el-input class="inline" v-model="addForm.credit_card" placeholder="请输入"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="对应客户经理：">
                    <el-col :span="20">
                        <el-input class="inline" v-model="addForm.client" placeholder="例如：Jeffrey/+86-21-28913600 分机：5011"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="操作人：" prop="operator_id">
                    <el-col :span="20">
                        <super-select
                                class="inline"
                                v-model="addForm.operator_id"
                                :storage-key="`channelCreator`"
                                :options="creatorData">
                        </super-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="抓取PayPal订单功能：">
                    <el-col :span="20">
                        <el-select class="inline" v-model="addForm.download_paypal" filterable>
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
                        <el-select class="inline" v-model="addForm.download_dispute" filterable>
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
                        <el-select class="inline" v-model="addForm.download_email" filterable>
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
            <request-button req-key='submitPaypal' @click="submit">确 定</request-button>
            <el-button  size="mini" @click.native="cancel">取 消</el-button>
        </span>
        <choose-server v-model="dialogShow" @choose-server="choose_server"></choose-server>
    </page-dialog>
</template>
<style lang="stylus">
    .innerbox{
        display: flex;
        align-items: center;
    }
</style>
<script>
    import {api_add} from '@/api/paypal';
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
                        {required:true,message:"账户名不能为空",trigger:"blur"},
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
                }
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
            //选择服务器
            choose_server(obj){
                this.addForm.ip_address = obj.ip;
                this.addForm.server_id=obj.id;
            },
            lookPassword(type){
                this.$refs[type].$refs.input.type = 'text';
            },
            backPassword(type){
                this.$refs[type].$refs.input.type = 'password';
            },
            list_click(row){
                let obj = {
                    id:'',
                    account:''
                };
                row.withdrawals_accounts.push(obj);
            },
            del_accounts(row,index){
                row.withdrawals_accounts.splice(index,1);
            },
            submit(){
                this.$refs.addForm.validate((bool)=>{
                    Object.keys(this.addForm).forEach(key=>{
                        if(typeof this.addForm[key] === 'string'){
                            this.addForm[key] = this.addForm[key].trim();
                        }
                    });
                    if(bool){
                        this.addForm.withdrawals_type = this.addForm.withdrawals_accounts.map(row=>row.id).toString();
                        this.$http(api_add,this.addForm).then(succ=>{
                            this.$message({type:'success', message:succ.message||succ});
                            this.$emit('add-result');
                            this.dialogVisible = false;
                        }).catch(fail=>{
                            this.$message({type:'error', message:fail.message||fail});
                            this.dialogVisible = true;
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('submitPaypal', false);
                            }, 300)
                        })
                    }else{
                        this.$reqKey('submitPaypal', false);
                    }
                })
            },
            cancel(){
                this.dialogVisible = false;
            }
        },
        props:{
            value:{},
            addForm:{
                required:true,
                type:Object
            },
            creatorData:{},
            withdrawalsList:{}
        },
        components:{
            chooseServer:require('./choose-server').default,
            pageDialog:require('@/components/page-dialog.vue').default,
            requestButton:require('@/global-components/request-button').default
        }
    }
</script>
