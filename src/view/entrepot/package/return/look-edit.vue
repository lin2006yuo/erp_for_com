<template>
    <page-dialog v-model="visible" @open="open"
                 class="c-package-return-look" @close="close" :title="returnInfo.title">
        <el-form ref="form" v-if="!empty" :model="returnData"
                 label-width="110px" :rules="rules">
            <el-form-item label="运输方式：">
                <el-row>
                    <el-col>
                        <span>{{returnData.shipping_methods}}</span>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="运单号：">
                <el-row>
                    <el-col>
                        <span>{{returnData.tracking_number}}</span>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="PO号：">
                <el-row>
                    <el-col>
                        <span>{{returnData.purchase_order_ids}}</span>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="采购员：">
                <el-row>
                    <el-col>
                        <span>{{returnData.purchaser_user_name_list.join()}}</span>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="寄出方运输方式：" prop="sent_shipping_methods">
                <allow-create-select class="width-input inline"
                                     :disabled="isLook"
                                     v-model="returnData.sent_shipping_methods"></allow-create-select>
            </el-form-item>
            <el-form-item label="寄出单号：" prop="sent_tracking_number">
                <el-input class="width-input inline"
                          :disabled="isLook"
                          v-model="returnData.sent_tracking_number"></el-input>
            </el-form-item>
            <el-form-item label="日期：" prop="sent_date">
                <el-row>
                    <el-col>
                        <el-date-picker class="width-input inline"
                                        :disabled="isLook"
                                        v-model="returnData.sent_date"></el-date-picker>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="重量：" prop="weight">
                <integer-input class="width-input inline"
                               :min="0"
                               :disabled="isLook"
                               v-model.number="returnData.weight"></integer-input>
                <span class="ml-xs">g</span>
            </el-form-item>
            <el-form-item label="运费：" prop="sent_fee">
                <integer-input class="width-input inline"
                               :min="0"
                               :disabled="isLook"
                               v-model.number="returnData.sent_fee"></integer-input>
                <span class="ml-xs">￥</span>
            </el-form-item>
            <el-form-item label="物品信息：">
                <el-row>
                    <el-col>
                        <span>{{returnData.goods_name}}</span>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="寄件人姓名：">
                <el-row>
                    <el-col>
                        <span>{{returnData.sender_name}}</span>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="寄件人手机：">
                <el-row>
                    <el-col>
                        <span>{{returnData.sender_phone}}</span>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="收件人姓名：">
                <el-row>
                    <el-col>
                        <span>{{returnData.recipient_name}}</span>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="收件人手机：">
                <el-row>
                    <el-col>
                        <span>{{returnData.recipient_phone}}</span>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="收件地址：">
                <el-row>
                    <el-col>
                        <span>{{returnData.recipient_address}}</span>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="寄付方式：">
                <el-row>
                    <el-col>
                        <span>{{returnData.payment_type_text}}</span>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="备注：">
                <el-row>
                    <el-col>
                        <span>{{returnData.remark}}</span>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <template v-if="isEdit">
                <request-button type="primary" size="mini"
                                :req-key="saveKey"
                                @click.native="sure">保存
                </request-button>
                <request-button type="primary" size="mini"
                                :req-key="uploadKey"
                                @click.native="submit">保存并提交
                </request-button>
            </template>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .c-package-return-look {
        .image {
            max-width: 200px;
        }
        .width-input {
            width: 153px;
        }
    }
</style>
<script>
    import {api_warehouse_mail} from "@/api/parcel-return";

    export default {
        data() {
            return {
                visible: this.value,
                rules: {
                    sent_shipping_methods: [
                        {required: true, message: '寄出运输方式不能为空', trigger: 'blur'}
                    ],
                    sent_tracking_number: [
                        {required: true, message: '寄出单号不能为空', trigger: 'blur'}
                    ],
                    sent_date: [
                        {required: true, message: '日期不能为空', trigger: 'blur', type: 'date'}
                    ],
                    weight: [
                        {required: true, message: '重量不能为空', trigger: 'blur', type: 'number'}
                    ],
                    sent_fee: [
                        {required: true, message: '运费不能为空', trigger: 'blur', type: 'number'}
                    ]
                },
                saveKey: 'api_warehouse_mail_save',
                uploadKey: 'api_warehouse_mail_upload',
            }
        },
        methods: {
            open() {
            },
            close() {
            },
            sure() {
                let data = {
                    is_submit: 0,
                };
                this.upload(data, this.saveKey);
            },
            submit() {
                let data = {
                    is_submit: 1,
                };
                this.upload(data, this.uploadKey);
            },
            upload(data, reqKey) {
                this.$refs.form.validate((validate) => {
                    if (validate) {
                        Object.assign(data, this.get_params());
                        if(!this.validate(data)) {
                            return this.$reqKey(reqKey, false);
                        }
                        this.$http(api_warehouse_mail, this.returnData.abnormal_id, data).then(res => {
                            this.$message({type: 'success', message: res.message || res});
                            this.$emit('search');
                            this.visible = false;
                        }).catch(code => {
                            this.$message({type: 'error', message: code.message || code});
                        }).finally(() => {
                            setTimeout(() => {
                                this.$reqKey(reqKey, false);
                            });
                        });
                    } else {
                        this.$reqKey(reqKey, false);
                    }
                });
            },
            validate(data) {
                let weight = Number(data.weight);
                let fee = Number(data.sent_fee);
                if(isNaN(weight) || weight <= 0) {
                    this.$message({type: 'warning', message: '请输入正确的重量数字！'});
                    return false;
                }
                if(isNaN(fee) || (fee < 0 && !data.is_submit) || (fee <= 0 && data.is_submit)) {
                    this.$message({type: 'warning', message: '请输入正确的运费数字！'});
                    return false;
                }
                return true;
            },
            /*
               TODO:此处上传给后端的数据需要手动筛选，变动需要及时修改
            */
            get_params() {
                Object.keys(this.returnData).forEach(key => {
                    if (typeof this.returnData[key] === 'string') {
                        this.returnData[key] = this.returnData[key].trim();
                    }
                });
                let data = clone(this.returnData);
                data.sent_date = datef('YYYY-MM-dd', data.sent_date.getTime()/1000);
                let {sent_shipping_methods, sent_tracking_number, sent_date, weight, sent_fee} = data;
                return {
                    sent_shipping_methods, sent_tracking_number, sent_date, weight, sent_fee
                }
            },
        },
        computed: {
            isEdit() {
                return this.returnInfo.action === 'edit';
            },
            isLook() {
                return this.returnInfo.action === 'look';
            },
            empty() {
                return isEmpty(this.returnData);
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
            returnInfo: {},
            returnData: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            allowCreateSelect: require('@/components/allow-create-select.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
        }
    }
</script>