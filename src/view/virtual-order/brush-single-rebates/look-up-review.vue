<template>
    <div>
        <page-dialog :title="handleType === 'lookup'?'查看刷单返款申请':'审核刷单返款申请'"
                     size="small"
                     v-model="visible"
                     @open="open"
                     :close-on-click-modal="false">
            <el-form :model="refundData" class="mt-sm ml-sm">
                <el-form-item label="">
                    <el-col :span="12">
                        <strong>交易订单号：</strong>
                        <span>{{refundData.order_id}}</span>
                    </el-col>
                    <el-col :span="12">
                        <strong>订单支付币种：</strong>
                        <span>{{refundData.task_currency}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="">
                    <el-col :span="12">
                        <strong>运单类型：</strong>
                        <span>{{refundData.shipping_type | shippingTypeFilter}}</span>
                    </el-col>
                    <el-col :span="12">
                        <strong>订单总支付金额：</strong>
                        <span>{{refundData.pay_cost}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="">
                    <el-col :span="12">
                        <strong>刷单佣金：</strong>
                        <span>{{refundData.virtual_cost}}</span>
                    </el-col>
                    <el-col :span="12">
                        <strong>返款币种：</strong>
                        <span>{{refundData.refund_currency}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="">
                    <el-col :span="12">
                        <strong>留评佣金：</strong>
                        <span>{{refundData.message_cost}}</span>
                    </el-col>
                    <el-col :span="12">
                        <strong>返款总额：</strong>
                        <span>{{refundData.refund_cost}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="">
                    <el-col :span="24">
                        <strong>批注：</strong>
                        <span style="color: skyblue" class="fr" v-if="handleType === 'audit'">审核不通过时必须填写批注</span>
                        <el-input type="textarea" :rows="2" v-model="refundData.postil" :disabled="handleType === 'lookup'"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click.native="audit_approved" v-if="handleType === 'audit'">审核通过</el-button>
                <el-button size="mini" type="primary" @click.native="audit_reject" v-if="handleType === 'audit'">审核不通过</el-button>
                <el-button size="mini" @click.native="visible = false">取 消</el-button>
            </div>
        </page-dialog>
    </div>
</template>

<style scoped lang="stylus">

</style>

<script>
    import {api_get_virtual_refund_form} from '@/api/virtual-refund';
    export default {
        data(){
            return{
                visible: false,
                refundData: {}
            }
        },
        filters:{
            shippingTypeFilter(val){
                let ret = '';
                switch (val){
                    case 0:
                        ret = '--';
                        break;
                    case 1:
                        ret = 'FBA';
                        break;
                    case 2:
                        ret = 'FBM';
                        break;
                }
                return ret
            }
        },
        methods:{
            open(){
                this.$http(api_get_virtual_refund_form,this.curId).then(res => {
                    this.refundData = res
                }).catch(code => {
                    this.$message({type:'error', message: code.message||code})
                })
            },
            audit_approved(){//审核通过
                this.$emit('audit-single',this.refundData.id, 1, this.refundData.postil)
            },
            audit_reject(){//审核不通过
                if(!this.refundData.postil){
                    this.$message({type: 'warning', message: '批注为必填项'})
                }else{
                    this.$emit('audit-single',this.refundData.id, 2, this.refundData.postil)
                }
            }
        },
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                this.visible = val;
            },
        },
        props:{
            value: {},
            curId:{},
            handleType:{
                type: String,
                required: true
            }
        },
        components:{
            pageDialog:require("@/components/page-dialog.vue").default
        }
    }
</script>