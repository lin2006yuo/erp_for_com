<template>
    <page class="p-index">
        <!--搜索状态 start-->
        <el-card class="mb-xs">
            <label-buttons class="inline" label="生成状态：" :buttons="buildStatus" @select="select_status"></label-buttons>
            <label-buttons class="inline ml-xs" label="生成方式：" :buttons="buildType" @select="select_type"></label-buttons>
            <div>
                <span class="inline">筛选条件：</span>
                <el-input class="inline width-super" @keyup.enter.native="search_data" v-model="search" placeholder="请输入Invoice编号..."></el-input>
                <el-button class="inline ml-sm" type="primary" size="mini" @click.native="search_data">搜索</el-button>
                <el-button class="inline" size="mini" @click.native="clear_search">清空搜索</el-button>
            </div>
        </el-card>
        <!--搜索状态 end-->
        <!--批量删除-->
        <permission
                tag="requestButton"
                :route="apis.url_delete_invoices"
                class="ml-sm"
                :request="batch_delete">批量删除</permission>
        <!--table start-->
        <el-table
            class="scroll-bar mt-xs"
            :data="table.data"
            v-resize="{height:41}"
            highlight-current-row
            element-loading-text="玩命加载中..."
            v-loading="isLoading"
            @selection-change="selection_change"
        >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection" width="35px"></el-table-column>
            <el-table-column label="Invoice编号" inline-template>
                <div v-copy>
                    <ui-tip :content="row.invoice_code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="生成方式" inline-template width="120">
                <div v-copy>{{filterType(row.generate_type)}}</div>
            </el-table-column>
            <el-table-column label="操作人/规则名称" inline-template>
                <div v-copy>{{row.operator}}/{{row.rule_name}}</div>
            </el-table-column>
            <el-table-column label="订单号" inline-template>
                <div v-copy>
                    <ui-tip :content="row.order_number" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="创建时间" inline-template width="100">
                <times :time="row.create_time"></times>
            </el-table-column>
            <el-table-column label="状态" inline-template width="150">
                <div>{{row.generate_time | filterTime}}</div>
            </el-table-column>
            <el-table-column label="操作" inline-template width="120">
                <div>
                    <permission
                            tag="span"
                            :route="apis.url_look_invoices"
                            class="operate" @click="look_over(row)">查看</permission>
                    <permission
                            tag="span"
                            :route="apis.url_look_invoices">|</permission>
                    <permission
                            tag="span"
                            :route="apis.url_delete_invoices"
                            class="operate" @click="cur_delete(row.id,row)">删除</permission>
                </div>
            </el-table-column>
        </el-table>

        <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="current_change"
                :current-page="table.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="table.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="table.total">
        </el-pagination>
        <!--table end-->
        <!--编辑-->
        <edit-page v-model="editDialog" :order-id="orderId"
                   :invoice-code="invoiceCode" :data="editData"></edit-page>
    </page>
</template>
<style lang="stylus">

</style>
<script>
import {get_invoices,delete_invoices,look_invoices} from '../../../../api/invoice';
import {url_delete_invoices,url_look_invoices,} from '../../../../api/invoice';
    export default{
        permission:{
            url_delete_invoices,
            url_look_invoices,
        },
        page:{},
        refresh(){
            this.init();
        },
        data(){
            return {
                buildStatus:[
//                    {label:"未生成",value:0},
                    {label:"生成失败",value:4},
                    {label:"等待生成",value:1},
//                    {label:"生成中",value:2},
                    {label:"生成成功",value:3},

                ],
                buildType:[
                    {label:"全部",value:""},
                    {label:"手动生成",value:1},
                    {label:"invoice自动规则",value:0},
                ],
                table:{
                    data:[],
                    page:1,
                    pageSize:50,
                    total:0
                },
                isLoading:false,
                status:4,
                type:"",
                search:"",
                invoiceCode:"",
                ids:[],
                editDialog:false,
                orderId:"",
                editData:{
                    rule:{}
                },
                firstLoading:true,
            }
        },
        created(){
            this.init();
        },
        filters:{
            filterTime(val){
                if(val) return datef("YYYY-MM-dd HH:mm:ss",val);
            },
            filterStatus(val){
                switch(val){
                    case 0:
                        return "未生成";
                    case 1:
                        return "待生成";
                    case 2:
                        return "生成中";
                    case 3:
                        return "生成成功";
                    case 4:
                        return "生成失败";
                }
            }
        },
        methods:{
            init_status_btn(){
                let buildStatus = this.buildStatus;
                let buildType = this.buildType;
                this.buildStatus = [];
                this.buildType = [];
                this.$nextTick(()=>{
                    this.buildStatus = buildStatus;
                    this.buildType = buildType;
                })
            },
            init(){
                this.ids = [];
                let params = {
                    page:this.table.page,
                    pageSize:this.table.pageSize,
                    status:this.status,
                    search:this.search.trim(),
                    type:this.type
                };
                this.isLoading = true;
                this.$http(get_invoices,params).then(res=>{
                    this.isLoading = false;
                    this.table.data = res.data;
                    this.table.total = res.count;
                    this.firstLoading = false;
                }).catch(code=>{
                    setTimeOut(()=>{
                        this.isLoading = false;
                    });
                    console.log(code);
                })
            },
            select_status(val){
                this.status = this.buildStatus[val].value;
                this.init();
            },
            select_type(val){
                this.type = this.buildType[val].value;
                this.init();
            },
            filterType(val){
                return val?'手动生成':'自动生成';
            },
            search_data(){
                this.init();
            },
            clear_search(){
                this.search = "";
                this.init();
            },
            batch_delete(){
                if(this.ids.length<=0) return this.$message({type: "warning", message: "请选择要删除的数据"})
                return this.delete_invoices(this.ids,false,this.ids);
            },
            // table  查看
            look_over(row){
                this.orderId = row.order_id;
                this.invoiceCode = row.invoice_code;
                this.editDialog = true;
                this.$http(look_invoices,row.id).then(res=>{
                    if(res.rule instanceof Array){
                        this.editData = res;
                        this.editData.rule = {};
                    }else{
                        this.editData = res;
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            //table 删除
            cur_delete(id,row){
                let curId = [];
                curId.push(id);
                this.delete_invoices(curId,true,row);
            },
            //table  多选
            selection_change(val){
                this.ids = [];
                val.forEach((row)=>{
                    this.ids.push(row.id);
                })
            },
            //翻页
            size_change(size){
                this.table.pageSize = size;
                this.init();
            },
            current_change(page){
//                console.log("this.table.page",this.table.page);
                this.table.page = page;
                console.log(page);
                this.init();
            },
            //删除   API
            delete_invoices(val,bool,datas){
                return this.$confirm(`您将删除${bool?'该单行':'所有选中'}数据，确认此操作吗?`,'提示',{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:"warning"
                }).then(()=>{
                    return this.$http(delete_invoices,{ids:val}).then(res=>{
                        this.$message({type: "success", message: res.message || res});
                        if(datas instanceof Array){
                            datas.forEach(row=>{
                                let index=this.table.data.indexOfFun(row,function (old,row) {
                                    return old.id===row
                                });
                                this.table.data.splice(index,1);
                                this.$set(this.table,'total',this.table.total-1);
                            })
                        } else if(datas instanceof Object){
                            let i = this.table.data.indexOfFun(datas,function (old,datas) {
                                return old.id===datas.id
                            });
                            this.table.data.splice(i,1);
                            this.$set(this.table,'total',this.table.total-1);
                        }
                        return Promise.resolve()
                    }).catch(code=>{
                        this.$message({type: "error", message: code.message || code})
                    })
                }).catch(()=>{
                    this.$message({type: "info", message:"已取消"})
                })
            },
        },
        computed:{
            emptyText() {
                return this.firstLoading?'请查询数据':'暂无数据'
            },
        },
        components: {
            labelButtons:require('../../../../components/label-buttons.vue').default,
            editPage:require('./edit-page.vue').default,
            uiTip:require('../../../../components/ui-tip.vue').default,
            requestButton:require('../../../../global-components/request-button').default
        }
    }
</script>
