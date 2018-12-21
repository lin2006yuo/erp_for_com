<template>
    <page class="p-sku-sales-dynamic">
        <search-card :params="searchData" :clears="clears" @search="init">
            <el-row class="mb-xs">
                <label-item label="平台：" class="inline">
                    <select-remote class="width-sm"
                                   v-sf.channel_id
                                   v-model="searchData.channel_id"
                                   :remote="channel_remote">
                    </select-remote>
                </label-item>
                <label-item label="商品分类：" class="inline ml-sm">
                    <el-cascader :options="goodsType"
                                 class="width-sm"
                                 placeholder="可以输入搜索"
                                 size="small"
                                 filterable
                                 clearable
                                 change-on-select
                                 expand-trigger="hover"
                                 v-model="searchData.category_id">
                    </el-cascader>
                </label-item>
                <label-item label="供应商：" class="inline ml-sm">
                    <supplier class="inline s-width-large" v-sf.supplierId :placeHolder="true"
                              v-model="searchData.supplier_id"></supplier>
                </label-item>
                <el-select class="inline ml-sm width-xs" v-model="searchData.snType">
                    <el-option v-for="item in staffTypeList"
                               :value="item.value"
                               :label="item.label"
                               :key="item.value"></el-option>
                </el-select>
                <param-account
                        class="width-sm"
                        v-if="searchData.snType === 'developer_id'"
                        v-model="searchData.snText"
                        v-sf.snText
                        :fixResult="development_fix_result"
                        type="memberShipSales"
                        placeholder="请选择/输入..."
                        url="get|user/development/staffs">
                </param-account>
                <purchaser v-else
                           v-sf.snText
                           class="inline width-sm"
                           v-model="searchData.snText">
                </purchaser>
                <label-item label="SKU：" class="inline ml-sm">
                    <order-input v-model="searchData.sku"
                                 v-sf.sku
                                 @keydown="init"
                                 class="width-super">
                    </order-input>
                </label-item>
            </el-row>
            <label-item label="最近7天销量范围：" class="inline">
                <integer-input v-model="searchData.d7_min"
                               class="width-xs" :min="0"></integer-input>
                <label>&nbsp;--&nbsp;</label>
                <integer-input v-model="searchData.d7_max" class="width-xs" :min="0"></integer-input>
            </label-item>
            <label-item label="增长率：" class="inline ml-sm">
                <integer-input v-model="searchData.rate_min" class="width-xs" :min="0"></integer-input>
                <span>%</span>
                <label>&nbsp;--&nbsp;</label>
                <integer-input v-model="searchData.rate_max" class="width-xs" :min="0"></integer-input>
                <span>%</span>
            </label-item>
            <label-item label="销售时间：" class="inline ml-sm">
                <el-date-picker v-model="searchData.date_b"
                                type="date"
                                placeholder="开始时间"
                                @change="begin_change"
                                v-sf.date_b
                                :picker-options="pickerStart"
                                class="inline date ml-mini width-sm"></el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker v-model="searchData.date_e"
                                type="date"
                                placeholder="结束时间"
                                @change="end_change"
                                v-sf.date_e
                                :picker-options="pickerEnd"
                                class="date mr-sm width-sm"></el-date-picker>
            </label-item>
        </search-card>
        <table-module class="mt-xs"
                      :loading="loading"
                      :total="total"
                      :search-data="searchData"
                      @handle-size-change="handle_size_change"
                      @handle-current-change="handle_current_change"
                      @export="export_file"
                      :table-data="tableData"></table-module>
        <export-dialog v-model="exportVisible"></export-dialog>
    </page>
</template>

<style lang="stylus">
    .p-sku-sales-dynamic {
        .el-card {
            overflow: visible;
        }
    }
</style>

<script>
    import {api_get_categories} from '@/api/stock-control'
    import {api_get_channel, api_sku_sales_dynamic, api_sku_sales_dynamic_export, } from '@/api/report-channel'
    import {downloadFile} from '@/lib/http';

    export default {
        page: {
            devinfo: {
                frontEnd: '张志勇',
                backEnd: '',
                createTime: '2017-8-5',
                updateTime: '2017-8-22'
            }
        },
        data() {
            return {
                searchData: {
                    channel_id: 0,
                    category_id: [""],
                    supplier_id: '',
                    snType: 'developer_id',
                    snText: '',
                    /*developer_id: '',
                    purchaser_id: '',*/
                    sku: '',
                    d7_min: '',
                    d7_max: '',
                    rate_min: '',
                    rate_max: '',
                    date_b: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    date_e: new Date(),
                    page: 1,
                    pageSize: 50,
                },
                clears: {
                    channel_id: 0,
                    snType: 'developer_id',
                    category_id: [""],
                    date_b: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    date_e: new Date(),
                },
                goodsType: [],
                staffTypeList: [
                    {label: '开发员', value: 'developer_id'},
                    {label: '采购员', value: 'purchaser_id'},
                ],
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.searchData.date_e) {
                            return time.getTime() > this.searchData.date_e.getTime();
                        } else {
                            return false
                        }

                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.date_b) {
                            return time.getTime() < this.searchData.date_b.getTime();
                        } else {
                            return false
                        }

                    }
                },
                tableData: [],
                loading: false,
                total: 0,
                exportVisible: false,
            }
        },
        mounted() {
            this.categories_init();
            this.init();
        },
        methods: {
            development_fix_result(res) {
                return res.map(row => {
                    return {
                        value: row.id,
                        label: row.realname
                    }
                })
            },
            categories_init() {
                this.$http(api_get_categories).then(res => {
                    this.goodsType = res.map(row => {
                        return {
                            value: row.id,
                            label: row.title,
                            children: row.childs.map(ch => {
                                return {
                                    value: ch.id,
                                    label: ch.title,
                                }
                            })
                        }
                    });
                    let cur = {label: "全部", value: ""};
                    this.goodsType.unshift(cur);
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            channel_remote(callback) {
                return this.$http(api_get_channel, {}).then(res => {
                    callback(res);
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            init() {
                let data = this.get_params();
                if(data === false) return;
                this.tableData = [];
                this.loading = true;
                this.$http(api_sku_sales_dynamic, data).then(res => {
                    this.tableData = res.data;
                    this.total = res.count;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    this.loading = false;
                })
            },
            export_file(params) {
                let data = this.get_params();
                Object.assign(data, params);
                this.$http(api_sku_sales_dynamic_export, data).then(res =>{
                    if(res.join_queue === 1) {
                        this.exportVisible = true;
                    } else {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let data = {
                            file_code: res.file_code,
                        };
                        downloadFile({
                            url: url,
                            get: data,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                    }
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            get_params() {
                Object.keys(this.searchData).forEach(key => {
                    if (typeof this.searchData[key] === "string") {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
                let params = clone(this.searchData);
                if (this.searchData.date_b) {
                    params.date_b = datef('YYYY-MM-dd', this.searchData.date_b.getTime() / 1000);
                } else {
                    params.date_b = '';
                }
                if (this.searchData.date_e) {
                    params.date_e = datef('YYYY-MM-dd', this.searchData.date_e.getTime() / 1000);
                } else {
                    params.date_e = '';
                }

                params.d7_min && (params.d7_min = Number(params.d7_min));
                params.d7_max && (params.d7_max = Number(params.d7_max));
                params.rate_min && (params.rate_min = parseFloat(Number(params.rate_min))/100);
                params.rate_max && (params.rate_max = parseFloat(Number(params.rate_max))/100);
                if(isNaN(params.d7_min) || isNaN(params.d7_max) || params.d7_max < params.d7_min) {
                    this.$message({type: 'error', message: '最近7日销量范围输入无效'});
                    return false;
                }
                if(isNaN(params.rate_min) || isNaN(params.rate_max) || params.rate_max < params.rate_min) {
                    this.$message({type: 'error', message: '增长率范围输入无效'});
                    return false;
                }
                params.category_id = params.category_id[params.category_id.length - 1];
                params.sku = params.sku.split('\n').filter(row => !!row).map(row => row.trim());
                return params;
            },
            begin_change(date) {
                this.searchData.date_e = new Date(this.searchData.date_b.getTime() + 7 * 24 * 60 * 60 * 1000);
            },
            end_change(date) {
                this.searchData.date_b =new Date(this.searchData.date_e.getTime() - 7 * 24 * 60 * 60 * 1000);
            },
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init();
            }
        },
        components: {
            searchCard: require('@/components/search-card.vue').default,
            selectRemote: require('@/components/select-remote.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            supplier: require('@/api-components/supplier.vue').default,
            paramAccount: require('@/api-components/param-account.vue').default,
            purchaser: require('@/api-components/purchaser.vue').default,
            labelButtons: require('@/components/label-buttons.vue').default,
            orderInput: require('@/components/order-input.vue').default,
            tableModule: require('./table-module.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
            exportDialog: require('../export-dialog.vue').default,
        }
    }
</script>
