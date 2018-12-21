<template>
    <div>
        <search-card :params="searchData" @search="search" :clears="clears" @enter="search">
            <label-item label="采购单号：">
                <el-input v-model="searchData.purchase_order_id" class="enter-result" v-sf.purchase_order_id></el-input>
            </label-item>
            <label-item label="供应商：" class="ml-sm">
                <supplier v-sf.supplier_id class="inline" :place-holder="true"
                          v-model="searchData.supplier_id"></supplier>
            </label-item>
            <label-item label="" class="inline ml-sm">
                <el-select v-sf.snType v-model="snType" class="inline width-xs">
                    <el-option
                            :key="item.value"
                            v-for="item in snTypeList"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-input v-sf.snText placeholder="用%组合模糊查询" v-model="snText" @keyup.enter.native="search" class="inline ml-mini enter-result"></el-input>
            </label-item>
            <label-item label="是否接收：" class="ml-sm mr-sm">
                <el-select v-model="searchData.is_receipt" class="width-mini">
                    <el-option v-for="(item,index) in receiptList"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_warehouse} from '@/api/arrival-parcel'

    export default {
        data() {
            return {
                searchData: {
                    purchase_order_code: '',
                    purchase_order_id: '',
                    supplier_id: '',
                    spu_name: '',
                    sku: '',
                    is_receipt: 1,
                },
                clears: {
                    is_receipt: 1,
                },
                receiptList: [
                    {label: '是', value: 1},
                    {label: '否', value: 0}
                ],
                snType: 'sku',
                snTypeList: [
                    {label: 'SKU', value: 'sku'},
                    {label: '产品名称', value: 'spu_name'}
                ],
                snText: ''
            }
        },
        mounted() {
            this.search();
        },
        methods: {
            search() {
                this.searchData[this.snType] = this.snText;
                Object.keys(this.searchData).forEach(key => {
                    if(typeof this.searchData[key] === 'string') {
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
                this.$emit('init-data', this.searchData);
            },
        },
        components: {
            searchCard: require('@/components/search-card').default,
            labelItem: require('@/components/label-item').default,
            supplier: require('@/api-components/supplier.vue').default,
        }
    }
</script>
