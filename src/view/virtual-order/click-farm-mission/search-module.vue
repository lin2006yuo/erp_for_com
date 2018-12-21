<template>
    <div>
        <search-card :params="searchData" @search="search" @enter="search" :clears="clears">
            <div>
                <label-buttons label="状态："
                               :buttons="statusButtonList"
                               v-sf.status
                               @select="change_status"
                                class="inline mr-sm">
                </label-buttons>
                <label-buttons label="返款状态："
                               :buttons="refundStatusButtons"
                               @select="change_refund_status"
                               class="inline mr-sm">
                </label-buttons>
                <label-buttons  label="类型："
                                :buttons="typeButtonList"
                                v-sf.type
                                @select="change_type"
                                class="inline">
                </label-buttons>
            </div>
            <div class="mb-mini">
                <label-item label="任务编号：" class="mr-sm">
                    <el-input
                            class="inline width-sm"
                            placeholder="请输入编号..."
                            v-sf.number
                            v-model="searchData.number"></el-input>
                </label-item>
                <label-item label="" class="mr-sm">
                    <el-select class="inline s-width-mini mr-xs"
                               v-sf.type
                               v-model="searchData.snType">
                        <el-option v-for="item in snTypeList"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value"></el-option>
                    </el-select>
                    <el-input class="inline"
                              v-sf.snText
                              :placeholder="`请输入${placeHolder}`"
                              v-model="searchData.snText"></el-input>
                </label-item>
                <label-item label="平台：" class="mr-sm">
                    <el-select class="inline s-width-default"
                               v-sf.channel
                               v-model="searchData.channel">
                        <el-option v-for="item in channelList"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value"></el-option>
                    </el-select>
                </label-item>
                <label-item label="站点：" class="mr-sm">
                    <el-select class="inline s-width-default"
                               filterable clearable
                               :disabled="siteList.length<=1"
                               :placeholder="sitePlaceHolder"
                               v-sf.site
                               v-model="searchData.site">
                        <el-option v-for="item in siteList"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value"></el-option>
                    </el-select>
                </label-item>
                <label-item label="账号简称：" class="mr-sm">
                    <el-select class="inline s-width-default"
                               filterable clearable
                               :disabled="accountList.length<=1"
                               :placeholder="accountPlaceholder"
                               v-sf.account_id
                               v-model="searchData.account_id">
                        <el-option v-for="item in accountList"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value"></el-option>
                    </el-select>
                </label-item>
            </div>
            <div class="inline">
                <label-item label="销售员：" class="mr-sm">
                    <param-account
                            class="inline s-width-default"
                            ref="paramSale"
                            placeholder="输入搜索更多..."
                            v-model="searchData.seller_id"
                            v-sf.seller_id
                            :param="{type:'sales',data:{content:''}}"
                            :fixUrl="true"
                            :fixResult="sale_fix_result"
                            type="memberShipSales"
                            url="get|user/:type/staffs">
                    </param-account>
                </label-item>
                <label-item label="负责人：" class="mr-sm">
                    <param-account
                            class="inline s-width-default"
                            ref="paramSale"
                            placeholder="输入搜索更多..."
                            v-model="searchData.functionary_id"
                            v-sf.functionary_id
                            :param="{type:'virtual',data:{content:''}}"
                            :fixUrl="true"
                            :fixResult="virtual_fix_result"
                            type="memberShipVirtual"
                            url="get|virtual-order/principal-list">
                    </param-account>
                </label-item>
                <label-item label="" class="mr-sm">
                    <el-select class="inline s-width-default mr-xs"
                               v-sf.date_type
                               v-model="searchData.date_type">
                        <el-option v-for="item in dataTypeList"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value"></el-option>
                    </el-select>
                    <span>:</span>
                    <el-date-picker type="date"
                                    placeholder="开始时间"
                                    v-sf.date_start
                                    v-model="searchData.date_start"
                                    :picker-options="pickerStart"
                                    class="inline date mr-xs ml-xs"></el-date-picker>
                    <span>--</span>
                    <el-date-picker type="date"
                                    placeholder="结束时间"
                                    v-sf.date_end
                                    v-model="searchData.date_end"
                                    :picker-options="pickerEnd"
                                    class="inline date ml-xs"></el-date-picker>
                </label-item>
            </div>
        </search-card>
    </div>
</template>
<style lang="stylus" scoped>

</style>
<script>
    import {api_account_list} from '../../../api/click-farm-mission'
    export default {
        name: "search-module",
        refresh(){
            this.siteList=[{label:"",value:""}];
            this.accountList=[{label:"",value:""}];
        },
        data(){
          return {
              snTypeList: [
                  {label:"SKU",value:"sku"},
                  {label:"SPU",value:"spu"},
              ],
              dataTypeList: [
                  {label:"计划下单时间",value:1},
                  {label:"申请时间",value:2},
                  {label:"完成时间",value:3}
              ],
              siteList:[{label:"",value:""}],
              accountList:[{label:"",value:""}],
              pickerStart:{
                  disabledDate:(time)=>{
                      if(this.searchData.date_end){
                          return time.getTime()>this.searchData.date_end;
                      }else{
                          return false;
                      }
                  }
              },
              pickerEnd:{
                  disabledDate:(time)=>{
                      if(this.searchData.date_start){
                          return time.getTime()<this.searchData.date_start;
                      }else{
                          return false;
                      }
                  }
              }
          }
        },
        methods: {
            search(){//搜索
                this.$emit("search");
            },
            sale_fix_result(res){//销售员列表
                return  res.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
            },
            virtual_fix_result(val){//刷单员列表
                return val.map(res=>{
                    return {
                        label:res.realname,
                        value:res.id
                    }

                });
            },
            change_status(index){//状态改变
                this.$emit('change-status',index)
            },
            change_refund_status(index){//----返款状态改变
                this.$emit('change-status', index, 'refund')
            },
            change_type(index){//类型改变
                this.$emit('change-type',index)
            },
            get_site(channel) {//获取站点
                if(!channel)return this.siteList = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:channel}).then(res=>{
                    if(res.site.length<=0){
                        this.siteList = [{label:"",value:""}]
                    }else{
                        res = res.site;
                        this.siteList = [{label:"全部",value:""},...res];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_account(channel){//获取账号简称
                if(!channel)return this.accountList = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:channel}).then(res=>{
                    if(res.account.length>0){
                        res = res.account;
                        this.accountList = [{label:"全部",value:""},...res];
                    }else{
                        this.accountList = [{label:"",value:""}];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
        },
        watch: {
            'searchData.channel'(val){//监听平台的变化
                this.searchData.site = '';
                this.searchData.account_id = '';
                this.siteList = [{label: "", value: ""}];
                this.accountList = [{label: "", value: ""}];
                this.get_site(val);
                this.get_account(val)
            }
        },
        computed: {
            placeHolder(){
                let find = this.snTypeList.find(res=>{
                    return res.value === this.searchData.snType;
                });
                if(!!find){
                    return find.label;
                }
            },
            sitePlaceHolder(){
                if(this.searchData.channel<=0){
                    return "请先选择平台";
                }else if(this.siteList.length<=1){
                    return "该平台下暂无站点";
                }else{
                    return "请选择站点"
                }
            },
            accountPlaceholder() {
                if(this.searchData.channel<=0){
                    return "请先选择平台";
                }else if(this.accountList.length<=1){
                    return "该平台下暂无账号";
                }else{
                    return "请选择账号"
                }
            }
        },
        props: {
            searchData:{
                type: Object
            },
            clears: {
                type: Object
            },
            statusButtonList:{
                type: Array
            },
            typeButtonList:{
                type: Array
            },
            refundStatusButtons:{
                type: Array
            },
            channelList:{
                type: Array
            },
        },
        components: {
            labelButtons:require('../../../components/label-buttons.vue').default,
            searchCard:require('../../../components/search-card.vue').default,
            scrollSelect:require('../../../components/scroll-select.vue').default,
            labelItem:require('../../../components/label-item.vue').default,
            selectRemote:require('../../../components/select-remote.vue').default,
            paramAccount:require('../../../api-components/param-account.vue').default,
        },
    }
</script>