<template>
    <page class="dashboard">
        <el-row>
            <el-col :span="24">
                <permission tag="nearby15" ref="nearby" :route="apis.url_nearby15"></permission>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <permission tag="developTarget"
                            :route="apis.url_develop_monthly_target"></permission>
                <!--改版隐藏 S-->
                <!--<permission tag="orderInfo" :route="apis.url_order_info"></permission>-->
                <!--<permission tag="warehouseInfo" :route="apis.url_warehouse_info"></permission>-->
                <!--<permission tag="listingInfo" :route="apis.url_listing_count"></permission>-->
                <!--改版隐藏 E-->
            </el-col>
            <el-col :span="12">
                <!--<permission tag="accountPerformance" :route="apis.url_account_performance"></permission>-->
                <permission tag="monthlyTarget"
                            :route="apis.url_get_monthly_target"></permission>
                <!--<monthly-target></monthly-target>-->
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
    import {api_permission} from '../api/user';
    import {
        url_nearby15, url_order_info,
        url_warehouse_info, url_listing_count,
        url_account_performance
    } from '../api/dashborad';
    import {url_get_monthly_target,url_develop_monthly_target} from '@/api/monthly-target';
    export default {
        permission: {
            url_nearby15, url_order_info,
            url_warehouse_info, url_listing_count,
            url_account_performance,
            url_get_monthly_target,
            url_develop_monthly_target
        },
        data() {
            return {}
        },
        activated() {
            if (this.$refs.nearby) {
                this.$refs.nearby.init_echats();
            }
        },
        computed: {},
        watch: {},
        methods: {},
        components: {
//            nearby15: require('./dashboard/nearby15.vue').default,
            nearby15: require('./dashboard/nearby15-copy.vue').default,
            orderInfo: require('./dashboard/order-info.vue').default,
            listingInfo: require('./dashboard/listing-info.vue').default,
            warehouseInfo: require('./dashboard/warehouse-info.vue').default,
            accountPerformance: require('./dashboard/account-performance.vue').default,
            monthlyTarget:require('./dashboard/monthly-target.vue').default,
            developTarget:require('./dashboard/develop-target.vue').default,
        }
    }
</script>