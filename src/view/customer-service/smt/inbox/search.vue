<template>
    <div class="p-search-aliexpress-inbox">
        <search-card @search="search" ref="search_card" :params="searchData" :clears="clears" @enter="search">
            <el-row>
                <label-buttons label="处理状态：" :buttons="handles" @select="select_handles" class="search-sm" v-sf.status></label-buttons>
                <select-more-button
                    label="账号："
                    label-width="120"
                    v-sf.account_id
                    class="mb-mini"
                    :button-list="accountList"
                    :clear-select="clearSelect"
                    @query="change_account">
                </select-more-button>
                <label-buttons label="优先级：" :buttons="priority" @select="select_priority" class="search-sm" v-sf.rank></label-buttons>
                <label-buttons label="站内信：" :buttons="boxs" @select="select_boxs" v-sf.msg_type></label-buttons>
            </el-row>
            <div class="inline">
                <el-select v-model="searchData.filter_type" placeholder="模糊搜索" class="inline s-width-default"  v-sf.filter_type>
                    <el-option
                            :key="item.value"
                            v-for="item in type"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-input  v-model="searchData.filter_text" :placeholder="`请输入${changeLabel}...`" class="inline s-width-large" v-sf.filter_text></el-input>
                <label class="ml-sm inline">客服账号：</label>
                <el-select v-model="searchData.customer_id" placeholder="请选择" class="inline s-width-large" filterable  v-sf.customer_id>
                    <el-option
                            :key="item.customer_id"
                            v-for="item in options"
                            :label="`${item.realname}/${item.username}`"
                            :value="item.customer_id">
                    </el-option>
                </el-select>
                <label class="ml-sm inline">信件状态：</label>
                <el-select v-model="searchData.read" placeholder="请选择" class="inline s-width-default"  v-sf.read>
                    <el-option
                            :key="item.value"
                            v-for="item in read"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="inline" slot="clear">
                <el-button class="inline ml-xs" size="mini" type="warning"
                           :disabled="!hasParams"
                           @click.native="clearParams"
                >清空条件
                </el-button>
                <permission
                    tag="request-button"
                    style="margin-left:7px;"
                    type="primary"
                    :disabled="searchData.account_id===''"
                    :route="apis.url_post_aliexpress_msg_sync"
                    req-key="url_post_aliexpress_msg_sync"
                    class="inline"
                    @click="sync_msg">同步站内信</permission>
            </div>
        </search-card>
        <span class="tip mt-xs mb-xs">
            <span class="inline"><span class="box" style="background: #d0e5cb;"></span> <span class="fonts">：收件&nbsp;</span></span>
            <span class="inline"> <span class="box"></span> <span class="fonts">：发件&nbsp;</span></span>
        </span>
    </div>
</template>
<style lang="stylus" scoped>
    .p-search-aliexpress-inbox{
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
        }
    }
</style>
<script>
    import {api_customer, url_smt_list,url_post_aliexpress_msg_sync,api_post_aliexpress_msg_sync} from '../../../../api/smt-mail'
    export default{
        permission:{
            url_smt_list,
            url_post_aliexpress_msg_sync
        },
        data(){
            return {
                handles:[
                    {name:"全部",value:''},
                    {name:"待处理",value:0},
                    {name:"已处理",value:1},
                    {name:"超48小时未处理留言",value:2}
                ],
                boxs:[{name:"全部",value:''},
                    {name:"产品留言",value:1},
                    {name:"订单留言",value:2},
                    {name:"未配货留言",value:3}
                ],
                type:[
                    {label:'平台订单号',value:'channel_order_id'},
                    {label:'买家账号',value:'buyer_id'},
                    {label:'订单号',value:'order_id'}
                ],
                read:[
                    {label:'全部',value:''},
                    {label:'未读',value:0},
                    {label:'已读',value:1}
                ],
                options:[],
                clears:{},
                moreSelect:false,
                selectAccounts:[],
                clearSelect: false
            }
        },
        mounted(){
            this.customer();
            this.clears=clone(this.searchData)
        },
        methods: {
          //获取客服账号
            customer(){
                this.$http(api_customer).then(res=>{
                    this.options= [{realname:'全部', username:'All', customer_id:''}, ...res];
                }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
            },
            select_handles(val){
                this.searchData.status = this.handles[val].value;
                this.$emit('get-priority');
                this.$emit('refresh');
            },
            change_account(accounts) {
                this.searchData.account_id = accounts.map(a => a.value).join(',');
                this.$emit('refresh');
            },
            select_priority(val){
                this.searchData.rank = this.priority[val].id;
                this.$emit('refresh');
            },
            select_boxs(val){
                this.searchData.msg_type = this.boxs[val].value;
                this.$emit('get-priority');
                this.$emit('refresh');
            },
            search(){
                this.$emit('get_priority');
                this.$emit('refresh');
            },
            clear(){
                this.$emit('clear');
            },
            clearParams(){
                this.$refs.search_card.clearParams();
            },
            sync_msg(){
                this.$http(api_post_aliexpress_msg_sync,{account_id:this.searchData.account_id}).then(res=>{
                    this.$message({type:'success',message:res.message||res});
                    this.$emit('refresh');
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_post_aliexpress_msg_sync',false)
                    },200);
                });
            }
        },
        filters: {},
        watch: {},
        computed: {
            hasParams(){
                return !!Object.values(this.searchData).find(val =>typeof val!=='object'&&!!val);
            },
            changeLabel(){
                let find = this.type.find(res=>{
                    return this.searchData.filter_type === res.value;
                });
                if(!!find){
                    return find.label;
                }
            }
        },
        props: {
            searchData:{},
            accountList:{
                type:Array,
                requried:true
            },
            priority:{}
        },
        components: {
            labelButtons:require('@/components/label-buttons').default,
            searchCard:require("@/components/search-card").default,
            selectMoreButton: require('../../../entrepot/delivery/select-more-button').default,
        }
    }
</script>
