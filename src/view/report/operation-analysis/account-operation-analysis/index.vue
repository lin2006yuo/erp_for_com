<template>
    <page>
        <search-module :search-data="searchData"
                       :channel-list="channelList"
                       :clears="clears"
                       @search="search"></search-module>
        <div class="mt-xs ml-sm mb-xs">
            <permission tag="trendsSelect"
                        type="primary"
                        :route="apis.url_get_export"
                        :selects="partAllOptions"
                        @trigger="export_data"></permission>
        </div>
        <table-module :loading="loading"
                      :first-loading="firstLoading"
                      :total="total"
                      :search-data="searchData"
                      :table-data="tableData"
                      @sort-click="sort_click"
                      @handle-selection-change="handle_selection_change"
                      @handle-size-change="handle_size_change"
                      @handle-current-change="handle_current_change"></table-module>
        <export-field :param="export_model_type" v-model="exportVisable" :fields="fields" :templates="templates"
                      @getTemplate="get_templates" title="请选择自定义导出字段" :creat-excel="create_excel"></export-field>
        <export-dialog v-model="export_visible"></export-dialog>
    </page>
</template>

<style lang="stylus" scoped>

</style>

<script>
    import { api_account_operation_analysis,api_get_export_title,api_get_export,url_get_export, api_default_channel } from '@/api/account-operation-analysis';
    import { api_goods_export_template } from "@/api/product-library";
    import {api_get_channel} from '@/api/delivery-list'
    import { downloadFile } from '@/lib/http';
    export default {
        page: {
            devinfo: {
                frontEnd: '钱宇琨',
                backEnd: '周福容',
                createdTime: '2019-04-24',
                updateTime: '2019-04-24'
            }
        },
        permission: {
            url_get_export
        },
        data(){
            return{
                searchData: {
                    channel_id: '',
                    site: '',
                    account_id: '',
                    seller_field: 'seller',
                    seller_id: '',
                    search_type: 'publish_quantity',
                    min_value: '',
                    max_value: '',
                    time_field: 'dateline',
                    date_from: (Date.now()-(7*24*60*60*1000)),
                    date_to: Date.now() - 24*60*60*1000,
                    sort_field: '',
                    sort_type: '',
                    page: 1,
                    pageSize: 20,
                },
                clears: {
                    seller_field: 'seller',
                    search_type: 'publish_quantity',
                    time_field: 'dateline',
                    page: 1,
                    pageSize: 20,
                },
                channelList: [],
                loading: false,
                firstLoading: true,
                tableData: [],
                total: 0,
                selected: [],
                partAllOptions: [
                    {name: "部分导出", value: 0},
                    {name: "全部导出", value: 1}
                ],
                fields: [],
                templates: [],
                export_type: '',
                export_model_type: {
                    type: 158
                },
                export_visible: false,
                exportVisable: false
            }
        },
        mounted(){
            this.get_fields();
            this.get_templates();
            this.get_channels();
        },
        methods:{
            init(){
                this.loading = true;
                let data = this.get_init_params();
                this.$http(api_account_operation_analysis, data).then(res => {
                    this.loading = false;
                    this.firstLoading = false;
                    this.tableData = res.data;
                    this.total = res.count;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            //初始化搜索条件
            get_init_params(){
                let params = clone(this.searchData);
                if(this.searchData.date_from){
                    params.date_from = datef('YYYY-MM-dd', this.searchData.date_from/1000);
                }else {
                    params.date_from = '';
                }
                if(this.searchData.date_to){
                    params.date_to = datef('YYYY-MM-dd', this.searchData.date_to/1000);
                }else {
                    params.date_to = '';
                }
                return params
            },
            get_default_channel(arr){
                this.$http(api_default_channel).then(res => {
                    if(res.channel_ids.length !== 0){
                        arr.forEach(row => {
                            if(res.channel_ids.includes(row.value)){
                                this.channelList.push(row)
                            }
                        })
                        console.log(this.channelList, 'sss');
                    }else{
                        this.channelList = arr;
                    }
                    this.searchData.channel_id = this.channelList[0].value;
                    this.init()
                }).catch(err => {
                    this.$message({type: 'error', message: err.message ||  err})
                })
            },
            get_channels(){
                this.$http(api_get_channel, {}).then(res => {
                    this.get_default_channel(res)
                    // this.channelList = res;
                    // this.searchData.channel_id = this.channelList[0].value;
                    // this.init()
                }).catch(err => {
                    this.$message({type: 'error', message: err.message ||  err})
                })
            },
            search(){
                this.init();
            },
            get_fields() {
                this.$http(api_get_export_title).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            get_templates() {
                this.$http(api_goods_export_template, {type: 158}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    });
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            export_data(val) {
                if (val.value === 0 && this.selected.length <= 0) return this.$message({
                    type: "warning",
                    message: "请先选择需要导出的数据"
                });
                this.export_type = val.value;
                this.exportVisable = true;
            },
            create_excel(param) {
                let fields = param.field.join(',');
                let data = this.get_init_params();
                this.$set(data, 'export_type', this.export_type);
                if(this.export_type === 0){
                    let ids = this.selected.map(row => row.id);
                    this.$set(data, 'ids', ids);
                }
                return this.order_export(data, {
                    'X-Result-Fields': fields,
                    contentType: 'application/x-www-form-urlencoded',
                    timeout:INFINITE
                });
            },
            order_export(params, head) {
                return this.$http(api_get_export, params, head).then(res => {
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
                            suffix: ''
                        });
                        this.$message({type: "success", message: '导出成功' || res});
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
                return Promise.resolve()
            },
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
            handle_selection_change(val){
                this.selected = val
            },
            sort_click(val){//------排序
                let type = val.order==='ascending'?'asc':'desc';
                this.searchData.sort_field = val.prop;
                this.searchData.sort_type = type;
                this.init();
            },
        },
        components: {
            searchModule: require('./search-module.vue').default,
            tableModule: require('./table-module.vue').default,
            trendsSelect: require('@/components/trends-select.vue').default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('../../../report/export-dialog').default,
        }
    }
</script>