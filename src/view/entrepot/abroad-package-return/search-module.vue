<template>
    <search-card class="mb-xs abroad-package-return-card" @search="search" :params="searchData" :clears="clears">
        <el-row>
            <label-item label="发货仓库：" class="mr-sm">
                <select-account class="width-sm" type="warehouse" v-model="searchData.warehouse_id"/>
            </label-item>
            <label-buttons
                label="退回类型："
                class="inline"
                @select="change_reason"
                :buttons="buttons">
            </label-buttons>
        </el-row>
        <el-row class="mt-xs mb-xs">
            <label-item label="平台：" class="mr-sm">
                <select-account class="width-sm" type="platform" v-model="searchData.channel_id"/>
            </label-item>
            <label-item label="站点：" class="mr-sm">
                <select-account 
                    ref="siteAccount" 
                    class="width-sm" 
                    type="site" 
                    v-model="searchData.site_code"
                    :param="{channel_id: searchData.channel_id}"/>
            </label-item>
            <label-item label="账号简称：" class="mr-sm">
                <select-account 
                    ref="Account" 
                    class="width-sm" 
                    type="account"
                    v-model="searchData.account_id"
                    :param="{channel_id: searchData.channel_id, site_code: searchData.site_code}"/>
            </label-item>
            <!-- 包裹号 -->
            <label-item label="" class="mr-sm">
                <el-select class="width-sm mr-xs" v-model="searchData.snType">
                        <el-option 
                            v-for="(item, index) in selectItems" 
                            :key="`select-${index}`"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                </el-select>
                <sntext-input v-model="searchData.snText"/>
            </label-item>
            <label-item label="运输方式：" class="mr-sm">
                <cascader-select
                    :warehouseId="searchData.warehouse_id"
                    v-model="searchData.shipping"
                    type="shipping"
                    valueType="array"
                />
            </label-item>
            <label-item label="SKU：" class="mr-sm">
                <sntext-input v-model="searchData.skus"/>
            </label-item>
        </el-row>
        <label-item label="创建时间：">
            <timespan type="all" :from.sync="searchData.date_b" :to.sync="searchData.date_e"></timespan>
        </label-item>
    </search-card>
</template>
<script>
    import {api_overseas_package_return, api_overseas_package_return_types,
            api_overseas_package_return_id, api_overseas_package_return_export} from '@/api/overseas-package-return'
export default {
    data() {
        return {
            clears: {
                skus: '',
                reason: '',
                warehouse_id: '',
                channel_id: '',
                site_code: '',
                account_id: '',
                shipping: '',
                snType: '',
                snText: '',
                shipping: '',
                snUser: '',
                snTextUser: '',
                snDate: '',
                date_b: '',
                date_e: '',
            },
            buttons: [
                {label: '全部', value: 1}, 
                {label: "服务商退件", value: 2},
                {label: "客户退件", value: 3},
                {label: "未预报退件", value: 4}
            ],
            selectItems: [
                {label: '退回单号', value: 'return_order_number'},
                {label: '跟踪号', value: 'shipping_number'},
                {label: '包裹号', value: 'package_number'},
            ]
        }
    },
    mounted() {
        this.get_buttons()
    },
    methods: {
        search() {},
        change_reason() {},
        get_buttons() {
            this.$http(api_overseas_package_return_types).then(res => {
                this.buttons = res
            })
        }
    },
    watch: {
        'searchData.channel_id'(val) {
            this.$nextTick(() => {        //注意：必须在nextTick中调用，防止视图未更新，调用api传入的参数仍为上次未修改的参数
                this.$refs.siteAccount.get_list()
                this.$refs.Account.get_list()
            })
        },
        'searchData.site_code'(val) {
            this.$nextTick(() => {        //注意：必须在nextTick中调用，防止视图未更新，调用api传入的参数仍为上次未修改的参数
                this.$refs.Account.get_list()
            })
        },
    },
    props: ['searchData'],
    components: {
        labelItem: require('@/components/label-item').default,
        labelButtons: require('@/components/label-all-buttons.vue').default,
        searchCard: require('@/components/search-card.vue').default,
        selectAccount: require('@/api-components/select-account').default,
        sntextInput: require('@/components/sntext-input.vue').default,
        timespan: require('@/components/timespan.vue').default,
        cascaderSelect: require('@/api-components/cascader-select.vue').default,
    },
}
</script>
<style lang="stylus">
.abroad-package-return-card {
    overflow: visible;
}

</style>
