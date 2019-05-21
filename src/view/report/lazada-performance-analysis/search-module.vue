<template>
    <div class="p-search-module">
        <search-card :params="searchData" :clears="clears" @search="$listeners['search']">
            <el-row>
                <label-item label="">
                    <label-buttons class="inline" label="" :buttons="buttons" @select="$listeners['change-select']"></label-buttons>
                </label-item>
            </el-row>
            <label-item label="">
                <el-select class="inline width-xs" v-model="searchData.snUser" v-sf.snUser>
                    <el-option v-for="item in staffTypeList"
                               :value="item.value"
                               :label="item.label"
                               :key="item.value"></el-option>
                </el-select>
                <select-account
                        class="width-sm ml-xs"
                        v-model="searchData.snName"
                        type="seller"
                ></select-account>
            </label-item>
            <label-item label="账户：" class="ml-sm">
                <el-input v-model="searchData.account"
                          v-sf.account
                          placeholder="请输入账号"
                          class="inline"
                          @keydown.native.enter="$listeners['search']"></el-input>
            </label-item>
            <label-item label="时间：" class="ml-sm">
                <el-date-picker
                        v-model="searchData.date_from"
                        type="date"
                        placeholder="选择日期"
                        class="inline date"
                        v-sf.date_from
                        :picker-options="pickerStart"></el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                        v-model="searchData.date_to"
                        type="date"
                        placeholder="选择日期"
                        class="inline date mr-sm"
                        v-sf.date_to
                        :picker-options="pickerEnd"></el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>

<style lang="stylus">
    .p-search-module{
        .el-card{
            overflow: inherit;
        }
        .el-radio-button__inner:hover{
            background-color:rgba(230, 230, 230, 1) !important;
        }
        .el-radio-button__orig-radio:checked + .el-radio-button__inner{
            border-color: #C0CCDA !important;
        }
        .el-radio-button__inner{
            padding: 6px 12px;
        }
    }
</style>

<script>
    export default {
        data () {
            return {
                buttons: [
                    {label: '账号业绩报表', value: 1},
                    {label: '站点业绩报表', value: 2}
                ],
                staffTypeList: [
                    {label: '销售员', value: 'seller_id'},
                    {label: '销售组长', value: 'leader_id'}
                ],
                pickerStart: {
                    disabledDate:(time)=>{
                        if(this.searchData.date_to){
                            return time.getTime() > this.searchData.date_to || time.getTime() >= Date.now() - 24*60*60*1000;
                        }else {
                            return time.getTime() > Date.now() - 24*60*60*1000;
                        }
                    }
                },
                pickerEnd: {
                    disabledDate:(time)=>{
                        if(this.searchData.date_from){
                            return time.getTime() < this.searchData.date_from || time.getTime() > Date.now() - 24*60*60*1000;
                        }else {
                            return time.getTime() > Date.now() - 24*60*60*1000;
                        }
                    }
                }
            }
        },
        methods: {

        },
        watch: {

        },
        props: {
            searchData: {
                require: true,
                type: Object
            },
            clears: {
                require: true,
                type: Object
            }
        },
        components: {
            searchCard: require("@/components/search-card.vue").default,
            labelButtons: require('@/components/label-buttons.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            orderInput: require("@/components/order-input.vue").default,
            selectAccount: require('@/api-components/select-account').default,
            integerZeroInput:require('@/components/integer-zero-input').default
        }
    }
</script>