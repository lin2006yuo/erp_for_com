<template>
    <div class="c-table-data">
        <div class="relative">
        </div>
        <el-table
                class="scroll-bar"
                :data="tableData.list"
                v-resize="{height:38}"
                v-loading="loading"
                element-loading-text="玩命加载中..."
                :default-sort="{prop: 'uploaded_deadline', order: 'descending'}"
                highlight-current-row>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column label="平台订单号" inline-template width="210">
                <div>
                    <ui-tip :key="index" :is-operate="true" :content="row.order_number"
                            @cur-click="get_order_detail(row)" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="包裹号" inline-template width="150">
                <div>
                    <ui-tip :is-operate="true" :content="row.number"
                            @cur-click="click_number(row.number)" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="面单号" inline-template width="180">
                <ui-tip :content="row.shipping_number" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="邮寄方式" inline-template>
                <ui-tip :content="row.shipping_name" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="重量(g)" inline-template width="100">
                <div>
                    <ui-tip :content="row.package_weight" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="预估重量(g)" inline-template width="100">
                <div :title="row.estimated_weight">{{row.estimated_weight}}</div>
            </el-table-column>
            <el-table-column label="发货仓库" inline-template width="120">
                <div :title="row.warehouse_name">{{row.warehouse_name}}</div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="current_change"
                :current-page="tableData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="tableData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.total">
        </el-pagination>

        <form-mdf ref="formMdf"
                  :mdfid="mdfid"
                  v-model="mdfValue"
                  :is-edit="is_edit"
                  :is-package="is_package"
                  @close-dialog="close_dialog"
                  @click-number="click_number_mdf"
                  :title="mdfTitle"></form-mdf>
        <parcel-information
                v-model="informationVisble"
                @view-order="view_order"
                :order="order"
                @close-parcel="close_parcel"
        ></parcel-information>
        <invoice-preview v-model="previewVisible"
                         :api="invoiceApi"
                         :params="printParams"
                         ref="invoice_preview">
        </invoice-preview>
    </div>
</template>
<style lang="stylus">
    .c-table-data {
        .operate {
            color: #6699FF;
        }
        .s-info-title {
            WORD-WRAP: break-word;
            TABLE-LAYOUT: fixed;
            word-break: normal;
        }
    }
</style>
<script>
    import {url_package} from "@/api/shipment"
    import {url_info} from '@/api/order-local'

    export default {
        permission: {
            url_package, url_info
        },
        data() {
            return {
                mdfid: 0,
                mdfValue: false,
                mdfTitle: "",
                informationVisble: false,
                order: {},
                is_edit: {
                    edit: false
                },
                //是否是从包裹列表进入
                is_package: false,
                token: '',
                numberList: [],
                print_width: 100,
                print_height: 100,
                isShow: false,
                selectList: [],
                canTracking: false,
                previewVisible: false,
                printParams: {
                    package_ids: []
                },
                invoiceApi: ''
            }
        },
        filters: {
            fdatetime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val)
            }
        },
        methods: {
            view_order(val) {
                this.mdfValue = true;
                this.mdfid = val.mdfid;
                this.mdfTitle = val.mdfTitle;
                this.informationVisble = false;
                this.isShow = true;
                this.$refs.formMdf.require_server(this.mdfid)
            },
            click_number_mdf(val) {
                this.order = val.orderData;
                this.informationVisble = val.informationVisble;
            },
            close_dialog(val) {
                if (this.isShow) this.informationVisble = true;
            },
            close_parcel() {
                this.isShow = false;
            },
            size_change(val) {
                this.$emit("size-change", val);
            },
            current_change(val) {
                this.$emit("current-change", val);
            },
            click_number(val) {
                if (this.$hasPermission(this.apis.url_package)) {
                    this.order.id = val;
                    this.informationVisble = true;
                } else {
                    this.$message({
                        type: 'error',
                        message: '没有查看包裹详情详情的权限'
                    });
                }
            },
            get_order_detail(order) {
                if (this.$hasPermission(this.apis.url_info)) {
                    this.$refs.formMdf.require_server(order.order_id);
                    this.mdfTitle = `查看订单号: ${order.order_number} 信息`;
                    this.mdfid = order.order_id;
                    this.mdfValue = true;
                    this.is_package = false;
                } else {
                    this.$message({
                        type: 'error',
                        message: '没有查看订单号详情的权限'
                    });
                }
            },
        },
        computed: {
          emptyText() {
              return this.isFirst?'等待请求数据中...':'暂无数据'
          }
        },
        props: {
            tableData: {
                required: true,
                type: Object
            },
            loading: {},
            isFirst: {
                required: true,
                type: Boolean
            }
        },
        components: {
            formMdf: require("./form-mdf.vue").default,
            parcelInformation: require('../../../entrepot/placeorder/parcel-information.vue').default,
            timeOut: require('../../local/time-out.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            trendsSelect: require('@/components/trends-select').default,
            invoicePreview: require('./invoice-preview').default,
        }
    }
</script>
