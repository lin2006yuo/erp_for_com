<template>
    <div class="p-package-handling">
        <table class="right-table" cellpadding="0" cellspacing="0"
               style="border-top-right-radius:3px;border-top-left-radius:3px;border-bottom-left-radius:3px;">
            <tr>
                <td colspan="2"
                    style="background-color: #f5f7fa;border-top-right-radius:3px;border-top-left-radius:3px;">
                    <span>
                        <label-item label="面单号：" :labelWidth="100">
                            <el-input v-model="searchData.shipping_number"
                                      autofocus
                                      @focus="focus('shipping_number')"
                                      @keyup.enter.native="shipping_number_enter"
                                      ref="shipping_number"
                                      class="inline big-width">
                            </el-input>
                        </label-item>
                        <label-item label="异常原因：" v-if="!!searchData.exception_type_txt" class="ml-sm">
                            <span class="red warning-text">{{`${searchData.exception_type_txt}（${curShippingNumber}）`}}</span>
                        </label-item>
                        <span v-if="warning.shipping_number">
                            <i class="delete-icon"></i>
                            <span class="red tip">{{`${warning.shipping_number}（${curShippingNumber}）`}}</span>
                        </span>
                    </span>
                </td>
            </tr>
            <tr>
                <td>
                    <span class="inline t-right fl" style="width: 100px;line-height: 26px">
                        <el-checkbox v-model="checkPrint"></el-checkbox>
                        <span>包裹号：</span>
                    </span>
                    <el-input v-model="searchData.package_number"
                              ref="package_number"
                              :disabled="!checkPrint"
                              @keyup.enter.native="search_package"
                              style="width: 200px;"
                              class="inline">
                    </el-input>
                    <el-button :disabled="!canPrint"
                               type="primary"
                               style="vertical-align: middle"
                               size="mini"
                               @click="print(false)"
                               class="ml-mini">打印
                    </el-button>
                </td>
                <td>
                    <label-item label="邮寄方式：" :labelWidth="100">
                        <el-input v-model="searchData.shipping_name"
                                  disabled
                                  class="big-width">
                        </el-input>
                    </label-item>
                </td>
            </tr>
            <tr>
                <td>
                    <span class="inline t-right fl" style="width: 100px;line-height: 26px">
                        <span :class="{'error':(weight_abnormal||renew)}">预估重量(g)：</span>
                    </span>
                    <el-input v-model="searchData.estimated_weight"
                              ref="estimated_weight"
                              :disabled="(!weight_abnormal&&!renew)"
                              class="big-width inline">
                    </el-input>
                </td>
                <td>
                    <label-item label="重量(g)：" :labelWidth="100">
                        <el-input v-model="searchData.package_weight"
                                  disabled
                                  class="big-width">
                        </el-input>
                    </label-item>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="border-bottom-right-radius:3px;border-bottom-left-radius:3px;">
                    <label-item label="处理措施：" :labelWidth="100">
                        <div v-if="result === ''">
                            <!--<el-input v-model="searchData.measure"
                                      v-if="!input_show"
                                      disabled
                                      class="big-width">
                            </el-input>-->

                            <!--<div class="ml-lg">
                                <el-button type="primary"
                                           size="mini"
                                           v-for="(button, index) in handleButtons"
                                           :key="index"
                                           @click="button.click">
                                    {{button.title}}
                                </el-button>
                            </div>-->
                            <handle-buttons :handle-buttons="handleButtonsTwo"></handle-buttons>
                        </div>
                        <span v-else>{{result}}</span>
                    </label-item>
                </td>
            </tr>
        </table>
    </div>
</template>
<style lang="stylus">
    .p-package-handling {
        .warning-text {
            font-size: 2rem !important;
        }
        .tip {
            font-size: 16px !important;
            vertical-align: middle;
        }
        .right-table {
            width: 100%;
            border-left: 1px solid #d3dce6;
            border-top: 1px solid #d3dce6;
            td {
                border-bottom: 1px solid #d3dce6;
                border-right: 1px solid #d3dce6;
                height: 33px;
            }
        }
        .big-width {
            width: 250px;
        }
    }
</style>
<script>
    import {http} from "@/lib/http-plus";
    import {
        api_package_handle,
        api_estimated_weight,
        api_reset_package,
        api_print_packagenum,
        api_renew_package,
        api_self_package,
        api_get_infom,
        api_call_package,
        api_continue_package,
        api_change_shipping_package
    } from '@/api/package-handling'
    import {mapGetters, mapActions} from 'vuex';

    export default {
        data() {
            return {
                checkPrint: false,
                searchData: {
                    package_number: '',
                    shipping_number: '',
                    package_weight: '',
                    estimated_weight: '',
                    status_txt: '',
                    exception_type: '',
                    shipping_name: '',
                    measure: '',
                    sku: []
                },
                warning: {
                    shipping_number: ''
                },
                packageData: {},
                token: '',
                result: '',
                curShippingNumber: '',
                handleButtonsTwo: [],
            }
        },
        mounted() {

        },
        methods: {
            init() {
                this.$emit('init-data', this.searchData);
            },
            modify_weight() {
                this.trim_search();
                let data = {
                    estimated_weight: this.searchData.estimated_weight
                };
                this.$confirm(`您将修改包裹${this.searchData.shipping_number}的预估重量,确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_estimated_weight, this.searchData.package_id, data).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.searchData.measure = '重新集包';
                        this.$emit('pack-data', this.searchData);
                        this.init();
                        this.clear(this.searchData);
                        this.clean_shipping_number();
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            invalid() {
                this.trim_search();
                this.$confirm(`您将重返上架包裹${this.searchData.shipping_number},确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_reset_package, this.searchData.package_id).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.searchData.measure = '重返上架';
                        this.$emit('pack-data', this.searchData);
                        this.init();
                        this.clear(this.searchData);
                        this.clean_shipping_number();
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            renew_package() {
                this.trim_search();
                this.$confirm(`您将重新集包${this.searchData.shipping_number},确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_renew_package, this.searchData.package_id).then(res => {
                        console.log("test:", res);
                        this.$message({type: "success", message: res.message || res});
                        this.searchData.measure = '重新集包';
                        this.$emit('pack-data', this.searchData);
                        this.init();
                        this.clear(this.searchData);
                        this.clean_shipping_number();
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            self_package() {
                this.trim_search();
                this.$confirm(`您将自我生成集包${this.searchData.shipping_number},确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {id: [this.searchData.package_id]};
                    this.$http(api_self_package, data).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.searchData.measure = '自我生成集包';
                        this.$emit('pack-data', this.searchData);
                        this.init();
                        this.clear(this.searchData);
                        this.clean_shipping_number();
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            clear(data) {
                Object.keys(data).forEach(key => {
                    if (typeof data[key] === 'object') {
                        data[key].length = 0;
                    } else {
                        data[key] = "";
                    }
                });
                this.handleButtonsTwo = [];
            },
            shipping_number_enter() {
                typeof this.searchData.shipping_number === 'string' && (this.searchData.shipping_number = this.searchData.shipping_number.trim());
                if (this.searchData.shipping_number !== '') {
                    this.curShippingNumber = this.searchData.shipping_number;
                }
                this.warning.shipping_number = '';
                this.$http(api_package_handle, {shipping_number: this.searchData.shipping_number}).then(res => {
                    this.searchData = res;
                    this.result = res.result || '';
                    //TODO:修改部分
                    /*if (this.searchData.exception_type === 4) {
                        this.re_print();
                    }*/
                    if (this.result === '') {
                        this.init();
                        this.handle_buttons(res.method);//初始化处理按钮
                        if (this.weight_abnormal) {
                            this.$nextTick(() => {
                                this.$refs.estimated_weight.$refs.input.select();
                            });
                        }
                    } else {
                        this.init();
                        this.searchData.measure = '已处理';
                        this.$emit('pack-data', window.clone(this.searchData));
                        this.clear(this.searchData);
                        this.clean_shipping_number();
                    }
                }).catch(code => {
                    this.warning.shipping_number = code.message;
                    this.searchData.package_weight = '';
                    this.searchData.estimated_weight = '';
                    this.searchData.status_txt = '';
                    this.searchData.exception_type = '';
                    this.searchData.shipping_name = '';
                    this.searchData.measure = '';
                    this.searchData.exception_type_txt = '';
                    this.result = '';
                    this.init();
                    this.clean_shipping_number();
                });
            },
            focus(item) {
                this.$refs[item].$refs.input.select();
            },
            ...mapActions({
                set_printerList: 'api/set_printerList'
            }),
            print(flag) {
                this.trim_search();
                let type = [];
                let content = '';
                let numberList = [];
                this.$http(api_print_packagenum, {package_number: this.searchData.package_number}).then(res => {
                    res.file_list.forEach(row => {
                        content = row.file;
                        type = row.type;
                    });
                    numberList = res.identification;
                    let data = {
                        Type: type,
                        Token: this.token,
                        Width: 100,
                        Height: 100,
                        Url: config.apiHost + res.callback,
                        PrintName: this.printer,
                        NumberList: numberList,
                        content: content,
                    };
                    data.Width = res.width;
                    data.Height = res.height;
                    console.log('打印');
                    console.log('printer params', this.printer, data, res);
                    if (!!flag) {
                        let res = this.$printer(this.printer, data);
                        console.log('printer result', res);
                        if (!!res) {
                            res.then(rs => {
                                if (rs) {
                                    this.$http(api_call_package, {package_id: this.searchData.package_id}).then(res => {
                                        this.searchData.measure = '已处理';
                                        console.log('打印回调', res);
                                        this.$emit('pack-data', this.searchData);
                                        this.init();
                                        this.clear(this.searchData);
                                        this.clean_shipping_number();
                                    }).catch(code => {
                                        this.$message({type: "error", message: code.message || code});
                                    });
                                } else {
                                    this.$message({type: "error", message: '打印失败'});
                                }
                            })
                        }
                    } else {
                        this.$printer(this.printer, data);
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            search_package() {
                typeof this.searchData.package_number === 'string' && (this.searchData.package_number = this.searchData.package_number.trim());
                this.$http(api_get_infom, {package_number: this.searchData.package_number}).then(res => {
                    Object.assign(this.searchData, res);
                }).catch(code => {
                    this.warning.shipping_number = code.message;
                    this.searchData.package_weight = '';
                    this.searchData.estimated_weight = '';
                    this.searchData.status_txt = '';
                    this.searchData.exception_type = '';
                    this.searchData.shipping_name = '';
                    this.searchData.measure = '';
                    this.searchData.exception_type_txt = '';
                    this.init();
                    this.clean_shipping_number();
                });
            },
            reorder() {
                this.trim_search();
                this.$confirm(`您将继续下单包裹${this.searchData.shipping_number},确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_continue_package, {package_id: this.searchData.package_id}).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.searchData.measure = '继续下单';
                        this.$emit('pack-data', this.searchData);
                        this.init();
                        this.clear(this.searchData);
                        this.clean_shipping_number();
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
                //api_continue_package
            },
            logistics_mode() {
                this.trim_search();
                this.$confirm(`您将更改包裹${this.searchData.shipping_number}物流方式,确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_change_shipping_package, {package_id: this.searchData.package_id}).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.searchData.measure = '更改物流方式';
                        this.$emit('pack-data', this.searchData);
                        this.init();
                        this.clear(this.searchData);
                        this.clean_shipping_number();
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
                //api_change_shipping_package
            },
            clean_shipping_number() {
                this.searchData.shipping_number = '';
                this.$refs.shipping_number.$refs.input.select();
            },
            re_print() {
                this.print(true);
            },
            trim_search() {
                Object.keys(this.searchData).forEach(key => {
                    if (typeof this.searchData[key] === 'string') {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
            },
            //TODO:修改部分
            handle_buttons(res) {
                res.forEach(button => {
                    // action
                    button.handle = () => {
                        this.handle(button);
                    };
                    if(button.type === 'auto_print') {
                        button.handle();
                    }
                });
                this.handleButtonsTwo = res;
            },
            handle(button) {
                button.param && Object.keys(button.param).forEach(key => {
                    if (Number(button.param[key]) === 0) {
                        button.param[key] = this.searchData[key] || 0;
                    }
                });
                this.trim_search();
                if(button.type.includes("print")) {
                    this.get_print(button);
                    return;
                }
                this.$confirm(`您将对包裹${this.searchData.shipping_number}做${button.title}操作,确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(http(button.url, button.param)).then(res => {
                        this.$message({type: "success", message: res.message || res});
                        this.searchData.measure = button.title;
                        this.$emit('pack-data', this.searchData);
                        this.init();
                        this.clear(this.searchData);
                        this.clean_shipping_number();
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });

            },
            get_print(button) {
                this.trim_search();
                let type = [];
                let content = '';
                let numberList = [];
                this.$http(http(button.url)).then(res => {
                    res.file_list.forEach(row => {
                        content = row.file;
                        type = row.type;
                    });
                    numberList = res.identification;
                    let data = {
                        Type: type,
                        Token: this.token,
                        Width: 100,
                        Height: 100,
                        Url: config.apiHost + res.callback,
                        PrintName: this.printer,
                        NumberList: numberList,
                        content: content,
                    };
                    data.Width = res.width;
                    data.Height = res.height;
                    console.log('打印');
                    let printRes = this.$printer(this.printer, data);
                    if (!!button.callback && !!printRes) {
                        printRes.then(result => {
                            if (result) {
                                this.$http(http(button.callback, button.callback_param)).then(res => {
                                    this.searchData.measure = button.title;
                                    this.$emit('pack-data', this.searchData);
                                    this.init();
                                    this.clear(this.searchData);
                                    this.clean_shipping_number();
                                }).catch(code => {
                                    this.$message({type: "error", message: code.message || code});
                                });
                            } else {
                                this.$message({type: "error", message: '打印失败'});
                            }
                        })
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
        },
        computed: {
            // ...mapGetters({
            //     'printer':'api/getPrinter'
            // }),
            handleButtons() {
                let handleButtons = [];
                switch (this.searchData.exception_type) {
                    case 1:
                        handleButtons = [{
                            click: this.invalid,
                            title: '重返上架'
                        }, {
                            click: this.modify_weight,
                            title: '修改预估重量'
                        }];
                        break;
                    case 2:
                    case 3:
                    case 4:
                        break;
                    case 5:
                        handleButtons = [{
                            click: this.reorder,
                            title: '继续下单'
                        }, {
                            click: this.logistics_mode,
                            title: '更改物流方式'
                        }];
                        break;
                    case 6:
                        break;
                    case 7:
                        handleButtons = [{
                            click: this.invalid,
                            title: '重返上架'
                        }];
                        break;
                    case 8:
                        handleButtons = [{
                            click: this.invalid,
                            title: '重返上架'
                        }, {
                            click: this.self_package,
                            title: '自我生成集包信息'
                        }];
                        break;
                    case 9:
                        handleButtons = [{
                            click: this.invalid,
                            title: '重返上架'
                        }, {
                            click: this.logistics_mode,
                            title: '更改物流方式'
                        }];
                        break;
                    case 10:
                        handleButtons = [{
                            click: this.invalid,
                            title: '重返上架'
                        }, {
                            click: this.re_print,
                            title: '重打面单'
                        }];
                        break;
                }
                return handleButtons;
            },

            input_show() {
                return this.searchData.exception_type !== 1 || this.searchData.exception_type !== 5;
            },
            weight_abnormal() {
                return this.searchData.exception_type === 1;
            },
            package_failure() {
                return this.searchData.exception_type === 5;
            },
            area_not_arrive() {
                return this.searchData.exception_type === 7;
            },
            renew() {
                return this.searchData.exception_type === 8;
            },
            canPrint() {
                return this.searchData.package_number !== '' && this.searchData.shipping_name !== '';
            },
            carrir_stop() {
                return this.searchData.exception_type === 9;
            },
        },
        watch: {
            checkPrint(val) {
                if (val) {
                    this.clear(this.searchData);
                    this.init();
                }
            },
            /*'searchData.shipping_number'(val) {
                if(val === '') {
                    return;
                }
                this.curShippingNumber = val;
            }*/
        },
        props: {
            printer: {}
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            handleButtons: require('./handle-buttons.vue').default,
        },
    }
</script>
