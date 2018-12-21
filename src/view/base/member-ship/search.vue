<template>
    <div class="p-search-member">
        <search-card @search="search" @enter='search' :params="searchData" :clears="clears">
                <label class="inline">平台：</label>
                <el-select v.sf.channel_id v-model="searchData.channel_id"
                           class="inline s-width-default"
                           @change="change_channelid">
                    <el-option
                            v-for="item in channels"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <label class="ml-sm inline">账号简称：</label>
                <param-account
                        class="mr-sm s-width-default"
                        ref="paramAccount"
                        v-sf.account_id
                        v-model="searchData.account_id"
                        :disabled="searchData.channel_id===''"
                        :param="accountParam"
                        :refresh="true"
                        :fixResult="account_fix_result"
                        type="memberShipAccount"
                        url="get|orders/account">
                </param-account>
                <el-select v-sf.snType v-model="searchData.snType"
                           @change="change_type"
                           class="inline width-xs" >
                    <el-option
                            v-for="item in option"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <param-account
                        v-if="searchData.snType==='sales'"
                        ref="paramSale"
                        v-sf.snText
                        v-model="searchData.snText"
                        :param="{type:'sales',data:{content:''}}"
                        :fixUrl="true"
                        :fixResult="sale_fix_result"
                        type="memberShipSales"
                        url="get|user/:type/staffs">
                </param-account>
                <param-account
                        v-if="searchData.snType==='customer'"
                        ref="paramCustomer"
                        v-sf.snText
                        v-model="searchData.snText"
                        :param="{type:'customer',data:{content:''}}"
                        :fixUrl="true"
                        :fixResult="sale_fix_result"
                        type="memberShipCustomer"
                        url="get|user/:type/staffs">
                </param-account>
            <div class="mr-sm inline"></div>
                <!--<el-button size="mini"  @click="search" type="primary" class="inline ml-sm">搜索</el-button>-->
                <!--<el-button  size="mini" @click="clear" class="inline ml-sm">清空搜索</el-button>-->
        </search-card>

    </div>
</template>
<style lang="stylus">
    .p-search-member{
    .el-card{
        overflow: inherit;
    }
    }
</style>
<script>
    import {api_channels,api_product_account} from "../../../api/member"
    import {api_product_person,} from "../../../api/product-class"
    export default{
        data(){
            return {
                channels:[],
                option:[{label:"销售员",value:"sales"},{label:"客服",value:"customer"}],
                accountParam:{
                    channel_id:'',
                },
                clears:{
                    snType:"sales",
                    snText:"",
                    channel_id:"",
                    account_id:"",
                    page:1,
                    pageSize:50,
                }
            }
        },
        created(){
            this.$http(api_channels).then(res=>{
                this.channels=[{value:"",label:"全部"},...res];
            }).catch(code=>{
                console.log(code.message||code)
            });
        },
        computed: {
            isDisable(){
                if(this.searchData.channel_id){
                    return false
                }else {
                    return true
                }
            },
        },
        methods: {
            account_fix_result(res){
                    return res.account
            },
            sale_fix_result(res){
            return  res.map(row=>{
                        return {
                            value:row.id,
                            label:row.realname
                        }
                    })
            },
            //过滤 账户
            change_type(){
                this.searchData.snText="";
                if(this.searchData.snType==='sales'){
                    this.$refs.paramSale.init();
                }else {
                    this.$refs.paramCustomer.init();
                }
            },
            change_channelid(){
                this.searchData.account_id="";
                this.accountParam.channel_id=this.searchData.channel_id;
                this.$refs.paramAccount.init();
            },
            search(){
                this.$emit("search");
            },
            clear(){
                this.$emit("clear");
            },
        },
        filters: {},
        watch: {},
        props: {
            searchData:{
                required:true,
                type:Object
            }
        },
        components: {
            paramAccount:require("../../../api-components/param-account.vue").default,
            searchCard:require('../../../components/search-card.vue').default
        }
    }
</script>
