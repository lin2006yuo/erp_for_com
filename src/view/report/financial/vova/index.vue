<template>
    <page class="channel-profit">
        <search-module @init-data="init_data" ref="search_module" :channel-id="12"></search-module>
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
    import {api_report_vova} from  '@/api/report-channel'
    import mixin from '../mixin.js'
    export default{
        mixins: [mixin],
        page:{
            devinfo:{
                frontEnd:'汤敏',
                backEnd:'李伯敏',
                createTime:'2018-7-5',
                updateTime:'2018-7-5'
            }
        },
        data(){
            return{
                apiTableData: api_report_vova
            }
        },
    }
</script>
