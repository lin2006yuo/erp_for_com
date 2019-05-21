<template>
    <page class="p-index">
        <el-row>
            <search :searchData="searchData" @search="search" :buttons="buttons" @clear="clear" ref="search"></search>
        </el-row>
        <el-row class="mt-sm" v-if="false">
            <permission class="ml-sm inline"
                        tag="ElButton"
                        type="primary"
                        size="mini"
                        :route="apis.url_post_aliexpress_order_undetermined"
                        @click="undetermined">待定
            </permission>
            <permission class="ml-sm inline"
                        tag="ElButton"
                        type="primary"
                        size="mini"
                        :route="apis.url_post_aliexpress_order_undetermined"
                        @click="export_order">导出
            </permission>
            <permission class="ml-sm inline"
                        tag="ElButton"
                        type="primary"
                        size="mini"
                        :route="apis.url_post_aliexpress_order_undetermined"
                        @click="immediate_fetching">立即抓取
            </permission>
        </el-row>
        <el-table
            :data="tableData"
            v-loading="loading"
            element-loading-text="拼命加载中"
            highlight-current-row
            v-resize={height:41}
            class="scroll-bar mt-sm"
            style="width: 100%"
            @sort-change="sort_change"
            @selection-change="selectionChange">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                type="selection"
                width="30">
            </el-table-column>
            <el-table-column label="ID" width="130px" inline-template>
                    <ui-tip :content="row.issue_id" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column
                label="订单号"
                width="240px"
                inline-template
            >
                <permission tag="span" type="text" :route="apis.url_get_ali_issue_id" class="operate" @click="look(row,'look_order')"
                            :title="row.sys_order_number === '' ? '没有订单号，无法查看' : row.sys_order_number" :disabled="row.sys_order_number === ''">
                    {{row.sys_order_number?row.sys_order_number:'--'}}
                </permission>
            </el-table-column>
            <el-table-column width="140px" label="买家ID" inline-template>
                    <ui-tip :content="row.buyer_login_id" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="金额总计" width="120px" inline-template>
                    <ui-tip :content="row.pay_amount" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="原因" inline-template>
                <div>
                    <div>
                        <ui-tip :content="row.reason_cn" :width="98"></ui-tip>
                    </div>
                    <div>
                        <ui-tip :content="row.reason_en" :width="98"></ui-tip>
                    </div>
                </div>
            </el-table-column>
            <el-table-column
                width="90px"
                inline-template
                label="发起时间">
                <times :time="row.issue_create_time"></times>
            </el-table-column>
            <el-table-column
                inline-template
                width="90px"
                label="更新时间">
                <times :time="row.issue_modified_time"></times>
            </el-table-column>
            <el-table-column label="纠纷状态" width="80px" inline-template>
                    <ui-tip :content="row.issue_status" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column
                inline-template
                :sortable="true"
                width="140px"
                label="最迟响应剩余时间">
                <div :style="row.expire_time===0?'':`color:red`">{{row.expire_time===0?'已响应':row.countDownTime}}</div>
            </el-table-column>
            <el-table-column
                width="100px"
                inline-template
                label="操作">
                <div>
                    <permission tag="ElButton"
                                type="text"
                                :route="apis.url_get_ali_issue_id"
                                class="operate"
                                @click="look(row,'look')">查看</permission>
                    <template v-if="row.issue_status==='processing'">
                        <permission tag="span" :route="apis.url_get_ali_issue_id">|</permission>
                        <permission tag="ElButton"
                                type="text"
                                :route="apis.url_get_ali_issue_id"
                                class="operate"
                                @click="look(row,'edit')">处理</permission>
                    </template>
                </div>
            </el-table-column>
        </el-table>
        <form-mdf
            ref="formmfd"
            :mdfid="mdfid"
            :title="mdfTitle"
            :is-edit-issue="isEditIssue"
            @close-dialog="close_dialog"
            v-model="mdfValue"
            :is-edit="isEdit"
            :is-show="isLook"
            :btn-show="btnShow"
            :dispute-data="dispute_data"
        ></form-mdf>
        <el-pagination
            class="page-fixed"
            @size-change="size_change"
            @current-change="current_change"
            :current-page="searchData.page"
            :page-sizes="[20, 50, 100,200,500]"
            :page-size="searchData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {
        api_get_list,api_ali_issue_get_label,
        api_get_ali_issue_id,
        url_post_aliexpress_order_undetermined,
        url_get_ali_issue_id
    } from "../../../../api/dispute"
    export default {
        permission: {
            url_get_ali_issue_id,
            url_post_aliexpress_order_undetermined
        },
        page: {},
        refresh() {
            this.init();
        },
        data() {
            return {
                loading: false,
                buttons: [],
                searchData: {
                    label_id: 1,
                    buyer_login_id: '',
                    page: 1,
                    pageSize: 50,
                    order_no: "",//Fashion Dress-91407482383178
                    account_id: "",
                    process_start_time:'',
                    process_end_time:'',
                    sort_type:''
                },
                orders: false,
                isLook: false,
                form: {
                    order_id: 0,
                    biz_type: "",
                    buyer_login_id: "",
                    receipt_address: [],
                    pay_amount: [],
                    payment_type: "",
                    gmt_pay_time: 0,
                    orderProductList: [{
                        send_goods_time: "",
                    }],
                    content: []
                },
                tableData: [],
                total: 0,
                mdfid: 0,
                mdfTitle:'',
                mdfValue: false,
                isEdit: {edit: false},
                btnShow: false,
                firstTime:true,
                selectsList:[],
                dispute_data:{},
                list: {
                    page: 1,
                    pageSize: 50,
                    dispute_type: 'CANCEL',
                    status: '',
                    account_id: '',
                    search_key: 'request_id',
                    search_val: '',
                    date_b: '',
                    date_e: ''
                },
                isEditIssue:false,
                intervalTime:null,
            }
        },
        mounted() {
            this.get_buttons();
            this.init();
            this.countDownInterval();
        },
        methods: {
            sort_change(col){
                switch (col.column.label){
                    case "最迟响应剩余时间":
                        this.searchData.sort_type = col.order ==="ascending"?'asc':'desc';
                        this.init();
                        break;
                }
            },
            close_dialog(row){
                console.log(row,'close_dialog-row');
            },
            search(){
                this.get_buttons();
                this.init();
            },
            selectionChange(selects){
                this.selectsList = selects
            },
            get_buttons(){
                let data = this.init_params();
                data.label_id = 1;
                this.$http(api_ali_issue_get_label,data).then(res=>{
                    if(this.buttons.length===0){
                        this.buttons = res;
                    }else{
                        this.buttons.forEach(button=>{
                            let find = res.find(row=>{
                                return button.value===row.value
                            });
                            if(find){
                                button.count = find.count;
                            }
                        });
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            init_params(){
                let data = window.clone(this.searchData);
                data.buyer_login_id&&(data.buyer_login_id = data.buyer_login_id.trim());
                data.order_no&&(data.order_no = data.order_no.trim());
                if (!!data.process_start_time) {
                    data.process_start_time = datef('YYYY-MM-dd', data.process_start_time/1000);
                } else {
                    data.process_start_time = ''
                }
                if (!!data.process_end_time) {
                    data.process_end_time = datef('YYYY-MM-dd', data.process_end_time/1000);
                } else {
                    data.process_end_time = ''
                }
                return data
            },
            init() {
                this.loading = true;
                this.$http(api_get_list, this.init_params()).then(res => {
                    this.firstTime = false;
                    this.tableData = res.data;
                    this.setCountDownTime();
                    this.total = res.count;
                    this.loading = false;
                }).catch(code => {
                    console.log(code)
                })
            },
            size_change(val) {
                this.searchData.pageSize = val;
                this.init();
                this.get_buttons();
            },
            current_change(val) {
                this.searchData.page = val;
                this.init();
                this.get_buttons();
            },
            open_order(row) {
                this.look(row);
            },
            look(row,type) {
                this.mdfid = row.sys_order_id;
                this.isLook = type !== 'look_order';
                this.dispute_data = {};
                this.$http(api_get_ali_issue_id, row.id).then(res => {
                    this.dispute_data = res;
                    this.dispute_data.order_id = row.order_id;
                    this.$refs.formmfd.require_server(this.mdfid);
                    this.mdfValue = true;
                    this.isEditIssue = type==='edit';
                    this.mdfTitle = type===`look_order`?`查看订单号：${row.sys_order_number} 信息`:`${type==='edit'?'处理':'查看'}订单号：${row.sys_order_number} 纠纷信息`;
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                });
            },
            renewal(row){
                this.$confirm('此操作将更新该条数据, 确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params ={
                        dispute_type:this.list.dispute_type
                    };
                    return this.$http(api_dispute_update,row.id,params).then(res=>{
                        this.$message({
                            message: res.message||res,
                            type: 'success'
                        });
                        this.init();
                        return Promise.resolve();
                    }).catch(code=>{this.$message({message:code.message||code,type:'error'})});

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消操作'
                    });
                });
            },
            clear() {
                this.searchData = {
                    page: 1,
                    pageSize: 50,
                    order_no: "",
                    account_id: "",
                };
                this.init();
                this.get_buttons();
            },
            countDownInterval(){
                this.intervalTime = setInterval(()=>{
                        this.setCountDownTime();
                },1000);
            },
            setCountDownTime(){
                if(this.tableData.length>0){
                    let nowTime = new Date().getTime();
                    this.tableData.forEach(row=>{
                        if(row.expire_time!==0){
                            let time = row.expire_time*1000;
                            if(time-nowTime>0) {
                                let sec = time - nowTime;
                                sec = Math.max(sec, 0);
                                let d = parseInt(sec / 1000 / 60 / 60 / 24, 10);
                                let h = parseInt(sec / 1000 / 60 / 60 % 24, 10);
                                let m = parseInt(sec / 1000 / 60 % 60, 10);
                                let s = parseInt(sec / 1000 % 60, 10);
                                `${m}`.length===1&&(m='0'+m);
                                `${s}`.length===1&&(s='0'+s);
                                this.$set(row,'countDownTime',`${d}天${h}时${m}分${s}秒`);
                            }else{
                                this.$set(row,'countDownTime',`已超时`);
                            }
                        }
                    })
                }
            },
            undetermined() {
                console.log(123);
            },
            export_order(){
                console.log('export');
            },
            immediate_fetching(){
                console.log('立即抓取')
            },
        },
        computed:{
            emptyText(){
                return this.firstTime?'等待请求中...':'暂无数据'
            }
        },
        destroyed(){
            clearInterval(this.intervalTime);
        },
        components: {
            search: require("./search.vue").default,
            orderForm: require("./order-form.vue").default,
            formMdf: require("./form-mdf").default,
            uiTip: require("../../../../components/ui-tip.vue").default
        }
    }
</script>
