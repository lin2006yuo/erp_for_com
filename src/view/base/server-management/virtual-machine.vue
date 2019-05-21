<template>
    <el-form :model="form"
             label-width="120px"
             :rules="currentRules"
             ref="virtual">
        <el-form-item label="外网类型：" prop="ip_type">
            <el-col :span="12">
                <el-select v-model.number="form.ip_type" placeholder="请选择">
                    <el-option
                            v-for="item in ipTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-form-item>
        <el-form-item label="外网IP：" prop="network_ip">
            <el-col :span="12">
                <el-input v-model="form.network_ip" ></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="服务器名：" prop="name">
            <el-col :span="12">
                <el-input v-model="form.name" key="name"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="IP地址：" prop="ip">
            <el-col :span="12">
                <el-input v-model="form.ip" key="ip"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="MAC地址：" prop="mac">
            <el-col :span="12">
                <el-input v-model="form.mac" key="mac"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="网关：" prop="gateway">
            <el-col :span="12">
                <el-input v-model="form.gateway" key="gateway"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="域名：">
            <el-col :span="12">
                <el-input v-model="form.domain"></el-input>
            </el-col>
        </el-form-item>

        <el-form-item label="管理员名称：" prop="admin">
            <el-col :span="12">
                <el-input v-model="form.admin"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
            <el-col :span="14">
                <el-input :disabled="type === 'edit' && isShowPassword"
                          v-model="form.password"
                          type="password"
                          ref="all"
                          class="inline"></el-input>
                <img v-if="type === 'add'" src="../../../assets/eye.svg"
                     @mouseup="backPassword('all')"
                     @mousedown="lookPassword('all')"
                     style="vertical-align: middle;width: 20px;height: 20px;">
                <el-button type="primary"
                           size="mini"
                           class="inline ml-sm"
                           v-if="type === 'edit'"
                           :disabled="!isShowPassword"
                           @click="viewPassword('all')">显示密码
                </el-button>
            </el-col>
        </el-form-item>
        <el-form-item label="上报周期：" prop="reporting_cycle">
            <el-col :span="12">
                <natural-number-input v-model.number="form.reporting_cycle"
                                      :step="5" :min="5" class="inline">
                </natural-number-input>
                <span>分钟</span>
            </el-col>
        </el-form-item>
        <el-form-item label="线程数：" prop="thread_quantity">
            <el-col :span="12">
                <el-input v-model.number="form.thread_quantity" key="thread_quantity"></el-input>
            </el-col>
        </el-form-item>

        <el-form-item label="代理IP：">
            <el-col :span="12">
                <el-input v-model="form.proxy_ip" ></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="代理协议：">
            <el-col :span="12">
                <el-input v-model="form.proxy_agent" ></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="代理端口：">
            <el-col :span="12">
                <el-input v-model="form.proxy_port" ></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="代理用户名：">
            <el-col :span="12">
                <el-input v-model="form.proxy_user_name" ></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="代理密码：">
            <el-col :span="14">
                <el-input :disabled="type === 'edit' && isShowAnswers"
                          v-model="form.proxy_user_password"
                          type="password"
                          ref="proxy"
                          class="inline"></el-input>
                <img v-if="type === 'add'" src="../../../assets/eye.svg"
                     @mouseup="backPassword('proxy')"
                     @mousedown="lookPassword('proxy')"
                     style="vertical-align: middle;width: 20px;height: 20px;">
                <el-button type="primary"
                           size="mini"
                           class="inline ml-sm"
                           v-if="type === 'edit'"
                           :disabled="!isShowAnswers"
                           @click="viewPassword('proxy')">显示密码
                </el-button>
            </el-col>
        </el-form-item>
        <el-form-item label="UA：">
            <el-col :span="12">
                <el-input v-model="form.user_agent" ></el-input>
            </el-col>
        </el-form-item>
        <retype-password v-model="retype_visible"
                         :retype-data="retypeData"
                         @get-password="get_password">
        </retype-password>
    </el-form>
</template>

<script>
    import {checkIp,checkMac} from './action';
    import {api_get_servers_type} from '../../../api/server-management';
    export default {
        name: "virtual-machine",
        data() {
            return {
                ipTypeList:[],
                rules:{
                    name:[{required:true,message:'请填写服务器名',trigger:'blur'}],
                    ip:[{required:true,validator:checkIp,message:'请填写IP地址',trigger:'blur'}],
                    mac:[{required:true,message:'请填写MAC地址',trigger:'blur'}],
                    reporting_cycle:[{required:true,message:'请填写上报周期',trigger:'blur',type:'number'}],
                    ip_type:[{required:true,message:'外网类型为必选',trigger:'blur', type:'number'}],
                    network_ip:[{required:false,message:'请填写外网IP',trigger:'blur'}],
                    admin:[{required:true,message:'请填写管理员名称',trigger:'blur'}],
                    password:[{required:true,message:'请填写管理员密码',trigger:'blur'}],
                    thread_quantity:[{required:true,message:'请填写线程数',trigger:'blur',type:'number'}],
                    gateway:[{required:true,message:'请填写网关',trigger:'blur'}]
                },
                isShowPassword:true,
                retypeData:{},
                retype_visible:false,
                isShowAnswers:true
            }
        },
        mounted(){
            this.servers_type();
        },
        methods: {
            lookPassword(type){
                this.$refs[type].$refs.input.type = 'text';
            },
            backPassword(type){
                this.$refs[type].$refs.input.type = 'password';
            },
            viewPassword(type) {//---显示密码
                this.retypeData = {
                    id: this.form.id,
                    type:type
                };
                this.retype_visible = true;
            },
            get_password(password, type){
                this.$refs[type].$refs.input.type = 'text';
                if(type === 'all'){
                    this.isShowPassword = false;
                    this.form.password= password;
                }else{
                    this.isShowAnswers = false;
                    this.form.proxy_user_password = password;
                }
            },
            validator(){
                if(this.form.mac.indexOf(':') !== -1){
                    let arr = this.form.mac.split(':');
                    this.form.mac = arr.join('-');
                }
                let flag = false;
                this.$refs.virtual.validate((valid) => {
                    flag = valid;
                });
                return flag
            },
            servers_type(){
                this.$http(api_get_servers_type).then(row=>{
                    this.ipTypeList = row.data;
                })
            }
        },
        computed:{
            currentRules(){
                if(this.form.ip_type <=1){
                    this.rules.network_ip.forEach(row=>{
                        this.$set(row,'required',false);
                    });
                }else {
                    this.rules.network_ip.forEach(row=>{
                        this.$set(row,'required',true)
                    });
                }
                return this.rules;
            }
        },
        props: {
            form:Object,
            type:{}
        },
        components: {
            naturalNumberInput:require('./natural-number-input').default,
            retypePassword:require('./retype-password.vue').default,

        },
    }
</script>

