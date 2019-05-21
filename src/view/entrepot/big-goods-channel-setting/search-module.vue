<template>
    <div class="p-search-module">
        <search-card :params="searchData" :clears="clears" @search="$listeners['search']">
            <label-item label="物流商：">
                <el-input v-model="searchData.carrier_name"
                          v-sf.carrier_name
                          placeholder="请输入物流商" class="inline"
                          @keydown.native.enter="$listeners['search']"></el-input>
            </label-item>
            <label-item label="邮寄方式：" class="ml-sm mr-sm">
                <order-input class="width-super"
                             v-sf.shipping_name
                             v-model="searchData.shipping_name"
                             @keydown="$listeners['search']"
                             placeholder="可批量搜索，Shift+回车换行..."></order-input>
            </label-item>
        </search-card>
    </div>
</template>

<style lang="stylus" scoped>
    .p-search-module{
        .el-card{
            overflow inherit
        }
    }
</style>

<script>
    export default {
        data () {
            return {
                shippingList: [],
            }
        },
        methods: {

        },
        props: {
            searchData: {
                require: true,
                type: Object
            },
            clears: {
                require: true,
                type: Object
            }
        },
        components: {
            searchCard: require("@/components/search-card.vue").default,
            labelItem: require('@/components/label-item.vue').default,
            orderInput: require("@/components/order-input.vue").default
        }
    }
</script>