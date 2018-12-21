<template>
    <page class='p-index-monitor-ebay'>
        <search-card :params="searchData"
                     :clears="clears"
                     @search="search">
            <manage-search v-model="searchData"></manage-search>
        </search-card>
        <div class="mb-xs mt-xs">
            <el-button type="primary"
                       size="mini"
                       @click="batch_monitor"
                       :disabled="multipleSelection.length===0"
                       class="ml-sm">设置批量监控值
            </el-button>
            <el-button type="primary"
                       size="mini"
                       class="ml-sm"
                       :disabled="multipleSelection.length===0"
                       @click="eager">立即抓取
            </el-button>
            <el-button type="primary"
                       size="mini"
                       class="ml-sm"
                       :disabled="multipleSelection.length===0"
                       @click="exports">导出
            </el-button>
        </div>
        <manage-table :table-data="tableData"
                      :loading="loading"
                      :first-loading="firstLoading"
                      :search-data="searchData"
                      :total="total"
                      @view="view"
                      @sort-click="sort_click"
                      @handle-size-change="handle_size_change"
                      @handle-current-change="handle_current_change"
                      @handle-selection-change="handle_selection_change"
                      @view-historical-data="view_historical_data"></manage-table>
        <!--查看与编辑框/批量设置监控值框-->
        <total-dialog
                v-model="totalDialogShow"
                :current-data="currentData"
                :view-dialog-show="viewDialogShow"
                @update="update"
                @batch-set="batch_set"></total-dialog>
        <!--历史数据框-->
        <history-data-dialog
                v-model="historyDialogShow"
                :history-table-data="historyTableData"
                :history-data="historyData"
                :history-total="historyTotal"
                @handle-history-size-change="handle_history_size_change"
                @handle-history-current-change="handle_history_current_change"></history-data-dialog>
    </page>
</template>
<style lang="stylus" scoped>

</style>
<script>
    import {api_ebay_account_health,
            api_ebay_account_health_monitor_data,
            api_ebay_account_health_repitle,
            api_ebay_account_health_set_one,
            api_ebay_account_health_set_more,
            api_ebay_account_health_export} from '@/api/monitor-ebay';
    import {downloadFile} from '@/lib/http';
    export default {
        page: {
            devinfo: {
                frontEnd: '钱宇琨',
                backEnd: '王留伟',
                createdTime: '2018-08-08',
                updateTime: '2018-08-08'
            }
        },
        data() {
            return {
                total: 1,
                historyTotal: 1,
                searchData:{
                    account_id:'',//账号id
                    region:'',//站点
                    site_name:'',//站点名称
                    start_time:'',//开始时间
                    end_time:'',//结束时间
                    order: '',//排序
                    page: 1,
                    size: 50,
                    latest: 1,//是否为最新数据
                },
                historyData: {//历史数据请求参数
                    account_id: '',//账号id
                    region: '',//站点
                    start_time:'',//开始时间
                    end_time:'',//结束时间
                    page: 1,
                    size: 20,
                    latest: 0,//是否为最新数据
                    account_name: '',
                    code: ''
                },
                clears:{
                    account_id:'',//账号id
                    region:'',//站点
                    site_code:'',
                    start_time:'',//开始时间
                    end_time:'',//结束时间
                    order: '',
                    page: 1,
                    size: 50,
                    latest: 1,
                },
                tableData:[],
                loading:false,
                firstLoading:true,
                multipleSelection: [],//被选中列表
                historyTableData: [],//历史数据列表
                historyDialogShow: false,//历史数据
                currentData: {},//当前查看框数据
                viewDialogShow: false,//查看框
                totalDialogShow: false//总对话框
            }
        },
        refresh(){
            this.init();
        },
        created() {
            this.init()
        },
        methods: {
            init(){
                this.loading = true;
                this.$http(api_ebay_account_health,this.searchData).then(res=>{
                    this.loading = false;
                    this.firstLoading = false;
                    this.tableData = res.data.lists;
                    //获取指定账号区域的监控阈值
                    this.tableData.forEach(row=>{
                        this.$http(api_ebay_account_health_monitor_data,row.account_id,row.region).then(mRes=>row.goal = mRes.data).catch(mErr => {
                            this.$message({type: 'error',err: mErr.message})
                        })
                    });
                    this.total = res.data.count
                }).catch(err => {
                    this.$message({type:"error",err:err.message||err})
                });
            },
            handle_size_change(val){//------------------切换条数
                this.searchData.size = val;
                this.init();
            },
            handle_current_change(val){//---------------切换页数
                this.searchData.page = val;
                this.init();
            },
            handle_selection_change(val){//-------------多选列表选中按钮变成可点击
                this.multipleSelection = val
            },
            search(){//-------------------搜索
                this.init()
            },
            sort_click(val){//------排序
                let type = val.order==='ascending'?'asc':'desc';
                this.searchData.order = val.prop+' '+type;
                this.init();
            },
            history_init(){//-----------历史数据列表初始化
                this.$http(api_ebay_account_health,this.historyData).then(res=>{
                    this.historyTableData = res.data.lists;
                    this.historyTotal = res.data.count;
                }).catch(code => {
                    this.$message({type:"error",code:code.message||code})
                });
            },
            handle_history_size_change(val){//---------历史数据列表切换条数
                this.historyData.size = val;
                this.history_init();
            },
            handle_history_current_change(val){//-------历史数据列表切换页数
                this.historyData.page = val;
                this.history_init();
            },
            view_historical_data(row){//---------------查看历史数据
                this.historyDialogShow = true;
                this.historyData.account_name = row.account_name;
                this.historyData.code = row.code;
                this.historyData.account_id = row.account_id;
                this.historyData.region = row.region;
                this.history_init()
            },
            view(row){//---------------查看与编辑
                this.totalDialogShow = true;
                this.viewDialogShow = true;
                this.currentData = row;
            },
            update(obj){//---------------查看与编辑框确定按钮
                let account_region = [];
                let setting = {};
                for ( let key in obj){
                    obj[key].forEach(row => setting[row.type + ''] = row.name)
                }
                account_region = [{
                    account_id : this.currentData.account_id,
                    region: this.currentData.region
                }];
                let params = {
                    account_region:account_region,
                    setting:setting
                };
                this.$http(api_ebay_account_health_set_one,params).then(res =>{
                    Object.assign(this.currentData.goal,setting);
                    this.totalDialogShow = false;
                    this.$message({type: "success",message: res.message, duration:1000});
                }).catch(err=>{
                    this.$message({type: "error", message: err.message});
                })
            },
            batch_monitor(){//-----------批量设置监控值
                this.totalDialogShow = true;
                this.viewDialogShow = false;
            },
            batch_set(obj){//---------批量设置监控值框确定按钮
                let account_region = [];
                let setting = {};
                for(let key in obj){
                    obj[key].forEach(row => setting[row.type+'']=row.name)
                }
                account_region = this.multipleSelection.map(row => {
                    return {
                        account_id: row.account_id,
                        region: row.region
                    }
                });
                let params = {
                    account_region:account_region,
                    setting:setting
                };
                this.$http(api_ebay_account_health_set_more, params).then(res=>{
                    this.multipleSelection.forEach(row=>{
                        Object.assign(row.goal,setting)
                    });
                    this.totalDialogShow = false;
                    this.$message({type: "success", message: res.message, duration: 1000});
                }).catch(err=>{
                    this.$message({type: "error", message: err.message});
                });
            },
            eager(){//-----------立即抓取
                let account_ids = this.multipleSelection.map(row=>row.account_id);
                this.$http(api_ebay_account_health_repitle,{account_ids:account_ids}).then(res=>{
                    this.$message({type: "success", message: res.message});
                }).catch(err=>{
                    this.$message({type: "success", message: err.message});
                })
            },
            exports(){//----------导出
                let datas = clone(this.searchData);
                let mes = {
                    ids: [],
                    file_name: ''
                };
                let simpleName = datas.account_id === ''?'':this.multipleSelection[0].code;
                mes.ids = this.multipleSelection.map(row => row.id);
                mes.file_name = '账号简称' + '.'+ simpleName + '_' + '站点' + '.' + datas.site_name + '_' + '抓取时间' + '.' + datas.start_time + '--' + datas.end_time
                this.$http(api_ebay_account_health_export,mes).then(res=>{

                    if (res.data.status === 1){
                        let url = config.apiHost+'downloadFile/downExportFile';
                        let params = {
                            file_code:res.data.file_code,
                        };
                        downloadFile({
                            url:url,
                            get:params,
                            fileName:res.data.file_name,
                            suffix:'.xls',
                        });
                        this.$message({type:"success",message: res.data.message})
                    };
                }).catch(code => {
                    this.$message({type:"error",message:code.message||code})
                });
            },
        },
        components: {
            searchCard:require('@/components/search-card.vue').default,
            manageSearch:require('./manage-search.vue').default,
            manageTable:require('./manage-table.vue').default,
            totalDialog:require('./total-dialog.vue').default,
            historyDataDialog: require('./history-data-dialog.vue').default
        }
    }
</script>
