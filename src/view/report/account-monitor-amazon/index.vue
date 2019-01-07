<template>
    <page class="p-index">
        <card-search
            class="mb-xs"
            @search="search"
            :search-data="searchData"
        ></card-search>
        <!--转圈圈、请求过期-->
        <request-button
            :request="batch_export"
            class="mb-xs mt-xs ml-sm"
        >批量导出</request-button>
        <table-module
            :table-data="tableData"
            :search-data="searchData"
            :total="total"
            @current-change="init"
            @size-change="init"
        ></table-module>
        <export-dialog v-model="showDialog"></export-dialog>
    </page>
</template>
<script>
    export default {
        data() {
            return {
                searchData: {
                    page: 1,
                    pageSize: 20,
                    channel_id: "",
                    website_id: "",
                    account_id: "",
                    seller: ""
                },
                tableData: [],
                //显示弹窗
                showDialog: false,
                //tableData总数据量
                total: 60
            }
        },
        methods: {
            search() {
                this.reset()
                this.init()
            },
            //批量导出
            batch_export() {

            },
            //加载数据
            init() {
                console.log('加载数据', this.searchData)
            },
            //重置
            reset() {
                this.searchData.page = 1
            }
        },
        components: {
            cardSearch: require('./card-search.vue').default,
            requestButton: require('@/global-components/request-button').default,
            tableModule: require('./table-module.vue').default,
            exportDialog: require('../export-dialog.vue').default
        }
    }
</script>
