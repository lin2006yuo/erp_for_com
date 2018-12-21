<template>
    <el-row class="export_invoice">
        <page-dialog :title="`导出虚拟发票`" v-model="orderDialog" width="50%">
                    <div class="center-content">
                        <span class="big-label">Commercial Invoice</span>
                    </div>
                    <div class="center-content">
                        <span class="middle-label">商业发票</span>
                    </div>
            <div class="content">
                <div class="idtable">
                    <div class="left">
                        <div class="left_item">Contract No: {{checkList.contract_no}}</div>
                        <div class="left_item">Shipper/Exporter (complete name and address)</div>
                        <div class="left_info">Company: {{checkList.supplier_info.company}}</div>
                        <div class="left_info">Add: {{checkList.supplier_info.address}}</div>
                        <div class="left_item">Tel: {{checkList.supplier_info.telephone}}</div>
                        <div class="left_fax">Fax: {{checkList.supplier_info.fax}}</div>
                    </div>
                    <div class="right-invoice">
                        <div class="db">
                            <span style="width:70px">交易日期: </span>
                            <div class="ff"></div>
                        </div>
                        <div class="bdt">Consignee (complete name and address)</div>
                        <div class="sp">
                            <span style="width:70px">Company: </span>
                            <div class="ff">{{checkList.consignee_info.company}}</div>
                        </div>
                        <div class="spb">Add: {{checkList.consignee_info.address}}</div>
                        <div class="bdt">Tell: {{checkList.consignee_info.telephone}}</div>
                        <div class="last">Fax: {{checkList.consignee_info.fax}}</div>
                    </div>
                </div>
                <table style="width:100%">
                    <tr>
                        <th colspan="2" style="width:50.1%">Product Name& Description of Goods</th>
                        <th>Qty(PCS) </th>
                        <th>UnitValue(CNY)</th>
                        <th>Total Value(CNY)</th>
                    </tr>
                    <tr>
                        <td colspan="2">品名及货物描述</td>
                        <td >数量 </td>
                        <td>单数</td>
                        <td>总价</td>
                    </tr>
                    <tr  v-for="(item,index) in this.checkList.table_data" :key="index">
                        <td style="width:37px">{{index+1}}</td>
                        <td style="width:288px">{{item.goods_name}}</td>
                        <td>{{item.sum_qty}}</td>
                        <td>{{item.single_price}}</td>
                        <td>{{item.sum_price}}</td>
                    </tr>
                </table>
                <div class="foot-info">
                    <div class="cutdb">
                        <div class="footr">
                            <span>Total Invoice Value: <span>&nbsp</span></span>
                            <div class="countbox">{{checkList.total_amount}}</div>
                        </div>
                    </div>
                    <div class="footl">
                    </div>
                    <div>
                        <div>Shipper's Signature & Stamp</div>
                        <div style="margin-left:88px">发件人签字、盖章</div>
                    </div>
                </div>
            </div>
            <span slot="footer">
                <request-button req-key="export_invoice" @click="export_order" :timeout="60000">导出商业发票</request-button>
                <el-button type="default" size="mini" @click.native="cancal">关闭</el-button>
            </span>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">
    .export_invoice{
        .margin-top{
            margin-top: 30px
        }
        .center-content{
            padding: 3px;
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
        .content{
            width: 100%;
            margin-top: 15px;
        }
        .content .idtable{
            width: 100%;
            display: flex;
            font-weight: bold;
        }
        .content .idtable .left{
            width: 50%;
            border-top: 1px solid black;
            border-left: 1px solid black
        }
        .left .left_item{
            line-height: 30px;
            heigt: 30px
        }
        .left .left_fax{
            width: 100%;
            line-height: 30px;
            height: 30px;
            border-top: 1px solid black;
        }
        .left .left_info{
            width: 100%;
            line-height: 61px;
        }
        .content .idtable .right-invoice{
            width: 50%;
            border-right: 1px solid black;
            border-top: 1px solid black;
            border-left: 1px solid black;

        }
        .right-invoice .db{
            display: flex;
            width: 100%;
            border-right: 1px solid black;
            border-bottom: 1px solid black;
            line-height: 30px;
        }
        .right-invoice .ff{
            flex: 1;
            border-left: 1px solid black;
            margin-left: 4px
        }
        .right-invoice .bdt{
            border-bottom: 1px solid black;
            line-height: 29px;
            height: 29px;
        }
        .right-invoice .sp{
            display: flex;
            border-bottom: 1px solid black;
            height:60px;
            line-height: 30px;
            text-align: center;
        }
        .right-invoice .spb{
            line-height: 30px;
            height: 60px;
            border-bottom: 1px solid black;
        }
        .right-invoice .last{
            line-height: 30px;
        }
        table{
            width: 663px;
            border-collapse: collapse
        }
        th{
            border: 1px solid black;
            line-height: 30px;
        }
        td{
            border: 1px solid black;
            line-height: 30px;
            text-align: center;
            font-size: 13px;
        }
        .foot-info{
            font-weight: bold;
            height: 180px;
            border-right: 1px solid black;
            border-bottom: 1px solid black;
            border-left: 1px solid black;
        }
       .foot-info .cutdb{
            height: 100px;
        }
        .foot-info .footl{
            width: 462px;
            height: 20px;
            margin-bottom: 10px;
            border-bottom: 1px solid black
        }
        .cutdb .footr{
            display:flex;
            justify-content: flex-end;
        }
        .footr .countbox{
            width:172px;
            border-bottom: 1px solid black
            border-left: 1px solid black
            text-align: center;
            line-height: 100px;
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
