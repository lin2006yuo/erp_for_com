<template>
    <div class="p-search-out-box-search">
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears">
            <el-row>
                <label-buttons label="站内信：" :buttons="boxs" @select="select_boxs"></label-buttons>
            </el-row>
            <div class="inline">
                <el-select v-model="searchData.search_key" placeholder="请选择" class="inline" style="width:90px;" v-sf.search_key>
                    <el-option
                        :key="item.value"
                        v-for="item in optionType"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-input v-model="searchData.search_val" :placeholder="`请输入${changeLabel}...`" class="inline" style="width: 115px;" v-sf.search_val></el-input>
                <label class="ml-sm">客服账号：</label>
                <el-select v-model="searchData.customer_id" placeholder="请选择" class="inline" clearable filterable v-sf.customer_id>
                    <el-option
                        :key="item.customer_id"
                        v-for="item in  options "
                        :label="`${item.realname}/${item.username}`"
                        :value="item.customer_id">
                    </el-option>
                </el-select>
                <label class="ml-sm inline">账号简称：</label>
                <el-select v-model="searchData.account_id" placeholder="请选择" class="inline" style="width: 110px;" clearable filterable v-sf.account_id>
                    <el-option
                        :key="item.value"
                        v-for="item in accounts"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <label class="ml-sm">消息发送时间：</label>
                <el-date-picker type="date" placeholder="开始时间" v-model="searchData.receive_date_b" :picker-options="pickerstart" class="inline date" style="width: 115px;" v-sf.receive_date_b></el-date-picker>&nbsp;--&nbsp;
                <el-date-picker type="date" placeholder="结束时间" v-model="searchData.receive_date_e" :picker-options="pickerend" class="inline date mr-sm"  style="width: 115px;" v-sf.receive_date_e></el-date-picker>
            </div>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import labelButtons from "../../../../components/label-all-buttons.vue"
    import {api_message_customer,api_ebay_message_accout,} from "../../../../api/inbox"
    export default{
        data(){
            return{
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.receive_date_e){
                            return  time.getTime() > this.searchData.receive_date_e
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.receive_date_b){
                            return time.getTime() < this.searchData.receive_date_b
                        }else {
                            return false
                        }

                    }
                },
                boxs:[
                    {name:"发送成功",value:1},
                    {name:"发送失败",value:2},
                ],
                optionType:[
                    {label:"买家ID",value:"send_to_name"},
                    {label:"交易号",value:"transaction_id"},
                ],
                options:[],
                accounts:[],
                clears:{
                    pageSize:50,
                    page:1,
                    time_sort:0,
                    type:2,
                    account_id:"",
                    customer_id:"",
                    search_key:"send_to_name",
                    search_val:"",
                    receive_date_b:"",
                    receive_date_e:"",
                    send_state:1
                },
            }
        },
        created(){
            this.get_account();
            this.get_customer();
            this.get_account();
        },
        methods:{
            init_status_btn(){
                let boxsBtn = this.boxs;
                this.boxs = [];
                this.$nextTick(()=>{
                    this.boxs = boxsBtn;
                });
            },
            get_account(){
                this.$http(api_ebay_message_accout,{channel_id:1}).then(res=>{
                    this.accounts = [{label:'全部', value:''}, ...res.account];
                }).catch(code=>{
                    console.log(code)
                })
            },
            select_boxs(val){
                this.searchData.send_state=this.boxs[val].value;
                this.clears.send_state = this.boxs[val].value;
                this.$emit("reflash")
            },
            get_customer(){
                this.options=[];
                this.$http(api_message_customer).then(res=>{
                    this.options= [{realname:'全部', username:'All', customer_id:''}, ...res];
                }).catch(code=>{
                    console.log(code)
                })
            },
            search(){
                this.$emit("reflash")
            },
        },
        filters:{
        },
        computed:{
            changeLabel(){
                let find = this.optionType.find(res=>{
                    return this.searchData.search_key === res.value;
                });
                if(!!find){
                    return find.label;
                }
            }
        },
        props:{
            searchData:{
                required:true,
                type:Object,
            }
        },
        components:{
            labelButtons,
            searchCard:require("../../../../components/search-card.vue").default
        }
    }
</script>
