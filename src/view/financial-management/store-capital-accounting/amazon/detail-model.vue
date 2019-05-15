<template>
    <page-dialog :title="title" v-model="show" size="large"
                    width="1668.4px"
                 @open="open" @close="close" :close-on-cilck-modal="false">

        <indent-table
            :has-data="true"
            :first-loading="true"
            :body-height="41"
            :width="headsWidth"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            :heads="heads"
        >
        {{this.tableData.length && this.tableData[0].account_id}}
        <tbody slot="body">
            <template v-for="(item, i) in tableData">
                <tr 
                    v-for="(trs ,index) in item.summary_detail"
                    :key="`boby-${i}-${index}`"
                >
                        <td 
                            v-if="head.tear || index===0"
                            :rowspan="!head.tear && item.summary_detail && item.summary_detail.length" 
                            :class="{yellow: head.tear && index === 0}"
                            v-for="(head,h_index) in heads" :key="`head-${h_index}`"
                            :width="head.size"
                        >
                            <el-checkbox v-if="head.isCheck" v-model="item.isCheck" @change="changeOne"></el-checkbox>
                            <span v-else-if="head.tear">{{trs[head.value]}}</span>
                            <span v-else @click="item_click(item, h_index)" :class="{click: h_index === 1}">{{item[head.value]}}</span>
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
    const data = require('./detail.json')
    export default {
        data() {
            return {
                show: this.value,
                title: '',
                tableData:[],
                loading: false,
                heads: [
                    {label:'结算周期',size:100, value: 'settlement_start_time'},
                    {label:'账号简称',size:80, value: 'account_name'},
                    {label:'站点',size:60, value: 'site'},
                    {label:'销售员',size:60, value: 'seller_name'},
                    {label:'汇率',size:60, value: 'to_usd_rate'},

                    {label:'发货类型',size:80, value: 'shipping_type', tear: true},
                    {label:'订单金额￥',size:135, value: 'payment_amount', tear: true},
                    {label:'亚马逊所收税费￥',size:135, value: 'fee_amount', tear: true},
                    {label:'促销返点￥',size:135, value: 'promotion_return_amount', tear: true},
                    {label:'退款合计￥',size:135, value: 'refund_amount', tear: true},

                    {label:'退款比例',size:80, value: 'refund_rate'},
                    {label:'店铺资金合计￥',size:100, value: 'other_fee_amount_rmb'},
                    {label:'本期营业利润￥',size:100, value: 'turnover_rmb'},
                    {label:'上期预留金额￥',size:100, value: 'previous_reserve_amount_rmb'},
                    {label:'末期预留金额￥',size:100, value: 'current_reserve_amount_rmb'},
                    {label:'转账金额￥',size:100, value: 'total_amount_rmb'},
                    {label:'转账比例',size:80, value: 'total_amount_rate'},
                ],
                data:data,
                total: 0,
                searchData: {
                    page: 1,
                    pageSize: 20
                }
            }
        },
        mounted() {
            // this.tableData = data.data
            this.render()
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


            //我的
            init() {
                const data = {...this.searchData, ...this.detailData}
                this.tableData = this.data.data
                // this.$http(api_amazon_details, data).then(res => {
                    
                // })
            },
            render(h) {
                console.log(h)
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

