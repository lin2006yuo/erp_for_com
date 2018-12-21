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
                    v-for="item in numberSelects"
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
                       v-sf.account_id
                       clearable
                       class="inline mr-sm"
                       style="width: 115px;" filterable>
                <el-option
                    :key="item.value"
                    v-for="item in selectList"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <label>站点：</label>
            <el-select v-model="searchData.site"
                       clearable
                       v-sf.account_id
                       class="inline mr-sm"
                       style="width: 115px;" filterable>
                <el-option
                    :key="item.value"
                    v-for="item in siteSelects"
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
    import {api_lazada_account_site} from '../../../../api/order_lazada'

    export default {
        data() {
            return {
                isBatch: false,
                numberSelects: [
                    {label: "订单号", value: "order_id"},
                    {label: "目的地", value: "target"},
                    {label: "追踪号", value: "tracking"},
                    {label: "ItemId", value: "itemid"},
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
            this.get_site_list();
        },
        methods: {
            get_site_list() {
                this.$http(api_lazada_account_site).then(res => {
                    res.forEach(row => {
                        this.siteSelects.push({label: row.name, value: row.county_id});
                    });
                    this.siteSelects.unshift({label: '全部', value: ''})
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'})
                });
            },
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
