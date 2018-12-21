<template>
    <page class="p-index">
        <search-module :search-data="searchData"
                       :clears="clears"
                       @select-button="select_button"
                       @submit="submit"
                       @search="search"></search-module>
        <div class="mb-sm mt-sm">
            <permission tag="request-button"
                class="inline ml-sm mr-xs"
                type="primary"
                :route="apis.url_first_order_export"
                @click="export_sku">全部导出</permission>
        </div>
        <table-module :loading="loading"
                      :table-data="tableData"
                      :search-data="searchData"
                      :first-loading="firstLoading"
                      :total="total"
                      @handle-size-change="handle_size_change"
                      @handle-current-change="handle_current_change"></table-module>
        <export-dialog v-model="export_visible"></export-dialog>
        <export-field :param="export_model_type" v-model="exportVisable" :fields="fields" :templates="templates"
                      @getTemplate="get_templates" title="请选择自定义导出字段" :creat-excel="creat_excel"></export-field>
    </page>
</template>

<style lang="stylus" scoped>

</style>

<script>
    import {api_first_order_sku_list,api_first_order_export,api_get_export_title,url_first_order_export} from '../../../api/first-order-sku';
    import {api_goods_export_template} from "../../../api/product-library";
    import {downloadFile} from '../../../lib/http';
    export default {
        page: {
            devinfo: {
                frontEnd: '钱宇琨',
                backEnd: '何程',
                createdTime: '2018-09-20',
                updateTime: '2018-09-20'
            }
        },
        name: "index",
        permission: {
            url_first_order_export
        },
        refresh(){
            this.init();
        },
        data(){
            return {
                loading:false,
                firstLoading:true,
                total:1,
                searchData:{
                   channel_id: '',
                   developer:'',
                   sku:'',
                   snDate:'order_time',
                   date_b:(Date.now()-(24*60*60*1000)),
                   date_e:(Date.now()-(24*60*60*1000)),
                   page:1,
                   pageSize:20
                },
                clears:{
                    channel_id: '',
                    developer:'',
                    sku:'',
                    snDate:'order_time',
                    date_b:'',
                    date_e:'',
                    page:1,
                    pageSize:20
                },
                tableData:[],
                fields: [],
                templates: [],
                export_model_type: {
                    type: 20
                },
                export_visible: false,
                exportVisable: false,
            }
        },
        mounted(){
            this.init();
            this.get_fields();
            this.get_templates();
        },
        methods:{
            export_sku(){
                this.exportVisable = true;
            },
            get_fields() {//获取导出字段
                this.$http(api_get_export_title).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            get_templates() {
                this.$http(api_goods_export_template, {type: 20}).then(res => {
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
                let data = this.init_params();
                this.$set(data,'export_type',1);
                return this.order_export(data, {
                    'X-Result-Fields': fields,
                    contentType: 'application/x-www-form-urlencoded'
                });
            },
            order_export(params, head) {
                return this.$http(api_first_order_export, params, head).then(res => {
                    if (res.join_queue === 1) {
                        this.export_visible = true;
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
            init_params(){
                let data = clone(this.searchData);
                if (!!this.searchData.date_b) {
                    let b = new Date(this.searchData.date_b);
                    data.date_b = datef("YYYY-MM-dd", b / 1000);
                } else {
                    data.date_b = "";
                }
                if (!!this.searchData.date_e) {
                    let e = new Date(this.searchData.date_e);
                    data.date_e = datef("YYYY-MM-dd", e / 1000);
                } else {
                    data.date_e = "";
                }
                data.sku = data.sku.split('\n').map(row=>row.trim()).filter(row=>!!row);
                return data
            },
            init(){
                let data = this.init_params();
                this.loading = true;
                this.$http(api_first_order_sku_list,data).then(res => {
                    this.tableData = res.data;
                    this.total = res.count;
                    this.loading = false;
                    this.firstLoading = false;
                }).catch(code => {
                    this.$message({type:'error',message:code.message || code})
                })
            },
            search(){
                this.init()
            },
            select_button(val){
                this.searchData.channel_id = val;
                this.init()
            },
            submit(){
                this.init()
            },
            handle_size_change(val){//-----切换条数
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val){//-----切换页数
                this.searchData.page = val;
                this.init();
            }
        },
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('../../report/export-dialog').default,
        }
    }
</script>
