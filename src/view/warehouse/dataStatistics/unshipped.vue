<template>
    <page>
        <search-card :params="searchData" @search="search">
            <label class="inline ml-sm">操作日期：</label>
                <el-date-picker
                    v-model="searchData.date_from"
                    class="inline date"
                    :picker-options="startTimeLimit"
                    placeholder="选择日期"
                ></el-date-picker>
                <span>--</span>
                <el-date-picker
                    v-model="searchData.date_to"
                    class="inline date mr-sm"
                    :picker-options="endTimeLimit"
                    placeholder="选择日期"
                ></el-date-picker>
        </search-card>
        <request-button
            :request="batch_report"
            class="mb-xs mt-xs ml-sm"
        >批量导出</request-button>
        <table-module
            :search-data="searchData"
            :api-report="apiReport"
            :table-columns="columnList"
            ref="tableModule"
        ></table-module>
    </page>
</template>
<script>
    export default {
        data() {
            return {
                searchData: {
                    date_from: '',
                    date_to: '',
                    page: 1,
                    pageSize: 20
                },
                apiReport: 'get|****',
                columnList: [
                    {label: '统计日期', value: 'date'},
                    {label: '中山仓', value: 'zhongshan'},
                    {label: '金华仓', value: 'jinhua'},
                    {label: '合计', value: 'sum'},
                ],
                startTimeLimit: {
                    disabledDate: (time) => {
                        if(this.searchData.date_to) {
                            return +time > +this.searchData.date_to || +time > Date.now() - 24*3600*1000
                        } else {
                            return +time > Date.now() - 24*3600*1000
                        }
                    }
                },
                endTimeLimit: {
                    disabledDate: (time) => {
                        if(this.searchData.date_from) {
                            return +time > this.searchData.date_from || +time > Date.now() - 24*3600*1000
                        } else {
                            return +time > Date.now() - 24*3600*1000
                        }
                    }
                }
            }
        },
        methods: {
            batch_report() {

            },
            search(){
                console.log('init')
                this.$refs.tableModule.init()
            },
        },
        components: {
            requestButton: require('@/global-components/request-button').default,
            tableModule: require('@/view/entrepot/warehouse-reports/table-module').default,
            labelItem: require('@/components/label-buttons').default
        }
    }
</script>
