<template>
    <page class="p-abnormal">
        <search-module
            @search="init"
            @approve-status-change="approveStatusChange"
            @source-change="sourceChange"
            @abnormal-type-change="abnormalTypeChange"
            :search-data="searchData"
            :warehouse-list="warehouseList"></search-module>
        <div class="mt-sm mb-sm" style="overflow: hidden;">
            <div class="fr">
                <label class="color-lump issue"></label><span>：丢失包裹找回，数量有差异，未处理</span>
            </div>
        </div>
        <table-module
            :table-data="tableData"
            :loading="loading"
            :first-loading="firstLoading"
            :user-job="userJob"
            @search="init">
        </table-module>
        <el-pagination
            class="t-right"
            @size-change="handle_size_change"
            @current-change="handle_current_change"
            :current-page="page"
            :page-sizes="[20, 50, 100, 200]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </page>
</template>

<style lang="stylus">
    .p-abnormal {
        .el-card {
            overflow: visible;
            .width-super.el-input {
                width: 200px
            }
        }
    }
</style>

<script>
    import {api_purchase_order_long_time} from "@/api/long-not-opened";

    export default {
        page: {
            devinfo: {
                frontEnd: '吴淇嘉',
                backEnd: '邓海波',
                createTime: '2018-8-16',
                updateTime: '2018-8-22'
            }
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                value: '',
                warehouse_id: '',
                loading: false,
                searchData: {
                    warehouse_id: '',
                    process_status: '',
                    audit_status: '',
                    source: '',
                    abnormal_type: '',
                    lost_status: '',
                    person_type: 0,
                    person_id: '',
                    time_type: 0,
                    date_b:'',
                    date_e:new Date(),
                    bill_type:0,
                    bill_number:''
                },
                tableData: [],
                firstLoading:false,
                pageSize:50,
                page:1,
                total:0,
                userJob:0
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            approveStatusChange(val){
                this.$set(this.searchData,'audit_status',val);
                this.init();
            },
            sourceChange(val){
                this.$set(this.searchData,'source',val);
                this.init();
            },
            abnormalTypeChange(val){
                this.$set(this.searchData,'abnormal_type',val);
                this.init();
            },
            init() {
                let data = this.init_params();
                this.loading = true;
                this.$http(api_purchase_order_long_time, data).then(res => {
                    this.tableData = res.data;
                    this.total = res.count;
                    this.userJob = 0;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code,
                    })
                }).finally(() => {
                    this.loading = false;
                    this.firstLoading = true;
                })
            },
            init_params: function () {
                let data = clone(this.searchData);
                if (this.searchData.date_b) {
                    data.date_b = datef('YYYY-MM-dd', data.date_b.getTime() / 1000);
                } else {
                    data.date_b = '';
                }
                if (data.date_e) {
                    data.date_e = datef('YYYY-MM-dd', data.date_e.getTime() / 1000);
                } else {
                    data.date_e = '';
                }
                if(data.bill_number.trim()){
                    data.bill_number = data.bill_number.trim().split('\n').map(row=>row.trim()).filter(row=>!!row);
                }else{
                    data.bill_number = '';
                }
                data.page = this.page;
                data.pageSize = this.pageSize;
                return data
            },
            handle_size_change(val) {
                this.pageSize = val;
                this.init();
            },
            handle_current_change(val) {
                this.page = val;
                this.init();
            }
        },
        props:{
            warehouseList:{
                required:true,
                type:Array
            }
        },
        components: {
            searchModule: require('./search-module').default,
            tableModule: require('./table-module.vue').default
        }
    }
</script>
