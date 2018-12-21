<template>
    <page-dialog class="c-apply-stock-in" v-model="visible" @open="open" @close="close" title="申请借调库存">
        <el-form :model="form" label-width="80px" :show-message="true" :rules="rules" ref="applyForm">
            <el-row>
                <el-col :span="14">
                    <el-form-item label="调出平台：" class="inline">
                        {{stockInInfo.channel_name}}
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item class="inline" label="调入平台：" prop="to_channel_id">
                        <el-select v-model="form.to_channel_id" class="s-width-default">
                            <el-option v-for="channel in channelList"
                                       :value="channel.value"
                                       :label="channel.label"
                                       :disabled="channel.disabled"
                                       :key="channel.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="14">
                    <el-form-item label="借调数量：" prop="quantity" class="inline">
                        <integer-input :min="0"
                                       class="inline width-mini"
                                       placeholder="请输入借调数量"
                                       v-model="form.quantity">
                        </integer-input>
                        <span class="ml-sm blue">
                            <span class="bold-font">{{stockInInfo.channel_name}}</span>
                            可用库存
                            <span class="bold-font">{{available_quantity}}</span>
                        </span>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="审批人：" class="inline" prop="audit_id">
                        <el-select v-model="form.audit_id" filterable clearable class="s-width-default">
                            <el-option v-for="item in auditorList"
                                       :value="item.value"
                                       :label="item.label"
                                       :key="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item label="借调原因：" prop="remark">
                    <el-input type="textarea" v-model="form.remark" placeholder="请填写借调原因"></el-input>
                </el-form-item>
            </el-row>
        </el-form>
        <div slot="footer">
            <permission tag="requestButton" req-key="applyStockIn" :route="apis.url_third_allocate"
                        @click="sure">
                提交
            </permission>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .c-apply-stock-in {
        .blue {
            color: #69f;
        }
    }
</style>
<script>
    import {
        api_third_allocate,
        api_third_apply_allocate_in,
        url_third_allocate,
    } from "@/api/overseas-stock";
    import {api_get_channel} from '@/api/request-note';
    import {api_auditor_by_channel} from "@/api/warehouse-goods-channel";

    export default {
        permission: {
            url_third_allocate,
        },
        data() {
            return {
                visible: false,
                form: {
                    from_channel_id: '',
                    to_channel_id: '',
                    quantity: '',
                    audit_id: '',
                    remark: ''
                },
                rules: {
                    to_channel_id: [
                        {type: 'number', required: true, message: '请选择调入平台', trigger: 'blur'},
                    ],
                    quantity: [
                        {required: true, message: '请输入借调数量', trigger: 'blur'},
                    ],
                    audit_id: [
                        {type: 'number', required: true, message: '请选择审核人', trigger: 'blur'},
                    ],
                    remark: [
                        {required: true, message: '请填写借调原因', trigger: 'blur'},
                    ],
                },
                available_quantity: 0,
                channelList: [],
                auditorList: {},
            }
        },
        methods: {
            open() {
                this.init_channel();
                this.init_auditor();
                this.init();

            },
            init_channel() {
                this.$http(api_get_channel).then(res => {
                    res.forEach(row => {
                        if (row.value === this.stockInInfo.channel_id) {
                            this.$set(row, 'disabled', true);
                        } else {
                            this.$set(row, 'disabled', false);
                        }
                    });
                    this.channelList = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            init_auditor() {
                this.$http(api_auditor_by_channel, {channel_id: this.stockInInfo.channel_id}).then(res => {
                    this.auditorList = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            init() {
                let params = {
                    warehouse_id: this.stockInInfo.warehouse_id,
                    sku_id: this.stockInInfo.sku_id,
                    channel_id: this.stockInInfo.channel_id,
                };
                this.$http(api_third_apply_allocate_in, params).then(res => {
                    this.available_quantity = res.quantity;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            sure() {
                let params = this.get_params();
                this.$refs.applyForm.validate(valid => {
                    if (valid) {
                        if (Number(params.quantity) > this.available_quantity || Number(params.quantity) === 0) {
                            this.$reqKey('applyStockIn', false);
                            return this.$message({type: 'error', message: '请输入有效的调入数量'});
                        }
                        this.$http(api_third_allocate, params).then(res => {
                            this.$message({type: 'success', message: res.message || res});
                            this.visible = false;
                        }).catch(code => {
                            this.$message({type: 'error', message: code.message || code});
                        }).finally(() => {
                            setTimeout(() => {
                                this.$reqKey('applyStockIn', false);
                            }, 200);
                        });
                    } else {
                        this.$reqKey('applyStockIn', false);
                        return false;
                    }
                })
            },
            get_params() {
                Object.keys(this.form).forEach(key => {
                    if (typeof this.form[key] === 'string') {
                        this.form[key] = this.form[key].trim();
                    }
                });
                this.form.from_channel_id = this.stockInInfo.channel_id;
                let params = Object.assign({}, this.form, {
                    warehouse_id: this.stockInInfo.warehouse_id,
                    sku_id: this.stockInInfo.sku_id,
                    sku: this.stockInInfo.sku,
                });
                return params;
            },
            close() {
                Object.keys(this.form).forEach(key => {
                    this.form[key] = '';
                });
                this.available_quantity = 0;
                this.channelList = [];
                this.auditorList = [];
                this.$emit('close', this.stockInInfo.parent, this.stockInInfo.sku_id);
            }
        },
        watch: {
            value(val) {
                this.visible = val;
            },
            visible(val) {
                this.$emit('input', val);
            }
        },
        computed: {},
        props: {
            value: {},
            stockInInfo: {},
        },
        components: {
            requestButton: require('@/global-components/request-button.vue').default,
            pageDialog: require('@/components/page-dialog.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
        }
    }
</script>