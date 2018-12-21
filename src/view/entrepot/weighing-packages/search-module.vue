<template>
    <div class="p-weighing-packages">
        <el-card>
            <el-form ref="form" :model="searchData" label-width="80px">
                <el-form-item label="面单号：">
                    <el-input v-model="searchData.shipping_number"
                              autofocus
                              :disabled="isSetWeight"
                              ref="shipping_number"
                              @focus="focus('shipping_number')"
                              @keyup.enter.native="shipping_number_enter"
                              class="width-lg inline">
                    </el-input>
                    <span v-if="warning.shipping_number">
                        <i class="delete-icon"></i>
                        <span class="red tip">{{warning.shipping_number}}</span>
                    </span>
                    <span v-if="warning.success">
                        <i class="el-icon-circle-check"></i>
                    </span>
                </el-form-item>
                <el-form-item label="截取长度" label-width="80px">
                    <el-checkbox class="" slot="label" v-model="filterShippingNumber">截取长度：</el-checkbox>
                    <el-input type="number" class="width-md" v-model="beginInterceptNum" :min="0"
                              :disabled="!filterShippingNumber">
                        <span slot="prepend">前</span>
                    </el-input>
                    <label>--</label>
                    <el-input type="number" class="width-md" :min="0" v-model="endInterceptNum"
                              :disabled="!filterShippingNumber">
                        <span slot="prepend">后</span>
                    </el-input>
                    <span class="ml-sm">
                        物流商自定义编号，用于截掉面单号前或后对应长度字符
                    </span>
                </el-form-item>
                <el-form-item label="重量：">
                    <el-checkbox class="" slot="label" v-model="hasWeight">重量：</el-checkbox>
                    <scan-input
                            v-model="searchData.package_weight"
                            ref="package_weight"
                            @change="isRead=false"
                            @enter="submitWeight"
                            :readonly="lockPackageWeight"
                            :icon="packageWeightIcon"
                            append="克(G)"
                            class="width-lg">
                    </scan-input>
                    <span v-if="warning.package_weight">
                        <i class="delete-icon"></i>
                        <span class="red tip">{{warning.package_weight}}</span>
                    </span>
                    <span v-else class="ml-sm">是否必须称重</span>
                </el-form-item>
                <el-form-item label="称重方式：">
                    <el-select v-model="weighingStyle" class="inline width-xs" @change="weighing_change">
                        <el-option v-for="item in weighingList"
                                   :value="item.value"
                                   :label="item.label"
                                   :key="item.value"></el-option>
                    </el-select>
                    <label-item label="传送带默认方向：" v-if="weighingStyle === 'whole'" class="ml-lg font-18">
                        <el-radio-group v-model="defaultDir" class="inline ml-sm">
                            <el-radio :label="1">左</el-radio>
                            <el-radio :label="2">右</el-radio>
                        </el-radio-group>
                    </label-item>
                </el-form-item>

            </el-form>
            <alert-message v-model="showMessage" @show="clearFocus" @hidden="focus('shipping_number')"
                           :text="warning.shipping_number" :timeout="3"></alert-message>
            <input type="text" hidden ref="notInput">
        </el-card>
    </div>
</template>
<style lang="stylus">
    .p-weighing-packages {
        .tip {
            font-size: 16px !important;
            vertical-align: middle;
        }
        .blue {
            color: #1D8CE0;
        }
        .el-icon-circle-check {
            vertical-align: middle;
            color: #13CE66;
        }
        .is-whole-enter {
            .el-checkbox__label {
                font-size: 1.8rem;
            }
        }
    }
</style>
<script>
    import {api_save_collection} from '@/api/weighing-packages';

    export default {
        activated() {//当切换到当前页面时触发这个回调。
            this.$refs.package_weight.focus();
            let component = this;
            document.onkeydown = function (event) {
                let e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode === 113) { // 按 F2
                    component.onkeyF2();
                }
            };
            // this.try_serial_port();
        },
        deactivated() {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
        },
        data() {
            return {
                filterShippingNumber: false,
                beginInterceptNum: 0,
                endInterceptNum: 0,
                showMessage: false,
                searchData: {
                    shipping_number: '',
                    package_weight: '',
                },
                paramsData: {
                    shipping_number: '',
                    package_weight: '',
                },
                typeList: [],
                warning: {
                    package_weight: '',
                    shipping_number: '',
                    success: false,
                },
                lockPackageWeight: false,
                isSerialPortLink: false,
                SerialIp: '172.18.8.33',
                last_input_time: 0,
                SerialPort: 10093,
                SerialRate: 500,
                SerialRates: [200, 500, 1000, 1500, 2000, 3000, 5000],
                //如果上次请求还没有完成不进行下次请求
                isRead: false,
                hasWeight: true,
                isSetWeight: this.value,
                defaultDir: 2,//默认放向为右
                weighingStyle: 'usb',
                weighingList: [
                    {value: 'usb', label: 'USB接口'},
                    {value: 'websocket', label: '串口接口'},
                    {value: 'whole', label: '一体秤'}
                ],
                timer: null,
            }
        },
        created() {
            let component = this;
            document.onkeydown = function (event) {
                let e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode === 113) { // 按 F2
                    component.onkeyF2();
                }
            };
        },
        mounted() {
            /*setTimeout(() => {
                localWebSocket({
                    message: ({data}) => {
                        data = JSON.parse(data);
                        if (data.status === 1) {
                            this.searchData.package_weight = data.direct_results;
                            this.trim_params();
                            if (this.paramsData.shipping_number !== '') {
                                this.init();
                            }
                        }
                    }
                });
            }, 2000);*/
        },
        methods: {
            init() {
                this.isRead = true;
                this.changeShipping();
                this.$emit('init-data', this.paramsData);
            },
            clearFocus() {
                setTimeout(() => {
                    this.$refs.notInput.focus();
                }, 300);
            },
            websocket_weighing() {//串口称重
                let serial = () => {
                    let data = {
                        route: 'weigh-setting-params',
                        id: Date.now(),
                        package_id: Date.now(),
                        sendmode: 2,
                    };
                    local_websocket.sendRequest(data, (result) => {
                        if (result.status === 1) {
                            this.searchData.package_weight = result.direct_results;
                            if (this.searchData.shipping_number !== '') {
                                this.submitWeight();
                            }
                        } else {
                            this.$message({type: 'error', message: result.message});
                        }
                    });
                };
                if (local_websocket && local_websocket.IsOpen) {
                    serial();
                } else {
                    localWebSocket({
                        open: () => {
                            local_websocket.connected();
                            serial();
                        },
                        error: () => {
                            local_websocket.closed();
                            //this.pollingWeight();
                        }
                    })
                }
            },
            shipping_number_enter() {
                this.trim_params();
                this.$emit('time-start', Number(new Date().getTime()));
                if (!this.getParamsData()) return;// 过滤面单号
                //一体秤逻辑
                if (this.weighingStyle === 'whole') {
                    if (whole_websocket && whole_websocket.IsOpen === true) return;
                    let shipping = this.paramsData.shipping_number.split(',');
                    if (shipping.length === 2) {
                        this.searchData.shipping_number = shipping[0];
                        this.searchData.package_weight = shipping[1];
                        this.isSetWeight = true;
                        this.submitWeight();
                        return;
                    }
                }
                let shipping_number = this.paramsData.shipping_number;
                let package_weight = this.paramsData.package_weight;
                if(shipping_number === '') {
                    this.$message({type: 'error', message: '请输入面单号'});
                    return;
                }
                if(this.hasWeight) {//必须称重
                    if(package_weight !== '') {
                        this.init();
                    } else {
                        if(this.weighingStyle === 'usb') {
                            this.$refs.package_weight.select();
                        } else if(this.weighingStyle === 'websocket') {
                            this.websocket_weighing();
                        }
                    }
                } else {
                    this.init();
                }

                /*if (package_weight.trim()) {
                    this.$emit('init-data', this.paramsData);
                    return;
                } else {
                    this.$refs.package_weight.select();
                    return;
                }
                if (shipping_number !== '') {
                    if (this.hasWeight) {//称重
                        this.$emit('weighing', this.paramsData.shipping_number);
                    } else {// 无需称重
                        this.$emit('init-data', this.paramsData);
                    }
                }*/
            },
            trim_params() {
                this.searchData.shipping_number = this.searchData.shipping_number.trim();
                this.searchData.package_weight = this.searchData.package_weight.trim();
            },
            onkeyF2() {
                this.$refs.package_weight.select();
            },
            focus(item) {
                this.$refs[item].$refs.input.select();
            },
            submitWeight() {
                try {
                    this.trim_params();
                    if (!this.getParamsData()) return;
                    if (!this.paramsData.package_weight
                        || isNaN(Number(this.paramsData.package_weight))
                    ) {
                        console.error('重量提交', this.paramsData.package_weight, isNaN(Number(this.paramsData.package_weight)));
                        return this.$refs.package_weight.select();
                    }
                    if (!this.paramsData.shipping_number) {
                        return this.$refs.shipping_number.inputSelect();
                    }
                    if (this.paramsData.package_weight && this.paramsData.shipping_number) {
                        this.init();
                    }
                } catch (code) {
                    this.$message({type: 'error', message: `称重集包 ${code.message || code}`});
                }
            },
            getParamsData() { // 根据是否过滤面单号确定请求参数
                let shipping_number = this.searchData.shipping_number;
                if (this.filterShippingNumber) {
                    shipping_number = this.intercept();
                    if (!shipping_number) return false;
                }
                Object.assign(this.paramsData, this.searchData, {shipping_number: shipping_number});
                return true;
            },
            intercept() { // 过滤面单号
                console.log('intercept', this.beginInterceptNum, this.endInterceptNum, this.searchData.shipping_number.length);
                this.beginInterceptNum = Number(this.beginInterceptNum);
                this.endInterceptNum = Number(this.endInterceptNum);
                if (isNaN(this.beginInterceptNum) || isNaN(this.endInterceptNum)) {
                    this.$message({
                        type: 'error',
                        message: '截去长度必须为数字，请重新设置截去长度'
                    });
                    this.clearIntercept();
                    return false;
                }
                if (this.beginInterceptNum + this.endInterceptNum >= this.searchData.shipping_number.length) {
                    this.$message({
                        type: 'error',
                        message: '截去长度超过限制，请重新设置截去长度'
                    });
                    this.clearIntercept();
                    return false;
                } else {
                    let shipping_number = this.searchData.shipping_number;
                    return shipping_number.slice(this.beginInterceptNum, shipping_number.length - this.endInterceptNum);
                }
            },
            clearIntercept() {
                this.beginInterceptNum = 0;
                this.endInterceptNum = 0;
            },
            changeShipping() {
                this.warning.package_weight = '';
                this.warning.shipping_number = '';
                this.warning.success = false;
            },
            weighing_change(val) {
                this.$emit('weighing-change', val);
                switch (val) {
                    case 'websocket':
                        this.websocket_weighing();
                        break;
                    case 'whole':
                        wholeWebSocket({
                            message: ({data}) => {
                                this.whole_weighing(data);
                            }
                        });
                        break;
                }
            },
            whole_weighing(data) {//一体机称重
                if (!this.isSetWeight) {
                    let shipping = data.split(',');
                    if (shipping.length === 2) {
                        this.searchData.shipping_number = shipping[0];
                        this.searchData.package_weight = shipping[1];
                        this.isSetWeight = true;
                        this.submitWeight();
                    }
                }
            },
            pollingWeight() {//串口http轮询称重
                let id = this.searchData.shipping_number;
                let req = new Request('http://localhost:10093/setPackageinfo', {
                    method: 'post',
                    mode: 'cors',
                    headers: {"Content-Type": 'application/x-www-form-urlencoded'},
                    body: obj2url({'ID': id, 'CallBack': 'xxx'})
                });
                this.fetch_local(req).then(local => {
                    this.set_timer();
                });
            },
            fetch_local(req) { // 开启串口并绑定id
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
            set_timer() { // 打印机轮询请求
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
                            if (Number(res.status) === 1) {
                                clearInterval(this.timer);
                                this.timer = null;
                                this.searchData.package_weight = res.directResults;
                                this.submitWeight(); // 称重称自带回车，不用这边触发
                            }
                        }).catch(code => {
                            this.$message({type: "error", message: code.message || code})
                        })
                    }, 1000)
                }
                this.fetch_local(req).then(res => {
                    if (Number(res.status) === 1) {
                        clearInterval(this.timer);
                        this.timer = null;
                        this.searchData.package_weight = res.directResults;
                        this.submitWeight(); // 称重称自带回车，不用这边触发
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })
            },
        },
        computed: {
            isEmpty() {
                return this.searchData.shipping_number !== '' && this.searchData.package_weight !== '';
            },
            packageWeightIcon() {
                if (this.lockPackageWeight) {
                    if (this.isRead) {
                        return '';
                    } else {
                        return 'loading'
                    }
                } else {
                    return '';
                }
            }
        },
        watch: {
            lockPackageWeight(val) {
                if (val) {
                    this.try_serial_port();
                }
            },
            'warning.shipping_number'(val) {
                if (val) {
                    this.showMessage = true;
                }
            },
            isSetWeight(val) {
                this.$emit('input', val)
            },
            defaultDir(val) {
                this.$emit('dir-change', val);
            },
            value(val) {
                this.isSetWeight = val;
            }
        },
        props: {
            collection: {},
            shipping_id: {},
            package_collection_number: {},
            value: {},
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            scanInput: require('@/components/scan-input').default,
            alertMessage: require('@/components/alert-message').default,
        },
    }
</script>
