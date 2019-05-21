<template>
    <el-card :style="cardStyle">
        <div slot="header">
            {{title}}
        </div>
        <el-form :model="form" ref="Form">
            <el-form-item label="" prop="remark"
                          :rules="[{required:true,message:'请输入原因',trigger:'blur'}]">
                <el-input type="textarea"
                          v-model="form.remark"
                          :maxlength="225"
                          :autosize="{ minRows: 4, maxRows: 6}"
                          placeholder="请输入原因"></el-input>
            </el-form-item>
        </el-form>
        <el-row class="fl-clear">
            <span class="fr">
               <button class="small-button submit current-cursor" @click="submit(form.remark)">提交</button>
                <button class="small-button cancel current-cursor" @click="$emit('cancel')">取消</button>
            </span>
        </el-row>
    </el-card>
</template>

<style lang="stylus">
    .current-cursor{
        &:hover{
            cursor :pointer;
        }
    }
</style>

<script>
    export default {
        name: "little-remark",
        data() {
            return {
                form:{
                    remark:''
                }
            }
        },
        methods:{
            submit(remark){
                this.$refs.Form.validate(valid=>{
                    if(valid){
                        this.$emit('remark-submit',remark)
                    }
                })
            }
        },
        props: {
            title:{
                type:String,
                required:true
            },
            cardStyle:{}
        },
    }
</script>

