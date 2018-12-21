<template>
    <page class="p-smt-estimate-index">
        <search-card :params="form" :clears="clears" @search="search" @enter="search">
            <div>
            <label-buttons label="评价分类：" class="inline" :max="300" :buttons="typeList" :loading="isLoading"
                           @select="select_type" v-sf.status></label-buttons>
            <label-buttons label="回评状态：" class="inline" :max="300" :buttons="buttons" :loading="isLoading"
                           @select="select_status" v-sf.status></label-buttons>
            </div>
            <label>账号简称：</label>
            <el-select class="inline mr-sm s-width-default" v-model="form.account_id" filterable v-sf.account_id>
                <el-option
                    :key="item.value"
                    v-for="item in accountList"
                    :value="item.value"
                    :label="item.label"
                ></el-option>
            </el-select>
            <label class="inline">订单号：</label>
            <el-input class="inline s-width-large" v-model="form.order_no" v-sf.order_no></el-input>
            <label class="inline ml-sm">付款日期：</label>
            <el-date-picker
                    class="inline date mr-sm"
                    type="date"
                    placeholder="开始时间"
                    v-model="form.start_time"
                    :picker-options="pickerStart"
            ></el-date-picker>&nbsp;--&nbsp;<el-date-picker
                class="inline date mr-sm"
                type="date"
                placeholder="结束时间"
                v-model="form.end_time"
                :picker-options="pickerEnd"
        ></el-date-picker>
        </search-card>
        <!--批量回评  按钮 Start-->
        <div class="ml-sm mt-xs " v-if="form.status===0">
            <permission tag="ElButton" :route="apis.url_post_batch" type="primary" size="mini"
                        @click.native="batch_evaluate">批量回评
            </permission>
            <permission tag="ElButton" :route="apis.url_post_batch" type="primary" size="mini"
                        @click.native="evaluate_all">回评所有
            </permission>
        </div>
        <!--批量回评  按钮 End-->
        <!--列表 Start-->
        <el-table
                class="mt-xs scroll-bar"
                v-resize="{height:41}"
                :data="table.data"
                border
                v-loading="isLoading"
                highlight-current-row
                element-loading-text="玩命加载中..."
                @sort-change="sort_change"
                @selection-change="selection_change">
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column label="销售号/买家账号" inline-template>
                <div>
                    <ui-tip :content="`${row.account}/${row.buyer_account}`" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="订单号" inline-template>
                <div>
                    <ui-tip :content="row.order_no" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="付款日期" width="100px" inline-template>
                <times :time="row.pay_time"></times>
            </el-table-column>
            <el-table-column label="我的评价" width="400px" inline-template>
                <div :class="[row.content?'success-p':'default-p','t-left']">
                    <ui-tip :content="com_content(row.content,row.append)" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="金额"
                             width="100px"
                             sortable="custom" inline-template>
                <div>{{row.pay_amount}}</div>
            </el-table-column>
            <el-table-column label="退款" inline-template width="50px">
                <div>{{row.has_refund}}</div>
            </el-table-column>
            <el-table-column label="补发货" inline-template width="70px">
                <div>{{row.has_reissue}}</div>
            </el-table-column>
            <el-table-column label="退货" inline-template width="50px">
                <div>{{row.has_return}}</div>
            </el-table-column>
            <el-table-column
                    label="处理状态"
                    inline-template
            >
                <div :class="row.status===3?'red':''">{{row.status_name}}</div>
            </el-table-column>
            <el-table-column label="留评价时间" width="120px" inline-template>
                <times :time="row.time"></times>
            </el-table-column>
            <el-table-column label="操作" inline-template>
                <div>
                    <permission tag="span" :route="apis.url_post_evaluate" v-if="!row.content || row.status===3"
                                class="operate" @click="answer(row)">回评
                    </permission>
                    <!--<span v-if="row.content&&row.status!==3"  v-permission.pursue="'customerSmtEstimate'"  :class="!row.append?'operate':''" @click="add_answer(row)">追评</span>-->
                    <permission tag="span" class="operate" :route="apis.url_post_content" v-if="row.content&&row.status!==3"
                                @click="add_answer(row)">追评
                    </permission>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="current_change"
                :current-page="table.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="table.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="table.total">
        </el-pagination>
        <!--列表 End-->
        <!--引入回评 start-->
        <evaluate @init_status_btn="init_status_btn" v-model="dialog" :p-form="pForm" @submit-all="submit_all" @submit-post="submit_post"></evaluate>
        <!--引入回评 end-->
    </page>
</template>
<style lang="stylus">
    .success-p {
        padding-left: 20px;
        height: 20px;
        background: url('../../../assets/yet.png') no-repeat;
    }

    .default-p {
        width: 20px;
        height: 20px;
        background: url('../../../assets/wait.png') no-repeat;
    }
</style>
<script>
    import {
        api_get_account,
        api_get_list,
        api_get_statistics,

        url_get_list,
        url_post_batch,
        url_post_evaluate,
        url_post_content,
        api_get_ali_evaluate_statistics_score
    } from '../../../api/smt-estimate';
    import datef from "datef";
    export default {
        permission: {
            url_get_list,
            url_post_batch,
            url_post_evaluate,
            url_post_content
        },
        page: {},
        refresh() {
            this.init();
        },
        data() {
            return {
                dialog: false,
                typeList:[],
                buttons: [],
                sortBtn: [],
                electList: [
                    {label: "订单号", value: "order_no"},
                    {label: "SKU", value: "sku"},
                ],
                accountList: [],
                form: {
                    status: -1,
                    account_id: "",
                    order_no: "",
                    sortStatus: '',
                    start_time:"",
                    end_time:'',
                },
                table: {
                    data: [],
                    total: 0,
                    page: 1,
                    pageSize: 50,
                },
                isLoading: false,
                pForm: {},
                batchId: [],
                isAddTo: false,
                clears:{},
                typeValue:-1,
                statusValue:-1,
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.form.end_time) {
                            return time.getTime() > this.form.end_time;
                        } else {
                            return time.getTime()>Date.now();
                        }
                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.form.start_time) {
                            return time.getTime()<this.form.start_time||time.getTime() > Date.now();
                        } else {
                            return time.getTime()>Date.now();
                        }
                    }
                },
            }
        },
        created() {
            this.get_account();
            this.get_estimate_type();
            this.get_statistics();
            this.clears=clone(this.form)
        },
        filters: {
            filterPrice(val) {
                return val ? parseFloat(val).toFixed(2) : '0.00';
            }
        },
        methods: {
            init_status_btn(){
                this.get_statistics();
                let curBtn = this.buttons;
                let sort = this.sortBtn;
                this.buttons = [];
                this.sortBtn = [];
                this.$nextTick(()=>{
                    this.buttons = curBtn;
                    this.sortBtn = sort;
                });
            },
            com_content(val1, val2) {
                return `${val1}   ${val2}`
            },
            batch_evaluate() {
                if (this.batchId.length <= 0) return this.$message({type: "warning", message: "请选择要批量回评的数据"});
                this.pForm = {
                    title: `给买家批量回评`,
                    orderId: 0,
                    id: this.batchId,
                    isAll: 0,
                    isAddTo: false
                };
                this.dialog = true;
            },
            evaluate_all() {
                this.batchId = [];
                this.table.data.forEach((row) => {
                    this.batchId.push(row.id);
                })
                this.$nextTick(() => {
                    this.pForm = {
                        title: `给买家回评所有`,
                        orderId: 0,
                        id: this.batchId,
                        isAll: 1,
                        isAddTo: false
                    };
                    this.dialog = true;
                })
            },
            search() {
                this.init();
            },
            clear_search() {
                this.form.account_id = "";
                this.form.order_no = "";
                this.init();
            },
            selection_change(val) {
                this.batchId = [];
                val.forEach((row) => {
                    this.batchId.push(row.id);
                })
            },
            size_change(size) {
                this.table.pageSize = size;
                this.init();
            },
            current_change(page) {
                this.table.page = page;
                this.init();
            },
            select_type(val) {
                this.typeValue = this.typeList[val].id;
                this.init();
            },
            select_status(val) {
                this.statusValue = this.buttons[val].id;
                this.init();
            },
            sort_change(row) {
                this.form.sortStatus = row.order==='ascending'?2:1;
                this.init();
            },
            answer(val) {
                this.pForm = {
                    title: `给买家：${val.buyer_account}回评`,
                    orderId: val.order_no,
                    id: val.id,
                    isAll: -1,
                    isAddTo: false
                };
                this.dialog = true;
            },
            add_answer(val) {
                this.pForm = {
                    title: `给买家：${val.buyer_account}追评`,
                    orderId: val.order_no,
                    id: val.id,
                    isAll: -1,
                    isAddTo: true
                };
                this.dialog = true;
            },
            submit() {
                this.get_statistics();
                this.init();
            },
            submit_post(id, content) {
                this.init_status_btn();
                let time = Date.parse(new Date);
                time = time / 1000;
                this.table.data.forEach(res => {
                    if (res.id === id) {
                        res.content = content;
                        res.status_name = `已回评`;
                        res.time = time;
                    }
                })
            },
            submit_all(ids, content) {
                let idData = ids.split(',');
                let time = Date.parse(new Date);
                time = time / 1000;
                idData.forEach(row => {
                    this.table.data.forEach(res => {
                        if (res.id === parseInt(row)) {
                            res.content = content;
                            res.status_name = `回评中`;
                            res.time = time;
                        }
                    });
                });
            },
//            -----------------------------------------------------------------------------   API
            init() {
                this.batchId = [];
                this.form.status = this.statusValue;
                this.isLoading = true;
                let params = {
                    page: this.table.page,
                    pageSize: this.table.pageSize,
                    account_id: this.form.account_id,
                    order_no: this.form.order_no,
                    status: this.form.status,
                    sort: this.form.sortStatus,
                    type_id:this.typeValue
                };
                this.form.start_time&&( params.start_time=datef('YYYY-MM-dd', this.form.start_time));
                this.form.end_time &&( params.end_time =datef('YYYY-MM-dd', this.form.end_time));
                this.$http(api_get_list, params).then(res => {
                    this.table.data = res.data;
                    this.table.total = res.count;
                    this.isLoading = false;
                }).catch(code => {
                    this.isLoading = false;
                    this.$message({type:'error', message: code.message || code});
                })
            },
            get_account() {
                this.$http(api_get_account, {channel_id: 4}).then(res => {
                    this.accountList = [{label:'全部', value:''}, ...res.account];
                }).catch(code => {
                    console.log(code);
                })
            },
            get_statistics() {
                this.$http(api_get_statistics).then(res => {
                    this.buttons = res;
                }).catch(code => {
                    console.log(code);
                })
            },
            get_estimate_type() {
                this.$http(api_get_ali_evaluate_statistics_score).then(res => {
                    this.typeList = res;
                }).catch(code => {
                    console.log(code);
                })
            }
        },
        components: {
            labelButtons: require('../../../components/label-buttons.vue').default,
            times: require('../../../components/times.vue').default,
            evaluate: require('./evaluate.vue').default,
            uiTips: require('../../../components/ui-tip.vue').default,
            uiTip: require('../../../components/ui-tip.vue').default,
            searchCard:require("../../../components/search-card.vue").default
        }
    }
</script>
