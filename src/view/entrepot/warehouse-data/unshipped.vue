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
        <request-button :request="batch_report" class="mb-xs mt-xs ml-sm">批量导出</request-button>
        <table-module
            :search-data.sync="searchData"
            :table-columns="columnList"
            :table-data="tableData"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="hanldeCurrentChange"
        ></table-module>
    </page>
</template>
<script>
export default {
    data() {
        return {
            searchData: {
                date_from: "",
                date_to: new Date(),
                page: 1,
                pageSize: 20
            },
            columnList: [
                { label: "统计日期", value: "date" },
                { label: "中山仓", value: "zhongshan" },
                { label: "金华仓", value: "jinhua" },
                { label: "合计", value: "sum" }
            ],
            tableData: [],
            //数据总数量
            total: 50,
            //+号转时间戳，听说效率会高
            startTimeLimit: {
                disabledDate: time => {
                    if (this.searchData.date_to) {
                        return (
                            +time > +this.searchData.date_to ||
                            +time > Date.now() - 24 * 3600 * 1000
                        );
                    } else {
                        return +time > Date.now() - 24 * 3600 * 1000;
                    }
                }
            },
            endTimeLimit: {
                disabledDate: time => {
                    if (this.searchData.date_from) {
                        return (
                            +time > this.searchData.date_from ||
                            +time > Date.now() - 24 * 3600 * 1000
                        );
                    } else {
                        return +time > Date.now() - 24 * 3600 * 1000;
                    }
                }
            }
        };
    },
    methods: {
        batch_report() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("timeout");
                    resolve();
                }, 1000);
            });
        },
        search() {
            //重置到第一页
            this.reset()
            this.init()
        },
        init() {
            console.log('请求数据')
            const params = this.handleData(this.searchData)
            console.log({params})
        },
        handleSizeChange(val) {
            this.searchData.pageSize = val
            this.init()
        },
        hanldeCurrentChange(val) {
            this.searchData.page = val
            this.init()
        },
        reset() {
            this.searchData.page = 1
        },
        //处理数据格式
        handleData(data) {
            let date_from = data.date_from ? datef('YYYY-mm-dd', +data.date_from) : '';
            return {...data, date_from, date_to};
        }
    },
    components: {
        requestButton: require("@/global-components/request-button").default,
        tableModule: require("./table-module").default,
        labelItem: require("@/components/label-buttons").default
    }
};
</script>
