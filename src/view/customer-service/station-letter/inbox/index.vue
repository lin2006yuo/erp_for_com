<template>
    <page class="p-index-inbox">
        <search :searchData="searchData"
                :little-account="littleAccount"
                @reflash="reflash"
                @get-account-all="get_account_all"
                :mark-list="markList"
                @clear="clear" ref="search"
                class="mb-sm"></search>
        <el-row :gutter="8">
            <el-col :span="10">
                <el-card>
                    <div class="sort">
                        <span>排序方式: </span>
                        <span @click="first_time">{{isFirst?'最早时间':'最晚时间 '}}
                        <i :class="[isFirst?'el-icon-caret-bottom':'el-icon-caret-top']"></i></span>
                        <span @click="unfolded=false">全部收起</span>
                        <span @click="unfolded=true">全部展开</span>
                    </div>
                    <div v-loading="loading" class="p-index-inbox-ebay-msg-list" element-loading-text="玩命加载中...">
                        <div class="collapse" v-if="list.length===0" style="text-align: center;line-height: 450px">
                            暂无数据
                        </div>
                        <div class="collapse" v-if="list.length>0">
                            <ui-collapse v-for="(item,item_i) in list"
                                         :key="`${item.id}${item_i}`"
                                         :show="unfolded"
                                         v-if="!item.isHide"
                                         @head="get_all_detail(item)"
                                         :class="{ active:item.isCheck }">
                            <span slot="title" style="line-height:26px;  cursor: pointer;">
                                <el-row class="inline">
                                    <div class="inline">{{item.sender}}</div>
                                    <div class="inline">{{item.item_id}}</div>
                                    <div class="inline">({{item.count_num}})</div>
                                </el-row>
                              <div class="inline fr" @click.stop="level">
                                      <span>{{item.receive_new_date}}</span>
                                     <permission tag="ElSelect"
                                                 :route="apis.url_message_change_level"
                                                 v-model="item.level"
                                                 placeholder="请选择"
                                                 clearable
                                                 @change="change_level(item)"
                                                 class="inline ml-sm" style="width:85px">
                                            <el-option
                                                    :key="`${it.id}${it_i}`"
                                                    v-for="(it,it_i) in flagArr"
                                                    :label="it.name"
                                                    :value="it.id">
                                            </el-option>
                                     </permission>
                              </div>
                            </span>
                                <div>
                                    <div v-for="(message,message_i) in item.message_list"
                                         :key="message_i"
                                         class="mb-xs" style="cursor: pointer;"
                                         @click="look_detail(message,item.message_list)">
                                        <el-card
                                            :class="`${message.isCheck?'active-sm':''} ${message.message_type===1?'buyer-background':''} ${message.status===0?'bold-font':''}`">
                                            <el-row class="mb-sm">
                                                <i class="el-icon-message" style="color:#F8D892"></i>
                                                <div class="inline">
                                                    {{message.title}}
                                                </div>
                                                <i :class="[message.replied===0?'red':'','fr','mr-sm']"
                                                   style="font-style:normal">{{message.send_time|fmsdatetime}}</i>
                                            </el-row>
                                            <el-row class="flex">
                                                <div class="flex-1"
                                                     style="padding-left:50px;"> {{message.text}}
                                                </div>
                                                <a :href="item.item_url" target="_blank">
                                                    <img :src="item.item_img||'/static/error-picture-128.png'"
                                                         height="60px" width="60px"
                                                         style="border:1px solid #ccc;border-radius: 2px">
                                                </a>
                                            </el-row>
                                        </el-card>
                                    </div>
                                    <div class="loadMore">
                                        <span v-if="item.loadMore" class="more" @click="loadMore(item)">点击展开更多邮件</span>
                                    </div>
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
                <div class="history">
                    <div class="mt-sm mb-sm">历史订单及当前交易(绿色三角标志)</div>
                    <el-table
                            :data="tableData"
                            style="width: 100%;;overflow-x: hidden;"
                            v-loading="historyLoading"
                            v-resize="{height:20}">
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
                                label="纠纷" inline-template>
                            <div>
                                <span v-if="!row.dispute.id">{{row.dispute.case_id}}</span>
                                <permission v-else tag="ElButton" type="text" :route="apis.url_message_replay"
                                            class="operate"
                                            @click="handle(row,'dispute')">{{row.dispute.case_id}}
                                </permission>
                            </div>
                        </el-table-column>
                        <el-table-column
                                label="退货" inline-template>
                            <div>
                                <span v-if="!row.request.id">{{row.request.request_id}}</span>
                                <permission v-else tag="ElButton" type="text" :route="apis.url_message_replay"
                                            class="operate"
                                            @click="handle(row,'request')">{{row.request.request_id}}
                                </permission>
                            </div>
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
            <el-col :span="14">
                <el-card class="right-card ebay-right-card">
                    <div style="height:99%;overflow-y:auto">
                        <div v-for="(de,de_i) in details" :key="de.id" v-if="details.length"
                             @click="message_click(de,de_i)">
                            <el-card
                                    :class="['mb-xs',de.message_type===1?'buyer-background':'',de.isCheck?'right-active':'','pointer']">
                                <div style="position: relative; padding: 5px;border-radius: 5px">
                                    <div class="mes-box blue-color mb-mini" v-if="de.remark">
                                        <span class="bold-font" style="vertical-align: top">备注信息：</span>
                                        <ui-tips :content="de.remark" style="vertical-align: bottom;" :width="70"></ui-tips>
                                        <span class="fr">
                                         <span class="bold-font">{{de.remark_time|filterDate}}</span>
                                         <span class="ml-xs">{{de.remark_user}}</span>
                                    </span>
                                        <i class="close-icon" @click="delete_mark(de)"></i>
                                    </div>
                                    <el-row>
                                        <el-col class="bold-font" :span="19">{{de.subject}}</el-col>
                                        <el-col :span="5">
                                            <permission :value="de.flag_id" placeholder="请选择"
                                                        v-if="de.message_type===1"
                                                        @input="(val)=>{change_mark(de,val)}" tag="ElSelect"
                                                        :route="apis.url_put_ebay_emails_id">
                                                <el-option
                                                        v-for="item in marks"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value">
                                                </el-option>
                                            </permission>
                                        </el-col>
                                    </el-row>
                                    <el-row style="min-height: 16px">
                                        <div class="inline">
                                            <span v-if="de.message_type===1" class="buyer">买</span>
                                            <span v-if="de.message_type!==1" class="seller">卖</span>
                                            <span  class="bold-font" style="color:#3300FF;">{{de.sender}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                            <el-button class="inline" size="mini" type="primary" v-if="de.message_type===1" @click="show_mark_input(de)">备注</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
                                            <span class="ml-sm mr-sm" v-if="de.creator"
                                                  style="background-color: #00CC33;color: #fff;padding:1px;">{{de.creator}}</span>
                                            <span v-if="de.message_type===3&&de.send_status===0" style="color:red;">发送失败</span>
                                            <span v-if="de.message_type===3&&de.send_status===2" style="color:#FFCC06;font-weight: bold;">发送中</span>
                                        </div>
                                        <span class="fr bold-font"> {{de.receive_date}}</span>
                                    </el-row>
                                    <!--常用备注   一直存在页面-->
                                    <div v-if="de.showRemark" class="remark-sale-look">
                                        <label class="remark-sale-header">备注信息</label>
                                        <el-form class="remark-sale-body">
                                            <el-form-item>
                                                <el-input type="textarea" v-model="remark" :maxlength="225"
                                                          @keydown.native.enter="update_mark(de)"
                                                          placeholder="请输入备注..."
                                                          :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                                            </el-form-item>
                                        </el-form>
                                        <div class="remark-sale-footer">
                                            <div class="fr">
                                                <button class="small-button submit" type="button" @click="update_mark(de)">提交</button>
                                                <button class="small-button cancel" type="button" @click="cancel_mark(de)">取消</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="max-heigh flex">
                                    <div class="flex-1">
                                        <el-input type="textarea"
                                                  class="custom-textarea"
                                                  :autosize="{minRows: 4, maxRows: 20}"
                                                  :disabled="true"
                                                  v-model="de.text"></el-input>
                                        <!--{{de.text}}-->
                                        <div>
                                            <template v-for="(src,src_i) in de.media">
                                                <el-popover placement="left" trigger="hover">
                                                    <img :src="src.MediaURL" width="200px"
                                                         height="200px">
                                                    <span slot="reference">
                                                        <a :href="src.MediaURL" target="_blank">
                                                         <img :src="src.MediaURL"
                                                              height="60px" width="60px"
                                                              style="border:1px solid #ccc;border-radius: 2px">
                                                            </a>
                                                        </span>
                                                </el-popover>
                                            </template>
                                        </div>
                                    </div>
                                    <el-popover placement="left" trigger="hover">
                                        <img :src="de.item_img||'/static/error-picture-128.png'" width="200px"
                                             height="200px">
                                        <span slot="reference">
                                                    <a :href="de.item_url" target="_blank">
                                                     <img :src="de.item_img||'/static/error-picture-128.png'"
                                                          height="60px" width="60px"
                                                          style="border:1px solid #ccc;border-radius: 2px">
                                                        </a>
                                                    </span>
                                    </el-popover>
                                </div>
                            </el-card>
                        </div>
                        <span v-else>暂无数据</span>
                    </div>
                </el-card>
                <el-card v-loading="replayLoading" class="mt-lg" v-resize="{height:20}">
                    <div>
                        <span style="font-weight:600">常用回复模板</span>
                        <el-row>
                            <span class="operate ml-xs" @click="some_click(item)"
                                  v-for="(item,index) in  someTemp" :key="`${item.template_name}${index}`">{{item.template_name}}</span>
                            <el-select v-model="more" placeholder="请选择" class="inline ml-xs" @input="change_temp">
                                <el-option
                                        :key="item.template_id"
                                        v-for="item in options"
                                        :label="item.template_name"
                                        :value="item.template_id">
                                </el-option>
                            </el-select>
                            <label>模板编号：</label>
                            <input v-model="number" class="inline el-input__inner" style="width:200px;"
                                   @keyup.enter="temp_no">
                        </el-row>
                    </div>
                    <el-row class=" mt-sm mb-xs" style="min-height: 26px">
                        <div class="operate" style="display:inline-block">
                            <image-upload :thumbnail-mode="true" :multiple="false"
                                          :image="{width:'100px',height:'100px'}" ref="images"
                                          :init="inits"></image-upload>
                        </div>
                        <div class="fr " v-if="showBtn">
                            <el-checkbox v-model="to_queue">推送到回信队列</el-checkbox>
                            <el-checkbox v-model="emial">抄送到邮箱</el-checkbox>
                            <permission tag="ElButton" :route="apis.url_message_ignore" size="mini" @click="ignore"
                                        type="primary" class="inline">忽略
                            </permission>
                            <permission tag="ElButton" :route="apis.url_message_replay" size="mini" @click='replay'
                                        type="primary" class="inline">回复
                            </permission>
                        </div>
                    </el-row>
                    <div>
                        <el-input
                                type="textarea"
                                :rows="8"
                                placeholder="请输入内容"
                                v-model="textarea">
                        </el-input>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <form-mdf :mdfid="mdfid"
                  ref="formmfd"
                  v-model="orderVisable"
                  :form="lookData"
                  :has-after-remark="true"
                  :dispute-data="dispute_data"
                  :mark-id="markId"
                  :title="mdfTitle"
                  :isShow="isLook"
                  :is-edit="isEdit"></form-mdf>
    </page>
</template>
<style lang="stylus">
    .p-index-inbox {
        .custom-textarea {
            > textarea {
                background-color: rgb(208, 229, 203) !important;
                border: none !important;
                cursor: default !important;
            }
        }
        .buyer-background {
            background: #d0e5cb;
        }
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
            height: 400px;
            overflow-x: hidden;
            overflow-y: auto;
            .head {
                &:hover {
                    background: #d0e5cb;
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
        .p-index-inbox-ebay-msg-list{
            div,span{
                font-size: 1.3rem;
            }
            .el-textarea__inner {
                display: block;
                resize: vertical;
                padding: 5px 7px;
                line-height: 1.5;
                box-sizing: border-box;
                width: 100%;
                font-size: 1.3rem;
                color: #1f2d3d;
                background-color: #fff;
                background-image: none;
                border: 1px solid #C0CCDA;
                border-radius: 3px;
                transition: border-color .2s cubic-bezier(.645,.045,.355,1);
            }
        }
        .right-card.ebay-right-card {
            div,span{
                font-size: 1.3rem;
            }
            height: 400px;
            .el-textarea__inner {
                display: block;
                resize: vertical;
                padding: 5px 7px;
                line-height: 1.5;
                box-sizing: border-box;
                width: 100%;
                font-size: 1.3rem;
                color: #1f2d3d;
                background-color: #fff;
                background-image: none;
                border: 1px solid #C0CCDA;
                border-radius: 3px;
                transition: border-color .2s cubic-bezier(.645,.045,.355,1);
            }
            .max-heigh {
                max-height: 300px;
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
            .mes-box {
                position: relative;
                padding: 5px 15px;
                border: 1px solid #ddd;
                border-radius: 5px;
                > .close-icon {
                    position: absolute;
                    top: -2px;
                    right: 2px;
                    width: 12px;
                    height: 12px;
                    display: inline-block;
                    background: url(../../../../../images/close.png) no-repeat;
                    transition: all .2s;
                    &:hover {
                        background: url(../../../../../images/close-hover.png) no-repeat;
                    }
                }
            }
            .blue-color {
                background-color: #C6DDF4;
            }
            .remark-sale-look {
                overflow-y: hidden;
                width: 190px;
                min-height: 150px;
                position: absolute;
                top: 0;
                right: 0;
                border: 1px solid #ddd;
                border-radius: 5px;
                background: #fff;
                padding: 0 5px;
                z-index: 999;
                .remark-sale-header {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 25px;
                    padding-left: 10px;
                    padding-top: 5px;
                    background-color: #fff;
                }

                .remark-sale-body {
                    overflow-y: hidden;
                    position: absolute;
                    top: 30px;
                    left: 0;
                    right: 0;
                    bottom: 30px;
                    padding: 0 5px;
                }

                .remark-sale-footer {
                    position: absolute;
                    height: 25px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    padding-bottom: 5px;
                    padding-right: 5px;
                    background-color: #fff;
                }

            }
        }

        .loadMore {
            text-align: center;
            .more {
                cursor: pointer;
                color: #69f;
                &:hover {
                    color: blue;
                }
            }
        }
        .right-active {
            border-radius: 4px;
            border: 1px solid #5E93FF !important;
            box-shadow: 0 0 7px #5E93FF;
            &:hover {
                background: #d0e5cb;
            }
        }

    }
</style>
<script>
    import search from "./search.vue"
    import uiCollapse from "../../../../components/ui-collapse.vue"
    import {
        api_inner_list,
        api_message_level,
        api_ebay_message_detail,
        api_message_change_level,
        api_message_replay,
        api_message_ignore,
        api_message_table_list,
        api_all_templates,
        api_templates_content,
        api_ebay_message_all_detail,
        api_message_more,
        api_ebay_message_accout,
        api_message_account,
        api_put_ebay_emails_id,
        api_post_ebay_message_remark,
        url_put_ebay_emails_id
    } from "../../../../api/inbox"
    import {url_message_change_level, url_message_ignore, url_message_replay} from "../../../../api/inbox"
    import {
        api_dispute_look,
    } from '../../../../api/dispute'
    import {api_info_ebay} from '../../../../api/ebay-order'
    import{mapGetters} from "vuex"

    export default {
        permission: {
            url_message_change_level,
            url_message_ignore,
            url_message_replay,
            url_put_ebay_emails_id
        },
        page: {},
        refresh() {
            this.init();
        },
        data() {
            return {
                markId: 0,
                dispute_data: {},
                btnShow: false,
                isLook: false,
                isEdit: {edit: false},
                isEditIssue: false,
                lookData: {},
                issueList: {
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
                mdfTitle: "",
                mdfid: 0,
                unfolded: true,
                isAll: true,
                tableData: [],
                loading: true,
                historyLoading:true,
                searchData: {
                    pageSize: 50,
                    page: 1,
                    account_id: "",
                    time_sort: 0,
                    customer_id: "",
                    state: 1,
                    search_key: "sender",
                    search_val: "",
                    receive_date_b: (Date.now()-(30*24*60*60*1000)),
                    receive_date_e: Date.now(),
                    level: 0,
                    msg_type: 0,
                    read_status: 0,
                    flag_id:''
                },
                total: 0,
                options: [],
                more: "",
                number: "",
                emial: false,
                to_queue:true,
                isFirst: false,
                textarea: "",
                list: [],
                flagArr: [],
                detail: {},
                details: [],
                someTemp: [],
                inits: [],
                orderVisable: false,
                form: {
                    sku_list: [
                        {item_id: 0, title: "", quantity_purchased: "", transaction_price: ""}
                    ],
                },
                bgHead: false,
                marks: [
                    {label: "无标记", value: 0},
                    {label: "退货申请", value: 1},
                    {label: "尺码大", value: 2},
                    {label: "尺码小", value: 3},
                    {label: "产品质量问题", value: 4},
                ],
                showAll:false,
                littleAccount:[],
                clickTime:'',
                canClick:true,
                remark:'',
                showRemark:false,
                replayLoading:false
            }
        },
        created() {
            this.init();
            this.get_level();
            this.get_used_template();
            this.get_all_template();
            this.get_account_all();
        },
        methods: {
            get_account_all(bool){  //是否只更新数量  默认为false
                this.$http(api_message_account,this.init_params()).then(res=>{
                    this.showAll=!!res.show_all;
                    if(res.show_all){
                        this.get_account();
                    }else {
                        if(!bool){
                            res.data=res.data.map(row=>{
                                return {
                                    label:row.code,
                                    count:row.count,
                                    value:row.id,
                                }
                            });
                            this.littleAccount=[...res.data];
                            this.littleAccount.forEach((row, index) => {
                                if (index < 10) {
                                    this.$set(row, 'showSearch', true);
                                } else {
                                    this.$set(row, 'showSearch', false);
                                }
                                this.$set(row, 'showDialog', true);
                            });
                        }else {
                            this.littleAccount.forEach(row=>{
                                let find=res.data.find(item=>item.id===row.value);
                                find&&(row.count=find.count);
                            })
                        }
                    }
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                });
            },
            get_account(){
                this.$http(api_ebay_message_accout,{channel_id:1}).then(res=>{
                    this.littleAccount=[...res.account];
                    this.littleAccount.forEach((row, index) => {
                        if (index < 10) {
                            this.$set(row, 'showSearch', true);
                        } else {
                            this.$set(row, 'showSearch', false);
                        }
                        this.$set(row, 'showDialog', true);
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
            lookOver(row) {
                this.mdfid = row.order_id;
                this.$refs.formmfd.require_server(this.mdfid);
                this.mdfTitle = `查看订单号：${row.order_number} 信息`;
                this.orderVisable = true;
                this.isLook = false;
            },
//            查看 处理
            handle(row, key) {
                this.markId = row[key].id;//纠纷id
//                纠纷信息
                this.dispute_data = {};
                this.loading = true;                                                    //NOTRECIVE || CANCEL
                this.$http(api_dispute_look, row[key].id, {dispute_type: row[key].dispute_type}).then(res => {
                    this.dispute_data = res;
                    this.dispute_data.dispute_type = this.issueList.dispute_type; //增加一个纠纷类型字段
                    //订单信息
                    this.mdfid = row.order_id;
                    this.$refs.formmfd.require_server(this.mdfid);
                    this.loading = false;
                    this.orderVisable = true;//----弹框打开
                    this.isLook = true;
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                    this.loading = false;
                });
            },
            //阻止事件冒泡
            level() {

            },
            message_click(de, index) {
                this.details.forEach(row => {
                    this.$set(row, 'isCheck', false)
                });
                de.isCheck = true
            },
            loadMore(item) {
                this.$http(api_message_more, {page: item.page, pageSize: 5, group_id: item.group_id}).then(res => {
                    if (!res.data.length || parseInt(res.pageSize) > res.data.length) {
                        item.loadMore = false;
                    } else {
                        item.page++;
                    }
                    item.message_list = item.message_list.concat(res.data)
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })

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
                    this.searchData.time_sort = 1
                } else {
                    this.searchData.time_sort = 0
                }
                this.init();
            },
            reflash() {
                this.details = [];
                this.detail = {};
                this.tableData = [];
                this.init()
            },
            init_params(){
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
                return data
            },
            init() {
                this.list = [];
                this.loading = true;
                this.$http(api_inner_list, this.init_params()).then(res => {
                    res.data.forEach(row => {
                        row.msg_count === 1 && (row.loadMore = false);
                        row.msg_count !== 1 && (row.loadMore = true);
                        row.page = 1
                    });
                    this.list = res.data;
                    this.list.forEach(row=>{
                        this.$set(row,'isReplied',false);
                        this.$set(row,'isHide',false);
                        this.$set(row,'isCheck',false);
                        row.message_list.forEach(message=>{
                            this.$set(message,'isCheck',false);
                        });
                    });
                    this.total = res.count;
                    this.loading = false;
                    if (this.list[0]) {
                        this.get_all_detail(this.list[0]);
                    }
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            get_level() {
                this.flagArr = [];
                this.$http(api_message_level).then(res => {
                    this.flagArr = res;
                }).catch(code => {
                    console.log(code)
                })
            },
            look_detail(item, itemList) {
                this.clickTime = new Date().getTime()/1000;
                this.list.forEach(row=>{
                    if(row.isReplied&&this.searchData.state===1&&!row.isHide){
                        row.isHide = true;
                        let find = this.littleAccount.find(account=>account.value===row.account_id);
                        if(!!find&&find.count>0){
                            find.count -= 1;
                        }
                        if(this.total>0) {
                            this.total -= 1;
                        }
                    }
                });
                this.inits.splice(0, 1);
                this.get_detail(item.id,item.group_id);
                this.cancel_check();
                this.temp_init();
                this.$set(item, "isCheck", true);
                this.get_table_list(item.id, item.message_id);
            },
            cancel_check() {
                this.list.forEach(row => {
                    this.$set(row, "isCheck",false);
                    row.message_list.forEach(x => {
                        this.$set(x, "isCheck",false);
                    })
                });
            },
            get_all_detail(item) {
                this.clickTime = new Date().getTime()/1000;
                this.list.forEach(row=>{
                    if(row.isReplied&&this.searchData.state===1&&!row.isHide){
                        row.isHide = true;
                        let find = this.littleAccount.find(account=>account.value===row.account_id);
                        if(!!find&&find.count>0){
                            find.count -= 1;
                        }
                        if(this.total>0) {
                            this.total -= 1;
                        }
                    }
                });
                this.details = [];
                this.cancel_check();
                this.$set(item, "isCheck", true);
                this.temp_init();
                let message = this.isCheckFind;
                if(message){
                    this.get_table_list(message.id, message.message_id);
                }
                this.$http(api_ebay_message_all_detail, {group_id: item.group_id}).then(res => {
                    this.details = res.data;
                    this.details.forEach(row=>{
                        this.$set(row,'group_id',item.group_id);
                        this.$set(row,'showRemark',false);
                    })
                }).catch(code => {
                    console.log(code)
                })
            },
            get_detail(id,group_id) {
                this.$http(api_ebay_message_detail, id).then(res => {
                    res.isCheck = true;
                    res.showRemark = false;
                    res.group_id = group_id;
                    this.details = [res];
                }).catch(code => {
                    console.log(code)
                })
            },
            change_level(item) {
                let data = {
                    group_id: item.group_id,
                    level_id: item.level?item.level:0
                };
                this.$http(api_message_change_level, data).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                })
            },
            replay() {
                if (!this.textarea) {
                    return this.$message({type: "info", message: '内容不能为空'})
                }
                let find = this.details.find(row =>row.isCheck && row.message_type === 1)||this.isCheckFind;
                if(!find){
                    return this.$message({type: "warning", message: '站内信信息不完整，无法回复！'})
                }
                let data = {
                    body_text: this.textarea,
                    upload_image: '',
                    id: find.id,
                    message_id: find.message_id,
                    to_queue:this.to_queue?1:0
                };
                if (this.inits.length <= 0) {
                    data.img && (delete data.img)
                } else {
                    data.img = this.inits[0].image
                }
                this.replayLoading = true;
                this.$http(api_message_replay, data).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.list.forEach(row=>{
                        if(row.group_id===find.group_id){
                            row.isReplied = true;
                            row.message_list.forEach(message=>{
                                message.replied = 1;
                            });
                        }
                    });
                    this.temp_clear();
                    if(this.searchData.state!==1){
                        this.get_account_all(true);
                    }
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                }).finally(()=>{
                    this.replayLoading = false;
                });

            },
            temp_clear() {
                this.more = '';
                this.number = '';
                this.inits.length = 0;
                this.textarea = '';
            },
            change_mark(item, val) {
                this.$http(api_put_ebay_emails_id, item.id, {flag_id:val}).then(res => {
                    item.flag_id = val;
                    this.$message({type: "success", message: res.message || res})
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })
            },
            update_mark(item) {
                if(!item.remark&&!this.remark){
                    this.$message({type:'warning',message:'请填写备注信息！'})
                }
                this.$http(api_post_ebay_message_remark, {id:item.id,remark:this.remark}).then(res => {
                    if(item.showRemark&&!!this.remark){
                        item.remark = res.remark;
                        item.remark_time = res.remark_time;
                        item.remark_user = res.remark_user;
                        this.remark = '';
                        item.showRemark = false;
                    }else{
                        item.remark = '';
                        item.remark_time = '';
                        item.remark_user = '';
                    }
                    this.$message({type: "success", message: res.message || res})
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })
            },
            ignore() {
                let find = this.details.find(row =>row.isCheck && row.message_type === 1)||this.isCheckFind;
                if(!find){
                    return this.$message({type: "warning", message: '站内信信息不完整，无法忽略！'})
                }
                this.$confirm('您将忽略该邮件，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {
                        id: find.id,
                        state: 2
                    };
                    this.replayLoading = true;
                    this.$http(api_message_ignore, data).then(res => {
                        this.list.forEach(row=>{
                            if(row.group_id===find.group_id){
                                row.isReplied = true;
                                row.message_list.forEach(message=>{
                                    message.replied = 1;
                                });
                            }
                        });
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                        let findReplied = {};
                        this.list.forEach(row => {
                            row.message_list.forEach(item => {
                                if (item.id === this.detail.id) {
                                    findReplied = item;
                                }
                            })
                        });
                        findReplied.replied = 1;
                        if(this.searchData.state!==1){
                            this.get_account_all(true);
                        }
                        this.temp_clear();
                    }).catch(code => {
                        this.$message({message: code.message || code, type: 'error'});
                    }).finally(()=>{
                        this.replayLoading = false;
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消操作'
                    });
                });
            },
            get_table_list(id, message_id) {
                if(!this.canClick){
                    return
                }
                this.tableData = [];
                this.historyLoading = true;
                this.$http(api_message_table_list, {id: id, message_id: message_id, msg_type: 1}).then(res => {
                    this.tableData = res.data;
                }).catch(code => {
                    console.log(code)
                }).finally(()=>{
                    this.historyLoading = false;
                });
            },
            clear() {
                let data = window.clone(this.searchData);
                this.searchData = {
                    pageSize: 50,
                    page: 1,
                    time_sort: 0,
                    level: 0,
                    customer_id: "",
                    keyword: "",
                    account_id: "",
                    receive_date_b: "",
                    receive_date_e: "",
                    search_key: "sender",
                    search_val: "",
                    read_status: 0
                };
                this.details = [];
                if (!this.showAll) {
                    this.searchData.account_id = data.account_id
                } else {
                    this.searchData.account_id = ''
                }
                this.searchData.state = data.state;
                this.init();
            },
            get_used_template() {
                let data = {
                    type: 2, page_size: 6, channel_id: 1, template_type: 1
                };
                this.someTemp = [];
                this.$http(api_all_templates, data).then(res => {
                    this.someTemp = res.data
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                })
            },
            some_click(item) {
                let find = this.details.find(row =>row.isCheck && row.message_type === 1)||this.isCheckFind;
                if(!find){
                    return this.$message({type: "warning", message: '站内信信息不完整，无法忽略！'})
                }
                let data = {
                    template_id: item.template_id,
                    channel_id: 1,
                    search_id: find.id,
                    search_type: 'msg'
                };
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
                    type: 1, channel_id: 1, template_type: 1
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
                let find = this.details.find(row =>row.isCheck && row.message_type === 1)||this.isCheckFind;
                if(!find){
                    return this.$message({type: "warning", message: '站内信信息不完整，无法回复！'})
                }
                let data = {
                    template_no: this.number,
                    channel_id: 1,
                    search_id: find.id,
                    search_type: 'msg'
                };
                this.$http(api_templates_content, data).then(res => {
                    this.textarea = res.data;
                    this.more = "";
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                })
            },
            change_temp() {
                let find = this.details.find(row =>row.isCheck && row.message_type === 1)||this.isCheckFind;
                if(!find){
                    return this.$message({type: "warning", message: '站内信信息不完整，无法回复！'})
                }
                let data = {
                    template_id: this.more,
                    channel_id: 1,
                    search_id: find.id,
                    search_type: 'msg'
                };
                this.$http(api_templates_content, data).then(res => {
                    this.textarea = res.data;
                    this.number = "";
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                })
            },
            show_mark_input(row){
                this.details.forEach(item=>{
                    item.showRemark = false;
                });
                this.remark = '';
                row.showRemark = !row.showRemark;
            },
            cancel_mark(item){
                this.remark = '';
                item.showRemark = false;
            },
            // 删除备注
            delete_mark(de) {
                this.$confirm('您将删除此备注信息, 确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.update_mark(de);
                }).catch(code => {
                    this.$message({
                        type: 'info',
                        message: "已取消删除"
                    });
                })
            },
        },
        filters:{
            filterDate(val) {
                return val>=0?datef("YYYY-MM-dd HH:mm:ss", val):val;
            },
        },
        watch:{
            'clickTime':{
                deep:true,
                handler(newVal,old){
                    this.canClick = newVal-old>1.5?true:false
                }
            }
        },
        computed: {
            ...mapGetters({currentUser:'user/info'}),
            showBtn() {
                return !!this.details.find(row =>row.isCheck && row.message_type === 1)||!!this.isCheckFind;
            },
            markList(){
                return [{label:'全部',value:''},...this.marks];
            },
            isCheckFind(){
                let check = this.list.find(row=>row.isCheck||row.message_list.find(row=>row.isCheck));
                if(!!check){
                    return check.message_list.find(row=>row.isCheck||row.message_type===1);
                }
                return undefined
            }
        },
        components: {
            search,
            uiCollapse,
            imageUpload: require("../../smt/inbox/image-upload.vue").default,
            formMdf: require('../../../order/local/form-mdf.vue').default,
            uiTips:require('@/components/ui-tips').default,
        }
    }
</script>
