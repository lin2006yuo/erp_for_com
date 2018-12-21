<template>
    <page class="ebay-estimate-index">
        <search-list :form="list" :status="statistics" @refresh="init()" @clear="clear" ref="search"></search-list>
        <div class="ml-sm" v-if="list.status===1">
            <permission tag="ElButton" :route="apis.url_batch_comment" type="primary" size="mini" @click="batch_review">批量回评</permission>
            <permission tag="ElButton" :route="apis.url_batch_comment" type="primary" size="mini" @click="all_review">回评所有</permission>
        </div>
        <el-table
                class="mt-xs scroll-bar"
                v-resize="{height:41}"
                :data="tableList"
                border
                v-loading="isLoading"
                highlight-current-row
                element-loading-text="拼命加载中"
                @selection-change="selection_change">
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column label="销售号/买家账号" inline-template>
                <div>
                    <ui-tip :content="`${row.order_number}/${row.comment_buyer}`" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="付款日期" inline-template show-overflow-tooltip>
                <div>
                    {{row.pay_time}}
                   <!-- <times :time="row.pay_time"></times>-->
                </div>
            </el-table-column>
            <el-table-column label="买家评价" inline-template show-overflow-tooltip>
                <div class="line-tr t-left">
                    <img src="../../../assets/good.png" v-if="row.comment_type==1" title="好评">
                    <img src="../../../assets/centre.png" v-else-if="row.comment_type==2" title="中评">
                    <img src="../../../assets/bad.png" v-else-if="row.comment_type==3" title="差评">
                    <img src="../../../assets/stay.png" v-else title="等待买家评价">
                    <div class="inline line-td">
                        <div>{{row.comment_time_buyer}}</div>
                        <div>
                            <ui-tip :content="row.comment_text_buyer" :width="98"></ui-tip>
                        </div>
                    </div>
                </div>
            </el-table-column>
            <el-table-column label="我的评价" inline-template show-overflow-tooltip>
                <div class="line-tr t-left">
                    <img src="../../../assets/wait.png" v-if="row.comment_text_seller===''">
                    <img src="../../../assets/yet.png" v-else>
                    <div class="inline line-td">
                        <div v-if="row.status===1">发送成功</div>
                        <div v-if="row.status===2">回评中</div>
                        <div v-if="row.status===3" style="color:red">发送失败</div>
                        <div>
                            <!--<ui-tip :content="row.comment_text_seller" :width="98"></ui-tip>-->
                            {{row.comment_text_seller}}
                        </div>
                    </div>
                </div>
            </el-table-column>
            <el-table-column label="退款" inline-template width="50px">
                <div>{{row.is_refund}}</div>
            </el-table-column>
            <el-table-column label="补发货" inline-template width="70px">
                <div>{{row.is_reissue}}</div>
            </el-table-column>
            <el-table-column label="退货" inline-template width="50px">
                <div>{{row.is_return}}</div>
            </el-table-column>
            <el-table-column
                    label="处理状态"
                    inline-template>
                <div>
                    <div v-if="row.handel_time">{{row.handel_time}}</div>
                    <div v-else>{{row. handel_status_str}}</div>
                </div>
            </el-table-column>
            <el-table-column label="操作" inline-template>
                <div >
                    <div v-if="row.order_number" style="width: 85%;text-align: right;">
                        <permission tag="span" :route="apis.url_ebay_check" class="operate" @click="check(row)">查看</permission>
                        <permission tag="span" :route="apis.url_ebay_edit" v-if="row.status === 0" class="operate" @click="evaluate(row)"><font color="#1f2d3d">&nbsp;|&nbsp;</font>回评</permission>
                        <permission tag="span" :route="apis.url_respond" v-if="row.response_status !== 2" class="operate" @click="add_evaluate(row)"><font color="#1f2d3d">&nbsp;|&nbsp;</font>追加评价</permission>
                        <permission tag="span" :route="apis.url_repeat" v-if="row.status === 3" class="operate" @click="again_evaluate(row)"><font color="#1f2d3d">&nbsp;|&nbsp;</font>重新回评</permission>
                        <span v-if="row.handel_status === 1">&nbsp;|&nbsp;</span>
                        <permission tag="span" :route="apis.url_sendMsg" v-if="row.handel_status === 1" class="operate" @click="follow(row)">跟进</permission>
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
        <review-evaluate v-model="reviewDialog" :edit-data="editData" :dialog-data="dialogData" :show-add="showAdd" :selected_id="selected_id" @change-data="change_data"></review-evaluate>
        <check-evaluate v-model="checkDialog" :reply-loading="replyLoading" :title="title" :check-data="checkData" :is-show="isShow" :check-id="checkId"></check-evaluate>
    </page>
</template>
<style lang="stylus">
    .ebay-estimate-index{
        .el-table .cell{
            line-height: normal;
        }
        .line-tr{
            display: flex;
            align-items: center;
            .line-td{
                line-height: 14px;
                padding: 3px;
            }
        }
    }
</style>
<script>
    import {
        api_get_list,
        api_ebay_check,
        api_ebay_edit,
        api_repeat,

        url_batch_comment,
        url_ebay_check,
        url_ebay_edit,
        url_respond,
        url_repeat,
        url_sendMsg
    } from '../../../api/eBay-estimate'

    export default{
        permission:{
            url_batch_comment,
            url_ebay_check,
            url_ebay_edit,
            url_respond,
            url_repeat,
            url_sendMsg
        },
        page:{},
        refresh(){
            this.init();
        },
        data(){
            return {
                list:{
                    page:1,
                    pageSize:50,
                    status:'',
                    comment_type:'',
                    handel_status:'',
                    customer_id:'',
                    search_key:'item_id',
                    search_val:'',
                    date_b: (Date.now() - (14 * 24 * 60 * 60 * 1000)),
                    date_e: Date.now(),
                },

                tableList:[],
                statistics:[],
                total:0,
                isLoading:true,
                checkDialog:false,
                isShow:false,
                checkData:{
                    feedback:{},
                    source_address:{},
                    package_list:[],
                    detail_goods:[]
                },
                reviewDialog:false,
                editData:{
                    transaction_id:0
                },
                showAdd:false,
                dialogData:{
                    titleName:'',
                    labelName:'',
                },
                selected_id:[],
                checkId:0,
                title:'',
                replyLoading:false
            }
        },
        created(){

        },
        mounted(){
            this.init();
        },
        methods: {

            //获取列表数据
            init(){
                this.isLoading = true;
                this.tableList = [];
                this.$http(api_get_list,this.params()).then(res=>{
                    this.tableList = res.data;
                    this.total = res.count;
                    this.statistics = res.statistics;//获取回评状态数据
                    let sum = 0;
                    this.statistics.forEach(data=>{
                          sum += data.count;
                    })
                     this.statistics.unshift({id:'',name:'全部',count:sum});
                    this.isLoading = false;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            //获取列表数据传入的参数
            params(){
                let data = window.clone(this.list);
                if (this.list.date_b) {
                    var d = new Date(this.list.date_b);
                    data.date_b = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
                } else {
                    data.date_b = ''
                }
                if (this.list.date_e) {
                    var e = new Date(this.list.date_e);
                    data.date_e = e.getFullYear() + '-' + (e.getMonth() + 1) + '-' + e.getDate()
                } else {
                    data.date_e=''
                }
                return data;
            },
            check(row){//---------查看
                this.title = `查看买家：${row.comment_buyer}评价`;
                this.isShow = false;
                this.checkFun(row);
            },
            follow(row){//----------跟进
                this.title = `跟进买家：${row.comment_buyer}评价`;
                this.checkId = row.id;
                this.isShow = true;
                this.checkFun(row);
            },
            checkFun(row){
                this.replyLoading = true;
                this.$http(api_ebay_check,row.id).then(res=>{
                    this.checkDialog = true;
                    this.$set(res,'id',row.id);
                    this.checkData = res;
                    this.checkData.feedback.messageLists&&this.checkData.feedback.messageLists.forEach(row => {
                        this.$set(row, 'isCheck', false)
                    });
                    this.replyLoading = false;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            change_data(val){
                let timestamp = Date.parse(new Date());
                timestamp = datef("YYYY-MM-dd HH:mm:ss", timestamp / 1000);
                if(val instanceof Array){
                    val.forEach(row=>{
                        let find= this.tableList.find(inner=>{
                            return inner.id===row.id;
                        });
                        if(!!find){
                            find.comment_text_seller = row.text;
                            find.comment_time_seller = timestamp;
                            find.status=1;
                            Object.assign(find,row);
                        }
                    });
                }else{
                	if(val.ids==="all"){
                        this.tableList.forEach(row=>{
                            find.comment_text_seller = row.text;
                            find.comment_time_seller = timestamp;
                            find.status=1;
                        })
                    }else{
                		let arr = val.ids.split(",");
                		arr.forEach(row=>{
                            let find= this.tableList.find(inner=>{
                                return inner.id===parseInt(row);
                            });
                            if(!!find){
                                find.comment_text_seller = row.text;
                                find.comment_time_seller = timestamp;
                                find.status=1;
                            }
                        })
                    }
                }


            },
//            回评
            evaluate(row){
                this.reviewData();
                this.reviewFun(row);
                this.selected_id = [];
                this.selected_id.push(row.id)
            },
//            追加评价
            add_evaluate(row){
                this.reviewDialog = true;
                this.showAdd = false;
                this.dialogData.titleName = `给买家：${row.comment_buyer}追评`;
                this.dialogData.labelName = '追加内容：';
                this.selected_id = [];
                this.selected_id.push(row.id)
            },
//            批量回评
            batch_review(){
                if(this.selected_id.length <= 0){
                    this.$message({
                        message: '请选择要批量回评的数据！',
                        type: 'warning'
                    });
                    return;
                }
                this.reviewData();
                this.editData.transaction_id = 0;
            },
//            回评所有
            all_review(){
                this.reviewData();
                this.editData.transaction_id = 0;
            },
            //重新回评
            again_evaluate(row){
                this.$confirm('您将对买家账号为：'+row.comment_buyer+'进行重新回评，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false
                }).then(() => {
                    let id = {
                        id:row.id
                    };
                    this.$http(api_repeat,id).then(res=>{
                        this.$message({
                            type: 'success',
                            message: res.message||res
                        });
                        this.init();
                    }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            reviewFun(row){
                this.$http(api_ebay_edit,row.id).then(res=>{
                    this.editData.transaction_id = res.transaction_id;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            //回评需要统一修改的
            reviewData(){
                this.reviewDialog = true;
                this.showAdd = true;
                this.dialogData.titleName = '给买家留评价';
                this.dialogData.labelName = '评价内容：';
            },
            //table选中的数据
            selection_change(val){
                this.selected_id = val.map(row=>{
                    return row.id
                });
            },
            //分页
            size_change(size){
                this.list.pageSize = size;
                this.init()
            },
            current_change(page){
                this.list.page = page;
                this.init()
            },
            //清空搜索
            clear(){
                this.list.customer_id = '';
                this.list.search_val = '';
                this.list.date_b = (Date.now() - (14 * 24 * 60 * 60 * 1000));
                this.list.date_e = Date.now();
                this.init();
            }
        },
        filters: {},
        watch: {},
        computed: {},
        props: {},
        components: {
            searchList:require('./search-list.vue').default,
            times:require('../../../components/times.vue').default,
            uiTips:require('../../../components/ui-tips.vue').default,
            checkEvaluate:require('./check-evaluate.vue').default,
            reviewEvaluate:require('./review-evaluate.vue').default,
            uiTip:require('../../../components/ui-tip.vue').default
        }
    }
</script>
