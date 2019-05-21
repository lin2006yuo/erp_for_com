<template>
    <page class="p-dialog-error-info-search">
        <page-dialog :title="'采购记录'" v-model="show" size="large" :height="'90%'" @open="open"
                     :close-on-click-modal="true">
            <div class="mb-sm">
                <div>
                    <el-row>
                        <label class="ml-sm">供应商：{{recordData.company_name}}</label>
                    </el-row>
                    <el-row class="mt-mini">
                        <el-col :span="12">
                            <label class="ml-sm">采购总金额：CNY&nbsp{{recordData.sum_amount}}</label>
                        </el-col>
                        <el-col :span="12">
                            <label>1年内采购金额：CNY&nbsp{{recordData.year_amount}}</label>
                        </el-col>
                    </el-row>
                </div>
                <el-row class="mt-xs">
                    <el-checkbox class="ml-sm inline" label="所有面全选" v-model="checkedAll" ref="checkedAll" :checked="selectList.length <= 0?false:true" @change="checked_all(checkedAll)"></el-checkbox>
                    <permission tag="request-button"
                                class="ml-sm inline"
                                :route="apis.url_purchase_order_export"
                                req-key="url_purchase_order_export"
                                :mintime="200"
                                :disabled="selectList.length <= 0"
                                @click.native="exportHandle">导出
                    </permission>
                </el-row>
                <export-dialog v-model="export_visible"></export-dialog>
                <el-table class="mt-sm"
                          ref="tableData"
                          border :data="tableData"
                          highlight-current-row
                          v-resize="{height:120}"
                          v-loading="loading"
                          @selection-change="selection_change"
                          element-loading-text="玩命加载中...">
                    <div slot="empty" class="no-data-reminder">
                        <i></i>
                        {{emptyText}}
                    </div>
                    <el-table-column type="selection" width="35px" :selectable="selectable"></el-table-column>
                    <el-table-column label="采购单号" min-width="50" inline-template>
                        <div class="p-table-list-td-text" :title="row.purchase_plan_number">{{row.purchase_plan_number}}
                        </div>
                    </el-table-column>
                    <el-table-column label="运费" min-width="50" inline-template>
                        <div class="p-table-list-td-text" :title="row.shipping_cost | filterNumber">
                            {{row.currency_code}}{{row.shipping_cost | filterNumber}}
                        </div>
                    </el-table-column>
                    <el-table-column label="贷款" min-width="50" inline-template>
                        <div class="p-table-list-td-text" :title="row.amount | filterNumber">
                            {{row.currency_code}} {{row.payable_amount | filterNumber}}
                        </div>
                    </el-table-column>
                    <el-table-column label="应付款" min-width="50" inline-template>
                        <div class="p-table-list-td-text" :title="row.payable_amount | filterNumber">
                            {{row.currency_code}} {{row.payable_amount | filterNumber}}
                        </div>
                    </el-table-column>
                    <el-table-column label="采购日期" min-width="50" inline-template>
                        <times :time="row.purchase_time"></times>
                    </el-table-column>
                    <el-table-column label="采购状态" min-width="50" inline-template>
                        <div class="p-table-list-td-text"  :title="row.purchase_order_status_text">
                            {{row.purchase_order_status_text}}
                        </div>
                    </el-table-column>
                </el-table>
            </div>
            <el-row slot="footer" style="line-height: 27px;" class="dialog-footer">
                <el-pagination
                    class="inline"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="table.page"
                    :page-sizes="[20, 50, 100, 200,500]"
                    :page-size="table.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="table.total">
                </el-pagination>
                <el-button size="mini" class="inline" @click.native="close">关 闭</el-button>
            </el-row>
        </page-dialog>
    </page>
</template>
<style lang="stylus">
    .p-dialog-error-info-search {
        .page-dialog .dialog__body {
            padding: 0 10px 5px 10px;
            color: #475669;
            font-size: 1.2rem;
            overflow-x: hidden;
            overflow-y: hidden;
            box-sizing: border-box;
            height: 100%;
            max-height: 70%;
            .mt-sm {
                margin-bottom 60px;
                max--height: 520px;
            }
        }
    }

</style>
<script>
    import {api_publish_edit_carrier, url_publish_carrier_list,} from '../../../../api/purchase'
    import {api_purchase_order_export,url_purchase_order_export} from '@/api/assert-sup'
    import {downloadFile} from '@/lib/http'
    export default {
        page: {
            devinfo: {
                frontEnd: '覃宏峰',
                backEnd: '蓝术术',
                createTime: '2018-10-18',
                updateTime: '2018-10-19'
            }
        },
        permission: {
            url_publish_carrier_list,
            url_purchase_order_export
        },
        data() {
            return {
                show: this.value,
                checkedAll: false,
                export_visible:false,
                tableData: [],
                allPurchase:[],
                flag:false,
                batchId:[],
                isIndeterminate:true,
                firstLoading: true,
                loading: false,
                isAll:'',
                table:{
                    total: 0,
                    page: 1,
                    pageSize: 50,
                },
                export_type:2,
                selectList:[]
            }
        },
        mounted(){


        },
        methods: {
            open() {
                this.checkedAll=false;
                this.export_type=2;
                this.search();
            },
            checked_all(val){
                this.checked(val)
            },
            // 选中
            checked(val){
                if(val){
                    this.tableData.forEach((row)=>{
                        if (this.selectList.length>0){
                            this.$refs.tableData.toggleRowSelection(row,true);
                        }else {
                            this.$refs.tableData.toggleRowSelection(row,true);
                        }
                        this.$message({type:"success",message:`已全选所有页，共计：${this.table.total}条数据`});
                    });
                }else{
                    this.$refs.tableData.clearSelection();
                    this.$message({type:"success",message:`已取消全选`});
                }
            },
            // 全选时
            selectable(row, index) {
                return !this.checkedall;
            },
            selection_change(val) {
                this.selectList = val;

            },
            search() {
                let data = {
                    page: this.table.page,
                    pageSize: this.table.pageSize,
                    supplier_id: this.recordData.supplier_id
                };
                this.loading = true;
                this.$http(api_publish_edit_carrier, data).then(res => {
                    this.tableData = res.data;
                    this.table.total = res.count;
                    this.loading = false;
                    this.firstLoading = false;
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            handleSizeChange(val) {
                this.table.pageSize = val;
                this.search();

            },
            handleCurrentChange(val) {
                this.table.page = val;
                this.search()
            },
            close() {
                if (this.selectList.length===this.tableData.length){
                    this.$refs.tableData.clearSelection();
                    this.checkedAll=false
                }
                this.show = false;
            },
            keep() {
                if (this.selectList.length===this.tableData.length){
                    this.$refs.tableData.clearSelection();
                    this.checkedAll=false
                }
                this.show = false;
            },
            exportHandle() {
                if (this.selectList.length <= 0) {
                    this.$reqKey('url_purchase_order_export', false);
                    return this.$message({
                        type: "warning",
                        message: "请先选择需要导出的数据"
                    });
                }
                let exportData = {
                    ids: this.selectList.map(row => row.id),
                    fields: [{"field_name": "采购单号", "field_key": "id"}, {
                        "field_name": "运费",
                        "field_key": "shipping_cost"
                    },
                        {"field_name": "货款", "field_key": "amount"}, {
                            "field_name": "应付款",
                            "field_key": "payable_amount"
                        },
                        {"field_name": "采购日期", "field_key": "purchase_time"}, {
                            "field_name": "采购状态",
                            "field_key": "purchase_status"
                        }],
                    export_type: this.export_type,
                    page: this.table.page,
                    pageSize: this.table.pageSize,
                    supplier_id: this.export_type === 1 ? this.recordData.supplier_id : ''
                };
                this.$http(api_purchase_order_export, exportData).then(res => {
                    if (res.message === "申请成功") {
                        this.export_visible=true;
                        this.$message({type: "success", message: res.message || res});
                    } else {
                        let url = config.apiHost + 'downloadFile/downExportFile';
                        let data = {
                            file_code: res.file_code,
                            page: this.table.page,
                            pageSize: this.table.pageSize,
                        };
                        downloadFile({
                            url: url,
                            get: data,
                            fileName: res.file_name,
                            suffix: '.xls',
                        });
                        this.$message({type: "success", message: res.message || res});
                        return Promise.resolve();
                    }
                }).catch(code => {
                    this.$message({type: 'error', message:res.message || code});
                    console.log(code)
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('url_purchase_order_export', false);
                    }, 300);
                });
            }
        },
        filters: {
            filterNumber(val) {
                if (Number(val) > 0) {
                    return Number(val).toFixed(3);
                } else {
                    return '-- --';
                }
            },
            filterTrackingNumber(val) {
                return val === '' ? '-- --' : val;
            }
        },
        computed: {
            emptyText() {
                return this.firstLoading ? '等待查询数据中...' : '暂无数据'
            }
        },
        watch: {
            selectList(val){
                if (val.length!=this.tableData.length&&val.length!=0){
                    this.checkedAll=false;
                }else{
                    if (val.length===0&&this.checkedAll){
                        this.checkedAll=false;
                        // console.log(val,'val');
                    }else{
                        this.checkedAll=true
                    }
                }
            },
            show(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.show = val;
            },
            checkedAll(val) {
                if (val) {
                    this.export_type=1;
                    this.tableData.forEach(row => {
                        this.$refs.tableData.toggleRowSelection(row, true);
                    })
                } else {
                    this.export_type=2;
                    if (this.selectList.length!=this.tableData.length) {
                        this.selectList.forEach(row => {
                            this.$refs.tableData.toggleRowSelection(row, true);
                        })
                    }else{
                        this.tableData.forEach(row => {
                            this.$refs.tableData.toggleRowSelection(row, false);
                        })
                    }
                }
            },
            tableData(val){
                if (this.checkedAll) {
                    this.tableData.forEach(row => {
                        this.$refs.tableData.toggleRowSelection(row, true);
                    })
                } else {
                    this.tableData.forEach(row => {
                        this.$refs.tableData.toggleRowSelection(row, false);
                    })
                }
            }
        },
        props: {
            value: {
                required: true,
                type: Boolean
            },
            recordData: {
                required: true,
                type: Object
            }
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            searchCard: require('@/components/search-card').default,
            labelItem: require('@/components/label-item').default,
            exportDialog: require('../../../report/export-dialog').default,
        }
    }
</script>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
