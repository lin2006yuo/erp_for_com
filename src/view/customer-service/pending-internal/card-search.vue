<template>
    <div class="c-card-search">
        <search-card  :params="searchData" @search="search" @enter="search" :clears="clears" @init-params="init_status_btn">
            <el-row>
                <label-buttons label="平台：" :buttons="channelId" @select="select_boxs" class="inline" v-sf.channel_id></label-buttons>
            </el-row>
            <el-row>
                <select-more-button
                    label="账号："
                    ref="selectMoreButton"
                    label-width="120"
                    v-sf.account_id
                    class="mb-mini"
                    :button-list="accountId"
                    :clear-select="clearSelect"
                    @query="change_account">
                </select-more-button>
            </el-row>
            <el-row>
                <label-buttons label="类型：" :buttons="msgType" @select="select_type" class="inline" v-sf.msg_type></label-buttons>
            </el-row>
            <div class="inline">
                <label>客服账号：</label>
                <el-select
                        v-model="searchData.customer_id"
                        placeholder="请选择"
                        filterable
                        clearable
                        class="inline mr-sm s-width-default"
                        v-sf.customer_id>
                    <el-option
                            :key="item.customer_id"
                            v-for="item in customerId"
                            :label="item.realname"
                            :value="item.customer_id">
                    </el-option>
                </el-select>
                <label class="ml-sm">接收日期：</label>
                <el-date-picker
                        class="inline date"
                        v-model="searchData.time_start"
                        type="date"
                        placeholder="开始时间"
                        :picker-options="pickerstart"
                        v-sf.time_start
                ></el-date-picker>&nbsp;--&nbsp;<el-date-picker
                    class="inline mr-sm date"
                    v-model="searchData.time_end"
                    type="date"
                    placeholder="结束时间"
                    :picker-options="pickerend"
                    v-sf.time_end
            ></el-date-picker>
            </div>
        </search-card>

    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_message_customer} from '@/api/message-transfer'
    export default {
        data() {
            return {
                clears:{},
                channelId:[
                    {label:"Ebay",value:1},
                    {label:"亚马逊",value:2},
                    {label:"速卖通",value:4},
                ],
                customerId:[],
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.time_end){
                            return time.getTime()>this.searchData.time_end;
                        }else{
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.time_start){
                            return time.getTime()<this.searchData.time_start;
                        }else{
                            return false;
                        }
                    }
                },
                moreSelect:false,
                selectAccounts:[],
                clearSelect: false
            }
        },
        mounted(){
            this.message_customer();
        },
        methods:{
            init_status_btn(){
                let executeBtn = this.channelId;
                let accountBtn = this.accountId;
                let msgBtn = this.msgType;
                this.channelId = [];
                this.accountId = [];
                this.msgType = [];
                this.$nextTick(()=>{
                    this.channelId = executeBtn;
                    this.accountId = accountBtn;
                    this.msgType = msgBtn;
                });
            },
            message_customer(val){
                if(val===undefined)return;
                this.$http(api_message_customer,{channel_id:val}).then(res=>{
                    this.customerId= [{realname:'全部', username:'All', customer_id:''}, ...res];
                }).catch(code=>{
                    console.log(code)
                })
            },
            search(){
                this.$emit('search');
            },
            select_boxs(val,item){//---平台
                this.searchData.account_id = '';
                this.message_customer(item.value);
                this.$emit('select-boxs',item.value);
            },
            change_account(accounts) {
                this.$emit("select-bank",accounts.map(a => a.value).join(','));
            },
            select_type(val,item){//---类型
                this.$emit('select-type',item.value);
            }
        },
        watch:{
            'searchData.channel_id'(){
                this.$refs.selectMoreButton.moreSelect = false;
            }
        },
        props:{
            searchData:{
                require:true,
                type:Object
            },
            msgType:{
                require:true,
                type:Array
            },
            accountId:{
                require:true,
                type:Array
            }
        },
        components: {
            labelButtons:require("@/components/label-buttons.vue").default,
            searchCard:require("@/components/search-card.vue").default,
            selectMoreButton: require('../../entrepot/delivery/select-more-button').default,
        }
    }
</script>
