<template>
    <div class="c-card-search">
        <search-card :params="searchData" :clears="clears" @search="search">
            <label-buttons label='状态：' :buttons="buttons"  @select="change_select"></label-buttons>
            <el-row class="mb-xs">
                <label-item label="账号状态：" class="inline">
                    <super-select
                            class="s-width-small"
                            v-model="searchData.site_status"
                            :storage-key="`channelStatus`"
                            :options="accountStatus">
                    </super-select>
                </label-item>
                <label-item label="订单授权状态：" class="inline ml-sm">
                    <el-select
                            class="inline width-xs"
                            v-sf.authorization
                            v-model="searchData.authorization"
                            placeholder="请选择">
                        <el-option
                                v-for="item in authorList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </label-item>
            </el-row>
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
            <label-item label="销售员：" class="inline ml-sm">
                <super-select
                        class="s-width-default"
                        v-model="searchData.seller_id"
                        :storage-key="`channelSeller`"
                        :options="sellerData">
                </super-select>
            </label-item>
            <label-item label="客服：" class="inline ml-sm">
                <super-select
                        class="s-width-default"
                        v-model="searchData.customer_id"
                        :storage-key="`customerSeller`"
                        :options="customerData">
                </super-select>
            </label-item>
            <label-item class="mr-lg">
                <el-select v-model="searchData.taskName"  class="s-width-middle ml-sm" v-sf.taskName>
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
                <el-select v-model="searchData.time_type"
                           class="inline ml-sm mr-xs s-width-small"
                           v-sf.time_type>
                    <el-option
                            v-for="res in timeData"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"></el-option>
                </el-select>
                <el-date-picker
                        v-model="searchData.start_time"
                        type="date"
                        placeholder="选择日期"
                        class="inline date"
                        v-sf.start_time
                        :picker-options="inputTimeStart">
                </el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                        v-model="searchData.end_time"
                        type="date"
                        placeholder="选择日期"
                        class="inline date mr-sm"
                        v-sf.end_time
                        :picker-options="inputTimeEnd">
                </el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>

<script>
    import {api_customer_list,api_get_seller,api_site_status} from '@/api/ymx';
    export default {
        data() {
            return {
                accountStatus:[],
                sellerData:[],
                customerData:[],
                timeData:[
                    {value: 'register',label: '注册日期'},
                    {value:'fulfill',label: '交接日期'}
                ],
                inputTimeStart: {
                    disabledDate: (time)=> {
                        if (this.searchData.end_time) {
                            return time.getTime() > this.searchData.end_time;
                        } else {
                            return time.getTime()>Date.now();
                        }
                    }
                },
                inputTimeEnd: {
                    disabledDate: (time)=> {
                        if (this.searchData.start_time) {
                            return time.getTime()<this.searchData.start_time||time.getTime() > Date.now();
                        } else {
                            return time.getTime()>Date.now();
                        }
                    }
                },
                taskTimeList:[
                    {label:'全部',value:''},
                    {label:'未启用',value:0},
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
                taskConditionList:[
                    {label:'=',value:'eq'},
                    {label:'>',value:'gt'},
                    {label:'<',value:'lt'},
                ],
                authorList: [
                    {value: -1, label: '全部'},
                    {value: 0, label: '未授权'},
                    {value: 1, label: '已授权'},
                ],
                snTypeList:[
                    {label:'账户',value:'name'},
                    {label:'简称',value:'code'},
                ],
                taskNameList:[
                    {label:'抓取订单数据',value:'download_order'},
                    {label:'同步发货状态',value:'sync_delivery'}
                ],
                buttons:[
                    {label:'全部',value:''},
                    {label:'已启用',value:true},
                    {label:'已停用',value:false},
                ],
            }
        },
        mounted(){
            this.user_staffs();
            this.get_member();
            this.site_status();
        },
        methods: {
            site_status(){
                this.$http(api_site_status).then(res=>{
                    let data = res.map(row=>{
                        return {
                            label:row.remark,
                            value:row.status,
                        }
                    });
                    this.accountStatus = [{label: "全部", value: ""}, ...data]
                }).catch(code => {
                    this.$message({type:"error",code:code.message||code})
                });
            },
            user_staffs(){
                this.$http(api_get_seller).then(res=>{
                    let data = res.map(row=>{
                        return {
                            label:row.realname,
                            value:row.id,
                        }
                    });
                    this.sellerData = [{label: "全部", value: ""},{label: "空", value: 0}, ...data];
                }).catch(code => {
                    this.$message({type:"error",code:code.message||code})
                });
            },
            get_member(){
                this.$http(api_customer_list,{data:{content:''}}).then(res=>{
                    let data =res.map(item=>{
                        return {label:item.realname,value:item.id};
                    })
                    this.customerData = [{label: "全部", value: ""},{label: "空", value: 0}, ...data];
                }).catch(code => {
                    this.$message({type:"error",code:code.message||code})
                });
            },
            change_select(index){
                switch(index){
                    case 0:
                        delete this.searchData.is_invalid;
                        break;
                    case 1:
                        this.searchData.is_invalid = 1;
                        break;
                    case 2:
                        this.searchData.is_invalid = 0;
                        break;
                }
                // this.searchData.status = this.buttons[index].value;
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
        },
        computed:{
            changeLabel() {
                if (this.searchData.snType === 'name') {
                    return `账户`;
                } else{
                    return `简称`;
                }
            },
        },
        props:{
            searchData:{},
            clears:{}
        },
        components:{
            searchCard:require('@/components/search-card.vue').default,
            labelButtons:require('@/components/label-buttons.vue').default,
            labelItem:require('@/components/label-item.vue').default,
        }
    }
</script>

<style scoped>

</style>