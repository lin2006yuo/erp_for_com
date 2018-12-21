<template>
    <page>
        <div>
            <label-item label="上架类型：" class="mb-xs mt-sm">
                <el-select v-model="type"
                           class="inline s-width-default">
                    <el-option
                            :key="item.value"
                            v-for="item in ontheType"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
        </div>
        <search-module :use="use" ref="search_module" @search="init"></search-module>
        <request-button :request="batch_export"
                   :disabled="exportFlag"
                   class="mb-xs mt-xs ml-sm">批量导出
        </request-button>
        <table-module :search-data="searchData"
                      ref="table_module"
                      :api-report="apiReport"
                      :table-columns="tableColumns"
                      :empty-text="emptyText"
                      @can-export="canExport">
        </table-module>
        <export-dialog v-model="visible"></export-dialog>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_export_report} from '../../../../api/warehouse-report'
    export default {
        page:{
            devinfo:{
                frontEnd:'覃宏峰',
                backEnd:'赖永凤',
                createTime:'2018-3-17',
                updateTime:'2018-3-19'
            }
        },
        refresh(){
            this.$refs.search_module.search();
        },
        data() {
            return {
                type:1,
                use:'上架',//功能
                searchData:{},
                apiReport:'get|warehouse/report/sorting',//接口地址
                selectData:[],
                tableColumns:[],
                isFirst:true,
                emptyText:'请查询数据！',
                visible:false,
                exportFlag:true,
                ontheType: [
                    {label: '全部', value: 0},
                    {label: '采购上架', value: 1},
                    {label: '非采购上架', value: 2}
                ],
            }
        },
        methods: {
            init(searchData){
                Object.assign(searchData, {type: this.type});
                this.searchData = clone(searchData);
                this.init_columns();
                this.$nextTick(()=>{
                    if(this.isFirst){
                        this.emptyText = '请查询数据！';
                        this.isFirst = false;
                    } else {
                        this.emptyText = '暂无数据';
                        this.$refs.table_module.init();
                    }
                });
            },
            init_columns(){
                this.tableColumns = this.columnList;
            },
            batch_export(){
                this.searchData = this.$refs.table_module.searchData;
                this.searchData.type = 'shelf';
                let data = this.$refs.table_module.deal_time(this.searchData);
                return this.$http(api_export_report, data).then(res=>{
                    this.$message({type:"success",message:res.message || res});
                    this.visible = true;
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            },
            canExport(length){
                if(length <= 0 || this.isFirst){
                    this.exportFlag = true;
                } else {
                    this.exportFlag = false
                }
            },
        },
        computed:{
            isMonth(){
                return this.searchData.group_type === 2 || this.searchData.group_type === 4;
            },
            columnList(){
                switch (this.searchData.group_type){
                    case 1:
                        return [
                            {label:'操作人员', value:'operator'},
                            {label:'分拣次数', value:'times'},
                            {label:'包裹数', value:'quantity'},
                            {label:'仓库', value:'warehouse'},
                            {label:'操作日期', value:'dateline'}
                        ];
                    case 2:
                        return [
                            {label:'操作人员', value:'operator'},
                            {label:'分拣次数', value:'times'},
                            {label:'包裹数', value:'quantity'},
                            {label:'仓库', value:'warehouse'},
                            {label:'操作月份', value:'dateline'}
                        ];
                    case 3:
                        return [
                            {label:'仓库', value:'warehouse'},
                            {label:'分拣次数', value:'times'},
                            {label:'包裹数', value:'quantity'},
                            {label:'操作日期', value:'dateline'}
                        ];
                    case 4:
                        return [
                            {label:'仓库', value:'warehouse'},
                            {label:'分拣次数', value:'times'},
                            {label:'包裹数', value:'quantity'},
                            {label:'操作月份', value:'dateline'}
                        ];
                }
            },
        },
        watch: {},
        props: {},
        components: {
            searchModule:require('./search-module').default,
            tableModule:require('./table-module').default,
            labelItem: require('@/components/label-item').default,
            exportDialog:require('../../../report/export-dialog').default,
            requestButton:require('../../../../global-components/request-button.vue').default,
        }
    }
</script>
