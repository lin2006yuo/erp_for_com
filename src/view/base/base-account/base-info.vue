<template>
    <div>
        <div class="basic-title-info mt-sm">基本资料</div>
        <el-form label-width="200px"
                 :rules="rules"
                 :model="form"
                 ref="base">
            <el-form-item label="服务器IP地址："
                          prop="server_name"
                          :show-message="!form.server_name">
                <el-col :span="10">
                    <el-input v-model="form.server_name" disabled></el-input>
                </el-col>
                <el-button type="primary" size="mini"
                           class="ml-sm mr-sm"
                           :disabled="form.change_company || disabledAdd"
                           @click.native="open_server">选择服务器
                </el-button>
                <el-checkbox v-if="form.change_server&&!!flag"
                             v-model="form.is_set_server"
                             :true-label="1"
                             :false-label="0">应用至同一套账号上
                </el-checkbox>
            </el-form-item>
            <el-form-item label="服务器类型：">
                <el-col :span="12">
                    <el-input v-model="form.service_type" disabled></el-input>
                </el-col>
                <el-col v-if="!!flag&&hasBindAccount.length">
                    该服务器已绑定{{form.channel_name}}平台账号：
                    <span v-for="(account,index) in hasBindAccount"
                          class="mr-xs border-span-content"
                          :key="index">{{account.account_code}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="手机号：" prop="phone" :show-message="!form.phone">
                <el-col :span="10">
                    <el-input v-model="form.phone" disabled></el-input>
                </el-col>
                <el-button type="primary" size="mini"
                           class="ml-sm mr-sm"
                           :disabled="form.change_company || disabledAdd"
                           @click.native="open_phone_email('phone')">选择手机号
                </el-button>
                <el-checkbox v-if="form.change_phone&&!!flag"
                             v-model="form.is_set_phone"
                             :true-label="1"
                             :false-label="0">应用至同一套账号上
                </el-checkbox>
                <el-col v-if="!!flag&&hasBindPhone.length">
                    该账号已绑定过的历史手机号：
                    <span v-for="(phone,index) in hasBindPhone"
                          class="mr-xs border-span-content"
                          :key="index">{{phone}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email" :show-message="!form.email">
                <el-col :span="10">
                    <el-input v-model="form.email" disabled></el-input>
                </el-col>
                <el-button type="primary" size="mini"
                           class="ml-sm mr-sm"
                           :disabled="(!!flag&&form.current_status==='已作废')||(!flag&&!form.channel_id)"
                           @click.native="open_phone_email('email')">选择邮箱
                </el-button>
            </el-form-item>
        </el-form>
        <select-service v-model="serviceShow"
                        :title="serverTitle"
                        :channel-id="channelId"
                        @export-service="get_service">
        </select-service>
        <phone-email v-model="phoneEmailShow"
                     :label="phoneEmail"
                     :title="phoneEmailTitle"
                     :channel-id="channelId"
                     @export-data="get_phone_email">
        </phone-email>
    </div>
</template>

<style lang="stylus" scoped>
    .border-span-content{
        border:1px solid red;
        color:red;
    }
</style>

<script>
    import selectService from '@/view/base/account-apply/select-service';
    import phoneEmail from '@/view/base/account-apply/phone-email';
    import {api_get_already,api_get_has_bind_phone} from '@/api/account-information'
    export default {
        name: "base-info",
        data() {
            return {
                rules:{
                    server_name:[{required:true,message:'请填写服务器IP地址',trigger:'blur'}],
                    phone:[{required:true,message:'请填写手机号',trigger:'blur'}],
                    email:[{required:true,message:'请填写邮箱地址',trigger:'blur'}],
                },
                serverTitle:'',
                serviceShow:false,
                phoneEmailTitle:'',
                phoneEmailShow:false,
                phoneEmail:'',
                channelId:0,
                hasBindAccount:[],
                hasBindPhone:[],
                disabledAdd:false
            }
        },
        mounted(){
            this.hasBindAccount=[];
            this.hasBindPhone=[];
            if(this.flag){
                this.$http(api_get_has_bind_phone,this.form.id).then(res=>{
                    this.hasBindPhone=res.data;
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
                if(this.form.server_id&&this.form.channel_id){
                    this.$http(api_get_already,{
                        channel_id:this.form.channel_id,
                        server_id:this.form.server_id
                    }).then(res=>{
                        this.hasBindAccount=res;
                    }).catch( error =>{
                        error&&this.$message({type:'error', message:error.message||error});
                    });
                }
            }
        },
        methods: {
            open_server(){
                console.log(this.form.account_code,'this.form.account_code',this.form);
                this.serverTitle=`${this.form.account_code?`为账号简称：${this.form.account_code}`:''}选择服务器`;
                this.channelId=this.form.channel_id?this.form.channel_id:0;
                this.serviceShow=true;
            },
            get_service(service){
                this.$set(this.form,'server_name',service.ip);
                this.$set(this.form,'server_id',service.id);
                this.$set(this.form,'service_type',service.type);
                this.$set(this.form,'is_set_server',this.flag?1:0);
                if(this.flag)this.$set(this.form,'change_server',true);
                this.serviceShow=false;
            },
            open_phone_email(string){
                this.phoneEmail=string;
                let type=string==='phone'?'手机号':'邮箱';
                this.phoneEmailTitle=`${this.form.account_code?`为账号简称：${this.form.account_code}`:''}选择${type}`;
                this.channelId=this.form.channel_id?this.form.channel_id:0;
                this.phoneEmailShow=true;
            },
            get_phone_email(phoneEmail){
                switch (this.phoneEmail){
                    case 'phone':
                        this.$set(this.form,'phone',phoneEmail.phone);
                        this.$set(this.form,'phone_id',phoneEmail.id);
                        this.$set(this.form,'is_set_phone',this.flag?1:0);
                        if(this.flag)this.$set(this.form,'change_phone',true);
                        break;
                    case 'email':
                        this.$set(this.form,'email',phoneEmail.email);
                        this.$set(this.form,'email_id',phoneEmail.id);
                        break;
                }
                this.phoneEmailShow=false;
            },
            validate() {
                let flag = false;
                this.$refs.base.validate(valid=> {
                    flag = valid
                });
                return flag
            },
        },
        props: {
            form:Object,
            flag:Number,
        },
        components: {
            selectService,
            phoneEmail
        },
    }
</script>

