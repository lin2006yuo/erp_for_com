<template>
    <search-card :params="searchData" :clears="clears" @search="search">
        <label-buttons label='状态：' :buttons="buttons"  @select="change_select"></label-buttons>
        <div  class="mb-mini">
            <label-item label="">
                <el-select
                    v-model="searchData.snType"
                    class="s-width-small"
                    v-sf.snType>
                    <el-option
                        v-for="(res,index) in snTypeList"
                        :label="res.label"
                        :value="res.value"
                        :key="index"
                    ></el-option>
                </el-select>
                <el-input
                    v-model="searchData.snText"
                    :placeholder="`请输入${changeLabel}...`"
                    class="ml-xs width-super"
                    v-sf.snText
                    @keydown.native="keyword"></el-input>
            </label-item>
            <label-item label="账号状态：" class="inline ml-sm">
                <el-select class="inline s-width-small"
                           v-sf.site_status
                           v-model="searchData.site_status">
                    <el-option v-for="item in accountStatus"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="订单授权状态：" class="inline ml-sm">
                <el-select
                    class="inline width-xs"
                    v-sf.authorization
                    v-model="searchData.is_authorization"
                    placeholder="请选择">
                    <el-option
                        v-for="item in authorList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="销售员：" class="inline ml-sm">
                <param-account
                    class="inline s-width-default"
                    ref="paramSale"
                    placeholder="可输入搜索"
                    v-model="searchData.seller_id"
                    v-sf.seller_id
                    :param="{type:'sales',data:{content:''}}"
                    :fixUrl="true"
                    :fixResult="sale_fix_result"
                    type="memberShipSales"
                    url="get|user/:type/staffs">
                </param-account>
            </label-item>
            <label-item label="客服：" class="inline ml-sm">
                <param-account
                    class="inline s-width-default"
                    ref="paramCustomer"
                    placeholder="可输入搜索"
                    v-model="searchData.customer_id"
                    v-sf.customer_id
                    :param="{type:'customer',data:{content:''}}"
                    :fixUrl="true"
                    :fixResult="sale_fix_result"
                    type="memberShipSales"
                    url="get|user/:type/staffs">
                </param-account>
            </label-item>
        </div>
        <label-item>
            <el-select v-model="searchData.taskName"  class="s-width-middle" v-sf.taskName>
                <el-option
                        v-for="(res,index) in taskNameList"
                        :label="res.label"
                        :value="res.value"
                        :key="index"
                ></el-option>
            </el-select>
            <el-select v-model="searchData.taskCondition" class='ml-xs mr-xs' v-sf.taskCondition
                       style="width:70px">
                <el-option
                    v-for="(res,index) in taskConditionList"
                    :label="res.label"
                    :value="res.value"
                    :key="index"
                ></el-option>   
            </el-select>   
            <el-select v-model="searchData.taskTime" class="s-width-default" v-sf.taskTime>
                <el-option
                    v-for="(res,index) in taskTimeList"
                    :label="res.label"
                    :value="res.value"
                    :key="index"
                ></el-option>   
            </el-select>
        </label-item>
        <el-select class="inline s-width-small ml-sm"
                   v-sf.time_type
                   v-model="searchData.time_type">
            <el-option v-for="item in dataList"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
        </el-select>
        <el-date-picker
            type="date"
            v-sf.start_date
            placeholder="开始时间"
            v-model="searchData.start_time"
            class="inline date"
            :picker-options="pickerStart"
        ></el-date-picker>&nbsp;--&nbsp;<el-date-picker
            type="date"
            placeholder="结束时间"
            v-sf.end_date
            v-model="searchData.end_time"
            class="inline date mr-sm"
            :picker-options="pickerEnd"
         ></el-date-picker>
    </search-card>
</template>
<style lang="stylus">

</style>
<script>
    import {api_site_status} from '@/api/ymx';
    export default {
        data() {
            return {
                snTypeList:[
                    {label:'账户',value:'account_name'},
                    {label:'简称',value:'code'},
                ],
                taskNameList:[
                    {label:'同步发货状态',value:'sync_delivery'},
                    {label:'抓取订单数据',value:'download_order'},
                    {label:'抓取listing数据',value:'download_listing'},
                ],
                dataList:[
                    {label:"注册日期",value:'register'},
                    {label:'交接日期',value:'fulfill'},
                ],
                accountStatus:[],
                taskConditionList:[
                    {label:'=',value:'eq'},
                    {label:'>',value:'gt'},
                    {label:'<',value:'lt'},
                ],
                authorList: [
                    {value: '', label: '全部'},
                    {value: '0', label: '未授权'},
                    {value: '1', label: '已授权'},
                ],
                taskTimeList:[
                    {label:'全部',value:''},
                    {label:"未启用",value:0},
                    {label:'30分钟',value:30},
                    {label:'1小时',value:60},
                    {label:'2小时',value:120},
                    {label:'3小时',value:180},
                    {label:'4小时',value:240},
                    {label:'5小时',value:300},
                    {label:'6小时',value:360},
                    {label:'7小时',value:420},
                    {label:'8小时',value:480},
                    {label:'9小时',value:540},
                    {label:'10小时',value:600},
                    {label:'11小时',value:660},
                    {label:'12小时',value:720},
                    {label:'24小时',value:1440}
                ],
                buttons:[
                    {label:'全部',value:''},
                    {label:'已启用',value:0},
                    {label:'已停用',value:1},
                ],
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.searchData.end_time) {
                            return time.getTime() > this.searchData.end_time;
                        } else {
                            return time.getTime()>Date.now();
                        }
                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.start_time) {
                            return time.getTime() < this.searchData.start_time||time.getTime()>Date.now();
                        }
                    }
                },
            }
        },
        mounted(){
            this.site_status();
        },
        methods:{
            site_status(){
                this.$http(api_site_status).then(res=>{
                    let data = res.map(row=>{
                        return {
                            label:row.remark,
                            value:row.status,
                        }
                    });
                    this.accountStatus= [{label: "全部", value: ""}, ...data]
                }).catch(code => {
                    this.$message({type:"error",code:code.message||code})
                });
            },
            change_select(index){
                this.searchData.status = this.buttons[index].value;
                this.$emit('change-select');
            },
            keyword(val) {
                if(val.code==='Enter'){
                    this.$emit("key-word");
                }
            },
            search(){
                this.$emit('search');
            },
            sale_fix_result(res){
                return res.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
            },
        },
        computed: {
            changeLabel() {
                if (this.searchData.snType === 'account_name') {
                    return `账户`;
                } else{
                    return `简称`;
                }
            },
        },
        props:{
            searchData:{},
            clears:{},
        },
        components: {
            searchCard:require('@/components/search-card.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            labelButtons:require('@/components/label-buttons.vue').default,
            paramAccount:require('../../../../api-components/param-account.vue').default,
        }
    }
</script>
