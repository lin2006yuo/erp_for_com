<template>
    <page class="p-index-inbox">
        <search :searchData="searchData" @reflash="reflash" @clear="clear"  class="mb-md"></search>
        <el-row :gutter="8">
            <el-col :span="10">
                <div  style="position:relative;border: 1px solid #D3ECE6;padding:4px 8px;border-radius: 3px">
                <div class="sort" >
                    <span>排序方式: </span>
                    <span @click="old_new" class="sortNew"> {{isOld?'由新到旧':'由旧到新'}}
                        <i :class="[isOld?'el-icon-caret-bottom':'el-icon-caret-top',]"></i>
                    </span>
                </div>
                    <div v-loading="loading" element-loading-text="玩命加载中..." v-resize="{height:50}" style="overflow-y: auto;width: 100%">
                    <div  v-if="tableData.length===0" style="text-align: center;line-height: 450px">暂无数据</div>
                    <ul v-if="tableData.length>0"  style="height: 95%;width: 100%;overflow: auto">
                        <li v-for="message in tableData "  :key="message.id"
                            class="mb-xs" style="cursor: pointer;" @click="look_detail(message.id)">
                            <el-card>
                            <el-row class="mb-sm">
                                <i class="el-icon-message" style="color:#F8D892"></i>
                                <div class="inline">{{message.sender}}</div>
                                <i class="fr mr-sm" style="font-style:normal">{{message.receive_date}}</i>
                            </el-row>
                            <div style="padding-left:50px"> {{message.subject}}</div>
                            </el-card>
                        </li>
                    </ul>
                    </div>
                    <div class="mt-xs pagination " style="height:30px;display: flex;justify-content: flex-end">
                        <el-pagination
                                @size-change="sizeChange"
                                @current-change="currentChange"
                                :current-page="searchData.page"
                                :page-sizes="[20, 50, 100, 200,500]"
                                :page-size="searchData.pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="total">
                        </el-pagination>
                    </div>
                </div>
            </el-col>
            <el-col :span="14">
                <el-card class="right-card-reset" v-resize="{height:50}">
                    <el-card v-if="detail.id" v-resize="{height:60}" style="overflow: hidden;">
                        <div>
                            <div style=" background:rgba(173,227,255,.5);padding: 5px;border-radius: 5px" >
                            <div>{{detail.subject}}</div>
                            <div>
                                <span v-if="detail.sender" style="color:#3300FF">{{detail.sender}}→:{{detail.send_to_name}}</span>
                                <span class="fr">{{detail.receive_date}}</span>
                            </div>
                            </div>
                            <div class="max-heigh">
                                <iframe style="width:100%;" v-resize="{height:70}" :srcdoc="detail.text"></iframe>
                            </div>
                        </div>
                    </el-card>
                    <span v-else>暂无数据</span>
                </el-card>
            </el-col>
        </el-row>
    </page>
</template>
<style lang="stylus">
    .p-index-inbox{
        .sort{
            background-color: #E3ECF7;
            span{
                text-align: center;
                border: 1px solid #E5E9F2;
                line-height: 26px;
                cursor: pointer;
            }
            .sortNew{
                float: right;
            }

        }
        .card-left{
            .el-card__body{
                height: 98%!important;
                padding: 2px;
            }

        }


        .pagination{
            position: absolute;
            bottom: 0;
            right: 0;
        }
        .right-card-reset{
            height: 600px;
            .max-heigh{
                max-height: 800px;
                width: 100%;
                overflow-y: auto;
                overflow-x: hidden;
            }
        }
    }
</style>
<script>
import search from "./search.vue"
import uiCollapse from "../../../../components/ui-collapse.vue"
import {api_ebay_message_detail,api_ebay_list} from "../../../../api/inbox"
    export default{
        page:{},
        refresh(){
          this.init();
        },
        data(){
            return{
                loading:true,
                searchData:{
                    pageSize:50,
                    page:1,
                    time_sort:0,
                    customer_id:"",
                    keyword:"",
                    type:1,
                    account_id:"",
                    receive_date_b: (Date.now()-(30*24*60*60*1000)),
                    receive_date_e: Date.now(),
                },
                total:0,
                tableData:[],
                options:[
                    {label:"更多",value:0},
                    {label:"A",value:1},
                    {label:"B",value:2},
                ],
                more:"",
                number:"",
                emial:false,
                isFirst:true,
                isOld:true,
                textarea:"",
                detail:{}
            }
        },
        created(){

        },
        mounted(){
            this.init()
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
            old_new(){
                this.isOld=!this.isOld
                if(this.isOld){
                    this.searchData.time_sort=1
                }else{
                    this.searchData.time_sort=0
                }
                this.init();
            },
            reflash(){
                this.init()
            },
            init(){
                this.tableData=[];
                let data=window.clone(this.searchData);
                if(this.searchData.receive_date_b){
                    data.receive_date_b=datef("YYYY-MM-dd",this.searchData.receive_date_b/1000)
                }else {
                    data.receive_date_b=""
                }
                if(this.searchData.receive_date_e){
                    data.receive_date_e=datef("YYYY-MM-dd",this.searchData.receive_date_e/1000)
                }else {
                    data.receive_date_e=""
                }
                this.loading=true;
                this.$http(api_ebay_list,data).then(res=>{
                        this.tableData=res.data;
                        this.total=res.count;
                    this.loading=false;
                }).catch(code=>{
                    console.log(code)
                })

            },
            look_detail(id){
                this.detail={};
                this.$http(api_ebay_message_detail,id).then(res=>{
                    this.detail=res;
                }).catch(code=>{
                    console.log(code)
                })

            },
            clear(){
                this.searchData={
                    pageSize:50,
                    page:1,
                    time_sort:0,
                    customer_id:"",
                    account_id:"",
                    keyword:"",
                    type:1,
                    receive_date_b:"",
                    receive_date_e:"",
                };
                this.init()
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
            uiCollapse
        }
    }
</script>
