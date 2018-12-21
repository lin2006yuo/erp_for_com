<template>
    <page class="p-index.vue">
        <search-module :use="use" ref="search_module" @search="init"></search-module>
        <request-button :request="batch_export"
                        :disabled="exportFlag"
                        class="mb-xs mt-xs ml-sm">批量导出
        </request-button>
        <table-module :search-data="searchData"
                      ref="table_module"
                      @weight-section-change="weight_section_change"
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
                frontEnd:'陈干婿,张志勇',
                backEnd:'赖永凤',
                createTime:'2018-3-18',
                updateTime:'2018-3-19'
            }
        },
        refresh(){
            this.$refs.search_module.search();
        },
        data(){
            return {
                use:'集包',//功能
                searchData:{},
                apiReport:'get|warehouse/report/collection',//接口地址
                selectData:[],
                tableColumns:[],
                isFirst:true,
                emptyText:'请查询数据！',
                visible:false,
                exportFlag:true,
                weight_section: '',
            }
        },
        methods:{
            init(searchData){
                this.searchData = clone(searchData);
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
            batch_export(){
                this.searchData = this.$refs.search_module.searchData;
                this.searchData.type = 'collection';
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
            weight_section_change(val) {
                if(val.length > 0) {
                    this.weight_section = {};
                    val.forEach(row => {
                        this.weight_section[row.key] = `(${row.start} - ${row.end}g)`;
                    });
                } else {
                    this.weight_section = ''
                }
                this.get_column_list();
            },
            get_column_list() {
                switch (this.searchData.group_type){
                    case 1:
                        this.tableColumns = [
                            {label:'操作人员', value:'operator'},
                            {label:'仓库', value:'warehouse'},
                            {label:'集包次数', value:'times'},
                            {label:'集包数', value:'quantity'},
                            {label:'集包移除数', value:'delete_package'},
                            {label:`集包数区间1${this.weight_section ? this.weight_section['value_1'] : ''}`, value:'value_1'},
                            {label:`集包数区间2${this.weight_section ? this.weight_section['value_2'] : ''}`, value:'value_2'},
                            {label:`集包数区间3${this.weight_section ? this.weight_section['value_3'] : ''}`, value:'value_3'},
                            {label:`集包数区间4${this.weight_section ? this.weight_section['value_4'] : ''}`, value:'value_4'},
                            {label:'操作日期', value:'dateline'}
                        ];
                        break;
                    case 2:
                        this.tableColumns =  [
                            {label:'操作人员', value:'operator'},
                            {label:'仓库', value:'warehouse'},
                            {label:'集包次数', value:'times'},
                            {label:'集包数', value:'quantity'},
                            {label:'集包移除数', value:'delete_package'},
                            {label:`集包数区间1${this.weight_section ? this.weight_section['value_1'] : ''}`, value:'value_1'},
                            {label:`集包数区间2${this.weight_section ? this.weight_section['value_2'] : ''}`, value:'value_2'},
                            {label:`集包数区间3${this.weight_section ? this.weight_section['value_3'] : ''}`, value:'value_3'},
                            {label:`集包数区间4${this.weight_section ? this.weight_section['value_4'] : ''}`, value:'value_4'},
                            {label:'操作日期', value:'dateline'}
                        ];
                        break;
                    case 3:
                        this.tableColumns =  [
                            {label:'仓库', value:'warehouse'},
                            {label:'集包次数', value:'times'},
                            {label:'集包数', value:'quantity'},
                            {label:'集包移除数', value:'delete_package'},
                            {label:`集包数区间1${this.weight_section ? this.weight_section['value_1'] : ''}`, value:'value_1'},
                            {label:`集包数区间2${this.weight_section ? this.weight_section['value_2'] : ''}`, value:'value_2'},
                            {label:`集包数区间3${this.weight_section ? this.weight_section['value_3'] : ''}`, value:'value_3'},
                            {label:`集包数区间4${this.weight_section ? this.weight_section['value_4'] : ''}`, value:'value_4'},
                            {label:'操作日期', value:'dateline'}
                        ];
                        break;
                    case 4:
                        this.tableColumns =  [
                            {label:'仓库', value:'warehouse'},
                            {label:'集包次数', value:'times'},
                            {label:'集包数', value:'quantity'},
                            {label:'集包移除数', value:'delete_package'},
                            {label:`集包数区间1${this.weight_section ? this.weight_section['value_1'] : ''}`, value:'value_1'},
                            {label:`集包数区间2${this.weight_section ? this.weight_section['value_2'] : ''}`, value:'value_2'},
                            {label:`集包数区间3${this.weight_section ? this.weight_section['value_3'] : ''}`, value:'value_3'},
                            {label:`集包数区间4${this.weight_section ? this.weight_section['value_4'] : ''}`, value:'value_4'},
                            {label:'操作日期', value:'dateline'}
                        ];
                        break;
                }
            }
        },
        computed:{
            isMonth(){
                return this.searchData.group_type === 2 || this.searchData.group_type === 4;
            },
        },
        watch: {
           'searchData.group_type'(val) {
               this.get_column_list();
           }
        },
        components: {
            searchModule:require('../search-module').default,
            tableModule:require('../table-module').default,
            exportDialog:require('../../../report/export-dialog').default,
            requestButton:require('../../../../global-components/request-button.vue').default,
        }
    }
</script>
