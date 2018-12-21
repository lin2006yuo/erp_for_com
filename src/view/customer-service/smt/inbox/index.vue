<template>
    <page class="smt-inbox">
        <search
            ref="search"
            :search-data="searchData"
            @get-priority="get_priority"
            :priority="priority"
            @refresh="refreshs"
            @clear="clear"
            :account-list="accountList"
            class="mb-md"></search>
        <el-row :gutter="8">
            <el-col :span="10">
                <el-card>
                    <div class="sort">
                        <span >排序方式: </span>
                        <span @click="sort">{{searchData.sort==1?'最晚时间':'最早时间'}}
                            <i class="el-icon-caret-bottom"></i>
                        </span>
                        <span></span>
                        <span @click="pack">全部收起</span>
                        <span @click="unfold">全部展开</span>
                    </div>
                    <div class="collapse" v-loading="loading" element-loading-text="拼命加载中">
                        <div v-if="list.length<=0" style="text-align: center;margin-top: 240px;">暂无数据</div>
                        <ui-collapse  v-for="(item,item_i) in list"
                                      :key="`${item.id}${item_i}`"
                                      :show="isShow"
                                      v-if="is_hide(item)"
                                      @head="look_detail(item,'click')" :class="`${ item.isCheck?'active':''} aliexpress-msg-list`">
                            <span slot="title">
                                <el-row class="inline lookClass" >
                                    <div class="inline">
                                        <div class="inline">{{item.other_name}}</div>
                                        <span v-if="item.order_id" @click="look(item,'look','email')" class="inline operate">{{item.type_id}}</span>
                                        <span v-else class="inline">{{item.type_id}}</span>
                                        <div class="inline" style="padding-left:5px" v-if="item.msg_type===2"  @click.stop="look_order(item)">{{item.order_id}}</div>
                                        <div class="inline" :class="item.unread_count>0?'unread':'read'">（{{item.unread_count}}/{{item.count_msg}}）</div>
                                    </div>
                                </el-row>
                              <div  class="inline fr">
                                  <span >{{item.msg_time|timeFilter}}</span>
                                 <el-select v-model="item.rank"
                                            placeholder="请选择"
                                            @change="change_level(item)"
                                            class="inline ml-sm" style="width:90px">
                                        <el-option
                                            v-for="(it,it_i) in flagArr"
                                            :key="`${it.id}${it_i}`"
                                            :label="it.name"
                                            :value="it.id">
                                        </el-option>
                                 </el-select>
                              </div>
                            </span>
                            <div>
                                <div v-if="item.msg_list.length===0">暂无数据</div>
                                <div v-for="(message,m_i) in item.msg_list"
                                     class="mb-xs"
                                     :key="`${message.id}${m_i}`"
                                     @click="detail_(message,'click',item)">
                                    <el-card :class="['stroke',message.isCheck?'active-sm':'',message.is_own===0?'buyer-background':'']">
                                        <el-row class="mb-sm">
                                            <i class="el-icon-message" style="color:#F8D892"></i>
                                            <div class="inline" style="font-weight: bold;" >{{message.sender_name}}</div>
                                            <div class="inline fr">{{message.gmt_create|timeFilter}}</div>
                                        </el-row>
                                        <div class="el-row">
                                            <div style="width:88%;padding-left:20px;float: left;" v-html="message.content"></div>
                                            <div class="inline fr" v-if="message.product_img">
                                                <div v-if="message.product_url">
                                                    <a :href="message.product_url" target="_blank">
                                                        <img :src="message.product_img||'/static/error-picture-128.png'" height="60px" width="60px" style="border:1px solid #ccc;border-radius: 2px">
                                                    </a>
                                                </div>
                                                <div v-else>
                                                    <el-popover
                                                        placement="right"
                                                        width="200"
                                                        trigger="hover">
                                                        <img v-lazy="sku_image(message.product_img)" width="200" height="200">
                                                        <span slot="reference">
                                                    <img v-lazy="message.product_img" width="60" height="60">
                                              </span>
                                                    </el-popover>
                                                </div>
                                            </div>
                                        </div>
                                    </el-card>
                                </div>
                                <div class="el-row t-center" v-if="item.show&&item.count_msg>1"><span class="operate" @click="msg_list_more(item,'click')">点击展开更多邮件</span></div>
                            </div>
                        </ui-collapse>
                    </div>
                    <div class="mt-xs" style="height:30px;">
                        <el-pagination
                            class='fr'
                            @size-change="sizeChange"
                            @current-change="currentChange"
                            :current-page=searchData.page
                            :page-sizes="[20, 50, 100, 200,500]"
                            :page-size=searchData.pageSize
                            layout="total, sizes, prev, pager, next, jumper"
                            :total=total>
                        </el-pagination>
                    </div>
                </el-card>

                <div class="history">
                    <div class="mt-sm mb-sm">历史订单及当前交易(绿色三角标志)</div>
                    <el-table :data="tableData"
                              v-resize="{height:20}"
                              style="width: 100%;overflow-x: hidden;">
                        <el-table-column label="订单号" inline-template  show-overflow-tooltip>
                            <div>
                                <i v-if="row.is_current === 1" style="color:green" class="el-icon-caret-right"></i>
                                <span @click="look(row,'look','table')" class="operate">{{row.order_no}}</span>
                            </div>
                        </el-table-column>
                        <el-table-column prop="country" label="国家" show-overflow-tooltip></el-table-column>
                        <el-table-column label="金额" inline-template>
                            <div>
                                {{row.currency_code}}&nbsp;{{row.pay_amount}}
                            </div>
                        </el-table-column>
                        <el-table-column  label="状态" inline-template>
                            <el-popover placement="right"
                                        title="平台订单信息"
                                        width="350"
                                        trigger="hover">
                                <div>
                                    <table class="template">
                                        <tr>
                                            <td>标记时间:</td>
                                            <td>{{row.gmt_send_date}}</td>
                                        </tr>
                                        <tr>
                                            <td>跟踪号:</td>
                                            <td>{{row.logistics_no}}</td>
                                        </tr>
                                        <tr>
                                            <td>邮寄方式编码:</td>
                                            <td>{{row.logistics_type_code}}</td>
                                        </tr>
                                        <tr>
                                            <td>邮寄方式名称:</td>
                                            <td>{{row.logistics_service_name}}</td>
                                        </tr>
                                    </table>
                                </div>
                                <span slot="reference">
                               <span>
                                   <span>{{row.order_status}}</span>
                                    <i class="el-icon-document"></i>
                               </span>
                            </span>
                            </el-popover>
                        </el-table-column>
                        <el-table-column label="评价" inline-template><div>{{row.evaluate!==0?'买家已评价':''}}</div></el-table-column>
                        <el-table-column
                            label="纠纷" inline-template>
                            <div>
                                <permission
                                    tag="span"
                                    v-if="row.issue!==0"
                                    type="text"
                                    :route="apis.url_get_ali_issue_id"
                                    class="operate"
                                    @click="look(row,'show','table')">有</permission>
                                <span v-else>无</span>
                            </div>
                        </el-table-column>
                        <el-table-column prop="" label="退货"></el-table-column>
                    </el-table>
                </div>
            </el-col>
            <el-col :span="14">
                <el-card class="rightCard ebay-right-card">
                    <div v-if="detail.length===0">暂无数据</div>
                    <div v-for="(data,data_i) in detail" :key="`${data.gmt_create}${data_i}`" @click="message_click(data)">
                        <el-card :class="['mb-xs',data.is_own===0?'buyer-background':'',data.isCheck?'right-active':'','pointer']">
                            <el-row class="mb-xs">
                                <span v-if="data.is_own===0"  class="buyer">买</span>
                                <span v-if="data.is_own===1" class="seller">卖</span>
                                <div class="inline bold-font" style="color:#3300FF">{{data.sender_name}}</div>
                                <div class="inline fr bold-font">{{data.gmt_create|timeFilter}}</div>
                            </el-row>
                            <div class="el-row">
                                <div  class="inline" style="width: 93%;">
                                    <div  v-html="data.content"></div>
                                    <ul  v-if="data.img&&data.img.length">
                                      <li v-for="image in data.img" class='inline'  @click="scale_image(image)" >
                                          <img v-lazy="image.s_path" alt="">
                                      </li>
                                    </ul>
                                </div>
                                <div class="inline fr" v-if="data.product_img">
                                    <el-popover
                                        placement="right"
                                        width="200"
                                        trigger="hover">
                                        <img v-lazy="sku_image(data.product_img)" width="200" height="200">
                                        <span slot="reference">
                                        <img v-lazy="data.product_img" width="60" height="60">
                                    </span>
                                    </el-popover>
                                </div>
                            </div>
                            <div class="inline" v-if="data.file_path.length>0"
                                 v-for="(img,img_i) in data.file_path" :key="`${img.sPath}${img_i}`" style="margin-top:5px">
                                <el-popover
                                    placement="bottom-start"
                                    trigger="hover">
                                    <img :src="img.lPath" width="300px" height="400px">
                                    <span slot="reference">
                                         <img :src="img.sPath" width="50px" height="26px" style="cursor: -webkit-zoom-in;">
                                </span>
                                </el-popover>
                            </div>
                        </el-card>
                    </div>
                </el-card>
                <el-card style="margin-top:5px" v-resize="{height:20}">
                    <div>
                        <div style="font-weight: bold;">常用回复模板</div>
                        <el-row>
                            <span class="operate ml-xs"  @click="some_click(item)"
                                  v-for="(item,i) in someTemp" :key="`${item.template_name}${i}`">{{item.template_name}}</span>
                            <el-select v-model="more" placeholder="更多" class="inline" style="width:200px" @change="change_temp">
                                <el-option
                                    :key="`${item.template_id}${index}`"
                                    v-for="(item,index) in options"
                                    :label="item.template_name"
                                    :value="item.template_id">
                                </el-option>
                            </el-select>
                            <label>模板编号：</label>
                            <el-input v-model="number" class="inline" @blur="blur_temp"></el-input>
                        </el-row>
                    </div>
                    <el-row class=" mt-sm mb-sm">
                        <div class="operate" style="display:inline-block">
                            <image-upload ref="imageUpload" :thumbnail-mode="true" :multiple="false" :image="{width:'100px',height:'100px'}" :init="init"></image-upload>
                        </div>
                        <div class="fr">
                            <permission tag="ElButton" :route="apis.url_batchProcessed" size="mini" type="primary" class="inline" @click="neglect">忽略</permission >
                            <permission tag="requestButton" :route="apis.url_replay" :request="reply"  size="mini" type="primary" class="inline" >回复</permission>
                        </div>
                    </el-row>
                    <div>
                        <emotions-textarea ref="emotionText" v-model="textarea" :emotions="emotions"></emotions-textarea>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <!--订单弹框-->
        <form-mdf
            ref="formmfd"
            :mdfid="mdfid"
            :is-edit-issue="isEditIssue"
            v-model="orderVisable"
            :is-edit="isEdit"
            :title="mdfTitle"
            :is-inbox-open="isInboxOpen"
            :is-show="showIssue"
            :btn-show="btnShow"
            :dispute-data="dispute_data"
        ></form-mdf>
        <blowup-image v-model="showBigDailog"
                      :title="blowUpTitle"
                      :imgPath="curImgPath"></blowup-image>
    </page>
</template>
<style lang="stylus">
    .smt-inbox{
        .buyer{
            display: inline-block;
            background:#FF0000 ;
            color: #FFFFEF;
            line-height: 20px;
            font-weight: 600;
            font-size: 1.25rem;
            padding: 2px 5px;
            border-radius: 4px;
        }
        .seller{
            display: inline-block;
            background:#FFCC06 ;
            color: #1F77A2;
            line-height: 20px;
            font-weight: 600;
            font-size: 1.25rem;
            padding: 2px 5px;
            border-radius: 4px;
        }
        .stroke{
            min-height: 88px;
            padding: 5px;
            box-sizing: border-box;
            &:hover{
                cursor: pointer;
                background-color: #d0e5cb;
            }
            .badge {
                margin-right: 30px;
            }
        }
        .sort{
            display: flex;
            padding: 0 5px;
            box-sizing: border-box;
            background-color: #E3ECF7;
            span{
                padding: 0 5px;
                border: 1px solid #E5E9F2;
                line-height: 26px;
                cursor: pointer;
            }
            span:nth-child(3){
                flex-grow: 2;
            }
        }
        a:hover{
            font-size: 1.2rem !important;
            text-decoration: underline;
        }
        .lookClass{
            cursor: pointer;
            .unread{
                color: #ff0000;
            }
            .read{
                color: #1f2d3d;
            }
        }
        .collapse{
            height: 430px;
            overflow-y: auto;
            .head{
                &:hover{
                    background: #d0e5cb;
                }
            }
            .active{
                .head{
                    background: rgba(173,227,255,.5);
                    &:hover{
                        background: #d0e5cb;
                    }
                }
            }
            .active-sm{
                border-radius: 4px;
                border: 1px solid #5E93FF!important;
                box-shadow: 0 0 7px #5E93FF;
                /*background: rgba(173,227,255,.5);*/
                &:hover{
                    background: #d0e5cb;
                }
            }
        }
        .history{
            .el-table__body-wrapper{
                min-height: 100px;
            }
        }
        .rightCard{
            height: 395px;
            overflow: auto;
            & div,span{
                font-size 1.3rem!important;
            }
        }
        .aliexpress-msg-list{
            & div,span{
                font-size 1.3rem!important;
            }
        }
        .right-active{
            border-radius: 4px;
            border: 1px solid #5E93FF!important;
            box-shadow: 0 0 7px #5E93FF;
            &:hover{
                background: #d0e5cb;
            }
        }
    }
    .buyer-background{
        background: #d0e5cb;
    }
</style>
<script>
    import orderForm from '../../../order/aliexpress/list/order-form.vue';
    import search from "./search.vue"
    import uiCollapse from "../../../../components/ui-collapse.vue"
    import {
        api_smt_list,
        api_level,
        api_orders,
        api_changelevel,
        api_detail,
        api_replay,
        api_read,
        api_batchProcessed,
        api_tmpContent,
        api_aliexpress_msg_list,
        api_aliexpress_msg_more,
        api_get_ali_express_msg_account,
        api_levelStatistics,
        url_batchProcessed,
        url_replay,
        url_aliexpress_msg_list
    } from '../../../../api/smt-mail'
    import {api_get_account} from '../../../../api/smt-estimate'
    import {api_all_templates} from '../../../../api/inbox'
    import {aliexpress_check} from '../../../../api/aliexpress-order'
    import {api_get_ali_issue_id,url_get_ali_issue_id} from "../../../../api/dispute"
    export default{
        permission:{
            url_batchProcessed,
            url_replay,
            url_aliexpress_msg_list,
            url_get_ali_issue_id
        },
        page:{},
        refresh(){
            this.get_priority();
            this.listFun();
        },
        data(){
            return {
                dispute_data:{},
                btnShow: false,
                isEdit: {edit: false},
                isEditIssue:false,
                mdfTitle:"",
                showIssue:false,
                showBigDailog:false,
                blowUpTitle:"查看放大图片",
                curImgPath:"",
                mdfid:0,
                orderVisable:false,
                searchData:{
                    page:1,
                    pageSize:50,
                    filter_type:'order_id',
                    filter_text:'',
                    customer_id:'',
                    status:'',
                    rank:-1,
                    msg_type:'',
                    read:'',
                    sort:1,
                    account_id:''
                },
                total:0,
                list:[],
                flagArr:[],
                tableData:[],
                detail:[],
                priority:[],
                options:[],
                textarea:'',
                loading:false,
                isShow:true,
                init:[],
                more:'',
                number:'',
                someTemp:[],
                currentData:0,
                //-----查看订单详情
                orders:false,
                form:{
                    order_id:0,
                    biz_type:"",
                    buyer_login_id:"",
                    receipt_address:[],
                    pay_amount:[],
                    payment_type:"",
                    gmt_pay_time:0,
                    orderProductList:[{
                        send_goods_time:"",
                    }],
                    content:[]
                },
                formType:{
                    order_id:0,
                    biz_type:"",
                    buyer_login_id:"",
                    receipt_address:[],
                    pay_amount:[],
                    payment_type:"",
                    gmt_pay_time:0,
                    orderProductList:[{
                        send_goods_time:"",
                    }],
                    content:[]
                },
                emotions: require('../../../../lib/emotions').default,
                initCount:0,
                isInboxOpen:false,
                accountList:[],
                showAll:false
            }
        },
        mounted(){
            if(window.objlength(this.param)!==0){
                this.listFun_();
            }else{
                this.listFun();
            }
            this.levelFun();
            this.get_used_template();
            this.get_all_template();
            this.get_account_all();
            this.get_priority();
        },
        methods: {
            //获取账号
            get_account_all(bool){
                this.$http(api_get_ali_express_msg_account).then(res=>{
                    this.showAll=!!res.show_all;
                    if(res.show_all){
                        this.get_account();
                    }else {
                        if(!bool){
                            res.data=res.data.map(row=>{
                                return {
                                    name:row.code,
                                    count:row.count,
                                    value:row.id,
                                }
                            });
                            this.accountList=[...res.data];
                            this.accountList.forEach((row, index) => {
                                if (index < 10) {
                                    this.$set(row, 'showSearch', true);
                                } else {
                                    this.$set(row, 'showSearch', false);
                                }
                                this.$set(row, 'showDialog', true);
                            });
                        }else {
                            this.accountList.forEach(row=>{
                                let find=res.data.find(item=>item.id===row.value);
                                find&&(row.count=find.count)
                            })
                        }
                    }
                }).catch(code=>{
                    console.log(code);
                });
            },
            get_account(){
                this.$http(api_get_account,{channel_id:4}).then(res=>{
                    this.accountList = [...res.account];
                    this.accountList.forEach((row, index) => {
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
            is_hide(item){
                if(this.searchData.status===0){
                    return !item.isHide
                }else{
                    return true
                }
            },
            listFun_(){
                this.list = [];
                this.detail = [];
                this.tableData = [];
                this.list = this.param.resData.data;
                this.total = this.param.resData.count;
                this.list.forEach(data => {
                    this.$set(data,'isCheck',false);
                    this.$set(data,'isHide',false);
                    this.$set(data,'isReplied',false);
                    this.$set(data,'show',true);
                    this.$set(data,'page',1);
                    (data.msg_list&&data.msg_list.length > 0) && (data.msg_list.forEach(row=>{
                        this.$set(row,'isCheck',false);
                        row.content = this.$refs.emotionText.replaceImg(row.content);
                    }));
                });
                if(this.list[0]){
                    this.look_detail(this.list[0])
                }
            },
            refreshs(){
                this.initCount++;
                if(this.initCount>3){
                    this.listFun();
                }
            },
            look(row,type,provenance) {
                this.mdfid = provenance==='email'?row.order_id:row.id;
                this.$refs.formmfd.require_server(this.mdfid);
                if(type==='look'){
                    this.mdfTitle = `查看订单号：${provenance==='email'?row.order_number:row.order_no} 信息`;
                    this.orderVisable = true;
                    this.showIssue = false;
                    this.isEdit.edit = false;
                    this.isInboxOpen = true;
                }else {
                    this.isInboxOpen = false;
                    this.dispute_data = {};
                    this.$http(api_get_ali_issue_id, row.issue).then(res => {
                        this.dispute_data = res;
                        this.showIssue = true;
                        this.isEditIssue = !(this.dispute_data.solution.buyer.find(row => row.status === 'reached') || this.dispute_data.solution.seller.find(row => row.status === 'reached'));
                        this.mdfTitle = `${this.isEditIssue?'处理':'查看'}订单号：${row.order_no} 纠纷信息`;
                        this.orderVisable = true;
                    }).catch(code => {
                        this.$message({message: code.message || code, type: 'error'});
                    });
                }
            },
            scale_image(image){
                this.showBigDailog=true;
                this.curImgPath=image.l_path;
            },
            sku_image(images){
                if(!!images){
                    return images.replace('_60x60.','_200x200.');
                }
                return ""
            },
            look_order_type(row){ //------查看订单详情
                this.$http(aliexpress_check,row.type_id,row.order_create).then(res=>{
                    this.form = res;
                    this.orders = true;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                });
            },
            look_order(row){
                this.mdfid =row.id;
                this.$refs.formmfd.require_server(this.mdfid);
                this.mdfTitle = `查看订单号：${row.order_no} 信息`;
                this.orderVisable = true;
            },
            /*全部展开收起*/
            unfold(){
                this.$set(this,'isShow',true)
            },
            pack(){
                this.$set(this,'isShow',false)
            },
            /*---------模板引入的是eBayinbox接口*/
            get_used_template(){
                let data = {
                    type:2,page_size:6,channel_id:4,template_type:1
                };
                this.someTemp = [];
                this.$http(api_all_templates,data).then(res=>{
                    this.someTemp = res.data
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                })
            },
            get_all_template(){
                let data = {
                    type:1,channel_id:4,template_type:1
                };
                this.options = [];
                this.$http(api_all_templates,data).then(res=>{
                    this.options = res.data
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                })

            },
            /*----------------------end*/
            some_click(data){
                this.more = '';
                this.number = '';
                if (this.detail.length <= 0) {
                    this.$message({
                        message: '请选择要回复的信息',
                        type: 'warning'
                    });
                    return
                }
                let tmpData = {
                    id:this.detail[0].message_id||this.detail[0].id||this.detail[0].aliexpress_msg_relation_id,
                    order_id: this.detail[0].type_id,
                    code:data.template_id,
                    type:1
                };
                console.log(this.detail[0]);
                this.gettmpContent(tmpData)
            },
            change_temp(){
                if (this.detail.length <= 0) {
                    this.$message({
                        message: '请选择要回复的信息',
                        type: 'warning'
                    });
                    this.more = '';
                    return;
                }
                if (!this.more){
                    return;
                } else{
                    this.number = '';
                }
                let tmpData = {
                    id:this.detail[0].aliexpress_msg_relation_id||this.detail[0].message_id||this.detail[0].id,
                    code:this.more,
                    type:1
                };
                this.gettmpContent(tmpData)
            },
            blur_temp(){
                this.more = '';
                if (this.detail.length <= 0) {
                    this.$message({
                        message: '请选择要回复的信息',
                        type: 'warning'
                    });
                    this.number = '';
                    return;
                }
                if (this.number === ''){
                    return;
                }
                let tmpData = {
                    id:this.detail[0].aliexpress_msg_relation_id||this.detail[0].message_id||this.detail[0].id,
                    code:this.number,
                    type:2
                };
                this.gettmpContent(tmpData)
            },
            gettmpContent(tmpData){
                this.textarea = '';
                this.$http(api_tmpContent,tmpData).then(res=>{
                    this.textarea = res.content;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                })
            },
            get_priority(){
                let data = window.clone(this.searchData);
                this.$delete(data,'page');
                this.$delete(data,'pageSize');
                this.$http(api_levelStatistics,data).then(res=>{
                    this.priority = res;
                }).catch(code=>{this.$message({message:code.message||code,type:'error'});})
            },
            /*list列表*/
            listFun(){
                this.loading = true;
                this.list = [];
                this.detail = [];
                this.tableData = [];
                this.$http(api_smt_list,this.searchData).then(res=>{
                    this.loading = false;
                    this.list = res.data;
                    this.total = res.count;
                    this.list.forEach(data => {
                        this.$set(data,'isCheck',false);
                        this.$set(data,'show',true);
                        this.$set(data,'isHide',false);
                        this.$set(data,'isReplied',false);
                        this.$set(data,'page',1);
                        (data.msg_list&&data.msg_list.length > 0) && (data.msg_list.forEach(row=>{
                            this.$set(row,'isCheck',false);
                            row.content = this.$refs.emotionText.replaceImg(row.content);
                        }));
                    });
                    if(this.list[0]){
                        this.look_detail(this.list[0])
                    }
                }).catch(code=>{this.$message({message:code.message||code,type:'error'})})

            },
            msg_list_more(item,click='click'){
                if(click==='click'){
                    let find = this.list.find(row=>row.isReplied);
                    find&&(find.isHide = true);
                }
                let data = {
                    page:item.page,
                    pageSize:5,
                    id:item.id,
                    time:item.time,
                };
                this.$http(api_aliexpress_msg_more,data).then(res=>{
                    res.data.forEach(row=>{
                        row.content = this.$refs.emotionText.replaceImg(row.content);
                        item.msg_list.push(row);
                    });
                    if(res.count-5*item.page<0){
                        item.show = false;
                    }
                    item.page += 1;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    });
                });
            },
            /*获取优先级*/
            levelFun(){
                this.flagArr = [];
                this.$http(api_level).then(res=>{
                    this.flagArr = res
                }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
            },
            /*取消选中*/
            cancel_check(){
                this.list.forEach(row=>{
                    this.$set(row, "isCheck",false);
                    row.msg_list.forEach(x => {
                        this.$set(x, "isCheck",false)
                    });
                });
            },
            message_click(data){
                this.detail.forEach(row=>{
                    this.$set(row,'isCheck',false)
                });
                data.isCheck=true;
            },
            /*详情*/
            look_detail(data,click=''){
                if(click==='click'){
                    this.list.forEach(row=>{
                        if(row.isReplied&&!row.isHide){
                            row.isHide = true;
                            let find = this.accountList.find(item=>item.value===row.aliexpress_account_id);
                            let findAll = this.accountList.find(item=>item.value==='');
                            find&&find.count>0&&find.count--;
                            findAll&&findAll.count>0&&findAll.count--;
                            this.total--;
                            this.get_priority();
                        }
                    });
                }
                //清空回复模板信息
                this.more = '';
                this.number = '';
                this.textarea = '';
                this.init.length>0&&(this.$refs.imageUpload.remove(this.init));
                data.msg_list.forEach(row=>{
                    this.$set(row,'account',data.account);
                    this.$set(row,'channel_id',data.channel_id);
                    this.$set(row,'message_id',data.id)
                });
                this.$http(api_aliexpress_msg_list,data.id).then(res=>{
                    res.isCheck=true;
                    this.detail = res;
                    this.detail.length > 0 && (this.detail.forEach(row=>{
                        row.content = this.$refs.emotionText.replaceImg(row.content);
                    }))
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                });
                this.get_order(data);
                this.cancel_check();
                this.$set(data, "isCheck",true);
                /*更改站内信是否已读*/
                this.$http(api_read,data.id).then(res=>{
                    data.unread_count = 0;
                }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
            },
            get_order(data){
                /*关联订单*/
                this.tableData = [];
                this.$http(api_orders,data.aliexpress_msg_relation_id).then(res=>{
                    this.tableData = res;
                }).catch(code=>{this.$message({message:code.message||code,type:'error'})});
            },
            /*改变优先级*/
            change_level(item){
                this.$http(api_changelevel,item.id,item.rank).then(res=>{
                    this.$message({
                        type:'success',
                        message: `操作成功`
                    });
                    this.get_priority();
                }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
            },
            /*子邮件详情*/
            detail_(data,click='',item){
                if(click==='click'){
                    this.list.forEach(row=>{
                        if(row.isReplied&&!row.isHide){
                            row.isHide = true;
                            let find = this.accountList.find(item=>item.value===row.aliexpress_account_id);
                            let findAll = this.accountList.find(item=>item.value==='');
                            find&&find.count>0&&find.count--;
                            findAll&&findAll.count>0&&findAll.count--;
                            this.total--;
                            this.get_priority();
                        }
                    });
                }
                this.currentData = data;
                this.detail = [];
                this.$http(api_detail,data.id).then(res=>{
                    this.detail.push(res);
                    //清空回复模板信息
                    this.more = '';
                    this.number = '';
                    this.textarea = '';
                    this.$refs.imageUpload.remove(this.init);
                    //循环替换表情包
                    this.detail.length > 0 && (this.detail.forEach(row=>{
                        row.content = this.$refs.emotionText.replaceImg(row.content);
                    }))
                }).catch(code=>{this.$message({message:code.message||code,type:'error'})});
                this.get_order(item);
                this.cancel_check();
                this.$set(data, "isCheck",true)
            },
            /*回复*/
            reply(){
                let message = this.textarea;
                //---------------------------------------------------
                if (this.detail <= 0) {
                    this.$message({
                        message: '请选择回复的信息',
                        type: 'warning'
                    });
                    return
                }
                if (!this.textarea) {
                    this.$message({
                        message: '请输入回复的内容',
                        type: 'warning'
                    });
                    return
                }
                let data = {
                    content: this.$refs.emotionText.replaceFun(message),
                    channel_id:this.detail[0].channel_id,
                };
                if (this.init.length <= 0) {
                    data.img && (delete data.img)
                } else {
                    data.img = this.init[0].image
                }
                return this.$http(api_replay,data).then(res=>{
                    this.$message({
                        type:'success',
                        message: `回复成功!`
                    });
                    this.textarea = '';
                    //增加回复成功
                    let find=this.list.find(row=>{
                        return row.isCheck||row.msg_list.find(msg=>msg.isCheck)
                    });
                    find&&(find.isReplied = true);
                    this.look_detail(find);
                    return Promise.resolve();
                }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
            },
            /*忽略*/
            neglect(){
                if (this.detail.length <= 0) {
                    this.$message({
                        message: '请选择忽略的信息',
                        type: 'warning'
                    });
                    return
                }
                if (!this.detail[0].aliexpress_msg_relation_id) {
                    this.$message({
                        message: '请选择忽略的信息',
                        type: 'warning'
                    });
                    return
                }
                this.$confirm('您将忽略该邮件，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {
                        ids: this.detail[0].aliexpress_msg_relation_id,
                    };
                    this.$http(api_batchProcessed, data).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                        let find = this.list.find(row => {
                            return row.isCheck || row.msg_list.find(msg => msg.isCheck)
                        });
                        find && (find.isReplied = true);
                        // this.listFun();
                    }).catch(code => {
                        this.$message({message: code.message || code, type: 'error'})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消操作'
                    });
                });
            },
            neglect_all(){
                if (!this.list.find(row=>row.isCheck)) {
                    this.$message({
                        message: '请选择忽略的信息',
                        type: 'warning'
                    });
                } else {
                    let ids = [];
                    this.list.forEach(data=>{
                        if (data.isCheck) {
                            ids.push(data.id)
                        }
                    });
                    let data = {
                        ids:ids.join(',')
                    };
                    this.$http(api_batchProcessed,data).then(res=>{
                        this.$message({
                            type:'success',
                            message: res.message||res
                        });
                        this.listFun();
                    }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
                }
            },

            sizeChange(val){
                this.searchData.pageSize=val;
                this.listFun()
            },
            currentChange(page){
                this.searchData.page=page;
                this.listFun()
            },
            clear(){
                let data = window.clone(this.searchData);
                this.searchData.page = 1;
                this.searchData.pageSize = 50;
                this.searchData.filter_type = 'order_id';
                this.searchData.filter_text = '';
                this.searchData.customer_id = '';
                this.searchData.account_id = '';
                this.searchData.read = '';
                this.searchData.sort = 1;
                if (!this.showAll) {
                    this.searchData.account_id = data.account_id
                } else {
                    this.searchData.account_id = ''
                }
                this.listFun();
            },
            sort(){
                this.searchData.sort = this.searchData.sort === 1 ? 2 : 1;
                this.listFun();
            }
        },
        filters: {
            timeFilter(val){
                return datef('YYYY-MM-dd HH:mm:ss', val);
            }
        },
        watch: {
            param(val){
                this.listFun_();
            }
        },
        computed: {

        },
        props: {},
        components: {
            search,
            uiCollapse,
            imageUpload:require('./image-upload.vue').default,
            orderForm,
            emotionsTextarea:require('./emotions-textarea.vue').default,
            formMdf:require("../../dispute/aliexpress/form-mdf").default,
            requestButton:require('@/global-components/request-button').default,
            blowupImage:require('@/components/blowup-image').default
        }
    }
</script>
