<template>
    <el-row class="wish-searchList">
        <search-card @search="search" :params="searchData" :clears="clears">
            <el-row>
                <label-buttons label="订单状态："
                               :buttons="buttonList"
                               @select="change_select"></label-buttons>
            </el-row>
            <el-select v-model="searchData.snType"
                       v-sf.snType
                       class="inline s-width-default">
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
                         @keydown="search"
                         placeholder="可批量搜索，Shift+回车换行..."></order-input>
            <label>账号简称：</label>
            <el-select v-model="searchData.account_id"
                       v-sf.account_id
                       class="inline mr-sm"
                       style="width: 115px;" filterable clearable>
                <el-option
                        :key="item.value"
                        v-for="item in selectList"
                        :label="item.label"
                        :value="item.value"
                ></el-option>
            </el-select>
            <label>下单时间：</label>
            <el-date-picker
                    @keyup.enter.native="search"
                    type="date"
                    placeholder="开始时间"
                    v-model="searchData.date_b"
                    v-sf.date_b
                    class="inline"
                    :picker-options="pickerBegin"
                    style="width:140px"></el-date-picker>&nbsp;--
            <el-date-picker type="date"
                            @keyup.enter.native="search_list"
                            placeholder="结束时间"
                            v-model="searchData.date_e"
                            v-sf.date_e
                            :picker-options="pickerEnd"
                            class="inline mr-sm"
                            style="width:140px"></el-date-picker>
        </search-card>
    </el-row>
</template>
<style lang="stylus" scoped>
    .wish-searchList{
        .el-card{
            overflow: inherit;
        }
    }
</style>
<script>
    import {api_account_list} from '../../.././../api/order_vova';
    export default {
        name: "search-module",
        data(){
            return {
                selectList:[],
                snTypeList:[
                    {id:1,label:"订单号",value:"order_id"},
                    {id:2,label:"买家姓名",value:"name"},
                    {id:3,label:"平台sku",value:"sku"},
                    {id:4,label:"买家电话",value:"phone"},
                    {id:5,label:"追踪号",value:"tracking_number"}
                ],
                pickerBegin:{
                    disabledDate:(time)=>{
                        if (this.searchData.date_e) {
                            return time.getTime() > this.searchData.date_e;
                        } else {
                            return false;
                        }
                    }
                },
                pickerEnd:{
                    disabledDate: (time) => {
                        if (this.searchData.date_b) {
                            return time.getTime() < this.searchData.date_b;
                        } else {
                            return false;
                        }
                    }
                }

            }
        },
        mounted(){
            this.get_account();
        },
        methods:{
            get_account(){
                this.$http(api_account_list, {channel_id: 12}).then(res=>{
                    this.selectList = res.account;
                    this.selectList.unshift({label:'全部',value:''})
                }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
            },
            change_select(select,item){
                this.$emit('select',item)
            },
            search(){
                this.$emit('search')
            },
        },
        props: {
            buttonList: {
                required:true,
                type:Array
            },
            searchData: {
                required: true,
                type: Object
            },
            clears: {
                required: true,
                type: Object
            }
        },
        components:{
            labelButtons:require('../../../../components/label-buttons.vue').default,
            searchCard:require('../../../../components/search-card.vue').default,
            orderInput:require('../../../../components/order-input.vue').default,
        }
    }
</script>