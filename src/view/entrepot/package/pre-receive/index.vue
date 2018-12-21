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
                    <request-button req-key="api_ready_receive" type="default"
                                    size="mini" class="inline" @click.native="submit">保存
                    </request-button>
                    <el-button type="default" size="mini" class="inline ml-sm" @click.native="clear_data">清空</el-button>
                </div>
            </el-form>
        </el-card>
        <el-row class="mt-xs mb-xs">
            <span class="title">包裹预接收记录</span>
        </el-row>
        <el-card>
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
        </el-card>
        <ready-edit v-model="readyVisible"
                    @ready-edit="ready_edit"
                    :ready-info="readyInfo"
                    :ready-data="readyData"></ready-edit>
    </page>
</template>

<style lang="stylus">

</style>

<script>
    import {api_ready_receive, api_ready_receive_info, url_ready_receive_edit} from "@/api/ready-receive";
    import {api_warehous_local} from "@/api/entrepot-picking";
    import {mapGetters} from 'vuex';

    export default {
        permission: {
            url_ready_receive_edit,
        },
        data() {
            return {
                receiveForm: {
                    warehouse_id: '',
                    wareshoue_name: '',
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
            }
        },
        mounted() {
            this.init_warehouse();
        },
        filters: {
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
        },
        methods: {
            init_warehouse() {
                this.$http(api_warehous_local).then(res => {
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
            submit() {
                this.get_params();
                let data = clone(this.receiveForm);
                data.parcel_num = Number(data.parcel_num);
                if (this.requiredWeight && data.purchase_parcel_weight === '') {
                    this.$message({type: 'error', message: '请填写重量'});
                    this.$refs.weight.inputSelect();
                    this.$reqKey('api_ready_receive', false);
                    this.audio_play('重量错误');
                    return;
                }
                if (data.tracking_number.split('\n').length > 1) {
                    this.$message({type: 'error', message: '运单号输入有误'});
                    this.$reqKey('api_ready_receive', false);
                    this.audio_play('运单号错误');
                    return;
                }
                if (isNaN(data.parcel_num) || data.parcel_num < 1) {
                    this.$message({type: 'error', message: '包裹数量输入有误'});
                    this.$reqKey('api_ready_receive', false);
                    this.audio_play('数量错误');
                    return;
                }
                this.$refs.form.validate(valid => {
                    if (valid) {
                        this.$http(api_ready_receive, data).then(res => {
                            this.clear();
                            this.errorMessage = '';
                            this.index++;
                            this.$set(res.list, 'number', this.index);
                            this.receiveData.unshift(res.list);
                            this.receiveForm.purchase_parcel_weight = '';
                        }).catch(code => {
                            this.errorMessage = code.message || code;
                            this.clear();
                            this.audio_play('扫描错误');
                            this.$message({type: 'error', message: code.message || code});
                        }).finally(() => {
                            setTimeout(() => {
                                this.$reqKey('api_ready_receive', false);
                            }, 200);
                        });
                    } else {
                        this.audio_play('扫描错误');
                        this.$reqKey('api_ready_receive', false);
                        return false;
                    }
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
                })
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
        },
        components: {
            allowCreateSelect: require('@/components/allow-create-select.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
            readyEdit: require('./ready-edit.vue').default,
        }
    }
</script>
