<template>
    <page class="p-index-outbox">
        <search ref="search" :searchData="searchData" @reflash="reflash"></search>
        <el-row :gutter="8" class="mt-sm">
            <el-col :span="10">
                <el-card>
                    <div class="sort">
                        <span>排序方式: </span>
                        <span @click="first_time">{{isFirst?'最早时间':'最晚时间 '}}
                        <i :class="[isFirst?'el-icon-caret-bottom':'el-icon-caret-top']"></i></span>
                        <span v-if="searchData.send_state===2" @click="all_send">全部发送</span>
                    </div>
                    <div v-loading="loading" element-loading-text="玩命加载中...">
                        <div class="collapse" v-if="list.length===0" style="text-align: center;line-height: 40px">暂无数据
                        </div>
                        <ul class="collapse" v-if="list.length">
                            <li v-for="message in list" :key="message.id" class="mb-xs"
                                :class="{active: message.isActive}" style="cursor: pointer;"
                                @click="look_detail(message)">
                                <el-card>
                                    <el-row class="mb-sm">
                                        <i class="el-icon-message" style="color:#F8D892"></i>
                                        <div class="inline">{{message.sender}}</div>
                                        <span>→</span>
                                        <span>{{message.send_to_name}}</span>
                                        <span class="fr ml-sm">{{message.receive_date}}</span>
                                        <span v-if="message.send_status===0" class="fr" style="color:red">发送失败</span>
                                    </el-row>
                                    <div style="padding-left:50px"> {{message.subject}}</div>
                                </el-card>
                            </li>
                        </ul>
                    </div>
                    <div class="mt-xs" style="height:30px;">
                        <el-pagination
                            class='fr'
                            @size-change="sizeChange"
                            @current-change="currentChange"
                            :current-page="searchData.page"
                            :page-sizes="[20, 50, 100, 200,500]"
                            :page-size="searchData.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                        </el-pagination>
                    </div>
                </el-card>
                <div class="history">
                    <form-mdf
                        ref="formmfd"
                        :mdfid="mdfid"
                        v-model="orderVisable"
                        :is-edit="{edit:false}"
                        :title="mdfTitle"
                        :btn-show="false"
                    ></form-mdf>
                    <div class="mt-sm mb-sm">历史订单及当前交易(绿色三角标志)</div>
                    <el-table
                        v-resize="{height:20}"
                        :data="tableData"
                        style="width: 100%">
                        <el-table-column
                            label="订单号"
                            inline-template show-overflow-tooltip>
                            <div>
                                <i style="color:green" v-if="!!row.trade" class="el-icon-caret-right"></i>
                                <span @click="lookOver(row)" class="operate">{{row.order_number}}</span>
                            </div>
                        </el-table-column>
                        <el-table-column
                            prop="country_code"
                            label="国家"
                            show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                            prop="order_amount"
                            label="金额">
                        </el-table-column>
                        <el-table-column
                            prop="status"
                            label="状态">
                        </el-table-column>
                        <el-table-column
                            prop="feedback"
                            label="评价">
                        </el-table-column>
                        <el-table-column
                            prop="dispute"
                            label="纠纷">
                        </el-table-column>
                        <el-table-column
                            prop="refund"
                            label="退货">
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
            <el-col :span="14">
                <el-card class="rightCard" v-if="detail.id" v-resize="{height:20}">
                    <div>
                        <div style=" background:rgba(173,227,255,.5);padding: 5px;border-radius: 5px">
                            <div>{{detail.subject}}</div>
                            <div>
                                <span v-if="detail.sender" style="color:#3300FF">{{detail.sender}}→:{{detail.send_to_name}}</span>
                                <span class="ml-sm" v-if="detail.creator"
                                      style="background-color: #00CC33;color: #fff;padding:1px;">{{detail.creator}}</span>
                                <span class="fr"> {{detail.receive_date}}</span>
                            </div>
                        </div>
                        <div v-if="!!detail.id" style="height:26px">
                            <permission tag="ElButton"
                                        :route="apis.url_message_resend"
                                        v-if="detail.send_status===0"
                                        size="mini" @click="resend" type="primary"
                                        class="fr ml-xs">重新发送
                            </permission>
                            <permission tag="ElButton"
                                        :route="apis.url_ebay_message_deL"
                                        size="mini" @click="del_message"
                                        type="primary" class="fr">删除
                            </permission>
                        </div>
                        <div class="max-heigh">
                            <iframe style="width:100%;" scrolling="yes"
                                    :srcdoc="detail.text" v-resize="{height:30}"></iframe>

                        </div>
                        <div class="inline" v-if="detail.media&&detail.media.length>0" v-for="img in detail.media"
                             :key="img.MediaURL" style="margin-top:5px">
                            <el-popover
                                placement="bottom-start"
                                trigger="hover">
                                <img :src="img.MediaURL" width="300px" height="400px">
                                <span slot="reference">
                                         <img :src="img.MediaURL" width="50px" height="26px"
                                              style="cursor: -webkit-zoom-in;">
                                </span>
                            </el-popover>
                        </div>
                    </div>
                </el-card>
                <el-card v-resize="{height:20}" v-else style="text-align: center;padding-top: 150px;">
                    <span>暂无数据</span>
                </el-card>
            </el-col>
        </el-row>
    </page>
</template>
<style lang="stylus">
    .p-index-outbox {
        .sort {
            display: flex;
            background-color: #E3ECF7;
            span {
                flex: 1;
                text-align: center;
                border: 1px solid #E5E9F2;
                line-height: 26px;
                cursor: pointer;
            }
        }
        .collapse {
            height: 450px;
            overflow-x: hidden;
            overflow-y: auto;
            .mb-xs {
                .el-card {
                    background: none;
                }
                &.active {
                    background: rgba(173, 227, 255, .5);
                }
                &:hover {
                    background: #d0e5cb;
                }
            }
        }
        .history {
            .el-table__body-wrapper {
                min-height: 130px;
            }
        }
        .rightCard {
            .max-heigh {
                width: 100%;
                overflow-y: auto;
                overflow-x: hidden;
            }
        }
    }
</style>
<script>
    import {api_info} from "../../../../api/ebay-order"
    import search from "./search.vue"
    import uiCollapse from "../../../../components/ui-collapse.vue"
    import {
        api_out_list,
        api_ebay_message_detail,
        api_message_table_list,
        api_message_resend,
        api_ebay_message_del,
        api_message_resend_batch
    } from "../../../../api/inbox"
    import {url_message_resend, url_ebay_message_deL, url_message_resend_batch} from "../../../../api/inbox"

    export default {
        permission: {
            url_message_resend,
            url_ebay_message_deL
        },
        page: {},
        refresh() {
            this.init();
        },
        data() {
            return {
                mdfTitle: "",
                mdfid: 0,
                loading: true,
                tableData: [],
                searchData: {
                    pageSize: 50,
                    page: 1,
                    time_sort: 0,
                    type: 2,
                    account_id: "",
                    customer_id: "",
                    search_key: "send_to_name",
                    search_val: "",
                    receive_date_b: (Date.now()-(30*24*60*60*1000)),
                    receive_date_e: Date.now(),
                    send_state: 1,
                },
                total: 0,
                more: "",
                number: "",
                emial: false,
                isFirst: true,
                isOld: true,
                textarea: "",
                list: [],
                detail: {},
                orderVisable: false,
                form: {
                    sku_list: [
                        {item_id: 0, title: "", quantity_purchased: "", transaction_price: ""}
                    ],
                },
            }
        },
        created() {
        },
        mounted() {
        },
        computed: {},
        methods: {
            all_send() {
                let message_id = this.list.map(row => row.id);
                if (message_id.length === 0) {
                    return ''
                }
                return this.$http(api_message_resend_batch, {message_id: message_id}).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })
            },
            sizeChange(val) {
                this.searchData.pageSize = val;
                this.init();
            },
            currentChange(val) {
                this.searchData.page = val;
                this.init();
            },
            first_time() {
                this.isFirst = !this.isFirst
                if (this.isFirst) {
                    this.searchData.time_sort = 1
                } else {
                    this.searchData.time_sort = 0
                }
                this.init();
            },
            old_new() {
                this.isOld = !this.isOld
            },
            init() {
                this.list = [];
                let data = window.clone(this.searchData);
                if (this.searchData.receive_date_b) {
                    data.receive_date_b = datef("YYYY-MM-dd", this.searchData.receive_date_b / 1000)
                } else {
                    data.receive_date_b = ""
                }
                if (this.searchData.receive_date_e) {
                    data.receive_date_e = datef("YYYY-MM-dd", this.searchData.receive_date_e / 1000)
                } else {
                    data.receive_date_e = ""
                }
                this.loading = true;
                this.$http(api_out_list, data).then(res => {
                    this.list = res.data
                    this.total = res.count;
                    this.loading = false;
                    if (this.list[0]) {
                        this.look_detail(this.list[0])
                    } else {
                        this.detail.id = 0
                    }
                })
            },
            reflash() {
                this.init()
            },
            look_detail(message) {
                this.detail = {};
                this.$http(api_ebay_message_detail, message.id).then(res => {
                    this.detail = res;
                }).catch(code => {
                    console.log(code)
                })
                this.tableData = [];
                this.$http(api_message_table_list, {
                    id: message.id,
                    message_id: message.message_id,
                    msg_type: 3
                }).then(res => {
                    this.tableData = res.data;
                }).catch(code => {
                    console.log(code)
                })
                this.list.forEach(row => {
                    this.$delete(row, "isActive")
                })
                this.$set(message, "isActive", true)
            },
            resend() {
                return this.$http(api_message_resend, {
                    id: this.detail.id,
                    message_id: this.detail.message_id
                }).then(res => {
                    this.$message({
                        type: "success",
                        message: '发送成功'
                    });
                    this.detail.send_status = res.status;
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                })
            },
            del_message() {
                this.$confirm(`您将删除该邮件, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.$http(api_ebay_message_del, this.detail.id).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                        this.init();
                        this.detail = {};
                        return Promise.resolve();
                    }).catch(code => {
                        this.$message({message: code.message || code, type: 'error'});
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // clear(){
            //     let data=window.clone(this.searchData)
            //     this.searchData={
            //         pageSize:50,
            //         page:1,
            //         time_sort:0,
            //         type:2,
            //         account_id:"",
            //         customer_id:"",
            //         search_key:"send_to_name",
            //         search_val:"",
            //         receive_date_b:"",
            //         receive_date_e:"",
            //         send_state:1,
            //     };
            //     this.searchData.send_state=data.send_state
            //     this.init();
            // },
            lookOver(row) {
                this.mdfid = row.order_id;
                this.$refs.formmfd.require_server(this.mdfid);
                this.mdfTitle = `查看订单号：${row.order_number} 信息`;
                this.orderVisable = true;
            },

        },
        filters: {},
        watch: {},
        props: {},
        components: {
            search,
            uiCollapse,
            formMdf: require("../../../order/local/form-mdf.vue").default
        }
    }
</script>
