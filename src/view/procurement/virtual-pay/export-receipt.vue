<template>
    <el-row class="export-receipt">
        <page-dialog :title="`导出虚拟收货单`" v-model="orderDialog" width="60%">
                    <div class="center-content">
                        <span class="big-label">收货单</span>
                    </div>
                    <div class="center-content">
                        <span class="middle-label">{{checkList.receipt_company_name}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label-receipt">供货商：{{checkList.company_name}}</span>
                    </div>
                    <el-table :data="checkList.table_data" border  show-summary  :summary-method="getSummaries">
                        <el-table-column inline-template label="收货单号" align="center">
                            <div>{{row.receipt_code}}</div>
                        </el-table-column>
                        <el-table-column inline-template label="收货人" align="center">
                            <div>{{row.receipt_name}}</div>
                        </el-table-column>
                        <el-table-column inline-template label="品名" align="center">
                            <div>{{row.goods_name}}</div>
                        </el-table-column>
                        <el-table-column inline-template label="数量" align="center">
                            <div>{{row.sum_qty}}</div>
                        </el-table-column>
                        <el-table-column inline-template label="收货时间" align="center">
                            <div></div>
                        </el-table-column>
                        <el-table-column inline-template label="备注" align="center">
                            <div></div>
                        </el-table-column>
                    </el-table>
            <span slot="footer">
                <request-button req-key="export_receipt" @click="export_order" :timeout="60000">导出收货单</request-button>
                <el-button type="default" size="mini" @click.native="cancal">关闭</el-button>
            </span>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">
    .export-receipt{
        .row-content{
            display: flex;
            align-items: center;
            .label-receipt{
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
                        sums[0] = '总计';
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
