<template>
    <page-dialog v-model="show" :title="title" size="large" class="add-rule" :close-on-click-modal="false">
        <el-row class="mb-md">
            <el-col :span="5" style="text-align: right;line-height:26px;">
                <label for=""><i class="c-r">*</i>定时规则名称：</label>
            </el-col>
            <el-col :span="19">
                <el-input v-model="formData.timing_rule_name" style="width:250px"></el-input>
            </el-col>
        </el-row>
        <el-row class="mb-md l-h">
            <el-col :span="5" style="text-align: right;line-height:26px;">
                <i class="c-r">*</i>每天执行频率：
            </el-col>
            <el-col :span="19">
                <el-row class="mb-sm">
                    <el-radio class="radio" v-model="formData.timing_fre" :label=1>
                        按分段时间执行
                    </el-radio><br />
                    开始时间：<el-time-select v-model="start_date" class="inline" :disabled="freDisOne"
                                         :picker-options="{
                          start: '00:01',
                          step: '00:10',
                          end: '23:51'
                        }"
                                         placeholder="选择时间"
                                         style="width: 125px;"></el-time-select>&nbsp;&nbsp;结束时间：
                    <el-time-select v-model="end_date" class="inline" :disabled="freDisOne"
                                    :picker-options="{
                          start: '00:01',
                          step: '00:10',
                          end: '23:51',
                          minTime: start_date
                        }"
                                    placeholder="选择时间"
                                    style="width: 125px;"></el-time-select>&nbsp;&nbsp;均时上传
                    <integer-input v-model="formData.count" :min="0"
                                   :disabled="freDisOne"
                                   class="inline"
                                   style="width:100px"
                    ></integer-input>个刊登
                </el-row>
                <el-row>
                    <el-radio class="radio" v-model="formData.timing_fre" :label=2>
                        按间隔时间执行
                    </el-radio><br />
                    开始时间：<el-time-select v-model="start_interval" class="inline" :disabled="freDisTwo"
                                         :picker-options="{
                          start: '00:01',
                          step: '00:10',
                          end: '23:51'
                        }"
                                         placeholder="选择时间"
                                         style="width: 125px;"></el-time-select>&nbsp;&nbsp;每
                    <integer-input v-model="formData.count_interval" :min="0"
                                   :disabled="freDisTwo"
                                   class="inline"
                                   style="width:100px"
                    ></integer-input>
                    分钟上传一个刊登&nbsp;&nbsp;每天最多上传
                    <integer-input v-model="formData.total_count" :min="0"
                                   :disabled="freDisTwo"
                                   class="inline"
                                   style="width:100px"
                    ></integer-input>个刊登
                </el-row>
            </el-col>
        </el-row>
        <el-row class="mb-md l-h">
            <el-col :span="5" style="text-align: right;line-height:26px;">
                <i class="c-r">*</i>规则有效时间：
            </el-col>
            <el-col :span="19">
                <el-row class="mb-sm">
                    <el-radio class="radio" v-model="formData.validity" :label=1>
                        按已刊登量
                    </el-radio><br />
                    开始时间：<el-date-picker
                    v-model="start_count"
                    type="date"
                    placeholder="选择日期"
                    :disabled="validityOne" class="inline" style="width: 125px">
                </el-date-picker>&nbsp;&nbsp;当执行
                    <integer-input v-model="formData.count_val" :min="0"
                                   :disabled="validityOne"
                                   class="inline"
                                   style="width:100px"
                    ></integer-input>个刊登后，结束规则
                </el-row>
                <el-row>
                    <el-radio class="radio" v-model="formData.validity" :label=2>
                        按时间范围
                    </el-radio><br />
                    开始时间：<el-date-picker
                    v-model="start_validity"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="pickerstart" :disabled="validityTwo" class="inline" style="width: 125px">
                </el-date-picker>&nbsp;&nbsp;
                    结束时间：<el-date-picker
                    v-model="end_validity"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="pickerend" :disabled="validityTwo" class="inline" style="width: 125px">
                </el-date-picker>
                </el-row>
            </el-col>
        </el-row>
        <el-row class="mb-md l-h">
            <el-col :span="5" style="text-align: right;line-height:26px;">
                备注：
            </el-col>
            <el-col :span="19">
                <el-input type="textarea"
                    :autosize="{ minRows: 3, maxRows: 4}"
                    placeholder="请输入备注"
                    v-model="formData.remark"
                    style="width: 600px;">
                </el-input>
            </el-col>
        </el-row>
        <el-row class="l-h">
            <el-col :span="5" style="text-align: right;line-height:26px;">
                描述：
            </el-col>
            <el-col :span="18" >
                <span>{{detail}}</span>
            </el-col>
        </el-row>
        <el-row class="mb-lg l-h">
            <el-col :span="5">&nbsp;</el-col>
            <el-col :span="19">
                （刊登日期和时间为此 eBay 站点的当地时间）
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <span v-if="!isModel">
                <el-button type="primary" size="mini" v-if="isEdit" @click.native="save_rule">保存定时规则</el-button>
                <el-button type="primary" size="mini" @click.native="add_model">添加定时范本</el-button>
            </span>
            <!--确定按钮在 eBay刊登-》范本管理--》添加定时刊登 中使用-->
            <el-button type="primary" size="mini"  v-else
                       @click.native="add_model">确定</el-button>
            <el-button size="mini" @click.native="closed">取消</el-button>
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
                    this.$message({message:"请填写定时刊登规则名称",type:'error'});
                    return flag;
                }
                if(!data.timing_fre){
                    this.$message({message:"请选择执行频率",type:'error'});
                    return flag;
                }else{
                    if(data.timing_fre===1){
                    	if(data.start_date==="" || data.end_date==="" || data.count===""){
                            this.$message({type:"warning",message:"频率信息为必填项，请完善*标必填数据！"});
                            return flag;
                        }
                    }else{
                        if(data.start_interval==="" || data.count_interval==="" ||data.total_count===""){
                            this.$message({type:"warning",message:"频率信息为必填项，请完善*标必填数据！"});
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
                            this.$message({type:"warning",message:"有效时间为必填项，请完善*标必填数据！"});
                            return flag;
                        }
                    }else{
                        if(!data.start_validity || !data.end_validity){
                            this.$message({type:"warning",message:"有效时间为必填项，请完善*标必填数据！"});
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
                    return `每天从${this.start_date}到${this.end_date}均时上传 ${this.formData.count}个刊登；刊登由${this.start_count}开始，当执行${this.formData.count_val}个刊登后，规则结束。`
                } else if(this.formData.timing_fre===1&&this.formData.validity===2) {
                    return `每天从${this.start_date}到${this.end_date}均时上传 ${this.formData.count}个刊登；刊登由${this.start_validity}开始，到${this.end_validity}结束。`
                } else if(this.formData.timing_fre===2&&this.formData.validity===1) {
                    return `每天从${this.start_interval}开始，每${this.formData.count_interval}分钟上传一个刊登，每天最多上传${this.formData.total_count}个刊登；刊登由${this.start_count}开始，当执行${this.formData.count_val}个刊登后，规则结束。`
                } else if(this.formData.timing_fre===2&&this.formData.validity===2) {
                    return `每天从${this.start_interval}开始，每${this.formData.count_interval}分钟上传一个刊登，每天最多上传${this.formData.total_count}个刊登；刊登由${this.start_validity}开始，到${this.end_validity}结束。`
                } else {
                    return `请先选择规则`
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
