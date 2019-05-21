<template>
    <page class="dashboard over-flow-auto">
        <!--<draggable v-model="comData"-->
                   <!--style="height:100%;width:100%"-->
                   <!--:options="{group:'move'}">-->
        <div style="width:100%;height:100%">
            <div style="display:inline-block;width:49.5%;vertical-align:top;"
                 v-for="(item,index) in comData"
                 :key="item.value" :class="[index%2 ===0?'mr-sm':'']">
                <permission :tag="item.tag" :ref="item.ref" :route="apis.url_login"></permission>
            </div>
        </div>
        <!--</draggable>-->
        <target-schedule-dialog   :value="show" @change-show="change_show" ></target-schedule-dialog>
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
    import {api_permission,url_login,api_user_ranking} from '@/api/user';
    import {url_balance_list} from '@/api/balance-data';
    import {
        url_nearby15, url_order_info,
        url_warehouse_info, url_listing_count,
        url_account_performance,
        url_warehouse_package
    } from '@/api/dashborad';
    import {url_get_monthly_target,url_develop_monthly_target} from '@/api/monthly-target';
    export default {
        permission: {
            url_login,
            url_nearby15, url_order_info,
            url_warehouse_info, url_listing_count,
            url_account_performance,
            url_get_monthly_target,
            url_develop_monthly_target,
            url_balance_list,
            url_warehouse_package
        },
        data() {
            return {
                tags:[
                    {name:'1',value:1},
                    {name:'2',value:2},
                    {name:'3',value:3},
                    {name:'4',value:4},
                ],
                permissionData:[
                    {tag:'nearby15',ref:"nearby",apis:url_nearby15},
                    {tag:'balanceIndex',ref:"balanceIndex",apis:url_balance_list},
                    {tag:'developTarget',ref:"developTarget",apis:url_develop_monthly_target},
                    {tag:'monthlyTarget',ref:"monthlyTarget",apis:url_get_monthly_target},
                    {tag:"packageRecord",ref:"packageRecord",apis:url_warehouse_package}
                ],
                show:false,
                tableData:[
                    // {
                    //     department:'亚马逊',
                    //     user_id:'测试人员',
                    //     target_amount:'50000',
                    //     actual_amount:'35000',
                    //     rate:'60%',
                    //     rate_yesterday:'55%',
                    //     ranking:'3',
                    //     ranking_yesterday:'5',
                    //     is_promote:1,
                    //     message:'恭喜你，今天完成了销售目标哦!'
                    // }
                ],

            }
        },
        created(){

        },
        activated() {
            if (this.$refs.nearby) {
                // this.$refs.nearby.init_echats();
            }
        },
        mounted(){
            // this.get_user_ranking();
        },
        methods:{
            change_show(val){
                this.show = val;
            }
        },
        computed:{
            comData:{
                get(){
                    return this.permissionData.filter(row=>{
                        return  this.$hasPermission(row.apis)
                    })
                },
                set(val){
                    this.permissionData = val;
                }
            },
        },
        components: {
            nearby15: require('./nearby15-copy.vue').default,
            orderInfo: require('./order-info.vue').default,
            listingInfo: require('./listing-info.vue').default,
            warehouseInfo: require('./warehouse-info.vue').default,
            accountPerformance: require('./account-performance.vue').default,
            monthlyTarget:require('./monthly-target.vue').default,
            developTarget:require('./develop-target.vue').default,
            balanceIndex:require('./balance-index').default,
            packageRecord:require("./package-record.vue").default,
            targetScheduleDialog:require('./target-schedule-dialog').default,
        }
    }
</script>
