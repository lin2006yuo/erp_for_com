<template>
    <page>
        <search-module
                :searchData="searchData"
                :clears="clears"
                :status-button-list="statusButtonList"
                :refund-status-buttons="refundStatusButtons"
                :type-button-list="typeButtonList"
                :channel-list="channelList"
                @change-status="change_status"
                @change-type="change_type"
                @search="search"></search-module>
        <div class="mt-xs mb-xs">
            <el-button type="primary" size="mini"
                       class="ml-sm"
                       :disabled="multipleSelection.length===0||searchData.status !==1"
                       @click="manual_distribute">指定负责人
            </el-button>
            <el-button type="primary" size="mini"
                       class="ml-sm"
                       :disabled="searchData.status !== 2"
                       @click="auto_distribute">自动指定买家
            </el-button>
        </div>
        <table-module
                :table-data="tableData"
                :loading="loading"
                :first-loading="firstLoading"
                :searchData="searchData"
                :total="total"
                @selection-change="selection_change"
                @handle-size-change="handle_size_change"
                @handle-current-change="handle_current_change"
                @view="view"
                @specify-buyer="specify_buyer"
                @journal="journal"
                @apply-for-refund="apply_for_refund"></table-module>
        <!--查看框-->
        <view-dialog
                v-model="viewDialogShow"
                :mission-details-list="missionDetailsList"></view-dialog>
        <!--指定买家，负责人框-->
        <distribution-dialog
                v-model="distributionDialogShow"
                :is-buyer="isBuyer"
                :list-options="listOptions"
                @confirm="confirm"></distribution-dialog>
        <!--操作日志-->
        <log-table v-model="logDialog" :cur-id="curId"></log-table>
        <!--返款申请单-->
        <apply-for-refund-dialog v-model="refundDialog" :refund-data="refundData" @update="update"></apply-for-refund-dialog>
    </page>
</template>

<style lang="stylus" scoped>

</style>

<script>
    import {api_get_click_farm_mission,
        api_get_channel,
        api_get_mission_details,
        api_get_mission_type,
        api_get_mission_status,
        api_get_buyer_list,
        api_get_principal_list,
        api_post_buyers,
        api_post_allocation,
        api_post_buyers_automation,
        api_get_refund_task} from '../../../api/click-farm-mission';
    export default {
        page: {
            devinfo: {
                frontEnd: '钱宇琨',
                backEnd: '李佰敏',
                createdTime: '2018-08-16',
                updateTime: '2018-11-13'
            }
        },
        data() {
          return {
              total: 1,
              searchData: {
                  status:0, //状态
                  refund_status: '',//返款状态
                  snType:'sku',//类型
                  snText:'',//类型对应值
                  channel:'',//平台ID
                  account_id:'',//账号ID
                  seller_id:'',//销售员ID
                  functionary_id: '',//负责人ID
                  date_type: 1,//时间类型
                  date_start:'',//开始时间
                  date_end:'',//结束时间
                  number: '',//申请编号
                  type: '',//刷单类型ID,
                  page: 1,
                  pageSize: 50,
                  site: ''
              },
              refund_status: '',//返款状态
              type: '',//刷单类型
              clears: {
                  status:0, //状态
                  snType:'sku',//类型
                  snText:'',//类型对应值
                  channel:'',//平台ID
                  account_id:'',//账号ID
                  seller_id:'',//销售员ID
                  functionary_id: '',//负责人ID
                  date_type: 1,//时间类型
                  date_start:'',//开始时间
                  date_end:'',//结束时间
                  number: '',//申请编号
                  page: 1,
                  pageSize: 50,
                  site: ''
              },
              statusButtonList: [],//----状态按钮集合
              refundStatusButtons: [//返款状态按钮组
                  {label: '全部', value: ''},
                  {label: '未申请', value: -1},
                  {label: '未返款', value: 0},
                  {label: '已返款', value: 1},
                  {label: '返款异常', value: 2},
                  {label: '取消返款', value: 3}
              ],
              typeButtonList: [],//----刷单类型按钮集合
              channelList:[],//----平台列表
              tableData: [],
              multipleSelection: [],//被选中列表
              loading: false,
              firstLoading: true,//是否第一次加载
              viewDialogShow: false,//查看框
              missionDetailsList: {},//任务详情
              distributionDialogShow: false,//分配框,
              listOptions:[],//弹框内数据源列表
              isBuyer: true,
              currentData: {},
              logDialog: false,
              curId: '',
              refundDialog: false,
              refundData: {//返款申请单数据

              }
          }
        },
        refresh(){
            this.init();
            this.get_channel();
            // this.get_type();
            this.get_status()
        },
        created() {
            this.init();
            this.get_channel();
            this.get_type();
            this.get_status()
        },
        methods: {
            init(){
                this.loading = true;
                let params = clone(this.searchData);
                if(!!this.searchData.date_start){
                    let s = new Date(this.searchData.date_start);
                    params.date_start = datef('YYYY-MM-dd',s.getTime()/1000);
                }
                if(!!this.searchData.date_end){
                    let e = new Date(this.searchData.date_end);
                    params.date_end = datef('YYYY-MM-dd',e.getTime()/1000);
                }
                params.refund_status = this.refund_status;
                if(params.refund_status === '') delete params.refund_status;
                params.type = this.type;
                params.snText = params.snText.trim();
                params.number = params.number.trim();
                this.$http(api_get_click_farm_mission,params).then(res => {
                    this.tableData = res.data;
                    this.total = res.count;
                    this.loading = false;
                    this.firstLoading = false;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message})
                })
            },
            handle_size_change(val){//------------------切换条数
                this.searchData.pageSize = val;
                this.init();
            },
            handle_current_change(val){//---------------切换页数
                this.searchData.page = val;
                this.init();
            },
            change_status(index,val) {//-----状态改变
                if(val === 'refund'){
                    this.searchData.refund_status = this.refundStatusButtons[index].value;
                    this.refund_status = this.refundStatusButtons[index].value
                }else{
                    this.searchData.status = this.statusButtonList[index].value;
                }
                this.init()
            },
            change_type(index) {//-----类型改变
                this.searchData.type = this.typeButtonList[index].value;
                this.type = this.typeButtonList[index].value;
                this.init();
                this.get_status()
            },
            search() {
                this.init();
                this.get_status()
            },
            selection_change(val) {
                this.multipleSelection = val
            },
            manual_distribute(){//指定负责人按钮
                if(this.multipleSelection.find(row => row.status!==1) !== undefined){
                    this.$message({type:'warning',message:"只能选择状态为待分配负责人的数据"})
                }else{
                    this.distributionDialogShow = true;
                    this.isBuyer = false;
                    this.$http(api_get_principal_list,{}).then(res => {
                        this.listOptions = res.map(row => {
                            return {
                                label: row.realname,
                                value: row.id
                            }
                        });
                    })
                }
            },
            auto_distribute(){//自动分配
                this.$confirm('将对所有“待分配买家信息”的刷单任务进行自动分配买家，确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_post_buyers_automation).then(res => {
                        this.$message({type: 'success',message: res.message})
                    });
                }).catch(() => {
                    this.distributionDialogShow = false
                });
            },
            confirm(val){//---------确定按钮
                if(this.isBuyer){//确定指定买家
                    let params = {
                        ids: this.currentData.id,
                        task_id: val
                    };
                    this.$http(api_post_buyers,params).then(res => {
                        if(res.code){
                            this.$message({type: 'success',message: res.message})
                            this.distributionDialogShow = false
                        }else{
                            this.$message({type: 'error',message: res.message});
                        }
                        this.init();
                        this.get_status()
                    })
                }else{//确定指定负责人
                    let ids = this.multipleSelection.map(row => row.id);
                    let params = {
                        ids:ids,
                        functionary_id: val
                    };
                    this.$http(api_post_allocation,params).then(res => {
                        if(res.code){
                            this.$message({type: 'success',message: res.message});
                            this.distributionDialogShow = false
                        }else{
                            this.$message({type: 'error',message: res.message});
                        }
                        this.init();
                        this.get_status()
                    }).catch(err => {
                        this.$message({type: 'error',message: err.message})
                    })
                }
            },
            specify_buyer(row){//指定买家按钮
                this.distributionDialogShow = true;
                this.isBuyer = true;
                this.currentData = row;
                let params = {
                    id: row.id
                };
                this.$http(api_get_buyer_list,params).then(res=>{
                    this.listOptions = res.map(val => {
                        return {
                            label: val.realname,
                            value: val.id
                        }
                    })
                })
            },
            view(row){//-----查看
                this.viewDialogShow = true;
                this.$http(api_get_mission_details,row.id).then(res=>{
                    res.task_time = res.task_time === 0||res.task_time === ''?'--':fdatetime(res.task_time*1000);
                    res.order_time = res.order_time === 0||res.order_time === ''?'--':fdatetime(res.order_time*1000);
                    res.msg_time = res.msg_time === 0||res.msg_time === ''?'--':fdatetime(res.msg_time*1000);
                    res.msg_true_time = res.msg_true_time === 0||res.msg_true_time === ''?'--':fdatetime(res.msg_true_time*1000);
                    this.missionDetailsList = res;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message})
                })
            },
            journal(row){//日志
                this.logDialog = true;
                this.curId = row.id
            },
            apply_for_refund(row){//返款申请
                this.$http(api_get_refund_task, {mission_id:row.id}).then(res => {
                    this.refundData = res;
                    this.refundDialog = true;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            update(){
                this.init()
            },

            // ----------------------------------接口数据
            get_channel(){//获取渠道平台
                this.$http(api_get_channel,{}).then(res=>{
                    this.channelList = [{label:"全部",value:''},...res];
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_status(){//获取任务列表状态
                let params = clone(this.searchData);
                if(!!this.searchData.date_start){
                    let s = new Date(this.searchData.date_start);
                    params.date_start = datef('YYYY-MM-dd',s.getTime()/1000);
                }
                if(!!this.searchData.date_end){
                    let e = new Date(this.searchData.date_end);
                    params.date_end = datef('YYYY-MM-dd',e.getTime()/1000);
                }
                this.$http(api_get_mission_status,params).then(res=>{
                    this.statusButtonList = res.map(row => {
                       return {
                           label: row.txt,
                           value: row.val,
                           count: row.total
                       }
                    })
                })
            },
            get_type(){//获取刷单类型
                this.$http(api_get_mission_type,{}).then(res=>{
                    let type = res.map(row => {
                       return {
                           label: row.typeName,
                           value: row.type
                       }
                    });
                    this.typeButtonList = [{label:'全部',value:''},...type]
                })
            }
        },
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
            viewDialog:require('./view-dialog.vue').default,
            distributionDialog:require('./distribution-dialog.vue').default,
            logTable:require('./log-table.vue').default,
            applyForRefundDialog:require('./apply-for-refund-dialog.vue').default
        },
    }
</script>