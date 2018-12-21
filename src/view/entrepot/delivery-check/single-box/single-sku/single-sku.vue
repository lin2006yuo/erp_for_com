<template>
    <page class="p-single-sku">
        <el-row class="box-yellow">
            <label-item label="拣货单：" class="ml-sm inline"><span
                    class="font-span text-ellipsis">{{picking_number}}{{turnover_box_id ? `[${turnover_box_id}]` : ''}}</span>
            </label-item>
            <label-item label="包裹类型：" class="inline"><span class="font-span text-ellipsis">{{type_filter(type)}}</span>
            </label-item>
            <label-item label="当前渠道：" class="inline"><span class="font-span text-ellipsis">{{shipping_name}}</span>
            </label-item>
            <label-item class="inline"><span class="font-span text-ellipsis">{{label_width}}</span>
            </label-item>
            <label-item label="待复核数量：" class="inline"><span class="font-span text-ellipsis">{{wait_count}}</span>
            </label-item>
            <label-item label="操作员：" class="inline">
                <span class="font-span text-ellipsis">{{user}}</span>
            </label-item>
            <div class="ml-sm t-center inline">
                <el-button @click="release_box" v-if="turnover_box_id.length>0" class="inline">释放周转箱</el-button>
                <el-button @click="release_picking" v-if="isPicking" class="inline">拣货单包装完成</el-button>
            </div>
            <div class="ml-sm t-center inline">
                <el-button @click="exit" class="inline">退出</el-button>
            </div>
        </el-row>
        <el-row>
            <el-col :span="14">
                <div class="box mt-sm">
                    <table class="sku-table" cellpadding="0" cellspacing="0">
                        <template>
                            <tr style=" height: 60px;">
                                <td style="text-align: right;border-right: 0;padding-right: 0;">扫描SKU：</td>
                                <td>
                                    <el-input ref="sku" style="width: 200px;float: left;" @keyup.enter.native="submit"
                                              :disabled="checked"
                                              @focus="focus_input" v-model="sku"></el-input>
                                    <div v-if="message">
                                        <span class="message red"><i class="el-icon-circle-close inline"
                                                                     style="font-size:16px;color:red;margin: 0 5px 6px;"></i>{{message}}</span>
                                    </div>
                                </td>
                                <td rowspan="9" style="width: 30%;text-align: center;">
                                    <img :src="skuImage" width="400px" height="400px"></td>
                            </tr>
                            <tr style="height:32px;padding:0;">
                                <td colspan="2" style="height:32px;padding:0;">
                                    <p class="box-title t-left" style="padding-left:10px">{{sku_message}}
                                        <el-button class="ml-sm" size="mini" @click="clear"
                                                   v-if="skuData.package_number">清空已扫描信息
                                        </el-button>
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 10%;text-align: right;">包裹号</td>
                                <td><span>{{skuData.package_number}}</span></td>
                            </tr>
                            <tr>
                                <td style="text-align: right;">SKU</td>
                                <td>
                                    <div class="inline">
                                        <span style="float: left;line-height: 32px;margin-right: 5px;">{{skuData.sku}}</span>
                                        <div v-if="skuData.sku_name" class="inline">
                                            <span class="inline">[</span><span
                                                class="inline">{{skuData.sku_name}}</span><span class="inline">]</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: right;">商品名称</td>
                                <td><span>{{skuData.goods_name}}</span></td>
                            </tr>
                            <tr>
                                <td style="text-align: right;">物流属性</td>
                                <td><span
                                        :class="{red: skuData.shipping_type !== '普货'}">{{skuData.shipping_type}}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: right;">数量</td>
                                <td><span>{{skuData.package_count}}</span></td>
                            </tr>
                            <tr>
                                <td style="text-align: right;">扫描数量</td>
                                <td>
                                    <el-input class="red width-md"
                                              ref="check_count"
                                              v-model="skuData.check_count"
                                              @blur="check_count_enter"
                                              @keyup.enter.native="check_count_enter"
                                              :disabled="disabled || isChecked"></el-input>
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: right;">校对</td>
                                <td>
                                    <div v-if="skuData.sku">
                                        <i class="el-icon-check" style="font-size:20px;color:#00FF00"
                                           v-if="this.skuData.package_status===1"></i>
                                        <i class="el-icon-close" style="font-size:20px;color:red" v-else></i>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </table>
                </div>
                <div class="mt-sm">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>当前操作日志</span>
                        </div>
                        <div style="overflow-y: auto;" v-resize="{height:25}">
                            <div v-for="(row,index) in logData" :key="index">
                                <span class="ml-sm">{{ row.log }}</span>
                            </div>
                        </div>
                    </el-card>
                </div>
            </el-col>
            <el-col :span="10">
                <div class="box mt-sm" style="height: 770px;">
                    <p class="box-title t-left" style="padding-left:10px">包裹信息列表
                        <permission tag="ElButton"
                                    :route="apis.url_delivery_check_batch_reset_single"
                                    @click="update_status"
                                    class="inline"
                                    style="margin-left:10px;"
                                    v-if="package_ids.length>0">重新复核
                        </permission>
                        <el-checkbox v-model="canWeight" class="ml-sm color-white bold-font">称重</el-checkbox>
                        <span class="inline fr">
                            <span style="font-size: 1.2rem; margin-left: 10px;">状态：</span>
                            <el-select v-model="package_status" class="inline width-md fr" @change="change_select"
                                       style="margin:3px;">
                                <el-option v-for="item in statusList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </span>
                        <span class="inline fr">
                            <span style="font-size: 1.2rem;">打印机：</span>
                            <select-printer v-model="printer" class="inline width-lg fr"
                                            style="margin:3px;"></select-printer>
                        </span>
                    </p>
                    <el-table
                            :data="curTableStatusData"
                            :row-class-name="row_class"
                            @selection-change="selection_change"
                            v-resize="{height:41}">
                        <el-table-column type="selection" width="35" :selectable="select_row"
                                         v-if="package_status===5"></el-table-column>
                        <el-table-column label="序号" min-width="30" v-if="package_status===5"
                                         prop="index"></el-table-column>
                        <el-table-column label="包裹号" inline-template min-width="70">
                            <div>
                                <i style="color:green" v-if="row.package_now" class="el-icon-caret-right"></i>
                                <span>{{row.package_number}}</span>
                            </div>
                        </el-table-column>
                        <el-table-column label="面单号" prop="shipping_number"></el-table-column>
                        <el-table-column label="SKU" prop="sku"></el-table-column>
                        <el-table-column label="数量" prop="quantity" min-width="50"></el-table-column>
                        <el-table-column label="状态" min-width="50" inline-template>
                            <div>{{row.package_status | statusFilter(row.package_status)}}</div>
                        </el-table-column>
                        <el-table-column label="重量" inline-template min-width="50">
                            <span v-if="package_status===5">
                                 <span :class="{'red':!!row.is_over}"
                                       :title="row.estimated_weight?`预估重量:${row.estimated_weight}`:''">{{row.package_weight}}</span>
                            </span>
                        </el-table-column>
                        <el-table-column label="打印时间" class-name="print-time" inline-template min-width="70">
                            <span v-if="row.print_time">{{row.print_time | filterTime}}</span>
                            <div v-else :style="row.style" class="progress-content"></div>
                        </el-table-column>
                        <el-table-column label="操作" inline-template min-width="50">
                            <permission
                                    class="operate"
                                    tag="span"
                                    :route="apis.url_delivery_check_print"
                                    @click="do_stamp(row.package_id)"
                                    v-if="row.package_status===1||row.package_status===2">打印
                            </permission>
                            <span class="disabled" v-else>打印</span>
                        </el-table-column>
                    </el-table>
                    <el-pagination class="fr t-right"
                                   @size-change="handle_size_change"
                                   @current-change="handle_current_change"
                                   :current-page="page"
                                   :page-size="pageSize"
                                   layout="total,prev, pager, next, jumper"
                                   :total="total">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
        <pass-box-detail :box-data="boxData"
                         :user="operator"
                         v-model="isFinish"
                         @save="save"
                         @close="close"
                         :action="action">
        </pass-box-detail>
    </page>
</template>
<style lang="stylus">
    .p-single-sku {
        .c-label-item {
            height: 30px;
            line-height: 30px;
        }
        .message {
            max-width: 185px;
            margin-left: 20px;
            font-size: 25px;
            float: left;
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
            .text-ellipsis {
                overflow: hidden;
                text-overflow: ellipsis;
                -o-text-overflow: ellipsis;
                white-space: nowrap;
            }
            .c-label-item:nth-child(1) {
                width: 15%;
            }
            .c-label-item:nth-child(2) {
                width: 10%;
                .font-span {
                    width: calc(100% - 105px);
                }
            }
            .c-label-item:nth-child(3) {
                width: 30%;
                .font-span {
                    width: calc(100% - 105px);
                }
            }
            .c-label-item:nth-child(4) {
                width: 10%;
            }
            .c-label-item:nth-child(5) {
                width: 9%;
            }
            .c-label-item:nth-child(6) {
                width: 12%;
                .font-span {
                    width: calc(100% - 85px);
                }
            }
        }
        .box {
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
            .el-table__body-wrapper {
                overflow-x: hidden;
            }
            button {
                span {
                    font-size: 1.2rem;
                }
            }
        }
        .sku-table {
            width: 100%;
            text-align left;
            border-color: #6495ed;
            th {
                padding: 0 5px;
                height: 26px;
                text-align: left;
                box-sizing: border-box;
                background-color: #eff2f7;
                border: 1px solid #e0e6ed;
            }
            tr {
                height: 40px;
                font-size: 16px;
            }
            td {
                padding: 0 5px;
                height: 26px;
                line-height: 26px;
                text-align: left;
                padding-right: 10px;
                padding-left: 10px;
                box-sizing: border-box;
                border-right: 1px solid #e0e6ed;
                border-bottom: 1px solid #e0e6ed;
                span {
                    font-size: 16px;
                }
                button {
                    span {
                        font-size: 1.2rem;
                    }
                }
            }
        }
    }

    .box-card {
        .el-card__header {
            background-color: #6495ed;
            color: #fff;
        }
    }

    @media all and (max-width: 1366px) {
        .p-single-sku {
            .box-yellow {
                .c-label-item:nth-child(1) {
                    width: 20%;
                    .font-span {
                        width: calc(100% - 85px);
                    }
                }
                .c-label-item:nth-child(2) {
                    width: 14%;
                }
                .c-label-item:nth-child(3) {
                    width: 14%;
                    .font-span {
                        width: calc(100% - 105px);
                    }
                }
                .c-label-item:nth-child(4) {
                    width: 13%;
                }
                .c-label-item:nth-child(5) {
                    width: 12%;
                }
                .c-label-item:nth-child(6) {
                    width: 11%;
                    .font-span {
                        width: calc(100% - 85px);
                    }
                }
            }
        }

    }


</style>
<script>
    import {
        api_single_box,
        api_single_sku,
        api_package_list,
        api_sure_sku,
        api_delivery_check_print,
        api_delivery_check_batch_reset_single,
        api_delivery_check_flush_checking,
        api_delivery_check_stop_turnover_box,
        api_stop_single_picking,
        api_sure_stop_single_picking,
        url_delivery_check_print,
        url_delivery_check_batch_reset_single,
        api_delivery_check_sure_stop_box
    } from '@/api/delivery-check'
    import {mapGetters, mapActions} from 'vuex';

    export default {
        permission: {
            url_delivery_check_print,
            url_delivery_check_batch_reset_single
        },
        data() {
            return {
                page: 1,
                pageSize: 50,
                sku: '',
                message: '',
                user: '',
                sku_message: '等待扫描获取包裹信息',
                picking_number: '',
                quantity: '',
                shipping_name: '',
                wait_count: '',
                type: '',
                package_status: 5,
                logData: [],
                tableData: [],
                curTableStatusData: [],
                skuData: {},
                statusList: [
                    {label: "未复核", value: 0},
                    {label: "已复核", value: 5},
                ],
                package_id: '',
                printer: '',
                token: '',
                package_ids: [],
                package_names: [],
                firstData: [],
                index: 0,
                order_id: 0,
                turnover_box_id: '',
                isFinish: false,
                boxData: [],
                operator: [],
                reqData: {},
                isBox: true,
                action: {title: '你确定要释放这些SKU吗？', value: 'box_info'},
                timer: null,
                label_width: '',
                single_manual_value: 100,
                isChecked: false,
                isPicking: false, //复核来源是否为拣货单,
                checked: false,//复核成功限制
                canWeight: false,//是否允许包装后称重,
            }
        },
        mounted() {//初始化获取已复核包裹信息
            localWebSocket({
                url: 'ws://localhost:10091/websocket'
            });
            this.$refs.sku.$refs.input.select();
            if (this.$route.query && !isEmpty(this.$route.query)) {
                let data = {
                    number: this.$route.query.number,
                    warehouse_id: this.$route.query.warehouse_id
                };
                this.isPicking = /^PL/.test(this.$route.query.number);
                this.$http(api_single_box, data).then(res => {
                    this.picking_number = res.picking_number;
                    this.type = res.type;
                    this.shipping_name = res.shipping_name;
                    this.quantity = res.quantity;
                    this.wait_count = res.wait_count;
                    this.user = this.$route.query.user;
                    this.order_id = res.id;
                    this.turnover_box_id = res.box_number;
                    this.single_manual_value = res.single_manual_value;
                    this.message = '';
                    this.sku_message = '等待扫描获取包裹信息';
                    this.package_id = '';
                    this.logData = [];
                    this.package_ids = [];
                    this.package_names = [];
                    this.label_width = res.label_width;
                    this.get_package_list(1);
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            }
        },
        methods: {
            select_row(row) {
                return row.package_status !== 4;
            },
            selection_change(select) {
                this.package_ids = select.map(row => {
                    return row.package_id;
                });
                this.package_names = select.map(row => {
                    return row.package_number;
                });
            },
            fetch_local(req) {
                return new Promise((success, fail) => {
                    fetch(req).then(async res => {
                        if (200 === res.status) {
                            try {
                                const json = await res.json();
                                success(json);
                            } catch (e) {
                                if (e instanceof Error) {
                                    fail(e.message);
                                } else {
                                    fail(e);
                                }
                            }
                        } else {
                            res.json().then(json => {
                                fail(json, res.status);
                            })
                        }
                    }).catch(error => {
                        fail(error)
                    })
                })
            },
            update_status() {
                this.package_names = this.package_names.join(',');
                this.$confirm(`您将重复新复核${this.package_names}, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {
                        package_id: this.package_ids,
                        picking_id: this.order_id,
                        turnover_box_id: this.turnover_box_id ? this.turnover_box_id : 0
                    };
                    this.$http(api_delivery_check_batch_reset_single, data).then(res => {
                        this.package_ids.forEach(item => {
                            let find = this.tableData.findIndex(row => {
                                return item === row.package_id;
                            });
                            this.tableData.splice(find, 1);
                        });
                        this.wait_count = Number(this.wait_count) + 1;
                        this.$message({type: 'success', message: res.message || res});
                        this.logData.unshift({log: `重复新复核包裹${this.package_names}`});
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            focus_input() {
                this.$refs.sku.$refs.input.select();
            },
            type_filter(val) {
                switch (Number(val)) {
                    case 1:
                        return '单品单件';
                    case 2:
                        return '单品多件';
                    case 3:
                        return '单品';
                }
            },
            change_select(val) {
                if (val === 0) {
                    this.get_package_list(0);
                }
                this.$refs.sku.$refs.input.select();
            },
            get_package_list(status) {//获取包裹列表给序列号
                let data = {
                    status: status
                };
                this.$http(api_package_list, this.order_id, data).then(res => {
                    if (status === 0) {
                        this.firstData = res;
                        this.firstData.forEach(row => {
                            this.$set(row, 'package_now', false);
                            this.$set(row, 'package_status', row.status);
                        });
                    } else if (status === 1) {
                        this.tableData = res;
                        let length = this.tableData.length + 1;
                        this.tableData.forEach(row => {
                            this.$set(row, 'package_now', false);
                            this.$set(row, 'package_status', row.status);
                            this.index = this.index + 1;
                            length = length - 1;
                            this.$set(row, 'index', length);
                            if (row.print_time) {
                                row.package_status = 2;
                            }
                        });

                    }
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            validate_check_count() { // 扫描数量校验
                if (Number(this.skuData.check_count) > this.skuData.package_count || isNaN(Number(this.skuData.check_count))) {
                    this.$message({type: 'error', message: '输入的数量错误，请输入正确的数字'});
                    this.$refs.check_count.inputSelect();
                    return false
                }
                return true;
            },
            check_count_enter() { //扫描数量Enter
                if (this.isChecked) {
                    return;
                }
                this.isChecked = true;
                if (!this.validate_check_count()) {
                    this.isChecked = false;
                    return false;
                } else if (Number(this.skuData.check_count) === this.skuData.package_count) {
                    this.check_success();
                } else {
                    this.isChecked = false;
                }
            },
            submit() { // 扫描sku
                this.isChecked = false;
                if (!this.disabled) {
                    this.skuData.check_count = Number(this.skuData.check_count);
                    if (!this.validate_check_count()) {
                        return
                    }
                }
                if (this.sku.trim() === '') {
                    this.message = '请输入SKU';
                    this.sku = this.sku.trim();
                    return;
                }
                this.message = '';
                this.sku = this.sku.trim();
                let sku_lower = '';
                sku_lower = this.sku.toLowerCase();
                this.$refs.sku.$refs.input.select();
                if (this.skuData.package_count === this.skuData.check_count || this.skuData.sku === '' || this.skuData.package_status === 2 || this.skuData.package_status === 3 || this.skuData.package_status === 4) {
                    let params = {
                        id: this.order_id,
                        sku: this.sku || this.skuData.sku,
                        turnover_box_id: this.turnover_box_id ? this.turnover_box_id : 0
                    };
                    this.$http(api_single_sku, params).then(res => {
                        this.sku_message = `匹配结果`;
                        this.skuData = res;
                        this.$set(this.skuData, 'shipping_type', res.properties.find(row => row.enabled === true).name);
                        this.$set(this.skuData, 'thumb', res.thumb);
                        let sku_name = this.skuData.show_alias.join('，');
                        this.$set(this.skuData, 'sku_name', sku_name);
                        this.wait_count = this.skuData.wait_count;
                        if (this.skuData.package_status === 3) {// 面单不存在
                            this.message = `面单文件不存在`;
                            this.package_status = 5;
                            this.logData.unshift({log: `扫描${this.sku} 匹配到包裹 ${this.skuData.package_number} 面单文件不存在`});
                        } else if (this.skuData.package_status === 1) { // 单品单件
                            this.message = '';
                            this.sku = '';
                            this.package_id = this.skuData.package_id;
                            this.package_status = 5;
                            this.do_stamp(this.package_id);
                            this.first_add_data();
                            this.logData.unshift({log: `扫描${this.skuData.param_sku} 匹配到包裹 ${this.skuData.package_number} 复核成功`});
                            // this.polling_weight();
                        } else if (this.skuData.package_status === 0) { //正常
                            this.sku = '';
                            this.logData.unshift({log: `扫描${this.skuData.param_sku} 匹配到包裹 ${this.skuData.package_number}`});
                        } else if (this.skuData.package_status === 2) {// 已打印
                            this.first_add_data();
                            this.package_status = 5;
                            this.logData.unshift({log: `扫描${this.skuData.param_sku} 匹配到包裹 ${this.skuData.package_number} 包裹已打印`});
                        } else if (this.skuData.package_status === 4) {// 已取消
                            this.first_add_data();
                            this.package_status = 5;
                            this.logData.unshift({log: `扫描${this.skuData.param_sku} 匹配到包裹 ${this.skuData.package_number} 包裹取消`});
                        }
                    }).catch(code => {
                        code.voice && this.audio_play(code.voice);
                        this.skuData = {};
                        this.message = code.message;
                        this.sku_message = '等待扫描获取包裹信息';
                        this.logData.unshift({log: `扫描${this.sku} 未匹配到SKU`});
                    });
                } else {
                    if (this.skuData.package_status === 2) {
                        this.message = `包裹已打印`;
                        return;
                    } else if (this.skuData.package_status === 3) {
                        this.message = `面单文件不存在`;
                        return;
                    } else if (this.skuData.package_status === 4) {
                        this.message = `${this.skuData.package_number}包裹已取消`;
                        return;
                    }
                    let sku_lower_old = this.skuData.sku.toLowerCase();
                    let sku_alias = this.skuData.sku_alias.map(row => {
                        return row.toLowerCase()
                    });
                    let sku_data = [sku_lower_old, `${this.skuData.sku_id}`, ...sku_alias];
                    if (sku_data.includes(sku_lower)) {
                        this.skuData.check_count += 1;
                        if (this.skuData.check_count === this.skuData.package_count) {
                            this.check_success();
                        } else {
                            this.logData.unshift({log: `扫描${this.sku} 匹配到包裹 ${this.skuData.package_number}`});
                            this.sku = '';
                        }
                    } else {
                        this.message = `扫描${this.sku}不属于当前包裹${this.skuData.package_number}`;
                        this.$refs.sku.$refs.input.select();
                    }
                }
            },
            check_success() { // 复核成功验证
                let data = {
                    picking_id: this.order_id,
                    sku: this.sku || this.skuData.sku,
                    package_id: this.skuData.package_id,
                    turnover_box_id: this.turnover_box_id ? this.turnover_box_id : 0
                };
                this.package_id = this.skuData.package_id;
                if (this.is_checked()) {
                    this.$message({type: 'error', message: `${data.sku}已经复核完成，请勿重复操作`});
                    return;
                }
                this.checked = true;
                this.sku = '';
                this.$http(api_sure_sku, data).then(res => {
                    // 复核成功改变包裹状态
                    this.skuData.package_status = 1;
                    this.package_status = 5;

                    this.isChecked = true;
                    this.wait_count = res.wait_count;
                    this.logData.unshift({log: `扫描${data.sku} 匹配到包裹 ${this.skuData.package_number} 复核成功`});
                    this.do_stamp(this.package_id);
                    if (this.tableData.length > 0) {
                        this.tableData.forEach(item => {
                            item.package_now = false;
                        });
                    }
                    let first = window.clone(this.skuData);
                    this.index = this.index + 1;
                    first.package_status = 1;
                    this.$set(first, 'package_now', true);
                    this.$set(first, 'index', this.index);
                    this.tableData.unshift(first);
                    //复核成功
                    console.log("firstfirstfirstfirst:", first);
                    // this.polling_weight();
                    /*if(res.status) {
                        this.$message({type: 'success', message: res.message || res});
                        this.$nextTick(() => {
                            this.$router.push({
                                path: "/delivery-check/single-box",
                            });
                        });
                    }*/
                }).catch(code => {
                    code.voice && this.audio_play(code.voice);
                    this.isChecked = false;
                    this.message = code.message;
                }).finally(() => {
                    this.checked = false;
                    this.$refs.sku.$refs.input.select();
                });
            },
            is_checked() {
                let skuData = this.tableData.find(row => row.package_number === this.skuData.package_number);
                if (skuData && skuData.package_status === 1) {
                    this.isChecked = true;
                    return true;
                } else {
                    return false;
                }
            },
            polling_weight() {
                if (!this.canWeight) return;
                let first = clone(this.skuData);
                let data = {
                    route: 'weigh-setting-params',
                    id: `${first.package_id}-${Date.now()}`,
                    sendmode: 1,
                    package_id: first.package_id,
                    callback: 'xxx'
                };
                let websocket_weight = (res) => {
                    if (res.status === 1) {
                        this.tableData.forEach(row => {
                            if (row.package_id === res.package_id) {
                                if (res.results.status === 1) {
                                    this.$set(row, 'is_over', res.results.is_over);
                                    this.$set(row, 'package_weight', res.results.package_weight);
                                    this.$set(row, 'estimated_weight', res.results.estimated_weight);
                                } else {
                                    this.$message({type: 'error', message: res.results.message});
                                }
                            }
                        });
                    } else {
                        this.$message({type: 'error', message: `${res.package_id}:${res.message}`});
                    }
                };
                if (local_websocket && local_websocket.IsOpen) {
                    local_websocket.sendRequest(data, (res) => {
                        websocket_weight(res);
                    });
                } else {
                    localWebSocket({
                        open: () => {
                            local_websocket.connected();
                            local_websocket.sendRequest(data, (res) => {
                                websocket_weight(res);
                            })
                        },
                        error: () => {
                            local_websocket.closed();
                            let req = new Request('http://localhost:10093/setPackageinfo', {
                                method: 'post',
                                mode: 'cors',
                                headers: {"Content-Type": 'application/x-www-form-urlencoded'},
                                body: obj2url({'ID': first.package_id, 'CallBack': 'xxx'})
                            });
                            this.fetch_local(req).then(local => {
                                this.set_timer();
                            });
                        }
                    });
                }


            },
            set_timer() {
                let req = new Request('http://localhost:10093/getWeighCache', {
                    method: 'get',
                    mode: 'cors',
                    headers: {"Content-Type": 'application/x-www-form-urlencoded'},
                });
                if (this.timer) {
                    clearInterval(this.timer)
                } else {
                    this.timer = setInterval(() => {
                        this.fetch_local(req).then(res => {
                            console.log('get weight cache', res);
                            if (res.status === '1') {
                                clearInterval(this.timer);
                                this.timer = null;
                                //右边表格添加重量
                                this.tableData.forEach(row => {
                                    if (row.package_id === res.packageID) {
                                        row.is_over = res.result.is_over;
                                        row.package_weight = res.result.package_weight;
                                        row.estimated_weight = res.result.estimated_weight;
                                    }
                                });
                            }
                        }).catch(code => {
                            this.$message({type: "error", message: code.message || code})
                        })
                    }, 1000)
                }
            },
            first_add_data() {
                if (this.tableData.length > 0) {
                    this.tableData.forEach(item => {
                        item.package_now = false;
                    });
                }
                let first = window.clone(this.skuData);
                this.index = this.index + 1;
                this.$set(first, 'package_now', true);
                this.$set(first, 'index', this.index);
                this.tableData.unshift(first);
            },
            ...mapActions({
                set_printerList: 'api/set_printerList'
            }),
            do_stamp(package_id) { // 打印面单
                this.$http(api_delivery_check_print, package_id, {type: 2}).then(res => {
                    if (local_websocket && local_websocket.IsOpen) {
                        this.socket_print(package_id, res);
                    } else {
                        this.http_print(package_id, res);
                    }
                    /*let direction = res.direction || 1;
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
                    data.NumberList = res.identification;
                    data.Url = config.apiHost + res.callback;
                    data.Width = res.width;
                    data.Height = res.height;
                    let flag = this.$printer(this.printer, data);
                    if (!!flag) {
                        flag.then(result => {
                            if (result) {
                                this.tableData.forEach(item => {
                                    if (item.package_id === package_id) {
                                        item.package_status = 2;
                                        let create_time = Date.parse(new Date);
                                        create_time = create_time / 1000;
                                        item.print_time = create_time;
                                    }
                                });
                                this.logData.unshift({log: `扫描${first.sku}，包裹 ${first.package_number}打印成功`});
                            }
                        });
                    }*/
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });

            },
            socket_print(id, res) {//websocket打印
                let first = clone(this.skuData);
                let direction = res.direction || 1;
                let data = {
                    route: '',
                    id: `${id}-${Date.now()}`,
                    call_back: res.callback ? config.apiHost + res.callback : '',
                    width: res.width || 100,
                    height: res.height || 100,
                    print_name: JSON.parse(this.printer).name,
                    mark_id: res.identification,
                    content: '',
                    direction: direction === 1 ? 'vertical' : 'transverse'
                };
                res.file_list.forEach(row => {
                    data.content = row.file;
                    if (row.type === 'url') {
                        data.route = 'print-single-doc-pdf';
                    } else {
                        data.route = 'print-single-doc-html';
                        data.type = 'doc-flow';
                    }
                    if (row.coordinate !== undefined && row.label_num !== undefined) {
                        data.watermark = {
                            coordinate: row.coordinate,
                            mark: row.label_num,
                        }
                    }
                });
                local_websocket.sendRequest(data, (result) => {
                    if (result.status === 1) {
                        this.polling_weight();
                        this.tableData.forEach(item => {
                            if (item.package_id === id) {
                                this.$set(item, 'class', '');
                                this.$set(item, 'style', ``);
                                item.package_status = 2;
                                let create_time = Date.parse(new Date);
                                create_time = create_time / 1000;
                                item.print_time = create_time;
                                this.logData.unshift({log: `扫描${this.sku}，包裹 ${first.package_number}打印成功`});
                                this.$message({type: 'success', message: result.message});
                            }
                        });
                    } else if (result.status === 0) {
                        this.tableData.forEach(item => {
                            if (item.package_id === id) {
                                this.$set(item, 'class', ``);
                                this.$set(item, 'style', ``);
                            }
                        });
                        this.$message({type: 'error', message: result.message});
                    } else if (result.status === 2) {
                        this.tableData.forEach(item => {
                            if (item.package_id === id) {
                                this.$set(item, 'class', `print-progress`);
                                this.$set(item, 'style', `width: ${result.progress}%`);
                            }
                        });
                    }
                });
            },
            http_print(id, res) {//http打印
                let first = clone(this.skuData);

                localWebSocket({
                    url: 'ws://localhost:10091/websocket',
                    open: () => {
                        local_websocket.connected();
                        this.socket_print(id, res);
                    },
                    error: () => {
                        local_websocket.closed();
                        let direction = res.direction || 1;
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
                        data.NumberList = res.identification;
                        data.Url = config.apiHost + res.callback;
                        data.Width = res.width;
                        data.Height = res.height;
                        let flag = this.$printer(this.printer, data);
                        if (!!flag) {
                            flag.then(result => {
                                if (result) {
                                    this.tableData.forEach(item => {
                                        if (item.package_id === id) {
                                            item.package_status = 2;
                                            let create_time = Date.parse(new Date);
                                            create_time = create_time / 1000;
                                            item.print_time = create_time;
                                        }
                                    });
                                    this.logData.unshift({log: `扫描${first.sku}，包裹 ${first.package_number}打印成功`});
                                }
                            });
                        }
                    },
                });
            },
            clear() {
                if (this.skuData.package_status === 0) {
                    let data = {
                        picking_id: this.order_id,
                        sku_id: this.skuData.sku_id,
                        package_id: this.skuData.package_id,
                    };
                    this.$http(api_delivery_check_flush_checking, data).then(res => {
                        console.log('清除扫描成功');
                    });
                }
                this.logData.unshift({log: `清空包裹${this.skuData.package_number}扫描信息`});
                this.skuData = {};
                this.sku = '';
                this.message = '';
                this.sku_message = '等待扫描获取包裹信息';
                this.$nextTick(() => {
                    this.$refs.sku.$refs.input.select();
                });
            },
            release_box() {
                let data = {
                    turnover_box_id: this.turnover_box_id,
                    picking_id: this.order_id,
                };
                console.log('release box', data);
                this.$http(api_delivery_check_stop_turnover_box, data).then(res => {
                    if (res.list.length === 0) {
                        this.$message({type: 'success', message: res.message || res});
                        this.$router.push({
                            path: "/delivery-check/single-box",
                        });
                    } else {
                        this.isFinish = true;
                        this.isBox = true;
                        this.boxData = [{list: res.list, turnover_box_num: this.turnover_box_id, message: res.message}];
                        this.action = {title: '你确定要释放这些SKU吗？', value: 'box_info'};
                    }
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            sure_release_box() {
                let data = {
                    turnover_box_id: this.turnover_box_id,
                    picking_id: this.order_id,
                };
                console.log('release box', data);
                return this.$http(api_delivery_check_sure_stop_box, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.isFinish = false;
                    this.$router.push({
                        path: "/delivery-check/single-box",
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            release_picking() {
                let data = {
                    id: this.order_id
                };
                // 拣货单释放返回只有一个元素的数组
                this.$http(api_stop_single_picking, data).then(res => {
                    let success = [];
                    let error = [];
                    let confirm = [];
                    let isForce = false;
                    res.result.map(row => {
                        switch (row.success) {
                            case 1:
                                success.push(row);
                                break;
                            case 2:
                                isForce = row.list.length > 0;
                                error.push(row);
                                break;
                            case 0:
                                confirm.push(row);
                                break;
                        }
                    });

                    if (isForce) { // 可强制完成包装
                        this.confirm_release(res);
                        return;
                    }

                    if (confirm.length === 0) {
                        if (error.length === 0) {
                            this.$message({
                                type: 'success',
                                message: `所有周转箱释放成功`
                            });
                            this.$router.push({
                                path: "/delivery-check/single-box",
                            });
                            return;
                        }
                        if (success.length === 0) {
                            return this.$message({
                                type: 'error',
                                message: '所有周转箱当前下架数足够匹配一个包裹，无法释放周转箱'
                            });
                        }
                        let successMessage = success.map(row => row.turnover_box_num).join();
                        let errorMessage = error.map(row => row.turnover_box_num).join();
                        this.$message({
                            type: 'error',
                            message: `周转箱${successMessage}释放成功；周转箱${errorMessage}释放失败`
                        });
                    } else {
                        this.confirm_release(res);
                    }
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            confirm_release(res) {
                this.isFinish = true;
                this.operator = res.user;
                this.boxData = res.result;
                this.isBox = false;
                this.action = {title: '你确定要释放这些周转箱吗？', value: 'box_info'};
            },
            sure_release_picking() {
                let data = {
                    id: this.order_id
                };
                return this.$http(api_sure_stop_single_picking, data).then(res => {
                    if (res.success === 2) {
                        this.$message({type: 'error', message: res.message || res});
                    } else {
                        this.$message({type: 'success', message: res.message || res});
                        this.$router.push({
                            path: "/delivery-check/single-box",
                        });
                    }
                    this.isFinish = false;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                });
            },
            /* check_stop_picking(res) {
                 console.log('check stop picking start', res);
                 let success = true;
                 let successMessage = [];
                 let confirmMessage = [];
                 res.map(row => {
                     if (row.success !== 1) {
                         success = false;
                     }
                     if (row.message !== '') {
                         successMessage.push(`${row.turnover_box_num}${row.message}`);
                     } else {
                         let list = row.list.map(sku => sku.sku).join();
                         let message = `周转箱${row.turnover_box_num}还有sku（${list}）`;
                         confirmMessage.push(message);
                     }
                 });
                 console.log('check stop picking', successMessage, confirmMessage);
                 if (confirmMessage.length === 0) {
                     return {
                         message: successMessage,
                         success: success,
                         confirm: false,
                     }
                 } else {
                     confirmMessage = successMessage.concat(confirmMessage);
                     return {
                         message: confirmMessage,
                         confirm: true,
                     }
                 }
             },*/
            exit() {
                this.$router.push({
                    path: "/delivery-check/single-box",
                });
            },
            save() {
                if (this.isBox) {
                    return this.sure_release_box();
                } else {
                    return this.sure_release_picking();
                }
            },
            close() {//关闭弹窗，清空数据
                this.operator = [];
                this.boxData = [];
            },
            handle_size_change(val) {
                this.pageSize = val;
                let maxPage = Math.ceil(this.packages.length / this.pageSize) - 1;
                this.page = this.page > maxPage ? maxPage : this.page;
                this.paging_handle();
            },
            handle_current_change(val) {
                this.page = val;
                this.paging_handle();
            },
            paging_handle() {
                this.curTableStatusData = this.pagingData[this.page - 1];
            },
            audio_play(voice) {// 播报语音
                this.$audio(voice, this.audioToken);
            },
            row_class(row, index) {// 打印进度class
                return row.class || '';
            }
        },
        filters: {
            statusFilter(val) {
                switch (val) {
                    case 0:
                        return '未复核';
                    case 1:
                        return '已复核';
                    case 2:
                        return '已打印';
                    case 3:
                        return '面单不存在';
                    case 4:
                        return '包裹取消';
                }
            }
            ,
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            }
            ,
        },
        watch: {
            user(val) {
                if (!val) {
                    this.$router.replace("/delivery-check/single-box");
                }
            },
            pagingData(val) {
                this.paging_handle();
            }
        },
        beforeDestroy() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null
            }
        },
        computed: {
            ...mapGetters({currentUser: 'user/info', audioToken: 'audio/token'}),
            skuImage() {
                return `${this.skuData.thumb}?r=${Math.random()}`
            },
            tableStatusData() {
                switch (this.package_status) {
                    case 0:
                        return this.firstData;
                    case 5:
                        return this.tableData;
                }
            },
            disabled() {
                return !this.skuData.package_count || this.skuData.package_count < this.single_manual_value;
            },
            pagingData() { // 分页
                let pagingData = [];
                if (this.tableStatusData.length === 0) {
                    pagingData.push([]);
                    return pagingData;
                }
                let length = Math.ceil(this.tableStatusData.length / this.pageSize);
                for (let i = 0; i < length; i++) {
                    let start = i * this.pageSize;
                    pagingData.push(this.tableStatusData.slice(start, start + this.pageSize));
                }
                return pagingData;
            },
            total() {
                return this.tableStatusData.length;
            }
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            selectPrinter: require('@/components/select-printer.vue').default,
            passBoxDetail: require('./pass-box-detail').default
        }
    }
</script>
