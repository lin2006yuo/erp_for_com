<template>
    <div class="p-print">
        <page-dialog v-model="printVisible"
                     size="large"
                     @open="open"
                     :title="`打印调拨计划编号：${printAction.number} 信息`"
                     :close-on-click-modal="false">
            <div ref="print" :style="{height:`${height}px`, width:`${width}px`, margin: '0 auto'}">
                <h3 style="text-align: center">调拨单编号：{{printAction.number}}</h3>
                <table class="template">
                    <tbody>
                    <tr>
                        <td width="15%" style="font-weight: bold;">出库仓库</td>
                        <td width="15%">{{printData.out_warehouse}}</td>
                        <td width="15%" style="font-weight: bold;">入库仓库</td>
                        <td width="20%">{{printData.in_warehouse}}</td>
                        <td width="15%" style="font-weight: bold;">状态</td>
                        <td width="20%">{{printData.status_txt}}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold;">创建人</td>
                        <td>{{printData.create}}</td>
                        <td style="font-weight: bold;">创建时间</td>
                        <td>{{printData.create_time | timeFilter}}</td>
                        <td style="font-weight: bold;">审核时间</td>
                        <td>{{printData.auditor_time | timeFilter}}</td>
                    </tr>
                    </tbody>
                </table>

                <table class="template" style="margin-top:10px;">
                    <tr>
                        <th width="5%">序号</th>
                        <th width="10%">图片</th>
                        <th width="13%">SKU/SKU别名</th>
                        <th width="10%" v-if="printData.is_third">第三方SKU</th>
                        <th :width="printData.is_third? '18%':'33%'">商品名称</th>
                        <th width="8%">物流属性</th>
                        <th width="8%">调拨数量</th>
                        <th width="8%">出库数量</th>
                        <th width="10%">出库货位号</th>
                        <th width="10%">已入库数量</th>
                    </tr>
                    <tbody>
                    <tr v-for="(row,index) in printData.sku_list" :key="index">
                        <!--序号-->
                        <td>{{row.num}}</td>
                        <!--图片-->
                        <td>
                            <el-popover
                                    placement="right"
                                    trigger="hover">
                                <img :src="row.thumb | filterImage" width="200px" height="200px">
                                <span slot="reference">
                                    <img :src="row.thumb" v-if="row.thumb"
                                         height="60px" width="60px"
                                         style="border:none;vertical-align: middle">
                                </span>
                            </el-popover>
                        </td>
                        <!--SKU/SKU别名-->
                        <td>
                            <div>
                                <div>
                                    {{row.sku}}
                                </div>
                                <div v-for="item in row.sku_alias">{{item || `--`}}</div>
                            </div>
                        </td>
                        <!--第三方SKU-->
                        <td v-if="printData.is_third">
                            <div>{{row.third_sku}}</div>
                        </td>
                        <!--商品名称-->
                        <td>
                            <div>{{row.goods_name}}</div>
                        </td>
                        <!--物流属性-->
                        <td>
                            <div>{{row.transport_property}}</div>
                        </td>
                        <!--调拨数量-->
                        <td>
                            <span>{{row.quantity}}</span>
                        </td>
                        <!--出库数量-->
                        <td>
                            <span>{{row.send_qty}}</span>
                        </td>
                        <!--出库货位号-->
                        <td>
                            <div>{{row.out_cargo_code}}</div>
                        </td>
                        <!--已入库数量-->
                        <td>
                            <div>{{row.in_qty}}</div>
                        </td>
                    </tr>
                    <tr>
                        <td :colspan="printData.is_third ? 6 : 5">
                            <div style="text-align: center;font-weight: bold;font-size:16px;">合计：</div>
                        </td>
                        <td>{{sum_quantity}}</td>
                        <td>{{sum_send_qty}}</td>
                        <td></td>
                        <td>{{sum_in_qty}}</td>
                    </tr>
                    <tr>
                        <td :colspan="printData.is_third ? 10 : 9">
                            <div style="text-align: left;font-weight: bold;">备注：{{printData.remark}}</div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div style="margin-top: 5px">
                    <div style="display: inline-block;width:18%">
                        <span>发单：</span>
                    </div>
                    <div style="display: inline-block;width:18%;margin-left:5px">
                        <span>拣货：</span>
                    </div>
                    <div style="display: inline-block;width:18%;margin-left:5px">
                        <span>打包：</span>
                    </div>
                    <div style="display: inline-block;width:18%;margin-left:5px">
                        <span>出库：</span>
                    </div>
                    <div style="display: inline-block;width:18%;margin-left:5px">
                        <span>审核：</span>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="mini" @click="print()">打 印</el-button>
                <el-button size="mini" @click="cancel">关 闭</el-button>
            </div>
        </page-dialog>
    </div>
    <!--<print-dialog v-model="printVisible"
                  size="large"
                  class="c-allocation-print"
                  :title="`打印调拨计划编号：${printAction.number} 信息`"
                  :close-on-click-modal="false"
                  ref="printer">
        <div slot="title">
            <div class="print">
                <p class="print-title">
                    请使用本界面的打印按钮直接打印，不要用浏览器打印功能
                    <el-button @click="prints">打印</el-button>
                    <span class="fr mr-sm">
                        <span>打印机：</span>
                        <select-printer :value="printer" @input="changePrinter"
                                        class="inline width-lg"></select-printer>
                </span>
                </p>
            </div>
        </div>
        <div :style="{height:`${height}px`, width:`${width}px`, margin: '0 auto'}">
            <h3 style="text-align: center">调拨单编号：{{printAction.number}}</h3>
            <table class="template">
                <tbody>
                <tr>
                    <td width="15%" style="font-weight: bold;">出库仓库</td>
                    <td width="15%">{{printData.out_warehouse}}</td>
                    <td width="15%" style="font-weight: bold;">入库仓库</td>
                    <td width="20%">{{printData.in_warehouse}}</td>
                    <td width="15%" style="font-weight: bold;">状态</td>
                    <td width="20%">{{printData.status_txt}}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">创建人</td>
                    <td>{{printData.create}}</td>
                    <td style="font-weight: bold;">创建时间</td>
                    <td>{{printData.create_time | timeFilter}}</td>
                    <td style="font-weight: bold;">审核时间</td>
                    <td>{{printData.auditor_time | timeFilter}}</td>
                </tr>
                </tbody>
            </table>

            <table class="template" style="margin-top:10px;">
                <tr>
                    <th width="5%">序号</th>
                    <th width="10%">图片</th>
                    <th width="15%">SKU/SKU别名</th>
                    <th width="15%" v-if="printData.is_third">第三方SKU</th>
                    <th :width="printData.is_third? '15%':'30%'">商品名称</th>
                    <th width="10%">调拨数量</th>
                    <th width="10%">出库数量</th>
                    <th width="10%">出库货位号</th>
                    <th width="10%">已入库数量</th>
                </tr>
                <tbody>
                <tr v-for="(row,index) in printData.sku_list" :key="index">
                    &lt;!&ndash;序号&ndash;&gt;
                    <td>{{row.num}}</td>
                    &lt;!&ndash;图片&ndash;&gt;
                    <td>
                        <el-popover
                                placement="right"
                                trigger="hover">
                            <img :src="row.thumb | filterImage" width="200px" height="200px">
                            <span slot="reference">
                                    <img :src="row.thumb" v-if="row.thumb"
                                         height="60px" width="60px"
                                         style="border:none;vertical-align: middle">
                                </span>
                        </el-popover>
                    </td>
                    &lt;!&ndash;SKU/SKU别名&ndash;&gt;
                    <td>
                        <div>
                            <div>
                                {{row.sku}}
                            </div>
                            <div v-for="item in row.sku_alias">{{item || `&#45;&#45;`}}</div>
                        </div>
                    </td>
                    &lt;!&ndash;第三方SKU&ndash;&gt;
                    <td v-if="printData.is_third">
                        <div>{{row.third_sku}}</div>
                    </td>
                    &lt;!&ndash;商品名称&ndash;&gt;
                    <td>
                        <div>{{row.goods_name}}</div>
                    </td>
                    &lt;!&ndash;调拨数量&ndash;&gt;
                    <td>
                        <span>{{row.quantity}}</span>
                    </td>
                    &lt;!&ndash;出库数量&ndash;&gt;
                    <td>
                        <span>{{row.send_qty}}</span>
                    </td>
                    &lt;!&ndash;出库货位号&ndash;&gt;
                    <td>
                        <div>{{row.out_cargo_code}}</div>
                    </td>
                    &lt;!&ndash;已入库数量&ndash;&gt;
                    <td>
                        <div>{{row.in_qty}}</div>
                    </td>
                </tr>
                <tr>
                    <td :colspan="9">
                        <div style="text-align: left;font-weight: bold;">备注：{{printData.remark}}</div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="mini" @click="print">打 印</el-button>
            <el-button size="mini" @click="cancel">关 闭</el-button>
        </div>
    </print-dialog>-->
</template>
<style lang="stylus">
    .c-allocation-print {
        table tr {
            td, th {
                border: 1px soild #999;
            }

        }
        .print {
            text-align: center;
            margin-bottom: 10px;
            color: #ff4949;
            height: 40px;
            line-height: 40px;
            .print-title {
                width: 100%;
                border: 3px solid black;
                font-size: 2rem;
                background-color: yellow;
                margin: 0 auto;
            }
        }
    }
</style>
<script>

    export default {
        data() {
            let dips = getDPI();
            let height = (parseFloat(292) * (dips.x / 25.4)).toFixed(4);
            let width = (parseFloat(205) * (dips.y / 25.4)).toFixed(4);
            return {
                printVisible: false,
                height: height,
                width: width,
                sum_quantity: 0,
                sum_send_qty: 0,
                sum_in_qty: 0,
            }
        },
        filters: {
            timeFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
            filterImage(val) {
                return val.replace("_60x60", "_200x200");
            },
        },
        methods: {
            open() {
                this.sum_in_qty = 0;
                this.sum_send_qty = 0;
                this.sum_quantity = 0;

                this.printData.sku_list.forEach(row => {
                    this.sum_quantity += Number(row.quantity);
                    this.sum_send_qty += Number(row.send_qty);
                    this.sum_in_qty += Number(row.in_qty);
                });
            },
            print() {
                let newWindow = window.open('page.html');
                let codestr = this.$refs.print.outerHTML;
                newWindow.document.write('<title>ERP系统--利朗达</title>');
                newWindow.document.write('<style>table tr td,th{border:1px solid #999;text-align: center;}table{border-collapse:collapse;}</style>');   //向文档写入HTML表达式或者JavaScript代码
                newWindow.document.write(codestr);
                newWindow.document.close();
                newWindow.print();
                this.printVisible = false;
                return true;
            },
            sum(data, key) {
                console.log(`xxxxxx:`, data);
                let sum = 0;
                data.forEach(row => {
                    sum += Number(row[key]);
                });
                return sum;
            },
            cancel() {
                this.printVisible = false;
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
        watch: {
            value(val) {
                this.printVisible = val;
            },
            printVisible(val) {
                this.$emit("input", val)
            }
        },
        props: {
            value: {},
            printData: {
                type: Object
            },
            printAction: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            printDialog: require('@/components/print-dialog.vue').default,
        }
    }
</script>
