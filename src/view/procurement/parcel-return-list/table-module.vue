<template>
    <div class="c-picking-sku-table">
        <el-table class="mb-sm scroll-bar"
                  border :data="tableData.lists"
                  highlight-current-row
                  v-resize="{height:41}"
                  @selection-change="batch_select"
                  v-loading="loading"
                  element-loading-text="玩命加载中...">
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column label="运输方式" min-width="50" inline-template>
                <div class="p-table-list-td-text" :title="row.shipping_methods">{{row.shipping_methods}}</div>
            </el-table-column>
            <el-table-column label="运单号" min-width="80" inline-template>
                <div class="p-table-list-td-text" :title="row.shipping_methods">{{row.tracking_number}}</div>
            </el-table-column>
            <el-table-column label="对应P0号" min-width="65" inline-template>
                <div class="p-table-list-td-text" :title="row.purchase_order_ids | filterPurchaseOrder">{{row.purchase_order_ids | filterPurchaseOrder}}</div>
            </el-table-column>
            <el-table-column label="采购员" min-width="55" inline-template>
                <div class="p-table-list-td-text" :title="row.purchaser_user_name_list|filterPurchaser">{{row.purchaser_user_name_list|filterPurchaser}}</div>
            </el-table-column>
            <el-table-column label="寄出运输方式" min-width="80" inline-template>
                <div class="p-table-list-td-text" :title="row.sent_shipping_methods">{{row.sent_shipping_methods}}</div>
            </el-table-column>
            <el-table-column label="寄出单号" min-width="100" inline-template>
                <div class="p-table-list-td-text" :title="row.sent_tracking_number">{{row.sent_tracking_number}}</div>
            </el-table-column>
            <el-table-column label="寄出日期" width="84" inline-template>
                <div class="p-table-list-td-text" :title="row.sent_date|timeFilter">{{row.sent_date|timeFilter}}</div>
            </el-table-column>
            <el-table-column label="寄出运费" min-width="80" inline-template>
                <div class="p-table-list-td-text" :title="row.sent_fee">{{row.sent_fee}}</div>
            </el-table-column>
            <el-table-column label="收件人姓名" min-width="80" inline-template>
                <div class="p-table-list-td-text" :title="row.recipient_name">{{row.recipient_name}}</div>
            </el-table-column>
            <el-table-column label="收件人手机号码" min-width="90" inline-template>
                <div class="p-table-list-td-text" :title="row.recipient_phone">{{row.recipient_phone}}</div>
            </el-table-column>
            <el-table-column label="收件地址" min-width="90" inline-template>
                <div class="p-table-list-td-text" :title="row.recipient_address">{{row.recipient_address}}</div>
            </el-table-column>
            <el-table-column label="寄付方式" min-width="90" inline-template>
                <div class="p-table-list-td-text" :title="row.payment_type_text">{{row.payment_type_text}}</div>
            </el-table-column>
            <el-table-column label="备注" min-width="55" inline-template>
                <div class="p-table-list-td-text" :title="row.remark">{{row.remark}}</div>
            </el-table-column>
            <el-table-column label="创建时间" width="84" inline-template>
                <div class="p-table-list-td-text" :title="row.create_time | timeFilter">{{row.create_time | timeFilter}}</div>
            </el-table-column>
            <el-table-column label="提交时间" width="84" inline-template>
                <div class="p-table-list-td-text" :title="row.purchase_submit_time | timeFilter">{{row.purchase_submit_time | timeFilter}}</div>
            </el-table-column>
            <el-table-column label="上传凭证时间" width="88" inline-template>
                <div class="p-table-list-td-text" :title="row.upload_certificate_time | timeFilter">{{row.upload_certificate_time | timeFilter}}</div>
            </el-table-column>
            <el-table-column label="操作" min-width="100" inline-template>
                <div>
                    <!--<span class="operate">查看</span>-->

                    <permission tag="span"
                                class="operate"
                                :route="apis.url_get_purchase_order_return_of_goods_purchase"
                                @click="look_edit(row,0)">查看</permission>
                    <permission tag="span"
                                v-if="row.purchase_is_submit !== 1"
                                :route="apis.url_purchase_order_abnormal_id_purchase_mail"> | </permission>
                    <permission tag="span"
                                v-if="row.purchase_is_submit !== 1"
                                class="operate"
                                :route="apis.url_purchase_order_abnormal_id_purchase_mail"
                                @click="look_edit(row,1)">编辑</permission>
                    <permission tag="span"
                                v-if="row.payment_type===2 && row.audit_status ===9"
                                :route="apis.url_purchase_certificate"> | </permission>
                    <permission tag="span"
                                class="operate"
                                v-if="row.payment_type===2 && row.audit_status ===9"
                                :route="apis.url_purchase_certificate"
                                @click="img_upload(row)">上传凭证</permission>
                    <permission tag="span"
                                v-if="row.payment_type===2 && row.audit_status ===10"
                                :route="apis.url_get_purchase_order_return_of_goods_purchase"> | </permission>
                    <permission tag="span"
                                class="operate"
                                v-if="row.payment_type===2 && row.audit_status ===10"
                                :route="apis.url_get_purchase_order_return_of_goods_purchase"
                                @click="look_img(row.certificate_file)">查看凭证</permission>
                </div>
            </el-table-column>
        </el-table>
        <look-edit
            v-model="lookEditDialog"
            :title="dialogTitle"
            @update-table="update_table"
            :look-edit-data="lookEditData"
            :is-edit="isEdit"></look-edit>
        <img-upload v-model="uploadVisible"
                    :limit="1" sure-text="上传"
                    :image-info="imageInfo"
                    @upload="upload_evidence"
                    :need-add="needAdd"></img-upload>
        <blowup-image v-model="imgVisible" :img-path="imgPath" :title="`查看凭证`"></blowup-image>
    </div>
</template>
<style lang="stylus">
    .c-picking-sku-table{
        .p-table-list-td-text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
</style>
<script>
    import {
        url_get_purchase_order_return_of_goods_purchase,
        url_purchase_order_abnormal_id_purchase_mail,
        api_purchase_certificate,
        url_purchase_certificate,
        api_delete_purchase_order_abnormal_id_return_parcel,
        url_delete_purchase_order_abnormal_id_return_parcel,
    } from "@/api/package-return-list";

    export default {
        permission:{
            url_get_purchase_order_return_of_goods_purchase,
            url_purchase_order_abnormal_id_purchase_mail,
            url_purchase_certificate
        },
        data() {
            return {
                title: '',
                lookEditDialog: false,
                lookEditData: {},
                remarkTitle: '',
                dialogTitle: '',
                batch_action: '',
                selectedData: [],
                abnormalInfo: {},
                business_image: [],
                isEdit: false,
                needAdd: true,
                uploadVisible:false,
                imgVisible: false,
                imgPath:'',
                imageInfo: {
                    title: '上传凭证',
                    images: [],
                    tip: '(单张图片大小不能超过2M) ',
                    abnormal_id: ''
                },
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
            },
            filterPurchaseOrder(val){
                return val && typeof val ==='string'?`PO${val}`:val
            }
        },
        methods: {
            batch_select(val) {
                this.selectedData = val;
            },
            look_edit(row, value) {
                this.isEdit = value === 1;
                this.dialogTitle = this.isEdit ? '编辑邮寄信息' : '查看邮寄信息';
                this.lookEditData = window.clone(row);
                this.lookEditData.payment_type === 0 && (this.lookEditData.payment_type = '');
                this.lookEditDialog = true;
            },
            update_table(data) {
                let find = this.tableData.lists.find(row => row.abnormal_id === data.abnormal_id);
                if (find) {
                    Object.assign(find, data);
                }
            },
            //上传凭证
            upload_evidence(data) {
                this.$http(api_purchase_certificate, this.imageInfo.abnormal_id, {certificate_files: data.map(row => row.path)}).then(res => {
                    console.log(res,'res');
                    if(this.searchData.audit_status === '') {
                        let find = this.tableData.lists.find(row => row.abnormal_id === this.imageInfo.abnormal_id);
                        if (find) {
                            find.certificate_file = res.url_path;
                            find.audit_status = res.audit_status;
                        }
                    }else{
                        let index = this.tableData.lists.find(row => row.abnormal_id === this.imageInfo.abnormal_id);
                        if(index>-1) {
                            this.tableData.lists.splice(index, 1);
                        }
                    }
                    this.$message({type: 'success', message: res.message||res});
                    this.uploadVisible = false;
                }).catch(code => {
                    this.$message({type: 'warning', message: code.message || code});
                });
            },
            img_upload(row) {
                this.imageInfo.images = [];
                this.imageInfo.abnormal_id = row.abnormal_id;
                this.uploadVisible = true;
            },
            look_img(image){
                this.imgPath = window.config.apiHost+image.replace("_60x60", "_500x500");
                this.imgVisible = true;
            },
        },
        props: {
            tableData: {},
            loading: {},
            searchData: {},
        },
        components: {
            trendsSelect: require('@/components/trends-select').default,
            uiTip: require('@/components/ui-tip').default,
            requestButton: require('@/global-components/request-button.vue').default,
            exportField: require("@/components/export-field").default,
            tableModule: require('./table-module').default,
            lookEdit: require('./look-edit').default,
            imgUpload: require('@/components/img-upload.vue').default,
            blowupImage: require('@/components/blowup-image').default
        }
    }

</script>
