<template>
    <page-dialog :title="title" v-model="show" size="large"
                 @open="open" @close="close"
                 :close-on-cilck-modal="false"
                 @change="open_dialog">
        <el-form :model="addData"
                 :rules="rules"
                 label-width="140px"
                 ref="addData"
                 class="c-company-info">
            <el-form-item label="邮箱：" prop="email">
                <el-col :span="16" v-if="!lookEdit">
                    <el-input class="width-sm inline" v-model="addData.email" :disabled="addData.is_reg_txt === '是'"></el-input>
                    <el-select class="width-sm inline"
                               v-model="addData.post_id"
                               filterable
                               clearable
                               placeholder="请选择">
                        <el-option
                                v-for="item in postType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="addData.is_reg_txt === '是'">
                        </el-option>
                    </el-select>
                    <el-button type="primary"
                               size="mini"
                               class="inline ml-sm"
                               @click="$emit('rebuild-btn')">重新生成邮箱前缀</el-button>
                </el-col>
                <span v-if="lookEdit">{{addData.email}}</span>
            </el-form-item>
            <el-form-item label="邮箱密码：" prop="password">
                <el-col :span="16" v-if="!lookEdit">
                    <el-input ref="pwd"
                              v-model="addData.password"
                              type="password"
                              class="inline"
                              :disabled="isDisabled && isShowPassword"></el-input>
                    <img src="../../../assets/eye.svg"
                         v-if="!isDisabled"
                         alt=""
                         @mouseup="backPassword('pwd')"
                         @mousedown="lookPassword('pwd')"
                         style="vertical-align: middle;width: 20px;height: 20px;">
                    <el-button type="primary"
                               size="mini"
                               v-if="isDisabled"
                               :disabled="!isShowPassword"
                               class="inline ml-xs"
                               @click="viewPassword('pwd')">显示密码
                    </el-button>
                </el-col>
                <span v-if="lookEdit">******</span>
            </el-form-item>
            <el-form-item label="手机号：" prop="phone_id">
                <el-col :span="16" v-if="!lookEdit">
                    <scroll-select v-model="phoneValue" style="width:158px" class="inline"
                                   textAlign="left"
                                   :remote="phoneUrl"
                                   :fix-params="fix_params_phone"
                                   :fixResult="fix_result_phone">
                    </scroll-select>
                </el-col>
                <span v-if="lookEdit">{{addData.phone}}</span>
            </el-form-item>

            <el-form-item label="注册人：">
                <el-col :span="16" v-if="!lookEdit">
                    <scroll-select v-model="accounts" style="width:158px" class="inline"
                                   textAlign="left"
                                   ref="creater"
                                   :remote="urlcreater"
                                   :fix-params="fix_params_account"
                                   :fixResult="fix_result_account"
                                   :disabled="lookEdit || addData.is_reg_txt === '是'">
                    </scroll-select>
                </el-col>
                <span v-if="lookEdit">{{addData.reg_txt}}</span>
            </el-form-item>
            <el-form-item label="注册日期：">
                <el-col :span="16" v-if="!lookEdit">
                    <el-date-picker  v-model="addData.reg_time_date"
                                     class="inline"
                                     type="date"
                                     placeholder="选择日期"
                                     :disabled="addData.is_reg_txt === '是'"
                                     :picker-options="pickerOptions">
                    </el-date-picker>
                </el-col>
                <span v-if="lookEdit">{{addData.reg_time_date}}</span>
            </el-form-item>
            <el-form-item label="邮箱状态："
                          prop="status">
                <el-switch v-model="addData.status"
                           on-text="启用"
                           off-text="停用"
                           :on-value="1"
                           :off-value="0"
                           :disabled="lookEdit"></el-switch>
            </el-form-item>
            <el-form-item label="接收邮箱："
                          prop="status">
                <el-switch v-model="addData.is_receive"
                           on-text="启用"
                           off-text="停用"
                           :on-value="1"
                           :off-value="0"
                           :disabled="lookEdit"></el-switch>
            </el-form-item>
            <el-form-item label="发送邮箱："
                          prop="status">
                <el-switch v-model="addData.is_send"
                           on-text="启用"
                           off-text="停用"
                           :on-value="1"
                           :off-value="0"
                           :disabled="lookEdit"></el-switch>
            </el-form-item>
            <el-form-item label="适用平台："
                          prop="channel_ids">
                <el-checkbox v-model="checked"
                             :disabled="lookEdit"
                             @change="inverse"反选>
                </el-checkbox>
                <span class="ml-sm red">(注：不选时默认全选)</span>
                <el-checkbox-group v-model="channelData"
                                   class="company-checkbox-group"
                                   @change="change_single">
                    <el-checkbox v-for="(item,index) in channels"
                                 :label="item.label"
                                 :key="item.value"
                                 :disabled="lookEdit"
                                 class="single-checkbox">{{item.label}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
        <retype-password
            v-model="retype_visible"
            :retype-data="retypeData"
            @get-password="get_password">
        </retype-password>
        <div slot="footer" class="dialog-footer">
            <request-button v-if="!lookEdit" req-key="emailAdd" @click.native="keep" type="primary">确定</request-button>
            <el-button v-if="!lookEdit" size="mini" @click.native="show=false">取   消</el-button>
            <el-button v-if="lookEdit" size="mini" @click.native="show=false">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .c-company-info{
        .company-checkbox-group{
            width: 100%;
            display: flex;
            flex-flow:row wrap;
            .single-checkbox{
                flex :0 0 20%;
            }
        }
        .el-checkbox-group{
            .el-checkbox + .el-checkbox{
                margin-left :0!important;
            }
            label.el-checkbox{
                .el-checkbox__label{
                    padding-left: 0!important
                }
            }
        }
    }
</style>
<script>
    import {api_get_channel} from '@/api/email'
    export default{
        data(){
            return{
                show:this.value,
                rules:{
                    email:[
                        {required: true, message: '邮箱为必填项', trigger: 'change' }
                    ],
                    password:[
                        {required: true, message: '邮箱密码为必填项', trigger: 'change' }
                    ],
                    phone_id:[
                        {required: true, message: '手机号为必选', trigger:"change",type:"number"}
                    ]
                },
                phoneUrl:'get|phone/email-use',
                pickerOptions:{
                    disabledDate: (time)=> {
                        return time.getTime() > Date.now();
                    }
                },
                checked:false,
                channelData:[],
                channels:[],
                urlcreater:'get|user',
                retype_visible:false,
                retypeData:{
                    account_id:'',
                    password:''
                },
                isShowPassword:true,
            }
        },
        methods:{
            open_dialog(isOpen){
                if(isOpen){
                    this.channels_list();
                };
                if(this.title.includes('添加')){
                    this.addData.channel_ids = [];
                }
            },
            open(){
                this.isShowPassword=true;
            },
            close(){
                this.channelData = [];
                this.checked = false;
            },
            lookPassword(type){
                this.$refs[type].$refs.input.type = 'text';
            },
            backPassword(type){
                this.$refs[type].$refs.input.type = 'password';
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
            // 反选
            inverse(){
                let arr=this.channels.map(row=>row.label);
                if(!this.channelData.length){
                    this.change_single(arr);
                }else{
                    if(this.channelData.length===this.channels.length){
                        this.change_single([]);
                    }else{
                        let filter=arr.filter(row=>!this.channelData.includes(row));
                        this.change_single(filter);
                    }
                }
            },
            // 适用平台
            channels_list(){
                this.$http(api_get_channel).then(res=>{
                    this.channels=res;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
            },
            viewPassword(type){
                this.retypeData = {
                    id: this.addData.id,
                    type:type
                };
                this.retype_visible = true;
            },
            get_password(password, type){
                this.$refs[type].$refs.input.type = 'text';
                if(type === 'pwd'){
                    this.isShowPassword = false;
                    this.addData.password = password;
                }
            },
            change_single(value){
                this.channelData=value;
                let arr=[];
                for(let item of this.channels){
                    for(let val of value){
                        if(val===item.label){
                            arr.push(item);
                        }
                    }
                }
                arr=[...new Set(arr)];
                if(arr.length===this.channels.length){
                    this.addData.channel_ids=[]||0;  //全选传空数组或0，不选默认为全选
                }else{
                    this.addData.channel_ids=arr.map(row=>row.value);
                }
                let checkedCount = value.length;
                this.checked = checkedCount === this.channels.length;
            },
            keep(){
                this.$refs.addData.validate((b)=>{
                    if(b){
                        this.$emit('keep',this.addData);
                    }else{
                        setTimeout(() => {
                            this.$reqKey('emailAdd', false);
                        }, 300)
                    }
                });
            },
            //手机号参数
            fix_params_phone({page,pageSize,keyword}){
                return {
                    page:page,
                    pageSize:pageSize,
                    phone:keyword||''
                }
            },
            //查询手机号
            fix_result_phone(res){
                return {
                    options: res.list.map(row => {
                        return {
                            label:row.phone,
                            value: row.id
                        }
                    }),
                    page: Number(res.page),
                    count: Number(res.count),
                }
            }
        },
        watch:{
            channels:{
                deep:true,
                handler(val){
                    if(this.title.includes('编辑') || !!this.lookEdit){
                        this.channelData=[];
                        if(this.addData.channel_ids.length === 0){
                            this.channelData=val.map(row=>row.label);
                            this.checked = true
                        }else{
                            if(({}.toString.call(this.addData.channel_ids))==='[object Array]'){
                                val.forEach(row=>{
                                    this.addData.channel_ids.forEach(num=>{
                                        if(Number(num)===row.value){
                                            this.channelData.push(row.label);
                                        }
                                    })
                                })
                            }
                        }
                    }
                }
            },
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            },
        },
        computed:{
            accounts:{
                get(){
                    return {
                        label:this.addData.reg_txt,
                        value:this.addData.reg_id}
                },
                set(val){
                    this.addData.reg_txt = val.label;
                    this.addData.reg_id = val.value;
                }
            },
            phoneValue:{
                get(){
                   return {label:this.addData.phone,value:this.addData.phone_id}
                },
                set(val){
                    this.addData.phone=val?val.label:'';
                    this.addData.phone_id=val?val.value:''
                }
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            title:{
                required:true,
                type:String
            },
            addData:{},
            lookEdit:{
                required:true,
                type:Boolean
            },
            postType:{},
            isDisabled:{
                required:true,
                type:Boolean
            }
        },
        components: {
            scrollSelect:require('@/components/scroll-select.vue').default,
            retypePassword:require('./retype-password.vue').default,
        }
    }
</script>