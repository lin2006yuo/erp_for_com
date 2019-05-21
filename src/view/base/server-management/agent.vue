<template>
    <el-form :model="form"
             label-width="120px"
             :rules="rules"
             ref="agent">
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
        <el-form-item label="代理IP：" prop="proxy_ip">
            <el-col :span="12">
                <el-input v-model="form.proxy_ip" key="proxy_ip"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="代理协议：" prop="proxy_agent">
            <el-col :span="12">
                <el-input v-model="form.proxy_agent" key="proxy_agent"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="代理端口：" prop="proxy_port">
            <el-col :span="12">
                <el-input v-model="form.proxy_port" key="proxy_port"></el-input>
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
    import {checkIp} from './action'
    export default {
        name: "agent",
        data() {
            return {
                rules:{
                    name:[{required:true,message:'请填写服务器名',trigger:'blur'}],
                    ip:[{required:true,validator:checkIp,message:'请填写IP地址',trigger:'blur'}],
                    proxy_ip:[{required:true,message:'请填写代理IP',trigger:'blur'}],
                    proxy_agent:[{required:true,message:'请填写代理协议',trigger:'blur'}],
                    proxy_port:[{required:true,message:'请填写代理端口',trigger:'blur'}],
                },
                retypeData:{},
                retype_visible:false,
                isShowAnswers:true
            }
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
                this.isShowAnswers = false;
                this.form.proxy_user_password= password;
            },
            validator(){
                let flag = false;
                this.$refs.agent.validate((valid) => {
                    flag = valid;
                });
                return flag
            }
        },
        props: {
            form:Object,
            type:{}
        },
        components: {
            retypePassword:require('./retype-password.vue').default
        },
    }
</script>

