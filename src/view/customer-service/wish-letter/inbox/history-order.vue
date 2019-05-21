<template>
<div class="history">
    <div class="mt-sm mb-sm">历史订单及当前交易(绿色三角标志)</div>
    <ui-table  class="manager"
        :body-height="20"
        :has-data="tableData.length>0"
        :heads="heads">
        <tbody >
        <template v-for="(data, index) in tableData">
            <tr class="line" :class="[data.show ? 'active' : '',data.heighLight?'active-color':'']"
                :key="data.id"
                @click="()=> {$emit('addClass',data)}">
                <td class="t-left">
                    <plus-minus @show-detail="()=>{$emit('show_detail',data,index)}" :show="data.show" :title="tipTitle"></plus-minus>
                    <ui-tip :content="data.order_number" :width="50" @cur-click="()=>{$emit('lookOver',data)}" class="operate"></ui-tip>
                </td>
                <td>
                    {{data.country_code}}
                </td>
                <td >
                    {{data.currency_code}}{{parseFloat(data.order_amount).toFixed(2)}}
                </td>
                <td>
                    {{data.status}}
                </td>
                <td>
                    <ui-tip :content="data.feedback"></ui-tip>
                </td>
                                <td>
                    <span v-if="!data.dispute.id">{{data.dispute.case_id}}</span>
                    <permission v-else tag="ElButton" type="text" :route="apis.url_message_replay"
                                class="operate"
                                @click="()=>{$emit('handle',data,'dispute')}">{{data.dispute.case_id}}
                    </permission>
                </td>
                <td>
                    <span v-if="!data.request.id">{{data.request.request_id}}</span>
                    <permission v-else tag="ElButton" type="text" :route="apis.url_message_replay"
                                class="operate"
                                @click="()=>{$emit('handle',data,'request')}">{{data.request.request_id}}
                    </permission>
                </td>
            </tr>
            <template v-if="data.show">
                <template v-if="data.skuList&&data.skuList.length">
                    <tr class="subset_of_tags" style="font-weight:bold;" >
                        <td>付款日期</td>
                        <td>发货日期</td>
                        <td>追踪号</td>
                        <td>物流商</td>
                        <td>SKU</td>
                        <td>数量</td>
                        <td>预计到达时间</td>
                    </tr>
                    <tr class="subset_of_tags"
                        v-for="item in data.skuList">
                        <td>
                            <el-popover placement="bottom"
                                        trigger="hover"
                                            open-delay="500">
                                <span >{{item.pay_time|fmsdatetime}}</span>
                                <span slot="reference">{{(item.pay_time*1000)|fymd}}</span>
                            </el-popover>
                        </td>
                                        <td>
                            <el-popover placement="bottom"
                                        trigger="hover"
                                        :open-delay="500">
                                <span >{{item.shipping_time|fmsdatetime}}</span>
                                <span slot="reference">{{(item.shipping_time*1000)|fymd}}</span>
                            </el-popover>
                        </td>
                        <td>
                            <ui-tip :content="item.shipping_number" :width="98"></ui-tip>
                        </td>
                        <td>
                            <ui-tip :content="item.shipping_name" :width="98"></ui-tip>
                        </td>
                        <td >
                            <ui-tip :content="item.sku" :width="98"></ui-tip>
                        </td>
                        <td>
                            {{item.sku_quantity}}
                        </td>
                        <td>
                            {{item.arrival_time}}
                        </td>
                    </tr>
                </template>
                <template v-if="!data.skuList||!data.skuList.length">
                    <tr>
                        <td :colspan="heads.length" style=" text-align: center">
                            暂无详情
                        </td>
                    </tr>
                </template>
            </template>
        </template>
        </tbody>
    </ui-table>
</div>
</template>
<script>
export default {
    data () {
        return {}
    },
    props: {
        heads: {},
        tableData: {}
    }
}
</script>
<style lang="stylus" scoped>
    .history {
            .el-table__body-wrapper {
                min-height: 130px;
            }
            .ui-table-body {
                height: 142px !important;
            }
        }
</style>


