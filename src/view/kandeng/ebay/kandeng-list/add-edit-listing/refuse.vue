<template>
    <el-row class="c-refuse">
        <rainbow-header title="买家限制" background-color="#0075C2">
            <div class="fr mt-mini mr-sm" slot="header-right">
                <el-select class="inline width-lg"
                           :placeholder="placeholder"
                           :value="form.list.mod_refuse"
                           @input="(val)=>{change_refuse_model(val)}"
                           :disabled="refuseList&&refuseList.length<=0"
                           filterable clearable>
                    <el-option
                        v-for="res in refuseList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                    ></el-option>   
                </el-select>   
                <el-button class="inline" type="primary" size="mini" @click.native="save_as">另存为</el-button>
            </div>
            <el-form :model="form" label-width="220px">
                <el-form-item label="买家要求：">
                    <el-radio-group v-model="form.list.disable_buyer" @change="change_refuse">
                        <div class="mb-sm">
                            <el-radio  :label="0">允许所有买家购买我的物品</el-radio>
                        </div>
                        <div>
                            <el-radio  :label="1">不允许以下买家购买我的物品</el-radio>
                        </div>
                    </el-radio-group>
                    <template v-for="item in form.set.buyer_requirment_details">
                        <div class="ml-sm">
                            <el-checkbox :disabled="form.list.disable_buyer===0"
                                         v-model="item.link_paypal">没有 PayPal 账户</el-checkbox>
                        </div>
                        <div class="ml-sm">
                            <el-checkbox :disabled="form.list.disable_buyer===0"
                                         v-model="item.registration">主要运送地址在我的运送范围之外</el-checkbox>
                        </div>
                        <div class="ml-sm">
                            <el-checkbox  :disabled="form.list.disable_buyer===0"
                                          v-model="item.strikes">
                                曾收到<el-select class="inline width-xs"
                                              :disabled="form.list.disable_buyer===0"
                                              v-model="item.strikes_count">
                                <el-option v-for="res in discardNumber"
                                           :label="res.label"
                                           :value="res.value"
                                           :key="res.value"></el-option>
                            </el-select>个弃标个案，在过去
                                <el-select class="inline width-xs"
                                           :disabled="form.list.disable_buyer===0"
                                           v-model="item.strikes_period">
                                    <el-option v-for="res in cycleTime"
                                               :label="res.label"
                                               :value="res.value"
                                               :key="res.value"
                                    ></el-option>
                                </el-select>天
                            </el-checkbox>
                        </div>
                        <div class="ml-sm">
                            <el-checkbox  :disabled="form.list.disable_buyer===0"
                                          v-model="item.violations">
                                曾收到<el-select class="inline width-xs"
                                              :disabled="form.list.disable_buyer===0"
                                              v-model="item.violations_count">
                                <el-option v-for="res in violationsNumber"
                                           :label="res.label"
                                           :value="res.value"
                                           :key="res.value"
                                ></el-option>
                            </el-select>个违反政策检举，在过去
                                <el-select class="inline width-xs"
                                           :disabled="form.list.disable_buyer===0"
                                           v-model="item.violations_period">
                                    <el-option v-for="res in violationsPeriod"
                                               :label="res.label"
                                               :value="res.value"
                                               :key="res.value"
                                    ></el-option>
                                </el-select>天
                            </el-checkbox>
                        </div>
                        <div class="ml-sm">
                            <el-checkbox  :disabled="form.list.disable_buyer===0"
                                          v-model="item.credit">
                                信用指标等于或低于
                                <el-select  class="inline width-xs"
                                            :disabled="form.list.disable_buyer===0"
                                            v-model="item.requirements_feedback_score">
                                    <el-option v-for="res in creditScore"
                                               :label="res.label"
                                               :value="res.value"
                                               :key="res.value"></el-option>
                                </el-select>
                            </el-checkbox>
                        </div>
                        <div class="ml-sm">
                            <el-checkbox  :disabled="form.list.disable_buyer===0"
                                          v-model="item.requirements">
                                在过去10天内曾出价或购买我的物品，已达到我所设定的限制
                                <el-select  class="inline width-xs"
                                            :disabled="form.list.disable_buyer===0"
                                            v-model="item.requirements_max_count">
                                    <el-option v-for="res in requirementsCount"
                                               :label="res.label"
                                               :value="res.value"
                                               :key="res.value"
                                    ></el-option>
                                </el-select>
                            </el-checkbox>
                        </div>
                        <div class="ml-sm">
                            <el-checkbox  :disabled="form.list.disable_buyer===0"
                                          v-model="item.minimum_feedback">
                                这项限制只适用于买家信用指数等于或低于
                                <el-select class="inline width-xs"
                                           :disabled="form.list.disable_buyer===0"
                                           v-model="item.minimum_feedback_score">
                                    <el-option v-for="res in scoreList"
                                               :label="res.label"
                                               :value="res.value"
                                               :key="res.value"
                                    ></el-option>
                                </el-select>
                            </el-checkbox>
                        </div>
                    </template>
                </el-form-item>
            </el-form>
        </rainbow-header>
        <save-as v-model="dialog" @submit="submit"></save-as>
    </el-row>
</template>
<style lang="stylus" scoped>
</style>
<script>
    import {change_refuse_model} from'./batch_methods';
    import {api_common_modeList,api_save_common_model,api_edit_model} from '../../../../../api/ebay-kandeng-public-module';
    export default{
        data(){
            return {
                dialog:false,
                discardNumber:[
                    {label:"2",value:2},
                    {label:"3",value:3},
                    {label:"4",value:4},
                    {label:"5",value:5},
                ],
                cycleTime:[
                    {label:"30",value:"Days_30"},
                    {label:"180",value:"Days_180"},
                    {label:"360",value:"Days_360"},
                ],
                violationsNumber:[
                    {label:"4",value:4},
                    {label:"5",value:5},
                    {label:"6",value:6},
                    {label:"7",value:7},
                ],
                violationsPeriod:[
                    {label:"30",value:"Days_30"},
                    {label:"180",value:"Days_180"},
                ],
                creditScore:[
                    {label:"-1",value:-1},
                    {label:"-2",value:-2},
                    {label:"-3",value:-3},
                ],
                requirementsCount:[
                    {label:"1",value:1},
                    {label:"2",value:2},
                    {label:"3",value:3},
                    {label:"4",value:4},
                    {label:"5",value:5},
                    {label:"6",value:6},
                    {label:"7",value:7},
                    {label:"8",value:8},
                    {label:"9",value:9},
                    {label:"10",value:10},
                    {label:"25",value:25},
                    {label:"50",value:50},
                    {label:"75",value:75},
                    {label:"100",value:100},
                ],
                scoreList:[
                    {label:"0",value:0},
                    {label:"1",value:1},
                    {label:"2",value:2},
                    {label:"3",value:3},
                    {label:"4",value:4},
                    {label:"5",value:5},
                ],
                refuseList:[]
            }
        },
        created(){
            this.get_refuse();
        },
        computed:{
            placeholder(){
                if(this.refuseList.length<=0){
                    return "暂无数据";
                }else{
                    return "请选择已有模板";

                }
            }
        },
        methods:{
            change_refuse_model,
            /*另存为*/
            save_as(){
                this.dialog = true;
            },
            submit(val){
                let model_type = "refuse";
                let detail = [];
                this.form.set.buyer_requirment_details.forEach(row=>{
                    let obj = {
                        model_type:model_type,
                        model_name:val,
                        refuse:this.form.list.disable_buyer,
                        link_paypal:row.link_paypal?1:0,
                        registration:row.registration?1:0,
                        violations:row.violations?1:0,
                        violations_count:row.violations_count,
                        violations_period:row.violations_period,
                        strikes:row.strikes?1:0,
                        strikes_count:row.strikes_count,
                        strikes_period:row.strikes_period,
                        credit:row.credit?1:0,
                        requirements_feedback_score:row.requirements_feedback_score,
                        requirements:row.requirements?1:0,
                        requirements_max_count:row.requirements_max_count,
                        minimum_feedback:row.minimum_feedback?1:0,
                        minimum_feedback_score:row.minimum_feedback_score,
                    };
                    detail.push(obj);
                });
                let params = {
                    model_type:model_type
                };
                params.detail = JSON.stringify(detail);
                this.$http(api_save_common_model,params).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message||res
                    });
                    this.dialog = false;
                    this.get_refuse();
                }).catch(code=>{
                    this.$message({
                        type:"error",
                        message:code.message||code
                    });
                })
            },
            change_refuse(val){
                this.form.set.buyer_requirment_details.forEach(row=>{
                    row.link_paypal = false;
                    row.registration = false;
                    row.strikes = false;
                    row.strikes_count = "";
                    row.strikes_period = "";
                    row.violations = false;
                    row.violations_count = "";
                    row.violations_period = "";
                    row.credit = false;
                    row.requirements_feedback_score = "";
                    row.requirements = false;
                    row.requirements_max_count = "";
                    row.minimum_feedback = false;
                    row.minimum_feedback_score = "";
                });
            },
            /*获取买家限制模板*/
            get_refuse(){
                this.$http(api_common_modeList,{model_type:"refuse"}).then(res=>{
                    this.refuseList = res.data.map(row=>{
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
        },
        components: {
            saveAs:require("./save-as.vue").default,
            rainbowHeader:require('@/components/rainbow-header.vue').default,
        }
    }
</script>