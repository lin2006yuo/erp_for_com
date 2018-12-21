<template>
        <page class="p-index">
            <search-time
                    :search-data="searchData"
                    @search="search"
            ></search-time>
            <!-- 全部导出、部分导出 -->
            <el-row class="mt-sm mb-sm">
                <permission tag="trendsSelect"
                    class="inline ml-sm mr-xs"
                    type="primary"
                    :route="apis.url_order_export_x"
                    :selects="partAllOptions"
                    @trigger="export_sku">
                </permission>
            </el-row>
            
            <table-data
                :loading="loading"
                :table-data="tableData"
                :first-loading="firstLoading"
                :searchData='searchData'
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                @selection-change="selectionChange"
                :total="total"></table-data>

              <export-dialog v-model="visible"></export-dialog>
        </page>
    </template>
    <style lang="stylus">

    </style>
    <script>
        import { url_order_export_x, sku_weight_diff_http, api_order_export_http} from '@/api/sku-weight-difference'
        import {downloadFile} from '@/lib/http';
        export default{
            page:{
                devinfo:{
                    frontEnd:'文军辉',
                    backEnd:'',
                    createTime:'2018-11-16',
                    updateTime:''
                }
            },
            permission: {
                url_order_export_x
            },
            refresh(){
                this.init();
            },
            data(){
                return{
                    searchData:{
                        snType: 'sku',
                        snText: '',
                        weight_st:'',
                        weight_nd:'',
                        is_auto_update_weight: '',                 
                        auto_update_time_st: '',
                        auto_update_time_nd: '',
                        page: 1,
                        page_size: 50                     
                    },
                    firstLoading: true,
                    loading:false,
                    tableData: [],
                    total:0,
                    visible:false,
                    partAllOptions: [
                        {name: "部分导出", value: 2},
                        {name: "全部导出", value: 1}
                    ],
                    selectList: [],
                }
            },
            mounted(){
                this.init()
            },
            methods:{
                export_sku (value) {   
                    // 处理对应数据。
                    let data = this.deal_time(this.searchData);
                    let curString = this.searchData.snText.replace(new RegExp(' ', 'gm'), '\n');
                    let cur = curString.split('\n').filter(row => !!row);
                    data.snText = cur && cur.length > 0 ? cur.map(row => row.trim()) : this.searchData.snText;  
                    if (data.is_auto_update_weight === '') {
                        delete data.is_auto_update_weight
                    } 
                    if (value.value === 1) {
                        // 全部导出--导出所有搜索出来的数据。
                        data.ids = ''
                    } else {
                        // 部分导出。
                        let ids = this.selectList.map(row => row.id)
                        if (ids && ids.length > 0) {
                            data.ids = ids
                        } else {
                            this.$message({
                                type: 'warning',
                                message: '请选择要导出的数据'
                            })
                            return
                        }
                    }                                                                                                                   
                    this.$http(api_order_export_http, data).then(res =>{
                        if (res.status === 1) {
                            let url = config.apiHost + 'downloadFile/downExportFile';
                            let params = {
                                file_code: res.file_code,
                                page: this.searchData.page,
                                pageSize: this.searchData.page_size,
                            }
                            downloadFile({
                                url: url,
                                get: params,
                                fileName: res.file_name,
                                suffix: '.xls',
                            })
                            this.$message({type: "success", message: '导出成功' || res});
                        } else {
                            this.visible = true
                            this.$message({type: "success", message: res.message || res});
                        }
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                        this.loading = false;
                        this.firstLoading = false;
                    })
                },
                search(){
                    this.init();
                },
                //处理年月日
                deal_time(searchData){
                    //处理年月日 YYYY-MM-dd
                    let data=clone(searchData);
                    if(searchData.auto_update_time_st){
                        data.auto_update_time_st=datef('YYYY-MM-dd', searchData.auto_update_time_st/1000);
                    }else {
                        data.auto_update_time_st='';
                    }
                    if(searchData.auto_update_time_nd){
                        data.auto_update_time_nd=datef('YYYY-MM-dd', searchData.auto_update_time_nd/1000);
                    }else {
                        data.auto_update_time_nd='';
                    }
                    return data;
                },
                selectionChange(val) {
                    this.selectList = val;                    
                },
                init () {
                    let data = this.deal_time(this.searchData);
                    let curString = this.searchData.snText.replace(new RegExp(' ', 'gm'), '\n');
                    let cur = curString.split('\n').filter(row => !!row);
                    data.snText = cur && cur.length > 0 ? cur.map(row => row.trim()) : this.searchData.snText;                               
                    this.loading = true;
                    if (data.is_auto_update_weight === '') {
                        delete data.is_auto_update_weight
                    }
                    this.$http(sku_weight_diff_http, data).then(res=>{                                                
                        this.tableData = res.list;
                        this.total = res.count;
                        this.loading = false;
                        this.firstLoading = false;
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                        this.loading = false;
                        this.firstLoading = false;
                    })                    
                },
                handleSizeChange(val) {//------------分页
                    this.searchData.page = 1;
                    this.searchData.page_size = val;         
                    this.init();
                },
                handleCurrentChange(val) {//------------分页
                    this.searchData.page = val;
                    this.init();
                },
            },
            components:{
                searchTime:require('./search-time.vue').default,
                tableData:require('./table-data.vue').default,
                exportDialog:require('../export-dialog.vue').default,
                trendsSelect: require('@/components/trends-select.vue').default
            }
        }
    </script>