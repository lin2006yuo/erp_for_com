<template>
    <page class="p-index">
        <search-list :buttons="buttons"
                     @select="changeSelect"
                     @search_list="search_list"
                     :clears="clears"
                     :search-data="searchData"></search-list>
        <!--全部导出和部分导出-->
        <div class="mt-xs ml-sm mb-xs">
            <permission tag="trendsSelect"
                        class="inline mb-xs mt-xs"
                        type="primary"
                        :route="apis.url_pandao_orders_export"
                        :selects="partAllOptions"
                        @trigger="export_excel">
            </permission>
            <el-button type="primary"
                       size="mini"
                       class="inline ml-xs"
                       @click.native="verification">手动核查订单</el-button>
             <permission
                class="inline"
                tag="request-button"
                :mintime="200"
                req-key="url_post_mymall_orders_sysc"
                :route="apis.url_post_pandao_orders_sysc"
                :disabled="selectedList.length===0"
                @click="orders_sysc">同步平台订单
            </permission>
             <el-button
                type="primary"
                size="mini"
                class="inline ml-sm"
                v-if="searchData.status==='approved'"
                :disabled="selectedList.length===0"
                @click.native="shipped">推送至系统订单
            </el-button>
            <el-button
                type="primary"
                size="mini"
                class="inline ml-sm"
                @click.native="catch_order">抓取平台订单
            </el-button>
        </div>
        <data-table :data-table="dataTable"
                    class="mt-xs"
                    :loading="loading"
                    :firstLoading="firstLoading"
                    :export_data="export_data"
                    @sort-click="sort_click"></data-table>
        <!--分页-->
        <div class="block">
            <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[20,50,100,200,500]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <verification-order v-model="verificationDialog" cur-platform="Mymall"></verification-order>
        <!--导出字段选择-->
        <export-field :param="export_model_type"
                      v-model="exportVisable"
                      :fields="fields" :templates="templates"
                      @getTemplate="get_templates"
                      title="请选择自定义导出字段"
                      :fixparam="fixparam"
                      :creat-excel="creat_excel">
        </export-field>
        <look-list v-model="lookDialog"
                   @add_ymx = "add_ymx"
                   :addData = "addData"
                   :add-edit-site-list="addEditSiteList">
        </look-list>
        <!--导出队列-->
        <export-dialog v-model="export_visible"></export-dialog>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import lookList from './look-list.vue';
    import searchList from './searchList.vue';
    import dataTable from './data-table.vue';
    import {downloadFile} from '../../../../lib/http';
    import {
        api_order_pandao_list,
        api_order_pandao_status,
        api_post_pandao_orders_sysc,
        api_push_pandao_order,
        api_catch_pandao_order,
        api_order_pandao_getAccount,
        api_pandao_orders_export,
        api_get_pandao_orders_export_fields,
        url_api_order_pandao_status,
        url_post_pandao_orders_sysc,
        url_pandao_orders_export,
    } from '../../.././../api/order_pandao';
    import {api_goods_export_template} from "@/api/product-library";

    export default {
        permission:{
            url_api_order_pandao_status,
            url_pandao_orders_export,
            url_post_pandao_orders_sysc
        },
        page: {
            devinfo: {
                frontEnd: '覃宏峰',
                backEnd: '李佰敏',
                createTime: '2018-5-28',
                updateTime: '2018-5-28'
            }
        },
        refresh() {
            this.buttons = [];
            this.get_status();
            this.init();
        },
        data() {
            return {
                addData:{
                    account_id:'',
                    order_id:'',
                },
                firstLoading: true,
                lookDialog:false,
                verificationDialog:false,
                is_batch: "",
                buttons: [],
                dataTable: [],
                total: 0,
                page: 1,
                pageSize: 50,
                export_model_type: {
                    type: 28
                },
                exportVisable: false,
                export_visible:false,
                fields:[],
                templates:[],
                addEditSiteList:[],
                searchData: {
                    snType: 'order_id',
                    snText: '',
                    account_id: '',
                    date_b: (Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now(),
                    status: 0,
                    sort_field: '',
                    sort_type: '',
                },
                clears: {
                    snType: 'order_id',
                    date_b: (Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now()
                },
                loading: false,
                partAllOptions: [
                    {name: '部分导出', value: 2},
                    {name: '全部导出', value: 1}
                ],
            }
        },
        mounted() {
            this.get_status();
            this.get_templates();
            this.get_fields();
            this.getAccount();
        },
        methods: {
            verification(){
                this.verificationDialog = true;
            },
            getAccount() {
                this.$http(api_order_pandao_getAccount, {channel_id: 8}).then(res => {
                    this.addEditSiteList = res.account;
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'})
                })
            },
            get_status() {
                let data = this.get_params();
                data.status = -1;
                this.$http(api_order_pandao_status, data).then(res => {
                    res.forEach(btn=>{
                        this.$set(btn,'value',btn.code);
                    });
                    if (this.buttons.length === 0) {
                        this.buttons = res;
                    } else {
                        this.buttons.forEach(button => {
                            let find = res.find(row => {
                                return button.code === row.code
                            });
                            if (find) {
                                button.count = find.count;
                            }
                        });
                    }
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'})
                })
            },
            //保存模板
            get_templates() {
                this.$http(api_goods_export_template, {type: 28}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    });
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            //获取导出字段
            get_fields() {
                this.$http(api_get_pandao_orders_export_fields).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            export_excel(val) {
                if(val.value ===2 && this.selectedList.length ===0) return this.$message({
                    type: "warning",
                    message: "请先选择需要导出的数据"
                });
                this.export_type = val.value;
                this.exportVisable = true;
            },
            creat_excel(param) {
                let data = '';
                switch(this.export_type) {
                    case 2: //部分
                        data = {
                            ids: JSON.stringify(this.selectedList.map(row => {
                                return row.id;
                            })),
                            export_type: this.export_type,
                            fields: param
                        };
                        Object.assign(data, this.get_params());
                        return this.order_export(data);
                        break;
                    case 1: //全部
                        data = this.get_params();
                        this.$set(data, 'export_type', this.export_type);
                        this.$set(data, 'fields', param);
                        return this.order_export(data);
                        break;
                }
            },
            //部分 全部导出
            order_export(params) {
                return this.$http(api_pandao_orders_export, params).then(res => {
                    if(res.join_queue === 1){
                        this.export_visible = true;
                        this.$message({type: 'success', message: res.message || res});
                    }else{
                        let params = {
                            page: this.page,
                            pageSize: this.pageSize,
                            file_code: res.file_code
                        };
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls'
                        });
                        this.$message({type: 'success', message: res.message || res});
                        this.selectedList.map(row => {
                            row.isCheck = false;
                        });
                        // this.$refs.cancelSelect.checkAll = false;//导出后取消勾选
                    }
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
                return Promise.resolve();
            },
            fixparam(list) {
                return list.map(row => {
                    return {
                        field_name: row.show_field,
                        field_key: row.field
                    }
                })
            },
            get_params() {
                let data = window.clone(this.searchData);
                this.$set(data, 'page', this.page);
                this.$set(data, 'pageSize', this.pageSize);
                let curString = data.snText.trim();
                if (curString.length > 0) {
                    let cur = data.snType === 'product_id' ? curString.split('\n').map(row => row.trim()).filter(row => row !== '') : curString.replace(/\s/g, '\n').split('\n').map(row => row.trim()).filter(row => row !== '');
                    data.snText = cur.length > 1 ? JSON.stringify(cur) : curString;
                }
                if (!!data.date_b) {
                    data.date_b = datef('YYYY-MM-dd', data.date_b / 1000);
                } else {
                    data.date_b = ''
                }
                if (!!data.date_e) {
                    data.date_e = datef('YYYY-MM-dd', data.date_e / 1000);
                } else {
                    data.date_e = ''
                }
                return data;
            },

            init() {
                this.loading = true;
                this.dataTable = [];
                this.$http(api_order_pandao_list, this.get_params()).then(res => {
                    this.dataTable = res.data;
                    this.dataTable.forEach((data, i) => {
                        this.$set(this.dataTable[i], 'show', false);
                        this.$set(this.dataTable[i], 'isCheck', false);
                    });
                    this.total = res.count;
                    this.loading = false;
                    this.firstLoading =false
                }).catch(code => {
                    this.$message({
                        showClose: true,
                        message: code.message || code,
                        type: 'error'
                    });
                    this.loading = false;
                })
            },
            //            表格升降序
            sort_click(val) {
                switch (val.label) {
                    case "支付总额":
                        this.searchData.sort_type = "cost";
                        break;
                    case "付款时间":
                        this.searchData.sort_type = "order_time";
                        break;
                    case "平台发货状态":
                        this.searchData.sort_type = "shipping_time";
                        break;
                    case "下单时间":
                        this.searchData.sort_type = "order_time";
                        break;
                    case "最迟发货时间":
                        this.searchData.sort_type = "latest_shipped_time";
                        break;
                }
                this.searchData.sort_val = val.order === 'asc' ? 1 : 2;
                this.init();
            },
            orders_sysc() {
                let data = this.selectedList.map(row =>row.id+'');
                this.$http(api_post_pandao_orders_sysc, {ids:data}).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                    this.init();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('url_post_mymall_orders_sysc', false);
                    }, 200);
                });
            },
            add_ymx(){//------------------抓取平台订单
                let data = window.clone(this.addData);
                let curString = this.addData.order_id.replace(new RegExp(' ', 'gm'), '\n');
                let cur = curString.split('\n').filter(row => !!row);
                data.order_id = cur && cur.length > 1 ? cur.map(row => row.trim()) : cur.map(row => row.trim());
                this.$http(api_catch_pandao_order,data).then(res=>{
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
                        this.$reqKey('lookFormAddYmx', false);
                    }, 300)
                })
            },
            catch_order(){//------------打开抓取平台订单
                this.lookDialog = true;
                this.addData = {
                    account_id:'',
                    order_id:'',
                }
            },
            shipped(){ //----------推送至系统订单
                let data = this.selectedList.map(row =>row.order_id+'');
                this.$confirm('将已勾选的订单推送至系统订单，确定进行此操作？','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.$http(api_push_pandao_order,{order_id:data}).then(res=>{
                        this.$message({type: 'success', message: res.message || res});
                        this.init();
                    }).catch(code=>{
                        this.$message({type: 'error', message: code.message || code});
                    })
                }).catch(()=>{
                    this.$message({type: 'info', message: '已取消操作'})
                })
            },
            changeSelect(item) {
                this.searchData.status = item.code;
                this.init();
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
                this.get_status();
                this.init();
            },
        },
        computed: {
            selectedList() {
                return this.dataTable.filter(row => {
                    return row.isCheck === true;
                })
            },
            export_data() {
                return this.get_params();
            }
        },
        components: {
            lookList,
            searchList,
            dataTable,
            verificationOrder:require('../../verification-order.vue').default,
            trendsSelect: require('../../../../components/trends-select').default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('../../../report/export-dialog').default,
        }
    }
</script>
