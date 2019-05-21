<template>
    <el-form :model="form"
             ref="company"
             label-width="350px"
             :rules="rules">
        <el-form-item label="公司类型：" prop="type">
            <el-col :span="12">
                <el-select v-if="flag!==1"
                        v-model="form.type"
                           filterable
                           :disabled="disabled"
                           style="width: 100%;">
                    <el-option
                            v-for="item in companyType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <span v-else>{{companyTypes}}</span>
            </el-col>
        </el-form-item>
        <el-form-item label="资料来源：">
            <el-col :span="12">
                <el-select v-if="flag!==1"
                        v-model="form.source"
                           filterable
                           clearable
                           :disabled="disabled"
                           style="width: 100%;">
                    <el-option
                            v-for="item in companySource"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <span v-else>{{dataResource}}</span>
            </el-col>
        </el-form-item>
        <el-form-item label="公司名称：" prop="company">
            <el-col :span="12">
                <el-input v-if="flag!==1"
                        v-model.trim="form.company"
                          :disabled="disabled">
                </el-input>
                <span v-else>{{form.company}}</span>
            </el-col>
        </el-form-item>
        <el-form-item label="公司注册号：">
            <el-col :span="12">
                <el-input v-if="flag!==1"
                        v-model.trim="form.company_registration_number"
                          :disabled="disabled">
                </el-input>
                <span v-else>{{form.company_registration_number}}</span>
            </el-col>
        </el-form-item>
        <el-form-item label="公司营业期限：" required>
            <el-col :span="12" v-if="flag!==1">
                <el-col :span="11">
                    <el-form-item prop="business_term_st">
                        <el-date-picker
                                v-model="form.business_term_st"
                                type="date"
                                placeholder="选择日期"
                                class="inline date"
                                :disabled="disabled"
                                style="width: 100%;"
                                :picker-options="inputTimeStart">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col class="t-center" :span="2">--</el-col>
                <el-col :span="11">
                    <el-form-item >
                        <el-date-picker
                                v-model="form.business_term_nd"
                                type="date"
                                placeholder="选择日期"
                                class="inline date"
                                :disabled="disabled"
                                style="width: 100%;"
                                :picker-options="inputTimeEnd">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-col>
            <span v-else>{{form.business_term_st|fymd}} --  {{is_long_time(form.business_term_nd)}}</span>
        </el-form-item>
        <el-form-item label="公司成立时间：">
            <el-col :span="12" v-if="flag!==1">
                <el-date-picker
                        v-model="form.company_time"
                        type="date"
                        placeholder="选择日期"
                        class="inline date"
                        :disabled="disabled"
                        style="width: 100%;"
                        :picker-options="companyLimit">
                </el-date-picker>
            </el-col>
            <span v-else>{{form.company_time|fymd}}</span>
        </el-form-item>
        <el-form-item label="公司注册地址+邮编：">
            <el-col :span="12" v-if="flag!==1">
                <el-input type="textarea"
                        v-model.trim="form.company_address_zip"
                          :disabled="disabled">
                </el-input>
            </el-col>
            <span v-else>{{form.company_address_zip}}</span>
        </el-form-item>
        <el-form-item label="">
            <el-col v-if="flag!==1">
                <template v-if="form.status_text==='待批执照'">
                    <el-button type="primary" size="mini"
                               @click.native="submit('audit_success')">确 定
                    </el-button>
                    <el-button type="primary" size="mini"
                               @click.native="submit('audit_fail')">审核未通过
                    </el-button>
                </template>
                <el-button size="mini" @click.native="$emit('cancel')" v-if="!disabled">取 消</el-button>
            </el-col>
        </el-form-item>
    </el-form>
</template>

<script>
    export default {
        name: "company-info",
        data() {
            return {
                rules:{
                    type:[{type:'number',required:true,message:'请选择公司类型',trigger:'change'}],
                    company:[{required:true,message:'请输入公司名称',trigger:'blur'}],
                    business_term_st:[{type:'date',required:true,message:'请选择日期',trigger:'change'}]
                },
                companyType:[
                    {label:'企业',value:0},
                    {label:'个人',value:1}
                ],
                companySource:[
                    {label:'未知',value:0},
                    {label:'A1',value:1},
                    {label:'B1',value:2},
                    {label:'C1',value:3},
                    {label:'D1',value:4}
                ],
                inputTimeStart:{
                    disabledDate:(time)=>{
                        if(this.form.business_term_nd){
                            return time.getTime()>this.form.business_term_nd;
                        }else {
                            return false;
                        }
                    }
                },
                inputTimeEnd: {
                    disabledDate:(time)=>{
                        if(this.form.business_term_st){
                            return time.getTime()<this.form.business_term_st;
                        }else {
                            return false;
                        }
                    }
                },
                companyLimit:{
                    disabledDate:time=>{
                        return time.getTime()>Date.now();
                    }
                }
            }
        },
        computed: {
            disabled(){
                return this.form.status>=4||(this.form.status_text==='待批执照未通过')||this.form.status===2;
            },
            companyTypes(){
                let find=this.companyType.find(row=>row.value===this.form.type);
                if(find){
                    return find.label;
                }
            },
            dataResource(){
                let find=this.companySource.find(row=>row.value===this.form.source);
                if(find){
                    return find.label;
                }else{
                    return '未知';
                }
            }
        },
        methods: {
            is_long_time(time){
                if(!time){
                    return '长期有效';
                }else{
                    return datef('YYYY-MM-dd',String(time).length===13?time/1000:time);
                }
            },
            submit(string){
                if(typeof this.form.business_term_st==='number'){
                    this.form.business_term_st=new Date(this.form.business_term_st);
                }
                this.$refs.company.validate(valid=>{
                    if(valid){
                        let param={
                            type:this.form.type,
                            source:this.form.source,
                            company:this.form.company,
                            company_registration_number:this.form.company_registration_number,
                            business_term_st:this.form.business_term_st,
                            business_term_nd:this.form.business_term_nd,
                            company_time:this.form.company_time,
                            company_address_zip:this.form.company_address_zip,
                            submit_code:string
                        };
                        this.$emit('submit-company',param);
                    }else {
                        console.error('验证不通过');
                    }
                })
            }
        },
        props: {
            form:Object,
            flag:Number,
        },
    }
</script>

