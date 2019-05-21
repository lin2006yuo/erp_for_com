<template>
    <page class="p-stock-detail">
        <search-card :params="searchData" :clears="clears" @search="search">
            <label-item class="inline mr-sm" label="仓库：">
                <select-remote class="width-sm"
                               v-sf.channel_id
                               v-model="searchData.channel_id"
                               :all="false"
                               :remote="get_warehouse">
                </select-remote>
            </label-item>
            <label-item class="inline mr-sm" label="拆包审核员：">
                <param-account
                    class="width-sm"
                    v-model="searchData.snText"
                    v-sf.snText
                    type="default"
                    placeholder="请选择/输入..."
                    url="get|user/development/staffs">
                </param-account>
            </label-item>
            <label-item label="SKU：" class="inline mr-sm">
                <order-input v-model="searchData.sku"
                             v-sf.sku
                             @keydown="init"
                             class="width-super">
                </order-input>
            </label-item>
            <label-item label="来源单号：" class="inline mr-sm">
                <order-input v-model="searchData.sku"
                             v-sf.sku
                             @keydown="init"
                             class="width-super">
                </order-input>
            </label-item>
            <label class="inline">拆包审核时间：</label>
            <el-date-picker
                v-model="searchData.time_start"
                class="inline date"
                type="date"
                :picker-options="startTimeLimit"
                placeholder="选择日期"
            ></el-date-picker>
            <span>&nbsp;--&nbsp;</span>
            <el-date-picker
                v-model="searchData.time_end"
                class="inline date mr-sm"
                type="date"
                :picker-options="endTimeLimit"
                placeholder="选择日期"
            ></el-date-picker>
        </search-card>


        <request-button :request="batch_report" class="mb-sm mt-sm ml-sm" :timeout="0">批量导出</request-button>


        <table-module
            :search-data.sync="searchData"
            :table-columns="columnList"
            :table-data="tableData"
            :total="total"
            :loading="loading"
            @size-change="handle_size_change"
            @current-change="handle_current_change"
        ></table-module>
        <export-dialog v-model="visible"></export-dialog>
    </page>
</template>
<script>
    import { api_warehous_local }  from '@/api/entrepot-picking'
    export default {
        data() {
            return {
                searchData: {
                    time_start: Date.now(),
                    time_end: Date.now(),
                    page: 1,
                    pageSize: 20
                },
                clears: {},
                startTimeLimit: {
                    disabledDate: time => {
                        if (this.searchData.time_end) {
                            return (
                                +time > +this.searchData.time_end ||
                                +time > Date.now()
                            );
                        } else {
                            return +time > Date.now()
                        }
                    }
                },
                endTimeLimit: {
                    disabledDate: time => {
                        if (this.searchData.time_start) {
                            return (
                                +time < this.searchData.time_start ||
                                +time > +this.searchData.time_start + 24 * 3600 * 1000 * 14 ||
                                +time > Date.now()
                            );
                        } else {
                            return +time > Date.now()
                        }
                    }
                },
                tableData: [],
                columnList: [
                    { label: '仓库',value: '' },
                    { label: '拆包审核员',value: '' },
                    { label: 'SKU',value: '' },
                    { label: '来源单号',value: '' },
                    { label: '入库数量',value: '' },
                    { label: '拆包审核时间',value: '' },
                ],
                loading: false,
                total: 0,
                visible: false
            }

        },
        mounted() {

        },
        methods: {
            search() {
                this.validata().then(() => {
                    this.reset()
                    this.init()
                }).catch(err => {
                    this.$message({ type: 'warning', message: err })
                })
            },
            init() {

            },
            batch_report() {

            },
            handle_size_change(val) {
                this.searchData.pageSize = val
                this.init()
            },
            handle_current_change() {
                this.searchData.page = val
                this.init()
            },
            reset() {
                this.searchData.page = 1
            },

            validata() {
                return new Promise((resolve, reject) => {
                    if(this.searchData.time_end === "" || this.searchData.time_end === undefined  ||
                        this.searchData.time_start === "" || this.searchData.time_start === undefined
                    ) {
                        reject('审核时间不能为空')
                    } else {
                        const spanDay = this.dayspan(+this.searchData.time_start, +this.searchData.time_end)
                        if(spanDay >= 15) {
                            reject('最多查询15天以内数据')
                        }
                        resolve()
                    }
                })
            },
            //返回两个时间相差的天数
            dayspan(startTime, endTime) {
                const span = Math.abs(startTime - endTime)
                return Math.floor( span / (24 * 3600 * 1000) )
            },
            get_warehouse(callback) {
                this.$http(api_warehous_local).then(res => {
                    const warehouseList = res.reduce((pre, cur) => (
                        [ ...pre, { label: cur.name, value: cur.id }]
                    ), [])
                    callback(warehouseList)
                })
            },
        },

        components: {
            requestButton: require("@/global-components/request-button").default,
            paramAccount: require('@/api-components/param-account.vue').default,
            orderInput: require('@/components/order-input.vue').default,
            selectRemote: require('@/components/select-remote.vue').default,
            tableModule: require("./table-module").default,
            labelItem: require("@/components/label-buttons").default,
            exportDialog:require('@/view/report/export-dialog.vue').default,
        }
    };
</script>
<style lang="stylus">
    .p-stock-detail {
        .el-card {
            overflow: visible;
        }
    }
</style>
