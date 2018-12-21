<template>
    <div>
        <el-row class="mb-xs mt-xs">
            <el-button  v-for="(item,i) in  btns"
                        :key="item.label" type="primary"
                        :disabled="i===2?false:!selects.length"
                        @click="btn_click(item)"
                        :class="item.class">{{item.label}}</el-button>
        </el-row>
    <el-table
            :data="tableData"
            v-resize="{height:41}"
            border
            style="width: 100%"
            v-loading="loading"
            highlight-current-row
            element-loading-text="玩命加载中..."
            @sort-change="sort_click"
            @selection-change="handleSelectionChange">
        <el-table-column
                type="selection"
                width="55">
        </el-table-column>
        <el-table-column
                prop="account_name"
                show-overflow-tooltip
                label="wish账号">
        </el-table-column>
        <el-table-column
                prop="code"
                label="账号简称">
        </el-table-column>
        <el-table-column
                label="仿品率(目标≤0.5%)">
            <template slot-scope="scope">
                <div :class="{'red':+scope.row.imitation_rate>+scope.row.goal.imitation_rate}">{{scope.row.imitation_rate}}{{unit.imitation_rate}}</div>
            </template>
        </el-table-column>
        <el-table-column
                label="有效跟踪率(目标≥95%)">
            <template slot-scope="scope">
                <div :class="{'red':+scope.row.tracking_rate<+scope.row.goal.tracking_rate}">{{scope.row.tracking_rate}}{{unit.tracking_rate}}</div>
            </template>
        </el-table-column>
        <el-table-column
                label="延长发货率(目标≤10%)">
            <template slot-scope="scope">
                <div :class="{'red':+scope.row.delay_shipment_rate>+scope.row.goal.delay_shipment_rate}">{{scope.row.delay_shipment_rate}}{{unit.delay_shipment_rate}}</div>
            </template>
        </el-table-column>

        <el-table-column
                label="30天平均评分(目标≥4)">
            <template slot-scope="scope">
                <div :class="{'red':+scope.row.thirty_score<+scope.row.goal.thirty_score}">{{scope.row.thirty_score}}{{unit.thirty_score}}</div>
            </template>
        </el-table-column>
        <el-table-column
                label="60~90天内的退款率(目标≤10)">
            <template slot-scope="scope">
                <div :class="{'red':+scope.row.refund_rate>+scope.row.goal.refund_rate}">{{scope.row.refund_rate}}{{unit.refund_rate}}</div>
            </template>
        </el-table-column>
        <el-table-column
                label="在途金额">
            <template slot-scope="scope">
                <div :class="{'red':+scope.row.onway_amount>+scope.row.goal.onway_amount}">{{scope.row.onway_amount}}{{unit.onway_amount}}</div>
            </template>
        </el-table-column>
        <el-table-column
                label="待确认配送的金额">
            <template slot-scope="scope">
                <div :class="{'red':+scope.row.unconfirm_amount>+scope.row.goal.unconfirm_amount}">{{scope.row.unconfirm_amount}}{{unit.unconfirm_amount}}</div>
            </template>
        </el-table-column>
        <el-table-column
                label="抓取状态">
            <template slot-scope="scope">
                <div >{{scope.row.repitle_status?'抓取完成':'抓取中'}}</div>
            </template>
        </el-table-column>
        <el-table-column
                prop="update_time"
                show-overflow-tooltip
                sortable="custom"
                label="抓取时间">
            <template slot-scope="scope">
                <span>{{ scope.row.update_time*1000 | fdatetime }}</span>
            </template>
        </el-table-column>
        <el-table-column
                label="登录验证状态">
            <template slot-scope="scope">
                <div :class="{'red':scope.row.health_status!==1}">{{scope.row.health_status|healthFilter}}</div>
            </template>
        </el-table-column>
        <el-table-column
                width="280"
                label="操作">
            <template slot-scope="scope">
              <div>
                  <span  v-for="(item,index) in  rowAction">
                     <span class="inline  operate" @click="table_action(scope.row,item)"> {{item.label}}</span>
                      <span v-if="index!==rowAction.length-1">&nbsp;|&nbsp;</span>
                  </span>
              </div>
            </template>
        </el-table-column>
    </el-table>
        <batch-setting v-model="batchDialog" :title="batchTitle" :editData="editData"  :unit="unit" @update="update"></batch-setting>
        <history v-model="historyDialog" :title="historyTitle" :history="historys" :unit="unit"></history>
        <payment v-model="payDialog" :title="payTitle" :payments="payments" ></payment>
    </div>
</template>
<style lang="stylus" scoped>

</style>
<script>
import {api_wish_repitle ,url_wish_repitle,api_wish_history,url_wish_history,url_wish_pay,
    api_wish_pay,api_wish_edit,url_wish_edit,api_wish_export,url_wish_export,url_wish_setting_all,url_wish_setting_single} from "@/api/monitor-wish"
import {downloadFile} from '@/lib/http';
    export default {
        permission:{
            url_wish_repitle,url_wish_history,url_wish_pay,url_wish_edit,url_wish_export,url_wish_setting_all,url_wish_setting_single
        },
        data() {
            return {
                batchDialog:false,
                batchTitle:"",
                historyDialog:false,
                historyTitle:'',
                payDialog:false,
                payTitle:'',
                btnList:[
                    {label:"设置监控值",api:url_wish_setting_all,disabled:false,action:function () {
                        this. editData={
                            imitation_rate:0,
                            tracking_rate:0,
                            delay_shipment_rate:0,
                            thirty_score:0,
                            refund_rate:0,
                            onway_amount:0,
                            unconfirm_amount:0,
                            wish_account_ids:this.selects.map(row=>row.wish_account_id).join(','),
                            isBatch:true,
                            isEdit:true
                        }
                        this.batchDialog=true;
                        this.batchTitle='批量修改监控值'
                        },class:'ml-md'},

                    {label:"立即抓取",api:url_wish_repitle,disabled:false,action:function () {
                                 this.$http(api_wish_repitle,{wish_account_ids:this.selects.map(row=>row.wish_account_id).join(',')}).then(res=>{
                                        this.$message({type:"success",message:res.message||res});
                                        }).catch(code => {
                                            this.$message({type:"error",message:code.message||code})
                                         });

                        },class:'ml-sm'},
                    {label:"导出",api:url_wish_export,disabled:false,action:function () {
                            let data=window.clone(this.searchData);
                            this.$http(api_wish_export,data).then(res=>{
                                let url = config.apiHost+'downloadFile/downExportFile';
                                let params = {
                                    file_code:res.file_code,
                                };
                                downloadFile({
                                    url:url,
                                    get:params,
                                    fileName:res.file_name,
                                    suffix:'.csv',
                                });
                            }).catch(code => {
                                this.$message({type:"error",message:code.message||code})
                            });

                        },class:'ml-sm'},
                ],
                actions:[
                    {label:"查看",api:url_wish_edit,action:function (row,item) {
                                 this.$http(api_wish_edit,row.wish_account_id).then(res=>{
                                     Object.assign(this.editData,res,{isBatch:false, isEdit:false});
                                     this.editData.wish_account_ids&&(delete this.editData.wish_account_ids)
                                     this.batchDialog=true;
                                     this.batchTitle=`查看账号：${row.account_name}的监控`
                                        }).catch(code => {
                                            this.$message({type:"error",message:code.message||code})
                                         });
                        }},
                    {label:"编辑",api:url_wish_edit,action:function (row,item) {
                            this.$http(api_wish_edit,row.wish_account_id).then(res=>{
                                Object.assign(this.editData,res,{isBatch:false, isEdit:true});
                                this.editData.wish_account_ids&&(delete this.editData.wish_account_ids)
                                this.batchDialog=true;
                                this.batchTitle=`编辑账号：${row.account_name}的监控`
                            }).catch(code => {
                                this.$message({type:"error",message:code.message||code})
                            });
                        }},
                    {label:"付款记录",api:url_wish_pay,action:function (row,item) {
                            this.$http(api_wish_pay,row.wish_account_id).then(res=>{
                                this.payments=res.data;
                                this.payDialog=true;
                                this.payTitle=`账号：${row.account_name}的付款记录`
                            }).catch(code => {
                                this.$message({type:"error",message:code.message||code})
                            });
                        }},
                    {label:"历史数据",api:url_wish_history,action:function (row,item) {
                            this.$http(api_wish_history,row.wish_account_id).then(res=>{
                                        this.historys=res.data;
                                    this.  historyDialog=true;
                                    this.historyTitle=`账号：${row.account_name}的历史数据`
                            }).catch(code => {
                                this.$message({type:"error",message:code.message||code})
                            });
                        }},

                ],
                selects: [],
                editData:{
                    imitation_rate:0,
                    tracking_rate:0,
                    delay_shipment_rate:0,
                    thirty_score:0,
                    refund_rate:0,
                    onway_amount:0,
                    unconfirm_amount:0,
                    wish_account_ids:'',
                    wish_account_id:'',
                    isBatch:true,
                    isEdit:true
                },
                historys:[],
                payments:[]
            }
        },
        computed: {
            btns(){
              return  this.btnList.filter(row=>{
                    return this.$hasPermission(row.api)
                })
            },
            rowAction(){
                 return   this.actions.filter(row=>{
                    return this.$hasPermission(row.api)
                })
            }
        },
        filters: {
            healthFilter(val){
                switch (val){
                    case  0:
                        return '账号资料不完整';
                        break;
                    case 1:
                        return '有效';
                        break;
                    case 2:
                        return '无效';
                        break;
                    case 3:
                        return '连接不上服务器';
                        break;
                }

            }
        },
        mounted() {
        },
        methods: {
            handleSelectionChange(val) {
                this.selects = val;
            },
            btn_click(item){
                item.action.call(this,item)
            },
            table_action(row,item){
                item.action.call(this,row,item)
            },
            update(data){
                if(data.hasOwnProperty('wish_account_ids')){
                    data.wish_account_ids.split(',').forEach(row=>{
                        if(!!row){
                            let find=this.tableData.find(item=>item.wish_account_id===Number(row));
                            find&&this.merge(find.goal,data)
                        }
                    })
                }else {
                    let find=this.tableData.find(item=>item.wish_account_id===Number(data.wish_account_id))
                    find&&this.merge(find.goal,data)
                }
            },
            merge(data,param){
                for(let i in param){
                    param[i]&&(data[i]=param[i])
                }

            },
            sort_click(val) {
                this.$emit("sort-click", val);
            },
        },
        watch: {
        },
        props: {
            tableData:{
                type:Array,
            },
            unit:{
                type:Object,
            },
            loading:{
                type:Boolean,
            },
            searchData:{
                type:Object,
            }
        },
        components: {
            batchSetting:require('./batch-setting').default,
            history:require('./history').default,
            payment:require('./payment').default,
        }
    }
</script>
