<template>
    <page class="p-dialog">
        <page-dialog
            :title="isView?`查看账号：${currentData.account_name}的监控信息`:`编辑账号：${currentData.account_name}的监控信息`"
            v-model="dialogShow"
            size="small"
            :close-on-click-modal="false"
            @close="close"
            @open="open">
            <el-alert
                    class="mt-xs"
                    v-if="currentData.hint_msg!==''"
                    :title="currentData.hint_msg"
                    type="info"
                    show-icon>
            </el-alert>
            <table class="template mt-xs">
                <tr>
                    <td colspan="4"> <b>订单缺陷率</b></td>
                </tr>
                <tr>
                    <td></td>
                    <td>订单缺陷率（卖方完成）</td>
                    <td>订单缺陷率（亚马逊完成）</td>
                    <td>监控值</td>
                </tr>
                <tr>
                    <td>订单缺陷率</td>
                    <td>
                        <template>
                            <span>{{currentData.order_defect_rate_buyer}}</span>
                            <span>{{unit.order_defect_rate_buyer}}</span>
                        </template>
                    </td>
                    <td>
                        <template>
                            <span>{{currentData.order_defect_rate_channel}}</span>
                            <span>{{unit.order_defect_rate_channel}}</span>
                        </template>
                    </td>
                    <td>
                        <template>
                            <span>>=</span>
                            <el-input-number  class="s-width-mini ml-sm" :min="0" :max="100" :controls="false" v-model="monitorValue.order_rate" :disabled="isView"></el-input-number>
                            <span>{{unit.order_defect_rate_buyer}}</span>
                        </template>
                    </td>
                </tr>
            </table>

            <table class="template mt-xs">
                <tr>
                    <td colspan="3"  > <b>余额</b></td>
                </tr>
                <tr>
                    <td></td>
                    <td>金额</td>
                    <td>监控值</td>
                </tr>
                <tr>
                    <td>余额</td>
                    <td>
                        <span>{{currentData.balance}}</span>
                        <span>{{unit.balance}}</span>
                    </td>
                    <td>
                        <template>
                            <span>>=</span>
                            <el-input-number  class="s-width-mini ml-sm" :min="0" :controls="false" v-model="monitorValue.balance_amount" :disabled="isView"></el-input-number>
                            <span>{{unit.balance}}</span>
                        </template>
                    </td>
                </tr>
            </table>

            <table class="template mt-xs" v-if="isView">
                <tr>
                    <td colspan="3"><b>结算一览</b></td>
                </tr>
                <tr>
                    <td></td>
                    <td>转账金额</td>
                    <td>转账日期</td>
                </tr>
                <tr>
                    <td>结算周期A</td>
                    <td>
                        <span>{{ currentData.transfer_amount_a }}</span>
                        <span>{{unit.transfer_amount_a}}</span>
                    </td>
                    <td>
                        <span>{{ currentData.transfer_amount_a_time }}</span>
                    </td>
                </tr>
                <tr>
                    <td>结算周期B</td>
                    <td>
                        <span>{{ currentData.transfer_amount_b }}</span>
                        <span>{{unit.transfer_amount_b}}</span>
                    </td>
                    <td>
                        <span>{{ currentData.transfer_amount_b_time }}</span>
                    </td>
                </tr>
            </table>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click="submit" v-if="!isView">确定</el-button>
                <el-button size="mini" @click.native="dialogShow=false">取消</el-button>
            </div>
        </page-dialog>
    </page>
</template>
<style lang="stylus" scoped>
    .center{
        display: flex;
        justify-content: center;
    }
    table tr:first-child{
        background-color: #99a9bf;
    }
</style>
<script>
    import {api_amazon_account_health_single, api_amazon_account_health_set_one} from '../../../../api/monitor-amazon'
    export default {
        name: "edit-view-dialog",
        data(){
            return {
                dialogShow: this.value,
                monitorValue: {}
            }
        },
        methods:{
            open(){
                this.$http(api_amazon_account_health_single,this.currentData.amazon_account_id).then(res => {
                    this.monitorValue = res;
                    console.log(res);
                })
            },
            close(){

            },
            submit(){
                let params = {
                    amazon_account_id: '',
                    order_rate: '',
                    balance_amount:''
                };
                params.amazon_account_id = this.currentData.amazon_account_id;
                params.order_rate = this.monitorValue.order_rate;
                params.balance_amount = this.monitorValue.balance_amount;
                this.$http(api_amazon_account_health_set_one,params).then(res => {
                    this.$message({type:'success',message:res.message});
                    this.dialogShow = false
                })
            }
        },
        watch: {
            value(val){
                this.dialogShow = val;
            },
            dialogShow(val){
                this.$emit('input',val);
            }
        },
        props: {
            value:{
                type:Boolean,
                default(){
                    return false;
                }
            },
            currentData:{
                type:Object
            },
            isView:{
                type:Boolean
            },
            unit:{
                type:Object
            }

        },
        components: {
            pageDialog: require('@/components/page-dialog').default
        }
    }
</script>