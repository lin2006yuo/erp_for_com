<template>
    <page-dialog v-model="show" :title="title" size="large" class="add-rule" :close-on-click-modal="false">
        <el-row class="mb-md">
            <el-col :span="5" style="text-align: right;line-height:26px;">
                <label for=""><i class="c-r">*</i>{{$t('ebay-list.timeRName')}}：</label>
            </el-col>
            <el-col :span="19">
                <el-input v-model="formData.timing_rule_name" style="width:250px"></el-input>
            </el-col>
        </el-row>
        <el-row class="mb-md l-h">
            <el-col :span="5" style="text-align: right;line-height:26px;">
                <i class="c-r">*</i>{{$t('ebay-list.dayTimes')}}：
            </el-col>
            <el-col :span="19">
                <el-row class="mb-sm">
                    <el-radio class="radio" v-model="formData.timing_fre" :label=1>
                        {{$t('ebay-list.segmentTime')}}
                    </el-radio><br />
                    {{$t('ebay-list.sTime')}}：<el-time-select v-model="start_date" class="inline" :disabled="freDisOne"
                                         :picker-options="{
                          start: '00:01',
                          step: '00:10',
                          end: '23:51'
                        }"
                                         :placeholder="$t('ebay-list.selectTime')"
                                         style="width: 125px;"></el-time-select>&nbsp;&nbsp;{{$t('ebay-list.eTime')}}：
                    <el-time-select v-model="end_date" class="inline" :disabled="freDisOne"
                                    :picker-options="{
                          start: '00:01',
                          step: '00:10',
                          end: '23:51',
                          minTime: start_date
                        }"
                                    :placeholder="$t('ebay-list.selectTime')"
                                    style="width: 125px;"></el-time-select>&nbsp;&nbsp;{{$t('ebay-list.HourlyU')}}
                    <integer-input v-model="formData.count" :min="0"
                                   :disabled="freDisOne"
                                   class="inline"
                                   style="width:100px"
                    ></integer-input>{{$t('ebay-list.upload')}}
                </el-row>
                <el-row>
                    <el-radio class="radio" v-model="formData.timing_fre" :label=2>
                        {{$t('ebay-list.intervals')}}
                    </el-radio><br />
                    {{$t('ebay-list.sTime')}}：<el-time-select v-model="start_interval" class="inline" :disabled="freDisTwo"
                                         :picker-options="{
                          start: '00:01',
                          step: '00:10',
                          end: '23:51'
                        }"
                                         :placeholder="$t('ebay-list.selectTime')"
                                         style="width: 125px;"></el-time-select>&nbsp;&nbsp;{{$t('ebay-list.every')}}
                    <integer-input v-model="formData.count_interval" :min="0"
                                   :disabled="freDisTwo"
                                   class="inline"
                                   style="width:100px"
                    ></integer-input>
                    {{$t('ebay-list.everyU')}} {{ $t('ebay-list.mostU')}}
                    <integer-input v-model="formData.total_count" :min="0"
                                   :disabled="freDisTwo"
                                   class="inline"
                                   style="width:100px"
                    ></integer-input>{{$t('ebay-list.upload')}}
                </el-row>
            </el-col>
        </el-row>
        <el-row class="mb-md l-h">
            <el-col :span="5" style="text-align: right;line-height:26px;">
                <i class="c-r">*</i>{{$t('ebay-list.effectiveTime')}}：
            </el-col>
            <el-col :span="19">
                <el-row class="mb-sm">
                    <el-radio class="radio" v-model="formData.validity" :label=1>
                        按已刊登量
                    </el-radio><br />
                    {{$t('ebay-list.sTime')}}：<el-date-picker
                    v-model="start_count"
                    type="date"
                    placeholder="选择日期"
                    :disabled="validityOne" class="inline" style="width: 125px">
                </el-date-picker>&nbsp;&nbsp;{{$t('ebay-list.op')}}
                    <integer-input v-model="formData.count_val" :min="0"
                                   :disabled="validityOne"
                                   class="inline"
                                   style="width:100px"
                    ></integer-input>{{$t('ebay-list.opo')}}
                </el-row>
                <el-row>
                    <el-radio class="radio" v-model="formData.validity" :label=2>
                        {{$t('ebay-list.timeRange')}}
                    </el-radio><br />
                    {{$t('ebay-list.sTime')}}：<el-date-picker
                    v-model="start_validity"
                    type="date"
                    :placeholder="$t('ebay-list.selDate')"
                    :picker-options="pickerstart" :disabled="validityTwo" class="inline" style="width: 125px">
                </el-date-picker>&nbsp;&nbsp;
                    {{$t('ebay-list.eTime')}}：<el-date-picker
                    v-model="end_validity"
                    type="date"
                    :placeholder="$t('ebay-list.selDate')"
                    :picker-options="pickerend" :disabled="validityTwo" class="inline" style="width: 125px">
                </el-date-picker>
                </el-row>
            </el-col>
        </el-row>
        <el-row class="mb-md l-h">
            <el-col :span="5" style="text-align: right;line-height:26px;">
                {{$t('ebay-list.note')}}：
            </el-col>
            <el-col :span="19">
                <el-input type="textarea"
                    :autosize="{ minRows: 3, maxRows: 4}"
                          :placeholder="$t('ebay-list.notes')"
                    v-model="formData.remark"
                    style="width: 600px;">
                </el-input>
            </el-col>
        </el-row>
        <el-row class="l-h">
            <el-col :span="5" style="text-align: right;line-height:26px;">
                {{$t('ebay-list.des')}}：
            </el-col>
            <el-col :span="18" >
                <span>{{detail}}</span>
            </el-col>
        </el-row>
        <el-row class="mb-lg l-h">
            <el-col :span="5">&nbsp;</el-col>
            <el-col :span="19">
                {{$t('ebay-list.tStandard')}}
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <span v-if="!isModel">
                <el-button type="primary" size="mini" v-if="isEdit" @click.native="save_rule">{{$t('ebay-list.saveStandard')}}</el-button>
                <el-button type="primary" size="mini" @click.native="add_model">{{$t('ebay-list.template')}}</el-button>
            </span>
            <!--确定按钮在 eBay刊登-》范本管理--》添加定时刊登 中使用-->
            <el-button type="primary" size="mini"  v-else
                       @click.native="add_model"> {{$t('common.confirm')}}</el-button>
            <el-button size="mini" @click.native="closed">{{$t('common.cancel')}}</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .add-rule
        .c-r
            color red
            font-weight bolder
            padding 0px 3px
        .l-h
            line-height 26px
        .radio-color
            color #ccc
</style>
<script>
    import {api_save_timing_rule} from '../../../../api/ebay-kandeng-public-module'
    export default{
        data(){
            return{
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.end_validity){
                            return  time.getTime() > Date.parse(new Date(this.end_validity));
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.start_validity){
                            return  time.getTime() < Date.parse(new Date(this.start_validity));
                        }else {
                            return false
                        }
                    }
                },
                show:this.value,
                isEdit:false,
            }
        },
        methods:{
            rule_data(){
                let data = {
                    id:this.formData.id ? this.formData.id :"",
                    timing_rule_name:this.formData.timing_rule_name,
                    timing_fre:this.formData.timing_fre,
                    start_date:(this.formData.timing_fre===1 && this.start_date) ? `${this.start_date}:00` : "",
                    end_date:(this.formData.timing_fre===1 && this.end_date) ? `${this.end_date}:00` : "",
                    count:this.formData.timing_fre===1 ? this.formData.count : "",
                    start_interval:(this.formData.timing_fre===2 && this.start_interval) ? `${this.start_interval}:00` : "",
                    count_interval:this.formData.timing_fre===2? this.formData.count_interval : "",
                    total_count:this.formData.timing_fre===2 ? this.formData.total_count : "",
                    validity:this.formData.validity,
                    start_count:(this.formData.validity===1 && this.start_count) ? this.start_count : "",
                    count_val:this.formData.validity===1 ? this.formData.count_val : "",
                    start_validity:(this.formData.validity===2&& this.start_validity) ? this.start_validity : "",
                    end_validity:(this.formData.validity===2&& this.end_validity) ? this.end_validity : "",
                    remark:this.formData.remark,
                    detail:this.detail,
                    draft_ids:this.formData.draft_ids ? this.formData.draft_ids : "",
                }
                return data
            },
//            提示:
            prompt(data){
            	let flag = 0;
            	if(!data.timing_rule_name){
                    this.$message({message:this.$t('ebay-list.non'),type:'error'});
                    return flag;
                }
                if(!data.timing_fre){
                    this.$message({message:this.$t('ebay-list.SelTiming'),type:'error'});
                    return flag;
                }else{
                    if(data.timing_fre===1){
                    	if(data.start_date==="" || data.end_date==="" || data.count===""){
                            this.$message({type:"warning",message:this.$t('ebay-list.ki')});
                            return flag;
                        }
                    }else{
                        if(data.start_interval==="" || data.count_interval==="" ||data.total_count===""){
                            this.$message({type:"warning",message:this.$t('ebay-list.ki')});
                            return flag;
                        }
                    }
                }
                if(!data.validity){
                    this.$message({message:"请选择有效时间",type:'error'});
                    return flag;
                }else{
                    if(data.validity===1){
                        if(!data.start_count || !data.count_val ){
                            this.$message({type:"warning",message:this.$t('ebay-list.yu')});
                            return flag;
                        }
                    }else{
                        if(!data.start_validity || !data.end_validity){
                            this.$message({type:"warning",message:this.$t('ebay-list.yu')});
                            return flag;
                        }
                    }
                }
                flag = 1;
                return flag;
            },
            save_rule(){
                let data = this.rule_data();
                let opreate = this.prompt(data);
                if(opreate){
                    return this.$http(api_save_timing_rule,data).then(res=>{
                        this.$message({
                            type:"success",
                            message: res.message || res
                        });
                        this.$emit("finished-add",data,res.data);
                        this.show = false;
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    })
                }
            },
            add_model(){
                let data = this.rule_data();
                let opreate = this.prompt(data);
                if(opreate) {
                    this.$emit("add-rule", data);
                    this.show = false;
                }
            },
            closed(){
                this.show = false;
            }
        },
        computed:{
            detail(){
                if(this.formData.timing_fre===1&&this.formData.validity===1){
                    return `${this.$t('ebay-list.everyday')}${this.start_date}${this.$t('ebay-list.to')}${this.end_date}${this.$t('ebay-list.HourlyU')} ${this.formData.count}${this.$t('ebay-list.poh')}${this.start_count}${this.$t('ebay-list.beginning')}，${this.$t('ebay-list.op')}${this.formData.count_val}${this.$t('ebay-list.opo')}。`
                } else if(this.formData.timing_fre===1&&this.formData.validity===2) {
                    return `${this.$t('ebay-list.everyday')}${this.start_date}${this.$t('ebay-list.to')}${this.end_date}${this.$t('ebay-list.HourlyU')} ${this.formData.count}${this.$t('ebay-list.poh')}${this.start_validity}${this.$t('ebay-list.beginning')}，${this.$t('ebay-list.to')}${this.end_validity}${this.$t('ebay-list.ending')}。`
                } else if(this.formData.timing_fre===2&&this.formData.validity===1) {
                    return `${this.$t('ebay-list.everyday')}${this.start_interval}${this.$t('ebay-list.beginning')}，${this.$t('ebay-list.every')}${this.formData.count_interval}${this.$t('ebay-list.everyU')}，${this.$t('ebay-list.uploadLimit')}${this.formData.total_count}${this.$t('ebay-list.poh')}${this.start_count}${this.$t('ebay-list.beginning')}，${this.$t('ebay-list.op')}${this.formData.count_val}${this.$t('ebay-list.opo')}。`
                } else if(this.formData.timing_fre===2&&this.formData.validity===2) {
                    return `${this.$t('ebay-list.everyday')}${this.start_interval}${this.$t('ebay-list.beginning')}，${this.$t('ebay-list.every')}${this.formData.count_interval}${this.$t('ebay-list.everyU')}，${this.$t('ebay-list.uploadLimit')}${this.formData.total_count}${this.$t('ebay-list.poh')}${this.start_validity}${this.$t('ebay-list.beginning')}，${this.$t('ebay-list.to')}${this.end_validity}${this.$t('ebay-list.ending')}。`
                } else {
                    return `${this.$t('ebay-list.rules')}`
                }
            },
            start_date:{
                get(){
                    if(!!this.formData.start_date){
                        if(!isNaN(this.formData.start_date)){
                            return datef("HH:mm",this.formData.start_date);
                        } else{
                        	let index = this.formData.start_date.indexOf(":00")
                        	if(index!==-1){
                                this.formData.start_date=this.formData.start_date.replace(":00","")
                            }
                            return this.formData.start_date
                        }
                    } else {
                        return ""
                    }
                },
                set(val){
                    this.formData.start_date = val;
                }
            },
            end_date: {
                get(){
                    if (this.formData.end_date) {
                        if (!isNaN(this.formData.end_date)) {
                            return datef("HH:mm", this.formData.end_date)
                        } else{
                            let index = this.formData.end_date.indexOf(":00");
                            if(index!==-1){
                                this.formData.end_date=this.formData.end_date.replace(":00","")
                            }
                            return this.formData.end_date
                        }
                    } else {
                        return ""
                    }
                },
                set(val){
                    this.formData.end_date = val;
                }
            },
            start_interval:{
                get(){
                    if (this.formData.start_interval) {
                        if(!isNaN(this.formData.start_interval)){
                            return datef("HH:mm",this.formData.start_interval)
                        } else{
                            let index = this.formData.start_interval.indexOf(":00");
                            if(index!==-1){
                                this.formData.start_interval=this.formData.start_interval.replace(":00","")
                            }
                            return this.formData.start_interval
                        }
                    } else {
                        return ""
                    }
                },
                set(val){
                    this.formData.start_interval = val;
                }
            },
            start_count:{
                get(){
                    if (this.formData.start_count) {
                        if (!isNaN(this.formData.start_count)) {
                            return datef("YYYY-MM-dd", this.formData.start_count)
                        } else {
                            return this.formData.start_count
                        }
                    } else {
                        return ""
                    }
                },
                set(val){
                    if(!!val){
                        this.formData.start_count = datef("YYYY-MM-dd", val/1000);
                    }else{
                        this.formData.start_count = "";
                    }
                }
            },
            start_validity:{
                get(){
                    if (this.formData.start_validity) {
                        if (!isNaN(this.formData.start_validity)) {
                            return datef("YYYY-MM-dd", this.formData.start_validity)
                        } else {
                            return this.formData.start_validity
                        }
                    } else {
                        return ""
                    }
                },
                set(val){
                    if(!!val){
                        this.formData.start_validity = datef("YYYY-MM-dd", val/1000);
                    }else{
                        this.formData.start_validity = "";
                    }
                }
            },
            end_validity:{
                get(){
                    if (this.formData.end_validity) {
                        if (!isNaN(this.formData.end_validity)) {
                            return datef("YYYY-MM-dd", this.formData.end_validity)
                        } else {
                            return this.formData.end_validity
                        }
                    } else {
                        return ""
                    }
                },
                set(val){
                	if(!!val){
                        this.formData.end_validity = datef("YYYY-MM-dd", val/1000);
                    }else{
                        this.formData.end_validity = "";
                    }
                }
            },
            freDisOne(){
                if(this.formData.timing_fre&&this.formData.timing_fre===1){
                    return false;
                }else{
                    return true;
                }
            },
            freDisTwo(){
                if(this.formData.timing_fre&&this.formData.timing_fre===2){
                    return false;
                }else{
                    return true;
                }
            },
            validityOne(){
                if(this.formData.validity&&this.formData.validity===1){
                    return false;
                }else{
                    return true;
                }
            },
            validityTwo(){
                if(this.formData.validity&&this.formData.validity===2){
                    return false;
                }else{
                    return true;
                }
            }
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            },
        },
        filters:{
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            formData:{},
            title:{},
            /*用于eBay刊登-》范本管理--》添加定时刊登
            * */
            isModel:{
                type:Boolean,
                default(){
                    return false
                }
            },
        },
        components: {
            pageDialog:require('../../../../components/page-dialog.vue').default,
            integerInput:require("../../../../components/integer-input.vue").default
        }
    }
</script>
