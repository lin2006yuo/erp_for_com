<template>
    <page-dialog :title="title" v-model="dialog" size="small" :close-on-click-modal="false">
        <el-form label-width="150px" :model="lookEditData" label-align="right" ref="form" :rules="rules">
            <el-form-item label="运输方式：">
                <span>{{lookEditData.shipping_methods}}</span>
            </el-form-item>
            <el-form-item label="包裹号：">
                <span>{{lookEditData.tracking_number}}</span>
            </el-form-item>
            <el-form-item label="PO号：">
                <span>{{lookEditData.purchase_order_ids}}</span>
            </el-form-item>
            <el-form-item label="采购员：">
                <span>{{lookEditData.purchaser_user_name_list|filterPurchaser}}</span>
            </el-form-item>
            <el-form-item label="寄出运输方式：">
                <span>{{lookEditData.sent_shipping_methods}}</span>
            </el-form-item>
            <el-form-item label="寄出日期：">
                <span>{{lookEditData.sent_date}}</span>
            </el-form-item>
            <el-form-item label="重量：">
                <span>{{lookEditData.weight}}</span>
                <span>g</span>
            </el-form-item>
            <el-form-item label="运费：">
                <span>{{lookEditData.sent_fee}}</span>
            </el-form-item>
            <el-form-item label="物品信息：" prop="goods_name">
                <span v-if="!isEdit">{{lookEditData.goods_name}}</span>
                <el-input v-model="lookEditData.goods_name" v-else class="s-width-middle"></el-input>
            </el-form-item>
            <el-form-item label="寄件人姓名：" prop="sender_name">
                <span v-if="!isEdit">{{lookEditData.sender_name}}</span>
                <el-input v-model="lookEditData.sender_name" v-else class="s-width-middle"></el-input>
            </el-form-item>
            <el-form-item label="寄件人手机号：" prop="sender_phone">
                <span v-if="!isEdit">{{lookEditData.sender_phone}}</span>
                <el-input v-model="lookEditData.sender_phone" v-else class="s-width-middle"></el-input>
            </el-form-item>
            <el-form-item label="收件人姓名：" prop="recipient_name">
                <span v-if="!isEdit">{{lookEditData.recipient_name}}</span>
                <el-input v-model="lookEditData.recipient_name" v-else class="s-width-middle"></el-input>
            </el-form-item>
            <el-form-item label="收件人手机号：" prop="recipient_phone">
                <span v-if="!isEdit">{{lookEditData.recipient_phone}}</span>
                <el-input v-model="lookEditData.recipient_phone" v-else class="s-width-middle"></el-input>
            </el-form-item>
            <el-form-item label="收件人地址：" prop="recipient_address">
                <span v-if="!isEdit">{{lookEditData.recipient_address}}</span>
                <el-input v-model="lookEditData.recipient_address" v-else class="s-width-middle"></el-input>
            </el-form-item>
            <el-form-item label="寄付方式：" prop="payment_type">
                <label-select
                    v-model="lookEditData.payment_type"
                    class="s-width-middle inline"
                    :edit="isEdit"
                    :lists="paymentTypeOption"
                ></label-select>
            </el-form-item>
            <el-form-item label="备注：">
                <span v-if="!isEdit">{{lookEditData.remark}}</span>
                <el-input v-model="lookEditData.remark" v-else type="textarea" style="width: 80%"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button size="mini" type="primary" @click="save_submit(1)" v-if="isEdit">提交</el-button>
            <el-button size="mini" type="primary" @click="save_submit(0)" v-if="isEdit">保存</el-button>
            <el-button size="mini" @click.native="dialog = false" class="inline">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
</style>
<script>
    import {api_purchase_order_abnormal_id_purchase_mail} from "@/api/package-return-list";

    export default {
        data() {
            return {
                paymentTypeOption: [
                    {label: '寄付', value: 2 },
                    {label: '到付', value: 1 }
                    ],
                dialog: false,
                rules: {
                    goods_name: [{required: true, message: '请输入商品信息', trigger: 'blur'}],
                    sender_name: [{required: true, message: '请输入寄件人姓名', trigger: 'blur'}],
                    sender_phone: [{required: true, message: '请输入寄件人手机号', trigger: 'blur'}],
                    recipient_name: [{required: true, message: '请输入收件人姓名', trigger: 'blur'}],
                    recipient_phone: [{required: true, message: '请输入收件人手机号', trigger: 'blur'}],
                    recipient_address: [{required: true, message: '请输入收件地址', trigger: 'blur'}],
                    payment_type: [{required: true, message: '请输入寄付方式',trigger: 'blur',type:'number'}],
                },
            }
        },
        methods: {
            save_submit(is_submit) {
                console.log(this.lookEditData,'this.lookEditData');
                this.$refs.form.validate(valid => {
                    if (valid) {
                        let data = {
                            is_submit,
                            goods_name: this.lookEditData.goods_name,
                            sender_name: this.lookEditData.sender_name,
                            sender_phone: this.lookEditData.sender_phone,
                            recipient_name: this.lookEditData.recipient_name,
                            recipient_phone: this.lookEditData.recipient_phone,
                            recipient_address: this.lookEditData.recipient_address,
                            payment_type: this.lookEditData.payment_type,
                            remark: this.lookEditData.remark,
                        };
                        this.$http(api_purchase_order_abnormal_id_purchase_mail, this.lookEditData.abnormal_id, data).then(res => {
                            this.$message({type: "success", message: "保存成功"});
                            this.$emit('update-table', Object.assign({abnormal_id: this.lookEditData.abnormal_id}, res.data || {}));
                            this.dialog = false;
                        }).catch(code => {
                            this.$message({type: "error", message: code.message || code});
                        })
                    }
                })
            },
        },
        watch: {
            dialog(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.dialog = val;
            },
        },
        filters:{
            filterPurchaser(val){
                return Array.isArray(val)?val.join():val
            }
        },
        props: {
            value: {
                required: true,
                type: Boolean
            },
            title: {
                required: true,
                type: String
            },
            isEdit: {
                required: true,
                type: Boolean
            },
            lookEditData: {
                type: Object,
                required: true
            }
        },
        components: {
            pageDialog: require('@/components/page-dialog').default,
            imageUpload: require('@/view/procurement/suppliers/assert-sup/image-upload').default,
            labelSelect: require('@/components/label-select').default,
        }
    }
</script>
