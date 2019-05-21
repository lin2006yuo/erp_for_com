<template>
    <indent-table
      :has-data="tableData.length>0"
      v-model="checkAll"
      :first-loading="true"
      @check="changeAll"
      :body-height="41"
      :width="headsWidth"
      v-loading="loading"
      class="table-list-amazon-finance"
      element-loading-text="玩命加载中..."
      :heads="heads">
        <!-- 表头扩展 -->
        <tr
            slot="header"
            v-for="(trs ,index) in sum.summary_detail"
            :key="`trs-header-${index}`"
            :class="{sum: !sum.settlement_start_time}"
        >

            <td
                v-if="head.tear || index===0"
                :rowspan="!head.tear && sum.summary_detail.length"
                v-for="(head,h_index) in heads" :key="`head-header-${h_index}`"
                :width="head.size"
            >
                <span v-if="head.isCheck"></span>
                <span v-else-if="head.tear">
                        {{head.handle ? head.handle(trs[head.value]) : trs[head.value]}}
                    </span>
                <span v-else>
                        {{head.handle ? head.handle(sum[head.value]) : sum[head.value]}}
                    </span>
            </td>


        </tr>
        <!-- 表体 -->
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
                        <span v-else-if="head.tear">
                            {{head.handle ? head.handle(trs[head.value]) : trs[head.value]}}
                        </span>
                        <span v-else @click="item_click(item, h_index)" :class="{click: h_index === 1}">
                            {{head.handle ? head.handle(item[head.value]) : item[head.value]}}
                        </span>
                    </td>
                </tr>
            </template>
        </tbody>
    </indent-table>
</template>
<style scoped lang="stylus">
    .active{
      background-color: rgba(173,227,255, 0.5);
    }
    .click {
        color: #3cb5fc;
        cursor: pointer;
    }
    .sum {
        background-color: #eff2f7
    }
    .yellow {
        background-color: #ffffcc
    }
    .table-list-amazon-finance {
        >>> .ui-table-head {
            box-shadow: 0 1px 4px 0 #eaeaea;
        }
    }
</style>
<script>

    export default {
        data() {
            return {
                checkAll: false,
                /**
                 isCheck: 是否多选
                 label:   列名
                 value:   列value
                 size:    列宽
                 tear:    如果是小单元格，tear为true，否则不填
                 handle:  value处理函数，回调参数为该单元格的值
                 */
                heads: [
                    {isCheck:true,size:50},
                    {label:'日期范围',size:130,value: 'settlement_start_time'},
                    {label:'账号简称',size:130,value: 'account_name'},
                    {label:'站点',size:130,value: 'site'},
                    {label:'销售员',size:130,value: 'seller_name'},
                    {label:'部门管理',size:130,value: 'department_name'},
                    {label:'发货类型',size:130,value: 'shipping_type', tear:true},
                    {label:'订单金额￥',size:140,value: 'payment_amount', tear:true},
                    {label:'亚马逊所收税费￥',size:140,value: 'fee_amount', tear:true},
                    {label:'促销返点总计￥',size:140,value: 'promotion_return_amount', tear:true},
                    {label:'退款合计￥',size:130,value: 'refund_amount', tear:true},

                    {label:'退款比例',size:130,value: 'refund_rate', handle: (rate) => (`${rate}%`)},
                    {label:'店铺资金合计￥',size:130,value: 'other_fee_amount_rmb'},
                    {label:'营业利润￥',size:130,value: 'turnover'},
                    {label:'首期预留金额￥',size:130,value: 'previous_reserve_amount_rmb'},
                    {label:'末期预留金额￥',size:130,value: 'current_reserve_amount_rmb'},
                    {label:'转账金额B￥',size:130,value: 'total_amount_rmb'},
                    {label:'转账比例',size:130,value: 'total_amount_rate', handle: (rate) => (`${rate}%`)},
                ],
            }
        },
        computed:{
            emptyText() {
                return this.firstTime?'等待查询数据中...':'暂无数据'
            },
            headsWidth() {
                return this.heads.reduce((total, cur) => {
                    return total + cur.size
                },0)
            }
        },
        filters:{
            fdatetime(val) {
                return datef("YYYY-MM-dd ", val)
            },
            tofixed(num) {
                // if(typeof num !== 'number') {
                //     num = Number(num) 
                // }
                return num
            }
        },
        methods: {
            changeAll(val) {
                this.tableData.forEach(row=>{
                    // row.isCheck=val;
                    this.$set(row, 'isCheck', val)
                })
                this.$emit('select-change', this.selectData())
            },
            changeOne(){
                if(this.tableData.length>0){
                    this.checkAll=!this.tableData.find(data=>!data.isCheck);
                }
                this.$emit('select-change', this.selectData())
            },
            row_high_light(index){
                this.tableData.forEach(row=>{
                    row.isHighLight = false;
                });
                this.tableData[index].isHighLight = true;
            },
            selectData() {
                return this.tableData.filter(i => i.isCheck)
            },
            item_click(item) {
                this.$emit('item-click',item)
            }
        },
        props:{
            loading:{},
            firstTime:{},
            tableData:{
                default: () => []
            },
            sum: {
                default: () => {}
            }
        },
        components: {
            indentTable: require('./indent-table').default
        }
    }
</script>

