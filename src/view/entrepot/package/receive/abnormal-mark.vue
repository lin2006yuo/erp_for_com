<template>
    <page-dialog v-model="visible" @open="open" @close="close" :title="abnormalData.title">
        <el-form ref="form" :model="abnormalForm" :rules="rules" label-width="80px">
            <el-form-item label="仓库：" prop="warehouse_id">
                <el-select v-model.number="abnormalForm.warehouse_id"
                           @change="warehouse_change"
                           class="s-width-middle" filterable>
                    <el-option v-for="(item, index) in warehouseList"
                               :label="item.name"
                               :value="item.id"
                               :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="运输方式：" prop="shipping_methods">
                <el-row>
                    <el-col :span="6">
                        <allow-create-select class="s-width-middle"
                                             v-model="abnormalForm.shipping_methods">
                        </allow-create-select>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="受理人：" prop="recipient">
                <el-row>
                    <el-col :span="6">
                        <scroll-select v-model="staffs" style="width:158px" class="inline"
                                       textAlign="left"
                                       ref="creater"
                                       remote="get|user"
                                       :fix-params="fix_params_account"
                                       :fixResult="fix_result_account">
                        </scroll-select>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="包裹数：" prop="parcel_num">
                <el-row>
                    <el-col :span="6">
                        <el-input-number v-model.number="abnormalForm.parcel_num"
                                         class="width-lg"
                                         :min="1"></el-input-number>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
        <el-row class="mb-xs mt-xs">
            <span class="red">注意：异常包裹不装在卡板上，受理人为包裹的收货人</span>
        </el-row>
        <div slot="footer">
            <permission tag="requestButton"
                        req-key="api_receive_abnormal_mark"
                        @click="sure"
                        :route="apis.url_receive_abnormal_mark">保存
            </permission>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_receive_abnormal_mark, url_receive_abnormal_mark, api_ready_receive_info} from "@/api/ready-receive";
    import {api_warehous_local} from "@/api/entrepot-picking";

    export default {
        permission: {
            url_receive_abnormal_mark
        },
        data() {
            return {
                visible: this.value,
                abnormalForm: {
                    warehouse_id: '',
                    shipping_methods: '',
                    recipient: '',
                    parcel_num: '1',
                    warehouse_name: '',
                },
                rules: {
                    warehouse_id: [
                        {required: true, message: '请选择仓库', trigger: 'change', type: 'number'},
                    ],
                    shipping_methods: [
                        {required: true, message: '请选择运输方式', trigger: 'change'}
                    ],
                    recipient: [
                        {required: true, message: '请选择受理人', trigger: 'change', type: 'number'}
                    ],
                    parcel_num: [
                        {required: true, message: '请选择包裹数', trigger: 'blur', type: 'number'}
                    ],
                },
                label: '',
                warehouseList: [],
            }
        },
        mounted() {
            this.init_warehouse();
        },
        methods: {
            open() {
                console.log(`xxxxxx:`, this.abnormalData.tracking_number);
                let data = {
                    tracking_number: this.abnormalData.tracking_number,
                };
                this.$http(api_ready_receive_info, data).then(res => {
                    if(res.length !== 0) {
                        let {shipping_methods, parcel_num,warehouse_id,warehouse_name} = res;
                        this.abnormalForm.shipping_methods = shipping_methods;
                        this.abnormalForm.parcel_num = parcel_num;
                        this.abnormalForm.warehouse_id = warehouse_id;
                        this.abnormalForm.warehouse_name = warehouse_name;
                    }
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            init_warehouse() {
                this.$http(api_warehous_local).then(res => {
                    this.warehouseList = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            sure() {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        let data = this.get_params();
                        if(data.recipient === '') {
                            this.$message({type: 'error', message: '请选择受理人，手动输入姓名全称无效'});
                            this.$reqKey('api_receive_abnormal_mark', false);
                            return;
                        }
                        this.$http(api_receive_abnormal_mark, data).then(res => {
                            this.$message({type: 'success', message: res.message || res});
                            this.visible = false;
                            this.$emit('abnormal-mark');
                        }).catch(code => {
                            this.$message({type: 'error', message: code.message || code});
                        }).finally(() => {
                            setTimeout(() => {
                                this.$reqKey('api_receive_abnormal_mark', false);
                            }, 200);
                        })
                    } else {
                        this.$reqKey('api_receive_abnormal_mark', false);
                    }
                })
            },
            get_params() {
                Object.keys(this.abnormalForm).forEach(key => {
                    if (typeof this.abnormalForm[key] === 'string') {
                        this.abnormalForm[key] = this.abnormalForm[key].trim();
                    }
                });
                let searchData = clone(this.abnormalForm);
                searchData.tracking_number = this.abnormalData.tracking_number.trim();
                return searchData;
            },
            close() {
                this.$emit('abnormal-mark');
                this.abnormalForm = {
                    shipping_methods: '',
                    recipient: '',
                    parcel_num: '1',
                }
            },
            //账号参数
            fix_params_account({page, pageSize, keyword}) {
                return {
                    page: page,
                    pageSize: pageSize,
                    snText: keyword || "",
                    snType: "realname"
                };
            },//账号结果
            fix_result_account(res) {
                return {
                    options: res.data.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    }),
                    page: res.page,
                    count: res.count,
                }
            },
            warehouse_change() {
                this.abnormalForm.warehouse_name = this.warehouseList.find(row => row.id === this.abnormalForm.warehouse_id).name;
            },
        },
        computed: {
            staffs: {
                get() {
                    return {
                        value: this.abnormalForm.recipient,
                        label: this.label,
                    };
                },
                set(val) {
                    this.abnormalForm.recipient = val.value;
                    this.label = val.label;
                }
            },
        },
        watch: {
            value(val) {
                this.visible = val;
            },
            visible(val) {
                this.$emit('input', val);
            }
        },
        props: {
            value: {},
            abnormalData: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            scrollSelect: require('@/components/scroll-select.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
            allowCreateSelect: require('@/components/allow-create-select.vue').default,
        }
    }
</script>