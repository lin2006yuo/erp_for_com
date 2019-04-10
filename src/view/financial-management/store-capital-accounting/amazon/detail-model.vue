<template>
    <page-dialog :title="title" v-model="show" size="large"
                 @open="open" @close="close" :close-on-cilck-modal="false">

        <indent-table
        :has-data="tableData.length>0"
        :first-loading="true"
        :body-height="41"
        :width="headsWidth"
        v-loading="loading"
        element-loading-text="玩命加载中..."
        :heads="heads">
        <tbody>
            <template v-for="(item, i) in tableData">
            <tr 
                v-for="(trs ,index) in item.info"
                @click="row_high_light(i)"
                :class="{active:item.isHighLight}"
            >
                <td :rowspan=" item.info.length" v-if="index===0 && false" width="100">
                <el-checkbox v-model="item.isCheck" @change="changeOne"></el-checkbox>
                </td>



                <!-- 日期范围 -->
                <td :rowspan=" item.info.length" v-if="index===0" width="100">
                <span class="click" @click="item_click(item)">{{item.channel_id}}</span>
                </td>
                <td :rowspan=" item.info.length" v-if="index===0" width="100">
                <span v-copy>{{item.code}}</span>
                </td>


                <!-- 合并的数据 -->
                <td v-copy width="100">{{trs.seller_name}}</td>
                <td>{{trs.warehouse_type}}</td>


                <td :rowspan=" item.info.length" v-if="index===0" width="100">
                <span>{{item.customer_id}}</span>
                </td>


                <td :rowspan=" item.info.length" v-if="index===0" width="100">
                <times :time="item.create_time"></times>
                </td>
                <td :rowspan=" item.info.length" v-if="index===0" width="200">
                    <span v-copy>{{item.name}}</span>
                </td>
                <td :rowspan=" item.info.length" v-if="index===0" width="100">
                    <span v-copy>{{item.name}}</span>
                </td>
                <td :rowspan=" item.info.length" v-if="index===0" width="100">
                    <span v-copy>{{item.name}}</span>
                </td>
                <td :rowspan=" item.info.length" v-if="index===0" width="100">
                    <span v-copy>{{item.name}}</span>
                </td>
                <td :rowspan=" item.info.length" v-if="index===0" width="100">
                    <span v-copy>{{item.name}}</span>
                </td>
                <td :rowspan=" item.info.length" v-if="index===0" width="100">
                    <span v-copy>{{item.name}}</span>
                </td>
                <td :rowspan=" item.info.length" v-if="index===0" width="100">
                    <span v-copy>{{item.name}}</span>
                </td>
                <td :rowspan=" item.info.length" v-if="index===0" width="100">
                    <span v-copy>{{item.name}}</span>
                </td>
                <td :rowspan=" item.info.length" v-if="index===0" width="100">
                    <span v-copy>{{item.name}}</span>
                </td>
                <td :rowspan=" item.info.length" v-if="index===0" width="100">
                    <span v-copy>{{item.name}}</span>
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
                    :page-size="detail_table.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
    </page-dialog>
</template>

<style scoped>

</style>

<script>
    import {api_amazon_details} from '@/api/store-captial-accounting'
    export default {
        data() {
            return {
                show: this.value,
                title: '',
                tableData: [
                    {
                        account_id: 324,
                        account_name: 324,
                        channel_id: 9,
                        channel_name: "shopee",
                        code: "jcmmsg",
                        create_time: 1554865542,
                        customer_id: 292,
                        customer_name: "郑敏",
                        id: 3445,
                        info: [
                            {
                                id: 3445,
                                seller_id: 11,
                                seller_name: "李倩霞",
                                warehouse_type: 0,
                            },
                            {
                                id: 3418,
                                seller_id: 11,
                                seller_name: "李倩霞",
                                warehouse_type: 2,
                            },
                            {
                                id: 3418,
                                seller_id: 11,
                                seller_name: "李倩霞",
                                warehouse_type: 2,
                            }
                        ],
                        name: '占位',
                        name: '占位',
                        name: '占位',
                    },
                    {
                        account_id: 324,
                        account_name: 324,
                        channel_id: 9,
                        channel_name: "shopee",
                        code: "jcmmsg",
                        create_time: 1554865542,
                        customer_id: 292,
                        customer_name: "郑敏",
                        id: 3445,
                        info: [
                            {
                                id: 3445,
                                seller_id: 11,
                                seller_name: "李倩霞",
                                warehouse_type: 0,
                            },
                            {
                                id: 3418,
                                seller_id: 11,
                                seller_name: "李倩霞",
                                warehouse_type: 2,
                            },
                            {
                                id: 3418,
                                seller_id: 11,
                                seller_name: "李倩霞",
                                warehouse_type: 2,
                            }
                        ],
                        name: '占位',
                        name: '占位',
                        name: '占位',
                    }
                ],
                loading: false,
                heads: [
                    {label:'结算周期',size:100 },
                    {label:'账号简称',size:100 },
                    {label:'站点',size:100},
                    {label:'销售员',size:100},
                    {label:'汇率',size:100},

                    {label:'发货类型',size:100},
                    {label:'订单金额￥',size:100},
                    {label:'亚马逊所收税费￥',size:200},
                    {label:'促销返点￥',size:100},
                    {label:'退款合计￥',size:100},

                    {label:'退款比例',size:100},
                    {label:'店铺资金合计￥',size:100},
                    {label:'本期营业利润￥',size:100},
                    {label:'上期预留金额￥',size:100},
                    {label:'末期预留金额￥',size:100},
                    {label:'转账金额￥',size:100},
                    {label:'转账比例',size:100},
                ],
                total: 0,
                searchData: {
                    page: 1,
                    pageSize: 20
                }
            }
        },
        mounted() {
            console.log('mounted')
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
                console.log(11111)
                const data = {...this.searchData, ...this.detailData}
                this.$http(api_amazon_details, data).then(res => {
                    this.total = res.count
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

