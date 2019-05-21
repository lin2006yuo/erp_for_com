<template>
    <page class="dashboard over-flow-auto">
        <el-row :gutter="8">
            <el-col :span="12">
                <permission tag="nearby15" ref="nearby" :route="apis.url_nearby15"></permission>
            </el-col>
            <el-col :span="12">
                <permission tag="balanceIndex" :route="apis.url_balance_list"></permission>
            </el-col>
        </el-row>
        <el-row :gutter="8">
            <el-col :span="12">
                <permission tag="developTarget"
                            :route="apis.url_develop_monthly_target"></permission>
            </el-col>
            <el-col :span="12">
                <permission tag="monthlyTarget"
                            :route="apis.url_get_monthly_target"></permission>
            </el-col>
        </el-row>
    </page>
</template>
<style lang="stylus">
    #rule {
        visibility: hidden;
        white-space: nowrap;
        font-size: 24px;
    }
    .dashboard .form-item {
        * {
            font-size: 14px !important;
        }
    }
</style>
<script>
    import {api_permission,url_login} from '../api/user';
    import {url_balance_list} from '@/api/balance-data';
    import {
        url_nearby15, url_order_info,
        url_warehouse_info, url_listing_count,
        url_account_performance
    } from '../api/dashborad';
    import {url_get_monthly_target,url_develop_monthly_target} from '@/api/monthly-target';
    export default {
        permission: {
            url_login,
            url_nearby15, url_order_info,
            url_warehouse_info, url_listing_count,
            url_account_performance,
            url_get_monthly_target,
            url_develop_monthly_target,
            url_balance_list
        },
        data() {
            return {
                tags:[
                    {name:'1',value:1},
                    {name:'2',value:2},
                    {name:'3',value:3},
                    {name:'4',value:4},
                ]
            }
        },
        activated() {
            if (this.$refs.nearby) {
                this.$refs.nearby.init_echats();
            }
        },
        components: {
            nearby15: require('./dashboard/nearby15-copy.vue').default,
            orderInfo: require('./dashboard/order-info.vue').default,
            listingInfo: require('./dashboard/listing-info.vue').default,
            warehouseInfo: require('./dashboard/warehouse-info.vue').default,
            accountPerformance: require('./dashboard/account-performance.vue').default,
            monthlyTarget:require('./dashboard/monthly-target.vue').default,
            developTarget:require('./dashboard/develop-target.vue').default,
            balanceIndex:require('./dashboard/balance-index').default,
        }
    }
</script>
