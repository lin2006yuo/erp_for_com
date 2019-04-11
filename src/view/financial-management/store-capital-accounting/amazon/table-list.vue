<template>
    <indent-table
      :has-data="tableData.length>0"
      v-model="checkAll"
      :first-loading="true"
      @check="changeAll"
      :width="headsWidth"
      v-loading="loading"
      element-loading-text="玩命加载中..."
      :heads="heads">
          <tr 
            slot="header"
            v-for="(trs ,index) in sum.summary_detail"
            style="width: 1800px"
            :class="{active:sum.isHighLight, sum: !sum.settlement_start_time}"
          >
            <td :rowspan=" sum.summary_detail.length" v-if="index===0 && true" width="50">
              <el-checkbox v-model="sum.isCheck" @change="changeOne" v-if="false"></el-checkbox>
            </td>
                <!-- 日期范围 -->
                <td :rowspan=" sum.summary_detail.length" v-if="index===0" width="100">
                    <span class="click" @click="sum_click(sum)">{{sum.settlement_start_time}}</span>
                </td>
                <!-- 账号简称 -->
                <td :rowspan=" sum.summary_detail.length" v-if="index===0" width="80">
                    <span v-copy>{{sum.account_name}}</span>
                </td>
                <!-- 站点 -->
                <td :rowspan=" sum.summary_detail.length" v-if="index===0" width="80">
                    <span>{{sum.site}}</span>
                </td>
                <!-- 销售员 -->
                <td :rowspan=" sum.summary_detail.length" v-if="index===0" width="80">
                    <span>{{sum.seller_name}}</span>
                </td>

                <!-- 合并的数据 -->
                    <!-- 发货类型 -->
                <td v-copy width="100">{{trs.shipping_type}}</td>
                    <!-- 订单金额 -->
                <td width="140">{{trs.payment_amount}}</td>
                    <!-- 亚马逊所收税费 -->
                <td width="140">{{trs.fee_amount | tofixed}}</td>
                    <!-- 促销返点总合计 -->
                <td width="140">{{trs.promotion_return_amount | tofixed}}</td>
                    <!-- 退款合计 -->
                <td width="140">{{trs.refund_amount | tofixed}}</td>

                <!-- 退款比例 -->
                <td :rowspan=" sum.summary_detail.length" v-if="index===0" width="80">
                    <span>{{sum.refund_rate}}</span>
                </td>

                <!-- 店铺资金合计 @TODO-->
                <td :rowspan=" sum.summary_detail.length" v-if="index===0" width="100">
                    <times :time="sum.other_fee_amount"></times>
                </td>

                <!-- 营业利润 -->
                <td :rowspan=" sum.summary_detail.length" v-if="index===0" width="100">
                    <span v-copy>{{sum.turnover | tofixed}}</span>
                </td>
                <!-- 首期预留金额 -->
                <td :rowspan=" sum.summary_detail.length" v-if="index===0" width="100">
                    <span v-copy>{{sum.previous_reserve_amount | tofixed}}</span>
                </td>
                <!-- 末期预留金额 -->
                <td :rowspan=" sum.summary_detail.length" v-if="index===0" width="100">
                    <span v-copy>{{sum.current_reserve_amount | tofixed}}</span>
                </td>
                <!-- 转账金额B -->
                <td :rowspan=" sum.summary_detail.length" v-if="index===0" width="100">
                    <span v-copy>{{sum.total_amount | tofixed}}</span>
                </td>
                <!-- 转账比例 -->
                <td :rowspan=" sum.summary_detail.length" v-if="index===0" width="80">
                    <span v-copy>{{sum.total_amount_rate}}</span>
                </td>
          </tr>
      <tbody slot="body">
        <template v-for="(item, i) in tableData">
          <tr 
            v-for="(trs ,index) in item.summary_detail"
            
            :class="{active:item.isHighLight, sum: !item.settlement_start_time}"
          >
            <td :rowspan=" item.summary_detail.length" v-if="index===0 && true" width="50">
              <el-checkbox v-model="item.isCheck" @change="changeOne"></el-checkbox>
            </td>



                <!-- 日期范围 -->
                <td :rowspan=" item.summary_detail.length" v-if="index===0" width="100">
                    <span class="click" @click="item_click(item)">{{item.settlement_start_time}}</span>
                </td>
                <!-- 账号简称 -->
                <td :rowspan=" item.summary_detail.length" v-if="index===0" width="80">
                    <span v-copy>{{item.account_name}}</span>
                </td>
                <!-- 站点 -->
                <td :rowspan=" item.summary_detail.length" v-if="index===0" width="80">
                    <span>{{item.site}}</span>
                </td>
                <!-- 销售员 -->
                <td :rowspan=" item.summary_detail.length" v-if="index===0" width="80">
                    <span>{{item.seller_name}}</span>
                </td>

                <!-- 合并的数据 -->
                    <!-- 发货类型 -->
                <td v-copy width="100" :class="{yellow: index === 0}">{{trs.shipping_type}}</td>
                    <!-- 订单金额 -->
                <td width="140" :class="{yellow: index === 0}">{{trs.payment_amount}}</td>
                    <!-- 亚马逊所收税费 -->
                <td width="140" :class="{yellow: index === 0}">{{trs.fee_amount | tofixed}}</td>
                    <!-- 促销返点总合计 -->
                <td width="140" :class="{yellow: index === 0}">{{trs.promotion_return_amount | tofixed}}</td>
                    <!-- 退款合计 -->
                <td width="140" :class="{yellow: index === 0}">{{trs.refund_amount | tofixed}}</td>

                <!-- 退款比例 -->
                <td :rowspan=" item.summary_detail.length" v-if="index===0" width="80">
                    <span>{{item.refund_rate}}%</span>
                </td>

                <!-- 店铺资金合计 @TODO-->
                <td :rowspan=" item.summary_detail.length" v-if="index===0" width="100">
                    <times :time="item.other_fee_amount"></times>
                </td>

                <!-- 营业利润 -->
                <td :rowspan=" item.summary_detail.length" v-if="index===0" width="100">
                    <span v-copy>{{item.turnover | tofixed}}</span>
                </td>
                <!-- 首期预留金额 -->
                <td :rowspan=" item.summary_detail.length" v-if="index===0" width="100">
                    <span v-copy>{{item.previous_reserve_amount | tofixed}}</span>
                </td>
                <!-- 末期预留金额 -->
                <td :rowspan=" item.summary_detail.length" v-if="index===0" width="100">
                    <span v-copy>{{item.current_reserve_amount | tofixed}}</span>
                </td>
                <!-- 转账金额B -->
                <td :rowspan=" item.summary_detail.length" v-if="index===0" width="100">
                    <span v-copy>{{item.total_amount | tofixed}}</span>
                </td>
                <!-- 转账比例 -->
                <td :rowspan=" item.summary_detail.length" v-if="index===0" width="80">
                    <span v-copy>{{item.total_amount_rate}}%</span>
                </td>





          </tr>
        </template>
      </tbody>
    </indent-table>
</template>
<style scoped>
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
</style>
<script>
    export default {
        data() {
            return {
                checkAll: false,
                heads: [
                    {isCheck:true,size:50},
                    {label:'日期范围',size:100},
                    {label:'账号简称',size:80},
                    {label:'站点',size:80},
                    {label:'销售员',size:80},
                    {label:'发货类型',size:100},
                    {label:'订单金额￥',size:140},
                    {label:'亚马逊所收税费￥',size:140},
                    {label:'促销返点总计￥',size:140},
                    {label:'退款合计￥',size:140},
                    {label:'退款比例',size:80},
                    {label:'店铺资金合计￥',size:100},
                    {label:'营业利润￥',size:100},
                    {label:'首期预留金额￥',size:100},
                    {label:'末期预留金额￥',size:100},
                    {label:'转账金额B￥',size:100},
                    {label:'转账比例',size:80},
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

