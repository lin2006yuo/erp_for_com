<template>
    <div>
        <page-dialog :title="action.title"
                     @open="open"
                     v-model="visible"
                     size="large"
                     class="p-account-information"
                     :close-on-click-modal="false">
            <el-form label-width="200px" :rules="rules" :model="editData" ref="editForm">
                <div class="account-title">基本资料</div>
                <el-form-item label="平台：" required prop="channel_id">
                    <select-remote v-model="editData.channel_id"
                                   @load="load"
                                   :all="false"
                                   :disabled="action.value==='edit'"
                                   @change="change_channel"
                                   :remote="channel_remote"
                                   @clears="clear">
                    </select-remote>
                </el-form-item>
                <el-form-item label="站点：" :required="isRequired" prop="site_code">
                    <el-col :span="col11">
                        <el-select :disabled="!siteOptions.length"
                                   filterable clearable multiple
                                   placeholder="请选择/可以多选"
                                   v-model="editData.site_code">
                            <el-option v-for="item in siteOptions"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="店铺名称：">
                    <el-col :span="col11">
                        <el-input :disabled="action.value==='edit'&&editData.currentStatus==='已作废'" v-model="editData.shop_name"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="主账号全称：" prop="account_name" required>
                    <el-col :span="col11">
                        <el-input type="text" v-model="editData.account_name" :disabled="action.value==='edit'"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="主账号密码：" prop="password" required>
                    <el-col :span="col11">
                        <el-input type="password"
                                  ref="account"
                                  v-model="editData.password"
                                  :disabled="!isAdd&&isShowPassword">
                        </el-input>
                    </el-col>
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
                               :disabled="accountDisabled||action.value==='edit'&&editData.currentStatus==='已作废'"
                               @click="viewPassword('account')">显示密码
                    </el-button>
                </el-form-item>
                <el-form-item label="子账号全称：">
                    <el-col :span="col11">
                        <el-input :disabled="action.value==='edit'&&editData.currentStatus==='已作废'" v-model="editData.account_name_minor"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="子账号密码：">
                    <el-col :span="col11">
                        <el-input type="password"
                                  ref="account_minor"
                                  v-model="editData.password_minor"
                                  :disabled="!isAdd && isShowMinorPassword">
                        </el-input>
                    </el-col>
                    <img src="../../../assets/eye.svg"
                         alt=""
                         v-if="isAdd"
                         @mouseup="backPassword('account_minor')"
                         @mousedown="lookPassword('account_minor')"
                         style="vertical-align: middle;width: 20px;height: 20px;">
                    <el-button type="primary"
                               size="mini"
                               class="ml-sm"
                               v-if="!isAdd"
                               :disabled="minorAccountDisabled||action.value==='edit'&&editData.currentStatus==='已作废'"
                               @click="viewPassword('account_minor')">显示密码
                    </el-button>
                </el-form-item>

                <el-form-item label="账号简称：" required prop="account_code">
                    <el-col :span="col11">
                        <el-input :disabled="action.value==='edit'&&editData.currentStatus==='已作废'"
                                  v-model="editData.account_code">
                        </el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="服务器IP地址：" required>
                    <el-input class="inline" v-model="serverIp" :disabled="true"></el-input>
                    <el-button type="primary" size="mini" class="ml-sm" :disabled="action.value==='edit'&&editData.currentStatus==='已作废'" @click.native="dialogShow = true">选择服务器</el-button>
                    <div v-if="editData.channel_id !== 0 && alreadyBind.length > 0 && !isAdd">
                        <span>该服务器已绑定{{channelName}}账号：</span>
                        <div v-for="(item, index) in alreadyBind"
                             :key="index"
                             class="mr-xs error inline">
                            {{item.account_code}}
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="服务器类型：">
                    <el-col :span="col11">
                        <el-select v-model="editData.server_type" :disabled="true">
                            <el-option v-for="item in serverType"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value"
                                       style="width: 100%">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="手机号：" required prop="phone">
                    <el-col :span="col11">
                        <el-input v-model="editData.phone" :disabled="true"></el-input>
                    </el-col>
                    <el-button type="primary" size="mini" class="ml-sm" :disabled="action.value==='edit'&&editData.currentStatus==='已作废'" @click.native="select_phone_email('手机号')">选择手机号</el-button>
                    <div v-if="action.value!=='add'&&hasBindPhone.length">
                        <span>该账号绑定过的历史手机号：</span>
                        <div v-for="(item, index) in hasBindPhone"
                             :key="index"
                             class="mr-xs error inline ">{{item}}</div>
                    </div>
                </el-form-item>
                <el-form-item label="邮箱：" required prop="email">
                    <el-col :span="col11">
                        <el-input v-model="editData.email" :disabled="true"></el-input>
                    </el-col>
                    <el-button type="primary" size="mini"
                               class="ml-sm" :disabled="editData.channel_id===''||(action.value==='edit'&&editData.currentStatus==='已作废')"
                               @click.native="select_phone_email('邮箱',editData.channel_id)" >选择邮箱</el-button>
                </el-form-item>
                <!--公司资料-->
                <div class="account-title">公司资料</div>
                <el-form-item label="公司类型：" required prop="type">
                    <el-col :span="col11">
                        <el-select v-model="editData.type"
                                   filterable
                                   @change="get_company_name"
                                   :disabled="action.value==='edit'&&editData.currentStatus==='已作废'"
                                   placeholder="请选择">
                            <el-option v-for="item in types"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="公司名称：" required prop="company_id">
                    <el-col :span="col11">
                        <el-select v-model="editData.company_id"
                                   :disabled="(action.value==='add'&&(!editData.channel_id||editData.type===''))||(action.value==='edit'&&editData.currentStatus==='已作废')"
                                   filterable clearable
                                   :placeholder="placeHolder"
                                   @change="get_company_data"
                                   @clear="clear_company">
                            <el-option v-for="item in companyData"
                                       style="width:400px;"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-button type="primary" size="mini" class="ml-sm inline"
                               :disabled="!editData.channel_id||(action.value==='edit'&&editData.currentStatus==='已作废')" @click.native="add_company">新增
                    </el-button>
                </el-form-item>
                <el-form-item label="公司注册号：" prop="company_registration_number">
                    <el-col :span="col11">
                        <el-input :disabled="true"
                                  v-model="editData.company_registration_number"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="公司法人：">
                    <el-col :span="col11">
                        <el-input :disabled="true" v-model="editData.corporation"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="法人身份证号：" prop="corporation_identification">
                    <el-col :span="col11">
                        <el-input :disabled="true"
                                  v-model="editData.corporation_identification"></el-input>
                    </el-col>
                </el-form-item>
                <!--<el-form-item label="VAT：">-->
                    <!--<el-col :span="col11">-->
                        <!--<el-input :disabled="true" v-model="editData.vat">-->
                            <!--<span slot="append">%</span>-->
                        <!--</el-input>-->
                    <!--</el-col>-->
                <!--</el-form-item>-->
                <el-form-item label="公司成立时间：">
                    <el-date-picker :disabled="true"
                                    v-model="editData.company_time"
                                    type="date"
                                    placeholder="选择日期"
                                    class="inline date">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="公司注册地址：">
                    <el-col :span="col11">
                        <el-input :disabled="true"
                                  type="textarea"
                                  v-model="editData.company_address"></el-input>
                    </el-col>
                </el-form-item>
                <el-row class="account-title">账号信息</el-row>
                <el-form-item label="信用卡：">
                    <el-col :span="col11">
                        <el-input v-model="editData.credit_card" :disabled="action.value==='edit'&&editData.currentStatus==='已作废'"></el-input>
                    </el-col>
                </el-form-item>
                <el-row v-for="(row,index) in editData.collection_msg" :key="index">
                    <el-form-item :label="`收款账号${index!==0?index:''}：`">
                        <el-col :span="col11">
                            <el-input v-model.trim="row.collection_account" :disabled="action.value==='edit'&&editData.currentStatus==='已作废'"></el-input>
                        </el-col>
                        <el-button type="primary" size="mini" class="ml-sm inline"
                                   :disabled="action.value==='edit'&&editData.currentStatus==='已作废'"
                                   v-if="index===0" @click.native="add">新增
                        </el-button>
                        <span v-else style="font-size: 20px;"
                              @click="del(row,index)"><i class="el-icon-delete"></i></span>
                    </el-form-item>
                    <el-form-item :label="`收款账号平台${index!==0?index:''}：`">
                        <el-col :span="col11">
                            <el-input v-model.trim="row.collection_type" :disabled="action.value==='edit'&&editData.currentStatus==='已作废'"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item :label="`收款账号邮箱${index!==0?index:''}：`">
                        <el-col :span="col11">
                            <el-input v-model.trim="row.collection_email" :disabled="action.value==='edit'&&editData.currentStatus==='已作废'"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item :label="`收款方${index!==0?index:''}：`">
                        <el-col :span="col11">
                            <el-input v-model.trim="row.collection_user" :disabled="action.value==='edit'&&editData.currentStatus==='已作废'"></el-input>
                        </el-col>
                    </el-form-item>
                </el-row>
                <!--账号创建人-->
                <div class="account-title">账号创建人</div>
                <el-form-item label="账号创建人：" required prop="account_creator">
                    <scroll-select v-model="accounts" style="width:158px" class="inline"
                                   textAlign="left"
                                   ref="creater"
                                   :remote="urlcreater"
                                   :fix-params="fix_params_account"
                                   :fixResult="fix_result_account"
                                   :disabled="action.value==='edit'">
                    </scroll-select>
                </el-form-item>
                <el-form-item label="账号创建时间：" required prop="account_create_time">
                    <el-date-picker
                            v-model="editData.account_create_time"
                            type="date"
                            :disabled="action.value==='edit'"
                            placeholder="选择日期"
                            class="inline date"
                            :picker-options="finishTime">
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
            <div slot="footer">
                <request-button req-key="sureKey" @click="sure" :disabled="action.value==='edit'&&editData.currentStatus==='已作废'">确定</request-button>
                <el-button @click.native="visible = false" size="mini">取消</el-button>
            </div>
        </page-dialog>
        <retype-password v-model="retype_visible"
                         :retype-data="retypeData"
                         :password-url="passwordUrl"
                         @get-password="get_password">
        </retype-password>
        <!--<add-email-server v-model="emailServerDialog"-->
        <!--:cur-page="curPage"-->
        <!--:id="emailServerId"-->
        <!--@update="update_email_server"-->
        <!--@submit='submit_email_server'></add-email-server>-->
        <choose-server v-model="dialogShow" @choose-server="choose_server"></choose-server>
        <add-look-edit v-model="addCompanyShow" :title="title"
                       :flag="0" :id="0" :form="form" @refresh="refresh_company_data">
        </add-look-edit>
        <select-phone-email
                v-model="selectPhoneShow"
                :title="selectPhoneTitle"
                :search="selectPhoneSearch"
                :table-data="selectPhoneData"
                :count="total"
                @current-search="current_search"
                @change-size="change_size"
                @change-page="change_page"
                @submit="acquire_phone_email">
        </select-phone-email>
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
    import {api_get_channel, api_account_list,api_email_server,api_delete_email_server} from  '@/api/report-channel';
    import {api_add_account, api_updata_account, api_get_account_status, api_get,
        api_get_already,api_get_company_name,api_get_company_data,api_get_has_bind_phone} from '@/api/account-information'
    import {email,chinese} from '../../../define/validator_reg'
    import {mapActions,mapGetters} from 'vuex';
    import addLookEdit from '@/view/base/company-information/add-look-edit';
    import datef from 'datef';
    import selectPhoneEmail from '@/view/base/account-apply/select-phone-email';
    import {init_phone_email} from '@/view/base/account-apply/common';
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
                    channel_id:[{required:true,message:'请选择平台',trigger:'change',type:'number',min:1}],
                    site_code:[{required:this.isRequired,message:'请选择站点',trigger:'change',type:'array'}],
                    account_code:[{ required:true,message:'请填写账号简称',trigger:'blur'}],
                    account_name:[{required:true,message:'请填写账号全称',trigger:'blur'}],
                    password:[{required:true,message:'请填写账号密码',trigger:'blur'}],
                    phone:[{required:true,message:'请填写手机号码',trigger:'blur'}],
                    email: [{validator:checkEmail,required:true,trigger:'blur'}],
                    company_registration_number:[{validator:checkChinese,trigger:'blur'}],
                    corporation_identification:[{validator:checkChinese,trigger:'blur'}],
                    email_password:[{required:true,message:'请填写邮箱密码',trigger:'blur'}],
                    company_id:[{required:true,message:'请填写公司名称',trigger:'change',type:'number'}],
                    account_creator:[{required:true,message:'请选择账号创建人',trigger:'change',type:'number'}],
                    account_create_time:[{required:true,message:'请选择账号创建日期',trigger:'change',}]
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
                isShowMinorPassword:true,
                oldPassword:'',
                oldEmailPassword:'',
                alreadyBind:[],
                emailServer:[],
                // emailServerDialog:false,
                // curPage:'',
                // emailServerId:0,
                dialogShow: false,
                companyData:[],
                addCompanyShow:false,
                title:'添加公司资料',
                form:{},
                tempChannel:0,
                isAddCompany:false,
                tempServerIpId:this.serverIpId,
                accountDisabled:false,
                minorAccountDisabled:false,
                emailDisabled:false,
                finishTime:{
                    disabledDate: (time)=> {
                        return time.getTime()>Date.now();
                    }
                },
                types:[
                    {label:'企业',value:0},
                    {label:'个人',value:1}
                ],
                selectPhoneShow:false,
                selectPhoneTitle:'',
                selectPhoneSearch:{
                    value:'',
                    page:1,
                    pageSize:20
                },
                selectPhoneData:[],
                total:0,
                hasBindPhone:[],
                serverType:[
                    {label:'虚拟机', value:0},
                    {label:'云服务', value:1},
                    {label:'超级浏览器', value:2},
                    {label:'代理', value:3},
                ],
            }
        },
        mounted(){
            this.get_status();
            this.get_paypal();
            this.get_email_server();
        },
        methods: {
            select_phone_email(str,channel_id,boolean){
                this.selectPhoneTitle=str;
                this.selectPhoneSearch={
                    value:'',
                    page:1,
                    pageSize:20
                };
                init_phone_email(this,str,channel_id,boolean);
            },
            current_search(title){
                init_phone_email(this,title,this.editData.channel_id);
            },
            change_size(size,title){
                this.$set(this.selectPhoneSearch,'pageSize',size);
                init_phone_email(this,title,this.editData.channel_id);
            },
            change_page(page,title){
                this.$set(this.selectPhoneSearch,'page',page);
                init_phone_email(this,title,this.editData.channel_id);
            },
            acquire_phone_email(value){
                switch (this.selectPhoneTitle){
                    case '手机号':
                        this.$set(this.editData,'phone',value.phone);
                        this.$set(this.editData,'phone_id',value.id);
                        break;
                    case '邮箱':
                        this.$set(this.editData,'email',value.email);
                        this.$set(this.editData,'email_id',value.id);
                        break;
                }
                this.selectPhoneShow=false;
            },
            clear(){
                this.editData.site_code=[];
                this.editData.company_id='';
                this.clear_company();
            },
            add(){
                let obj={
                    collection_account:'',
                    collection_type:'',
                    collection_email:'',
                    collection_user:''
                };
                this.editData.collection_msg.push(obj);
            },
            del(row,index){
                this.editData.collection_msg.splice(index,1);
            },
            change_channel(channel,company){
                this.get_site(channel);
                if(this.action.value === 'add'){
                    this.select_phone_email('邮箱',channel,true);
                }
                // this.$http(api_get_company_name,{channel_id:channel}).then(res=>{
                //     this.companyData=res.data.map(row=>{
                //         return {label:row.company,value:row.id};
                //     });
                //     this.$set(this,'tempChannel',channel);
                //     let find=this.companyData.find(row=>row.label===company);
                //     if(this.isAddCompany&&company&&find){
                //         this.editData.company_id=find.value;
                //     }
                // }).catch( error =>{
                //     error&&this.$message({type:'error', message:error.message||error});
                // });
            },
            get_company_name(type,company){
                this.$http(api_get_company_name,{
                    channel_id:this.editData.channel_id,
                    type:type
                }).then(res=>{
                    this.companyData=res.data.map(row=>{
                        return {label:row.company,value:row.id};
                    });
                    let find=this.companyData.find(row=>row.label===company);
                    if(this.isAddCompany&&company&&find){
                        this.editData.company_id=find.value;
                    }
                    if(this.editData.company_id){
                        let find=this.companyData.find(row=>row.value===this.editData.company_id);
                        if(!find){
                            this.$set(this.editData,'company_id','');
                            this.clear_company();
                        }
                    }
                }).catch( error =>{
                    console.log(error);
                });
            },
            get_company_data(id){
                this.editData.company_id=id;
                if(id==='')return;
                let type={}.toString.call(id),param;
                if(type==='[object String]'){
                    let find=this.companyData.find(row=>row.label===id);
                    if(find){
                        param=find.value;
                    }else {
                        return;
                    }
                }else{
                    param=id;
                }
                this.$http(api_get_company_data,param).then(res=>{
                    this.$set(this.editData,'company_registration_number',res.company_registration_number);
                    this.$set(this.editData,'corporation',res.corporation);
                    this.$set(this.editData,'corporation_identification',res.corporation_id);
                    this.$set(this.editData,'company_registration_number',res.company_registration_number);
                    this.$set(this.editData,'vat',res.vat);
                    this.$set(this.editData,'company_time',res.company_time?res.company_time*1000:'');
                    this.$set(this.editData,'company_address',res.company_address_zip);
                    let account=(res.collection_account&&res.collection_account.length)?res.collection_account.filter(row=>row!==''):[];
                    this.$set(this.editData,'collection_account',account);
                    this.$set(this.editData,'type',res.type);
                    this.$set(this,'paypalOption',account);
                    console.log('enter?',res,this.editData);
                    // this.clear=false;
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            clear_company(){
                this.$set(this.editData,'company_registration_number','');
                this.$set(this.editData,'corporation','');
                this.$set(this.editData,'corporation_identification','');
                this.$set(this.editData,'company_registration_number','');
                this.$set(this.editData,'vat','');
                this.$set(this.editData,'company_time','');
                this.$set(this.editData,'company_address','');
                this.$set(this.editData,'collection_account',[]);
            },
            add_company(){
                this.form={
                    type:0,
                    source:'',
                    company:'',
                    charter_url:'',
                    company_registration_number:'',
                    corporation:'',
                    corporation_id:'',
                    corporation_id_front:'',
                    corporation_id_contrary:'',
                    company_time:'',
                    company_address_zip:'',
                    corporation_address_zip:'',
                    status:0,
                    channel:[],
                    id:0,
                    log:[],
                    business_term_st:'',
                    business_term_nd:'',
                    id_date_st:'',
                    id_date_nd:'',
                    open_licence:'',
                    open_bank:'',
                    open_bank_account:'',
                    open_date:'',
                    vat_data:[{vat:0,code:'',type:2}],
                    vat_attachment:[{file_name:[]}]
                };
                this.addCompanyShow=true;
                this.isAddCompany=false;
            },
            refresh_company_data(company){
                console.log(company,'test',this.tempChannel);
                this.isAddCompany=true;
                this.editData.type=company.type;
                this.change_channel(this.tempChannel);
                this.get_company_name(company.type,company.company)

            },
            // submit_email_server(data){
            //     let newData = {
            //         label:data.imap_url,
            //         value:data.id
            //     };
            //     this.emailServer.push(newData);
            //     this.editData.email_server_id = newData.value
            // },
            // update_email_server(data,id){
            //     let find = this.emailServer.find(row=>row.value===Number(id));
            //     if(find)find.label = data.imap_url;
            // },
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
                this.isShowMinorPassword=true;
                this.accountDisabled=false;
                this.minorAccountDisabled=false;
                this.emailDisabled=false;
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
            get_site(channel_id){
                this.siteOptions = [];
                if(this.action.value === 'add'){
                    this.$set(this.editData,'site_code',[]);
                }
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    console.log(res,'555');
                    this.siteOptions = [...res.site];
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_account(channel_id,site_code){
                // if(!channel_id||!site_code)return this.accoutOptions = [{label:"",value:""}];
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
                        return {label: row.realname,value: row.id}
                    }),
                    page: res.page,
                    count: res.count,
                }
            },
            sure(){
                if(this.editData.account_create_time&&this.action.value === 'add'){
                    this.editData.account_create_time=new Date(this.editData.account_create_time);
                }
                if(typeof this.editData.account_create_time!=='number'&&this.action.value === 'edit'){
                    this.editData.account_create_time=new Date(this.editData.account_create_time).getTime();
                }
                console.log(this.editData,'this.editData',this.editData.account_create_time);
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        let minorAccount1=!!this.editData.account_name_minor&&!this.editData.password_minor;
                        let minorAccount2=!this.editData.account_name_minor&&!!this.editData.password_minor;
                        console.log(minorAccount1,minorAccount2,'minorAccount1');
                        if(minorAccount1||minorAccount2){
                            return this.$message({type:'warning',message:'子账号全称和子账号密码两项中有一项未填写！ 必须两项全填或全不填'})
                        }
                        if(this.editData.account_name_minor===this.editData.account_name){
                            return this.$message({type:'warning',message:'子账号全称不可和主账号全称相同！'})
                        }
                        if(this.editData.account_create_time){
                            this.editData.account_create_time=(datef('YYYY-MM-dd',this.editData.account_create_time));
                        }
                        let mess=this.editData.collection_msg.filter(row=>{
                            let isEmpty =row.collection_account===''&&row.collection_type===''&&row.collection_email===''
                                &&row.collection_user==='';
                            return !isEmpty;
                        });
                        if(!mess.length){
                            mess=[{collection_account:'',collection_type:'',collection_email:'',collection_user:''}];
                        }
                        let param={
                            channel_id:this.editData.channel_id,
                            site_code:this.editData.site_code,
                            account_name:this.editData.account_name,
                            password:this.editData.password,
                            account_name_minor:this.editData.account_name_minor?this.editData.account_name_minor:'',
                            password_minor:this.editData.password_minor?this.editData.password_minor:'',
                            account_code:this.editData.account_code,
                            shop_name:this.editData.shop_name,
                            server_id:this.tempServerIpId,
                            phone_id:this.editData.phone_id,
                            email_id:this.editData.email_id,
                            // email_password:this.editData.email_password,
                            // email_server_id:this.editData.email_server_id,
                            // email_allowed_receive:this.editData.email_allowed_receive,
                            // email_allowed_send:this.editData.email_allowed_send,
                            company_id:this.editData.company_id,
                            account_creator:this.editData.account_creator,
                            account_create_time:this.editData.account_create_time,
                            status:this.editData.status,
                            collection_msg:mess,
                            credit_card:this.editData.credit_card
                        };
                        console.log('test',param);
                        if(this.action.value === 'add'){
                            this.$http(api_add_account, param).then(res=>{
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
                            this.$http(api_updata_account, this.editData.id, param).then(res=>{
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
                console.log(obj,'obj');
                this.$emit('choose-server',obj.ip);
                this.editData.server_id = obj.id;
                this.editData.server_type=obj.server_type;
                this.tempServerIpId=obj.id;
            },
            get_password(password, type){
                this.$refs[type].$refs.input.type = 'text';
                if(type === 'account_minor'){
                    this.isShowMinorPassword= false;
                    this.editData.password_minor = password;
                    this.minorAccountDisabled=true;
                } else if(type==='account'){
                    this.isShowPassword = false;
                    this.editData.password = password;
                    this.accountDisabled=true;
                }else {
                    this.isShowEmailPassword = false;
                    this.editData.email_password = password;
                    this.emailDisabled=true;
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
            placeHolder(){
                if(!this.editData.channel_id&&this.editData.type===''){
                    return '请先选择平台';
                }else if(this.editData.channel_id&&this.editData.type===''){
                    return '请先选择公司类型';
                }else{
                    return '请选择';
                }
            },
            isRequired(){
                return !!this.siteOptions.length;
            },
            sitePlaceholder(){
                if(this.editData.channel_id<=0){
                    return "请先选择平台";
                }else if(this.editData.channel_id&&!this.siteOptions.length){
                    return "该平台下暂无站点";
                }else if(this.editData.channel_id&&this.siteOptions.length){
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
                if(val){
                    this.selectPhoneSearch={
                        value:'',
                        page:1,
                        pageSize:20
                    };
                    this.isAddCompany=false;
                    if(this.editData.channel_id){
                        this.change_channel(this.editData.channel_id);
                    }
                    this.tempServerIpId=this.serverIpId;
                    if(this.editData.company_id){
                        this.get_company_data(this.editData.company_id);
                    }
                    this.hasBindPhone=[];
                    if(this.action.value!=='add'){
                        this.$http(api_get_has_bind_phone,this.editData.id).then(res=>{
                            this.hasBindPhone=res.data;
                        }).catch( error =>{
                            error&&this.$message({type:'error', message:error.message||error});
                        });
                    }
                }
            },
            editData:{
                deep:true,
                handler(val){
                    if(!val.collection_account){
                        val.collection_account=[]
                    }
                }
            },
            companyData:{
                deep:true,
                handler(val){
                    if(val.length&&this.editData.company_id){
                        let find =val.find(row=>row.value===this.editData.company_id);
                        if(find){
                            this.editData.company=find.label;
                        }
                    }
                }
            },
            "editData.channel_id"(val){
                if(val){
                    this.get_alreadyBind();
                    this.editData.site_code.length&&this.get_account(val,this.editData.site_code);
                }
            },
            'editData.site_code'(val){
                if(val.length&&this.editData.channel_id){
                    this.get_account(this.editData.channel_id,val);
                }
            },
            'editData.server_id'(val){
                val&&this.get_alreadyBind();
            }
        },
        props: {
            value:{},
            action:{},
            editData:{},
            searchData:{},
            serverIp:{},
            serverIpId:{}
        },
        components: {
            selectRemote:require('../../../components/select-remote.vue').default,
            retypePassword:require('./retype-password.vue').default,
            scrollSelect:require('../../../components/scroll-select.vue').default,
            requestButton:require('../../../global-components/request-button').default,
            // addEmailServer:require('./add-email-server.vue').default,
            chooseServer:require('./choose-server').default,
            addLookEdit,selectPhoneEmail
        },
    }
</script>
