<template>
    <page class="p-pre-receive">
        <el-card>
            <el-form ref="form" :model="receiveForm" :rules="rules" label-width="80px">
                <el-form-item label="仓库：" prop="warehouse_id">
                    <el-select v-model.number="receiveForm.warehouse_id"
                               @change="warehouse_change"
                               class="s-width-middle" filterable>
                        <el-option v-for="(item, index) in warehouseList"
                                   :label="item.name"
                                   :value="item.id"
                                   :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <div>
                    <el-form-item label="运输方式：" class="inline" prop="shipping_methods">
                        <allow-create-select class="s-width-middle"
                                             v-model="receiveForm.shipping_methods">
                        </allow-create-select>
                    </el-form-item>
                    <el-form-item label="包裹数：" class="inline ml-sm" prop="parcel_num">
                        <el-input-number v-model.number="receiveForm.parcel_num"
                                         class="width-lg"
                                         @keydown.native.enter="submit"
                                         :min="1"></el-input-number>
                        <!--<el-autocomplete
                                class="inline s-width-middle inline-input"
                                v-model="receiveForm.parcel_num"
                                @keydown.native.enter="search"
                                :fetch-suggestions="query_search"
                        ></el-autocomplete>-->
                    </el-form-item>
                </div>
                <el-form-item label="运单号：" prop="tracking_number">
                    <el-input v-model="receiveForm.tracking_number"
                              class="s-width-middle inline"
                              ref="tracking_number"
                              @keyup.enter.native="submit"></el-input>
                    <span class="inline ml-sm red" v-if="errorMessage">
                        {{errorMessage}}
                    </span>
                </el-form-item>
                <el-form-item label="重量：">
                    <el-checkbox slot="label" v-model="requiredWeight">重量：</el-checkbox>
                    <integer-input class="inline"
                                   ref="weight"
                                   :disabled="!requiredWeight"
                                   @keyup.enter.native="submit"
                                   v-model="receiveForm.purchase_parcel_weight" :min="0">
                    </integer-input>
                    <span>g</span>
                </el-form-item>
                <div style="margin-left: 80px">
                    <el-button type="primary"
                               size="mini" class="inline" @click.native="submit">保存
                    </el-button>
                    <el-button type="default" size="mini" class="inline ml-sm" @click.native="clear_data">清空</el-button>
                </div>
            </el-form>
        </el-card>
        <el-row class="mt-xs mb-xs">
            <span class="title">包裹预接收记录</span>
        </el-row>
        <el-row>
            <el-col :span="20">
                <el-table v-resize="{height: 40}" class="scroll-bar"
                          :data="receiveData"
                          :row-key="row_key"
                          border
                          highlight-current-row>
                    <el-table-column prop="number"
                                     label="排序">
                    </el-table-column>
                    <el-table-column inline-template
                                     label="运输方式">
                        <div>{{row.shipping_methods}}</div>
                    </el-table-column>
                    <el-table-column inline-template
                                     label="运单号">
                        <div>{{row.tracking_number}}</div>
                    </el-table-column>
                    <el-table-column inline-template
                                     label="包裹数">
                        <div>{{row.parcel_num}}</div>
                    </el-table-column>
                    <el-table-column inline-template
                                     label="重量（g）">
                        <div>{{row.purchase_parcel_weight}}</div>
                    </el-table-column>
                    <el-table-column inline-template
                                     label="预接收员">
                        <div>{{row.receive_user_name}}</div>
                    </el-table-column>
                    <el-table-column inline-template
                                     label="预接收时间">
                        <div>{{row.ready_receive_time | filterTime}}</div>
                    </el-table-column>
                    <el-table-column inline-template
                                     label="操作">
                        <div>
                            <permission tag="span" :route="apis.url_ready_receive_edit"
                                        class="operate" @click="edit(row)">
                                修改
                            </permission>
                        </div>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col :span="4" class="fl-clear">
                <el-table v-resize="{height: 40}" class="scroll-bar cache-receive fr mr-sm"
                          :data="requestCacheQueue"
                          border
                          :row-class-name="row_class"
                          highlight-current-row>
                    <el-table-column type="index" width="60"></el-table-column>
                    <el-table-column label="已扫运单号" inline-template>
                        <div>{{row.tracking_number}}</div>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <ready-edit v-model="readyVisible"
                    @ready-edit="ready_edit"
                    :ready-info="readyInfo"
                    :ready-data="readyData"></ready-edit>
    </page>
</template>

<style lang="stylus">
    .p-pre-receive {
        .failed {
            background: #CC0033;
        }
        .cur {
            background: #99CC33;
        }
        .cache-receive {
            width: 88%;
        }
    }
</style>

<script>
    import {api_ready_receive, api_ready_receive_info, url_ready_receive_edit} from "@/api/ready-receive";
    import {api_get_warehouse_default} from "@/api/default-warehouse-show";
    import {mapGetters} from 'vuex';

    export default {
        permission: {
            url_ready_receive_edit,
        },
        data() {
            return {
                receiveForm: {
                    warehouse_id: '',
                    warehouse_name: '',
                    shipping_methods: '',
                    tracking_number: '',
                    parcel_num: 1,
                    purchase_parcel_weight: ''
                },
                rules: {
                    warehouse_id: [
                        {required: true, message: '请选择仓库', trigger: 'change', type: 'number'},
                    ],
                    shipping_methods: [
                        {required: true, message: '请选择运输方式', trigger: 'change'}
                    ],
                    tracking_number: [
                        {required: true, message: '请填写运单号', trigger: 'blur'}
                    ],
                    parcel_num: [
                        {required: true, message: '请选择包裹数', trigger: 'blur', type: 'number'}
                    ]
                },
                warehouseList: [],
                receiveData: [],
                index: 0,
                readyInfo: {},
                readyData: {},
                readyVisible: false,
                requiredWeight: false,
                errorMessage: '',
                requestQueue: [],
                requestCacheQueue: [],
                canRequest: true,
            }
        },
        mounted() {
            this.requestQueue = JSON.parse(sessionStorage.getItem('requestQueue')) || [];
            this.requestCacheQueue = clone(this.requestQueue).map(row => {
                this.$set(row, 'failed', false);
                return row;
            });
            if (this.requestQueue.length > 0) {
                this.pre_receive();
            }
            this.init_warehouse();
        },
        filters: {
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
        },
        methods: {
            init_warehouse() {
                //获取本地仓包括中转仓
                let params = {
                    sign: 'local_transit'
                };
                this.$http(api_get_warehouse_default, params).then(res => {
                    this.warehouseList = res;
                    this.receiveForm.warehouse_id = this.warehouseList[0].id;
                    this.receiveForm.warehouse_name = this.warehouseList[0].name;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            row_key(row) {
                return row && row.tracking_number;
            },
            row_class(row, index) {
                if (row.failed) {
                    return 'failed';
                }
                if (this.curIndex !== -1 && this.curIndex === index) {
                    return 'cur';
                }
                return '';
            },
            submit() {
                let data = this.get_params();
                if (this.requiredWeight && data.purchase_parcel_weight === '') {
                    this.$message({type: 'error', message: '请填写重量'});
                    this.$refs.weight.inputSelect();
                    // this.$reqKey('api_ready_receive', false);
                    this.audio_play('扫描错误');
                    return;
                }
                /*if (data.tracking_number.split('\n').length > 1) {
                    this.$message({type: 'error', message: '运单号输入有误'});
                    // this.$reqKey('api_ready_receive', false);
                    this.audio_play('运单号错误');
                    return;
                }*/
                if (isNaN(data.parcel_num) || data.parcel_num < 1) {
                    this.$message({type: 'error', message: '包裹数量输入有误'});
                    // this.$reqKey('api_ready_receive', false);
                    this.audio_play('扫描错误');
                    return;
                }
                this.$refs.form.validate(valid => {
                    if (valid) {
                        this.receiveForm.purchase_parcel_weight = '';
                        this.requestQueue.unshift(data);
                        this.requestCacheQueue.unshift(Object.assign({}, data, {failed: false}));
                        this.change_request_queue();
                        this.pre_receive();
                    } else {
                        this.audio_play('扫描错误');
                        // this.$reqKey('api_ready_receive', false);
                    }
                });
                this.clear();
            },
            /* 队列改变 */
            change_request_queue() {
                let requestQueue = JSON.stringify(this.requestQueue);
                sessionStorage.setItem('requestQueue', requestQueue);
            },
            pre_receive() {//预接收
                // 是否在请求中
                if (!this.canRequest) return;

                // 获取请求参数
                let curParam = this.requestQueue.pop();
                if (!curParam) return;

                this.change_request_queue();

                if(this.curParam && this.curParam.tracking_number === curParam.tracking_number) {
                    // console.log(`xxxxxx:repeat`, this.curIndex);
                    this.requestCacheQueue.splice(this.curIndex, 1);
                    this.pre_receive();
                    return;
                } else {
                    this.curParam = curParam;
                }


                // 请求中
                this.canRequest = false;
                this.$http(api_ready_receive, this.curParam).then(res => {
                    // console.log(`xxxxxx:cuccess`, this.curIndex);
                    this.requestCacheQueue.splice(this.curIndex, 1);
                    this.errorMessage = '';
                    this.index++;
                    this.$set(res.list, 'number', this.index);
                    this.receiveData.unshift(res.list);
                    this.canRequest = true;
                    this.pre_receive();
                }).catch(code => {
                    // console.log(`xxxxxx:failed`, this.curIndex);
                    let queue = this.requestCacheQueue;
                    this.$set(queue[this.curIndex], 'failed', true);
                    this.errorMessage = code.message || code;
                    this.audio_play('扫描错误');
                    this.$message({type: 'error', message: code.message || code});
                    this.canRequest = true;
                    this.pre_receive();
                });
            },
            clear() {
                this.receiveForm.tracking_number = '';
                this.receiveForm.purchase_parcel_weight = '';
                this.$refs.tracking_number.inputSelect();
            },
            clear_data() {
                this.$refs.form.resetFields();
            },
            get_params() {
                Object.keys(this.receiveForm).forEach(key => {
                    if (typeof this.receiveForm[key] === 'string') {
                        this.receiveForm[key] = this.receiveForm[key].trim();
                    }
                });
                let data = clone(this.receiveForm);
                data.parcel_num = parseInt(data.parcel_num);
                return data;
            },
            edit(row) {
                let data = {
                    tracking_number: row.tracking_number,
                };
                this.$http(api_ready_receive_info, data).then(res => {
                    if (!isEmpty(res)) {
                        this.readyData = res;
                    }
                    this.readyInfo = {
                        title: `修改运单号：${data.tracking_number}信息`,
                        action: 'edit',
                    };
                    this.readyVisible = true;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            ready_edit(data) {
                this.receiveData.forEach(row => {
                    if (row.id === data.id) {
                        Object.assign(row, data);
                    }
                });
            },
            warehouse_change() {
                this.receiveForm.warehouse_name = this.warehouseList.find(row => row.id === this.receiveForm.warehouse_id).name;
            },
            audio_play(voice) {// 播报语音
                this.$audio(voice, this.audioToken);
            },
        },
        computed: {
            ...mapGetters({audioToken: 'audio/token'}),
            curIndex() {
                let index = this.requestCacheQueue.findIndex(row => !!row.failed);
                if (index !== -1) {
                    return index - 1;
                } else {
                    return this.requestCacheQueue.length - 1;
                }
            }
        },
        components: {
            allowCreateSelect: require('@/components/allow-create-select.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
            readyEdit: require('./ready-edit.vue').default,
        }
    }
</script>
