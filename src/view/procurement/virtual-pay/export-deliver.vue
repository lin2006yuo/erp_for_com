<template>
    <el-row class="export_deliver">
        <page-dialog :title="`导出虚拟送货单`" v-model="orderDialog" width="60%">
                    <div class="center-content">
                        <span class="big-label">{{checkList.company}}</span>
                    </div>
                    <div class="center-content">
                        <span class="middle-label">送货单</span>
                    </div>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label-deliver">送货日期： </span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label-deliver">单据编号: {{checkList.deliver_code}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label-deliver">客户单位：{{checkList.customer}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="row-content">
                                <span class="label-deliver">{{checkList.contact}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <div class="row-content">
                        <span class="label-deliver">收货单位: {{checkList.reception}}</span>
                    </div>
                    <div class="row-content">
                        <span class="label-deliver">收货地址: {{checkList.reception_address}}</span>
                    </div>
                    <div>
                        <table class="tableData-deliver full-width" cellpadding="5" border>
                            <tr class="bold-font th-info">
                                <th width="10%">序号</th>
                                <th width="50%">订单号</th>
                                <th width="20%">品名</th>
                                <th width="10%">数量</th>
                                <th width="10%">备注</th>
                            </tr>
                            <tr class="change-deliver" v-for="(item,index) in this.checkList.table_data" :key="index">
                                <td width="10%">{{index+1}}</td>
                                <td width="50%">{{item.virtual_purchase_order_id}}</td>
                                <td width="20%">{{item.goods_name}}</td>
                                <td width="10%">{{item.qty}}</td>
                                <td width="10%"></td>
                            </tr>
                            <tr class="change-deliver">
                                <td colspan="3">总计</td>
                                <td>{{checkList.total_qty}}</td>
                                <td>&nbsp</td>
                            </tr>
                        </table>
                    </div>
            <span slot="footer">
                <!--<el-button type="primary" size="mini" @click.native="export_order">导出送货单</el-button>-->
                <request-button req-key="export_deliver" @click="export_order" :timeout="60000">导出送货单</request-button>
                <el-button type="default" size="mini" @click.native="cancal">关闭</el-button>
            </span>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">
    .export_deliver{
        .row-content{
            display: flex;
            align-items: center;
            .label-deliver{
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
        .tableData-deliver{
            border:1px solid #E0E6ED;
            border-collapse:collapse;
            text-align: center;
            margin-top: 10px;
            font-size: 12px;
            tr.change-deliver:hover{
                background-color: #EFF2F7
            }
        }
        .tableData-deliver .th-info th{
            background-color: #EFF2F7
        }
        .tableData-deliver tr th, .tableData-deliver tr td{
            border:1px solid #E0E6ED;
            word-break: break-all;
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
