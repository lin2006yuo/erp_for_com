<template>
    <el-form :model="form" ref="registrationForm" label-width="100px">
        <el-form-item label="完成日期：">
            <el-col :span="6">
                <span v-if="(flag||!flag)&&!isEdit">{{form.fulfill_time|fymd}}</span>
                <el-date-picker v-model="form.fulfill_time"
                                type="date"
                                placeholder="选择日期"
                                :picker-options="finishTime"
                                :disabled="form.status===5"
                                style="width: 100%"
                                v-else>
                </el-date-picker>
            </el-col>
        </el-form-item>
        <el-form-item label="审核资料："
                      v-if="form.channel_id===2&&form.is_kyc===0">
            <el-col :span="6">
                <span v-if="(flag||!flag)&&!isEdit">{{form.audit_data}}</span>
                <el-input v-model.trim="form.audit_data"
                          :disabled="form.status===5"
                          v-else></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="注册结果："
                      prop="reg_result"
                      :rules="[{required:true,type:'number',message:'请选择注册结果',trigger:'change'}]">
            <el-col :span="6">
                <span v-if="(flag||!flag)&&!isEdit">{{registerSul}}</span>
                <el-select  v-model="form.reg_result"
                            :disabled="form.status===5"
                            style="width:100%"  v-else>
                    <el-option v-for="item in registerResult"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-form-item>
        <el-form-item label="" >
            <template v-if="(flag||!flag)&&!isEdit">
                <el-button type="primary" size="mini"
                           :disabled="form.status===5"
                           @click.native="isEdit=true">编 辑
                </el-button>
            </template>
            <template v-else>
                <el-button type="primary" size="mini"
                           v-if="((form.reg_result===''||form.reg_result===1)&&form.channel_id===1)||(form.channel_id===2&&form.is_kyc===1&&form.reg_result===1)"
                           :disabled="form.status===5"
                           @click.native="submit('submit_push')">推送账号基础资料库
                </el-button>
                <el-button type="primary" size="mini"
                           v-if="(form.reg_result===''||form.reg_result===1)&&form.channel_id===2"
                           :disabled="form.status===5"
                           @click.native="submit('sure')">确 定
                </el-button>
                <el-button type="primary" size="mini" v-if="form.reg_result===2"
                           :disabled="form.status===5"
                           @click="submit('cancel')">作 废</el-button>
            </template>
        </el-form-item>
    </el-form>
</template>

<script>
    export default {
        name: "registration-info",
        data() {
            return {
                finishTime:{
                    disabledDate: (time)=> {
                        return time.getTime()>Date.now();
                    }
                },
                registerResult:[
                    {label:'成功',value:1},
                    {label:'失败',value:2}
                ],
                isEdit:false
            }
        },
        mounted(){
            if(this.flag===1){
                this.isEdit=false;
            }else{
                if(!this.flag){
                    this.isEdit=true;
                }else{
                    if(this.form.status>=5){
                        this.isEdit=false;
                    }else{
                        this.isEdit=true;
                    }
                }

            }
        },
        computed:{
            registerSul(){
                let find=this.registerResult.find(row=>row.value===this.form.reg_result);
                if(find){
                    return find.label;
                }
            }
        },
        methods: {
            submit(string){
                this.$refs.registrationForm.validate(valid=>{
                    if(valid){
                        let data={
                            fulfill_time:this.form.fulfill_time,
                            reg_result:this.form.reg_result,
                            submit_code:string
                        };
                        if(this.form.channel_id===2){
                            this.$set(data,'audit_data',this.form.audit_data)
                        }
                        this.$emit('submit-register-result',data)
                    }else{
                        console.error('valid false');
                    }
                })
            },
        },
        props: {
            form:{},
            flag:{},
            everForm:{
                type:Object
            }
        },
    }
</script>

