<template>
    <div class="p-paypal-table-module">
        <el-table
                class="mt-xs scroll-bar"
                v-resize="{height:41}"
                :data="tableData"
                border
                highlight-current-row
                v-loading="loading"
                element-loading-text="拼命加载中"
                @sort-change="sort_click"
                @selection-change="$listeners['handle-selection-change']">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{ emptyText }}
            </div>
            <el-table-column
                    type="selection"
                    width="50">
            </el-table-column>

            <el-table-column label="纠纷ID" inline-template>
                <div>
                    <ui-tip :content="row.dispute_id" :width="98"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="订单号" inline-template>
                <div>
                    <permission tag="span" type="text"
                                class="operate"
                                @click="look(row,'look_order')"
                                :route="apis.url_paypal_dispute_details"
                                :title="row.order_number"
                                v-if="row.local_order_id !== '0'">
                        {{row.order_number}}
                    </permission>
                    <span v-else>{{row.order_number}}</span>
                </div>
            </el-table-column>

            <el-table-column label="买家姓名" inline-template>
                <div>
                    <ui-tip :content="row.buyer_name" :width="98"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="金额总计" inline-template>
                <div>
                    <ui-tip :content="`${row.gross_amount}${row.currency}`" :width="98"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="原因" inline-template>
                <div>
                    <ui-tip :content="row.reason" :width="98"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column label="发起时间" width="150" inline-template>
                <times :time="row.dispute_create_time"></times>
            </el-table-column>

            <el-table-column inline-template label="更新时间" width="150">
                <times :time="row.update_time"></times>
            </el-table-column>

            <el-table-column label="纠纷状态" inline-template>
                <div>
                    <ui-tip :content="row.status" :width="98"></ui-tip>
                </div>
            </el-table-column>

            <el-table-column inline-template label="预计调解日期" width="150" sortable="custom" prop="seller_response_due_date">
                <div>
                    <times :time="row.seller_response_due_date"></times>
                </div>
            </el-table-column>

            <el-table-column label="操作" inline-template>
                <div>
                    <permission tag="ElButton"
                                type="text"
                                :route="apis.url_paypal_dispute_details"
                                class="operate"
                                @click="look(row,'look')">查看</permission>
                    <template v-if="row.status !== 'RESOLVED'">
                        <permission tag="span" :route="apis.url_paypal_dispute_details">|</permission>
                        <permission tag="ElButton"
                                    type="text"
                                    :route="apis.url_paypal_dispute_details"
                                    class="operate"
                                    @click="look(row,'edit')">处理</permission>
                    </template>
                    <template v-if="row.status !== 'RESOLVED'">
                        <permission tag="span" :route="apis.url_paypal_dispute_update">|</permission>
                        <permission tag="ElButton"
                                    type="text"
                                    :route="apis.url_paypal_dispute_update"
                                    class="operate"
                                    @click="update(row)">更新</permission>
                    </template>
                </div>
            </el-table-column>

        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="$listeners['handle-size-change']"
                @current-change="$listeners['handle-current-change']"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </div>
</template>

<style lang="stylus" scoped>

</style>

<script>
    import {
        url_paypal_dispute_update,
        url_paypal_dispute_details
    } from "@/api/paypal-dispute"
    export default {
        permission: {
            url_paypal_dispute_details,
            url_paypal_dispute_update
        },
        methods:{
            //点击订单号查看、查看、处理
            look(row,type){
                this.$emit('look',row,type)
            },
            //更新
            update(row){
                this.$emit('update',row)
            },
            //排序
            sort_click(val) {
                this.$emit("sort-click", val);
            },
        },
        computed:{
            emptyText(){
                return this.firstLoading ? '等待查询数据中...' : '暂无数据'
            }
        },
        props: {
            tableData: {
                type: Array
            },
            loading: {
                required: true,
                type: Boolean
            },
            firstLoading: {
                required: true,
                type: Boolean
            },
            searchData: {
                type: Object
            },
            total: {
                type: Number
            },
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default
        }
    }
</script>