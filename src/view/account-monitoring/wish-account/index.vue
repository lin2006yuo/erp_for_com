<template>
    <page class="p-wish-account">
        <search-card @search="init" :params="searchData" :clears="clears">
            <label class="inline">账号简称：</label>
            <el-select v-sf.account_id class="inline width-lg" v-model="searchData.account_id" filterable clearable>
                <el-option v-for="item in channelList" :key="item.id" :value="item.id" :label="item.code"></el-option>
            </el-select>
            <label class="ml-sm">抓取授权：</label>
            <el-select v-sf.auth class="inline width-xs" v-model="searchData.auth">
                <el-option v-for="item in isAccredit" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
            <label class="ml-sm inline">抓取时间：</label>
            <el-date-picker class="inline date" type="datetime" v-model="start_time" placeholder="开始时间"></el-date-picker>
            <span class="inline">--</span>
            <el-date-picker class="inline date" type="datetime" v-model="end_time" placeholder="结束时间"></el-date-picker>
        </search-card>
        <div class="mt-sm">
            <permission tag="ElButton" :route="apis.url_wish_shop_auth" type="primary" size="mini" @click="add_account">
                添加
            </permission>
            <permission tag="ElButton" :route="apis.url_wish_shop_monitor" type="primary" size="mini" @click="monitoring_set">
                批量设置键控值
            </permission>
            <el-button type="primary" size="mini" disabled>导出</el-button>
            <el-table class="mt-sm scroll-bar" border v-resize="{height:65}"
                      v-loading="loading" element-loading-text="拼命加载中"
                      :data="tableList" :row-class-name="table_row_class_name">
                <el-table-column
                    width="150px"
                    show-overflow-tooltip
                    label="Wish账号">
                    <template slot-scope="scope">
                        <span>{{scope.row.username}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    width="80px"
                    show-overflow-tooltip
                    label="账号简称">
                    <template slot-scope="scope">
                        <span>{{!!scope.row.account?scope.row.account.code:""}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    label="仿品率（目标≤0.50%）">
                    <template slot-scope="scope">
            <span :style="isRed(scope.row.monitor.counterfeit_rate_aim,scope.row.counterfeit_rate)">
              {{!!scope.row.counterfeit_rate?(scope.row.counterfeit_rate*100).toFixed(2)+'%':''}}
            </span>
                    </template>
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    label="有效跟踪率（目标≥95%）">
                    <template slot-scope="scope">
            <span :style="isRed(scope.row.valid_tracking_rate,scope.row.monitor.valid_tracking_rate_aim)">
              {{!!scope.row.valid_tracking_rate?(scope.row.valid_tracking_rate*100).toFixed(2)+'%':''}}
            </span>
                    </template>
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    label="延迟发货率（目标≤10.00%）">
                    <template slot-scope="scope">
            <span :style="isRed(scope.row.monitor.late_confirmed_fulfillment_rate_aim,scope.row.late_confirmed_fulfillment_rate)">
              {{!!scope.row.late_confirmed_fulfillment_rate?(scope.row.late_confirmed_fulfillment_rate*100).toFixed(2)+'%':''}}
            </span>
                    </template>
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    label="30天平均评分（目标≥4.00）">
                    <template slot-scope="scope">
            <span :style="isRed(scope.row.average_rating,scope.row.monitor.average_rating_aim)">
              {{scope.row.average_rating}}
            </span>
                    </template>
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    label="63-93天内退款率（目标≤10.00%）">
                    <template slot-scope="scope">
            <span :style="isRed(scope.row.monitor.refund_rate_aim,scope.row.refund_rate)">
              {{!!scope.row.refund_rate?(scope.row.refund_rate*100).toFixed(2)+'%':''}}
            </span>
                    </template>
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    label="在途金额">
                    <template slot-scope="scope">
            <span
                :style="isRed(scope.row.valid_money,scope.row.monitor.valid_money_aim)">
              {{scope.row.valid_money}}
            </span>
                    </template>
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    label="待确认配送金额">
                    <template slot-scope="scope">
            <span :style="isRed(scope.row.unvalid_money,scope.row.monitor.unvalid_money_aim)">
              {{scope.row.unvalid_money}}
            </span>
                    </template>
                </el-table-column>
                <el-table-column
                    inline-template
                    show-overflow-tooltip
                    label="抓取时间">
                    <span>{{row | times}}</span>
                </el-table-column>
                <el-table-column
                    label="操作" width="160">
                    <template slot-scope="scope">
                        <permission tag="ElButton" :route="apis.url_wish_shop_monitor" size="mini" type="text"
                                    @click="monitoring_look(scope.row)">查看
                        </permission>
                        <permission tag="ElButton" :route="apis.url_wish_shop_auth" size="mini" type="text"
                                    @click="account_accredit(scope.row)"
                                    :disabled="scope.row.auth==='已授权'">
                            {{scope.row.auth}}
                        </permission>
                        <permission tag="ElButton"
                                    :route="apis.url_wish_history_health_data"
                                    size="mini" type="text"
                                    @click="history_data(scope.row)">历史数据
                        </permission>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--增加和编辑-->
        <account-add-edit v-model="addVisible"
                          :status="accountStatus"
                          :channel-list="channelList"
                          :monitoring-data="monitoringData">
        </account-add-edit>
        <monitoring-set v-model="setVisible"
                        :status="monitoringStatus"
                        :account-id="accountId" :rowData="rowData"
                        @updata-suc="init">
        </monitoring-set>
        <history-data v-model="historyVisible"
                      :monitoring-data="monitoringData">
        </history-data>
        <el-pagination
            class="page-fixed"
            @size-change="handle_size_change"
            @current-change="handle_current_change"
            :current-page=searchData.page
            :page-sizes="[20, 50,100, 200, 500]"
            :page-size=searchData.pageSize
            :total=total
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
    </page>
</template>

<style lang="stylus">
    .p-wish-account {
        .el-table .positive-row {
            background: rgba(250,172,171,0.5);
        }
        thead {
            tr {
                th {
                    padding: 0;
                }
            }
        }
    }
</style>
<script>
    import {
        api_wish_health, api_get_monitor_data,
        url_wish_shop_auth,
        url_wish_shop_monitor,
        url_wish_history_health_data
    } from "../../../api/account-monitoring"
    import {api_wish_channel} from "../../../api/kandeng"
    export default{
        permission: {
            url_wish_shop_auth,
            url_wish_shop_monitor,
            url_wish_history_health_data
        },
        page: {},
        refresh(){
            this.clear_search();
        },
        data(){
            return {
                searchData: {
                    page: 1,
                    pageSize: 50,
                    account_id: '',
                    auth: '',
                    start_time: '',
                    end_time: ''
                },
                clears:{
                    page: 1,
                    pageSize: 50,
                    account_id: '',
                    auth: '',
                    start_time: '',
                    end_time: ''
                },
                start_time: '',
                end_time: '',
                tableList: [], //table表格数据
                channelList: [],//wish账号简称列表
                loading: false,
                addVisible: false,
                setVisible: false,
                historyVisible: false,
                total: -1,
                accountStatus: 0,//1添加，2编辑
                monitoringStatus: 0,//1设置，2查看
                monitoringData: {},
                rowData:{},
                accountId: 0,
                accreditStatus: '',
                below: 0,
                isAccredit: [
                    {label: "全部", value: ''},
                    {label: "已授权", value: '1'},
                    {label: "未授权", value: '0'}
                ]
            }
        },
        created(){

        },
        filters: {
            times(val){
                return datef("YYYY-MM-dd HH:mm:ss", val.create_time);
            }
        },
        mounted(){
            this.init();
            this.get_wish_channel();
        },
        methods: {
            init(){
                this.below = -1;
                this.loading = true;
                this.tableList = [];
                if (!!this.start_time) {
                    this.searchData.start_time = datef("YYYY-MM-dd HH:mm:ss", this.start_time / 1000);
                } else {
                    this.searchData.start_time = "";
                }
                if (!!this.end_time) {
                    this.searchData.end_time = datef("YYYY-MM-dd HH:mm:ss", this.end_time / 1000);
                } else {
                    this.searchData.end_time = "";
                }
                this.$http(api_wish_health, this.searchData).then(res => {
                    let arr = [];
                    res.data.forEach(row => {
                        if (
                            row.counterfeit_rate > row.monitor.counterfeit_rate_aim
                            || row.valid_tracking_rate < row.monitor.valid_tracking_rate_aim
                            || row.late_confirmed_fulfillment_rate > row.monitor.late_confirmed_fulfillment_rate_aim
                            || row.average_rating < row.monitor.average_rating_aim
                            || row.refund_rate > row.monitor.refund_rate_aim
                            || row.valid_money < row.monitor.valid_money_aim
                            || row.unvalid_money_aim < row.monitor.unvalid_money_aim
                        ) {
                            arr.unshift(row);
                            ++this.below;
                        } else {
                            arr.push(row);
                        }
                    });
                    this.tableList = arr;
                    this.total = res.count;
                    this.loading = false;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                });
            },
            get_wish_channel(){
                this.$http(api_wish_channel).then(res => {
                    this.channelList = res.data;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                })
            },
            add_account(){
                this.accountStatus = 1;
                this.addVisible = true;
            },
            account_accredit(row){
                this.accountStatus = 2;
                this.monitoringData = row;
                this.addVisible = true;
            },
            monitoring_set(){
                this.monitoringStatus = 1;
                this.setVisible = true;
            },
            monitoring_look(row){
                this.monitoringStatus = 2;
                this.accountId = row.account_id;
                this.rowData = row;
                this.setVisible = true;
            },
            history_data(row){
                this.monitoringData = row;
                this.historyVisible = true;
            },
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init()
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
            clear_search(){
                this.searchData = {
                    page: 1,
                    pageSize: 50,
                    auth: '',
                    account_id: '',
                    start_time: '',
                    end_time: ''
                };
                this.start_time = '';
                this.end_time = '';
                this.init();
            },
            table_row_class_name(row, index){
                for (let i = 0; i <= this.below; i++) {
                    if (index === i) {
                        return 'positive-row'
                    }
                }
            },
            isRed(a, b){
                if (parseFloat(a) - parseFloat(b) < 0) {
                    return {
                        color:'#FF3300',
                        fontWeight:'bold'
                    }
                } else {
                    return  {
                        color:"#1f2d3d",
                        fontWeight:'none'
                    }
                }
            }
        },
        computed: {},
        watch: {},
        props: {},
        components: {
            accountAddEdit: require('./account-add-edit.vue').default,
            monitoringSet: require('./monitoring-set.vue').default,
            historyData: require('./history-data.vue').default,
            searchCard:require('../../../components/search-card.vue').default,
        }
    }
</script>

