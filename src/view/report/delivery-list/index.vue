<template>
        <page class="p-index">
            <card-search
                    class="mb-xs"
                    @search="search"
                    :search-data="searchData">
            </card-search>
            <el-row class="mb-xs">
                <permission class="ml-sm"
                            tag="trendsSelect"
                            type="primary"
                            size="mini"
                            :route="apis.url_confirm_export"
                            :selects="partAllOptions"
                            @trigger="export_excel">
                </permission>
            </el-row>
            <table-data
                    @can-export='canExport'
                    :table-data="tableData"
                    :loading="loading"
                    :first-loading="firstLoading"
                    :total="total"
                    @select-check="selectCheck"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange">
            </table-data>
            <export-dialog v-model="visible"></export-dialog>
            <export-field :param="export_model_type" v-model="exportVisable" :fields="fields" :templates="templates"
                          @getTemplate="get_templates" title="请选择自定义导出字段" :creat-excel="creat_excel"></export-field>
        </page>
    </template>
    <style lang="stylus">

    </style>
    <script>
        import {api_get_confirm,api_confirm_export,api_get_export_title,url_confirm_export} from '../../../api/delivery-list';
        import {api_goods_export_template} from "../../../api/product-library";
        import {downloadFile} from '../../../lib/http';
        export default{
            page:{
                devinfo:{
                    frontEnd:'汤敏',
                    backEnd:'何程',
                    createTime:'2018-7-23',
                    updateTime:'2018-7-23'
                }
            },
            refresh(){
                this.init();
            },
            permission: {
                url_confirm_export
            },
            data(){
                return{
                    searchData:{
                        channel_id:0,
                        warehouse_id:'',
                        carrier_id:'',
                        dateRange:'',
                        date_b:new Date(Date.now()).setHours(0, 0, 0, 0),
                        date_e:Date.now(),
                        shipping_ids: ''
                    },
                    hasData:true,
                    tableData:{
                        list:[],
                        page:1,
                        pageSize:20,
                    },
                    total:1,
                    loading:false,
                    firstLoading: true,
                    visible:false,
                    checkData:[],
                    action:{},
                    partAllOptions: [
                        {name: "部分导出", value: 0},
                        {name: "全部导出", value: 1}
                    ],
                    export_type: '',
                    export_model_type: {
                        type: 15
                    },
                    templates: [],
                    fields: [],
                    exportVisable: false,
                }
            },
            mounted(){
                this.init();
                this.get_fields();
                this.get_templates();
            },
            methods:{
                search(){
                    this.init();
                },
                //处理年月日
                deal_time(searchData){
                    //处理年月日 YYYY-MM-dd
                    let data=clone(searchData);
                    if(searchData.date_b){
                        data.date_b=datef('YYYY-MM-dd HH:mm:ss', searchData.date_b/1000);
                    }else {
                        data.date_b='';
                    }
                    if(searchData.date_e){
                        data.date_e=datef('YYYY-MM-dd HH:mm:ss', searchData.date_e/1000);
                    }else {
                        data.date_e='';
                    }
                    return data;
                },
                get_fields() {
                    this.$http(api_get_export_title).then(res => {
                        this.fields = res;
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code})
                    });
                },
                get_templates() {
                    this.$http(api_goods_export_template, {type: 15}).then(res => {
                        res.forEach(row => {
                            row.value = row.name;
                        })
                        this.templates = res;
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code})
                    });
                },
                creat_excel(param) {
                    let fields = param.field.join(',');
                    let data = '';
                    let params = {
                        export_type: this.export_type,
                        channel_id: this.searchData.channel_id,
                        warehouse_id: this.searchData.warehouse_id,
                        carrier_id: this.searchData.carrier_id,
                        dateRange: this.searchData.dateRange,
                        date_b: this.searchData.date_b ? datef('YYYY-MM-dd HH:mm:ss', this.searchData.date_b/1000) : '',
                        date_e: this.searchData.date_e ? datef('YYYY-MM-dd HH:mm:ss', this.searchData.date_e/1000) : '',
                        shipping_ids: this.searchData.shipping_ids.length === 0 ? '' : this.searchData.shipping_ids.join(','),
                        page: this.tableData.page,
                        pageSize: this.tableData.pageSize
                    };
                    switch (this.export_type) {
                        case 0://部分
                            data = {
                                ids: this.checkData,
                                export_type: this.export_type
                            };
                            Object.assign(data,params);
                            return this.order_export(data, {
                                'X-Result-Fields': fields,
                                contentType: 'application/x-www-form-urlencoded'
                            });
                            break;
                        case 1://全部
                            data = params;
                            this.$set(data, 'export_type', this.export_type);
                            return this.order_export(data, {
                                'X-Result-Fields': fields,
                                contentType: 'application/x-www-form-urlencoded'
                            });
                            break;
                    }
                },
                order_export(params, head) {
                    return this.$http(api_confirm_export, params, head).then(res => {
                        if (res.join_queue === 1) {
                            this.visible = true;
                            this.$message({type: "success", message: res.message || res});
                        } else {
                            let url = config.apiHost + 'downloadFile/downExportFile';
                            let params = {
                                file_code: res.file_code,
                                page: this.searchData.page,
                                pageSize: this.searchData.pageSize,
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
                export_excel(val){
                    // this.export_type = val.value;
                    // val.action.call(this,val);
                    if (val.value === 0 && this.checkData.length <= 0) return this.$message({
                        type: "warning",
                        message: "请先选择需要导出的数据"
                    });
                    this.export_type = val.value;
                    this.exportVisable = true;
                },
                selectCheck(select){
                    this.checkData = select.map(row=>{
                        return row.id;
                    });
                },
                // batch_export(data){
                //     return this.$http(api_confirm_export, data).then(res=>{
                //         this.visible = true;
                //         return Promise.resolve();
                //     }).catch(code=>{
                //         this.$message({type:"error",message:code.message || code});
                //     });
                // },
                init(){
                    this.loading = true;
                    let data = this.deal_time(this.searchData);
                    if(this.searchData.shipping_ids.length >0){
                        data.shipping_ids = JSON.stringify(data.shipping_ids);
                    }else{
                        data.shipping_ids = '';
                    }
                    this.$set(data,'page',this.tableData.page);
                    this.$set(data,'pageSize',this.tableData.pageSize);
                    this.$http(api_get_confirm,data).then(res=>{
                        this.tableData.list = res.data;
                        this.total = res.count;
                        this.loading = false;
                        this.firstLoading = false
                    }).catch(code=>{
                        this.loading = false;
                        this.firstLoading = false;
                        console.log(code)
                    })
                },
                canExport(flag){
                    this.hasData = flag;
                },
                handleSizeChange(val) {//------------分页
                    this.tableData.page = 1;
                    this.tableData.pageSize = val;
                    this.init();
                },
                handleCurrentChange(val) {//------------分页
                    this.tableData.page = val;
                    this.init();
                },
            },
            components:{
                trendsSelect:require('@/components/trends-select').default,
                exportDialog:require('../export-dialog.vue').default,
                cardSearch:require('./card-search.vue').default,
                tableData:require('./table-data.vue').default,
                exportField: require("@/components/export-field").default,
            }
        }
    </script>
