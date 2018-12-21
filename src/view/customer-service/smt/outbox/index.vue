<template>
    <page class="smt-outbox">
        <search ref="search" :search-data="searchData" @refresh="refresh" @clear="clear" class="mb-sm"></search>
        <el-row :gutter="8">
            <el-col :span="10">
                <el-card>
                    <div class="sort">
                        <span>排序方式: 时间</span>
                        <span class="fr" style=" text-align: right;" @click="sort">{{this.searchData.sort==1?'由新到旧':'由旧到新'}}
                        <i class="el-icon-caret-bottom"></i></span>
                    </div>
                    <div class="collapse" v-loading="loading" element-loading-text="拼命加载中">
                        <div v-if="list.length<=0" style="text-align: center;margin-top: 240px;">暂无数据</div>
                        <ul class="collapse">
                            <li v-for="message in list " :key="message.id" class="list" :class="{active: message.isActive}" style="cursor: pointer;" @click="look_detail(message)">
                                <el-row class="mb-sm">
                                    <i class="el-icon-message" style="color:#F8D892"></i>
                                    <div class="inline">{{message.account}}</div>
                                    <span>→</span>
                                    <span>{{message.buyer_name}}</span>
                                    <span class="fr ml-sm">{{message.update_time|timeFilter}}</span>

                                    <span v-if="message.status=='发送失败'" class="fr" style="color:red">发送失败</span>
                                </el-row>
                                <div style="padding-left:20px" v-html="message.content"> </div>
                            </li>
                        </ul>
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
                    <el-table :data="tableData" style="width: 100%">
                        <el-table-column label="订单号" inline-template show-overflow-tooltip>
                            <div>
                                <i v-if="row.is_current === 1" style="color:green" class="el-icon-caret-right"></i>
                                <span @click="look(row,'look')" class="operate">{{row.order_no}}</span>
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
                                    @click="look(row,'show')">有</permission>
                                <span v-else>无</span>
                            </div>
                        </el-table-column>
                        <el-table-column prop="" label="退货"></el-table-column>
                    </el-table>
                </div>
            </el-col>
            <el-col :span="14">
                <el-card class="rightCard">
                    <div v-if="detail.length===0">暂无数据</div>
                    <el-card v-for="data in detail" :key="data.account" class="mb-xs">
                        <el-row>
                            <div class="inline" style="color:#3300FF">{{data.account}}</div>
                            <img src="../../../../assets/arrows.gif" width="20px" height="20px" style="vertical-align: middle;">
                            <div class="inline" style="color:#3300FF">{{data.buyer_name}}</div>
                            <div class="inline fr">{{data.update_time|timeFilter}}</div>
                        </el-row>
                      <div class="fr">
                        <permission tag="ElButton" :route="apis.url_outbox_resend" type="primary" size="mini" v-if="data.status===0" @click="resend(data)">重新发送</permission>
                        <permission tag="ElButton" :route="apis.url_outbox_del" type="primary" size="mini" @click="del(data)">删除</permission>
                      </div>
                      <div style="clear: both;">
                            <div v-html="data.content"></div>
                            <el-popover
                                    placement="bottom-start"
                                    trigger="hover" v-if="data.img_path">
                                <img :src="data.img_path" width="900" height="500">
                                <span slot="reference">
                                    <img :src="data.img_path" width="50px" height="26px" style="cursor: -webkit-zoom-in;">
                                </span>
                            </el-popover>
                        </div>
                    </el-card>
                </el-card>
                <!--<el-card style="margin-top:5px;height:200px">
                </el-card>-->
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
    </page>
</template>
<style lang="stylus">
    .smt-outbox{
        .sort{
            display: flex;
            background-color: #E3ECF7;
            span{
                flex: 1;
                border: 1px solid #E5E9F2;
                line-height: 26px;
                cursor: pointer;
                padding: 0 5px;
            }
        }
        .collapse{
            height: 450px;
            overflow: auto;
            .list{
                border: 1px solid #E3ECF7;
                border-top: none;
                padding: 5px;
                &.active{
                    background: rgba(173,227,255,.5);
                }
                &:hover{
                    background: #d0e5cb;
                }
            }
        }
        .history{
            .el-table__body-wrapper{
                min-height: 130px;
            }
        }
        .rightCard{
            height: 725px;
            overflow: auto;
        }
    }
</style>
<script>
    import search from "./search.vue"
    import {api_outbox_list,api_outbox_detail,api_outbox_resend,api_outbox_del,api_orders} from '../../../../api/smt-mail'
    import {url_outbox_resend,url_outbox_del} from '../../../../api/smt-mail'
    export default{
        permission:{
            url_outbox_resend,
            url_outbox_del
        },
        page:{},
        refresh(){
          this.init();
        },
        data(){
            return {
                searchData:{
                    page:1,
                    pageSize:50,
                    filter_type:'order_id',
                    filter_text:'',
                    customer_id:'',
                    status:1,
                    sort:1
                },
                total:0,
                list:[],
                tableData:[],
                detail:[],
                loading:true,
                mdfValue:false,
                mdfid:0,
                order_id:0,
                isEdit:{edit:false},
                mdfTitle:"",
                btnShow:false,
                //---------------------QQ表情
                emotions: require('../../../../lib/emotions').default,
                isInboxOpen:false,
                orderVisable:false,
                showIssue:false,
                dispute_data:{},
                isEditIssue:false
            }
        },
        created(){
        },
        mounted(){
            this.init()
        },
        methods: {
            //循环替换表情符为img
            replaceImg(str){
                //定义对应关系
                let obj = {};
                this.filterLists.forEach(data=>{
                    obj[data.alt] = data.url;
                });
                //循环替换
                for (let key in obj) {
                    let reg = new RegExp(key,'g');
                    str = str.replace(reg,'<img src="'+obj[key]+'" />');
                }
                return str;
            },
            init(){
                this.list = [];
                this.loading=true;
                this.$http(api_outbox_list,this.searchData).then(res=>{
                    this.list = res.data;
                    this.loading=false;
                    this.total = res.count
                    if (this.list[0]) {
                      this.look_detail(this.list[0])
                    } else {
                      this.detail.id = 0
                    }
                    this.list.length > 0 && (this.list.forEach(row=>{
                        row.content = this.replaceImg(row.content);
                    }))
                }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
            },
            look_detail(data){
                this.detail = [];
                this.$http(api_outbox_detail,data.id).then(res=>{
                    if (!this.detail.length){
                        this.detail.push(res);
                    }
                    this.detail.length > 0 && (this.detail.forEach(row=>{
                        row.content = this.replaceImg(row.content);
                    }))
                    this.list.forEach(row => {
                        this.$delete(row, "isActive")
                    })
                    this.$set(data, "isActive", true)
                }).catch(code=>{this.$message({message:code.message||code,type:'error'})});
                this.get_order(data);
            },
            get_order(data){
                /*关联订单*/
                this.tableData = [];
                this.$http(api_orders,data.aliexpress_msg_relation_id).then(res=>{
                    this.tableData = res;
                }).catch(code=>{this.$message({message:code.message||code,type:'error'})})},
            look(row,type) {
                this.mdfid = row.id;
                this.$refs.formmfd.require_server(this.mdfid);
                if(type==='look'){
                    this.mdfTitle = `查看订单号：${row.order_no} 信息`;
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
            sizeChange(size){
                this.searchData.pageSize = size;
                this.init();
            },
            currentChange(page){
                this.searchData.page = page;
                this.init();
            },
            refresh(){
                this.init();
            },
            clear(){
                this.searchData.page = 1;
                this.searchData.pageSize = 50;
                this.searchData.filter_type = '';
                this.searchData.filter_text = '';
                this.searchData.sort = 1;
                this.searchData.customer_id = '';
                this.init();
            },
            sort(){
                this.searchData.sort = this.searchData.sort === 1 ? 2 : 1;
                this.init()
            },
            resend(data){
                this.$confirm('此操作将重发该邮件, 确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_outbox_resend,data.id).then(res=>{
                        this.$message({
                            type: 'success',
                            message: res.message
                        });
                        this.init()
                    }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'cancel operation'
                    });
                });
            },
            del(data){
                console.log(data);
                this.$confirm('您将删除该邮件, 确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_outbox_del,data.id).then(res=>{
                        this.$message({
                            type: 'success',
                            message: res.message
                        });
                        this.init();
                    }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: `已取消删除!`
                    });
                });
            }
        },
        filters: {
            timeFilter(val){
                return datef('YYYY-MM-dd HH:mm:ss', val);
            }
        },
        watch: {},
        computed: {
            filterLists(){
                let tampArr = [];
                this.emotions.forEach(row=>{
                    row.forEach(data=>{
                        tampArr.push(data);
                    })
                });
                return tampArr;

            },
        },
        props: {},
        components: {
            search,
            formMdf:require("../../dispute/aliexpress/form-mdf").default,
        }
    }
</script>
