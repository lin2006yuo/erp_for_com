<template>
    <page class="p-index">
        <search-list @search_list="search_list"
                     :clears="clears"
                     :search-data="searchData"
                     class="mb-sm">
        </search-list>
        <div class="mt-sm mb-sm">
            <permission tag="trendsSelect"
                        class="inline ml-sm p-btn-select"
                        type="primary"
                        :route="apis.url_fbs_order_exprot"
                        :selects="partAllOptions"
                        @trigger="export_excel">
            </permission>
        </div>
        <data-table :table-data="dataTable"
                    :is-load="loading"
                    :isFirst="isFirst"
                    :cur-width="curWidth"
                    ref="shopeeTable"
                    @select-change="select_change">
        </data-table>
        <!--导出字段-->
        <export-field :param="export_model_type"
                      v-model="exportVisable"
                      :fields="fields"
                      :templates="templates"
                      @getTemplate="get_templates"
                      title="请选择自定义导出字段"
                      :creat-excel="creat_excel"
                      :fixparam="fixparam">
        </export-field>
        <!--报表管理弹框-->
        <export-dialog v-model="export_visible"></export-dialog>
        <!--分页-->
        <div class="block">
            <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="searchData.page"
                :page-sizes="[20,50,100,200,500]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_shopee_order_list,
        api_fbs_order_exprot,
        url_fbs_order_exprot,
        api_goods_export_template,
        api_fbs_export_fields} from'../../.././../api/shopee-thailand-order';
    import {downloadFile} from '../../../../lib/http';

    export default{
        permission: {
            url_fbs_order_exprot,
        },
        page:{
            devinfo:{
                frontEnd:'熊辉',
                backEnd:'林鹏',
                createTime:'2018-12-29',
                updateTime:'2018-12-29'
            }
        },
        refresh(){
            this.init();
        },
        data(){
            return{
                selects: [],
                isFirst: true,
                is_batch:"",
                dataTable:[],
                total:0,
                partAllOptions: [
                    {name: "部分导出", value: 2},
                    {name: "全部导出", value: 1}
                ],
                export_visible: false,//导出管理队列
                export_model_type: {
                    type: 25
                },
                export_type: '',
                exportVisable: false,
                fields: [],
                templates: [],
                searchData:{
                    site: '',
                    account_id: '',
                    snType:'order_number',
                    snText:'',
                    seller: '',
                    time_type: 'pay_time',
                    date_b:(Date.now()-(14*24*60*60*1000)),
                    date_e:Date.now(),
                    page:1,
                    pageSize:50,
                },
                clears:{
                    time_type: 'pay_time',
                    snType:'order_number',
                    date_b:(Date.now()-(14*24*60*60*1000)),
                    date_e:Date.now(),
                },
                loading:false
            }
        },
        mounted(){
            this.init();
            this.get_templates();
        },
        created(){
            if (window.screen.width === 1920) {
                this.curWidth = 180;
            } else if (window.screen.width === 1366) {
                this.curWidth = 0;
            }
            this.get_fields();
        },
        methods:{
            get_fields() {//获取导出字段
                this.$http(api_fbs_export_fields).then(res => {
                    this.fields = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            fixparam(list){
                return list.map(row => {
                    return {
                        field_name: row.show_field,
                        field_key: row.field
                    }
                })
            },
            creat_excel(param) {
                let data = '';
                switch (this.export_type) {
                    case 2://部分
                        data = {
                            ids: JSON.stringify(this.selects.map(row => {
                                if (typeof row === 'object') {
                                    return row.id
                                } else {
                                    return row
                                }
                            })),
                            export_type: this.export_type,
                            fields: param
                        };
                        Object.assign(data,this.get_params());
                        return this.order_export(data);
                        break;
                    case 1://全部
                        data = this.get_params();
                        this.$set(data, 'export_type', this.export_type);
                        this.$set(data, 'fields', param);
                        return this.order_export(data);
                        break;
                }
            },
            order_export(params) {//部分 全部导出
                return this.$http(api_fbs_order_exprot, params).then(res => {
                    if (res.join_queue === 1) {
                        this.$message({type: "success", message: res.message || res});
                        this.export_visible = true;
                    } else {
                        let params = {
                            page: this.searchData.page,
                            pageSize: this.searchData.pageSize,
                            file_code: res.file_code,
                        };
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                        this.$message({type: "success", message: res.message || res});
                        this.$refs.shopeeTable.toggleSelection();//导出后取消勾选
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
                return Promise.resolve()
            },
            get_templates(){//获取模板
                this.$http(api_goods_export_template, {type: 25}).then(res => {
                    res.forEach(row => {
                        row.value = row.name;
                    });
                    this.templates = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                });
            },
            select_change(val){
                this.selects = val;
            },
            export_excel(val){
                if(val.value === 2 && this.selects.length === 0) return this.$message({
                    type: "warning",
                    message: "请先选择需要导出的数据"
                });
                this.export_type = val.value;
                this.exportVisable = true;
            },
            get_params() {
                let data = window.clone(this.searchData);
                let curString = data.snText.trim();
                if (curString.length > 0) {
                    let cur = data.snType==='buyer_id'? curString.split('\n').map(row=>row.trim()).filter(row => row !== ''):curString.replace(/\s/g,'\n').split('\n').map(row=>row.trim()).filter(row => row !== '');
                    data.snText = JSON.stringify(cur);
                }else{
                    data.snText = '';
                }
                if (!!data.date_b) {
                    data.date_b = datef('YYYY-MM-dd', data.date_b/1000);
                } else {
                    data.date_b = ''
                }
                if (!!data.date_e) {
                    data.date_e = datef('YYYY-MM-dd', data.date_e/1000);
                } else {
                    data.date_e = ''
                }
                return data;
            },
            init(){
                this.loading=true;
                this.$http(api_shopee_order_list,this.get_params()).then(res => {
                    this.dataTable=res.data;
                    this.total=res.count;
                    this.isFirst = false;
                    this.loading=false;
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                    this.loading=false;
                })
            },
            handleSizeChange(val) {//---------------分页每页显示条数
                this.searchData.pageSize=val;
                this.init();
            },
            handleCurrentChange(val) {//------------分页当前页
                this.searchData.page=val;
                this.init();
            },
            search_list(){
                this.init();
            },
        },
        computed:{},
        components:{
            trendsSelect: require('../../../../components/trends-select.vue').default,
            exportField: require("@/components/export-field").default,
            exportDialog: require('../../../report/export-dialog').default,
            searchList: require('./search-list').default,
            dataTable: require('./data-table').default,
        }
    }
</script>

