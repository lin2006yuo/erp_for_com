<template>
    <page class="amazon-p-index-inbox">
        <search ref="search"
                class="mb-sm"
                :searchData="searchData"
                :mark-list="markList"
                :account-list="accountList"
                @reflash="reflash"
                @clear="clear"></search>
        <el-row :gutter="8">
            <el-col :span="10">
                <el-card>
                    <div class="sort">
                        <span>排序方式: </span>
                        <span @click="first_time">{{isFirst ? '最早时间' : '最晚时间 '}}
                        <i :class="[isFirst?'el-icon-caret-bottom':'el-icon-caret-top']"></i></span>
                        <span @click="unfolded=false">全部收起</span>
                        <span @click="unfolded=true">全部展开</span>
                    </div>
                    <div v-loading="loading" element-loading-text="玩命加载中...">
                        <div class="collapse" v-if="list.length===0" style="text-align: center;line-height:50px">暂无数据
                        </div>
                        <div class="collapse" v-if="list.length>0">
                            <ui-collapse v-for="(item,item_i) in list"
                                         :key="`${item.group_id}${item_i}`"
                                         :show="unfolded"
                                         @head="get_all_detail(item,'click')"
                                         :class="`${ item.isCheck?'active':''} amazon-msg-list`">
                            <span slot="title" style="line-height:26px;  cursor: pointer;">
                                <el-row class="inline">
                                    <div class="inline">{{item.address}}</div>
                                    <div class="inline">({{item.unread_qty}}/{{item.sentTotal}})</div>
                                </el-row>
                              <div class="inline fr">
                                      <span>{{item.last_email_time | fmsdatetime}}</span>
                              </div>
                            </span>
                                <div>
                                    <div v-for="(message,m_i) in filterMessages(item)"
                                         v-if="m_i!==item.emails.length"
                                         :key="`${message.sender}${m_i}`"
                                         :class="`${(message.box_id===1||/@marketplace.amazon/.test(message.sender))&&message.is_read===0?'bold-font':''} mb-xs`" style="cursor: pointer;"
                                         @click="look_detail(message,item)">
                                        <el-card :class="{'active-sm':message.isCheck}">
                                            <el-row class="mb-sm">
                                                <i class="el-icon-message" style="color:#F8D892"></i>
                                                <span>{{message.sender}}</span>
                                                <span>{{message.order_no}}</span>
                                                <i :class="['fr','mr-sm']"
                                                   style="font-style:normal">{{message.sync_time | fmsdatetime}}</i>
                                            </el-row>
                                            <div class="flex">
                                                <div class="flex-1">
                                                    <div style="padding-left:25px">买家ID：{{message.buyer_id}}</div>
                                                    <div style="padding-left:25px">标题：{{message.subject}}</div>
                                                </div>
                                                <div>
                                                    <img :src="get_src(message)"
                                                         height="60px" width="60px"
                                                         style="border:1px solid #ccc;border-radius: 2px">
                                                </div>
                                            </div>
                                            <div v-if="/@marketplace.amazon/.test(message.sender)&&message.is_replied !== 1" style="text-align: center;color:red">
                                                倒计时间：{{item.last_email_time|filterLastTime}}
                                            </div>
                                        </el-card>
                                    </div>
                                </div>
                                <div class="load-more">
                                    <permission tag="span" v-if="has_more(item)" @click="show_more(item)"
                                                :route="apis.url_amazon_old_email">点击展开更多邮件
                                    </permission>
                                </div>
                            </ui-collapse>
                        </div>
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

                <form-mdf
                    ref="formmfd"
                    :mdfid="mdfid"
                    v-model="orderVisable"
                    :is-edit="{edit:false}"
                    :title="mdfTitle"
                    :btn-show="false"
                ></form-mdf>
                <div class="history">
                    <div style="line-height: 26px;">历史订单及当前交易(绿色三角标志)</div>
                    <el-table
                        :data="tableData"
                        v-resize="{height:20}"
                        style="width: 100%;;overflow-x: hidden;">
                        <el-table-column
                            label="订单号"
                            inline-template show-overflow-tooltip
                        >
                            <div>
                                <i style="color:green" v-if="!!row.trade" class="el-icon-caret-right"></i>
                                <span @click="lookOver(row)" class="operate">{{row.order_number}}</span>
                            </div>

                        </el-table-column>
                        <el-table-column
                            prop="country_code"
                            label="国家"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="pay_fee"
                            label="金额">
                        </el-table-column>
                        <el-table-column
                            prop="status"
                            label="状态">
                        </el-table-column>
                        <el-table-column
                            prop="evaluation"
                            label="评价">
                        </el-table-column>
                        <el-table-column
                            prop="dispute"
                            label="纠纷">
                        </el-table-column>
                        <el-table-column
                            prop="return_goods"
                            label="退货">
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
            <el-col :span="14">
                <el-card class="rightCard ebay-right-card">
                    <div  v-loading="loadAllDetail" element-loading-text="玩命加载中...">
                        <el-card v-if="!isAll" style="height:97%; overflow-y: hidden">
                            <div v-if="detail.id" style="height: 100%;display: flex;flex-direction: column">
                                <div style=" background:rgba(173,227,255,.5);padding: 5px;border-radius: 5px"
                                     class="mb-xs">
                                    <div style="min-height: 30px">
                                            <span class="fr">
                                                 <permission :value="detail.flag_id" placeholder="请选择"
                                                             @input="(val)=>{change_mark(detail,val)}" tag="ElSelect"
                                                             :route="apis.url_amazon_change_mark">
                                                        <el-option
                                                            v-for="(item ,i_i) in marks"
                                                            :key="`${item.value}${i_i}`"
                                                            :label="item.label"
                                                            :value="item.value">
                                                    </el-option>
                                                 </permission>
                                                <div class="fr bold-font"> {{detail.sync_time | fmsdatetime}}</div>
                                            </span>
                                        <span class="buyer" v-if="/@marketplace.amazon/.test(detail.sender)">买</span>
                                        <span class="seller" v-else-if="/@marketplace.amazon/.test(detail.receiver)">卖</span>
                                        <span v-else><img src="../../../../assets/ymx.png"></span>
                                        <template v-if="detail.buyer_id">
                                            <span class="bold-font" style="word-break: break-all;">{{detail.buyer_id}}</span><br>
                                        </template>
                                        <span class="bold-font" style="word-break: break-word;">{{detail.subject}}</span>
                                    </div>
                                    <div>
                                        <span class="bold-font" style="color:#3300FF">{{detail.sender}}→:{{detail.receiver}}</span>
                                    </div>
                                </div>
                                <div class="max-heigh_single">
                                    <iframe style="width:100%;height:100%;" scrolling="yes" :srcdoc="detail.body"
                                            ref="singleFrame" v-if="detail.box_id === 1"></iframe>
                                    <div v-html="detail.body" v-else></div>
                                </div>
                            </div>
                            <span v-else>暂无数据</span>
                        </el-card>
                        <div v-else style="height:99%;overflow-y:hidden">
                            <div style="height:90%;overflow-y:scroll;border:1px solid #D3DCE6;border-radius:5px;">
                                <el-card v-for="(de,de_i) in details" :key="`${de.buyer_id}${de_i}`" class="mb-xs">
                                    <div style=" background:rgba(173,227,255,.5);padding: 5px;border-radius: 5px"
                                         class="mb-xs">
                                        <div style="min-height: 30px">
                                            <span class="fr">
                                                 <permission :value="de.flag_id" placeholder="请选择"
                                                             @input="(val)=>{change_mark(de,val)}" tag="ElSelect"
                                                             :route="apis.url_amazon_change_mark">
                                                        <el-option
                                                            v-for="(item ,i_i) in marks"
                                                            :key="`${item.value}${i_i}`"
                                                            :label="item.label"
                                                            :value="item.value">
                                                    </el-option>
                                                 </permission>
                                                <div class="fr bold-font"> {{de.sync_time | fmsdatetime}}</div>
                                            </span>
                                            <span class="buyer" v-if="/@marketplace.amazon/.test(de.sender)">买</span>
                                            <span class="seller" v-else-if="/@marketplace.amazon/.test(de.receiver)">卖</span>
                                            <span v-else><img src="../../../../assets/ymx.png"></span>
                                            <template v-if="de.buyer_id">
                                                <span class="bold-font" style="word-break: break-all;">{{de.buyer_id}}</span><br>
                                            </template>
                                            <span class="bold-font" style="word-break: break-word;">{{de.subject}}</span>
                                        </div>
                                        <div>
                                            <span class="bold-font" style="color:#3300FF">{{de.sender}}→:{{de.receiver}}</span>
                                        </div>
                                    </div>
                                    <div class="max-heigh">
                                        <iframe style="width:100%;height: 370px;overflow-x: hidden" scrolling="yes"
                                                :srcdoc="de.body" ref="mulFrame" v-if="de.box_id === 1"></iframe>
                                        <div v-html="de.body" v-else></div>
                                    </div>
                                </el-card>
                            </div>
                            <div class="mt-xs" style="height:30px;">
                                <el-pagination
                                    class='fr'
                                    @size-change="detailSizeChange"
                                    @current-change="detailCurrentChange"
                                    :current-page="dePage"
                                    :page-sizes="pageSizes"
                                    :page-size="dePageSize"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="addresser.sentTotal||0">
                                </el-pagination>
                            </div>
                        </div>
                    </div>
                </el-card>
                <el-card class="mt-lg" v-resize="{height:20}">
                    <div>
                        <span style="font-weight:600">常用回复模板</span>
                        <el-row>
                            <span class="operate ml-xs" @click="some_click(item)"
                                  v-for="(item,item_i) in  someTemp" :key="`${item.template_name}${item_i}`">{{item.template_name}}</span>

                            <el-select v-model="more" placeholder="请选择" class="inline ml-xs" @input="change_temp">
                                <el-option
                                    :key="`${item.template_id}${index}`"
                                    v-for="(item,index) in options"
                                    :label="item.template_name"
                                    :value="item.template_id">
                                </el-option>
                            </el-select>
                            <label>模板编号：</label>
                            <input v-model="number" class="inline el-input__inner" style="width:200px;"
                                   @keyup.enter="temp_no">
                        </el-row>
                    </div>
                    <el-row class=" mt-sm mb-sm">
                        <div class="operate" style="display:inline-block">
                            <image-upload :thumbnail-mode="true" :multiple="false"
                                          :image="{width:'100px',height:'100px'}" ref="images"
                                          :init="inits"></image-upload>
                        </div>
                        <div class="fr " style="margin-top: -5px" v-if="!isAll">
                            <permission tag="ElButton" :route="apis.url_amazon_change_mark" size="mini" @click="ignore"
                                        type="primary" class="inline">不需要回复
                            </permission>
                            <permission tag="ElButton" :route="apis.url_amazon_reply" size="mini" @click='replay'
                                        type="primary" class="inline">回复
                            </permission>
                        </div>
                    </el-row>
                    <div>
                        <el-input
                            type="textarea"
                            :rows="7"
                            placeholder="请输入内容"
                            v-model="textarea">
                        </el-input>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </page>
</template>
<style lang="stylus">
    .buyer {
        display: inline-block;
        background: #FF0000;
        color: #FFFFEF;
        line-height: 20px;
        font-weight: 600;
        font-size: 1.25rem;
        padding: 2px 5px;
        border-radius: 4px;
    }
    .seller {
        display: inline-block;
        background: #FFCC06;
        color: #1F77A2;
        line-height: 20px;
        font-weight: 600;
        font-size: 1.25rem;
        padding: 2px 5px;
        border-radius: 4px;
    }

    .amazon-p-index-inbox {
        .amazon-msg-list {
            & div, span {
                font-size 1.3rem !important;
            }
        }
        .red {
            color: red;
        }
        .sort {
            display: flex;
            background-color: #E3ECF7;
            span {
                flex: 1;
                text-align: center;
                border: 1px solid #E5E9F2;
                line-height: 26px;
                cursor: pointer;
                &:hover {
                    color: white;
                    background: #587DCB;
                }
            }
        }
        .collapse {
            height: 448px;
            overflow-x: hidden;
            overflow-y: auto;
            .head {
                &:hover {
                    background: #d0e5cb;
                }
            }
            .load-more {
                line-height: 26px;
                text-align: center;
                span {
                    &:hover {
                        color: red;
                        cursor: pointer;
                    }
                }
            }
            .active {
                .head {
                    border-radius: 4px;
                    border: 1px solid #5E93FF !important;
                    box-shadow: 0 0 7px #5E93FF;
                    /*background: rgba(173,227,255,.5);*/
                    &:hover {
                        background: #d0e5cb;
                    }
                }
            }
            .active-sm {
                border-radius: 4px;
                border: 1px solid #5E93FF !important;
                box-shadow: 0 0 7px #5E93FF;
                /*background: rgba(173,227,255,.5);*/
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
            height: 485px;
            div,span{
                font-size 1.3rem;
            }
            .max-heigh_single {
                flex: 1;
                width: 100%;
                overflow-y: auto;
                overflow-x: hidden;
            }
            .max-heigh {
                width: 100%;
                overflow-y: auto;
                overflow-x: hidden;
            }
            .el-card__body {
                height: 100%;
                > div {
                    height: 100%;
                }
            }
        }
    }
</style>
<script>
    import search from "./search.vue"
    import uiCollapse from "../../../../components/ui-collapse.vue"
    import {api_all_templates, api_templates_content} from "../../../../api/inbox"
    import {
        api_amazon_old_email,
        api_amazon_list,
        api_amazon_change_mark,
        api_get_table,
        url_amazon_change_mark,
        url_amazon_reply,
        api_amazon_reply,
        url_amazon_old_email,
        api_amazon_read,
        api_get_amazon_message_account
    } from "../../../../api/letter-amazon"

    export default {
        permission: {
            url_amazon_change_mark,
            url_amazon_reply,
            url_amazon_old_email,
        },
        page: {},
        refresh() {
            this.init();
        },
        data() {
            return {
                loadAllDetail:false,
                selectHandles: false,
                mdfTitle: "",
                mdfid: 0,
                unfolded: true,
                isAll: false,
                tableData: [],
                loading: true,
                searchData: {
                    site:'',
                    flag_id: '',
                    pageSize: 50,
                    page: 1,
                    customer_id: '',
                    account_code: '',
                    box_id: '',
                    is_replied: '',
                    is_read: '',
                    time_field: 'sync_time',
                    time_start: '',
                    time_end: '',
                    option_field: "system_order_number",
                    option_value: "",
                    order_status: '',
                },
                total: 0,
                options: [],
                more: "",
                number: "",
                emial: false,
                isFirst: true,
                textarea: "",
                list: [],
                detail: {},
                details: [],
                someTemp: [],
                inits: [],
                orderVisable: false,
                bgHead: false,
                marks: [
                    {label: "无标记", value: 0},
                    {label: "退货申请", value: 1},
                    {label: "尺码大", value: 2},
                    {label: "尺码小", value: 3},
                    {label: "产品质量问题", value: 4},
                ],
                initCount: 0,
                accountList: [],
                dePageSize:20,
                dePage:1,
                pageSizes:[20, 50, 100, 200,500]
            }
        },
        created() {
            this.get_used_template();
            this.get_all_template();
        },
        mounted() {
            if (window.objlength(this.param) !== 0) {
                this.init_();
            } else {
                this.init();
            }
            this.get_account();
        },
        methods: {
            filterMessages(item){
                return item.showAll?item.emails:[item.emails[0]]
            },
            init_() {
                this.change_status();
                this.param.resData.data.forEach(row => {
                    row.page = 1;
                });
                this.list = this.param.resData.data;
                this.list.forEach(row => {
                    this.$set(row,'page',1);
                    this.$set(row,'showAll',row.sentTotal === row.emails.length);
                    this.$set(row,'isCheck',false);
                    this.$set(row,'moreSize',500);
                });
                this.total = this.param.resData.count;
                if (this.list[0]) {
                    this.get_detail(this.list[0].emails[0]);
                }
            },
            get_src(item) {
                if (item.attachments[0]) {
                    return item.attachments[0].path
                } else {
                    return '/static/error-picture-128.png'
                }
            },
            get_account() {
                this.$http(api_get_amazon_message_account).then(res => {
                    if (this.accountList.length === 0) {
                        res.data.shift();
                        this.accountList = res.data.map((row ,index)=> ({
                            label: row.code,
                            value: row.id,
                            count: row.count,
                            showSearch: index<10?true:false,
                            showDialog: true
                        }));
                    } else {
                        this.accountList.forEach(account => {
                            let find = res.data.find(row => row.id === account.value);
                            if (find) {
                                account.count = find.count;
                            }
                        });
                    }
                }).catch(code => {
                    console.log(code);
                });
            },
            has_more(item){
                if(item.sentTotal > item.emails.length){
                    return true
                }else if(!item.showAll){
                    return true
                }
                return false
            },
            show_load(item) {
                return item.sentTotal > item.emails.length
            },
            show_more(item){
                if(item.emails.length>1) {
                    let sizeIndex = this.pageSizes.findIndex(row => row >= item.emails.length);
                    if (sizeIndex !== -1) {
                        if (this.pageSizes[sizeIndex] < 500) {
                            this.dePageSize = this.pageSizes[sizeIndex + 1];
                        } else {
                            this.dePageSize = this.pageSizes[sizeIndex] + 500;
                        }
                    } else {
                        item.moreSize += 500;
                        this.dePageSize = item.moreSize;
                    }
                }else{
                    this.dePageSize = 20;
                }
                this.load_more(item,'show');
            },
            load_more(item,type) {
                this.loadAllDetail = true;
                if(this.show_load(item)) {
                    this.$http(api_amazon_old_email, item.group_id,{page:this.dePage,pageSize:this.dePageSize}).then(res => {
                        item.page++;
                        item.emails = res.data;
                        this.details = item.emails;
                        if (type === 'show') {
                            item.showAll = true;
                        }
                        this.loadAllDetail = false;
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code})
                    })
                }else{
                    this.details = item.emails;
                    if (type === 'show' && !item.showAll) {
                        item.showAll = true;
                    }
                    this.loadAllDetail = false;
                }
            },
            detailSizeChange(val) {
                this.dePageSize = val;
                this.load_more(this.addresser);
            },
            detailCurrentChange(val) {
                this.dePage = val;
                this.load_more(this.addresser);
            },
            sizeChange(val) {
                this.searchData.pageSize = val;
                this.init()
            },
            currentChange(val) {
                this.searchData.page = val;
                this.init();
            },
            first_time() {
                this.isFirst = !this.isFirst;
                if (this.isFirst) {
                    this.searchData.time_sort = 'ASC'
                } else {
                    this.searchData.time_sort = 'DESC'
                }
                this.init();
            },
            reflash() {
                this.initCount++;
                if (this.initCount > 4) {
                    this.details = [];
                    this.detail = {};
                    this.init();
                }
            },
            change_status() {
                this.selectHandles = true;

            },
            init() {
                let data = window.clone(this.searchData);
                if (this.searchData.time_start) {
                    data.time_start = datef("YYYY-MM-dd", this.searchData.time_start / 1000)
                } else {
                    data.time_start = ""
                }
                if (this.searchData.time_end) {
                    data.time_end = datef("YYYY-MM-dd", this.searchData.time_end / 1000)
                } else {
                    data.time_end = ""
                }
                this.loading = true;
                this.$http(api_amazon_list, data).then(res => {
                    this.change_status();
                    this.list = res.data;
                    this.list.forEach(row => {
                        this.$set(row,'page',1);
                        this.$set(row,'showAll',row.sentTotal === row.emails.length);
                        this.$set(row,'isCheck',false);
                        this.$set(row,'moreSize',500);
                    });
                    this.total = res.count;
                    if (this.list[0]) {
                        this.get_all_detail(this.list[0],'click');
                    }
                    this.loading = false;
                }).catch(code => {
                    this.loading = false;
                    console.log(code, 'code');
                });
            },
            look_detail(item, itemList) {
                this.inits.splice(0, 1);
                this.get_detail(item);
                this.cancel_check(item);
                this.temp_init();
                if (item.is_read === 0&&(item.box_id===1||/@marketplace.amazon/.test(item.sender))) {
                    this.read(item, itemList);
                }
                this.tableData = [];
                if (item.buyer_id) {
                    this.get_table_list(item)
                }
            },
            read(item, itemList) {
                this.$http(api_amazon_read, {id: item.id, is_read: 1}).then(res => {
                    item.is_read = 1;
                    itemList.unread_qty--;
                    this.$message({type: "success", message: res.message || res})
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })

            },
            cancel_check(item) {
                this.list.forEach(row => {
                    this.$set(row, "isCheck",false);
                    row.emails.forEach(x => {
                        this.$set(x, "isCheck",false)
                    })
                });
                item.isCheck = true;
            },
            get_all_detail(item,type) {
                this.inits.splice(0, 1);
                if(type==='click'){
                    this.dePage = 1;
                    this.dePageSize = 20;
                    this.load_more(item,'load');
                    this.cancel_check(item);
                }else{
                    this.detail = item.emails[0];
                    this.cancel_check(this.detail);
                }
                this.isAll = true;
                this.tableData = [];
                this.temp_init();
                setTimeout(() => {
                    let arr = this.$refs.mulFrame||[];
                    arr.forEach(row => {
                        let body = row.contentWindow.document.getElementsByTagName('body')[0];
                        body && this.$set(body.style, 'overflowX', 'hidden');
                        let elem = row.contentWindow.document.getElementsByTagName('a');
                        let elemArr =  Array.prototype.slice.call(elem);
                        elemArr.forEach(row => {
                            row.addEventListener('click', function(ev){
                                ev.preventDefault()//阻止默认事件
                            }, false)
                        });
                    })
                }, 1000)
            },
            get_detail(item) {
                this.isAll = false;
                this.textarea = "";
                this.detail = item;
                item.isCheck = true;
                setTimeout(() => {
                    let body = this.$refs.singleFrame.contentWindow.document.getElementsByTagName('body')[0];
                    let elem = this.$refs.singleFrame.contentWindow.document.getElementsByTagName('a');
                    let elemArr =  Array.prototype.slice.call(elem);
                    if(elemArr.length>0){
                        elemArr.forEach(row => {
                            row.addEventListener('click', function(ev){
                                console.log(row);
                                ev.preventDefault()//阻止默认事件
                            }, false)
                        });
                    }
                    body && this.$set(body.style, 'overflowX', 'hidden')
                }, 100)
            },
            change_mark(item, val) {
                this.$http(api_amazon_change_mark, item.id, {flag_id: val}).then(res => {
                    item.flag_id = val;
                    this.$message({type: "success", message: res.message || res})
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })
            },
            replay() {
                if (objlength(this.detail) <= 0) {
                    this.$message({type: "error", message: '请选择回复的信息'})
                    return
                }
                let data = {
                    content: this.textarea,
                    reply_email_id: this.detail.id,
                };
                if (this.inits.length > 0) {
                    data.file_data = this.inits[0].image;
                    data.file_name = this.inits[0].name;
                }
                this.$http(api_amazon_reply, data).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.textarea = "";
                    this.inits.splice(0, 1);
                    this.get_account();
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                });

            },
            ignore() {
                if (objlength(this.detail) <= 0) {
                    this.$message({type: "error", message: '请选择忽略的信息'})
                    return
                }
                this.$confirm('您将忽略该邮件，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_amazon_change_mark, this.detail.id, {is_replied: 2}).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                        this.get_account();
                    }).catch(code => {
                        this.$message({message: code.message || code, type: 'error'});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消操作'
                    });
                });
            },
            get_table_list(item) {
                this.$http(api_get_table, item.buyer_id).then(res => {
                    this.tableData = res.data;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })
            },
            clear() {
                let data = window.clone(this.searchData);
                this.searchData = {
                    pageSize: 50,
                    page: 1,
                    customer_id: '',
                    account_code: '',
                    box_id: '',
                    is_replied: '',
                    is_read: '',
                    time_field: 'sync_time',
                    time_start: '',
                    time_end: '',
                    option_field: "system_order_number",
                    option_value: "",
                    order_status: '',
                };
                this.details = [];
                this.detail = {};
                this.init();
            },
            get_used_template() {
                let data = {
                    type: 2, page_size: 6, channel_id: 2, template_type: 1
                }
                this.someTemp = [];
                this.$http(api_all_templates, data).then(res => {
                    this.someTemp = res.data
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                })
            },
            some_click(item) {
                if (!this.detail.id) {
                    this.$message({type: "error", message: '请选择回复的信息'})
                    return;
                }
                let data = {
                    template_id: item.template_id,
                    channel_id: 2,
                    search_id: this.detail.id,
                    search_type: 'msg'
                }
                this.$http(api_templates_content, data).then(res => {
                    this.textarea = res.data;
                    this.more = "";
                    this.number = "";
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                })

            },
            get_all_template() {
                let data = {
                    type: 1, channel_id: 2, template_type: 1
                };
                this.options = [];
                this.$http(api_all_templates, data).then(res => {
                    this.options = res.data
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                })

            },
            temp_init() {
                this.number = '';
                this.more = "";
                this.textarea = "";
                this.inits.length > 0 && this.inits.splice(0, 1);
            },
            temp_no() {
                if (!this.detail.id) {
                    this.$message({type: "error", message: '请选择回复的信息'});
                    return;
                }
                let data = {
                    template_no: this.number,
                    channel_id: 2,
                    search_id: this.detail.id,
                    search_type: 'msg'
                }
                this.$http(api_templates_content, data).then(res => {
                    this.textarea = res.data;
                    this.more = "";
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                })
            },
            change_temp() {
                if (!this.detail.id) {
                    this.$message({type: "error", message: '请选择回复的信息'});
                    return;
                }
                let data = {
                    template_id: this.more,
                    channel_id: 2,
                    search_id: this.detail.id,
                    search_type: 'msg'
                };
                this.$http(api_templates_content, data).then(res => {
                    this.textarea = res.data;
                    this.number = "";
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                })
            },
            lookOver(row) {
                this.mdfid = row.id;
                this.$refs.formmfd.require_server(this.mdfid);
                this.mdfTitle = `查看订单号: ${row.order_number} 信息`;
                this.orderVisable = true;
            },
        },
        filters: {
            filterLastTime(val) {
                let now = new Date().getTime();
                let sec = (val + 24 * 60 * 60) * 1000;
                if (sec - now > 0) {
                    sec = (val + 24 * 60 * 60) * 1000 - now;
                    sec = Math.max(sec, 0);
                    let d = parseInt(sec / 1000 / 60 / 60 / 24, 10);
                    let h = parseInt(sec / 1000 / 60 / 60 % 24, 10);
                    let m = parseInt(sec / 1000 / 60 % 60, 10);
                    if (d) {
                        return '';
                    } else if (h) {
                        return `${h}小时`
                    } else {
                        return `${m}分钟`
                    }
                } else {
                    return '已超时'
                }
            }
        },
        computed: {
            markList() {
                return [{label: '全部/All', value: ''}, ...this.marks]
            },
            addresser(){
                return  this.list.find(row=>row.isCheck)||{}
            }
        },
        watch: {
            param(val) {
                this.init_();
            }
        },
        props: {},
        components: {
            search,
            uiCollapse,
            imageUpload: require("../../smt/inbox/image-upload.vue").default,
            formMdf: require("../../../order/local/form-mdf.vue").default
        }
    }
</script>
