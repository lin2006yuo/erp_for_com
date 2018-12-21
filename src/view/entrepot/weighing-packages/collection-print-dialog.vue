<template>
    <print-dialog :title="`集结完成(${printData.title || printData.code})`"
                  size="large"
                  class="p-weighing-packages-print"
                  @open="open"
                  v-model="visible"
                  ref="printer"
                  :close-on-click-modal="false">
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
            <!--<div class="t-center">
                <label-item label="交接人：">
                    <el-input v-model="handover" autofocus placeholder="请输入交接人名字" class="width-sm inline"></el-input>
                </label-item>
            </div>-->
        </div>
        <div style="position: relative;margin:0 auto;overflow:hidden"
             id="page1"
             :style="{height:`${height}px`, width:`${width}px`,}">
            <div :style="{width: `${carrier_name.length > 3 ? '280px': 'auto'}`}"
                 style="max-height: 240px;overflow: hidden;text-align: center;font-weight:900;font-size:120px;line-height:1;word-break:break-all;margin: 0 auto;">
                {{carrier_name}}
            </div>
            <div style="text-align: center;">
                <barcode style="margin-top: 10px;" :value="printData.code"></barcode>
            </div>
            <div style="line-height: 30px;margin-left:5px;margin-bottom:10px;font-size: 20px;">
                {{shipping_name}}
            </div>
            <table style="border-collapse:collapse;width: 100%;font-size: 1rem;border:1px solid #d3dce6;position: absolute;bottom: 3px;">
                <tr>
                    <td width="20%"
                        style="text-align: center; border-bottom:1px solid #d3dce6; border-right:1px solid #d3dce6; height:33px;">
                        集包袋
                    </td>
                    <td width="30%"
                        style="text-align: center; border-bottom:1px solid #d3dce6; border-right:1px solid #d3dce6; height:33px;">
                        {{printData.collect_label}}
                    </td>
                    <td width="20%"
                        style="text-align: center; border-bottom:1px solid #d3dce6; border-right:1px solid #d3dce6; height:33px;">
                        包裹数
                    </td>
                    <td width="30%" style="text-align: center; border-bottom:1px solid #d3dce6;height:33px;">
                        {{printData.quantity}}
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center; border-bottom:1px solid #d3dce6; border-right:1px solid #d3dce6; height:33px;">
                        袋重(g)
                    </td>
                    <td style="text-align: center; border-bottom:1px solid #d3dce6; border-right:1px solid #d3dce6; height:33px; width:120px">
                        {{printData.collect_weight}}
                    </td>
                    <td style="text-align: center; border-bottom:1px solid #d3dce6; border-right:1px solid #d3dce6; height:33px; width:120px">
                        总重(g)
                    </td>
                    <td style="text-align: center; border-bottom:1px solid #d3dce6; height:33px; width:120px;">
                        {{Number(printData.collect_weight) + Number(printData.package_weight)}}
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center; border-bottom:1px solid #d3dce6; border-right:1px solid #d3dce6; height:33px; width:140px;">
                        集包人
                    </td>
                    <td style="text-align: center; border-bottom:1px solid #d3dce6; border-right:1px solid #d3dce6; height:33px; width:120px;">
                        {{printData.creator}}
                    </td>

                    <td style="text-align: center; border-bottom:1px solid #d3dce6; border-right:1px solid #d3dce6; height:33px; width:140px;">
                        集包时间
                    </td>
                    <td style="text-align: center; border-bottom:1px solid #d3dce6; height:33px; width:120px;">
                        {{printData.packing_time}}
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center; border-right:1px solid #d3dce6; height:33px; width:140px;">
                        交接人
                    </td>
                    <td style="text-align: center; border-right:1px solid #d3dce6;  height:33px; width:380px;">
                    </td>
                    <td style="text-align: center; border-right:1px solid #d3dce6; height:33px; width:140px;">
                        交接时间
                    </td>
                    <td style="text-align: center; height:33px; width:120px;">
                    </td>
                </tr>
            </table>
        </div>
        <div slot="footer">
            <el-button type="primary" size="mini" @click="query">确认完成</el-button>
            <el-button size="mini" @click="visible = false">关闭</el-button>
        </div>
    </print-dialog>
</template>
<style lang="stylus">
    .p-weighing-packages-print {
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
        .c-label-item label {
            font-size: 16px;
        }
        .t-center {
            text-align: center;
        }
        .inline {
            font-size: 1.2rem;
            display: inline-block;
            vertical-align: middle;
            &.el-input {
                width: auto;
            }
        }
        .width-sm {
            width: 120px;
        }
    }
</style>
<script>
    import {api_query_collection} from '@/api/weighing-packages'

    export default {
        data() {
            let dips = getDPI();
            let height = (parseFloat(150) * (dips.x / 25.4)).toFixed(4);
            let width = (parseFloat(100) * (dips.y / 25.4)).toFixed(4);
            return {
                height,
                width,
                visible: this.value,
                handover: '',
                carrier_name: '',
                shipping_name: '',
            }
        },
        filters: {
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
        },
        methods: {
            async query() {
                let id = this.printData.id;
                try {
                    let res = await this.$http(api_query_collection, id);
                    this.$message({type: "success", message: res.message || res});
                    this.$emit('finish', id);
                    this.$emit('add-history', {
                        id: id,
                        shipping_name: this.printData.shipping_name,
                        collect_weight: this.printData.collect_weight,
                        collect_label: this.printData.collect_label,
                        package_weight: this.printData.package_weight,
                        code: this.printData.code,
                        quantity: this.printData.quantity,
                        creator: this.printData.creator,
                        packing_time: datef("YYYY-MM-dd", new Date().getTime() / 1000)
                    });
                    this.prints();
                } catch (code) {
                    this.$message({type: "error", message: code.message || code});
                } finally {
                    this.visible = false;
                }
            },
            prints() {
                let params = {
                    type: 'html',
                    token: '',
                    content: this.$refs.printer.content,
                    numberList: Date.now(),
                    Width: 100,
                    Height: 150,
                };
                this.$printer(this.printer, params);
            },
            changePrinter(printer) {
                this.$emit('update:printer', printer);
            },
            open() {
                let shipping_name = this.printData.shipping_name.split('>>');
                this.carrier_name = shipping_name[0] || '';
                this.carrier_name = this.printData.collector_name || this.carrier_name;
                this.shipping_name = shipping_name[1] || '';
            }
        },
        computed: {
            packageTime() {
                return datef('YYYY-MM-dd HH:mm:ss', this.printData.packing_time);
            },
        },
        watch: {
            visible(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.visible = val;
            },
        },
        props: {
            value: {},
            printData: {},
            printer: {}
        },
        components: {
            printDialog: require('@/components/print-dialog.vue').default,
            selectPrinter: require('@/components/select-printer.vue').default,
            barcode: require('@/components/barcode').default,
            labelItem: require('@/components/label-item.vue').default,
        },
    }
</script>
