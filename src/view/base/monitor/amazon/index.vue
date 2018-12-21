<template>
    <page>
        <search-card @search="search" :params="searchData" :clears="clears">
            <manage-search v-model="searchData"></manage-search>
        </search-card>
        <div>
            <div class="mt-xs mb-xs ">
                <el-button type="primary"
                           size="mini"
                           :disabled="multipleSelection.length===0"
                           class="ml-sm"
                           @click="batch_monitor">设置批量监控值
                </el-button>
                <el-button type="primary"
                           size="mini"
                           :disabled="multipleSelection.length===0"
                           class="ml-sm"
                           @click="eager">立即抓取
                </el-button>
                <el-button type="primary"
                           size="mini"
                           class="ml-sm"
                           @click="exports">导出
                </el-button>
            </div>
        </div>
        <manage-table :table-data="tableData"
                      :unit="unit"
                      :loading="loading"
                      :first-loading="firstLoading"
                      :search-data="searchData"
                      :total="total"
                      @handle-size-change="handle_size_change"
                      @handle-current-change="handle_current_change"
                      @handle-selection-change="handle_selection_change"
                      @view="view"
                      @edit="edit"
                      @view-historical-data="view_historical_data"></manage-table>
        <!--查看与编辑框/批量设置监控值框-->
        <edit-view-dialog
                v-model="dialogShow"
                :unit="unit"
                :is-view="isView"
                :current-data="currentData">
        </edit-view-dialog>
        <!--批量设置框-->
        <batch-set
                v-model="batchDialogShow"
                :unit="unit"
                @batch-set-submit="batch_set_submit"></batch-set>
        <!--历史数据框-->
        <history-data-dialog
                v-model="historyDialogShow"
                :history-table-data="historyTableData"></history-data-dialog>
    </page>
</template>
<style lang="stylus" scoped>

</style>
<script>
    import {api_amazon_account_health,
        api_amazon_account_health_history,
        api_amazon_account_health_set_more,
        api_amazon_account_health_export,
        api_amazon_account_health_repitle} from '../../../../api/monitor-amazon'
    import {downloadFile} from '@/lib/http';
    export default {
        page: {
            devinfo: {
                frontEnd: '钱宇琨',
                backEnd: '李佰敏',
                createdTime: '2018-08-22',
                updateTime: '2018-08-22'
            }
        },
        data() {
            return {
                total:1,
                firstLoading: true,
                loading: false,
                tableData: [],
                unit:{},
                searchData: {
                    account_id: '',//账号id
                    health_status: '',//账号状态
                    site:'',
                    time_start: '',//抓取时间
                    time_end: '',//抓取结束时间
                    page: 1,
                    pageSize: 20
                },
                clears: {
                    account_id: '',
                    health_status: '',
                    site:'',
                    time_start: '',
                    time_end: '',
                    page: 1,
                    pageSize: 20
                },
                multipleSelection: [],
                dialogShow: false,
                currentData: {},
                isView: true,
                historyDialogShow:false,
                historyTableData: {},
                batchDialogShow: false
            }
        },
        refresh(){
            this.init()
        },
        created() {
            this.init()
        },
        methods: {
            init(){
                this.loading = true;
                let params = clone(this.searchData);
                if(!!this.searchData.time_start){
                    let s = new Date(this.searchData.time_start);
                    params.time_start = datef('YYYY-MM-dd',s.getTime()/1000);
                }
                if(!!this.searchData.time_end){
                    let e = new Date(this.searchData.time_end);
                    params.time_end = datef('YYYY-MM-dd',e.getTime()/1000);
                }
                this.$http(api_amazon_account_health,params).then(res => {
                    this.tableData = res.data;
                    this.unit = res.unit;
                    this.total = res.count;
                    this.loading = false;
                    this.firstLoading = false;
                }).catch(err => {
                    this.$message({type:"error",err:err.message||err})
                });
            },
            search(){
                this.init()
            },
            batch_monitor(){//--------批量设置按钮
                this.batchDialogShow = true
            },
            batch_set_submit(val1,val2){//--------确定进行批量设置
                let params = {
                    amazon_account_ids: '',
                    order_rate:'',
                    balance_amount:''
                };
                params.amazon_account_ids = this.multipleSelection.map(row => row.amazon_account_id).join(',');
                params.order_rate = val1;
                params.balance_amount = val2;
                this.$http(api_amazon_account_health_set_more,params).then(res => {
                    this.$message({type:'success',message:res.message});
                    this.batchDialogShow = false
                })
            },
            eager(){//-------立即抓取按钮
                let params = {
                    amazon_account_ids: ''
                };
                params.amazon_account_ids = this.multipleSelection.map(row => row.amazon_account_id).join(',');
                this.$http(api_amazon_account_health_repitle,params).then(res => {
                    this.$message({type:'success',message:res.message})
                })
            },
            exports(){//-------导出按钮
                let datas = clone(this.searchData);
                let mes = {
                    account_id:'',
                    health_status: '',
                    time_start: '',
                    time_end: ''
                };
                mes.account_id = datas.account_id;
                mes.health_status = datas.health_status;
                mes.time_start = datas.time_start;
                mes.time_end = datas.time_end;
                this.$http(api_amazon_account_health_export,mes).then(res => {
                    let url = config.apiHost+'downloadFile/downExportFile';
                    let params = {
                        file_code:res.file_code,
                    };
                    downloadFile({
                        url:url,
                        get:params,
                        fileName:res.file_name,
                        suffix:'.xls',
                    });
                    this.$message({type:"success",message: res.message})
                }).catch(code => {
                    this.$message({type:"error",message:code.message||code})
                })
            },
            view(row){//----------查看
                this.currentData = row;
                this.isView = true;
                this.dialogShow = true;
            },
            edit(row){//----------编辑
                this.currentData = row;
                this.isView = false;
                this.dialogShow = true
            },
            view_historical_data(row){//---------查看历史数据
                let params = {
                    page: 1,
                    pageSize: 20
                };
                this.$http(api_amazon_account_health_history,row.amazon_account_id,params).then(res => {
                    this.historyTableData = res;
                });
                this.historyDialogShow = true
            },
            handle_size_change(val){//-----切换条数
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val){//-----切换页数
                this.searchData.page = val;
                this.init();
            },
            handle_selection_change(val){//------单行或多行数据被选中时按钮变成可点击状态
                this.multipleSelection = val
            }
        },
        components: {
            searchCard:require('@/components/search-card.vue').default,
            manageSearch:require('./manage-search.vue').default,
            manageTable:require('./manage-table.vue').default,
            editViewDialog:require('./edit-view-dialog.vue').default,
            historyDataDialog: require('./history-data-dialog.vue').default,
            batchSet:require('./batch-set.vue').default
        }
    }
</script>
