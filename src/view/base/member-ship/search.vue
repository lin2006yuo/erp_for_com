<template>
    <div class="p-search-member">
        <search-card @search="search" @enter='search' :params="searchData" :clears="clears">
            <label-item label="平台：">
                <super-select   v-model="searchData.channel_id"
                                class="inline s-width-default"
                                :options="channel"
                                @change="change_channelid"
                                storageKey="memberShipChannelSelect-1">
                </super-select>
            </label-item>
            <label-item label="账号简称：" class="ml-sm">
                <el-select v-model="searchData.account_type" v-sf.searchType
                           @change="change_search_type"
                           class="inline s-width-mini"
                           default-first-option>
                    <el-option
                            v-for="res in searchTypeList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                    ></el-option>
                </el-select>

                <super-select   v-model="searchData.account_id"
                                :disabled="searchData.channel_id===''"
                                class="s-width-large ml-mini"
                                :placeholder="typeHolder"
                                :options="accountOptions"
                                storageKey="memberShipAccountSelect-2">
                </super-select>
                <order-input v-model="searchData.account_code"
                             v-if="searchData.account_type === 2&&searchData.channel_id !== ''"
                             @keydown="search"
                             @input="account_change"
                             class="inline s-width-large ml-mini"
                             placeholder="空格分隔可批量搜索"></order-input>
                <el-input disabled class="inline s-width-large ml-mini" v-if="searchData.account_type === 2&&searchData.channel_id === ''" placeholder="请先选择平台"></el-input>
            </label-item>
            <label-item label="店铺简称：" class="ml-sm" v-show="isJoom">

                <!--<el-select  v-model="searchData.shop_id"  -->
                            <!--:disabled="!choseAccount"-->
                            <!--class="s-width-default"-->
                            <!--placeholder="请先选择账号简称">-->
                    <!--<el-option  v-for="option of shopOptions"-->
                                <!--:label="option.label"-->
                                <!--:value="option.value"-->
                                <!--:key="option.value">-->
                    <!--</el-option>-->
                <!--</el-select>-->
                <super-select
                    v-model="searchData.shop_id"
                    :disabled="!choseAccount"
                    class="s-width-default"
                    placeholder="请先选择账号简称"
                    :options="shopOptions"
                    storageKey="memberShipAccountShopName"
                  >
                </super-select>

            </label-item>
            <label-item label="" class="ml-sm">
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

                <super-select
                    class="s-width-large ml-mini"
                    v-model="searchData.snText"
                    :options="listSalesServer"
                    storageKey="platformSalesServer"
                   >
                </super-select>
                <!--<param-account-->
                        <!--v-if="searchData.snType==='sales'"-->
                        <!--class="s-width-large ml-mini"-->
                        <!--ref="paramSale"-->
                        <!--v-sf.snText-->
                        <!--v-model="searchData.snText"-->
                        <!--:param="{type:'sales',data:{content:''}}"-->
                        <!--:fixUrl="true"-->
                        <!--:fixResult="sale_fix_result"-->
                        <!--type="memberShipSales"-->
                        <!--url="get|user/:type/staffs">-->
                <!--</param-account>-->
                <!--<param-account-->
                        <!--v-if="searchData.snType==='customer'"-->
                        <!--class="s-width-large ml-mini"-->
                        <!--ref="paramCustomer"-->
                        <!--v-sf.snText-->
                        <!--v-model="searchData.snText"-->
                        <!--:param="{type:'customer',data:{content:''}}"-->
                        <!--:fixUrl="true"-->
                        <!--:fixResult="sale_fix_result"-->
                        <!--type="memberShipCustomer"-->
                        <!--url="get|user/:type/staffs">-->
                <!--</param-account>-->
            </label-item>
            <div class="mr-sm inline"></div>
        </search-card>

    </div>
</template>
<style lang="stylus">
    .p-search-member{
        .el-card{
            overflow: inherit;
        }
        .el-select__tags{
            height: 30px!important;
            width: 180px
            overflow-y: auto;
            >span{
                white-space: inherit;
            }
        }
    }
</style>
<script>
    import {api_channels,api_product_account,api_get_shop,api_sales_list,api_customer_list} from "../../../api/member"
    import {api_product_person,} from "../../../api/product-class"
    export default{
        data(){
            return {
                searchTypeList:[
                    {label:'选择',value: 1},
                    {label:'文本',value: 2},
                ],
                option:[{label:"销售员",value:"sales"},{label:"客服",value:"customer"}],
                accountParam:{
                    channel_id:'',
                },
                clears:{
                    snType:"sales",
                    snText:'',
                    channel_id:"",
                    account_type: 1,
                    account_id:'',
                    account_code: '',
                    page:1,
                    pageSize:50,
                },
                shopOptions:[],
                accountOptions:[],
                salesOptions:[],
                customerOptions:[],
                isJoom:false,
                choseAccount:false,
                listSalesServer:[],
            }
        },
        created(){
            // 得到销售人员
            this.$http(api_sales_list,{data:{content:''}})
              .then(res=>{
                this.salesOptions=res.map(item=>{
                    return {label:item.realname,value:item.id};
                });
                //   初始赋值的是销售员。
                 this.listSalesServer = this.salesOptions;
            });
            // 得到客服人员
            this.$http(api_customer_list,{data:{content:''}})
                .then(res=>{
                    this.customerOptions=res.map(item=>{
                        return {label:item.realname,value:item.id};
                    })
                })
        },
        computed: {
            isDisable(){
                if(this.searchData.channel_id){
                    return false
                }else {
                    return true
                }
            },
            typeHolder(){
                if(this.searchData.channel_id === ''){
                    return '请先选择平台'
                }else{
                    return '输入搜索更多'
                }
            }
        },
        methods: {
            change_search_type(){
                this.searchData.account_id = '';
                this.searchData.account_code = '';
            },
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
            //切换 账户
            change_type(){
                this.searchData.snText='';
                if(this.searchData.snType==='sales'){
                    this.listSalesServer = this.salesOptions
                } else {
                    this.listSalesServer = this.customerOptions;
                }
            },
            change_channelid(val){
                this.searchData.account_id='';
                this.accountParam.channel_id=this.searchData.channel_id;
                this.get_account();
               
               if(val===7){
                    this.isJoom=true;
                }
                else{
                    this.isJoom=false;
                }
            },
            get_account(){
                this.$http(api_product_account,this.accountParam)
                    .then(res=>{
                        this.accountOptions=res.account.map(item=>{
                            return {label:item.label,value:item.value};
                        })
                    })
                    .catch(err=>{
                        console.log(err.message);
                    })
            },
            search(){
                this.$emit("search");
            },
            account_change(val){
                if(val){
                    this.searchData.shop_id=0;
                    this.choseAccount=true;
                }
                else{
                    this.searchData.shop_id="";
                    this.choseAccount=false;
                } 
            }
        },
        filters: {},
        watch: {
            searchData:{
                deep:true,
                handler(){
                    if(this.searchData.account_id){
                        this.$http(api_get_shop,{channel_id:7,account_id:this.searchData.account_id})
                        .then(res=>{
                            this.shopOptions=[{value:0,label:"全部"},...res];
                        })
                        .catch(code=>{
                            console.log(code.message||code)
                        });
                    }
                }
            }
        },
        props: {
            searchData:{
                required:true,
                type:Object
            },
            channel:{
                type: Array,
                required:true,
            },
        },
        components: {
            paramAccount:require("../../../api-components/param-account.vue").default,
            searchCard:require('@/components/search-card.vue').default,
            orderInput:require("@/components/order-input.vue").default,
            labelItem:require("@/components/label-item.vue").default,
        }
    }
</script>
