<template>
    <search-card @search="search" class="delivery-search-module" :params="searchParams" :clears="clears">
        <el-row>
            <label class="inline" title="请选择仓库"> 仓库：</label>
            <super-select class="inline s-width-default"
                          v-sf.warehouse_id
                          v-model="searchParams.warehouse_id"
                          filterable clearable
                          storageKey="virtual_store"
                          :options="warehouseList">
            </super-select>
            <label class="inline ml-sm" title="请选择供应商"> 供应商：</label>
            <super-select class="inline s-width-default"
                          v-sf.supplier_id
                          v-model="searchParams.supplier_id"
                          storageKey="virtual_supplier_packing"
                          :options="supplierList">
            </super-select>
            <el-select class="ml-sm s-width-small inline"
                       v-sf.orderKey
                       v-model="searchParams.orderKey">
                <el-option :key="order.value"
                           v-for="order in orders"
                           :label="order.label"
                           :value="order.value"
                ></el-option>
            </el-select>
            <order-input v-model="searchParams.orderValue"
                         v-if="searchParams.orderKey==='sku'||searchParams.orderKey==='spu'"
                         class="inline width-super mr-sm"
                         @keydown='search'
                         v-sf.orderValue
                         placeholder="可批量搜索，Shift+回车换行..."></order-input>
            <el-input :placeholder="`请输入${changeLabel}...`"
                      v-else
                      class="inline mr-sm"
                      @keydown.enter.native="search"
                      v-sf.orderValue
                      style="width: 200px;"
                      v-model="searchParams.orderValue"></el-input>
        </el-row>
        <el-row class="mt-mini inline mr-sm">
            <label class="inline" title="请输入到货交期区间">到货交期：</label>
            <ui-limit-number
                v-sf.dds_b
                v-model="searchParams.dds_b"
                @keyup.enter.native="search"
                placeholder="到货最小值"
                :limit="0"
                :min="0"
                class="inline enter-result s-width-small"></ui-limit-number>&nbsp;--
            <ui-limit-number
                v-sf.dds_e
                v-model="searchParams.dds_e"
                placeholder="到货最大值"
                @keyup.enter.native="search"
                :limit="0"
                :min="searchParams.dds_b||0"
                class="inline enter-result s-width-small"></ui-limit-number>
            <label class="inline ml-sm" title="请输入备货天数区间">备货天数：</label>
            <ui-limit-number
                v-sf.sds_b
                v-model="searchParams.sds_b"
                placeholder="备货最小值"
                @keyup.enter.native="search"
                :limit="0"
                :min="0"
                class="inline enter-result s-width-small"></ui-limit-number>&nbsp;--
            <ui-limit-number
                v-sf.sds_e
                v-model="searchParams.sds_e"
                placeholder="备货最大值"
                @keyup.enter.native="search"
                :limit="0"
                :min="searchParams.sds_b||0"
                class="inline enter-result s-width-small"></ui-limit-number>
            <label class="inline ml-sm" title="请输入仓库内耗区间">仓库内耗：</label>
            <ui-limit-number
                v-sf.wif_b
                v-model="searchParams.wif_b"
                placeholder="内耗最小值"
                @keyup.enter.native="search"
                :limit="0"
                :min="0"
                class="inline enter-result s-width-small"></ui-limit-number>&nbsp;--
            <ui-limit-number
                v-sf.wif_e
                v-model="searchParams.wif_e"
                placeholder="内耗最大值"
                @keyup.enter.native="search"
                :limit="0"
                :min="searchParams.wif_b||0"
                class="inline enter-result s-width-small"></ui-limit-number>
            <label class="inline ml-sm" title="请输入安全交期区间">安全交期：</label>
            <ui-limit-number
                v-sf.sd_b
                v-model="searchParams.sd_b"
                placeholder="交期最小值"
                @keyup.enter.native="search"
                :limit="0"
                :min="0"
                class="inline enter-result s-width-small"></ui-limit-number>&nbsp;--
            <ui-limit-number
                v-sf.sd_e
                v-model="searchParams.sd_e"
                placeholder="交期最大值"
                @keyup.enter.native="search"
                :limit="0"
                :min="searchParams.sd_b||0"
                class="inline enter-result s-width-small"></ui-limit-number>
        </el-row>
    </search-card>
</template>
<style lang="stylus">
    .delivery-search-module {

    }
</style>
<script>
    export default {
        name: 'search-module',
        data() {
            return {
                clears: {
                    warehouse_id: '',
                    supplier_id: '',
                    orderKey: 'sku',
                    orderValue: '',
                    dds_b: '',
                    dds_e: '',
                    sds_b: '',
                    sds_e: '',
                    wif_b: '',
                    wif_e: '',
                    sd_b: '',
                    sd_e: ''
                },
                orders: [
                    {label: '商品SKU', value: 'sku'},
                    {label: '商品名称', value: 'name'},
                    {label: '商品SPU', value: 'spu'},
                ]
            }
        },
        methods: {
            search() {
                this.$emit('search');
            }
        },
        computed:{
            changeLabel(){
                let find = this.orders.find(res=>{
                    return res.value === this.searchParams.orderKey;
                });
                if(!!find){
                    return find.label;
                }
            }
        },
        props: {
            searchParams: {
                required: true,
                type: Object
            },
            warehouseList: {
                required: true,
                type: Array
            },
            supplierList: {
                required: true,
                type: Array
            },

        },
        components: {
            orderInput:require("@/components/order-input.vue").default,
            searchCard: require('@/components/search-card').default,
            uiLimitNumber:require('@/components/ui-limit-number').default,
        }
    }
</script>
