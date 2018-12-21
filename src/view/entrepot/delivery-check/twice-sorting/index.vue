<template>
    <page class="p-twice-sorting" id="n-content" style="padding: 5px">
        <el-row class="box-yellow">
            <el-col :span="this.clientWidth?4:5">
                <label-item label="拣货单号：" class="ml-sm inline">
                    <span class="font-span">{{picking_number}}</span></label-item>
            </el-col>
            <el-col :span="4">
                <label-item label="包裹类型：" class="inline"><span class="font-span">多品多件</span></label-item>
            </el-col>
            <el-col :span="4">
                <label-item label="包裹总数量：" class="inline"><span class="font-span">{{quantity}}</span></label-item>
            </el-col>
            <el-col :span="4">
                <label-item label="等待分拣包裹数量：" class="inline"><span class="font-span">{{wait_count}}</span></label-item>
            </el-col>
            <el-col :span="3"><span style="font-size: 16px;">操作员：</span><span class="font-span">{{user}}</span></el-col>
            <el-col :span="this.clientWidth?5:4">
                <el-button @click="finish" class="inline">分拣完成,结束作业</el-button>
                <el-button @click="exit" class="inline" v-if="!is_finish">退出,下次继续分拣</el-button>
            </el-col>
        </el-row>
        <el-row>
            <!--左侧-->
            <el-col :span="this.clientWidth?14:16">
                <!--左上-->
                <div>
                    <table class="sku-table mt-sm" cellpadding="0" cellspacing="0">
                        <tr>
                            <td :colspan="2">
                                <label-item label="扫描SKU：" class="fl ml-sm inline">
                                    <el-input ref="sku" @keyup.enter.native="scan" @focus="focus_input"
                                              v-model="sku"></el-input>
                                </label-item>
                            </td>
                            <td :rowspan="4" style="width:30%;">
                                <img v-lazy="skuData.thumb" :width="this.clientWidth?'240px':'300px'"
                                     :height="this.clientWidth?'240px':'300px'"></td>
                        </tr>
                        <template v-if="message">
                            <tr class="message_title">
                                <td :colspan="2">{{message}}</td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr>
                                <td :style="this.clientWidth?'width: 10%':'width: 30%'">SKU</td>
                                <td>
                                    <div class="inline">
                                        <span style="float: left;line-height: 25px;margin-right: 5px;font-size: 16px;">{{skuData.sku}}</span>
                                        <div v-if="skuData.sku_name" class="inline">
                                            <span class="inline" style="font-size: 16px;">[
                                            </span><span class="inline"
                                                         style="font-size: 16px;">{{skuData.sku_name}}</span>
                                            <span class="inline" style="font-size: 16px;">]</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>商品名称（规格）</td>
                                <td>{{skuData.goods_name}}</td>
                            </tr>
                            <tr class="twice-sorting-number">
                                <td>批量扫描数量</td>
                                <td>
                                    <integer-input v-model="scansNumber"
                                                   class="s-width-large twice-sorting-scan-number"
                                                   @keyup.enter.native="batch_scan"
                                                   :min="0"
                                                   :disabled="limitNumber < this.single_manual_value || isScan"></integer-input>
                                </td>
                            </tr>
                            <tr class="twice-sorting-number">
                                <td>可扫描数量</td>
                                <td>
                                    {{limitNumber}}
                                </td>
                            </tr>
                            <tr :style="this.clientWidth?'height: 130px;':'height: 180px;','font-size: 16px;'">
                                <td>提示</td>
                                <td><span style="font-size: 30px;"><span
                                        style="font-size: 125px;line-height: 1; color: red;"> {{skuData.basket_id}} </span>号周转篮</span>
                                </td>
                            </tr>
                        </template>
                    </table>
                </div>
                <!--左下-->
                <div class="box mt-sm" v-resize="{height:25}">
                    <p class="box-title t-left" style="padding-left:10px">播种车（播种车名称）
                        <permission
                                tag="ElButton"
                                :route="apis.url_reset_twice_soring"
                                class="ml-sm"
                                size="mini"
                                @click="reset_twice_soring">将播种车重置为未开始分拣
                        </permission>
                    </p>
                    <div>
                        <el-row class="box-picking scroll-test">
                            <table class="ui-table-head inline mr-sm" v-for="(data,num) in pickingDatas" :key="num">
                                <tr v-for="(row,index) in data.row" :key="index">
                                    <td v-for="(col,index) in data.col"
                                        :key="index"
                                        @click="look_basket(data.picking,num+1,row,col)"
                                        :class="['row_box',`${num+1}${row}${col}` === `${skuData.basket_id}` ? 'row_green' : 'row_color']">
                                        <span style="color:#fff;">{{num+1}}{{row}}{{col}}</span>
                                        <div v-for="(pick,item) in data.picking" :key="pick.basket"
                                             v-if="`${num+1}${row}${col}` === `${pick.basket}`">
                                            <i class="ladder-type fl" v-if="pick.status===1"></i>
                                            <i class="ladder-type-blue fl" v-else-if="pick.status===2"></i>
                                            <span class="fr span-num num"
                                                  v-if="pick.sum">{{pick.ed}}/{{pick.sum}}</span>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </el-row>
                        <div style="font-size: 1.2rem;line-height: 30px;">
                            <i class="color_tip row_color inline" style="background-color: #C8C8C8"></i>
                            <p class="inline ml-xs">播种车中的周转篮</p>
                            <i class="color_tip row_green inline ml-sm" style="background-color: #00FF00;"></i>
                            <p class="inline ml-xs">当前扫描SKU需要存放的周转篮</p>
                            <i class="ladder-type inline ml-sm"></i>
                            <p class="inline ml-xs">当前周转篮中存在商品，未满</p>
                            <i class="ladder-type-blue inline ml-sm"></i>
                            <p class="inline ml-xs">当前周转篮存在商品，已满</p>
                        </div>
                    </div>
                </div>
            </el-col>
            <!--右侧-->
            <el-col :span="this.clientWidth?10:8">
                <el-tabs v-model="activeName" class="ml-sm">
                    <el-tab-pane label="周转篮列表" name="1">
                        <div v-if="activeName==='1'">
                            <p class="t-left" style="padding-left:10px">
                                <permission tag="ElButton"
                                            :route="apis.url_delivery_check_batch_print_basket"
                                            v-if="isShowPrintAll"
                                            type="primary"
                                            size="mini"
                                            class="ml-sm"
                                            :disabled="printDisabled"
                                            @click="more_print">打印全部地址标签
                                </permission>
                                <span class="inline fr" style="line-height: 30px;">
                                <span style="font-size: 1.2rem;margin-left: 10px;">状态：</span>
                                <el-select v-model="status" class="inline width-xs fr" style="margin:3px;">
                                    <el-option v-for="item in statusList"
                                               :key="item.value"
                                               :value="item.value"
                                               :label="item.label"></el-option>
                                </el-select>
                            </span>
                                <span class="inline fr" style="line-height: 30px;">
                                <span style="font-size: 1.2rem;">打印机：</span>
                                <select-printer v-model="printer" class="inline width-lg fr"
                                                style="margin:3px;"></select-printer>
                            </span>
                            </p>
                            <el-table :data="tableStatusData" v-resize="{height:25}">
                                <el-table-column label="周转篮号" inline-template min-width="50">
                                    <div>
                                        <i style="color:green;" v-if="row.package_now" class="el-icon-caret-right"></i>
                                        <permission
                                                tag="span"
                                                :route="apis.url_basket_info"
                                                class="operate"
                                                @click="get_basket(row.basket)"
                                                v-if="row.basket">{{row.basket}}
                                        </permission>
                                    </div>
                                </el-table-column>
                                <el-table-column label="分拣数/所需数" min-width="50" inline-template>
                                    <span>{{row.ed}}/{{row.sum}}</span>
                                </el-table-column>
                                <el-table-column label="包裹号" prop="package_number"></el-table-column>
                                <el-table-column label="跟踪号" prop="shipping_number"></el-table-column>
                                <el-table-column label="物流商单号" prop="process_code"></el-table-column>
                                <el-table-column label="状态" inline-template min-width="50">
                                    <span>{{row.status | statusFilter(row.status)}}</span>
                                </el-table-column>
                                <el-table-column label="打印时间" inline-template min-width="70">
                                    <span v-if="row.print_time">{{row.print_time | filterTime}}</span>
                                </el-table-column>
                                <el-table-column label="操作" inline-template min-width="50">
                                    <span class="disabled" v-if="row.status===0||row.status===1">打印</span>
                                    <permission tag="span"
                                                :route="apis.url_delivery_check_print"
                                                class="operate"
                                                @click="do_stamp(row)"
                                                v-else>打印
                                    </permission>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="当前操作日志" name="2">
                        <div class="box">
                            <div style="overflow-y: auto;" v-resize="{height:25}">
                                <div v-for="(row,index) in logData" :key="index">
                                    <span class="ml-sm">{{row.log}}</span>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>

            </el-col>
        </el-row>
        <el-dialog :title="`查看周转蓝：${basketData.basket}信息`" :visible.sync="basketShow" :close-on-click-modal="false">
            <el-row class="mb-md">
                <el-col :span="3">
                    <label-item label="周转篮：" class="inline"><span>{{basketData.basket}}</span></label-item>
                </el-col>
                <el-col :span="6">
                    <label-item label="包裹号：" class="inline"><span>{{basketData.package_number}}</span></label-item>
                </el-col>
                <el-col :span="6">
                    <label-item label="跟踪号：" class="inline"><span>{{basketData.shipping_number}}</span></label-item>
                </el-col>
                <el-col :span="6">
                    <label-item label="物流商单号：" class="inline"><span>{{basketData.process_code}}</span></label-item>
                </el-col>
                <el-col :span="3">
                    <label-item label="状态：" class="inline">
                        <span>{{basketData.status | statusFilter(basketData.status)}}</span></label-item>
                </el-col>
            </el-row>
            <el-table :data="basketData.sku_list" style="height:325px;overflow-y:auto;overflow-x:hidden;">
                <el-table-column label="SKU" inline-template>
                    <span><ui-tip :content="row.sku" :width="98"></ui-tip></span>
                </el-table-column>
                <el-table-column label="商品名称（规格）" inline-template>
                       <span>
                           <ui-tip :content="row.goods_name" :width="98"></ui-tip>
                       </span>
                </el-table-column>
                <el-table-column label="数量(周转篮/包)" inline-template>
                    <span>{{row.ed}}/{{row.sum}}</span>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="basketShow = false">关闭</el-button>
                <el-button type="primary" size="mini" @click="clear_basket">将周转篮重置为未开始分拣</el-button>
            </div>
        </el-dialog>
        <el-dialog title="分拣完成，结束作业" :visible.sync="resultShow" :close-on-click-modal="false">
            <span>{{checkMessage}}</span>
            <el-table :data="tableData" style="height: 325px;">
                <el-table-column label="包裹号" prop="package_number"></el-table-column>
                <el-table-column label="周转篮号" inline-template>
                    <span>{{row.basket}}</span>
                </el-table-column>
                <el-table-column label="SKU（周转数量/包裹数量）" min-width="120" inline-template>
                    <span v-for="(item,index) in row.sku_list" :key="index" class="inline">{{item.sku}}({{item.ed}}/{{item.sum}})</span>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                    <el-button size="mini" @click="exit_print">打印全部地址标签</el-button>
                    <el-button size="mini" @click="stop_picking">已确认完成打印，退出作业</el-button>
                    <el-button size="mini" type="primary" @click="resultShow = false">关闭继续分拣</el-button>
                </span>
        </el-dialog>
        <batch-preview v-model="printVisible"
                       :batch-data="batchData"
                       :column-height="columnHeight"
                       :is-batch="isBatch"
                       @query="exit_query"
                       ref="preview">
        </batch-preview>
    </page>
</template>
<style lang="stylus">
    .p-twice-sorting {

        .twice-sorting-scan-number {
            margin: 0 auto;
        }
        .el-table__body-wrapper {
            overflow-x: hidden;
        }

        .message {
            margin-left: 20px;
            font-size: 20px;
        }

        .scroll-test {
            max-height: 200px;
            overflow-y: auto;
            overflow-x: hidden;
        }

        .box-yellow {
            height: 60px;
            background-color: #FF9F40;
            color: #fff;
            line-height: 60px;
            font-size: 20px;
            label {
                font-size: 20px;
            }
            .font-span {
                font-size: 20px;
            }
        }

        .box {
            overflow-y: auto;
            overflow-x: hidden;
            border: 1px solid #D3DCE6;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
            .box-title {
                border: 1px solid #D3DCE6;
                text-align: center;
                margin: 0;
                background-color: #6495ed;
                font-size: 1.2rem;
                line-height: 32px;
                height: 32px;
                color: #ffffff;
            }
            .ui-table-head {
                .row_color {
                    background-color: #C8C8C8;
                }
                .row_green {
                    background-color: #00FF00;
                    .num {
                        font-size: 20px;
                        font-weight: 200;
                    }
                }
                span {
                    position: absolute;
                    top: 2px;
                    left: 3px;
                    font-size: 39px;
                }
                .span-num {
                    position: absolute;
                    bottom: 2px;
                    right: 0;
                    top: 50px;
                    left: 36px;
                    font-size: 16px;
                }
                i {
                    position: absolute;
                    left: 0;
                    bottom: 2px;
                }
            }

            @media screen and (max-width: 1366px) {
                .box-yellow {
                    height: 50px;
                    line-height: 50px;
                }

                .ui-table-head {
                    .row_color {
                        background-color: #C8C8C8;
                    }
                    .row_green {
                        background-color: #00FF00;
                        .num {
                            font-size: 14px;
                            font-weight: 200;
                        }
                    }
                    span {
                        position: absolute;
                        top: 2px;
                        left: 0;
                        font-size: 25px;
                    }
                    .span-num {
                        position: absolute;
                        bottom: 2px;
                        right: 0;
                        top: 36px;
                        left: 25px;
                        font-size: 14px;
                    }
                    i {
                        position: absolute;
                        left: 0;
                        bottom: 2px;
                    }
                }
            }

            button {
                span {
                    font-size: 1.2rem;
                }
            }
            .ladder-type:before {
                border-color: transparent transparent red;
                border-style: none solid solid;
                border-width: 0 10px 20px 0;
                content: "";
                display: block;
                height: 0;
                left: -10px;
                width: 20px;
                margin-top: 0;
            }
            .ladder-type-blue:before {
                border-color: transparent transparent #1240AB;
                border-style: none solid solid;
                border-width: 0 10px 20px 0;
                content: "";
                display: block;
                height: 0;
                left: -10px;
                width: 20px;
                margin-top: 0;
            }
            @media screen and (max-width: 1366px) {
                .ladder-type:before {
                    border-color: transparent transparent red;
                    border-style: none solid solid;
                    border-width: 0 10px 15px 0;
                    content: "";
                    display: block;
                    height: 0;
                    left: -10px;
                    width: 15px;
                    margin-top: 0;
                }

                .ladder-type-blue:before {
                    border-color: transparent transparent #1240AB;
                    border-style: none solid solid;
                    border-width: 0 10px 15px 0;
                    content: "";
                    display: block;
                    height: 0;
                    left: -10px;
                    width: 15px;
                    margin-top: 0;
                }
            }
            .box-picking {
                max-height: 386px;
                // overflow: auto
                display: flex;
                align-items: top;
                justify-content: flex-start;
                .row_box {
                    width: 75px;
                    height: 70px;
                    text-align: center;
                    cursor: pointer;
                    position: relative;
                }
                @media screen and (max-width: 1366px) {
                    .row_box {
                        width: 60px;
                        height: 50px;
                        text-align: center;
                        cursor: pointer;
                        position: relative;
                    }
                }
            }
        }

        .sku-table {
            width: 100%;
            text-align center;
            border-color: #6495ed;
            th {
                padding: 0 5px;
                height: 26px;
                text-align: center;
                box-sizing: border-box;
                background-color: #eff2f7;
                border: 1px solid #e0e6ed;
            }
            tr {
                height: 60px;
                font-size: 16px;
            }
            tr.twice-sorting-number {
                height: 30px;
            }
            .message_title {
                height: 301px;
                font-size: 30px;
                color: red;
            }
            @media screen and (max-width: 1366px) {
                tr {
                    height: 18px;
                    font-size: 16px;
                }

                .message_title {
                    height: 160px;
                    font-size: 30px;
                    color: red;
                }
            }
            td {
                padding: 0 5px;
                height: 26px;
                text-align: center;
                box-sizing: border-box;
                border: 1px solid #e0e6ed;
            }

        }

        .color_tip {
            width: 30px;
            height: 20px;
            display inline-block;
        }

        .basket-table {
            width: 100%;
            text-align center;
            border-color: #6495ed;
            tr {
                height: 26px;
                line-height: 26px;
            }
            th {
                background-color: #e0e6ed;
            }
            th, td {
                width: 155px;
                padding: 0 5px;
                height: 26px;
                text-align: center;
                box-sizing: border-box;
                border: 1px solid #e0e6ed;
            }
        }

        .el-dialog__header {
            padding-bottom: 10px;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
        }

        .el-dialog__title {
            line-height: 1;
            font-size: 14px;
            font-weight: 500;
            color: #1f2d3d;
        }

        .el-dialog__body {
            padding: 15px 20px;
        }

        .el-message-box {
            width: 500px;
        }

    }
</style>
<script>
    import {
        api_single_box,
        api_single_sku,
        api_reset_basket,
        api_twice_sorting,
        api_picking_id,
        api_basket_info,
        api_basket_list,
        api_reset_twice_soring,
        api_delivery_check_stop_picking,
        api_delivery_check_print,
        api_delivery_check_prints,
        api_audit_turnover_box,
        api_delivery_check_batch_print_basket,
        api_print_basket_label,
        api_picking_label_info,
        url_delivery_check_print,
        url_delivery_check_batch_print_basket,
        url_basket_info,
        url_reset_twice_soring,
        url_print_basket_label,
    } from '@/api/delivery-check';
    import {mapGetters, mapActions} from 'vuex';

    export default {
        page: {
            devinfo: {
                frontEnd: '黎宏珍',
                backEnd: '詹熏欣',
                createTime: '2017-11-21',
                updateTime: '2017-12-13'
            },
        },
        permission: {
            url_delivery_check_print,
            url_delivery_check_batch_print_basket,
            url_basket_info,
            url_reset_twice_soring
        },
        data() {
            return {
                sku: '',
                message: '请扫描拣货单中的SKU',
                basketShow: false,
                resultShow: false,
                is_finish: false,
                isBatch: true,
                printDisabled: false,
                user: '',
                checkMessage: '',
                picking_id: 0,
                picking_number: '',
                quantity: '',
                guide: {},
                wait_count: '',
                status: '',
                tableData: [],
                skuData: {},
                statusList: [
                    {label: "全部", value: ''},
                    {label: "空置", value: 0},
                    {label: "未满", value: 1},
                    {label: "已满", value: 2},
                    {label: "已打印", value: 3},
                ],
                pickingData: [],
                pickingDatas: [],
                basketData: [],
                basketSortData: [],
                printer: '',
                token: '',
                activeName: '1',
                logData: [],
                action: 'http://localhost:10093/print',
                printVisible: false,
                batchData: [],
                columnHeight: 100,
                exit_query: new Function(),
                single_manual_value: '',
                scansNumber: 0,
                isScan: false,
            }
        },
        mounted() {
            if (this.$route.query && !isEmpty(this.$route.query)) {
                let data = {
                    picking_number: this.$route.query.picking_number,
                    sorting_shelf_id: this.$route.query.sorting_shelf_id,
                };
                this.$http(api_audit_turnover_box, data).then(res => {
                    this.picking_id = res.data.picking_id;
                    this.picking_number = res.data.picking_number;
                    this.quantity = res.data.quantity;
                    this.wait_count = res.data.wait_count;
                    this.single_manual_value = res.data.single_manual_value;
                    this.user = res.data.packager;
                    this.is_finish = this.wait_count === 0 ? 1 : 0;
                    this.get_picking_id();
                    this.get_basket_list();
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });

            }
            this.$nextTick(() => {
                this.$refs.sku.$refs.input.select();
            });
        },
        methods: {
            ...mapActions({
                set_printerList: 'api/set_printerList',
                push_wait_sorting: 'twice-sorting/push_wait_sorting'
            }),
            focus_input() {
                this.$refs.sku.$refs.input.select();
            },
            batch_scan() {
                this.scansNumber = Number(this.scansNumber);
                if (isNaN(this.scansNumber) || this.scansNumber === 0 || this.scansNumber > this.limitNumber) {
                    this.$message({
                        type: 'error',
                        message: '请输入正确的数量'
                    });
                    return;
                } else {
                    this.isScan = true;
                    this.sku = this.skuData.sku;
                    let params = {
                        picking_id: this.picking_id,
                        sku: this.sku,
                        qty: this.scansNumber || 1,
                    };
                    this.submit(params);
                }

            },
            scan() {
                if (this.sku.trim() === '') {
                    this.message = '请输入SKU';
                    this.sku = this.sku.trim();
                    return;
                }
                this.sku = this.sku.trim();
                let params = {
                    picking_id: this.picking_id,
                    sku: this.sku,
                    qty: 1,
                };
                this.submit(params);
            },
            submit(params) {
                this.$http(api_twice_sorting, params).then(res => {
                    this.isScan = false;
                    this.scansNumber = 0;
                    res.voice && this.audio_play(res.voice, 4);
                    this.skuData = res;
                    let sku_name = this.skuData.show_alias.join('，');
                    this.$set(this.skuData, 'sku_name', sku_name);
                    this.message = '';
                    this.status = '';
                    let now_data = '';
                    let now = '';
                    this.tableData.forEach((row, index) => {
                        if (row.package_id === this.skuData.package_id) {
                            row.basket = this.skuData.basket_id;
                            row.ed = row.ed + params.qty;
                            row.package_now = true;
                            row.status = row.ed === row.sum ? 2 : 1;
                            now_data = window.clone(row);
                            now = index + 1;
                            if (row.ed === 1) {
                                let basket_index = this.tableData.findIndex(item => {
                                    return item.basket === 0 || item.basket === '';
                                });
                                this.tableData.splice(basket_index, 0, now_data);
                                this.tableData.splice(now, 1);
                            }
                            let log = `扫描SKU${this.sku}, 匹配包裹${this.skuData.package_id}`;
                            this.logData.unshift({log: log});
                            this.sku = '';
                        } else {
                            row.package_now = false;
                        }
                    });
                    this.data_picking();
                    if (this.skuData.is_finish) {
                        this.is_finish = this.skuData.is_finish;
                    }
                    if (this.skuData.basket_status === 2) {
                        this.wait_count = Number(this.wait_count) - 1;
                        let log = `扫描SKU${this.sku}, 匹配包裹${this.skuData.package_id},周转篮${this.skuData.basket_id}已满`;
                        this.logData.unshift({log: log});
                    }
                    this.$refs.sku.$refs.input.select();
                }).catch(code => {
                    code.voice && this.audio_play(code.voice);
                    this.skuData = {};
                    this.scansNumber = 0;
                    this.message = '请扫描拣货单中的SKU';
                    if (code.message === 'Undefined index: status') {
                        this.message = `SKU不在该拣货单中或者已满足条件`;
                    } else if (code.message === 'Undefined index: sku') {
                        this.message = `SKU不在该拣货单中或者已满足条件`;
                    } else {
                        this.message = code.message;
                    }
                    let log = `扫描SKU${this.sku}, ${this.sku}不在该拣货单中或者已满足条件`;
                    this.logData.unshift({log: log});
                    this.$refs.sku.$refs.input.select();
                });
            },
            data_picking() {
                this.pickingDatas.forEach(item => {
                    item.picking.forEach(parm => {
                        let find = this.tableData.find(row => {
                            return `${parm.basket}` === `${row.basket}`;
                        });
                        if (!!find) {
                            this.$set(parm, 'ed', find.ed);
                            this.$set(parm, 'sum', find.sum);
                            if (find.ed < find.sum) {
                                parm.status = 1;
                            }
                            if (find.ed === find.sum) {
                                parm.status = 2;
                            }
                        }
                    });
                });
            },
            audio_play(voice, speed) {// 播报语音
                this.$audio(voice, this.audioToken, speed);
            },
            /*do_stamp(id) {
                this.$http(api_delivery_check_print, id, {type: 6}).then(res => {
                    this.label_print(res);
                    /!*let direction = res.direction || 1;
                    let data = {
                        Type: '',
                        Coordinate: '',
                        Token: this.token,
                        Url: '',
                        Width: 100,
                        Height: 100,
                        PrintName: this.printer,
                        NumberList: '',
                        content: '',
                        Watermark: '',
                        Direction: direction === 1 ? 'vertical' : 'transverse'
                    };
                    res.file_list.forEach(row => {
                        data.content = row.file;
                        data.Type = row.type;
                        data.Coordinate = row.coordinate ? row.coordinate : '##';
                        data.Watermark = row.label_num ? row.label_num : '##';
                    });
                    data.Width = res.width;
                    data.Height = res.height;
                    data.NumberList = res.identification;
                    data.Url = config.apiHost + res.callback;
                    let flag = this.$printer(this.printer, data);
                    if (!!flag) {
                        flag.then(res => {
                            if (res) {
                                this.tableData.forEach(row => {
                                    if (row.package_id === id) {
                                        let create_time = Date.parse(new Date);
                                        create_time = create_time / 1000;
                                        row.print_time = create_time;
                                        row.status = 3;
                                        let log = `包裹${row.package_number}已打印`;
                                        this.logData.unshift({log: log});
                                    }
                                });
                            }
                        });
                    }*!/
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },*/
            do_stamp(row) {
                this.isBatch = false;
                let params = {
                    picking_id: this.picking_id,
                    basket_number: [row.basket],
                    type: 6
                };
                this.$http(api_print_basket_label, params).then(res => {
                    this.label_print(res);
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            /*more_print() {
                let basket_number = [];
                this.tableData.forEach(res => {
                    if (res.status === 2 || res.status === 3) {
                        if (res.basket) {
                            basket_number.push(res.basket);
                        }
                    }
                });
                let params = {
                    picking_id: this.picking_id,
                    basket_number: basket_number,
                    type: 6
                };
                let numberList = [];
                let textarea = [];
                let type = [];
                let direction = [];
                let coordinate = [];
                let label_num = [];
                this.printDisabled = true;
                this.$http(api_delivery_check_batch_print_basket, params).then(res => {
                    this.printDisabled = false;
                    res.file_list.forEach(row => {
                        textarea.push(row.file);
                        type.push(row.type);
                        row.coordinate ? coordinate.push(row.coordinate) : coordinate.push('##');
                        row.label_num ? label_num.push(row.label_num) : label_num.push('##');
                        let directionSingle = (row.direction ? row.direction : 1) === 1 ? 'vertical' : 'transverse';
                        direction.push(directionSingle);
                    });
                    numberList = res.identification;
                    numberList = numberList.replace(/\,/g, '_a_b_c_d_');
                    textarea = textarea.join('_a_b_c_d_');
                    type = type.join('_a_b_c_d_');
                    coordinate = coordinate.join('_a_b_c_d_');
                    label_num = label_num.join('_a_b_c_d_');
                    direction = direction.join('_a_b_c_d_');
                    let url = config.apiHost + res.callback;
                    let params = {
                        Type: type,
                        Coordinate: coordinate,
                        Token: this.token,
                        Url: url,
                        Width: 100,
                        Height: 100,
                        PrintName: this.printer,
                        NumberList: numberList,
                        content: textarea,
                        Direction: direction
                    };
                    params.Width = res.width;
                    params.Height = res.height;
                    let flag = this.$printerOverlap(this.printer, params);
                    if (!!flag) {
                        flag.then(res => {
                            if (res) {
                                this.tableData.forEach(row => {
                                    data.forEach(item => {
                                        if (`${row.basket}` === `${item}`) {
                                            let create_time = Date.parse(new Date);
                                            create_time = create_time / 1000;
                                            row.print_time = create_time;
                                            row.status = 3;
                                            let log = `包裹${row.package_number}已打印`;
                                            this.logData.unshift({log: log});
                                        }
                                    })
                                });
                            }
                        });
                    }
                    this.$refs.sku.$refs.input.select();
                }).catch(code => {
                    this.printDisabled = false;
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },*/
            more_print() {
                this.isBatch = true;
                let basket_number = [];
                this.tableData.forEach(res => {
                    if (res.status === 2 || res.status === 3) {
                        if (res.basket) {
                            basket_number.push(res.basket);
                        }
                    }
                });
                let params = {
                    picking_id: this.picking_id,
                    basket_number: basket_number,
                    type: 6
                };
                this.printDisabled = true;
                this.$http(api_print_basket_label, params).then(res => {
                    this.printDisabled = false;
                    this.label_print(res);
                    // this.$refs.sku.$refs.input.select();
                }).catch(code => {
                    this.printDisabled = false;
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            label_print(res) {
                this.batchData = res;
                /*this.batchData.print_data.forEach(row => {
                    this.$set(row, 'print_num', 1);
                });*/

                if (this.isBatch) {
                    this.$http(api_picking_label_info, {picking_id: this.picking_id}).then(res => {
                        this.guide = Object.assign(res, {temp_type: 'guide'});
                        this.batchData.print_data.unshift(this.guide);
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code,
                        })
                    });
                }
                this.printVisible = true;
                this.$refs.preview.get_template(6);
                /*if (this.batchData.default_temp_id) {
                    this.$nextTick(() => {
                        this.$refs.preview.change_print();
                    })
                }*/
            },
            get_basket_list() {
                this.tableData = [];
                if (this.picking_id) {
                    this.$http(api_basket_list, this.picking_id).then(res => {
                        this.tableData = res;
                        this.tableData.forEach(row => {
                            this.$set(row, 'package_now', false);
                        });
                        this.data_picking();
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    });
                }
            },
            get_picking_id() {
                this.pickingDatas = [];
                if (this.picking_id) {
                    this.$http(api_picking_id, this.picking_id).then(res => {
                        this.basketSortData = res.data.map(item => {
                            return item.basket;
                        });
                        this.pickingData = res.data;
                        this.pickingData = this.pickingData.map(param => {
                            let string = `${param.basket}`;
                            let index = string.substr(0, 1);
                            let row = string.substr(1, 1);
                            let column = string.substr(2, 1);
                            return {
                                index: index,
                                row: row,
                                column: column,
                                status: param.status,
                                basket: param.basket,
                            }
                        });
                        let header = res.header;
                        Object.keys(header).forEach((key, index) => {
                            let row = [];
                            let col = [];
                            let picking = [];
                            for (let i = 1; i <= header[key].row; i++) {
                                row.push(i);
                            }
                            for (let j = 1; j <= header[key].tol; j++) {
                                col.push(j);
                            }
                            this.pickingData.forEach(row => {
                                if (`${row.index}` === `${index}`) {
                                    picking.push(row);
                                }
                            });
                            if (row.length !== 0 && col.length !== 0) {
                                this.pickingDatas.push({row: row, col: col, picking: picking});
                            }
                        });
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    });
                }
            },
            look_basket(picking, num, row, col) {
                let basket = `${num}${row}${col}`;
                this.get_basket(basket);
            },
            get_basket(basket) {
                let data = {
                    basket: basket,
                    picking_id: this.picking_id
                };
                this.$http(api_basket_info, data).then(res => {
                    this.basketData = res;
                    this.basketShow = true;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            clear_basket() {
                let data = {
                    basket: this.basketData.basket,
                    picking_id: this.picking_id,
                };
                this.$confirm(`您将周转篮重置为未开始分拣，确定进行此操作？`, "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_reset_basket, data).then(res => {
                        this.basketShow = false;
                        this.data_picking();
                        this.pickingDatas.forEach(item => {
                            item.picking.forEach(row => {
                                if (`${row.basket}` === `${this.basketData.basket}`) {
                                    row.status = 0;
                                    row.sum = 0;
                                    row.ed = 0;
                                }
                            });
                        });
                        let now_data = '';
                        let now = '';
                        this.tableData.forEach((row, index) => {
                            if (`${row.basket }` === `${this.basketData.basket}`) {
                                row.basket = '';
                                row.ed = 0;
                                row.status = 0;
                                row.package_now = false;
                                let log = `周转篮${this.basketData.basket}重置为未开始分拣`;
                                this.logData.unshift({log: log});
                                now_data = window.clone(row);
                                now = index;
                            }
                        });
                        this.tableData.splice(now, 1);
                        this.tableData.push(now_data);
                        if (this.basketData.status === 2 || this.basketData.status === 3) {
                            this.wait_count = Number(this.wait_count) + 1;
                        }
                        this.sku = '';
                        this.skuData = {};
                        this.scansNumber = 0;
                        this.message = '请扫描拣货单中的SKU';
                        this.$refs.sku.$refs.input.select();
                        this.$message({type: 'success', message: res.message || res});
                        this.is_finish = false;
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    });
                }).catch(() => {
                    this.$refs.sku.$refs.input.select();
                    this.$message({
                        type: "info",
                        message: "已取消操作"
                    });
                });
            },
            reset_twice_soring() {
                this.$confirm(`您将播种车重置为未开始分拣，确定进行此操作？`, "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_reset_twice_soring, this.picking_id).then(res => {
                        this.get_picking_id();
                        this.get_basket_list();
                        this.wait_count = this.quantity;
                        this.skuData = {};
                        this.scansNumber = 0;
                        this.message = '请扫描拣货单中的SKU';
                        this.sku = '';
                        this.$refs.sku.$refs.input.select();
                        let log = `播种车重置为未开始分拣`;
                        this.logData.unshift({log: log});
                        this.$message({type: 'success', message: res.message || res});
                        this.is_finish = false;
                    }).catch(code => {
                        this.$refs.sku.$refs.input.select();
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    });
                }).catch(() => {
                    this.$refs.sku.$refs.input.select();
                    this.$message({
                        type: "info",
                        message: "已取消操作"
                    });
                });
            },
            finish() {
                let checkdata = this.tableData.filter(res => res.status === 1);
                let check = checkdata.length;
                let sure = this.tableData.length - check;
                let stampdata = this.tableData.filter(res => res.print_time);
                let stamp = this.tableData.length - stampdata.length;
                if (check) {
                    this.checkMessage = `本次分拣有${this.wait_count}个包裹未完成，其中${check}个包裹有部分商品已分拣到周转箱中。`
                    this.resultShow = true;
                    return;
                } else if (this.wait_count) {
                    this.checkMessage = `本次分拣有${this.wait_count}个包裹未完成`;
                    this.resultShow = true;
                    return;
                }
                if (stamp) {
                    this.$confirm(`分拣完成，有未打印的地址标签`, "分拣完成", {
                        confirmButtonText: '退出',
                        cancelButtonText: '关闭窗口人工打印',
                        type: 'warning'
                    }).then(() => {
                        this.$http(api_delivery_check_stop_picking, this.picking_id).then(res => {
                            this.$message({type: 'success', message: res.message || res});
                            this.$router.push({
                                path: "/delivery-check/check-turnover-box",
                            });
                        }).catch(code => {
                            this.$message({
                                type: 'error',
                                message: code.message || code
                            });
                        });
                    }).catch(() => {
                        this.$refs.sku.$refs.input.select();
                    });
                }
                if (!stamp) {
                    this.$confirm(`地址标签打印完成，请确认！`, "退出,下次继续分拣", {
                        confirmButtonText: '已确认完成打印，退出作业',
                        cancelButtonText: '未完成打印，关闭窗口人工打印',
                        type: 'warning'
                    }).then(() => {
                        this.$http(api_delivery_check_stop_picking, this.picking_id).then(res => {
                            this.$message({type: 'success', message: res.message || res});
                            this.$router.push({
                                path: "/delivery-check/check-turnover-box",
                            });
                        }).catch(code => {
                            this.$message({
                                type: 'error',
                                message: code.message || code
                            });
                        })
                    }).catch(() => {
                        this.$refs.sku.$refs.input.select();
                    });
                }
            },
            exit() {
                if (!this.is_finish) {
                    this.$confirm(`您的拣货单${this.picking_number}还未分拣完成，确认要退出作业！`, "退出,下次继续分拣", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$router.push({
                            path: "/delivery-check/check-turnover-box",
                        });
                    }).catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消操作"
                        });
                        this.$refs.sku.$refs.input.select();
                    });
                } else {
                    this.$router.push({
                        path: "/delivery-check/check-turnover-box",
                    });
                }
            },
            exit_print() {
                this.exit_query = () => {
                    this.printVisible = false;
                    this.$confirm(`地址标签打印完成，请确认！`, "地址标签打印完成", {
                        confirmButtonText: '已确认完成打印，退出作业',
                        cancelButtonText: '未完成打印，关闭窗口人工打印',
                        type: 'warning'
                    }).then(() => {
                        this.stop_picking();
                        this.exit_query = new Function();
                    }).catch(() => {
                        this.exit_query = new Function();
                        this.$refs.sku.$refs.input.select();
                    });
                };
                this.more_print();
            },
            stop_picking() {
                this.$http(api_delivery_check_stop_picking, this.picking_id).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.resultShow = false;
                    this.$router.push({
                        path: "/delivery-check/check-turnover-box",
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
        },
        filters: {
            statusFilter(val) {
                switch (val) {
                    case 0:
                        return `空置`;
                    case 1:
                        return `未满`;
                    case 2:
                        return `已满`;
                    case 3:
                        return `已打印`;
                }
            },
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
        },
        watch: {
            user(val) {
                if (!val) {
                    this.$router.replace("/delivery-check/check-turnover-box");
                }
            }
        },
        computed: {
            ...mapGetters({unfinish_list: 'twice-sorting/unfinish_list', audioToken: 'audio/token'}),
            isShowPrintAll() {
                return !!this.tableData.find(item => {
                    return item.status === 2 || item.status === 3;
                });
            },
            tableStatusData() {
                let sort_data = [];
                let data = window.clone(this.tableData);
                this.basketSortData.forEach(row => {
                    data.forEach((item, index) => {
                        if (`${item.basket}` === `${row}`) {
                            sort_data.push(item);
                            data.splice(index, 1);
                        }
                    });
                });
                this.tableData = [...sort_data, ...data];
                switch (this.status) {
                    case '':
                        return this.tableData;
                        break;
                    case 0:
                        return this.tableData.filter(res => res.status === 0);
                        break;
                    case 1:
                        return this.tableData.filter(res => res.status === 1);
                        break;
                    case 2:
                        return this.tableData.filter(res => res.status === 2);
                        break;
                    case 3:
                        return this.tableData.filter(res => res.status === 3);
                        break;
                }
            },
            clientWidth() {
                if (document.body.clientWidth <= 1366) {
                    return true;
                } else {
                    return false;
                }
            },
            limitNumber() {
                return this.skuData.basket_sum - this.skuData.basket_check;
            }
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
            selectPrinter: require('@/components/select-printer.vue').default,
            batchPreview: require('./batch-preview.vue').default
        }
    }
</script>
