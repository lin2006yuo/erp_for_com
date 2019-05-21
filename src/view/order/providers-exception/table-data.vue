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
            :default-sort = "{prop: 'uploaded_deadline', order: 'descending'}"
            highlight-current-row
        >
            <!--<el-table-column type="selection" width="35" align="center"></el-table-column>-->
            <el-table-column label="包裹号" inline-template width="130">
                <div>
                    <ui-tip :is-operate="true" :content="row.number" @cur-click="click_number(row.number)" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="订单号" inline-template width="180">
                <template v-for="item in row.order">
                    <ui-tip :is-operate="true" :content="item.order_number" @cur-click="get_order_detail(item)" :width="98"></ui-tip>
                </template>
            </el-table-column>
            <el-table-column label="发货仓库" inline-template width="70">
                <div>{{row.warehouse_id}}</div>
            </el-table-column>
            <el-table-column label="运输方式" inline-template width="180">
                <div>
                    <ui-tip :content="row.shipping_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <!--<el-table-column label="物流商单号" inline-template width="120">-->
                <!--<div>{{row.process_code}}</div>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="物流跟踪号" inline-template width="120">-->
                <!--<div>{{row.shipping_number}}</div>-->
            <!--</el-table-column>-->
            <el-table-column label="目的地" inline-template width="80">
                <div>{{row.country_code}}</div>
            </el-table-column>
            <el-table-column label="配货时间" inline-template width="150">
                <div>{{row.distribution_time | fdatetime}}</div>
            </el-table-column>
            <el-table-column label="物流错误信息" inline-template>
                <span class="s-info-title" :title="row.providers_error_info">{{row.providers_error_info}}</span>
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
    .c-table-data{
        .operate{
            color: #6699FF;
        }
        .s-info-title{
            WORD-WRAP: break-word;
            TABLE-LAYOUT: fixed;
            word-break:normal;
        }
    }
</style>
<script>
    import {url_package} from "../../../api/shipment"
    import {url_info} from '../../../api/order-local'
    import { url_get_pdf} from '../../../api/pickings';
    import {url_get_packages,url_get_tracking,url_free_packages,
        url_post_print,url_print_invoice} from '../../../api/packages';
    export default {
        permission: {
            url_package,url_info,url_get_packages,url_free_packages,url_get_tracking,url_post_print,url_get_pdf,url_print_invoice
        },
        data() {
            return {
                mdfid: 0,
                mdfValue: false,
                mdfTitle: "",
                informationVisble: false,
                order: {},
                is_edit:{
                    edit:false
                },
                //是否是从包裹列表进入
                is_package:false,
                token:'',
                numberList:[],
                print_width:100,
                print_height:100,
                isShow:false,
                selectList:[],
                canTracking:false,
                previewVisible:false,
                printParams:{
                    package_ids:[]
                },
                invoiceApi:''
            }
        },
        filters:{
            fdatetime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val)
            }
        },
        methods:{
            view_order(val){
                this.mdfValue = true;
                this.mdfid = val.mdfid;
                this.mdfTitle = val.mdfTitle;
                this.informationVisble = false;
                this.isShow = true;
                this.$refs.formMdf.require_server(this.mdfid)
            },
            click_number_mdf(val){
                this.order = val.orderData;
                this.informationVisble = val.informationVisble;
            },
            close_dialog(val){
                if(this.isShow) this.informationVisble = true;
            },
            close_parcel(){
                this.isShow = false;
            },
            size_change(val){
                this.$emit("size-change",val);
            },
            current_change(val){
                this.$emit("current-change",val);
            },
            click_number(val){
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
            get_order_detail(row){
                if (this.$hasPermission(this.apis.url_info)) {
                    this.$refs.formMdf.require_server(row.id);
                    this.mdfTitle = `查看订单号: ${row.order_number} 信息`;
                    this.mdfid = row.id;
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
        props:{
            tableData:{
                required:true,
                type:Object
            },
            loading:{}
        },
        components: {
            formMdf: require("./form-mdf.vue").default,
            parcelInformation:require('../../entrepot/placeorder/parcel-information.vue').default,
            timeOut:require('../local/time-out.vue').default,
            uiTip:require('../../../components/ui-tip.vue').default,
            trendsSelect:require('../../../components/trends-select').default,
            invoicePreview:require('./invoice-preview').default,
        }
    }
</script>
