<template>
    <el-form ref="companyInfo"
             :model="form"
             label-width="130px"
             :rules="rules"
             class="c-company-info">
        <el-form-item label="添加时间："
                      v-if="flag===1"
                      prop="create_time">
            <span>{{form.create_time|fmsdatetime}}</span>
        </el-form-item>
        <el-form-item label="公司名称："
                      prop="company">
            <el-input v-model="form.company"
                      v-if="!flag||(flag===2&&edit)"></el-input>
            <span v-else>{{form.company}}</span>
        </el-form-item>
        <el-form-item label="营业执照图片："
                      prop="charter_url">
            <upload-img :images="businessImage"
                        :edit="!flag||(flag===2&&edit)">
            </upload-img>
        </el-form-item>
        <el-form-item label="公司类型："
                      prop="company_type">
            <el-input v-model="form.company_type"
                      v-if="!flag||(flag===2&&edit)"></el-input>
            <span v-else>{{form.company_type}}</span>
        </el-form-item>
        <el-form-item label="公司注册号："
                      prop="company_registration_number">
            <el-input v-model="form.company_registration_number"
                      v-if="!flag||(flag===2&&edit)"></el-input>
            <span v-else>{{form.company_registration_number}}</span>
        </el-form-item>
        <el-form-item label="公司法人："
                      prop="corporation">
            <el-input v-model="form.corporation"
                      v-if="!flag||(flag===2&&edit)"></el-input>
            <span v-else>{{form.corporation}}</span>
        </el-form-item>
        <el-form-item label="法人身份证号："
                      prop="corporation_id">
            <el-input v-model="form.corporation_id"
                      v-if="!flag||(flag===2&&edit)"></el-input>
            <span v-else>{{form.corporation_id}}</span>
        </el-form-item>
        <el-form-item label="身份证正面照："
                      prop="corporation_id_front">
            <upload-img :images="frontID"
                        :edit="!flag||(flag===2&&edit)">
            </upload-img>
        </el-form-item>
        <el-form-item label="身份证反面照："
                      prop="corporation_id_contrary">
            <upload-img :images="backID"
                        :edit="!flag||(flag===2&&edit)">
            </upload-img>
        </el-form-item>
        <el-form-item label="公司成立时间："
                      prop="company_time">
            <el-date-picker  v-if="!flag||(flag===2&&edit)"
                             v-model="form.company_time"
                             type="date"
                             placeholder="选择日期"
                             :picker-options="pickerOptions">
            </el-date-picker>
            <span v-else>{{form.company_time|fymd}}</span>
        </el-form-item>
        <el-form-item label="公司注册地址+邮编："
                      prop="company_address_zip">
            <el-input v-model="form.company_address_zip"
                      v-if="!flag||(flag===2&&edit)"></el-input>
            <span v-else>{{form.company_address_zip}}</span>
        </el-form-item>
        <el-form-item label="法人地址+邮编："
                      prop="corporation_address_zip">
            <el-input v-model="form.corporation_address_zip"
                      v-if="!flag||(flag===2&&edit)"></el-input>
            <span v-else>{{form.corporation_address_zip}}</span>
        </el-form-item>
        <el-form-item label="状态："
                      prop="status">
            <el-switch v-model="form.status"
                       on-text="启用"
                       off-text="停用"
                       :on-value="0"
                       :off-value="1"
                       :disabled="flag===1||(flag===2&&!edit)"></el-switch>
        </el-form-item>
        <el-form-item label="适用平台："
                      prop="channel">
            <el-checkbox v-model="checked"
                         @change="inverse"
                         :disabled="flag===1||(flag===2&&!edit)">反选
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
                             :disabled="flag===1||(flag===2&&!edit)">{{channel.label}}
                </el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="" v-if="flag!==1">
            <el-button size="mini"
                       v-if="!flag||(flag===2&&edit)"
                       :disabled="disabled"
                       @click.native="submit"
                       type="primary">确 定
            </el-button>
            <el-button size="mini"
                       v-if="!flag||(flag===2&&edit)"
                       @click.native="restore">取 消
            </el-button>
            <el-button size="mini"
                       v-if="(flag===2&&!edit)"
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
    import uploadImg from './upload-img';
    export default {
        name: "company-info",
        data() {
            return {
                rules:{
                    company:[{required:true,message:'请输入公司名称',trigger:'blur'}],
                },
                pickerOptions:{
                    disabledDate: (time)=> {
                        return time.getTime() > Date.now();
                    }
                },
                checked:false,
                disabled:false,
                tempChannelData:this.channelData,
                edit:true,
                businessImage:this.businessPicture,
                frontID:this.IDFront,
                backID:this.IDBack
            }
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
                this.disabled=true;
                this.$emit('company');
                this.disabled=false;
                this.edit=false;
            },
            validator() {
                let flag = false;
                this.$refs.companyInfo.validate((valid) => {
                    flag = valid;
                });
                return flag
            },
            restore(){
                console.log(this.flag,'tset flag');
                if(!this.flag){
                    this.$set(this.form,'company','');
                    this.businessImage=[];
                    this.$set(this.form,'company_type','');
                    this.$set(this.form,'company_registration_number','');
                    this.$set(this.form,'corporation','');
                    this.$set(this.form,'corporation_id','');
                    this.frontID=[];
                    this.backID=[];
                    this.$set(this.form,'company_time','');
                    this.$set(this.form,'company_address_zip','');
                    this.$set(this.form,'corporation_address_zip','');
                    this.$set(this.form,'status',0);
                    this.tempChannelData=[];
                }else{
                    this.$set(this.form,'company',this.originalForm.company);
                    this.businessImage=[];
                    this.originalForm.charter_url&&this.$set(this,'businessImage',[{name:this.originalForm.charter_url}]);
                    this.$set(this.form,'company_type',this.originalForm.company_type);
                    this.$set(this.form,'company_registration_number',this.originalForm.company_registration_number);
                    this.$set(this.form,'corporation',this.originalForm.corporation);
                    this.$set(this.form,'corporation_id',this.originalForm.corporation_id);
                    this.frontID=[];
                    this.originalForm.corporation_id_front&&this.$set(this,'frontID',[{name:this.originalForm.corporation_id_front}]);
                    this.backID=[];
                    this.originalForm.corporation_id_contrary&&this.$set(this,'backID',[{name:this.originalForm.corporation_id_contrary}]);
                    this.$set(this.form,'company_time',this.originalForm.company_time?this.originalForm.company_time:'');
                    this.$set(this.form,'company_address_zip',this.originalForm.company_address_zip);
                    this.$set(this.form,'corporation_address_zip',this.originalForm.corporation_address_zip);
                    this.$set(this.form,'status',this.originalForm.status);
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
            businessPicture:{},
            IDFront:{},
            IDBack:{},
            channelData:{
                type:Array
            },
            originalForm:{}
        },
        components: {uploadImg},
    }
</script>


