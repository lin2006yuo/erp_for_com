<template>
    <div>
        <page-dialog :title="action.title"
                     @open="open"
                     v-model="visible"
                     size="large"
                     class="p-account-information"
                     :close-on-click-modal="false">
            <div>
                <el-form label-width="200px" :rules="rules" :model="editData" ref="editForm">
                    <div class="account-title">基本资料</div>
                    <el-form-item label="平台：" required prop="channel_id">
                        <select-remote v-model="editData.channel_id"
                                       @load="load"
                                       :all="false"
                                       :remote="channel_remote">
                        </select-remote>
                    </el-form-item>
                    <el-form-item label="站点：" :required="isRequired" prop="site_code">
                        <el-col :span="col11">
                            <el-select :disabled="siteOptions.length<=1"
                                       filterable clearable multiple
                                       :placeholder="sitePlaceholder"
                                       v-model="editData.site_code">
                                <el-option v-for="item in siteOptions"
                                           :label="item.label"
                                           :value="item.value"
                                           :key="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="账号全称：" required prop="account_name">
                        <el-col :span="col11">
                            <el-input type="text" v-model="editData.account_name"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="账号密码：" required prop="password">
                        <!--<el-col :span="col11">-->
                        <el-input type="password"
                                  ref="account"
                                  class="inline"
                                  v-model="editData.password"
                                  :disabled="!isAdd && isShowPassword">
                        </el-input>
                        <img src="../../../assets/eye.svg"
                             alt=""
                             v-if="isAdd"
                             @mouseup="backPassword('account')"
                             @mousedown="lookPassword('account')"
                             style="vertical-align: middle;width: 20px;height: 20px;">
                        <el-button type="primary"
                                   size="mini"
                                   class="ml-sm"
                                   v-if="!isAdd"
                                   @click="viewPassword('account')">显示密码
                        </el-button>
                        <!--</el-col>-->
                    </el-form-item>
                    <el-form-item label="账号简称：" required prop="account_code">
                        <el-col :span="col11">
                            <el-input type="text"
                                      v-model="editData.account_code">
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="服务器IP地址：" required>
                        <!--<scroll-select v-model="serverIp" style="width:200px" class="inline"-->
                                       <!--textAlign="left"-->
                                       <!--ref="ip"-->
                                       <!--:remote="urlip"-->
                                       <!--:fix-params="fix_params_ip"-->
                                       <!--:fixResult="fix_result_ip">-->
                        <!--</scroll-select>-->
                        <el-input class="inline" v-model="serverIp" :disabled="true"></el-input>
                        <el-button type="primary" size="mini" class="inline ml-sm" @click.native="dialogShow = true">选择服务器</el-button>
                        <div v-if="editData.channel_id !== 0 && alreadyBind.length > 0 && !isAdd">
                            <span>该服务器已绑定{{channelName}}账号：</span>
                            <span v-for="(item, index) in alreadyBind"
                                  :key="index"
                                  class="mr-xs error">
                                {{item.account_code}}
                            </span>
                        </div>
                    </el-form-item>
                    <el-form-item label="手机号：" required prop="phone">
                        <el-col :span="col11">
                            <el-input v-model="editData.phone"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="注册邮箱：" required prop="email">
                        <el-col :span="col11">
                            <el-input v-model="editData.email"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="邮箱密码：" required prop="email_password">
                        <!--<el-col :span="col11">-->
                        <el-input v-model="editData.email_password"
                                  ref="email"
                                  type="password"
                                  class="inline"
                                  :disabled="!isAdd && isShowEmailPassword">
                        </el-input>
                        <span @mouseup="backPassword('email')"
                              @mousedown="lookPassword('email')">
                                <img src="../../../assets/eye.svg"
                                     alt=""
                                     v-if="isAdd"
                                     style="vertical-align: middle;width: 20px;height: 20px;">
                            </span>
                        <el-button type="primary"
                                   size="mini"
                                   v-if="!isAdd"
                                   class="ml-sm"
                                   @click="viewPassword('email')">显示密码
                        </el-button>
                        <!--</el-col>-->
                    </el-form-item>
                    <!--邮件设置-->
                    <div class="account-title">邮件设置</div>
                    <el-form-item label="邮件服务器地址：">
                        <el-col :span="col11">
                            <el-select v-model="editData.email_server_id">
                                <el-option v-for="item in emailServer"
                                           :key="item.value"
                                           :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4">
                            <div  style="font-size:1.4rem">
                                <i class="el-icon-plus ml-sm" @click="add_email_server"></i>
                                <i class="el-icon-edit ml-sm" @click="edit_email_server"></i>
                                <i class="el-icon-delete ml-sm" @click="delete_email_server"></i>
                            </div>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="接收邮件：">
                        <el-radio v-model="editData.email_allowed_receive" :label="1">启用</el-radio>
                        <el-radio v-model="editData.email_allowed_receive" :label="0">停用</el-radio>
                    </el-form-item>
                    <el-form-item label="发送邮件：">
                        <el-radio v-model="editData.email_allowed_send" :label="1">启用</el-radio>
                        <el-radio v-model="editData.email_allowed_send" :label="0">停用</el-radio>
                    </el-form-item>

                    <!--公司资料-->
                    <div class="account-title">公司资料</div>
                    <el-form-item label="公司名称：" required prop="company">
                        <el-col :span="col11">
                            <el-input type="text" v-model="editData.company"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="公司注册号：" prop="company_registration_number">
                        <el-col :span="col11">
                            <el-input type="text"
                                      v-model="editData.company_registration_number"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="公司法人：">
                        <el-col :span="col11">
                            <el-input type="text" v-model="editData.corporation"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="法人身份证号：" prop="corporation_identification">
                        <el-col :span="col11">
                            <el-input type="text"
                                      v-model="editData.corporation_identification"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="收款账号：">
                        <el-col :span="col11" class="more-select">
                            <el-input type="text"
                                      v-model="editData.collection_account[0]"
                                      v-if="!isEbay">
                            </el-input>
                            <el-select :class="{inputNomargin: editData.collection_account.length > 0}"
                                       v-model="editData.collection_account"
                                       multiple filterable
                                       v-if="isEbay"
                                       placeholder="请选择/可以多选">
                                <el-option
                                        v-for="item in paypalOption"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="VAT：">
                        <el-col :span="col11">
                            <el-input type="text" v-model="editData.vat">
                                <span slot="append">%</span>
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="公司成立时间：">
                        <el-date-picker
                                v-model="editData.company_time"
                                type="date"
                                placeholder="选择日期"
                                class="inline date">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="公司注册地址：">
                        <el-col :span="col11">
                            <el-input type="textarea" v-model="editData.company_address"></el-input>
                        </el-col>
                    </el-form-item>
                    <!--账号创建人-->
                    <div class="account-title">账号创建人</div>
                    <el-form-item label="账号创建人：" required prop="account_creator">
                        <scroll-select v-model="accounts" style="width:158px" class="inline"
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
                                class="inline date">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="当前账号状态：">
                        <el-radio-group v-model="editData.status" disabled>
                            <el-radio v-for="item in statusOption"
                                      :key="item.status"
                                      :label="item.status">
                                {{item.remark}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <request-button req-key="sureKey" @click="sure">确定</request-button>
                <el-button @click.native="visible = false" size="mini">取消</el-button>
            </div>
        </page-dialog>
        <retype-password v-model="retype_visible"
                         :retype-data="retypeData"
                         :password-url="passwordUrl"
                         @get-password="get_password">
        </retype-password>
        <add-email-server v-model="emailServerDialog"
                          :cur-page="curPage"
                          :id="emailServerId"
                          @update="update_email_server"
                          @submit='submit_email_server'></add-email-server>
        <choose-server v-model="dialogShow" @choose-server="choose_server"></choose-server>
    </div>
</template>
<style lang="stylus">
    .p-account-information{
        .dialog__body{
            /*max-height:770px !important;*/
        }
        .el-form-item{
            margin-bottom: 5px;
        }
        .account-title{
            height: 20px;
            line-height: 20px;
            margin-bottom: 6px;
            padding: 0 10px;
            box-shadow: 0 2px 4px 0 rgba(0,0,0,0.12);
        }
        .inputNomargin {
            .el-select__input {
                width: 1px !important;
                margin-left: 0 !important;
            }
        }
        .more-select{
            .el-select__tags {
                height: 30px !important;
                max-width: 359px !important;
                overflow-y: auto;
                overflow-x: hidden;
            }
        }
        .el-form-item__error{
            position: static;
            display: inline-block;
            line-height: 26px;
            margin-left: 10px;
        }
        .el-select__tags{
            height: 50px!important;
            max-width: 359px!important;
            overflow-y: auto;
            >span{
                white-space: inherit;
            }
        }
    }
</style>
<script>
    import {api_get_channel, api_account_list,api_email_server,api_delete_email_server} from  '../../../api/report-channel';
    import {api_add_account, api_updata_account, api_get_account_status, api_get, api_get_already} from '../../../api/account-information'
    import {email,chinese} from '../../../define/validator_reg'
    import {mapActions,mapGetters} from 'vuex';
    export default {
        data(){
            var checkEmail = (rule, value, callback) => {
                if(!value){
                    callback(new Error('请输入邮箱'));
                } else if (!email.test(value)) {
                    callback(new Error('请输入正确的邮箱'));
                } else {
                    callback();
                }
            };
            let checkChinese = (rule,value,callback)=>{
                if(value){
                    return chinese.test(value)?callback(new Error("不允许出现中文！")):callback();
                }else{
                    callback();
                }
            };
            return {
                rules: {
                    channel_id: [
                        { required: true, message: '请选择平台', trigger: 'change', type:'number', min:1 }
                    ],
                    site_code: [
                        { required: this.isRequired, message: '请选择站点', trigger: 'change', type:'array'}
                    ],
                    account_code: [
                        { required: true, message: '请填写账号简称', trigger: 'blur'}
                    ],
                    account_name: [
                        { required: true, message: '请填写账号全称', trigger: 'blur'}
                    ],
                    password: [
                        { required: true, message: '请填写账号密码', trigger: 'blur'}
                    ],
                    phone: [
                        { required: true, message: '请填写手机号码', trigger: 'blur'}
                    ],
                    email: [
                        { validator: checkEmail, required: true, trigger: 'blur'}
                    ],
                    company_registration_number: [
                        { validator: checkChinese, trigger: 'blur'}
                    ],
                    corporation_identification: [
                        { validator: checkChinese, trigger: 'blur'}
                    ],
                    email_password: [
                        { required: true, message: '请填写邮箱密码', trigger: 'blur'}
                    ],
                    company: [
                        { required: true, message: '请填写公司名称', trigger: 'blur'}
                    ],
                    account_creator: [
                        { required: true, message: '请选择账号创建人', trigger: 'change', type:'number'}
                    ],
                    account_create_time: [
                        { required: true, message: '请选择账号创建日期', trigger: 'change', type:'number'}
                    ]
                },
                col11:11,
                channelList:[],
                channelName:'',
                siteOptions:[],
                statusOption:[],
                paypalOption:[],
                visible: false,
                retype_visible:false,
                retypeData:{
                    type:'',
                    account_id:'',
                    password:''
                },
                urlcreater:'get|user',
                urlip:'get|servers',
                passwordUrl:'get|account-basics/password',
                isShowEmailPassword:true,
                isShowPassword:true,
                oldPassword:'',
                oldEmailPassword:'',
                alreadyBind:[],
                emailServer:[],
                emailServerDialog:false,
                curPage:'',
                emailServerId:0,
                dialogShow: false
            }
        },
        mounted(){
            this.get_status();
            this.get_paypal();
            this.get_email_server();
        },
        methods: {
            submit_email_server(data){
                let newData = {
                    label:data.imap_url,
                    value:data.id
                };
                this.emailServer.push(newData);
                this.editData.email_server_id = newData.value
            },
            update_email_server(data,id){
                let find = this.emailServer.find(row=>row.value===Number(id));
                if(find)find.label = data.imap_url;
            },
            add_email_server(){
                this.emailServerDialog = true;
                this.curPage = 'add'
            },
            edit_email_server(){
                this.emailServerId = this.editData.email_server_id;
                if(!this.emailServerId)return this.$message({type:'warning',message:'请先选择一个邮件服务器地址'});
                this.emailServerDialog = true;
                this.curPage = 'edit';
            },
            delete_email_server(){
                if(!this.editData.email_server_id)return this.$message({type:'warning',message:'请先选择一个邮件服务器地址'});
                this.$confirm('此操作将删除当前', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_email_server,this.editData.email_server_id,this.editData.id||0).then(res => {
                        this.$message({type:'success',message:res.message||res})
                        let index = this.emailServer.findIndex(row=>row.value===this.editData.email_server_id);
                        if(index>-1){
                            this.emailServer.splice(index,1);
                            this.editData.email_server_id = '';
                        }

                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code});
                        console.log(code);
                    })
                }).catch(() => {

                });
                console.log(this.editData.email_server_id,'this.editData.email_server_id');
            },
            get_email_server(){
                this.$http(api_email_server,{page:1,pageSize:999999999}).then(res => {
                    this.emailServer = res.data.map(row=>{
                        return {
                            value:row.id,
                            label:row.imap_url
                        }
                    });
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
            },
            open(){
                if(this.isAdd){
                    this.rules.account_create_time[0].type = 'object';
                }else {
                    this.rules.account_create_time[0].type = 'number';
                }
                this.isShowPassword = true;
                this.isShowEmailPassword = true;
                this.oldPassword = window.clone(this.editData.password);
                this.oldEmailPassword = window.clone(this.editData.email_password);
            },
            channel_remote(callback){
                return this.$http(api_get_channel,{}).then(res=>{
                    callback(res);
                }).catch(code=>{
                    console.log(code);
                });
            },
            load(list){
                this.channelList = list;
            },
            site_remote(){
                if(!channel_id)return this.siteOptions = [];
                return this.$http(api_get_channel_categories,{}).then(res=>{
                    return Promise.resolve(res.map(cate=>{
                        return {label:cate.name,value:cate.id};
                    }));
                }).catch(code=>{
                    console.log(code);
                });
            },
            get_site(channel_id){
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    if(res.site.length<=0){
                        this.siteOptions = [{label:"",value:""}]
                    }else{
                        this.siteOptions = [...res.site];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_account(channel_id,site_code){
                if(!channel_id||!site_code)return this.accoutOptions = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:channel_id,site_code:site_code}).then(res=>{
                    if(res.account.length>0){
                        res = res.account;
                        this.accoutOptions = [{label:"全部",value:""},...res];
                    }else{
                        this.accoutOptions = [{label:"",value:""}];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_status(){
                this.$http(api_get_account_status).then(res=>{
                    this.statusOption = res;
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_paypal(){
                let param = {
                    page: 1,
                    pageSize: 1000,
                    is_invalid:0,
                    snType:'account_name',
                    snDate:'create_date'
                };
                this.$http(api_get, param).then(res=>{
                    this.paypalOption = res.data.map(row=>{
                        return {
                            label:row.account_name,
                            value:row.id
                        }
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
            lookPassword(type){
                if(this.action.value === 'add'){
                    this.$refs[type].$refs.input.type = 'text';
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
                        account_id: this.editData.id,
                        type:type
                    };
                    this.retype_visible = true;
                }
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
            // fix_params_ip({page,pageSize,keyword}){
            //     return {
            //         page:page,
            //         pageSize:pageSize,
            //         name:keyword||"",
            //     };
            // },
            // fix_result_ip(res){
            //     return {
            //         options: res.data.map(row => {
            //             return {
            //                 label:`${row.ip}(${row.name})`,
            //                 value: row.id
            //             }
            //         }),
            //         page: res.page,
            //         count: res.count,
            //     }
            // },
            //当日期变化时改变日期的rules
            rule_time(){
                if(typeof this.editData.account_create_time === 'number'){
                    this.rules.account_create_time[0].type = 'number';
                } else {
                    this.rules.account_create_time[0].type = 'object';
                }
            },
            sure(){
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        let data = clone(this.editData);
                        this.editData.site_code.length>0?(data.site_code = data.site_code.join(',')):(data.site_code = '');
                        delete data.id;
                        data.company_time = this.transferTime(this.editData, 'company_time');
                        data.account_create_time = this.transferTime(this.editData, 'account_create_time');
                        if(this.action.value === 'add'){
                            this.$http(api_add_account, data).then(res=>{
                                this.$emit('submit',res);
                                this.$message({type:"success",message:res.message||res});
                                this.visible = false;
                            }).catch(code=>{
                                this.$message({type:"error",message:code.message || code});
                            }).finally(()=>{
                                setTimeout(() => {
                                    this.$reqKey('sureKey', false);
                                }, 300)
                            })
                        } else {
                            if(data.password === this.oldPassword){
                                delete data.password;
                            }
                            if(data.email_password === this.oldEmailPassword){
                                delete data.email_password;
                            }
                            this.$http(api_updata_account, this.editData.id, data).then(res=>{
                                this.$emit('submit',res,this.editData.id);
                                this.$message({type:"success",message:res.message||res});
                                this.visible = false;
                            }).catch(code=>{
                                this.$message({type:"error",message:code.message || code});
                            }).finally(()=>{
                                setTimeout(() => {
                                    this.$reqKey('sureKey', false);
                                }, 300)
                            })
                        }
                    } else {
                        this.$reqKey('sureKey',false);
                        this.$message({type:"error", message:"信息未填写完整！"});
                    }
                });
            },
            //选择服务器
            choose_server(obj){
                this.$emit('choose-server',obj.ip);
                this.editData.server_id = obj.id;
            },
            get_password(password, type){
                this.$refs[type].$refs.input.type = 'text';
                if(type === 'account'){
                    this.isShowPassword = false;
                    this.editData.password = password;
                } else {
                    this.isShowEmailPassword = false;
                    this.editData.email_password = password;
                }
            },
            get_alreadyBind(){
                if(!!this.editData.server_id && this.editData.channel_id !== 0){
                    let data = {
                        channel_id:this.editData.channel_id,
                        server_id:this.editData.server_id
                    };
                    this.$http(api_get_already, data).then(res=>{
                        this.alreadyBind = res;
                        this.channelList.find(row=>{
                            if(row.value === this.editData.channel_id){
                                this.channelName = row.label;
                            }
                        })
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    })
                }
            }
        },
        computed: {
            isRequired(){
                return  this.editData.channel_id===1||this.editData.channel_id===2
            },
            sitePlaceholder(){
                if(this.editData.channel_id<=0){
                    return "请先选择平台";
                }else if(this.siteOptions.length<=1){
                    return "该平台下暂无站点";
                }else{
                    return "请选择/可以多选"
                }
            },
            isEbay(){
                if(!this.editData.collection_account){
                    this.editData.collection_account[0] = '';
                }
                return this.editData.channel_id === 1;
            },
            isAdd(){
                return this.action.value === 'add';
            },
            accounts:{
                get(){
                    return {label:this.editData.account_creator_name,
                        value:this.editData.account_creator}
                },
                set(val){
                    this.editData.account_creator_name = val.label;
                    this.editData.account_creator = val.value;
                }
            },
            // serverIp:{
            //     get(){
            //         return {label:this.editData.server_name,
            //             value:this.editData.server_id}
            //     },
            //     set(val){
            //         this.editData.server_name = val.label;
            //         this.editData.server_id = val.value;
            //     }
            // }
        },
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                this.visible = val;
            },
            "editData.channel_id"(val){
                this.siteOptions = [];
                if(val===1||val===2){
                    this.get_site(val);
                }else{
                    this.editData.site_code = [];
                }
                this.get_alreadyBind();
            },
            'editData.site_code'(val){
                this.get_account(this.editData.channel_id,val);
            },
            'editData.server_id'(val){
                this.get_alreadyBind();
            }
        },
        props: {
            value:{},
            action:{},
            editData:{},
            searchData:{},
            serverIp:{}
        },
        components: {
            pageDialog:require("../../../components/page-dialog.vue").default,
            selectRemote:require('../../../components/select-remote.vue').default,
            retypePassword:require('./retype-password.vue').default,
            scrollSelect:require('../../../components/scroll-select.vue').default,
            requestButton:require('../../../global-components/request-button').default,
            addEmailServer:require('./add-email-server.vue').default,
            chooseServer:require('./choose-server').default
        },
    }
</script>
