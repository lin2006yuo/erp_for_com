<template>
    <div class="p-print">
        <page-dialog v-model="printVisable" size="large" :title="`打印采购单编号：${lookData.purchase_order_code} 信息`"
                     @change="change_dialog" :close-on-click-modal="false">
            <div ref="print">
                <table class="template">
                    <th colspan="9">采购单 编号：{{lookData.purchase_order_code}}&nbsp;&nbsp;&nbsp;采购单生成时间：{{lookData.create_time|dateFilter}}</th>
                    <tbody>
                    <tr>
                        <td colspan="4">供应商资料</td>
                        <td colspan="5">收货资料</td>
                    </tr>
                    <tr>
                        <td colspan="2" nowrap="nowrap" style="text-align: right;">
                            <span> 供应商名称：</span>
                        </td>
                        <td colspan="2" style="text-align: left;">
                            <span>{{lookData.supplier}}</span>
                        </td>
                        <td colspan="2" style="text-align: right;">
                            <span>收货仓库：</span>
                        </td>
                        <td colspan="3" style="text-align: left;">
                            <span>{{lookData.warehouse}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="text-align: right;">
                            <span> 结算方式：</span>
                        </td>
                        <td colspan="2" style="text-align: left;">
                            <span>{{lookData.balance_type}}</span>
                        </td>
                        <td colspan="2" style="text-align: right;">
                            <span>采购员：</span>
                        </td>
                        <td colspan="3" style="text-align: left;">
                            <span>{{lookData.purchaser}}<span v-if="lookData.purchase_mobile">，{{lookData.purchase_mobile}}</span></span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="text-align: right;">
                            <span> 联系人：</span>
                        </td>
                        <td colspan="2" style="text-align: left;">
                            <span>{{lookData.contacts}},{{lookData.mobile}}</span>
                        </td>
                        <td nowrap="nowrap" colspan="2" style="text-align: right;">
                            <span>备用联系人:</span>
                        </td>
                        <td colspan="3" style="text-align: left;">
                            <span>{{lookData.spare_name}}<span
                                    v-if="lookData.spare_mobile">，{{lookData.spare_mobile}}</span></span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="text-align: right;">
                            <span> 地址：</span>
                        </td>
                        <td colspan="2" style="text-align: left;">
                            <span>{{lookData.address}}</span>
                        </td>
                        <td colspan="2" style="text-align: right;">
                            <span>预计到达日期：</span>
                        </td>
                        <td colspan="3" style="text-align: left;">
                            <span>{{lookData.expect_arrive_date}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="text-align: right;">
                        </td>
                        <td colspan="2" style="text-align: left;">
                        </td>
                        <td colspan="2" style="text-align: right;">
                            <span>地址：</span>
                        </td>
                        <td colspan="3" style="text-align: left;">
                            <span>{{lookData.warehouse_address}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4">发票号：</td>
                        <td colspan="5">发票说明：</td>
                    </tr>
                    <tr>
                        <td>序号</td>
                        <td>图片</td>
                        <td>sku/sku别名</td>
                        <td>货品名称</td>
                        <td>规格</td>
                        <td>采购数量</td>
                        <td>到货数量</td>
                        <td>入库数量</td>
                        <td>单价</td>
                    </tr>
                    <tr v-for="(item,i) in  printData">
                        <td>{{i+1}}</td>
                        <td>
                            <el-popover
                                    v-if="item.thumb"
                                    placement="right"
                                    trigger="hover">
                                <img :src="item.thumb|filterImage"
                                     width="200px"
                                     height="200px">
                                <span slot="reference">
                            <img :src="item.thumb|filterImage"
                                 height="85px" width="85px"
                                 style="border:none">
                                        </span>
                            </el-popover>
                        </td>
                        <td>
                            <div>{{item.sku}}</div>
                            <div>{{item.sku_alias|filterAlias}}</div>
                        </td>
                        <td>{{item.sku_short_name }}</td>
                        <td>
                            <div v-for="(attr,i) in item.sku_attr" :key="i+attr" style="white-space:nowrap;">{{attr}}
                            </div>
                        </td>
                        <td>{{item.qty}}</td>
                        <td>{{item.arrival_qty}}</td>
                        <td>{{item.in_qty}}</td>
                        <td>{{lookData.currency_code}} {{item.price|moneyFilter}}</td>
                    </tr>
                    <tr>
                        <td colspan="9">品类数：{{count}}，总数量：{{purchase_sum}}</td>
                    </tr>
                    <tr>
                        <td colspan="9">实际应付款：{{lookData.currency_code}} {{lookData.payable_amount|moneyFilter}}</td>
                    </tr>
                    <tr>
                        <td colspan="9">总重量(g)：{{lookData.totalWeight}}</td>
                    </tr>
                    <tr>
                        <td colspan="9">运费：{{lookData.currency_code}} {{lookData.shipping_cost|moneyFilter}}</td>
                    </tr>
                    <tr>
                        <td colspan="9">总金额：{{lookData.currency_code}} {{lookData.amount|moneyFilter}}</td>
                    </tr>
                    <tr>
                        <!--<td colspan="9">备注：{{lookData.remark}}</td>-->
                        <td colspan="9">备注：
                            <span class="inline" v-for="data in operate_content">{{data}};</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="mini" @click="print()">打 印</el-button>
                <el-button size="mini" @click="cancel">关 闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    table tr td {
        border: 1px soild #999;
    }
</style>
<script>
    import pageDialog from "../../../components/page-dialog.vue"
    import {api_publish_look_sku, api_log_detail} from "../../../api/purchase"
    import {api_look_supplier, api_get_balance} from "../../../api/assert-sup"

    export default {
        data() {
            return {
                printVisable: false,
                printData: [],
                actionLog: [],
                operate_content: [],
                balanceList: []
            }
        },
        methods: {
            //请求Sku
            sku_init() {
                let data = {
                    purchase_order_id: this.listId,
                    page: 1,
                    pageSize: 200
                };
                this.$http(api_publish_look_sku, data).then(res => {
                    this.lookData.totalWeight = res.data.map(row => row.weight).reduce((total, weight) => total += weight);
                    this.printData = res.data;
                }).catch(code => {
                    console.log(code)
                })
            },
            balance_type() {
                this.$http(api_get_balance).then(res => {
                    this.balanceList = res.map(row => {
                        return {
                            label: row.name,
                            value: row.label,
                        }
                    });
                }).catch(code => {
                    console.log(code);
                });
            },
            supplier_init() {
                let balance_type = '';
                this.$http(api_look_supplier, this.lookData.supplier_id).then(res => {
                    if (res.balance_type > 0) {
                        let find = this.balanceList.find(row => row.value === res.balance_type);
                        if (!!find) {
                            balance_type = find.label;
                        }
                    } else {
                        balance_type = '';
                    }
                    this.$set(this.lookData, 'balance_type', balance_type);
                    this.$set(this.lookData, 'contacts', res.contacts);
                    this.$set(this.lookData, 'mobile', res.mobile);
                    this.$set(this.lookData, 'address', res.address);
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                });
            },
            //请求日记
            log_init() {
                this.$http(api_log_detail, {purchase_order_id: this.listId}).then(res => {
                    this.actionLog = res.data;
                    this.operate_content = [];
                    this.actionLog.forEach(data => {
                        this.operate_content.push(data.operate_content);
                    })
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })

            },
            print() {
                let newWindow = window.open('page.html');
                let codestr = this.$refs.print.outerHTML;
                newWindow.document.write('<title>ERP系统--利朗达</title>');
                newWindow.document.write('<style>table tr td{border:1px solid #999;text-align: center;}table{border-collapse:collapse;}</style>');   //向文档写入HTML表达式或者JavaScript代码
                newWindow.document.write(codestr);
                newWindow.document.close();
                newWindow.print();
                this.printVisable = false;
                return true;
            },
            cancel() {
                this.printVisable = false;
            },
            change_dialog(val) {
                if (val) {
                    this.sku_init();
                    this.log_init();
                    this.balance_type();
                }
            },
        },
        computed: {
            count() {
                return this.printData.length
            },
            purchase_sum() {
                let sum = 0;
                this.printData.forEach(num => {
                    sum += Number(num.qty);
                });
                return sum;
            },
        },
        filters: {
            filterAlias(val){
                return Array.isArray(val)?val.join(','):val
            },
            dateFilter(val) {
                return datef('YYYY-MM-dd HH:mm:ss', val);
            },
            moneyFilter(val) {
                return Number(val).toFixed(3);
            },
            filterImage(val) {
                return val.replace("_60x60", "_200x200");
            },
        },
        watch: {
            value(val) {
                this.printVisable = val;
            },
            printVisable(val) {
                this.$emit("input", val)
            },
            'lookData'(val) {
                if (val.supplier_id) {
                    this.supplier_init();
                }
            }
        },
        props: {
            value: {},
            lookData: {
                type: Object
            },
            listId: {
                required: true,
                type: Number,
            }
        },
        components: {
            pageDialog
        }
    }
</script>
