<template>
    <page class="p-index">
        <card-search :form="form"
                     :clears="clears"
                     @search="search"
        ></card-search>
        <div class="mt-sm mb-sm ">
            <permission tag="trendsSelect"
                        class="inline ml-sm"
                        type="primary"
                        :route="apis.url_brush_orders_export"
                        :selects="partAllOptions"
                        @trigger="export_sku"></permission>
            <permission tag="request-button"
                        class="ml-sm inline"
                        :route="apis.url_brush_orders"
                        req-key="url_brush_orders"
                        :mintime="200"
                        @click="start_sync">开始同步</permission>
        </div>
        <div>
            <data-table
                    :is-load="isLoad"
                    :first-loading="firstLoading"
                    :tables="tables"
                    @size-change="size_change"
                    @page-change="page_change"
                    @cur-operate="cur_operate"
                    @save-brush="save_brush"
                    @sort-click="sort_click"
                    @change="change"
                    @change-all="change_all"
                    @cancel-invalid="cancel_invalid"
            ></data-table>
        </div>
        <import-excel v-model="importExcelShow"
                      :api_port="apiPort"
                      :code="code" :file_name="`下载跟踪号导入模板`"></import-excel>
        <export-field :param="export_model_type" v-model="exportVisable" :fields="fields" :templates="templates"
                      @getTemplate="get_templates" title="请选择自定义导出字段" :creat-excel="creat_excel"></export-field>
        <export-dialog v-model="export_visible"></export-dialog>
    </page>
</template>
<style lang="stylus">
    .width-default{
        width:250px;
    }
    .width-large{
        width:450px;
    }
    .date.el-date-editor{
        width:120px;
        height:26px;
        font-size:1.2rem;
        .el-date-editor__trigger.el-icon{
            top:-7px;
        }
    }
    .date>.el-date-editor__editor{
        height:26px;
    }
</style>
<script>
    import {
        api_brush_orders_list,
        api_status_list,
        api_account_list,
        api_get_seller,
        api_get_channel,
        api_brush_orders,
        api_post_tracking,
        url_info,url_update,
        url_brush_shipments,
        url_brush_orders,
        url_cancel_invalid,
        api_brush_orders_export,
        url_brush_orders_export,
        api_orders_export_title
    } from '../../../api/order-local';
    import {api_goods_export_template} from "../../../api/product-library";
    import {downloadFile} from '../../../lib/http';
    export default {
        permission:{
            url_info,
            url_update,
            url_brush_shipments,
            url_brush_orders_export,
            url_brush_orders,
            url_cancel_invalid
        },
        page: {
            multiple: true,
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                firstLoading:true,
                isLoad: false,
                activeData:[],
                tables: {
                    page: 1,
                    pageSize: 50,
                    totalSize: 0,
                    lists: []
                },
                zf_status: '',
                form: {
                    shipping:[],
                    order_status: [],
                    channel_id: 0,
                    account_id: "",
                    batchText: '',
                    warehouse_id: "",
                    shipping_id: "",
                    site: '',
                    snDate: 'transaction_date',
                    snType: 'channel_order_number',
                    seller_id: "",
                    connd_value: '',
                    time: 'transaction_date',
                    sort_field: "",
                    sort_type: "",
                    date_b: (Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now(),
                    delivery_type:"",
                },
                clears:{
                    shipping:[],
                    order_status: [],
                    channel_id: 0,
                    snDate: 'transaction_date',
                    snType: 'channel_order_number',
                    time: 'transaction_date',
                    date_b: (Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now(),
                },
                operateButtons:[
                    {label:'处理',value:2,apis:url_update, disabled:false},
                    {label:'查看',value:1,apis:url_info},
                    {label:"同步发货设置",value:3,apis:url_brush_shipments, disabled:false}
                ],
                partAllOptions: [
                    {name: "部分导出", value: 0},
                    {name: "全部导出", value: 1}
                ],
                importExcelShow: false,
                apiPort: api_post_tracking,
                code: 'tracking',
                batch_api: '',
                batch_action: {},
                fields: [],
                templates: [],
                export_type: '',
                export_model_type: {
                    type: 8
                },
                export_visible: false,
                exportVisable: false,
            }
        },
        mounted(){
            this.get_fields();
            this.get_templates();
            this.init();
        },
        computed:{
            curId(){
                let idList = [];
                if(this.activeData&&this.activeData.length>0){
                    this.activeData.forEach(row=>{
                        idList.push(row.id);
                    });
                }
                return idList;
            }
        },
        methods:{
            get_fields() {
                this.$http(api_orders_export_title).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            get_templates() {
                this.$http(api_goods_export_template, {type: 8}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    })
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            export_sku(val) {
                if (val.value === 0 && this.activeData.length === 0) return this.$message({
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
                            ids: this.activeData.map(row => {
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
                return this.$http(api_brush_orders_export, params, head).then(res => {
                    if (res.join_queue === 1) {
                        this.$message({type: "success", message: res.message || res});
                        this.export_visible = true;
                    } else {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let params = {
                            file_code: res.file_code,
                            page: this.tables.page,
                            pageSize: this.tables.pageSize,
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
            init_params(){
                let params = {
                    page:this.tables.page,
                    pageSize:this.tables.pageSize,
                    snDate:this.form.snDate,
                    seller_id:this.form.seller_id,
                    delivery_type:this.form.delivery_type,
                    snType:this.form.snType,
                };
                this.form.sort_field && (params.sort_field = this.form.sort_field);
                this.form.sort_type && (params.sort_type = this.form.sort_type);
                this.form.order_status.length>0 && (params.status = this.form.order_status[this.form.order_status.length-1]);
                this.form.channel_id && (params.channel_id = this.form.channel_id);
                this.form.account_id && (params.account_id = this.form.account_id);
                this.form.warehouse_id && (params.warehouse_id = this.form.warehouse_id);
                this.form.shipping.length>1 && (params.shipping_id = this.form.shipping[1]);
                this.form.site && (params.site_code = this.form.site);
                this.form.snDate &&(params.snDate = this.form.snDate);
                if(!!this.form.date_b){
                    let b = new Date(this.form.date_b);
                    params.date_b = datef("YYYY-MM-dd",b/1000);
                }else{
                    params.date_b="";
                }
                if(!!this.form.date_e){
                    let e = new Date(this.form.date_e);
                    params.date_e = datef("YYYY-MM-dd",e/1000);
                }else{
                    params.date_e="";
                }
                let curString = this.form.batchText.replace(new RegExp(' ','gm'),'\n');
                let cur = curString.split('\n').filter(row=>!!row);
                if(cur&&cur.length>1){
                    params.snText = cur.map(row=>{
                        return row.trim();
                    });
                }else if(cur&&cur.length===1){
                    params.snText = this.form.batchText;
                }
                return params
            },
            search(){
                this.init();
            },
            clear_search(){
                this.init();
            },
            start_sync(){
                if(this.curId&&this.curId.length<=0){
                    this.$reqKey('url_brush_orders',false);
                    return this.$message({type:"warning",message:"请选择需要同步的数据"});
                }
                let params = {
                    order_ids:this.curId
                };
                this.$http(api_brush_orders,params).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.init();
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_brush_orders',false);
                    },200);
                });
            },
            cancel_invalid(){
                this.init();
            },
            init(){
                this.isLoad = true;
                let params = this.init_params();
                this.tables.lists = [];
                this.$http(api_brush_orders_list, params).then(res=>{
                    this.tables.totalSize=res.count;
                    let lists = res.data.map(row=>{
                        row.isCheck = false;
                        row.show = false;
                        return row;
                    });
                    this.tables.lists = lists;
                    this.tables.lists.forEach(row=>{
                        this.$set(row,'operateButtons',window.clone(this.operateButtons));
                        if(row.status === 4294967295){
                            row.operateButtons[1].disabled = true;
                            let cur = {label:'取消作废',value:4,apis:url_cancel_invalid, disabled:false};
                            row.operateButtons.push(cur);
                        }
                    });
                    this.isLoad = false;
                    this.firstLoading = false
                }).catch(code=>{
                    this.isLoad = false;
                    console.log(code.message);
                });
            },
//           -------------------------------------------------- 分页
            size_change(size){
                this.tables.pageSize=size;
                this.init();
            },
            page_change(page){
                this.tables.page=page;
                this.init();
            },
            cur_operate(){
                this.init();
            },
            save_brush(){
                this.init();
            },
            change(val){
                this.activeData = val;
                console.log("this.activeData",this.activeData);
            },
            change_all(data){
                this.activeData = data;
            },
//            表格升降序
            sort_click(val){
                    switch(val.label){
                        case "付款状态":
                            this.form.sort_field = "pay_time";
                            break;
                        case "支付总额":
                            this.form.sort_field = "pay_fee";
                            break;
                        case "目的地":
                            this.form.sort_field = "country_code";
                            break;
                        case "下单时间":
                            this.form.sort_field = "order_time";
                            break;
                        case "最迟发货时间":
                            this.form.sort_field = "uploaded_deadline";
                            break;
                    }
                    this.form.sort_type = val.order;
                    this.init();
            },


        },
        components:{
            cardSearch:require('../local/card-search.vue').default,
            brushShipment:require('./brush-shipments.vue').default,
            dataTable:require('./data-table.vue').default,
            trendsSelect: require('../../../components/trends-select.vue').default,
            importExcel: require('../../product/excel-update/import-excel.vue').default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('../../report/export-dialog').default,
        }
    }
</script>
