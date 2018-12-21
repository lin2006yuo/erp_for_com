<template>
    <el-row class="export-stock">
        <page-dialog :title="`导出虚拟入库单`" v-model="orderDialog" width="60%">
                    <div class="center-content">
                        <span class="big-label">入库单</span>
                    </div>
                    <div class="center-content">
                        <span class="middle-label">{{checkList.in_stock_company_name}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label-stock">供货单位：{{checkList.company_name}}</span>
                    </div>
                    <el-table :data="checkList.table_data" border  show-summary  :summary-method="getSummaries">
                        <el-table-column inline-template label="入库单号" align="center">
                            <div>{{row.in_stock_code}}</div>
                        </el-table-column>
                        <el-table-column inline-template label="入库操作人" align="center">
                            <div>{{row.in_stock_name}}</div>
                        </el-table-column>
                        <el-table-column inline-template label="品名" align="center">
                            <div>{{row.goods_name}}</div>
                        </el-table-column>
                        <el-table-column inline-template label="入库数量" align="center">
                            <div>{{row.sum_qty}}</div>
                        </el-table-column>
                        <el-table-column inline-template label="币别" align="center">
                            <div>{{row.currency_code}}</div>
                        </el-table-column>
                        <el-table-column inline-template label="入库单价" align="center">
                            <div>{{row.single_price}}</div>
                        </el-table-column>
                        <el-table-column inline-template label="入库总金额" align="center">
                            <div>{{row.sum_price}}</div>
                        </el-table-column>
                        <el-table-column inline-template label="入库时间" align="center">
                            <div></div>
                        </el-table-column>
                        <el-table-column inline-template label="备注" align="center">
                            <div></div>
                        </el-table-column>
                    </el-table>
                        <el-row class="mt-md ml-sm">
                            <el-col :span="6">
                                <div class="row-content">
                                    <span class="middle-label">负责人:  </span>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="row-content">
                                    <span class="middle-label">财务人员:  </span>
                                </div>
                            </el-col>
                        </el-row>
            <span slot="footer">
                <request-button req-key="export_stock" @click="export_order" :timeout="60000">导出入库单</request-button>
                <el-button type="default" size="mini" @click.native="cancal">关闭</el-button>
            </span>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">
    .export-stock{
        .row-content{
            display: flex;
            align-items: center;
            .label-stock{
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
            font-size: 17px;
        }
        .center-content .middle-label{
            font-weight: bold;
            font-size: 15px;
        }
        .row-content .middle-label{
            font-weight : bold;
            font-size: 15px;
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
                        sums[0] = '合计';
                        sums[3] = this.checkList.amount_qty;
                        sums[6] = this.checkList.amount_price;
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
