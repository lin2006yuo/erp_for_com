<template>
    <page class="p-index">
        <search-list ref="search" :form="list" @refresh="search" @clear="clear"></search-list>
        <div class="mt-xs mb-xs">
            <el-button type="primary" size="mini"
                       class="ml-sm"
                       :disabled="selectList.length===0"
                       @click="batch_update">立即抓取
            </el-button>
        </div>
        <el-table
            class="mt-xs scroll-bar"
            v-resize="{height:41}"
            :data="tableList"
            border
            highlight-current-row
            v-loading="isLoading"
            @sort-change="sort_change"
            @selection-change="handle_selection_change"
            element-loading-text="拼命加载中">
            <el-table-column
                    type="selection"
                    width="50">
            </el-table-column>
            <el-table-column label="dispute_id" inline-template>
                <div>
                    <ui-tip :content="row.dispute_id" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="订单号" inline-template>
                <div>
                    <ui-tip :is-operate="true"
                            :content="row.order_num"
                            :width="98"
                            @cur-click="open_order(row)">
                    </ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="买家" inline-template>
                <div>
                    <ui-tip :content="row.buyer_account" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="卖家账号" inline-template>
                <div>
                    <ui-tip :content="row.seller_account" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="原因" inline-template>
                <div>
                    <ui-tip :content="row.reason" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="发起时间" width="150" sortable="custom" inline-template>
                <div>
                    <ui-tip :content="row.dispute_time" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column inline-template sortable="custom" label="更新时间" width="150">
                <div>
                    <ui-tip :content="row.update_time | secFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="最近更新状况" inline-template>
                <div>
                    <ui-tip :content="row.status" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="状态" inline-template>
                <div>
                    <ui-tip :content="row.state" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column inline-template label="最迟回应时间" width="150">
                <div style="color:red">
                    {{row.response_due}}
                    <!--<times :time="row.response_due"></times>-->
                </div>
            </el-table-column>

            <el-table-column label="操作" inline-template>
                <!--TODO v-if="link_order_id" 是否有订单号 row.order_num === null 不一定没有订单号-->
                <div>
                    <permission tag="ElButton"
                                type="text"
                                :route="apis.url_dispute_look"
                                class="operate"
                                @click="handle(row,true)"
                                v-if="row.state==='CLOSED'">查看
                    </permission>
                    <div v-else>
                        <permission tag="ElButton" type="text" :route="apis.url_dispute_update" class="operate"
                                    @click="renewal(row)" :title="row.order_num === null ? '没有订单号，无法更新' : ''"
                                    :disabled="row.order_num === null">更新
                        </permission>&nbsp;
                        <permission tag="span" :route="apis.url_dispute_look"> | </permission>
                        <permission tag="ElButton" v-if="row.after_sale_id==='0'" type="text" :route="apis.url_dispute_look" class="operate"
                                    @click="handle(row)" :title="row.order_num === null ? '没有订单号，无法更新' : ''"
                                    :disabled="row.order_num === null">处理
                        </permission>
                        <template v-else>
                            <permission tag="ElButton"
                                                     type="text"
                                                     :route="apis.url_dispute_look"
                                                     class="operate"
                                                     @click="handle(row,true)">查看纠纷
                            </permission> |
                            <permission tag="ElButton" type="text" :route="apis.url_look_over" class="operate"
                                        @click="look_after_sale(row)" :title="row.order_num === null ? '没有订单号，无法更新' : ''"
                                        :disabled="row.order_num === null">查看售后
                            </permission>
                        </template>
                    </div>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
            class="page-fixed"
            @size-change="size_change"
            @current-change="current_change"
            :current-page="list.page"
            :page-sizes="[20, 50, 100, 200,500]"
            :page-size="list.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <form-mdf :mdfid="mdfid" ref="formmfd" v-model="orderDialog" @can-close="init"
                  :form="lookData" :dispute-data="dispute_data"
                  :dispute-is-look="disputeIsLook"
                  :title="mdfTitle" :isShow="isLook" :is-edit="isEdit">
        </form-mdf>
        <look-edit
            :ap-status="apStatus"
            :re-status="reStatus"
            :is-handle="isHandle"
            :is-edit="saleEdit"
            :btn-show="btnShow"
            v-model="lookEditDialog"
            :is-dispute="true"
            :form="lookEditForm"
            :title="title">
        </look-edit>
    </page>
</template>
<style lang="stylus">
</style>
<script>
    import {
        api_ebay_dispute,
        api_dispute_typeIds,
        api_dispute_look,
        api_dispute_update,
        api_batch_dispute_update,
        url_dispute_look,
        url_dispute_update
    } from '@/api/dispute'
    import {api_info_ebay, url_info_ebay} from '@/api/ebay-order'
    import {
        api_look_over,
        url_look_over
    } from '@/api/after-sale';
    export default {
        permission: {
            url_dispute_look,
            url_dispute_update,
            url_info_ebay,
            url_look_over
        },
        page: {},
        refresh() {
            this.init();
        },
        data() {
            return {
                orderDialog: false,
                isLook: false,
                mdfid: '',
                mdfTitle: '',
                isLoading: true,
                order_num: '',
                list: {
                    page: 1,
                    pageSize: 50,
                    dispute_type: 'CANCEL',
                    status: '',
                    account_id: '',
                    search_key: 'order_number',
                    search_val: '',
                    date_b: '',
                    date_e: '',
                    sort_type:'',
                    sort_val:''
                },
                selectList: [],
                total: 0,
                tableList: [],
                lookData: {},
                dispute_data: {},
                isEdit: {edit: false},
                saleEdit:false,
                title:'',
                isHandle:false,
                apStatus:0,
                reStatus:0,
                lookEditDialog:false,
                btnShow:false,
                lookEditForm:{},
                disputeIsLook:true,
                initCount:0
            }
        },
        created() {

        },
        mounted() {
            this.init();
        },
        computed: {},
        methods: {
//            list列表
            sort_change(data){
                this.list.sort_val = data.order === 'ascending'?'asc':'desc';
                switch (data.column.label){
                    case '发起时间':
                        this.list.sort_type = 'dispute_time';
                        break;
                    case '更新时间':
                        this.list.sort_type = 'update_time';
                        break;
                }
                this.init();
            },
            init() {
                //日期格式转换
                let data = window.clone(this.list);
                if (this.list.date_b) {
                    let d = new Date(this.list.date_b);
                    data.date_b = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
                } else {
                    data.date_b = ''
                }
                if (this.list.date_e) {
                    let e = new Date(this.list.date_e);
                    data.date_e = e.getFullYear() + '-' + (e.getMonth() + 1) + '-' + e.getDate()
                } else {
                    data.date_e = ''
                }
                this.tableList = [];
                this.isLoading = true;
                this.$http(api_ebay_dispute, data).then(res => {
                    this.tableList = res.data;
                    this.total = res.count;
                    this.isLoading = false;
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'})
                })
            },
            //点击订单号查看
            open_order(row) {
                this.mdfid = row.link_order_id==='0'?'':row.link_order_id;
                this.mdfid==='0'&&(this.$message({type:'info',message:'没有订单号无法获取订单详情！'}));
                this.$refs.formmfd.require_server(this.mdfid);
                this.isLoading = false;
                this.orderDialog = true;//----弹框打开
                this.isLook = false;
            },
//            查看 处理
            handle(row,isLook) {
                this.dispute_data = {};
                this.disputeIsLook = isLook ? true: false;
                this.isLoading = true;
                this.$http(api_dispute_look, row.id, {dispute_type: this.list.dispute_type}).then(res => {
                    this.dispute_data = res;
                    this.dispute_data.dispute_type = this.list.dispute_type;
                    this.dispute_data.markId = row.id;
                    //订单信息
                    this.mdfid = row.link_order_id==='0'?'':row.link_order_id;
                    this.mdfid==='0'&&(this.$message({type:'info',message:'没有订单号无法获取订单详情！'}));
                    this.$refs.formmfd.require_server(this.mdfid);
                    this.isLoading = false;
                    this.orderDialog = true;//----弹框打开
                    this.isLook = true;
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                    this.isLoading = false;
                });
            },
//            更新
            renewal(row) {
                this.$confirm('此操作将更新该条数据, 确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        dispute_type: this.list.dispute_type
                    }
                    return this.$http(api_dispute_update, row.id, params).then(res => {
                        this.$message({
                            message: res.message || res,
                            type: 'success'
                        });
                        this.init();
                        return Promise.resolve();
                    }).catch(code => {
                        this.$message({message: code.message || code, type: 'error'})
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消操作'
                    });
                });
            },
            //批量更新
            batch_update(){
                let data = {
                    dispute_type: '',
                    ids: ''
                };
                data.dispute_type = this.list.dispute_type;
                data.ids = this.selectList.map(row => row.id).join(',');
                this.$http(api_batch_dispute_update,data).then(res => {
                    this.$message({type: 'success', message: res.message});
                    this.init()
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            look_after_sale(row){
                this.saleEdit = false;
                this.title = `查看售后单：${row.order_num} 信息`;
                this.isHandle = false;
                this.apStatus = row.approve_status;
                this.reStatus = row.refund_status;
                this.lookEditDialog = true;
                this.btnShow = false;
                this.get_look_over(row.after_sale_id);
            },
//            获取查看状态下的数据
            get_look_over(val){
                this.lookEditForm = {};
                this.$http(api_look_over, val).then(res => {
                    this.lookEditForm = res;
                }).catch(code => {
                    console.log(code);
                })
            },
            search(){
                this.initCount++;
                if(this.initCount>2){
                    this.init()
                }
            },
//            清空搜索
            clear() {
                this.list.account_id = '';
                this.list.search_key = 'request_id';
                this.list.search_val = '';
                this.list.date_b = '';
                this.list.date_e = '';
                this.init()

            },
            size_change(size) {
                this.list.pageSize = size;
                this.init();

            },
            current_change(page) {
                this.list.page = page;
                this.init();

            },
            handle_selection_change(val){//----多选列表选中按钮变成可点击
                this.selectList = val
            }
        },
        filters: {
            secFilter(val) {
                return datef('YYYY-MM-dd HH:mm:ss', val);
            }
        },
        watch: {},
        props: {},
        components: {
            searchList: require('./search-list.vue').default,
            times: require('../../../../components/times.vue').default,
            formMdf: require('./form-mdf.vue').default,
            orderForm: require('./order-form.vue').default,
            uiTip: require('../../../../components/ui-tip.vue').default,
            lookEdit: require('../../../../view/customer-service/after-sale/look-edit').default,
        }
    }
</script>
