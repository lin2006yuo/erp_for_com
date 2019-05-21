<template>
    <div>
        <div class="basic-title-info mt-sm">账号创建人</div>
        <el-form label-width="200px"
                 :rules="rules"
                 :model="form"
                 ref="creator">
            <el-form-item label="注册人：" prop="account_creator">
                <el-col :span="6">
                    <super-select v-model="form.account_creator"
                                  :placeholder="`请输入/选择注册人`"
                                  :options="creatorData"
                                  :storage-key="`baseAccountCreatorDialog`"
                                  :disabled="!!flag&&(form.current_status!=='新增')"
                                  style="width: 100%">
                    </super-select>
                </el-col>
            </el-form-item>
            <el-form-item label="创建时间：" prop="account_create_time">
                <el-col :span="6">
                    <el-date-picker
                            v-model="form.account_create_time"
                            type="date"
                            placeholder="选择日期"
                            :disabled="!!flag&&(form.current_status!=='新增')"
                            class="inline date"
                            style="width: 100%"
                            :picker-options="createTime">
                    </el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="当前状态：" >
                <el-col :span="12">
                    <el-radio-group v-model="form.status" disabled>
                        <el-radio v-for="item in currentStatus"
                                  :key="item.status"
                                  :label="item.status">
                            {{item.remark}}
                        </el-radio>
                    </el-radio-group>
                </el-col>
            </el-form-item>
            <el-form-item label="备注：" >
                <el-col :span="12">
                    <el-input v-model="form.remark"
                              type="textarea"
                              :disabled="!!flag&&form.current_status==='已作废'"
                              placeholder="请输入备注">
                    </el-input>
                </el-col>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {api_get_account_status} from '@/api/account-information';
    export default {
        name: "creator-info",
        data() {
            return {
                createTime:{
                    disabledDate:(time)=>{
                        return time.getTime()>Date.now();
                    }
                },
                rules:{
                    account_creator:[{required:true,message:'请选择账号创建人',trigger:'change',type:'number'}],
                    account_create_time:[{required:true,message:'请选择账号创建日期',trigger:'change',type:'date',}]
                },
                currentStatus:[],
            }
        },
        mounted() {
            this.get_current_status();
        },
        methods: {
            get_current_status(){
                let baseAccountStatus = JSON.parse(localStorage.getItem('baseAccountStatus'));
                if(!baseAccountStatus||!baseAccountStatus.length){
                    this.$http(api_get_account_status).then(res=>{
                        this.currentStatus=res;
                        localStorage.setItem('baseAccountStatus',JSON.stringify(res));
                    }).catch( error =>{
                        error&&this.$message({type:'error', message:error.message||error});
                    });
                }else{
                    this.currentStatus=baseAccountStatus;
                }
            },
            validate() {
                let flag = false;
                this.$refs.creator.validate(valid=> {
                    flag = valid
                });
                return flag
            },
        },
        props: {
            creatorData:Array,
            form:Object,
            flag:Number
        },
    }
</script>

