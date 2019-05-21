<template>
    <search-card @search="search" :params="searchParams" :clears="clears">
        <div>
            <label-buttons class="ml-sm" label="审核状态：" @select="change_status" :buttons="statusList"
                           v-model="status" title="请选择审核状态"></label-buttons>
        </div>
        <label class="inline ml-sm" title="请选择供应商"> 供应商：</label>
        <super-select class="inline s-width-large"
                      v-sf.supplier_id
                      v-model="searchParams.supplier_id"
                      storageKey="virtual_supplier_packing"
                      :options="supplierList">
        </super-select>
        <el-select v-sf.searchdata v-model="searchParams.searchdata" class="inline s-width-small ml-sm"
                   @change="change_buyer_brand">
            <el-option :key="item.value" v-for="item in buyerBrand" :value="item.value"
                       :label="item.label"></el-option>
        </el-select>
        <super-select class="inline s-width-default"
                      v-show="searchParams.searchdata==='buyer_id'"
                      v-model="searchParams.buyer_id"
                      v-sf.buyer_id
                      storageKey="virtual_staffs"
                      :options="staffsList">
        </super-select>
        <super-select class="inline s-width-default"
                      v-show="searchParams.searchdata==='brand_id'"
                      v-model="searchParams.brand_id"
                      v-sf.brand_id
                      storageKey="virtual_brand"
                      :options="brandList">
        </super-select>
        <el-select v-sf.snType v-model="searchParams.snType" class="ml-sm s-width-small inline">
            <el-option v-for="item in searchList" :key="item.value" :value="item.value"
                       :label="item.label"></el-option>
        </el-select>
        <orderInput class="inline width-super" @keydown='key_down' v-sf.snText
                    placeholder="可批量搜索，Shift+回车换行..."
                    v-model="searchParams.snText"></orderInput>
        <el-select class="ml-sm s-width-small inline" v-model="searchParams.date_s" v-sf.date_s>
            <el-option v-for="item in filTime" :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
        </el-select>
        <el-date-picker
            class="inline date"
            v-model="searchParams.date_b"
            v-sf.date_b
            type="date"
            placeholder="开始时间"
            :picker-options="pickerStart"
        >
        </el-date-picker>&nbsp;--&nbsp;
        <el-date-picker
            class="inline date mr-sm"
            v-sf.date_e
            v-model="searchParams.date_e"
            type="date"
            placeholder="结束时间"
            :picker-options="pickerEnd"
        >
        </el-date-picker>
        <label class="inline ml-sm" title="请输入起订量区间">最小起订量：</label>
        <ui-limit-number
            v-sf.min_qty_b
            v-model="searchParams.min_qty_b"
            placeholder="起订最小值"
            @keyup.enter.native="search"
            :limit="0"
            :min="1"
            class="inline enter-result s-width-mini"></ui-limit-number>&nbsp;--
        <ui-limit-number
            v-sf.min_qty_e
            v-model="searchParams.min_qty_e"
            placeholder="起订最大值"
            @keyup.enter.native="search"
            :limit="0"
            :min="searchParams.min_qty_b||1"
            class="inline enter-result s-width-mini"></ui-limit-number>
    </search-card>
</template>

<script>
    export default {
        name: "search-list",
        data(){
            return {
                clears: {
                    searchdata: "buyer_id",
                    snType: "sku",
                    date_s: 'create_time',
                },
                statusList: [
                    {name: "全部", value: -1},
                    {name: "未审核", value: 0},
                    {name: "审核通过", value: 1},
                    {name: "审核未通过", value: 2}
                ],
                buyerBrand: [
                    {label: "采购员", value: "buyer_id"},
                    {label: "品牌", value: "brand_id"},
                ],
                searchList: [
                    {label: "商品名称", value: "name"},
                    {label: "货品SKU", value: "sku"},
                ],
                filTime: [
                    {label: '创建时间', value: 'create_time'},
                    {label: '审核时间', value: 'audit_time'}
                ],
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.searchParams.date_e) {
                            return time.getTime() > this.searchParams.date_e;
                        } else {
                            return time.getTime() > Date.now();
                        }
                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.searchParams.date_b) {
                            return time.getTime() < this.searchParams.date_b || time.getTime() > Date.now();
                        }
                    }
                },
            }
        },
        methods:{
            search(){
                this.$emit("search")
            },
            key_down(){
                this.$emit("search")
            },
            change_buyer_brand(){
                this.$emit('change-buyer-brand')
            },
            change_status(val){
                this.$emit('change-status',val,this.statusList)
            }
        },
        props:{
            searchParams:{
                required: true,
                type: Object
            },
            status:{
                default:-1,
            },
            supplierList:{
                required: true,
                type: Array
            },
            staffsList:{
                required: true,
                type: Array
            },
            brandList:{
                required: true,
                type: Array
            }
        },
        components:{
            labelButtons:require('@/components/label-buttons').default,
            orderInput: require('@/components/order-input.vue').default,
            uiLimitNumber: require('@/components/ui-limit-number').default,
        }
    }
</script>

