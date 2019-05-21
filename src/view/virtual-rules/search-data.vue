<template>
    <div class="c-search-card">
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears">
            <label-buttons label="平台：" :buttons="channelList"
                           @select="select_button"></label-buttons>
            <label-item label="规则名称：">
                <el-input class="s-width-super"
                          v-model="searchData.snText"
                          v-sf.snText></el-input>
            </label-item>
            <label-item label="创建人：" class="ml-sm">
                <param-account v-model="searchData.creator_id"
                               class="s-width-default"
                               v-sf.creator_id
                               :fixResult="fixResult_creator"
                               type="creatorList"
                               placeholder="请选择/输入..."
                               url="get|virtual-rules/creator"></param-account>
            </label-item>
            <label-item label="状态：" class="ml-sm">
                <el-select v-model="searchData.status"
                           class="s-width-small" v-sf.status
                           default-first-option filterable clearable>
                    <el-option
                            v-for="res in statusList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item label="有效期：" class="ml-sm">
                <el-date-picker
                        @keyup.enter.native="search"
                        type="date"
                        placeholder="开始时间"
                        v-sf.start_time
                        v-model="searchData.start_time"
                        class="date"
                        :picker-options="pickerStart"></el-date-picker>
                        <span>&nbsp;--&nbsp;</span>
                <el-date-picker
                    @keyup.enter.native="search"
                    type="date"
                    placeholder="结束时间"
                    v-sf.end_time
                    v-model="searchData.end_time"
                    class="date mr-sm"
                    :picker-options="pickerEnd"></el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return{
                chennelList:[],
                buttonsList:[],
                statusList:[
                    {label:'全部',value:''},
                    {label:'启用',value:0},
                    {label:'停用',value:1},
                ],
                pickerStart:{
                    disabledDate:(time)=>{
                        if(this.searchData.end_time){
                            return time.getTime()>this.searchData.end_time;
                        }else{
                            return false;
                        }
                    }
                },
                pickerEnd:{
                    disabledDate:(time)=>{
                        if(this.searchData.start_time){
                            return time.getTime()<this.searchData.start_time;
                        }else{
                            return false;
                        }
                    }
                }
            }
        },
        methods:{
            fixResult_creator(val){
                return val.map(row=>{
                    return{
                        label:row.create_name,
                        value:row.create_id,

                    }
                })
            },
            select_button(val){
                this.$emit('select-button',val);
            },
            search(){
                this.$emit('search');
            },

        },
        props:{
            /*清空时保留的默认数据*/
            clears:{
                type:Object
            },
            /*搜索字段*/
            searchData:{
                type:Object
            },
            /*平台字段*/
            channelList:{}
        },
        components:{
            searchCard:require('@/components/search-card.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            labelButtons:require('@/components/label-buttons.vue').default,
            paramAccount:require('@/api-components/param-account.vue').default,
        }
    }
</script>