<template>
    <el-form :model="form" ref="auditForm"
             label-width="100px"
             :rules="rules">
        <el-form-item label="审核资料：">
            <el-col :span="15">
                <span v-if="(flag||!flag)&&!isEdit">{{form.audit_data}}</span>
                <el-input v-model.trim="form.audit_data"
                          :disabled="form.status===5"
                          v-else></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="是否触发KYC："
                      prop="is_kyc"
                      v-if="form.channel_id===2">
            <el-col :span="15">
                <span v-if="(flag||!flag)&&!isEdit">{{LookKYC}}</span>
                <el-select  v-model="form.is_kyc"
                            :disabled="form.status===5"
                            style="width:100%" v-else>
                    <el-option v-for="item in KYC"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-form-item>
        <el-form-item label="主EBay店铺："
                      prop="main_shop"
                      v-if="form.channel_id===1">
            <el-col :span="15">
                <span v-if="(flag||!flag)&&!isEdit">{{form.main_shop}}</span>
                <el-input v-model.trim="form.main_shop"
                          :disabled="form.status===5"
                          v-else></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="店铺经营品类："
                      prop="shop_category">
            <el-col :span="15">
                <span v-if="(flag||!flag)&&!isEdit">{{form.shop_category}}</span>
                <el-input v-model.trim="form.shop_category"
                          :disabled="form.status===5"
                          v-else></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="备注："
                      prop="remark">
            <el-col :span="15">
                <span v-if="(flag||!flag)&&!isEdit">{{form.remark}}</span>
                <el-input type="textarea"
                          v-model.trim="form.remark"
                          :disabled="form.status===5"
                          v-else>
                </el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="">
            <template v-if="(flag||!flag)&&!isEdit">
                <el-button type="primary" size="mini"
                           :disabled="form.status===5"
                           @click.native="isEdit=true">编 辑
                </el-button>
            </template>
            <template v-else>
                <el-button type="primary" size="mini"
                           v-if="(form.channel_id===1||(form.channel_id===2&&form.is_kyc===1))&&form.status<=3"
                           :disabled="form.status===5"
                           @click.native="submit('submit_audit')">提交审核
                </el-button>
                <el-button type="primary" size="mini"
                           v-if="(form.channel_id===2&&form.is_kyc===0)"
                           :disabled="form.status===5"
                           @click="submit('submit_push')">推送账号基础资料库
                </el-button>
                <el-button type="primary" size="mini"
                           :disabled="form.status===5"
                           @click="submit('save')">确定
                </el-button>
                <el-button size="mini" @click.native="cancel"
                           :disabled="form.status===5">取消</el-button>
            </template>
        </el-form-item>
    </el-form>
</template>

<script>
    export default {
        name: "audit-info",
        data(){
            return {
                rules:{
                    is_kyc:[{required:true,type:'number',message:'请选择是否触发KYC',trigger:'change'}]
                },
                KYC:[
                    {label:'是',value:1},
                    {label:'否',value:0},
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
                    if(this.form.status>=4){
                        this.isEdit=false;
                    }else{
                        this.isEdit=true;
                    }
                }
            }
        },
        computed:{
            LookKYC(){
                let find=this.KYC.find(row=>row.value===this.form.is_kyc);
                if(find){
                    return find.label;
                }
            }
        },
        methods:{
            submit(string){
                let data={
                    audit_data:this.form.audit_data,
                    shop_category:this.form.shop_category,
                    remark:this.form.remark,
                    submit_code:string
                };
                if(this.form.channel_id===2){
                    this.$refs.auditForm.validate(valid=>{
                        if(valid){
                            this.$set(data,'is_kyc',this.form.is_kyc);
                            this.$emit('submit-audit',data);
                        }else {
                            console.error('error')
                        }
                    })
                }else{
                    this.$set(data,'main_shop',this.form.main_shop);
                    this.$emit('submit-audit',data);
                }
            },
            cancel(){
                if(!this.flag){
                    if(this.form.audit_submited){
                        this.isEdit=false;
                    }else{
                        this.$set(this.form,'audit_data','');
                        this.$set(this.form,'is_kyc','');
                        this.$set(this.form,'main_shop','');
                        this.$set(this.form,'shop_category','');
                        this.$set(this.form,'remark','');
                    }
                }else{
                    this.isEdit=false;
                    this.$set(this.form,'audit_data',this.everForm.audit_data);
                    this.$set(this.form,'is_kyc',this.everForm.is_kyc);
                    this.$set(this.form,'main_shop',this.everForm.main_shop);
                    this.$set(this.form,'shop_category',this.everForm.shop_category);
                    this.$set(this.form,'remark',this.everForm.remark);
                }
            }
        },
        props: {
            form:{},
            flag:{},
            everForm:{}
        },
    }
</script>

