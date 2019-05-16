<template>
    <page>
        <search-module 
            :searchData="searchData"
        />
        <permission tag="trendsSelect"
                    type="primary"
                    class="inline ml-sm mb-xs"
                    :route="apis.url_package_return_export"
                    :selects="partAllOptions"
                    @trigger="export_excel"></permission>
        <table-module
            :tableData="tableData"
            :searchData="searchData"
            :total="50"
            :loading="false"
        ></table-module>
    </page>
</template>
<script>
import {
    url_package_return_export,
} from '@/api/package-return'
const data = require('./data.json')
export default {
    permission: {
        url_package_return_export,
    },
    data() {
        return {
            searchData: {
                skus: '',
                reason: '',
                warehouse_id: '',
                channel_id: '',
                site_code: '',
                account_id: '',
                shipping: '',
                snType: '',
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
                        // if (this.checkData.length <= 0) return this.$message({
                        //     type: "warning",
                        //     message: "请先选择需要导出的数据"
                        // });
                        // let params = this.deal_time(this.searchData);
                        // Object.assign(params, {
                        //     ids: this.checkData,
                        //     export_type: 0,
                        // });
                        // this.batch_export(params);
                    }
                },
                {
                    name: "全部导出", value: 1, action: function () {
                        // let parmas = this.deal_time(this.searchData);
                        // this.$set(parmas, "ids", '');
                        // this.$set(parmas, "export_type", 1);
                        // // let params = {
                        // // ids:'',
                        // // export_type:1,
                        // // };
                        // this.batch_export(parmas);
                    }
                },
            ],
            tableData: data.data
        }
    },
    methods: {
        init() {
            console.log('初始化')
        },
        export_excel(val) {
            val.action.call(this, val);
        },
    },
    components: {
        searchModule: require('./search-module').default,
        trendsSelect: require('@/components/trends-select').default,
        tableModule: require('./table-module').default
    }
}
</script>
