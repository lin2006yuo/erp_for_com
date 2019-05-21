<template>
    <div class='p-batch-setting'>
        <page-dialog :title="title" v-model="showDialog" size="small" :close-on-click-modal="false" @open="open">

            <table class="template">
                <tr>
                    <td colspan="2"  > <b>诚信店铺表现</b></td>
                </tr>
                <tr>
                    <td>目标</td>
                    <td>监控值</td>
                </tr>
                <tr>
                    <td>仿品率（目标<=0.50%）</td>
                    <td>
                        <template v-if="editData.isEdit">
                            <span>目标></span>
                            <el-input-number  class="s-width-mini ml-sm" :min="0" :max="100" :controls="false" v-model="editData.imitation_rate"></el-input-number>
                        </template>
                        <template v-else>
                            <span>>{{editData.imitation_rate}}</span>
                        </template>
                        <span>{{unit.imitation_rate}}</span>
                    </td>
                </tr>
                <tr>
                    <td>有效跟踪率（目标>=95.00%）</td>
                    <td>
                        <template v-if="editData.isEdit">
                            <span>目标<</span>
                            <el-input-number class="s-width-mini ml-sm"  :min="0" :max="100" :controls="false" v-model="editData.tracking_rate"></el-input-number>
                        </template>
                        <template v-else>
                            <span><{{editData.tracking_rate}}</span>
                        </template>
                        <span>{{unit.tracking_rate}}</span>
                    </td>
                </tr>
                <tr>
                    <td>延迟发货率（目标<=10.00%）</td>
                    <td>
                        <template v-if="editData.isEdit">
                            <span>目标></span>
                            <el-input-number class="s-width-mini ml-sm" :min="0" :max="100" :controls="false" v-model="editData.delay_shipment_rate"></el-input-number>
                        </template>
                        <template v-else>
                            <span>>{{editData.delay_shipment_rate}}</span>
                        </template>
                        <span>{{unit.delay_shipment_rate}}</span>
                    </td>
                </tr>
                <tr>
                    <td>30天平均评分（目标>=4.00）</td>
                    <td>
                        <template v-if="editData.isEdit">
                            <span>目标<</span>
                            <el-input-number class="s-width-mini ml-sm" :min="0" :max="100" :controls="false" v-model="editData.thirty_score"></el-input-number>
                        </template>
                        <template v-else>
                            <span><{{editData.thirty_score}}</span>
                        </template>
                        <span>{{unit.thirty_score}}</span>
                    </td>
                </tr>
                <tr>
                    <td>在63天到93天内的退款率（目标<=10.00%）</td>
                    <td>
                        <template v-if="editData.isEdit">
                            <span>目标></span>
                            <el-input-number class="s-width-mini ml-sm" :min="0" :max="100" :controls="false" v-model="editData.refund_rate"></el-input-number>
                        </template>
                        <template v-else>
                            <span>>{{editData.refund_rate}}</span>
                        </template>
                        <span>{{unit.refund_rate}}</span>
                    </td>
                </tr>

                <tr>
                    <td colspan="2"  > <b> 店铺账户金额情况</b></td>
                </tr>
                <tr>
                    <td>在途金额</td>
                    <td>
                        <template v-if="editData.isEdit">
                            <span>目标>=</span>
                            <el-input-number class="s-width-mini ml-sm"   :controls="false" v-model="editData.onway_amount"></el-input-number>
                        </template>
                        <template v-else>
                            <span>{{editData.onway_amount}}</span>
                        </template>

                    </td>
                </tr>
                <tr>
                    <td>待配送金额</td>
                    <td>
                        <template v-if="editData.isEdit">
                            <span>目标>=</span>
                            <el-input-number class="s-width-mini ml-sm"  :controls="false" v-model="editData.unconfirm_amount"></el-input-number>
                        </template>
                        <template v-else>
                            <span>{{editData.unconfirm_amount}}</span>
                        </template>

                    </td>
                </tr>
            </table>
            <el-row>
                小提示：“监控值”留0，表示该项不列入监控范围。
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click="submit" v-if="editData.isEdit">确定</el-button>
                <el-button size="mini" @click.native="showDialog=false">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus" scoped>

</style>
<script>
    import { api_wish_setting_all,api_wish_setting_single  } from "@/api/monitor-wish"
    export default {
        data() {
            return {
                showDialog:false,
                tableData:[]
            }
        },
        created() {
        },
        mounted() {
        },
        computed: {},
        methods: {
            open(){

            },
            submit(){
                let apis='',data=window.clone(this.editData);
                if(this.editData.isBatch){
                    apis=api_wish_setting_all;
                    data.hasOwnProperty('wish_account_id')&&delete data.wish_account_id;
                }else {
                    apis=api_wish_setting_single;
                    data.hasOwnProperty('wish_account_ids')&&delete data.wish_account_ids;
                }
                delete data.isBatch
                delete data.isEdit
                data.hasOwnProperty('id')&&delete data.id;
                data.hasOwnProperty('create_time')&&delete data.create_time;
                this.$http(apis,data).then(res=>{
                this.$message({type:"success",message:res.message||res});
                this.showDialog=false
                    this.$emit("update",data)
                }).catch(code => {
                    this.$message({type:"error",message:code.message||code})
                });
            }
        },
        watch: {
            value(val){
                this.showDialog = val;
            },
            showDialog(val){
                this.$emit('input',val);
            },
        },
        filters: {},
        props: {
            value:{
                type:Boolean,
                default(){
                    return false;
                },
            },
            title:{

            },
            editData:{

            },
            unit:{}
        },
        components: {
            pageDialog: require('@/components/page-dialog').default,
        }
    }
</script>

