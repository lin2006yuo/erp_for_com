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
                @selection-change="handle_selection_change">
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
                                class="operate" @click="look(row,'look_order')"
                                :route="apis.url_paypal_dispute_details"
                                :title="row.local_order_id === '0' ? '没有订单号，无法查看' : row.order_number"
                                :disabled="row.local_order_id === '0'">
                        {{row.local_order_id !== '0' ? row.order_number : '--'}}
                    </permission>
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
                    <span v-if="row.status !== 1">已响应</span>
                    <span v-if="row.status === 1&&(row.seller_response_due_date*1000<new Date().getTime())" style="color:red">已超时</span>
                    <times :time="row.seller_response_due_date" v-if="row.status === 1&&(row.seller_response_due_date*1000>new Date().getTime())"></times>
                </div>
            </el-table-column>

            <el-table-column label="操作" inline-template>
                <div>
                    <permission tag="ElButton"
                                type="text"
                                :route="apis.url_paypal_dispute_details"
                                class="operate"
                                @click="look(row,'look')">查看</permission>
                    <template v-if="row.status === 1">
                        <permission tag="span" :route="apis.url_paypal_dispute_details">|</permission>
                        <permission tag="ElButton"
                                    type="text"
                                    :route="apis.url_paypal_dispute_details"
                                    class="operate"
                                    @click="look(row,'edit')">处理</permission>
                    </template>
                    <!--<template v-if="searchData.type === 2&&row.aftersale_id !== 0">-->
                        <!--|-->
                        <!--<permission tag="ElButton"-->
                                    <!--type="text"-->
                                    <!--:route="apis.url_look_over"-->
                                    <!--class="operate"-->
                                    <!--@click="look_after_sale(row)">查看售后-->
                        <!--</permission>-->
                    <!--</template>-->
                </div>
            </el-table-column>

        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="searchData.pageize"S
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </div>
</template>

<style lang="stylus" scoped>

</style>

<script>
    import {
        url_paypal_dispute_details
    } from "@/api/paypal-dispute"
    import {
        url_look_over
    } from '@/api/after-sale';
    export default {
        permission: {
            url_paypal_dispute_details,
            url_look_over
        },
        data () {
            return {

            }
        },
        methods:{
            //点击订单号查看、查看、处理
            look(row,type){
                this.$emit('look',row,type)
            },
            //查看售后
            look_after_sale(row){
                this.$emit('look-after-sale',row)
            },
            handle_size_change(val){//----切换条数
                this.$emit('handle-size-change',val)
            },
            handle_current_change(val){//----切换页数
                this.$emit('handle-current-change',val)
            },
            handle_selection_change(val) {
                this.$emit('handle-selection-change',val)
            },
            //排序
            sort_click(val) {
                this.$emit("sort-click", val);
            },
        },
        computed:{
            emptyText(){
                return this.firstLoading?'等待查询数据中...':'暂无数据'
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