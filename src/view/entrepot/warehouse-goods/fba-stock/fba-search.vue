<template>
    <div class="inline">
        <label-item label="库存状态：" class="inline">
            <el-select v-sf.status v-model="params.status" class="inline width-xs">
                <el-option
                        :key="item.value"
                        v-for="item in repertoryLists"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="分配状态：" class="inline ml-sm">
            <el-select v-sf.can_allot v-model="params.can_allot" class="inline width-xs">
                <el-option
                    :key="item.value"
                    v-for="item in allotLists"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </label-item>

        <label-item label="" class="inline ml-sm">
            <el-select v-sf.snType v-model="params.snType" class="inline width-sm">
                <el-option
                :key="item.value"
                v-for="item in typeList"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
                <order-input v-if="params.snType==='sku'" v-sf.snText
                v-model="params.snText"
                class="inline width-super ml-mini reset-padding"
                placeholder="换行输入数据，可进行批量搜索">
                </order-input>
            <el-input v-else v-sf.snText v-model="params.snText" @keyup.enter.native="search" class="inline ml-mini enter-result"></el-input>
        </label-item>
        <label-item label="库存数量：" class="inline ml-sm">
            <el-input v-sf.start_quantity type="number" @keyup.enter.native="search" v-model="params.start_quantity" class="width-xs inline enter-result"></el-input><span>~</span>
            <el-input v-sf.end_quantity type="number" @keyup.enter.native="search" v-model="params.end_quantity" class="width-xs inline enter-result"></el-input>
        </label-item>
        <label-item label="库龄（天）：" class="inline ml-sm">
            <el-input v-sf.start_age type="number" @keyup.enter.native="search" v-model="params.start_age" class="width-xs inline enter-result"></el-input><span>~</span>
            <el-input v-sf.end_age type="number" @keyup.enter.native="search" v-model="params.end_age" class="width-xs inline mr-sm enter-result"></el-input>
        </label-item>
    </div>
</template>
<style lang="stylus" scoped>

</style>
<script>

    export default {
        data() {
            return {
                params:this.value,
                repertoryLists:[
                    {label:'全部',value:''},
                    {label:'正常',value:1},
                    {label:'低库存',value:2},
                ],
                allotLists:[
                    {label:'全部',value:0},
                    {label:'可分配',value:1},
                    {label:'不可分配',value:2},
                ],
                typeList:[
                    {label:'SKU',value:'sku'},
                    {label:'商品名称',value:'goods_name'},
                ],
            }
        },
        mounted() {
        },
        methods: {
            search(){

            },
        },
        watch: {
            params(val){this.$emit('input',val)},
            value(val){this.params = val;},
        },
        props: {
            value:{
                type:Object,
            }
        },
        components: {
            orderInput:require("@/components/order-input.vue").default,
            labelItem:require('@/components/label-item.vue').default,
        }
    }
</script>
