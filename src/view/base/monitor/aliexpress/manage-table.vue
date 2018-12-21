<template>
    <div>
        <el-button type="primary" size="mini" @click="exports"
                   :disabled="multipleSelection.length===0"
                   class="mt-xs mb-xs ml-sm">设置批量监控值
        </el-button>
        <el-button type="primary" size="mini" @click="repitle"
                   :disabled="multipleSelection.length===0"
                   class="mt-xs mb-xs ml-sm">立即抓取
        </el-button>
        <el-button type="primary" size="mini" @click="exportsDoc"
                   class="mt-xs mb-xs ml-sm">导出
        </el-button>
        <el-table
                :data="tableData"
                ref="multipleTable"
                v-resize="{height:41}"
                border
                style="width: 100%"
                highlight-current-row
                @sort-change="sort_click"
                @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="40">
            </el-table-column>
            <el-table-column
                    prop="code"
                    width="80"
                    label="账号简称">
            </el-table-column>
            <el-table-column
                    width="90"
                    label="今日服务分(满分100)">
                <template slot-scope="scope">
                    <span :class="{'red':Number(scope.row.today_score)<Number(scope.row.goal.today_score)}">{{scope.row.today_score}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    width="85"
                    label="成交不卖率">
                <template slot-scope="scope">
                    <span :class="{'red':Number(scope.row.back_transaction_rate)<Number(scope.row.goal.back_transaction_rate)}">{{scope.row.back_transaction_rate}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    width="90"
                    label="未收到货物纠纷提起率">
                <template slot-scope="scope">
                    <span :class="{'red':Number(scope.row.not_cargo_dispute_rate)<Number(scope.row.goal.not_cargo_dispute_rate)}">{{scope.row.not_cargo_dispute_rate}}</span>
                </template>
            </el-table-column>

            <el-table-column
                    width="90"
                    label="货不对版纠纷提起率">
                <template slot-scope="scope">
                    <span :class="{'red':Number(scope.row.error_cargo_dispute_rate)<Number(scope.row.goal.error_cargo_dispute_rate)}">{{scope.row.error_cargo_dispute_rate}}</span>
                </template>
            </el-table-column>

            <el-table-column
                    width="90"
                    label="DSR商品描述">
                <template slot-scope="scope">
                    <span :class="{'red':Number(scope.row.dsr_description)<Number(scope.row.goal.dsr_description)}">{{scope.row.dsr_description}}</span>
                </template>
            </el-table-column>

            <el-table-column
                    width="90"
                    label="DSR卖家服务">
                <template slot-scope="scope">
                    <span :class="{'red':Number(scope.row.dsr_service)<Number(scope.row.goal.dsr_service)}">{{scope.row.dsr_service}}</span>
                </template>
            </el-table-column>

            <el-table-column
                    width="85"
                    label="DSR物流">
                <template slot-scope="scope">
                    <span :class="{'red':Number(scope.row.dsr_shipping)<Number(scope.row.goal.dsr_shipping)}">{{scope.row.dsr_shipping}}</span>
                </template>
            </el-table-column>

            <el-table-column
                    width="90"
                    label="48小时发货率">
                <template slot-scope="scope">
                    <span :class="{'red':Number(scope.row.forty_eight_deliver)<Number(scope.row.goal.forty_eight_deliver)}">{{scope.row.forty_eight_deliver}}</span>
                </template>
            </el-table-column>

            <el-table-column
                    width="90"
                    label="商品信息质量违规">
                <template slot-scope="scope">
                    <span :class="{'red':Number(scope.row.outlaw_quality)<Number(scope.row.goal.outlaw_quality)}">{{scope.row.outlaw_quality}}</span>
                </template>
            </el-table-column>

            <el-table-column
                    width="90"
                    label="知识产权禁限售违规">
                <template slot-scope="scope">
                    <span :class="{'red':Number(scope.row.outlaw_property)<Number(scope.row.goal.outlaw_property)}">{{scope.row.outlaw_property}}</span>
                </template>
            </el-table-column>

            <el-table-column
                    width="90"
                    label="交易违规及其他">
                <template slot-scope="scope">
                    <span :class="{'red':Number(scope.row.outlaw_trancation)<Number(scope.row.goal.outlaw_trancation)}">{{scope.row.outlaw_trancation}}</span>
                </template>
            </el-table-column>

            <el-table-column
                    width="90"
                    label="知识产权严重违规">
                <template slot-scope="scope">
                    <span :class="{'red':Number(scope.row.severity_outlaw_property)<Number(scope.row.goal.severity_outlaw_property)}">{{scope.row.severity_outlaw_property}}</span>
                </template>
            </el-table-column>

            <el-table-column
                    prop="update_time"
                    width="135"
                    sortable="custom"
                    label="抓取时间">
            </el-table-column>

            <el-table-column
                    width="100"
                    label="登陆验证状态">
                <template slot-scope="scope"><span :class="{'red':scope.row.health_status!==1}">{{scope.row.health_status|healthFilter}}</span></template>
            </el-table-column>

            <el-table-column
                    prop="name"
                    label="操作">
                <template slot-scope="scope">
                    <div class="mt-xs mb-xs">
                        <el-button type="primary" size="mini" @click="examine(scope.row)">查看</el-button>
                        <el-button type="primary" size="mini" @click="moneyHistory(scope.row)">资金记录</el-button>
                        <el-button type="primary" size="mini" @click="dataHistory(scope.row)">历史数据</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <examine-dialog v-model="showExamine" :currentData="currentData" :account_id="account_id"></examine-dialog>
        <capital-history v-model="showHistory" :account_id="account_id"></capital-history>
        <history-data v-model="showHistoryData" :historyData="historyData"></history-data>
        <set-batch-monitoring v-model="showSetBatch" :SelectionData="multipleSelection"></set-batch-monitoring>
    </div>
</template>
<style lang="stylus">
    .el-table .info-row {
        background: #c9e5f5;
    }

    .el-table .positive-row {
        background: #e2f0e4;
    }
    .highlight{
        color:red;
    }
</style>
<script>
    import  {api_aliexpress_account_health_export,api_aliexpress_account_health_history,api_aliexpress_account_health_repitle,api_aliexpress_account_health_payment} from '@/api/monitor-manage'
    import {downloadFile} from '@/lib/http';
    export default {
        data() {
            return {
                multipleSelection: [],
                showExamine:false,
                showHistory:false,
                showHistoryData:false,
                showSetBatch:false,
                isDisabled:false,
                showExport:false,
                currentData:{},
                historyData:{},
                account_id:'',
            }
        },
        computed: {},
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
            //颜色高亮
            tableRowClassName(row,index){
                if(index === 0){
                    return 'info-row';
                }
            },
            toggleSelection(rows) {
                // if (rows) {
                //     rows.forEach(row => {
                //         this.$refs.multipleTable.toggleRowSelection(row);
                //     });
                // } else {
                //     this.$refs.multipleTable.clearSelection();
                // }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //批量修改dialog
            exports(){
                this.showSetBatch = true;
            },
            //手动抓取
            repitle(){
                let account_ids = this.multipleSelection.map(row=>row.account_id);
                this.$http(api_aliexpress_account_health_repitle,{account_ids:account_ids}).then(res=>{
                    this.$message({type: "success", message: res.message});
                }).catch(err=>{
                    this.$message({type: "success", message: err.message});
                })
            },
            //导出
            exportsDoc(){
                let data = window.clone(this.search_data);
                this.$http(api_aliexpress_account_health_export,data).then(res=>{
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
            },
            //查看
            examine(row){
                this.currentData = row;
                this.account_id = row.account_id;
                this.showExamine = true;
            },
            //资金记录
            moneyHistory(row){
                this.account_id = row.account_id;
                this.showHistory = true;
            },
            //历史数据
            dataHistory(row){
                this.$http(api_aliexpress_account_health_history,row.account_id).then(res=>{
                    this.historyData = res;
                    this.showHistoryData=true
                });
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
            search_data:{
                type:Object
            }
        },
        components: {
            examineDialog:require('./examine-dialog.vue').default,
            capitalHistory:require('./capital-history.vue').default,
            historyData:require('./history-data.vue').default,
            setBatchMonitoring:require('./set-batch-monitoring.vue').default,
        }
    }
</script>
