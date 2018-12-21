<template>
    <div class="c-card-search">
        <search-card :params="form"  :clears="clears" @search="search" @enter="search">
            <!--第一行-->
            <div>
                <label-buttons class="inline" label="评价状态：" :buttons="evaluateList"
                               @select="select_evaluate" v-sf.is_neutral_or_negative></label-buttons>
                <label-buttons class="inline ml-sm" label="处理状态：" :buttons="disposeList"
                               @select="select_dispose" v-sf.s_handling_status></label-buttons>
                <label-buttons class="inline ml-sm" label="买家回复状态：" :buttons="buyerReplyList"
                               @select="buyer_reply" v-sf.s_reply_status></label-buttons>
            </div>
            <!--第二行-->
            <div class="mb-mini">
                <label class="inline">是否FBA：</label>
                <el-select class="inline s-width-mini" v-model="form.s_is_fba_order" v-sf.s_is_fba_order>
                    <el-option
                            v-for="item in FBAList"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                    ></el-option>
                </el-select>
                <label class="inline ml-sm">是否退款：</label>
                <el-select class="inline s-width-mini" v-model="form.s_is_refund" v-sf.s_is_refund>
                    <el-option
                            :key="item.value"
                            v-for="item in refundList"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                </el-select>
                <label class="inline ml-sm">是否重发订单：</label>
                <el-select class="inline s-width-mini" v-model="form.s_is_need_re_dispatch_order" v-sf.s_is_need_re_dispatch_order>
                    <el-option
                            :key="item.value"
                            v-for="item in repeatDispatchList"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                </el-select>
                <label class="inline ml-sm">是否移出差评：</label>
                <el-select class="inline s-width-mini" v-model="form.s_is_removed_negative_feedback" v-sf.s_is_removed_negative_feedback>
                    <el-option
                            :key="item.value"
                            v-for="item in removedNegative"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                </el-select>
            </div>
            <!--第三行-->
            <div class="inline">
                <el-select class="inline s-width-middle" v-model="form.s_search_by_order_no_type" style="width:110px" v-sf.s_search_by_order_no_type>
                    <el-option
                            :key="item.value"
                            v-for="item in snTypeList"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                </el-select>
                <el-input class="inline s-width-middle" :placeholder="`请输入${changeLabel}...`" v-model="form.s_order_number" v-sf.s_order_number></el-input>
                <label class="inline ml-sm">账号简称：</label>
                <el-select class="inline width-sm" v-model="form.s_account_short_name"
                           style="width:105px" filterable clearable v-sf.s_account_short_name>
                    <el-option
                            :key="item.value"
                            v-for="item in accountList"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                </el-select>
                <label class="inline ml-sm">客服人员：</label>
                <el-select class="inline s-width-default" v-model="form.s_customer_service_officer_id"
                           filterable clearable v-sf.s_customer_service_officer_id >
                    <el-option
                            :key="item.value"
                            v-for="item in serviceList"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                </el-select>
                <el-select class="inline s-width-default ml-sm" v-model="form.s_search_by_time_type" v-sf.s_search_by_time_type>
                    <el-option
                            :key="item.value"
                            v-for="item in timeType"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                </el-select>
                <el-date-picker
                        class="inline date"
                        style="width:115px"
                        v-model="form.s_start_time"
                        :picker-options="pickerstart"
                        type="date"
                        placeholder="开始时间" v-sf.s_start_time>
                </el-date-picker>
                &nbsp;--&nbsp;
                <el-date-picker
                        class="inline date mr-sm"
                        style="width:115px"
                        v-model="form.s_end_time"
                        :picker-options="pickerend"
                        type="date"
                        placeholder="结束时间" v-sf.s_end_time>
                </el-date-picker>
            </div>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
import {api_get_account,api_get_member,url_estimate_lists} from '../../../api/ymx-estimate';
    export default{
        permission:{
            url_estimate_lists
        },
        data(){
            return {
                /*评价状态*/
                evaluateList: [
                    {label: "中评", value: 'Yes'},
                    {label: "差评", value: 'No'}
                ],
                /*处理状态*/
//                disposeList: [
//                    {label: "未处理", value: 0},
//                    {label: "已处理", value: 1},
//                    {label: "等待对方回复", value: 2},
//                    {label: "已过期", value: 3},
//                ],
                /*买家回复状态*/
                buyerReplyList: [
                    {label:"全部",value:""},
                    {label: "未回复", value: 0},
                    {label: "已回复", value: 1},
                ],
                /*是否FBA*/
                FBAList: [
                    {label: "全部", value: ""},
                    {label: "否", value: 0},
                    {label: "是", value: 1},
                ],
                /*是否退款*/
                refundList: [
                    {label: "全部", value: 0},
                    {label: "全额退款", value: 1},
                    {label: "部分退款", value: 2},
                    {label: "无退款", value: 3},
                ],
                /*是否重发订单*/
                repeatDispatchList: [
                    {label: "全部", value: ""},
                    {label: "是", value: 1},
                    {label: "否", value: 0},
                ],
                /*是否移出差评*/
                removedNegative: [
                    {label: "全部", value: ""},
                    {label: "是", value: 1},
                    {label: "否", value: 0},
                ],
                /*模糊筛选条件 选择*/
                snTypeList: [
                    {label: "系统订单号", value: 1},
                    {label: "平台订单号", value: 2},
                    {label: "买家邮箱", value: 3},
                ],
                /*账号简称*/
                accountList: [],
                /*客服人员*/
                serviceList: [],
                /*时间的筛选*/
                timeType: [
                    {label: "评价时间", value: 1},
                    {label: "下单时间", value: 2},
                ],
                clears:{},
                /*时间限制*/
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.form.s_end_time){
                            return  time.getTime() > this.form.s_end_time.getTime();
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.form.s_start_time){
                            return time.getTime() < this.form.s_start_time.getTime()
                        }else {
                            return false
                        }
                    }
                },
            }
        },
        created(){
            this.api_get_account();
            this.get_member();
            this.clears=clone(this.form);
        },
        methods: {
            init_status_btn(){
                let evaluateBtn = this.evaluateList;
                let buyerBtn = this.buyerReplyList;
                this.evaluateList = [];
                this.buyerReplyList = [];
                this.$nextTick(()=>{
                    this.evaluateList = evaluateBtn;
                    this.buyerReplyList = buyerBtn;
                });
            },
            /*评价状态*/
            select_evaluate(index){
                this.form.is_neutral_or_negative = this.evaluateList[index].value;
                this.$emit("select-evaluate");
            },
            /*处理状态*/
            select_dispose(index){
                this.form.s_handling_status = this.disposeList[index].value;
                this.$emit("select-dispose");
            },
            /*买家回复状态*/
            buyer_reply(index){
                this.form.s_reply_status = this.buyerReplyList[index].value;
                this.$emit("buyer-reply");
            },
            /*搜索*/
            search(){
                this.$emit("search");
            },
            /*清空搜索*/
            clear_search(){
                this.$emit("clear-search");
            },
            /*获取账号简称*/
            api_get_account(){
                this.$http(api_get_account,{channel_id:2}).then(res=>{
                    this.accountList = res.account;
                    this.accountList = [{label:"全部",value:""},...this.accountList];
                }).catch(code=>{
                    console.log(code);
                });
            },
            /*亚马逊客服人员*/
            get_member(){
                this.$http(api_get_member,{content:""}).then(res=>{
                    this.serviceList = res.map(row=>{
                        return {
                            label:row.realname,
                            value:row.id
                        }
                    });
                    this.serviceList.unshift({label:'全部', value:''})
                }).catch(code=>{
                    console.log(code);
                })
            }
        },
        computed:{
            changeLabel(){
                let find = this.snTypeList.find(res=>{
                    return this.form.s_search_by_order_no_type === res.value;
                });
                if(!!find){
                    return find.label;
                }
            }
        },
        props: {
            form: {
                required: true,
                type: Object
            },
            disposeList:{
                required: true,
                type: Array
            }
        },
        components: {
            labelButtons: require("../../../components/label-buttons.vue").default,
            searchCard:require("../../../components/search-card.vue").default
        }
    }
</script>
