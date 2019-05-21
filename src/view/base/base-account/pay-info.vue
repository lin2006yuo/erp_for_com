<template>
    <div>
        <div class="basic-title-info mt-sm">收款账号</div>
        <el-form label-width="200px"
                 :model="form"
                 ref="payInfo">
            <el-form-item label="信用卡：">
                <el-col :span="10">
                    <el-input v-model="form.credit_card" disabled></el-input>
                </el-col>
                <el-button type="primary" size="mini"
                           class="ml-sm inline"
                           :disabled="!!flag&&form.current_status==='已作废'"
                           @click.native="get_creditCardShow()">选择信用卡
                </el-button>
                <!--creditCardShow=true"-->
            </el-form-item>
            <el-row v-for="(row,index) in form.collection_msg" :key="index">
                <el-form-item :label="`收款账号${index!==0?index:''}：`">
                    <el-col :span="12">
                        <el-input v-model.trim="row.collection_account" ></el-input>
                    </el-col>
                    <!--<el-button type="primary" size="mini" class="ml-sm inline" @click.native="select_accountNumber">选择收款账号-->
                    <!--</el-button>-->
                    <el-button type="primary" size="mini" class="ml-sm inline"
                               :disabled="!!flag&&form.current_status==='已作废'"
                               v-if="index===0" @click.native="add_pay_info">新增
                    </el-button>
                    <span v-else style="font-size: 20px;"
                         @click="del_current(index,row)"><i class="el-icon-delete"></i>
                    </span>
                </el-form-item>
                <el-form-item :label="`收款账号平台${index!==0?index:''}：`">
                    <el-col :span="12">
                        <el-input v-model.trim="row.collection_type" ></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item :label="`收款账号邮箱${index!==0?index:''}：`">
                    <el-col :span="12">
                        <el-input v-model.trim="row.collection_email" ></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item :label="`收款方${index!==0?index:''}：`">
                    <el-col :span="12">
                        <el-input v-model.trim="row.collection_user" ></el-input>
                    </el-col>
                </el-form-item>
            </el-row>
        </el-form>
        <select-credit-card v-model="creditCardShow"
                            :titleCredit="addEditcardTitle"
                            @export-credit-card="get_credit_card">
        </select-credit-card>
        <!--收款账号弹框-->
        <!--<shroff-account-number v-model="accountNumberShow"></shroff-account-number>-->
    </div>
</template>

<script>
    import selectCreditCard from '@/view/base/account-apply/select-credit-card';
//    import shroffAccountNumber from './shroff-account-number';
    export default {
        name: "pay-info",
        data() {
            return {
                creditCardShow:false,
                addEditcardTitle:'',
                accountNumberShow:false,
            }
        },
        computed: {},
        methods: {
            add_pay_info(){
                let obj={
                    collection_account:'',
                    collection_type:'',
                    collection_email:'',
                    collection_user:''
                };
                this.form.collection_msg.push(obj);
            },
            del_current(index){
                this.form.collection_msg.splice(index,1);
            },
            get_credit_card(creditCard){
                this.$set(this.form,'credit_card',creditCard.card_number);
                this.$set(this.form,'credit_card_id',creditCard.id);
                this.creditCardShow=false;
            },
            get_creditCardShow(){
                this.addEditcardTitle=`${this.form.account_code?`为账号简称：${this.form.account_code}选择信用卡`:''}`;
                this.creditCardShow=true;
            },
            //选择收款账号
            select_accountNumber(){
                this.accountNumberShow=true;
            }
        },
        props: {
            form:Object,
            flag:Number,
        },
        components: {
            selectCreditCard
        },
    }
</script>

