<template>
    <div class="c-abnormal-table">
        <el-row class="mb-sm mt-sm">
            <permission tag="trendsSelect"
                        class="inline ml-sm mr-xs"
                        type="primary"
                        :selects="selectNames"
                        :route="apis.url_package_exception_export"
                        req-key="url_package_exception_export"
                        @trigger="export_data"
            ></permission>
        </el-row>
        <el-table class="scroll-bar"
                  :data="tableDatas.list"
                  v-resize="{height:38}"
                  v-loading="loading"
                  element-loading-text="玩命加载中..."
                  :default-sort = "{prop: 'uploaded_deadline', order: 'descending'}"
                  @selection-change="selection_change"
                  highlight-current-row>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                    type="selection"
                    width="30">
            </el-table-column>
            <el-table-column label="包裹号"
                             inline-template>
                <div>
                    <ui-tip :is-operate="true"
                            :content="row.number"
                            @cur-click="click_number(row)"
                            :width="98">
                    </ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="订单号" inline-template >
                <template v-for="item in row.order">
                    <ui-tip :is-operate="true" :content="item.order_number" @cur-click="get_order_detail(item,row)" :width="98"></ui-tip>
                </template>
            </el-table-column>
            <el-table-column label="发货仓库" inline-template >
                <div>{{row.warehouse_id}}</div>
            </el-table-column>
            <el-table-column label="运输方式" inline-template width="240">
                <div>
                    <ui-tip :content="row.shipping_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="目的地" inline-template >
                <div>{{row.country_code}}</div>
            </el-table-column>
            <el-table-column label="异常原因" inline-template>
            <span class="s-info-title" :title="row.status_name">{{row.status_name}}</span>
            </el-table-column>
            <el-table-column label="配货时间" inline-template >
                <div>{{row.distribution_time | fdatetime}}</div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="$emit('size_change',$event)"
                @current-change="$emit('current_change',$event)"
                :current-page="tableDatas.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="tableDatas.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableDatas.total">
        </el-pagination>
        <export-field  v-model="exportVisable"
                       :fields="fields"
                       :templates="templates"
                       :param="export_model_type"
                       title="请选择自定义导出字段"
                       :creat-excel="creat_excel"
                       @getTemplate="get_templates"
        ></export-field>
        <export-dialog v-model="export_visible"></export-dialog>
        <parcel-information v-model="informationShow"
                            @view-order="view_order"
                            :order="order"
                            @close-parcel="close_parcel"
        ></parcel-information>
        <form-mdf ref="formMdf"
                  :mdfid="mdfid"
                  v-model="mdfValue"
                  :is-edit="is_edit"
                  :is-package="is_package"
                  @close-dialog="close_dialog"
                  @click-number="click_number_mdf"
                  :title="mdfTitle">
        </form-mdf>
    </div>
</template>

<style lang="stylus" scoped>

</style>

<script>
    import {url_package,url_package_exception_export,api_package_exception_export,
        api_package_exception_title} from "../../../../api/shipment";
    import {url_info,api_get_export_title,api_orders_export} from '../../../../api/order-local';
    import {api_goods_export_template} from "../../../../api/product-library";
    import {downloadFile} from '../../../../lib/http';
    export default {
        name: "table-data",
        permission: {
            url_package,url_info,
            url_package_exception_export
        },
        data() {
            return {
                selectNames: [
                    {name: "部分导出", value: 0},
                    {name: "全部导出", value: 1}
                ],
                selectList:[],
                informationShow:false,
                order:{},
                mdfid: 0,
                mdfValue:false,
                is_edit:{
                    edit:false
                },
                is_package:false,
                mdfTitle:'',
                isShow:false,
                exportVisable:false,
                fields:[],
                templates:[],
                export_model_type:{
                    type:18
                },
                export_type:'',
                export_visible:false
            }
        },
        mounted() {
            this.get_fields();
            this.get_templates();
        },
        computed: {
            emptyText(){
                return this.isFirst?'等待请求数据中...':'暂无数据'
            }
        },
        watch: {},
        methods: {
            get_fields() {
                this.$http(api_package_exception_title).then(res => {
                    this.fields=res
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            get_templates() {
                this.$http(api_goods_export_template, {type: 18}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    })
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            export_data(val){
                if (val.value === 0 && this.selectList.length <= 0) return this.$message({
                    type: "warning",
                    message: "请先选择需要导出的数据"
                });
                this.export_type = val.value;
                this.exportVisable = true;
            },
            creat_excel(param) {
                let fields = param.field.join(',');
                let data = '';
                switch (this.export_type) {
                    case 0://部分
                        data = {
                            ids: this.selectList.map(row => {
                                if (typeof row === 'object') {
                                    return row.id
                                } else {
                                    return row
                                }
                            }),
                            export_type: this.export_type
                        };
                        Object.assign(data,this.init_params());
                        return this.order_export(data, {
                            'X-Result-Fields': fields,
                            contentType: 'application/x-www-form-urlencoded'
                        });
                        break;
                    case 1://全部
                        data = this.init_params();
                        this.$set(data, 'export_type', this.export_type);
                        return this.order_export(data, {
                            'X-Result-Fields': fields,
                            contentType: 'application/x-www-form-urlencoded'
                        });
                        break;
                }
            },
            order_export(params, head) {
                return this.$http(api_package_exception_export, params, head).then(res => {
                    if (res.join_queue === 1) {
                        this.export_visible = true;
                        this.$message({type: "success", message: res.message || res});
                    } else {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let params = {
                            file_code: res.file_code,
                            page: this.tableDatas.page,
                            pageSize: this.tableDatas.pageSize,
                        };
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                        this.$message({type: "success", message: '导出成功' || res});
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
                return Promise.resolve()
            },
            selection_change(val){
                this.selectList = val;
            },
            click_number(val){
                if (this.$hasPermission(this.apis.url_package)) {
                    this.order.id = val.number;
                    this.informationShow = true;
                } else {
                    this.$message({
                        type: 'error',
                        message: '没有查看包裹详情详情的权限'
                    });
                }
            },
            get_order_detail(item,row){
                if (this.$hasPermission(this.apis.url_info)) {
                    this.$refs.formMdf.require_server(item.id);
                    this.mdfTitle = `查看订单号: ${item.order_number} 信息`;
                    this.mdfid = item.id;
                    this.is_edit.edit = true;
                    this.is_package = false;
                    this.mdfValue = true;
                } else {
                    this.$message({
                        type: 'error',
                        message: '没有查看订单号详情的权限'
                    });
                }
            },
            view_order(val){
                this.mdfValue = true;
                this.mdfid = val.mdfid;
                this.mdfTitle = val.mdfTitle;
                this.informationShow = false;
                this.is_edit.edit = false;
                this.isShow = true;
                this.$refs.formMdf.require_server(this.mdfid)
            },
            close_parcel(){
                this.isShow = false;
            },
            close_dialog(){
                if(this.isShow) this.informationShow = true;
            },
            click_number_mdf(val){
                this.order = val.orderData;
                this.informationShow = val.informationShow;
            }
        },
        filters:{
            fdatetime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val)
            }
        },
        props: {
            tableDatas:{
                type:Object,
                required:true
            },
            loading:{
                type:Boolean,
                required:true
            },
            init_params:{
                type:Function
            },
            isFirst: {
                required:true,
                type: Boolean
            }
        },
        components: {
            trendsSelect:require('../../../../components/trends-select').default,
            uiTip:require('../../../../components/ui-tip.vue').default,
            parcelInformation:require('../../../entrepot/placeorder/parcel-information.vue').default,
            formMdf: require("../package-tab/form-mdf").default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('../../../report/export-dialog').default,
        },
    }
</script>

