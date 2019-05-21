<template>
    <el-form :model="form"
             label-width="120px"
             :rules="rules"
             ref="cloud">
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
        <el-form-item label="管理员名称：">
            <el-col :span="12">
                <el-input v-model="form.admin"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="密码：">
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
    import {checkIp} from './action';
    export default {
        name: "cloud",
        data() {
            return {
                rules:{
                    name:[{required:true,message:'请填写服务器名',trigger:'blur'}],
                    ip:[{required:true,validator:checkIp,message:'请填写IP地址',trigger:'blur'}],
                },
                isShowPassword:true,
                retypeData:{},
                retype_visible:false
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
                this.isShowPassword = false;
                this.form.password= password;
            },
            validator(){
                let flag = false;
                this.$refs.cloud.validate((valid) => {
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

