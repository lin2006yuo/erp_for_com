<template>
        <page class="p-delivery-index">
            <card-search
                    class="mb-xs"
                    @search="search"
                    :search-data="searchData">
            </card-search>
            <el-row class="mb-xs">
                <permission class="ml-sm delivery_comfirm_btn"
                            tag="trendsSelect"
                            type="primary"
                            size="mini"
                            :route="apis.url_confirm_export"
                            :selects="partAllOptions"
                            @trigger="export_excel">
                </permission>
                <request-button class="mt-xs mb-xs ml-sm"
                                :disabled="this.tableData.list.length === 0"
                                :timeout="0"
                                :request="exports">导出汇总</request-button>
            </el-row>
            <table-data
                    @can-export='can_export'
                    :table-data="tableData"
                    :loading="loading"
                    :first-loading="firstLoading"
                    :total="total"
                    @select-check="selectCheck"
                    @size-change="handle_size_change"
                    @current-change="handle_current_change">
            </table-data>
            <export-dialog v-model="visible"></export-dialog>
            <export-field :param="export_model_type" v-model="exportVisable" :fields="fields" :templates="templates"
                          @getTemplate="get_templates" title="请选择自定义导出字段" :creat-excel="creat_excel"></export-field>
        </page>
    </template>
    <style lang="stylus">
        .delivery_comfirm_btn {
            display inline-block
        }
    </style>
    <script>
        import {api_get_confirm,api_confirm_export,api_get_export_title,url_confirm_export,api_confirm_export_all,api_get_export_title_all} from '../../../api/delivery-list';
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
                        channel_id:'',
                        warehouse_id:'',
                        carrier_id:'',
                        dateRange:'',
                        date_b:new Date(Date.now()).setHours(0, 0, 0, 0),
                        date_e:Date.now(),
                        shipping_ids: '',
                        collector_id: '',
                        country_code: '',
                        sum: ''
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
                    //汇总导出excel
                    fields_all: [],
                    exportVisable: false,
                }
            },
            mounted(){
                this.init();
                this.get_fields();
                this.get_templates();
                this.get_fields_all()
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
                    const params = {
                        export_type: 1
                    }
                    this.$http(api_get_export_title, params).then(res => {
                        this.fields = res;
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code})
                    });
                },
                //汇总导出的excel表头
                get_fields_all() {
                    const params = {
                        export_type: 2
                    }
                    this.$http(api_get_export_title, params).then(res => {
                        this.fields_all = res
                        console.log({fields_all: this.fields_all})
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code})
                    })
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
                    let fields = '';
                    if(param.field) {
                        fields = param.field.join(',');
                    }
                    let params = this.get_params();
                    switch (this.export_type) {
                        case 0://部分
                            let data_part = {
                                ...params,
                                ids: this.checkData,
                                export_type: this.export_type
                            };
                            return this.order_export(api_confirm_export,data_part, {
                                'X-Result-Fields': fields,
                                contentType: 'application/x-www-form-urlencoded'
                            });
                        case 1://全部
                            let data_all = {
                                ...params,
                                export_type: this.export_type
                            };
                            return this.order_export(api_confirm_export,data_all, {
                                'X-Result-Fields': fields,
                                contentType: 'application/x-www-form-urlencoded'
                            });
                        case 2: //导出汇总
                            return this.order_export(api_confirm_export_all,params, {
                                contentType: 'application/x-www-form-urlencoded',
                                timeout: INFINITE
                            })
                    }
                },
                order_export(api, params, head) {
                    return this.$http(api, params, head).then(res => {
                        //队列下载
                        if (res.join_queue === 1) {
                            this.visible = true;
                            this.$message({type: "success", message: res.message || res});
                            //直接下载
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
                    });
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
                    }).filter(row => row !== '汇总');
                },
                get_params() {
                    let data = this.deal_time(this.searchData);
                    if(this.searchData.shipping_ids.length >0){
                        data.shipping_ids = JSON.stringify(data.shipping_ids);
                    }else{
                        data.shipping_ids = '';
                    }
                    data.page = this.tableData.page;
                    data.pageSize = this.tableData.pageSize;
                    return data
                },
                init(){
                    this.loading = true;
                    const data = this.get_params();
                    this.$http(api_get_confirm,data).then(res=>{
                        let sum = res.sum ? Object.assign({id: '汇总'},JSON.parse(res.sum)): '';
                        sum && res.data.unshift(sum);
                        this.tableData.list = res.data;
                        this.total = res.count;
                        this.loading = false;
                        this.firstLoading = false
                    }).catch(code=>{
                        this.loading = false;
                        this.firstLoading = false;
                        this.tableData.list = [];
                        console.log(code)
                    })
                },
                can_export(flag){
                    this.hasData = flag;
                },
                handle_size_change(val) {//------------分页
                    this.tableData.page = 1;
                    this.tableData.pageSize = val;
                    this.init();
                },
                handle_current_change(val) {//------------分页
                    this.tableData.page = val;
                    this.init();
                },
                exports() {
                    this.export_type = 2
                    return this.creat_excel({})
                }
            },
            components:{
                trendsSelect:require('@/components/trends-select').default,
                exportDialog:require('../export-dialog.vue').default,
                cardSearch:require('./card-search.vue').default,
                tableData:require('./table-data.vue').default,
                exportField: require("@/components/export-field").default,
                requestButton:require('@/global-components/request-button').default
            }
        }
    </script>
