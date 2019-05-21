<template>
    <page-dialog size="full" v-model="show" :title="dialogTitle" class="p-form-lose"
                 :close-on-click-modal="false" width="80%" left="10%">
        <template v-for="purchase_order in lookPackageOrdersData">
            <el-card class="mb-sm">
                <div class="lose-info-cell">
                    <p class="purchase-info">
                        <span class="address c-red">{{purchase_order.warehouse_name}}</span>
                        <label class="purchase-detail">采购单号：<span>{{purchase_order.order_id}}</span></label>
                        <label class="purchase-detail">运单号：<span>{{purchase_order.tracking_number}}</span></label>
                        <label class="purchase-detail">采购员：<span>{{purchase_order.purchase_user}}</span></label>
                    </p>
                    <el-table :data="purchase_order.sku_list" border tooltip-effect="dark" style="width: 100%">
                        <el-table-column label="图片" inline-template width="120">
                            <el-popover
                                placement="right"
                                trigger="hover">
                                <img :src="row.thumb | filterImage"
                                     width="200px"
                                     height="200px">
                                <div slot="reference">
                                    <img :src="row.thumb"
                                         @click="search_img(row.thumb)"
                                         height="60px" width="60px"
                                         style="border:none">
                                </div>
                            </el-popover>
                        </el-table-column>
                        <el-table-column prop="sku" label="货号（SKU）/别名" width="120"></el-table-column>
                        <el-table-column prop="sku_name" label="名称"></el-table-column>
                        <el-table-column prop="qty" label="采购数量" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="in_qty" label="入库数" show-overflow-tooltip></el-table-column>
                        <el-table-column label="丢失数量" inline-template>
                            <div>
                                <ui-limit-number v-model="row.loss_quantity"
                                                 v-if="isEdit"
                                                 style="width:80px"
                                                 :limit="row.max_lost_quantity"
                                                 class="inline"
                                                 :min="0">
                                </ui-limit-number>
                                <span v-else>{{row.loss_quantity}}</span>
                            </div>
                        </el-table-column>
                        <el-table-column prop="recover_quantity" label="找回数量" show-overflow-tooltip></el-table-column>
                        <el-table-column v-if="!isEdit" label="差异数" inline-template>
                            <div :style="`${row.difference_quantity>0?'color: red;':''}`">{{row.difference_quantity}}</div>
                        </el-table-column>
                    </el-table>
                    <div class="remarks mt-sm">
                        <span class="ml-sm">备注:</span>
                        <el-input class="inline" v-if="isEdit" v-model="lookPackageData.remark" type="textarea" :cols="190"
                                  :rows="5"></el-input>
                        <span v-else>{{lookPackageData.remark}}</span>
                    </div>
                </div>
            </el-card>
        </template>
        <div slot="footer">
            <template v-if="showExamineApprove">
                <request-button
                    req-key="approve"
                    :mintime="200"
                    @click="examine_and_approve(1,'approve')">审批通过</request-button>
                <request-button
                    req-key="examine"
                    :mintime="200"
                    @click="examine_and_approve(0,'examine')">返回修改</request-button>
            </template>
            <template v-else-if="isEdit">
                <request-button
                    req-key="submit_edit"
                    :mintime="200"
                    @click="submit_or_save(1,'submit_edit')">提交审批</request-button>
                <request-button
                    req-key="save_edit"
                    :mintime="200"
                    @click="submit_or_save(0,'save_edit')">保存</request-button>
            </template>
            <el-button size="mini" class="mr-sm" @click.native="closeDialog">关闭</el-button>
        </div>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
    </page-dialog>
</template>
<style lang="stylus">
    .lose-info-cell {
        .address {
            display: inline-block;
            font-size: 18px;
            padding: 0 10px;
            font-weight: bold;
        }
        .purchase-detail {
            font-size: 13px;
            font-weight: bold;
            display: inline-block;
            margin-left: 20px;
            span {
                color: #080;
                font-weight: normal;
            }
        }
        .remarks {
            span {
                display: inline-block;
            }
        }
        .el-table__body-wrapper {
            overflow-x hidden;
        }
    }
</style>
<script>
    import {
        api_put_purchase_order_abnormal_id_lost,
        api_put_purchase_order_abnormal_id_review_leader,
        api_put_purchase_order_abnormal_id_review_manager
    } from '@/api/long-not-opened'

    export default {
        data() {
            return {
                show: this.value,
                imgPath: '',
                imgDialog: false
            }
        },
        methods: {
            search_img(image) {
                this.imgPath = image.replace("_60x60", "_500x500");
                this.imgDialog = true;
            },
            closeDialog() {
                this.show = false;
            },
            examine_and_approve(pass_audit, key) {
                let api = this.lookPackageData.user_job === 2 ?
                    api_put_purchase_order_abnormal_id_review_leader :
                    api_put_purchase_order_abnormal_id_review_manager;
                let data = {
                    purchase_parcels_id: this.lookPackageData.purchase_parcels_id,
                    pass_audit
                };
                this.$http(api, this.lookPackageData.abnormal_id, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.$emit('update-table',res.data,this.lookPackageData.abnormal_id);
                    this.show = false;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey(key, false);
                    }, 200);
                });
            },
            submit_or_save(is_submit, key) {
                let lost_parcels = {};
                this.lookPackageOrdersData.forEach(row => {
                    if (lost_parcels[row.order_id] === undefined) {
                        lost_parcels[row.order_id] = {};
                    }
                    row.sku_list.forEach(sku => {
                        lost_parcels[row.order_id][sku.sku] = {
                            loss_quantity: sku.loss_quantity || 0,
                            recover_quantity: sku.recover_quantity || 0,
                            difference_quantity: sku.difference_quantity || 0
                        }
                    });
                });
                let data = {
                    purchase_parcels_id: this.lookPackageData.purchase_parcels_id,
                    is_submit,
                    lost_parcels,
                    remark: this.lookPackageData.remark
                };
                this.$http(api_put_purchase_order_abnormal_id_lost, this.lookPackageData.abnormal_id, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.$emit('update-table',res.data,this.lookPackageData.abnormal_id);
                    this.show = false;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey(key, false);
                    }, 200);
                });
            }
        },
        computed:{
            showExamineApprove(){
                return (this.lookPackageData.user_job === 2 || this.lookPackageData.user_job === 3) && this.isExamineApprove
            }
        },
        filters: {
            filterImage(val) {
                return val.replace("_60x60", "_200x200");
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
            dialogTitle: {
                required: true,
                type: String
            },
            isEdit: {
                required: true,
                type: Boolean
            },
            lookPackageOrdersData: {
                type: Array,
                required: true
            },
            lookPackageData: {
                type: Object,
                required: true
            },
            isExamineApprove:{
                type: Boolean,
                requried: true
            }
        },
        components: {
            pageDialog: require('@/components/page-dialog').default,
            uiTable: require('@/components/ui-table').default,
            uiTip: require('@/components/ui-tip').default,
            uiLimitNumber: require('@/components/ui-limit-number').default,
            blowupImage: require("@/components/blowup-image.vue").default
        },
    }
</script>
