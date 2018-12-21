<template>
    <el-row class="c-return">
        <rainbow-header title="退货" background-color="#008CD7">
            <div class="fr mt-mini mr-sm" slot="header-right">
                <el-select class="inline width-lg"
                           :disabled="returnList.length<=0"
                           @change="change_return"
                           :placeholder="placeHolder"
                           v-model="form.list.mod_return"
                           filterable clearable>
                    <el-option
                            v-for="res in returnList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                    ></el-option>
                </el-select>
                <el-button class="inline" type="primary" size="mini" @click.native="save_as">另存为</el-button>
            </div>
            <el-form :model="form" label-width="220px">
                <el-form-item label="接受退货：" required>
                    <el-row>
                        <el-col :span="commonSpan">
                            <el-select v-model="form.set.return_policy">
                                <el-option
                                        v-for="item in returnPolicyList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key="item.value"
                                ></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="接受退货方式：" required>
                    <el-row>
                        <el-col :span="commonSpan">
                            <el-select v-model="form.set.return_type">
                                <el-option
                                        v-for="item in returnTypeList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key="item.key"
                                ></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="接受退货周期：" required>
                    <el-row>
                        <el-col :span="commonSpan">
                            <el-select v-model="form.list.return_time">
                                <el-option v-for="item in returnTimeList"
                                           :label="item.label"
                                           :value="item.value"
                                           :key="item.value"
                                ></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="节假日延期退货(holiday return：">
                    <el-checkbox v-model="form.set.extended_holiday">Off extended holiday returns until December 31（节假日延期退货至12月31日）</el-checkbox>
                </el-form-item>
                <el-form-item label="退货邮费承当：">
                    <el-row>
                        <el-col :span="commonSpan">
                            <el-select v-model="form.set.return_shipping_option">
                                <el-option v-for="item in shippingOptions"
                                           :label="item.label"
                                           :value="item.value"
                                           :key="item.key"
                                ></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="折旧费(RestockingFeeValue)：">
                    <el-row>
                        <el-col :span="commonSpan">
                            <el-select v-model="form.set.restocking_fee_code" filterable clearable>
                                <el-option v-for="item in restockingList"
                                           :label="item.label"
                                           :value="item.value"
                                           :key="item.value"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="退货政策详情说明：">
                    <limit-input
                            v-model="form.set.return_description"
                            :is-textarea="true"
                            :maxlength="4000"
                            :custom-autosize="{ minRows: 10, maxRows: 13}"
                            other-remark="(最多4000字符，不支持HTML)"
                    ></limit-input>
                </el-form-item>
            </el-form>
        </rainbow-header>
        <save-as v-model="dialog" @submit="submit"></save-as>
    </el-row>
</template>
<style lang="stylus" scoped>
</style>
<script>
    import {api_common_modeList,api_save_common_model,api_edit_model} from '../../../../../api/ebay-kandeng-public-module';
    export default{
        data(){
            return {
                returnPolicyList:[
                    {label:"Returns Accepted",value:1},
                    {label:"No Returns Accepted",value:0},
                ],
                returnTypeList:[
                    {label:"Money Back",value:"MoneyBack"},
                    {label:"Money back or replacement（buyer's choice）",value:"MoneyBackOrReplacement"},
                    {label:"Money back or exchange（buyer's choice）",value:"MoneyBackOrExchange"},
                ],
                returnTimeList:[
                    {label:"14Days",value:1},
                    {label:"30Days",value:2},
                    {label:"60Days",value:3},
                ],
                shippingOptions:[
                    {label:"Buyer",value:1},
                    {label:"Seller",value:2},
                ],
                restockingList:[
                    {label:"NO",value:"NoRestockingFee"},
                    {label:"10%",value:"Percent_10"},
                    {label:"15%",value:"Percent_15"},
                    {label:"20%",value:"Percent_20"},
                ],
                returnList:[],
                dialog:false,
            }
        },
        computed:{
            placeHolder(){
                if(this.form.list.site===""){
                    return "请选择先站点";
                }else if(this.form.list.site!==""&&this.returnList.length<=0){
                    return "暂无数据";
                }else{
                    return "选择已有模板";
                }
            },
            surplusCom(){
                return Number(23-this.commonSpan);
            },
            surplusLar(){
                return Number(23-this.largeSpan);
            }
        },
        mounted(){
            this.get_return();
        },
        methods:{
            //计算字符的长度
            computed_word(Str,value){
                let len;
                if(Str==null || Str == "")return 0;
                len = Str.length;
                return len;
            },
            /*选择已有模板*/
            change_return(val){
                if(!val){
                    this.form.set.return_policy = "";
                    this.form.set.return_type = "";
                    this.form.list.return_time = "";
                    this.form.set.restocking_fee_code = "";
                    this.form.set.extended_holiday = false;
                    this.form.set.return_shipping_option = "";
                    this.form.set.return_description = "";
                    return;
                }
                let params = {
                    model_type:"returngoods",
                    id:val,
                };
                this.$http(api_edit_model,params).then(res=>{
                    this.form.set.return_policy = res.data.return_policy;
                    this.form.set.return_type = res.data.return_type;
                    this.form.list.return_time = res.data.return_time;
                    this.form.set.restocking_fee_code = res.data.restocking_fee_code;
                    this.form.set.extended_holiday = res.data.extension===1?true:false;
                    this.form.set.return_shipping_option = res.data.return_shipping_option;
                    this.form.set.return_description = res.data.return_description;
                }).catch(code=>{
                        console.log(code);
                })
            },
            /*另存为*/
            save_as(){
                this.dialog = true;
            },
            submit(val){
                if(this.form.list.site===""||!val)return this.$message({type:"warning",message:"站点及另存模板名称为必填！"})
                let model_type = "returngoods";
                let detail = [];
                let obj = {
                    model_type:model_type,
                    model_name:val,
                    site:this.form.list.site,
                    return_policy:this.form.set.return_policy,
                    return_type:this.form.set.return_type,
                    return_time:this.form.list.return_time,
                    restocking_fee_code:this.form.set.restocking_fee_code,
                    extended_holiday:this.form.set.extended_holiday?1:0,
                    return_shipping_option:this.form.set.return_shipping_option,
                    return_description:this.form.set.return_description,
                }
                detail.push(obj);
                let params = {
                    model_type:model_type,
                }
                params.detail = JSON.stringify(detail);
                this.$http(api_save_common_model,params).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message||res
                    });
                    this.dialog = false;
                    this.get_return();
                }).catch(code=>{
                    this.$message({
                        type:"error",
                        message:code.message||code
                    })
                })
            },
            /*获取退货模板*/
            get_return(){
                if(!this.form.list||this.form.list.site==='')return;
                this.returnList = [];
                let params = {
                    model_type:"returngoods",
                    site:this.form.list.site
                };
                this.$http(api_common_modeList,params).then(res=>{
                    this.returnList = res.data.map(row=>{
                        return {
                            label:row.model_name,
                            value:row.id
                        }
                    })
                }).catch(code=>{
                    console.log(code);
                })
            }
        },
        props:{
            form:{},
            commonSpan:{
                require:true,
                type:Number
            },
            largeSpan:{
                require:true,
                type:Number
            }
        },
        components: {
            limitInput:require('./limit-input.vue').default,
            saveAs:require("./save-as.vue").default,
            rainbowHeader:require('@/components/rainbow-header.vue').default,
        }
    }
</script>
