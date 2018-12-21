<template>
    <page class="p-check-shipping-number">
        <el-row>
            <el-col :span="15">
                <el-card>
                    <!--<requestLabelItem :label="submitTitle" class="mt-lg mb-lg">
                        &lt;!&ndash;<el-input ref="sku" @keyup.enter.native="submit" @focus="focus_input"
                                  v-model="shipping_number"></el-input>&ndash;&gt;
                        <request-input ref="sku" @enter="submit"
                                       class="width-lg"
                                       req-key="checkShippingNumber"
                                       v-model="shipping_number">
                        </request-input>
                        <div class="table" v-if="message">
                             <span class="message red"><i class="el-icon-circle-close inline"
                                                          style="font-size:25px;color:red;margin: 0 5px 6px;"></i>{{message}}</span>
                        </div>
                    </requestLabelItem>-->
                    <label-item :label="submitTitle" class="mt-lg mb-lg">
                        <el-input ref="sku" @keyup.enter.native="submit" @focus="focus_input"
                                  v-model="shipping_number"></el-input>
                        <div v-if="message">
                            <span class="message red"><i class="el-icon-circle-close inline"
                                                         style="font-size:25px;color:red;margin: 0 5px 6px;"></i>{{message}}</span>
                        </div>
                    </label-item>
                </el-card>
                <div class="box mt-xs box-radius">
                    <p class="box-title t-left" style="padding-left:10px">自动匹配包裹：{{package.package_number}}&nbsp;&nbsp;面单号：{{package.shipping_number}}
                        <el-button class="ml-sm" size="mini" @click="clear" v-if="tableData.length>0">清空已扫描信息
                        </el-button>
                        <permission tag="ElButton" :route="apis.url_confirm_error" class="ml-sm" size="mini"
                                    @click="check_abnormal" v-if="tableData.length>0 && !validate">确认异常
                        </permission>
                    </p>
                    <template v-if="tableData.length>0">
                        <el-table :data="tableData"
                                  class="table-class"
                                  :row-class-name="table_class"
                                  v-resize="{height:40}">
                            <el-table-column label="校对" inline-template>
                                <div v-if="row.sku">
                                    <i class="el-icon-check" style="font-size:25px;color:#00FF00"
                                       v-if="row.package_count===row.check_count"></i>
                                    <i class="el-icon-close" style="font-size:25px;color:red"
                                       v-else-if="row.package_count!==row.check_count"></i>
                                </div>
                            </el-table-column>
                            <el-table-column label="图片" inline-template>
                                <div><img v-lazy="row.thumb" width="80px" height="80px"></div>
                            </el-table-column>
                            <el-table-column label="SKU/SKU别名" inline-template>
                                <div>
                                    <div>{{row.sku}}</div>
                                    <div v-for="(sku,index) in row.show_alias" :key="index" style="display: block;">
                                        {{sku}}
                                    </div>
                                </div>
                            </el-table-column>
                            <el-table-column label="数量" prop="package_count"></el-table-column>
                            <el-table-column label="扫描数量" prop="check_count" inline-template>
                                <el-input class="red" v-model="row.check_count" @keyup.native.enter="review_check(row)"
                                          @blur="review_check(row)"
                                          :disabled="row.package_count < this.single_manual_value || row.checked"></el-input>
                                <!--<div style="color: red;">{{row.check_count}}</div>-->
                            </el-table-column>
                            <el-table-column label="商品名称（规格）" prop="goods_name" width="250"></el-table-column>
                            <el-table-column label="备注" prop="user_message"></el-table-column>
                        </el-table>
                    </template>
                    <template v-else>
                        <div v-resize="{height:40}" style="text-align: center;"><span
                                style="font-size: 30px;display: block;margin-top: 200px;">请扫描面单号</span></div>
                    </template>

                </div>
            </el-col>
            <el-col class="box-radius" :span="9">
                <div class="box box-margin">
                    <p class="box-title t-left" style="padding-left:10px">包裹信息列表
                        <span class="inline fr">
                                <span style="font-size: 1.2rem;margin-left: 10px;">状态：</span>
                                <el-select v-model="status" @change="change_select" class="inline width-xs fr"
                                           style="margin:3px;">
                                    <el-option v-for="item in statusList"
                                               :key="item.value"
                                               :value="item.value"
                                               :label="item.label"></el-option>
                                </el-select>
                            </span>
                        <el-checkbox v-model="canWeight" class="ml-sm color-white bold-font">称重</el-checkbox>
                        <span class="inline fr">
                            <span style="font-size: 1.2rem;">打印机：</span>
                            <select-printer v-model="printer" class="inline width-lg fr"
                                            style="margin:3px;"></select-printer>
                        </span>
                    </p>
                    <el-table :data="packageStatusData"
                              :row-class-name="row_class"
                              style="overflow-y: auto;height: 330px;">
                        <el-table-column label="包裹号" inline-template>
                            <div>
                                <i style="color:green;" v-if="row.package_now" class="el-icon-caret-right"></i>
                                <span>{{row.package_number}}</span>
                            </div>
                        </el-table-column>
                        <el-table-column label="面单号" prop="shipping_number"></el-table-column>
                        <el-table-column label="状态" inline-template width="60">
                            <span>{{row.status | statusFilter(row.status)}}</span>
                        </el-table-column>
                        <el-table-column label="重量" inline-template min-width="50">
                            <span :class="{'red':!!row.is_over}"
                                  :title="row.estimated_weight?`预估重量:${row.estimated_weight}`:''">{{row.package_weight}}</span>
                        </el-table-column>
                        <el-table-column label="打印时间" class-name="print-time" inline-template>
                            <span v-if="row.print_time">{{row.print_time | filterTime}}</span>
                            <div v-else :style="row.style" class="progress-content"></div>
                        </el-table-column>
                        <el-table-column label="操作" inline-template width="60">
                            <span class="disabled" v-if="row.status===1">打印</span>
                            <permission
                                    tag="span"
                                    :route="apis.url_delivery_check_print"
                                    class="operate"
                                    @click="get_print(row.package_id)"
                                    v-else>打印
                            </permission>
                        </el-table-column>
                    </el-table>
                </div>
                <el-card class="box-card mt-xs ml-sm" v-resize="{height:40}">
                    <div slot="header" class="clearfix">
                        <span>当前操作日志</span>
                    </div>
                    <div style="overflow-y: auto;" v-resize="{height:40}">
                        <div v-for="(row,index) in logData" :key="index">
                            <span class="ml-sm yellow">{{row.log}}</span>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </page>
</template>
<style lang="stylus">
    .p-check-shipping-number {
        .c-label-item {
            height: 30px;
            line-height: 30px;
        }
        .message {
            margin-left: 20px;
            font-size: 30px;
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
        }
        .box-margin {
            margin-left: 10px;
        }
        .box-radius {
            border-radius: 4px;
        }
        .box-card {
            .el-card__header {
                background-color: #6495ed;
                color: #fff;
            }
        }
        .table-class {
            .yellow {
                color: #ff9900;
            }
        }
        .table {
            display: inline-table;
        }
    }
</style>
<script>
    import {
        api_check_shipping_number, api_print_shipping_number, api_confirm_error, api_delivery_check_print,
        url_confirm_error, url_delivery_check_print
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
            url_confirm_error,
            url_delivery_check_print
        },
        refresh() {
            this.shipping_number = '';
            this.tableData = [];
            this.logData = [];
            this.package = {};
            this.message = '';
            this.status = 5;
            this.packageNumber = false;
            this.$refs.sku.inputSelect();
        },
        data() {
            return {
                shipping_number: '',
                package_id: '',
                package_number: '',
                status: 5,
                message: '',
                statusList: [
                    {label: "未复核", value: 1},
                    {label: "已复核", value: 5},
                ],
                tableData: [],
                packageData: [],
                logData: [],
                package: {},
                printer: '',
                token: '',
                packageNumber: false,
                timer: null,
                validate: false,
                single_manual_value: 0,//阈值
                canWeight: false,//是否允许包装后称重
            }
        },
        mounted() {
            this.$refs.sku.inputSelect();
            localWebSocket({
                url: 'ws://localhost:10091/websocket',
            });
        },
        methods: {
            change_select(val) {
                console.log('status', val);
                this.$refs.sku.inputSelect();
            },
            focus_input() {
                this.$refs.sku.inputSelect();
            },
            table_class(row) {
                let sku_lower = row.sku.toLowerCase();
                let sku_lower_old = this.shipping_number.toLowerCase();
                let sku_alias = row.sku_alias.map(item => {
                    return item.toLowerCase()
                });
                if ([sku_lower, `${row.sku_id}`, ...sku_alias].includes(sku_lower_old)) {
                    return 'yellow';
                } else {
                    return '';
                }
            },
            disabled(row) {
                return row.check_count === row.package_count || row.package_count < this.single_manual_value;
            },
            submit() {
                this.message = '';
                if (this.shipping_number.trim() === '') {
                    this.message = '请扫描面单号/SKU';
                    this.shipping_number = this.shipping_number.trim();
                    // this.$reqKey('checkShippingNumber', false);
                    return;
                }
                this.status = 5;
                this.$refs.sku.inputSelect();
                this.shipping_number = this.shipping_number.trim();
                if (this.tableData.length === 0 || this.packageNumber) {
                    this.$http(api_check_shipping_number, {shipping_number: this.shipping_number}).then(res => {
                        this.package_number = res.package.package_number;
                        this.package_id = res.package.package_id;
                        this.tableData = res.sku_list;
                        this.package = {};
                        this.package = {
                            package_number: res.package.package_number,
                            package_id: res.package.package_id,
                            shipping_number: res.package.shipping_number,
                            print_time: res.package.print_time,
                        };
                        this.tableData.forEach(row => {
                            this.$set(row, 'checked', false)
                        });
                        this.single_manual_value = res.single_manual_value;
                        if (res.msg !== '') {//二次校验
                            this.validate = true;
                            this.message = res.msg;
                            this.tableData.forEach(row => {
                                this.$set(row, 'check_count', 0);
                            });
                            this.logData.unshift({log: `扫描面单：${this.shipping_number}，匹配到包裹 ${res.package.package_number},${res.msg}`});
                            this.shipping_number = '';
                            return;
                        }
                        this.validate = false;
                        let find = this.packageData.find(row => {
                            return row.shipping_number === this.shipping_number;
                        });

                        if (!find) {//新包裹
                            if (res.msg) {
                                this.message = res.msg;
                                this.packageNumber = true;
                                this.$set(res.package, 'status', 4);
                            } else {
                                this.message = '';
                                this.packageNumber = false;
                                this.$set(res.package, 'status', 1);
                            }
                            // 包裹列表状态改变
                            this.packageData.forEach(row => {
                                if (row.package_now) {
                                    row.package_now = false;
                                }
                            });
                            this.$set(res.package, 'package_now', true);
                            this.packageData.unshift(res.package);
                        }
                        this.tableData.forEach(row => {
                            this.$set(row, 'check_count', 0);
                        });
                        this.logData.unshift({log: `扫描面单：${this.shipping_number}，匹配到包裹 ${res.package.package_number}`});
                        this.shipping_number = '';
                    }).catch(code => {
                        code.voice && this.audio_play(code.voice);
                        this.message = code.message;
                        this.logData.unshift({log: `扫描面单：${this.shipping_number}，${this.message}`});
                    });
                    /*.finally(() => {
                    setTimeout(() => {
                        this.$reqKey('checkShippingNumber', false);
                        this.$refs.sku.inputSelect();
                    }, 200);
                });*/
                } else {
                    // 匹配扫描sku（别名）
                    let sku = this.tableData.find(res => {
                        let sku_lower = res.sku.toLowerCase();
                        let sku_lower_old = this.shipping_number.toLowerCase();
                        let sku_alias = res.sku_alias.map(row => {
                            return row.toLowerCase()
                        });
                        return [sku_lower, `${res.sku_id}`, ...sku_alias].includes(sku_lower_old);
                    });
                    if (!sku) {
                        this.message = `SKU ${this.shipping_number} 不属于当前包裹`;
                        this.logData.unshift({log: `扫描SKU：${this.shipping_number}，匹配失败`});
                        // this.$reqKey('checkShippingNumber', false);
                        return;
                    } else {
                        this.tableData.forEach(row => {
                            let sku_lower = row.sku.toLowerCase();
                            let sku_lower_old = this.shipping_number.toLowerCase();
                            let sku_alias = row.sku_alias.map(item => {
                                return item.toLowerCase()
                            });
                            if ([sku_lower, `${row.sku_id}`, ...sku_alias].includes(sku_lower_old)) {
                                if (row.check_count < row.package_count) {
                                    row.check_count += 1;
                                    this.message = '';
                                    this.logData.unshift({log: `扫描SKU：${this.shipping_number}，匹配成功`});
                                    this.shipping_number = '';
                                } else {
                                    this.message = `SKU ${this.shipping_number} 已校对`;
                                    this.logData.unshift({log: `扫描SKU：${this.shipping_number}，${this.message}`});
                                }
                            }
                        });
                    }
                    this.review_success();
                }
            },
            audio_play(voice, speed) {// 播报语音
                this.$audio(voice, this.audioToken, speed);
            },
            /**
             * 复核检查
             */

            review_check(row) {
                if (row.checked) {
                    return;
                }
                row.check_count = Number(row.check_count);
                if (!this.validate_check_count(row)) {//验证扫描数
                    return false;
                }
                if (row.check_count === row.package_count) {
                    this.message = `SKU ${row.sku} 已校对`;
                    this.logData.unshift({log: `扫描SKU：${this.shipping_number}，${this.message}`});
                    this.$set(row, 'checked', true);
                    this.review_success();
                }
            },
            validate_check_count(row) { // 扫描数量校验
                if (Number(row.check_count) > row.package_count || isNaN(Number(row.check_count))) {
                    row.check_count = '';
                    this.$message({type: 'error', message: '输入的数量错误，请输入正确的数字'});
                    return false;
                }
                return true;
            },
            /**
             * 复核成功检查
             */
            review_success() {
                let find = this.tableData.find(res => {
                    return Number(res.check_count) !== Number(res.package_count);
                });

                if (!find) {
                    if (this.validate) {//新增二次校验
                        let message_success = `包裹 ${this.package.package_number} 校验完成`;
                        this.validate = false;
                        this.$message({
                            type: 'success',
                            message: message_success
                        });
                        this.logData.unshift({log: `扫描SKU：${this.shipping_number}，${message_success}`});
                        this.package_number = '';
                        this.clear();
                        // this.$reqKey('checkShippingNumber', false);
                        return;
                    }

                    let sku_list = this.tableData.map(row => {
                        return row.sku;
                    });
                    let data = {
                        // shipping_number: this.package_number,
                        package_id: this.package_id,
                        sku: sku_list
                    };
                    this.$http(api_print_shipping_number, data).then(res => {
                        let num = '';
                        /*console.log('复核完成', `当前包裹号${this.shipping}`, this.packageData);
                        console.log(JSON.stringify(this.packageData));*/

                        this.packageData.forEach(row => {
                            /*console.log('匹配包裹', row, `当前包裹号${this.shipping}`);
                            console.error( 'res.shipping_number:',row.shipping_number);
                            console.error( 'shipping:',this.shipping);
                            console.error( 'flag:',this.shipping === row.shipping_number);*/
                            if (row.package_id === this.package_id) {
                                row.status = 2;
                                let message_success = `包裹 ${this.package_number} 复核成功`;
                                num = row.package_id;
                                this.logData.unshift({log: `扫描SKU${this.shipping_number}，${message_success}`});
                                //没有打印过面单就需要补打
                                this.package.print_time === 0 && this.get_print(this.package.package_id);
                            }
                        });
                        //再次请求
                        /*if(this.canWeight) {
                            let websoket_wegiht = () => {
                                let data = {
                                    route: 'weigh-setting-params',
                                    id: `${num}-${Date.now()}`,
                                    sendmode: 1,
                                    package_id: num,
                                    callback: 'xxx'
                                };
                                local_websocket.sendRequest(data, (res) => {
                                    if(res.status === 1) {
                                        this.packageData.forEach(row => {
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
                                });
                            }
                            if(local_websocket && local_websocket.IsOpen) {
                                websoket_wegiht();
                            } else {
                                localWebSocket({
                                    url: 'ws://localhost:10091/websocket',
                                    open: () => {
                                        local_websocket.connected();
                                        websoket_wegiht();
                                    },
                                    error: () => {
                                        local_websocket.closed();
                                        let req = new Request('http://localhost:10093/setPackageinfo', {
                                            method: 'post',
                                            mode: 'cors',
                                            headers: {"Content-Type": 'application/x-www-form-urlencoded'},
                                            body: obj2url({'ID': num, 'CallBack': 'xxx'})
                                        });
                                        this.fetch_local(req).then(local => {
                                            console.log('set package info', local);
                                            this.set_timer();
                                        });
                                    }
                                });
                            }
                        }*/
                        this.$message({type: 'success', message: res.message || res});
                        this.clear();
                    }).catch(code => {
                        code.voice && this.audio_play(code.voice);
                        this.$message({type: 'error', message: code.message || code});
                    });
                    /*.finally(() => {
                        setTimeout(() => {
                            this.$reqKey('checkShippingNumber', false);
                            this.$refs.sku.inputSelect();
                        }, 200);
                    });*/
                }
            },
            pooling_weghit(num) {
                if (this.canWeight) {
                    let websoket_wegiht = () => {
                        let data = {
                            route: 'weigh-setting-params',
                            id: `${num}-${Date.now()}`,
                            sendmode: 1,
                            package_id: num,
                            callback: 'xxx'
                        };
                        local_websocket.sendRequest(data, (res) => {
                            if (res.status === 1) {
                                this.packageData.forEach(row => {
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
                        });
                    }
                    if (local_websocket && local_websocket.IsOpen) {
                        websoket_wegiht();
                    } else {
                        localWebSocket({
                            url: 'ws://localhost:10091/websocket',
                            open: () => {
                                local_websocket.connected();
                                websoket_wegiht();
                            },
                            error: () => {
                                local_websocket.closed();
                                let req = new Request('http://localhost:10093/setPackageinfo', {
                                    method: 'post',
                                    mode: 'cors',
                                    headers: {"Content-Type": 'application/x-www-form-urlencoded'},
                                    body: obj2url({'ID': num, 'CallBack': 'xxx'})
                                });
                                this.fetch_local(req).then(local => {
                                    console.log('set package info', local);
                                    this.set_timer();
                                });
                            }
                        });
                    }
                }
            },
            fetch_local(req) {
                return new Promise((success, fail) => {
                    fetch(req).then(async res => {
                        if (200 === res.status) {
                            try {
                                const json = await res.json()
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
                                this.packageData.forEach(row => {
                                    if (row.package_id === res.packageID) {
                                        row.is_over = res.result.is_over;
                                        row.package_weight = res.result.package_weight;
                                        row.estimated_weight = res.result.estimated_weight;
                                    }
                                })
                            }
                        }).catch(code => {
                            this.$message({type: "error", message: code.message || code})
                        })

                    }, 1000)
                }
            },
            ...mapActions({
                set_printerList: 'api/set_printerList'
            }),
            get_print(id) {//获取打印数据
                this.$http(api_delivery_check_print, id, {type: 3}).then(res => {
                    if (local_websocket && local_websocket.IsOpen) {
                        this.socket_print(id, res);
                    } else {
                        this.http_print(id, res);
                    }
                    this.$refs.sku.inputSelect();
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            socket_print(id, res) {//websocket打印
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
                        this.pooling_weghit(id);
                        this.packageData.forEach(item => {
                            if (item.package_id === id) {
                                this.$set(item, 'class', ``);
                                this.$set(item, 'style', ``);
                                let create_time = Date.parse(new Date());
                                create_time = create_time / 1000;
                                item.print_time = create_time;
                                item.status = 3;
                                let message_success = `面单号 ${item.shipping_number} 已打印`;
                                this.logData.unshift({log: `${message_success}`});
                                this.$message({type: 'success', message: result.message});
                            }
                        });
                    } else if (result.status === 0) {
                        this.packageData.forEach(item => {
                            if (item.package_id === id) {
                                this.$set(item, 'class', ``);
                                this.$set(item, 'style', ``);
                            }
                        });
                        this.$message({type: 'error', message: result.message});
                    } else if (result.status === 2) {
                        this.packageData.forEach(item => {
                            if (item.package_id === id) {
                                this.$set(item, 'class', `print-progress`);
                                this.$set(item, 'style', `width: ${result.progress}%`);
                            }
                        });
                    }
                });
            },
            http_print(id, res) {//http打印
                localWebSocket({
                    url: 'ws://localhost:10091/websocket',
                    open: () => {
                        local_websocket.connected();
                        this.websocket_prints(id, res);
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
                            flag.then(res => {
                                if (res) {
                                    this.packageData.forEach(item => {
                                        if (item.package_id === id) {
                                            let create_time = Date.parse(new Date);
                                            create_time = create_time / 1000;
                                            item.print_time = create_time;
                                            item.status = 3;
                                            let message_success = `面单号 ${item.shipping_number} 已打印`;
                                            this.logData.unshift({log: `${message_success}`});
                                        }
                                    });
                                }
                            });
                        }
                    },
                });
            },
            check_abnormal() {
                this.$http(api_confirm_error, this.package.package_id).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.logData.unshift({log: `包裹 ${this.package.package_number} 确认异常成功`});
                    this.packageData.forEach(res => {
                        if (res.package_number === this.package.package_number) {
                            res.status = 4;
                        }
                    });
                    this.clear();
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            clear() {
                this.logData.unshift({log: `清空包裹 ${this.package.package_number} 已扫描信息`});
                this.shipping_number = '';
                this.validate = false;
                this.tableData = [];
                this.message = '';
                this.status = 5;
                this.packageNumber = false;
                this.$nextTick(() => {
                    this.package_number = '';
                    this.$refs.sku.inputSelect();
                    if (this.package.package_number) {
                        this.package = {};
                    }
                });
            },
            row_class(row, index) {// 打印进度class
                return row.class || '';
            }
        },
        filters: {
            statusFilter(val) {
                switch (val) {
                    case 1:
                        return `未复核`;
                        break;
                    case 2:
                        return `已复核`;
                        break;
                    case 3:
                        return `已打印`;
                        break;
                    case 4:
                        return `异常`;
                        break;
                }
            },
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
        },
        computed: {
            ...mapGetters({audioToken: 'audio/token'}),
            packageStatusData() {
                switch (this.status) {
                    case 1:
                        return this.packageData.filter(res => res.status === 1);
                    case 5:
                        return this.packageData.filter(res => res.status !== 1);
                }
            },
            submitTitle() {
                if (this.tableData.length > 0) {
                    return `扫描SKU：`;
                } else {
                    return `扫描面单号：`;
                }

            }
        },
        beforeDestroy() {
            if (this.timer) {
                clearInterval(this.timer)
                this.timer = null
            }
        },
        components: {
            /*requestInput: require('@/global-components/request-input').default,
            requestLabelItem: require('@/components/request-lable-item.vue').default,*/
            labelItem: require('@/components/label-item.vue').default,
            selectPrinter: require('@/components/select-printer.vue').default,
        }
    }
</script>
