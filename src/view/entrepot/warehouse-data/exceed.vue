<template>
    <page>
        <search-card :params="searchData" :clears="clears" @search="search">
            <label-item label="仓库：" class="inline mr-sm">
                <el-select v-model="searchData.warehouse_id" class="width-sm">
                    <el-option
                        v-for="item in warehouseList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label class="inline">操作日期：</label>
            <el-date-picker
                v-model="searchData.date_from"
                class="inline date"
                type="date"
                v-sf.date_from
                :picker-options="startTimeLimit"
                placeholder="选择日期"
            ></el-date-picker>
            <span>&nbsp;--&nbsp;</span>
            <el-date-picker
                v-model="searchData.date_to"
                class="inline date mr-sm"
                type="date"
                v-sf.date_to
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
            :selection="true"
            @size-change="handle_size_change"
            @current-change="handle_current_change"
            @selection-change="handle_selection_change"
        ></table-module>
        <export-dialog v-model="visible"></export-dialog>
    </page>
</template>
<script>
    //未发货
    import {api_over_age, api_export_over_age, api_warehouse} from '@/api/over-age'
    //获得本地仓库
    import {store_list} from '@/api/storeManagement'
    import {downloadFile} from "@/lib/http";
    import _ from 'lodash'
    export default {
        data() {
            return {
                searchData: {
                    date_from:new Date(),
                    date_to: new Date(),
                    warehouse_id: 489,
                    page: 1,
                    pageSize: 20,
                    sign: 'over_age'  //固定参数
                },
                clears: {
                    date_from:new Date(),
                    date_to: new Date(),
                    warehouse_id: 489,
                    page: 1,
                    pageSize: 20
                },
                columnList: [
                    { label: '日期', value: 'date' },
                    { label: 'SKU品种数', value: 'sku_type_quantity' },
                    { label: 'SKU总数量', value: 'sku_quantity' },
                ],
                warehouseList: [],
                tableData: [],
                selectionOptions: [],
                //数据总数量
                total: 0,
                //所有的数据
                totalData: '',
                //+号转时间戳，听说效率会高
                startTimeLimit: {
                    disabledDate: time => {
                        if (this.searchData.date_to) {
                            return (
                                +time > +this.searchData.date_to ||
                                +time > Date.now()
                            );
                        } else {
                            return +time > Date.now();
                        }
                    }
                },
                endTimeLimit: {
                    disabledDate: time => {
                        if (this.searchData.date_from) {
                            return (
                                +time < +this.searchData.date_from ||
                                +time > Date.now()
                            );
                        } else {
                            return +time > Date.now();
                        }
                    }
                },
                visible: false,
                loading: false
            };
        },
        mounted() {
            this.get_warehouse()
        },
        methods: {
            search() {
                this.searchData.page = 1
                this.init()
            },
            init() {
                const params = this.get_params(this.searchData);
                this.loading = true;
                this.$http(api_over_age, params).then(res => {
                    this.tableData = this.formate_parms(res.data)
                    this.loading = false
                    this.total = res.count
                }).catch(error => {
                    this.loading = false
                    this.$message({type: 'error', message: error})
                })
            },
            batch_report() {
                // const {date_from, date_to} = this.get_params(this.searchData);
                // const params = {date_from, date_to};
                // const header = {
                //     contentType: 'application/x-www-form-urlencoded'
                // };
                if(this.selectionOptions.length <= 0) return this.$message({type: 'warning', message: '请选择要导出的数据'})
                const params = this.selectionOptions.map(r => r.date)
                return this.$http(api_export_over_age, {ids: params, warehouse_id: this.searchData.warehouse_id}).then(res => {
                    if(res.join_queue === 1) {
                        this.visible = true;
                        this.$message({
                            type: 'success',
                            message: res.message
                        })
                    } else {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let params = {
                            file_code: res.file_code,
                            page: this.searchData.page,
                            pageSize: this.searchData.pageSize,
                        };
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                        this.$message({type: "success", message: '导出成功' || res});
                        return Promise.resolve()
                    }
                }).catch(err => {
                    this.$message({type: "error", message: err.message || err})
                });
            },
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init()
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init()
            },
            handle_selection_change(val) {
                this.selectionOptions = val
            },
            formate_parms(data) {
                return data.map(item =>　{
                    item.date = datef('YYYY-MM-dd', item.dateline)
                    return item
                })
            },
            get_params(data) {
                let params = _.clone(this.searchData)
                Object.keys(params).forEach(key => {
                    if (typeof params[key] === 'string') {
                        params[key] = params[key].trim();
                    }
                });
                if(params.date_to) {
                    params.date_to = datef('YYYY-MM-dd', this.searchData.date_to.getTime() / 1000);
                }
                if(params.date_from) {
                    params.date_from = datef('YYYY-MM-dd', this.searchData.date_from.getTime() / 1000);
                }
                return params
            },
            get_warehouse() {
                this.$http(api_warehouse, {sign: 'over_age'}).then(res => {
                    this.warehouseList = res.map(i => ({
                        value: i.id,
                        label: i.name
                    }))
                })
            }
        },
        components: {
            requestButton: require("@/global-components/request-button").default,
            tableModule: require("./table-module").default,
            labelItem: require("@/components/label-buttons").default,
            exportDialog:require('@/view/report/export-dialog.vue').default,
        }
    };
</script>
