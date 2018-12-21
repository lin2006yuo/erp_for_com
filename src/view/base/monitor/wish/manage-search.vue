<template>
    <search-card @search="search" :params="searchData" :clears="clears">
        <label-item label="账号简称：" class="inline">
            <param-account v-sf.account_id  v-model="searchData.account_id"
                           type="monitorWish"
                           url="get|wish-account-health/account"
                           clearabled
                           :refresh="true"
                           :fixResult="fixAccount"
                           placeholder="全部"
                           class="mr-sm s-width-default">
            </param-account>
        </label-item>
        <label-item label="登录验证状态：" class="inline ml-sm mr-sm">
            <el-select  v-sf.health_status v-model="searchData.health_status" class="inline width-md">
                <el-option
                        :key="item.value"
                        v-for="item in status"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="抓取时间：" class="inline ml-sm mr-sm">
            <el-date-picker
                    class="date"
                    clearable
                    v-sf.time_start
                    v-model="searchData.time_start"
                    type="date"
                    placeholder="开始时间"
                    :picker-options="inputTimeStart">
            </el-date-picker>
            <span>&nbsp;--&nbsp;</span>
            <el-date-picker
                    class="date"
                    clearable
                    v-sf.time_end
                    v-model="searchData.time_end"
                    type="date"
                    placeholder="结束时间"
                    :picker-options="inputTimeEnd">
            </el-date-picker>
        </label-item>
     </search-card>
</template>
<style lang="stylus" scoped>
</style>
<script>
    import {api_wish_acount} from '@/api/monitor-wish'
    export default {
        name: "manageSearch",
        data() {
            return {
                clears:{
                    health_status:'',
                    account_id:'',
                    time_start:'',
                    time_end:'',
                },
                accountLists:[],//账号简称
                status:[
                    {label:"全部",value:""},
                    {label:"账号资料不完整",value:0},
                    {label:"有效",value:1},
                    {label:"无效",value:2},
                    {label:"连接不上服务器",value:3},
                ],
                inputTimeStart: {//开始时间
                    disabledDate: (time)=> {
                        if(this.searchData.time_end){
                            return time.getTime() > new Date(this.searchData.time_end).getTime();
                        }else{
                            return time.getTime()>Date.now();
                        }
                    }
                },
                inputTimeEnd: {//结束时间
                    disabledDate: (time)=> {
                        if (this.searchData.time_start) {
                            return time.getTime() < new Date(this.searchData.time_start).getTime()-24*60*60*1000|| time.getTime() > Date.now();
                        } else {
                            return time.getTime() > Date.now();
                        }
                    }
                },
            }
        },
        computed: {},
        filters: {},
        mounted() {
        },
        methods: {
            search(){
                this.$emit('search')
            },
            fixAccount(res){
                return res.account
            }
        },
        watch: {

        },
        props: {
            searchData:{
                type:Object,
            }
        },
        components: {
            labelItem:require('@/components/label-item.vue').default,
            searchCard:require('@/components/search-card.vue').default,
            paramAccount:require("@/api-components/param-account.vue").default,
        }
    }
</script>
