<template>
    <page class="p-index">
        <search-list :buttons="buttons"
                     @select="changeSelect"
                     @search_list="search_list"
                     :clears="clears"
                     :select-list="accountList"
                     :search-data="searchData"></search-list>
        <!--全部导出和部分导出-->
        <!--<div class="mt-xs ml-sm mb-xs">-->
            <!--<permission tag="trendsSelect"-->
                        <!--class="inline mb-xs mt-xs"-->
                        <!--type="primary"-->
                        <!--:route="apis.url_pandao_orders_export"-->
                        <!--:selects="partAllOptions"-->
                        <!--@trigger="export_excel">-->
            <!--</permission>-->
            <!--<el-button type="primary"-->
                       <!--size="mini"-->
                       <!--class="inline ml-xs"-->
                       <!--@click.native="verification">手动核查订单</el-button>-->
        <!--</div>-->
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
        <!--<export-field :param="export_model_type"-->
                      <!--v-model="exportVisable"-->
                      <!--:fields="fields" :templates="templates"-->
                      <!--@getTemplate="get_templates"-->
                      <!--title="请选择自定义导出字段"-->
                      <!--:fixparam="fixparam"-->
                      <!--:creat-excel="creat_excel">-->
        <!--</export-field>-->
        <!--导出队列-->
        <!--<export-dialog v-model="export_visible"></export-dialog>-->
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import searchList from './searchList.vue';
    import dataTable from './data-table.vue';
    import {downloadFile} from '../../../../lib/http';
    import {
        api_order_oberlo_list,
        api_order_oberlo_status,
        url_api_order_oberlo_status,
        api_pandao_orders_export,
        url_pandao_orders_export,
        api_get_pandao_orders_export_fields,
        api_order_oberlo_getAccount,
    } from '../../.././../api/order_oberlo';
    import {api_goods_export_template} from "@/api/product-library";

    export default {
        permission:{
            url_api_order_oberlo_status,
            url_pandao_orders_export,

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
                firstLoading: true,
                verificationDialog:false,
                is_batch: "",
                buttons: [],
                dataTable: [],
                accountList:[],
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
                searchData: {
                    snType: 'order_id',
                    snText: '',
                    account_id: '', //账号简称
                    date_b: new Date(new Date().toLocaleDateString()).getTime() -14*24*60*60*1000,
                    date_e: Date.now(),
                    status: "-1",//订单状态
                    sort_field:'',//排序
                    sort_type:'',//排序方式  desc升序  asc降序
                },
                clears: {
                    snType: 'order_id',
                    page: 1,
                    pageSize: 50,
                    date_b: new Date(new Date().toLocaleDateString()).getTime() -14*24*60*60*1000,
                    date_e: Date.now(),
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
            this.getAccount();
            // this.get_templates();
            // this.get_fields();
        },
        methods: {
            getAccount() {//获取账号简称
                this.$http(api_order_oberlo_getAccount).then(res => {
                    this.accountList = res.data.map(row => {
                        return {
                            label: row.code,
                            value: row.id,
                        }
                    });
                    this.accountList.unshift({
                        label: '全部',
                        value: ''
                    })
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'})
                });
            },
            verification(){
                this.verificationDialog = true;
            },
            get_status() {
                let data = this.get_params();
                data.status = -1;
                this.$http(api_order_oberlo_status, data).then(res => {
                    res.forEach(btn=>{
                        this.$set(btn,'value',btn.code);
                    });
                    if(this.buttons.length===0){
                        res.forEach(row=>{
                            this.buttons.push({label:row.name,value:row.order_status,count:row.count})
                        });
                    }else{
                        this.buttons.forEach(button=>{
                            let find = res.find(row => {
                                return button.value === row.order_status
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
                    let cur = data.snType === 'name' ? curString.split('\n').map(row => row.trim()).filter(row => row !== '') : curString.replace(/\s/g, '\n').split('\n').map(row => row.trim()).filter(row => row !== '');
                    data.snText = JSON.stringify(cur);
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
                this.$http(api_order_oberlo_list, this.get_params()).then(res => {
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
                        this.searchData.sort_field = "total";
                        break;
                    case "付款时间":
                        this.searchData.sort_field = "created_at";
                        break;
                    case "平台发货状态":
                        this.searchData.sort_field = "is_shipped";
                        break;
                    case "下单时间":
                        this.searchData.sort_field = "created_at";
                        break;
                    case "最迟发货时间":
                        this.searchData.sort_field = "should_be_shipped_by";
                        break;
                }
                this.searchData.sort_type = val.order;
                this.init();
            },
            changeSelect(item) {
                this.searchData.status = item.value;
                this.init();
            },
            handleSizeChange(val) {//---------------分页每页显示条数
                this.pageSize = val;
                this.get_status();
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
            searchList,
            dataTable,
            verificationOrder:require('../../verification-order.vue').default,
            trendsSelect: require('../../../../components/trends-select').default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('../../../report/export-dialog').default,
        }
    }
</script>
