<template>
    <div>
        <search-card :params="searchData" @search="search" :clears="clears" @enter="search">
            <label-item label="采购单号：">
                <el-input v-model="searchData.purchase_order_id" class="enter-result" v-sf.purchase_order_id></el-input>
            </label-item>
            <label-item label="供应商：" class="ml-sm">
                <super-select v-sf.supplier_id class="inline"
                              :options="suppliers"
                              storage-key="suppliers"
                              v-model="searchData.supplier_id"></super-select>
                <!--<supplier v-sf.supplier_id class="inline" :place-holder="true" v-model="searchData.supplier_id"></supplier>-->
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
    import {api_pack_getSupplier} from '@/api/pack';

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
                suppliers: [],
            }
        },
        mounted(){
            this.search();
            this.init_suppliers();
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
            init_suppliers() {
                this.$http(api_pack_getSupplier).then(res=>{
                    res.unshift({
                        company_name: '全部',
                        id: ''
                    });
                    this.suppliers = res.map(row => {
                        return {
                            label: row.company_name,
                            value: row.id
                        }
                    });
                });
            }
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
