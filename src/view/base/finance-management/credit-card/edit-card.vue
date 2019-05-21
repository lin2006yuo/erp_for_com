<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @close="close" :close-on-cilck-modal="false">
        <el-form :model="lookData"
                 label-width="190px"
                 ref="lookData"
                 :rules="rules">
            <el-form-item label="添加人：">
                <el-col :span="14">
                    <span>{{lookData.creator}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="添加时间：">
                <el-col :span="14">
                    <span>{{lookData.create_time | filterDate}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="信用卡类别：" prop="card_category">
                <el-col :span="14">
                    <el-select v-model="lookData.card_category"
                               filterable clearable
                               placeholder="请选择">
                        <el-option v-for="item in cardListal"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="卡号：" prop="card_number" >
                <el-col :span="14">
                    <el-input v-model="lookData.card_number"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="卡主姓名：" prop="card_master">
                <el-col :span="14">
                    <el-input v-model="lookData.card_master"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="银行：" prop="bank_id">
                <el-col :span="14">
                    <el-select v-model="lookData.bank_id"
                               filterable clearable
                               placeholder="请选择">
                        <el-option v-for="item in bankList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="有效期：" prop="validity_date">
                <el-col :span="14">
                    <el-input v-model="lookData.validity_date"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="安全码：" prop="security_code">
                <el-col :span="14">
                    <el-input v-model="lookData.security_code"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="状态：" prop="card_status">
                <el-col :span="14">
                    <el-select v-model="lookData.card_status"
                               filterable clearable
                               placeholder="请选择">
                        <el-option v-for="item in statusList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取店铺信用卡数据：">
                <el-col :span="14">
                    <el-select v-model="lookData.synchronize_status">
                        <el-option v-for="item in downloadList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="lookUser" @click="keep">确 定</request-button>
            <el-button size="mini" @click.native="show=false">取 消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_card_update} from '@/api/credit-card';
    import {extraReg} from '../../../../define/validator_reg';
    export default{
        data(){
            let checkTel  = (rule,value,callback)=>{
                if(value){
                    return !extraReg.test(value)?callback(new Error("号码输入有误，请重新输入！")):callback()
                }else{
                    return callback();
                }
            };
            return{
                show:this.value,
                statusList:[
                    {label:'正常',value:1},
                    {label:'异常',value:2},
                    {label:'注销',value:3},
                ],
                downloadList:[
                    {label:"未启用",value:0},
                    {label: "30分钟", value: 30},
                    {label: "1小时", value: 60},
                    {label: "2小时", value: 120},
                    {label: "3小时", value: 180},
                    {label: "4小时", value: 240},
                    {label: "5小时", value: 300},
                    {label: "6小时", value: 360},
                    {label: "7小时", value: 420},
                    {label: "8小时", value: 480},
                    {label: "9小时", value: 540},
                    {label: "10小时", value: 600},
                    {label: "11小时", value: 660},
                    {label: "12小时", value: 720},
                    {label: "24小时", value: 1440}
                ],
                rules:{
                    card_category:[{required: true, message: '信用卡类别必选', trigger: 'change'}],
                    card_number:[{required: true, message: '卡号必填项', trigger: 'blur'},{ validator:checkTel, trigger: 'blur'}],
                    card_master:[{required: true, message: '卡主姓名必填项', trigger: 'blur'}],
                    bank_id:[{required: true, message: '银行必选项', trigger: 'change', type: "number"}],
                    validity_date:[{required: true, message: '有效期必填项', trigger: 'blur'}],
                    security_code:[{required: true, message: '安全码必填项', trigger: 'blur'}],
                    card_status:[{required: true, message: '状态为必选项', trigger: 'change', type: "number"}]
                },
            }
        },
        methods:{
            open(){

            },
            close(){
                Object.keys(this.lookData).forEach(key=>{
                    this.lookData[key] = "";
                });
            },
            keep(){
                this.$refs.lookData.validate(valid=>{
                    if(valid){
                        this.$http(api_card_update,this.lookData.id,this.lookData).then(res=>{
                            this.$message({type: 'success', message: res.message || res});
                            this.$emit('submit');
                            this.show = false;
                        }).catch(code => {
                            this.$message({type: 'error', message: code.message || code});
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('lookUser', false);
                            }, 300)
                        });
                    }else{
                        this.$reqKey('lookUser',false)
                    }
                })

            },
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
            filterDate(val){
                return val?datef('YYYY-MM-dd HH:mm:ss',val):'';
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            title:{},
            lookData:{
                required:true,
                type:Object
            },
            bankList:{},
            cardListal:{}
        },
    }
</script>