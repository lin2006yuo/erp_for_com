<template>
    <el-form :model="tempForm"
             ref="corporation"
             label-width="350px"
             :rules="rules">
        <el-form-item label="公司法人：" prop="corporation">
            <el-col :span="12">
                <el-input v-model.trim="tempForm.corporation"
                          v-if="flag!==1"
                          :disabled="disabled"></el-input>
                <span v-else>{{tempForm.corporation}}</span>
            </el-col>
        </el-form-item>
        <el-form-item label="法人身份证号：" prop="corporation_identification">
            <el-col :span="12">
                <el-input v-model.trim="tempForm.corporation_identification"
                          v-if="flag!==1"
                          :disabled="disabled"></el-input>
                <span v-else>{{tempForm.corporation_identification}}</span>
            </el-col>
        </el-form-item>
        <el-form-item label="身份证有效期：" required>
            <el-col :span="12" v-if="flag!==1">
                <el-col :span="11">
                    <el-form-item prop="id_date_st">
                        <el-date-picker
                                v-model="tempForm.id_date_st"
                                type="date"
                                placeholder="选择日期"
                                class="inline date"
                                style="width: 100%;"
                                :picker-options="inputTimeStart"
                                :disabled="disabled">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col class="t-center" :span="2">--</el-col>
                <el-col :span="11">
                    <el-form-item >
                        <el-date-picker
                                v-model="tempForm.id_date_nd"
                                type="date"
                                placeholder="选择日期"
                                class="inline date"
                                style="width: 100%;"
                                :picker-options="inputTimeEnd"
                                :disabled="disabled">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-col>
            <span v-else>
               {{tempForm.id_date_st_txt}} -- {{tempForm.id_date_nd_txt}}
            </span>
        </el-form-item>
        <el-form-item label="身份证正面照：" prop="corporation_id_front"
                      :show-message="!form.corporation_id_front.length">
            <multi-upload :images="form.corporation_id_front"
                          :label="imageLabel"
                          :accept="accept"
                          :edit="!flag||(flag===2&&!disabled)"
                          @download="$emit('download',$event)"
                          :limit="5"
            ></multi-upload>
        </el-form-item>
        <el-form-item label="身份证背面照：" prop="corporation_id_contrary"
                      :show-message="!form.corporation_id_contrary.length">
            <multi-upload :images="form.corporation_id_contrary"
                          :label="imageLabel"
                          :accept="accept"
                          :edit="!flag||(flag===2&&!disabled)"
                          @download="$emit('download',$event)"
                          :limit="5"
            ></multi-upload>
            <!--<image-upload-download :validate="image_before_upload_validate"-->
                                   <!--:images="backIDCard"-->
                                   <!--:is-delete="isDelete"-->
                                   <!--:is-download="!!flag&&!!backIDCard.length"-->
                                   <!--@download="$emit('download',$event)">-->
            <!--</image-upload-download>-->
        </el-form-item>
        <el-form-item label="法人地址+邮编：">
            <el-col :span="12">
                <el-input type="textarea"
                          v-model="tempForm.corporation_address_zip"
                          v-if="flag!==1"
                          :disabled="disabled"></el-input>
                <span v-else>{{tempForm.corporation_address_zip}}</span>
            </el-col>
        </el-form-item>
        <el-form-item label="工商代理：" prop="ic_agent">
            <el-col :span="12">
                <el-input v-model.trim="form.ic_agent"
                          v-if="flag!==1"
                          :disabled="disabled"></el-input>
                <span v-else>{{tempForm.ic_agent}}</span>
            </el-col>
        </el-form-item>
        <el-form-item label="备注：">
            <el-col :span="12">
                <el-input type="textarea" v-model="tempForm.legal_remark"
                          v-if="flag!==1"
                          :disabled="disabled"></el-input>
                <span v-else>{{tempForm.legal_remark}}</span>
            </el-col>
        </el-form-item>
        <el-form-item label="">
            <el-col v-if="flag!==1">
                <template v-if="tempForm.status_text==='接收法人资料'||form.status_text==='工商代理审核未通过'||form.status_text==='待批执照未通过'">
                    <el-button type="primary" size="mini"
                               @click.native="submit_save('submit_audit')">提交给工商代理审核
                    </el-button>
                    <el-button type="primary" size="mini"
                               @click.native="submit_save('save')">保 存
                    </el-button>
                </template>
                <template v-if="form.status_text==='工商代理审核中'">
                    <el-button type="primary" size="mini"
                               @click.native="audit('audit_success')">审核通过
                    </el-button>
                    <el-button type="primary" size="mini"
                               @click.native="audit('audit_fail')">审核不通过
                    </el-button>
                </template>
                <template v-if="form.status_text==='工商代理审核未通过'||form.status_text==='待批执照未通过'">
                    <el-button type="primary" size="mini"
                               @click.native="audit('cancel')">作 废
                    </el-button>
                </template>
                <el-button v-if="!disabled" size="mini" @click.native="$emit('cancel')">取 消</el-button>
            </el-col>
        </el-form-item>
    </el-form>
</template>

<script>
    const IDCard=/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|30|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/;
    //现行身份证均为18位，没必要考虑15位 缺点：!!未匹配前三位的地区编号，!!闰年
    export default {
        name: "corporation-info",
        data() {
            var checkCorporation=(rule,value,callback)=>{//id card
                if(!value){
                    callback(new Error('请输入法人身份证号'));
                }else if (!IDCard.test(value)) {
                    callback(new Error('法人身份证号格式不正确'));
                }else{
                    callback();
                }
            };
            return {
                rules:{
                    corporation:[{required:true,message:'请输入公司法人',trigger:'blur'}],
                    corporation_identification:[{required:true,validator:checkCorporation,trigger:'blur'}],
                    id_date_st:[{type:'date',required:true,message:'请选择日期',trigger:'change'}],
                    corporation_id_front:[{required:true,message:'请添加身份证正面照'}],
                    corporation_id_contrary:[{required:true,message:'请添加身份证背面照'}],
                    ic_agent:[{required:true,message:'请输入工商代理',trigger:'blur'}],
                },
                imageLabel:'上传图片/pdf',
                accept:'image/jpeg,image/jpg,image/png,application/pdf',
                inputTimeStart:{
                    disabledDate:(time)=>{
                        if(this.tempForm.id_date_nd){
                            return time.getTime()>this.tempForm.id_date_nd;
                        }else {
                            return false;
                        }
                    }
                },
                inputTimeEnd: {
                    disabledDate:(time)=>{
                        if(this.tempForm.id_date_st){
                            return time.getTime()<this.tempForm.id_date_st;
                        }else {
                            return false;
                        }
                    }
                },
                frontIDCard:[],
                backIDCard:[],
                tempForm:this.form//cause 信息更新延迟
            }
        },
        computed: {
            disabled(){
                if(this.tempForm.status_text==='工商代理审核中'||this.tempForm.status_text==='待批执照'||this.tempForm.status>=4){//||this.tempForm.status>2
                    return true;
                }
            },
            isDelete(){
                if(this.flag===1){
                    return false
                }else{
                    if(this.tempForm.status===1){
                        return true;
                    }else if(this.tempForm.status===2){
                        if(this.tempForm.status_text==='工商代理审核未通过'){
                            return true;
                        }else{//工商代理审核中
                            return false;
                        }
                    }else if(this.tempForm.status===3){
                        if(this.tempForm.status_text==='待批执照'){
                            return false;
                        }else if(this.tempForm.status_text==='待批执照未通过'){
                            return true;
                        }
                    }else {
                        return false;
                    }
                }
            },
        },
        methods: {
            param(bool){
                return {
                    corporation:this.tempForm.corporation,
                    corporation_identification:this.tempForm.corporation_identification,
                    id_date_st:this.tempForm.id_date_st,
                    id_date_nd:this.tempForm.id_date_nd,
                    corporation_id_front:this.tempForm.corporation_id_front.map(image=>{
                        return {path:image.file_content||'',name:image.file_name,is_add:image.is_add};
                    }),
                    corporation_id_contrary:this.tempForm.corporation_id_contrary.map(image=>{
                        return {path:image.file_content||'',name:image.file_name,is_add:image.is_add};
                    }),
                    corporation_address_zip:this.tempForm.corporation_address_zip,
                    legal_remark:this.tempForm.legal_remark,
                    ic_agent:this.tempForm.ic_agent
                };
            },
            submit_save(string){//optimizable
                // let corporation_id_front,corporation_id_contrary;
                // if(this.flag){
                //     if(this.frontIDCard.length){//''表示没有更换图片
                //         let find=this.frontIDCard.find(row=>row.image);
                //         corporation_id_front=!!find?this.frontIDCard.map(row=>row.image).join(','):this.tempForm.corporation_id_front;
                //     }
                //     if(this.backIDCard.length){
                //         let find=this.backIDCard.find(row=>row.image);
                //         corporation_id_contrary=!!find?this.backIDCard.map(row=>row.image).join(','):this.tempForm.corporation_id_contrary;
                //     }
                // }else{
                //     corporation_id_front=this.frontIDCard.length?this.frontIDCard.map(row=>row.image).join(','):'';
                //     corporation_id_contrary=this.backIDCard.length?this.backIDCard.map(row=>row.image).join(','):'';
                // }
                // this.$set(this.tempForm,'corporation_id_front',corporation_id_front);
                // this.$set(this.tempForm,'corporation_id_contrary',corporation_id_contrary);
                if(typeof this.tempForm.id_date_st==='number'){
                    this.tempForm.id_date_st=new Date(this.tempForm.id_date_st);
                }
                this.$refs.corporation.validate(valid=>{
                    if(valid){
                        let data=this.param(true);
                        this.$set(data,'submit_code',string);
                        console.log(data,'4');
                        this.$emit('submit-save-corporation',data);
                    }else{
                        console.error('error');
                    }
                })
            },
            audit(string){
                let data=this.param(false);
                this.$set(data,'submit_code',string);
                this.$emit('submit-save-corporation',data);
            }
        },
        props: {
            form:Object,
            flag:Number
        },
        components: {
            // imageUploadDownload:require('./image-upload-download').default,
            multiUpload:require('@/view/base/company-information/multi-upload').default,
        },
    }
</script>

