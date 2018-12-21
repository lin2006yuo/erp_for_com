<template>
    <page class="channel-profit">
        <search-module @init-data="init_data" ref="search_module"></search-module>
        <request-button :disabled="hasData"
                        class="mt-xs mb-xs ml-sm"
                        :request="export_report">批量导出</request-button>
        <table-module ref="table_module"
                      :search-data="searchData"
                      @can-export="canExport"></table-module>
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
    import {api_get_channel, api_account_list, api_get_warehouse, api_report_aliexpress, api_export_report} from  '../../../../api/report-channel'
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
            this.$refs.search_module.init();
        },
        data(){
            return{
                tableData:[],
                searchData:{},
                export_show:false,
                hasData:true
            }
        },
        mounted(){},
        methods:{
            init_data(searchData){
                this.searchData = searchData;
                this.$nextTick(()=>{
                    this.$refs.table_module.init();
                });
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
                return this.$http(api_export_report, data).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.export_show = true;
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            canExport(flag){
                this.hasData = flag;
            }
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
