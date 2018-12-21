<template>
    <div class="p-buying-management">
        <page-dialog :title="action.title"
                     size="small" @open="open"
                     v-model="visible"
                     :close-on-click-modal="false">
            <el-form :model="editData" :rules="rules" ref="editForm" label-width="200px">
                <el-form-item label="平台：" required prop="channel_id">
                    <select-remote class="width-super"
                                   v-model="editData.channel_id"
                                   :remote="channel_remote">
                    </select-remote>
                </el-form-item>
                <el-form-item label="注册邮箱：" required prop="email">
                    <el-input class="width-super"
                              @blur="copy_email"
                              v-model="editData.email">
                    </el-input>
                </el-form-item>
                <el-form-item label="邮箱密码：" required prop="email_password">
                    <el-col :span="col11">
                        <el-input v-model="editData.email_password"
                                  ref="email"
                                  type="password">
                        </el-input>
                    </el-col>
                    <el-button type="primary"
                               size="mini"
                               class="ml-sm"
                               @mouseup.native="backPassword('email')"
                               @mousedown.native="lookPassword('email')"
                               @click="viewPassword('email')">显示密码
                    </el-button>
                </el-form-item>
                <el-form-item label="登录用户名：" required prop="username">
                    <el-input class="width-super"
                              ref="username"
                              v-model="editData.username">
                    </el-input>
                </el-form-item>
                <el-form-item label="登录密码：" required prop="password">
                    <el-col :span="col11">
                        <el-input type="password"
                                  v-model="editData.password">
                        </el-input>
                    </el-col>
                    <el-button type="primary"
                               size="mini"
                               class="ml-sm"
                               @mouseup.native="backPassword('login')"
                               @mousedown.native="lookPassword('login')"
                               @click="viewPassword('login')">显示密码
                    </el-button>
                </el-form-item>
                <el-form-item label="服务器名称：" required prop="server_id">
                    <el-select v-model="editData.server_id"
                               placeholder="请输入/选择..."
                               filterable
                               class="width-super">
                        <el-option v-for="item in ipList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态：">
                    <el-select v-model="editData.status" class="width-super" :disabled="isAdd">
                        <el-option v-for="item in statusList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账号创建人：" required prop="account">
                    <scroll-select v-model="editData.account" class="inline width-super"
                                   textAlign="left"
                                   ref="creater"
                                   :remote="urlcreater"
                                   :fix-params="fix_params_account"
                                   :fixResult="fix_result_account">
                    </scroll-select>
                </el-form-item>
                <el-form-item label="账号创建时间：" required prop="account_create_time">
                    <el-date-picker
                            v-model="editData.account_create_time"
                            type="date"
                            placeholder="选择日期"
                            @change="rule_time"
                            class="inline width-super">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <request-button req-key="buyManagement" @click="save" :mintime="300">保存</request-button>
                <el-button @click.native="visible = false" size="mini">取消</el-button>
            </div>
        </page-dialog>
        <retype-password v-model="retype_visible"
                         :retype-data="retypeData"
                         :password-url="passwordUrl"
                         @get-password="get_password">
        </retype-password>
    </div>
</template>
<style lang="stylus">
    .p-buying-management{
        .el-form-item{
            margin-bottom: 20px !important;
        }
    }
</style>
<script>
    import {api_add_buyers, api_updata_buyers, api_get_channel} from '../../../api/buying-management';
    import {mapActions,mapGetters} from 'vuex';
    import {email} from '../../../define/validator_reg'
    export default {
        data(){
            var validateEmail = (rule, value, callback) => {
                if(!value){
                    callback(new Error('请填写邮箱'))
                } else if (!email.test(value)) {
                    callback(new Error('邮箱格式不正确'));
                } else {
                    callback();
                }
            };
            var validateAccount = (rule, value, callback) => {
                if(!value.value){
                    callback(new Error('请选择输入账号创建人'))
                } else {
                    callback();
                }
            };
            return {
                visible: false,
                newBuyer:{},
                rules: {
                    channel_id: [
                        { required: true, message: '请选择平台', trigger: 'change', type:'number', min:1 }
                    ],
                    email: [
                        { validator: validateEmail, trigger: 'blur' }
                    ],
                    email_password: [
                        { required: true, message: '请填写邮箱密码', trigger: 'blur', type:'string'}
                    ],
                    username: [
                        { required: true, message: '请填写用户名', trigger: 'blur', type:'string'}
                    ],
                    password: [
                        { required: true, message: '请填写用户密码', trigger: 'blur', type:'string'}
                    ],
                    server_id: [
                        { required: true, message: '请选择服务器名称', trigger: 'change blur', type:'number', min:1}
                    ],
                    account:[
                        { validator: validateAccount,  trigger: 'change'}
                    ],
                    account_create_time: [
                        { required: true, message: '请选择账号创建日期', trigger: 'change', type:'number'}
                    ]
                },
                urlcreater:'get|user',
                statusList:[
                    {label:'正常', value:0},
                    {label:'作废', value:1}
                ],
                col11:11,
                retype_visible:false,
                retypeData:{
                    type:'',
                    id:'',
                    password:''
                },
                passwordUrl:'get|local-buyers/password'
            }
        },
        mounted(){
        },
        methods: {
            ...mapActions({
                set_info:'server-ip/set_info'
            }),
            open(){
                if(this.isAdd){
                    this.rules.account_create_time[0].type = 'object';
                } else {
                    this.rules.account_create_time[0].type = 'number';
                }
            },
            channel_remote(callback){
                return this.$http(api_get_channel,{}).then(res=>{
                    this.channelList = [{label:"全部",value:""}, ...res];
                    callback(res);
                }).catch(code=>{
                    this.$message({message:code.message, type:'error'});
                });
            },
            init_serverList(){
                if(this.ipList.length === 0){
                    this.$http(api_get_server).then(res=>{
                        this.set_info(res.data);
                    }).catch(code=>{
                        console.log(code);
                    })
                }
            },
            save(){
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        let data = clone(this.editData);
                        delete data.id;
                        data.account_create_time = this.transferTime(this.editData, 'account_create_time');
                        data.account_creator = data.account.value;
                        delete data.account;
                        if(this.action.value === 'add'){
                            this.$http(api_add_buyers, data).then(res=>{
                                this.newBuyer = res.data;
                                this.$emit('newData', this.newBuyer);
                                this.$message({type:"success",message:res.message||res});
                                this.visible = false;
                            }).catch(code=>{
                                this.$message({type:"error",message:code.message || code});
                            }).finally(()=>{
                                this.$reqKey('buyManagement',false);
                            })
                        } else {
                            this.$http(api_updata_buyers, this.editData.id, data).then(res=>{
                                this.newBuyer = res.data;
                                this.$emit('newData', this.newBuyer);
                                this.$message({type:"success",message:res.message||res});
                                this.visible = false;
                            }).catch(code=>{
                                this.$message({type:"error",message:code.message || code});
                            }).finally(()=>{
                                this.$reqKey('buyManagement',false);
                            })
                        }
                    } else {
                        this.$message({type:"warning", message:"信息未填写完整！"});
                        return this.$reqKey('buyManagement',false);
                    }
                });
            },
            transferTime(param, timeName){
                let data = clone(param);
                if(this.action.value === 'add'){
                    if(data[timeName]){
                        data[timeName]=datef('YYYY-MM-dd', param[timeName].getTime()/1000);
                    }else {
                        data[timeName]='';
                    }
                } else {
                    if(data[timeName]){
                        data[timeName]=datef('YYYY-MM-dd', param[timeName]/1000);
                    }else {
                        data[timeName]='';
                    }
                }
                return data[timeName];
            },
            //账号参数
            fix_params_account({page,pageSize,keyword}){
                return {
                    page:page,
                    pageSize:pageSize,
                    snText:keyword||"",
                    snType:"realname"
                };
            },
            //账号结果
            fix_result_account(res){
                console.log(res);
                return {
                    options: res.data.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    }),
                    page: res.page,
                    count: res.count,
                }
            },
            //当日期变化时改变日期的rules
            rule_time(){
                if(typeof this.editData.account_create_time === 'number'){
                    this.rules.account_create_time[0].type = 'number';
                } else {
                    this.rules.account_create_time[0].type = 'object';
                }
            },
            backPassword(type){
                if(this.action.value === 'add') {
                    this.$refs[type].$refs.input.type = 'password';
                }
            },
            viewPassword(type){
                if(!this.isAdd){
                    this.retypeData = {
                        id: this.editData.id,
                        type:type
                    };
                    this.retype_visible = true;
                }
            },
            get_password(password, type){
                this.$refs[type].$refs.input.type = 'text';
                if(type === 'login'){
                    this.editData.password = password;
                } else {
                    this.editData.email_password = password;
                }
            },
            lookPassword(type){
                if(this.action.value === 'add'){
                    this.$refs[type].$refs.input.type = 'text';
                }
            },
            copy_email(){
                if(this.editData.email){
                    this.editData.username = window.clone(this.editData.email);
                }
            }
        },
        computed: {
            ...mapGetters({
                'ipList':'server-ip/ipList'
            }),
            isAdd(){
                return this.action.value === 'add';
            },
        },
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                this.visible = val;
            },
        },
        props: {
            value:{},
            action:{},
            editData:{},
            searchData:{}
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            labelItem:require('../../../components/label-item.vue').default,
            selectRemote:require('../../../components/select-remote.vue').default,
            scrollSelect:require('../../../components/scroll-select.vue').default,
            requestButton:require('../../../global-components/request-button.vue').default,
            retypePassword:require('../../base/account-information/retype-password.vue').default
        },
    }
</script>
