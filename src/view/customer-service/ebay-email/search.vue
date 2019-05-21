<template>
    <div class="p-search-amazon-inbox">
        <search-card :params="clears" :clears="clears" @search="search" @enter="search" @init-params="clearParams">
            <el-row>
                <label-buttons label="邮件类型：" v-if="emailType" :buttons="typeList" @select="select_type" class="inline mr-sm"></label-buttons>
                <label-buttons label="发送状态：" v-if="isOutbox" :buttons="sendList" @select="select_status" class="inline mr-sm"></label-buttons>
                <label-buttons label="信件状态：" v-else :buttons="statusList" :defaultIndex="1"  @select="select_status" class="inline mr-sm"></label-buttons>
                <label-buttons label="账号简称：" v-if="searchData.platform!=='paypal'" :buttons="accountList" @select="select_account" class="inline"></label-buttons>
            </el-row>
            <el-row>
            </el-row>
            <el-row class="inline">
                <template v-if="searchData.platform==='paypal'">
                    <label class="inline">分组：</label>
                    <el-select class="inline width-sm"
                               v-model="searchData.grouping"
                               v-sf.grouping>
                        <el-option :label="item.label"  :value="item.value" :key="item.value" v-for="item in groupingList"></el-option>
                    </el-select>
                </template>
                <label class="inline">收件人：</label>
                <super-select 
                    class="inline width-super mr-sm"
                    v-model="searchData.receiver"
                    v-sf.receiver
                    storageKey="api_get_ebay_emails_receiver_mailAddr"
                    :options="recipients"
                    >
                </super-select>
                <!-- <el-select class="inline width-super mr-sm"
                           v-model="searchData.receiver"
                           clearable
                           filterable
                           v-sf.receiver>
                    <el-option :label="item.value"  :value="item.value" :key="`${item.value}${i_i}`" v-for="(item,i_i) in recipients"></el-option>
                </el-select> -->
                <label class="inline" v-if="searchData.type === 1">发件人：</label>
                <!-- <el-select class="inline width-super mr-sm"
                           v-model="searchData.sender"
                           v-if="searchData.type === 1"
                           clearable
                           filterable
                           v-sf.sender>
                    <el-option :label="item.value"  :value="item.value" :key="`${item.value}${i_i}`" v-for="(item,i_i) in sendLists"></el-option>
                </el-select> -->
                <super-select 
                    class="inline width-super mr-sm"
                    v-model="searchData.receiver"
                    v-if="searchData.type === 1"
                    v-sf.receiver
                    storageKey="api_get_ebay_emails_send_mailAddr"
                    :options="sendLists"
                    >
                </super-select>
                <label class="inline" v-if="searchData.type === 1">关键词：</label>
                <el-input v-model="searchData.snText" v-if="searchData.type === 1" class="inline mr-sm"></el-input>
                <label class="inline">{{searchData.type === 2?'发送时间：':'接收时间'}}</label>
                <el-date-picker
                    @keyup.enter.native="search"
                    type="date"
                    v-sf.start_date
                    placeholder="开始时间"
                    v-model="searchData.start_date"
                    class="inline date"
                    :picker-options="pickerstart"
                ></el-date-picker>&nbsp;--&nbsp;<el-date-picker
                @keyup.enter.native="search"
                type="date"
                placeholder="结束时间"
                v-sf.end_date
                v-model="searchData.end_date"
                class="inline date mr-sm"
                :picker-options="pickerend"
            ></el-date-picker>
            </el-row>
        </search-card>
    </div>
</template>
<style lang="stylus">
.p-search-amazon-inbox{
    .el-card {
            overflow:visible !important;
        }
}
</style>
<script>
    import {api_get_ebay_emails_receiver_mailAddr,api_get_ebay_emails_send_mailAddr} from '@/api/ebay-emails'
    export default{
        data(){
            return{
                typeList:[
                    {label:"Ebay邮件",value:'ebay'},
                    {label:"Paypal邮件",value:'paypal'}
                ],
                sendList:[
                    {label:"全部",value:''},
                    {label:"发送成功",value:1},
                    {label:"发送失败",value:2}
                ],
                groupingList:[{label:"全部",value:''}],
                recipients:[],
                sendLists:[],
                clears:{
                    pageSize: 50,
                    page: 1,
                    grouping: '',
                    receiver:'',
                    sender: '',
                    snText: '',
                    start_date: (Date.now() - (7 * 24 * 60 * 60 * 1000)),
                    end_date: Date.now(),
                },
                pickerstart: {
                    disabledDate: (time) => {
                        if (this.searchData.end_date) {
                            return time.getTime() > Date.now();
                        } else {
                            return false
                        }
                    }
                },
                pickerend: {
                    disabledDate: (time) => {
                        if (this.searchData.start_date) {
                            return time.getTime() < this.searchData.start_date||time.getTime() > Date.now();
                        } else {
                            return false
                        }
                    }
                },
                placeholder: '请选择'
            }
        },
        created(){
            this.get_recipients();
            this.get_sender()
        },
        methods:{
            clearParams(){
                Object.keys(this.searchData).forEach(key=>{
                    if(this.clears.hasOwnProperty(key)){
                        this.searchData[key] = this.clears[key];
                    }
                });
                // this.search();
            },
            change_date(){
                this.searchData.grouping='';
                this.searchData.sender='';
                this.sendLists=[];
                this.recipients=[];
                this.get_recipients();
                this.get_sender();
                // this.$emit('change-unread',this.searchData)
            },
            get_recipients(){
                let params = {
                    platform: this.searchData.platform,
                    is_read: this.searchData.is_read,
                    type: this.searchData.type,
                    start_date: Number(this.searchData.start_date)>0?datef('YYYY-MM-dd', this.searchData.start_date/1000):'',
                    end_date:Number(this.searchData.end_date)>0?datef('YYYY-MM-dd', this.searchData.end_date/1000):''
                };
                params.platform === 'ebay'&&this.$set(params, 'account_code', this.searchData.account_code);
                this.$http(api_get_ebay_emails_receiver_mailAddr, params).then(res=>{
                    let data = [];
                    Object.keys(res).forEach(key=>{
                        data.push({value:res[key].receiver});
                    });
                    this.recipients = data;
                }).catch(code=>{
                    console.log(code);
                });
            },
            get_sender(){
                let params = {
                    platform: this.searchData.platform,
                    is_read: this.searchData.is_read,
                    type: this.searchData.type,
                    start_date: Number(this.searchData.start_date)>0?datef('YYYY-MM-dd', this.searchData.start_date/1000):'',
                    end_date:Number(this.searchData.end_date)>0?datef('YYYY-MM-dd', this.searchData.end_date/1000):''
                };
                params.platform === 'ebay'&&this.$set(params, 'account_code', this.searchData.account_code);
                this.$http(api_get_ebay_emails_send_mailAddr, params).then(res=>{
                    let data = [];
                    Object.keys(res).forEach(key=>{
                        data.push({value:res[key].sender});
                    });
                    this.sendLists = data;
                }).catch(code=>{
                    console.log(code);
                });
            },
            select_type(val){
                this.searchData.platform=this.typeList[val].value;
                this.get_recipients();
                this.get_sender();
                this.$emit("reflash",true)
            },
            select_status(val){
                if(this.isOutbox){
                    this.searchData.status = this.sendList[val].value;
                }else{
                    this.searchData.is_read=this.statusList[val].value;
                }
                this.get_recipients();
                this.get_sender();
                this.$emit("select-status");
            },
            select_account(val,item){
                this.searchData.account_code = item.label==='全部'?'':item.label;
                this.get_recipients();
                this.get_sender();
                this.$emit("reflash",false)
            },
            search(){
                this.$emit("reflash",true)
            },
            clear(){
                this.$emit("clear")
            }
        },
        props:{
            searchData:{
                required:true,
                type:Object,
            },
            accountList:{
                required:true,
                type:Array
            },
            statusList:{
                type:Array,
                default(){
                    return []
                }
            },
            isOutbox:{
                default(){
                    return false
                }
            },
            emailType:{
                default(){
                    return false
                }
            },
            type:{
                required:true,
                type:Number
            }
        },
        components:{
            labelButtons:require('@/components/label-buttons').default,
            searchCard:require("@/components/search-card.vue").default,
        }
    }
</script>
