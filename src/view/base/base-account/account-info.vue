<template>
    <div class="c-basic-account-info">
        <div class="basic-title-info mt-sm">账号信息</div>
        <el-form label-width="200px"
                 :rules="currentRules"
                 :model="form"
                 ref="account">
            <el-form-item label="平台：" prop="channel_id">
                <el-col :span="6">
                    <super-select v-model="form.channel_id"
                                  :options="channelList"
                                  :storage-key="`baseAccountChannelDialogZ`"
                                  :disabled="!!flag&&(form.current_status!=='新增')"
                                  style="width:100%;"
                                  @change="change_channel">
                    </super-select>
                </el-col>
            </el-form-item>
            <el-form-item label="站点：" prop="site_code">
                <el-col :span="12">
                    <el-select filterable clearable multiple
                               placeholder="请选择/可以多选"
                               v-model="form.site_code"
                               :disabled="siteDisabled">
                        <el-option v-for="item in currentSite"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="店铺名称：" >
                <el-col :span="12">
                    <el-input v-model.trim="form.shop_name"
                              :disabled="!!flag&&form.current_status==='已作废'">
                    </el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="主账号全称：" prop="account_name">
                <el-col :span="12">
                    <el-input v-model.trim="form.account_name"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="主账号密码：" prop="password">
                <el-col :span="12">
                    <el-input v-model.trim="form.password"
                              :type="mainPassword?'password':'text'"
                              :disabled="!!flag&&showPassword">
                    </el-input>
                </el-col>
                <img src="../../../assets/eye.svg"
                     style="vertical-align: middle;width: 20px;height: 20px;"
                     v-if="!flag"
                     class="ml-mini"
                     @mouseup="mainPassword=true"
                     @mousedown="mainPassword=false">
                <el-button type="primary"
                           size="mini"
                           class="ml-sm"
                           v-else
                           :disabled="(!!flag&&form.current_status==='已作废')||showMainPassword"
                           @click.native="show_password('account')">显示密码
                </el-button>
            </el-form-item>
            <el-form-item label="子账号全称：">
                <el-col :span="12">
                    <el-input v-model.trim="form.account_name_minor"
                              :disabled="(!!flag&&form.current_status==='已作废')">
                    </el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="子账号密码：">
                <el-col :span="12">
                    <el-input v-model.trim="form.password_minor"
                              :type="minorPassword?'password':'text'"
                              :disabled="!!flag&&showMinor">
                    </el-input>
                </el-col>
                <img src="../../../assets/eye.svg"
                     style="vertical-align: middle;width: 20px;height: 20px;"
                     class="ml-mini"
                     v-if="!flag"
                     @mouseup="minorPassword=true"
                     @mousedown="minorPassword=false">
                <el-button type="primary"
                           size="mini"
                           class="ml-sm"
                           v-else
                           :disabled="(!!flag&&form.current_status==='已作废')||showMinorPassword"
                           @click.native="show_password('account_minor')">显示密码
                </el-button>
            </el-form-item>
            <el-form-item label="账号简称：" prop="account_code">
                <el-col :span="12">
                    <el-input v-model.trim="form.account_code"
                              :disabled="form.current_status!=='新增'">
                    </el-input>
                </el-col>
            </el-form-item>
        </el-form>
        <retype-password v-model="passwordShow"
                         :retype-data="retypeData"
                         :password-url="passwordUrl"
                         @get-password="get_password">
        </retype-password>
    </div>
</template>

<style lang="stylus" >
    .c-basic-account-info{
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
    import {api_account_list} from  '@/api/report-channel';
    export default {
        name: "account-info",
        data() {
            return {
                rules:{
                    channel_id:[{required:true,message:'请选择平台',trigger:'change',type:'number',min:1}],
                    site_code:[{required:true,message:'请选择站点',trigger:'change',type:'array'}],
                    account_name:[{required:true,message:'请填写主账号全称',trigger:'blur'}],
                    password:[{required:true,message:'请填写主账号密码',trigger:'blur'}],
                    account_code:[{required:true,message:'请填写账号简称',trigger:'blur'}],
                },
                channelData:[],
                currentSite:[],
                mainPassword:true,
                minorPassword:true,
                showPassword:true,
                passwordShow:false,
                showMainPassword:false,
                showMinor:true,
                showMinorPassword:false,
                retypeData:{
                    type:'',
                    account_id:'',
                    password:''
                },
                passwordUrl:'get|account-basics/password',
            }
        },
        mounted() {
            this.mainPassword=true;
            this.minorPassword=true;
            this.showPassword=true;
            this.showMainPassword=false;
            this.showMinor=true;
            this.showMinorPassword=false;
            if(this.flag){
                this.change_channel(this.form.channel_id,true);
            }
        },
        computed: {
            currentRules(){
                if(this.currentSite.length){
                    this.rules.site_code.forEach(rule=>{
                        this.$set(rule,'required',true);
                    });
                }else{
                    this.rules.site_code.forEach(rule=>{
                        this.$set(rule,'required',false);
                    });
                }
                return this.rules;
            },
            siteDisabled(){
                if(this.currentSite.length){
                    if(this.form.current_status!=='新增'){
                        if(this.form.channel_id===1){//ebay
                            return false;
                        }else{
                            return true;
                        }
                    }else{
                        return false;
                    }
                }else {
                    return true;
                }
            }
        },
        methods: {
            change_channel(channel_id,bool){
                this.currentSite = [];
                if(!bool)this.$set(this.form,'site_code',[]);
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    this.currentSite=res.site;
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            show_password(string){
                this.retypeData = {
                    account_id: this.form.id,
                    type:string
                };
                this.passwordShow = true;
            },
            get_password(password,string){
                if(string==='account'){
                    this.form.password=password;
                    this.mainPassword=false;
                    this.showPassword=false;
                    this.showMainPassword=true;
                }else if(string==='account_minor'){
                    this.form.password_minor=password;
                    this.minorPassword=false;
                    this.showMinor=false;
                    this.showMinorPassword=true;
                }
            },
            validate() {
                let flag = false;
                this.$refs.account.validate(valid=> {
                    flag = valid
                });
                return flag
            },
        },
        props: {
            form:Object,
            flag:Number,
            channelList:Array
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            retypePassword:require('@/view/base/account-information/retype-password').default,
        },
    }
</script>

