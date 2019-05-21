<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @close="close" :close-on-cilck-modal="false">
        <el-form :model="creditData"
                 label-width="190px"
                 ref="creditData"
                 :rules="rules">
            <el-form-item label="信用卡类别：" prop="card_category">
                <el-col :span="14">
                    <el-select v-model="creditData.card_category"
                               filterable clearable
                               placeholder="请选择">
                        <el-option v-for="item in cardListal"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="卡号：" prop="card_number">
                <el-col :span="14">
                    <el-input v-model="creditData.card_number"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="卡主姓名：" prop="card_master">
                <el-col :span="14">
                    <el-input v-model="creditData.card_master"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="银行：" prop="bank_id">
                <el-col :span="14">
                    <el-select v-model="creditData.bank_id"
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
                    <el-input v-model="creditData.validity_date"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="安全码：" prop="security_code">
                <el-col :span="14">
                    <el-input v-model="creditData.security_code"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="状态：" prop="card_status">
                <el-col :span="14">
                    <el-select v-model="creditData.card_status"
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
                    <el-select v-model="creditData.synchronize_status">
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
            <request-button req-key="creditUser" @click="keep">确 定</request-button>
            <el-button size="mini" @click.native="show=false">取 消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_add_credit_card} from '@/api/credit-card';
    export default{
        data(){
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
                    card_category:[{required: true, message: '信用卡类别必选', trigger: 'blur,change'}],
                    card_number:[{required: true, message: '卡号必填项', trigger: 'change'}],
                    card_master:[{required: true, message: '卡主姓名必填项', trigger: 'change'}],
                    bank_id:[{required: true, message: '银行必选项', trigger: 'blur,change',type:'number'}],
                    validity_date:[{required: true, message: '有效期必填项', trigger: 'change'}],
                    security_code:[{required: true, message: '安全码必填项', trigger: 'change'}],
                    card_status:[{required: true, message: '状态为必选项', trigger: 'blur,change',type:'number'}]
                },
            }
        },
        methods:{
            open(){
            
            },
            close(){
                Object.keys(this.creditData).forEach(key=>{
                    this.lookData[key] = "";
                });
            },
            keep(){
                this.$refs.creditData.validate((bool)=> {
                    if (bool) {
                        this.$http(api_add_credit_card,this.creditData).then(res=>{
                            this.$message({type: 'success', message: res.message || res});
                            this.$emit('submit');
                            this.show = false;
                        }).catch(code => {
                            this.$message({type: 'error', message: code.message || code});
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('creditUser', false);
                            }, 300)
                        });
                    }
                });
            },
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            title:{},
            creditData:{},
            bankList:{},
            cardListal:{},
        },
        // components:{
        //     pageDialog:require('@/components/page-dialog.vue').default,
        // }
    }
</script>