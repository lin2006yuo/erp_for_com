<template>
    <el-row class="export-order">
        <page-dialog :title="`导出虚拟订购单`" v-model="orderDialog" width="60%">
                    <div class="center-content">
                        <span class="big-label">有棵树电子商务有限公司</span>
                    </div>
                    <div class="center-content">
                        <span class="middle-label">订购单</span>
                    </div>
                    <div class="row-content">
                        <span class="label-order">供货商：{{checkList.company_name}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label-order">订购日期: </span>
                    </div>
                    <div class="row-content">
                        <span class="label-order">币种：人民币( C N Y ) </span>
                    </div>
                    <el-table :data="checkList.table_data" border  show-summary  :summary-method="getSummaries">
                        <el-table-column inline-template label="品名及货物描述" align="center">
                            <div>{{row.goods_name}}</div>
                        </el-table-column>
                        <el-table-column inline-template label="数量" align="center">
                            <div>{{row.sum_qty}}</div>
                        </el-table-column>
                        <el-table-column inline-template label="单价" align="center">
                            <div>{{row.single_price}}</div>
                        </el-table-column>
                        <el-table-column inline-template label="总价" align="center">
                            <div>{{row.sum_price}}</div>
                        </el-table-column>
                    </el-table>
                    <div class="row-content margin-top">
                        <span class="label-order" style="font-size:15px">收款人信息: </span>
                    </div>

                    <div class="row-content">
                        <span class="label-order">收款人 : {{checkList.supplier_info.account_name}}</span>
                    </div>
                    <div class="row-content">
                      <span class="label-order">卡号 : {{checkList.supplier_info.bank_account}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label-order">银行 : {{checkList.supplier_info.bank}}</span>
                    </div>
                    <el-row class="margin-top">
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label-order">供方：{{checkList.company_name}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label-order">需方: 有棵树电子商务有限公司</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label-order">日期：&nbsp &nbsp &nbsp &nbsp年 &nbsp &nbsp &nbsp &nbsp月 &nbsp &nbsp &nbsp &nbsp日</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label-order">日期：&nbsp &nbsp &nbsp &nbsp年 &nbsp &nbsp &nbsp &nbsp月 &nbsp &nbsp &nbsp &nbsp日</span>
                            </div>
                        </el-col>
                    </el-row>
            <span slot="footer">
                <request-button req-key="export_order" @click="export_order" :timeout="60000">导出订购单</request-button>
                <el-button type="default" size="mini" @click.native="cancal">关闭</el-button>
            </span>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">
    .export-order{
        .row-content{
            display: flex;
            align-items: center;
            .label-order{
                display: inline-block;
                text-align:left;
                padding:5px 5px;
                font-weight: bold;
            }
        }
        .margin-top{
            margin-top: 30px
        }
        .center-content{
            padding: 5px;
            text-align: center;
        }
        .big-label{
            font-weight: bold;
            font-size: 18px;
        }
        .center-content .middle-label{
            font-weight: bold;
            font-size: 16px;
        }
    }

</style>
<script>
    import pageDialog from '../../../components/page-dialog.vue';
    export default{
        data(){
            return {
                orderDialog: false,
            }
        },
        watch:{
            orderDialog(val){
                this.$emit("input",val)
            },
            value(val){
                this.orderDialog = val
            }
        },
        mounted(){
            this.orderDialog = this.value;
        },
        methods: {
            getSummaries(param){
                const { columns} = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index > 0) {
                        sums[2] = '小计';
                        sums[3] = this.checkList.amount;
                        return;
                    }
                });
                return sums;
            },
            export_order(){
              this.$emit("export_order");
            },
            cancal(){
                this.orderDialog = false;
            }
        },
        filters: {
            filterTofix(val){
                return Number(val).toFixed(4);
            }
        },
        props:{
            value:{},
            checkList:{
                required: true,
                type: Object
            }
        },
        components: {
            pageDialog,
            uiTip:require('@/components/ui-tip').default,
        }
    }
</script>
