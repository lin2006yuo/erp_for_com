<template>
    <div class="p-print">
        <page-dialog v-model="printVisable" size="large" :title="`打印采购计划编号：${lookData.purchase_plan_code} 信息`"
                     @change="change_dialog" :close-on-click-modal="false">
            <div ref="print">
                <table class="template">
                    <th colspan="9">采购计划 编号：{{lookData.purchase_plan_code}}&nbsp;&nbsp;&nbsp;采购计划生成时间：{{lookData.create_time|dateFilter}}</th>
                    <tbody>
                    <tr class="bold">
                        <td colspan="4">供应商资料</td>
                        <td colspan="5">收货资料</td>
                    </tr>
                    <tr>
                        <td colspan="1" nowrap="nowrap" style="text-align: right;">
                            <span> 供应商名称:</span>
                        </td>
                        <td colspan="3" style="text-align: left;">
                            <span>{{lookData.company_name}}</span>
                        </td>
                        <td nowrap="nowrap" colspan="2" style="text-align: right;">
                            <span>收货仓库:</span>
                        </td>
                        <td colspan="3" style="text-align: left;">
                            <span>{{lookData.warehouse}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td nowrap="nowrap" colspan="1" style="text-align: right;">
                            <span> 结算方式:</span><br>
                        </td>
                        <td colspan="3" style="text-align: left;">
                            <span>{{lookData.balance_type}}</span>
                        </td>
                        <td nowrap="nowrap" colspan="2" style="text-align: right;">
                            <span>采购员:</span><br>
                        </td>
                        <td colspan="3" style="text-align: left;">
                            <span>{{lookData.purchaser}}<span v-if="lookData.purchase_mobile">，{{lookData.purchase_mobile}}</span></span>
                        </td>
                    </tr>
                    <tr>
                        <td nowrap="nowrap" colspan="1" style="text-align: right;">
                            <span> 联系人:</span><br>
                        </td>
                        <td colspan="3" style="text-align: left;">
                            <span>{{lookData.contacts}}<span v-if="lookData.mobile">，{{lookData.mobile}}</span></span>
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
                        <td nowrap="nowrap" colspan="1" style="text-align: right;">
                            <span> 地址:</span>
                        </td>
                        <td colspan="3" style="text-align: left;">
                            <span>{{lookData.address}}</span>
                        </td>
                        <td nowrap="nowrap" colspan="2" style="text-align: right;">
                            <span>仓库地址:</span>
                        </td>
                        <td colspan="3" style="text-align: left;">
                            <span>{{lookData.warehouse_address}}</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table class="template">
                    <tr class="bold">
                        <th>序号</th>
                        <th>图片</th>
                        <th>产品SKU/别名</th>
                        <th colspan="3">货品名称</th>
                        <th>规格</th>
                        <th>采购数量</th>
                        <th>采购单价{{currency?`(${currency})`:''}}</th>
                    </tr>
                    <tbody>
                    <tr v-for="(item,index) in  printData" :key="item.sku">
                        <td nowrap="nowrap">
                            {{index+1}}
                        </td>
                        <td nowrap="nowrap">
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
                        <td nowrap="nowrap">
                            <div>{{item.sku}}</div>
                            <div>{{item.sku_alias|filterAlias}}</div>
                        </td>
                        <td colspan="3">{{item.sku_short_name }}</td>
                        <td nowrap="nowrap">
                            <div v-for="(attr,i) in item.sku_attr" :key="i+attr" style="white-space:nowrap;">{{attr}}
                            </div>
                        </td>
                        <td nowrap="nowrap">{{item.purchase_qty}}</td>
                        <td nowrap="nowrap">{{item.purchase_price|filterAmount}}</td>
                    </tr>
                    </tbody>
                </table>
                <table class="template">
                    <tr class="bold">
                        <th colspan="2">流水号</th>
                        <th>货品种类</th>
                        <th>货品总数</th>
                        <th>总重量(g)</th>
                        <th>运费</th>
                        <th>优惠金额{{currency?`(${currency})`:''}}</th>
                        <th>商品金额{{currency?`(${currency})`:''}}</th>
                        <th>总金额{{currency?`(${currency})`:''}}</th>
                    </tr>
                    <tbody v-for="(row,index) in lookData.ship_fee_discount_json_1" :key="index">
                    <tr>
                        <td colspan="2">{{row.external_number}}</td>
                        <td>{{count}}</td>
                        <td>{{purchase_sum}}</td>
                        <td>{{lookData.totalWeight}}</td>
                        <td>{{row.expenses}}</td>
                        <td>{{row.discount|filterAmount}}</td>
                        <td>{{supplier_goods_amount(row) | filterAmount}}</td>
                        <td>{{supplier_goods_tatol(row) | filterAmount}}</td>
                    </tr>
                    <tr>
                        <td colspan="9" style="text-align: left;height: 50px;">备注：{{row.description}}</td>
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

    table tr th {
        border: 1px soild #999;
    }

    .bold td {
        font-weight: bold;
    }
</style>
<script>
    import pageDialog from "../../../components/page-dialog.vue"
    import {add_look_sku} from "../../../api/procurement-plan"
    import {api_look_supplier, api_get_balance} from "../../../api/assert-sup"

    export default {
        data() {
            return {
                printVisable: false,
                printData: [],
                actionLog: [],
                operate_content: [],
                balanceList: [],
                purchase_sum: 0,
                count: 0,
            }
        },
        methods: {
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
                        let find = this.balanceList.find(row => {
                            return row.value === res.balance_type;
                        });
                        if (!!find) {
                            balance_type = find.label;
                        }
                    } else {
                        balance_type = '';
                    }
                    this.$set(this.lookData, 'company_name', res.company_name);
                    this.$set(this.lookData, 'balance_type', balance_type);
                    this.$set(this.lookData, 'contacts', res.contacts);
                    this.$set(this.lookData, 'mobile', res.mobile);
                    this.$set(this.lookData, 'address', res.address);
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                });
            },
            sku_init() {
                let data = {
                    purchase_plan_id: this.lookData.id,
                    page: 1,
                    pageSize: 200
                };
                this.$http(add_look_sku, data).then(res => {
                    this.printData = res.data;
                    this.count = res.count;
                    this.purchase_sum = 0;
                    this.printData.forEach((num, index) => {
                        if (index === 0) {
                            this.lookData.purchaser = num.purchaser;
                        }
                        this.purchase_sum += Number(num.purchase_qty);
                    });
                }).catch(code => {
                    console.log(code)
                })
            },
            supplier_goods_amount(row) {
                let ret = 0;
                this.printData.forEach(goods => {
                    if ((goods.purchaser_id === row.purchaser_id) && (goods.supplier_id === row.supplier_id)) {
                        const price = goods.purchase_price || 0;
                        const count = goods.purchase_qty || 0;
                        ret += Number(price) * Number(count);
                    }
                });
                return ret;
            },
            supplier_goods_tatol(row) {
                return this.supplier_goods_amount(row) + parseFloat(row.expenses) - parseFloat(row.discount) || 0;
            },
            print() {
                let newWindow = window.open('page.html');
                let codestr = this.$refs.print.outerHTML;
                newWindow.document.write('<title>ERP系统--利朗达</title>');
                newWindow.document.write('<style>table tr td{border:1px solid #999;text-align: center;} table .bold th{border:1px solid #999;text-align: center;} .bold td{font-weight:bold;}table{border-collapse:collapse;width: 100%;}</style>');   //向文档写入HTML表达式或者JavaScript代码
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
                    this.balance_type();
                }
            },
        },
        computed:{
            currency(){
                return this.lookData.currency_code;
            }
        },
        filters: {
            filterAlias(val){
                return Array.isArray(val)?val.join(','):val
            },
            filterAmount(val) {
                return !!val&&!isNaN(Number(val))?Number(val).toFixed(3):val;
            },
            dateFilter(time) {
                return datef('YYYY-MM-dd hh:mm:ss', time);
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
        },
        components: {
            pageDialog
        }
    }
</script>
