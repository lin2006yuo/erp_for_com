<template>
    <page class="p-index">
        <card-search :form="searchData" @search="search" :clears="clears"></card-search>
        <permission
            tag="trendsSelect"
            class="inline ml-sm mr-xs mt-sm"
            type="primary"
            :route="apis.url_aliexpress_account_export"
            :selects="partAllOptions"
            @trigger="export_wish"
        ></permission>

        <table-list
            class="mt-sm"
            :table="table"
            :loading="loading"
            :first-loading="firstTime"
            :search-data="searchData"
            @selectChange="select_change"
            @sizeChange="handleSizeChange"
            @pageChange="handleCurrentChange"
        ></table-list>
        <export-dialog v-model="export_visible"></export-dialog>
    </page>
</template>


<script>

    import {
        api_aliexpress_account_list,
        url_aliexpress_account_export,
        api_aliexpress_account_export
    } from "../../../../api/aliexpress-Finance";
    import {initTime} from './util'

    export default {
        permission: {
            url_aliexpress_account_export
        },
        page: {
            devinfo: {
                frontEnd: "文军辉",
                backEnd: "王威",
                createTime: "2019-1-12",
                updateTime: ""
            }
        },
        data() {
            return {
                searchData: {
                    account_id: "",
                    seller_id: "",
                    date_type: 2,  // 交易时间。
                    date_s: this.initTime(1),
                    date_e: this.initTime(2),
                },
                clears: {
                    account_id: "",
                    seller_id: "",
                    date_type: 1,  // 交易时间。
                    date_s: this.initTime(1),
                    date_e: this.initTime(2),
                },
                partAllOptions: [
                    {name: "部分导出", value: 1},
                    {name: "全部导出", value: 0}
                ],
                export_visible: false,
                loading: false,
                firstTime: true,
                table:{
                    page: 1,
                    pageSize:20,
                    data:[],
                    count:0,
                    sum:{},
                },
                ids:[],
            };
        },
        mounted() {
           this.init();
        },
        methods: {
            initTime,
            init() {
                if (!!this.searchData.date_s && !!this.searchData.date_e) {
                    if (this.searchData.date_s / 1000 > this.searchData.date_e / 1000) {
                        this.$message({
                            type: 'warning',
                            message:'开始时间需要小开结束时间'
                        });
                    }
                }
                let data = this.init_params();
                this.loading = true;
                let header = {
                    timeout: 180000,
                    contentType:'application/x-www-form-urlencoded'
                };
                this.$http(api_aliexpress_account_list, data, header).then(res => {
                    this.table = res;
                    if (res.data.length > 0) {
                        this.firstTime = true
                    } else {
                        this.firstTime = false;
                    }
                }).catch(err => {
                    this.$message({
                        message: err.message || err
                    });
                    this.firstTime = false
                }).finally(() => {
                    this.loading = false;
                });
            },
            init_params() {
                let data = clone(this.searchData);
                data.date_s = data.date_s ? datef('YYYY-MM-dd', data.date_s / 1000) : "";
                data.date_e = data.date_e ? datef('YYYY-MM-dd', data.date_e / 1000) : "";
                data.page = this.table.page - 0,
                data.pageSize = this.table.pageSize - 0;
                return data;
            },
            search() {
                this.init();
            },
            export_wish(val) {
                let params = {};
                /** 部分导出的值是1  全部导出的为是0 */
                if (val.value === 1 && !!this.ids.length) {
                    let account_ids = this.ids.map(k => k.account_id).join(",");
                    // 部分导出。
                    let data = this.init_params();
                    params = {
                        account_id_arr:account_ids.split(","),
                        export_type: 1,
                        seller_id:data.seller_id,
                        date_type:data.date_type,
                        date_s: data.date_s,
                        date_e:data.date_e
                    };
                } else if (val.value === 0) {
                    // 全部导出--- 值为0。
                    let data = this.init_params();
                    data.export_type = 0;
                    params = data;
                } else {
                    this.$message({type: "warning", message: "请选择需要导出的数据"});
                    return;
                }
                this.$http(api_aliexpress_account_export, params).then(res => {
                    this.export_visible = true;
                });
            },
            select_change(val) {
                this.ids = val;
            },
            handleSizeChange(val) {
                this.table.pageSize = val;
                this.init();
            },
            handleCurrentChange(val) {
                this.table.page = val;
                this.init();
            }
        },
        components: {
            tableList: require("./table-list.vue").default,
            cardSearch: require("./card-search.vue").default,
            exportDialog: require("../../../report/export-dialog").default,
            trendsSelect: require("@/components/trends-select.vue").default,
        }
    };
</script>

