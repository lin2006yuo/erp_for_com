<template>
    <div class="p-search-ebay-inbox-search">
        <search-card :params="searchData" :clears="clears" @search="search" @enter="search">
            <el-row>
                <label-buttons label="处理状态：" :buttons="handles" @select="select_handles" class="search-sm" :default-index="1" v-sf.state></label-buttons>
                <select-more-button
                    label="　　账号："
                    label-width="120"
                    class="mb-mini"
                    :button-list="littleAccount"
                    :clear-select="clearSelect"
                    @query="change_account">
                </select-more-button>
                <label-buttons label="　站内信：" :buttons="boxs" @select="select_boxs" v-sf.msg_type></label-buttons>
            </el-row>
            <div class="inline">
                <el-select v-model="searchData.search_key" placeholder="请选择" class="inline s-width-default" v-sf.search_key>
                    <el-option
                            :key="item.value"
                            v-for="item in optionType"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-input v-model="searchData.search_val" :placeholder="`请输入${changeLabel}...`" class="inline s-width-middle"  v-sf.search_val></el-input>
                <label class="ml-sm inline">客服账号：</label>
                <el-select v-model="searchData.customer_id" placeholder="请选择" class="inline s-width-middle" filterable v-sf.customer_id>
                    <el-option
                            :key="item.customer_id"
                            v-for="item in options"
                            :label="item.realname"
                            :value="item.customer_id">
                    </el-option>
                </el-select>
                <label class="ml-sm inline">优先级：</label>
                <el-select v-model="searchData.level" placeholder="请选择" class="inline s-width-mini"  v-sf.level>
                    <el-option
                            :key="item.value"
                            v-for="item in priority"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <label class="ml-sm inline">标记类型：</label>
                <el-select v-model="searchData.flag_id" placeholder="请选择" class="inline s-width-default"  v-sf.level>
                    <el-option
                        :key="item.value"
                        v-for="item in markList"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <br style="display: none" class="br-show" />
                <div style="display: none; height: 5px;" class="br-show"></div>
                <label class="ml-sm">接收时间：</label>
                <el-date-picker type="date" placeholder="开始时间" v-model="searchData.receive_date_b" :picker-options="pickerstart" class="inline date" style="width: 115px;" v-sf.receive_date_b></el-date-picker>&nbsp;--&nbsp;
                <el-date-picker type="date" placeholder="结束时间" v-model="searchData.receive_date_e" class="inline mr-sm date" :picker-options="pickerend"style="width: 115px;" v-sf.receive_date_e></el-date-picker>
            </div>
        </search-card>
            <span class="tip">
                <span class="inline" >  <span class="box" style="background: #d0e5cb;"></span> <span class="fonts">：收件&nbsp;</span></span>
              <span class="inline"> <span class="box"></span> <span class="fonts" >：发件&nbsp;</span></span>
            </span>
    </div>
</template>
<style lang="stylus" scoped>
.p-search-ebay-inbox-search{
    position:relative;
    .tip{
        position: absolute;
        right: 5px;
        bottom:5px;
.box{
    display: inline-block;
    vertical-align: middle;
    line-height: 20px;
    height: 16px;
    width: 16px;
    background: white;
    border: 1px solid #A66F00;
}
    .fonts{
        display: inline-block;
        line-height: 20px;
        height: 20px;
        border: none;
        width: 40px;
        vertical-align: top;
        background: white;
    }
    }

}
</style>
<script>
    import labelButtons from "../../../../components/label-buttons.vue"
    import {
        api_message_countlevel,
        api_message_customer,
        api_ebay_message_accout,
        api_message_account,
        url_inner_list
    } from "../../../../api/inbox"
    import{mapGetters} from "vuex"
    export default{
        permission:{
            url_inner_list,
        },
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
                // showAll:false,
                handles:[
                    {name:"全部",value:''},
                    {name:"待处理",value:1},
                    {name:"已处理",value:2},
                    {name:"48小时未处理",value:11},
                ],
                priority:[],
                // littleAccount:[],
                boxs:[{name:"全部",value:0},
                    {name:"产品留言",value:1},
                    {name:"订单留言",value:2},
                    {name:"待配货订单留言",value:3},
                    {name:"其他",value:99},
                ],
                options:[],
                optionType:[
                    {label:"买家ID",value:"sender"},
                    {label:"刊登号",value:"item_id"},
                    {label:"交易号",value:"transaction_id"},
                ],
                clears:{},
                changeNum:0,
                clearSelect: false
            }
        },
        created(){
            this.get_account_level();
            this.get_customer();
            this.clears=clone(this.searchData);
        },
        computed:{
            ...mapGetters({currentUser:'user/info'}),
            changeLabel(){
            	let find = this.optionType.find(res=>{
            		return this.searchData.search_key === res.value;
                });
            	if(!!find){
            		return find.label;
                }
            }
        },
        methods:{
            select_handles(val){
                this.changeNum++;
                this.searchData.state=this.handles[val].value;
                if(this.changeNum>2){
                    this.$emit('get-account-all',true);
                    this.$emit("reflash")
                }
            },
            change_account(accounts) {
                this.searchData.account_id = accounts.map(a => a.value).join(',');
                this.$emit('get-account-all',true);
                this.$emit("reflash");
            },
            select_boxs(val){
                this.changeNum++;
                this.searchData.msg_type=this.boxs[val].value;
                if(this.changeNum>2){
                    this.$emit('get-account-all',true);
                    this.$emit("reflash")
                }
            },
            search(){
                this.$emit('get-account-all',true);
                this.$emit("reflash");
            },
            clear(){
                this.$emit("clear");

            },
            get_account_level(){
                this.priority=[];
                this.$http(api_message_countlevel).then(res=>{
                    this.priority=res.map(row=>{
                        return {
                            label:row.name,
                            value:row.id,
                            count:row.count_num
                        }
                    });
                })
            },
            get_customer(){
                this.options=[];
                this.$http(api_message_customer).then(res=>{
                    this.options= [{realname:'全部', username:'All', customer_id:''}, ...res];
                }).catch(code=>{
                    console.log(code)
               })
            }
        },
        props:{
            searchData:{
                required:true,
                type:Object,
            },
            markList:{
                required:true,
                type:Array
            },
            littleAccount:{
                required:true,
                type:Array
            }
        },
        components:{
            labelButtons,
            searchCard:require("../../../../components/search-card.vue").default,
            selectMoreButton: require('../../../entrepot/delivery/select-more-button').default,
        }
    }
</script>
