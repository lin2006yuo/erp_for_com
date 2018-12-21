<template>
    <div>
        <page-dialog title="返款申请"
                     size="small"
                     v-model="visible"
                     @open="open"
                     :close-on-click-modal="false">
            <el-form :model="refundData" class="mt-sm ml-lg">
                <el-form-item label="交易订单号：" label-width="140px">
                    <el-col :span="12">
                        <el-input class="s-width-lg" v-model="refundData.order_id" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="订单总支付金额：" label-width="140px">
                    <el-col :span="12">
                        <el-input class="s-width-lg" v-model="refundData.order_cost" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="订单金额币种：" label-width="140px">
                    <el-col :span="12">
                        <el-select class="s-width-lg" v-model="refundData.task_currency" placeholder="请选择" disabled>
                            <el-option
                                    v-for="items in currencyOptions"
                                    :key="items.value"
                                    :label="items.label"
                                    :value="items.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="订单返款总支付金额：" label-width="140px" required>
                    <el-col :span="12">
                        <el-input-number class="s-width-lg" :controls="false" v-model="refundData.pay_cost" :min="0"></el-input-number>
                    </el-col>
                </el-form-item>
                <el-form-item label="返款人姓名：" label-width="140px" required>
                    <el-col :span="12">
                        <el-input class="s-width-lg" v-model="refundData.refund_name"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="返款账号：" label-width="140px" required>
                    <el-col :span="12">
                        <el-input class="s-width-lg" v-model="refundData.refund_account"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="返款币种：" label-width="140px" required>
                    <el-col :span="12">
                        <el-select class="s-width-lg" v-model="refundData.refund_currency" placeholder="请选择">
                            <el-option
                                    v-for="items in currencyOptions"
                                    :key="items.value"
                                    :label="items.label"
                                    :value="items.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="返款方式：" label-width="140px" required>
                    <el-col :span="12">
                        <el-select class="s-width-lg" v-model="refundData.refund_type" placeholder="请选择">
                            <el-option
                                    v-for="item in refundTypeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="运单类型：" label-width="140px">
                    <el-col :span="12">
                        <el-select class="s-width-lg" v-model="refundData.shipping_type" placeholder="请选择" disabled>
                            <el-option
                                    v-for="item in shippingTypeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="刷单佣金：" label-width="140px">
                    <el-col :span="12">
                        <el-input-number class="s-width-lg" :controls="false" v-model="refundData.virtual_cost" :min="0"></el-input-number>
                    </el-col>
                </el-form-item>
                <el-form-item label="留评佣金：" label-width="140px">
                    <el-col :span="12">
                        <el-input-number class="s-width-lg" :controls="false" v-model="refundData.message_cost" :min="0"></el-input-number>
                    </el-col>
                </el-form-item>
                <el-form-item label="返款总额：" label-width="140px">
                    <el-col :span="12">
                        <el-input class="s-width-lg" v-model="refund_cost" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="批注：" label-width="140px" v-if="handleType === 'resubmit'">
                    <el-col :span="12">
                        <el-input type="textarea" :rows="2" v-model="refundData.postil" disabled></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <request-button @click="sure(refundData)" req-key="addRefundData">{{handleType === 'resubmit'?'重新提交':'提交审核'}}</request-button>
                <el-button size="mini" @click.native="visible = false">取 消</el-button>
            </div>
        </page-dialog>
    </div>
</template>

<style scoped lang="stylus">

</style>

<script>
    import {api_post_add_refund} from '@/api/click-farm-mission';
    import {api_get_currency_type} from '@/api/request-note';
    export default {
        data() {
            return {
                visible: false,
                refundTypeList: [
                    {label: "Paypal", value: 1},
                    {label: "微信", value: 2},
                    {label: "支付宝", value: 3},
                ],
                shippingTypeList: [
                    {label: "FBA", value: 1},
                    {label: "FBM", value: 2},
                ],
                currencyOptions:[],//货币类型
            }
        },
        methods: {
            open(){
                this.get_currency_type();
            },
            sure(row){//提交审核
                if(!row.pay_cost||!row.refund_name||!row.refund_account||!row.refund_currency||!row.refund_type){
                    this.$reqKey('addRefundData', false);
                    this.$message({type:"warning",message:'请填写必填项'})
                }else{
                    let data = {
                        mission_id: row.mission_id,
                        pay_cost: row.pay_cost,
                        refund_name: row.refund_name,
                        refund_account: row.refund_account,
                        refund_currency: row.refund_currency,
                        refund_type: row.refund_type,
                        virtual_cost: row.virtual_cost,
                        message_cost: row.message_cost,
                        refund_cost: this.refund_cost
                    };
                    this.$http(api_post_add_refund, data).then(res => {
                        this.$message({type: 'success', message: res.message});
                        this.visible = false;
                        this.$emit('update');
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message||code})
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('addRefundData', false);
                        }, 300)
                    })
                }
            },
            get_currency_type(){//获取货币类型
                this.$http(api_get_currency_type,{}).then(res => {
                    this.currencyOptions = res.map(row => {
                        return {
                            label: row.code,
                            value: row.code
                        }
                    })
                })
            },
        },
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                this.visible = val;
            },
        },
        computed:{
            refund_cost(){
                return (+this.refundData.pay_cost) + (+this.refundData.virtual_cost) + (+this.refundData.message_cost)
            }
        },
        props: {
            value: {},
            refundData: {
                type: Object,
                required: true
            },
            handleType: {
                type: String,
                required: false
            }
        },
        components: {
            pageDialog:require("@/components/page-dialog.vue").default,
            requestButton:require('@/global-components/request-button').default,
        }
    }
</script>