<template>
    <page class="p-index-member" ref="page">
        <search :searchData="searchData" @search="search" @clear="clear"></search>
        <el-row class="ml-sm mb-sm mt-sm">
            <permission tag="trendsSelect"
                        class="inline ml-xs mr-xs"
                        type="primary"
                        :route="apis.url_stock_lack_export"
                        :selects="partAllOptions"
                        @trigger="export_show"></permission>
        </el-row>
        <table-module
                :table-data="tableData"
                :search-data="searchData"
                :first-time="firstTime"
                @selection-change="selectionChange"
                @sort_change="sort_change"
                :loading="loading"></table-module>
        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <export-dialog v-model="export_visible"></export-dialog>
        <export-field :param="export_model_type" v-model="exportVisable" :fields="fields" :templates="templates" :fixparam="fixparam"  @getTemplate="get_templates"  title="请选择自定义导出字段" :creat-excel="creat_excel"></export-field>
    </page>
</template>
<style lang="stylus">
    .p-index-member {
        .active {
            background-color: rgba(173, 227, 255, 0.5);
        }
    }
</style>
<script>
    import {
        api_get_stock_lack,
        url_stock_lack_export,
        api_stock_lack_export,
        api_get_stock_lack_export_fields
    } from "@/api/stockout-list";
    import {api_goods_export_template} from  "@/api/product-library";
    import {downloadFile} from '@/lib/http';

    export default {
        permission: {
            url_stock_lack_export
        },
        page: {
            devinfo: {
                frontEnd: '覃宏峰',
                backEnd: '李佰敏',
                createTime: '2018-6-15',
                updateTime: '2018-6-15'
            }
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                searchData: {
                    warehouse_id: '',
                    developer_id: '',
                    purchaser_id: '',
                    supply_chain_specialist_id:'',
                    snType: "sku",
                    snText: "",
                    goodsStatus: 0,
                    page: 1,
                    pageSize: 50,
                    channel_id:'',
                    lack_qty_min:'',
                    lack_qty_max:'',
                },
                total: 0,
                loading: false,
                tableData: [],
                checkAll: false,
                export_visible: false,
                sort_field: '',
                sort_type: '',
                firstTime: true,
                partAllOptions:[
                    {name:"部分导出",value:2},
                    {name:"全部导出",value:1},
                ],
                selected:[],
                export_type:'',
                exportVisable:false,
                export_model_type:{
                    type:36
                },
                fields:[],
                templates:[]
            }
        },
        mounted() {
            this.init();
            this.get_fields();
            this.get_templates();
        },
        methods: {
            init_params() {
                let data = window.clone(this.searchData);
                this.sort_field && (data.sort_field = this.sort_field);
                this.sort_type && (data.sort_type = this.sort_type);
                let cur = data.snText.trim().split('\n').filter(row => !!row);
                if (!!cur && cur.length > 1) {
                    data.snText = JSON.stringify(cur.map(row => {
                        return row.trim();
                    }));
                } else if (!!cur && cur.length === 1) {
                    data.snText = data.snText.trim();
                }
                return data
            },
            init() {
                let data = this.init_params();
                this.loading = true;
                this.$http(api_get_stock_lack, data).then(res => {
                    this.loading = false;
                    this.firstTime = false;
                    this.total = res.count;
                    this.tableData = res.data;
                }).catch(code => {
                    console.log(code)
                })
            },
            get_fields(){
                this.$http(api_get_stock_lack_export_fields).then(res=>{
                    this.fields=res;
                }).catch(code => {
                    this.$message({type:"error",message:code.message||code})
                });
            },
            get_templates(){
                this.$http(api_goods_export_template,{type:36}).then(res=>{
                    res.forEach(row=>{
                        row.value=row.name;
                    });
                    this.templates=res;
                }).catch(code => {
                    this.$message({type:"error",message:code.message||code})
                });
            },
            fixparam(list){
                return list.map(row=>{
                    return {
                        field_name:row.show_field,
                        field_key:row.field

                    }
                });
            },
            creat_excel(param){
                let data = '';
                switch (this.export_type){
                    case 2://部分
                        data = {
                            skus:this.selected.map(row=>{
                                    return row.sku
                            }),
                            export_type:this.export_type,
                            fields:param
                        };
                        Object.assign(data,this.init_params());
                        return this.order_export(data);
                        break;
                    case 1://全部
                        data = this.init_params();
                        this.$set(data,'export_type',this.export_type);
                        this.$set(data,'fields',param);
                        return this.order_export(data);
                        break;
                }
            },
            order_export(params){
                return this.$http(api_stock_lack_export,params).then(res=>{
                    if (res.join_queue === 1) {
                        this.export_visible = true;
                        this.$message({type: "success", message: res.message || res});
                    } else {
                        let params = {
                            page:this.page,
                            pageSize:this.pageSize,
                            file_code:res.file_code
                        };
                        let url= config.apiHost+'downloadFile/downExportFile';
                        downloadFile({
                            url:url,
                            get:params,
                            fileName:res.file_name,
                            suffix:'.xlsx',
                        });
                        this.$message({type:'success',message:res.message || res});
                    }
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                });
            },
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init()
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init()
            },
            search() {
                this.init()
            },
            clear() {
                this.searchData = {
                    warehouse_id: '',
                    developer_id: '',
                    purchaser_id: '',
                    snType: "sku",
                    snText: "",
                    goodsStatus: '',
                    channel_id:0,
                    page: 1,
                    pageSize: 50,
                };
                this.init()
            },
            export_show(val){
                if(val.value===2&&this.selected.length<=0)return this.$message({type:"warning",message:"请先选择需要导出的数据"});
                this.export_type = val.value;
                this.exportVisable=true;
            },
            selectionChange(val){
                this.selected = val;
            },
            sort_change(column) {
                if (column.column instanceof Object) {
                    let sort_label = column.column.label;
                    switch (sort_label) {
                        case "缺货数量":
                            this.sort_field = "lack_qty";
                            break;
                        case "最早缺货时间":
                            this.sort_field = "create_time";
                            break;
                    }
                    this.sort_type = column.order === "descending" ? "desc" : "asc";
                    this.init();
                }
            }
        },
        components: {
            search: require("./search.vue").default,
            requestButton: require('@/global-components/request-button').default,
            tableModule: require('./table-module').default,
            exportDialog: require('../../report/export-dialog').default,
            exportField:require("@/components/export-field").default,
            trendsSelect: require('@/components/trends-select.vue').default,
        }
    }
</script>

