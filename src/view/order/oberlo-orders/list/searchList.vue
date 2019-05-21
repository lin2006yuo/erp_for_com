<template>
    <el-row class="wish-searchList">
        <search-card @search="search_list" :params="searchData" :clears="clears">
            <el-row>
                <label-buttons label="订单状态："
                               v-sf.status
                               :buttons="buttons"
                               @select="changeSelect"></label-buttons>
            </el-row>
            <el-select v-model="searchData.snType"
                       v-sf.snType
                       class="inline" style="width:105px">
                <el-option
                    :key="item.value"
                    v-for="item in selectList1"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <order-input v-model="searchData.snText"
                         class="inline width-super mr-sm"
                         v-sf.snText
                         @keydown="search_list"
                         placeholder="可批量搜索，Shift+回车换行..."></order-input>
            <label>账号简称：</label>
            <el-select v-model="searchData.account_id"
                       v-sf.account_id clearable
                       class="inline mr-sm"
                       style="width: 115px;" filterable>
                <el-option
                    :key="item.value"
                    v-for="item in selectList"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <label>下单时间：</label>
            <el-date-picker
                @keyup.enter.native="search_list"
                type="date"
                placeholder="开始时间"
                v-model="searchData.date_b"
                v-sf.date_b
                class="inline"
                :picker-options="pickerOptions"
                style="width:140px"></el-date-picker>&nbsp;--
            <el-date-picker type="date"
                            @keyup.enter.native="search_list"
                            placeholder="结束时间"
                            v-model="searchData.date_e"
                            v-sf.date_e
                            :picker-options="pickerOptions1"
                            class="inline mr-sm"
                            style="width:140px"></el-date-picker>
        </search-card>
    </el-row>
</template>
<style lang="stylus">
    .wish-searchList {
        .el-card {
            overflow: inherit;
        }
    }
</style>
<script>
    import labelButtons from '@/components/label-buttons';
    export default {
        data() {
            return {
                isBatch: false,
                selectList1: [
                    {id: 1, label: "订单号", value: "order_id"},
                    {id: 5, label: "目的地", value: "target"},
                    {id: 6, label: "追踪号", value: "tracking"},
                    {id: 7, label: "ItemId", value: "itemid"},
                    {id: 8, label: "平台sku", value: "sku"}
                ],
                pickerOptions: {
                    disabledDate: (time) => {
                        return time.getTime() > new Date()
                    }
                },
                pickerOptions1: {
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
            buttons: {
                required: true,
                type: Array
            },
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
