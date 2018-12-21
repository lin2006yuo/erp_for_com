<template>
    <div>
        <page-dialog title="" v-model="visible" size="small" :close-on-click-modal="false">
            <p class="tracking"><span>修改运单号：{{updateForm.tracking_number}} 信息</span></p>
            <el-form ref="form" :model="updateForm" label-width="80px">
                <el-form-item label="运单号：">
                    <el-row>
                        <el-col :span="6">
                            <el-input v-model="updateForm.tracking_number" class="inline tracking-number"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="运输方式：">
                    <el-row>
                        <el-col :span="6">
                            <allow-create-select class="width-input inline"
                                                 v-model="updateForm.logistics_company_name"></allow-create-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="采购单ID：">
                    <span>{{updateForm.purchase_order_ids}}</span>
                </el-form-item>
                <el-form-item label="采购单号：">
                    <span>{{updateForm.purchase_order_codes}}</span>
                </el-form-item>
                <el-form-item label="重量：">
                    <el-row>
                        <el-col :span="4" class="mr-sm">
                            <integer-input v-model="updateForm.purchase_parcel_weight"
                                      :min="0"
                                      type="number"
                                      class="inline">
                            </integer-input>
                        </el-col>
                        <el-col :span="6">
                            <span>g</span>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="供应商：">
                    <span>{{updateForm.supplier_name}}</span>
                </el-form-item>
                <el-form-item label="采购员：">
                    <span>{{updateForm.purchaser_user_name_list}}</span>
                </el-form-item>
                <el-form-item label="收货台：">
                    <span>{{updateForm.receiving_platform}}</span>
                </el-form-item>
                <el-form-item label="仓库：">
                    <span>{{updateForm.warehouse_name}}</span>
                </el-form-item>
                <el-form-item label="接收员：">
                    <span>{{updateForm.creator_user_name}}</span>
                </el-form-item>
                <el-form-item label="接收时间：">
                    <span>{{updateForm.create_time_str}}</span>
                </el-form-item>
                <el-form-item label="是否拆分：">
                    <span :class="{redColor:updateForm.is_use}">{{updateForm.is_use | isSplit}}</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer t-center mt-md">
                <el-button @click.native="submit_btn" class="mr-md" type="primary">确定</el-button>
                <el-button @click.native="visible = false">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .tracking {
        position: absolute;
        top: 0;
        z-index: 999;
    }
    .tracking-number.el-input {
        width: 153px;
    }
    .redColor {
        color: #e4393c;
    }
</style>
<script>
    import {
        api_parcel_update
    } from "@/api/receive-parcel.js";

    export default {
        data() {
            return {
                visible: false,
                old_tracking_number: '',
                logistics_company_name: ''
            }
        },
        mounted() {
            this.old_tracking_number = this.updateForm.tracking_number;
            this.logistics_company_name = this.updateForm.logistics_company_name;
        },
        filters: {
            isSplit(row) {
                if (row === 1) {
                    return '已拆';
                } else {
                    return '未拆'
                }
            }
        },
        methods: {
            submit_btn() {
                Object.keys(this.updateForm).forEach(key=>{
                    if(typeof this.updateForm[key] === 'string'){
                        this.updateForm[key] = this.updateForm[key].trim();
                    }
                });
                if(this.logistics_company_name !== '' && this.updateForm.logistics_company_name === '') {
                    return this.$message({
                        type: 'error',
                        message: '必须选择一种运输方式'
                    });
                }
                let params = {
                    purchase_parcel_code: this.updateForm.purchase_parcel_code,
                    field_info: [
                        {tracking_number: this.updateForm.tracking_number},
                        {logistics_company_name: this.updateForm.logistics_company_name},
                        {purchase_parcel_weight: Number(this.updateForm.purchase_parcel_weight)}
                    ]
                };

                if (params.field_info[2].purchase_parcel_weight) {
                    this.$http(api_parcel_update, params).then(res => {
                        this.$message({type: "success", message: "修改成功"});
                        this.visible = false;
                        this.updateForm.purchase_parcel_weight = this.updateForm.purchase_parcel_weight;
                        this.$emit('table-data', this.updateForm);
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    });
                } else {
                    this.$message({type: "error", message: '请输入重量'})
                }

            }
        },
        computed: {},
        watch: {
            visible(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.visible = val;
            }
        },
        props: {
            value: {},
            updateForm: {
                required: true,
                type: Object
            },
        },
        components: {
            pageDialog: require("@/components/page-dialog.vue").default,
            allowCreateSelect: require('@/components/allow-create-select.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
        },
    }
</script>
