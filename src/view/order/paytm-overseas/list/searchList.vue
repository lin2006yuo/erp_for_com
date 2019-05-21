<template>
        <div class="paytm-overseas-search">
            <search-card @search="search_list" :params="searchData" :clears="clears">
                <label>账号简称：</label>
                <el-select v-model="searchData.account_id"
                           v-sf.account_id
                           class="inline"
                           style="width: 115px;" filterable>
                    <el-option
                            :key="item.value"
                            v-for="item in selectList"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                </el-select>
                <el-select v-model="searchData.snType"
                           v-sf.snType
                           class="inline ml-sm" style="width:105px">
                    <el-option
                        :key="item.value"
                        v-for="item in snTypeList"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <order-input v-model="searchData.snText"
                             class="inline width-super mr-sm"
                             v-sf.snText
                             @keydown="search_list"
                             placeholder="可批量搜索，Shift+回车换行..."></order-input>
                <label class="ml-sm">销售员：</label>
                <el-select v-model="searchData.seller"
                           v-sf.seller
                           filter clearable
                           class="inline"
                           style="width: 115px;" filterable>
                    <el-option
                        :key="item.value"
                        v-for="item in salersList"
                        :label="item.realname"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <el-select v-model="searchData.time_type"
                           v-sf.time_type
                           @change="change_type"
                           class="inline ml-sm"
                           style="width: 115px;" filterable>
                    <el-option
                        :key="item.value"
                        v-for="item in dataType"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <el-date-picker
                        @keyup.enter.native="search_list"
                        type="date"
                        placeholder="开始时间"
                        v-model="searchData.date_b"
                        v-sf.date_b
                        class="inline "
                        :picker-options="pickerOptions"
                        style="width:140px"></el-date-picker>&nbsp;--
                <el-date-picker type="date"
                                @keyup.enter.native="search_list"
                                placeholder="结束时间"
                                v-model="searchData.date_e"
                                v-sf.date_e
                                :picker-options="pickerOptions1"
                                class="inline"
                                style="width:140px"></el-date-picker>
            </search-card>
        </div>
</template>
<style lang="stylus">
    .paytm-overseas-search{
        .el-card{
            overflow: inherit;
        }
    }
</style>
<script>
    import {api_order_paytm_getAccount,api_get_fbp_orders_salers} from '../../../../api/order_paytm'
    export default{
        data(){
            return {
              isBatch:false,
                dataType:[
                    {label:"下单时间",value:"order_time"},
                    {label:"支付时间",value:"pay_time"},
                ],
            // {id:3,label:"买家ID",value:"buyer_id"},
              snTypeList:[
                  {id:1,label:"订单号",value:"order_number"},
                  {id:2,label:"平台订单号",value:"channel_order_number"},
                  {id:4,label:"目的地",value:"target"},
                  {id:5,label:"跟踪单号",value:"tracking_number"},
                  {id:6,label:"SKU",value:"sku"},
              ],
              salersList:[],
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
                this.get_sallers();
        },
        methods:{
            change_type(){
                this.searchData.date_b='';
                this.searchData.date_e='';
            },
            get_sallers(){
                this.$http(api_get_fbp_orders_salers).then(res=>{
                    this.salersList = res
                }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
            },
            paytm_fix_result(res){
                return  res.map(row=>({
                    value:row.id,
                    label:row.realname
                }))
            },
            getAccount(){
                this.$http(api_order_paytm_getAccount, {channel_id: 10,mode:1}).then(res=>{
                    this.selectList = res.account;
                    this.selectList.unshift({label:'全部',value:''})
                }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
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
            orderInput:require('@/components/order-input.vue').default,
            paramAccount:require('../../../../api-components/param-account.vue').default,
        }
    }
</script>
