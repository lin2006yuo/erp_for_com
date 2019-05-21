<template>
    <page class="p-index">
        <card-search :search-data="searchData" @search="init"></card-search>
        <el-row>
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
            :total="total"
            :loading="loading"
            :table-data="tableData"
            @size-change="sizeChange"
            @current-change="currentChange"
            @select-check="selectCheck"
        ></table-data>
        <table-module></table-module>
        <!--<export-dialog v-model="visible"></export-dialog>-->
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
    export default {
        permission: {
            url_confirm_export
        },
        data() {
            return {
                searchData:{
                    channel_id:0,
                    warehouse_id:0,
                    carrier_id:0,
                    dateRange:'',
                    date_b:new Date(Date.now()).setHours(0, 0, 0, 0),
                    date_e:Date.now(),
                    shipping_ids: ''
                },
                tableData: {
                    list: [],
                    page: 1,
                    pageSize: 20
                },
                firstLoading: false,
                loading: false,
                total: 1,
                partAllOptions: [
                    {name: "部分导出", value: 0},
                    {name: "全部导出", value: 1}
                ],
                checkData: [],
                visible: false,
                export_type: 0,
                exportVisable: false,
                fields: [],
                templates: [],
                export_model_type: {
                    type: 15
                },
            }
        },
        mounted() {
            this.get_fields()
            this.get_templates()
        },
        methods: {
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
            init() {
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
            sizeChange(val) {
                this.tableData.page = 1
                this.tableData.pageSize = val
                this.init()
            },
            currentChange(val) {
               this.tableData.page = val
                this.init()
            },
            selectCheck(val) {
                this.checkData = val.map(row => {
                    return row.id
                })
            },
            export_excel(val) {
                if(val.value === 0 && this.checkData.length <= 0) return this.$message({
                    type: 'warning',
                    message: '未选择'
                })
                this.export_type = val.value
                this.exportVisable = true
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
        },
        components: {            trendsSelect:require('@/components/trends-select').default,

            cardSearch: require('./card-search.vue').default,
            tableData: require('./table-data.vue').default,
            exportDialog:require('../export-dialog.vue').default,
            exportField: require("@/components/export-field").default,
            tableModule:require('./table-module.vue').default,
        }
    }
</script>
