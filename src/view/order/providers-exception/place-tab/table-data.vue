<template>
    <div class="c-table-data">
        <div class="ml-sm mb-sm">
            <permission tag="trendsSelect"
                        class="inline ml-sm mr-xs"
                        type="primary"
                        :selects="partAllOptions"
                        :route="apis.url_providers_exception_export"
                        req-key="url_providers_exception_export"
                        @trigger="export_sku"
            ></permission>
            <permission tag="request-button"
                        class="inline"
                        :route="apis.url_providers_exception_batch_running_declare"
                        :mintime="200"
                        req-key="url_providers_exception_batch_running_declare"
                        @click="cancel_running_rule">批量重跑申报规则
            </permission>
            <permission tag="ElButton"
                        size="mini"
                        type="primary"
                        class="inline"
                        :route="apis.url_providers_exception_batch_invalid"
                        @click="click_batch">批量作废
            </permission>
            <permission tag="ElButton"
                        size="mini"
                        type="primary"
                        class="inline"
                        :route="apis.url_providers_exception_batch_change_package"
                        @click="change_package">更换包裹号
            </permission>
        </div>
        <el-table
                class="scroll-bar"
                :data="tableData.list"
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
        <export-field  v-model="exportVisable" :fields="fields"
                       :templates="templates"
                       :param="export_model_type"
                       title="请选择自定义导出字段"
                       :creat-excel="creat_excel"
                       @getTemplate="get_templates"
        ></export-field>
        <export-dialog v-model="export_visible"></export-dialog>
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
        <batch-invalidation
                v-model="batchInvalidationDialog"
                @submit="submit_remark">
        </batch-invalidation>
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
    import {url_package,url_providers_exception_batch_running_declare,
        api_providers_exception_batch_running_declare,url_providers_exception_export,
        api_providers_exception_export,url_providers_exception_batch_invalid,
        api_providers_exception_batch_invalid,api_providers_exception_batch_change_package,url_providers_exception_batch_change_package} from "../../../../api/shipment"
    import {url_info,api_get_export_title,api_orders_export} from '../../../../api/order-local'
    import {api_goods_export_template} from "../../../../api/product-library";
    import {downloadFile} from '../../../../lib/http';
    export default {
        permission: {
            url_package,
            url_info,
            url_providers_exception_batch_running_declare,
            url_providers_exception_export,
            url_providers_exception_batch_invalid,
            url_providers_exception_batch_change_package
        },
        data() {
            return {
                export_visible:false,
                exportVisable:false,
                export_type:'',
                ids:[],
                fields:[],
                templates:[],
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
                isShow:false,
                selectList:[],
                partAllOptions: [
                    {name: "部分导出", value: 0},
                    {name: "全部导出", value: 1}
                ],
                export_model_type:{
                    type:16
                },
                batchInvalidationDialog:false,
            }
        },
        filters:{
            fdatetime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val)
            }
        },
        mounted(){
            this.get_fields();
            this.get_templates();
        },
        methods:{
            order_export(params, head) {
                return this.$http(api_providers_exception_export, params, head).then(res => {
                    if (res.join_queue === 1) {
                        this.export_visible = true;
                        this.$message({type: "success", message: res.message || res});
                    } else {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let params = {
                            file_code: res.file_code,
                            page: this.tableData.page,
                            pageSize: this.tableData.pageSize,
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
            get_templates() {
                this.$http(api_goods_export_template, {type: 16}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    })
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            get_fields() {
                this.$http(api_get_export_title).then(res => {
                    this.fields=res
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            export_sku(val) {
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
            view_order(val){
                this.mdfValue = true;
                this.mdfid = val.mdfid;
                this.mdfTitle = val.mdfTitle;
                this.informationVisble = false;
                this.is_edit.edit = false;
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
                    this.is_edit.edit = true;
                } else {
                    this.$message({
                        type: 'error',
                        message: '没有查看订单号详情的权限'
                    });
                }
            },
            selection_change(val){
                this.selectList = val;
            },
            cancel_running_rule(){
                if(this.selectList.length===0){
                    this.$reqKey('url_providers_exception_batch_running_declare',false);
                    this.$message({type:'warning',message:'请勾选需要重跑申报规则的选项！'});
                    return
                }
                let package_id = this.selectList.map(row=>row.id);
                this.$http(api_providers_exception_batch_running_declare,{package_id}).then(res=>{
                    this.$message({type:'success',message:res.message||res});
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_providers_exception_batch_running_declare',false);
                    },200);
                });
            },
            click_batch(){
                console.log(this.selectList,'this.selectList');
                if(!this.selectList.length){
                    return this.$message({type: "warning", message: "请先勾选需要批量作废的订单"});
                }
                this.batchInvalidationDialog=true;
            },
            submit_remark(reason){
                let ids=[];
                if(this.selectList.length===1){
                    ids=this.selectList[0].order.map(row=>row.id);
                }else if(this.selectList.length>1) {
                    let id=this.selectList.reduce((pre,cur)=>{
                        return [...pre.order,...cur.order];
                    });
                    ids=id.map(row=>row.id);
                }
                let data={
                    reason:reason,
                    order_ids:ids
                };
                this.$http(api_providers_exception_batch_invalid, data).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.batchInvalidationDialog = false;
                    this.$emit('change');
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            change_package(){
                if(!this.selectList.length){
                    return this.$message({type: "warning", message: "请先勾选需要更换包裹号的订单"});
                }
                let number=this.selectList.map(row=>row.number);
                this.$http(api_providers_exception_batch_change_package, {numbers:number}).then(res => {
                    this.$message({type: "success", message: res.message||res});
                    this.$emit('change');
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            }
        },
        computed: {
            emptyText(){
                return this.isFirst?'等待请求数据中...':'暂无数据'
            }
        },
        props:{
            init_params:{
                type:Function
            },
            tableData:{
                required:true,
                type:Object
            },
            loading:{},
            isFirst: {
                required:true,
                type: Boolean
            }
        },
        components: {
            formMdf: require("./form-mdf.vue").default,
            parcelInformation:require('../../../entrepot/placeorder/parcel-information.vue').default,
            timeOut:require('../../local/time-out.vue').default,
            uiTip:require('../../../../components/ui-tip.vue').default,
            trendsSelect:require('../../../../components/trends-select').default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('../../../report/export-dialog').default,
            batchInvalidation:require('./batch-invalidation').default
        }
    }
</script>
