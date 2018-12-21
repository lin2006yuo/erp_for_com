<template>
    <div>
        <search-card :params="searchData" @search="search" :clears="clears" @enter="search">
            <label-item label="采购单号：">
                <el-input v-model="searchData.purchase_order_id" class="enter-result" v-sf.purchase_order_id></el-input>
            </label-item>
            <label-item label="供应商：" class="ml-sm">
                <supplier v-sf.supplier_id class="inline" :place-holder="true" v-model="searchData.supplier_id"></supplier>
            </label-item>
            <label-item label="产品名称：" class="ml-sm mr-sm">
                <el-input v-model="searchData.spu_name" class="enter-result" v-sf.spu_name></el-input>
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
                searchData:{
                    purchase_order_id:'',
                    supplier_id:'',
                    spu_name:'',
                    is_receipt:0,
                },
                clears:{
                    is_receipt:0,
                },
            }
        },
        mounted(){
            this.search();
        },
        methods: {
            search(){
                Object.keys(this.searchData).forEach(key=>{
                    if(typeof this.searchData[key] === 'string'){
                        this.searchData[key] = this.searchData[key].trim();
                    }
                });
                this.$emit('init-data', this.searchData);
            },
        },
        watch: {},
        props: {},
        components: {
            searchCard:require('@/components/search-card').default,
            labelItem:require('@/components/label-item').default,
            supplier:require('@/api-components/supplier.vue').default,
        }
    }
</script>
