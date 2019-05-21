<template>
    <page-dialog v-model="visible" @open="open" @close="close" :title="readyInfo.title">
        <el-form ref="form" :model="readyData" label-width="80px" :rules="rules">
            <el-form-item label="运输方式：" prop="shipping_methods">
                <el-row>
                    <el-col :span="6">
                        <allow-create-select class="width-input inline"
                                             :disabled="isLook"
                                             v-model="readyData.shipping_methods"></allow-create-select>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="运单号：" prop="tracking_number">
                <el-row>
                    <el-col :span="6">
                        <el-input v-model="readyData.tracking_number"
                                  :disabled="isLook"
                                  class="inline tracking-number"></el-input>
                    </el-col>
                </el-row>
            </el-form-item>

            <el-form-item label="包裹数：" prop="parcel_num">
                <el-row>
                    <el-col :span="6">
                        <el-input-number v-model.number="readyData.parcel_num"
                                         class="width-lg"
                                         :disabled="isLook"
                                         :min="1"></el-input-number>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="重量：">
                <el-row>
                    <el-col :span="4" class="mr-sm">
                        <integer-input v-model="readyData.purchase_parcel_weight"
                                       :min="0"
                                       :disabled="isLook"
                                       type="number"
                                       class="inline">
                        </integer-input>
                    </el-col>
                    <el-col :span="6">
                        <span>g</span>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="预接收员：">
                <span>{{readyData.receive_user_name}}</span>
            </el-form-item>
            <el-form-item label="预接收时间：">
                <span>{{readyData.ready_receive_time | filterTime}}</span>
            </el-form-item>
            <el-form-item label="包裹状态：">
                <span>{{readyData.is_use_text}}</span>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <request-button req-key="api_ready_receive_edit" type="primary" size="mini" @click="sure">确定
            </request-button>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .tracking-number.el-input {
        width: 153px;
    }
</style>
<script>
    import {api_ready_receive_edit} from "@/api/ready-receive";

    export default {
        data() {
            return {
                visible: this.value,
                rules: {
                    shipping_methods: [
                        {required: true, message: '请选择运输方式', trigger: 'change'}
                    ],
                    tracking_number: [
                        {required: true, message: '请填写运单号', trigger: 'blur'}
                    ],
                    parcel_num: [
                        {required: true, message: '请选择包裹数', trigger: 'change', type: 'number'}
                    ]
                },
            }
        },
        filters: {
            filterTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
        },
        mounted() {
        },
        methods: {
            open() {

            },
            sure() {
                Object.keys(this.readyData).forEach(key => {
                    if (typeof this.readyData[key] === 'string') {
                        this.readyData[key] = this.readyData[key].trim();
                    }
                });
                this.$refs.form.validate(valid => {
                    if (valid) {
                        let {id, shipping_methods, tracking_number, parcel_num, purchase_parcel_weight} = clone(this.readyData)
                        let data = {id, shipping_methods, tracking_number, parcel_num, purchase_parcel_weight};
                        this.$http(api_ready_receive_edit, data).then(res => {
                            this.$message({type: 'success', message: res.message || res});
                            this.visible = false;
                            this.$emit('ready-edit', data);
                        }).catch(code => {
                            this.$message({type: 'error', message: code.message || code});
                        }).finally(() => {
                            setTimeout(() => {
                                this.$reqKey('api_ready_receive_edit', false);
                            });
                        })
                    } else {
                        this.$reqKey('api_ready_receive_edit', false);
                    }
                })
            },
            close() {
            }
        },
        computed: {
            isLook() {
                return this.readyInfo.action === 'look';
            },
            isEdit() {
                return this.readyInfo.action === 'edit';
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
        props: {
            value: {},
            readyData: {
                required: true,
                type: Object,
            },
            readyInfo: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
            allowCreateSelect: require('@/components/allow-create-select.vue').default,
        }
    }
</script>