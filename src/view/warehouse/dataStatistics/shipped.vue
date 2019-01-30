<template>
    <page>
        <search-card :params="searchData" :clears="clears" @search="search">
            <label class="inline">操作日期：</label>
            <el-date-picker
                v-model="searchData.time_start"
                class="inline date"
                :picker-options="startTimeLimit"
                placeholder="选择日期"
            ></el-date-picker>
            <span>&nbsp;--&nbsp;</span>
            <el-date-picker
                v-model="searchData.time_end"
                class="inline date mr-sm"
                :picker-options="endTimeLimit"
                placeholder="选择日期"
            ></el-date-picker>
        </search-card>
        <request-button :request="batch_report" class="mb-sm mt-sm ml-sm">批量导出</request-button>
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
    import {api_get_shipped, api_get_shipped_export} from '@/api/warehouse-data-record'
    //获得本地仓库
    import {store_list} from '@/api/storeManagement'
    import {downloadFile} from "@/lib/http";
    export default {
        data() {
            return {
                searchData: {
                    time_start:(Date.now() - 24 * 3600 * 15 * 1000),
                    time_end: Date.now(),
                    page: 1,
                    pageSize: 20
                },
                clears: {
                    time_start:(Date.now() - 24 * 3600 * 15 * 1000),
                    time_end: Date.now(),
                    page: 1,
                    pageSize: 20
                },
                columnList: [],
                tableData: [],
                //数据总数量
                total: 0,
                //+号转时间戳，听说效率会高
                startTimeLimit: {
                    disabledDate: time => {
                        if (this.searchData.time_end) {
                            return (
                                +time > +this.searchData.time_end ||
                                +time > Date.now() - 24 * 3600 * 1000
                            );
                        } else {
                            return +time > Date.now() - 24 * 3600 * 1000;
                        }
                    }
                },
                endTimeLimit: {
                    disabledDate: time => {
                        if (this.searchData.time_start) {
                            return (
                                +time < this.searchData.time_start ||
                                +time > Date.now()
                            );
                        } else {
                            return +time > Date.now() - 24 * 3600 * 1000;
                        }
                    }
                },
                visible: false,
                loading: false
            };
        },
        mounted() {
            //获取本地仓库
            this.loading = true;
            this.$http(store_list, {type: 1}).then(res => {
                const localStore = res.data;
                this.columnList = this.handle_columns_name(localStore);
                this.loading = false
            })
        },
        methods: {
            batch_report() {
                const {time_start, time_end} = this.handle_date(this.searchData);
                const params = {time_start, time_end};
                const header = {
                    contentType: 'application/x-www-form-urlencoded'
                };
                this.$http(api_get_shipped_export, params, header).then(res => {
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
                            page: this.tableData.page,
                            pageSize: this.tableData.pageSize,
                        };
                        downloadFile({
                            url: url,
                            get: params,
                            fileName: res.file_name,
                            suffix: '.xls',
                            success: (e) => {console.log(e)}
                        });
                        this.$message({type: "success", message: '导出成功' || res});
                    }
                }).catch(err => {
                    this.$message({type: "error", message: err.message || err})
                });
                return Promise.resolve()
            },
            search() {
                if(this.searchData.time_end === "" || this.searchData.time_end === undefined) {
                    this.$message({
                        type: 'warning',
                        message: '请选择结束时间'
                    });
                    return
                }
                //重置到第一页
                this.reset();
                this.init()
            },
            init() {
                const params = this.handle_date(this.searchData);
                this.loading = true;
                this.$http(api_get_shipped, params).then(res => {
                    this.tableData = res.data;
                    this.page = res.page;
                    this.pageSize = res.pageSize;
                    this.total = res.count;
                    this.loading = false
                });
                console.log('请求数据')
            },
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init()
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init()
            },
            reset() {
                this.searchData.page = 1
            },
            //处理时间格式
            handle_date(data) {
                return {
                    page: data.page,
                    pageSize: data.pageSize,
                    time_start: this.searchData.time_start === "" || this.searchData.time_start === undefined ? "" : datef('YYYY-MM-dd', this.searchData.time_start / 1000),
                    time_end: datef('YYYY-MM-dd', +this.searchData.time_end / 1000)
                }
            },
            // 计算表头
            handle_columns_name(localStore) {
                const arr = [{label: '统计日期', value: 'dateline'}];
                localStore.forEach(v => {
                    arr.push({label: v.name, value: v.id})
                });
                arr.push({label: '合计', value: '0'});
                return arr
            },
        },
        components: {
            requestButton: require("@/global-components/request-button").default,
            tableModule: require("./table-module").default,
            labelItem: require("@/components/label-buttons").default,
            exportDialog:require('@/view/report/export-dialog.vue').default,
        }
    };
</script>
