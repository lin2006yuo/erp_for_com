<template>
    <page class="channel-profit">
        <search-module
                @search="search"
                :search-data="searchData"
                @clears="clears"></search-module>
        <request-button
                :disabled="hasData"
                class="mt-xs mb-xs ml-sm"
                :request="export_report">批量导出</request-button>
        <table-module
                :search-data="searchData"
                :first-loading="firstLoading"
                :loading="loading"
                :table-data="tableData"
                :total="total"
                :handle-size-change="handle_size_change"
                @handle-current-change="handle_current_change"></table-module>
        <export-dialog v-model="export_show"></export-dialog>
    </page>
</template>
<style lang="stylus">
    .channel-profit{
        .label-width{
            width:100px;
        }
    }

    .financial .el-table__empty-text{
        left: 50% !important;
    }

    @media screen and (max-width: 1366px) {
        .table-module .el-table__empty-text{
            left: 25% !important;
        }
    }
</style>
<script>
    import {api_export_report,api_report_joom} from  '../../../../api/report-channel'
    export default{
        page:{
            devinfo:{
                frontEnd:'汤敏',
                backEnd:'李伯敏',
                createTime:'2018-7-5',
                updateTime:'2018-7-5'
            }
        },
        refresh(){
            this.init();
        },
        data(){
            return{
                tableData:{
                    list:[],
                    page:1,
                    pageSize:20,
                },
                total:0,
                export_show:false,
                hasData:true,
                loading:false,
                searchData:{
                    channel_id:7,
                    site_code:'',
                    account_id:"",
                    warehouse_id:"",
                    time_field:'shipping_time',
                    time_start:new Date(Date.now()).setDate(1),
                    time_end:Date.now(),
                },
                clears:{
                    channel_id:7,
                    time_field:'shipping_time',
                    time_start:new Date(Date.now()).setDate(1),
                    time_end:Date.now(),
                },
                firstLoading:true
            }
        },
        mounted(){},
        methods:{
            search(){
                this.init();
            },
            //批量导出
            export_report(){
                //处理年月日 YYYY-MM-dd
                let data=clone(this.searchData);
                if(this.searchData.time_start){
                    data.time_start=datef('YYYY-MM-dd', this.searchData.time_start/1000);
                }else {
                    data.time_start='';
                }
                if(this.searchData.time_end){
                    data.time_end=datef('YYYY-MM-dd', this.searchData.time_end/1000);
                }else {
                    data.time_end='';
                }
                this.export_show = true;
                return this.$http(api_export_report, data).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            init(){
                this.loading = true;
                //处理年月日 YYYY-MM-dd
                let data=clone(this.searchData);
                if(this.searchData.time_start){
                    data.time_start=datef('YYYY-MM-dd', this.searchData.time_start/1000);
                }else {
                    data.time_start='';
                }
                if(this.searchData.time_end){
                    data.time_end=datef('YYYY-MM-dd', this.searchData.time_end/1000);
                }else {
                    data.time_end='';
                }
                this.$http(api_report_joom, data).then(res=>{
                    this.loading = false;
                    this.tableData.page = res.page;
                    this.tableData.pageSize = res.pageSize;
                    this.total = res.count,
                        this.tableData.list = res.data.map(row=>{
                            this.$set(row,'show', false);
                            return row;
                        });
                    this.total = res.count;
                    let flag = this.tableData.list.length <= 0;
                    if(!!flag){this.firstLoading = false};
                    this.hasData = flag;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                    this.loading = false;
                });
            },
            calendar_watch(){

            },
            //分页器
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
        },
        computed:{},
        watch:{},
        components:{
            exportDialog:require('../../export-dialog.vue').default,
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
            requestButton:require('../../../../global-components/request-button.vue').default,
        }
    }
</script>
