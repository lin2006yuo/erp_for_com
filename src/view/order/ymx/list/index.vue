<template>
    <page class="p-index-ymx-order-list">
        <search-list
            ref="searchClear"
            @batch-search="batch_search"
            @change-order="change_order"
            @change-pay="change_pay"
            @change-site="change_site"
            @search-list="search_list"
            :searchData="searchData"
            :clears="clears">
        </search-list>
        <div class="mt-sm mb-sm ml-sm">
            <el-button class="inline ml-sm" size="mini" type="primary" @click.native="showImport=true">导入</el-button>
            <el-button
                type="primary"
                size="mini"
                class="inline"
                @click.native="verification">手动核查订单
            </el-button>
            <permission
                class="inline"
                tag="request-button"
                :mintime="200"
                req-key="url_post_amazon_orders_sysc"
                :route="apis.url_post_amazon_orders_sysc"
                :disabled="selectList.length===0"
                @click="orders_sysc">同步平台订单
            </permission>
            <permission tag="trendsSelect"
                        class="inline ml-xs"
                        type="primary"
                        :route="apis.url_post_amazon_orders_export"
                        :selects="partAllOptions"
                        @trigger="export_excel">
            </permission>
            <el-button
                type="primary"
                size="mini"
                class="inline ml-sm"
                v-if="isOrder"
                :disabled="selectList.length===0"
                @click.native="shipped">推送至系统订单
            </el-button>
            <el-button
                type="primary"
                size="mini"
                class="inline ml-sm"
                @click.native="catch_order">抓取亚马逊订单
            </el-button>
        </div>
        <data-table
            :dataTable="dataTable"
            :is-loading="isLoading"
            @sort-click="sort_click">
        </data-table>
        <!--分页-->
        <div class="block">
            <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total=total>
            </el-pagination>
        </div>
        <verification-order v-model="verificationDialog" cur-platform="Amazon">
        </verification-order>
        <look-list v-model="lookDialog"
                   @add_ymx = "add_ymx"
                   :addData = "addData"
                   :add-edit-site-list="addEditSiteList">
        </look-list>
        <import-excel v-model="showImport"
                      @files-update="init"
                      :export-api="export_transfer_template"
                      :import-api="import_transfer"
                      :select-list="selectList">
        </import-excel>
        <export-field :param="export_model_type"
                      v-model="exportVisable"
                      :fields="fields" :templates="templates"
                      @getTemplate="get_templates"
                      title="请选择自定义导出字段"
                      :fixparam="fixparam"
                      :creat-excel="creat_excel">
        </export-field>
        <export-dialog v-model="export_visible">
        </export-dialog>
    </page>
</template>
<style lang="stylus">
    .p-index-ymx-order-list {
        .el-dropdown .el-button-group {
            display: inline-block;
            position: relative;
            top: 1px;
        }
    }
</style>
<script>
    import {downloadFile} from '../../../../lib/http';
    import searchList from './searchList.vue';
    import dataTable from './data-table.vue';
    import lookList from './look-list.vue';
    import {
        order_amanzon_list,
        url_post_amazon_orders_sysc,
        api_post_amazon_orders_sysc,
        api_get_ebay_orders_export_transfer_template,
        api_post_ebay_orders_import_transfer,
        api_get_amazon_orders_export_fields,
        url_post_amazon_orders_export,
        api_post_amazon_orders_export,
        api_push_amazon_order,
        api_account_list,
        api_catch_amazon_order,
    } from '../../.././../api/order_amazon';
    import {api_goods_export_template} from "@/api/product-library";

    export default {
        page: {},
        permission: {
            url_post_amazon_orders_sysc,
            url_post_amazon_orders_export
        },
        refresh() {
            this.init();
            this.$refs.searchClear.get_amanzon_status();
        },
        data() {
            return {
                addData:{
                    account_id:'',
                    order_id:'',
                },
                addEditSiteList:[],
                export_transfer_template:api_get_ebay_orders_export_transfer_template,
                import_transfer:api_post_ebay_orders_import_transfer,
                verificationDialog: false,
                lookDialog: false,
                dataTable: [],
                isLoading: false,
                total: 0,
                page: 1,
                pageSize: 50,
                searchData: {
                    snType: 'order_id',
                    snText: '',
                    snDate: 'created_time',
                    account_id: "",
                    date_b: (Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now(),
                    order_status: "",
                    site: "",
                    order_type: "",
                    is_transfer_money:'',
                    refund_status:'',
                    pay_status:'',
                    shipping_status:''
                },
                sort_field: "",
                sort_type: "",
                clears: {
                    snType: 'order_id',
                    snText: '',
                    snDate: 'created_time',
                    account_id: "",
                    date_b: (Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now(),
                    order_status: "",
                    site: "",
                    order_type: ""
                },
                showImport:false,
                partAllOptions: [
                    {name: "部分导出", value: 2},
                    {name: "全部导出", value: 1}
                ],
                exportVisable: false,
                export_model_type: {
                    type: 10
                },
                fields: [],
                templates: [],
                export_visible: false,
                export_type: '',
            }
        },
        mounted(){
            this.get_fields();
            this.get_templates();
            this.get_code();
        },
        methods: {
            get_code(){//----------------获取账号简称
                this.$http(api_account_list,{channel_id: 2}).then(res => {
                    this.addEditSiteList = res.account;
                })
            },
            add_ymx(){//------------------抓取亚马逊订单
                let data = window.clone(this.addData);
                let curString = this.addData.order_id.replace(new RegExp(' ', 'gm'), '\n');
                let cur = curString.split('\n').filter(row => !!row);
                data.order_id = cur && cur.length > 1 ? cur.map(row => row.trim()) : cur.map(row => row.trim());
                this.$http(api_catch_amazon_order,data).then(res=>{
                    this.lookDialog = false;
                    this.$message({
                        type: 'success',
                        message: res.message
                    });
                }).catch(code=>{
                    this.$message({
                        message: code.message || code,
                        type: 'error'
                    });
                }).finally(() =>{
                    setTimeout(() =>{
                        this.$reqKey('lookFormYmx', false);
                    }, 300)
                })
            },
            fixparam(list) {
                return list.map(row => {
                    return {
                        field_name: row.show_field,
                        field_key: row.field
                    }
                });
            },
            order_export(params) {
                return this.$http(api_post_amazon_orders_export, params).then(res => {
                    if (res.join_queue === 1) {
                        this.export_visible = true;
                        this.$message({type: "success", message: res.message || res});
                    } else {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let params = {
                            file_code: res.file_code,
                            page: this.page,
                            pageSize: this.pageSize,
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
                return Promise.resolve();
            },
            get_fields() {
                this.$http(api_get_amazon_orders_export_fields).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            get_templates() {
                this.$http(api_goods_export_template, {type: 10}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    });
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            export_excel(val) {
                if (val.value === 2 && this.selectList.length <= 0) return this.$message({
                    type: "warning",
                    message: "请先选择需要导出的数据"
                });
                this.export_type = val.value;
                this.exportVisable = true;
            },
            creat_excel(param) {
                let data = '';
                switch (this.export_type) {
                    case 2://部分
                        data = {
                            ids: JSON.stringify(this.selectList.map(row => {
                                if (typeof row === 'object') {
                                    return row.id
                                } else {
                                    return row
                                }
                            })),
                            export_type: this.export_type,
                            fields: param
                        };
                        Object.assign(data,this.init_params());
                        return this.order_export(data);
                        break;
                    case 1://全部
                        data = this.init_params();
                        this.$set(data, 'export_type', this.export_type);
                        this.$set(data, 'fields', param);
                        return this.order_export(data);
                        break;
                }
            },
            orders_sysc() {
                let data = this.selectList.map(row => {
                    return {
                        account: row.account_id,
                        order_id: row.order_number
                    }
                });
                this.$http(api_post_amazon_orders_sysc, {data: JSON.stringify(data)}).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.init();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('url_post_amazon_orders_sysc', false);
                    }, 200);
                });
            },
            verification() {
                this.verificationDialog = true;
            },
            catch_order(){//------------打开抓取亚马逊订单
                this.lookDialog = true;
                this.addData = {
                    account_id:'',
                    order_id:'',
                }
            },
            shipped(){
                let data = this.selectList.map(row =>{
                    return{
                        order_id: row.order_number
                    }
                });
                this.$confirm('将已勾选的订单推送至系统订单，确定进行此操作？','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.$http(api_push_amazon_order,{data:JSON.stringify(data)}).then(res=>{
                        this.$message({type: 'success', message: res.message || res});
                        this.init();
                    }).catch(code=>{
                        this.$message({type: 'error', message: code.message || code});
                    })
                }).catch(()=>{
                    this.$message({type: 'info', message: '已取消操作'})
                }).finally(() =>{
                    setTimeout(() =>{
                       this.$reqKey('url_push_amazon_order', false);
                    },200);
                })
            },
            batch_search(data, arr) {
                this.snType2 = data;
                this.snText2 = arr;
                this.init();
            },
            init_params(){
                let data = window.clone(this.searchData);
                this.$set(data, 'page', this.page);
                this.$set(data, 'pageSize', this.pageSize);
                if (!!this.searchData.date_b) {
                    data.date_b = datef('YYYY-MM-dd', this.searchData.date_b / 1000);
                } else {
                    data.date_b = ""
                }
                this.sort_field && (this.$set(data, 'sort_field', this.sort_field));
                this.sort_type && (this.$set(data, 'sort_type', this.sort_type));
                data.date_e = !!this.searchData.date_e ? datef('YYYY-MM-dd', this.searchData.date_e / 1000) : "";
                let curString = this.searchData.snText.replace(new RegExp(' ', 'gm'), '\n');
                let cur = curString.split('\n').filter(row => !!row);
                data.snText = cur && cur.length > 1 ? cur.map(row => row.trim()) : this.searchData.snText;
                return data
            },
            init() {
                this.isLoading = true;
                let data = this.init_params();
                this.$http(order_amanzon_list, data).then(res => {
                    this.dataTable = res.data;
                    this.dataTable.forEach((data, i) => {
                        this.$set(this.dataTable[i], 'show', false);
                        this.$set(this.dataTable[i], 'isCheck', false);
                        this.$set(this.dataTable[i], 'heighLight', false);
                    });
                    this.total = res.count;
                    this.isLoading = false;
                }).catch(code => {
                    this.isLoading = false;
                    this.$message({
                        showClose: true,
                        message: '获取数据失败，请稍后重试！',
                        type: 'error'
                    });
                })
            },
            handleSizeChange(val) {//---------------分页每页显示条数
                this.pageSize = val;
                this.init();
            },
            handleCurrentChange(val) {//------------分页当前页
                this.page = val;
                this.init();
            },
            search_list() {
                this.init();
            },
//            表格升降序
            sort_click(val) {
                switch (val.label) {
                    case "付款状态":
                        this.sort_field = "payment_time";
                        break;
                    case "支付总额":
                        this.sort_field = "actual_total";
                        break;
                    case "下单时间":
                        this.sort_field = "created_time";
                        break;
                    case "最迟发货时间":
                        this.sort_field = "latest_ship_time";
                        break;
                }
                this.sort_type = val.order;
                this.init();
            },
            change_order(val) {
                this.searchData.order_status = val;
                this.init()
            },
            change_site(val) {
                this.searchData.site = val;
                this.init()
            },
        },
        computed: {
            selectList() {
                return this.dataTable.filter(row => row.isCheck);
            },
            isOrder(){
                return this.searchData.order_status === "Shipped"||this.searchData.order_status === "Unshipped"? true : false;
            }
        },
        components: {
            lookList,
            searchList,
            dataTable,
            verificationOrder: require('../../verification-order.vue').default,
            importExcel: require('../../ebay/list/import-excel.vue').default,
            trendsSelect: require('@/components/trends-select').default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('../../../report/export-dialog').default,
        }
    }
</script>
