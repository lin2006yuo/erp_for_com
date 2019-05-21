<template>
    <page-dialog :title="title" v-model="show" size="full"
                 @open="open" @close="close" :close-on-cilck-modal="false">

        <indent-table
            :has-data="true"
            :first-loading="true"
            :body-height="120"
            :width="headsWidth"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            :heads="heads"
        >
            <!--由于结算周期列单元格需要两个数据，不封装-->
        <tbody slot="body">
            <template v-for="(item, i) in tableData">
            <tr 
                v-for="(trs ,index) in item.summary_detail"
                @click="row_high_light(i)"
                :class="{active:item.isHighLight}"
            >
                <td :rowspan=" item.summary_detail.length" v-if="index===0 && false" width="100">
                <el-checkbox v-model="item.isCheck" @change="changeOne"></el-checkbox>
                </td>



                <!-- 结算周期 -->
                <td :rowspan=" item.summary_detail.length" v-if="index===0" width="100">
                <span class="click" @click="item_click(item)">{{item.settlement_start_time | fdatetime}}<br/>{{item.settlement_end_time | fdatetime}}</span>
                </td>
                <!-- 账号简称 -->
                <td :rowspan=" item.summary_detail.length" v-if="index===0" width="80">
                    <span v-copy>{{item.account_name}}</span>
                </td>
                <!-- 站点 -->
                <td :rowspan=" item.summary_detail.length" v-if="index===0" width="60">
                    <span>{{item.site}}</span>
                </td>
                <!-- 销售员 -->
                <td :rowspan=" item.summary_detail.length" v-if="index===0" width="60">
                    <span>{{item.seller_name}}</span>
                </td>
                <!-- 汇率-->
                <td :rowspan=" item.summary_detail.length" v-if="index===0" width="60">
                    <span>{{item.to_usd_rate}}</span>
                </td>

                <!-- 合并的数据 -->
                    <!-- 发货类型 -->
                <td v-copy width="80" :class="{yellow: index === 0}">{{trs.shipping_type}}</td>
                    <!-- 订单金额￥ -->
                <td width="135" :class="{yellow: index === 0}">{{trs.payment_amount}}</td>
                    <!-- 亚马逊所收税费￥ -->
                <td width="135" :class="{yellow: index === 0}">{{trs.fee_amount}}</td>
                    <!-- 促销返点￥ -->
                <td width="135" :class="{yellow: index === 0}">{{trs.promotion_return_amount}}</td>
                    <!-- 退款合计￥ -->
                <td width="135" :class="{yellow: index === 0}">{{trs.refund_amount}}</td>

                <!-- 退款比例 -->
                <td :rowspan=" item.summary_detail.length" v-if="index===0" width="80">
                    <span>{{item.refund_rate}}%</span>
                </td>

                <!-- 店铺资金合计 -->
                <td :rowspan=" item.summary_detail.length" v-if="index===0" width="100">
                    <span>{{item.other_fee_amount_rmb}}</span>
                </td>

                <!-- 本期营业利润￥ -->
                <td :rowspan=" item.summary_detail.length" v-if="index===0" width="100">
                    <span v-copy>{{item.turnover_rmb}}</span>
                </td>
                <!-- 上期预留金额￥ -->
                <td :rowspan=" item.summary_detail.length" v-if="index===0" width="100">
                    <span v-copy>{{item.previous_reserve_amount_rmb}}</span>
                </td>
                <!-- 本期预留金额￥ -->
                <td :rowspan=" item.summary_detail.length" v-if="index===0" width="100">
                    <span v-copy>{{item.current_reserve_amount_rmb}}</span>
                </td>
                <!-- 转账金额￥ -->
                <td :rowspan=" item.summary_detail.length" v-if="index===0" width="100">
                    <span v-copy>{{item.total_amount_rmb}}</span>
                </td>
                <!-- 转账比例 -->
                <td :rowspan=" item.summary_detail.length" v-if="index===0" width="80">
                    <span v-copy>{{item.total_amount_rate}}%</span>
                </td>





            </tr>
            </template>
        </tbody>
        </indent-table>
        <div slot="footer">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="searchData.page"
                    :page-sizes="[20,50,100,200,500]"
                    :page-size="searchData.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
    </page-dialog>
</template>

<style scoped>
    .yellow {
        background-color: #ffffcc
    }
</style>

<script>
    import {api_amazon_details} from '@/api/store-captial-accounting'
    export default {
        data() {
            return {
                show: this.value,
                title: '',
                tableData: [],
                loading: false,
                heads: [
                    {label:'结算周期',size:100 },
                    {label:'账号简称',size:80 },
                    {label:'站点',size:60},
                    {label:'销售员',size:60},
                    {label:'汇率',size:60},

                    {label:'发货类型',size:80},
                    {label:'订单金额￥',size:135},
                    {label:'亚马逊所收税费￥',size:135},
                    {label:'促销返点￥',size:135},
                    {label:'退款合计￥',size:135},

                    {label:'退款比例',size:80},
                    {label:'店铺资金合计￥',size:100},
                    {label:'本期营业利润￥',size:100},
                    {label:'上期预留金额￥',size:100},
                    {label:'末期预留金额￥',size:100},
                    {label:'转账金额￥',size:100},
                    {label:'转账比例',size:80},
                ],
                total: 0,
                searchData: {
                    page: 1,
                    pageSize: 20
                },
            }
        },
        methods: {
            open() {},
            close(){},
            handleSizeChange(val){
                this.searchData.pageSize = val
                this.init()
            },
            handleCurrentChange(val){
                this.searchData.page = val
                this.init()
            },

            init() {
                const data = {...this.searchData, ...this.detailData}
                this.$http(api_amazon_details, data).then(res => {
                    this.total = res.count
                    this.tableData = res.data
                })
            }
        },
        filters:{
            fdatetime(val) {
                return datef("YYYY-MM-dd ", val)
            }
        },
        computed:{
            emptyText() {
                return this.firstTime?'等待请求数据中...':'暂无数据'
            },
            headsWidth() {
                return this.heads.reduce((total, cur) => {
                    return total + cur.size
                },0)
            }
        },
        watch:{
            value(val){
                this.show = val
            },
            show(val){
                this.$emit('input',val)
            },
            'detailData.account_id'() {
                this.init()
                this.title = this.detailData.title
            }
        },
        props:{
            value:{},
            firstTime:{},
            detail_table:{},
            detailData: {},
        },
        components:{
            pageDialog:require('@/components/page-dialog').default,
            indentTable: require('./indent-table').default
        }
    }
</script>

