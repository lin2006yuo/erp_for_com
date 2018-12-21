<template>
    <page class="ebay-email-p-index-inbox">
        <search ref="search"
                class="mb-sm"
                :searchData="searchData"
                :account-list="accountList"
                :is-outbox="true"
                @select-status="select_status"
                @reflash="reflash"
                :type="2"
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
                        <div class="collapse" v-resize="{height:76}" v-if="emailList.length===0" style="text-align: center;line-height:250px">暂无数据
                        </div>
                        <div class="collapse" v-resize="{height:76}" v-if="emailList.length>0">
                            <ui-collapse v-for="(item,item_i) in emailList"
                                         :key="`${item.id}${item_i}`"
                                         :show="unfolded"
                                         @head="select_detail(item)"
                                         :class="`${ item.isClick?'active':''} amazon-msg-list`">
                                <span slot="title" style="line-height:26px;  cursor: pointer;">
                                    <el-row class="inline">
                                        <div class="inline">发件人：{{item.sender}}</div>
                                    </el-row>
                                    <div class="inline fr">
                                        <span>{{item.sync_time | fmsdatetime}}</span>
                                    </div>
                                </span>
                                <div>
                                    <div :class="`${item.is_read===0?'bold-font':''} mb-xs`"
                                         style="cursor: pointer;"
                                         @click="select_detail(item)">
                                        <div>
                                            <el-row class="mb-sm">
                                                <div class="inline">发件人：{{item.sender}}</div>
                                                <i :class="['fr','mr-xs']"
                                                   style="font-style:normal">{{item.sync_time | fmsdatetime}}</i>
                                            </el-row>
                                            <div class="flex">
                                                <div class="flex-1">
                                                    <div style="padding-left:25px">
                                                        <span>收件人：{{item.receiver}}</span>
                                                        <span class="ml-md" v-if="hasAccount">账号简称：{{item.account_code}}</span>
                                                    </div>
                                                    <div style="padding-left:25px">主题：{{item.subject}}</div>
                                                </div>
                                            </div>
                                        </div>
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
            </el-col>
            <el-col :span="14">
                <el-card class="rightCard ebay-right-card" v-resize="{height:34}">
                    <div>
                        <div v-if="detail.id" style="height: 100%;display: flex;flex-direction: column">
                            <div style=" background:rgba(173,227,255,.5);padding: 5px;border-radius: 5px"
                                 class="mb-xs">
                                <div style="min-height: 30px">
                                    <div class="bold-font">
                                        <span>主题：{{detail.subject}}</span>
                                    </div>
                                    <div class="bold-font">
                                        <div class="inline mr-sm">发件人：{{detail.sender}}</div>
                                        <div class="inline mr-sm">收件人：{{detail.receiver}}</div>
                                        <div class="inline" v-if="hasAccount">账号简称：{{detail.account_code}}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="max-heigh_single" v-resize="{height:23}">
                                <iframe style="width:100%;min-height: 97%;overflow-x: hidden" scrolling="yes" :srcdoc="detail.body"
                                        ref="singleFrame"></iframe>
                            </div>
                        </div>
                        <div style="text-align: center;line-height: 290px;" v-else>暂无数据</div>
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

    .ebay-email-p-index-inbox {
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
            .el-checkbox {
                margin-left 11px;
                span.el-checkbox__input{
                    &:hover {
                        background: #E3ECF7;
                        border: 1px solid #E3ECF7;
                    }
                    .el-checkbox__inner{
                        border: 1px solid #C0CCDA;
                        &:hover {
                            color: white;
                            background: white;
                            border: 1px solid #33B2FC;
                        }
                    }
                }
                span.el-checkbox__input.is-checked{
                    &:hover {
                        background: #E3ECF7;
                        border: 1px solid #E3ECF7;
                    }
                    .el-checkbox__inner{
                        background: #33B2FC;
                        border: 1px solid #33B2FC;
                        &:hover {
                            color: white;
                            border: 1px solid #33B2FC;
                            background: #33B2FC;
                        }
                    }
                }
            }
        }
        .collapse {
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
                    &:hover {
                        background: #d0e5cb;
                    }
                }
                .body {
                    border-radius: 4px;
                    border: 1px solid #5E93FF !important;
                    box-shadow: 0 0 7px #5E93FF;
                    &:hover {
                        background: #d0e5cb;
                    }
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
            div, span {
                font-size 1.3rem;
            }
            .max-heigh_single {
                flex: 1;
                width: 100%;
                overflow-y: hidden;
                overflow-x: hidden;
            }
            .max-heigh {
                min-height: 370px;
                width: 100%;
                overflow-y: auto;
                overflow-x: hidden;
            }
            .el-card__body {
                height: 100%;
            }
        }
        ul.el-upload-list.el-upload-list--text {
            li.el-upload-list__item.is-success {
                margin-top: 0;
                line-height 16px;
                .el-upload-list__item {
                    line-height 16px;
                }
            }
        }
    }
</style>
<script>
    import {api_get_ebay_emails_outbox} from "@/api/ebay-emails-outbox"
    import {
        api_get_ebay_emails_account
    } from '@/api/ebay-emails'

    export default {
        permission: {},
        page: {
            frontEnd:'覃宏峰',
            backEnd:'邓海波',
            createTime:'2018-9-29',
            updateTime:'2018-9-29'
        },
        refresh() {
            this.init();
        },
        data() {
            return {
                unfolded: true,
                loading: true,
                searchData: {
                    pageSize: 50,
                    page: 1,
                    platform: 'ebay',
                    status: '',
                    account_code: '',
                    grouping: '',
                    receiver:'',
                    sort:'',
                    type: 2
                },
                total: 0,
                isFirst: true,
                emailList: [],
                initCount: 0,
                accountList: []
            }
        },
        mounted() {
            this.init();
            this.get_account();
        },
        methods: {
            get_account() {
                if(this.searchData.platform==='ebay') {
                    let data = {
                        platform: 'ebay',
                        status: this.searchData.status,
                        account_code: this.searchData.account_code==='全部'?'':this.searchData.account_code,
                        receiver: this.searchData.receiver,
                        type:2
                    };
                    this.$http(api_get_ebay_emails_account, data).then(res => {
                        if (this.accountList.length === 0) {
                            this.accountList = res.data;
                        } else {
                            this.accountList.forEach(account => {
                                let find = res.data.find(row => row.value === account.value);
                                if (find) {
                                    account.count = find.count;
                                }
                            });
                        }
                    }).catch(code => {
                        console.log(code);
                    });
                }
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
                    this.searchData.sort = 'asc'
                } else {
                    this.searchData.sort = 'desc'
                }
                this.init();
            },
            select_status(){
                this.initCount++;
                if (this.initCount > 3) {
                    this.init();
                }
            },
            reflash(initAccount) {
                this.initCount++;
                if (this.initCount > 3) {
                    initAccount&&this.get_account();
                    this.init();
                }
            },
            init_params(){
                let data = window.clone(this.searchData);
                if(data.platform==='ebay'){
                    delete data.grouping;
                }
                if(data.platform==='paypal'){
                    delete data.account_code;
                }
                return data
            },
            init() {
                let data = this.init_params();
                this.loading = true;
                this.$http(api_get_ebay_emails_outbox, data).then(res => {
                    this.emailList = res.data.map((row,index)=>{
                        this.$set(row,'isClick',index===0?true:false);
                        return row
                    });
                    this.total = res.count;
                    this.loading = false;
                }).catch(code => {
                    this.loading = false;
                    console.log(code, 'code');
                });
            },
            select_detail(item) {
                if(!!item&&!item.isClick) {
                    this.emailList.forEach(row => {
                        this.$set(row, "isClick",false);
                    });
                    this.$set(item, "isClick", true);
                }
            },
            clear() {
                let data = window.clone(this.searchData);
                this.searchData = {
                    pageSize: 50,
                    page: 1,
                    platform: 'ebay',
                    is_read: '',
                    account_code: '',
                    grouping: '',
                    receiver:'',
                    sort:''
                };
                this.init();
            },
        },
        watch:{
            'detail.id'(val){
                if(val){
                    setTimeout(() => {
                        let body = this.$refs.singleFrame.contentWindow.document.getElementsByTagName('body')[0];
                        if(body) {
                            this.$set(body.style, 'overflowX', 'hidden');
                            this.$set(body.style, 'word-break', 'break-word');
                        }
                    }, 100)
                }
            },
        },
        computed:{
            detail(){
                return this.emailList.find(row=>row.isClick)||{body:''};
            },
            hasAccount(){
                return this.searchData.platform!=='paypal'
            }
        },
        components: {
            search:require('../search').default,
            uiCollapse:require('@/components/ui-collapse').default,
            imageUpload: require("../../smt/inbox/image-upload.vue").default,
            formMdf: require("../../../order/local/form-mdf.vue").default,
            fileUpload:require("../../../system-notice/write-an-e-mail/file-upload").default,
            kindeditor:require('@/components/kindeditor.vue').default,
            inputTag:require('@/components/input-tag').default,
        }
    }
</script>
