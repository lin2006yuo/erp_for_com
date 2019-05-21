<template>
    <page class="p-dialog">
        <page-dialog :title="`账户：${tableData.account_name}的资金记录`" v-model="showDialog" size="large" :close-on-click-modal="false">
            <label-buttons label="状态：" :buttons="userStatus" @select="change_select"></label-buttons>
            <el-table
                    :data="tableData.data"
                    border
                    style="width: 100%">
                <el-table-column
                        prop="trading_time"
                        label="日期">
                </el-table-column>

                <el-table-column
                        prop="payment_id"
                        label="提现流水号">
                </el-table-column>

                <el-table-column
                        prop="card_number"
                        label="提现卡号">
                </el-table-column>

                <el-table-column
                        prop="money"
                        label="提现金额">
                </el-table-column>

                <el-table-column
                        prop="fee"
                        label="手续费">
                </el-table-column>

                <el-table-column
                        prop="trading_status"
                        label="状态">
                </el-table-column>
                <el-table-column
                        prop="remark"
                        label="备注">
                </el-table-column>

            </el-table>
            <div slot="footer" class="dialog-footer">
                <!--<el-button size="mini" type="primary" @click.native="get_shift">确定</el-button>-->
                <el-button size="mini" @click.native="showDialog=false">取消</el-button>
            </div>
        </page-dialog>
    </page>
</template>
<style lang="stylus" scoped>
    .title{
        margin: 0;
        margin-bottom: 8px;
    }
    .center{
        display: flex;
        justify-content: center;
    }
</style>
<script>

    import  {api_aliexpress_account_health_payment} from '@/api/monitor-manage'
    import labelButtons from '@/components/label-buttons.vue';
    export default {
        data() {
            return {
                title:'批量修改监控值',
                showDialog:this.value,

                userStatus:[
                    {name:"美元账户",status:'us'},
                    {name:"CNH 人民币帐号",status:'cnh'},
                    {name:"CNY 人民币账户", status:'cny'},
                ],
                tableData:{},
                type:'',
            }
        },
        computed: {},
        filters: {},
        mounted() {
        },
        methods: {
            init(){
                this.$http(api_aliexpress_account_health_payment,this.account_id,this.type).then(res=>this.tableData = res)
            },
            get_shift(){//确定

            },
            change_select(v,i){//切换
                this.type = i.status;
                this.init()
            },
        },
        watch: {
            value(val){
                this.showDialog = val;
            },
            showDialog(val){
                this.$emit('input',val);
            },
        },
        props: {
            value:{
                type:Boolean,
                default(){
                    return false;
                },
            },
            account_id:'',
        },
        components: {
            labelButtons,
            pageDialog: require('@/components/page-dialog').default,
        }
    }
</script>
