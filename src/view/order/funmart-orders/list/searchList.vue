<template>
    <el-row class="wish-searchList">
        <search-card @search="search_list" :params="searchData" :clears="clears">
            <el-select v-model="searchData.snType"
                       v-sf.snType
                       class="inline" style="width:105px">
                <el-option
                    :key="item.value"
                    v-for="item in numberSelects"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <order-input v-model="searchData.snText"
                         class="inline width-super mr-sm"
                         v-sf.snText
                         @keydown="search_list"
                         placeholder="可批量搜索，Shift+回车换行...">
            </order-input>
            <label>账号简称：</label>
            <el-select class="inline mr-sm input-no-margin"
                       v-sf.account_id
                       v-model="searchData.account_id"
                       filterable clearable>
                <el-option v-for="(item, index) in selectList"
                           :label="item.label"
                           :key="index"
                           :value="item.value"></el-option>
            </el-select>
            <label>付款时间：</label>
            <el-date-picker
                @keyup.enter.native="search_list"
                type="date"
                placeholder="开始时间"
                v-model="searchData.date_b"
                v-sf.date_b
                class="inline"
                :picker-options="pickerOptions"
                style="width:140px">
            </el-date-picker>&nbsp;--
            <el-date-picker type="date"
                            @keyup.enter.native="search_list"
                            placeholder="结束时间"
                            v-model="searchData.date_e"
                            v-sf.date_e
                            :picker-options="pickerOptions1"
                            class="inline mr-sm"
                            style="width:140px">
            </el-date-picker>
        </search-card>
    </el-row>
</template>
<style lang="stylus">
    .wish-searchList {
        .el-card {
            overflow: inherit;
        }
        .input-no-margin .el-select__tags{
            height: 28px!important;
            width: 225px;
            overflow-y: auto;
            >span{
                white-space: inherit;
            }
        }
        .input-no-margin .el-select__input {
            width: 1px !important;
            margin-left: 0 !important;
        }
    }
</style>
<script>
    import labelButtons from '@/components/label-buttons';
    import {api_daraz_account_site} from '../../../../api/order_daraz'

    export default {
        data() {
            return {
                isBatch: false,
                numberSelects: [
                    {label: "订单号", value: "order_id"},
                    {label: "目的地", value: "country"},
                    {label: "平台sku", value: "sku"}
                ],
                siteSelects: [],
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
        mounted() {
        },
        methods: {
            changeSelect(select,item) {
                this.$emit('select',item)
            },
            search_list() {
                this.$emit('search_list')
            },
        },
        props: {
            searchData: {
                required: true,
                type: Object
            },
            clears: {
                required: true,
                type: Object
            },
            selectList:{
                required:true,
                type:Array
            }
        },
        components: {
            labelButtons,
            searchCard: require('../../../../components/search-card.vue').default,
            orderInput: require('../../../../components/order-input.vue').default,
        }
    }
</script>
