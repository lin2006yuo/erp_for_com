<template>
    <div class="c-buyer-message">
        <el-row>
            <el-form label-width="75px" :model="form" ref="buyer" :rules="rules">
                <el-col :span="6">
                    <el-form-item label="买家ID：">
                        <el-input v-model="form.buyer_id"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="买家Email：" prop="email">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
    </div>
</template>
<style lang="stylus">
    .c-buyer-message{
        .el-form-item__label{
            font-weight:bold;
        }
    }
</style>
<script>
import {email} from '../../../define/validator_reg';
    export default{

        data(){
            let checkEmail = (rule,value,callback)=> {
                if (value) {
                    return !email.test(value) ? callback(new Error("邮箱格式输入有误，请重新输入！")) : callback();
                } else {
                    callback();
                }
            };
            return {
                rules:{
//                    buyer_id:[
//                        {required:true,message:"买家ID不允许为空！",trigger:"change"}
//                    ],
                    email:[
                        {validator:checkEmail,trigger:"blur"}
                    ]
                }
            }
        },
        methods:{
            submit(){
                let flag = false;
                this.$refs.buyer.validate((b)=>{
                    if(b){
                        flag = true;
                    }
                })
                return flag;
            }
        },
        props:{
            form:{
                type:Object,
                require:true
            }
        },
        components: {}
    }
</script>