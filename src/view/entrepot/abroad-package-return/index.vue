<template>
    <page>
        <search-module 
            :searchData="searchData"
            @search="init"
        />
        <permission tag="trendsSelect"
                    type="primary"
                    class="inline ml-sm mb-xs"
                    :route="apis.url_overseas_package_return_export"
                    :selects="partAllOptions"
                    @trigger="export_excel"></permission>
        <table-module
            :tableData="tableData"
            :searchData="searchData"
            :total="total"
            :loading="false"
            @selection-change="select_change"
            @current-change="handle_current_change"
            @size-change="handle_size_change"
        ></table-module>
        <export-tip v-model="visible"></export-tip>
    </page>
</template>
<script>

import {api_overseas_package_return, api_overseas_package_return_id,
    api_overseas_package_return_export, url_overseas_package_return_export} from '@/api/overseas-package-return'
import {downloadFile} from "@/lib/http";


export default {
    permission: {
        url_overseas_package_return_export,
    },
    data() {
        return {
            searchData: {
                skus: '',
                reason: '',
                warehouse_id: 205,
                channel_id: '',
                site_code: '',
                account_id: '',
                shipping: '',
                snType: 'package_number',
                snText: '',
                shipping: '',
                snUser: '',
                snTextUser: '',
                snDate: '',
                date_b: '',
                date_e: '',
                page: 1,
                pageSize: 20,
            },
            partAllOptions: [
                {
                    name: "部分导出", value: 2, action: function () {
                        if (this.selectionIds.length <= 0) return this.$message({
                            type: "warning",
                            message: "请先选择需要导出的数据"
                        });
                        let params = {...this.searchData, ids: this.selectionIds, export_type: 0,}
                        this.batch_export(params);
                    }
                },
                {
                    name: "全部导出", value: 1, action: function () {
                        let params = {...this.searchData, ids: this.selectionIds, export_type: 1}
                        this.batch_export(params);
                    }
                },
            ],
            selectionIds: [],
            tableData: [],
            total: 0,
            visible: false
        }
    },
    methods: {
        init() {
            this.$http(api_overseas_package_return, this.searchData).then(res => {
                this.tableData = res.data
                this.total = res.count
            }).catch(err => {
                console.log(err)
                this.$message({type: 'error', message: err})
            })
        },
        select_change(selectionIds) {
            this.selectionIds = selectionIds.map(item => item.id)
        },
        export_excel(val) {
            val.action.call(this, val);
        },
        batch_export(params) {
            this.$http(api_overseas_package_return_export, params).then(res => {
                if (res.file_code) {
                    let url = config.apiHost + 'downloadFile/downExportFile';
                    let param = {
                        file_code: res.file_code,
                    };
                    downloadFile({
                        url: url,
                        get: param,
                        fileName: res.file_name,
                        suffix: '.xls',
                    });
                } else {
                    this.visible = true
                }
            })
        },
        handle_current_change(val) {
            this.searchData.page = val
            this.init()
        },
        handle_size_change(val) {
            this.searchData.pageSize = val
            this.init()
        }
    },
    components: {
        searchModule: require('./search-module').default,
        trendsSelect: require('@/components/trends-select').default,
        tableModule: require('./table-module').default,
        exportTip: require('@/components/export-queue-tip').default,
    }
}
</script>
