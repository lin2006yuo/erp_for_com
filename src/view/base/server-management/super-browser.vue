<template>
    <el-form :model="form"
             label-width="120px"
             :rules="rules"
             ref="supper">
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
        <el-form-item label="UA：">
            <el-col :span="12">
                <el-input v-model="form.user_agent" ></el-input>
            </el-col>
        </el-form-item>
    </el-form>
</template>

<script>
    import {checkIp} from './action';
    export default {
        name: "super-browser",
        data() {
            return {
                rules:{
                    name:[{required:true,message:'请填写服务器名',trigger:'blur'}],
                    ip:[{required:true,validator:checkIp,message:'请填写IP地址',trigger:'blur'}],
                }
            }
        },
        methods: {
            validator(){
                let flag = false;
                this.$refs.supper.validate((valid) => {
                    flag = valid;
                });
                return flag
            }
        },
        props: {
            form:Object
        },
    }
</script>

