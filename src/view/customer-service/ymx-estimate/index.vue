<template>
    <page class="p-index">
        <div>
            <card-search
                    :form="form"
                    ref="search"
                    :dispose-list="disposeList"
                    @select-evaluate="select_evaluate"
                    @select-dispose="select_dispose"
                    @buyer-reply="buyer_reply"
                    @search="search"
                    @clear-search="clear_search"
            ></card-search>
            <el-table
                class="mt-xs scroll-bar"
                v-resize="{height:41}"
                :data="table.dataList"
                highlight-current-row
                v-loading="loading"
                element-loading-text="玩命加载中..."
                @sort-change="sort_change">
                <el-table-column label="账号简称/买家账号" inline-template align="left">
                    <div>
                        <div>
                            <ui-tips :content="row.account_short_name" :width="98"></ui-tips>
                        </div>
                        <div>
                            <ui-tips :content="row.buyer_account" :width="98"></ui-tips>
                        </div>
                    </div>
                </el-table-column>
                <el-table-column label="下单日期" inline-template width="170px">
                    <div>{{row.order_transaction_date | fmsdatetime}}</div>
                </el-table-column>
                <el-table-column label="当前评价" inline-template width="80px">
                    <div>
                        <span v-if="row.is_neutral_or_negative==='-'">-</span>
                        <img v-else  v-lazy="row.is_neutral_or_negative==='No'?failImage:successImage"
                        :title="row.is_neutral_or_negative==='No'?'差评':'好评'">
                    </div>
                </el-table-column>
                <el-table-column label="准时到达" inline-template width="80px">
                    <div>
                        <span v-if="row.is_arrived_on_time==='-'">-</span>
                        <img v-else  v-lazy="row.is_arrived_on_time==='No'?failImage:successImage"
                             :title="row.is_arrived_on_time==='No'?'差评':'好评'">
                    </div>
                </el-table-column>
                <el-table-column label="产品描述" inline-template width="80px">
                    <div>
                        <span v-if="row.is_product_description_accurate==='-'">-</span>
                        <img  v-else  v-lazy="row.is_product_description_accurate==='No'?failImage:successImage"
                             :title="row.is_product_description_accurate==='No'?'差评':'好评'">
                    </div>
                </el-table-column>
                <el-table-column label="客户服务" inline-template width="80px">
                    <div>
                        <span v-if="row.is_customer_service_good==='-'">-</span>
                        <img v-else v-lazy="row.is_customer_service_good==='No'?failImage:successImage"
                             :title="row.is_customer_service_good==='No'?'差评':'好评'">
                    </div>
                </el-table-column>
                <el-table-column label="是否移除" inline-template width="80px">
                    <div>{{row.is_remove_negative_feedback | filterRemove}}</div>
                </el-table-column>
                <el-table-column label="买家评价" inline-template align="left" sortable>
                    <div>
                        <div>{{row.comment_time | filterTime}}</div>
                        <ui-tips :content="row.comments" :width="98"></ui-tips>
                    </div>
                </el-table-column>
                <el-table-column label="我的评价" inline-template align="left">
                    <div>
                        <ui-tips :content="row.seller_comments"  :width="98"></ui-tips>
                    </div>
                </el-table-column>
                <el-table-column label="处理状态" inline-template width="110px">
                    <div>{{row.handling_status | filterStatus}}</div>
                </el-table-column>
                <el-table-column label="订单信息" inline-template>
                    <div @click="look_order(row)" :class=" [!!row.order_id?'operate':'']">
                       {{row.order_info}}
                    </div>
                </el-table-column>
                <el-table-column label="操作" inline-template width="130px">
                    <trend-select :selects="selectList" @trigger="select_trigger(row,$event)" type="primary"></trend-select>
                </el-table-column>
            </el-table>
            <el-pagination
                    class="page-fixed"
                    @size-change="size_change"
                    @current-change="current_change"
                    :current-page="table.page"
                    :page-sizes="[20, 50, 100, 200, 500]"
                    :page-size="table.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="table.total">
            </el-pagination>
            <!--差评原因-->
            <negative-reason v-model="negativeDialog"
                             :negative_neutral_reason="negative_neutral_reason"
                             :negative_neutral_remark="negative_neutral_remark"
                             :is_need_re_dispatched="is_need_re_dispatched"
                             @save="save"
                             :id="curId"></negative-reason>
            <!--处理状态-->
            <mdf-evaluate-status
                v-model="mdfDialog"
                :handling_status = "handling_status"
                :remove_negative_feedback = "remove_negative_feedback"
                @save-status="save_status"
                 :id="curId"></mdf-evaluate-status>
            <form-mdf
                    ref="formmfd"
                    :mdfid="mdfid"
                    v-model="orderVisable"
                    :is-edit="{edit:false}"
                    :title="mdfTitle"
                    :btn-show="false"
            ></form-mdf>
        </div>
    </page>
</template>
<style lang="stylus">
.operate{
    color #69f
    cursor:pointer
}

</style>
<script>
    import {api_estimate_lists} from '../../../api/ymx-estimate';
    import datef from 'datef'
    export default{
    	page:{},
        refresh(){
    	  	this.init_dispose_btn();
    	  	this.init();
        },
        data(){
            return {
                failImage:require('../../../assets/negative-comment.png'),
                successImage:require('../../../assets/medium-review.png'),
                order_number:"",
                buyer_email:"",
                /*数据列表*/
                table:{
                    page:1,
                    pageSize:50,
                    total:0,
                    dataList:[],
                },
                count:{
                    number_not_yet:0,
                    number_finish:0,
                    number_waiting:0,
                    number_expired:0
                },
                /*操作数据*/
                selectList:[
                    {label:"差评原因",value:1},
                    {label:"联系买家",value:2},
                    {label:"处理状态",value:3},
                ],
                disposeList: [
                    {label:"全部",value:"",count:0},
                    {label: "未处理", value: 0,count:0},
                    {label: "已处理", value: 1,count:0},
                    {label: "等待对方回复", value: 2,count:0},
                    {label: "已过期", value: 3,count:0},
                ],
                loading:false,
                /*card-search 页面传参*/
                form:{
                    is_neutral_or_negative:'Yes',
                    s_handling_status:"",
                    s_reply_status:"",
                    s_is_fba_order:"",
                    s_is_refund:0,
                    s_is_need_re_dispatch_order:"",
                    s_is_removed_negative_feedback:"",
                    s_search_by_order_no_type:1,
                    s_order_number:"",
                    s_account_short_name:"",
                    s_customer_service_officer_id:"",
                    s_search_by_time_type:1,
                    s_start_time:"",
                    s_end_time:"",
                    sort_field:"",
                    sort_type:"",
                },
                negativeDialog:false,
                mdfDialog:false,
                curId:"",
                negative_neutral_reason:"",
                negative_neutral_remark:"",
                is_need_re_dispatched:0,
                handling_status:0,
                remove_negative_feedback:0,
                mdfid:"0",
                mdfTitle:'',
                orderVisable:false,
            }
        },
        filters:{
            filterTime(val){
                return val?datef('YYYY-MM-dd',val*1000):"-- --";
            },
            filterRemove(val){
                return val===0?"未移除":"已移除";
            },
            filterStatus(val){
                switch (val){
                    case 0:
                        return "未处理";
                        break;
                    case 1:
                        return "已处理";
                        break;
                    case 2:
                        return "等待对方答复";
                        break;
                    case 3:
                        return "已过期";
                        break;
                }
            },
        },
        methods:{
            look_order(row){
                if(!row.order_id){return }
                this.mdfid =row.order_id;
                this.$refs.formmfd.require_server(this.mdfid);
                this.mdfTitle = `查看 ${row.order_info} 信息`;
                this.orderVisable = true;
            },
            init_dispose_btn(){
                let disposeBtn = this.disposeList;
                this.disposeList = [];
                this.$nextTick(()=>{
                    this.disposeList = disposeBtn;
                });
            },
//            1.1中差评列表 请求API
            init(){
//                if(this.form.is_neutral_or_negative === 1){
//                  this.form.is_neutral_or_negative = "Yes"
//                }else if(this.form.is_neutral_or_negative === 2){
//                  this.form.is_neutral_or_negative = "No"
//                }
                let params = {
                    page:this.table.page,
                    pageSize:this.table.pageSize,
                    is_neutral_or_negative:this.form.is_neutral_or_negative,
                    s_handling_status:this.form.s_handling_status,
                    s_reply_status:this.form.s_reply_status,
                    s_is_fba_order:this.form.s_is_fba_order,
                    s_is_refund:this.form.s_is_refund,
                    s_is_need_re_dispatch_order:this.form.s_is_need_re_dispatch_order,
                    s_is_removed_negative_feedback:this.form.s_is_removed_negative_feedback,
                    s_account_short_name:this.form.s_account_short_name,
                    s_search_by_order_no_type:this.form.s_search_by_order_no_type,
                    s_order_number:this.form.s_order_number,
                    s_search_by_time_type:this.form.s_search_by_time_type,
                    s_start_time:this.form.s_start_time,
                    s_end_time:this.form.s_end_time,
                    s_customer_service_officer_id:this.form.s_customer_service_officer_id,
                    sort_field:this.form.sort_field,
                    sort_type:this.form.sort_type,
                };
                if (params.s_start_time) {
                    params.s_start_time = datef('YYYY-MM-dd',params.s_start_time/1000);
                } else {
                    params.s_start_time = '';
                }
                if (params.s_end_time) {
                    params.s_end_time = datef('YYYY-MM-dd',params.s_end_time/1000);
                } else {
                    params.s_end_time = "";
                }
                this.loading = true;
                this.$http(api_estimate_lists,params).then(res=>{
                    this.loading = false;
                    this.table.dataList = res.data;
                    this.$nextTick(()=>{
                        this.disposeList.forEach((row)=>{
                        	if(row.value===''){
                        		row.count = res.number_handle_all;
                            }else if(row.value===0){
                        		row.count = res.number_handle_not_yet;
                            }else if(row.value===1){
                        		row.count = res.number_handle_is_finish;
                            }else if(row.value===2){
                        		row.count = res.number_handle_is_waiting;
                            }else if(row.value===3){
                        		row.count = res.number_handle_is_expired;
                            }
                        });
                    });
                    this.table.total = res.count;
                }).catch(code=>{
                    console.log(code);
                    setTimeout(()=>{
                        this.loading = true;
                    },200)
                })
            },
            sort_change(column){
                console.log("column",column);
                if(column.column instanceof Object){
                    console.log("column.column.label",column.column.label);
                    console.log("column.order",column.order);
                    this.form.sort_field = "comment_time";
                    this.form.sort_type = column.order==="descending"?"desc":"asc";
                    this.init();
                }
            },
            select_evaluate(){
                this.init();
            },
            select_dispose(){
                console.log(this.form);
                this.init();
            },
            buyer_reply(){
                this.init();
            },
            search(){
                this.init();
            },
            clear_search(){
                this.form.is_neutral_or_negative = 'Yes';
                this.form.s_handling_status = "";
                this.form.s_reply_status = "";
                this.form.s_is_fba_order = "";
                this.form.s_is_refund = 0;
                this.form.s_is_need_re_dispatch_order = "";
                this.form.s_is_removed_negative_feedback = "";
                this.form.s_search_by_order_no_type = 1;
                this.form.s_order_number = "";
                this.form.s_account_short_name = "";
                this.form.s_customer_service_officer_id = "";
                this.form.s_search_by_time_type = 1;
                this.form.s_start_time = "";
                this.form.s_end_time = "";
                this.form.sort_field="",
                this.form.sort_type="",
                this.init();
            },
//            表格里面的 操作
            select_trigger(item,val){
                this.curId = item.id;
                switch(val.value){
                    case 1:
                        this.negativeDialog = true;
                        this.negative_neutral_reason = item.negative_neutral_reason;
                        this.negative_neutral_remark = item.negative_neutral_remark;
                        this.is_need_re_dispatched = item.is_need_re_dispatched;
                        console.log('item.is_need_re_dispatched',item.is_need_re_dispatched);
                        break;
                    case 3:
                        this.mdfDialog = true;
                        this.handling_status = item.handling_status;
                        this.remove_negative_feedback = item.is_remove_negative_feedback;
                        break;
                }

            },
            save(reason,remark,dispatched){
                this.table.dataList.forEach(res=>{
                	if(res.id===this.curId){
                		res.negative_neutral_reason = reason;
                		res.negative_neutral_remark = remark;
                		res.is_need_re_dispatched = dispatched;
                    }
                });
            },
            save_status(status,feedback){
                this.table.dataList.forEach(res=>{
                	if(res.id===this.curId){
                		res.handling_status = status;
                		res.is_remove_negative_feedback = feedback;
                    }
                });
            },
//            翻页
            size_change(size){
                this.table.pageSize = size;
                this.init();
            },
            current_change(page){
                this.table.page = page;
                this.init();
            },
        },
        components: {
            cardSearch: require('./card-search').default,
            trendSelect:require('../../../components/trends-select.vue').default,
            uiTips:require("../../../components/ui-tip.vue").default,
            negativeReason:require('./negative-reason.vue').default,
            mdfEvaluateStatus:require('./mdf-evaluate-status.vue').default,
            formMdf:require("../../order/local/form-mdf.vue").default
        }
    }
</script>
