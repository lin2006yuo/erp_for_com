<template>
    <el-form ref="companyInfo"
             :model="form"
             label-width="130px"
             :rules="rules"
             class="c-company-info">
        <el-form-item label="添加时间："
                      v-if="flag===1">
            <span>{{form.create_time|fmsdatetime}}</span>
        </el-form-item>
        <el-form-item label="公司类型："
                      prop="type">
            <el-select v-model="form.type"
                       class="width-lg"
                       v-if="(!flag||flag===2)&&edit">
                <el-option
                        v-for="item in companyType"
                        class="width-lg"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <span v-else>{{form.type_name}}</span>
        </el-form-item>
        <el-form-item label="资料来源：">
            <el-select v-model="form.source"
                       class="width-lg"
                       v-if="(!flag||flag===2)&&edit">
                <el-option
                        v-for="item in companySource"
                        class="width-lg"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <span v-else>{{form.source_name}}</span>
        </el-form-item>
        <el-form-item label="公司名称："
                      prop="company">
            <el-col :span="12">
                <el-input v-model="form.company"
                          v-if="(!flag||flag===2)&&edit"></el-input>
                <span v-else>{{form.company}}</span>
            </el-col>
        </el-form-item>
        <template v-if="form.type===0">
            <el-form-item label="营业执照图片："
                          prop="charter_url">
                <span v-if="flag===1&&!form.charter_url.length">暂无图片</span>
                <multi-upload :images="form.charter_url"
                              :label="imageLabel"
                              :accept="accept"
                              :edit="((!flag||flag===2)&&edit)"
                              :limit="5"
                              @download="$emit('download',$event)"
                              v-else>
                </multi-upload>
            </el-form-item>
            <el-form-item label="公司营业期限：" required>
                <el-col :span="12" v-if="(!flag||flag===2)&&edit">
                    <el-col :span="11">
                        <el-form-item prop="business_term_st">
                            <el-date-picker
                                    v-model="form.business_term_st"
                                    type="date"
                                    placeholder="选择日期"
                                    class="inline date"
                                    style="width: 100%;"
                                    :picker-options="businessStart">
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
                                    style="width: 100%;"
                                    :picker-options="businessEnd">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-col>
                <span v-else>{{form.business_term_st|fymd}} -- {{form.business_end}}</span>
            </el-form-item>
            <el-form-item label="公司注册号：">
                <el-col :span="12">
                    <el-input v-model="form.company_registration_number"
                              v-if="(!flag||flag===2)&&edit"></el-input>
                    <span v-else>{{form.company_registration_number}}</span>
                </el-col>
            </el-form-item>
        </template>
        <el-form-item :label="`${form.type?'姓名':'公司法人'}：`">
            <el-col :span="12">
                <el-input v-model="form.corporation"
                          v-if="(!flag||flag===2)&&edit"></el-input>
                <span v-else>{{form.corporation}}</span>
            </el-col>
        </el-form-item>
        <el-form-item :label="`${form.type?'':'法人'}身份证号：`"
                      prop="corporation_identification">
            <el-col :span="12">
                <el-input v-model="form.corporation_identification"
                          v-if="(!flag||flag===2)&&edit"></el-input>
                <span v-else>{{form.corporation_identification}}</span>
            </el-col>
        </el-form-item>
        <el-form-item label="身份证有效期：" required>
            <el-col :span="12" v-if="(!flag||flag===2)&&edit">
                <el-col :span="11">
                    <el-form-item prop="id_date_st">
                        <el-date-picker
                                v-model="form.id_date_st"
                                type="date"
                                placeholder="选择日期"
                                class="inline date"
                                style="width: 100%;"
                                :picker-options="IDCardStart">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col class="t-center" :span="2">--</el-col>
                <el-col :span="11">
                    <el-form-item >
                        <el-date-picker
                                v-model="form.id_date_nd"
                                type="date"
                                placeholder="选择日期"
                                class="inline date"
                                style="width: 100%;"
                                :picker-options="IDCardEnd">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-col>
            <span v-else>{{form.id_date_st|fymd}} -- {{form.ID_end}}</span>
        </el-form-item>
        <el-form-item label="身份证正面照："
                      prop="corporation_id_front">
            <span v-if="flag===1&&!form.corporation_id_front.length">暂无图片</span>
            <multi-upload :images="form.corporation_id_front"
                          :label="imageLabel"
                          :accept="accept"
                          :edit="((!flag||flag===2)&&edit)"
                          :limit="5"
                          @download="$emit('download',$event)"
                          v-else
            ></multi-upload>
        </el-form-item>
        <el-form-item label="身份证反面照："
                      prop="corporation_id_contrary">
            <span v-if="flag===1&&!form.corporation_id_contrary.length">暂无图片</span>
            <multi-upload :images="form.corporation_id_contrary"
                          :label="imageLabel"
                          :accept="accept"
                          :edit="((!flag||flag===2)&&edit)"
                          :limit="5"
                          @download="$emit('download',$event)"
                          v-else
            ></multi-upload>
        </el-form-item>
        <template v-if="form.type===0">
            <el-form-item label="公司成立时间：">
                <el-col :span="6" v-if="(!flag||flag===2)&&edit">
                    <el-date-picker
                            v-model="form.company_time"
                            type="date"
                            placeholder="选择日期"
                            class="inline date"
                            style="width:100%"
                            :picker-options="companyTime">
                    </el-date-picker>
                </el-col>
                <span v-else>{{form.company_time|fymd}}</span>
            </el-form-item>
            <el-form-item :label="`${form.type===1?'':'公司注册'}地址+邮编：`">
                <el-col :span="12">
                    <el-input type="textarea"
                              v-model="form.company_address_zip"
                              v-if="(!flag||flag===2)&&edit"></el-input>
                    <span v-else>{{form.company_address_zip}}</span>
                </el-col>
            </el-form-item>
        </template>
        <el-form-item label="法人地址+邮编：">
            <el-col :span="12">
                <el-input type="textarea"
                          v-model="form.corporation_address_zip"
                          v-if="(!flag||flag===2)&&edit"></el-input>
                <span v-else>{{form.corporation_address_zip}}</span>
            </el-col>
        </el-form-item>
        <el-form-item label="状态："
                      prop="status">
            <el-select class="width-lg"
                       v-model="form.status"
                       v-if="(!flag||flag===2)&&edit">
                <el-option
                        v-for="item in statusList"
                        class="width-lg"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <span v-else>{{show_status(form.status)}}</span>
        </el-form-item>
        <template v-if="form.type===0">
            <el-form-item label="开户许可证："
                          prop="open_licence">
                <span v-if="flag===1&&!form.open_licence.length">暂无图片</span>
                <multi-upload :images="form.open_licence"
                              :label="imageLabel"
                              :accept="accept"
                              :edit="((!flag||flag===2)&&edit)"
                              @download="$emit('download',$event)"
                              :limit="5"
                              v-else
                ></multi-upload>
            </el-form-item>
            <el-form-item label="开户行：">
                <el-col :span="12" v-if="(!flag||flag===2)&&edit">
                    <el-input v-model="form.open_bank"></el-input>
                </el-col>
                <span v-else>{{form.open_bank}}</span>
            </el-form-item>
            <el-form-item label="公户账号：">
                <el-col :span="12" v-if="(!flag||flag===2)&&edit">
                    <bank-card v-model="form.open_bank_account" style="width:100%"></bank-card>
                </el-col>
                <span v-else>{{form.open_bank_account}}</span>
            </el-form-item>
            <el-form-item label="开户日期：" prop="open_date">
                <el-col :span="6" v-if="(!flag||flag===2)&&edit">
                    <el-date-picker
                            v-model="form.open_date"
                            type="date"
                            placeholder="选择日期"
                            class="inline date"
                            style="width:100%"
                            :picker-options="companyTime">
                    </el-date-picker>
                </el-col>
                <span v-else>{{form.open_date|fymd}}</span>
            </el-form-item>
        </template>
        <el-form-item label="适用平台："
                      prop="channel">
            <el-checkbox v-model="checked"
                         @change="inverse"
                         :disabled="flag===1||(flag!==1&&!edit)">反选
            </el-checkbox>
            <span class="ml-sm red">(注：不选时默认全选)</span>
            <span class="ml-sm" v-if="!!flag">该公司注册账号总数：{{count}}个</span>
            <el-checkbox-group v-model="tempChannelData"
                               class="company-checkbox-group"
                               @change="change_single">
                <el-checkbox v-for="(channel,index) in channels"
                             :label="channel.label"
                             :key="channel.value"
                             class="single-checkbox"
                             :disabled="flag===1||(flag!==1&&!edit)">{{channel.label}}
                </el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="" v-if="flag!==1">
            <el-button size="mini"
                       v-if="(!flag||flag===2)&&edit"
                       :disabled="disabled"
                       @click.native="submit"
                       type="primary">确 定
            </el-button>
            <el-button size="mini"
                       v-if="(!flag||flag===2)&&edit"
                       @click.native="restore">取 消
            </el-button>
            <el-button size="mini"
                       v-if="((flag===2||!flag)&&!edit)"
                       @click.native="edit=true"
                       type="primary">编 辑
            </el-button>
        </el-form-item>
    </el-form>
</template>

<style lang="stylus" >
    .c-company-info{
        .company-checkbox-group{
            width: 100%;
            display: flex;
            flex-flow:row wrap;
            .single-checkbox{
                flex :0 0 20%;
            }
        }
        .el-checkbox-group{
            .el-checkbox + .el-checkbox{
                margin-left :0!important;
            }
            label.el-checkbox{
                .el-checkbox__label{
                    padding-left: 0!important
                }
            }
        }
    }
</style>

<script>
    import {api_get_company_type,api_add_company_info,api_update_company_info} from '@/api/company-info';
    const IDCard=/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|30|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/;
    import datef from 'datef';
    import bankCard from './bank-card';
    import multiUpload from './multi-upload';
    export default {
        name: "company-info",
        data() {
            var checkCorporation=(rule,value,callback)=>{//id card
                if(value){
                    if(!IDCard.test(value)){
                        callback(new Error('法人身份证号格式不正确'));
                    }else{
                        callback();
                    }
                }else{
                    callback();
                }
            };
            return {
                rules:{
                    type:[{type:'number',required:true,message:'请选择公司类型',trigger:'change'}],
                    company:[{required:true,message:'请输入公司名称',trigger:'blur'}],
                    corporation_identification:[{required:false,validator:checkCorporation,trigger:'blur'}],
                    business_term_st:[{type:'date',required:true,message:'请选择日期',trigger:'change'}],
                    id_date_st:[{type:'date',required:true,message:'请选择日期',trigger:'change'}]
                },
                checked:false,
                disabled:false,
                tempChannelData:this.channelData,
                edit:true,
                imageLabel:'上传图片/PDF',
                accept:'image/jpeg,image/jpg,image/png,application/pdf',
                companyType:[],
                companySource:[],
                businessStart:{
                    disabledDate:(time)=>{
                        if(this.form.business_term_nd){
                            return time.getTime()>this.form.business_term_nd;
                        }else {
                            return false;
                        }
                    }
                },
                businessEnd: {
                    disabledDate:(time)=>{
                        if(this.form.business_term_st){
                            return time.getTime()<this.form.business_term_st;
                        }else {
                            return false;
                        }
                    }
                },
                IDCardStart:{
                    disabledDate:(time)=>{
                        if(this.form.id_date_nd){
                            return time.getTime()>this.form.id_date_nd;
                        }else {
                            return false;
                        }
                    }
                },
                IDCardEnd:{
                    disabledDate:(time)=>{
                        if(this.form.id_date_st){
                            return time.getTime()<this.form.id_date_st;
                        }else {
                            return false;
                        }
                    }
                },
                companyTime:{
                    disabledDate:(time)=> {
                        return time.getTime()>Date.now();
                    }
                },
                statusList:[
                    {label:'正常',value:0},
                    {label:'异常',value:1},
                    {label:'注销',value:2},
                ],
            }
        },
        mounted(){
            this.get_company_type();
            this.get_company_source();
            this.edit=true;
        },
        watch:{
            channelData:{
                deep:true,
                handler(val){
                    this.tempChannelData=val;
                    this.checked = val.length === this.channels.length;
                }
            }
        },
        computed:{
            count(){
                let total=0;
                let param ={}.toString.call(this.form.channel_count);
                switch (param){
                    case '[object Array]':
                        total=0;
                        break;
                    case '[object Object]':
                        Object.keys(this.form.channel_count).forEach(row=>{
                            total+=(this.form.channel_count)[row];
                        });
                        break;
                }
                return total;
            }
        },
        methods: {
            get_company_type(){
                let CompanyType = JSON.parse(localStorage.getItem('companyType'));
                if(!CompanyType||!CompanyType.length){
                    this.$http(api_get_company_type).then(res=>{
                        this.companyType=res.data;
                        localStorage.setItem('companyType',JSON.stringify(res.data));
                    }).catch( error =>{
                        error&&this.$message({type:'error', message:error.message||error});
                    });
                }else {
                    this.companyType=CompanyType;
                }
            },
            get_company_source(){
                let CompanySource=JSON.parse(localStorage.getItem('companySource'));
                if(!CompanySource||!CompanySource.length){
                    this.$http(api_get_company_source).then(res=>{
                        this.companySource=res.data;
                        localStorage.setItem('companySource',JSON.stringify(res.data));
                    }).catch( error =>{
                        error&&this.$message({type:'error', message:error.message||error});
                    });
                }else {
                    this.companySource=CompanySource;
                }
            },
            inverse(event){
                let arr=this.channels.map(row=>row.label);
                if(!this.tempChannelData.length){
                    this.change_single(arr);
                }else{
                    if(this.tempChannelData.length===this.channels.length){
                        this.change_single([]);
                    }else{
                        let filter=arr.filter(row=>!this.tempChannelData.includes(row));
                        this.change_single(filter);
                    }
                }
            },
            change_single(value){
                this.tempChannelData=value;
                let arr=[];
                for(let channel of this.channels){
                    for(let val of value){
                        if(val===channel.label){
                            arr.push(channel);
                        }
                    }
                }
                arr=[...new Set(arr)];
                if(arr.length===this.channels.length){
                    this.form.channel=[]||0;  //全选传空数组或0，不选默认为全选
                }else{
                    this.form.channel=arr.map(row=>row.value);
                }
                let checkedCount = value.length;
                this.checked = checkedCount === this.channels.length;
            },
            submit(){
                if(typeof this.form.business_term_st==='number'){
                    this.form.business_term_st=new Date(this.form.business_term_st);
                }
                if(typeof this.form.id_date_st==='number'){
                    this.form.id_date_st=new Date(this.form.id_date_st);
                }
                this.$refs.companyInfo.validate(valid=>{
                    if(valid){
                        function deal_image(images) {
                            if(images.length){
                                return images.map(image=>{
                                    return {path:image.file_content||'',name:image.file_name,is_add:image.is_add};
                                });
                            }else{
                                return [];
                            }
                        }
                        let data={
                            type:this.form.type,
                            source:this.form.source!==''?this.form.source:0,
                            company:this.form.company,
                            charter_url:this.form.type===0?deal_image(this.form.charter_url):[],
                            business_term_st:this.form.type===0?(this.form.business_term_st?datef('YYYY-MM-dd',this.form.business_term_st):''):'',
                            business_term_nd:this.form.type===0?(this.form.business_term_nd?datef('YYYY-MM-dd',this.form.business_term_nd):''):'',
                            company_registration_number:this.form.type===0?this.form.company_registration_number:'',
                            corporation:this.form.corporation,
                            corporation_identification:this.form.corporation_identification,
                            id_date_st:this.form.id_date_st?datef('YYYY-MM-dd',this.form.id_date_st):'',
                            id_date_nd:this.form.id_date_nd?datef('YYYY-MM-dd',this.form.id_date_nd):'',
                            corporation_id_front:deal_image(this.form.corporation_id_front),
                            corporation_id_contrary:deal_image(this.form.corporation_id_contrary),
                            company_time:this.form.type===0?(this.form.company_time?datef('YYYY-MM-dd',this.form.company_time):''):'',
                            company_address_zip:this.form.company_address_zip,
                            corporation_address_zip:this.form.type===0?this.form.corporation_address_zip:'',
                            status:this.form.status,
                            open_licence:this.form.type===0?deal_image(this.form.open_licence):[],
                            open_bank:this.form.type===0?this.form.open_bank:'',
                            open_bank_account:this.form.type===0?this.form.open_bank_account:'',
                            open_date:this.form.type===0?(this.form.open_date?datef('YYYY-MM-dd',this.form.open_date):''):'',
                            channel:this.form.channel
                        };
                        if(!this.form.id){
                            this.$http(api_add_company_info,data).then(res=>{
                                this.$message({type:'success',message:res.message||res});
                                this.$emit('company',res.data);
                                this.edit=false;
                            }).catch( error =>{
                                this.edit=true;
                                error&&this.$message({type:'error', message:error.message||error});
                            });
                        }else{
                            this.$http(api_update_company_info,this.form.id,data).then(res=>{
                                this.$message({type:'success',message:res.message||res});
                                this.$emit('company',res.data);
                                this.edit=false;
                            }).catch( error =>{
                                this.edit=true;
                                error&&this.$message({type:'error', message:error.message||error});
                            });
                        }
                    }
                })
            },
            show_status(status){
                let find=this.statusList.find(row=>row.value===status);
                if(find){
                    return find.label;
                }
            },
            restore(){
                if(!this.flag){
                    this.$set(this.form,'type',0);
                    this.$set(this.form,'source','');
                    this.$set(this.form,'company','');
                    this.$set(this.form,'charter_url',[]);
                    this.$set(this.form,'business_term_st','');
                    this.$set(this.form,'business_term_nd','');
                    this.$set(this.form,'company_registration_number','');
                    this.$set(this.form,'corporation','');
                    this.$set(this.form,'corporation_identification','');
                    this.$set(this.form,'id_date_st','');
                    this.$set(this.form,'id_date_nd','');
                    this.$set(this.form,'corporation_id_front',[]);
                    this.$set(this.form,'corporation_id_contrary',[]);
                    this.$set(this.form,'company_time','');
                    this.$set(this.form,'company_address_zip','');
                    this.$set(this.form,'status',0);
                    this.$set(this.form,'open_licence',[]);
                    this.$set(this.form,'open_bank','');
                    this.$set(this.form,'open_bank_account','');
                    this.$set(this.form,'open_date','');
                    this.$set(this.form,'channel','');
                }else{
                    console.log(this.originalForm,'this.originalForm');
                    this.$set(this.form,'type',this.originalForm.type);
                    this.$set(this.form,'source',this.originalForm.source);
                    this.$set(this.form,'company',this.originalForm.company);
                    this.$set(this.form,'charter_url',JSON.parse(JSON.stringify(this.originalForm.charter_url)));
                    this.$set(this.form,'business_term_st',this.originalForm.business_term_st);
                    this.$set(this.form,'business_term_nd',this.originalForm.business_term_nd);
                    this.$set(this.form,'company_registration_number',this.originalForm.company_registration_number);
                    this.$set(this.form,'corporation',this.originalForm.corporation);
                    this.$set(this.form,'corporation_identification',this.originalForm.corporation_identification);
                    this.$set(this.form,'id_date_st',this.originalForm.id_date_st);
                    this.$set(this.form,'id_date_nd',this.originalForm.id_date_nd);
                    this.$set(this.form,'corporation_id_front',JSON.parse(JSON.stringify(this.originalForm.corporation_id_front)));
                    this.$set(this.form,'corporation_id_contrary',JSON.parse(JSON.stringify(this.originalForm.corporation_id_contrary)));
                    this.$set(this.form,'company_time',this.originalForm.company_time);
                    this.$set(this.form,'company_address_zip',this.originalForm.company_address_zip);
                    this.$set(this.form,'status',this.originalForm.status);
                    this.$set(this.form,'open_licence',JSON.parse(JSON.stringify(this.originalForm.open_licence)));
                    this.$set(this.form,'open_bank',this.originalForm.open_bank);
                    this.$set(this.form,'open_bank_account',this.originalForm.open_bank_account);
                    this.$set(this.form,'open_date',this.originalForm.open_date);
                    this.$set(this.form,'channel',[]);
                    this.tempChannelData=[];
                    if(this.originalForm.channel===0){
                        this.$set(this,'tempChannelData',this.channels.map(row=>row.label))
                    }else{
                        if(({}.toString.call(this.originalForm.channel))==='[object Array]'){
                            this.channels.forEach(row=>{
                                this.originalForm.channel.forEach(num=>{
                                    if(Number(num)===row.value){
                                        this.tempChannelData.push(row.label);
                                    }
                                })
                            })
                        }
                    }
                }
            },
        },
        props: {
            form:{},
            channels:{
                type:Array,
            },
            flag:{},
            channelData:Array,
            originalForm:{}
        },
        components: {bankCard,multiUpload},
    }
</script>