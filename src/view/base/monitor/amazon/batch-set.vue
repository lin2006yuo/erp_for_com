<template>
    <page class="p-dialog">
        <page-dialog
                title="批量设置"
                v-model="batchDialogShow"
                size="small"
                :close-on-click-modal="false"
                @close="close"
                @open="open">
            <table class="template mt-xs">
                <tr>
                    <td colspan="2"> <b>订单缺陷率</b></td>
                </tr>
                <tr>
                    <td></td>
                    <td>监控值</td>
                </tr>
                <tr>
                    <td>订单缺陷率</td>
                    <td>
                        <template>
                            <span>>=</span>
                            <el-input-number  class="s-width-mini ml-sm" :min="0" :max="100" :controls="false" v-model="order_rate"></el-input-number>
                           <span>{{unit.order_defect_rate_buyer}}</span>
                        </template>
                    </td>
                </tr>
            </table>

            <table class="template mt-xs">
                <tr>
                    <td colspan="2"> <b>余额</b></td>
                </tr>
                <tr>
                    <td></td>
                    <td>监控值</td>
                </tr>
                <tr>
                    <td>余额</td>
                    <td>
                        <template>
                            <span>>=</span>
                            <el-input-number  class="s-width-mini ml-sm" :min="0" :controls="false" v-model="balance_amount"></el-input-number>
                            <span>{{unit.balance}}</span>
                        </template>
                    </td>
                </tr>
            </table>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click="submit">确定</el-button>
                <el-button size="mini" @click.native="batchDialogShow=false">取消</el-button>
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
    export default {
        name: "batch-set",
        data(){
            return {
                batchDialogShow: this.value,
                order_rate:'',
                balance_amount: ''
            }
        },
        methods:{
            open(){

            },
            close(){

            },
            submit(){
                this.$emit('batch-set-submit',this.order_rate,this.balance_amount)
            }
        },
        watch: {
            value(val){
                this.batchDialogShow = val;
            },
            batchDialogShow(val){
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
            unit:{
                type:Object
            }
        },
        components: {
            pageDialog: require('@/components/page-dialog').default
        }
    }
</script>