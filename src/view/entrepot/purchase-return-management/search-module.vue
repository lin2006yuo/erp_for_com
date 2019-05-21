<template>
    <div class="p-search-module">
        <search-card :params="searchData" :clears="clears" @search="$listeners['search']">
            <el-row>
                <label-item class="inline">
                    <label-buttons class="inline mr-sm"
                                   label="状态："
                                   :buttons="statusBtn"
                                   @select="$listeners['select-status']"></label-buttons>
                </label-item>
            </el-row>
            <label-item label="">
                <el-select v-model="searchData.snType"
                           class="inline s-width-default"
                           @change="searchData.snText = ''"
                           v-sf.snType>
                    <el-option
                            :key="item.value"
                            v-for="item in searchOptions"
                            :label="item.label"
                            :value="item.value"></el-option>
                </el-select>
                <order-input v-model="searchData.snText"
                             class="ml-xs inline s-width-large"
                             @keydown="$listeners['search']"
                             v-sf.snText
                             placeholder="可批量搜索，Shift+回车换行..."></order-input>
            </label-item>
            <label-item label="" class="ml-sm">
                <el-select v-model="searchData.time_type"
                           class="s-width-default inline"
                           v-sf.time_type>
                    <el-option v-for="(item, index) in timeList"
                               :key="index"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
                <el-date-picker
                        v-model="searchData.create_time_from"
                        type="date"
                        placeholder="选择日期"
                        class="inline date ml-xs"
                        v-sf.create_time_from
                        :picker-options="pickerStart"></el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                        v-model="searchData.create_time_to"
                        type="date"
                        placeholder="选择日期"
                        class="inline date mr-sm"
                        v-sf.create_time_to
                        :picker-options="pickerEnd"></el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>

<style lang="stylus" scoped>
    .p-search-module{
        .el-card{
            overflow: inherit;
        }
    }
</style>

<script>
    export default {
        data () {
            return {
                searchOptions: [
                    {label: '采购单号', value: 'purchase'},
                    {label: '退货单号',value: 'numbers'}
                ],
                timeList: [
                    {label: '生成时间',value: 1},
                    {label: '处理时间', value: 2}
                ],
                pickerStart: {
                    disabledDate:(time)=>{
                        if(this.searchData.create_time_to){
                            return time.getTime() > this.searchData.create_time_to.getTime()
                        }else {
                            return false
                        }
                    }
                },
                pickerEnd: {
                    disabledDate:(time)=>{
                        if(this.searchData.create_time_from){
                            return time.getTime() < this.searchData.create_time_from.getTime()
                        }else {
                            return false
                        }
                    }
                },
            }
        },
        props: {
            searchData: {
                require: true,
                type: Object
            },
            clears: {
                require: true,
                type: Object
            },
            statusBtn: {
                require: true,
                type: Array
            }
        },
        components: {
            searchCard: require("@/components/search-card.vue").default,
            labelButtons: require('@/components/label-buttons.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            orderInput: require("@/components/order-input.vue").default,
        }
    }
</script>