<template>
    <page class="p-index">
        <card-search
            @search="search"
            :search-data="searchData"
        ></card-search>
        <request-button
            :request="batch_export"
            class="mb-sm mt-sm ml-sm"
            :timeout="0"
        >批量导出</request-button>
        <table-module
            :table-data="tableData"
            :search-data="searchData"
            :total="total"
            :loading="loading"
            @current-change="init"
            @size-change="init"
        ></table-module>
        <export-dialog v-model="showDialog"></export-dialog>
    </page>
</template>
<script>
    import {api_amazon_monitor, api_amazon_monitor_export} from '@/api/amazon-monitor'
    export default {
        page: {
          devinfo: {
              frontEnd: '林学裕',
              backEnd: '翟雪莉',
              createTime: '2019-1-17',
          }
        },
        data() {
            return {
                searchData: {
                    page: 1,
                    pageSize: 20,
                    channel_id: 2,
                    site_code: "",
                    account_name: "",
                    seller_id: ""
                },
                tableData: [],
                //显示弹窗
                showDialog: false,
                //tableData总数据量
                total: 60,
                loading: false
            }
        },
        methods: {
            search() {
                this.reset();
                this.init()
            },
            //批量导出
            batch_export() {
                return this.$http(api_amazon_monitor_export, this.searchData).then(res => {
                    if(res.message === '成功加入导出队列') {
                        this.showDialog = true;
                        this.$message({type: 'success', message: res.message})
                    } else {
                        this.$message({type: 'error', message: '加入导出队列失败'})
                    }
                }).catch(error => {
                    this.$message({type: 'error', message: error})
                })
            },
            //加载数据
            init() {
                this.loading = true;
                const params = clone(this.searchData);
                this.handleData(params);
                this.$http(api_amazon_monitor, params).then(({ count, data }) => {
                    this.loading = false;
                    this.total = count;
                    this.tableData = this.handleTableData(data)
                }).catch(error => {
                    this.tableData = [];
                    this.total = 0;
                    this.$message({type: 'error', message: error})
                })
            },
            //重置
            reset() {
                this.searchData.page = 1
            },
            //处理数据
            handleData(data) {
                if(data.account_name === '全部') {
                    data.account_name = ""
                }
            },
            handleTableData(data) {
                return data.map(r => {
                    r.list_num = r.list_num.replace(/\"/g, "")
                    return r
                })
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
