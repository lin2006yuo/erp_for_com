<template>
    <page class="amazon-p-index-outbox">
        <search ref="search" :searchData="searchData" @reflash="reflash" @clear="clear"></search>
        <el-row :gutter="8" class="mt-sm">
            <el-col :span="10">
                <el-card>
                <div class="sort">
                    <span >排序方式: </span>
                    <span @click="first_time">{{isFirst?'最早时间':'最晚时间 '}}
                        <i :class="[isFirst?'el-icon-caret-bottom':'el-icon-caret-top']"></i></span>
                </div>
                    <div v-loading="loading" element-loading-text="玩命加载中...">
                    <div class="collapse" v-if="list.length===0" style="text-align: center;line-height: 40px">暂无数据</div>
                    <ul class="collapse" v-if="list.length" >
                        <li v-for="message in list" :key="message.id" class="mb-xs" :class="{active: message.isActive}" style="cursor: pointer;" @click="look_detail(message)">
                            <el-card>
                            <el-row class="mb-sm">
                                <i class="el-icon-message" style="color:#F8D892"></i>
                                <div class="inline">{{message.sender}}</div>
                                <span>→</span>
                                <span>{{message.receiver}}</span>
                                <span class="fr ml-sm">{{message.create_time|fmsdatetime}}</span>
                                <span v-if="message.status===0" class="fr" style="color:red">待发送</span>
                                <span v-if="message.status===2" class="fr" style="color:red">发送失败</span>
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
                            :data="tableData"
                            style="width: 100%">
                        <el-table-column
                                label="订单号"
                                inline-template  show-overflow-tooltip>
                            <div>
                                <i style="color:green"  v-if="!!row.trade" class="el-icon-caret-right"></i>
                                <span @click="lookOver(row)"class="operate">{{row.order_number}}</span>
                            </div>
                        </el-table-column>
                        <el-table-column
                                prop="country_code"
                                label="国家"
                                show-overflow-tooltip
                        >
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
                <el-card class="rightCard">
                    <el-card  v-if="detail.id">
                        <div>
                            <div style=" background:rgba(173,227,255,.5);padding: 5px;border-radius: 5px" >
                            <div><span  class="seller">卖</span>{{detail.subject}}</div>
                            <div>

                                <span v-if="detail.sender"   style="color:#3300FF">{{detail.sender}}→:{{detail.receiver}}</span>
                                <span class="fr"> {{detail.create_time|fmsdatetime}}</span>
                            </div>
                            <div v-if="!!detail.id&&detail.status===2" style="height:26px">
                                <permission tag="ElButton"
                                            :route="apis.url_amazon_resend"
                                            size="mini" @click="resend" type="primary"
                                            class="fr ml-xs">重新发送</permission>
                            </div>
                            </div>
                            <div class="max-heigh">{{detail.body}}</div>
                        </div>
                    </el-card>
                    <span v-else>暂无数据</span>
                </el-card>
            </el-col>
        </el-row>

    </page>
</template>
<style lang="stylus">
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
    .amazon-p-index-outbox{
        .sort{
        display: flex;
            background-color: #E3ECF7;
            span{
                flex: 1;
                text-align: center;
                border: 1px solid #E5E9F2;
                line-height: 26px;
                cursor: pointer;
            }
        }
        .collapse{
            height: 450px;
            overflow-x: hidden;
            overflow-y: auto;
            .mb-xs{
                .el-card{
                    background: none;
                }
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
            .max-heigh{
              max-height: 400px;
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
    import {api_amazon_send_list,api_get_table,api_amazon_resend,url_amazon_resend} from "../../../../api/letter-amazon"
    export default{
        permission:{
            url_amazon_resend
        },
      page:{},
      refresh(){
        this.init();
      },
        data(){
            return{
                mdfTitle:"",
                mdfid:0,
                loading:true,
                tableData:[],
                searchData:{
                    pageSize:50,
                    page:1,
                    status:0,
                    account_code:'',
                    option_field:'receiver_email',
                    option_value:'',
                    time_sort:'DESC'
                },
                total:0,
                more:"",
                number:"",
                emial:false,
                isFirst:true,
                isOld:true,
                textarea:"",
                list:[],
                detail:{},
                orderVisable:false,
            }
        },
        created(){
        },
        mounted(){
        },
        computed:{
        },
        methods:{
            sizeChange(val){
                this.searchData.pageSize=val;
                this.init();
            },
            currentChange(val){
                this.searchData.page=val;
                this.init();
            },
            first_time(){
                this.isFirst=!this.isFirst;
                if(this.isFirst){
                    this.searchData.time_sort='DESC'
                }else{
                    this.searchData.time_sort='ASC'
                }
                this.init();
            },
            init(){
                let data=window.clone(this.searchData);
                this.loading=true;
                this.$http(api_amazon_send_list,data).then(res=>{
                    this.list=res.data||[];
                    this.total=res.count;
                    this.loading=false;
                    if(this.list[0]){
                      this.look_detail(this.list[0])
                    } else {
                        this.detail.id = 0
                    }
                })
            },
            reflash(){
                this.init()
            },
            look_detail(item){
                this.detail=item;
                this.tableData=[];
                this.$http(api_get_table,item.buyer_id).then(res=>{
                    this.tableData=res.data;
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
                this.list.forEach(row => {
                  this.$delete(row, "isActive")
                })
                this.$set(item, "isActive", true)
            },
            resend(){
                this.$http(api_amazon_resend,this.detail.id).then(res=>{
                    this.$message({type: "success", message: res.message || res});
                    this.init();
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
            },
            del_message(){

            },
            clear(){
                let data=window.clone(this.searchData)
                this.searchData={
                    pageSize:50,
                    page:1,
                    status:0,
                    account_code:'',
                    option_field:'receiver_email',
                    option_value:'',
                    time_sort:'DESC'
                };
                this.searchData.send_state=data.send_state;
                this.init();
            },
            lookOver(row){
                this.mdfid =row.id;
                this.$refs.formmfd.require_server(this.mdfid);
                this.mdfTitle = `查看订单号: ${row.id} 信息`;
                this.orderVisable = true;
            },

        },
        filters:{
        },
        watch:{
        },
        props:{

        },
        components:{
            search,
            uiCollapse,
            formMdf:require("../../../order/local/form-mdf.vue").default
        }
    }
</script>
