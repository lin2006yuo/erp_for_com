<template>
    <div>
        <div class="basic-title-info mt-sm">公司资料</div>
        <el-form label-width="200px"
                 :rules="rules"
                 :model="form"
                 ref="company">
            <el-form-item label="公司名称：" prop="company"
                          :show-message="!form.company">
                <el-col :span="10">
                    <el-input v-model="form.company" disabled></el-input>
                </el-col>
                <el-button type="primary" size="mini"
                           class="ml-sm mr-sm"
                           :disabled="(form.current_status!=='新增')||(!!flag&&(form.change_server||form.change_phone))"
                           @click.native="select_company">选择公司
                </el-button>
                <el-checkbox v-if="form.change_company&&!!flag"
                             v-model="form.is_set_company"
                             :true-label="1"
                             :false-label="0">应用至同一套账号上
                </el-checkbox>
            </el-form-item>
            <el-form-item label="公司类型：" prop="type" :show-message="!form.type">
                <el-col :span="12">
                    <el-input v-model="form.type" disabled></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="公司注册号：" >
                <el-col :span="12">
                    <el-input v-model="form.company_registration_number" disabled></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="公司法人：" >
                <el-col :span="12">
                    <el-input v-model="form.corporation" disabled></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="法人身份证号：" >
                <el-col :span="12">
                    <el-input v-model="form.corporation_identification" disabled></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="公司成立时间：">
                <el-col :span="6">
                    <el-date-picker :disabled="true"
                                    v-model="form.company_time"
                                    type="date"
                                    class="inline date"
                                    style="width: 100%">
                    </el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="公司注册地址：">
                <el-col :span="12">
                    <el-input v-model="form.company_address" disabled></el-input>
                </el-col>
            </el-form-item>
        </el-form>
        <select-company v-model="companyShow"
                        :title="companyTitle"
                        @export-company="get_company">
        </select-company>
    </div>
</template>

<script>
    import selectCompany from './select-company';
    import {api_get_company_data} from '@/api/account-information';
    export default {
        name: "company-info",
        data() {
            return {
                rules:{
                    company:[{required:true,message:'请选择公司',trigger:'blur'}],
                    type:[{required:true,message:'请填写公司类型',trigger:'blur'}],
                },
                companyShow:false,
                companyTitle:'',
            }
        },
        mounted() {
            if(this.flag&&this.form.company_id)this.get_company_info()
        },
        methods: {
            get_company_info(){
                this.$http(api_get_company_data,this.form.company_id).then(res=>{
                    this.$set(this.form,'company',res.company);
                    this.$set(this.form,'type',res.type_name);
                    this.$set(this.form,'company_registration_number',res.company_registration_number);
                    this.$set(this.form,'corporation',res.corporation);
                    this.$set(this.form,'corporation_identification',res.corporation_identification);
                    this.$set(this.form,'company_time',res.company_time?res.company_time*1000:'');
                    this.$set(this.form,'company_address',res.company_address_zip);
                }).catch( error =>{
                   error&&this.$message({type:'error', message:error.message||error});
                });
            },
            select_company(){
                this.companyTitle=this.form.account_code?`为账号简称：${this.form.account_code} `:'';
                this.companyShow=true;
            },
            get_company(company){
                this.$set(this.form,'company',company.company);
                this.$set(this.form,'is_set_company',this.flag?1:0);
                this.$set(this.form,'company_id',company.id);
                this.$set(this.form,'type',company.type);
                this.$set(this.form,'company_registration_number',company.company_registration_number);
                this.$set(this.form,'corporation',company.corporation);
                this.$set(this.form,'corporation_identification',company.corporation_identification);
                this.$set(this.form,'company_time',company.company_time?company.company_time*1000:'');
                this.$set(this.form,'company_address',company.company_address_zip);
                if(this.flag)this.$set(this.form,'change_company',true);//edit
                this.companyShow=false;
            },
            validate() {
                let flag = false;
                this.$refs.company.validate(valid=> {
                    flag = valid
                });
                return flag
            },

        },
        props: {
            form:Object,
            flag:Number
        },
        components: {
            selectCompany
        },
    }
</script>

