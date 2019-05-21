<template>
    <page class="channel-profit">
        <search-module @init-data="init_data" ref="search_module" :channel-id="24"></search-module>
        <request-button :disabled="hasData"
                        class="mt-xs mb-xs ml-sm"
                        :request="export_report">批量导出</request-button>
        <table-module ref="table_module"
                      :search-data="searchData"
                      @can-export="canExport"
                      :header="header"
                      :api="apiTableData"
        ></table-module>
        <export-dialog v-model="export_show"></export-dialog>
    </page>
</template>
<script>
    import {api_report_price_minister} from  '@/api/report-channel'
    import mixin from '../mixin'
    export default{
        mixins: [mixin],
        page:{
            devinfo:{
                frontEnd:'钱宇琨',
                backEnd:'周福容',
                createTime:'2019-04-19',
                updateTime:'2019-04-19'
            }
        },
        data(){
            return{
                apiTableData: api_report_price_minister,
            }
        }
    }
</script>
