<template>
    <div class="p-search-module">
        <search-card :params="searchData" :clears="clears" @search="search" @enter="search">
            <el-row class="mb-xs">
                <label-buttons class="inline mr-sm" label="纠纷状态：" :buttons="statusBtn" @select="select_status"></label-buttons>
            </el-row>
            <label-item label="" class="inline">
                <el-select v-model="searchData.snType" class="inline s-width-default"  v-sf.snType>
                    <el-option
                            :key="item.value"
                            v-for="item in searchOptions"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-input class="inline ml-xs s-width-large" v-model="searchData.snText" :placeholder="`请输入${changeLabel}...`" v-sf.snText></el-input>
            </label-item>
            <label-item label="发起原因：" class="inline ml-sm">
                <el-select v-model="searchData.reason" class="inline s-width-default">
                    <el-option
                            :key="item.value"
                            v-for="item in reasonOptions"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="发起日期：" class="inline ml-sm mr-sm">
                <el-date-picker
                        type="date"
                        placeholder="开始时间"
                        v-model="searchData.startDate"
                        :picker-options="pickerstart"
                        class="inline date"
                        v-sf.startDate></el-date-picker>
                <span>&nbsp;--&nbsp;</span>
                <el-date-picker
                        type="date"
                        placeholder="结束时间"
                        v-model="searchData.endDate"
                        :picker-options="pickerend"
                        class="inline date"
                        v-sf.endDate></el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>

<style lang="stylus" scoped>

</style>

<script>
    export default {
        data () {
            return {
                searchOptions: [//搜索类型数据
                    {label: '纠纷ID', value: 'dispute_id'},
                    {label: '交易ID', value: 'transaction_id'},
                    {label: '订单号', value: 'order_number'},
                    {label: '买家姓名', value: 'buyer_name'},
                    {label: '商家账号', value: 'paypal_account'}
                ],
                reasonOptions: [//发起原因
                    {label: '全部', value: ''},
                    {label: '未收到物品', value: 1},
                    {label: '物品与说明不符', value: 2},
                    {label: '未授权交易', value: 3},
                    {label: '未经授权的存取活动', value: 11},
                    {label: '已取消订单仍被收取费用', value: 9},
                    {label: '重复付款', value: 5}
                ],
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.startDate){
                            return  time.getTime() > this.searchData.endDate
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.startDate){
                            return time.getTime() < this.searchData.startDate
                        }else {
                            return false
                        }
                    }
                },
            }
        },
        mounted(){

        },
        methods: {
            search(){
                this.$emit('search')
            },

            //切换纠纷状态
            select_status(index){
                this.$emit('select-status',this.statusBtn[index].value)
            },
        },
        computed: {
            changeLabel(){
                let find = this.searchOptions.find(res=>{
                    return this.searchData.snType === res.value && this.searchData.snType !=='';
                });
                if(!!find){
                    return find.label;
                }else{
                    return ''
                }
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
            searchCard:require("@/components/search-card.vue").default,
            labelButtons:require('@/components/label-all-buttons.vue').default,
            labelItem:require('@/components/label-item.vue').default,
        }
    }
</script>