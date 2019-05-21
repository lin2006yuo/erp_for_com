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
                             v-if="searchData.snType === 'sku'"
                             placeholder="可批量搜索，Shift+回车换行..."></order-input>
                <el-input class="ml-xs inline s-width-large"
                          v-model="searchData.snText"
                          v-else
                          @keydown.native="key_word"></el-input>
            </label-item>
            <label-item label="货位：" class="ml-sm">
                <el-input class="inline s-width-large"
                          v-model="searchData.warehouse_cargo_code"
                          placeholder="请输入货位号"
                          @keydown.native="key_word"></el-input>
            </label-item>
            <label-item label="" class="ml-sm">
                <el-select v-model="searchData.operatorType"
                           class="s-width-small inline"
                           v-sf.operatorType>
                    <el-option v-for="(item, index) in operatorOptions"
                               :key="index"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
                <super-select v-model="searchData.operatorId"
                              class="s-width-default ml-xs"
                              :options="staffsList"
                              storageKey="warehouseStaffs"></super-select>
                <!--<param-account-->
                        <!--v-model="searchData.operatorId"-->
                        <!--class="s-width-default ml-xs"-->
                        <!--:param="{data:{content:''}}"-->
                        <!--:fixUrl="true"-->
                        <!--:fixResult="sale_fix_result"-->
                        <!--type="warehouseUser"-->
                        <!--placeholder="请选择/输入..."-->
                        <!--url="get|user/warehouse/staffs"></param-account>-->
            </label-item>
            <label-item label="" class="ml-sm">
                <el-select v-model="searchData.operator_time"
                           class="s-width-default inline"
                           v-sf.operator_time>
                    <el-option v-for="(item, index) in timeList"
                               :key="index"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
                <el-date-picker
                        v-model="searchData.start_time"
                        type="date"
                        placeholder="选择日期"
                        class="inline date ml-xs"
                        v-sf.start_time
                        :picker-options="pickerStart"></el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                        v-model="searchData.end_time"
                        type="date"
                        placeholder="选择日期"
                        class="inline date mr-sm"
                        v-sf.end_time
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
    import {api_get_staffs_list} from '@/api/warehouse-cargo';
    export default {
        data () {
            return {
                searchOptions: [
                    {label: 'SKU',value: 'sku'},
                    {label: '商品名称', value: 'good_name'}
                ],
                operatorOptions: [
                    {label: '创建人',value: 1},
                    {label: '操作人', value: 2},
                    {label: '审核人', value: 3}
                ],
                timeList: [
                    {label: '创建时间',value: 1},
                    {label: '操作时间', value: 2},
                    {label: '审核时间', value: 3}
                ],
                pickerStart: {
                    disabledDate:(time)=>{
                        if(this.searchData.end_time){
                            return time.getTime() > this.searchData.end_time.getTime()
                        }else {
                            return false
                        }
                    }
                },
                pickerEnd: {
                    disabledDate:(time)=>{
                        if(this.searchData.start_time){
                            return time.getTime() < this.searchData.start_time.getTime()
                        }else {
                            return false
                        }
                    }
                },
                staffsList: []
            }
        },
        mounted(){
            this.get_staffs()
        },
        methods: {
            get_staffs(){
                this.$http(api_get_staffs_list).then(res => {
                    this.staffsList = res.map(row => {
                        return {
                            value: row.id,
                            label: row.realname
                        }
                    })
                })
            },
            key_word(val){
                if(val.code === 'Enter'){
                    this.$emit('search')
                }
            },
            sale_fix_result(res){
                return res.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
            },
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
            paramAccount: require('@/api-components/param-account').default,
            orderInput: require("@/components/order-input.vue").default
        }
    }
</script>