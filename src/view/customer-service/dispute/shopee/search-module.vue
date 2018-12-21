<template>
    <div class="p-search-module">
        <search-card :params="searchData" :clears="clears" @search="search" @enter="search">
            <el-row>
                <label-buttons class="inline mr-sm" label="纠纷类型：" :buttons="typeBtn" @select="select_type"></label-buttons>
                <label-buttons class="inline" label="处理状态：" :buttons="statusBtn" @select="select_status"></label-buttons>
            </el-row>
            <label>账号简称：</label>
            <el-select v-model="searchData.account_id" class="inline s-width-default" filterable v-sf.account_id>
                <el-option
                        :key="item.value"
                        v-for="item in accountList"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <label class="ml-sm">订单号：</label>
            <el-input class="inline s-width-large" v-model="searchData.ordersn" placeholder="请输入订单号" v-sf.ordersn></el-input>
            <label class="inline ml-sm">发起时间：</label>
            <el-date-picker type="date" placeholder="开始时间" v-model="searchData.time_start"  :picker-options="pickerstart" class="inline date" style="width:140px" v-sf.time_start></el-date-picker>&nbsp;--&nbsp;
            <el-date-picker type="date" placeholder="结束时间" v-model="searchData.time_end" :picker-options="pickerend"  class="inline mr-sm" style="width:140px" v-sf.time_end></el-date-picker>
        </search-card>
    </div>
</template>

<style lang="stylus" scoped>

</style>

<script>
    import {api_get_account} from '../../../../api/dispute';
    export default {
        name: "search-module",
        data () {
            return {
                typeBtn: [//纠纷类型申请按钮组
                    {label: "订单取消申请",value: 1},
                    {label: "退款/退货申请",value: 2}
                ],
                accountList: [],//账号简称数据
                searchOptions: [],//搜索类型数据
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
            }
        },
        mounted(){
            this.get_account();
        },
        methods: {
            search(){
                this.$emit('search')
            },

            //切换纠纷类型
            select_type(index){
                this.$emit('select-type',this.typeBtn[index].value)
            },

            //切换处理状态
            select_status(index){
                this.$emit('select-status',this.statusBtn[index].value)
            },

            //获取Shopee账号数据
            get_account(){
                this.$http(api_get_account,{channel_id:9}).then(res=>{
                    this.accountList = res.account;
                    this.accountList.unshift({label:'全部',value:''})
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            }
        },
        props: {
            searchData:{
                require: true,
                type: Object
            },
            clears:{
                require: true,
                type: Object
            },
            statusBtn:{
                require: true,
                type: Array
            }
        },
        components: {
            searchCard:require("../../../../components/search-card.vue").default,
            labelButtons:require('../../../../components/label-all-buttons.vue').default,
        }
    }
</script>