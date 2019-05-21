<template>
    <page>
        <search-card :params="searchData" :clears="clears" @search="search">
            <label class="inline">操作日期：</label>
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
    //未拆包
    import {api_get_unpacked, api_get_unpacked_export} from '@/api/warehouse-data-record'
    //获得本地仓库
    import {store_list} from '@/api/storeManagement'
    import {downloadFile} from "@/lib/http";
    export default {
        data() {
            return {
                searchData: {
                    time_start:(Date.now() - 24 * 3600 * 14 * 1000),
                    time_end: Date.now(),
                    page: 1,
                    pageSize: 20
                },
                clears: {
                    time_start:(Date.now() - 24 * 3600 * 14 * 1000),
                    time_end: Date.now(),
                    page: 1,
                    pageSize: 20
                },
                columnList: [],
                tableData: [],
                //数据总数量
                total: 0,
                //所有的数据
                totalData: '',
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
                                +time < +this.searchData.time_start ||
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
                return this.$http(api_get_unpacked_export, params, header).then(res => {
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
            search() {
                this.validData().then(() => {
                    //校验成功
                    //重置到第一页
                    this.reset();
                    this.init(1)
                }).catch(err => {
                    //校验失败
                    this.$message({
                        type: 'warning',
                        message: err
                    });
                });
            },
            /**
             * 前端实现分页
             * @param flag 1为点击搜索，需要请求接口   0为点击分页或者分页数量，不需要请求接口
             */
            init(flag) {
                const params = this.handle_date(this.searchData);
                this.loading = true;
                if(flag) {
                    this.$http(api_get_unpacked, params).then(res => {
                        this.totalData = res.data;
                        this.tableData = this.pagination(this.totalData, this.searchData.page, this.searchData.pageSize);
                        this.page = res.page;
                        this.pageSize = res.pageSize;
                        this.total = res.count;
                        this.loading = false
                    });
                } else {
                    this.tableData = [];
                    this.loading = false;
                    this.$nextTick(() => {
                        this.tableData = this.pagination(this.totalData, this.searchData.page, this.searchData.pageSize);
                    })
                }
            },
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init(0)
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init(0)
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
            // 数据校验
            validData() {
                return new Promise((resolve, reject) => {
                    if(this.searchData.time_end === "" || this.searchData.time_end === undefined  ||
                        this.searchData.time_start === "" || this.searchData.time_start === undefined
                    ) {
                        reject('统计日期不能为空')
                    } else {
                        resolve()
                    }
                })
            },
            pagination(data, page, pageSize) {
                const first = (page - 1) * pageSize;
                const last = page * pageSize;
                return data.slice(first, last);
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
