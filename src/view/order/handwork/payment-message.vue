<template>
    <div class="c-payment-message">
        <el-row class="mb-xs">
            <el-col :span="24">
                <label class="bold-font">设置付款状态：</label>
                <el-checkbox v-model="form.is_pay" @change="change_pay">该订单已付款</el-checkbox>
                <label class="bold-font ml-sm">后续处理方式：</label>
                <el-checkbox v-model="form.follow">放入需人工审核队列</el-checkbox>
            </el-col>
        </el-row>
        <div class="mb-xs" v-if="form.is_pay">
            <label-select  label="选择支付方式：" fontWeight="bold" v-model="selectName" :lists="paymentList" @change="change_payment"></label-select>
            <!--paypal支付方式-->
            <div class="currency-box mt-sm in"  v-if="selectName==='paypal'">
                <el-form label-width="100px" :model="form" ref="paypal">
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="PayPal支付号：" prop="pay_code"
                                          :rules="[
                                              { required: true, message: 'PayPal支付号为必填项', trigger: 'change' },
                                          ]"
                            >
                                <el-input class="inline width-super" disabled v-model="form.pay_code"></el-input>
                                <el-button class="inline ml-xs" type="primary" size="mini" @click.native="select_currency">选择</el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="币种：" prop="currency_code"
                                          :rules="[
                                              { required: true, message: '币种为必填项', trigger: 'change' },
                                          ]"
                            >
                                <label-select
                                        :is-disabled="true"
                                        :lists="currencyList"
                                        v-model="form.currency_code"
                                        :filterable="true"
                                        :clearable="true"
                                ></label-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="金额：" prop="amount"
                                          :rules="[
                                              { required: true, message: '金额为必填项', trigger: 'change' },
                                          ]"
                            >
                                <el-input v-model="form.amount" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="currency-box mt-sm" v-if="selectName==='others'">
                <el-form label-width="100px" :model="form" ref="others">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="支付方式名称：" prop="pay_name"
                                          :rules="[
                                              { required: true, message: '支付方式名称为必填项', trigger: 'change' },
                                          ]"
                            >
                                <el-input class="inline" v-model="form.pay_name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="币种：" prop="currency_code"
                                          :rules="[
                                              { required: true, message: '币种为必填项', trigger: 'change' },
                                          ]"
                            >
                                <label-select
                                        :lists="currencyList"
                                        v-model="form.currency_code"
                                        @change="change_currency"
                                        :filterable="true"
                                        :clearable="true"
                                ></label-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="金额：" prop="amount"
                                          :rules="[
                                              { required: true, message: '金额为必填项', trigger: 'change' },
                                          ]"
                            >
                                <el-input class="inline" v-model="form.amount"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="交易流水号：">
                                <el-input v-model="form.pay_code"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="15">
                            <el-form-item label="交易相关链接：">
                                <el-input v-model="form.pay_link"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="支付留言：">
                                <el-input type="textarea" v-model="form.pay_note"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
        <div v-else>
            <el-row>
                <el-col :span="2">
                    <label class="bold-font inline mt-xs t-right " style="width:84px">订单总金额：</label>
                </el-col>
                <el-col :span="10">
                    <el-form label-width="50px" :model="form" ref="form" :rules="rules">
                        <div style="display:flex">
                            <el-form-item style="flex:1" label="币种：" prop="currency_code">
                                <label-select
                                        class="mr-xs"
                                        :lists="currencyList"
                                        v-model="form.currency_code"
                                        :filterable="true"
                                        :clearable="true"
                                ></label-select>
                            </el-form-item>
                            <el-form-item style="flex:1" label="金额：" prop="amount">
                                <el-input v-model="form.amount"></el-input>
                            </el-form-item>
                        </div>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <paypal-order v-model="dialog" @add-paypal="add_paypal"></paypal-order>
    </div>
</template>
<style lang="stylus">
    .currency-box{
        padding:5px 10px;
        margin-left:85px;
        border:1px solid #BDCDDC;
        background: #F1F6FC;
    }
</style>
<script>
import {api_get_currency,api_get_paypal} from '../../../api/handwork';
import {plus} from '../../../define/validator_reg';
    export default{
        data(){
            let checkNumber = (rule,value,callback)=>{
                if(value){
                    return !plus.test(value) ? callback("请输入数字"):callback();
                }
            }
            return {
                dialog:false,
                paymentList:[
                    {label:"PayPal",value:"paypal"},
                    {label:"其他支付方式",value:"others"},
                ],
                currencyList:[],
                rules: {
                    currency_code: [
                        {required: true, message: '币种为必填项', trigger: 'change'},
                    ],
                    amount:[
                        { required: true, message: '金额为必填项', trigger: 'blur'},
                        { validator:checkNumber, trigger: 'blur,change'},
                    ],
                },
                rules2:{
                    pay_name:[
                        { required: true, message: '支付方式名称为必填项', trigger:'change' },
                    ],
                    currency_code:[
                        {required: true, message: '币种为必填项', trigger: 'change'},
                    ],
                    amount:[
                        { required: true, message: '金额为必填项', trigger: 'change'},
                        { validator:checkNumber, trigger: 'blur,change'},
                    ]
                },
                selectName:"",
            }
        },
        created(){
            this.get_currency();
        },
        watch:{
            "form.pay_name"(val){
                console.log(val);
            },
            "form.is_pay"(val){
                if(!val){
                    this.selectName = "";
                    this.form.pay_name = "";
                    this.form.pay_code = "";
                    this.form.currency_code = "",
                    this.form.buyer_id = "",
                    this.form.email = "";
                    this.form.consignee = "";
                    this.form.address = "";
                    this.form.city = "";
                    this.form.province = "";
                    this.form.tel = "";
                    this.form.zipcode = "";
                    this.form.country_code = "";
                }
            },
            'form.currency_code'(val,old){
                if(old!==''){
                    this.$emit('change-currency');
                }
            }
        },
        methods:{
            submit(){
                let flag=false;
                if(this.form.is_pay){
                    if(this.selectName==="paypal"){
                        this.$refs.paypal.validate((b)=>{
                            if(b){
                                flag = true;
                            }
                        })
                    }else if(this.selectName==="others"){
                        this.$refs.others.validate((b)=>{
                            if(b){
                                flag = true;
                            }
                        })
                    }
                }else{
                    this.$refs.form.validate((b)=>{
                        if(b){
                            flag=true
                        }
                    })
                }
                return flag;
            },

//            是否付款
            change_pay(){

            },
//            选择支付方式
            change_payment(val){
                this.selectName = val;
                this.form.pay_name = val==="paypal"?val:""
                // this.form.pay_code = "",
                // this.form.currency_code = "",
                // this.form.buyer_id = "",
                // this.form.email = "";
                // this.form.consignee = "";
                // this.form.address = "";
                // this.form.city = "";
                // this.form.province = "";
                // this.form.tel = "";
                // this.form.zipcode = "";
                // this.form.country_code = "";
                // this.form.amount = "";
            },
//            添加paypal账号信息
            add_paypal(val){
                this.form.pay_code = val.txn_id,
                this.form.currency_code = val.mc_currency,
                this.form.buyer_id = val.auction_buyer_id,
                this.form.email = val.receiver_email;
                this.form.consignee = val.address_name;
                this.form.address = val.address_street;
                this.form.city = val.address_city;
                this.form.province = val.address_state;
                this.form.tel = val.phone;
                this.form.zipcode = val.address_zip;
                this.form.country_code = val.address_country;
                if(val.amt){
                    this.form.amount = parseFloat(val.amt).toFixed(2);
                }

            },
//            选择币种
            change_currency(){
                this.$emit('change-currency');
            },
//            选择账号
            select_currency(){
                this.dialog = true
            },
//            获取币种
            get_currency(){
                this.$http(api_get_currency).then(res=>{
                    this.currencyList = res.map(row=>{return {label:row.name,value:row.code}});
                }).catch(code=>{
                    console.log(code);
                })
            },
        },
        props:{
            form:{
                required:true,
                type:Object
            }
        },
        components: {
            labelSelect:require('../../../components/label-select.vue').default,
            paypalOrder:require('./paypal-orders.vue').default
        }
    }
</script>
