<template>
    <el-row class="wish-searchList">
        <search-card @search="search_list" :params="searchData" :clears="clears">
                <label>站点：</label>
                <el-select v-model="searchData.site"
                           v-sf.site
                           class="inline mr-sm width-sm"
                           filterable @change="change">
                    <el-option
                        :key="item.value"
                        v-for="item in selectList"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <label>账号简称：</label>
                <super-select
                    storageKey="order_account"
                    class="inline mr-sm width-sm"
                    v-model="searchData.account_id"
                    v-sf.account_id
                    :is-paging="true"
                    :options='accoutOptions'
                ></super-select>
                <!--<el-select v-model="searchData.account_id "-->
                           <!--v-sf.account_id-->
                           <!--class="inline mr-sm width-sm"-->
                           <!--filterable clearable>-->
                    <!--<el-option-->
                        <!--:key="item.value"-->
                        <!--v-for="item in accoutOptions"-->
                        <!--:label="item.label"-->
                        <!--:value="item.value">-->
                    <!--</el-option>-->
                <!--</el-select>-->
                <el-select v-model="searchData.snType"
                           v-sf.snType
                           filterable
                           class="inline width-sm">
                    <el-option
                        :key="item.value"
                        v-for="item in snTypeList"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <order-input v-model="searchData.snText"
                             class="inline width-super mr-sm"
                             v-sf.snText
                             @keydown="search_list"
                             placeholder="可批量搜索，Shift+回车换行...">
                </order-input>
                <label>销售员：</label>
                <super-select
                    storageKey="order_staffs"
                    class="inline s-width-small"
                    v-model="searchData.seller"
                    v-sf.seller
                    :placeholder="'可输入搜索'"
                    :is-paging="true"
                    :adjustStructure="sale_fix_result"
                    :remoteRequestHttp="remoteRequestHttp"
                ></super-select>
                <!--<param-account-->
                    <!--class="inline s-width-small"-->
                    <!--placeholder="选择/搜索"-->
                    <!--v-model="searchData.seller"-->
                    <!--v-sf.seller-->
                    <!--:param="{type:'sales',data:{content:''}}"-->
                    <!--:fixUrl="true"-->
                    <!--:fixResult="sale_fix_result"-->
                    <!--type="memberShipSales"-->
                    <!--url="get|user/:type/staffs">-->
                <!--</param-account>-->
                <el-select v-model="searchData.time_type"
                           v-sf.time_type
                           class="inline width-sm ml-sm">
                    <el-option
                        :key="item.value"
                        v-for="item in select_time"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-date-picker
                    @keyup.enter.native="search_list"
                    type="date"
                    placeholder="开始时间"
                    v-model="searchData.date_b"
                    v-sf.date_b
                    class="inline"
                    :picker-options="pickerOptions"
                    style="width:140px">
                </el-date-picker>&nbsp;--
                <el-date-picker type="date"
                                @keyup.enter.native="search_list"
                                placeholder="结束时间"
                                v-model="searchData.date_e"
                                v-sf.date_e
                                :picker-options="pickerOptions1"
                                class="inline mr-sm"
                                style="width:140px">
                </el-date-picker>
        </search-card>
    </el-row>
</template>
<style lang="stylus">
    .wish-searchList{
        .el-card{
            overflow: inherit;
        }
    }
</style>
<script>
    import {api_order_shopee_getAccount,api_shopee_account_site} from '../../../../api/order_shopee';
    import {http} from '../../../../lib/http-plus';
    export default{
        data(){
            return {
                accoutOptions:[],
                select_time: [
                    {id:1,label:"下单时间",value:"pay_time"},
                    {id:2,label:"支付时间",value:"order_time"},
                ],
                snTypeList:[
                    {id:1,label:"订单号",value:"order_number"},
                    {id:2,label:"平台订单号",value:"channel_order_number"},
                    {id:3,label:"买家ID",value:"buyer_id"},
                    // {id:4,label:"目的地",value:"phone"},
                    {id:5,label:"跟踪单号",value:"tracking_no"},
                    {id:6,label:"sku",value:"sku"}
                ],
                selectList:[],
                pickerOptions:{
                    disabledDate:(time)=>{
                        return time.getTime() >new Date()
                    }
                },
                pickerOptions1:{
                    disabledDate: (time) => {
                        return time.getTime() > new Date().getTime() || time.getTime() < this.searchData.date_b;
                    }
                }
            }
        },
        mounted(){
            this.getAccount();
            this.getSite();
        },
        methods:{
            remoteRequestHttp(){
                return http("get|user/sales/staffs",{content:''})
            },
            sale_fix_result(res){
                let data=res.map(row => {
                    return {
                        label: row.realname,
                        value: row.id,
                    }
                });
                return {
                    count:data.length,
                    data:data
                }
            },
            change(val){
                this.$http(api_order_shopee_getAccount,{site_code: val}).then(res=>{
                    if(res.account.length === 0){
                        this.accoutOptions = res.account;
                    }else{
                        this.accoutOptions = [{label:'全部',value:''},...res.account];
                    }
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                });
            },
            getAccount(){
                this.$http(api_order_shopee_getAccount).then(res=>{
                    this.accoutOptions = [{label:'全部',value:''},...res.account];
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            getSite(){
                this.$http(api_shopee_account_site).then(res => {
                    this.selectList = res.map(row => {
                        return {
                            label: row.name,
                            value: row.code,
                            id: row.id
                        }
                    });
                    this.selectList.unshift({label: '全部', value: ''})
                })
            },
            search_list(){
                this.$emit('search_list')
            },
        },
        props:{
            searchData:{
                required:true,
                type:Object
            },
            clears:{
                required:true,
                type:Object
            }
        },
        components: {
            searchCard:require('../../../../components/search-card.vue').default,
            orderInput:require('../../../../components/order-input.vue').default,
            paramAccount:require('../../../../api-components/param-account.vue').default,
        }
    }
</script>
