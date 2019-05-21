<template>
    <page-dialog
        size="full"
        v-model="show"
        :title="title"
        class="p-form-look"
        :close-on-click-modal="false"
        width="30%"
        left="10%">
        <div class="look-info-cell mt-sm">
            <el-form label-width="100px">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="运输方式：" prop="company_name">
                            <span>{{lookRestsData.shipping_methods}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="运单号：" prop="company_name">
                            <span>{{lookRestsData.tracking_number}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="采购单号：" prop="company_name">
                            <span>{{lookRestsData.purchase_order_ids}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="采购员：" prop="company_name">
                            <span>{{lookRestsData.purchaser_user_name_list|filterPurchaser}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="包裹数量：" prop="company_name">
                            <span>{{lookRestsData.parcel_num}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="预接收员：" prop="company_name">
                            <span>{{lookRestsData.ready_receive_user}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="预接收时间：" prop="company_name">
                            <span>{{lookRestsData.ready_receive_time|timeFilter}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="接收员：" prop="company_name">
                            <span>{{lookRestsData.receive_parcel_user}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="接收时间：" prop="company_name">
                            <span>{{lookRestsData.create_time|timeFilter}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="包裹状态：" prop="company_name">
                            <span>{{lookRestsData.is_use_text}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="异常类型：" prop="company_name">
                            <span>{{lookRestsData.abnormal_type_text}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="创建人：" prop="company_name">
                            <span>{{lookRestsData.create_abnormal_user}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="备注：" prop="company_name">
                            <span>{{lookRestsData.abnormal_content}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </page-dialog>
</template>
<script>

    export default {
        data() {
            return {
                title: ' 查看',
                show: this.value
            }
        },
        filters: {
            timeFilter(val) {
                if (val) {
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
            filterPurchaser(arr){
                return Array.isArray(arr)?arr.join():arr
            }
        },
        watch: {
            value(val) {
                this.show = val
            },
            show(val) {
                this.$emit('input', val)
            }
        },
        props: {
            value: {
                required: true,
                type: Boolean
            },
            lookRestsData: {
                type: Object
            }
        },
        components: {
            pageDialog: require('@/components/page-dialog').default
        },
    }
</script>
<style lang="stylus">
    .page-dialog .dialog__body {
        color: #333 !important;
    }
</style>
<style lang="stylus">
    .p-form-look {
        .look-info-cell {

        }
    }
</style>
