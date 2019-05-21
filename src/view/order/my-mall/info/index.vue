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
                        :route="apis.url_fbm_order_exprot"
                        :selects="partAllOptions"
                        @trigger="export_excel">
            </permission>
        </div>
        <data-table :tableData="dataTable"
                    class="mt-xs"
                    :is-load="loading"
                    :isFirst="firstLoading"
                    :cur-width="curWidth"
                    :export_data="export_data"
                    @select-change="select_change"></data-table>
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
        <export-dialog v-model="export_visible"></export-dialog>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import searchList from './search-list.vue';
    import dataTable from './data-table.vue';
    import {downloadFile} from '../../../../lib/http';
     import {
        api_my_mall_order_list,
        api_fbm_order_exprot,
        url_fbm_order_exprot,
        api_goods_export_template,
        api_fbm_export_fields,
        api_fbm_status_count
    } from '@/api/my-mall-info'
    export default {
        permission:{
            url_fbm_order_exprot
            // url_api_order_pandao_status,
            // url_pandao_orders_export,
            // url_post_pandao_orders_sysc
        },
        page: {
        },
        refresh() {
            this.buttons = [];
            this.get_status();
            this.init();
        },
        data() {
            return {
                selects: [],
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
                    snType: 'order_number',
                    snText: '',
                    account_id: '',
                    date_b: (Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now(),
                    status: 0,
                    seller: '',
                    sort_field: '',
                    sort_type: '',
                    time_type:'order_time'
                },
                clears: {
                    snType: 'order_number',
                    time_type:'order_time',
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
        created () {
             if (window.screen.width === 1920) {
                this.curWidth = 180;
            } else if (window.screen.width === 1366) {
                this.curWidth = 0;
            }
        },
        mounted() {
            this.get_status();
            this.get_templates();
            this.get_fields();
        },
        methods: {
            verification(){
                this.verificationDialog = true;
            },
            get_status() {
                let data = this.get_params();
                data.status = -1;
                this.$http(api_fbm_status_count, data).then(res => {
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
                this.$http(api_goods_export_template, {type: 32}).then(res => {
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
                this.$http(api_fbm_export_fields).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            export_excel(val) {
                if(val.value ===2 && this.selects.length ===0) return this.$message({
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
                            ids: JSON.stringify(this.selects.map(row => {
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
                return this.$http(api_fbm_order_exprot, params).then(res => {
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
                        this.selects.map(row => {
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
                    // let cur = data.snType === 'product_id' ? curString.split('\n').map(row => row.trim()).filter(row => row !== '') : curString.replace(/\s/g, '\n').split('\n').map(row => row.trim()).filter(row => row !== '');
                    // data.snText = cur.length > 1 ? JSON.stringify(cur) : curString;
                      let cur = data.snType==='buyer_id'? curString.split('\n').map(row=>row.trim()).filter(row => row !== ''):curString.replace(/\s/g,'\n').split('\n').map(row=>row.trim()).filter(row => row !== '');
                     data.snText = JSON.stringify(cur);
                } else {
                    data.snText = '';
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
                this.$http(api_my_mall_order_list, this.get_params()).then(res => {
                    this.dataTable = res.data;
                    this.dataTable.forEach((data, i) => {
                        data.buyer = data.buyer.replace(/\s/g, '&nbsp;')
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
            changeSelect(item) {
                this.searchData.status = item.code;
                this.init();
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.init();
            },
            handleCurrentChange(val) {
                this.page = val;
                this.init();
            },
            search_list() {
                this.get_status();
                this.init();
            },
            select_change(val){
                this.selects = val;
            },
        },
        computed: {
            export_data() {
                return this.get_params();
            }
        },
        components: {
            // lookList,
            searchList,
            dataTable,
            verificationOrder:require('../../verification-order.vue').default,
            trendsSelect: require('../../../../components/trends-select').default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('../../../report/export-dialog').default,
        }
    }
</script>
