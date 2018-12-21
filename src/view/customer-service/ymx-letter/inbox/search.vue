<template>
    <div class="p-search-amazon-inbox">
        <search-card :params="searchData" :clears="clears" @search="search" @enter="search">
            <el-row>
                <label-buttons label="邮件分类：" :buttons="handles" @select="select_handles" class="inline mr-sm" v-sf.box_id></label-buttons>
                <label-buttons label="回复状态：" :buttons="priority" @select="select_priority" class="inline  mr-sm" v-sf.is_replied></label-buttons>
                <label-buttons label="需优先回复邮件：" :buttons="boxs" @select="select_boxs" class="inline  mr-sm" v-sf.order_status></label-buttons>
                <label-buttons label="读取状态：" :buttons="reads" @select="select_read" class="inline" v-sf.is_read></label-buttons>
            </el-row>
            <el-row>
                <select-more-button
                    label="账号："
                    label-width="120"
                    v-sf.account_code
                    class="mb-mini"
                    :button-list="accountList"
                    :clear-select="clearSelect"
                    @query="change_account">
                </select-more-button>
            </el-row>
            <div class="inline">
                <el-select v-model="searchData.option_field" placeholder="请选择" class="inline s-width-default"  v-sf.option_field>
                    <el-option
                            :key="item.value"
                            v-for="item in optionType"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-input  v-model="searchData.option_value" :placeholder="`请输入${changeLabel}...`" class="inline s-width-large" v-sf.option_value></el-input>
                <label class="ml-sm inline">客服账号：</label>
                <el-select v-model="searchData.customer_id" placeholder="请选择" class="inline s-width-middle"  filterable v-sf.customer_id>
                    <el-option
                            :key="item.customer_id"
                            v-for="item in options"
                            :label="`${item.realname}/${item.username}`"
                            :value="item.customer_id">
                    </el-option>
                </el-select>
                <label class="ml-sm inline">标签类型：</label>
                <el-select v-model="searchData.flag_id" placeholder="请选择" class="inline s-width-middle" clearable filterable v-sf.flag_id>
                    <el-option
                        :key="item.value"
                        v-for="item in markList"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <label class="ml-sm inline">站点：</label>
                <el-select v-model="searchData.site" placeholder="请选择" class="inline  mr-sm s-width-middle" clearable filterable v-sf.site>
                    <el-option
                        :key="item.value"
                        v-for="item in siteList"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="searchData.time_field" placeholder="请选择" class="inline s-width-default"  v-sf.time_field>
                    <el-option
                            :key="item.value"
                            v-for="item in timers"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-date-picker type="date" placeholder="开始时间" v-model="searchData.time_start"   :picker-options="pickerstart"
                                class="inline date" v-sf.time_start ></el-date-picker>&nbsp;--&nbsp;
                <el-date-picker type="date" placeholder="结束时间" v-model="searchData.time_end"
                                class="inline date mr-sm"   :picker-options="pickerend" v-sf.time_end></el-date-picker>
                <div class="br-show" style="height: 3px;display: none"></div>
            </div>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_customer,api_amazon_emails_site} from "../../../../api/letter-amazon"
    export default{
        permission:{
        },
        data(){
            return{
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.time_end){
                            return  time.getTime() > this.searchData.time_end.getTime()
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.time_start){
                            return time.getTime() < this.searchData.time_start.getTime()
                        }else {
                            return false
                        }

                    }
                },
                handles:[
                    {name:"全部",value:''},
                    {name:"系统邮件",value:1},
                    {name:"客服邮件",value:2},
                ],
                priority:[{name:"全部",value:''},
                    {name:"未回复",value:0},
                    {name:"已回复",value:1},
                    {name:"不需要回复",value:2},
                    {name:"超24小时未回复",value:21},
                    {name:"24小时内未回复",value:22},
                ],
                boxs:[{name:"全部",value:''},
                    {name:"待配货",value:1},
                    {name:"退货申请",value:2},
                    {name:"待发货",value:3},
                    {name:"取消订单",value:4},
                ],
                reads:[
                    {name:"全部",value:''},
                    {name:"已读",value:1},
                    {name:"未读",value:0},
                ],
                options:[],
                optionType:[
                    {label:"平台订单号",value:"platform_order_no"},
                    {label:"客户邮箱",value:"customer_email"},
                    {label:"客户ID",value:"buyer_id"},
                    {label:"客户姓名",value:"buyer_name"},
                    {label:"系统订单号",value:"system_order_number"},
                ],
                timers:[
                    {label:"收取时间",value:'sync_time'},
                    {label:"回复时间",value:'reply_time'},
                ],
                siteList:[],
                clears:{},
                moreSelect:false,
                selectAccounts:[],
                clearSelect: false
            }
        },
        created(){
            this.get_customer()
        },
        mounted(){
            this.clears=clone(this.searchData);
            this.get_site();
        },
        methods:{
            get_site(){
                this.$http(api_amazon_emails_site).then(res=>{
                    this.siteList = [{label:'全部',value:''},...res.map(site=>({label:site.label,value:site.label}))];
                }).catch(code=>{
                    console.log(code)
                });
            },
            init_status_btn(){
                let curBtn = this.handles;
                let priorityBtn = this.priority;
                let boxsBtn = this.boxs;
                let readsBtn = this.reads;
                this.handles = [];
                this.priority = [];
                this.boxs = [];
                this.reads = [];
                this.$nextTick(()=>{
                    this.handles = curBtn;
                    this.priority = priorityBtn;
                    this.boxs = boxsBtn;
                    this.reads = readsBtn;
                });
            },
            account_fix_result(res){
                return res.account
            },
            select_handles(val){
                this.searchData.box_id=this.handles[val].value
                this.$emit("reflash")
            },
            select_priority(val){
                this.searchData.is_replied=this.priority[val].value
                this.$emit("reflash")
            },
            select_boxs(val){
                this.searchData.order_status=this.boxs[val].value
                this.$emit("reflash")
            },
            select_read(val){
                this.searchData.is_read=this.reads[val].value
                this.$emit("reflash")
            },
            change_account(accounts) {
                this.searchData.account_code = accounts.map(a => a.value).join(',');
                this.$emit("reflash");
            },
            search(){
                this.$emit("reflash");
            },
            clear(){
                this.$emit("clear")
            },
            get_customer(){
                this.options=[]
                    this.$http(api_customer).then(res=>{
                        this.options= [{realname:'全部', username:'All', customer_id:''}, ...res];
                    }).catch(code=>{
                        console.log(code)
                   })
            }
        },
        filters:{
        },
        watch:{
        },
        computed:{
            changeLabel(){
                let find = this.optionType.find(res=>{
                    return this.searchData.option_field === res.value;
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
            },
            markList:{
                required:true,
                type:Array
            },
            accountList:{
                required:true,
                type:Array
            }
        },
        components:{
            labelButtons:require('@/components/label-buttons').default,
            paramAccount:require('../../../../api-components/param-account.vue').default,
            searchCard:require("../../../../components/search-card.vue").default,
            selectMoreButton: require('../../../entrepot/delivery/select-more-button').default,
        }
    }
</script>
